package plus.ruoyi.common.encrypt.core.api;

import cn.hutool.core.util.RandomUtil;

import java.security.SecureRandom;

/**
 * 接口加密的对称密钥生成工具
 *
 * @author 抓蛙师
 */
final class ApiCryptoKeys {

    /**
     * 只用字母数字：密钥按 UTF-8 取字节，限定为单字节字符才能保证"字符数 = 字节数"
     */
    private static final String KEY_CHARS = RandomUtil.BASE_CHAR_NUMBER + RandomUtil.BASE_CHAR.toUpperCase();

    private ApiCryptoKeys() {
    }

    /**
     * 生成指定长度的随机密钥
     * <p>
     * 用 SecureRandom 而非 {@code RandomUtil.randomString}：后者基于 ThreadLocalRandom，输出可被预测，不适合做密钥。
     *
     * @param length 密钥字符数（AES 用 32，SM4 用 16）
     * @return 由字母数字组成的随机密钥
     */
    static String randomKey(int length) {
        SecureRandom random = RandomUtil.getSecureRandom();
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(KEY_CHARS.charAt(random.nextInt(KEY_CHARS.length())));
        }
        return sb.toString();
    }
}
