// 翻译工具
import { camelCase, getPropByPath, isDef, isFunction } from '../common/util'
import Locale from '../../locale'

/**
 * 国际化翻译组合式函数
 *
 * 提供国际化文本翻译功能，支持：
 * - 基于键值的文本翻译
 * - 命名空间前缀
 * - 函数式翻译（支持参数）
 * - 降级处理（翻译失败时返回键名）
 *
 * @param name - 组件名称，用作翻译键的前缀
 * @returns 包含翻译函数的对象
 *
 * @example
 * ```typescript
 * // 不使用前缀
 * const { translate } = useTranslate()
 * translate('common.ok') // 翻译 'common.ok'
 *
 * // 使用组件名称作为前缀
 * const { translate } = useTranslate('button')
 * translate('text') // 实际翻译 'button.text'
 *
 * // 支持参数的翻译
 * translate('welcome', 'John') // 如果翻译文本是函数，会传入参数
 * ```
 */
export const useTranslate = (name?: string) => {
  // 生成翻译键前缀，如果提供了组件名称则转为驼峰格式并添加点号
  const prefix = name ? `${camelCase(name)}.` : ''

  /**
   * 翻译函数
   *
   * @param key - 翻译键名
   * @param args - 传递给翻译函数的参数（当翻译文本是函数时）
   * @returns 翻译后的文本或原键名
   */
  const translate = (key: string, ...args: unknown[]) => {
    // 获取当前语言的翻译消息
    const currentMessages = Locale.messages()

    // 根据前缀和键名获取翻译文本
    const message = getPropByPath(currentMessages, prefix + key)

    // 处理翻译结果
    return isFunction(message)
      ? message(...args) // 如果是函数，调用并传入参数
      : isDef(message)
        ? message // 如果有定义，直接返回
        : `${prefix}${key}` // 否则返回完整的键名作为降级处理
  }

  return {
    translate, // 翻译函数
  }
}
