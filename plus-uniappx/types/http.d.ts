/**
 * HTTP 请求相关类型定义
 * UniApp X (UTS) 版本 - 去除 any 类型
 */

/**
 * 自定义请求头接口
 */
export interface CustomHeaders {
	/** 是否需要认证，默认 true */
	auth ?: boolean
	/** 是否需要租户ID，默认 true */
	tenant ?: boolean
	/** 是否防止重复提交，默认 true */
	repeatSubmit ?: boolean
	/** 是否加密请求数据 */
	isEncrypt ?: boolean
}

/**
 * 自定义请求选项
 */
export interface CustomRequestOptions {
	/** 请求地址 */
	url ?: string
	/** 请求方法 */
	method ?: string
	/** 请求数据 */
	data ?: UTSJSONObject | string
	/** 自定义头部 */
	header ?: CustomHeaders
	/** 查询参数 */
	query ?: UTSJSONObject
	/** 查询参数（别名） */
	params ?: UTSJSONObject
	/** 是否跳过等待应用初始化 */
	skipWait ?: boolean
	/** 初始化超时时间（毫秒），默认10秒 */
	initTimeout ?: number
	/** 超时时间 */
	timeout ?: number
}
