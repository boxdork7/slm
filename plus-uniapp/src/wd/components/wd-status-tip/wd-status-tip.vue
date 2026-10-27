<!-- StatusTip 缺省提示 一般用于兜底占位展示。 -->
<template>
  <view :class="`wd-status-tip ${customClass}`" :style="customStyle">
    <slot v-if="$slots.image" name="image" />
    <wd-img
      v-else-if="imgUrl"
      :mode="imageMode"
      :src="imgUrl"
      custom-class="wd-status-tip__image"
      :custom-style="imgStyle"
    />
    <view v-if="tip" class="wd-status-tip__text">
      {{ tip }}
    </view>
    <view v-if="$slots.bottom" class="wd-status-tip__bottom">
      <slot name="bottom" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import { computed } from 'vue'
import { addUnit, isDef, isObj, objToStyle } from '../common/util'
import wdImg from '../wd-img/wd-img.vue'

defineOptions({
  name: 'WdStatusTip',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 图片模式类型
 */
type ImageMode =
  | 'scaleToFill'
  | 'aspectFit'
  | 'aspectFill'
  | 'widthFix'
  | 'heightFix'
  | 'top'
  | 'bottom'
  | 'center'
  | 'left'
  | 'right'
  | 'top left'
  | 'top right'
  | 'bottom left'
  | 'bottom right'

/**
 * 图片尺寸类型
 */
interface ImageSize {
  /** 宽度 */
  width: number | string
  /** 高度 */
  height: number | string
}

/**
 * 状态提示组件属性接口
 */
interface WdStatusTipProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 缺省图片类型，支持传入图片 URL，可选值：search, network, content, collect, comment, halo, message */
  image?: 'search' | 'network' | 'content' | 'collect' | 'comment' | 'halo' | 'message' | string
  /** 图片大小，默认单位为 px */
  imageSize?: string | number | ImageSize
  /** 提示文案 */
  tip?: string
  /** 图片裁剪、缩放的模式 */
  imageMode?: ImageMode
  /** 图片路径前缀，指向图片所在目录，用于拼接图片 URL */
  urlPrefix?: string
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdStatusTipProps>(), {
  customStyle: '',
  customClass: '',
  image: 'network',
  imageSize: '',
  tip: '',
  imageMode: 'aspectFill',
  urlPrefix: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/',
})

/**
 * 计算图片地址
 * 根据传入的图片类型或自定义 URL 生成最终的图片地址
 */
const imgUrl = computed(() => {
  // 预设的图片类型列表
  const presetImages = ['search', 'network', 'content', 'collect', 'comment', 'halo', 'message']

  // 如果是预设类型，则使用 URL 前缀拼接
  if (presetImages.includes(props.image)) {
    return `${props.urlPrefix}${props.image}.png`
  } else {
    // 否则直接使用传入的图片地址
    return props.image
  }
})

/**
 * 计算图片样式
 * 根据 imageSize 属性设置图片的宽高样式
 */
const imgStyle = computed(() => {
  let style: CSSProperties = {}

  if (props.imageSize) {
    if (isObj(props.imageSize)) {
      // 对象格式：{ width: xxx, height: xxx }
      const sizeObj = props.imageSize as ImageSize
      if (isDef(sizeObj.height)) {
        style.height = addUnit(sizeObj.height)
      }
      if (isDef(sizeObj.width)) {
        style.width = addUnit(sizeObj.width)
      }
    } else {
      // 字符串或数字格式：同时设置宽高
      style = {
        height: addUnit(props.imageSize),
        width: addUnit(props.imageSize),
      }
    }
  }

  return objToStyle(style)
})
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 暗色主题样式
.wot-theme-dark {
  background-color: $-dark-background2;

  @include b(status-tip) {
    @include e(text) {
      color: $-dark-color3;
    }
  }
}

// 状态提示组件样式
@include b(status-tip) {
  padding: $-statustip-padding;
  width: 100%;
  margin: 0 auto;
  color: $-statustip-color;
  font-size: $-statustip-fs;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;

  // 图片样式
  @include edeep(image) {
    margin: 0 auto;
    width: 320rpx;
    height: 320rpx;
    display: flex!important;
    justify-content: center;
    align-items: center;
  }

  // 文本样式
  @include e(text) {
    margin: 40rpx auto 0;
    font-size: $-statustip-fs;
    line-height: $-statustip-line-height;
    color: $-statustip-color;
    text-align: center;
    overflow-wrap: break-word;
  }

  // 底部插槽样式
  @include e(bottom) {
    display: flex;
    justify-content: center;
    margin-top: 20rpx;
  }
}
</style>
