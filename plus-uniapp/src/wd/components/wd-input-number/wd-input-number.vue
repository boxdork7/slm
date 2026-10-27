<!-- InputNumber 计数器 由增加按钮、减少按钮和输入框组成，用于在一定范围内输入、调整数字。 -->
<template>
  <view :class="rootClass" :style="customStyle">
    <view
      v-if="label || $slots.label"
      :class="`wd-input-number__label ${customLabelClass} ${isRequired ? 'is-required' : ''}`"
      :style="
        computedLabelWidth ? `min-width: ${addUnit(computedLabelWidth)}; max-width: ${addUnit(computedLabelWidth)};` : ''
      "
    >
      <view v-if="prefixIcon || $slots.prefix" class="wd-input-number__prefix">
        <wd-icon
          v-if="prefixIcon && !$slots.prefix"
          custom-class="wd-input-number__icon"
          :name="prefixIcon"
          @click="onClickPrefixIcon"
        />
        <slot v-else name="prefix" />
      </view>
      <view class="wd-input-number__label-inner">
        <template v-if="label && !$slots.label">
          {{ label }}
        </template>
        <slot v-else name="label" />
      </view>
    </view>
    <view class="wd-input-number__body">
      <view class="wd-input-number__value">
        <view v-if="(prefixIcon || $slots.prefix) && !label" class="wd-input-number__prefix">
          <wd-icon
            v-if="prefixIcon && !$slots.prefix"
            custom-class="wd-input-number__icon"
            :name="prefixIcon"
            @click="onClickPrefixIcon"
          />
          <slot v-else name="prefix" />
        </view>
        <view
          :class="`wd-input-number__wrapper ${disabled ? 'is-disabled' : ''} ${withoutInput ? 'is-without-input' : ''}`"
        >
          <!-- 减号按钮 -->
          <view
            :class="`wd-input-number__action ${minDisabled || disableMinus ? 'is-disabled' : ''}`"
            @click="handleClick('sub')"
            @touchstart="handleTouchStart('sub')"
            @touchend.stop="handleTouchEnd"
          >
            <wd-icon name="minus" custom-class="wd-input-number__action-icon" size="36" />
          </view>
          <!-- 输入框 -->
          <view v-if="!withoutInput" class="wd-input-number__inner" @click.stop="">
            <input
              class="wd-input-number__input"
              :style="inputWidth ? `width: ${addUnit(inputWidth)}` : ''"
              :type="inputType"
              :input-mode="precision ? 'decimal' : 'numeric'"
              :disabled="disabled || disableInput"
              :value="String(inputValue)"
              :placeholder="placeholder"
              :adjust-position="adjustPosition"
              @input="handleInput"
              @focus="handleFocus"
              @blur="handleBlur"
            />
            <view class="wd-input-number__input-border" />
          </view>
          <!-- 加号按钮 -->
          <view
            :class="`wd-input-number__action ${maxDisabled || disablePlus ? 'is-disabled' : ''}`"
            @click="handleClick('add')"
            @touchstart="handleTouchStart('add')"
            @touchend.stop="handleTouchEnd"
          >
            <wd-icon name="add" custom-class="wd-input-number__action-icon" size="36" />
          </view>
        </view>
        <view v-if="suffixIcon || $slots.suffix" class="wd-input-number__suffix">
          <wd-icon
            v-if="suffixIcon && !$slots.suffix"
            custom-class="wd-input-number__icon"
            :name="suffixIcon"
            @click="onClickSuffixIcon"
          />
          <slot v-else name="suffix" />
        </view>
      </view>
      <view v-if="errorMessage" class="wd-input-number__error-message">
        {{ errorMessage }}
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { FormItemRule } from '../wd-form/wd-form.vue'
import { computed, nextTick, ref, watch } from 'vue'
import { callInterceptor } from '../common/interceptor'
import { addUnit, isDef, isEqual } from '../common/util'
import { useCell } from '../composables/useCell'
import { useParent } from '../composables/useParent'
import { FORM_KEY } from '../wd-form/wd-form-key'
import wdIcon from '../wd-icon/wd-icon.vue'

defineOptions({
  name: 'WdInputNumber',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 输入框值变化前的回调函数类型定义
 */
export type InputNumberBeforeChange = (value: number | string) => boolean | Promise<boolean>

/**
 * 操作类型
 */
type OperationType = 'add' | 'sub'

/**
 * 计数器组件属性接口
 */
interface WdInputNumberProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string
  /** 自定义标签样式类 */
  customLabelClass?: string

  /** 绑定值 */
  modelValue: string | number
  /** 最小值 */
  min?: number
  /** 最大值 */
  max?: number
  /** 步进值 */
  step?: number
  /** 是否严格按照步进值递增或递减 */
  stepStrictly?: boolean
  /** 数值精度 */
  precision?: string | number
  /** 是否禁用 */
  disabled?: boolean
  /** 是否禁用输入框 */
  disableInput?: boolean
  /** 是否禁用减号按钮 */
  disableMinus?: boolean
  /** 是否禁用加号按钮 */
  disablePlus?: boolean
  /** 是否不显示输入框 */
  withoutInput?: boolean
  /** 输入框宽度（rpx） */
  inputWidth?: string | number
  /** 是否允许为空 */
  allowNull?: boolean
  /** 输入框占位符 */
  placeholder?: string
  /** 键盘弹起时，是否自动上推页面 */
  adjustPosition?: boolean
  /** 输入值变化前的回调函数 */
  beforeChange?: InputNumberBeforeChange
  /** 是否开启长按加减手势 */
  longPress?: boolean
  /** 是否立即响应输入变化 */
  immediateChange?: boolean
  /** 是否在初始化时更新 v-model 为修正后的值 */
  updateOnInit?: boolean
  /** 输入框类型 */
  inputType?: 'number' | 'digit'

  // 表单相关属性
  /** 设置左侧标题 */
  label?: string
  /** 设置左侧标题宽度（rpx） */
  labelWidth?: string | number
  /** 前置图标 */
  prefixIcon?: string
  /** 后置图标 */
  suffixIcon?: string
  /** 当有label属性时，设置标题和输入框垂直居中 */
  center?: boolean
  /** 是否必填 */
  required?: boolean
  /** 表单域 model 字段名 */
  prop?: string
  /** 表单验证规则 */
  rules?: FormItemRule[]
  /** 设置输入框错误状态 */
  error?: boolean
  /** 非 cell 类型下是否隐藏下划线 */
  noBorder?: boolean
}

/**
 * 计数器组件事件接口
 */
interface WdInputNumberEmits {
  /** 数值变化事件 */
  change: [value: { value: number | string }]
  /** 输入框聚焦事件 */
  focus: [detail: any]
  /** 输入框失焦事件 */
  blur: [value: { value: string | number }]
  /** v-model 更新事件 */
  'update:modelValue': [value: number | string]
  /** 点击后置图标 */
  clicksuffixicon: []
  /** 点击前置图标 */
  clickprefixicon: []
}

/**
 * 计数器组件插槽接口
 */
interface WdInputNumberSlots extends Slots {
  /** 前置插槽 */
  prefix?: () => any
  /** 后置插槽 */
  suffix?: () => any
  /** 标签插槽 */
  label?: () => any
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdInputNumberProps>(), {
  customStyle: '',
  customClass: '',
  customLabelClass: '',
  min: 1,
  max: Number.MAX_SAFE_INTEGER,
  step: 1,
  stepStrictly: false,
  precision: 0,
  disabled: false,
  disableInput: false,
  disableMinus: false,
  disablePlus: false,
  withoutInput: false,
  inputWidth: 120,
  allowNull: false,
  placeholder: '',
  adjustPosition: true,
  longPress: false,
  immediateChange: true,
  updateOnInit: true,
  inputType: 'digit',
  labelWidth: undefined,
  center: false,
  required: false,
  rules: () => [],
  error: false,
  noBorder: true,
})

// 定义组件事件
const emit = defineEmits<WdInputNumberEmits>()

// 定义组件插槽
const slots = useSlots() as WdInputNumberSlots

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
 * 按指定精度处理数值
 */
const formatToPrecision = (val: number) => {
  const precision = Number(props.precision)
  return Math.round(val * 10 ** precision) / 10 ** precision
}

/**
 * 获取数字的小数位数
 */
const getDecimalPrecision = (val?: number) => {
  if (!isDef(val)) return 0
  const str = val.toString()
  const dotIndex = str.indexOf('.')
  return dotIndex === -1 ? 0 : str.length - dotIndex - 1
}

/**
 * 严格步进模式下的边界处理
 */
const applyStrictBoundaries = (val: number, min: number, max: number): number => {
  if (val >= min && val <= max) return val

  const stepPrecision = getDecimalPrecision(props.step)
  const factor = 10 ** stepPrecision

  if (val < min) {
    const minSteps = Math.ceil((min * factor) / (props.step * factor))
    const candidate = formatToPrecision((minSteps * props.step * factor) / factor)
    if (candidate > max) {
      const maxSteps = Math.floor((max * factor) / (props.step * factor))
      return formatToPrecision((maxSteps * props.step * factor) / factor)
    }
    return candidate
  }

  if (val > max) {
    const maxSteps = Math.floor((max * factor) / (props.step * factor))
    const candidate = formatToPrecision((maxSteps * props.step * factor) / factor)
    if (candidate < min) {
      const minSteps = Math.ceil((min * factor) / (props.step * factor))
      return formatToPrecision((minSteps * props.step * factor) / factor)
    }
    return candidate
  }

  return val
}

/**
 * 标准化数值（应用步进、边界、精度规则）
 */
const normalizeInputValue = (val: number): number => {
  let result = val

  // 严格步进
  if (props.stepStrictly) {
    const stepPrecision = getDecimalPrecision(props.step)
    const factor = 10 ** stepPrecision
    result = (Math.round(result / props.step) * factor * props.step) / factor
  }

  // 边界限制
  if (props.stepStrictly) {
    result = applyStrictBoundaries(result, props.min, props.max)
  } else {
    result = Math.min(Math.max(result, props.min), props.max)
  }

  // 精度处理
  if (isDef(props.precision)) {
    result = formatToPrecision(result)
  }

  return result
}

/**
 * 将字符串或数字转换为标准数值
 */
const convertToNumber = (val: string | number): number => {
  // 空值处理
  if (props.allowNull && (!isDef(val) || val === '')) {
    return Number.NaN
  }

  if (!isDef(val) || val === '') {
    return props.min
  }

  let str = String(val)

  // 处理中间输入状态
  if (str.endsWith('.')) str = str.slice(0, -1)
  if (str.startsWith('.')) str = `0${str}`
  if (str.startsWith('-.')) str = `-0${str.substring(1)}`
  if (str === '-' || str === '') return props.min

  let num = Number(str)
  if (Number.isNaN(num)) num = props.min

  return normalizeInputValue(num)
}

/**
 * 格式化值用于显示（包含修正逻辑）
 */
const formatDisplayValue = (val: string | number): string | number => {
  if (props.allowNull && (!isDef(val) || val === '')) {
    return ''
  }

  const num = convertToNumber(val)
  const precision = Number(props.precision)
  if (!isDef(props.precision)) {
    return num
  }
  return precision === 0 ? Number(num.toFixed(0)) : num.toFixed(precision)
}

/**
 * 仅做显示格式化，不包含值修正逻辑
 */
const formatForDisplay = (val: string | number): string | number => {
  if (props.allowNull && (!isDef(val) || val === '')) {
    return ''
  }

  if (!isDef(val) || val === '') {
    return props.min
  }

  const num = Number(val)
  if (Number.isNaN(num)) {
    return props.min
  }

  const precision = Number(props.precision)
  if (!isDef(props.precision)) {
    return num
  }
  return precision === 0 ? Number(num.toFixed(0)) : num.toFixed(precision)
}

/**
 * 获取初始值
 */
const getInitialValue = () => {
  if (!props.updateOnInit) {
    // 不自动修正时，仅做显示格式化，不修正值
    return formatForDisplay(props.modelValue)
  }

  const formatted = formatDisplayValue(props.modelValue)

  // 如果格式化后的值与原始值不同，同步到外部
  if (!isEqual(String(formatted), String(props.modelValue))) {
    emit('update:modelValue', formatted)
  }
  return formatted
}

// 响应式数据
const inputValue = ref<string | number>(getInitialValue())
let longPressTimer: ReturnType<typeof setTimeout> | null = null

/**
 * 清理输入值
 */
const cleanInputValue = (val: string): string => {
  if (!val) return ''

  // 清理非数字、小数点、负号
  let cleaned = val.replace(/[^\d.-]/g, '')

  // 处理负号，保证负号只出现在最前面
  const hasNegative = cleaned.startsWith('-')
  cleaned = cleaned.replace(/-/g, '')
  if (hasNegative) {
    cleaned = `-${cleaned}`
  }

  // 处理小数点
  const precision = Number(props.precision)
  if (precision > 0) {
    const parts = cleaned.split('.')
    if (parts.length > 2) {
      cleaned = `${parts[0]}.${parts.slice(1).join('')}`
    }
  } else {
    cleaned = cleaned.split('.')[0]
  }

  // 处理以点开头的情况
  if (cleaned.startsWith('.')) {
    return `0${cleaned}`
  }
  if (cleaned.startsWith('-.')) {
    return `-0${cleaned.substring(1)}`
  }

  return cleaned
}

/**
 * 清除长按定时器
 */
const clearLongPressTimer = () => {
  if (longPressTimer) {
    clearTimeout(longPressTimer)
    longPressTimer = null
  }
}

/**
 * 按步进值增减
 */
const addStepValue = (val: string | number, step: number) => {
  const num = Number(val)
  if (Number.isNaN(num)) {
    return normalizeInputValue(props.min)
  }

  const precision = Math.max(getDecimalPrecision(num), getDecimalPrecision(step))
  const factor = 10 ** precision
  const result = (num * factor + step * factor) / factor
  return normalizeInputValue(result)
}

/**
 * 判断数字是否达到最小值限制
 */
const minDisabled = computed(() => {
  const val = convertToNumber(inputValue.value)
  return props.disabled || val <= props.min || addStepValue(val, -props.step) < props.min
})

/**
 * 判断数字是否达到最大值限制
 */
const maxDisabled = computed(() => {
  const val = convertToNumber(inputValue.value)
  return props.disabled || val >= props.max || addStepValue(val, props.step) > props.max
})

/**
 * 更新值并触发事件
 */
const updateInputValue = (val: string | number) => {
  // 空值处理
  if (props.allowNull && (!isDef(val) || val === '')) {
    if (isEqual('', String(props.modelValue))) {
      inputValue.value = ''
      return
    }

    const doUpdate = () => {
      inputValue.value = ''
      emit('update:modelValue', '')
      emit('change', { value: '' })
    }

    callInterceptor(props.beforeChange, { args: [''], done: doUpdate })
    return
  }

  const num = convertToNumber(val)
  const display = formatDisplayValue(val)

  if (isEqual(String(num), String(props.modelValue))) {
    inputValue.value = display
    return
  }

  const doUpdate = () => {
    inputValue.value = display
    emit('update:modelValue', num)
    emit('change', { value: num })
  }

  callInterceptor(props.beforeChange, { args: [num], done: doUpdate })
}

/**
 * 处理按钮点击
 */
const handleClick = (type: OperationType) => {
  const step = type === 'add' ? props.step : -props.step
  if (
    (step < 0 && (minDisabled.value || props.disableMinus)) ||
    (step > 0 && (maxDisabled.value || props.disablePlus))
  ) {
    return
  }

  const newVal = addStepValue(inputValue.value, step)
  updateInputValue(newVal)
}

/**
 * 长按逻辑
 */
const executeLongPressStep = (type: OperationType) => {
  clearLongPressTimer()
  longPressTimer = setTimeout(() => {
    handleClick(type)
    executeLongPressStep(type)
  }, 250)
}

/**
 * 检查是否为中间输入状态
 */
const isIntermediateState = (val: string): boolean => {
  if (!val) return false
  const str = String(val)
  return (
    str.endsWith('.') ||
    str.startsWith('.') ||
    str.startsWith('-.') ||
    str === '-' ||
    (Number(props.precision) > 0 && !str.includes('.'))
  )
}
/**
 * 处理输入事件
 */
const handleInput = (event: any) => {
  const rawVal = event.detail.value || ''

  // 立即更新显示
  inputValue.value = rawVal

  nextTick(() => {
    // 空值处理
    if (rawVal === '') {
      inputValue.value = ''
      if (props.immediateChange && props.allowNull) {
        updateInputValue('')
      }
      return
    }

    // 清理输入
    const cleaned = cleanInputValue(rawVal)

    // 中间状态处理
    if (Number(props.precision) > 0 && isIntermediateState(cleaned)) {
      inputValue.value = cleaned
      return
    }

    // 正常输入处理
    inputValue.value = cleaned
    if (props.immediateChange) {
      updateInputValue(cleaned)
    }
  })
}

/**
 * 处理失焦事件
 */
const handleBlur = (event: any) => {
  const val = event.detail.value || ''
  updateInputValue(val)
  emit('blur', { value: val })
}

/**
 * 处理聚焦事件
 */
const handleFocus = (event: any) => {
  emit('focus', event.detail)
}

/**
 * 处理触摸开始事件
 */
const handleTouchStart = (type: OperationType) => {
  if (!props.longPress) return
  clearLongPressTimer()
  longPressTimer = setTimeout(() => {
    handleClick(type)
    executeLongPressStep(type)
  }, 600)
}

/**
 * 处理触摸结束事件
 */
const handleTouchEnd = () => {
  if (!props.longPress) return
  clearLongPressTimer()
}

/**
 * 处理点击前置图标事件
 */
const onClickPrefixIcon = () => {
  emit('clickprefixicon')
}

/**
 * 处理点击后置图标事件
 */
const onClickSuffixIcon = () => {
  emit('clicksuffixicon')
}

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
  const classes = ['wd-input-number']

  if (props.label || slots.label) classes.push('is-cell')
  if (props.center) classes.push('is-center')
  if (cell.border.value) classes.push('is-border')
  if (props.error) classes.push('is-error')
  if (props.disabled) classes.push('is-disabled')
  if (props.noBorder) classes.push('is-no-border')
  if (props.customClass) classes.push(props.customClass)

  return classes.join(' ')
})

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (val) => {
    inputValue.value = formatDisplayValue(val)
  },
)

// 监听 max, min, precision 变化时重新格式化当前值
watch([() => props.max, () => props.min, () => props.precision], () => {
  const val = convertToNumber(inputValue.value)
  inputValue.value = formatDisplayValue(val)
})
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/_mixin.scss';
@import '../common/abstracts/variable.scss';

// 暗色主题样式
.wot-theme-dark {
  @include b(input-number) {
    background: $-dark-background2;

    &::after {
      background: $-dark-color-gray;
    }

    @include e(action) {
      color: $-dark-color;
      @include when(disabled) {
        color: $-dark-color-gray;
      }
    }

    @include e(input) {
      color: $-dark-color;
    }

    @include e(label) {
      color: $-dark-color;
    }

    :deep(.wd-input-number__icon) {
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
      .wd-input-number__input {
        color: $-dark-color-gray;
      }
      .wd-input-number__sub,
      .wd-input-number__add {
        color: $-dark-color-gray;
      }
    }
  }
}

// 计数器组件样式
@include b(input-number) {
  position: relative;
  text-align: center;
  user-select: none;
  line-height: 1.15;
  background: $-input-bg;

  &::after {
    position: absolute;
    content: '';
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: $-input-border-color;
    transform: scaleY(0.5);
    transition: background-color 0.2s ease-in-out;
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
    font-size: $-input-fs;
    line-height: $-cell-line-height;
  }

  @include e(body) {
    flex: 1;
    display: flex;
    flex-direction: column;
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

    :deep(.wd-input-number__icon) {
      margin-left: 0;
    }
  }

  @include e(suffix) {
    flex-shrink: 0;
    line-height: initial;
  }

  @include e(wrapper) {
    display: inline-block;
    user-select: none;
    line-height: 1.15;
    margin-left: auto; // 推到右侧
    .is-cell & {
      max-width: fit-content;
      margin-left: auto; // 推到右侧
    }
  }

  @include e(error-message) {
    color: $-form-item-error-message-color;
    font-size: $-form-item-error-message-font-size;
    line-height: $-form-item-error-message-line-height;
    text-align: left;
    vertical-align: middle;
  }

  @include edeep(icon) {
    margin-left: $-input-icon-margin;
    font-size: $-input-icon-size;
    color: $-input-icon-color;
    vertical-align: middle;
    background: $-input-bg;
  }

  @include when(cell) {
    display: flex;
    align-items: flex-start;
    justify-content: space-between; // 确保左右分布
    padding: $-input-cell-padding $-input-padding;
    background-color: $-input-cell-bg;

    &.is-error::after {
      background: $-input-cell-border-color;
    }

    :deep(.wd-input-number__icon) {
      display: inline-flex;
      align-items: center;
      height: $-input-cell-height;
      line-height: $-input-cell-height;
    }

    .wd-input-number__prefix {
      display: inline-block;
      margin-right: $-cell-icon-right;
    }

    .wd-input-number__body {
      flex: 1;
      display: flex;
      justify-content: flex-end; // 数字输入器右对齐
    }

    .wd-input-number__value {
      justify-content: flex-end; // 确保内容右对齐
    }

    &.wd-input-number::after {
      display: none;
    }

    @include when(center) {
      align-items: center;
    }

    @include when(border) {
      @include halfPixelBorder('top', $-input-cell-padding);
    }
  }

  @include when(no-border) {
    &::after {
      display: none;
    }
  }

  @include when(disabled) {
    .wd-input-number__input {
      color: $-input-disabled-color;
      z-index: inherit;
    }
    .wd-input-number__sub,
    .wd-input-number__add {
      color: $-input-disabled-color;
    }
  }

  @include when(without-input) {
    .wd-input-number__action:last-child::after {
      border-left: none;
    }
  }

  @include e(action) {
    position: relative;
    display: inline-block;
    width: $-input-number-btn-width;
    height: $-input-number-height;
    vertical-align: middle;
    color: $-input-number-icon-color;
    -webkit-tap-highlight-color: transparent;
    box-sizing: border-box;

    // 左右加减号的边框
    &::after {
      position: absolute;
      content: '';
      width: calc(200% - 2px);
      height: calc(200% - 2px);
      left: 0;
      top: 0;
      border: 2rpx solid $-input-number-border-color;
      border-top-left-radius: calc($-input-number-radius * 2);
      border-bottom-left-radius: calc($-input-number-radius * 2);
      transform: scale(0.5);
      transform-origin: left top;
    }

    &:last-child::after {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-top-right-radius: calc($-input-number-radius * 2);
      border-bottom-right-radius: calc($-input-number-radius * 2);
    }

    @include when(disabled) {
      color: $-input-number-disabled-color;
    }
  }

  @include e(inner) {
    position: relative;
    display: inline-block;
    vertical-align: middle;
  }

  @include e(input) {
    position: relative;
    display: block;
    width: $-input-number-input-width;
    height: $-input-number-height;
    padding: 0 4rpx;
    box-sizing: border-box;
    z-index: 1;
    background: transparent;
    border: none;
    outline: none;
    text-align: center;
    color: $-input-number-color;
    font-size: $-input-number-fs;
    -webkit-appearance: none;
    -webkit-tap-highlight-color: transparent;
  }

  @include e(input-border) {
    position: absolute;
    width: 100%;
    height: calc(200% - 2px);
    left: 0;
    top: 0;
    border-top: 2rpx solid $-input-number-border-color;
    border-bottom: 2rpx solid $-input-number-border-color;
    transform: scaleY(0.5);
    transform-origin: left top;
    z-index: 0;
  }

  @include edeep(action-icon) {
    display: inline-block;
    font-size: $-input-number-icon-size;
    width: $-input-number-icon-size;
    height: $-input-number-icon-size;
    margin-top: 2rpx;
    margin-right: 8rpx;
  }

}
</style>
