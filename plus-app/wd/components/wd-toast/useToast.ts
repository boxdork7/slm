// useToast.ts
import type { Ref } from 'vue'
import type { Toast, ToastOptions } from './wd-toast.vue'
import { ref } from 'vue'
import { deepMerge } from '../common/util'

/**
 * Toast 选项的响应式引用类型
 */
export type ToastOptionRef = Ref<ToastOptions>

/**
 * Toast 实例信息
 */
interface ToastInstance {
  id: string
  selector: string
  option: ToastOptionRef
  zIndex: number
  offsetY: number
  timer?: ReturnType<typeof setTimeout>
}

/**
 * useToast 用到的key
 */
const toastDefaultOptionKey = '__TOAST_OPTION__'

/**
 * 全局 toastOption 缓存，确保同一个 selector 对应唯一实例
 */
const toastOptionsCache = new Map<string, ToastOptionRef>()

/**
 * 全局活跃的 Toast 实例队列，用于管理偏移位置
 */
const activeToastInstances = new Map<string, ToastInstance>()

/**
 * Toast 基础高度（包括间距）
 */
const TOAST_HEIGHT = 60

/**
 * Toast 基础层级
 */
const BASE_Z_INDEX = 1000
/**
 * 默认配置选项
 */
export const defaultOptions: ToastOptions = {
  duration: 2000,
  show: false,
}

/**
 * 获取 Toast 选项的注入键
 * @param selector 选择器，用于支持多实例
 * @returns 注入键
 */
export const getToastOptionKey = (selector: string) => {
  return selector ? `${toastDefaultOptionKey}${selector}` : toastDefaultOptionKey
}

/**
 * 生成唯一的 Toast 实例 ID
 * @returns 唯一 ID
 */
const generateToastId = (): string => {
  return `toast_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

/**
 * 计算 Toast 的偏移位置和层级
 * @param position Toast 位置
 * @returns  偏移量 层级
 */
const calculateToastOffset = (position: string): { offsetY: number; zIndex: number } => {
  // 过滤时要检查实例是否真的还在显示状态
  const samePositionToasts = Array.from(activeToastInstances.values())
    .filter((instance) => {
      const instancePosition = instance.option.value.position || 'middle-top'
      const isVisible = instance.option.value.show === true
      return instancePosition === position && isVisible
    })
    .sort((a, b) => a.zIndex - b.zIndex)

  const offsetY = samePositionToasts.length * TOAST_HEIGHT
  const zIndex = BASE_Z_INDEX + activeToastInstances.size

  return { offsetY, zIndex }
}

/**
 * 清理已经关闭的 Toast 实例
 */
export const cleanupClosedToasts = () => {
  for (const [toastId, instance] of activeToastInstances.entries()) {
    if (instance.option.value.show !== true) {
      // 清理定时器
      if (instance.timer) {
        clearTimeout(instance.timer)
      }
      // 从活跃队列中移除
      activeToastInstances.delete(toastId)
    }
  }
}

/**
 * 更新所有相同位置的 Toast 偏移量
 * @param position Toast 位置
 */
const updateToastOffsets = (position: string) => {
  // 先清理已经关闭的实例
  cleanupClosedToasts()

  const samePositionToasts = Array.from(activeToastInstances.values())
    .filter((instance) => {
      const instancePosition = instance.option.value.position || 'middle-top'
      const isVisible = instance.option.value.show === true
      return instancePosition === position && isVisible
    })
    .sort((a, b) => a.zIndex - b.zIndex)

  samePositionToasts.forEach((instance, index) => {
    instance.offsetY = index * TOAST_HEIGHT
    // 触发响应式更新
    instance.option.value = {
      ...instance.option.value,
      _offsetY: instance.offsetY,
      zIndex: instance.zIndex,
    }
  })
}

/**
 * 获取或创建 ToastOption，确保同一个 selector 对应唯一实例
 * @param selector 选择器
 * @returns Toast 选项的响应式引用
 */
export const getToastOption = (selector: string = ''): ToastOptionRef => {
  const key = getToastOptionKey(selector)

  // 检查缓存中是否已存在
  if (toastOptionsCache.has(key)) {
    return toastOptionsCache.get(key)!
  }

  // 创建新的 toastOption
  const newOption = ref<ToastOptions>({ ...defaultOptions })

  // 缓存新创建的选项
  toastOptionsCache.set(key, newOption)

  return newOption
}

/**
 * 清理指定 selector 的 toastOption 缓存
 * @param selector 选择器
 */
export const clearToastOption = (selector: string = '') => {
  const key = getToastOptionKey(selector)
  toastOptionsCache.delete(key)
}

/**
 * 清理所有 toastOption 缓存
 */
export const clearAllToastOptions = () => {
  toastOptionsCache.clear()
  activeToastInstances.clear()
}

/**
 * useToast 组合函数
 * @param selector 选择器，用于支持多实例场景
 * @returns Toast 实例
 */
export const useToast = (selector: string = ''): Toast => {
  // 获取或创建对应的 toastOption
  const toastOption = getToastOption(selector)
  /**
   * 关闭 Toast
   * @param toastId 可选的 Toast ID，如果不提供则关闭当前 selector 的 Toast
   */
  const close = (toastId?: string) => {
    if (toastId) {
      // 关闭指定 ID 的 Toast
      const instance = activeToastInstances.get(toastId)
      if (instance) {
        if (instance.timer) {
          clearTimeout(instance.timer)
        }

        // 设置为关闭状态
        instance.option.value = { ...instance.option.value, show: false }

        // 从活跃队列中移除
        activeToastInstances.delete(toastId)

        // 更新相同位置的其他 Toast 偏移量
        const position = instance.option.value.position || 'middle-top'
        updateToastOffsets(position)
      }
    } else {
      // 关闭当前 selector 的 Toast
      const currentToastId = toastOption.value._toastId
      if (currentToastId) {
        close(currentToastId)
      } else {
        // 兜底：直接设置为关闭状态
        toastOption.value = { ...toastOption.value, show: false }
      }
    }
  }
  /**
   * 显示 Toast
   * @param option 配置选项或消息字符串
   */
  const show = (option: ToastOptions | string) => {
    // 显示新 Toast 前，先关闭当前 selector 的旧 Toast
    const currentToastId = toastOption.value._toastId
    if (currentToastId && activeToastInstances.has(currentToastId)) {
      close(currentToastId)
    }
    const options = deepMerge(
      defaultOptions,
      typeof option === 'string' ? { msg: option } : option,
    ) as ToastOptions

    const position = options.position || 'middle-top'

    // 计算偏移前先清理已关闭的实例
    cleanupClosedToasts()
    const { offsetY, zIndex } = calculateToastOffset(position)

    // 生成唯一 ID
    const toastId = generateToastId()

    // 合并配置，添加偏移和层级信息
    const finalOptions = {
      ...options,
      show: true,
      zIndex,
      _offsetY: offsetY,
      _toastId: toastId,
    }

    // 创建 Toast 实例信息
    const toastInstance: ToastInstance = {
      id: toastId,
      selector,
      option: toastOption,
      zIndex,
      offsetY,
    }

    // 添加到活跃实例队列
    activeToastInstances.set(toastId, toastInstance)

    // 更新 toastOption
    toastOption.value = finalOptions

    // 更新所有相同位置的 Toast 偏移量
    updateToastOffsets(position)

    // 设置自动关闭定时器
    if (finalOptions.duration && finalOptions.duration > 0) {
      toastInstance.timer = setTimeout(() => {
        close(toastId)
      }, finalOptions.duration)
    }
  }
  /**
   * 创建特定类型的 Toast 方法
   * @param toastOptions 预设配置
   * @returns Toast 方法
   */
  const createMethod = (toastOptions: ToastOptions) => {
    return (options: ToastOptions | string) => {
      return show(
        deepMerge(
          toastOptions,
          typeof options === 'string' ? { msg: options } : options,
        ) as ToastOptions,
      )
    }
  }

  /**
   * 显示加载 Toast
   */
  const loading = createMethod({
    iconName: 'loading',
    duration: 0,
    cover: true,
  })

  /**
   * 显示成功 Toast
   */
  const success = createMethod({
    iconName: 'success',
    duration: 1500,
  })

  /**
   * 显示错误 Toast
   */
  const error = createMethod({
    iconName: 'error',
  })

  /**
   * 显示警告 Toast
   */
  const warning = createMethod({
    iconName: 'warning',
  })

  /**
   * 显示信息 Toast
   */
  const info = createMethod({
    iconName: 'info',
  })

  return {
    show,
    loading,
    success,
    error,
    warning,
    info,
    close: () => close(),
  }
}
