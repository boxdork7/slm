<!-- Radio 单选框 单选框，用于在一组备选项中进行单选。 -->
<template>
  <view
    :class="`wd-radio ${sizeValue ? `is-${sizeValue}` : ''} ${inlineValue ? 'is-inline' : ''} ${isChecked ? 'is-checked' : ''} ${shapeValue !== 'check' ? `is-${shapeValue}` : ''} ${disabledValue ? 'is-disabled' : ''} icon-placement-${iconPlacementValue} ${customClass}`"
    :style="`${getItemWidthStyle()}${customStyle}`"
    @click="handleClick"
  >
    <view
      class="wd-radio__label"
      :style="`${maxWidth ? `max-width: ${addUnit(maxWidth)};` : ''}${isChecked && shapeValue === 'button' && !disabledValue && checkedColorValue ? `color: ${checkedColorValue};` : ''}`"
    >
      <slot />
    </view>
    <view class="wd-radio__shape">
      <wd-icon v-if="shapeValue === 'check'" name="check" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import type { RadioIconPlacement, RadioShape } from '../wd-radio-group/wd-radio-group.vue'
import { computed, watch } from 'vue'
import { addUnit, getPropByPath, isDef, objToStyle } from '../common/util'
import { useParent } from '../composables/useParent'
import wdIcon from '../wd-icon/wd-icon.vue'
import { RADIO_GROUP_KEY } from '../wd-radio-group/wd-radio-group-key'

defineOptions({
  name: 'WdRadio',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 单选框组件属性接口
 */
interface WdRadioProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 选中时的值 */
  value: string | number | boolean
  /** 单选框的形状 */
  shape?: RadioShape
  /** 选中的颜色 */
  checkedColor?: string
  /** 禁用 */
  disabled?: boolean | null
  /** 大小，可选值：'default' | 'small' | 'large' */
  size?: 'default' | 'small' | 'large'
  /** 内联 */
  inline?: boolean | null
  /** 最大宽度 */
  maxWidth?: string
  /** 图标位置，可选值: 'left' | 'right' | 'auto' */
  iconPlacement?: RadioIconPlacement
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdRadioProps>(), {
  customStyle: '',
  customClass: '',
  disabled: null,
  size: 'default',
  inline: null,
})

// 获取父组件（RadioGroup）实例
const { parent: radioGroup } = useParent(RADIO_GROUP_KEY)

/**
 * 计算是否选中
 * 通过对比当前值和父组件的 modelValue 判断
 */
const isChecked = computed(() => {
  if (radioGroup) {
    return props.value === radioGroup.props.modelValue
  }
  return false
})

/**
 * 计算形状值
 * 优先使用自身的 shape，否则使用父组件的 shape
 */
const shapeValue = computed(() => {
  return props.shape || getPropByPath(radioGroup, 'props.shape') || 'check'
})

/**
 * 计算选中颜色值
 * 优先使用自身的 checkedColor，否则使用父组件的 checkedColor
 */
const checkedColorValue = computed(() => {
  return props.checkedColor || getPropByPath(radioGroup, 'props.checkedColor')
})

/**
 * 计算禁用状态
 * 优先使用自身的 disabled，否则使用父组件的 disabled
 */
const disabledValue = computed(() => {
  if (isDef(props.disabled)) {
    return props.disabled
  }
  return getPropByPath(radioGroup, 'props.disabled') || false
})

/**
 * 计算内联状态
 * 优先使用自身的 inline，否则使用父组件的 inline
 */
const inlineValue = computed(() => {
  if (isDef(props.inline)) {
    return props.inline
  }
  return getPropByPath(radioGroup, 'props.inline') || false
})

/**
 * 计算大小值
 * 优先使用自身的 size，否则使用父组件的 size，都没有则使用 'default'
 */
const sizeValue = computed(() => {
  return props.size || getPropByPath(radioGroup, 'props.size') || 'default'
})

/**
 * 计算图标位置
 * 优先使用自身的 iconPlacement，否则使用父组件的 iconPlacement
 */
const iconPlacementValue = computed<RadioIconPlacement>(() => {
  if (isDef(props.iconPlacement)) {
    return props.iconPlacement
  }
  return getPropByPath(radioGroup, 'props.iconPlacement') || 'auto'
})

/**
 * 获取 itemWidth 样式
 * 从父组件获取 itemWidth 设置
 */
const getItemWidthStyle = (): string => {
  const itemWidth = getPropByPath(radioGroup, 'props.itemWidth')
  if (!itemWidth) return ''

  const style: CSSProperties = {
    verticalAlign: 'top',
    boxSizing: 'border-box',
  }

  // 对于按钮模式，需要考虑padding和margin的影响
  if (shapeValue.value === 'button') {
    style.width = `calc(${addUnit(itemWidth)} - 24rpx)` // 减去margin-right: 20rpx + 4rpx
    style.display = 'inline-flex'
  } else {
    // 其他模式
    style.width = addUnit(itemWidth)
    style.display = 'inline-flex'
  }

  return objToStyle(style)
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
  { immediate: true },
)

/**
 * 监听 size 属性变化
 * 验证 size 的有效性
 */
watch(
  () => props.size,
  (newValue) => {
    const validSizes = ['default', 'small', 'large']
    if (isDef(newValue) && !validSizes.includes(newValue)) {
      console.error(`size must be one of ${validSizes.toString()}`)
    }
  },
  { immediate: true },
)

/**
 * 处理点击事件
 * 点击子元素，通知父元素触发change事件
 */
const handleClick = () => {
  const { value } = props
  if (!disabledValue.value && radioGroup && isDef(value)) {
    radioGroup.updateValue(value)
  }
}
</script>

<style lang="scss">
// 引入外部样式文件
@import './../common/abstracts/_mixin.scss';
@import './../common/abstracts/variable.scss';

// 暗色主题样式
.wot-theme-dark {
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

// 单选框样式
@include b(radio) {
  display: flex;
  margin-top: $-radio-margin;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  line-height: 1.2;
  margin-bottom: 16rpx;

  @include when(first) {
    margin-top: 0;
  }

  @include e(shape) {
    position: relative;
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
        height: $-radio-button-small-height;
        min-width: $-radio-button-small-min-width;
        padding: 6rpx 20rpx;
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
        border-color: $-radio-disabled-color;
        background: $-radio-disabled-color;
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
