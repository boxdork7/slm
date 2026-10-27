<!-- Popup 弹出层 弹出层组件，用于展示弹窗、信息提示等内容 -->
<template>
  <view class="wd-popup-wrapper">
    <wd-overlay
      v-if="modal"
      :show="modelValue"
      :z-index="zIndex"
      :lock-scroll="lockScroll"
      :duration="duration"
      :custom-style="modalStyle"
      @click="handleClickModal"
      @touchmove="noop"
    />
    <wd-transition
      :lazy-render="lazyRender"
      :custom-class="`wd-popup wd-popup--${position} ${!transition && position === 'center' ? 'is-deep' : ''} ${customClass}`"
      :custom-style="`z-index:${zIndex}; padding-bottom: ${addUnit(pxToRpx(safeBottom))}; border-radius: ${getBorderRadius};${customStyle}`"
      :duration="duration"
      :show="modelValue"
      :name="transitionName"
      :destroy="hideWhenClose"
      @before-enter="emit('before-enter')"
      @enter="emit('enter')"
      @after-enter="emit('after-enter')"
      @before-leave="emit('before-leave')"
      @leave="emit('leave')"
      @after-leave="emit('after-leave')"
    >
      <!-- 标题区域 - 固定定位 -->
      <view
        v-if="title"
        :class="`wd-popup__header wd-popup__header--${position} ${customHeaderClass}`"
      >
        {{ title }}
        <!-- 关闭按钮在标题内 -->
        <wd-icon
          v-if="closable"
          custom-class="wd-popup__close-in-header"
          name="add"
          size="40"
          @click="close"
        />
      </view>

      <!-- 插槽内容 - 可滚动区域 -->
      <view :class="`wd-popup__content ${title ? 'wd-popup__content--with-title' : ''}`">
        <slot />
      </view>

      <!-- 没有标题时的关闭按钮 -->
      <wd-icon
        v-if="closable && !title"
        custom-class="wd-popup__close"
        name="add"
        size="40"
        @click="close"
      />
    </wd-transition>
  </view>
</template>

<script lang="ts" setup>
import type { TransitionName } from '../wd-transition/wd-transition.vue'
import { computed, onBeforeMount, ref } from 'vue'
import { addUnit, pxToRpx } from '@/wd/components/common/util'
import wdIcon from '../wd-icon/wd-icon.vue'
import wdOverlay from '../wd-overlay/wd-overlay.vue'
import wdTransition from '../wd-transition/wd-transition.vue'

defineOptions({
  name: 'WdPopup',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 弹出层位置类型
 */
export type PopupType = 'center' | 'top' | 'right' | 'bottom' | 'left'

/**
 * 弹出层组件属性接口
 */
interface WdPopupProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string
  /** 自定义标题区域样式类 */
  customHeaderClass?: string

  /** 标题文本 */
  title?: string
  /** 圆角大小，支持 rpx、px 等单位 */
  radius?: string | number
  /** 动画类型，参见 wd-transition 组件的name */
  transition?: TransitionName
  /** 关闭按钮 */
  closable?: boolean
  /** 弹出框的位置，可选值：center / top / right / bottom / left */
  position?: PopupType
  /** 点击遮罩是否关闭 */
  closeOnClickModal?: boolean
  /** 动画持续时间 */
  duration?: number | boolean
  /** 是否显示遮罩 */
  modal?: boolean
  /** 设置层级 */
  zIndex?: number
  /** 是否当关闭时将弹出层隐藏（display: none) */
  hideWhenClose?: boolean
  /** 遮罩样式 */
  modalStyle?: string
  /** 弹出面板是否设置底部安全距离（iphone X 类型的机型） */
  safeAreaInsetBottom?: boolean
  /** 弹出层是否显示 */
  modelValue?: boolean
  /** 弹层内容懒渲染，触发展示时才渲染内容 */
  lazyRender?: boolean
  /** 是否锁定滚动 */
  lockScroll?: boolean
}

/**
 * 弹出层组件事件接口
 */
interface WdPopupEmits {
  /** 显示状态更新时触发 */
  'update:modelValue': [value: boolean]
  /** 进入前触发 */
  'before-enter': []
  /** 进入时触发 */
  enter: []
  /** 进入后触发 */
  'after-enter': []
  /** 离开前触发 */
  'before-leave': []
  /** 离开时触发 */
  leave: []
  /** 离开后触发 */
  'after-leave': []
  /** 点击遮罩时触发 */
  'click-modal': []
  /** 关闭时触发 */
  close: []
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdPopupProps>(), {
  customStyle: '',
  customClass: '',
  customHeaderClass: '',
  title: '',
  radius: '16',
  closable: false,
  position: 'center',
  closeOnClickModal: true,
  duration: 300,
  modal: true,
  zIndex: 100,
  hideWhenClose: true,
  modalStyle: '',
  safeAreaInsetBottom: false,
  modelValue: false,
  lazyRender: true,
  lockScroll: true,
})

// 定义组件事件
const emit = defineEmits<WdPopupEmits>()

// 响应式数据：底部安全距离
const safeBottom = ref<number>(0)
// 在组件中添加条件编译
const _a_transition = ref(false)

/**
 * 根据位置计算圆角样式
 */
const getBorderRadius = computed(() => {
  const radiusValue = addUnit(props.radius)

  switch (props.position) {
    case 'center':
      return radiusValue // 居中时四个角都有圆角
    case 'top':
      return `0 0 ${radiusValue} ${radiusValue}` // 顶部时下方两个角有圆角
    case 'bottom':
      return `${radiusValue} ${radiusValue} 0 0` // 底部时上方两个角有圆角
    case 'left':
      return `0 ${radiusValue} ${radiusValue} 0` // 左侧时右方两个角有圆角
    case 'right':
      return `${radiusValue} 0 0 ${radiusValue}` // 右侧时左方两个角有圆角
    default:
      return radiusValue
  }
})

/**
 * 计算过渡动画名称
 * 根据位置和自定义动画类型确定使用的过渡效果
 */
const transitionName = computed<TransitionName | TransitionName[]>(() => {
  if (props.transition) {
    return props.transition
  }

  switch (props.position) {
    case 'center':
      return ['zoom-in', 'fade']
    case 'left':
      return 'slide-left'
    case 'right':
      return 'slide-right'
    case 'bottom':
      return 'slide-up'
    case 'top':
      return 'slide-down'
    default:
      return 'slide-up'
  }
})

/**
 * 关闭弹出层
 * 触发关闭事件并更新显示状态
 */
const close = () => {
  emit('close')
  emit('update:modelValue', false)
}

/**
 * 处理点击遮罩事件
 * 触发点击遮罩事件，如果允许点击遮罩关闭则关闭弹出层
 */
const handleClickModal = () => {
  emit('click-modal')
  if (props.closeOnClickModal) {
    close()
  }
}

/**
 * 空函数，用于阻止默认行为
 */
const noop = () => {
  // 空函数，用于阻止遮罩层的 touchmove 事件
}

/**
 * 组件挂载前处理底部安全距离
 * 针对 iPhone X 等有刘海屏的设备适配
 */
onBeforeMount(() => {
  if (props.safeAreaInsetBottom) {
    const { safeArea, screenHeight, safeAreaInsets } = uni.getSystemInfoSync()

    if (safeArea) {
      // #ifdef MP-WEIXIN
      safeBottom.value = screenHeight - (safeArea!.bottom || 0)
      // #endif
      // #ifndef MP-WEIXIN
      safeBottom.value = safeAreaInsets ? safeAreaInsets.bottom : 0
      // #endif
    } else {
      safeBottom.value = 0
    }
  }
})
</script>

<style lang="scss">
// 引入外部样式文件
@import './../common/abstracts/_mixin.scss';
@import './../common/abstracts/variable.scss';

// 暗色主题样式
.wot-theme-dark {
  @include b(popup-wrapper) {
    :deep() {
      .wd-popup {
        background: $-dark-background2;
      }

      .wd-popup__close {
        color: $-dark-color;
      }

      .wd-popup__header {
        background: $-dark-background2;
        color: $-dark-color;
      }
    }
  }
}

// 弹出层包装器
@include b(popup-wrapper) {
  :deep() {
    .wd-popup {
      position: fixed;
      max-height: 100%;
      background: #fff;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      overflow: hidden; // 确保圆角效果
    }
  }
}

// 弹出层主体样式
@include b(popup) {
  // 标题区域样式
  @include e(header) {
    position: relative;
    background: #fff;
    font-size: 32rpx;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    flex-shrink: 0; // 防止被压缩
    z-index: 2;

    // 底部位置的标题样式（类似 ActionSheet）
    @include m(bottom) {
      height: $-action-sheet-title-height;
      line-height: $-action-sheet-title-height;
      text-align: center;
    }

    // 顶部位置的标题样式
    @include m(top) {
      height: $-action-sheet-title-height;
      line-height: $-action-sheet-title-height;
      text-align: center;
    }

    // 左侧位置的标题样式（左上角）
    @include m(left) {
      height: $-action-sheet-title-height;
      line-height: $-action-sheet-title-height;
      padding: 0 32rpx;
    }

    // 右侧位置的标题样式（右上角）
    @include m(right) {
      height: $-action-sheet-title-height;
      line-height: $-action-sheet-title-height;
      padding: 0 32rpx;
    }

    // 居中位置的标题样式
    @include m(center) {
      height: $-action-sheet-title-height;
      line-height: $-action-sheet-title-height;
      text-align: center;
    }
  }

  // 内容区域样式
  @include e(content) {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    // 当有标题时的内容区域
    @include m(with-title) {
      // 内容区域会自动占用剩余空间
    }
  }

  // 标题内的关闭按钮样式
  @include edeep(close-in-header) {
    position: absolute;
    top: 50%;
    right: 32rpx;
    transform: translateY(-50%) rotate(-45deg);
    color: $-popup-close-color;
    font-size: $-popup-close-size;
    z-index: 1;
  }

  // 关闭按钮样式（没有标题时）
  @include edeep(close) {
    position: absolute;
    top: 20rpx;
    right: 20rpx;
    color: $-popup-close-color;
    font-size: $-popup-close-size;
    transform: rotate(-45deg);
    z-index: 3;
  }

  // 居中位置样式
  @include mdeep(center) {
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
    transform-origin: 0 0;

    // 缩放动画
    &.wd-zoom-in-enter,
    &.wd-zoom-in-leave-to {
      transform: scale(0.8) translate3d(-50%, -50%, 0) !important;
    }

    // 深度缩放效果
    @include when(deep) {
      &.wd-zoom-in-enter,
      &.wd-zoom-in-leave-to {
        transform: scale(0.1) translate3d(-50%, -50%, 0) !important;
      }
    }
  }

  // 左侧位置样式
  @include mdeep(left) {
    top: 0;
    bottom: 0;
    left: 0;
  }

  // 右侧位置样式
  @include mdeep(right) {
    top: 0;
    right: 0;
    bottom: 0;
  }

  // 顶部位置样式
  @include mdeep(top) {
    top: 0;
    left: 0;
    right: 0;
  }

  // 底部位置样式
  @include mdeep(bottom) {
    right: 0;
    bottom: 0;
    left: 0;
  }
}
</style>
