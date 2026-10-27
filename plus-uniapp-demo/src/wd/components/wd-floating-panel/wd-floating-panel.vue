<!-- FloatingPanel 浮动面板 浮动在页面底部的面板，用户可以通过上下拖动秒板来浏览内容，
从而在不离开当前视图的情况下访问更多信息，常用于地图导航。 -->
<template>
  <view
    :class="`wd-floating-panel ${customClass} ${safeAreaInsetBottom ? 'is-safe' : ''}`"
    :style="rootStyle"
    @touchstart.passive="handleTouchStart"
    @touchmove.passive="handleTouchMove"
    @touchend="handleTouchEnd"
    @touchcancel="handleTouchEnd"
  >
    <view class="wd-floating-panel__header">
      <view class="wd-floating-panel__header-bar" />
    </view>

    <scroll-view
      class="wd-floating-panel__content"
      data-id="content"
      :show-scrollbar="showScrollbar"
      scroll-y
      @touchmove.stop.prevent="handleTouchMove"
    >
      <slot />
    </scroll-view>
  </view>
</template>

<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import { computed, onBeforeMount, ref, watch } from 'vue'
import { addUnit, closest, objToStyle } from '../common/util'
import { useTouch } from '../composables/useTouch'

defineOptions({
  name: 'WdFloatingPanel',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 浮动面板组件属性接口
 */
interface WdFloatingPanelProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 面板的显示高度 */
  height?: number
  /** 设置自定义锚点，默认值 [100, windowHeight * 0.6] */
  anchors?: number[]
  /** 弹出面板是否设置底部安全距离（iphone X 类型的机型） */
  safeAreaInsetBottom?: boolean
  /** 是否显示滚动条 */
  showScrollbar?: boolean
  /** 动画时长，单位毫秒 */
  duration?: string | number
  /** 是否允许内容区容器拖拽 */
  contentDraggable?: boolean
}

/**
 * 浮动面板组件事件接口
 */
interface WdFloatingPanelEmits {
  /** 高度更新时触发 */
  'update:height': [value: number]
  /** 高度变化时触发 */
  'height-change': [data: { height: number }]
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdFloatingPanelProps>(), {
  customStyle: '',
  customClass: '',
  height: 0,
  anchors: () => [],
  safeAreaInsetBottom: false,
  showScrollbar: true,
  duration: 300,
  contentDraggable: true,
})

// 定义组件事件
const emit = defineEmits<WdFloatingPanelEmits>()

// 触摸手势处理
const touch = useTouch()

// 响应式数据
const heightValue = ref<number>(props.height)
const windowHeight = ref<number>(0)
const dragging = ref<boolean>(false)

// 常量定义
const DAMP = 0.2 // 阻尼系数
let startY: number // 起始位置

/**
 * 计算边界值
 * 包含最小高度和最大高度的边界限制
 */
const boundary = computed(() => ({
  min: props.anchors[0] ? props.anchors[0] : 100,
  max: props.anchors[props.anchors.length - 1]
    ? props.anchors[props.anchors.length - 1]
    : Math.round(windowHeight.value * 0.6),
}))

/**
 * 计算锚点数组
 * 如果自定义锚点少于2个，使用默认的最小值和最大值
 */
const anchors = computed(() =>
  props.anchors.length >= 2 ? props.anchors : [boundary.value.min, boundary.value.max],
)

/**
 * 计算根元素样式
 * 包含高度、变换、过渡动画等样式
 */
const rootStyle = computed(() => {
  const style: CSSProperties = {
    height: addUnit(boundary.value.max),
    transform: `translateY(calc(100% + ${addUnit(-heightValue.value)}))`,
    transition: !dragging.value
      ? `transform ${props.duration}ms cubic-bezier(0.18, 0.89, 0.32, 1.28)`
      : 'none',
  }

  return `${objToStyle(style)}${props.customStyle}`
})

/**
 * 更新面板高度
 * @param value 新的高度值
 */
const updateHeight = (value: number) => {
  heightValue.value = value
  emit('update:height', value)
}

/**
 * 监听 height 属性变化
 * 当 height 属性发生变化时，同步更新内部高度值
 */
watch(
  () => props.height,
  (value) => {
    heightValue.value = value
  },
)

/**
 * 监听边界值变化
 * 当边界值发生变化时，重新计算最接近的锚点高度
 */
watch(
  boundary,
  () => {
    updateHeight(closest(anchors.value, heightValue.value))
  },
  { immediate: true },
)

/**
 * 组件挂载前的处理
 * 获取窗口高度信息
 */
onBeforeMount(() => {
  const { windowHeight: _windowHeight } = uni.getSystemInfoSync()
  windowHeight.value = _windowHeight
})

/**
 * 处理触摸开始事件
 * 初始化拖拽状态和起始位置
 */
const handleTouchStart = (event: TouchEvent) => {
  touch.touchStart(event)
  dragging.value = true
  startY = -heightValue.value
}

/**
 * 缓动函数
 * 在边界外应用阻尼效果，提供更自然的拖拽体验
 * @param y 当前位置
 * @returns 应用缓动后的位置
 */
const ease = (y: number): number => {
  const absDistance = Math.abs(y)
  const { min, max } = boundary.value

  // 超出最大边界时应用阻尼
  if (absDistance > max) {
    return -(max + (absDistance - max) * DAMP)
  }

  // 低于最小边界时应用阻尼
  if (absDistance < min) {
    return -(min - (min - absDistance) * DAMP)
  }

  return y
}

/**
 * 处理触摸移动事件
 * 根据手势移动距离实时更新面板高度
 */
const handleTouchMove = (event: TouchEvent) => {
  const target = event.currentTarget as any

  // 如果是内容区域且不允许内容拖拽，则返回
  if (target.dataset.id === 'content') {
    if (!props.contentDraggable) return
  }

  touch.touchMove(event)
  const moveY = touch.deltaY.value + startY
  updateHeight(-ease(moveY))
}

/**
 * 处理触摸结束事件
 * 结束拖拽并吸附到最近的锚点
 */
const handleTouchEnd = () => {
  dragging.value = false
  updateHeight(closest(anchors.value, heightValue.value))

  // 如果高度发生了变化，触发高度变化事件
  if (heightValue.value !== -startY) {
    emit('height-change', { height: heightValue.value })
  }
}
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 暗色主题样式
.wot-theme-dark {
  @include b(floating-panel) {
    background: $-dark-background2;

    @include e(content) {
      background: $-dark-background2;
    }
  }
}

// 浮动面板主体样式
@include b(floating-panel) {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: $-floating-panel-z-index;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100vw;
  border-top-left-radius: $-floating-panel-radius;
  border-top-right-radius: $-floating-panel-radius;
  background-color: $-floating-panel-bg;
  touch-action: none;
  will-change: transform;

  // 安全区域适配
  @include when(safe) {
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }

  // 底部延伸背景
  &::after {
    position: absolute;
    bottom: -100vh;
    display: block;
    width: 100vw;
    height: 100vh;
    content: '';
    background-color: inherit;
  }

  // 头部区域样式
  @include e(header) {
    display: flex;
    justify-content: center;
    align-items: center;
    height: $-floating-panel-header-height;
    cursor: grab;
    user-select: none;

    // 拖拽指示条样式
    &-bar {
      width: $-floating-panel-bar-width;
      height: $-floating-panel-bar-height;
      background-color: $-floating-panel-bar-bg;
      border-radius: $-floating-panel-bar-radius;
    }
  }

  // 内容区域样式
  @include e(content) {
    flex: 1;
    min-width: 0;
    min-height: 0;
    background-color: $-floating-panel-content-bg;
  }
}
</style>
