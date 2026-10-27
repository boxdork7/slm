package plus.ruoyi.common.encrypt.filter;

import cn.hutool.core.io.IoUtil;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.mock.web.MockHttpServletRequest;
import plus.ruoyi.common.encrypt.core.api.Sm2Sm4ApiCryptor;
import plus.ruoyi.common.test.base.BaseUnitTest;

import java.nio.charset.StandardCharsets;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * 请求解密包装器测试
 *
 * @author 抓蛙师
 */
@DisplayName("DecryptRequestBodyWrapper 请求解密包装器测试")
class DecryptRequestBodyWrapperTest extends BaseUnitTest {

    private static final String HEADER_FLAG = "encrypt-key";

    /**
     * 与 Sm2Sm4ApiCryptorTest 同一组 sm-crypto 生成的请求向量
     */
    private static final String JS_ENCRYPTED_KEY = "04cc44eb4aefd53b533228f4e323f1da38caf3ac5e27b91c7f199e6ee3bda5e297197ec8652a5d7901035efeaa55716ba375291e24ce2a9dc58076d480f67ce74483e682840abb59793c61ac031ae17d659165a3c4bf194defcf6be0a4c5b1617578f556196fbd53fcbf080888aaf86ed6";
    private static final String JS_ENCRYPTED_BODY = "219494d802c06eb4ce03663648ea9491e63551b48f8cf8cecd832575096e44388291836723eb9d3f82b00a6a3426bc45fcf22e5992c314e19c9cf3509da35ae6";

    private final Sm2Sm4ApiCryptor cryptor = new Sm2Sm4ApiCryptor(
        "04c5f053276fc40c4207a9afc692674563a7ce6ee528f90267e6702f7396862acd6fef5566bbfdf5776d3660034feff9de3d9fb3d91c20cbcbd77e4b79f1edf788",
        "ceefcceb535f94666532586ccf3a45f77548c100f955e69dd9202b08ccfb24e4");

    /**
     * axios 以 application/json 发送字符串报文时会再 JSON.stringify 一次，请求体变成带双引号的字符串，
     * 端到端登录测试中实际抓到过这种报文；uni.request 则原样发送。两种都必须能解。
     */
    @ParameterizedTest
    @DisplayName("测试请求体-裸密文与axios加引号密文都能解密")
    @ValueSource(strings = {"", "\""})
    void testDecryptQuotedAndRawBody(String quote) throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/auth/userLogin");
        request.addHeader(HEADER_FLAG, JS_ENCRYPTED_KEY);
        request.setContent((quote + JS_ENCRYPTED_BODY + quote).getBytes(StandardCharsets.UTF_8));

        DecryptRequestBodyWrapper wrapper = new DecryptRequestBodyWrapper(request, cryptor, HEADER_FLAG);

        String body = IoUtil.read(wrapper.getInputStream(), StandardCharsets.UTF_8);
        assertThat(body).isEqualTo("{\"userName\":\"张三\",\"remark\":\"国密互通测试 SM2+SM4\"}");
    }
}
