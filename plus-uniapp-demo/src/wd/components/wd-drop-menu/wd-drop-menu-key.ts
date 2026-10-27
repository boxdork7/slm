import type { InjectionKey, Ref } from 'vue'
import { DropDirction } from './wd-drop-menu.vue'

/**
 * 下拉菜单提供的数据接口
 */
export interface DropMenuProvide {
  /** 下拉菜单属性 */
  props: Partial<{
    zIndex: number
    direction: DropDirction
    modal: boolean
    closeOnClickModal: boolean
    duration: number
    customStyle: string
    customClass: string
  }>
  /** 控制菜单折叠的方法 */
  fold: (child?: any) => void
  /** 下拉菜单偏移量 */
  offset: Ref<number>
}

/**
 * 下拉菜单注入键
 */
export const DROP_MENU_KEY: InjectionKey<DropMenuProvide> = Symbol('wd-drop-menu')
