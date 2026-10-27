// 手机号 API
import type { PhoneBindBo, PhoneBindVo } from './phoneTypes'

/**
 * 获取并绑定手机号
 * 通过平台授权码获取用户手机号并自动绑定到当前登录用户
 * @param data 手机号绑定请求参数
 * @returns 绑定结果和手机号信息
 */
export const bindPhone = (data: PhoneBindBo): Result<PhoneBindVo> => {
  return http.post<PhoneBindVo>('/app/phone/bindPhone', data)
}

/**
 * 仅获取手机号（不绑定）
 * 用于需要先获取手机号再进行其他操作的场景
 * @param data 手机号绑定请求参数
 * @returns 手机号信息
 */
export const getPhone = (data: PhoneBindBo): Result<PhoneBindVo> => {
  return http.get<PhoneBindVo>('/app/phone/getPhone', data)
}

/**
 * 解绑手机号
 * 移除用户绑定的手机号信息
 * @returns 解绑结果
 */
export const unbindPhone = (): Result<void> => {
  return http.del<void>('/app/phone/unbindPhone')
}
