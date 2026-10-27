<!-- CountDown 倒计时 http://127.0.0.1:100/#/pages-sub/demo/wd/count-down -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="CountDown 倒计时" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的倒计时，默认格式为 HH:mm:ss">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="当前倒计时" :value="formatTimeDisplay(basicTime)" />
        <wd-cell title="状态" :value="basicStatus" />
      </wd-cell-group>

      <view class="mt-4 space-y-4">
        <!-- 预设时长选择 -->
        <view>
          <view class="mb-2 text-sm text-gray-700 font-medium">预设时长</view>
          <view class="flex flex-wrap gap-2">
            <wd-button
              v-for="preset in timePresets"
              :key="preset.value"
              size="small"
              :type="basicTime === preset.value ? 'primary' : 'default'"
              @click="setBasicTime(preset.value)"
            >
              {{ preset.label }}
            </wd-button>
          </view>
        </view>

        <!-- 基础倒计时展示 -->
        <view class="rounded-lg bg-gray-50 py-6 text-center">
          <wd-count-down
            :time="basicTime"
            @change="handleBasicChange"
            @finish="handleBasicFinish"
          />
        </view>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基本用法" :code="codes.basic.template" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 格式化显示示例 -->
    <DemoSection title="格式化显示" desc="支持多种时间格式，满足不同显示需求">
      <!-- 示例效果展示 -->
      <view class="space-y-3">
        <view
          v-for="formatItem in formatExamples"
          :key="formatItem.format"
          class="flex items-center justify-between rounded-lg bg-gray-50 p-3"
        >
          <view class="flex-1">
            <view class="mb-1 text-sm text-gray-700 font-medium">{{ formatItem.name }}</view>
            <view class="text-xs text-gray-500">{{ formatItem.format }}</view>
          </view>
          <view class="text-lg text-blue-600 font-mono">
            <wd-count-down
              :time="formatTime"
              :format="formatItem.format"
              :millisecond="formatItem.millisecond"
            />
          </view>
        </view>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 格式化显示" :code="codes.format.template" />
        <DemoCode title="脚本 - 格式化配置" :code="codes.format.script" />
      </template>
    </DemoSection>

    <!-- 毫秒级精度示例 -->
    <DemoSection title="毫秒级精度" desc="启用毫秒精度，适用于短时间精确计时">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <!-- 毫秒精度倒计时 -->
        <view class="rounded-lg from-green-50 to-blue-50 bg-gradient-to-r py-6 text-center">
          <wd-count-down
            :time="millisecondTime"
            millisecond
            format="mm:ss:SSS"
            @change="handleMillisecondChange"
            @finish="handleMillisecondFinish"
          />
          <view class="mt-2 text-xs text-gray-500">分钟:秒钟:毫秒</view>
        </view>

        <!-- 时间设置 -->
        <view>
          <view class="mb-2 text-sm text-gray-700 font-medium">毫秒倒计时设置</view>
          <view class="flex flex-wrap gap-2">
            <wd-button
              v-for="preset in millisecondPresets"
              :key="preset.value"
              size="small"
              :type="millisecondTime === preset.value ? 'primary' : 'default'"
              @click="setMillisecondTime(preset.value)"
            >
              {{ preset.label }}
            </wd-button>
          </view>
        </view>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 毫秒精度" :code="codes.millisecond.template" />
        <DemoCode title="脚本 - 毫秒精度" :code="codes.millisecond.script" />
      </template>
    </DemoSection>

    <!-- 手动控制示例 -->
    <DemoSection title="手动控制" desc="可以手动控制倒计时的开始、暂停和重置">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <!-- 控制状态显示 -->
        <wd-cell-group>
          <wd-cell title="当前状态" :value="getStatusText(manualStatus)" />
          <wd-cell title="剩余时间" :value="formatTimeDisplay(manualTime)" />
        </wd-cell-group>

        <!-- 倒计时展示 -->
        <view class="rounded-lg from-purple-50 to-pink-50 bg-gradient-to-r py-6 text-center">
          <wd-count-down
            ref="manualCountDownRef"
            :time="manualTime"
            millisecond
            :auto-start="false"
            format="mm:ss:SSS"
            @change="handleManualChange"
            @finish="handleManualFinish"
          />
          <view class="mt-2 text-xs text-gray-500">手动控制模式</view>
        </view>

        <!-- 控制按钮 -->
        <view class="flex justify-center pl-4 space-x-3">
          <wd-button type="success" :disabled="manualStatus === 'running'" @click="startManual">
            开始
          </wd-button>
          <wd-button type="warning" :disabled="manualStatus !== 'running'" @click="pauseManual">
            暂停
          </wd-button>
          <wd-button type="default" @click="resetManual">重置</wd-button>
        </view>

        <!-- 状态指示 -->
        <view class="text-center">
          <text class="text-sm text-gray-600">状态：</text>
          <text :class="getStatusClass(manualStatus)">{{ getStatusText(manualStatus) }}</text>
        </view>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 手动控制" :code="codes.manual.template" />
        <DemoCode title="脚本 - 手动控制" :code="codes.manual.script" />
      </template>
    </DemoSection>

    <!-- 自定义样式示例 -->
    <DemoSection title="自定义样式" desc="通过插槽自定义倒计时的显示样式">
      <!-- 示例效果展示 -->
      <view class="space-y-6">
        <!-- 数字块样式 -->
        <view>
          <view class="mb-3 text-sm text-gray-700 font-medium">数字块样式</view>
          <view class="rounded-lg bg-gray-50 py-4 text-center">
            <wd-count-down :time="customTime1">
              <template #default="{ current }">
                <text
                  class="mr-1 inline-block h-12 w-12 rounded-lg bg-red-500 text-center text-lg text-white font-bold leading-12"
                >
                  {{ String(current.hours).padStart(2, '0') }}
                </text>
                <text class="mx-2 text-xl text-red-500">:</text>
                <text
                  class="mr-1 inline-block h-12 w-12 rounded-lg bg-red-500 text-center text-lg text-white font-bold leading-12"
                >
                  {{ String(current.minutes).padStart(2, '0') }}
                </text>
                <text class="mx-2 text-xl text-red-500">:</text>
                <text
                  class="inline-block h-12 w-12 rounded-lg bg-red-500 text-center text-lg text-white font-bold leading-12"
                >
                  {{ String(current.seconds).padStart(2, '0') }}
                </text>
              </template>
            </wd-count-down>
          </view>
        </view>

        <!-- 翻牌样式 -->
        <view>
          <view class="mb-3 text-sm text-gray-700 font-medium">翻牌样式</view>
          <view class="rounded-lg bg-gray-50 py-4 text-center">
            <wd-count-down :time="customTime2">
              <template #default="{ current }">
                <view class="inline-flex items-center">
                  <view class="mx-1 inline-flex flex-col items-center">
                    <text
                      class="inline-block h-12 w-12 rounded-lg bg-gray-800 text-center text-xl text-white font-bold leading-12"
                    >
                      {{ String(current.days).padStart(2, '0') }}
                    </text>
                    <text class="mt-1 text-xs text-gray-500">天</text>
                  </view>
                  <text class="mx-2 text-2xl text-gray-400">:</text>
                  <view class="mx-1 inline-flex flex-col items-center">
                    <text
                      class="inline-block h-12 w-12 rounded-lg bg-gray-800 text-center text-xl text-white font-bold leading-12"
                    >
                      {{ String(current.hours).padStart(2, '0') }}
                    </text>
                    <text class="mt-1 text-xs text-gray-500">时</text>
                  </view>
                  <text class="mx-2 text-2xl text-gray-400">:</text>
                  <view class="mx-1 inline-flex flex-col items-center">
                    <text
                      class="inline-block h-12 w-12 rounded-lg bg-gray-800 text-center text-xl text-white font-bold leading-12"
                    >
                      {{ String(current.minutes).padStart(2, '0') }}
                    </text>
                    <text class="mt-1 text-xs text-gray-500">分</text>
                  </view>
                  <text class="mx-2 text-2xl text-gray-400">:</text>
                  <view class="mx-1 inline-flex flex-col items-center">
                    <text
                      class="inline-block h-12 w-12 rounded-lg bg-gray-800 text-center text-xl text-white font-bold leading-12"
                    >
                      {{ String(current.seconds).padStart(2, '0') }}
                    </text>
                    <text class="mt-1 text-xs text-gray-500">秒</text>
                  </view>
                </view>
              </template>
            </wd-count-down>
          </view>
        </view>

        <!-- 进度条样式 -->
        <view>
          <view class="mb-3 text-sm text-gray-700 font-medium">进度条样式</view>
          <view class="rounded-lg bg-gray-50 p-4">
            <wd-count-down :time="customTime3" @change="handleProgressChange">
              <template #default="{ current }">
                <view class="w-full">
                  <view class="mb-2 flex items-center justify-between">
                    <text class="text-sm text-gray-600">剩余时间</text>
                    <text class="text-lg font-mono">{{ formatProgressTime(current) }}</text>
                  </view>
                  <view class="h-3 w-full rounded-full bg-gray-200">
                    <view
                      class="h-3 rounded-full from-blue-500 to-purple-500 bg-gradient-to-r transition-all duration-300"
                      :style="`width: ${progressPercent}%`"
                    />
                  </view>
                  <view class="mt-1 text-right text-xs text-gray-500">
                    {{ progressPercent.toFixed(1) }}%
                  </view>
                </view>
              </template>
            </wd-count-down>
          </view>
        </view>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 数字块样式" :code="codes.custom.blockTemplate" />
        <DemoCode title="模板 - 翻牌样式" :code="codes.custom.flipTemplate" />
        <DemoCode title="模板 - 进度条样式" :code="codes.custom.progressTemplate" />
        <DemoCode title="脚本 - 自定义样式" :code="codes.custom.script" />
      </template>
    </DemoSection>

    <!-- 应用场景示例 -->
    <DemoSection title="应用场景" desc="常见的倒计时应用场景演示">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <!-- 验证码倒计时 -->
        <view class="border border-gray-200 rounded-lg p-4">
          <view class="flex items-center justify-between">
            <view>
              <view class="text-sm text-gray-700 font-medium">验证码倒计时</view>
              <view class="text-xs text-gray-500">60秒后可重新获取</view>
            </view>
            <view class="flex items-center space-x-2">
              <wd-count-down
                v-if="smsCountdown > 0"
                :time="smsCountdown"
                format="ss秒"
                @finish="handleSmsFinish"
              />
              <wd-button size="small" :disabled="smsCountdown > 0" @click="sendSms">
                {{ smsCountdown > 0 ? '发送中...' : '获取验证码' }}
              </wd-button>
            </view>
          </view>
        </view>

        <!-- 限时抢购 -->
        <view class="border border-gray-200 rounded-lg p-4">
          <view class="flex items-center justify-between">
            <view>
              <view class="text-sm text-gray-700 font-medium">限时抢购</view>
              <view class="text-xs text-gray-500">活动即将开始</view>
            </view>
            <view class="text-center">
              <wd-count-down :time="saleCountdown" format="HH:mm:ss" @finish="handleSaleFinish" />
              <view class="mt-1 text-xs text-gray-500">距离开始</view>
            </view>
          </view>
        </view>

        <!-- 考试倒计时 -->
        <view class="border border-gray-200 rounded-lg p-4">
          <view class="flex items-center justify-between">
            <view>
              <view class="text-sm text-gray-700 font-medium">考试时间</view>
              <view class="text-xs text-gray-500">请抓紧时间答题</view>
            </view>
            <view class="text-center">
              <wd-count-down
                :time="examCountdown"
                format="HH:mm:ss"
                @change="handleExamChange"
                @finish="handleExamFinish"
              />
              <view class="mt-1 text-xs" :class="examTimeClass">剩余时间</view>
            </view>
          </view>
        </view>

        <!-- 活动倒计时 -->
        <view class="border border-gray-200 rounded-lg p-4">
          <view class="flex items-center justify-between">
            <view>
              <view class="text-sm text-gray-700 font-medium">活动倒计时</view>
              <view class="text-xs text-gray-500">双11大促销</view>
            </view>
            <view class="text-center">
              <wd-count-down :time="activityCountdown" format="DD天HH时mm分ss秒" />
              <view class="mt-1 text-xs text-gray-500">距离结束</view>
            </view>
          </view>
        </view>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 验证码倒计时" :code="codes.scenarios.smsTemplate" />
        <DemoCode title="模板 - 限时抢购" :code="codes.scenarios.saleTemplate" />
        <DemoCode title="模板 - 考试倒计时" :code="codes.scenarios.examTemplate" />
        <DemoCode title="脚本 - 应用场景" :code="codes.scenarios.script" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CountDownInstance } from '@/wd/components/wd-count-down/wd-count-down.vue'

// ===== 组件状态管理 =====

// 组件引用
const manualCountDownRef = ref<CountDownInstance>()

// 基本倒计时数据
const basicTime = ref<number>(5 * 60 * 1000) // 5分钟
const basicStatus = ref<string>('运行中')

// 格式化展示数据
const formatTime = ref<number>(2 * 60 * 60 * 1000) // 2小时

// 毫秒精度数据
const millisecondTime = ref<number>(30 * 1000) // 30秒

// 手动控制数据
const manualTime = ref<number>(10 * 1000) // 10秒
const manualStatus = ref<'stopped' | 'running' | 'paused'>('stopped')

// 自定义样式数据
const customTime1 = ref<number>(3 * 60 * 60 * 1000) // 3小时
const customTime2 = ref<number>(7 * 24 * 60 * 60 * 1000) // 7天
const customTime3 = ref<number>(24 * 60 * 60 * 1000) // 24小时
const progressPercent = ref<number>(100)

// 应用场景数据
const smsCountdown = ref<number>(0)
const saleCountdown = ref<number>(2 * 60 * 60 * 1000) // 2小时后开始
const examCountdown = ref<number>(90 * 60 * 1000) // 90分钟考试
const activityCountdown = ref<number>(15 * 24 * 60 * 60 * 1000) // 15天活动

// ===== 配置数据 =====

// 基础时间预设
const timePresets = [
  { label: '30秒', value: 30 * 1000 },
  { label: '1分钟', value: 60 * 1000 },
  { label: '5分钟', value: 5 * 60 * 1000 },
  { label: '30分钟', value: 30 * 60 * 1000 },
  { label: '1小时', value: 60 * 60 * 1000 },
  { label: '2小时', value: 2 * 60 * 60 * 1000 },
]

// 毫秒时间预设
const millisecondPresets = [
  { label: '5秒', value: 5 * 1000 },
  { label: '10秒', value: 10 * 1000 },
  { label: '30秒', value: 30 * 1000 },
  { label: '1分钟', value: 60 * 1000 },
  { label: '2分钟', value: 2 * 60 * 1000 },
]

// 格式化示例配置
const formatExamples = [
  { name: '标准时间', format: 'HH:mm:ss', millisecond: false },
  { name: '完整格式', format: 'DD 天 HH 时 mm 分 ss 秒', millisecond: false },
  { name: '简化天时', format: 'DD天HH时mm分', millisecond: false },
  { name: '毫秒精度', format: 'mm:ss:SSS', millisecond: true },
  { name: '分秒格式', format: 'mm分ss秒', millisecond: false },
  { name: '总秒数', format: 'ss', millisecond: false },
]

// ===== 计算属性 =====

/**
 * 考试时间样式类
 */
const examTimeClass = computed(() => {
  const minutes = Math.floor(examCountdown.value / (60 * 1000))
  if (minutes <= 5) return 'text-red-500'
  if (minutes <= 15) return 'text-orange-500'
  return 'text-green-500'
})

// ===== 工具方法 =====

/**
 * 格式化时间显示
 */
const formatTimeDisplay = (ms: number): string => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}天${hours % 24}小时`
  if (hours > 0) return `${hours}小时${minutes % 60}分钟`
  if (minutes > 0) return `${minutes}分钟${seconds % 60}秒`
  return `${seconds}秒`
}

/**
 * 格式化进度时间
 */
const formatProgressTime = (current: any): string => {
  return `${String(current.hours).padStart(2, '0')}:${String(current.minutes).padStart(2, '0')}:${String(current.seconds).padStart(2, '0')}`
}

/**
 * 获取状态样式类
 */
const getStatusClass = (status: string): string => {
  const classes = {
    stopped: 'text-gray-500',
    running: 'text-green-500',
    paused: 'text-orange-500',
  }
  return classes[status as keyof typeof classes] || 'text-gray-500'
}

/**
 * 获取状态文本
 */
const getStatusText = (status: string): string => {
  const texts = {
    stopped: '已停止',
    running: '运行中',
    paused: '已暂停',
  }
  return texts[status as keyof typeof texts] || '未知状态'
}

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    template: `<!-- 基础倒计时 -->
<wd-count-down
  :time="basicTime"
  @change="handleBasicChange"
  @finish="handleBasicFinish"
/>

<!-- 预设时长选择 -->
<wd-button
  v-for="preset in timePresets"
  :key="preset.value"
  size="small"
  :type="basicTime === preset.value ? 'primary' : 'default'"
  @click="setBasicTime(preset.value)"
>
  {{ preset.label }}
</wd-button>`,

    script: `import { ref } from 'vue'

const basicTime = ref(5 * 60 * 1000) // 5分钟
const basicStatus = ref('运行中')

const timePresets = [
  { label: '30秒', value: 30 * 1000 },
  { label: '1分钟', value: 60 * 1000 },
  { label: '5分钟', value: 5 * 60 * 1000 },
  { label: '30分钟', value: 30 * 60 * 1000 },
]

const setBasicTime = (time: number) => {
  basicTime.value = time
  console.log('设置倒计时时间：', time)
}

const handleBasicChange = (current) => {
  console.log('倒计时变化：', current)
}

const handleBasicFinish = () => {
  basicStatus.value = '已结束'
  console.log('基本倒计时结束')
}`,
  },

  // 格式化显示代码
  format: {
    template: `<!-- 不同格式展示 -->
<wd-count-down
  :time="formatTime"
  format="HH:mm:ss"
/>

<wd-count-down
  :time="formatTime"
  format="DD 天 HH 时 mm 分 ss 秒"
/>

<wd-count-down
  :time="formatTime"
  format="mm:ss:SSS"
  millisecond
/>`,

    script: `const formatTime = ref(2 * 60 * 60 * 1000) // 2小时

const formatExamples = [
  { name: '标准时间', format: 'HH:mm:ss', millisecond: false },
  { name: '完整格式', format: 'DD 天 HH 时 mm 分 ss 秒', millisecond: false },
  { name: '毫秒精度', format: 'mm:ss:SSS', millisecond: true },
  { name: '分秒格式', format: 'mm分ss秒', millisecond: false },
]`,
  },

  // 毫秒精度代码
  millisecond: {
    template: `<!-- 毫秒精度倒计时 -->
<wd-count-down
  :time="millisecondTime"
  millisecond
  format="mm:ss:SSS"
  @change="handleMillisecondChange"
  @finish="handleMillisecondFinish"
/>`,

    script: `const millisecondTime = ref(30 * 1000) // 30秒

const setMillisecondTime = (time: number) => {
  millisecondTime.value = time
}

const handleMillisecondChange = (current) => {
  console.log('毫秒倒计时变化：', current)
}

const handleMillisecondFinish = () => {
  console.log('毫秒精度倒计时结束')
}`,
  },

  // 手动控制代码
  manual: {
    template: `<!-- 手动控制倒计时 -->
<wd-count-down
  ref="manualCountDownRef"
  :time="manualTime"
  millisecond
  :auto-start="false"
  format="mm:ss:SSS"
  @change="handleManualChange"
  @finish="handleManualFinish"
/>

<!-- 控制按钮 -->
<wd-button
  type="success"
  :disabled="manualStatus === 'running'"
  @click="startManual"
>
  开始
</wd-button>
<wd-button
  type="warning"
  :disabled="manualStatus !== 'running'"
  @click="pauseManual"
>
  暂停
</wd-button>
<wd-button
  type="default"
  @click="resetManual"
>
  重置
</wd-button>`,

    script: `import type { CountDownInstance } from '@/wd/components/wd-count-down/wd-count-down.vue'

const manualCountDownRef = ref<CountDownInstance>()
const manualTime = ref(10 * 1000) // 10秒
const manualStatus = ref<'stopped' | 'running' | 'paused'>('stopped')

const startManual = () => {
  manualCountDownRef.value?.start()
  manualStatus.value = 'running'
  console.log('手动开始倒计时')
}

const pauseManual = () => {
  manualCountDownRef.value?.pause()
  manualStatus.value = 'paused'
  console.log('手动暂停倒计时')
}

const resetManual = () => {
  manualCountDownRef.value?.reset()
  manualStatus.value = 'stopped'
  console.log('手动重置倒计时')
}`,
  },

  // 自定义样式代码
  custom: {
    blockTemplate: `<!-- 数字块样式 -->
<wd-count-down :time="customTime1">
  <template #default="{ current }">
    <text class="mr-1 inline-block h-12 w-12 rounded-lg bg-red-500 text-center text-lg text-white font-bold leading-12">
      {{ String(current.hours).padStart(2, '0') }}
    </text>
    <text class="mx-2 text-xl text-red-500">:</text>
    <text class="mr-1 inline-block h-12 w-12 rounded-lg bg-red-500 text-center text-lg text-white font-bold leading-12">
      {{ String(current.minutes).padStart(2, '0') }}
    </text>
    <text class="mx-2 text-xl text-red-500">:</text>
    <text class="inline-block h-12 w-12 rounded-lg bg-red-500 text-center text-lg text-white font-bold leading-12">
      {{ String(current.seconds).padStart(2, '0') }}
    </text>
  </template>
</wd-count-down>`,

    flipTemplate: `<!-- 翻牌样式 -->
<wd-count-down :time="customTime2">
  <template #default="{ current }">
    <view class="inline-flex items-center">
      <view class="mx-1 inline-flex flex-col items-center">
        <text class="inline-block h-12 w-12 rounded-lg bg-gray-800 text-center text-xl text-white font-bold leading-12">
          {{ String(current.days).padStart(2, '0') }}
        </text>
        <text class="mt-1 text-xs text-gray-500">天</text>
      </view>
      <text class="mx-2 text-2xl text-gray-400">:</text>
      <view class="mx-1 inline-flex flex-col items-center">
        <text class="inline-block h-12 w-12 rounded-lg bg-gray-800 text-center text-xl text-white font-bold leading-12">
          {{ String(current.hours).padStart(2, '0') }}
        </text>
        <text class="mt-1 text-xs text-gray-500">时</text>
      </view>
    </view>
  </template>
</wd-count-down>`,

    progressTemplate: `<!-- 进度条样式 -->
<wd-count-down :time="customTime3" @change="handleProgressChange">
  <template #default="{ current }">
    <view class="w-full">
      <view class="mb-2 flex items-center justify-between">
        <text class="text-sm text-gray-600">剩余时间</text>
        <text class="text-lg font-mono">{{ formatProgressTime(current) }}</text>
      </view>
      <view class="h-3 w-full rounded-full bg-gray-200">
        <view
          class="h-3 rounded-full from-blue-500 to-purple-500 bg-gradient-to-r transition-all duration-300"
          :style="\`width: \${progressPercent}%\`"
        />
      </view>
      <view class="mt-1 text-right text-xs text-gray-500">{{ progressPercent.toFixed(1) }}%</view>
    </view>
  </template>
</wd-count-down>`,

    script: `const customTime1 = ref(3 * 60 * 60 * 1000) // 3小时
const customTime2 = ref(7 * 24 * 60 * 60 * 1000) // 7天
const customTime3 = ref(24 * 60 * 60 * 1000) // 24小时
const progressPercent = ref(100)

const formatProgressTime = (current) => {
  return \`\${String(current.hours).padStart(2, '0')}:\${String(current.minutes).padStart(2, '0')}:\${String(current.seconds).padStart(2, '0')}\`
}

const handleProgressChange = (current) => {
  // 计算进度百分比
  const totalMs = 24 * 60 * 60 * 1000
  const currentMs = current.days * 24 * 60 * 60 * 1000 +
                   current.hours * 60 * 60 * 1000 +
                   current.minutes * 60 * 1000 +
                   current.seconds * 1000
  progressPercent.value = (currentMs / totalMs) * 100
}`,
  },

  // 应用场景代码
  scenarios: {
    smsTemplate: `<!-- 验证码倒计时 -->
<wd-count-down
  v-if="smsCountdown > 0"
  :time="smsCountdown"
  format="ss秒"
  @finish="handleSmsFinish"
/>
<wd-button
  size="small"
  :disabled="smsCountdown > 0"
  @click="sendSms"
>
  {{ smsCountdown > 0 ? '发送中...' : '获取验证码' }}
</wd-button>`,

    saleTemplate: `<!-- 限时抢购 -->
<wd-count-down
  :time="saleCountdown"
  format="HH:mm:ss"
  @finish="handleSaleFinish"
/>`,

    examTemplate: `<!-- 考试倒计时 -->
<wd-count-down
  :time="examCountdown"
  format="HH:mm:ss"
  @change="handleExamChange"
  @finish="handleExamFinish"
/>
<view class="mt-1 text-xs" :class="examTimeClass">剩余时间</view>`,

    script: `const smsCountdown = ref(0)
const saleCountdown = ref(2 * 60 * 60 * 1000) // 2小时后开始
const examCountdown = ref(90 * 60 * 1000) // 90分钟考试
const activityCountdown = ref(15 * 24 * 60 * 60 * 1000) // 15天活动

// 考试时间样式
const examTimeClass = computed(() => {
  const minutes = Math.floor(examCountdown.value / (60 * 1000))
  if (minutes <= 5) return 'text-red-500'
  if (minutes <= 15) return 'text-orange-500'
  return 'text-green-500'
})

const sendSms = () => {
  smsCountdown.value = 60 * 1000 // 60秒倒计时
  console.log('发送验证码，60秒后可重新获取')
}

const handleSmsFinish = () => {
  smsCountdown.value = 0
  console.log('验证码倒计时结束，可重新获取')
}

const handleSaleFinish = () => {
  console.log('抢购活动开始！')
}

const handleExamChange = (current) => {
  const totalMinutes = Math.floor(examCountdown.value / (60 * 1000))
  if (totalMinutes === 30) {
    console.log('考试剩余30分钟，请注意时间')
  } else if (totalMinutes === 10) {
    console.log('考试剩余10分钟，请尽快完成')
  }
}

const handleExamFinish = () => {
  console.log('考试时间结束，系统自动提交')
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'time',
    type: 'Number',
    default: '0',
    desc: '倒计时时长，单位毫秒',
  },
  {
    name: 'format',
    type: 'String',
    default: '"HH:mm:ss"',
    desc: '时间格式，DD-日，HH-时，mm-分，ss-秒，SSS-毫秒',
  },
  {
    name: 'millisecond',
    type: 'Boolean',
    default: 'false',
    desc: '是否开启毫秒级渲染',
  },
  {
    name: 'auto-start',
    type: 'Boolean',
    default: 'true',
    desc: '是否自动开始倒计时',
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
    name: 'start()',
    desc: '开始倒计时',
  },
  {
    name: 'pause()',
    desc: '暂停倒计时',
  },
  {
    name: 'reset()',
    desc: '重设倒计时，若 auto-start 为 true，重设后会自动开始倒计时',
  },
]

// Events 事件文档
const apiEvents = [
  {
    name: 'change',
    desc: '倒计时变化时触发，参数：current (当前时间对象，包含 days、hours、minutes、seconds、milliseconds)',
  },
  {
    name: 'finish',
    desc: '倒计时结束时触发',
  },
]

// ===== 事件处理方法 =====

/**
 * 设置基础倒计时时间
 */
const setBasicTime = (time: number) => {
  basicTime.value = time
  basicStatus.value = '运行中'
  console.log(`设置倒计时时间：${formatTimeDisplay(time)}`)
}

/**
 * 设置毫秒倒计时时间
 */
const setMillisecondTime = (time: number) => {
  millisecondTime.value = time
  console.log(`设置毫秒倒计时时间：${time}ms`)
}

/**
 * 基础倒计时变化处理
 */
const handleBasicChange = (current: any) => {
  // 基础倒计时变化（避免日志过多，不记录每次变化）
}

/**
 * 基础倒计时结束处理
 */
const handleBasicFinish = () => {
  basicStatus.value = '已结束'
  console.log('基本倒计时结束')
}

/**
 * 毫秒倒计时变化处理
 */
const handleMillisecondChange = (current: any) => {
  // 毫秒倒计时变化（不记录日志）
}

/**
 * 毫秒倒计时结束处理
 */
const handleMillisecondFinish = () => {
  console.log('毫秒精度倒计时结束')
}

/**
 * 手动控制开始
 */
const startManual = () => {
  manualCountDownRef.value?.start()
  manualStatus.value = 'running'
  console.log('手动开始倒计时')
}

/**
 * 手动控制暂停
 */
const pauseManual = () => {
  manualCountDownRef.value?.pause()
  manualStatus.value = 'paused'
  console.log('手动暂停倒计时')
}

/**
 * 手动控制重置
 */
const resetManual = () => {
  manualCountDownRef.value?.reset()
  manualStatus.value = 'stopped'
  console.log('手动重置倒计时')
}

/**
 * 手动倒计时变化处理
 */
const handleManualChange = (current: any) => {
  // 手动控制倒计时变化（不记录日志）
}

/**
 * 手动倒计时结束处理
 */
const handleManualFinish = () => {
  manualStatus.value = 'stopped'
  console.log('手动控制倒计时结束')
}

/**
 * 进度条变化处理
 */
const handleProgressChange = (current: any) => {
  // 计算进度百分比
  const totalMs = 24 * 60 * 60 * 1000 // 24小时总毫秒数
  const currentMs =
    current.days * 24 * 60 * 60 * 1000 +
    current.hours * 60 * 60 * 1000 +
    current.minutes * 60 * 1000 +
    current.seconds * 1000
  progressPercent.value = (currentMs / totalMs) * 100
}

/**
 * 发送验证码
 */
const sendSms = () => {
  smsCountdown.value = 60 * 1000 // 60秒倒计时
  console.log('发送验证码，60秒后可重新获取')
}

/**
 * 验证码倒计时结束处理
 */
const handleSmsFinish = () => {
  smsCountdown.value = 0
  console.log('验证码倒计时结束，可重新获取')
}

/**
 * 抢购倒计时结束处理
 */
const handleSaleFinish = () => {
  console.log('抢购活动开始！')
}

/**
 * 考试倒计时变化处理
 */
const handleExamChange = (current: any) => {
  const totalMinutes = Math.floor(examCountdown.value / (60 * 1000))
  if (totalMinutes === 30) {
    console.log('考试剩余30分钟，请注意时间')
  } else if (totalMinutes === 10) {
    console.log('考试剩余10分钟，请尽快完成')
  }
}

/**
 * 考试倒计时结束处理
 */
const handleExamFinish = () => {
  console.log('考试时间结束，系统自动提交')
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
