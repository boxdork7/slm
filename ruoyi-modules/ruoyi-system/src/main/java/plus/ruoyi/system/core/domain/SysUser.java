package plus.ruoyi.system.core.domain;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import plus.ruoyi.common.core.constant.SystemConstants;
import plus.ruoyi.common.tenant.core.TenantEntity;

import java.util.Date;

/**
 * 用户对象 sys_user
 *
 * @author Lion Li
 */

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@TableName("sys_user")
public class SysUser extends TenantEntity {

    /**
     * 用户ID
     */
    @TableId(value = "user_id")
    private Long userId;

    /**
     * 部门ID
     */
    private Long deptId;

    /**
     * 用户账号
     */
    private String userName;

    /**
     * 用户昵称
     */
    private String nickName;

    /**
     * 用户类型
     */
    private String userType;

    /**
     * 用户邮箱
     */
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
     * 用户头像
     */
    private String avatar;

    /**
     * 密码
     */
    @TableField(
        insertStrategy = FieldStrategy.NOT_EMPTY,
        updateStrategy = FieldStrategy.NOT_EMPTY,
        whereStrategy = FieldStrategy.NOT_EMPTY
    )
    private String password;

    /**
     * 密码最后修改时间
     * <p>
     * 为 null 表示「从未修改过密码」，用于触发首次登录强制改密（等保 8.1.4.1 a）。
     * 管理员重置密码时会主动置空该字段，让用户下次登录必须自行设置新密码。
     */
    private Date pwdUpdateDate;

    /**
     * 历史密码（BCrypt 密文，逗号分隔，最新的排在最前）
     * <p>
     * 支撑「新密码不得与最近 N 次相同」的校验（等保 8.1.4.1 a）。
     * 不单独建历史表：密码历史是用户的附属属性而非独立实体，建表会额外带来
     * 删除用户时的级联清理负担，而收益只是多一个改密时间戳 —— 那个信息
     * sys_oper_log 与 pwdUpdateDate 已经有了。
     * <p>
     * 🔴 该字段不得出现在任何 VO 中：VO 里没有同名属性，MapstructUtils 就不会映射，
     * 历史密文也就不可能顺着响应体漏出去。新增用户相关 VO 时请勿添加此字段。
     */
    private String pwdHistory;

    /**
     * 帐号状态
     */
    private String status;

    /**
     * 是否删除
     */
    @TableLogic
    private String isDeleted;

    /**
     * 最后登录IP
     */
    private String loginIp;

    /**
     * 最后登录时间
     */
    private Date loginDate;

    /**
     * 备注
     */
    private String remark;


    public SysUser(Long userId) {
        this.userId = userId;
    }

    public boolean isSuperAdmin() {
        return SystemConstants.SUPER_ADMIN_ID.equals(this.userId);
    }

}
