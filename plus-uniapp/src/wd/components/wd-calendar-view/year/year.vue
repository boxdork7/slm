<!-- Year - 渲染单个年份内的12个月份网格，支持月份的单选和范围选择功能。 -->
<template>
  <wd-toast selector="wd-year" />
  <view class="wd-year year">
    <view v-if="showTitle" class="wd-year__title">{{ formatYearTitle(date) }}</view>
    <view class="wd-year__months">
      <view
        v-for="(item, index) in months"
        :key="index"
        :class="`wd-year__month ${item.disabled ? 'is-disabled' : ''} ${item.isLastRow ? 'is-last-row' : ''} ${
          item.type ? getItemClass(item.type, value, type) : ''
        }`"
        @click="handleDateClick(index)"
      >
        <view class="wd-year__month-top">
          {{ item.topInfo }}
        </view>
        <view class="wd-year__month-text">
          {{ dayjs(item.date).format(translate('month', item.date)) }}
        </view>
        <view class="wd-year__month-bottom">{{ item.bottomInfo }}</view>
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
import { dayjs } from '../../common/dayjs'
import { deepClone, isArray, isFunction } from '../../common/util'
import { useTranslate } from '../../composables/useTranslate'
import { useToast } from '../../wd-toast/useToast'
import wdToast from '../../wd-toast/wd-toast.vue'
import {
  compareMonth,
  formatYearTitle,
  getDateByDefaultTime,
  getItemClass,
  getMonthByOffset,
  getMonthOffset,
} from '../wd-calendar-utils'

defineOptions({
  name: 'WdYear',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 年份组件属性接口
 */
interface WdYearProps {
  /** 日历类型 */
  type: CalendarType
  /** 当前年份的日期时间戳 */
  date: number
  /** 当前选中的值 */
  value: number | (number | null)[] | null
  /** 最小可选日期时间戳 */
  minDate: number
  /** 最大可选日期时间戳 */
  maxDate: number
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
  /** 是否显示年份标题 */
  showTitle?: boolean
}

/**
 * 年份组件事件接口
 */
interface WdYearEmits {
  /** 月份变化时触发 */
  change: [value: { value: number | (number | null)[] | null }]
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdYearProps>(), {
  allowSameDay: false,
  showTitle: true,
})

// 定义组件事件
const emit = defineEmits<WdYearEmits>()

// 响应式数据
const months = ref<CalendarDayItem[]>([])

// Toast 提示
const toast = useToast('wd-year')

// 国际化翻译
const { translate } = useTranslate('calendar-view')

/**
 * 获取月份的选择类型
 * @param date 月份日期时间戳
 * @returns 月份选择类型
 */
const getMonthType = (date: number): CalendarDayType => {
  if (props.type === 'monthrange' && isArray(props.value)) {
    const [startDate, endDate] = props.value || []

    if (startDate && compareMonth(date, startDate) === 0) {
      if (endDate && compareMonth(startDate, endDate) === 0) {
        return 'same'
      }
      return 'start'
    } else if (endDate && compareMonth(date, endDate) === 0) {
      return 'end'
    } else if (
      startDate &&
      endDate &&
      compareMonth(date, startDate) === 1 &&
      compareMonth(date, endDate) === -1
    ) {
      return 'middle'
    } else {
      return ''
    }
  } else {
    if (props.value && compareMonth(date, props.value as number) === 0) {
      return 'selected'
    } else {
      return ''
    }
  }
}

/**
 * 获取格式化后的月份对象
 * @param date 月份日期时间戳
 * @param month 月份索引（0-11）
 * @param type 月份选择类型
 * @returns 格式化后的月份对象
 */
const getFormatterDate = (date: number, month: number, type?: CalendarDayType) => {
  let monthObj: CalendarDayItem = {
    date,
    text: month + 1,
    topInfo: '',
    bottomInfo: '',
    type,
    disabled: compareMonth(date, props.minDate) === -1 || compareMonth(date, props.maxDate) === 1,
    isLastRow: month >= 8, // 第9、10、11、12月为最后一行
  }

  // 应用格式化函数
  if (props.formatter) {
    if (isFunction(props.formatter)) {
      monthObj = props.formatter(monthObj)
    } else {
      console.error(
        '[wot-design] error(wd-calendar-view): the formatter prop of wd-calendar-view should be a function',
      )
    }
  }

  return monthObj
}

/**
 * 设置当年的月份数据
 */
const setMonths = () => {
  const monthList: CalendarDayItem[] = []
  const date = new Date(props.date)
  const year = date.getFullYear()
  const value = props.value

  // 范围选择类型时，值必须是数组
  if (props.type.includes('range') && value && !isArray(value)) {
    console.error('[wot-design] value should be array when type is range')
    return
  }

  for (let month = 0; month < 12; month++) {
    const date = new Date(year, month, 1).getTime()
    let type: CalendarDayType = getMonthType(date)

    // 如果没有类型且是当前月份，标记为当前
    if (!type && compareMonth(date, Date.now()) === 0) {
      type = 'current'
    }

    const monthObj = getFormatterDate(date, month, type)
    monthList.push(monthObj)
  }

  months.value = deepClone(monthList)
}

/**
 * 监听属性变化，重新设置月份数据
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
    setMonths()
  },
  {
    deep: true,
    immediate: true,
  },
)

/**
 * 获取处理后的日期
 * @param date 原始日期时间戳
 * @returns 处理后的日期时间戳
 */
const getDate = (date: number) => {
  return props.defaultTime && props.defaultTime.length > 0
    ? getDateByDefaultTime(date, props.defaultTime[0])
    : date
}

/**
 * 处理单月份选择变化
 * @param date 月份数据项
 */
const handleMonthChange = (date: CalendarDayItem) => {
  if (date.type !== 'selected') {
    emit('change', {
      value: getDate(date.date),
    })
  }
}

/**
 * 处理月份范围选择变化
 * @param date 月份数据项
 */
const handleMonthRangeChange = (date: CalendarDayItem) => {
  let value: (number | null)[] = []
  const [startDate, endDate] = isArray(props.value) ? props.value || [] : []
  const compare = compareMonth(date.date, startDate!)

  // 禁止选择同个月份
  if (!props.allowSameDay && !endDate && compare === 0) return

  if (startDate && !endDate && compare > -1) {
    // 检查是否超过最大范围
    if (props.maxRange && getMonthOffset(date.date, startDate) > props.maxRange) {
      const maxEndDate = getMonthByOffset(startDate, props.maxRange - 1)
      value = [startDate, getDate(maxEndDate)]
      toast.show({
        msg: props.rangePrompt || translate('rangePromptMonth', props.maxRange),
      })
    } else {
      value = [startDate, getDate(date.date)]
    }
  } else {
    value = [getDate(date.date), null]
  }

  emit('change', { value })
}

/**
 * 处理月份点击事件
 * @param index 月份索引
 */
const handleDateClick = (index: number) => {
  const date = months.value[index]

  if (date.disabled) return

  switch (props.type) {
    case 'month':
      handleMonthChange(date)
      break
    case 'monthrange':
      handleMonthRangeChange(date)
      break
    default:
      handleMonthChange(date)
  }
}
</script>

<style lang="scss">
// 引入外部样式文件
@import '../../common/abstracts/variable';
@import '../../common/abstracts/mixin';

// 暗色主题样式
.wot-theme-dark {
  @include b(year) {
    @include e(title) {
      color: $-dark-color;
    }

    @include e(months) {
      color: $-dark-color;
    }

    @include e(month) {
      @include when(disabled) {
        .wd-year__month-text {
          color: $-dark-color-gray;
        }
      }
    }
  }
}

// 年份组件样式
@include b(year) {
  // 标题样式
  @include e(title) {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 90rpx;
    font-size: $-calendar-panel-title-fs;
    color: $-calendar-panel-title-color;
  }

  // 月份容器样式
  @include e(months) {
    display: flex;
    flex-wrap: wrap;
    font-size: $-calendar-day-fs;
    color: $-calendar-day-color;
  }

  // 单个月份样式
  @include e(month) {
    position: relative;
    width: 25%;
    height: $-calendar-day-height;
    line-height: $-calendar-day-height;
    text-align: center;
    margin-bottom: $-calendar-item-margin-bottom;

    // 禁用状态
    @include when(disabled) {
      .wd-year__month-text {
        color: $-calendar-disabled-color;
      }
    }

    // 当前月份
    @include when(current) {
      color: $-calendar-active-color;
    }

    // 选中状态
    @include when(selected) {
      color: #fff;

      .wd-year__month-text {
        border-radius: $-calendar-active-border;
        background: $-calendar-active-color;
      }
    }

    // 范围中间状态
    @include when(middle) {
      background: $-calendar-range-color;
    }

    // 范围开始状态
    @include when(start) {
      color: $-calendar-selected-color;

      &::after {
        position: absolute;
        top: 0;
        right: 0;
        left: 50%;
        bottom: 0;
        content: '';
        background: $-calendar-range-color;
      }

      .wd-year__month-text {
        background: $-calendar-active-color;
        border-radius: $-calendar-active-border 0 0 $-calendar-active-border;
      }

      &.is-without-end::after {
        display: none;
      }
    }

    // 范围结束状态
    @include when(end) {
      color: $-calendar-selected-color;

      &::after {
        position: absolute;
        top: 0;
        left: 0;
        right: 50%;
        bottom: 0;
        content: '';
        background: $-calendar-range-color;
      }

      .wd-year__month-text {
        background: $-calendar-active-color;
        border-radius: 0 $-calendar-active-border $-calendar-active-border 0;
      }
    }

    // 同一月份选择状态
    @include when(same) {
      color: $-calendar-selected-color;

      .wd-year__month-text {
        background: $-calendar-active-color;
        border-radius: $-calendar-active-border;
      }
    }

    // 最后一行
    @include when(last-row) {
      margin-bottom: 0;
    }
  }

  // 月份文字样式
  @include e(month-text) {
    width: $-calendar-month-width;
    margin: 0 auto;
    text-align: center;
  }

  // 月份顶部信息
  @include e(month-top) {
    position: absolute;
    top: 20rpx;
    left: 0;
    right: 0;
    line-height: 1.1;
    font-size: $-calendar-info-fs;
    text-align: center;
  }

  // 月份底部信息
  @include e(month-bottom) {
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
