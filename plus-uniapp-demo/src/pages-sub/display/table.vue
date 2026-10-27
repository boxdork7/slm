<!-- Table 表格 http://127.0.0.1:100/#/pages-sub/demo/wd/table -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Table 表格" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的表格展示，支持边框、斑马纹、表头显示等基本配置">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <!-- 基本表格 -->
        <wd-cell title="基本表格" vertical>
          <wd-table
            :data="basicData"
            :height="400"
            @sort-method="handleBasicSort"
            @row-click="handleBasicRowClick"
          >
            <wd-table-col prop="name" label="姓名" align="center" width="50%" />
            <wd-table-col prop="grade" label="分数" align="center" width="50%" />
          </wd-table>
        </wd-cell>

        <!-- 无边框表格 -->
        <wd-cell title="无边框表格" vertical>
          <wd-table :data="basicData" :height="300" :border="false" @sort-method="handleBasicSort">
            <wd-table-col prop="name" label="姓名" align="center" width="50%" />
            <wd-table-col prop="grade" label="分数" align="center" width="50%" />
          </wd-table>
        </wd-cell>

        <!-- 无斑马纹表格 -->
        <wd-cell title="无斑马纹表格" vertical>
          <wd-table :data="basicData" :height="300" :stripe="false" @sort-method="handleBasicSort">
            <wd-table-col prop="name" label="姓名" align="center" width="50%" />
            <wd-table-col prop="grade" label="分数" align="center" width="50%" />
          </wd-table>
        </wd-cell>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基本表格" :code="codes.basic.basicTemplate" />
        <DemoCode title="模板 - 无边框表格" :code="codes.basic.noBorderTemplate" />
        <DemoCode title="模板 - 无斑马纹表格" :code="codes.basic.noStripeTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 高级配置示例 -->
    <DemoSection title="高级配置" desc="更多配置选项：固定表头、显示索引、列排序等">
      <view class="space-y-4">
        <!-- 不显示表头 -->
        <wd-cell title="不显示表头" vertical>
          <wd-table
            :data="basicData"
            :height="300"
            :show-header="false"
            @row-click="handleAdvancedRowClick"
          >
            <wd-table-col prop="name" label="姓名" align="center" width="50%" />
            <wd-table-col prop="grade" label="分数" align="center" width="50%" />
          </wd-table>
        </wd-cell>

        <!-- 显示索引列 -->
        <wd-cell title="显示索引列" vertical>
          <wd-table
            :data="fullData"
            :height="350"
            :index="{ align: 'center' }"
            @sort-method="handleAdvancedSort"
            @row-click="handleAdvancedRowClick"
          >
            <wd-table-col prop="name" label="姓名" sortable align="center" />
            <wd-table-col prop="grade" label="分数" sortable align="center" />
            <wd-table-col prop="hobby" label="爱好" :width="180" />
          </wd-table>
        </wd-cell>

        <!-- 非固定表头 -->
        <wd-cell title="非固定表头" vertical>
          <wd-table :data="paginationData" :fixed-header="false" @sort-method="handleAdvancedSort">
            <wd-table-col prop="name" label="姓名" align="center" />
            <wd-table-col prop="grade" label="分数" align="center" />
            <wd-table-col prop="school" label="学校" :width="200" />
          </wd-table>

          <!-- 分页组件 -->
          <view class="mt-2">
            <wd-pagination v-model="currentPage" :total="totalCount" :page-size="pageSize" />
          </view>
        </wd-cell>
      </view>

      <template #codes>
        <DemoCode title="模板 - 不显示表头" :code="codes.advanced.noHeaderTemplate" />
        <DemoCode title="模板 - 显示索引列" :code="codes.advanced.indexTemplate" />
        <DemoCode title="模板 - 非固定表头" :code="codes.advanced.noFixedTemplate" />
        <DemoCode title="脚本 - 高级配置" :code="codes.advanced.script" />
      </template>
    </DemoSection>

    <!-- 固定列示例 -->
    <DemoSection title="固定列" desc="当表格内容过宽时，可以固定左侧列">
      <wd-cell title="固定列表格" vertical>
        <wd-table
          :data="fullData"
          :height="400"
          @sort-method="handleFixedSort"
          @row-click="handleFixedRowClick"
        >
          <wd-table-col prop="name" label="姓名" sortable fixed align="center" />
          <wd-table-col prop="grade" label="分数" sortable fixed align="center" />
          <wd-table-col prop="hobby" label="爱好" sortable :width="160" />
          <wd-table-col prop="school" label="学校" :width="180" />
          <wd-table-col prop="major" label="专业" :width="200" />
          <wd-table-col prop="gender" label="性别" />
        </wd-table>
      </wd-cell>

      <template #codes>
        <DemoCode title="模板 - 固定列" :code="codes.fixed.template" />
        <DemoCode title="脚本 - 固定列" :code="codes.fixed.script" />
      </template>
    </DemoSection>

    <!-- 自定义列模板示例 -->
    <DemoSection title="自定义列模板" desc="通过插槽自定义列的渲染内容">
      <wd-cell title="自定义列渲染" vertical>
        <wd-table
          :data="fullData"
          :height="400"
          @sort-method="handleCustomSort"
          @row-click="handleCustomRowClick"
        >
          <wd-table-col prop="name" label="姓名" sortable fixed align="center" />

          <!-- 自定义分数列 -->
          <wd-table-col prop="grade" label="分数" sortable fixed align="center">
            <template #value="{ row }">
              <view class="custom-grade-cell">
                <wd-text :text="String(row.grade)" />
                <wd-text :text="`同比${row.compare}`" class="text-xs text-gray-500" />
              </view>
            </template>
          </wd-table-col>

          <wd-table-col prop="hobby" label="爱好" :width="180" />
          <wd-table-col prop="school" label="学校" :width="180" />
          <wd-table-col prop="major" label="专业" :width="200" />
          <wd-table-col prop="gender" label="性别" />
        </wd-table>
      </wd-cell>

      <template #codes>
        <DemoCode title="模板 - 自定义列模板" :code="codes.custom.template" />
        <DemoCode title="脚本 - 自定义列模板" :code="codes.custom.script" />
      </template>
    </DemoSection>

    <!-- 配置式表格示例 -->
    <DemoSection title="配置式表格" desc="通过 columns 属性配置表格列，支持自定义渲染函数">
      <view class="space-y-4">
        <!-- 基础配置式 -->
        <wd-cell title="配置式表格" vertical>
          <wd-table
            :data="fullData"
            :columns="configColumns"
            :height="350"
            @sort-method="handleConfigSort"
            @row-click="handleConfigRowClick"
          />
        </wd-cell>

        <!-- 带自定义渲染函数 -->
        <wd-cell title="带渲染函数的配置式表格" vertical>
          <wd-table
            :data="fullData"
            :columns="renderColumns"
            :height="350"
            @sort-method="handleRenderSort"
          />
        </wd-cell>
      </view>

      <template #codes>
        <DemoCode title="模板 - 配置式表格" :code="codes.config.template" />
        <DemoCode title="模板 - 带渲染函数" :code="codes.config.renderTemplate" />
        <DemoCode title="脚本 - 配置式表格" :code="codes.config.script" />
      </template>
    </DemoSection>

    <!-- 事件监听示例 -->
    <DemoSection title="事件监听" desc="监听表格的排序和行点击事件">
      <!-- 状态显示区域 -->
      <view class="space-y-4">
        <!-- 可交互表格 -->
        <wd-cell title="事件监听表格" vertical>
          <wd-table
            :data="eventData"
            :height="350"
            @sort-method="handleEventSort"
            @row-click="handleEventRowClick"
          >
            <wd-table-col prop="name" label="姓名" sortable align="center" />
            <wd-table-col prop="grade" label="分数" sortable align="center" />
            <wd-table-col prop="status" label="状态" align="center" />
          </wd-table>
        </wd-cell>

        <!-- 事件日志显示 -->
        <view class="mx-4 rounded-lg bg-gray-50 p-4">
          <view class="mb-2 text-sm font-medium">事件日志</view>
          <view class="h-32 overflow-y-auto border rounded bg-white p-2">
            <view
              v-for="(log, index) in eventLogs"
              :key="index"
              class="mb-1 text-xs"
              :class="getLogColor(log.type)"
            >
              <text class="text-gray-400">[{{ log.time }}]</text>
              {{ log.message }}
            </view>
            <view v-if="eventLogs.length === 0" class="py-4 text-center text-gray-400">
              暂无事件日志
            </view>
          </view>
          <view class="mt-2">
            <wd-button size="small" @click="clearEventLogs">清空日志</wd-button>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="事件监听模板" :code="codes.events.template" />
        <DemoCode title="事件处理方法" :code="codes.events.methods" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import type { TableColumn } from '@/wd/components/wd-table/wd-table.vue'
import { computed, ref } from 'vue'

// ===== 数据接口定义 =====

/**
 * 表格基础数据接口
 */
interface BasicTableData {
  name: string
  grade: number
}

/**
 * 表格完整数据接口
 */
interface FullTableData extends BasicTableData {
  school: string
  major: string
  gender: string
  graduation: string
  compare: string
  hobby: string
  status: string
}

/**
 * 事件日志接口
 */
interface EventLog {
  time: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

// ===== 组件状态管理 =====

// 分页相关状态
const currentPage = ref<number>(1)
const pageSize = ref<number>(5)
const totalCount = ref<number>(0)

// 事件日志状态
const eventLogs = ref<EventLog[]>([])

// 基础表格数据
const basicData = ref<BasicTableData[]>([
  { name: '关羽', grade: 66 },
  { name: '刘备', grade: 68 },
  { name: '赵云', grade: 91 },
  { name: '诸葛亮', grade: 99 },
  { name: '张飞', grade: 85 },
])

// 完整表格数据
const fullData = ref<FullTableData[]>([
  {
    name: '关羽',
    school: '武汉市阳逻绿豆学院',
    major: '计算机科学与技术专业',
    gender: '男',
    graduation: '2022年1月12日',
    grade: 66,
    compare: '48%',
    hobby: '颜良文丑, 一武官之, 如土鸡瓦犬耳',
    status: '在读',
  },
  {
    name: '刘备',
    school: '武汉市阳逻编织学院',
    major: '计算机科学与技术专业',
    gender: '男',
    graduation: '2022年1月12日',
    grade: 68,
    compare: '21%',
    hobby: '我的孔明如鱼得水也',
    status: '毕业',
  },
  {
    name: '赵云',
    school: '武汉市阳逻扶幼保健学院',
    major: '计算机科学与技术专业',
    gender: '男',
    graduation: '2022年1月12日',
    grade: 91,
    compare: '12%',
    hobby: '子龙, 子龙, 世无双',
    status: '在读',
  },
  {
    name: '诸葛亮',
    school: '武汉市阳逻卧龙学院',
    major: '计算机科学与技术专业',
    gender: '男',
    graduation: '2022年1月12日',
    grade: 99,
    compare: '18%',
    hobby: '兴汉讨贼, 克复中原',
    status: '毕业',
  },
  {
    name: '张飞',
    school: '武汉市阳逻屠夫学院',
    major: '计算机科学与技术专业',
    gender: '男',
    graduation: '2022年1月12日',
    grade: 85,
    compare: '15%',
    hobby: '燕人张翼德在此',
    status: '在读',
  },
  {
    name: '马超',
    school: '武汉市阳逻骑兵学院',
    major: '计算机科学与技术专业',
    gender: '男',
    graduation: '2022年1月12日',
    grade: 88,
    compare: '25%',
    hobby: '锦马超',
    status: '毕业',
  },
  {
    name: '黄忠',
    school: '武汉市阳逻射箭学院',
    major: '计算机科学与技术专业',
    gender: '男',
    graduation: '2022年1月12日',
    grade: 92,
    compare: '30%',
    hobby: '老当益壮',
    status: '在读',
  },
  {
    name: '魏延',
    school: '武汉市阳逻武将学院',
    major: '计算机科学与技术专业',
    gender: '男',
    graduation: '2022年1月12日',
    grade: 76,
    compare: '8%',
    hobby: '勇猛无双',
    status: '毕业',
  },
])

// 事件监听数据
const eventData = ref<FullTableData[]>([
  { ...fullData.value[0], status: '可点击' },
  { ...fullData.value[1], status: '可排序' },
  { ...fullData.value[2], status: '可点击' },
  { ...fullData.value[3], status: '可排序' },
])

// 设置总数
totalCount.value = fullData.value.length

// 分页数据计算
const paginationData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return fullData.value.slice(start, end)
})

// 配置式表格列定义
const configColumns = ref<TableColumn[]>([
  { prop: 'name', label: '姓名', width: 120, align: 'center', sortable: true },
  { prop: 'grade', label: '分数', width: 100, align: 'center', sortable: true },
  { prop: 'school', label: '学校', width: 200, align: 'left' },
  { prop: 'major', label: '专业', width: 180, align: 'left' },
])

// 带渲染函数的配置式表格列
const renderColumns = ref<TableColumn[]>([
  {
    prop: 'name',
    label: '姓名',
    width: 120,
    align: 'center',
    render: (row: FullTableData) => `👤 ${row.name}`,
  },
  {
    prop: 'grade',
    label: '分数',
    width: 120,
    align: 'center',
    render: (row: FullTableData) => `${row.grade}分 (${row.compare})`,
  },
  {
    prop: 'status',
    label: '状态',
    width: 100,
    align: 'center',
    render: (row: FullTableData) => (row.status === '在读' ? '📚 在读' : '🎓 毕业'),
  },
])

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    basicTemplate: `<wd-table
  :data="basicData"
  :height="400"
  @sort-method="handleBasicSort"
  @row-click="handleBasicRowClick"
>
  <wd-table-col prop="name" label="姓名" align="center" width="50%" />
  <wd-table-col prop="grade" label="分数" align="center" width="50%" />
</wd-table>`,

    noBorderTemplate: `<wd-table
  :data="basicData"
  :height="300"
  :border="false"
  @sort-method="handleBasicSort"
>
  <wd-table-col prop="name" label="姓名" align="center" width="50%" />
  <wd-table-col prop="grade" label="分数" align="center" width="50%" />
</wd-table>`,

    noStripeTemplate: `<wd-table
  :data="basicData"
  :height="300"
  :stripe="false"
  @sort-method="handleBasicSort"
>
  <wd-table-col prop="name" label="姓名" align="center" width="50%" />
  <wd-table-col prop="grade" label="分数" align="center" width="50%" />
</wd-table>`,

    script: `import { ref } from 'vue'

// 基础表格数据
const basicData = ref([
  { name: '关羽', grade: 66 },
  { name: '刘备', grade: 68 },
  { name: '赵云', grade: 91 },
  { name: '诸葛亮', grade: 99 },
  { name: '张飞', grade: 85 },
])

// 基本排序处理
const handleBasicSort = (column) => {
  console.log('排序列:', column)
}

// 基本行点击处理
const handleBasicRowClick = ({ rowIndex }) => {
  console.log('点击行索引:', rowIndex)
}`,
  },

  // 高级配置代码
  advanced: {
    noHeaderTemplate: `<wd-table
  :data="basicData"
  :height="300"
  :show-header="false"
  @row-click="handleAdvancedRowClick"
>
  <wd-table-col prop="name" label="姓名" align="center" width="50%" />
  <wd-table-col prop="grade" label="分数" align="center" width="50%" />
</wd-table>`,

    indexTemplate: `<wd-table
  :data="fullData"
  :height="350"
  :index="{ align: 'center' }"
  @sort-method="handleAdvancedSort"
  @row-click="handleAdvancedRowClick"
>
  <wd-table-col prop="name" label="姓名" sortable align="center" />
  <wd-table-col prop="grade" label="分数" sortable align="center" />
  <wd-table-col prop="hobby" label="爱好" :width="180" />
</wd-table>`,

    noFixedTemplate: `<wd-table
  :data="paginationData"
  :fixed-header="false"
  @sort-method="handleAdvancedSort"
>
  <wd-table-col prop="name" label="姓名" align="center" />
  <wd-table-col prop="grade" label="分数" align="center" />
  <wd-table-col prop="school" label="学校" :width="200" />
</wd-table>

<!-- 分页组件 -->
<wd-pagination
  v-model="currentPage"
  :total="totalCount"
  :page-size="pageSize"
/>`,

    script: `// 分页相关状态
const currentPage = ref(1)
const pageSize = ref(5)
const totalCount = ref(0)

// 分页数据计算
const paginationData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return fullData.value.slice(start, end)
})

// 高级配置事件处理
const handleAdvancedSort = (column) => {
  console.log('高级排序:', column)
}

const handleAdvancedRowClick = ({ rowIndex }) => {
  console.log('高级行点击:', rowIndex)
}`,
  },

  // 固定列代码
  fixed: {
    template: `<wd-table
  :data="fullData"
  :height="400"
  @sort-method="handleFixedSort"
  @row-click="handleFixedRowClick"
>
  <wd-table-col prop="name" label="姓名" sortable fixed align="center" />
  <wd-table-col prop="grade" label="分数" sortable fixed align="center" />
  <wd-table-col prop="hobby" label="爱好" sortable :width="160" />
  <wd-table-col prop="school" label="学校" :width="180" />
  <wd-table-col prop="major" label="专业" :width="200" />
  <wd-table-col prop="gender" label="性别" />
</wd-table>`,

    script: `// 固定列事件处理
const handleFixedSort = (column) => {
  console.log('固定列排序:', column)
}

const handleFixedRowClick = ({ rowIndex }) => {
  console.log('固定列行点击:', rowIndex)
}`,
  },

  // 自定义列模板代码
  custom: {
    template: `<wd-table
  :data="fullData"
  :height="400"
  @sort-method="handleCustomSort"
  @row-click="handleCustomRowClick"
>
  <wd-table-col prop="name" label="姓名" sortable fixed align="center" />

  <!-- 自定义分数列 -->
  <wd-table-col prop="grade" label="分数" sortable fixed align="center">
    <template #value="{ row }">
      <view class="custom-grade-cell">
        <wd-text :text="String(row.grade)" />
        <wd-text :text="\`同比\${row.compare}\`" class="text-xs text-gray-500" />
      </view>
    </template>
  </wd-table-col>

  <wd-table-col prop="hobby" label="爱好" :width="180" />
  <wd-table-col prop="school" label="学校" :width="180" />
  <wd-table-col prop="major" label="专业" :width="200" />
  <wd-table-col prop="gender" label="性别" />
</wd-table>`,

    script: `// 自定义列事件处理
const handleCustomSort = (column) => {
  console.log('自定义列排序:', column)
}

const handleCustomRowClick = ({ rowIndex }) => {
  console.log('自定义列行点击:', rowIndex)
}`,
  },

  // 配置式表格代码
  config: {
    template: `<wd-table
  :data="fullData"
  :columns="configColumns"
  :height="350"
  @sort-method="handleConfigSort"
  @row-click="handleConfigRowClick"
/>`,

    renderTemplate: `<wd-table
  :data="fullData"
  :columns="renderColumns"
  :height="350"
  @sort-method="handleRenderSort"
/>`,

    script: `// 配置式表格列定义
const configColumns = ref([
  { prop: 'name', label: '姓名', width: 120, align: 'center', sortable: true },
  { prop: 'grade', label: '分数', width: 100, align: 'center', sortable: true },
  { prop: 'school', label: '学校', width: 200, align: 'left' },
  { prop: 'major', label: '专业', width: 180, align: 'left' },
])

// 带渲染函数的配置式表格列
const renderColumns = ref([
  {
    prop: 'name',
    label: '姓名',
    width: 120,
    align: 'center',
    render: (row) => \`👤 \${row.name}\`
  },
  {
    prop: 'grade',
    label: '分数',
    width: 120,
    align: 'center',
    render: (row) => \`\${row.grade}分 (\${row.compare})\`
  },
  {
    prop: 'status',
    label: '状态',
    width: 100,
    align: 'center',
    render: (row) => row.status === '在读' ? '📚 在读' : '🎓 毕业'
  },
])`,
  },

  // 事件监听代码
  events: {
    template: `
      <wd-table
        :data="eventData"
        :height="350"
        @sort-method="handleEventSort"
        @row-click="handleEventRowClick"
      >
        <wd-table-col prop="name" label="姓名" sortable align="center" />
        <wd-table-col prop="grade" label="分数" sortable align="center" />
        <wd-table-col prop="status" label="状态" align="center" />
      </wd-table>`,

    methods: `// 事件日志管理
const eventLogs = ref([])

const addEventLog = (message, type = 'info') => {
  eventLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
    type,
  })
  // 限制日志数量
  if (eventLogs.value.length > 20) {
    eventLogs.value = eventLogs.value.slice(0, 20)
  }
}

const handleEventSort = (column) => {
  addEventLog(\`排序列: \${column.label} (字段: \${column.prop})\`, 'success')
}

const handleEventRowClick = ({ rowIndex }) => {
  const rowData = eventData.value[rowIndex]
  addEventLog(\`点击行: \${rowData.name} (索引: \${rowIndex})\`, 'info')
}

const clearEventLogs = () => {
  eventLogs.value = []
  addEventLog('事件日志已清空', 'info')
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'data',
    type: 'Array<Record<string, any>>',
    default: '[]',
    desc: '显示的数据数组',
  },
  {
    name: 'columns',
    type: 'TableColumn[]',
    default: '[]',
    desc: '列配置数组（配置式使用）',
  },
  {
    name: 'border',
    type: 'Boolean',
    default: 'true',
    desc: '是否带有边框',
  },
  {
    name: 'stripe',
    type: 'Boolean',
    default: 'true',
    desc: '是否为斑马纹表格',
  },
  {
    name: 'height',
    type: 'String | Number',
    default: '""',
    desc: '表格的高度',
  },
  {
    name: 'row-height',
    type: 'String | Number',
    default: '100',
    desc: '行高',
  },
  {
    name: 'show-header',
    type: 'Boolean',
    default: 'true',
    desc: '是否显示表头',
  },
  {
    name: 'ellipsis',
    type: 'Boolean',
    default: 'true',
    desc: '是否超出2行隐藏',
  },
  {
    name: 'index',
    type: 'Boolean | Partial<TableColumn>',
    default: 'false',
    desc: '是否显示索引列，支持传入配置对象',
  },
  {
    name: 'fixed-header',
    type: 'Boolean',
    default: 'true',
    desc: '是否固定表头',
  },
  {
    name: 'custom-style',
    type: 'String',
    default: '""',
    desc: '自定义根节点样式',
  },
  {
    name: 'custom-class',
    type: 'String',
    default: '""',
    desc: '自定义根节点样式类',
  },
]

// Methods 方法文档（Table 组件没有暴露方法）
const apiMethods: any[] = []

// Events 事件文档
const apiEvents = [
  {
    name: 'sort-method',
    desc: '排序方法触发，参数为 { column: TableColumn }',
  },
  {
    name: 'row-click',
    desc: '行点击事件，参数为 { rowIndex: number }',
  },
]

// ===== 工具方法 =====

/**
 * 添加事件日志
 */
const addEventLog = (message: string, type: EventLog['type'] = 'info') => {
  eventLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
    type,
  })
  // 限制日志数量
  if (eventLogs.value.length > 20) {
    eventLogs.value = eventLogs.value.slice(0, 20)
  }
}

/**
 * 清空事件日志
 */
const clearEventLogs = () => {
  eventLogs.value = []
  addEventLog('事件日志已清空', 'info')
}

/**
 * 获取日志颜色类名
 */
const getLogColor = (type: EventLog['type']) => {
  const colors = {
    info: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-orange-600',
    error: 'text-red-600',
  }
  return colors[type]
}

// ===== 事件处理方法 =====

// === 基本用法事件处理 ===

/**
 * 基本排序处理
 */
const handleBasicSort = (column: TableColumn) => {
  console.log('基本排序:', column)
  // 简单的反转排序示例
  basicData.value = basicData.value.reverse()
}

/**
 * 基本行点击处理
 */
const handleBasicRowClick = ({ rowIndex }: { rowIndex: number }) => {
  console.log('基本行点击:', rowIndex, basicData.value[rowIndex])
}

// === 高级配置事件处理 ===

/**
 * 高级配置排序处理
 */
const handleAdvancedSort = (column: TableColumn) => {
  console.log('高级配置排序:', column)
  // 根据字段进行排序
  if (column.prop === 'grade') {
    fullData.value.sort((a, b) => {
      return column.sortDirection === 1 ? a.grade - b.grade : b.grade - a.grade
    })
  }
}

/**
 * 高级配置行点击处理
 */
const handleAdvancedRowClick = ({ rowIndex }: { rowIndex: number }) => {
  console.log('高级配置行点击:', rowIndex, fullData.value[rowIndex])
}

// === 固定列事件处理 ===

/**
 * 固定列排序处理
 */
const handleFixedSort = (column: TableColumn) => {
  console.log('固定列排序:', column)
  // 按姓名排序示例
  if (column.prop === 'name') {
    fullData.value.sort((a, b) => {
      return column.sortDirection === 1
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    })
  }
}

/**
 * 固定列行点击处理
 */
const handleFixedRowClick = ({ rowIndex }: { rowIndex: number }) => {
  console.log('固定列行点击:', rowIndex, fullData.value[rowIndex])
}

// === 自定义列模板事件处理 ===

/**
 * 自定义列排序处理
 */
const handleCustomSort = (column: TableColumn) => {
  console.log('自定义列排序:', column)
  if (column.prop === 'grade') {
    fullData.value.sort((a, b) => b.grade - a.grade)
  }
}

/**
 * 自定义列行点击处理
 */
const handleCustomRowClick = ({ rowIndex }: { rowIndex: number }) => {
  console.log('自定义列行点击:', rowIndex, fullData.value[rowIndex])
}

// === 配置式表格事件处理 ===

/**
 * 配置式排序处理
 */
const handleConfigSort = (column: TableColumn) => {
  console.log('配置式排序:', column)
}

/**
 * 配置式行点击处理
 */
const handleConfigRowClick = ({ rowIndex }: { rowIndex: number }) => {
  console.log('配置式行点击:', rowIndex, fullData.value[rowIndex])
}

/**
 * 带渲染函数排序处理
 */
const handleRenderSort = (column: TableColumn) => {
  console.log('渲染函数排序:', column)
}

// === 事件监听处理 ===

/**
 * 事件监听排序处理
 */
const handleEventSort = (column: TableColumn) => {
  addEventLog(`排序列: ${column.label} (字段: ${column.prop})`, 'success')

  // 实际排序逻辑
  if (column.prop === 'grade') {
    eventData.value.sort((a, b) => b.grade - a.grade)
  } else if (column.prop === 'name') {
    eventData.value.sort((a, b) => a.name.localeCompare(b.name))
  }
}

/**
 * 事件监听行点击处理
 */
const handleEventRowClick = ({ rowIndex }: { rowIndex: number }) => {
  const rowData = eventData.value[rowIndex]
}

const { resetScrollTop, updateScrollTop } = useScroll()
onShow(() => {
  resetScrollTop()
})
onPageScroll((e) => {
  updateScrollTop(e.scrollTop)
})
</script>

<style lang="scss" scoped>
// 自定义分数列样式
.custom-grade-cell {
  height: 80rpx;
  width: 220rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
