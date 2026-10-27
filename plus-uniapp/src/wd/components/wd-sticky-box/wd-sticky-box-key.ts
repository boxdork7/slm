// 吸顶容器注入键
import type { ComponentInternalInstance, InjectionKey } from 'vue'

/**
 * 吸顶容器组件提供给子组件的数据和方法
 */
export interface stickyBoxProvide {
  boxStyle: {
    height: number // 高度
    width: number // 宽度
  }
  observerForChild: (child: ComponentInternalInstance) => void // 监听子组件
}

/**
 * 吸顶容器组件注入键
 */
export const STICKY_BOX_KEY: InjectionKey<stickyBoxProvide> = Symbol('wd-sticky-box')
