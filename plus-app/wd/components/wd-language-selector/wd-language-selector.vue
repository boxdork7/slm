<!-- Language Selector 语言选择器 提供语言切换功能的弹出选择器。 -->
<template>
  <wd-action-sheet
    v-model="visible"
    :title="translate('title')"
    :actions="languageActions"
    @select="handleLanguageSelect"
    @cancel="handleCancel"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useTranslate } from '../composables/useTranslate'
import { useToast } from '../wd-toast/useToast'
import wdActionSheet from '../wd-action-sheet/wd-action-sheet.vue'
import { getLanguage, setLanguage, languageState } from '@/locales/i18n'
import type { LanguageCode } from '@/systemConfig'

defineOptions({
  name: 'WdLanguageSelector',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

/**
 * 语言选择器组件属性接口
 */
interface WdLanguageSelectorProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string
  /** 控制显示隐藏 */
  modelValue: boolean
  /** 自定义语言选项，如果不提供则使用默认配置 */
  languageOptions?: Array<{
    value: string
    label: string
    name: string
  }>
  /** 选中项颜色 */
  selectedColor?: string
  /** 默认项颜色 */
  defaultColor?: string
}

/**
 * 语言选择器组件事件接口
 */
interface WdLanguageSelectorEmits {
  /** 更新显示状态 */
  'update:modelValue': [value: boolean]
  /** 语言切换事件 */
  change: [language: string]
  /** 取消选择事件 */
  cancel: []
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdLanguageSelectorProps>(), {
  customStyle: '',
  customClass: '',
  modelValue: false,
  selectedColor: '#4F86FD',
  defaultColor: '#333333',
})

// 定义组件事件
const emit = defineEmits<WdLanguageSelectorEmits>()

// 国际化翻译函数
const { translate } = useTranslate('languageSelector')

// Toast 提示
const toast = useToast()

// 控制显示隐藏
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// 当前语言
const currentLanguage = computed(() => getLanguage())

// 语言选项 - 优先使用传入的选项，否则使用默认配置
const finalLanguageOptions = computed(() => {
  return props.languageOptions || languageState.options.value
})

// 转换为 ActionSheet 的 actions 格式
const languageActions = computed(() => {
  return finalLanguageOptions.value.map((option) => ({
    label: option.label,
    value: option.value,
    // 当前选中的语言显示不同颜色
    color: currentLanguage.value === option.value ? props.selectedColor : props.defaultColor,
  }))
})

// 处理语言选择
const handleLanguageSelect = (data: any) => {
  const selectedLang = data.value as LanguageCode

  if (selectedLang === currentLanguage.value) {
    visible.value = false
    return
  }

  const success = setLanguage(selectedLang)
  if (success) {
    emit('change', selectedLang)
    toast.success(translate('changeSuccess'))
    visible.value = false
  } else {
    toast.error(translate('changeFailed'))
  }
}

// 处理取消
const handleCancel = () => {
  visible.value = false
  emit('cancel')
}
</script>

<style lang="scss">
// 引入外部样式文件
@import './../common/abstracts/_mixin.scss';
@import './../common/abstracts/variable.scss';

// 暗色主题样式
.wot-theme-dark {
  // 如果需要特殊的暗色主题样式，可以在这里添加
}

// 语言选择器样式
@include b(language-selector) {
  // 基础样式继承自 action-sheet，通常不需要额外样式
  // 如果需要自定义样式可以在这里添加
}
</style>
