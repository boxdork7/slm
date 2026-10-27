package plus.ruoyi.common.mail.config.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * JavaMail 配置属性
 *
 * @author Michelle.Chung
 */
@Data
@ConfigurationProperties(prefix = "mail")
public class MailProperties {

    /**
     * 过滤开关
     */
    private Boolean enabled;

    /**
     * SMTP服务器域名
     */
    private String host;

    /**
     * SMTP服务端口
     */
    private Integer port;

    /**
     * 是否需要用户名密码验证
     */
    private Boolean auth;

    /**
     * 用户名
     */
    private String user;

    /**
     * 密码
     */
    private String pass;

    /**
     * 发送方，遵循RFC-822标准<br>
     * 发件人可以是以下形式：
     *
     * <pre>
     * 1. user@xxx.xx
     * 2.  name &lt;user@xxx.xx&gt;
     * </pre>
     */
    private String from;

    /**
     * 使用 STARTTLS安全连接，STARTTLS是对纯文本通信协议的扩展。它将纯文本连接升级为加密连接（TLS或SSL）， 而不是使用一个单独的加密通信端口。
     */
    private Boolean starttlsEnable;

    /**
     * 使用 SSL安全连接
     */
    private Boolean sslEnable;

    /**
     * SMTP超时时长，单位毫秒，缺省值不超时
     */
    private Long timeout;

    /**
     * Socket连接超时值，单位毫秒，缺省值不超时
     */
    private Long connectionTimeout;

    /**
     * 邮箱验证码登录配置
     */
    private Captcha captcha = new Captcha();

    /**
     * 邮箱验证码登录配置
     * <p>
     * 为什么要与 {@link MailProperties#enabled} 分开：
     * {@code mail.enabled} 管的是「系统能不能发邮件」——业务通知、密码重置等都依赖它；
     * 本开关管的是「要不要对外开放邮箱验证码登录入口」。两者耦合在一起时，
     * 只要想发任何一封业务邮件，就被迫同时开放一个登录入口，想关也关不掉。
     * <p>
     * 该分层与短信侧保持一致：{@code sms.blends}（发件凭据）与
     * {@code sms.captcha.enabled}（验证码登录功能）本就是分开的。
     * <p>
     * 配置示例：
     * <pre>
     * mail:
     *   enabled: true
     *   captcha:
     *     enabled: true
     * </pre>
     */
    @Data
    public static class Captcha {

        /**
         * 是否开启邮箱验证码登录
         * <p>
         * 默认关闭：登录入口属于对外暴露面，应显式开启，与 {@code sms.captcha.enabled} 的默认值一致。
         * 生效前提是 {@code mail.enabled} 同时为 true，否则验证码邮件根本发不出去。
         */
        private Boolean enabled = false;
    }
}
