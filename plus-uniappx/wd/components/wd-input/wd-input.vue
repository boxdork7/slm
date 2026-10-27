<!-- Input 输入框 用户可以在文本框里输入内容。 -->
<template>
  <view :class="rootClass" :style="customStyle" @click="handleClick">
    <view
      v-if="label || $slots.label"
      :class="`wd-input__label ${isRequired ? 'is-required' : ''}`"
      :style="
        computedLabelWidth ? `min-width: ${addUnit(computedLabelWidth)}; max-width: ${addUnit(computedLabelWidth)};` : ''
      "
    >
      <view v-if="prefixIcon || $slots.prefix" class="wd-input__prefix">
        <wd-icon
          v-if="prefixIcon && !$slots.prefix"
          custom-class="wd-input__icon"
          :name="prefixIcon"
          @click="onClickPrefixIcon"
        />
        <slot v-else name="prefix" />
      </view>
      <view class="wd-input__label-inner" :class="customLabelClass">
        <template v-if="label && !$slots.label">
          {{ label }}
        </template>
        <slot v-else name="label" />
      </view>
    </view>
    <view class="wd-input__body">
      <view class="wd-input__input-wrapper" :class="customInputClass" :style="customInputStyle">
        <view class="wd-input__value">
          <view v-if="(prefixIcon || $slots.prefix) && !label" class="wd-input__prefix">
            <wd-icon
              v-if="prefixIcon && !$slots.prefix"
              custom-class="wd-input__icon"
              :name="prefixIcon"
              @click="onClickPrefixIcon"
            />
            <slot v-else name="prefix" />
          </view>
          <input
            v-model="inputValue"
            class="wd-input__inner"
            :class="[
              prefixIcon ? 'wd-input__inner--prefix' : '',
              showWordCount ? 'wd-input__inner--count' : '',
              alignRight ? 'is-align-right' : '',
              customInnerClass,
            ]"
            :type="type"
            :password="showPassword && !isPwdVisible"
            :placeholder="placeholderValue"
            :disabled="disabled || readonly"
            :maxlength="maxlength"
            :focus="focused"
            :confirm-type="confirmType"
            :confirm-hold="confirmHold"
            :cursor="cursor"
            :cursor-spacing="cursorSpacing"
            :placeholder-style="placeholderStyle"
            :selection-start="selectionStart"
            :selection-end="selectionEnd"
            :adjust-position="adjustPosition"
            :hold-keyboard="holdKeyboard"
            :always-embed="alwaysEmbed"
            :placeholder-class="`wd-input__placeholder ${placeholderClass}`"
            :ignoreCompositionEvent="ignoreCompositionEvent"
            :inputmode="inputmode"
            :enable-native="enableNative"
            @input="handleInput"
            @focus="handleFocus"
            @blur="handleBlur"
            @confirm="handleConfirm"
            @keyboardheightchange="handleKeyboardheightchange"
          />
          <view v-if="readonly" class="wd-input__readonly-mask" />
          <view
            v-if="showClear || showPassword || suffixIcon || showWordCount || $slots.suffix"
            class="wd-input__suffix"
          >
            <wd-icon
              v-if="showClear"
              custom-class="wd-input__clear"
              name="close-fill"
              @click="handleClear"
            />
            <wd-icon
              v-if="showPassword"
              custom-class="wd-input__icon"
              :name="isPwdVisible ? 'visible' : 'hidden'"
              @click="togglePwdVisible"
            />
            <view v-if="showWordCount" class="wd-input__count">
              <text
                :class="[
                  inputValue && String(inputValue).length > 0 ? 'wd-input__count-current' : '',
                  String(inputValue).length > maxlength! ? 'is-error' : '',
                ]"
              >
                {{ String(inputValue).length }}
              </text>
              /{{ maxlength }}
            </view>
            <wd-icon
              v-if="suffixIcon && !$slots.suffix"
              custom-class="wd-input__icon"
              :name="suffixIcon"
              @click="onClickSuffixIcon"
            />
            <slot v-else name="suffix" />
          </view>
        </view>
      </view>
      <view
        v-if="errorMessage"
        class="wd-input__error-message"
        :style="{ marginLeft: addUnit(errorMessageOffset) }"
      >
        {{ errorMessage }}
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { Slots } from 'vue'
import type { FormItemRule } from '../wd-form/wd-form.vue'
import { computed, ref, useSlots, watch } from 'vue'
import { addUnit, isDef, isEqual, pause } from '../common/util'
import { useCell } from '../composables/useCell'
import { useParent } from '../composables/useParent'
import { useTranslate } from '../composables/useTranslate'
import { FORM_KEY } from '../wd-form/wd-form-key'
import wdIcon from '../wd-icon/wd-icon.vue'

defineOptions({
  name: 'WdInput',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 输入框清除触发时机
 */
type InputClearTrigger = 'focus' | 'always'

/**
 * 输入框类型
 */
export type InputType =
  | 'text'
  | 'number'
  | 'digit'
  | 'idcard'
  | 'safe-password'
  | 'password'
  | 'nickname'
  | 'tel'

/**
 * 输入框确认类型
 */
type InputConfirmType = 'send' | 'search' | 'next' | 'go' | 'done'

/**
 * 输入框尺寸
 */
export type InputSize = 'large'

/**
 * 输入框模式
 */
type InputMode = 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url'

/**
 * 输入框组件属性接口
 */
interface WdInputProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string
  /** 自定义输入框包装器样式类 */
  customInputClass?: string
  /** 自定义输入框包装器样式 */
  customInputStyle?: string
  /** 自定义输入框内部样式类 */
  customInnerClass?: string
  /** 自定义标签样式类 */
  customLabelClass?: string

  // 原生属性
  /** 占位文本 */
  placeholder?: string
  /** 指定 placeholder 的样式，目前仅支持color,font-size和font-weight */
  placeholderStyle?: string
  /** 指定 placeholder 的样式类 */
  placeholderClass?: string
  /** 指定光标与键盘的距离 */
  cursorSpacing?: number
  /** 指定focus时的光标位置 */
  cursor?: number
  /** 光标起始位置，自动聚集时有效，需与selection-end搭配使用 */
  selectionStart?: number
  /** 光标结束位置，自动聚集时有效，需与selection-start搭配使用 */
  selectionEnd?: number
  /** 键盘弹起时，是否自动上推页面 */
  adjustPosition?: boolean
  /** focus时，点击页面的时候不收起键盘 */
  holdKeyboard?: boolean
  /** 设置键盘右下角按钮的文字，仅在type='text'时生效 */
  confirmType?: InputConfirmType
  /** 点击键盘右下角按钮时是否保持键盘不收起 */
  confirmHold?: boolean
  /** 获取焦点 */
  focus?: boolean
  /** 输入框类型 */
  type?: InputType
  /** 最大长度 */
  maxlength?: number
  /** 是否禁用 */
  disabled?: boolean
  /** 强制 input 处于同层状态 */
  alwaysEmbed?: boolean

  // 扩展属性
  /** 输入框的值靠右展示 */
  alignRight?: boolean
  /** 绑定值 */
  modelValue?: string | number
  /** 显示为密码框 */
  showPassword?: boolean
  /** 显示清空按钮 */
  clearable?: boolean
  /** 只读 */
  readonly?: boolean
  /** 前置图标 */
  prefixIcon?: string
  /** 后置图标 */
  suffixIcon?: string
  /** 显示字数限制，需要同时设置 maxlength */
  showWordLimit?: boolean
  /** 设置左侧标题 */
  label?: string
  /** 设置左侧标题宽度 */
  labelWidth?: string | number
  /** 设置输入框大小 */
  size?: InputSize
  /** 设置输入框错误状态 */
  error?: boolean
  /** 当有label属性时，设置标题和输入框垂直居中 */
  center?: boolean
  /** 非 cell 类型下是否隐藏下划线 */
  noBorder?: boolean
  /** 是否必填 */
  required?: boolean
  /** 表单域 model 字段名 */
  prop?: string
  /** 表单验证规则 */
  rules?: FormItemRule[]
  /** 显示清除图标的时机 */
  clearTrigger?: InputClearTrigger
  /** 是否在点击清除按钮时聚焦输入框 */
  focusWhenClear?: boolean
  /** 是否忽略组件内对文本合成系统事件的处理 */
  ignoreCompositionEvent?: boolean
  /** 输入模式 */
  inputmode?: InputMode
  /** 错误信息的左边距偏移 */
  errorMessageOffset?: string | number
  /** 是否使用原生键盘（支付宝小程序） */
  enableNative?: boolean
}

/**
 * 输入框组件事件接口
 */
interface WdInputEmits {
  /** 更新绑定值 */
  'update:modelValue': [value: string | number]
  /** 清空输入框 */
  clear: []
  /** 失去焦点 */
  blur: [detail: { value: string | number }]
  /** 获得焦点 */
  focus: [detail: any]
  /** 输入内容 */
  input: [detail: any]
  /** 键盘高度变化 */
  keyboardheightchange: [detail: any]
  /** 确认输入 */
  confirm: [detail: any]
  /** 点击后置图标 */
  clicksuffixicon: []
  /** 点击前置图标 */
  clickprefixicon: []
  /** 点击输入框 */
  click: [event: MouseEvent]
}

/**
 * 输入框组件插槽接口
 */
interface WdInputSlots extends Slots {
  /** 前置插槽 */
  prefix?: () => any
  /** 后置插槽 */
  suffix?: () => any
  /** 标签插槽 */
  label?: () => any
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdInputProps>(), {
  customStyle: '',
  customClass: '',
  customInputClass: '',
  customInputStyle: '',
  customInnerClass: '',
  customLabelClass: '',
  placeholderClass: '',
  cursorSpacing: 0,
  cursor: -1,
  selectionStart: -1,
  selectionEnd: -1,
  adjustPosition: true,
  holdKeyboard: false,
  confirmType: 'done',
  confirmHold: false,
  focus: false,
  type: 'text',
  maxlength: -1,
  disabled: false,
  alwaysEmbed: false,
  alignRight: false,
  modelValue: '',
  showPassword: false,
  clearable: false,
  readonly: false,
  showWordLimit: false,
  labelWidth: undefined,
  error: false,
  center: false,
  noBorder: false,
  required: false,
  rules: () => [],
  clearTrigger: 'always',
  focusWhenClear: true,
  ignoreCompositionEvent: true,
  inputmode: 'text',
  errorMessageOffset: '0',
  enableNative: true,
})

// 定义组件事件
const emit = defineEmits<WdInputEmits>()

// 定义组件插槽
const slots = useSlots() as WdInputSlots

// 使用翻译函数
const { translate } = useTranslate('input')

/**
 * 格式化值
 */
const formatValue = (value: string | number) => {
  const { maxlength } = props
  if (isDef(maxlength) && maxlength !== -1 && String(value).length > maxlength) {
    return value.toString().slice(0, maxlength)
  }
  return value
}

/**
 * 判断值是否相等
 */
const isValueEqual = (value1: number | string, value2: number | string) => {
  return isEqual(String(value1), String(value2))
}

/**
 * 获取初始值
 */
const getInitValue = () => {
  const formatted = formatValue(props.modelValue)
  if (!isValueEqual(formatted, props.modelValue)) {
    emit('update:modelValue', formatted)
  }
  return formatted
}

// 响应式数据
const isPwdVisible = ref<boolean>(false)
const clearing = ref<boolean>(false)
const focused = ref<boolean>(false)
const focusing = ref<boolean>(false)
const inputValue = ref<string | number>(getInitValue())

// 使用 cell 组合函数
const cell = useCell()

// 使用表单组合函数
const { parent: form } = useParent(FORM_KEY)

/**
 * 计算最终的标签宽度
 * 优先级：组件自身 labelWidth > form labelWidth > 默认值 undefined
 */
const computedLabelWidth = computed(() => {
  // 1. 组件自身明确指定
  if (props.labelWidth !== undefined && props.labelWidth !== '') {
    return props.labelWidth
  }

  // 2. 继承 form 配置
  if (form && form.props.labelWidth !== undefined && form.props.labelWidth !== '') {
    return form.props.labelWidth
  }

  // 3. 默认值 undefined
  return undefined
})

/**
 * 监听 focus 属性变化
 */
watch(
  () => props.focus,
  (newValue) => {
    focused.value = newValue
  },
  { immediate: true, deep: true },
)

/**
 * 监听 modelValue 属性变化
 */
watch(
  () => props.modelValue,
  (newValue) => {
    inputValue.value = isDef(newValue) ? String(newValue) : ''
  },
)

/**
 * 监听输入值变化，处理字段级别的错误清除
 */
watch(
  () => inputValue.value,
  (newValue, oldValue) => {
    // 只有在值真正发生变化时才清除当前字段的错误信息
    if (
      newValue !== oldValue &&
      form &&
      form.props.resetOnChange &&
      props.prop &&
      form.clearFieldMessage
    ) {
      form.clearFieldMessage(props.prop)
    }
  },
)

/**
 * 计算占位符文本
 */
const placeholderValue = computed(() => {
  return isDef(props.placeholder)
    ? props.placeholder
    : translate('placeholder') + (isDef(props.label) ? ` ${props.label}` : '')
})

/**
 * 计算是否显示清空按钮
 */
const showClear = computed(() => {
  const { disabled, readonly, clearable, clearTrigger } = props
  if (
    clearable &&
    !readonly &&
    !disabled &&
    inputValue.value &&
    (clearTrigger === 'always' || (clearTrigger === 'focus' && focusing.value))
  ) {
    return true
  }
  return false
})

/**
 * 计算是否显示字数统计
 */
const showWordCount = computed(() => {
  const { disabled, readonly, maxlength, showWordLimit } = props
  return Boolean(!disabled && !readonly && isDef(maxlength) && maxlength > -1 && showWordLimit)
})

/**
 * 计算表单错误信息
 */
const errorMessage = computed(() => {
  if (form && props.prop && form.errorMessages && form.errorMessages[props.prop]) {
    return form.errorMessages[props.prop]
  }
  return ''
})

/**
 * 计算是否必填
 */
const isRequired = computed(() => {
  let formRequired = false
  if (form && form.props.rules) {
    const rules = form.props.rules
    for (const key in rules) {
      if (
        Object.prototype.hasOwnProperty.call(rules, key) &&
        key === props.prop &&
        Array.isArray(rules[key])
      ) {
        formRequired = rules[key].some((rule: FormItemRule) => rule.required)
      }
    }
  }
  return props.required || props.rules.some((rule) => rule.required) || formRequired
})

/**
 * 计算根元素类名
 */
const rootClass = computed(() => {
  const classes = ['wd-input']

  if (props.label || slots.label) classes.push('is-cell')
  if (props.center) classes.push('is-center')
  if (cell.border.value) classes.push('is-border')
  if (props.size) classes.push(`is-${props.size}`)
  if (props.error) classes.push('is-error')
  if (props.disabled) classes.push('is-disabled')
  if (inputValue.value && String(inputValue.value).length > 0) classes.push('is-not-empty')
  if (props.noBorder) classes.push('is-no-border')
  if (props.customClass) classes.push(props.customClass)

  return classes.join(' ')
})

/**
 * 切换密码可见性
 */
const togglePwdVisible = () => {
  isPwdVisible.value = !isPwdVisible.value
}

/**
 * 处理清空操作
 */
const handleClear = async () => {
  focusing.value = false
  inputValue.value = ''
  if (props.focusWhenClear) {
    clearing.value = true
    focused.value = false
  }
  await pause()
  if (props.focusWhenClear) {
    focused.value = true
    focusing.value = true
  }
  emit('update:modelValue', inputValue.value)
  emit('clear')
}

/**
 * 处理失去焦点事件
 */
const handleBlur = async () => {
  // 等待150毫秒，clear执行完毕
  await pause(150)
  if (clearing.value) {
    clearing.value = false
    return
  }
  focusing.value = false
  emit('blur', {
    value: inputValue.value,
  })
}

/**
 * 处理获得焦点事件
 */
const handleFocus = ({ detail }: any) => {
  focusing.value = true
  emit('focus', detail)
}

/**
 * 处理输入事件
 */
const handleInput = ({ detail }: any) => {
  emit('update:modelValue', inputValue.value)
  emit('input', detail)
}

/**
 * 处理键盘高度变化事件
 */
const handleKeyboardheightchange = ({ detail }: any) => {
  emit('keyboardheightchange', detail)
}

/**
 * 处理确认输入事件
 */
const handleConfirm = ({ detail }: any) => {
  emit('confirm', detail)
}

/**
 * 处理点击后置图标事件
 */
const onClickSuffixIcon = () => {
  emit('clicksuffixicon')
}

/**
 * 处理点击前置图标事件
 */
const onClickPrefixIcon = () => {
  emit('clickprefixicon')
}

/**
 * 处理点击事件
 */
const handleClick = (event: MouseEvent) => {
  emit('click', event)
}
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 暗色主题样式
.wot-theme-dark {
  @include b(input) {
    background: $-dark-background2;

    &::after {
      background: $-dark-color-gray;
    }

    @include when(not-empty) {
      &:not(.is-disabled) {
        &::after {
          background-color: $-dark-color;
        }
      }
    }

    @include e(inner) {
      color: $-dark-color;

      &::-webkit-input-placeholder {
        color: $-dark-color3;
      }
    }

    @include e(count) {
      color: $-dark-color3;
      background: transparent;
    }

    @include e(count-current) {
      color: $-dark-color;
    }

    :deep(.wd-input__icon),
    :deep(.wd-input__clear) {
      color: $-dark-color;
      background: transparent;
    }

    @include when(cell) {
      background-color: $-dark-background2;
      line-height: $-cell-line-height;

      @include when(border) {
        @include halfPixelBorder('top', $-input-cell-padding, $-dark-border-color);
      }
    }

    @include when(disabled) {
      .wd-input__inner {
        color: $-dark-color-gray;
        background: transparent;
      }
    }

    @include e(label) {
      color: $-dark-color;
    }

    @include e(placeholder) {
      color: $-dark-color3;
    }
  }
}

// 输入框组件样式
@include b(input) {
  position: relative;
  -webkit-tap-highlight-color: transparent;
  text-align: left;
  background: $-input-bg;

  &::after {
    position: absolute;
    content: '';
    bottom: 0;
    left: 0;
    right: 0;
    height: 1rpx;
    background: $-input-border-color;
    transform: scaleY(0.5);
    transition: background-color 0.2s ease-in-out;
  }

  @include when(not-empty) {
    &:not(.is-disabled) {
      &::after {
        background-color: $-input-not-empty-border-color;
      }
    }
  }

  @include e(label) {
    position: relative;
    display: flex;
    width: $-input-cell-label-width;
    color: $-cell-title-color;
    margin-right: $-cell-padding;
    box-sizing: border-box;
    font-size: $-input-fs;
    flex-shrink: 0;

    @include when(required) {
      padding-left: 24rpx;

      &::after {
        position: absolute;
        left: 0;
        top: 4px;
        content: '*';
        font-size: $-cell-required-size;
        line-height: 1.1;
        color: $-cell-required-color;
      }
    }
  }

  @include e(label-inner) {
    display: inline-block;
    font-size: $-input-fs;
    line-height: $-cell-line-height;
  }

  // 输入框包装器样式
  @include e(input-wrapper) {
    position: relative;
  }

  @include e(body) {
    flex: 1;
    position: relative;
  }

  @include e(value) {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  @include e(prefix) {
    margin-right: $-input-icon-margin;
    font-size: $-input-fs;
    line-height: initial;

    :deep(.wd-input__icon),
    :deep(.wd-input__clear) {
      margin-left: 0;
    }
  }

  @include e(suffix) {
    flex-shrink: 0;
    line-height: initial;
    display: flex;
    justify-content: center;
  }

  @include e(error-message) {
    color: $-form-item-error-message-color;
    font-size: $-form-item-error-message-font-size;
    line-height: $-form-item-error-message-line-height;
    text-align: left;
    vertical-align: middle;
    position: absolute;
    z-index: 90;
  }

  @include e(placeholder) {
    color: $-input-placeholder-color;

    &.is-error {
      color: $-input-error-color;
    }
  }

  @include when(disabled) {
    .wd-input__inner {
      color: $-input-disabled-color;
      background: transparent;
    }
  }

  @include when(error) {
    .wd-input__inner {
      color: $-input-error-color;
      background: transparent;
    }
  }

  @include when(no-border) {
    &::after {
      display: none;
    }

    .wd-input__inner {
      height: $-input-inner-height-no-border;
      padding-top: 0;
      padding-bottom: 0;
    }
  }

  @include when(cell) {
    display: flex;
    align-items: flex-start;
    padding: $-input-cell-padding $-input-padding;
    background-color: $-input-cell-bg;

    &.is-error::after {
      background: $-input-cell-border-color;
    }

    :deep(.wd-input__icon),
    :deep(.wd-input__clear) {
      display: inline-flex;
      align-items: center;
      height: $-input-cell-height;
      line-height: $-input-cell-height;
    }

    .wd-input__prefix {
      display: inline-block;
      margin-right: $-cell-icon-right;
    }

    .wd-input__inner {
      height: $-input-cell-height;
    }

    &.wd-input::after {
      display: none;
    }

    @include when(center) {
      align-items: center;
    }

    @include when(border) {
      @include halfPixelBorder('top', $-input-cell-padding);
    }
  }

  @include when(large) {
    padding: $-input-cell-padding-large;

    .wd-input__prefix {
      font-size: $-input-fs-large;
    }

    .wd-input__label-inner {
      font-size: $-input-fs-large;
    }

    .wd-input__inner {
      font-size: $-input-fs-large;
    }

    .wd-input__count {
      font-size: $-input-count-fs-large;
    }

    :deep(.wd-input__icon),
    :deep(.wd-input__clear) {
      font-size: $-input-icon-size-large;
    }
  }

  @include e(inner) {
    flex: 1;
    height: $-input-inner-height;
    font-size: $-input-fs;
    color: $-input-color;
    outline: none;
    border: none;
    background: none;
    padding: 0;
    box-sizing: border-box;

    &::-webkit-input-placeholder {
      color: $-input-placeholder-color;
    }

    @include when(align-right) {
      text-align: right;
    }
  }

  @include e(readonly-mask) {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
  }

  @include edeep(icon) {
    margin-left: $-input-icon-margin;
    font-size: $-input-icon-size;
    color: $-input-icon-color;
    vertical-align: middle;
    background: $-input-bg;
  }

  @include edeep(clear) {
    margin-left: $-input-icon-margin;
    font-size: $-input-icon-size;
    color: $-input-clear-color;
    vertical-align: middle;
    background: $-input-bg;
  }

  @include e(count) {
    margin-left: 30rpx;
    font-size: $-input-count-fs;
    color: $-input-count-color;
    vertical-align: middle;
    background: $-input-bg;
  }

  @include e(count-current) {
    color: $-input-count-current-color;

    @include when(error) {
      color: $-input-error-color;
    }
  }

  .wd-input__count,
  .wd-input__count-current {
    display: inline-flex;
  }
}
</style>
