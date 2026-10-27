package plus.ruoyi.system.core.domain.vo;

import lombok.Data;

import java.util.Map;
import java.util.Set;

/**
 * 登录用户信息
 *
 * @author Michelle.Chung
 */
@Data
public class UserInfoVo {

    /**
     * 用户基本信息
     */
    private SysUserVo user;

    /**
     * 角色权限
     */
    private Set<String> roles;


    /**
     * 菜单权限
     */
    private Set<String> permissions;

    /**
     * 密码状态（等保二级 8.1.4.1 a）
     * <p>
     * 放在这里而不是登录接口的返回值里，有两个原因：
     * 1. 登录接口走 @ApiEncrypt 加密链路，改动返回结构风险高；
     * 2. 前端每次刷新页面都会重新调本接口，密码状态能随之刷新，
     *    否则用户改完密码后不重新登录就一直被守卫拦着。
     */
    private PasswordStatusVo passwordStatus;

    /**
     * 字段权限快照：资源标识 → (字段名 → 档位码 0隐藏/1脱敏/2只读)
     *
     * <p>只含<b>受限字段</b>，可写的不下发——绝大多数用户是空对象。
     * 前端据此在表格列 / 详情项 / 表单项层面隐藏或禁用，属体验优化：
     * 让用户不会"看见一个能填的框、填完保存却没生效"。</p>
     *
     * <p>🔴 <b>它不是安全边界</b>。真正的隔离由四个后端出口保证
     * （JSON 序列化 / Excel 导出 / JSON 写入 / Excel 导入），
     * 绕过前端直接调接口一样改不动、看不到。</p>
     */
    private Map<String, Map<String, String>> fieldPermissions;

}
