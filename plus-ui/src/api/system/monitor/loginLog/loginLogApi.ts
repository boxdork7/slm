// 登录日志 API
import type { SysLoginLogQuery, SysLoginLogVo } from './loginLogTypes'

/**
 * 查询登录日志列表
 * @param query 查询参数
 * @returns {Result<PageResult<SysLoginLogVo>>} 结果
 */
export const pageLoginLogs = (query?: SysLoginLogQuery): Result<PageResult<SysLoginLogVo>> => {
  return http.get<PageResult<SysLoginLogVo>>('/monitor/loginLog/pageLoginLogs', query)
}

/**
 * 查询登录日志归档列表（只读）
 *
 * 等保二级 8.1.4.3：归档表「可查不可删」——
 * 清空主表时数据会搬到归档表保留，这个接口用于追溯历史审计记录。
 *
 * @param query 查询参数（与主表完全一致）
 * @returns {Result<PageResult<SysLoginLogVo>>} 结果
 */
export const pageLoginLogArchives = (query?: SysLoginLogQuery): Result<PageResult<SysLoginLogVo>> => {
  return http.get<PageResult<SysLoginLogVo>>('/monitor/loginLog/pageLoginLogArchives', query)
}

/**
 * 删除登录日志
 * @param infoId 日志ID
 * @returns {Result<void>} 结果
 */
export const deleteLoginLogs = (infoId: string | number | Array<string | number>): Result<void> => {
  return http.del<void>(`/monitor/loginLog/deleteLoginLogs/${infoId}`)
}

/**
 * 解锁用户登录状态
 * @param userName 用户名
 * @returns {Result<void>} 结果
 */
export const unlockLoginLog = (userName: string): Result<void> => {
  return http.get<void>(`/monitor/loginLog/unlockLoginLog/${userName}`)
}

/**
 * 清空登录日志
 * @returns {Result<void>} 结果
 */
export const clearLoginLogs = (): Result<void> => {
  return http.del<void>('/monitor/loginLog/clearLoginLogs')
}
