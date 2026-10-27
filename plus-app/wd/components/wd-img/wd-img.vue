<!-- Img 图片 增强版的 img 标签，支持单张图片和多张图片展示 -->
<template>
  <view
    :class="`wd-img ${customClass} ${displayImageList.length > 1 ? 'is-multi' : ''}`"
    :style="customStyle"
    @click="handleClick"
  >
    <!-- 单张图片显示或多张图片只显示第一张 -->
    <template v-if="displayImageList.length === 1">
      <image
        :class="`wd-img__image ${customImage} ${round ? 'is-round' : ''}`"
        :style="`${status !== 'success' ? 'width: 0;height: 0;' : ''}${getImageStyle()}`"
        :src="displayImageList[0]"
        :mode="mode"
        :show-menu-by-longpress="showMenuByLongpress"
        :lazy-load="lazyLoad"
        @load="handleLoad"
        @error="handleError"
        @longpress="enableLongpress ? handleLongpress : undefined"
      />
      <slot v-if="status === 'loading'" name="loading" />
      <slot v-if="status === 'error'" name="error" />

      <!-- 多张图片但只显示第一张时的角标提示 -->
      <view v-if="singleMode && imageList.length > 1" class="wd-img__count-badge">
        <text class="wd-img__count-text">
          {{ imageList.length }}
        </text>
      </view>
    </template>

    <!-- 多张图片显示 -->
    <template v-else-if="displayImageList.length > 1">
      <view class="wd-img__multi-container">
        <view
          v-for="(imgSrc, index) in displayImageList"
          :key="index"
          class="wd-img__multi-item"
          @click.stop="handleImageClick(index)"
        >
          <image
            :class="`wd-img__image ${customImage} ${round ? 'is-round' : ''}`"
            :style="getImageStyle()"
            :src="imgSrc"
            :mode="mode"
            :show-menu-by-longpress="showMenuByLongpress"
            :lazy-load="lazyLoad"
            @load="handleMultiLoad(index)"
            @error="(event) => handleMultiError(index, event)"
            @longpress="enableLongpress ? (e) => handleMultiLongpress(index, e) : undefined"
          />
          <!-- 显示更多图片的遮罩 - 只在最后一张图片且有更多图片时显示 -->
          <view
            v-if="index === displayImageList.length - 1 && hasMoreImages"
            class="wd-img__more-overlay"
          >
            <text class="wd-img__more-text">+{{ imageList.length - displayImageList.length }}</text>
          </view>
        </view>
      </view>
    </template>
  </view>
</template>

<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import { computed, ref } from 'vue'
import { addUnit, isDef, objToStyle } from '../common/util'

defineOptions({
  name: 'WdImg',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 图片显示模式类型
 */
export type ImageMode =
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
 * 图片加载状态类型
 */
type ImageStatus = 'loading' | 'error' | 'success'

/**
 * 图片组件属性接口
 */
interface WdImgProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string
  /** 自定义图片样式类 */
  customImage?: string

  /**
   * 图片链接，支持单张图片字符串或多张图片逗号分隔的字符串
   * 现在支持静态资源路径类型检查和智能提示
   */
  src?: ImageSrc
  /**
   * 预览图片链接，如果不设置则使用 src
   * 现在支持静态资源路径类型检查和智能提示
   */
  previewSrc?: ImageSrc
  /** 是否显示为圆形 */
  round?: boolean
  /** 图片填充模式 */
  mode?: ImageMode
  /** 是否懒加载 */
  lazyLoad?: boolean
  /** 宽度，默认单位为px */
  width?: string | number
  /** 高度，默认单位为px */
  height?: string | number
  /** 圆角大小，默认单位为px */
  radius?: string | number
  /** 是否允许预览 */
  enablePreview?: boolean
  /** 开启长按图片显示识别小程序码菜单，仅在微信小程序平台有效 */
  showMenuByLongpress?: boolean
  /** 多图片时最大显示数量，超出部分显示 +N */
  maxDisplay?: number
  /** 多张图片时是否启用单图模式（只显示第一张） */
  singleMode?: boolean
  /** 是否启用长按图片选项功能 */
  enableLongpress?: boolean
  /** 自定义长按处理函数，如果不提供则使用默认实现 */
  onLongpress?: (event: Event, imageList: string[], currentIndex: number) => void
}

/**
 * 图片组件事件接口
 */
interface WdImgEmits {
  /** 图片加载失败时触发 */
  error: [event: any, index?: number]
  /** 点击图片时触发 */
  click: [event: MouseEvent, index?: number]
  /** 图片加载成功时触发 */
  load: [event: any, index?: number]
  /** 长按图片时触发，可用于显示图片选项菜单 */
  longpress: [event: Event, imageList: string[], currentIndex: number]
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdImgProps>(), {
  customStyle: '',
  customClass: '',
  customImage: '',
  round: false,
  mode: 'scaleToFill',
  lazyLoad: false,
  width: 200,
  height: 200,
  enablePreview: false,
  showMenuByLongpress: false,
  maxDisplay: 9,
  singleMode: false,
  enableLongpress: false,
})

// 定义组件事件
const emit = defineEmits<WdImgEmits>()

// 响应式数据：图片加载状态
const status = ref<ImageStatus>('loading')
const multiStatus = ref<Record<number, ImageStatus>>({})

// 计算属性：图片列表
const imageList = computed(() => {
  if (!props.src) return []

  // 判断是否为 base64 图片
  if (props.src.startsWith('data:image/')) {
    return [props.src] // base64 图片作为单张图片处理
  }

  // 普通 URL 按逗号分割
  return props.src
    .split(',')
    .map((url) => url.trim())
    .filter((url) => url)
})

// 计算属性：实际显示的图片列表
const displayImageList = computed(() => {
  if (props.singleMode && imageList.value.length > 1) {
    return [imageList.value[0]] // 只显示第一张
  }
  return imageList.value.slice(0, props.maxDisplay)
})

// 计算属性：是否有更多图片
const hasMoreImages = computed(() => {
  return imageList.value.length > props.maxDisplay
})

/**
 * 获取图片样式
 */
const getImageStyle = () => {
  const style: CSSProperties = {}

  // 所有图片都使用固定尺寸
  style.width = addUnit(props.width)
  style.height = addUnit(props.height)

  // 处理圆角（非圆形时）
  if (!props.round && isDef(props.radius)) {
    style.borderRadius = addUnit(props.radius)
  }

  return objToStyle(style)
}

/**
 * 处理图片加载失败事件
 * 更新状态为错误并触发 error 事件
 * @param event uni-app 图片错误事件对象
 */
const handleError = (event: any) => {
  status.value = 'error'
  emit('error', event)
}

/**
 * 处理多图片加载失败事件
 */
const handleMultiError = (index: number, event: any) => {
  multiStatus.value[index] = 'error'
  emit('error', event, index)
}

/**
 * 处理单张图片点击事件
 */
const handleImageClick = (index: number, event?: MouseEvent) => {
  if (props.enablePreview && imageList.value.length > 0) {
    uni.previewImage({
      urls: props.previewSrc ? [props.previewSrc] : imageList.value,
      current: imageList.value[index],
    })
  }

  emit('click', event || new MouseEvent('click'), index)
}

/**
 * 处理图片点击事件
 */
const handleClick = (event: MouseEvent) => {
  if (displayImageList.value.length === 1) {
    handleImageClick(0, event)
  } else {
    emit('click', event)
  }
}

/**
 * 处理图片加载成功事件
 * 更新状态为成功并触发 load 事件
 * @param event uni-app 图片加载事件对象
 */
const handleLoad = (event: any) => {
  status.value = 'success'
  emit('load', event)
}

/**
 * 处理多图片加载成功事件
 */
const handleMultiLoad = (index: number) => {
  multiStatus.value[index] = 'success'
  emit('load', index)
}

/**
 * 默认长按处理函数
 */
const defaultLongpressHandler = (event: Event, imageList: string[], currentIndex: number) => {
  const currentImage = imageList[currentIndex]

  uni.showActionSheet({
    itemList: ['保存图片', '预览图片', '复制链接'],
    success: (res) => {
      switch (res.tapIndex) {
        case 0: // 保存图片
          uni.saveImageToPhotosAlbum({
            filePath: currentImage,
            success: () => {
              uni.showToast({
                title: '保存成功',
                icon: 'success',
              })
            },
            fail: () => {
              uni.showToast({
                title: '保存失败',
                icon: 'error',
              })
            },
          })
          break

        case 1: // 预览图片
          uni.previewImage({
            urls: imageList,
            current: currentImage,
          })
          break

        case 2: // 复制链接
          uni.setClipboardData({
            data: currentImage,
            success: () => {
              uni.showToast({
                title: '链接已复制',
                icon: 'success',
              })
            },
          })
          break
      }
    },
  })
}

/**
 * 处理长按事件
 */
const handleLongpress = (event: Event) => {
  // 如果提供了自定义长按函数，使用自定义函数，否则使用默认实现
  if (props.onLongpress) {
    props.onLongpress(event, imageList.value, 0)
  } else {
    defaultLongpressHandler(event, imageList.value, 0)
  }

  // 同时触发事件，便于外部监听
  emit('longpress', event, imageList.value, 0)
}

/**
 * 处理多图片长按事件
 */
const handleMultiLongpress = (index: number, event: Event) => {
  // 如果提供了自定义长按函数，使用自定义函数，否则使用默认实现
  if (props.onLongpress) {
    props.onLongpress(event, imageList.value, index)
  } else {
    defaultLongpressHandler(event, imageList.value, index)
  }

  // 同时触发事件，便于外部监听
  emit('longpress', event, imageList.value, index)
}
</script>

<style lang="scss">
// 引入外部样式文件
@import './../common/abstracts/_mixin.scss';
@import './../common/abstracts/variable.scss';

// 图片组件样式
@include b(img) {
  position: relative;
  display: inline-block;

  // 图片元素样式
  @include e(image) {
    display: block;
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    // 圆形样式
    @include when(round) {
      border-radius: 50% !important;
      overflow: hidden;
    }
  }

  // 多图片容器
  @include e(multi-container) {
    display: flex;
    flex-wrap: wrap;
    gap: 8rpx;
    width: 100%;
    height: 100%;

    // 应用容器的圆角到整个多图片区域
    border-radius: inherit;
    overflow: hidden;
  }

  // 多图片项
  @include e(multi-item) {
    position: relative;
    overflow: hidden;
    border-radius: 8rpx;
    flex-shrink: 0; // 防止图片被压缩
  }

  // 更多图片遮罩
  @include e(more-overlay) {
    position: absolute;
    top: 0;
    right: 0;
    width: 60rpx;
    height: 60rpx;
    background: linear-gradient(65deg, transparent 0%, transparent 30%, rgba(0, 0, 0, 0.5) 100%);
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    padding: 4rpx 8rpx 8rpx 4rpx;
    box-sizing: border-box;
  }

  @include e(more-text) {
    color: white;
    font-size: 32rpx;
    font-weight: bold;
  }

  // 多图片模式样式调整
  @include when(multi) {
    // 容器尺寸由外部控制，内部只负责布局
    .wd-img__multi-container {
      border-radius: inherit;
      overflow: hidden;
    }

    // 多图片模式下，每个图片项继承容器的部分样式
    .wd-img__multi-item {
      .wd-img__image {
        // 圆形样式优先
        @include when(round) {
          border-radius: 50% !important;
          overflow: hidden;
        }

        // 非圆形时使用默认圆角
        &:not(.is-round) {
          border-radius: 4rpx;
        }
      }
    }
  }

  // 数量角标
  @include e(count-badge) {
    position: absolute;
    top: 12rpx;
    right: 12rpx;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 20rpx;
    min-width: 40rpx;
    height: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 12rpx;
  }

  @include e(count-text) {
    color: white;
    font-size: 24rpx;
    font-weight: bold;
    line-height: 1;
  }
}
</style>
