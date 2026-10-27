/**
 * Base64编码工具类
 * 支持标准Base64和URL安全的Base64编码
 */

/** Base64字符集 */
const _b64chars: string[] = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/']

/**
 * 将字符串转换为UTF-8字节序列
 * @param src 源字符串
 * @returns UTF-8编码的字符串
 */
const utob = (src: string): string => {
  const encoded = encodeURIComponent(src)
  return encoded.replace(/%([0-9A-Fa-f]{2})/g, (match, hex) => {
    return String.fromCharCode(Number.parseInt(hex, 16))
  })
}
/**
 * 将标准Base64转换为URL安全格式
 * 替换 + 为 -，/ 为 _，并移除末尾的 = 填充字符
 * @param src 标准Base64字符串
 * @returns URL安全的Base64字符串
 */
const _mkUriSafe = (src: string): string =>
  src.replace(/[+/]/g, (m0: string) => (m0 === '+' ? '-' : '_')).replace(/=+$/m, '')

/**
 * 从Uint8Array转换为Base64字符串
 * @param src 字节数组
 * @param rfc4648 是否使用RFC4648 URL安全格式
 * @returns Base64编码字符串
 */
const fromUint8Array = (src: Uint8Array, rfc4648 = false): string => {
  let b64 = ''
  for (let i = 0, l = src.length; i < l; i += 3) {
    // 读取3个字节
    const [a0, a1, a2] = [src[i], src[i + 1], src[i + 2]]
    // 将3个字节合并为24位整数
    const ord = (a0 << 16) | (a1 << 8) | a2

    // 将24位分解为4个6位值，对应Base64字符
    b64 += _b64chars[ord >>> 18]
    b64 += _b64chars[(ord >>> 12) & 63]
    b64 += typeof a1 !== 'undefined' ? _b64chars[(ord >>> 6) & 63] : '='
    b64 += typeof a2 !== 'undefined' ? _b64chars[ord & 63] : '='
  }
  return rfc4648 ? _mkUriSafe(b64) : b64
}

/**
 * Base64编码函数
 * 优先使用浏览器原生btoa，否则使用自定义实现
 */
const _btoa: (s: string) => string =
  typeof btoa === 'function'
    ? (s: string) => btoa(s)
    : (s: string) => {
        // 检查字符串是否包含非Latin-1字符
        if (s.charCodeAt(0) > 255) {
          throw new RangeError('The string contains invalid characters.')
        }
        // 将字符串转换为字节数组后编码
        return fromUint8Array(Uint8Array.from(s, (c: string) => c.charCodeAt(0)))
      }

/**
 * 将字符串编码为Base64格式
 * @param src 要编码的字符串
 * @param rfc4648 是否使用RFC4648 URL安全格式（默认false）
 * @returns Base64编码后的字符串
 *
 * @example
 * ```typescript
 * // 标准Base64编码
 * const encoded1 = encode('Hello World!') // 'SGVsbG8gV29ybGQh'
 *
 * // URL安全Base64编码
 * const encoded2 = encode('Hello World!', true) // 'SGVsbG8gV29ybGQh'
 *
 * // 包含特殊字符的编码
 * const encoded3 = encode('你好世界') // '5L2g5aW95LiW55WM'
 * ```
 */
export const encode = (src: string, rfc4648 = false): string => {
  // 先将字符串转换为UTF-8字节序列，然后进行Base64编码
  const b64 = _btoa(utob(src))
  return rfc4648 ? _mkUriSafe(b64) : b64
}
