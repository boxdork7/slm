<!-- Toast 轻提示 轻提示组件，用于消息通知、加载提示、操作结果提示等场景，支持函数式调用。 -->
<template>
  <wd-overlay
    v-if="cover"
    :z-index="zIndex"
    lock-scroll
    :show="show"
    custom-style="background-color: transparent;pointer-events: auto;"
  />
  <wd-transition
    name="fade"
    :show="show"
    :custom-style="transitionStyle"
    @after-enter="handleAfterEnter"
    @after-leave="handleAfterLeave"
  >
    <view :class="rootClass">
      <!-- iconName优先级更高 -->
      <wd-loading
        v-if="iconName === 'loading'"
        :type="loadingType"
        :color="loadingColor"
        :size="loadingSize"
        :custom-class="`wd-toast__icon ${direction === 'vertical' ? 'is-vertical' : ''}`"
      />
      <!-- 内置图标（成功、警告、信息、错误） -->
      <view
        v-else-if="
          iconName === 'success' ||
          iconName === 'warning' ||
          iconName === 'info' ||
          iconName === 'error'
        "
        :class="`wd-toast__iconWrap wd-toast__icon ${direction === 'vertical' ? 'is-vertical' : ''}`"
      >
        <view class="wd-toast__iconBox">
          <view class="wd-toast__iconSvg" :style="svgStyle" />
        </view>
      </view>
      <!-- 自定义图标 -->
      <wd-icon
        v-else-if="iconClass"
        :custom-class="`wd-toast__icon ${direction === 'vertical' ? 'is-vertical' : ''}`"
        :size="iconSize"
        :class-prefix="classPrefix"
        :name="iconClass"
      />
      <!-- 消息文本 -->
      <view v-if="msg" class="wd-toast__msg">
        {{ msg }}
      </view>
    </view>
  </wd-transition>
</template>

<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import { computed, onBeforeMount, ref, watch } from 'vue'
import { encode } from '../common/base64'
import { addUnit, isDef, isFunction, objToStyle } from '../common/util'
import wdIcon from '../wd-icon/wd-icon.vue'
import wdLoading from '../wd-loading/wd-loading.vue'
import wdOverlay from '../wd-overlay/wd-overlay.vue'
import wdTransition from '../wd-transition/wd-transition.vue'
import { getToastOption } from './useToast'

defineOptions({
  name: 'WdToast',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 图标类型
 */
type ToastIconType = 'success' | 'error' | 'warning' | 'loading' | 'info' | ''

/**
 * 位置类型
 */
type ToastPositionType = 'top' | 'middle-top' | 'middle' | 'bottom'

/**
 * 排列方向类型
 */
type ToastDirection = 'vertical' | 'horizontal'

/**
 * 加载类型
 */
type ToastLoadingType = 'outline' | 'ring'

/**
 * Toast 配置选项接口
 */
export interface ToastOptions {
  /** 提示信息 */
  msg?: string
  /** 显示时长，单位ms */
  duration?: number
  /** 排列方向 */
  direction?: ToastDirection
  /** 图标名称 */
  iconName?: ToastIconType
  /** 图标大小 */
  iconSize?: number
  /** 加载类型 */
  loadingType?: ToastLoadingType
  /** 加载颜色 */
  loadingColor?: string
  /** 加载大小 */
  loadingSize?: number
  /** 图标颜色 */
  iconColor?: string
  /** 位置 */
  position?: ToastPositionType
  /** 是否显示 */
  show?: boolean
  /** 层级 */
  zIndex?: number
  /** 是否存在遮罩层 */
  cover?: boolean
  /** 图标类名 */
  iconClass?: string
  /** 类名前缀，用于使用自定义图标 */
  classPrefix?: string
  /** 完全展示后的回调函数 */
  opened?: () => void
  /** 完全关闭时的回调函数 */
  closed?: () => void
  /** 内部使用：Y轴偏移量 */
  _offsetY?: number
  /** 内部使用：Toast实例ID */
  _toastId?: string
}

/**
 * Toast 实例接口
 */
export interface Toast {
  /** 打开Toast */
  show: (toastOptions: ToastOptions | string) => void

  /** 成功提示 */
  success: (toastOptions: ToastOptions | string) => void

  /** 错误提示 */
  error: (toastOptions: ToastOptions | string) => void

  /** 常规提示 */
  info: (toastOptions: ToastOptions | string) => void

  /** 警告提示 */
  warning: (toastOptions: ToastOptions | string) => void

  /** 加载提示 */
  loading: (toastOptions: ToastOptions | string) => void

  /** 关闭Toast */
  close: () => void
}

/**
 * Toast 组件属性接口
 */
interface WdToastProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string
  /** 选择器 */
  selector?: string
  /** 提示信息 */
  msg?: string
  /** 排列方向 */
  direction?: ToastDirection
  /** 图标名称 */
  iconName?: ToastIconType
  /** 图标大小 */
  iconSize?: number
  /** 加载类型 */
  loadingType?: ToastLoadingType
  /** 加载颜色 */
  loadingColor?: string
  /** 加载大小 */
  loadingSize?: number
  /** 图标颜色 */
  iconColor?: string
  /** 位置 */
  position?: ToastPositionType
  /** 层级 */
  zIndex?: number
  /** 是否存在遮罩层 */
  cover?: boolean
  /** 图标类名 */
  iconClass?: string
  /** 类名前缀 */
  classPrefix?: string
  /** 完全展示后的回调函数 */
  opened?: () => void
  /** 完全关闭时的回调函数 */
  closed?: () => void
}

// 组件属性定义
const props = withDefaults(defineProps<WdToastProps>(), {
  customStyle: '',
  customClass: '',
  selector: '',
  msg: '',
  direction: 'horizontal',
  iconName: '',
  loadingType: 'outline',
  loadingColor: '#4D80F0',
  loadingSize: 45,
  position: 'middle-top',
  zIndex: 1000,
  cover: false,
  iconClass: '',
  classPrefix: 'wd-icon',
})

// 🔥 使用统一的 getToastOption 方法，确保同一个 selector 对应唯一实例
const toastOption = getToastOption(props.selector)

// 响应式数据
const iconName = ref<string>('')
const msg = ref<string>('')
const position = ref<string>('middle')
const show = ref<boolean>(false)
const zIndex = ref<number>(1000)
const loadingType = ref<ToastLoadingType>('outline')
const loadingColor = ref<string>('#4D80F0')
const iconSize = ref<string>()
const loadingSize = ref<string>()
const svgStr = ref<string>('')
const cover = ref<boolean>(false)
const classPrefix = ref<string>('wd-icon')
const iconClass = ref<string>('')
const direction = ref<ToastDirection>('horizontal')

// 回调函数
let opened: (() => void) | null = null
let closed: (() => void) | null = null

/**
 * Toast 图标 SVG 字符串
 */
const toastIcon = {
  success(): string {
    return '<svg width="42px" height="42px" viewBox="0 0 42 42" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>成功</title><desc>Created with Sketch.</desc><defs><filter x="-63.2%" y="-80.0%" width="226.3%" height="260.0%" filterUnits="objectBoundingBox" id="filter-1"><feOffset dx="0" dy="2" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset><feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur><feColorMatrix values="0 0 0 0 0.122733141   0 0 0 0 0.710852582   0 0 0 0 0.514812768  0 0 0 1 0" type="matrix" in="shadowBlurOuter1" result="shadowMatrixOuter1"></feColorMatrix><feMerge><feMergeNode in="shadowMatrixOuter1"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter><rect id="path-2" x="3.4176226" y="5.81442199" width="3" height="8.5" rx="1.5"></rect><linearGradient x1="50%" y1="0.126649064%" x2="50%" y2="100%" id="linearGradient-4"><stop stop-color="#ACFFBD" stop-opacity="0.208123907" offset="0%"></stop><stop stop-color="#10B87C" offset="100%"></stop></linearGradient></defs><g id="规范" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="反馈-轻提示" transform="translate(-388.000000, -538.000000)"><g id="成功" transform="translate(388.000000, 538.000000)"><circle id="Oval" fill="#34D19D" opacity="0.400000006" cx="21" cy="21" r="20"></circle><circle id="Oval" fill="#34D19D" cx="21" cy="21" r="16"></circle><g id="Group-6" filter="url(#filter-1)" transform="translate(11.500000, 14.000000)"><mask id="mask-3" fill="white"><use xlink:href="#path-2"></use></mask><use id="Rectangle-Copy-24" fill="#C4FFEB" transform="translate(4.917623, 10.064422) rotate(-45.000000) translate(-4.917623, -10.064422) " xlink:href="#path-2"></use><rect id="Rectangle" fill="url(#linearGradient-4)" mask="url(#mask-3)" transform="translate(6.215869, 11.372277) rotate(-45.000000) translate(-6.215869, -11.372277) " x="4.71586891" y="9.52269089" width="3" height="3.69917136"></rect><rect id="Rectangle" fill="#FFFFFF" transform="translate(11.636236, 7.232744) scale(1, -1) rotate(-45.000000) translate(-11.636236, -7.232744) " x="10.1362361" y="-1.02185365" width="3" height="16.5091951" rx="1.5"></rect></g></g></g></g></svg>'
  },
  warning(): string {
    return '<svg width="42px" height="42px" viewBox="0 0 42 42" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>警告</title><desc>Created with Sketch.</desc> <defs> <filter x="-240.0%" y="-60.0%" width="580.0%" height="220.0%" filterUnits="objectBoundingBox" id="filter-1"><feOffset dx="0" dy="2" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset><feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur><feColorMatrix values="0 0 0 0 0.824756567   0 0 0 0 0.450356612   0 0 0 0 0.168550194  0 0 0 1 0" type="matrix" in="shadowBlurOuter1" result="shadowMatrixOuter1"></feColorMatrix><feMerge><feMergeNode in="shadowMatrixOuter1"></feMergeNode> <feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter></defs><g id="规范" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="反馈-轻提示" transform="translate(-580.000000, -538.000000)"> <g id="警告" transform="translate(580.000000, 538.000000)"><circle id="Oval" fill="#F0883A" opacity="0.400000006" cx="21" cy="21" r="20"></circle><circle id="Oval" fill="#F0883A" cx="21" cy="21" r="16"></circle><g id="Group-6" filter="url(#filter-1)" transform="translate(18.500000, 10.800000)"><rect id="Rectangle" fill="#FFFFFF" transform="translate(2.492935, 7.171583) scale(1, -1) rotate(-360.000000) translate(-2.492935, -7.171583) " x="0.992934699" y="0.955464537" width="3" height="12.4322365" rx="1.5"></rect><rect id="Rectangle-Copy-25" fill="#FFDEC5" transform="translate(2.508751, 17.202636) scale(1, -1) rotate(-360.000000) translate(-2.508751, -17.202636) " x="1.00875134" y="15.200563" width="3" height="4.00414639" rx="1.5"></rect></g></g></g></g></svg>'
  },
  info(): string {
    return '<svg width="42px" height="42px" viewBox="0 0 42 42" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>常规</title><desc>Created with Sketch.</desc><defs><filter x="-300.0%" y="-57.1%" width="700.0%" height="214.3%" filterUnits="objectBoundingBox" id="filter-1"><feOffset dx="0" dy="2" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset><feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur><feColorMatrix values="0 0 0 0 0.362700096   0 0 0 0 0.409035039   0 0 0 0 0.520238904  0 0 0 1 0" type="matrix" in="shadowBlurOuter1" result="shadowMatrixOuter1"></feColorMatrix><feMerge><feMergeNode in="shadowMatrixOuter1"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter></defs><g id="规范" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="反馈-轻提示" transform="translate(-772.000000, -538.000000)"><g id="常规" transform="translate(772.000000, 538.000000)"><circle id="Oval" fill="#909CB7" opacity="0.4" cx="21" cy="21" r="20"></circle><circle id="Oval" fill="#909CB7" cx="21" cy="21" r="16"></circle><g id="Group-6" filter="url(#filter-1)" transform="translate(18.500000, 9.800000)"><g id="编组-2" transform="translate(2.492935, 10.204709) rotate(-180.000000) translate(-2.492935, -10.204709) translate(0.992935, 0.204709)"><rect id="Rectangle" fill="#FFFFFF" transform="translate(1.500000, 7.000000) scale(1, -1) rotate(-360.000000) translate(-1.500000, -7.000000) " x="0" y="0" width="3" height="14" rx="1.5"></rect><rect id="Rectangle-Copy-25" fill="#EEEEEE" transform="translate(1.500000, 18.000000) scale(1, -1) rotate(-360.000000) translate(-1.500000, -18.000000) " x="0" y="16" width="3" height="4" rx="1.5"></rect></g></g></g></g></g></svg>'
  },
  error(): string {
    return '<svg width="42px" height="42px" viewBox="0 0 42 42" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>toast</title><desc>Created with Sketch.</desc><defs><linearGradient x1="99.6229896%" y1="50.3770104%" x2="0.377010363%" y2="50.3770104%" id="linearGradient-1"><stop stop-color="#FFDFDF" offset="0%"></stop><stop stop-color="#F9BEBE" offset="100%"></stop></linearGradient><linearGradient x1="0.377010363%" y1="50.3770104%" x2="99.6229896%" y2="50.3770104%" id="linearGradient-2"><stop stop-color="#FFDFDF" offset="0%"></stop><stop stop-color="#F9BEBE" offset="100%"></stop></linearGradient></defs><g id="规范" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="反馈-轻提示" transform="translate(-196.000000, -538.000000)"> <g id="toast" transform="translate(196.000000, 538.000000)"><circle id="Oval" fill="#FA4350" opacity="0.400000006" cx="21" cy="21" r="20"></circle><circle id="Oval" fill="#FA4350" opacity="0.900000036" cx="21" cy="21" r="16"></circle><rect id="矩形" fill="#FFDFDF" transform="translate(21.071068, 21.071068) rotate(-225.000000) translate(-21.071068, -21.071068) " x="12.5710678" y="19.5710678" width="17" height="3" rx="1.5"></rect><rect id="矩形" fill="url(#linearGradient-1)" transform="translate(19.303301, 22.838835) rotate(-225.000000) translate(-19.303301, -22.838835) " x="17.3033009" y="21.3388348" width="4" height="3"></rect><rect id="矩形" fill="url(#linearGradient-2)" transform="translate(22.838835, 19.303301) rotate(-225.000000) translate(-22.838835, -19.303301) " x="20.8388348" y="17.8033009" width="4" height="3"></rect><rect id="矩形" fill="#FFFFFF" transform="translate(21.071068, 21.071068) rotate(-315.000000) translate(-21.071068, -21.071068) " x="12.5710678" y="19.5710678" width="17" height="3" rx="1.5"></rect></g></g></g></svg>'
  },
}

/**
 * 合并选项与属性
 */
const mergeOptionsWithProps = (option: ToastOptions, props: WdToastProps) => {
  iconName.value = isDef(option.iconName) ? option.iconName! : props.iconName!
  iconClass.value = isDef(option.iconClass) ? option.iconClass! : props.iconClass!
  msg.value = isDef(option.msg) ? option.msg! : props.msg!
  position.value = isDef(option.position) ? option.position! : props.position!
  zIndex.value = isDef(option.zIndex) ? option.zIndex! : props.zIndex!
  loadingType.value = isDef(option.loadingType) ? option.loadingType! : props.loadingType!
  loadingColor.value = isDef(option.loadingColor) ? option.loadingColor! : props.loadingColor!
  iconSize.value = isDef(option.iconSize)
    ? addUnit(option.iconSize)
    : isDef(props.iconSize)
      ? addUnit(props.iconSize)
      : undefined
  loadingSize.value = isDef(option.loadingSize)
    ? addUnit(option.loadingSize)
    : isDef(props.loadingSize)
      ? addUnit(props.loadingSize)
      : undefined
  cover.value = isDef(option.cover) ? option.cover! : props.cover!
  classPrefix.value = isDef(option.classPrefix) ? option.classPrefix! : props.classPrefix!
  direction.value = isDef(option.direction) ? option.direction! : props.direction!
  closed = isFunction(option.closed)
    ? option.closed
    : isFunction(props.closed)
      ? props.closed
      : null
  opened = isFunction(option.opened)
    ? option.opened
    : isFunction(props.opened)
      ? props.opened
      : null
}
/**
 * 重置 toast 选项值
 */
const reset = (option: ToastOptions) => {
  show.value = isDef(option.show) ? option.show : false

  if (show.value) {
    mergeOptionsWithProps(option, props)
  }
}

/**
 * 监听 toastOption 变化展示
 */
watch(
  () => toastOption.value,
  (newVal: ToastOptions) => {
    reset(newVal)
  },
  {
    deep: true,
    immediate: true,
  },
)

/**
 * 构建 SVG 图标
 */
const buildSvg = () => {
  if (!['success', 'warning', 'info', 'error'].includes(iconName.value)) return

  const iconSvg = toastIcon[iconName.value as keyof typeof toastIcon]()
  svgStr.value = `"data:image/svg+xml;base64,${encode(iconSvg)}"`
}

/**
 * 监听 iconName 变化构建 SVG
 */
watch(
  () => iconName.value,
  () => {
    buildSvg()
  },
  { deep: true, immediate: true },
)

/**
 * 计算过渡动画自定义样式
 */
const transitionStyle = computed(() => {
  const offsetY = toastOption.value._offsetY || 0
  const style: CSSProperties = {
    zIndex: zIndex.value,
    position: 'fixed',
    top: '50%',
    left: 0,
    width: '100%',
    transform: `translate(0, calc(-50% + ${offsetY}px))`,
    textAlign: 'center',
    pointerEvents: 'none',
    transition: 'transform 0.3s ease-in-out',
  }
  return objToStyle(style)
})

/**
 * 计算根元素类名
 */
const rootClass = computed(() => {
  const hasIcon = (iconName.value !== 'loading' || msg.value) && (iconName.value || iconClass.value)
  const isLoading = iconName.value === 'loading' && !msg.value
  const isVertical = direction.value === 'vertical'

  return `wd-toast ${props.customClass} wd-toast--${position.value} ${
    hasIcon ? 'wd-toast--with-icon' : ''
  } ${isLoading ? 'wd-toast--loading' : ''} ${isVertical ? 'is-vertical' : ''}`
})

/**
 * 计算 SVG 图标样式
 */
const svgStyle = computed(() => {
  const style: CSSProperties = {
    backgroundImage: `url(${svgStr.value})`,
  }

  if (isDef(iconSize.value)) {
    style.width = iconSize.value
    style.height = iconSize.value
  }

  return objToStyle(style)
})

/**
 * 组件挂载前构建 SVG
 */
onBeforeMount(() => {
  buildSvg()
})

/**
 * 处理进入动画完成事件
 */
const handleAfterEnter = () => {
  if (isFunction(opened)) {
    opened()
  }
}

/**
 * 处理离开动画完成事件
 */
const handleAfterLeave = () => {
  if (isFunction(closed)) {
    closed()
  }
}
</script>

<style lang="scss">
// 引入外部样式文件
@import './../common/abstracts/_mixin.scss';
@import './../common/abstracts/variable.scss';

// Toast 组件样式
@include b(toast) {
  display: inline-block;
  max-width: $-toast-max-width;
  padding: $-toast-padding;
  background-color: $-toast-bg;
  border-radius: $-toast-radius;
  color: $-toast-color;
  transition: all 0.2s;
  font-size: $-toast-fs;
  box-sizing: border-box;
  box-shadow: $-toast-box-shadow;

  // 垂直布局样式
  @include when(vertical) {
    flex-direction: column;
  }

  // 消息文本样式
  @include e(msg) {
    font-size: $-toast-fs;
    word-break: break-all;
    line-height: $-toast-line-height;
    text-align: left;
    font-family:
      'San Francisco', Rotobo, arial, 'PingFang SC', 'Noto SansCJK', 'Microsoft Yahei', sans-serif;
  }

  // 图标样式
  @include edeep(icon) {
    display: inline-block;
    margin-right: $-toast-icon-margin-right;
    font-size: $-toast-icon-size;

    @include when(vertical) {
      margin-right: 0;
      margin-bottom: $-toast-icon-margin-bottom;
    }
  }

  // 图标包装器样式
  @include e(iconWrap) {
    font-size: 0;
    line-height: 0;
    vertical-align: middle;
  }

  // 图标盒子样式
  @include e(iconBox) {
    display: block;
    width: 100%;
    height: 100%;
  }

  // SVG 图标样式
  @include e(iconSvg) {
    width: $-toast-icon-size;
    height: $-toast-icon-size;
    background-size: cover;
    background-repeat: no-repeat;
  }

  // 加载图标样式
  @include e(loading) {
    margin-bottom: $-toast-loading-margin-bottom;
    display: inline-block;
  }

  // 位置修饰符样式
  @include m(top) {
    transform: translate3d(0, -40vh, 0);
  }

  @include m(middle-top) {
    transform: translate3d(0%, -18.8vh, 0);
  }

  @include m(bottom) {
    transform: translate3d(0, 40vh, 0);
  }

  // 带图标样式
  @include m(with-icon) {
    min-width: $-toast-with-icon-min-width;
    display: inline-flex;
    align-items: center;
  }

  // 加载状态样式
  @include m(loading) {
    min-width: auto;
    padding: $-toast-loading-padding;
  }
}
</style>
