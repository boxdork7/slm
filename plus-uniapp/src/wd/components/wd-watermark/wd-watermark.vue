<!-- Watermark 水印 在页面或组件上添加指定的图片或文字，可用于版权保护、品牌宣传等场景。 -->
<template>
  <view
    :class="`wd-watermark ${fullScreen ? 'is-fullscreen' : ''} ${customClass}`"
    :style="`z-index: ${zIndex}; opacity: ${opacity}; background-size: ${addUnit(width + gutterX)}; ${waterMarkUrl ? `background-image: url('${waterMarkUrl}');` : ''}${customStyle}`"
  >
    <canvas
      v-if="!canvasOffScreenable && showCanvas"
      :id="canvasId"
      type="2d"
      :style="{ height: `${canvasHeight}px`, width: `${canvasWidth}px`, visibility: 'hidden' }"
      :canvas-id="canvasId"
    />
  </view>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref, watch } from 'vue'
import { addUnit, buildUrlWithParams, isBase64Image, rpxToPx, uuid } from '../common/util'

defineOptions({
  name: 'WdWatermark',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 水印组件属性接口
 */
interface WdWatermarkProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 显示内容 */
  content?: string
  /** 显示图片的地址，支持网络图片和base64（钉钉小程序仅支持网络图片） */
  image?: string
  /** 图片高度，单位rpx */
  imageHeight?: number
  /** 图片宽度，单位rpx */
  imageWidth?: number

  /** X轴间距，单位rpx */
  gutterX?: number
  /** Y轴间距，单位rpx */
  gutterY?: number
  /** canvas画布宽度，单位rpx */
  width?: number
  /** canvas画布高度，单位rpx */
  height?: number

  /** 是否为全屏水印 */
  fullScreen?: boolean
  /** 水印字体颜色 */
  color?: string
  /** 水印字体大小，单位rpx */
  size?: number
  /** 水印字体样式（仅微信和h5支持），可能的值：normal、italic、oblique */
  fontStyle?: string
  /** 水印字体的粗细（仅微信和h5支持） */
  fontWeight?: number | string
  /** 水印字体系列（仅微信和h5支持） */
  fontFamily?: string
  /** 水印旋转角度 */
  rotate?: number
  /** 自定义层级 */
  zIndex?: number
  /** 自定义透明度，取值 0~1 */
  opacity?: number
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdWatermarkProps>(), {
  customStyle: '',
  customClass: '',
  content: '',
  image: '',
  imageHeight: 200, // 默认200rpx
  imageWidth: 200, // 默认200rpx
  gutterX: 0,
  gutterY: 0,
  width: 200, // 默认200rpx
  height: 200, // 默认200rpx
  fullScreen: true,
  color: '#8c8c8c',
  size: 28, // 默认28rpx
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontFamily: 'PingFang SC',
  rotate: -25,
  zIndex: 1100,
  opacity: 0.5,
})

// 响应式数据
/** canvas 组件的唯一标识符 */
const canvasId = ref<string>(`water${uuid()}`)
/** canvas生成base64水印 */
const waterMarkUrl = ref<string>('')
/** 是否可以使用离屏canvas */
const canvasOffScreenable = ref<boolean>(
  uni.canIUse('createOffscreenCanvas') && Boolean(uni.createOffscreenCanvas),
)
/** 设备像素比 */
const pixelRatio = ref<number>(uni.getSystemInfoSync().pixelRatio)
/** canvas画布高度（px） */
const canvasHeight = ref<number>(rpxToPx(props.height + props.gutterY) * pixelRatio.value)
/** canvas画布宽度（px） */
const canvasWidth = ref<number>(rpxToPx(props.width + props.gutterX) * pixelRatio.value)
/** 是否展示canvas */
const showCanvas = ref<boolean>(true)

/**
 * 绘制离屏文字canvas
 * 在离屏或H5环境中绘制文字水印
 * @param ctx canvas上下文
 * @param content 水印内容
 * @param contentWidth 水印宽度（px）
 * @param contentHeight 水印高度（px）
 * @param rotate 水印内容倾斜角度
 * @param fontSize 水印字体大小（px）
 * @param fontFamily 水印字体系列
 * @param fontStyle 水印字体样式
 * @param fontWeight 水印字体字重
 * @param color 水印字体颜色
 * @param canvas canvas实例
 */
const drawTextOffScreen = (
  ctx: CanvasRenderingContext2D,
  content: string,
  contentWidth: number,
  contentHeight: number,
  rotate: number,
  fontSize: number,
  fontFamily: string,
  fontStyle: string,
  fontWeight: string | number,
  color: string,
  canvas: HTMLCanvasElement,
) => {
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'
  ctx.translate(contentWidth / 2, contentWidth / 2)
  ctx.rotate((Math.PI / 180) * rotate)
  ctx.font = `${fontStyle} normal ${fontWeight} ${fontSize}px/${contentHeight}px ${fontFamily}`
  ctx.fillStyle = color
  ctx.fillText(content, 0, 0)
  ctx.restore()
  waterMarkUrl.value = canvas.toDataURL()
}

/**
 * 绘制在屏文字canvas
 * 在小程序等不支持离屏canvas的环境中使用
 * @param ctx canvas上下文
 * @param content 水印内容
 * @param contentWidth 水印宽度（px）
 * @param rotate 水印内容倾斜角度
 * @param fontSize 水印字体大小（px）
 * @param color 水印字体颜色
 */
const drawTextOnScreen = (
  ctx: UniApp.CanvasContext,
  content: string,
  contentWidth: number,
  rotate: number,
  fontSize: number,
  color: string,
) => {
  ctx.setTextBaseline('middle')
  ctx.setTextAlign('center')
  ctx.translate(contentWidth / 2, contentWidth / 2)
  ctx.rotate((Math.PI / 180) * rotate)
  ctx.setFillStyle(color)
  ctx.setFontSize(fontSize)
  ctx.fillText(content, 0, 0)
  ctx.restore()
  ctx.draw()

  // #ifdef MP-DINGTALK
  // 钉钉小程序的canvasToTempFilePath接口与其他平台不一样
  ;(ctx as any).toTempFilePath({
    success(res: any) {
      showCanvas.value = false
      waterMarkUrl.value = res.filePath
    },
  })
  // #endif

  // #ifndef MP-DINGTALK
  uni.canvasToTempFilePath({
    canvasId: canvasId.value,
    success: (res) => {
      showCanvas.value = false
      waterMarkUrl.value = res.tempFilePath
    },
  })
  // #endif
}

/**
 * 绘制离屏图片canvas
 * 在离屏或H5环境中绘制图片水印
 * @param ctx canvas上下文
 * @param img 水印图片对象
 * @param image 水印图片地址
 * @param imageHeight 水印图片高度（rpx）
 * @param imageWidth 水印图片宽度（rpx）
 * @param rotate 水印内容倾斜角度
 * @param contentWidth 水印宽度（px）
 * @param contentHeight 水印高度（px）
 * @param canvas canvas实例
 */
const drawImageOffScreen = async (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  image: string,
  imageHeight: number,
  imageWidth: number,
  rotate: number,
  contentWidth: number,
  contentHeight: number,
  canvas: HTMLCanvasElement,
) => {
  ctx.translate(contentWidth / 2, contentHeight / 2)
  ctx.rotate((Math.PI / 180) * Number(rotate))
  img.crossOrigin = 'anonymous'
  img.referrerPolicy = 'no-referrer'

  // 根据图片类型设置源地址
  if (isBase64Image(image)) {
    img.src = image
  } else {
    img.src = buildUrlWithParams(image, {
      timestamp: `${new Date().getTime()}`,
    })
  }

  img.onload = () => {
    // 将rpx转换为px进行绘制
    const imgWidthPx = rpxToPx(imageWidth) * pixelRatio.value
    const imgHeightPx = rpxToPx(imageHeight) * pixelRatio.value

    ctx.drawImage(img, -imgWidthPx / 2, -imgHeightPx / 2, imgWidthPx, imgHeightPx)
    ctx.restore()
    waterMarkUrl.value = canvas.toDataURL()
  }
}

/**
 * 绘制在屏图片canvas
 * 在小程序等不支持离屏canvas的环境中绘制图片水印
 * @param ctx canvas上下文
 * @param image 水印图片地址
 * @param imageHeight 水印图片高度（rpx）
 * @param imageWidth 水印图片宽度（rpx）
 * @param rotate 水印内容倾斜角度
 * @param contentWidth 水印宽度（px）
 * @param contentHeight 水印高度（px）
 */
const drawImageOnScreen = (
  ctx: UniApp.CanvasContext,
  image: string,
  imageHeight: number,
  imageWidth: number,
  rotate: number,
  contentWidth: number,
  contentHeight: number,
) => {
  ctx.translate(contentWidth / 2, contentHeight / 2)
  ctx.rotate((Math.PI / 180) * Number(rotate))

  // 将rpx转换为px进行绘制
  const imgWidthPx = rpxToPx(imageWidth) * pixelRatio.value
  const imgHeightPx = rpxToPx(imageHeight) * pixelRatio.value

  ctx.drawImage(image, -imgWidthPx / 2, -imgHeightPx / 2, imgWidthPx, imgHeightPx)
  ctx.restore()
  ctx.draw(false, () => {
    // #ifdef MP-DINGTALK
    // 钉钉小程序的canvasToTempFilePath接口与其他平台不一样
    ;(ctx as any).toTempFilePath({
      success(res: any) {
        showCanvas.value = false
        waterMarkUrl.value = res.filePath
      },
    })
    // #endif

    // #ifndef MP-DINGTALK
    uni.canvasToTempFilePath({
      canvasId: canvasId.value,
      success: (res) => {
        showCanvas.value = false
        waterMarkUrl.value = res.tempFilePath
      },
    })
    // #endif
  })
}

/**
 * 创建离屏canvas
 * @param canvasHeight canvas高度（px）
 * @param canvasWidth canvas宽度（px）
 * @param contentWidth 内容宽度（px）
 * @param contentHeight 内容高度（px）
 * @param rotate 内容倾斜角度
 * @param fontSize 字体大小（px）
 * @param fontFamily 字体系列
 * @param fontStyle 字体样式
 * @param fontWeight 字体字重
 * @param color 字体颜色
 * @param content 内容
 * @param image canvas图片
 * @param imageHeight canvas图片高度（rpx）
 * @param imageWidth canvas图片宽度（rpx）
 */
const createOffscreenCanvas = (
  canvasHeight: number,
  canvasWidth: number,
  contentWidth: number,
  contentHeight: number,
  rotate: number,
  fontSize: number,
  fontFamily: string,
  fontStyle: string,
  fontWeight: string | number,
  color: string,
  content: string,
  image: string,
  imageHeight: number,
  imageWidth: number,
) => {
  // 创建离屏canvas
  const canvas: any = uni.createOffscreenCanvas({
    height: canvasHeight,
    width: canvasWidth,
    type: '2d',
  })
  const ctx: any = canvas.getContext('2d')

  if (ctx) {
    if (image) {
      const img = canvas.createImage() as HTMLImageElement
      drawImageOffScreen(
        ctx,
        img,
        image,
        imageHeight,
        imageWidth,
        rotate,
        contentWidth,
        contentHeight,
        canvas,
      )
    } else {
      drawTextOffScreen(
        ctx,
        content,
        contentWidth,
        contentHeight,
        rotate,
        fontSize,
        fontFamily,
        fontStyle,
        fontWeight,
        color,
        canvas,
      )
    }
  } else {
    console.error('无法获取canvas上下文，请确认当前环境是否支持canvas')
  }
}

/**
 * 创建普通canvas
 * 不支持离屏canvas时的降级方案
 * @param contentHeight 内容高度（px）
 * @param contentWidth 内容宽度（px）
 * @param rotate 内容倾斜角度
 * @param fontSize 字体大小（px）
 * @param color 字体颜色
 * @param content 内容
 * @param image canvas图片
 * @param imageHeight canvas图片高度（rpx）
 * @param imageWidth canvas图片宽度（rpx）
 */
const createCanvas = (
  contentHeight: number,
  contentWidth: number,
  rotate: number,
  fontSize: number,
  color: string,
  content: string,
  image: string,
  imageHeight: number,
  imageWidth: number,
) => {
  const ctx = uni.createCanvasContext(canvasId.value)

  if (ctx) {
    if (image) {
      drawImageOnScreen(ctx, image, imageHeight, imageWidth, rotate, contentWidth, contentHeight)
    } else {
      drawTextOnScreen(ctx, content, contentWidth, rotate, fontSize, color)
    }
  } else {
    console.error('无法获取canvas上下文，请确认当前环境是否支持canvas')
  }
}

/**
 * H5环境创建canvas
 * 使用DOM API创建canvas元素
 * @param canvasHeight canvas高度（px）
 * @param canvasWidth canvas宽度（px）
 * @param contentWidth 水印内容宽度（px）
 * @param contentHeight 水印内容高度（px）
 * @param rotate 水印内容倾斜角度
 * @param fontSize 水印字体大小（px）
 * @param fontFamily 水印字体系列
 * @param fontStyle 水印字体样式
 * @param fontWeight 水印字体字重
 * @param color 水印字体颜色
 * @param content 水印内容
 * @param image 水印图片
 * @param imageHeight 水印图片高度（rpx）
 * @param imageWidth 水印图片宽度（rpx）
 */
const createH5Canvas = (
  canvasHeight: number,
  canvasWidth: number,
  contentWidth: number,
  contentHeight: number,
  rotate: number,
  fontSize: number,
  fontFamily: string,
  fontStyle: string,
  fontWeight: string | number,
  color: string,
  content: string,
  image: string,
  imageHeight: number,
  imageWidth: number,
) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.setAttribute('width', `${canvasWidth}px`)
  canvas.setAttribute('height', `${canvasHeight}px`)

  if (ctx) {
    if (image) {
      const img = new Image()
      drawImageOffScreen(
        ctx,
        img,
        image,
        imageHeight,
        imageWidth,
        rotate,
        contentWidth,
        contentHeight,
        canvas,
      )
    } else {
      drawTextOffScreen(
        ctx,
        content,
        contentWidth,
        contentHeight,
        rotate,
        fontSize,
        fontFamily,
        fontStyle,
        fontWeight,
        color,
        canvas,
      )
    }
  } else {
    console.error('无法获取canvas上下文，请确认当前环境是否支持canvas')
  }
}

/**
 * 创建水印图片
 * @param width canvas宽度（rpx）
 * @param height canvas高度（rpx）
 * @param color canvas字体颜色
 * @param size canvas字体大小（rpx）
 * @param fontStyle canvas字体样式
 * @param fontWeight canvas字体字重
 * @param fontFamily canvas字体系列
 * @param content canvas内容
 * @param rotate 倾斜角度
 * @param gutterX X轴间距（rpx）
 * @param gutterY Y轴间距（rpx）
 * @param image canvas图片
 * @param imageHeight canvas图片高度（rpx）
 * @param imageWidth canvas图片宽度（rpx）
 */
const createWaterMark = (
  width: number,
  height: number,
  color: string,
  size: number,
  fontStyle: string,
  fontWeight: number | string,
  fontFamily: string,
  content: string,
  rotate: number,
  gutterX: number,
  gutterY: number,
  image: string,
  imageHeight: number,
  imageWidth: number,
) => {
  // 转换rpx为px
  const canvasHeight = rpxToPx(height + gutterY) * pixelRatio.value
  const canvasWidth = rpxToPx(width + gutterX) * pixelRatio.value
  const contentWidth = rpxToPx(width) * pixelRatio.value
  const contentHeight = rpxToPx(height) * pixelRatio.value
  const fontSize = rpxToPx(size) * pixelRatio.value

  // #ifndef H5
  if (canvasOffScreenable.value) {
    createOffscreenCanvas(
      canvasHeight,
      canvasWidth,
      contentWidth,
      contentHeight,
      rotate,
      fontSize,
      fontFamily,
      fontStyle,
      fontWeight,
      color,
      content,
      image,
      imageHeight,
      imageWidth,
    )
  } else {
    createCanvas(
      canvasHeight,
      contentWidth,
      rotate,
      fontSize,
      color,
      content,
      image,
      imageHeight,
      imageWidth,
    )
  }
  // #endif

  // #ifdef H5
  createH5Canvas(
    canvasHeight,
    canvasWidth,
    contentWidth,
    contentHeight,
    rotate,
    fontSize,
    fontFamily,
    fontStyle,
    fontWeight,
    color,
    content,
    image,
    imageHeight,
    imageWidth,
  )
  // #endif
}

/**
 * 初始化水印
 * 根据平台特性创建相应的canvas水印
 */
const doInit = () => {
  // #ifdef H5
  // h5使用document.createElement创建canvas，不用展示canvas标签
  showCanvas.value = false
  // #endif

  const {
    width,
    height,
    color,
    size,
    fontStyle,
    fontWeight,
    fontFamily,
    content,
    rotate,
    gutterX,
    gutterY,
    image,
    imageHeight,
    imageWidth,
  } = props

  // 创建水印
  createWaterMark(
    width,
    height,
    color,
    size,
    fontStyle,
    fontWeight,
    fontFamily,
    content,
    rotate,
    gutterX,
    gutterY,
    image,
    imageHeight,
    imageWidth,
  )
}

/**
 * 重置水印
 * 重新计算canvas尺寸并重新初始化
 */
const doReset = () => {
  showCanvas.value = true
  canvasHeight.value = rpxToPx(props.height + props.gutterY) * pixelRatio.value
  canvasWidth.value = rpxToPx(props.width + props.gutterX) * pixelRatio.value

  nextTick(() => {
    doInit()
  })
}

/**
 * 监听属性变化
 * 当属性发生变化时，重置水印
 */
watch(
  () => props,
  () => {
    doReset()
  },
  { deep: true },
)

/**
 * 组件挂载后初始化水印
 */
onMounted(() => {
  doInit()
})
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable.scss';
@import '../common/abstracts/_mixin.scss';

// 水印组件样式
@include b(watermark) {
  position: absolute;
  z-index: 1100;
  opacity: 0.5;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: none;
  background-repeat: repeat;

  // 全屏状态样式
  @include when(fullscreen) {
    position: fixed;
  }
}
</style>
