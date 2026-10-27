<!-- Table 表格 用于展示多条结构类似的数据， 可对数据进行排序等操作。 -->
<template>
  <view
    :class="`wd-table ${border ? 'is-border' : ''} ${customClass}`"
    :style="`${isDef(height) ? `max-height: ${addUnit(height)};` : ''}${customStyle}`"
  >
    <!-- 固定表头模式 -->
    <template v-if="fixedHeader">
      <!-- 表头部分 -->
      <scroll-view
        v-if="showHeader"
        :enable-flex="true"
        :throttle="false"
        :scroll-left="state.scrollLeft"
        :scroll-x="true"
        class="wd-table__header"
        @scroll="scroll"
      >
        <view
          id="table-header"
          class="wd-table__content wd-table__content--header"
          :style="realWidthStyle"
        >
          <!-- 序号列表头 -->
          <view
            v-if="index !== false"
            :class="getHeaderCellClass(indexColumn)"
            :style="getHeaderCellStyle(-1)"
          >
            <text :class="`wd-table__value ${ellipsis ? 'is-ellipsis' : ''}`">
              {{ indexColumn.label }}
            </text>
          </view>

          <!-- 配置式列表头 -->
          <template v-if="isColumnsMode">
            <view
              v-for="(column, columnIndex) in columns"
              :key="column.prop"
              :class="getHeaderCellClass(column)"
              :style="getHeaderCellStyle(columnIndex)"
            >
              <wd-sort-button
                v-if="column.sortable"
                v-model="columnSortDirections[columnIndex]"
                allow-reset
                :line="false"
                :title="column.label"
                @change="
                  ({ value }) => handleSortChange(value as SortDirection, columnIndex, column)
                "
              />
              <text v-else :class="`wd-table__value ${ellipsis ? 'is-ellipsis' : ''}`">
                {{ column.label }}
              </text>
            </view>
          </template>

          <!-- 子组件式列表头 -->
          <template v-else>
            <view
              v-for="(child, childIndex) in children"
              :key="child.prop"
              :class="getHeaderCellClass(child)"
              :style="getHeaderCellStyle(childIndex)"
            >
              <wd-sort-button
                v-if="child.sortable"
                v-model="child.$.exposed!.sortDirection.value"
                allow-reset
                :line="false"
                :title="child.label"
                @change="({ value }) => handleSortChange(value as SortDirection, childIndex, child)"
              />
              <text v-else :class="`wd-table__value ${ellipsis ? 'is-ellipsis' : ''}`">
                {{ child.label }}
              </text>
            </view>
          </template>
        </view>
      </scroll-view>

      <!-- 表格主体 -->
      <scroll-view
        class="wd-table__body"
        :style="`${isDef(height) ? `height: calc(${data.length} * ${isDef(rowHeight) ? addUnit(rowHeight) : '100rpx'});` : ''}`"
        :enable-flex="true"
        :throttle="false"
        :scroll-x="true"
        :scroll-left="state.scrollLeft"
        @scroll="scroll"
      >
        <view id="table-body" class="wd-table__content" :style="realWidthStyle">
          <!-- 序号列 -->
          <wd-table-col
            v-if="index !== false"
            :prop="indexColumn.prop"
            :label="indexColumn.label"
            :width="indexColumn.width"
            :sortable="indexColumn.sortable"
            :fixed="indexColumn.fixed"
            :align="indexColumn.align"
          >
            <template #value="{ index: colIndex }">
              <text>{{ colIndex + 1 }}</text>
            </template>
          </wd-table-col>

          <!-- 配置式列渲染 -->
          <template v-if="isColumnsMode">
            <view
              v-for="column in columns"
              :key="column.prop"
              :class="getColumnClass(column)"
              :style="getColumnStyle(column)"
            >
              <view
                v-for="(row, rowIndex) in getColumnData(column.prop)"
                :key="rowIndex"
                :class="getCellClass(rowIndex, column)"
                :style="getCellStyle(column)"
                @click="handleRowClick(rowIndex)"
              >
                <!-- 自定义插槽 -->
                <slot
                  v-if="column.useSlot"
                  :name="column.slotName || `column-${column.prop}`"
                  :row="getRowScope(rowIndex)"
                  :index="rowIndex"
                  :column="column"
                />
                <!-- 自定义渲染函数 -->
                <text
                  v-else-if="column.render"
                  :class="`wd-table__value ${ellipsis ? 'is-ellipsis' : ''}`"
                >
                  {{ column.render(getRowScope(rowIndex), rowIndex) }}
                </text>
                <!-- 默认渲染 -->
                <text v-else :class="`wd-table__value ${ellipsis ? 'is-ellipsis' : ''}`">
                  {{ row }}
                </text>
              </view>
            </view>
          </template>

          <!-- 子组件式列渲染 -->
          <slot v-else />
        </view>
      </scroll-view>
    </template>

    <!-- 非固定表头模式 -->
    <template v-else>
      <scroll-view
        class="wd-table__wrapper"
        :enable-flex="true"
        :throttle="false"
        :scroll-x="true"
        :scroll-left="state.scrollLeft"
        @scroll="scroll"
      >
        <view class="wd-table__inner" :style="realWidthStyle">
          <!-- 表头部分 -->
          <view v-if="showHeader" class="wd-table__header-row">
            <!-- 序号列表头 -->
            <view
              v-if="index !== false"
              :class="getHeaderCellClass(indexColumn)"
              :style="getHeaderCellStyle(-1)"
            >
              <text :class="`wd-table__value ${ellipsis ? 'is-ellipsis' : ''}`">
                {{ indexColumn.label }}
              </text>
            </view>

            <!-- 配置式列表头 -->
            <template v-if="isColumnsMode">
              <view
                v-for="(column, columnIndex) in columns"
                :key="column.prop"
                :class="getHeaderCellClass(column)"
                :style="getHeaderCellStyle(columnIndex)"
              >
                <wd-sort-button
                  v-if="column.sortable"
                  v-model="columnSortDirections[columnIndex]"
                  allow-reset
                  :line="false"
                  :title="column.label"
                  @change="
                    ({ value }) => handleSortChange(value as SortDirection, columnIndex, column)
                  "
                />
                <text v-else :class="`wd-table__value ${ellipsis ? 'is-ellipsis' : ''}`">
                  {{ column.label }}
                </text>
              </view>
            </template>

            <!-- 子组件式列表头 -->
            <template v-else>
              <view
                v-for="(column, columnIndex) in children"
                :key="column.prop"
                :class="getHeaderCellClass(column)"
                :style="getHeaderCellStyle(columnIndex)"
              >
                <wd-sort-button
                  v-if="column.sortable"
                  v-model="column.$.exposed!.sortDirection.value"
                  allow-reset
                  :line="false"
                  :title="column.label"
                  @change="
                    ({ value }) => handleSortChange(value as SortDirection, columnIndex, column)
                  "
                />
                <text v-else :class="`wd-table__value ${ellipsis ? 'is-ellipsis' : ''}`">
                  {{ column.label }}
                </text>
              </view>
            </template>
          </view>

          <!-- 表格内容部分 -->
          <view
            class="wd-table__content"
            :style="`${isDef(height) ? `height: calc(${data.length} * ${isDef(rowHeight) ? addUnit(rowHeight) : '100rpx'});` : ''}`"
          >
            <!-- 序号列 -->
            <wd-table-col
              v-if="index !== false"
              :prop="indexColumn.prop"
              :label="indexColumn.label"
              :width="indexColumn.width"
              :sortable="indexColumn.sortable"
              :fixed="indexColumn.fixed"
              :align="indexColumn.align"
            >
              <template #value="{ index: colIndex }">
                <text>{{ colIndex + 1 }}</text>
              </template>
            </wd-table-col>

            <!-- 配置式列渲染 -->
            <template v-if="isColumnsMode">
              <view
                v-for="column in columns"
                :key="column.prop"
                :class="getColumnClass(column)"
                :style="getColumnStyle(column)"
              >
                <view
                  v-for="(row, rowIndex) in getColumnData(column.prop)"
                  :key="rowIndex"
                  :class="getCellClass(rowIndex, column)"
                  :style="getCellStyle(column)"
                  @click="handleRowClick(rowIndex)"
                >
                  <!-- 自定义插槽 -->
                  <slot
                    v-if="column.useSlot"
                    :name="column.slotName || `column-${column.prop}`"
                    :row="getRowScope(rowIndex)"
                    :index="rowIndex"
                    :column="column"
                  />
                  <!-- 自定义渲染函数 -->
                  <text
                    v-else-if="column.render"
                    :class="`wd-table__value ${ellipsis ? 'is-ellipsis' : ''}`"
                  >
                    {{ column.render(getRowScope(rowIndex), rowIndex) }}
                  </text>
                  <!-- 默认渲染 -->
                  <text v-else :class="`wd-table__value ${ellipsis ? 'is-ellipsis' : ''}`">
                    {{ row }}
                  </text>
                </view>
              </view>
            </template>

            <!-- 子组件式列渲染 -->
            <slot v-else />
          </view>
        </view>
      </scroll-view>
    </template>
  </view>
</template>

<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import { computed, reactive, ref, watch } from 'vue'
import { addUnit, debounce, isDef, isObj, isOdd, objToStyle, uuid } from '../common/util'
import { useChildren } from '../composables/useChildren'
import { useTranslate } from '../composables/useTranslate'
import wdSortButton from '../wd-sort-button/wd-sort-button.vue'
import wdTableCol from '../wd-table-col/wd-table-col.vue'
import { TABLE_KEY } from './wd-table-key'

defineOptions({
  name: 'WdTable',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 徽标类型
 */
export type AlignType = 'left' | 'center' | 'right'

/**
 * 排序方向类型
 */
export type SortDirection = 0 | 1 | -1

/**
 * 链接跳转类型
 */
export type LinkType = 'navigateTo' | 'switchTab' | 'reLaunch' | 'redirectTo'

/**
 * 表格列配置接口
 */
export interface TableColumn {
  /** 列对应字段 */
  prop: string
  /** 列对应字段标题 */
  label: string
  /** 列宽度 */
  width?: string | number
  /** 是否开启列排序 */
  sortable?: boolean
  /** 列的对齐方式 */
  align?: AlignType
  /** 列的排序方向 */
  sortDirection?: SortDirection
  /** 是否固定列 */
  fixed?: boolean
  /** 自定义渲染函数 */
  render?: (row: any, index: number) => string
  /** 自定义插槽名称 */
  slotName?: string
  /** 是否使用插槽 */
  useSlot?: boolean

  /** 自定义数据，点击时会传递 */
  [key: string]: any
}

/**
 * 表格组件属性接口
 */
interface WdTableProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 列配置数组（配置式使用） */
  columns?: TableColumn[]
  /** 显示的数据 */
  data?: Array<Record<string, any>>
  /** 是否带有边框 */
  border?: boolean
  /** 是否为斑马纹 table */
  stripe?: boolean
  /** Table 的高度 */
  height?: string | number
  /** 行高 */
  rowHeight?: string | number
  /** 是否显示表头 */
  showHeader?: boolean
  /** 是否超出2行隐藏 */
  ellipsis?: boolean
  /** 是否显示索引列 */
  index?: boolean | Partial<TableColumn>
  /** 是否固定表头 */
  fixedHeader?: boolean
}

/**
 * 表格组件事件接口
 */
interface WdTableEmits {
  /** 排序方法触发 */
  'sort-method': [column: TableColumn]
  /** 行点击事件 */
  'row-click': [data: { rowIndex: number }]
}

// 统一的默认列宽度常量
const DEFAULT_COLUMN_WIDTH = 200

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdTableProps>(), {
  customStyle: '',
  customClass: '',
  columns: () => [],
  data: () => [],
  border: true,
  stripe: true,
  rowHeight: 100,
  showHeader: true,
  ellipsis: true,
  index: false,
  fixedHeader: true,
})

// 定义组件事件
const emit = defineEmits<WdTableEmits>()

// 翻译函数
const { translate } = useTranslate('tableCol')

// 响应式状态
const state = reactive({
  scrollLeft: 0,
})

// 配置式列的排序方向状态
const columnSortDirections = ref<SortDirection[]>([])

// 子组件管理（用于兼容 wd-table-col 子组件模式）
const { linkChildren, children } = useChildren(TABLE_KEY)

// 序号列配置
const indexUUID = uuid()
const indexColumn = computed(() => ({
  prop: indexUUID,
  label: translate('indexLabel'),
  width: '100rpx',
  sortable: false,
  fixed: false,
  align: 'left' as AlignType,
  ...(isObj(props.index) ? props.index : {}),
}))

/**
 * 获取列的标准化宽度
 */
const getColumnWidth = (width?: string | number) => {
  return width || DEFAULT_COLUMN_WIDTH
}

/**
 * 判断是否使用配置式模式
 */
const isColumnsMode = computed(() => {
  return props.columns && props.columns.length > 0
})

/**
 * 初始化配置式列的排序状态
 */
watch(
  () => props.columns,
  (newColumns) => {
    if (newColumns) {
      columnSortDirections.value = newColumns.map((col) => col.sortDirection || 0)
    }
  },
  { immediate: true },
)

/**
 * 处理行点击事件
 */
const handleRowClick = (index: number) => {
  emit('row-click', { rowIndex: index })
}

/**
 * 是否最后一个固定元素（子组件模式）
 */
const getIsLastFixed = (column: { fixed: boolean; prop: string }) => {
  let isLastFixed = false
  if (column.fixed && isDef(children)) {
    const columns = children.filter((child) => child.fixed)
    if (columns.length && columns[columns.length - 1].prop === column.prop) {
      isLastFixed = true
    }
  }
  return isLastFixed
}

/**
 * 获取固定列样式（子组件模式）
 */
const getFixedStyle = (columnIndex: number, style: CSSProperties) => {
  if (columnIndex > 0) {
    let left: string | number = ''
    children.forEach((column, index) => {
      if (index < columnIndex) {
        const colWidth = addUnit(column.width)
        left = left ? `${left} + ${colWidth}` : colWidth
      }
    })
    style.left = `calc(${left})`
  } else {
    style.left = '0'
  }
  return style
}

/**
 * 处理滚动事件
 */
const handleScroll = (event: any) => {
  state.scrollLeft = event.detail.scrollLeft
}

/**
 * 提供数据给子组件（仅在子组件模式下使用）
 */
linkChildren({
  props,
  state,
  children,
  rowClick: handleRowClick,
  getIsLastFixed,
  getFixedStyle,
})

// 防抖处理滚动事件
const scroll = debounce(handleScroll, 100, { leading: false })

/**
 * 计算实际宽度样式
 */
const realWidthStyle = computed(() => {
  const style: CSSProperties = {
    display: 'flex',
  }
  let width: string | number = ''

  // 配置式模式
  if (isColumnsMode.value) {
    // 序号列宽度
    if (props.index !== false) {
      width = addUnit(indexColumn.value.width)
    }
    // 配置式列宽度
    props.columns!.forEach((column) => {
      const colWidth = addUnit(getColumnWidth(column.width))
      width = width ? `${width} + ${colWidth}` : colWidth
    })
  } else {
    // 子组件模式
    children.forEach((child) => {
      const colWidth = addUnit(getColumnWidth(child.width))
      width = width ? `${width} + ${colWidth}` : colWidth
    })
  }

  style.width = `calc(${width})`
  return objToStyle(style)
})

/**
 * 获取指定字段的列数据
 */
const getColumnData = (prop: string) => {
  if (!Array.isArray(props.data)) {
    return []
  }
  return props.data.map((item) => item[prop])
}

/**
 * 获取行数据
 */
const getRowScope = (index: number) => {
  if (!Array.isArray(props.data)) {
    return {}
  }
  return props.data[index] || {}
}

/**
 * 判断是否最后一个固定元素（配置式模式）
 */
const getIsLastFixedForColumn = (column: any) => {
  if (!column.fixed) return false

  if (isColumnsMode.value) {
    const fixedColumns = props.columns!.filter((col) => col.fixed)
    return fixedColumns.length > 0 && fixedColumns[fixedColumns.length - 1].prop === column.prop
  }

  return getIsLastFixed(column)
}
/**
 * 获取表头单元格类名
 */
const getHeaderCellClass = (column: any) => {
  const classNames = ['wd-table__cell']

  if (props.border) classNames.push('is-border')
  if (column.fixed) classNames.push('is-fixed')
  if (props.stripe) classNames.push('is-stripe')
  classNames.push(`is-${column.align || 'left'}`)

  if (getIsLastFixedForColumn(column) && state.scrollLeft) {
    classNames.push('is-shadow')
  }

  return classNames.join(' ')
}

/**
 * 获取序号列固定样式
 */
const getFixedStyleForIndex = (style: CSSProperties) => {
  style.left = '0'
  return style
}

/**
 * 获取固定列样式（配置式模式）
 */
const getFixedStyleForColumn = (columnIndex: number, style: CSSProperties) => {
  let left: string | number = ''

  // 序号列占用的宽度
  if (props.index !== false) {
    left = addUnit(indexColumn.value.width)
  }

  // 计算前面固定列的宽度
  if (columnIndex > 0) {
    props.columns!.forEach((column, index) => {
      if (index < columnIndex && column.fixed) {
        const colWidth = addUnit(getColumnWidth(column.width))
        left = left ? `${left} + ${colWidth}` : colWidth
      }
    })
  }

  style.left = left ? `calc(${left})` : '0'
  return style
}
/**
 * 获取表头单元格样式
 */
const getHeaderCellStyle = (columnIndex: number) => {
  let style: CSSProperties = {}

  if (isColumnsMode.value) {
    if (columnIndex === -1) {
      // 序号列
      style.width = addUnit(indexColumn.value.width)
      if (indexColumn.value.fixed) {
        style = getFixedStyleForIndex(style)
      }
    } else {
      const column = props.columns![columnIndex]
      style.width = addUnit(getColumnWidth(column.width))
      if (column.fixed) {
        style = getFixedStyleForColumn(columnIndex, style)
      }
    }
  } else {
    const column = children[columnIndex]
    if (column) {
      style.width = addUnit(getColumnWidth(column.width))
      if (column.fixed) {
        style = getFixedStyle(columnIndex, style)
      }
    }
  }

  return objToStyle(style)
}

/**
 * 获取列容器类名（配置式模式）
 */
const getColumnClass = (column: TableColumn) => {
  const classNames = ['wd-table-col']

  if (column.fixed) classNames.push('wd-table-col--fixed')
  if (getIsLastFixedForColumn(column) && state.scrollLeft) {
    classNames.push('is-shadow')
  }

  return classNames.join(' ')
}

/**
 * 获取列容器样式（配置式模式）
 */
const getColumnStyle = (column: TableColumn) => {
  let style: CSSProperties = {}

  style.width = addUnit(getColumnWidth(column.width))

  if (column.fixed) {
    const columnIndex = props.columns!.findIndex((col) => col.prop === column.prop)
    style = getFixedStyleForColumn(columnIndex, style)
  }

  return objToStyle(style)
}

/**
 * 获取单元格类名（配置式模式）
 */
const getCellClass = (index: number, column: TableColumn) => {
  const classNames = ['wd-table__cell']

  if (props.stripe && isOdd(index)) classNames.push('is-stripe')
  if (props.border) classNames.push('is-border')
  classNames.push(`is-${column.align || 'left'}`)

  return classNames.join(' ')
}

/**
 * 获取单元格样式（配置式模式）
 */
const getCellStyle = (column: TableColumn) => {
  const style: CSSProperties = {}

  const rowHeight = isDef(props.rowHeight) ? props.rowHeight : 100
  if (isDef(rowHeight)) {
    style.height = addUnit(rowHeight)
  }

  return objToStyle(style)
}

/**
 * 处理排序变化
 */
const handleSortChange = (value: SortDirection, index: number, column: any) => {
  if (isColumnsMode.value) {
    // 配置式模式
    columnSortDirections.value[index] = value
    // 清除其他列的排序
    columnSortDirections.value.forEach((_, i) => {
      if (i !== index) {
        columnSortDirections.value[i] = 0
      }
    })

    const tableColumn: TableColumn = {
      prop: column.prop,
      label: column.label,
      width: column.width,
      sortable: column.sortable,
      align: column.align,
      sortDirection: value,
      fixed: column.fixed,
    }
    emit('sort-method', tableColumn)
  } else {
    // 子组件模式
    children[index].$.exposed!.sortDirection.value = value
    children.forEach((col, i) => {
      if (index !== i) {
        col.$.exposed!.sortDirection.value = 0
      }
    })

    const tableColumn: TableColumn = {
      prop: children[index].prop,
      label: children[index].label,
      width: children[index].width,
      sortable: children[index].sortable,
      align: children[index].align,
      sortDirection: value,
      fixed: children[index].fixed,
    }
    emit('sort-method', tableColumn)
  }
}
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

  @include b(table) {
    background: $-dark-background;

    @include when(border) {
      border: 2rpx solid $-dark-border-color;
    }

    @include e(cell) {
      color: $-dark-color;
      background: $-dark-background2;

      @include when(stripe) {
        background: $-dark-background4;
      }

      @include when(border) {
        border-right: 1rpx solid $-dark-border-color;
        border-bottom: 1rpx solid $-dark-border-color;
      }

      @include when(shadow) {
        &::after {
          background: linear-gradient(270deg, rgba(17, 17, 17, 0.2) 0%, rgba(0, 0, 0, 0) 100%);
        }
      }
    }
  }
}

// 表格容器样式
@include b(table) {
  position: relative;
  width: 100%;
  overflow: auto;
  background: $-table-bg;

  @include when(border) {
    border: 1rpx solid $-table-border-color;
  }

  :deep() {
    .wd-table-col:last-child {
      .wd-table__cell {
        @include when(border) {
          border-right: none;
        }
      }
    }
  }

  @include e(header) {
    width: 100%;
    height: 100rpx;
    position: sticky;
    top: 0;
    z-index: 2;
    display: flex;
    overflow-x: auto;
    white-space: nowrap;
  }

  @include e(body) {
    width: 100%;
    box-sizing: border-box;
  }

  @include e(content) {
    display: flex;

    @include m(header) {
      position: sticky;
      top: 0;
      z-index: 2;
    }
  }

  @include e(cell) {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    background: $-table-bg;
    width: 200rpx;
    min-height: 100rpx;
    padding: 16rpx 20rpx;
    font-size: $-table-font-size;
    color: $-table-color;
    --wot-sort-button-height: 60rpx;

    @include when(border) {
      border-right: 1rpx solid $-table-border-color;
      border-bottom: 1rpx solid $-table-border-color;
    }

    @include when(stripe) {
      background: $-table-stripe-bg;
    }

    @include when(fixed) {
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

    @include when(left) {
      justify-content: flex-start;
    }

    @include when(center) {
      justify-content: center;
    }

    @include when(right) {
      justify-content: flex-end;
    }
  }

  @include e(wrapper) {
    width: 100%;
    overflow: auto;
  }

  @include e(inner) {
    display: flex;
    flex-direction: column;
  }

  @include e(header-row) {
    display: flex;
    flex-direction: row;
    width: 100%;
  }

  @include e(body) {
    display: flex;
    width: 100%;
  }

  @include e(value) {
    white-space: normal;
    @include when(ellipsis) {
      word-break: break-all;
      @include multiEllipsis(2);
    }
  }
}

// 表格列样式
@include b(table-col) {
  .wd-table__cell {
    width: 100%;
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
