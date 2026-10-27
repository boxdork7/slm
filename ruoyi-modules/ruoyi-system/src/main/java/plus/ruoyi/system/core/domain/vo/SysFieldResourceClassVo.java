package plus.ruoyi.system.core.domain.vo;

import io.github.linpeilie.annotations.AutoMapper;
import lombok.Data;
import plus.ruoyi.system.core.domain.SysFieldResourceClass;

import java.io.Serial;
import java.io.Serializable;

/**
 * 字段权限资源类绑定视图对象 sys_field_resource_class
 *
 * <p>只读展示：绑定关系由 {@code @FieldResource} 注解扫描维护。</p>
 */
@Data
@AutoMapper(target = SysFieldResourceClass.class)
public class SysFieldResourceClassVo implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 主键id
     */
    private Long id;

    /**
     * 资源标识
     */
    private String resourceKey;

    /**
     * 类全限定名
     */
    private String className;

    /**
     * 类角色（1读出口VO 2写入口BO 3导入ImportVo）
     */
    private String classType;

    /**
     * 类角色中文说明，前端直接展示，免去再查字典
     */
    private String classTypeLabel;

    /**
     * 类简名，前端默认展示这个（全限定名太长，放 tooltip）
     */
    private String simpleName;
}