// 索引栏注入键
import type { InjectionKey } from 'vue'
import type { AnchorIndex } from './wd-index-bar.vue'

/**
 * 索引栏提供的数据接口
 */
export interface IndexBarProvide {
  props: {
    /** 索引是否吸顶 */
    sticky?: boolean
  }
  /** 锚点状态 */
  anchorState: {
    /** 当前激活的索引 */
    activeIndex: AnchorIndex | null
  }
}

/**
 * 索引栏注入键
 * 用于父子组件通信
 */
export const indexBarInjectionKey: InjectionKey<IndexBarProvide> = Symbol('wd-index-bar')
