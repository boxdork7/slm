package plus.ruoyi.system.core.domain.vo;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * 密码状态视图对象
 * <p>
 * 随 {@link UserInfoVo} 一起返回给前端，用于等保二级 8.1.4.1 a
 * 「身份鉴别信息具有复杂度要求并定期更换」的前端引导。
 * <p>
 * 设计约定：这些标记<b>不阻断登录</b>。阻断会让用户连改密页面都进不去，
 * 拦截由前端路由守卫完成（只放行改密相关路由）。
 *
 * @author 抓蛙师
 */
@Data
public class PasswordStatusVo implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 是否必须修改密码
     * <p>
     * 为 true 的两种情形：
     * 1. 从未修改过密码（pwd_update_date 为空），即新建用户或管理员刚重置过密码；
     *    仅限管理端用户，移动端用户多为免密自动注册，不走这一条；
     * 2. 密码已超过有效期。
     */
    private Boolean mustChangePwd = false;

    /**
     * 密码是否已过期（mustChangePwd 为 true 的原因之一，单独给出便于前端区分文案）
     */
    private Boolean pwdExpired = false;

    /**
     * 距离密码到期还剩多少天
     * <p>
     * 仅在「已进入提醒窗口但尚未过期」时才有值，其余情况为 null。
     * 前端据此显示柔性提醒条，而不是强制跳转。
     */
    private Long expireInDays;

    /**
     * 密码有效期天数（0 表示永不过期）
     * <p>
     * 回传给前端仅用于提示文案，例如「按策略密码每 180 天需更换一次」。
     */
    private Integer expireDays;
}
