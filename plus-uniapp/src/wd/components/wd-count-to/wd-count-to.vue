<!-- CountTo 数字滚动 数字滚动组件。 -->
<template>
  <view :class="`wd-count-to ${customClass}`">
    <!-- 前缀插槽 -->
    <slot name="prefix">
      <wd-text
        :type="type"
        :color="color"
        :size="`${addUnit(fontSize * 0.7)}`"
        :text="prefix"
      />
    </slot>
    <!-- 默认文本插槽 -->
    <slot>
      <wd-text
        :type="type"
        :color="color"
        :size="`${addUnit(fontSize)}`"
        :text="parseFormat(current.total)"
      />
    </slot>
    <!-- 后缀插槽 -->
    <slot name="suffix">
      <wd-text
        :type="type"
        :color="color"
        :size="`${addUnit(fontSize * 0.7)}`"
        :text="suffix"
      />
    </slot>
  </view>
</template>

<script lang="ts" setup>
import type { ComponentPublicInstance } from 'vue'
import { onMounted, watch } from 'vue'
import { addUnit, easingFn, isNumber } from '../common/util'
import { useCountDown } from '../composables/useCountDown'
import wdText from '../wd-text/wd-text.vue'

defineOptions({
  name: 'WdCountTo',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 文本类型
 */
type TextType = 'default' | 'primary' | 'success' | 'warning' | 'error'

/**
 * 数字滚动组件属性接口
 */
interface WdCountToProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 字体大小 */
  fontSize?: number
  /** 文本颜色 */
  color?: string
  /** 主题类型，可选值：'default' / 'primary' / 'error' / 'warning' / 'success' */
  type?: TextType

  /** 起始值 */
  startVal?: number
  /** 最终值 */
  endVal?: number
  /** 从起始值到结束值数字变动的时间，单位毫秒 */
  duration?: number
  /** 是否自动开始 */
  autoStart?: boolean
  /** 保留的小数位数，必须大于等于0 */
  decimals?: number
  /** 小数点符号 */
  decimal?: string
  /** 千分位分隔符 */
  separator?: string
  /** 前缀，例如：'¥' 人民币前缀 */
  prefix?: string
  /** 后缀 */
  suffix?: string
  /** 是否使用缓动效果 */
  useEasing?: boolean
}

/**
 * 数字滚动组件事件接口
 */
interface WdCountToEmits {
  /** 组件挂载完成时触发 */
  mounted: []
  /** 数字滚动完成时触发 */
  finish: []
}

/**
 * 数字滚动组件暴露方法接口
 */
interface WdCountToExpose {
  /** 开始数字滚动 */
  start: () => void
  /** 暂停数字滚动 */
  pause: () => void
  /** 重设数字滚动，若 auto-start 为 true，重设后会自动开始 */
  reset: () => void
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdCountToProps>(), {
  customStyle: '',
  customClass: '',
  fontSize: 32,
  color: '',
  type: 'default',
  startVal: 0,
  endVal: 2024,
  duration: 3000,
  autoStart: true,
  decimals: 0,
  decimal: '.',
  separator: ',',
  prefix: '',
  suffix: '',
  useEasing: true,
})

// 定义组件事件
const emit = defineEmits<WdCountToEmits>()

// 验证 decimals 属性
if (props.decimals < 0) {
  console.error('decimals must be greater than or equal to 0')
}

// 使用倒计时组合函数控制动画
const { start, pause, reset, current } = useCountDown({
  time: props.duration,
  millisecond: true,
  onFinish: () => emit('finish'),
})

/**
 * 重置动画
 * 重置数字滚动，并根据 autoStart 属性决定是否自动开始
 */
const resetTime = () => {
  reset(props.duration)
  if (props.autoStart) {
    start()
  }
}

/**
 * 监听相关属性变化
 * 当起始值、结束值或持续时间发生变化时，重置动画
 */
watch([() => props.startVal, () => props.endVal, () => props.duration], resetTime, {
  immediate: false,
})

/**
 * 格式化数字
 * @param num 要格式化的数字
 * @returns 格式化后的数字字符串
 */
const formatNumber = (num: any): string => {
  if (typeof num !== 'number') {
    num = Number.parseFloat(num)
    if (Number.isNaN(num)) {
      return '0'
    }
  }

  // 保留指定小数位数
  num = num.toFixed(props.decimals)
  const parts = num.split('.')
  let integerPart = parts[0]
  const decimalPart = parts.length > 1 ? props.decimal + parts[1] : ''
  const rgx = /(\d+)(\d{3})/

  // 添加千分位分隔符
  if (props.separator && !isNumber(props.separator)) {
    while (rgx.test(integerPart)) {
      integerPart = integerPart.replace(rgx, `$1${props.separator}$2`)
    }
  }

  return integerPart + decimalPart
}

/**
 * 解析格式化数字
 * @param remain 剩余时间
 * @returns 格式化后的数字字符串
 */
const parseFormat = (remain: number): string => {
  const { startVal, endVal, duration, useEasing } = props
  const progress = duration - remain // 已经进行的时间
  const isPositive = startVal > endVal // 判断startVal是否大于endVal
  const progressRatio = progress / duration // 计算进度比例

  let currentVal: number

  if (useEasing) {
    // 使用缓动函数计算currentVal
    if (isPositive) {
      currentVal = startVal - easingFn(progress, 0, startVal - endVal, duration) || 0
    } else {
      currentVal = easingFn(progress, startVal, endVal - startVal, duration)
    }
  } else {
    // 不使用缓动函数时的计算方式
    if (isPositive) {
      currentVal = startVal - (startVal - endVal) * progressRatio
    } else {
      currentVal = startVal + (endVal - startVal) * progressRatio
    }
  }

  // 确保currentVal在startVal和endVal之间
  currentVal = isPositive ? Math.max(endVal, currentVal) : Math.min(endVal, currentVal)
  return formatNumber(currentVal)
}

/**
 * 组件挂载后初始化
 */
onMounted(() => {
  resetTime()
  emit('mounted')
})

// 暴露组件方法
defineExpose<WdCountToExpose>({
  start,
  reset: resetTime,
  pause,
})

/**  数字滚动组件实例类型 */
export type CountToInstance = ComponentPublicInstance<WdCountToProps, WdCountToExpose>
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 数字滚动组件样式
.wd-count-to {
  vertical-align: bottom;
}
</style>
