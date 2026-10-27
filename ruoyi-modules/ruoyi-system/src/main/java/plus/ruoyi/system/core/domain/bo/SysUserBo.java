package plus.ruoyi.system.core.domain.bo;

import io.github.linpeilie.annotations.AutoMapper;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import plus.ruoyi.common.core.constant.SystemConstants;
import plus.ruoyi.common.core.field.FieldClassType;
import plus.ruoyi.common.core.field.FieldResource;
import plus.ruoyi.common.core.validate.AddGroup;
import plus.ruoyi.common.core.xss.Xss;
import plus.ruoyi.common.mybatis.core.domain.BaseEntity;
import plus.ruoyi.system.core.domain.SysUser;

import java.util.Date;
import java.util.List;

/**
 * 用户信息业务对象 sys_user
 *
 * @author Michelle.Chung
 */

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@AutoMapper(target = SysUser.class, reverseConvertGenerate = false)
// 字段级权限：写入口 BO，写入拦截按此登记反查资源，不靠 SysUserBo↔SysUserVo 命名猜测
@FieldResource(value = "system:user", type = FieldClassType.BO)
public class SysUserBo extends BaseEntity {

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 部门ID
     */
    private Long deptId;

    /**
     * 用户账号
     * <p>
     * 必填只在新增/导入时校验（AddGroup）：小程序微信用户注册时没有账号（user_name 为 NULL），
     * PC 端编辑弹窗又不展示账号，若编辑也强制必填，管理员改备注/角色会被「用户账号不能为空」拦住。
     */
    @Xss(message = "用户账号不能包含脚本字符")
    @NotBlank(message = "用户账号不能为空", groups = AddGroup.class)
    @Size(min = 2, max = 30, message = "用户账号长度必须在{min}到{max}个字符之间")
    private String userName;

    /**
     * 用户昵称
     */
    @Xss(message = "用户昵称不能包含脚本字符")
    @NotBlank(message = "用户昵称不能为空")
    @Size(min = 0, max = 30, message = "用户昵称长度不能超过{max}个字符")
    private String nickName;

    /**
     * 用户类型
     */
    private String userType;

    /**
     * 用户邮箱
     */
    @Email(message = "邮箱格式不正确")
    @Size(min = 0, max = 50, message = "邮箱长度不能超过{max}个字符")
    private String email;

    /**
     * 手机号码
     */
    private String phone;

    /**
     * 用户性别
     */
    private String gender;

    /**
     * 密码
     */
    private String password;

    /**
     * 密码最后修改时间
     * <p>
     * 为 null 表示「从未修改过密码」，会触发首次登录强制改密（等保 8.1.4.1 a）。
     * 管理员代建账号时保持 null；自助注册时设为当前时间。
     */
    private Date pwdUpdateDate;

    /**
     * 帐号状态
     */
    private String status;

    /**
     * 备注
     */
    private String remark;

    /**
     * 角色组
     */
    @Size(min = 1, message = "用户角色不能为空")
    private Long[] roleIds;

    /**
     * 岗位组
     */
    private Long[] postIds;

    /**
     * 数据权限 当前角色ID
     */
    private Long roleId;

    /**
     * 用户ID
     */
    private String userIds;

    /**
     * 排除不查询的用户(工作流用)
     */
    private String excludeUserIds;

    /**
     * 部门ID列表（Service层设置，用于部门树查询）
     */
    private List<Long> deptIds;

    public SysUserBo(Long userId) {
        this.userId = userId;
    }

    public boolean isSuperAdmin() {
        return SystemConstants.SUPER_ADMIN_ID.equals(this.userId);
    }

}
