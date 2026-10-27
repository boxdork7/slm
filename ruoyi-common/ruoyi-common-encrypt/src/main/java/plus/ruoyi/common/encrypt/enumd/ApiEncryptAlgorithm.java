package plus.ruoyi.common.encrypt.enumd;

/**
 * 接口传输加密算法组合
 * <p>
 * 接口加密采用"非对称加密传递对称密钥 + 对称加密报文"的混合方式，
 * 因此这里的每个取值都是一组算法组合，而非单一算法。
 * <p>
 * 前后端必须配置为同一取值：后端 {@code api-decrypt.algorithm}，前端 {@code VITE_APP_API_ENCRYPT_ALGORITHM}。
 * 不做运行时协商，避免请求方把算法降级为强度更低的组合。
 *
 * @author 抓蛙师
 */
public enum ApiEncryptAlgorithm {

    /**
     * RSA 加密 AES 密钥 + AES 加密报文（默认，兼容历史版本）
     */
    RSA,

    /**
     * SM2 加密 SM4 密钥 + SM4 加密报文（国密，满足信创/密评要求）
     */
    SM2
}
