// composables/useWebSocket.ts
import { SystemConfig } from '@/systemConfig'
import { getCurrentTime } from '@/utils/date'
import { useToast } from '@/wd'
import PLATFORM from '@/utils/platform'
import { useFeatureStore } from '@/stores/modules/feature'

const toast = useToast()

// 消息类型定义和处理管道

/**
 * WebSocket 消息类型枚举
 */
export enum WSMessageType {
  // 系统级消息 - 需要显示通知和存储
  SYSTEM_NOTICE = 'system_notice', // 系统通知（包括通知和公告，统一右上角显示）

  // 业务消息 - 静默处理或特定显示
  CHAT_MESSAGE = 'chat_message', // 聊天消息（由聊天组件处理）

  // 技术消息 - 系统内部使用
  HEARTBEAT = 'heartbeat',
}

/**
 * WebSocket 消息结构
 */
export interface WSMessage {
  type: WSMessageType // 消息类型
  data: any // 消息数据
  timestamp: number // 时间戳
  id?: string // 消息ID（可选）
}

/**
 * 通知消息数据结构
 */
export interface NotificationData {
  title?: string // 通知标题
  content: string // 通知内容
  duration?: number // 显示时长
  type?: 'success' | 'info' | 'warning' | 'error' // 通知类型
}

/**
 * 聊天消息数据结构
 */
export interface ChatMessageData {
  fromUserId: string // 发送者ID
  fromUsername: string // 发送者用户名
  content: string // 消息内容
  chatRoomId?: string // 聊天室ID（群聊）
  messageType?: 'text' | 'image' | 'file' // 消息类型
}

/**
 * 消息处理器接口
 */
export interface MessageHandler {
  /**
   * 处理消息
   * @param message 标准化的消息对象
   * @returns 是否继续传播消息到下一个处理器
   */
  handle: (message: WSMessage) => boolean
}

/**
 * 系统通知处理器
 */
export class SystemNoticeHandler implements MessageHandler {
  handle(message: WSMessage): boolean {
    if (message.type === WSMessageType.SYSTEM_NOTICE) {
      const notificationData = message.data as NotificationData

      // 显示系统通知
      toast.show(notificationData.content || notificationData.title || '系统通知')

      console.log('📢 处理系统通知:', notificationData.content)
      return false // 阻止继续传播
    }

    return true // 不是系统通知类型，继续传播
  }
}

//
// /**
//  * 聊天消息处理器
//  *
//  * 负责处理聊天相关的消息，包括：
//  * - 更新聊天数据
//  * - 显示聊天专用的通知（非系统通知）
//  * - 处理不同类型的聊天消息
//  */
// export class ChatMessageHandler implements MessageHandler {
//   private chatStore: any = null
//
//   /**
//    * 获取聊天存储实例（延迟初始化）
//    */
//   private getChatStore() {
//     if (!this.chatStore) {
//       this.chatStore = useChatStore()
//     }
//     return this.chatStore
//   }
//
//   /**
//    * 显示聊天专用通知
//    * 与系统通知不同，聊天通知通常更简洁，时间更短
//    */
//   private showChatNotification(chatData: ChatMessageData) {
//     // 检查当前是否在聊天页面，如果是则不显示通知
//     const { path } = getCurrentRoute()
//     const isInChatPage = path.includes('/chat')
//
//     if (!isInChatPage) {
//       toast.show(`来自 ${chatData.fromUsername}`)
//     }
//   }
//
//   handle(message: WSMessage): boolean {
//     if (message.type === WSMessageType.CHAT_MESSAGE) {
//       const chatData = message.data as ChatMessageData
//
//       // 更新聊天数据存储（延迟获取store）
//       this.getChatStore().addMessage({
//         id: message.id || Date.now().toString(),
//         fromUserId: chatData.fromUserId,
//         fromUsername: chatData.fromUsername,
//         content: chatData.content,
//         timestamp: message.timestamp,
//         chatRoomId: chatData.chatRoomId,
//         messageType: chatData.messageType || 'text',
//       })
//
//       // 如果不是当前用户发送的消息，显示聊天通知
//       const userStore = useUserStore()
//       const currentUserId = userStore.userInfo?.userId
//       if (chatData.fromUserId !== currentUserId) {
//         this.showChatNotification(chatData)
//       }
//
//       console.log('💬 处理聊天消息:', `${chatData.fromUsername}: ${chatData.content}`)
//       return false // 阻止继续传播
//     }
//
//     return true // 不是聊天消息，继续传播
//   }
// }

/**
 * 心跳消息处理器
 */
export class HeartbeatHandler implements MessageHandler {
  handle(message: WSMessage): boolean {
    if (message.type === WSMessageType.HEARTBEAT) {
      // 只做简单的日志记录，不做其他处理
      console.log('💓 心跳消息:', message.data)
      return false // 阻止继续传播
    }

    return true // 不是心跳消息，继续传播
  }
}

/**
 * 消息处理管道
 */
export class MessagePipeline {
  private handlers: MessageHandler[] = []

  /**
   * 添加消息处理器
   */
  addHandler(handler: MessageHandler): void {
    this.handlers.push(handler)
  }

  /**
   * 移除消息处理器
   */
  removeHandler(handlerClass: new () => MessageHandler): void {
    const index = this.handlers.findIndex((handler) => handler instanceof handlerClass)
    if (index !== -1) {
      this.handlers.splice(index, 1)
    }
  }

  /**
   * 处理消息
   */
  process(rawMessage: any): void {
    try {
      // 解析并标准化消息
      const message = this.parseMessage(rawMessage)
      if (!message) {
        console.warn('⚠️ 无法解析的消息，忽略处理:', rawMessage)
        return
      }

      // 依次通过处理器处理消息
      for (const handler of this.handlers) {
        try {
          const shouldContinue = handler.handle(message)
          if (!shouldContinue) {
            break // 处理器阻止了继续传播
          }
        } catch (handlerError) {
          console.error(`❌ 处理器 ${handler.constructor.name} 处理消息时出错:`, handlerError)
          // 继续执行下一个处理器，不因为一个处理器的错误而中断整个流程
        }
      }
    } catch (error) {
      console.error('❌ 消息处理管道出错:', error, '原始消息:', rawMessage)
    }
  }

  /**
   * 解析消息
   */
  private parseMessage(rawMessage: any): WSMessage | null {
    try {
      // 如果是字符串，尝试解析为JSON
      if (typeof rawMessage === 'string') {
        // 快速检查是否为心跳消息
        const lowerMessage = rawMessage.toLowerCase()
        if (lowerMessage.includes('ping') || lowerMessage.includes('pong')) {
          return {
            type: WSMessageType.HEARTBEAT,
            data: rawMessage,
            timestamp: Date.now(),
          }
        }

        // 尝试解析为JSON
        try {
          const parsed = JSON.parse(rawMessage)
          return this.normalizeMessage(parsed)
        } catch {
          // 解析失败，当作普通文本消息处理
          return {
            type: WSMessageType.SYSTEM_NOTICE,
            data: { content: rawMessage },
            timestamp: Date.now(),
          }
        }
      }

      // 如果已经是对象，直接标准化
      if (typeof rawMessage === 'object' && rawMessage !== null) {
        return this.normalizeMessage(rawMessage)
      }

      // 其他类型的消息，转换为字符串处理
      return {
        type: WSMessageType.SYSTEM_NOTICE,
        data: { content: String(rawMessage) },
        timestamp: Date.now(),
      }
    } catch (error) {
      console.error('⚠️ 消息解析异常:', error, '原始消息:', rawMessage)
      return null
    }
  }

  /**
   * 标准化消息格式
   */
  private normalizeMessage(obj: any): WSMessage {
    // 确定消息类型
    let messageType: WSMessageType = WSMessageType.SYSTEM_NOTICE

    if (obj.type && Object.values(WSMessageType).includes(obj.type)) {
      messageType = obj.type
    } else if (obj.messageType && Object.values(WSMessageType).includes(obj.messageType)) {
      messageType = obj.messageType
    }

    // 提取消息数据
    let messageData = obj.data || obj.message || obj.content || obj

    // 如果数据是字符串且看起来像JSON，尝试解析
    if (typeof messageData === 'string') {
      try {
        messageData = JSON.parse(messageData)
      } catch {
        // 解析失败，保持原字符串
        messageData = { content: messageData }
      }
    }

    return {
      type: messageType,
      data: messageData,
      timestamp: obj.timestamp || Date.now(),
      id: obj.id || obj.messageId,
    }
  }

  /**
   * 获取当前注册的处理器列表
   */
  getHandlers(): string[] {
    return this.handlers.map((handler) => handler.constructor.name)
  }
}

// ================================
// 增强版 WebSocket Hook
// ================================

/**
 * UniApp WebSocket 通信钩子函数 (useWebSocket) - 动态退避策略
 *
 * 包含以下功能：
 * - 自动连接: 创建与服务器的WebSocket连接 (基于UniApp API实现)
 * - 动态退避重连: 连接断开后按指数退避策略自动重连 (自定义重连逻辑)
 * - 心跳检测: 定时发送心跳消息保持连接活跃 (heartbeat配置)
 * - 消息接收: 监听并处理服务器推送的消息 (onMessage)
 * - 消息发送: 提供发送消息的方法 (send)
 * - 连接管理: 提供手动连接、断开和重连的方法 (connect, disconnect, reconnect)
 * - 状态监控: 实时监控连接状态变化 (status, isConnected)
 * - 资源清理: 组件卸载时自动清理连接 (cleanup)
 * - 认证支持: 自动附加令牌进行身份验证 (getToken)
 *
 * @param url WebSocket服务器地址
 * @param options 配置选项 { maxRetries?: number, baseDelay?: number, heartbeatInterval?: number, heartbeatMessage?: string, onMessage?: Function, onConnected?: Function, onDisconnected?: Function, onError?: Function }
 * @returns { connect, disconnect, reconnect, send, status, isConnected, data } 返回控制方法、连接状态和数据
 */
export const useWebSocket = (
  url: string,
  options: {
    maxRetries?: number
    baseDelay?: number
    heartbeatInterval?: number
    heartbeatMessage?: string
    onMessage?: (data: any) => void
    onConnected?: () => void
    onDisconnected?: (code: number, reason: string) => void
    onError?: (error: any) => void
  } = {},
) => {
  // 检查系统配置
  const featureStore = useFeatureStore()
  if (!featureStore.features.websocketEnabled) {
    console.warn('[WebSocket] 系统未启用WebSocket功能')
    return {
      connect: () => {},
      disconnect: () => {},
      reconnect: () => {},
      send: () => false,
      status: ref('CLOSED'),
      isConnected: ref(false),
      data: ref(null),
    }
  }

  const { getToken } = useToken()

  // 退避策略配置
  const maxRetries = options.maxRetries ?? 8 // 默认8次重试
  const baseDelay = options.baseDelay ?? 3 // 默认3秒基础延迟
  const heartbeatInterval = options.heartbeatInterval ?? 30000 // 默认30秒心跳间隔
  const heartbeatMessage =
    options.heartbeatMessage ??
    JSON.stringify({
      type: 'ping',
      timestamp: Date.now(),
    })

  // 状态管理
  const status = ref<'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED'>('CLOSED')
  const isConnected = computed(() => status.value === 'OPEN')
  const data = ref<any>(null)

  // WebSocket 实例
  let socketTask: UniApp.SocketTask | null = null

  // 重试状态
  let currentRetryCount = 0
  let retryTimeoutId: number | null = null
  let isManuallyClose = false

  // 心跳定时器
  let heartbeatTimer: number | null = null

  /**
   * 动态计算退避延迟时间
   * 规律：3 -> 6 -> 12 -> 24 -> 48 -> 96 -> 192 -> 384...
   */
  const calculateRetryDelay = (retryIndex: number): number => {
    const delaySeconds = baseDelay * 2 ** retryIndex
    return delaySeconds * 1000
  }

  /**
   * 构造WebSocket连接URL
   */
  const buildWebSocketUrl = (): string => {
    const token = getToken()
    if (!token) {
      console.warn('[WebSocket] 未找到有效token，可能影响连接认证')
      return url
    }

    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}Authorization=${encodeURIComponent(`Bearer ${token}`)}`
  }

  /**
   * 发送消息
   */
  const send = (message: string | object): boolean => {
    if (!isConnected.value || !socketTask) {
      console.warn(
        `${getCurrentTime()} ⚠️ WebSocket未连接，无法发送消息，当前状态: ${status.value}`,
      )
      return false
    }

    try {
      const data = typeof message === 'string' ? message : JSON.stringify(message)

      socketTask.send({
        data,
        success: () => {
          // 忽略心跳消息打印，减少日志噪音
          if (!data.startsWith(`{"type":"ping"`)) {
            console.log(`${getCurrentTime()} 📤 WebSocket发送消息成功:`, data)
          }
        },
        fail: (error) => {
          console.error(`${getCurrentTime()} ❌ WebSocket发送消息失败:`, error)
        },
      })

      return true
    } catch (error) {
      console.error(`${getCurrentTime()} ❌ WebSocket发送消息异常:`, error)
      return false
    }
  }

  /**
   * 启动心跳检测
   */
  const startHeartbeat = () => {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer)
    }

    heartbeatTimer = setInterval(() => {
      if (isConnected.value && socketTask) {
        send(heartbeatMessage)
      }
    }, heartbeatInterval) as unknown as number
  }

  /**
   * 停止心跳检测
   */
  const stopHeartbeat = () => {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer)
      heartbeatTimer = null
    }
  }

  /**
   * 自定义退避重连逻辑
   */
  const attemptReconnect = () => {
    if (isManuallyClose) {
      console.log(`${getCurrentTime()} 🛑 手动关闭连接，停止重连`)
      return
    }

    if (currentRetryCount >= maxRetries) {
      console.log(`${getCurrentTime()} 🛑 WebSocket重试${maxRetries}次后连接失败，停止重试`)
      return
    }

    const delay = calculateRetryDelay(currentRetryCount)
    const delaySeconds = delay / 1000

    console.log(
      `${getCurrentTime()} 🔄 WebSocket将在${delaySeconds}秒后进行第${currentRetryCount + 1}次重连...`,
    )

    retryTimeoutId = setTimeout(() => {
      console.log(`${getCurrentTime()} 🚀 开始第${currentRetryCount + 1}次重连尝试...`)
      currentRetryCount++
      // eslint-disable-next-line ts/no-use-before-define
      connect()
    }, delay) as unknown as number
  }

  /**
   * 建立WebSocket连接
   */
  const connect = () => {
    // 如果已有连接，先关闭
    if (socketTask) {
      socketTask.close({
        code: 1000,
        reason: '重新连接',
      })
      socketTask = null
    }

    const finalUrl = buildWebSocketUrl()
    console.log(`${getCurrentTime()} 🔗 正在连接WebSocket: ${url}`)

    status.value = 'CONNECTING'

    try {
      socketTask = uni.connectSocket({
        url: finalUrl,
        complete: () => {},
      })

      // 连接打开事件
      socketTask.onOpen(() => {
        console.log(`${getCurrentTime()} ✅ WebSocket连接已建立`)
        status.value = 'OPEN'
        currentRetryCount = 0 // 连接成功后重置重试计数
        isManuallyClose = false

        // 清除重试定时器
        if (retryTimeoutId) {
          clearTimeout(retryTimeoutId)
          retryTimeoutId = null
        }

        // 启动心跳检测
        startHeartbeat()

        // 调用连接成功回调
        options.onConnected?.()
      })

      // 消息接收事件
      socketTask.onMessage((res) => {
        const messageData = res.data

        // 更新最后接收的消息
        data.value = messageData

        // 调用用户自定义的消息接收回调
        options.onMessage?.(messageData)
      })

      // 连接关闭事件
      socketTask.onClose((res) => {
        console.log(
          `${getCurrentTime()} ❌ WebSocket连接已断开, code: ${res.code}, reason: ${res.reason}`,
        )
        status.value = 'CLOSED'
        socketTask = null

        // 停止心跳检测
        stopHeartbeat()

        // 调用断开连接回调
        options.onDisconnected?.(res.code, res.reason)

        // 如果不是手动关闭且不是正常关闭，则尝试重连
        if (!isManuallyClose && res.code !== 1000) {
          attemptReconnect()
        }
      })

      // 连接错误事件
      socketTask.onError((error) => {
        console.error(`${getCurrentTime()} ❌ WebSocket连接错误:`, error)
        status.value = 'CLOSED'

        // 调用错误回调
        options.onError?.(error)

        // 连接错误也触发重连
        if (!isManuallyClose) {
          attemptReconnect()
        }
      })
    } catch (error) {
      console.error(`${getCurrentTime()} ❌ WebSocket连接创建失败:`, error)
      status.value = 'CLOSED'
      options.onError?.(error)

      // 创建失败也触发重连
      if (!isManuallyClose) {
        attemptReconnect()
      }
    }
  }

  /**
   * 断开WebSocket连接
   */
  const disconnect = () => {
    console.log(`${getCurrentTime()} 🔒 手动关闭WebSocket连接`)
    isManuallyClose = true

    // 清除重试定时器
    if (retryTimeoutId) {
      clearTimeout(retryTimeoutId)
      retryTimeoutId = null
    }

    // 重置重试计数
    currentRetryCount = 0

    // 停止心跳检测
    stopHeartbeat()

    if (socketTask) {
      status.value = 'CLOSING'
      socketTask.close({
        code: 1000,
        reason: '手动关闭',
      })
      socketTask = null
    } else {
      status.value = 'CLOSED'
    }
  }

  /**
   * 手动重新连接（重置重试计数）
   */
  const reconnect = () => {
    console.log(`${getCurrentTime()} 🔧 手动重新连接WebSocket...`)

    // 清除现有的重试定时器
    if (retryTimeoutId) {
      clearTimeout(retryTimeoutId)
      retryTimeoutId = null
    }

    // 重置状态
    currentRetryCount = 0
    isManuallyClose = false

    // 先断开再重新连接
    disconnect()
    setTimeout(() => {
      isManuallyClose = false // 重新设置为非手动关闭
      connect()
    }, 100)
  }

  // 暴露控制方法和状态
  return {
    connect,
    disconnect,
    reconnect,
    send,
    status: readonly(status),
    isConnected: readonly(isConnected),
    data: readonly(data),
  }
}

// ================================
// 全局WebSocket管理
// ================================

/**
 * 全局WebSocket管理器
 *
 * 包含以下功能：
 * - 单例管理: 确保应用级别只有一个WebSocket连接实例 (GlobalWebSocketManager)
 * - 自动初始化: 根据系统配置和用户状态自动初始化连接 (shouldInitializeWebSocket)
 * - URL构建: 自动根据当前协议构建正确的WebSocket地址 (getWebSocketUrl)
 * - 状态检查: 防止重复连接和初始化 (isInitialized, isInitializing)
 * - 连接控制: 提供连接、断开、发送消息的全局接口 (connect, disconnect, send)
 * - 消息处理: 统一处理全局级别的系统消息 (MessagePipeline)
 * - 资源清理: 提供销毁和重置功能 (destroy)
 * - 状态监控: 实时获取连接状态 (status, isConnected)
 */
class GlobalWebSocketManager {
  private wsInstance: ReturnType<typeof useWebSocket> | null = null
  private isInitialized = false
  private isInitializing = false
  private messagePipeline = new MessagePipeline()

  constructor() {
    // 初始化默认的消息处理管道
    this.setupDefaultMessageHandlers()
  }

  /**
   * 设置默认的消息处理器
   * 按优先级顺序添加处理器，处理器会按顺序执行
   */
  private setupDefaultMessageHandlers() {
    // console.log('🔧 初始化消息处理管道...')

    // 1. 心跳处理器 - 最高优先级，过滤技术消息
    this.messagePipeline.addHandler(new HeartbeatHandler())

    // 2. 系统通知处理器 - 处理系统级别的通知和公告
    this.messagePipeline.addHandler(new SystemNoticeHandler())

    // 3. 聊天消息处理器 - 处理聊天相关消息
    // this.messagePipeline.addHandler(new ChatMessageHandler())

    console.log('✅ 消息处理管道初始化完成，处理器列表:', this.messagePipeline.getHandlers())
  }

  /**
   * 获取WebSocket URL
   * 自动根据环境构建正确的WebSocket地址
   */
  private getWebSocketUrl(): string {
    const baseUrl = SystemConfig.api.baseUrl

    // H5环境特殊处理：根据当前页面协议决定WebSocket协议
    if (PLATFORM.isH5) {
      const currentProtocol = window.location.protocol
      let wsUrl: string

      if (currentProtocol === 'https:') {
        // HTTPS页面使用WSS协议
        wsUrl = baseUrl.replace(/^https?:/, 'wss:')
      } else {
        // HTTP页面使用WS协议
        wsUrl = baseUrl.replace(/^https?:/, 'ws:')
      }

      // console.log(
      //   `[GlobalWebSocket] H5环境 - 页面协议: ${currentProtocol}, WebSocket URL: ${wsUrl}/resource/websocket`,
      // )
      return `${wsUrl}/resource/websocket`
    }

    // 非H5环境（小程序等）：根据baseUrl的协议决定
    const wsUrl = baseUrl.replace(/^https?:/, baseUrl.startsWith('https:') ? 'wss:' : 'ws:')

    return `${wsUrl}/resource/websocket`
  }

  /**
   * 检查是否应该初始化WebSocket
   */
  private shouldInitializeWebSocket(): { should: boolean; reason: string } {
    // 检查系统配置
    const featureStore = useFeatureStore()
    if (!featureStore.features.websocketEnabled) {
      return { should: false, reason: '系统未启用WebSocket功能' }
    }

    // 检查用户登录状态
    const { getToken } = useToken()
    const token = getToken()
    if (!token) {
      return { should: false, reason: '用户未登录' }
    }

    return { should: true, reason: '满足初始化条件' }
  }

  /**
   * 获取WebSocket URL
   * 自动根据环境构建正确的WebSocket地址
   */
  initialize(url?: string, options?: Parameters<typeof useWebSocket>[1]) {
    // 如果已经初始化，直接返回现有实例
    if (this.isInitialized) {
      // console.log('[GlobalWebSocket] 已初始化，返回现有实例')
      return this.wsInstance
    }

    // 如果正在初始化中，返回null并提示
    if (this.isInitializing) {
      // console.log('[GlobalWebSocket] 正在初始化中，跳过重复调用')
      return null
    }

    // 设置初始化标志
    this.isInitializing = true

    // 检查是否应该初始化
    const { should, reason } = this.shouldInitializeWebSocket()

    if (!should) {
      // console.log(`[GlobalWebSocket] 跳过初始化: ${reason}`)
      this.isInitializing = false
      return null
    }

    // console.log(`[GlobalWebSocket] ${reason}，开始初始化全局WebSocket连接`)

    try {
      // 使用自定义URL或自动构建的URL
      const wsUrl = url || this.getWebSocketUrl()

      this.wsInstance = useWebSocket(wsUrl, {
        maxRetries: 8,
        baseDelay: 3,
        heartbeatInterval: 30000,
        ...options,

        // 使用消息管道处理所有消息
        onMessage: (data) => {
          this.messagePipeline.process(data)
          // 还可以调用用户自定义的消息处理
          options?.onMessage?.(data)
        },

        onConnected: () => {
          // console.log('[GlobalWebSocket] 全局WebSocket连接建立成功')
          options?.onConnected?.()
        },
        onDisconnected: (code, reason) => {
          // console.log('[GlobalWebSocket] 全局WebSocket连接断开', { code, reason })
          options?.onDisconnected?.(code, reason)
        },
        onError: (error) => {
          // console.error('[GlobalWebSocket] 全局WebSocket连接错误', error)
          options?.onError?.(error)
        },
      })

      this.isInitialized = true
      // console.log('[GlobalWebSocket] 初始化完成')
    } catch (error) {
      // console.error('[GlobalWebSocket] 初始化失败:', error)
      this.wsInstance = null
    } finally {
      this.isInitializing = false
    }

    return this.wsInstance
  }

  /**
   * 连接WebSocket
   */
  connect() {
    if (!this.wsInstance) {
      // console.warn('[GlobalWebSocket] 未初始化，无法连接')
      return false
    }

    if (this.wsInstance.status.value === 'OPEN') {
      // console.log('[GlobalWebSocket] 连接已建立，跳过重复连接')
      return true
    }

    if (this.wsInstance.status.value === 'CONNECTING') {
      // console.log('[GlobalWebSocket] 正在连接中，跳过重复连接')
      return true
    }

    this.wsInstance.connect()
    return true
  }

  /**
   * 断开WebSocket连接
   */
  disconnect() {
    if (!this.wsInstance) {
      return
    }
    this.wsInstance.disconnect()
  }

  /**
   * 重新连接
   */
  reconnect() {
    if (!this.wsInstance) {
      // console.warn('[GlobalWebSocket] 未初始化，无法重连')
      return false
    }
    this.wsInstance.reconnect()
    return true
  }

  /**
   * 发送消息
   */
  send(message: string | object): boolean {
    if (!this.wsInstance) {
      // console.warn('[GlobalWebSocket] 未初始化，无法发送消息')
      return false
    }
    return this.wsInstance.send(message)
  }

  /**
   * 添加自定义消息处理器
   * @param handler 消息处理器实例
   */
  addMessageHandler(handler: MessageHandler): void {
    this.messagePipeline.addHandler(handler)
    // console.log(`[GlobalWebSocket] 添加自定义消息处理器: ${handler.constructor.name}`)
  }

  /**
   * 移除消息处理器
   * @param handlerClass 要移除的处理器类
   */
  removeMessageHandler(handlerClass: new () => MessageHandler): void {
    this.messagePipeline.removeHandler(handlerClass)
    // console.log(`[GlobalWebSocket] 移除消息处理器: ${handlerClass.name}`)
  }

  /**
   * 获取当前消息处理器列表
   */
  getMessageHandlers(): string[] {
    return this.messagePipeline.getHandlers()
  }

  /**
   * 获取连接状态
   */
  get status() {
    return this.wsInstance?.status.value || 'CLOSED'
  }

  /**
   * 获取是否已连接
   */
  get isConnected() {
    return this.wsInstance?.isConnected.value || false
  }

  /**
   * 获取最后接收的消息
   */
  get lastMessage() {
    return this.wsInstance?.data.value || null
  }

  /**
   * 销毁全局WebSocket
   */
  destroy() {
    if (this.wsInstance) {
      this.wsInstance.disconnect()
      this.wsInstance = null
    }
    this.isInitialized = false
    this.isInitializing = false
    // console.log('[GlobalWebSocket] 已重置，可重新初始化')
  }
}

// 创建全局实例
export const webSocket = new GlobalWebSocketManager()
