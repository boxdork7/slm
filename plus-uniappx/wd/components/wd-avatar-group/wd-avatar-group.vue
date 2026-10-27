<!-- AvatarGroup 头像组 用于展示多个头像的组合，支持重叠显示和溢出计数。 -->
<template>
  <view :class="`wd-avatar-group is-${cascading} ${customClass}`" :style="customStyle">
    <slot />
    <view
      v-if="overflowCount > 0"
      :class="`wd-avatar wd-avatar-group__overflow ${sizeClass} is-${shape}`"
    >
      <text class="wd-avatar__text">+{{ overflowCount }}</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'
import { useChildren } from '../composables/useChildren'
import { AVATAR_GROUP_KEY } from '../wd-avatar/wd-avatar-key'

defineOptions({
  name: 'WdAvatarGroup',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 头像组重叠方向类型
 */
export type AvatarGroupCascading = 'left-up' | 'right-up'

/**
 * 头像组组件属性接口
 */
export interface WdAvatarGroupProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 最大显示数量，超出部分显示 +N */
  maxCount?: number
  /** 重叠方向 */
  cascading?: AvatarGroupCascading
  /** 头像形状 */
  shape?: 'round' | 'square'
  /** 头像尺寸 */
  size?: 'large' | 'medium' | 'normal' | 'small' | number
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdAvatarGroupProps>(), {
  customStyle: '',
  customClass: '',
  maxCount: 0,
  cascading: 'right-up',
  shape: 'round',
  size: 'normal',
})

// 管理子头像组件
const { children, linkChildren } = useChildren(AVATAR_GROUP_KEY)

// 向子组件提供数据
linkChildren({
  props,
})

/**
 * 预设尺寸样式类
 */
const sizeClass = computed(() => {
  if (typeof props.size === 'string') {
    return `wd-avatar--${props.size}`
  }
  return ''
})

/**
 * 计算溢出数量
 * 当 maxCount 大于 0 且子头像数量超过 maxCount 时显示
 */
const overflowCount = computed(() => {
  if (props.maxCount > 0 && children.length > props.maxCount) {
    return children.length - props.maxCount
  }
  return 0
})

/**
 * 监听子组件变化，隐藏超出最大数量的头像
 */
watch(
  () => [children.length, props.maxCount],
  () => {
    if (props.maxCount > 0) {
      children.forEach((child, index) => {
        if (child.$el) {
          child.$el.style.display = index < props.maxCount ? '' : 'none'
        }
      })
    }
  },
  { immediate: true },
)

/**
 * 头像组组件实例类型
 */
export type AvatarGroupInstance = InstanceType<typeof import('./wd-avatar-group.vue').default>
</script>

<style lang="scss">
@import './../common/abstracts/_mixin.scss';
@import './../common/abstracts/variable.scss';

// 头像组组件样式
@include b(avatar-group) {
  display: inline-flex;
  align-items: center;

  // 右侧优先重叠（后面的头像覆盖前面的）
  @include when(right-up) {
    .wd-avatar {
      margin-left: -16rpx;

      &:first-child {
        margin-left: 0;
      }
    }
  }

  // 左侧优先重叠（前面的头像覆盖后面的）
  @include when(left-up) {
    flex-direction: row-reverse;
    justify-content: flex-end;

    .wd-avatar {
      margin-right: -16rpx;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  // 溢出计数器样式
  @include e(overflow) {
    background-color: #c0c4cc;
    color: #fff;
    font-size: 24rpx;
    font-weight: 500;
  }
}
</style>
