import type { InjectionKey } from 'vue'
import type { FormRules } from './wd-form.vue'

/**
 * 表单容器提供的数据接口
 */
export interface FormProvide {
  props: {
    /** 表单数据对象 */
    model: Record<string, any>
    /** 表单验证规则 */
    rules?: FormRules
    /** 是否显示边框 */
    border?: boolean
    /** 是否在输入时重置表单校验信息 */
    resetOnChange?: boolean
    /** 错误提示类型 */
    errorType?: 'toast' | 'message' | 'none'
  }
  /** 错误信息对象 */
  errorMessages?: Record<string, string>
  /** 子组件列表 */
  children: any[]
  /** 清除指定字段的错误信息方法 */
  clearFieldMessage?: (prop: string) => void
}

/**
 * 表单容器注入键
 * 用于父子组件通信
 */
export const FORM_KEY: InjectionKey<FormProvide> = Symbol('wd-form')
