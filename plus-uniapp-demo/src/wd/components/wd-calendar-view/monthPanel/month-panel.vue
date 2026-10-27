<!-- MonthPanel - 提供月份维度的滚动面板，包含星期标题和时间选择器集成。 -->
<template>
  <view class="wd-month-panel">
    <view v-if="showPanelTitle" class="wd-month-panel__title">
      {{ formatMonthTitle(months[scrollIndex].date) }}
    </view>
    <view class="wd-month-panel__weeks">
      <view v-for="item in 7" :key="item" class="wd-month-panel__week">
        {{ getWeekLabel(item + firstDayOfWeek - 1) }}
      </view>
    </view>
    <scroll-view
      :class="`wd-month-panel__container ${!!timeType ? 'wd-month-panel__container--time' : ''}`"
      :style="`height: ${addUnit(timeType ? panelHeight - 250 : panelHeight)}`"
      scroll-y
      :scroll-top="scrollTop"
      @scroll="monthScroll"
    >
      <view v-for="(item, index) in months" :id="`month${index}`" :key="index">
        <month
          :type="type"
          :date="item.date"
          :value="value"
          :min-date="minDate"
          :max-date="maxDate"
          :first-day-of-week="firstDayOfWeek"
          :formatter="formatter"
          :max-range="maxRange"
          :range-prompt="rangePrompt"
          :allow-same-day="allowSameDay"
          :default-time="defaultTime"
          :show-title="index !== 0"
          @change="handleDateChange"
        />
      </view>
    </scroll-view>
    <view v-if="timeType" class="wd-month-panel__time">
      <view v-if="type === 'datetimerange'" class="wd-month-panel__time-label">
        <view class="wd-month-panel__time-text">
          {{ timeType === 'start' ? translate('startTime') : translate('endTime') }}
        </view>
      </view>
      <view class="wd-month-panel__time-picker">
        <wd-picker-view
          v-if="timeData.length"
          v-model="timeValue"
          :columns="timeData"
          :columns-height="250"
          :item-height="70"
          :immediate-change="immediateChange"
          @change="handleTimeChange"
          @pickstart="handlePickStart"
          @pickend="handlePickEnd"
        />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type {
  CalendarFormatter,
  CalendarItem,
  CalendarTimeFilter,
  CalendarType,
} from '../wd-calendar-view.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { addUnit, debounce, isArray, isEqual, isNumber, pause, rpxToPx } from '../../common/util'
import { useTranslate } from '../../composables/useTranslate'
import wdPickerView from '../../wd-picker-view/wd-picker-view.vue'
import Month from '../month/month.vue'
import {
  compareMonth,
  formatMonthTitle,
  getMonthEndDay,
  getMonths,
  getTimeData,
  getWeekLabel,
} from '../wd-calendar-utils'

defineOptions({
  name: 'WdMonthPanel',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 月份信息接口
 */
interface MonthInfo {
  /** 月份日期时间戳 */
  date: number
  /** 月份高度 */
  height: number
}

/**
 * 月份面板时间类型
 */
type MonthPanelTimeType = 'start' | 'end' | ''

/**
 * 月份面板组件属性接口
 */
interface WdMonthPanelProps {
  /** 日历类型 */
  type: CalendarType
  /** 当前选中的值 */
  value: number | (number | null)[] | null
  /** 最小可选日期时间戳 */
  minDate: number
  /** 最大可选日期时间戳 */
  maxDate: number
  /** 一周的第一天，0为周日，1为周一 */
  firstDayOfWeek: number
  /** 日期格式化函数 */
  formatter?: CalendarFormatter
  /** 日期区间最大范围 */
  maxRange?: number
  /** 超出最大范围时的提示文案 */
  rangePrompt?: string
  /** 是否允许选择同一天作为开始和结束日期 */
  allowSameDay?: boolean
  /** 是否显示面板标题 */
  showPanelTitle?: boolean
  /** 默认时间数组 */
  defaultTime?: Array<number[]>
  /** 面板高度 */
  panelHeight: number
  /** 时间过滤器函数，用于过滤时间选择器的数据 */
  timeFilter?: CalendarTimeFilter
  /** 是否隐藏秒选择 */
  hideSecond?: boolean
  /** 是否在手指松开时立即触发picker-view的change事件 */
  immediateChange?: boolean
}

/**
 * 月份面板组件事件接口
 */
interface WdMonthPanelEmits {
  /** 日期变化时触发 */
  change: [value: { value: number | (number | null)[] | null }]
  /** 开始选择时触发 */
  pickstart: []
  /** 结束选择时触发 */
  pickend: []
}

/**
 * 月份面板组件暴露方法接口
 */
interface WdMonthPanelExpose {
  /** 使当前日期或者选中日期滚动到可视区域 */
  scrollIntoView: () => void
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdMonthPanelProps>(), {
  allowSameDay: false,
  showPanelTitle: false,
  hideSecond: false,
  immediateChange: false,
})

// 定义组件事件
const emit = defineEmits<WdMonthPanelEmits>()

// 响应式数据
const scrollTop = ref<number>(0) // 滚动位置
const scrollIndex = ref<number>(0) // 当前显示的月份索引
const timeValue = ref<number[]>([]) // 当前选中的时分秒
const timeType = ref<MonthPanelTimeType>('') // 当前时间类型，是开始还是结束
const innerValue = ref<string | number | (number | null)[]>('') // 内部保存一个值，用于判断新老值，避免监听器触发

// 国际化翻译
const { translate } = useTranslate('calendar-view')

// 防抖处理变化事件
const handleChange = debounce((value) => {
  emit('change', { value })
}, 50)

/**
 * 获取时间选择器的数据
 * @param value 当前时间值
 * @param type 时间类型
 * @returns 时间选择器数据
 */
const getTime = (value: number | (number | null)[], type?: string) => {
  if (props.type === 'datetime') {
    return getTimeData({
      date: value as number,
      minDate: props.minDate,
      maxDate: props.maxDate,
      filter: props.timeFilter,
      isHideSecond: props.hideSecond,
    })
  } else {
    if (type === 'start' && isArray(props.value)) {
      return getTimeData({
        date: (value as Array<number>)[0],
        minDate: props.minDate,
        maxDate: props.value[1] ? props.value[1] : props.maxDate,
        filter: props.timeFilter,
        isHideSecond: props.hideSecond,
      })
    } else {
      return getTimeData({
        date: (value as Array<number>)[1],
        minDate: (value as Array<number>)[0],
        maxDate: props.maxDate,
        filter: props.timeFilter,
        isHideSecond: props.hideSecond,
      })
    }
  }
}

/**
 * 获取指定日期的时分秒
 * @param date 日期时间戳
 * @param type 时间类型
 * @returns 时分秒数组
 */
const getTimeValue = (date: number | (number | null)[], type: MonthPanelTimeType) => {
  let dateValue: Date = new Date()

  if (props.type === 'datetime') {
    dateValue = new Date(date as number)
  } else if (isArray(date)) {
    if (type === 'start') {
      dateValue = new Date(date[0] || '')
    } else {
      dateValue = new Date(date[1] || '')
    }
  }

  const hour = dateValue.getHours()
  const minute = dateValue.getMinutes()
  const second = dateValue.getSeconds()

  return props.hideSecond ? [hour, minute] : [hour, minute, second]
}

/**
 * 设置时间相关状态
 * @param value 日期值
 * @param type 时间类型
 */
const setTime = (value: number | (number | null)[], type?: MonthPanelTimeType) => {
  if (isArray(value) && value[0] && value[1] && type === 'start' && timeType.value === 'start') {
    type = 'end'
  }
  timeType.value = type || ''
  timeValue.value = getTimeValue(value, type || '')
}

/**
 * 计算时间选择器的列数据
 */
const timeData = computed<Array<CalendarItem[]>>(() => {
  let timeColumns: Array<CalendarItem[]> = []

  if (props.type === 'datetime' && isNumber(props.value)) {
    const date = new Date(props.value)
    date.setHours(timeValue.value[0])
    date.setMinutes(timeValue.value[1])
    date.setSeconds(props.hideSecond ? 0 : timeValue.value[2])
    const dateTime = date.getTime()
    timeColumns = getTime(dateTime) || []
  } else if (isArray(props.value) && props.type === 'datetimerange') {
    const [start, end] = props.value!
    const dataValue = timeType.value === 'start' ? start : end
    const date = new Date(dataValue || '')
    date.setHours(timeValue.value[0])
    date.setMinutes(timeValue.value[1])
    date.setSeconds(props.hideSecond ? 0 : timeValue.value[2])
    const dateTime = date.getTime()
    const finalValue = [start, end]

    if (timeType.value === 'start') {
      finalValue[0] = dateTime
    } else {
      finalValue[1] = dateTime
    }
    timeColumns = getTime(finalValue, timeType.value) || []
  }

  return timeColumns
})

/**
 * 计算月份数据
 * 包含每个月的日期和高度信息
 */
const months = computed<MonthInfo[]>(() => {
  return getMonths(props.minDate, props.maxDate).map((month, index) => {
    const offset = (7 + new Date(month).getDay() - props.firstDayOfWeek) % 7
    const totalDay = getMonthEndDay(new Date(month).getFullYear(), new Date(month).getMonth() + 1)
    const rows = Math.ceil((offset + totalDay) / 7)
    return {
      // 使用 px 计算，与 scrollTop 单位一致
      height: rows * rpxToPx(128) + (rows - 1) * rpxToPx(8) + (index === 0 ? 0 : rpxToPx(90)), // px 单位
      date: month,
    }
  })
})

/**
 * 监听类型变化，设置时间
 */
watch(
  () => props.type,
  (val) => {
    if (
      (val === 'datetime' && props.value) ||
      (val === 'datetimerange' &&
        isArray(props.value) &&
        props.value &&
        props.value.length > 0 &&
        props.value[0])
    ) {
      setTime(props.value, 'start')
    }
  },
  {
    deep: true,
    immediate: true,
  },
)

/**
 * 监听值变化，设置时间并滚动到选中位置
 */
watch(
  () => props.value,
  (val, oldVal) => {
    if (isEqual(val, innerValue.value)) return

    if (
      (props.type === 'datetime' && val) ||
      (props.type === 'datetimerange' && val && isArray(val) && val.length > 0 && val[0])
    ) {
      setTime(val, 'start')
    }

    // 当值变化时（特别是范围选择完成时），自动滚动到选中区域
    // 只在有新值且与旧值不同时才滚动
    if (val && !isEqual(val, oldVal)) {
      // 对于范围选择，当两个值都有时才滚动
      if (isArray(val)) {
        if (val[0] && val[1]) {
          // 延迟滚动，确保DOM已更新
          setTimeout(() => {
            scrollIntoView()
          }, 100)
        }
      } else if (isNumber(val)) {
        // 单个日期选择，立即滚动
        setTimeout(() => {
          scrollIntoView()
        }, 100)
      }
    }
  },
  {
    deep: true,
    immediate: true,
  },
)

/**
 * 使当前日期或者选中日期滚动到可视区域
 */
const scrollIntoView = async () => {
  // 等待渲染完毕
  await pause()
  let startDate: number | null = 0
  let endDate: number | null = 0

  if (isArray(props.value)) {
    // 对数组按时间排序,取第一个和最后一个值
    const sortedValue = [...props.value].filter(v => v).sort((a, b) => (a || 0) - (b || 0))
    startDate = sortedValue[0] || null
    endDate = sortedValue[sortedValue.length - 1] || null
  } else if (isNumber(props.value)) {
    startDate = props.value
    endDate = props.value
  }

  if (!startDate) {
    startDate = Date.now()
    endDate = Date.now()
  }

  // 计算开始日期和结束日期的位置
  let startTop: number = 0
  let endTop: number = 0
  let startMonthIndex = -1
  let endMonthIndex = -1

  // 计算开始日期的位置
  for (let index = 0; index < months.value.length; index++) {
    if (compareMonth(months.value[index].date, startDate) === 0) {
      startMonthIndex = index
      const date = new Date(startDate)
      const day = date.getDate()
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
      const offset = (7 + firstDay.getDay() - props.firstDayOfWeek) % 7
      const row = Math.floor((offset + day - 1) / 7)
      startTop += row * rpxToPx(128) + row * rpxToPx(8)
      break
    }
    startTop += months.value[index] ? Number(months.value[index].height) : 0
  }

  // 如果有结束日期且不同于开始日期，计算结束日期的位置
  if (endDate && endDate !== startDate) {
    for (let index = 0; index < months.value.length; index++) {
      if (compareMonth(months.value[index].date, endDate) === 0) {
        endMonthIndex = index
        const date = new Date(endDate)
        const day = date.getDate()
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
        const offset = (7 + firstDay.getDay() - props.firstDayOfWeek) % 7
        const row = Math.floor((offset + day - 1) / 7)
        // 计算到行的底部
        endTop += (row + 1) * rpxToPx(128) + row * rpxToPx(8)
        break
      }
      endTop += months.value[index] ? Number(months.value[index].height) : 0
    }
  } else {
    endTop = startTop + rpxToPx(128) // 单个日期，只需要一行高度
  }

  // 获取可视区域高度
  const viewportHeight = timeType.value ? props.panelHeight - 250 : props.panelHeight
  const viewportHeightPx = rpxToPx(viewportHeight)

  // 计算选中范围的总高度
  const rangeHeight = endTop - startTop

  // 如果范围高度大于视口高度，优先显示开始位置
  // 否则，居中显示整个范围
  let targetScrollTop = 0
  if (rangeHeight >= viewportHeightPx) {
    // 范围太大，显示开始部分
    targetScrollTop = startTop
  } else {
    // 居中显示整个范围
    targetScrollTop = startTop - (viewportHeightPx - rangeHeight) / 2
  }

  // 确保不滚动到负值
  targetScrollTop = Math.max(0, targetScrollTop)

  // 添加月份标题偏移（如果不是第一个月）
  if (startMonthIndex > 0) {
    targetScrollTop += rpxToPx(90)
  }

  scrollTop.value = 0
  if (targetScrollTop > 0) {
    await pause()
    scrollTop.value = targetScrollTop
  }
}

/**
 * 组件挂载后滚动到当前日期
 */
onMounted(() => {
  scrollIntoView()
})

/**
 * 处理日期变化事件
 * @param param 变化参数
 */
const handleDateChange = ({
  value,
  type,
}: {
  value: number | (number | null)[]
  type?: MonthPanelTimeType
}) => {
  if (!isEqual(value, props.value)) {
    // 内部保存一个值，用于判断新老值，避免监听器触发
    innerValue.value = value
    handleChange(value)
  }

  // datetime 和 datetimerange 类型，需要计算 timeData 并做展示
  if (props.type.includes('time')) {
    setTime(value, type)
  }
}

/**
 * 处理时间变化事件
 * @param param 时间变化参数
 */
// prettier-ignore
const handleTimeChange = ({ picker, value, index }: { picker: any, value: any, index: number }) => {
  if (!props.value) {
    return
  }

  if (props.type === 'datetime' && isNumber(props.value)) {
    const date = new Date(props.value)
    date.setHours(value[0])
    date.setMinutes(value[1])
    date.setSeconds(props.hideSecond ? 0 : value[2])
    const dateTime = date.getTime()
    if (dateTime === props.value) return
    // 内部保存值,避免 props.value 回流时 watch 误触发 scrollIntoView 导致日历闪烁
    innerValue.value = dateTime
    handleChange(dateTime)
  } else if (isArray(props.value) && props.type === 'datetimerange') {
    const [start, end] = props.value!
    const dataValue = timeType.value === 'start' ? start : end
    const date = new Date(dataValue || '')
    date.setHours(value[0])
    date.setMinutes(value[1])
    date.setSeconds(props.hideSecond ? 0 : value[2])
    const dateTime = date.getTime()

    if (dateTime === dataValue) return

    const finalValue = [start, end]
    if (timeType.value === 'start') {
      finalValue[0] = dateTime
    } else {
      finalValue[1] = dateTime
    }
    innerValue.value = finalValue // 内部保存一个值，用于判断新老值，避免监听器触发
    handleChange(finalValue)
  }
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

/**
 * 设置当前显示的月份标题
 * @param scrollTop 滚动条位置
 */
const doSetSubtitle = (scrollTop: number) => {
  let height: number = 0 // 月份高度和

  for (let index = 0; index < months.value.length; index++) {
    height = height + months.value[index].height
    if (scrollTop < height) {
      scrollIndex.value = index
      return
    }
  }
}

/**
 * 处理月份滚动事件
 * @param event 滚动事件
 */
const monthScroll = (event: { detail: { scrollTop: number } }) => {
  if (months.value.length <= 1) {
    return
  }
  const scrollTop = Math.max(0, event.detail.scrollTop)
  doSetSubtitle(scrollTop)
}

// 暴露组件方法
defineExpose<WdMonthPanelExpose>({
  scrollIntoView,
})
</script>

<style lang="scss">
// 引入外部样式文件
@import '../../common/abstracts/variable';
@import '../../common/abstracts/mixin';

// 暗色主题样式
.wot-theme-dark {
  @include b(month-panel) {
    @include e(title) {
      color: $-dark-color;
    }

    @include e(weeks) {
      box-shadow: 0 8rpx 16rpx 0 rgba(255, 255, 255, 0.02);
      color: $-dark-color;
    }

    @include e(time-label) {
      color: $-dark-color;

      &::after {
        background: $-dark-background4;
      }
    }
  }
}

// 月份面板组件样式
@include b(month-panel) {
  font-size: $-calendar-fs;

  // 标题样式
  @include e(title) {
    text-align: center;
    font-size: $-calendar-panel-title-fs;
    color: $-calendar-panel-title-color;
    padding: $-calendar-panel-padding;
  }

  // 星期标题样式
  @include e(weeks) {
    display: flex;
    height: $-calendar-week-height;
    line-height: $-calendar-week-height;
    box-shadow: 0 8rpx 16rpx 0 rgba(0, 0, 0, 0.02);
    color: $-calendar-week-color;
    font-size: $-calendar-week-fs;
    padding: $-calendar-panel-padding;
  }

  // 单个星期样式
  @include e(week) {
    flex: 1;
    text-align: center;
  }

  // 容器样式
  @include e(container) {
    padding: $-calendar-panel-padding;
    box-sizing: border-box;
  }

  // 时间选择区域样式
  @include e(time) {
    display: flex;
    box-shadow: 0 -8rpx 16rpx 0 rgba(0, 0, 0, 0.02);
  }

  // 时间标签样式
  @include e(time-label) {
    position: relative;
    flex: 1;
    font-size: $-picker-column-fs;
    text-align: center;
    line-height: 250rpx;
    color: $-picker-column-color;

    &::after {
      position: absolute;
      content: '';
      height: 70rpx;
      top: 50%;
      left: 0;
      right: 0;
      transform: translateY(-50%);
      background: $-picker-column-select-bg;
      z-index: 0;
    }
  }

  // 时间文字样式
  @include e(time-text) {
    position: relative;
    z-index: 1;
  }

  // 时间选择器样式
  @include e(time-picker) {
    flex: 3;
  }
}
</style>
