<!-- Progress 进度条 http://127.0.0.1:100/#/pages-sub/demo/wd/progress -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Progress 进度条" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的进度条，显示当前进度">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="默认进度条">
          <wd-progress :percentage="basicPercentage" />
        </wd-cell>

        <wd-cell title="不显示进度文字">
          <wd-progress :percentage="60" hide-text />
        </wd-cell>
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基本用法" :code="codes.basic.template" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 进度条状态示例 -->
    <DemoSection title="进度条状态" desc="通过 status 属性设置不同的状态主题">
      <wd-cell-group>
        <wd-cell title="成功状态" vertical>
          <wd-progress :percentage="100" hide-text status="success" />
        </wd-cell>

        <wd-cell title="警告状态" vertical>
          <wd-progress :percentage="80" hide-text status="warning" />
        </wd-cell>

        <wd-cell title="危险状态" vertical>
          <wd-progress :percentage="90" hide-text status="danger" />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 进度条状态" :code="codes.status.template" />
        <DemoCode title="脚本 - 进度条状态" :code="codes.status.script" />
      </template>
    </DemoSection>

    <!-- 自定义颜色示例 -->
    <DemoSection title="自定义颜色" desc="通过 color 属性自定义进度条颜色">
      <wd-cell-group>
        <wd-cell title="单一颜色" vertical>
          <wd-progress :percentage="80" color="#00c740" />
        </wd-cell>

        <wd-cell title="颜色数组" vertical>
          <wd-progress :percentage="100" :color="colorArray" />
        </wd-cell>

        <wd-cell title="颜色对象配置" vertical>
          <wd-progress :percentage="colorObjectPercentage" :color="colorObject" />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 单一颜色" :code="codes.color.singleTemplate" />
        <DemoCode title="模板 - 颜色数组" :code="codes.color.arrayTemplate" />
        <DemoCode title="模板 - 颜色对象" :code="codes.color.objectTemplate" />
        <DemoCode title="脚本 - 自定义颜色" :code="codes.color.script" />
      </template>
    </DemoSection>

    <!-- 动态进度示例 -->
    <DemoSection title="动态进度" desc="通过按钮控制进度条的动态变化">
      <!-- 动态控制区域 -->
      <view class="space-y-4">
        <!-- 进度条显示 -->
        <wd-cell title="当前进度" vertical>
          <wd-progress :percentage="dynamicPercentage" />
        </wd-cell>

        <!-- 控制按钮 -->
        <view class="px-4">
          <view class="flex justify-center space-x-2">
            <wd-button type="success" size="small" @click="handleAdd">
              <wd-text text="+10" />
            </wd-button>
            <wd-button type="error" size="small" @click="handleReduce">
              <wd-text text="-10" />
            </wd-button>
            <wd-button type="primary" size="small" @click="handleReset">
              <wd-text text="重置" />
            </wd-button>
          </view>
        </view>

        <!-- 状态显示 -->
        <view class="mx-4 rounded-lg bg-blue-50 px-4 py-2">
          <view class="text-xs text-blue-600 font-medium">
            💡 当前进度：{{ dynamicPercentage }}%
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 动态进度" :code="codes.dynamic.template" />
        <DemoCode title="脚本 - 动态进度" :code="codes.dynamic.script" />
      </template>
    </DemoSection>

    <!-- 动画配置示例 -->
    <DemoSection title="动画配置" desc="自定义进度条动画速度和效果">
      <wd-cell-group>
        <wd-cell title="默认速度" vertical>
          <wd-progress :percentage="animationPercentage" />
        </wd-cell>

        <wd-cell title="慢速动画" vertical>
          <wd-progress :percentage="animationPercentage" :duration="60" />
        </wd-cell>

        <wd-cell title="快速动画" vertical>
          <wd-progress :percentage="animationPercentage" :duration="10" />
        </wd-cell>
      </wd-cell-group>

      <!-- 动画控制按钮 -->
      <view class="mt-4 px-4">
        <wd-button block @click="handleAnimationDemo">重新播放动画</wd-button>
      </view>

      <template #codes>
        <DemoCode title="模板 - 动画配置" :code="codes.animation.template" />
        <DemoCode title="脚本 - 动画配置" :code="codes.animation.script" />
      </template>
    </DemoSection>

    <!-- 实际应用场景 -->
    <DemoSection title="实际应用场景" desc="常见的业务场景示例">
      <!-- 文件上传进度 -->
      <view class="space-y-4">
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">文件上传进度</view>
          <view class="mx-4 rounded-lg bg-gray-50 p-4">
            <view class="mb-2 text-xs text-gray-600">正在上传：document.pdf</view>
            <wd-progress :percentage="uploadProgress" color="#409eff" />
            <view class="mt-2 text-xs text-gray-500">
              {{ uploadProgress < 100 ? `${uploadProgress}% 上传中...` : '上传完成' }}
            </view>
          </view>
        </view>

        <!-- 技能熟练度 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">技能熟练度</view>
          <view class="mx-4 rounded-lg bg-gray-50 p-4 space-y-3">
            <view v-for="skill in skillList" :key="skill.name">
              <view class="mb-1 flex justify-between">
                <view class="text-xs text-gray-600">{{ skill.name }}</view>
                <view class="text-xs text-gray-500">{{ skill.level }}%</view>
              </view>
              <wd-progress :percentage="skill.level" :color="skill.color" hide-text />
            </view>
          </view>
        </view>

        <!-- 任务完成进度 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">项目任务进度</view>
          <view class="mx-4 rounded-lg bg-gray-50 p-4 space-y-3">
            <view v-for="task in taskList" :key="task.name">
              <view class="mb-1 flex justify-between">
                <view class="text-xs text-gray-600">{{ task.name }}</view>
                <view class="text-xs" :class="getTaskStatusClass(task.progress)">
                  {{ getTaskStatusText(task.progress) }}
                </view>
              </view>
              <wd-progress
                :percentage="task.progress"
                :status="getTaskStatus(task.progress)"
                hide-text
              />
            </view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 文件上传" :code="codes.scenarios.uploadTemplate" />
        <DemoCode title="模板 - 技能展示" :code="codes.scenarios.skillTemplate" />
        <DemoCode title="模板 - 任务进度" :code="codes.scenarios.taskTemplate" />
        <DemoCode title="脚本 - 应用场景" :code="codes.scenarios.script" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import type { ProgressColor, ProgressStatus } from '@/wd/components/wd-progress/wd-progress.vue'
import { ref } from 'vue'

// ===== 组件状态管理 =====

// 基本用法进度值
const basicPercentage = ref<number>(30)

// 动态进度值
const dynamicPercentage = ref<number>(50)

// 动画演示进度值
const animationPercentage = ref<number>(0)

// 颜色配置相关
const colorObjectPercentage = ref<number>(100)

// 颜色数组配置
const colorArray = ref<string[]>(['#00c740', '#ffb300', '#e2231a', '#0083ff'])

// 颜色对象配置
const colorObject = ref<ProgressColor[]>([
  { color: 'yellow', percentage: 30 },
  { color: 'red', percentage: 60 },
  { color: 'blue', percentage: 80 },
  { color: 'black', percentage: 90 },
])

// 应用场景数据
const uploadProgress = ref<number>(65)

const skillList = ref([
  { name: 'Vue.js', level: 90, color: '#4fc08d' },
  { name: 'TypeScript', level: 85, color: '#3178c6' },
  { name: 'Node.js', level: 75, color: '#339933' },
  { name: 'React', level: 70, color: '#61dafb' },
])

const taskList = ref([
  { name: '需求分析', progress: 100 },
  { name: '界面设计', progress: 80 },
  { name: '后端开发', progress: 60 },
  { name: '前端开发', progress: 45 },
  { name: '测试验收', progress: 20 },
])

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    template: `<!-- 默认进度条 -->
<wd-progress :percentage="basicPercentage" />

<!-- 不显示进度文字 -->
<wd-progress :percentage="60" hide-text />`,

    script: `import { ref } from 'vue'

const basicPercentage = ref(30)`,
  },

  // 进度条状态代码
  status: {
    template: `<!-- 成功状态 -->
<wd-progress :percentage="100" hide-text status="success" />

<!-- 警告状态 -->
<wd-progress :percentage="80" hide-text status="warning" />

<!-- 危险状态 -->
<wd-progress :percentage="90" hide-text status="danger" />`,

    script: `// 状态类型定义
type ProgressStatus = 'success' | 'danger' | 'warning'

const successPercentage = ref(100)
const warningPercentage = ref(80)
const dangerPercentage = ref(90)`,
  },

  // 自定义颜色代码
  color: {
    singleTemplate: `<!-- 单一颜色 -->
<wd-progress :percentage="80" color="#00c740" />`,

    arrayTemplate: `<!-- 颜色数组 -->
<wd-progress :percentage="100" :color="colorArray" />`,

    objectTemplate: `<!-- 颜色对象配置 -->
<wd-progress :percentage="colorObjectPercentage" :color="colorObject" />`,

    script: `import type { ProgressColor } from '@/wd/components/wd-progress/wd-progress.vue'
import { ref } from 'vue'

// 颜色数组配置
const colorArray = ref(['#00c740', '#ffb300', '#e2231a', '#0083ff'])

// 颜色对象配置
const colorObject = ref<ProgressColor[]>([
  { color: 'yellow', percentage: 30 },
  { color: 'red', percentage: 60 },
  { color: 'blue', percentage: 80 },
  { color: 'black', percentage: 90 }
])

const colorObjectPercentage = ref(100)`,
  },

  // 动态进度代码
  dynamic: {
    template: `<template>
  <!-- 进度条显示 -->
  <wd-progress :percentage="dynamicPercentage" />

  <!-- 控制按钮 -->
  <view class="flex space-x-2 justify-center">
    <wd-button type="success" size="small" @click="handleAdd">
      <wd-text text="+10" />
    </wd-button>
    <wd-button type="error" size="small" @click="handleReduce">
      <wd-text text="-10" />
    </wd-button>
    <wd-button type="primary" size="small" @click="handleReset">
      <wd-text text="重置" />
    </wd-button>
  </view>
</template>`,

    script: `import { ref } from 'vue'

// 动态进度值
const dynamicPercentage = ref(50)

/**
 * 增加进度
 */
const handleAdd = () => {
  dynamicPercentage.value = Math.min(dynamicPercentage.value + 10, 100)
}

/**
 * 减少进度
 */
const handleReduce = () => {
  dynamicPercentage.value = Math.max(dynamicPercentage.value - 10, 0)
}

/**
 * 重置进度
 */
const handleReset = () => {
  dynamicPercentage.value = 50
}`,
  },

  // 动画配置代码
  animation: {
    template: `<!-- 默认速度 -->
<wd-progress :percentage="animationPercentage" />

<!-- 慢速动画 -->
<wd-progress :percentage="animationPercentage" :duration="60" />

<!-- 快速动画 -->
<wd-progress :percentage="animationPercentage" :duration="10" />`,

    script: `import { ref } from 'vue'

// 动画演示进度值
const animationPercentage = ref(0)

/**
 * 重新播放动画
 */
const handleAnimationDemo = () => {
  animationPercentage.value = 0
  setTimeout(() => {
    animationPercentage.value = 85
  }, 100)
}`,
  },

  // 应用场景代码
  scenarios: {
    uploadTemplate: `<!-- 文件上传进度 -->
<view class="mx-4 rounded-lg bg-gray-50 p-4">
  <view class="mb-2 text-xs text-gray-600">正在上传：document.pdf</view>
  <wd-progress
    :percentage="uploadProgress"
    color="#409eff"
  />
  <view class="mt-2 text-xs text-gray-500">
    {{ uploadProgress < 100 ? \`\${uploadProgress}% 上传中...\` : '上传完成' }}
  </view>
</view>`,

    skillTemplate: `<!-- 技能熟练度 -->
<view v-for="skill in skillList" :key="skill.name">
  <view class="flex justify-between mb-1">
    <view class="text-xs text-gray-600">{{ skill.name }}</view>
    <view class="text-xs text-gray-500">{{ skill.level }}%</view>
  </view>
  <wd-progress
    :percentage="skill.level"
    :color="skill.color"
    hide-text
  />
</view>`,

    taskTemplate: `<!-- 任务完成进度 -->
<view v-for="task in taskList" :key="task.name">
  <view class="flex justify-between mb-1">
    <view class="text-xs text-gray-600">{{ task.name }}</view>
    <view class="text-xs" :class="getTaskStatusClass(task.progress)">
      {{ getTaskStatusText(task.progress) }}
    </view>
  </view>
  <wd-progress
    :percentage="task.progress"
    :status="getTaskStatus(task.progress)"
    hide-text
  />
</view>`,

    script: `// 应用场景数据
const uploadProgress = ref(65)

const skillList = ref([
  { name: 'Vue.js', level: 90, color: '#4fc08d' },
  { name: 'TypeScript', level: 85, color: '#3178c6' },
  { name: 'Node.js', level: 75, color: '#339933' },
  { name: 'React', level: 70, color: '#61dafb' },
])

const taskList = ref([
  { name: '需求分析', progress: 100 },
  { name: '界面设计', progress: 80 },
  { name: '后端开发', progress: 60 },
  { name: '前端开发', progress: 45 },
  { name: '测试验收', progress: 20 },
])

/**
 * 获取任务状态
 */
const getTaskStatus = (progress: number): ProgressStatus | undefined => {
  if (progress === 100) return 'success'
  if (progress < 30) return 'danger'
  if (progress < 60) return 'warning'
  return undefined
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'percentage',
    type: 'Number',
    default: '0',
    desc: '进度数值，取值范围 0-100',
  },
  {
    name: 'hide-text',
    type: 'Boolean',
    default: 'false',
    desc: '是否隐藏进度条上的文字',
  },
  {
    name: 'color',
    type: 'String | Array<String> | Array<ProgressColor>',
    default: '""',
    desc: '进度条颜色，支持字符串、字符串数组或颜色配置数组',
  },
  {
    name: 'duration',
    type: 'Number',
    default: '30',
    desc: '进度增加1%所需毫秒数，控制动画速度',
  },
  {
    name: 'status',
    type: 'String',
    default: '""',
    desc: '进度条状态：success / warning / danger',
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

// Methods 方法文档（Progress 组件没有暴露方法）
const apiMethods: any[] = []

// Events 事件文档（Progress 组件没有事件）
const apiEvents: any[] = []

// ===== 事件处理方法 =====

/**
 * 增加进度
 */
const handleAdd = () => {
  dynamicPercentage.value = Math.min(dynamicPercentage.value + 10, 100)
  console.log(`进度增加到：${dynamicPercentage.value}%`)
}

/**
 * 减少进度
 */
const handleReduce = () => {
  dynamicPercentage.value = Math.max(dynamicPercentage.value - 10, 0)
  console.log(`进度减少到：${dynamicPercentage.value}%`)
}

/**
 * 重置进度
 */
const handleReset = () => {
  dynamicPercentage.value = 50
  console.log('进度已重置到50%')
}

/**
 * 重新播放动画
 */
const handleAnimationDemo = () => {
  animationPercentage.value = 0
  setTimeout(() => {
    animationPercentage.value = 85
  }, 100)
  console.log('重新播放动画演示')
}

// ===== 工具方法 =====

/**
 * 获取任务状态
 * @param progress 进度值
 * @returns 状态类型
 */
const getTaskStatus = (progress: number): ProgressStatus | undefined => {
  if (progress === 100) return 'success'
  if (progress < 30) return 'danger'
  if (progress < 60) return 'warning'
  return undefined
}

/**
 * 获取任务状态文本
 * @param progress 进度值
 * @returns 状态文本
 */
const getTaskStatusText = (progress: number): string => {
  if (progress === 100) return '已完成'
  if (progress < 30) return '待开始'
  if (progress < 60) return '进行中'
  return '即将完成'
}

/**
 * 获取任务状态样式类
 * @param progress 进度值
 * @returns CSS 样式类
 */
const getTaskStatusClass = (progress: number): string => {
  if (progress === 100) return 'text-green-600'
  if (progress < 30) return 'text-red-600'
  if (progress < 60) return 'text-orange-600'
  return 'text-blue-600'
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
