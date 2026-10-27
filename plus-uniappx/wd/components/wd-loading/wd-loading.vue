<!-- Loading 加载指示器 加载动画，用于表示加载中的过渡状态。 -->
<template>
  <view
    :class="`wd-loading ${customClass}`"
    :style="`${isDef(iconSize) ? `height: ${addUnit(iconSize)}; width: ${addUnit(iconSize)};` : ''}${customStyle}`"
  >
    <view class="wd-loading__body">
      <view class="wd-loading__svg" :style="`background-image: url(${svg});`" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref, watch } from 'vue'
import { encode } from '../common/base64'
import { addUnit, context, gradient, isDef } from '../common/util'

defineOptions({
  name: 'WdLoading',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 加载指示器类型
 */
export type LoadingType = 'outline' | 'ring' | 'spinner'

/**
 * 加载组件属性接口
 */
export interface WdLoadingProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 加载指示器类型，可选值：'outline' | 'ring' | 'spinner' */
  type?: LoadingType
  /** 设置加载指示器颜色 */
  color?: string
  /** 设置加载指示器大小 */
  size?: string | number
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdLoadingProps>(), {
  customStyle: '',
  customClass: '',
  type: 'ring',
  color: '#4D80F0',
  size: '45',
})

// 生成唯一的 SVG 定义 ID，避免多个组件实例冲突
const svgDefineId = context.id++
const svgDefineId1 = context.id++
const svgDefineId2 = context.id++

// 响应式数据
const svg = ref<string>('')
const intermediateColor = ref<string>('')
const iconSize = ref<string | number | null>(null)

/**
 * SVG 图标生成器
 * 包含不同类型的加载动画 SVG
 */
const icon = {
  /**
   * 外边框类型的加载动画
   * @param color 主要颜色
   * @returns SVG 字符串
   */
  outline(color = '#4D80F0') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42"><defs><linearGradient x1="100%" y1="0%" x2="0%" y2="0%" id="${svgDefineId}"><stop stop-color="#FFF" offset="0%" stop-opacity="0"/><stop stop-color="#FFF" offset="100%"/></linearGradient></defs><g fill="none" fill-rule="evenodd"><path d="M21 1c11.046 0 20 8.954 20 20s-8.954 20-20 20S1 32.046 1 21 9.954 1 21 1zm0 7C13.82 8 8 13.82 8 21s5.82 13 13 13 13-5.82 13-13S28.18 8 21 8z" fill="${color}"/><path d="M4.599 21c0 9.044 7.332 16.376 16.376 16.376 9.045 0 16.376-7.332 16.376-16.376" stroke="url(#${svgDefineId}) " stroke-width="3.5" stroke-linecap="round"/></g></svg>`
  },

  /**
   * 环形类型的加载动画
   * @param color 主要颜色
   * @param intermediateColor 中间渐变颜色
   * @returns SVG 字符串
   */
  ring(color = '#4D80F0', intermediateColor = '#a6bff7') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><linearGradient id="${svgDefineId1}" gradientUnits="userSpaceOnUse" x1="50" x2="50" y2="180"><stop offset="0" stop-color="${color}"></stop> <stop offset="1" stop-color="${intermediateColor}"></stop></linearGradient> <path fill="url(#${svgDefineId1})" d="M20 100c0-44.1 35.9-80 80-80V0C44.8 0 0 44.8 0 100s44.8 100 100 100v-20c-44.1 0-80-35.9-80-80z"></path> <linearGradient id="${svgDefineId2}" gradientUnits="userSpaceOnUse" x1="150" y1="20" x2="150" y2="180"><stop offset="0" stop-color="#fff" stop-opacity="0"></stop> <stop offset="1" stop-color="${intermediateColor}"></stop></linearGradient> <path fill="url(#${svgDefineId2})" d="M100 0v20c44.1 0 80 35.9 80 80s-35.9 80-80 80v20c55.2 0 100-44.8 100-100S155.2 0 100 0z"></path> <circle cx="100" cy="10" r="10" fill="${color}"></circle></svg>`
  },

  /**
   * 旋转器类型的加载动画
   * @param color 主要颜色
   * @returns SVG 字符串
   */
  spinner(color = '#4D80F0') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32m181.024 108.032a32 32 0 0 1 43.712 11.712l96 166.272a32 32 0 0 1-55.424 32L681.28 215.744a32 32 0 0 1 11.712-43.712zM960 480a32 32 0 0 1 0 64H768a32 32 0 1 1 0-64zM851.968 181.024a32 32 0 0 1-11.712 43.712l-166.272 96a32 32 0 0 1-32-55.424l166.272-96a32 32 0 0 1 43.712 11.712M512 736a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V768a32 32 0 0 1 32-32m-181.024-108.032a32 32 0 0 1-43.712-11.712l-96-166.272a32 32 0 0 1 55.424-32l96.032 166.272a32 32 0 0 1-11.744 43.712M64 544a32 32 0 0 1 0-64h192a32 32 0 0 1 0 64zm108.032 298.944a32 32 0 0 1 11.712-43.712l166.272-96a32 32 0 0 1 32 55.424l-166.272 96a32 32 0 0 1-43.712-11.712" fill="${color}"/></svg>`
  },
}

/**
 * 监听尺寸变化
 * 当 size 属性发生变化时，更新图标尺寸
 */
watch(
  () => props.size,
  (newVal) => {
    iconSize.value = addUnit(newVal)
  },
  {
    deep: true,
    immediate: true,
  },
)

/**
 * 构建 SVG 图标
 * 根据类型和颜色生成对应的 SVG 字符串，并转换为 base64 格式
 */
const buildSvg = () => {
  const { type, color } = props
  const ringType: LoadingType = isDef(type) ? type : 'ring'

  // 根据类型生成不同的 SVG
  const svgContent =
    ringType === 'ring' ? icon[ringType](color, intermediateColor.value) : icon[ringType as 'outline' | 'spinner'](color)

  // 转换为 base64 格式的 data URI
  const svgStr = `"data:image/svg+xml;base64,${encode(svgContent)}"`
  svg.value = svgStr
}

/**
 * 监听类型变化
 * 当 type 属性发生变化时，重新构建 SVG
 */
watch(
  () => props.type,
  () => {
    buildSvg()
  },
  {
    deep: true,
    immediate: true,
  },
)

/**
 * 组件挂载前的处理
 * 计算中间渐变颜色并构建 SVG
 */
onBeforeMount(() => {
  // 生成渐变色，用于 ring 类型的加载动画
  intermediateColor.value = gradient(props.color, '#ffffff', 2)[1]
  buildSvg()
})
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/_mixin.scss';
@import '../common/abstracts/variable.scss';

// 加载组件样式
@include b(loading) {
  font-size: 0;
  line-height: 0;
  vertical-align: middle;
  display: inline-block;
  width: $-loading-size;
  height: $-loading-size;

  // 加载动画主体
  @include e(body) {
    width: 100%;
    height: 100%;
    animation: wd-rotate 0.8s linear infinite;
    animation-duration: 2s;
  }

  // SVG 图标样式
  @include e(svg) {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
  }
}

// 旋转动画关键帧
@keyframes wd-rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
