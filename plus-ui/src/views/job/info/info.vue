<!-- 调度任务 -->
<template>
  <div>
    <!-- 调度任务搜索栏 -->
    <ASearchForm ref="queryFormRef" v-model="queryParams" :visible="showSearch">
      <AFormInput label="模糊搜索" prop="searchValue" v-model="queryParams.searchValue" @input="handleQuery"></AFormInput>
      <AFormInput label="任务名称" v-model="queryParams.jobName" prop="jobName" @input="handleQuery"></AFormInput>
      <AFormInput label="任务分组" v-model="queryParams.jobGroup" prop="jobGroup" @input="handleQuery"></AFormInput>
      <AFormSelect label="路由策略" v-model="queryParams.routeStrategy" prop="routeStrategy" :options="job_route_strategy" @change="handleQuery"></AFormSelect>
      <AFormSelect label="任务状态" v-model="queryParams.status" prop="status" :options="sys_enable_status" @change="handleQuery"></AFormSelect>
    </ASearchForm>

    <el-card shadow="hover">
      <!-- 调度任务工具栏 -->
      <template #header>
        <el-row :gutter="10" class="mb-2">
          <el-col :span="1.5" v-permi="['job:info:add']">
            <el-button type="primary" plain icon="Plus" @click="handleAdd">
              {{ t('新增') }}
            </el-button>
          </el-col>
          <el-col :span="1.5" v-permi="['job:info:update']">
            <el-button type="success" plain icon="Edit" :disabled="selectionItems.length !== 1" @click="handleUpdate()">
              {{ t('修改') }}
            </el-button>
          </el-col>
          <el-col :span="1.5" v-permi="['job:info:remove']">
            <el-button type="danger" plain icon="Delete" :disabled="selectionItems.length === 0" @click="handleDelete()">
              {{ t('删除') }}
            </el-button>
          </el-col>
          <el-col :span="1.5" v-permi="['job:log:list']">
            <el-button type="info" plain icon="Document" @click="handleToLog()">
              {{ t('调度日志') }}
            </el-button>
          </el-col>

          <TableToolbar
            v-model:showSearch="showSearch"
            @reset-query="resetQuery"
            @query-table="getList"
            :table-columns="detailFields"
            :table-data="jobList"
          ></TableToolbar>
        </el-row>
      </template>

      <!-- 调度任务表格数据 -->
      <el-table ref="jobTableRef" v-loading="isLoading" :data="jobList" :height="tableHeight" stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column :label="t('jobName', '任务名称')" prop="jobName" align="center" min-width="140" show-overflow-tooltip />
        <el-table-column :label="t('jobGroup', '任务分组')" prop="jobGroup" align="center" width="100" />
        <el-table-column :label="t('invokeTarget', '执行器')" prop="invokeTarget" align="center" min-width="150" show-overflow-tooltip />
        <el-table-column :label="t('cronExpression', 'cron 表达式')" prop="cronExpression" align="center" min-width="130" />
        <el-table-column :label="t('routeStrategy', '路由策略')" prop="routeStrategy" align="center" width="90">
          <template #default="{ row }">
            <DictTag :options="job_route_strategy" :value="row.routeStrategy" />
          </template>
        </el-table-column>
        <el-table-column :label="t('maxRetry', '重试次数')" prop="maxRetry" align="center" width="90" />
        <el-table-column :label="t('status', '状态')" prop="status" align="center" width="80">
          <template #default="{ row }">
            <AFormSwitch v-model="row.status" @change="handleStatusChange(row)" />
          </template>
        </el-table-column>
        <el-table-column :label="t('nextExecuteTime', '下次执行时间')" prop="nextExecuteTime" align="center" width="165" />
        <el-table-column :label="t('操作')" align="center" fixed="right" width="230">
          <template #default="{ row }">
            <el-tooltip :content="t('查看')" placement="top">
              <el-button v-permi="['job:info:query']" link type="primary" icon="View" @click="handleView(row)"></el-button>
            </el-tooltip>
            <el-tooltip :content="t('执行一次')" placement="top">
              <el-button v-permi="['job:info:run']" link type="warning" icon="VideoPlay" @click="handleRunOnce(row)"></el-button>
            </el-tooltip>
            <el-tooltip :content="t('查看日志')" placement="top">
              <!-- 用 job:log:query 而非菜单权限 job:log:list：本按钮打开的弹窗直接调 pageJobLogs 接口，
                   后端校验的是 job:log:query，只给菜单权限的角色点开会拿到 403 -->
              <el-button v-permi="['job:log:query']" link type="info" icon="Tickets" @click="handleViewLog(row)"></el-button>
            </el-tooltip>
            <el-tooltip :content="t('修改')" placement="top">
              <el-button v-permi="['job:info:update']" link type="success" icon="Edit" @click="handleUpdate(row)"></el-button>
            </el-tooltip>
            <el-tooltip :content="t('删除')" placement="top">
              <el-button v-permi="['job:info:remove']" link type="danger" icon="Delete" @click="handleDelete(row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <Pagination v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" :total="total" @pagination="getList" />
    </el-card>

    <!-- 添加或修改调度任务对话框 -->
    <AModal v-model="dialog.visible" :title="dialog.title" size="large" :loading="buttonLoading" @confirm="submitForm" @cancel="cancel">
      <el-form ref="jobFormRef" :model="form" :rules="rules" label-width="auto">
        <el-row :gutter="10">
          <AFormInput label="任务名称" v-model="form.jobName" :maxlength="64" prop="jobName" span="auto"></AFormInput>
          <AFormInput label="任务分组" v-model="form.jobGroup" :maxlength="64" prop="jobGroup" span="auto"></AFormInput>

          <!-- 执行器：从已注册执行器下拉选择，避免手敲标识出错 -->
          <AFormSelect
            label="执行器"
            v-model="form.invokeTarget"
            prop="invokeTarget"
            :options="handlerOptions"
            filterable
            span="auto"
            @change="handleHandlerChange"
          ></AFormSelect>

          <AFormSelect label="路由策略" v-model="form.routeStrategy" prop="routeStrategy" :options="job_route_strategy" span="auto"></AFormSelect>

          <!-- 错过执行策略：应用停机等原因导致触发迟到超过阈值时的处理方式 -->
          <AFormSelect label="错过策略" v-model="form.misfirePolicy" prop="misfirePolicy" :options="job_misfire_policy" span="auto"></AFormSelect>

          <!-- cron 表达式：生成器（常用模板 + 实时预览） -->
          <el-col :span="24">
            <el-form-item :label="t('cron 表达式')" prop="cronExpression">
              <!-- CronBuilder 为自定义组件，不冒泡 blur/change，值变化后主动校验该字段以清除必填残留提示 -->
              <CronBuilder v-model="form.cronExpression" :preview-count="5" @update:model-value="() => jobFormRef?.validateField('cronExpression').catch(() => {})" />
            </el-form-item>
          </el-col>

          <AFormInput label="任务参数" v-model="form.jobParams" type="textarea" :maxlength="2000" prop="jobParams" span="24"></AFormInput>
          <AFormInput label="重试次数" v-model="form.maxRetry" type="number" prop="maxRetry" span="auto"></AFormInput>
          <AFormInput label="重试间隔(秒)" v-model="form.retryInterval" type="number" prop="retryInterval" span="auto"></AFormInput>
          <AFormInput label="超时(秒,0不限)" v-model="form.timeout" type="number" prop="timeout" span="auto"></AFormInput>
          <AFormRadio label="允许并发" v-model="form.concurrent" prop="concurrent" :options="sys_boolean_flag" span="auto"></AFormRadio>
          <AFormRadio label="任务状态" v-model="form.status" prop="status" :options="sys_enable_status" span="auto"></AFormRadio>
          <AFormInput label="备注" v-model="form.remark" type="textarea" :maxlength="500" prop="remark" span="24"></AFormInput>
        </el-row>
      </el-form>
    </AModal>

    <!-- 查看调度任务详情对话框 -->
    <ADetail v-model="viewDialog.visible" :title="viewDialog.title" :data="viewData" :fields="detailFields" />

    <!-- 单任务调度日志弹窗（仅显示当前任务的日志，不跳页） -->
    <JobLogDialog v-model="logDialog.visible" :job-id="logDialog.jobId" :job-name="logDialog.jobName" />
  </div>
</template>

<script setup lang="ts" name="JobInfo">
import { pageJobInfos, getJobInfo, addJobInfo, updateJobInfo, deleteJobInfos, changeJobStatus, runJob, listJobHandlers } from '@/api/job/info/infoApi'
import type { JobInfoQuery, JobInfoBo, JobInfoVo } from '@/api/job/info/infoTypes'
import { pageJobLogs } from '@/api/job/log/logApi'
import CronBuilder from './components/CronBuilder.vue'
import JobLogDialog from './components/JobLogDialog.vue'
import { isTrue, toggleStatus } from '@/utils/boolean'
import { toValidate } from '@/utils/to'
import { showMsgSuccess, showConfirm, showNotifySuccess, showNotifyError } from '@/utils/modal'

/** 调度任务字典数据 */
const { sys_enable_status, sys_boolean_flag, job_route_strategy, job_misfire_policy } = useDict(
  DictTypes.sys_enable_status,
  DictTypes.sys_boolean_flag,
  DictTypes.job_route_strategy,
  DictTypes.job_misfire_policy
)

const { t } = useI18n()
const router = useRouter()

// 使用表格高度处理钩子
const { tableHeight, queryFormRef, showSearch } = useTableHeight()

// =========== 调度任务查询相关 ===========

/**查询参数对象*/
const queryParams = ref<JobInfoQuery>({
  pageNum: 1,
  pageSize: 10,
  orderByColumn: 'id',
  isAsc: 'desc',
  jobName: undefined,
  jobGroup: undefined,
  invokeTarget: undefined,
  routeStrategy: undefined,
  status: undefined
})

/** 调度任务搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1
  getList()
}

/** 调度任务重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields()
  handleQuery()
}

// =========== 调度任务表格数据相关 ===========
/**表格加载状态*/
const isLoading = ref(true)
/**数据列表*/
const jobList = ref<JobInfoVo[]>([])
/**总记录数*/
const total = ref(0)
/**表格实例*/
const jobTableRef = ref()
/**选中的数据项*/
const selectionItems = ref<JobInfoVo[]>([])
/**已注册执行器下拉选项*/
const handlerOptions = ref<Array<{ label: string; value: string; sampleCron?: string }>>([])

/** 表格多选事件处理 */
const handleSelectionChange = (selection: JobInfoVo[]) => {
  selectionItems.value = selection
}

/** 查询调度任务列表 */
const getList = async () => {
  isLoading.value = true
  const [err, data] = await pageJobInfos(queryParams.value)
  if (!err) {
    jobList.value = data.records
    total.value = data.total
  }
  isLoading.value = false
}

/** 加载已注册执行器（供执行器下拉使用） */
const loadHandlers = async () => {
  const [err, data] = await listJobHandlers()
  if (!err && data) {
    handlerOptions.value = data.map((item) => ({
      // 下拉显示「中文说明（标识）」，没有说明时只显示标识
      label: item.desc ? `${item.desc}（${item.name}）` : item.name,
      value: item.name,
      sampleCron: item.sampleCron
    }))
  }
}

/** 选择执行器后自动带出建议 cron */
const handleHandlerChange = (value: string) => {
  const handler = handlerOptions.value.find((item) => item.value === value)
  if (handler?.sampleCron && !form.value.cronExpression) {
    form.value.cronExpression = handler.sampleCron
  }
}

/** 跳转调度日志 */
const handleToLog = () => {
  router.push({ path: '/monitor/job/log' })
}

/** 单任务调度日志弹窗状态 */
const logDialog = ref<{ visible: boolean; jobId?: string | number; jobName?: string }>({ visible: false })

/** 查看指定任务的调度日志（弹窗展示，不跳页） */
const handleViewLog = (row: JobInfoVo) => {
  logDialog.value = { visible: true, jobId: row.id, jobName: row.jobName }
}

/** 删除调度任务操作 */
const handleDelete = async (row?: JobInfoVo) => {
  const idsToDelete = row ? [row.id] : selectionItems.value.map((item) => item.id)
  if (idsToDelete.length === 0) return
  const itemsToDelete = row ? row.jobName || row.id : selectionItems.value.map((item) => item.jobName || item.id).join(', ')

  const [confirmErr] = await showConfirm(`${t('是否确认删除')}${itemsToDelete}`)
  if (confirmErr) return

  const [deleteErr] = await deleteJobInfos(idsToDelete)
  if (!deleteErr) {
    showMsgSuccess(t('message.deleteSuccess'))
    await getList()
  }
}

/** 手动执行一次：触发后轮询最新日志，直接反馈执行结果 */
const handleRunOnce = async (row: JobInfoVo) => {
  const [confirmErr] = await showConfirm(`${t('是否确认立即执行一次')}「${row.jobName}」?`)
  if (confirmErr) return

  const [runErr] = await runJob(row.id)
  if (runErr) return
  showMsgSuccess(t('已触发，正在执行...'))

  // 轮询该任务最新一条日志，拿到最终状态后提示（最多 3 次，间隔 1.5s）
  for (let i = 0; i < 3; i++) {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const [logErr, logData] = await pageJobLogs({ pageNum: 1, pageSize: 1, jobId: row.id })
    if (logErr || !logData?.records?.length) continue
    const latest = logData.records[0]
    // status: 0失败 1成功 2执行中
    if (latest.status === '1') {
      showNotifySuccess(`${t('执行成功')}，${t('耗时')} ${latest.costTime}ms`)
      return
    }
    if (latest.status === '0') {
      showNotifyError(`${t('执行失败')}：${latest.jobMessage}`)
      return
    }
  }
  showNotifySuccess(t('任务已提交执行，请稍后到调度日志查看结果'))
}

// =========== 调度任务表单相关 ===========
/**初始表单数据*/
const initFormData: JobInfoBo = {
  id: undefined,
  jobName: undefined,
  jobGroup: 'DEFAULT',
  invokeTarget: undefined,
  jobParams: undefined,
  cronExpression: undefined,
  routeStrategy: '1',
  misfirePolicy: '3',
  maxRetry: 0,
  retryInterval: 10,
  timeout: 0,
  concurrent: '0',
  status: '0',
  remark: undefined
}

/**表单引用*/
const jobFormRef = ref<ElFormInstance>()
/**表单提交按钮加载状态*/
const buttonLoading = ref(false)
/**对话框配置对象*/
const dialog = ref<DialogState>({
  visible: false,
  title: ''
})
/**表单数据对象*/
const form = ref<JobInfoBo>({ ...initFormData })
/**表单校验规则*/
const rules = ref<ElFormRules>({
  jobName: [{ required: true, message: t('jobName cannot be empty', '任务名称不能为空'), trigger: 'blur' }],
  invokeTarget: [{ required: true, message: t('invokeTarget cannot be empty', '执行器不能为空'), trigger: 'change' }],
  cronExpression: [{ required: true, message: t('cronExpression cannot be empty', 'cron 表达式不能为空'), trigger: ['blur', 'change'] }]
})

/** 调度任务表单重置 */
const reset = () => {
  form.value = { ...initFormData }
  jobFormRef.value?.resetFields()
}

/** 取消调度任务编辑 */
const cancel = () => {
  reset()
  dialog.value.visible = false
}

/** 新增调度任务操作 */
const handleAdd = () => {
  reset()
  dialog.value.visible = true
  dialog.value.title = `${t('新增')}${t('jobInfo', '调度任务')}`
}

/** 修改调度任务操作 */
const handleUpdate = async (row?: JobInfoVo) => {
  reset()
  const itemToEdit = row || selectionItems.value[0]
  const [err, data] = await getJobInfo(itemToEdit.id)
  if (!err) {
    Object.assign(form.value, data)
    dialog.value.visible = true
    dialog.value.title = `${t('修改')}${t('jobInfo', '调度任务')}`
  }
}

/** 提交调度任务表单 */
const submitForm = async () => {
  const [validateErr] = await toValidate(jobFormRef)
  if (validateErr) return

  buttonLoading.value = true
  let err: Error | null
  if (form.value.id) {
    ;[err] = await updateJobInfo(form.value)
  } else {
    ;[err] = await addJobInfo(form.value)
  }
  if (!err) {
    showMsgSuccess(form.value.id ? t('message.updateSuccess') : t('message.addSuccess'))
    dialog.value.visible = false
    await getList()
  }
  buttonLoading.value = false
}

/** 调度任务启停状态修改 */
const handleStatusChange = async (row: JobInfoVo) => {
  const text = isTrue(row.status) ? t('启用') : t('暂停')
  const [confirmErr] = await showConfirm(`${t('是否确认')}${text}「${row.jobName}」?`)
  if (confirmErr) {
    row.status = toggleStatus(row.status)
    return
  }
  const [updateErr] = await changeJobStatus(row.id, row.status)
  if (!updateErr) {
    await getList()
    showMsgSuccess(`${text}${t('成功')}`)
  } else {
    row.status = toggleStatus(row.status)
  }
}

/**查看对话框配置*/
const viewDialog = ref<DialogState>({
  visible: false,
  title: ''
})

/**查看数据*/
const viewData = ref<JobInfoVo>({} as JobInfoVo)

/**详情字段配置 */
const detailFields = computed<FieldConfig[]>(() => [
  { prop: 'id', label: t('id', '任务ID') },
  { prop: 'jobName', label: t('jobName', '任务名称') },
  { prop: 'jobGroup', label: t('jobGroup', '任务分组') },
  { prop: 'invokeTarget', label: t('invokeTarget', '执行器标识') },
  { prop: 'jobParams', label: t('jobParams', '任务参数') },
  { prop: 'cronExpression', label: t('cronExpression', 'cron 表达式') },
  { prop: 'routeStrategy', label: t('routeStrategy', '路由策略'), type: 'dict', dictOptions: job_route_strategy },
  { prop: 'misfirePolicy', label: t('misfirePolicy', '错过策略'), type: 'dict', dictOptions: job_misfire_policy },
  { prop: 'maxRetry', label: t('maxRetry', '重试次数') },
  { prop: 'retryInterval', label: t('retryInterval', '重试间隔(秒)') },
  { prop: 'timeout', label: t('timeout', '超时(秒)') },
  { prop: 'concurrent', label: t('concurrent', '允许并发'), type: 'dict', dictOptions: sys_boolean_flag },
  { prop: 'status', label: t('status', '任务状态'), type: 'dict', dictOptions: sys_enable_status },
  { prop: 'nextExecuteTime', label: t('nextExecuteTime', '下次执行时间'), type: 'datetime' },
  { prop: 'createTime', label: t('createTime', '创建时间'), type: 'datetime' },
  { prop: 'remark', label: t('remark', '备注') }
])

/** 查看调度任务详情操作 */
const handleView = async (row: JobInfoVo) => {
  const [err, data] = await getJobInfo(row.id)
  if (!err) {
    viewData.value = data
    viewDialog.value.title = `${t('查看')}${t('jobInfo', '调度任务')}`
    viewDialog.value.visible = true
  }
}

// =========== 生命周期 ===========
/**初始化调度任务数据列表*/
onMounted(() => {
  getList()
  loadHandlers()
})
/**页面激活时刷新调度任务列表*/
onActivated(() => {
  if (isLoading.value) return
  getList()
})
</script>
