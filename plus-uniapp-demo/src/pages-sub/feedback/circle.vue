<!-- Circle 环形进度条 http://127.0.0.1:100/#/pages-sub/demo/wd/circle -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Circle 环形进度条" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的环形进度条，支持文字显示和动画效果">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <!-- 基础进度条 -->
        <view class="text-center">
          <wd-circle v-model="basicProgress" :text="`${basicProgress}%`" />
          <view class="mt-3 text-sm text-gray-600">基础环形进度条</view>
        </view>

        <!-- 控制按钮 -->
        <view class="flex flex-wrap justify-center gap-2">
          <wd-button size="small" @click="setBasicProgress(25)">25%</wd-button>
          <wd-button size="small" @click="setBasicProgress(50)">50%</wd-button>
          <wd-button size="small" @click="setBasicProgress(75)">75%</wd-button>
          <wd-button size="small" @click="setBasicProgress(100)">100%</wd-button>
          <wd-button size="small" @click="setBasicProgress(0)">重置</wd-button>
        </view>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基本用法" :code="codes.basic.template" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 尺寸规格示例 -->
    <DemoSection title="尺寸规格" desc="支持不同大小，适用于各种使用场景">
      <view class="space-y-4">
        <!-- 不同尺寸展示 -->
        <view class="flex items-center justify-around">
          <view class="text-center">
            <wd-circle v-model="sizeProgress" :size="80" :text="`${sizeProgress}%`" />
            <view class="mt-2 text-xs text-gray-500">小型 80rpx</view>
          </view>
          <view class="text-center">
            <wd-circle v-model="sizeProgress" :size="120" :text="`${sizeProgress}%`" />
            <view class="mt-2 text-xs text-gray-500">中型 120rpx</view>
          </view>
          <view class="text-center">
            <wd-circle v-model="sizeProgress" :size="160" :text="`${sizeProgress}%`" />
            <view class="mt-2 text-xs text-gray-500">大型 160rpx</view>
          </view>
          <view class="text-center">
            <wd-circle v-model="sizeProgress" :size="200" :text="`${sizeProgress}%`" />
            <view class="mt-2 text-xs text-gray-500">特大 200rpx</view>
          </view>
        </view>

        <!-- 当前进度调节 -->
        <view class="mx-4">
          <view class="mb-2 text-sm text-gray-600">调节进度: {{ sizeProgress }}%</view>
          <wd-slider v-model="sizeProgress" />
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 不同尺寸" :code="codes.size.template" />
        <DemoCode title="脚本 - 尺寸配置" :code="codes.size.script" />
      </template>
    </DemoSection>

    <!-- 线条样式示例 -->
    <DemoSection title="线条样式" desc="自定义线条宽度和端点样式">
      <view class="space-y-4">
        <!-- 线条宽度展示 -->
        <view class="grid grid-cols-2 gap-4">
          <view class="text-center">
            <wd-circle v-model="strokeProgress" :stroke-width="4" text="细线条" />
            <view class="mt-2 text-xs text-gray-500">宽度: 4rpx</view>
          </view>
          <view class="text-center">
            <wd-circle v-model="strokeProgress" :stroke-width="8" text="标准线条" />
            <view class="mt-2 text-xs text-gray-500">宽度: 8rpx</view>
          </view>
          <view class="text-center">
            <wd-circle v-model="strokeProgress" :stroke-width="16" text="粗线条" />
            <view class="mt-2 text-xs text-gray-500">宽度: 16rpx</view>
          </view>
          <view class="text-center">
            <wd-circle
              v-model="strokeProgress"
              :stroke-width="24"
              stroke-linecap="butt"
              text="方形端点"
            />
            <view class="mt-2 text-xs text-gray-500">方形端点</view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 线条样式" :code="codes.stroke.template" />
        <DemoCode title="脚本 - 线条样式" :code="codes.stroke.script" />
      </template>
    </DemoSection>

    <!-- 颜色主题示例 -->
    <DemoSection title="颜色主题" desc="内置多种颜色主题和渐变效果">
      <view class="space-y-6">
        <!-- 单色主题 -->
        <view>
          <view class="mb-3 text-sm font-medium">单色主题</view>
          <view class="grid grid-cols-2 gap-4">
            <view class="text-center">
              <wd-circle v-model="colorProgress" color="#1989fa" text="主色调" />
              <view class="mt-2 text-xs text-gray-500">蓝色主题</view>
            </view>
            <view class="text-center">
              <wd-circle v-model="colorProgress" color="#07c160" text="成功色" />
              <view class="mt-2 text-xs text-gray-500">绿色主题</view>
            </view>
            <view class="text-center">
              <wd-circle v-model="colorProgress" color="#ff976a" text="警告色" />
              <view class="mt-2 text-xs text-gray-500">橙色主题</view>
            </view>
            <view class="text-center">
              <wd-circle v-model="colorProgress" color="#ee0a24" text="危险色" />
              <view class="mt-2 text-xs text-gray-500">红色主题</view>
            </view>
          </view>
        </view>

        <!-- 渐变主题 -->
        <view>
          <view class="mb-3 text-sm font-medium">渐变主题</view>
          <view class="grid grid-cols-2 gap-4">
            <view class="text-center">
              <wd-circle v-model="gradientProgress" :color="blueGradient" text="蓝色渐变" />
              <view class="mt-2 text-xs text-gray-500">蓝色渐变</view>
            </view>
            <view class="text-center">
              <wd-circle v-model="gradientProgress" :color="greenGradient" text="绿色渐变" />
              <view class="mt-2 text-xs text-gray-500">绿色渐变</view>
            </view>
            <view class="text-center">
              <wd-circle v-model="gradientProgress" :color="orangeGradient" text="橙色渐变" />
              <view class="mt-2 text-xs text-gray-500">橙色渐变</view>
            </view>
            <view class="text-center">
              <wd-circle v-model="gradientProgress" :color="purpleGradient" text="紫色渐变" />
              <view class="mt-2 text-xs text-gray-500">紫色渐变</view>
            </view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 单色主题" :code="codes.color.solidTemplate" />
        <DemoCode title="模板 - 渐变主题" :code="codes.color.gradientTemplate" />
        <DemoCode title="脚本 - 颜色配置" :code="codes.color.script" />
      </template>
    </DemoSection>

    <!-- 动画效果示例 -->
    <DemoSection title="动画效果" desc="支持不同速度的进度动画和方向控制">
      <view class="space-y-6">
        <!-- 动画速度展示 -->
        <view>
          <view class="mb-3 text-sm font-medium">动画速度</view>
          <view class="grid grid-cols-2 gap-4">
            <view class="text-center">
              <wd-circle v-model="animationProgress1" :speed="20" color="#07c160" text="慢速动画" />
              <view class="mt-2 text-xs text-gray-500">速度: 20</view>
            </view>
            <view class="text-center">
              <wd-circle v-model="animationProgress2" :speed="50" color="#1989fa" text="标准动画" />
              <view class="mt-2 text-xs text-gray-500">速度: 50</view>
            </view>
            <view class="text-center">
              <wd-circle v-model="animationProgress3" :speed="100" color="#ff976a" text="快速动画" />
              <view class="mt-2 text-xs text-gray-500">速度: 100</view>
            </view>
            <view class="text-center">
              <wd-circle v-model="animationProgress4" :speed="0" color="#ee0a24" text="无动画" />
              <view class="mt-2 text-xs text-gray-500">速度: 0</view>
            </view>
          </view>
        </view>

        <!-- 方向控制 -->
        <view>
          <view class="mb-3 text-sm font-medium">增长方向</view>
          <view class="flex items-center justify-around">
            <view class="text-center">
              <wd-circle v-model="directionProgress" :clockwise="true" color="#1989fa" text="顺时针" />
              <view class="mt-2 text-xs text-gray-500">Clockwise</view>
            </view>
            <view class="text-center">
              <wd-circle v-model="directionProgress" :clockwise="false" color="#ee0a24" text="逆时针" />
              <view class="mt-2 text-xs text-gray-500">Counter-clockwise</view>
            </view>
          </view>
        </view>

        <!-- 动画控制按钮 -->
        <view class="flex justify-center gap-2">
          <wd-button size="small" @click="startAnimation">开始动画</wd-button>
          <wd-button size="small" @click="resetAnimation">重置动画</wd-button>
          <wd-button size="small" @click="randomAnimation">随机演示</wd-button>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 动画速度" :code="codes.animation.speedTemplate" />
        <DemoCode title="模板 - 方向控制" :code="codes.animation.directionTemplate" />
        <DemoCode title="脚本 - 动画控制" :code="codes.animation.script" />
      </template>
    </DemoSection>

    <!-- 自定义内容示例 -->
    <DemoSection title="自定义内容" desc="使用插槽自定义进度条中心显示的内容">
      <view class="space-y-4">
        <!-- 自定义内容展示 -->
        <view class="grid grid-cols-2 gap-4">
          <view class="text-center">
            <wd-circle v-model="customProgress" color="#1989fa">
              <view class="text-lg text-blue-600 font-bold">{{ customProgress }}%</view>
              <view class="text-xs text-gray-500">完成度</view>
            </wd-circle>
            <view class="mt-2 text-xs text-gray-500">文字内容</view>
          </view>
          <view class="text-center">
            <wd-circle v-model="customProgress" :color="blueGradient">
              <view class="flex flex-col items-center">
                <view class="text-2xl">📊</view>
                <view class="text-xs text-gray-600">{{ customProgress }}%</view>
              </view>
            </wd-circle>
            <view class="mt-2 text-xs text-gray-500">图标+文字</view>
          </view>
          <view class="text-center">
            <wd-circle v-model="customProgress" color="#07c160">
              <view class="flex flex-col items-center">
                <view class="text-green-600 font-bold">
                  {{ Math.round(customProgress * 2.4) }}/240
                </view>
                <view class="text-xs text-gray-500">任务进度</view>
              </view>
            </wd-circle>
            <view class="mt-2 text-xs text-gray-500">自定义数值</view>
          </view>
          <view class="text-center">
            <wd-circle v-model="customProgress" color="#ff976a">
              <view class="flex flex-col items-center">
                <view class="text-lg">{{ getStatusIcon(customProgress) }}</view>
                <view class="text-xs">{{ getStatusText(customProgress) }}</view>
              </view>
            </wd-circle>
            <view class="mt-2 text-xs text-gray-500">状态显示</view>
          </view>
        </view>

        <!-- 进度调节 -->
        <view class="mx-4">
          <view class="mb-2 text-sm text-gray-600">调节进度: {{ customProgress }}%</view>
          <wd-slider v-model="customProgress" />
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 自定义内容" :code="codes.custom.template" />
        <DemoCode title="脚本 - 自定义内容" :code="codes.custom.script" />
      </template>
    </DemoSection>

    <!-- 实际应用场景示例 -->
    <DemoSection title="实际应用场景" desc="模拟真实业务场景的使用示例">
      <view class="space-y-6">
        <!-- 文件上传进度 -->
        <view>
          <view class="mb-3 text-sm font-medium">文件上传进度</view>
          <view class="flex items-center gap-4">
            <wd-circle v-model="uploadProgress" :size="100" color="#1989fa">
              <view class="text-center">
                <view class="text-blue-600 font-bold">{{ uploadProgress }}%</view>
                <view class="text-xs text-gray-500">
                  {{ uploadProgress === 100 ? '完成' : '上传中' }}
                </view>
              </view>
            </wd-circle>
            <view class="flex-1">
              <view class="text-sm font-medium">document.pdf</view>
              <view class="mt-1 text-xs text-gray-500">
                {{
                  uploadProgress === 100
                    ? '上传完成'
                    : `已上传 ${Math.round(uploadProgress * 2.4)}MB / 240MB`
                }}
              </view>
              <view class="mt-2 flex gap-2">
                <wd-button size="small" :disabled="uploadProgress === 100" @click="simulateUpload">
                  {{ uploadProgress === 100 ? '已完成' : '开始上传' }}
                </wd-button>
                <wd-button v-if="uploadProgress === 100" size="small" @click="resetUpload">
                  重新上传
                </wd-button>
              </view>
            </view>
          </view>
        </view>

        <!-- 任务完成度 -->
        <view>
          <view class="mb-3 text-sm font-medium">今日任务完成度</view>
          <view class="flex items-center gap-4">
            <wd-circle v-model="taskProgress" :size="100" :color="getTaskColor(taskProgress)">
              <view class="text-center">
                <view class="font-bold">{{ Math.round(taskProgress * 0.12) }}/12</view>
                <view class="text-xs text-gray-500">任务</view>
              </view>
            </wd-circle>
            <view class="flex-1">
              <view class="text-sm font-medium">总计 12 项任务</view>
              <view class="mt-1 text-xs text-gray-500">
                已完成 {{ Math.round(taskProgress * 0.12) }} 项，还剩
                {{ 12 - Math.round(taskProgress * 0.12) }} 项
              </view>
              <view class="mt-2 flex gap-2">
                <wd-button size="small" @click="completeTask">完成一项</wd-button>
                <wd-button size="small" @click="resetTask">重置任务</wd-button>
              </view>
            </view>
          </view>
        </view>

        <!-- 存储空间使用 -->
        <view>
          <view class="mb-3 text-sm font-medium">存储空间使用情况</view>
          <view class="flex items-center gap-4">
            <wd-circle
              v-model="storageProgress"
              :size="100"
              :color="getStorageColor(storageProgress)"
            >
              <view class="text-center">
                <view class="text-sm font-bold">{{ Math.round(storageProgress * 0.64) }}GB</view>
                <view class="text-xs text-gray-500">/ 64GB</view>
              </view>
            </wd-circle>
            <view class="flex-1">
              <view class="text-sm font-medium">云存储空间</view>
              <view class="mt-1 text-xs text-gray-500">
                已使用 {{ Math.round(storageProgress * 0.64) }}GB，剩余
                {{ 64 - Math.round(storageProgress * 0.64) }}GB
              </view>
              <view
                class="mt-1 text-xs"
                :class="storageProgress > 80 ? 'text-red-500' : 'text-gray-500'"
              >
                {{ storageProgress > 80 ? '⚠️ 存储空间不足' : '存储空间充足' }}
              </view>
              <view class="mt-2 flex gap-2">
                <wd-button size="small" @click="addStorage">增加文件</wd-button>
                <wd-button size="small" @click="clearStorage">清理空间</wd-button>
              </view>
            </view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 文件上传" :code="codes.scenarios.uploadTemplate" />
        <DemoCode title="脚本 - 文件上传" :code="codes.scenarios.uploadScript" />
        <DemoCode title="模板 - 任务管理" :code="codes.scenarios.taskTemplate" />
        <DemoCode title="脚本 - 任务管理" :code="codes.scenarios.taskScript" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

// ===== 组件状态管理 =====

// 基础进度值
const basicProgress = ref<number>(20)
const sizeProgress = ref<number>(65)
const strokeProgress = ref<number>(45)
const colorProgress = ref<number>(70)
const gradientProgress = ref<number>(80)
const directionProgress = ref<number>(60)
const customProgress = ref<number>(75)

// 动画进度值
const animationProgress1 = ref<number>(0)
const animationProgress2 = ref<number>(0)
const animationProgress3 = ref<number>(0)
const animationProgress4 = ref<number>(0)

// 应用场景进度值
const uploadProgress = ref<number>(0)
const taskProgress = ref<number>(33)
const storageProgress = ref<number>(45)

// 自动演示定时器
const autoTimer: any = null

// ===== 渐变色配置 =====

const blueGradient = {
  '0%': '#1989fa',
  '100%': '#5cb3ff',
}

const greenGradient = {
  '0%': '#07c160',
  '100%': '#42d37b',
}

const orangeGradient = {
  '0%': '#ff976a',
  '100%': '#ffb366',
}

const purpleGradient = {
  '0%': '#9c88ff',
  '100%': '#b8a6ff',
}

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    template: `<wd-circle v-model="basicProgress" :text="\`\${basicProgress}%\`" />`,

    script: `import { ref } from 'vue'

const basicProgress = ref(20)

const setBasicProgress = (value: number) => {
  basicProgress.value = value
}`,
  },

  // 尺寸规格代码
  size: {
    template: `<!-- 不同尺寸展示 -->
<wd-circle v-model="sizeProgress" :size="80" :text="\`\${sizeProgress}%\`" />
<wd-circle v-model="sizeProgress" :size="120" :text="\`\${sizeProgress}%\`" />
<wd-circle v-model="sizeProgress" :size="160" :text="\`\${sizeProgress}%\`" />
<wd-circle v-model="sizeProgress" :size="200" :text="\`\${sizeProgress}%\`" />

<!-- 进度调节 -->
<wd-slider v-model="sizeProgress" />`,

    script: `const sizeProgress = ref(65)

// 支持的尺寸范围：50-400rpx
// 常用尺寸：80rpx(小)、120rpx(中)、160rpx(大)、200rpx(特大)`,
  },

  // 线条样式代码
  stroke: {
    template: `<!-- 不同线条宽度 -->
<wd-circle v-model="strokeProgress" :stroke-width="4" text="细线条" />
<wd-circle v-model="strokeProgress" :stroke-width="8" text="标准线条" />
<wd-circle v-model="strokeProgress" :stroke-width="16" text="粗线条" />

<!-- 方形端点 -->
<wd-circle
  v-model="strokeProgress"
  :stroke-width="24"
  stroke-linecap="butt"
  text="方形端点"
/>`,

    script: `const strokeProgress = ref(45)

// 线条宽度：支持任意数值，单位 rpx
// 端点样式：'butt'(方形) | 'round'(圆形) | 'square'(正方形)`,
  },

  // 颜色配置代码
  color: {
    solidTemplate: `<!-- 单色主题 -->
<wd-circle v-model="colorProgress" color="#1989fa" text="主色调" />
<wd-circle v-model="colorProgress" color="#07c160" text="成功色" />
<wd-circle v-model="colorProgress" color="#ff976a" text="警告色" />
<wd-circle v-model="colorProgress" color="#ee0a24" text="危险色" />`,

    gradientTemplate: `<!-- 渐变主题 -->
<wd-circle v-model="gradientProgress" :color="blueGradient" text="蓝色渐变" />
<wd-circle v-model="gradientProgress" :color="greenGradient" text="绿色渐变" />
<wd-circle v-model="gradientProgress" :color="orangeGradient" text="橙色渐变" />
<wd-circle v-model="gradientProgress" :color="purpleGradient" text="紫色渐变" />`,

    script: `const colorProgress = ref(70)
const gradientProgress = ref(80)

// 渐变色配置
const blueGradient = {
  '0%': '#1989fa',
  '100%': '#5cb3ff',
}

const greenGradient = {
  '0%': '#07c160',
  '100%': '#42d37b',
}

const orangeGradient = {
  '0%': '#ff976a',
  '100%': '#ffb366',
}

const purpleGradient = {
  '0%': '#9c88ff',
  '100%': '#b8a6ff',
}`,
  },

  // 动画效果代码
  animation: {
    speedTemplate: `<!-- 不同动画速度 -->
<wd-circle v-model="animationProgress1" :speed="20" color="#07c160" text="慢速动画" />
<wd-circle v-model="animationProgress2" :speed="50" color="#1989fa" text="标准动画" />
<wd-circle v-model="animationProgress3" :speed="100" color="#ff976a" text="快速动画" />
<wd-circle v-model="animationProgress4" :speed="0" color="#ee0a24" text="无动画" />`,

    directionTemplate: `<!-- 增长方向控制 -->
<wd-circle v-model="directionProgress" :clockwise="true" color="#1989fa" text="顺时针" />
<wd-circle v-model="directionProgress" :clockwise="false" color="#ee0a24" text="逆时针" />`,

    script: `const animationProgress1 = ref(0)
const animationProgress2 = ref(0)
const animationProgress3 = ref(0)
const animationProgress4 = ref(0)
const directionProgress = ref(60)

const startAnimation = () => {
  animationProgress1.value = 75
  animationProgress2.value = 85
  animationProgress3.value = 95
  animationProgress4.value = 100
}

const resetAnimation = () => {
  animationProgress1.value = 0
  animationProgress2.value = 0
  animationProgress3.value = 0
  animationProgress4.value = 0
}

const randomAnimation = () => {
  const random = Math.floor(Math.random() * 100)
  animationProgress1.value = random
  animationProgress2.value = random
  animationProgress3.value = random
  animationProgress4.value = random
  directionProgress.value = random
}`,
  },

  // 自定义内容代码
  custom: {
    template: `<!-- 自定义文字内容 -->
<wd-circle v-model="customProgress" color="#1989fa">
  <view class="text-lg text-blue-600 font-bold">{{ customProgress }}%</view>
  <view class="text-xs text-gray-500">完成度</view>
</wd-circle>

<!-- 图标+文字 -->
<wd-circle v-model="customProgress" :color="blueGradient">
  <view class="flex flex-col items-center">
    <view class="text-2xl">📊</view>
    <view class="text-xs text-gray-600">{{ customProgress }}%</view>
  </view>
</wd-circle>

<!-- 自定义数值 -->
<wd-circle v-model="customProgress" color="#07c160">
  <view class="flex flex-col items-center">
    <view class="text-green-600 font-bold">
      {{ Math.round(customProgress * 2.4) }}/240
    </view>
    <view class="text-xs text-gray-500">任务进度</view>
  </view>
</wd-circle>

<!-- 状态显示 -->
<wd-circle v-model="customProgress" color="#ff976a">
  <view class="flex flex-col items-center">
    <view class="text-lg">{{ getStatusIcon(customProgress) }}</view>
    <view class="text-xs">{{ getStatusText(customProgress) }}</view>
  </view>
</wd-circle>`,

    script: `const customProgress = ref(75)

const getStatusIcon = (progress: number) => {
  if (progress === 0) return '⏳'
  if (progress < 30) return '🔴'
  if (progress < 70) return '🟡'
  if (progress < 100) return '🔵'
  return '✅'
}

const getStatusText = (progress: number) => {
  if (progress === 0) return '未开始'
  if (progress < 30) return '刚开始'
  if (progress < 70) return '进行中'
  if (progress < 100) return '即将完成'
  return '已完成'
}`,
  },

  // 应用场景代码
  scenarios: {
    uploadTemplate: `<!-- 文件上传进度 -->
<view class="flex items-center gap-4">
  <wd-circle v-model="uploadProgress" :size="100" color="#1989fa">
    <view class="text-center">
      <view class="text-blue-600 font-bold">{{ uploadProgress }}%</view>
      <view class="text-xs text-gray-500">
        {{ uploadProgress === 100 ? '完成' : '上传中' }}
      </view>
    </view>
  </wd-circle>
  <view class="flex-1">
    <view class="text-sm font-medium">document.pdf</view>
    <view class="mt-1 text-xs text-gray-500">
      {{
        uploadProgress === 100
          ? '上传完成'
          : \`已上传 \${Math.round(uploadProgress * 2.4)}MB / 240MB\`
      }}
    </view>
    <view class="mt-2 flex gap-2">
      <wd-button size="small" :disabled="uploadProgress === 100" @click="simulateUpload">
        {{ uploadProgress === 100 ? '已完成' : '开始上传' }}
      </wd-button>
      <wd-button v-if="uploadProgress === 100" size="small" @click="resetUpload">
        重新上传
      </wd-button>
    </view>
  </view>
</view>`,

    uploadScript: `const uploadProgress = ref(0)

const simulateUpload = () => {
  if (uploadProgress.value >= 100) return

  const timer = setInterval(() => {
    uploadProgress.value += Math.random() * 8
    if (uploadProgress.value >= 100) {
      uploadProgress.value = 100
      clearInterval(timer)
    }
  }, 200)
}

const resetUpload = () => {
  uploadProgress.value = 0
}`,

    taskTemplate: `<!-- 任务完成度 -->
<view class="flex items-center gap-4">
  <wd-circle v-model="taskProgress" :size="100" :color="getTaskColor(taskProgress)">
    <view class="text-center">
      <view class="font-bold">{{ Math.round(taskProgress * 0.12) }}/12</view>
      <view class="text-xs text-gray-500">任务</view>
    </view>
  </wd-circle>
  <view class="flex-1">
    <view class="text-sm font-medium">总计 12 项任务</view>
    <view class="mt-1 text-xs text-gray-500">
      已完成 {{ Math.round(taskProgress * 0.12) }} 项，还剩
      {{ 12 - Math.round(taskProgress * 0.12) }} 项
    </view>
    <view class="mt-2 flex gap-2">
      <wd-button size="small" @click="completeTask">完成一项</wd-button>
      <wd-button size="small" @click="resetTask">重置任务</wd-button>
    </view>
  </view>
</view>`,

    taskScript: `const taskProgress = ref(33)

const getTaskColor = (progress: number) => {
  if (progress < 50) return '#ff976a'
  if (progress < 80) return '#1989fa'
  return '#07c160'
}

const completeTask = () => {
  if (taskProgress.value < 100) {
    taskProgress.value = Math.min(100, taskProgress.value + 8.33)
  }
}

const resetTask = () => {
  taskProgress.value = 0
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'model-value',
    type: 'Number',
    default: '0',
    desc: '当前进度，取值范围 0-100',
  },
  {
    name: 'size',
    type: 'Number',
    default: '200',
    desc: '圆环直径，默认单位为 rpx',
  },
  {
    name: 'color',
    type: 'String | Object',
    default: '"#4d80f0"',
    desc: '进度条颜色，支持字符串或对象格式定义渐变色',
  },
  {
    name: 'layer-color',
    type: 'String',
    default: '"#EBEEF5"',
    desc: '轨道颜色，即进度条背景颜色',
  },
  {
    name: 'fill',
    type: 'String',
    default: '""',
    desc: '填充颜色，设置后会填充整个圆环',
  },
  {
    name: 'speed',
    type: 'Number',
    default: '50',
    desc: '动画速度，单位为 rate/s，设置为 0 则无动画效果',
  },
  {
    name: 'text',
    type: 'String',
    default: '""',
    desc: '进度条中心显示的文字内容',
  },
  {
    name: 'stroke-width',
    type: 'Number',
    default: '20',
    desc: '进度条宽度，单位 rpx',
  },
  {
    name: 'stroke-linecap',
    type: 'String',
    default: '"round"',
    desc: '进度条端点的形状：butt-方形端点，round-圆形端点，square-正方形端点',
  },
  {
    name: 'clockwise',
    type: 'Boolean',
    default: 'true',
    desc: '是否顺时针方向增长进度',
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

// Events 事件文档（Circle 组件没有事件）
const apiEvents: any[] = []

// ===== 工具方法 =====

/**
 * 获取状态图标
 */
const getStatusIcon = (progress: number): string => {
  if (progress === 0) return '⏳'
  if (progress < 30) return '🔴'
  if (progress < 70) return '🟡'
  if (progress < 100) return '🔵'
  return '✅'
}

/**
 * 获取状态文字
 */
const getStatusText = (progress: number): string => {
  if (progress === 0) return '未开始'
  if (progress < 30) return '刚开始'
  if (progress < 70) return '进行中'
  if (progress < 100) return '即将完成'
  return '已完成'
}

/**
 * 获取任务颜色
 */
const getTaskColor = (progress: number): string => {
  if (progress < 50) return '#ff976a'
  if (progress < 80) return '#1989fa'
  return '#07c160'
}

/**
 * 获取存储颜色
 */
const getStorageColor = (progress: number): string => {
  if (progress < 60) return '#07c160'
  if (progress < 80) return '#ff976a'
  return '#ee0a24'
}

// ===== 事件处理方法 =====

/**
 * 设置基础进度
 */
const setBasicProgress = (value: number) => {
  basicProgress.value = value
  console.log(`设置基础进度：${value}%`)
}

/**
 * 开始动画演示
 */
const startAnimation = () => {
  animationProgress1.value = 75
  animationProgress2.value = 85
  animationProgress3.value = 95
  animationProgress4.value = 100
  console.log('开始动画演示')
}

/**
 * 重置动画
 */
const resetAnimation = () => {
  animationProgress1.value = 0
  animationProgress2.value = 0
  animationProgress3.value = 0
  animationProgress4.value = 0
  console.log('重置动画')
}

/**
 * 随机动画演示
 */
const randomAnimation = () => {
  const random = Math.floor(Math.random() * 100)
  animationProgress1.value = random
  animationProgress2.value = random
  animationProgress3.value = random
  animationProgress4.value = random
  directionProgress.value = random
  console.log(`随机演示，进度：${random}%`)
}

/**
 * 模拟文件上传
 */
const simulateUpload = () => {
  if (uploadProgress.value >= 100) return

  console.log('开始模拟上传')
  const timer = setInterval(() => {
    uploadProgress.value += Math.random() * 8
    if (uploadProgress.value >= 100) {
      uploadProgress.value = 100
      clearInterval(timer)
      console.log('上传完成')
    }
  }, 200)
}

/**
 * 重置上传
 */
const resetUpload = () => {
  uploadProgress.value = 0
  console.log('重置上传进度')
}

/**
 * 完成一项任务
 */
const completeTask = () => {
  if (taskProgress.value < 100) {
    taskProgress.value = Math.min(100, taskProgress.value + 8.33)
    console.log(`完成一项任务，当前进度：${Math.round(taskProgress.value)}%`)
  }
}

/**
 * 重置任务
 */
const resetTask = () => {
  taskProgress.value = 0
  console.log('重置任务进度')
}

/**
 * 增加存储使用
 */
const addStorage = () => {
  if (storageProgress.value < 100) {
    storageProgress.value = Math.min(100, storageProgress.value + 10)
    console.log(`增加存储使用，当前：${Math.round(storageProgress.value)}%`)
  }
}

/**
 * 清理存储空间
 */
const clearStorage = () => {
  storageProgress.value = Math.max(0, storageProgress.value - 20)
  console.log(`清理存储空间，当前：${Math.round(storageProgress.value)}%`)
}

// ===== 生命周期处理 =====

/**
 * 组件卸载时清理定时器
 */
onUnmounted(() => {
  if (autoTimer) {
    clearInterval(autoTimer)
    console.log('清理定时器')
  }
})

const { resetScrollTop, updateScrollTop } = useScroll()
onShow(() => {
  resetScrollTop()
})
onPageScroll((e) => {
  updateScrollTop(e.scrollTop)
})
</script>

<style lang="scss" scoped></style>
