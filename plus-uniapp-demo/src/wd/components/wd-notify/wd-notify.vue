<!-- Notify 消息通知 通知类组件，用于在页面顶部展示通知信息。 -->
<template>
  <wd-popup
    v-model="isVisible"
    :custom-class="customClass"
    :custom-style="popupCustomStyle"
    :position="currentPosition"
    :z-index="currentZIndex"
    :duration="250"
    :modal="false"
    @leave="handleAfterLeave"
    @enter="handleAfterEnter"
  >
    <view
      :class="`wd-notify ${customClass} wd-notify--${currentType}`"
      :style="`${currentColor ? `color: ${currentColor};` : ''}${currentBackground ? `background: ${currentBackground};` : ''}`"
      @click="handleClick"
    >
      <slot>{{ currentMessage }}</slot>
    </view>
  </wd-popup>
</template>

<script lang="ts" setup>
import { computed, ref, watch, nextTick, onMounted } from 'vue'
import { isDef, isFunction, addUnit, getRect, pxToRpx } from '../common/util'
import wdPopup from '../wd-popup/wd-popup.vue'
import { getNotifyOption } from './useNotify'

defineOptions({
  name: 'WdNotify',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 通知类型
 */
export type NotifyType = 'primary' | 'success' | 'danger' | 'warning'

/**
 * 位置类型
 */
type NotifyPosition = 'top' | 'bottom'

/**
 * Notify 配置选项接口
 */
export interface NotifyOptions {
  /** 类型，可选值为 primary success danger warning */
  type?: NotifyType
  /** 字体颜色 */
  color?: string
  /** 将组件的 z-index 层级设置为一个固定值 */
  zIndex?: number
  /** 展示文案，支持通过\n换行 */
  message?: string
  /** 展示时长(ms)，值为 0 时，notify 不会消失 */
  duration?: number
  /** 弹出位置，可选值为 top bottom */
  position?: NotifyPosition
  /** 顶部安全高度（rpx），当 autoSafeTop 为 false 时生效 */
  safeHeight?: number
  /** 背景颜色 */
  background?: string
  /** 是否显示 */
  visible?: boolean
  /** 是否自动计算安全距离（默认 true） */
  autoSafeTop?: boolean
  /** 额外的偏移量（rpx） */
  offsetTop?: number
  /** 点击回调函数 */
  onClick?: (event: MouseEvent) => void
  /** 完全关闭时的回调函数 */
  onClosed?: () => void
  /** 完全展示后的回调函数 */
  onOpened?: () => void
  /** 内部使用：Notify实例ID */
  _notifyId?: string
}

/**
 * Notify 组件属性接口
 */
interface WdNotifyProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string
  /** 选择器 */
  selector?: string
  /** 类型 */
  type?: NotifyType
  /** 字体颜色 */
  color?: string
  /** 层级 */
  zIndex?: number
  /** 是否显示 */
  visible?: boolean
  /** 展示文案 */
  message?: string
  /** 展示时长 */
  duration?: number
  /** 弹出位置 */
  position?: NotifyPosition
  /** 顶部安全高度（rpx），当 autoSafeTop 为 false 时生效 */
  safeHeight?: number
  /** 背景颜色 */
  background?: string
  /** 是否自动计算安全距离（默认 true） */
  autoSafeTop?: boolean
  /** 额外的偏移量（rpx） */
  offsetTop?: number
  /** 点击回调函数 */
  onClick?: (event: MouseEvent) => void
  /** 完全关闭时的回调函数 */
  onClosed?: () => void
  /** 完全展示后的回调函数 */
  onOpened?: () => void
}

// 导航栏默认净高度（不包含状态栏的部分）
const NAVBAR_DEFAULT_HEIGHT = 88 // rpx

// 组件属性定义
const props = withDefaults(defineProps<WdNotifyProps>(), {
  customStyle: '',
  customClass: '',
  selector: '',
  type: 'danger',
  color: '',
  zIndex: 1000,
  visible: false,
  message: '',
  duration: 3000,
  position: 'top',
  safeHeight: 0,
  background: '',
  autoSafeTop: true,
  offsetTop: 0,
})

// 获取 notify 选项
const notifyOption = getNotifyOption(props.selector)

// 控制显示状态
const isVisible = ref<boolean>(false)

// 计算的安全距离
const calculatedSafeTop = ref<number>(0)

// 计算属性：合并 props 和 notifyOption 的值
const currentType = computed(() =>
  isDef(notifyOption.value.type) ? notifyOption.value.type : props.type,
)

const currentColor = computed(() =>
  isDef(notifyOption.value.color) ? notifyOption.value.color : props.color,
)

const currentZIndex = computed(() =>
  isDef(notifyOption.value.zIndex) ? notifyOption.value.zIndex : props.zIndex,
)

const currentMessage = computed(() =>
  isDef(notifyOption.value.message) ? notifyOption.value.message : props.message,
)

const currentPosition = computed(() =>
  isDef(notifyOption.value.position) ? notifyOption.value.position : props.position,
)

const currentSafeHeight = computed(() =>
  isDef(notifyOption.value.safeHeight) ? notifyOption.value.safeHeight : props.safeHeight,
)

const currentBackground = computed(() =>
  isDef(notifyOption.value.background) ? notifyOption.value.background : props.background,
)

const currentAutoSafeTop = computed(() =>
  isDef(notifyOption.value.autoSafeTop) ? notifyOption.value.autoSafeTop : props.autoSafeTop,
)

const currentOffsetTop = computed(() =>
  isDef(notifyOption.value.offsetTop) ? notifyOption.value.offsetTop : props.offsetTop,
)

// 计算当前回调函数
const currentOnClick = computed(() =>
  isFunction(notifyOption.value.onClick) ? notifyOption.value.onClick : props.onClick,
)

const currentOnClosed = computed(() =>
  isFunction(notifyOption.value.onClosed) ? notifyOption.value.onClosed : props.onClosed,
)

const currentOnOpened = computed(() =>
  isFunction(notifyOption.value.onOpened) ? notifyOption.value.onOpened : props.onOpened,
)

/**
 * 计算安全的 top 距离
 * @returns Promise<number> 安全距离（rpx）
 */
const calculateSafeTop = async (): Promise<number> => {
  // 如果不自动计算，使用手动设置的安全高度
  if (!currentAutoSafeTop.value) {
    return currentSafeHeight.value + currentOffsetTop.value
  }

  const { statusBarHeight = 0 } = uni.getSystemInfoSync()
  const statusBarHeightRpx = pxToRpx(statusBarHeight)

  try {
    // 1. 尝试获取页面中的导航栏高度
    const navbarRect = await getRect('.wd-navbar', false)
    if (navbarRect && navbarRect.height && navbarRect.height > 0) {
      // 有导航栏：使用导航栏总高度
      const navbarTotalHeightRpx = pxToRpx(navbarRect.height)
      return navbarTotalHeightRpx + currentOffsetTop.value
    }
  } catch (error) {
    console.warn('获取导航栏高度失败，使用默认安全距离', error)
  }

  // 2. 没有导航栏：使用状态栏高度 + 导航栏净高度
  const safeTop = statusBarHeightRpx + NAVBAR_DEFAULT_HEIGHT + currentOffsetTop.value
  return safeTop
}

/**
 * 更新安全距离
 */
const updateSafeTop = async () => {
  try {
    calculatedSafeTop.value = await calculateSafeTop()
  } catch (error) {
    console.error('计算安全距离失败', error)
    // 降级方案：使用默认值
    const { statusBarHeight = 0 } = uni.getSystemInfoSync()
    calculatedSafeTop.value = pxToRpx(statusBarHeight) + NAVBAR_DEFAULT_HEIGHT + currentOffsetTop.value
  }
}

/**
 * 计算 popup 的自定义样式
 */
const popupCustomStyle = computed(() => {
  let style = props.customStyle || ''

  // 根据位置设置安全距离
  if (currentPosition.value === 'top') {
    style += `top: ${addUnit(calculatedSafeTop.value)} !important;`
  } else if (currentPosition.value === 'bottom') {
    // 底部位置可以添加底部安全距离
    const bottomSafe = currentSafeHeight.value || 100
    style += `bottom: ${addUnit(bottomSafe + currentOffsetTop.value)} !important;`
  }

  return style
})

/**
 * 监听 notifyOption 变化展示
 */
watch(
  () => notifyOption.value,
  (newVal: NotifyOptions) => {
    isVisible.value = isDef(newVal.visible) ? newVal.visible : false

    // 当显示状态变为 true 时，更新安全距离
    if (isVisible.value) {
      nextTick(() => {
        updateSafeTop()
      })
    }
  },
  {
    deep: true,
    immediate: true,
  },
)

/**
 * 监听自动安全距离设置变化
 */
watch(
  [currentAutoSafeTop, currentSafeHeight, currentOffsetTop],
  () => {
    if (isVisible.value) {
      updateSafeTop()
    }
  },
  { deep: true },
)

/**
 * 处理点击事件
 */
const handleClick = (event: MouseEvent) => {
  if (isFunction(currentOnClick.value)) {
    currentOnClick.value!(event)
  }
}

/**
 * 处理进入动画完成事件
 */
const handleAfterEnter = () => {
  if (isFunction(currentOnOpened.value)) {
    currentOnOpened.value!()
  }
}

/**
 * 处理离开动画完成事件
 */
const handleAfterLeave = () => {
  if (isFunction(currentOnClosed.value)) {
    currentOnClosed.value!()
  }
}

/**
 * 组件挂载时初始化安全距离
 */
onMounted(() => {
  updateSafeTop()
})
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// Notify 组件样式
@include b(notify) {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: $-notify-padding;
  font-size: $-notify-font-size;
  line-height: $-notify-line-height;
  color: $-notify-text-color;

  // allow newline character
  white-space: pre-wrap;
  text-align: center;
  word-wrap: break-word;

  // 过渡动画
  transition: transform 0.3s ease-in-out;

  // 主要样式
  @include m(primary) {
    background: $-notify-primary-background;
  }

  // 成功样式
  @include m(success) {
    background: $-notify-success-background;
  }

  // 危险样式
  @include m(danger) {
    background: $-notify-danger-background;
  }

  // 警告样式
  @include m(warning) {
    background: $-notify-warning-background;
  }
}
</style>
