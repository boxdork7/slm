<!-- Keyboard 虚拟键盘 虚拟数字键盘，用于输入数字、密码、身份证或车牌号等场景。 -->
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
    <view :class="`wd-keyboard ${customClass}`" :style="customStyle">
      <view v-if="showHeader" class="wd-keyboard__header">
        <slot v-if="showTitle" name="title">
          <text class="wd-keyboard__title">{{ title }}</text>
        </slot>
        <view
          v-if="showClose"
          class="wd-keyboard__close"
          hover-class="wd-keyboard__close--hover"
          @click="handleClose"
        >
          <text>{{ closeText }}</text>
        </view>
      </view>
      <template v-if="mode !== 'car'">
        <view class="wd-keyboard__body">
          <view class="wd-keyboard__keys">
            <wd-key
              v-for="key in keys"
              :key="key.text"
              :text="key.text"
              :type="key.type"
              :wider="key.wider"
              @press="handlePress"
            />
          </view>
          <view v-if="mode === 'custom'" class="wd-keyboard__sidebar">
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
      </template>
      <template v-if="mode === 'car'">
        <view class="wd-keyboard-car__body">
          <view class="wd-keyboard-car__keys">
            <wd-key
              v-for="key in keys"
              :key="key.text"
              :text="key.text"
              :type="key.type"
              :wider="key.wider"
              @press="handlePress"
            />
          </view>
        </view>
      </template>
    </view>
  </wd-popup>
</template>

<script lang="ts" setup>
import { computed, ref, useSlots, watch } from 'vue'
import wdPopup from '../wd-popup/wd-popup.vue'
import WdKey from './key.vue'

defineOptions({
  name: 'WdKeyboard',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 键盘模式类型
 */
type KeyboardMode = 'default' | 'custom' | 'car'

/**
 * 按键类型
 */
type KeyType = '' | 'delete' | 'extra' | 'close'

/**
 * 数字键盘按键类型（从 key 组件引入）
 */
type NumberKeyType = '' | 'delete' | 'extra' | 'close'

/**
 * 按键接口
 */
interface Key {
  /** key文本 */
  text?: number | string
  /** key的类型 */
  type?: KeyType
  /** 是否占2个key的宽度 */
  wider?: boolean
}

/**
 * 键盘组件属性接口
 */
interface WdKeyboardProps {
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
  /** 车牌键盘当前语言（受控模式） */
  carLang?: 'zh' | 'en'
  /** 是否自动切换车牌键盘语言 */
  autoSwitchLang?: boolean
}

/**
 * 键盘组件事件接口
 */
interface WdKeyboardEmits {
  /** 更新显示状态 */
  'update:visible': [value: boolean]
  /** 输入时触发 */
  input: [text: string]
  /** 关闭时触发 */
  close: []
  /** 删除时触发 */
  delete: []
  /** 更新绑定值 */
  'update:modelValue': [value: string]
  /** 更新车牌键盘语言 */
  'update:carLang': [value: 'zh' | 'en']
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdKeyboardProps>(), {
  customStyle: '',
  customClass: '',
  visible: false,
  modelValue: '',
  mode: 'default',
  zIndex: 100,
  maxlength: Infinity,
  showDeleteKey: true,
  randomKeyOrder: false,
  closeButtonLoading: false,
  modal: false,
  hideOnClickOutside: true,
  lockScroll: true,
  safeAreaInsetBottom: true,
  autoSwitchLang: true,
})

// 定义组件事件
const emit = defineEmits<WdKeyboardEmits>()

// 获取插槽
const slots = useSlots()

// 响应式数据
const show = ref(props.visible)
const carKeyboardLang = ref('zh')

// 常量定义
/**
 * 车牌号键盘-省份简称
 */
const CAR_KEYBOARD_AREAS = [
  '京',
  '沪',
  '粤',
  '津',
  '冀',
  '豫',
  '云',
  '辽',
  '黑',
  '湘',
  '皖',
  '鲁',
  '苏',
  '浙',
  '赣',
  '鄂',
  '桂',
  '甘',
  '晋',
  '陕',
  '蒙',
  '吉',
  '闽',
  '贵',
  '渝',
  '川',
  '青',
  '琼',
  '宁',
  '挂',
  '藏',
  '港',
  '澳',
  '新',
  '使',
  '学',
]

/**
 * 车牌号键盘-数字和字母（不包含I和O，因为车牌号规则中不使用这两个字母）
 */
const CAR_KEYBOARD_KEYS = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  0,
  'Q',
  'W',
  'E',
  'R',
  'T',
  'Y',
  'U',
  'P',
  'A',
  'S',
  'D',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L',
  'Z',
  'X',
  'C',
  'V',
  'B',
  'N',
  'M',
]

/**
 * 监听 visible 属性变化
 * 同步内部显示状态
 */
watch(
  () => props.visible,
  (newValue) => {
    show.value = newValue
  },
)

/**
 * 监听 carLang 属性变化（受控模式）
 * 当外部传入 carLang 时，同步内部语言状态
 */
watch(
  () => props.carLang,
  (newValue) => {
    if (newValue) {
      carKeyboardLang.value = newValue
    }
  },
  { immediate: true },
)

/**
 * 分割车牌按键数组
 * @returns 分割后的按键数组
 */
const splitCarKeys = (): Array<Array<Key>> => {
  const keys =
    carKeyboardLang.value === 'zh'
      ? CAR_KEYBOARD_AREAS.map((key) => ({ text: key }))
      : CAR_KEYBOARD_KEYS.map((key) => ({ text: key }))
  return [keys.slice(0, 30), keys.slice(30)]
}
/**
 * 生成车牌键盘布局
 * @returns 车牌按键数组
 */
const genCarKeys = (): Array<Key> => {
  const [keys, remainKeys] = splitCarKeys()
  return [
    ...keys,
    { text: carKeyboardLang.value === 'zh' ? 'ABC' : '省份', type: 'extra', wider: true },
    ...remainKeys,
    { text: props.deleteText, type: 'delete', wider: true },
  ]
}

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

/**
 * 生成基础数字按键（1-9）
 * @returns 基础按键数组
 */
const genBasicKeys = (): Key[] => {
  const keys = Array.from({ length: 9 }, (_, i) => ({ text: i + 1 }))
  // 如果需要随机顺序，则调用 shuffleArray 方法打乱数组顺序
  return props.randomKeyOrder ? shuffleArray(keys) : keys
}

/**
 * 生成自定义模式的按键布局
 * @returns 自定义按键数组
 */
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

/**
 * 生成默认模式的按键布局
 * @returns 默认按键数组
 */
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

/**
 * 计算键盘按键数组
 * 根据不同模式生成对应的按键布局
 */
const keys = computed(() => {
  if (props.mode === 'car') {
    return genCarKeys()
  } else if (props.mode === 'custom') {
    return genCustomKeys()
  } else {
    return genDefaultKeys()
  }
})

/**
 * 计算是否显示关闭按钮
 */
const showClose = computed(() => {
  return props.closeText && (props.mode === 'default' || props.mode === 'car')
})

/**
 * 计算是否显示标题
 */
const showTitle = computed(() => {
  return !!props.title || !!slots.title
})

/**
 * 计算是否显示头部
 */
const showHeader = computed(() => {
  return showTitle.value || showClose.value
})

/**
 * 处理关闭事件
 */
const handleClose = () => {
  emit('close')
  emit('update:visible', false)
}

/**
 * 处理按键按下事件
 * @param text 按键文本
 * @param type 按键类型
 */
const handlePress = (text: string, type: NumberKeyType) => {
  if (type === 'extra') {
    if (text === '') {
      return handleClose()
    } else if (text === 'ABC' || text === '省份') {
      const newLang = carKeyboardLang.value === 'zh' ? 'en' : 'zh'
      carKeyboardLang.value = newLang
      emit('update:carLang', newLang)
      return
    }
  }

  const value = props.modelValue
  if (type === 'delete') {
    emit('delete')
    const newValue = value.slice(0, value.length - 1)
    emit('update:modelValue', newValue)

    // 自动切换：删除到空时切回中文键盘
    if (props.autoSwitchLang && props.mode === 'car' && newValue.length === 0) {
      carKeyboardLang.value = 'zh'
      emit('update:carLang', 'zh')
    }
  } else if (type === 'close') {
    handleClose()
  } else if (value.length < +props.maxlength) {
    emit('input', text)
    const newValue = value + text
    emit('update:modelValue', newValue)

    // 自动切换：输入第一个字符后切到英文键盘
    if (props.autoSwitchLang && props.mode === 'car' && value.length === 0) {
      carKeyboardLang.value = 'en'
      emit('update:carLang', 'en')
    }
  }
}
</script>

<style lang="scss">
// 引入外部样式文件
@import './../common/abstracts/_mixin.scss';
@import './../common/abstracts/variable.scss';

// 暗色主题样式
.wot-theme-dark {
  @include b(keyboard) {
    background: $-dark-background5;

    @include e(header) {
      color: $-dark-color;
    }
  }
}

// 键盘主体样式
@include b(keyboard) {
  width: 100%;
  background: $-keyboard-background;
  color: $-color-black;
  user-select: none;

  // 带标题时的样式
  @include m(with-title) {
    border-radius: 40rpx 40rpx 0 0;
  }

  // 头部样式
  @include e(header) {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: content-box;
    height: $-keyboard-title-height;
    padding-top: 12rpx;
    color: $-keyboard-title-color;
    font-size: $-keyboard-title-font-size;
  }

  // 标题样式
  @include e(title) {
    display: inline-block;
    font-weight: normal;

    &-left {
      position: absolute;
      left: 0;
    }
  }

  // 主体区域样式
  @include e(body) {
    display: flex;
    padding: 12rpx 0 0 12rpx;
  }

  // 按键区域样式
  @include e(keys) {
    display: flex;
    flex: 3;
    flex-wrap: wrap;
  }

  // 车牌键盘特殊样式
  &-car {
    @include e(body) {
      display: flex;
      padding: 12rpx 0 0 12rpx;
    }

    @include e(keys) {
      display: flex;
      flex: 10;
      flex-wrap: wrap;

      .wd-key-wrapper {
        --wot-keyboard-key-font-size: 36rpx;
        flex-basis: 10%;

        @include m(wider) {
          flex-basis: 20%;
        }
      }
    }
  }

  // 关闭按钮样式
  @include e(close) {
    position: absolute;
    display: flex;
    align-items: center;
    right: 0;
    height: 100%;
    padding: $-keyboard-close-padding;
    color: $-keyboard-close-color;
    font-size: $-keyboard-close-font-size;
    background-color: transparent;
    border: none;

    @include m(hover) {
      opacity: 0.6;
    }
  }

  // 侧边栏样式
  @include e(sidebar) {
    display: flex;
    flex: 1;
    flex-direction: column;
  }
}
</style>
