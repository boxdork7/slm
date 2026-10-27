/**
 * 全局类型定义 (global.d.ts)
 *
 * UniApp X (UTS) 版本
 * - 移除所有 any 类型
 * - Record<string, any> → UTSJSONObject
 * - 保持与 plus-app 相同的类型结构
 */

/**
 * 统一 API 响应类型
 * @template T 响应数据的类型
 */
declare type Result<T> = Promise<[Error | null, T | null]>

/**
 * 分页响应数据类型
 * @template T 列表项的类型
 */
declare interface PageResult<T> {
	/** 数据记录列表 */
	records : T[]
	/** 总记录数 */
	total : number
	/** 总页数 */
	pages : number
	/** 当前页码 */
	current : number
	/** 每页大小 */
	size : number
	/** 是否为最后一页 */
	last : boolean
}

/**
 * 标准 API 响应结构
 * @template T 数据字段的类型
 */
declare interface R<T> {
	/** 响应状态码 */
	code : number
	/** 响应消息 */
	msg : string
	/** 响应数据 */
	data : T
}

/**
 * 分页查询基础参数
 */
declare interface PageQuery {
	/** 当前页码，从1开始 */
	pageNum ?: number
	/** 每页显示记录数 */
	pageSize ?: number
	/** 排序字段 */
	orderByColumn ?: string
	/** 排序方向 asc/desc */
	isAsc ?: string
	/** 模糊搜索关键词 */
	searchValue ?: string
	/** 扩展查询参数 */
	params ?: UTSJSONObject
}

/**
 * 字段可见性配置
 */
declare interface FieldVisibilityConfig {
	/** 字段唯一标识 */
	key : string | number
	/** 字段名称 */
	field : string
	/** 字段显示标签 */
	label : string
	/** 是否可见 */
	visible : boolean
	/** 子字段配置 */
	children ?: FieldVisibilityConfig[]
}

/**
 * 弹窗状态配置
 */
declare interface DialogState {
	/** 弹窗标题 */
	title ?: string
	/** 弹窗是否显示 */
	visible : boolean
	/** 是否显示取消按钮 */
	showCancel ?: boolean
	/** 确认按钮文字 */
	confirmText ?: string
	/** 取消按钮文字 */
	cancelText ?: string
}

/**
 * 字典项配置
 */
declare interface DictItem {
	/** 显示标签文本 */
	label : string
	/** 实际存储的值 */
	value : string
	/** 状态标识 */
	status ?: string
	/** Tag 组件的类型 */
	elTagType ?: string
	/** Tag 组件的自定义类名 */
	elTagClass ?: string
}
