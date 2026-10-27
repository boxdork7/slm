// 国际化
import type { ComputedRef } from 'vue'
import { getPropByPath, isDef, isFunction } from '@/wd/components/common/util'
import { getCurrentMessages, getLanguage, setLanguage, languageState } from '@/locales/i18n'
import type { LanguageType } from '@/locales/i18n'
import { LanguageCode } from '@/systemConfig'

// 定义返回类型接口
interface UseI18nReturn {
  // 翻译函数
  t: (
    key: ObjKeysToUnion<LanguageType> | string,
    fieldInfoOrValue?:
      | ({
          field?: string
          comment?: string
        } & Partial<Record<LanguageCode, string>> &
          Record<string, any>)
      | string,
  ) => string

  // 检查翻译键是否存在
  te: (key: string) => boolean

  // 扩展状态（响应式）
  currentLanguage: ComputedRef<LanguageCode>
  currentLanguageName: ComputedRef<string>
  languageOptions: ComputedRef<
    Array<{
      value: LanguageCode
      label: string
      name: string
    }>
  >
  isChinese: ComputedRef<boolean>
  isEnglish: ComputedRef<boolean>

  // 扩展方法
  setLanguage: (lang: LanguageCode) => boolean
  translateRouteTitle: (title: string) => string

  // wot-ui 兼容方法
  translate: (key: string, ...args: unknown[]) => string
}

/**
 * 翻译路由标题的便捷方法
 * @example translateRouteTitle('dashboard')
 */
export const translateRouteTitle = (title: string): string => {
  if (!title) return ''

  const routeKey = `route.${title}`
  const currentMessages = getCurrentMessages()
  const message = getPropByPath(currentMessages, routeKey)

  if (isDef(message)) {
    return isFunction(message) ? message() : message
  }

  return title
}

/**
 * 增强的国际化钩子 (useI18n) - 移动端版本
 *
 * 基于 wot-ui 的翻译系统，扩展了 Vue I18n 的功能特性，
 * 并与缓存系统集成。适配移动端使用场景。
 *
 * 包含以下功能：
 * - 翻译功能:
 *   - t: 增强的翻译函数，支持多语言字段国际化
 *   - translate: wot-ui 兼容的翻译方法
 *   - translateRouteTitle: 翻译路由标题的便捷方法
 *
 * - 语言管理:
 *   - currentLanguage: 当前语言（响应式）
 *   - currentLanguageName: 当前语言的显示名称
 *   - languageOptions: 可用语言列表
 *   - setLanguage: 设置应用语言
 *
 * - 语言状态:
 *   - isChinese: 检查当前是否为中文环境
 *   - isEnglish: 检查当前是否为英文环境
 */
export const useI18n = (): UseI18nReturn => {
  /**
   * 增强的翻译函数，支持多语言字段国际化
   * @param key 翻译键名
   * @param fieldInfoOrValue 字段信息对象或多语言配置对象或中文翻译值
   * @returns 翻译后的文本
   * @example
   * <template>
   *   <!-- 1. 简单用法 -->
   *   <wd-text :text="t('userName', '用户名')" />
   *   <!-- 英文环境: "userName", 中文环境: "用户名" -->
   *
   *   <!-- 2. 使用字段信息 -->
   *   <wd-text :text="t('', { field: 'UserName', comment: '用户名' })" />
   *   <!-- 英文环境: "UserName", 中文环境: "用户名" -->
   *
   *   <!-- 3. 使用语言特定的翻译 -->
   *   <wd-text :text="t('', { [LanguageCode.zh_CN]: '用户名', [LanguageCode.en_US]: 'UserName' })" />
   *   <!-- 英文环境: "UserName", 中文环境: "用户名" -->
   *
   *   <!-- 4. 使用传统的i18n键 -->
   *   <wd-text :text="t('user.userName')" />
   *   <!-- 根据i18n配置翻译 'user.userName' 键 -->
   * </template>
   *
   * <script setup>
   * import { useI18n } from '@/composables/useI18n';
   * import { LanguageCode } from '@/systemConfig';
   *
   * const { t } = useI18n();
   * </script>
   */
  const t = (
    key: ObjKeysToUnion<LanguageType> | string,
    fieldInfoOrValue?:
      | ({
          field?: string
          comment?: string
        } & Partial<Record<LanguageCode, string>> &
          Record<string, any>)
      | string,
  ): string => {
    const currentLang = getLanguage()
    const currentMessages = getCurrentMessages()

    // 处理简单用法：t('userId', '用户名')
    if (typeof fieldInfoOrValue === 'string') {
      // 先检查键是否存在于语言文件中（如 validation.xxx）
      const message = getPropByPath(currentMessages, key)
      if (isDef(message)) {
        return isFunction(message) ? message() : message
      }

      // 如果是中文环境，直接返回第二个参数（中文翻译）
      if (currentLang === LanguageCode.zh_CN) {
        return fieldInfoOrValue
      }
      // 如果是英文或其他环境，返回第一个参数（英文）
      else {
        return key
      }
    }

    // 优先使用常规国际化处理（如果 key 存在于语言文件中）
    // 这样可以正确支持命名参数插值，如 t('key', { name: value })
    const message = getPropByPath(currentMessages, key)
    if (isDef(message)) {
      if (isFunction(message)) {
        return message(fieldInfoOrValue)
      }
      // 处理字符串模板中的 {name} 占位符替换
      if (typeof message === 'string' && fieldInfoOrValue && typeof fieldInfoOrValue === 'object') {
        return message.replace(/\{(\w+)\}/g, (_, paramKey) => {
          return fieldInfoOrValue[paramKey] !== undefined ? String(fieldInfoOrValue[paramKey]) : `{${paramKey}}`
        })
      }
      return message
    }

    // 只有 key 不存在时，才处理字段信息（用于动态字段翻译）
    if (fieldInfoOrValue) {
      const fieldInfo = fieldInfoOrValue

      // 优先级1: 使用当前语言的映射
      if (fieldInfo[currentLang]) {
        return fieldInfo[currentLang]
      }

      // 优先级2: 根据当前语言使用 field 或 comment
      if (currentLang === LanguageCode.zh_CN) {
        // 中文环境优先使用 comment
        if ('comment' in fieldInfo && fieldInfo.comment) {
          return fieldInfo.comment
        }
      } else {
        // 非中文环境优先使用 field
        if ('field' in fieldInfo && fieldInfo.field) {
          return fieldInfo.field
        }
      }

      // 优先级3: 降级策略
      if (currentLang === LanguageCode.zh_CN) {
        // 中文环境降级到 field
        if ('field' in fieldInfo && fieldInfo.field) {
          return fieldInfo.field
        }
        // 然后尝试英文
        if (fieldInfo[LanguageCode.en_US]) {
          return fieldInfo[LanguageCode.en_US]
        }
      } else {
        // 非中文环境降级到 comment
        if ('comment' in fieldInfo && fieldInfo.comment) {
          return fieldInfo.comment
        }
        // 然后尝试中文
        if (fieldInfo[LanguageCode.zh_CN]) {
          return fieldInfo[LanguageCode.zh_CN]
        }
      }

      // 优先级4: 使用任何可用的翻译
      const values = Object.entries(fieldInfo)
        .filter(([key, value]) => key !== 'field' && key !== 'comment' && value)
        .map(([_, value]) => value)

      if (values.length > 0) {
        return values[0]
      }
    }

    // 按钮键降级处理
    if (typeof key === 'string' && key.startsWith('button.') && key.split('.').length > 2) {
      // 提取操作类型（最后一部分）
      const parts = key.split('.')
      const action = parts[parts.length - 1]
      const genericButtonKey = `button.${action}`

      // 尝试使用通用按钮键
      const genericMessage = getPropByPath(currentMessages, genericButtonKey)
      if (isDef(genericMessage)) {
        return isFunction(genericMessage) ? genericMessage() : genericMessage
      }
    }

    // 无翻译，返回键名本身
    return key
  }

  /**
   * wot-ui 兼容的翻译方法
   * 直接使用业务语言包进行翻译，与 wot-ui 的 useTranslate 保持兼容
   */
  const translate = (key: string, ...args: unknown[]) => {
    const currentMessages = getCurrentMessages()
    const message = getPropByPath(currentMessages, key)

    // 处理翻译结果
    return isFunction(message)
      ? message(...args) // 如果是函数，调用并传入参数
      : isDef(message)
        ? message // 如果有定义，直接返回
        : key // 否则返回键名作为降级处理
  }

  /**
   * 检查翻译键是否存在
   * @param key 翻译键名
   * @returns 是否存在该翻译
   * @example
   * if (te('dict.sys_user_gender.0')) {
   *   // 存在该翻译键
   * }
   */
  const te = (key: string): boolean => {
    const currentMessages = getCurrentMessages()
    const message = getPropByPath(currentMessages, key)
    return isDef(message)
  }

  return {
    // 强类型的翻译函数
    t,

    // 检查翻译键是否存在
    te,

    // 扩展状态（从 languageState 获取响应式数据）
    currentLanguage: languageState.current,
    currentLanguageName: languageState.currentName,
    languageOptions: languageState.options,
    isChinese: languageState.isChinese,
    isEnglish: languageState.isEnglish,

    // 扩展方法
    setLanguage,
    translateRouteTitle,

    // wot-ui 兼容方法
    translate,
  }
}

/**
 * 对象键名转联合类型
 * { a: 1, b: { ba: 1, bb: 2} } ---> a | b.ba | b.bb
 */
export type ObjKeysToUnion<T, Depth extends number[] = [0, 1, 2, 3]> = Depth['length'] extends 4
  ? never
  : T extends object
    ? {
        [K in keyof T]: `${K & string}${T[K] extends object ? `.${ObjKeysToUnion<T[K], [...Depth, 0]>}` : ''}`
      }[keyof T]
    : never
