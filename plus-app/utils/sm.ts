/**
 * 国密 SM2/SM4 加解密工具（基于 sm-crypto）
 *
 * 参考文档 https://www.npmjs.com/package/sm-crypto
 * 与后端 Hutool 的格式约定（两端必须一致，否则必然解密失败）：
 * - SM2 密文模式 C1C3C2（sm-crypto cipherMode = 1，Hutool 默认）
 * - SM2 密文 Hex：后端收发都带 04 前缀，sm-crypto 不带，所以加密后补 04、解密前去 04
 * - SM2 密钥 Hex 原始格式：公钥 04+x+y（130 位），私钥 d（64 位）
 * - SM4 为 ECB + PKCS#7，密钥是 16 位字母数字字符串（UTF-8 字节即 128 bit），密文 Hex
 *
 * 必须从 @/utils/smCrypto 引入 sm-crypto，不能直接 import 'sm-crypto'：小程序 / APP 需要先装随机数补丁
 */
import { SystemConfig } from '@/systemConfig'
import { sm2, sm4 } from '@/utils/smCrypto'

/** C1C3C2，与 Hutool 默认模式一致 */
const SM2_CIPHER_MODE = 1

/** 后端密文中 C1 为非压缩点，固定以 04 开头 */
const SM2_C1_PREFIX = '04'

/** SM4 密钥长度（字符数） */
const SM4_KEY_LENGTH = 16

const KEY_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

/**
 * ASCII 字符串转 Hex（sm-crypto 的 sm4 密钥参数要求 Hex）
 * 不用 TextEncoder：微信小程序没有该 API；密钥只含字母数字，逐字符转换与 UTF-8 编码结果一致
 */
const asciiToHex = (str: string): string => {
  let hex = ''
  for (let i = 0; i < str.length; i++) {
    hex += str.charCodeAt(i).toString(16).padStart(2, '0')
  }
  return hex
}

/**
 * 生成 SM4 密钥
 * @returns {string} 16 位字母数字密钥
 */
export const generateSm4Key = (): string => {
  // 丢弃 >= 248 的字节（248 = 62 * 4），避免取模后前几个字符概率偏高
  const limit = 256 - (256 % KEY_CHARS.length)
  const buf = new Uint8Array(1)
  let key = ''
  while (key.length < SM4_KEY_LENGTH) {
    // 走 globalThis 而非裸 crypto：小程序里补丁挂在 globalThis 上，裸标识符不一定能解析到
    ;(globalThis as any).crypto.getRandomValues(buf)
    if (buf[0] < limit) {
      key += KEY_CHARS.charAt(buf[0] % KEY_CHARS.length)
    }
  }
  return key
}

/**
 * 使用 SM2 公钥加密文本
 * @param {string} txt - 要加密的文本
 * @param {string} [pubKey] - 可选的自定义公钥，不提供则使用环境变量中的默认公钥
 * @returns {string} 带 04 前缀的 Hex 密文（后端 Hutool 可直接解密）
 * @throws 公钥非法时抛出，由调用方统一处理
 */
export const sm2Encrypt = (txt: string, pubKey?: string): string => {
  return SM2_C1_PREFIX + sm2.doEncrypt(txt, pubKey || SystemConfig.security.sm2PublicKey, SM2_CIPHER_MODE)
}

/**
 * 使用 SM2 私钥解密后端返回的密文
 * @param {string} hex - 后端返回的带 04 前缀的 Hex 密文
 * @param {string} [privKey] - 可选的自定义私钥，不提供则使用环境变量中的默认私钥
 * @returns {string} 明文；密钥不匹配时 sm-crypto 返回空串，这里转为抛错，避免把空密钥当成功
 */
export const sm2Decrypt = (hex: string, privKey?: string): string => {
  // 不能按"是否以 04 开头"判断：sm-crypto 自己的输出也可能恰好以 04 开头，后端密文则恒带前缀
  const result = sm2.doDecrypt(
    hex.substring(SM2_C1_PREFIX.length),
    privKey || SystemConfig.security.sm2PrivateKey,
    SM2_CIPHER_MODE,
  )
  if (!result) {
    throw new Error('SM2解密失败，请检查前后端密钥是否成对')
  }
  return result
}

/**
 * 使用 SM4 加密文本
 * @param {string} txt - 要加密的文本
 * @param {string} key - 16 位字符串密钥
 * @returns {string} Hex 密文
 */
export const sm4Encrypt = (txt: string, key: string): string => {
  return sm4.encrypt(txt, asciiToHex(key))
}

/**
 * 使用 SM4 解密文本
 * @param {string} hex - Hex 密文
 * @param {string} key - 16 位字符串密钥
 * @returns {string} 明文
 */
export const sm4Decrypt = (hex: string, key: string): string => {
  return sm4.decrypt(hex, asciiToHex(key))
}
