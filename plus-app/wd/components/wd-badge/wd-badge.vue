<!-- Badge 徽标 出现在按钮、图标旁的数字或状态标记。 -->
<template>
  <view :class="`wd-badge ${customClass}`" :style="customStyle">
    <slot />
    <view
      v-if="shouldShowBadge"
      :class="`wd-badge__content is-fixed ${type ? `wd-badge__content--${type}` : ''} ${isDot ? 'is-dot' : ''}`"
      :style="`${bgColor ? `background-color: ${bgColor};` : ''} ${top ? `top: ${addUnit(top)};` : ''} ${right ? `right: ${addUnit(right)};` : ''}`"
    >
      {{ content }}
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { addUnit, isNumber } from '../common/util'

defineOptions({
  name: 'WdBadge',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 徽章类型
 */
export type BadgeType = 'primary' | 'success' | 'warning' | 'danger' | 'info'

/**
 * 徽章组件属性接口
 */
export interface WdBadgeProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 显示值 */
  modelValue?: string | number
  /** 当数值为 0 时，是否展示徽标 */
  showZero?: boolean
  /** 背景颜色 */
  bgColor?: string
  /** 最大值，超过最大值会显示 '{max}+'，要求 value 是 Number 类型 */
  max?: number
  /** 是否为红色点状标注 */
  isDot?: boolean
  /** 是否隐藏 badge */
  hidden?: boolean
  /** badge类型，可选值：primary / success / warning / danger / info */
  type?: BadgeType
  /** 为正时，角标向下偏移对应的像素 */
  top?: string | number
  /** 为正时，角标向左偏移对应的像素 */
  right?: string | number
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdBadgeProps>(), {
  customStyle: '',
  customClass: '',
  modelValue: '',
  showZero: false,
  isDot: false,
  hidden: false,
})

/**
 * 计算显示的内容
 * 根据是否为点状、最大值限制等条件计算最终显示内容
 */
const content = computed(() => {
  const { modelValue, max, isDot } = props

  // 点状徽章不显示内容
  if (isDot) return ''

  let value = modelValue

  // 处理最大值限制
  if (value && max && isNumber(value) && !Number.isNaN(value) && !Number.isNaN(max)) {
    value = max < value ? `${max}+` : value
  }

  return value
})

/**
 * 计算是否应该显示徽章
 * 根据隐藏状态、内容值、是否显示零值、是否为点状等条件判断
 */
const shouldShowBadge = computed(() => {
  if (props.hidden) return false

  return content.value || (content.value === 0 && props.showZero) || props.isDot
})
</script>

<style lang="scss">
// 引入外部样式文件
@import './../common/abstracts/_mixin.scss';
@import './../common/abstracts/variable.scss';

// 暗色主题样式
.wot-theme-dark {
  @include b(badge) {
    @include e(content) {
      border-color: $-dark-background2;
    }
  }
}

// 徽章组件样式
@include b(badge) {
  position: relative;
  vertical-align: middle;
  display: inline-block;

  // 内容区域样式
  @include e(content) {
    display: inline-block;
    box-sizing: content-box;
    height: $-badge-height;
    line-height: $-badge-height;
    padding: $-badge-padding;
    background-color: $-badge-bg;
    border-radius: calc($-badge-height / 2 + 4rpx);
    color: $-badge-color;
    font-size: $-badge-fs;
    text-align: center;
    white-space: nowrap;
    border: $-badge-border;
    font-weight: 500;

    // 固定定位样式
    @include when(fixed) {
      position: absolute;
      top: 0;
      right: 0;
      transform: translateY(-50%) translateX(50%);
    }

    // 点状样式
    @include when(dot) {
      height: $-badge-dot-size;
      width: $-badge-dot-size;
      padding: 0;
      border-radius: 50%;
    }

    // 主题色样式
    @each $type in (primary, success, warning, info, danger) {
      @include m($type) {
        @if $type == primary {
          background-color: $-badge-primary;
        } @else if $type == success {
          background-color: $-badge-success;
        } @else if $type == warning {
          background-color: $-badge-warning;
        } @else if $type == info {
          background-color: $-badge-info;
        } @else {
          background-color: $-badge-danger;
        }
      }
    }
  }
}
</style>
