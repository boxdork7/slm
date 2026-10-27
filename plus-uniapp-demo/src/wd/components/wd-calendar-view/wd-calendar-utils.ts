import { computed } from 'vue'
import { dayjs } from '../common/dayjs'
import { isArray, isFunction, padZero } from '../common/util'
import { useTranslate } from '../composables/useTranslate'
import type {
  CalendarDayType,
  CalendarItem,
  CalendarTimeFilter,
  CalendarType,
} from './wd-calendar-view.vue'

const { translate } = useTranslate('calendar-view')

/**
 * 星期标签的计算属性
 * 返回包含星期日到星期六的翻译标签数组
 */
const weeks = computed(() => {
  return [
    translate('weeks.sun'),
    translate('weeks.mon'),
    translate('weeks.tue'),
    translate('weeks.wed'),
    translate('weeks.thu'),
    translate('weeks.fri'),
    translate('weeks.sat'),
  ]
})

/**
 * 比较两个时间戳的日期是否相等
 * @param {number} date1 - 第一个时间戳
 * @param {number | null} date2 - 第二个时间戳，可为null
 * @returns {number} 返回比较结果：0相等，1大于，-1小于
 */
export const compareDate = (date1: number, date2: number | null): number => {
  const dateValue1 = new Date(date1)
  const dateValue2 = new Date(date2 || '')

  const year1 = dateValue1.getFullYear()
  const year2 = dateValue2.getFullYear()
  const month1 = dateValue1.getMonth()
  const month2 = dateValue2.getMonth()
  const day1 = dateValue1.getDate()
  const day2 = dateValue2.getDate()

  if (year1 === year2) {
    if (month1 === month2) {
      return day1 === day2 ? 0 : day1 > day2 ? 1 : -1
    }
    return month1 === month2 ? 0 : month1 > month2 ? 1 : -1
  }

  return year1 > year2 ? 1 : -1
}

/**
 * 判断日历类型是否为范围选择模式
 * @param {CalendarType} type - 日历类型
 * @returns {boolean} 是否为范围选择模式
 */
export const isRange = (type: CalendarType): boolean => {
  return type.indexOf('range') > -1
}

/**
 * 比较两个时间戳的月份是否相等
 * @param {number} date1 - 第一个时间戳
 * @param {number} date2 - 第二个时间戳
 * @returns {number} 返回比较结果：0相等，1大于，-1小于
 */
export const compareMonth = (date1: number, date2: number): number => {
  const dateValue1 = new Date(date1)
  const dateValue2 = new Date(date2)

  const year1 = dateValue1.getFullYear()
  const year2 = dateValue2.getFullYear()
  const month1 = dateValue1.getMonth()
  const month2 = dateValue2.getMonth()

  if (year1 === year2) {
    return month1 === month2 ? 0 : month1 > month2 ? 1 : -1
  }

  return year1 > year2 ? 1 : -1
}

/**
 * 比较两个时间戳的年份是否一致
 * @param {number} date1 - 第一个时间戳
 * @param {number} date2 - 第二个时间戳
 * @returns {number} 返回比较结果：0相等，1大于，-1小于
 */
export const compareYear = (date1: number, date2: number): number => {
  const dateValue1 = new Date(date1)
  const dateValue2 = new Date(date2)

  const year1 = dateValue1.getFullYear()
  const year2 = dateValue2.getFullYear()

  return year1 === year2 ? 0 : year1 > year2 ? 1 : -1
}

/**
 * 获取指定年月的最后一天的日期
 * @param {number} year - 年份
 * @param {number} month - 月份（1-12）
 * @returns {number} 该月的最后一天日期
 */
export const getMonthEndDay = (year: number, month: number): number => {
  return 32 - new Date(year, month - 1, 32).getDate()
}

/**
 * 格式化时间戳为年月标题
 * @param {number} date - 时间戳
 * @returns {string} 格式化后的年月标题
 */
export const formatMonthTitle = (date: number): string => {
  return dayjs(date).format(translate('monthTitle'))
}

/**
 * 根据索引获取对应的星期标签
 * @param {number} index - 星期索引（0-6，0表示星期日）
 * @returns {string} 星期标签
 */
export const getWeekLabel = (index: number): string => {
  if (index >= 7) {
    index = index % 7
  }

  return weeks.value[index]
}

/**
 * 格式化时间戳为年份标题
 * @param {number} date - 时间戳
 * @returns {string} 格式化后的年份标题
 */
export const formatYearTitle = (date: number): string => {
  return dayjs(date).format(translate('yearTitle'))
}

/**
 * 根据最小日期和最大日期获取这之间的所有月份时间戳数组
 * @param {number} minDate - 最小日期时间戳
 * @param {number} maxDate - 最大日期时间戳
 * @returns {number[]} 月份时间戳数组
 */
export const getMonths = (minDate: number, maxDate: number): number[] => {
  const months: number[] = []
  const month = new Date(minDate)
  month.setDate(1)

  while (compareMonth(month.getTime(), maxDate) < 1) {
    months.push(month.getTime())
    month.setMonth(month.getMonth() + 1)
  }

  return months
}

/**
 * 根据最小日期和最大日期获取这之间的所有年份时间戳数组
 * @param {number} minDate - 最小日期时间戳
 * @param {number} maxDate - 最大日期时间戳
 * @returns {number[]} 年份时间戳数组
 */
export const getYears = (minDate: number, maxDate: number): number[] => {
  const years: number[] = []
  const year = new Date(minDate)
  year.setMonth(0)
  year.setDate(1)

  while (compareYear(year.getTime(), maxDate) < 1) {
    years.push(year.getTime())
    year.setFullYear(year.getFullYear() + 1)
  }

  return years
}

/**
 * 获取指定日期所在周的第一天和最后一天时间戳
 * @param {number} date - 目标日期时间戳
 * @param {number} firstDayOfWeek - 一周的第一天索引（0-6，0表示星期日）
 * @returns {[number, number]} [周开始时间戳, 周结束时间戳]
 */
export const getWeekRange = (date: number, firstDayOfWeek: number): [number, number] => {
  if (firstDayOfWeek >= 7) {
    firstDayOfWeek = firstDayOfWeek % 7
  }

  const dateValue = new Date(date)
  dateValue.setHours(0, 0, 0, 0)
  const year = dateValue.getFullYear()
  const month = dateValue.getMonth()
  const day = dateValue.getDate()
  const week = dateValue.getDay()

  const weekStart = new Date(year, month, day - ((7 + week - firstDayOfWeek) % 7))
  const weekEnd = new Date(year, month, day + 6 - ((7 + week - firstDayOfWeek) % 7))

  return [weekStart.getTime(), weekEnd.getTime()]
}

/**
 * 计算两个日期之间的天数差
 * @param {number} date1 - 第一个日期时间戳
 * @param {number} date2 - 第二个日期时间戳
 * @returns {number} 天数差（包含当天，所以+1）
 */
export const getDayOffset = (date1: number, date2: number): number => {
  return (date1 - date2) / (24 * 60 * 60 * 1000) + 1
}

/**
 * 根据基准日期和偏移天数获取目标日期时间戳
 * @param {number} date - 基准日期时间戳
 * @param {number} offset - 偏移天数（正数向后，负数向前）
 * @returns {number} 目标日期时间戳
 */
export const getDayByOffset = (date: number, offset: number): number => {
  const dateValue = new Date(date)
  dateValue.setDate(dateValue.getDate() + offset)

  return dateValue.getTime()
}

/**
 * 获取前一天的时间戳
 * @param {number} date - 当前日期时间戳
 * @returns {number} 前一天时间戳
 */
export const getPrevDay = (date: number): number => getDayByOffset(date, -1)

/**
 * 获取后一天的时间戳
 * @param {number} date - 当前日期时间戳
 * @returns {number} 后一天时间戳
 */
export const getNextDay = (date: number): number => getDayByOffset(date, 1)

/**
 * 计算两个日期之间的月份差
 * @param {number} date1 - 第一个日期时间戳
 * @param {number} date2 - 第二个日期时间戳
 * @returns {number} 月份差（包含当月，所以+1）
 */
export const getMonthOffset = (date1: number, date2: number): number => {
  const dateValue1 = new Date(date1)
  const dateValue2 = new Date(date2)

  const year1 = dateValue1.getFullYear()
  const year2 = dateValue2.getFullYear()
  let month1 = dateValue1.getMonth()
  const month2 = dateValue2.getMonth()

  month1 = (year1 - year2) * 12 + month1

  return month1 - month2 + 1
}

/**
 * 根据基准日期和偏移月数获取目标日期时间戳
 * @param {number} date - 基准日期时间戳
 * @param {number} offset - 偏移月数（正数向后，负数向前）
 * @returns {number} 目标日期时间戳
 */
export const getMonthByOffset = (date: number, offset: number): number => {
  const dateValue = new Date(date)
  dateValue.setMonth(dateValue.getMonth() + offset)

  return dateValue.getTime()
}

/**
 * 获取默认时间配置，将字符串或数组格式化为统一的二维数组格式
 * @param {string[] | string | null} defaultTime - 默认时间配置
 * @returns {[number[], number[]]} [开始时间数组, 结束时间数组]，每个时间数组包含[时, 分, 秒]
 */
export const getDefaultTime = (defaultTime: string[] | string | null): [number[], number[]] => {
  if (isArray(defaultTime)) {
    const startTime = (defaultTime[0] || '00:00:00').split(':').map((item: string) => {
      return parseInt(item)
    })
    const endTime = (defaultTime[1] || '00:00:00').split(':').map((item) => {
      return parseInt(item)
    })
    return [startTime, endTime]
  } else {
    const time = (defaultTime || '00:00:00').split(':').map((item) => {
      return parseInt(item)
    })

    return [time, time]
  }
}

/**
 * 根据日期和默认时间配置获取完整的日期时间戳
 * @param {number} date - 基准日期时间戳
 * @param {number[]} defaultTime - 默认时间数组 [时, 分, 秒]
 * @returns {number} 设置了具体时间的日期时间戳
 */
export const getDateByDefaultTime = (date: number, defaultTime: number[]): number => {
  const dateValue = new Date(date)
  dateValue.setHours(defaultTime[0])
  dateValue.setMinutes(defaultTime[1])
  dateValue.setSeconds(defaultTime[2])

  return dateValue.getTime()
}

/**
 * 创建指定长度的数组，并通过迭代函数填充每个元素
 * @param {number} n - 数组长度
 * @param {function} iteratee - 迭代函数，接收索引参数，返回CalendarItem
 * @returns {CalendarItem[]} 填充后的数组
 */
const times = (n: number, iteratee: (index: number) => CalendarItem): CalendarItem[] => {
  let index: number = -1
  const result: CalendarItem[] = Array(n < 0 ? 0 : n)
  while (++index < n) {
    result[index] = iteratee(index)
  }
  return result
}

/**
 * 从时间戳中提取时分秒
 * @param {number} date - 时间戳
 * @returns {[number, number, number]} [时, 分, 秒]
 */
const getTime = (date: number): [number, number, number] => {
  const dateValue = new Date(date)
  return [dateValue.getHours(), dateValue.getMinutes(), dateValue.getSeconds()]
}

/**
 * 根据日期范围和配置获取时间选择器的数据结构
 * @param {Object} params - 参数对象
 * @param {number} params.date - 当前选中的日期时间戳
 * @param {number} params.minDate - 最小可选日期时间戳
 * @param {number} params.maxDate - 最大可选日期时间戳
 * @param {boolean} params.isHideSecond - 是否隐藏秒选择
 * @param {CalendarTimeFilter} [params.filter] - 时间过滤函数
 * @returns {CalendarItem[][]} 时间选择器的列数据，包含时、分、秒（可选）
 */
export const getTimeData = ({
  date,
  minDate,
  maxDate,
  isHideSecond,
  filter,
}: {
  date: number
  minDate: number
  maxDate: number
  isHideSecond: boolean
  filter?: CalendarTimeFilter
}): CalendarItem[][] => {
  const compareMin = compareDate(date, minDate)
  const compareMax = compareDate(date, maxDate)

  let minHour = 0
  let maxHour = 23
  let minMinute = 0
  let maxMinute = 59
  let minSecond = 0
  let maxSecond = 59

  // 如果当前日期等于最小日期，则限制最小时间
  if (compareMin === 0) {
    const minTime = getTime(minDate)
    const currentTime = getTime(date)

    minHour = minTime[0]
    if (minTime[0] === currentTime[0]) {
      minMinute = minTime[1]

      if (minTime[1] === currentTime[1]) {
        minSecond = minTime[2]
      }
    }
  }

  // 如果当前日期等于最大日期，则限制最大时间
  if (compareMax === 0) {
    const maxTime = getTime(maxDate)
    const currentTime = getTime(date)

    maxHour = maxTime[0]
    if (maxTime[0] === currentTime[0]) {
      maxMinute = maxTime[1]

      if (maxTime[1] === currentTime[1]) {
        maxSecond = maxTime[2]
      }
    }
  }

  let columns: CalendarItem[][] = []

  // 构建小时选项
  let hours = times(24, (index) => {
    return {
      label: translate('hour', padZero(index)),
      value: index,
      disabled: index < minHour || index > maxHour,
    }
  })

  // 构建分钟选项
  let minutes = times(60, (index) => {
    return {
      label: translate('minute', padZero(index)),
      value: index,
      disabled: index < minMinute || index > maxMinute,
    }
  })

  let seconds: CalendarItem[] = []

  // 应用过滤器
  if (filter && isFunction(filter)) {
    hours = filter({
      type: 'hour',
      values: hours,
    })
    minutes = filter({
      type: 'minute',
      values: minutes,
    })
  }

  // 如果不隐藏秒，则构建秒选项
  if (!isHideSecond) {
    seconds = times(60, (index) => {
      return {
        label: translate('second', padZero(index)),
        value: index,
        disabled: index < minSecond || index > maxSecond,
      }
    })
    if (filter && isFunction(filter)) {
      seconds = filter({
        type: 'second',
        values: seconds,
      })
    }
  }

  columns = isHideSecond ? [hours, minutes] : [hours, minutes, seconds]

  return columns
}

/**
 * 获取指定日期是当年的第几周
 * @param {number | Date} date - 日期时间戳或Date对象
 * @returns {number} 周数（1-53）
 */
export const getWeekNumber = (date: number | Date): number => {
  date = new Date(date)
  date.setHours(0, 0, 0, 0)
  // 将日期调整到当前周的星期四，星期四决定了该周属于哪一年
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7))
  // 1月4日总是在第1周
  const week = new Date(date.getFullYear(), 0, 4)
  // 调整到第1周的星期四，并计算从该日期到第1周的周数
  // 四舍五入应该适用于夏令时，其偏移不应超过12小时
  return (
    1 +
    Math.round(((date.getTime() - week.getTime()) / 86400000 - 3 + ((week.getDay() + 6) % 7)) / 7)
  )
}

/**
 * 根据月份类型、选中值和日历类型生成日历项的CSS类名
 * @param {CalendarDayType} monthType - 月份类型（当前月、上月、下月等）
 * @param {number | null | (number | null)[]} value - 选中的值
 * @param {CalendarType} type - 日历类型
 * @returns {string} CSS类名字符串
 */
export const getItemClass = (
  monthType: CalendarDayType,
  value: number | null | (number | null)[],
  type: CalendarType,
): string => {
  const classList = ['is-' + monthType]

  // 如果是范围选择且值为数组，检查是否缺少结束日期
  if (type.indexOf('range') > -1 && isArray(value)) {
    if (!value || !value[1]) {
      classList.push('is-without-end')
    }
  }

  return classList.join(' ')
}
