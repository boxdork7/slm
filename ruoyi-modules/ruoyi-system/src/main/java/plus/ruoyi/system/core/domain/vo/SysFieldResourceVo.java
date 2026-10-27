package plus.ruoyi.system.core.domain.vo;

import io.github.linpeilie.annotations.AutoMapper;
import lombok.Data;
import plus.ruoyi.system.core.domain.SysFieldResource;

import java.io.Serial;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * 字段权限资源视图对象 sys_field_resource
 *
 * <p>配置页左树的数据源。类绑定信息（{@link #classes}）只读展示，
 * 由 {@code @FieldResource} 注解扫描维护，管理端不提供编辑入口。</p>
 */
@Data
@AutoMapper(target = SysFieldResource.class)
public class SysFieldResourceVo implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 主键id
     */
    private Long id;

    /**
     * 资源标识（与菜单权限前缀一致，如 system:user）
     */
    private String resourceKey;

    /**
     * 资源名称
     */
    private String resourceName;

    /**
     * 所属模块分组
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
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;

    /**
     * 该资源绑定的类清单（只读）
     *
     * <p>让管理员看见配置的实际覆盖范围：读出口漏绑一个导出 VO 就是明文外泄通道，
     * 写入口漏绑一个 BO 就是越权写入通道。</p>
     */
    private List<SysFieldResourceClassVo> classes = new ArrayList<>();

    /**
     * 已配置差异化权限的字段数（配置页左树的数字徽标，一眼看出哪些资源做过限制）
     */
    private Integer configuredFieldCount;
}