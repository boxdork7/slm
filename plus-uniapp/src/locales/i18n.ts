// 移动端国际化配置
import { LanguageCode } from '@/systemConfig'
import { cache } from '@/utils/cache'
import { ref, computed } from 'vue'
import zh_CN from './zh-CN'
import en_US from './en-US'
import Locale from '@/wd/locale' // wot-ui的Locale管理器

// 语言缓存键
const LANGUAGE_CACHE_KEY = 'app_language'

// 语言包映射
const messages = {
  [LanguageCode.zh_CN]: zh_CN,
  [LanguageCode.en_US]: en_US,
}

// 当前语言状态（响应式）
const currentLanguage = ref<LanguageCode>(LanguageCode.zh_CN)

/**
 * 从缓存获取语言设置
 */
const getLanguageFromCache = (): LanguageCode => {
  try {
    const cachedLanguage = cache.get<LanguageCode>(LANGUAGE_CACHE_KEY)
    if (cachedLanguage && Object.values(LanguageCode).includes(cachedLanguage)) {
      return cachedLanguage
    }
  } catch (error) {
    console.warn('[i18n] 读取缓存语言失败:', error)
  }

  // 尝试获取系统语言
  try {
    const systemInfo = uni.getSystemInfoSync()
    const systemLanguage = systemInfo.language

    // 匹配系统语言
    if (systemLanguage.includes('zh') || systemLanguage.includes('cn')) {
      return LanguageCode.zh_CN
    } else if (systemLanguage.includes('en')) {
      return LanguageCode.en_US
    }
  } catch (error) {
    console.warn('[i18n] 获取系统语言失败:', error)
  }

  // 默认返回中文
  return LanguageCode.zh_CN
}

/**
 * 设置语言到缓存
 * @param language 语言代码
 */
export const setLanguageToCache = (language: LanguageCode): boolean => {
  try {
    return cache.set(LANGUAGE_CACHE_KEY, language)
  } catch (error) {
    console.error('[i18n] 设置语言到缓存失败:', error)
    return false
  }
}

/**
 * 获取当前语言
 */
export const getLanguage = (): LanguageCode => {
  return currentLanguage.value
}

/**
 * 获取当前语言的翻译消息
 */
export const getCurrentMessages = () => {
  return messages[currentLanguage.value] || messages[LanguageCode.zh_CN]
}

/**
 * 设置语言
 */
export const setLanguage = (language: LanguageCode): boolean => {
  if (!Object.values(LanguageCode).includes(language)) {
    console.warn(`Language ${language} is not supported`)
    return false
  }

  try {
    // 更新当前语言状态
    currentLanguage.value = language

    // 同步更新 wot-ui 的语言设置
    // 注意：这里假设 wot-ui 有对应的语言包
    // 如果 wot-ui 的语言代码格式不同，需要做映射转换
    Locale.use(language)

    // 保存到缓存
    const success = setLanguageToCache(language)

    if (success) {
      console.log(`[i18n] 语言切换成功: ${language}`)
      return true
    } else {
      console.error('[i18n] 保存语言设置到缓存失败')
      return false
    }
  } catch (error) {
    console.error('[i18n] 设置语言失败:', error)
    return false
  }
}

/**
 * 初始化语言设置
 */
export const initLanguage = (): void => {
  const cachedLanguage = getLanguageFromCache()
  setLanguage(cachedLanguage)
}

/**
 * 语言状态（响应式）
 */
export const languageState = {
  // 当前语言
  current: computed(() => currentLanguage.value),

  // 当前语言名称
  currentName: computed(() => {
    switch (currentLanguage.value) {
      case LanguageCode.zh_CN:
        return '简体中文'
      case LanguageCode.en_US:
        return 'English'
      default:
        return currentLanguage.value
    }
  }),

  // 是否为中文
  isChinese: computed(() => currentLanguage.value === LanguageCode.zh_CN),

  // 是否为英文
  isEnglish: computed(() => currentLanguage.value === LanguageCode.en_US),

  // 语言选项
  options: computed(() => [
    {
      value: LanguageCode.zh_CN,
      label: '简体中文',
      name: '简体中文',
    },
    {
      value: LanguageCode.en_US,
      label: 'English',
      name: 'English',
    },
  ]),
}

// 导出类型
export type LanguageType = typeof zh_CN

// 自动初始化
initLanguage()
