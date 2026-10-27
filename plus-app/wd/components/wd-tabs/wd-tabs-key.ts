// 选项卡注入键
import type { InjectionKey } from 'vue'
import type { WdBadgeProps } from '../wd-badge/wd-badge.vue'

/**
 * 标签页滑动模式
 */
export type TabsSlidable = 'auto' | 'always'

/**
 * 标签项配置接口
 */
export interface TabItem {
  /** 唯一标识符 */
  name?: string | number
  /** 标签标题 */
  title: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否懒加载 */
  lazy?: boolean
  /** 徽标属性 */
  badgeProps?: Partial<WdBadgeProps>
  /** 是否使用自定义内容插槽 */
  useSlot?: boolean
  /** 自定义内容插槽名称，默认为 tab-{index} */
  slotName?: string

  /** 自定义数据，点击时会传递 */
  [key: string]: any
}

/**
 * 标签页容器提供的数据接口
 */
export interface TabsProvide {
  state: {
    activeIndex: number
    lineStyle: string
    inited: boolean
    animating: boolean
    mapShow: boolean
    scrollLeft: number
    useInnerLine: boolean
  }
  props: {
    /** 标签数超过阈值可滑动 */
    slidableNum?: number
    /** 标签数超过阈值显示导航地图 */
    mapNum?: number
    /** 导航地图的标题 */
    mapTitle?: string
    /** 粘性布局 */
    sticky?: boolean
    /** 粘性布局吸顶位置 */
    offsetTop?: number
    /** 开启手势滑动 */
    swipeable?: boolean
    /** 自动调整底部条宽度 */
    autoLineWidth?: boolean
    /** 底部条宽度 */
    lineWidth?: string | number
    /** 底部条高度 */
    lineHeight?: string | number
    /** 颜色 */
    color?: string
    /** 非活动状态颜色 */
    inactiveColor?: string
    /** 是否开启切换标签内容时的过渡动画 */
    animated?: boolean
    /** 切换动画过渡时间 */
    duration?: number
    /** 是否开启滚动导航 */
    slidable?: TabsSlidable
    /** 是否开启格子点击反馈 */
    clickable?: boolean
  }
  /** 子组件列表 */
  children: any[]
}

/**
 * 标签页容器注入键
 * 用于父子组件通信
 */
export const TABS_KEY: InjectionKey<TabsProvide> = Symbol('wd-tabs')
