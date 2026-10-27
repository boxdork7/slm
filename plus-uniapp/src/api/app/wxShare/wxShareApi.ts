// 微信分享 API
import type { JsApiSignature } from './wxShareTypes'

/**
 * 获取微信JS-SDK签名配置
 * @param url 当前页面URL（完整URL，包含协议、域名、路径、参数，但不包含hash）
 * @returns JS-SDK签名配置
 */
export const getJsApiSignature = (url: string) => {
  return http.get<JsApiSignature>('/app/wxShare/getJsApiSignature', { url })
}
