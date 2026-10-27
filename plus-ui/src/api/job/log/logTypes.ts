/** 调度日志查询类型 */
export interface JobLogQuery extends PageQuery {
  /** 任务ID */
  jobId?: string | number

  /** 任务名称 */
  jobName?: string

  /** 执行器标识 */
  invokeTarget?: string

  /** 执行状态(0失败 1成功 2执行中) */
  status?: string

  /** 执行节点 */
  executeNode?: string
}

/** 调度日志视图类型 */
export interface JobLogVo {
  /** 日志ID */
  id: string | number

  /** 任务ID */
  jobId: string | number

  /** 任务名称 */
  jobName: string

  /** 任务分组 */
  jobGroup: string

  /** 执行器标识 */
  invokeTarget: string

  /** 任务参数 */
  jobParams: string

  /** 日志信息 */
  jobMessage: string

  /** 执行状态(0失败 1成功 2执行中) */
  status: string

  /** 异常堆栈 */
  exceptionInfo: string

  /** 执行节点(IP:port) */
  executeNode: string

  /** 当前重试次数 */
  retryCount: number

  /** 开始时间 */
  startTime: string

  /** 结束时间 */
  stopTime: string

  /** 耗时(毫秒) */
  costTime: number

  /** 创建时间 */
  createTime: string
}
