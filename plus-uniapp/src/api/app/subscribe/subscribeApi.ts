// 订阅消息 API
import type { TemplateConfig } from './subscribeTypes'

/**
 * 获取订阅消息模板配置
 * @param appid 小程序appid
 */
export const getTemplateConfigs = (appid: string) => {
  return http.get<TemplateConfig[]>('/app/subscribe/getTemplateConfigs', { appid })
}
