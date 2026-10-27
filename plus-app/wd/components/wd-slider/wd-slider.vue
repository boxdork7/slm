<!-- Slider 滑块 支持单向滑块和双向滑块。 -->
<template>
  <view
    :class="`wd-slider ${!hideLabel ? 'wd-slider__has-label' : ''} ${disabled ? 'wd-slider--disabled' : ''} ${customClass}`"
    :style="customStyle"
  >
    <!-- #ifdef MP-DINGTALK -->
    <view
      style="flex: 1"
      :class="`wd-slider ${!hideLabel ? 'wd-slider__has-label' : ''} ${disabled ? 'wd-slider--disabled' : ''} ${customClass}`"
    >
      <!-- #endif -->
      <view v-if="!hideMinMax" :class="`wd-slider__label-min ${customMinClass}`">
        {{ min }}
      </view>
      <view :id="sliderBarWrapperId" class="wd-slider__bar-wrapper" :style="wrapperStyle">
        <view class="wd-slider__bar" :style="barStyle">
          <template v-if="isRange">
            <!-- 左边滑块 -->
            <view
              class="wd-slider__button-wrapper wd-slider__button-wrapper--left"
              :style="sliderButtonStyle"
              @touchstart="(event) => onSliderTouchStart(event, 0)"
              @touchmove="onSliderTouchMove"
              @touchend="onSliderTouchEnd"
              @touchcancel="onSliderTouchEnd"
            >
              <view v-if="!hideLabel" class="wd-slider__label">
                {{ firstValue }}
              </view>
              <view class="wd-slider__button" />
            </view>
            <!-- 右边滑块 -->
            <view
              class="wd-slider__button-wrapper wd-slider__button-wrapper--right"
              :style="sliderButtonStyle"
              @touchstart="(event) => onSliderTouchStart(event, 1)"
              @touchmove="onSliderTouchMove"
              @touchend="onSliderTouchEnd"
              @touchcancel="onSliderTouchEnd"
            >
              <view v-if="!hideLabel" class="wd-slider__label">
                {{ secondValue }}
              </view>
              <view class="wd-slider__button" />
            </view>
          </template>
          <view
            v-else
            class="wd-slider__button-wrapper"
            :style="sliderButtonStyle"
            @touchstart="(event) => onSliderTouchStart(event, 0)"
            @touchmove="onSliderTouchMove"
            @touchend="onSliderTouchEnd"
            @touchcancel="onSliderTouchEnd"
          >
            <view v-if="!hideLabel" class="wd-slider__label">
              {{ firstValue }}
            </view>
            <view class="wd-slider__button" />
          </view>
        </view>
      </view>
      <view v-if="!hideMinMax" :class="`wd-slider__label-max ${customMaxClass}`">
        {{ max }}
      </view>
      <!-- #ifdef MP-DINGTALK -->
    </view>
    <!-- #endif -->
  </view>
</template>

<script lang="ts" setup>
import type { ComponentPublicInstance, CSSProperties } from 'vue'
import { computed, getCurrentInstance, onMounted, ref, watch } from 'vue'
import { deepClone, getRect, isArray, isEqual, objToStyle, uuid } from '../common/util'
import { useTouch } from '../composables/useTouch'

defineOptions({
  name: 'WdSlider',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 滑块值类型 - 单滑块为数字，双滑块为数组
 */
type SliderValue = number | number[]

/**
 * 滑块拖动事件参数
 */
interface SliderDragEvent {
  /** 当前滑块的值，单滑块模式为数字，双滑块模式为数组 */
  value: SliderValue
}

/**
 * 滑块组件属性接口
 */
interface WdSliderProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string
  /** 自定义最小值的样式类名 */
  customMinClass?: string
  /** 自定义最大值的样式类名 */
  customMaxClass?: string

  /** 是否隐藏左右的最大最小值 */
  hideMinMax?: boolean
  /** 是否隐藏当前滑块值 */
  hideLabel?: boolean
  /** 是否禁用滑块 */
  disabled?: boolean

  /** 进度条未激活的背景颜色 */
  inactiveColor?: string
  /** 进度条激活的背景颜色 */
  activeColor?: string

  /** 滑块的最大值 */
  max?: number
  /** 滑块的最小值 */
  min?: number
  /** 滑块的步进值 */
  step?: number
  /** 滑块的值，如果为数组，则为双向滑块 */
  modelValue?: SliderValue
}

/**
 * 滑块组件事件接口
 */
interface WdSliderEmits {
  /** 开始拖动滑块时触发 */
  dragstart: [event: SliderDragEvent]
  /** 拖动滑块过程中触发 */
  dragmove: [event: SliderDragEvent]
  /** 结束拖动滑块时触发 */
  dragend: [event: SliderDragEvent]
  /** 更新滑块值时触发，用于v-model绑定 */
  'update:modelValue': [value: SliderValue]
}

/**
 * 滑块组件暴露方法接口
 */
interface WdSliderExpose {
  /** 初始化slider宽度 */
  initSlider: () => void
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdSliderProps>(), {
  customStyle: '',
  customClass: '',
  customMinClass: '',
  customMaxClass: '',
  hideMinMax: false,
  hideLabel: false,
  disabled: false,
  inactiveColor: '#e5e5e5',
  activeColor: '',
  max: 100,
  min: 0,
  step: 1,
  modelValue: 0,
})

// 定义组件事件
const emit = defineEmits<WdSliderEmits>()

// ----------- 基础状态 -----------
const sliderBarWrapperId = ref<string>(`sliderBarWrapperId${uuid()}`)
const touch = useTouch()
const touchIndex = ref<number>(0)
const { proxy } = getCurrentInstance() as any

// ----------- 轨道尺寸状态 -----------
const trackWidth = ref<number>(0)
const trackLeft = ref<number>(0)

/**
 * 限制值在指定范围内
 */
const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

/**
 * 处理双滑块模式下的值，确保值有效
 */
const normalizeRangeValues = (value: number[]): [number, number] => {
  // 检查输入是否为有效的双滑块数组
  if (!Array.isArray(value) || value.length < 2) {
    console.warn('warning(wd-slider): range value should be an array with at least 2 elements')
    return [props.min, props.max]
  }

  const left = clamp(value[0], props.min, props.max)
  const right = clamp(value[1], props.min, props.max)

  return left > right ? [right, left] : [left, right]
}

/**
 * 获取初始值
 */
const getInitValue = (): SliderValue => {
  if (isArray(props.modelValue)) {
    return normalizeRangeValues(props.modelValue as number[])
  } else {
    return clamp(props.modelValue as number, props.min, props.max)
  }
}

// ----------- 值相关状态 -----------
const startValue = ref<SliderValue>(0)
const modelValue = ref<SliderValue>(getInitValue())

// ----------- 工具方法 -----------
/**
 * 检查组件是否处于禁用状态
 */
const isDisabled = (): boolean => {
  return props.disabled
}

/**
 * 将值对齐到最近的步长倍数
 */
const snapValueToStep = (value: number): number => {
  const stepValue = props.step <= 0 ? 1 : props.step
  if (props.step <= 0) {
    console.warn('warning(wd-slider): step must be greater than 0')
  }

  // 确保值在范围内
  value = clamp(value, props.min, props.max)

  // 计算最接近的步长倍数
  const steps = Math.round((value - props.min) / stepValue)

  // 计算最终值并处理精度问题
  return Number.parseFloat((props.min + steps * stepValue).toFixed(10))
}

/**
 * 统一更新滑块值的函数
 */
const updateValue = (value: SliderValue) => {
  let newValue: SliderValue

  if (isArray(value)) {
    newValue = normalizeRangeValues(value as number[]).map((v) => snapValueToStep(v)) as [
      number,
      number,
    ]
  } else {
    newValue = snapValueToStep(value as number)
  }

  if (!isEqual(newValue, modelValue.value)) {
    modelValue.value = newValue
  }
}

/**
 * 初始化滑块宽度
 */
const initSlider = () => {
  getRect(`#${sliderBarWrapperId.value}`, false, proxy).then((data) => {
    trackWidth.value = Number(data.width)
    trackLeft.value = Number(data.left)
  })
}

// ----------- 事件处理 -----------
/**
 * 滑块触摸开始事件处理
 */
const onSliderTouchStart = (event: any, index: number) => {
  if (isDisabled()) return

  touchIndex.value = index
  touch.touchStart(event)

  // 保存触摸开始时的滑块值
  startValue.value = deepClone(modelValue.value)

  // 触发拖动开始事件
  emit('dragstart', { value: modelValue.value })
}

/**
 * 滑块触摸移动事件处理
 */
const onSliderTouchMove = (event: any) => {
  if (isDisabled()) return

  // 更新触摸状态
  touch.touchMove(event)

  // 计算滑动距离对应的值变化
  const scope = props.max - props.min
  const diff = (touch.deltaX.value / trackWidth.value) * scope
  let newValue = deepClone(startValue.value)

  if (isArray(newValue)) {
    ;(newValue as number[])[touchIndex.value] += diff
  } else {
    newValue = (newValue as number) + diff
  }

  updateValue(newValue)

  // 触发拖动事件
  emit('dragmove', { value: modelValue.value })
}

/**
 * 滑块触摸结束事件处理
 */
const onSliderTouchEnd = () => {
  if (isDisabled()) return

  emit('dragend', { value: modelValue.value })
}

// ----------- 计算属性 -----------
/**
 * 是否为双滑块模式
 */
const isRange = computed(() => isArray(modelValue.value))

/**
 * 获取左侧滑块的值
 */
const firstValue = computed(() =>
  isRange.value ? (modelValue.value as number[])[0] : (modelValue.value as number),
)

/**
 * 获取右侧滑块的值（仅双滑块模式有效）
 */
const secondValue = computed(() => (isRange.value ? (modelValue.value as number[])[1] : 0))

/**
 * 滑块按钮样式
 */
const sliderButtonStyle = computed(() => {
  return objToStyle({
    visibility: !props.disabled ? 'visible' : 'hidden',
  })
})

/**
 * 轨道包装器样式
 */
const wrapperStyle = computed(() => {
  const style: CSSProperties = {}
  if (props.inactiveColor) {
    style.background = props.inactiveColor
  }
  return objToStyle(style)
})

/**
 * 进度条样式计算
 */
const barStyle = computed(() => {
  const style: CSSProperties = {}
  const scope = props.max - props.min

  if (scope === 0) return objToStyle(style)

  if (isRange.value) {
    // 双滑块模式
    const [left, right] = normalizeRangeValues(modelValue.value as number[])
    style.width = `${((right - left) * 100) / scope}%`
    style.left = `${((left - props.min) * 100) / scope}%`
  } else {
    // 单滑块模式
    style.width = `${(((modelValue.value as number) - props.min) * 100) / scope}%`
    style.left = '0'
  }

  // 添加自定义颜色
  if (props.activeColor) {
    style.background = props.activeColor
  }

  return objToStyle(style)
})

// ----------- 监听器 -----------
/**
 * 监听 modelValue 属性变化
 */
watch(
  () => props.modelValue,
  (newValue) => {
    if (!isEqual(newValue, modelValue.value)) {
      modelValue.value = getInitValue()
    }
  },
  { deep: true },
)

/**
 * 向上发射模型值变化
 */
watch(modelValue, (newVal) => {
  emit('update:modelValue', newVal)
})

// ----------- 生命周期钩子 -----------
onMounted(() => {
  initSlider()
})

defineExpose<WdSliderExpose>({
  initSlider,
})

/** 滑块组件实例类型 */
export type SliderInstance = ComponentPublicInstance<WdSliderProps, WdSliderExpose>
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 暗色主题样式
.wot-theme-dark {
  @include b(slider) {
    @include e(label-min, label-max) {
      color: $-dark-color;
    }

    @include e(label) {
      color: $-dark-color;
      background-color: rgba($color: $-dark-background2, $alpha: 0.5);
    }

    @include m(disabled) {
      @include me(label-min, label-max) {
        color: $-dark-color-gray;
      }
    }
  }
}

// 滑块组件样式
@include b(slider) {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  height: calc($-slider-handle-radius * 3);

  @include e(label-min, label-max) {
    font-size: $-slider-fs;
    color: $-slider-color;
  }

  @include e(label) {
    text-align: center;
    width: calc($-slider-handle-radius * 2);
    line-height: calc($-slider-handle-radius * 2);
    font-size: $-slider-fs;
    line-height: 1.2;
    color: $-slider-color;
    background-color: rgba($color: #fff, $alpha: 0.5);
    border-radius: 100%;
    position: absolute;
    bottom: calc($-slider-handle-radius * 2 + 16rpx);
  }

  @include e(bar-wrapper) {
    flex: 1;
    position: relative;
    border-radius: calc($-slider-axie-height / 2);
    background-color: #e5e5e5;
    margin: calc($-slider-handle-radius - $-slider-axie-height / 2) 0;
  }

  @include e(bar) {
    position: relative;
    border-radius: inherit;
    height: $-slider-axie-height;
    background: $-slider-line-color;
  }

  @include e(button-wrapper) {
    width: calc($-slider-handle-radius * 2);
    /* 右侧滑块按钮定位，向右偏移自身宽度的50% */
    transform: translate3d(50%, -50%, 0);
    position: absolute;
    right: 0;

    @include m(left) {
      left: 0;
      /* 左侧滑块按钮定位，向左偏移自身宽度的50% */
      transform: translate3d(-50%, -50%, 0);
    }
  }

  @include e(has-label) {
    padding-top: calc($-slider-fs * 1.2 + 16rpx);
  }

  @include e(button) {
    height: calc($-slider-handle-radius * 2);
    width: calc($-slider-handle-radius * 2);
    background: $-slider-handle-bg;
    border-radius: 100%;
    border: 1rpx solid $-slider-axie-bg;
    box-sizing: border-box;
    box-shadow: 0 4rpx 8rpx 0 rgba($color: #9b9b9b, $alpha: 0.5);
  }

  @include e(label-min) {
    margin-right: calc($-slider-handle-radius * 2);
  }

  @include e(label-max) {
    margin-left: calc($-slider-handle-radius * 2);
  }

  @include m(disabled) {
    @include me(bar) {
      opacity: 0.25;
    }
    @include me(label-min, label-max) {
      color: $-slider-disabled-color;
    }
  }
}
</style>
