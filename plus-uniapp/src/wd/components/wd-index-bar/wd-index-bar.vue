<!-- IndexBar 索引栏 用于列表的索引分类显示和快速定位。 -->
<template>
  <view :id="indexBarId" class="wd-index-bar">
    <!-- #ifdef MP-DINGTALK -->
    <view :id="indexBarId" class="wd-index-bar">
      <!-- #endif -->
      <scroll-view
        :scroll-top="scrollState.scrollTop"
        :scroll-y="true"
        class="wd-index-bar__content"
        @scroll="hanleScroll"
      >
        <slot />
      </scroll-view>
      <view
        class="wd-index-bar__sidebar"
        @touchstart.stop.prevent="handleTouchStart"
        @touchmove.stop.prevent="handleTouchMove"
        @touchend.stop.prevent="handleTouchEnd"
        @touchcancel.stop.prevent="handleTouchEnd"
      >
        <view
          v-for="item in children"
          :key="item.index"
          class="wd-index-bar__index"
          :class="{ 'is-active': item.index === state.activeIndex }"
        >
          {{ item.index }}
        </view>
      </view>
      <!-- #ifdef MP-DINGTALK -->
    </view>
    <!-- #endif -->
  </view>
</template>

<script lang="ts" setup>
import { getCurrentInstance, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { getRect, isDef, pause, rpxToPx, uuid } from '../common/util'
import { useChildren } from '../composables/useChildren'
import { indexBarInjectionKey } from './wd-index-bar-key'

defineOptions({
  name: 'WdIndexBar',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 锚点索引类型
 */
export type AnchorIndex = number | string

/**
 * 索引栏组件属性接口
 */
export interface WdIndexBarProps {
  /** 索引是否吸顶 */
  sticky?: boolean
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdIndexBarProps>(), {
  sticky: false,
})

// 索引栏唯一ID
const indexBarId = ref<string>(`indexBar${uuid()}`)

// 获取当前组件实例
const { proxy } = getCurrentInstance()!

// 组件状态
const state = reactive({
  activeIndex: null as AnchorIndex | null,
})

// 子组件管理
const { linkChildren, children } = useChildren(indexBarInjectionKey)

// 向子组件提供数据
linkChildren({ props, anchorState: state })

/**
 * 监听子组件变化
 * 当子组件发生变化时，更新激活索引
 */
watch(
  () => children,
  (newValue) => {
    if (!newValue.length) {
      state.activeIndex = null
      return
    }

    if (!isDef(state.activeIndex) || !newValue.find((item) => item.index === state.activeIndex)) {
      state.activeIndex = newValue[0].index
    }
  },
  { deep: true, immediate: true },
)

// 滚动状态（使用 px 作为 scroll-view 的 scrollTop 单位）
const scrollState = reactive({
  scrollTop: 0, // 即将滚动到的位置（px）
  prevScrollTop: 0, // 上次记录的位置（px）
  touching: false, // 是否正在触摸
})

// 组件距离页面顶部的高度（px）
let offsetTop = 0

// 侧边栏信息（px）
const sidebarInfo = {
  offsetTop: 0, // 侧边栏距离顶部的高度（px）
  indexHeight: rpxToPx(48), // 索引项高度，48rpx 转换为 px
}

/**
 * 初始化组件位置信息
 * 计算索引栏和侧边栏的位置信息
 */
const init = () => {
  setTimeout(() => {
    Promise.all([
      getRect(`#${indexBarId.value}`, false, proxy),
      getRect('.wd-index-bar__sidebar', false, proxy),
      getRect('.wd-index-bar__index', false, proxy),
    ]).then(([bar, sidebar, index]) => {
      offsetTop = bar.top!
      sidebarInfo.offsetTop = sidebar.top!
      sidebarInfo.indexHeight = index.height!
    })
  }, 100)
}

/**
 * 组件挂载后初始化
 */
onMounted(() => {
  init()
})

/**
 * 处理滚动事件
 * 根据滚动位置更新激活的索引
 */
const hanleScroll = (scrollEvent: any) => {
  if (scrollState.touching) {
    return
  }

  const { detail } = scrollEvent
  const scrolltop = Math.floor(detail.scrollTop)

  const anchor = children.find((item, index) => {
    if (!isDef(children[index + 1])) return true
    return (
      item.$.exposed!.top.value - offsetTop <= scrolltop &&
      children[index + 1].$.exposed!.top.value - offsetTop > scrolltop
    )
  })

  if (isDef(anchor) && state.activeIndex !== anchor.index) {
    state.activeIndex = anchor.index
  }

  scrollState.prevScrollTop = scrolltop
}

/**
 * 根据Y坐标获取对应的锚点
 */
const getAnchorByPageY = (pageY: number) => {
  const y = pageY - sidebarInfo.offsetTop
  let idx = Math.floor(y / sidebarInfo.indexHeight)
  if (idx < 0) idx = 0
  else if (idx > children.length - 1) idx = children.length - 1
  return children[idx]
}

/**
 * 处理触摸开始事件
 */
const handleTouchStart = () => {
  scrollState.touching = true
}

/**
 * 设置滚动位置
 * 处理滚动位置的更新逻辑
 */
const setScrollTop = (top: number) => {
  if (scrollState.scrollTop === top) {
    scrollState.scrollTop = scrollState.prevScrollTop
    nextTick(() => {
      scrollState.scrollTop = top
    })
  } else {
    scrollState.scrollTop = top
  }
}

/**
 * 处理触摸移动事件
 * 根据触摸位置更新激活索引并滚动到对应位置
 */
const handleTouchMove = (e: TouchEvent) => {
  const clientY = e.touches[0].pageY
  if (state.activeIndex === getAnchorByPageY(clientY).index) {
    return
  }
  state.activeIndex = getAnchorByPageY(clientY).index
  setScrollTop(getAnchorByPageY(clientY).$.exposed!.top.value - offsetTop)
}

/**
 * 处理触摸结束事件
 */
const handleTouchEnd = async (e: TouchEvent) => {
  const clientY = e.changedTouches[0].pageY
  state.activeIndex = getAnchorByPageY(clientY).index
  setScrollTop(getAnchorByPageY(clientY).$.exposed!.top.value - offsetTop)

  await pause()
  scrollState.touching = false
}
</script>

<style lang="scss">
// 引入外部样式文件
@import './../common/abstracts/_mixin.scss';
@import './../common/abstracts/variable.scss';

// 暗色主题样式
.wot-theme-dark {
  @include b(index-bar) {
    @include e(index) {
      color: $-color-white;
    }
  }
}

// 索引栏样式
@include b(index-bar) {
  position: relative;
  width: 100%;
  height: 100%;

  @include e(content) {
    width: 100%;
    height: 100%;
  }

  @include e(sidebar) {
    position: absolute;
    top: 50%;
    right: 8rpx;
    transform: translateY(-50%);
  }

  @include e(index) {
    font-size: 24rpx;
    font-weight: $-fw-medium;
    color: $-color-title;
    padding: 8rpx 12rpx;

    @include when(active) {
      color: $-color-theme;
    }
  }
}
</style>
