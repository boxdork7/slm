/**
 * 手机号绑定请求参数
 */
export interface PhoneBindBo {
  /** 平台类型 */
  platform?: string
  /** 授权码 */
  code: string
}

/**
 * 手机号绑定返回结果
 */
export interface PhoneBindVo {
  /** 手机号 */
  phone: string
}
