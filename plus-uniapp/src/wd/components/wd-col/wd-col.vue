<!-- Layout 布局 配合el-row用于快速进行布局 -->
<template>
  <!-- 栅格列容器：根据span和offset属性动态应用样式类 -->
  <view
    :class="`wd-col ${span ? `wd-col__${span}` : ''} ${offset ? `wd-col__offset-${offset}` : ''} ${customClass}`"
    :style="`${row && row.props.gutter > 0 ? `padding-left: ${addUnit(row.props.gutter / 2)}; padding-right: ${addUnit(row.props.gutter / 2)}; background-clip: content-box;` : ''}${customStyle}`"
  >
    <!-- 列内容插槽 -->
    <slot />
  </view>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import { addUnit } from '@/wd/components/common/util'
import { useParent } from '../composables/useParent'
// 从 wd-row 组件导入共享的类型和标识符
import { ROW_KEY } from '../wd-row/wd-row-key'

defineOptions({
  name: 'WdCol',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 栅格列组件属性接口
 */
interface WdColProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string
  /** 列元素宽度（栅格数，总共24栅格） */
  span?: number
  /** 列元素偏移距离（栅格数） */
  offset?: number
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdColProps>(), {
  customStyle: '',
  customClass: '',
  span: 24,
  offset: 0,
})

// 获取父级行组件的数据（用于获取 gutter 间距值）
const { parent: row } = useParent(ROW_KEY)

/**
 * 验证组件属性的有效性
 * 确保 span 和 offset 值为非负数
 */
const validateProps = () => {
  const { span, offset } = props

  if (span < 0 || offset < 0) {
    console.error(
      '[wot-design] warning(wd-col): attribute span/offset must be greater than or equal to 0',
    )
  }
}

/**
 * 监听 span 和 offset 属性变化
 * 当属性发生变化时，验证其有效性
 */
watch([() => props.span, () => props.offset], () => {
  validateProps()
})
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 栅格列基础样式
@include b(col) {
  float: left;
  box-sizing: border-box;
}

// 生成 1-24 栅格的宽度和偏移样式类
$i: 1;
@while $i <= 24 {
  // 栅格宽度样式：wd-col__1 到 wd-col__24
  .wd-col__#{$i} {
    width: calc(100% / 24 * $i);
  }

  // 栅格偏移样式：wd-col__offset-1 到 wd-col__offset-24
  .wd-col__offset-#{$i} {
    margin-left: calc(100% / 24 * $i);
  }

  $i: $i + 1;
}
</style>
