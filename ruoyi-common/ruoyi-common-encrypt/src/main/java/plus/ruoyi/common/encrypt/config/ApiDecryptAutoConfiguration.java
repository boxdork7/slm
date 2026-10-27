package plus.ruoyi.common.encrypt.config;

import cn.hutool.core.util.ObjectUtil;
import jakarta.servlet.DispatcherType;
import plus.ruoyi.common.core.utils.StringUtils;
import plus.ruoyi.common.encrypt.core.api.IApiCryptor;
import plus.ruoyi.common.encrypt.core.api.RsaAesApiCryptor;
import plus.ruoyi.common.encrypt.core.api.Sm2Sm4ApiCryptor;
import plus.ruoyi.common.encrypt.enumd.ApiEncryptAlgorithm;
import plus.ruoyi.common.encrypt.filter.CryptoFilter;
import plus.ruoyi.common.encrypt.properties.ApiDecryptProperties;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;

/**
 * API解密自动配置类
 *
 * 注册CryptoFilter过滤器，实现API请求响应的自动加解密
 *
 * 配置条件：
 * - api-decrypt.enabled=true
 *
 * 功能：
 * - 自动解密带有加密标识头的POST/PUT请求
 * - 自动加密标注了@ApiEncrypt(response=true)的响应
 *
 * 加密流程：
 * 1. 客户端生成AES密钥，用RSA公钥加密后放入请求头
 * 2. 过滤器用RSA私钥解密获得AES密钥
 * 3. 用AES密钥解密请求体
 * 4. 响应时生成新的AES密钥加密响应体
 * 5. 用RSA公钥加密AES密钥放入响应头
 *
 * 配置示例：
 * <pre>
 * api-decrypt:
 *   enabled: true
 *   header-flag: "encrypt-key"
 *   public-key: "MIIBIjANBgkqhkiG9w0BAQEF..."
 *   private-key: "MIIEvQIBADANBgkqhkiG9w0BAQ..."
 * </pre>
 *
 * @author wdhcr
 */
@AutoConfiguration
@EnableConfigurationProperties(ApiDecryptProperties.class)
@ConditionalOnProperty(value = "api-decrypt.enabled", havingValue = "true")
public class ApiDecryptAutoConfiguration {

    /**
     * 注册加密过滤器
     *
     * 过滤器优先级最高，拦截所有请求进行加解密处理
     *
     * @param properties API解密配置属性
     * @return 过滤器注册Bean
     */
    @Bean
    public FilterRegistrationBean<CryptoFilter> cryptoFilterRegistration(ApiDecryptProperties properties) {
        FilterRegistrationBean<CryptoFilter> registration = new FilterRegistrationBean<>();
        registration.setDispatcherTypes(DispatcherType.REQUEST);
        registration.setFilter(new CryptoFilter(properties, createApiCryptor(properties)));
        // 拦截所有请求
        registration.addUrlPatterns("/*");
        registration.setName("cryptoFilter");
        // 最高优先级
        registration.setOrder(FilterRegistrationBean.HIGHEST_PRECEDENCE);
        return registration;
    }

    /**
     * 按 api-decrypt.algorithm 创建接口加解密器
     * <p>
     * 启动时就校验所选算法的密钥是否配齐：切到 SM2 却漏配密钥时，
     * 若拖到第一个加密请求才报错，排查成本远高于启动失败。
     *
     * @param properties API解密配置属性
     * @return 对应算法的加解密器
     * @throws IllegalStateException 所选算法的公钥或私钥未配置时抛出
     */
    static IApiCryptor createApiCryptor(ApiDecryptProperties properties) {
        ApiEncryptAlgorithm algorithm = ObjectUtil.defaultIfNull(properties.getAlgorithm(), ApiEncryptAlgorithm.RSA);
        return switch (algorithm) {
            case SM2 -> {
                ApiDecryptProperties.Sm2 sm2 = properties.getSm2();
                requireKeys(algorithm, sm2.getPublicKey(), sm2.getPrivateKey(), "api-decrypt.sm2.public-key / private-key");
                yield new Sm2Sm4ApiCryptor(sm2.getPublicKey(), sm2.getPrivateKey());
            }
            case RSA -> {
                requireKeys(algorithm, properties.getPublicKey(), properties.getPrivateKey(), "api-decrypt.public-key / private-key");
                yield new RsaAesApiCryptor(properties.getPublicKey(), properties.getPrivateKey());
            }
        };
    }

    private static void requireKeys(ApiEncryptAlgorithm algorithm, String publicKey, String privateKey, String keyNames) {
        if (StringUtils.isAnyBlank(publicKey, privateKey)) {
            throw new IllegalStateException(StringUtils.format(
                "接口加密算法为 {}，但未配置 {}", algorithm, keyNames));
        }
    }
}
