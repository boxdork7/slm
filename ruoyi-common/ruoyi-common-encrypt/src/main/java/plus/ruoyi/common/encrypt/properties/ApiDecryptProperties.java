package plus.ruoyi.common.encrypt.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import plus.ruoyi.common.encrypt.enumd.ApiEncryptAlgorithm;

/**
 * API加解密配置属性类
 * <p>
 * 对应配置文件中的api-decrypt前缀配置项
 * <p>
 * 配置示例：
 * <pre>
 * api-decrypt:
 *   enabled: true                           # 是否启用API加解密
 *   header-flag: "encrypt-key"              # 请求头中加密密钥的标识
 *   public-key: "MIIBIjANBgkqhkiG9w0..."   # RSA公钥（加密AES密钥）
 *   private-key: "MIIEvQIBADANBgkqhkiG..."  # RSA私钥（解密AES密钥）
 * </pre>
 * <p>
 * 工作原理：
 * 1. 客户端生成AES密钥，用RSA公钥加密后放入请求头
 * 2. 服务端用RSA私钥解密获得AES密钥
 * 3. 用AES密钥解密请求体数据
 * 4. 响应时重新生成AES密钥加密响应体
 * 5. 用RSA公钥加密新的AES密钥放入响应头
 *
 * @author wdhcr
 */
@Data
@ConfigurationProperties(prefix = "api-decrypt")
public class ApiDecryptProperties {

    /**
     * API加解密功能开关
     * <p>
     * true: 启用API请求响应加解密
     * false: 禁用API加解密功能
     */
    private Boolean enabled;

    /**
     * 请求头中加密密钥的标识字段名
     * <p>
     * 客户端需要将加密后的AES密钥放入此请求头中
     * 服务端根据此标识获取加密密钥进行解密
     * <p>
     * 示例：encrypt-key、crypto-key等
     */
    private String headerFlag;

    /**
     * RSA公钥（用于加密响应中的AES密钥）
     * <p>
     * 服务端用此公钥加密生成的AES密钥，放入响应头返回给客户端
     */
    private String publicKey;

    /**
     * RSA私钥（用于解密请求中的AES密钥）
     * <p>
     * 服务端用此私钥解密请求头中的AES密钥，然后解密请求体
     */
    private String privateKey;

    /**
     * 传输加密算法组合
     * <p>
     * RSA: RSA + AES（默认，兼容历史版本）；SM2: SM2 + SM4（国密）。
     * 必须与前端 VITE_APP_API_ENCRYPT_ALGORITHM 一致。
     */
    private ApiEncryptAlgorithm algorithm = ApiEncryptAlgorithm.RSA;

    /**
     * SM2 密钥对（algorithm=SM2 时生效）
     * <p>
     * 与 RSA 密钥分开配置，切换算法时只改 algorithm 一个开关
     */
    private Sm2 sm2 = new Sm2();

    /**
     * SM2 密钥配置，均为 Hex 原始格式（与前端 sm-crypto 生成的格式一致）
     */
    @Data
    public static class Sm2 {

        /**
         * SM2 公钥（04+x+y，130 位 Hex）：加密响应中的 SM4 密钥，对应前端解密私钥
         */
        private String publicKey;

        /**
         * SM2 私钥（64 位 Hex）：解密请求中的 SM4 密钥，对应前端加密公钥
         */
        private String privateKey;
    }
}
