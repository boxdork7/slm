import type { InjectionKey } from 'vue'

/**
 * 行组件提供给列组件的数据类型
 */
interface RowProvide {
  props: { gutter?: number }
}

/**
 * 行列组件通信的注入键
 */
export const ROW_KEY: InjectionKey<RowProvide> = Symbol('wd-row')
