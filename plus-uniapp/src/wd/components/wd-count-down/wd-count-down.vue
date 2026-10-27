<!-- CountDown 倒计时 用于实时展示倒计时数值，支持毫秒精度。 -->
<template>
  <view :class="`wd-count-down ${customClass}`" :style="customStyle">
    <slot v-if="$slots.default" :current="current" />
    <block v-else>
      {{ parseFormat(format, current) }}
    </block>
  </view>
</template>

<script lang="ts" setup>
import type { ComponentPublicInstance } from 'vue'
import { onMounted, watch } from 'vue'
import { padZero } from '../common/util'
import { useCountDown } from '../composables/useCountDown'

defineOptions({
  name: 'wd-count-down',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 时间数据接口
 */
interface TimeData {
  /** 天数 */
  days: number
  /** 小时数 */
  hours: number
  /** 分钟数 */
  minutes: number
  /** 秒数 */
  seconds: number
  /** 毫秒数 */
  milliseconds: number
}

/**
 * 倒计时组件属性接口
 */
interface WdCountDownProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 倒计时时长，单位毫秒 */
  time: number
  /** 是否开启毫秒 */
  millisecond?: boolean
  /** 格式化时间 */
  format?: string
  /** 是否自动开始 */
  autoStart?: boolean
}

/**
 * 倒计时组件事件接口
 */
interface WdCountDownEmits {
  /** 倒计时变化时触发 */
  change: [current: TimeData]
  /** 倒计时结束时触发 */
  finish: []
}

/**
 * 倒计时组件暴露方法接口
 */
interface WdCountDownExpose {
  /** 开始倒计时 */
  start: () => void
  /** 暂停倒计时 */
  pause: () => void
  /** 重设倒计时，若 auto-start 为 true，重设后会自动开始倒计时 */
  reset: () => void
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdCountDownProps>(), {
  customStyle: '',
  customClass: '',
  millisecond: false,
  format: 'HH:mm:ss',
  autoStart: true,
})

// 定义组件事件
const emit = defineEmits<WdCountDownEmits>()

// 使用倒计时组合函数
const { start, pause, reset, current } = useCountDown({
  time: props.time,
  millisecond: props.millisecond,
  onChange: (current) => emit('change', current),
  onFinish: () => emit('finish'),
})

/**
 * 解析时间格式
 * @param format 格式字符串
 * @param timeData 时间数据
 * @returns 格式化后的时间字符串
 */
const parseFormat = (format: string, timeData: TimeData): string => {
  const { days } = timeData
  let { hours, minutes, seconds, milliseconds } = timeData

  // 处理天数
  if (format.includes('DD')) {
    format = format.replace('DD', padZero(days))
  } else {
    hours += days * 24
  }

  // 处理小时
  if (format.includes('HH')) {
    format = format.replace('HH', padZero(hours))
  } else {
    minutes += hours * 60
  }

  // 处理分钟
  if (format.includes('mm')) {
    format = format.replace('mm', padZero(minutes))
  } else {
    seconds += minutes * 60
  }

  // 处理秒数
  if (format.includes('ss')) {
    format = format.replace('ss', padZero(seconds))
  } else {
    milliseconds += seconds * 1000
  }

  // 处理毫秒
  if (format.includes('S')) {
    const ms = padZero(milliseconds, 3)

    if (format.includes('SSS')) {
      format = format.replace('SSS', ms)
    } else if (format.includes('SS')) {
      format = format.replace('SS', ms.slice(0, 2))
    } else {
      format = format.replace('S', ms.charAt(0))
    }
  }

  return format
}

/**
 * 重置倒计时
 * 重置倒计时时间，并根据 autoStart 属性决定是否自动开始
 */
const resetTime = () => {
  reset(props.time)
  if (props.autoStart) {
    start()
  }
}

/**
 * 监听 time 属性变化
 * 当时间属性发生变化时，重置倒计时
 */
watch(() => props.time, resetTime, { immediate: false })

/**
 * 组件挂载后初始化倒计时
 */
onMounted(() => {
  resetTime()
})

// 暴露组件方法
defineExpose<WdCountDownExpose>({
  start,
  pause,
  reset: resetTime,
})

/** 倒计时组件实例类型 */
export type CountDownInstance = ComponentPublicInstance<WdCountDownProps, WdCountDownExpose>
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 暗色主题样式
.wot-theme-dark {
  @include b(count-down) {
    color: $-dark-color;
  }
}

// 倒计时组件样式
@include b(count-down) {
  color: $-count-down-text-color;
  font-size: $-count-down-font-size;
  line-height: $-count-down-line-height;
}
</style>
