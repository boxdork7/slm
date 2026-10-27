package plus.ruoyi.system.core.domain.vo;

import lombok.Data;
import plus.ruoyi.common.core.field.FieldResource;

/**
 * 当前在线会话信息
 *
 * @author Lion Li
 */
@Data
// 字段级权限：虽同源 sys_user，但 ipaddr/browser/os 与 SysUserVo 的 loginIp 语义不同，注册为独立资源，不与 system:user 硬凑
@FieldResource("monitor:online")
public class SysUserOnlineVo {

    /**
     * 会话编号
     */
    private String tokenId;

    /**
     * 部门名称
     */
    private String deptName;

    /**
     * 用户名称
     */
    private String userName;

    /**
     * 客户端
     */
    private String clientKey;

    /**
     * 设备类型
     */
    private String deviceType;

    /**
     * 登录IP地址
     */
    private String ipaddr;

    /**
     * 登录地址
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
     * 登录时间
     */
    private Long loginTime;

}
