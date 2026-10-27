// composables/useAppInit.ts
import { ref } from 'vue'
import { webSocket } from '@/composables/useWebSocket'

/**
 * APP 应用初始化状态管理
 *
 * 只处理 APP 环境的初始化逻辑：
 * - 检查用户token状态
 * - 获取用户信息
 * - 初始化WebSocket连接
 */

/** 是否已完成初始化 */
const isInitialized = ref(false)

/**
 * 初始化WebSocket连接
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
     * 执行APP应用初始化
     * 包括用户状态检查和WebSocket连接
     *
     * 注意：APP环境下不需要等待 fetchUserInfo 完成，
     * 因为 HTTP 请求会调用 waitForInit()，如果使用 await 会造成死锁。
     * 正确做法是使用 .then() 异步处理用户信息获取。
     */
    const initializeApp = async (): Promise<void> => {
        if (isInitialized.value) {
            console.log('[应用初始化] APP环境已完成，跳过重复初始化')
            return Promise.resolve()
        }

        // 立即标记为已初始化，防止并发调用
        isInitialized.value = true
        console.log('[应用初始化] APP环境开始初始化...')

        const userStore = useUserStore()

        // 检查是否有token，有则异步获取用户信息
        // 使用 .then() 而不是 await，避免与 HTTP 请求中的 waitForInit() 形成死锁
        if (userStore.token) {
            console.log('[应用初始化] APP检测到token，异步获取用户信息')
            userStore.fetchUserInfo().then(() => {
                console.log('[应用初始化] APP用户信息获取成功')
                // 用户信息获取成功后初始化WebSocket
                initializeWebSocket()
            }).catch((err) => {
                console.warn('[应用初始化] APP获取用户信息失败:', err?.message || err)
            })
        } else {
            console.log('[应用初始化] APP无token，跳过用户信息获取')
        }

        console.log('[应用初始化] APP环境初始化完成')
        return Promise.resolve()
    }

    /**
     * 等待应用初始化完成
     * APP 环境下初始化是同步完成的，此方法主要用于兼容 HTTP 请求中的调用
     */
    const waitForInit = async (_timeout: number = 10000): Promise<void> => {
        if (isInitialized.value) return Promise.resolve()
        // APP 环境下初始化是同步的，直接调用即可
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
