/** 调度任务查询类型 */
export interface JobInfoQuery extends PageQuery {
  /** 任务名称 */
  jobName?: string

  /** 任务分组 */
  jobGroup?: string

  /** 执行器标识 */
  invokeTarget?: string

  /** 路由策略(1集群 2广播) */
  routeStrategy?: string

  /** 任务状态(0暂停 1运行) */
  status?: string
}

/** 调度任务表单类型 */
export interface JobInfoBo {
  /** 任务ID */
  id?: string | number

  /** 任务名称 */
  jobName?: string

  /** 任务分组 */
  jobGroup?: string

  /** 执行器标识 */
  invokeTarget?: string

  /** 任务参数 */
  jobParams?: string

  /** cron 表达式 */
  cronExpression?: string

  /** 路由策略(1集群 2广播) */
  routeStrategy?: string

  /** 错过执行策略(1立即补一次 2放弃本次 3顺延到下次) */
  misfirePolicy?: string

  /** 失败最大重试次数 */
  maxRetry?: number

  /** 重试间隔(秒) */
  retryInterval?: number

  /** 执行超时(秒,0不限制) */
  timeout?: number

  /** 是否允许并发执行(0禁止 1允许) */
  concurrent?: string

  /** 任务状态(0暂停 1运行) */
  status?: string

  /** 备注 */
  remark?: string
}

/** 调度任务视图类型 */
export interface JobInfoVo {
  /** 任务ID */
  id: string | number

  /** 任务名称 */
  jobName: string

  /** 任务分组 */
  jobGroup: string

  /** 执行器标识 */
  invokeTarget: string

  /** 任务参数 */
  jobParams: string

  /** cron 表达式 */
  cronExpression: string

  /** 路由策略(1集群 2广播) */
  routeStrategy: string

  /** 错过执行策略 */
  misfirePolicy: string

  /** 失败最大重试次数 */
  maxRetry: number

  /** 重试间隔(秒) */
  retryInterval: number

  /** 执行超时(秒) */
  timeout: number

  /** 是否允许并发执行 */
  concurrent: string

  /** 下次执行时间 */
  nextExecuteTime: string

  /** 任务状态(0暂停 1运行) */
  status: string

  /** 创建时间 */
  createTime: string

  /** 更新时间 */
  updateTime: string

  /** 备注 */
  remark: string
}

/** 执行器视图对象(用于执行器下拉，对应后端 JobHandlerVo) */
export interface JobHandlerVo {
  /** 执行器标识 */
  name: string

  /** 中文说明 */
  desc: string

  /** 建议 cron */
  sampleCron: string
}
