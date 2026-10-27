<!-- Sidebar 侧边导航 垂直展示的导航栏，用于在不同的内容区域之间进行切换。 -->
<template>
  <view :class="`wd-sidebar ${customClass}`" :style="customStyle">
    <!-- Items 模式：通过 items 数组渲染侧边栏项 -->
    <template v-if="isItemsMode">
      <view
        v-for="(item, index) in items"
        :key="item.value"
        :class="getItemClass(item, index)"
        :style="customStyle"
        @click="handleItemClick(item, index)"
      >
        <!-- 自定义内容插槽 -->
        <slot
          v-if="item.useSlot"
          :name="item.slotName || `item-${index}`"
          :item="item"
          :index="index"
          :active="modelValue === item.value"
        />
        <!-- 默认内容 -->
        <block v-else>
          <!-- 图标插槽 -->
          <slot
            v-if="item.useIconSlot"
            :name="item.iconSlotName || `icon-${index}`"
            :item="item"
            :index="index"
          />
          <!-- 默认图标 -->
          <template v-else-if="item.icon">
            <wd-icon custom-class="wd-sidebar-item__icon" :name="item.icon" />
          </template>
          <wd-badge v-bind="getBadgeProps(item)" custom-class="wd-sidebar-item__badge">
            {{ item.label }}
          </wd-badge>
        </block>
      </view>
    </template>

    <!-- 子组件模式：使用 wd-sidebar-item 子组件 -->
    <slot v-else />

    <view class="wd-sidebar__padding" />
  </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { deepAssign, isDef, isFunction, isUndefined, omitBy } from '../common/util'
import { useChildren } from '../composables/useChildren'
import wdBadge from '../wd-badge/wd-badge.vue'
import wdIcon from '../wd-icon/wd-icon.vue'
import { SIDEBAR_KEY } from './wd-sidebar-key'

defineOptions({
  name: 'WdSidebar',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 侧边栏项配置接口
 */
export interface SidebarItem {
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
  /** 是否使用自定义内容插槽 */
  useSlot?: boolean
  /** 自定义内容插槽名称，默认为 item-{index} */
  slotName?: string
  /** 是否使用图标插槽 */
  useIconSlot?: boolean
  /** 图标插槽名称，默认为 icon-{index} */
  iconSlotName?: string

  /** 自定义数据，点击时会传递 */
  [key: string]: any
}

/**
 * Sidebar切换前的选项接口
 */
export interface SidebarBeforeChangeOption {
  /** 目标值 */
  value: number | string
  resolve: (pass: boolean) => void
}

/**
 * Sidebar切换前的钩子函数类型
 * @param option 切换选项
 */
export type SidebarBeforeChange = (option: SidebarBeforeChangeOption) => void

/**
 * 侧边栏组件属性接口
 */
interface WdSidebarProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 侧边栏项数据数组 */
  items?: SidebarItem[]
  /** 当前导航项的索引 */
  modelValue?: number | string
  /** 在改变前执行的函数 */
  beforeChange?: SidebarBeforeChange
}

/**
 * 侧边栏组件事件接口
 */
interface WdSidebarEmits {
  /** 更新选中值 */
  'update:modelValue': [value: number | string]
  /** 选中项变化时触发 */
  change: [event: { value: number | string; label: string }]
  /** 点击侧边栏项时触发 */
  'item-click': [item: SidebarItem, index: number]
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdSidebarProps>(), {
  customStyle: '',
  customClass: '',
  items: () => [],
  modelValue: 0,
})

// 定义组件事件
const emit = defineEmits<WdSidebarEmits>()

// 子组件管理（用于兼容 wd-sidebar-item 子组件模式）
const { linkChildren, children } = useChildren(SIDEBAR_KEY)

/**
 * 判断是否使用 items 模式
 * 当传入 items 数组且有内容时，使用 items 模式
 */
const isItemsMode = computed(() => {
  return props.items?.length > 0
})

/**
 * 子项状态变更
 * @param value 目标值
 * @param label 目标值标题
 */
function setChange(value: number | string, label: string) {
  if (isFunction(props.beforeChange)) {
    props.beforeChange({
      value,
      resolve: (pass: boolean) => {
        if (pass) {
          updateValue(value, label)
        }
      },
    })
  } else {
    updateValue(value, label)
  }
}

/**
 * 更新选中状态
 * @param value 目标值
 * @param label 目标值标题
 */
function updateValue(value: number | string, label: string) {
  emit('update:modelValue', value)
  emit('change', { value, label })
}

/**
 * 提供数据给子组件（仅在子组件模式下使用）
 */
linkChildren({
  props,
  children,
  setChange,
})

/**
 * 计算侧边栏项的类名（用于 items 模式）
 * @param item 侧边栏项数据
 * @param index 项目索引
 */
const getItemClass = (item: SidebarItem, index: number) => {
  const classNames = ['wd-sidebar-item']

  const active = props.modelValue === item.value
  if (active) classNames.push('wd-sidebar-item--active')
  if (item.disabled) classNames.push('wd-sidebar-item--disabled')

  // 计算前缀和后缀样式
  if (!isItemsMode.value) return classNames.join(' ')

  const activeIndex = props.items!.findIndex((i) => i.value === props.modelValue)
  if (index === activeIndex - 1) classNames.push('wd-sidebar-item--prefix')
  if (index === activeIndex + 1) classNames.push('wd-sidebar-item--suffix')

  return classNames.join(' ')
}

/**
 * 计算徽标属性（用于 items 模式）
 * @param item 侧边栏项数据
 */
const getBadgeProps = (item: SidebarItem) => {
  return deepAssign(
    isDef(item.badgeProps) ? omitBy(item.badgeProps, isUndefined) : {},
    omitBy(
      {
        max: item.max || 99,
        isDot: item.isDot,
        modelValue: item.badge,
      },
      isUndefined,
    ),
  )
}

/**
 * 处理侧边栏项点击事件（用于 items 模式）
 * @param item 侧边栏项数据
 * @param index 项目索引
 */
const handleItemClick = (item: SidebarItem, index: number) => {
  if (item.disabled) return

  // 触发点击事件
  emit('item-click', item, index)

  // 更新选中状态
  setChange(item.value, item.label)
}
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 暗色主题样式
.wot-theme-dark {
  @include b(sidebar) {
    background: $-dark-background;
    @include e(padding) {
      background: $-dark-background2;
    }
  }

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

// 侧边栏容器样式
@include b(sidebar) {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  width: $-sidebar-width;
  height: $-sidebar-height;
  background: $-color-white;

  @include e(padding) {
    flex: 1 1 auto;
    background: $-sidebar-bg;
  }
}

// 侧边栏项样式
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
