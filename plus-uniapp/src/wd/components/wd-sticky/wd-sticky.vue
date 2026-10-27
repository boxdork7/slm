<!-- Sticky 粘性布局 粘性布局组件，用于在页面滚动时将元素固定在指定位置。 -->
<template>
  <view :style="`${rootStyle};display: inline-block;`">
    <view :id="styckyId" :class="`wd-sticky ${customClass}`" :style="stickyStyle">
      <view class="wd-sticky__container" :style="containerStyle">
        <wd-resize @resize="handleResize" custom-style="display: inline-block;">
          <slot />
        </wd-resize>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { ComponentPublicInstance, CSSProperties } from 'vue'
import { computed, getCurrentInstance, reactive, ref } from 'vue'
import { addUnit, getRect, objToStyle, pause, uuid } from '../common/util'
import { useParent } from '../composables/useParent'
import wdResize from '../wd-resize/wd-resize.vue'
import { STICKY_BOX_KEY } from '../wd-sticky-box/wd-sticky-box-key'

defineOptions({
  name: 'WdSticky',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 粘性布局组件属性接口
 */
interface WdStickyProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 层级 */
  zIndex?: number
  /** 吸顶距离 */
  offsetTop?: number
}

/**
 * 粘性定位组件暴露方法接口
 */
interface WdStickyExpose {
  /** 设置位置 */
  setPosition: (boxLeaved: boolean, position: string, top: number) => void
  /** 粘性状态 */
  stickyState: {
    position: string
    boxLeaved: boolean
    top: number
    height: number
    width: number
    state: string
  }
  /** 偏移顶部距离 */
  offsetTop: number
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdStickyProps>(), {
  customStyle: '',
  customClass: '',
  zIndex: 1,
  offsetTop: 0,
})

// 响应式数据
const styckyId = ref<string>(`wd-sticky${uuid()}`)
const observerList = ref<UniApp.IntersectionObserver[]>([])

const stickyState = reactive({
  position: 'absolute',
  boxLeaved: false,
  top: 0,
  height: 0,
  width: 0,
  state: '',
})

const { parent: stickyBox } = useParent(STICKY_BOX_KEY)

const { proxy } = getCurrentInstance() as any

/**
 * 清除对当前组件的监听
 */
const clearObserver = () => {
  while (observerList.value.length !== 0) {
    observerList.value.pop()!.disconnect()
  }
}

/**
 * 添加对当前组件的监听
 */
const createObserver = () => {
  const observer = uni.createIntersectionObserver(proxy, { thresholds: [0, 0.5] })
  observerList.value.push(observer)
  return observer
}

/**
 * 设置位置
 * @param boxLeaved 是否离开容器
 * @param position 定位方式
 * @param top 顶部位置
 */
const setPosition = (boxLeaved: boolean, position: string, top: number) => {
  stickyState.boxLeaved = boxLeaved
  stickyState.position = position
  stickyState.top = top
}
/**
 * 计算内部偏移顶部距离
 */
const innerOffsetTop = computed(() => {
  let top: number
  // #ifdef H5
  // H5端，导航栏为普通元素，需要将组件移动到导航栏的下边沿
  // H5的导航栏高度为44px
  top = 44
  // #endif

  return top + props.offsetTop
})

/**
 * 根据位置进行吸顶
 */
const handleRelativeTo = ({ boundingClientRect }: any) => {
  // sticky 高度大于或等于 wd-sticky-box，使用 wd-sticky-box 无任何意义
  if (stickyBox && stickyBox.boxStyle && stickyState.height >= stickyBox.boxStyle.height) {
    stickyState.position = 'absolute'
    stickyState.top = 0
    return
  }

  let isStycky = boundingClientRect.top <= innerOffsetTop.value
  // #ifdef H5 || APP-PLUS
  isStycky = boundingClientRect.top < innerOffsetTop.value
  // #endif

  if (isStycky) {
    stickyState.state = 'sticky'
    stickyState.boxLeaved = false
    stickyState.position = 'fixed'
    stickyState.top = innerOffsetTop.value
  } else {
    stickyState.state = 'normal'
    stickyState.boxLeaved = false
    stickyState.position = 'absolute'
    stickyState.top = 0
  }
}

/**
 * 监听吸顶元素滚动事件
 */
const observerContentScroll = () => {
  if (stickyState.height === 0 && stickyState.width === 0) return
  const offset = innerOffsetTop.value + stickyState.height
  clearObserver()
  createObserver()
    .relativeToViewport({
      top: -offset,
    })
    .observe(`#${styckyId.value}`, (result) => {
      handleRelativeTo(result)
    })
  getRect(`#${styckyId.value}`, false, proxy).then((res) => {
    // #ifdef H5
    // H5端，查询节点信息未计算导航栏高度
    res.bottom = Number(res.bottom) + 44
    // #endif
    if (Number(res.bottom) <= offset) handleRelativeTo({ boundingClientRect: res })
  })
}

/**
 * 当前内容高度发生变化时重置监听
 */
const handleResize = async (detail: any) => {
  stickyState.width = detail.width
  stickyState.height = detail.height
  await pause()
  observerContentScroll()
  if (!stickyBox || !stickyBox.observerForChild) return
  stickyBox.observerForChild(proxy)
}

/**
 * 计算根元素样式
 */
const rootStyle = computed(() => {
  const style: CSSProperties = {
    zIndex: props.zIndex,
    height: addUnit(stickyState.height),
    width: addUnit(stickyState.width),
  }
  if (!stickyState.boxLeaved) {
    style.position = 'relative'
  }
  return `${objToStyle(style)}${props.customStyle}`
})

/**
 * 计算粘性元素样式
 */
const stickyStyle = computed(() => {
  const style: CSSProperties = {
    zIndex: props.zIndex,
    height: addUnit(stickyState.height),
    width: addUnit(stickyState.width),
  }
  if (!stickyState.boxLeaved) {
    style.position = 'relative'
  }
  return `${objToStyle(style)}`
})

/**
 * 计算容器样式
 */
const containerStyle = computed(() => {
  const style: CSSProperties = {
    position: stickyState.position as 'static' | 'relative' | 'absolute' | 'sticky' | 'fixed',
    top: addUnit(stickyState.top),
  }
  return objToStyle(style)
})

// 暴露给父组件的方法和数据
defineExpose<WdStickyExpose>({
  setPosition,
  stickyState,
  offsetTop: props.offsetTop,
})

/** 粘性定位组件实例类型 */
export type StickyInstance = ComponentPublicInstance<WdStickyProps, WdStickyExpose>
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 粘性布局组件样式
@include b(sticky) {
  display: inline-block;

  @include e(container) {
    display: inline-block;
  }
}
</style>
