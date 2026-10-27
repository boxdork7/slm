// 复选框组注入键
import type { InjectionKey } from 'vue'
import type { CheckboxGroupModelValue, CheckShape } from './wd-checkbox-group.vue'

/**
 * 复选框组提供的数据接口
 */
export interface CheckboxGroupProvide {
  props: {
    /** 绑定值，支持数组或字符串 */
    modelValue: CheckboxGroupModelValue
    /** 表单模式 */
    cell?: boolean
    /** 复选框形状，可选值：circle / square / button */
    shape?: CheckShape
    /** 选中的颜色 */
    checkedColor?: string
    /** 禁用 */
    disabled?: boolean
    /** 最小选中的数量 */
    min?: number
    /** 最大选中的数量，0 为无限数量 */
    max?: number
    /** 同行展示 */
    inline?: boolean
    /** 设置大小，可选值：large */
    size?: string
    /** 字符串模式的分隔符，默认为逗号 */
    separator?: string
  }
  /** 子组件列表 */
  children?: any[]
  /** 改变选中状态回调函数 */
  changeSelectState: (value: string | number | boolean) => void
  /** 获取标准化的数组值 */
  getArrayValue: () => Array<string | number | boolean>
}

/**
 * 复选框组注入键
 * 用于父子组件通信
 */
export const CHECKBOX_GROUP_KEY: InjectionKey<CheckboxGroupProvide> = Symbol('wd-checkbox-group')
