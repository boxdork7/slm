/**
 * Cell Group 组件的依赖注入键
 * @author 抓蛙师
 */
import { type InjectionKey } from 'vue'

/**
 * Cell Group 组件向子组件提供的数据类型
 * 用于在 Cell Group 和其子组件（如 Cell）之间共享状态和配置
 */
export type CellGroupProvide = {
  /** Cell Group 组件的属性配置 */
  props: {
    /** 是否显示边框，子组件可以继承此配置 */
    border?: boolean
  }
}

/**
 * Cell Group 组件的依赖注入键
 * 用于在 Cell Group 组件和其子组件之间建立依赖注入关系
 * 子组件（如 Cell）可以通过此键获取父组件 Cell Group 的配置信息
 */
export const CELL_GROUP_KEY: InjectionKey<CellGroupProvide> = Symbol('wd-cell-group')
