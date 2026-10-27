<!-- ColPicker 多列选择器 使用多列选择器来做级联，交互效果较好，多列选择器支持无限级选择。 -->
<template>
  <view
    :class="`wd-col-picker ${cell.border.value ? 'is-border' : ''} ${customClass}`"
    :style="customStyle"
  >
    <view class="wd-col-picker__field" @click="showPicker">
      <slot v-if="useDefaultSlot"></slot>
      <view
        v-else
        :class="`wd-col-picker__cell ${disabled ? 'is-disabled' : ''} ${readonly ? 'is-readonly' : ''} ${alignRight ? 'is-align-right' : ''} ${error ? 'is-error' : ''} ${size ? `is-${size}` : ''}`"
      >
        <view
          v-if="label || useLabelSlot"
          :class="`wd-col-picker__label ${isRequired ? 'is-required' : ''} ${customLabelClass}`"
          :style="
            computedLabelWidth
              ? `min-width: ${computedLabelWidth}; max-width: ${computedLabelWidth};`
              : ''
          "
        >
          <block v-if="label">{{ label }}</block>
          <slot v-else name="label"></slot>
        </view>
        <view class="wd-col-picker__body">
          <view class="wd-col-picker__value-wraper">
            <view
              :class="`wd-col-picker__value ${ellipsis ? 'is-ellipsis' : ''} ${customValueClass} ${!showValue ? 'wd-col-picker__value--placeholder' : ''}`"
            >
              {{ showValue || placeholder || translate('placeholder') }}
            </view>
            <wd-icon
              v-if="!disabled && !readonly"
              custom-class="wd-col-picker__arrow"
              name="right"
            />
          </view>
          <view v-if="errorMessage" class="wd-col-picker__error-message">{{ errorMessage }}</view>
        </view>
      </view>
    </view>
    <wd-action-sheet
      v-model="pickerShow"
      :duration="250"
      :title="title || translate('title')"
      :close-on-click-modal="closeOnClickModal"
      :z-index="zIndex"
      :safe-area-inset-bottom="safeAreaInsetBottom"
      @open="handlePickerOpend"
      @close="handlePickerClose"
      @closed="handlePickerClosed"
    >
      <view class="wd-col-picker__selected">
        <scroll-view :scroll-x="true" scroll-with-animation :scroll-left="scrollLeft">
          <view class="wd-col-picker__selected-container">
            <view
              v-for="(_, colIndex) in selectList"
              :key="colIndex"
              :class="`wd-col-picker__selected-item  ${colIndex === currentCol && 'is-selected'}`"
              @click="handleColClick(colIndex)"
            >
              {{ selectShowList[colIndex] || translate('select') }}
            </view>
            <view class="wd-col-picker__selected-line" :style="state.lineStyle"></view>
          </view>
        </scroll-view>
      </view>
      <view class="wd-col-picker__list-container">
        <view
          v-for="(col, colIndex) in selectList"
          :key="colIndex"
          class="wd-col-picker__list"
          :style="colIndex === currentCol ? 'display: block;' : 'display: none;'"
        >
          <view
            v-for="(item, index) in col"
            :key="index"
            :class="`wd-col-picker__list-item ${pickerColSelected[colIndex] && item[valueKey] === pickerColSelected[colIndex] && 'is-selected'} ${
              item.disabled && 'is-disabled'
            }`"
            @click="chooseItem(colIndex, index)"
          >
            <view>
              <view class="wd-col-picker__list-item-label">{{ item[labelKey] }}</view>
              <view v-if="item[tipKey]" class="wd-col-picker__list-item-tip">
                {{ item[tipKey] }}
              </view>
            </view>
            <wd-icon custom-class="wd-col-picker__checked" name="check"></wd-icon>
          </view>
          <view v-if="loading" class="wd-col-picker__loading">
            <wd-loading :color="loadingColor" />
          </view>
        </view>
      </view>
    </wd-action-sheet>
  </view>
</template>

<script lang="ts" setup>
import type { ComponentPublicInstance, CSSProperties } from 'vue'
import type { FormItemRule } from '../wd-form/wd-form.vue'
import { computed, getCurrentInstance, onMounted, reactive, ref, watch } from 'vue'
import {
  addUnit,
  debounce,
  getRect,
  isArray,
  isBoolean,
  isDef,
  isFunction,
  objToStyle,
} from '../common/util'
import { useCell } from '../composables/useCell'
import { useParent } from '../composables/useParent'
import { useTranslate } from '../composables/useTranslate'
import wdActionSheet from '../wd-action-sheet/wd-action-sheet.vue'
import { FORM_KEY } from '../wd-form/wd-form-key'
import wdIcon from '../wd-icon/wd-icon.vue'
import wdLoading from '../wd-loading/wd-loading.vue'
import { useChinaRegions } from './useChinaRegions'

defineOptions({
  name: 'WdColPicker',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 列变化回调选项类型
 */
export interface ColPickerColumnChangeOption {
  selectedItem: Record<string, any>
  index: number
  rowIndex: number
  resolve: (nextColumn: Record<string, any>[]) => void
  finish: (isOk?: boolean) => void
}

/**
 * 列变化回调函数类型
 */
export type ColPickerColumnChange = (option: ColPickerColumnChangeOption) => void

/**
 * 显示格式化函数类型
 */
type ColPickerDisplayFormat = (selectedItems: Record<string, any>[]) => string

/**
 * 确认前回调函数类型
 */
type ColPickerBeforeConfirm = (
  value: (string | number)[],
  selectedItems: Record<string, any>[],
  resolve: (isPass: boolean) => void,
) => void

/**
 * 多列选择器组件属性接口
 */
interface WdColPickerProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 选中项 */
  modelValue: Array<string | number>
  /** 选择器数据，二维数组 */
  columns?: Record<string, any>[][]
  /** 选择器左侧文案 */
  label?: string
  /** 设置左侧标题宽度 */
  labelWidth?: string
  /** 使用 label 插槽时设置该选项 */
  useLabelSlot?: boolean
  /** 使用默认插槽时设置该选项 */
  useDefaultSlot?: boolean
  /** 禁用 */
  disabled?: boolean
  /** 只读 */
  readonly?: boolean
  /** 选择器占位符 */
  placeholder?: string
  /** 弹出层标题 */
  title?: string
  /** 接收当前列的选中项 item、当前列下标、当前列选中项下标下一列数据处理函数 resolve、结束选择 finish */
  columnChange?: ColPickerColumnChange
  /** 自定义展示文案的格式化函数，返回一个字符串 */
  displayFormat?: ColPickerDisplayFormat
  /** 确定前校验函数，接收 (value, resolve) 参数，通过 resolve 继续执行 picker，resolve 接收 1 个 boolean 参数 */
  beforeConfirm?: ColPickerBeforeConfirm
  /** 选择器的值靠右展示 */
  alignRight?: boolean
  /** 是否为错误状态，错误状态时右侧内容为红色 */
  error?: boolean
  /** 是否必填 */
  required?: boolean
  /** 设置选择器大小，可选值：large */
  size?: string
  /** 选项对象中，value 对应的 key */
  valueKey?: string
  /** 选项对象中，展示的文本对应的 key */
  labelKey?: string
  /** 选项对象中，提示文案对应的 key */
  tipKey?: string
  /** loading 图标的颜色 */
  loadingColor?: string
  /** 点击遮罩是否关闭 */
  closeOnClickModal?: boolean
  /** 自动触发 column-change 事件来补全数据，当 columns 为空数组或者 columns 数组长度小于 value 数组长度时，会自动触发 column-change */
  autoComplete?: boolean
  /** 弹窗层级 */
  zIndex?: number
  /** 弹出面板是否设置底部安全距离（iphone X 类型的机型） */
  safeAreaInsetBottom?: boolean
  /** 是否超出隐藏 */
  ellipsis?: boolean
  /** 表单域 model 字段名，在使用表单校验功能的情况下，该属性是必填的 */
  prop?: string
  /** 表单验证规则，结合wd-form组件使用 */
  rules?: FormItemRule[]
  /** 底部条宽度，单位像素 */
  lineWidth?: string | number
  /** 底部条高度，单位像素 */
  lineHeight?: string | number
  /** label 外部自定义样式 */
  customViewClass?: string
  /** value 外部自定义样式 */
  customLabelClass?: string
  customValueClass?: string
}

/**
 * 多列选择器组件事件接口
 */
interface WdColPickerEmits {
  /** 关闭选择器时触发 */
  close: []
  /** 选中值变化时触发 */
  'update:modelValue': [value: (string | number)[]]
  /** 确认选择时触发 */
  // prettier-ignore
  confirm: [{ value: (string | number)[], selectedItems: Record<string, any>[] }]
}

/**
 * 多列选择器组件暴露方法接口
 */
interface WdColPickerExpose {
  /** 关闭picker弹框 */
  close: () => void
  /** 打开picker弹框 */
  open: () => void
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdColPickerProps>(), {
  customStyle: '',
  customClass: '',
  columns: () => [],
  labelWidth: undefined,
  useLabelSlot: false,
  useDefaultSlot: false,
  disabled: false,
  readonly: false,
  alignRight: false,
  error: false,
  required: false,
  valueKey: 'value',
  labelKey: 'label',
  tipKey: 'tip',
  loadingColor: '#4D80F0',
  closeOnClickModal: true,
  autoComplete: false,
  zIndex: 100,
  safeAreaInsetBottom: true,
  ellipsis: false,
  rules: () => [],
  customViewClass: '',
  customLabelClass: '',
  customValueClass: '',
})

// 定义组件事件
const emit = defineEmits<WdColPickerEmits>()

// 使用省市区数据组合函数
const { getCitiesByProvince, getDistrictsByCity, getRegionColumns, getFullRegionName } =
  useChinaRegions()

// 响应式数据
const pickerShow = ref<boolean>(false)
const currentCol = ref<number>(0)
const selectList = ref<Record<string, any>[][]>([])
const pickerColSelected = ref<(string | number)[]>([])
const selectShowList = ref<Record<string, any>[]>([])
const loading = ref<boolean>(false)
const isChange = ref<boolean>(false)
const lastSelectList = ref<Record<string, any>[][]>([])
const lastPickerColSelected = ref<(string | number)[]>([])
const scrollLeft = ref<number>(0)
const inited = ref<boolean>(false)
const isCompleting = ref<boolean>(false)
const isUsingAreaData = ref<boolean>(false)

const state = reactive({
  lineStyle: 'display:none;', // 激活项边框线样式
})

// 获取当前组件实例
const { proxy } = getCurrentInstance() as any

// 使用 cell 组合式函数
const cell = useCell()

// 使用翻译函数
const { translate } = useTranslate('col-picker')

// 选择器容器和项目选择器
const $container = '.wd-col-picker__selected-container'
const $item = '.wd-col-picker__selected-item'

/**
 * 设置线条样式
 * 更新导航栏下划线的偏移量
 */
const setLineStyle = (animation: boolean = true) => {
  if (!inited.value || !pickerShow.value) return

  const updateStyle = () => {
    getRect($item, true, proxy)
      .then((rects) => {
        if (!isArray(rects) || rects.length === 0 || !rects[currentCol.value]) return

        const { lineWidth, lineHeight } = props
        const lineStyle: CSSProperties = {}

        // 设置线条宽度
        if (isDef(lineWidth)) {
          lineStyle.width = addUnit(lineWidth)
        }

        if (isDef(lineHeight)) {
          lineStyle.height = addUnit(lineHeight)
          lineStyle.borderRadius = `calc(${addUnit(lineHeight)} / 2)`
        }

        const currentRect = rects[currentCol.value]

        // 计算前面所有项的宽度总和
        const offsetLeft = rects.slice(0, currentCol.value).reduce((prev, curr) => {
          return prev + Number(curr.width || 0)
        }, 0)

        // 计算当前项的中心位置
        const currentWidth = Number(currentRect.width || 0)
        const itemCenterX = offsetLeft + currentWidth / 2

        // 设置线条位置到当前项的中心，强制使用px单位确保精确定位
        lineStyle.transform = `translateX(${itemCenterX}px) translateX(-50%)`
        lineStyle.display = 'block'

        if (animation) {
          lineStyle.transition = 'width 300ms ease, transform 300ms ease'
        }

        state.lineStyle = objToStyle(lineStyle)
      })
      .catch(() => {})
  }

  // 延迟执行确保DOM渲染完成
  setTimeout(updateStyle, 100)
}

/**
 * 滚动到当前激活的标签
 * scroll-view滑动到active的tab_nav
 */
const lineScrollIntoView = () => {
  if (!inited.value || !pickerShow.value) return
  Promise.all([getRect($item, true, proxy), getRect($container, false, proxy)])
    .then(([navItemsRects, navRect]) => {
      if (!isArray(navItemsRects) || navItemsRects.length === 0) return
      // 选中元素
      const selectItem = navItemsRects[currentCol.value]
      if (!selectItem) return

      // 选中元素之前的节点的宽度总和
      const offsetLeft = navItemsRects
        .slice(0, currentCol.value)
        .reduce((prev, curr) => prev + Number(curr.width || 0), 0)
      // scroll-view滑动到selectItem的偏移量
      scrollLeft.value = offsetLeft - ((navRect as any).width - Number(selectItem.width)) / 2
    })
    .catch(() => {})
}

// 防抖更新线条和滚动
const updateLineAndScroll = debounce((animation = true) => {
  setLineStyle(animation)
  lineScrollIntoView()
}, 50)

/**
 * 获取选中项
 * 根据值和列索引从选择列表中获取对应的项目
 */
const getSelectedItem = (
  value: string | number,
  colIndex: number,
  selectList: Record<string, any>[][],
) => {
  const { valueKey, labelKey } = props
  if (selectList[colIndex]) {
    const selecteds = selectList[colIndex].filter((item) => {
      return item[valueKey] === value
    })

    if (selecteds.length > 0) {
      return selecteds[0]
    }
  }

  return {
    [valueKey]: value,
    [labelKey]: '',
  }
}

/**
 * 计算显示值
 * 根据选中项和格式化函数计算最终显示的文本
 */
const showValue = computed(() => {
  // 如果使用内置省市区数据且有自定义格式化函数，使用自定义函数
  if (isUsingAreaData.value && props.displayFormat) {
    const selectedItems = (props.modelValue || []).map((item, colIndex) => {
      return getSelectedItem(item, colIndex, selectList.value)
    })
    return props.displayFormat(selectedItems)
  }

  // 如果使用内置省市区数据且没有自定义格式化函数，使用内置的格式化
  if (isUsingAreaData.value && props.modelValue.length > 0) {
    const [provinceCode, cityCode, districtCode] = props.modelValue
    return getFullRegionName(provinceCode, cityCode, districtCode)
  }

  // 使用原有逻辑
  const selectedItems = (props.modelValue || []).map((item, colIndex) => {
    return getSelectedItem(item, colIndex, selectList.value)
  })

  if (props.displayFormat) {
    return props.displayFormat(selectedItems)
  } else {
    return selectedItems
      .map((item) => {
        return item[props.labelKey]
      })
      .join('')
  }
})

/**
 * 初始化省市区数据
 * 当未提供columns时，使用内置的中国省市区数据
 */
const initAreaData = () => {
  if (!props.columns || props.columns.length === 0) {
    isUsingAreaData.value = true
    const [provinceCode, cityCode] = props.modelValue
    selectList.value = getRegionColumns(provinceCode, cityCode)

    // 更新显示文本列表
    selectShowList.value = props.modelValue.map((item, colIndex) => {
      return getSelectedItem(item, colIndex, selectList.value)[props.labelKey]
    })

    lastSelectList.value = selectList.value.slice(0)

    if (selectList.value.length > 0) {
      currentCol.value = selectList.value.length - 1
    }
  } else {
    isUsingAreaData.value = false
  }
}

/**
 * 确认选择
 * 触发确认事件，更新值并关闭选择器
 */
const onConfirm = () => {
  isChange.value = false
  loading.value = false
  pickerShow.value = false

  emit('update:modelValue', pickerColSelected.value)
  emit('confirm', {
    value: pickerColSelected.value,
    selectedItems: pickerColSelected.value.map((item, colIndex) => {
      return getSelectedItem(item, colIndex, selectList.value)
    }),
  })
}

/**
 * 处理列变化
 * 触发列变化回调函数，处理下一列数据
 */
const handleColChange = (
  colIndex: number,
  item: Record<string, any>,
  index: number,
  callback?: () => void,
) => {
  // 对于内置省市区数据，不显示loading，因为数据是同步获取的
  if (!isUsingAreaData.value) {
    loading.value = true
  }

  // 如果使用内置省市区数据
  if (isUsingAreaData.value) {
    if (colIndex === 0) {
      // 选择了省份，获取城市列表
      const cities = getCitiesByProvince(item.value)
      const newSelectList = selectList.value.slice(0)
      newSelectList[1] = cities
      selectList.value = newSelectList
      currentCol.value = 1
      updateLineAndScroll(true)

      if (typeof callback === 'function') {
        isCompleting.value = false
        selectShowList.value = pickerColSelected.value.map((item, colIndex) => {
          return getSelectedItem(item, colIndex, selectList.value)[props.labelKey]
        })
        callback()
      }
    } else if (colIndex === 1) {
      // 选择了城市，获取区县列表
      const districts = getDistrictsByCity(item.value)
      if (districts.length > 0) {
        const newSelectList = selectList.value.slice(0)
        newSelectList[2] = districts
        selectList.value = newSelectList
        currentCol.value = 2
        updateLineAndScroll(true)

        if (typeof callback === 'function') {
          isCompleting.value = false
          selectShowList.value = pickerColSelected.value.map((item, colIndex) => {
            return getSelectedItem(item, colIndex, selectList.value)[props.labelKey]
          })
          callback()
        }
      } else {
        // 没有区县数据，直接完成选择
        if (props.beforeConfirm) {
          props.beforeConfirm(
            pickerColSelected.value,
            pickerColSelected.value.map((item, colIndex) => {
              return getSelectedItem(item, colIndex, selectList.value)
            }),
            (isPass: boolean) => {
              if (isPass) {
                onConfirm()
              }
            },
          )
        } else {
          onConfirm()
        }
      }
    } else {
      // 选择了区县，完成选择
      if (props.beforeConfirm) {
        props.beforeConfirm(
          pickerColSelected.value,
          pickerColSelected.value.map((item, colIndex) => {
            return getSelectedItem(item, colIndex, selectList.value)
          }),
          (isPass: boolean) => {
            if (isPass) {
              onConfirm()
            }
          },
        )
      } else {
        onConfirm()
      }
    }
  } else {
    // 使用自定义 columnChange
    const { columnChange, beforeConfirm } = props
    columnChange &&
      columnChange({
        selectedItem: item,
        index: colIndex,
        rowIndex: index,
        resolve: (nextColumn: Record<string, any>[]) => {
          if (!isArray(nextColumn)) {
            console.error(
              'error(wd-col-picker): the data of each column of wd-col-picker should be an array',
            )
            return
          }

          const newSelectList = selectList.value.slice(0)
          newSelectList[colIndex + 1] = nextColumn

          selectList.value = newSelectList
          loading.value = false
          currentCol.value = colIndex + 1

          updateLineAndScroll(true)
          if (typeof callback === 'function') {
            isCompleting.value = false
            selectShowList.value = pickerColSelected.value.map((item, colIndex) => {
              return getSelectedItem(item, colIndex, selectList.value)[props.labelKey]
            })
            callback()
          }
        },
        finish: (isOk?: boolean) => {
          // 每设置展示数据回显
          if (typeof callback === 'function') {
            loading.value = false
            isCompleting.value = false
            return
          }
          if (isBoolean(isOk) && !isOk) {
            loading.value = false
            return
          }

          if (beforeConfirm) {
            beforeConfirm(
              pickerColSelected.value,
              pickerColSelected.value.map((item, colIndex) => {
                return getSelectedItem(item, colIndex, selectList.value)
              }),
              (isPass: boolean) => {
                if (isPass) {
                  onConfirm()
                } else {
                  loading.value = false
                }
              },
            )
          } else {
            onConfirm()
          }
        },
      })
  }
}

/**
 * 递归补齐列数据
 * 自动补全缺失的列数据
 */
const diffColumns = (colIndex: number) => {
  // colIndex 为 -1 时，item 为空对象，>=0 时则具有 value 属性
  const item = colIndex === -1 ? {} : { [props.valueKey]: props.modelValue[colIndex] }
  handleColChange(colIndex, item, -1, () => {
    // 如果 columns 长度还小于 value 长度，colIndex + 1，继续递归补齐
    if (selectList.value.length < props.modelValue.length) {
      diffColumns(colIndex + 1)
    }
  })
}

/**
 * 处理自动补全
 * 当需要时自动触发列变化来补齐数据
 */
const handleAutoComplete = () => {
  if (props.autoComplete) {
    // 如果 columns 数组长度为空，或者长度小于 value 的长度，自动触发 columnChange 来补齐数据
    if (selectList.value.length < props.modelValue.length || selectList.value.length === 0) {
      // isCompleting 是否在自动补全，锁操作
      if (!isCompleting.value) {
        // 在自动补全时，优先检查是否应该使用内置省市区数据
        if (!props.columns || props.columns.length === 0) {
          isUsingAreaData.value = true
          initAreaData()
        } else {
          isUsingAreaData.value = false
          // 使用原有的自动补全逻辑
          const colIndex = selectList.value.length === 0 ? -1 : selectList.value.length - 1
          diffColumns(colIndex)
        }
      }
      isCompleting.value = true
    }
  }
}

/**
 * 监听 modelValue 变化
 * 当选中值发生变化时，更新内部状态并处理自动补全
 */
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue === pickerColSelected.value) return
    pickerColSelected.value = newValue

    // 在处理 modelValue 变化时，重新判断是否使用内置数据
    if (!props.columns || props.columns.length === 0) {
      isUsingAreaData.value = true

      // 如果使用内置省市区数据，更新列数据
      if (newValue.length > 0) {
        const [provinceCode, cityCode] = newValue
        selectList.value = getRegionColumns(provinceCode, cityCode)
      }
    }

    newValue.map((item, colIndex) => {
      return getSelectedItem(item, colIndex, selectList.value)[props.labelKey]
    })
    handleAutoComplete()
  },
  {
    deep: true,
    immediate: true,
  },
)

/**
 * 监听 columns 变化
 * 当列数据发生变化时，更新选择列表和显示数据
 */
watch(
  () => props.columns,
  (newValue, oldValue) => {
    // 如果提供了 columns，则不使用内置省市区数据
    if (newValue && newValue.length > 0) {
      isUsingAreaData.value = false

      if (!isArray(newValue[0])) {
        return
      }

      const newSelectedList = newValue.slice(0)
      selectList.value = newSelectedList
      selectShowList.value = pickerColSelected.value.map((item, colIndex) => {
        return getSelectedItem(item, colIndex, newSelectedList)[props.labelKey]
      })
      lastSelectList.value = newSelectedList

      if (newSelectedList.length > 0) {
        currentCol.value = newSelectedList.length - 1
      }
    } else {
      // 如果没有提供 columns，使用内置省市区数据
      initAreaData()
    }
  },
  {
    deep: true,
    immediate: true,
  },
)

/**
 * 监听 columnChange 函数变化
 * 验证函数类型
 */
watch(
  () => props.columnChange,
  (fn) => {
    if (fn && !isFunction(fn)) {
      console.error('The type of columnChange must be Function')
    }
  },
  {
    deep: true,
    immediate: true,
  },
)

/**
 * 监听 displayFormat 函数变化
 * 验证函数类型
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
 * 监听 beforeConfirm 函数变化
 * 验证函数类型
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

// 使用父组件表单
const { parent: form } = useParent(FORM_KEY)

/**
 * 计算最终的标签宽度
 * 优先级：组件自身 labelWidth > form labelWidth > 默认值 '33%'
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

  // 3. 默认值 '33%'
  return '33%'
})

/**
 * 计算表单校验错误信息
 * 从父表单组件获取当前字段的错误信息
 */
const errorMessage = computed(() => {
  if (form && props.prop && form.errorMessages && form.errorMessages[props.prop]) {
    return form.errorMessages[props.prop]
  } else {
    return ''
  }
})

/**
 * 计算是否为必填字段
 * 检查组件自身、表单规则和父表单规则中的必填设置
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
 * 显示选择器
 * 检查禁用和只读状态，保存当前状态
 */
const showPicker = () => {
  if (props.disabled || props.readonly) return
  pickerShow.value = true
  lastPickerColSelected.value = pickerColSelected.value.slice(0)
  lastSelectList.value = selectList.value.slice(0)
}

/**
 * 处理选择器关闭完成事件
 * 如果有变化，恢复到上次的状态
 */
const handlePickerClosed = () => {
  if (isChange.value) {
    setTimeout(() => {
      selectList.value = lastSelectList.value.slice(0)
      pickerColSelected.value = lastPickerColSelected.value.slice(0)
      selectShowList.value = lastPickerColSelected.value.map((item, colIndex) => {
        return getSelectedItem(item, colIndex, lastSelectList.value)[props.labelKey]
      })
      currentCol.value = lastSelectList.value.length - 1
      isChange.value = false
    }, 250)
  }
}

/**
 * 处理选择器关闭事件
 */
const handlePickerClose = () => {
  pickerShow.value = false
  emit('close')
}

/**
 * 组件挂载后初始化
 */
onMounted(() => {
  inited.value = true
})

/**
 * 打开选择器弹框
 */
const open = () => {
  showPicker()
}

/**
 * 关闭选择器弹框
 */
const close = () => {
  handlePickerClose()
}

/**
 * 处理选择器打开事件
 * 更新线条位置和滚动位置
 */
const handlePickerOpend = () => {
  updateLineAndScroll(false)
}

/**
 * 选择项目
 * 处理用户点击选择项目的逻辑
 */
const chooseItem = (colIndex: number, index: number) => {
  const item = selectList.value[colIndex][index]
  if (item.disabled) return

  const newPickerColSelected = pickerColSelected.value.slice(0, colIndex)
  newPickerColSelected.push(item[props.valueKey])
  isChange.value = true
  pickerColSelected.value = newPickerColSelected
  selectList.value = selectList.value.slice(0, colIndex + 1)
  selectShowList.value = newPickerColSelected.map((item, colIndex) => {
    return getSelectedItem(item, colIndex, selectList.value)[props.labelKey]
  })

  if (selectShowList.value[colIndex] && colIndex === currentCol.value) {
    updateLineAndScroll(true)
  }

  handleColChange(colIndex, item, index)
}

/**
 * 处理列标签点击
 * 切换到指定的列
 */
const handleColClick = (index: number) => {
  isChange.value = true
  currentCol.value = index
  updateLineAndScroll(true)
}

// 暴露组件方法
defineExpose<WdColPickerExpose>({
  close,
  open,
})

/** 列选择器组件实例类型 */
export type ColPickerInstance = ComponentPublicInstance<WdColPickerProps, WdColPickerExpose>
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 暗色主题样式
.wot-theme-dark {
  @include b(col-picker) {
    @include when(border) {
      .wd-col-picker__cell {
        @include halfPixelBorder('top', $-cell-padding, $-dark-border-color);
      }
    }

    @include e(label) {
      color: $-dark-color;
    }

    @include e(cell) {
      background-color: $-dark-background2;
      color: $-dark-color;

      @include when(disabled) {
        .wd-col-picker__value {
          color: $-dark-color3;
        }
      }
    }

    @include e(list-item) {
      @include when(disabled) {
        color: $-dark-color3;
      }
    }

    @include e(list-item-tip) {
      color: $-dark-color-gray;
    }

    @include e(value) {
      color: $-dark-color;

      @include m(placeholder) {
        color: $-dark-color-gray;
      }
    }

    :deep(.wd-col-picker__arrow) {
      color: $-dark-color;
    }

    @include e(list) {
      color: $-dark-color;
    }

    @include e(selected) {
      color: $-dark-color;
    }
  }
}

// 多列选择器主体样式
@include b(col-picker) {
  @include when(border) {
    .wd-col-picker__cell {
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
      .wd-col-picker__value {
        color: $-input-disabled-color;
      }
    }
    @include when(align-right) {
      .wd-col-picker__value {
        text-align: right;
      }
    }
    @include when(error) {
      .wd-col-picker__value {
        color: $-input-error-color;
      }
      :deep(.wd-col-picker__arrow) {
        color: $-input-error-color;
      }
    }
    @include when(large) {
      font-size: $-cell-title-fs-large;

      :deep(.wd-col-picker__arrow) {
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
  @include e(selected) {
    height: $-col-picker-selected-height;
    font-size: $-col-picker-selected-fs;
    color: $-col-picker-selected-color;
    overflow: hidden;
  }
  @include e(selected-container) {
    position: relative;
    display: flex;
    user-select: none;
  }
  @include e(selected-item) {
    flex: 0 0 auto;
    height: $-col-picker-selected-height;
    line-height: $-col-picker-selected-height;
    padding: $-col-picker-selected-padding;

    @include when(selected) {
      font-weight: $-col-picker-selected-fw;
    }
  }
  @include e(selected-line) {
    position: absolute;
    bottom: 5px;
    width: $-col-picker-line-width;
    left: 0;
    height: $-col-picker-line-height;
    background: $-col-picker-line-color;
    z-index: 1;
    border-radius: calc($-col-picker-line-height / 2);
    box-shadow: $-col-picker-line-box-shadow;
  }
  @include e(list-container) {
    position: relative;
  }
  @include e(list) {
    height: $-col-picker-list-height;
    padding-bottom: $-col-picker-list-padding-bottom;
    box-sizing: border-box;
    overflow: auto;
    color: $-col-picker-list-color;
    font-size: $-col-picker-list-fs;
    -webkit-overflow-scrolling: touch;
  }
  @include e(list-item) {
    display: flex;
    padding: $-col-picker-list-item-padding;
    align-items: flex-start;

    @include when(selected) {
      color: $-col-picker-list-color-checked;

      :deep(.wd-col-picker__checked) {
        opacity: 1;
      }
    }
    @include when(disabled) {
      color: $-col-picker-list-color-disabled;
    }
  }
  @include e(list-item-label) {
    line-height: 1.285;
  }
  @include e(list-item-tip) {
    margin-top: 2px;
    font-size: $-col-picker-list-fs-tip;
    color: $-col-picker-list-color-tip;
  }
  @include edeep(checked) {
    display: block;
    margin-left: 4px;
    font-size: $-col-picker-list-checked-icon-size;
    color: $-col-picker-list-color-checked;
    opacity: 0;
  }
  @include e(loading) {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    align-items: center;
    justify-content: center;
  }
}
</style>
