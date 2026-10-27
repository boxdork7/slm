// utils/tenant.ts

import { cache } from '@/utils/cache'

/**
 * 租户管理工具
 * 提供租户ID的获取、设置和管理功能
 */

export const TENANT_STORAGE_KEY = 'tenantId'
export const DEFAULT_TENANT_ID = '000000'

/**
 * 设置租户ID
 */
export const setTenantId = (tenantId: string): void => {
  if (tenantId && tenantId.trim()) {
    cache.set(TENANT_STORAGE_KEY, tenantId.trim())
  }
}

/**
 * 清除租户ID
 */
export const clearTenantId = (): void => {
  cache.remove(TENANT_STORAGE_KEY)
}

/**
 * 从URL获取租户ID (H5环境)
 */
// #ifdef H5
const getTenantIdFromUrl = (): string | null => {
  try {
    const urlParams = new URLSearchParams(window.location.search)

    // 直接获取 tenantId 参数
    let tenantId = urlParams.get('tenantId')
    if (tenantId) {
      return tenantId
    }

    // 检查 redirect 参数中是否包含 tenantId
    const redirect = urlParams.get('redirect')
    if (redirect) {
      const decodedRedirect = decodeURIComponent(redirect)
      const [_, query] = decodedRedirect.split('?')
      if (query) {
        const redirectParams = new URLSearchParams(query)
        tenantId = redirectParams.get('tenantId')
        if (tenantId) {
          return tenantId
        }
      }
    }

    return null
  } catch (error) {
    console.warn('从URL获取租户ID失败:', error)
    return null
  }
}
// #endif

/**
 * 从App启动参数获取租户ID
 */
// #ifdef APP-PLUS
const getTenantIdFromApp = (): string | null => {
  try {
    // App环境下可以从多个来源获取租户ID

    // 1. 从启动参数获取
    // const args = plus.runtime.arguments
    // if (args && args.includes('tenantId=')) {
    //   const match = args.match(/tenantId=([^&]+)/)
    //   if (match) {
    //     return match[1]
    //   }
    // }

    // 2. 从推送消息payload获取
    // 这里需要根据具体的推送服务来实现

    // 3. 从自定义URL Scheme获取
    // 如果App支持通过自定义协议启动

    return null
  } catch (error) {
    console.warn('从App启动参数获取租户ID失败:', error)
    return null
  }
}
// #endif

/**
 * 获取当前租户ID
 */
export const getTenantId = (): string => {
  // 1. 优先从本地存储获取
  let tenantId = cache.get(TENANT_STORAGE_KEY)
  if (tenantId) {
    return tenantId
  }

  // 2. H5环境下从URL参数获取
  // #ifdef H5
  tenantId = getTenantIdFromUrl()
  if (tenantId) {
    setTenantId(tenantId)
    return tenantId
  }
  // #endif

  // 3. App环境下从启动参数获取
  // #ifdef APP-PLUS
  tenantId = getTenantIdFromApp()
  if (tenantId) {
    setTenantId(tenantId)
    return tenantId
  }
  // #endif

  // 5. 返回默认租户ID
  return DEFAULT_TENANT_ID
}

/**
 * 检查是否是有效的租户ID
 */
export const isValidTenantId = (tenantId?: string): boolean => {
  const id = tenantId || getTenantId()
  return !!(id && id.trim() && id !== DEFAULT_TENANT_ID)
}

/**
 * 获取租户相关的请求头
 */
export const getTenantHeaders = (): Record<string, string> => {
  const tenantId = getTenantId()
  return isValidTenantId(tenantId) ? { 'X-Tenant-Id': tenantId } : {}
}

/**
 * 租户常量
 */
export const TENANT_CONFIG = {
  STORAGE_KEY: TENANT_STORAGE_KEY,
  DEFAULT_ID: DEFAULT_TENANT_ID,
} as const
