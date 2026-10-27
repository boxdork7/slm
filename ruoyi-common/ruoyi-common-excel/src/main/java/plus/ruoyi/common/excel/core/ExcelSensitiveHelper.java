package plus.ruoyi.common.excel.core;

import cn.hutool.core.util.ReflectUtil;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import plus.ruoyi.common.core.field.FieldAccess;
import plus.ruoyi.common.core.field.FieldClassType;
import plus.ruoyi.common.core.field.FieldPermissionHelper;
import plus.ruoyi.common.core.field.FieldResource;
import plus.ruoyi.common.core.field.IFieldPermissionService;
import plus.ruoyi.common.core.utils.SpringUtils;
import plus.ruoyi.common.sensitive.annotation.Sensitive;
import plus.ruoyi.common.sensitive.core.SensitiveService;
import plus.ruoyi.common.sensitive.core.SensitiveStrategy;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Excel 导出脱敏与字段权限助手
 *
 * <p>为什么需要它：{@link Sensitive} 通过 Jackson 序列化器实现脱敏，只覆盖 JSON 出口。
 * Excel 导出走 FastExcel 直接反射读取 VO 字段，完全绕过 Jackson，
 * 导致任何有导出权限的人都能把脱敏字段明文拖走。本类把同一套判定语义补到 Excel 出口。</p>
 *
 * <p><b>与 JSON 出口保持一致的决策优先级</b>（同一用户页面看不到的字段，导出也导不出）：</p>
 * <ol>
 *   <li>类未标 {@link FieldResource}（或不是读出口 VO）→ 无动态决策，退回第 3 条</li>
 *   <li>有动态决策：HIDDEN 整列排除（连表头都不留）/ MASKED 打码 / READONLY、WRITABLE 输出明文
 *       （<b>显式放权时覆盖字段自身的 {@code @Sensitive}</b>，否则"让 HR 导出手机号原值"永远做不到）</li>
 *   <li>无动态决策 → 回落字段自身 {@code @Sensitive} + {@link SensitiveService} 判定，与本类最初的行为一致</li>
 * </ol>
 *
 * <p>与 JSON 出口的两点差异，均为载体决定而非语义分歧：</p>
 * <ul>
 *   <li>Excel 的 HIDDEN 是<b>整列消失</b>（JSON 是 key 消失），靠 FastExcel 的 {@code excludeColumnFieldNames}</li>
 *   <li>{@code @SerialMap} 派生联动在此不适用：Excel 走反射读字段、不经 Jackson，派生值根本不会被填充</li>
 * </ul>
 *
 * <p>性能：字段元数据按类缓存；权限判定每次导出每字段只算一次，不进逐行循环。
 * 无任何需处理字段时直接返回原列表，零拷贝。</p>
 */
@Slf4j
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ExcelSensitiveHelper {

    /**
     * 类 → 全部可导出字段（非静态），VO 类不会热变，缓存后不再反射
     */
    private static final Map<Class<?>, List<Field>> FIELD_CACHE = new ConcurrentHashMap<>();

    /**
     * 决策服务缺失只告警一次，避免每次导出刷屏
     */
    private static volatile boolean serviceMissingLogged = false;

    /**
     * 解析导出时需要整列排除的字段名
     *
     * <p>档位为 HIDDEN 的字段整列消失，连表头都不留——这与 JSON 出口"连 key 都没有"是同一语义：
     * 留下空列等于告诉使用者"这里有个字段但不给你看"，仍泄露了字段存在性。</p>
     *
     * @param clazz 导出数据类
     * @return 需排除的字段名集合；无需排除时为空集
     */
    public static Set<String> resolveExcludeFields(Class<?> clazz) {
        String resourceKey = resolveResourceKey(clazz);
        if (resourceKey == null) {
            return Collections.emptySet();
        }
        IFieldPermissionService service = permissionService();
        if (service == null) {
            return Collections.emptySet();
        }
        Set<String> excludes = new HashSet<>();
        for (Field field : resolveFields(clazz)) {
            if (service.getDecision(resourceKey, field.getName()) == FieldAccess.HIDDEN) {
                excludes.add(field.getName());
            }
        }
        return excludes;
    }

    /**
     * 对导出数据按当前登录用户权限执行脱敏
     *
     * <p>不就地修改入参：导出列表可能来自缓存或被调用方复用，就地写入掩码会把脏值污染回去。
     * 命中的行做浅拷贝后改写，未命中时原样返回原列表（不拷贝）。</p>
     *
     * @param list  待导出数据
     * @param clazz 数据类（用于解析注解；list 为空时也需要）
     * @param <T>   数据类型
     * @return 处理后的列表；无需处理时即为入参本身
     */
    public static <T> List<T> maskList(List<T> list, Class<T> clazz) {
        if (list == null || list.isEmpty() || clazz == null) {
            return list;
        }
        List<MaskPlan> plans = buildMaskPlans(clazz);
        if (plans.isEmpty()) {
            return list;
        }
        List<T> result = new ArrayList<>(list.size());
        for (T row : list) {
            if (row == null) {
                result.add(null);
                continue;
            }
            T copy = shallowCopy(row, clazz);
            for (MaskPlan plan : plans) {
                Object value = ReflectUtil.getFieldValue(copy, plan.field);
                if (plan.strategy == null) {
                    // 非 String 字段的脱敏：置空，与 JSON 出口"非 String 的 MASKED 写 null"对齐
                    ReflectUtil.setFieldValue(copy, plan.field, null);
                } else if (value instanceof String str) {
                    // null 值不经过脱敏器，与 Jackson 对 null 走独立序列化器的行为一致
                    ReflectUtil.setFieldValue(copy, plan.field, plan.strategy.desensitizer().apply(str));
                }
            }
            result.add(copy);
        }
        return result;
    }

    /**
     * 导入数据入库前的字段权限拦截（出口 C-2：Excel 写入口）
     *
     * <p><b>为什么必须有它</b>：实测 12 个 Controller 有 {@code importExcel(}，走
     * {@code @RequestPart MultipartFile}，不经 {@code FieldWriteGuardAspect} 的 {@code @RequestBody} 切点。
     * 只做 JSON 写入拦截的话，"页面改不了手机号，但做张 Excel 导进去就能改"——与导出侧漏洞正好镜像。</p>
     *
     * <p>把当前用户无权修改的列<b>置 null</b>：本项目 MyBatis-Plus 配了 {@code updateStrategy: NOT_NULL}，
     * null 字段不进 UPDATE 语句，因此已存在的行保持原值；新增行则走数据库默认值。与出口 C-1 完全同一套语义。</p>
     *
     * <p><b>就地改写而非拷贝</b>（与导出侧 {@link #maskList} 相反）：导入数据是刚从文件解析出的新对象，
     * 没有别处引用，就地改安全；且 {@link ExcelResult} 是只读接口，替换列表需要改接口并波及所有自定义
     * Listener 实现，不划算。</p>
     *
     * @param rows  刚解析出的导入数据
     * @param clazz ImportVo 类
     * @param <T>   数据类型
     * @return 入参本身（就地改写）
     */
    public static <T> List<T> guardImported(List<T> rows, Class<T> clazz) {
        if (rows == null || rows.isEmpty() || clazz == null) {
            return rows;
        }
        try {
            IFieldPermissionService service = permissionService();
            if (service == null || !service.isEnabled()) {
                return rows;
            }
            // 只认标了 @FieldResource(type = IMPORT) 的类
            String resourceKey = service.resolveResource(clazz, FieldClassType.IMPORT);
            if (resourceKey == null) {
                return rows;
            }
            // 判档按字段做一次，不进逐行循环（导入可能上万行）
            List<Field> blocked = new ArrayList<>();
            for (Field field : resolveFields(clazz)) {
                FieldAccess decision = service.getDecision(resourceKey, field.getName());
                // 无决策 / 可写放行；只读、脱敏、隐藏都不允许写入
                // （脱敏档用户看到的是掩码，放行会把掩码串写进库，比拒绝更糟）
                if (decision != null && decision != FieldAccess.WRITABLE) {
                    blocked.add(field);
                }
            }
            if (blocked.isEmpty()) {
                return rows;
            }
            for (T row : rows) {
                if (row == null) {
                    continue;
                }
                for (Field field : blocked) {
                    if (ReflectUtil.getFieldValue(row, field) != null) {
                        ReflectUtil.setFieldValue(row, field, null);
                    }
                }
            }
            // 与 JSON 写入口共用反馈通道，由 FieldWriteGuardAdvice 追加到响应 msg
            for (Field field : blocked) {
                FieldPermissionHelper.addIgnoredField(service.getFieldLabel(resourceKey, field.getName()));
            }
            log.warn("字段权限：Excel 导入包含无权修改的列，已忽略。资源={} 字段={} 行数={}",
                resourceKey, blocked.stream().map(Field::getName).toList(), rows.size());
        } catch (Exception e) {
            // 拦截失败不能让导入接口 500；但要 WARN，因为这意味着本次导入未受保护
            log.warn("字段权限：Excel 导入拦截执行失败，本次导入未受字段级保护 => {}", e.getMessage());
        }
        return rows;
    }

    /**
     * 导入单行的字段权限拦截（供 {@link FieldPermissionExcelListener} 逐行调用）
     *
     * <p>自定义 Listener 常在 {@code invoke()} 里逐行入库（如 {@code SysUserImportListener}），
     * 等 {@code doRead()} 结束再拦已经晚了，必须在每行转发给业务 Listener 之前处理。</p>
     *
     * <p>每行都要重算档位判定，但这些判定全部落在 ThreadLocal 快照上（请求级缓存），
     * 不会产生额外 IO——与 JSON 序列化逐字段判档是同一个量级。</p>
     *
     * @param row   单行数据
     * @param clazz ImportVo 类
     * @return 是否有字段被拦截
     */
    public static <T> boolean guardImportedRow(T row, Class<T> clazz) {
        if (row == null || clazz == null) {
            return false;
        }
        try {
            IFieldPermissionService service = permissionService();
            if (service == null || !service.isEnabled()) {
                return false;
            }
            String resourceKey = service.resolveResource(clazz, FieldClassType.IMPORT);
            if (resourceKey == null) {
                return false;
            }
            boolean blocked = false;
            for (Field field : resolveFields(clazz)) {
                FieldAccess decision = service.getDecision(resourceKey, field.getName());
                if (decision == null || decision == FieldAccess.WRITABLE) {
                    continue;
                }
                if (ReflectUtil.getFieldValue(row, field) == null) {
                    // 本就没填这一列，不算越权尝试
                    continue;
                }
                ReflectUtil.setFieldValue(row, field, null);
                FieldPermissionHelper.addIgnoredField(service.getFieldLabel(resourceKey, field.getName()));
                blocked = true;
            }
            return blocked;
        } catch (Exception e) {
            log.warn("字段权限：Excel 导入单行拦截失败，该行未受字段级保护 => {}", e.getMessage());
            return false;
        }
    }

    /**
     * 计算每个字段的处理方式：每次导出算一次，结果不随行变化
     *
     * <p>不做类级缓存：档位取决于当前登录用户，缓存会让 A 用户的判定结果泄给 B 用户。</p>
     */
    private static List<MaskPlan> buildMaskPlans(Class<?> clazz) {
        String resourceKey = resolveResourceKey(clazz);
        IFieldPermissionService service = resourceKey == null ? null : permissionService();
        List<MaskPlan> plans = new ArrayList<>();

        for (Field field : resolveFields(clazz)) {
            FieldAccess decision = service == null ? null : service.getDecision(resourceKey, field.getName());

            if (decision != null) {
                switch (decision) {
                    case HIDDEN -> {
                        // 已由 resolveExcludeFields 整列排除，不必再改值
                    }
                    case MASKED -> plans.add(maskPlanOf(field, service, resourceKey));
                    case READONLY, WRITABLE -> {
                        // 显式放权：覆盖字段自身的 @Sensitive，输出明文
                    }
                    default -> {
                        // 枚举已穷举，留空分支只为编译完整性
                    }
                }
                continue;
            }

            // 无动态决策 → 回落 @Sensitive 静态兜底（本类最初的行为）
            Sensitive annotation = field.getAnnotation(Sensitive.class);
            if (annotation == null) {
                continue;
            }
            if (!String.class.equals(field.getType())) {
                // 与 SensitiveHandler 一致：注解对非 String 不生效，这里不擅自扩大语义
                log.debug("Excel 导出脱敏：{}.{} 非 String 类型，@Sensitive 不生效", clazz.getSimpleName(), field.getName());
                continue;
            }
            if (shouldMask(annotation)) {
                plans.add(new MaskPlan(field, annotation.strategy()));
            }
        }
        return plans;
    }

    /**
     * 构造 MASKED 档的处理计划
     *
     * <p>策略优先级：配置指定 → 字段自身 {@code @Sensitive} → 通用掩码。
     * 非 String 字段无策略可用，用 {@code null} 策略表示"置空"。</p>
     */
    private static MaskPlan maskPlanOf(Field field, IFieldPermissionService service, String resourceKey) {
        if (!String.class.equals(field.getType())) {
            return new MaskPlan(field, null);
        }
        SensitiveStrategy strategy = null;
        String configured = service.getMaskStrategy(resourceKey, field.getName());
        if (configured != null && !configured.isBlank()) {
            try {
                strategy = SensitiveStrategy.valueOf(configured);
            } catch (IllegalArgumentException e) {
                log.warn("Excel 导出脱敏：资源 {} 字段 {} 配置的策略 {} 不存在，回落通用掩码",
                    resourceKey, field.getName(), configured);
            }
        }
        if (strategy == null) {
            Sensitive annotation = field.getAnnotation(Sensitive.class);
            strategy = annotation != null ? annotation.strategy() : SensitiveStrategy.STRING_MASK;
        }
        return new MaskPlan(field, strategy);
    }

    /**
     * 读类上的 {@link FieldResource} 取资源标识
     *
     * <p>与 JSON 出口一致：读注解而非查库。注解是资源归属的源头（库表只是扫描器镜像），
     * 读它不产生 IO，也没有"序列化早于扫描器完成"的时序风险。只认读出口 VO，
     * BO / ImportVo 属写入口，由写入拦截负责。</p>
     *
     * @return 资源标识；未标注解或非 VO 返回 null
     */
    private static String resolveResourceKey(Class<?> clazz) {
        if (clazz == null) {
            return null;
        }
        FieldResource resource = clazz.getAnnotation(FieldResource.class);
        if (resource == null || resource.type() != FieldClassType.VO) {
            return null;
        }
        String key = resource.value();
        return key == null || key.isBlank() ? null : key;
    }

    /**
     * 判断带 {@code @Sensitive} 的字段当前是否需要脱敏
     *
     * <p>脱敏服务缺失或判定过程抛异常（典型：定时任务里没有 Sa-Token 请求上下文）一律按「需要脱敏」处理——
     * 这是安全修复，不能因为拿不到登录态就放行明文。</p>
     */
    private static boolean shouldMask(Sensitive annotation) {
        try {
            SensitiveService service = SpringUtils.getBean(SensitiveService.class);
            if (service == null) {
                log.warn("Excel 导出脱敏：SensitiveService 不存在，按脱敏处理");
                return true;
            }
            return service.isSensitive(annotation.roleKey(), annotation.perms());
        } catch (Exception e) {
            log.warn("Excel 导出脱敏：判定权限失败，按脱敏处理 => {}", e.getMessage());
            return true;
        }
    }

    /**
     * 取字段权限决策服务；未提供实现（如未引入 ruoyi-system）时返回 null，退回注解兜底
     */
    private static IFieldPermissionService permissionService() {
        try {
            return SpringUtils.getBean(IFieldPermissionService.class);
        } catch (Exception e) {
            if (!serviceMissingLogged) {
                serviceMissingLogged = true;
                log.warn("Excel 导出：未找到 IFieldPermissionService 实现，按 @Sensitive 静态兜底 => {}", e.getMessage());
            }
            return null;
        }
    }

    /**
     * 解析并缓存类的全部可处理字段（非静态、非 final、非 serialVersionUID）
     */
    private static List<Field> resolveFields(Class<?> clazz) {
        return FIELD_CACHE.computeIfAbsent(clazz, c -> {
            List<Field> fields = new ArrayList<>();
            for (Field f : ReflectUtil.getFields(c)) {
                if (Modifier.isStatic(f.getModifiers()) || Modifier.isFinal(f.getModifiers())) {
                    continue;
                }
                if (f.getType().isPrimitive()) {
                    // 基本类型无法置空，且本项目 VO 统一用包装类型；跳过避免 setFieldValue(null) 出错
                    continue;
                }
                fields.add(f);
            }
            return fields;
        });
    }

    /**
     * 同类型浅拷贝：只复制字段引用，不做深拷贝（本类只改写 String 字段与置空，其余引用共享即可）
     */
    private static <T> T shallowCopy(T source, Class<T> clazz) {
        T target = ReflectUtil.newInstanceIfPossible(clazz);
        if (target == null) {
            // 无法实例化（无默认构造）时退化为就地改写，宁可污染引用也不能明文导出
            log.warn("Excel 导出脱敏：{} 无法实例化，退化为就地脱敏", clazz.getSimpleName());
            return source;
        }
        for (Field f : ReflectUtil.getFields(clazz)) {
            if (Modifier.isStatic(f.getModifiers()) || Modifier.isFinal(f.getModifiers())) {
                continue;
            }
            ReflectUtil.setFieldValue(target, f, ReflectUtil.getFieldValue(source, f));
        }
        return target;
    }

    /**
     * 单个字段的处理计划
     *
     * @param field    目标字段
     * @param strategy 脱敏策略；为 null 表示"置空"（非 String 字段的 MASKED）
     */
    private record MaskPlan(Field field, SensitiveStrategy strategy) {
    }

    /**
     * 仅供单测清理类级缓存，避免用例间相互影响
     */
    static void clearCache() {
        FIELD_CACHE.clear();
    }

    /**
     * 仅供单测：暴露带 {@code @Sensitive} 的 String 字段名，验证类型过滤
     */
    static Set<String> sensitiveFieldNames(Class<?> clazz) {
        Set<String> names = new HashSet<>();
        for (Field f : resolveFields(clazz)) {
            if (f.getAnnotation(Sensitive.class) != null && String.class.equals(f.getType())) {
                names.add(f.getName());
            }
        }
        return names;
    }
}