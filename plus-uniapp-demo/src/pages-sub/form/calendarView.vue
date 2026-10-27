<!-- CalendarView 日历视图 http://127.0.0.1:100/#/pages-sub/demo/wd/calendarView -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="CalendarView 日历视图" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="支持单个日期、多个日期、日期范围等选择模式">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="单个日期选择" :value="formatSingleValue(value1, 'date')" />
        <wd-cell
          title="多个日期选择"
          :value="`已选择 ${Array.isArray(value2) ? value2.length : 0} 个日期`"
        />
        <wd-cell title="日期范围选择" :value="formatRangeValue(value3)" />
      </wd-cell-group>

      <!-- 日历组件展示 -->
      <view class="space-y-4">
        <!-- 单个日期选择 -->
        <view class="border border-gray-200 rounded-lg p-4">
          <view class="mb-2 text-sm text-gray-700 font-medium">单个日期选择</view>
          <wd-calendar-view v-model="value1" type="date" @change="handleBasicChange1" />
        </view>

        <!-- 多个日期选择 -->
        <view class="border border-gray-200 rounded-lg p-4">
          <view class="mb-2 text-sm text-gray-700 font-medium">多个日期选择</view>
          <view class="mb-2 text-xs text-gray-500">已选择：{{ formatMultipleDates(value2) }}</view>
          <wd-calendar-view v-model="value2" type="dates" @change="handleBasicChange2" />
        </view>

        <!-- 日期范围选择 -->
        <view class="border border-gray-200 rounded-lg p-4">
          <view class="mb-2 text-sm text-gray-700 font-medium">日期范围选择</view>
          <view class="mb-2 text-xs text-gray-500">当前范围：{{ formatRangeValueFromString(value3String) }}</view>

          <!-- 双向绑定输入框 - 使用字符串模式自动同步 -->
          <view class="mb-3 space-y-2">
            <wd-input
              v-model="value3String[0]"
              label="开始日期"
              placeholder="请输入开始日期 (YYYY-MM-DD)"
            />
            <wd-input
              v-model="value3String[1]"
              label="结束日期"
              placeholder="请输入结束日期 (YYYY-MM-DD)"
            />
          </view>

          <wd-calendar-view
            v-model="value3String"
            type="daterange"
            value-format="string"
            string-format="YYYY-MM-DD"
            @change="handleBasicChange3"
          />
        </view>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 单个日期选择" :code="codes.basic.singleTemplate" />
        <DemoCode title="模板 - 多个日期选择" :code="codes.basic.multipleTemplate" />
        <DemoCode title="模板 - 日期范围选择" :code="codes.basic.rangeTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 选择类型示例 -->
    <DemoSection title="选择类型" desc="支持日期、周、月等不同的选择类型">
      <wd-cell-group>
        <wd-cell title="当前类型" :value="typeOptions[currentType]" />
        <wd-cell title="当前选择" :value="formatSingleValue(typeValue, currentType)" />
      </wd-cell-group>

      <!-- 类型切换 -->
      <view class="space-y-4">
        <view class="px-4">
          <view class="mb-2 text-sm text-gray-700 font-medium">选择类型</view>
          <wd-radio-group v-model="currentType" shape="button" @change="handleTypeChange">
            <wd-radio value="date">日期</wd-radio>
            <wd-radio value="week">周</wd-radio>
            <wd-radio value="month">月</wd-radio>
          </wd-radio-group>
        </view>

        <!-- 日历展示 -->
        <view class="border border-gray-200 rounded-lg p-4">
          <wd-calendar-view
            v-model="typeValue"
            :type="currentType"
            @change="handleTypeValueChange"
          />
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 类型切换" :code="codes.types.template" />
        <DemoCode title="脚本 - 类型切换" :code="codes.types.script" />
      </template>
    </DemoSection>

    <!-- 时间选择示例 -->
    <DemoSection title="时间选择" desc="支持日期时间和时间范围的精确选择">
      <wd-cell-group>
        <wd-cell title="日期时间" :value="formatDateTime(datetimeValue)" />
        <wd-cell title="时间范围" :value="formatDateTimeRange(datetimeRangeValue)" />
        <wd-cell title="时间过滤" :value="timeFilterEnabled ? '已启用' : '未启用'" />
      </wd-cell-group>

      <view class="space-y-4">
        <!-- 时间过滤开关 -->
        <view class="px-4">
          <wd-checkbox v-model="timeFilterEnabled" shape="square" size="large">
            启用时间过滤（只显示整10分钟）
          </wd-checkbox>
        </view>

        <!-- 日期时间选择 -->
        <view class="border border-gray-200 rounded-lg p-4">
          <view class="mb-2 text-sm text-gray-700 font-medium">日期时间选择</view>
          <wd-calendar-view
            v-model="datetimeValue"
            type="datetime"
            :time-filter="timeFilterEnabled ? timeFilter : undefined"
            @change="handleDatetimeChange"
          />
        </view>

        <!-- 时间范围选择 -->
        <view class="border border-gray-200 rounded-lg p-4">
          <view class="mb-2 text-sm text-gray-700 font-medium">时间范围选择</view>

          <!-- 双向绑定输入框 - 使用字符串模式自动同步 -->
          <view class="mb-3 space-y-2">
            <wd-input
              v-model="datetimeRangeStringValue[0]"
              label="开始时间"
              placeholder="请输入开始时间 (YYYY-MM-DD HH:mm)"
            />
            <wd-input
              v-model="datetimeRangeStringValue[1]"
              label="结束时间"
              placeholder="请输入结束时间 (YYYY-MM-DD HH:mm)"
            />
          </view>

          <wd-calendar-view
            v-model="datetimeRangeStringValue"
            type="datetimerange"
            value-format="string"
            string-format="YYYY-MM-DD HH:mm"
            hide-second
            @change="handleDatetimeRangeChange"
          />
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 日期时间选择" :code="codes.datetime.template" />
        <DemoCode title="模板 - 时间范围选择" :code="codes.datetime.rangeTemplate" />
        <DemoCode title="脚本 - 时间选择" :code="codes.datetime.script" />
      </template>
    </DemoSection>

    <!-- 高级配置示例 -->
    <DemoSection title="高级配置" desc="最大范围限制、周起始日设置等高级配置选项">
      <wd-cell-group>
        <wd-cell title="最大范围限制" :value="`${maxRangeValue}天`" />
        <wd-cell title="周起始日" :value="firstDayOfWeek === '0' ? '周日' : '周一'" />
        <wd-cell title="当前限制范围" :value="formatRangeValue(limitedRangeValue)" />
      </wd-cell-group>

      <view class="space-y-4">
        <!-- 最大范围设置 -->
        <view class="px-4">
          <view class="mb-2 text-sm text-gray-700 font-medium">最大范围设置</view>
          <wd-radio-group v-model="maxRangeValue" shape="button" @change="handleMaxRangeChange">
            <wd-radio value="3">3天</wd-radio>
            <wd-radio value="7">7天</wd-radio>
            <wd-radio value="15">15天</wd-radio>
            <wd-radio value="30">30天</wd-radio>
          </wd-radio-group>
        </view>

        <!-- 周起始日设置 -->
        <view class="px-4">
          <view class="mb-2 text-sm text-gray-700 font-medium">周起始日设置</view>
          <wd-radio-group v-model="firstDayOfWeek" shape="button" @change="handleFirstDayChange">
            <wd-radio value="0">周日开始</wd-radio>
            <wd-radio value="1">周一开始</wd-radio>
          </wd-radio-group>
        </view>

        <!-- 限制范围日历 -->
        <view class="border border-gray-200 rounded-lg p-4">
          <view class="mb-2 text-sm text-gray-700 font-medium">限制最大范围的日期选择</view>

          <!-- 双向绑定输入框 - 使用字符串模式自动同步 -->
          <view class="mb-3 space-y-2">
            <wd-input
              v-model="limitedRangeStringValue[0]"
              label="开始日期"
              placeholder="请输入开始日期 (YYYY-MM-DD)"
            />
            <wd-input
              v-model="limitedRangeStringValue[1]"
              label="结束日期"
              placeholder="请输入结束日期 (YYYY-MM-DD)"
            />
          </view>

          <wd-calendar-view
            v-model="limitedRangeStringValue"
            type="daterange"
            value-format="string"
            string-format="YYYY-MM-DD"
            :max-range="parseInt(maxRangeValue)"
            :first-day-of-week="parseInt(firstDayOfWeek)"
            @change="handleLimitedRangeChange"
          />
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 最大范围限制" :code="codes.advanced.maxRangeTemplate" />
        <DemoCode title="模板 - 周起始日设置" :code="codes.advanced.firstDayTemplate" />
        <DemoCode title="脚本 - 高级配置" :code="codes.advanced.script" />
      </template>
    </DemoSection>

    <!-- 自定义格式化示例 -->
    <DemoSection title="自定义格式化" desc="自定义日期显示内容，支持节日标记、特殊日期提醒等">
      <!-- 格式化选项 -->
      <view class="space-y-4">
        <view class="px-4">
          <view class="mb-2 text-sm text-gray-700 font-medium">格式化选项</view>
          <wd-checkbox-group v-model="formatterOptions" direction="horizontal">
            <wd-checkbox value="today">标记今天</wd-checkbox>
            <wd-checkbox value="festivals">显示节日</wd-checkbox>
            <wd-checkbox value="range">范围标记</wd-checkbox>
          </wd-checkbox-group>
        </view>

        <wd-cell-group>
          <wd-cell title="当前范围" :value="formatRangeValue(formattedValue)" />
          <wd-cell title="已启用" :value="formatterOptions.join(', ') || '无'" />
        </wd-cell-group>

        <!-- 自定义格式化日历 -->
        <view class="border border-gray-200 rounded-lg p-4">
          <view class="mb-2 text-sm text-gray-700 font-medium">自定义格式化日历</view>
          <wd-calendar-view
            v-model="formattedValue"
            type="daterange"
            allow-same-day
            :formatter="customFormatter"
            @change="handleFormattedChange"
          />
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 自定义格式化" :code="codes.formatter.template" />
        <DemoCode title="脚本 - 格式化器实现" :code="codes.formatter.script" />
      </template>
    </DemoSection>

    <!-- 方法控制示例 -->
    <DemoSection title="方法控制" desc="通过组件方法实现滚动控制等高级功能">
      <!-- 状态显示 -->
      <wd-cell-group>
        <wd-cell title="选择次数" :value="selectionCount.toString()" />
        <wd-cell title="活跃类型" :value="activeType || '无'" />
        <wd-cell title="最后选择" :value="lastSelectedValue || '无'" />
      </wd-cell-group>

      <!-- 控制按钮 -->
      <view class="space-y-4">
        <view class="px-4">
          <view class="mb-2 text-sm text-gray-700 font-medium">滚动控制</view>
          <view class="mb-2">
            <wd-radio-group v-model="activeCalendarIndex" direction="horizontal" shape="button">
              <wd-radio value="0">基础日历</wd-radio>
              <wd-radio value="1">类型日历</wd-radio>
              <wd-radio value="2">时间日历</wd-radio>
            </wd-radio-group>
          </view>
          <view class="flex flex-wrap gap-2">
            <wd-button size="small" @click="scrollToToday">滚动到今天</wd-button>
            <wd-button size="small" type="info" @click="scrollToNextMonth">下个月</wd-button>
            <wd-button size="small" type="success" @click="scrollToPrevMonth">上个月</wd-button>
          </view>
        </view>

        <view class="px-4">
          <view class="mb-2 text-sm text-gray-700 font-medium">快速设置</view>
          <view class="flex flex-wrap gap-2">
            <wd-button size="small" type="warning" @click="setRandomDate">设置随机日期</wd-button>
            <wd-button size="small" type="warning" @click="setRandomRange">设置随机范围</wd-button>
            <wd-button size="small" type="error" @click="clearAllValues">清空所有值</wd-button>
          </view>
        </view>

        <!-- 方法控制的日历 -->
        <view class="border border-gray-200 rounded-lg p-4">
          <view class="mb-2 text-sm text-gray-700 font-medium">方法控制演示日历</view>
          <wd-calendar-view
            ref="controlCalendarRef"
            v-model="controlValue"
            type="daterange"
            @change="handleControlChange"
          />
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 方法控制" :code="codes.methods.template" />
        <DemoCode title="脚本 - 方法控制" :code="codes.methods.script" />
      </template>
    </DemoSection>

    <!-- 实际应用场景 -->
    <DemoSection title="实际应用场景" desc="常见的业务场景示例">
      <!-- 日程管理场景 -->
      <view class="space-y-4">
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">日程管理系统</view>
          <wd-cell-group>
            <wd-cell title="会议安排" :value="formatRangeValue(meetingSchedule)" />
            <wd-cell title="项目截止日期" :value="formatMultipleDates(projectDeadlines)" />
            <wd-cell title="休假申请" :value="formatRangeValue(vacationDates)" />
          </wd-cell-group>

          <!-- 快速操作 -->
          <view class="mt-3 px-4">
            <view class="flex flex-wrap gap-2">
              <wd-button size="small" @click="setMeetingThisWeek">本周会议</wd-button>
              <wd-button size="small" type="info" @click="addProjectDeadline">
                添加截止日期
              </wd-button>
              <wd-button size="small" type="success" @click="planVacation">计划休假</wd-button>
            </view>
          </view>
        </view>

        <!-- 数据分析场景 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">数据分析时间段</view>
          <wd-cell-group>
            <wd-cell title="分析时间段" :value="formatDateTimeRange(analysisTimeRange)" />
            <wd-cell title="对比基准" :value="formatRangeValue(comparisonPeriod)" />
          </wd-cell-group>

          <view class="mt-3 px-4">
            <view class="flex flex-wrap gap-2">
              <wd-button size="small" type="warning" @click="setLastQuarter">上季度数据</wd-button>
              <wd-button size="small" type="warning" @click="setYearComparison">年度对比</wd-button>
            </view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 日程管理" :code="codes.scenarios.scheduleTemplate" />
        <DemoCode title="脚本 - 日程管理" :code="codes.scenarios.scheduleScript" />
        <DemoCode title="模板 - 数据分析" :code="codes.scenarios.analysisTemplate" />
        <DemoCode title="脚本 - 数据分析" :code="codes.scenarios.analysisScript" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import type { CalendarFormatter } from '@/wd/components/wd-calendar-view/wd-calendar-view.vue'
import { ref } from 'vue'
import { useToast } from '@/wd'
import { useScroll } from '@/composables/useScroll'
import { onPageScroll, onShow } from '@dcloudio/uni-app'

// ===== 工具方法（需要提前定义供初始化使用） =====

/**
 * 格式化时间戳为 YYYY-MM-DD HH:mm 字符串（用于初始化）
 */
const formatDateTimeToString = (timestamp: number): string => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// ===== 组件状态管理 =====

// Toast 实例
const toast = useToast()

// 组件引用
const controlCalendarRef = ref()

// 基础示例数据
const value1 = ref<number>(Date.now())
const value2 = ref<number[]>([])
const value3 = ref<number[]>([Date.now() - 7 * 24 * 60 * 60 * 1000, Date.now()])

// 使用字符串格式的日期范围数据(新功能演示)
const value3String = ref<string[]>([
  new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  new Date(Date.now()).toISOString().split('T')[0],
])

// 使用字符串格式的时间范围数据(新功能演示)
const datetimeRangeStringValue = ref<string[]>([
  formatDateTimeToString(Date.now() - 3 * 24 * 60 * 60 * 1000),
  formatDateTimeToString(Date.now()),
])

// 使用字符串格式的限制范围数据(新功能演示)
const limitedRangeStringValue = ref<string[]>([
  new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  new Date(Date.now()).toISOString().split('T')[0],
])

// 类型选择示例数据
const currentType = ref<string>('date')
const typeValue = ref<number>(Date.now())
const typeOptions = {
  date: '日期选择',
  week: '周选择',
  month: '月选择',
}

// 时间选择示例数据
const datetimeValue = ref<number>(Date.now())
const datetimeRangeValue = ref<number[]>([Date.now() - 3 * 24 * 60 * 60 * 1000, Date.now()])
const timeFilterEnabled = ref<boolean>(false)

// 高级配置示例数据
const maxRangeValue = ref<string>('7')
const firstDayOfWeek = ref<string>('0')
const limitedRangeValue = ref<number[]>([Date.now() - 2 * 24 * 60 * 60 * 1000, Date.now()])

// 自定义格式化示例数据
const formatterOptions = ref<string[]>(['today', 'festivals'])
const formattedValue = ref<number[]>([Date.now() - 3 * 24 * 60 * 60 * 1000, Date.now()])

// 方法控制示例数据
const activeCalendarIndex = ref<string>('0')
const controlValue = ref<number[]>([Date.now() - 5 * 24 * 60 * 60 * 1000, Date.now()])

// 状态监控数据
const selectionCount = ref<number>(0)
const activeType = ref<string>('')
const lastSelectedValue = ref<string>('')

// 应用场景示例数据
const meetingSchedule = ref<number[]>([
  Date.now() + 24 * 60 * 60 * 1000,
  Date.now() + 3 * 24 * 60 * 60 * 1000,
])
const projectDeadlines = ref<number[]>([
  Date.now() + 7 * 24 * 60 * 60 * 1000,
  Date.now() + 14 * 24 * 60 * 60 * 1000,
])
const vacationDates = ref<number[]>([
  Date.now() + 30 * 24 * 60 * 60 * 1000,
  Date.now() + 37 * 24 * 60 * 60 * 1000,
])
const analysisTimeRange = ref<number[]>([Date.now() - 30 * 24 * 60 * 60 * 1000, Date.now()])
const comparisonPeriod = ref<number[]>([
  Date.now() - 60 * 24 * 60 * 60 * 1000,
  Date.now() - 30 * 24 * 60 * 60 * 1000,
])

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    singleTemplate: `<wd-calendar-view
  v-model="value1"
  type="date"
  @change="handleBasicChange1"
/>`,

    multipleTemplate: `<wd-calendar-view
  v-model="value2"
  type="dates"
  @change="handleBasicChange2"
/>`,

    rangeTemplate: `<wd-calendar-view
  v-model="value3"
  type="daterange"
  @change="handleBasicChange3"
/>`,

    script: `import { ref } from 'vue'

// 基础示例数据
const value1 = ref(Date.now())
const value2 = ref([])
const value3 = ref([Date.now() - 7 * 24 * 60 * 60 * 1000, Date.now()])

// 基础事件处理
const handleBasicChange1 = ({ value }) => {
  console.log('单个日期选择：', new Date(value).toLocaleDateString())
}

const handleBasicChange2 = ({ value }) => {
  console.log('多个日期选择：', value?.length || 0, '个日期')
}

const handleBasicChange3 = ({ value }) => {
  console.log('日期范围选择：', value?.map(v => new Date(v).toLocaleDateString()))
}`,
  },

  // 类型切换代码
  types: {
    template: `<template>
  <!-- 类型切换 -->
  <wd-radio-group v-model="currentType" shape="button" @change="handleTypeChange">
    <wd-radio value="date">日期</wd-radio>
    <wd-radio value="week">周</wd-radio>
    <wd-radio value="month">月</wd-radio>
  </wd-radio-group>

  <!-- 日历展示 -->
  <wd-calendar-view
    v-model="typeValue"
    :type="currentType"
    @change="handleTypeValueChange"
  />
</template>`,

    script: `const currentType = ref('date')
const typeValue = ref(Date.now())
const typeOptions = {
  date: '日期选择',
  week: '周选择',
  month: '月选择'
}

const handleTypeChange = ({ value }) => {
  console.log('切换类型为：', value)
}

const handleTypeValueChange = ({ value }) => {
  console.log(\`\${currentType.value}选择：\`, formatSingleValue(value, currentType.value))
}`,
  },

  // 时间选择代码
  datetime: {
    template: `<wd-calendar-view
  v-model="datetimeValue"
  type="datetime"
  :time-filter="timeFilterEnabled ? timeFilter : undefined"
  @change="handleDatetimeChange"
/>`,

    rangeTemplate: `<wd-calendar-view
  v-model="datetimeRangeValue"
  type="datetimerange"
  @change="handleDatetimeRangeChange"
/>`,

    script: `const datetimeValue = ref(Date.now())
const datetimeRangeValue = ref([Date.now() - 3 * 24 * 60 * 60 * 1000, Date.now()])
const timeFilterEnabled = ref(false)

// 时间过滤器
const timeFilter = ({ type, values }) => {
  if (type === 'minute') {
    // 只展示 0,10,20,30,40,50 分钟选项
    return values.filter(item => item.value % 10 === 0)
  }
  return values
}

const handleDatetimeChange = ({ value }) => {
  console.log('日期时间选择：', new Date(value).toLocaleString())
}

const handleDatetimeRangeChange = ({ value }) => {
  console.log('时间范围选择：', value?.map(v => new Date(v).toLocaleString()))
}`,
  },

  // 高级配置代码
  advanced: {
    maxRangeTemplate: `<wd-calendar-view
  v-model="limitedRangeValue"
  type="daterange"
  :max-range="parseInt(maxRangeValue)"
  @change="handleLimitedRangeChange"
/>`,

    firstDayTemplate: `<wd-calendar-view
  v-model="limitedRangeValue"
  type="daterange"
  :first-day-of-week="parseInt(firstDayOfWeek)"
  @change="handleLimitedRangeChange"
/>`,

    script: `const maxRangeValue = ref('7')
const firstDayOfWeek = ref('0')
const limitedRangeValue = ref([Date.now() - 2 * 24 * 60 * 60 * 1000, Date.now()])

const handleMaxRangeChange = ({ value }) => {
  console.log('设置最大范围为：', value, '天')
}

const handleFirstDayChange = ({ value }) => {
  console.log('设置周起始日为：', value === '0' ? '周日' : '周一')
}

const handleLimitedRangeChange = ({ value }) => {
  console.log('限制范围选择：', value?.map(v => new Date(v).toLocaleDateString()))
}`,
  },

  // 自定义格式化代码
  formatter: {
    template: `<wd-calendar-view
  v-model="formattedValue"
  type="daterange"
  allow-same-day
  :formatter="customFormatter"
  @change="handleFormattedChange"
/>`,

    script: `import type { CalendarFormatter } from '@/wd/components/wd-calendar-view/wd-calendar-view.vue'

const formatterOptions = ref(['today', 'festivals'])

// 自定义格式化器
const customFormatter: CalendarFormatter = (day) => {
  const date = new Date(day.date)
  const now = new Date()

  // 标记今天
  if (formatterOptions.value.includes('today') &&
      date.toDateString() === now.toDateString()) {
    day.topInfo = '今天'
  }

  // 显示节日
  if (formatterOptions.value.includes('festivals')) {
    const month = date.getMonth()
    const dayOfMonth = date.getDate()

    if (month === 5 && dayOfMonth === 18) {
      day.topInfo = '618'
    }
    if (month === 10 && dayOfMonth === 11) {
      day.topInfo = '双11'
    }
    if (month === 11 && dayOfMonth === 25) {
      day.topInfo = '圣诞'
    }
  }

  // 范围标记
  if (formatterOptions.value.includes('range')) {
    if (day.type === 'start') {
      day.bottomInfo = '开始'
    }
    if (day.type === 'end') {
      day.bottomInfo = '结束'
    }
    if (day.type === 'same') {
      day.bottomInfo = '开始/结束'
    }
  }

  return day
}`,
  },

  // 方法控制代码
  methods: {
    template: `<template>
  <!-- 滚动控制 -->
  <wd-radio-group v-model="activeCalendarIndex" direction="horizontal" shape="button">
    <wd-radio value="0">基础日历</wd-radio>
    <wd-radio value="1">类型日历</wd-radio>
    <wd-radio value="2">时间日历</wd-radio>
  </wd-radio-group>

  <view class="flex flex-wrap gap-2">
    <wd-button size="small" @click="scrollToToday">滚动到今天</wd-button>
    <wd-button size="small" type="info" @click="scrollToNextMonth">下个月</wd-button>
    <wd-button size="small" type="success" @click="scrollToPrevMonth">上个月</wd-button>
  </view>

  <!-- 方法控制的日历 -->
  <wd-calendar-view
    ref="controlCalendarRef"
    v-model="controlValue"
    type="daterange"
    @change="handleControlChange"
  />
</template>`,

    script: `const activeCalendarIndex = ref('0')
const controlCalendarRef = ref()
const controlValue = ref([Date.now() - 5 * 24 * 60 * 60 * 1000, Date.now()])

// 滚动到今天
const scrollToToday = () => {
  if (controlCalendarRef.value && controlCalendarRef.value.scrollIntoView) {
    const today = Date.now()
    controlValue.value = [today, today]

    setTimeout(() => {
      controlCalendarRef.value.scrollIntoView()
    }, 100)

    toast.show('已滚动到今天')
  }
}

// 滚动到下个月
const scrollToNextMonth = () => {
  if (controlCalendarRef.value && controlCalendarRef.value.scrollIntoView) {
    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    const nextMonthTime = nextMonth.getTime()

    controlValue.value = [nextMonthTime, nextMonthTime + 7 * 24 * 60 * 60 * 1000]

    setTimeout(() => {
      controlCalendarRef.value.scrollIntoView()
    }, 100)

    toast.show('已滚动到下个月')
  }
}

const handleControlChange = ({ value }) => {
  console.log('方法控制日历选择：', value?.map(v => new Date(v).toLocaleDateString()))
}`,
  },

  // 应用场景代码
  scenarios: {
    scheduleTemplate: `<!-- 日程管理系统 -->
<wd-cell-group>
  <wd-cell title="会议安排" :value="formatRangeValue(meetingSchedule)" />
  <wd-cell title="项目截止日期" :value="formatMultipleDates(projectDeadlines)" />
  <wd-cell title="休假申请" :value="formatRangeValue(vacationDates)" />
</wd-cell-group>

<view class="flex flex-wrap gap-2">
  <wd-button size="small" @click="setMeetingThisWeek">本周会议</wd-button>
  <wd-button size="small" type="info" @click="addProjectDeadline">添加截止日期</wd-button>
  <wd-button size="small" type="success" @click="planVacation">计划休假</wd-button>
</view>`,

    scheduleScript: `// 应用场景示例数据
const meetingSchedule = ref([Date.now() + 24 * 60 * 60 * 1000, Date.now() + 3 * 24 * 60 * 60 * 1000])
const projectDeadlines = ref([Date.now() + 7 * 24 * 60 * 60 * 1000, Date.now() + 14 * 24 * 60 * 60 * 1000])
const vacationDates = ref([Date.now() + 30 * 24 * 60 * 60 * 1000, Date.now() + 37 * 24 * 60 * 60 * 1000])

// 设置本周会议
const setMeetingThisWeek = () => {
  const now = new Date()
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1))
  const endOfWeek = new Date(now.setDate(startOfWeek.getDate() + 4))
  meetingSchedule.value = [startOfWeek.getTime(), endOfWeek.getTime()]
  toast.show('已设置本周会议安排')
}

// 添加项目截止日期
const addProjectDeadline = () => {
  const deadline = Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000
  projectDeadlines.value.push(deadline)
  toast.show('已添加项目截止日期')
}

// 计划休假
const planVacation = () => {
  const start = Date.now() + 15 * 24 * 60 * 60 * 1000
  const end = start + 7 * 24 * 60 * 60 * 1000
  vacationDates.value = [start, end]
  toast.show('已计划休假时间')
}`,

    analysisTemplate: `<!-- 数据分析时间段 -->
<wd-cell-group>
  <wd-cell title="分析时间段" :value="formatDateTimeRange(analysisTimeRange)" />
  <wd-cell title="对比基准" :value="formatRangeValue(comparisonPeriod)" />
</wd-cell-group>

<view class="flex flex-wrap gap-2">
  <wd-button size="small" type="warning" @click="setLastQuarter">上季度数据</wd-button>
  <wd-button size="small" type="warning" @click="setYearComparison">年度对比</wd-button>
</view>`,

    analysisScript: `const analysisTimeRange = ref([Date.now() - 30 * 24 * 60 * 60 * 1000, Date.now()])
const comparisonPeriod = ref([Date.now() - 60 * 24 * 60 * 60 * 1000, Date.now() - 30 * 24 * 60 * 60 * 1000])

// 设置上季度数据
const setLastQuarter = () => {
  const now = new Date()
  const lastQuarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 - 3, 1)
  const lastQuarterEnd = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 0)
  analysisTimeRange.value = [lastQuarterStart.getTime(), lastQuarterEnd.getTime()]
  toast.show('已设置上季度分析时间段')
}

// 设置年度对比
const setYearComparison = () => {
  const now = new Date()
  const thisYearStart = new Date(now.getFullYear(), 0, 1)
  const lastYearStart = new Date(now.getFullYear() - 1, 0, 1)
  const lastYearEnd = new Date(now.getFullYear() - 1, 11, 31)

  analysisTimeRange.value = [thisYearStart.getTime(), now.getTime()]
  comparisonPeriod.value = [lastYearStart.getTime(), lastYearEnd.getTime()]
  toast.show('已设置年度对比数据')
}`,
  },
}

// ===== 工具方法（续） =====

/**
 * 格式化字符串数组为显示文本（用于字符串格式的日期范围）
 */
const formatRangeValueFromString = (value: string[] | undefined) => {
  if (!Array.isArray(value) || value.length !== 2 || !value[0] || !value[1]) {
    return '未选择范围'
  }
  return `${value[0]} - ${value[1]}`
}

/**
 * 更新状态监控信息
 */
const updateStatus = (type: string, value: any) => {
  selectionCount.value++
  activeType.value = type

  if (Array.isArray(value)) {
    if (value.length === 0) {
      lastSelectedValue.value = '未选择'
    } else if (value.length === 2) {
      lastSelectedValue.value = `范围选择：${value.length}项`
    } else {
      lastSelectedValue.value = `多选：${value.length}项`
    }
  } else if (value) {
    lastSelectedValue.value = new Date(value).toLocaleDateString('zh-CN')
  } else {
    lastSelectedValue.value = '未选择'
  }
}

/**
 * 获取周数
 */
const getWeekNumber = (date: Date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((Number(d) - Number(yearStart)) / 86400000 + 1) / 7)
}

/**
 * 格式化单个日期值
 */
const formatSingleValue = (value: any, type: string) => {
  if (!value) return '未选择'

  const date = new Date(value)
  switch (type) {
    case 'date':
      return date.toLocaleDateString('zh-CN')
    case 'week':
      return `${date.getFullYear()}年第${getWeekNumber(date)}周`
    case 'month':
      return `${date.getFullYear()}年${date.getMonth() + 1}月`
    default:
      return date.toLocaleDateString('zh-CN')
  }
}

/**
 * 格式化多个日期
 */
const formatMultipleDates = (value: any) => {
  if (!Array.isArray(value) || value.length === 0) return '未选择'
  return value.map((v) => new Date(v).toLocaleDateString('zh-CN')).join(', ')
}

/**
 * 格式化日期范围
 */
const formatRangeValue = (value: any) => {
  if (!Array.isArray(value) || !value[0] || !value[1]) return '未选择范围'
  const start = new Date(value[0]).toLocaleDateString('zh-CN')
  const end = new Date(value[1]).toLocaleDateString('zh-CN')
  return `${start} - ${end}`
}

/**
 * 格式化日期时间
 */
const formatDateTime = (value: any) => {
  if (!value) return '未选择'
  return new Date(value).toLocaleString('zh-CN')
}

/**
 * 格式化日期时间范围
 */
const formatDateTimeRange = (value: any) => {
  if (!Array.isArray(value) || !value[0] || !value[1]) return '未选择范围'
  const start = new Date(value[0]).toLocaleString('zh-CN')
  const end = new Date(value[1]).toLocaleString('zh-CN')
  return `${start} - ${end}`
}

// ===== 自定义格式化器 =====

/**
 * 时间过滤器
 */
const timeFilter = ({ type, values }: any) => {
  if (type === 'minute') {
    // 只展示 0,10,20,30,40,50 分钟选项
    return values.filter((item: any) => item.value % 10 === 0)
  }
  return values
}

/**
 * 自定义格式化器
 */
const customFormatter: CalendarFormatter = (day) => {
  const date = new Date(day.date)
  const now = new Date()

  // 标记今天
  if (formatterOptions.value.includes('today') && date.toDateString() === now.toDateString()) {
    day.topInfo = '今天'
  }

  // 显示节日
  if (formatterOptions.value.includes('festivals')) {
    const month = date.getMonth()
    const dayOfMonth = date.getDate()

    if (month === 5 && dayOfMonth === 18) {
      day.topInfo = '618'
    }
    if (month === 10 && dayOfMonth === 11) {
      day.topInfo = '双11'
    }
    if (month === 11 && dayOfMonth === 25) {
      day.topInfo = '圣诞'
    }
  }

  // 范围标记
  if (formatterOptions.value.includes('range')) {
    if (day.type === 'start') {
      day.bottomInfo = '开始'
    }
    if (day.type === 'end') {
      day.bottomInfo = '结束'
    }
    if (day.type === 'same') {
      day.bottomInfo = '开始/结束'
    }
  }

  return day
}

// ===== 事件处理方法 =====

/**
 * 基础示例事件处理
 */
const handleBasicChange1 = ({ value }: any) => {
  updateStatus('date', value)
  console.log('单个日期选择：', new Date(value).toLocaleDateString())
}

const handleBasicChange2 = ({ value }: any) => {
  updateStatus('dates', value)
  console.log('多个日期选择：', value?.length || 0, '个日期')
}

const handleBasicChange3 = ({ value }: any) => {
  console.log('日期范围选择（字符串格式）：', value)
  // 使用字符串格式无需手动同步，组件自动处理
}

/**
 * 类型切换事件处理
 */
const handleTypeChange = ({ value }: any) => {
  console.log('切换类型为：', value)
}

const handleTypeValueChange = ({ value }: any) => {
  updateStatus(currentType.value, value)
  console.log(`${currentType.value}选择：`, formatSingleValue(value, currentType.value))
}

/**
 * 时间选择事件处理
 */
const handleDatetimeChange = ({ value }: any) => {
  updateStatus('datetime', value)
  console.log('日期时间选择：', new Date(value).toLocaleString())
}

const handleDatetimeRangeChange = ({ value }: any) => {
  console.log('时间范围选择（字符串格式）：', value)
  // 使用字符串格式无需手动同步，组件自动处理
}

/**
 * 高级配置事件处理
 */
const handleMaxRangeChange = ({ value }: any) => {
  console.log('设置最大范围为：', value, '天')
}

const handleFirstDayChange = ({ value }: any) => {
  console.log('设置周起始日为：', value === '0' ? '周日' : '周一')
}

const handleLimitedRangeChange = ({ value }: any) => {
  console.log('限制范围选择（字符串格式）：', value)
  // 使用字符串格式无需手动同步，组件自动处理
}

/**
 * 自定义格式化事件处理
 */
const handleFormattedChange = ({ value }: any) => {
  updateStatus('daterange-formatted', value)
  console.log(
    '格式化日期范围选择：',
    value?.map((v: number) => new Date(v).toLocaleDateString()),
  )
}

/**
 * 方法控制事件处理
 */
const handleControlChange = ({ value }: any) => {
  updateStatus('daterange-control', value)
  console.log(
    '方法控制日历选择：',
    value?.map((v: number) => new Date(v).toLocaleDateString()),
  )
}

// ===== 方法控制功能 =====

/**
 * 滚动到今天
 */
const scrollToToday = () => {
  if (controlCalendarRef.value && controlCalendarRef.value.scrollIntoView) {
    const today = Date.now()
    controlValue.value = [today, today]

    setTimeout(() => {
      controlCalendarRef.value.scrollIntoView()
    }, 100)

    toast.show('已滚动到今天')
    console.log('滚动到今天')
  } else {
    toast.error('滚动失败：组件未就绪')
  }
}

/**
 * 滚动到下个月
 */
const scrollToNextMonth = () => {
  if (controlCalendarRef.value && controlCalendarRef.value.scrollIntoView) {
    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    const nextMonthTime = nextMonth.getTime()

    controlValue.value = [nextMonthTime, nextMonthTime + 7 * 24 * 60 * 60 * 1000]

    setTimeout(() => {
      controlCalendarRef.value.scrollIntoView()
    }, 100)

    toast.show('已滚动到下个月')
    console.log('滚动到下个月')
  } else {
    toast.error('滚动失败：组件未就绪')
  }
}

/**
 * 滚动到上个月
 */
const scrollToPrevMonth = () => {
  if (controlCalendarRef.value && controlCalendarRef.value.scrollIntoView) {
    const prevMonth = new Date()
    prevMonth.setMonth(prevMonth.getMonth() - 1)
    const prevMonthTime = prevMonth.getTime()

    controlValue.value = [prevMonthTime, prevMonthTime + 7 * 24 * 60 * 60 * 1000]

    setTimeout(() => {
      controlCalendarRef.value.scrollIntoView()
    }, 100)

    toast.show('已滚动到上个月')
    console.log('滚动到上个月')
  } else {
    toast.error('滚动失败：组件未就绪')
  }
}

/**
 * 设置随机日期
 */
const setRandomDate = () => {
  const randomDate = Date.now() + (Math.random() - 0.5) * 60 * 24 * 60 * 60 * 1000
  value1.value = randomDate

  setTimeout(() => {
    if (controlCalendarRef.value && controlCalendarRef.value.scrollIntoView) {
      controlCalendarRef.value.scrollIntoView()
    }
  }, 100)

  toast.show('已设置随机日期')
  console.log('设置随机日期：', new Date(randomDate).toLocaleDateString())
}

/**
 * 设置随机范围
 */
const setRandomRange = () => {
  const start = Date.now() + (Math.random() - 0.5) * 30 * 24 * 60 * 60 * 1000
  const end = start + Math.random() * 14 * 24 * 60 * 60 * 1000
  controlValue.value = [start, end]

  setTimeout(() => {
    if (controlCalendarRef.value && controlCalendarRef.value.scrollIntoView) {
      controlCalendarRef.value.scrollIntoView()
    }
  }, 100)

  toast.show('已设置随机范围')
  console.log(
    '设置随机范围：',
    new Date(start).toLocaleDateString(),
    '-',
    new Date(end).toLocaleDateString(),
  )
}

/**
 * 清空所有值
 */
const clearAllValues = () => {
  value1.value = Date.now()
  value2.value = []
  value3.value = []
  datetimeValue.value = Date.now()
  datetimeRangeValue.value = []
  limitedRangeValue.value = []
  formattedValue.value = []
  controlValue.value = []

  toast.show('已清空所有值')
  console.log('清空了所有选择值')
}

// ===== 应用场景方法 =====

/**
 * 设置本周会议
 */
const setMeetingThisWeek = () => {
  const now = new Date()
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1))
  const endOfWeek = new Date(now.setDate(startOfWeek.getDate() + 4))
  meetingSchedule.value = [startOfWeek.getTime(), endOfWeek.getTime()]
  toast.show('已设置本周会议安排')
  console.log('设置本周会议安排')
}

/**
 * 添加项目截止日期
 */
const addProjectDeadline = () => {
  const deadline = Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000
  projectDeadlines.value.push(deadline)
  toast.show('已添加项目截止日期')
  console.log('添加项目截止日期：', new Date(deadline).toLocaleDateString())
}

/**
 * 计划休假
 */
const planVacation = () => {
  const start = Date.now() + 15 * 24 * 60 * 60 * 1000
  const end = start + 7 * 24 * 60 * 60 * 1000
  vacationDates.value = [start, end]
  toast.show('已计划休假时间')
  console.log('计划休假时间')
}

/**
 * 设置上季度数据
 */
const setLastQuarter = () => {
  const now = new Date()
  const lastQuarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 - 3, 1)
  const lastQuarterEnd = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 0)
  analysisTimeRange.value = [lastQuarterStart.getTime(), lastQuarterEnd.getTime()]
  toast.show('已设置上季度分析时间段')
  console.log('设置上季度分析时间段')
}

/**
 * 设置年度对比
 */
const setYearComparison = () => {
  const now = new Date()
  const thisYearStart = new Date(now.getFullYear(), 0, 1)
  const lastYearStart = new Date(now.getFullYear() - 1, 0, 1)
  const lastYearEnd = new Date(now.getFullYear() - 1, 11, 31)

  analysisTimeRange.value = [thisYearStart.getTime(), now.getTime()]
  comparisonPeriod.value = [lastYearStart.getTime(), lastYearEnd.getTime()]
  toast.show('已设置年度对比数据')
  console.log('设置年度对比数据')
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'model-value',
    type: 'Number | Number[]',
    default: '[]',
    desc: '选中的日期值，单选时为时间戳，多选/范围选择时为时间戳数组',
  },
  {
    name: 'type',
    type: 'String',
    default: 'date',
    desc: '日历类型：date/dates/week/month/daterange/datetimerange/datetime/weekrange/monthrange',
  },
  {
    name: 'first-day-of-week',
    type: 'Number',
    default: '0',
    desc: '一周开始于周几，0为周日，1为周一',
  },
  {
    name: 'formatter',
    type: 'Function',
    default: '-',
    desc: '自定义日期格式化函数',
  },
  {
    name: 'max-range',
    type: 'Number',
    default: '-',
    desc: '日期区间最多可选天数，仅在范围选择时有效',
  },
  {
    name: 'allow-same-day',
    type: 'Boolean',
    default: 'false',
    desc: '是否允许选择同一天作为起始和结束日期',
  },
  {
    name: 'time-filter',
    type: 'Function',
    default: '-',
    desc: '时间过滤函数，用于过滤时间选择器的选项',
  },
  {
    name: 'custom-style',
    type: 'String',
    default: '""',
    desc: '自定义样式',
  },
  {
    name: 'custom-class',
    type: 'String',
    default: '""',
    desc: '自定义样式类',
  },
]

// Methods 方法文档
const apiMethods = [
  {
    name: 'scrollIntoView()',
    desc: '滚动到当前选中的日期位置',
  },
]

// Events 事件文档
const apiEvents = [
  {
    name: 'change',
    desc: '选择日期时触发，参数为 { value }',
  },
]

const { resetScrollTop, updateScrollTop } = useScroll()
onShow(() => {
  resetScrollTop()
})
onPageScroll((e) => {
  updateScrollTop(e.scrollTop)
})

// ===== 初始化 =====
// 使用字符串格式的日历组件无需额外初始化，v-model 自动同步
</script>
