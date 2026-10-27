/**
 * 点击外部关闭功能管理模块
 * 用于管理需要点击外部区域关闭的组件队列
 * 常用于弹窗、下拉菜单、气泡等组件
 */

/**
 * 组件接口定义
 */
interface ComponentInstance {
  $: {
    uid: string | number
    exposed: {
      close: () => void
    }
  }
}

/** 存储需要管理的组件实例队列 */
let queue: ComponentInstance[] = []

/**
 * 将组件添加到管理队列中
 * @param comp 组件实例
 *
 * @example
 * ```typescript
 * // 在组件mounted时添加到队列
 * const { proxy } = getCurrentInstance() as any
 * onMounted(() => {
 *   pushToQueue(proxy)
 * })
 * ```
 */
export const pushToQueue = (comp: ComponentInstance): void => {
  queue.push(comp)
}

/**
 * 从管理队列中移除指定组件
 * @param comp 要移除的组件实例
 *
 * @example
 * ```typescript
 * // 在组件unmounted时从队列移除
 * const { proxy } = getCurrentInstance() as any
 * onUnmounted(() => {
 *   removeFromQueue(proxy)
 * })
 * ```
 */
export const removeFromQueue = (comp: ComponentInstance): void => {
  queue = queue.filter((item) => {
    return item.$.uid !== comp.$.uid
  })
}

/**
 * 关闭除指定组件外的所有其他组件
 * @param comp 不需要关闭的组件实例
 *
 * @example
 * ```typescript
 * // 打开当前组件时，关闭其他所有组件
 * const { proxy } = getCurrentInstance() as any
 * const handleOpen = () => {
 *   closeOther(proxy)
 *   // 打开当前组件的逻辑
 * }
 * ```
 */
export const closeOther = (comp: ComponentInstance): void => {
  queue.forEach((item) => {
    if (item.$.uid !== comp.$.uid) {
      item.$.exposed.close()
    }
  })
}

/**
 * 关闭队列中的所有组件
 * 通常在点击外部区域时调用
 *
 * @example
 * ```typescript
 * // 监听全局点击事件
 * document.addEventListener('click', (e) => {
 *   // 判断点击是否在组件外部
 *   if (!isClickInside(e.target)) {
 *     closeOutside()
 *   }
 * })
 * ```
 */
export const closeOutside = (): void => {
  queue.forEach((item) => {
    item.$.exposed.close()
  })
}
