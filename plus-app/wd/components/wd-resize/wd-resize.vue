<!-- Resize 监听元素尺寸变化 当组件包裹的文档流尺寸发生变化时，触发 size 事件。
一般用于监听 dom 内容更新时导致的 dom 尺寸位置的变化，重新获取 dom 尺寸和位置，进行内容展示的计算操作 -->
<template>
  <!-- 根容器：用于包裹整个尺寸检测组件 -->
  <view
    :class="`wd-resize ${customClass}`"
    :style="`width: ${addUnit(width)}; height: ${addUnit(height)}; ${customStyle}`"
  >
    <!--
      检测容器：插槽需要脱离父容器文档流，防止父容器固宽固高，
      进而导致插槽大小被父容器限制，影响尺寸检测的准确性
    -->
    <view :id="resizeId" :class="`wd-resize__container ${customContainerClass}`">
      <!-- 被监听的插槽：用户内容将在此处渲染 -->
      <slot />

      <!--
        监听插槽变大：当插槽尺寸增大时，通过滚动事件来检测变化
        使用极大的占位符元素确保滚动条始终可滚动
      -->
      <scroll-view
        class="wd-resize__wrapper"
        :scroll-y="true"
        :scroll-top="expandScrollTop"
        :scroll-x="true"
        :scroll-left="expandScrollLeft"
        @scroll="onScrollHandler"
      >
        <view
          class="wd-resize__wrapper--placeholder"
          style="height: 100000rpx; width: 100000rpx"
        ></view>
      </scroll-view>

      <!--
        监听插槽变小：当插槽尺寸减小时，通过滚动事件来检测变化
        使用相对大小的占位符元素来检测收缩变化
      -->
      <scroll-view
        class="wd-resize__wrapper"
        :scroll-y="true"
        :scroll-top="shrinkScrollTop"
        :scroll-x="true"
        :scroll-left="shrinkScrollLeft"
        @scroll="onScrollHandler"
      >
        <view class="wd-resize__wrapper--placeholder" style="height: 250%; width: 250%"></view>
      </scroll-view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { getCurrentInstance, onMounted, ref } from 'vue'
import { addUnit, uuid } from '../common/util'

defineOptions({
  name: 'wd-resize',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 尺寸变化检测组件属性接口
 */
interface WdResizeProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string
  /** 自定义容器样式类 */
  customContainerClass?: string
}

/**
 * 尺寸变化检测组件事件接口
 */
interface WdResizeEmits {
  /** 尺寸变化时触发 */
  resize: [boundingClientRect: Record<string, any>]
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdResizeProps>(), {
  customStyle: '',
  customClass: '',
  customContainerClass: '',
})

// 定义组件事件
const emit = defineEmits<WdResizeEmits>()

// 获取当前组件实例
const { proxy } = getCurrentInstance() as any

// 响应式数据：滚动检测相关状态
/** 扩展检测区域的垂直滚动位置 */
const expandScrollTop = ref<number>(0)
/** 收缩检测区域的垂直滚动位置 */
const shrinkScrollTop = ref<number>(0)
/** 扩展检测区域的水平滚动位置 */
const expandScrollLeft = ref<number>(0)
/** 收缩检测区域的水平滚动位置 */
const shrinkScrollLeft = ref<number>(0)
/** 当前容器高度 */
const height = ref<number>(0)
/** 当前容器宽度 */
const width = ref<number>(0)
/** 滚动事件计数器，用于过滤初始化时的无效事件 */
const scrollEventCount = ref<number>(0)
/** 容器唯一标识符，用于选择器查询 */
const resizeId = ref<string>(`resize${uuid()}`)

// 滚动事件处理函数（动态赋值，避免初始化时的空函数调用）
let onScrollHandler = () => {}

/**
 * 滚动位置重置函数
 *
 * 工作原理：
 * 1. 扩展检测：将滚动位置设置到远超当前尺寸的位置，当容器变大时，
 *    滚动位置相对减小，触发滚动事件
 * 2. 收缩检测：将滚动位置设置为当前尺寸的3倍，当容器变小时，
 *    滚动条会自动调整到边界，触发滚动事件
 *
 * 注意：使用 nextTick 可能会有更好的效果，但当前实现已经足够稳定
 *
 * @param params 包含最后宽度和高度的参数对象
 * @param params.lastWidth 上次记录的容器宽度
 * @param params.lastHeight 上次记录的容器高度
 */
const scrollToBottom = ({ lastWidth, lastHeight }: { lastWidth: number; lastHeight: number }) => {
  // 扩展检测：设置一个极大的滚动位置来检测容器变大
  expandScrollTop.value = 100000 + lastHeight
  expandScrollLeft.value = 100000 + lastWidth

  // 收缩检测：设置为当前尺寸的3倍来检测容器变小
  shrinkScrollTop.value = 3 * height.value + lastHeight
  shrinkScrollLeft.value = 3 * width.value + lastWidth
}
/**
 * 组件挂载后的处理
 * 初始化尺寸检测机制：
 * 1. 获取初始容器尺寸
 * 2. 设置滚动监听器
 * 3. 建立尺寸变化检测循环
 */
onMounted(() => {
  // 获取容器初始尺寸信息
  const query = uni
    .createSelectorQuery()
    .in(proxy)
    .select(`#${resizeId.value}`)
    .boundingClientRect()

  query.exec(([res]) => {
    // 使用闭包记录容器的上一次尺寸，用于变化对比
    let lastHeight = res.height
    let lastWidth = res.width

    // 立即同步容器尺寸到组件状态
    height.value = lastHeight
    width.value = lastWidth

    // 定义滚动事件处理器，用于检测尺寸变化
    onScrollHandler = () => {
      const query = uni
        .createSelectorQuery()
        .in(proxy)
        .select(`#${resizeId.value}`)
        .boundingClientRect()

      query.exec(([res]) => {
        // 第一次滚动事件：组件初始化完成，通知外部当前容器尺寸
        if (scrollEventCount.value++ === 0) {
          const result: Record<string, any> = {}
          ;['bottom', 'top', 'left', 'right', 'height', 'width'].forEach((propName) => {
            result[propName] = res[propName]
          })
          emit('resize', result)
        }

        // 过滤掉滚动条初始化时产生的无效事件（前3次）
        if (scrollEventCount.value < 3) return

        // 获取容器的新尺寸
        const newHeight = res.height
        const newWidth = res.width

        // 立即更新组件状态，防止父容器尺寸坍塌
        height.value = newHeight
        width.value = newWidth

        // 检测尺寸变化：只有当宽度或高度发生实际变化时才触发事件
        const emitStack: number[] = []

        if (newHeight !== lastHeight) {
          lastHeight = newHeight
          emitStack.push(1)
        }

        if (newWidth !== lastWidth) {
          lastWidth = newWidth
          emitStack.push(1)
        }

        // 如果检测到尺寸变化，触发 resize 事件
        if (emitStack.length !== 0) {
          const result: Record<string, any> = {}
          ;['bottom', 'top', 'left', 'right', 'height', 'width'].forEach((propName) => {
            result[propName] = res[propName]
          })
          emit('resize', result)
        }

        // 重置滚动位置，为下一次检测做准备
        scrollToBottom({ lastWidth, lastHeight })
      })
    }

    // 初始化滚动位置，启动检测机制
    scrollToBottom({ lastWidth, lastHeight })
  })
})
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 尺寸变化检测组件样式
@include b(resize) {
  // 容器样式
  @include e(container) {
    position: absolute;
    min-width: 2rpx;
    min-height: 2rpx;
  }

  // 包装器样式
  @include e(wrapper) {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -9999;
    overflow: hidden;
    visibility: hidden;

    // 占位符修饰符
    @include m(placeholder) {
      transition: 0s;
      animation: none;
    }
  }
}
</style>
