<!-- 单选分组 -->
<template>
  <!-- 表单模式：有 label 时包装在 wd-cell 中 -->
  <wd-cell
    v-if="isFormMode"
    :title="label"
    :title-width="addUnit(labelWidth)"
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
    <!-- 表单模式下的单选框组内容 -->
    <view class="wd-radio-group" :style="itemWidthStyle">
      <!-- Options 模式：通过 options 数组渲染单选项 -->
      <template v-if="isOptionsMode">
        <view
          v-for="(option, index) in options"
          :key="String(option.value)"
          :class="getOptionClasses(option, index)"
          :style="getOptionStyles()"
          @click="handleOptionClick(option)"
        >
          <view
            class="wd-radio__label"
            :style="`${option.maxWidth ? `max-width: ${addUnit(option.maxWidth)};` : ''}${isOptionChecked(option) && shape === 'button' && !disabled && !option.disabled && checkedColor ? `color: ${checkedColor};` : ''}`"
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
          <view
            class="wd-radio__shape"
            :style="`${isOptionChecked(option) && !disabled && !option.disabled && checkedColor ? `color: ${checkedColor};` : ''}`"
          >
            <wd-icon
              v-if="shape === 'check'"
              :style="`${isOptionChecked(option) && !disabled && !option.disabled && checkedColor ? `color: ${checkedColor};` : ''}`"
              name="check"
            />
          </view>
        </view>
      </template>

      <!-- 子组件模式：使用 wd-radio 子组件 -->
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
    :class="`wd-radio-group ${customClass}`"
    :style="`${customStyle}${itemWidthStyle}`"
  >
    <!-- Options 模式：通过 options 数组渲染单选项 -->
    <template v-if="isOptionsMode">
      <view
        v-for="(option, index) in options"
        :key="String(option.value)"
        :class="getOptionClasses(option, index)"
        :style="getOptionStyles()"
        @click="handleOptionClick(option)"
      >
        <view
          class="wd-radio__label"
          :style="`${option.maxWidth ? `max-width: ${addUnit(option.maxWidth)};` : ''}${isOptionChecked(option) && shape === 'button' && !disabled && !option.disabled && checkedColor ? `color: ${checkedColor};` : ''}`"
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
        <view
          class="wd-radio__shape"
          :style="`${isOptionChecked(option) && !disabled && !option.disabled && checkedColor ? `color: ${checkedColor};` : ''}`"
        >
          <wd-icon
            v-if="shape === 'check'"
            :style="`${isOptionChecked(option) && !disabled && !option.disabled && checkedColor ? `color: ${checkedColor};` : ''}`"
            name="check"
          />
        </view>
      </view>
    </template>

    <!-- 子组件模式：使用 wd-radio 子组件 -->
    <slot v-else />
  </view>
</template>

<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import type { FormItemRule } from '../wd-form/wd-form.vue'
import { computed, useSlots, watch } from 'vue'
import { addUnit, objToStyle } from '../common/util'
import { useChildren } from '../composables/useChildren'
import { useParent } from '../composables/useParent'
import wdCell from '../wd-cell/wd-cell.vue'
import { FORM_KEY } from '../wd-form/wd-form-key'
import wdIcon from '../wd-icon/wd-icon.vue'
import { RADIO_GROUP_KEY } from './wd-radio-group-key'

defineOptions({
  name: 'WdRadioGroup',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 单选框形状类型
 */
export type RadioShape = 'dot' | 'button' | 'check'

/**
 * 图标位置类型
 */
export type RadioIconPlacement = 'left' | 'right' | 'auto'

/**
 * 单选框尺寸类型
 */
export type RadioSize = 'default' | 'small' | 'large'

/**
 * 单选项配置接口（用于 options 模式）
 */
export interface RadioOption {
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

  /** 自定义数据，选择时会传递 */
  [key: string]: any
}

/**
 * 单选框组组件属性接口
 */
interface WdRadioGroupProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 当前选中的值 */
  modelValue?: string | number | boolean
  /** 单选项配置列表（options 模式） */
  options?: RadioOption[]

  /** 单选框形状，可选值为 dot / button / check，默认为 check */
  shape?: RadioShape
  /** 选中的颜色，默认为 #4D80F0 */
  checkedColor?: string
  /** 是否禁用，默认为 false */
  disabled?: boolean
  /** 设置大小，可选值：default / small / large，默认为 default */
  size?: RadioSize
  /** 同行展示，默认为 false */
  inline?: boolean
  /** 图标位置，默认为 auto */
  iconPlacement?: RadioIconPlacement
  /** 每个单选框的宽度，支持百分比或固定值，如 '25%' '100px'，默认按钮模式为33.3333%，其他模式为auto */
  itemWidth?: string

  // 表单相关属性
  /** 设置左侧标题 */
  label?: string
  /** 设置左侧标题宽度 */
  labelWidth?: string | number
  /** 前置图标 */
  prefixIcon?: string
  /** 当有label属性时，设置标题和单选框垂直居中 */
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
 * 单选框组组件事件接口
 */
interface WdRadioGroupEmits {
  /** v-model 更新事件 */
  'update:modelValue': [value: string | number | boolean]
  /** 值变化时触发 */
  change: [value: string | number | boolean]
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdRadioGroupProps>(), {
  customStyle: '',
  customClass: '',
  options: () => [],
  shape: 'check',
  disabled: false,
  size: 'default',
  inline: false,
  iconPlacement: 'auto',
  center: false,
  vertical: false,
  required: false,
  rules: () => [],
  noBorder: false,
  customLabelClass: '',
  customIconClass: '',
})

// 定义组件事件
const emit = defineEmits<WdRadioGroupEmits>()

// 获取插槽
const slots = useSlots()

// 子组件管理（用于兼容 wd-radio 子组件模式）
const { linkChildren } = useChildren(RADIO_GROUP_KEY)

// 使用表单组合函数
const { parent: form } = useParent(FORM_KEY)

/**
 * 判断是否为表单模式
 */
const isFormMode = computed(() => {
  return !!(props.label || slots.label)
})

/**
 * 判断是否使用 options 模式
 * 当传入 options 数组且有内容时，使用 options 模式
 */
const isOptionsMode = computed(() => {
  return props.options && props.options.length > 0
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
 * 处理值更新
 * @param value 新的值
 */
const handleValueUpdate = (value: string | number | boolean) => {
  emit('update:modelValue', value)
  emit('change', value)
}

/**
 * 提供数据给子组件（仅在子组件模式下使用）
 */
linkChildren({
  props,
  updateValue: handleValueUpdate,
})

/**
 * 判断选项是否被选中（用于 options 模式）
 * @param option 单选项配置
 */
const isOptionChecked = (option: RadioOption): boolean => {
  return props.modelValue === option.value
}

/**
 * 获取选项的样式类
 * @param option 单选项配置
 * @param index 选项索引
 */
const getOptionClasses = (option: RadioOption, index: number): string => {
  const classes = [
    'wd-radio',
    props.size ? `is-${props.size}` : '',
    props.inline ? 'is-inline' : '',
    isOptionChecked(option) ? 'is-checked' : '',
    props.shape !== 'check' ? `is-${props.shape}` : '',
    props.disabled || option.disabled ? 'is-disabled' : '',
    index === 0 ? 'is-first' : '',
    `icon-placement-${props.iconPlacement}`,
  ]

  return classes.filter(Boolean).join(' ')
}

/**
 * 获取选项的内联样式
 */
const getOptionStyles = (): string => {
  if (!props.itemWidth) return ''

  const style: CSSProperties = {
    verticalAlign: 'top',
    boxSizing: 'border-box',
    marginBottom: '16rpx', // 添加底部间距避免换行挤压
  }

  // 对于按钮模式，需要考虑padding和margin的影响
  if (props.shape === 'button') {
    style.width = `calc(${addUnit(props.itemWidth)} - 24rpx)` // 减去margin-right: 20rpx + 4rpx
    style.display = 'inline-flex'
  } else {
    // 其他模式
    style.width = addUnit(props.itemWidth)
    style.display = 'inline-flex'
  }

  return objToStyle(style)
}

/**
 * 处理选项点击（用于 options 模式）
 * @param option 单选项配置
 */
const handleOptionClick = (option: RadioOption) => {
  // 检查是否被禁用
  if (props.disabled || option.disabled) return

  // 更新值
  handleValueUpdate(option.value)
}

/**
 * 监听 shape 属性变化
 * 验证 shape 的有效性
 */
watch(
  () => props.shape,
  (newValue) => {
    const validShapes = ['check', 'dot', 'button']
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
</script>

<style lang="scss">
// 引入外部样式文件
@import './../common/abstracts/_mixin.scss';
@import './../common/abstracts/variable.scss';

// 暗色主题样式
.wot-theme-dark {
  @include b(radio-group) {
    background-color: $-dark-background2;
  }

  @include b(radio) {
    @include e(shape) {
      background: transparent;
    }
    @include e(label) {
      color: $-dark-color;
    }
    @include when(button) {
      .wd-radio__label {
        background-color: $-dark-background;
      }
      @include when(checked) {
        .wd-radio__label {
          background-color: $-dark-background2;
        }
      }
    }

    @include when(disabled) {
      .wd-radio__label {
        color: $-dark-color-gray;
      }
      @include when(checked) {
        .wd-radio__label {
          color: $-dark-color-gray;
        }
      }

      @include when(button) {
        .wd-radio__label {
          border-color: #c8c9cc;
          background: #3a3a3c;
          color: $-dark-color-gray;
        }
        @include when(checked) {
          .wd-radio__label {
            border-color: #c8c9cc;
            background: #3a3a3c;
            color: #c8c9cc;
          }
        }
      }

      @include when(dot) {
        .wd-radio__shape {
          border-color: #c8c9cc;
          background: #3a3a3c;

          &::before {
            background-color: #c8c9cc;
          }
        }
      }
    }
  }
}

// 单选框组样式
@include b(radio-group) {
  background-color: $-radio-bg;
  font-size: 0;
}

// 单选框样式
@include b(radio) {
  display: flex;
  margin-top: $-radio-margin;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  line-height: 1.2;

  // 统一宽度控制：所有模式都支持自定义宽度
  width: var(--item-width, auto);

  // 当设置了宽度时，改为inline-flex以支持多行布局
  &[style*='--item-width'],
  .wd-radio-group[style*='--item-width'] & {
    display: inline-flex;
    vertical-align: top;
  }

  @include when(first) {
    margin-top: 0;
  }

  @include e(shape) {
    position: relative;
    display: inline-block;
    width: $-radio-size;
    height: $-radio-size;
    font-size: $-radio-size;
    color: transparent;
    display: none;
    vertical-align: middle;
    transition: background 0.2s;
  }

  @include e(input) {
    position: absolute;
    width: 0;
    height: 0;
    margin: 0;
    opacity: 0;
  }

  @include e(label) {
    display: inline-block;
    vertical-align: top;
    font-size: $-radio-label-fs;
    color: $-radio-label-color;
    line-height: 40rpx;
    word-break: break-all;
  }

  @include when(checked) {
    .wd-radio__shape {
      color: $-radio-checked-color;
      border-color: currentColor;
      display: inline-block;
    }
    .wd-radio__check {
      color: $-radio-checked-color;
      opacity: 1;
    }
  }

  @include when(dot) {
    .wd-radio__shape {
      border: 4rpx solid $-radio-dot-border-color;
      border-radius: 50%;
      position: relative;
      display: inline-block;
      box-sizing: border-box;
      transition: none;

      &::before {
        content: '';
        position: absolute;
        width: $-radio-dot-size;
        height: $-radio-dot-size;
        left: calc(50% - #{$-radio-dot-size / 2});
        top: calc(50% - #{$-radio-dot-size / 2});
        border-radius: 50%;
        background-color: #fff;
        transform: scale(0);
        transition: transform 0.2s ease-in;
      }
    }
    @include when(checked) {
      .wd-radio__shape {
        background-color: currentColor;
        border-color: currentColor;

        &::before {
          transform: scale(1);
        }
      }
    }
  }

  @include when(button) {
    display: inline-flex; // 保持 flex 布局
    margin-top: 0;
    margin-right: 20rpx;

    .wd-radio__shape {
      display: none;
    }
    .wd-radio__label {
      height: $-radio-button-height;
      min-width: $-radio-button-min-width;
      max-width: $-radio-button-max-width;
      padding: 10rpx 30rpx;
      margin-right: 0;
      border-radius: $-radio-button-radius;
      background-color: $-radio-button-bg;
      font-size: $-radio-button-fs;
      box-sizing: border-box;
      border: 1rpx solid $-radio-button-border;
      transition: all 0.2s;
      @include lineEllipsis;
    }
    @include when(checked) {
      .wd-radio__label {
        color: $-radio-checked-color;
        border-color: currentColor;
        background-color: $-radio-bg;
      }
    }

    // 按钮模式下的小尺寸样式
    @include when(small) {
      .wd-radio__label {
        height: $-radio-button-small-height!important;
        min-width: $-radio-button-small-min-width;
        padding: 4rpx 20rpx!important;
        font-size: $-radio-button-small-fs;
      }
    }

    // 按钮模式下的大尺寸样式
    @include when(large) {
      .wd-radio__label {
        height: $-radio-button-large-height;
        min-width: $-radio-button-large-min-width;
        padding: 14rpx 40rpx;
        font-size: $-radio-button-large-fs;
      }
    }
  }

  &.icon-placement-left {
    flex-direction: row-reverse;
  }

  @include when(inline) {
    display: inline-flex; // 保持 flex 布局
    margin-top: 0;
    margin-right: $-radio-margin;

    @include when(first) {
      margin-left: 0;
    }
    .wd-radio__shape {
      display: block;
      margin-right: 8rpx;
      float: left;

      &::after {
        content: '';
        display: table;
        clear: both;
      }
    }

    @include when(dot) {
      .wd-radio__shape {
        margin-top: 4rpx;
      }
      @include when(large) {
        .wd-radio__shape {
          margin-top: 0;
        }
      }
    }

    &.icon-placement-right {
      .wd-radio__shape {
        margin-right: 0;
        margin-left: 8rpx;
        float: right;
      }
    }
  }

  @include when(disabled) {
    .wd-radio__label {
      color: $-radio-disabled-label-color;
    }
    @include when(checked) {
      .wd-radio__shape {
        color: $-radio-disabled-label-color;
      }
      .wd-radio__check {
        color: $-radio-disabled-label-color;
      }
      .wd-radio__label {
        color: $-radio-disabled-label-color;
      }
    }

    @include when(button) {
      .wd-radio__label {
        background: $-radio-disabled-color;
        border-color: $-radio-button-border;
        color: $-radio-disabled-label-color;
      }
      @include when(checked) {
        .wd-radio__label {
          border-color: $-radio-button-disabled-border;
          background: $-radio-disabled-color;
        }
      }
    }

    @include when(dot) {
      .wd-radio__shape {
        background: $-radio-dot-disabled-bg;
        border-color: $-radio-dot-disabled-border;
      }
    }
  }

  // 非按钮模式下的大尺寸样式
  @include when(large) {
    .wd-radio__shape {
      width: $-radio-large-size;
      height: $-radio-large-size;
      font-size: $-radio-large-size;
    }
    .wd-radio__label {
      font-size: $-radio-large-label-fs;
    }

    @include when(dot) {
      .wd-radio__shape {
        &::before {
          width: $-radio-dot-large-size;
          height: $-radio-dot-large-size;
          left: calc(50% - #{$-radio-dot-large-size / 2});
          top: calc(50% - #{$-radio-dot-large-size / 2});
        }
      }
    }
  }

  // 非按钮模式下的小尺寸样式
  @include when(small) {
    .wd-radio__shape {
      width: $-radio-small-size;
      height: $-radio-small-size;
      font-size: $-radio-small-size;
    }
    .wd-radio__label {
      font-size: $-radio-small-label-fs;
    }

    @include when(dot) {
      .wd-radio__shape {
        &::before {
          width: $-radio-dot-small-size;
          height: $-radio-dot-small-size;
          left: calc(50% - #{$-radio-dot-small-size / 2});
          top: calc(50% - #{$-radio-dot-small-size / 2});
        }
      }
    }
  }
}
</style>
