<!-- Gap 间隔槽 一般用于页面布局时代替margin或者padding;或者充当（底部）占位元素。 -->
<template>
  <view
    :class="`wd-gap ${safeAreaBottom ? 'wd-gap--safe' : ''} ${customClass}`"
    :style="`${isDef(bgColor) ? `background: ${bgColor};` : ''}${isDef(height) ? `height: ${addUnit(height)};` : ''}${customStyle}`"
  />
</template>

<script lang="ts" setup>
import { addUnit, isDef } from '../common/util'

defineOptions({
  name: 'WdGap',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 间距组件属性接口
 */
interface WdGapProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 背景颜色 */
  bgColor?: string
  /** 是否开启底部安全区 */
  safeAreaBottom?: boolean
  /** 高度 */
  height?: string | number
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdGapProps>(), {
  customStyle: '',
  customClass: '',
  bgColor: 'transparent',
  safeAreaBottom: false,
  height: 15,
})
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 间距组件样式
@include b(gap) {
  // 底部安全区样式
  @include m(safe) {
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>
