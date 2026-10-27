<!-- Fab 悬浮按钮  悬浮动作按钮组件，按下可显示一组动作按钮。 -->
<template>
  <view
    :class="`wd-fab ${customClass}`"
    @touchmove.stop.prevent="handleTouchMove"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
    :style="`top: ${addUnit(top * 2)}; left: ${addUnit(left * 2)}; transition: ${attractTransition ? 'all ease 0.3s' : 'none'}; ${zIndex !== undefined ? `z-index: ${zIndex};` : ''}${customStyle}`"
    @click.stop=""
  >
    <view id="trigger" @click.stop="" :style="{ visibility: inited ? 'visible' : 'hidden' }">
      <slot v-if="$slots.trigger" name="trigger" />
      <wd-button
        v-else
        custom-class="wd-fab__trigger"
        :type="type"
        :disabled="disabled"
        round
        @click="handleClick"
      >
        <wd-icon
          custom-class="wd-fab__icon"
          :name="isActive ? activeIcon : inactiveIcon"
        />
      </wd-button>
    </view>
    <wd-transition
      v-if="expandable"
      :enter-class="`wd-fab__transition-enter--${fabDirection}`"
      enter-active-class="wd-fab__transition-enter-active"
      :leave-to-class="`wd-fab__transition-leave-to--${fabDirection}`"
      leave-active-class="wd-fab__transition-leave-active"
      :custom-class="`wd-fab__actions wd-fab__actions--${fabDirection}`"
      :show="isActive"
      :duration="300"
    >
      <slot />
    </wd-transition>
  </view>
</template>

<script lang="ts" setup>
import type { ComponentPublicInstance } from 'vue'
import type { Queue } from '../composables/useQueue'
import { getCurrentInstance, inject, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { closeOther, pushToQueue, removeFromQueue } from '../common/clickoutside'
import { addUnit, getRect, isH5 } from '../common/util'
import { queueKey } from '../composables/useQueue'
import { useRaf } from '../composables/useRaf'
import wdButton from '../wd-button/wd-button.vue'
import wdIcon from '../wd-icon/wd-icon.vue'
import wdTransition from '../wd-transition/wd-transition.vue'

defineOptions({
  name: 'WdFab',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 悬浮按钮类型
 */
type FabType = 'primary' | 'success' | 'info' | 'warning' | 'error' | 'default'

/**
 * 悬浮按钮位置
 */
type FabPosition =
  | 'left-top'
  | 'right-top'
  | 'left-bottom'
  | 'right-bottom'
  | 'left-center'
  | 'right-center'
  | 'top-center'
  | 'bottom-center'

/**
 * 悬浮按钮菜单弹出方向
 */
type FabDirection = 'top' | 'right' | 'bottom' | 'left'

/**
 * 悬浮按钮间距配置
 */
type FabGap = Partial<Record<FabDirection, number>>

/**
 * 悬浮按钮组件属性接口
 */
interface WdFabProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 是否激活 */
  active?: boolean
  /** 类型，可选值为 default primary info success warning error */
  type?: FabType
  /** 悬浮按钮位置 */
  position?: FabPosition
  /** 悬浮按钮菜单弹出方向 */
  direction?: FabDirection
  /** 是否禁用 */
  disabled?: boolean
  /** 悬浮按钮未展开时的图标 */
  inactiveIcon?: string
  /** 悬浮按钮展开时的图标 */
  activeIcon?: string
  /** 自定义悬浮按钮层级 */
  zIndex?: number
  /** 是否可拖动 */
  draggable?: boolean
  /** 悬浮按钮间距配置 */
  gap?: FabGap
  /** 用于控制点击时是否展开菜单 */
  expandable?: boolean
}

/**
 * 悬浮按钮组件事件接口
 */
interface WdFabEmits {
  /** 更新激活状态 */
  'update:active': [active: boolean]
  /** 点击事件 */
  click: []
}

/**
 * 悬浮按钮组件暴露方法接口
 */
interface WdFabExpose {
  /** 展开菜单 */
  open: () => void
  /** 收起菜单 */
  close: () => void
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdFabProps>(), {
  customStyle: '',
  customClass: '',
  active: false,
  type: 'primary',
  position: 'right-bottom',
  direction: 'top',
  disabled: false,
  inactiveIcon: 'add',
  activeIcon: 'close',
  zIndex: 99,
  draggable: false,
  gap: () => ({}),
  expandable: true,
})

// 定义组件事件
const emit = defineEmits<WdFabEmits>()

// 响应式数据
const inited = ref<boolean>(false) // 是否初始化完成
const isActive = ref<boolean>(false) // 是否激活状态
const queue = inject<Queue | null>(queueKey, null)
const { proxy } = getCurrentInstance() as any

// 位置相关状态
const top = ref<number>(0)
const left = ref<number>(0)
const fabDirection = ref(props.direction)
const screen = reactive({ width: 0, height: 0 })
const fabSize = reactive({ width: 56, height: 56 })
const bounding = reactive({
  minTop: 0,
  minLeft: 0,
  maxTop: 0,
  maxLeft: 0,
})

// 拖拽相关状态
const touchOffset = reactive({ x: 0, y: 0 })
const attractTransition = ref<boolean>(false)

/**
 * 监听 active 属性变化
 * 同步内部激活状态
 */
watch(
  () => props.active,
  (newValue) => {
    isActive.value = newValue
  },
  { immediate: true, deep: true },
)

/**
 * 监听内部激活状态变化
 * 处理关闭其他悬浮按钮的逻辑
 */
watch(
  () => isActive.value,
  (newValue) => {
    if (newValue) {
      if (queue && queue.closeOther) {
        queue.closeOther(proxy)
      } else {
        closeOther(proxy)
      }
    }
  },
)

/**
 * 监听方向属性变化
 * 更新内部方向状态
 */
watch(
  () => props.direction,
  (direction) => (fabDirection.value = direction),
)

/**
 * 初始化位置
 * 根据 position 属性设置悬浮按钮的初始位置
 */
const initPosition = () => {
  const pos = props.position
  const { minLeft, minTop, maxLeft, maxTop } = bounding
  const centerY = (maxTop + minTop) / 2
  const centerX = (maxLeft + minLeft) / 2

  switch (pos) {
    case 'left-top':
      top.value = minTop
      left.value = minLeft
      break
    case 'right-top':
      top.value = minTop
      left.value = maxLeft
      break
    case 'left-bottom':
      top.value = maxTop
      left.value = minLeft
      break
    case 'right-bottom':
      top.value = maxTop
      left.value = maxLeft
      break
    case 'left-center':
      top.value = centerY
      left.value = minLeft
      break
    case 'right-center':
      top.value = centerY
      left.value = maxLeft
      break
    case 'top-center':
      top.value = minTop
      left.value = centerX
      break
    case 'bottom-center':
      top.value = maxTop
      left.value = centerX
      break
  }
}

/**
 * 监听位置属性变化
 * 重新初始化位置
 */
watch(
  () => props.position,
  () => initPosition(),
)

/**
 * 获取边界信息
 * 计算悬浮按钮的可移动范围
 */
const getBounding = async () => {
  const sysInfo = uni.getSystemInfoSync()

  try {
    const trigerInfo = await getRect('#trigger', false, proxy)
    fabSize.width = trigerInfo.width || 56
    fabSize.height = trigerInfo.height || 56
  } catch (error) {
    console.log(error)
  }

  const { top = 16, left = 16, right = 16, bottom = 16 } = props.gap

  // 获取顶部状态栏和导航栏高度
  const statusBarHeight = sysInfo.statusBarHeight || 0
  const navBarHeight = 44 // 导航栏默认高度
  const topSafeHeight = statusBarHeight + navBarHeight

  // 获取底部安全区域高度（刘海屏等）
  const bottomSafeHeight = sysInfo.safeAreaInsets?.bottom || 0
  const tabBarHeight = 50 // tabBar默认高度
  const bottomSafeTotal = bottomSafeHeight + tabBarHeight

  screen.width = sysInfo.windowWidth
  screen.height = isH5 ? sysInfo.windowTop + sysInfo.windowHeight : sysInfo.windowHeight

  // 计算安全区域边界
  bounding.minTop = Math.max(topSafeHeight, top)
  bounding.minLeft = left
  bounding.maxLeft = screen.width - fabSize.width - right
  bounding.maxTop = screen.height - fabSize.height - Math.max(bottomSafeTotal, bottom)
}

/**
 * 处理触摸开始事件
 * 记录触摸点相对于元素的偏移量
 */
const handleTouchStart = (e: TouchEvent) => {
  if (props.draggable === false) return

  const touch = e.touches[0]
  touchOffset.x = touch.clientX - left.value
  touchOffset.y = touch.clientY - top.value
  attractTransition.value = false
}

/**
 * 处理触摸移动事件
 * 实现拖拽功能，限制在可移动范围内
 */
const handleTouchMove = (e: TouchEvent) => {
  if (props.draggable === false) return

  const touch = e.touches[0]
  const { minLeft, minTop, maxLeft, maxTop } = bounding
  let x = touch.clientX - touchOffset.x
  let y = touch.clientY - touchOffset.y

  // 限制在可移动范围内
  if (x < minLeft) x = minLeft
  else if (x > maxLeft) x = maxLeft

  if (y < minTop) y = minTop
  else if (y > maxTop) y = maxTop

  top.value = y
  left.value = x
}

/**
 * 处理触摸结束事件
 * 实现磁吸效果，自动吸附到左侧或右侧
 */
const handleTouchEnd = () => {
  if (props.draggable === false) return

  const screenCenterX = screen.width / 2
  const fabCenterX = left.value + fabSize.width / 2
  attractTransition.value = true

  if (fabCenterX < screenCenterX) {
    left.value = bounding.minLeft
    fabDirection.value = 'right'
  } else {
    left.value = bounding.maxLeft
    fabDirection.value = 'left'
  }
}

/**
 * 处理点击事件
 * 根据配置决定是否展开菜单或触发点击事件
 */
const handleClick = () => {
  if (props.disabled) {
    return
  }

  if (!props.expandable) {
    emit('click')
    return
  }

  isActive.value = !isActive.value
  emit('update:active', isActive.value)
}

/**
 * 展开菜单
 * 暴露给父组件的方法
 */
const open = () => {
  isActive.value = true
  emit('update:active', true)
}

/**
 * 收起菜单
 * 暴露给父组件的方法
 */
const close = () => {
  isActive.value = false
  emit('update:active', false)
}

/**
 * 组件挂载后的处理
 * 初始化位置和边界信息
 */
onMounted(() => {
  if (queue && queue.pushToQueue) {
    queue.pushToQueue(proxy)
  } else {
    pushToQueue(proxy)
  }

  const { start } = useRaf(async () => {
    await getBounding()
    initPosition()
    inited.value = true
  })
  start()
})

/**
 * 组件卸载前的清理
 * 从队列中移除当前实例
 */
onBeforeUnmount(() => {
  if (queue && queue.removeFromQueue) {
    queue.removeFromQueue(proxy)
  } else {
    removeFromQueue(proxy)
  }
})

// 暴露组件方法
defineExpose<WdFabExpose>({
  open,
  close,
})

/** 浮动按钮组件实例类型 */
export type FabInstance = ComponentPublicInstance<WdFabProps, WdFabExpose>
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 暗色主题样式
.wot-theme-dark {
  @include b(fab) {
  }
}

// 悬浮按钮主体样式
@include b(fab) {
  position: fixed;
  z-index: 99;

  // 触发器按钮样式
  @include edeep(trigger) {
    min-width: auto !important;
    box-sizing: border-box;
    width: $-fab-trigger-width !important;
    height: $-fab-trigger-height !important;
    border-radius: calc($-fab-trigger-height / 2) !important;
  }

  :deep() {
    // 动作菜单容器样式
    @include e(actions) {
      position: absolute;
      z-index: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: $-fab-actions-padding 0;

      // 左右方向样式
      @include m(left, right) {
        height: 100%;
        top: 0;
        padding: 0 $-fab-actions-padding;
      }

      // 左侧方向特定样式
      @include m(left) {
        flex-direction: row-reverse;
        right: 100%;
      }

      // 右侧方向特定样式
      @include m(right) {
        flex-direction: row;
        left: 100%;
      }

      // 上下方向样式
      @include m(top, bottom) {
        width: 100%;
        left: 0;
      }

      // 顶部方向特定样式
      @include m(top) {
        flex-direction: column-reverse;
        bottom: 100%;
      }

      // 底部方向特定样式
      @include m(bottom) {
        flex-direction: column;
        top: 100%;
      }
    }

    // 过渡动画样式
    @include e(transition-enter-active, transition-leave-active) {
      transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }

    // 进入动画初始状态
    @include e(transition-enter) {
      @include m(top) {
        opacity: 0;
        transform: translateY(40px);
      }

      @include m(bottom) {
        opacity: 0;
        transform: translateY(-40px);
      }

      @include m(left) {
        opacity: 0;
        transform: translateX(40px);
      }

      @include m(right) {
        opacity: 0;
        transform: translateX(-40px);
      }
    }

    // 离开动画结束状态
    @include e(transition-leave-to) {
      @include m(top) {
        opacity: 0;
        transform: translateY(40px);
      }

      @include m(bottom) {
        opacity: 0;
        transform: translateY(-40px);
      }

      @include m(left) {
        opacity: 0;
        transform: translateX(40px);
      }

      @include m(right) {
        opacity: 0;
        transform: translateX(-40px);
      }
    }
  }

  // 图标样式
  @include edeep(icon) {
    font-size: $-fab-icon-fs;
  }
}
</style>
