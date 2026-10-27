package plus.ruoyi.common.encrypt.core.api;

import plus.ruoyi.common.encrypt.utils.EncryptUtils;

/**
 * RSA + AES 接口加解密器（默认算法，与历史版本前端完全兼容）
 * <p>
 * 报文格式沿用原实现：请求头 = RSA(Base64(32 位 AES 密钥))，报文 = AES-ECB-PKCS7 的 Base64 密文。
 *
 * @author 抓蛙师
 */
public class RsaAesApiCryptor implements IApiCryptor {

    /**
     * AES-256 密钥长度（字符数，UTF-8 下即 32 字节）
     */
    private static final int AES_KEY_LENGTH = 32;

    /**
     * RSA 公钥：加密响应中的 AES 密钥，对应前端解密私钥
     */
    private final String publicKey;

    /**
     * RSA 私钥：解密请求中的 AES 密钥，对应前端加密公钥
     */
    private final String privateKey;

    public RsaAesApiCryptor(String publicKey, String privateKey) {
        this.publicKey = publicKey;
        this.privateKey = privateKey;
    }

    @Override
    public String generateKey() {
        return ApiCryptoKeys.randomKey(AES_KEY_LENGTH);
    }

    @Override
    public String encryptKey(String key) {
        // 前端按"RSA 解密 → Base64 解码"取密钥，这里保持对称
        return EncryptUtils.encryptByRsa(EncryptUtils.encryptByBase64(key), publicKey);
    }

    @Override
    public String decryptKey(String encryptedKey) {
        return EncryptUtils.decryptByBase64(EncryptUtils.decryptByRsa(encryptedKey, privateKey));
    }

    @Override
    public String encryptBody(String body, String key) {
        return EncryptUtils.encryptByAes(body, key);
    }

    @Override
    public String decryptBody(String body, String key) {
        return EncryptUtils.decryptByAes(body, key);
    }
}
