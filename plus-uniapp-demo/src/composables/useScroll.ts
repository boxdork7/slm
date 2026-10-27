// 滚动管理钩子
import { ref, readonly } from 'vue'

/**
 * 全局滚动状态实例
 * 确保所有调用 useScroll() 的地方共享同一个状态
 */
let globalScrollInstance: ReturnType<typeof createScrollInstance> | null = null

/**
 * 创建滚动状态实例
 * 内部方法，用于创建滚动状态的实际实现
 */
const createScrollInstance = () => {
  /**
   * 当前滚动位置
   */
  const scrollTop = ref<number>(0)

  /**
   * 获取当前滚动位置
   * @returns 当前页面的滚动位置（像素）
   */
  const getScrollTop = (): number => {
    return scrollTop.value
  }

  /**
   * 更新滚动位置
   * 智能处理滚动状态，当滚动到顶部时自动重置
   * @param value 新的滚动位置（像素）
   *
   * @example
   * updateScrollTop(500) // 设置滚动位置为500px
   * updateScrollTop(0)   // 滚动到顶部时自动重置状态
   */
  const updateScrollTop = (value: number): void => {
    const newValue = Math.max(0, value)

    // 如果滚动到顶部，完全重置状态
    if (newValue === 0 && scrollTop.value !== 0) {
      scrollTop.value = 0
    } else {
      scrollTop.value = newValue
    }
  }

  /**
   * 重置滚动位置
   * 将滚动位置重置为0，通常用于页面切换时
   *
   * @example
   * // 页面卸载时重置
   * onUnmounted(() => {
   *   resetScrollTop()
   * })
   */
  const resetScrollTop = (): void => {
    scrollTop.value = 0
  }

  /**
   * 判断页面是否已滚动
   * @param threshold 判断滚动的阈值，默认为0
   * @returns 是否已滚动
   *
   * @example
   * const scrolled = isScrolled(100) // 滚动超过100px时返回true
   */
  const isScrolled = (threshold: number = 0): boolean => {
    return scrollTop.value > threshold
  }

  /**
   * 判断是否应该显示返回顶部按钮
   * @param top 显示按钮的滚动阈值，默认为600（与wd-backtop组件默认值保持一致）
   * @returns 是否应该显示返回顶部按钮
   *
   * @example
   * const showBacktop = shouldShowBacktop(600) // 滚动超过600rpx时显示按钮
   */
  const shouldShowBacktop = (top: number = 600): boolean => {
    return scrollTop.value > top
  }

  /**
   * 计算滚动进度百分比
   * @param maxScrollTop 页面最大滚动高度
   * @returns 滚动进度百分比 (0-100)
   *
   * @example
   * const progress = getScrollProgress(1000) // 当前滚动500px，最大1000px，返回50
   */
  const getScrollProgress = (maxScrollTop: number): number => {
    if (maxScrollTop <= 0) return 0
    return Math.min(100, (scrollTop.value / maxScrollTop) * 100)
  }

  return {
    // 只读的滚动位置状态，防止外部直接修改
    scrollTop: readonly(scrollTop),
    // 基础操作方法
    getScrollTop,
    updateScrollTop,
    resetScrollTop,
    // 状态判断方法
    isScrolled,
    shouldShowBacktop,
    getScrollProgress,
  }
}

/**
 * 滚动管理钩子 (useScroll)
 *
 * 基于全局单例模式实现页面滚动位置的统一管理。
 * 解决微信小程序中 onPageScroll 只能在页面组件中生效的平台差异问题。
 *
 * 包含以下功能:
 * - 状态管理: 响应式滚动位置状态 (scrollTop)
 * - 更新滚动位置: 更新当前页面的滚动位置 (updateScrollTop)
 * - 重置滚动位置: 重置滚动位置为0 (resetScrollTop)
 * - 判断滚动状态: 判断是否已滚动、是否可显示返回顶部按钮 (isScrolled, shouldShowBacktop)
 *
 * @description 提供跨组件的滚动位置共享，适配不同平台的滚动监听差异
 * @returns 包含滚动位置相关操作的方法和状态
 *
 * @example
 * // 推荐用法：在页面组件中同时使用 onShow 和 onPageScroll
 * const { updateScrollTop, resetScrollTop } = useScroll()
 *
 * onShow(() => {
 *   resetScrollTop() // 页面显示时重置，避免页面切换时状态错误
 * })
 *
 * onPageScroll((e) => {
 *   updateScrollTop(e.scrollTop)
 * })
 *
 * @example
 * // 在Layout组件中使用
 * const { scrollTop } = useScroll()
 *
 * <wd-backtop :scroll-top="scrollTop" :top="600" />
 */
export const useScroll = () => {
  // 如果全局实例不存在，创建一个新实例
  if (!globalScrollInstance) {
    globalScrollInstance = createScrollInstance()
  }

  // 返回全局单例实例
  return globalScrollInstance
}
