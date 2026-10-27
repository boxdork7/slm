// 日期处理
import { isDate } from './util'

/**
 * Dayjs 类 - 轻量级日期处理库
 * 提供日期解析、格式化、计算等功能
 */
class Dayjs {
  /** 是否为 UTC 时间 */
  utc: boolean
  /** 内部日期对象 */
  date: Date
  /** 时区偏移（小时） */
  timeZone: number
  /** 时区字符串表示 */
  timeZoneString: any
  /** 缓存的年份 */
  mYear: any
  /** 缓存的月份（0-11） */
  mMonth: any
  /** 缓存的日期 */
  mDay: any
  /** 缓存的星期（0-6，0为周日） */
  mWeek: any
  /** 缓存的小时 */
  mHour: any
  /** 缓存的分钟 */
  mMinute: any
  /** 缓存的秒数 */
  mSecond: any

  /**
   * 构造函数
   * @param dateStr 可选的日期字符串、数字时间戳或 Date 对象
   */
  constructor(dateStr?: string | number | Date) {
    // 默认不使用 UTC 时间
    this.utc = false

    // 解析输入的日期配置
    const parsedDate = this.parseConfig(dateStr)
    this.date = new Date(parsedDate)

    // 计算时区信息
    this.timeZone = this.date.getTimezoneOffset() / 60
    // 格式化时区字符串，例如：+0800
    this.timeZoneString = this.padNumber(
      String(-1 * this.timeZone).replace(/^(.)?(\d)/, '$10$200'),
      5,
      '+',
    )

    // 缓存各个时间组件，提高访问性能
    this.mYear = this.date.getFullYear()
    this.mMonth = this.date.getMonth()
    this.mDay = this.date.getDate()
    this.mWeek = this.date.getDay()
    this.mHour = this.date.getHours()
    this.mMinute = this.date.getMinutes()
    this.mSecond = this.date.getSeconds()
  }

  /**
   * 解析日期配置参数
   * @param dateStr 输入的日期参数
   * @returns 解析后的日期值
   */
  parseConfig(dateStr?: string | number | Date) {
    // 如果没有参数，返回当前时间
    if (!dateStr) return new Date()

    // 如果已经是 Date 对象，直接返回
    if (isDate(dateStr)) return dateStr

    // 处理 8 位数字格式的日期字符串（如：20231225）
    if (/^\d{8}$/.test(dateStr as string)) {
      this.utc = true
      // 将 YYYYMMDD 格式转换为 YYYY-MM-DD 格式
      return `${(dateStr as string).substring(0, 4)}-${(dateStr as string).substring(4, 2)}-${(dateStr as string).substring(6, 2)}`
    }

    // 其他情况直接返回原值
    return dateStr
  }

  /**
   * 数字补零填充
   * @param num 要填充的数字字符串
   * @param length 目标长度
   * @param padChar 填充字符
   * @returns 填充后的字符串
   */
  padNumber(num: string, length: number, padChar: string) {
    return !num || num.length >= length
      ? num
      : `${Array.from({ length: length + 1 - num.length }).join(padChar)}${num}`
  }

  /**
   * 获取年份
   * @returns 年份数值
   */
  year() {
    return this.mYear
  }

  /**
   * 获取月份
   * @returns 月份数值（0-11）
   */
  month() {
    return this.mMonth
  }

  /**
   * 获取 Unix 时间戳（秒）
   * @returns Unix 时间戳
   */
  unix() {
    // 如果是 UTC 时间，需要调整时区偏移
    const timeZoneOffset = this.utc ? 60 * this.timeZone * 60 * 1000 : 0
    return Math.floor((this.date.getTime() + timeZoneOffset) / 1000)
  }

  /**
   * 转换为 UTC 字符串
   * @returns UTC 格式的日期字符串
   */
  toString() {
    return this.date.toUTCString()
  }

  /**
   * 获取指定单位的开始时间
   * @param unit 时间单位（'year' | 'month'）
   * @returns 新的 Dayjs 实例
   */
  startOf(unit: string) {
    switch (unit) {
      case 'year':
        // 返回当年第一天
        return new Dayjs(new Date(this.year(), 0, 1))
      case 'month':
        // 返回当月第一天
        return new Dayjs(new Date(this.year(), this.month(), 1))
      default:
        // 不支持的单位直接返回当前实例
        return this
    }
  }

  /**
   * 增加指定时间
   * @param amount 要增加的数量
   * @param unit 时间单位
   * @returns 新的 Dayjs 实例
   */
  add(amount: number, unit: string) {
    let interval

    // 根据单位计算秒数间隔
    switch (unit) {
      case 'm':
      case 'minutes':
        interval = 60 // 1分钟 = 60秒
        break
      case 'h':
      case 'hours':
        interval = 60 * 60 // 1小时 = 3600秒
        break
      case 'd':
      case 'days':
        interval = 24 * 60 * 60 // 1天 = 86400秒
        break
      case 'w':
      case 'weeks':
        interval = 7 * 24 * 60 * 60 // 1周 = 604800秒
        break
      default:
        interval = 1 // 默认为秒
    }

    // 计算新的时间戳并创建新实例
    const newUnixTime = this.unix() + amount * interval
    return new Dayjs(1000 * newUnixTime) // 转换为毫秒
  }

  /**
   * 减少指定时间
   * @param amount 要减少的数量
   * @param unit 时间单位
   * @returns 新的 Dayjs 实例
   */
  subtract(amount: number, unit: string) {
    // 通过 add 负数来实现减法
    return this.add(-1 * amount, unit)
  }

  /**
   * 格式化日期为字符串
   * @param formatStr 格式化字符串，默认为 ISO 格式
   * @returns 格式化后的日期字符串
   *
   * 支持的格式标记：
   * - YY: 两位年份
   * - YYYY: 四位年份
   * - M: 月份（1-12）
   * - MM: 两位月份（01-12）
   * - D: 日期（1-31）
   * - DD: 两位日期（01-31）
   * - d: 星期数字（0-6）
   * - dddd: 星期全名
   * - H: 小时（0-23）
   * - HH: 两位小时（00-23）
   * - m: 分钟（0-59）
   * - mm: 两位分钟（00-59）
   * - s: 秒数（0-59）
   * - ss: 两位秒数（00-59）
   * - Z: 时区偏移（+08:00）
   * - ZZ: 时区偏移（+0800）
   */
  format(formatStr = 'YYYY-MM-DDTHH:mm:ssZ') {
    // 星期名称数组
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    // 使用正则表达式替换格式标记
    return formatStr.replace(
      /Y{2,4}|M{1,2}|D{1,2}|d{1,4}|H{1,2}|m{1,2}|s{1,2}|Z{1,2}/g,
      (match) => {
        switch (match) {
          case 'YY':
            return String(this.mYear).slice(-2) // 取年份后两位
          case 'YYYY':
            return String(this.mYear)
          case 'M':
            return String(this.mMonth + 1) // 月份从0开始，需要+1
          case 'MM':
            return this.padNumber(String(this.mMonth + 1), 2, '0')
          case 'D':
            return String(this.mDay)
          case 'DD':
            return this.padNumber(String(this.mDay), 2, '0')
          case 'd':
            return String(this.mWeek)
          case 'dddd':
            return weekdays[this.mWeek] // 返回星期全名
          case 'H':
            return String(this.mHour)
          case 'HH':
            return this.padNumber(String(this.mHour), 2, '0')
          case 'm':
            return String(this.mMinute)
          case 'mm':
            return this.padNumber(String(this.mMinute), 2, '0')
          case 's':
            return String(this.mSecond)
          case 'ss':
            return this.padNumber(String(this.mSecond), 2, '0')
          case 'Z':
            // 时区格式：+08:00
            return `${this.timeZoneString.slice(0, -2)}:00`
          case 'ZZ':
            // 时区格式：+0800
            return this.timeZoneString
          default:
            return match // 不匹配的字符原样返回
        }
      },
    )
  }
}

/**
 * 工厂函数，创建 Dayjs 实例
 * @param dateStr 可选的日期字符串、数字时间戳或 Date 对象
 * @returns Dayjs 实例
 *
 * @example
 * // 创建当前时间
 * const now = dayjs()
 *
 * // 从字符串创建
 * const date1 = dayjs('2023-12-25')
 *
 * // 从时间戳创建
 * const date2 = dayjs(1703462400000)
 *
 * // 从 Date 对象创建
 * const date3 = dayjs(new Date())
 */
export function dayjs(dateStr?: string | number | Date) {
  return new Dayjs(dateStr)
}
