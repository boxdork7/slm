/**
 * 主题配置管理组合函数
 * @description 提供统一的主题配置管理，支持默认主题、全局覆盖和局部定制
 * @author Your Name
 * @since 2024-06-24
 */

import type { ConfigProviderThemeVars } from '@/wd'

/**
 * 全局主题覆盖状态
 * @description 存储全局主题覆盖配置，所有组件实例共享
 */
const globalThemeOverrides = ref<Partial<ConfigProviderThemeVars>>({})

/**
 * 默认主题配置
 * @description wot-design-uni 组件库的完整主题配置
 * 优先级：最低（会被全局覆盖和局部覆盖）
 */
const DEFAULT_THEME: ConfigProviderThemeVars = {
  // ========== 基础色彩 ==========
  /** 主题色调 */
  colorTheme: '#409EFF',
  /** 成功色调 */
  colorSuccess: '#52C41A',
  /** 警告色调 */
  colorWarning: '#FFBA00',
  /** 危险色调 */
  colorDanger: '#F56C6C',

  // ========== Loading 组件 ==========
  /** Loading 大小 */
  loadingSize: '40rpx',

  // ========== MessageBox 组件 ==========
  /** MessageBox 标题颜色 */
  messageBoxTitleColor: '#333333',
  /** MessageBox 内容颜色 */
  messageBoxContentColor: '#666666',

  // ========== Notify 组件 ==========
  /** Notify 内边距 */
  notifyPadding: '24rpx 32rpx',
  /** Notify 字体大小 */
  notifyFontSize: '28rpx',

  // ========== 输入框组件 ==========

  // ========== 导航栏 ==========
  /** 导航栏标题字体大小 */
  navbarTitleFontSize: '32rpx',
  /** 导航栏标题字体粗细 */
  navbarTitleFontWeight: 'normal',
}

/**
 * 主题配置管理 Hook
 * @param localOverrides 局部主题覆盖配置，优先级最高
 * @returns 主题配置对象和相关操作方法
 *
 * @example
 * ```typescript
 * // 基础使用
 * const { themeVars } = useTheme()
 *
 * // 局部定制
 * const { themeVars } = useTheme({
 *   buttonPrimaryBgColor: '#ff4757',
 *   toastPadding: '8px 16px'
 * })
 *
 * // 全局主题管理
 * const { setGlobalTheme, resetGlobalTheme } = useTheme()
 * setGlobalTheme({ colorTheme: 'dark' })
 * ```
 */
export const useTheme = (localOverrides?: Partial<ConfigProviderThemeVars>) => {
  /**
   * 响应式主题配置
   * @description 按优先级合并配置：默认主题 < 全局覆盖 < 局部覆盖
   */
  const themeVars = computed<ConfigProviderThemeVars>(() => ({
    ...DEFAULT_THEME,
    ...globalThemeOverrides.value,
    ...localOverrides,
  }))

  /**
   * 设置全局主题覆盖
   * @param overrides 要覆盖的主题配置项
   * @description 会与现有全局配置合并，不会完全替换
   *
   * @example
   * ```typescript
   * setGlobalTheme({
   *   colorTheme: 'dark',
   *   buttonPrimaryBgColor: '#2d2d2d'
   * })
   * ```
   */
  const setGlobalTheme = (overrides: Partial<ConfigProviderThemeVars>) => {
    globalThemeOverrides.value = {
      ...globalThemeOverrides.value,
      ...overrides,
    }
  }

  /**
   * 重置全局主题覆盖
   * @description 清空所有全局主题覆盖，恢复到默认主题
   *
   * @example
   * ```typescript
   * resetGlobalTheme() // 清空全局覆盖，回到默认主题
   * ```
   */
  const resetGlobalTheme = () => {
    globalThemeOverrides.value = {}
  }

  /**
   * 获取当前完整主题配置
   * @returns 当前生效的完整主题配置对象
   * @description 返回合并后的最终主题配置，用于调试或外部使用
   *
   * @example
   * ```typescript
   * const currentConfig = getCurrentTheme()
   * console.log('当前主题配置:', currentConfig)
   * ```
   */
  const getCurrentTheme = () => themeVars.value

  return {
    /** 响应式主题配置变量，直接绑定到 wd-config-provider */
    themeVars,
    /** 设置全局主题覆盖 */
    setGlobalTheme,
    /** 重置全局主题覆盖 */
    resetGlobalTheme,
    /** 获取当前完整主题配置 */
    getCurrentTheme,
  }
}
