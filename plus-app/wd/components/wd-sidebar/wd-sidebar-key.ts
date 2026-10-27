// 侧边栏注入键
import type { InjectionKey } from 'vue'
import type { SidebarBeforeChange } from './wd-sidebar.vue'

/**
 * 侧边栏容器提供的数据接口
 */
export interface SidebarProvide {
  props: {
    /** 当前导航项的索引 */
    modelValue?: number | string
    /** 在改变前执行的函数 */
    beforeChange?: SidebarBeforeChange
  }
  /** 子组件列表 */
  children: any[]
  /** 子项状态变更方法 */
  setChange: (value: number | string, label: string) => void
}

/**
 * 侧边栏容器注入键
 * 用于父子组件通信
 */
export const SIDEBAR_KEY: InjectionKey<SidebarProvide> = Symbol('wd-sidebar')
