<!-- Backtop 回到顶部 用于返回页面顶部的操作按钮。 -->
<template>
  <wd-transition :show="show" name="fade">
    <view
      :class="`wd-backtop ${customClass} is-${shape}`"
      :style="`z-index: ${zIndex}; bottom: ${addUnit(bottom)}; right: ${addUnit(right)}; ${customStyle}`"
      @click="handleBacktop"
    >
      <slot v-if="$slots.default" />
      <wd-icon
        v-else
        custom-class="wd-backtop__backicon"
        name="backtop"
        :custom-style="iconStyle"
      />
    </view>
  </wd-transition>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { addUnit } from '@/wd/components/common/util'
import wdIcon from '../wd-icon/wd-icon.vue'
import wdTransition from '../wd-transition/wd-transition.vue'

defineOptions({
  name: 'WdBacktop',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 形状类型
 */
export type BacktopShape = 'circle' | 'square'

/**
 * 回到顶部组件属性接口
 */
interface WdBacktopProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 页面滚动距离 */
  scrollTop: number
  /** 距离顶部多少距离时显示，单位rpx */
  top?: number
  /** 返回顶部滚动时间，单位ms */
  duration?: number
  /** 层级 */
  zIndex?: number
  /** icon自定义样式 */
  iconStyle?: string
  /** 形状，可选值：'circle' / 'square' */
  shape?: BacktopShape
  /** 距离屏幕底部距离，单位rpx */
  bottom?: number
  /** 距离屏幕右边距离，单位rpx */
  right?: number
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdBacktopProps>(), {
  customStyle: '',
  customClass: '',
  top: 600,
  duration: 100,
  zIndex: 99,
  iconStyle: '',
  shape: 'circle',
  bottom: 200,
  right: 40,
})

/**
 * 计算是否显示回到顶部按钮
 * 当页面滚动距离大于设定的top值时显示
 */
const show = computed(() => props.scrollTop > props.top)

/**
 * 处理回到顶部点击事件
 * 使用 uni.pageScrollTo 方法平滑滚动到页面顶部
 */
const handleBacktop = () => {
  uni.pageScrollTo({
    scrollTop: 0,
    duration: props.duration,
  })
}
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 回到顶部组件样式
@include b(backtop) {
  position: fixed;
  background-color: $-backtop-bg;
  width: 80rpx;
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  color: $-color-gray-8;

  // 图标样式
  @include edeep(backicon) {
    font-size: $-backtop-icon-size;
  }

  // 圆形样式
  @include when(circle) {
    border-radius: 50%;
  }

  // 方形样式
  @include when(square) {
    border-radius: 8rpx;
  }
}
</style>
