package plus.ruoyi.system.core.domain;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import plus.ruoyi.common.mybatis.core.domain.BaseEntity;

/**
 * 字段权限资源与类绑定表 sys_field_resource_class
 *
 * <p>系统级表，无 tenant_id，继承 {@link BaseEntity}。一个资源对应多个类（sys_user 实测 7 个 VO），
 * 只绑一个 VO 会让走导出 VO 的接口明文外泄。{@code class_name} 唯一：一个类只能归属一个资源。</p>
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("sys_field_resource_class")
public class SysFieldResourceClass extends BaseEntity {

    /**
     * 主键（雪花）
     */
    @TableId(value = "id")
    private Long id;

    /**
     * 资源标识（关联 sys_field_resource.resource_key）
     */
    private String resourceKey;

    /**
     * 类全限定名（VO / BO / ImportVo）
     */
    private String className;

    /**
     * 类角色（1读出口VO 2写入口BO 3导入ImportVo），对应 FieldClassType.code
     */
    private String classType;

    /**
     * 是否由注解扫描自动登记（0手工 1自动）
     */
    private String isAuto;

    /**
     * 备注
     */
    private String remark;

    /**
     * 是否删除（0正常 1已删除）
     */
    @TableLogic
    private String isDeleted;
}