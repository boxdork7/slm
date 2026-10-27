// composables/useAppInit.ts
import { ref } from 'vue'
import { getTenantIdByAppid } from '@/api/app/home/homeApi'
import { cache } from '@/utils/cache'
import { TENANT_STORAGE_KEY } from '@/utils/tenant'
import { isApp, isMp, isWechatOfficialH5, isAlipayOfficialH5, platform } from '@/utils/platform'
import { webSocket } from '@/composables/useWebSocket'

/**
 * 应用初始化状态管理
 *
 * 根据平台自动判断是否需要获取租户ID和执行自动登录：
 * - APP、普通H5: 跳过初始化
 * - 微信公众号H5、支付宝H5、小程序: 执行租户ID初始化 + 自动登录 + WebSocket连接
 */

/** 是否已完成初始化 */
const isInitialized = ref(false)

/** 是否正在初始化中 */
const isInitializing = ref(false)

/** 初始化Promise缓存 - 确保同一时间只有一个初始化过程 */
let initPromise: Promise<void> | null = null

/**
 * 判断当前平台是否需要执行初始化
 */
const shouldInitialize = (): boolean => {
  if (isApp) return false
  if (isWechatOfficialH5 || isAlipayOfficialH5) return true
  if (isMp) return true
  return false
}

/**
 * 获取当前平台名称
 */
const getCurrentPlatformName = (): string => {
  if (isApp) return 'APP'
  if (isWechatOfficialH5) return '微信公众号H5'
  if (isAlipayOfficialH5) return '支付宝H5'
  if (isMp) {
    switch (platform) {
      case 'mp-weixin':
        return '微信小程序'
      case 'mp-alipay':
        return '支付宝小程序'
      case 'mp-baidu':
        return '百度小程序'
      case 'mp-toutiao':
        return '字节跳动小程序'
      case 'mp-qq':
        return 'QQ小程序'
      default:
        return '小程序'
    }
  }
  return platform === 'h5' ? '普通H5' : '未知平台'
}

/**
 * 初始化WebSocket连接（简化版本）
 */
const initializeWebSocket = () => {
  // 所有检查逻辑都在 webSocket.initialize() 内部处理
  const wsInstance = webSocket.initialize(undefined, {
    onConnected: () => {
      // console.log('[应用初始化] WebSocket连接建立成功')
    },
    onDisconnected: (code, reason) => {
      // console.log('[应用初始化] WebSocket连接断开', { code, reason })
    },
    onError: (error) => {
      console.error('[应用初始化] WebSocket连接错误', error)
    },
    onMessage: (data) => {
      // console.log('[应用初始化] 收到WebSocket消息', data)
      // 这里可以添加应用级别的消息处理逻辑
      // 比如更新应用状态、显示通知等
    },
  })

  // 如果初始化成功，建立连接
  if (wsInstance) {
    webSocket.connect()
  }
}

export const useAppInit = () => {
  /**
   * 执行应用初始化
   * 包括租户ID获取、用户自动登录和WebSocket连接
   */
  const initializeApp = async (): Promise<void> => {
    const platformName = getCurrentPlatformName()

    if (isInitialized.value) {
      console.log(`[应用初始化] ${platformName}环境已完成，跳过重复初始化`)
      return Promise.resolve()
    }

    if (initPromise) {
      console.log(`[应用初始化] ${platformName}环境正在初始化中，等待完成...`)
      return initPromise
    }

    // 不需要租户ID初始化的平台，但仍需检查用户状态
    if (!shouldInitialize()) {
      console.log(`[应用初始化] ${platformName}环境无需租户ID初始化`)

      const userStore = useUserStore()

      // 检查是否有token，有则获取用户信息
      if (userStore.token) {
        console.log(`[应用初始化] ${platformName}检测到token，获取用户信息`)
        try {
          userStore.fetchUserInfo().then(() => {
            console.log(`[应用初始化] ${platformName}用户信息获取成功`)
            // 用户信息获取成功后初始化WebSocket
            initializeWebSocket()
          })
        } catch (err) {
          console.warn(`[应用初始化] ${platformName}获取用户信息失败:`, err.message)
        }
      } else {
        console.log(`[应用初始化] ${platformName}无token，跳过用户信息获取`)
      }

      isInitialized.value = true
      return Promise.resolve()
    }

    // 需要初始化的平台执行租户ID获取和自动登录
    console.log(`[应用初始化] ${platformName}环境开始初始化...`)
    isInitializing.value = true

    initPromise = (async () => {
      try {
        const userStore = useUserStore()

        // 第一步：获取租户ID
        console.log(`[应用初始化] ${platformName}开始获取租户ID...`)
        const appid = userStore.getCurrentPlatformAppid()
        const [err, data] = await getTenantIdByAppid(appid)

        if (!err && data) {
          cache.set(TENANT_STORAGE_KEY, data)
          console.log(`[应用初始化] ${platformName}租户ID获取成功: ${data}`)
        } else {
          const error = err || new Error('获取租户ID失败：返回数据为空')
          console.error(`[应用初始化] ${platformName}获取租户ID失败:`, error.message)
          throw error
        }

        // 第二步：检查是否需要自动登录
        if (userStore.token) {
          console.log(`[应用初始化] ${platformName}已有token，跳过自动登录`)
          userStore
            .fetchUserInfo()
            .then(() => {
              console.log(`[应用初始化] ${platformName}用户信息获取成功`)
              // 用户信息获取成功后初始化WebSocket
              initializeWebSocket()
            })
            .catch((err) => {
              console.warn(`[应用初始化] ${platformName}获取用户信息失败:`, err.message)
            })
        } else if (isMp) {
          // 小程序静默登录
          console.log(`[应用初始化] ${platformName}开始静默登录...`)
          const [loginErr] = await userStore.loginWithMiniapp()
          if (!loginErr) {
            console.log(`[应用初始化] ${platformName}静默登录成功`)
            userStore
              .fetchUserInfo()
              .then(() => {
                console.log(`[应用初始化] ${platformName}用户信息获取成功`)
                // 用户信息获取成功后初始化WebSocket
                initializeWebSocket()
              })
              .catch((err) => {
                console.warn(`[应用初始化] ${platformName}获取用户信息失败:`, err.message)
              })
          } else {
            console.warn(`[应用初始化] ${platformName}静默登录失败:`, loginErr.message)
            // 小程序静默登录失败不抛出错误，让用户手动登录
          }
        } else if (isWechatOfficialH5) {
          // 微信公众号H5授权登录
          const urlParams = new URLSearchParams(window.location.search)
          const code = urlParams.get('code')
          const state = urlParams.get('state')

          if (code && state) {
            console.log(`[应用初始化] ${platformName}检测到授权回调，开始登录...`)
            const [loginErr] = await userStore.loginWithMp({ code, state })
            if (!loginErr) {
              console.log(`[应用初始化] ${platformName}授权登录成功`)
              // 清除URL中的授权参数
              const newUrl = window.location.pathname + window.location.hash
              window.history.replaceState({}, document.title, newUrl)
              userStore
                .fetchUserInfo()
                .then(() => {
                  console.log(`[应用初始化] ${platformName}用户信息获取成功`)
                  // 用户信息获取成功后初始化WebSocket
                  initializeWebSocket()
                })
                .catch((err) => {
                  console.warn(`[应用初始化] ${platformName}获取用户信息失败:`, err.message)
                })
            } else {
              console.error(`[应用初始化] ${platformName}授权登录失败:`, loginErr.message)
              throw loginErr
            }
          } else {
            console.log(`[应用初始化] ${platformName}无授权回调参数，跳过自动登录`)
          }
        }

        isInitialized.value = true
        console.log(`[应用初始化] ${platformName}环境初始化完成`)
      } catch (error) {
        console.error(`[应用初始化] ${platformName}环境初始化失败:`, error)
        // 根据错误类型决定是否抛出异常
        if (error instanceof Error && error.message.includes('租户ID')) {
          // 租户ID获取失败是致命错误，抛出异常
          throw error
        } else {
          // 登录失败不是致命错误，只记录日志，允许应用继续启动
          console.warn(`[应用初始化] ${platformName}登录失败，但允许应用继续启动`)
          isInitialized.value = true
        }
      } finally {
        isInitializing.value = false
        initPromise = null
      }
    })()

    return initPromise
  }

  /**
   * 等待应用初始化完成
   */
  const waitForInit = async (timeout: number = 10000): Promise<void> => {
    if (isInitialized.value) return Promise.resolve()

    if (!shouldInitialize()) {
      isInitialized.value = true
      return Promise.resolve()
    }

    if (initPromise) {
      await Promise.race([
        initPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('等待初始化超时')), timeout)),
      ])
      return
    }

    await initializeApp()
  }

  return {
    initializeApp,
    waitForInit,
  }
}

// 创建全局实例
const globalAppInit = useAppInit()
export const { initializeApp, waitForInit } = globalAppInit
export default globalAppInit
