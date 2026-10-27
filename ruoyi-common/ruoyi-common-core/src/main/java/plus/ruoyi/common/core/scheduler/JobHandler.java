package plus.ruoyi.common.core.scheduler;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 定时任务执行器注解。
 * <p>
 * 标注在 Spring Bean 的方法上，把该方法登记为一个可被调度中心调用的任务执行器。
 * 方法签名支持两种（二选一）：
 * <ul>
 *     <li>无参：{@code public void xxx()} —— 适合不需要上下文的简单任务</li>
 *     <li>带上下文：{@code public void xxx(JobContext ctx)} —— 需要参数/节点/重试信息时使用</li>
 * </ul>
 * 放在 common-core，任何业务模块依赖 core 即可编写执行器，无需依赖调度模块本身。
 *
 * @author 抓蛙师
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface JobHandler {

    /**
     * 执行器唯一标识，对应 job_info.invoke_target。全局唯一，重复会在启动时报错。
     *
     * @return 执行器标识
     */
    String value();

    /**
     * 中文说明，用于管理界面「执行器下拉」的友好展示（如「取消超时未支付订单」）。
     *
     * @return 说明文案，默认空
     */
    String desc() default "";

    /**
     * 建议的 cron 表达式。新增任务选中该执行器时，前端可自动带出此 cron。
     *
     * @return 建议 cron，默认空
     */
    String sampleCron() default "";
}
