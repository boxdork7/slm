<!-- SortButton 排序按钮 用于展示排序按钮，支持升序、降序、重置三种状态。 -->
<template>
  <view
    :class="`wd-sort-button ${line ? 'wd-sort-button--line' : ''} ${customClass}`"
    :style="customStyle"
    @click="handleClick"
  >
    <view class="wd-sort-button__wrapper">
      <view :class="`wd-sort-button__left ${modelValue !== 0 ? 'is-active' : ''}`">
        {{ title }}
      </view>
      <view :class="`wd-sort-button__right ${modelValue !== 0 ? 'is-active' : ''}`">
        <wd-icon v-if="modelValue !== 1" name="up" custom-class="wd-sort-button__icon-up" />
        <wd-icon v-if="modelValue !== -1" name="down" custom-class="wd-sort-button__icon-down" />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import wdIcon from '../wd-icon/wd-icon.vue'

defineOptions({
  name: 'WdSortButton',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 排序按钮组件属性接口
 */
interface WdSortButtonProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 选中的箭头方向，1表示升序，0表示重置状态，-1表示降序 */
  modelValue?: number
  /** 排序按钮展示的文案 */
  title?: string
  /** 当展示双箭头时，是否允许手动重置按钮 */
  allowReset?: boolean
  /** 是否优先切换为降序，如果不开启则默认优先切换为升序 */
  descFirst?: boolean
  /** 是否展示下划线，当只有一个排序按钮时，通常不展示下划线 */
  line?: boolean
}

/**
 * 排序按钮组件事件接口
 */
interface WdSortButtonEmits {
  /** 排序状态改变时触发 */
  change: [event: { value: number }]
  /** 更新排序值时触发，用于v-model绑定 */
  'update:modelValue': [value: number]
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdSortButtonProps>(), {
  customStyle: '',
  customClass: '',
  modelValue: 0,
  title: '',
  allowReset: false,
  descFirst: false,
  line: true,
})

// 定义组件事件
const emit = defineEmits<WdSortButtonEmits>()

/**
 * 处理点击事件
 * 根据当前状态和配置计算下一个排序状态
 */
const handleClick = () => {
  let { modelValue: value, allowReset, descFirst } = props

  if (descFirst) {
    // 优先降序模式：0 → -1 → 1 → (0 或 -1)
    if (value === 0) {
      value = -1
    } else if (value === -1) {
      value = 1
    } else if (value === 1) {
      if (allowReset) {
        value = 0
      } else {
        value = -1
      }
    }
  } else {
    // 优先升序模式：0 → 1 → -1 → (0 或 1)
    if (value === 0) {
      value = 1
    } else if (value === 1) {
      value = -1
    } else if (value === -1) {
      if (allowReset) {
        value = 0
      } else {
        value = 1
      }
    }
  }

  emit('update:modelValue', value)
  emit('change', { value })
}
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 暗色主题样式
.wot-theme-dark {
  @include b(sort-button) {
    @include e(wrapper) {
      color: $-dark-color;
    }
  }
}

// 排序按钮组件样式
@include b(sort-button) {
  display: inline-block;
  height: $-sort-button-height;
  line-height: $-sort-button-height;

  // 下划线样式
  @include m(line) {
    .wd-sort-button__left {
      &::after {
        position: absolute;
        content: '';
        width: 38rpx;
        height: 4rpx; // 减小下划线高度，减少对齐影响
        bottom: 8rpx; // 调整下划线位置
        left: 50%;
        transform: translate(-50%, 0);
        background: $-sort-button-line-color;
        border-radius: calc($-sort-button-line-height / 2);
        transition: opacity 0.15s;
        opacity: 0;
      }

      &.is-active::after {
        opacity: 1;
      }
    }
  }

  // 包装器样式
  @include e(wrapper) {
    font-size: $-sort-button-fs;
    color: $-sort-button-color;
    word-break: break-all;
    white-space: nowrap;
    font-size: 0; // 消除inline-block元素间的间隙
  }

  // 左侧文字区域
  @include e(left) {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    line-height: normal; // 重置行高，避免影响对齐
    font-size: $-sort-button-fs; // 恢复字体大小

    @include when(active) {
      font-weight: $-fw-medium;
    }
  }

  // 右侧箭头区域 - 固定尺寸
  @include e(right) {
    display: inline-block;
    vertical-align: middle; // 与左侧文字保持对齐
    margin-left: 4rpx;
    width: 28rpx; // 固定宽度
    height: 40rpx; // 固定高度，足够容纳两个图标
    position: relative; // 作为图标定位容器
    line-height: 1;
    font-size: 0; // 消除字体大小影响

    @include when(active) {
      :deep(.wd-sort-button__icon-up),
      :deep(.wd-sort-button__icon-down) {
        transform: scale(calc(10 / 14));
      }
    }
  }

  // 向上箭头样式 - 绝对定位
  @include edeep(icon-up) {
    display: block !important;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    transform: scale(calc(10 / 15));
    transform-origin: center top; // 从顶部居中缩放
  }

  // 向下箭头样式 - 绝对定位
  @include edeep(icon-down) {
    display: block !important;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    transform: scale(calc(10 / 15));
    transform-origin: center bottom; // 从底部居中缩放
  }
}
</style>
