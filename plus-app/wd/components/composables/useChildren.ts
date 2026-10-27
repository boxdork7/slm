// 子组件管理
import {
  type ComponentInternalInstance,
  type ComponentPublicInstance,
  getCurrentInstance,
  type InjectionKey,
  provide,
  reactive,
  type VNode,
  type VNodeNormalizedChildren,
} from 'vue'

/**
 * 判断一个值是否为 VNode
 *
 * 注意：小程序端不支持从 vue 导出的 isVNode 方法，
 * 这里参考 uni-mp-vue 的实现方式进行判断
 *
 * @param value - 需要判断的值
 * @returns 如果是 VNode 返回 true，否则返回 false
 */
const isVNode = (value: any): value is VNode => {
  return value ? value.__v_isVNode === true : false
}

/**
 * 扁平化 VNode 树结构
 *
 * 将嵌套的 VNode 子节点树递归展开为一维数组，
 * 包括组件的 subTree 和普通的 children 节点
 *
 * @param children - Vue 组件的子节点集合
 * @returns 扁平化后的 VNode 数组
 */
export const flattenVNodes = (children: VNode) => {
  const result: VNode[] = []

  /**
   * 递归遍历子节点
   * 支持 children 为函数的情况，修复 wd-tabs 渲染错误
   * @param children - 当前层级的子节点
   */
  const traverse = (children: VNode | VNodeNormalizedChildren) => {
    const vNode = Array.isArray(children) ? children : [children]
    vNode.forEach((child) => {
      if (Array.isArray(child)) {
        traverse(child)
      } else if (isVNode(child) && child.component?.subTree) {
        result.push(child)
        traverse(child.component.subTree)
      } else if (isVNode(child) && Array.isArray(child.children)) {
        traverse(child.children)
      } else if (isVNode(child)) {
        result.push(child)
      }
    })
  }

  traverse(children)

  return result
}

/**
 * 在 VNode 数组中查找指定 VNode 的索引位置
 *
 * 首先尝试直接查找，如果找不到则通过 key 和 type 进行匹配查找
 *
 * @param vnodes - VNode 数组
 * @param vnode - 要查找的目标 VNode
 * @returns 找到的索引位置，找不到返回 -1
 */
const findVNodeIndex = (vnodes: VNode[], vnode: VNode) => {
  const index = vnodes.indexOf(vnode)
  if (index === -1) {
    // 如果直接查找失败，尝试通过 key 和 type 匹配
    return vnodes.findIndex(
      (item) =>
        vnode.key !== undefined &&
        vnode.key !== null &&
        item.type === vnode.type &&
        item.key === vnode.key,
    )
  }
  return index
}

/**
 * 根据 VNode 的顺序对子组件实例进行排序
 *
 * 确保子组件实例的顺序与它们在模板中的声明顺序一致，
 * 这对于需要按顺序访问子组件的场景很重要
 *
 * @param parent - 父组件的内部实例
 * @param publicChildren - 子组件的公开实例数组（会被修改）
 * @param internalChildren - 子组件的内部实例数组（会被修改）
 */
export const sortChildren = (
  parent: ComponentInternalInstance,
  publicChildren: ComponentPublicInstance[],
  internalChildren: ComponentInternalInstance[],
) => {
  // 获取父组件的所有子 VNode
  const vnodes =
    parent && parent.subTree && parent.subTree.children
      ? flattenVNodes(parent.subTree)
      : []

  // 根据 VNode 在数组中的位置对内部实例进行排序
  internalChildren.sort((a, b) => findVNodeIndex(vnodes, a.vnode) - findVNodeIndex(vnodes, b.vnode))

  // 根据排序后的内部实例顺序，重新排列公开实例
  const orderedPublicChildren = internalChildren.map((item) => item.proxy!)

  publicChildren.sort((a, b) => {
    const getIndex = (comp: ComponentPublicInstance) => {
      const uid = comp.$.uid
      return orderedPublicChildren.findIndex((i) => i.$.uid === uid)
    }

    const indexA = getIndex(a)
    const indexB = getIndex(b)
    return indexA - indexB
  })
}

/**
 * 用于管理父子组件关系的组合式函数
 *
 * 提供了一套完整的父子组件通信机制，包括：
 * - 子组件注册和注销
 * - 自动维护子组件顺序
 * - 响应式的子组件列表
 *
 * 典型使用场景：
 * - 表单组件管理表单项
 * - 标签页组件管理标签项
 * - 菜单组件管理菜单项
 * 等需要父组件统一管理多个子组件的场景
 *
 * @template Child - 子组件的类型，继承自 ComponentPublicInstance
 * @template ProvideValue - 通过 provide/inject 传递的额外数据类型
 * @param key - 用于 provide/inject 的注入键
 * @returns 包含子组件列表和链接函数的对象
 *
 * @example
 * ```typescript
 * // 在父组件中使用
 * const FORM_KEY: InjectionKey<FormContext> = Symbol('form')
 *
 * const { children, linkChildren } = useChildren<FormItemInstance>(FORM_KEY)
 *
 * linkChildren({
 *   validate: () => { ... },
 *   resetFields: () => { ... }
 * })
 *
 * // children 现在包含所有注册的子组件实例
 * ```
 */
export const useChildren = <
  // eslint-disable-next-line
  Child extends ComponentPublicInstance = ComponentPublicInstance<{}, any>,
  ProvideValue = never,
>(
  key: InjectionKey<ProvideValue>,
) => {
  // 响应式的子组件公开实例数组
  const publicChildren: Child[] = reactive([])
  // 响应式的子组件内部实例数组
  const internalChildren: ComponentInternalInstance[] = reactive([])
  // 获取当前父组件实例
  const parent = getCurrentInstance()!

  /**
   * 创建父子组件链接
   *
   * @param value - 要通过 provide 传递给子组件的额外数据
   */
  const linkChildren = (value?: ProvideValue) => {
    /**
     * 注册子组件
     * 当子组件挂载时调用此函数将自己注册到父组件
     *
     * @param child - 子组件的内部实例
     */
    const link = (child: ComponentInternalInstance) => {
      if (child.proxy) {
        internalChildren.push(child)
        publicChildren.push(child.proxy as Child)
        // 注册后立即排序，确保顺序正确
        sortChildren(parent, publicChildren, internalChildren)
      }
    }

    /**
     * 注销子组件
     * 当子组件卸载时调用此函数将自己从父组件中移除
     *
     * @param child - 要注销的子组件内部实例
     */
    const unlink = (child: ComponentInternalInstance) => {
      const index = internalChildren.indexOf(child)
      if (index > -1) {
        publicChildren.splice(index, 1)
        internalChildren.splice(index, 1)
      }
    }

    // 通过 provide 向子组件提供注册和注销方法，以及父组件的上下文
    provide(
      key,
      Object.assign(
        {
          link, // 子组件注册方法
          unlink, // 子组件注销方法
          children: publicChildren, // 所有子组件的公开实例
          internalChildren, // 所有子组件的内部实例
        },
        value, // 用户传入的额外数据
      ),
    )
  }

  return {
    children: publicChildren, // 响应式的子组件列表
    linkChildren, // 建立父子组件链接的函数
  }
}
