// 队列管理
import { provide, ref, type Ref } from 'vue'

export const queueKey = '__QUEUE_KEY__'

export interface Queue {
  queue: Ref<any[]>
  pushToQueue: (comp: any) => void
  removeFromQueue: (comp: any) => void
  closeOther: (comp: any) => void
  closeOutside: () => void
}

/**
 * 队列管理组合式函数
 *
 * 提供组件队列的管理功能，常用于：
 * - 弹窗/对话框的层级管理
 * - Toast 消息的队列控制
 * - 下拉菜单的互斥显示
 * - 其他需要队列管理的组件场景
 *
 * @returns 包含队列控制方法的对象
 *
 * @example
 * ```typescript
 * // 在父组件中使用
 * const { closeOther, closeOutside } = useQueue()
 *
 * // closeOther: 关闭除指定组件外的其他组件
 * // closeOutside: 关闭所有队列中的组件
 * ```
 */
export const useQueue = () => {
  // 响应式队列，存储所有注册的组件实例
  const queue = ref<any[]>([])

  /**
   * 将组件添加到队列中
   * @param comp - 要添加的组件实例
   */
  const pushToQueue = (comp: any) => {
    queue.value.push(comp)
  }

  /**
   * 从队列中移除组件
   * @param comp - 要移除的组件实例
   */
  const removeFromQueue = (comp: any) => {
    queue.value = queue.value.filter((item) => {
      return item.$.uid !== comp.$.uid
    })
  }

  /**
   * 关闭队列中除指定组件外的其他组件
   * @param comp - 要保留的组件实例
   */
  const closeOther = (comp: any) => {
    queue.value.forEach((item) => {
      if (item.$.uid !== comp.$.uid) {
        item.$.exposed.close()
      }
    })
  }

  /**
   * 关闭队列中的所有组件
   */
  const closeOutside = () => {
    queue.value.forEach((item) => {
      item.$.exposed.close()
    })
  }

  // 向子组件提供队列管理接口
  provide(queueKey, {
    queue,
    pushToQueue,
    removeFromQueue,
    closeOther,
    closeOutside,
  })

  return {
    closeOther, // 关闭其他组件
    closeOutside, // 关闭所有组件
  }
}
