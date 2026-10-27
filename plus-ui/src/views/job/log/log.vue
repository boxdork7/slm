<!-- 调度日志 -->
<template>
  <div>
    <!-- 调度日志搜索栏 -->
    <ASearchForm ref="queryFormRef" v-model="queryParams" :visible="showSearch">
      <AFormInput label="任务名称" v-model="queryParams.jobName" prop="jobName" @input="handleQuery"></AFormInput>
      <AFormSelect label="执行器" v-model="queryParams.invokeTarget" prop="invokeTarget" :options="handlerOptions" filterable clearable @change="handleQuery"></AFormSelect>
      <AFormSelect label="执行状态" v-model="queryParams.status" prop="status" :options="job_execute_status" @change="handleQuery"></AFormSelect>
      <AFormInput label="执行节点" v-model="queryParams.executeNode" prop="executeNode" @input="handleQuery"></AFormInput>
      <AFormDate v-model="dateRangeStartTime" prop="startTime" type="daterange" label="开始时间" @change="handleQuery"></AFormDate>
    </ASearchForm>

    <el-card shadow="hover">
      <!-- 调度日志工具栏 -->
      <template #header>
        <el-row :gutter="10" class="mb-2">
          <el-col :span="1.5" v-permi="['job:log:remove']">
            <el-button type="danger" plain icon="Delete" :disabled="selectionItems.length === 0" @click="handleDelete()">
              {{ t('删除') }}
            </el-button>
          </el-col>
          <el-col :span="1.5" v-permi="['job:log:remove']">
            <el-button type="danger" plain icon="Delete" @click="handleClean">
              {{ t('清空') }}
            </el-button>
          </el-col>
          <el-col :span="1.5" v-permi="['job:info:list']">
            <el-button type="info" plain icon="Back" @click="handleToJob">
              {{ t('返回任务') }}
            </el-button>
          </el-col>

          <TableToolbar
            v-model:showSearch="showSearch"
            @reset-query="resetQuery"
            @query-table="getList"
            :table-columns="detailFields"
            :table-data="logList"
          ></TableToolbar>
        </el-row>
      </template>

      <!-- 调度日志表格数据 -->
      <el-table ref="logTableRef" v-loading="isLoading" :data="logList" :height="tableHeight" stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column :label="t('id', '日志ID')" prop="id" align="center" min-width="105" />
        <el-table-column :label="t('jobName', '任务名称')" prop="jobName" align="center" min-width="140" show-overflow-tooltip />
        <el-table-column :label="t('invokeTarget', '执行器')" prop="invokeTarget" align="center" min-width="150" show-overflow-tooltip />
        <el-table-column :label="t('status', '执行状态')" prop="status" align="center" width="90">
          <template #default="{ row }">
            <DictTag :options="job_execute_status" :value="row.status" />
          </template>
        </el-table-column>
        <el-table-column :label="t('executeNode', '执行节点')" prop="executeNode" align="center" width="140" />
        <el-table-column :label="t('costTime', '耗时(ms)')" prop="costTime" align="center" width="100" />
        <el-table-column :label="t('retryCount', '重试')" prop="retryCount" align="center" width="70" />
        <el-table-column :label="t('startTime', '开始时间')" prop="startTime" align="center" width="165" />
        <el-table-column :label="t('操作')" align="center" fixed="right" width="90">
          <template #default="{ row }">
            <el-tooltip :content="t('查看')" placement="top">
              <el-button v-permi="['job:log:query']" link type="primary" icon="View" @click="handleView(row)"></el-button>
            </el-tooltip>
            <el-tooltip :content="t('删除')" placement="top">
              <el-button v-permi="['job:log:remove']" link type="danger" icon="Delete" @click="handleDelete(row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <Pagination v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" :total="total" @pagination="getList" />
    </el-card>

    <!-- 查看调度日志详情（抽屉 + 异常堆栈插槽） -->
    <ADetail v-model="viewDialog.visible" :title="viewDialog.title" :data="viewData" :fields="detailFields" mode="drawer">
      <!-- 失败日志追加异常堆栈展示 -->
      <template #content>
        <div v-if="viewData.exceptionInfo" class="exception-box">
          <div class="exception-title">{{ t('异常堆栈') }}</div>
          <pre class="exception-content">{{ viewData.exceptionInfo }}</pre>
        </div>
      </template>
    </ADetail>
  </div>
</template>

<script setup lang="ts" name="JobLog">
import { pageJobLogs, deleteJobLogs, cleanJobLogs } from '@/api/job/log/logApi'
import type { JobLogQuery, JobLogVo } from '@/api/job/log/logTypes'
import { listJobHandlers } from '@/api/job/info/infoApi'
import { addDateRange } from '@/utils/date'
import { showMsgSuccess, showConfirm } from '@/utils/modal'

/** 调度日志字典数据 */
const { job_execute_status } = useDict(DictTypes.job_execute_status)

const { t } = useI18n()
const router = useRouter()

// 使用表格高度处理钩子
const { tableHeight, queryFormRef, showSearch } = useTableHeight()

// =========== 调度日志查询相关 ===========

/**查询参数对象*/
const queryParams = ref<JobLogQuery>({
  pageNum: 1,
  pageSize: 10,
  orderByColumn: 'id',
  isAsc: 'desc',
  jobId: undefined,
  jobName: undefined,
  invokeTarget: undefined,
  status: undefined,
  executeNode: undefined
})

/**日期范围选择器*/
const dateRangeStartTime = ref<[ElDateModelType, ElDateModelType]>(['', ''])

/** 调度日志搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1
  getList()
}

/** 调度日志重置按钮操作 */
const resetQuery = () => {
  dateRangeStartTime.value = ['', '']
  queryFormRef.value?.resetFields()
  handleQuery()
}

// =========== 调度日志表格数据相关 ===========
/**表格加载状态*/
const isLoading = ref(true)
/**数据列表*/
const logList = ref<JobLogVo[]>([])
/**总记录数*/
const total = ref(0)
/**表格实例*/
const logTableRef = ref()
/**选中的数据项*/
const selectionItems = ref<JobLogVo[]>([])
/**已注册执行器下拉选项（复用调度任务页的注册表接口）*/
const handlerOptions = ref<Array<{ label: string; value: string }>>([])

/** 表格多选事件处理 */
const handleSelectionChange = (selection: JobLogVo[]) => {
  selectionItems.value = selection
}

/** 加载已注册执行器（供执行器下拉搜索使用） */
const loadHandlers = async () => {
  const [err, data] = await listJobHandlers()
  if (!err && data) {
    handlerOptions.value = data.map((item) => ({
      label: item.desc ? `${item.desc}（${item.name}）` : item.name,
      value: item.name
    }))
  }
}

/** 查询调度日志列表 */
const getList = async () => {
  isLoading.value = true
  queryParams.value.params = {}
  addDateRange(queryParams.value, dateRangeStartTime.value, 'startTime')
  const [err, data] = await pageJobLogs(queryParams.value)
  if (!err) {
    logList.value = data.records
    total.value = data.total
  }
  isLoading.value = false
}

/** 返回调度任务页 */
const handleToJob = () => {
  router.push({ path: '/monitor/job/info' })
}

/** 删除调度日志操作 */
const handleDelete = async (row?: JobLogVo) => {
  const idsToDelete = row ? [row.id] : selectionItems.value.map((item) => item.id)
  if (idsToDelete.length === 0) return

  const [confirmErr] = await showConfirm(`${t('是否确认删除选中的')} ${idsToDelete.length} ${t('条日志')}?`)
  if (confirmErr) return

  const [deleteErr] = await deleteJobLogs(idsToDelete)
  if (!deleteErr) {
    showMsgSuccess(t('message.deleteSuccess'))
    await getList()
  }
}

/** 清空调度日志操作 */
const handleClean = async () => {
  const [confirmErr] = await showConfirm(t('是否确认清空所有调度日志?'))
  if (confirmErr) return

  const [cleanErr, deletedCount] = await cleanJobLogs()
  if (!cleanErr) {
    showMsgSuccess(`${t('清空成功')}，共删除 ${deletedCount ?? 0} 条`)
    await getList()
  }
}

/**查看对话框配置*/
const viewDialog = ref<DialogState>({
  visible: false,
  title: ''
})

/**查看数据*/
const viewData = ref<JobLogVo>({} as JobLogVo)

/**详情字段配置 */
const detailFields = computed<FieldConfig[]>(() => [
  { prop: 'id', label: t('id', '日志ID') },
  { prop: 'jobName', label: t('jobName', '任务名称') },
  { prop: 'jobGroup', label: t('jobGroup', '任务分组') },
  { prop: 'invokeTarget', label: t('invokeTarget', '执行器标识') },
  { prop: 'jobParams', label: t('jobParams', '任务参数') },
  { prop: 'status', label: t('status', '执行状态'), type: 'dict', dictOptions: job_execute_status },
  { prop: 'jobMessage', label: t('jobMessage', '日志信息') },
  { prop: 'executeNode', label: t('executeNode', '执行节点') },
  { prop: 'retryCount', label: t('retryCount', '重试次数') },
  { prop: 'startTime', label: t('startTime', '开始时间'), type: 'datetime' },
  { prop: 'stopTime', label: t('stopTime', '结束时间'), type: 'datetime' },
  { prop: 'costTime', label: t('costTime', '耗时(毫秒)') }
])

/** 查看调度日志详情操作 */
const handleView = (row: JobLogVo) => {
  viewData.value = row
  viewDialog.value.title = `${t('查看')}${t('jobLog', '调度日志')}`
  viewDialog.value.visible = true
}

// =========== 生命周期 ===========
/**初始化调度日志数据列表*/
onMounted(() => {
  // 支持从任务页跳转时带 jobId 过滤
  const jobId = router.currentRoute.value.query.jobId
  if (jobId) {
    queryParams.value.jobId = jobId as string
  }
  getList()
  loadHandlers()
})
/**页面激活时刷新调度日志列表*/
onActivated(() => {
  if (isLoading.value) return
  getList()
})
</script>

<style lang="scss" scoped>
.exception-box {
  margin-top: 16px;
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
</style>
