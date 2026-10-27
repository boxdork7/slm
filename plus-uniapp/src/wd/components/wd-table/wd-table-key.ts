// 表格注入键
import type { CSSProperties, InjectionKey } from 'vue'

/**
 * 表格容器提供的数据接口
 */
export interface TableProvide {
  props: {
    /** 显示的数据 */
    data?: Array<Record<string, any>>
    /** 是否带有边框 */
    border?: boolean
    /** 是否为斑马纹 table */
    stripe?: boolean
    /** Table 的高度 */
    height?: string | number
    /** 行高 */
    rowHeight?: string | number
    /** 是否显示表头 */
    showHeader?: boolean
    /** 是否超出2行隐藏 */
    ellipsis?: boolean
    /** 是否显示索引列 */
    index?: boolean | object
    /** 是否固定表头 */
    fixedHeader?: boolean
  }
  /** 滚动状态 */
  state: {
    scrollLeft: number
  }
  /** 子组件列表 */
  children: any[]
  /** 行点击事件 */
  rowClick: (index: number) => void
  /** 获取是否最后一个固定元素 */
  getIsLastFixed: (column: { fixed: boolean; prop: string }) => boolean
  /** 获取固定列样式 */
  getFixedStyle: (index: number, style: CSSProperties) => CSSProperties
}

/**
 * 表格容器注入键
 * 用于父子组件通信
 */
export const TABLE_KEY: InjectionKey<TableProvide> = Symbol('wd-table')
