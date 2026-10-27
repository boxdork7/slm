package plus.ruoyi.common.core.domain.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import plus.ruoyi.common.core.domain.dto.PostDTO;
import plus.ruoyi.common.core.domain.dto.RoleDTO;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.Set;

/**
 * 登录用户身份权限
 *
 * @author Lion Li
 */
@Data
@NoArgsConstructor
public class LoginUser implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 租户ID
     */
    private String tenantId;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 部门ID
     */
    private Long deptId;

    /**
     * 部门类别编码
     */
    private String deptCategory;

    /**
     * 部门名
     */
    private String deptName;

    /**
     * 用户唯一标识
     */
    private String token;

    /**
     * 用户类型
     */
    private String userType;

    /**
     * 密码最后修改时间
     * <p>
     * 随本对象一起存进 Sa-Token 的 token session，供后端拦截器判定口令是否过期 ——
     * 这样每个请求都不必再查库。为 null 表示从未改过密码（新建用户 / 管理员刚重置）。
     * <p>
     * 🔴 存时间而非「是否需要改密」的布尔值：布尔值在登录那一刻就固定了，
     * 用户长时间挂着不退出、期间跨过有效期时就拦不住；存原始时间由拦截器现算才没有盲区。
     */
    private Date pwdUpdateDate;

    /**
     * 登录时间
     */
    private Long loginTime;

    /**
     * 过期时间
     */
    private Long expireTime;

    /**
     * 登录IP地址
     */
    private String ipaddr;

    /**
     * 登录地点
     */
    private String loginLocation;

    /**
     * 浏览器类型
     */
    private String browser;

    /**
     * 操作系统
     */
    private String os;

    /**
     * 菜单权限
     */
    private Set<String> menuPermission;

    /**
     * 角色权限
     */
    private Set<String> rolePermission;

    /**
     * 用户名
     */
    private String userName;

    /**
     * 用户昵称
     */
    private String nickName;

    /**
     * 角色对象
     */
    private List<RoleDTO> roles;

    /**
     * 岗位对象
     */
    private List<PostDTO> posts;

    /**
     * 数据权限 当前角色ID
     */
    private Long roleId;

    /**
     * 设备类型
     */
    private String deviceType;

    /**
     * 平台类型
     */
    private String platform;

    /**
     * appid
     */
    private String appid;

    /**
     * unionid
     */
    private String unionid;

    /**
     * openid
     */
    private String openid;

    /**
     * 获取登录id
     */
    public String getLoginId() {
        if (userType == null) {
            throw new IllegalArgumentException("用户类型不能为空");
        }
        if (userId == null) {
            throw new IllegalArgumentException("用户ID不能为空");
        }
        return userType + ":" + userId;
    }

}
