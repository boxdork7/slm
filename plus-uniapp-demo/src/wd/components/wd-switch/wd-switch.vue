<!-- Switch 开关 用来打开或关闭选项。 -->
<template>
  <view
    :class="`wd-switch ${customClass} ${disabled ? 'is-disabled' : ''} ${modelValue === activeValue ? 'is-checked' : ''}`"
    :style="`${(modelValue === activeValue && activeColor) || (modelValue !== activeValue && inactiveColor) ? `background: ${modelValue === activeValue ? activeColor : inactiveColor}; border-color: ${modelValue === activeValue ? activeColor : inactiveColor};` : ''}${size ? `font-size: ${addUnit(size)};` : ''}${customStyle}`"
    @click="switchValue"
  >
    <view
      class="wd-switch__circle"
      :style="
        (modelValue === activeValue && activeColor) ||
        (modelValue !== activeValue && inactiveColor)
          ? 'box-shadow: none;'
          : ''
      "
    />
  </view>
</template>

<script lang="ts" setup>
import { onBeforeMount } from 'vue'
import { addUnit, isFunction } from '../common/util'

defineOptions({
  name: 'WdSwitch',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 切换前回调函数选项接口
 */
interface SwitchBeforeChangeOption {
  /** 新的值 */
  value: number | string | boolean
  /** 确认回调函数 */
  resolve: (pass: boolean) => void
}

/**
 * 切换前回调函数类型
 */
type SwitchBeforeChange = (option: SwitchBeforeChangeOption) => void

/**
 * 开关组件属性接口
 */
interface WdSwitchProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 绑定值 */
  modelValue: boolean | string | number
  /** 是否禁用 */
  disabled?: boolean
  /** 激活值 */
  activeValue?: boolean | string | number
  /** 非激活值 */
  inactiveValue?: boolean | string | number
  /** 激活颜色 */
  activeColor?: string
  /** 非激活颜色 */
  inactiveColor?: string
  /** 开关大小 */
  size?: string | number
  /** 在改变前执行的函数 */
  beforeChange?: SwitchBeforeChange
}

/**
 * 开关组件事件接口
 */
interface WdSwitchEmits {
  /** 值更新时触发 */
  'update:modelValue': [value: boolean | string | number]
  /** 开关状态改变时触发 */
  change: [{ value: boolean | string | number }]
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdSwitchProps>(), {
  customStyle: '',
  customClass: '',
  disabled: false,
  activeValue: true,
  inactiveValue: false,
})

// 定义组件事件
const emit = defineEmits<WdSwitchEmits>()

/**
 * 更新组件值
 * 统一处理值更新和事件触发
 */
const updateValue = (value: boolean | string | number) => {
  emit('update:modelValue', value)
  emit('change', { value })
}

/**
 * 切换开关状态
 * 处理禁用状态和前置验证逻辑
 */
const switchValue = () => {
  if (props.disabled) return

  const newValue = props.modelValue === props.activeValue ? props.inactiveValue : props.activeValue

  // 如果有前置验证函数，先执行验证
  if (props.beforeChange && isFunction(props.beforeChange)) {
    props.beforeChange({
      value: newValue,
      resolve: (pass: boolean) => {
        if (pass) {
          updateValue(newValue)
        }
      },
    })
  } else {
    updateValue(newValue)
  }
}

/**
 * 组件挂载前的处理
 * 验证初始值是否有效，如果无效则设置为非激活值
 */
onBeforeMount(() => {
  const validValues = [props.activeValue, props.inactiveValue]
  if (!validValues.includes(props.modelValue)) {
    updateValue(props.inactiveValue)
  }
})
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 开关组件样式
@include b(switch) {
  display: inline-block;
  position: relative;
  width: $-switch-width;
  height: $-switch-height;
  border-radius: $-switch-circle-size;
  background: $-switch-inactive-color;
  font-size: $-switch-size;
  transition: all 0.3s;

  // 隐藏的复选框
  @include e(checkbox) {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    margin: 0;
  }

  // 圆形按钮样式
  @include e(circle) {
    box-sizing: border-box;
    position: absolute;
    display: inline-block;
    width: $-switch-circle-size;
    height: $-switch-circle-size;
    top: 4rpx;
    left: 4rpx;
    background: #fff;
    border-radius: 50%;
    transition: left 0.3s ease-out;
    box-shadow: 0 4rpx 8rpx 0 $-switch-inactive-shadow-color;

    &::after {
      position: absolute;
      content: '';
      width: calc(200% - 4rpx);
      height: calc(200% - 4rpx);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.5);
      border: 1rpx solid $-switch-border-color;
      border-radius: 50%;
    }
  }

  // 选中状态样式
  @include when(checked) {
    background: $-switch-active-color;
    border-color: $-switch-active-color;

    .wd-switch__circle {
      left: calc($-switch-width - $-switch-circle-size - 4rpx);
      box-shadow: 0 4rpx 8rpx 0 $-switch-active-shadow-color;
    }
  }

  // 禁用状态样式
  @include when(disabled) {
    opacity: 0.5;
  }
}
</style>
