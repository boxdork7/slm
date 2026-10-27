<!-- Slider 滑块 http://127.0.0.1:100/#/pages-sub/demo/wd/slider -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Slider 滑块" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的滑块形式，支持单向拖拽">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="默认滑块" vertical>
          <view class="mb-2 text-sm text-gray-600">当前值: {{ basicValue }}</view>
          <wd-slider v-model="basicValue" />
        </wd-cell>

        <wd-cell title="指定初始值" vertical>
          <view class="mb-2 text-sm text-gray-600">当前值: {{ initValue }}</view>
          <wd-slider v-model="initValue" />
        </wd-cell>

        <wd-cell title="隐藏最值标签" vertical>
          <view class="mb-2 text-sm text-gray-600">当前值: {{ hiddenValue }}</view>
          <wd-slider v-model="hiddenValue" hide-min-max />
        </wd-cell>
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 默认滑块" :code="codes.basic.defaultTemplate" />
        <DemoCode title="模板 - 指定初始值" :code="codes.basic.initTemplate" />
        <DemoCode title="模板 - 隐藏最值标签" :code="codes.basic.hiddenTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 范围配置示例 -->
    <DemoSection title="范围配置" desc="自定义滑块的最小值、最大值和步长">
      <wd-cell-group>
        <wd-cell title="负数到正数范围" vertical>
          <view class="mb-2 text-sm text-gray-600">范围 -10 到 10，当前值: {{ rangeValue1 }}</view>
          <wd-slider v-model="rangeValue1" :min="-10" :max="10" />
        </wd-cell>

        <wd-cell title="大数值范围" vertical>
          <view class="mb-2 text-sm text-gray-600">范围 160 到 280，当前值: {{ rangeValue2 }}</view>
          <wd-slider v-model="rangeValue2" :min="160" :max="280" />
        </wd-cell>

        <wd-cell title="指定步长" vertical>
          <view class="mb-2 text-sm text-gray-600">步长 10，当前值: {{ stepValue }}</view>
          <wd-slider v-model="stepValue" :step="10" />
        </wd-cell>

        <wd-cell title="小数步长" vertical>
          <view class="mb-2 text-sm text-gray-600">步长 0.5，当前值: {{ decimalValue }}</view>
          <wd-slider v-model="decimalValue" :step="0.5" :max="10" />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 负数到正数范围" :code="codes.range.negativeTemplate" />
        <DemoCode title="模板 - 大数值范围" :code="codes.range.largeTemplate" />
        <DemoCode title="模板 - 指定步长" :code="codes.range.stepTemplate" />
        <DemoCode title="脚本 - 范围配置" :code="codes.range.script" />
      </template>
    </DemoSection>

    <!-- 双向滑块示例 -->
    <DemoSection title="双向滑块" desc="使用数组值创建范围选择滑块">
      <wd-cell-group>
        <wd-cell title="基本双向滑块" vertical>
          <view class="mb-2 text-sm text-gray-600">
            当前范围: [{{ rangeSliderValue[0] }}, {{ rangeSliderValue[1] }}]
          </view>
          <wd-slider v-model="rangeSliderValue" />
        </wd-cell>

        <wd-cell title="价格区间选择" vertical>
          <view class="mb-2 text-sm text-gray-600">
            价格区间: ¥{{ priceRange[0] }} - ¥{{ priceRange[1] }}
          </view>
          <wd-slider v-model="priceRange" :min="0" :max="1000" :step="50" />
        </wd-cell>

        <wd-cell title="时间段选择" vertical>
          <view class="mb-2 text-sm text-gray-600">
            时间段: {{ timeRange[0] }}:00 - {{ timeRange[1] }}:00
          </view>
          <wd-slider v-model="timeRange" :min="0" :max="23" :step="1" />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 基本双向滑块" :code="codes.bidirectional.basicTemplate" />
        <DemoCode title="模板 - 价格区间选择" :code="codes.bidirectional.priceTemplate" />
        <DemoCode title="模板 - 时间段选择" :code="codes.bidirectional.timeTemplate" />
        <DemoCode title="脚本 - 双向滑块" :code="codes.bidirectional.script" />
      </template>
    </DemoSection>

    <!-- 自定义样式示例 -->
    <DemoSection title="自定义样式" desc="自定义滑块的颜色和尺寸">
      <wd-cell-group>
        <wd-cell title="自定义激活颜色" vertical>
          <view class="mb-2 text-sm text-gray-600">红色主题，当前值: {{ customValue1 }}</view>
          <wd-slider v-model="customValue1" active-color="#ff6b6b" inactive-color="#f1f3f4" />
        </wd-cell>

        <wd-cell title="自定义颜色组合" vertical>
          <view class="mb-2 text-sm text-gray-600">绿色主题，当前值: {{ customValue2 }}</view>
          <wd-slider v-model="customValue2" active-color="#00c896" inactive-color="#e8f5f3" />
        </wd-cell>

        <wd-cell title="渐变色效果" vertical>
          <view class="mb-2 text-sm text-gray-600">渐变主题，当前值: {{ customValue3 }}</view>
          <wd-slider
            v-model="customValue3"
            active-color="linear-gradient(45deg, #667eea 0%, #764ba2 100%)"
            inactive-color="#f8f9fa"
          />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 自定义激活颜色" :code="codes.style.colorTemplate" />
        <DemoCode title="模板 - 自定义颜色组合" :code="codes.style.greenTemplate" />
        <DemoCode title="模板 - 渐变色效果" :code="codes.style.gradientTemplate" />
        <DemoCode title="脚本 - 自定义样式" :code="codes.style.script" />
      </template>
    </DemoSection>

    <!-- 状态控制示例 -->
    <DemoSection title="状态控制" desc="滑块的禁用状态和标签控制">
      <wd-cell-group>
        <wd-cell title="禁用状态" vertical>
          <view class="mb-2 text-sm text-gray-400">禁用状态，当前值: {{ disabledValue }}</view>
          <wd-slider v-model="disabledValue" disabled />
        </wd-cell>

        <wd-cell title="隐藏当前值标签" vertical>
          <view class="mb-2 text-sm text-gray-600">当前值: {{ hideLabelValue }}</view>
          <wd-slider v-model="hideLabelValue" hide-label />
        </wd-cell>

        <wd-cell title="隐藏最值和标签" vertical>
          <view class="mb-2 text-sm text-gray-600">当前值: {{ hideAllValue }}</view>
          <wd-slider v-model="hideAllValue" hide-min-max hide-label />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 禁用状态" :code="codes.state.disabledTemplate" />
        <DemoCode title="模板 - 隐藏当前值标签" :code="codes.state.hideLabelTemplate" />
        <DemoCode title="模板 - 隐藏最值和标签" :code="codes.state.hideAllTemplate" />
        <DemoCode title="脚本 - 状态控制" :code="codes.state.script" />
      </template>
    </DemoSection>

    <!-- 事件监听示例 -->
    <DemoSection title="事件监听" desc="监听滑块的拖拽开始、移动和结束事件">
      <!-- 事件监听示例区域 -->
      <view class="space-y-4">
        <!-- 滑块控制 -->
        <wd-cell-group>
          <wd-cell title="事件监听滑块" vertical>
            <view class="mb-2 text-sm text-gray-600">
              当前值: {{ eventValue }}，拖拽状态: {{ isDragging ? '拖拽中' : '未拖拽' }}
            </view>
            <wd-slider
              v-model="eventValue"
              @dragstart="handleDragStart"
              @dragmove="handleDragMove"
              @dragend="handleDragEnd"
            />
          </wd-cell>
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
        <DemoCode title="模板 - 事件监听" :code="codes.events.template" />
        <DemoCode title="脚本 - 事件处理" :code="codes.events.script" />
      </template>
    </DemoSection>

    <!-- 实际应用场景示例 -->
    <DemoSection title="实际应用场景" desc="常见的业务场景应用">
      <view class="space-y-4">
        <!-- 音量控制场景 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">音量控制</view>
          <wd-cell-group>
            <wd-cell title="系统音量" vertical>
              <view class="mb-2 flex items-center">
                <wd-icon name="sound" size="20px" class="mr-2" />
                <view class="text-sm text-gray-600">音量: {{ volumeValue }}%</view>
              </view>
              <wd-slider v-model="volumeValue" :min="0" :max="100" active-color="#4CAF50" />
            </wd-cell>
          </wd-cell-group>
        </view>

        <!-- 播放进度场景 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">播放进度</view>
          <wd-cell-group>
            <wd-cell title="音乐播放器" vertical>
              <view class="mb-2 flex items-center justify-between">
                <view class="flex items-center">
                  <wd-icon name="time" size="20px" class="mr-2" />
                  <view class="text-sm text-gray-600">播放进度</view>
                </view>
                <view class="text-sm text-gray-600">
                  {{ formatTime(progressValue) }} / {{ formatTime(300) }}
                </view>
              </view>
              <wd-slider
                v-model="progressValue"
                :min="0"
                :max="300"
                active-color="#2196F3"
                hide-min-max
              />
            </wd-cell>
          </wd-cell-group>
        </view>

        <!-- 筛选场景 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">商品筛选</view>
          <wd-cell-group>
            <wd-cell title="年龄范围" vertical>
              <view class="mb-2 text-sm text-gray-600">
                年龄: {{ ageRange[0] }}岁 - {{ ageRange[1] }}岁
              </view>
              <wd-slider v-model="ageRange" :min="18" :max="60" :step="1" active-color="#FF9800" />
            </wd-cell>
          </wd-cell-group>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 音量控制" :code="codes.scenarios.volumeTemplate" />
        <DemoCode title="脚本 - 音量控制" :code="codes.scenarios.volumeScript" />
        <DemoCode title="模板 - 播放进度" :code="codes.scenarios.progressTemplate" />
        <DemoCode title="脚本 - 播放进度" :code="codes.scenarios.progressScript" />
        <DemoCode title="模板 - 商品筛选" :code="codes.scenarios.filterTemplate" />
        <DemoCode title="脚本 - 商品筛选" :code="codes.scenarios.filterScript" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// ===== 组件状态管理 =====

// 基本用法状态
const basicValue = ref<number>(30)
const initValue = ref<number>(60)
const hiddenValue = ref<number>(25)

// 范围配置状态
const rangeValue1 = ref<number>(0) // -10 到 10 的范围
const rangeValue2 = ref<number>(190) // 160 到 280 的范围
const stepValue = ref<number>(20)
const decimalValue = ref<number>(5.5)

// 双向滑块状态
const rangeSliderValue = ref<number[]>([20, 60])
const priceRange = ref<number[]>([200, 800])
const timeRange = ref<number[]>([9, 18])

// 自定义样式状态
const customValue1 = ref<number>(40)
const customValue2 = ref<number>(65)
const customValue3 = ref<number>(50)

// 状态控制
const disabledValue = ref<number>(70)
const hideLabelValue = ref<number>(35)
const hideAllValue = ref<number>(45)

// 事件监听相关
const eventValue = ref<number>(50)
const isDragging = ref<boolean>(false)

// 实际应用场景状态
const volumeValue = ref<number>(75) // 音量控制
const progressValue = ref<number>(120) // 播放进度
const ageRange = ref<number[]>([25, 45]) // 年龄范围

// 事件日志状态
interface EventLog {
  time: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

const eventLogs = ref<EventLog[]>([])

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    defaultTemplate: `<wd-slider v-model="basicValue" />`,

    initTemplate: `<wd-slider v-model="initValue" />`,

    hiddenTemplate: `<wd-slider v-model="hiddenValue" hide-min-max />`,

    script: `import { ref } from 'vue'

const basicValue = ref(30)
const initValue = ref(60)
const hiddenValue = ref(25)`,
  },

  // 范围配置代码
  range: {
    negativeTemplate: `<wd-slider
  v-model="rangeValue1"
  :min="-10"
  :max="10"
/>`,

    largeTemplate: `<wd-slider
  v-model="rangeValue2"
  :min="160"
  :max="280"
/>`,

    stepTemplate: `<wd-slider
  v-model="stepValue"
  :step="10"
/>`,

    script: `// 范围配置示例数据
const rangeValue1 = ref(0) // -10 到 10 的范围
const rangeValue2 = ref(190) // 160 到 280 的范围
const stepValue = ref(20)
const decimalValue = ref(5.5)`,
  },

  // 双向滑块代码
  bidirectional: {
    basicTemplate: `<wd-slider v-model="rangeSliderValue" />`,

    priceTemplate: `<wd-slider
  v-model="priceRange"
  :min="0"
  :max="1000"
  :step="50"
/>`,

    timeTemplate: `<wd-slider
  v-model="timeRange"
  :min="0"
  :max="23"
  :step="1"
/>`,

    script: `// 双向滑块数据 - 使用数组表示范围
const rangeSliderValue = ref([20, 60])
const priceRange = ref([200, 800])
const timeRange = ref([9, 18])`,
  },

  // 自定义样式代码
  style: {
    colorTemplate: `<wd-slider
  v-model="customValue1"
  active-color="#ff6b6b"
  inactive-color="#f1f3f4"
/>`,

    greenTemplate: `<wd-slider
  v-model="customValue2"
  active-color="#00c896"
  inactive-color="#e8f5f3"
/>`,

    gradientTemplate: `<wd-slider
  v-model="customValue3"
  active-color="linear-gradient(45deg, #667eea 0%, #764ba2 100%)"
  inactive-color="#f8f9fa"
/>`,

    script: `// 自定义样式示例数据
const customValue1 = ref(40)
const customValue2 = ref(65)
const customValue3 = ref(50)`,
  },

  // 状态控制代码
  state: {
    disabledTemplate: `<wd-slider v-model="disabledValue" disabled />`,

    hideLabelTemplate: `<wd-slider v-model="hideLabelValue" hide-label />`,

    hideAllTemplate: `<wd-slider
  v-model="hideAllValue"
  hide-min-max
  hide-label
/>`,

    script: `// 状态控制示例数据
const disabledValue = ref(70)
const hideLabelValue = ref(35)
const hideAllValue = ref(45)`,
  },

  // 事件监听代码
  events: {
    template: `<wd-slider
  v-model="eventValue"
  @dragstart="handleDragStart"
  @dragmove="handleDragMove"
  @dragend="handleDragEnd"
/>`,

    script: `import { ref } from 'vue'

const eventValue = ref(50)
const isDragging = ref(false)
const eventLogs = ref([])

// 拖拽开始事件
const handleDragStart = (event) => {
  isDragging.value = true
  addEventLog(\`开始拖拽，当前值: \${event.value}\`, 'info')
}

// 拖拽移动事件
const handleDragMove = (event) => {
  addEventLog(\`拖拽中，当前值: \${event.value}\`, 'warning')
}

// 拖拽结束事件
const handleDragEnd = (event) => {
  isDragging.value = false
  addEventLog(\`拖拽结束，最终值: \${event.value}\`, 'success')
}

// 添加事件日志
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
}`,
  },

  // 应用场景代码
  scenarios: {
    volumeTemplate: `<!-- 音量控制 -->
<view class="mb-2 flex items-center">
  <wd-icon name="sound" size="20px" class="mr-2" />
  <view class="text-sm text-gray-600">
    音量: {{ volumeValue }}%
  </view>
</view>
<wd-slider
  v-model="volumeValue"
  :min="0"
  :max="100"
  active-color="#4CAF50"
/>`,

    volumeScript: `// 音量控制
const volumeValue = ref(75)`,

    progressTemplate: `<!-- 播放进度 -->
<view class="mb-2 flex items-center justify-between">
  <view class="flex items-center">
    <wd-icon name="time" size="20px" class="mr-2" />
    <view class="text-sm text-gray-600">播放进度</view>
  </view>
  <view class="text-sm text-gray-600">
    {{ formatTime(progressValue) }} / {{ formatTime(300) }}
  </view>
</view>
<wd-slider
  v-model="progressValue"
  :min="0"
  :max="300"
  active-color="#2196F3"
  hide-min-max
/>`,

    progressScript: `// 播放进度
const progressValue = ref(120)

// 格式化时间显示
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return \`\${mins.toString().padStart(2, '0')}:\${secs.toString().padStart(2, '0')}\`
}`,

    filterTemplate: `<!-- 商品筛选 -->
<view class="mb-2 text-sm text-gray-600">
  年龄: {{ ageRange[0] }}岁 - {{ ageRange[1] }}岁
</view>
<wd-slider
  v-model="ageRange"
  :min="18"
  :max="60"
  :step="1"
  active-color="#FF9800"
/>`,

    filterScript: `// 商品筛选
const ageRange = ref([25, 45])`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'model-value',
    type: 'Number | Number[]',
    default: '0',
    desc: '滑块的值，如果为数组，则为双向滑块',
  },
  {
    name: 'min',
    type: 'Number',
    default: '0',
    desc: '滑块的最小值',
  },
  {
    name: 'max',
    type: 'Number',
    default: '100',
    desc: '滑块的最大值',
  },
  {
    name: 'step',
    type: 'Number',
    default: '1',
    desc: '滑块的步进值',
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: '是否禁用滑块',
  },
  {
    name: 'hide-min-max',
    type: 'Boolean',
    default: 'false',
    desc: '是否隐藏左右的最大最小值',
  },
  {
    name: 'hide-label',
    type: 'Boolean',
    default: 'false',
    desc: '是否隐藏当前滑块值',
  },
  {
    name: 'active-color',
    type: 'String',
    default: '""',
    desc: '进度条激活的背景颜色',
  },
  {
    name: 'inactive-color',
    type: 'String',
    default: '"#e5e5e5"',
    desc: '进度条未激活的背景颜色',
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
  {
    name: 'custom-min-class',
    type: 'String',
    default: '""',
    desc: '自定义最小值的样式类名',
  },
  {
    name: 'custom-max-class',
    type: 'String',
    default: '""',
    desc: '自定义最大值的样式类名',
  },
]

// Methods 方法文档
const apiMethods = [
  {
    name: 'initSlider()',
    desc: '初始化slider宽度，在滑块容器大小发生变化时调用',
  },
]

// Events 事件文档
const apiEvents = [
  {
    name: 'dragstart',
    desc: '开始拖动滑块时触发，参数为 { value }',
  },
  {
    name: 'dragmove',
    desc: '拖动滑块过程中触发，参数为 { value }',
  },
  {
    name: 'dragend',
    desc: '结束拖动滑块时触发，参数为 { value }',
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

/**
 * 格式化时间显示
 */
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * 拖拽开始事件处理
 */
const handleDragStart = (event: { value: number | number[] }) => {
  isDragging.value = true
  const valueStr = Array.isArray(event.value)
    ? `[${event.value.join(', ')}]`
    : event.value.toString()
  addEventLog(`开始拖拽，当前值: ${valueStr}`, 'info')
  console.log('拖拽开始：', event.value)
}

/**
 * 拖拽移动事件处理
 */
const handleDragMove = (event: { value: number | number[] }) => {
  const valueStr = Array.isArray(event.value)
    ? `[${event.value.join(', ')}]`
    : event.value.toString()
  addEventLog(`拖拽中，当前值: ${valueStr}`, 'warning')
}

/**
 * 拖拽结束事件处理
 */
const handleDragEnd = (event: { value: number | number[] }) => {
  isDragging.value = false
  const valueStr = Array.isArray(event.value)
    ? `[${event.value.join(', ')}]`
    : event.value.toString()
  addEventLog(`拖拽结束，最终值: ${valueStr}`, 'success')
  console.log('拖拽结束：', event.value)
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
