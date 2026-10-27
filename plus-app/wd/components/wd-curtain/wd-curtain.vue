<!-- Curtain 幕帘组件 一般用于公告类的图片弹窗 -->
<template>
  <view class="wd-curtain-wrapper">
    <wd-popup
      v-model="modelValue"
      :custom-class="`wd-curtain ${customClass}`"
      :custom-style="customStyle"
      transition="zoom-in"
      position="center"
      :close-on-click-modal="closeOnClickModal"
      :hide-when-close="hideWhenClose"
      :z-index="zIndex"
      @before-enter="handleBeforeEnter"
      @enter="handleEnter"
      @after-enter="handleAfterEnter"
      @before-leave="handleBeforeLeave"
      @leave="handleLeave"
      @after-leave="handleAfterLeave"
      @close="handleClose"
      @click-modal="handleClickModal"
    >
      <view class="wd-curtain__content">
        <image
          :src="src"
          class="wd-curtain__content-img"
          :style="`${width ? `width: ${addUnit(width)}; height: ${addUnit(width / imgScale)}` : ''}`"
          :show-menu-by-longpress="showMenuByLongpress"
          @click="handleClickImage"
          @error="handleImgError"
          @load="handleImgLoad"
        />
        <slot name="close">
          <wd-icon
            name="close-outline"
            :custom-class="`wd-curtain__content-close ${closePosition} ${customCloseClass}`"
            :custom-style="customCloseStyle"
            @click="handleClose"
          />
        </slot>
      </view>
    </wd-popup>
  </view>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { addUnit } from '@/wd/components/common/util'
import wdIcon from '../wd-icon/wd-icon.vue'
import wdPopup from '../wd-popup/wd-popup.vue'

defineOptions({
  name: 'WdCurtain',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 关闭按钮位置类型
 */
type ClosePosition =
  | 'inset'
  | 'top'
  | 'bottom'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'

/**
 * 幕帘组件属性接口
 */
interface WdCurtainProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 绑定值，展示/关闭幕帘（已废弃，请使用 modelValue） */
  value?: boolean
  /** 绑定值，展示/关闭幕帘 */
  modelValue?: boolean
  /** 关闭按钮位置 */
  closePosition?: ClosePosition
  /** 幕帘图片地址，必须使用网络地址 */
  src?: string
  /** 幕帘图片点击链接 */
  to?: string
  /** 幕帘图片宽度 */
  width?: number
  /** 点击遮罩是否关闭 */
  closeOnClickModal?: boolean
  /** 是否当关闭时将弹出层隐藏（display: none) */
  hideWhenClose?: boolean
  /** 设置层级 */
  zIndex?: number
  /** 自定义关闭按钮的类名 */
  customCloseClass?: string
  /** 自定义关闭按钮的样式 */
  customCloseStyle?: string
  /** 是否开启长按识别小程序码（微信小程序） */
  showMenuByLongpress?: boolean
  /** 点击图片是否关闭幕帘 */
  closeOnClick?: boolean
}

/**
 * 幕帘组件事件接口
 */
interface WdCurtainEmits {
  /** 进入前触发 */
  beforeenter: []
  /** 进入时触发 */
  enter: []
  /** 进入后触发 */
  afterenter: []
  /** 离开前触发 */
  beforeleave: []
  /** 离开时触发 */
  leave: []
  /** 离开后触发 */
  afterleave: []
  /** 关闭时触发 */
  close: []
  /** 关闭后触发 */
  closed: []
  /** 点击遮罩时触发 */
  'click-modal': []
  /** 图片加载完成时触发 */
  load: []
  /** 图片加载错误时触发 */
  error: []
  /** 点击图片时触发 */
  click: []
  /** 更新绑定值 */
  'update:modelValue': [value: boolean]
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdCurtainProps>(), {
  customStyle: '',
  customClass: '',
  value: false,
  modelValue: false,
  width: 560,
  closePosition: 'inset',
  closeOnClickModal: false,
  hideWhenClose: true,
  zIndex: 100,
  customCloseClass: '',
  customCloseStyle: '',
  showMenuByLongpress: false,
  closeOnClick: true,
})

// 定义组件事件
const emit = defineEmits<WdCurtainEmits>()

// 响应式数据：显示状态
const modelValue = ref(props.modelValue || props.value)
// 响应式数据：图片加载成功状态
const imgSucc = ref<boolean>(true)
// 响应式数据：图片宽高比
const imgScale = ref<number>(1)

/**
 * 监听 modelValue 属性变化
 * 同步外部传入的 modelValue 到内部状态
 */
watch(
  () => props.modelValue,
  (newVal) => {
    modelValue.value = newVal
  },
)

/**
 * 监听 value 属性变化（兼容旧版本）
 * 同步外部传入的 value 到内部状态
 */
watch(
  () => props.value,
  (newVal) => {
    modelValue.value = newVal
  },
)

/**
 * 监听内部状态变化
 * 当内部状态改变时，向外部发送更新事件和关闭事件
 */
watch(modelValue, (newVal) => {
  emit('update:modelValue', newVal)
  if (!newVal) {
    emit('close')
  }
})

/**
 * 处理进入前事件
 * 转发弹窗的进入前事件
 */
const handleBeforeEnter = () => {
  emit('beforeenter')
}

/**
 * 处理进入事件
 * 转发弹窗的进入事件
 */
const handleEnter = () => {
  emit('enter')
}

/**
 * 处理进入后事件
 * 转发弹窗的进入后事件
 */
const handleAfterEnter = () => {
  emit('afterenter')
}

/**
 * 处理离开前事件
 * 转发弹窗的离开前事件
 */
const handleBeforeLeave = () => {
  emit('beforeleave')
}

/**
 * 处理离开事件
 * 转发弹窗的离开事件
 */
const handleLeave = () => {
  emit('leave')
}

/**
 * 处理离开后事件
 * 转发弹窗的离开后事件，并触发关闭完成事件
 */
const handleAfterLeave = () => {
  emit('afterleave')
  emit('closed')
}

/**
 * 处理关闭事件
 * 设置显示状态为 false
 */
const handleClose = () => {
  modelValue.value = false
}

/**
 * 处理点击遮罩事件
 * 转发弹窗的点击遮罩事件
 */
const handleClickModal = () => {
  emit('click-modal')
}

/**
 * 处理图片加载完成事件
 * 计算图片宽高比并设置加载成功状态
 */
const handleImgLoad = (event: any) => {
  const { height, width } = event.detail
  imgScale.value = width / height
  imgSucc.value = true
  emit('load')
}

/**
 * 处理图片加载错误事件
 * 设置加载失败状态并触发错误事件
 */
const handleImgError = () => {
  imgSucc.value = false
  emit('error')
}

/**
 * 处理点击图片事件
 * 如果设置了跳转链接则进行页面跳转，触发点击事件并关闭幕帘
 */
const handleClickImage = () => {
  if (props.to) {
    uni.navigateTo({
      url: props.to,
    })
  }
  emit('click')
  if (props.closeOnClick) {
    handleClose()
  }
}
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/_mixin.scss';
@import '../common/abstracts/variable.scss';

// 幕帘包装器样式
@include b(curtain-wrapper) {
  :deep(.wd-curtain) {
    display: inline-block;
    border-radius: $-curtain-content-radius;
    overflow-y: visible !important;
    background: transparent;
    font-size: 0;
  }
}

// 幕帘主体样式
@include b(curtain) {
  // 内容区域样式
  @include e(content) {
    position: relative;
    display: inline-block;
    background: transparent;
    border-radius: $-curtain-content-radius;
  }

  // 内容链接样式
  @include e(content-link) {
    display: block;
    border-radius: $-curtain-content-radius;
  }

  // 内容图片样式
  @include e(content-img) {
    display: block;
    width: auto;
    height: auto;
    border-radius: $-curtain-content-radius;
  }

  // 关闭按钮样式
  @include edeep(content-close) {
    position: absolute;
    margin: 0;
    padding: 6px;
    top: 10px;
    right: 10px;
    color: $-curtain-content-close-color;
    font-size: $-curtain-content-close-fs;
    -webkit-tap-highlight-color: transparent;

    // 顶部居中位置
    &.top {
      margin: 0 0 0 -18px;
      top: -62px;
      right: unset;
      left: 50%;
      bottom: unset;
    }

    // 顶部左侧位置
    &.top-left {
      margin: 0;
      top: -62px;
      right: unset;
      left: -6px;
      bottom: unset;
    }

    // 顶部右侧位置
    &.top-right {
      margin: 0;
      top: -62px;
      right: -6px;
      left: unset;
      bottom: unset;
    }

    // 底部居中位置
    &.bottom {
      margin: 0 0 0 -18px;
      top: unset;
      right: unset;
      left: 50%;
      bottom: -62px;
    }

    // 底部左侧位置
    &.bottom-left {
      margin: 0;
      top: unset;
      right: unset;
      left: -6px;
      bottom: -62px;
    }

    // 底部右侧位置
    &.bottom-right {
      margin: 0;
      top: unset;
      right: -6px;
      left: unset;
      bottom: -62px;
    }
  }
}
</style>
