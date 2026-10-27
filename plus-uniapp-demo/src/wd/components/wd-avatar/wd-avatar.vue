<!-- Avatar 头像 用于展示用户头像、图标或文字。 -->
<template>
  <view :class="`wd-avatar ${sizeClass} is-${currentShape} ${customClass}`" :style="avatarStyle">
    <image v-if="src && !hasError" class="wd-avatar__image" :src="src" :mode="mode" :alt="alt" @error="handleError" />
    <wd-icon v-else-if="icon" :name="icon" :size="iconSize" custom-class="wd-avatar__icon" />
    <text v-else class="wd-avatar__text" :style="textStyle">{{ displayText }}</text>
    <slot />
  </view>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { addUnit } from '../common/util'
import { useParent } from '../composables/useParent'
import wdIcon from '../wd-icon/wd-icon.vue'
import { AVATAR_GROUP_KEY } from './wd-avatar-key'

defineOptions({
  name: 'WdAvatar',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 头像尺寸类型
 */
export type AvatarSize = 'large' | 'medium' | 'normal' | 'small'

/**
 * 头像形状类型
 */
export type AvatarShape = 'round' | 'square'

/**
 * 头像组件属性接口
 */
export interface WdAvatarProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 图片地址 */
  src?: string
  /** 文字内容（显示前两个字符） */
  text?: string
  /** 头像尺寸，预设值或自定义数字 */
  size?: AvatarSize | number
  /** 头像形状 */
  shape?: AvatarShape
  /** 背景颜色 */
  bgColor?: string
  /** 文字颜色 */
  color?: string
  /** 图标名称 */
  icon?: string
  /** 图片替代文本 */
  alt?: string
  /** 图片裁剪模式 */
  mode?: string
}

/**
 * 头像组件事件接口
 */
interface WdAvatarEmits {
  /** 图片加载失败事件 */
  error: [event: Event]
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdAvatarProps>(), {
  customStyle: '',
  customClass: '',
  src: '',
  text: '',
  size: 'normal',
  shape: 'round',
  bgColor: '',
  color: '#fff',
  icon: '',
  alt: '',
  mode: 'scaleToFill',
})

const emit = defineEmits<WdAvatarEmits>()

// 图片加载错误状态
const hasError = ref(false)

// 与头像组建立父子关系
const { parent } = useParent(AVATAR_GROUP_KEY)

/**
 * 预设尺寸映射（单位 rpx）
 */
const sizeMap: Record<string, number> = {
  large: 96,
  medium: 80,
  normal: 64,
  small: 48,
}

/**
 * 预设字体大小映射（单位 rpx）
 */
const fontSizeMap: Record<string, number> = {
  large: 32,
  medium: 28,
  normal: 24,
  small: 20,
}

/**
 * 预设图标大小映射（单位 rpx）
 */
const iconSizeMap: Record<string, string> = {
  large: '40rpx',
  medium: '34rpx',
  normal: '28rpx',
  small: '22rpx',
}

/**
 * 获取当前生效的尺寸
 * 优先使用自身 props，如果父组件（头像组）提供了尺寸则使用父组件的
 */
const currentSize = computed(() => {
  if (parent && parent.props.size !== undefined) {
    return parent.props.size
  }
  return props.size
})

/**
 * 获取当前生效的形状
 * 优先使用自身 props，如果父组件（头像组）提供了形状则使用父组件的
 */
const currentShape = computed(() => {
  if (parent && parent.props.shape !== undefined) {
    return parent.props.shape
  }
  return props.shape
})

/**
 * 计算尺寸样式类
 * 预设尺寸使用 class，自定义数字尺寸使用内联样式
 */
const sizeClass = computed(() => {
  const size = currentSize.value
  if (typeof size === 'string' && sizeMap[size]) {
    return `wd-avatar--${size}`
  }
  return ''
})

/**
 * 计算头像根节点样式
 */
const avatarStyle = computed(() => {
  const styles: string[] = []
  const size = currentSize.value

  // 自定义数字尺寸
  if (typeof size === 'number') {
    styles.push(`width: ${addUnit(size)}; height: ${addUnit(size)}`)
  }

  // 背景颜色
  if (props.bgColor) {
    styles.push(`background-color: ${props.bgColor}`)
  }

  // 追加自定义样式
  if (props.customStyle) {
    styles.push(props.customStyle)
  }

  return styles.join('; ')
})

/**
 * 计算文字样式
 */
const textStyle = computed(() => {
  const styles: string[] = []
  const size = currentSize.value

  // 文字颜色
  if (props.color) {
    styles.push(`color: ${props.color}`)
  }

  // 字体大小
  if (typeof size === 'string' && fontSizeMap[size]) {
    styles.push(`font-size: ${addUnit(fontSizeMap[size])}`)
  } else if (typeof size === 'number') {
    styles.push(`font-size: ${addUnit(Math.round(size * 0.375))}`)
  }

  return styles.join('; ')
})

/**
 * 计算图标大小
 */
const iconSize = computed(() => {
  const size = currentSize.value
  if (typeof size === 'string' && iconSizeMap[size]) {
    return iconSizeMap[size]
  }
  if (typeof size === 'number') {
    return `${addUnit(Math.round(size * 0.5))}`
  }
  return iconSizeMap.normal
})

/**
 * 计算显示文字
 * 取前两个字符
 */
const displayText = computed(() => {
  if (props.text) {
    return props.text.slice(0, 2)
  }
  return ''
})

/**
 * 处理图片加载失败
 */
function handleError(event: Event) {
  hasError.value = true
  emit('error', event)
}

/**
 * 头像组件实例类型
 */
export type AvatarInstance = InstanceType<typeof import('./wd-avatar.vue').default>
</script>

<style lang="scss">
@import './../common/abstracts/_mixin.scss';
@import './../common/abstracts/variable.scss';

// 暗色主题样式
.wot-theme-dark {
  @include b(avatar) {
    background-color: $-dark-background2;
  }
}

// 头像组件样式
@include b(avatar) {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #c0c4cc;
  box-sizing: border-box;
  vertical-align: middle;

  // 预设尺寸
  @include m(large) {
    width: 96rpx;
    height: 96rpx;
  }

  @include m(medium) {
    width: 80rpx;
    height: 80rpx;
  }

  @include m(normal) {
    width: 64rpx;
    height: 64rpx;
  }

  @include m(small) {
    width: 48rpx;
    height: 48rpx;
  }

  // 圆形
  @include when(round) {
    border-radius: 50%;
  }

  // 方形
  @include when(square) {
    border-radius: 8rpx;
  }

  // 图片
  @include e(image) {
    width: 100%;
    height: 100%;
    display: block;
  }

  // 文字
  @include e(text) {
    font-weight: 500;
    white-space: nowrap;
    line-height: 1;
  }

  // 图标
  @include e(icon) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
