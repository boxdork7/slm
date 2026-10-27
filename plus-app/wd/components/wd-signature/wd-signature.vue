<!-- Signature 签名 用于签名场景，基于 Canvas 实现的签名组件。提供了基础签名、历史记录、笔锋效果等功能。 -->
<template>
  <view :class="`wd-signature ${customClass}`" :style="customStyle">
    <view class="wd-signature__content">
      <!-- #ifdef MP-WEIXIN -->
      <canvas
        :id="canvasId"
        type="2d"
        class="wd-signature__content-canvas"
        :style="canvasStyle"
        :width="canvasState.canvasWidth"
        :height="canvasState.canvasHeight"
        :canvas-id="canvasId"
        :disable-scroll="disableScroll"
        @touchstart="startDrawing"
        @touchend="stopDrawing"
        @touchmove="draw"
      />
      <!-- #endif  -->
      <!-- #ifndef MP-WEIXIN -->
      <canvas
        :id="canvasId"
        class="wd-signature__content-canvas"
        :canvas-id="canvasId"
        :style="canvasStyle"
        :width="canvasState.canvasWidth"
        :height="canvasState.canvasHeight"
        :disable-scroll="disableScroll"
        @touchstart="startDrawing"
        @touchend="stopDrawing"
        @touchmove="draw"
      />
      <!-- #endif  -->
    </view>
    <view class="wd-signature__footer">
      <slot
        name="footer"
        :clear="clear"
        :confirm="confirmSignature"
        :current-step="currentStep"
        :revoke="revoke"
        :restore="restore"
        :can-undo="lines.length > 0"
        :can-redo="redoLines.length > 0"
        :history-list="lines"
      >
        <block v-if="enableHistory">
          <wd-button size="small" plain :disabled="lines.length <= 0" @click="revoke">
            {{ revokeText || translate('revokeText') }}
          </wd-button>
          <wd-button size="small" plain :disabled="redoLines.length <= 0" @click="restore">
            {{ restoreText || translate('restoreText') }}
          </wd-button>
        </block>
        <wd-button size="small" plain @click="clear">
          {{ clearText || translate('clearText') }}
        </wd-button>
        <wd-button size="small" @click="confirmSignature">
          {{ confirmText || translate('confirmText') }}
        </wd-button>
      </slot>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { ComponentPublicInstance, CSSProperties } from 'vue'
import { computed, getCurrentInstance, onBeforeMount, onMounted, reactive, ref, watch } from 'vue'
// #ifdef MP-WEIXIN
import { canvas2dAdapter } from '../common/canvasHelper'
// #endif
import { addUnit, getRect, isDef, objToStyle, uuid } from '../common/util'
import { useTranslate } from '../composables/useTranslate'

defineOptions({
  name: 'WdSignature',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 签名结果类型
 */
export interface SignatureResult {
  /** 生成图片的临时路径 */
  tempFilePath: string
  /** 是否成功生成图片 */
  success: boolean
  /** 生成图片的宽度 */
  width: number
  /** 生成图片的高度 */
  height: number
}

/**
 * 签名点位类型
 */
interface Point {
  /** 点的横坐标 */
  x: number
  /** 点的纵坐标 */
  y: number
  /** 点的时间戳 */
  t: number
  /** 当前点的绘制速度 */
  speed?: number
  /** 与上一个点的距离 */
  distance?: number
  /** 当前点的线宽（用于笔锋模式） */
  lineWidth?: number
  /** 贝塞尔曲线第一个控制点的x坐标 */
  lastX1?: number
  /** 贝塞尔曲线第一个控制点的y坐标 */
  lastY1?: number
  /** 贝塞尔曲线第二个控制点的x坐标 */
  lastX2?: number
  /** 贝塞尔曲线第二个控制点的y坐标 */
  lastY2?: number
  /** 是否为线条的第一个点 */
  isFirstPoint?: boolean
}

/**
 * 签名线条类型
 */
interface Line {
  /** 线条所包含的所有点的数组 */
  points: Point[]
  /** 线条颜色 */
  color: string
  /** 线条宽度 */
  width: number
  /** 线条背景色 */
  backgroundColor?: string
  /** 是否为笔锋模式的线条 */
  isPressure?: boolean
}

/**
 * 签名组件属性接口
 */
interface WdSignatureProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 签名笔颜色 */
  penColor?: string
  /** 签名笔宽度 */
  lineWidth?: number
  /** 清空按钮的文本 */
  clearText?: string
  /** 撤回按钮的文本 */
  revokeText?: string
  /** 恢复按钮的文本 */
  restoreText?: string
  /** 确认按钮的文本 */
  confirmText?: string
  /** 目标文件的类型 */
  fileType?: string
  /** 目标文件的质量 */
  quality?: number
  /** 导出图片的缩放比例 */
  exportScale?: number
  /** 是否禁用签名板 */
  disabled?: boolean
  /** 画布的高度 */
  height?: string | number
  /** 画布的宽度 */
  width?: string | number
  /** 画板的背景色 */
  backgroundColor?: string
  /** 是否禁用画布滚动 */
  disableScroll?: boolean
  /** 是否开启历史记录 */
  enableHistory?: boolean
  /** 撤回和恢复的步长 */
  step?: number
  /** 撤回按钮的文本 */
  undoText?: string
  /** 恢复按钮的文本 */
  redoText?: string
  /** 是否启用压感模式(笔锋) */
  pressure?: boolean
  /** 压感模式下笔画最小宽度 */
  minWidth?: number
  /** 压感模式下笔画最大宽度 */
  maxWidth?: number
  /** 最小速度阈值，影响压感模式下的笔画宽度变化 */
  minSpeed?: number
}

/**
 * 签名组件事件接口
 */
interface WdSignatureEmits {
  /** 开始绘制时触发 */
  start: [event: any]
  /** 结束绘制时触发 */
  end: [event: TouchEvent]
  /** 绘制过程中触发 */
  signing: [event: any]
  /** 确认签名时触发 */
  confirm: [result: SignatureResult]
  /** 清空签名时触发 */
  clear: []
}

/**
 * 签名组件暴露方法接口
 */
interface WdSignatureExpose {
  /** 初始化签名板 */
  init: (forceUpdate?: boolean) => void
  /** 点击清除按钮清除签名 */
  clear: () => void
  /** 点击确定按钮 */
  confirm: () => void
  /** 点击恢复 */
  restore: () => void
  /** 点击撤回 */
  revoke: () => void
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdSignatureProps>(), {
  customStyle: '',
  customClass: '',
  penColor: '#000',
  lineWidth: 3,
  fileType: 'png',
  quality: 1,
  exportScale: 1,
  disabled: false,
  disableScroll: true,
  enableHistory: false,
  step: 1,
  pressure: false,
  minWidth: 2,
  maxWidth: 6,
  minSpeed: 1.5,
})

// 定义组件事件
const emit = defineEmits<WdSignatureEmits>()

// 多语言支持
const { translate } = useTranslate('signature')

// 获取当前组件实例
const { proxy } = getCurrentInstance() as any

// 响应式数据
const canvasId = ref<string>(`signature${uuid()}`) // canvas 组件的唯一标识符
const drawing = ref<boolean>(false) // 是否正在绘制
const pixelRatio = ref<number>(1) // 像素比
const lines = ref<Line[]>([]) // 保存所有线条
const redoLines = ref<Line[]>([]) // 保存撤销的线条
const currentLine = ref<Line>() // 当前正在绘制的线
const currentStep = ref(0) // 当前步骤

// canvas 对象，微信小程序生成图片必须传入
let canvas: null = null

// canvas 状态
const canvasState = reactive({
  canvasWidth: 0,
  canvasHeight: 0,
  ctx: null as UniApp.CanvasContext | null, // canvas上下文
})

/**
 * 计算画布样式
 */
const canvasStyle = computed(() => {
  const style: CSSProperties = {}
  if (isDef(props.width)) {
    style.width = addUnit(props.width)
  }
  if (isDef(props.height)) {
    style.height = addUnit(props.height)
  }
  return objToStyle(style)
})

/**
 * 计算笔画宽度（压感模式）
 * @param speed 绘制速度
 * @returns 计算后的线宽
 */
const calculateLineWidth = (speed: number): number => {
  if (!props.pressure) return props.lineWidth

  const minSpeed = props.minSpeed || 1.5
  const limitedSpeed = Math.min(minSpeed * 10, Math.max(minSpeed, speed))
  const addWidth = ((props.maxWidth - props.minWidth) * (limitedSpeed - minSpeed)) / minSpeed
  const lineWidth = Math.max(props.maxWidth - addWidth, props.minWidth)
  return Math.min(lineWidth, props.maxWidth)
}

/**
 * 获取默认笔画宽度
 * @returns 默认线宽
 */
const getDefaultLineWidth = (): number => {
  if (props.pressure) {
    // 在压感模式下，使用最大和最小宽度的平均值作为默认值
    return (props.maxWidth + props.minWidth) / 2
  }
  return props.lineWidth
}

/**
 * 设置 canvas 状态
 * @param width 宽度
 * @param height 高度
 */
const setcanvasState = (width: number, height: number) => {
  canvasState.canvasHeight = height * pixelRatio.value
  canvasState.canvasWidth = width * pixelRatio.value
}

/**
 * 设置线段样式
 */
const setLine = () => {
  const { ctx } = canvasState
  if (ctx) {
    ctx.setLineWidth(getDefaultLineWidth()) // 使用新的默认宽度
    ctx.setStrokeStyle(props.penColor)
    ctx.setLineJoin('round')
    ctx.setLineCap('round')
  }
}

/**
 * 获取canvas上下文
 * @returns Promise<UniApp.CanvasContext>
 */
const getContext = (): Promise<UniApp.CanvasContext> => {
  return new Promise<UniApp.CanvasContext>((resolve) => {
    const { ctx } = canvasState

    if (ctx) {
      return resolve(ctx)
    }
    // #ifndef MP-WEIXIN
    getRect(`#${canvasId.value}`, false, proxy).then((canvasRect) => {
      setcanvasState(canvasRect.width!, canvasRect.height!)
      canvasState.ctx = uni.createCanvasContext(canvasId.value, proxy)
      if (canvasState.ctx) {
        canvasState.ctx.scale(pixelRatio.value, pixelRatio.value)
      }
      resolve(canvasState.ctx)
    })
    // #endif
    // #ifdef MP-WEIXIN
    getRect(`#${canvasId.value}`, false, proxy, true).then((canvasRect: any) => {
      if (canvasRect && canvasRect.node && canvasRect.width && canvasRect.height) {
        const canvasInstance = canvasRect.node
        canvasState.ctx = canvas2dAdapter(
          canvasInstance.getContext('2d') as CanvasRenderingContext2D,
        )
        canvasInstance.width = canvasRect.width * pixelRatio.value
        canvasInstance.height = canvasRect.height * pixelRatio.value
        canvasState.ctx.scale(pixelRatio.value, pixelRatio.value)
        canvas = canvasInstance
        setcanvasState(canvasRect.width, canvasRect.height)
        resolve(canvasState.ctx)
      }
    })
    // #endif
  })
}

/**
 * 清空画布
 */
const clearCanvas = () => {
  const { canvasWidth, canvasHeight, ctx } = canvasState
  if (ctx) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    if (isDef(props.backgroundColor)) {
      ctx.setFillStyle(props.backgroundColor)
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    }
    ctx.draw()
  }
}

/**
 * 添加平滑线条绘制方法
 * @param prePoint 前一个点
 * @param point 当前点
 */
const drawSmoothLine = (prePoint: Point, point: Point) => {
  const { ctx } = canvasState
  if (!ctx) return

  // 计算两点间距离
  const dis_x = point.x - prePoint.x
  const dis_y = point.y - prePoint.y
  const distance = Math.sqrt(dis_x * dis_x + dis_y * dis_y)

  if (distance <= 2) {
    // 对于非常近的点，直接使用中点
    point.lastX1 = point.lastX2 = prePoint.x + dis_x * 0.5
    point.lastY1 = point.lastY2 = prePoint.y + dis_y * 0.5
  } else {
    // 根据点的速度计算控制点的偏移程度
    const speed = point.speed || 0
    const minSpeed = props.minSpeed || 1.5
    const speedFactor = Math.max(0.1, Math.min(0.9, speed / (minSpeed * 10)))

    // 计算控制点
    point.lastX1 = prePoint.x + dis_x * (0.2 + speedFactor * 0.3)
    point.lastY1 = prePoint.y + dis_y * (0.2 + speedFactor * 0.3)
    point.lastX2 = prePoint.x + dis_x * (0.8 - speedFactor * 0.3)
    point.lastY2 = prePoint.y + dis_y * (0.8 - speedFactor * 0.3)
  }

  // 计算线宽
  const lineWidth = point.lineWidth || props.lineWidth

  // 绘制贝塞尔曲线
  if (typeof prePoint.lastX1 === 'number') {
    // 设置线宽
    ctx.setLineWidth(lineWidth)
    // 绘制第一段曲线
    ctx.beginPath()
    ctx.moveTo(prePoint.lastX2!, prePoint.lastY2!)
    ctx.quadraticCurveTo(prePoint.x, prePoint.y, point.lastX1, point.lastY1)
    ctx.stroke()

    if (!prePoint.isFirstPoint) {
      // 绘制连接段曲线
      ctx.beginPath()
      ctx.moveTo(prePoint.lastX1!, prePoint.lastY1!)
      ctx.quadraticCurveTo(prePoint.x, prePoint.y, prePoint.lastX2!, prePoint.lastY2!)
      ctx.stroke()
    }

    // 批量更新绘制内容
    ctx.draw(true)
  } else {
    point.isFirstPoint = true
  }
}

/**
 * canvas 绘制图片输出成文件类型
 */
const canvasToImage = () => {
  const { fileType, quality, exportScale } = props
  const { canvasWidth, canvasHeight } = canvasState
  uni.canvasToTempFilePath(
    {
      width: canvasWidth * exportScale,
      height: canvasHeight * exportScale,
      destWidth: canvasWidth * exportScale,
      destHeight: canvasHeight * exportScale,
      fileType,
      quality,
      canvasId: canvasId.value,
      canvas,
      success: (res) => {
        const result: SignatureResult = {
          tempFilePath: res.tempFilePath,
          width: (canvasWidth * exportScale) / pixelRatio.value,
          height: (canvasHeight * exportScale) / pixelRatio.value,
          success: true,
        }
        // #ifdef MP-DINGTALK
        result.tempFilePath = (res as any).filePath
        // #endif
        emit('confirm', result)
      },
      fail: () => {
        const result: SignatureResult = {
          tempFilePath: '',
          width: (canvasWidth * exportScale) / pixelRatio.value,
          height: (canvasHeight * exportScale) / pixelRatio.value,
          success: false,
        }
        emit('confirm', result)
      },
    },
    proxy,
  )
}

/**
 * 重绘整个画布
 */
const redrawCanvas = () => {
  const { ctx } = canvasState
  if (!ctx) return

  // 清除画布并设置背景
  if (isDef(props.backgroundColor)) {
    ctx.setFillStyle(props.backgroundColor)
    ctx.fillRect(0, 0, canvasState.canvasWidth, canvasState.canvasHeight)
  } else {
    ctx.clearRect(0, 0, canvasState.canvasWidth, canvasState.canvasHeight)
  }

  // 如果没有线条，只需要清空画布
  if (lines.value.length === 0) {
    ctx.draw()
    return
  }

  // 收集所有绘制操作，最后一次性 draw
  lines.value.forEach((line) => {
    if (!line.points.length) return

    ctx.setStrokeStyle(line.color)
    ctx.setLineJoin('round')
    ctx.setLineCap('round')

    if (line.isPressure && props.pressure) {
      // 笔锋模式的重绘
      line.points.forEach((point, index) => {
        if (index === 0) return
        const prePoint = line.points[index - 1]
        const dis_x = point.x - prePoint.x
        const dis_y = point.y - prePoint.y
        const distance = Math.sqrt(dis_x * dis_x + dis_y * dis_y)

        if (distance <= 2) {
          point.lastX1 = point.lastX2 = prePoint.x + dis_x * 0.5
          point.lastY1 = point.lastY2 = prePoint.y + dis_y * 0.5
        } else {
          const speed = point.speed || 0
          const minSpeed = props.minSpeed || 1.5
          const speedFactor = Math.max(0.1, Math.min(0.9, speed / (minSpeed * 10)))

          point.lastX1 = prePoint.x + dis_x * (0.2 + speedFactor * 0.3)
          point.lastY1 = prePoint.y + dis_y * (0.2 + speedFactor * 0.3)
          point.lastX2 = prePoint.x + dis_x * (0.8 - speedFactor * 0.3)
          point.lastY2 = prePoint.y + dis_y * (0.8 - speedFactor * 0.3)
        }

        const lineWidth = point.lineWidth || line.width
        if (typeof prePoint.lastX1 === 'number') {
          ctx.setLineWidth(lineWidth)
          ctx.beginPath()
          ctx.moveTo(prePoint.lastX2!, prePoint.lastY2!)
          ctx.quadraticCurveTo(prePoint.x, prePoint.y, point.lastX1, point.lastY1)
          ctx.stroke()

          if (!prePoint.isFirstPoint) {
            ctx.beginPath()
            ctx.moveTo(prePoint.lastX1!, prePoint.lastY1!)
            ctx.quadraticCurveTo(prePoint.x, prePoint.y, prePoint.lastX2!, prePoint.lastY2!)
            ctx.stroke()
          }
        } else {
          point.isFirstPoint = true
        }
      })
    } else {
      // 非笔锋模式的重绘
      ctx.setLineWidth(line.width)
      line.points.forEach((point, index) => {
        if (index === 0) return
        const prePoint = line.points[index - 1]
        ctx.beginPath()
        ctx.moveTo(prePoint.x, prePoint.y)
        ctx.lineTo(point.x, point.y)
        ctx.stroke()
      })
    }
  })

  // 所有线条绘制完成后，一次性更新画布
  ctx.draw()
}

/**
 * 初始化 canvas
 * @param forceUpdate 是否强制更新
 */
const initCanvas = (forceUpdate: boolean = false) => {
  // 如果不是强制更新，且已经初始化过 canvas，则不再重复初始化
  if (!forceUpdate && canvasState.canvasHeight && canvasState.canvasWidth) {
    return
  }
  getContext().then(() => {
    const { ctx } = canvasState
    if (ctx && isDef(props.backgroundColor)) {
      ctx.setFillStyle(props.backgroundColor)
      ctx.fillRect(0, 0, canvasState.canvasWidth, canvasState.canvasHeight)
      ctx.draw()
    }
  })
}

/**
 * 清空 canvas
 */
const clear = () => {
  lines.value = []
  redoLines.value = []
  currentStep.value = 0
  clearCanvas()
  emit('clear')
}

/**
 * 确认签名
 */
const confirmSignature = () => {
  canvasToImage()
}

/**
 * 撤销功能
 */
const revoke = () => {
  if (!lines.value.length) return
  const step = Math.min(props.step, lines.value.length)
  const removedLines = lines.value.splice(lines.value.length - step)
  redoLines.value.push(...removedLines)
  currentStep.value = Math.max(0, currentStep.value - step)
  redrawCanvas()
}

/**
 * 恢复功能
 */
const restore = () => {
  if (!redoLines.value.length) return
  const step = Math.min(props.step, redoLines.value.length)
  const restoredLines = redoLines.value.splice(redoLines.value.length - step)
  lines.value.push(...restoredLines)
  currentStep.value = Math.min(lines.value.length, currentStep.value + step)
  redrawCanvas()
}

/**
 * canvas划线
 * @param e 触摸事件
 */
const draw = (e: any) => {
  e.preventDefault()
  const { ctx } = canvasState

  if (!drawing.value || props.disabled || !ctx) return
  const { x, y } = e.touches[0]

  const point: Point = {
    x,
    y,
    t: Date.now(),
  }

  if (currentLine.value) {
    const points = currentLine.value.points
    const prePoint = points[points.length - 1]

    if (prePoint.t === point.t || (prePoint.x === x && prePoint.y === y)) {
      return
    }

    // 计算点的速度和距离
    point.distance = Math.sqrt((point.x - prePoint.x) ** 2 + (point.y - prePoint.y) ** 2)
    point.speed = point.distance / (point.t - prePoint.t || 0.1)

    if (props.pressure) {
      point.lineWidth = calculateLineWidth(point.speed)
      // 处理线宽变化率限制
      if (points.length >= 2) {
        const prePoint2 = points[points.length - 2]
        if (prePoint2.lineWidth && prePoint.lineWidth) {
          const rate = (point.lineWidth - prePoint.lineWidth) / prePoint.lineWidth
          const maxRate = 0.2 // 最大变化率20%
          if (Math.abs(rate) > maxRate) {
            const per = rate > 0 ? maxRate : -maxRate
            point.lineWidth = prePoint.lineWidth * (1 + per)
          }
        }
      }
    }

    points.push(point)

    // 非笔锋模式直接使用线段连接
    if (!props.pressure) {
      ctx.beginPath()
      ctx.moveTo(prePoint.x, prePoint.y)
      ctx.lineTo(point.x, point.y)
      ctx.stroke()
      ctx.draw(true)
    } else if (points.length >= 2) {
      // 笔锋模式使用贝塞尔曲线
      drawSmoothLine(prePoint, point)
    }
  }

  emit('signing', e)
}

/**
 * 开始画线
 * @param e 触摸事件
 */
const startDrawing = (e: any) => {
  e.preventDefault()
  drawing.value = true
  setLine()
  emit('start', e)

  // 创建新线条，同时保存当前的所有绘制参数
  const { x, y } = e.touches[0]
  currentLine.value = {
    points: [
      {
        x,
        y,
        t: Date.now(), // 使用 t 替换 width
      },
    ],
    color: props.penColor,
    width: getDefaultLineWidth(),
    backgroundColor: props.backgroundColor,
    isPressure: props.pressure, // 添加笔锋模式标记
  }

  // 清空重做记录
  redoLines.value = []
  draw(e)
}

/**
 * 结束画线
 * @param e 触摸事件
 */
const stopDrawing = (e: TouchEvent) => {
  e.preventDefault()
  drawing.value = false
  if (currentLine.value) {
    // 保存完整的线条信息，包括所有点的参数
    lines.value.push({
      ...currentLine.value,
      points: currentLine.value.points.map((point) => ({
        ...point,
        t: point.t,
        speed: point.speed,
        distance: point.distance,
        lineWidth: point.lineWidth,
        lastX1: point.lastX1,
        lastY1: point.lastY1,
        lastX2: point.lastX2,
        lastY2: point.lastY2,
        isFirstPoint: point.isFirstPoint,
      })),
    })
    currentStep.value = lines.value.length
  }
  currentLine.value = undefined
  const { ctx } = canvasState
  if (ctx) ctx.beginPath()
  emit('end', e)
}

/**
 * 监听属性变化
 */
watch(
  () => props.penColor,
  () => {
    setLine()
  },
)

watch(
  () => props.lineWidth,
  () => {
    setLine()
  },
)

/**
 * 组件挂载前处理
 */
onBeforeMount(() => {
  // #ifdef MP
  pixelRatio.value = uni.getSystemInfoSync().pixelRatio
  // #endif
})

/**
 * 组件挂载后处理
 */
onMounted(() => {
  initCanvas()
})

// 暴露组件方法
defineExpose<WdSignatureExpose>({
  init: initCanvas,
  clear,
  confirm: confirmSignature,
  restore,
  revoke,
})

/** 签名组件实例类型 */
export type SignatureInstance = ComponentPublicInstance<WdSignatureProps, WdSignatureExpose>
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 签名组件样式
@include b(signature) {
  @include e(content) {
    justify-content: center;
    align-items: center;
    display: flex;
    overflow: hidden;
    background: $-signature-bg;
    border-radius: $-signature-radius;
    border: $-signature-border;
  }

  @include e(content-canvas) {
    width: 100%;
  }

  @include e(footer) {
    margin-top: $-signature-footer-margin-top;
    justify-content: flex-end;
    display: flex;

    :deep() {
      .wd-button {
        margin-left: $-signature-button-margin-left;
      }
    }
  }
}
</style>
