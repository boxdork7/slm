package plus.ruoyi.common.sms.config.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * 短信验证码配置属性
 * <p>
 * 这是本项目的扩展配置，不属于 SMS4J 官方配置项。
 * 之所以挂在 {@code sms.captcha} 子节点而不是与 {@code sms.config-type} 等平级：
 * {@code sms} 前缀已被 SMS4J 的配置类占用，平级新增字段有与其未来版本撞名的风险。
 * <p>
 * 配置示例：
 * <pre>
 * sms:
 *   captcha:
 *     enabled: true
 *     config-id: config1
 *     template-id: SMS_123456789
 * </pre>
 *
 * @author Feng
 */
@Data
@ConfigurationProperties(prefix = "sms.captcha")
public class SmsCaptchaProperties {

    /**
     * 是否开启短信验证码功能
     * <p>
     * 默认关闭。未配置短信服务商就开启会在发码时报错，
     * 故与邮件模块（mail.enabled）保持一致，需显式打开。
     */
    private Boolean enabled = false;

    /**
     * 使用哪个短信配置
     * <p>
     * 取值对应 {@code sms.blends} 下的键名（如 config1 / config2），
     * 用于在多厂商、多账号场景下指定走哪一套凭据。
     */
    private String configId = "config1";

    /**
     * 验证码短信模板ID
     * <p>
     * 阿里云 / 腾讯云等厂商发送模板短信时必传（阿里云称模板 CODE，形如 SMS_123456789），
     * 传空会被厂商判为参数错误。开启 enabled 时本项必填。
     */
    private String templateId;

}
