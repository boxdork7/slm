<!-- wd-key 组件是虚拟键盘中的单个按键组件，负责渲染按键外观、处理触摸交互和触发按键事件。不导出,只提供给wd-keyboard使用 -->
<template>
  <view
    :class="`wd-key-wrapper ${wider ? 'wd-key-wrapper--wider' : ''}`"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <view :class="keyClass">
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
import { computed, ref } from 'vue'
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

/**
 * 数字键盘按键类型
 */
type NumberKeyType = '' | 'delete' | 'extra' | 'close'

/**
 * 按键组件属性接口
 */
interface WdKeyProps {
  /** 按键类型 */
  type?: NumberKeyType
  /** 按键文本内容 */
  text?: string | number
  /** 是否为宽按键（占用两倍宽度） */
  wider?: boolean
  /** 是否为大按键（占用两倍高度） */
  large?: boolean
  /** 是否显示加载状态 */
  loading?: boolean
}

/**
 * 按键组件事件接口
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

// 触摸手势处理
const touch = useTouch()

// 响应式数据：按键激活状态
const active = ref<boolean>(false)

/**
 * 计算按键样式类名
 * 根据不同的按键类型和状态生成对应的类名
 */
const keyClass = computed(() => {
  const classList = ['wd-key']

  if (props.large) {
    classList.push('wd-key--large')
  }

  if (props.type === 'delete') {
    classList.push('wd-key--delete')
  }

  if (props.type === 'close') {
    classList.push('wd-key--close')
  }

  if (active.value) {
    classList.push('wd-key--active')
  }

  return classList.join(' ')
})

/**
 * 处理触摸开始事件
 * 初始化触摸手势并激活按键状态
 */
const onTouchStart = (event: TouchEvent) => {
  touch.touchStart(event)
  active.value = true
}

/**
 * 处理触摸移动事件
 * 如果检测到手势方向变化，取消激活状态
 */
const onTouchMove = (event: TouchEvent) => {
  touch.touchMove(event)
  if (touch.direction.value) {
    active.value = false
  }
}

/**
 * 处理触摸结束事件
 * 如果按键仍处于激活状态，触发按键事件
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

  // 宽按键样式
  @include m(wider) {
    flex-basis: 66%;
  }
}

// 按键主体样式
@include b(key) {
  display: flex;
  align-items: center;
  justify-content: center;
  height: $-keyboard-key-height;
  font-size: $-keyboard-key-font-size;
  line-height: 1.5;
  background: $-keyboard-key-background;
  border-radius: $-keyboard-key-border-radius;

  // 按下时的样式
  &:active {
    background-color: $-keyboard-key-active-color;
  }

  // 大按键样式
  @include m(large) {
    position: absolute;
    top: 0;
    right: 12rpx;
    bottom: 12rpx;
    left: 0;
    height: auto;
  }

  // 删除键和关闭键字体大小
  @include m(delete, close) {
    font-size: $-keyboard-delete-font-size;
  }

  // 激活状态样式
  @include m(active) {
    background-color: $-keyboard-key-active-color;
  }

  // 关闭键特殊样式
  @include m(close) {
    color: $-keyboard-button-text-color;
    background: $-keyboard-button-background;

    &:active {
      background: $-keyboard-button-background;
      opacity: $-keyboard-button-active-opacity;
    }
  }

  // 加载图标样式
  @include edeep(loading-icon) {
    color: $-keyboard-button-text-color;
  }

  // 图标样式
  @include edeep(icon) {
    font-size: $-keyboard-icon-size;
  }
}
</style>
