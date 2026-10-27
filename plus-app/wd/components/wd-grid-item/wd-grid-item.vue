<!-- 宫格项 -->
<template>
  <view
    :class="`wd-grid-item ${border && !gutter && itemClass ? itemClass : ''} ${customClass}`"
    :style="`${style}${customStyle}`"
    @click="handleClick"
  >
    <view
      :class="`wd-grid-item__content ${square ? 'is-square' : ''} ${border && gutter > 0 ? 'is-round' : ''}`"
      :style="gutterContentStyle"
      :hover-class="
        grid?.clickable
          ? grid.hoverClass
            ? grid.hoverClass
            : 'wd-grid-item__content--hover'
          : 'none'
      "
      :hover-stay-time="240"
    >
      <slot v-if="useSlot" />
      <block v-else>
        <view
          :style="`width:${iconSize}; height: ${iconSize}`"
          class="wd-grid-item__wrapper"
        >
          <wd-badge custom-class="badge" v-bind="customBadgeProps">
            <template v-if="useIconSlot">
              <slot name="icon" />
            </template>
            <wd-icon
              v-else
              :name="icon"
              :size="iconSize"
              :color="iconColor"
              :custom-class="customIcon"
            />
          </wd-badge>
        </view>
        <slot v-if="useTextSlot" name="text" />
        <view v-else class="wd-grid-item__text custom-text">
          {{ text }}
        </view>
      </block>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { ComponentPublicInstance, Ref } from 'vue'
import { computed, onMounted, ref, watch } from 'vue'
import { addUnit, deepAssign, isDef, isUndefined, omitBy } from '../common/util'
import { useParent } from '../composables/useParent'
import wdBadge from '../wd-badge/wd-badge.vue'
import { GRID_KEY } from '../wd-grid/wd-grid-key'
import wdIcon from '../wd-icon/wd-icon.vue'
import { IconName } from '@/wd/components/wd-icon/wd-icon.vue'

defineOptions({
  name: 'WdGridItem',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 页面跳转方式类型
 */
type LinkType = 'navigateTo' | 'switchTab' | 'reLaunch' | 'redirectTo'

/**
 * Badge 类型
 */
type BadgeType = 'primary' | 'success' | 'warning' | 'danger' | 'info'

/**
 * Badge 组件属性接口
 */
interface BadgeProps {
  modelValue?: string | number
  max?: number
  isDot?: boolean
  type?: BadgeType

  [key: string]: any
}

/**
 * 网格项组件属性接口
 */
interface WdGridItemProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string
  /** GridItem 下方文字样式 */
  customText?: string
  /** GridItem 上方 icon 样式 */
  customIcon?: string

  /** 图标名称，可选值见 wd-icon 组件 */
  icon?: IconName
  /** 图标大小 */
  iconSize?: string
  /** 图标颜色 */
  iconColor?: string
  /** 文字 */
  text?: string
  /** 点击后跳转的链接地址 */
  url?: string
  /** 页面跳转方式，可选值：navigateTo / switchTab / reLaunch / redirectTo */
  linkType?: LinkType

  /** 是否开启 GridItem 内容插槽 */
  useSlot?: boolean
  /** 是否开启 GridItem icon 插槽 */
  useIconSlot?: boolean
  /** 是否开启 GridItem text 内容插槽 */
  useTextSlot?: boolean

  /** 是否显示图标右上角小红点 */
  isDot?: boolean
  /** 图标右上角显示的 badge 类型 */
  type?: BadgeType
  /** 图标右上角 badge 显示值 */
  value?: string | number
  /** 图标右上角 badge 最大值，超过最大值会显示 '{max}+' */
  max?: number
  /** 徽标属性，透传给 Badge 组件 */
  badgeProps?: Partial<BadgeProps>
}

/**
 * 网格项组件事件接口
 */
interface WdGridItemEmits {
  /** 点击网格项时触发 */
  itemclick: []
}

/**
 * 网格项组件暴露的方法和属性接口
 */
export interface WdGridItemExpose {
  /** 设置网格项样式类名 */
  setItemClass: (classes: string) => void
  /** 当前网格项的样式类名 */
  itemClass: Ref<string>
  /** 初始化网格项 */
  init: () => void
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdGridItemProps>(), {
  customStyle: '',
  customClass: '',
  customText: '',
  customIcon: '',
  icon: '',
  iconSize: '26px',
  linkType: 'navigateTo',
  useSlot: false,
  useIconSlot: false,
  useTextSlot: false,
})

// 定义组件事件
const emit = defineEmits<WdGridItemEmits>()

// 响应式数据
const style = ref<string>('')
const gutterContentStyle = ref<string>('')
const itemClass = ref<string>('')
const gutter = ref<number>(0)
const square = ref<boolean>(false)
const border = ref<boolean>(true)

// 获取父组件（Grid）实例
const { parent: grid } = useParent(GRID_KEY)

/**
 * 获取当前网格容器中的子组件总数
 */
const childCount = computed(() => {
  if (isDef(grid) && isDef(grid.children)) {
    return grid.children.length
  }
  return 0
})

/**
 * 计算 Badge 组件属性
 * 合并用户传入的 badgeProps 和组件内部的 badge 相关属性
 */
const customBadgeProps = computed(() => {
  const badgeProps: Partial<BadgeProps> = deepAssign(
    isDef(props.badgeProps) ? omitBy(props.badgeProps, isUndefined) : {},
    omitBy(
      {
        max: props.max,
        isDot: props.isDot,
        modelValue: props.value,
        type: props.type,
      },
      isUndefined,
    ),
  )
  return badgeProps
})

/**
 * 更新网格项样式
 * 根据父组件的配置计算当前项的宽度和样式
 */
const updateItemStyle = () => {
  if (!grid) return

  const width = grid.props.column
    ? `${100 / grid.props.column}%`
    : `${100 / (childCount.value || 1)}%`

  // 单独定义间隔样式
  const gutterStyle = grid.props.gutter
    ? `padding:${addUnit(grid.props.gutter)} ${addUnit(grid.props.gutter)} 0 0; background-color: transparent;`
    : ''

  // 单独定义正方形样式
  const squareStyle = grid.props.square
    ? `background-color:transparent; padding-bottom: 0; padding-top:${width}`
    : ''

  style.value = `width: ${width}; ${squareStyle || gutterStyle}`
}

/**
 * 监听子组件数量变化
 * 当子组件数量发生变化时，重新计算样式
 */
watch(
  () => childCount.value,
  () => {
    if (!grid) return
    updateItemStyle()
  },
  { deep: true, immediate: true },
)

/**
 * 初始化网格项
 * 设置初始样式和配置信息
 */
const initGridItem = () => {
  if (!grid) return

  const children = grid.children
  const width = grid.props.column ? `${100 / grid.props.column}%` : `${100 / children.length}%`

  // 单独定义间隔样式
  const gutterStyle = grid.props.gutter
    ? `padding:${addUnit(grid.props.gutter)} ${addUnit(grid.props.gutter)} 0 0; background-color: transparent;`
    : ''

  // 单独定义正方形样式
  const squareStyle = grid.props.square
    ? `background-color:transparent; padding-bottom: 0; padding-top:${width}`
    : ''

  // 间隔+正方形组合样式
  gutterContentStyle.value =
    grid.props.gutter && grid.props.square
      ? `right: ${addUnit(grid.props.gutter)}; bottom:${addUnit(grid.props.gutter)};height: auto; background-color: ${grid.props.bgColor}`
      : `background-color: ${grid.props.bgColor}`

  // 更新配置信息
  border.value = Boolean(grid.props.border)
  square.value = Boolean(grid.props.square)
  gutter.value = Number(grid.props.gutter)
  style.value = `width: ${width}; ${squareStyle || gutterStyle}`
}

/**
 * 组件挂载后初始化
 */
onMounted(() => {
  initGridItem()
})

/**
 * 处理点击事件
 * 执行页面跳转或触发点击事件
 */
const handleClick = () => {
  // 检查父组件是否允许点击
  if (grid && !grid.props.clickable) return

  const { url, linkType } = props

  // 触发点击事件
  emit('itemclick')

  // 处理页面跳转
  if (url) {
    switch (linkType) {
      case 'navigateTo':
        uni.navigateTo({ url })
        break
      case 'reLaunch':
        uni.reLaunch({ url })
        break
      case 'redirectTo':
        uni.redirectTo({ url })
        break
      case 'switchTab':
        uni.switchTab({ url })
        break
      default:
        console.error(`[wot-design] warning(wd-grid-item): linkType can not be ${linkType}`)
        break
    }
  }
}

/**
 * 设置网格项样式类名
 * @param classes 样式类名字符串
 */
const setItemClass = (classes: string) => {
  itemClass.value = classes
}

// 暴露给父组件的方法和属性
defineExpose<WdGridItemExpose>({
  setItemClass,
  itemClass,
  init: initGridItem,
})

/** 网格项组件实例类型 */
export type GridItemInstance = ComponentPublicInstance<WdGridItemProps, WdGridItemExpose>
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

// 网格项主体样式
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

  // 第一行元素样式
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

  // 包装器样式
  @include e(wrapper) {
    display: inline-block;
    margin: 0 auto;
  }

  // 内容区域样式
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

  // 文本样式
  @include e(text) {
    margin-top: 8px;
    font-size: $-grid-item-fs;
    line-height: $-grid-item-fs;
    @include lineEllipsis;
  }
}
</style>
