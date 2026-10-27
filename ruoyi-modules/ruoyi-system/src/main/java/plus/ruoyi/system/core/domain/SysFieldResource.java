package plus.ruoyi.system.core.domain;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import plus.ruoyi.common.mybatis.core.domain.BaseEntity;

/**
 * 字段权限资源注册表 sys_field_resource
 *
 * <p>系统级表，无 tenant_id，继承 {@link BaseEntity} 而非 TenantEntity：
 * 「哪个资源存在」是随代码走的结构元数据，与 sys_menu 同性质。
 * 已加入 {@code PlusTenantLineHandler.SYSTEM_EXCLUDE_TABLES}，否则租户拦截器会拼上不存在的 tenant_id 列。</p>
 *
 * <p>由 {@code @FieldResource} 注解启动扫描自动登记；管理端只能改中文名 / 分组 / 排序 / 状态。</p>
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("sys_field_resource")
public class SysFieldResource extends BaseEntity {

    /**
     * 主键（雪花）
     */
    @TableId(value = "id")
    private Long id;

    /**
     * 资源标识，与菜单权限前缀一致（如 system:user）
     */
    private String resourceKey;

    /**
     * 资源名称（扫描时按 resource_key 反查 sys_menu.menu_name 自动填充，可改）
     */
    private String resourceName;

    /**
     * 所属模块分组（如 系统管理 / 基础业务 / 商城管理）
     */
    private String moduleName;

    /**
     * 排序值
     */
    private Integer sortOrder;

    /**
     * 状态（0停用 1正常）
     */
    private String status;

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