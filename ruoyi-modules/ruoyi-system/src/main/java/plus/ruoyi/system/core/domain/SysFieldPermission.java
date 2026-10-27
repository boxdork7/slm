package plus.ruoyi.system.core.domain;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import plus.ruoyi.common.tenant.core.TenantEntity;

/**
 * 字段权限配置表 sys_field_permission
 *
 * <p>租户级表（继承 {@link TenantEntity}）：「谁能看什么」是每个租户自己的授权数据，与表 1 / 表 2 的系统级元数据不同。</p>
 *
 * <p>只存与「注解基线」不同的差异行：无 @Sensitive 的字段基线为可写、有 @Sensitive 的字段基线为脱敏，
 * 与基线相同的档位不落行，表体积可控，存量模块零影响。</p>
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("sys_field_permission")
public class SysFieldPermission extends TenantEntity {

    /**
     * 主键（雪花）
     */
    @TableId(value = "id")
    private Long id;

    /**
     * 授权主体类型（1角色 2部门 3用户），对应 SubjectType.code
     */
    private String subjectType;

    /**
     * 主体ID（角色ID / 部门ID / 用户ID）
     */
    private Long subjectId;

    /**
     * 资源标识（关联 sys_field_resource.resource_key）
     */
    private String resourceKey;

    /**
     * 字段名（VO 属性名，如 idCard）
     */
    private String fieldName;

    /**
     * 访问档位（0隐藏 1脱敏 2只读 3可写），对应 FieldAccess.code
     */
    private String accessType;

    /**
     * 脱敏策略（access_type=1 时生效，取 SensitiveStrategy 枚举名）
     */
    private String strategy;

    /**
     * 部门主体是否含子部门（0否 1是，仅 subject_type=2 生效）
     */
    private String includeSub;

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