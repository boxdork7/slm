<!-- Cell 单元格分组。 -->
<template>
  <view
    :class="`wd-cell-group ${border ? 'is-border' : ''} ${insert ? 'is-insert' : ''} ${customClass}`"
    :style="customStyle"
  >
    <view v-if="title || value || useSlot" class="wd-cell-group__title">
      <!-- 左侧标题 -->
      <view class="wd-cell-group__left">
        <text v-if="!$slots.title">
          {{ title }}
        </text>
        <slot v-else name="title" />
      </view>
      <!-- 右侧标题 -->
      <view class="wd-cell-group__right">
        <text v-if="!$slots.value">
          {{ value }}
        </text>
        <slot v-else name="value" />
      </view>
    </view>
    <view class="wd-cell-group__body">
      <slot />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useChildren } from '../composables/useChildren'
import { CELL_GROUP_KEY } from './wd-cell-group-key'

defineOptions({
  name: 'WdCellGroup',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * Cell Group 组件属性接口
 */
interface WdCellGroupProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 分组标题 */
  title?: string
  /** 分组右侧内容 */
  value?: string
  /** 分组启用插槽 */
  useSlot?: boolean
  /** 是否展示边框线 */
  border?: boolean
  /** 是否使用圆角卡片风格 */
  insert?: boolean
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdCellGroupProps>(), {
  customStyle: '',
  customClass: '',
  useSlot: false,
  border: false,
  insert: false,
})

const { linkChildren } = useChildren(CELL_GROUP_KEY)

linkChildren({ props })
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable.scss';
@import '../common/abstracts/_mixin.scss';

// 暗色主题样式
.wot-theme-dark {
  @include b(cell-group) {
    background-color: $-dark-background2;

    @include when(border) {
      .wd-cell-group__title {
        @include halfPixelBorder('bottom', 0, $-dark-border-color);
      }
    }

    @include e(title) {
      background: $-dark-background2;
      color: $-dark-color;
    }

    @include e(right) {
      color: $-dark-color3;
    }

    @include e(body) {
      background: $-dark-background2;
    }
  }
}

// Cell Group 主体样式
@include b(cell-group) {
  background-color: $-color-white;

  @include when(border) {
    .wd-cell-group__title {
      @include halfPixelBorder;
    }
  }

  // 标题区域样式
  @include e(title) {
    position: relative;
    display: flex;
    justify-content: space-between;
    padding: $-cell-group-padding;
    background: $-color-white;
    font-size: $-cell-group-title-fs;
    color: $-cell-group-title-color;
    font-weight: $-fw-medium;
    line-height: 1.43;
  }

  // 右侧内容样式
  @include e(right) {
    color: $-cell-group-value-color;
    font-size: $-cell-group-value-fs;
  }

  // 主体内容样式
  @include e(body) {
    background: $-color-white;
  }

  @include when(insert) {
    border-radius: var(--wot-cell-group-insert-radius, 16rpx);
    margin: var(--wot-cell-group-insert-margin, 0 24rpx);
    overflow: hidden;
  }
}
</style>
