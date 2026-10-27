<!-- NumberKeyboard 数字键盘 虚拟数字键盘，用于输入数字、密码或身份证等场景。 -->
<template>
  <wd-popup
    v-model="show"
    position="bottom"
    :z-index="zIndex"
    :safe-area-inset-bottom="safeAreaInsetBottom"
    :modal-style="modal ? '' : 'opacity: 0;'"
    :modal="hideOnClickOutside"
    :lock-scroll="lockScroll"
    @click-modal="handleClose"
  >
    <view
      class="wd-number-keyboard"
      :class="{
        'wd-number-keyboard--with-title': showHeader,
        [customClass]: !!customClass,
      }"
      :style="customStyle"
    >
      <view v-if="showHeader" class="wd-number-keyboard__header">
        <slot v-if="showTitle" name="title">
          <text class="wd-number-keyboard__title">
            {{ title }}
          </text>
        </slot>
        <view
          v-if="showClose"
          class="wd-number-keyboard__close"
          hover-class="wd-number-keyboard__close--hover"
          @click="handleClose"
        >
          <text>{{ closeText }}</text>
        </view>
      </view>
      <view class="wd-number-keyboard__body">
        <view class="wd-number-keyboard__keys">
          <wd-key
            v-for="key in keys"
            :key="key.text"
            :text="key.text"
            :type="key.type"
            :wider="key.wider"
            @press="handlePress"
          />
        </view>
        <view v-if="mode === 'custom'" class="wd-number-keyboard__sidebar">
          <wd-key
            v-if="showDeleteKey"
            large
            :text="deleteText"
            type="delete"
            @press="handlePress"
          />
          <wd-key
            large
            :text="closeText"
            type="close"
            :loading="closeButtonLoading"
            @press="handlePress"
          />
        </view>
      </view>
    </view>
  </wd-popup>
</template>

<script lang="ts" setup>
import type { NumberKeyType } from './key.vue'
import { computed, ref, useSlots, watch } from 'vue'
import wdPopup from '../wd-popup/wd-popup.vue'
import WdKey from './key.vue'

defineOptions({
  name: 'WdNumberKeyboard',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 键盘模式类型
 */
type KeyboardMode = 'default' | 'custom'

/**
 * 按键接口
 */
interface Key {
  text?: number | string // key文本
  type?: NumberKeyType // key的类型
  wider?: boolean // 是否占2个key的宽度
}

/**
 * 数字键盘组件属性接口
 */
interface WdNumberKeyboardProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 是否可见 */
  visible?: boolean
  /** 绑定的值 */
  modelValue?: string
  /** 标题 */
  title?: string
  /** 键盘模式 */
  mode?: KeyboardMode
  /** 层级 */
  zIndex?: number
  /** 最大长度 */
  maxlength?: number
  /** 是否显示删除键 */
  showDeleteKey?: boolean
  /** 是否随机键盘按键顺序 */
  randomKeyOrder?: boolean
  /** 确认按钮文本 */
  closeText?: string
  /** 删除按钮文本 */
  deleteText?: string
  /** 关闭按钮是否显示加载状态 */
  closeButtonLoading?: boolean
  /** 是否显示蒙层 */
  modal?: boolean
  /** 是否在点击外部时收起键盘 */
  hideOnClickOutside?: boolean
  /** 是否锁定滚动 */
  lockScroll?: boolean
  /** 是否在底部安全区域内 */
  safeAreaInsetBottom?: boolean
  /** 额外按键 */
  extraKey?: string | Array<string>
}

const props = withDefaults(defineProps<WdNumberKeyboardProps>(), {
  customStyle: '',
  customClass: '',
  visible: false,
  modelValue: '',
  mode: 'default',
  zIndex: 100,
  maxlength: Infinity,
  showDeleteKey: true,
  randomKeyOrder: false,
  closeText: '完成',
  deleteText: '删除',
  closeButtonLoading: false,
  modal: false,
  hideOnClickOutside: true,
  lockScroll: true,
  safeAreaInsetBottom: true,
})

const emit = defineEmits(['update:visible', 'input', 'close', 'delete', 'update:modelValue'])
const slots = useSlots()

const show = ref(props.visible)
watch(
  () => props.visible,
  (newValue) => {
    show.value = newValue
  },
)

/**
 * 随机打乱数组的顺序
 * @param arr 要打乱顺序的数组
 * @returns 打乱顺序后的数组
 */
const shuffleArray = <T,>(arr: T[]): T[] => {
  const newArr = [...arr]
  for (let i = newArr.length - 1; i > 0; i--) {
    // 生成一个随机索引 j，范围是 [0, i]
    const j = Math.floor(Math.random() * (i + 1))
    // 交换索引 i 和 j 处的元素
    ;[newArr[i], newArr[j]] = [newArr[j], newArr[i]]
  }
  return newArr
}

const genBasicKeys = (): Key[] => {
  const keys = Array.from({ length: 9 }, (_, i) => ({ text: i + 1 }))

  // 如果需要随机顺序，则调用 shuffleArray 方法打乱数组顺序
  return props.randomKeyOrder ? shuffleArray(keys) : keys
}
const genDefaultKeys = (): Key[] => {
  return [
    ...genBasicKeys(),
    { text: props.extraKey as string, type: 'extra' },
    { text: 0 },
    {
      // 根据条件是否显示删除键的文本和类型
      text: props.showDeleteKey ? props.deleteText : '',
      type: props.showDeleteKey ? 'delete' : '',
    },
  ]
}

const genCustomKeys = (): Key[] => {
  const keys = genBasicKeys()
  const extraKeys = Array.isArray(props.extraKey) ? props.extraKey : [props.extraKey]
  if (extraKeys.length === 1) {
    // 如果只有一个额外按键，则添加一个宽度较大的数字0和一个额外按键
    keys.push({ text: 0, wider: true }, { text: extraKeys[0], type: 'extra' })
  } else if (extraKeys.length === 2) {
    // 如果有两个额外按键，则添加两个额外按键和一个数字0
    keys.push(
      { text: extraKeys[0], type: 'extra' },
      { text: 0 },
      { text: extraKeys[1], type: 'extra' },
    )
  }

  return keys
}
const keys = computed(() => (props.mode === 'custom' ? genCustomKeys() : genDefaultKeys()))

const showClose = computed(() => {
  return props.closeText && props.mode === 'default'
})

const showTitle = computed(() => {
  return !!props.title || !!slots.title
})

const showHeader = computed(() => {
  return showTitle.value || showClose.value
})

const handleClose = () => {
  emit('close')
  emit('update:visible', false)
}

const handlePress = (text: string, type: NumberKeyType) => {
  if (text === '' && type === 'extra') {
    return handleClose()
  }
  const value = props.modelValue
  if (type === 'delete') {
    emit('delete')
    emit('update:modelValue', value.slice(0, value.length - 1))
  } else if (type === 'close') {
    handleClose()
  } else if (value.length < +props.maxlength) {
    emit('input', text)
    emit('update:modelValue', value + text)
  }
}
</script>

<style lang="scss">
@import './../common/abstracts/_mixin.scss';
@import './../common/abstracts/variable.scss';

.wot-theme-dark {
  @include b(number-keyboard) {
    background: $-dark-background5;

    @include e(header) {
      color: $-dark-color;
    }
  }
}

@include b(number-keyboard) {
  width: 100%;
  background: $-number-keyboard-background;
  color: $-color-black;
  user-select: none;

  @include m(with-title) {
    border-radius: 40rpx 40rpx 0 0;
  }

  @include e(header) {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: content-box;
    height: $-number-keyboard-title-height;
    padding-top: 12rpx;
    color: $-number-keyboard-title-color;
    font-size: $-number-keyboard-title-font-size;
  }

  @include e(title) {
    display: inline-block;
    font-weight: normal;

    &-left {
      position: absolute;
      left: 0;
    }
  }

  @include e(body) {
    display: flex;
    padding: 12rpx 0 0 12rpx;
  }

  @include e(keys) {
    display: flex;
    flex: 3;
    flex-wrap: wrap;
  }

  @include e(close) {
    position: absolute;
    display: flex;
    align-items: center;
    right: 0;
    height: 100%;
    padding: $-number-keyboard-close-padding;
    color: $-number-keyboard-close-color;
    font-size: $-number-keyboard-close-font-size;
    background-color: transparent;
    border: none;
    @include m(hover) {
      opacity: 0.6;
    }
  }

  @include e(sidebar) {
    display: flex;
    flex: 1;
    flex-direction: column;
  }
}
</style>
