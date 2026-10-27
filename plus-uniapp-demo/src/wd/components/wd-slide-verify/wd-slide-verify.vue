<!-- SlideVerify 滑动验证 用户拖动滑块到右侧完成验证。 -->
<template>
  <view :id="rootId" :class="rootClass" :style="rootStyle">
    <!-- 背景提示文字 -->
    <view class="wd-slide-verify__text">
      <slot name="text">
        <text class="wd-slide-verify__text-inner">{{ isPass ? '' : text }}</text>
      </slot>
    </view>

    <!-- 滑过区域（已验证部分） -->
    <view class="wd-slide-verify__track" :style="trackStyle">
      <view class="wd-slide-verify__track-text" :style="trackTextStyle">
        <slot name="success-text">
          <text class="wd-slide-verify__track-text--success">{{ successText }}</text>
        </slot>
      </view>
    </view>

    <!-- 滑块按钮 -->
    <view
      class="wd-slide-verify__button"
      :style="buttonStyle"
      @touchstart.prevent="onTouchStart"
      @touchmove.prevent="onTouchMove"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
    >
      <slot v-if="isPass" name="success-icon">
        <view class="wd-slide-verify__button-icon--success" :style="{ backgroundColor: activeBackgroundColor }">
          <wd-icon :name="successIcon" :size="successIconSize" color="#fff" />
        </view>
      </slot>
      <slot v-else name="icon">
        <view class="wd-slide-verify__button-icon">
          <wd-icon :name="icon" :size="iconSize" />
        </view>
      </slot>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { ComponentPublicInstance, CSSProperties } from 'vue'
import { computed, getCurrentInstance, onBeforeUnmount, ref } from 'vue'
import { addUnit, getRect, objToStyle, range, uuid } from '../common/util'

defineOptions({
  name: 'WdSlideVerify',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

/**
 * 滑动验证变化事件参数
 */
interface SlideVerifyChangeEvent {
  /** 当前滑块偏移量（像素） */
  offsetX: number
  /** 当前进度百分比（0-100） */
  percent: number
}

/**
 * 滑动验证组件属性接口
 */
interface WdSlideVerifyProps {
  /** 轨道宽度，数字时单位为 rpx，也支持字符串如 '100%' */
  width?: number | string
  /** 轨道高度，数字时单位为 rpx */
  height?: number | string
  /** 验证成功的容差像素（滑块到达右端的容差范围） */
  tolerance?: number
  /** 提示文本 */
  text?: string
  /** 验证成功后的文本 */
  successText?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 轨道背景色 */
  backgroundColor?: string
  /** 滑过区域的激活背景色 */
  activeBackgroundColor?: string
  /** 滑块图标名称 */
  icon?: string
  /** 验证成功后的图标名称 */
  successIcon?: string
  /** 滑块图标大小 */
  iconSize?: number | string
  /** 验证成功后图标大小 */
  successIconSize?: number | string
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string
}

/**
 * 滑动验证组件事件接口
 */
interface WdSlideVerifyEmits {
  /** 验证成功时触发 */
  success: []
  /** 验证失败时触发（未拖到底松手） */
  fail: []
  /** 拖动过程中触发 */
  change: [event: SlideVerifyChangeEvent]
}

/**
 * 滑动验证组件暴露方法接口
 */
interface WdSlideVerifyExpose {
  /** 重置验证状态 */
  reset: () => void
}

const props = withDefaults(defineProps<WdSlideVerifyProps>(), {
  width: 600,
  height: 80,
  tolerance: 10,
  text: '请滑动验证',
  successText: '验证成功',
  disabled: false,
  backgroundColor: '#F5F7FA',
  activeBackgroundColor: '#49C75F',
  icon: 'arrow-right',
  successIcon: 'check',
  iconSize: 40,
  successIconSize: 24,
  customStyle: '',
  customClass: '',
})

const emit = defineEmits<WdSlideVerifyEmits>()

const { proxy } = getCurrentInstance() as any
const rootId = ref<string>(`slideVerify${uuid()}`)

// ----------- 基础状态 -----------
/** 滑块当前偏移量（px） */
const currentPosition = ref<number>(0)
/** 触摸起始时的滑块位置 */
const startPosition = ref<number>(0)
/** 是否验证通过 */
const isPass = ref<boolean>(false)
/** 是否正在拖动 */
const isDragging = ref<boolean>(false)
/** 是否正在回弹动画中 */
const isResetting = ref<boolean>(false)
/** 回弹动画定时器 */
let resetTimer: ReturnType<typeof setTimeout> | null = null
/** 触摸起始 X 坐标 */
let startX = 0
/** 实际渲染的轨道宽度（px） */
let trackWidthPx = 0
/** 实际渲染的按钮高度（px） */
let buttonHeightPx = 0
/** 最大可拖动距离（px） */
let maxPositionPx = 0

/**
 * 是否不可操作
 */
const isDisabled = computed(() => props.disabled || isPass.value)

// ----------- 计算样式 -----------
const rootClass = computed(() => {
  return [
    'wd-slide-verify',
    {
      'is-disabled': props.disabled,
      'is-success': isPass.value,
      'is-dragging': isDragging.value,
    },
    props.customClass,
  ]
})

const rootStyle = computed(() => {
  const style: CSSProperties = {
    width: addUnit(props.width),
    height: addUnit(props.height),
    backgroundColor: props.backgroundColor,
  }
  return `${objToStyle(style)}${props.customStyle}`
})

const buttonStyle = computed(() => {
  const style: CSSProperties = {
    width: addUnit(props.height),
    height: addUnit(props.height),
    transform: `translate(${currentPosition.value}px, 0)`,
    transition: isResetting.value ? 'all 0.3s ease' : 'none',
  }
  return objToStyle(style)
})

const trackStyle = computed(() => {
  const style: CSSProperties = {
    width: `${currentPosition.value}px`,
    background: props.activeBackgroundColor,
  }
  return objToStyle(style)
})

const trackTextStyle = computed(() => {
  const style: CSSProperties = {
    minWidth: addUnit(props.width),
  }
  return objToStyle(style)
})

// ----------- 尺寸测量 -----------
const measureSize = async () => {
  const rect = await getRect(`#${rootId.value}`, false, proxy)
  trackWidthPx = Number(rect.width) || 0
  buttonHeightPx = Number(rect.height) || 0
  maxPositionPx = Math.max(0, trackWidthPx - buttonHeightPx)
}

// ----------- 触摸处理 -----------
const updatePosition = (position: number) => {
  currentPosition.value = range(position, 0, maxPositionPx)
}

const onTouchStart = async (event: any) => {
  if (isDisabled.value || isDragging.value) return

  await measureSize()
  startX = event.touches[0].clientX
  startPosition.value = currentPosition.value
  isDragging.value = true
}

const onTouchMove = (event: any) => {
  if (isDisabled.value || !isDragging.value) return

  const deltaX = event.touches[0].clientX - startX
  updatePosition(startPosition.value + deltaX)

  const percent = maxPositionPx > 0 ? Math.round((currentPosition.value / maxPositionPx) * 100) : 0
  emit('change', { offsetX: currentPosition.value, percent })
}

const onTouchEnd = () => {
  if (isDisabled.value || !isDragging.value) return
  isDragging.value = false

  const isComplete = maxPositionPx > 0 && Math.abs(maxPositionPx - currentPosition.value) <= props.tolerance
  if (isComplete) {
    currentPosition.value = maxPositionPx
    isPass.value = true
    emit('success')
  } else {
    isResetting.value = true
    currentPosition.value = 0
    emit('fail')
    resetTimer = setTimeout(() => {
      isResetting.value = false
    }, 300)
  }
}

// ----------- 公开方法 -----------
const reset = () => {
  if (resetTimer !== null) {
    clearTimeout(resetTimer)
    resetTimer = null
  }
  isResetting.value = true
  currentPosition.value = 0
  startPosition.value = 0
  isPass.value = false
  isDragging.value = false
  resetTimer = setTimeout(() => {
    isResetting.value = false
  }, 300)
}

onBeforeUnmount(() => {
  if (resetTimer !== null) {
    clearTimeout(resetTimer)
    resetTimer = null
  }
})

defineExpose<WdSlideVerifyExpose>({
  reset,
})

/** 滑动验证组件实例类型 */
export type SlideVerifyInstance = ComponentPublicInstance<WdSlideVerifyProps, WdSlideVerifyExpose>
</script>

<style lang="scss">
@import './../common/abstracts/_mixin.scss';
@import './../common/abstracts/variable.scss';

/* 暗色主题样式 */
.wot-theme-dark {
  .wd-slide-verify {
    background-color: $-dark-background2;
  }

  .wd-slide-verify__text-inner {
    color: $-dark-color3;
  }

  .wd-slide-verify__button {
    background-color: $-dark-background;
  }
}

/* 滑动验证组件样式 */
@include b(slide-verify) {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  user-select: none;
  border-radius: 8rpx;

  @include e(text) {
    position: relative;
    z-index: 0;
    pointer-events: none;
  }

  @include e(text-inner) {
    color: $-slide-verify-text-color;
    font-size: $-slide-verify-text-size;
    transition: color 0.3s ease;
  }

  @include e(track) {
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
    height: 100%;
    border-radius: 8rpx 0 0 8rpx;
    overflow: hidden;
    z-index: 1;
    transition: background 0.2s ease;
  }

  @include e(track-text) {
    position: absolute;
    left: 0;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    pointer-events: none;

    @include m(success) {
      color: $-slide-verify-success-text-color;
      font-size: $-slide-verify-text-size;
      font-weight: 500;
    }
  }

  @include e(button) {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $-slide-verify-button-bg;
    box-shadow: 0 4rpx 16rpx $-slide-verify-button-shadow;
    color: $-slide-verify-button-color;
    border-radius: 8rpx;
    z-index: 2;
    cursor: grab;
    will-change: transform;
  }

  @include e(button-icon) {
    display: flex;
    align-items: center;
    justify-content: center;

    @include m(success) {
      width: 60%;
      height: 60%;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  @include when(disabled) {
    opacity: $-slide-verify-disabled-opacity;
    cursor: not-allowed;
    pointer-events: none;
  }

  @include when(dragging) {
    .wd-slide-verify__button {
      cursor: grabbing;
    }
  }
}
</style>
