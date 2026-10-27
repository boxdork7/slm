<!-- CalendarView 日历面板组件 提供日历单选、多选、范围选择、周维度、月维度等功能。可以根据实际业务场景基于该组件进行封装高度定制化组件。 -->
<template>
  <view :class="`wd-calendar-view ${customClass}`">
    <year-panel
      v-if="type === 'month' || type === 'monthrange'"
      ref="yearPanelRef"
      :type="type"
      :value="internalValue"
      :min-date="minDate"
      :max-date="maxDate"
      :formatter="formatter"
      :max-range="maxRange"
      :range-prompt="rangePrompt"
      :allow-same-day="allowSameDay"
      :show-panel-title="showPanelTitle"
      :default-time="formatDefauleTime"
      :panel-height="panelHeight"
      @change="handleChange"
    />
    <month-panel
      v-else
      ref="monthPanelRef"
      :type="type"
      :value="internalValue"
      :min-date="minDate"
      :max-date="maxDate"
      :first-day-of-week="firstDayOfWeek"
      :formatter="formatter"
      :max-range="maxRange"
      :range-prompt="rangePrompt"
      :allow-same-day="allowSameDay"
      :show-panel-title="showPanelTitle"
      :default-time="formatDefauleTime"
      :panel-height="panelHeight"
      :immediate-change="immediateChange"
      :time-filter="timeFilter"
      :hide-second="hideSecond"
      @change="handleChange"
      @pickstart="handlePickStart"
      @pickend="handlePickEnd"
    />
  </view>
</template>

<script lang="ts" setup>
import type { ComponentPublicInstance } from 'vue'
import { ref, watch, computed } from 'vue'
import MonthPanel from './monthPanel/month-panel.vue'
import { getDefaultTime } from './wd-calendar-utils'
import YearPanel from './yearPanel/year-panel.vue'
import { dayjs } from '../common/dayjs'

defineOptions({
  name: 'WdCalendarView',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 日历类型
 */
export type CalendarType =
  | 'date'
  | 'dates'
  | 'datetime'
  | 'week'
  | 'month'
  | 'daterange'
  | 'datetimerange'
  | 'weekrange'
  | 'monthrange'

/**
 * 日历项类型
 */
export type CalendarDayType =
  | ''
  | 'start'
  | 'middle'
  | 'end'
  | 'selected'
  | 'same'
  | 'current'
  | 'multiple-middle'
  | 'multiple-selected'

/**
 * 日历项数据结构
 */
export interface CalendarDayItem {
  /** 日期时间戳 */
  date: number
  /** 显示文本 */
  text?: number | string
  /** 顶部信息 */
  topInfo?: string
  /** 底部信息 */
  bottomInfo?: string
  /** 日期类型 */
  type?: CalendarDayType
  /** 是否禁用 */
  disabled?: boolean
  /** 是否为最后一行 */
  isLastRow?: boolean
}

/**
 * 日期格式化函数类型
 */
export type CalendarFormatter = (day: CalendarDayItem) => CalendarDayItem

/**
 * 时间过滤器选项类型
 */
type CalendarTimeFilterOptionType = 'hour' | 'minute' | 'second'

/**
 * 日历项接口
 */
export interface CalendarItem {
  /** 显示标签 */
  label: string
  /** 值 */
  value: number
  /** 是否禁用 */
  disabled: boolean
}

/**
 * 时间过滤器选项
 */
interface CalendarTimeFilterOption {
  /** 类型 */
  type: CalendarTimeFilterOptionType
  /** 值列表 */
  values: CalendarItem[]
}

/**
 * 时间过滤器函数类型
 */
export type CalendarTimeFilter = (option: CalendarTimeFilterOption) => CalendarItem[]

/**
 * 值格式模式
 * - timestamp: 时间戳模式（默认，完全兼容现有代码）
 * - string: 字符串模式
 * - auto: 智能模式（自动识别输入类型并保持）
 */
export type CalendarValueFormat = 'timestamp' | 'string' | 'auto'

/**
 * 日历值类型（支持时间戳或字符串）
 */
export type CalendarValue = number | number[] | string | string[] | null

/**
 * 日历视图组件属性接口
 */
interface WdCalendarViewProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 选中值，支持时间戳或字符串（根据 valueFormat 自动处理） */
  modelValue: CalendarValue
  /** 日历类型 */
  type?: CalendarType
  /** 最小日期，为13位时间戳 */
  minDate?: number
  /** 最大日期，为13位时间戳 */
  maxDate?: number
  /** 周起始天，0为周日，1为周一 */
  firstDayOfWeek?: number
  /** 日期格式化函数 */
  formatter?: CalendarFormatter
  /** 范围选择时的最大日期范围 */
  maxRange?: number
  /** 范围选择时超出最大日期范围的错误提示文案 */
  rangePrompt?: string
  /** 范围选择时是否允许选择同一天 */
  allowSameDay?: boolean
  /** 是否展示面板标题，自动计算当前滚动的日期月份 */
  showPanelTitle?: boolean
  /** 选中日期所使用的当日内具体时刻 */
  defaultTime?: string | string[]
  /** 可滚动面板的高度 */
  panelHeight?: number
  /** 时间过滤器函数，用于过滤时间选择器的数据 */
  timeFilter?: CalendarTimeFilter
  /** 是否隐藏秒选择 */
  hideSecond?: boolean
  /** 是否在手指松开时立即触发picker-view的change事件 */
  immediateChange?: boolean

  /**
   * 值格式模式
   * - timestamp: 时间戳模式（默认）
   * - string: 字符串模式
   * - auto: 智能模式（自动识别）
   */
  valueFormat?: CalendarValueFormat

  /**
   * 字符串格式（当 valueFormat 为 'string' 或 'auto' 时生效）
   * @default 根据日历类型自动选择:
   *   - date/daterange/dates/week/weekrange/month/monthrange: 'YYYY-MM-DD'
   *   - datetime/datetimerange: 'YYYY-MM-DD HH:mm:ss'
   */
  stringFormat?: string
}

/**
 * 日历视图组件事件接口
 */
interface WdCalendarViewEmits {
  /** 值变化时触发 */
  change: [value: { value: CalendarValue }]
  /** 更新modelValue */
  'update:modelValue': [value: CalendarValue]
  /** 开始选择时间时触发 */
  pickstart: []
  /** 结束选择时间时触发 */
  pickend: []
}

/**
 * 日历视图组件暴露方法接口
 */
interface WdCalendarViewExpose {
  /** 使当前日期或者选中日期滚动到可视区域 */
  scrollIntoView: () => void
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdCalendarViewProps>(), {
  customStyle: '',
  customClass: '',
  type: 'date',
  minDate: () =>
    new Date(new Date().getFullYear(), new Date().getMonth() - 6, new Date().getDate()).getTime(),
  maxDate: () =>
    new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 6,
      new Date().getDate(),
      23,
      59,
      59,
    ).getTime(),
  firstDayOfWeek: 0,
  allowSameDay: false,
  showPanelTitle: true,
  defaultTime: '00:00:00',
  panelHeight: 756, // 默认高度为756rpx
  hideSecond: false,
  immediateChange: false,
  valueFormat: 'timestamp', // 默认时间戳模式，完全兼容现有代码
  stringFormat: undefined, // 将在computed中根据type自动设置
})

// 定义组件事件
const emit = defineEmits<WdCalendarViewEmits>()

// 响应式数据
const formatDefauleTime = ref<number[][]>([])
const yearPanelRef = ref()
const monthPanelRef = ref()

// 内部值（始终为时间戳）
const internalValue = ref<number | number[] | null>(null)

// ===== 智能类型转换工具函数 =====

/**
 * 获取默认的字符串格式
 */
const defaultStringFormat = computed(() => {
  if (props.stringFormat) {
    return props.stringFormat
  }

  // 根据日历类型自动选择格式
  if (props.type === 'datetime' || props.type === 'datetimerange') {
    return props.hideSecond ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD HH:mm:ss'
  }

  return 'YYYY-MM-DD'
})

/**
 * 智能解析输入值为时间戳
 * @param value 输入值（可能是时间戳、字符串或数组）
 * @returns 时间戳或时间戳数组
 */
function parseToTimestamp(value: CalendarValue): number | number[] | null {
  if (value === null || value === undefined) {
    return null
  }

  // 已经是时间戳
  if (typeof value === 'number') {
    // 10位秒级时间戳转13位毫秒级
    return value.toString().length === 10 ? value * 1000 : value
  }

  // 字符串 → 时间戳
  if (typeof value === 'string') {
    // 兼容 Safari：替换 - 为 /
    const normalizedStr = value.trim().replace(/-/g, '/')
    const date = new Date(normalizedStr)

    if (isNaN(date.getTime())) {
      console.warn(`[wd-calendar-view] Invalid date string: ${value}`)
      return null
    }

    return date.getTime()
  }

  // 数组
  if (Array.isArray(value)) {
    const result = value.map(v => {
      if (v === null || v === undefined) {
        return null
      }

      if (typeof v === 'number') {
        return v.toString().length === 10 ? v * 1000 : v
      }

      if (typeof v === 'string') {
        const normalizedStr = v.trim().replace(/-/g, '/')
        const date = new Date(normalizedStr)
        return isNaN(date.getTime()) ? null : date.getTime()
      }

      return null
    }).filter(v => v !== null) as number[]

    return result.length > 0 ? result : null
  }

  return null
}

/**
 * 格式化时间戳为输出值
 * @param timestamp 时间戳或时间戳数组
 * @returns 根据 valueFormat 格式化后的值
 */
function formatOutput(timestamp: number | number[] | null): CalendarValue {
  if (timestamp === null || timestamp === undefined) {
    return null
  }

  // timestamp 模式：直接返回时间戳
  if (props.valueFormat === 'timestamp') {
    return timestamp
  }

  // string 模式：转换为字符串
  if (props.valueFormat === 'string') {
    if (Array.isArray(timestamp)) {
      return timestamp.map(ts => dayjs(ts).format(defaultStringFormat.value))
    }
    return dayjs(timestamp).format(defaultStringFormat.value)
  }

  // auto 模式：保持原类型
  if (props.valueFormat === 'auto') {
    const originalType = detectValueType(props.modelValue)

    if (originalType === 'string') {
      if (Array.isArray(timestamp)) {
        return timestamp.map(ts => dayjs(ts).format(defaultStringFormat.value))
      }
      return dayjs(timestamp).format(defaultStringFormat.value)
    }

    // 保持时间戳
    return timestamp
  }

  return timestamp
}

/**
 * 检测值的类型
 */
function detectValueType(value: CalendarValue): 'timestamp' | 'string' | null {
  if (value === null || value === undefined) {
    return null
  }

  if (typeof value === 'number') {
    return 'timestamp'
  }

  if (typeof value === 'string') {
    return 'string'
  }

  if (Array.isArray(value) && value.length > 0) {
    const firstItem = value[0]
    if (typeof firstItem === 'number') {
      return 'timestamp'
    }
    if (typeof firstItem === 'string') {
      return 'string'
    }
  }

  return null
}

/**
 * 监听 modelValue 变化，转换为内部时间戳
 */
watch(
  () => props.modelValue,
  (newValue) => {
    internalValue.value = parseToTimestamp(newValue)
  },
  {
    deep: true,
    immediate: true,
  },
)

/**
 * 监听默认时间变化，格式化默认时间
 */
watch(
  () => props.defaultTime,
  (newValue) => {
    formatDefauleTime.value = getDefaultTime(newValue)
  },
  {
    deep: true,
    immediate: true,
  },
)

/**
 * 使当前日期或者选中日期滚动到可视区域
 */
const scrollIntoView = () => {
  const panel = props.type.includes('month') ? yearPanelRef.value : monthPanelRef.value
  panel.scrollIntoView && panel.scrollIntoView()
}

/**
 * 处理日期变化事件
 * @param param 变化参数
 */
const handleChange = ({ value }: { value: number | number[] | null }) => {
  // 更新内部值
  internalValue.value = value
  // 转换为输出格式并触发事件
  const outputValue = formatOutput(value)
  emit('update:modelValue', outputValue)
  emit('change', { value: outputValue })
}

/**
 * 处理选择开始事件
 */
const handlePickStart = () => {
  emit('pickstart')
}

/**
 * 处理选择结束事件
 */
const handlePickEnd = () => {
  emit('pickend')
}

// 暴露组件方法
defineExpose<WdCalendarViewExpose>({
  scrollIntoView,
})

/** 日历视图组件实例类型 */
export type CalendarViewInstance = ComponentPublicInstance<
  WdCalendarViewProps,
  WdCalendarViewExpose
>
</script>

<style lang="scss">
// 日历视图组件样式
// 由于该组件主要作为容器组件，具体样式由子组件定义
// 这里可以添加容器级别的样式定义
</style>
