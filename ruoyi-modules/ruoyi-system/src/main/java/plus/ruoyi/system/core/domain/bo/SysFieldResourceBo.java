package plus.ruoyi.system.core.domain.bo;

import io.github.linpeilie.annotations.AutoMapper;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import plus.ruoyi.common.core.validate.EditGroup;
import plus.ruoyi.system.core.domain.SysFieldResource;

import java.io.Serial;
import java.io.Serializable;

/**
 * 字段权限资源元信息业务对象 sys_field_resource
 *
 * <p>🔴 <b>刻意只暴露四个元信息字段</b>：{@code resourceKey} 与类绑定由 {@code @FieldResource}
 * 注解扫描独占维护。若允许后台手填资源标识，管理员改错一个字母就会让该资源的全部配置失效
 * ——序列化层按注解值反查，配置却挂在改后的 key 上，字段静默变成"无动态决策"而放行。
 * 这类"配错就漏"的项不该交给使用者维护。</p>
 *
 * <p>同理不提供新增 / 删除 BO：资源的存在与否跟着代码走，不跟着人工操作走。</p>
 */
@Data
@AutoMapper(target = SysFieldResource.class)
public class SysFieldResourceBo implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 主键id
     */
    @NotNull(message = "资源ID不能为空", groups = {EditGroup.class})
    private Long id;

    /**
     * 资源名称（管理员可改成更易懂的叫法）
     */
    @Size(max = 100, message = "资源名称不能超过100个字符")
    private String resourceName;

    /**
     * 所属模块分组（决定配置页左树的归类）
     */
    @Size(max = 50, message = "模块分组不能超过50个字符")
    private String moduleName;

    /**
     * 排序值
     */
    private Integer sortOrder;

    /**
     * 状态（0停用 1正常）。停用后该资源不再参与字段权限决策
     */
    private String status;

    /**
     * 备注
     */
    @Size(max = 255, message = "备注不能超过255个字符")
    private String remark;
}