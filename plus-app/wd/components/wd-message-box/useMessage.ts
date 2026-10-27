// useMessage.ts
import type { Ref } from 'vue'
import type { InputType } from '../wd-input/wd-input.vue'
import { ref } from 'vue'
import { deepMerge } from '../common/util'

/**
 * 消息框类型
 */
export type MessageType = 'alert' | 'confirm' | 'prompt'

/**
 * 操作类型
 */
export type ActionType = 'confirm' | 'cancel' | 'modal'

/**
 * 输入校验函数
 */
export type InputValidate = (inputValue: string | number) => boolean

/**
 * 确认前钩子选项
 */
export interface MessageBeforeConfirmOption {
  resolve: (isPass: boolean) => void
}

/**
 * 消息框结果
 */
export interface MessageResult {
  action: ActionType
  value?: string | number
}

/**
 * 消息框配置选项
 */
export interface MessageOptions {
  /** 标题 */
  title?: string
  /** 是否展示取消按钮 */
  showCancelButton?: boolean
  /** 是否支持点击蒙层进行关闭，点击蒙层回调传入的action为'modal' */
  closeOnClickModal?: boolean
  /** 确定按钮文案 */
  confirmButtonText?: string
  /** 取消按钮文案 */
  cancelButtonText?: string
  /** 消息文案 */
  msg?: string
  /** 弹框类型 */
  type?: MessageType
  /** 当type为prompt时，输入框类型 */
  inputType?: InputType
  /** 当type为prompt时，输入框初始值 */
  inputValue?: string | number
  /** 当type为prompt时，输入框placeholder */
  inputPlaceholder?: string
  /** 当type为prompt时，输入框正则校验，点击确定按钮时进行校验 */
  inputPattern?: RegExp
  /** 当type为prompt时，输入框校验函数，点击确定按钮时进行校验 */
  inputValidate?: InputValidate
  /** 当type为prompt时，输入框检验不通过时的错误提示文案 */
  inputError?: string
  /** 是否展示错误信息 */
  showErr?: boolean
  /** 弹窗层级 */
  zIndex?: number
  /** 弹层内容懒渲染，触发展示时才渲染内容 */
  lazyRender?: boolean
  /** 确认前钩子 */
  beforeConfirm?: (options: MessageBeforeConfirmOption) => void
  /** 取消按钮Props */
  cancelButtonProps?: any
  /** 确认按钮Props */
  confirmButtonProps?: any
  /** 是否显示 */
  visible?: boolean
  /** 内部使用：消息框实例ID */
  _messageId?: string
}

/**
 * 消息框选项的响应式引用类型
 */
export type MessageOptionRef = Ref<MessageOptions>

/**
 * 消息框实例信息
 */
interface MessageInstance {
  id: string
  selector: string
  option: MessageOptionRef
  resolve?: (result: MessageResult) => void
}

/**
 * useMessage 用到的key
 */
const messageDefaultOptionKey = '__MESSAGE_OPTION__'

/**
 * 全局 messageOption 缓存，确保同一个 selector 对应唯一实例
 */
const messageOptionsCache = new Map<string, MessageOptionRef>()

/**
 * 全局活跃的 Message 实例队列
 */
const activeMessageInstances = new Map<string, MessageInstance>()

/**
 * 默认配置选项
 */
export const defaultOptions: MessageOptions = {
  title: '',
  showCancelButton: false,
  closeOnClickModal: true,
  msg: '',
  type: 'alert',
  inputType: 'text',
  inputValue: '',
  showErr: false,
  zIndex: 1000,
  lazyRender: true,
  inputError: '',
  visible: false,
}

/**
 * 获取 Message 选项的注入键
 * @param selector 选择器，用于支持多实例
 * @returns 注入键
 */
export const getMessageOptionKey = (selector: string) => {
  return selector ? `${messageDefaultOptionKey}${selector}` : messageDefaultOptionKey
}

/**
 * 生成唯一的 Message 实例 ID
 * @returns 唯一 ID
 */
const generateMessageId = (): string => {
  return `message_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 获取或创建 MessageOption，确保同一个 selector 对应唯一实例
 * @param selector 选择器
 * @returns Message 选项的响应式引用
 */
export const getMessageOption = (selector: string = ''): MessageOptionRef => {
  const key = getMessageOptionKey(selector)

  // 检查缓存中是否已存在
  if (messageOptionsCache.has(key)) {
    return messageOptionsCache.get(key)!
  }

  // 创建新的 messageOption
  const newOption = ref<MessageOptions>({ ...defaultOptions })

  // 缓存新创建的选项
  messageOptionsCache.set(key, newOption)

  return newOption
}

/**
 * 清理指定 selector 的 messageOption 缓存
 * @param selector 选择器
 */
export const clearMessageOption = (selector: string = '') => {
  const key = getMessageOptionKey(selector)
  messageOptionsCache.delete(key)
}

/**
 * 清理所有 messageOption 缓存
 */
export const clearAllMessageOptions = () => {
  messageOptionsCache.clear()
  activeMessageInstances.clear()
}

/**
 * useMessage 组合函数
 * @param selector 选择器，用于支持多实例场景
 * @returns Message 实例
 */
export const useMessage = (selector: string = '') => {
  // 获取或创建对应的 messageOption
  const messageOption = getMessageOption(selector)
  /**
   * 关闭 Message
   * @param messageId 可选的 Message ID，如果不提供则关闭当前 selector 的 Message
   */
  const close = (messageId?: string) => {
    if (messageId) {
      // 关闭指定 ID 的 Message
      const instance = activeMessageInstances.get(messageId)
      if (instance) {
        // 设置为关闭状态
        instance.option.value = { ...instance.option.value, visible: false }

        // 从活跃队列中移除
        activeMessageInstances.delete(messageId)
      }
    } else {
      // 关闭当前 selector 的 Message
      const currentMessageId = messageOption.value._messageId
      if (currentMessageId) {
        close(currentMessageId)
      } else {
        // 兜底：直接设置为关闭状态
        messageOption.value = { ...messageOption.value, visible: false }
      }
    }
  }
  /**
   * 显示 Message
   * @param option 配置选项或消息字符串
   */
  const show = (option: MessageOptions | string): Promise<MessageResult> => {
    return new Promise<MessageResult>((resolve) => {
      // 显示新 Message 前，先关闭当前 selector 的旧 Message
      const currentMessageId = messageOption.value._messageId
      if (currentMessageId && activeMessageInstances.has(currentMessageId)) {
        close(currentMessageId)
      }

      const options = deepMerge(
        defaultOptions,
        typeof option === 'string' ? { title: option } : option,
      ) as MessageOptions

      // 根据类型自动设置取消按钮显示状态
      if (options.type === 'confirm' || options.type === 'prompt') {
        options.showCancelButton = true
      } else if (options.showCancelButton === undefined) {
        options.showCancelButton = false
      }

      // 生成唯一 ID
      const messageId = generateMessageId()

      // 合并配置
      const finalOptions = {
        ...options,
        visible: true,
        _messageId: messageId,
      }

      // 创建 Message 实例信息
      const messageInstance: MessageInstance = {
        id: messageId,
        selector,
        option: messageOption,
        resolve,
      }

      // 添加到活跃实例队列
      activeMessageInstances.set(messageId, messageInstance)

      // 更新 messageOption
      messageOption.value = finalOptions
    })
  }

  /**
   * 创建特定类型的 Message 方法
   * @param messageOptions 预设配置
   * @returns Message 方法
   */
  const createMethod = (messageOptions: MessageOptions) => {
    return (options: MessageOptions | string) => {
      return show(
        deepMerge(
          messageOptions,
          typeof options === 'string' ? { title: options } : options,
        ) as MessageOptions,
      )
    }
  }

  /**
   * 显示警告 Message
   */
  const alert = createMethod({
    type: 'alert',
  })

  /**
   * 显示确认 Message
   */
  const confirm = createMethod({
    type: 'confirm',
  })

  /**
   * 显示输入 Message
   */
  const prompt = createMethod({
    type: 'prompt',
  })

  return {
    show,
    alert,
    confirm,
    prompt,
    close: () => close(),
  }
}

/**
 * 创建内部使用的 useMessage 实例
 * 用于 Vue 组件内部，提供 handleConfirm 和 handleCancel 方法
 * @param selector 选择器
 * @returns 包含内部方法的实例
 */
export const useMessageInternal = (selector: string = '') => {
  const messageOption = getMessageOption(selector)

  const closeMessage = (messageId: string) => {
    const instance = activeMessageInstances.get(messageId)
    if (instance) {
      instance.option.value = { ...instance.option.value, visible: false }
      activeMessageInstances.delete(messageId)
    }
  }

  const handleConfirm = (result: MessageResult) => {
    const currentMessageId = messageOption.value._messageId
    if (currentMessageId) {
      const instance = activeMessageInstances.get(currentMessageId)
      if (instance && instance.resolve) {
        instance.resolve(result)
      }
      closeMessage(currentMessageId)
    }
  }

  const handleCancel = (result: MessageResult) => {
    const currentMessageId = messageOption.value._messageId
    if (currentMessageId) {
      const instance = activeMessageInstances.get(currentMessageId)
      if (instance && instance.resolve) {
        // 取消操作也通过 resolve 返回结果
        instance.resolve(result)
      }
      closeMessage(currentMessageId)
    }
  }

  return {
    handleConfirm,
    handleCancel,
  }
}
