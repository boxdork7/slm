<!-- DatetimePicker 时间选择器 http://127.0.0.1:100/#/pages-sub/demo/wd/datetime-picker -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="DatetimePicker 时间选择器" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="支持多种时间选择类型，日期、时间、年月等">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-datetime-picker v-model="basicValue1" label="日期时间" @confirm="handleBasicConfirm1" />
        <wd-datetime-picker v-model="basicValue2" label="日期选择" type="date" @confirm="handleBasicConfirm2" />
        <wd-datetime-picker v-model="basicValue3" label="年月选择" type="year-month" @confirm="handleBasicConfirm3" />
        <wd-datetime-picker v-model="basicValue4" label="年选择" type="year" @confirm="handleBasicConfirm4" />
        <wd-datetime-picker v-model="basicValue5" label="时间选择" type="time" @confirm="handleBasicConfirm5" />
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 日期时间选择" :code="codes.basic.datetimeTemplate" />
        <DemoCode title="模板 - 日期选择" :code="codes.basic.dateTemplate" />
        <DemoCode title="模板 - 年月选择" :code="codes.basic.yearMonthTemplate" />
        <DemoCode title="模板 - 年选择" :code="codes.basic.yearTemplate" />
        <DemoCode title="模板 - 时间选择" :code="codes.basic.timeTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 带秒显示示例 -->
    <DemoSection title="带秒显示" desc="支持秒级精度的时间选择">
      <wd-cell-group>
        <wd-datetime-picker v-model="secondValue1" label="日期时间带秒" use-second @confirm="handleSecondConfirm1" />
        <wd-datetime-picker v-model="secondValue2" label="时间带秒" type="time" use-second @confirm="handleSecondConfirm2" />
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 日期时间带秒" :code="codes.second.datetimeTemplate" />
        <DemoCode title="模板 - 时间带秒" :code="codes.second.timeTemplate" />
        <DemoCode title="脚本 - 带秒显示" :code="codes.second.script" />
      </template>
    </DemoSection>

    <!-- 自定义格式化示例 -->
    <DemoSection title="自定义格式化" desc="自定义显示格式和内部数据格式">
      <wd-cell-group>
        <wd-datetime-picker
          v-model="formatValue1"
          label="自定义显示格式"
          :display-format="customDisplayFormat"
          @confirm="handleFormatConfirm1"
        />
        <wd-datetime-picker
          v-model="formatValue2"
          label="自定义内部格式"
          :formatter="customFormatter"
          @confirm="handleFormatConfirm2"
        />
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 自定义显示格式" :code="codes.format.displayTemplate" />
        <DemoCode title="模板 - 自定义内部格式" :code="codes.format.formatterTemplate" />
        <DemoCode title="脚本 - 自定义格式化" :code="codes.format.script" />
      </template>
    </DemoSection>

    <!-- 过滤选项示例 -->
    <DemoSection title="过滤选项" desc="通过过滤器限制可选择的选项">
      <wd-cell-group>
        <wd-datetime-picker
          v-model="filterValue"
          label="分钟只能选5的倍数"
          :filter="minuteFilter"
          @confirm="handleFilterConfirm"
        />
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 过滤选项" :code="codes.filter.template" />
        <DemoCode title="脚本 - 过滤选项" :code="codes.filter.script" />
      </template>
    </DemoSection>

    <!-- 时间范围限制示例 -->
    <DemoSection title="时间范围限制" desc="设置可选择的时间范围">
      <wd-cell-group>
        <wd-datetime-picker
          v-model="rangeValue1"
          label="限制一年内"
          :min-date="minDate"
          :max-date="maxDate"
          @confirm="handleRangeConfirm1"
        />
        <wd-datetime-picker
          v-model="rangeValue2"
          label="限制工作时间"
          type="time"
          :min-hour="9"
          :max-hour="18"
          :min-minute="0"
          :max-minute="59"
          @confirm="handleRangeConfirm2"
        />
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 日期范围限制" :code="codes.range.dateTemplate" />
        <DemoCode title="模板 - 时间范围限制" :code="codes.range.timeTemplate" />
        <DemoCode title="脚本 - 范围限制" :code="codes.range.script" />
      </template>
    </DemoSection>

    <!-- 状态配置示例 -->
    <DemoSection title="状态配置" desc="不同的状态配置和样式">
      <wd-cell-group>
        <wd-datetime-picker v-model="stateValue1" label="必填状态" required @confirm="handleStateConfirm1" />
        <wd-datetime-picker v-model="stateValue2" label="错误状态" error @confirm="handleStateConfirm2" />
        <wd-datetime-picker v-model="stateValue3" label="禁用状态" disabled @confirm="handleStateConfirm3" />
        <wd-datetime-picker v-model="stateValue4" label="只读状态" readonly @confirm="handleStateConfirm4" />
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 状态配置" :code="codes.state.template" />
        <DemoCode title="脚本 - 状态配置" :code="codes.state.script" />
      </template>
    </DemoSection>

    <!-- 尺寸和对齐示例 -->
    <DemoSection title="尺寸和对齐" desc="不同的尺寸规格和对齐方式">
      <wd-cell-group>
        <wd-datetime-picker v-model="sizeValue1" label="大尺寸" size="large" @confirm="handleSizeConfirm1" />
        <wd-datetime-picker v-model="sizeValue2" label="右对齐" align-right @confirm="handleSizeConfirm2" />
        <wd-datetime-picker v-model="sizeValue3" label="自定义标签宽度" label-width="120px" @confirm="handleSizeConfirm3" />
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 尺寸和对齐" :code="codes.size.template" />
        <DemoCode title="脚本 - 尺寸和对齐" :code="codes.size.script" />
      </template>
    </DemoSection>

    <!-- 无标签和自定义标题示例 -->
    <DemoSection title="无标签和自定义标题" desc="不使用标签或自定义弹窗标题">
      <view class="space-y-4">
        <!-- 无标签 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">无标签样式</view>
          <wd-datetime-picker v-model="noLabelValue" placeholder="请选择日期时间" @confirm="handleNoLabelConfirm" />
        </view>

        <!-- 自定义标题 -->
        <wd-cell-group>
          <wd-datetime-picker
            v-model="titleValue"
            label="自定义标题"
            title="请选择您的生日"
            type="date"
            @confirm="handleTitleConfirm"
          />
        </wd-cell-group>
      </view>

      <template #codes>
        <DemoCode title="模板 - 无标签" :code="codes.label.noLabelTemplate" />
        <DemoCode title="模板 - 自定义标题" :code="codes.label.titleTemplate" />
        <DemoCode title="脚本 - 标签和标题" :code="codes.label.script" />
      </template>
    </DemoSection>

    <!-- 区域选择示例 -->
    <DemoSection title="区域选择" desc="选择时间范围，支持开始和结束时间">
      <wd-cell-group>
        <wd-datetime-picker
          v-model="regionValue1"
          label="日期范围选择"
          title="请选择日期范围"
          type="date"
          @confirm="handleRegionConfirm1"
        />
        <wd-datetime-picker
          v-model="regionValue2"
          label="时间范围选择"
          title="请选择时间范围"
          type="time"
          @confirm="handleRegionConfirm2"
        />
        <wd-datetime-picker
          v-model="regionValue3"
          label="日期时间范围"
          title="请选择日期时间范围"
          :display-format-tab-label="customTabLabelFormat"
          @confirm="handleRegionConfirm3"
        />
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 日期范围选择" :code="codes.region.dateTemplate" />
        <DemoCode title="模板 - 时间范围选择" :code="codes.region.timeTemplate" />
        <DemoCode title="模板 - 自定义标签格式" :code="codes.region.tabLabelTemplate" />
        <DemoCode title="脚本 - 区域选择" :code="codes.region.script" />
      </template>
    </DemoSection>

    <!-- 高级功能示例 -->
    <DemoSection title="高级功能" desc="确认前拦截、加载状态等高级功能">
      <view class="space-y-4">
        <!-- 确认前拦截 -->
        <wd-cell-group>
          <wd-datetime-picker
            v-model="advancedValue1"
            label="确认前拦截"
            :before-confirm="beforeConfirmHandler"
            @confirm="handleAdvancedConfirm1"
          />
        </wd-cell-group>

        <!-- 控制按钮 -->
        <view class="flex gap-3">
          <wd-button @click="showLoadingPicker">显示加载状态</wd-button>
          <wd-button type="primary" @click="openPickerProgrammatically">程序化打开</wd-button>
        </view>

        <!-- 加载状态选择器 -->
        <wd-cell-group>
          <wd-datetime-picker
            ref="loadingPickerRef"
            v-model="advancedValue2"
            label="加载状态演示"
            :loading="isLoading"
            @confirm="handleAdvancedConfirm2"
          />
        </wd-cell-group>
      </view>

      <template #codes>
        <DemoCode title="模板 - 确认前拦截" :code="codes.advanced.beforeConfirmTemplate" />
        <DemoCode title="模板 - 加载状态" :code="codes.advanced.loadingTemplate" />
        <DemoCode title="脚本 - 高级功能" :code="codes.advanced.script" />
      </template>
    </DemoSection>

    <!-- 事件监听示例 -->
    <DemoSection title="事件监听" desc="监听选择器的各种事件">
      <!-- 状态显示区域 -->
      <view class="space-y-4">
        <!-- 控制按钮 -->
        <wd-cell-group>
          <wd-datetime-picker
            v-model="eventValue"
            label="事件监听选择器"
            @open="handleOpen"
            @change="handleChange"
            @confirm="handleEventConfirm"
            @cancel="handleCancel"
            @toggle="handleToggle"
          />
        </wd-cell-group>

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
import type { DatetimePickerInstance, DatetimePickerDisplayFormat, DatetimePickerDisplayFormatTabLabel } from '@/wd/components/wd-datetime-picker/wd-datetime-picker.vue'

import type {
  DatetimePickerViewFilter,
  DatetimePickerViewFormatter
} from '@/wd/components/wd-datetime-picker-view/wd-datetime-picker-view.vue'
import { ref } from 'vue'
import { useToast } from '@/wd'

// ===== 组件状态管理 =====

const toast = useToast()

// 基本用法状态
const basicValue1 = ref<number>(Date.now())
const basicValue2 = ref<number>(Date.now())
const basicValue3 = ref<number>(Date.now())
const basicValue4 = ref<number>(Date.now())
const basicValue5 = ref<string>('09:20')

// 带秒显示状态
const secondValue1 = ref<number>(Date.now())
const secondValue2 = ref<string>('09:20:30')

// 自定义格式化状态
const formatValue1 = ref<number>(Date.now())
const formatValue2 = ref<number>(Date.now())

// 过滤选项状态
const filterValue = ref<number>(Date.now())

// 时间范围限制状态
const rangeValue1 = ref<number>(Date.now())
const rangeValue2 = ref<string>('10:00')

// 状态配置
const stateValue1 = ref<number>(Date.now())
const stateValue2 = ref<number>(Date.now())
const stateValue3 = ref<number>(Date.now())
const stateValue4 = ref<number>(Date.now())

// 尺寸和对齐状态
const sizeValue1 = ref<number>(Date.now())
const sizeValue2 = ref<number>(Date.now())
const sizeValue3 = ref<number>(Date.now())

// 无标签和自定义标题状态
const noLabelValue = ref<string>('')
const titleValue = ref<number>(Date.now())

// 区域选择状态
const regionValue1 = ref<(string | number)[]>(['', ''])
const regionValue2 = ref<(string | number)[]>(['', ''])
const regionValue3 = ref<(string | number)[]>(['', Date.now()])

// 高级功能状态
const advancedValue1 = ref<number>(Date.now())
const advancedValue2 = ref<number>(Date.now())
const isLoading = ref<boolean>(false)

// 事件监听状态
const eventValue = ref<number>(Date.now())

// 事件日志状态
interface EventLog {
  time: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

const eventLogs = ref<EventLog[]>([])

// 组件引用
const loadingPickerRef = ref<DatetimePickerInstance>()

// 时间范围配置
const minDate = ref<number>(Date.now())
const maxDate = ref<number>(
  new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()).getTime()
)

// ===== 自定义格式化函数 =====

/**
 * 自定义显示格式函数
 */
const customDisplayFormat: DatetimePickerDisplayFormat = (items) => {
  return `${items[0].label}年${items[1].label}月${items[2].label}日 ${items[3].label}:${items[4].label}`
}

/**
 * 自定义内部格式化函数 - 为时间单位添加中文标识
 */
const customFormatter: DatetimePickerViewFormatter = (type, value) => {
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
 * 过滤器函数 - 分钟只能选择5的倍数
 */
const minuteFilter: DatetimePickerViewFilter = (type, values) => {
  if (type === 'minute') {
    return values.filter((value) => value % 5 === 0)
  }
  return values
}

/**
 * 自定义区域选择标签格式
 */
const customTabLabelFormat: DatetimePickerDisplayFormatTabLabel = (items) => {
  return `${items[0].label}年${items[1].label}月${items[2].label}日 ${items[3].label}:${items[4].label}`
}

/**
 * 确认前拦截函数 - 不能选择大于今天的日期
 */
const beforeConfirmHandler = (
  value: number | string | (number | string)[],
  resolve: (isPass: boolean) => void,
  picker: DatetimePickerInstance
) => {
  picker.setLoading(true)
  setTimeout(() => {
    picker.setLoading(false)
    if ((value as number) > Date.now()) {
      resolve(false)
      toast.error('不能选择大于今天的日期')
    } else {
      resolve(true)
    }
  }, 2000)
}

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    datetimeTemplate: `<wd-datetime-picker v-model="basicValue1" label="日期时间" @confirm="handleBasicConfirm1" />`,

    dateTemplate: `<wd-datetime-picker v-model="basicValue2" label="日期选择" type="date" @confirm="handleBasicConfirm2" />`,

    yearMonthTemplate: `<wd-datetime-picker v-model="basicValue3" label="年月选择" type="year-month" @confirm="handleBasicConfirm3" />`,

    yearTemplate: `<wd-datetime-picker v-model="basicValue4" label="年选择" type="year" @confirm="handleBasicConfirm4" />`,

    timeTemplate: `<wd-datetime-picker v-model="basicValue5" label="时间选择" type="time" @confirm="handleBasicConfirm5" />`,

    script: `import { ref } from 'vue'

// 基本用法状态
const basicValue1 = ref(Date.now())      // 日期时间
const basicValue2 = ref(Date.now())      // 日期
const basicValue3 = ref(Date.now())      // 年月
const basicValue4 = ref(Date.now())      // 年
const basicValue5 = ref('09:20')         // 时间

// 确认事件处理
const handleBasicConfirm1 = ({ value }) => {
  console.log('选择的日期时间:', new Date(value))
}

const handleBasicConfirm2 = ({ value }) => {
  console.log('选择的日期:', value)
}`,
  },

  // 带秒显示代码
  second: {
    datetimeTemplate: `<wd-datetime-picker v-model="secondValue1" label="日期时间带秒" use-second @confirm="handleSecondConfirm1" />`,

    timeTemplate: `<wd-datetime-picker v-model="secondValue2" label="时间带秒" type="time" use-second @confirm="handleSecondConfirm2" />`,

    script: `// 带秒显示状态
const secondValue1 = ref(Date.now())     // 日期时间带秒
const secondValue2 = ref('09:20:30')     // 时间带秒

const handleSecondConfirm1 = ({ value }) => {
  console.log('日期时间带秒:', new Date(value))
}

const handleSecondConfirm2 = ({ value }) => {
  console.log('时间带秒:', value)
}`,
  },

  // 自定义格式化代码
  format: {
    displayTemplate: `<wd-datetime-picker
  v-model="formatValue1"
  label="自定义显示格式"
  :display-format="customDisplayFormat"
  @confirm="handleFormatConfirm1"
/>`,

    formatterTemplate: `<wd-datetime-picker
  v-model="formatValue2"
  label="自定义内部格式"
  :formatter="customFormatter"
  @confirm="handleFormatConfirm2"
/>`,

    script: `// 自定义显示格式函数
const customDisplayFormat = (items) => {
  return \`\${items[0].label}年\${items[1].label}月\${items[2].label}日 \${items[3].label}:\${items[4].label}\`
}

// 自定义内部格式化函数 - 为时间单位添加中文标识
const customFormatter = (type, value) => {
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
}`,
  },

  // 过滤选项代码
  filter: {
    template: `<wd-datetime-picker
  v-model="filterValue"
  label="分钟只能选5的倍数"
  :filter="minuteFilter"
  @confirm="handleFilterConfirm"
/>`,

    script: `// 过滤器函数 - 分钟只能选择5的倍数
const minuteFilter = (type, values) => {
  if (type === 'minute') {
    return values.filter((value) => value % 5 === 0)
  }
  return values
}

const handleFilterConfirm = ({ value }) => {
  console.log('过滤选项结果:', value)
}`,
  },

  // 范围限制代码
  range: {
    dateTemplate: `<wd-datetime-picker
  v-model="rangeValue1"
  label="限制一年内"
  :min-date="minDate"
  :max-date="maxDate"
  @confirm="handleRangeConfirm1"
/>`,

    timeTemplate: `<wd-datetime-picker
  v-model="rangeValue2"
  label="限制工作时间"
  type="time"
  :min-hour="9"
  :max-hour="18"
  :min-minute="0"
  :max-minute="59"
  @confirm="handleRangeConfirm2"
/>`,

    script: `// 时间范围配置
const minDate = ref(Date.now())
const maxDate = ref(
  new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()).getTime()
)

const handleRangeConfirm1 = ({ value }) => {
  console.log('日期范围限制结果:', new Date(value))
}

const handleRangeConfirm2 = ({ value }) => {
  console.log('时间范围限制结果:', value)
}`,
  },

  // 状态配置代码
  state: {
    template: `<!-- 不同状态配置 -->
<wd-datetime-picker v-model="stateValue1" label="必填状态" required />
<wd-datetime-picker v-model="stateValue2" label="错误状态" error />
<wd-datetime-picker v-model="stateValue3" label="禁用状态" disabled />
<wd-datetime-picker v-model="stateValue4" label="只读状态" readonly />`,

    script: `// 状态配置
const stateValue1 = ref(Date.now())  // 必填
const stateValue2 = ref(Date.now())  // 错误
const stateValue3 = ref(Date.now())  // 禁用
const stateValue4 = ref(Date.now())  // 只读`,
  },

  // 尺寸和对齐代码
  size: {
    template: `<!-- 尺寸和对齐配置 -->
<wd-datetime-picker v-model="sizeValue1" label="大尺寸" size="large" />
<wd-datetime-picker v-model="sizeValue2" label="右对齐" align-right />
<wd-datetime-picker v-model="sizeValue3" label="自定义标签宽度" label-width="120px" />`,

    script: `// 尺寸和对齐状态
const sizeValue1 = ref(Date.now())
const sizeValue2 = ref(Date.now())
const sizeValue3 = ref(Date.now())`,
  },

  // 标签和标题代码
  label: {
    noLabelTemplate: `<wd-datetime-picker v-model="noLabelValue" placeholder="请选择日期时间" @confirm="handleNoLabelConfirm" />`,

    titleTemplate: `<wd-datetime-picker
  v-model="titleValue"
  label="自定义标题"
  title="请选择您的生日"
  type="date"
  @confirm="handleTitleConfirm"
/>`,

    script: `// 无标签和自定义标题状态
const noLabelValue = ref('')
const titleValue = ref(Date.now())

const handleNoLabelConfirm = ({ value }) => {
  console.log('无标签选择结果:', value)
}

const handleTitleConfirm = ({ value }) => {
  console.log('自定义标题选择结果:', value)
}`,
  },

  // 区域选择代码
  region: {
    dateTemplate: `<wd-datetime-picker
  v-model="regionValue1"
  label="日期范围选择"
  title="请选择日期范围"
  type="date"
  @confirm="handleRegionConfirm1"
/>`,

    timeTemplate: `<wd-datetime-picker
  v-model="regionValue2"
  label="时间范围选择"
  title="请选择时间范围"
  type="time"
  @confirm="handleRegionConfirm2"
/>`,

    tabLabelTemplate: `<wd-datetime-picker
  v-model="regionValue3"
  label="日期时间范围"
  title="请选择日期时间范围"
  :display-format-tab-label="customTabLabelFormat"
  @confirm="handleRegionConfirm3"
/>`,

    script: `// 区域选择状态 - 使用数组表示范围
const regionValue1 = ref(['', ''])           // 日期范围
const regionValue2 = ref(['', ''])           // 时间范围
const regionValue3 = ref(['', Date.now()])   // 日期时间范围

// 自定义区域选择标签格式
const customTabLabelFormat = (items) => {
  return \`\${items[0].label}年\${items[1].label}月\${items[2].label}日 \${items[3].label}:\${items[4].label}\`
}

const handleRegionConfirm1 = ({ value }) => {
  console.log('日期范围选择结果:', value)
}

const handleRegionConfirm2 = ({ value }) => {
  console.log('时间范围选择结果:', value)
}

const handleRegionConfirm3 = ({ value }) => {
  console.log('日期时间范围选择结果:', value)
}`,
  },

  // 高级功能代码
  advanced: {
    beforeConfirmTemplate: `<wd-datetime-picker
  v-model="advancedValue1"
  label="确认前拦截"
  :before-confirm="beforeConfirmHandler"
  @confirm="handleAdvancedConfirm1"
/>`,

    loadingTemplate: `<wd-datetime-picker
  ref="loadingPickerRef"
  v-model="advancedValue2"
  label="加载状态演示"
  :loading="isLoading"
  @confirm="handleAdvancedConfirm2"
/>`,

    script: `// 确认前拦截函数 - 不能选择大于今天的日期
const beforeConfirmHandler = (value, resolve, picker) => {
  picker.setLoading(true)
  setTimeout(() => {
    picker.setLoading(false)
    if (value > Date.now()) {
      resolve(false)
      toast.error('不能选择大于今天的日期')
    } else {
      resolve(true)
    }
  }, 2000)
}

// 显示加载状态
const showLoadingPicker = () => {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 3000)
}

// 程序化打开选择器
const openPickerProgrammatically = () => {
  loadingPickerRef.value?.open()
}`,
  },

  // 事件监听代码
  events: {
    template: `<wd-datetime-picker
  v-model="eventValue"
  label="事件监听选择器"
  @open="handleOpen"
  @change="handleChange"
  @confirm="handleEventConfirm"
  @cancel="handleCancel"
  @toggle="handleToggle"
/>`,

    methods: `const handleOpen = () => {
  addEventLog('选择器已打开', 'info')
}

const handleChange = ({ value }) => {
  addEventLog(\`值发生变化: \${value}\`, 'success')
}

const handleEventConfirm = ({ value }) => {
  addEventLog(\`确认选择: \${value}\`, 'success')
}

const handleCancel = () => {
  addEventLog('取消选择', 'warning')
}

const handleToggle = (value) => {
  addEventLog(\`切换到: \${value}\`, 'info')
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'model-value',
    type: 'String | Number | Array',
    default: '""',
    desc: '选中项，当 type 为 time 时，类型为字符串；当 type 为 Array 时，类型为范围选择；否则为时间戳',
  },
  {
    name: 'type',
    type: 'String',
    default: '"datetime"',
    desc: '选择器类型：date / year-month / time / datetime / year',
  },
  {
    name: 'label',
    type: 'String',
    default: '""',
    desc: '选择器左侧文案，label可以不传',
  },
  {
    name: 'placeholder',
    type: 'String',
    default: '"请选择"',
    desc: '选择器占位符',
  },
  {
    name: 'title',
    type: 'String',
    default: '""',
    desc: '弹出层标题',
  },
  {
    name: 'cancel-button-text',
    type: 'String',
    default: '"取消"',
    desc: '取消按钮文案',
  },
  {
    name: 'confirm-button-text',
    type: 'String',
    default: '"确认"',
    desc: '确认按钮文案',
  },
  {
    name: 'use-second',
    type: 'Boolean',
    default: 'false',
    desc: '是否启用秒选择，仅在 time 和 datetime 类型下生效',
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
    name: 'formatter',
    type: 'Function',
    default: 'null',
    desc: '自定义弹出层选项文案的格式化函数',
  },
  {
    name: 'filter',
    type: 'Function',
    default: 'null',
    desc: '自定义过滤选项的函数，返回列的选项数组',
  },
  {
    name: 'display-format',
    type: 'Function',
    default: 'null',
    desc: '自定义展示文案的格式化函数',
  },
  {
    name: 'display-format-tab-label',
    type: 'Function',
    default: 'null',
    desc: '在区域选择模式下，自定义展示tab标签文案的格式化函数',
  },
  {
    name: 'before-confirm',
    type: 'Function',
    default: 'null',
    desc: '确定前校验函数，接收 (value, resolve, picker) 参数',
  },
  {
    name: 'default-value',
    type: 'String | Number | Array',
    default: 'null',
    desc: '默认日期，类型保持与 value 一致，打开面板时面板自动选到默认日期',
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: '禁用选择器',
  },
  {
    name: 'readonly',
    type: 'Boolean',
    default: 'false',
    desc: '只读状态',
  },
  {
    name: 'loading',
    type: 'Boolean',
    default: 'false',
    desc: '加载中状态',
  },
  {
    name: 'required',
    type: 'Boolean',
    default: 'false',
    desc: '是否必填',
  },
  {
    name: 'error',
    type: 'Boolean',
    default: 'false',
    desc: '是否为错误状态',
  },
  {
    name: 'size',
    type: 'String',
    default: '""',
    desc: '设置选择器大小，可选值：large',
  },
  {
    name: 'align-right',
    type: 'Boolean',
    default: 'false',
    desc: '选择器的值靠右展示',
  },
  {
    name: 'label-width',
    type: 'String',
    default: '"33%"',
    desc: '设置左侧标题宽度',
  },
  {
    name: 'close-on-click-modal',
    type: 'Boolean',
    default: 'true',
    desc: '点击遮罩是否关闭',
  },
  {
    name: 'safe-area-inset-bottom',
    type: 'Boolean',
    default: 'true',
    desc: '弹出面板是否设置底部安全距离',
  },
  {
    name: 'z-index',
    type: 'Number',
    default: '100',
    desc: '弹窗层级',
  },
]

// Methods 方法文档
const apiMethods = [
  {
    name: 'open()',
    desc: '打开选择器弹框',
  },
  {
    name: 'close()',
    desc: '关闭选择器弹框',
  },
  {
    name: 'setLoading(loading)',
    desc: '设置加载状态，参数为布尔值',
  },
]

// Events 事件文档
const apiEvents = [
  {
    name: 'open',
    desc: '打开选择器时触发',
  },
  {
    name: 'change',
    desc: '值变化时触发，参数为 { value }',
  },
  {
    name: 'confirm',
    desc: '确认选择时触发，参数为 { value }',
  },
  {
    name: 'cancel',
    desc: '取消选择时触发',
  },
  {
    name: 'toggle',
    desc: '切换选择器tab时触发（仅区域选择模式），参数为当前选中值',
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

// === 基本用法事件处理方法 ===

/**
 * 基本日期时间确认事件
 */
const handleBasicConfirm1 = ({ value }: { value: number }) => {
  console.log('日期时间选择:', new Date(value))
}

/**
 * 基本日期确认事件
 */
const handleBasicConfirm2 = ({ value }: { value: number }) => {
  console.log('日期选择:', new Date(value))
}

/**
 * 基本年月确认事件
 */
const handleBasicConfirm3 = ({ value }: { value: number }) => {
  console.log('年月选择:', new Date(value))
}

/**
 * 基本年确认事件
 */
const handleBasicConfirm4 = ({ value }: { value: number }) => {
  console.log('年选择:', new Date(value))
}

/**
 * 基本时间确认事件
 */
const handleBasicConfirm5 = ({ value }: { value: string }) => {
  console.log('时间选择:', value)
}

// === 带秒显示事件处理方法 ===

/**
 * 带秒日期时间确认事件
 */
const handleSecondConfirm1 = ({ value }: { value: number }) => {
  console.log('日期时间带秒选择:', new Date(value))
}

/**
 * 带秒时间确认事件
 */
const handleSecondConfirm2 = ({ value }: { value: string }) => {
  console.log('时间带秒选择:', value)
}

// === 自定义格式化事件处理方法 ===

/**
 * 自定义显示格式确认事件
 */
const handleFormatConfirm1 = ({ value }: { value: number }) => {
  console.log('自定义显示格式选择:', new Date(value))
}

/**
 * 自定义内部格式确认事件
 */
const handleFormatConfirm2 = ({ value }: { value: number }) => {
  console.log('自定义内部格式选择:', new Date(value))
}

// === 过滤选项事件处理方法 ===

/**
 * 过滤选项确认事件
 */
const handleFilterConfirm = ({ value }: { value: number }) => {
  console.log('过滤选项选择:', new Date(value))
}

// === 时间范围限制事件处理方法 ===

/**
 * 日期范围限制确认事件
 */
const handleRangeConfirm1 = ({ value }: { value: number }) => {
  console.log('日期范围限制选择:', new Date(value))
}

/**
 * 时间范围限制确认事件
 */
const handleRangeConfirm2 = ({ value }: { value: string }) => {
  console.log('时间范围限制选择:', value)
}

// === 状态配置事件处理方法 ===

/**
 * 必填状态确认事件
 */
const handleStateConfirm1 = ({ value }: { value: number }) => {
  console.log('必填状态选择:', new Date(value))
}

/**
 * 错误状态确认事件
 */
const handleStateConfirm2 = ({ value }: { value: number }) => {
  console.log('错误状态选择:', new Date(value))
}

/**
 * 禁用状态确认事件
 */
const handleStateConfirm3 = ({ value }: { value: number }) => {
  console.log('禁用状态选择:', new Date(value))
}

/**
 * 只读状态确认事件
 */
const handleStateConfirm4 = ({ value }: { value: number }) => {
  console.log('只读状态选择:', new Date(value))
}

// === 尺寸和对齐事件处理方法 ===

/**
 * 大尺寸确认事件
 */
const handleSizeConfirm1 = ({ value }: { value: number }) => {
  console.log('大尺寸选择:', new Date(value))
}

/**
 * 右对齐确认事件
 */
const handleSizeConfirm2 = ({ value }: { value: number }) => {
  console.log('右对齐选择:', new Date(value))
}

/**
 * 自定义标签宽度确认事件
 */
const handleSizeConfirm3 = ({ value }: { value: number }) => {
  console.log('自定义标签宽度选择:', new Date(value))
}

// === 无标签和自定义标题事件处理方法 ===

/**
 * 无标签确认事件
 */
const handleNoLabelConfirm = ({ value }: { value: string | number }) => {
  console.log('无标签选择:', value)
}

/**
 * 自定义标题确认事件
 */
const handleTitleConfirm = ({ value }: { value: number }) => {
  console.log('自定义标题选择:', new Date(value))
}

// === 区域选择事件处理方法 ===

/**
 * 日期范围选择确认事件
 */
const handleRegionConfirm1 = ({ value }: { value: (string | number)[] }) => {
  console.log('日期范围选择:', value)
}

/**
 * 时间范围选择确认事件
 */
const handleRegionConfirm2 = ({ value }: { value: (string | number)[] }) => {
  console.log('时间范围选择:', value)
}

/**
 * 日期时间范围选择确认事件
 */
const handleRegionConfirm3 = ({ value }: { value: (string | number)[] }) => {
  console.log('日期时间范围选择:', value)
}

// === 高级功能事件处理方法 ===

/**
 * 确认前拦截确认事件
 */
const handleAdvancedConfirm1 = ({ value }: { value: number }) => {
  console.log('确认前拦截选择:', new Date(value))
}

/**
 * 加载状态确认事件
 */
const handleAdvancedConfirm2 = ({ value }: { value: number }) => {
  console.log('加载状态选择:', new Date(value))
}

/**
 * 显示加载状态
 */
const showLoadingPicker = () => {
  isLoading.value = true
  console.log('开始加载状态')
  setTimeout(() => {
    isLoading.value = false
    console.log('加载状态结束')
  }, 3000)
}

/**
 * 程序化打开选择器
 */
const openPickerProgrammatically = () => {
  loadingPickerRef.value?.open()
  console.log('程序化打开选择器')
}

// === 事件监听事件处理方法 ===

/**
 * 选择器打开事件
 */
const handleOpen = () => {
  addEventLog('选择器已打开', 'info')
}

/**
 * 值变化事件
 */
const handleChange = ({ value }: { value: string | number | (string | number)[] }) => {
  addEventLog(`值发生变化: ${JSON.stringify(value)}`, 'success')
}

/**
 * 事件确认事件
 */
const handleEventConfirm = ({ value }: { value: string | number | (string | number)[] }) => {
  addEventLog(`确认选择: ${JSON.stringify(value)}`, 'success')
}

/**
 * 取消事件
 */
const handleCancel = () => {
  addEventLog('取消选择', 'warning')
}

/**
 * 切换事件
 */
const handleToggle = (value: string | number) => {
  addEventLog(`切换到: ${value}`, 'info')
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
