// ConfigProvider 配置提供者组合式函数
import type { InjectionKey, Ref } from 'vue'
import { computed, inject, ref } from 'vue'

/**
 * ConfigProvider 注入的数据类型
 */
export interface ConfigProviderProvide {
  /** CSS 变量样式字符串 */
  style: Ref<string>
}

/**
 * ConfigProvider 注入键
 */
export const CONFIG_PROVIDER_KEY: InjectionKey<ConfigProviderProvide> = Symbol('wd-config-provider')

/**
 * 将驼峰命名转换为短横线命名
 * @param str 驼峰命名字符串
 * @returns 短横线命名字符串
 */
const kebabCase = (str: string): string => {
  str = str.replace(str.charAt(0), str.charAt(0).toLocaleLowerCase())
  return str.replace(/([a-z])([A-Z])/g, (_, p1, p2) => `${p1}-${p2.toLowerCase()}`)
}

/**
 * 将十六进制颜色值转换为RGB格式
 * @param str 十六进制颜色值
 * @returns RGB颜色值字符串或null
 */
const colorRgb = (str: string): string | null => {
  if (!str) return null

  let sColor = str.toLowerCase()
  // 十六进制颜色值的正则表达式
  const reg = /^#(?:[0-9A-F]{3}|[0-9A-F]{6})$/i

  // 如果是16进制颜色
  if (sColor && reg.test(sColor)) {
    // 处理三位颜色值
    if (sColor.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }

    // 处理六位颜色值
    const sColorChange: number[] = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(Number.parseInt(`0x${sColor.slice(i, i + 2)}`))
    }
    return sColorChange.join(',')
  }

  return null
}

/**
 * 将主题变量对象映射为 CSS 自定义属性字符串
 * @param themeVars 主题变量对象
 * @returns CSS 变量样式字符串
 */
export const mapThemeVarsToCSSVars = (themeVars: Record<string, any>): string => {
  const cssVars: Record<string, string> = {}

  Object.keys(themeVars).forEach((key) => {
    const value = themeVars[key]
    if (value !== undefined) {
      const cssKey = `--wot-${kebabCase(key)}`
      cssVars[cssKey] = value

      // 如果是颜色值，额外生成 RGB 变量
      if (typeof value === 'string') {
        const rgb = colorRgb(value)
        if (rgb) {
          cssVars[`${cssKey}-rgb`] = rgb
        }
      }
    }
  })

  return Object.entries(cssVars)
    .map(([key, value]) => `${key}: ${value}`)
    .join('; ')
}

/**
 * 在子组件中使用，注入 ConfigProvider 的主题样式
 *
 * @example
 * ```typescript
 * const { style } = useConfigProvider()
 * // style 是一个计算属性，包含 ConfigProvider 提供的 CSS 变量字符串
 * ```
 */
export const useConfigProvider = () => {
  const configProvider = inject(CONFIG_PROVIDER_KEY, null)

  const style = computed(() => {
    return configProvider?.style.value || ''
  })

  return { style }
}
