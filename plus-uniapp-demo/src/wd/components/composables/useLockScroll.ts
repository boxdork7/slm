import { onBeforeUnmount, onDeactivated, ref, watch } from 'vue'

/**
 * 页面滚动锁定组合式函数
 *
 * 提供页面滚动的锁定和解锁功能，支持：
 * - 计数器管理，支持多重锁定
 * - 响应式锁定状态监听
 * - 自动清理资源
 * - 组件失活和卸载时自动解锁
 *
 * @param shouldLock - 返回是否应该锁定滚动的函数
 * @returns 包含锁定和解锁方法的对象
 *
 * @example
 * ```typescript
 * const showModal = ref(false)
 *
 * const { lock, unlock } = useLockScroll(() => showModal.value)
 *
 * // 手动控制
 * lock()   // 锁定滚动
 * unlock() // 解锁滚动
 *
 * // 或者通过响应式数据自动控制
 * showModal.value = true  // 自动锁定
 * showModal.value = false // 自动解锁
 * ```
 */
export const useLockScroll = (shouldLock: () => boolean) => {
  // 滚动锁定计数器，支持多重锁定
  const scrollLockCount = ref(0)

  /**
   * 锁定页面滚动
   * 使用计数器机制，支持多次锁定调用
   */
  const lock = () => {
    if (scrollLockCount.value === 0) {
      document.getElementsByTagName('body')[0].style.overflow = 'hidden'
    }
    scrollLockCount.value++
  }

  /**
   * 解锁页面滚动
   * 只有当计数器归零时才真正解锁滚动
   */
  const unlock = () => {
    if (scrollLockCount.value > 0) {
      scrollLockCount.value--
      if (scrollLockCount.value === 0) {
        document.getElementsByTagName('body')[0].style.overflow = ''
      }
    }
  }

  /**
   * 销毁时的清理函数
   * 如果当前应该锁定，则执行解锁操作
   */
  const destroy = () => {
    shouldLock() && unlock()
  }

  // 监听锁定状态变化，自动执行锁定或解锁
  watch(shouldLock, (value) => {
    value ? lock() : unlock()
  })

  // 组件失活时自动清理
  onDeactivated(destroy)
  // 组件卸载前自动清理
  onBeforeUnmount(destroy)

  return {
    lock, // 锁定滚动方法
    unlock, // 解锁滚动方法
  }
}
