<!-- PickerView 选择器视图 选择器视图，用于从一组数据中选择单个或多个值。 -->
<template>
  <view :class="`wd-picker-view ${customClass}`" :style="customStyle">
    <view v-if="loading" class="wd-picker-view__loading">
      <wd-loading :color="loadingColor" />
    </view>
    <view :style="`height: ${addUnit(columnsHeight - 40)};`">
      <picker-view
        mask-class="wd-picker-view__mask"
        indicator-class="wd-picker-view__roller"
        :indicator-style="`height: ${addUnit(itemHeight)};`"
        :style="`height: ${addUnit(columnsHeight - 40)};`"
        :value="selectedIndex"
        :immediate-change="immediateChange"
        @change="onChange"
        @pickstart="onPickStart"
        @pickend="onPickEnd"
      >
        <picker-view-column
          v-for="(col, colIndex) in formatColumns"
          :key="colIndex"
          class="wd-picker-view-column"
        >
          <view
            v-for="(row, rowIndex) in col"
            :key="rowIndex"
            :class="`wd-picker-view-column__item ${row.disabled ? 'wd-picker-view-column__item--disabled' : ''}  ${
              selectedIndex[colIndex] === rowIndex ? 'wd-picker-view-column__item--active' : ''
            }`"
            :style="`line-height: ${addUnit(itemHeight)};`"
          >
            {{ row[labelKey] }}
          </view>
        </picker-view-column>
      </picker-view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { ComponentPublicInstance } from 'vue'
import { getCurrentInstance, nextTick, ref, watch } from 'vue'
import { addUnit, deepClone, getType, isArray, isDef, isEqual, range } from '../common/util'
import wdLoading from '../wd-loading/wd-loading.vue'
import { formatArray, parseInputValue } from './wd-picker-view-utils'

defineOptions({
  name: 'WdPickerView',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 列选项数据项接口
 */
export interface ColumnItem {
  [key: string]: any

  /** 选项值 */
  value?: string | number | boolean
  /** 选项标签 */
  label?: string
  /** 是否禁用 */
  disabled?: boolean
}

/**
 * 列变化回调函数类型
 */
export type PickerViewColumnChange = (
  pickerView: WdPickerViewExpose,
  selects: Record<string, any> | Record<string, any>[],
  index: number,
  resolve: () => void,
) => void

// 定义组件实例类型
export type PickerViewInstance = ComponentPublicInstance<WdPickerViewProps, WdPickerViewExpose>

/**
 * 选择器值类型 - 支持混合数组
 */
export type PickerViewValue = string | number | boolean | Array<string | number | boolean>

/**
 * 选择器视图组件属性接口
 */
interface WdPickerViewProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 加载状态 */
  loading?: boolean
  /** 加载的颜色，只能使用十六进制的色值写法，且不能使用缩写 */
  loadingColor?: string
  /** picker内部滚筒高度 */
  columnsHeight?: number
  /** 选项对象中，value对应的 key */
  valueKey?: string
  /** 选项对象中，展示的文本对应的 key */
  labelKey?: string
  /** 是否在手指松开时立即触发picker-view的 change 事件。若不开启则会在滚动动画结束后触发 change 事件，1.2.25版本起提供，仅微信小程序和支付宝小程序支持 */
  immediateChange?: boolean
  /** 选项高度 */
  itemHeight?: number
  /** 选中项  */
  modelValue: PickerViewValue
  /** 选择器数据，可以为字符串数组，也可以为对象数组，如果为二维数组，则为多列选择器 */
  columns?: Array<string | number | ColumnItem | Array<number> | Array<string> | Array<ColumnItem>>
  /** 接收 pickerView 实例、选中项、当前修改列的下标、resolve 作为入参，根据选中项和列下标进行判断，通过 pickerView 实例暴露出来的 setColumnData 方法修改其他列的数据源 */
  columnChange?: PickerViewColumnChange
}

/**
 * 选择器视图组件事件接口
 */
interface WdPickerViewEmits {
  /** 选中项变化时触发 */
  change: [{ picker: WdPickerViewExpose; value: PickerViewValue; index: number }]
  /** 开始滚动时触发 */
  pickstart: []
  /** 结束滚动时触发 */
  pickend: []
  /** 更新选中值 */
  'update:modelValue': [value: PickerViewValue]
}

/**
 * 选择器视图组件暴露接口
 */
export interface WdPickerViewExpose {
  /** 获取所有列选中项 */
  getSelects: () => Record<string, any> | Record<string, any>[]
  /** 获取所有列的选中值 */
  getValues: () => PickerViewValue
  /** 设置列数据 */
  setColumnData: (
    columnIndex: number,
    data: Array<string | number | ColumnItem | Array<string | number | ColumnItem>>,
    rowIndex?: number,
  ) => void
  /** 获取所有列数据 */
  getColumnsData: () => Record<string, string>[][]
  /** 获取某一列的选项 */
  getColumnData: (columnIndex: number) => Record<string, string>[]
  /** 获取某一列的选中项下标 */
  getColumnIndex: (columnIndex: number) => number
  /** 获取所有列选中项的label */
  getLabels: () => string[]
  /** 获取选中索引数组 */
  getSelectedIndex: () => number[]
  /** 重置列数据为指定列数据 */
  resetColumns: (
    columns: (string | number | string[] | number[] | ColumnItem | ColumnItem[])[],
  ) => void
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdPickerViewProps>(), {
  customStyle: '',
  customClass: '',
  loading: false,
  loadingColor: '#4D80F0',
  columnsHeight: 217,
  valueKey: 'value',
  labelKey: 'label',
  immediateChange: false,
  itemHeight: 35,
  columns: () => [],
})

// 定义组件事件
const emit = defineEmits<WdPickerViewEmits>()

// 获取当前组件实例
const { proxy } = getCurrentInstance() as any

// 响应式数据：格式化后的列数据
const formatColumns = ref<ColumnItem[][]>([])
/** 格式化之后，每列选中的下标集合 */
const selectedIndex = ref<Array<number>>([])

/**
 * 修正选中项指定列行的值
 * @param columnIndex 列下标
 * @param rowIndex 行下标
 * @param selected 选中值列表
 * @returns 修正后的选中值列表
 */
const correctSelectedIndex = (columnIndex: number, rowIndex: number, selected: number[]) => {
  const col = formatColumns.value[columnIndex]
  if (!col || !col[rowIndex]) {
    throw new Error(`The value to select with Col:${columnIndex} Row:${rowIndex} is incorrect`)
  }

  const select: number[] = deepClone(selected)
  select[columnIndex] = rowIndex

  // 被禁用的无法选中，选中距离它最近的未被禁用的
  if (col[rowIndex].disabled) {
    // 寻找值为0或最最近的未被禁用的节点的索引
    const prev = col
      .slice(0, rowIndex)
      .reverse()
      .findIndex((s) => !s.disabled)
    const next = col.slice(rowIndex + 1).findIndex((s) => !s.disabled)

    if (prev !== -1) {
      select[columnIndex] = rowIndex - 1 - prev
    } else if (next !== -1) {
      select[columnIndex] = rowIndex + 1 + next
    } else if (select[columnIndex] === undefined) {
      select[columnIndex] = 0
    }
  }
  return select
}

/**
 * 根据传入的value，寻找对应的索引，并传递给原生选择器
 * 需要保证formatColumns先设置，之后会修改selectedIndex
 * @param value 选中值
 */
const selectWithValue = (value: PickerViewValue) => {
  if (formatColumns.value.length === 0) {
    selectedIndex.value = [] // 如果列为空，直接清空选中索引
    return
  }

  // 使其默认选中首项
  if (value === '' || !isDef(value) || (isArray(value) && value.length === 0)) {
    value = formatColumns.value.map((col) => {
      return col[0][props.valueKey]
    })
  }

  const valueType = getType(value)
  const type = ['string', 'number', 'boolean', 'array']
  if (!type.includes(valueType)) {
    console.error(`value must be one of ${type.toString()}`)
  }

  /**
   * 1.解析传入的值为数组格式
   * 2.根据formatColumns的长度截取Array<String>，保证下面的遍历不溢出
   * 3.根据每列的key值找到选项中value为此key的下标并记录
   */
  let parsedValues = parseInputValue(value)
  parsedValues = parsedValues.slice(0, formatColumns.value.length)

  let selected: number[] = deepClone(selectedIndex.value)
  parsedValues.forEach((target, col) => {
    let row = formatColumns.value[col].findIndex((row) => {
      return row[props.valueKey].toString() === target.toString()
    })
    row = row === -1 ? 0 : row
    selected = correctSelectedIndex(col, row, selected)
  })

  /**
   * 根据formatColumns的长度去除selectWithIndex无用的部分。
   * 始终保持value、selectWithIndex、formatColumns长度一致
   */
  selectedIndex.value = selected.slice(0, parsedValues.length)
}

/**
 * 修正选中项的值
 * @param value 当前picker选择器选中的值
 * @returns 修正后的选中值
 */
const correctSelected = (value: number[]) => {
  let selected = deepClone(value)
  value.forEach((row, col) => {
    row = range(row, 0, formatColumns.value[col].length - 1)
    selected = correctSelectedIndex(col, row, selected)
  })
  return selected
}

/**
 * 获取选中项变化的列的下标
 * @param now 当前选中项值
 * @param origin 旧选中项值
 * @returns 变化列的下标
 */
const getChangeColumn = (now: number[], origin: number[]) => {
  if (!now || !origin) return -1
  const index = now.findIndex((row, index) => row !== origin[index])
  return index
}

/**
 * 获取变化的差异信息
 * @param value 当前选中值
 * @returns 变化的列或行索引
 */
const getChangeDiff = (value: number[]) => {
  value = value.slice(0, formatColumns.value.length)

  // 保留选中前的
  const origin: number[] = deepClone(selectedIndex.value)
  // 存储赋值旧值，便于外部比较
  let selected: number[] = deepClone(selectedIndex.value)

  value.forEach((row, col) => {
    row = range(row, 0, formatColumns.value[col].length - 1)
    if (row === origin[col]) return
    selected = correctSelectedIndex(col, row, selected)
  })

  // 值变化的列
  const diffCol = getChangeColumn(selected, origin)
  if (diffCol === -1) return

  // 获取变化的的行
  const diffRow = selected[diffCol]

  // 如果selectedIndex只有一列，返回选中项的索引；如果是多项，返回选中项所在的列。
  return selected.length === 1 ? diffRow : diffCol
}

/**
 * 获取所有列选中项，返回值为一个数组
 */
const getSelects = () => {
  const selects = selectedIndex.value.map((row, col) => formatColumns.value[col][row])
  // 单列选择器，则返回单项
  if (selects.length === 1) {
    return selects[0]
  }
  return selects
}

/**
 * 格式化输出值，根据原始输入类型决定返回格式
 * @param values 内部计算的值数组
 * @param originalValue 原始输入值，用于确定返回格式
 * @returns 格式化后的值
 */
const formatOutputValue = (values: any[], originalValue: PickerViewValue): PickerViewValue => {
  // 如果原始值是逗号分隔的字符串，返回逗号分隔的字符串
  if (typeof originalValue === 'string' && originalValue.includes(',')) {
    return values.join(',')
  }

  // 如果有多列且原始值是数组，返回数组
  if (formatColumns.value.length > 1 && isArray(originalValue)) {
    return values as Array<string | number>
  }

  // 单列选择器，返回单个值
  return values.length === 1 ? values[0] : values
}

/**
 * 获取所有列的选中值
 * 根据原始输入类型格式化输出
 */
const getValues = (): PickerViewValue => {
  const { valueKey } = props
  const values = selectedIndex.value.map((row, col) => {
    return formatColumns.value[col][row][valueKey]
  })

  // 根据原始输入类型格式化输出
  return formatOutputValue(values, props.modelValue)
}
/**
 * 列更新处理
 * @param index 列下标
 */
const handleChange = (index: number) => {
  const value = getValues()

  // 避免多次触发change
  if (isEqual(value, props.modelValue)) return

  emit('update:modelValue', value)
  // 延迟一下，避免组件刚渲染时调用者的事件未初始化好
  setTimeout(() => {
    emit('change', {
      picker: proxy.$.exposed,
      value,
      index,
    })
  }, 0)
}

/**
 * 选择器选中项变化时触发
 * @param event 变化事件
 */
const onChange = ({ detail: { value } }: { detail: { value: number[] } }) => {
  value = value.map((v: any) => {
    return Number(v || 0)
  })

  const index = getChangeDiff(value)
  // 先将picker选择器的值赋给selectedIndex，然后重新赋予修正后的值，防止两次操作修正结果一致时pikcer视图不刷新
  selectedIndex.value = deepClone(value)

  nextTick(() => {
    // 重新赋予修正后的值
    selectedIndex.value = correctSelected(value)

    if (props.columnChange) {
      // columnsChange 可能有异步操作，需要添加 resolve 进行回调通知，形参小于4个则为同步
      if (props.columnChange.length < 4) {
        props.columnChange(proxy.$.exposed, getSelects(), index || 0, () => {})
        handleChange(index || 0)
      } else {
        props.columnChange(proxy.$.exposed, getSelects(), index || 0, () => {
          // 如果selectedIndex只有一列，返回此项；如果是多项，返回所有选中项。
          handleChange(index || 0)
        })
      }
    } else {
      // 如果selectedIndex只有一列，返回此项；如果是多项，返回所有选中项。
      handleChange(index || 0)
    }
  })
}

/**
 * 监听选中值和列数据变化
 * 当这些值发生变化时，重新格式化列数据并更新选中项
 */
watch(
  [() => props.modelValue, () => props.columns],
  (newValue, oldValue) => {
    // 检查列数据是否发生变化
    if (!isEqual(oldValue?.[1], newValue[1])) {
      if (isArray(newValue[1]) && newValue[1].length > 0) {
        formatColumns.value = formatArray(newValue[1], props.valueKey, props.labelKey)
      } else {
        // 当 columns 变为空时，清空 formatColumns 和 selectedIndex
        formatColumns.value = []
        selectedIndex.value = []
      }
    }

    // 根据新的选中值更新选中项
    if (isDef(newValue[0])) {
      selectWithValue(newValue[0])
    }
  },
  { deep: true, immediate: true },
)

/**
 * 获取所有列选中项的label，返回值为一个数组
 */
const getLabels = () => {
  const { labelKey } = props
  return selectedIndex.value.map((row, col) => formatColumns.value[col][row][labelKey])
}

/**
 * 获取某一列的选中项下标
 * @param columnIndex 列的下标
 * @returns 下标
 */
const getColumnIndex = (columnIndex: number) => {
  return selectedIndex.value[columnIndex]
}

/**
 * 获取某一列的选项
 * @param columnIndex 列的下标
 * @returns 当前列的集合
 */
const getColumnData = (columnIndex: number) => {
  return formatColumns.value[columnIndex]
}

/**
 * 设置列数据
 * @param columnIndex 列下标
 * @param data 列数据
 * @param rowIndex 行下标
 */
const setColumnData = (
  columnIndex: number,
  data: Array<string | number | ColumnItem | Array<string | number | ColumnItem>>,
  rowIndex: number = 0,
) => {
  formatColumns.value[columnIndex] = formatArray(data, props.valueKey, props.labelKey).reduce(
    (acc, val) => acc.concat(val),
    [],
  )
  selectedIndex.value = correctSelectedIndex(columnIndex, rowIndex, selectedIndex.value)
}

/**
 * 获取所有列数据的深拷贝
 */
const getColumnsData = () => {
  return deepClone(formatColumns.value)
}

/**
 * 获取选中索引数组
 */
const getSelectedIndex = () => {
  return selectedIndex.value
}

/**
 * 重置列数据为指定列数据
 * @param columns 新的列数据
 */
const resetColumns = (
  columns: (string | number | string[] | number[] | ColumnItem | ColumnItem[])[],
) => {
  if (isArray(columns) && columns.length) {
    formatColumns.value = formatArray(columns, props.valueKey, props.labelKey)
  }
}

/**
 * 开始滚动事件处理
 */
const onPickStart = () => {
  emit('pickstart')
}

/**
 * 结束滚动事件处理
 */
const onPickEnd = () => {
  emit('pickend')
}

// 暴露组件方法
defineExpose<WdPickerViewExpose>({
  getSelects,
  getValues,
  setColumnData,
  getColumnsData,
  getColumnData,
  getColumnIndex,
  getLabels,
  getSelectedIndex,
  resetColumns,
})
</script>

<style lang="scss">
// 引入外部样式文件
@import './../common/abstracts/_mixin.scss';
@import './../common/abstracts/variable.scss';

// 暗色主题样式
.wot-theme-dark {
  @include b(picker-view) {
    @include e(columns) {
      background: $-dark-background2;
    }

    :deep(.wd-picker-view__roller) {
      background: $-dark-background4;
    }
  }

  @include b(picker-view-column) {
    color: $-dark-color;

    @include e(item) {
      @include m(disabled) {
        color: $-dark-color-gray;
      }
    }
  }
}

// 选择器视图主体样式
@include b(picker-view) {
  position: relative;
  padding: 20rpx 0;

  // 列容器样式
  @include e(columns) {
    position: relative;
    display: flex;
    background: $-picker-bg;
    overflow: hidden;
    align-items: center;
  }

  // 遮罩样式
  @include edeep(mask) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: $-picker-mask;
    background-position: top, bottom;
    background-repeat: no-repeat;
    z-index: 2;
    pointer-events: none;
    filter: blur(8rpx);
  }

  // 加载状态样式
  @include e(loading) {
    position: absolute;
    display: flex;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    align-items: center;
    justify-content: center;
    z-index: 3;
    background: $-picker-loading-bg;
  }

  // 滚筒样式
  @include edeep(roller) {
    background: rgba(245, 245, 245, 1);
    z-index: 0;

    &::before,
    &::after {
      display: none;
    }
  }
}

// 选择器视图列样式
@include b(picker-view-column) {
  flex: 1;
  font-size: $-picker-column-fs;
  color: $-picker-column-color;
  text-align: center;
  transition-timing-function: cubic-bezier(0.28, 0.8, 0.63, 1);

  // 列选项样式
  @include e(item) {
    padding: $-picker-column-padding;
    @include lineEllipsis;

    // 禁用状态样式
    @include m(disabled) {
      color: $-picker-column-disabled-color;
    }
  }
}
</style>
