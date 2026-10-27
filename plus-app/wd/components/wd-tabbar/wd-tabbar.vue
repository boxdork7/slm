<!-- Tabbar 标签栏 底部导航栏，用于在不同页面之间进行切换。 -->
<template>
  <view
    :class="`${fixed && placeholder && safeAreaInsetBottom && shape === 'round' ? 'wd-tabbar__placeholder' : ''}`"
    :style="fixed && placeholder ? `height: ${addUnit(height)};` : ''"
  >
    <!-- 标签栏主体容器 -->
    <view
      :class="`wd-tabbar wd-tabbar--${shape} ${fixed ? 'is-fixed' : ''} ${safeAreaInsetBottom ? 'is-safe' : ''} ${bordered ? 'is-border' : ''} ${customClass}`"
      :style="`${isDef(zIndex) ? `z-index: ${zIndex};` : ''}${customStyle}`"
    >
      <!-- Items 模式：通过 items 数组渲染标签项 -->
      <template v-if="isItemsMode">
        <view
          v-for="(item, index) in items"
          :key="item.name || index"
          :class="`wd-tabbar-item ${customClass}`"
          @click="handleItemClick(item, index)"
        >
          <wd-badge v-bind="getCustomBadgeProps(item)">
            <view
              class="wd-tabbar-item__body"
              :style="getBodyStyle(item, index)"
            >
              <!-- 自定义图标插槽 -->
              <slot :name="`icon-${item.name || index}`" :active="isItemActive(item, index)">
                <wd-icon
                  v-if="getIconName(item, index)"
                  :name="getIconName(item, index)"
                  :color="getIconColor(item, index)"
                  :custom-class="`wd-tabbar-item__body-icon ${isItemActive(item, index) ? 'is-active' : 'is-inactive'}`"
                />
              </slot>
              <text
                v-if="item.title"
                :style="getTextStyle(item, index)"
                :class="`wd-tabbar-item__body-title ${isItemActive(item, index) ? 'is-active' : 'is-inactive'}`"
              >
                {{ item.title }}
              </text>
            </view>
          </wd-badge>
        </view>
      </template>

      <!-- 子组件模式：使用 wd-tabbar-item 子组件 -->
      <slot v-else />
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import type { WdBadgeProps } from '../wd-badge/wd-badge.vue'
import type { WdTabbarItemProps } from '../wd-tabbar-item/wd-tabbar-item.vue'
import { computed, getCurrentInstance, nextTick, onMounted, ref, watch } from 'vue'
import {
  addUnit,
  deepAssign,
  getRect,
  isDef,
  isUndefined,
  objToStyle,
  omitBy,
  pxToRpx,
} from '../common/util'
import { useChildren } from '../composables/useChildren'
import wdBadge from '../wd-badge/wd-badge.vue'
import wdIcon from '../wd-icon/wd-icon.vue'
import { TABBAR_KEY } from './wd-tabbar-key'

defineOptions({
  name: 'WdTabbar',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 标签栏形状类型
 */
export type TabbarShape = 'default' | 'round'

/**
 * 标签栏组件属性接口
 */
interface WdTabbarProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 选中标签的索引值或者名称 */
  modelValue?: number | string
  /** 标签栏配置列表 */
  items?: WdTabbarItemProps[]

  /** 是否固定在底部 */
  fixed?: boolean
  /** 是否显示顶部边框 */
  bordered?: boolean
  /** 是否设置底部安全距离（iPhone X 类型的机型） */
  safeAreaInsetBottom?: boolean
  /** 标签栏的形状 */
  shape?: TabbarShape
  /** 激活标签的颜色 */
  activeColor?: string
  /** 未激活标签的颜色 */
  inactiveColor?: string
  /** 固定在底部时，是否在标签位置生成一个等高的占位元素 */
  placeholder?: boolean
  /** tabbar组件的层级 */
  zIndex?: number
  /** 图标大小 */
  iconSize?: string | number
  /** 文字大小 */
  fontSize?: string | number
}

/**
 * 标签栏组件事件接口
 */
interface WdTabbarEmits {
  /** v-model 更新事件 */
  'update:modelValue': [value: number | string]
  /** tabbar标签切换时触发 */
  change: [value: number | string]
  /** 更新 items 的 loaded 状态 */
  'update:items': [items: WdTabbarItemProps[]]
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdTabbarProps>(), {
  customStyle: '',
  customClass: '',
  modelValue: 0,
  items: () => [],
  fixed: true,
  bordered: true,
  safeAreaInsetBottom: true,
  shape: 'default',
  placeholder: true,
  zIndex: 99,
})

// 定义组件事件
const emit = defineEmits<WdTabbarEmits>()

// 响应式数据
const height = ref<number | string>('') // 占位高度

// 获取当前组件实例
const { proxy } = getCurrentInstance() as any

// 子组件管理（用于兼容 wd-tabbar-item 子组件模式）
const { linkChildren } = useChildren(TABBAR_KEY)

/**
 * 判断是否使用 items 模式
 * 当传入 items 数组且有内容时，使用 items 模式
 */
const isItemsMode = computed(() => {
  return props.items && props.items.length > 0
})

/**
 * 处理子组件变更（用于子组件模式）
 * @param child 子组件数据
 */
const handleChildChange = (child: WdTabbarItemProps) => {
  const active = child.name
  emit('update:modelValue', active)
  emit('change', active)
}

/**
 * 提供数据给子组件（仅在子组件模式下使用）
 */
linkChildren({
  props,
  setChange: handleChildChange,
})

/**
 * 设置占位高度
 * 当标签栏固定定位且需要占位时，计算并设置占位高度
 */
const setPlaceholderHeight = () => {
  if (!props.fixed || !props.placeholder) {
    return
  }

  getRect('.wd-tabbar', false, proxy).then((res) => {
    height.value = Number(pxToRpx(res.height))
  })
}

/**
 * 监听相关属性变化
 * 当固定定位或占位属性变化时，重新计算占位高度
 */
watch(
  [() => props.fixed, () => props.placeholder],
  () => {
    setPlaceholderHeight()
  },
  { deep: true, immediate: false },
)

/**
 * 判断项目是否激活（用于 items 模式）
 * @param item 标签项配置
 * @param index 项目索引
 */
const isItemActive = (item: WdTabbarItemProps, index: number): boolean => {
  const name = isDef(item.name) ? item.name : index
  return props.modelValue === name
}

/**
 * 获取图标名称（用于 items 模式）
 * 如果有 activeIcon 且当前项激活，返回 activeIcon
 * 否则返回默认的 icon
 * @param item 标签项配置
 * @param index 项目索引
 */
const getIconName = (item: WdTabbarItemProps, index: number): string | undefined => {
  const active = isItemActive(item, index)

  // 如果激活状态且设置了 activeIcon，使用 activeIcon
  if (active && item.activeIcon) {
    return item.activeIcon
  }

  // 否则使用默认的 icon
  return item.icon
}

/**
 * 获取徽标属性（用于 items 模式）
 * @param item 标签项配置
 */
const getCustomBadgeProps = (item: WdTabbarItemProps) => {
  const badgeProps: Partial<WdBadgeProps> = deepAssign(
    isDef(item.badgeProps) ? omitBy(item.badgeProps, isUndefined) : {},
    omitBy(
      {
        max: item.max,
        isDot: item.isDot,
        modelValue: item.value,
      },
      isUndefined,
    ),
  )
  if (!isDef(badgeProps.max)) {
    badgeProps.max = 99
  }
  return badgeProps
}

/**
 * 获取图标颜色（用于 items 模式）
 * @param item 标签项配置
 * @param index 项目索引
 */
const getIconColor = (item: WdTabbarItemProps, index: number): string | undefined => {
  const active = isItemActive(item, index)

  if (active && props.activeColor) {
    return props.activeColor
  }
  if (!active && props.inactiveColor) {
    return props.inactiveColor
  }

  return undefined // 没有自定义颜色时返回 undefined，使用默认颜色
}

/**
 * 获取主体容器样式（用于 items 模式）
 * 设置 CSS 变量来控制图标和文字大小
 * @param item 标签项配置
 * @param index 项目索引
 */
const getBodyStyle = (item: WdTabbarItemProps, index: number): string => {
  const style: CSSProperties = {}

  // 设置图标大小 CSS 变量
  if (props.iconSize) {
    style['--custom-icon-size'] = addUnit(props.iconSize)
  }

  // 设置文字大小 CSS 变量
  if (props.fontSize) {
    style['--custom-font-size'] = addUnit(props.fontSize)
  }

  return objToStyle(style)
}
/**
 * 获取文字样式（用于 items 模式）
 * @param item 标签项配置
 * @param index 项目索引
 */
const getTextStyle = (item: WdTabbarItemProps, index: number): string => {
  const style: CSSProperties = {}
  const active = isItemActive(item, index)

  if (active && props.activeColor) {
    style.color = props.activeColor
  }
  if (!active && props.inactiveColor) {
    style.color = props.inactiveColor
  }

  return objToStyle(style)
}

/**
 * 处理项目点击（用于 items 模式）
 * @param item 标签项配置
 * @param index 项目索引
 */
const handleItemClick = (item: WdTabbarItemProps, index: number) => {
  const name = isDef(item.name) ? item.name : index

  // 自动标记当前页面为已加载
  const currentItems = [...props.items!]
  if (!currentItems[index].loaded) {
    currentItems[index].loaded = true
    emit('update:items', currentItems)
  }

  emit('update:modelValue', name)
  emit('change', name)
}

/**
 * 获取当前激活项的索引（用于 items 模式）
 */
const getCurrentIndex = (): number => {
  for (let i = 0; i < props.items!.length; i++) {
    const item = props.items![i]
    const name = isDef(item.name) ? item.name : i
    if (props.modelValue === name) {
      return i
    }
  }
  return 0 // 默认返回第一个
}

/**
 * 组件挂载后处理
 */
onMounted(() => {
  // 设置占位高度
  if (props.fixed && props.placeholder) {
    nextTick(() => {
      setPlaceholderHeight()
    })
  }

  // 确保当前选中的页面被标记为已加载（仅在 items 模式下）
  if (isItemsMode.value) {
    const currentIndex = getCurrentIndex()
    if (currentIndex >= 0 && currentIndex < props.items!.length) {
      const currentItems = [...props.items!]
      if (!currentItems[currentIndex].loaded) {
        currentItems[currentIndex].loaded = true
        emit('update:items', currentItems)
      }
    }
  }
})
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 暗色主题样式
.wot-theme-dark {
  @include b(tabbar) {
    background: $-dark-background;

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
}

// 标签栏主体样式
@include b(tabbar) {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  position: relative;
  background: $-color-white;
  height: $-tabbar-height;

  // 占位元素样式
  @include e(placeholder) {
    box-sizing: content-box;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }

  // 圆形样式
  @include m(round) {
    margin-left: 32rpx;
    margin-right: 32rpx;
    border-radius: 999rpx;
    box-shadow: $-tabbar-box-shadow;

    @include when(fixed) {
      @include when(safe) {
        bottom: constant(safe-area-inset-bottom);
        bottom: env(safe-area-inset-bottom);
      }
    }
  }

  // 默认样式
  @include m(default) {
    @include when(fixed) {
      @include when(safe) {
        box-sizing: content-box;
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);
      }
    }

    @include when(border) {
      @include halfPixelBorder('top');
    }
  }

  // 固定定位样式
  @include when(fixed) {
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 500;
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
