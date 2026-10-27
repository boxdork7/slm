// 功能特性状态
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getSystemFeatures, type SystemFeature } from '@/api/common/system/feature/featureApi'

const FEATURE_MODULE = 'feature'

/**
 * 系统功能配置 Store
 */
export const useFeatureStore = defineStore(FEATURE_MODULE, () => {
  /* 功能配置 */
  const features = ref<SystemFeature>({
    langchain4jEnabled: false,
    websocketEnabled: false,
    sseEnabled: false
  })

  /* 是否已初始化 */
  const initialized = ref(false)

  /**
   * 初始化功能配置
   */
  const initFeatures = async (): Promise<void> => {
    if (initialized.value) return

    const [err, data] = await getSystemFeatures()
    if (err) {
      /* 接口失败时使用默认值 */
      features.value.langchain4jEnabled = false
      features.value.websocketEnabled = false
      features.value.sseEnabled = false
    } else {
      features.value = data
    }
    initialized.value = true
  }

  /**
   * 判断功能是否启用
   * @param featureName 功能名称
   * @returns 是否启用
   */
  const isFeatureEnabled = (featureName: keyof SystemFeature): boolean => {
    return features.value[featureName] || false
  }

  return {
    features,
    initialized,
    initFeatures,
    isFeatureEnabled
  }
})
