<!-- Table 表格每一列 -->
<template>
  <view
    :class="`wd-table-col ${fixed ? 'wd-table-col--fixed' : ''} ${isLastFixed && isDef(table) && table.state.scrollLeft ? 'is-shadow' : ''} ${customClass}`"
    :style="`${columnStyle}${customStyle}`"
  >
    <view
      v-for="(row, index) in column"
      :key="index"
      :class="`wd-table__cell ${stripe && isOdd(index) ? 'is-stripe' : ''} ${border ? 'is-border' : ''} is-${align}`"
      :style="cellStyle"
      @click="handleRowClick(index)"
    >
      <slot v-if="$slots.value" name="value" :row="getScope(index)" :index="index" />
      <text v-else :class="`wd-table__value ${ellipsis ? 'is-ellipsis' : ''}`">
        {{ row }}
      </text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { ComponentPublicInstance, CSSProperties, Ref } from 'vue'
import type { AlignType, SortDirection } from '../wd-table/wd-table.vue'
import { computed, ref } from 'vue'
import { addUnit, isDef, isFunction, isOdd, objToStyle } from '../common/util'
import { useParent } from '../composables/useParent'
import { TABLE_KEY } from '../wd-table/wd-table-key'

defineOptions({
  name: 'WdTableCol',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 表格列组件属性接口
 */
interface WdTableColProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 列对应字段 */
  prop: string
  /** 列对应字段标题 */
  label: string
  /** 列宽度，单位px */
  width?: string | number
  /** 是否开启列排序 */
  sortable?: boolean
  /** 是否固定本列 */
  fixed?: boolean
  /** 列的对齐方式，可选值left,center,right */
  align?: AlignType
}

/**
 * 表格列组件暴露接口
 */
interface WdTableColExpose {
  /** 排序方向状态 */
  sortDirection: Ref<SortDirection>
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdTableColProps>(), {
  customStyle: '',
  customClass: '',
  width: 200,
  sortable: false,
  fixed: false,
  align: 'left',
})

// 获取父组件（Table）实例
const { parent: table, index: columnIndex } = useParent(TABLE_KEY)

// 排序方向状态
const sortDirection = ref<SortDirection>(0)

/**
 * 是否开启斑马纹
 */
const stripe = computed(() => {
  return table?.props.stripe ?? false
})

/**
 * 是否有边框
 */
const border = computed(() => {
  return table?.props.border ?? false
})

/**
 * 是否超出省略
 */
const ellipsis = computed(() => {
  return table?.props.ellipsis ?? false
})

/**
 * 是否最后一个固定元素
 */
const isLastFixed = computed(() => {
  let isLastFixed = false
  if (props.fixed && isDef(table)) {
    isLastFixed = table.getIsLastFixed(props)
  }
  return isLastFixed
})

/**
 * 列样式
 */
const columnStyle = computed(() => {
  let style: CSSProperties = {}
  if (isDef(props.width)) {
    style.width = addUnit(props.width)
  }
  if (props.fixed && isDef(table) && isFunction(table.getFixedStyle)) {
    style = table.getFixedStyle(columnIndex.value, style)
  }
  return objToStyle(style)
})

/**
 * 单元格样式
 */
const cellStyle = computed(() => {
  let style: CSSProperties = {}
  const rowHeight = table?.props?.rowHeight ?? 100
  if (isDef(rowHeight)) {
    style.height = addUnit(rowHeight)
  }
  if (props.fixed && isDef(table) && isFunction(table.getFixedStyle)) {
    style = table.getFixedStyle(columnIndex.value, style)
  }
  return objToStyle(style)
})

/**
 * 列数据
 */
const column = computed(() => {
  if (
    !isDef(table) ||
    !isDef(table.props) ||
    !isDef(table.props.data) ||
    !Array.isArray(table.props.data)
  ) {
    return []
  }

  return table.props.data.map((item) => item[props.prop])
})

/**
 * 处理行点击事件
 * @param index 行下标
 */
const handleRowClick = (index: number) => {
  if (!isDef(table)) {
    return
  }
  isFunction(table.rowClick) && table.rowClick(index)
}

/**
 * 获取行数据
 * @param index 行索引
 */
const getScope = (index: number) => {
  if (
    !isDef(table) ||
    !isDef(table.props) ||
    !isDef(table.props.data) ||
    !Array.isArray(table.props.data)
  ) {
    return {}
  }
  return table.props.data[index] || {}
}

// 暴露给父组件的方法和属性
defineExpose<WdTableColExpose>({
  sortDirection,
})

/** 表格列组件实例类型 */
export type TableColInstance = ComponentPublicInstance<WdTableColProps, WdTableColExpose>
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 暗色主题样式
.wot-theme-dark {
  @include b(table-col) {
    @include when(shadow) {
      &::after {
        background: linear-gradient(270deg, rgba(17, 17, 17, 0.2) 0%, rgba(0, 0, 0, 0) 100%);
      }
    }
  }
}

// 表格列样式
@include b(table-col) {
  .wd-table__cell {
    width: 100%;
    @include when(stripe) {
      background: $-table-stripe-bg;
    }
  }

  @include m(fixed) {
    position: sticky;
    z-index: 1;
    left: 0;
  }

  @include when(shadow) {
    &::after {
      content: ' ';
      position: absolute;
      height: 100%;
      right: -30rpx;
      top: 0;
      width: 30rpx;
      height: 100%;
      background: linear-gradient(270deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.04) 100%);
    }
  }

  .wd-table__cell:last-child {
    @include when(border) {
      border-bottom: none;
    }
  }
}
</style>
