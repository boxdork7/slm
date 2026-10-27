/**
 * 系统功能配置 API
 */

import { withHeaders } from '@/utils/function'

/**
 * 系统功能配置
 */
export interface SystemFeature {
  /** langchain4j 是否启用 */
  langchain4jEnabled: boolean
  /** WebSocket 是否启用 */
  websocketEnabled: boolean
  /** SSE (Server-Sent Events) 是否启用 */
  sseEnabled: boolean
}

/**
 * 获取系统功能配置
 * @returns {Result<SystemFeature>} 结果
 */
export const getSystemFeatures = (): Result<SystemFeature> => {
  return http.get<SystemFeature>(
    '/common/system/features',
    {},
    withHeaders(
      {
        auth: false
      },
      {
        skipWait: true, // 跳过等待租户初始化，因为此接口在初始化之前调用
      }
    )
  )
}
