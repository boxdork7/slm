package plus.ruoyi.common.web.aspect;

import cn.hutool.core.util.ReflectUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.core.annotation.Order;
import plus.ruoyi.common.core.field.FieldAccess;
import plus.ruoyi.common.core.field.FieldClassType;
import plus.ruoyi.common.core.field.FieldPermissionHelper;
import plus.ruoyi.common.core.field.IFieldPermissionService;
import plus.ruoyi.common.core.utils.ServletUtils;
import plus.ruoyi.common.core.utils.SpringUtils;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 字段权限写入拦截切面（出口 C-1：JSON 写入口）
 *
 * <p>拦截 Controller 上带 {@code @RequestBody} 的写请求，把当前用户无权修改的字段
 * （档位不是 {@link FieldAccess#WRITABLE}）在进入业务逻辑前<b>置 null</b>。</p>
 *
 * <p><b>为什么置 null 等于"保持原值"</b>：本项目 MyBatis-Plus 配置了 {@code updateStrategy: NOT_NULL}
 * （见 {@code common-mybatis.yml}），null 字段不参与 UPDATE 语句。因此置 null 后该列保持库中原值，
 * 效果与"查出原值覆盖回去"一致，却省掉一次 {@code getById} 查询，也不必猜 BO 的主键字段名
 * （本项目 BO 主键命名不统一：业务表用 {@code id}、{@code sys_user} 用 {@code userId}）。
 * 新增场景下置 null 则走数据库默认值，同样合理——用户本就无权设置该字段。</p>
 *
 * <p><b>为什么是静默重置而不是报错</b>：批量提交时报错会让整个请求失败，重置更符合"看不见就改不动"的直觉。
 * 但静默会造成"改了→提示成功→刷新没变"，用户会当成系统丢数据，因此被拦截的字段名会记入
 * {@link FieldPermissionHelper#addIgnoredField}，由 {@code FieldWriteGuardAdvice} 追加到响应 msg 里告知用户。</p>
 *
 * <p><b>不拦读接口</b>：切点限定在 {@code @RequestBody} 参数上，GET 查询不受影响。
 * Excel 导入走 {@code @RequestPart MultipartFile}，不经此切面，由出口 C-2 在 {@code ExcelUtil} 内收口。</p>
 */
@Slf4j
@Aspect
@Order(FieldWriteGuardAspect.ORDER)
public class FieldWriteGuardAspect {

    /**
     * 早于业务切面执行：值必须在进入 Service 之前就被重置。
     * 取较小的 Order 保证优先级高于默认切面（默认 {@code Ordered.LOWEST_PRECEDENCE}）
     */
    public static final int ORDER = -100;

    /**
     * 类 → 可写入字段清单（非静态非 final），BO 类不会热变，缓存后不再反射
     */
    private static final Map<Class<?>, List<Field>> FIELD_CACHE = new ConcurrentHashMap<>();

    /**
     * 决策服务缺失只告警一次，避免每次写请求刷屏
     */
    private static volatile boolean serviceMissingLogged = false;

    /**
     * 拦截所有带 {@code @RequestBody} 参数的 Controller 方法
     *
     * <p>用 {@code @Before} 而非 {@code @Around}：只需在调用前改写入参对象的字段，
     * 不需要接管方法执行与返回值，{@code @Before} 语义更窄也更不容易出错。</p>
     */
    @Before("@annotation(org.springframework.web.bind.annotation.PostMapping) "
        + "|| @annotation(org.springframework.web.bind.annotation.PutMapping) "
        + "|| @annotation(org.springframework.web.bind.annotation.PatchMapping)")
    public void guard(JoinPoint point) {
        try {
            IFieldPermissionService service = permissionService();
            if (service == null || !service.isEnabled()) {
                return;
            }
            for (Object arg : point.getArgs()) {
                guardArgument(arg, service);
            }
        } catch (Exception e) {
            // 拦截失败不能让业务接口 500；但要 WARN，因为这意味着本次写入未受保护
            log.warn("字段权限：写入拦截执行失败，本次请求未受字段级保护 => {}", e.getMessage());
        }
    }

    /**
     * 处理单个入参：BO 对象本身，或集合 / 数组中的每个元素（批量提交场景）
     */
    private void guardArgument(Object arg, IFieldPermissionService service) {
        if (arg == null) {
            return;
        }
        if (arg instanceof Collection<?> collection) {
            for (Object item : collection) {
                guardBo(item, service);
            }
            return;
        }
        if (arg.getClass().isArray() && !arg.getClass().getComponentType().isPrimitive()) {
            for (Object item : (Object[]) arg) {
                guardBo(item, service);
            }
            return;
        }
        guardBo(arg, service);
    }

    /**
     * 对单个 BO 执行字段重置
     */
    private void guardBo(Object bo, IFieldPermissionService service) {
        if (bo == null) {
            return;
        }
        // 只认标了 @FieldResource(type = BO) 的类；其余（String、基本类型包装、未登记的 BO）直接放行
        String resourceKey = service.resolveResource(bo.getClass(), FieldClassType.BO);
        if (resourceKey == null) {
            return;
        }
        for (Field field : resolveFields(bo.getClass())) {
            FieldAccess decision = service.getDecision(resourceKey, field.getName());
            // 无动态决策（null）或可写 → 放行。只读 / 脱敏 / 隐藏都不允许写入：
            // 脱敏档用户看到的是掩码，若允许提交会把掩码串写进库，比拒绝更糟
            if (decision == null || decision == FieldAccess.WRITABLE) {
                continue;
            }
            Object current = ReflectUtil.getFieldValue(bo, field);
            if (current == null) {
                // 本就没提交该字段，不算越权尝试，也不必提示用户
                continue;
            }
            ReflectUtil.setFieldValue(bo, field, null);
            // 存中文标签而非字段名：这条提示最终要展示给使用者看
            FieldPermissionHelper.addIgnoredField(service.getFieldLabel(resourceKey, field.getName()));
            log.warn("字段权限：用户尝试修改无权字段，已忽略。资源={} 字段={} 档位={} 接口={}",
                resourceKey, field.getName(), decision, requestUri());
        }
    }

    /**
     * 解析并缓存类的可写入字段（跳过静态、final、基本类型）
     *
     * <p>跳过基本类型：无法置 null，且本项目 BO 统一用包装类型。</p>
     */
    private static List<Field> resolveFields(Class<?> clazz) {
        return FIELD_CACHE.computeIfAbsent(clazz, c -> {
            List<Field> fields = new ArrayList<>();
            for (Field f : ReflectUtil.getFields(c)) {
                if (Modifier.isStatic(f.getModifiers()) || Modifier.isFinal(f.getModifiers())
                    || f.getType().isPrimitive()) {
                    continue;
                }
                fields.add(f);
            }
            return fields;
        });
    }

    /**
     * 取当前请求 URI，仅用于告警日志定位；取不到不影响主流程
     */
    private static String requestUri() {
        try {
            HttpServletRequest request = ServletUtils.getRequest();
            return request == null ? "-" : request.getRequestURI();
        } catch (Exception e) {
            return "-";
        }
    }

    /**
     * 取决策服务；未提供实现（如未引入 ruoyi-system）时返回 null，写入口放行
     */
    private static IFieldPermissionService permissionService() {
        try {
            return SpringUtils.getBean(IFieldPermissionService.class);
        } catch (Exception e) {
            if (!serviceMissingLogged) {
                serviceMissingLogged = true;
                log.warn("字段权限：未找到 IFieldPermissionService 实现，写入口不做字段级拦截 => {}", e.getMessage());
            }
            return null;
        }
    }

    /**
     * 仅供单测清理类级缓存
     */
    static void clearCache() {
        FIELD_CACHE.clear();
    }
}