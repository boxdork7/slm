<!-- DropMenu 下拉菜单 向下或向上弹出的菜单列表。 -->
<template>
  <view
    :id="dropMenuId"
    :style="customStyle"
    :class="`wd-drop-menu ${customClass}`"
    @click.stop.prevent="noop"
  >
    <wd-overlay
      v-if="modal"
      :show="overlayVisible"
      :duration="duration"
      :z-index="12"
      :custom-style="modalStyle"
      @click="handleClickOverlay"
      @touchmove="noop"
    />

    <!-- #ifdef MP-DINGTALK -->
    <view :id="dropMenuId">
      <!-- #endif -->
      <view class="wd-drop-menu__list">
        <view
          v-for="(child, index) in children"
          :key="index"
          :class="`wd-drop-menu__item ${child.disabled ? 'is-disabled' : ''} ${child.$.exposed!.getShowPop() ? 'is-active' : ''}`"
          @click="toggle(child)"
        >
          <view class="wd-drop-menu__item-title">
            <view class="wd-drop-menu__item-title-text">{{ getDisplayTitle(child) }}</view>
            <wd-icon :name="child.icon" :size="child.iconSize" custom-class="wd-drop-menu__arrow" />
          </view>
        </view>
      </view>
      <slot />
      <!-- #ifdef MP-DINGTALK -->
    </view>
    <!-- #endif -->
  </view>
</template>

<script lang="ts" setup>
import type { Queue } from '../composables/useQueue'
import { computed, getCurrentInstance, inject, onBeforeMount, ref, watch } from 'vue'
import { closeOther } from '../common/clickoutside'
import { addUnit, getRect, pxToRpx, uuid } from '../common/util'
import { useChildren } from '../composables/useChildren'
import { queueKey } from '../composables/useQueue'
import wdIcon from '../wd-icon/wd-icon.vue'
import wdOverlay from '../wd-overlay/wd-overlay.vue'
import { DROP_MENU_KEY } from './wd-drop-menu-key'

defineOptions({
  name: 'WdDropMenu',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 下拉菜单方向类型
 */
export type DropDirction = 'up' | 'down'

/**
 * 下拉菜单组件属性接口
 */
interface WdDropMenuProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 弹框层级 */
  zIndex?: number
  /** 菜单展开方向，可选值为up或down */
  direction?: DropDirction
  /** 是否展示蒙层 */
  modal?: boolean
  /** 是否点击蒙层时关闭 */
  closeOnClickModal?: boolean
  /** 菜单展开收起动画时间，单位ms */
  duration?: number
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdDropMenuProps>(), {
  customStyle: '',
  customClass: '',
  zIndex: 12,
  direction: 'down',
  modal: true,
  closeOnClickModal: true,
  duration: 200,
})

// 注入队列管理器
const queue = inject<Queue | null>(queueKey, null)

// 响应式数据
const dropMenuId = ref<string>(`dropMenuId${uuid()}`)
const offset = ref<number>(0)
const windowHeight = ref<number>(0)
const overlayVisible = ref(false)

// 延迟关闭遮罩层定时器
let overlayTimer: ReturnType<typeof setTimeout> | null

// 获取当前组件实例
const { proxy } = getCurrentInstance() as any

// 管理子组件
const { linkChildren, children } = useChildren(DROP_MENU_KEY)

/**
 * 计算模态层样式
 * 根据展开方向计算位置样式
 */
const modalStyle = computed(() => {
  return props.direction === 'down'
    ? `top: ${addUnit(offset.value)}; bottom: 0;`
    : `top: 0; bottom: ${addUnit(offset.value)}`
})

/**
 * 计算是否需要显示遮罩层
 * 当有子菜单项打开时显示遮罩层
 */
const showOverlay = computed(() => {
  return children.some((child) => child.$.exposed!.getShowPop())
})

/**
 * 空操作函数
 * 用于阻止事件冒泡
 */
const noop = () => {}

/**
 * 获取显示标题
 * 优先显示设置的title，否则根据选中值在options中查找对应的标题
 * @param child 子组件实例
 * @returns 显示的标题文本
 */
const getDisplayTitle = (child: any): string => {
  const { title, modelValue, options, valueKey, labelKey } = child

  if (title) {
    return title
  }

  for (let i = 0, len = options.length; i < len; i++) {
    if (modelValue === options[i][valueKey]) {
      return options[i][labelKey]
    }
  }

  console.error(
    '[wot-design] warning(wd-drop-menu-item): no value is matched in the options option.',
  )
  return ''
}

/**
 * 控制菜单内容是否展开
 * 计算下拉菜单的偏移位置并切换显示状态
 * @param child 子组件实例
 */
const fold = (child: any) => {
  getRect(`#${dropMenuId.value}`, false, proxy).then((rect) => {
    if (!rect) return
    const { top, bottom } = rect
    if (props.direction === 'down') {
      // 将 px 转换为 rpx，因为样式中使用 rpx 单位
      offset.value = pxToRpx(Number(bottom))
    } else {
      // 向上弹出时也需要转换单位
      offset.value = pxToRpx(windowHeight.value - Number(top))
    }
    child.$.exposed!.toggle()
  })
}

/**
 * 切换子菜单显示状态
 * 点击菜单项时关闭其他菜单项并切换当前菜单项
 * @param child 子组件实例
 */
const toggle = (child: any) => {
  // 点击当前 menu，关闭其他 menu
  if (child && !child.disabled) {
    if (queue && queue.closeOther) {
      queue.closeOther(child)
    } else {
      closeOther(child)
    }
    fold(child)
  }
}

/**
 * 处理点击遮罩层事件
 * 根据配置决定是否关闭所有菜单项
 */
const handleClickOverlay = () => {
  if (props.closeOnClickModal) {
    // 关闭所有打开的菜单项
    children.forEach((child) => {
      child.$.exposed!.close()
    })
  }
}

/**
 * 监听方向属性变化
 * 验证direction属性的有效性
 */
watch(
  () => props.direction,
  (newValue) => {
    if (!['up', 'down'].includes(newValue)) {
      console.error(`warning(wd-drop-menu): direction must be 'up' or 'down'`)
    }
  },
  { deep: true, immediate: true },
)

/**
 * 监听遮罩层显示状态
 * 延迟关闭遮罩层，避免闪烁
 */
watch(showOverlay, (newVal) => {
  if (overlayTimer) {
    clearTimeout(overlayTimer)
  }
  if (newVal) {
    overlayVisible.value = true
  } else {
    overlayTimer = setTimeout(() => {
      overlayVisible.value = false
      overlayTimer = null
    }, 16)
  }
})

/**
 * 组件挂载前的处理
 * 获取窗口高度并链接子组件
 */
onBeforeMount(() => {
  windowHeight.value = uni.getSystemInfoSync().windowHeight
})

// 链接子组件，提供必要的数据和方法
linkChildren({ props, fold, offset })
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 暗色主题样式
.wot-theme-dark {
  @include b(drop-menu) {
    color: $-dark-color;

    @include e(list) {
      background-color: $-dark-background2;
    }

    @include e(item) {
      @include when(disabled) {
        color: $-dark-color-gray;
      }
    }
  }
}

// 下拉菜单主体样式
@include b(drop-menu) {
  box-sizing: border-box;
  color: $-drop-menu-color;
  font-size: $-drop-menu-fs;
  position: relative;

  // 菜单列表样式
  @include e(list) {
    display: flex;
    text-align: center;
    background-color: #fff;
  }

  // 菜单项样式
  @include e(item) {
    flex: 1;
    min-width: 0;
    height: $-drop-menu-height;
    line-height: $-drop-menu-height;
    text-align: center;

    // 激活状态样式
    @include when(active) {
      font-weight: $-fw-medium;

      .wd-drop-menu__item-title::after {
        opacity: 1;
      }

      :deep(.wd-drop-menu__arrow) {
        transform: scale(0.6) rotate(-180deg);
        transform-origin: center center;
      }
    }

    // 禁用状态样式
    @include when(disabled) {
      color: $-drop-menu-disabled-color;
    }
  }

  // 菜单项标题样式
  @include e(item-title) {
    position: relative;
    display: inline-block;
    max-width: 100%;
    padding: 0 $-drop-menu-side-padding;
    box-sizing: border-box;

    &::after {
      position: absolute;
      content: '';
      width: 19px;
      height: $-drop-menu-line-height;
      bottom: 6px;
      left: 50%;
      transform: translate(-50%, 0);
      background: $-drop-menu-line-color;
      border-radius: $-drop-menu-line-height;
      transition: opacity 0.15s;
      opacity: 0;
    }
  }

  // 菜单项标题文本样式
  @include e(item-title-text) {
    position: relative;
    @include lineEllipsis;
  }

  // 箭头图标样式
  @include edeep(arrow) {
    position: absolute;
    display: inline-block;
    top: 0;
    right: -4px;
    transition: transform 0.3s;
    transform: scale(0.6);
    font-size: $-drop-menu-arrow-fs;
  }
}
</style>
