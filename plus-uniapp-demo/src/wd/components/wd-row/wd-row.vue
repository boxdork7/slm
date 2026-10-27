<!-- Layout 布局 配合el-col用于快速进行布局 -->
<template>
  <!-- 栅格行容器：用于包裹栅格列组件 -->
  <view
    :class="`wd-row ${customClass}`"
    :style="`${gutter < 0 ? '' : gutter ? `margin-left: ${addUnit(-gutter / 2)}; margin-right: ${addUnit(-gutter / 2)};` : ''}${customStyle}`"
  >
    <!-- 栅格列内容插槽 -->
    <slot />
  </view>
</template>

<script lang="ts" setup>
import { addUnit } from '../common/util'
import { useChildren } from '../composables/useChildren'
import { ROW_KEY } from './wd-row-key'

defineOptions({
  name: 'WdRow',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 栅格行组件属性接口
 */
interface WdRowProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string
  /** 列元素之间的间距（单位为px） */
  gutter?: number
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdRowProps>(), {
  customStyle: '',
  customClass: '',
  gutter: 0,
})

// 建立父子组件通信：将当前行组件的属性提供给子列组件
const { linkChildren } = useChildren(ROW_KEY)
linkChildren({ props })

// 验证 gutter 值的有效性
if (props.gutter < 0) {
  console.error('warning(wd-row): attribute gutter must be greater than or equal to 0')
}
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 栅格行样式
@include b(row) {
  // 清除浮动：确保行容器能正确包含浮动的列元素
  &::after {
    display: table;
    clear: both;
    content: '';
  }
}
</style>
