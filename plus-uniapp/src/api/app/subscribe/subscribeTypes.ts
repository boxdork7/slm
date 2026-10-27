/**
 * 订阅消息模板配置
 */
export interface TemplateConfig {
  /** 模板ID */
  templateId: string
  /** 模板标题 */
  title: string
  /** 模板内容描述 */
  content: string
  /** 字段列表（逗号分隔） */
  fields: string
  /** 是否启用 */
  status: boolean
  /** 创建时间 */
  createTime?: string
  /** 更新时间 */
  updateTime?: string
  /** 备注 */
  remark?: string
}

/**
 * 订阅结果
 */
export interface SubscribeResult {
  /** 是否成功 */
  success: boolean
  /** 成功订阅的模板ID */
  subscribedIds: string[]
  /** 失败的模板ID */
  failedIds: string[]
  /** 用户拒绝的模板ID */
  rejectedIds: string[]
  /** 错误信息 */
  errMsg?: string
}

/**
 * 订阅记录（本地存储）
 */
export interface SubscribeRecord {
  /** 模板ID */
  templateId: string
  /** 订阅时间戳 */
  subscribedAt: number
  /** 是否已发送 */
  sent: boolean
}
