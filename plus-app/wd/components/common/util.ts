/**
 * 通用工具函数库
 *
 * ## 核心类型检查 (基础工具，使用频率最高)
 * - isDef(value) - 判断是否不为null或undefined
 * - isObj(value) - 判断是否为对象
 * - isArray(value) - 判断是否为数组
 * - isString(value) - 判断是否为字符串
 * - isNumber(value) - 判断是否为数值
 * - isFunction(value) - 判断是否为函数
 * - isBoolean(value) - 判断是否为布尔值
 * - isPromise(value) - 判断是否为Promise对象
 * - getType(target) - 获取数据的原始类型
 *
 * ## 扩展类型检查 (特定场景使用)
 * - isUndefined(value) - 判断是否为undefined
 * - isNotUndefined(value) - 判断是否不为undefined
 * - isDate(value) - 判断是否为Date对象
 * - isOdd(value) - 判断是否为奇数
 * - isBase64Image(url) - 判断是否为base64图片
 * - isVideoUrl(url) - 判断是否为视频URL
 * - isImageUrl(url) - 判断是否为图片URL
 *
 * ## 核心对象操作 (数据处理核心)
 * - deepClone(obj) - 深拷贝对象
 * - isEqual(value1, value2) - 深度比较两个值是否相等
 * - deepMerge(target, source) - 深度合并对象
 * - getPropByPath(obj, path) - 根据路径获取对象属性值
 * - hasFields(obj) - 判断对象是否包含字段
 * - isEmptyObj(obj) - 判断是否为空对象
 * - deepAssign(target, source) - 深度合并对象(原地修改)
 * - omitBy(obj, predicate) - 根据条件剔除对象属性
 *
 * ## 字符串处理 (常用工具)
 * - uuid() - 生成32位UUID字符串
 * - addUnit(num) - 为数值自动添加rpx单位
 * - padZero(number, length) - 数字前补零到指定长度
 * - kebabCase(word) - 驼峰转短横线命名
 * - camelCase(word) - 短横线转驼峰命名
 *
 * ## 单位转换 (rpx/px转换)
 * - rpxToPx(rpx) - 将rpx转换为px
 * - pxToRpx(px) - 将px转换为rpx
 *
 * ## 数值处理 (数学计算)
 * - range(num, min, max) - 限制数值在指定范围内
 * - closest(arr, target) - 找到数组中最接近目标值的元素
 * - checkNumRange(num, label) - 检查数值不小于零
 * - checkPixelRange(num, label) - 检查数值大于零
 *
 * ## 异步控制 (性能优化核心)
 * - debounce(func, wait, options) - 防抖函数
 * - throttle(func, wait) - 节流函数
 * - pause(ms) - 暂停指定时间
 * - requestAnimationFrame(cb) - 可中止的动画帧请求
 *
 * ## 样式处理 (UI相关)
 * - objToStyle(styles) - 对象转CSS样式字符串
 * - rgbToHex(r, g, b) - RGB转十六进制颜色
 * - hexToRgb(hex) - 十六进制转RGB数组
 * - gradient(startColor, endColor, step) - 生成渐变色数组
 *
 * ## DOM操作 (框架特定)
 * - getRect(selector, all, scope, useFields) - 获取节点信息
 *
 * ## 网络工具 (API相关)
 * - buildUrlWithParams(baseUrl, params) - 构建带参数的URL
 *
 * ## 动画工具 (动效相关)
 * - easingFn(t, b, c, d) - 缓动函数
 *
 * ## 组件工具 (框架特定)
 * - defaultDisplayFormat(items, kv) - picker组件默认格式化函数
 * - defaultFunction(value) - 默认函数占位符
 *
 * ## 环境检测 (配置相关)
 * - isH5 - 判断是否为H5环境
 * - context.id - 全局ID计数器
 */

import { AbortablePromise } from './AbortablePromise'

/** 排除undefined类型的工具类型 */
type NotUndefined<T> = T extends undefined ? never : T

/** 防抖函数配置选项 */
interface DebounceOptions {
  /** 是否在延迟时间开始时调用函数 */
  leading?: boolean
  /** 是否在延迟时间结束时调用函数 */
  trailing?: boolean
}

/** 获取节点信息的返回类型 */
export type RectResultType<T extends boolean> = T extends true ? UniApp.NodeInfo[] : UniApp.NodeInfo

// ============================================================================
// 核心类型检查 (基础工具，使用频率最高)
// ============================================================================

/**
 * 检查值是否不为空（不为null或undefined）
 * @param value 值
 * @returns 是否不为空
 */
export const isDef = <T>(value: T): value is NonNullable<T> => value !== undefined && value !== null

/**
 * 判断target是否为对象
 * @param value 要检查的值
 * @returns 是否为对象类型
 */
export const isObj = (value: any): value is object => {
  return Object.prototype.toString.call(value) === '[object Object]' || typeof value === 'object'
}

/**
 * 检查给定值是否为数组
 * @param value 要检查的值
 * @returns 如果是数组则返回true，否则返回false
 */
export const isArray = (value: any): value is Array<any> => {
  if (typeof Array.isArray === 'function') {
    return Array.isArray(value)
  }
  return Object.prototype.toString.call(value) === '[object Array]'
}

/**
 * 获取目标原始类型
 * @param target 任意类型的值
 * @returns 类型字符串（小写）
 *
 * @example
 * ```typescript
 * getType([]) // 'array'
 * getType({}) // 'object'
 * getType('') // 'string'
 * getType(null) // 'null'
 * ```
 */
export const getType = (target: unknown): string => {
  const typeStr = Object.prototype.toString.call(target)
  const match = typeStr.match(/\[object (\w+)\]/)
  return match && match.length ? match[1].toLowerCase() : ''
}

/**
 * 检查给定值是否为字符串
 * @param value 要检查的值
 * @returns 如果是字符串则返回true，否则返回false
 */
export const isString = (value: unknown): value is string => {
  return getType(value) === 'string'
}

/**
 * 检查给定值是否为数值
 * @param value 要检查的值
 * @returns 如果是数值则返回true，否则返回false
 */
export const isNumber = (value: any): value is number => {
  return getType(value) === 'number'
}

/**
 * 检查给定值是否为函数
 * @param value 要检查的值
 * @returns 如果是函数则返回true，否则返回false
 */
export const isFunction = <T extends (...args: any[]) => any>(value: any): value is T => {
  return getType(value) === 'function' || getType(value) === 'asyncfunction'
}

/**
 * 检查给定值是否为布尔类型
 * @param value 要检查的值
 * @returns 如果值为布尔类型，则返回true，否则返回false
 */
export const isBoolean = (value: any): value is boolean => {
  return typeof value === 'boolean'
}

/**
 * 检查给定值是否为Promise对象
 * @param value 要检查的值
 * @returns 如果是Promise对象则返回true，否则返回false
 */
export const isPromise = (value: unknown): value is Promise<any> => {
  if (isObj(value) && isDef(value)) {
    return isFunction((value as Promise<any>).then) && isFunction((value as Promise<any>).catch)
  }
  return false
}

// ============================================================================
// 扩展类型检查 (特定场景使用)
// ============================================================================

/**
 * 检查给定值是否为undefined
 * @param value 要检查的值
 * @returns 如果值为undefined，则返回true，否则返回false
 */
export const isUndefined = (value: any): value is undefined => {
  return typeof value === 'undefined'
}

/**
 * 检查给定值是否不为undefined
 * @param value 要检查的值
 * @returns 如果值不为undefined，则返回true，否则返回false
 */
export const isNotUndefined = <T>(value: T): value is NotUndefined<T> => {
  return !isUndefined(value)
}

/**
 * 检查一个值是否为Date类型
 * @param val 要检查的值
 * @returns 如果值是Date类型，则返回true，否则返回false
 */
export const isDate = (val: unknown): val is Date =>
  Object.prototype.toString.call(val) === '[object Date]' && !Number.isNaN((val as Date).getTime())

/**
 * 检查给定的值是否为奇数
 * @param value 要检查的值
 * @returns 如果是奇数返回true，否则返回false
 */
export const isOdd = (value: number): boolean => {
  if (typeof value !== 'number') {
    throw new TypeError('输入必须为数字')
  }
  return value % 2 === 1
}

/**
 * 是否为base64图片
 * @param url 图片URL
 * @returns 是否为base64图片
 */
export const isBase64Image = (url: string): boolean => {
  return /^data:image\/(?:png|jpg|jpeg|gif|bmp);base64,/.test(url)
}

/**
 * 检查提供的URL是否为视频链接
 * @param url 需要检查的URL字符串
 * @returns 返回一个布尔值，如果URL是视频链接则为true，否则为false
 */
export const isVideoUrl = (url: string): boolean => {
  const videoRegex = /\.(?:mp4|mpg|mpeg|dat|asf|avi|rmvb?|mov|wmv|flv|mkv|video)$/i
  return videoRegex.test(url)
}

/**
 * 检查提供的URL是否为图片URL
 * @param url 待检查的URL字符串
 * @returns 返回一个布尔值，如果URL是图片格式，则为true；否则为false
 */
export const isImageUrl = (url: string): boolean => {
  const imageRegex = /\.(?:jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg|image)/i
  return imageRegex.test(url)
}

// ============================================================================
// 核心对象操作 (数据处理核心)
// ============================================================================

/**
 * 深拷贝函数，用于将对象进行完整复制
 * @param obj 要深拷贝的对象
 * @param cache 用于缓存已复制的对象，防止循环引用
 * @returns 深拷贝后的对象副本
 */
export const deepClone = <T>(obj: T, cache: Map<any, any> = new Map()): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (isDate(obj)) {
    return new Date(obj.getTime()) as any
  }
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags) as any
  }
  if (obj instanceof Error) {
    const errorCopy = new Error(obj.message) as any
    errorCopy.stack = obj.stack
    return errorCopy
  }

  if (cache.has(obj)) {
    return cache.get(obj)
  }

  const copy: any = Array.isArray(obj) ? [] : {}
  cache.set(obj, copy)

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copy[key] = deepClone(obj[key], cache)
    }
  }

  return copy as T
}

/**
 * 比较两个值是否相等
 * @param value1 第一个值
 * @param value2 第二个值
 * @returns 如果值相等则为true，否则为false
 */
export const isEqual = (value1: any, value2: any): boolean => {
  if (value1 === value2) {
    return true
  }

  if (!Array.isArray(value1) || !Array.isArray(value2)) {
    return false
  }

  if (value1.length !== value2.length) {
    return false
  }

  for (let i = 0; i < value1.length; ++i) {
    if (value1[i] !== value2[i]) {
      return false
    }
  }

  return true
}

/**
 * 深度合并两个对象
 * @param target 目标对象
 * @param source 源对象
 * @returns 合并后的新对象
 */
export const deepMerge = <T extends Record<string, any>>(
  target: T,
  source: Record<string, any>,
): T => {
  if (target == null || source == null) {
    throw new TypeError('Target and source cannot be null or undefined.')
  }

  if (typeof target !== 'object' || typeof source !== 'object') {
    throw new TypeError('Both target and source must be objects.')
  }

  const result = deepClone(target)

  for (const key of Object.keys(source)) {
    const sourceValue = source[key]
    const targetValue = (result as Record<string, any>)[key]

    if (
      sourceValue !== null &&
      typeof sourceValue === 'object' &&
      Object.prototype.toString.call(sourceValue) === '[object Object]' &&
      targetValue !== null &&
      typeof targetValue === 'object' &&
      Object.prototype.toString.call(targetValue) === '[object Object]'
    ) {
      ;(result as Record<string, any>)[key] = deepMerge(targetValue, sourceValue)
    } else {
      ;(result as Record<string, any>)[key] = sourceValue
    }
  }

  return result
}

/**
 * 根据属性路径获取对象中的属性值
 * @param obj 目标对象
 * @param path 属性路径，可以是字符串或字符串数组
 * @returns 属性值，如果属性不存在或中间的属性为null或undefined，则返回undefined
 */
export const getPropByPath = (obj: any, path: string): any => {
  const keys: string[] = path.split('.')

  try {
    return keys.reduce(
      (acc: any, key: string) => (acc !== undefined && acc !== null ? acc[key] : undefined),
      obj,
    )
  } catch (error) {
    return undefined
  }
}

/**
 * 判断一个对象是否包含任何字段
 * @param obj 要检查的对象
 * @returns 如果对象包含字段则返回true，否则返回false
 */
export const hasFields = (obj: unknown): boolean => {
  if (!isObj(obj) || obj === null) {
    return false
  }
  return Object.keys(obj).length > 0
}

/**
 * 判断一个对象是否为空对象（不包含任何字段）
 * @param obj 要检查的对象
 * @returns 如果对象为空（不包含任何字段）则返回true，否则返回false
 */
export const isEmptyObj = (obj: unknown): boolean => {
  return !hasFields(obj)
}

/**
 * 深度合并两个对象（原地修改）
 * @param target 目标对象
 * @param source 源对象
 * @returns 合并后的目标对象
 */
export const deepAssign = (
  target: Record<string, any>,
  source: Record<string, any>,
): Record<string, any> => {
  Object.keys(source).forEach((key) => {
    const targetValue = target[key]
    const newObjValue = source[key]
    if (isObj(targetValue) && isObj(newObjValue)) {
      deepAssign(targetValue, newObjValue)
    } else {
      target[key] = newObjValue
    }
  })
  return target
}

/**
 * 剔除对象中的某些属性
 * @param obj 源对象
 * @param predicate 判断函数
 * @returns 剔除后的新对象
 */
export const omitBy = <O extends Record<string, any>>(
  obj: O,
  predicate: (value: any, key: keyof O) => boolean,
): Partial<O> => {
  const newObj = deepClone(obj)
  Object.keys(newObj).forEach((key) => predicate(newObj[key], key) && delete newObj[key])
  return newObj
}

// ============================================================================
// 字符串处理 (常用工具)
// ============================================================================

/**
 * 生成4位十六进制随机数
 * @returns 4位十六进制字符串
 */
const s4 = (): string => {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1)
}

/**
 * 生成UUID字符串
 * @returns 32位UUID字符串
 *
 * @example
 * ```typescript
 * const id = uuid() // 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'
 * ```
 */
export const uuid = (): string => {
  return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4()
}

/**
 * 自动为数值添加单位
 * @param num 数值或字符串
 * @param unit 单位，默认为 'rpx'
 * @returns 带单位的字符串
 *
 * @example
 * ```typescript
 * addUnit(10) // '10rpx'
 * addUnit(10, 'px') // '10px'
 * addUnit(10, 'rem') // '10rem'
 * addUnit(10, '%') // '10%'
 * addUnit('10%') // '10%'
 * addUnit('auto') // 'auto'
 * addUnit(0) // '0' (数值0不添加单位)
 * ```
 */
export const addUnit = (num: number | string, unit: string = 'rpx'): string => {
  // 如果不是数字，直接返回原值
  if (Number.isNaN(Number(num))) {
    return `${num}`
  }

  // 如果是数值0，直接返回'0'（CSS中0不需要单位）
  if (Number(num) === 0) {
    return '0'
  }

  return `${num}${unit}`
}

/**
 * 在数字前补零，使其达到指定长度
 * @param number 要补零的数字
 * @param length 目标长度，默认为2
 * @returns 补零后的结果
 */
export const padZero = (number: number | string, length: number = 2): string => {
  let numStr: string = number.toString()

  while (numStr.length < length) {
    numStr = `0${numStr}`
  }

  return numStr
}

/**
 * 将驼峰命名转换为短横线命名
 * @param word 待转换的词条
 * @returns 转换后的结果
 */
export const kebabCase = (word: string): string => {
  return word
    .replace(/[A-Z]/g, (match) => {
      return `-${match}`
    })
    .toLowerCase()
}

/**
 * 将短横线链接转换为驼峰命名
 * @param word 需要转换的短横线链接
 * @returns 转换后的驼峰命名字符串
 */
export const camelCase = (word: string): string => {
  return word.replace(/-(\w)/g, (_, c) => c.toUpperCase())
}

// ============================================================================
// 单位转换 (rpx/px转换)
// ============================================================================

/**
 * 将 rpx 转换为 px
 * @param rpx rpx 值
 * @returns px 值
 *
 * @example
 * ```typescript
 * rpxToPx(100) // 在750px宽度的设备上返回 50
 * rpxToPx(750) // 在750px宽度的设备上返回 375
 * ```
 */
export const rpxToPx = (rpx: number): number => {
  const systemInfo = uni.getSystemInfoSync()
  const screenWidth = systemInfo.screenWidth || 375
  return (rpx / 750) * screenWidth
}

/**
 * 将 px 转换为 rpx
 * @param px px 值
 * @returns rpx 值
 *
 * @example
 * ```typescript
 * pxToRpx(50) // 在375px宽度的设备上返回 100
 * pxToRpx(375) // 在375px宽度的设备上返回 750
 * ```
 */
export const pxToRpx = (px: number): number => {
  const systemInfo = uni.getSystemInfoSync()
  const screenWidth = systemInfo.screenWidth || 375
  return (px / screenWidth) * 750
}

// ============================================================================
// 数值处理 (数学计算)
// ============================================================================

/**
 * 确保数值不超出指定范围
 * @param num 要限制范围的数值
 * @param min 最小范围
 * @param max 最大范围
 * @returns 在指定范围内的数值
 */
export const range = (num: number, min: number, max: number): number => {
  return Math.min(Math.max(num, min), max)
}

/**
 * 从数组中寻找最接近目标值的元素
 * @param arr 数组
 * @param target 目标值
 * @returns 最接近目标值的元素
 */
export const closest = (arr: number[], target: number): number => {
  return arr.reduce((prev, curr) =>
    Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev,
  )
}

/**
 * 防止数字小于零
 * @param num 数字
 * @param label 标签
 */
export const checkNumRange = (num: number, label: string = 'value'): void => {
  if (num < 0) {
    throw new Error(`${label} shouldn't be less than zero`)
  }
}

/**
 * 防止pixel无意义
 * @param num 数字
 * @param label 标签
 */
export const checkPixelRange = (num: number, label: string = 'value'): void => {
  if (num <= 0) {
    throw new Error(`${label} should be greater than zero`)
  }
}

// ============================================================================
// 异步控制 (性能优化核心)
// ============================================================================

/**
 * 防抖函数，在指定时间内如果函数被多次调用，只执行最后一次
 * @param func 要防抖的函数
 * @param wait 等待时间（毫秒）
 * @param options 配置选项
 * @returns 防抖后的函数
 *
 * @example
 * ```typescript
 * const debouncedFn = debounce((value: string) => {
 *   console.log('搜索:', value)
 * }, 300)
 *
 * // 在300ms内多次调用，只有最后一次会执行
 * debouncedFn('a')
 * debouncedFn('ab')
 * debouncedFn('abc') // 只有这次会执行
 * ```
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: DebounceOptions = {},
): T => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let lastArgs: any[] | undefined
  let lastThis: any
  let result: ReturnType<T> | undefined
  const leading = isDef(options.leading) ? options.leading : false
  const trailing = isDef(options.trailing) ? options.trailing : true

  const invokeFunc = (): void => {
    if (lastArgs !== undefined) {
      result = func.apply(lastThis, lastArgs)
      lastArgs = undefined
    }
  }

  const startTimer = (): void => {
    timeoutId = setTimeout(() => {
      timeoutId = null
      if (trailing) {
        invokeFunc()
      }
    }, wait)
  }

  const cancelTimer = (): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  const debounced = function (this: any, ...args: Parameters<T>): ReturnType<T> | undefined {
    lastArgs = args
    // eslint-disable-next-line ts/no-this-alias
    lastThis = this

    if (timeoutId === null) {
      if (leading) {
        invokeFunc()
      }
      startTimer()
    } else if (trailing) {
      cancelTimer()
      startTimer()
    }

    return result
  }

  return debounced as T
}

/**
 * 节流函数，在指定时间内最多执行一次函数
 * @param func 要节流的函数
 * @param wait 等待时间（毫秒）
 * @returns 节流后的函数
 *
 * @example
 * ```typescript
 * const throttledFn = throttle((e: Event) => {
 *   console.log('滚动事件', e)
 * }, 100)
 *
 * // 绑定到滚动事件，100ms内最多执行一次
 * window.addEventListener('scroll', throttledFn)
 * ```
 */
// eslint-disable-next-line ts/no-unsafe-function-type
export const throttle = (func: Function, wait: number): Function => {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let previous: number = 0

  const throttled = function (this: any, ...args: any[]) {
    const now = Date.now()
    const remaining = wait - (now - previous)

    if (remaining <= 0) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      func.apply(this, args)
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now()
        timeout = null
        func.apply(this, args)
      }, remaining)
    }
  }

  return throttled
}

/**
 * 暂停指定时间函数
 * @param ms 延迟时间，默认为1000/30毫秒
 * @returns 可中止的Promise
 */
export const pause = (ms: number = 1000 / 30): AbortablePromise<boolean> => {
  return new AbortablePromise((resolve) => {
    const timer = setTimeout(() => {
      clearTimeout(timer)
      resolve(true)
    }, ms)
  })
}

/**
 * 请求动画帧的AbortablePromise包装
 * @param cb 回调函数
 * @returns 可中止的Promise
 */
export const requestAnimationFrame = (cb = () => {}): AbortablePromise<boolean> => {
  return new AbortablePromise((resolve) => {
    const timer = setInterval(() => {
      clearInterval(timer)
      resolve(true)
      cb()
    }, 1000 / 30)
  })
}

// ============================================================================
// 样式处理 (UI相关)
// ============================================================================

/**
 * 将外部传入的样式格式化为可读的CSS样式
 * @param styles 外部传入的样式对象或数组
 * @returns 格式化后的CSS样式字符串
 */
export const objToStyle = (styles: Record<string, any> | Record<string, any>[]): string => {
  if (isArray(styles)) {
    const result = styles
      .filter((item) => {
        return item != null && item !== ''
      })
      .map((item) => {
        return objToStyle(item)
      })
      .join(';')

    return result ? (result.endsWith(';') ? result : `${result};`) : ''
  }

  if (isString(styles)) {
    return styles ? (styles.endsWith(';') ? styles : `${styles};`) : ''
  }

  if (isObj(styles)) {
    const result = Object.keys(styles)
      .filter((key) => {
        return styles[key] != null && styles[key] !== ''
      })
      .map((key) => {
        return [kebabCase(key), styles[key]].join(':')
      })
      .join(';')

    return result ? (result.endsWith(';') ? result : `${result};`) : ''
  }
  return ''
}

/**
 * 将RGB值转换为十六进制颜色代码
 * @param r 红色分量 (0-255)
 * @param g 绿色分量 (0-255)
 * @param b 蓝色分量 (0-255)
 * @returns 十六进制颜色代码 (#RRGGBB)
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  const hex = ((r << 16) | (g << 8) | b).toString(16)
  return `#${'0'.repeat(Math.max(0, 6 - hex.length))}${hex}`
}

/**
 * 将十六进制颜色代码转换为RGB颜色数组
 * @param hex 十六进制颜色代码（例如：'#RRGGBB'）
 * @returns 包含红、绿、蓝三个颜色分量的数组
 */
export const hexToRgb = (hex: string): number[] => {
  const rgb: number[] = []

  for (let i = 1; i < 7; i += 2) {
    rgb.push(Number.parseInt(`0x${hex.slice(i, i + 2)}`, 16))
  }

  return rgb
}

/**
 * 计算渐变色的中间变量数组
 * @param startColor 开始颜色
 * @param endColor 结束颜色
 * @param step 获取渲染位置，默认为中间位置
 * @returns 渐变色中间颜色变量数组
 */
export const gradient = (startColor: string, endColor: string, step: number = 2): string[] => {
  const sColor: number[] = hexToRgb(startColor)
  const eColor: number[] = hexToRgb(endColor)

  const rStep: number = (eColor[0] - sColor[0]) / step
  const gStep: number = (eColor[1] - sColor[1]) / step
  const bStep: number = (eColor[2] - sColor[2]) / step

  const gradientColorArr: string[] = []
  for (let i = 0; i < step; i++) {
    gradientColorArr.push(
      rgbToHex(
        Number.parseInt(String(rStep * i + sColor[0])),
        Number.parseInt(String(gStep * i + sColor[1])),
        Number.parseInt(String(bStep * i + sColor[2])),
      ),
    )
  }
  return gradientColorArr
}

// ============================================================================
// DOM操作 (框架特定)
// ============================================================================

/**
 * 获取节点信息
 * @param selector 节点选择器 #id,.class
 * @param all 是否返回所有selector对应的节点
 * @param scope 作用域（支付宝小程序无效）
 * @param useFields 是否使用fields方法获取节点信息
 * @returns 节点信息或节点信息数组
 */
export const getRect = <T extends boolean>(
  selector: string,
  all: T,
  scope?: any,
  useFields?: boolean,
): Promise<RectResultType<T>> => {
  return new Promise<RectResultType<T>>((resolve, reject) => {
    let query: UniNamespace.SelectorQuery | null = null
    if (scope) {
      query = uni.createSelectorQuery().in(scope)
    } else {
      query = uni.createSelectorQuery()
    }

    const method = all ? 'selectAll' : 'select'

    const callback = (rect: UniApp.NodeInfo | UniApp.NodeInfo[]) => {
      if (all && isArray(rect) && rect.length > 0) {
        resolve(rect as RectResultType<T>)
      } else if (!all && rect) {
        resolve(rect as RectResultType<T>)
      } else {
        reject(new Error('No nodes found'))
      }
    }

    if (useFields) {
      query[method](selector).fields({ size: true, node: true }, callback).exec()
    } else {
      query[method](selector).boundingClientRect(callback).exec()
    }
  })
}

// ============================================================================
// 网络工具 (API相关)
// ============================================================================

/**
 * 构建带参数的URL
 * @param baseUrl 基础URL
 * @param params 参数对象，键值对表示要添加到URL的参数
 * @returns 返回带有参数的URL
 */
export const buildUrlWithParams = (baseUrl: string, params: Record<string, string>): string => {
  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&')

  const separator = baseUrl.includes('?') ? '&' : '?'
  return `${baseUrl}${separator}${queryString}`
}

// ============================================================================
// 动画工具 (动效相关)
// ============================================================================

/**
 * 缓动函数，用于在动画或过渡效果中根据时间参数计算当前值
 * @param t 当前时间，通常是从动画开始经过的时间
 * @param b 初始值，动画属性的初始值
 * @param c 变化量，动画属性的目标值与初始值的差值
 * @param d 持续时间，动画持续的总时间长度
 * @returns 计算出的当前值
 */
export const easingFn = (t: number = 0, b: number = 0, c: number = 0, d: number = 0): number => {
  return (c * (-(2 ** ((-10 * t) / d)) + 1) * 1024) / 1023 + b
}

// ============================================================================
// 组件工具 (框架特定)
// ============================================================================

/**
 * 默认的外部格式化函数 - picker 组件
 * @param items 要格式化的数据项数组或单个数据项
 * @param kv 配置对象，包含 labelKey 作为键值
 * @returns 格式化后的字符串
 */
export const defaultDisplayFormat = (
  items: any[] | Record<string, any>,
  kv?: { labelKey?: string },
): string => {
  const labelKey: string = kv?.labelKey || 'value'

  if (Array.isArray(items)) {
    return items.map((item) => item[labelKey]).join(', ')
  } else {
    return items[labelKey]
  }
}

/**
 * 默认函数占位符 - pickerView组件
 * @param value 值
 * @returns 原值
 */
export const defaultFunction = <T>(value: T): T => value

// ============================================================================
// 环境检测 (配置相关)
// ============================================================================

/**
 * 判断环境是否是H5
 */
export const isH5 = (() => {
  let isH5 = false
  // #ifdef H5
  isH5 = true
  // #endif
  return isH5
})()

/**
 * 全局变量id
 */
export const context = {
  id: 1000,
}
