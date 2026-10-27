<!-- Popover 气泡 常用于展示提示信息。 -->
<template>
  <view
    id="popover"
    :class="`wd-popover ${customClass}`"
    :style="customStyle"
    @click.stop="popover.noop"
  >
    <!-- 使用插槽时无法获取正确宽高 -->
    <view id="pos" class="wd-popover__pos wd-popover__hidden">
      <view :class="`wd-popover__container ${customPop}`">
        <view v-if="!useContentSlot && mode === 'normal'" class="wd-popover__inner">
          {{ content }}
        </view>
        <view
          v-if="!useContentSlot && mode === 'menu' && typeof content === 'object'"
          class="wd-popover__menu"
        >
          <view
            v-for="(item, index) in content"
            :key="index"
            class="wd-popover__menu-inner"
            @click="menuClick(index)"
          >
            <wd-icon v-if="item.iconClass" :name="item.iconClass" custom-class="wd-popover__icon" />
            <text>{{ item.content }}</text>
          </view>
        </view>
      </view>
    </view>
    <wd-transition
      custom-class="wd-popover__pos"
      :custom-style="popover.popStyle.value"
      :show="showPopover"
      name="fade"
      :duration="200"
    >
      <view :class="`wd-popover__container ${customPop}`">
        <view
          v-if="visibleArrow"
          :class="`wd-popover__arrow ${popover.arrowClass.value} ${customArrow}`"
          :style="popover.arrowStyle.value"
        />
        <!-- 普通模式 -->
        <view v-if="!useContentSlot && mode === 'normal'" class="wd-popover__inner">
          {{ content }}
        </view>
        <!-- 列表模式 -->
        <view v-if="!useContentSlot && mode === 'menu'" class="wd-popover__menu">
          <view
            v-for="(item, index) in content"
            :key="index"
            class="wd-popover__menu-inner"
            :style="index === 0 ? 'border-top: none' : ''"
            @click="menuClick(index)"
          >
            <wd-icon
              v-if="typeof item === 'object' && item.iconClass"
              :name="item.iconClass"
              custom-class="wd-popover__icon"
            />
            <view style="display: inline-block">
              {{ typeof item === 'object' && item.content ? item.content : '' }}
            </view>
          </view>
        </view>
        <!-- 用户自定义样式 -->
        <slot v-else name="content" />
      </view>
      <wd-icon
        v-if="showClose"
        name="close"
        custom-class="wd-popover__close-icon"
        @click="toggle"
      />
    </wd-transition>
    <view id="target" class="wd-popover__target" @click="toggle">
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
import { isArray } from '../common/util'
import { usePopover } from '../composables/usePopover'
import { queueKey } from '../composables/useQueue'
import wdIcon from '../wd-icon/wd-icon.vue'
import wdTransition from '../wd-transition/wd-transition.vue'

defineOptions({
  name: 'WdPopover',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 弹出位置类型
 */
export type PlacementType =
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
 * 弹出框模式
 */
type PopoverMode = 'menu' | 'normal'

/**
 * 气泡组件属性接口
 */
interface WdPopoverProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 自定义箭头样式类 */
  customArrow?: string
  /** 自定义弹出层样式类 */
  customPop?: string
  /** 是否显示 popover 箭头 */
  visibleArrow?: boolean
  /** 显示的内容，也可以通过 slot#content 传入 */
  content?: string | Record<string, any>[]
  /** 指定 popover 的放置位置 */
  placement?: PlacementType
  /** 偏移量 */
  offset?: number
  /** 是否使用内容插槽 */
  useContentSlot?: boolean
  /** 是否禁用 popover */
  disabled?: boolean
  /** 是否显示关闭按钮 */
  showClose?: boolean
  /** 控制 popover 的显示状态 */
  modelValue?: boolean
  /** 当前显示的模式，决定内容的展现形式，可选值：normal（普通模式）/ menu（菜单模式） */
  mode?: PopoverMode
}

/**
 * 气泡组件事件接口
 */
interface WdPopoverEmits {
  /** 显示状态更新时触发 */
  'update:modelValue': [value: boolean]
  /** 菜单项点击时触发 */
  menuclick: [{ item: Record<string, any>; index: number }]
  /** 显示状态变化时触发 */
  change: [{ show: boolean }]
  /** 打开时触发 */
  open: []
  /** 关闭时触发 */
  close: []
}

/**
 * 气泡组件暴露的方法接口
 */
interface WdPopoverExpose {
  /** 打开popover */
  open: () => void
  /** 关闭popover */
  close: () => void
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdPopoverProps>(), {
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
  mode: 'normal',
})

// 定义组件事件
const emit = defineEmits<WdPopoverEmits>()

// 响应式数据
const showPopover = ref<boolean>(false) // 控制popover显隐

// 获取相关实例和组合式函数
const queue = inject<Queue | null>(queueKey, null)
const selector: string = 'popover'
const { proxy } = getCurrentInstance() as any
const popover = usePopover(props.visibleArrow)

/**
 * 监听内容变化
 * 验证不同模式下内容类型的正确性
 */
watch(
  () => props.content,
  (newVal) => {
    const { mode } = props
    if (mode === 'normal' && typeof newVal !== 'string') {
      console.error('The value type must be a string type in normal mode')
    } else if (mode === 'menu' && !isArray(newVal)) {
      console.error('The value type must be a Array type in menu mode')
    }
  },
)

/**
 * 监听位置变化
 * 重新初始化弹出框位置
 */
watch(
  () => props.placement,
  () => {
    popover.init(props.placement, props.visibleArrow, selector)
  },
)

/**
 * 监听外部控制的显示状态
 * 同步内部状态
 */
watch(
  () => props.modelValue,
  (newValue) => {
    showPopover.value = newValue
  },
)

/**
 * 监听内部显示状态变化
 * 处理弹出框的显示逻辑和事件触发
 */
watch(
  () => showPopover.value,
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
 * 更新显示状态
 * @param value 新的显示状态
 */
const updateModelValue = (value: boolean) => {
  showPopover.value = value
  emit('update:modelValue', value)
}
/**
 * 菜单项点击处理
 * @param index 点击的菜单项索引
 */
const menuClick = (index: number) => {
  updateModelValue(false)
  emit('menuclick', {
    item: (props.content as Array<Record<string, any>>)[index],
    index,
  })
}

/**
 * 切换显示状态
 * 如果未禁用则切换当前显示状态
 */
const toggle = () => {
  if (props.disabled) return
  updateModelValue(!showPopover.value)
}

/**
 * 打开弹出框
 */
const open = () => {
  updateModelValue(true)
}

/**
 * 关闭弹出框
 */
const close = () => {
  updateModelValue(false)
}

/**
 * 组件挂载后初始化
 * 设置弹出框的位置和箭头
 */
onMounted(() => {
  popover.init(props.placement, props.visibleArrow, selector)
})

/**
 * 组件挂载前处理
 * 添加到队列管理和设置初始样式
 */
onBeforeMount(() => {
  if (queue && queue.pushToQueue) {
    queue.pushToQueue(proxy)
  } else {
    pushToQueue(proxy)
  }
  popover.showStyle.value = showPopover.value ? 'opacity: 1;' : 'opacity: 0;'
})

/**
 * 组件卸载前清理
 * 从队列中移除
 */
onBeforeUnmount(() => {
  if (queue && queue.removeFromQueue) {
    queue.removeFromQueue(proxy)
  } else {
    removeFromQueue(proxy)
  }
})

// 暴露组件方法
defineExpose<WdPopoverExpose>({
  open,
  close,
})

/** 气泡提示组件实例类型 */
export type PopoverInstance = ComponentPublicInstance<WdPopoverProps, WdPopoverExpose>
</script>

<style lang="scss">
// 引入外部样式文件
@import './../common/abstracts/_mixin.scss';
@import './../common/abstracts/variable.scss';

// 暗色主题样式
.wot-theme-dark {
  @include b(popover) {
    @include e(pos) {
      background: rgb(75, 76, 77);
      color: $-dark-color;
      box-shadow: 0 4rpx 20rpx 0 rgba(75, 76, 77, 0.1);
    }

    @include e(menu) {
      background: rgb(75, 76, 77);
    }

    @include e(inner) {
      background-color: rgb(75, 76, 77);
    }

    @include e(menu-inner) {
      @include halfPixelBorder('top', 0, $-dark-border-color);
    }

    @include squareArrow(
      $-popover-arrow-size,
      rgb(75, 76, 77),
      $-popover-z-index - 1,
      $-popover-arrow-box-shadow
    );
  }
}

// 气泡组件主体样式
@include b(popover) {
  position: relative;
  display: inline-block;

  // 图标样式
  @include edeep(icon) {
    vertical-align: middle;
    font-size: 36rpx;
    margin-right: 10rpx;
  }

  // 菜单内部样式
  @include e(menu-inner) {
    position: relative;
    padding: $-popover-padding 0;
    display: flex;
    align-items: center;

    @include halfPixelBorder('top', 0, $-popover-border-color);

    &:first-child::after {
      display: none;
    }
  }

  // 菜单样式
  @include e(menu) {
    display: inline-block;
    padding: 0 $-popover-padding;
    white-space: nowrap;
    z-index: $-popover-z-index;
    position: relative;
    background: $-popover-bg;
    border-radius: $-popover-radius;
  }

  // 弹出位置样式
  @include edeep(pos) {
    position: absolute;
    box-sizing: border-box;
    background-clip: padding-box;
    text-align: center;
    min-height: 72rpx;
    z-index: $-popover-z-index;
    line-height: $-popover-line-height;
    font-size: $-popover-fs;
    border-radius: $-popover-radius;
    transition: opacity 0.2s;
    background: $-popover-bg;
    box-shadow: $-popover-box-shadow;
    color: $-popover-color;
  }

  // 隐藏状态
  @include e(hidden) {
    left: -100vw;
    visibility: hidden;
  }

  // 容器样式
  @include e(container) {
    position: relative;
    line-height: $-tooltip-line-height;
    font-size: $-tooltip-fs;
  }

  // 内部样式
  @include e(inner) {
    position: relative;
    white-space: nowrap;
    padding: $-popover-padding;
    line-height: $-popover-line-height;
    z-index: $-popover-z-index;
    background-color: $-popover-bg;
    border-radius: $-popover-radius;
  }

  // 关闭图标样式
  @include edeep(close-icon) {
    font-size: 24rpx;
    position: absolute;
    right: -16rpx;
    top: -20rpx;
    transform: scale(0.5);
    padding: 20rpx;
  }

  // 箭头样式
  @include squareArrow(
    $-popover-arrow-size,
    $-popover-bg,
    $-popover-z-index - 1,
    $-popover-arrow-box-shadow
  );
}
</style>
