<!-- Skeleton 骨架屏 用于等待加载内容所展示的占位图形组合，有动态效果加载效果，减少用户等待焦虑。 -->
<template>
  <view :class="`wd-skeleton ${customClass}`" :style="customStyle">
    <view v-if="loading === undefined || loading === true" class="wd-skeleton__content">
      <view v-for="(row, index) of parsedRowCols" :key="`row-${index}`" class="wd-skeleton__row">
        <view
          v-for="(col, idx) of row"
          :key="`col-${idx}`"
          :class="getColItemClass(col)"
          :style="getColItemStyle(col)"
        />
      </view>
    </view>
    <view v-else>
      <slot />
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import { computed, ref, watch } from 'vue'
import { addUnit, isNumber } from '../common/util'

defineOptions({
  name: 'WdSkeleton',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 骨架屏主题类型
 */
type SkeletonTheme = 'text' | 'avatar' | 'paragraph' | 'image'

/**
 * 骨架屏动画类型
 */
type SkeletonAnimation = 'gradient' | 'flashed'

/**
 * 骨架屏行列对象配置
 */
interface SkeletonRowColObj {
  [key: string]: any

  /** 骨架屏类型 */
  type?: 'rect' | 'circle' | 'text'
  /** 尺寸（同时设置宽高） */
  size?: string | number
  /** 宽度 */
  width?: string | number
  /** 高度 */
  height?: string | number
  /** 外边距 */
  margin?: string | number
  /** 背景色 */
  background?: string
  /** 左外边距 */
  marginLeft?: string | number
  /** 右外边距 */
  marginRight?: string | number
  /** 圆角半径 */
  borderRadius?: string | number
  /** 背景颜色 */
  backgroundColor?: string
}

/**
 * 骨架屏行列配置类型
 */
type SkeletonRowCol = number | SkeletonRowColObj | Array<SkeletonRowColObj>

/**
 * 骨架屏组件属性接口
 */
interface WdSkeletonProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 骨架图风格，有基础、头像组合等类型 */
  theme?: SkeletonTheme
  /** 用于设置行列数量、宽度高度、间距等 */
  rowCol?: SkeletonRowCol[]
  /** 是否为加载状态，如果是则显示骨架图，如果不是则显示加载完成的内容 */
  loading?: boolean
  /** 动画效果，有「渐变加载动画」和「闪烁加载动画」两种，值为空则表示没有动画 */
  animation?: SkeletonAnimation | ''
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdSkeletonProps>(), {
  customStyle: '',
  customClass: '',
  theme: 'text',
  rowCol: () => [],
  loading: true,
  animation: '',
})

// 响应式数据：行列配置
const rowCols = ref<SkeletonRowCol[]>([])

/**
 * 主题预设配置映射
 * 定义不同主题下的默认骨架屏布局
 */
const themeMap: Record<SkeletonTheme, SkeletonRowCol[]> = {
  avatar: [{ type: 'circle', height: '128rpx', width: '128rpx' }],
  image: [{ type: 'rect', height: '128rpx', width: '128rpx' }],
  text: [
    1,
    [
      { width: '24%', height: '32rpx', marginRight: '32rpx' },
      { width: '76%', height: '32rpx' },
    ],
  ],
  paragraph: [1, 1, 1, { width: '55%' }],
}

/**
 * 监听 rowCol 属性变化
 * 当 rowCol 发生变化时，更新内部行列配置
 */
watch(
  () => props.rowCol,
  (rowCol) => {
    rowCols.value = [
      ...(Array.isArray(rowCol) && rowCol.length ? props.rowCol : themeMap[props.theme]),
    ]
  },
  { immediate: true },
)

/**
 * 获取列项的类名
 * @param rowCol 行列配置对象
 * @returns 类名数组
 */
const getColItemClass = (rowCol: SkeletonRowColObj) => {
  return [
    'wd-skeleton__col',
    `wd-skeleton--type-${rowCol.type || 'text'}`,
    { [`wd-skeleton--animation-${props.animation}`]: props.animation },
  ]
}

/**
 * 获取列项的样式
 * @param rowCol 行列配置对象
 * @returns 样式对象
 */
const getColItemStyle = (rowCol: SkeletonRowColObj) => {
  const style: CSSProperties = {}
  const styleNames = [
    'size',
    'width',
    'height',
    'margin',
    'background',
    'marginLeft',
    'marginRight',
    'borderRadius',
    'backgroundColor',
  ]

  for (const name of styleNames) {
    if (Object.prototype.hasOwnProperty.call(rowCol, name)) {
      const value = addUnit(rowCol[name])

      if (name === 'size') {
        // size 属性同时设置宽高
        style.width = value
        style.height = value
      } else {
        ;(style as any)[name] = value
      }
    }
  }

  return style
}

/**
 * 解析后的行列配置
 * 将原始配置转换为包含样式和类名的渲染数据
 */
const parsedRowCols = computed(() => {
  return rowCols.value.map((item) => {
    // 处理数字类型（生成默认文本骨架）
    if (isNumber(item)) {
      return [
        {
          class: getColItemClass({ type: 'text' }),
          style: {},
        },
      ]
    }

    // 处理数组类型（多列配置）
    if (Array.isArray(item)) {
      return item.map((col) => {
        return {
          ...col,
          class: getColItemClass(col),
          style: getColItemStyle(col),
        }
      })
    }

    // 处理对象类型（单列配置）
    const nItem = item as SkeletonRowColObj
    return [
      {
        ...nItem,
        class: getColItemClass(nItem),
        style: getColItemStyle(nItem),
      },
    ]
  })
})
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 暗色主题样式
.wot-theme-dark {
  @include b(skeleton) {
    @include e(col) {
      background-color: $-dark-background4;
    }
  }
}

// 骨架屏主体样式
@include b(skeleton) {
  box-sizing: border-box;

  // 行样式
  @include e(row) {
    justify-content: space-between;
    margin-bottom: $-skeleton-row-margin-bottom;
    display: flex;
    align-items: center;

    &:only-child,
    &:last-child {
      margin-bottom: 0;
    }
  }

  // 列样式
  @include e(col) {
    border-radius: $-skeleton-border-radius-text;
    background-color: $-skeleton-background-color;
    display: flex;
    align-items: center;
    justify-content: center;

    &:first-child:last-child,
    &:last-child {
      margin-right: 0;
    }
  }

  // 类型样式
  @include m(type) {
    &-text {
      width: 100%;
      height: $-skeleton-text-height-default;
      border-radius: $-skeleton-border-radius-text;
    }

    &-rect {
      width: 100%;
      height: $-skeleton-rect-height-default;
      border-radius: $-skeleton-border-radius-rect;
    }

    &-circle {
      flex-shrink: 0;
      width: $-skeleton-circle-height-default;
      height: $-skeleton-circle-height-default;
      border-radius: $-skeleton-border-radius-circle;
    }
  }

  // 动画样式
  @include m(animation) {
    &-gradient {
      position: relative;
      overflow-x: hidden;

      &::after {
        content: ' ';
        position: absolute;
        animation: wd-skeleton-gradient 1.5s linear 2s infinite;
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0),
          $-skeleton-animation-gradient,
          rgba(255, 255, 255, 0)
        );
        inset: 0;
      }
    }

    &-flashed {
      animation: wd-skeleton-flashed 2s linear 2s infinite;
    }
  }

  // 渐变动画关键帧
  @keyframes wd-skeleton-gradient {
    0% {
      transform: translateX(-100%) skewX(-15deg);
    }
    100% {
      transform: translateX(100%) skewX(-15deg);
    }
  }

  // 闪烁动画关键帧
  @keyframes wd-skeleton-flashed {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.3;
      background-color: $-skeleton-animation-flashed;
    }
    100% {
      opacity: 1;
    }
  }
}
</style>
