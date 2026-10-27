<template>
  <view
    :class="`wd-key-wrapper ${wider ? 'wd-key-wrapper--wider' : ''}`"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <view
      :class="`wd-key ${large ? 'wd-key--large' : ''} ${type === 'delete' ? 'wd-key--delete' : ''} ${type === 'close' ? 'wd-key--close' : ''} ${active ? 'wd-key--active' : ''}`"
    >
      <wd-loading v-if="loading" custom-class="wd-key__loading-icon" />
      <template v-if="type === 'delete'">
        <template v-if="text">
          {{ text }}
        </template>
        <wd-icon v-else custom-class="wd-key__icon" name="keyboard-delete" size="44rpx" />
      </template>
      <template v-else-if="type === 'extra'">
        <template v-if="text">
          {{ text }}
        </template>
        <wd-icon v-else custom-class="wd-key__icon" name="keyboard-collapse" size="44rpx" />
      </template>
      <template v-else>{{ text }}</template>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useTouch } from '../composables/useTouch'
import wdIcon from '../wd-icon/wd-icon.vue'
import wdLoading from '../wd-loading/wd-loading.vue'

defineOptions({
  name: 'WdKey',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

export type NumberKeyType = '' | 'delete' | 'extra' | 'close'

/**
 * 数字键盘按键组件属性接口
 */
interface WdKeyProps {
  /** 按键类型 */
  type?: NumberKeyType
  /** 按键文本 */
  text?: string | number
  /** 是否为宽按键 */
  wider?: boolean
  /** 是否为大按键 */
  large?: boolean
  /** 是否显示加载状态 */
  loading?: boolean
}

/**
 * 数字键盘按键组件事件接口
 */
interface WdKeyEmits {
  /** 按键按下时触发 */
  press: [text: string | number, type: NumberKeyType]
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdKeyProps>(), {
  type: '',
  text: '',
  wider: false,
  large: false,
  loading: false,
})

// 定义组件事件
const emit = defineEmits<WdKeyEmits>()

// 触摸处理
const touch = useTouch()
// 按键激活状态
const active = ref<boolean>(false)

/**
 * 触摸开始事件处理
 */
const onTouchStart = (event: TouchEvent) => {
  touch.touchStart(event)
  active.value = true
}

/**
 * 触摸移动事件处理
 */
const onTouchMove = (event: TouchEvent) => {
  touch.touchMove(event)
  if (touch.direction.value) {
    active.value = false
  }
}

/**
 * 触摸结束事件处理
 */
const onTouchEnd = () => {
  if (active.value) {
    active.value = false
    emit('press', props.text, props.type)
  }
}
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/mixin';
@import '../common/abstracts/variable';

// 暗色主题样式
.wot-theme-dark {
  @include b(key) {
    background: $-dark-background2;
    color: $-dark-color;

    &:active {
      background-color: $-dark-background4;
    }

    @include m(active) {
      background-color: $-dark-background4;
    }
  }
}

// 按键包装器样式
.wd-key-wrapper {
  position: relative;
  flex: 1;
  flex-basis: 33%;
  box-sizing: border-box;
  padding: 0 12rpx 12rpx 0;

  @include m(wider) {
    flex-basis: 66%;
  }
}

// 按键样式
@include b(key) {
  display: flex;
  align-items: center;
  justify-content: center;
  height: $-number-keyboard-key-height;
  font-size: $-number-keyboard-key-font-size;
  line-height: 1.5;
  background: $-number-keyboard-key-background;
  border-radius: $-number-keyboard-key-border-radius;

  &:active {
    background-color: $-number-keyboard-key-active-color;
  }

  @include m(large) {
    position: absolute;
    top: 0;
    right: 12rpx;
    bottom: 12rpx;
    left: 0;
    height: auto;
  }

  @include m(delete, close) {
    font-size: $-number-keyboard-delete-font-size;
  }

  @include m(active) {
    background-color: $-number-keyboard-key-active-color;
  }

  @include m(close) {
    color: $-number-keyboard-button-text-color;
    background: $-number-keyboard-button-background;

    &:active {
      background: $-number-keyboard-button-background;
      opacity: $-number-keyboard-button-active-opacity;
    }
  }

  @include edeep(loading-icon) {
    color: $-number-keyboard-button-text-color;
  }

  @include edeep(icon) {
    font-size: $-number-keyboard-icon-size;
  }
}
</style>
