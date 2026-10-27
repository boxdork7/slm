<!-- Voice Recorder 录音组件演示页面 http://127.0.0.1:100/#/pages-sub/demo/wd/voiceRecorder -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Voice Recorder 录音组件" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的录音功能，开箱即用">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <view class="flex justify-center">
          <wd-voice-recorder
            v-model="basicAudioFile"
            @complete="handleBasicComplete"
            @error="handleBasicError"
          />
        </view>
        <view v-if="basicAudioFile" class="text-center text-sm text-green-600">
          录音文件：{{ basicAudioFile }}
        </view>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基本用法" :code="codes.basic.template" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 自定义UI示例 -->
    <DemoSection title="自定义UI" desc="使用默认插槽完全自定义录音界面">
      <view class="space-y-4">
        <view class="flex justify-center">
          <wd-voice-recorder
            v-model="customAudioFile"
            :max-duration="30"
            @complete="handleCustomComplete"
            @error="handleCustomError"
          >
            <template #default="{ recording, duration, start, stop, status, play }">
              <view class="custom-recorder">
                <view class="custom-record-area" @click="recording ? stop() : start()">
                  <wd-img
                    :src="getVoiceImage(recording, status)"
                    width="120"
                    height="120"
                    custom-class="transition-all duration-300"
                    :style="{ transform: recording ? 'scale(1.1)' : 'scale(1)' }"
                  />
                  <wd-text
                    :text="getStatusText(recording, duration, status)"
                    custom-class="mt-2"
                    color="#666"
                    size="14"
                  />
                </view>

                <!-- 录音完成后显示操作按钮 -->
                <view v-if="status === 'completed'" class="mt-4 flex gap-2">
                  <wd-button size="small" type="info" @click.stop="play()">试听</wd-button>
                  <wd-button size="small" type="warning" @click.stop="start()">重录</wd-button>
                </view>
              </view>
            </template>
          </wd-voice-recorder>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 自定义UI" :code="codes.custom.template" />
        <DemoCode title="脚本 - 自定义UI" :code="codes.custom.script" />
      </template>
    </DemoSection>

    <!-- 录音配置示例 -->
    <DemoSection title="录音配置" desc="配置录音参数，如时长、格式、采样率等">
      <view class="space-y-4">
        <!-- 配置选项 -->
        <view class="rounded bg-gray-50 p-4">
          <view class="grid grid-cols-2 gap-4">
            <view>
              <wd-text text="最大时长" size="14" color="#666" custom-class="mb-1" />
              <wd-select-picker
                v-model="configMaxDuration"
                :columns="durationOptions"
                custom-class="text-sm"
              />
            </view>
            <view>
              <wd-text text="音频格式" size="14" color="#666" custom-class="mb-1" />
              <wd-select-picker
                v-model="configFormat"
                :columns="formatOptions"
                custom-class="text-sm"
              />
            </view>
          </view>
        </view>

        <!-- 录音组件 -->
        <view class="flex justify-center">
          <wd-voice-recorder
            v-model="configAudioFile"
            :max-duration="configMaxDuration"
            :format="configFormat"
            :sample-rate="44100"
            @complete="handleConfigComplete"
            @error="handleConfigError"
            @progress="handleConfigProgress"
          />
        </view>

        <!-- 录音信息显示 -->
        <view v-if="configAudioFile || configProgress" class="rounded bg-blue-50 p-3">
          <view class="text-sm text-blue-600 space-y-1">
            <view v-if="configProgress">当前时长: {{ Math.floor(configProgress) }}s</view>
            <view v-if="configAudioFile">文件路径: {{ configAudioFile }}</view>
            <view>最大时长: {{ configMaxDuration }}s</view>
            <view>音频格式: {{ configFormat }}</view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 录音配置" :code="codes.config.template" />
        <DemoCode title="脚本 - 录音配置" :code="codes.config.script" />
      </template>
    </DemoSection>

    <!-- 按钮插槽示例 -->
    <DemoSection title="自定义按钮" desc="使用按钮插槽自定义录音控制按钮">
      <view class="space-y-4">
        <view class="flex justify-center">
          <wd-voice-recorder
            v-model="buttonAudioFile"
            @complete="handleButtonComplete"
            @error="handleButtonError"
          >
            <template #button="{ recording, start, stop, status, play, delete: deleteAudio }">
              <view class="flex gap-2">
                <wd-button
                  :type="recording ? 'error' : 'success'"
                  :loading="recording"
                  @click="recording ? stop() : start()"
                >
                  {{ recording ? '停止录音' : '开始录音' }}
                </wd-button>

                <wd-button v-if="status === 'completed'" type="info" @click="play()">
                  播放
                </wd-button>

                <wd-button v-if="status === 'completed'" type="warning" @click="deleteAudio()">
                  删除
                </wd-button>
              </view>
            </template>
          </wd-voice-recorder>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 自定义按钮" :code="codes.button.template" />
        <DemoCode title="脚本 - 自定义按钮" :code="codes.button.script" />
      </template>
    </DemoSection>

    <!-- 纯逻辑模式示例 -->
    <DemoSection title="纯逻辑模式" desc="隐藏默认UI，完全由外部控制录音逻辑">
      <view class="space-y-4">
        <!-- 自定义控制界面 -->
        <view class="rounded bg-gray-50 p-4">
          <view class="mb-4 flex justify-center gap-2">
            <wd-button
              size="small"
              :type="logicRecording ? 'error' : 'success'"
              :disabled="logicStatus === 'error'"
              @click="handleLogicToggle"
            >
              {{ logicRecording ? '停止' : '开始' }}
            </wd-button>

            <wd-button
              size="small"
              type="warning"
              :disabled="!logicRecording || logicPaused"
              @click="handleLogicPause"
            >
              暂停
            </wd-button>

            <wd-button size="small" type="info" :disabled="!logicPaused" @click="handleLogicResume">
              恢复
            </wd-button>

            <wd-button
              size="small"
              :disabled="logicStatus !== 'completed'"
              @click="handleLogicPlay"
            >
              播放
            </wd-button>

            <wd-button
              size="small"
              type="error"
              :disabled="!logicAudioFile"
              @click="handleLogicDelete"
            >
              删除
            </wd-button>
          </view>

          <!-- 状态显示 -->
          <view class="text-center">
            <view class="mb-2 text-lg font-bold">{{ formatDuration(logicDuration) }}</view>
            <view class="text-sm text-gray-600">{{ getLogicStatusText() }}</view>
          </view>
        </view>

        <!-- 隐藏的录音组件 -->
        <wd-voice-recorder
          ref="logicRecorderRef"
          v-model="logicAudioFile"
          :show-button="false"
          @start="handleLogicStart"
          @stop="handleLogicStop"
          @pause="handleLogicPauseEvent"
          @resume="handleLogicResumeEvent"
          @complete="handleLogicComplete"
          @error="handleLogicError"
          @progress="handleLogicProgress"
        />
      </view>

      <template #codes>
        <DemoCode title="模板 - 纯逻辑模式" :code="codes.logic.template" />
        <DemoCode title="脚本 - 纯逻辑模式" :code="codes.logic.script" />
      </template>
    </DemoSection>

    <!-- 组件状态示例 -->
    <DemoSection title="组件状态" desc="禁用和只读状态演示">
      <view class="space-y-4">
        <!-- 状态控制 -->
        <view class="mb-4 flex justify-center gap-2">
          <wd-button size="small" @click="toggleDisabled">
            {{ stateDisabled ? '启用组件' : '禁用组件' }}
          </wd-button>
          <wd-button size="small" @click="toggleReadonly">
            {{ stateReadonly ? '取消只读' : '设为只读' }}
          </wd-button>
        </view>

        <!-- 状态显示 -->
        <view class="rounded bg-yellow-50 p-3 text-center">
          <view class="text-sm text-yellow-600">
            当前状态:
            <text class="font-bold">
              {{ stateDisabled ? '禁用' : stateReadonly ? '只读' : '正常' }}
            </text>
          </view>
        </view>

        <!-- 录音组件 -->
        <view class="flex justify-center">
          <wd-voice-recorder
            v-model="stateAudioFile"
            :disabled="stateDisabled"
            :readonly="stateReadonly"
            @complete="handleStateComplete"
            @error="handleStateError"
          />
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 组件状态" :code="codes.state.template" />
        <DemoCode title="脚本 - 组件状态" :code="codes.state.script" />
      </template>
    </DemoSection>

    <!-- 交互演示示例 -->
    <DemoSection title="交互演示" desc="记录录音操作并提供实时反馈">
      <view class="space-y-4">
        <!-- 演示录音组件 -->
        <view class="flex justify-center">
          <wd-voice-recorder
            v-model="demoAudioFile"
            @start="handleDemoStart"
            @stop="handleDemoStop"
            @complete="handleDemoComplete"
            @error="handleDemoError"
            @progress="handleDemoProgress"
            @play="handleDemoPlay"
            @delete="handleDemoDelete"
          />
        </view>

        <!-- 统计信息 -->
        <view class="rounded-lg bg-blue-50 p-3">
          <view class="text-sm text-blue-600">
            录音次数：{{ recordCount }} | 最长录音：{{ maxDuration }}s | 当前状态：{{ demoStatus }}
          </view>
        </view>

        <!-- 操作记录 -->
        <view>
          <view class="mb-2 flex items-center justify-between">
            <view class="text-sm text-gray-700 font-medium">操作记录</view>
            <wd-button size="small" @click="clearDemoRecords">清空记录</wd-button>
          </view>
          <view class="h-32 overflow-y-auto border border-gray-200 rounded bg-white p-2">
            <view
              v-for="(record, index) in demoRecords"
              :key="index"
              class="mb-1 text-sm"
              :class="getDemoRecordColor(record.type)"
            >
              [{{ record.time }}] {{ record.message }}
            </view>
            <view v-if="demoRecords.length === 0" class="py-4 text-center text-sm text-gray-400">
              暂无操作记录，开始录音测试
            </view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 交互演示" :code="codes.demo.template" />
        <DemoCode title="脚本 - 交互逻辑" :code="codes.demo.script" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" :slots="apiSlots" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type {
  AudioFormat,
  RecordStatus,
} from '@/wd/components/wd-voice-recorder/wd-voice-recorder.vue'

// ===== 组件状态管理 =====

// 基本用法
const basicAudioFile = ref<string | null>(null)

// 自定义UI
const customAudioFile = ref<string | null>(null)

// 录音配置
const configAudioFile = ref<string | null>(null)
const configProgress = ref<number>(0)
const configMaxDuration = ref<number>(60)
const configFormat = ref<AudioFormat>('mp3')

// 按钮插槽
const buttonAudioFile = ref<string | null>(null)

// 纯逻辑模式
const logicAudioFile = ref<string | null>(null)
const logicRecording = ref<boolean>(false)
const logicPaused = ref<boolean>(false)
const logicDuration = ref<number>(0)
const logicStatus = ref<RecordStatus>('idle')
const logicRecorderRef = ref()

// 组件状态
const stateAudioFile = ref<string | null>(null)
const stateDisabled = ref<boolean>(false)
const stateReadonly = ref<boolean>(false)

// 交互演示
const demoAudioFile = ref<string | null>(null)
const recordCount = ref<number>(0)
const maxDuration = ref<number>(0)
const demoStatus = ref<string>('待录音')

// 操作记录
interface DemoRecord {
  time: string
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
}

const demoRecords = ref<DemoRecord[]>([])

// 配置选项
const durationOptions = ref([
  { label: '15秒', value: 15 },
  { label: '30秒', value: 30 },
  { label: '60秒', value: 60 },
  { label: '120秒', value: 120 },
])

const formatOptions = ref([
  { label: 'MP3', value: 'mp3' },
  { label: 'WAV', value: 'wav' },
  { label: 'AAC', value: 'aac' },
])

// ===== 工具方法 =====

/**
 * 根据录音状态获取图片
 */
const getVoiceImage = (recording: boolean, status: string) => {
  if (recording) {
    return '/static/images/device/recording.gif'
  } else if (status === 'completed') {
    return '/static/images/device/voice_completed.png'
  } else {
    return '/static/images/device/voice.png'
  }
}

/**
 * 根据状态获取提示文字
 */
const getStatusText = (recording: boolean, duration: number, status: string) => {
  if (recording) {
    return `录音中... ${Math.floor(duration)}s`
  } else if (status === 'completed') {
    return '录音完成'
  } else {
    return '点击开始录音'
  }
}

/**
 * 格式化时长显示
 */
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * 获取逻辑模式状态文本
 */
const getLogicStatusText = () => {
  switch (logicStatus.value) {
    case 'recording':
      return '录音中...'
    case 'paused':
      return '录音暂停'
    case 'completed':
      return '录音完成'
    case 'error':
      return '录音出错'
    default:
      return '待录音'
  }
}

/**
 * 添加演示记录
 */
const addDemoRecord = (message: string, type: DemoRecord['type'] = 'info') => {
  demoRecords.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
    type,
  })
  // 限制记录数量
  if (demoRecords.value.length > 20) {
    demoRecords.value = demoRecords.value.slice(0, 20)
  }
}

/**
 * 清空演示记录
 */
const clearDemoRecords = () => {
  demoRecords.value = []
  addDemoRecord('清空了操作记录', 'warning')
}

/**
 * 获取记录颜色类名
 */
const getDemoRecordColor = (type: DemoRecord['type']) => {
  const colors = {
    success: 'text-green-600',
    info: 'text-blue-600',
    warning: 'text-orange-600',
    error: 'text-red-600',
  }
  return colors[type]
}

// ===== 事件处理方法 =====

/**
 * 基本用法事件
 */
const handleBasicComplete = (event: any) => {
  console.log('基本录音完成:', event)
}

const handleBasicError = (event: any) => {
  console.error('基本录音错误:', event)
}

/**
 * 自定义UI事件
 */
const handleCustomComplete = (event: any) => {
  console.log('自定义UI录音完成:', event)
}

const handleCustomError = (event: any) => {
  console.error('自定义UI录音错误:', event)
}

/**
 * 配置录音事件
 */
const handleConfigComplete = (event: any) => {
  console.log('配置录音完成:', event)
  configProgress.value = 0
}

const handleConfigError = (event: any) => {
  console.error('配置录音错误:', event)
}

const handleConfigProgress = (event: any) => {
  configProgress.value = event.duration
}

/**
 * 按钮插槽事件
 */
const handleButtonComplete = (event: any) => {
  console.log('按钮插槽录音完成:', event)
}

const handleButtonError = (event: any) => {
  console.error('按钮插槽录音错误:', event)
}

/**
 * 纯逻辑模式事件
 */
const handleLogicToggle = () => {
  if (logicRecording.value) {
    logicRecorderRef.value?.stopRecord()
  } else {
    logicRecorderRef.value?.startRecord()
  }
}

const handleLogicPause = () => {
  logicRecorderRef.value?.pauseRecord()
}

const handleLogicResume = () => {
  logicRecorderRef.value?.resumeRecord()
}

const handleLogicPlay = () => {
  logicRecorderRef.value?.playAudio()
}

const handleLogicDelete = () => {
  logicRecorderRef.value?.deleteRecord()
}

const handleLogicStart = (event: any) => {
  logicRecording.value = true
  logicStatus.value = 'recording'
  console.log('逻辑模式开始录音:', event)
}

const handleLogicStop = (event: any) => {
  logicRecording.value = false
  logicPaused.value = false
  console.log('逻辑模式停止录音:', event)
}

const handleLogicPauseEvent = (event: any) => {
  logicPaused.value = true
  logicStatus.value = 'paused'
  console.log('逻辑模式暂停录音:', event)
}

const handleLogicResumeEvent = (event: any) => {
  logicPaused.value = false
  logicStatus.value = 'recording'
  console.log('逻辑模式恢复录音:', event)
}

const handleLogicComplete = (event: any) => {
  logicRecording.value = false
  logicPaused.value = false
  logicStatus.value = 'completed'
  console.log('逻辑模式录音完成:', event)
}

const handleLogicError = (event: any) => {
  logicRecording.value = false
  logicPaused.value = false
  logicStatus.value = 'error'
  console.error('逻辑模式录音错误:', event)
}

const handleLogicProgress = (event: any) => {
  logicDuration.value = event.duration
}

/**
 * 组件状态切换
 */
const toggleDisabled = () => {
  stateDisabled.value = !stateDisabled.value
}

const toggleReadonly = () => {
  stateReadonly.value = !stateReadonly.value
}

const handleStateComplete = (event: any) => {
  console.log('状态测试录音完成:', event)
}

const handleStateError = (event: any) => {
  console.error('状态测试录音错误:', event)
}

/**
 * 交互演示事件
 */
const handleDemoStart = (event: any) => {
  demoStatus.value = '录音中'
  addDemoRecord('开始录音', 'info')
}

const handleDemoStop = (event: any) => {
  demoStatus.value = '录音完成'
  addDemoRecord(`停止录音，时长: ${event.duration.toFixed(1)}s`, 'success')
}

const handleDemoComplete = (event: any) => {
  recordCount.value++
  if (event.duration > maxDuration.value) {
    maxDuration.value = Math.floor(event.duration)
  }
  demoStatus.value = '录音完成'
  addDemoRecord(`录音完成，文件大小: ${Math.round(event.fileSize / 1024)}KB`, 'success')
}

const handleDemoError = (event: any) => {
  demoStatus.value = '录音失败'
  addDemoRecord(`录音失败: ${event.errMsg}`, 'error')
}

const handleDemoProgress = (event: any) => {
  if (Math.floor(event.duration) % 5 === 0 && event.duration > 0) {
    addDemoRecord(`录音进度: ${Math.floor(event.duration)}s`, 'info')
  }
}

const handleDemoPlay = () => {
  addDemoRecord('开始播放录音', 'info')
}

const handleDemoDelete = () => {
  demoStatus.value = '已删除'
  addDemoRecord('删除录音文件', 'warning')
}

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    template: `<!-- 基本录音功能 -->
<wd-voice-recorder
  v-model="basicAudioFile"
  @complete="handleBasicComplete"
  @error="handleBasicError"
/>`,

    script: `import { ref } from 'vue'

const basicAudioFile = ref<string | null>(null)

const handleBasicComplete = (event: any) => {
  console.log('录音完成:', event)
  // event: { duration: 15.5, fileSize: 245760, filePath: 'temp://recording.mp3' }
}

const handleBasicError = (event: any) => {
  console.error('录音错误:', event)
  // event: { errMsg: '录音失败', errCode: 12001 }
}`,
  },

  // 自定义UI代码
  custom: {
    template: `<!-- 自定义录音界面 -->
<wd-voice-recorder
  v-model="customAudioFile"
  :max-duration="30"
  @complete="handleCustomComplete"
>
  <template #default="{ recording, duration, start, stop, status, play }">
    <view class="custom-recorder">
      <view class="custom-record-area" @click="recording ? stop() : start()">
        <wd-img
          :src="getVoiceImage(recording, status)"
          width="120"
          height="120"
          :style="{ transform: recording ? 'scale(1.1)' : 'scale(1)' }"
        />
        <wd-text :text="getStatusText(recording, duration, status)" />
      </view>

      <view v-if="status === 'completed'" class="controls">
        <wd-button size="small" @click.stop="play()">试听</wd-button>
        <wd-button size="small" @click.stop="start()">重录</wd-button>
      </view>
    </view>
  </template>
</wd-voice-recorder>`,

    script: `const customAudioFile = ref<string | null>(null)

const getVoiceImage = (recording: boolean, status: string) => {
  if (recording) return '/static/images/recording.gif'
  if (status === 'completed') return '/static/images/completed.png'
  return '/static/images/voice.png'
}

const getStatusText = (recording: boolean, duration: number, status: string) => {
  if (recording) return \`录音中... \${Math.floor(duration)}s\`
  if (status === 'completed') return '录音完成'
  return '点击开始录音'
}`,
  },

  // 录音配置代码
  config: {
    template: `<!-- 配置录音参数 -->
<wd-voice-recorder
  v-model="configAudioFile"
  :max-duration="configMaxDuration"
  :format="configFormat"
  :sample-rate="44100"
  @complete="handleConfigComplete"
  @progress="handleConfigProgress"
/>`,

    script: `const configAudioFile = ref<string | null>(null)
const configMaxDuration = ref<number>(60)
const configFormat = ref<string>('mp3')
const configProgress = ref<number>(0)

const handleConfigComplete = (event: any) => {
  console.log('录音完成:', event)
  configProgress.value = 0
}

const handleConfigProgress = (event: any) => {
  configProgress.value = event.duration
}`,
  },

  // 自定义按钮代码
  button: {
    template: `<!-- 自定义控制按钮 -->
<wd-voice-recorder v-model="buttonAudioFile">
  <template #button="{ recording, start, stop, status, play, delete: deleteAudio }">
    <view class="flex gap-2">
      <wd-button
        :type="recording ? 'error' : 'success'"
        @click="recording ? stop() : start()"
      >
        {{ recording ? '停止录音' : '开始录音' }}
      </wd-button>

      <wd-button v-if="status === 'completed'" @click="play()">
        播放
      </wd-button>

      <wd-button v-if="status === 'completed'" @click="deleteAudio()">
        删除
      </wd-button>
    </view>
  </template>
</wd-voice-recorder>`,

    script: `const buttonAudioFile = ref<string | null>(null)`,
  },

  // 纯逻辑模式代码
  logic: {
    template: `<!-- 纯逻辑模式 -->
<view class="custom-controls">
  <wd-button @click="handleLogicToggle">
    {{ logicRecording ? '停止' : '开始' }}
  </wd-button>
  <wd-button @click="handleLogicPause">暂停</wd-button>
  <wd-button @click="handleLogicResume">恢复</wd-button>
  <wd-button @click="handleLogicPlay">播放</wd-button>
</view>

<!-- 隐藏的录音组件 -->
<wd-voice-recorder
  v-model="logicAudioFile"
  :show-button="false"
  ref="logicRecorderRef"
  @start="handleLogicStart"
  @complete="handleLogicComplete"
/>`,

    script: `const logicAudioFile = ref<string | null>(null)
const logicRecording = ref<boolean>(false)
const logicRecorderRef = ref()

const handleLogicToggle = () => {
  if (logicRecording.value) {
    logicRecorderRef.value?.stopRecord()
  } else {
    logicRecorderRef.value?.startRecord()
  }
}

const handleLogicStart = () => {
  logicRecording.value = true
}

const handleLogicComplete = () => {
  logicRecording.value = false
}`,
  },

  // 组件状态代码
  state: {
    template: `<!-- 组件状态控制 -->
<wd-button @click="toggleDisabled">
  {{ stateDisabled ? '启用组件' : '禁用组件' }}
</wd-button>
<wd-button @click="toggleReadonly">
  {{ stateReadonly ? '取消只读' : '设为只读' }}
</wd-button>

<wd-voice-recorder
  v-model="stateAudioFile"
  :disabled="stateDisabled"
  :readonly="stateReadonly"
/>`,

    script: `const stateAudioFile = ref<string | null>(null)
const stateDisabled = ref<boolean>(false)
const stateReadonly = ref<boolean>(false)

const toggleDisabled = () => {
  stateDisabled.value = !stateDisabled.value
}

const toggleReadonly = () => {
  stateReadonly.value = !stateReadonly.value
}`,
  },

  // 交互演示代码
  demo: {
    template: `<!-- 交互演示 -->
<wd-voice-recorder
  v-model="demoAudioFile"
  @start="handleDemoStart"
  @complete="handleDemoComplete"
  @error="handleDemoError"
  @progress="handleDemoProgress"
/>

<!-- 统计信息 -->
<view class="stats">
  录音次数：{{ recordCount }} | 最长录音：{{ maxDuration }}s
</view>`,

    script: `const demoAudioFile = ref<string | null>(null)
const recordCount = ref<number>(0)
const maxDuration = ref<number>(0)

const handleDemoStart = () => {
  console.log('开始录音')
}

const handleDemoComplete = (event: any) => {
  recordCount.value++
  if (event.duration > maxDuration.value) {
    maxDuration.value = Math.floor(event.duration)
  }
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'modelValue',
    type: 'String | null',
    default: 'null',
    desc: '音频文件路径，支持 v-model 双向绑定',
  },
  {
    name: 'maxDuration',
    type: 'Number',
    default: '60',
    desc: '最大录音时长（秒）',
  },
  {
    name: 'minDuration',
    type: 'Number',
    default: '1',
    desc: '最小录音时长（秒）',
  },
  {
    name: 'format',
    type: 'String',
    default: '"mp3"',
    desc: '音频格式，可选值：mp3 / wav / aac',
  },
  {
    name: 'sampleRate',
    type: 'Number',
    default: '16000',
    desc: '采样率',
  },
  {
    name: 'numberOfChannels',
    type: 'Number',
    default: '1',
    desc: '声道数',
  },
  {
    name: 'encodeBitRate',
    type: 'Number',
    default: '96000',
    desc: '编码码率',
  },
  {
    name: 'showButton',
    type: 'Boolean',
    default: 'true',
    desc: '是否显示默认录音按钮',
  },
  {
    name: 'autoStop',
    type: 'Boolean',
    default: 'true',
    desc: '是否在达到最大时长时自动停止',
  },
  {
    name: 'qualityCheck',
    type: 'Boolean',
    default: 'true',
    desc: '是否进行录音质量检测',
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: '是否禁用组件',
  },
  {
    name: 'readonly',
    type: 'Boolean',
    default: 'false',
    desc: '是否为只读模式',
  },
  {
    name: 'customStyle',
    type: 'String',
    default: '""',
    desc: '自定义根节点样式',
  },
  {
    name: 'customClass',
    type: 'String',
    default: '""',
    desc: '自定义根节点样式类',
  },
]

// Events 事件文档
const apiEvents = [
  {
    name: 'update:modelValue',
    desc: '音频文件路径更新时触发，参数：音频文件路径',
  },
  {
    name: 'start',
    desc: '开始录音时触发，参数：{ duration }',
  },
  {
    name: 'stop',
    desc: '停止录音时触发，参数：{ duration, fileSize, filePath }',
  },
  {
    name: 'pause',
    desc: '暂停录音时触发，参数：{ duration }',
  },
  {
    name: 'resume',
    desc: '恢复录音时触发，参数：{ duration }',
  },
  {
    name: 'complete',
    desc: '录音完成时触发，参数：{ duration, fileSize, filePath }',
  },
  {
    name: 'error',
    desc: '录音错误时触发，参数：{ errMsg, errCode }',
  },
  {
    name: 'progress',
    desc: '录音进度更新时触发，参数：{ duration }',
  },
  {
    name: 'play',
    desc: '播放音频时触发',
  },
  {
    name: 'delete',
    desc: '删除录音时触发',
  },
  {
    name: 'click',
    desc: '点击组件时触发，参数：event 对象',
  },
]

// Methods 方法文档
const apiMethods = [
  {
    name: 'startRecord',
    desc: '开始录音',
    params: '-',
    return: '-',
  },
  {
    name: 'stopRecord',
    desc: '停止录音',
    params: '-',
    return: '-',
  },
  {
    name: 'pauseRecord',
    desc: '暂停录音',
    params: '-',
    return: '-',
  },
  {
    name: 'resumeRecord',
    desc: '恢复录音',
    params: '-',
    return: '-',
  },
  {
    name: 'playAudio',
    desc: '播放音频',
    params: '-',
    return: '-',
  },
  {
    name: 'deleteRecord',
    desc: '删除录音',
    params: '-',
    return: '-',
  },
  {
    name: 'toggleRecord',
    desc: '切换录音状态',
    params: '-',
    return: '-',
  },
  {
    name: 'isRecording',
    desc: '获取当前是否正在录音',
    params: '-',
    return: 'Boolean',
  },
  {
    name: 'duration',
    desc: '获取当前录音时长',
    params: '-',
    return: 'Number',
  },
  {
    name: 'status',
    desc: '获取当前录音状态',
    params: '-',
    return: 'RecordStatus',
  },
]

// Slots 插槽文档
const apiSlots = [
  {
    name: 'default',
    desc: '默认插槽，用于完全自定义录音界面',
    params:
      '{ recording, paused, duration, audioFile, status, start, stop, pause, resume, play, delete, toggle }',
  },
  {
    name: 'button',
    desc: '按钮插槽，用于自定义录音控制按钮',
    params: '{ recording, paused, duration, status, start, stop, pause, resume, play, delete }',
  },
]
</script>

<style lang="scss" scoped>
.custom-recorder {
  display: flex;
  flex-direction: column;
  align-items: center;

  .custom-record-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;

    &:active {
      transform: scale(0.98);
    }
  }

  .controls {
    display: flex;
    gap: 8px;
    margin-top: 16px;
  }
}
</style>
