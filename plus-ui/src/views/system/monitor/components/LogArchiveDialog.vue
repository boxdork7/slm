<!-- 审计日志归档查询弹窗（只读，等保二级 8.1.4.3） -->
<template>
  <AModal v-model="visible" :title="dialogTitle" mode="drawer" size="xl" :show-footer="true" footer-type="close-only" class="log-archive-drawer">
    <!-- 说明条：让使用者一眼明白这些数据是怎么来的、为什么删不掉 -->
    <el-alert type="info" :closable="false" show-icon class="archive-tip">
      <template #title>
        {{ t('Archived audit records', '归档审计记录（只读）') }}
      </template>
      <template #default>
        {{
          t(
            'Archive desc',
            '清空日志时数据会自动搬到归档表保留，不会被物理删除。归档记录仅可查阅与导出，系统未提供任何删除接口 —— 如需清理只能由 DBA 直连数据库操作。'
          )
        }}
      </template>
    </el-alert>

    <!-- 搜索条件：与主表保持一致，用户切过来不用重新学 -->
    <el-form :inline="true" class="archive-search">
      <el-form-item :label="t('Search', '模糊搜索')">
        <el-input v-model="queryParams.searchValue" clearable :placeholder="t('Enter keyword', '请输入关键字')" style="width: 200px" @input="handleQuery" />
      </el-form-item>
      <el-form-item :label="t('Time', '时间范围')">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          value-format="YYYY-MM-DD"
          :start-placeholder="t('Start', '开始日期')"
          :end-placeholder="t('End', '结束日期')"
          style="width: 260px"
          @change="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">{{ t('Search', '搜索') }}</el-button>
        <el-button icon="Refresh" @click="resetQuery">{{ t('Reset', '重置') }}</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作日志归档表格 -->
    <el-table v-if="logType === 'oper'" v-loading="isLoading" :data="dataList" height="100%" class="archive-table" stripe>
      <el-table-column :label="t('operId', '日志编号')" prop="operId" align="center" width="180" />
      <el-table-column :label="t('title', '系统模块')" prop="title" align="center" min-width="100" />
      <el-table-column :label="t('operType', '操作类型')" prop="operType" align="center" width="100">
        <template #default="{ row }">
          <DictTag :options="sys_oper_type" :value="row.operType" />
        </template>
      </el-table-column>
      <el-table-column :label="t('operName', '操作人员')" prop="operName" align="center" width="120" />
      <el-table-column :label="t('operIp', '操作地址')" prop="operIp" align="center" width="130" />
      <el-table-column :label="t('status', '状态')" prop="status" align="center" width="80">
        <template #default="{ row }">
          <DictTag :options="sys_oper_result" :value="row.status" />
        </template>
      </el-table-column>
      <el-table-column :label="t('operTime', '操作时间')" prop="operTime" align="center" width="165" />
    </el-table>

    <!-- 登录日志归档表格 -->
    <el-table v-else v-loading="isLoading" :data="dataList" height="100%" class="archive-table" stripe>
      <el-table-column :label="t('infoId', '访问编号')" prop="infoId" align="center" width="180" />
      <el-table-column :label="t('userName', '用户账号')" prop="userName" align="center" min-width="110" />
      <el-table-column :label="t('ipaddr', '登录地址')" prop="ipaddr" align="center" width="130" />
      <el-table-column :label="t('loginLocation', '登录地点')" prop="loginLocation" align="center" min-width="120" />
      <el-table-column :label="t('browser', '浏览器')" prop="browser" align="center" width="110" />
      <el-table-column :label="t('status', '状态')" prop="status" align="center" width="80">
        <template #default="{ row }">
          <DictTag :options="sys_oper_result" :value="row.status" />
        </template>
      </el-table-column>
      <el-table-column :label="t('msg', '操作信息')" prop="msg" align="center" min-width="110" />
      <el-table-column :label="t('loginTime', '登录时间')" prop="loginTime" align="center" width="165" />
    </el-table>

    <Pagination v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" :total="total" class="archive-pagination" @pagination="getList" />
  </AModal>
</template>

<script setup lang="ts" name="LogArchiveDialog">
import { pageOperLogArchives } from '@/api/system/monitor/operLog/operLogApi'
import { pageLoginLogArchives } from '@/api/system/monitor/loginLog/loginLogApi'
import { addDateRange } from '@/utils/date'

const { t } = useI18n()

const props = defineProps<{
  /** 日志类型：oper=操作日志，login=登录日志 */
  logType: 'oper' | 'login'
}>()

/** 弹窗显隐（由父组件通过 v-model 控制） */
const visible = defineModel<boolean>({ default: false })

// 登录日志的状态字典与操作日志共用 sys_oper_result（与 loginLog.vue 保持一致）
const { sys_oper_type, sys_oper_result } = useDict(DictTypes.sys_oper_type, DictTypes.sys_oper_result)

const dialogTitle = computed(() => (props.logType === 'oper' ? t('Oper log archive', '操作日志归档') : t('Login log archive', '登录日志归档')))

const isLoading = ref(false)
const dataList = ref<any[]>([])
const total = ref(0)
const dateRange = ref<[string, string] | []>([])
const queryParams = ref<any>({
  pageNum: 1,
  pageSize: 10,
  searchValue: undefined
})

/** 查询归档列表 */
const getList = async () => {
  isLoading.value = true
  // 归档表与主表用同一套时间字段名，addDateRange 直接复用
  const params = addDateRange({ ...queryParams.value }, dateRange.value as any)
  const [err, data] = props.logType === 'oper' ? await pageOperLogArchives(params) : await pageLoginLogArchives(params)
  if (!err) {
    dataList.value = data.records
    total.value = data.total
  }
  isLoading.value = false
}

/** 搜索 */
const handleQuery = () => {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置 */
const resetQuery = () => {
  dateRange.value = []
  queryParams.value.searchValue = undefined
  handleQuery()
}

// 弹窗每次打开都重新拉取 —— 归档数据可能在期间又增加了（比如刚做过一次清空）
watch(visible, (val) => {
  if (val) {
    resetQuery()
  }
})
</script>

<style lang="scss" scoped>
/* 说明条：el-alert 默认内边距偏厚，且与下方搜索栏贴得太近。
   这里收紧上下留白，并给出与搜索栏之间的呼吸空间。 */
.archive-tip {
  flex-shrink: 0;
  padding: 8px 12px;
  margin-bottom: 12px;

  :deep(.el-alert__title) {
    font-size: 13px;
    line-height: 20px;
  }

  :deep(.el-alert__description) {
    margin: 2px 0 0;
    font-size: 12px;
    line-height: 18px;
  }

  :deep(.el-alert__icon) {
    width: 16px;
    font-size: 16px;
  }
}

/* 搜索栏与说明条之间已有 12px，这里只收掉表单项自带的底部外边距，
   避免和下方表格之间又空出一大截 */
.archive-search {
  margin-bottom: 4px;
  flex-shrink: 0;

  :deep(.el-form-item) {
    margin-bottom: 8px;
  }
}

/* 表格吃满剩余高度：说明条/搜索栏/分页三者高度固定，
   表格 flex:1 自动补齐 —— 这样分页恰好落在抽屉底部，页面不产生滚动条。
   min-height:0 是 flex 子项能正确收缩的前提，缺了它表格会被内容撑破容器。 */
.archive-table {
  flex: 1;
  min-height: 0;
}

/* 分页贴在底部，去掉组件自带的上下外边距避免多出一截空白 */
.archive-pagination {
  flex-shrink: 0;

  :deep(.el-pagination) {
    padding: 8px 0 0;
    margin: 0;
  }
}
</style>

<style lang="scss">
/* 抽屉 body 布局。不加 scoped —— AModal 内部的抽屉 DOM 挂在组件作用域外。
   改成 flex 纵向容器后，内部的表格才能用 flex:1 吃满剩余高度，
   分页随之自然落到底部，抽屉整体不产生滚动条。 */
.log-archive-drawer {
  .el-drawer__body {
    display: flex;
    flex-direction: column;
    padding-top: 12px;
    overflow: hidden;
  }

  /* AModal 在 body 与插槽内容之间还包了一层 .amodal-content（默认 display:block），
     不把它一并改成 flex 容器并撑满高度，内部表格的 flex:1 就找不到可分配的空间，
     表现为表格按内容高度撑开、抽屉出现滚动条。 */
  .amodal-content {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
  }
}
</style>
