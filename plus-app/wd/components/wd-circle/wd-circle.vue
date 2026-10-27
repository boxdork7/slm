<!-- Circle 环形进度条 圆环形的进度条组件，支持进度渐变动画。 -->
<template>
  <view :class="`wd-circle ${customClass}`" :style="customStyle">
    <!-- #ifdef MP-WEIXIN -->
    <canvas
      :id="canvasId"
      :style="`width: ${addUnit(size)}; height: ${addUnit(size)}`"
      :canvas-id="canvasId"
      type="2d"
    />
    <!-- #endif -->
    <!-- #ifndef MP-WEIXIN -->
    <canvas
      :id="canvasId"
      :width="canvasSize"
      :height="canvasSize"
      :style="`width: ${addUnit(size)}; height: ${addUnit(size)}`"
      :canvas-id="canvasId"
    />
    <!-- #endif -->

    <view v-if="!text" class="wd-circle__text">
      <!-- 自定义提示内容 -->
      <slot />
    </view>

    <text v-else class="wd-circle__text">
      {{ text }}
    </text>
  </view>
</template>

<script lang="ts" setup>
import {
  computed,
  getCurrentInstance,
  onBeforeMount,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue'
// #ifdef MP-WEIXIN
import { canvas2dAdapter } from '../common/canvasHelper'
// #endif
import { addUnit, isObj, rpxToPx, uuid } from '../common/util'

defineOptions({
  name: 'WdCircle',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 进度条端点的形状
 */
type StrokeLinecapType = 'butt' | 'round' | 'square'

/**
 * 圆形进度条组件属性接口
 */
interface WdCircleProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string
  /** 当前进度，取值范围 0-100 */
  modelValue?: number
  /** 圆环直径，默认单位为 rpx */
  size?: number
  /** 进度条颜色，支持字符串或对象格式定义渐变色，如 {'0%': '#ffd01e', '100%': '#ee0a24'} */
  color?: string | Record<string, string>
  /** 轨道颜色，即进度条背景颜色 */
  layerColor?: string
  /** 填充颜色，设置后会填充整个圆环 */
  fill?: string
  /** 动画速度，单位为 rate/s，设置为 0 则无动画效果 */
  speed?: number
  /** 进度条中心显示的文字内容 */
  text?: string
  /** 进度条宽度，单位 rpx */
  strokeWidth?: number
  /** 进度条端点的形状，butt-方形端点，round-圆形端点，square-正方形端点 */
  strokeLinecap?: StrokeLinecapType
  /** 是否顺时针方向增长进度 */
  clockwise?: boolean
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdCircleProps>(), {
  customStyle: '',
  customClass: '',
  modelValue: 0,
  size: 200,
  color: '#4d80f0',
  layerColor: '#EBEEF5',
  speed: 50,
  strokeWidth: 20,
  strokeLinecap: 'round',
  clockwise: true,
})

// 获取当前组件实例
const { proxy } = getCurrentInstance() as any

// 响应式数据
const progressColor = ref<string | CanvasGradient>('') // 进度条渲染颜色（支持渐变）
const currentValue = ref<number>(0) // 当前动画进度值
const interval = ref<any>(null) // 动画定时器
const pixelRatio = ref<number>(1) // 设备像素比
const canvasId = ref<string>(`wd-circle${uuid()}`) // Canvas 唯一标识符

// Canvas 上下文对象
let ctx: UniApp.CanvasContext | null = null

// 绘制相关常量
const PERIMETER = 2 * Math.PI // 完整圆周角度
const BEGIN_ANGLE = -Math.PI / 2 // 起始角度（12点钟方向）
const STEP = 1 // 动画每步进度增量

/**
 * 计算 Canvas 渲染大小（px）
 * 将 rpx 转换为 px，并在支付宝小程序中乘以像素比以适配高清屏
 * 增加 strokeWidth 的缓冲区，防止进度条边缘被裁切
 */
const canvasSize = computed(() => {
  let size = rpxToPx(props.size)
  // #ifdef MP-ALIPAY
  size = size * pixelRatio.value
  // #endif
  return size
})

/**
 * 计算进度条实际宽度（px）
 * 将 rpx 转换为 px，并在支付宝小程序中乘以像素比以适配高清屏
 */
const sWidth = computed(() => {
  let sWidth = rpxToPx(props.strokeWidth)
  // #ifdef MP-ALIPAY
  sWidth = sWidth * pixelRatio.value
  // #endif
  return sWidth
})

/**
 * 清除定时器
 */
const clearTimeInterval = () => {
  interval.value && clearTimeout(interval.value)
}

/**
 * 格式化进度值，确保在 0-100 之间
 * @param rate 进度值
 * @returns 格式化后的进度值
 */
const format = (rate: number): number => {
  return Math.min(Math.max(rate, 0), 100)
}

/**
 * 获取 Canvas 绘制上下文
 * 兼容微信小程序和其他平台的 Canvas API 差异
 * @returns Promise<UniApp.CanvasContext> Canvas 上下文对象
 */
const getContext = (): Promise<UniApp.CanvasContext> => {
  return new Promise<UniApp.CanvasContext>((resolve) => {
    if (ctx) {
      return resolve(ctx)
    }
    // #ifndef MP-WEIXIN
    // 非微信小程序使用传统 Canvas API
    ctx = uni.createCanvasContext(canvasId.value, proxy)
    resolve(ctx)
    // #endif
    // #ifdef MP-WEIXIN
    // 微信小程序使用 Canvas 2D API
    uni
      .createSelectorQuery()
      .in(proxy)
      .select(`#${canvasId.value}`)
      .node((res) => {
        if (res && res.node) {
          const canvas = res.node
          ctx = canvas2dAdapter(canvas.getContext('2d') as CanvasRenderingContext2D)
          const canvasSizePx = rpxToPx(props.size)
          canvas.width = canvasSizePx * pixelRatio.value
          canvas.height = canvasSizePx * pixelRatio.value
          ctx.scale(pixelRatio.value, pixelRatio.value)
          resolve(ctx)
        }
      })
      .exec()
    // #endif
  })
}

/**
 * 设置 Canvas 绘制参数
 * @param context Canvas 上下文
 * @param strokeStyle 描边样式
 * @param beginAngle 开始角度
 * @param endAngle 结束角度
 * @param fill 填充颜色
 */
const presetCanvas = (
  context: any,
  strokeStyle: string | CanvasGradient,
  beginAngle: number,
  endAngle: number,
  fill?: string,
) => {
  const width = sWidth.value
  const position = canvasSize.value / 2
  const radius = position - width / 2

  context.strokeStyle = strokeStyle
  context.setStrokeStyle(strokeStyle)
  context.setLineWidth(width)
  context.setLineCap(props.strokeLinecap)

  context.beginPath()
  context.arc(position, position, radius, beginAngle, endAngle, !props.clockwise)
  context.stroke()

  if (fill) {
    context.setLineWidth(width)
    context.setFillStyle(fill)
    context.fill()
  }
}

/**
 * 渲染轨道圆环
 * @param context Canvas 上下文
 */
const renderLayerCircle = (context: UniApp.CanvasContext) => {
  presetCanvas(context, props.layerColor, 0, PERIMETER, props.fill)
}

/**
 * 渲染进度条
 * @param context Canvas 上下文
 * @param formatValue 格式化后的进度值
 */
const renderHoverCircle = (context: UniApp.CanvasContext, formatValue: number) => {
  // 计算结束角度
  const progress = PERIMETER * (formatValue / 100)
  const endAngle = props.clockwise ? BEGIN_ANGLE + progress : 3 * Math.PI - (BEGIN_ANGLE + progress)

  // 设置进度条颜色
  if (isObj(props.color)) {
    const LinearColor = context.createLinearGradient(canvasSize.value, 0, 0, 0)
    Object.keys(props.color)
      .sort((a, b) => Number.parseFloat(a) - Number.parseFloat(b))
      .map((key) =>
        LinearColor.addColorStop(
          Number.parseFloat(key) / 100,
          (props.color as Record<string, any>)[key],
        ),
      )
    progressColor.value = LinearColor
  } else {
    progressColor.value = props.color
  }

  presetCanvas(context, progressColor.value, BEGIN_ANGLE, endAngle)
}

/**
 * 渲染圆点
 * 进度值为0时渲染一个圆点
 * @param context Canvas 上下文
 */
const renderDot = (context: UniApp.CanvasContext) => {
  const strokeWidth = sWidth.value // 管道宽度=小圆点直径
  const position = canvasSize.value / 2 // 坐标

  // 设置进度条颜色
  if (isObj(props.color)) {
    const LinearColor = context.createLinearGradient(canvasSize.value, 0, 0, 0)
    Object.keys(props.color)
      .sort((a, b) => Number.parseFloat(a) - Number.parseFloat(b))
      .map((key) =>
        LinearColor.addColorStop(
          Number.parseFloat(key) / 100,
          (props.color as Record<string, any>)[key],
        ),
      )
    progressColor.value = LinearColor
  } else {
    progressColor.value = props.color
  }

  context.beginPath()
  context.arc(position, strokeWidth / 4, strokeWidth / 4, 0, PERIMETER)
  context.setFillStyle(progressColor.value)
  context.fill()
}

/**
 * 绘制圆形进度条
 * @param currentValue 当前进度值
 */
const drawCircle = (currentValue: number) => {
  getContext().then((context) => {
    context.clearRect(0, 0, canvasSize.value, canvasSize.value)
    renderLayerCircle(context)

    const formatValue = format(currentValue)
    if (formatValue !== 0) {
      renderHoverCircle(context, formatValue)
    } else {
      renderDot(context)
    }
    context.draw()
  })
}

/**
 * 重新渲染组件
 */
const reRender = () => {
  if (props.speed <= 0 || props.speed > 1000) {
    drawCircle(props.modelValue)
    return
  }

  clearTimeInterval()
  currentValue.value = currentValue.value || 0

  const run = () => {
    interval.value = setTimeout(() => {
      if (currentValue.value !== props.modelValue) {
        if (Math.abs(currentValue.value - props.modelValue) < STEP) {
          currentValue.value = props.modelValue
        } else if (currentValue.value < props.modelValue) {
          currentValue.value += STEP
        } else {
          currentValue.value -= STEP
        }
        drawCircle(currentValue.value)
        run()
      } else {
        clearTimeInterval()
      }
    }, 1000 / props.speed)
  }
  run()
}

// 监听器
watch(
  () => props.modelValue,
  () => {
    reRender()
  },
  { immediate: true },
)

watch(
  () => props.size,
  () => {
    const timer = setTimeout(() => {
      drawCircle(currentValue.value)
      clearTimeout(timer)
    }, 50)
  },
  { immediate: false },
)

watch(
  () => props.color,
  () => {
    drawCircle(currentValue.value)
  },
  { immediate: false, deep: true },
)

onBeforeMount(() => {
  pixelRatio.value = uni.getSystemInfoSync().pixelRatio
})

onMounted(() => {
  currentValue.value = props.modelValue
  drawCircle(currentValue.value)
})

onUnmounted(() => {
  clearTimeInterval()
})
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable.scss';
@import '../common/abstracts/_mixin.scss';

// 圆形进度条样式
@include b(circle) {
  position: relative;
  display: inline-block;
  text-align: center;

  // 文字样式
  @include e(text) {
    position: absolute;
    z-index: 1;
    top: 50%;
    left: 0;
    width: 100%;
    transform: translateY(-50%);
    color: $-circle-text-color;
  }
}
</style>
