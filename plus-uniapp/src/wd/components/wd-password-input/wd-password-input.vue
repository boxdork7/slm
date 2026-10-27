<!-- PasswordInput 密码输入框  带网格的输入框组件，可以用于输入密码、短信验证码等场景，通常与数字键盘组件配合使用。 -->
<template>
  <view :class="`wd-password-input ${customClass}`" :style="customStyle">
    <view class="wd-password-input__security" @touchstart.stop="onTouchStart">
      <view
        v-for="(_, index) in length"
        :key="index"
        class="wd-password-input__item"
        :style="getItemStyle(index)"
      >
        <view
          v-if="currentFocused && index === modelValue.length"
          class="wd-password-input__cursor"
        />
        <view v-else class="wd-password-input__value">
          <view
            :style="{ visibility: mask && modelValue[index] ? 'visible' : 'hidden' }"
            class="wd-password-input__mask"
          />
          <text v-if="!mask && modelValue[index]">
            {{ modelValue[index] }}
          </text>
        </view>
      </view>
    </view>
    <view
      v-if="info || errorInfo"
      class="wd-password-input__info"
      :class="{
        'is-error': !!errorInfo,
      }"
    >
      {{ errorInfo || info }}
    </view>

    <!-- 内置数字键盘 -->
    <wd-number-keyboard
      v-if="!useExternalKeyboard"
      v-model="internalValue"
      v-model:visible="keyboardVisible"
      :maxlength="length"
      :title="keyboardTitle"
      :z-index="keyboardZIndex"
      :close-text="keyboardCloseText"
      :delete-text="keyboardDeleteText"
      :modal="keyboardModal"
      :hide-on-click-outside="keyboardHideOnClickOutside"
      :lock-scroll="keyboardLockScroll"
      :safe-area-inset-bottom="keyboardSafeAreaInsetBottom"
      @close="onKeyboardClose"
    />
  </view>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue'
import WdNumberKeyboard from '../wd-number-keyboard/wd-number-keyboard.vue'

defineOptions({
  name: 'WdPasswordInput',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 密码输入框组件属性接口
 */
interface WdPasswordInputProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 绑定的值 */
  modelValue?: string
  /** 是否隐藏密码内容 */
  mask?: boolean
  /** 输入框下方文字提示 */
  info?: string
  /** 输入框下方错误提示 */
  errorInfo?: string
  /** 输入框格子之间的间距，如 20rpx 2em，默认单位为 rpx */
  gutter?: string | number
  /** 密码最大长度 */
  length?: number
  /** 是否已聚焦，聚焦时会显示光标 */
  focused?: boolean
  /** 输入框背景色 */
  bgColor?: string

  /** 是否使用外部键盘，为 true 时不显示内置键盘 */
  useExternalKeyboard?: boolean
  /** 键盘标题 */
  keyboardTitle?: string
  /** 键盘层级 */
  keyboardZIndex?: number
  /** 键盘确认按钮文本 */
  keyboardCloseText?: string
  /** 键盘删除按钮文本 */
  keyboardDeleteText?: string
  /** 键盘是否显示蒙层 */
  keyboardModal?: boolean
  /** 键盘是否在点击外部时收起 */
  keyboardHideOnClickOutside?: boolean
  /** 键盘是否锁定滚动 */
  keyboardLockScroll?: boolean
  /** 键盘是否在底部安全区域内 */
  keyboardSafeAreaInsetBottom?: boolean
}

const props = withDefaults(defineProps<WdPasswordInputProps>(), {
  customStyle: '',
  customClass: '',
  modelValue: '',
  mask: false,
  info: '',
  errorInfo: '',
  gutter: 24,
  length: 4,
  focused: true,
  bgColor: '#F8F8F8',
  useExternalKeyboard: false,
  keyboardTitle: '',
  keyboardZIndex: 100,
  keyboardCloseText: '完成',
  keyboardDeleteText: '删除',
  keyboardModal: false,
  keyboardHideOnClickOutside: true,
  keyboardLockScroll: true,
  keyboardSafeAreaInsetBottom: true,
})

const emit = defineEmits(['focus', 'blur', 'update:modelValue'])

const keyboardVisible = ref(false)
const internalValue = ref(props.modelValue)
const isClosing = ref(false) // 防止重复关闭的标志

// 当前是否聚焦状态
const currentFocused = computed(() => {
  return props.useExternalKeyboard ? props.focused : keyboardVisible.value
})

// 计算每个输入框的样式
const getItemStyle = (index: number) => {
  const gutterValue = typeof props.gutter === 'number' ? `${props.gutter}rpx` : props.gutter

  // 根据长度计算合适的最大宽度
  const maxWidth = props.length === 4 ? '110rpx' : '90rpx'

  return {
    marginLeft: index !== 0 ? gutterValue : '0',
    backgroundColor: props.bgColor,
    // 设置为正方形，但限制最大尺寸
    aspectRatio: '1/1',
    maxWidth,
  }
}

// 监听外部值变化，同步到内部
watch(
  () => props.modelValue,
  (newValue) => {
    internalValue.value = newValue
  },
  { immediate: true },
)

// 监听内部值变化，同步到外部
watch(internalValue, (newValue) => {
  if (newValue !== props.modelValue) {
    emit('update:modelValue', newValue)
  }
})

// 监听键盘显示状态变化
watch(keyboardVisible, (visible) => {
  if (!visible && !isClosing.value) {
    // 延迟触发 blur 事件，避免与 focus 事件冲突
    nextTick(() => {
      emit('blur')
    })
  }
})

const onTouchStart = (event: Event) => {
  // 防止事件冒泡
  event.preventDefault()
  event.stopPropagation()

  if (props.useExternalKeyboard) {
    // 使用外部键盘时，触发 focus 事件
    emit('focus', event)
  } else {
    // 使用内置键盘时，显示键盘
    if (!keyboardVisible.value) {
      isClosing.value = false
      keyboardVisible.value = true
      // 延迟触发 focus 事件，确保键盘已显示
      nextTick(() => {
        emit('focus', event)
      })
    }
  }
}

const onKeyboardClose = () => {
  isClosing.value = true
  keyboardVisible.value = false
  // 延迟重置标志，避免立即重新打开
  setTimeout(() => {
    isClosing.value = false
  }, 100)
  emit('blur')
}
</script>

<style lang="scss">
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

.wot-theme-dark {
  @include b(password-input) {
    @include e(item) {
      color: $-dark-color;
      background: $-dark-background2;
    }

    @include e(mask) {
      background-color: $-dark-color;
    }

    @include e(cursor) {
      background-color: $-dark-color;
    }

    @include e(info) {
      color: $-dark-color;

      @include when(error) {
        color: $-dark-color2;
      }
    }
  }
}

@include b(password-input) {
  position: relative;
  margin: 0 $-password-input-margin;
  user-select: none;

  @include e(security) {
    display: flex;
    width: 100%;
    height: auto; // 改为自适应高度
    cursor: pointer;
    // 确保子元素不会超出容器
    align-items: center;
    justify-content: center;
  }

  @include e(item) {
    position: relative;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    color: $-password-input-text-color;
    font-size: $-password-input-font-size;
    line-height: 1.2;
    border-radius: $-password-input-radius;
    // 完全移除边框
    border: none !important;
    outline: none;
    box-shadow: none;
    // 确保正方形效果，但不设置固定的最小高度
    aspect-ratio: 1/1;
    // 让flex-basis为0，完全依赖max-width控制大小
    flex-basis: 0;
  }

  @include e(mask) {
    position: absolute;
    top: 50%;
    left: 50%;
    width: $-password-input-dot-size;
    height: $-password-input-dot-size;
    background: $-password-input-dot-color;
    border-radius: 100%;
    transform: translate(-50%, -50%);
    visibility: hidden;
  }

  @include e(cursor) {
    position: absolute;
    top: 50%;
    left: 50%;
    width: $-password-input-cursor-width;
    height: $-password-input-cursor-height;
    background: $-password-input-cursor-color;
    transform: translate(-50%, -50%);
    animation: $-password-input-cursor-duration cursor-flicker infinite;
  }

  @include e(info) {
    margin-top: $-password-input-margin;
    font-size: $-password-input-info-font-size;
    text-align: center;
    color: $-password-input-info-color;

    @include when(error) {
      color: $-password-input-error-info-color;
    }
  }
}

@keyframes cursor-flicker {
  from {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>
