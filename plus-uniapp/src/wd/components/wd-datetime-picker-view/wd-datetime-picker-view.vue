<!-- DatetimePickerView 日期时间选择器视图 为 Picker 组件的封装，在其内部构建好日期时间选项。 -->
<template>
  <wd-picker-view
    ref="datePickerview"
    v-model="pickerValue"
    :custom-class="customClass"
    :custom-style="customStyle"
    :immediate-change="immediateChange"
    :columns="columns"
    :columns-height="columnsHeight"
    :item-height="70"
    :column-change="columnChange"
    :loading="loading"
    :loading-color="loadingColor"
    @change="onChange"
    @pickstart="onPickStart"
    @pickend="onPickEnd"
  />
</template>

<script lang="ts" setup>
import type { ComponentPublicInstance } from 'vue'
import type { PickerViewInstance } from '../wd-picker-view/wd-picker-view.vue'
import { getCurrentInstance, onBeforeMount, ref, watch } from 'vue'
import { debounce, isArray, isDef, isFunction, isString, padZero, range } from '../common/util'
import wdPickerView from '../wd-picker-view/wd-picker-view.vue'
import {
  PickerViewValue,
  WdPickerViewExpose,
} from '@/wd/components/wd-picker-view/wd-picker-view.vue'

defineOptions({
  name: 'WdDatetimePickerView',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 日期时间类型
 */
export type DateTimeType = 'date' | 'year-month' | 'time' | 'datetime' | 'year'

/**
 * 日期时间选择器列类型
 */
export type DatetimePickerViewColumnType = 'year' | 'month' | 'date' | 'hour' | 'minute' | 'second'

/**
 * 日期时间选择器选项
 */
interface DatetimePickerViewOption {
  label: string
  value: number
}

/**
 * 日期时间选择器过滤器函数类型
 */
export type DatetimePickerViewFilter = (
  type: DatetimePickerViewColumnType,
  values: number[],
) => number[]

/**
 * 日期时间选择器格式化函数类型
 */
export type DatetimePickerViewFormatter = (type: string, value: string) => string

/**
 * 日期时间选择器列格式化函数类型
 */
export type DatetimePickerViewColumnFormatter = (
  picker: DatetimePickerViewInstance,
) => DatetimePickerViewOption[][]

/**
 * 日期时间选择器组件属性接口
 */
interface WdDatetimePickerViewProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 选中项，当 type 为 time 时，类型为字符串，否则为时间戳 */
  modelValue: string | number
  /** 加载中 */
  loading?: boolean
  /** 加载的颜色，只能使用十六进制的色值写法，且不能使用缩写 */
  loadingColor?: string
  /** picker内部滚筒高 */
  columnsHeight?: number
  /** 选项的key */
  valueKey?: string
  /** 选项的label */
  labelKey?: string
  /** 选择器类型，可选值：date / year-month / time / datetime / year */
  type?: DateTimeType
  /** 自定义过滤选项的函数，返回列的选项数组 */
  filter?: DatetimePickerViewFilter
  /** 自定义弹出层选项文案的格式化函数，返回一个字符串 */
  formatter?: DatetimePickerViewFormatter
  /** 自定义列的格式化函数 */
  columnFormatter?: DatetimePickerViewColumnFormatter
  /** 最小日期 */
  minDate?: number
  /** 最大日期 */
  maxDate?: number
  /** 最小小时，time类型时生效 */
  minHour?: number
  /** 最大小时，time类型时生效 */
  maxHour?: number
  /** 最小分钟，time类型时生效 */
  minMinute?: number
  /** 最大分钟，time类型时生效 */
  maxMinute?: number
  /** 是否显示秒选择，仅在 time 和 datetime 类型下生效 */
  useSecond?: boolean
  /** 最小秒数，仅在 time 和 datetime 类型下生效 */
  minSecond?: number
  /** 最大秒数，仅在 time 和 datetime 类型下生效 */
  maxSecond?: number
  /** 是否在手指松开时立即触发picker-view的 change 事件 */
  immediateChange?: boolean
  startSymbol?: boolean
}

/**
 * 日期时间选择器组件事件接口
 */
interface WdDatetimePickerViewEmits {
  /** 选中项变化时触发 */
  // prettier-ignore
  change: [event: { value: string | number, picker: DatetimePickerViewInstance }]
  /** 开始选择时触发 */
  pickstart: []
  /** 结束选择时触发 */
  pickend: []
  /** 更新模型值 */
  'update:modelValue': [value: string | number]
}

/**
 * 日期时间选择器组件暴露方法接口
 */
interface DatetimePickerViewExpose {
  updateColumns: () => DatetimePickerViewOption[][]
  setColumns: (columnList: DatetimePickerViewOption[][]) => void
  getSelects: () => Record<string, any> | Record<string, any>[] | undefined
  correctValue: (value: string | number) => string | number
  getPickerValue: (value: string | number, type: DateTimeType) => number[]
  getOriginColumns: () => {
    type: DatetimePickerViewColumnType
    values: number[]
  }[]
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdDatetimePickerViewProps>(), {
  customStyle: '',
  customClass: '',
  loading: false,
  loadingColor: '#4D80F0',
  // 弹窗高度匹配 item-height=70rpx,5 行可见(中间加粗 + 上下各 2 行虚化),原 217rpx 仅约 5 行 *17.5px 太挤
  columnsHeight: 400,
  valueKey: 'value',
  labelKey: 'label',
  type: 'datetime',
  minDate: () => new Date(new Date().getFullYear() - 10, 0, 1).getTime(),
  maxDate: () => new Date(new Date().getFullYear() + 10, 11, 31).getTime(),
  minHour: 0,
  maxHour: 23,
  minMinute: 0,
  maxMinute: 59,
  useSecond: false,
  minSecond: 0,
  maxSecond: 59,
  immediateChange: false,
  startSymbol: false,
})

// 定义组件事件
const emit = defineEmits<WdDatetimePickerViewEmits>()

// 响应式数据
const datePickerview = ref<PickerViewInstance>()
const innerValue = ref<null | string | number>(null)
const columns = ref<DatetimePickerViewOption[][]>([])
const pickerValue = ref<string | number | boolean | Array<string | number | boolean>>([])
const created = ref<boolean>(false)

// 获取当前组件实例
const { proxy } = getCurrentInstance() as any

/**
 * 判断传入的日期值是否有效
 * @param date 日期值，可以是字符串、数字或Date对象
 * @returns 返回true表示日期有效
 */
const isValidDate = (date: string | number | Date) => isDef(date) && !Number.isNaN(date)

/**
 * 修正和验证输入值，确保值在有效范围内
 * @param value 输入的原始值
 * @returns 修正后的有效值
 */
const correctValue = (value: string | number | Date): string | number => {
  const isDateType = props.type !== 'time'

  // 日期类型验证：无效时使用最小日期
  if (isDateType && !isValidDate(value)) {
    // 是Date类型，但入参不可用，使用最小时间戳代替
    value = props.minDate
  } else if (!isDateType && !value) {
    // 时间类型：无值时使用最小时间
    value = props.useSecond ? `${padZero(props.minHour)}:00:00` : `${padZero(props.minHour)}:00`
  }

  // 时间格式处理和范围限制
  if (!isDateType) {
    // 非Date类型，直接走此逻辑
    let [hour, minute, second = '00'] = (isString(value) ? value : value.toString()).split(':')
    // 限制小时、分钟、秒数在有效范围内
    hour = padZero(range(Number(hour), props.minHour, props.maxHour))
    minute = padZero(range(Number(minute), props.minMinute, props.maxMinute))
    if (props.useSecond) {
      second = padZero(range(Number(second), props.minSecond, props.maxSecond))
      return `${hour}:${minute}:${second}`
    }
    return `${hour}:${minute}`
  }

  // 日期范围限制：确保在最小最大日期之间
  value = Math.min(Math.max(Number(value), props.minDate), props.maxDate)

  return value
}

/**
 * 获取指定年月的最后一天日期
 * @param year 年份
 * @param month 月份（1-12）
 * @returns 该月的最大天数
 */
const getMonthEndDay = (year: number, month: number) => {
  return 32 - new Date(year, month - 1, 32).getDate()
}

/**
 * 根据边界类型和当前时间计算各时间单位的边界值
 * 用于确定选择器中每一列应该显示的最小最大值
 * @param type 边界类型，'min'表示最小值，'max'表示最大值
 * @param innerValue 当前选中的时间戳
 * @returns 包含各时间单位边界值的对象
 */
const getBoundary = (type: 'min' | 'max', innerValue: number) => {
  const value = new Date(innerValue)
  const boundary = new Date(props[`${type}Date`])
  const year = boundary.getFullYear()
  let month: number = 1
  let date: number = 1
  let hour: number = 0
  let minute: number = 0
  let second: number = 0

  // 设置最大值的默认边界
  if (type === 'max') {
    month = 12
    date = getMonthEndDay(value.getFullYear(), value.getMonth() + 1)
    hour = 23
    minute = 59
    second = 59
  }

  // 当选中年份与边界年份相同时，需要进一步限制月份
  if (value.getFullYear() === year) {
    month = boundary.getMonth() + 1
    // 当选中月份与边界月份相同时，需要进一步限制日期
    if (value.getMonth() + 1 === month) {
      date = boundary.getDate()
      // 当选中日期与边界日期相同时，需要进一步限制小时
      if (value.getDate() === date) {
        hour = boundary.getHours()
        // 当选中小时与边界小时相同时，需要进一步限制分钟
        if (value.getHours() === hour) {
          minute = boundary.getMinutes()
          // 当选中分钟与边界分钟相同时，需要进一步限制秒数
          if (value.getMinutes() === minute) {
            second = boundary.getSeconds()
          }
        }
      }
    }
  }
  return {
    [`${type}Year`]: year,
    [`${type}Month`]: month,
    [`${type}Date`]: date,
    [`${type}Hour`]: hour,
    [`${type}Minute`]: minute,
    [`${type}Second`]: second,
  }
}

/**
 * 计算各列的时间边界范围
 * 根据选择器类型和当前选中时间，计算每一列应该显示的数值范围
 * @returns 包含列类型和范围的配置数组
 */
const getRanges = (): Array<{ type: DatetimePickerViewColumnType; range: number[] }> => {
  // 时间类型特殊处理：只需要时分秒列
  if (props.type === 'time') {
    const result: Array<{ type: DatetimePickerViewColumnType; range: number[] }> = [
      { type: 'hour', range: [props.minHour, props.maxHour] },
      { type: 'minute', range: [props.minMinute, props.maxMinute] },
    ]
    if (props.useSecond) {
      result.push({ type: 'second', range: [props.minSecond, props.maxSecond] })
    }
    return result
  }

  // 日期类型处理：根据最小最大日期计算边界
  const { maxYear, maxDate, maxMonth, maxHour, maxMinute, maxSecond } = getBoundary(
    'max',
    innerValue.value as number,
  )
  const { minYear, minDate, minMonth, minHour, minMinute, minSecond } = getBoundary(
    'min',
    innerValue.value as number,
  )

  const result: Array<{ type: DatetimePickerViewColumnType; range: number[] }> = [
    { type: 'year', range: [minYear, maxYear] },
    { type: 'month', range: [minMonth, maxMonth] },
    { type: 'date', range: [minDate, maxDate] },
    { type: 'hour', range: [minHour, maxHour] },
    { type: 'minute', range: [minMinute, maxMinute] },
  ]

  // 根据选择器类型调整显示的列
  if (props.type === 'datetime' && props.useSecond) {
    result.push({ type: 'second', range: [minSecond, maxSecond] })
  }
  if (props.type === 'date') result.splice(3, 2) // 移除时分列
  if (props.type === 'year-month') result.splice(2, 3) // 移除日时分列
  if (props.type === 'year') result.splice(1, 4) // 移除月日时分列

  return result
}

/**
 * 生成指定长度的数组并使用迭代器函数填充
 * @param n 数组长度
 * @param iteratee 迭代器函数，接收索引返回对应值
 * @returns 生成的数组
 */
const times = (n: number, iteratee: (index: number) => number) => {
  let index: number = -1
  const length = n < 0 ? 0 : n
  const result: number[] = Array.from({ length })
  while (++index < n) {
    result[index] = iteratee(index)
  }
  return result
}

/**
 * 获取原始列配置数据
 * 计算每一列的类型和数值范围，不包含格式化的label
 * @returns 包含类型和数值数组的原始列配置
 */
const getOriginColumns = () => {
  const { filter } = props
  return getRanges().map(({ type, range }) => {
    // 根据范围生成连续的数值数组
    let values = times(range[1] - range[0] + 1, (index: number) => {
      return range[0] + index
    })

    // 如果有过滤函数，则应用过滤
    if (filter) {
      values = filter(type, values)
    }

    return {
      type,
      values,
    }
  })
}

/**
 * 使用格式化函数处理并更新列数据
 * 根据原始列数据生成带有label和value的选项数组
 * @returns 格式化后的列数据数组
 */
const updateColumns = (): DatetimePickerViewOption[][] => {
  const { formatter, columnFormatter } = props
  if (columnFormatter) {
    // 使用自定义列格式化函数
    return columnFormatter(proxy.$.exposed)
  } else {
    // 使用默认格式化逻辑
    return getOriginColumns().map((column) => {
      return column.values.map((value) => {
        return {
          label: formatter ? formatter(column.type, padZero(value)) : padZero(value),
          value,
        }
      })
    })
  }
}

/**
 * 根据传入的值和类型转换为picker选项数组
 * @param value 输入值，时间类型为字符串(HH:mm:ss)，日期类型为时间戳
 * @param type 选择器类型
 * @returns 返回对应的数值数组，用于设置picker的选中索引
 */
const getPickerValue = (value: string | number, type: DateTimeType): number[] => {
  const values: number[] = []

  if (type === 'time') {
    // 时间类型：解析 "HH:mm:ss" 格式字符串
    const pair = String(value).split(':')
    values.push(Number.parseInt(pair[0]), Number.parseInt(pair[1]))
    if (pair[2]) {
      values.push(Number.parseInt(pair[2]))
    }
  } else {
    // 日期类型：解析时间戳并提取年月日时分秒
    const date = new Date(value)
    values.push(date.getFullYear(), date.getMonth() + 1)
    if (type === 'date') {
      values.push(date.getDate())
    } else if (type === 'datetime') {
      values.push(date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds())
    }
  }
  return values
}

/**
 * 根据传入值更新列数据和选中项
 * @param value 要设置的值
 */
const updateColumnValue = (value: string | number) => {
  // 将值转换为picker能识别的数组格式
  const values = getPickerValue(value, props.type)
  // 如果外部传入值与当前值不同，触发更新事件
  if (props.modelValue !== value) {
    emit('update:modelValue', value)
    emit('change', {
      value,
      picker: proxy.$.exposed,
    })
  }
  // 更新内部状态
  innerValue.value = value
  columns.value = updateColumns()
  pickerValue.value = values
}

/**
 * 防抖更新函数，避免频繁的数据更新操作
 * 当props发生变化时，延迟50ms后执行更新逻辑
 */
const updateValue = debounce(() => {
  // 只有在组件初始化完成后才执行更新
  if (!created.value) return
  const val = correctValue(props.modelValue)
  const isEqual = val === innerValue.value
  if (!isEqual) {
    // 值发生变化，更新列值和选中项
    updateColumnValue(val)
  } else {
    // 值未变化，仅重新计算列数据
    columns.value = updateColumns()
  }
}, 50)

/**
 * 监听 modelValue 变化，当外部传入值发生变化时同步更新内部状态
 */
watch(
  () => props.modelValue,
  (val, oldVal) => {
    if (val === oldVal) return
    // 修正传入值并更新列数据
    const value = correctValue(val)
    updateColumnValue(value)
  },
  { deep: true, immediate: true },
)

/**
 * 监听 type 变化并进行类型验证
 * 当选择器类型改变时，需要重新计算所有列数据
 */
watch(
  () => props.type,
  (target) => {
    const validTypes = ['date', 'year-month', 'time', 'datetime', 'year']
    if (!validTypes.includes(target)) {
      console.error(`type must be one of ${validTypes}`)
    }
    // 每次type更新时都需要刷新整个列表
    updateValue()
  },
  { deep: true, immediate: true },
)

/**
 * 监听各种格式化函数属性变化
 * 这些函数影响列数据的生成和显示格式
 */
watch(
  () => props.filter,
  (fn) => {
    if (fn && !isFunction(fn)) {
      console.error('The type of filter must be Function')
    }
    updateValue()
  },
  { deep: true, immediate: true },
)

/**
 * 监听 formatter 属性变化
 */
watch(
  () => props.formatter,
  (fn) => {
    if (fn && !isFunction(fn)) {
      console.error('The type of formatter must be Function')
    }
    updateValue()
  },
  { deep: true, immediate: true },
)

/**
 * 监听 columnFormatter 属性变化
 */
watch(
  () => props.columnFormatter,
  (fn) => {
    if (fn && !isFunction(fn)) {
      console.error('The type of columnFormatter must be Function')
    }
    updateValue()
  },
  { deep: true, immediate: true },
)

/**
 * 监听时间范围相关属性变化
 * 包括最小最大日期、时分秒范围等，这些变化会影响选项范围
 */
watch(
  [
    () => props.minDate,
    () => props.maxDate,
    () => props.minHour,
    () => props.maxHour,
    () => props.minMinute,
    () => props.maxMinute,
    () => props.minSecond,
    () => props.maxSecond,
    () => props.useSecond,
  ],
  () => {
    updateValue()
  },
  { deep: true, immediate: true },
)

/**
 * 组件挂载前的处理
 */
onBeforeMount(() => {
  // 初始化完毕，打开observer触发render的开关
  created.value = true
  const innerValueCorrected = correctValue(props.modelValue)
  updateColumnValue(innerValueCorrected)
})

/**
 * 根据当前picker的选中项计算对应的时间值
 * 将picker的选中索引数组转换为实际的时间戳或时间字符串
 * @returns 计算得到的时间值
 */
const updateInnerValue = () => {
  const { type, useSecond } = props
  let innerValueResult: string | number = ''
  const pickerVal = datePickerview.value?.getValues() || []
  const values = isArray(pickerVal) ? pickerVal : [pickerVal]

  // 时间类型：返回HH:mm:ss格式字符串
  if (type === 'time') {
    const hour = Number(values[0]) || 0
    const minute = Number(values[1]) || 0
    const second = Number(values[2]) || 0

    if (useSecond) {
      innerValueResult = `${padZero(hour)}:${padZero(minute)}:${padZero(second)}`
    } else {
      innerValueResult = `${padZero(hour)}:${padZero(minute)}`
    }
    return innerValueResult
  }

  // 日期类型：构造时间戳
  const year = Number(values[0]) || new Date().getFullYear()
  const month = type === 'year' ? 1 : Number(values[1]) || 1
  const maxDate = getMonthEndDay(year, month)

  // 处理日期，确保不超过当月最大天数
  let date = 1
  if (type !== 'year-month' && type !== 'year') {
    const dateValue = Number(values[2]) || 1
    date = dateValue > maxDate ? maxDate : dateValue
  }

  // 处理时分秒（仅datetime类型）
  let hour = 0
  let minute = 0
  let second = 0
  if (type === 'datetime') {
    hour = Number(values[3]) || 0
    minute = Number(values[4]) || 0
    if (useSecond) {
      second = Number(values[5]) || 0
    }
  }

  // 构造Date对象并转换为时间戳
  const value = new Date(year, month - 1, date, hour, minute, second).getTime()
  innerValueResult = correctValue(value)
  return innerValueResult
}

/**
 * 处理选择器值变化事件
 * 当用户在picker中选择不同的值时触发
 * @param event 选择器返回的事件对象
 */
const onChange = (event: { picker: WdPickerViewExpose; value: PickerViewValue; index: number }) => {
  // 从事件对象中提取 value
  pickerValue.value = event.value

  // 将picker的选中值转换为实际的时间值
  const result = updateInnerValue()
  emit('update:modelValue', result)

  // 这个地方的value返回的是picker数组，实际上在此处我们应该返回 change 的是 value date类型的值
  emit('change', {
    value: result,
    picker: proxy.$.exposed,
  })
}

/**
 * 手动设置列数据
 * @param columnList 要设置的列数据数组
 */
const setColumns = (columnList: DatetimePickerViewOption[][]) => {
  columns.value = columnList
}

/**
 * 处理列间联动变化
 * 当某一列的值发生变化时，可能需要更新其他列的选项范围
 * 例如：年份变化会影响月份选项，月份变化会影响日期选项
 * @param picker picker实例
 */
const columnChange = (picker: PickerViewInstance) => {
  // time、year-month、year 类型无需联动处理
  if (props.type === 'time' || props.type === 'year-month' || props.type === 'year') {
    return
  }

  // 获取当前选中的各列值并重新计算合法的时间
  const values = picker.getValues() as string[]
  const year = Number(values[0])
  const month = Number(values[1])
  const maxDate = getMonthEndDay(year, month)
  let date = Number(values[2])
  // 确保日期不超过当月最大天数
  date = date > maxDate ? maxDate : date

  let hour: number = 0
  let minute: number = 0
  let second: number = 0
  if (props.type === 'datetime') {
    hour = Number(values[3])
    minute = Number(values[4])
    if (props.useSecond) {
      second = Number(values[5])
    }
  }

  // 根据修正后的值重新计算时间戳
  const value = new Date(year, month - 1, date, hour, minute, second).getTime()
  /** 根据计算选中项的时间戳，重新计算所有的选项列表 */
  // 更新选中时间戳
  innerValue.value = correctValue(value)

  // 重新生成列数据以反映新的范围限制
  const newColumns = updateColumns()
  // 深拷贝联动之前的选中项
  const selectedIndex = picker.getSelectedIndex().slice(0)

  // 更新受影响的后续列数据
  newColumns.forEach((_columns, index) => {
    const nextColumnIndex = index + 1
    const nextColumnData = newColumns[nextColumnIndex]
    if (nextColumnIndex > newColumns.length - 1) return
    // 设置新的列数据，保持原选中索引或设为0（如果超出范围）
    picker.setColumnData(
      nextColumnIndex,
      nextColumnData,
      selectedIndex[nextColumnIndex] <= nextColumnData.length - 1
        ? selectedIndex[nextColumnIndex]
        : 0,
    )
  })
}

/**
 * 处理开始选择事件
 */
const onPickStart = () => {
  emit('pickstart')
}

/**
 * 处理结束选择事件
 */
const onPickEnd = () => {
  emit('pickend')
}

/**
 * 获取当前选中的项目数据
 * @returns 选中项的详细信息数组
 */
const getSelects = () => {
  const pickerVal = datePickerview.value?.getSelects()
  if (pickerVal == null) return undefined
  if (isArray(pickerVal)) return pickerVal
  return [pickerVal]
}

// 暴露组件方法
defineExpose<DatetimePickerViewExpose>({
  updateColumns,
  setColumns,
  getSelects,
  correctValue,
  getPickerValue,
  getOriginColumns,
})

/** 日期时间选择器实例类型 */
export type DatetimePickerViewInstance = ComponentPublicInstance<
  WdDatetimePickerViewProps,
  DatetimePickerViewExpose
>
</script>
