declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  /** 应用唯一标识符 */
  readonly VITE_APP_ID: string
  /** 网站标题，应用名称 */
  readonly VITE_APP_TITLE: string
  /** UniApp 应用ID */
  readonly VITE_UNI_APPID: string
  /** 运行环境配置 (development/production/test) */
  readonly VITE_APP_ENV: 'development' | 'production'
  /** 是否开发环境 */
  readonly DEV: boolean
  /** 是否生产环境 */
  readonly PROD: boolean
  /** 后台接口地址 */
  readonly VITE_APP_BASE_API: string
  /** H5部署网站的base路径 */
  readonly VITE_APP_PUBLIC_PATH: string

  // ===== 第三方平台配置 =====
  /** 微信小程序 appid */
  readonly VITE_WECHAT_MINI_APP_ID: string
  /** 微信公众号 appid */
  readonly VITE_WECHAT_OFFICIAL_APP_ID: string
  /** 支付宝小程序 appid */
  readonly VITE_ALIPAY_MINI_APP_ID: string
  /** 字节跳动小程序 appid */
  readonly VITE_BYTEDANCE_MINI_APP_ID: string
  /** 百度小程序 appid */
  readonly VITE_BAIDU_MINI_APP_ID: string
  /** QQ小程序 appid */
  readonly VITE_QQ_MINI_APP_ID: string
  /** 地图服务密钥 */
  readonly VITE_MAP_KEY: string
  /** 在线客服链接 */
  readonly VITE_SERVICE_URL: string
  /** 分享页面域名 */
  readonly VITE_SHARE_DOMAIN: string
  /** 数据统计服务 ID */
  readonly VITE_ANALYTICS_ID: string

  // ===== 安全配置 =====
  /** 接口加密功能开关 (如需关闭，后端也必须对应关闭) */
  readonly VITE_APP_API_ENCRYPT: string
  /**
   * 接口加密传输 RSA 公钥
   * 与后端解密私钥对应，如需更换，前后端必须同时更换
   */
  readonly VITE_APP_RSA_PUBLIC_KEY: string
  /**
   * 接口响应解密 RSA 私钥
   * 与后端加密公钥对应，如需更换，前后端必须同时更换
   */
  readonly VITE_APP_RSA_PRIVATE_KEY: string

  // ===== 功能开关 =====
  /** WebSocket开关 (true: 启用WebSocket, false: 使用默认SSE推送) */
  readonly VITE_APP_WEBSOCKET: string
  /** 是否清除console */
  readonly VITE_DELETE_CONSOLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// UniApp 平台类型
type UniPlatform =
  | 'h5'
  | 'app'
  | 'app-plus'
  | 'mp-weixin'
  | 'mp-alipay'
  | 'mp-toutiao'
  | 'mp-baidu'
  | 'mp-qq'
  | 'mp-360'
  | 'quickapp-webview'

// UniApp 全局变量
declare const __UNI_PLATFORM__: UniPlatform
