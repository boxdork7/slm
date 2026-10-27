<!-- cron 表达式生成器：常用模板 + 手动输入 + 未来执行时间实时预览 -->
<template>
  <div class="cron-builder">
    <!-- cron 输入 -->
    <el-input v-model="innerCron" placeholder="0 0/5 * * * ?" clearable @input="onCronChange">
      <template #prepend>{{ t('cron 表达式') }}</template>
    </el-input>

    <!-- 常用模板：点击直接填入 -->
    <div class="preset-row">
      <span class="preset-label">{{ t('常用模板') }}</span>
      <el-tag
        v-for="preset in CRON_PRESETS"
        :key="preset.value"
        :type="innerCron === preset.value ? 'primary' : 'info'"
        :effect="innerCron === preset.value ? 'dark' : 'plain'"
        class="preset-tag"
        @click="applyPreset(preset.value)"
      >
        {{ preset.label }}
      </el-tag>
    </div>

    <!-- 实时预览：未来 N 次执行时间（由后端 CronExpression 计算，与调度引擎语义一致） -->
    <div class="preview-box">
      <div v-if="previewLoading" class="preview-tip">
        <el-icon class="is-loading"><Loading /></el-icon>
        {{ t('计算中...') }}
      </div>
      <div v-else-if="previewError" class="preview-error">
        <el-icon><WarningFilled /></el-icon>
        {{ previewError }}
      </div>
      <div v-else-if="nextTriggers.length > 0">
        <div class="preview-title">
          <el-icon><Clock /></el-icon>
          {{ t('最近 {n} 次执行', `最近 ${nextTriggers.length} 次执行`).replace('{n}', String(nextTriggers.length)) }}
        </div>
        <div class="preview-list">
          <span v-for="(time, index) in nextTriggers" :key="index" class="preview-item">{{ time }}</span>
        </div>
      </div>
      <div v-else class="preview-tip">{{ t('填写 cron 表达式后自动预览执行时间') }}</div>
    </div>
  </div>
</template>

<script setup lang="ts" name="CronBuilder">
import { previewNextTriggers } from '@/api/job/info/infoApi'
import { debounce } from '@/utils/function'

const { t } = useI18n()

const props = defineProps<{
  /** cron 表达式（v-model） */
  modelValue?: string
  /** 预览条数 */
  previewCount?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

/** 常用 cron 模板（覆盖 90% 场景，避免手写出错） */
const CRON_PRESETS = [
  { label: '每分钟', value: '0 * * * * ?' },
  { label: '每 5 分钟', value: '0 0/5 * * * ?' },
  { label: '每 30 分钟', value: '0 0/30 * * * ?' },
  { label: '每小时', value: '0 0 * * * ?' },
  { label: '每天 1 点', value: '0 0 1 * * ?' },
  { label: '每天 2 点', value: '0 0 2 * * ?' },
  { label: '每周一 0 点', value: '0 0 0 ? * MON' },
  { label: '每月 1 号', value: '0 0 0 1 * ?' }
]

/** 内部 cron 值 */
const innerCron = ref(props.modelValue || '')
/** 未来执行时间列表 */
const nextTriggers = ref<string[]>([])
/** 预览加载状态 */
const previewLoading = ref(false)
/** 预览错误信息（cron 非法时展示） */
const previewError = ref('')

/** 同步外部值变化 */
watch(
  () => props.modelValue,
  (val) => {
    if (val !== innerCron.value) {
      innerCron.value = val || ''
      doPreview()
    }
  }
)

/** 请求后端计算未来执行时间 */
const doPreview = async () => {
  const cron = innerCron.value?.trim()
  if (!cron) {
    nextTriggers.value = []
    previewError.value = ''
    return
  }
  previewLoading.value = true
  previewError.value = ''
  const [err, data] = await previewNextTriggers(cron, props.previewCount ?? 5)
  if (err) {
    // 后端校验不通过时提示，不弹全局错误
    nextTriggers.value = []
    previewError.value = t('cron 表达式不合法，请检查')
  } else {
    nextTriggers.value = data || []
  }
  previewLoading.value = false
}

/** 防抖预览，避免输入过程频繁请求 */
const debouncedPreview = debounce(doPreview, 400)

/** cron 输入变化 */
const onCronChange = (val: string) => {
  emit('update:modelValue', val)
  debouncedPreview()
}

/** 应用常用模板 */
const applyPreset = (value: string) => {
  innerCron.value = value
  emit('update:modelValue', value)
  doPreview()
}

onMounted(() => {
  if (innerCron.value) {
    doPreview()
  }
})
</script>

<style lang="scss" scoped>
.cron-builder {
  width: 100%;
}

.preset-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
}

.preset-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.preset-tag {
  cursor: pointer;
}

.preview-box {
  margin-top: 8px;
  padding: 8px 12px;
  background-color: var(--el-fill-color-lighter);
  border-radius: 4px;
  font-size: 12px;
}

.preview-title {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--el-color-success);
  margin-bottom: 4px;
}

.preview-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  color: var(--el-text-color-regular);
}

.preview-tip {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--el-text-color-secondary);
}

.preview-error {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--el-color-danger);
}
</style>
