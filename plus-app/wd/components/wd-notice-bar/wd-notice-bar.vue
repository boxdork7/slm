<!-- NoticeBar 通知栏 通知栏组件，用于在页面顶部展示通知提醒。 -->
<template>
  <view
    v-if="show"
    :class="`wd-notice-bar ${customClass} ${type ? `is-${type}` : ''} ${isHorizontal ? (!wrapable && !scrollable ? 'wd-notice-bar--ellipse' : '') : 'wd-notice-bar--ellipse'} ${wrapable && !scrollable ? 'wd-notice-bar--wrap' : ''}`"
    :style="`${isDef(color) ? `color: ${color};` : ''}${isDef(backgroundColor) ? `background: ${backgroundColor};` : ''}${customStyle}`"
  >
    <wd-icon v-if="prefix" custom-class="wd-notice-bar__prefix" :name="prefix" />
    <slot v-else name="prefix" />
    <view class="wd-notice-bar__wrap">
      <view
        class="wd-notice-bar__content"
        :style="animation"
        @transitionend="animationEnd"
        @click="handleClick"
      >
        <template v-if="isVertical">
          <view v-for="item in textArray" :key="item">
            {{ item }}
          </view>
          <view v-if="textArray.length > 1">
            {{ textArray[0] }}
          </view>
        </template>
        <slot v-else>{{ currentText }}</slot>
      </view>
    </view>
    <wd-icon
      v-if="closable"
      custom-class="wd-notice-bar__suffix"
      name="close"
      @click="handleClose"
    />
    <slot v-else name="suffix" />
  </view>
</template>

<script lang="ts" setup>
import type { ComponentPublicInstance, CSSProperties } from 'vue'
import {
  computed,
  getCurrentInstance,
  nextTick,
  onActivated,
  onDeactivated,
  onMounted,
  reactive,
  ref,
  watch,
} from 'vue'
import { addUnit, getRect, isArray, isDef, objToStyle, pxToRpx } from '../common/util'
import wdIcon from '../wd-icon/wd-icon.vue'

defineOptions({
  name: 'WdNoticeBar',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 通知栏类型
 */
type NoticeBarType = 'warning' | 'info' | 'danger' | ''

/**
 * 滚动方向类型 horizontal水平 vertical垂直
 */
type NoticeBarScrollDirection = 'horizontal' | 'vertical'

/**
 * 通知栏组件属性接口
 */
interface WdNoticeBarProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 设置通知栏文案，支持字符串或字符串数组 传入数组则自动轮播 */
  text?: string | string[]
  /** 设置通知栏类型，可选值：'warning' | 'info' | 'danger' */
  type?: NoticeBarType
  /** 是否可滚动 */
  scrollable?: boolean
  /** 滚动延迟时间（秒） */
  delay?: number
  /** 滚动速度（rpx/s） */
  speed?: number
  /** 是否可关闭 */
  closable?: boolean
  /** 是否换行显示 */
  wrapable?: boolean
  /** 设置左侧图标，使用 icon 章节中的图标名 */
  prefix?: string
  /** 文字、图标颜色 */
  color?: string
  /** 背景颜色 */
  backgroundColor?: string
  /** 滚动方向，可选值：'horizontal' | 'vertical' */
  direction?: NoticeBarScrollDirection
}

/**
 * 通知栏组件事件接口
 */
interface WdNoticeBarEmits {
  /** 关闭通知栏时触发 */
  close: []
  /** 切换到下一条文本时触发 */
  next: [index: number]
  /** 点击通知栏时触发 */
  click: [result: { index: number; text: string }]
}

/**
 * 组件暴露的方法接口
 */
interface WdNoticeBarExpose {
  /** 重置NoticeBar动画 */
  reset: () => void
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdNoticeBarProps>(), {
  customStyle: '',
  customClass: '',
  text: '',
  type: 'warning',
  scrollable: true,
  delay: 1,
  speed: 100,
  closable: false,
  wrapable: false,
  direction: 'horizontal',
})

// 定义组件事件
const emit = defineEmits<WdNoticeBarEmits>()

// 选择器常量
const $wrap = '.wd-notice-bar__wrap'
const $content = '.wd-notice-bar__content'

// 响应式数据
const wrapWidth = ref<number>(0)
const show = ref<boolean>(true)
const currentIndex = ref<number>(0)
const verticalIndex = ref<number>(0)
const wrapRect = ref<UniApp.NodeInfo | null>(null)
const contentRect = ref<UniApp.NodeInfo | null>(null)

// 过渡状态
const transitionState = reactive<CSSProperties>({
  transitionProperty: 'unset',
  transitionDelay: 'unset',
  transitionDuration: 'unset',
  transform: 'none',
  transitionTimingFunction: 'linear',
})

// 获取当前组件实例
const { proxy } = getCurrentInstance() as any

/**
 * 计算文本数组
 * 将文本转换为数组格式
 */
const textArray = computed(() => (Array.isArray(props.text) ? props.text : [props.text]))

/**
 * 计算当前显示的文本
 */
const currentText = computed(() => textArray.value[currentIndex.value])

/**
 * 判断是否为横向滚动
 */
const isHorizontal = computed(() => props.direction === 'horizontal')

/**
 * 判断是否为纵向滚动
 */
const isVertical = computed(() => props.direction === 'vertical')

/**
 * 计算动画样式
 */
const animation = computed(() => {
  return objToStyle(transitionState)
})

/**
 * 查询元素尺寸信息
 * @returns 包含容器和内容元素尺寸的 Promise
 */
const queryRect = () => {
  return Promise.all([getRect($wrap, false, proxy), getRect($content, false, proxy)])
}

/**
 * 设置过渡动画参数
 * @param duration 动画持续时间（秒）
 * @param delay 延迟时间（秒）
 * @param translate 位移距离（rpx）
 */
const setTransition = ({
  duration,
  delay,
  translate,
}: {
  duration: number
  delay: number
  translate: number
}) => {
  transitionState.transitionProperty = 'all'
  transitionState.transitionDelay = `${delay}s`
  transitionState.transitionDuration = `${duration}s`
  transitionState.transform = `${props.direction === 'vertical' ? 'translateY' : 'translateX'}(${addUnit(translate)})`
  transitionState.transitionTimingFunction = 'linear'
}
/**
 * 纵向滚动动画处理
 * @param height 内容总高度（px）
 */
const verticalAnimate = async (height: number) => {
  // 将px转换为rpx进行计算
  const heightRpx = pxToRpx(height)
  const translate = -(heightRpx / (textArray.value.length + 1)) * (currentIndex.value + 1)
  setTransition({
    duration: heightRpx / (textArray.value.length + 1) / props.speed,
    delay: props.delay,
    translate,
  })
}

/**
 * 执行滚动动画
 * 根据方向和设置启动相应的滚动动画
 */
const scroll = async () => {
  const [wRect, cRect] = await queryRect()
  if (!wRect.width || !cRect.width || !cRect.height) return

  wrapRect.value = wRect
  contentRect.value = cRect
  // 将px转换为rpx存储
  wrapWidth.value = pxToRpx(wRect.width)

  if (isHorizontal.value) {
    if (props.scrollable) {
      // 将px转换为rpx进行动画计算
      const contentWidthRpx = pxToRpx(cRect.width)
      setTransition({
        duration: contentWidthRpx / props.speed,
        delay: props.delay,
        translate: -contentWidthRpx,
      })
    }
  } else {
    if (textArray.value.length > 1) {
      verticalAnimate(cRect.height)
    }
  }
}
/**
 * 启动过渡动画
 */
const startTransition = () => {
  nextTick(() => scroll())
}
/**
 * 停止过渡动画
 * 重置所有动画相关状态
 */
const stopTransition = () => {
  transitionState.transitionProperty = 'unset'
  transitionState.transitionDelay = 'unset'
  transitionState.transitionDuration = 'unset'
  transitionState.transform = 'none'
  transitionState.transitionTimingFunction = 'linear'
  currentIndex.value = 0
  verticalIndex.value = 0
}

/**
 * 重置动画状态
 * 停止当前动画并重新开始
 */
const reset = () => {
  stopTransition()
  startTransition()
}

/**
 * 监听文本变化
 * 当文本发生变化时，重置动画
 */
watch(
  () => props.text,
  () => {
    reset()
  },
  { deep: true },
)

/**
 * 页面激活时启动动画
 */
onActivated(() => {
  startTransition()
})

/**
 * 页面失活时停止动画
 */
onDeactivated(() => {
  stopTransition()
})

/**
 * 处理关闭按钮点击事件
 * 隐藏通知栏并触发关闭事件
 */
const handleClose = () => {
  show.value = false
  emit('close')
}

/**
 * 切换到下一条文本
 * 更新当前索引并触发下一条事件
 */
const next = () => {
  if (currentIndex.value >= textArray.value.length - 1) {
    currentIndex.value = 0
  } else {
    currentIndex.value++
  }
  emit('next', currentIndex.value)
}

/**
 * 动画结束回调
 * 处理动画结束后的状态重置和下一轮动画
 */
const animationEnd = () => {
  if (isHorizontal.value) {
    setTransition({
      duration: 0,
      delay: 0,
      translate: wrapWidth.value + 2,
    })
  } else {
    if (++verticalIndex.value >= textArray.value.length) {
      verticalIndex.value = 0
      setTransition({
        duration: 0,
        delay: 0,
        translate: 0,
      })
    }
  }

  const timer = setTimeout(() => {
    next() // 更换下一条文本

    nextTick(async () => {
      try {
        const [wRect, cRect] = await queryRect()
        wrapRect.value = wRect
        contentRect.value = cRect
        wrapWidth.value = pxToRpx(wRect.width || 0)
      } catch (error) {
        // console.error(error)
      }

      if (!contentRect.value || !contentRect.value.width || !contentRect.value.height) return

      if (isHorizontal.value) {
        const contentWidthRpx = pxToRpx(contentRect.value.width)
        setTransition({
          duration: (wrapWidth.value + contentWidthRpx) / props.speed,
          delay: props.delay,
          translate: -contentWidthRpx,
        })
      } else {
        verticalAnimate(contentRect.value.height)
      }
    })

    clearTimeout(timer)
  }, 20)
}

/**
 * 处理点击事件
 * 构造点击结果数据并触发点击事件
 */
const handleClick = () => {
  const result = isArray(props.text)
    ? {
        index: currentIndex.value,
        text: props.text[currentIndex.value],
      }
    : {
        index: 0,
        text: props.text,
      }
  emit('click', result)
}

/**
 * 组件挂载后的处理
 * 启动过渡动画并监听页面状态变化
 */
onMounted(() => {
  startTransition()
  // #ifdef APP-PLUS
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const currentWebview = currentPage.$getAppWebview!()
  currentWebview.addEventListener('hide', () => {
    stopTransition()
  })
  currentWebview.addEventListener('show', () => {
    startTransition()
  })
  // #endif
})
// 暴露组件方法
defineExpose<WdNoticeBarExpose>({ reset })

/** 通知栏组件实例类型 */
export type NoticeBarInstance = ComponentPublicInstance<WdNoticeBarProps, WdNoticeBarExpose>
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 通知栏组件样式
@include b(notice-bar) {
  display: flex;
  padding: $-notice-bar-padding;
  align-items: center;
  font-size: $-notice-bar-fs;
  border-radius: $-notice-bar-border-radius;
  position: relative;
  box-sizing: border-box;

  // 警告类型样式
  @include when(warning) {
    background: $-notice-bar-warning-bg;
    color: $-notice-bar-warning-color;
  }

  // 信息类型样式
  @include when(info) {
    background: $-notice-bar-info-bg;
    color: $-notice-bar-info-color;
  }

  // 危险类型样式
  @include when(danger) {
    background: $-notice-bar-danger-bg;
    color: $-notice-bar-danger-color;
  }

  // 前缀图标样式
  @include edeep(prefix) {
    padding-right: 8rpx;
    font-size: $-notice-bar-prefix-size;
  }

  // 后缀关闭按钮样式
  @include edeep(suffix) {
    text-align: center;
    font-size: $-notice-bar-close-size;
    display: inline-block;
    background-color: $-notice-bar-close-bg;
    color: $-notice-bar-close-color;
    padding: 0;
    border-radius: 0rpx 16rpx 0rpx 8rpx;
    position: absolute;
    right: 0;
    top: 0;
  }

  // 内容包装容器样式
  @include e(wrap) {
    position: relative;
    flex: 1;
    height: $-notice-bar-line-height;
    overflow: hidden;
    line-height: $-notice-bar-line-height;
  }

  // 内容区域样式
  @include e(content) {
    position: absolute;
    white-space: nowrap;
  }

  // 省略号显示模式
  @include m(ellipse) {
    .wd-notice-bar__content {
      position: static;
      @include lineEllipsis;
    }
  }

  // 换行显示模式
  @include m(wrap) {
    .wd-notice-bar__wrap {
      height: auto;
    }
    .wd-notice-bar__content {
      position: static;
      white-space: normal;
    }
  }
}
</style>
