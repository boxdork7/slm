<!-- Steps 步骤条 用于引导用户按照流程完成任务或向用户展示当前状态。 -->
<template>
  <view
    :class="`wd-steps ${customClass} ${vertical ? 'is-vertical' : ''}`"
    :style="customStyle"
  >
    <slot />
  </view>
</template>

<script lang="ts" setup>
import { useChildren } from '../composables/useChildren'
import { STEPS_KEY } from './wd-steps-key'

defineOptions({
  name: 'WdSteps',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 步骤条组件属性接口
 */
export interface WdStepsProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string
  /** 当前激活的步骤进度，以数字表示 */
  active?: number
  /** 是否为垂直方向的步骤条 */
  vertical?: boolean
  /** 是否为点状步骤条样式 */
  dot?: boolean
  /** 步骤条之间的间距，默认为自动计算 */
  space?: string
  /** 是否将步骤条水平居中显示，只对横向步骤条有效 */
  alignCenter?: boolean
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdStepsProps>(), {
  customStyle: '',
  customClass: '',
  active: 0,
  vertical: false,
  dot: false,
  alignCenter: false,
})

// 使用 useChildren 管理子组件
const { linkChildren } = useChildren(STEPS_KEY)

// 向子组件提供数据
linkChildren({ props })
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 步骤条组件样式
@include b(steps) {
  font-size: 0;

  // 垂直方向样式
  @include when(vertical) {
    display: block;
  }
}
</style>
