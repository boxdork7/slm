<!-- Picker 选择器 Picker 组件为 popup 和 pickerView 的组合。 -->
<template>
  <view
    :class="`wd-picker ${disabled ? 'is-disabled' : ''} ${size ? `is-${size}` : ''}  ${cell.border.value ? 'is-border' : ''} ${
      alignRight ? 'is-align-right' : ''
    } ${error ? 'is-error' : ''} ${customClass}`"
    :style="customStyle"
  >
    <view class="wd-picker__field" @click="showPopup">
      <slot v-if="useDefaultSlot" />
      <view v-else class="wd-picker__cell">
        <view
          v-if="label || useLabelSlot"
          :class="`wd-picker__label ${customLabelClass}  ${isRequired ? 'is-required' : ''}`"
          :style="
            labelWidth
              ? `min-width:${addUnit(labelWidth)};max-width:${addUnit(labelWidth)};`
              : ''
          "
        >
          <template v-if="label">
            {{ label }}
          </template>
          <slot v-else name="label" />
        </view>
        <view class="wd-picker__body">
          <view class="wd-picker__value-wraper">
            <view
              :class="`wd-picker__value ${ellipsis && 'is-ellipsis'} ${customValueClass} ${showValue ? '' : 'wd-picker__placeholder'}`"
            >
              {{ showValue ? showValue : placeholder || translate('placeholder') }}
            </view>
            <wd-icon v-if="showArrow" custom-class="wd-picker__arrow" name="right" />
            <view v-else-if="showClear" @click.stop="handleClear">
              <wd-icon custom-class="wd-picker__clear" name="close-outline-fill" />
            </view>
          </view>
          <view v-if="errorMessage" class="wd-picker__error-message">
            {{ errorMessage }}
          </view>
        </view>
      </view>
    </view>
    <wd-popup
      v-model="popupShow"
      custom-class="wd-picker__popup"
      position="bottom"
      :hide-when-close="false"
      :close-on-click-modal="closeOnClickModal"
      :z-index="zIndex"
      :safe-area-inset-bottom="safeAreaInsetBottom"
      @close="onCancel"
    >
      <view class="wd-picker__wraper">
        <view class="wd-picker__toolbar" @touchmove="noop">
          <view class="wd-picker__action wd-picker__action--cancel" @click="onCancel">
            {{ cancelButtonText || translate('cancel') }}
          </view>
          <view v-if="title" class="wd-picker__title">
            {{ title }}
          </view>
          <view :class="`wd-picker__action ${isLoading ? 'is-loading' : ''}`" @click="onConfirm">
            {{ confirmButtonText || translate('done') }}
          </view>
        </view>
        <wd-picker-view
          ref="pickerViewWd"
          v-model="pickerValue"
          :custom-class="customViewClass"
          :columns="displayColumns"
          :loading="isLoading"
          :loading-color="loadingColor"
          :columns-height="columnsHeight"
          :value-key="valueKey"
          :label-key="labelKey"
          :immediate-change="immediateChange"
          :column-change="columnChange"
          @change="pickerViewChange"
          @pickstart="onPickStart"
          @pickend="onPickEnd"
        />
      </view>
    </wd-popup>
  </view>
</template>

<script lang="ts" setup>
import type { ComponentPublicInstance } from 'vue'
import type { FormItemRule } from '../wd-form/wd-form.vue'
import type {
  ColumnItem,
  PickerViewColumnChange,
  PickerViewInstance,
} from '../wd-picker-view/wd-picker-view.vue'
import type { PickerViewValue } from '@/wd/components/wd-picker-view/wd-picker-view.vue'
import { computed, getCurrentInstance, nextTick, onBeforeMount, onMounted, ref, watch } from 'vue'
import {
  addUnit,
  deepClone,
  defaultDisplayFormat,
  getType,
  isArray,
  isDef,
  isFunction,
} from '../common/util'
import { useCell } from '../composables/useCell'
import { useParent } from '../composables/useParent'
import { useTranslate } from '../composables/useTranslate'
import { FORM_KEY } from '../wd-form/wd-form-key'
import wdIcon from '../wd-icon/wd-icon.vue'
import { formatArray, parseInputValue } from '../wd-picker-view/wd-picker-view-utils'
import wdPickerView from '../wd-picker-view/wd-picker-view.vue'
import wdPopup from '../wd-popup/wd-popup.vue'

defineOptions({
  name: 'WdPicker',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 选择器展示格式化函数类型
 */
export type PickerDisplayFormat = (
  item: ColumnItem | ColumnItem[],
  vl: {
    valueKey: string
    labelKey: string
  },
) => string

/**
 * 选择器确认前校验函数类型
 */
export type PickerBeforeConfirm = (
  value: PickerValue,
  resolve: (isPass: boolean) => void,
  picker: any,
) => void

/**
 * 选择器值类型
 */
export type PickerValue = string | number | boolean | Array<string | number | boolean>

/**
 * 选择器组件属性接口
 */
interface WdPickerProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string
  /** label 外部自定义样式 */
  customLabelClass?: string
  /** value 外部自定义样式 */
  customValueClass?: string
  /** pickerView 外部自定义样式 */
  customViewClass?: string

  /** 选择器左侧文案 */
  label?: string
  /** 选择器占位符 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 加载中 */
  loading?: boolean
  /** 加载中颜色 */
  loadingColor?: string

  /** 弹出层标题 */
  title?: string
  /** 取消按钮文案 */
  cancelButtonText?: string
  /** 确认按钮文案 */
  confirmButtonText?: string
  /** 是否必填 */
  required?: boolean
  /** 尺寸 */
  size?: string
  /** 标签宽度 */
  labelWidth?: string
  /** 使用默认插槽 */
  useDefaultSlot?: boolean
  /** 使用标签插槽 */
  useLabelSlot?: boolean
  /** 错误状态 */
  error?: boolean
  /** 右对齐 */
  alignRight?: boolean
  /** 确定前校验函数，接收 (value, resolve, picker) 参数，通过 resolve 继续执行 picker，resolve 接收1个boolean参数 */
  beforeConfirm?: PickerBeforeConfirm
  /** 点击蒙层关闭 */
  closeOnClickModal?: boolean
  /** 底部安全区域内 */
  safeAreaInsetBottom?: boolean
  /** 文本溢出显示省略号 */
  ellipsis?: boolean
  /** 选项总高度 */
  columnsHeight?: number
  /** 选项值对应的键名 */
  valueKey?: string
  /** 选项文本对应的键名 */
  labelKey?: string
  /** 选中项，如果为多列选择器，则其类型应为数组，也支持逗号分隔的字符串 */
  modelValue?: string | number | Array<string | number>
  /** 选择器数据，可以为字符串数组，也可以为对象数组，如果为二维数组，则为多列选择器 */
  columns?: Array<string | number | ColumnItem | Array<string | number | ColumnItem>>
  /** 接收 pickerView 实例、选中项、当前修改列的下标、resolve 作为入参，根据选中项和列下标进行判断，通过 pickerView 实例暴露出来的 setColumnData 方法修改其他列的数据源 */
  columnChange?: PickerViewColumnChange
  /** 自定义展示文案的格式化函数，返回一个字符串 */
  displayFormat?: PickerDisplayFormat
  /** 自定义层级 */
  zIndex?: number
  /** 表单域 model 字段名，在使用表单校验功能的情况下，该属性是必填的 */
  prop?: string
  /** 表单验证规则，结合wd-form组件使用 */
  rules?: FormItemRule[]
  /** 是否在手指松开时立即触发 change 事件。若不开启则会在滚动动画结束后触发 change 事件，1.2.25版本起提供，仅微信小程序和支付宝小程序支持 */
  immediateChange?: boolean
  /** 显示清空按钮 */
  clearable?: boolean
}

/**
 * 选择器组件事件接口
 */
interface WdPickerEmits {
  /** 确认选择时触发 */
  confirm: [
    {
      value: string | number | Array<string | number>
      selectedItems: ColumnItem | ColumnItem[]
    },
  ]
  /** 打开选择器时触发 */
  open: []
  /** 取消选择时触发 */
  cancel: []
  /** 清空选择时触发 */
  clear: []
  /** 更新选中值 */
  'update:modelValue': [value: string | number | Array<string | number>]
}

/**
 * 选择器组件暴露接口
 */
interface WdPickerExpose {
  /** 打开picker弹框 */
  open: () => void
  /** 关闭picker弹框 */
  close: () => void
  /** 设置加载状态 */
  setLoading: (loading: boolean) => void
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdPickerProps>(), {
  customStyle: '',
  customClass: '',
  customLabelClass: '',
  customValueClass: '',
  customViewClass: '',
  disabled: false,
  readonly: false,
  loading: false,
  loadingColor: '#4D80F0',
  required: false,
  useDefaultSlot: false,
  useLabelSlot: false,
  error: false,
  alignRight: false,
  closeOnClickModal: true,
  safeAreaInsetBottom: true,
  ellipsis: false,
  columnsHeight: 434,
  valueKey: 'value',
  labelKey: 'label',
  modelValue: '',
  columns: () => [],
  zIndex: 100,
  rules: () => [],
  immediateChange: false,
  clearable: false,
})

// 定义组件事件
const emit = defineEmits<WdPickerEmits>()

// 国际化翻译函数
const { translate } = useTranslate('picker')

// 组合式API引用
const cell = useCell()
const { parent: form } = useParent(FORM_KEY)
const { proxy } = getCurrentInstance() as any

// 响应式数据：picker-view 实例引用
const pickerViewWd = ref<PickerViewInstance | null>(null)
/** 内部控制是否loading */
const innerLoading = ref<boolean>(false)
/** 弹出层是否显示 */
const popupShow = ref<boolean>(false)
/** 选定后展示的选中项 */
const showValue = ref<string>('')
/** picker-view 当前选中值  */
const pickerValue = ref<PickerValue>('')
/** 传入 pickerView 的columns */
const displayColumns = ref<
  Array<string | number | ColumnItem | Array<string | number | ColumnItem>>
>([])
/** 保存之前的 columns，当取消时，将数据源回滚，避免多级联动数据源不正确的情况 */
const resetColumns = ref<Array<string | number | ColumnItem | Array<string | number | ColumnItem>>>(
  [],
)
/** 判断pickview是否还在滑动中 */
const isPicking = ref<boolean>(false)
/** 判断用户是否点击了确认按钮 */
const hasConfirmed = ref<boolean>(false)

/**
 * 计算当前是否处于加载状态
 */
const isLoading = computed(() => {
  return props.loading || innerLoading.value
})

/**
 * 计算表单校验错误信息
 */
const errorMessage = computed(() => {
  if (form && props.prop && form.errorMessages && form.errorMessages[props.prop]) {
    return form.errorMessages[props.prop]
  } else {
    return ''
  }
})

/**
 * 计算是否展示必填标识
 */
const isRequired = computed(() => {
  let formRequired = false

  // 检查表单级别的校验规则
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
 * 计算是否展示清除按钮
 */
const showClear = computed(() => {
  return props.clearable && !props.disabled && !props.readonly && showValue.value.length
})

/**
 * 计算是否展示箭头
 */
const showArrow = computed(() => {
  return !props.disabled && !props.readonly && !showClear.value
})

// ============ 工具函数声明区域 ============

/**
 * 转换解析值为合适的类型
 * @param parsedValues 解析后的值数组
 * @param isMultiColumn 是否为多列
 * @returns 转换后的值
 */
const convertParsedValues = (
  parsedValues: (string | number | boolean)[],
  isMultiColumn: boolean,
): PickerValue => {
  if (!isMultiColumn) {
    // 单列选择器，返回单个值
    return parsedValues.length > 0 ? parsedValues[0] : ''
  }

  // 多列选择器，返回数组
  return parsedValues as Array<string | number>
}

/**
 * 设置显示值
 * @param items 选中项数据
 */
const setShowValue = (items: ColumnItem | ColumnItem[]) => {
  // 避免值为空时调用自定义展示函数
  if ((isArray(items) && !items.length) || !items) return

  const { valueKey, labelKey } = props
  showValue.value = (props.displayFormat || defaultDisplayFormat)(items, { valueKey, labelKey })
}

/**
 * 根据传入的value，picker组件获取当前cell展示值
 * @param value 选中值
 * @returns 选中项数据
 */
const getSelects = (value: PickerViewValue) => {
  const formatColumns = formatArray(props.columns, props.valueKey, props.labelKey)
  if (props.columns.length === 0) return

  // 使其默认选中首项
  if (value === '' || !isDef(value) || (isArray(value) && value.length === 0)) {
    return
  }

  const valueType = getType(value)
  const type = ['string', 'number', 'boolean', 'array']
  if (!type.includes(valueType)) return []

  /**
   * 1.解析传入的值为数组格式
   * 2.根据formatColumns的长度截取Array<String>，保证下面的遍历不溢出
   * 3.根据每列的key值找到选项中value为此key的下标并记录
   */
  let parsedValues = parseInputValue(value)
  parsedValues = parsedValues.slice(0, formatColumns.length)

  if (parsedValues.length === 0) {
    parsedValues = formatColumns.map(() => 0)
  }

  const selected: number[] = []
  parsedValues.forEach((target, col) => {
    let row = formatColumns[col].findIndex((row) => {
      return row[props.valueKey].toString() === target.toString()
    })
    row = row === -1 ? 0 : row
    selected.push(row)
  })

  const selects = selected.map((row, col) => formatColumns[col][row])
  // 单列选择器，则返回单项
  if (selects.length === 1) {
    return selects[0]
  }
  return selects
}

/**
 * 值变更时更新显示内容
 * @param value 新的选中值
 */
const handleShowValueUpdate = (value: string | number | Array<string | number>) => {
  // 获取初始选中项,并展示初始选中文案
  if ((isArray(value) && value.length > 0) || (isDef(value) && !isArray(value) && value !== '')) {
    if (pickerViewWd.value) {
      nextTick(() => {
        setShowValue(pickerViewWd.value!.getSelects())
      })
    } else {
      const selects = getSelects(value)
      if (selects) {
        setShowValue(selects)
      }
    }
  } else {
    showValue.value = ''
  }
}

/**
 * 空操作函数，用于阻止事件冒泡
 */
const noop = () => {}

/**
 * picker开始滑动事件处理
 */
const onPickStart = () => {
  isPicking.value = true
}

/**
 * 格式化输出值，根据原始输入类型决定返回格式
 * @param values picker-view 返回的值
 * @param originalValue 原始输入值，用于确定返回格式
 * @returns 格式化后的值
 */
const formatOutputValue = (
  values: any,
  originalValue: string | number | Array<string | number>,
) => {
  // 如果原始值是逗号分隔的字符串，返回逗号分隔的字符串
  if (typeof originalValue === 'string' && originalValue.includes(',')) {
    return isArray(values) ? values.join(',') : values.toString()
  }

  // 如果有多列且原始值不是逗号字符串，返回数组
  if (props.columns.length > 1 && isArray(originalValue)) {
    return isArray(values) ? values : [values]
  }

  // 单列选择器，返回单个值
  return isArray(values) ? values[0] : values
}

/**
 * 处理确认选择
 * 获取选中项和值，关闭弹窗，更新显示值，触发相关事件
 */
const handleConfirm = () => {
  if (isLoading.value || props.disabled) {
    popupShow.value = false
    return
  }

  const selects = pickerViewWd.value!.getSelects()
  const values = pickerViewWd.value!.getValues()
  // 获取当前的数据源，并设置给 resetColumns，用于取消时可以回退数据源
  const columns = pickerViewWd.value!.getColumnsData()

  popupShow.value = false
  resetColumns.value = deepClone(columns)

  // 根据原始输入类型格式化输出值
  const formattedValue = formatOutputValue(values, props.modelValue)

  emit('update:modelValue', formattedValue)

  setShowValue(selects)
  emit('confirm', {
    value: formattedValue,
    selectedItems: selects,
  })
}

/**
 * 点击确定按钮处理
 * 如果有beforeConfirm函数则先执行校验，否则直接确认
 */
const onConfirm = () => {
  if (isLoading.value) return

  // 如果当前还在滑动且未停止下来，则锁住先不确认，等滑完再自动确认，避免pickview值未更新
  if (isPicking.value) {
    hasConfirmed.value = true
    return
  }

  const { beforeConfirm } = props
  if (beforeConfirm && isFunction(beforeConfirm)) {
    beforeConfirm(
      pickerValue.value,
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
 * picker结束滑动事件处理
 * 如果在滑动过程中用户点击了确认，则在滑动结束后自动确认
 */
const onPickEnd = () => {
  isPicking.value = false

  if (hasConfirmed.value) {
    hasConfirmed.value = false
    onConfirm()
  }
}

/**
 * picker-view change事件处理
 * @param event 变化事件对象
 */
const pickerViewChange = ({ value }: any) => {
  pickerValue.value = value
}

/**
 * 处理清空操作
 */
const handleClear = () => {
  let clearValue: string | number | Array<string | number>

  // 根据原始值类型决定清空后的值
  if (typeof props.modelValue === 'string' && props.modelValue.includes(',')) {
    // 如果原始值是逗号分隔字符串，清空后也是空字符串
    clearValue = ''
  } else if (props.columns.length > 1) {
    // 多列选择器清空为空数组
    clearValue = []
  } else {
    // 单列选择器清空为空字符串
    clearValue = ''
  }

  emit('update:modelValue', clearValue)
  emit('clear')
}

/**
 * 外部设置是否loading
 * @param loading 是否loading
 */
const setLoading = (loading: boolean) => {
  innerLoading.value = loading
}

/**
 * 展示popup弹窗
 */
const showPopup = () => {
  if (props.disabled || props.readonly) return

  emit('open')
  popupShow.value = true

  // 解析当前 modelValue 并设置给 pickerValue
  const parsedValues = parseInputValue(props.modelValue)
  const isMultiColumn = props.columns.length > 1

  // 使用转换函数
  pickerValue.value = convertParsedValues(parsedValues, isMultiColumn)

  displayColumns.value = resetColumns.value
}

/**
 * 点击取消按钮处理
 * 关闭popup，触发cancel事件，恢复数据源
 */
const onCancel = () => {
  popupShow.value = false
  emit('cancel')

  // 延迟恢复数据源，避免在动画过程中闪动
  const timmer = setTimeout(() => {
    clearTimeout(timmer)
    isDef(pickerViewWd.value) && pickerViewWd.value.resetColumns(resetColumns.value)
  }, 300)
}

/**
 * 对外暴露方法，打开弹框
 */
const open = () => {
  showPopup()
}

/**
 * 对外暴露方法，关闭弹框
 */
const close = () => {
  onCancel()
}

// ============ 监听器区域 ============

/**
 * 监听展示格式化函数变化
 * 当格式化函数发生变化时，重新更新显示值
 */
watch(
  () => props.displayFormat,
  (fn) => {
    if (fn && !isFunction(fn)) {
      console.error('The type of displayFormat must be Function')
    }
    if (pickerViewWd.value && pickerViewWd.value.getSelectedIndex().length !== 0) {
      handleShowValueUpdate(props.modelValue)
    }
  },
  { immediate: true, deep: true },
)

/**
 * 监听选中值变化
 * 当选中值发生变化时，更新picker值和显示值
 */
watch(
  () => props.modelValue,
  (newValue) => {
    // 解析新值并设置给 pickerValue
    const parsedValues = parseInputValue(newValue)
    const isMultiColumn = props.columns.length > 1

    // 使用转换函数
    pickerValue.value = convertParsedValues(parsedValues, isMultiColumn)

    // 获取初始选中项,并展示初始选中文案
    handleShowValueUpdate(newValue)
  },
  { deep: true, immediate: true },
)

/**
 * 监听列数据变化
 * 当列数据发生变化时，更新显示列和重置列数据
 */
watch(
  () => props.columns,
  (newValue) => {
    displayColumns.value = deepClone(newValue)
    resetColumns.value = deepClone(newValue)
    if (newValue.length === 0) {
      // 当 columns 变为空时，根据原始值类型清空
      if (typeof props.modelValue === 'string' && props.modelValue.includes(',')) {
        pickerValue.value = ''
      } else {
        pickerValue.value = isArray(props.modelValue) ? [] : ''
      }
      showValue.value = ''
    } else {
      // 非空时正常更新显示值
      handleShowValueUpdate(props.modelValue)
    }
  },
  { deep: true, immediate: true },
)

/**
 * 监听列变化函数
 * 验证columnChange属性类型是否正确
 */
watch(
  () => props.columnChange,
  (newValue) => {
    if (newValue && !isFunction(newValue)) {
      console.error('The type of columnChange must be Function')
    }
  },
  { deep: true, immediate: true },
)

// ============ 生命周期钩子 ============

/**
 * 组件挂载前的处理
 * 初始化显示列和重置列数据
 */
onBeforeMount(() => {
  displayColumns.value = deepClone(props.columns)
  resetColumns.value = deepClone(props.columns)
})

/**
 * 组件挂载后的处理
 * 更新显示值
 */
onMounted(() => {
  handleShowValueUpdate(props.modelValue)
})

// 暴露组件方法
defineExpose<WdPickerExpose>({
  close,
  open,
  setLoading,
})

/** 选择器组件实例类型 */
export type PickerInstance = ComponentPublicInstance<WdPickerProps, WdPickerExpose>
</script>

<style lang="scss">
// 引入外部样式文件
@import './../common/abstracts/_mixin.scss';
@import './../common/abstracts/variable.scss';

// 暗色主题样式
.wot-theme-dark {
  @include b(picker) {
    @include when(border) {
      .wd-picker__cell {
        @include halfPixelBorder('top', $-cell-padding, $-dark-border-color);
      }
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

    :deep(.wd-picker__arrow),
    :deep(.wd-picker__clear) {
      color: $-dark-color;
    }

    @include e(cell) {
      background-color: $-dark-background2;
      color: $-dark-color;

      @include when(disabled) {
        .wd-picker__value {
          color: $-dark-color3;
        }
        .wd-picker__placeholder {
          color: $-dark-color-gray;
        }
      }
    }

    @include when(disabled) {
      .wd-picker__value {
        color: $-dark-color3;
      }

      .wd-picker__placeholder {
        color: $-dark-color-gray;
      }
    }

    @include e(action) {
      @include m(cancel) {
        color: $-dark-color;
      }

      @include when(loading) {
        color: $-dark-color3;
      }
    }
  }
}

// 选择器主体样式
@include b(picker) {
  // 弹窗样式
  @include edeep(popup) {
    border-radius: 32rpx 32rpx 0 0;
  }

  // 边框样式
  @include when(border) {
    .wd-picker__cell {
      @include halfPixelBorder('top', $-cell-padding);
    }
  }

  // 大尺寸样式
  @include when(large) {
    .wd-picker__cell {
      font-size: $-cell-title-fs-large;
    }
    :deep(.wd-picker__arrow),
    :deep(.wd-picker__clear) {
      font-size: $-cell-icon-size-large;
    }
  }

  // 错误状态样式
  @include when(error) {
    .wd-picker__value,
    :deep(.wd-picker__arrow) {
      color: $-input-error-color;
    }
  }

  // 右对齐样式
  @include when(align-right) {
    .wd-picker__value {
      text-align: right;
    }
  }

  // 单元格样式
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

  // 禁用状态样式
  @include when(disabled) {
    .wd-picker__value {
      color: $-picker-column-disabled-color;
    }
  }

  // 错误信息样式
  @include e(error-message) {
    color: $-form-item-error-message-color;
    font-size: $-form-item-error-message-font-size;
    line-height: $-form-item-error-message-line-height;
    text-align: left;
    vertical-align: middle;
  }

  // 标签样式
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

  // 值包装器样式
  @include e(value-wraper) {
    display: flex;
  }

  // 值样式
  @include e(value) {
    flex: 1;
    margin-right: 20rpx;
    color: $-cell-value-color;

    @include when(ellipsis) {
      @include lineEllipsis;
    }
  }

  // 主体样式
  @include e(body) {
    flex: 1;
  }

  // 占位符样式
  @include e(placeholder) {
    color: $-input-placeholder-color;
  }

  // 箭头和清空图标样式
  @include edeep(arrow, clear) {
    display: block;
    font-size: $-cell-icon-size;
    color: $-cell-arrow-color;
    line-height: $-cell-line-height;
  }

  // 清空图标样式
  @include edeep(clear) {
    color: $-cell-clear-color;
  }

  // 包装器样式
  @include e(wraper) {
    padding-bottom: var(--window-bottom);
  }

  // 工具栏样式
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

  // 操作按钮样式
  @include e(action) {
    display: block;
    border: none;
    outline: none;
    font-size: $-picker-toolbar-fs;
    color: $-picker-toolbar-finish-color;
    background: transparent;
    padding: 48rpx 30rpx 28rpx 30rpx;

    @include m(cancel) {
      color: $-picker-toolbar-cancel-color;
    }

    @include when(loading) {
      color: $-picker-loading-button-color;
    }
  }

  // 标题样式
  @include e(title) {
    display: block;
    padding-top: 20rpx;
    color: $-picker-toolbar-title-color;
    font-weight: $-action-sheet-weight;
  }
}
</style>
