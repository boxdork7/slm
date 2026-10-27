/**
 * 微信JS-SDK签名配置
 * 用于调用微信分享等JS-SDK接口
 */
export interface JsApiSignature {
  /** 公众号appId */
  appId: string
  /** 时间戳（秒） */
  timestamp: number
  /** 随机字符串 */
  nonceStr: string
  /** 签名 */
  signature: string
  /** 当前网页的URL（不包含#及其后面部分） */
  url?: string
}

/**
 * 微信分享配置
 */
export interface WxShareConfig {
  /** 分享标题 */
  title: string
  /** 分享描述 */
  desc: string
  /** 分享链接（默认为当前页面链接） */
  link?: string
  /** 分享图标URL */
  imgUrl: string
  /** 分享成功回调 */
  success?: () => void
  /** 取消分享回调 */
  cancel?: () => void
}

/**
 * 微信朋友圈分享配置
 */
export interface WxTimelineShareConfig {
  /** 分享标题 */
  title: string
  /** 分享链接（默认为当前页面链接） */
  link?: string
  /** 分享图标URL */
  imgUrl: string
  /** 分享成功回调 */
  success?: () => void
  /** 取消分享回调 */
  cancel?: () => void
}

/**
 * 微信JS-SDK配置选项
 */
export interface WxConfigOptions {
  /** 是否开启调试模式 */
  debug?: boolean
  /** 需要使用的JS接口列表 */
  jsApiList?: string[]
}
