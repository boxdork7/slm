package plus.ruoyi.common.encrypt.core.api;

import cn.hutool.crypto.SecureUtil;
import cn.hutool.crypto.asymmetric.RSA;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import plus.ruoyi.common.encrypt.utils.EncryptUtils;
import plus.ruoyi.common.test.base.BaseUnitTest;

import java.security.KeyPair;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * 接口加密密钥生成器（上线前换密钥用）
 * <p>
 * 接口加密需要<b>两对</b>非对称密钥，且前后端各持一半，手工拼很容易配反：
 * <ul>
 *   <li>请求方向：前端持公钥加密 → 后端持私钥解密</li>
 *   <li>响应方向：后端持公钥加密 → 前端持私钥解密</li>
 * </ul>
 * 运行对应测试方法，控制台按三段输出可直接粘贴的配置，且生成后已当场模拟一次请求 + 响应验证配对正确：
 * <ol>
 *   <li>后端 application.yml（JAR 部署 / 改默认值）</li>
 *   <li>Docker compose 的 environment（粘到每个后端实例下，如 ryplus_uni、ryplus_uni2）</li>
 *   <li>前端 env/.env（plus-ui / plus-uniapp / plus-app 三端填同一份）</li>
 * </ol>
 * 运行方式：IDEA 里直接点方法左侧运行按钮；或命令行（根 pom 默认跳过测试且按 dev 标签过滤，需显式打开）：
 * <pre>
 * mvn test -pl ruoyi-common/ruoyi-common-encrypt "-DskipTests=false" "-Dprofiles.active=" "-Dtest=ApiEncryptKeyGeneratorTest#generateRsaKeys"
 * mvn test -pl ruoyi-common/ruoyi-common-encrypt "-DskipTests=false" "-Dprofiles.active=" "-Dtest=ApiEncryptKeyGeneratorTest#generateSm2Keys"
 * </pre>
 *
 * @author 抓蛙师
 */
@DisplayName("接口加密密钥生成器")
class ApiEncryptKeyGeneratorTest extends BaseUnitTest {

    /**
     * RSA 密钥位数：框架历史默认值是 512 位，已不满足安全要求，生成器统一出 2048 位。
     * 前端 jsencrypt 可直接使用（公钥 X.509、私钥 PKCS#8 的 Base64），已验证互通。
     */
    private static final int RSA_KEY_SIZE = 2048;

    private static final String SAMPLE_BODY = "{\"userName\":\"密钥自检\"}";

    @Test
    @DisplayName("生成 RSA 密钥（algorithm=RSA，默认算法）")
    void generateRsaKeys() {
        String[] request = generateRsaKeyPair();
        String[] response = generateRsaKeyPair();
        String reqPub = request[0], reqPri = request[1], respPub = response[0], respPri = response[1];

        assertPaired(new RsaAesApiCryptor(respPub, reqPri), new RsaAesApiCryptor(reqPub, respPri));

        System.out.println(render("""

            ==================== ① 后端 application.yml（api-decrypt 节点）====================
            api-decrypt:
              algorithm: RSA
              publicKey: {respPub}
              privateKey: {reqPri}

            ==================== ② Docker compose（粘到每个后端实例的 environment 下）====================
                  API_ENCRYPT_ALGORITHM: "RSA"
                  API_RESPONSE_PUBLIC_KEY: {respPub}
                  API_REQUEST_PRIVATE_KEY: {reqPri}

            ==================== ③ 前端 env/.env（plus-ui / plus-uniapp / plus-app 三端相同）====================
            VITE_APP_API_ENCRYPT_ALGORITHM = 'RSA'
            VITE_APP_RSA_PUBLIC_KEY = '{reqPub}'
            VITE_APP_RSA_PRIVATE_KEY = '{respPri}'
            """, reqPub, reqPri, respPub, respPri));
    }

    @Test
    @DisplayName("生成 SM2 国密密钥（algorithm=SM2）")
    void generateSm2Keys() {
        Map<String, String> request = EncryptUtils.generateSm2KeyHex();
        Map<String, String> response = EncryptUtils.generateSm2KeyHex();
        String reqPub = request.get(EncryptUtils.PUBLIC_KEY);
        String reqPri = request.get(EncryptUtils.PRIVATE_KEY);
        String respPub = response.get(EncryptUtils.PUBLIC_KEY);
        String respPri = response.get(EncryptUtils.PRIVATE_KEY);

        // 格式必须与前端 sm-crypto 一致，否则前端无法使用
        assertThat(reqPub).hasSize(130).startsWith("04").matches("[0-9a-f]+");
        assertThat(reqPri).hasSize(64).matches("[0-9a-f]+");
        assertPaired(new Sm2Sm4ApiCryptor(respPub, reqPri), new Sm2Sm4ApiCryptor(reqPub, respPri));

        System.out.println(render("""

            ==================== ① 后端 application.yml（api-decrypt 节点）====================
            api-decrypt:
              algorithm: SM2
              sm2:
                publicKey: {respPub}
                privateKey: {reqPri}

            ==================== ② Docker compose（粘到每个后端实例的 environment 下）====================
                  API_ENCRYPT_ALGORITHM: "SM2"
                  API_SM2_RESPONSE_PUBLIC_KEY: {respPub}
                  API_SM2_REQUEST_PRIVATE_KEY: {reqPri}

            ==================== ③ 前端 env/.env（plus-ui / plus-uniapp / plus-app 三端相同）====================
            VITE_APP_API_ENCRYPT_ALGORITHM = 'SM2'
            VITE_APP_SM2_PUBLIC_KEY = '{reqPub}'
            VITE_APP_SM2_PRIVATE_KEY = '{respPri}'
            """, reqPub, reqPri, respPub, respPri));
    }

    /**
     * 生成一对 RSA 密钥
     *
     * @return [公钥 Base64(X.509), 私钥 Base64(PKCS#8)]
     */
    private static String[] generateRsaKeyPair() {
        KeyPair pair = SecureUtil.generateKeyPair("RSA", RSA_KEY_SIZE);
        RSA rsa = new RSA(pair.getPrivate(), pair.getPublic());
        return new String[]{rsa.getPublicKeyBase64(), rsa.getPrivateKeyBase64()};
    }

    /**
     * 模拟一次完整的请求 + 响应，证明两对密钥分给前后端后能互通
     *
     * @param server 后端视角：响应公钥 + 请求私钥
     * @param client 前端视角：请求公钥 + 响应私钥
     */
    private static void assertPaired(IApiCryptor server, IApiCryptor client) {
        // 请求：前端加密，后端解密
        String reqKey = client.generateKey();
        String reqHeader = client.encryptKey(reqKey);
        String reqBody = client.encryptBody(SAMPLE_BODY, reqKey);
        assertThat(server.decryptBody(reqBody, server.decryptKey(reqHeader))).isEqualTo(SAMPLE_BODY);

        // 响应：后端加密，前端解密
        String respKey = server.generateKey();
        String respHeader = server.encryptKey(respKey);
        String respBody = server.encryptBody(SAMPLE_BODY, respKey);
        assertThat(client.decryptBody(respBody, client.decryptKey(respHeader))).isEqualTo(SAMPLE_BODY);
    }

    private static String render(String template, String reqPub, String reqPri, String respPub, String respPri) {
        return template
            .replace("{reqPub}", reqPub)
            .replace("{reqPri}", reqPri)
            .replace("{respPub}", respPub)
            .replace("{respPri}", respPri);
    }
}
