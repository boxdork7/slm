<!-- Tooltip 文字提示 常用于展示提示信息。 -->
<template>
  <view
    id="tooltip"
    :class="`wd-tooltip ${customClass}`"
    :style="customStyle"
    @click.stop="popover.noop"
  >
    <!-- 用于为渲染获取宽高的元素 -->
    <view id="pos" class="wd-tooltip__pos wd-tooltip__hidden">
      <view class="custom-pop wd-tooltip__container">
        <view v-if="!useContentSlot" class="wd-tooltip__inner">
          {{ content }}
        </view>
      </view>
    </view>
    <wd-transition
      custom-class="wd-tooltip__pos"
      :custom-style="popover.popStyle.value"
      :show="showTooltip"
      name="fade"
      :duration="200"
    >
      <view class="wd-tooltip__container custom-pop">
        <view
          v-if="visibleArrow"
          :class="`wd-tooltip__arrow ${popover.arrowClass.value} ${customArrow}`"
          :style="popover.arrowStyle.value"
        />
        <!-- 普通模式 -->
        <view v-if="!useContentSlot" class="wd-tooltip__inner">
          {{ content }}
        </view>
        <!-- 用户自定义样式 -->
        <slot v-else name="content" />
      </view>
      <wd-icon
        v-if="showClose"
        name="close"
        custom-class="wd-tooltip__close-icon"
        @click="toggle"
      />
    </wd-transition>
    <view id="target" class="wd-tooltip__target" @click="toggle">
      <slot />
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
import { usePopover } from '../composables/usePopover'
import { queueKey } from '../composables/useQueue'
import wdIcon from '../wd-icon/wd-icon.vue'
import wdTransition from '../wd-transition/wd-transition.vue'

defineOptions({
  name: 'WdTooltip',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * Tooltip位置类型
 */
type PlacementType =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end'

/**
 * Tooltip组件属性接口
 */
interface WdTooltipProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 自定义箭头内容 */
  customArrow?: string
  /** 自定义弹出内容 */
  customPop?: string

  /** 是否显示Tooltip箭头 */
  visibleArrow?: boolean
  /** 显示的内容，也可以通过slot#content传入 */
  content?: string | Array<Record<string, any>>
  /** Tooltip的出现位置 */
  placement?: PlacementType
  /** 出现位置的偏移量，支持数字、数组、对象类型 */
  offset?: number | Array<number> | Record<'x' | 'y', number>
  /** 是否使用slot来传入content内容 */
  useContentSlot?: boolean
  /** Tooltip是否可用 */
  disabled?: boolean
  /** 是否显示Tooltip内部的关闭按钮 */
  showClose?: boolean
  /** Tooltip的状态是否可见，通过v-model绑定 */
  modelValue?: boolean
}

/**
 * Tooltip组件事件接口
 */
interface WdTooltipEmits {
  /** 更新modelValue */
  'update:modelValue': [value: boolean]
  /** 菜单点击事件 */
  menuclick: []
  /** 状态变化事件 */
  change: [data: { show: boolean }]
  /** 打开事件 */
  open: []
  /** 关闭事件 */
  close: []
}

/**
 * Tooltip组件暴露的方法接口
 */
interface WdTooltipExpose {
  /** 打开tooltip */
  open: () => void
  /** 关闭tooltip */
  close: () => void
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdTooltipProps>(), {
  customStyle: '',
  customClass: '',
  customArrow: '',
  customPop: '',
  visibleArrow: true,
  placement: 'bottom',
  offset: 0,
  useContentSlot: false,
  disabled: false,
  showClose: false,
  modelValue: false,
})

// 定义组件事件
const emit = defineEmits<WdTooltipEmits>()

// 响应式数据和实例引用
const popover = usePopover(props.visibleArrow)
const queue = inject<Queue | null>(queueKey, null)
const selector: string = 'tooltip'
const { proxy } = getCurrentInstance() as any
const showTooltip = ref<boolean>(false)

/**
 * 监听内容变化
 * 当内容为null或undefined时显示警告
 */
watch(
  () => props.content,
  (newVal) => {
    if (newVal === null || newVal === undefined) {
      console.error(`[wot-design] warning(wd-tooltip): content can't be null or undefined`)
    }
  },
)

/**
 * 监听位置变化
 * 当位置发生变化时，重新初始化popover
 */
watch(
  () => props.placement,
  () => {
    popover.init(props.placement, props.visibleArrow, selector)
  },
)

/**
 * 监听modelValue变化
 * 同步外部状态到内部显示状态
 */
watch(
  () => props.modelValue,
  (newValue) => {
    showTooltip.value = newValue
  },
)

/**
 * 监听内部显示状态变化
 * 处理显示逻辑和事件触发
 */
watch(
  () => showTooltip.value,
  (newValue) => {
    if (newValue) {
      popover.control(props.placement, props.offset)
      if (queue && queue.closeOther) {
        queue.closeOther(proxy)
      } else {
        closeOther(proxy)
      }
    }
    popover.showStyle.value = newValue ? 'display: inline-block;' : 'display: none;'
    emit('change', { show: newValue })
    newValue ? emit('open') : emit('close')
  },
)

/**
 * 组件挂载后初始化
 */
onMounted(() => {
  popover.init(props.placement, props.visibleArrow, selector)
})

/**
 * 组件挂载前的处理
 * 添加到队列并设置初始样式
 */
onBeforeMount(() => {
  if (queue && queue.pushToQueue) {
    queue.pushToQueue(proxy)
  } else {
    pushToQueue(proxy)
  }
  popover.showStyle.value = props.modelValue ? 'opacity: 1;' : 'opacity: 0;'
})

/**
 * 组件卸载前的清理
 * 从队列中移除
 */
onBeforeUnmount(() => {
  if (queue && queue.removeFromQueue) {
    queue.removeFromQueue(proxy)
  } else {
    removeFromQueue(proxy)
  }
})

/**
 * 更新modelValue值
 * 同时更新内部状态和触发事件
 */
const updateModelValue = (value: boolean) => {
  showTooltip.value = value
  emit('update:modelValue', value)
}

/**
 * 切换tooltip显示状态
 * 如果组件被禁用则不执行
 */
const toggle = () => {
  if (props.disabled) return
  updateModelValue(!showTooltip.value)
}

/**
 * 打开tooltip
 */
const open = () => {
  updateModelValue(true)
}

/**
 * 关闭tooltip
 */
const close = () => {
  updateModelValue(false)
}

// 暴露组件方法
defineExpose<WdTooltipExpose>({
  open,
  close,
})

/** 工具提示组件实例类型 */
export type TooltipInstance = ComponentPublicInstance<WdTooltipProps, WdTooltipExpose>
</script>

<style lang="scss">
// 引入外部样式文件
@import './../common/abstracts/_mixin.scss';
@import './../common/abstracts/variable.scss';

// 暗色主题样式
.wot-theme-dark {
  @include b(tooltip) {
    @include e(pos) {
      background: $-dark-background4;
      color: $-tooltip-color;
    }

    @include triangleArrow($-tooltip-arrow-size, $-dark-background4);
  }
}

// Tooltip组件样式
@include b(tooltip) {
  position: relative;
  display: inline-block;

  @include edeep(pos) {
    position: absolute;
    min-width: 276rpx;
    min-height: 72rpx;
    font-size: $-tooltip-fs;
    backdrop-filter: blur($-tooltip-blur);
    background-clip: padding-box;
    border-radius: $-tooltip-radius;
    background: $-tooltip-bg;
    color: $-tooltip-color;
    text-align: center;
    box-sizing: border-box;
    z-index: $-tooltip-z-index;
  }

  @include e(hidden) {
    left: -100vw;
    bottom: -100vh;
    visibility: hidden;
  }

  @include e(container) {
    line-height: $-tooltip-line-height;
    font-size: $-tooltip-fs;
  }

  @include e(inner) {
    padding: $-tooltip-padding;
    white-space: nowrap;
    line-height: $-tooltip-line-height;
  }

  @include edeep(close-icon) {
    font-size: 24rpx;
    position: absolute;
    right: -16rpx;
    top: -20rpx;
    transform: scale(0.5);
    padding: 20rpx;
  }

  @include triangleArrow($-tooltip-arrow-size, $-tooltip-bg);
}
</style>
