package plus.ruoyi.common.encrypt.core.api;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import plus.ruoyi.common.test.base.BaseUnitTest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * SM2+SM4 接口加解密器测试
 * <p>
 * 重点是与前端 sm-crypto 的互通：下面的密文由 sm-crypto 0.5.7 生成
 * （{@code '04' + sm2.doEncrypt(key, pub, 1)}、{@code sm4.encrypt(body, utf8ToHex(key))}），
 * 一旦 Hutool / sm-crypto 升级后格式不再兼容，这里会第一时间失败。
 *
 * @author 抓蛙师
 */
@DisplayName("Sm2Sm4ApiCryptor 国密接口加解密器测试")
class Sm2Sm4ApiCryptorTest extends BaseUnitTest {

    /**
     * 请求方向密钥对：前端持公钥加密，后端持私钥解密
     */
    private static final String REQ_PUBLIC_KEY = "04b545121b1aed3c7c59b25f8da50b1af7080cc0a7438fa095f8ce95ea61afd6b75170ac82241894f604cb4e1b3c3dbb09125c17497805ce0b5c54381baeea5897";
    private static final String REQ_PRIVATE_KEY = "ceefcceb535f94666532586ccf3a45f77548c100f955e69dd9202b08ccfb24e4";

    /**
     * 响应方向密钥对：后端持公钥加密，前端持私钥解密
     */
    private static final String RESP_PUBLIC_KEY = "04c5f053276fc40c4207a9afc692674563a7ce6ee528f90267e6702f7396862acd6fef5566bbfdf5776d3660034feff9de3d9fb3d91c20cbcbd77e4b79f1edf788";
    private static final String RESP_PRIVATE_KEY = "261af8bdfd10e14b8d87b04bc4e42c6fc44e3c41380cf4346b4bfa87afa74e92";

    /**
     * sm-crypto 生成的请求头：'04' + SM2(C1C3C2) 加密的 SM4 密钥 "Ab3dEf7hJk9mNp2q"
     */
    private static final String JS_ENCRYPTED_KEY = "04cc44eb4aefd53b533228f4e323f1da38caf3ac5e27b91c7f199e6ee3bda5e297197ec8652a5d7901035efeaa55716ba375291e24ce2a9dc58076d480f67ce74483e682840abb59793c61ac031ae17d659165a3c4bf194defcf6be0a4c5b1617578f556196fbd53fcbf080888aaf86ed6";

    /**
     * sm-crypto 用上面的 SM4 密钥加密的请求体（ECB + PKCS#7，Hex）
     */
    private static final String JS_ENCRYPTED_BODY = "219494d802c06eb4ce03663648ea9491e63551b48f8cf8cecd832575096e44388291836723eb9d3f82b00a6a3426bc45fcf22e5992c314e19c9cf3509da35ae6";

    private static final String PLAIN_BODY = "{\"userName\":\"张三\",\"remark\":\"国密互通测试 SM2+SM4\"}";

    /**
     * 后端视角：公钥用于响应，私钥用于请求
     */
    private final Sm2Sm4ApiCryptor serverCryptor = new Sm2Sm4ApiCryptor(RESP_PUBLIC_KEY, REQ_PRIVATE_KEY);

    @Test
    @DisplayName("测试互通-解密 sm-crypto 加密的请求头与请求体")
    void testDecryptRequestFromSmCrypto() {
        String sm4Key = serverCryptor.decryptKey(JS_ENCRYPTED_KEY);
        assertThat(sm4Key).isEqualTo("Ab3dEf7hJk9mNp2q");

        assertThat(serverCryptor.decryptBody(JS_ENCRYPTED_BODY, sm4Key)).isEqualTo(PLAIN_BODY);
    }

    @Test
    @DisplayName("测试格式-响应头密文为带04前缀的Hex，供前端去前缀后解密")
    void testEncryptKeyFormat() {
        String encryptedKey = serverCryptor.encryptKey(serverCryptor.generateKey());

        // C1(65字节) + C3(32字节) + C2(16字节) = 113 字节 = 226 位 Hex
        assertThat(encryptedKey).startsWith("04").hasSize(226).matches("[0-9a-f]+");
    }

    @Test
    @DisplayName("测试往返-响应方向用前端私钥可解开")
    void testResponseRoundTrip() {
        String key = serverCryptor.generateKey();
        String encryptedKey = serverCryptor.encryptKey(key);
        String encryptedBody = serverCryptor.encryptBody(PLAIN_BODY, key);

        // 模拟前端：持有响应方向私钥
        Sm2Sm4ApiCryptor clientCryptor = new Sm2Sm4ApiCryptor(REQ_PUBLIC_KEY, RESP_PRIVATE_KEY);
        String decryptedKey = clientCryptor.decryptKey(encryptedKey);

        assertThat(decryptedKey).isEqualTo(key);
        assertThat(encryptedBody).matches("[0-9a-f]+");
        assertThat(clientCryptor.decryptBody(encryptedBody, decryptedKey)).isEqualTo(PLAIN_BODY);
    }

    @Test
    @DisplayName("测试密钥-SM4密钥为16位字母数字且每次不同")
    void testGenerateKey() {
        String key1 = serverCryptor.generateKey();
        String key2 = serverCryptor.generateKey();

        assertThat(key1).hasSize(16).matches("[0-9a-zA-Z]+");
        assertThat(key1).isNotEqualTo(key2);
    }

    @Test
    @DisplayName("测试异常-私钥不匹配时解密失败")
    void testDecryptKeyWithWrongPrivateKey() {
        Sm2Sm4ApiCryptor wrongCryptor = new Sm2Sm4ApiCryptor(RESP_PUBLIC_KEY, RESP_PRIVATE_KEY);

        assertThatThrownBy(() -> wrongCryptor.decryptKey(JS_ENCRYPTED_KEY)).isInstanceOf(RuntimeException.class);
    }
}
