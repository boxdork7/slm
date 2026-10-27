<!-- Progress 进度条 用于展示操作的当前进度。 -->
<template>
  <view :class="`wd-progress ${customClass}`" :style="customStyle">
    <view class="wd-progress__outer">
      <view
        :class="`wd-progress__inner ${status ? `is-${status}` : ''}`"
        :style="`background: ${showColor}; width: ${showPercent}%; transition-duration: ${changeCount * duration * 0.001}s;`"
      />
    </view>
    <view v-if="!hideText" class="wd-progress__label">{{ showPercent }}%</view>
    <wd-icon
      v-else-if="status"
      :custom-class="`wd-progress__label wd-progress__icon ${status ? `is-${status}` : ''}`"
      :name="iconName"
      :color="typeof color === 'string' ? color : ''"
    />
  </view>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { isArray, isDef, isObj, pause } from '../common/util'
import wdIcon from '../wd-icon/wd-icon.vue'

defineOptions({
  name: 'WdProgress',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 进度条状态类型
 */
export type ProgressStatus = 'success' | 'danger' | 'warning'

/**
 * 进度条颜色配置
 */
export interface ProgressColor {
  /** 颜色值 */
  color: string
  /** 百分比 */
  percentage: number
}

/**
 * 进度条组件属性接口
 */
interface WdProgressProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 进度数值，最大值100 */
  percentage?: number
  /** 是否隐藏进度条上的文字 */
  hideText?: boolean
  /** 进度条颜色，可以是字符串、字符串数组或颜色配置数组 */
  color?: string | string[] | ProgressColor[]
  /** 进度增加1%所需毫秒数 */
  duration?: number
  /** 进度条状态 */
  status?: ProgressStatus
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdProgressProps>(), {
  customStyle: '',
  customClass: '',
  percentage: 0,
  hideText: false,
  duration: 30,
})

// 响应式数据
const showColor = ref<string>('')
const showPercent = ref<number>(0)
const changeCount = ref<number>(0)
let timer: ReturnType<typeof setTimeout> | null = null

/**
 * 验证百分比值
 * 确保百分比在0-100范围内且为有效数字
 */
const validatePercentage = (value: number) => {
  if (Number.isNaN(value) || value < 0 || value > 100) {
    console.error('The value of percentage must be between 0 and 100')
  }
}
/**
 * 判断是否为字符串数组
 * @param array 待检查的数组
 */
const isStringArray = (array: string[] | ProgressColor[]): array is string[] => {
  return array.every((item) => typeof item === 'string')
}

/**
 * 判断是否为颜色配置数组
 * @param array 待检查的数组
 */
const isProgressColorArray = (array: string[] | ProgressColor[]): array is ProgressColor[] => {
  return array.every(
    (color) =>
      isObj(color) &&
      Object.prototype.hasOwnProperty.call(color, 'color') &&
      Object.prototype.hasOwnProperty.call(color, 'percentage'),
  )
}

/**
 * 验证颜色数组格式
 * @param colorArray 颜色数组
 */
const validateColorArray = (colorArray: string[] | ProgressColor[]) => {
  const isStrArray = isStringArray(colorArray)
  const isObjArray = isProgressColorArray(colorArray)

  if (!isStrArray && !isObjArray) {
    throw new Error('Color must be String or Object with color and percentage')
  }

  if (isObjArray && colorArray.some(({ percentage }) => Number.isNaN(percentage))) {
    throw new Error('All the percentage must can be formatted to Number')
  }
}

/**
 * 创建颜色分段列表
 * @param colorArray 颜色数组
 * @returns 处理后的颜色分段数组
 */
const createPartList = (colorArray: string[] | ProgressColor[]): ProgressColor[] => {
  const partNum = 100 / colorArray.length

  return isProgressColorArray(colorArray)
    ? colorArray.sort((a, b) => a.percentage - b.percentage)
    : colorArray.map((item, index) => ({
        color: item,
        percentage: (index + 1) * partNum,
      }))
}
/**
 * 进度条后退更新
 * @param partList 颜色数组
 * @param percentage 目标进度值
 */
const updateProgressBackward = (partList: ProgressColor[], percentage: number) => {
  return partList.some((part) => {
    if (percentage <= part.percentage) {
      update(percentage, part.color)
      return true
    }
    return false
  })
}

/**
 * 进度条前进更新
 * @param partList 颜色数组
 * @param percentage 目标进度值
 */
const updateProgressForward = (partList: ProgressColor[], percentage: number) => {
  return partList.some((part, index) => {
    if (showPercent.value < part.percentage && part.percentage <= percentage) {
      update(part.percentage, part.color)
      return true
    } else if (index === partList.length - 1) {
      update(percentage, part.color)
    }
    return false
  })
}

/**
 * 更新进度条
 * 根据颜色配置和目标百分比更新进度显示
 */
const updateProgress = async () => {
  const { percentage, color } = props

  // 如果没有颜色配置或为空数组，直接更新百分比
  if (!isDef(color) || (isArray(color) && color.length === 0)) {
    changeCount.value = Math.abs(percentage - showPercent.value)
    await pause()
    showPercent.value = percentage
    return
  }

  // 如果百分比相同，不需要更新
  if (showPercent.value === percentage) return

  const colorArray = isArray(color) ? color : [color]
  validateColorArray(colorArray)
  const partList = createPartList(colorArray)

  // 根据进度方向选择更新策略
  showPercent.value > percentage
    ? updateProgressBackward(partList, percentage)
    : updateProgressForward(partList, percentage)
}

/**
 * 执行进度更新
 * @param targetPercent 目标百分比
 * @param color 目标颜色
 */
function update(targetPercent: number, color: string) {
  if (timer) return

  const { duration } = props
  changeCount.value = Math.abs(targetPercent - showPercent.value)

  setTimeout(() => {
    showPercent.value = targetPercent
    showColor.value = color

    timer = setTimeout(() => {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      updateProgress()
    }, changeCount.value * duration)
  }, 50)
}

/**
 * 监听进度相关属性变化
 * 当百分比、颜色或持续时间发生变化时，验证并更新进度
 */
watch(
  () => [props.percentage, props.color, props.duration],
  () => {
    validatePercentage(props.percentage)
    updateProgress()
  },
  { immediate: true },
)

/**
 * 计算状态图标名称
 * 根据不同状态返回对应的图标
 */
const iconName = computed(() => {
  const iconMap: Record<ProgressStatus, string> = {
    danger: 'close-outline',
    success: 'check-outline',
    warning: 'warn',
  }

  return props.status ? iconMap[props.status] : ''
})
</script>

<style lang="scss">
// 引入外部样式文件
@import './../common/abstracts/_mixin.scss';
@import './../common/abstracts/variable.scss';

// 暗色主题样式
.wot-theme-dark {
  @include b(progress) {
    @include e(label) {
      color: $-dark-color3;
    }
  }
}

// 进度条主体样式
@include b(progress) {
  width: 100%;
  height: $-progress-height;
  display: flex;
  align-items: center;
  padding: $-progress-padding;

  // 外层容器
  @include e(outer) {
    display: block;
    position: relative;
    flex: 1;
    height: $-progress-height;
    border-radius: calc($-progress-height / 2);
    background: $-progress-bg;
  }

  // 内层进度条
  @include e(inner) {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    border-radius: calc($-progress-height / 2);
    background: $-progress-color;
    transition-property: width;
    transition-timing-function: linear;
    font-size: $-progress-icon-fs;

    // 不同状态的颜色
    @include when(danger) {
      background: $-progress-danger-color;
    }
    @include when(success) {
      background: $-progress-success-color;
    }
    @include when(warning) {
      background: $-progress-warning-color;
    }
  }

  // 标签文字样式
  @include edeep(label) {
    width: 60rpx;
    margin-left: 18rpx;
    color: $-progress-label-color;
    font-size: $-progress-label-fs;
  }

  // 图标样式
  @include edeep(icon) {
    font-size: $-progress-icon-fs;

    // 不同状态的图标颜色
    @include when(danger) {
      color: $-progress-danger-color;
    }
    @include when(success) {
      color: $-progress-success-color;
    }
    @include when(warning) {
      color: $-progress-warning-color;
    }
  }
}
</style>
