// 步骤条注入键
import type { InjectionKey } from 'vue'
import type { WdStepsProps } from './wd-steps.vue'

/**
 * 步骤条提供给子组件的数据接口
 */
export interface StepsProvide {
  props: Partial<WdStepsProps>
  children?: any[]
}

/**
 * 步骤条注入键
 */
export const STEPS_KEY: InjectionKey<StepsProvide> = Symbol('wd-steps')
