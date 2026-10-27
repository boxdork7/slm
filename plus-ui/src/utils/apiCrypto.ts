// 接口传输加解密
/**
 * 接口传输加解密（按 VITE_APP_API_ENCRYPT_ALGORITHM 在 RSA+AES / SM2+SM4 间切换）
 *
 * 混合加密：随机生成对称密钥加密报文，再用非对称公钥加密对称密钥放到请求头。
 * 算法写死在配置里、不与后端协商，避免被降级为强度更低的组合；前后端配置必须一致。
 *
 * - RSA: 请求头 = RSA(Base64(32 位 AES 密钥))，报文 = AES-ECB 的 Base64 密文（与历史版本完全一致）
 * - SM2: 请求头 = SM2(16 位 SM4 密钥)，报文 = SM4-ECB 的 Hex 密文
 */
import { SystemConfig } from '@/systemConfig'
import { encodeBase64, decodeBase64, encryptWithAes, generateAesKey, decryptWithAes } from '@/utils/crypto'
import { rsaEncrypt, rsaDecrypt } from '@/utils/rsa'
import { generateSm4Key, sm2Encrypt, sm2Decrypt, sm4Encrypt, sm4Decrypt } from '@/utils/sm'

/** 加密后的请求 */
export interface EncryptedRequest {
  /** 放入加密请求头的密钥密文 */
  encryptedKey: string
  /** 报文密文 */
  body: string
}

const isSm2 = (): boolean => SystemConfig.security.apiEncryptAlgorithm === 'SM2'

/**
 * 加密请求报文
 * @param {string} plainText - 报文明文（对象需先 JSON.stringify）
 * @returns {EncryptedRequest} 请求头密钥密文与报文密文
 * @throws 公钥未配置或非法时抛出
 */
export const encryptApiRequest = (plainText: string): EncryptedRequest => {
  if (isSm2()) {
    const sm4Key = generateSm4Key()
    return { encryptedKey: sm2Encrypt(sm4Key), body: sm4Encrypt(plainText, sm4Key) }
  }
  const aesKey = generateAesKey()
  const encryptedKey = rsaEncrypt(encodeBase64(aesKey))
  if (!encryptedKey) {
    throw new Error('RSA加密失败，请检查公钥配置')
  }
  return { encryptedKey, body: encryptWithAes(plainText, aesKey) }
}

/**
 * 解密响应报文
 * @param {string} encryptedKey - 响应头中的密钥密文
 * @param {string} body - 报文密文
 * @returns {string} 报文明文（JSON 字符串）
 * @throws 私钥不匹配或密文损坏时抛出
 */
export const decryptApiResponse = (encryptedKey: string, body: string): string => {
  if (isSm2()) {
    return sm4Decrypt(body, sm2Decrypt(encryptedKey))
  }
  const base64Str = rsaDecrypt(encryptedKey)
  if (!base64Str) {
    throw new Error('RSA解密失败，请检查前后端密钥是否成对')
  }
  return decryptWithAes(body, decodeBase64(base64Str))
}
