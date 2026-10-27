<!-- Divider 分割线 用于将内容分隔为多个区域。 -->
<template>
  <view
    class="wd-divider"
    :class="{
      'is-dashed': dashed,
      'is-hairline': hairline,
      'wd-divider--vertical': vertical,
      'wd-divider--center':
        !vertical && contentPosition === 'center' && !!slots.default,
      'wd-divider--left': !vertical && contentPosition === 'left',
      'wd-divider--right': !vertical && contentPosition === 'right',
      [customClass]: !!customClass,
    }"
    :style="`${color ? `color: ${color};` : ''}${customStyle}`"
  >
    <slot v-if="!vertical" />
  </view>
</template>

<script lang="ts" setup>
import { useSlots } from 'vue'

defineOptions({
  name: 'WdDivider',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 分割线内容位置类型
 */
type DividerPosition = 'center' | 'left' | 'right'

/**
 * 分割线方向类型
 */
type DividerDirection = 'horizontal' | 'vertical'

/**
 * 分割线组件属性接口
 */
interface WdDividerProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 自定义颜色 */
  color?: string
  /** 内容位置，可选值为 'left' / 'right' / 'center' */
  contentPosition?: DividerPosition
  /** 是否显示为虚线 */
  dashed?: boolean
  /** 是否为垂直分割线 */
  vertical?: boolean
  /** 是否显示为 0.5px 的线 */
  hairline?: boolean
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdDividerProps>(), {
  customStyle: '',
  customClass: '',
  contentPosition: 'center',
  dashed: false,
  vertical: false,
  hairline: true,
})

// 获取插槽
const slots = useSlots()
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 暗色主题样式
.wot-theme-dark {
  @include b(divider) {
    color: $-dark-color3;

    @include e(line) {
      background: $-dark-color-gray;
    }
  }
}

// 分割线主体样式
@include b(divider) {
  position: relative;
  display: flex;
  padding: $-divider-padding;
  margin: $-divider-margin;
  align-items: center;
  color: $-divider-color;
  font-size: $-divider-fs;

  // 前后伪元素（分割线）
  &::after,
  &::before {
    flex: 1;
    display: block;
    box-sizing: border-box;
    border-style: solid;
    border-color: $-divider-line-color;
    border-width: $-divider-line-height 0 0;
  }

  &::before {
    content: '';
  }

  // 内容位置修饰符
  @include m(center, left, right) {
    &::after {
      content: '';
      margin-left: $-divider-content-left-margin;
    }

    &::before {
      margin-right: $-divider-content-right-margin;
    }
  }

  // 左对齐样式
  @include m(left) {
    &::before {
      max-width: $-divider-content-left-width;
    }
  }

  // 右对齐样式
  @include m(right) {
    &::after {
      max-width: $-divider-content-right-width;
    }
  }

  // 细线样式
  @include when(hairline) {
    &::before,
    &::after {
      transform: scaleY(0.5);
    }
  }

  // 虚线样式
  @include when(dashed) {
    &::before,
    &::after {
      border-style: dashed;
    }
  }

  // 垂直分割线样式
  @include m(vertical) {
    display: inline-block;
    width: $-divider-vertical-line-width;
    height: $-divider-vertical-height;
    margin: $-divider-vertical-content-margin;
    padding: 0;
    vertical-align: middle;

    &::before {
      height: 100%;
      border-width: 0 0 0 $-divider-vertical-line-width;
    }

    &::after {
      display: none;
    }

    // 垂直细线样式
    @include when(hairline) {
      &::before {
        transform: scaleX(0.5);
      }
    }
  }
}
</style>
