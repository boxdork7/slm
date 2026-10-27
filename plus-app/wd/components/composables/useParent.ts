// 父组件管理
import type { ComponentInternalInstance, ComponentPublicInstance, InjectionKey } from 'vue'
import { computed, getCurrentInstance, inject, onUnmounted, ref } from 'vue'

type ParentProvide<T> = T & {
  link: (child: ComponentInternalInstance) => void
  unlink: (child: ComponentInternalInstance) => void
  children: ComponentPublicInstance[]
  internalChildren: ComponentInternalInstance[]
}

/**
 * 子组件与父组件通信的组合式函数
 *
 * 用于子组件注册到父组件中，建立父子组件关系，支持：
 * - 自动注册和注销
 * - 获取父组件实例
 * - 获取在兄弟组件中的索引位置
 * - 组件卸载时自动清理
 *
 * @template T - 父组件提供的上下文类型
 * @param key - 用于 inject 的注入键，需要与父组件的 provide 键匹配
 * @returns 包含父组件实例和当前索引的对象
 *
 * @example
 * ```typescript
 * // 在子组件中使用
 * const FORM_KEY: InjectionKey<FormContext> = Symbol('form')
 *
 * const { parent, index } = useParent<FormContext>(FORM_KEY)
 *
 * // parent: 父组件实例，如果没有找到则为 null
 * // index: 当前组件在兄弟组件中的索引位置
 *
 * if (parent) {
 *   // 可以访问父组件提供的方法和数据
 *   parent.validate()
 * }
 * ```
 */
export const useParent = <T>(key: InjectionKey<ParentProvide<T>>) => {
  const parent = inject(key, null)

  if (parent) {
    const instance = getCurrentInstance()!
    const { link, unlink, internalChildren } = parent

    // 将当前组件实例注册到父组件
    link(instance)

    // 组件卸载时自动注销
    onUnmounted(() => unlink(instance))

    // 计算当前组件在兄弟组件中的索引位置
    const index = computed(() => internalChildren.indexOf(instance))

    return {
      parent, // 父组件实例
      index, // 当前组件的索引位置
    }
  }

  // 如果没有找到父组件，返回默认值
  return {
    parent: null, // 父组件为 null
    index: ref(-1), // 索引为 -1
  }
}
