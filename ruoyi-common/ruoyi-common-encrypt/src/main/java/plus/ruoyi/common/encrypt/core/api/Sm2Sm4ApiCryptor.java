package plus.ruoyi.common.encrypt.core.api;

import plus.ruoyi.common.encrypt.utils.EncryptUtils;

/**
 * SM2 + SM4 国密接口加解密器
 * <p>
 * 与前端 sm-crypto 的格式约定（两端必须一致，否则必然解密失败）：
 * <ul>
 *   <li>SM2 密文模式 C1C3C2（Hutool 默认，对应 sm-crypto {@code cipherMode = 1}）</li>
 *   <li>SM2 密文 Hex 编码，<b>带 {@code 04} 前缀</b>：sm-crypto 输出不带，前端加密后补上、解密前去掉</li>
 *   <li>SM2 密钥为 Hex 原始格式：公钥 {@code 04+x+y}（130 位），私钥 d（64 位），与 sm-crypto 生成的格式相同</li>
 *   <li>SM4 为 ECB + PKCS#7，密钥是 16 位字符串（UTF-8 字节即 128 bit），密文 Hex 编码</li>
 *   <li>请求头直接是 SM2(SM4 密钥)，不像 RSA 方案那样再套一层 Base64</li>
 * </ul>
 *
 * @author 抓蛙师
 */
public class Sm2Sm4ApiCryptor implements IApiCryptor {

    /**
     * SM4 密钥长度（字符数，UTF-8 下即 16 字节 = 128 bit）
     */
    private static final int SM4_KEY_LENGTH = 16;

    /**
     * SM2 公钥：加密响应中的 SM4 密钥，对应前端解密私钥
     */
    private final String publicKey;

    /**
     * SM2 私钥：解密请求中的 SM4 密钥，对应前端加密公钥
     */
    private final String privateKey;

    public Sm2Sm4ApiCryptor(String publicKey, String privateKey) {
        this.publicKey = publicKey;
        this.privateKey = privateKey;
    }

    @Override
    public String generateKey() {
        return ApiCryptoKeys.randomKey(SM4_KEY_LENGTH);
    }

    @Override
    public String encryptKey(String key) {
        // Hutool 输出的 C1 为非压缩点，Hex 恒以 04 开头，前端据此固定去掉前两位
        return EncryptUtils.encryptBySm2Hex(key, publicKey);
    }

    @Override
    public String decryptKey(String encryptedKey) {
        return EncryptUtils.decryptBySm2(encryptedKey, privateKey);
    }

    @Override
    public String encryptBody(String body, String key) {
        // 用 Hex 而非 Base64：sm-crypto 的 sm4 原生收发 Hex，前端不必再做编码转换
        return EncryptUtils.encryptBySm4Hex(body, key);
    }

    @Override
    public String decryptBody(String body, String key) {
        return EncryptUtils.decryptBySm4(body, key);
    }
}
