<!-- MessageBox 弹框 弹出对话框，常用于消息提示、消息确认等，支持函数调用。 -->
<template>
  <wd-popup
    v-model="isVisible"
    :close-on-click-modal="closeOnClickModal"
    :lazy-render="lazyRender"
    :z-index="zIndex"
    :duration="200"
    transition="zoom-in"
    custom-class="wd-message-box"
    @click-modal="handleClickModal"
  >
    <view :class="`wd-message-box__container ${customClass}`">
      <view
        :class="`wd-message-box__body ${!title ? 'is-no-title' : ''} ${type === 'prompt' ? 'is-prompt' : ''}`"
      >
        <view v-if="title" class="wd-message-box__title">
          {{ title }}
        </view>
        <view class="wd-message-box__content">
          <block v-if="type === 'prompt'">
            <wd-input
              v-model="inputValue"
              :type="inputType"
              :placeholder="inputPlaceholder"
              @input="handleInputChange"
            />
            <view
              v-if="showErr"
              class="wd-message-box__input-error"
              :class="{ 'is-hidden': !showErr }"
            >
              {{ inputError || '输入内容不符合要求' }}
            </view>
          </block>
          <slot>{{ msg }}</slot>
        </view>
      </view>
      <view
        :class="`wd-message-box__actions ${showCancelButton ? 'wd-message-box__flex' : 'wd-message-box__block'}`"
      >
        <wd-button
          v-if="showCancelButton"
          v-bind="computedCancelProps"
          @click="handleAction('cancel')"
        >
          {{ cancelButtonText || '取消' }}
        </wd-button>
        <wd-button v-bind="computedConfirmProps" @click="handleAction('confirm')">
          {{ confirmButtonText || '确定' }}
        </wd-button>
      </view>
    </view>
  </wd-popup>
</template>

<script lang="ts" setup>
import type { InputType } from '../wd-input/wd-input.vue'
import type { MessageOptions, MessageResult } from './useMessage'
import { computed, ref, watch } from 'vue'
import { deepAssign, isDef, isFunction, isUndefined, omitBy } from '../common/util'
import wdButton from '../wd-button/wd-button.vue'
import wdInput from '../wd-input/wd-input.vue'
import wdPopup from '../wd-popup/wd-popup.vue'
import { getMessageOption, useMessageInternal } from './useMessage'

defineOptions({
  name: 'WdMessageBox',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 消息框类型
 */
type MessageType = 'alert' | 'confirm' | 'prompt'

/**
 * MessageBox 组件属性接口
 */
interface WdMessageBoxProps {
  /** 自定义根节点样式类 */
  customClass?: string
  /** 选择器 */
  selector?: string
  /** 标题 */
  title?: string
  /** 是否展示取消按钮 */
  showCancelButton?: boolean
  /** 是否支持点击蒙层进行关闭 */
  closeOnClickModal?: boolean
  /** 确定按钮文案 */
  confirmButtonText?: string
  /** 取消按钮文案 */
  cancelButtonText?: string
  /** 消息文案 */
  msg?: string
  /** 弹框类型 */
  type?: MessageType
  /** 输入框类型 */
  inputType?: InputType
  /** 输入框初始值 */
  inputValue?: string | number
  /** 输入框placeholder */
  inputPlaceholder?: string
  /** 输入框正则校验 */
  inputPattern?: RegExp
  /** 输入框校验函数 */
  inputValidate?: (inputValue: string | number) => boolean
  /** 输入框检验不通过时的错误提示文案 */
  inputError?: string
  /** 是否展示错误信息 */
  showErr?: boolean
  /** 弹窗层级 */
  zIndex?: number
  /** 弹层内容懒渲染 */
  lazyRender?: boolean
  /** 确认前钩子 */
  beforeConfirm?: (options: { resolve: (isPass: boolean) => void }) => void
  /** 取消按钮Props */
  cancelButtonProps?: any
  /** 确认按钮Props */
  confirmButtonProps?: any
  /** 是否显示 */
  visible?: boolean
}

// 组件属性定义
const props = withDefaults(defineProps<WdMessageBoxProps>(), {
  customClass: '',
  selector: '',
  title: '',
  showCancelButton: false,
  closeOnClickModal: true,
  confirmButtonText: '',
  cancelButtonText: '',
  msg: '',
  type: 'alert',
  inputType: 'text',
  inputValue: '',
  inputPlaceholder: '',
  inputError: '',
  showErr: false,
  zIndex: 1000,
  lazyRender: true,
  visible: false,
})

// 🔥 获取消息框选项的响应式引用，确保同一个 selector 对应唯一实例
const messageOption = getMessageOption(props.selector)
// 🔥 获取内部方法，用于处理确认和取消操作
const { handleConfirm, handleCancel } = useMessageInternal(props.selector)

// ================================
// 响应式状态定义（按功能分组）
// ================================

// 基本信息
const title = ref<string>('') // 弹窗标题
const msg = ref<string>('') // 消息内容
const type = ref<MessageType>('alert') // 弹窗类型：alert/confirm/prompt

// 显示控制
const isVisible = ref<boolean>(false) // 是否显示弹窗
const zIndex = ref<number>(1000) // 弹窗层级
const lazyRender = ref<boolean>(true) // 是否懒渲染

// 按钮配置
const showCancelButton = ref<boolean>(false) // 是否显示取消按钮
const confirmButtonText = ref<string>('') // 确认按钮文本
const cancelButtonText = ref<string>('') // 取消按钮文本
const confirmButtonProps = ref<any>({}) // 确认按钮属性
const cancelButtonProps = ref<any>({}) // 取消按钮属性

// 输入相关（prompt 类型使用）
const inputType = ref<InputType>('text') // 输入框类型
const inputValue = ref<string | number>('') // 输入框值
const inputPlaceholder = ref<string>('') // 输入框占位符
const inputError = ref<string>('') // 输入错误提示
const showErr = ref<boolean>(false) // 是否显示错误提示
const inputPattern = ref<RegExp | undefined>(undefined) // 输入验证正则
const inputValidate = ref<((inputValue: string | number) => boolean) | undefined>(undefined) // 输入验证函数

// 行为配置
const closeOnClickModal = ref<boolean>(true) // 是否允许点击蒙层关闭
const beforeConfirm = ref<((options: { resolve: (isPass: boolean) => void }) => void) | undefined>(
  undefined,
) // 确认前钩子

/**
 * 计算确认按钮属性
 * 合并默认属性和用户自定义属性，并添加统一的样式类
 */
const computedConfirmProps = computed(() => {
  const buttonProps = deepAssign(
    { block: true },
    isDef(confirmButtonProps.value) ? omitBy(confirmButtonProps.value, isUndefined) : {},
  )
  buttonProps.customClass = `${buttonProps.customClass || ''} wd-message-box__actions-btn`
  return buttonProps
})

/**
 * 计算取消按钮属性
 * 合并默认属性和用户自定义属性，并添加统一的样式类
 */
const computedCancelProps = computed(() => {
  const buttonProps = deepAssign(
    { block: true, type: 'info' },
    isDef(cancelButtonProps.value) ? omitBy(cancelButtonProps.value, isUndefined) : {},
  )
  buttonProps.customClass = `${buttonProps.customClass || ''} wd-message-box__actions-btn`
  return buttonProps
})

// ================================
// 内部方法
// ================================
/**
 * 合并选项与属性
 * 将 messageOption 的值同步到组件的内部状态
 * 优先级：option > props > 默认值
 * @param option 消息框选项
 * @param props 组件属性
 */
const mergeOptionsWithProps = (option: MessageOptions, props: WdMessageBoxProps) => {
  title.value = isDef(option.title) ? option.title! : props.title!
  showCancelButton.value = isDef(option.showCancelButton)
    ? option.showCancelButton!
    : props.showCancelButton!
  closeOnClickModal.value = isDef(option.closeOnClickModal)
    ? option.closeOnClickModal!
    : props.closeOnClickModal!
  confirmButtonText.value = isDef(option.confirmButtonText)
    ? option.confirmButtonText!
    : props.confirmButtonText!
  cancelButtonText.value = isDef(option.cancelButtonText)
    ? option.cancelButtonText!
    : props.cancelButtonText!
  msg.value = isDef(option.msg) ? option.msg! : props.msg!
  type.value = isDef(option.type) ? option.type! : props.type!
  inputType.value = isDef(option.inputType) ? option.inputType! : props.inputType!
  inputValue.value = isDef(option.inputValue) ? option.inputValue! : props.inputValue!
  inputPlaceholder.value = isDef(option.inputPlaceholder)
    ? option.inputPlaceholder!
    : props.inputPlaceholder!
  inputPattern.value = isDef(option.inputPattern) ? option.inputPattern! : props.inputPattern!
  inputValidate.value = isDef(option.inputValidate) ? option.inputValidate! : props.inputValidate!
  inputError.value = isDef(option.inputError) ? option.inputError! : props.inputError!
  showErr.value = isDef(option.showErr) ? option.showErr! : props.showErr!
  zIndex.value = isDef(option.zIndex) ? option.zIndex! : props.zIndex!
  lazyRender.value = isDef(option.lazyRender) ? option.lazyRender! : props.lazyRender!
  beforeConfirm.value = isDef(option.beforeConfirm) ? option.beforeConfirm! : props.beforeConfirm!
  cancelButtonProps.value = isDef(option.cancelButtonProps)
    ? option.cancelButtonProps!
    : props.cancelButtonProps || {}
  confirmButtonProps.value = isDef(option.confirmButtonProps)
    ? option.confirmButtonProps!
    : props.confirmButtonProps || {}

  // 🔥 visible 状态主要由 messageOption 控制，props.visible 作为初始值
  // 这样设计是因为显示状态主要通过 useMessage API 来控制
  // props.visible 主要用于组件的初始显示状态
  if (!isDef(option.visible) && isDef(props.visible)) {
    isVisible.value = props.visible!
  }
}

/**
 * 重置消息框选项值
 * 当 messageOption 发生变化时，更新组件的内部状态
 * @param option 新的消息框选项
 */
const reset = (option: MessageOptions) => {
  isVisible.value = isDef(option.visible) ? option.visible : false

  if (isVisible.value) {
    mergeOptionsWithProps(option, props)
  }
}

/**
 * 监听 messageOption 变化展示
 * 当通过 useMessage 调用方法时，messageOption 会发生变化
 * 这个监听器会将变化同步到组件的内部状态
 */
watch(
  () => messageOption.value,
  (newVal: MessageOptions) => {
    reset(newVal)
  },
  {
    deep: true,
    immediate: true,
  },
)

/**
 * 监听显示状态变化，重置错误状态
 * 当弹窗关闭时，清除输入验证错误状态
 */
watch(
  () => isVisible.value,
  (newValue) => {
    if (!newValue) {
      showErr.value = false
    }
  },
  {
    immediate: true,
  },
)

/**
 * 处理输入框内容变化
 * 当输入框内容为空时，清除错误状态
 * @param value 输入框的新值
 */
const handleInputChange = ({ value }: { value: string | number }) => {
  if (value === '') {
    showErr.value = false
    return
  }
  inputValue.value = value
}

/**
 * 验证输入内容
 * 用于 prompt 类型的消息框验证用户输入
 * @returns 验证是否通过
 */
const validate = (): boolean => {
  // 正则表达式验证
  if (inputPattern.value && !inputPattern.value.test(String(inputValue.value))) {
    showErr.value = true
    return false
  }

  // 自定义验证函数
  if (inputValidate.value && isFunction(inputValidate.value)) {
    const validateResult = inputValidate.value(inputValue.value)
    if (!validateResult) {
      showErr.value = true
      return false
    }
  }

  // 验证通过
  showErr.value = false
  return true
}

/**
 * 处理用户操作（确认、取消、点击蒙层）
 * 这是所有用户交互的统一入口
 * @param action 用户操作类型
 */
const handleAction = (action: 'confirm' | 'cancel' | 'modal') => {
  // 如果是点击蒙层，但不允许点击蒙层关闭，则直接返回
  if (action === 'modal' && !closeOnClickModal.value) {
    return
  }

  // 如果是 prompt 类型的确认操作，需要先验证输入
  if (type.value === 'prompt' && action === 'confirm' && !validate()) {
    return
  }

  // 构造操作结果
  const result: MessageResult = {
    action: action as any,
    value: inputValue.value,
  }

  // 根据不同操作类型进行处理
  switch (action) {
    case 'confirm':
      // 如果有确认前钩子，先执行钩子
      if (beforeConfirm.value && isFunction(beforeConfirm.value)) {
        beforeConfirm.value({
          resolve: (isPass) => {
            if (isPass) {
              // 钩子验证通过，执行确认操作
              handleConfirm(result)
            }
          },
        })
      } else {
        // 没有钩子，直接执行确认操作
        handleConfirm(result)
      }
      break
    case 'cancel':
      // 执行取消操作
      handleCancel(result)
      break
    default:
      // 点击蒙层等其他操作都视为取消
      handleCancel({ action: 'modal' })
      break
  }
}

/**
 * 处理点击蒙层事件
 * 触发模态框关闭操作
 */
const handleClickModal = () => {
  handleAction('modal')
}
</script>

<style lang="scss">
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

.wot-theme-dark {
  @include b(message-box) {
    @include e(body) {
      background-color: $-dark-background2;
    }

    @include e(title) {
      color: $-dark-color;
    }

    @include e(content) {
      color: $-dark-color3;

      &::-webkit-scrollbar-thumb {
        background: $-dark-border-color;
      }
    }
  }
}

:deep(.wd-message-box) {
  border-radius: $-message-box-radius;
  overflow: hidden;
}

@include b(message-box) {
  border-radius: $-message-box-radius;
  overflow: hidden;

  @include e(container) {
    width: $-message-box-width;
    box-sizing: border-box;
  }

  @include e(body) {
    background-color: $-message-box-bg;
    padding: $-message-box-padding;

    @include when(no-title) {
      padding: 50rpx 48rpx 0rpx;
    }
  }

  @include e(title) {
    text-align: center;
    font-size: $-message-box-title-fs;
    color: $-message-box-title-color;
    line-height: 40rpx;
    font-weight: 500;
    padding-top: 10rpx;
    padding-bottom: 20rpx;
  }

  @include e(content) {
    max-height: $-message-box-content-max-height;
    color: $-message-box-content-color;
    font-size: $-message-box-content-fs;
    text-align: center;
    overflow: auto;
    line-height: 40rpx;

    &::-webkit-scrollbar {
      width: $-message-box-content-scrollbar-width;
    }

    &::-webkit-scrollbar-thumb {
      width: $-message-box-content-scrollbar-width;
      background: $-message-box-content-scrollbar-color;
      border-radius: calc($-message-box-content-scrollbar-width / 2);
    }
  }

  @include e(input-error) {
    min-height: 36rpx;
    margin-top: 4rpx;
    color: $-message-box-input-error-color;
    text-align: left;

    @include when(hidden) {
      visibility: hidden;
    }
  }

  @include e(actions) {
    padding: 48rpx;
  }

  @include edeep(actions-btn) {
    &:not(:last-child) {
      margin-right: 32rpx;
    }
  }

  @include e(flex) {
    display: flex;
  }

  @include e(block) {
    display: block;
  }

  @include e(cancel) {
    margin-right: 32rpx;
  }
}
</style>
