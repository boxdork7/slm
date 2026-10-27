import type {
  AuthTokenVo,
  AuthType,
  LoginRequest,
  MiniappLoginBody,
  PasswordLoginBody,
  PlatformLoginParams,
  PlatformType,
  SmsLoginBody,
  WechatOfficialAccountLoginBody,
} from '@/api/system/auth/authTypes'
import type { SysUserVo, UserInfoVo } from '@/api/system/core/user/userTypes'
import { userLogin, userLogout } from '@/api/system/auth/authApi'
import { getUserInfo } from '@/api/system/core/user/userApi'
import { SystemConfig } from '@/systemConfig'
import {
  isApp,
  isH5,
  isMp,
  isMpAlipay,
  isMpToutiao,
  isMpWeixin,
  isWechatOfficialH5,
} from '@/utils/platform'
import { getCurrentPage } from '@/utils/route'
import { isDef } from '@/wd/components/common/util'
import { webSocket } from '@/composables/useWebSocket'

/**
 * 用户认证管理 (useUserStore)
 *
 * 基于 Pinia 的用户认证与权限管理模块，提供完整的用户身份验证和授权功能。
 * 支持多平台登录：密码登录、小程序登录、H5微信授权登录等
 */

/**
 * 用户模块名称
 */
const USER_MODULE = 'user'

/**
 * 认证配置
 */
const AUTH_CONFIG = {
  // 平台对应的 appid
  appids: {
    'mp-weixin': SystemConfig.platforms.wechatMiniAppId,
    'mp-official-account': SystemConfig.platforms.wechatOfficialAppId,
    'mp-toutiao': SystemConfig.platforms.toutiaoMiniAppId,
    'mp-alipay': SystemConfig.platforms.alipayMiniAppId,
  },

  // 平台支持的登录方式
  supportedMethods: {
    'mp-weixin': ['miniapp', 'password', 'sms'] as AuthType[],
    'mp-official-account': ['mp', 'password'] as AuthType[],
    'mp-toutiao': ['miniapp', 'password'] as AuthType[],
    'mp-alipay': ['miniapp', 'password'] as AuthType[],
    h5: ['password', 'sms'] as AuthType[],
    app: ['password'] as AuthType[],
  },
}

/**
 * 用户状态管理
 * @description 管理用户认证、权限和个人信息等状态。
 * 支持多平台登录策略，自动适配当前运行环境
 *
 * @example
 * // 在组件中使用
 * import { useUserStore } from '@/stores/modules/user';
 *
 * export default defineComponent({
 *   setup() {
 *     const userStore = useUserStore();
 *
 *     // 小程序一键登录
 *     const handleQuickLogin = () => {
 *       userStore.loginWithMiniapp();
 *     };
 *
 *     // 密码登录
 *     const handlePasswordLogin = () => {
 *       userStore.loginWithPassword({
 *         userName: 'admin',
 *         password: '123456'
 *       });
 *     };
 *
 *     return {
 *       // 获取用户基本信息
 *       nickname: computed(() => userStore.userInfo?.nickName || ''),
 *       avatar: computed(() => userStore.userInfo?.avatar || ''),
 *       roles: computed(() => userStore.roles || [])
 *     }
 *   }
 * });
 */
export const useUserStore = defineStore(USER_MODULE, () => {
  // 获取token工具，避免重复创建实例
  const tokenUtils = useToken()

  /**
   * 用户令牌
   * @description 用户登录后的访问令牌，用于API请求认证
   */
  const token = ref(tokenUtils.getToken())

  /**
   * 当前用户登录状态
   * @description 表示用户是否已登录系统
   */
  const isLoggedIn = computed(() => {
    return token && token.value.length > 0
  })

  /**
   * 用户基本信息
   * @description 用户的基本信息（账号、昵称、头像等）
   */
  const userInfo = ref<SysUserVo | null>(null)

  /**
   * 用户是否已完善信息
   * @description 表示用户是否已完善个人信息，如昵称、头像等
   */
  const hasUserAuth = computed(() => {
    return !!(userInfo.value?.avatar && userInfo.value?.nickName)
  })

  /**
   * 用户角色编码集合
   * @description 用于判断路由权限和功能权限
   */
  const roles = ref<Array<string>>([])

  /**
   * 用户权限编码集合
   * @description 用于判断按钮权限等细粒度权限控制
   */
  const permissions = ref<Array<string>>([])

  // 用户授权弹窗状态
  const authModalVisible = ref(false)
  // 是否需要手机授权
  const requirePhoneAuth = ref(false)

  // === 工具方法（基础方法，被其他方法依赖） ===

  /**
   * 获取当前平台类型
   * @returns 当前平台类型
   */
  const getCurrentPlatform = (): PlatformType => {
    if (isMpWeixin) return 'mp-weixin'
    if (isWechatOfficialH5) return 'mp-official-account'
    if (isMpToutiao) return 'mp-toutiao'
    if (isMpAlipay) return 'mp-alipay'
    if (isH5) return 'h5'
    if (isApp) return 'app'
    return 'h5' // 默认
  }

  /**
   * 获取当前平台的 appid
   * @returns 当前平台对应的 appid
   */
  const getCurrentPlatformAppid = (): string => {
    console.log(AUTH_CONFIG.appids['mp-weixin'])

    if (isMpWeixin) return AUTH_CONFIG.appids['mp-weixin']
    if (isWechatOfficialH5) return AUTH_CONFIG.appids['mp-official-account']
    if (isMpToutiao) return AUTH_CONFIG.appids['mp-toutiao']
    if (isMpAlipay) return AUTH_CONFIG.appids['mp-alipay']
    return ''
  }

  /**
   * 获取当前平台支持的登录方式
   * @returns 支持的登录方式数组
   */
  const getSupportedLoginMethods = (): AuthType[] => {
    const platform = getCurrentPlatform()
    return AUTH_CONFIG.supportedMethods[platform] || ['password']
  }

  /**
   * 检查当前平台是否支持指定登录方式
   * @param method 登录方式
   * @returns 是否支持
   */
  const isSupportedLoginMethod = (method: AuthType): boolean => {
    const supportedMethods = getSupportedLoginMethods()
    return supportedMethods.includes(method)
  }

  /**
   * 获取小程序登录 code
   * @returns Promise<string> 返回小程序授权码
   */
  const getMiniappCode = async (): Promise<string> => {
    if (!isMp) {
      throw new Error('当前环境不支持小程序登录')
    }

    try {
      const res = await uni.login()
      if (!res.code) {
        throw new Error('获取小程序授权码失败')
      }
      return res.code
    } catch (error) {
      console.error('小程序登录失败:', error)
      throw new Error('小程序登录失败，请重试')
    }
  }

  /**
   * 获取微信 H5 授权链接
   * @param redirectUri 授权回调地址
   * @param state 状态参数
   * @returns 微信授权链接
   * @description 生成微信网页授权链接，用户点击后跳转到微信授权页面
   */
  const getWechatH5AuthUrl = (redirectUri: string, state?: 'login' | 'snsapi_userinfo'): string => {
    const appid = AUTH_CONFIG.appids['mp-official-account']
    const scope = 'snsapi_userinfo' // 获取用户基本信息
    const encodedRedirectUri = encodeURIComponent(redirectUri)

    return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodedRedirectUri}&response_type=code&scope=${scope}&state=${state || 'STATE'}#wechat_redirect`
  }

  // === 登录数据准备方法 ===

  /**
   * 根据认证类型准备登录数据
   * @param authType 认证类型
   * @param params 登录参数
   * @returns 格式化的登录数据
   */
  const prepareLoginData = async (authType: AuthType, params: any): Promise<LoginRequest> => {
    switch (authType) {
      case 'password':
        return {
          authType,
          userName: params.userName,
          password: params.password,
          code: params.code,
          uuid: params.uuid,
        } as PasswordLoginBody
      case 'sms':
        return {
          authType,
          phone: params.phone,
          smsCode: params.smsCode,
        } as SmsLoginBody

      case 'miniapp': {
        // 小程序登录：获取 code
        const miniappCode = await getMiniappCode()
        return {
          authType,
          platformCode: miniappCode,
          platform: getCurrentPlatform(),
          appid: getCurrentPlatformAppid(),
          // 如果有用户信息授权数据，也一并传递
          encryptedData: params.encryptedData,
          iv: params.iv,
          rawData: params.rawData,
          signature: params.signature,
        } as MiniappLoginBody
      }

      case 'mp':
        // H5 微信登录：使用传入的 code
        return {
          authType,
          platform: getCurrentPlatform(),
          appid: getCurrentPlatformAppid(),
          state: params.state,
          platformCode: params.code,
        } as WechatOfficialAccountLoginBody

      default:
        throw new Error(`不支持的认证类型: ${authType}`)
    }
  }

  // === WebSocket管理方法 ===

  /**
   * 登录成功后的websocket处理
   */
  const handleInitWebSocket = () => {
    console.log('[用户登录] 登录成功，检查WebSocket状态')

    // 检查当前WebSocket状态
    const currentStatus = webSocket.status

    if (currentStatus === 'CLOSED') {
      console.log('[用户登录] WebSocket未连接，开始初始化')

      const wsInstance = webSocket.initialize(undefined, {
        onConnected: () => {
          console.log('[用户登录] WebSocket连接建立成功')
        },
        onDisconnected: (code, reason) => {
          console.log('[用户登录] WebSocket连接断开', { code, reason })
        },
        onError: (error) => {
          console.error('[用户登录] WebSocket连接错误', error)
        },
        onMessage: (data) => {
          console.log('[用户登录] 收到WebSocket消息', data)
        },
      })

      if (wsInstance) {
        webSocket.connect()
      }
    } else {
      console.log(`[用户登录] WebSocket已存在，当前状态: ${currentStatus}`)

      // 如果是CONNECTING状态，等待连接完成
      if (currentStatus === 'CONNECTING') {
        console.log('[用户登录] WebSocket正在连接中，等待连接完成')
      }
      // 如果是OPEN状态，连接已建立
      else if (currentStatus === 'OPEN') {
        console.log('[用户登录] WebSocket连接已建立')
      }
    }
  }

  // === 核心登录方法 ===

  /**
   * 执行用户登录
   */
  const loginUser = async (loginRequest: LoginRequest): Result<AuthTokenVo> => {
    const [err, data] = await userLogin(loginRequest)
    if (err) {
      return [err, data]
    }
    // 保存token到localStorage和store
    tokenUtils.setToken(data.access_token)
    token.value = data.access_token

    // 初始化websocket
    handleInitWebSocket()
    return [null, null]
  }

  /**
   * 统一登录方法
   * @param authType 认证类型：password | miniapp | wechat
   * @param params 登录参数
   * @returns Promise 登录成功时resolve，失败时reject错误信息
   * @description 根据认证类型调用不同的登录策略
   */
  const login = async (authType: AuthType, params: any = {}): Result<AuthTokenVo> => {
    try {
      // 准备登录数据
      const loginData = await prepareLoginData(authType, params)
      console.log(`准备 ${authType} 登录数据:`, loginData)
      // 调用登录接口
      return await loginUser(loginData)
    } catch (error) {
      console.error(`${authType} 登录失败:`, error)
      return [error as Error, null]
    }
  }

  // === 具体登录方法 ===

  /**
   * 密码登录
   * @param loginBody 密码登录数据
   * @returns Promise 登录结果
   * @example
   * const [err] = await userStore.loginWithPassword({
   *   authType: 'password',
   *   userName: 'admin',
   *   password: '123456',
   *   code: '1234',
   *   uuid: 'uuid'
   * });
   */
  const loginWithPassword = async (
    loginBody: Omit<PasswordLoginBody, 'authType'>,
  ): Result<AuthTokenVo> => {
    return await login('password', loginBody)
  }

  /**
   * 小程序一键登录
   * @param userInfoAuth 可选的用户信息授权数据
   * @returns Promise 登录结果
   * @description 适用于微信小程序、抖音小程序、支付宝小程序等
   * @example
   * // 基础登录
   * const [err] = await userStore.loginWithMiniapp();
   *
   * // 带用户信息授权的登录
   * const [err] = await userStore.loginWithMiniapp({
   *   encryptedData: 'xxx',
   *   iv: 'xxx',
   *   rawData: 'xxx',
   *   signature: 'xxx'
   * });
   */
  const loginWithMiniapp = async (userInfoAuth?: {
    encryptedData: string
    iv: string
    rawData: string
    signature: string
  }): Result<AuthTokenVo> => {
    if (!isSupportedLoginMethod('miniapp')) {
      return [new Error('当前平台不支持小程序登录'), null]
    }
    return await login('miniapp', userInfoAuth)
  }

  /**
   * H5 微信授权登录
   * @param params 微信授权回调参数
   * @returns Promise 登录结果
   * @description 用于 H5 页面的微信网页授权登录
   * @example
   * // H5 微信授权回调后使用
   * const [err] = await userStore.loginWithMp({
   *   code: 'wx_auth_code',
   *   state: 'random_state'
   * });
   */
  const loginWithMp = async (params: PlatformLoginParams): Result<AuthTokenVo> => {
    if (!isSupportedLoginMethod('mp')) {
      return [new Error('当前平台不支持微信登录'), null]
    }
    return await login('mp', params)
  }

  // === 用户信息管理方法 ===

  /**
   * 获取用户信息
   * @returns Result
   * @description 调用获取用户信息API，获取用户基本信息、角色和权限
   */
  const fetchUserInfo = async (): Result<UserInfoVo> => {
    const [err, data] = await getUserInfo()
    if (err) {
      return [err, null]
    }

    // 设置用户基本信息
    userInfo.value = data.user

    // 设置角色和权限
    roles.value = data.roles || []
    permissions.value = data.permissions || []

    return [null, data]
  }

  /**
   * 用户注销
   * @returns Result
   * @description 调用注销API，清除用户状态和token
   */
  const logoutUser = async (): Result<R<void>> => {
    // 先断开WebSocket连接
    console.log('[用户登出] 断开WebSocket连接')
    webSocket.disconnect()

    // 调用注销API
    const [err, data] = await userLogout()

    // 清除状态
    token.value = ''
    userInfo.value = null
    roles.value = []
    permissions.value = []

    // 移除localStorage中的token
    tokenUtils.removeToken()

    console.log('[用户登出] 用户状态已清除，WebSocket已重置')
    return [err, data]
  }

  /**
   * 更新用户昵称
   * @param nickName 昵称
   * @description 更新用户昵称
   */
  const updateNickName = (nickName: string): void => {
    if (userInfo.value) {
      userInfo.value.nickName = nickName
    }
  }

  /**
   * 更新用户头像
   * @param avatarUrl 新头像的URL地址
   * @description 更新用户头像
   */
  const updateAvatar = (avatarUrl: string): void => {
    if (userInfo.value) {
      userInfo.value.avatar = avatarUrl
    }
  }

  // === 导航和授权检查方法 ===

  /**
   * 检查用户信息并跳转
   * 如果用户没有头像昵称，则根据模式进行授权；否则跳转到目标页面
   *
   * @param options 跳转参数，包含目标页面的 URL
   * @param mode 模式：'modal' 弹窗授权 | 'page' 页面跳转授权，默认 'modal'
   * @param authPagePath 授权页面路径，默认 '/pages/auth/auth'
   */
  const navigateWithUserCheck = (
    options?: UniNamespace.NavigateToOptions & NavigateToOptions,
    mode: 'modal' | 'page' = 'modal',
    authPagePath: string = '/pages/auth/auth',
  ) => {
    if (isDef(options?.url)) {
      if (hasUserAuth.value) {
        // 有用户信息，直接跳转到目标页面
        uni.navigateTo(options)
      } else {
        // 没有用户信息，根据模式处理
        if (mode === 'modal') {
          // 显示授权弹窗
          authModalVisible.value = true
        } else {
          // 跳转到授权页面
          const authUrl = `${authPagePath}?redirect=${options.url}`
          console.log('authUrl', authUrl)
          uni.navigateTo({
            ...options,
            url: authUrl,
          })
        }
      }
    } else {
      if (mode === 'modal') {
        // 显示授权弹窗
        authModalVisible.value = true
      } else {
        // 跳转到授权页面
        const authUrl = `${authPagePath}?redirect=/${getCurrentPage()?.route}`
        uni.navigateTo({
          ...options,
          url: authUrl,
        })
      }
    }
  }

  return {
    // 状态
    token,
    isLoggedIn,
    userInfo,
    hasUserAuth,
    roles,
    permissions,

    // 登录方法
    login,
    loginWithPassword,
    loginWithMiniapp,
    loginWithMp,

    // 工具方法
    getCurrentPlatform,
    getCurrentPlatformAppid,
    getSupportedLoginMethods,
    isSupportedLoginMethod,
    getWechatH5AuthUrl,

    // 用户信息管理
    fetchUserInfo,
    updateNickName,
    updateAvatar,

    // 登录/退出
    loginUser,
    logoutUser,

    // 用户信息检查与跳转
    authModalVisible,
    requirePhoneAuth,
    navigateWithUserCheck,
  }
})
