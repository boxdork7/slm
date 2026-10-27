/**
 * 验证码信息
 */
export interface CaptchaVo {
  /** 是否开启多租户 */
  tenantEnabled: boolean
  /** 租户标题 */
  tenantTitle: string
  /** 是否开启注册 */
  registerEnabled: boolean
  /** 是否开启验证码 */
  captchaEnabled: boolean
  /** 验证码唯一标识 */
  uuid: string
  /** 验证码图片（Base64编码） */
  img: string
}

/**
 * 基础登录对象
 */
export interface LoginBody {
  /** 认证方式 */
  authType: 'password' | 'email' | 'sms' | 'social' | 'miniapp' | 'mp'
  /** 验证码 */
  code?: string
  /** 唯一标识 */
  uuid?: string
}

/**
 * 密码登录对象
 */
export interface PasswordLoginBody extends LoginBody {
  /** 认证类型 */
  authType: 'password'
  /** 用户名 */
  userName: string
  /** 用户密码 */
  password: string
  /** 记住密码（仅前端使用，不提交后端） */
  rememberMe?: boolean
}

/**
 * 邮箱登录对象
 */
export interface EmailLoginBody extends LoginBody {
  /** 认证类型 */
  authType: 'email'
  /** 邮箱 */
  email: string
  /** 邮箱验证码 */
  emailCode: string
}

/**
 * 短信登录对象
 */
export interface SmsLoginBody extends LoginBody {
  /** 认证类型 */
  authType: 'sms'
  /** 手机号 */
  phone: string
  /** 短信验证码 */
  smsCode: string
}

/**
 * 三方登录对象
 */
export interface SocialLoginBody extends LoginBody {
  /** 认证类型 */
  authType: 'social'
  /** 第三方登录平台 */
  source: string
  /** 第三方登录code */
  socialCode: string
  /** 第三方登录socialState */
  socialState: string
}

/**
 * 小程序登录对象
 */
export interface MiniappLoginBody extends LoginBody {
  /** 认证类型 */
  authType: 'miniapp'
  /** 小程序appid */
  appid: string
  /** 平台 */
  platform: string
  /** 小程序登录凭证code */
  platformCode: string
  /** 加密数据（可选，用于获取用户信息） */
  encryptedData?: string
  /** 解密向量（可选，用于获取用户信息） */
  iv?: string
  /** 用户信息原始数据（可选） */
  rawData?: string
  /** 签名（可选，用于验证用户信息完整性） */
  signature?: string
}

/**
 * 微信H5登录对象
 */
export interface WechatOfficialAccountLoginBody extends LoginBody {
  /** 认证类型 */
  authType: 'mp'
  /** 微信H5应用appid */
  appid: string
  /** 微信授权码 */
  platformCode: string
  /** 状态参数 */
  state?: string
}

/**
 * 统一登录请求类型（兼容所有登录方式）
 */
export type LoginRequest =
  | PasswordLoginBody
  | EmailLoginBody
  | SmsLoginBody
  | SocialLoginBody
  | MiniappLoginBody
  | WechatOfficialAccountLoginBody

/**
 * 用户注册对象
 */
export interface RegisterBody extends LoginBody {
  /** 认证类型 */
  authType: 'password'
  /** 用户名 */
  userName: string
  /** 用户密码 */
  password: string
  /** 用户类型 */
  userType?: 'pc_user' | 'app_user'
  /** 确认密码 (只于前端校验) */
  confirmPassword?: string
}

/**
 * 认证令牌响应对象
 */
export interface AuthTokenVo {
  /** 访问令牌 */
  access_token: string
  /** 刷新令牌 */
  refresh_token?: string
  /** 访问令牌有效期（秒） */
  expire_in: number
  /** 刷新令牌有效期（秒） */
  refresh_expire_in?: number
  /** 令牌权限范围 */
  scope?: string
}

export interface UserProfileUpdateBo {
  /** 用户昵称 */
  nickName?: string
  /** 用户头像 */
  avatar?: string
}

/**
 * 租户配置信息
 */
export interface TenantConfigVo {
  /** 租户功能是否启用 */
  tenantEnabled: boolean

  /** 可用租户选项列表 */
  voList: TenantOptionVo[]
}

/**
 * 租户选择选项对象
 */
export interface TenantOptionVo {
  /** 租户ID */
  tenantId: string

  /** 企业名称 */
  companyName: string

  /** 域名 */
  domain: string
}

// ==================== 前端辅助类型定义 ====================

/**
 * 平台登录参数（H5微信授权回调参数）
 */
export interface PlatformLoginParams {
  /** 授权码 */
  code: string
  /** 状态参数 */
  state?: string
}

/**
 * 认证类型枚举
 */
export type AuthType = 'password' | 'email' | 'sms' | 'social' | 'miniapp' | 'mp'

/**
 * 平台类型枚举
 */
export type PlatformType =
  | 'mp-weixin'
  | 'mp-official-account'
  | 'mp-toutiao'
  | 'mp-alipay'
  | 'h5'
  | 'app'
