<!-- Segmented 分段器 分段器用于展示多个选项并允许用户选择其中单个选项。 -->
<template>
  <view :class="`wd-segmented ${customClass}`" :style="customStyle">
    <view
      v-for="(option, index) in options"
      :key="index"
      :class="`wd-segmented__item is-${size} ${activeIndex === index ? 'is-active' : ''} ${
        disabled || (isObj(option) ? option.disabled : false) ? 'is-disabled' : ''
      }`"
      @click="handleClick(option, index)"
    >
      <view class="wd-segmented__item-label">
        <slot
          v-if="$slots.label"
          name="label"
          :option="isObj(option) ? option : { value: option }"
        />
        <template v-else>
          {{ isObj(option) ? option.value : option }}
        </template>
      </view>
    </view>
    <view
      :class="`wd-segmented__item--active ${activeDisabled ? 'is-disabled' : ''}`"
      :style="activeStyle"
    />
  </view>
</template>

<script lang="ts" setup>
import type { ComponentPublicInstance, CSSProperties } from 'vue'
import { computed, getCurrentInstance, onMounted, ref, watch } from 'vue'
import { addUnit, getRect, isEqual, isObj, objToStyle, pause } from '../common/util'

defineOptions({
  name: 'WdSegmented',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 分段器尺寸类型
 */
export type SegmentedType = 'large' | 'middle' | 'small'

/**
 * 分段器选项接口
 */
export interface SegmentedOption {
  /** 选中值 */
  value: string | number
  /** 是否禁用 */
  disabled?: boolean
  /** 更多数据 */
  payload?: any
}

/**
 * 分段器组件属性接口
 */
interface WdSegmentedProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 当前选中的值 */
  value: string | number
  /** 是否禁用分段器 */
  disabled?: boolean
  /** 控件尺寸，可选值：'large' | 'middle' | 'small' */
  size?: SegmentedType
  /** 数据集合 */
  options: (string | number | SegmentedOption)[]
  /** 切换选项时是否振动 */
  vibrateShort?: boolean
}

/**
 * 分段器组件事件接口
 */
interface WdSegmentedEmits {
  /** 更新选中值 */
  'update:value': [value: string | number]
  /** 选项改变时触发 */
  change: [option: SegmentedOption | { value: string | number }]
  /** 点击选项时触发 */
  click: [option: SegmentedOption | { value: string | number }]
}

/**
 * 分段器组件暴露接口
 */
interface WdSegmentedExpose {
  /** 更新滑块偏移量 */
  updateActiveStyle: (animation?: boolean) => void
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdSegmentedProps>(), {
  customStyle: '',
  customClass: '',
  disabled: false,
  size: 'middle',
  vibrateShort: false,
})

// 定义组件事件
const emit = defineEmits<WdSegmentedEmits>()

// 响应式数据：选中项索引和样式
const activeIndex = ref<number>(0)
const activeStyle = ref<string>('')

// 分段器选择器
const $item = '.wd-segmented__item'

/**
 * 计算当前激活项是否禁用
 */
const activeDisabled = computed(() => {
  return (
    props.disabled ||
    (props.options[0] && isObj(props.options[0]) ? props.options[0].disabled : false)
  )
})

// 获取当前组件实例
const { proxy } = getCurrentInstance() as any

/**
 * 更新当前选中项索引
 * 根据当前选中值查找对应的索引
 */
/**
 * 更新值并触发事件（仅在值变化时触发 change）
 */
const updateValue = (newValue: string | number, option: string | number | SegmentedOption) => {
  if (!isEqual(newValue, props.value)) {
    emit('update:value', newValue)
    emit('change', isObj(option) ? option : { value: newValue })
  }
}

const updateCurrentIndex = () => {
  const index = props.options.findIndex((option: string | number | SegmentedOption) => {
    const value = isObj(option) ? option.value : option
    return isEqual(value, props.value)
  })

  if (index >= 0) {
    activeIndex.value = index
  } else {
    // 如果未找到匹配项，默认选中第一项
    const value = isObj(props.options[0]) ? props.options[0].value : props.options[0]
    updateValue(value, props.options[0])
  }
}

/**
 * 更新滑块偏移量
 * @param animation 是否开启动画，默认开启
 */
const updateActiveStyle = (animation: boolean = true) => {
  getRect($item, true, proxy).then((rects) => {
    const rect = rects[activeIndex.value]
    const style: CSSProperties = {
      position: 'absolute',
      width: `${rect.width}px`,
      'z-index': 0,
    }

    const left = rects
      .slice(0, activeIndex.value)
      .reduce((prev, curr) => prev + Number(curr.width), 0)
    if (left) {
      style.transform = `translateX(${left}px)`
    }

    if (animation) {
      style.transition = 'all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)'
    }

    activeStyle.value = objToStyle(style)
  })
}

/**
 * 监听选中值变化
 * 当选中值发生变化时，更新当前索引、样式，并触发震动
 */
watch(
  () => props.value,
  () => {
    updateCurrentIndex()
    updateActiveStyle()
    if (props.vibrateShort) {
      uni.vibrateShort({})
    }
  },
  { immediate: false },
)

/**
 * 组件挂载后的处理
 * 初始化当前索引和激活样式
 */
onMounted(async () => {
  updateCurrentIndex()
  await pause()
  updateActiveStyle(false)
})

/**
 * 处理选项点击事件
 * @param option 被点击的选项
 * @param index 选项索引
 */
const handleClick = (option: string | number | SegmentedOption, index: number) => {
  const disabled = props.disabled || (isObj(option) ? option.disabled : false)
  if (disabled) {
    return
  }

  const value = isObj(option) ? option.value : option
  activeIndex.value = index
  updateActiveStyle()

  updateValue(value, option)
  emit('click', isObj(option) ? option : { value })
}

// 暴露组件方法
defineExpose<WdSegmentedExpose>({
  updateActiveStyle,
})
/** 分段器组件实例类型 */
export type SegmentedInstance = ComponentPublicInstance<WdSegmentedProps, WdSegmentedExpose>
</script>

<style lang="scss">
// 引入外部样式文件
@import './../common/abstracts/_mixin.scss';
@import './../common/abstracts/variable.scss';

// 暗色主题样式
.wot-theme-dark {
  @include b(segmented) {
    background: $-dark-background2;

    @include e(item) {
      color: $-dark-color3;

      @include when(active) {
        color: $-dark-color;

        @include when(disabled) {
          color: $-dark-color3;
        }
      }

      @include when(disabled) {
        color: $-dark-color-gray;
      }

      @include m(active) {
        background-color: $-color-theme;

        @include when(disabled) {
          opacity: 0.6;
        }
      }
    }
  }
}

// 分段器主体样式
@include b(segmented) {
  position: relative;
  display: flex;
  align-items: stretch;
  justify-items: flex-start;
  width: 100%;
  background-color: $-segmented-item-bg-color;
  padding: $-segmented-padding;
  border-radius: 8rpx;
  box-sizing: border-box;

  // 分段器选项样式
  @include e(item) {
    position: relative;
    text-align: center;
    border-radius: 8rpx;
    flex: 1;
    min-width: 0;
    z-index: 1;
    min-height: 56rpx;
    line-height: 56rpx;
    padding: 0 24rpx;
    font-size: 28rpx;
    color: $-segmented-item-color;
    font-weight: 400;

    // 激活状态
    @include when(active) {
      font-weight: 550;
    }

    // 大尺寸样式
    @include when(large) {
      min-height: 64rpx;
      line-height: 64rpx;
      padding: 0 24rpx;
      font-size: 32rpx;
    }

    // 小尺寸样式
    @include when(small) {
      min-height: 48rpx;
      line-height: 48rpx;
      padding: 0 14rpx;
      font-size: 24rpx;
    }

    // 禁用状态样式
    @include when(disabled) {
      cursor: no-drop;
      color: $-segmented-item-disabled-color;
    }

    // 激活背景样式
    @include m(active) {
      background-color: $-segmented-item-acitve-bg;
      border-radius: 8rpx;
      height: calc(100% - $-segmented-padding * 2);

      @include when(disabled) {
        opacity: 0.8;
      }
    }
  }

  // 选项标签样式
  @include e(item-label) {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
