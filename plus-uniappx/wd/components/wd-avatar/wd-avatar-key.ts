// Avatar 组件通信标识
import type { InjectionKey } from 'vue'

/**
 * 头像组提供的数据接口
 */
export interface AvatarGroupProvide {
  /** 头像组属性 */
  props: Partial<{
    shape: 'round' | 'square'
    size: 'large' | 'medium' | 'normal' | 'small' | number
  }>
}

/**
 * 头像组注入键
 */
export const AVATAR_GROUP_KEY: InjectionKey<AvatarGroupProvide> = Symbol('wd-avatar-group')
