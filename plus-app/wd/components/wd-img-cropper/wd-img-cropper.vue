<!-- ImgCropper 图片裁剪 图片剪裁组件，用于图片裁剪，支持拖拽、缩放、旋转等操作。 -->
<template>
  <!-- 绘制的图片canvas -->
  <view
    v-if="modelValue"
    :class="`wd-img-cropper ${customClass}`"
    :style="customStyle"
    @touchmove="preventTouchMove"
  >
    <!-- 展示在用户面前的裁剪框 -->
    <view class="wd-img-cropper__wrapper">
      <!-- 画出裁剪框 -->
      <view class="wd-img-cropper__cut">
        <!-- 上方阴影块 -->
        <view
          :class="`wd-img-cropper__cut--top ${IS_TOUCH_END ? '' : 'is-hightlight'}`"
          :style="`height: ${addUnit(cutTop)};`"
        ></view>
        <view class="wd-img-cropper__cut--middle" :style="`height: ${addUnit(cutHeight)};`">
          <!-- 左侧阴影块 -->
          <view
            :class="`wd-img-cropper__cut--left ${IS_TOUCH_END ? '' : 'is-hightlight'}`"
            :style="`width: ${addUnit(cutLeft)}; height: ${addUnit(cutHeight)};`"
          ></view>
          <!-- 裁剪框 -->
          <view
            class="wd-img-cropper__cut--body"
            :style="`width: ${addUnit(cutWidth)}; height: ${addUnit(cutHeight)};`"
          >
            <!-- 内部网格线 -->
            <view class="is-gridlines-x"></view>
            <view class="is-gridlines-y"></view>
            <!-- 裁剪窗体四个对角 -->
            <view class="is-left-top"></view>
            <view class="is-left-bottom"></view>
            <view class="is-right-top"></view>
            <view class="is-right-bottom"></view>
          </view>
          <!-- 右侧阴影块 -->
          <view :class="`wd-img-cropper__cut--right ${IS_TOUCH_END ? '' : 'is-hightlight'}`"></view>
        </view>
        <!-- 底部阴影块 -->
        <view :class="`wd-img-cropper__cut--bottom ${IS_TOUCH_END ? '' : 'is-hightlight'}`"></view>
      </view>
      <!-- 展示的传过来的图片: 控制图片的旋转角度(rotate)、缩放程度(imgScale)、移动位置(translate) -->
      <image
        :prop="isAnimation"
        :change:prop="animation ? animation.setAnimation : ''"
        class="wd-img-cropper__img"
        :src="imgSrc"
        :style="imageStyle"
        :lazy-load="false"
        @touchstart="handleImgTouchStart"
        @touchmove="handleImgTouchMove"
        @touchend="handleImgTouchEnd"
        @error="handleImgLoadError"
        @load="handleImgLoaded"
      />
    </view>
    <!-- 绘制的图片canvas -->
    <canvas
      :id="canvasId"
      :canvas-id="canvasId"
      class="wd-img-cropper__canvas"
      :disable-scroll="true"
      :style="`width: ${addUnit(Number(canvasWidth) * canvasScale)}; height: ${addUnit(Number(canvasHeight) * canvasScale)};`"
    />
    <!-- 下方按钮 -->
    <view class="wd-img-cropper__footer">
      <wd-icon
        v-if="!disabledRotate"
        custom-class="wd-img-cropper__rotate"
        name="rotate"
        @click="handleRotate"
      />
      <view class="wd-img-cropper__footer--button">
        <view class="is-cancel" @click="handleCancel">
          {{ cancelButtonText || translate('cancel') }}
        </view>
        <wd-button size="small" :custom-style="buttonStyle" @click="handleConfirm">
          {{ confirmButtonText || translate('confirm') }}
        </wd-button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { ComponentPublicInstance } from 'vue'
import { computed, getCurrentInstance, ref, watch } from 'vue'
import { addUnit, objToStyle, pxToRpx, rpxToPx, uuid } from '../common/util'
import { useTranslate } from '../composables/useTranslate'
import wdButton from '../wd-button/wd-button.vue'
import wdIcon from '../wd-icon/wd-icon.vue'

defineOptions({
  name: 'WdImgCropper',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 图片裁剪组件属性接口
 */
interface WdImgCropperProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 打开图片裁剪组件 */
  modelValue?: boolean
  /** 取消按钮文案 */
  cancelButtonText?: string
  /** 确认按钮文案 */
  confirmButtonText?: string
  /** 是否禁用旋转 */
  disabledRotate?: boolean
  /** 目标文件的类型，wx.canvasToTempFilePath属性介绍 */
  fileType?: string
  /** 生成的图片质量 wx.canvasToTempFilePath属性介绍 */
  quality?: number
  /** 设置导出图片尺寸 */
  exportScale?: number
  /** 图片源路径 */
  imgSrc?: string
  /** 图片宽（rpx） */
  imgWidth?: string | number
  /** 图片高（rpx） */
  imgHeight?: string | number
  /** 最大缩放 */
  maxScale?: number
  /** 裁剪框宽高比，格式为 width:height */
  aspectRatio?: string
}

/**
 * 图片裁剪组件事件接口
 */
interface WdImgCropperEmits {
  /** 图片加载完成时触发 */
  imgloaded: [res: any]
  /** 图片加载失败时触发 */
  imgloaderror: [err: any]
  /** 取消裁剪时触发 */
  cancel: []
  /** 确认裁剪时触发 */
  confirm: [result: { tempFilePath: string; width: number; height: number }]
  /** 更新modelValue */
  'update:modelValue': [value: boolean]
}

/**
 * 图片裁剪组件暴露方法接口
 */
interface WdImgCropperExpose {
  /** 逆转是否使用动画 */
  revertIsAnimation: (animation: boolean) => void
  /** 初始化图片的大小和角度以及距离 */
  resetImg: () => void
  /** 控制旋转角度 */
  setRoate: (angle: number) => void
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdImgCropperProps>(), {
  customStyle: '',
  customClass: '',
  modelValue: false,
  disabledRotate: false,
  fileType: 'png',
  quality: 1,
  exportScale: 2,
  imgSrc: '',
  imgWidth: '',
  imgHeight: '',
  maxScale: 3,
  aspectRatio: '1:1',
})

// 定义组件事件
const emit = defineEmits<WdImgCropperEmits>()

// 多语言支持
const { translate } = useTranslate('img-cropper')

// 获取当前组件实例
const { proxy } = getCurrentInstance() as any

// 响应式数据
const canvasId = ref<string>(`cropper${uuid()}`) // canvas 组件的唯一标识符
const imgAngle = ref<number>(0) // 旋转角度
const isAnimation = ref<boolean>(false) // 是否开启动画
// #ifdef MP-ALIPAY || APP-PLUS || H5
// hack 避免钉钉小程序、支付宝小程序、app抛出相关异常
const animation: any = null

// #endif
// 裁剪框的宽高（rpx）
const picWidth = ref<number>(0)
const picHeight = ref<number>(0)
const cutWidth = ref<number>(0)
const cutHeight = ref<number>(0)
const offset = ref<number>(40)

// 裁剪框的距顶距左
const cutLeft = ref<number>(0)
const cutTop = ref<number>(0)

// canvas最终成像宽高（rpx）
const canvasWidth = ref<string | number>('')
const canvasHeight = ref<string | number>('')
const canvasScale = ref<number>(2)

// 当前缩放大小
const imgScale = ref<number>(1)

// 顶部裁剪框占比
const TOP_PERCENT = 0.85
// 图片中心轴点距左的距离（rpx）
const imgLeft = ref<number>(pxToRpx(uni.getSystemInfoSync().windowWidth / 2))
const imgTop = ref<number>(pxToRpx((uni.getSystemInfoSync().windowHeight / 2) * TOP_PERCENT))

const imgInfo = ref<UniApp.GetImageInfoSuccessData | null>(null)
const info = ref<UniApp.GetSystemInfoResult>(uni.getSystemInfoSync())

// 是否移动中设置 同时控制背景颜色是否高亮
const IS_TOUCH_END = ref<boolean>(true)

// 记录移动中的双指位置 [0][1]分别代表两根手指 [1]做待用参数
const movingPosRecord = ref<Record<string, string | number>[]>([
  { x: '', y: '' },
  { x: '', y: '' },
])

// 双指缩放时 两个坐标点斜边长度
const fingerDistance = ref<string | number>('')
const ctx = ref<UniApp.CanvasContext | null>(null)

// 延时动画设置
let CHANGE_TIME: any | null = null
// 移动节流
let MOVE_THROTTLE: any | null = null
// 节流标志
let MOVE_THROTTLE_FLAG: boolean = true
// 图片设置尺寸,此值不变（记录最初设定的尺寸）
let INIT_IMGWIDTH: null | number | string = null
let INIT_IMGHEIGHT: null | number | string = null

/**
 * 计算按钮样式
 */
const buttonStyle = computed(() => {
  const style: Record<string, string | number> = {
    position: 'absolute',
    right: 0,
    width: addUnit(112), // 56px = 112rpx
    'border-radius': addUnit(32), // 16px = 32rpx
    'font-size': addUnit(32), // 16px = 32rpx
  }
  return objToStyle(style)
})

/**
 * 计算图片样式
 */
const imageStyle = computed(() => {
  const style: Record<string, string | number> = {
    width: picWidth.value ? addUnit(picWidth.value) : 'auto',
    height: picHeight.value ? addUnit(picHeight.value) : 'auto',
    transform: `translate(${addUnit(imgLeft.value - picWidth.value / 2)}, ${addUnit(imgTop.value - picHeight.value / 2)}) scale(${
      imgScale.value
    }) rotate(${imgAngle.value}deg)`,
    'transition-duration': `${isAnimation.value ? 0.4 : 0}s`,
  }
  return objToStyle(style)
})

/**
 * 图片初始化,处理宽高特殊单位
 */
const initImageSize = () => {
  // 处理宽高特殊单位 %>rpx
  if (INIT_IMGWIDTH && typeof INIT_IMGWIDTH === 'string' && INIT_IMGWIDTH.includes('%')) {
    const width: string = INIT_IMGWIDTH.replace('%', '')
    INIT_IMGWIDTH = pxToRpx((info.value.windowWidth / 100) * Number(width))
    picWidth.value = INIT_IMGWIDTH
  } else if (INIT_IMGWIDTH && typeof INIT_IMGWIDTH === 'number') {
    picWidth.value = INIT_IMGWIDTH
  }
  if (INIT_IMGHEIGHT && typeof INIT_IMGHEIGHT === 'string' && INIT_IMGHEIGHT.includes('%')) {
    const height = (props.imgHeight as string).replace('%', '')
    INIT_IMGHEIGHT = pxToRpx((info.value.windowHeight / 100) * Number(height))
    picHeight.value = INIT_IMGHEIGHT
  } else if (INIT_IMGHEIGHT && typeof INIT_IMGHEIGHT === 'number') {
    picHeight.value = Number(INIT_IMGHEIGHT)
  }
}

/**
 * canvas 初始化
 */
const initCanvas = () => {
  if (!ctx.value) {
    ctx.value = uni.createCanvasContext(canvasId.value, proxy)
  }
}

/**
 * 设置图片尺寸，使其短边完全显示并填满裁剪框
 */
const computeImgSize = () => {
  let tempPicWidth: number = picWidth.value
  let tempPicHeight: number = picHeight.value

  if (!INIT_IMGHEIGHT && !INIT_IMGWIDTH) {
    // 计算图片与裁剪框的宽高比
    const imgRatio = imgInfo.value!.width / imgInfo.value!.height
    const cropRatio = cutWidth.value / cutHeight.value

    if (imgRatio > cropRatio) {
      // 图片更宽，以高度为准
      tempPicHeight = cutHeight.value
      tempPicWidth = tempPicHeight * imgRatio
    } else {
      // 图片更高，以宽度为准
      tempPicWidth = cutWidth.value
      tempPicHeight = tempPicWidth / imgRatio
    }
  } else if (INIT_IMGHEIGHT && !INIT_IMGWIDTH) {
    tempPicHeight = Number(INIT_IMGHEIGHT)
    tempPicWidth = (imgInfo.value!.width / imgInfo.value!.height) * tempPicHeight
  } else if ((!INIT_IMGHEIGHT && INIT_IMGWIDTH) || (INIT_IMGHEIGHT && INIT_IMGWIDTH)) {
    tempPicWidth = Number(INIT_IMGWIDTH)
    tempPicHeight = (imgInfo.value!.height / imgInfo.value!.width) * tempPicWidth
  }

  // 确保计算后的尺寸至少有一边等于裁剪框尺寸
  const widthRatio = cutWidth.value / tempPicWidth
  const heightRatio = cutHeight.value / tempPicHeight
  const scale = Math.max(widthRatio, heightRatio)

  picWidth.value = tempPicWidth
  picHeight.value = tempPicHeight
  // 设置初始缩放以适应裁剪框
  imgScale.value = scale
}

/**
 * 初始化图片的大小和角度以及距离
 */
const resetImg = () => {
  const { windowHeight, windowWidth } = uni.getSystemInfoSync()
  imgScale.value = 1
  imgAngle.value = 0
  imgLeft.value = pxToRpx(windowWidth / 2)
  imgTop.value = pxToRpx((windowHeight / 2) * TOP_PERCENT)
}

/**
 * 加载图片资源文件，并初始化裁剪框内图片信息
 */
const loadImg = () => {
  if (!props.imgSrc) return

  uni.getImageInfo({
    src: props.imgSrc,
    success: (res) => {
      // 存储img图片信息
      imgInfo.value = res
      // 计算最后图片尺寸
      computeImgSize()
      // 初始化尺寸
      resetImg()
    },
    fail: () => {
      // this.setData({ imgSrc: '' })
    },
  })
}

/**
 * 节流
 */
const throttle = () => {
  if (info.value.platform === 'android') {
    MOVE_THROTTLE && clearTimeout(MOVE_THROTTLE)
    MOVE_THROTTLE = setTimeout(() => {
      MOVE_THROTTLE_FLAG = true
    }, 1000 / 40)
  } else {
    !MOVE_THROTTLE_FLAG && (MOVE_THROTTLE_FLAG = true)
  }
}

/**
 * 图片拖动边缘检测：检测移动或缩放时 是否触碰到图片边缘位置
 * @param scale 缩放比例
 */
const detectImgPosIsEdge = (scale?: number) => {
  const currentScale = scale || imgScale.value
  let currentImgLeft = imgLeft.value
  let currentImgTop = imgTop.value
  let currentPicWidth = picWidth.value
  let currentPicHeight = picHeight.value

  // 翻转后宽高切换
  if ((imgAngle.value / 90) % 2) {
    currentPicWidth = picHeight.value
    currentPicHeight = picWidth.value
  }
  // 左
  currentImgLeft =
    (currentPicWidth * currentScale) / 2 + cutLeft.value >= currentImgLeft
      ? currentImgLeft
      : (currentPicWidth * imgScale.value) / 2 + cutLeft.value
  // 右
  currentImgLeft =
    cutLeft.value + cutWidth.value - (currentPicWidth * currentScale) / 2 <= currentImgLeft
      ? currentImgLeft
      : cutLeft.value + cutWidth.value - (currentPicWidth * currentScale) / 2
  // 上
  currentImgTop =
    (currentPicHeight * currentScale) / 2 + cutTop.value >= currentImgTop
      ? currentImgTop
      : (currentPicHeight * currentScale) / 2 + cutTop.value
  // 下
  currentImgTop =
    cutTop.value + cutHeight.value - (currentPicHeight * currentScale) / 2 <= currentImgTop
      ? currentImgTop
      : cutTop.value + cutHeight.value - (currentPicHeight * currentScale) / 2

  imgScale.value = currentScale
  imgTop.value = currentImgTop
  imgLeft.value = currentImgLeft
}

/**
 * 缩放边缘检测：检测移动或缩放时 是否触碰到图片边缘位置
 */
const detectImgScaleIsEdge = () => {
  let tempPicWidth = picWidth.value
  let tempPicHeight = picHeight.value
  let tempImgScale = imgScale.value

  // 翻转后宽高切换
  if ((imgAngle.value / 90) % 2) {
    tempPicWidth = picHeight.value
    tempPicHeight = picWidth.value
  }
  if (tempPicWidth * tempImgScale < cutWidth.value) {
    tempImgScale = cutWidth.value / tempPicWidth
  }
  if (tempPicHeight * tempImgScale < cutHeight.value) {
    tempImgScale = cutHeight.value / tempPicHeight
  }
  detectImgPosIsEdge(tempImgScale)
}

/**
 * canvas 绘制图片输出成文件类型
 */
const canvasToImage = () => {
  const { fileType, quality, exportScale } = props
  // 转换为px用于canvas绘制
  const cutWidthPx = rpxToPx(cutWidth.value)
  const cutHeightPx = rpxToPx(cutHeight.value)

  uni.canvasToTempFilePath(
    {
      width: cutWidthPx * exportScale,
      height: Math.round(cutHeightPx * exportScale),
      destWidth: cutWidthPx * exportScale,
      destHeight: Math.round(cutHeightPx * exportScale),
      fileType,
      quality,
      canvasId: canvasId.value,
      success: (res: any) => {
        const result = {
          tempFilePath: res.tempFilePath,
          width: cutWidthPx * exportScale,
          height: cutHeightPx * exportScale,
        }
        // #ifdef MP-DINGTALK
        result.tempFilePath = res.filePath
        // #endif
        emit('confirm', result)
      },
      complete: () => {
        emit('update:modelValue', false)
      },
    },
    proxy,
  )
}

/**
 * canvas绘制，用canvas模拟裁剪框 对根据图片当前的裁剪信息进行模拟
 */
const draw = () => {
  if (!props.imgSrc) return
  const drawImage = () => {
    // 图片真实大小（转换为px）
    const width = rpxToPx(picWidth.value) * imgScale.value * props.exportScale
    const height = rpxToPx(picHeight.value) * imgScale.value * props.exportScale
    // 取裁剪框和图片的交集（转换为px）
    const x = rpxToPx(imgLeft.value - cutLeft.value)
    const y = rpxToPx(imgTop.value - cutTop.value)
    // 如果直接使用canvas绘制的图片会有锯齿，因此需要*设备像素比
    // 设置（x, y）设置图片在canvas中的位置
    ctx.value!.translate(x * props.exportScale, y * props.exportScale)
    // 设置 旋转角度
    if (!props.disabledRotate) {
      ctx.value!.rotate((imgAngle.value * Math.PI) / 180)
    }
    // drawImage 的 旋转是根据以当前图片的图片水平垂直方向为x、y轴，并在x y轴上移动
    ctx.value!.drawImage(props.imgSrc, -width / 2, -height / 2, width, height)

    ctx.value!.restore()

    // 绘制图片
    ctx.value!.draw(false, () => {
      canvasToImage()
    })
  }

  canvasHeight.value = cutHeight.value
  canvasWidth.value = cutWidth.value
  drawImage()
}

/**
 * 逆转是否使用动画
 * @param animation 动画状态
 */
const revertIsAnimation = (animation: boolean) => {
  isAnimation.value = animation
}

/**
 * 控制旋转角度
 * @param angle 角度
 */
const setRoate = (angle: number) => {
  if (!angle || props.disabledRotate) return
  revertIsAnimation(true)
  imgAngle.value = angle

  // 重新计算缩放比例
  let tempPicWidth = picWidth.value
  let tempPicHeight = picHeight.value

  // 旋转后宽高互换
  if ((angle / 90) % 2) {
    tempPicWidth = picHeight.value
    tempPicHeight = picWidth.value
  }

  // 计算新的缩放比例
  const widthRatio = cutWidth.value / tempPicWidth
  const heightRatio = cutHeight.value / tempPicHeight
  imgScale.value = Math.max(widthRatio, heightRatio)

  // 检测边缘位置
  detectImgPosIsEdge()
}

/**
 * {图片区} 开始拖动
 * @param event 触摸事件
 */
const handleImgTouchStart = (event: any) => {
  // 如果处于在拖动中，背景为淡色展示全部，拖动结束则为 0.85 透明度
  IS_TOUCH_END.value = false
  if (event.touches.length === 1) {
    // 单指拖动（转换触摸坐标为rpx）
    movingPosRecord.value[0] = {
      x: pxToRpx(event.touches[0].clientX) - imgLeft.value,
      y: pxToRpx(event.touches[0].clientY) - imgTop.value,
    }
  } else {
    // 以两指为坐标点 做直角三角形 a2 + b2 = c2（转换触摸坐标为rpx）
    const width = Math.abs(pxToRpx(event.touches[1].clientX) - pxToRpx(event.touches[0].clientX))
    const height = Math.abs(pxToRpx(event.touches[1].clientY) - pxToRpx(event.touches[0].clientY))
    fingerDistance.value = Math.sqrt(width ** 2 + height ** 2)
  }
}

/**
 * {图片区} 拖动中
 * @param event 触摸事件
 */
const handleImgTouchMove = (event: any) => {
  if (IS_TOUCH_END.value || !MOVE_THROTTLE_FLAG) return
  // 节流
  throttle()
  if (event.touches.length === 1) {
    // 单指拖动（转换触摸坐标为rpx）
    const { x, y } = movingPosRecord.value[0]
    const left = pxToRpx(event.touches[0].clientX) - Number(x)
    const top = pxToRpx(event.touches[0].clientY) - Number(y)
    imgLeft.value = left
    imgTop.value = top
    detectImgPosIsEdge()
  } else {
    // 以两指为坐标点 做直角三角形 a2 + b2 = c2（转换触摸坐标为rpx）
    const width = Math.abs(pxToRpx(event.touches[1].clientX) - pxToRpx(event.touches[0].clientX))
    const height = Math.abs(pxToRpx(event.touches[1].clientY) - pxToRpx(event.touches[0].clientY))
    const hypotenuse = Math.sqrt(width ** 2 + height ** 2)
    const scale = imgScale.value * (hypotenuse / Number(fingerDistance.value))
    imgScale.value = Math.min(scale, props.maxScale)
    detectImgScaleIsEdge()
    fingerDistance.value = Math.sqrt(width ** 2 + height ** 2)
  }
}

/**
 * {图片区} 拖动结束
 */
const handleImgTouchEnd = () => {
  IS_TOUCH_END.value = true
}

/**
 * 图片已加载完成
 * @param res 加载结果
 */
const handleImgLoaded = (res: any) => {
  emit('imgloaded', res)
}

/**
 * 图片加载失败
 * @param err 错误信息
 */
const handleImgLoadError = (err: any) => {
  emit('imgloaderror', err)
}

/**
 * 旋转图片
 */
const handleRotate = () => {
  setRoate(imgAngle.value - 90)
}

/**
 * 取消裁剪图片
 */
const handleCancel = () => {
  emit('cancel')
  emit('update:modelValue', false)
}

/**
 * 完成裁剪
 */
const handleConfirm = () => {
  draw()
}

/**
 * 阻止触摸移动事件冒泡
 */
const preventTouchMove = () => {}

/**
 * 监听modelValue变化
 */
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      INIT_IMGWIDTH = props.imgWidth
      INIT_IMGHEIGHT = props.imgHeight
      info.value = uni.getSystemInfoSync()

      // 根据aspectRatio计算裁剪框尺寸（rpx）
      const [widthRatio, heightRatio] = props.aspectRatio.split(':').map(Number)
      const tempCutWidth = pxToRpx(info.value.windowWidth) - offset.value * 2
      const tempCutHeight = (tempCutWidth * heightRatio) / widthRatio

      cutWidth.value = tempCutWidth
      cutHeight.value = tempCutHeight
      cutTop.value = (pxToRpx(info.value.windowHeight) * TOP_PERCENT - tempCutHeight) / 2
      cutLeft.value = offset.value

      canvasScale.value = props.exportScale
      canvasHeight.value = tempCutHeight
      canvasWidth.value = tempCutWidth

      // 根据开发者设置的图片目标尺寸计算实际尺寸
      initImageSize()
      // 初始化canvas
      initCanvas()
      // 加载图片
      props.imgSrc && loadImg()
    } else {
      resetImg()
    }
  },
  {
    deep: true,
    immediate: true,
  },
)

/**
 * 监听imgSrc变化
 */
watch(
  () => props.imgSrc,
  (newValue) => {
    newValue && loadImg()
  },
  {
    deep: true,
    immediate: true,
  },
)

/**
 * 监听imgAngle变化
 */
watch(
  () => imgAngle.value,
  (newValue) => {
    if (newValue % 90) {
      imgAngle.value = Math.round(newValue / 90) * 90
    }
  },
  {
    deep: true,
    immediate: true,
  },
)

/**
 * 监听isAnimation变化
 */
watch(
  () => isAnimation.value,
  (newValue) => {
    // 开启过渡300毫秒之后自动关闭
    CHANGE_TIME && clearTimeout(CHANGE_TIME)
    if (newValue) {
      CHANGE_TIME = setTimeout(() => {
        revertIsAnimation(false)
        clearTimeout(CHANGE_TIME)
      }, 300)
    }
  },
  {
    deep: true,
    immediate: true,
  },
)

// 暴露组件方法
defineExpose<WdImgCropperExpose>({
  revertIsAnimation,
  setRoate,
  resetImg,
})

/** 图片裁剪组件实例类型 */
export type ImgCropperInstance = ComponentPublicInstance<WdImgCropperProps, WdImgCropperExpose>
</script>

<style lang="scss">
// 引入外部样式文件
@import './../common/abstracts/_mixin.scss';
@import './../common/abstracts/variable.scss';

// 图片裁剪组件样式
@include b(img-cropper) {
  background: rgba(0, 0, 0, 1);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;

  // 裁剪框包裹器
  @include e(wrapper) {
    position: relative;
    background: rgba(0, 0, 0, 0.45);
  }

  @include e(cut) {
    z-index: 9;
    position: absolute;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    pointer-events: none;

    .wd-img-cropper__cut--top,
    .wd-img-cropper__cut--bottom,
    .wd-img-cropper__cut--left,
    .wd-img-cropper__cut--right {
      // 拖动中背景蒙层为0 拖动结束为0.85
      background-color: rgba(0, 0, 0, 0.85);
      transition: background 0.2s;

      @include when(hightlight) {
        background-color: rgba(0, 0, 0, 0);
      }
    }

    .wd-img-cropper__cut--bottom,
    .wd-img-cropper__cut--right {
      flex: auto;
    }

    @include m(middle) {
      display: flex;
    }

    @include m(body) {
      // 若需要变化窗体大小，支持控制窗体的大小来控制下方所有对应的展示
      background-color: transparent;
      position: relative;

      // 节选框的窗体最外部边缘线
      &::before {
        content: '';
        border: 1px solid #fff;
        width: calc(200% - 1px);
        height: calc(200% - 1px);
        position: absolute;
        transform: scale(0.5) translate(-1px, -1px);
        top: -50%;
        left: -50%;
      }

      // 结算框对角尺寸
      $border-size: 4rpx;

      // 节选框的四个角
      .is-left-top,
      .is-left-bottom,
      .is-right-top,
      .is-right-bottom {
        &::before {
          content: '';
          position: absolute;
          width: $border-size;
          height: 40rpx;
          background-color: #fff;
        }

        &::after {
          content: '';
          position: absolute;
          width: 40rpx;
          height: $border-size;
          background-color: #fff;
        }
      }

      .is-left-top {
        &::before,
        &::after {
          left: -$border-size;
          top: -$border-size;
        }
      }

      .is-left-bottom {
        &::before,
        &::after {
          left: -$border-size;
          bottom: -$border-size;
        }
      }

      .is-right-top {
        &::before,
        &::after {
          right: -$border-size;
          top: -$border-size;
        }
      }

      .is-right-bottom {
        &::before,
        &::after {
          right: -$border-size;
          bottom: -$border-size;
        }
      }

      // 内部网格线
      .is-gridlines-x,
      .is-gridlines-y {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        display: flex;
      }

      .is-gridlines-x {
        justify-content: center;

        &::before {
          content: '';
          display: inline-block;
          width: 66.66%;
          height: 200%;
          border: 1px solid #fff;
          border-top: none;
          border-bottom: none;
          transform: scale(0.5) translate(0, -50%);
        }
      }

      // 内部网格线 - y轴
      .is-gridlines-y {
        align-items: center;

        &::after {
          content: '';
          flex-shrink: 0;
          display: inline-block;
          width: 200%;
          height: 66.66%;
          border: 1px solid #fff;
          border-left: none;
          border-right: none;
          transform: scale(0.5) translate(-50%, 0);
        }
      }
    }
  }

  @include e(img) {
    z-index: 2;
    top: 0;
    left: 0;
    position: absolute;
    border: none;
    width: 100%;
    backface-visibility: hidden;
    transform-origin: center;
  }

  @include e(canvas) {
    position: fixed;
    background: white;
    width: 300rpx;
    height: 300rpx;
    z-index: 10;
    top: -200%;
    pointer-events: none;
  }

  @include e(footer) {
    position: fixed;
    z-index: 10;
    bottom: 20rpx;
    width: 100%;
    height: 15vh;
    text-align: center;

    @include m(button) {
      position: relative;
      text-align: left;
      margin: 0 40rpx;
      padding-top: 4vh;
      // line-height: 64rpx;
      box-sizing: border-box;

      .is-cancel {
        display: inline-block;
        color: #fff;
        font-size: 32rpx;
      }

      .is-confirm {
        position: absolute;
        right: 0;
        // height: 64rpx;
        width: 112rpx;
        border-radius: 32rpx;
        font-size: 32rpx;
      }
    }
  }

  @include edeep(rotate) {
    font-size: $-img-cropper-icon-size;
    color: $-img-cropper-icon-color;
  }
}
</style>
