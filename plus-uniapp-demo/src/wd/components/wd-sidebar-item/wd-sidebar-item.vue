<!-- Sidebar 侧边导航每一项 -->
<template>
  <view
    :class="`wd-sidebar-item ${active ? 'wd-sidebar-item--active' : ''} ${prefix ? 'wd-sidebar-item--prefix' : ''} ${suffix ? 'wd-sidebar-item--suffix' : ''} ${disabled ? 'wd-sidebar-item--disabled' : ''} ${customClass}`"
    :style="customStyle"
    @click="handleClick"
  >
    <slot name="icon" />
    <template v-if="!$slots.icon && icon">
      <wd-icon custom-class="wd-sidebar-item__icon" :name="icon" />
    </template>
    <wd-badge v-bind="customBadgeProps" custom-class="wd-sidebar-item__badge">
      {{ label }}
    </wd-badge>
  </view>
</template>

<script lang="ts" setup>
import type { WdBadgeProps } from '../wd-badge/wd-badge.vue'
import { computed } from 'vue'
import { deepAssign, isDef, isUndefined, omitBy } from '../common/util'
import { useParent } from '../composables/useParent'
import wdBadge from '../wd-badge/wd-badge.vue'
import wdIcon from '../wd-icon/wd-icon.vue'
import { SIDEBAR_KEY } from '../wd-sidebar/wd-sidebar-key'

defineOptions({
  name: 'WdSidebarItem',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 徽标类型
 */
type BadgeType = 'primary' | 'success' | 'warning' | 'danger' | 'info'

/**
 * 侧边栏项组件属性接口
 */
interface WdSidebarItemProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 当前选项标题 */
  label: string
  /** 当前选项的值，唯一标识 */
  value: number | string
  /** 徽标显示值 */
  badge?: string | number | null
  /** 徽标属性，透传给 Badge 组件 */
  badgeProps?: Record<string, any>
  /** 图标 */
  icon?: string
  /** 是否点状徽标 */
  isDot?: boolean
  /** 徽标最大值 */
  max?: number
  /** 是否禁用 */
  disabled?: boolean
}

/**
 * 侧边栏项组件事件接口
 */
interface WdSidebarItemEmits {
  /** 点击侧边栏项时触发 */
  itemclick: []
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdSidebarItemProps>(), {
  customStyle: '',
  customClass: '',
  badge: null,
  disabled: false,
})

// 定义组件事件
const emit = defineEmits<WdSidebarItemEmits>()

// 获取父组件（Sidebar）实例
const { parent: sidebar } = useParent(SIDEBAR_KEY)

/**
 * 计算 Badge 组件属性
 * 合并用户传入的 badgeProps 和组件内部的 badge 相关属性
 */
const customBadgeProps = computed(() => {
  const badgeProps: Partial<WdBadgeProps> = deepAssign(
    isDef(props.badgeProps) ? omitBy(props.badgeProps, isUndefined) : {},
    omitBy(
      {
        max: props.max || 99,
        isDot: props.isDot,
        modelValue: props.badge,
      },
      isUndefined,
    ),
  )
  return badgeProps
})

/**
 * 计算当前项是否激活
 */
const active = computed(() => {
  return !!(sidebar && sidebar.props.modelValue === props.value)
})

/**
 * 计算当前项是否为前缀项（激活项的前一项）
 */
const prefix = computed(() => {
  if (!sidebar) return false

  const activeIndex = sidebar.children.findIndex((c: any) => {
    return c.value === sidebar.props.modelValue
  })

  const currentIndex = sidebar.children.findIndex((c: any) => {
    return c.value === props.value
  })

  return currentIndex === activeIndex - 1
})

/**
 * 计算当前项是否为后缀项（激活项的后一项）
 */
const suffix = computed(() => {
  if (!sidebar) return false

  const activeIndex = sidebar.children.findIndex((c: any) => {
    return c.value === sidebar.props.modelValue
  })

  const currentIndex = sidebar.children.findIndex((c: any) => {
    return c.value === props.value
  })

  return currentIndex === activeIndex + 1
})

/**
 * 处理点击事件
 */
const handleClick = () => {
  if (props.disabled) return

  // 触发点击事件
  emit('itemclick')

  // 通知父组件状态变更
  sidebar && sidebar.setChange(props.value, props.label)
}
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 暗色主题样式
.wot-theme-dark {
  @include b(sidebar-item) {
    background: $-dark-background2;
    color: $-dark-color;

    &:active {
      background-color: $-dark-background4;
    }

    @include m(active) {
      background: $-dark-background;
      color: $-sidebar-active-color;
    }

    @include m(disabled) {
      color: $-dark-color-gray;

      &:active {
        background-color: $-dark-background2;
      }
    }
  }
}

// 侧边栏项主体样式
@include b(sidebar-item) {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 32rpx;
  font-size: $-sidebar-font-size;
  color: $-sidebar-color;
  background: $-sidebar-bg;
  min-height: $-sidebar-item-height;
  box-sizing: border-box;
  white-space: wrap;
  line-height: $-sidebar-item-line-height;

  &:active {
    background-color: $-sidebar-hover-bg;
  }

  @include m(active) {
    font-weight: 600;
    background: $-sidebar-active-bg;
    color: $-sidebar-active-color;

    &::before {
      position: absolute;
      top: 50%;
      left: 0;
      width: $-sidebar-active-border-width;
      height: $-sidebar-active-border-height;
      background: $-sidebar-active-color;
      transform: translateY(-50%);
      content: '';
      border-radius: $-sidebar-active-border-width;
    }

    &:active {
      background-color: transparent;
    }
  }

  @include m(prefix) {
    border-bottom-right-radius: $-sidebar-border-radius;
  }

  @include m(suffix) {
    border-top-right-radius: $-sidebar-border-radius;
  }

  @include m(disabled) {
    color: $-sidebar-disabled-color;
    cursor: not-allowed;

    &:active {
      background-color: $-sidebar-bg;
    }
  }

  @include edeep(badge) {
    z-index: 2;
    word-break: break-all;
  }

  @include edeep(icon) {
    font-size: $-sidebar-icon-size;
    margin-right: 4rpx;
  }
}
</style>
