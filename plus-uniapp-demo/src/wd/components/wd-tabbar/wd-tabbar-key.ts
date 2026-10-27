import type { InjectionKey } from 'vue'
import type { WdTabbarItemProps } from '../wd-tabbar-item/wd-tabbar-item.vue'
import type { TabbarShape } from './wd-tabbar.vue'

/**
 * 标签栏容器提供的数据接口
 */
export interface TabbarProvide {
  props: {
    /** 选中标签的索引值或者名称 */
    modelValue?: number | string
    /** 是否固定在底部 */
    fixed?: boolean
    /** 是否设置底部安全距离（iPhone X 类型的机型） */
    safeAreaInsetBottom?: boolean
    /** 是否显示顶部边框 */
    bordered?: boolean
    /** 标签栏的形状，可选项：default/round */
    shape?: TabbarShape
    /** 激活标签的颜色 */
    activeColor?: string
    /** 未激活标签的颜色 */
    inactiveColor?: string
    /** 固定在底部时，是否在标签位置生成一个等高的占位元素 */
    placeholder?: boolean
    /** 自定义组件的层级 */
    zIndex?: number
    /** 图标大小 */
    iconSize?: string | number
    /** 文字大小 */
    fontSize?: string | number
  }
  /** 设置变更回调函数 */
  setChange: (child: WdTabbarItemProps) => void
}

/**
 * 标签栏注入键
 * 用于父子组件通信
 */
export const TABBAR_KEY: InjectionKey<TabbarProvide> = Symbol('wd-tabbar')
