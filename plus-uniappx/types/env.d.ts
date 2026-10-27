/**
 * 环境变量类型声明 (UniApp X 版本)
 *
 * 仅 H5 平台使用 import.meta.env
 * Android/Harmony 平台通过 systemConfig.uts 条件编译硬编码
 */

interface ImportMetaEnv {
	/** 应用唯一标识符 */
	readonly VITE_APP_ID : string
	/** 网站标题，应用名称 */
	readonly VITE_APP_TITLE : string
	/** 运行环境配置 (development/production) */
	readonly VITE_APP_ENV : 'development' | 'production'
	/** 是否开发环境 */
	readonly DEV : boolean
	/** 是否生产环境 */
	readonly PROD : boolean
	/** 后台接口地址 */
	readonly VITE_APP_BASE_API : string

	/** 地图服务密钥 */
	readonly VITE_MAP_KEY : string
	/** 在线客服链接 */
	readonly VITE_SERVICE_URL : string
	/** 分享页面域名 */
	readonly VITE_SHARE_DOMAIN : string
	/** 数据统计服务 ID */
	readonly VITE_ANALYTICS_ID : string

	/** 接口加密功能开关 */
	readonly VITE_APP_API_ENCRYPT : string
	/** 接口加密传输 RSA 公钥 */
	readonly VITE_APP_RSA_PUBLIC_KEY : string
	/** 接口响应解密 RSA 私钥 */
	readonly VITE_APP_RSA_PRIVATE_KEY : string

	/** WebSocket开关 */
	readonly VITE_APP_WEBSOCKET : string
	/** 是否清除console */
	readonly VITE_DELETE_CONSOLE : string
}

interface ImportMeta {
	readonly env : ImportMetaEnv
}
