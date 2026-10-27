<!-- Grid 宫格 宫格可以在水平方向上把页面分隔成等宽度的区块，用于展示内容或进行页面导航。 -->
<template>
  <view
    :class="`wd-grid ${customClass}`"
    :style="`${gutter ? `padding-left: ${addUnit(gutter)}; padding-bottom: ${addUnit(gutter)};` : ''}${customStyle}`"
  >
    <!-- Items 模式：通过 items 数组渲染网格项 -->
    <template v-if="isItemsMode">
      <view
        v-for="(item, index) in items"
        :key="index"
        :class="getItemClass(index)"
        :style="getItemStyle(index)"
        @click="handleItemClick(item, index)"
      >
        <view
          :class="getItemContentClass()"
          :style="getItemContentStyle()"
          :hover-class="
            clickable ? hoverClass || 'wd-grid-item__content--hover' : 'none'
          "
          :hover-stay-time="240"
        >
          <!-- 自定义内容插槽 -->
          <slot
            v-if="item.useSlot"
            :name="item.slotName || `item-${index}`"
            :item="item"
            :index="index"
          />
          <!-- 默认内容 -->
          <block v-else>
            <view
              :style="`width: ${item.iconSize || '26px'}; height: ${item.iconSize || '26px'}`"
              class="wd-grid-item__wrapper"
            >
              <wd-badge v-bind="getBadgeProps(item)">
                <!-- 图标插槽 -->
                <slot
                  v-if="item.useIconSlot"
                  :name="item.iconSlotName || `icon-${index}`"
                  :item="item"
                  :index="index"
                />
                <!-- 默认图标 -->
                <wd-icon
                  v-else
                  :name="item.icon"
                  :size="item.iconSize || '26px'"
                  :color="item.iconColor"
                  :custom-class="item.customIcon"
                />
              </wd-badge>
            </view>
            <!-- 文字插槽 -->
            <slot
              v-if="item.useTextSlot"
              :name="item.textSlotName || `text-${index}`"
              :item="item"
              :index="index"
            />
            <!-- 默认文字 -->
            <view v-else class="wd-grid-item__text" :style="item.customText">
              {{ item.text }}
            </view>
          </block>
        </view>
      </view>
    </template>

    <!-- 子组件模式：使用 wd-grid-item 子组件 -->
    <slot v-else />
  </view>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import { addUnit, debounce, deepAssign, isDef, isUndefined, omitBy } from '../common/util'
import { useChildren } from '../composables/useChildren'
import wdBadge from '../wd-badge/wd-badge.vue'
import wdIcon from '../wd-icon/wd-icon.vue'
import { GRID_KEY } from './wd-grid-key'

defineOptions({
  name: 'WdGrid',
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
 * 链接跳转类型
 */
type LinkType = 'navigateTo' | 'switchTab' | 'reLaunch' | 'redirectTo'

/**
 * 网格项配置接口
 */
export interface GridItem {
  /** 图标名称 */
  icon?: string
  /** 图标大小 */
  iconSize?: string
  /** 图标颜色 */
  iconColor?: string
  /** 图标自定义样式 */
  customIcon?: string
  /** 文字内容 */
  text?: string
  /** 文字自定义样式 */
  customText?: string
  /** 点击跳转链接 */
  url?: string
  /** 链接跳转方式 */
  linkType?: LinkType
  /** 是否使用自定义内容插槽 */
  useSlot?: boolean
  /** 自定义内容插槽名称，默认为 item-{index} */
  slotName?: string
  /** 是否使用图标插槽 */
  useIconSlot?: boolean
  /** 自定义图标插槽名称，默认为 icon-{index} */
  iconSlotName?: string
  /** 是否使用文字插槽 */
  useTextSlot?: boolean
  /** 自定义文字插槽名称，默认为 text-{index} */
  textSlotName?: string
  /** 是否显示小红点 */
  isDot?: boolean
  /** 徽标类型 */
  type?: BadgeType
  /** 徽标显示值 */
  value?: string | number
  /** 徽标最大值 */
  max?: number
  /** 徽标自定义属性 */
  badgeProps?: Record<string, any>

  /** 自定义数据，点击时会传递 */
  [key: string]: any
}

/**
 * 网格组件属性接口
 */
interface WdGridProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 网格项数据数组 */
  items?: GridItem[]
  /** 是否开启格子点击反馈 */
  clickable?: boolean
  /** 是否将格子固定为正方形 */
  square?: boolean
  /** 列数 */
  column?: number
  /** 是否显示边框 */
  border?: boolean
  /** 背景颜色 */
  bgColor?: string
  /** 格子之间的间距，默认单位为px */
  gutter?: number
  /** 自定义内容区域hover-class */
  hoverClass?: string
}

/**
 * 网格组件事件接口
 */
interface WdGridEmits {
  /** 点击网格项时触发 */
  'item-click': [item: GridItem, index: number]
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdGridProps>(), {
  customStyle: '',
  customClass: '',
  items: () => [],
  clickable: false,
  square: false,
  column: 4,
  border: false,
  bgColor: '',
  gutter: 0,
})

// 定义组件事件
const emit = defineEmits<WdGridEmits>()

// 子组件管理（用于兼容 wd-grid-item 子组件模式）
const { linkChildren, children } = useChildren(GRID_KEY)

// 创建异步任务队列
const nextTick = () => new Promise((resolve) => setTimeout(resolve, 20))

/**
 * 判断是否使用 items 模式
 * 当传入 items 数组且有内容时，使用 items 模式
 */
const isItemsMode = computed(() => {
  return props.items?.length > 0
})

/**
 * 提供数据给子组件（仅在子组件模式下使用）
 */
linkChildren({
  props,
  children,
})

/**
 * 初始化子组件网格项（用于子组件模式）
 */
const initChildrenGridItems = () => {
  if (!children || isItemsMode.value) return

  children.forEach((item, index) => {
    if (props.border) {
      const { column } = props
      if (column) {
        const isRightItem = children.length - 1 === index || (index + 1) % column === 0
        const isFirstLine = index + 1 <= column

        if (isFirstLine) item.$.exposed!.setItemClass('is-first')
        if (isRightItem) item.$.exposed!.setItemClass('is-right')
        if (!isFirstLine) item.$.exposed!.setItemClass('is-border')
      } else {
        item.$.exposed!.setItemClass('is-first')
      }

      if (children.length - 1 === index) {
        item.$.exposed!.setItemClass(`${item.$.exposed!.itemClass.value} is-last`)
      }
    }
    item.$.exposed!.init()
  })
}

/**
 * 监听列数变化
 * 验证列数的有效性
 */
watch(
  () => props.column,
  (val, oldVal) => {
    if (val === oldVal) return
    if (val && val <= 0) {
      console.error(
        'The number of columns attribute value is invalid. The attribute must be greater than 0 and it is not recommended to use a larger value attribute.',
      )
    }
    // 仅在子组件模式下重新初始化
    if (!isItemsMode.value && oldVal) {
      initChildrenGridItems()
    }
  },
  { deep: true, immediate: true },
)

/**
 * 监听边框变化
 * 在子组件模式下重新初始化
 */
watch(
  () => props.border,
  (val) => {
    if (val && !isItemsMode.value) {
      Promise.resolve()
        .then(nextTick)
        .then(() => {
          initChildrenGridItems()
        })
    }
  },
  { deep: true, immediate: true },
)

/**
 * 防抖处理子组件变化
 */
const handleChildrenChange = debounce(() => {
  initChildrenGridItems()
}, 50)

/**
 * 监听子组件变化（仅在子组件模式下）
 */
watch(
  () => children,
  () => {
    if (!isItemsMode.value) {
      handleChildrenChange()
    }
  },
  { deep: true },
)

/**
 * 计算网格项的类名（用于 items 模式）
 * @param index 项目索引
 */
const getItemClass = (index: number) => {
  const classNames = ['wd-grid-item']

  if (props.border && !props.gutter) {
    const { column } = props
    if (column) {
      const isRightItem = index === props.items!.length - 1 || (index + 1) % column === 0
      const isFirstLine = index + 1 <= column

      if (isFirstLine) classNames.push('is-first')
      if (isRightItem) classNames.push('is-right')
      if (!isFirstLine) classNames.push('is-border')
    } else {
      classNames.push('is-first')
    }

    if (index === props.items!.length - 1) {
      classNames.push('is-last')
    }
  }

  return classNames.join(' ')
}

/**
 * 计算网格项的样式（用于 items 模式）
 * @param index 项目索引
 */
const getItemStyle = (index: number) => {
  const { column, square, gutter } = props
  const totalItems = props.items!.length
  const width = column ? `${100 / column}%` : `${100 / totalItems}%`

  const styles: string[] = [`width: ${width}`]

  // 间距样式
  if (gutter) {
    styles.push(`padding: ${addUnit(gutter)} ${addUnit(gutter)} 0 0`)
    styles.push('background-color: transparent')
  }

  // 正方形样式
  if (square) {
    styles.push('background-color: transparent')
    styles.push('padding-bottom: 0')
    styles.push(`padding-top: ${width}`)
  }

  return styles.join('; ')
}

/**
 * 计算网格项内容区域的类名（用于 items 模式）
 */
const getItemContentClass = () => {
  const classNames = ['wd-grid-item__content']

  if (props.square) classNames.push('is-square')
  if (props.border && props.gutter > 0) classNames.push('is-round')

  return classNames.join(' ')
}

/**
 * 计算网格项内容区域的样式（用于 items 模式）
 */
const getItemContentStyle = () => {
  const { gutter, square, bgColor } = props

  if (gutter && square) {
    return `right: ${addUnit(gutter)}; bottom: ${addUnit(gutter)}; height: auto; background-color: ${bgColor}`
  }

  return `background-color: ${bgColor}`
}

/**
 * 计算徽标属性（用于 items 模式）
 * @param item 网格项数据
 */
const getBadgeProps = (item: GridItem) => {
  return deepAssign(
    isDef(item.badgeProps) ? omitBy(item.badgeProps, isUndefined) : {},
    omitBy(
      {
        max: item.max,
        isDot: item.isDot,
        modelValue: item.value,
        type: item.type,
      },
      isUndefined,
    ),
  )
}

/**
 * 处理网格项点击事件（用于 items 模式）
 * @param item 网格项数据
 * @param index 项目索引
 */
const handleItemClick = (item: GridItem, index: number) => {
  if (!props.clickable) return

  // 触发点击事件
  emit('item-click', item, index)

  // 处理链接跳转
  if (item.url) {
    const linkType = item.linkType || 'navigateTo'

    switch (linkType) {
      case 'navigateTo':
        uni.navigateTo({ url: item.url })
        break
      case 'reLaunch':
        uni.reLaunch({ url: item.url })
        break
      case 'redirectTo':
        uni.redirectTo({ url: item.url })
        break
      case 'switchTab':
        uni.switchTab({ url: item.url })
        break
      default:
        console.error(`[wot-design] warning(wd-grid): linkType can not be ${linkType}`)
        break
    }
  }
}
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 暗色主题样式
.wot-theme-dark {
  @include b(grid-item) {
    @include when(border) {
      &::before {
        background-color: $-dark-border-color;
      }
      &::after {
        background-color: $-dark-border-color;
      }
    }

    // 第一行元素
    @include when(first) {
      &::after {
        background-color: $-dark-border-color;
      }
    }

    @include e(content) {
      background-color: $-dark-background2;

      @include m(hover) {
        background-color: $-grid-item-hover-bg-dark !important;
      }
    }
  }
}

// 网格容器样式
@include b(grid) {
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  height: auto;
}

// 网格项样式
@include b(grid-item) {
  height: 100%;
  font-size: $-grid-item-fs;
  box-sizing: border-box;
  position: relative;
  float: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  overflow: hidden;

  // 边框样式
  @include when(border) {
    &::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 1px;
      transform: scaleY(0.5);
      background-color: $-grid-item-border-color;
      top: 0;
      left: 0;
      z-index: 1;
    }
    &::after {
      content: '';
      position: absolute;
      width: 1px;
      transform: scaleX(0.5);
      height: 100%;
      background-color: $-grid-item-border-color;
      bottom: 0;
      right: 0;
    }
  }

  // 第一行元素
  @include when(first) {
    &::after {
      content: '';
      position: absolute;
      width: 1px;
      transform: scaleX(0.5);
      height: 100%;
      background-color: $-grid-item-border-color;
      bottom: 0;
      right: 0;
    }
  }

  // 每行右侧的元素
  @include when(right) {
    &::after {
      display: none;
    }
  }

  // 最后一个元素
  @include when(last) {
    &::after {
      display: none;
    }
  }

  // 包装器
  @include e(wrapper) {
    display: inline-block;
    margin: 0 auto;
  }

  // 内容区域
  @include e(content) {
    height: 100%;
    padding: $-grid-item-padding;
    background-color: $-grid-item-bg;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;

    // 正方形样式
    @include when(square) {
      box-sizing: border-box;
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      padding: 0;
      height: 100%;
    }

    // 圆角样式
    @include when(round) {
      &::after {
        content: ' ';
        position: absolute;
        top: 0;
        left: 0;
        width: 200%;
        height: 200%;
        border: 1px solid $-grid-item-border-color;
        transform-origin: top left;
        transform: scale(0.5);
        box-sizing: border-box;
      }
    }

    // 悬停样式
    @include m(hover) {
      background-color: $-grid-item-hover-bg !important;
    }
  }

  // 文字样式
  @include e(text) {
    margin-top: 8px;
    font-size: $-grid-item-fs;
    line-height: $-grid-item-fs;
    @include lineEllipsis;
  }
}
</style>
