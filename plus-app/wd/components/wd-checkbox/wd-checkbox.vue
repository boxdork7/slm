<!-- Checkbox 复选框 复选框用于在一组备选项中进行多选。 -->
<template>
  <view
    :class="`wd-checkbox ${isFirst ? 'is-first-child' : ''} ${isLast ? 'is-last-child' : ''} ${innerInline ? 'is-inline' : ''} ${innerShape === 'button' ? 'is-button' : ''} ${innerDisabled ? 'is-disabled' : ''} ${innerSize ? `is-${innerSize}` : ''} ${isChecked ? 'is-checked' : ''} ${customClass}`"
    :style="`${getItemWidthStyle()}${customStyle}`"
    @click="toggle"
  >
    <!-- 形状元素（button模式时隐藏） -->
    <view
      v-if="innerShape !== 'button'"
      :class="`wd-checkbox__shape ${innerShape === 'square' ? 'is-square' : ''} ${customShapeClass}`"
      :style="`${isChecked && !innerDisabled && innerCheckedColor ? `color: ${innerCheckedColor};` : ''}${objToStyle({})}`"
    >
      <wd-icon
        custom-class="wd-checkbox__check"
        name="check"
        :size="getIconSize()"
      />
    </view>

    <!-- 标签元素 -->
    <view
      :class="`wd-checkbox__label ${customLabelClass}`"
      :style="`${isChecked && innerShape === 'button' && !innerDisabled && innerCheckedColor ? `color: ${innerCheckedColor};` : ''}${objToStyle({})}`"
    >
      <!-- 按钮选中时展示的图标 -->
      <wd-icon
        v-if="innerShape === 'button' && isChecked"
        custom-class="wd-checkbox__btn-check"
        name="check"
        :size="getIconSize()"
      />

      <!-- 文案 -->
      <view class="wd-checkbox__txt" :style="maxWidth ? `max-width:${maxWidth}` : ''">
        <slot />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { ComponentPublicInstance, CSSProperties } from 'vue'
import type { CheckShape } from '../wd-checkbox-group/wd-checkbox-group.vue'
import { computed, getCurrentInstance, onBeforeMount, watch } from 'vue'
import { addUnit, getPropByPath, isDef, objToStyle } from '../common/util'
import { useParent } from '../composables/useParent'
import { CHECKBOX_GROUP_KEY } from '../wd-checkbox-group/wd-checkbox-group-key'
import wdIcon from '../wd-icon/wd-icon.vue'

defineOptions({
  name: 'WdCheckbox',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 复选框组件属性接口
 */
interface WdCheckboxProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string
  /** 自定义标签样式类 */
  customLabelClass?: string
  /** 自定义形状样式类 */
  customShapeClass?: string

  /** 复选框选中时的值 */
  modelValue?: string | number | boolean
  /** 复选框形状，可选值：circle / square / button */
  shape?: CheckShape
  /** 选中的颜色 */
  checkedColor?: string
  /** 禁用 */
  disabled?: boolean | null
  /** 选中值，在 checkbox-group 中使用无效，需同 false-value 一块使用 */
  trueValue?: string | number | boolean
  /** 非选中时的值，在 checkbox-group 中使用无效，需同 true-value 一块使用 */
  falseValue?: string | number | boolean
  /** 设置大小，可选值：'default' small large */
  size?: 'default' | 'small' | 'large'
  /** 文字位置最大宽度 */
  maxWidth?: string
}

/**
 * 复选框组件事件接口
 */
interface WdCheckboxEmits {
  /** v-model 更新事件 */
  'update:modelValue': [value: string | number | boolean]
  /** 值变化时触发 */
  change: [value: { value: string | number | boolean }]
}

/**
 * 复选框组件暴露的方法接口
 */
interface WdCheckboxExpose {
  /** 切换当前选中状态 */
  toggle: () => void
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdCheckboxProps>(), {
  customStyle: '',
  customClass: '',
  customLabelClass: '',
  customShapeClass: '',
  disabled: null,
  size: 'default',
  trueValue: true,
  falseValue: false,
})

// 定义组件事件
const emit = defineEmits<WdCheckboxEmits>()

// 获取父组件（CheckboxGroup）实例和当前索引
const { parent: checkboxGroup, index } = useParent(CHECKBOX_GROUP_KEY)

// 获取当前组件实例
const { proxy } = getCurrentInstance() as any

/**
 * 图标尺寸映射表
 * 为每个尺寸定义对应的图标大小（单位：rpx）
 */
const iconSizeMap = {
  small: 24,
  default: 32,
  large: 45,
} as const

/**
 * 获取图标尺寸
 * 根据当前的 size 返回对应的图标尺寸字符串
 */
const getIconSize = (): string => {
  const currentSize = props.size || 'default'
  return String(iconSizeMap[currentSize])
}

/**
 * 计算是否选中
 * 在组合使用时通过对比父组件的 modelValue 判断，单独使用时通过对比 trueValue 判断
 */
const isChecked = computed(() => {
  if (checkboxGroup) {
    const arrayValue = checkboxGroup.getArrayValue()
    return arrayValue.includes(props.modelValue)
  } else {
    return props.modelValue === props.trueValue
  }
})

/**
 * 计算是否为第一个元素
 */
const isFirst = computed(() => {
  return index.value === 0
})

/**
 * 计算是否为最后一个元素
 */
const isLast = computed(() => {
  const children = isDef(checkboxGroup) ? checkboxGroup.children : []
  return index.value === children.length - 1
})

/**
 * 计算形状值
 * 优先使用自身的 shape，否则使用父组件的 shape
 */
const innerShape = computed(() => {
  return props.shape || getPropByPath(checkboxGroup, 'props.shape') || 'circle'
})

/**
 * 计算选中颜色值
 * 优先使用自身的 checkedColor，否则使用父组件的 checkedColor
 */
const innerCheckedColor = computed(() => {
  return props.checkedColor || getPropByPath(checkboxGroup, 'props.checkedColor')
})

/**
 * 计算禁用状态
 * 综合考虑自身禁用、父组件禁用、最大最小值限制等因素
 */
const innerDisabled = computed(() => {
  if (!checkboxGroup) {
    return props.disabled
  }

  const { max, min, disabled } = checkboxGroup.props
  const arrayValue = checkboxGroup.getArrayValue()

  if (
    (max && arrayValue.length >= max && !isChecked.value) ||
    (min && arrayValue.length <= min && isChecked.value) ||
    props.disabled === true ||
    (disabled && props.disabled === null)
  ) {
    return true
  }

  return props.disabled
})

/**
 * 计算内联状态
 * 优先使用父组件的 inline
 */
const innerInline = computed(() => {
  return getPropByPath(checkboxGroup, 'props.inline') || false
})

/**
 * 计算大小值
 * 优先使用自身的 size，否则使用父组件的 size，都没有则使用 'default'
 */
const innerSize = computed(() => {
  return props.size || getPropByPath(checkboxGroup, 'props.size') || 'default'
})

/**
 * 获取 itemWidth 样式
 * 从父组件获取 itemWidth 设置
 */
const getItemWidthStyle = (): string => {
  const itemWidth = getPropByPath(checkboxGroup, 'props.itemWidth')
  if (!itemWidth) return ''

  const style: CSSProperties = {
    verticalAlign: 'top',
    boxSizing: 'border-box',
    marginBottom: '16rpx', // 添加底部间距避免换行挤压
  }

  // 对于按钮模式，需要考虑padding和margin的影响
  if (innerShape.value === 'button') {
    style.width = `calc(${addUnit(itemWidth)} - 24rpx)` // 减去padding-right: 24rpx
    style.display = 'inline-flex'
  } else {
    // 其他模式
    style.width = addUnit(itemWidth)
    style.display = 'inline-block'
  }

  return objToStyle(style)
}

/**
 * 检测checkbox绑定的value是否和其它checkbox的value冲突
 */
const checkName = () => {
  checkboxGroup &&
    checkboxGroup.children &&
    checkboxGroup.children.forEach((child: any) => {
      if (child.$.uid !== proxy.$.uid && child.modelValue === props.modelValue) {
        console.error(`The checkbox's bound value: ${props.modelValue} has been used`)
      }
    })
}

/**
 * 监听 modelValue 变化
 * 在组合使用时检查名称冲突
 */
watch(
  () => props.modelValue,
  () => {
    // 组合使用走这个逻辑
    if (checkboxGroup) {
      checkName()
    }
  },
)

/**
 * 监听 shape 属性变化
 * 验证 shape 的有效性
 */
watch(
  () => props.shape,
  (newValue) => {
    const validShapes = ['circle', 'square', 'button']
    if (isDef(newValue) && !validShapes.includes(newValue)) {
      console.error(`shape must be one of ${validShapes.toString()}`)
    }
  },
)

/**
 * 组件挂载前的处理
 * 检查 modelValue 是否已设置
 */
onBeforeMount(() => {
  if (props.modelValue === null) {
    console.error(`checkbox's value must be set`)
  }
})

/**
 * 切换当前选中状态
 * 点击checkbox的Event handle
 */
const toggle = () => {
  if (innerDisabled.value) return

  // 复选框单独使用时点击反选，并且在checkbox上触发change事件
  if (checkboxGroup) {
    emit('change', {
      value: !isChecked.value,
    })
    checkboxGroup.changeSelectState(props.modelValue)
  } else {
    const newVal = props.modelValue === props.trueValue ? props.falseValue : props.trueValue
    emit('update:modelValue', newVal)
    emit('change', {
      value: newVal,
    })
  }
}

// 暴露给父组件的方法
defineExpose<WdCheckboxExpose>({
  toggle,
})

/** 复选框组件实例类型 */
export type CheckboxInstance = ComponentPublicInstance<WdCheckboxProps, WdCheckboxExpose>
</script>

<style lang="scss">
// 引入外部样式文件
@import './../common/abstracts/_mixin.scss';
@import './../common/abstracts/variable.scss';

// 暗色主题样式
.wot-theme-dark {
  @include b(checkbox) {
    @include e(shape) {
      background: transparent;
      border-color: $-checkbox-border-color;
      color: $-checkbox-check-color;
    }

    @include e(label) {
      color: $-dark-color;
    }

    @include when(disabled) {
      .wd-checkbox__shape {
        border-color: $-dark-color-gray;
        background: $-dark-background4;
      }

      .wd-checkbox__label {
        color: $-dark-color-gray;
      }

      :deep(.wd-checkbox__check) {
        color: $-dark-color-gray;
      }

      @include when(checked) {
        .wd-checkbox__shape {
          color: $-dark-color-gray;
        }

        .wd-checkbox__label {
          color: $-dark-color-gray;
        }
      }

      @include when(button) {
        .wd-checkbox__label {
          border-color: #c8c9cc;
          background: #3a3a3c;
          color: $-dark-color-gray;
        }

        @include when(checked) {
          .wd-checkbox__label {
            border-color: #c8c9cc;
            background: #3a3a3c;
            color: #c8c9cc;
          }
        }
      }
    }

    @include when(button) {
      .wd-checkbox__label {
        background-color: $-dark-background;
      }

      @include when(checked) {
        .wd-checkbox__label {
          background-color: $-dark-background2;
        }
      }
    }
  }
}

// 复选框样式
@include b(checkbox) {
  display: block;
  margin-bottom: $-checkbox-margin !important;
  font-size: 0;
  -webkit-tap-highlight-color: transparent;
  line-height: 1.2;

  @include when(last-child) {
    margin-bottom: 0;
  }

  @include e(shape) {
    position: relative;
    display: inline-block;
    width: $-checkbox-size;
    height: $-checkbox-size;
    border: 4rpx solid $-checkbox-border-color;
    border-radius: 50%;
    color: $-checkbox-check-color;
    background: $-checkbox-bg;
    vertical-align: middle;
    transition: background 0.2s;
    box-sizing: border-box;

    @include when(square) {
      border-radius: $-checkbox-square-radius;
    }
  }

  @include e(input) {
    position: absolute;
    width: 0;
    height: 0;
    margin: 0;
    opacity: 0;
  }

  @include edeep(btn-check) {
    display: inline-block;
    font-size: $-checkbox-icon-size;
    margin-right: 8rpx;
    vertical-align: middle;
  }

  @include e(txt) {
    display: inline-block;
    vertical-align: middle;
    line-height: 40rpx;
    @include lineEllipsis;
  }

  @include e(label) {
    position: relative;
    display: inline-block;
    margin-left: $-checkbox-label-margin;
    vertical-align: middle;
    font-size: $-checkbox-label-fs;
    color: $-checkbox-label-color;
  }

  @include edeep(check) {
    color: $-checkbox-check-color;
    font-size: $-checkbox-icon-size;
    opacity: 0;
    transition: opacity 0.2s;
  }

  @include when(checked) {
    .wd-checkbox__shape {
      color: $-checkbox-checked-color;
      background: currentColor;
      border-color: currentColor;
    }

    :deep(.wd-checkbox__check) {
      opacity: 1;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }

  @include when(button) {
    display: inline-block;
    margin-bottom: $-checkbox-margin;
    margin-right: $-checkbox-margin;
    vertical-align: top;
    font-size: $-checkbox-button-font-size;

    @include when(last-child) {
      margin-right: 0;
    }

    .wd-checkbox__shape {
      width: 0;
      height: 0;
      overflow: hidden;
      opacity: 0;
      border: none;
    }

    .wd-checkbox__label {
      display: inline-flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      min-width: $-checkbox-button-min-width;
      height: $-checkbox-button-height;
      font-size: $-checkbox-button-font-size;
      margin-left: 0;
      padding: 10rpx 30rpx;
      border: 2rpx solid $-checkbox-button-border;
      background-color: $-checkbox-button-bg;
      border-radius: $-checkbox-button-radius;
      transition:
        color 0.2s,
        border 0.2s;
      box-sizing: border-box;
    }

    @include when(checked) {
      .wd-checkbox__label {
        color: $-checkbox-checked-color;
        background-color: $-checkbox-bg;
        border-color: $-checkbox-checked-color;
        border-color: currentColor;
      }
    }

  }

  @include when(inline) {
    display: inline-block;
    margin-bottom: 0;
    margin-right: $-checkbox-margin;

    @include when(last-child) {
      margin-right: 0;
    }
  }

  @include when(disabled) {
    .wd-checkbox__shape {
      border-color: $-checkbox-border-color;
      background: $-checkbox-disabled-check-bg;
    }

    .wd-checkbox__label {
      color: $-checkbox-disabled-label-color;
    }

    @include when(checked) {
      .wd-checkbox__shape {
        color: $-checkbox-disabled-check-color;
      }

      .wd-checkbox__label {
        color: $-checkbox-disabled-label-color;
      }
    }

    @include when(button) {
      .wd-checkbox__label {
        background: $-checkbox-disabled-color;
        border-color: $-checkbox-button-border;
        color: $-checkbox-disabled-label-color;
      }

      @include when(checked) {
        .wd-checkbox__label {
          border-color: $-checkbox-button-disabled-border;
        }
      }
    }
  }

  // 非按钮模式下的小尺寸样式
  @include when(small) {
    .wd-checkbox__shape {
      width: $-checkbox-small-size;
      height: $-checkbox-small-size;
      font-size: $-checkbox-small-size;
    }

    .wd-checkbox__label {
      font-size: $-checkbox-small-label-fs;
    }
  }

  // 非按钮模式下的大尺寸样式
  @include when(large) {
    .wd-checkbox__shape {
      width: $-checkbox-large-size;
      height: $-checkbox-large-size;
      font-size: $-checkbox-large-size;
    }

    .wd-checkbox__label {
      font-size: $-checkbox-large-label-fs;
    }
  }
}
</style>
