/**
 * 平台工具类
 */

export const platform = __UNI_PLATFORM__
export const isApp = __UNI_PLATFORM__ === 'app'
export const isMp = __UNI_PLATFORM__.startsWith('mp-')
export const isMpWeixin = __UNI_PLATFORM__.startsWith('mp-weixin')
export const isMpAlipay = __UNI_PLATFORM__.startsWith('mp-alipay')
export const isMpToutiao = __UNI_PLATFORM__.startsWith('mp-toutiao')

/**
 * 安全的 User Agent 检测 - 兼容所有平台
 */
const safeGetUserAgent = (): string => {
  // 小程序环境没有 navigator，返回空字符串
  if (isMp || isApp) {
    return ''
  }

  // H5 环境才获取 navigator.userAgent
  try {
    return typeof navigator !== 'undefined' && navigator.userAgent
      ? navigator.userAgent.toLowerCase()
      : ''
  } catch (error) {
    console.warn('获取 userAgent 失败:', error)
    return ''
  }
}

/**
 * 安全的 location 检测 - 兼容所有平台
 */
const safeGetLocation = () => {
  // 小程序和 APP 环境没有 window.location
  if (isMp || isApp) {
    return {
      hostname: '',
      protocol: '',
      href: '',
      search: '',
      pathname: '',
    }
  }

  // H5 环境才获取 window.location
  try {
    if (typeof window !== 'undefined' && window.location) {
      return window.location
    }
  } catch (error) {
    console.warn('获取 location 失败:', error)
  }

  return {
    hostname: '',
    protocol: '',
    href: '',
    search: '',
    pathname: '',
  }
}

// 判断是否在微信公众号内的H5
export const isWechatOfficialH5 = (() => {
  if (__UNI_PLATFORM__ !== 'h5') return false

  const ua = safeGetUserAgent()
  return ua.includes('micromessenger') && !ua.includes('miniprogram')
})()

// 判断是否在支付宝内的H5
export const isAlipayOfficialH5 = (() => {
  if (__UNI_PLATFORM__ !== 'h5') return false

  const ua = safeGetUserAgent()
  return ua.includes('alipayclient')
})()

// 普通H5 (排除在微信、支付宝等容器内的H5)
export const isH5 = __UNI_PLATFORM__ === 'h5' && !isWechatOfficialH5 && !isAlipayOfficialH5

/**
 * 检查是否在微信环境中
 */
export const isWechatEnvironment = (): boolean => {
  // 微信小程序
  if (isMpWeixin) {
    return true
  }

  // H5 环境检查 User Agent
  if (__UNI_PLATFORM__ === 'h5') {
    const ua = safeGetUserAgent()
    return ua.includes('micromessenger')
  }

  // APP 环境可以通过其他方式判断，这里暂时返回 false
  return false
}

/**
 * 检查是否在支付宝环境中 - 兼容所有平台
 */
export const isAlipayEnvironment = (): boolean => {
  // 支付宝小程序
  if (isMpAlipay) {
    return true
  }

  // H5 环境检查 User Agent
  if (__UNI_PLATFORM__ === 'h5') {
    const ua = safeGetUserAgent()
    return ua.includes('alipayclient')
  }

  return false
}

/**
 * 检查是否在开发环境或微信开发者工具中
 */
export const isInDevTools = (): boolean => {
  // 小程序环境的开发者工具判断
  if (isMp) {
    // 可以通过 uni.getAccountInfoSync() 获取小程序环境信息
    try {
      // #ifdef MP
      const accountInfo = uni.getAccountInfoSync()
      return accountInfo.miniProgram.envVersion === 'develop'
      // #endif
    } catch (error) {
      console.warn('获取小程序环境信息失败:', error)
    }
    return false
  }

  // APP 环境通常没有开发者工具的概念
  if (isApp) {
    return false
  }

  // H5 环境的开发者工具判断 - 主要检测微信开发者工具
  if (__UNI_PLATFORM__ === 'h5') {
    const ua = safeGetUserAgent()

    // 检查是否在微信开发者工具中
    if (ua.includes('wechatdevtools')) {
      return true
    }

    // 检查是否在支付宝开发者工具中
    if (ua.includes('alipaydevtools')) {
      return true
    }
  }

  return false
}

/**
 * 检查当前页面URL是否符合支付授权目录格式 - 仅 H5 环境有效
 */
export const checkPaymentUrl = (): { isValid: boolean; currentUrl: string; suggestion: string } => {
  // 非 H5 环境直接返回有效
  if (__UNI_PLATFORM__ !== 'h5') {
    return {
      isValid: true,
      currentUrl: '',
      suggestion: '当前为非H5环境，无需配置支付授权目录'
    }
  }

  const location = safeGetLocation()
  const currentUrl = location.href
  const { protocol, hostname, pathname } = location

  // 获取当前页面的目录（不包括文件名）
  const directory = pathname.substring(0, pathname.lastIndexOf('/') + 1) || '/'
  const baseUrl = `${protocol}//${hostname}`
  const fullDirectoryUrl = `${baseUrl}${directory}`

  let suggestion = ''

  if (isInDevTools()) {
    suggestion = `当前在开发者工具中 (${currentUrl})，请配置线上环境的支付授权目录`
  } else {
    suggestion = `请在微信商户平台配置以下任意一种授权目录：
1. 顶级域名（推荐）: ${baseUrl}/
2. 具体目录: ${fullDirectoryUrl}

配置路径：微信支付商户平台 → 产品中心 → 开发配置 → 支付配置 → JSAPI支付授权目录`
  }

  return {
    isValid: !isInDevTools(), // 开发者工具中总是无效的
    currentUrl,
    suggestion,
  }
}

/**
 * 安全的 URL 参数获取 - 兼容所有平台
 */
export const safeGetUrlParams = (key: string): string | null => {
  // 小程序和 APP 环境没有 URL 参数概念
  if (isMp || isApp) {
    return null
  }

  // H5 环境才获取 URL 参数
  try {
    const location = safeGetLocation()
    if (location.search) {
      const urlParams = new URLSearchParams(location.search)
      return urlParams.get(key)
    }
  } catch (error) {
    console.warn('获取 URL 参数失败:', error)
  }

  return null
}

/**
 * 安全的 WeixinJSBridge 检测 - 仅 H5 环境有效
 */
export const hasWeixinJSBridge = (): boolean => {
  // 非 H5 环境直接返回 false
  if (__UNI_PLATFORM__ !== 'h5') {
    return false
  }

  try {
    return typeof window !== 'undefined' &&
           typeof window.WeixinJSBridge !== 'undefined'
  } catch (error) {
    return false
  }
}

const PLATFORM = {
  platform,
  isH5, // 普通浏览器H5
  isApp,
  isMp,
  isMpWeixin,
  isMpAlipay,
  isMpToutiao,
  isWechatOfficialH5, // 微信公众号H5
  isAlipayOfficialH5, // 支付宝H5

  // 环境检测函数
  isWechatEnvironment,
  isAlipayEnvironment,
  isInDevTools,
  checkPaymentUrl,
  safeGetUrlParams,
  hasWeixinJSBridge,
}

export default PLATFORM
