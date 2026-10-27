import type {
  AuthTokenVo,
  CaptchaVo,
  LoginRequest,
  SocialLoginBody,
  TenantConfigVo,
  UserProfileUpdateBo,
} from './authTypes'
import { withHeaders } from '@/utils/function'
// ==================== 基础认证相关接口 ====================

/**
 * 用户登录接口
 * @param data 登录数据对象，包含用户名、密码等信息
 * @returns 返回登录结果，包含token等用户认证信息
 */
export const userLogin = (data: LoginRequest): Result<AuthTokenVo> => {
  const params = {
    ...data,
    authType: data.authType || 'password',
  }
  return http.post<AuthTokenVo>(
    '/auth/userLogin',
    params,
    withHeaders(
      {
        // 不需要token认证
        auth: false,
        // 需要加密传输
        isEncrypt: true,
        // 防止重复提交
        repeatSubmit: false,
      },
      {
        skipWait: true, // 跳过等待提示
      },
    ),
  )
}

/**
 * 用户注销接口
 * @returns 返回注销结果
 */
export const userLogout = (): Result<any> => {
  return http.post<R<any>>('/auth/userLogout')
}

/**
 * 用户注册接口
 * @param data 注册数据对象，包含用户信息
 * @returns 返回注册结果
 */
export const userRegister = (data: any): Result<any> => {
  const params = {
    ...data,
    authType: 'password',
  }
  return http.post(
    '/auth/userRegister',
    params,
    withHeaders({
      // 不需要token认证
      auth: false,
      // 需要加密传输
      isEncrypt: true,
      // 防止重复提交
      repeatSubmit: false,
    }),
  )
}

/**
 * 更新用户头像和昵称
 * @param data 用户头像和昵称
 */
export const updateUserProfile = (data: UserProfileUpdateBo): Result<void> => {
  return http.post('/auth/updateUserProfile', data)
}

/**
 * 获取验证码
 * 用于登录时的图形验证码获取
 * @returns 返回验证码图片和校验信息
 */
export const imgCode = (): Result<CaptchaVo> => {
  return http.get<CaptchaVo>(
    '/auth/imgCode',
    {},
    withHeaders(
      {
        // 不需要token认证
        auth: false,
      },
      {
        // 等待时间较长，避免超时
        timeout: 20000,
      },
    ),
  )
}
/**
 * 获取短信验证码
 */
export const smsCode = (phone: string): Result<void> => {
  return http.get<void>(
    '/auth/smsCode',
    { phone },
    withHeaders({
      // 不需要token认证
      auth: false,
    }),
  )
}

// ==================== 社交认证相关接口 ====================

/**
 * 获取社交认证跳转URL
 * @param source 第三方平台来源
 * @param domain 域名
 * @returns 返回授权跳转链接
 */
export const socialBindUrl = (source: string, domain?: string): Result<string> => {
  return http.get<string>(
    `/auth/socialBindUrl/${source}`,
    {
      domain: window.location.host,
    },
    withHeaders({
      auth: false,
    }),
  )
}

/**
 * 第三方社交账号登录回调
 * 处理第三方平台的OAuth登录回调
 * @param socialLoginBody
 * @returns 返回登录结果
 */
export const socialBind = (socialLoginBody: SocialLoginBody): Result<any> => {
  socialLoginBody = {
    ...socialLoginBody,
    // 认证方式为社交账号
    authType: 'social',
  }
  return http.post<any>('/auth/socialBind', socialLoginBody)
}

/**
 * 解绑社交账号授权
 * @param socialId 社交账号ID
 * @returns 返回操作结果
 */
export const socialUnbind = (socialId: string | number): Result<any> => {
  return http.del<any>(`/auth/socialUnbind/${socialId}`)
}

/**
 * 获取租户开关和租户列表
 * 用于多租户系统中切换不同租户
 * @returns 返回租户开关和可用的租户列表
 */
export const getTenantConfig = (): Result<TenantConfigVo> => {
  return http.get<TenantConfigVo>('/auth/getTenantConfig')
}
