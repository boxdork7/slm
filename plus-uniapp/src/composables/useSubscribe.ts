// 订阅消息
import { ref, computed } from 'vue'
import type {
  TemplateConfig,
  SubscribeResult,
  SubscribeRecord,
} from '@/api/app/subscribe/subscribeTypes'
import { getTemplateConfigs } from '@/api/app/subscribe/subscribeApi'
import { isMpWeixin } from '@/utils/platform'
import { cache } from '@/utils/cache'
import { SystemConfig } from '@/systemConfig'

/**
 * 订阅记录缓存key
 */
const SUBSCRIBE_CACHE_KEY = 'subscribe_records'

/**
 * 订阅消息 Composable
 * @param appid 小程序appid（可选，默认使用系统配置）
 */
export const useSubscribe = (appid?: string) => {
  const currentAppid = appid || SystemConfig.platforms.wechatMiniAppId

  /** 模板配置列表 */
  const templates = ref<TemplateConfig[]>([])

  /** 加载状态 */
  const loading = ref(false)

  /** 可用的模板ID列表 */
  const availableTemplateIds = computed(() => templates.value.map((t) => t.templateId))

  /**
   * 加载订阅模板配置
   * @param forceRefresh 是否强制刷新
   */
  const loadTemplates = async (forceRefresh = false) => {
    loading.value = true
    try {
      const cacheKey = `template_configs_${currentAppid}`

      // 尝试从缓存获取（5分钟有效期）
      if (!forceRefresh) {
        const cached = cache.get<TemplateConfig[]>(cacheKey)
        if (cached) {
          templates.value = cached
          loading.value = false
          return
        }
      }

      // 从服务器获取
      const [err, data] = await getTemplateConfigs(currentAppid)
      if (err || !data) {
        console.error('获取订阅模板配置失败:', err)
        templates.value = []
        return
      }

      templates.value = data

      // 缓存结果（5分钟 = 300秒）
      cache.set(cacheKey, data, 5 * 60)
    } catch (error) {
      console.error('加载订阅模板失败:', error)
      templates.value = []
    } finally {
      loading.value = false
    }
  }

  /**
   * 根据标题或备注查找模板
   * @param keywords 关键词（标题或备注）
   */
  const findTemplates = (...keywords: string[]): TemplateConfig[] => {
    return templates.value.filter((t) =>
      keywords.some((kw) => t.title.includes(kw) || t.remark?.includes(kw)),
    )
  }

  /**
   * 保存订阅记录到本地
   */
  const saveSubscribeRecords = (templateIds: string[]) => {
    const records: SubscribeRecord[] = cache.get<SubscribeRecord[]>(SUBSCRIBE_CACHE_KEY) || []

    templateIds.forEach((id) => {
      // 查找是否已存在
      const index = records.findIndex((r) => r.templateId === id)
      const record: SubscribeRecord = {
        templateId: id,
        subscribedAt: Date.now(),
        sent: false,
      }

      if (index >= 0) {
        records[index] = record
      } else {
        records.push(record)
      }
    })

    cache.set(SUBSCRIBE_CACHE_KEY, records)
  }

  /**
   * 请求订阅消息
   * @param tmplIds 模板ID数组
   * @returns 订阅结果
   */
  const requestSubscribe = (tmplIds: string[]): Promise<SubscribeResult> => {
    return new Promise((resolve) => {
      // 非微信小程序环境
      if (!isMpWeixin) {
        resolve({
          success: false,
          subscribedIds: [],
          failedIds: tmplIds,
          rejectedIds: [],
          errMsg: '当前环境不支持订阅消息',
        })
        return
      }

      // 没有模板ID
      if (!tmplIds || tmplIds.length === 0) {
        resolve({
          success: false,
          subscribedIds: [],
          failedIds: [],
          rejectedIds: [],
          errMsg: '模板ID列表为空',
        })
        console.log('[订阅消息] 模板ID列表为空')
        return
      }

      // 调用 uni-app API
      uni.requestSubscribeMessage({
        tmplIds,
        success: (res: any) => {
          const subscribedIds: string[] = []
          const failedIds: string[] = []
          const rejectedIds: string[] = []

          // 解析每个模板的订阅结果
          tmplIds.forEach((id) => {
            const status = res[id]
            if (status === 'accept') {
              // 用户同意订阅
              subscribedIds.push(id)
            } else if (status === 'reject') {
              // 用户拒绝订阅
              rejectedIds.push(id)
            } else {
              // 其他失败情况
              failedIds.push(id)
            }
          })

          // 保存订阅记录
          if (subscribedIds.length > 0) {
            saveSubscribeRecords(subscribedIds)
          }

          resolve({
            success: subscribedIds.length > 0,
            subscribedIds,
            failedIds,
            rejectedIds,
            errMsg: '',
          })
        },
        fail: (err: any) => {
          console.error('订阅失败:', err)
          resolve({
            success: false,
            subscribedIds: [],
            failedIds: tmplIds,
            rejectedIds: [],
            errMsg: err.errMsg || '订阅失败',
          })
        },
      })
    })
  }

  /**
   * 订阅单个或多个消息模板
   * @param templateIdsOrTitles 模板ID数组 或 模板标题/备注关键词
   */
  const subscribe = async (templateIdsOrTitles: string | string[]): Promise<SubscribeResult> => {
    // 确保模板已加载
    if (templates.value.length === 0) {
      await loadTemplates()
    }

    // 规范化为数组
    const inputs = Array.isArray(templateIdsOrTitles) ? templateIdsOrTitles : [templateIdsOrTitles]

    // 解析输入：可能是模板ID，也可能是标题/备注关键词
    const templateIds: string[] = []

    inputs.forEach((input) => {
      // 检查是否为模板ID
      if (availableTemplateIds.value.includes(input)) {
        templateIds.push(input)
      } else {
        // 尝试按标题/备注搜索
        const matched = findTemplates(input)
        templateIds.push(...matched.map((t) => t.templateId))
      }
    })

    // 去重
    const uniqueIds = [...new Set(templateIds)]

    if (uniqueIds.length === 0) {
      return {
        success: false,
        subscribedIds: [],
        failedIds: [],
        rejectedIds: [],
        errMsg: '未找到匹配的订阅模板',
      }
    }

    // 调用订阅
    return await requestSubscribe(uniqueIds)
  }

  /**
   * 批量订阅（订阅所有可用模板）
   */
  const subscribeAll = async (): Promise<SubscribeResult> => {
    if (templates.value.length === 0) {
      await loadTemplates()
    }

    return await requestSubscribe(availableTemplateIds.value)
  }

  /**
   * 检查模板是否已订阅（且未发送）
   */
  const checkSubscribed = (templateId: string): boolean => {
    const records: SubscribeRecord[] = cache.get<SubscribeRecord[]>(SUBSCRIBE_CACHE_KEY) || []
    const record = records.find((r) => r.templateId === templateId)
    return record ? !record.sent : false
  }

  /**
   * 检查是否已订阅（支持模板ID或标题）
   */
  const isSubscribed = (templateIdOrTitle: string): boolean => {
    // 检查是否为模板ID
    if (availableTemplateIds.value.includes(templateIdOrTitle)) {
      return checkSubscribed(templateIdOrTitle)
    }

    // 尝试按标题/备注搜索
    const matched = findTemplates(templateIdOrTitle)
    if (matched.length > 0) {
      return checkSubscribed(matched[0].templateId)
    }

    return false
  }

  /**
   * 标记订阅消息已发送
   */
  const markSubscribeSent = (templateId: string) => {
    const records: SubscribeRecord[] = cache.get<SubscribeRecord[]>(SUBSCRIBE_CACHE_KEY) || []
    const record = records.find((r) => r.templateId === templateId)
    if (record) {
      record.sent = true
      cache.set(SUBSCRIBE_CACHE_KEY, records)
    }
  }

  /**
   * 清理订阅记录
   */
  const clearSubscribeRecords = () => {
    cache.remove(SUBSCRIBE_CACHE_KEY)
  }

  return {
    /** 模板配置列表 */
    templates: computed(() => templates.value),
    /** 加载状态 */
    loading: computed(() => loading.value),
    /** 可用的模板ID列表 */
    availableTemplateIds,

    /** 加载订阅模板配置 */
    loadTemplates,
    /** 查找模板 */
    findTemplates,
    /** 订阅消息 */
    subscribe,
    /** 订阅所有消息 */
    subscribeAll,
    /** 检查是否已订阅 */
    isSubscribed,
    /** 标记已发送 */
    markSubscribeSent,
    /** 清理记录 */
    clearSubscribeRecords,
  }
}
