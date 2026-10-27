<!-- DatetimePickerView 时间选择器视图 http://127.0.0.1:100/#/pages-sub/demo/wd/datetime-picker-view -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="DatetimePickerView 时间选择器视图" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="直接展示的时间选择器视图，支持多种时间类型">
      <!-- 示例效果展示 -->
      <view class="space-y-6">
        <!-- 日期时间选择器 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">日期时间选择器</view>
          <view class="border rounded-lg bg-white">
            <wd-datetime-picker-view v-model="basicValue1" @change="handleBasicChange1" />
          </view>
          <view class="mt-1 text-xs text-gray-500">
            当前值: {{ formatDisplayValue(basicValue1, 'datetime') }}
          </view>
        </view>

        <!-- 日期选择器 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">日期选择器</view>
          <view class="border rounded-lg bg-white">
            <wd-datetime-picker-view
              v-model="basicValue2"
              type="date"
              @change="handleBasicChange2"
            />
          </view>
          <view class="mt-1 text-xs text-gray-500">
            当前值: {{ formatDisplayValue(basicValue2, 'date') }}
          </view>
        </view>

        <!-- 年月选择器 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">年月选择器</view>
          <view class="border rounded-lg bg-white">
            <wd-datetime-picker-view
              v-model="basicValue3"
              type="year-month"
              @change="handleBasicChange3"
            />
          </view>
          <view class="mt-1 text-xs text-gray-500">
            当前值: {{ formatDisplayValue(basicValue3, 'year-month') }}
          </view>
        </view>

        <!-- 年选择器 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">年选择器</view>
          <view class="border rounded-lg bg-white">
            <wd-datetime-picker-view
              v-model="basicValue4"
              type="year"
              @change="handleBasicChange4"
            />
          </view>
          <view class="mt-1 text-xs text-gray-500">
            当前值: {{ formatDisplayValue(basicValue4, 'year') }}
          </view>
        </view>

        <!-- 时间选择器 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">时间选择器</view>
          <view class="border rounded-lg bg-white">
            <wd-datetime-picker-view
              v-model="basicValue5"
              type="time"
              @change="handleBasicChange5"
            />
          </view>
          <view class="mt-1 text-xs text-gray-500">当前值: {{ basicValue5 }}</view>
        </view>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 日期时间选择器" :code="codes.basic.datetimeTemplate" />
        <DemoCode title="模板 - 日期选择器" :code="codes.basic.dateTemplate" />
        <DemoCode title="模板 - 年月选择器" :code="codes.basic.yearMonthTemplate" />
        <DemoCode title="模板 - 年选择器" :code="codes.basic.yearTemplate" />
        <DemoCode title="模板 - 时间选择器" :code="codes.basic.timeTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 带秒显示示例 -->
    <DemoSection title="带秒显示" desc="启用秒级精度的时间选择">
      <view class="space-y-6">
        <!-- 日期时间带秒 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">日期时间带秒</view>
          <view class="border rounded-lg bg-white">
            <wd-datetime-picker-view
              v-model="secondValue1"
              use-second
              @change="handleSecondChange1"
            />
          </view>
          <view class="mt-1 text-xs text-gray-500">
            当前值: {{ formatDisplayValue(secondValue1, 'datetime', true) }}
          </view>
        </view>

        <!-- 时间带秒 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">时间带秒</view>
          <view class="border rounded-lg bg-white">
            <wd-datetime-picker-view
              v-model="secondValue2"
              type="time"
              use-second
              @change="handleSecondChange2"
            />
          </view>
          <view class="mt-1 text-xs text-gray-500">当前值: {{ secondValue2 }}</view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 日期时间带秒" :code="codes.second.datetimeTemplate" />
        <DemoCode title="模板 - 时间带秒" :code="codes.second.timeTemplate" />
        <DemoCode title="脚本 - 带秒显示" :code="codes.second.script" />
      </template>
    </DemoSection>

    <!-- 自定义格式化示例 -->
    <DemoSection title="自定义格式化" desc="使用自定义格式化函数改变显示格式">
      <view class="space-y-6">
        <!-- 中文格式化 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">中文格式化显示</view>
          <view class="border rounded-lg bg-white">
            <wd-datetime-picker-view
              v-model="formatValue1"
              :formatter="chineseFormatter"
              @change="handleFormatChange1"
            />
          </view>
          <view class="mt-1 text-xs text-gray-500">
            当前值: {{ formatDisplayValue(formatValue1, 'datetime') }}
          </view>
        </view>

        <!-- 自定义单位格式化 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">自定义单位格式化</view>
          <view class="border rounded-lg bg-white">
            <wd-datetime-picker-view
              v-model="formatValue2"
              type="time"
              :formatter="customUnitFormatter"
              @change="handleFormatChange2"
            />
          </view>
          <view class="mt-1 text-xs text-gray-500">当前值: {{ formatValue2 }}</view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 中文格式化" :code="codes.format.chineseTemplate" />
        <DemoCode title="模板 - 自定义单位" :code="codes.format.unitTemplate" />
        <DemoCode title="脚本 - 自定义格式化" :code="codes.format.script" />
      </template>
    </DemoSection>

    <!-- 过滤选项示例 -->
    <DemoSection title="过滤选项" desc="通过过滤器限制可选择的选项">
      <view class="space-y-6">
        <!-- 分钟5分钟间隔 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">分钟只能选择5的倍数</view>
          <view class="border rounded-lg bg-white">
            <wd-datetime-picker-view
              v-model="filterValue1"
              :filter="minuteFilter"
              @change="handleFilterChange1"
            />
          </view>
          <view class="mt-1 text-xs text-gray-500">
            当前值: {{ formatDisplayValue(filterValue1, 'datetime') }}
          </view>
        </view>

        <!-- 工作时间过滤 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">只显示工作时间（9-18时）</view>
          <view class="border rounded-lg bg-white">
            <wd-datetime-picker-view
              v-model="filterValue2"
              type="time"
              :filter="workHourFilter"
              @change="handleFilterChange2"
            />
          </view>
          <view class="mt-1 text-xs text-gray-500">当前值: {{ filterValue2 }}</view>
        </view>

        <!-- 工作日过滤 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">只显示工作日</view>
          <view class="border rounded-lg bg-white">
            <wd-datetime-picker-view
              v-model="filterValue3"
              type="date"
              :filter="weekdayFilter"
              @change="handleFilterChange3"
            />
          </view>
          <view class="mt-1 text-xs text-gray-500">
            当前值: {{ formatDisplayValue(filterValue3, 'date') }}
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 分钟间隔过滤" :code="codes.filter.minuteTemplate" />
        <DemoCode title="模板 - 工作时间过滤" :code="codes.filter.workHourTemplate" />
        <DemoCode title="模板 - 工作日过滤" :code="codes.filter.weekdayTemplate" />
        <DemoCode title="脚本 - 过滤选项" :code="codes.filter.script" />
      </template>
    </DemoSection>

    <!-- 时间范围限制示例 -->
    <DemoSection title="时间范围限制" desc="设置可选择的时间范围">
      <view class="space-y-6">
        <!-- 日期范围限制 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">限制在近一个月内</view>
          <view class="border rounded-lg bg-white">
            <wd-datetime-picker-view
              v-model="rangeValue1"
              type="date"
              :min-date="oneMonthAgo"
              :max-date="today"
              @change="handleRangeChange1"
            />
          </view>
          <view class="mt-1 text-xs text-gray-500">
            当前值: {{ formatDisplayValue(rangeValue1, 'date') }}
          </view>
        </view>

        <!-- 时间范围限制 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">限制在上午时间（8-12时）</view>
          <view class="border rounded-lg bg-white">
            <wd-datetime-picker-view
              v-model="rangeValue2"
              type="time"
              :min-hour="8"
              :max-hour="12"
              @change="handleRangeChange2"
            />
          </view>
          <view class="mt-1 text-xs text-gray-500">当前值: {{ rangeValue2 }}</view>
        </view>

        <!-- 分钟范围限制 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">限制分钟范围（15-45分）</view>
          <view class="border rounded-lg bg-white">
            <wd-datetime-picker-view
              v-model="rangeValue3"
              type="time"
              :min-minute="15"
              :max-minute="45"
              @change="handleRangeChange3"
            />
          </view>
          <view class="mt-1 text-xs text-gray-500">当前值: {{ rangeValue3 }}</view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 日期范围限制" :code="codes.range.dateTemplate" />
        <DemoCode title="模板 - 时间范围限制" :code="codes.range.timeTemplate" />
        <DemoCode title="模板 - 分钟范围限制" :code="codes.range.minuteTemplate" />
        <DemoCode title="脚本 - 范围限制" :code="codes.range.script" />
      </template>
    </DemoSection>

    <!-- 加载状态示例 -->
    <DemoSection title="加载状态" desc="显示加载状态和自定义加载颜色">
      <view class="space-y-6">
        <!-- 默认加载状态 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">默认加载状态</view>
          <view class="border rounded-lg bg-white">
            <wd-datetime-picker-view
              v-model="loadingValue1"
              :loading="isLoading1"
              @change="handleLoadingChange1"
            />
          </view>
          <view class="mt-2">
            <wd-button size="small" @click="toggleLoading1">
              {{ isLoading1 ? '关闭加载' : '显示加载' }}
            </wd-button>
          </view>
        </view>

        <!-- 自定义加载颜色 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">自定义加载颜色</view>
          <view class="border rounded-lg bg-white">
            <wd-datetime-picker-view
              v-model="loadingValue2"
              type="time"
              :loading="isLoading2"
              loading-color="#ff4757"
              @change="handleLoadingChange2"
            />
          </view>
          <view class="mt-2">
            <wd-button size="small" type="danger" @click="toggleLoading2">
              {{ isLoading2 ? '关闭加载' : '显示红色加载' }}
            </wd-button>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 默认加载状态" :code="codes.loading.defaultTemplate" />
        <DemoCode title="模板 - 自定义加载颜色" :code="codes.loading.colorTemplate" />
        <DemoCode title="脚本 - 加载状态" :code="codes.loading.script" />
      </template>
    </DemoSection>

    <!-- 高度定制示例 -->
    <DemoSection title="高度定制" desc="自定义选择器高度">
      <view class="space-y-6">
        <!-- 小高度 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">小高度选择器（150px）</view>
          <view class="border rounded-lg bg-white">
            <wd-datetime-picker-view
              v-model="heightValue1"
              type="time"
              :columns-height="150"
              @change="handleHeightChange1"
            />
          </view>
          <view class="mt-1 text-xs text-gray-500">当前值: {{ heightValue1 }}</view>
        </view>

        <!-- 大高度 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">大高度选择器（300px）</view>
          <view class="border rounded-lg bg-white">
            <wd-datetime-picker-view
              v-model="heightValue2"
              type="date"
              :columns-height="300"
              @change="handleHeightChange2"
            />
          </view>
          <view class="mt-1 text-xs text-gray-500">
            当前值: {{ formatDisplayValue(heightValue2, 'date') }}
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 小高度选择器" :code="codes.height.smallTemplate" />
        <DemoCode title="模板 - 大高度选择器" :code="codes.height.largeTemplate" />
        <DemoCode title="脚本 - 高度定制" :code="codes.height.script" />
      </template>
    </DemoSection>

    <!-- 事件监听示例 -->
    <DemoSection title="事件监听" desc="监听选择器的各种事件">
      <!-- 状态显示区域 -->
      <view class="space-y-4">
        <!-- 控制区域 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">事件监听选择器</view>
          <view class="border rounded-lg bg-white">
            <wd-datetime-picker-view
              v-model="eventValue"
              @change="handleEventChange"
              @pick-start="handlePickStart"
              @pick-end="handlePickEnd"
            />
          </view>
          <view class="mt-1 text-xs text-gray-500">
            当前值: {{ formatDisplayValue(eventValue, 'datetime') }}
          </view>
        </view>

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
    <DemoApi :props="apiProps" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import type {
  DatetimePickerViewFilter,
  DatetimePickerViewFormatter,
  DateTimeType,
} from '@/wd/components/wd-datetime-picker-view/wd-datetime-picker-view.vue'
import { ref } from 'vue'

// ===== 组件状态管理 =====

// 基本用法状态
const basicValue1 = ref<number>(Date.now())
const basicValue2 = ref<number>(Date.now())
const basicValue3 = ref<number>(Date.now())
const basicValue4 = ref<number>(Date.now())
const basicValue5 = ref<string>('11:12')

// 带秒显示状态
const secondValue1 = ref<number>(Date.now())
const secondValue2 = ref<string>('11:12:30')

// 自定义格式化状态
const formatValue1 = ref<number>(Date.now())
const formatValue2 = ref<string>('11:12')

// 过滤选项状态
const filterValue1 = ref<number>(Date.now())
const filterValue2 = ref<string>('10:00')
const filterValue3 = ref<number>(Date.now())

// 时间范围限制状态
const rangeValue1 = ref<number>(Date.now())
const rangeValue2 = ref<string>('10:00')
const rangeValue3 = ref<string>('10:30')

// 加载状态
const loadingValue1 = ref<number>(Date.now())
const loadingValue2 = ref<string>('11:12')
const isLoading1 = ref<boolean>(false)
const isLoading2 = ref<boolean>(false)

// 高度定制状态
const heightValue1 = ref<string>('11:12')
const heightValue2 = ref<number>(Date.now())

// 事件监听状态
const eventValue = ref<number>(Date.now())

// 事件日志状态
interface EventLog {
  time: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

const eventLogs = ref<EventLog[]>([])

// 时间范围配置
const today = ref<number>(Date.now())
const oneMonthAgo = ref<number>(Date.now() - 30 * 24 * 60 * 60 * 1000)

// ===== 自定义格式化函数 =====

/**
 * 中文格式化函数
 */
const chineseFormatter: DatetimePickerViewFormatter = (type, value) => {
  switch (type) {
    case 'year':
      return `${value}年`
    case 'month':
      return `${value}月`
    case 'date':
      return `${value}日`
    case 'hour':
      return `${value}时`
    case 'minute':
      return `${value}分`
    case 'second':
      return `${value}秒`
    default:
      return value
  }
}

/**
 * 自定义单位格式化函数
 */
const customUnitFormatter: DatetimePickerViewFormatter = (type, value) => {
  switch (type) {
    case 'hour':
      return `${value}小时`
    case 'minute':
      return `${value}分钟`
    case 'second':
      return `${value}秒钟`
    default:
      return value
  }
}

// ===== 过滤器函数 =====

/**
 * 分钟过滤器 - 只能选择5的倍数
 */
const minuteFilter: DatetimePickerViewFilter = (type, values) => {
  if (type === 'minute') {
    return values.filter((value) => value % 5 === 0)
  }
  return values
}

/**
 * 工作时间过滤器 - 只显示9-18时
 */
const workHourFilter: DatetimePickerViewFilter = (type, values) => {
  if (type === 'hour') {
    return values.filter((value) => value >= 9 && value <= 18)
  }
  return values
}

/**
 * 工作日过滤器 - 过滤掉周末
 */
const weekdayFilter: DatetimePickerViewFilter = (type, values) => {
  if (type === 'date') {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    return values.filter((value) => {
      const date = new Date(currentYear, currentMonth, value)
      const dayOfWeek = date.getDay()
      return dayOfWeek !== 0 && dayOfWeek !== 6 // 过滤掉周日(0)和周六(6)
    })
  }
  return values
}

// ===== 工具方法 =====

/**
 * 格式化显示值
 */
const formatDisplayValue = (
  value: string | number,
  type: DateTimeType,
  useSecond: boolean = false,
): string => {
  if (type === 'time') {
    return String(value)
  }

  const date = new Date(value)

  switch (type) {
    case 'year':
      return `${date.getFullYear()}年`
    case 'year-month':
      return `${date.getFullYear()}年${date.getMonth() + 1}月`
    case 'date':
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    case 'datetime':
      if (useSecond) {
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
      }
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
    default:
      return String(value)
  }
}

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

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    datetimeTemplate: `<view class="rounded-lg border bg-white">
  <wd-datetime-picker-view v-model="basicValue1" @change="handleBasicChange1" />
</view>`,

    dateTemplate: `<view class="rounded-lg border bg-white">
  <wd-datetime-picker-view v-model="basicValue2" type="date" @change="handleBasicChange2" />
</view>`,

    yearMonthTemplate: `<view class="rounded-lg border bg-white">
  <wd-datetime-picker-view v-model="basicValue3" type="year-month" @change="handleBasicChange3" />
</view>`,

    yearTemplate: `<view class="rounded-lg border bg-white">
  <wd-datetime-picker-view v-model="basicValue4" type="year" @change="handleBasicChange4" />
</view>`,

    timeTemplate: `<view class="rounded-lg border bg-white">
  <wd-datetime-picker-view v-model="basicValue5" type="time" @change="handleBasicChange5" />
</view>`,

    script: `import { ref } from 'vue'

// 基本用法状态
const basicValue1 = ref(Date.now())        // 日期时间
const basicValue2 = ref(Date.now())        // 日期
const basicValue3 = ref(Date.now())        // 年月
const basicValue4 = ref(Date.now())        // 年
const basicValue5 = ref('11:12')           // 时间

// 事件处理方法
const handleBasicChange1 = ({ value }) => {
  console.log('日期时间变化:', new Date(value))
}

const handleBasicChange2 = ({ value }) => {
  console.log('日期变化:', new Date(value))
}`,
  },

  // 带秒显示代码
  second: {
    datetimeTemplate: `<view class="rounded-lg border bg-white">
  <wd-datetime-picker-view v-model="secondValue1" use-second @change="handleSecondChange1" />
</view>`,

    timeTemplate: `<view class="rounded-lg border bg-white">
  <wd-datetime-picker-view v-model="secondValue2" type="time" use-second @change="handleSecondChange2" />
</view>`,

    script: `// 带秒显示状态
const secondValue1 = ref(Date.now())       // 日期时间带秒
const secondValue2 = ref('11:12:30')       // 时间带秒

const handleSecondChange1 = ({ value }) => {
  console.log('日期时间带秒变化:', new Date(value))
}

const handleSecondChange2 = ({ value }) => {
  console.log('时间带秒变化:', value)
}`,
  },

  // 自定义格式化代码
  format: {
    chineseTemplate: `<view class="rounded-lg border bg-white">
  <wd-datetime-picker-view
    v-model="formatValue1"
    :formatter="chineseFormatter"
    @change="handleFormatChange1"
  />
</view>`,

    unitTemplate: `<view class="rounded-lg border bg-white">
  <wd-datetime-picker-view
    v-model="formatValue2"
    type="time"
    :formatter="customUnitFormatter"
    @change="handleFormatChange2"
  />
</view>`,

    script: `// 中文格式化函数
const chineseFormatter = (type, value) => {
  switch (type) {
    case 'year':
      return \`\${value}年\`
    case 'month':
      return \`\${value}月\`
    case 'date':
      return \`\${value}日\`
    case 'hour':
      return \`\${value}时\`
    case 'minute':
      return \`\${value}分\`
    case 'second':
      return \`\${value}秒\`
    default:
      return value
  }
}

// 自定义单位格式化函数
const customUnitFormatter = (type, value) => {
  switch (type) {
    case 'hour':
      return \`\${value}小时\`
    case 'minute':
      return \`\${value}分钟\`
    case 'second':
      return \`\${value}秒钟\`
    default:
      return value
  }
}`,
  },

  // 过滤选项代码
  filter: {
    minuteTemplate: `<view class="rounded-lg border bg-white">
  <wd-datetime-picker-view
    v-model="filterValue1"
    :filter="minuteFilter"
    @change="handleFilterChange1"
  />
</view>`,

    workHourTemplate: `<view class="rounded-lg border bg-white">
  <wd-datetime-picker-view
    v-model="filterValue2"
    type="time"
    :filter="workHourFilter"
    @change="handleFilterChange2"
  />
</view>`,

    weekdayTemplate: `<view class="rounded-lg border bg-white">
  <wd-datetime-picker-view
    v-model="filterValue3"
    type="date"
    :filter="weekdayFilter"
    @change="handleFilterChange3"
  />
</view>`,

    script: `// 分钟过滤器 - 只能选择5的倍数
const minuteFilter = (type, values) => {
  if (type === 'minute') {
    return values.filter((value) => value % 5 === 0)
  }
  return values
}

// 工作时间过滤器 - 只显示9-18时
const workHourFilter = (type, values) => {
  if (type === 'hour') {
    return values.filter((value) => value >= 9 && value <= 18)
  }
  return values
}

// 工作日过滤器 - 过滤掉周末
const weekdayFilter = (type, values) => {
  if (type === 'date') {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    return values.filter((value) => {
      const date = new Date(currentYear, currentMonth, value)
      const dayOfWeek = date.getDay()
      return dayOfWeek !== 0 && dayOfWeek !== 6 // 过滤掉周日和周六
    })
  }
  return values
}`,
  },

  // 范围限制代码
  range: {
    dateTemplate: `<view class="rounded-lg border bg-white">
  <wd-datetime-picker-view
    v-model="rangeValue1"
    type="date"
    :min-date="oneMonthAgo"
    :max-date="today"
    @change="handleRangeChange1"
  />
</view>`,

    timeTemplate: `<view class="rounded-lg border bg-white">
  <wd-datetime-picker-view
    v-model="rangeValue2"
    type="time"
    :min-hour="8"
    :max-hour="12"
    @change="handleRangeChange2"
  />
</view>`,

    minuteTemplate: `<view class="rounded-lg border bg-white">
  <wd-datetime-picker-view
    v-model="rangeValue3"
    type="time"
    :min-minute="15"
    :max-minute="45"
    @change="handleRangeChange3"
  />
</view>`,

    script: `// 时间范围配置
const today = ref(Date.now())
const oneMonthAgo = ref(Date.now() - 30 * 24 * 60 * 60 * 1000)

const handleRangeChange1 = ({ value }) => {
  console.log('日期范围限制变化:', new Date(value))
}

const handleRangeChange2 = ({ value }) => {
  console.log('时间范围限制变化:', value)
}

const handleRangeChange3 = ({ value }) => {
  console.log('分钟范围限制变化:', value)
}`,
  },

  // 加载状态代码
  loading: {
    defaultTemplate: `<view class="rounded-lg border bg-white">
  <wd-datetime-picker-view
    v-model="loadingValue1"
    :loading="isLoading1"
    @change="handleLoadingChange1"
  />
</view>`,

    colorTemplate: `<view class="rounded-lg border bg-white">
  <wd-datetime-picker-view
    v-model="loadingValue2"
    type="time"
    :loading="isLoading2"
    loading-color="#ff4757"
    @change="handleLoadingChange2"
  />
</view>`,

    script: `// 加载状态
const isLoading1 = ref(false)
const isLoading2 = ref(false)

const toggleLoading1 = () => {
  isLoading1.value = !isLoading1.value
}

const toggleLoading2 = () => {
  isLoading2.value = !isLoading2.value
}`,
  },

  // 高度定制代码
  height: {
    smallTemplate: `<view class="rounded-lg border bg-white">
  <wd-datetime-picker-view
    v-model="heightValue1"
    type="time"
    :columns-height="150"
    @change="handleHeightChange1"
  />
</view>`,

    largeTemplate: `<view class="rounded-lg border bg-white">
  <wd-datetime-picker-view
    v-model="heightValue2"
    type="date"
    :columns-height="300"
    @change="handleHeightChange2"
  />
</view>`,

    script: `// 高度定制状态
const heightValue1 = ref('11:12')
const heightValue2 = ref(Date.now())

const handleHeightChange1 = ({ value }) => {
  console.log('小高度选择器变化:', value)
}

const handleHeightChange2 = ({ value }) => {
  console.log('大高度选择器变化:', new Date(value))
}`,
  },

  // 事件监听代码
  events: {
    template: `
      <view class="rounded-lg border bg-white">
        <wd-datetime-picker-view
          v-model="eventValue"
          @change="handleEventChange"
          @pick-start="handlePickStart"
          @pick-end="handlePickEnd"
        />
      </view>`,

    methods: `const handleEventChange = ({ value }) => {
  addEventLog(\`值发生变化: \${new Date(value)}\`, 'success')
}

const handlePickStart = () => {
  addEventLog('开始选择', 'info')
}

const handlePickEnd = () => {
  addEventLog('结束选择', 'info')
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'model-value',
    type: 'String | Number',
    default: '""',
    desc: '选中项，当 type 为 time 时，类型为字符串，否则为时间戳',
  },
  {
    name: 'type',
    type: 'String',
    default: '"datetime"',
    desc: '选择器类型：date / year-month / time / datetime / year',
  },
  {
    name: 'loading',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示加载状态',
  },
  {
    name: 'loading-color',
    type: 'String',
    default: '"#4D80F0"',
    desc: '加载的颜色，只能使用十六进制的色值写法，且不能使用缩写',
  },
  {
    name: 'columns-height',
    type: 'Number',
    default: '217',
    desc: 'picker内部滚筒高度',
  },
  {
    name: 'value-key',
    type: 'String',
    default: '"value"',
    desc: '选项的key',
  },
  {
    name: 'label-key',
    type: 'String',
    default: '"label"',
    desc: '选项的label',
  },
  {
    name: 'filter',
    type: 'Function',
    default: 'null',
    desc: '自定义过滤选项的函数，返回列的选项数组',
  },
  {
    name: 'formatter',
    type: 'Function',
    default: 'null',
    desc: '自定义弹出层选项文案的格式化函数',
  },
  {
    name: 'column-formatter',
    type: 'Function',
    default: 'null',
    desc: '自定义列的格式化函数',
  },
  {
    name: 'min-date',
    type: 'Number',
    default: '十年前',
    desc: '最小日期时间戳',
  },
  {
    name: 'max-date',
    type: 'Number',
    default: '十年后',
    desc: '最大日期时间戳',
  },
  {
    name: 'min-hour',
    type: 'Number',
    default: '0',
    desc: '最小小时，time类型时生效',
  },
  {
    name: 'max-hour',
    type: 'Number',
    default: '23',
    desc: '最大小时，time类型时生效',
  },
  {
    name: 'min-minute',
    type: 'Number',
    default: '0',
    desc: '最小分钟，time类型时生效',
  },
  {
    name: 'max-minute',
    type: 'Number',
    default: '59',
    desc: '最大分钟，time类型时生效',
  },
  {
    name: 'use-second',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示秒选择，仅在 time 和 datetime 类型下生效',
  },
  {
    name: 'min-second',
    type: 'Number',
    default: '0',
    desc: '最小秒数，仅在 time 和 datetime 类型下生效',
  },
  {
    name: 'max-second',
    type: 'Number',
    default: '59',
    desc: '最大秒数，仅在 time 和 datetime 类型下生效',
  },
  {
    name: 'immediate-change',
    type: 'Boolean',
    default: 'false',
    desc: '是否在手指松开时立即触发picker-view的 change 事件',
  },
]

// Events 事件文档
const apiEvents = [
  {
    name: 'change',
    desc: '选中项变化时触发，参数为 { value, picker }',
  },
  {
    name: 'pick-start',
    desc: '开始选择时触发',
  },
  {
    name: 'pick-end',
    desc: '结束选择时触发',
  },
]

// ===== 事件处理方法 =====

// === 基本用法事件处理方法 ===

/**
 * 基本日期时间变化事件
 */
const handleBasicChange1 = ({ value }: { value: string | number }) => {
  console.log('日期时间变化:', new Date(value as number))
}

/**
 * 基本日期变化事件
 */
const handleBasicChange2 = ({ value }: { value: string | number }) => {
  console.log('日期变化:', new Date(value as number))
}

/**
 * 基本年月变化事件
 */
const handleBasicChange3 = ({ value }: { value: string | number }) => {
  console.log('年月变化:', new Date(value as number))
}

/**
 * 基本年变化事件
 */
const handleBasicChange4 = ({ value }: { value: string | number }) => {
  console.log('年变化:', new Date(value as number))
}

/**
 * 基本时间变化事件
 */
const handleBasicChange5 = ({ value }: { value: string | number }) => {
  console.log('时间变化:', value)
}

// === 带秒显示事件处理方法 ===

/**
 * 带秒日期时间变化事件
 */
const handleSecondChange1 = ({ value }: { value: string | number }) => {
  console.log('日期时间带秒变化:', new Date(value as number))
}

/**
 * 带秒时间变化事件
 */
const handleSecondChange2 = ({ value }: { value: string | number }) => {
  console.log('时间带秒变化:', value)
}

// === 自定义格式化事件处理方法 ===

/**
 * 中文格式化变化事件
 */
const handleFormatChange1 = ({ value }: { value: string | number }) => {
  console.log('中文格式化变化:', new Date(value as number))
}

/**
 * 自定义单位格式化变化事件
 */
const handleFormatChange2 = ({ value }: { value: string | number }) => {
  console.log('自定义单位格式化变化:', value)
}

// === 过滤选项事件处理方法 ===

/**
 * 分钟过滤变化事件
 */
const handleFilterChange1 = ({ value }: { value: string | number }) => {
  console.log('分钟过滤变化:', new Date(value as number))
}

/**
 * 工作时间过滤变化事件
 */
const handleFilterChange2 = ({ value }: { value: string | number }) => {
  console.log('工作时间过滤变化:', value)
}

/**
 * 工作日过滤变化事件
 */
const handleFilterChange3 = ({ value }: { value: string | number }) => {
  console.log('工作日过滤变化:', new Date(value as number))
}

// === 时间范围限制事件处理方法 ===

/**
 * 日期范围限制变化事件
 */
const handleRangeChange1 = ({ value }: { value: string | number }) => {
  console.log('日期范围限制变化:', new Date(value as number))
}

/**
 * 时间范围限制变化事件
 */
const handleRangeChange2 = ({ value }: { value: string | number }) => {
  console.log('时间范围限制变化:', value)
}

/**
 * 分钟范围限制变化事件
 */
const handleRangeChange3 = ({ value }: { value: string | number }) => {
  console.log('分钟范围限制变化:', value)
}

// === 加载状态事件处理方法 ===

/**
 * 默认加载状态变化事件
 */
const handleLoadingChange1 = ({ value }: { value: string | number }) => {
  console.log('默认加载状态变化:', new Date(value as number))
}

/**
 * 自定义加载颜色变化事件
 */
const handleLoadingChange2 = ({ value }: { value: string | number }) => {
  console.log('自定义加载颜色变化:', value)
}

/**
 * 切换默认加载状态
 */
const toggleLoading1 = () => {
  isLoading1.value = !isLoading1.value
  console.log('切换默认加载状态:', isLoading1.value)
}

/**
 * 切换自定义加载状态
 */
const toggleLoading2 = () => {
  isLoading2.value = !isLoading2.value
  console.log('切换自定义加载状态:', isLoading2.value)
}

// === 高度定制事件处理方法 ===

/**
 * 小高度选择器变化事件
 */
const handleHeightChange1 = ({ value }: { value: string | number }) => {
  console.log('小高度选择器变化:', value)
}

/**
 * 大高度选择器变化事件
 */
const handleHeightChange2 = ({ value }: { value: string | number }) => {
  console.log('大高度选择器变化:', new Date(value as number))
}

// === 事件监听事件处理方法 ===

/**
 * 事件变化事件
 */
const handleEventChange = ({ value }: { value: string | number }) => {
  addEventLog(`值发生变化: ${formatDisplayValue(value, 'datetime')}`, 'success')
}

/**
 * 开始选择事件
 */
const handlePickStart = () => {
  addEventLog('开始选择', 'info')
}

/**
 * 结束选择事件
 */
const handlePickEnd = () => {
  addEventLog('结束选择', 'info')
}
const { resetScrollTop, updateScrollTop } = useScroll()
onShow(() => {
  resetScrollTop()
})
onPageScroll((e) => {
  updateScrollTop(e.scrollTop)
})
</script>

<style lang="scss" scoped></style>
