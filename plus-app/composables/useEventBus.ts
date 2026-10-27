/**
 * 事件总线组合函数 (useEventBus)
 *
 * 提供组件间的事件通信功能，支持发布订阅模式的事件管理。
 * 此组合函数集成了 Vue 生命周期，自动处理事件监听器的清理，避免内存泄漏。
 *
 * 包含以下功能：
 * - 事件监听: 监听指定事件并执行回调函数 (on)
 * - 一次性监听: 监听事件仅执行一次后自动移除 (once)
 * - 事件发送: 向指定事件发送数据 (emit)
 * - 事件移除: 手动移除事件监听器 (off)
 * - 自动清理: 组件卸载时自动清理所有监听器
 * - 调试功能: 获取事件监听器数量 (getListenerCount)
 *
 * @returns 返回事件总线相关的方法和常量
 *
 * @example
 * // 基本使用 - 在设备列表组件中
 * import { useEventBus } from '@/composables/useEventBus'
 *
 * export default defineComponent({
 *   setup() {
 *     const { on, emit, EventNames } = useEventBus()
 *
 *     // 监听设备列表刷新事件
 *     on(EventNames.REFRESH_DEVICE_LIST, () => {
 *       console.log('刷新设备列表')
 *       loadDeviceList()
 *     })
 *
 *     // 监听设备添加事件
 *     on(EventNames.DEVICE_ADDED, (deviceData) => {
 *       console.log('新设备添加:', deviceData)
 *       addDeviceToList(deviceData)
 *     })
 *
 *     // 删除设备后发送事件
 *     const deleteDevice = (deviceId) => {
 *       // 执行删除逻辑...
 *       emit(EventNames.DEVICE_DELETED, { deviceId })
 *     }
 *
 *     return { deleteDevice }
 *   }
 * })
 *
 * @example
 * // 跨页面通信 - 在设备添加页面
 * import { useEventBus } from '@/composables/useEventBus'
 *
 * export default defineComponent({
 *   setup() {
 *     const { emit, EventNames } = useEventBus()
 *
 *     // 设备添加成功后通知其他页面刷新
 *     const onAddSuccess = (newDevice) => {
 *       emit(EventNames.DEVICE_ADDED, newDevice)
 *       emit(EventNames.REFRESH_DEVICE_LIST)
 *       uni.navigateBack()
 *     }
 *
 *     return { onAddSuccess }
 *   }
 * })
 *
 * @example
 * // 一次性监听和手动清理
 * import { useEventBus } from '@/composables/useEventBus'
 *
 * export default defineComponent({
 *   setup() {
 *     const { on, once, off, EventNames } = useEventBus()
 *
 *     // 只监听一次用户登录事件
 *     once(EventNames.USER_LOGIN, (userData) => {
 *       console.log('用户登录成功:', userData)
 *     })
 *
 *     // 手动控制监听器生命周期
 *     const handleLogout = () => {
 *       console.log('用户退出登录')
 *     }
 *
 *     const unsubscribe = on(EventNames.USER_LOGOUT, handleLogout)
 *
 *     // 在某个条件下手动移除监听
 *     const stopListening = () => {
 *       unsubscribe() // 或者 off(EventNames.USER_LOGOUT, handleLogout)
 *     }
 *
 *     return { stopListening }
 *   }
 * })
 */

import { onUnmounted } from 'vue'

interface EventCallback {
  (...args: any[]): void
}

interface EventMap {
  [key: string]: EventCallback[]
}

class EventBus {
  private events: EventMap = {}

  /**
   * 监听事件
   * @param event 事件名称
   * @param callback 事件回调函数
   * @returns 返回取消监听的函数
   */
  on(event: string, callback: EventCallback): () => void {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
    return () => this.off(event, callback)
  }

  /**
   * 移除事件监听
   * @param event 事件名称
   * @param callback 可选，指定的回调函数，不传则移除该事件的所有监听器
   */
  off(event: string, callback?: EventCallback): void {
    if (!this.events[event]) return

    if (callback) {
      const index = this.events[event].indexOf(callback)
      if (index > -1) {
        this.events[event].splice(index, 1)
        if (this.events[event].length === 0) {
          delete this.events[event]
        }
      }
    } else {
      delete this.events[event]
    }
  }

  /**
   * 触发事件
   * @param event 事件名称
   * @param args 传递给监听器的参数
   * @returns 返回是否成功执行（无错误）
   */
  emit(event: string, ...args: any[]): boolean {
    if (!this.events[event] || this.events[event].length === 0) {
      return false
    }

    const callbacks = [...this.events[event]]
    let hasError = false

    callbacks.forEach((callback) => {
      try {
        callback(...args)
      } catch (error) {
        console.error(`事件 ${event} 的回调执行出错:`, error)
        hasError = true
      }
    })

    return !hasError
  }

  /**
   * 只监听一次事件
   * @param event 事件名称
   * @param callback 事件回调函数
   * @returns 返回取消监听的函数
   */
  once(event: string, callback: EventCallback): () => void {
    const onceWrapper = (...args: any[]) => {
      callback(...args)
      this.off(event, onceWrapper)
    }
    return this.on(event, onceWrapper)
  }

  /**
   * 获取指定事件的监听器数量
   * @param event 事件名称
   * @returns 监听器数量
   */
  getListenerCount(event: string): number {
    return this.events[event]?.length || 0
  }

  /**
   * 清除所有事件监听器
   */
  clear(): void {
    this.events = {}
  }
}

// 全局事件总线实例
const eventBus = new EventBus()

/**
 * 事件名称常量
 * @description 定义所有可用的事件名称，避免拼写错误和提供代码提示
 */
export const EventNames = {
  // 页面相关事件
  /** 页面返回 */
  PAGE_BACK: 'pageBack',
  /** Tab 切换 */
  TAB_CHANGED: 'tabChanged',
  /** 页面刷新 */
  PAGE_REFRESH: 'pageRefresh',

  // 用户相关事件
  /** 用户登录成功 */
  USER_LOGIN: 'userLogin',
  /** 用户退出登录 */
  USER_LOGOUT: 'userLogout',
  /** 用户信息更新 */
  USER_PROFILE_UPDATED: 'userProfileUpdated',

  // 网络和系统事件
  /** 网络状态变更 */
  NETWORK_STATUS_CHANGED: 'networkStatusChanged',
  /** API 请求错误 */
  API_ERROR: 'apiError',
} as const

/**
 * 事件总线组合函数
 * @description 提供自动清理功能的事件监听，组件卸载时自动移除所有监听器
 * @returns 返回事件总线的方法和常量
 */
export function useEventBus() {
  const unsubscribers: (() => void)[] = []

  /**
   * 自动清理版本的事件监听
   * @param event 事件名称
   * @param callback 事件回调函数
   * @returns 返回取消监听的函数
   * @description 组件卸载时会自动清理此监听器
   */
  const on = (event: string, callback: EventCallback) => {
    const unsubscribe = eventBus.on(event, callback)
    unsubscribers.push(unsubscribe)
    return unsubscribe
  }

  /**
   * 自动清理版本的一次性事件监听
   * @param event 事件名称
   * @param callback 事件回调函数
   * @returns 返回取消监听的函数
   * @description 组件卸载时会自动清理此监听器（如果还未触发）
   */
  const once = (event: string, callback: EventCallback) => {
    const unsubscribe = eventBus.once(event, callback)
    unsubscribers.push(unsubscribe)
    return unsubscribe
  }

  // 组件卸载时自动清理所有监听器
  onUnmounted(() => {
    unsubscribers.forEach((fn) => fn())
    unsubscribers.length = 0
  })

  return {
    /** 事件名称常量 */
    EventNames,

    /** 监听事件（自动清理） */
    on,

    /** 一次性监听事件（自动清理） */
    once,

    /** 移除事件监听器 */
    off: eventBus.off.bind(eventBus),

    /** 发送事件 */
    emit: eventBus.emit.bind(eventBus),

    /** 获取事件监听器数量 */
    getListenerCount: eventBus.getListenerCount.bind(eventBus),
  }
}

/**
 * 事件数据类型定义
 * @description 定义各个事件携带的数据结构，提供更好的类型提示
 */
export interface EventPayloads {
  /** Tab 切换事件数据 */
  [EventNames.TAB_CHANGED]: {
    from: number
    to: number
  }

  /** 网络状态变更事件数据 */
  [EventNames.NETWORK_STATUS_CHANGED]: {
    isConnected: boolean
    networkType?: string
  }
}
