// 调度日志 API
import type { JobLogQuery, JobLogVo } from './logTypes'

/**
 * 分页查询调度日志列表
 * @param query 查询参数
 * @returns {Result<PageResult<JobLogVo>>} 结果
 */
export const pageJobLogs = (query?: JobLogQuery): Result<PageResult<JobLogVo>> => {
  return http.get<PageResult<JobLogVo>>('/job/log/pageJobLogs', query)
}

/**
 * 删除调度日志
 * @param ids 日志ID
 * @returns {Result<void>} 结果
 */
export const deleteJobLogs = (ids: string | number | Array<string | number>): Result<void> => {
  return http.del<void>(`/job/log/deleteJobLogs/${ids}`)
}

/**
 * 清空调度日志（后端分批物理删除，数据量大时耗时较长）
 * @returns {Result<number>} 实际删除条数
 */
export const cleanJobLogs = (): Result<number> => {
  return http.del<number>('/job/log/cleanJobLogs')
}
