import type { InjectionKey } from 'vue'

/**
 * 网格容器提供的数据接口
 */
export interface GridProvide {
  props: {
    /** 是否开启格子点击反馈 */
    clickable?: boolean
    /** 是否将格子固定为正方形 */
    square?: boolean
    /** 列数 */
    column?: number
    /** 是否显示边框 */
    border?: boolean
    /** 背景颜色 */
    bgColor?: string
    /** 格子之间的间距 */
    gutter?: number
    /** 自定义内容区域hover-class */
    hoverClass?: string
  }
  /** 子组件列表 */
  children: any[]
}

/**
 * 网格容器注入键
 * 用于父子组件通信
 */
export const GRID_KEY: InjectionKey<GridProvide> = Symbol('wd-grid')
