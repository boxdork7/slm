<!-- 单任务调度日志弹窗：仅展示指定 jobId 的执行日志，避免跳页查看 -->
<template>
  <AModal v-model="visible" :title="title" size="large">
    <el-table v-loading="isLoading" :data="logList" :height="440" stripe>
      <el-table-column type="expand">
        <template #default="{ row }">
          <div v-if="row.exceptionInfo" class="exception-box">
            <div class="exception-title">{{ t('异常堆栈') }}</div>
            <pre class="exception-content">{{ row.exceptionInfo }}</pre>
          </div>
          <div v-else class="exception-empty">{{ t('jobMessage', '日志信息') }}：{{ row.jobMessage || '-' }}</div>
        </template>
      </el-table-column>
      <el-table-column :label="t('id', '日志ID')" prop="id" align="center" min-width="105" />
      <el-table-column :label="t('status', '执行状态')" prop="status" align="center" width="90">
        <template #default="{ row }">
          <DictTag :options="job_execute_status" :value="row.status" />
        </template>
      </el-table-column>
      <el-table-column :label="t('executeNode', '执行节点')" prop="executeNode" align="center" min-width="140" show-overflow-tooltip />
      <el-table-column :label="t('costTime', '耗时(ms)')" prop="costTime" align="center" width="100" />
      <el-table-column :label="t('retryCount', '重试')" prop="retryCount" align="center" width="70" />
      <el-table-column :label="t('startTime', '开始时间')" prop="startTime" align="center" width="165" />
    </el-table>

    <!-- 分页固定在弹窗底部（footer 插槽不随内容滚动，Pagination 默认右对齐） -->
    <template #footer>
      <Pagination v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" :total="total" @pagination="getList" />
    </template>
  </AModal>
</template>

<script setup lang="ts" name="JobLogDialog">
import { pageJobLogs } from '@/api/job/log/logApi'
import type { JobLogVo } from '@/api/job/log/logTypes'

const props = defineProps<{
  /** 弹窗显示状态（v-model） */
  modelValue: boolean
  /** 目标任务ID */
  jobId?: string | number
  /** 目标任务名称，仅用于弹窗标题展示 */
  jobName?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const { t } = useI18n()
const { job_execute_status } = useDict(DictTypes.job_execute_status)

/** 弹窗显示状态 */
const visible = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val)
})

/** 弹窗标题：带上任务名称，方便区分 */
const title = computed(() => `${t('调度日志')}${props.jobName ? ` - ${props.jobName}` : ''}`)

/**表格加载状态*/
const isLoading = ref(true)
/**日志列表*/
const logList = ref<JobLogVo[]>([])
/**总记录数*/
const total = ref(0)
/**查询参数（pageSize 与表格固定高度 440 匹配，8 行数据 + 表头刚好铺满，无需内部滚动）*/
const queryParams = ref({ pageNum: 1, pageSize: 8 })

/** 查询该任务的日志列表 */
const getList = async () => {
  if (!props.jobId) return
  isLoading.value = true
  const [err, data] = await pageJobLogs({ ...queryParams.value, jobId: props.jobId, orderByColumn: 'id', isAsc: 'desc' })
  if (!err) {
    logList.value = data.records
    total.value = data.total
  }
  isLoading.value = false
}

/** 弹窗打开时重新加载该任务的日志（jobId 可能切换到另一个任务） */
watch(
  () => [props.modelValue, props.jobId],
  ([open]) => {
    if (open) {
      queryParams.value.pageNum = 1
      getList()
    }
  }
)
</script>

<style lang="scss" scoped>
.exception-box {
  padding: 0 16px;
}

.exception-title {
  font-size: 14px;
  color: var(--el-color-danger);
  margin-bottom: 8px;
}

.exception-content {
  max-height: 320px;
  overflow: auto;
  padding: 12px;
  background-color: var(--el-fill-color-darker);
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
}

.exception-empty {
  padding: 0 16px;
  color: var(--el-text-color-secondary);
  font-size: 13px;
}
</style>
