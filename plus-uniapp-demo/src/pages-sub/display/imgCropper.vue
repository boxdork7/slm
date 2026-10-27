<!-- ImgCropper 图片裁剪器 http://127.0.0.1:100/#/pages-sub/demo/wd/img-cropper -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="ImgCropper 图片裁剪器" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="基础的图片裁剪功能，支持缩放、拖拽和旋转">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="头像裁剪" vertical>
          <view class="flex flex-col items-center p-4 space-y-4">
            <view v-if="!basicCroppedImg" class="img-upload" @click="handleBasicUpload">
              <wd-icon name="fill-camera" custom-class="img-icon" />
            </view>
            <wd-img
              v-if="basicCroppedImg"
              round
              width="200px"
              height="200px"
              :src="basicCroppedImg"
              mode="aspectFit"
              custom-class="profile-img"
              @click="handleBasicUpload"
            />
            <view class="text-sm text-gray-500">点击上传头像（1:1比例）</view>
          </view>
        </wd-cell>
      </wd-cell-group>

      <!-- 图片裁剪器 -->
      <wd-img-cropper
        v-model="showBasic"
        :img-src="basicImgSrc"
        @confirm="handleBasicConfirm"
        @cancel="handleBasicCancel"
        @imgloaderror="handleImgLoadError"
        @imgloaded="handleImgLoaded"
      />

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基本用法" :code="codes.basic.template" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 自定义裁剪比例示例 -->
    <DemoSection title="自定义裁剪比例" desc="支持多种宽高比的图片裁剪">
      <wd-cell-group>
        <wd-cell
          v-for="(ratio, index) in ratioConfigs"
          :key="index"
          :title="`${ratio.label}裁剪`"
          vertical
        >
          <view class="flex flex-col items-center p-4 space-y-3">
            <view
              v-if="!customCroppedImgs[index]"
              class="img-custom"
              :style="getCustomBoxStyle(ratio.aspectRatio)"
              @click="handleCustomUpload(index)"
            >
              <wd-icon name="fill-camera" custom-class="img-icon" />
            </view>
            <wd-img
              v-if="customCroppedImgs[index]"
              width="300px"
              :height="getImageHeight(ratio.aspectRatio)"
              :src="customCroppedImgs[index]"
              mode="aspectFit"
              custom-class="profile-img"
              @click="handleCustomUpload(index)"
            />
            <view class="text-sm text-gray-500">{{ ratio.label }}比例裁剪</view>
          </view>
        </wd-cell>
      </wd-cell-group>

      <!-- 自定义比例裁剪器 -->
      <wd-img-cropper
        v-for="(ratio, index) in ratioConfigs"
        :key="index"
        v-model="showCustom[index]"
        :img-src="customImgSrcs[index]"
        :aspect-ratio="ratio.aspectRatio"
        @confirm="(event) => handleCustomConfirm(index, event)"
        @cancel="handleCustomCancel"
      />

      <template #codes>
        <DemoCode title="模板 - 自定义比例" :code="codes.custom.template" />
        <DemoCode title="脚本 - 自定义比例" :code="codes.custom.script" />
      </template>
    </DemoSection>

    <!-- 高级配置示例 -->
    <DemoSection title="高级配置" desc="更多裁剪配置选项">
      <wd-cell-group>
        <wd-cell title="禁用旋转" vertical>
          <view class="flex flex-col items-center p-4 space-y-3">
            <view
              v-if="!noRotateImg"
              class="img-upload"
              @click="handleNoRotateUpload"
            >
              <wd-icon name="fill-camera" custom-class="img-icon" />
            </view>
            <wd-img
              v-if="noRotateImg"
              round
              width="200px"
              height="200px"
              :src="noRotateImg"
              mode="aspectFit"
              custom-class="profile-img"
              @click="handleNoRotateUpload"
            />
            <view class="text-sm text-gray-500">禁用旋转功能</view>
          </view>
        </wd-cell>

        <wd-cell title="高质量输出" vertical>
          <view class="flex flex-col items-center p-4 space-y-3">
            <view
              v-if="!highQualityImg"
              class="img-upload"
              @click="handleHighQualityUpload"
            >
              <wd-icon name="fill-camera" custom-class="img-icon" />
            </view>
            <wd-img
              v-if="highQualityImg"
              round
              width="200px"
              height="200px"
              :src="highQualityImg"
              mode="aspectFit"
              custom-class="profile-img"
              @click="handleHighQualityUpload"
            />
            <view class="text-sm text-gray-500">高质量图片输出</view>
          </view>
        </wd-cell>
      </wd-cell-group>

      <!-- 高级配置裁剪器 -->
      <wd-img-cropper
        v-model="showNoRotate"
        :img-src="noRotateImgSrc"
        :disabled-rotate="true"
        @confirm="handleNoRotateConfirm"
        @cancel="handleAdvancedCancel"
      />

      <wd-img-cropper
        v-model="showHighQuality"
        :img-src="highQualityImgSrc"
        :quality="1"
        :export-scale="3"
        @confirm="handleHighQualityConfirm"
        @cancel="handleAdvancedCancel"
      />

      <template #codes>
        <DemoCode title="模板 - 禁用旋转" :code="codes.advanced.noRotateTemplate" />
        <DemoCode title="模板 - 高质量输出" :code="codes.advanced.highQualityTemplate" />
        <DemoCode title="脚本 - 高级配置" :code="codes.advanced.script" />
      </template>
    </DemoSection>

    <!-- 自定义按钮文案示例 -->
    <DemoSection title="自定义按钮文案" desc="自定义取消和确认按钮的文案">
      <wd-cell-group>
        <wd-cell title="自定义按钮文案" vertical>
          <view class="flex flex-col items-center p-4 space-y-3">
            <view
              v-if="!customButtonImg"
              class="img-upload"
              @click="handleCustomButtonUpload"
            >
              <wd-icon name="fill-camera" custom-class="img-icon" />
            </view>
            <wd-img
              v-if="customButtonImg"
              round
              width="200px"
              height="200px"
              :src="customButtonImg"
              mode="aspectFit"
              custom-class="profile-img"
              @click="handleCustomButtonUpload"
            />
            <view class="text-sm text-gray-500">自定义按钮文案</view>
          </view>
        </wd-cell>
      </wd-cell-group>

      <wd-img-cropper
        v-model="showCustomButton"
        :img-src="customButtonImgSrc"
        cancel-button-text="放弃"
        confirm-button-text="保存"
        @confirm="handleCustomButtonConfirm"
        @cancel="handleCustomButtonCancel"
      />

      <template #codes>
        <DemoCode title="模板 - 自定义按钮文案" :code="codes.customButton.template" />
        <DemoCode title="脚本 - 自定义按钮文案" :code="codes.customButton.script" />
      </template>
    </DemoSection>

    <!-- 事件监听示例 -->
    <DemoSection title="事件监听" desc="监听图片裁剪过程中的各种事件">
      <!-- 状态显示区域 -->
      <view class="space-y-4">
        <!-- 控制按钮 -->
        <wd-cell-group>
          <wd-cell title="事件监听演示" vertical>
            <view class="flex flex-col items-center p-4 space-y-3">
              <wd-button block @click="handleEventUpload">选择图片进行事件监听</wd-button>
              <view
                v-if="eventImg"
                class="img-upload"
              >
                <wd-img
                  round
                  width="200px"
                  height="200px"
                  :src="eventImg"
                  mode="aspectFit"
                  custom-class="profile-img"
                />
              </view>
            </view>
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

      <!-- 事件监听裁剪器 -->
      <wd-img-cropper
        v-model="showEvent"
        :img-src="eventImgSrc"
        @confirm="handleEventConfirm"
        @cancel="handleEventCancel"
        @imgloaded="handleEventImgLoaded"
        @imgloaderror="handleEventImgLoadError"
      />

      <template #codes>
        <DemoCode title="事件监听模板" :code="codes.events.template" />
        <DemoCode title="事件处理方法" :code="codes.events.methods" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :events="apiEvents" :methods="apiMethods" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/wd'

// ===== 组件状态管理 =====

const { show: showToast } = useToast()

// 基本用法相关状态
const showBasic = ref<boolean>(false)
const basicImgSrc = ref<string>('')
const basicCroppedImg = ref<string>('')

// 自定义比例配置
const ratioConfigs = ref([
  { aspectRatio: '3:2', label: '3:2' },
  { aspectRatio: '16:9', label: '16:9' },
  { aspectRatio: '16:10', label: '16:10' },
])

// 自定义比例相关状态
const showCustom = ref<boolean[]>([false, false, false])
const customImgSrcs = ref<string[]>(['', '', ''])
const customCroppedImgs = ref<string[]>(['', '', ''])

// 高级配置相关状态
const showNoRotate = ref<boolean>(false)
const noRotateImgSrc = ref<string>('')
const noRotateImg = ref<string>('')

const showHighQuality = ref<boolean>(false)
const highQualityImgSrc = ref<string>('')
const highQualityImg = ref<string>('')

// 自定义按钮文案相关状态
const showCustomButton = ref<boolean>(false)
const customButtonImgSrc = ref<string>('')
const customButtonImg = ref<string>('')

// 事件监听相关状态
const showEvent = ref<boolean>(false)
const eventImgSrc = ref<string>('')
const eventImg = ref<string>('')

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
    template: `<wd-cell title="头像裁剪" vertical>
  <view class="flex flex-col items-center space-y-4 p-4">
    <view v-if="!basicCroppedImg" class="img-upload" @click="handleBasicUpload">
      <wd-icon name="fill-camera" custom-class="img-icon" />
    </view>
    <wd-img
      v-if="basicCroppedImg"
      round
      width="200px"
      height="200px"
      :src="basicCroppedImg"
      mode="aspectFit"
      @click="handleBasicUpload"
    />
    <view class="text-sm text-gray-500">点击上传头像（1:1比例）</view>
  </view>
</wd-cell>

<wd-img-cropper
  v-model="showBasic"
  :img-src="basicImgSrc"
  @confirm="handleBasicConfirm"
  @cancel="handleBasicCancel"
/>`,

    script: `import { ref } from 'vue'
import { useToast } from '@/wd'

const { show: showToast } = useToast()

const showBasic = ref(false)
const basicImgSrc = ref('')
const basicCroppedImg = ref('')

const handleBasicUpload = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      basicImgSrc.value = res.tempFilePaths[0]
      showBasic.value = true
    },
    fail: (error) => {
      showToast({ msg: '选择图片失败，请重试' })
    }
  })
}

const handleBasicConfirm = (event) => {
  basicCroppedImg.value = event.tempFilePath
  showToast({ msg: '裁剪成功' })
}

const handleBasicCancel = () => {
  console.log('取消裁剪')
}`,
  },

  // 自定义比例代码
  custom: {
    template: `<wd-cell
  v-for="(ratio, index) in ratioConfigs"
  :key="index"
  :title="\`\${ratio.label}裁剪\`"
  vertical
>
  <view class="flex flex-col items-center space-y-3 p-4">
    <view
      v-if="!customCroppedImgs[index]"
      class="img-custom"
      @click="handleCustomUpload(index)"
    >
      <wd-icon name="fill-camera" custom-class="img-icon" />
    </view>
    <wd-img
      v-if="customCroppedImgs[index]"
      width="300px"
      :height="getImageHeight(ratio.aspectRatio)"
      :src="customCroppedImgs[index]"
      mode="aspectFit"
      @click="handleCustomUpload(index)"
    />
  </view>
</wd-cell>

<wd-img-cropper
  v-for="(ratio, index) in ratioConfigs"
  :key="index"
  v-model="showCustom[index]"
  :img-src="customImgSrcs[index]"
  :aspect-ratio="ratio.aspectRatio"
  @confirm="(event) => handleCustomConfirm(index, event)"
  @cancel="handleCustomCancel"
/>`,

    script: `const ratioConfigs = ref([
  { aspectRatio: '3:2', label: '3:2' },
  { aspectRatio: '16:9', label: '16:9' },
  { aspectRatio: '16:10', label: '16:10' },
])

const showCustom = ref([false, false, false])
const customImgSrcs = ref(['', '', ''])
const customCroppedImgs = ref(['', '', ''])

const handleCustomUpload = (index) => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      customImgSrcs.value[index] = res.tempFilePaths[0]
      showCustom.value[index] = true
    }
  })
}

const handleCustomConfirm = (index, event) => {
  customCroppedImgs.value[index] = event.tempFilePath
  showToast({ msg: \`\${ratioConfigs.value[index].label}比例裁剪成功\` })
}

const getImageHeight = (ratio) => {
  const [w, h] = ratio.split(':').map(Number)
  return \`\${(300 * h) / w}px\`
}`,
  },

  // 高级配置代码
  advanced: {
    noRotateTemplate: `<wd-img-cropper
  v-model="showNoRotate"
  :img-src="noRotateImgSrc"
  :disabled-rotate="true"
  @confirm="handleNoRotateConfirm"
  @cancel="handleAdvancedCancel"
/>`,

    highQualityTemplate: `<wd-img-cropper
  v-model="showHighQuality"
  :img-src="highQualityImgSrc"
  :quality="1"
  :export-scale="3"
  @confirm="handleHighQualityConfirm"
  @cancel="handleAdvancedCancel"
/>`,

    script: `// 禁用旋转相关状态
const showNoRotate = ref(false)
const noRotateImgSrc = ref('')
const noRotateImg = ref('')

// 高质量输出相关状态
const showHighQuality = ref(false)
const highQualityImgSrc = ref('')
const highQualityImg = ref('')

const handleNoRotateUpload = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      noRotateImgSrc.value = res.tempFilePaths[0]
      showNoRotate.value = true
    }
  })
}

const handleHighQualityUpload = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      highQualityImgSrc.value = res.tempFilePaths[0]
      showHighQuality.value = true
    }
  })
}`,
  },

  // 自定义按钮文案代码
  customButton: {
    template: `<wd-img-cropper
  v-model="showCustomButton"
  :img-src="customButtonImgSrc"
  cancel-button-text="放弃"
  confirm-button-text="保存"
  @confirm="handleCustomButtonConfirm"
  @cancel="handleCustomButtonCancel"
/>`,

    script: `const showCustomButton = ref(false)
const customButtonImgSrc = ref('')
const customButtonImg = ref('')

const handleCustomButtonUpload = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      customButtonImgSrc.value = res.tempFilePaths[0]
      showCustomButton.value = true
    }
  })
}

const handleCustomButtonConfirm = (event) => {
  customButtonImg.value = event.tempFilePath
  showToast({ msg: '保存成功' })
}

const handleCustomButtonCancel = () => {
  showToast({ msg: '已放弃裁剪' })
}`,
  },

  // 事件监听代码
  events: {
    template: `<wd-img-cropper
  v-model="showEvent"
  :img-src="eventImgSrc"
  @confirm="handleEventConfirm"
  @cancel="handleEventCancel"
  @imgloaded="handleEventImgLoaded"
  @imgloaderror="handleEventImgLoadError"
/>`,

    methods: `const addEventLog = (message, type = 'info') => {
  eventLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
    type,
  })
  if (eventLogs.value.length > 20) {
    eventLogs.value = eventLogs.value.slice(0, 20)
  }
}

const handleEventImgLoaded = (res) => {
  addEventLog('图片加载成功', 'success')
  console.log('图片加载成功:', res)
}

const handleEventImgLoadError = (err) => {
  addEventLog('图片加载失败', 'error')
  console.error('图片加载失败:', err)
}

const handleEventConfirm = (event) => {
  eventImg.value = event.tempFilePath
  addEventLog(\`裁剪完成，尺寸: \${event.width}x\${event.height}\`, 'success')
}

const handleEventCancel = () => {
  addEventLog('取消裁剪操作', 'warning')
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'model-value',
    type: 'Boolean',
    default: 'false',
    desc: '打开图片裁剪组件',
  },
  {
    name: 'img-src',
    type: 'String',
    default: '""',
    desc: '图片源路径',
  },
  {
    name: 'aspect-ratio',
    type: 'String',
    default: '"1:1"',
    desc: '裁剪框宽高比，格式为 width:height',
  },
  {
    name: 'disabled-rotate',
    type: 'Boolean',
    default: 'false',
    desc: '是否禁用旋转功能',
  },
  {
    name: 'cancel-button-text',
    type: 'String',
    default: '""',
    desc: '取消按钮文案',
  },
  {
    name: 'confirm-button-text',
    type: 'String',
    default: '""',
    desc: '确认按钮文案',
  },
  {
    name: 'file-type',
    type: 'String',
    default: '"png"',
    desc: '目标文件的类型，可选值：jpg、png',
  },
  {
    name: 'quality',
    type: 'Number',
    default: '1',
    desc: '生成的图片质量，取值范围为 0-1',
  },
  {
    name: 'export-scale',
    type: 'Number',
    default: '2',
    desc: '设置导出图片尺寸倍数',
  },
  {
    name: 'img-width',
    type: 'String | Number',
    default: '""',
    desc: '图片宽度（rpx）',
  },
  {
    name: 'img-height',
    type: 'String | Number',
    default: '""',
    desc: '图片高度（rpx）',
  },
  {
    name: 'max-scale',
    type: 'Number',
    default: '3',
    desc: '最大缩放倍数',
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
    name: 'resetImg()',
    desc: '初始化图片的大小和角度以及距离',
  },
  {
    name: 'setRoate(angle)',
    desc: '控制旋转角度，参数 angle 为旋转角度',
  },
  {
    name: 'revertIsAnimation(animation)',
    desc: '控制是否使用动画，参数 animation 为布尔值',
  },
]

// Events 事件文档
const apiEvents = [
  {
    name: 'confirm',
    desc: '确认裁剪时触发，参数为 { tempFilePath, width, height }',
  },
  {
    name: 'cancel',
    desc: '取消裁剪时触发',
  },
  {
    name: 'imgloaded',
    desc: '图片加载完成时触发',
  },
  {
    name: 'imgloaderror',
    desc: '图片加载失败时触发',
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
 * 根据比例计算图片高度
 */
const getImageHeight = (ratio: string): string => {
  const [w, h] = ratio.split(':').map(Number)
  return `${(300 * h) / w}px`
}

/**
 * 获取自定义上传框样式
 */
const getCustomBoxStyle = (ratio: string): string => {
  const [w, h] = ratio.split(':').map(Number)
  const height = (300 * h) / w
  return `height: ${height}px; width: 300px;`
}

// ===== 事件处理方法 =====

/**
 * 基本用法 - 选择图片
 */
const handleBasicUpload = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      basicImgSrc.value = res.tempFilePaths[0]
      showBasic.value = true
    },
    fail: (error) => {
      console.error('选择图片失败:', error)
      showToast({
        msg: '选择图片失败，请重试',
      })
    },
  })
}

/**
 * 基本用法 - 确认裁剪
 */
const handleBasicConfirm = (event: { tempFilePath: string; width: number; height: number }) => {
  basicCroppedImg.value = event.tempFilePath
  showToast({
    msg: '裁剪成功',
  })
  console.log('基本裁剪完成:', event)
}

/**
 * 基本用法 - 取消裁剪
 */
const handleBasicCancel = () => {
  console.log('取消基本裁剪')
}

/**
 * 自定义比例 - 选择图片
 */
const handleCustomUpload = (index: number) => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      customImgSrcs.value[index] = res.tempFilePaths[0]
      showCustom.value[index] = true
    },
    fail: (error) => {
      console.error('选择图片失败:', error)
      showToast({
        msg: '选择图片失败，请重试',
      })
    },
  })
}

/**
 * 自定义比例 - 确认裁剪
 */
const handleCustomConfirm = (index: number, event: { tempFilePath: string; width: number; height: number }) => {
  customCroppedImgs.value[index] = event.tempFilePath
  showToast({
    msg: `${ratioConfigs.value[index].label}比例裁剪成功`,
  })
  console.log(`自定义比例裁剪完成 (${ratioConfigs.value[index].aspectRatio}):`, event)
}

/**
 * 自定义比例 - 取消裁剪
 */
const handleCustomCancel = () => {
  console.log('取消自定义比例裁剪')
}

/**
 * 禁用旋转 - 选择图片
 */
const handleNoRotateUpload = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      noRotateImgSrc.value = res.tempFilePaths[0]
      showNoRotate.value = true
    },
    fail: (error) => {
      console.error('选择图片失败:', error)
      showToast({
        msg: '选择图片失败，请重试',
      })
    },
  })
}

/**
 * 禁用旋转 - 确认裁剪
 */
const handleNoRotateConfirm = (event: { tempFilePath: string; width: number; height: number }) => {
  noRotateImg.value = event.tempFilePath
  showToast({
    msg: '禁用旋转裁剪成功',
  })
  console.log('禁用旋转裁剪完成:', event)
}

/**
 * 高质量输出 - 选择图片
 */
const handleHighQualityUpload = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      highQualityImgSrc.value = res.tempFilePaths[0]
      showHighQuality.value = true
    },
    fail: (error) => {
      console.error('选择图片失败:', error)
      showToast({
        msg: '选择图片失败，请重试',
      })
    },
  })
}

/**
 * 高质量输出 - 确认裁剪
 */
const handleHighQualityConfirm = (event: { tempFilePath: string; width: number; height: number }) => {
  highQualityImg.value = event.tempFilePath
  showToast({
    msg: '高质量裁剪成功',
  })
  console.log('高质量裁剪完成:', event)
}

/**
 * 高级配置 - 取消裁剪
 */
const handleAdvancedCancel = () => {
  console.log('取消高级配置裁剪')
}

/**
 * 自定义按钮文案 - 选择图片
 */
const handleCustomButtonUpload = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      customButtonImgSrc.value = res.tempFilePaths[0]
      showCustomButton.value = true
    },
    fail: (error) => {
      console.error('选择图片失败:', error)
      showToast({
        msg: '选择图片失败，请重试',
      })
    },
  })
}

/**
 * 自定义按钮文案 - 确认裁剪
 */
const handleCustomButtonConfirm = (event: { tempFilePath: string; width: number; height: number }) => {
  customButtonImg.value = event.tempFilePath
  showToast({
    msg: '保存成功',
  })
  console.log('自定义按钮裁剪完成:', event)
}

/**
 * 自定义按钮文案 - 取消裁剪
 */
const handleCustomButtonCancel = () => {
  showToast({
    msg: '已放弃裁剪',
  })
  console.log('放弃裁剪')
}

/**
 * 事件监听 - 选择图片
 */
const handleEventUpload = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      eventImgSrc.value = res.tempFilePaths[0]
      showEvent.value = true
      addEventLog('开始裁剪图片', 'info')
    },
    fail: (error) => {
      console.error('选择图片失败:', error)
      addEventLog('选择图片失败', 'error')
      showToast({
        msg: '选择图片失败，请重试',
      })
    },
  })
}

/**
 * 事件监听 - 确认裁剪
 */
const handleEventConfirm = (event: { tempFilePath: string; width: number; height: number }) => {
  eventImg.value = event.tempFilePath
  addEventLog(`裁剪完成，尺寸: ${event.width}x${event.height}`, 'success')
  console.log('事件监听裁剪完成:', event)
}

/**
 * 事件监听 - 取消裁剪
 */
const handleEventCancel = () => {
  addEventLog('取消裁剪操作', 'warning')
  console.log('取消事件监听裁剪')
}

/**
 * 事件监听 - 图片加载成功
 */
const handleEventImgLoaded = (res: any) => {
  addEventLog('图片加载成功', 'success')
  console.log('图片加载成功:', res)
}

/**
 * 事件监听 - 图片加载失败
 */
const handleEventImgLoadError = (err: any) => {
  addEventLog('图片加载失败', 'error')
  console.error('图片加载失败:', err)
}

/**
 * 通用 - 图片加载成功
 */
const handleImgLoaded = (res: any) => {
  console.log('图片加载成功:', res)
}

/**
 * 通用 - 图片加载失败
 */
const handleImgLoadError = (err: any) => {
  console.error('图片加载失败:', err)
  showToast({
    msg: '图片加载失败',
  })
}
const { resetScrollTop, updateScrollTop } = useScroll()
onShow(() => {
  resetScrollTop()
})
onPageScroll((e) => {
  updateScrollTop(e.scrollTop)
})
</script>

<style scoped>
/* 头像上传区域样式 */
.img-upload {
  @apply relative h-50 w-50 rounded-full bg-gray-100 flex items-center justify-center;
}

/* 自定义比例图片上传区域 */
.img-custom {
  @apply relative rounded-2 bg-gray-100 flex items-center justify-center;
}

/* 相机图标样式 */
:deep(.img-icon) {
  @apply text-15 text-white;
}

/* 头像图片边框 */
:deep(.profile-img) {
  @apply border border-gray-200;
}
</style>
