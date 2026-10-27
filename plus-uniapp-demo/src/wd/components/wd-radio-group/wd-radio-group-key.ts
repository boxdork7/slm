import type { InjectionKey } from 'vue'
import type { RadioIconPlacement, RadioShape, RadioSize } from './wd-radio-group.vue'

/**
 * 单选框组提供的数据接口
 */
export interface RadioGroupProvide {
  props: {
    /** 当前选中的值 */
    modelValue?: string | number | boolean
    /** 单选框形状，可选值为 dot / button / check */
    shape?: RadioShape
    /** 选中的颜色 */
    checkedColor?: string
    /** 是否禁用 */
    disabled?: boolean
    /** 表单模式 */
    cell?: boolean
    /** 设置大小，可选值：default / small / large */
    size?: RadioSize
    /** 同行展示 */
    inline?: boolean
    /** 图标位置 */
    iconPlacement?: RadioIconPlacement
    /** 每个单选框的宽度 */
    itemWidth?: string
  }
  /** 更新值的回调函数 */
  updateValue: (value: string | number | boolean) => void
}

/**
 * 单选框组注入键
 * 用于父子组件通信
 */
export const RADIO_GROUP_KEY: InjectionKey<RadioGroupProvide> = Symbol('wd-radio-group')
