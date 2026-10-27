package plus.ruoyi.common.encrypt.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import plus.ruoyi.common.encrypt.core.api.IApiCryptor;
import plus.ruoyi.common.encrypt.core.api.RsaAesApiCryptor;
import plus.ruoyi.common.encrypt.core.api.Sm2Sm4ApiCryptor;
import plus.ruoyi.common.encrypt.enumd.ApiEncryptAlgorithm;
import plus.ruoyi.common.encrypt.properties.ApiDecryptProperties;
import plus.ruoyi.common.encrypt.utils.EncryptUtils;
import plus.ruoyi.common.test.base.BaseUnitTest;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * ApiDecryptAutoConfiguration 加解密器选择测试
 *
 * @author 抓蛙师
 */
@DisplayName("ApiDecryptAutoConfiguration 加解密器选择测试")
class ApiDecryptAutoConfigurationTest extends BaseUnitTest {

    @Test
    @DisplayName("测试默认-未配置algorithm时使用RSA+AES，兼容老配置")
    void testDefaultRsa() {
        Map<String, String> rsa = EncryptUtils.generateRsaKey();
        ApiDecryptProperties properties = new ApiDecryptProperties();
        properties.setPublicKey(rsa.get(EncryptUtils.PUBLIC_KEY));
        properties.setPrivateKey(rsa.get(EncryptUtils.PRIVATE_KEY));

        IApiCryptor cryptor = ApiDecryptAutoConfiguration.createApiCryptor(properties);

        assertThat(cryptor).isInstanceOf(RsaAesApiCryptor.class);
        // 同一密钥对，自加密自解密应还原
        String key = cryptor.generateKey();
        assertThat(key).hasSize(32);
        assertThat(cryptor.decryptKey(cryptor.encryptKey(key))).isEqualTo(key);
        assertThat(cryptor.decryptBody(cryptor.encryptBody("{\"a\":\"中文\"}", key), key)).isEqualTo("{\"a\":\"中文\"}");
    }

    @Test
    @DisplayName("测试切换-algorithm=SM2时使用SM2+SM4")
    void testSm2() {
        ApiDecryptProperties properties = new ApiDecryptProperties();
        properties.setAlgorithm(ApiEncryptAlgorithm.SM2);
        properties.getSm2().setPublicKey("04b545121b1aed3c7c59b25f8da50b1af7080cc0a7438fa095f8ce95ea61afd6b75170ac82241894f604cb4e1b3c3dbb09125c17497805ce0b5c54381baeea5897");
        properties.getSm2().setPrivateKey("ceefcceb535f94666532586ccf3a45f77548c100f955e69dd9202b08ccfb24e4");

        IApiCryptor cryptor = ApiDecryptAutoConfiguration.createApiCryptor(properties);

        assertThat(cryptor).isInstanceOf(Sm2Sm4ApiCryptor.class);
        String key = cryptor.generateKey();
        assertThat(cryptor.decryptKey(cryptor.encryptKey(key))).isEqualTo(key);
    }

    @Test
    @DisplayName("测试校验-切到SM2但未配SM2密钥时启动即失败")
    void testSm2WithoutKeys() {
        ApiDecryptProperties properties = new ApiDecryptProperties();
        properties.setAlgorithm(ApiEncryptAlgorithm.SM2);
        // 只配了 RSA 密钥，模拟"改了开关忘了配密钥"
        properties.setPublicKey("rsa-public");
        properties.setPrivateKey("rsa-private");

        assertThatThrownBy(() -> ApiDecryptAutoConfiguration.createApiCryptor(properties))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("api-decrypt.sm2");
    }
}
