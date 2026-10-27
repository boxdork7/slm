import type { InjectionKey } from 'vue'

/**
 * 折叠面板提供的数据接口
 */
export interface CollapseProvide {
  /** 折叠面板属性 */
  props: Partial<{
    customStyle: string
    customClass: string
    customMoreSlotClass: string
    modelValue: string | Array<string> | boolean
    accordion: boolean
    viewmore: boolean
    useMoreSlot: boolean
    lineNum: number
  }>
  /** 切换面板状态的方法 */
  toggle: (name: string, expanded: boolean) => void
}

/**
 * 折叠面板注入键
 */
export const COLLAPSE_KEY: InjectionKey<CollapseProvide> = Symbol('wd-collapse')
