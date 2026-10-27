package plus.ruoyi.system.core.domain.vo;

import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * 字段元数据（字段权限配置页的矩阵行）
 *
 * <p>由 {@code FieldMetaResolver} 反射产出，不落库。</p>
 */
@Data
public class FieldMetaVo implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 字段名（VO 属性名，如 idCard），配置表 sys_field_permission.field_name 即此值
     */
    private String fieldName;

    /**
     * 中文标签：取 @ExcelProperty(value)，缺失时回落字段名
     */
    private String label;

    /**
     * Java 类型简名（String / Long / Date …）
     */
    private String javaType;

    /**
     * 是否带 @Sensitive 注解——决定「注解基线」是脱敏还是可写
     */
    private Boolean sensitive;

    /**
     * @Sensitive 的策略枚举名（PHONE / ID_CARD …），无注解为 null
     */
    private String sensitiveStrategy;

    /**
     * 带 @Sensitive 但字段非 String：注解实际不生效，只能靠动态配置兜底，配置页红字提示
     */
    private Boolean annotationUncovered;

    /**
     * 该字段出现在哪些类里（同一资源多个 VO 合并后可能 >1）
     */
    private List<String> sourceClasses = new ArrayList<>();
}