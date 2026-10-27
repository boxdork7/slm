<!-- Form 表单每一项 -->
<template>
  <wd-cell
    custom-class="wd-form-item"
    :required="required"
    :title="label"
    :icon="icon"
    :custom-icon-class="customIconClass"
    :center="center"
    :border="border"
    :title-width="addUnit(labelWidth)"
    :is-link="isLink"
    :clickable="clickable"
    :size="size"
    :vertical="vertical"
  >
    <slot />
    <view v-if="errorMessage" class="wd-form-item__error-message">
      {{ errorMessage }}
    </view>
  </wd-cell>
</template>

<script lang="ts" setup>
import type { FormItemRule } from '../wd-form/wd-form.vue'
import { computed } from 'vue'
import { addUnit } from '../common/util'
import { useParent } from '../composables/useParent'
import WdCell from '../wd-cell/wd-cell.vue'
import { FORM_KEY } from '../wd-form/wd-form-key'

defineOptions({
  name: 'WdFormItem',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 表单项组件属性接口
 */
interface WdFormItemProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 表单字段名 */
  prop: string
  /** 表单项验证规则 */
  rules?: FormItemRule[]
  /** 是否必填 */
  required?: boolean
  /** 是否垂直居中 */
  center?: boolean
  /** 标签文本 */
  label?: string
  /** 标签宽度 */
  labelWidth?: string
  /** 是否显示右侧箭头 */
  isLink?: boolean

  // 新增属性
  /** 图标类名 */
  icon?: string
  /** 图标自定义样式类 */
  customIconClass?: string
  /** 开启点击反馈，is-link 默认开启 */
  clickable?: boolean
  /** 设置表单项大小，可选值：large */
  size?: string
  /** 表单属性，上下结构 */
  vertical?: boolean
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdFormItemProps>(), {
  customStyle: '',
  customClass: '',
  rules: () => [],
  required: false,
  center: false,
  labelWidth: '70',
  isLink: false,
  // 新增属性默认值
  icon: '',
  customIconClass: '',
  clickable: false,
  size: '',
  vertical: false,
})

// 获取父组件（Form）实例
const { parent: form, index } = useParent(FORM_KEY)

/**
 * 计算错误信息
 * 从父组件的 errorMessages 中获取当前字段的错误信息
 */
const errorMessage = computed(() => {
  if (form && props.prop && form.errorMessages && form.errorMessages[props.prop]) {
    return form.errorMessages[props.prop]
  }
  return ''
})

/**
 * 计算是否显示边框
 * 根据在父组件中的位置和父组件的 border 属性决定
 */
const border = computed(() => {
  if (index.value > 0 && form && form.props.border) {
    return true
  }
  return false
})
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 暗色主题样式
.wot-theme-dark {
  @include b(form-item) {
  }
}

// 表单项样式
@include b(form-item) {
  @include e(error-message) {
    color: $-form-item-error-message-color;
    font-size: $-form-item-error-message-font-size;
    line-height: $-form-item-error-message-line-height;
    text-align: left;
    vertical-align: middle;
  }
}
</style>
