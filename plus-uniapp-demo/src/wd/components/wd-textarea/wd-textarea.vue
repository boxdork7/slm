<!-- Textarea 文本域 用于输入多行文本信息。 -->
<template>
  <view
    :class="`wd-textarea ${label || $slots.label ? 'is-cell' : ''} ${center ? 'is-center' : ''} ${size ? `is-${size}` : ''} ${error ? 'is-error' : ''} ${disabled ? 'is-disabled' : ''} ${autoHeight && !rows ? 'is-auto-height' : ''} ${rows ? 'is-fixed-rows' : ''} ${maxRows && autoHeight && !rows ? 'is-max-rows' : ''} ${currentLength > 0 ? 'is-not-empty' : ''} ${customClass}`"
    :style="customStyle"
  >
    <view
      v-if="label || $slots.label"
      :class="`wd-textarea__label ${customLabelClass} ${isRequired ? 'is-required' : ''}`"
      :style="labelStyle"
    >
      <view v-if="prefixIcon || $slots.prefix" class="wd-textarea__prefix">
        <wd-icon
          v-if="prefixIcon && !$slots.prefix"
          custom-class="wd-textarea__icon"
          :name="prefixIcon"
          @click="onClickPrefixIcon"
        />
        <slot v-else name="prefix" />
      </view>
      <view class="wd-textarea__label-inner">
        <text v-if="label && !$slots.label">
          {{ label }}
        </text>
        <slot v-else name="label" />
      </view>
    </view>

    <!-- 文本域 -->
    <view
      :class="`wd-textarea__value ${showClear ? 'is-suffix' : ''} ${customTextareaContainerClass} ${showWordCount ? 'is-show-limit' : ''}`"
    >
      <textarea
        v-model="inputValue"
        :class="`wd-textarea__inner ${customTextareaClass}`"
        :style="rowsStyle || maxRowsStyle"
        :show-count="false"
        :placeholder="placeholderValue"
        :disabled="disabled || readonly"
        :maxlength="maxlength"
        :focus="focused"
        :auto-focus="autoFocus"
        :placeholder-style="computedPlaceholderStyle"
        :placeholder-class="inputPlaceholderClass"
        :auto-height="autoHeight && !rows"
        :cursor-spacing="cursorSpacing"
        :fixed="fixed"
        :cursor="cursor"
        :show-confirm-bar="showConfirmBar"
        :selection-start="selectionStart"
        :selection-end="selectionEnd"
        :adjust-position="adjustPosition"
        :hold-keyboard="holdKeyboard"
        :confirm-type="confirmType"
        :confirm-hold="confirmHold"
        :disable-default-padding="disableDefaultPadding"
        :ignoreCompositionEvent="ignoreCompositionEvent"
        :inputmode="inputmode"
        :enable-native="enableNative"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @confirm="handleConfirm"
        @linechange="handleLineChange"
        @keyboardheightchange="handleKeyboardheightchange"
      />
      <view v-if="errorMessage" class="wd-textarea__error-message">
        {{ errorMessage }}
      </view>

      <view v-if="readonly" class="wd-textarea__readonly-mask" />
      <view class="wd-textarea__suffix">
        <wd-icon
          v-if="showClear"
          custom-class="wd-textarea__clear"
          name="close-outline-fill"
          @click="handleClear"
        />
        <view v-if="showWordCount" class="wd-textarea__count">
          <text
            :class="`${currentLength > 0 ? 'wd-textarea__count-current' : ''} ${currentLength > maxlength ? 'is-error' : ''}`"
          >
            {{ currentLength }}
          </text>
          /{{ maxlength }}
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { Slots } from 'vue'
import type { FormItemRule } from '../wd-form/wd-form.vue'
import { computed, onBeforeMount, ref, useSlots, watch } from 'vue'
import { isDef, objToStyle, pause } from '../common/util'
import { useCell } from '../composables/useCell'
import { useParent } from '../composables/useParent'
import { useTranslate } from '../composables/useTranslate'
import { FORM_KEY } from '../wd-form/wd-form-key'
import wdIcon from '../wd-icon/wd-icon.vue'

defineOptions({
  name: 'WdTextarea',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 确认按钮类型
 */
type ConfirmType = 'send' | 'search' | 'next' | 'go' | 'done'

/**
 * 输入模式类型
 */
type InputMode =
  | 'none'
  | 'text'
  | 'tel'
  | 'url'
  | 'email'
  | 'numeric'
  | 'decimal'
  | 'search'
  | 'password'

/**
 * 清除触发类型
 */
type InputClearTrigger = 'focus' | 'always'

/**
 * 文本域组件属性接口
 */
interface WdTextareaProps {
  /** 自定义根节点样式 - 设置组件外层容器的自定义样式 */
  customStyle?: string
  /** 自定义根节点样式类 - 设置组件外层容器的自定义CSS类名 */
  customClass?: string
  /** 自定义文本域容器class名称 - 设置文本域外层容器的CSS类名 */
  customTextareaContainerClass?: string
  /** 自定义文本域class名称 - 设置textarea元素的CSS类名 */
  customTextareaClass?: string
  /** 自定义标签class名称 - 设置左侧标签的CSS类名 */
  customLabelClass?: string

  // 原生属性
  /** 绑定值 - 文本域的输入内容，支持字符串或数字类型 */
  modelValue?: string | number
  /** 占位文本 - 文本域为空时显示的提示文字 */
  placeholder?: string
  /** 指定placeholder的样式 - 设置占位文本的内联样式 */
  placeholderStyle?: string
  /** 指定placeholder的样式类 - 设置占位文本的CSS类名 */
  placeholderClass?: string
  /** 禁用输入框 - 禁用后用户无法输入内容 */
  disabled?: boolean
  /** 最大输入长度 - 限制用户可输入的最大字符数，-1表示不限制 */
  maxlength?: number
  /** 自动聚焦并拉起键盘 - 页面加载完成后自动获得焦点 */
  autoFocus?: boolean
  /** 获取焦点 - 控制文本域是否获得焦点 */
  focus?: boolean
  /** 是否自动增高输入框高度 - 根据内容自动调整文本域高度 */
  autoHeight?: boolean
  /** 文本域显示行数 - 设置固定行数，超出内容可滚动查看 */
  rows?: number
  /** 自动高度时的最大行数 - 限制自动增高的最大高度，超出后显示滚动条 */
  maxRows?: number
  /** 如果textarea处于position:fixed区域，需要设置此属性为true */
  fixed?: boolean
  /** 指定光标与键盘的距离 - 调整软键盘弹起时光标的位置 */
  cursorSpacing?: number
  /** 指定focus时的光标位置 - 设置获得焦点时光标的初始位置 */
  cursor?: number
  /** 设置键盘右下角按钮的文字 - 可选值：send/search/next/go/done */
  confirmType?: ConfirmType
  /** 点击键盘右下角按钮时是否保持键盘不收起 */
  confirmHold?: boolean
  /** 是否显示键盘上方带有"完成"按钮那一栏 */
  showConfirmBar?: boolean
  /** 光标起始位置 - 自动聚集时有效，需与selectionEnd搭配使用 */
  selectionStart?: number
  /** 光标结束位置 - 自动聚集时有效，需与selectionStart搭配使用 */
  selectionEnd?: number
  /** 键盘弹起时是否自动上推页面 */
  adjustPosition?: boolean
  /** 是否去掉iOS下的默认内边距 */
  disableDefaultPadding?: boolean
  /** focus状态下点击页面时是否不收起键盘 */
  holdKeyboard?: boolean

  // 非原生属性
  /** 显示为密码框 - 输入内容将以圆点形式显示 */
  showPassword?: boolean
  /** 是否显示清空按钮 - 在输入内容时显示清除图标 */
  clearable?: boolean
  /** 输入框只读状态 - 只读模式下用户无法编辑内容 */
  readonly?: boolean
  /** 前置图标 - 显示在文本域前面的图标名称 */
  prefixIcon?: string
  /** 是否显示字数限制 - 显示当前字数/最大字数，需要同时设置maxlength */
  showWordLimit?: boolean
  /** 设置左侧标题 - 在文本域左侧显示的标签文字 */
  label?: string
  /** 设置左侧标题宽度 - 控制标签区域的宽度 */
  labelWidth?: string
  /** 设置输入框大小 - 可选值：large等 */
  size?: string
  /** 设置输入框错误状态 - 错误状态下显示红色样式 */
  error?: boolean
  /** 当存在label属性时，设置标题和输入框垂直居中 */
  center?: boolean
  /** cell类型下必填样式 - 在标签前显示红色星号 */
  required?: boolean
  /** 表单域model字段名 - 用于表单验证时的字段标识 */
  prop?: string
  /** 表单验证规则 - 定义字段的验证规则数组 */
  rules?: FormItemRule[]
  /** 显示清除图标的时机 - always: 有内容时显示, focus: 聚焦且有内容时显示 */
  clearTrigger?: InputClearTrigger
  /** 是否在点击清除按钮时聚焦输入框 */
  focusWhenClear?: boolean
  /** 是否忽略组件内对文本合成系统事件的处理 */
  ignoreCompositionEvent?: boolean
  /** 输入模式 - 提示用户输入数据类型，如：text/tel/email/numeric等 */
  inputmode?: InputMode
  /** 是否使用原生键盘（支付宝小程序） */
  enableNative?: boolean
}

/**
 * 文本域组件事件接口
 */
interface WdTextareaEmits {
  /** 更新绑定值 */
  'update:modelValue': [value: string]
  /** 清空输入框 */
  clear: []
  /** 失去焦点 */
  blur: [detail: { value: string; cursor: number | null }]
  /** 获得焦点 */
  focus: [detail: any]
  /** 输入时触发 */
  input: [detail: any]
  /** 键盘高度变化 */
  keyboardheightchange: [detail: any]
  /** 点击确认按钮 */
  confirm: [detail: any]
  /** 行数变化 */
  linechange: [detail: any]
  /** 点击前置图标 */
  clickprefixicon: []
  /** 点击文本域 */
  click: [event: Event]
}

/**
 * 插槽接口
 */
interface TextareaSlots extends Slots {
  prefix?: () => any
  label?: () => any
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdTextareaProps>(), {
  customStyle: '',
  customClass: '',
  customTextareaContainerClass: '',
  customTextareaClass: '',
  customLabelClass: '',
  modelValue: '',
  placeholderClass: '',
  disabled: false,
  maxlength: -1,
  autoFocus: false,
  focus: false,
  autoHeight: false,
  rows: undefined,
  maxRows: undefined,
  fixed: false,
  cursorSpacing: 0,
  cursor: -1,
  confirmHold: false,
  showConfirmBar: true,
  selectionStart: -1,
  selectionEnd: -1,
  adjustPosition: true,
  disableDefaultPadding: false,
  holdKeyboard: false,
  showPassword: false,
  clearable: false,
  readonly: false,
  showWordLimit: false,
  labelWidth: undefined,
  error: false,
  center: false,
  required: false,
  prop: '',
  rules: () => [],
  clearTrigger: 'always',
  focusWhenClear: true,
  ignoreCompositionEvent: true,
  inputmode: 'text',
  enableNative: true,
})

// 定义组件事件
const emit = defineEmits<WdTextareaEmits>()

// 获取插槽
const $slots = useSlots() as TextareaSlots

// 国际化翻译
const { translate } = useTranslate('textarea')

// 响应式数据
const clearing = ref<boolean>(false)
const focused = ref<boolean>(false) // 控制聚焦
const focusing = ref<boolean>(false) // 当前是否激活状态
const inputValue = ref<string>('') // 输入框的值

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
 * 计算 placeholder 样式
 * 在微信小程序端添加对齐修复
 */
const computedPlaceholderStyle = computed(() => {
  let style = props.placeholderStyle || ''

  // #ifdef MP-WEIXIN
  // 修复小程序端 placeholder 对齐问题
  if (!style.includes('line-height')) {
    style += ';line-height:1.5;'
  }
  // #endif

  return style
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
  { immediate: true, deep: true },
)

/**
 * 计算占位符文本
 */
const placeholderValue = computed(() => {
  return isDef(props.placeholder) ? props.placeholder : translate('placeholder')
})

/**
 * 计算是否显示清空按钮
 */
const showClear = computed(() => {
  const { disabled, readonly, clearable, clearTrigger } = props
  return (
    clearable &&
    !readonly &&
    !disabled &&
    inputValue.value &&
    (clearTrigger === 'always' || (clearTrigger === 'focus' && focusing.value))
  )
})

/**
 * 计算是否显示字数统计
 */
const showWordCount = computed(() => {
  const { disabled, readonly, maxlength, showWordLimit } = props
  return Boolean(!disabled && !readonly && isDef(maxlength) && maxlength > -1 && showWordLimit)
})

/**
 * 计算表单校验错误信息
 */
const errorMessage = computed(() => {
  if (form && props.prop && form.errorMessages && form.errorMessages[props.prop]) {
    return form.errorMessages[props.prop]
  } else {
    return ''
  }
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
 * 格式化输入值
 * @param value 输入值
 * @returns 格式化后的值
 */
const formatValue = (value: string | number): string => {
  if (value === null || value === undefined) return ''
  const { maxlength, showWordLimit } = props
  if (showWordLimit && maxlength !== -1 && String(value).length > maxlength) {
    return value.toString().substring(0, maxlength)
  }
  return `${value}`
}

/**
 * 计算当前文本域文字长度
 */
const currentLength = computed(() => {
  /**
   * 使用Array.from处理多码元字符以获取正确的长度
   * @link https://github.com/Moonofweisheng/wot-design-uni/issues/933
   */
  return Array.from(String(formatValue(props.modelValue))).length
})

/**
 * 计算占位符类名
 */
const inputPlaceholderClass = computed(() => {
  return `wd-textarea__placeholder ${props.placeholderClass}`
})

/**
 * 计算标签样式
 */
const labelStyle = computed(() => {
  return computedLabelWidth.value
    ? objToStyle({
        'min-width': computedLabelWidth.value,
        'max-width': computedLabelWidth.value,
      })
    : ''
})

/**
 * 计算 rows 对应的高度样式
 */
const rowsStyle = computed(() => {
  if (!props.rows) return ''

  // 每行大约 48rpx 高度（基于 line-height: $-cell-line-height）
  const lineHeight = 48
  const totalHeight = props.rows * lineHeight

  return objToStyle({
    height: `${totalHeight}rpx`,
    'min-height': `${totalHeight}rpx`,
    'max-height': `${totalHeight}rpx`,
    'overflow-y': 'auto'
  })
})

/**
 * 计算 maxRows 对应的最大高度样式
 */
const maxRowsStyle = computed(() => {
  if (!props.maxRows || !props.autoHeight || props.rows) return ''

  // 每行大约 48rpx 高度（基于 line-height: $-cell-line-height）
  const lineHeight = 48
  const maxHeight = props.maxRows * lineHeight

  return objToStyle({
    'max-height': `${maxHeight}rpx`,
    'overflow-y': 'auto'
  })
})

/**
 * 状态初始化
 */
const initState = () => {
  inputValue.value = formatValue(inputValue.value)
  emit('update:modelValue', inputValue.value)
}

/**
 * 处理清空按钮点击事件
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
const handleBlur = async ({ detail }: any) => {
  // 等待150毫秒，clear执行完毕
  await pause(150)

  if (clearing.value) {
    clearing.value = false
    return
  }

  focusing.value = false
  emit('blur', {
    value: inputValue.value,
    cursor: detail.cursor ? detail.cursor : null,
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
  inputValue.value = formatValue(inputValue.value as string)
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
 * 处理确认按钮点击事件
 */
const handleConfirm = ({ detail }: any) => {
  emit('confirm', detail)
}

/**
 * 处理行数变化事件
 */
const handleLineChange = ({ detail }: any) => {
  emit('linechange', detail)
}

/**
 * 处理前置图标点击事件
 */
const onClickPrefixIcon = () => {
  emit('clickprefixicon')
}

/**
 * 组件挂载前的处理
 */
onBeforeMount(() => {
  initState()
})
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 暗色主题样式
.wot-theme-dark {
  @include b(textarea) {
    background: $-dark-background2;

    @include e(value) {
      background: $-dark-background2;
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

    :deep(.wd-textarea__icon),
    :deep(.wd-textarea__clear) {
      color: $-dark-color;
      background: transparent;
    }

    @include when(cell) {
      background-color: $-dark-background2;
    }

    @include when(disabled) {
      .wd-textarea__inner {
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

// 文本域组件样式
@include b(textarea) {
  position: relative;
  -webkit-tap-highlight-color: transparent;
  text-align: left;
  background: $-textarea-bg;
  padding: $-textarea-cell-padding $-textarea-padding;

  @include e(label) {
    position: relative;
    display: flex;
    width: $-input-cell-label-width;
    color: $-cell-title-color;
    margin-right: $-cell-padding;
    box-sizing: border-box;
    font-size: $-textarea-fs;

    @include when(required) {
      padding-left: 24rpx;

      &::after {
        position: absolute;
        left: 0;
        top: 4rpx;
        content: '*';
        font-size: $-cell-required-size;
        line-height: 1.1;
        color: $-cell-required-color;
      }
    }
  }

  @include e(label-inner) {
    display: inline-block;
    line-height: $-cell-line-height;
    font-size: $-textarea-fs;
  }

  @include e(prefix) {
    margin-right: $-textarea-icon-margin;
    font-size: $-textarea-fs;
    line-height: initial;

    :deep(.wd-textarea__icon) {
      margin-left: 0;
    }
  }

  @include e(suffix) {
    flex-shrink: 0;
    line-height: initial;
  }

  @include e(value) {
    position: relative;
    padding: 0;
    font-size: 0;
    background: $-textarea-bg;
    box-sizing: border-box;

    @include when(show-limit) {
      padding-bottom: 56rpx;
    }

    @include when(suffix) {
      padding-right: calc($-textarea-icon-size + 16rpx);
    }
  }

  @include e(inner) {
    padding: 0;
    width: 100%;
    font-size: $-textarea-fs;
    line-height: $-cell-line-height;
    color: $-textarea-color;
    outline: none;
    background: none;
    border: none;
    box-sizing: border-box;
    word-break: break-word;
    min-height: 48rpx;

    &::-webkit-input-placeholder {
      color: $-input-placeholder-color;
    }
  }

  @include e(suffix) {
    position: absolute;
    z-index: 1;
    right: 0;
    top: 0;
    bottom: 0;
  }

  @include edeep(icon) {
    margin-left: $-textarea-icon-margin;
    font-size: $-textarea-icon-size;
    color: $-textarea-icon-color;
    background: $-textarea-bg;
  }

  @include edeep(clear) {
    margin-left: $-textarea-icon-margin;
    font-size: $-textarea-icon-size;
    color: $-textarea-clear-color;
    vertical-align: middle;
    background: $-textarea-bg;
    line-height: $-cell-line-height;
  }

  @include e(count) {
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: $-textarea-count-fs;
    color: $-textarea-count-color;
    background: $-textarea-bg;
    line-height: 40rpx;
    display: inline-flex;
  }

  @include e(count-current) {
    color: $-textarea-count-current-color;

    @include when(error) {
      color: $-input-error-color;
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

  @include e(error-message) {
    color: $-form-item-error-message-color;
    font-size: $-form-item-error-message-font-size;
    line-height: $-form-item-error-message-line-height;
    text-align: left;
    vertical-align: middle;
  }

  @include e(placeholder) {
    color: $-input-placeholder-color;

    &.is-error {
      color: $-input-error-color;
    }
  }

  @include when(disabled) {
    .wd-textarea__inner {
      color: $-input-disabled-color;
      background: transparent;
    }
  }

  @include when(error) {
    .wd-textarea__inner {
      color: $-input-error-color;
      background: transparent;
    }
  }

  @include when(auto-height) {
    &:not(.is-cell) {
      padding: 10rpx 0;
    }
  }

  @include when(fixed-rows) {
    .wd-textarea__inner {
      resize: none;
    }
  }

  @include when(max-rows) {
    .wd-textarea__inner {
      resize: none;
    }
  }

  @include when(cell) {
    display: flex;
    line-height: $-cell-line-height;

    .wd-textarea__value {
      flex: 1;
    }

    :deep(.wd-textarea__icon) {
      display: inline-flex;
      align-items: center;
      height: $-textarea-cell-height;
      line-height: $-textarea-cell-height;
    }

    .wd-textarea__prefix {
      display: inline-block;
      margin-right: $-cell-icon-right;
    }

    .wd-textarea__suffix {
      right: 0;
    }

    @include when(center) {
      align-items: center;
    }
  }

  @include when(large) {
    padding: $-textarea-cell-padding-large;

    .wd-textarea__prefix {
      font-size: $-textarea-fs-large;
    }

    .wd-textarea__label-inner {
      font-size: $-textarea-fs-large;
    }

    .wd-textarea__inner {
      font-size: $-textarea-fs-large;
    }

    .wd-textarea__count {
      font-size: $-textarea-count-fs-large;
    }

    :deep(.wd-textarea__icon),
    :deep(.wd-textarea__clear) {
      font-size: $-textarea-icon-size-large;
    }
  }
}
</style>
