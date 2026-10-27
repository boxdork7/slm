// 倒计时
import { computed, onBeforeUnmount, ref } from 'vue'
import { isDef } from '../common/util'
import { useRaf } from './useRaf'

// 定义倒计时时间的数据结构
export interface CurrentTime {
  days: number
  hours: number
  total: number
  minutes: number
  seconds: number
  milliseconds: number
}

// 定义倒计时的配置项
export interface UseCountDownOptions {
  time: number // 倒计时总时间，单位为毫秒
  millisecond?: boolean // 是否开启毫秒级倒计时，默认为 false
  onChange?: (current: CurrentTime) => void // 倒计时每次变化时的回调函数
  onFinish?: () => void // 倒计时结束时的回调函数
}

// 定义时间常量
const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/**
 * 将时间转换为倒计时数据结构
 *
 * @param time - 总时间（毫秒）
 * @returns 格式化后的时间对象
 */
const parseTime = (time: number): CurrentTime => {
  const days = Math.floor(time / DAY)
  const hours = Math.floor((time % DAY) / HOUR)
  const minutes = Math.floor((time % HOUR) / MINUTE)
  const seconds = Math.floor((time % MINUTE) / SECOND)
  const milliseconds = Math.floor(time % SECOND)

  return {
    total: time,
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
  }
}

/**
 * 判断两个时间是否在同一秒内
 *
 * @param time1 - 第一个时间（毫秒）
 * @param time2 - 第二个时间（毫秒）
 * @returns 是否在同一秒内
 */
const isSameSecond = (time1: number, time2: number): boolean => {
  return Math.floor(time1 / 1000) === Math.floor(time2 / 1000)
}

/**
 * 倒计时组合式函数
 *
 * 提供完整的倒计时功能，支持：
 * - 毫秒级或秒级精度
 * - 开始、暂停、重置控制
 * - 自定义变化和结束回调
 * - 自动清理资源
 *
 * @param options - 倒计时配置选项
 * @returns 包含倒计时控制方法和当前状态的对象
 *
 * @example
 * ```typescript
 * const { start, pause, reset, current } = useCountDown({
 *   time: 60 * 1000, // 60秒倒计时
 *   millisecond: true,
 *   onChange: (current) => {
 *     console.log(`剩余: ${current.seconds}秒`)
 *   },
 *   onFinish: () => {
 *     console.log('倒计时结束!')
 *   }
 * })
 *
 * // 开始倒计时
 * start()
 * ```
 */
export const useCountDown = (options: UseCountDownOptions) => {
  let endTime: number // 结束时间戳
  let counting: boolean // 是否正在计时中

  const { start: startRaf, cancel: cancelRaf } = useRaf(tick)

  // 剩余时间（响应式）
  const remain = ref(options.time)
  // 当前倒计时数据（计算属性）
  const current = computed(() => parseTime(remain.value))

  // 需要相互调用的核心函数使用 function 声明（会被提升）

  /**
   * 暂停倒计时
   * 停止计时并取消动画帧
   */
  function pause(): void {
    counting = false
    cancelRaf()
  }

  /**
   * 获取当前剩余时间
   * @returns 剩余时间（毫秒），最小为0
   */
  const getCurrentRemain = () => Math.max(endTime - Date.now(), 0)

  /**
   * 设置剩余时间并触发相关回调
   * @param value - 新的剩余时间
   */
  function setRemain(value: number): void {
    remain.value = value
    // 触发变化回调
    isDef(options.onChange) && options.onChange(current.value)
    // 如果倒计时结束，暂停并触发结束回调
    if (value === 0) {
      pause()
      isDef(options.onFinish) && options.onFinish()
    }
  }

  /**
   * 毫秒级更新倒计时
   * 每毫秒都会更新剩余时间
   */
  const microTick = () => {
    if (counting) {
      setRemain(getCurrentRemain())
      if (remain.value > 0) {
        startRaf()
      }
    }
  }

  /**
   * 秒级更新倒计时
   * 只有当秒数发生变化时才更新
   */
  const macroTick = () => {
    if (counting) {
      const remainRemain = getCurrentRemain()
      if (!isSameSecond(remainRemain, remain.value) || remainRemain === 0) {
        setRemain(remainRemain)
      }

      if (remain.value > 0) {
        startRaf()
      }
    }
  }

  /**
   * 根据配置项选择更新方式
   * 毫秒级或秒级精度
   */
  function tick(): void {
    if (options.millisecond) {
      microTick()
    } else {
      macroTick()
    }
  }

  /**
   * 开始倒计时
   * 设置结束时间并开始计时循环
   */
  const start = () => {
    if (!counting) {
      endTime = Date.now() + remain.value
      counting = true
      startRaf()
    }
  }

  /**
   * 重置倒计时
   *
   * @param totalTime - 新的总时间，默认使用初始配置的时间
   */
  const reset = (totalTime: number = options.time): void => {
    pause()
    remain.value = totalTime
  }

  // 在组件卸载前自动暂停倒计时，防止内存泄漏
  onBeforeUnmount(pause)

  return {
    start, // 开始倒计时
    pause, // 暂停倒计时
    reset, // 重置倒计时
    current, // 当前倒计时状态（响应式）
  }
}
