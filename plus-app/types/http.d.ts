// types/http.d.ts
/**
 * HTTP 请求相关类型定义
 * 用于替代 PC 端的 axios.d.ts
 */

/**
 * 自定义请求头接口
 */
export interface CustomHeaders {
  /** 是否需要认证，默认 true */
  auth?: boolean
  /** 是否需要租户ID，默认 true */
  tenant?: boolean
  /** 是否防止重复提交，默认 true */
  repeatSubmit?: boolean
  /** 是否加密请求数据 */
  isEncrypt?: boolean

  /** 其他自定义头部 */
  [key: string]: any
}

/**
 * 自定义请求选项
 */
export interface CustomRequestOptions extends Partial<UniApp.RequestOptions> {
  /** 查询参数 */
  query?: Record<string, any>
  /** 查询参数 */
  params?: Record<string, any>
  /** 自定义头部 这里带s做区分,不需要提供给request请求 */
  header?: CustomHeaders

  /** 是否跳过等待应用初始化 */
  skipWait?: boolean
  /** 初始化超时时间（毫秒），默认10秒 */
  initTimeout?: number
}
