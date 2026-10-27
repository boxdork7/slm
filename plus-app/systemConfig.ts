/**
 * 移动端应用配置
 * @description 统一管理移动端应用的环境变量和配置信息
 * @module @/systemConfig
 */
/**
 * 系统支持的语言枚举
 * @description 定义应用程序支持的所有语言选项
 */
export enum LanguageCode {
  /**
   * 中文(简体)
   */
  zh_CN = 'zh-CN',

  /**
   * 英文(美国)
   */
  en_US = 'en-US'
}
/**
 * 深度只读类型工具
 */
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends Record<string, any> ? DeepReadonly<T[P]> : T[P]
}

/**
 * 应用配置总接口 - 只读
 */
interface SystemConfigType {
  /** 应用基础信息 */
  app: BaseConfig
  /** 服务端配置 */
  api: ApiConfig
  /** 安全配置 */
  security: SecurityConfig
  /** 平台配置 */
  platforms: PlatformsConfig
  /** 功能特性开关 */
  features: FeaturesConfig
}

/**
 * 应用基础信息
 */
interface BaseConfig {
  /** 应用唯一标识 */
  id: string
  /** 应用名称 */
  title: string
  /** 运行环境 */
  env: 'development' | 'production'
}

/**
 * API相关配置
 */
export interface ApiConfig {
  /** API 基础地址 */
  baseUrl: string
}

/**
 * 安全配置
 */
interface SecurityConfig {
  /** 接口加密功能开关 */
  apiEncrypt: boolean
  /** 接口加密算法 - RSA: RSA+AES，SM2: SM2+SM4 国密 */
  apiEncryptAlgorithm: 'RSA' | 'SM2'
  /** RSA公钥 - 用于加密传输 */
  rsaPublicKey: string
  /** RSA私钥 - 用于解密响应 */
  rsaPrivateKey: string
  /** SM2公钥 - 用于加密传输 */
  sm2PublicKey: string
  /** SM2私钥 - 用于解密响应 */
  sm2PrivateKey: string
}

/**
 * 平台配置 - APP 专用
 */
interface PlatformsConfig {
  /** 地图服务密钥 */
  mapKey: string
  /** 在线客服链接 */
  serviceUrl: string
  /** 分享页面域名 */
  shareDomain: string
  /** 数据统计服务 ID */
  analyticsId: string
}

/**
 * 功能特性开关配置
 */
interface FeaturesConfig {
  /** WebSocket 功能开关 */
  websocket: boolean
}

/**
 * 深度冻结对象，防止修改
 */
const deepFreeze = <T extends Record<string, any>>(obj: T): DeepReadonly<T> => {
  Object.freeze(obj)
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    if (obj[prop] !== null && typeof obj[prop] === 'object') {
      deepFreeze(obj[prop])
    }
  })
  return obj as DeepReadonly<T>
}

/**
 * APP 应用配置
 * @description 基于环境变量的应用配置，专为 APP 优化
 */
export const SystemConfig: DeepReadonly<SystemConfigType> = deepFreeze({
  /**
   * 应用基础信息
   */
  app: {
    /** 应用唯一标识 */
    id: import.meta.env.VITE_APP_ID,
    /** 应用名称 */
    title: import.meta.env.VITE_APP_TITLE,
    /** 运行环境 */
    env: (import.meta.env.VITE_APP_ENV || 'development') as 'development' | 'production',
  },

  /**
   * 服务端配置
   */
  api: {
    /** API 基础地址 */
    baseUrl: import.meta.env.VITE_APP_BASE_API,
  },

  /**
   * 安全配置
   */
  security: {
    /** 接口加密功能开关 */
    apiEncrypt: import.meta.env.VITE_APP_API_ENCRYPT === 'true',
    /** 接口加密算法 - 未配置时按 RSA 处理，兼容老的 .env */
    apiEncryptAlgorithm: import.meta.env.VITE_APP_API_ENCRYPT_ALGORITHM === 'SM2' ? 'SM2' : 'RSA',
    /** RSA公钥 - 用于加密传输 */
    rsaPublicKey: import.meta.env.VITE_APP_RSA_PUBLIC_KEY || '',
    /** RSA私钥 - 用于解密响应 */
    rsaPrivateKey: import.meta.env.VITE_APP_RSA_PRIVATE_KEY || '',
    /** SM2公钥 - 用于加密传输 */
    sm2PublicKey: import.meta.env.VITE_APP_SM2_PUBLIC_KEY || '',
    /** SM2私钥 - 用于解密响应 */
    sm2PrivateKey: import.meta.env.VITE_APP_SM2_PRIVATE_KEY || '',
  },

  /** 平台配置 - APP 专用 */
  platforms: {
    /** 地图服务密钥 */
    mapKey: import.meta.env.VITE_MAP_KEY || '',
    /** 在线客服链接 */
    serviceUrl: import.meta.env.VITE_SERVICE_URL || '',
    /** 分享页面域名 */
    shareDomain: import.meta.env.VITE_SHARE_DOMAIN || '',
    /** 数据统计服务 ID */
    analyticsId: import.meta.env.VITE_ANALYTICS_ID || '',
  },

  /**
   * 功能特性开关
   */
  features: {
    /** WebSocket 功能开关 - 默认启用 */
    websocket: import.meta.env.VITE_APP_WEBSOCKET !== 'false',
  },
})
