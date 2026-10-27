// 操作日志 API
import type { SysOperLogQuery, SysOperLogVo } from './operLogTypes'

/**
 * 查询操作日志列表
 * @param query 查询参数
 * @returns {Result<PageResult<SysOperLogVo>>} 结果
 */
export const pageOperLogs = (query?: SysOperLogQuery): Result<PageResult<SysOperLogVo>> => {
  return http.get<PageResult<SysOperLogVo>>('/monitor/operLog/pageOperLogs', query)
}

/**
 * 查询操作日志归档列表（只读）
 *
 * 等保二级 8.1.4.3：归档表「可查不可删」——
 * 清空主表时数据会搬到归档表保留，这个接口用于追溯历史审计记录。
 * 归档表没有任何删除或修改接口。
 *
 * @param query 查询参数（与主表完全一致）
 * @returns {Result<PageResult<SysOperLogVo>>} 结果
 */
export const pageOperLogArchives = (query?: SysOperLogQuery): Result<PageResult<SysOperLogVo>> => {
  return http.get<PageResult<SysOperLogVo>>('/monitor/operLog/pageOperLogArchives', query)
}

/**
 * 删除操作日志
 * @param operId 日志ID
 * @returns {Result<void>} 结果
 */
export const deleteOperLogs = (operId: string | number | Array<string | number>): Result<void> => {
  return http.del<void>(`/monitor/operLog/deleteOperLogs/${operId}`)
}

/**
 * 清空操作日志
 * @returns {Result<void>} 结果
 */
export const clearOperLogs = (): Result<void> => {
  return http.del<void>('/monitor/operLog/clearOperLogs')
}
