<!-- 标签栏项 -->
<template>
  <view
    :class="`wd-tabbar-item ${customClass}`"
    :style="customStyle"
    @click="handleClick"
  >
    <wd-badge v-bind="customBadgeProps">
      <view
        class="wd-tabbar-item__body"
        :style="bodyStyle"
      >
        <slot name="icon" :active="isActive">
          <wd-icon
            v-if="currentIconName"
            :name="currentIconName"
            :color="iconColor"
            :custom-class="`wd-tabbar-item__body-icon ${isActive ? 'is-active' : 'is-inactive'}`"
          />
        </slot>
        <text
          v-if="title"
          :style="textStyle"
          :class="`wd-tabbar-item__body-title ${isActive ? 'is-active' : 'is-inactive'}`"
        >
          {{ title }}
        </text>
      </view>
    </wd-badge>
  </view>
</template>

<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import type { WdBadgeProps } from '../wd-badge/wd-badge.vue'
import { computed } from 'vue'
import { addUnit, deepAssign, isDef, isUndefined, objToStyle, omitBy } from '../common/util'
import { useParent } from '../composables/useParent'
import wdBadge from '../wd-badge/wd-badge.vue'
import wdIcon from '../wd-icon/wd-icon.vue'
import { TABBAR_KEY } from '../wd-tabbar/wd-tabbar-key'
import { IconName } from '@/wd/components/wd-icon/wd-icon.vue'

defineOptions({
  name: 'WdTabbarItem',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 标签项组件属性接口
 */
export interface WdTabbarItemProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 标签页的标题 */
  title?: string
  /** 唯一标识符 */
  name?: string | number
  /** 图标名称 */
  icon?: IconName
  /** 激活状态的图标名称 */
  activeIcon?: string
  /** 徽标显示值 */
  value?: number | string | null
  /** 是否点状徽标 */
  isDot?: boolean
  /** 徽标最大值 */
  max?: number
  /** 徽标属性，透传给 Badge 组件 */
  badgeProps?: Partial<WdBadgeProps>
  /** 页面是否已加载（用于懒加载） */
  loaded?: boolean
  /** 图标大小 */
  iconSize?: string | number
  /** 文字大小 */
  fontSize?: string | number
}

/**
 * 标签项组件事件接口
 */
interface WdTabbarItemEmits {
  /** 更新 loaded 状态 */
  'update:loaded': [loaded: boolean]
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdTabbarItemProps>(), {
  customStyle: '',
  customClass: '',
  value: null,
  loaded: false,
})

// 定义组件事件
const emit = defineEmits<WdTabbarItemEmits>()

// 获取父组件（Tabbar）实例和当前索引
const { parent: tabbar, index } = useParent(TABBAR_KEY)

/**
 * 计算 Badge 组件属性
 * 合并用户传入的 badgeProps 和组件内部的 badge 相关属性
 */
const customBadgeProps = computed(() => {
  const badgeProps: Partial<WdBadgeProps> = deepAssign(
    isDef(props.badgeProps) ? omitBy(props.badgeProps, isUndefined) : {},
    omitBy(
      {
        max: props.max,
        isDot: props.isDot,
        modelValue: props.value,
      },
      isUndefined,
    ),
  )

  // 设置默认最大值
  if (!isDef(badgeProps.max)) {
    badgeProps.max = 99
  }

  return badgeProps
})

/**
 * 计算主体容器样式
 * 设置 CSS 变量来控制图标和文字大小
 */
const bodyStyle = computed(() => {
  const style: CSSProperties = {}

  // 计算图标大小：优先使用组件自身的 iconSize，其次使用父组件的 iconSize
  let iconSize = props.iconSize
  if (!iconSize && tabbar && tabbar.props.iconSize) {
    iconSize = tabbar.props.iconSize
  }
  if (iconSize) {
    style['--custom-icon-size'] = addUnit(iconSize)
  }

  // 计算字体大小：优先使用组件自身的 fontSize，其次使用父组件的 fontSize
  let fontSize = props.fontSize
  if (!fontSize && tabbar && tabbar.props.fontSize) {
    fontSize = tabbar.props.fontSize
  }
  if (fontSize) {
    style['--custom-font-size'] = addUnit(fontSize)
  }

  return objToStyle(style)
})

/**
 * 计算激活状态
 * 判断当前项是否为激活状态
 */
const isActive = computed(() => {
  const name = isDef(props.name) ? props.name : index.value

  if (tabbar) {
    return tabbar.props.modelValue === name
  }

  return false
})

/**
 * 计算图标颜色
 * 根据激活状态和父组件配置设置颜色
 */
const iconColor = computed(() => {
  if (tabbar) {
    if (isActive.value && tabbar.props.activeColor) {
      return tabbar.props.activeColor
    }
    if (!isActive.value && tabbar.props.inactiveColor) {
      return tabbar.props.inactiveColor
    }
  }
  return undefined
})

/**
 * 计算文字样式
 * 根据激活状态和父组件配置设置颜色
 */
const textStyle = computed(() => {
  const style: CSSProperties = {}

  if (tabbar) {
    if (isActive.value && tabbar.props.activeColor) {
      style.color = tabbar.props.activeColor
    }
    if (!isActive.value && tabbar.props.inactiveColor) {
      style.color = tabbar.props.inactiveColor
    }
  }

  return objToStyle(style)
})

/**
 * 计算当前应该显示的图标名称
 * 如果激活状态且设置了 activeIcon，使用 activeIcon
 * 否则使用默认的 icon
 */
const currentIconName = computed(() => {
  // 如果激活状态且设置了 activeIcon，使用 activeIcon
  if (isActive.value && props.activeIcon) {
    return props.activeIcon
  }

  // 否则使用默认的 icon
  return props.icon
})

/**
 * 处理点击事件
 * 触发父组件的状态变更，并自动标记为已加载
 */
const handleClick = () => {
  const name: string | number = isDef(props.name) ? props.name : index.value

  // 如果还未加载，标记为已加载
  if (!props.loaded) {
    emit('update:loaded', true)
  }

  if (tabbar) {
    tabbar.setChange({ name })
  }
}
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 暗色主题样式
.wot-theme-dark {
  @include b(tabbar-item) {
    @include e(body) {
      :deep() {
        @include when(inactive) {
          color: $-dark-color-gray;
        }
      }
    }
  }
}

// 标签项样式
@include b(tabbar-item) {
  flex: 1;
  text-align: center;
  text-decoration: none;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  // 主体区域样式
  @include e(body) {
    display: flex;
    align-items: center;
    flex-direction: column;
    line-height: 1;
    padding: 0;
    position: relative;

    // 定义 CSS 变量，优先使用自定义值，否则使用默认值
    --icon-size: var(--custom-icon-size, #{$-tabbar-item-icon-size});
    --font-size: var(--custom-font-size, #{$-tabbar-item-title-font-size});

    :deep() {
      @include when(active) {
        color: $-tabbar-active-color;
      }

      @include when(inactive) {
        color: $-tabbar-inactive-color;
      }
    }
  }

  // 标题样式
  @include e(body-title) {
    font-size: var(--font-size);
    line-height: $-tabbar-item-title-line-height;
  }

  // 图标样式
  @include edeep(body-icon) {
    font-size: var(--icon-size)!important;
  }
}
</style>
