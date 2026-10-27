<!-- Steps 步骤条的每一项 用于引导用户按照流程完成任务或向用户展示当前状态。 -->
<template>
  <view
    v-if="currentStatus"
    :class="`wd-step ${customClass} ${currentStatus ? `is-${currentStatus}` : ''} ${canAlignCenter ? 'is-center' : ''} ${vertical ? 'is-vertical' : ''}`"
    :style="`${steps && !steps.vertical && (steps.space || `${100 / steps.children.length}%`) ? `width: ${steps.space || `${100 / steps.children.length}%`};` : ''}${steps && steps.vertical && isDef(steps.space) ? `height: ${steps.space};` : ''}${customStyle}`"
  >
    <!-- 步骤头部区域 -->
    <view :class="`wd-step__header ${dot ? 'is-dot' : ''}`">
      <!-- 步骤图标区域 -->
      <view
        :class="`wd-step__icon ${dot ? 'is-dot' : !!icon || $slots.icon ? 'is-icon' : 'is-text'}`"
      >
        <view v-if="dot" class="wd-step__dot" />
        <slot v-else-if="$slots.icon" name="icon" />
        <wd-icon v-else-if="icon" custom-class="wd-step__icon-inner" :name="icon" />
        <view v-else class="wd-step__icon-outer">
          <wd-icon v-if="currentStatus === 'finished'" name="check" />
          <wd-icon v-else-if="currentStatus === 'error'" name="close" />
          <text v-else>
            {{ index + 1 }}
          </text>
        </view>
      </view>
      <!-- 连接线 -->
      <view v-if="index < childrenLength - 1" class="wd-step__line" />
    </view>

    <!-- 步骤内容区域 -->
    <view class="wd-step__content">
      <!-- 步骤标题 -->
      <view
        :class="`wd-step__title ${$slots.description || description ? 'is-description' : ''}`"
      >
        <slot v-if="$slots.title" name="title" />
        <text v-else>
          {{ currentTitle }}
        </text>
      </view>
      <!-- 步骤描述 -->
      <view v-if="$slots.description || description" class="wd-step__description">
        <slot v-if="$slots.description" name="description" />
        <text v-else>
          {{ description }}
        </text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { isDef } from '../common/util'
import { useParent } from '../composables/useParent'
import { useTranslate } from '../composables/useTranslate'
import wdIcon from '../wd-icon/wd-icon.vue'
import { STEPS_KEY } from '../wd-steps/wd-steps-key'
import type { IconName } from '@/wd/components/wd-icon/wd-icon.vue'

defineOptions({
  name: 'WdStep',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 步骤状态类型
 */
type StepStatus = 'finished' | 'process' | 'error' | 'wait'

/**
 * 步骤组件属性接口
 */
interface WdStepProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 步骤标题，如果没有则使用默认文案 */
  title?: string
  /** 步骤描述 */
  description?: string
  /** 步骤图标 */
  icon?: IconName
  /** 步骤状态，可选值为 'finished'、'process'、'error' */
  status?: StepStatus
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdStepProps>(), {
  customStyle: '',
  customClass: '',
})

// 获取父组件实例和当前索引
const { parent: steps, index } = useParent(STEPS_KEY)

// 获取翻译函数
const { translate } = useTranslate('steps')

/**
 * 计算当前步骤状态
 * 优先使用 props.status，否则根据 active 和 index 计算
 */
const currentStatus = computed((): StepStatus => {
  if (props.status) {
    return props.status
  }

  if (steps) {
    const { active } = steps.props
    const activeValue = Number(active)
    const currentIndex = index.value

    if (activeValue > currentIndex) {
      return 'finished'
    } else if (activeValue === currentIndex) {
      return 'process'
    } else {
      return 'wait'
    }
  }

  return 'wait'
})

/**
 * 计算当前步骤标题
 * 优先使用 props.title，否则根据状态使用默认翻译文案
 */
const currentTitle = computed(() => {
  if (props.title) {
    return props.title
  }

  const statusTitleMap = {
    finished: 'finished',
    error: 'failed',
    process: 'process',
    wait: 'wait',
  }

  return translate(statusTitleMap[currentStatus.value] || 'wait')
})

/**
 * 计算是否可以居中对齐
 * 只有在非垂直方向且设置了 alignCenter 时才生效
 */
const canAlignCenter = computed(() => {
  if (isDef(steps)) {
    const { vertical: isVertical, alignCenter } = steps.props
    return Boolean(!isVertical && alignCenter)
  }
  return false
})

/**
 * 计算是否为垂直方向
 */
const vertical = computed(() => {
  if (isDef(steps)) {
    return Boolean(steps.props.vertical)
  }
  return false
})

/**
 * 计算是否为点状样式
 */
const dot = computed(() => {
  if (isDef(steps)) {
    return Boolean(steps.props.dot)
  }
  return false
})

/**
 * 计算子组件总数
 */
const childrenLength = computed(() => {
  if (isDef(steps)) {
    return Number(steps.children.length)
  }
  return 0
})
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 暗色主题样式
.wot-theme-dark {
  @include b(step) {
    @include e(icon) {
      background: $-dark-background2;
    }

    @include e(content) {
      color: $-dark-color3;
    }

    @include e(line) {
      background: $-dark-color-gray;
    }

    @include e(dot) {
      background: $-dark-color-gray;
    }

    @include e(description) {
      color: $-dark-color3;
    }

    @include when(wait) {
      .wd-step__description {
        color: $-dark-color-gray;
      }
    }

    :deep(.wd-step__icon-outer),
    :deep(.wd-step__icon-inner) {
      color: $-dark-color3;
      border-color: $-dark-color-gray;
    }
  }
}

// 步骤组件样式
@include b(step) {
  position: relative;
  display: inline-block;
  vertical-align: top;

  // 步骤头部样式
  @include e(header) {
    position: relative;
    font-size: 0;

    @include when(dot) {
      .wd-step__line {
        margin-top: -2rpx;
      }
    }
  }

  // 步骤图标样式
  @include e(icon) {
    display: inline-block;
    position: relative;
    width: $-steps-icon-size;
    height: $-steps-icon-size;
    background: #fff;
    z-index: 1;

    @include when(icon) {
      width: $-steps-is-icon-width;
      text-align: center;
    }

    @include when(dot) {
      width: $-steps-dot-size;
      height: $-steps-dot-size;
      border: 1px solid transparent;
      margin-left: -2rpx;
      border-radius: 50%;
      background: transparent;
    }
  }

  // 图标内部样式
  @include edeep(icon-inner) {
    font-size: $-steps-icon-size;
    color: $-steps-inactive-color;
  }

  // 图标外部样式
  @include e(icon-outer) {
    width: calc($-steps-icon-size - 2px);
    height: calc($-steps-icon-size - 2px);
    border: 1px solid $-steps-inactive-color;
    color: $-steps-inactive-color;
    text-align: center;
    line-height: calc($-steps-icon-size - 2px);
    border-radius: 50%;
    font-size: $-steps-icon-text-fs;
  }

  // 连接线样式
  @include e(line) {
    position: absolute;
    width: 100%;
    height: 1px;
    background: $-steps-line-color;
    transform: scaleY(0.5);
    top: 50%;
    left: 0;
  }

  // 点状样式
  @include e(dot) {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: $-steps-line-color;
  }

  // 内容区域样式
  @include e(content) {
    margin-top: 14rpx;
    color: $-steps-inactive-color;
    font-size: $-steps-label-fs;
  }

  // 标题样式
  @include e(title) {
    font-weight: $-steps-title-fw;
    line-height: 1.43;

    @include when(description) {
      font-size: $-steps-title-fs;
    }
  }

  // 描述样式
  @include e(description) {
    margin-top: 10rpx;
    padding: 0 4rpx;
    color: $-steps-description-color;
  }

  // 等待状态样式
  @include when(wait) {
    .wd-step__description {
      color: $-steps-inactive-color;
    }
  }

  // 完成状态样式
  @include when(finished) {
    :deep(.wd-step__icon-inner) {
      color: $-steps-finished-color;
    }
    .wd-step__icon-outer {
      color: $-steps-finished-color;
      border-color: $-steps-finished-color;
    }
    .wd-step__title {
      color: $-steps-finished-color;
    }
    .wd-step__dot {
      background: $-steps-finished-color;
    }
  }

  // 进行中状态样式
  @include when(process) {
    .wd-step__icon.is-icon {
      :deep(.wd-step__icon-inner) {
        color: $-steps-finished-color;
      }
    }
    .wd-step__icon-outer {
      color: #fff;
      background: $-steps-finished-color;
      border-color: $-steps-finished-color;
    }
    .wd-step__title {
      color: $-steps-finished-color;
    }
    .wd-step__icon {
      border-color: $-steps-finished-color;

      &.is-dot {
        &::after {
          position: absolute;
          content: '';
          width: $-steps-dot-size + 20rpx;
          height: $-steps-dot-size + 20rpx;
          left: -10rpx;
          top: -10rpx;
          border-radius: 50%;
          background: $-steps-finished-color;
          opacity: 0.2;
        }
      }
    }
    .wd-step__dot {
      background: $-steps-finished-color;
    }
  }

  // 错误状态样式
  @include when(error) {
    :deep(.wd-step__icon-inner),
    .wd-step__title {
      color: $-steps-error-color;
    }
    .wd-step__icon-outer {
      color: $-steps-error-color;
      border-color: $-steps-error-color;
    }
    .wd-step__dot {
      background: $-steps-error-color;
    }
  }

  // 居中对齐样式
  @include when(center) {
    text-align: center;

    .wd-step__line {
      left: 50%;
      right: -50%;
    }
  }

  // 垂直方向样式
  @include when(vertical) {
    display: block;

    .wd-step__header {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;

      &.is-dot {
        top: 12rpx;

        .wd-step__line {
          margin-left: -2rpx;
          margin-top: 0;
        }
      }
    }
    .wd-step__content {
      margin-left: 60rpx;
      margin-top: 0;
      padding-bottom: 40rpx;
    }
    .wd-step__line {
      top: 0;
      left: 50%;
      width: 2rpx;
      height: 100%;
      transform: scaleX(0.5);
    }
    .wd-step__icon.is-dot {
      margin-left: 0;
      margin-top: -2rpx;
    }
  }
}
</style>
