package plus.ruoyi.common.encrypt.filter;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletResponse;
import plus.ruoyi.common.encrypt.core.api.Sm2Sm4ApiCryptor;
import plus.ruoyi.common.test.base.BaseUnitTest;

import java.nio.charset.StandardCharsets;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * 响应加密包装器测试
 * <p>
 * 重点是字符集：缓冲区写入 / 读出必须固定 UTF-8，不能依赖 JVM 默认编码。
 * 真正出问题的是 OutputStream 路径：Spring JSON 转换器写入 UTF-8 字节，若按 GBK 默认编码读出，
 * 「操作成功」会变成「閹垮秳缍旈幋鎰」。
 * <p>
 * 局限：根 pom 的 surefire argLine 写死了 -Dfile.encoding=UTF-8（命令行 -DargLine 覆盖不了），
 * 测试 JVM 默认编码恒为 UTF-8，本类在测试环境下对「去掉固定字符集」不敏感，主要防功能回退。
 * 非 UTF-8 环境的验证需脱离 surefire，用 java -Dfile.encoding=COMPAT 直接调用本包装器。
 *
 * @author 抓蛙师
 */
@DisplayName("EncryptResponseBodyWrapper 响应加密包装器测试")
class EncryptResponseBodyWrapperTest extends BaseUnitTest {

    private static final String HEADER_FLAG = "encrypt-key";

    private static final String BODY = "{\"code\":200,\"msg\":\"操作成功\",\"data\":{\"nick\":\"国密测试😀\"}}";

    /**
     * 后端视角：响应公钥 + 请求私钥
     */
    private final Sm2Sm4ApiCryptor server = new Sm2Sm4ApiCryptor(
        "04c5f053276fc40c4207a9afc692674563a7ce6ee528f90267e6702f7396862acd6fef5566bbfdf5776d3660034feff9de3d9fb3d91c20cbcbd77e4b79f1edf788",
        "ceefcceb535f94666532586ccf3a45f77548c100f955e69dd9202b08ccfb24e4");

    /**
     * 前端视角：请求公钥 + 响应私钥
     */
    private final Sm2Sm4ApiCryptor client = new Sm2Sm4ApiCryptor(
        "04b545121b1aed3c7c59b25f8da50b1af7080cc0a7438fa095f8ce95ea61afd6b75170ac82241894f604cb4e1b3c3dbb09125c17497805ce0b5c54381baeea5897",
        "261af8bdfd10e14b8d87b04bc4e42c6fc44e3c41380cf4346b4bfa87afa74e92");

    @Test
    @DisplayName("测试字符集-经 Writer 写入的中文加密后可被前端正确解密")
    void testWriterChineseRoundTrip() throws Exception {
        MockHttpServletResponse response = new MockHttpServletResponse();
        EncryptResponseBodyWrapper wrapper = new EncryptResponseBodyWrapper(response);
        wrapper.getWriter().write(BODY);

        String encryptedBody = wrapper.getEncryptContent(response, server, HEADER_FLAG);

        String key = client.decryptKey(response.getHeader(HEADER_FLAG));
        assertThat(client.decryptBody(encryptedBody, key)).isEqualTo(BODY);
        assertThat(response.getCharacterEncoding()).isEqualToIgnoringCase("UTF-8");
    }

    @Test
    @DisplayName("测试字符集-经 OutputStream 写入的 UTF-8 字节按 UTF-8 读出")
    void testOutputStreamUtf8Bytes() throws Exception {
        MockHttpServletResponse response = new MockHttpServletResponse();
        EncryptResponseBodyWrapper wrapper = new EncryptResponseBodyWrapper(response);
        // Spring 的 JSON 消息转换器走 OutputStream，写入的就是 UTF-8 字节
        wrapper.getOutputStream().write(BODY.getBytes(StandardCharsets.UTF_8));

        assertThat(wrapper.getContent()).isEqualTo(BODY);
    }
}
