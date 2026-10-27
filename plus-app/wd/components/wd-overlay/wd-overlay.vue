<!-- Overlay 遮罩层 创建一个遮罩层，用于强调特定的页面元素，并阻止用户进行其他操作。 -->
<template>
  <wd-transition
    :show="show"
    name="fade"
    custom-class="wd-overlay"
    :duration="duration"
    :custom-style="`z-index: ${zIndex}; ${customStyle}`"
    @click="handleClick"
    @touchmove.stop.prevent="lockScroll ? noop : ''"
  >
    <slot />
  </wd-transition>
</template>

<script lang="ts" setup>
// #ifdef H5
import { useLockScroll } from '../composables/useLockScroll'
// #endif
import wdTransition from '../wd-transition/wd-transition.vue'

defineOptions({
  name: 'WdOverlay',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 遮罩层组件属性接口
 */
interface WdOverlayProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 是否展示遮罩层 */
  show?: boolean
  /** 动画时长，单位毫秒，支持对象、数字或布尔值 */
  duration?: Record<string, number> | number | boolean
  /** 是否锁定滚动 */
  lockScroll?: boolean
  /** 层级，默认 100（高于 tabbar 的 99） */
  zIndex?: number
}

/**
 * 遮罩层组件事件接口
 */
interface WdOverlayEmits {
  /** 点击遮罩层时触发 */
  click: []
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdOverlayProps>(), {
  customStyle: '',
  customClass: '',
  show: false,
  duration: 300,
  lockScroll: true,
  zIndex: 100,
})

// 定义组件事件
const emit = defineEmits<WdOverlayEmits>()

/**
 * 处理点击事件
 * 触发点击事件
 */
const handleClick = () => {
  emit('click')
}

/**
 * 空函数
 * 用于阻止默认行为
 */
const noop = () => {}

// #ifdef H5
// 在 H5 环境下使用滚动锁定
useLockScroll(() => props.show && props.lockScroll)
// #endif
</script>

<style lang="scss">
// 引入外部样式文件
@import './../common/abstracts/_mixin.scss';
@import './../common/abstracts/variable.scss';

// 暗色主题样式
.wot-theme-dark {
  @include b(overlay) {
    background: $-overlay-bg-dark;
  }
}

// 遮罩层主体样式
@include b(overlay) {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: $-overlay-bg;
}
</style>
