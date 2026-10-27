package plus.ruoyi.common.sensitive.core.handler;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.BeanPropertyWriter;
import lombok.extern.slf4j.Slf4j;
import plus.ruoyi.common.core.field.FieldAccess;
import plus.ruoyi.common.core.field.IFieldPermissionService;
import plus.ruoyi.common.core.utils.SpringUtils;
import plus.ruoyi.common.sensitive.annotation.Sensitive;
import plus.ruoyi.common.sensitive.core.SensitiveStrategy;

/**
 * 字段权限属性写出器
 *
 * <p>包装原始 {@link BeanPropertyWriter}，在写出每个属性前查一次当前用户的档位：</p>
 * <ul>
 *   <li><b>无动态决策</b>（{@code getDecision} 返回 null）→ 原样委派，字段自身的 {@code @Sensitive} / {@code @SerialMap} 照常生效</li>
 *   <li><b>HIDDEN</b> → 对象形态整个属性不写出（连 key 都没有，不是写 null）；数组形态写 null 占位（省略会让后续元素错位）</li>
 *   <li><b>MASKED</b> → String 值按策略打码；非 String 写 null（脱敏器只处理字符串，输出原值等于没脱敏）</li>
 *   <li><b>READONLY / WRITABLE</b> → 明文。若字段带 {@code @Sensitive}，此处<b>覆盖</b>注解直接写原值——
 *       这正是"phone 带 @Sensitive、配置让 HR 看明文"的场景，不覆盖就永远打码</li>
 * </ul>
 *
 * <p>为什么 HIDDEN 不写 null：null 让前端分不清"无权限"与"确实为空"，且仍暴露字段名；
 * {@code @Sensitive} 的 {@code CLEAR_TO_NULL} 早就能做到 null，本机制要补的正是"彻底消失"。</p>
 *
 * <p>与 {@code SerialMapBeanSerializerModifier} 无冲突：后者不包装 writer，只对字段做 {@code assignNullSerializer}，
 * 而本类经拷贝构造保留了 {@code _serializer} / {@code _nullSerializer}，两种注册顺序都安全。</p>
 */
@Slf4j
public class FieldPermissionPropertyWriter extends BeanPropertyWriter {

    /**
     * 决策服务缺失时的容错标记：只告警一次，避免每字段每记录刷屏
     */
    private static volatile boolean serviceMissingLogged = false;

    /**
     * 所属资源标识（来自类上的 {@code @FieldResource}，构造期固定）
     */
    private final transient String resourceKey;

    /**
     * 本属性对应的字段名
     */
    private final transient String fieldName;

    /**
     * {@code @SerialMap(source = "X")} 中的 X：本属性的值派生自字段 X。
     * X 被隐藏时本属性也应隐藏，否则等于开了一条派生泄露通道。无则为 null
     */
    private final transient String sourceField;

    /**
     * 本字段自身的 {@code @Sensitive} 策略，用于：
     * 1) MASKED 档没配 strategy 时回落；2) 判断显式放权是否需要覆盖注解。无注解为 null
     */
    private final transient SensitiveStrategy annotationStrategy;

    /**
     * 本字段是否带 {@code @SerialMap}：带则不做"覆盖注解写原值"，
     * 因为 SerialMap 是展示转换（ID→名称）而非安全控制，绕过它会输出原始 ID，属于改坏不是放权
     */
    private final transient boolean hasSerialMap;

    public FieldPermissionPropertyWriter(BeanPropertyWriter base, String resourceKey,
                                         String sourceField, boolean hasSerialMap) {
        super(base);
        this.resourceKey = resourceKey;
        this.fieldName = base.getName();
        this.sourceField = sourceField;
        this.hasSerialMap = hasSerialMap;
        Sensitive sensitive = base.getAnnotation(Sensitive.class);
        this.annotationStrategy = sensitive == null ? null : sensitive.strategy();
    }

    /**
     * 对象形态写出
     */
    @Override
    public void serializeAsField(Object bean, JsonGenerator gen, SerializerProvider prov) throws Exception {
        IFieldPermissionService service = service();
        if (service == null) {
            super.serializeAsField(bean, gen, prov);
            return;
        }
        // 派生字段联动：源字段被隐藏时，由它派生的本属性也隐藏
        if (isSourceHidden(service)) {
            return;
        }
        FieldAccess decision = service.getDecision(resourceKey, fieldName);
        if (decision == null) {
            // 无动态决策：原样委派，@Sensitive / @SerialMap 照常生效
            super.serializeAsField(bean, gen, prov);
            return;
        }
        switch (decision) {
            case HIDDEN -> {
                // 整个属性不写出：JSON 里没有这个 key
            }
            case MASKED -> writeMasked(bean, gen, service);
            case READONLY, WRITABLE -> {
                if (shouldOverrideAnnotation()) {
                    writePlain(bean, gen, prov);
                } else {
                    super.serializeAsField(bean, gen, prov);
                }
            }
            default -> super.serializeAsField(bean, gen, prov);
        }
    }

    /**
     * 数组形态写出（{@code @JsonFormat(shape = ARRAY)}）
     *
     * <p>此形态下元素靠位置对应，不能省略，否则后续字段全部错位——
     * 因此 HIDDEN / 无法打码的 MASKED 一律写 null 占位。</p>
     */
    @Override
    public void serializeAsElement(Object bean, JsonGenerator gen, SerializerProvider prov) throws Exception {
        IFieldPermissionService service = service();
        if (service == null) {
            super.serializeAsElement(bean, gen, prov);
            return;
        }
        if (isSourceHidden(service)) {
            gen.writeNull();
            return;
        }
        FieldAccess decision = service.getDecision(resourceKey, fieldName);
        if (decision == null) {
            super.serializeAsElement(bean, gen, prov);
            return;
        }
        switch (decision) {
            case HIDDEN -> gen.writeNull();
            case MASKED -> {
                Object value = get(bean);
                if (value instanceof String str) {
                    gen.writeString(mask(str, service));
                } else {
                    gen.writeNull();
                }
            }
            case READONLY, WRITABLE -> {
                if (shouldOverrideAnnotation()) {
                    Object value = get(bean);
                    if (value == null) {
                        gen.writeNull();
                    } else {
                        prov.defaultSerializeValue(value, gen);
                    }
                } else {
                    super.serializeAsElement(bean, gen, prov);
                }
            }
            default -> super.serializeAsElement(bean, gen, prov);
        }
    }

    /**
     * 写打码值：String 走脱敏策略；非 String 写 null
     *
     * <p>非 String 不是"跳过"而是写 null：管理员既然配了脱敏，输出原值就违背意图；
     * 但保留 key 让前端结构稳定（与 HIDDEN 的"整个消失"区分开）。</p>
     */
    private void writeMasked(Object bean, JsonGenerator gen, IFieldPermissionService service) throws Exception {
        Object value = get(bean);
        if (value == null) {
            gen.writeNullField(fieldName);
            return;
        }
        if (value instanceof String str) {
            gen.writeStringField(fieldName, mask(str, service));
        } else {
            gen.writeNullField(fieldName);
        }
    }

    /**
     * 绕过属性自身的序列化器写原值
     *
     * <p>只在"字段带 {@code @Sensitive} 且被显式放权"时调用：属性上挂的 {@code SensitiveHandler}
     * 会无条件打码，不绕过就永远拿不到明文。用 {@code defaultSerializeValue} 按运行时类型找序列化器，
     * 不走属性级序列化器。</p>
     */
    private void writePlain(Object bean, JsonGenerator gen, SerializerProvider prov) throws Exception {
        Object value = get(bean);
        gen.writeFieldName(fieldName);
        if (value == null) {
            prov.defaultSerializeNull(gen);
        } else {
            prov.defaultSerializeValue(value, gen);
        }
    }

    /**
     * 显式放权时是否需要覆盖注解：仅当字段带 {@code @Sensitive} 且不带 {@code @SerialMap}
     */
    private boolean shouldOverrideAnnotation() {
        return annotationStrategy != null && !hasSerialMap;
    }

    /**
     * 源字段是否被隐藏（{@code @SerialMap(source = "X")} 派生联动）
     */
    private boolean isSourceHidden(IFieldPermissionService service) {
        return sourceField != null && service.getDecision(resourceKey, sourceField) == FieldAccess.HIDDEN;
    }

    /**
     * 取脱敏策略：优先配置里指定的，其次字段自身 {@code @Sensitive} 的，最后通用掩码
     */
    private String mask(String raw, IFieldPermissionService service) {
        SensitiveStrategy strategy = null;
        String configured = service.getMaskStrategy(resourceKey, fieldName);
        if (configured != null && !configured.isBlank()) {
            try {
                strategy = SensitiveStrategy.valueOf(configured);
            } catch (IllegalArgumentException e) {
                log.warn("字段权限：资源 {} 字段 {} 配置的脱敏策略 {} 不存在，回落通用掩码", resourceKey, fieldName, configured);
            }
        }
        if (strategy == null) {
            strategy = annotationStrategy != null ? annotationStrategy : SensitiveStrategy.STRING_MASK;
        }
        return strategy.desensitizer().apply(raw);
    }

    /**
     * 取决策服务；未提供实现（如未引入 ruoyi-system）时返回 null，出口原样放行
     */
    private static IFieldPermissionService service() {
        try {
            return SpringUtils.getBean(IFieldPermissionService.class);
        } catch (Exception e) {
            if (!serviceMissingLogged) {
                serviceMissingLogged = true;
                log.warn("字段权限：未找到 IFieldPermissionService 实现，JSON 出口按无动态决策放行 => {}", e.getMessage());
            }
            return null;
        }
    }
}