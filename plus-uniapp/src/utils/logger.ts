// 日志工具
import { getCurrentRoute } from './route'

/**
 * 前端日志收集器
 * 仅在开发环境生效，用于实时调试
 *
 * 功能：
 * - 重写console方法，保留原功能
 * - 批量收集日志，定时发送
 * - 自动收集错误信息
 */

/** 日志项 */
interface LogItem {
  /** 日志级别 */
  level: 'log' | 'info' | 'warn' | 'error'
  /** 日志内容 */
  message: string
  /** 时间戳 */
  timestamp: number
  /** 页面路径 */
  path: string
  /** 用户信息(可选) */
  userId?: string
}

/** 日志收集器类 */
class Logger {
  /** 日志队列 */
  private queue: LogItem[] = []

  /** 定时器 */
  private timer: any = null

  /** 批量发送间隔(ms) */
  private readonly SEND_INTERVAL = 2000

  /** 单次最大发送数量 */
  private readonly MAX_BATCH_SIZE = 50

  /** 队列最大长度 */
  private readonly MAX_QUEUE_SIZE = 200

  /** 是否已初始化 */
  private isInitialized = false

  /** 原始console方法 */
  private readonly originalConsole = {
    log: console.log.bind(console),
    info: console.info.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
  }

  /** 重复日志过滤 */
  private lastMessage = ''
  private repeatCount = 0
  private readonly MAX_REPEAT = 3 // 相同日志最多重复3次

  /**
   * 初始化日志收集器
   * 仅开发环境以及打开方法开关为true才生效
   *
   */
  init(enable: boolean = false) {
    // 非开发环境不启用
    if (import.meta.env.PROD || !enable) {
      this.originalConsole.log('[Logger] 日志收集器未启用')
      return
    }

    if (this.isInitialized) {
      this.originalConsole.warn('[Logger] 日志收集器已初始化')
      return
    }

    this.overrideConsole()
    this.startTimer()
    this.listenErrors()

    this.isInitialized = true
    this.originalConsole.log('[Logger] 日志收集器已启动')
  }

  /**
   * 重写console方法
   */
  private overrideConsole() {
    // 重写 console.log
    console.log = (...args: any[]) => {
      this.originalConsole.log(...args)
      this.collect('log', args)
    }

    // 重写 console.info
    console.info = (...args: any[]) => {
      this.originalConsole.info(...args)
      this.collect('info', args)
    }

    // 重写 console.warn
    console.warn = (...args: any[]) => {
      this.originalConsole.warn(...args)
      this.collect('warn', args)
    }

    // 重写 console.error
    console.error = (...args: any[]) => {
      this.originalConsole.error(...args)
      this.collect('error', args)
    }
  }

  /**
   * 收集日志
   */
  private collect(level: LogItem['level'], args: any[]) {
    // 格式化日志内容
    const message = args
      .map((arg) => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg, null, 2)
          } catch {
            return String(arg)
          }
        }
        return String(arg)
      })
      .join(' ')

    // 过滤掉开发日志相关的系统消息（避免无限循环）
    if (message.includes('devLog')) {
      return
    }

    // 过滤重复日志
    if (message === this.lastMessage) {
      this.repeatCount++
      // 超过最大重复次数，不再收集
      if (this.repeatCount > this.MAX_REPEAT) {
        return
      }
      // 第一次重复时，添加提示
      if (this.repeatCount === this.MAX_REPEAT) {
        let currentPath = ''
        try {
          const route = getCurrentRoute()
          currentPath = route.path
        } catch {
          // 获取失败使用空字符串
        }

        this.addToQueue({
          level,
          message: `${message} (重复 ${this.repeatCount} 次，后续重复日志已忽略)`,
          timestamp: Date.now(),
          path: currentPath,
        })
        return
      }
    } else {
      // 重置重复计数
      this.lastMessage = message
      this.repeatCount = 1
    }

    // 添加到队列
    let currentPath = ''
    try {
      const route = getCurrentRoute()
      currentPath = route.path
    } catch {
      // 获取失败使用空字符串
    }

    this.addToQueue({
      level,
      message,
      timestamp: Date.now(),
      path: currentPath,
    })
  }

  /**
   * 添加到队列
   */
  private addToQueue(log: LogItem) {
    // 队列满了，丢弃最旧的日志
    if (this.queue.length >= this.MAX_QUEUE_SIZE) {
      this.queue.shift()
    }
    this.queue.push(log)
  }

  /**
   * 监听全局错误
   */
  private listenErrors() {
    // #ifdef H5
    // 监听未捕获的错误
    window.addEventListener('error', (event) => {
      this.collect('error', [
        `未捕获的错误: ${event.message}`,
        `文件: ${event.filename}:${event.lineno}:${event.colno}`,
      ])
    })

    // 监听Promise错误
    window.addEventListener('unhandledrejection', (event) => {
      this.collect('error', ['未处理的Promise错误:', event.reason])
    })
    // #endif

    // #ifndef H5
    // 小程序/App环境使用 uni.onError 和 uni.onUnhandledRejection
    uni.onError((error) => {
      this.collect('error', [`未捕获的错误: ${error}`])
    })

    uni.onUnhandledRejection((event) => {
      this.collect('error', ['未处理的Promise错误:', event.reason])
    })
    // #endif
  }

  /**
   * 启动定时器
   */
  private startTimer() {
    this.timer = setInterval(() => {
      this.sendLogs()
    }, this.SEND_INTERVAL)
  }

  /**
   * 发送日志到后端
   */
  private async sendLogs() {
    if (this.queue.length === 0) return

    // 取出一批日志
    const logs = this.queue.splice(0, this.MAX_BATCH_SIZE)

    try {
      // 发送到后端
      await http.post('/system/devLog/collect', { logs })
    } catch (err) {
      // 发送失败不影响原功能
      this.originalConsole.error('[Logger] 日志发送失败:', err)
    }
  }

  /**
   * 停止日志收集
   */
  stop() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }

    // 发送剩余日志
    this.sendLogs()

    console.log('[Logger] 日志收集器已停止')
  }

  /**
   * 手动发送日志
   */
  flush() {
    this.sendLogs()
  }
}

// 导出单例
export const logger = new Logger()
