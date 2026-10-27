// useNotify.ts
import type { Ref } from 'vue'
import type { NotifyOptions } from './wd-notify.vue'
import { ref } from 'vue'
import { deepMerge } from '../common/util'

/**
 * Notify 选项的响应式引用类型
 */
export type NotifyOptionRef = Ref<NotifyOptions>

/**
 * Notify 实例信息
 */
interface NotifyInstance {
  id: string
  selector: string
  option: NotifyOptionRef
  timer?: ReturnType<typeof setTimeout>
}

/**
 * useNotify 用到的key
 */
const notifyDefaultOptionKey = '__NOTIFY_OPTION__'

/**
 * 全局 notifyOption 缓存，确保同一个 selector 对应唯一实例
 */
const notifyOptionsCache = new Map<string, NotifyOptionRef>()

/**
 * 全局活跃的 Notify 实例，用于管理定时器
 */
const activeNotifyInstances = new Map<string, NotifyInstance>()

/**
 * 基础 z-index 层级
 */
const BASE_Z_INDEX = 1000

/**
 * 当前最大的 z-index
 */
let currentMaxZIndex = BASE_Z_INDEX

/**
 * 默认配置选项
 */
export const defaultOptions: NotifyOptions = {
  type: 'danger',
  color: '',
  zIndex: 100,
  message: '',
  duration: 3000,
  position: 'top',
  safeHeight: 0,
  background: '',
  visible: false,
  autoSafeTop: true,
  offsetTop: 0,
}

/**
 * 获取 Notify 选项的注入键
 * @param selector 选择器，用于支持多实例
 * @returns 注入键
 */
export const getNotifyOptionKey = (selector: string) => {
  return selector ? `${notifyDefaultOptionKey}${selector}` : notifyDefaultOptionKey
}

/**
 * 生成唯一的 Notify 实例 ID
 * @returns 唯一 ID
 */
const generateNotifyId = (): string => {
  return `notify_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 清理已经关闭的 Notify 实例
 */
export const cleanupClosedNotifies = () => {
  for (const [notifyId, instance] of activeNotifyInstances.entries()) {
    if (instance.option.value.visible !== true) {
      // 清理定时器
      if (instance.timer) {
        clearTimeout(instance.timer)
      }
      // 从活跃队列中移除
      activeNotifyInstances.delete(notifyId)
    }
  }
}

/**
 * 获取或创建 NotifyOption，确保同一个 selector 对应唯一实例
 * @param selector 选择器
 * @returns Notify 选项的响应式引用
 */
export const getNotifyOption = (selector: string = ''): NotifyOptionRef => {
  const key = getNotifyOptionKey(selector)

  // 检查缓存中是否已存在
  if (notifyOptionsCache.has(key)) {
    return notifyOptionsCache.get(key)!
  }

  // 创建新的 notifyOption
  const newOption = ref<NotifyOptions>({ ...defaultOptions })

  // 缓存新创建的选项
  notifyOptionsCache.set(key, newOption)

  return newOption
}

/**
 * 清理指定 selector 的 notifyOption 缓存
 * @param selector 选择器
 */
export const clearNotifyOption = (selector: string = '') => {
  const key = getNotifyOptionKey(selector)
  notifyOptionsCache.delete(key)
}

/**
 * 清理所有 notifyOption 缓存
 */
export const clearAllNotifyOptions = () => {
  notifyOptionsCache.clear()
  activeNotifyInstances.clear()
}

/**
 * useNotify 组合函数
 * @param selector 选择器，用于支持多实例场景
 * @returns Notify 实例
 */
export const useNotify = (selector: string = '') => {
  // 获取或创建对应的 notifyOption
  const notifyOption = getNotifyOption(selector)

  /**
   * 关闭 Notify
   * @param notifyId 可选的 Notify ID，如果不提供则关闭当前 selector 的 Notify
   */
  const close = (notifyId?: string) => {
    if (notifyId) {
      // 关闭指定 ID 的 Notify
      const instance = activeNotifyInstances.get(notifyId)
      if (instance) {
        if (instance.timer) {
          clearTimeout(instance.timer)
        }

        // 设置为关闭状态
        instance.option.value = { ...instance.option.value, visible: false }

        // 从活跃队列中移除
        activeNotifyInstances.delete(notifyId)
      }
    } else {
      // 关闭当前 selector 的 Notify
      const currentNotifyId = notifyOption.value._notifyId
      if (currentNotifyId) {
        close(currentNotifyId)
      } else {
        // 兜底：直接设置为关闭状态
        notifyOption.value = { ...notifyOption.value, visible: false }
      }
    }
  }

  /**
   * 显示 Notify
   * @param option 配置选项或消息字符串
   */
  const show = (option: NotifyOptions | string) => {
    // 显示新 Notify 前，先关闭当前 selector 的旧 Notify
    const currentNotifyId = notifyOption.value._notifyId
    if (currentNotifyId && activeNotifyInstances.has(currentNotifyId)) {
      close(currentNotifyId)
    }

    const options = deepMerge(
      defaultOptions,
      typeof option === 'string' ? { message: option } : option,
    ) as NotifyOptions

    // 生成唯一 ID
    const notifyId = generateNotifyId()

    // 递增 z-index，确保后弹出的通知层级更高
    currentMaxZIndex += 1

    // 合并配置，优先使用递增的 zIndex
    const finalOptions = {
      ...options,
      visible: true,
      zIndex: currentMaxZIndex, // 强制使用递增的 zIndex
      _notifyId: notifyId,
    }

    // 创建 Notify 实例信息
    const notifyInstance: NotifyInstance = {
      id: notifyId,
      selector,
      option: notifyOption,
    }

    // 添加到活跃实例队列
    activeNotifyInstances.set(notifyId, notifyInstance)

    // 更新 notifyOption
    notifyOption.value = finalOptions

    // 设置自动关闭定时器
    if (finalOptions.duration && finalOptions.duration > 0) {
      notifyInstance.timer = setTimeout(() => {
        close(notifyId)
      }, finalOptions.duration)
    }
  }

  /**
   * 创建特定类型的 Notify 方法
   * @param notifyOptions 预设配置
   * @returns Notify 方法
   */
  const createMethod = (notifyOptions: NotifyOptions) => {
    return (options: NotifyOptions | string) => {
      return show(
        deepMerge(
          notifyOptions,
          typeof options === 'string' ? { message: options } : options,
        ) as NotifyOptions,
      )
    }
  }

  /**
   * 显示主要 Notify
   */
  const primary = createMethod({
    type: 'primary',
  })

  /**
   * 显示成功 Notify
   */
  const success = createMethod({
    type: 'success',
  })

  /**
   * 显示危险 Notify
   */
  const danger = createMethod({
    type: 'danger',
  })

  /**
   * 显示警告 Notify
   */
  const warning = createMethod({
    type: 'warning',
  })

  return {
    show,
    primary,
    success,
    danger,
    warning,
    close: () => close(),
  }
}
