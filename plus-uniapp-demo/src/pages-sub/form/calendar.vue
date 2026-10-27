<!-- Calendar 日历选择器 http://127.0.0.1:100/#/pages-sub/demo/wd/calendar -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Calendar 日历选择器" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="支持单个日期、多个日期、日期范围等多种选择模式">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-calendar
          v-model="basicValue1"
          label="单个日期选择"
          @confirm="handleConfirm('单个日期选择', $event)"
        />
        <wd-calendar
          v-model="basicValue2"
          label="多个日期选择"
          type="dates"
          @confirm="handleConfirm('多个日期选择', $event)"
        />
        <wd-calendar
          v-model="basicValue3"
          label="日期范围选择"
          type="daterange"
          @confirm="handleConfirm('日期范围选择', $event)"
        />
        <wd-calendar
          v-model="basicValue4"
          label="日期时间选择"
          type="datetime"
          @confirm="handleConfirm('日期时间选择', $event)"
        />
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 单个日期选择" :code="codes.basic.singleTemplate" />
        <DemoCode title="模板 - 多个日期选择" :code="codes.basic.multiTemplate" />
        <DemoCode title="模板 - 日期范围选择" :code="codes.basic.rangeTemplate" />
        <DemoCode title="模板 - 日期时间选择" :code="codes.basic.datetimeTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 周月选择示例 -->
    <DemoSection title="周月选择" desc="支持按周或按月的选择模式，适用于统计和报表场景">
      <wd-cell-group>
        <wd-calendar
          v-model="weekValue1"
          label="周选择"
          type="week"
          @confirm="handleConfirm('周选择', $event)"
        />
        <wd-calendar
          v-model="weekValue2"
          label="月选择"
          type="month"
          :min-date="minDate"
          @confirm="handleConfirm('月选择', $event)"
        />
        <wd-calendar
          v-model="weekValue3"
          label="周范围选择"
          type="weekrange"
          :first-day-of-week="1"
          @confirm="handleConfirm('周范围选择', $event)"
        />
        <wd-calendar
          v-model="weekValue4"
          label="月范围选择"
          type="monthrange"
          @confirm="handleConfirm('月范围选择', $event)"
        />
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 周选择" :code="codes.week.weekTemplate" />
        <DemoCode title="模板 - 月选择" :code="codes.week.monthTemplate" />
        <DemoCode title="模板 - 周范围选择" :code="codes.week.weekRangeTemplate" />
        <DemoCode title="模板 - 月范围选择" :code="codes.week.monthRangeTemplate" />
        <DemoCode title="脚本 - 周月选择" :code="codes.week.script" />
      </template>
    </DemoSection>

    <!-- 高级配置示例 -->
    <DemoSection title="高级配置" desc="展示高级配置功能：类型切换、格式化、快捷选项、校验等">
      <wd-cell-group>
        <wd-calendar
          v-model="advancedValue1"
          label="日周月切换"
          :first-day-of-week="1"
          show-type-switch
          @confirm="handleConfirm('日周月切换', $event)"
        />
        <wd-calendar
          v-model="advancedValue2"
          label="日期格式化"
          type="daterange"
          :formatter="formatter"
          @confirm="handleConfirm('日期格式化', $event)"
        />
        <wd-calendar
          v-model="advancedValue3"
          label="快捷选项"
          type="daterange"
          :shortcuts="shortcuts"
          :on-shortcuts-click="onShortcutsClick"
          @confirm="handleConfirm('快捷选项', $event)"
        />
        <wd-calendar
          v-model="advancedValue4"
          label="自定义展示"
          type="daterange"
          :display-format="displayFormat"
          :inner-display-format="innerDisplayFormat"
          @confirm="handleConfirm('自定义展示', $event)"
        />
        <wd-calendar
          v-model="advancedValue5"
          label="确认前校验"
          :before-confirm="beforeConfirm"
          @confirm="handleConfirm('确认前校验', $event)"
        />
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 日周月切换" :code="codes.advanced.typeSwitchTemplate" />
        <DemoCode title="模板 - 日期格式化" :code="codes.advanced.formatterTemplate" />
        <DemoCode title="模板 - 快捷选项" :code="codes.advanced.shortcutsTemplate" />
        <DemoCode title="模板 - 自定义展示" :code="codes.advanced.displayTemplate" />
        <DemoCode title="模板 - 确认前校验" :code="codes.advanced.validateTemplate" />
        <DemoCode title="脚本 - 高级配置" :code="codes.advanced.script" />
      </template>
    </DemoSection>

    <!-- 自定义样式示例 -->
    <DemoSection title="自定义样式" desc="使用自定义按钮触发和编程式控制">
      <!-- 自定义按钮触发 -->
      <view class="space-y-4">
        <view class="px-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">自定义按钮触发</view>
          <view class="mb-2 text-xs text-gray-500">
            当前选中日期：{{ formatCustomValue || '未选择' }}
          </view>
          <wd-calendar v-model="customValue1" :with-cell="false" @confirm="handleCustomConfirm">
            <wd-button type="primary">选择日期</wd-button>
          </wd-calendar>
        </view>

        <!-- 编程式控制 -->
        <view class="px-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">编程式控制</view>
          <view class="mb-2 text-xs text-gray-500">
            选中值：{{ formatInstanceValue || '未选择' }}
          </view>
          <wd-button type="info" @click="openCalendar">打开日历</wd-button>
          <wd-calendar
            ref="calendarRef"
            v-model="customValue2"
            :with-cell="false"
            @confirm="handleInstanceConfirm"
          />
        </view>

        <!-- 快速测试 -->
        <view class="px-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">快速测试</view>
          <view class="mb-2 text-xs text-gray-500">点击按钮快速体验不同类型的日历选择器</view>
          <view class="flex flex-wrap gap-2">
            <wd-button size="small" @click="openTestCalendar('date')">单日选择</wd-button>
            <wd-button size="small" type="success" @click="openTestCalendar('daterange')">
              日期范围
            </wd-button>
            <wd-button size="small" type="info" @click="openTestCalendar('datetime')">
              日期时间
            </wd-button>
            <wd-button size="small" type="warning" @click="openTestCalendar('week')">
              周选择
            </wd-button>
            <wd-button size="small" type="error" @click="openTestCalendar('month')">
              月选择
            </wd-button>
          </view>
        </view>
      </view>

      <!-- 隐藏的测试日历 -->
      <wd-calendar
        ref="testCalendarRef"
        v-model="testValue"
        :type="testType"
        :with-cell="false"
        @confirm="handleTestConfirm"
      />

      <template #codes>
        <DemoCode title="模板 - 自定义按钮触发" :code="codes.custom.buttonTemplate" />
        <DemoCode title="模板 - 编程式控制" :code="codes.custom.instanceTemplate" />
        <DemoCode title="模板 - 快速测试" :code="codes.custom.quickTestTemplate" />
        <DemoCode title="脚本 - 自定义样式" :code="codes.custom.script" />
      </template>
    </DemoSection>

    <!-- 功能演示示例 -->
    <DemoSection title="功能演示" desc="展示限制范围、禁用状态、只读状态等功能">
      <view class="space-y-4">
        <!-- 限制日期范围 -->
        <view class="px-4">
          <view class="mb-2 text-sm text-gray-700 font-medium">限制日期范围</view>
          <view class="mb-2 text-xs text-gray-500">只能选择今天到30天后的日期</view>
          <wd-calendar
            v-model="demoValue1"
            :with-cell="false"
            :min-date="Date.now()"
            :max-date="Date.now() + 30 * 24 * 60 * 60 * 1000"
            @confirm="handleDemoConfirm('限制范围选择', $event)"
          >
            <wd-button type="info" size="small">限制范围选择</wd-button>
          </wd-calendar>
        </view>

        <!-- 禁用状态 -->
        <view class="px-4">
          <view class="mb-2 text-sm text-gray-700 font-medium">禁用状态</view>
          <wd-calendar v-model="demoValue2" :with-cell="false" disabled>
            <wd-button type="info" size="small" disabled>禁用状态</wd-button>
          </wd-calendar>
        </view>

        <!-- 只读状态 -->
        <view class="px-4">
          <view class="mb-2 text-sm text-gray-700 font-medium">只读状态</view>
          <wd-calendar v-model="demoValue3" :with-cell="false" readonly>
            <wd-button type="warning" size="small">只读状态</wd-button>
          </wd-calendar>
        </view>

        <!-- 快捷操作 -->
        <view class="px-4">
          <view class="mb-2 text-sm text-gray-700 font-medium">快捷操作</view>
          <view class="mb-2 text-xs text-gray-500">无需确认按钮，选择后立即生效</view>
          <wd-calendar
            v-model="demoValue4"
            :with-cell="false"
            :show-confirm="false"
            @confirm="handleDemoConfirm('快捷操作', $event)"
          >
            <wd-button type="primary" size="small">快捷操作</wd-button>
          </wd-calendar>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 限制日期范围" :code="codes.demo.limitTemplate" />
        <DemoCode title="模板 - 禁用状态" :code="codes.demo.disabledTemplate" />
        <DemoCode title="模板 - 只读状态" :code="codes.demo.readonlyTemplate" />
        <DemoCode title="模板 - 快捷操作" :code="codes.demo.quickTemplate" />
        <DemoCode title="脚本 - 功能演示" :code="codes.demo.script" />
      </template>
    </DemoSection>

    <!-- 实际应用场景 -->
    <DemoSection title="实际应用场景" desc="常见的业务场景示例">
      <!-- 数据统计时间选择 -->
      <view class="space-y-4">
        <view class="px-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">数据统计时间选择</view>
          <view class="mb-2 text-xs text-gray-500">
            统计时间段：{{ formatStatisticValue || '请选择统计时间段' }}
          </view>
          <wd-calendar
            v-model="scenarioValue1"
            type="daterange"
            :with-cell="false"
            :shortcuts="statisticShortcuts"
            :on-shortcuts-click="onStatisticShortcutsClick"
            @confirm="handleStatisticConfirm"
          >
            <wd-button type="primary">选择统计时间段</wd-button>
          </wd-calendar>
        </view>

        <!-- 活动时间设置 -->
        <view class="px-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">活动时间设置</view>
          <view class="mb-2 text-xs text-gray-500">
            活动时间：{{ formatActivityValue || '请设置活动时间' }}
          </view>
          <wd-calendar
            v-model="scenarioValue2"
            type="datetimerange"
            :with-cell="false"
            :min-date="Date.now()"
            :display-format="activityDisplayFormat"
            @confirm="handleActivityConfirm"
          >
            <wd-button type="success">设置活动时间</wd-button>
          </wd-calendar>
        </view>

        <!-- 生日选择 -->
        <view class="px-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">生日选择</view>
          <view class="mb-2 text-xs text-gray-500">
            生日：{{ formatBirthdayValue || '请选择生日' }}
          </view>
          <wd-calendar
            v-model="scenarioValue3"
            :with-cell="false"
            :max-date="Date.now()"
            :min-date="new Date('1900-01-01').getTime()"
            @confirm="handleBirthdayConfirm"
          >
            <wd-button type="warning">选择生日</wd-button>
          </wd-calendar>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 数据统计时间选择" :code="codes.scenarios.statisticTemplate" />
        <DemoCode title="脚本 - 数据统计时间选择" :code="codes.scenarios.statisticScript" />
        <DemoCode title="模板 - 活动时间设置" :code="codes.scenarios.activityTemplate" />
        <DemoCode title="脚本 - 活动时间设置" :code="codes.scenarios.activityScript" />
        <DemoCode title="模板 - 生日选择" :code="codes.scenarios.birthdayTemplate" />
        <DemoCode title="脚本 - 生日选择" :code="codes.scenarios.birthdayScript" />
      </template>
    </DemoSection>

    <!-- 状态监控显示 -->
    <DemoSection title="状态监控" desc="实时监控日历选择器的使用状态和操作记录">
      <!-- 实时状态显示 -->
      <view class="space-y-4">
        <view class="mx-4 rounded-lg bg-blue-50 p-4">
          <view class="mb-3 text-base text-blue-800 font-medium">实时状态监控</view>
          <view class="text-sm text-blue-600 space-y-1">
            <view>总选择次数：{{ selectionCount }}</view>
            <view>最后选择类型：{{ lastSelectionType || '无' }}</view>
            <view>最后选择值：{{ lastSelectedValue || '无' }}</view>
            <view v-if="validationInfo.type" class="text-red-600">
              校验信息：{{ validationInfo.message }}
            </view>
          </view>
        </view>

        <!-- 操作记录 -->
        <view class="mx-4 rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-base font-medium">操作记录</view>
          <view class="h-32 overflow-y-auto border border-gray-200 rounded bg-white p-2">
            <view
              v-for="(record, index) in operationRecords"
              :key="index"
              class="mb-1 text-sm"
              :class="getRecordColor(record.type)"
            >
              [{{ record.time }}] {{ record.message }}
            </view>
            <view
              v-if="operationRecords.length === 0"
              class="py-4 text-center text-sm text-gray-400"
            >
              暂无操作记录，开始使用日历选择器进行测试
            </view>
          </view>
          <view class="mt-2 flex gap-2">
            <wd-button size="small" @click="clearRecords">清空记录</wd-button>
            <wd-button size="small" type="info" @click="exportRecords">导出记录</wd-button>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 状态监控" :code="codes.monitor.template" />
        <DemoCode title="脚本 - 状态监控" :code="codes.monitor.script" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToast, dayjs } from '@/wd'
import type {
  CalendarDayItem,
  CalendarFormatter,
  CalendarType,
} from '@/wd/components/wd-calendar-view/wd-calendar-view.vue'
import type {
  CalendarInstance,
  CalendarOnShortcutsClickOption,
} from '@/wd/components/wd-calendar/wd-calendar.vue'

// ===== 组件状态管理 =====

// 工具函数
const toast = useToast()

// 最小日期限制（20年前到6个月前）
const minDate = ref<number>(
  new Date(
    new Date().getFullYear() - 20,
    new Date().getMonth() - 6,
    new Date().getDate(),
  ).getTime(),
)

// 基本用法值
const basicValue1 = ref<number>(Date.now())
const basicValue2 = ref<number[]>([Date.now() - 24 * 60 * 60 * 1000 * 3, Date.now()])
const basicValue3 = ref<number[]>([])
const basicValue4 = ref<number>(Date.now())

// 周月选择值
const weekValue1 = ref<number>(Date.now())
const weekValue2 = ref<number>(Date.now())
const weekValue3 = ref<number[]>([Date.now() - 24 * 60 * 60 * 1000 * 14, Date.now()])
const weekValue4 = ref<number[]>([Date.now() - 24 * 60 * 60 * 1000 * 33, Date.now()])

// 高级配置值
const advancedValue1 = ref<number>(Date.now())
const advancedValue2 = ref<number[]>([Date.now() - 24 * 60 * 60 * 1000 * 3, Date.now()])
const advancedValue3 = ref<number[]>([])
const advancedValue4 = ref<number[]>([Date.now() - 24 * 60 * 60 * 1000 * 3, Date.now()])
const advancedValue5 = ref<number | null>(null)

// 自定义样式值
const customValue1 = ref<number | null>(null)
const customValue2 = ref<number>(Date.now())

// 功能演示值
const demoValue1 = ref<number | null>(null)
const demoValue2 = ref<number>(Date.now())
const demoValue3 = ref<number>(Date.now())
const demoValue4 = ref<number>(Date.now())

// 应用场景值
const scenarioValue1 = ref<number[]>([])
const scenarioValue2 = ref<number[]>([])
const scenarioValue3 = ref<number | null>(null)

// 快速测试相关
const testValue = ref<any>(null)
const testType = ref<CalendarType>('date')

// 状态监控
const selectionCount = ref<number>(0)
const lastSelectionType = ref<string>('')
const lastSelectedValue = ref<string>('')
const validationInfo = ref<{ type: string; message: string }>({ type: '', message: '' })

// 组件引用
const calendarRef = ref<CalendarInstance>()
const testCalendarRef = ref<CalendarInstance>()

// ===== 操作记录管理 =====

interface OperationRecord {
  time: string
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
}

const operationRecords = ref<OperationRecord[]>([])

const addRecord = (message: string, type: OperationRecord['type'] = 'info') => {
  operationRecords.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
    type,
  })
  // 限制记录数量
  if (operationRecords.value.length > 50) {
    operationRecords.value = operationRecords.value.slice(0, 50)
  }
}

const clearRecords = () => {
  operationRecords.value = []
  addRecord('清空了操作记录', 'warning')
}

const exportRecords = () => {
  const recordText = operationRecords.value
    .map((record) => `[${record.time}] ${record.message}`)
    .join('\n')

  console.log('导出记录：\n', recordText)
  toast.show('记录已导出到控制台')
  addRecord('导出了操作记录', 'success')
}

const getRecordColor = (type: OperationRecord['type']) => {
  const colors = {
    success: 'text-green-600',
    info: 'text-blue-600',
    warning: 'text-orange-600',
    error: 'text-red-600',
  }
  return colors[type]
}

// ===== 格式化函数 =====

// 日期格式化函数
const formatter: CalendarFormatter = (day: CalendarDayItem) => {
  const date = new Date(day.date)
  const now = new Date()

  const year = date.getFullYear()
  const month = date.getMonth()
  const da = date.getDate()
  const nowYear = now.getFullYear()
  const nowMonth = now.getMonth()
  const nowDa = now.getDate()

  if (year === nowYear && month === nowMonth && da === nowDa) {
    day.topInfo = '今天'
  }

  if (month === 5 && da === 18) {
    day.topInfo = '618大促'
  }

  if (month === 10 && da === 11) {
    day.topInfo = '双11'
  }

  if (day.type === 'start') {
    day.bottomInfo = '开始'
  }

  if (day.type === 'end') {
    day.bottomInfo = '结束'
  }

  if (day.type === 'same') {
    day.bottomInfo = '开始/结束'
  }

  return day
}

// 快捷选项配置
const shortcuts = ref<Record<string, any>[]>([
  { text: '近7天', id: 7 },
  { text: '近15天', id: 15 },
  { text: '近30天', id: 30 },
])

// 统计快捷选项
const statisticShortcuts = ref<Record<string, any>[]>([
  { text: '今天', id: 'today' },
  { text: '昨天', id: 'yesterday' },
  { text: '近7天', id: 7 },
  { text: '近30天', id: 30 },
  { text: '本月', id: 'thisMonth' },
  { text: '上月', id: 'lastMonth' },
])

// 自定义显示格式化
const displayFormat = (value: any) => {
  return `${dayjs(value[0]).format('YY年MM月DD日')} - ${dayjs(value[1]).format('YY年MM月DD日')}`
}

const innerDisplayFormat = (value: string | number | Date | undefined, rangeType: string) => {
  if (!value) {
    return rangeType === 'start' ? '活动开始时间' : '活动结束时间'
  }
  return dayjs(value).format('YY年MM月DD日')
}

// 活动显示格式化
const activityDisplayFormat = (value: any) => {
  return `${dayjs(value[0]).format('YYYY年MM月DD日 HH:mm')} - ${dayjs(value[1]).format('YYYY年MM月DD日 HH:mm')}`
}

// ===== 计算属性 =====

const formatCustomValue = computed(() => {
  return customValue1.value ? dayjs(customValue1.value).format('YYYY年MM月DD日') : ''
})

const formatInstanceValue = computed(() => {
  return customValue2.value ? dayjs(customValue2.value).format('YYYY年MM月DD日') : ''
})

const formatStatisticValue = computed(() => {
  if (!scenarioValue1.value || scenarioValue1.value.length !== 2) return ''
  return `${dayjs(scenarioValue1.value[0]).format('YYYY-MM-DD')} 至 ${dayjs(scenarioValue1.value[1]).format('YYYY-MM-DD')}`
})

const formatActivityValue = computed(() => {
  if (!scenarioValue2.value || scenarioValue2.value.length !== 2) return ''
  return `${dayjs(scenarioValue2.value[0]).format('YYYY-MM-DD HH:mm')} 至 ${dayjs(scenarioValue2.value[1]).format('YYYY-MM-DD HH:mm')}`
})

const formatBirthdayValue = computed(() => {
  return scenarioValue3.value ? dayjs(scenarioValue3.value).format('YYYY年MM月DD日') : ''
})

// ===== 校验和快捷操作函数 =====

const beforeConfirm = ({ value, resolve }: any) => {
  if (value > Date.now()) {
    validationInfo.value = {
      type: 'error',
      message: '不能选择未来日期',
    }
    toast.error('该日期暂无数据')
    addRecord('校验失败：选择了未来日期', 'error')
    resolve(false)
  } else {
    validationInfo.value = { type: '', message: '' }
    addRecord('校验通过：日期有效', 'success')
    resolve(true)
  }
}

const onShortcutsClick = ({ item }: CalendarOnShortcutsClickOption) => {
  const dayDiff = item.id
  const endDate = Date.now() - 24 * 60 * 60 * 1000
  const startDate = endDate - dayDiff * 24 * 60 * 60 * 1000

  addRecord(`使用快捷选项：${item.text}`, 'info')
  return [startDate, endDate]
}

const onStatisticShortcutsClick = ({ item }: CalendarOnShortcutsClickOption) => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  let startDate: number, endDate: number

  switch (item.id) {
    case 'today':
      startDate = endDate = today.getTime()
      break
    case 'yesterday': {
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      startDate = endDate = yesterday.getTime()
      break
    }
    case 'thisMonth':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
      endDate = today.getTime()
      break
    case 'lastMonth': {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
      startDate = lastMonth.getTime()
      endDate = lastMonthEnd.getTime()
      break
    }
    default: // 处理数字类型的天数
    {
      const dayDiff = item.id
      endDate = today.getTime()
      startDate = endDate - (dayDiff - 1) * 24 * 60 * 60 * 1000
    }
  }

  addRecord(`统计快捷选项：${item.text}`, 'info')
  return [startDate, endDate]
}

// ===== 事件处理方法 =====

/**
 * 通用确认处理
 */
const handleConfirm = (type: string, { value }: any) => {
  selectionCount.value++
  lastSelectionType.value = type

  if (Array.isArray(value)) {
    lastSelectedValue.value = value.map((v) => dayjs(v).format('YYYY-MM-DD')).join(' 至 ')
  } else {
    lastSelectedValue.value = dayjs(value).format('YYYY-MM-DD HH:mm:ss')
  }

  addRecord(`${type}：${lastSelectedValue.value}`, 'success')
  toast.success(`${type}完成`)
}

/**
 * 自定义选择器确认处理
 */
const handleCustomConfirm = ({ value }: any) => {
  addRecord(`自定义选择器选择：${dayjs(value).format('YYYY年MM月DD日')}`, 'success')
  toast.success('自定义选择完成')
}

/**
 * 实例调用确认处理
 */
const handleInstanceConfirm = ({ value }: any) => {
  addRecord(`组件实例调用选择：${dayjs(value).format('YYYY年MM月DD日')}`, 'success')
  toast.success(`已选择：${dayjs(value).format('YYYY年MM月DD日')}`)
}

/**
 * 功能演示确认处理
 */
const handleDemoConfirm = (type: string, { value }: any) => {
  addRecord(`${type}：${dayjs(value).format('YYYY年MM月DD日')}`, 'success')
  toast.success(`${type}完成`)
}

/**
 * 统计时间确认处理
 */
const handleStatisticConfirm = ({ value }: any) => {
  addRecord(
    `统计时间选择：${dayjs(value[0]).format('YYYY-MM-DD')} 至 ${dayjs(value[1]).format('YYYY-MM-DD')}`,
    'success',
  )
  toast.success('统计时间选择完成')
}

/**
 * 活动时间确认处理
 */
const handleActivityConfirm = ({ value }: any) => {
  addRecord(
    `活动时间设置：${dayjs(value[0]).format('YYYY-MM-DD HH:mm')} 至 ${dayjs(value[1]).format('YYYY-MM-DD HH:mm')}`,
    'success',
  )
  toast.success('活动时间设置完成')
}

/**
 * 生日确认处理
 */
const handleBirthdayConfirm = ({ value }: any) => {
  addRecord(`生日选择：${dayjs(value).format('YYYY年MM月DD日')}`, 'success')
  toast.success('生日选择完成')
}

/**
 * 快速测试确认处理
 */
const handleTestConfirm = ({ value }: any) => {
  let displayValue = ''
  if (Array.isArray(value)) {
    displayValue = value.map((v) => dayjs(v).format('YYYY-MM-DD')).join(' 至 ')
  } else {
    displayValue = dayjs(value).format('YYYY-MM-DD HH:mm:ss')
  }

  addRecord(`快速测试选择 ${testType.value}：${displayValue}`, 'success')
  toast.success(`快速测试完成：${displayValue}`)
}

/**
 * 打开组件实例日历
 */
const openCalendar = () => {
  calendarRef.value?.open()
  addRecord('打开组件实例日历', 'info')
}

/**
 * 打开快速测试日历
 */
const openTestCalendar = (type: CalendarType) => {
  testType.value = type
  testValue.value = null
  testCalendarRef.value?.open()
  addRecord(`打开快速测试：${type}`, 'info')
}

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    singleTemplate: `<wd-calendar
  v-model="basicValue1"
  label="单个日期选择"
  @confirm="handleConfirm('单个日期选择', $event)"
/>`,

    multiTemplate: `<wd-calendar
  v-model="basicValue2"
  label="多个日期选择"
  type="dates"
  @confirm="handleConfirm('多个日期选择', $event)"
/>`,

    rangeTemplate: `<wd-calendar
  v-model="basicValue3"
  label="日期范围选择"
  type="daterange"
  @confirm="handleConfirm('日期范围选择', $event)"
/>`,

    datetimeTemplate: `<wd-calendar
  v-model="basicValue4"
  label="日期时间选择"
  type="datetime"
  @confirm="handleConfirm('日期时间选择', $event)"
/>`,

    script: `import { ref } from 'vue'
import { dayjs } from '@/wd'

// 基本用法值
const basicValue1 = ref<number>(Date.now())
const basicValue2 = ref<number[]>([Date.now() - 24 * 60 * 60 * 1000 * 3, Date.now()])
const basicValue3 = ref<number[]>([])
const basicValue4 = ref<number>(Date.now())

const handleConfirm = (type: string, { value }: any) => {
  console.log(\`\${type}选择完成：\`, value)
}`,
  },

  // 周月选择代码
  week: {
    weekTemplate: `<wd-calendar
  v-model="weekValue1"
  label="周选择"
  type="week"
  @confirm="handleConfirm('周选择', $event)"
/>`,

    monthTemplate: `<wd-calendar
  v-model="weekValue2"
  label="月选择"
  type="month"
  :min-date="minDate"
  @confirm="handleConfirm('月选择', $event)"
/>`,

    weekRangeTemplate: `<wd-calendar
  v-model="weekValue3"
  label="周范围选择"
  type="weekrange"
  :first-day-of-week="1"
  @confirm="handleConfirm('周范围选择', $event)"
/>`,

    monthRangeTemplate: `<wd-calendar
  v-model="weekValue4"
  label="月范围选择"
  type="monthrange"
  @confirm="handleConfirm('月范围选择', $event)"
/>`,

    script: `// 周月选择值
const weekValue1 = ref<number>(Date.now())
const weekValue2 = ref<number>(Date.now())
const weekValue3 = ref<number[]>([Date.now() - 24 * 60 * 60 * 1000 * 14, Date.now()])
const weekValue4 = ref<number[]>([Date.now() - 24 * 60 * 60 * 1000 * 33, Date.now()])

// 最小日期限制
const minDate = ref<number>(
  new Date(
    new Date().getFullYear() - 20,
    new Date().getMonth() - 6,
    new Date().getDate(),
  ).getTime(),
)`,
  },

  // 高级配置代码
  advanced: {
    typeSwitchTemplate: `<wd-calendar
  v-model="advancedValue1"
  label="日周月切换"
  :first-day-of-week="1"
  show-type-switch
  @confirm="handleConfirm('日周月切换', $event)"
/>`,

    formatterTemplate: `<wd-calendar
  v-model="advancedValue2"
  label="日期格式化"
  type="daterange"
  :formatter="formatter"
  @confirm="handleConfirm('日期格式化', $event)"
/>`,

    shortcutsTemplate: `<wd-calendar
  v-model="advancedValue3"
  label="快捷选项"
  type="daterange"
  :shortcuts="shortcuts"
  :on-shortcuts-click="onShortcutsClick"
  @confirm="handleConfirm('快捷选项', $event)"
/>`,

    displayTemplate: `<wd-calendar
  v-model="advancedValue4"
  label="自定义展示"
  type="daterange"
  :display-format="displayFormat"
  :inner-display-format="innerDisplayFormat"
  @confirm="handleConfirm('自定义展示', $event)"
/>`,

    validateTemplate: `<wd-calendar
  v-model="advancedValue5"
  label="确认前校验"
  :before-confirm="beforeConfirm"
  @confirm="handleConfirm('确认前校验', $event)"
/>`,

    script: `import type { CalendarDayItem, CalendarFormatter } from '@/wd'

// 高级配置值
const advancedValue1 = ref<number>(Date.now())
const advancedValue2 = ref<number[]>([Date.now() - 24 * 60 * 60 * 1000 * 3, Date.now()])
const advancedValue3 = ref<number[]>([])
const advancedValue4 = ref<number[]>([Date.now() - 24 * 60 * 60 * 1000 * 3, Date.now()])
const advancedValue5 = ref<number | null>(null)

// 日期格式化函数
const formatter: CalendarFormatter = (day: CalendarDayItem) => {
  const date = new Date(day.date)
  const now = new Date()

  if (date.toDateString() === now.toDateString()) {
    day.topInfo = '今天'
  }

  if (day.type === 'start') {
    day.bottomInfo = '开始'
  }

  if (day.type === 'end') {
    day.bottomInfo = '结束'
  }

  return day
}

// 快捷选项配置
const shortcuts = ref([
  { text: '近7天', id: 7 },
  { text: '近15天', id: 15 },
  { text: '近30天', id: 30 },
])

const onShortcutsClick = ({ item }) => {
  const dayDiff = item.id
  const endDate = Date.now() - 24 * 60 * 60 * 1000
  const startDate = endDate - dayDiff * 24 * 60 * 60 * 1000
  return [startDate, endDate]
}

// 自定义显示格式化
const displayFormat = (value: any) => {
  return \`\${dayjs(value[0]).format('YY年MM月DD日')} - \${dayjs(value[1]).format('YY年MM月DD日')}\`
}

const innerDisplayFormat = (value: string | number | Date | undefined, rangeType: string) => {
  if (!value) {
    return rangeType === 'start' ? '活动开始时间' : '活动结束时间'
  }
  return dayjs(value).format('YY年MM月DD日')
}

// 确认前校验
const beforeConfirm = ({ value, resolve }) => {
  if (value > Date.now()) {
    toast.error('不能选择未来日期')
    resolve(false)
  } else {
    resolve(true)
  }
}`,
  },

  // 自定义样式代码
  custom: {
    buttonTemplate: `<wd-calendar
  v-model="customValue1"
  :with-cell="false"
  @confirm="handleCustomConfirm"
>
  <wd-button type="primary">选择日期</wd-button>
</wd-calendar>`,

    instanceTemplate: `<template>
  <wd-button type="info" @click="openCalendar">打开日历</wd-button>
  <wd-calendar
    ref="calendarRef"
    v-model="customValue2"
    :with-cell="false"
    @confirm="handleInstanceConfirm"
  />
</template>`,

    quickTestTemplate: `<view class="flex flex-wrap gap-2">
  <wd-button size="small" @click="openTestCalendar('date')">单日选择</wd-button>
  <wd-button size="small" type="success" @click="openTestCalendar('daterange')">
    日期范围
  </wd-button>
  <wd-button size="small" type="info" @click="openTestCalendar('datetime')">
    日期时间
  </wd-button>
  <wd-button size="small" type="warning" @click="openTestCalendar('week')">
    周选择
  </wd-button>
  <wd-button size="small" type="error" @click="openTestCalendar('month')">
    月选择
  </wd-button>
</view>

<!-- 隐藏的测试日历 -->
<wd-calendar
  ref="testCalendarRef"
  v-model="testValue"
  :type="testType"
  :with-cell="false"
  @confirm="handleTestConfirm"
/>`,

    script: `import type { CalendarInstance, CalendarType } from '@/wd'

// 自定义样式值
const customValue1 = ref<number | null>(null)
const customValue2 = ref<number>(Date.now())

// 快速测试相关
const testValue = ref<any>(null)
const testType = ref<CalendarType>('date')

// 组件引用
const calendarRef = ref<CalendarInstance>()
const testCalendarRef = ref<CalendarInstance>()

const handleCustomConfirm = ({ value }) => {
  console.log('自定义选择器选择：', dayjs(value).format('YYYY年MM月DD日'))
}

const handleInstanceConfirm = ({ value }) => {
  console.log('组件实例调用选择：', dayjs(value).format('YYYY年MM月DD日'))
}

const openCalendar = () => {
  calendarRef.value?.open()
}

const openTestCalendar = (type: CalendarType) => {
  testType.value = type
  testValue.value = null
  testCalendarRef.value?.open()
}

const handleTestConfirm = ({ value }) => {
  let displayValue = ''
  if (Array.isArray(value)) {
    displayValue = value.map((v) => dayjs(v).format('YYYY-MM-DD')).join(' 至 ')
  } else {
    displayValue = dayjs(value).format('YYYY-MM-DD HH:mm:ss')
  }
  console.log(\`快速测试完成：\${displayValue}\`)
}`,
  },

  // 功能演示代码
  demo: {
    limitTemplate: `<wd-calendar
  v-model="demoValue1"
  :with-cell="false"
  :min-date="Date.now()"
  :max-date="Date.now() + 30 * 24 * 60 * 60 * 1000"
  @confirm="handleDemoConfirm('限制范围选择', $event)"
>
  <wd-button type="info" size="small">限制范围选择</wd-button>
</wd-calendar>`,

    disabledTemplate: `<wd-calendar
  v-model="demoValue2"
  :with-cell="false"
  disabled
>
  <wd-button type="info" size="small" disabled>禁用状态</wd-button>
</wd-calendar>`,

    readonlyTemplate: `<wd-calendar
  v-model="demoValue3"
  :with-cell="false"
  readonly
>
  <wd-button type="warning" size="small">只读状态</wd-button>
</wd-calendar>`,

    quickTemplate: `<wd-calendar
  v-model="demoValue4"
  :with-cell="false"
  :show-confirm="false"
  @confirm="handleDemoConfirm('快捷操作', $event)"
>
  <wd-button type="primary" size="small">快捷操作</wd-button>
</wd-calendar>`,

    script: `// 功能演示值
const demoValue1 = ref<number | null>(null)
const demoValue2 = ref<number>(Date.now())
const demoValue3 = ref<number>(Date.now())
const demoValue4 = ref<number>(Date.now())

const handleDemoConfirm = (type: string, { value }) => {
  console.log(\`\${type}：\${dayjs(value).format('YYYY年MM月DD日')}\`)
}`,
  },

  // 应用场景代码
  scenarios: {
    statisticTemplate: `<wd-calendar
  v-model="scenarioValue1"
  type="daterange"
  :with-cell="false"
  :shortcuts="statisticShortcuts"
  :on-shortcuts-click="onStatisticShortcutsClick"
  @confirm="handleStatisticConfirm"
>
  <wd-button type="primary">选择统计时间段</wd-button>
</wd-calendar>`,

    statisticScript: `// 统计快捷选项
const statisticShortcuts = ref([
  { text: '今天', id: 'today' },
  { text: '昨天', id: 'yesterday' },
  { text: '近7天', id: 7 },
  { text: '近30天', id: 30 },
  { text: '本月', id: 'thisMonth' },
  { text: '上月', id: 'lastMonth' },
])

const onStatisticShortcutsClick = ({ item }) => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  let startDate: number, endDate: number

  switch (item.id) {
    case 'today':
      startDate = endDate = today.getTime()
      break
    case 'yesterday':
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      startDate = endDate = yesterday.getTime()
      break
    case 'thisMonth':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
      endDate = today.getTime()
      break
    case 'lastMonth':
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
      startDate = lastMonth.getTime()
      endDate = lastMonthEnd.getTime()
      break
    default:
      const dayDiff = item.id
      endDate = today.getTime()
      startDate = endDate - (dayDiff - 1) * 24 * 60 * 60 * 1000
  }

  return [startDate, endDate]
}`,

    activityTemplate: `<wd-calendar
  v-model="scenarioValue2"
  type="datetimerange"
  :with-cell="false"
  :min-date="Date.now()"
  :display-format="activityDisplayFormat"
  @confirm="handleActivityConfirm"
>
  <wd-button type="success">设置活动时间</wd-button>
</wd-calendar>`,

    activityScript: `// 活动显示格式化
const activityDisplayFormat = (value: any) => {
  return \`\${dayjs(value[0]).format('YYYY年MM月DD日 HH:mm')} - \${dayjs(value[1]).format('YYYY年MM月DD日 HH:mm')}\`
}

const handleActivityConfirm = ({ value }) => {
  console.log('活动时间设置完成：', value)
}`,

    birthdayTemplate: `<wd-calendar
  v-model="scenarioValue3"
  :with-cell="false"
  :max-date="Date.now()"
  :min-date="new Date('1900-01-01').getTime()"
  @confirm="handleBirthdayConfirm"
>
  <wd-button type="warning">选择生日</wd-button>
</wd-calendar>`,

    birthdayScript: `const scenarioValue3 = ref<number | null>(null)

const handleBirthdayConfirm = ({ value }) => {
  console.log('生日选择完成：', dayjs(value).format('YYYY年MM月DD日'))
}`,
  },

  // 状态监控代码
  monitor: {
    template: `<!-- 实时状态显示 -->
<view class="mx-4 rounded-lg bg-blue-50 p-4">
  <view class="mb-3 text-base text-blue-800 font-medium">实时状态监控</view>
  <view class="text-sm text-blue-600 space-y-1">
    <view>总选择次数：{{ selectionCount }}</view>
    <view>最后选择类型：{{ lastSelectionType || '无' }}</view>
    <view>最后选择值：{{ lastSelectedValue || '无' }}</view>
    <view v-if="validationInfo.type" class="text-red-600">
      校验信息：{{ validationInfo.message }}
    </view>
  </view>
</view>

<!-- 操作记录 -->
<view class="mx-4 rounded-lg bg-gray-50 p-4">
  <view class="mb-3 text-base font-medium">操作记录</view>
  <view class="h-32 overflow-y-auto border border-gray-200 rounded bg-white p-2">
    <view
      v-for="(record, index) in operationRecords"
      :key="index"
      class="mb-1 text-sm"
      :class="getRecordColor(record.type)"
    >
      [{{ record.time }}] {{ record.message }}
    </view>
  </view>
  <view class="mt-2 flex gap-2">
    <wd-button size="small" @click="clearRecords">清空记录</wd-button>
    <wd-button size="small" type="info" @click="exportRecords">导出记录</wd-button>
  </view>
</view>`,

    script: `// 状态监控
const selectionCount = ref<number>(0)
const lastSelectionType = ref<string>('')
const lastSelectedValue = ref<string>('')
const validationInfo = ref<{ type: string; message: string }>({ type: '', message: '' })

// 操作记录
interface OperationRecord {
  time: string
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
}

const operationRecords = ref<OperationRecord[]>([])

const addRecord = (message: string, type: OperationRecord['type'] = 'info') => {
  operationRecords.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
    type,
  })
  // 限制记录数量
  if (operationRecords.value.length > 50) {
    operationRecords.value = operationRecords.value.slice(0, 50)
  }
}

const clearRecords = () => {
  operationRecords.value = []
  addRecord('清空了操作记录', 'warning')
}

const exportRecords = () => {
  const recordText = operationRecords.value
    .map((record) => \`[\${record.time}] \${record.message}\`)
    .join('\\n')
  console.log('导出记录：\\n', recordText)
}

const getRecordColor = (type: OperationRecord['type']) => {
  const colors = {
    success: 'text-green-600',
    info: 'text-blue-600',
    warning: 'text-orange-600',
    error: 'text-red-600',
  }
  return colors[type]
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'model-value',
    type: 'Number | Number[] | null',
    default: 'null',
    desc: '选中值，为 13 位时间戳或时间戳数组',
  },
  {
    name: 'type',
    type: 'CalendarType',
    default: '"date"',
    desc: '日期类型：date / dates / datetime / week / month / daterange / datetimerange / weekrange / monthrange',
  },
  {
    name: 'min-date',
    type: 'Number',
    default: '6个月前',
    desc: '最小日期，为 13 位时间戳',
  },
  {
    name: 'max-date',
    type: 'Number',
    default: '6个月后',
    desc: '最大日期，为 13 位时间戳',
  },
  {
    name: 'first-day-of-week',
    type: 'Number',
    default: '0',
    desc: '周起始天，0 表示周日，1 表示周一',
  },
  {
    name: 'formatter',
    type: 'CalendarFormatter',
    default: 'undefined',
    desc: '日期格式化函数',
  },
  {
    name: 'max-range',
    type: 'Number',
    default: 'undefined',
    desc: 'type 为范围选择时有效，最大日期范围',
  },
  {
    name: 'range-prompt',
    type: 'String',
    default: 'undefined',
    desc: 'type 为范围选择时有效，选择超出最大日期范围时的错误提示文案',
  },
  {
    name: 'allow-same-day',
    type: 'Boolean',
    default: 'false',
    desc: 'type 为范围选择时有效，是否允许选择同一天',
  },
  {
    name: 'default-time',
    type: 'String | String[]',
    default: 'undefined',
    desc: '选中日期所使用的当日内具体时刻',
  },
  {
    name: 'time-filter',
    type: 'CalendarTimeFilter',
    default: 'undefined',
    desc: 'type 为 datetime 或 datetimerange 时有效，用于过滤时间选择器的数据',
  },
  {
    name: 'hide-second',
    type: 'Boolean',
    default: 'false',
    desc: 'type 为 datetime 或 datetimerange 时有效，是否不展示秒修改',
  },
  {
    name: 'label',
    type: 'String',
    default: '""',
    desc: '选择器左侧文案',
  },
  {
    name: 'label-width',
    type: 'String',
    default: '""',
    desc: '设置左侧标题宽度',
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: '禁用',
  },
  {
    name: 'readonly',
    type: 'Boolean',
    default: 'false',
    desc: '只读',
  },
  {
    name: 'placeholder',
    type: 'String',
    default: '""',
    desc: '选择器占位符',
  },
  {
    name: 'title',
    type: 'String',
    default: '""',
    desc: '弹出层标题',
  },
  {
    name: 'align-right',
    type: 'Boolean',
    default: 'false',
    desc: '选择器的值靠右展示',
  },
  {
    name: 'error',
    type: 'Boolean',
    default: 'false',
    desc: '是否为错误状态，错误状态时右侧内容为红色',
  },
  {
    name: 'required',
    type: 'Boolean',
    default: 'false',
    desc: '是否必填',
  },
  {
    name: 'size',
    type: 'String',
    default: '""',
    desc: '设置选择器大小，可选值：large',
  },
  {
    name: 'center',
    type: 'Boolean',
    default: 'false',
    desc: '是否垂直居中',
  },
  {
    name: 'close-on-click-modal',
    type: 'Boolean',
    default: 'true',
    desc: '点击遮罩是否关闭',
  },
  {
    name: 'z-index',
    type: 'Number',
    default: '100',
    desc: '弹框层级',
  },
  {
    name: 'show-confirm',
    type: 'Boolean',
    default: 'true',
    desc: '是否显示确定按钮',
  },
  {
    name: 'confirm-text',
    type: 'String',
    default: '""',
    desc: '确定按钮文字',
  },
  {
    name: 'display-format',
    type: 'CalendarDisplayFormat',
    default: 'undefined',
    desc: '自定义展示文案的格式化函数，返回一个字符串',
  },
  {
    name: 'inner-display-format',
    type: 'CalendarInnerDisplayFormat',
    default: 'undefined',
    desc: '自定义范围选择类型的面板内部回显，返回一个字符串',
  },
  {
    name: 'ellipsis',
    type: 'Boolean',
    default: 'false',
    desc: '是否超出隐藏',
  },
  {
    name: 'show-type-switch',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示类型切换功能',
  },
  {
    name: 'shortcuts',
    type: 'Array<Record<string, any>>',
    default: '[]',
    desc: '快捷选项，为对象数组，其中对象的 text 必传',
  },
  {
    name: 'on-shortcuts-click',
    type: 'CalendarOnShortcutsClick',
    default: 'undefined',
    desc: '快捷操作点击回调',
  },
  {
    name: 'safe-area-inset-bottom',
    type: 'Boolean',
    default: 'true',
    desc: '弹出面板是否设置底部安全距离（iphone X 类型的机型）',
  },
  {
    name: 'before-confirm',
    type: 'CalendarBeforeConfirm',
    default: 'undefined',
    desc: '确定前校验函数，接收 { value, resolve } 参数，通过 resolve 继续执行',
  },
  {
    name: 'prop',
    type: 'String',
    default: '""',
    desc: '表单域 model 字段名，在使用表单校验功能的情况下，该属性是必填的',
  },
  {
    name: 'rules',
    type: 'Array<FormItemRule>',
    default: '[]',
    desc: '表单验证规则，结合wd-form组件使用',
  },
  {
    name: 'custom-view-class',
    type: 'String',
    default: '""',
    desc: '日历视图自定义样式类',
  },
  {
    name: 'custom-label-class',
    type: 'String',
    default: '""',
    desc: 'label 外部自定义样式',
  },
  {
    name: 'custom-value-class',
    type: 'String',
    default: '""',
    desc: 'value 外部自定义样式',
  },
  {
    name: 'immediate-change',
    type: 'Boolean',
    default: 'false',
    desc: '是否在手指松开时立即触发picker-view的 change 事件',
  },
  {
    name: 'with-cell',
    type: 'Boolean',
    default: 'true',
    desc: '是否使用内置单元格，默认为 true',
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

// Methods 方法文档
const apiMethods = [
  {
    name: 'open()',
    desc: '打开时间选择器弹窗',
  },
  {
    name: 'close()',
    desc: '关闭时间选择器弹窗',
  },
]

// Events 事件文档
const apiEvents = [
  {
    name: 'update:modelValue',
    desc: '更新modelValue时触发，参数为当前选中值',
  },
  {
    name: 'confirm',
    desc: '确认选择时触发，参数为 { value, type }',
  },
  {
    name: 'change',
    desc: '值改变时触发，参数为 { value }',
  },
  {
    name: 'cancel',
    desc: '取消选择时触发',
  },
  {
    name: 'open',
    desc: '打开选择器时触发',
  },
]

// 初始化一些记录
addRecord('日历选择器演示页面已加载', 'info')

const scroll = useScroll()

onShow(() => {
  scroll.resetScrollTop() // 页面显示时重置，避免页面切换时状态错误
})
onPageScroll((e) => {
  scroll.updateScrollTop(e.scrollTop)
})
</script>

<style lang="scss" scoped></style>
