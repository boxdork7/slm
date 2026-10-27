package plus.ruoyi.job.core;

import jakarta.annotation.Resource;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.aop.support.AopUtils;
import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.beans.factory.SmartInitializingSingleton;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ConfigurableApplicationContext;
import plus.ruoyi.common.core.scheduler.JobContext;
import plus.ruoyi.common.core.scheduler.JobHandler;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 执行器注册中心。
 * <p>
 * 应用启动后扫描所有 Spring Bean 上标注了 {@link JobHandler} 的方法，
 * 建立 invokeTarget → (bean, method) 映射，供调度执行时反射调用。
 * 通过读注解识别执行器，业务模块的执行器无需在编译期依赖本调度模块。
 *
 * @author 抓蛙师
 */
@Slf4j
public class JobHandlerRegistry implements SmartInitializingSingleton {

    @Resource
    private ApplicationContext applicationContext;

    /**
     * invokeTarget → 执行器句柄
     */
    private final Map<String, JobHandlerHolder> holderMap = new ConcurrentHashMap<>();

    @Override
    public void afterSingletonsInstantiated() {
        ConfigurableListableBeanFactory beanFactory =
            ((ConfigurableApplicationContext) applicationContext).getBeanFactory();
        String[] beanNames = applicationContext.getBeanDefinitionNames();
        for (String beanName : beanNames) {
            // 跳过懒加载 Bean：本方法在所有单例初始化完成后执行，此时对懒加载 Bean 调 getBean 会强制提前实例化，
            // 既拖慢启动，也让 @Lazy 失去意义（甚至触发本不该在启动期发生的初始化副作用）。
            // 代价是懒加载 Bean 里的 @JobHandler 不会被注册——执行器本就应是随应用常驻的组件，不应声明为懒加载。
            if (isLazyInit(beanFactory, beanName)) {
                continue;
            }
            Object bean;
            try {
                bean = applicationContext.getBean(beanName);
            } catch (Exception e) {
                // 条件缺失等原因导致获取失败时跳过即可
                continue;
            }
            Class<?> targetClass = AopUtils.getTargetClass(bean);
            for (Method method : targetClass.getDeclaredMethods()) {
                JobHandler anno = method.getAnnotation(JobHandler.class);
                if (anno == null) {
                    continue;
                }
                validateSignature(method);
                String name = anno.value();
                if (holderMap.containsKey(name)) {
                    throw new IllegalStateException("重复的 @JobHandler 执行器标识: " + name);
                }
                method.setAccessible(true);
                holderMap.put(name, new JobHandlerHolder(bean, method, anno.desc(), anno.sampleCron()));
                log.info("[job] 注册执行器: {} -> {}#{}", name, targetClass.getSimpleName(), method.getName());
            }
        }
    }

    /**
     * 判断 Bean 是否为懒加载。定义不存在（如运行期动态注册的单例）时按非懒加载处理。
     *
     * @param beanFactory Bean 工厂
     * @param beanName    Bean 名称
     * @return true 表示懒加载
     */
    private boolean isLazyInit(ConfigurableListableBeanFactory beanFactory, String beanName) {
        try {
            return beanFactory.getBeanDefinition(beanName).isLazyInit();
        } catch (NoSuchBeanDefinitionException e) {
            return false;
        }
    }

    /**
     * 校验执行器方法签名：只能是无参，或唯一入参为 {@link JobContext}。
     *
     * @param method 执行器方法
     */
    private void validateSignature(Method method) {
        int count = method.getParameterCount();
        if (count == 0) {
            return;
        }
        if (count == 1 && method.getParameterTypes()[0] == JobContext.class) {
            return;
        }
        throw new IllegalStateException(
            "@JobHandler 方法签名非法: " + method + "，只允许 void m() 或 void m(JobContext ctx)");
    }

    /**
     * 获取执行器句柄。
     *
     * @param invokeTarget 执行器标识
     * @return 句柄，不存在返回 null
     */
    public JobHandlerHolder get(String invokeTarget) {
        return holderMap.get(invokeTarget);
    }

    /**
     * 列出所有已注册执行器（供管理界面「执行器下拉」使用）。
     *
     * @return 执行器元数据列表
     */
    public List<JobHandlerMeta> listAll() {
        List<JobHandlerMeta> list = new ArrayList<>(holderMap.size());
        holderMap.forEach((name, holder) ->
            list.add(new JobHandlerMeta(name, holder.desc(), holder.sampleCron())));
        return list;
    }

    /**
     * 执行器句柄：目标 bean、反射方法、参数个数及元数据。
     */
    public record JobHandlerHolder(Object bean, Method method, String desc, String sampleCron) {

        /**
         * @return 方法参数个数（0 或 1）
         */
        public int parameterCount() {
            return method.getParameterCount();
        }
    }

    /**
     * 执行器元数据（对外暴露，不含 bean/method）。
     */
    @Getter
    public static class JobHandlerMeta {
        private final String name;
        private final String desc;
        private final String sampleCron;

        public JobHandlerMeta(String name, String desc, String sampleCron) {
            this.name = name;
            this.desc = desc;
            this.sampleCron = sampleCron;
        }
    }
}
