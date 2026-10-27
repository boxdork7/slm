// 动画帧
import { onUnmounted, ref } from 'vue'
import { isDef, isH5, isNumber } from '../common/util'

// 定义回调函数类型
type RafCallback = (time: number) => void

/**
 * 动画帧管理组合式函数
 *
 * 提供跨平台的动画帧控制，支持：
 * - H5 环境使用 requestAnimationFrame
 * - 小程序环境使用 setTimeout 模拟
 * - 自动资源清理
 * - 统一的启动和取消接口
 *
 * @param callback - 动画帧回调函数，接收时间戳参数
 * @returns 包含启动和取消方法的对象
 *
 * @example
 * ```typescript
 * const { start, cancel } = useRaf((time) => {
 *   console.log('动画帧执行:', time)
 *   // 动画逻辑
 * })
 *
 * // 开始动画
 * start()
 *
 * // 取消动画
 * cancel()
 * ```
 */
export const useRaf = (callback: RafCallback) => {
  // 存储当前动画帧的引用
  const requestRef = ref<number | null | ReturnType<typeof setTimeout>>(null)

  /**
   * 取消动画帧
   * 根据平台使用不同的取消方法
   */
  const cancel = () => {
    if (isH5 && isNumber(requestRef.value)) {
      cancelAnimationFrame(requestRef.value!)
    } else if (isDef(requestRef.value)) {
      clearTimeout(requestRef.value)
    }
  }

  /**
   * 启动动画帧
   * 根据平台使用不同的动画帧方法
   */
  const start = () => {
    /**
     * 动画帧处理函数
     * @param time - 时间戳
     */
    const handle = (time: number) => {
      callback(time)
    }

    if (isH5) {
      // H5 环境使用原生 requestAnimationFrame
      requestRef.value = requestAnimationFrame(handle)
    } else {
      // 小程序环境使用 setTimeout 模拟，30fps
      requestRef.value = setTimeout(() => handle(Date.now()), 1000 / 30)
    }
  }

  // 组件卸载时自动取消动画帧，防止内存泄漏
  onUnmounted(() => {
    cancel()
  })

  return {
    start, // 启动动画帧
    cancel, // 取消动画帧
  }
}
