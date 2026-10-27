<!-- DatetimePicker 日期时间选择器 为 DatetimePickerView 组件的封装，在其内部构建好日期时间选项。 -->
<template>
  <view
    :class="`wd-picker ${disabled ? 'is-disabled' : ''} ${size ? `is-${size}` : ''} ${cell.border.value ? 'is-border' : ''} ${
      alignRight ? 'is-align-right' : ''
    } ${error ? 'is-error' : ''} ${customClass}`"
    :style="customStyle"
  >
    <!-- 文案 -->
    <view class="wd-picker__field" @click="showPopup">
      <slot v-if="$slots.default" />
      <view v-else class="wd-picker__cell" :class="customCellClass">
        <view
          v-if="label || $slots.label"
          :class="`wd-picker__label ${customLabelClass} ${isRequired ? 'is-required' : ''}`"
          :style="
            labelWidth ? `min-width:${labelWidth};max-width:${labelWidth};` : ''
          "
        >
          <slot v-if="$slots.label" name="label" />
          <block v-else>
            {{ label }}
          </block>
        </view>
        <view class="wd-picker__body">
          <view class="wd-picker__value-wraper">
            <view :class="`wd-picker__value ${customValueClass}`">
              <template v-if="region">
                <view v-if="isArray(showValue)">
                  <text :class="showValue[0] ? '' : 'wd-picker__placeholder'">
                    {{
                      showValue[0] ? showValue[0] : placeholder || translate('placeholder')
                    }}
                  </text>
                  {{ translate('to') }}
                  <text :class="showValue[1] ? '' : 'wd-picker__placeholder'">
                    {{
                      showValue[1] ? showValue[1] : placeholder || translate('placeholder')
                    }}
                  </text>
                </view>
                <view v-else class="wd-picker__placeholder">
                  {{ placeholder || translate('placeholder') }}
                </view>
              </template>
              <view v-else :class="showValue ? '' : 'wd-picker__placeholder'">
                {{ showValue ? showValue : placeholder || translate('placeholder') }}
              </view>
            </view>
            <wd-icon
              v-if="!disabled && !readonly"
              custom-class="wd-picker__arrow"
              name="right"
            />
          </view>
          <view v-if="errorMessage" class="wd-picker__error-message">{{ errorMessage }}</view>
        </view>
      </view>
    </view>
    <!-- 弹出层，picker-view 在隐藏时修改值，会触发多次change事件，从而导致所有列选中第一项，因此picker在关闭时不隐藏 -->
    <wd-popup
      v-model="popupShow"
      custom-class="wd-picker__popup"
      position="bottom"
      :hide-when-close="false"
      :close-on-click-modal="closeOnClickModal"
      :safe-area-inset-bottom="safeAreaInsetBottom"
      :z-index="zIndex"
      @close="onCancel"
    >
      <view class="wd-picker__wraper">
        <!-- toolBar -->
        <view class="wd-picker__toolbar" @touchmove="noop">
          <!-- 取消按钮 -->
          <view class="wd-picker__action wd-picker__action--cancel" @click="onCancel">
            {{ cancelButtonText || translate('cancel') }}
          </view>
          <!-- 标题 -->
          <view v-if="title" class="wd-picker__title">
            {{ title }}
          </view>
          <!-- 确定按钮 -->
          <view
            :class="`wd-picker__action ${loading || isLoading ? 'is-loading' : ''}`"
            @click="onConfirm"
          >
            {{ confirmButtonText || translate('confirm') }}
          </view>
        </view>
        <!-- 区域选择tab展示 -->
        <view v-if="region" class="wd-picker__region-tabs">
          <view :class="`wd-picker__region ${showStart ? 'is-active' : ''} `" @click="tabChange">
            <view>{{ translate('start') }}</view>
            <view class="wd-picker__region-time">{{ showTabLabel[0] }}</view>
          </view>
          <view :class="`wd-picker__region ${showStart ? '' : 'is-active'}`" @click="tabChange">
            <view>{{ translate('end') }}</view>
            <view class="wd-picker__region-time">{{ showTabLabel[1] }}</view>
          </view>
        </view>
        <!-- datetimePickerView -->
        <view :class="showStart ? 'wd-picker__show' : 'wd-picker__hidden'">
          <wd-datetime-picker-view
            ref="datetimePickerView"
            v-model="innerValue"
            :custom-class="customViewClass"
            :type="type"
            :loading="loading || isLoading"
            :loading-color="loadingColor"
            :columns-height="columnsHeight"
            :value-key="valueKey"
            :label-key="labelKey"
            :formatter="formatter"
            :filter="filter"
            :column-formatter="isArray(modelValue) ? customColumnFormatter : undefined"
            :max-hour="maxHour"
            :min-hour="minHour"
            :max-date="maxDate"
            :min-date="minDate"
            :max-minute="maxMinute"
            :min-minute="minMinute"
            :use-second="useSecond"
            :min-second="minSecond"
            :max-second="maxSecond"
            :start-symbol="true"
            :immediate-change="immediateChange"
            @change="onChangeStart"
            @pickstart="onPickStart"
            @pickend="onPickEnd"
          />
        </view>
        <view :class="showStart ? 'wd-picker__hidden' : 'wd-picker__show'">
          <wd-datetime-picker-view
            ref="datetimePickerView1"
            v-model="endInnerValue"
            :custom-class="customViewClass"
            :type="type"
            :loading="loading || isLoading"
            :loading-color="loadingColor"
            :columns-height="columnsHeight"
            :value-key="valueKey"
            :label-key="labelKey"
            :formatter="formatter"
            :filter="filter"
            :column-formatter="isArray(modelValue) ? customColumnFormatter : undefined"
            :max-hour="maxHour"
            :min-hour="minHour"
            :max-date="maxDate"
            :min-date="minDate"
            :max-minute="maxMinute"
            :min-minute="minMinute"
            :use-second="useSecond"
            :min-second="minSecond"
            :max-second="maxSecond"
            :start-symbol="false"
            :immediate-change="immediateChange"
            @change="onChangeEnd"
            @pickstart="onPickStart"
            @pickend="onPickEnd"
          />
        </view>
      </view>
    </wd-popup>
  </view>
</template>

<script lang="ts" setup>
import type { ComponentPublicInstance } from 'vue'
import type {
  DatetimePickerViewColumnFormatter,
  DatetimePickerViewColumnType,
  DatetimePickerViewFilter,
  DatetimePickerViewFormatter,
  DatetimePickerViewInstance,
  DateTimeType,
} from '../wd-datetime-picker-view/wd-datetime-picker-view.vue'
import type { FormItemRule } from '../wd-form/wd-form.vue'
import { computed, getCurrentInstance, nextTick, onBeforeMount, onMounted, ref, watch } from 'vue'
import { dayjs } from '../common/dayjs'
import { deepClone, isArray, isDef, isEqual, isFunction, padZero } from '../common/util'
import { useCell } from '../composables/useCell'
import { useParent } from '../composables/useParent'
import { useTranslate } from '../composables/useTranslate'
import wdDatetimePickerView from '../wd-datetime-picker-view/wd-datetime-picker-view.vue'
import { FORM_KEY } from '../wd-form/wd-form-key'
import wdPopup from '../wd-popup/wd-popup.vue'

defineOptions({
  name: 'WdDatetimePicker',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 日期时间选择器显示格式化函数类型
 */
export type DatetimePickerDisplayFormat = (items: Record<string, any>[]) => string

/**
 * 日期时间选择器确认前回调函数类型
 */
type DatetimePickerBeforeConfirm = (
  value: number | string | (number | string)[],
  resolve: (isPass: boolean) => void,
  picker: DatetimePickerInstance,
) => void

/**
 * 日期时间选择器标签显示格式化函数类型
 */
export type DatetimePickerDisplayFormatTabLabel = (items: Record<string, any>[]) => string

/**
 * 日期时间选择器组件属性接口
 */
interface WdDatetimePickerProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 选择器左侧文案，label可以不传 */
  label?: string
  /** 选择器占位符 */
  placeholder?: string
  /** 禁用 */
  disabled?: boolean
  /** 只读 */
  readonly?: boolean
  /** 加载中 */
  loading?: boolean
  /** 加载的颜色，只能使用十六进制的色值写法，且不能使用缩写 */
  loadingColor?: string
  /** 弹出层标题 */
  title?: string
  /** 取消按钮文案 */
  cancelButtonText?: string
  /** 确认按钮文案 */
  confirmButtonText?: string
  /** 是否必填 */
  required?: boolean
  /** 设置选择器大小，可选值：large */
  size?: string
  /** 设置左侧标题宽度 */
  labelWidth?: string
  /** 是否为错误状态，错误状态时右侧内容为红色 */
  error?: boolean
  /** 选择器的值靠右展示 */
  alignRight?: boolean
  /** 点击遮罩是否关闭 */
  closeOnClickModal?: boolean
  /** 弹出面板是否设置底部安全距离（iphone X 类型的机型） */
  safeAreaInsetBottom?: boolean
  /** 是否超出隐藏 */
  ellipsis?: boolean
  /** picker内部滚筒高 */
  columnsHeight?: number
  /** 选项的key */
  valueKey?: string
  /** 选项的label */
  labelKey?: string
  /** 选中项，当 type 为 time 时，类型为字符串；当 type 为 Array 时，类型为范围选择；否则为时间戳 */
  modelValue: string | number | Array<string | number>
  /** 选择器类型，可选值为：date / year-month / time / datetime / year */
  type?: DateTimeType
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
  /** 是否启用秒选择，仅在 time 和 datetime 类型下生效 */
  useSecond?: boolean
  /** 最小秒数，仅在 time 和 datetime 类型下生效 */
  minSecond?: number
  /** 最大秒数，仅在 time 和 datetime 类型下生效 */
  maxSecond?: number
  /** 自定义过滤选项的函数，返回列的选项数组 */
  filter?: DatetimePickerViewFilter
  /** 自定义弹出层选项文案的格式化函数，返回一个字符串 */
  formatter?: DatetimePickerViewFormatter
  /** 自定义展示文案的格式化函数，返回一个字符串 */
  displayFormat?: DatetimePickerDisplayFormat
  /** 确定前校验函数，接收 (value, resolve, picker) 参数，通过 resolve 继续执行 picker，resolve 接收1个boolean参数 */
  beforeConfirm?: DatetimePickerBeforeConfirm
  /** 在区域选择模式下，自定义展示tab标签文案的格式化函数，返回一个字符串 */
  displayFormatTabLabel?: DatetimePickerDisplayFormatTabLabel
  /** 默认日期，类型保持与 value 一致，打开面板时面板自动选到默认日期 */
  defaultValue?: string | number | Array<string | number>
  /** 弹窗层级 */
  zIndex?: number
  /** 表单域 model 字段名，在使用表单校验功能的情况下，该属性是必填的 */
  prop?: string
  /** 表单验证规则，结合wd-form组件使用 */
  rules?: FormItemRule[]
  /** picker cell 外部自定义样式 */
  customCellClass?: string
  /** pickerView 外部自定义样式 */
  customViewClass?: string
  /** label 外部自定义样式 */
  customLabelClass?: string
  /** value 外部自定义样式 */
  customValueClass?: string
  /** 是否在手指松开时立即触发picker-view的 change 事件 */
  immediateChange?: boolean
}

/**
 * 日期时间选择器组件事件接口
 */
interface WdDatetimePickerEmits {
  /** 值变化时触发 */
  change: [event: { value: string | number | Array<string | number> }]
  /** 打开选择器时触发 */
  open: []
  /** 切换选择器tab时触发 */
  toggle: [value: string | number]
  /** 取消选择时触发 */
  cancel: []
  /** 确认选择时触发 */
  confirm: [event: { value: string | number | Array<string | number> }]
  /** 更新模型值 */
  'update:modelValue': [value: string | number | Array<string | number>]
}

/**
 * 日期时间选择器组件暴露方法接口
 */
interface WdDatetimePickerExpose {
  /** 打开picker弹框 */
  open: () => void
  /** 关闭picker弹框 */
  close: () => void
  /** 设置加载状态 */
  setLoading: (loading: boolean) => void
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdDatetimePickerProps>(), {
  customStyle: '',
  customClass: '',
  disabled: false,
  readonly: false,
  loading: false,
  loadingColor: '#4D80F0',
  required: false,
  labelWidth: '33%',
  error: false,
  alignRight: false,
  closeOnClickModal: true,
  safeAreaInsetBottom: true,
  ellipsis: false,
  // 弹窗高度匹配 wd-picker-view item-height=70rpx,5 行可见,原 217rpx 太挤
  columnsHeight: 400,
  valueKey: 'value',
  labelKey: 'label',
  type: 'datetime',
  minDate: () => new Date(new Date().getFullYear() - 10, 0, 1).getTime(),
  maxDate: () => new Date(new Date().getFullYear() + 10, 11, 31, 23, 59, 59).getTime(),
  minHour: 0,
  maxHour: 23,
  minMinute: 0,
  maxMinute: 59,
  useSecond: false,
  minSecond: 0,
  maxSecond: 59,
  zIndex: 100,
  rules: () => [],
  customCellClass: '',
  customViewClass: '',
  customLabelClass: '',
  customValueClass: '',
  immediateChange: false,
})

// 定义组件事件
const emit = defineEmits<WdDatetimePickerEmits>()

// 响应式数据
const showValue = ref<string | Date | Array<string | Date>>('')
const popupShow = ref<boolean>(false)
const showStart = ref<boolean>(true)
const region = ref<boolean>(false)
const showTabLabel = ref<string[]>([])
const innerValue = ref<string | number>('')
const endInnerValue = ref<string | number>('')
const isPicking = ref<boolean>(false)
const hasConfirmed = ref<boolean>(false)
const isLoading = ref<boolean>(false)

// 组件引用
const datetimePickerView = ref<DatetimePickerViewInstance>()
const datetimePickerView1 = ref<DatetimePickerViewInstance>()

// 获取当前组件实例和相关工具
const { proxy } = getCurrentInstance() as any
const { translate } = useTranslate('datetime-picker')
const cell = useCell()
const { parent: form } = useParent(FORM_KEY)

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
 * 空函数，用于阻止默认行为
 */
const noop = () => {}

/**
 * 获取默认内部值
 * @param isRegion 是否是区域选择模式
 * @param isEnd 是否是结束时间
 * @returns 默认值
 */
const getDefaultInnerValue = (isRegion?: boolean, isEnd?: boolean): string | number => {
  const { modelValue: value, defaultValue, maxDate, minDate, type } = props
  if (isRegion) {
    const index = isEnd ? 1 : 0
    const targetValue = isArray(value) ? (value[index] as string) : ''
    const targetDefault = isArray(defaultValue) ? (defaultValue[index] as string) : ''
    const maxValue = type === 'time' ? dayjs(maxDate).format('HH:mm') : maxDate
    const minValue = type === 'time' ? dayjs(minDate).format('HH:mm') : minDate
    return targetValue || targetDefault || (isEnd ? maxValue : minValue)
  } else {
    return isDef(value || defaultValue) ? (value as string) || (defaultValue as string) : ''
  }
}

/**
 * 根据传入的picker类型获取当前cell展示值
 * @param picker 选择器类型，'before'表示开始时间，'after'表示结束时间
 * @returns 选中项的数组
 */
const getSelects = (picker: 'before' | 'after') => {
  const value = picker === 'before' ? innerValue.value : endInnerValue.value
  let selected: number[] = []
  if (value) {
    selected = getPickerValue(value, props.type)
  }

  return selected.map((value) => {
    return {
      [props.labelKey]: padZero(value),
      [props.valueKey]: value,
    }
  })
}

/**
 * 处理时间边界值判断
 * 用于区域选择时检查选中值是否超出边界
 * @param isStart 是否是开始时间
 * @param columnType 当前列类型
 * @param value 当前值
 * @param currentArray 当前完整选择的数组
 * @param boundary 边界值数组
 * @returns 是否超出边界
 */
const handleBoundaryValue = (
  isStart: boolean,
  columnType: DatetimePickerViewColumnType,
  value: number,
  currentArray: number[],
  boundary: number[],
): boolean => {
  const { type, useSecond } = props

  switch (type) {
    case 'datetime': {
      const [year, month, date, hour, minute, second] = boundary
      if (columnType === 'year') {
        return isStart ? value > year : value < year
      }
      if (columnType === 'month' && currentArray[0] === year) {
        return isStart ? value > month : value < month
      }
      if (columnType === 'date' && currentArray[0] === year && currentArray[1] === month) {
        return isStart ? value > date : value < date
      }
      if (
        columnType === 'hour' &&
        currentArray[0] === year &&
        currentArray[1] === month &&
        currentArray[2] === date
      ) {
        return isStart ? value > hour : value < hour
      }
      if (
        columnType === 'minute' &&
        currentArray[0] === year &&
        currentArray[1] === month &&
        currentArray[2] === date &&
        currentArray[3] === hour
      ) {
        return isStart ? value > minute : value < minute
      }
      if (
        useSecond &&
        columnType === 'second' &&
        currentArray[0] === year &&
        currentArray[1] === month &&
        currentArray[2] === date &&
        currentArray[3] === hour &&
        currentArray[4] === minute
      ) {
        return isStart ? value > second : value < second
      }
      break
    }
    case 'year-month': {
      const [year, month] = boundary
      if (columnType === 'year') {
        return isStart ? value > year : value < year
      }
      if (columnType === 'month' && currentArray[0] === year) {
        return isStart ? value > month : value < month
      }
      break
    }
    case 'year': {
      const [year] = boundary
      if (columnType === 'year') {
        return isStart ? value > year : value < year
      }
      break
    }
    case 'date': {
      const [year, month, date] = boundary
      if (columnType === 'year') {
        return isStart ? value > year : value < year
      }
      if (columnType === 'month' && currentArray[0] === year) {
        return isStart ? value > month : value < month
      }
      if (columnType === 'date' && currentArray[0] === year && currentArray[1] === month) {
        return isStart ? value > date : value < date
      }
      break
    }
    case 'time': {
      const [hour, minute, second] = boundary
      if (columnType === 'hour') {
        return isStart ? value > hour : value < hour
      }
      if (columnType === 'minute' && currentArray[0] === hour) {
        return isStart ? value > minute : value < minute
      }
      if (
        useSecond &&
        columnType === 'second' &&
        currentArray[0] === hour &&
        currentArray[1] === minute
      ) {
        return isStart ? value > second : value < second
      }
      break
    }
  }
  return false
}

/**
 * 自定义列项筛选规则
 * 在区域选择模式下，为每一列的选项添加禁用状态
 */
const customColumnFormatter: DatetimePickerViewColumnFormatter = (picker) => {
  if (!picker) return []

  const { type } = props
  const { startSymbol, formatter } = picker
  const start = picker.correctValue(innerValue.value)
  const end = picker.correctValue(endInnerValue.value)

  const currentValue = startSymbol
    ? picker.getPickerValue(start, type)
    : picker.getPickerValue(end, type)
  const boundary = startSymbol
    ? picker.getPickerValue(end, type)
    : picker.getPickerValue(start, type)
  const columns = picker.getOriginColumns()

  return columns.map((column, _) => {
    return column.values.map((value) => {
      const disabled = handleBoundaryValue(startSymbol, column.type, value, currentValue, boundary)
      return {
        label: formatter ? formatter(column.type, padZero(value)) : padZero(value),
        value,
        disabled,
      }
    })
  })
}

/**
 * 设置默认显示格式
 * @param items 获取到的选中项数组，包含 { value, label }
 * @param tabLabel 当前返回的是否是展示tab上的标签
 * @returns 格式化后的显示字符串
 */
const defaultDisplayFormat = (items: Record<string, any>[], tabLabel: boolean = false) => {
  if (items.length === 0) return ''

  if (tabLabel && props.displayFormatTabLabel) {
    return props.displayFormatTabLabel(items)
  }

  if (props.displayFormat) {
    return props.displayFormat(items)
  }

  // 如果使用了自定义的formatter，defaultDisplayFormat无效
  if (props.formatter) {
    const typeMaps = {
      year: ['year'],
      datetime: props.useSecond
        ? ['year', 'month', 'date', 'hour', 'minute', 'second']
        : ['year', 'month', 'date', 'hour', 'minute'],
      date: ['year', 'month', 'date'],
      time: props.useSecond ? ['hour', 'minute', 'second'] : ['hour', 'minute'],
      'year-month': ['year', 'month'],
    }
    return items
      .map((item, index) => {
        return props.formatter!(typeMaps[props.type][index], item.value)
      })
      .join('')
  }

  switch (props.type) {
    case 'year':
      return items[0].label
    case 'date':
      return `${items[0].label}-${items[1].label}-${items[2].label}`
    case 'year-month':
      return `${items[0].label}-${items[1].label}`
    case 'time':
      return props.useSecond
        ? `${items[0].label}:${items[1].label}:${items[2].label}`
        : `${items[0].label}:${items[1].label}`
    case 'datetime':
      return props.useSecond
        ? `${items[0].label}-${items[1].label}-${items[2].label} ${items[3].label}:${items[4].label}:${items[5].label}`
        : `${items[0].label}-${items[1].label}-${items[2].label} ${items[3].label}:${items[4].label}`
  }
}

/**
 * 设置区域选择tab标签展示值
 * @param index 索引标志位，0表示上方picker，1表示下方picker
 * @returns 格式化的标签文本
 */
const setTabLabel = (index: number = 0) => {
  if (region.value) {
    let items: Record<string, any>[] = []
    if (index === 0) {
      items = ((datetimePickerView.value ? datetimePickerView.value!.getSelects() : undefined) ||
        (innerValue.value && getSelects('before'))) as Record<string, any>[]
    } else {
      items = ((datetimePickerView1.value ? datetimePickerView1.value!.getSelects() : undefined) ||
        (endInnerValue.value && getSelects('after'))) as Record<string, any>[]
    }
    return defaultDisplayFormat(items, true)
  } else {
    return ''
  }
}

/**
 * 设置展示值
 * @param tab 是否修改tab展示值（仅在区域选择情况下生效）
 * @param isConfirm 是否提交当前修改
 * @param beforeMount 是否在组件挂载前调用
 */
const setShowValue = (
  tab: boolean = false,
  isConfirm: boolean = false,
  beforeMount: boolean = false,
) => {
  if (region.value) {
    const items = beforeMount
      ? (innerValue.value && getSelects('before')) || []
      : (datetimePickerView.value &&
          datetimePickerView.value.getSelects &&
          datetimePickerView.value.getSelects()) ||
        []

    const endItems = beforeMount
      ? (endInnerValue.value && getSelects('after')) || []
      : (datetimePickerView1.value &&
          datetimePickerView1.value.getSelects &&
          datetimePickerView1.value.getSelects()) ||
        []

    showValue.value = tab
      ? showValue.value
      : [
          (props.modelValue as (string | number)[])[0] || isConfirm
            ? defaultDisplayFormat(items as Record<string, any>[])
            : '',
          (props.modelValue as (string | number)[])[1] || isConfirm
            ? defaultDisplayFormat(endItems as Record<string, any>[])
            : '',
        ]
    showTabLabel.value = [
      defaultDisplayFormat(items as Record<string, any>[], true),
      defaultDisplayFormat(endItems as Record<string, any>[], true),
    ]
  } else {
    const items = beforeMount
      ? (innerValue.value && getSelects('before')) || []
      : (datetimePickerView.value &&
          datetimePickerView.value.getSelects &&
          datetimePickerView.value.getSelects()) ||
        []

    showValue.value = deepClone(
      props.modelValue || isConfirm ? defaultDisplayFormat(items as Record<string, any>[]) : '',
    )
  }
}

/**
 * 显示弹出框
 */
const showPopup = () => {
  if (props.disabled || props.readonly) return

  emit('open')
  if (region.value) {
    popupShow.value = true
    showStart.value = true
    innerValue.value = deepClone(getDefaultInnerValue(true, false))
    endInnerValue.value = deepClone(getDefaultInnerValue(true, true))
  } else {
    popupShow.value = true
    innerValue.value = deepClone(getDefaultInnerValue())
  }
  setShowValue(true, false, true)
}

/**
 * 区域选择时tab标签切换处理
 */
const tabChange = () => {
  showStart.value = !showStart.value
  // 列项刷新多级联动挂载到datetimepickerView
  const picker = showStart.value ? datetimePickerView.value : datetimePickerView1.value
  picker!.setColumns(picker!.updateColumns())

  emit('toggle', showStart.value ? innerValue.value : endInnerValue.value)
}

/**
 * 开始时间picker的change事件处理
 */
const onChangeStart = ({ value }: { value: number | string }) => {
  if (!datetimePickerView.value) return
  if (region.value && !datetimePickerView1.value) return

  if (region.value) {
    // 区间选择才需要处理边界值
    const currentArray = datetimePickerView.value.getPickerValue(value, props.type)
    const boundaryArray = datetimePickerView.value.getPickerValue(endInnerValue.value, props.type)
    const columns = datetimePickerView.value.getOriginColumns()

    // 检查是否有任何列超出边界
    const needsAdjust = columns.some((column, index) => {
      return handleBoundaryValue(
        true,
        column.type,
        currentArray[index],
        currentArray,
        boundaryArray,
      )
    })

    innerValue.value = deepClone(needsAdjust ? endInnerValue.value : value)

    nextTick(() => {
      showTabLabel.value = [setTabLabel(), deepClone(showTabLabel.value[1])]
      emit('change', {
        value: [innerValue.value, endInnerValue.value],
      })
      // 更新两个picker的列
      datetimePickerView.value &&
        datetimePickerView.value.setColumns(datetimePickerView.value.updateColumns())
      datetimePickerView1.value &&
        datetimePickerView1.value.setColumns(datetimePickerView1.value.updateColumns())
    })
  } else {
    // 非区间选择直接设置值即可
    innerValue.value = deepClone(value)
    emit('change', {
      value: innerValue.value,
    })
  }
}

/**
 * 结束时间picker的change事件处理
 */
const onChangeEnd = ({ value }: { value: number | string }) => {
  if (!datetimePickerView.value || !datetimePickerView1.value) return

  const currentArray = datetimePickerView1.value.getPickerValue(value, props.type)
  const boundaryArray = datetimePickerView1.value.getPickerValue(innerValue.value, props.type)
  const columns = datetimePickerView1.value.getOriginColumns()

  // 检查是否有任何列超出边界
  const needsAdjust = columns.some((column, index) => {
    return handleBoundaryValue(false, column.type, currentArray[index], currentArray, boundaryArray)
  })

  endInnerValue.value = deepClone(needsAdjust ? innerValue.value : value)

  nextTick(() => {
    showTabLabel.value = [deepClone(showTabLabel.value[0]), setTabLabel(1)]
    emit('change', {
      value: [innerValue.value, endInnerValue.value],
    })
    // 更新两个picker的列
    datetimePickerView.value &&
      datetimePickerView.value.setColumns(datetimePickerView.value.updateColumns())
    datetimePickerView1.value &&
      datetimePickerView1.value.setColumns(datetimePickerView1.value.updateColumns())
  })
}

/**
 * 点击取消按钮处理
 */
const onCancel = () => {
  popupShow.value = false
  setTimeout(() => {
    if (region.value) {
      innerValue.value = deepClone(getDefaultInnerValue(true))
      endInnerValue.value = deepClone(getDefaultInnerValue(true, true))
    } else {
      innerValue.value = deepClone(getDefaultInnerValue())
    }
  }, 200)

  emit('cancel')
}

/**
 * 开始选择事件处理
 */
const onPickStart = () => {
  isPicking.value = true
}

/**
 * 处理确认操作
 */
const handleConfirm = () => {
  if (props.loading || isLoading.value || props.disabled) {
    popupShow.value = false
    return
  }
  const value = region.value ? [innerValue.value, endInnerValue.value] : innerValue.value
  popupShow.value = false
  emit('update:modelValue', value)
  emit('confirm', {
    value,
  })
  setShowValue(false, true)
}

/**
 * 点击确认按钮处理
 */
const onConfirm = () => {
  if (props.loading || isLoading.value) return

  // 如果当前还在滑动且未停止下来，则锁住先不确认，等滑完再自动确认，避免pickview值未更新
  if (isPicking.value) {
    hasConfirmed.value = true
    return
  }

  const { beforeConfirm } = props
  if (beforeConfirm) {
    beforeConfirm(
      region.value ? [innerValue.value, endInnerValue.value] : innerValue.value,
      (isPass: boolean) => {
        isPass && handleConfirm()
      },
      proxy.$.exposed,
    )
  } else {
    handleConfirm()
  }
}

/**
 * 结束选择事件处理
 */
const onPickEnd = () => {
  isPicking.value = false

  // 延迟一会，因为组件层级嵌套过多，日期的计算时间也较长
  setTimeout(() => {
    if (hasConfirmed.value) {
      hasConfirmed.value = false
      onConfirm()
    }
  }, 50)
}

/**
 * 设置加载状态
 * @param loading 加载状态
 */
const setLoading = (loading: boolean) => {
  isLoading.value = loading
}

/**
 * 对外暴露接口，打开弹框
 */
const open = () => {
  showPopup()
}

/**
 * 对外暴露接口，关闭弹框
 */
const close = () => {
  onCancel()
}

// 计算属性
const errorMessage = computed(() => {
  if (form && props.prop && form.errorMessages && form.errorMessages[props.prop]) {
    return form.errorMessages[props.prop]
  } else {
    return ''
  }
})

const isRequired = computed(() => {
  let formRequired = false
  if (form && form.props.rules) {
    const rules = form.props.rules
    for (const key in rules) {
      if (
        Object.prototype.hasOwnProperty.call(rules, key) &&
        key === props.prop &&
        Array.isArray(rules[key])
      ) {
        formRequired = rules[key].some((rule: FormItemRule) => rule.required)
      }
    }
  }
  return props.required || props.rules.some((rule) => rule.required) || formRequired
})

// 监听器
watch(
  () => props.modelValue,
  (val, oldVal) => {
    if (isEqual(val, oldVal)) return

    if (isArray(val)) {
      region.value = true
      innerValue.value = deepClone(getDefaultInnerValue(true))
      endInnerValue.value = deepClone(getDefaultInnerValue(true, true))
    } else {
      // 每次value更新时都需要刷新整个列表
      innerValue.value = deepClone(getDefaultInnerValue())
    }
    nextTick(() => {
      setShowValue(false, false, true)
    })
  },
  {
    deep: true,
    immediate: true,
  },
)

// 函数类型验证监听器
watch(
  () => props.displayFormat,
  (fn) => {
    if (fn && !isFunction(fn)) {
      console.error('The type of displayFormat must be Function')
    }
  },
  { deep: true, immediate: true },
)

watch(
  () => props.filter,
  (fn) => {
    if (fn && !isFunction(fn)) {
      console.error('The type of filter must be Function')
    }
  },
  { deep: true, immediate: true },
)

watch(
  () => props.formatter,
  (fn) => {
    if (fn && !isFunction(fn)) {
      console.error('The type of formatter must be Function')
    }
  },
  { deep: true, immediate: true },
)

watch(
  () => props.beforeConfirm,
  (fn) => {
    if (fn && !isFunction(fn)) {
      console.error('The type of beforeConfirm must be Function')
    }
  },
  { deep: true, immediate: true },
)

watch(
  () => props.displayFormatTabLabel,
  (fn) => {
    if (fn && !isFunction(fn)) {
      console.error('The type of displayFormatTabLabel must be Function')
    }
  },
  { deep: true, immediate: true },
)

watch(
  () => props.defaultValue,
  (val) => {
    if (isArray(val) || region.value) {
      innerValue.value = deepClone(getDefaultInnerValue(true))
      endInnerValue.value = deepClone(getDefaultInnerValue(true, true))
    } else {
      innerValue.value = deepClone(getDefaultInnerValue())
    }
  },
  {
    deep: true,
    immediate: true,
  },
)

// 生命周期钩子
onBeforeMount(() => {
  const { modelValue: value } = props
  if (isArray(value)) {
    region.value = true
    innerValue.value = deepClone(getDefaultInnerValue(true))
    endInnerValue.value = deepClone(getDefaultInnerValue(true, true))
  } else {
    innerValue.value = deepClone(getDefaultInnerValue())
  }
})

onMounted(() => {
  setShowValue(false, false, true)
})

// 暴露组件方法
defineExpose<WdDatetimePickerExpose>({
  open,
  close,
  setLoading,
})

/** 日期时间选择器实例类型 */
export type DatetimePickerInstance = ComponentPublicInstance<
  WdDatetimePickerProps,
  WdDatetimePickerExpose
>
</script>

<style lang="scss">
// 引入外部样式文件
@import './../common/abstracts/_mixin.scss';
@import './../common/abstracts/variable.scss';

// 暗色主题样式
.wot-theme-dark {
  @include b(picker) {
    @include e(cell) {
      background-color: $-dark-background2;
      color: $-dark-color;
    }

    @include e(title) {
      color: $-dark-color;
    }

    @include e(label) {
      color: $-dark-color;
    }
    @include e(value) {
      color: $-dark-color;
    }

    @include e(placeholder) {
      color: $-dark-color-gray;
    }

    @include when(border) {
      .wd-picker__cell {
        @include halfPixelBorder('top', $-cell-padding, $-dark-border-color);
      }
    }

    :deep(.wd-picker__arrow) {
      color: $-dark-color;
    }

    @include e(action) {
      @include m(cancel) {
        color: $-dark-color;
      }
    }

    @include e(region) {
      color: $-dark-color;

      @include when(active) {
        background: $-picker-region-bg-active-color;
        color: $-dark-color;
      }
    }
  }
}

// picker 主体样式
@include b(picker) {
  @include edeep(popup) {
    border-radius: 16px 16px 0px 0px;
  }

  @include e(wraper) {
    padding-bottom: var(--window-bottom);
  }

  @include when(border) {
    .wd-picker__cell {
      @include halfPixelBorder('top', $-cell-padding);
    }
  }
  @include when(large) {
    .wd-picker__cell {
      font-size: $-cell-title-fs-large;
    }
    :deep(.wd-picker__arrow) {
      font-size: $-cell-icon-size-large;
    }
  }
  @include when(error) {
    .wd-picker__value,
    .wd-picker__placeholder {
      color: $-input-error-color;
    }

    :deep(.wd-picker__arrow) {
      color: $-input-error-color;
    }
  }
  @include when(align-right) {
    .wd-picker__value {
      text-align: right;
    }
  }
  @include e(cell) {
    position: relative;
    display: flex;
    padding: $-cell-wrapper-padding $-cell-padding;
    align-items: flex-start;
    background-color: $-color-white;
    text-decoration: none;
    color: $-cell-title-color;
    font-size: $-cell-title-fs;
    overflow: hidden;
    line-height: $-cell-line-height;

    @include when(disabled) {
      .wd-picker__value {
        color: $-input-disabled-color;
      }
    }
  }

  @include when(disabled) {
    .wd-picker__value {
      color: $-picker-column-disabled-color;
    }
  }

  @include e(error-message) {
    color: $-form-item-error-message-color;
    font-size: $-form-item-error-message-font-size;
    line-height: $-form-item-error-message-line-height;
    text-align: left;
    vertical-align: middle;
  }

  @include e(label) {
    position: relative;
    width: $-input-cell-label-width;
    margin-right: $-cell-padding;
    color: $-cell-title-color;
    box-sizing: border-box;

    @include when(required) {
      padding-left: 12px;

      &::after {
        position: absolute;
        left: 0;
        top: 2px;
        content: '*';
        font-size: $-cell-required-size;
        line-height: 1.1;
        color: $-cell-required-color;
      }
    }
  }

  @include e(value-wraper) {
    display: flex;
  }

  @include e(value) {
    flex: 1;
    margin-right: 10px;
    color: $-cell-value-color;

    @include when(ellipsis) {
      @include lineEllipsis;
    }
  }

  @include e(body) {
    flex: 1;
  }

  @include e(placeholder) {
    color: $-input-placeholder-color;
  }

  @include edeep(arrow) {
    display: block;
    font-size: $-cell-icon-size;
    color: $-cell-arrow-color;
    line-height: $-cell-line-height;
  }

  @include e(toolbar) {
    position: relative;
    display: flex;
    font-size: $-picker-toolbar-fs;
    height: $-picker-toolbar-height;
    line-height: $-picker-action-height;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
  }

  @include e(action) {
    display: block;
    border: none;
    outline: none;
    font-size: $-picker-toolbar-fs;
    color: $-picker-toolbar-finish-color;
    background: transparent;
    padding: 24px 15px 14px 15px;

    @include m(cancel) {
      color: $-picker-toolbar-cancel-color;
    }

    @include when(loading) {
      color: $-picker-loading-button-color;
    }
  }
  @include e(title) {
    display: block;
    color: $-picker-toolbar-title-color;
  }

  @include e(region-tabs) {
    display: flex;
  }

  @include e(region) {
    width: 50%;
    display: inline-block;
    color: $-picker-region-color;
    text-align: center;
    padding: 14px 0;
    font-size: $-picker-region-fs;
    line-height: 16px;
    transition: all 0.15s ease-out;

    @include when(active) {
      background: $-picker-region-bg-active-color;
      color: $-color-white;
    }
  }

  @include e(region-time) {
    font-size: 16px;
    margin-top: 2px;
  }

  @include e(hidden) {
    visibility: hidden;
    overflow: hidden;
    height: 0;
  }

  @include e(show) {
    visibility: visible;
    height: auto;
  }
}
</style>
