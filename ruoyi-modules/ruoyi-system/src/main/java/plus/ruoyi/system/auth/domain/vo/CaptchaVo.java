package plus.ruoyi.system.auth.domain.vo;

import lombok.Data;

/**
 * 验证码信息
 *
 * @author Michelle.Chung
 */
@Data
public class CaptchaVo {
    /**
     * 是否开启多租户
     * 控制前端是否显示租户信息
     */
    private Boolean tenantEnabled;

    /**
     * 租户标题
     */
    private String tenantTitle;

    /**
     * 实际租户ID
     * 后端根据域名识别出的真实租户ID，前端后续请求使用此ID
     */
    private String tenantId;

    /**
     * 是否开启注册
     * 控制前端是否显示立即注册
     */
    private Boolean registerEnabled;

    /**
     * 是否开启验证码
     * 控制前端是否显示验证码输入框
     */
    private Boolean captchaEnabled = true;

    /**
     * 验证码唯一标识
     * 用于关联验证码和会话，前端提交验证码时需同时提交此值
     */
    private String uuid;

    /**
     * 验证码图片
     * Base64编码的图片数据
     */
    private String img;

    /**
     * 已配置的社交登录类型
     * 逗号分隔的字符串，如：wechat_open,gitee,github
     */
    private String socialTypes;

    /**
     * 是否开启社交登录自动注册
     * 控制前端是否允许通过社交账号直接注册
     */
    private Boolean socialAutoRegisterEnabled;

    /**
     * 是否开启手机验证码登录
     * 控制前端是否显示手机号登录页签
     * <p>
     * 判据是 sms.captcha.enabled 与 sms.captcha.template-id 同时成立：
     * 只打开开关却没配模板ID，页签能点但发码必定失败（厂商要求模板 code 非空），
     * 与其让用户点了才报错，不如直接不显示这个页签。
     */
    private Boolean smsEnabled = false;

    /**
     * 是否开启邮箱验证码登录
     * 控制前端是否显示邮箱登录页签，取值来自 mail.enabled
     */
    private Boolean emailEnabled = false;

}
