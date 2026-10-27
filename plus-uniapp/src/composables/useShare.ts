/**
 * 小程序分享功能组合函数 - 页面级单例模式
 * 支持微信小程序、支付宝小程序等多平台
 * 同一页面内共享状态，不同页面间隔离状态
 *
 * 使用方式：
 * 1. const { handleShareAppMessage, handleShareTimeline } = useShare()
 * defineExpose({
 *   onShareAppMessage: handleShareAppMessage,
 *   onShareTimeline: handleShareTimeline,
 * })
 * 2. 自定义配置：const { handleShareAppMessage, handleShareTimeline } = useShare({ title: '自定义标题' })
 * 3. 动态内容：const { setShareData, handleShareAppMessage } = useShare()
 *
 * @author 抓蛙师
 * @date 2025-09-11
 */

import { ref, readonly, onUnmounted } from 'vue'
import { getCurrentRoute } from '@/utils/route' // 引入路由工具函数
import { useToast } from '@/wd'

/**
 * 分享配置接口
 */
interface ShareConfig {
  /** 分享标题 */
  title: string
  /** 分享路径，包含参数 */
  path: string
  /** 分享图片地址 */
  imageUrl: string
}

/**
 * 页面分享配置接口
 */
interface PageShareConfig {
  /** 页面分享标题 */
  title?: string
  /** 页面分享图片 */
  imageUrl?: string
  /** 是否允许分享到朋友圈 */
  enableTimeline?: boolean
}

/**
 * 动态设置分享数据的接口
 */
interface ShareData {
  /** 动态标题 */
  title?: string
  /** 动态图片 */
  imageUrl?: string
  /** 额外的路径参数 */
  extraParams?: Record<string, any>
  /** 是否覆盖现有路径 */
  overridePath?: boolean
}

/**
 * 分享事件回调参数
 */
interface ShareEventResult {
  title: string
  path: string
  imageUrl?: string
}

/**
 * 默认分享配置
 * 当页面没有自定义配置时使用
 */
const DEFAULT_SHARE: ShareConfig = {
  title: '发现更多精彩',
  path: '/pages/index/index',
  imageUrl: '',
} as const

/**
 * 页面分享配置映射表
 * 键为页面路径，值为该页面的分享配置
 */
const PAGE_SHARE_CONFIG: Record<string, PageShareConfig> = {
  // 首页配置
  '/pages/index/index': {
    title: '首页',
    imageUrl: '',
    enableTimeline: true,
  },
  // 产品详情页配置
  '/pages/product/detail': {
    title: '产品详情',
    imageUrl: '',
    enableTimeline: true,
  },
  // 用户中心配置 - 私密页面，不允许分享到朋友圈
  '/pages/user/profile': {
    title: '个人中心',
    imageUrl: '',
    enableTimeline: false,
  },
  // 文章详情页配置
  '/pages/article/detail': {
    title: '文章详情',
    imageUrl: '',
    enableTimeline: true,
  },
  // 可继续添加其他页面配置...
} as const

/**
 * 页面级分享实例存储
 * 键为页面路径，值为该页面的分享实例
 */
const pageShareInstances = new Map()

/**
 * 构建 URL 查询参数字符串
 * @param params - 参数对象
 * @returns 格式化的查询字符串，如 "?id=123&type=product"
 */
const buildQueryString = (params: Record<string, any>): string => {
  // 过滤掉空值参数
  if (!params || Object.keys(params).length === 0) return ''

  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&')

  return queryString ? `?${queryString}` : ''
}

/**
 * 获取当前页面完整信息
 * @returns 页面路径和参数
 */
const getCurrentPageInfo = (): { path: string; query: Record<string, any> } => {
  try {
    // 使用路由工具函数获取当前页面的完整路由信息
    const currentRoute = getCurrentRoute()
    return {
      path: currentRoute.path,
      query: currentRoute.query,
    }
  } catch (error) {
    console.warn('获取当前页面信息失败:', error)
    return {
      path: DEFAULT_SHARE.path,
      query: {},
    }
  }
}

/**
 * 获取页面唯一标识
 * 用于区分不同页面的分享实例
 * @returns 页面标识符
 */
const getPageKey = (): string => {
  const { path } = getCurrentPageInfo()
  return path
}

/**
 * 创建分享实例
 * 每个页面只会创建一个实例，多个组件共享
 * @param customConfig - 自定义分享配置
 * @returns 分享实例对象
 */
const createShareInstance = (customConfig?: PageShareConfig) => {
  const userStore = useUserStore()
  // 使用项目统一封装的 toast，避免直接调用 uni.showToast 绕过主题
  const toast = useToast()

  /**
   * 当前分享配置的响应式引用
   * 会根据页面配置和自定义配置自动初始化
   */
  const shareConfig = ref<ShareConfig>({ ...DEFAULT_SHARE })

  /**
   * 页面配置信息
   */
  const pageConfig = ref<PageShareConfig>({})

  /**
   * 保存 onLoad 参数供后续使用
   */
  const onLoadOptions = ref<Record<string, any>>({})

  /**
   * 保存动态设置的分享数据
   */
  const dynamicShareData = ref<ShareData>({})

  /**
   * 分享配置是否已经初始化
   */
  const isInitialized = ref(false)

  /**
   * 构建分享参数
   * @param baseParams - 基础参数
   * @param extraParams - 额外参数
   * @param overridePath - 是否覆盖现有路径
   * @returns 合并后的分享参数
   */
  const buildShareParams = (
    baseParams: Record<string, any> = {},
    extraParams: Record<string, any> = {},
    overridePath: boolean = false,
  ): Record<string, any> => {
    const userId = userStore.userInfo?.userId
    const finalBaseParams = overridePath ? {} : baseParams

    return {
      ...finalBaseParams,
      ...extraParams,
      ...(userId && { pid: userId }), // 只在有用户ID时添加
    }
  }

  /**
   * 初始化分享配置
   * 按优先级合并：自定义配置 > 页面配置 > 默认配置
   *
   * @param options - 页面加载时的路由参数（onLoad 回调参数）
   * @param forceUpdate - 是否强制更新（用于用户状态变化时）
   */
  const initShareConfig = (
    options: Record<string, any> = {},
    forceUpdate: boolean = false,
  ): void => {
    // 保存 onLoad 参数供后续使用
    if (Object.keys(options).length > 0) {
      onLoadOptions.value = options
    }

    const { path, query } = getCurrentPageInfo()
    const defaultPageConfig = PAGE_SHARE_CONFIG[path] || {}

    // 合并页面配置
    if (!isInitialized.value || forceUpdate) {
      pageConfig.value = {
        ...defaultPageConfig,
        ...customConfig,
      }
    }

    // 构建分享路径参数
    // 优先使用当前页面的真实参数，fallback 到 onLoad 参数
    const currentParams = Object.keys(query).length > 0 ? query : onLoadOptions.value

    // 构建最终的分享参数
    const shareParams = buildShareParams(
      currentParams,
      dynamicShareData.value.extraParams,
      dynamicShareData.value.overridePath,
    )

    // 按优先级合并配置
    shareConfig.value = {
      title: dynamicShareData.value.title || pageConfig.value.title || DEFAULT_SHARE.title,
      path: path + buildQueryString(shareParams),
      imageUrl:
        dynamicShareData.value.imageUrl || pageConfig.value.imageUrl || DEFAULT_SHARE.imageUrl,
    }

    isInitialized.value = true

    console.log('分享配置已初始化:', {
      页面路径: path,
      当前参数: currentParams,
      分享参数: shareParams,
      最终配置: shareConfig.value,
    })
  }

  /**
   * 动态设置分享数据
   * 主要用于根据接口数据动态设置分享内容
   * 例如：商品详情页根据商品信息设置分享标题和图片
   *
   * @param data - 分享数据配置
   */
  const setShareData = (data: ShareData): void => {
    console.log('设置分享数据:', data)

    // 保存动态数据
    dynamicShareData.value = {
      ...dynamicShareData.value,
      ...data,
    }

    // 立即更新分享配置
    const { path: currentPath, query: currentQuery } = getCurrentPageInfo()

    // 处理路径参数
    if (data.extraParams || data.overridePath) {
      const baseParams = data.overridePath ? {} : currentQuery
      const shareParams = buildShareParams(baseParams, data.extraParams, data.overridePath)
      shareConfig.value.path = currentPath + buildQueryString(shareParams)
    }

    // 更新标题和图片
    if (data.title) shareConfig.value.title = data.title
    if (data.imageUrl) shareConfig.value.imageUrl = data.imageUrl
  }

  /**
   * 处理分享到好友事件
   * 对应 onShareAppMessage 生命周期
   * 支持自定义处理逻辑
   */
  const handleShareAppMessage = (): ShareEventResult => {
    // 每次分享时重新构建参数，确保使用最新的用户ID
    const { path: currentPath, query: currentQuery } = getCurrentPageInfo()
    const baseParams = dynamicShareData.value.overridePath ? {} : currentQuery
    const shareParams = buildShareParams(
      baseParams,
      dynamicShareData.value.extraParams,
      dynamicShareData.value.overridePath,
    )

    const result: ShareEventResult = {
      title: shareConfig.value.title,
      path: currentPath + buildQueryString(shareParams),
      imageUrl: shareConfig.value.imageUrl,
    }

    console.log('分享到好友:', result)

    // 可以在这里添加分享统计、埋点等逻辑
    // trackShareEvent('friend', result)

    return result
  }

  /**
   * 处理分享到朋友圈事件
   * 对应 onShareTimeline 生命周期
   * 检查是否允许分享到朋友圈
   */
  const handleShareTimeline = (): ShareEventResult | null => {
    // 检查当前页面是否允许分享到朋友圈
    if (pageConfig.value.enableTimeline === false) {
      console.warn('当前页面不允许分享到朋友圈')
      return null
    }

    // 每次分享时重新构建参数，确保使用最新的用户ID
    const { path: currentPath, query: currentQuery } = getCurrentPageInfo()
    const baseParams = dynamicShareData.value.overridePath ? {} : currentQuery
    const shareParams = buildShareParams(
      baseParams,
      dynamicShareData.value.extraParams,
      dynamicShareData.value.overridePath,
    )

    const result: ShareEventResult = {
      title: shareConfig.value.title,
      path: currentPath + buildQueryString(shareParams),
      imageUrl: shareConfig.value.imageUrl,
    }

    console.log('分享到朋友圈:', result)

    // 可以在这里添加分享统计、埋点等逻辑
    // trackShareEvent('timeline', result)

    return result
  }

  /**
   * 主动触发系统分享菜单
   * 用于自定义分享按钮点击时调用
   * 支持多平台适配
   */
  const triggerShare = (): void => {
    try {
      // 微信小程序
      // #ifdef MP-WEIXIN
      const shareMenuOptions: any = {
        withShareTicket: true,
        menus: ['shareAppMessage'],
      }

      // 根据页面配置决定是否显示朋友圈选项
      if (pageConfig.value.enableTimeline !== false) {
        shareMenuOptions.menus.push('shareTimeline')
      }

      uni.showShareMenu(shareMenuOptions)
      console.log('已触发微信小程序分享菜单')
      // #endif

      // 支付宝小程序
      // #ifdef MP-ALIPAY
      // @ts-expect-error - 支付宝小程序特有 API
      my.showSharePanel({
        title: shareConfig.value.title,
        content: shareConfig.value.title,
        url: shareConfig.value.path,
      })
      console.log('已触发支付宝小程序分享面板')
      // #endif

      // 百度小程序
      // #ifdef MP-BAIDU
      // @ts-expect-error - 百度小程序特有 API
      swan.openShare({
        title: shareConfig.value.title,
        content: shareConfig.value.title,
        imageUrl: shareConfig.value.imageUrl,
        path: shareConfig.value.path,
      })
      console.log('已触发百度小程序分享')
      // #endif

      // QQ小程序
      // #ifdef MP-QQ
      // @ts-expect-error - QQ小程序特有 API
      qq.showShareMenu({
        showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment'],
      })
      console.log('已触发QQ小程序分享菜单')
      // #endif
    } catch (error) {
      console.error('触发分享失败:', error)
      // 可以在这里添加用户提示
      toast.error('分享功能暂不可用')
    }
  }

  /**
   * 重置分享配置为默认值
   * 用于特殊场景下重置分享配置
   */
  const resetShareConfig = (): void => {
    shareConfig.value = { ...DEFAULT_SHARE }
    pageConfig.value = {}
    dynamicShareData.value = {}
    isInitialized.value = false
    console.log('分享配置已重置为默认值')
  }

  /**
   * 检查是否支持分享到朋友圈
   */
  const canShareToTimeline = (): boolean => {
    return pageConfig.value.enableTimeline !== false
  }

  // ==================== 生命周期钩子 ====================

  /**
   * 页面加载时自动初始化分享配置
   * 会自动注册到页面的 onLoad 生命周期
   */
  onLoad((options) => {
    initShareConfig(options || {})
  })

  /**
   * 微信小程序分享到好友事件
   * 用户点击右上角分享按钮时触发
   */
  onShareAppMessage(() => {
    return handleShareAppMessage()
  })

  /**
   * 微信小程序分享到朋友圈事件
   * 只在允许的情况下返回配置
   */
  onShareTimeline(() => {
    const result = handleShareTimeline()
    // 如果不允许分享到朋友圈，返回 null 会阻止分享
    return result || undefined
  })

  // ==================== 返回组合函数接口 ====================

  return {
    /** 当前分享配置（只读） */
    shareConfig: readonly(shareConfig),
    /** 页面配置（只读） */
    pageConfig: readonly(pageConfig),
    /** 动态设置分享数据 */
    setShareData,
    /** 主动触发分享 */
    triggerShare,
    /** 重置分享配置 */
    resetShareConfig,
    /** 检查是否支持分享到朋友圈 */
    canShareToTimeline,
    /** 处理分享到好友 */
    handleShareAppMessage,
    /** 处理分享到朋友圈 */
    handleShareTimeline,
  } as const
}

/**
 * 小程序分享功能组合函数
 * 页面级单例模式，同一页面内多个组件共享同一个实例
 *
 * @param customConfig - 自定义页面分享配置
 * @returns 分享功能接口
 */
export const useShare = (customConfig?: PageShareConfig) => {
  const pageKey = getPageKey()

  // 检查是否已存在该页面的分享实例
  if (!pageShareInstances.has(pageKey)) {
    // 创建新的分享实例
    const instance = createShareInstance(customConfig)
    pageShareInstances.set(pageKey, instance)

    // 清理机制：页面卸载时清除实例
    onUnmounted(() => {
      pageShareInstances.delete(pageKey)
      console.log(`页面 ${pageKey} 的分享实例已清理`)
    })
  }
  return pageShareInstances.get(pageKey)
}
