/**
 * 国际化语言管理模块 - 提供多语言支持的核心功能
 *
 * 功能说明:
 * - 管理应用的多语言配置和切换
 * - 支持动态加载和添加新的语言包
 * - 提供响应式的当前语言状态管理
 * - 默认支持中文简体(zh-CN)，可扩展其他语言
 *
 * 使用示例:
 * import Locale, { useCurrentLang } from './locale'
 *
 * // 切换语言
 * Locale.use('en-US', enUSMessages)
 *
 * // 添加新语言包
 * Locale.add({ 'ja-JP': jaJPMessages })
 *
 * // 获取当前语言包
 * const currentMessages = Locale.messages()
 *
 * // 监听当前语言变化
 * const currentLang = useCurrentLang()
 */
import { reactive, ref } from 'vue'
import { deepAssign } from '../components/common/util'
import arSA from './lang/ar-SA' // 阿拉伯语
import deDE from './lang/de-DE' // 德语
import enUS from './lang/en-US' // 英语
import esES from './lang/es-ES' // 西班牙语
import frFR from './lang/fr-FR' // 法语
import jaJP from './lang/ja-JP' // 日语
import koKR from './lang/ko-KR' // 韩语
import ptPT from './lang/pt-PT' // 葡萄牙语
import ruRU from './lang/ru-RU' // 俄语
import thTH from './lang/th-TH' // 泰语
import trTR from './lang/tr-TR' // 土耳其语
import viVN from './lang/vi-VN' // 越南语
import zhCN from './lang/zh-CN' // 简体中文
import zhHK from './lang/zh-HK' // 繁体中文(香港)
import zhTW from './lang/zh-TW' // 繁体中文(台湾)

// 定义消息对象类型 - 支持嵌套的键值对结构
type Message = Record<string, any>
// 定义多语言消息集合类型 - 以语言代码为键的消息对象集合
type Messages = Record<string, Message>

// 当前激活的语言代码，默认为中文简体
const lang = ref<string>('zh-CN')
// 响应式的多语言消息存储，包含所有已加载的语言包
const messages = reactive<Messages>({
  'ar-SA': arSA, // 阿拉伯语(沙特阿拉伯)
  'de-DE': deDE, // 德语(德国)
  'en-US': enUS, // 英语(美国)
  'es-ES': esES, // 西班牙语(西班牙)
  'fr-FR': frFR, // 法语(法国)
  'ja-JP': jaJP, // 日语(日本)
  'ko-KR': koKR, // 韩语(韩国)
  'pt-PT': ptPT, // 葡萄牙语(葡萄牙)
  'ru-RU': ruRU, // 俄语(俄罗斯)
  'th-TH': thTH, // 泰语(泰国)
  'tr-TR': trTR, // 土耳其语(土耳其)
  'vi-VN': viVN, // 越南语(越南)
  'zh-CN': zhCN, // 简体中文(中国大陆)
  'zh-HK': zhHK, // 繁体中文(香港)
  'zh-TW': zhTW, // 繁体中文(台湾)
})

/**
 * 国际化语言管理器
 * 提供语言切换、消息获取、语言包管理等核心功能
 */
export const Locale = {
  /**
   * 获取当前语言的消息对象
   * @returns {Message} 当前激活语言的所有翻译文本
   */
  messages(): Message {
    return messages[lang.value]
  },

  /**
   * 切换到指定语言
   * @param {string} newLang - 目标语言代码 (如: 'en-US', 'ja-JP')
   * @param {Message} newMessage - 可选的新语言包数据
   */
  use(newLang: string, newMessage?: Message) {
    lang.value = newLang
    if (newMessage) {
      this.add({ [newLang]: newMessage })
    }
  },

  /**
   * 添加或更新语言包
   * @param {Messages} newMessages - 要添加的语言包对象，支持多个语言同时添加
   */
  add(newMessages: Messages = {}) {
    deepAssign(messages, newMessages)
  },
}

/**
 * 获取当前语言的响应式引用
 * 可用于在组件中监听语言变化或获取当前激活的语言代码
 */
export const useCurrentLang = () => lang

export default Locale
