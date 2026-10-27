/**
 * 微信H5分享组合函数
 * 仅支持微信公众号H5环境
 *
 * @example
 * ```ts
 * const { share } = useWxShare()
 *
 * onMounted(async () => {
 *   await share({
 *     title: '分享标题',
 *     desc: '分享描述',
 *     imgUrl: 'https://example.com/img.jpg'
 *   })
 * })
 * ```
 */

import { ref } from 'vue'
import { isWechatOfficialH5 } from '@/utils/platform'
import { getJsApiSignature } from '@/api/app/wxShare/wxShareApi'

/** 微信JS-SDK CDN地址 */
const WX_JS_SDK_URL = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js'

/** 分享配置 */
export interface WxShareConfig {
  /** 分享标题 */
  title: string
  /** 分享描述 */
  desc: string
  /** 分享图片URL (必须是完整的HTTPS地址) */
  imgUrl: string
  /** 分享链接 (默认当前页面) */
  link?: string
  /** 分享成功回调 */
  success?: () => void
  /** 取消分享回调 */
  cancel?: () => void
}

/** SDK配置选项 */
export interface WxSdkOptions {
  /** 是否开启调试模式 */
  debug?: boolean
}

export const useWxShare = () => {
  const isReady = ref(false)
  const error = ref<string>('')

  /**
   * 加载微信JS-SDK
   */
  const loadSdk = (): Promise<void> => {
    // #ifdef H5
    return new Promise((resolve, reject) => {
      // 已加载
      if (window.__wxjs?.config) {
        resolve()
        return
      }

      // 正在加载
      const existingScript = document.querySelector(`script[src="${WX_JS_SDK_URL}"]`)
      if (existingScript) {
        existingScript.addEventListener('load', () => {
          window.__wxjs = window.wx
          resolve()
        })
        existingScript.addEventListener('error', () => reject(new Error('SDK加载失败')))
        return
      }

      // 创建script
      const script = document.createElement('script')
      script.src = WX_JS_SDK_URL
      script.async = true
      script.onload = () => {
        window.__wxjs = window.wx
        resolve()
      }
      script.onerror = () => reject(new Error('SDK加载失败'))
      document.head.appendChild(script)
    })
    // #endif
    // #ifndef H5
    return Promise.reject(new Error('仅支持H5'))
    // #endif
  }

  /**
   * 初始化微信SDK
   */
  const initSdk = async (options: WxSdkOptions = {}): Promise<boolean> => {
    // #ifdef H5
    try {
      // 检查环境
      if (!isWechatOfficialH5) {
        throw new Error('请在微信中打开')
      }

      // 加载SDK
      await loadSdk()

      if (!window.__wxjs?.config) {
        throw new Error('SDK未加载')
      }

      // 获取签名
      const url = location.href.split('#')[0]
      const [err, config] = await getJsApiSignature(url)

      if (err || !config) {
        throw new Error('获取签名失败')
      }

      // 配置SDK
      window.__wxjs.config({
        debug: options.debug || false,
        appId: config.appId,
        timestamp: config.timestamp,
        nonceStr: config.nonceStr,
        signature: config.signature,
        jsApiList: [
          'updateAppMessageShareData',
          'updateTimelineShareData',
          'onMenuShareAppMessage',
          'onMenuShareTimeline',
        ],
      })

      // 等待ready
      await new Promise<void>((resolve, reject) => {
        window.__wxjs.ready(() => {
          isReady.value = true
          resolve()
        })
        window.__wxjs.error((res: any) => {
          error.value = res.errMsg || 'SDK配置失败'
          reject(new Error(error.value))
        })
      })

      return true
    }
    catch (err: any) {
      error.value = err.message || '初始化失败'
      console.error('[useWxShare] 初始化失败:', err)
      return false
    }
    // #endif
    // #ifndef H5
    return false
    // #endif
  }

  /**
   * 配置分享内容
   */
  const setShare = (config: WxShareConfig): void => {
    // #ifdef H5
    if (!isReady.value) {
      console.warn('[useWxShare] SDK未就绪')
      return
    }

    // 处理链接
    let link = config.link || location.href
    if (!link.startsWith('http')) {
      link = location.origin + link
    }

    // 处理图片
    const imgUrl = config.imgUrl
    if (!imgUrl.startsWith('http')) {
      console.error('[useWxShare] 图片必须是完整的HTTP(S)链接:', imgUrl)
      return
    }

    const shareData = {
      title: config.title,
      desc: config.desc,
      link,
      imgUrl,
      success: config.success,
      cancel: config.cancel,
    }

    // 新接口
    window.__wxjs.updateAppMessageShareData(shareData)
    window.__wxjs.updateTimelineShareData({
      title: shareData.title,
      link: shareData.link,
      imgUrl: shareData.imgUrl,
      success: shareData.success,
      cancel: shareData.cancel,
    })

    // 兼容旧接口
    window.__wxjs.onMenuShareAppMessage?.(shareData)
    window.__wxjs.onMenuShareTimeline?.({
      title: shareData.title,
      link: shareData.link,
      imgUrl: shareData.imgUrl,
      success: shareData.success,
      cancel: shareData.cancel,
    })

    console.log('[useWxShare] 分享已配置:', { title: shareData.title, link: shareData.link })
    // #endif
  }

  /**
   * 一键分享 (自动初始化+配置)
   */
  const share = async (config: WxShareConfig, options?: WxSdkOptions): Promise<boolean> => {
    // #ifdef H5
    // 未初始化则先初始化
    if (!isReady.value) {
      const success = await initSdk(options)
      if (!success) return false
    }

    // 配置分享
    setShare(config)
    return true
    // #endif
    // #ifndef H5
    return false
    // #endif
  }

  return {
    /** SDK是否就绪 */
    isReady,
    /** 错误信息 */
    error,
    /** 初始化SDK */
    initSdk,
    /** 配置分享 */
    setShare,
    /** 一键分享(推荐) */
    share,
  }
}

// 全局类型声明
declare global {
  interface Window {
    wx: any
    __wxjs: any
  }
}
