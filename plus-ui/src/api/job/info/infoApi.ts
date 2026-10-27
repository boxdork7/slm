// 调度任务 API
import type { JobInfoQuery, JobInfoBo, JobInfoVo, JobHandlerVo } from './infoTypes'

/**
 * 分页查询调度任务列表
 * @param query 查询参数
 * @returns {Result<PageResult<JobInfoVo>>} 结果
 */
export const pageJobInfos = (query?: JobInfoQuery): Result<PageResult<JobInfoVo>> => {
  return http.get<PageResult<JobInfoVo>>('/job/info/pageJobInfos', query)
}

/**
 * 查询调度任务详细
 * @param id 任务ID
 * @returns {Result<JobInfoVo>} 结果
 */
export const getJobInfo = (id: string | number): Result<JobInfoVo> => {
  return http.get<JobInfoVo>(`/job/info/getJobInfo/${id}`)
}

/**
 * 新增调度任务
 * @param data 任务数据
 * @returns {Result<string | number>} 结果
 */
export const addJobInfo = (data: JobInfoBo): Result<string | number> => {
  return http.post<string | number>('/job/info/addJobInfo', data)
}

/**
 * 修改调度任务
 * @param data 任务数据
 * @returns {Result<void>} 结果
 */
export const updateJobInfo = (data: JobInfoBo): Result<void> => {
  return http.put<void>('/job/info/updateJobInfo', data)
}

/**
 * 删除调度任务
 * @param ids 任务ID
 * @returns {Result<void>} 结果
 */
export const deleteJobInfos = (ids: string | number | Array<string | number>): Result<void> => {
  return http.del<void>(`/job/info/deleteJobInfos/${ids}`)
}

/**
 * 启停任务
 * @param id 任务ID
 * @param status 目标状态(0暂停 1运行)
 * @returns {Result<void>} 结果
 */
export const changeJobStatus = (id: string | number, status: string): Result<void> => {
  return http.put<void>('/job/info/changeJobInfoStatus', { id, status })
}

/**
 * 手动执行一次
 * @param id 任务ID
 * @returns {Result<void>} 结果
 */
export const runJob = (id: string | number): Result<void> => {
  return http.put<void>(`/job/info/runJobInfo/${id}`)
}

/**
 * 预览 cron 未来 N 次执行时间
 * @param cron cron 表达式
 * @param count 预览次数
 * @returns {Result<string[]>} 执行时间列表
 */
export const previewNextTriggers = (cron: string, count = 5): Result<string[]> => {
  // noMsgError: 该接口在用户输入 cron 的过程中被防抖调用，半成品表达式必然校验失败。
  // 不关闭全局错误提示的话，每敲一个字符就会弹一个红色 toast，把屏幕刷满。
  // 校验结果由 CronBuilder 就地展示在输入框下方。
  return http.noMsgError().get<string[]>('/job/info/previewJobInfoTriggers', { cron, count })
}

/**
 * 列出已注册执行器(供执行器下拉使用)
 * @returns {Result<JobHandlerVo[]>} 执行器列表
 */
export const listJobHandlers = (): Result<JobHandlerVo[]> => {
  return http.get<JobHandlerVo[]>('/job/info/listJobHandlers')
}
