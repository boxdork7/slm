package plus.ruoyi.common.encrypt.core.api;

/**
 * 接口传输加解密器
 * <p>
 * 抽象"非对称算法传递对称密钥 + 对称算法加密报文"的混合加密流程，
 * 让 {@code CryptoFilter} 与请求/响应包装器不再写死具体算法，按配置切换 RSA+AES 或 SM2+SM4。
 * <p>
 * 请求方向：客户端生成对称密钥 → 公钥加密后放请求头 → 服务端 {@link #decryptKey} 取回密钥 → {@link #decryptBody} 解密报文。<br>
 * 响应方向：服务端 {@link #generateKey} → {@link #encryptKey} 放响应头 → {@link #encryptBody} 加密报文 → 客户端用私钥取回密钥解密。
 *
 * @author 抓蛙师
 */
public interface IApiCryptor {

    /**
     * 生成一次性的对称密钥（每次响应都重新生成）
     *
     * @return 对称密钥明文
     */
    String generateKey();

    /**
     * 用服务端持有的公钥加密对称密钥，结果放入响应头
     *
     * @param key 对称密钥明文
     * @return 加密后的密钥
     */
    String encryptKey(String key);

    /**
     * 用服务端私钥解密请求头中的对称密钥
     *
     * @param encryptedKey 请求头中的加密密钥
     * @return 对称密钥明文
     * @throws RuntimeException 私钥不匹配或密文被篡改时抛出
     */
    String decryptKey(String encryptedKey);

    /**
     * 用对称密钥加密响应报文
     *
     * @param body 报文明文
     * @param key  对称密钥明文
     * @return 报文密文
     */
    String encryptBody(String body, String key);

    /**
     * 用对称密钥解密请求报文
     *
     * @param body 报文密文
     * @param key  对称密钥明文
     * @return 报文明文
     * @throws RuntimeException 密钥错误或密文格式非法时抛出
     */
    String decryptBody(String body, String key);
}
