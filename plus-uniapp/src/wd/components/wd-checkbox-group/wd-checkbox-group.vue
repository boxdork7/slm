<!-- Checkbox 复选框分组 -->
<template>
  <!-- 表单模式：有 label 时包装在 wd-cell 中 -->
  <wd-cell
    v-if="isFormMode"
    :title="label"
    :title-width="addUnit(computedLabelWidth)"
    :icon="prefixIcon"
    :center="center"
    :vertical="vertical"
    :required="isRequired"
    :prop="prop"
    :rules="rules"
    :custom-title-class="customLabelClass"
    :custom-icon-class="customIconClass"
    :style="customStyle"
    :class="customClass"
    :border="!noBorder"
  >
    <!-- 表单模式下的复选框组内容 -->
    <view class="wd-checkbox-group" :style="itemWidthStyle">
      <!-- Options 模式：通过 options 数组渲染复选项 -->
      <template v-if="options && options.length > 0">
        <view
          v-for="(option, index) in options"
          :key="String(option.value)"
          :class="getOptionClasses(option, index)"
          :style="getOptionStyles()"
          @click="handleOptionClick(option)"
        >
          <!-- 形状元素（按钮模式时隐藏） -->
          <view
            v-if="shape !== 'button'"
            :class="`wd-checkbox__shape ${shape === 'square' ? 'is-square' : ''} ${option.customShapeClass || ''}`"
            :style="
              isOptionChecked(option) && !isOptionDisabled(option) && checkedColor
                ? `color: ${checkedColor}`
                : ''
            "
          >
            <wd-icon custom-class="wd-checkbox__check" name="check" :size="getIconSize()" />
          </view>

          <!-- 标签元素 -->
          <view
            :class="`wd-checkbox__label ${option.customLabelClass || ''}`"
            :style="
              isOptionChecked(option) &&
              shape === 'button' &&
              !isOptionDisabled(option) &&
              checkedColor
                ? `color: ${checkedColor}`
                : ''
            "
          >
            <!-- 按钮选中时展示的图标 -->
            <wd-icon
              v-if="shape === 'button' && isOptionChecked(option)"
              custom-class="wd-checkbox__btn-check"
              name="check"
              :size="getIconSize()"
            />

            <!-- 文案区域 -->
            <view
              class="wd-checkbox__txt"
              :style="option.maxWidth ? `max-width: ${option.maxWidth}` : ''"
            >
              <!-- 自定义内容插槽 -->
              <slot
                v-if="option.useSlot"
                :name="option.slotName || `option-${index}`"
                :option="option"
                :index="index"
                :checked="isOptionChecked(option)"
              />
              <!-- 默认文字 -->
              <text v-else>{{ option.label }}</text>
            </view>
          </view>
        </view>
      </template>

      <!-- 子组件模式：使用 wd-checkbox 子组件 -->
      <slot v-else />
    </view>

    <!-- 标签插槽（表单模式） -->
    <template #label>
      <slot name="label" />
    </template>

    <!-- 前置图标插槽（表单模式） -->
    <template #icon>
      <slot name="prefix" />
    </template>
  </wd-cell>

  <!-- 非表单模式：直接渲染 -->
  <view
    v-else
    :class="`wd-checkbox-group ${customClass}`"
    :style="`${customStyle}${itemWidthStyle}`"
  >
    <!-- Options 模式：通过 options 数组渲染复选项 -->
    <template v-if="options && options.length > 0">
      <view
        v-for="(option, index) in options"
        :key="String(option.value)"
        :class="getOptionClasses(option, index)"
        :style="getOptionStyles()"
        @click="handleOptionClick(option)"
      >
        <!-- 形状元素（按钮模式时隐藏） -->
        <view
          v-if="shape !== 'button'"
          :class="`wd-checkbox__shape ${shape === 'square' ? 'is-square' : ''} ${option.customShapeClass || ''}`"
          :style="
            isOptionChecked(option) && !isOptionDisabled(option) && checkedColor
              ? `color: ${checkedColor}`
              : ''
          "
        >
          <wd-icon custom-class="wd-checkbox__check" name="check" :size="getIconSize()" />
        </view>

        <!-- 标签元素 -->
        <view
          :class="`wd-checkbox__label ${option.customLabelClass || ''}`"
          :style="
            isOptionChecked(option) &&
            shape === 'button' &&
            !isOptionDisabled(option) &&
            checkedColor
              ? `color: ${checkedColor}`
              : ''
          "
        >
          <!-- 按钮选中时展示的图标 -->
          <wd-icon
            v-if="shape === 'button' && isOptionChecked(option)"
            custom-class="wd-checkbox__btn-check"
            name="check"
            :size="getIconSize()"
          />

          <!-- 文案区域 -->
          <view
            class="wd-checkbox__txt"
            :style="option.maxWidth ? `max-width: ${option.maxWidth}` : ''"
          >
            <!-- 自定义内容插槽 -->
            <slot
              v-if="option.useSlot"
              :name="option.slotName || `option-${index}`"
              :option="option"
              :index="index"
              :checked="isOptionChecked(option)"
            />
            <!-- 默认文字 -->
            <text v-else>{{ option.label }}</text>
          </view>
        </view>
      </view>
    </template>

    <!-- 子组件模式：使用 wd-checkbox 子组件 -->
    <slot v-else />
  </view>
</template>

<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import type { FormItemRule } from '../wd-form/wd-form.vue'
import { computed, useSlots, watch } from 'vue'
import { addUnit, checkNumRange, objToStyle } from '../common/util'
import { useChildren } from '../composables/useChildren'
import { useParent } from '../composables/useParent'
import wdCell from '../wd-cell/wd-cell.vue'
import { FORM_KEY } from '../wd-form/wd-form-key'
import wdIcon from '../wd-icon/wd-icon.vue'
import { CHECKBOX_GROUP_KEY } from './wd-checkbox-group-key'

defineOptions({
  name: 'WdCheckboxGroup',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 复选框形状类型
 */
export type CheckShape = 'circle' | 'square' | 'button'

/**
 * 复选框尺寸类型
 */
export type CheckSize = 'default' | 'small' | 'large'

/**
 * 复选框组 modelValue 支持的类型
 * 支持数组或字符串（逗号分隔）
 */
export type CheckboxGroupModelValue = Array<string | number | boolean> | string

/**
 * 复选项配置接口（用于 options 模式）
 */
interface CheckboxOption {
  /** 选项的值 */
  value: string | number | boolean
  /** 选项的标签文字 */
  label?: string
  /** 是否禁用该选项 */
  disabled?: boolean
  /** 是否使用自定义内容插槽 */
  useSlot?: boolean
  /** 自定义内容插槽名称，默认为 option-{index} */
  slotName?: string
  /** 最大宽度 */
  maxWidth?: string
  /** 自定义标签样式类名 */
  customLabelClass?: string
  /** 自定义形状样式类名 */
  customShapeClass?: string

  /** 自定义数据，选择时会传递 */
  [key: string]: any
}

/**
 * 复选框组组件属性接口
 */
interface WdCheckboxGroupProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 绑定值，支持数组或字符串（逗号分隔） */
  modelValue?: CheckboxGroupModelValue
  /** 复选项配置列表（options 模式） */
  options?: CheckboxOption[]

  /** 复选框形状，可选值：circle / square / button */
  shape?: CheckShape
  /** 选中的颜色 */
  checkedColor?: string
  /** 禁用整个复选框组 */
  disabled?: boolean
  /** 最小选中的数量 */
  min?: number
  /** 最大选中的数量，0 为无限数量，默认为 0 */
  max?: number
  /** 同行展示 */
  inline?: boolean
  /** 设置大小，可选值：default / small / large */
  size?: CheckSize
  /** 字符串模式的分隔符，默认为逗号 */
  separator?: string
  /** 每个复选框的宽度，支持百分比或固定值，如 '25%' '200rpx'，默认按钮模式为33.3333%，其他模式为auto */
  itemWidth?: string

  // 表单相关属性
  /** 设置左侧标题 */
  label?: string
  /** 设置左侧标题宽度 */
  labelWidth?: string | number
  /** 前置图标 */
  prefixIcon?: string
  /** 当有label属性时，设置标题和复选框垂直居中 */
  center?: boolean
  /** 表单属性，上下结构 */
  vertical?: boolean
  /** 是否必填 */
  required?: boolean
  /** 表单域 model 字段名 */
  prop?: string
  /** 表单验证规则 */
  rules?: FormItemRule[]
  /** 非 cell 类型下是否隐藏下划线 */
  noBorder?: boolean
  /** label 使用 slot 时的自定义样式 */
  customLabelClass?: string
  /** 前置图标使用 slot 时的自定义样式 */
  customIconClass?: string
}

/**
 * 复选框组组件事件接口
 */
interface WdCheckboxGroupEmits {
  /** v-model 更新事件 */
  'update:modelValue': [value: Array<string | number | boolean> | string]
  /** 值变化时触发 */
  change: [value: Array<string | number | boolean> | string]
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdCheckboxGroupProps>(), {
  customStyle: '',
  customClass: '',
  modelValue: () => [],
  options: () => [],
  shape: 'circle',
  disabled: false,
  min: 0,
  max: 0,
  inline: false,
  size: 'default',
  separator: ',',
  center: false,
  vertical: false,
  required: false,
  rules: () => [],
  noBorder: false,
  customLabelClass: '',
  customIconClass: '',
  labelWidth: undefined,
})

// 定义组件事件
const emit = defineEmits<WdCheckboxGroupEmits>()

// 获取插槽
const slots = useSlots()

// 子组件管理（用于兼容 wd-checkbox 子组件模式）
const { linkChildren } = useChildren(CHECKBOX_GROUP_KEY)

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
 * 图标尺寸映射表
 * 为每个尺寸定义对应的图标大小（单位：rpx）
 */
const iconSizeMap = {
  small: 24,
  default: 32,
  large: 45,
} as const

/**
 * 获取图标尺寸
 * 根据当前的 size 返回对应的图标尺寸字符串
 */
const getIconSize = (): string => {
  const currentSize = props.size || 'default'
  return String(iconSizeMap[currentSize])
}

/**
 * 判断是否为表单模式
 */
const isFormMode = computed(() => {
  return !!(props.label || slots.label)
})

/**
 * 计算 item-width 样式
 */
const itemWidthStyle = computed(() => {
  return props.itemWidth ? ` --item-width: ${addUnit(props.itemWidth)};` : ''
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
        formRequired = rules[key].some((rule) => rule.required)
      }
    }
  }
  return props.required || props.rules.some((rule) => rule.required) || formRequired
})

/**
 * 记录原始 modelValue 的类型
 */
const isStringMode = computed(() => typeof props.modelValue === 'string')

/**
 * 将 modelValue 标准化为数组格式
 * 支持数组和字符串两种输入格式
 */
const normalizedValue = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue
  } else if (typeof props.modelValue === 'string') {
    // 字符串模式：保持所有值都是字符串类型，不进行类型转换
    return props.modelValue
      ? props.modelValue
          .split(props.separator)
          .map((item) => item.trim())
          .filter((item) => item !== '')
      : []
  }
  return []
})

/**
 * 获取标准化的数组值
 */
const getArrayValue = () => {
  return normalizedValue.value
}

/**
 * 判断选项是否被选中（用于 options 模式）
 * @param option 复选项配置
 */
const isOptionChecked = (option: CheckboxOption): boolean => {
  // 在字符串模式下，需要确保类型一致的比较
  if (isStringMode.value) {
    return normalizedValue.value.includes(String(option.value))
  } else {
    return normalizedValue.value.includes(option.value)
  }
}

/**
 * 判断选项是否被禁用（用于 options 模式）
 * @param option 复选项配置
 */
const isOptionDisabled = (option: CheckboxOption): boolean => {
  const isChecked = isOptionChecked(option)
  const { max, min, disabled } = props
  const currentLength = normalizedValue.value.length

  // 如果整个组件被禁用，则所有选项都禁用
  if (disabled) {
    return true
  }

  if (
    (max && currentLength >= max && !isChecked) ||
    (min && currentLength <= min && isChecked) ||
    option.disabled === true
  ) {
    return true
  }

  return option.disabled || false
}

/**
 * 获取选项的样式类
 * @param option 复选项配置
 * @param index 选项索引
 */
const getOptionClasses = (option: CheckboxOption, index: number): string => {
  const classes = [
    'wd-checkbox',
    isOptionChecked(option) ? 'is-checked' : '',
    index === 0 ? 'is-first-child' : '',
    index === props.options.length - 1 ? 'is-last-child' : '',
    props.inline ? 'is-inline' : '',
    props.shape === 'button' ? 'is-button' : '',
    isOptionDisabled(option) ? 'is-disabled' : '',
    props.size ? `is-${props.size}` : '',
  ]

  return classes.filter(Boolean).join(' ')
}

/**
 * 获取选项的内联样式
 */
const getOptionStyles = (): string => {
  const style: CSSProperties = {
    verticalAlign: 'top',
    boxSizing: 'border-box',
    marginBottom: '16rpx', // 添加底部间距避免换行挤压
  }

  // 如果设置了itemWidth，应用宽度样式
  if (props.itemWidth) {
    // 对于按钮模式，需要考虑padding和margin的影响
    if (props.shape === 'button') {
      style.width = `calc(${addUnit(props.itemWidth)} - 24rpx)` // 减去padding-right: 24rpx
      style.display = 'inline-flex'
    } else {
      // 其他模式（circle/square）
      style.width = addUnit(props.itemWidth)
      style.display = 'inline-block'
    }
  }

  return objToStyle(style)
}

/**
 * 处理选中状态变更
 * @param value 选项值
 */
const handleSelectStateChange = (value: string | number | boolean) => {
  const temp: (string | number | boolean)[] = [...normalizedValue.value]
  const index = temp.indexOf(value)

  if (index > -1) {
    // 已经选中，则从 value 列表中删除子节点的标识符
    temp.splice(index, 1)
  } else {
    // 之前未选中，则现在把加子节点的标识符加到 value 列表中
    temp.push(value)
  }

  // 根据原始 modelValue 的类型返回对应格式
  let result: Array<string | number | boolean> | string
  if (isStringMode.value) {
    // 字符串模式：将所有值转换为字符串后拼接
    result = temp.map((item) => String(item)).join(props.separator)
  } else {
    // 数组模式：直接返回数组
    result = temp
  }

  emit('update:modelValue', result)
  emit('change', result)
}

/**
 * 处理选项点击（用于 options 模式）
 * @param option 复选项配置
 */
const handleOptionClick = (option: CheckboxOption) => {
  // 检查是否被禁用
  if (isOptionDisabled(option)) return

  // 在字符串模式下，确保传递字符串类型的值
  const valueToChange = isStringMode.value ? String(option.value) : option.value

  // 更新选中状态
  handleSelectStateChange(valueToChange)
}

/**
 * 提供数据给子组件（仅在子组件模式下使用）
 */
linkChildren({
  props: {
    ...props,
    modelValue: normalizedValue.value,
  },
  changeSelectState: handleSelectStateChange,
  getArrayValue,
})

/**
 * 监听 modelValue 变化
 * 验证值的有效性
 */
watch(
  () => normalizedValue.value,
  (newValue) => {
    // 传入的value数组中包括重复的元素，这种情况非法
    if (new Set(newValue).size !== newValue.length) {
      console.error(`checkboxGroup's bound value includes same value`)
    }
    if (newValue.length < props.min) {
      console.error(`checkboxGroup's bound value's length can't be less than min`)
    }
    if (props.max !== 0 && newValue.length > props.max) {
      console.error(`checkboxGroup's bound value's length can't be large than max`)
    }
  },
  { deep: true, immediate: true },
)

/**
 * 监听 shape 属性变化
 * 验证 shape 的有效性
 */
watch(
  () => props.shape,
  (newValue) => {
    const validShapes = ['circle', 'square', 'button']
    if (newValue && !validShapes.includes(newValue)) {
      console.error(`shape must be one of ${validShapes.toString()}`)
    }
  },
  { deep: true, immediate: true },
)

/**
 * 监听 size 属性变化
 * 验证 size 的有效性
 */
watch(
  () => props.size,
  (newValue) => {
    const validSizes = ['default', 'small', 'large']
    if (newValue && !validSizes.includes(newValue)) {
      console.error(`size must be one of ${validSizes.toString()}`)
    }
  },
  { deep: true, immediate: true },
)

/**
 * 监听 min 属性变化
 * 验证 min 的有效性
 */
watch(
  () => props.min,
  (newValue) => {
    checkNumRange(newValue, 'min')
  },
  { deep: true, immediate: true },
)

/**
 * 监听 max 属性变化
 * 验证 max 的有效性
 */
watch(
  () => props.max,
  (newValue) => {
    checkNumRange(newValue, 'max')
  },
  { deep: true, immediate: true },
)
</script>

<style lang="scss">
// 引入外部样式文件
@import './../common/abstracts/_mixin.scss';
@import './../common/abstracts/variable.scss';

// 暗色主题样式
.wot-theme-dark {
  @include b(checkbox-group) {
    background-color: $-dark-background2;
  }

  @include b(checkbox) {
    @include e(shape) {
      background: transparent;
      border-color: $-checkbox-border-color;
      color: $-checkbox-check-color;
    }

    @include e(label) {
      color: $-dark-color;
    }

    @include when(disabled) {
      .wd-checkbox__shape {
        border-color: $-dark-color-gray;
        background: $-dark-background4;
      }

      .wd-checkbox__label {
        color: $-dark-color-gray;
      }

      :deep(.wd-checkbox__check) {
        color: $-dark-color-gray;
      }

      @include when(checked) {
        .wd-checkbox__shape {
          color: $-dark-color-gray;
        }

        .wd-checkbox__label {
          color: $-dark-color-gray;
        }
      }

      @include when(button) {
        .wd-checkbox__label {
          border-color: #c8c9cc;
          background: #3a3a3c;
          color: $-dark-color-gray;
        }

        @include when(checked) {
          .wd-checkbox__label {
            border-color: #c8c9cc;
            background: #3a3a3c;
            color: #c8c9cc;
          }
        }
      }
    }

    @include when(button) {
      .wd-checkbox__label {
        background-color: $-dark-background;
      }

      @include when(checked) {
        .wd-checkbox__label {
          background-color: $-dark-background2;
        }
      }
    }
  }
}

// 复选框组样式
@include b(checkbox-group) {
  background-color: $-checkbox-bg;
}

// 复选框样式
@include b(checkbox) {
  display: block;
  margin-bottom: $-checkbox-margin;
  font-size: 0;
  -webkit-tap-highlight-color: transparent;
  line-height: 1.2;

  // 统一宽度控制：所有模式都支持自定义宽度
  width: var(--item-width, auto);

  // 当设置了宽度时，改为inline-block以支持多行布局
  &[style*='--item-width'],
  .wd-checkbox-group[style*='--item-width'] & {
    display: inline-block;
    vertical-align: top;
  }

  @include when(last-child) {
    margin-bottom: 0;
  }

  @include e(shape) {
    position: relative;
    display: inline-block;
    width: $-checkbox-size;
    height: $-checkbox-size;
    border: 4rpx solid $-checkbox-border-color;
    border-radius: 50%;
    color: $-checkbox-check-color;
    background: $-checkbox-bg;
    vertical-align: middle;
    transition: background 0.2s;
    box-sizing: border-box;

    @include when(square) {
      border-radius: $-checkbox-square-radius;
    }
  }

  @include e(input) {
    position: absolute;
    width: 0;
    height: 0;
    margin: 0;
    opacity: 0;
  }

  @include edeep(btn-check) {
    display: inline-block;
    font-size: $-checkbox-icon-size;
    margin-right: 8rpx;
    vertical-align: middle;
  }

  @include e(txt) {
    display: inline-block;
    vertical-align: middle;
    line-height: 40rpx;
    @include lineEllipsis;
  }

  @include e(label) {
    position: relative;
    display: inline-block;
    margin-left: $-checkbox-label-margin;
    vertical-align: middle;
    font-size: $-checkbox-label-fs;
    color: $-checkbox-label-color;
  }

  @include edeep(check) {
    color: $-checkbox-check-color;
    font-size: $-checkbox-icon-size;
    opacity: 0;
    transition: opacity 0.2s;
  }

  @include when(checked) {
    .wd-checkbox__shape {
      color: $-checkbox-checked-color;
      background: currentColor;
      border-color: currentColor;
    }

    :deep(.wd-checkbox__check) {
      opacity: 1;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }

  @include when(button) {
    display: inline-block;
    margin-bottom: 0;
    margin-right: $-checkbox-margin;
    vertical-align: top;
    font-size: $-checkbox-button-font-size;

    @include when(last-child) {
      margin-right: 0;
    }

    .wd-checkbox__shape {
      width: 0;
      height: 0;
      overflow: hidden;
      opacity: 0;
      border: none;
    }

    .wd-checkbox__label {
      display: inline-flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      min-width: $-checkbox-button-min-width;
      height: $-checkbox-button-height;
      font-size: $-checkbox-button-font-size;
      margin-left: 0;
      padding: 10rpx 30rpx;
      border: 1rpx solid $-checkbox-button-border;
      background-color: $-checkbox-button-bg;
      border-radius: calc($-checkbox-button-height / 2);
      transition:
        color 0.2s,
        border 0.2s;
      box-sizing: border-box;
    }

    @include when(checked) {
      .wd-checkbox__label {
        color: $-checkbox-checked-color;
        background-color: $-checkbox-bg;
        border-color: $-checkbox-checked-color;
        border-color: currentColor;
      }
    }
  }

  @include when(inline) {
    display: inline-block;
    margin-bottom: 0;
    margin-right: $-checkbox-margin;

    @include when(last-child) {
      margin-right: 0;
    }
  }

  @include when(disabled) {
    .wd-checkbox__shape {
      border-color: $-checkbox-border-color;
      background: $-checkbox-disabled-check-bg;
    }

    .wd-checkbox__label {
      color: $-checkbox-disabled-label-color;
    }

    @include when(checked) {
      .wd-checkbox__shape {
        color: $-checkbox-disabled-check-color;
      }

      .wd-checkbox__label {
        color: $-checkbox-disabled-label-color;
      }
    }

    @include when(button) {
      .wd-checkbox__label {
        background: $-checkbox-disabled-color;
        border-color: $-checkbox-button-border;
        color: $-checkbox-disabled-label-color;
      }

      @include when(checked) {
        .wd-checkbox__label {
          border-color: $-checkbox-button-disabled-border;
        }
      }
    }
  }

  @include when(large) {
    .wd-checkbox__shape {
      width: $-checkbox-large-size;
      height: $-checkbox-large-size;
      font-size: $-checkbox-large-size;
    }

    .wd-checkbox__label {
      font-size: $-checkbox-large-label-fs;
    }
  }
}
</style>
