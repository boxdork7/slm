// 触摸手势
import { ref } from 'vue'

/**
 * 触摸事件管理组合式函数
 *
 * 提供触摸手势的识别和处理，支持：
 * - 触摸开始和移动事件处理
 * - 水平/垂直方向识别
 * - 位移和偏移量计算
 * - 起始位置记录
 *
 * @returns 包含触摸状态和事件处理方法的对象
 *
 * @example
 * ```typescript
 * const { touchStart, touchMove, direction, deltaX, deltaY } = useTouch()
 *
 * // 在模板中使用
 * <div @touchstart="touchStart" @touchmove="touchMove">
 *   滑动方向: {{ direction }}
 *   水平位移: {{ deltaX }}
 *   垂直位移: {{ deltaY }}
 * </div>
 * ```
 */
export const useTouch = () => {
  // 响应式状态
  const direction = ref<string>('') // 滑动方向：'horizontal' | 'vertical' | ''
  const deltaX = ref<number>(0) // 水平位移量
  const deltaY = ref<number>(0) // 垂直位移量
  const offsetX = ref<number>(0) // 水平偏移量（绝对值）
  const offsetY = ref<number>(0) // 垂直偏移量（绝对值）
  const startX = ref<number>(0) // 起始 X 坐标
  const startY = ref<number>(0) // 起始 Y 坐标

  /**
   * 处理触摸开始事件
   * 重置所有状态并记录起始位置
   *
   * @param event - 触摸事件对象
   */
  const touchStart = (event: any) => {
    const touch = event.touches[0]

    // 重置状态
    direction.value = ''
    deltaX.value = 0
    deltaY.value = 0
    offsetX.value = 0
    offsetY.value = 0

    // 记录起始位置
    startX.value = touch.clientX
    startY.value = touch.clientY
  }

  /**
   * 处理触摸移动事件
   * 计算位移量并判断滑动方向
   *
   * @param event - 触摸事件对象
   */
  const touchMove = (event: any) => {
    const touch = event.touches[0]

    // 计算位移量
    deltaX.value = touch.clientX - startX.value
    deltaY.value = touch.clientY - startY.value

    // 计算偏移量（绝对值）
    offsetX.value = Math.abs(deltaX.value)
    offsetY.value = Math.abs(deltaY.value)

    // 判断滑动方向
    direction.value =
      offsetX.value > offsetY.value ? 'horizontal' : offsetX.value < offsetY.value ? 'vertical' : ''
  }

  return {
    touchStart, // 触摸开始处理函数
    touchMove, // 触摸移动处理函数
    direction, // 滑动方向
    deltaX, // 水平位移量
    deltaY, // 垂直位移量
    offsetX, // 水平偏移量
    offsetY, // 垂直偏移量
    startX, // 起始 X 坐标
    startY, // 起始 Y 坐标
  }
}
