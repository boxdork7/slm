<!-- Text 文本 文本组件，用于展示文本信息，支持图标功能。 -->
<template>
  <view
    :class="`wd-text ${customClass} ${computedTextClass}`"
    :style="`${color ? `color: ${color};` : ''}${size ? `font-size: ${addUnit(size)};` : ''}${lineHeight ? `line-height: ${lineHeight};` : ''}${decoration ? `text-decoration: ${decoration};` : ''}${customStyle}`"
    @click="handleClick"
  >
    <!-- 前置插槽 -->
    <slot v-if="$slots.prefix || prefix" name="prefix">
      {{ prefix }}
    </slot>

    <!-- 上方图标 -->
    <view
      v-if="icon && iconPosition === 'top'"
      class="wd-text__icon-container wd-text__icon-container--top"
    >
      <wd-icon
        :name="icon"
        :size="iconSize"
        :color="iconColor"
        :custom-style="`margin-bottom: ${addUnit(iconSpacing)};`"
        custom-class="wd-text__icon wd-text__icon--top"
      />
      <text class="wd-text__content">{{ formattedText }}</text>
    </view>

    <!-- 下方图标 -->
    <view
      v-if="icon && iconPosition === 'bottom'"
      class="wd-text__icon-container wd-text__icon-container--bottom"
    >
      <text class="wd-text__content">{{ formattedText }}</text>
      <wd-icon
        :name="icon"
        :size="iconSize"
        :color="iconColor"
        :custom-style="`margin-top: ${addUnit(iconSpacing)};`"
        custom-class="wd-text__icon wd-text__icon--bottom"
      />
    </view>

    <!-- 左右布局的内容 -->
    <template v-if="!icon || (iconPosition !== 'top' && iconPosition !== 'bottom')">
      <!-- 左侧图标 -->
      <wd-icon
        v-if="icon && iconPosition === 'left'"
        :name="icon"
        :size="iconSize"
        :color="iconColor"
        :custom-style="`margin-right: ${addUnit(iconSpacing)};`"
        custom-class="wd-text__icon wd-text__icon--left"
      />

      <!-- 文本内容（左右布局） -->
      <text
        v-if="!icon || (iconPosition !== 'top' && iconPosition !== 'bottom')"
        class="wd-text__content"
      >
        {{ formattedText }}
      </text>

      <!-- 右侧图标 -->
      <wd-icon
        v-if="icon && iconPosition === 'right'"
        :name="icon"
        :size="iconSize"
        :color="iconColor"
        :custom-style="`margin-left: ${addUnit(iconSpacing)};`"
        custom-class="wd-text__icon wd-text__icon--right"
      />
    </template>

    <!-- 后置插槽 -->
    <slot v-if="$slots.suffix || suffix" name="suffix">
      {{ suffix }}
    </slot>
  </view>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'
import { dayjs } from '../common/dayjs'
import { addUnit, isDef } from '../common/util'
import wdIcon from '../wd-icon/wd-icon.vue'
import type { IconName } from '../wd-icon/wd-icon.vue'

defineOptions({
  name: 'WdText',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 文本类型
 */
type TextType = 'default' | 'secondary' | 'info' | 'primary' | 'success' | 'warning' | 'error'

/**
 * 图标位置类型
 */
type IconPosition = 'left' | 'right' | 'top' | 'bottom'

/**
 * 文本组件属性接口
 */
interface WdTextProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 主题类型，可选值：'default' / 'secondary' / 'info' / 'primary' / 'success' / 'warning' / 'error' */
  type?: TextType
  /** 文字内容 */
  text?: string | number | null | undefined
  /** 字体大小 */
  size?: string | number
  /** 文本处理的匹配模式，可选值：'text' / 'date' / 'phone' / 'name' / 'price' */
  mode?: string
  /** 文字装饰，可选值：'underline' / 'line-through' / 'overline' / 'none' */
  decoration?: string

  /** mode=phone时，点击文本是否拨打电话 */
  call?: boolean
  /** 是否粗体 */
  bold?: boolean
  /** 是否脱敏，当mode为phone和name时生效 */
  format?: boolean
  /** 文本颜色 */
  color?: string
  /** 前置插槽内容 */
  prefix?: string
  /** 后置插槽内容 */
  suffix?: string
  /** 文本显示的行数，如果设置，超出此行数将显示省略号，最大值为5 */
  lines?: number
  /** 文本行高 */
  lineHeight?: string
  /** 是否块级元素，设置后文本会单独占一行 */
  block?: boolean

  // 图标相关属性
  /** 图标名称，支持字体图标、UnoCSS图标或图片路径 */
  icon?: IconName
  /** 图标位置，可选值：'left' / 'right' / 'top' / 'bottom' */
  iconPosition?: IconPosition
  /** 图标大小 */
  iconSize?: string | number
  /** 图标颜色，如果不设置则继承文本颜色 */
  iconColor?: string
  /** 图标与文字的间距 */
  iconSpacing?: string | number

  /** 字典选项数组，用于text值翻译 */
  options?: Array<{ label: string; value: string | number }>
}

/**
 * 文本组件事件接口
 */
interface WdTextEmits {
  /** 点击文本时触发 */
  click: [event: Event]
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdTextProps>(), {
  customStyle: '',
  customClass: '',
  type: 'default',
  text: '',
  size: '',
  mode: 'text',
  decoration: 'none',
  call: false,
  bold: false,
  format: false,
  color: '',
  lineHeight: '',
  block: false,
  iconPosition: 'left',
  iconSize: '32',
  iconSpacing: '8',
  options: () => [],
})

// 定义组件事件
const emit = defineEmits<WdTextEmits>()

/**
 * 检查值是否为空值
 * @param value 要检查的值
 * @returns 是否为空值
 */
const isEmpty = (value: any): boolean => {
  return value === null || value === undefined || value === ''
}

/**
 * 安全的字符串转换
 * @param value 要转换的值
 * @returns 安全的字符串值
 */
const safeToString = (value: any): string => {
  if (isEmpty(value)) {
    return ''
  }
  return String(value)
}

/**
 * 计算文本类名
 * 根据类型、颜色、粗体、行数、块级显示、图标位置等属性动态生成类名
 */
const computedTextClass = computed(() => {
  const { type, color, bold, lines, block, icon, iconPosition } = props
  const textClassList: string[] = []

  // 添加类型类名（当没有自定义颜色时）
  if (!color) {
    textClassList.push(`is-${type}`)
  }

  // 添加行数限制类名
  if (isDef(lines)) {
    textClassList.push(`is-lines-${lines}`)
  }

  // 添加粗体类名
  if (bold) {
    textClassList.push('is-bold')
  }

  // 添加块级显示类名
  if (block) {
    textClassList.push('is-block')
  }

  // 添加图标相关类名
  if (icon) {
    textClassList.push('is-with-icon')
    textClassList.push(`is-icon-${iconPosition}`)
  }

  return textClassList.join(' ')
})

/**
 * 监听属性变化
 * 当type属性发生变化时，验证类型值的有效性
 */
watch(
  () => props.type,
  (type) => {
    // 验证 type 属性
    const validTypes = ['default', 'secondary', 'info', 'primary', 'success', 'warning', 'error']
    if (type && !validTypes.includes(type)) {
      console.error(`type must be one of ${validTypes.toString()}`)
    }
  },
  { immediate: true },
)

/**
 * 监听图标位置变化
 * 验证图标位置的有效性
 */
watch(
  () => props.iconPosition,
  (position) => {
    const validPositions = ['left', 'right', 'top', 'bottom']
    if (position && !validPositions.includes(position)) {
      console.error(`iconPosition must be one of ${validPositions.toString()}`)
    }
  },
  { immediate: true },
)

/**
 * 格式化文本（脱敏处理）
 * @param text 原始文本
 * @param format 是否需要脱敏
 * @param mode 文本模式
 * @returns 格式化后的文本
 */
const formatText = (text: string, format: boolean, mode: string): string => {
  // 如果文本为空，直接返回空字符串
  if (!text) {
    return ''
  }

  if (format) {
    if (mode === 'phone') {
      return text.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
    } else if (mode === 'name') {
      // 优化正则表达式：处理不同长度的姓名
      if (text.length <= 2) {
        // 两个字的姓名：张三 -> 张*
        return text.replace(/^(.)(.?)$/, '$1*')
      } else {
        // 三个字及以上的姓名：张小明 -> 张*明，张小明李 -> 张**李
        return text.replace(/^(.)(.+)(.)$/, (match, first, middle, last) => {
          return first + '*'.repeat(middle.length) + last
        })
      }
    } else {
      throw new Error('mode must be one of phone or name for encryption')
    }
  }
  return text
}

/**
 * 格式化数字（千分位分隔符）
 * @param num 数字
 * @returns 格式化后的数字字符串
 */
const formatNumber = (num: number | string): string => {
  // 处理空值情况
  if (isEmpty(num)) {
    return ''
  }

  // 尝试转换为数字，如果失败则返回原始字符串
  const numValue = Number(num)
  if (Number.isNaN(numValue)) {
    return safeToString(num)
  }

  const formattedNum = numValue.toFixed(2)
  const parts = formattedNum.split('.')
  let integerPart = parts[0]
  const decimalPart = parts.length > 1 ? `.${parts[1]}` : ''
  const rgx = /(\d+)(\d{3})/

  while (rgx.test(integerPart)) {
    integerPart = integerPart.replace(rgx, '$1,$2')
  }

  return integerPart + decimalPart
}

/**
 * 计算显示文本
 * 支持字典翻译，如果有options且text在字典中能找到对应项，则显示翻译后的label
 */
const displayText = computed(() => {
  const { text, options } = props

  // 如果有text且有options，尝试进行字典翻译
  if (text !== undefined && text !== null && text !== '' && options && options.length > 0) {
    const option = options.find(opt => opt.value === text)
    if (option) {
      return option.label
    }
  }

  // 否则直接使用text
  return text
})

/**
 * 计算格式化后的文本内容
 * 根据不同的模式对文本进行格式化处理
 */
const formattedText = computed(() => {
  const { mode, format } = props
  const textToFormat = displayText.value

  // 处理空值情况
  if (isEmpty(textToFormat)) {
    return ''
  }

  const safeText = safeToString(textToFormat)

  // 日期格式化
  if (mode === 'date') {
    // 处理无效日期
    const timestamp = Number(textToFormat)
    if (Number.isNaN(timestamp) || timestamp <= 0) {
      return safeText
    }

    try {
      return dayjs(timestamp).format('YYYY-MM-DD')
    } catch (error) {
      console.warn('Invalid date format:', textToFormat)
      return safeText
    }
  }

  // 价格格式化
  if (mode === 'price') {
    return formatNumber(textToFormat)
  }

  // 脱敏格式化
  return formatText(safeText, format, mode)
})

/**
 * 处理点击事件
 * 触发点击事件，传递原始事件对象
 */
const handleClick = (event: Event) => {
  emit('click', event)
}
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 文本组件样式
@include b(text) {
  // 基础样式
  display: inline-block;

  // 粗体样式
  @include when(bold) {
    font-weight: bold;
  }

  // 块级显示样式
  @include when(block) {
    display: block;
    width: 100%;
  }

  // 多行省略样式（支持 1-5 行）——直接作用在 content 上
  @for $i from 1 through 5 {
    &.is-lines-#{$i} {
      .wd-text__content {
        @include multiEllipsis($i);
      }
    }
  }

  // 带图标的样式
  @include when(with-icon) {
    display: inline-flex;
    align-items: center;

    // 左侧图标
    &.is-icon-left {
      flex-direction: row;
      align-items: center;
    }

    // 右侧图标
    &.is-icon-right {
      flex-direction: row;
      align-items: center;

      .wd-text__content {
        order: 1;
      }

      .wd-text__icon--right {
        order: 2;
      }
    }

    // 上下布局时不使用 flex，改为 inline-block
    &.is-icon-top,
    &.is-icon-bottom {
      display: inline-block;
    }

    // 块级模式下特殊处理
    &.is-block {
      display: flex;
      width: 100%;

      // 块级模式下，如果是左右布局，文本内容可以占据剩余空间
      &.is-icon-left,
      &.is-icon-right {
        .wd-text__content {
          flex: 1;
        }
      }

      // 上下布局的块级显示
      &.is-icon-top,
      &.is-icon-bottom {
        display: block;
        width: 100%;

        .wd-text__icon-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      }
    }
  }

  // 上下布局的图标容器
  @include e(icon-container) {
    display: inline-flex;
    flex-direction: column;
    position: relative;

    // 上方图标容器
    @include m(top) {
      align-items: center; // 让图标相对于文字居中
    }

    // 下方图标容器
    @include m(bottom) {
      align-items: center; // 让图标相对于文字居中
    }
  }

  // 图标样式
  @include e(icon) {
    flex-shrink: 0; // 防止图标被压缩
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1; // 确保图标行高正常
  }

  // 文本内容样式
  @include e(content) {
    line-height: inherit;
    word-break: break-word;
    overflow: hidden; // 防止多行溢出
  }

  // 主题颜色样式
  @include when(default) {
    color: $-color-content; // 普通正文 #262626
  }

  @include when(secondary) {
    color: $-color-secondary; // 次要信息，注释/补充/正文 #595959
  }

  @include when(info) {
    color: $-color-aid; // 辅助文字，弱化信息，引导性/不可点文字 #8c8c8c
  }

  @include when(primary) {
    color: $-text-primary-color; // 蓝色主题色
  }

  @include when(success) {
    color: $-text-success-color;
  }

  @include when(warning) {
    color: $-text-warning-color;
  }

  @include when(error) {
    color: $-text-error-color;
  }
}
</style>
