<!-- Form 表单 用于数据录入、校验，支持输入框、单选框、复选框、文件上传等类型，
常见的 form 表单为单元格形式的展示，即左侧为表单的标题描述，右侧为表单的输入。 -->
<template>
  <view :class="`wd-form ${customClass}`" :style="customStyle">
    <slot />
    <wd-toast v-if="errorType === 'toast'" selector="wd-form-toast" />
  </view>
</template>

<script lang="ts" setup>
import type { ComponentPublicInstance } from 'vue'
import { reactive } from 'vue'
import { deepClone, getPropByPath, isArray, isDef, isPromise, isString } from '../common/util'
import { useChildren } from '../composables/useChildren'
import { useToast } from '../wd-toast/useToast'
import wdToast from '../wd-toast/wd-toast.vue'
import { FORM_KEY } from './wd-form-key'

defineOptions({
  name: 'WdForm',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 表单验证规则类型
 */
export interface FormRules {
  [key: string]: FormItemRule[]
}

/**
 * 错误信息类型
 */
export interface ErrorMessage {
  prop: string
  message: string
}

/**
 * 表单项验证规则接口
 */
export interface FormItemRule {
  [key: string]: any

  /** 是否必填 */
  required?: boolean
  /** 错误提示信息 */
  message: string
  /** 正则表达式验证 */
  pattern?: RegExp
  /** 最小值/最小长度 */
  min?: number
  /** 最大值/最大长度 */
  max?: number
  /** 自定义验证函数 */
  validator?: (
    value: any,
    rule: FormItemRuleWithoutValidator,
  ) => boolean | Promise<string> | Promise<boolean> | Promise<void> | Promise<unknown>
}

/**
 * 不含验证函数的规则类型
 */
export type FormItemRuleWithoutValidator = Omit<FormItemRule, 'validator'>

/**
 * 表单组件属性接口
 */
interface WdFormProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 表单数据对象 */
  model: Record<string, any>
  /** 表单验证规则 */
  rules?: FormRules
  /** 是否在输入时重置表单校验信息 */
  resetOnChange?: boolean
  /** 错误提示类型 */
  errorType?: 'toast' | 'message' | 'none'
}

/**
 * 表单组件暴露方法接口
 */
interface WdFormExpose {
  /** 表单校验 */
  validate: (prop?: string | string[]) => Promise<{
    valid: boolean
    errors: ErrorMessage[]
  }>
  /** 重置表单项的验证提示 */
  reset: () => void
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdFormProps>(), {
  customStyle: '',
  customClass: '',
  rules: () => ({}),
  resetOnChange: true,
  errorType: 'message',
})

// Toast 实例
const { show: showToast } = useToast('wd-form-toast')

// 子组件管理
const { children, linkChildren } = useChildren(FORM_KEY)

// 错误信息对象
const errorMessages = reactive<Record<string, string>>({})

/**
 * 清除错误信息
 * @param prop 指定字段名，不传则清除所有
 */
const clearMessage = (prop?: string) => {
  if (prop) {
    errorMessages[prop] = ''
  } else {
    Object.keys(errorMessages).forEach((key) => {
      errorMessages[key] = ''
    })
  }
}

/**
 * 清除指定字段的错误信息
 * @param prop 字段名
 */
const clearFieldMessage = (prop: string) => {
  if (prop && errorMessages[prop]) {
    errorMessages[prop] = ''
  }
}

/**
 * 提供数据给子组件
 */
linkChildren({
  props,
  errorMessages,
  children,
  clearFieldMessage,
})

/**
 * 合并子组件的 rules 到父组件的 rules
 */
const getMergeRules = () => {
  const mergedRules: FormRules = deepClone(props.rules)
  const childrenProps = children.map((child) => child.prop)

  // 过滤掉在 children 中不存在对应子组件的规则
  Object.keys(mergedRules).forEach((key) => {
    if (!childrenProps.includes(key)) {
      delete mergedRules[key]
    }
  })

  children.forEach((item) => {
    if (isDef(item.prop) && isDef(item.rules) && item.rules.length) {
      if (mergedRules[item.prop]) {
        mergedRules[item.prop] = [...mergedRules[item.prop], ...item.rules]
      } else {
        mergedRules[item.prop] = item.rules
      }
    }
  })

  return mergedRules
}

/**
 * 显示错误信息
 * @param errors 错误信息数组
 */
const showMessage = (errors: ErrorMessage[]) => {
  const childrenProps = children.map((e) => e.prop).filter(Boolean)
  const messages = errors.filter((error) => error.message && childrenProps.includes(error.prop))

  if (messages.length) {
    messages.sort((a, b) => {
      return childrenProps.indexOf(a.prop) - childrenProps.indexOf(b.prop)
    })

    if (props.errorType === 'toast') {
      showToast(messages[0].message)
    } else if (props.errorType === 'message') {
      messages.forEach((error) => {
        errorMessages[error.prop] = error.message
      })
    }
  }
}

/**
 * 表单校验
 * @param prop 指定校验字段或字段数组
 */
const validate = async (
  prop?: string | string[],
): Promise<{ valid: boolean; errors: ErrorMessage[] }> => {
  const errors: ErrorMessage[] = []
  let valid: boolean = true
  const promises: Promise<void>[] = []
  const formRules: FormRules = getMergeRules()
  const propsToValidate = isArray(prop) ? prop : isDef(prop) ? [prop] : []
  const rulesToValidate: FormRules =
    propsToValidate.length > 0
      ? propsToValidate.reduce((acc, key) => {
          if (formRules[key]) {
            acc[key] = formRules[key]
          }
          return acc
        }, {} as FormRules)
      : formRules

  for (const propName in rulesToValidate) {
    const rules = rulesToValidate[propName]
    const value = getPropByPath(props.model, propName)

    if (rules && rules.length > 0) {
      for (const rule of rules) {
        if (rule.required && (!isDef(value) || value === '')) {
          errors.push({
            prop: propName,
            message: rule.message,
          })
          valid = false
          break
        }

        // 如果值为空且不是必填，跳过后续校验
        if (!isDef(value) || value === '') {
          continue
        }

        // 正则表达式校验
        if (rule.pattern && !rule.pattern.test(value)) {
          errors.push({
            prop: propName,
            message: rule.message,
          })
          valid = false
          break
        }

        // min 校验
        if (isDef(rule.min)) {
          let checkValue: number

          if (typeof value === 'string') {
            // 字符串类型检查长度
            checkValue = value.length
          } else if (typeof value === 'number') {
            // 数字类型检查数值大小
            checkValue = value
          } else if (isArray(value)) {
            // 数组类型检查数组长度
            checkValue = value.length
          } else {
            // 其他类型转换为字符串后检查长度
            checkValue = String(value).length
          }

          if (checkValue < rule.min) {
            errors.push({
              prop: propName,
              message: rule.message,
            })
            valid = false
            break
          }
        }

        // max 校验
        if (isDef(rule.max)) {
          let checkValue: number

          if (typeof value === 'string') {
            // 字符串类型检查长度
            checkValue = value.length
          } else if (typeof value === 'number') {
            // 数字类型检查数值大小
            checkValue = value
          } else if (isArray(value)) {
            // 数组类型检查数组长度
            checkValue = value.length
          } else {
            // 其他类型转换为字符串后检查长度
            checkValue = String(value).length
          }

          if (checkValue > rule.max) {
            errors.push({
              prop: propName,
              message: rule.message,
            })
            valid = false
            break
          }
        }

        // 自定义验证函数
        const { validator, ...ruleWithoutValidator } = rule
        if (validator) {
          const result = validator(value, ruleWithoutValidator)
          if (isPromise(result)) {
            promises.push(
              result
                .then((res) => {
                  if (typeof res === 'string') {
                    errors.push({
                      prop: propName,
                      message: res,
                    })
                    valid = false
                  } else if (typeof res === 'boolean' && !res) {
                    errors.push({
                      prop: propName,
                      message: rule.message,
                    })
                    valid = false
                  }
                })
                .catch((error?: string | Error) => {
                  const message = isDef(error)
                    ? isString(error)
                      ? error
                      : error.message || rule.message
                    : rule.message
                  errors.push({ prop: propName, message })
                  valid = false
                }),
            )
          } else {
            if (!result) {
              errors.push({
                prop: propName,
                message: rule.message,
              })
              valid = false
            }
          }
        }
      }
    }
  }

  await Promise.all(promises)

  showMessage(errors)

  if (valid) {
    if (propsToValidate.length) {
      propsToValidate.forEach(clearMessage)
    } else {
      clearMessage()
    }
  }

  return {
    valid,
    errors,
  }
}

/**
 * 重置表单项的验证提示
 */
const reset = () => {
  clearMessage()
}

// 暴露给父组件的方法
defineExpose<WdFormExpose>({
  validate,
  reset,
})

/** 表单组件实例类型 */
export type FormInstance = ComponentPublicInstance<WdFormProps, WdFormExpose>
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 暗色主题样式
.wot-theme-dark {
  @include b(form) {
  }
}

// 表单容器样式
@include b(form) {
}
</style>
