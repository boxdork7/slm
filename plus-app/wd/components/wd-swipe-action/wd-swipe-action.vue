<!-- SwipeAction 滑动操作 常用于单元格左右滑删除等手势操作。 -->
<template>
  <!-- 注意阻止横向滑动的穿透：横向移动时阻止冒泡 -->
  <view
    :class="`wd-swipe-action ${customClass}`"
    :style="customStyle"
    @click.stop="onClick()"
    @touchstart="startDrag"
    @touchmove="onDrag"
    @touchend="endDrag"
    @touchcancel="endDrag"
  >
    <!-- 容器 -->
    <view class="wd-swipe-action__wrapper" :style="wrapperStyle">
      <!-- 左侧操作 -->
      <view class="wd-swipe-action__left" @click="onClick('left')">
        <slot name="left" />
      </view>
      <!-- 内容 -->
      <slot />
      <!-- 右侧操作 -->
      <view class="wd-swipe-action__right" @click="onClick('right')">
        <slot name="right" />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { ComponentPublicInstance } from 'vue'
import type { Queue } from '../composables/useQueue'
import {
  getCurrentInstance,
  inject,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'
import { closeOther, pushToQueue, removeFromQueue } from '../common/clickoutside'
import { getRect } from '../common/util'
import { queueKey } from '../composables/useQueue'
import { useTouch } from '../composables/useTouch'

defineOptions({
  name: 'WdSwipeAction',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 滑动操作状态类型
 */
export type SwipeActionStatus = 'left' | 'close' | 'right'

/**
 * 滑动操作原因类型
 */
export type SwipeActionReason = 'click' | 'swipe' | 'value'

/**
 * 滑动操作位置类型
 */
export type SwipeActionPosition = SwipeActionStatus | 'inside'

/**
 * 关闭前回调函数类型
 */
export type SwipeActionBeforeClose = (reason: SwipeActionReason, position: SwipeActionPosition) => void

/**
 * 滑动操作组件属性接口
 */
interface WdSwipeActionProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 滑动按钮的状态，使用v-model进行双向绑定，可选值：'left'、'close'、'right' */
  modelValue?: SwipeActionStatus
  /** 是否禁用滑动操作 */
  disabled?: boolean
  /** 在关闭滑动按钮前调用的钩子函数 */
  beforeClose?: SwipeActionBeforeClose
}

/**
 * 滑动操作组件事件接口
 */
interface WdSwipeActionEmits {
  /** 点击事件 */
  click: [event: { value: SwipeActionPosition }]
  /** 更新modelValue */
  'update:modelValue': [value: SwipeActionStatus]
}

/**
 * 滑动操作组件暴露方法接口
 */
interface WdSwipeActionExpose {
  /** 关闭事件 */
  close: (reason: SwipeActionReason, position?: SwipeActionPosition) => void
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdSwipeActionProps>(), {
  customStyle: '',
  customClass: '',
  modelValue: 'close',
  disabled: false,
})

// 定义组件事件
const emit = defineEmits<WdSwipeActionEmits>()

// 注入队列管理器
const queue = inject<Queue | null>(queueKey, null)

// 响应式数据
const wrapperStyle = ref<string>('')
// 滑动开始时，wrapper的偏移量
const originOffset = ref<number>(0)
// wrapper现在的偏移量
const wrapperOffset = ref<number>(0)
// 是否处于滑动状态
const touching = ref<boolean>(false)

// 触摸工具
const touch = useTouch()

// 获取当前组件实例
const { proxy } = getCurrentInstance() as any

/**
 * wrapper滑动函数
 * @param offset 滑动偏移量
 */
const swipeMove = (offset = 0) => {
  const transform = `translate3d(${offset}px, 0, 0)`
  // 跟随手指滑动时不需要动画
  const transition = touching.value ? 'none' : '.6s cubic-bezier(0.18, 0.89, 0.32, 1)'
  wrapperStyle.value = `
    -webkit-transform: ${transform};
    -webkit-transition: ${transition};
    transform: ${transform};
    transition: ${transition};
  `
  // 记录容器当前偏移量
  wrapperOffset.value = offset
}
/**
 * 关闭操作按钮，并在合适的时候调用 beforeClose
 * @param reason 关闭原因
 * @param position 关闭位置
 */
const close = (reason: SwipeActionReason, position?: SwipeActionPosition) => {
  if (reason === 'swipe' && originOffset.value === 0) {
    // offset：0 ——> offset：0
    return swipeMove(0)
  } else if (reason === 'swipe' && originOffset.value > 0) {
    // offset > 0 ——> offset：0
    position = 'left'
  } else if (reason === 'swipe' && originOffset.value < 0) {
    // offset < 0 ——> offset：0
    position = 'right'
  }

  if (reason && position) {
    props.beforeClose && props.beforeClose(reason, position)
  }

  swipeMove(0)
  if (props.modelValue !== 'close') {
    emit('update:modelValue', 'close')
  }
}

/**
 * 获取左右操作按钮的宽度
 * @returns Promise<[leftWidth, rightWidth]> 左宽度、右宽度
 */
const getWidths = () => {
  return Promise.all([
    getRect('.wd-swipe-action__left', false, proxy).then((rect) => {
      return rect.width ? rect.width : 0
    }),
    getRect('.wd-swipe-action__right', false, proxy).then((rect) => {
      return rect.width ? rect.width : 0
    }),
  ])
}

/**
 * 改变状态
 * @param value 新状态
 * @param old 旧状态
 */
const changeState = (value: SwipeActionStatus, old?: SwipeActionStatus) => {
  if (props.disabled) {
    return
  }
  getWidths().then(([leftWidth, rightWidth]) => {
    switch (value) {
      case 'close':
        // 如果偏移量本就是0，则不需要处理
        if (wrapperOffset.value === 0) return
        close('value', old)
        break
      case 'left':
        swipeMove(leftWidth)
        break
      case 'right':
        swipeMove(-rightWidth)
        break
    }
  })
}

/**
 * 监听modelValue变化
 */
watch(
  () => props.modelValue,
  (value, old) => {
    changeState(value, old)
  },
  {
    deep: true,
  },
)

/**
 * 点击事件处理
 * @param position 点击位置
 */
const onClick = (position?: SwipeActionPosition) => {
  if (props.disabled || wrapperOffset.value === 0) {
    return
  }

  position = position || 'inside'
  close('click', position)
  emit('click', {
    value: position,
  })
}

/**
 * 开始滑动
 * @param event 触摸事件
 */
const startDrag = (event: TouchEvent) => {
  if (props.disabled) return

  originOffset.value = wrapperOffset.value
  touch.touchStart(event)
  if (queue && queue.closeOther) {
    queue.closeOther(proxy)
  } else {
    closeOther(proxy)
  }
}

/**
 * 滑动时，逐渐展示按钮
 * @param event 触摸事件
 */
const onDrag = (event: TouchEvent) => {
  if (props.disabled) return

  touch.touchMove(event)
  if (touch.direction.value === 'vertical') {
    return
  } else {
    event.preventDefault()
    event.stopPropagation()
  }

  touching.value = true

  // 本次滑动，wrapper应该设置的偏移量
  const offset = originOffset.value + touch.deltaX.value
  getWidths().then(([leftWidth, rightWidth]) => {
    // 如果需要滑出来的按钮不存在，对应的按钮肯定滑不出来，容器处于初始状态。此时需要模拟一下位于此处的start事件。
    if ((leftWidth === 0 && offset > 0) || (rightWidth === 0 && offset < 0)) {
      swipeMove(0)
      return startDrag(event)
    }
    // 按钮已经展示完了，再滑动没有任何意义，相当于滑动结束。此时需要模拟一下位于此处的start事件。
    if (leftWidth !== 0 && offset >= leftWidth) {
      swipeMove(leftWidth)
      return startDrag(event)
    } else if (rightWidth !== 0 && -offset >= rightWidth) {
      swipeMove(-rightWidth)
      return startDrag(event)
    }
    swipeMove(offset)
  })
}

/**
 * 滑动结束，自动修正位置
 */
const endDrag = () => {
  if (props.disabled) return
  // 滑出"操作按钮"的阈值
  const THRESHOLD = 0.3
  touching.value = false

  getWidths().then(([leftWidth, rightWidth]) => {
    if (
      originOffset.value < 0 && // 之前展示的是右按钮
      wrapperOffset.value < 0 && // 目前仍然是右按钮
      wrapperOffset.value - originOffset.value < rightWidth * THRESHOLD // 并且滑动的范围不超过右边框阈值
    ) {
      swipeMove(-rightWidth) // 回归右按钮
      emit('update:modelValue', 'right')
    } else if (
      originOffset.value > 0 && // 之前展示的是左按钮
      wrapperOffset.value > 0 && // 现在仍然是左按钮
      originOffset.value - wrapperOffset.value < leftWidth * THRESHOLD // 并且滑动的范围不超过左按钮阈值
    ) {
      swipeMove(leftWidth) // 回归左按钮
      emit('update:modelValue', 'left')
    } else if (
      rightWidth > 0 &&
      originOffset.value >= 0 && // 之前是初始状态或者展示左按钮
      wrapperOffset.value < 0 && // 现在展示右按钮
      Math.abs(wrapperOffset.value) > rightWidth * THRESHOLD // 视图中已经展示的右按钮长度超过阈值
    ) {
      swipeMove(-rightWidth)
      emit('update:modelValue', 'right')
    } else if (
      leftWidth > 0 &&
      originOffset.value <= 0 && // 之前初始状态或者右按钮显示
      wrapperOffset.value > 0 && // 现在左按钮
      Math.abs(wrapperOffset.value) > leftWidth * THRESHOLD // 视图中已经展示的左按钮长度超过阈值
    ) {
      swipeMove(leftWidth)
      emit('update:modelValue', 'left')
    } else {
      // 回归初始状态
      close('swipe')
    }
  })
}

/**
 * 组件挂载前处理
 */
onBeforeMount(() => {
  if (queue && queue.pushToQueue) {
    queue.pushToQueue(proxy)
  } else {
    pushToQueue(proxy)
  }
  // 初始化滑动相关数据
  originOffset.value = 0
  wrapperOffset.value = 0
  touching.value = false
})

/**
 * 组件挂载后处理
 */
onMounted(() => {
  touching.value = true
  changeState(props.modelValue)
  touching.value = false
})

/**
 * 组件卸载前处理
 */
onBeforeUnmount(() => {
  if (queue && queue.removeFromQueue) {
    queue.removeFromQueue(proxy)
  } else {
    removeFromQueue(proxy)
  }
})

// 暴露关闭方法
defineExpose<WdSwipeActionExpose>({ close })

/** 滑动操作组件实例类型 */
export type SwipeActionInstance = ComponentPublicInstance<WdSwipeActionProps, WdSwipeActionExpose>
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 滑动操作组件样式
@include b(swipe-action) {
  position: relative;
  overflow: hidden;

  @include e(left) {
    left: 0;
    transform: translate3d(-100%, 0, 0);
  }

  @include e(right) {
    right: 0;
    transform: translate3d(100%, 0, 0);
  }
}

.wd-swipe-action__left,
.wd-swipe-action__right {
  position: absolute;
  top: 0;
  height: 100%;
}
</style>
