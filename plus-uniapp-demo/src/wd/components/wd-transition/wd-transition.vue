<!-- Transition 动画 用于在元素进入或离开时应用过渡效果。 -->
<template>
  <view
    v-if="!lazyRender || inited"
    :class="`wd-transition ${customClass} ${classes}`"
    :style="`-webkit-transition-duration: ${currentDuration}ms; transition-duration: ${currentDuration}ms; ${!display && destroy ? 'display: none;' : ''}${customStyle}`"
    @transitionend="onTransitionEnd"
    @click="handleClick"
  >
    <slot />
  </view>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref, watch } from 'vue'
import { AbortablePromise } from '../common/AbortablePromise'
import { isObj, isPromise, pause } from '../common/util'

defineOptions({
  name: 'WdTransition',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 过渡动画类型
 */
export type TransitionName =
  | 'fade'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'fade-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'slide-up'
  | 'zoom-in'
  | 'zoom-out'

/**
 * 过渡组件属性接口
 */
interface WdTransitionProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 是否展示组件 */
  show?: boolean
  /** 动画执行时间，单位毫秒 */
  duration?: Record<string, number> | number | boolean
  /** 弹层内容懒渲染，触发展示时才渲染内容 */
  lazyRender?: boolean
  /** 动画类型 */
  name?: TransitionName | TransitionName[]
  /** 是否在动画结束时销毁子节点（display: none) */
  destroy?: boolean

  /** 进入过渡的开始状态 */
  enterClass?: string
  /** 进入过渡的激活状态 */
  enterActiveClass?: string
  /** 进入过渡的结束状态 */
  enterToClass?: string
  /** 离开过渡的开始状态 */
  leaveClass?: string
  /** 离开过渡的激活状态 */
  leaveActiveClass?: string
  /** 离开过渡的结束状态 */
  leaveToClass?: string
}

/**
 * 过渡组件事件接口
 */
interface WdTransitionEmits {
  /** 点击时触发 */
  click: []
  /** 进入前触发 */
  'before-enter': []
  /** 进入时触发 */
  enter: []
  /** 离开前触发 */
  'before-leave': []
  /** 离开时触发 */
  leave: []
  /** 离开后触发 */
  'after-leave': []
  /** 进入后触发 */
  'after-enter': []
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdTransitionProps>(), {
  customStyle: '',
  customClass: '',
  show: false,
  duration: 300,
  lazyRender: false,
  destroy: true,
  enterClass: '',
  enterActiveClass: '',
  enterToClass: '',
  leaveClass: '',
  leaveActiveClass: '',
  leaveToClass: '',
})

// 定义组件事件
const emit = defineEmits<WdTransitionEmits>()

// 响应式数据
const inited = ref<boolean>(false)
const display = ref<boolean>(false)
const status = ref<string>('')
const transitionEnded = ref<boolean>(false)
const currentDuration = ref<number>(300)
const classes = ref<string>('')

// Promise 控制变量
const enterPromise = ref<AbortablePromise<void> | null>(null)
const enterLifeCyclePromises = ref<AbortablePromise<unknown> | null>(null)
const leaveLifeCyclePromises = ref<AbortablePromise<unknown> | null>(null)

/**
 * 取消所有的 Promise
 * 确保动画状态的正确切换
 */
const handleAbortPromise = () => {
  if (isPromise(enterPromise.value)) {
    enterPromise.value.abort()
  }
  if (isPromise(enterLifeCyclePromises.value)) {
    enterLifeCyclePromises.value.abort()
  }
  if (isPromise(leaveLifeCyclePromises.value)) {
    leaveLifeCyclePromises.value.abort()
  }

  enterPromise.value = null
  enterLifeCyclePromises.value = null
  leaveLifeCyclePromises.value = null
}

/**
 * 处理过渡结束事件
 * 触发相应的生命周期事件
 */
const onTransitionEnd = () => {
  if (transitionEnded.value) return

  transitionEnded.value = true

  if (status.value === 'leave') {
    // 离开后触发
    emit('after-leave')
  } else if (status.value === 'enter') {
    // 进入后触发
    emit('after-enter')
  }

  if (!props.show && display.value) {
    display.value = false
  }
}

/**
 * 获取过渡动画类名
 * @param name 动画名称
 * @returns 包含各个状态类名的对象
 */
const getClassNames = (name?: TransitionName | TransitionName[]) => {
  let enter: string = `${props.enterClass} ${props.enterActiveClass}`
  let enterTo: string = `${props.enterToClass} ${props.enterActiveClass}`
  let leave: string = `${props.leaveClass} ${props.leaveActiveClass}`
  let leaveTo: string = `${props.leaveToClass} ${props.leaveActiveClass}`

  if (Array.isArray(name)) {
    for (let index = 0; index < name.length; index++) {
      enter = `wd-${name[index]}-enter wd-${name[index]}-enter-active ${enter}`
      enterTo = `wd-${name[index]}-enter-to wd-${name[index]}-enter-active ${enterTo}`
      leave = `wd-${name[index]}-leave wd-${name[index]}-leave-active ${leave}`
      leaveTo = `wd-${name[index]}-leave-to wd-${name[index]}-leave-active ${leaveTo}`
    }
  } else if (name) {
    enter = `wd-${name}-enter wd-${name}-enter-active ${enter}`
    enterTo = `wd-${name}-enter-to wd-${name}-enter-active ${enterTo}`
    leave = `wd-${name}-leave wd-${name}-leave-active ${leave}`
    leaveTo = `wd-${name}-leave-to wd-${name}-leave-active ${leaveTo}`
  }

  return {
    enter,
    'enter-to': enterTo,
    leave,
    'leave-to': leaveTo,
  }
}

/**
 * 执行进入动画
 * 包含完整的生命周期流程
 */
const enter = () => {
  enterPromise.value = new AbortablePromise(async (resolve) => {
    try {
      const classNames = getClassNames(props.name)
      const duration = isObj(props.duration) ? (props.duration as any).enter : props.duration

      status.value = 'enter'
      emit('before-enter')

      enterLifeCyclePromises.value = pause()
      await enterLifeCyclePromises.value

      emit('enter')
      classes.value = classNames.enter
      currentDuration.value = duration as number

      enterLifeCyclePromises.value = pause()
      await enterLifeCyclePromises.value

      inited.value = true
      display.value = true

      enterLifeCyclePromises.value = pause()
      await enterLifeCyclePromises.value

      enterLifeCyclePromises.value = null
      transitionEnded.value = false
      classes.value = classNames['enter-to']

      resolve()
    } catch (error) {
      // 异常处理
    }
  })
}

/**
 * 创建定时器 Promise
 * @param duration 持续时间（毫秒）
 * @returns Promise 对象
 */
const setPromise = (duration: number) => {
  return new AbortablePromise<void>((resolve) => {
    const timer = setTimeout(() => {
      clearTimeout(timer)
      resolve()
    }, duration)
  })
}

/**
 * 执行离开动画
 * 包含完整的生命周期流程
 */
const leave = async () => {
  if (!enterPromise.value) {
    transitionEnded.value = false
    return onTransitionEnd()
  }

  try {
    await enterPromise.value
    if (!display.value) return

    const classNames = getClassNames(props.name)
    const duration = isObj(props.duration) ? (props.duration as any).leave : props.duration

    status.value = 'leave'
    emit('before-leave')

    currentDuration.value = duration as number

    leaveLifeCyclePromises.value = pause()
    await leaveLifeCyclePromises.value

    emit('leave')
    classes.value = classNames.leave

    leaveLifeCyclePromises.value = pause()
    await leaveLifeCyclePromises.value

    transitionEnded.value = false
    classes.value = classNames['leave-to']

    leaveLifeCyclePromises.value = setPromise(currentDuration.value)
    await leaveLifeCyclePromises.value

    leaveLifeCyclePromises.value = null
    onTransitionEnd()
    enterPromise.value = null
  } catch (error) {
    // 异常处理
  }
}
/**
 * 处理显示状态变化
 * @param value 是否显示
 */
const handleShow = (value: boolean) => {
  if (value) {
    handleAbortPromise()
    enter()
  } else {
    leave()
  }
}

/**
 * 监听 show 属性变化
 * 控制组件的显示和隐藏动画
 */
watch(
  () => props.show,
  (newVal) => {
    handleShow(newVal)
  },
  { deep: true },
)

/**
 * 组件挂载前的处理
 * 如果初始状态为显示，则执行进入动画
 */
onBeforeMount(() => {
  if (props.show) {
    enter()
  }
})

/**
 * 处理点击事件
 * 触发点击事件
 */
const handleClick = () => {
  emit('click')
}
</script>

<style lang="scss">
// 过渡组件基础样式
.wd-transition {
  transition-timing-function: ease;
}

// 淡入淡出动画
.wd-fade-enter,
.wd-fade-leave-to {
  opacity: 0;
}

.wd-fade-enter-active,
.wd-fade-leave-active {
  transition-property: opacity;
}

// 向上淡入淡出动画
.wd-fade-up-enter,
.wd-fade-up-leave-to {
  transform: translate3d(0, 100%, 0);
  opacity: 0;
}

// 向下淡入淡出动画
.wd-fade-down-enter,
.wd-fade-down-leave-to {
  transform: translate3d(0, -100%, 0);
  opacity: 0;
}

// 向左淡入淡出动画
.wd-fade-left-enter,
.wd-fade-left-leave-to {
  transform: translate3d(-100%, 0, 0);
  opacity: 0;
}

// 向右淡入淡出动画
.wd-fade-right-enter,
.wd-fade-right-leave-to {
  transform: translate3d(100%, 0, 0);
  opacity: 0;
}

// 向上滑动动画
.wd-slide-up-enter,
.wd-slide-up-leave-to {
  transform: translate3d(0, 100%, 0);
}

// 向下滑动动画
.wd-slide-down-enter,
.wd-slide-down-leave-to {
  transform: translate3d(0, -100%, 0);
}

// 向左滑动动画
.wd-slide-left-enter,
.wd-slide-left-leave-to {
  transform: translate3d(-100%, 0, 0);
}

// 向右滑动动画
.wd-slide-right-enter,
.wd-slide-right-leave-to {
  transform: translate3d(100%, 0, 0);
}

// 缩放进入动画
.wd-zoom-in-enter,
.wd-zoom-in-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

// 缩放退出动画
.wd-zoom-out-enter,
.wd-zoom-out-leave-to {
  transform: scale(1.2);
  opacity: 0;
}

// 缩放动画激活状态
.wd-zoom-in-enter-active,
.wd-zoom-in-leave-active,
.wd-zoom-out-enter-active,
.wd-zoom-out-leave-active,
.wd-fade-up-enter-active,
.wd-fade-up-leave-active,
.wd-fade-down-enter-active,
.wd-fade-down-leave-active,
.wd-fade-left-enter-active,
.wd-fade-left-leave-active,
.wd-fade-right-enter-active,
.wd-fade-right-leave-active {
  transition-property: opacity, transform;
}

// 滑动动画激活状态
.wd-slide-up-enter-active,
.wd-slide-up-leave-active,
.wd-slide-down-enter-active,
.wd-slide-down-leave-active,
.wd-slide-left-enter-active,
.wd-slide-left-leave-active,
.wd-slide-right-enter-active,
.wd-slide-right-leave-active {
  transition-property: transform;
}
</style>
