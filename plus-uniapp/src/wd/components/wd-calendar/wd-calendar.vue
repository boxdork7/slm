<!-- Calendar 日历选择器 提供日历单选、多选、范围选择、周维度、月维度等功能。 -->
<template>
  <view :class="`wd-calendar ${cell.border.value ? 'is-border' : ''} ${customClass}`">
    <view v-if="withCell" class="wd-calendar__field" @click="open">
      <slot v-if="$slots.default" />
      <view
        v-else
        :class="`wd-calendar__cell ${disabled ? 'is-disabled' : ''} ${readonly ? 'is-readonly' : ''} ${alignRight ? 'is-align-right' : ''} ${
          error ? 'is-error' : ''
        } ${size ? `is-${size}` : ''} ${center ? 'is-center' : ''}`"
      >
        <view
          v-if="label || $slots.label"
          :class="`wd-calendar__label ${isRequired ? 'is-required' : ''} ${customLabelClass}`"
          :style="
            computedLabelWidth ? `min-width:${computedLabelWidth};max-width:${computedLabelWidth};` : ''
          "
        >
          <slot name="label">{{ label }}</slot>
        </view>
        <view class="wd-calendar__body">
          <view class="wd-calendar__value-wraper">
            <view
              :class="`wd-calendar__value ${ellipsis ? 'is-ellipsis' : ''} ${customValueClass} ${showValue ? '' : 'wd-calendar__value--placeholder'}`"
            >
              {{ showValue || placeholder || translate('placeholder') }}
            </view>
            <wd-icon
              v-if="!disabled && !readonly"
              custom-class="wd-calendar__arrow"
              name="right"
            />
          </view>
          <view v-if="errorMessage" class="wd-calendar__error-message">{{ errorMessage }}</view>
        </view>
      </view>
    </view>
    <wd-action-sheet
      v-model="pickerShow"
      :duration="250"
      :close-on-click-modal="closeOnClickModal"
      :safe-area-inset-bottom="safeAreaInsetBottom"
      :z-index="zIndex"
      @close="close"
    >
      <view class="wd-calendar__header">
        <view
          v-if="!showTypeSwitch && shortcuts.length === 0"
          class="wd-calendar__title"
        >
          {{ title || translate('title') }}
        </view>
        <view v-if="showTypeSwitch" class="wd-calendar__tabs">
          <wd-tabs ref="calendarTabs" v-model="currentTab" @change="handleTypeChange">
            <wd-tab :title="translate('day')" :name="translate('day')" />
            <wd-tab :title="translate('week')" :name="translate('week')" />
            <wd-tab :title="translate('month')" :name="translate('month')" />
          </wd-tabs>
        </view>
        <view v-if="shortcuts.length > 0" class="wd-calendar__shortcuts">
          <wd-tag
            v-for="(item, index) in shortcuts"
            :key="index"
            custom-class="wd-calendar__tag"
            type="primary"
            round
            plain
            @click="handleShortcutClick(index)"
          >
            {{ item.text }}
          </wd-tag>
        </view>
        <wd-icon custom-class="wd-calendar__close" name="close" @click="close" />
      </view>
      <view
        v-if="inited"
        :class="`wd-calendar__view  ${currentType.includes('range') ? 'is-range' : ''} ${showConfirm ? 'is-show-confirm' : ''}`"
      >
        <view
          v-if="range(currentType)"
          :class="`wd-calendar__range-label ${currentType === 'monthrange' ? 'is-monthrange' : ''}`"
        >
          <view
            :class="`wd-calendar__range-label-item ${!calendarValue || !isArray(calendarValue) || !calendarValue[0] ? 'is-placeholder' : ''}`"
            style="text-align: right"
          >
            {{ rangeLabel[0] }}
          </view>
          <view class="wd-calendar__range-sperator">/</view>
          <view
            :class="`wd-calendar__range-label-item ${!calendarValue || !isArray(calendarValue) || !calendarValue[1] ? 'is-placeholder' : ''}`"
          >
            {{ rangeLabel[1] }}
          </view>
        </view>
        <wd-calendar-view
          ref="calendarView"
          v-model="calendarValue"
          :type="currentType"
          :min-date="minDate"
          :max-date="maxDate"
          :first-day-of-week="firstDayOfWeek"
          :formatter="formatter"
          :panel-height="panelHeight"
          :max-range="maxRange"
          :range-prompt="rangePrompt"
          :allow-same-day="allowSameDay"
          :default-time="defaultTime"
          :time-filter="timeFilter"
          :hide-second="hideSecond"
          :show-panel-title="!range(currentType)"
          :immediate-change="immediateChange"
          @change="handleChange"
        />
      </view>
      <view v-if="showConfirm" class="wd-calendar__confirm">
        <slot name="confirm-left" />
        <wd-button block :disabled="confirmBtnDisabled" @click="handleConfirm">
          {{ confirmText || translate('confirm') }}
        </wd-button>
        <slot name="confirm-right" />
      </view>
    </wd-action-sheet>
  </view>
</template>

<script lang="ts" setup>
import type { ComponentPublicInstance } from 'vue'
import type {
  CalendarFormatter,
  CalendarTimeFilter,
  CalendarType,
} from '../wd-calendar-view/wd-calendar-view.vue'
import type { FormItemRule } from '../wd-form/wd-form.vue'
import { computed, ref, watch } from 'vue'
import { dayjs } from '../common/dayjs'
import { deepClone, isArray, isEqual, padZero, pause } from '../common/util'
import { useCell } from '../composables/useCell'
import { useParent } from '../composables/useParent'
import { useTranslate } from '../composables/useTranslate'
import wdActionSheet from '../wd-action-sheet/wd-action-sheet.vue'
import wdButton from '../wd-button/wd-button.vue'
import { getWeekNumber, isRange } from '../wd-calendar-view/wd-calendar-utils'
import wdCalendarView from '../wd-calendar-view/wd-calendar-view.vue'
import { FORM_KEY } from '../wd-form/wd-form-key'
import wdIcon from '../wd-icon/wd-icon.vue'

defineOptions({
  name: 'WdCalendar',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 日历显示格式化函数类型
 */
type CalendarDisplayFormat = (value: number | number[], type: CalendarType) => string

/**
 * 日历范围选择内部显示格式化函数类型
 */
type CalendarInnerDisplayFormat = (
  value: number,
  rangeType: 'start' | 'end',
  type: CalendarType,
) => string

/**
 * 确认前校验函数选项接口
 */
interface CalendarBeforeConfirmOption {
  value: number | number[] | null
  resolve: (isPass: boolean) => void
}

/**
 * 确认前校验函数类型
 */
type CalendarBeforeConfirm = (option: CalendarBeforeConfirmOption) => void

/**
 * 快捷操作点击函数选项接口
 */
export interface CalendarOnShortcutsClickOption {
  item: Record<string, any>
  index: number
}

/**
 * 快捷操作点击函数类型
 */
type CalendarOnShortcutsClick = (option: CalendarOnShortcutsClickOption) => number | number[]

/**
 * 日历组件属性接口
 */
interface WdCalendarProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 选中值，为 13 位时间戳或时间戳数组 */
  modelValue: number | number[] | null
  /** 日期类型，可选值：date / dates / datetime / week / month / daterange / datetimerange / weekrange / monthrange */
  type?: CalendarType
  /** 最小日期，为 13 位时间戳 */
  minDate?: number
  /** 最大日期，为 13 位时间戳 */
  maxDate?: number
  /** 周起始天 */
  firstDayOfWeek?: number
  /** 日期格式化函数 */
  formatter?: CalendarFormatter
  /** type 为范围选择时有效，最大日期范围 */
  maxRange?: number
  /** type 为范围选择时有效，选择超出最大日期范围时的错误提示文案 */
  rangePrompt?: string
  /** type 为范围选择时有效，是否允许选择同一天 */
  allowSameDay?: boolean
  /** 选中日期所使用的当日内具体时刻 */
  defaultTime?: string | string[]
  /** type 为 'datetime' 或 'datetimerange' 时有效，用于过滤时间选择器的数据 */
  timeFilter?: CalendarTimeFilter
  /** type 为 'datetime' 或 'datetimerange' 时有效，是否不展示秒修改 */
  hideSecond?: boolean

  /** 选择器左侧文案 */
  label?: string
  /** 设置左侧标题宽度 */
  labelWidth?: string
  /** 禁用 */
  disabled?: boolean
  /** 只读 */
  readonly?: boolean
  /** 选择器占位符 */
  placeholder?: string
  /** 弹出层标题 */
  title?: string
  /** 选择器的值靠右展示 */
  alignRight?: boolean
  /** 是否为错误状态，错误状态时右侧内容为红色 */
  error?: boolean
  /** 是否必填 */
  required?: boolean
  /** 设置选择器大小，可选值：large */
  size?: string
  /** 是否垂直居中 */
  center?: boolean

  /** 点击遮罩是否关闭 */
  closeOnClickModal?: boolean
  /** 弹框层级 */
  zIndex?: number
  /** 是否显示确定按钮 */
  showConfirm?: boolean
  /** 确定按钮文字 */
  confirmText?: string
  /** 自定义展示文案的格式化函数，返回一个字符串 */
  displayFormat?: CalendarDisplayFormat
  /** 自定义范围选择类型的面板内部回显，返回一个字符串 */
  innerDisplayFormat?: CalendarInnerDisplayFormat
  /** 是否超出隐藏 */
  ellipsis?: boolean
  /** 是否显示类型切换功能 */
  showTypeSwitch?: boolean
  /** 快捷选项，为对象数组，其中对象的 text 必传 */
  shortcuts?: Record<string, any>[]
  /** 快捷操作点击回调 */
  onShortcutsClick?: CalendarOnShortcutsClick
  /** 弹出面板是否设置底部安全距离（iphone X 类型的机型） */
  safeAreaInsetBottom?: boolean
  /** 确定前校验函数，接收 { value, resolve } 参数，通过 resolve 继续执行，resolve 接收 1 个 boolean 参数 */
  beforeConfirm?: CalendarBeforeConfirm

  /** 表单域 model 字段名，在使用表单校验功能的情况下，该属性是必填的 */
  prop?: string
  /** 表单验证规则，结合wd-form组件使用 */
  rules?: FormItemRule[]
  /** 日历视图自定义样式类 */
  customViewClass?: string
  /** label 外部自定义样式 */
  customLabelClass?: string
  /** value 外部自定义样式 */
  customValueClass?: string
  /** 是否在手指松开时立即触发picker-view的 change 事件。若不开启则会在滚动动画结束后触发 change 事件 */
  immediateChange?: boolean
  /** 是否使用内置单元格，默认为 true */
  withCell?: boolean
}

/**
 * 日历组件事件接口
 */
interface WdCalendarEmits {
  /** 取消选择时触发 */
  cancel: []
  /** 值改变时触发 */
  change: [{ value: number | number[] | null }]
  /** 更新modelValue */
  'update:modelValue': [value: number | number[] | null]
  /** 确认选择时触发 */
  // prettier-ignore
  confirm: [{ value: number | number[] | null, type: CalendarType }]
  /** 打开选择器时触发 */
  open: []
}

/**
 * 日历组件暴露的方法接口
 */
interface WdCalendarExpose {
  /** 关闭时间选择器弹窗 */
  close: () => void
  /** 打开时间选择器弹窗 */
  open: () => void
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdCalendarProps>(), {
  customStyle: '',
  customClass: '',
  type: 'date',
  minDate: () =>
    new Date(new Date().getFullYear(), new Date().getMonth() - 6, new Date().getDate()).getTime(),
  maxDate: () =>
    new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 6,
      new Date().getDate(),
      23,
      59,
      59,
    ).getTime(),
  firstDayOfWeek: 0,
  allowSameDay: false,
  hideSecond: false,
  disabled: false,
  readonly: false,
  alignRight: false,
  error: false,
  required: false,
  center: false,
  closeOnClickModal: true,
  zIndex: 100,
  showConfirm: true,
  ellipsis: false,
  showTypeSwitch: false,
  shortcuts: () => [],
  safeAreaInsetBottom: true,
  rules: () => [],
  customViewClass: '',
  customLabelClass: '',
  customValueClass: '',
  immediateChange: false,
  withCell: true,
  labelWidth: undefined,
})

// 定义组件事件
const emit = defineEmits<WdCalendarEmits>()

// 响应式数据
const pickerShow = ref<boolean>(false)
const calendarValue = ref<null | number | number[]>(null)
const lastCalendarValue = ref<null | number | number[]>(null)
const panelHeight = ref<number>(676)
const confirmBtnDisabled = ref<boolean>(true)
const currentTab = ref<number>(0)
const lastTab = ref<number>(0)
const currentType = ref<CalendarType>('date')
const lastCurrentType = ref<CalendarType>()
const inited = ref<boolean>(false)

// 组合式API和工具函数
const cell = useCell()
const { translate } = useTranslate('calendar')
const { parent: form } = useParent(FORM_KEY)

/**
 * 计算最终的标签宽度
 * 优先级：组件自身 labelWidth > form labelWidth > 默认值 undefined
 */
const computedLabelWidth = computed(() => {
  // 1. 组件自身明确指定
  if (props.labelWidth !== undefined && props.labelWidth !== '') {
    return props.labelWidth
  }

  // 2. 继承 form 配置
  if (form && form.props.labelWidth !== undefined && form.props.labelWidth !== '') {
    return form.props.labelWidth
  }

  // 3. 默认值 undefined
  return undefined
})

// 模板引用
const calendarView = ref()
const calendarTabs = ref()

/**
 * 默认显示格式化函数
 * 根据不同的日历类型格式化显示内容
 */
const defaultDisplayFormat = (value: number | number[], type: CalendarType): string => {
  switch (type) {
    case 'date':
      return dayjs(value as number).format('YYYY-MM-DD')
    case 'dates':
      return (value as number[])
        .map((item) => {
          return dayjs(item).format('YYYY-MM-DD')
        })
        .join(', ')
    case 'daterange':
      return `${(value as number[])[0] ? dayjs((value as number[])[0]).format('YYYY-MM-DD') : translate('startTime')} ${translate('to')} ${
        (value as number[])[1]
          ? dayjs((value as number[])[1]).format('YYYY-MM-DD')
          : translate('endTime')
      }`
    case 'datetime':
      return dayjs(value as number).format('YYYY-MM-DD HH:mm:ss')
    case 'datetimerange':
      return `${(value as number[])[0] ? dayjs((value as number[])[0]).format(translate('timeFormat')) : translate('startTime')} ${translate(
        'to',
      )}\n${(value as number[])[1] ? dayjs((value as number[])[1]).format(translate('timeFormat')) : translate('endTime')}`
    case 'week': {
      const date = new Date(value as number)
      const year = date.getFullYear()
      const week = getWeekNumber(value as number)
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay() + 1)
      const weekEnd = new Date(date)
      weekEnd.setDate(date.getDate() + (7 - date.getDay()))
      const adjustedYear = weekEnd.getFullYear() > year ? weekEnd.getFullYear() : year
      return translate('weekFormat', adjustedYear, padZero(week))
    }
    case 'weekrange': {
      const date1 = new Date((value as number[])[0])
      const date2 = new Date((value as number[])[1])
      const year1 = date1.getFullYear()
      const year2 = date2.getFullYear()
      const week1 = getWeekNumber((value as number[])[0])
      const week2 = getWeekNumber((value as number[])[1])
      const weekStart1 = new Date(date1)
      weekStart1.setDate(date1.getDate() - date1.getDay() + 1)
      const weekEnd1 = new Date(date1)
      weekEnd1.setDate(date1.getDate() + (7 - date1.getDay()))
      const weekStart2 = new Date(date2)
      weekStart2.setDate(date2.getDate() - date2.getDay() + 1)
      const weekEnd2 = new Date(date2)
      weekEnd2.setDate(date2.getDate() + (7 - date2.getDay()))
      const adjustedYear1 = weekEnd1.getFullYear() > year1 ? weekEnd1.getFullYear() : year1
      const adjustedYear2 = weekEnd2.getFullYear() > year2 ? weekEnd2.getFullYear() : year2
      return `${(value as number[])[0] ? translate('weekFormat', adjustedYear1, padZero(week1)) : translate('startWeek')} - ${
        (value as number[])[1]
          ? translate('weekFormat', adjustedYear2, padZero(week2))
          : translate('endWeek')
      }`
    }
    case 'month':
      return dayjs(value as number).format('YYYY / MM')
    case 'monthrange':
      return `${(value as number[])[0] ? dayjs((value as number[])[0]).format('YYYY / MM') : translate('startMonth')} ${translate('to')} ${
        (value as number[])[1]
          ? dayjs((value as number[])[1]).format('YYYY / MM')
          : translate('endMonth')
      }`
  }
}

/**
 * 格式化范围选择显示
 * 根据范围类型和选择类型格式化单个日期的显示
 */
const formatRange = (value: number, rangeType: 'start' | 'end', type: CalendarType) => {
  switch (type) {
    case 'daterange':
      if (!value) {
        return rangeType === 'end' ? translate('endTime') : translate('startTime')
      }
      return dayjs(value).format(translate('dateFormat'))
    case 'datetimerange':
      if (!value) {
        return rangeType === 'end' ? translate('endTime') : translate('startTime')
      }
      return dayjs(value).format(translate('timeFormat'))
    case 'weekrange': {
      if (!value) {
        return rangeType === 'end' ? translate('endWeek') : translate('startWeek')
      }
      const date = new Date(value)
      const year = date.getFullYear()
      const week = getWeekNumber(value)
      return translate('weekFormat', year, padZero(week))
    }
    case 'monthrange':
      if (!value) {
        return rangeType === 'end' ? translate('endMonth') : translate('startMonth')
      }
      return dayjs(value).format(translate('monthFormat'))
  }
}

/**
 * 计算范围选择标签显示
 * 格式化范围选择模式下的开始和结束时间显示
 */
const rangeLabel = computed(() => {
  const [start, end] = deepClone(isArray(calendarValue.value) ? calendarValue.value : [])
  return [start, end].map((item, index) => {
    return (props.innerDisplayFormat || formatRange)(
      item,
      index === 0 ? 'start' : 'end',
      currentType.value,
    )
  })
})

/**
 * 计算显示值
 * 根据当前选中值和显示格式化函数计算最终显示的文本
 */
const showValue = computed(() => {
  if (
    (!isArray(props.modelValue) && props.modelValue) ||
    (isArray(props.modelValue) && props.modelValue.length)
  ) {
    return (props.displayFormat || defaultDisplayFormat)(
      props.modelValue,
      lastCurrentType.value || currentType.value,
    )
  } else {
    return ''
  }
})

/**
 * 计算表单校验错误信息
 * 从表单组件中获取当前字段的错误信息
 */
const errorMessage = computed(() => {
  if (form && props.prop && form.errorMessages && form.errorMessages[props.prop]) {
    return form.errorMessages[props.prop]
  } else {
    return ''
  }
})

/**
 * 计算是否显示必填标识
 * 综合考虑组件自身的required属性、rules规则和表单规则
 */
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

/**
 * 计算是否为范围选择类型
 * 提供一个计算函数来判断给定类型是否为范围选择
 */
const range = computed(() => {
  return (type: CalendarType) => {
    return isRange(type)
  }
})

/**
 * 获取确认按钮状态
 * 根据当前选中值和日历类型判断确认按钮是否应该禁用
 */
const getConfirmBtnStatus = (value: number | number[] | null) => {
  let confirmBtnDisabled = false
  // 范围选择未选择满，或者多日期选择未选择日期，按钮置灰不可点击
  if (
    (props.type.includes('range') && (!isArray(value) || !value[0] || !value[1] || !value)) ||
    (props.type === 'dates' && (!isArray(value) || value.length === 0 || !value)) ||
    !value
  ) {
    confirmBtnDisabled = true
  }

  return confirmBtnDisabled
}

/**
 * 监听modelValue变化
 * 当外部传入的值发生变化时，同步更新内部状态
 */
watch(
  () => props.modelValue,
  (val, oldVal) => {
    if (isEqual(val, oldVal)) return
    calendarValue.value = deepClone(val)
    confirmBtnDisabled.value = getConfirmBtnStatus(val)
  },
  { immediate: true },
)

/**
 * 监听type属性变化
 * 当日历类型发生变化时，更新相关状态和面板高度
 */
watch(
  () => props.type,
  (newValue, oldValue) => {
    if (props.showTypeSwitch) {
      const tabs = ['date', 'week', 'month']
      const rangeTabs = ['daterange', 'weekrange', 'monthrange']

      currentTab.value = newValue.includes('range')
        ? rangeTabs.indexOf(newValue) || 0
        : tabs.indexOf(newValue)
    }
    // 面板高度 = scroll-view + time(250rpx) 之和;view 容器再额外加 title(90rpx)+weeks(50rpx) 余量,
    // 避免 datetime 模式下时间滚轮顶部被裁切(原 676/800 + view 792rpx 留白不足)
    panelHeight.value = props.showConfirm ? 950 : 1090
    currentType.value = deepClone(newValue)
  },
  { deep: true, immediate: true },
)

/**
 * 监听showConfirm属性变化
 * 根据是否显示确认按钮调整面板高度
 */
watch(
  () => props.showConfirm,
  (val) => {
    panelHeight.value = val ? 950 : 1090
  },
  { deep: true, immediate: true },
)

/**
 * 滚动到当前视图
 * 调用日历视图组件的滚动方法
 */
const scrollIntoView = () => {
  calendarView.value && calendarView.value && calendarView.value.$.exposed.scrollIntoView()
}

/**
 * 打开日历选择器
 * 显示日历弹窗并初始化相关状态
 */
const open = async () => {
  const { disabled, readonly } = props

  if (disabled || readonly) return

  inited.value = true
  pickerShow.value = true
  lastCalendarValue.value = deepClone(calendarValue.value)
  lastTab.value = currentTab.value
  lastCurrentType.value = currentType.value
  // 等待渲染完毕
  await pause()
  scrollIntoView()
  setTimeout(() => {
    if (props.showTypeSwitch) {
      calendarTabs.value.scrollIntoView()
      calendarTabs.value.updateLineStyle(false)
    }
  }, 250)
  emit('open')
}

/**
 * 关闭日历选择器
 * 隐藏日历弹窗并恢复之前的状态
 */
const close = () => {
  pickerShow.value = false
  setTimeout(() => {
    calendarValue.value = deepClone(lastCalendarValue.value)
    currentTab.value = lastTab.value
    currentType.value = lastCurrentType.value || 'date'
    confirmBtnDisabled.value = getConfirmBtnStatus(lastCalendarValue.value)
  }, 250)
  emit('cancel')
}

/**
 * 处理类型切换
 * 当用户在类型切换标签页中选择不同类型时的处理
 */
const handleTypeChange = ({ index }: { index: number }) => {
  const tabs = ['date', 'week', 'month']
  const rangeTabs = ['daterange', 'weekrange', 'monthrange']
  const type = props.type.includes('range') ? rangeTabs[index] : tabs[index]
  currentTab.value = index
  currentType.value = type as CalendarType
}

/**
 * 执行确认操作
 * 关闭弹窗并触发相关事件
 */
const onConfirm = () => {
  pickerShow.value = false
  lastCurrentType.value = currentType.value
  emit('update:modelValue', calendarValue.value)
  emit('confirm', {
    value: calendarValue.value,
    type: currentType.value,
  })
}

/**
 * 处理确认操作
 * 根据是否设置了beforeConfirm函数决定确认流程
 */
const handleConfirm = () => {
  if (props.beforeConfirm) {
    props.beforeConfirm({
      value: calendarValue.value,
      resolve: (isPass: boolean) => {
        isPass && onConfirm()
      },
    })
  } else {
    onConfirm()
  }
}
/**
 * 处理日历值变化
 * 当日历视图组件的值发生变化时的处理
 */
const handleChange = ({ value }: { value: number | number[] | null }) => {
  calendarValue.value = deepClone(value)
  confirmBtnDisabled.value = getConfirmBtnStatus(value)

  emit('change', { value })

  if (!props.showConfirm && !confirmBtnDisabled.value) {
    handleConfirm()
  }
}

/**
 * 处理快捷选项点击
 * 当用户点击快捷选项时的处理
 */
const handleShortcutClick = (index: number) => {
  if (props.onShortcutsClick && typeof props.onShortcutsClick === 'function') {
    calendarValue.value = deepClone(
      props.onShortcutsClick({
        item: props.shortcuts[index],
        index,
      }),
    )
    confirmBtnDisabled.value = getConfirmBtnStatus(calendarValue.value)
  }

  if (!props.showConfirm) {
    handleConfirm()
  }
}

// 暴露组件方法
defineExpose<WdCalendarExpose>({
  close,
  open,
})

/** 日历组件实例类型 */
export type CalendarInstance = ComponentPublicInstance<WdCalendarProps, WdCalendarExpose>
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 暗色主题样式
.wot-theme-dark {
  @include b(calendar) {
    @include e(cell) {
      background-color: $-dark-background2;
      color: $-dark-color;
    }

    @include e(label) {
      color: $-dark-color;
    }

    @include e(value) {
      color: $-dark-color;
    }

    @include e(title) {
      color: $-dark-color;
    }

    :deep(.wd-calendar__arrow),
    :deep(.wd-calendar__close) {
      color: $-dark-color;
    }

    @include when(border) {
      .wd-calendar__cell {
        @include halfPixelBorder('top', $-cell-padding, $-dark-border-color);
      }
    }

    @include e(range-label-item) {
      color: $-dark-color;

      @include when(placeholder) {
        color: $-dark-color-gray;
      }
    }

    @include e(range-sperator) {
      color: $-dark-color-gray;
    }
  }
}

// 日历组件样式
@include b(calendar) {
  @include when(border) {
    .wd-calendar__cell {
      @include halfPixelBorder('top', $-cell-padding);
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
      .wd-calendar__value {
        color: $-input-disabled-color;
      }
    }

    @include when(align-right) {
      .wd-calendar__value {
        text-align: right;
      }
    }

    @include when(error) {
      .wd-calendar__value {
        color: $-input-error-color;
      }

      :deep(.wd-calendar__arrow) {
        color: $-input-error-color;
      }
    }

    @include when(large) {
      font-size: $-cell-title-fs-large;

      :deep(.wd-calendar__arrow) {
        font-size: $-cell-icon-size-large;
      }
    }

    @include when(center) {
      align-items: center;

      :deep(.wd-calendar__arrow) {
        margin-top: 0;
      }
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
      padding-left: 24rpx;

      &::after {
        position: absolute;
        left: 0;
        top: 4rpx;
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
    margin-right: 20rpx;
    color: $-cell-value-color;

    @include when(ellipsis) {
      @include lineEllipsis;
    }

    @include m(placeholder) {
      color: $-input-placeholder-color;
    }
  }

  @include e(body) {
    flex: 1;
  }

  @include edeep(arrow) {
    display: block;
    font-size: $-cell-icon-size;
    color: $-cell-arrow-color;
    line-height: $-cell-line-height;
  }

  @include e(header) {
    position: relative;
    overflow: hidden;
  }

  @include e(title) {
    color: $-action-sheet-color;
    height: $-action-sheet-title-height;
    line-height: $-action-sheet-title-height;
    text-align: center;
    font-size: $-action-sheet-title-fs;
    font-weight: $-action-sheet-weight;
  }

  @include edeep(close) {
    position: absolute;
    top: $-action-sheet-close-top;
    right: $-action-sheet-close-right;
    color: $-action-sheet-close-color;
    font-size: $-action-sheet-close-fs;
    line-height: 1.1;
  }

  @include e(tabs) {
    width: 444rpx;
    margin: 20rpx auto 24rpx;
  }

  @include e(shortcuts) {
    padding: 40rpx 0;
    text-align: center;
  }

  @include edeep(tag) {
    margin-right: 16rpx;
  }

  @include e(view) {
    @include when(show-confirm) {
      // view 容器 = panelHeight(950rpx) + title(90rpx) + weeks(50rpx) 余量
      height: 1090rpx;

      @include when(range) {
        // range 模式无 panel title,但多了 range-label,余量略减
        height: 1066rpx;
      }
    }
  }

  @include e(range-label) {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 28rpx;

    @include when(monthrange) {
      padding-bottom: 20rpx;
      box-shadow: 0 8rpx 16rpx 0 rgba(0, 0, 0, 0.02);
    }
  }

  @include e(range-label-item) {
    flex: 1;
    color: rgba(0, 0, 0, 0.85);

    @include when(placeholder) {
      color: rgba(0, 0, 0, 0.25);
    }
  }

  @include e(range-sperator) {
    margin: 0 48rpx;
    color: rgba(0, 0, 0, 0.25);
  }

  @include e(confirm) {
    display: flex;
    align-items: center;
    padding: 24rpx 50rpx 28rpx;

    // wd-button block 模式在 flex 容器内默认不撑开,加 flex:1 确保按钮全宽显示
    :deep(.wd-button) {
      flex: 1;
    }
  }
}
</style>
