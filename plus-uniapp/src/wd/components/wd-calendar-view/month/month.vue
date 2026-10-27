<!-- Month - 渲染单个月份内的日期网格，支持日期的多种选择模式（单选、多选、范围选择、周选择等）。 -->
<template>
  <view>
    <wd-toast selector="wd-month" />
    <view class="month">
      <view class="wd-month">
        <view v-if="showTitle" class="wd-month__title">
          {{ formatMonthTitle(date) }}
        </view>
        <view class="wd-month__days">
          <view
            v-for="(item, index) in days"
            :key="index"
            :class="`wd-month__day ${item.disabled ? 'is-disabled' : ''} ${item.isLastRow ? 'is-last-row' : ''} ${
              item.type ? getItemClass(item.type, value, type) : ''
            }`"
            :style="
              index === 0
                ? `margin-left: ${(100 / 7) * ((7 + new Date(date).getDay() - firstDayOfWeek) % 7)}%;`
                : ''
            "
            @click="handleDateClick(index)"
          >
            <view class="wd-month__day-container">
              <view class="wd-month__day-top">{{ item.topInfo }}</view>
              <view class="wd-month__day-text">
                {{ item.text }}
              </view>
              <view class="wd-month__day-bottom">{{ item.bottomInfo }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type {
  CalendarDayItem,
  CalendarDayType,
  CalendarFormatter,
  CalendarType,
} from '../wd-calendar-view.vue'
import { ref, watch } from 'vue'
import { deepClone, isArray, isFunction } from '../../common/util'
import { useTranslate } from '../../composables/useTranslate'
import { useToast } from '../../wd-toast/useToast'
import wdToast from '../../wd-toast/wd-toast.vue'
import {
  compareDate,
  formatMonthTitle,
  getDateByDefaultTime,
  getDayByOffset,
  getDayOffset,
  getItemClass,
  getMonthEndDay,
  getNextDay,
  getPrevDay,
  getWeekRange,
} from '../wd-calendar-utils'

defineOptions({
  name: 'WdMonth',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 月份组件属性接口
 */
interface WdMonthProps {
  /** 日历类型 */
  type: CalendarType
  /** 当前月份的日期时间戳 */
  date: number
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
  /** 默认时间数组 */
  defaultTime?: Array<number[]>
  /** 是否显示月份标题 */
  showTitle?: boolean
}

/**
 * 月份组件事件接口
 */
interface WdMonthEmits {
  /** 日期变化时触发 */
  // prettier-ignore
  change: [value: { value: number | (number | null)[] | null, type?: CalendarDayType }]
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdMonthProps>(), {
  allowSameDay: false,
  showTitle: true,
})

// 定义组件事件
const emit = defineEmits<WdMonthEmits>()

// 响应式数据
const days = ref<Array<CalendarDayItem>>([])

// 国际化翻译
const { translate } = useTranslate('calendar-view')

// Toast 提示
const toast = useToast('wd-month')

/**
 * 判断是否为最后一行
 * @param date 日期时间戳
 * @returns 是否为最后一行
 */
const isLastRow = (date: number) => {
  const currentDate = new Date(date)
  const currentDay = currentDate.getDate()
  const daysInMonth = getMonthEndDay(currentDate.getFullYear(), currentDate.getMonth() + 1)
  const offset = (7 + new Date(props.date).getDay() - props.firstDayOfWeek) % 7
  const totalDaysShown = offset + daysInMonth
  const totalRows = Math.ceil(totalDaysShown / 7)
  return Math.ceil((offset + currentDay) / 7) === totalRows
}

/**
 * 获取单日期选择类型
 */
const getDateType = (date: number): CalendarDayType => {
  if (props.value && compareDate(date, props.value as number) === 0) {
    return 'selected'
  }
  return ''
}
/**
 * 获取多日期选择类型
 */
const getDatesType = (date: number): CalendarDayType => {
  const { value } = props
  let type: CalendarDayType = ''

  if (!isArray(value)) return type

  const isSelected = (day: number) => {
    return value.some((item) => compareDate(day, item) === 0)
  }

  if (isSelected(date)) {
    const prevDay = getPrevDay(date)
    const nextDay = getNextDay(date)
    const prevSelected = isSelected(prevDay)
    const nextSelected = isSelected(nextDay)

    if (prevSelected && nextSelected) {
      type = 'multiple-middle'
    } else if (prevSelected) {
      type = 'end'
    } else if (nextSelected) {
      type = 'start'
    } else {
      type = 'multiple-selected'
    }
  }

  return type
}

/**
 * 获取日期范围选择类型
 */
const getDatetimeType = (date: number, value: number | number[] | null) => {
  const [startDate, endDate] = isArray(value) ? value : []

  if (startDate && compareDate(date, startDate) === 0) {
    if (props.allowSameDay && endDate && compareDate(startDate, endDate) === 0) {
      return 'same'
    }
    return 'start'
  } else if (endDate && compareDate(date, endDate) === 0) {
    return 'end'
  } else if (
    startDate &&
    endDate &&
    compareDate(date, startDate) === 1 &&
    compareDate(date, endDate) === -1
  ) {
    return 'middle'
  } else {
    return ''
  }
}

/**
 * 获取周选择类型
 */
const getWeektimeType = (date: number, value: number | number[] | null) => {
  const [startDate, endDate] = isArray(value) ? value : []

  if (startDate && compareDate(date, startDate) === 0) {
    return 'start'
  } else if (endDate && compareDate(date, endDate) === 0) {
    return 'end'
  } else if (
    startDate &&
    endDate &&
    compareDate(date, startDate) === 1 &&
    compareDate(date, endDate) === -1
  ) {
    return 'middle'
  } else {
    return ''
  }
}

/**
 * 获取日期类型
 * @param date 日期时间戳
 * @param value 当前选中值
 * @returns 日期类型
 */
const getDayType = (date: number, value: number | number[] | null): CalendarDayType => {
  switch (props.type) {
    case 'date':
    case 'datetime':
      return getDateType(date)
    case 'dates':
      return getDatesType(date)
    case 'daterange':
    case 'datetimerange':
      return getDatetimeType(date, value)
    case 'week':
      return getWeektimeType(date, value)
    case 'weekrange':
      return getWeektimeType(date, value)
    default:
      return getDateType(date)
  }
}

/**
 * 获取格式化后的日期对象
 * @param date 日期时间戳
 * @param day 日期数字
 * @param type 日期类型
 * @returns 格式化后的日期对象
 */
const getFormatterDate = (date: number, day: string | number, type?: CalendarDayType) => {
  let dayObj: CalendarDayItem = {
    date,
    text: day,
    topInfo: '',
    bottomInfo: '',
    type,
    disabled: compareDate(date, props.minDate) === -1 || compareDate(date, props.maxDate) === 1,
    isLastRow: isLastRow(date),
  }

  if (props.formatter) {
    if (isFunction(props.formatter)) {
      dayObj = props.formatter(dayObj)
    } else {
      console.error(
        '[wot-design] error(wd-calendar-view): the formatter prop of wd-calendar-view should be a function',
      )
    }
  }

  return dayObj
}

/**
 * 获取周选择的值
 */
const getWeekValue = () => {
  if (props.type === 'week') {
    return getWeekRange(props.value as number, props.firstDayOfWeek)
  } else {
    const [startDate, endDate] = (props.value as any) || []

    if (startDate) {
      const firstWeekRange = getWeekRange(startDate, props.firstDayOfWeek)

      if (endDate) {
        const endWeekRange = getWeekRange(endDate, props.firstDayOfWeek)
        return [firstWeekRange[0], endWeekRange[1]]
      } else {
        return firstWeekRange
      }
    }

    return []
  }
}

/**
 * 设置当月的日期数据
 */
const setDays = () => {
  const dayList: Array<CalendarDayItem> = []
  const date = new Date(props.date)
  const year = date.getFullYear()
  const month = date.getMonth()
  const totalDay = getMonthEndDay(year, month + 1)
  let value = props.value

  if ((props.type === 'week' || props.type === 'weekrange') && value) {
    value = getWeekValue()
  }

  for (let day = 1; day <= totalDay; day++) {
    const date = new Date(year, month, day).getTime()
    let type: CalendarDayType = getDayType(date, value as number | number[] | null)
    if (!type && compareDate(date, Date.now()) === 0) {
      type = 'current'
    }
    const dayObj = getFormatterDate(date, day, type)
    dayList.push(dayObj)
  }
  days.value = dayList
}

/**
 * 监听属性变化，重新设置日期数据
 */
watch(
  [
    () => props.type,
    () => props.date,
    () => props.value,
    () => props.minDate,
    () => props.maxDate,
    () => props.formatter,
  ],
  () => {
    setDays()
  },
  {
    deep: true,
    immediate: true,
  },
)

/**
 * 获取处理后的日期
 * @param date 原始日期
 * @param isEnd 是否为结束日期
 * @returns 处理后的日期
 */
const getDate = (date: number, isEnd: boolean = false) => {
  date =
    props.defaultTime && props.defaultTime.length > 0
      ? getDateByDefaultTime(date, isEnd ? props.defaultTime[1] : props.defaultTime[0])
      : date

  if (date < props.minDate) return props.minDate
  if (date > props.maxDate) return props.maxDate

  return date
}

/**
 * 处理单日期选择变化
 */
const handleDateChange = (date: CalendarDayItem) => {
  if (date.disabled) return

  if (date.type !== 'selected') {
    emit('change', {
      value: getDate(date.date),
      type: 'start',
    })
  }
}

/**
 * 处理多日期选择变化
 */
const handleDatesChange = (date: CalendarDayItem) => {
  if (date.disabled) return

  const currentValue = deepClone(isArray(props.value) ? props.value : [])
  const dateIndex = currentValue.findIndex((item) => item && compareDate(item, date.date) === 0)
  const value =
    dateIndex === -1
      ? [...currentValue, getDate(date.date)]
      : currentValue.filter((_, index) => index !== dateIndex)

  emit('change', { value })
}

/**
 * 处理日期范围选择变化
 */
const handleDateRangeChange = (date: CalendarDayItem) => {
  if (date.disabled) return

  let value: (number | null)[] = []
  let type: CalendarDayType = ''
  const [startDate, endDate] = deepClone(isArray(props.value) ? props.value : [])
  const compare = compareDate(date.date, startDate)

  // 禁止选择同个日期
  if (
    !props.allowSameDay &&
    compare === 0 &&
    (props.type === 'daterange' || props.type === 'datetimerange') &&
    !endDate
  ) {
    return
  }

  if (startDate && !endDate && compare > -1) {
    // 不能选择超过最大范围的日期
    if (props.maxRange && getDayOffset(date.date, startDate) > props.maxRange) {
      const maxEndDate = getDayByOffset(startDate, props.maxRange - 1)
      value = [startDate, getDate(maxEndDate, true)]
      toast.show({
        msg: props.rangePrompt || translate('rangePrompt', props.maxRange),
      })
    } else {
      value = [startDate, getDate(date.date, true)]
    }
  } else if (props.type === 'datetimerange' && startDate && endDate) {
    // 时间范围类型，且有开始时间和结束时间，需要支持重新点击开始日期和结束日期可以重新修改时间
    if (compare === 0) {
      type = 'start'
      value = props.value as number[]
    } else if (compareDate(date.date, endDate) === 0) {
      type = 'end'
      value = props.value as number[]
    } else {
      value = [getDate(date.date), null]
    }
  } else {
    value = [getDate(date.date), null]
  }

  emit('change', {
    value,
    type: type || (value[1] ? 'end' : 'start'),
  })
}

/**
 * 处理周选择变化
 */
const handleWeekChange = (date: CalendarDayItem) => {
  const [weekStart] = getWeekRange(date.date, props.firstDayOfWeek)

  // 周的第一天如果是禁用状态，则不可选中
  if (getFormatterDate(weekStart, new Date(weekStart).getDate()).disabled) return

  emit('change', {
    value: getDate(weekStart) + 24 * 60 * 60 * 1000,
  })
}

/**
 * 处理周范围选择变化
 */
const handleWeekRangeChange = (date: CalendarDayItem) => {
  const [weekStartDate] = getWeekRange(date.date, props.firstDayOfWeek)

  // 周的第一天如果是禁用状态，则不可选中
  if (getFormatterDate(weekStartDate, new Date(weekStartDate).getDate()).disabled) return

  let value: (number | null)[] = []
  const [startDate, endDate] = deepClone(isArray(props.value) ? props.value : [])
  const [startWeekStartDate] = startDate ? getWeekRange(startDate, props.firstDayOfWeek) : []
  const compare = compareDate(weekStartDate, startWeekStartDate)

  if (startDate && !endDate && compare > -1) {
    if (!props.allowSameDay && compare === 0) return

    value = [
      getDate(startWeekStartDate) + 24 * 60 * 60 * 1000,
      getDate(weekStartDate) + 24 * 60 * 60 * 1000,
    ]
  } else {
    value = [getDate(weekStartDate) + 24 * 60 * 60 * 1000, null]
  }

  emit('change', { value })
}

/**
 * 处理日期点击事件
 * @param index 日期索引
 */
const handleDateClick = (index: number) => {
  const date = days.value[index]
  switch (props.type) {
    case 'date':
    case 'datetime':
      handleDateChange(date)
      break
    case 'dates':
      handleDatesChange(date)
      break
    case 'daterange':
    case 'datetimerange':
      handleDateRangeChange(date)
      break
    case 'week':
      handleWeekChange(date)
      break
    case 'weekrange':
      handleWeekRangeChange(date)
      break
    default:
      handleDateChange(date)
  }
}
</script>

<style lang="scss">
// 引入外部样式文件
@import '../../common/abstracts/variable';
@import '../../common/abstracts/mixin';

// 暗色主题样式
.wot-theme-dark {
  @include b(month) {
    @include e(title) {
      color: $-dark-color;
    }

    @include e(days) {
      color: $-dark-color;
    }

    @include e(day) {
      @include when(disabled) {
        .wd-month__day-text {
          color: $-dark-color-gray;
        }
      }
    }
  }
}

// 月份组件样式
@include b(month) {
  // 标题样式
  @include e(title) {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 90rpx;
    font-size: $-calendar-panel-title-fs;
    color: $-calendar-panel-title-color;
  }

  // 日期容器样式
  @include e(days) {
    display: flex;
    flex-wrap: wrap;
    font-size: $-calendar-day-fs;
    color: $-calendar-day-color;
  }

  // 单个日期样式
  @include e(day) {
    position: relative;
    width: 14.285%;
    height: $-calendar-day-height;
    line-height: $-calendar-day-height;
    text-align: center;
    margin-bottom: $-calendar-item-margin-bottom;

    // 禁用状态
    @include when(disabled) {
      .wd-month__day-text {
        color: $-calendar-disabled-color;
      }
    }

    // 当前日期
    @include when(current) {
      color: $-calendar-active-color;
    }

    // 选中状态和多选状态
    @include when(selected, multiple-selected) {
      .wd-month__day-container {
        border-radius: $-calendar-active-border;
        background: $-calendar-active-color;
        color: $-calendar-selected-color;
      }
    }

    // 范围中间状态
    @include when(middle) {
      .wd-month__day-container {
        background: $-calendar-range-color;
      }
    }

    // 多选中间状态
    @include when(multiple-middle) {
      .wd-month__day-container {
        background: $-calendar-active-color;
        color: $-calendar-selected-color;
      }
    }

    // 范围开始状态
    @include when(start) {
      &::after {
        position: absolute;
        content: '';
        height: $-calendar-day-height;
        top: 0;
        right: 0;
        left: 50%;
        background: $-calendar-range-color;
        z-index: 1;
      }

      &.is-without-end::after {
        display: none;
      }

      .wd-month__day-container {
        background: $-calendar-active-color;
        color: $-calendar-selected-color;
        border-radius: $-calendar-active-border 0 0 $-calendar-active-border;
      }
    }

    // 范围结束状态
    @include when(end) {
      &::after {
        position: absolute;
        content: '';
        height: $-calendar-day-height;
        top: 0;
        left: 0;
        right: 50%;
        background: $-calendar-range-color;
        z-index: 1;
      }

      .wd-month__day-container {
        background: $-calendar-active-color;
        color: $-calendar-selected-color;
        border-radius: 0 $-calendar-active-border $-calendar-active-border 0;
      }
    }

    // 同一天选择状态
    @include when(same) {
      .wd-month__day-container {
        background: $-calendar-active-color;
        color: $-calendar-selected-color;
        border-radius: $-calendar-active-border;
      }
    }

    // 最后一行
    @include when(last-row) {
      margin-bottom: 0;
    }
  }

  // 日期容器
  @include e(day-container) {
    position: relative;
    z-index: 2;
  }

  // 日期文字
  @include e(day-text) {
    font-weight: $-calendar-day-fw;
  }

  // 日期顶部信息
  @include e(day-top) {
    position: absolute;
    top: 20rpx;
    left: 0;
    right: 0;
    line-height: 1.1;
    font-size: $-calendar-info-fs;
    text-align: center;
  }

  // 日期底部信息
  @include e(day-bottom) {
    position: absolute;
    bottom: 20rpx;
    left: 0;
    right: 0;
    line-height: 1.1;
    font-size: $-calendar-info-fs;
    text-align: center;
  }
}
</style>
