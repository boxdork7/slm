<!-- SelectPicker 单复选选择器 用于从一组选项中进行单选或多选。 -->
<template>
  <view
    :class="`wd-select-picker ${cell.border.value ? 'is-border' : ''} ${customClass}`"
    :style="customStyle"
  >
    <view class="wd-select-picker__field" @click="open">
      <slot v-if="useDefaultSlot" />
      <view
        v-else
        :class="`wd-select-picker__cell ${disabled && 'is-disabled'} ${readonly && 'is-readonly'} ${alignRight && 'is-align-right'} ${
          error && 'is-error'
        } ${size && `is-${size}`}`"
      >
        <view
          v-if="label || useLabelSlot"
          :class="`wd-select-picker__label ${isRequired && 'is-required'} ${customLabelClass}`"
          :style="labelWidth ? `min-width:${labelWidth};max-width:${labelWidth};` : ''"
        >
          <block v-if="label">{{ label }}</block>
          <slot v-else name="label" />
        </view>
        <view class="wd-select-picker__body">
          <view class="wd-select-picker__value-wraper">
            <view
              :class="`wd-select-picker__value ${ellipsis && 'is-ellipsis'} ${customValueClass} ${
                showValue ? '' : 'wd-select-picker__value--placeholder'
              }`"
            >
              {{ showValue || placeholder || translate('placeholder') }}
            </view>
            <wd-icon v-if="showArrow" custom-class="wd-select-picker__arrow" name="right" />
            <view v-else-if="showClear" @click.stop="handleClear">
              <wd-icon custom-class="wd-select-picker__clear" name="close-outline-fill" />
            </view>
          </view>

          <view v-if="errorMessage" class="wd-select-picker__error-message">
            {{ errorMessage }}
          </view>
        </view>
      </view>
    </view>

    <!-- 使用 ActionSheet，根据类型显示不同内容 -->
    <wd-action-sheet
      v-model="pickerShow"
      :custom-header-class="`wd-select-picker__header ${customHeaderClass}`"
      :duration="250"
      :title="title || translate('title')"
      :close-on-click-modal="closeOnClickModal"
      :z-index="zIndex"
      :safe-area-inset-bottom="safeAreaInsetBottom"
      @close="close"
      @opened="scrollIntoView && type !== 'custom' ? setScrollIntoView() : ''"
    >
      <!-- 搜索框（仅 checkbox/radio 类型显示） -->
      <wd-search
        v-if="filterable && type !== 'custom'"
        v-model="filterVal"
        :placeholder="filterPlaceholder || translate('filterPlaceholder')"
        hide-cancel
        placeholder-left
        @change="handleFilterChange"
      />

      <!-- checkbox/radio 类型的内容 -->
      <scroll-view
        v-if="type !== 'custom'"
        :class="`wd-select-picker__wrapper ${filterable ? 'is-filterable' : ''} ${loading ? 'is-loading' : ''} ${customContentClass}`"
        :scroll-y="!loading"
        :scroll-top="scrollTop"
        :scroll-with-animation="true"
      >
        <!-- 多选 -->
        <view v-if="type === 'checkbox' && isArray(selectList)" id="wd-checkbox-group">
          <wd-checkbox-group
            v-model="selectList"
            cell
            :size="selectSize"
            :checked-color="checkedColor"
            :min="min"
            :max="max"
            @change="handleChange"
          >
            <view
              v-for="item in filterColumns"
              :id="`check${item[valueKey]}`"
              :key="item[valueKey]"
            >
              <wd-checkbox :model-value="item[valueKey]" :disabled="item.disabled">
                <block v-if="filterable && filterVal">
                  <block v-for="text in item[labelKey]" :key="text.label">
                    <text v-if="text.type === 'active'" class="wd-select-picker__text-active">
                      {{ text.label }}
                    </text>
                    <block v-else>{{ text.label }}</block>
                  </block>
                </block>
                <block v-else>
                  {{ item[labelKey] }}
                </block>
              </wd-checkbox>
            </view>
          </wd-checkbox-group>
        </view>
        <!-- 单选 -->
        <view v-if="type === 'radio' && !isArray(selectList)" id="wd-radio-group">
          <wd-radio-group
            v-model="selectList"
            cell
            :size="selectSize"
            :checked-color="checkedColor"
            @change="handleChange"
          >
            <view
              v-for="(item, index) in filterColumns"
              :id="`radio${item[valueKey]}`"
              :key="index"
            >
              <wd-radio :value="item[valueKey]" :disabled="item.disabled">
                <block v-if="filterable && filterVal">
                  <block v-for="text in item[labelKey]" :key="text.label">
                    <text
                      :class="`${text.type === 'active' ? 'wd-select-picker__text-active' : ''}`"
                    >
                      {{ text.label }}
                    </text>
                  </block>
                </block>
                <block v-else>
                  {{ item[labelKey] }}
                </block>
              </wd-radio>
            </view>
          </wd-radio-group>
        </view>
        <view v-if="loading" class="wd-select-picker__loading" @touchmove="noop">
          <wd-loading :color="loadingColor" />
        </view>
      </scroll-view>

      <!-- custom 类型的自定义内容插槽 -->
      <view v-if="type === 'custom'" :class="`wd-select-picker__custom-content ${customContentClass}`">
        <slot
          name="content"
          :value="internalValue"
          :update-value="updateValue"
          :confirm="handleCustomConfirm"
          :close="close"
        >
          <view class="wd-select-picker__custom-placeholder">
            请在 content 插槽中自定义内容
          </view>
        </slot>
      </view>

      <!-- 确认按钮 -->
      <view v-if="showConfirmBtn" class="wd-select-picker__footer">
        <wd-button
          block
          size="medium"
          :custom-class="confirmButtonCustomClass"
          :custom-style="confirmButtonCustomStyle"
          :disabled="loading"
          @click="type === 'custom' ? handleCustomConfirm() : onConfirm()"
        >
          {{ confirmButtonText || translate('confirm') }}
        </wd-button>
      </view>
    </wd-action-sheet>
  </view>
</template>

<script lang="ts" setup>
import type { ComponentPublicInstance } from 'vue'
import type { FormItemRule } from '../wd-form/wd-form.vue'
import type { CheckSize } from '@/wd/components/wd-checkbox-group/wd-checkbox-group.vue'
import { computed, getCurrentInstance, nextTick, onBeforeMount, ref, watch } from 'vue'
import { getRect, isArray, isDef, isFunction, pause } from '../common/util'
import { useCell } from '../composables/useCell'
import { useParent } from '../composables/useParent'
import { useTranslate } from '../composables/useTranslate'
import wdActionSheet from '../wd-action-sheet/wd-action-sheet.vue'
import wdButton from '../wd-button/wd-button.vue'
import wdCheckboxGroup from '../wd-checkbox-group/wd-checkbox-group.vue'
import wdCheckbox from '../wd-checkbox/wd-checkbox.vue'
import { FORM_KEY } from '../wd-form/wd-form-key'
import wdIcon from '../wd-icon/wd-icon.vue'
import wdLoading from '../wd-loading/wd-loading.vue'
import wdRadioGroup from '../wd-radio-group/wd-radio-group.vue'
import wdRadio from '../wd-radio/wd-radio.vue'
import wdSearch from '../wd-search/wd-search.vue'

defineOptions({
  name: 'WdSelectPicker',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 选择器类型
 */
export type SelectPickerType = 'checkbox' | 'radio' | 'custom'

/**
 * 显示格式化函数类型
 */
export type SelectPickerDisplayFormat = (
  items: string | number | boolean | (string | number | boolean)[] | any,
  columns: Record<string, any>[],
) => string

/**
 * 确认前校验函数类型
 */
export type SelectPickerBeforeConfirm = (
  value: string | number | boolean | (string | number | boolean)[] | any,
  resolve: (isPass: boolean) => void,
) => void

/**
 * 自定义值变化回调函数类型
 */
export type SelectPickerCustomChangeHandler = (value: any) => void

/**
 * 选择器组件属性接口
 */
interface WdSelectPickerProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string
  /** header 头部样式 */
  customHeaderClass?: string

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
  /** 必填样式 */
  required?: boolean
  /** 使用 label 插槽时设置该选项 */
  useLabelSlot?: boolean
  /** 使用默认插槽时设置该选项 */
  useDefaultSlot?: boolean
  /** 设置选择器大小 */
  size?: string
  /** 选中的颜色（单/复选框） */
  checkedColor?: string
  /** 最小选中的数量（仅在复选框类型下生效，`type`类型为`checkbox`） */
  min?: number
  /** 最大选中的数量，0 为无限数量，默认为 0（仅在复选框类型下生效，`type`类型为`checkbox`） */
  max?: number
  /** 设置 picker 内部的选项组尺寸大小 （单/复选框） */
  selectSize?: CheckSize
  /** 加载中 */
  loading?: boolean
  /** 加载的颜色，只能使用十六进制的色值写法，且不能使用缩写 */
  loadingColor?: string
  /** 点击遮罩是否关闭 */
  closeOnClickModal?: boolean
  /** 选中项，`type`类型为`checkbox`时，类型为 array；`type`为`radio` 时 ，类型为 number / boolean / string；`type`为`custom`时，类型为 any */
  modelValue: string | number | boolean | (string | number | boolean)[] | any
  /** 选择器数据，一维数组 */
  columns?: Record<string, any>[]
  /** 单复选选择器类型 */
  type?: SelectPickerType
  /** 选项对象中，value 对应的 key */
  valueKey?: string
  /** 选项对象中，展示的文本对应的 key */
  labelKey?: string
  /** 确认按钮文案 */
  confirmButtonText?: string
  /** 确认按钮自定义样式类 */
  confirmButtonCustomClass?: string
  /** 确认按钮自定义样式 */
  confirmButtonCustomStyle?: string
  /** 自定义展示文案的格式化函数，返回一个字符串 */
  displayFormat?: SelectPickerDisplayFormat
  /** 确定前校验函数，接收 (value, resolve) 参数，通过 resolve 继续执行 picker，resolve 接收 1 个 boolean 参数 */
  beforeConfirm?: SelectPickerBeforeConfirm
  /** 弹窗层级 */
  zIndex?: number
  /** 弹出面板是否设置底部安全距离（iphone X 类型的机型） */
  safeAreaInsetBottom?: boolean
  /** 可搜索（目前只支持本地搜索） */
  filterable?: boolean
  /** 搜索框占位符 */
  filterPlaceholder?: string
  /** 是否超出隐藏 */
  ellipsis?: boolean
  /** 重新打开是否滚动到选中项 */
  scrollIntoView?: boolean
  /** 表单域 `model` 字段名，在使用表单校验功能的情况下，该属性是必填的 */
  prop?: string
  /** 表单验证规则，结合`wd-form`组件使用 */
  rules?: FormItemRule[]
  /** 自定义内容样式类 */
  customContentClass?: string
  /** 自定义标签样式类 */
  customLabelClass?: string
  /** 自定义值样式类 */
  customValueClass?: string
  /** 是否显示确认按钮，默认值为：true（radio/custom类型生效） */
  showConfirm?: boolean
  /** 显示清空按钮 */
  clearable?: boolean

  // ========== 自定义类型新增属性 ==========
  /** 是否自动确认（选择后立即确认，不需要点击确认按钮） */
  autoConfirm?: boolean
  /** 自定义值变化回调函数 */
  onCustomChange?: SelectPickerCustomChangeHandler
}

/**
 * 选择器组件事件接口
 */
interface WdSelectPickerEmits {
  /** 选择器值改变时触发 */
  change: [{ value: string | number | boolean | (string | number | boolean)[] | any }]
  /** 取消选择时触发 */
  cancel: []
  /** 确认选择时触发 */
  confirm: [
    {
      value: string | number | boolean | (string | number | boolean)[] | any
      selectedItems: Record<string, any> | Record<string, any>[] | any
    },
  ]
  /** 清空选择时触发 */
  clear: []
  /** 更新选中值 */
  'update:modelValue': [value: string | number | boolean | (string | number | boolean)[] | any]
  /** 打开选择器时触发 */
  open: []
  /** 关闭选择器时触发 */
  close: []
  /** 自定义值变化时触发 */
  'custom-change': [{ value: any }]
  /** 自定义确认时触发 */
  'custom-confirm': [{ value: any }]
}

/**
 * 选择器组件暴露的方法接口
 */
interface WdSelectPickerExpose {
  /** 打开picker弹框 */
  open: () => void
  /** 关闭picker弹框 */
  close: () => void
  /** 手动确认自定义选择 */
  confirmCustom: () => void
  /** 更新自定义值 */
  updateValue: (value: any) => void
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdSelectPickerProps>(), {
  customStyle: '',
  customClass: '',
  labelWidth: '',
  disabled: false,
  readonly: false,
  alignRight: false,
  error: false,
  required: false,
  useLabelSlot: false,
  useDefaultSlot: false,
  min: 0,
  max: 0,
  loading: false,
  loadingColor: '#4D80F0',
  closeOnClickModal: true,
  columns: () => [],
  type: 'checkbox',
  valueKey: 'value',
  labelKey: 'label',
  zIndex: 100,
  safeAreaInsetBottom: true,
  filterable: false,
  ellipsis: false,
  scrollIntoView: true,
  rules: () => [],
  customContentClass: '',
  customLabelClass: '',
  customValueClass: '',
  showConfirm: true,
  clearable: false,

  // 自定义类型默认值
  autoConfirm: false,
  onCustomChange: undefined,
})

// 定义组件事件
const emit = defineEmits<WdSelectPickerEmits>()

// 获取翻译函数
const { translate } = useTranslate('select-picker')

// 响应式数据
const pickerShow = ref<boolean>(false)
const selectList = ref<Array<number | boolean | string> | number | boolean | string>([])
const isConfirm = ref<boolean>(false)
const lastSelectList = ref<Array<number | boolean | string> | number | boolean | string>([])
const filterVal = ref<string>('')
const filterColumns = ref<Array<Record<string, any>>>([])
const scrollTop = ref<number>(0) // 滚动位置

// 自定义类型相关的响应式数据
const internalValue = ref<any>(props.modelValue)

// 使用单元格组合式函数
const cell = useCell()

// 获取当前组件实例
const { proxy } = getCurrentInstance() as any

// 使用表单父组件
const { parent: form } = useParent(FORM_KEY)

/**
 * 判断初始 modelValue 是否为字符串类型
 */
const isInitialValueString = computed(() => {
  return typeof props.modelValue === 'string'
})

/**
 * 格式化值 - 保持原始类型格式
 * @param value 原始值
 * @returns 格式化后的值
 */
const valueFormat = (value: string | number | boolean | (string | number | boolean)[] | any) => {
  if (props.type === 'custom') {
    return value
  }

  if (props.type === 'checkbox') {
    if (isInitialValueString.value) {
      // 如果初始值是字符串，转换为数组进行内部处理
      if (typeof value === 'string') {
        return value ? value.split(',').map((item) => item.trim()) : []
      }
      return isArray(value) ? value : []
    } else {
      // 如果初始值是数组，直接使用数组格式
      return isArray(value) ? value : []
    }
  }
  return value
}

/**
 * 格式化输出值 - 根据初始类型返回对应格式
 * @param value 内部值（数组格式）
 * @returns 输出值
 */
const formatOutputValue = (value: string | number | boolean | (string | number | boolean)[] | any) => {
  if (props.type === 'custom') {
    return value
  }

  if (props.type === 'checkbox' && isInitialValueString.value && isArray(value)) {
    // 如果初始值是字符串格式，返回逗号分隔的字符串
    return value.map((item) => String(item)).join(',')
  }
  return value
}

/**
 * 获取选中项
 * @param value 选中值
 * @returns 选中项对象
 */
const getSelectedItem = (value: string | number | boolean) => {
  const { valueKey, labelKey, columns } = props

  const selecteds = columns.filter((item) => {
    return item[valueKey] === value
  })

  if (selecteds.length > 0) {
    return selecteds[0]
  }

  return {
    [valueKey]: value,
    [labelKey]: '',
  }
}

/**
 * 获取过滤文本
 * @param label 标签文本
 * @param filterVal 过滤值
 * @returns 格式化后的文本数组
 */
const getFilterText = (label: string, filterVal: string) => {
  const reg = new RegExp(`(${filterVal})`, 'g')

  return label.split(reg).map((text) => {
    return {
      type: text === filterVal ? 'active' : 'normal',
      label: text,
    }
  })
}

/**
 * 格式化过滤列
 * @param columns 列数据
 * @param filterVal 过滤值
 */
const formatFilterColumns = (columns: Record<string, any>[], filterVal: string) => {
  const filterColumnsTemp = columns.filter((item) => {
    return item[props.labelKey].includes(filterVal)
  })

  const formatFilterColumns = filterColumnsTemp.map((item) => {
    return {
      ...item,
      [props.labelKey]: getFilterText(item[props.labelKey], filterVal),
    }
  })
  filterColumns.value = []
  nextTick(() => {
    filterColumns.value = formatFilterColumns
  })
}

/**
 * 设置滚动到选中项
 */
const setScrollIntoView = async () => {
  let wraperSelector: string = ''
  let selectorPromise: Promise<UniApp.NodeInfo>[] = []
  if (isDef(selectList.value) && selectList.value !== '' && !isArray(selectList.value)) {
    wraperSelector = '#wd-radio-group'
    selectorPromise = [getRect(`#radio${selectList.value}`, false, proxy)]
  } else if (isArray(selectList.value) && selectList.value.length > 0) {
    selectList.value.forEach((value) => {
      selectorPromise.push(getRect(`#check${value}`, false, proxy))
    })
    wraperSelector = '#wd-checkbox-group'
  }
  if (wraperSelector) {
    await pause(2000 / 30)
    Promise.all([
      getRect('.wd-select-picker__wrapper', false, proxy),
      getRect(wraperSelector, false, proxy),
      ...selectorPromise,
    ]).then((res) => {
      if (isDef(res) && isArray(res)) {
        const scrollView = res[0]
        const wraper = res[1]
        const target = res.slice(2) || []
        if (isDef(wraper) && isDef(scrollView)) {
          const index = target.findIndex((item) => {
            return item.bottom! > scrollView.top! && item.top! < scrollView.bottom!
          })
          if (index < 0) {
            scrollTop.value = -1
            nextTick(() => {
              scrollTop.value = Math.max(0, target[0].top! - wraper.top! - scrollView.height! / 2)
            })
          }
        }
      }
    })
  }
}

/**
 * 空函数
 */
const noop = () => {}

/**
 * 处理确认
 */
const handleConfirm = () => {
  isConfirm.value = true
  pickerShow.value = false
  lastSelectList.value = valueFormat(selectList.value)

  // 格式化输出值，保持与初始值相同的类型
  const outputValue = formatOutputValue(lastSelectList.value)

  let selectedItems: Record<string, any> | Record<string, any>[]
  if (props.type === 'checkbox') {
    const arrayValue = isArray(lastSelectList.value) ? lastSelectList.value : []
    selectedItems = arrayValue.map((item) => {
      return getSelectedItem(item)
    })
  } else {
    selectedItems = getSelectedItem(lastSelectList.value as string | number | boolean)
  }

  emit('update:modelValue', outputValue)
  emit('confirm', {
    value: outputValue,
    selectedItems,
  })
  emit('close')
}

/**
 * 处理自定义确认
 */
const handleCustomConfirm = () => {
  isConfirm.value = true
  pickerShow.value = false

  const outputValue = internalValue.value

  emit('update:modelValue', outputValue)
  emit('custom-confirm', { value: outputValue })
  emit('confirm', {
    value: outputValue,
    selectedItems: outputValue,
  })
  emit('close')
}

/**
 * 确认选择
 */
const onConfirm = () => {
  if (props.loading) {
    pickerShow.value = false
    emit('confirm', { value: selectList.value, selectedItems: {} })
    emit('close')
    return
  }
  if (props.beforeConfirm) {
    props.beforeConfirm(selectList.value, (isPass: boolean) => {
      isPass && handleConfirm()
    })
  } else {
    handleConfirm()
  }
}

/**
 * 更新值（自定义类型使用）
 * @param value 新值
 */
const updateValue = (value: any) => {
  internalValue.value = value
  emit('custom-change', { value })

  // 调用外部自定义变化回调
  if (props.onCustomChange) {
    props.onCustomChange(value)
  }

  // 如果开启了自动确认，则立即确认
  if (props.autoConfirm) {
    nextTick(() => {
      handleCustomConfirm()
    })
  }
}

/**
 * 手动确认自定义选择（暴露给外部调用）
 */
const confirmCustom = () => {
  if (props.type === 'custom') {
    handleCustomConfirm()
  }
}

/**
 * 处理选择器值变化
 * @param value 新值 - 直接接收值，不使用对象解构
 */
const handleChange = (value: string | number | boolean | (string | number | boolean)[]) => {
  selectList.value = value
  emit('change', { value })
  if (props.type === 'radio' && !props.showConfirm) {
    onConfirm()
  }
}

/**
 * 处理过滤变化
 * @param value 过滤值
 */
const handleFilterChange = ({ value }: { value: string }) => {
  if (value === '') {
    filterColumns.value = []
    filterVal.value = value
    nextTick(() => {
      filterColumns.value = props.columns
    })
  } else {
    filterVal.value = value
    formatFilterColumns(props.columns, value)
  }
}

/**
 * 处理清空
 */
const handleClear = () => {
  let emptyValue: any

  if (props.type === 'custom') {
    emptyValue = undefined
    internalValue.value = undefined
  } else if (props.type === 'checkbox') {
    emptyValue = isInitialValueString.value ? '' : []
  } else {
    emptyValue = ''
  }

  emit('update:modelValue', emptyValue)
  emit('clear')
}

/**
 * 关闭选择器
 */
const close = () => {
  pickerShow.value = false
  // 未确定选项时，数据还原复位
  if (!isConfirm.value) {
    if (props.type === 'custom') {
      internalValue.value = props.modelValue
    } else {
      selectList.value = valueFormat(lastSelectList.value)
    }
  }
  emit('cancel')
  emit('close')
}

/**
 * 打开选择器
 */
const open = () => {
  if (props.disabled || props.readonly) return

  if (props.type === 'custom') {
    internalValue.value = props.modelValue
  } else {
    selectList.value = valueFormat(props.modelValue)
  }

  pickerShow.value = true
  isConfirm.value = false
  emit('open')
}

/**
 * 计算显示值
 * 根据选中值和格式化函数计算要显示的文本
 */
const showValue = computed(() => {
  let value = props.modelValue

  // 自定义类型处理
  if (props.type === 'custom') {
    if (props.displayFormat) {
      return props.displayFormat(value, props.columns)
    }

    // 默认显示逻辑：如果是对象或数组，转为 JSON 字符串
    if (value === null || value === undefined || value === '') {
      return ''
    }

    if (typeof value === 'object') {
      try {
        return JSON.stringify(value)
      } catch {
        return String(value)
      }
    }

    return String(value)
  }

  // 如果是字符串格式的复选框，转换为数组进行处理
  if (props.type === 'checkbox' && typeof value === 'string') {
    value = value ? value.split(',').map((item) => item.trim()) : []
  } else {
    value = valueFormat(props.modelValue)
  }

  let showValueTemp: string = ''

  if (props.displayFormat) {
    showValueTemp = props.displayFormat(value, props.columns)
  } else {
    const { type, labelKey } = props
    if (type === 'checkbox') {
      const selectedItems = (isArray(value) ? value : [])
        .map((item) => {
          return getSelectedItem(item)
        })
        .filter((item) => item[labelKey]) // 过滤掉空标签
      showValueTemp = selectedItems
        .map((item) => {
          return item[labelKey]
        })
        .join(', ')
    } else if (type === 'radio') {
      if (value !== '' && value !== null && value !== undefined) {
        const selectedItem = getSelectedItem(value as string | number | boolean)
        showValueTemp = selectedItem[labelKey] || ''
      }
    } else {
      showValueTemp = value as string
    }
  }
  return showValueTemp
})

/**
 * 计算是否显示确认按钮
 */
const showConfirmBtn = computed(() => {
  if (props.type === 'custom') {
    return props.showConfirm
  }
  return (props.type === 'radio' && props.showConfirm) || props.type === 'checkbox'
})

/**
 * 计算是否显示清除按钮
 */
const showClear = computed(() => {
  return props.clearable && !props.disabled && !props.readonly && showValue.value.length
})

/**
 * 计算是否显示箭头
 */
const showArrow = computed(() => {
  return !props.disabled && !props.readonly && !showClear.value
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
 * 监听模型值变化
 */
watch(
  () => props.modelValue,
  (newValue) => {
    if (props.type === 'custom') {
      // 自定义类型直接同步
      if (newValue !== internalValue.value) {
        internalValue.value = newValue
      }
    } else {
      // 其他类型原有逻辑
      if (newValue === selectList.value) return
      selectList.value = valueFormat(newValue)
      lastSelectList.value = valueFormat(newValue)
    }
  },
  {
    deep: true,
    immediate: true,
  },
)

/**
 * 监听列数据变化
 */
watch(
  () => props.columns,
  (newValue) => {
    if (props.filterable && filterVal.value) {
      formatFilterColumns(newValue, filterVal.value)
    } else {
      filterColumns.value = newValue
    }
  },
  {
    deep: true,
    immediate: true,
  },
)

/**
 * 监听显示格式化函数变化
 */
watch(
  () => props.displayFormat,
  (fn) => {
    if (fn && !isFunction(fn)) {
      console.error('The type of displayFormat must be Function')
    }
  },
  {
    deep: true,
    immediate: true,
  },
)

/**
 * 监听确认前校验函数变化
 */
watch(
  () => props.beforeConfirm,
  (fn) => {
    if (fn && !isFunction(fn)) {
      console.error('The type of beforeConfirm must be Function')
    }
  },
  {
    deep: true,
    immediate: true,
  },
)

/**
 * 组件挂载前初始化
 */
onBeforeMount(() => {
  if (props.type === 'custom') {
    internalValue.value = props.modelValue
  } else {
    selectList.value = valueFormat(props.modelValue)
  }
  filterColumns.value = props.columns
})

// 暴露组件方法
defineExpose<WdSelectPickerExpose>({
  close,
  open,
  confirmCustom,
  updateValue,
})

/** 选择选择器组件实例类型 */
export type SelectPickerInstance = ComponentPublicInstance<
  WdSelectPickerProps,
  WdSelectPickerExpose
>
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 暗色主题样式
.wot-theme-dark {
  @include b(select-picker) {
    @include when(border) {
      .wd-select-picker__cell {
        @include halfPixelBorder('top', $-cell-padding, $-dark-border-color);
      }
    }

    @include e(cell) {
      background-color: $-dark-background2;
      color: $-dark-color;
      @include when(disabled) {
        .wd-select-picker__value {
          color: $-dark-color3;
        }
      }
    }

    @include e(label) {
      color: $-dark-color;
    }
    @include e(value) {
      color: $-dark-color;
      @include m(placeholder) {
        color: $-dark-color-gray;
      }
    }

    :deep(.wd-select-picker__arrow),
    :deep(.wd-select-picker__close),
    :deep(.wd-select-picker__clear) {
      color: $-dark-color;
    }

    // 自定义内容样式 - 暗色模式
    @include e(custom-content) {
      background-color: $-dark-background2;
    }

    @include e(custom-placeholder) {
      color: $-dark-color-gray;
    }
  }
}

// 选择器组件样式
@include b(select-picker) {
  @include when(border) {
    .wd-select-picker__cell {
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
  }
  @include e(cell) {
    @include when(disabled) {
      .wd-select-picker__value {
        color: $-input-disabled-color;
      }
    }
    @include when(align-right) {
      .wd-select-picker__value {
        text-align: right;
      }
    }
    @include when(error) {
      .wd-select-picker__value {
        color: $-input-error-color;
      }
      :deep(.wd-select-picker__arrow) {
        color: $-input-error-color;
      }
    }
    @include when(large) {
      font-size: $-cell-title-fs-large;

      :deep(.wd-select-picker__arrow),
      :deep(.wd-select-picker__clear) {
        font-size: $-cell-icon-size-large;
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
    display: flex;
    width: $-input-cell-label-width;
    color: $-cell-title-color;
    margin-right: $-cell-padding;
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
  @include edeep(arrow, clear) {
    display: block;
    font-size: $-cell-icon-size;
    color: $-cell-arrow-color;
    line-height: $-cell-line-height;
  }

  @include edeep(clear) {
    color: $-cell-clear-color;
  }

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
  // selectPicker多出的样式
  @include edeep(header) {
    height: 144rpx;
    line-height: 144rpx;
  }
  @include e(wrapper) {
    padding: 0 20rpx;
    position: relative;
    max-height: 712rpx;
    box-sizing: border-box;
    overflow: auto;

    @include when(filterable) {
      height: 628rpx;
      max-height: 628rpx;
    }

    @include when(loading) {
      overflow: hidden;
    }
  }
  @include e(text-active) {
    color: $-color-theme;
  }

  @include e(footer) {
    padding: 48rpx 30rpx;
  }

  // ========== 自定义内容样式 ==========
  @include e(custom-content) {
    background-color: #fff;
    min-height: 200rpx;
    max-height: 70vh;
    overflow-y: auto;
  }

  @include e(custom-placeholder) {
    text-align: center;
    color: #999;
    font-size: 28rpx;
    padding: 80rpx 20rpx;
    line-height: 1.6;
  }
}
</style>
