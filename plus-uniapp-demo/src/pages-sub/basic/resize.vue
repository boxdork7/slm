<!-- Resize 尺寸监听 http://127.0.0.1:100/#/pages-sub/demo/wd/resize -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Resize 尺寸监听" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="监听元素尺寸变化，实时获取容器的位置和尺寸信息">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <!-- 监听区域 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">被监听的容器</view>
          <wd-resize @resize="handleBasicResize">
            <view
              :style="`
                background: linear-gradient(45deg, #4d80f0, #6c5ce7);
                width: ${basicWidth};
                height: ${basicHeight};
                transition: all 0.3s ease;
                border-radius: 8px;
              `"
            />
          </wd-resize>
        </view>

        <!-- 控制按钮 -->
        <view class="px-4">
          <wd-grid clickable border>
            <wd-grid-item text="小尺寸" icon="minus" @itemclick="setBasicSize('100px', '60px')" />
            <wd-grid-item text="中尺寸" icon="add" @itemclick="setBasicSize('200px', '120px')" />
            <wd-grid-item
              text="大尺寸"
              icon="fullscreen"
              @itemclick="setBasicSize('300px', '180px')"
            />
          </wd-grid>
        </view>

        <!-- 尺寸信息展示 -->
        <view class="mx-4 rounded-lg bg-blue-50 p-4">
          <view class="mb-2 text-sm text-blue-700 font-medium">实时尺寸信息</view>
          <view class="grid grid-cols-2 gap-2 text-xs">
            <view class="flex items-center">
              <text class="w-12 text-gray-500">宽度:</text>
              <text class="text-blue-600 font-mono">{{ basicInfo.width || '---' }}</text>
            </view>
            <view class="flex items-center">
              <text class="w-12 text-gray-500">高度:</text>
              <text class="text-blue-600 font-mono">{{ basicInfo.height || '---' }}</text>
            </view>
            <view class="flex items-center">
              <text class="w-12 text-gray-500">顶部:</text>
              <text class="text-blue-600 font-mono">{{ basicInfo.top || '---' }}</text>
            </view>
            <view class="flex items-center">
              <text class="w-12 text-gray-500">左侧:</text>
              <text class="text-blue-600 font-mono">{{ basicInfo.left || '---' }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基本用法" :code="codes.basic.template" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 动态内容监听示例 -->
    <DemoSection
      title="动态内容监听"
      desc="监听内容变化导致的尺寸变化，常用于文本、列表内容的动态更新"
    >
      <view class="space-y-4">
        <!-- 动态内容容器 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">动态内容区域</view>
          <wd-resize @resize="handleDynamicResize">
            <view class="rounded bg-white p-3 shadow-sm">
              <view class="mb-2 text-sm text-gray-800 font-medium">{{ dynamicTitle }}</view>
              <view class="text-xs text-gray-600 leading-relaxed">
                {{ dynamicContent }}
              </view>
              <view v-if="showExtra" class="mt-2 rounded bg-yellow-50 p-2">
                <view class="text-xs text-yellow-700">
                  这是额外添加的内容，会导致容器尺寸发生变化。
                </view>
              </view>
            </view>
          </wd-resize>
        </view>

        <!-- 内容控制按钮 -->
        <view class="px-4">
          <view class="grid grid-cols-2 gap-3">
            <wd-button size="small" @click="toggleContent">
              {{ showExtra ? '移除' : '添加' }}内容
            </wd-button>
            <wd-button size="small" type="primary" @click="changeContent">更换文本</wd-button>
          </view>
        </view>

        <!-- 变化统计 -->
        <view class="mx-4 rounded-lg bg-green-50 p-4">
          <view class="mb-2 text-sm text-green-700 font-medium">变化统计</view>
          <view class="text-xs text-green-600">
            <view>检测次数: {{ dynamicChangeCount }}</view>
            <view>当前尺寸: {{ dynamicInfo.width }} × {{ dynamicInfo.height }}</view>
            <view>最后更新: {{ lastUpdateTime }}</view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 动态内容监听" :code="codes.dynamic.template" />
        <DemoCode title="脚本 - 动态内容监听" :code="codes.dynamic.script" />
      </template>
    </DemoSection>

    <!-- 复杂布局监听示例 -->
    <DemoSection
      title="复杂布局监听"
      desc="监听复杂布局结构的尺寸变化，适用于动态布局和响应式设计"
    >
      <view class="space-y-4">
        <!-- 复杂布局容器 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">响应式布局</view>
          <wd-resize @resize="handleComplexResize">
            <view class="rounded bg-white p-3 shadow-sm">
              <!-- 标题栏 -->
              <view class="mb-3 flex items-center justify-between border-b pb-2">
                <view class="text-sm font-medium">布局示例</view>
                <view class="text-xs text-gray-500">{{ complexLayoutType }}</view>
              </view>

              <!-- 动态布局内容 -->
              <view v-if="complexLayoutType === '单列'" class="space-y-2">
                <view v-for="n in itemCount" :key="n" class="rounded bg-blue-50 p-2">
                  <view class="text-xs">项目 {{ n }}</view>
                </view>
              </view>

              <view v-else class="grid grid-cols-2 gap-2">
                <view v-for="n in itemCount" :key="n" class="rounded bg-purple-50 p-2">
                  <view class="text-xs">项目 {{ n }}</view>
                </view>
              </view>
            </view>
          </wd-resize>
        </view>

        <!-- 布局控制 -->
        <view class="px-4 space-y-3">
          <view class="grid grid-cols-2 gap-3">
            <wd-button size="small" @click="toggleLayout">切换布局</wd-button>
            <wd-button size="small" type="primary" @click="changeItemCount">
              {{ itemCount >= 6 ? '减少' : '增加' }}项目
            </wd-button>
          </view>
        </view>

        <!-- 布局信息 -->
        <view class="mx-4 rounded-lg bg-purple-50 p-4">
          <view class="mb-2 text-sm text-purple-700 font-medium">布局信息</view>
          <view class="text-xs text-purple-600 space-y-1">
            <view>布局类型: {{ complexLayoutType }}</view>
            <view>项目数量: {{ itemCount }}</view>
            <view>容器尺寸: {{ complexInfo.width }} × {{ complexInfo.height }}</view>
            <view>位置信息: top({{ complexInfo.top }}) left({{ complexInfo.left }})</view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 复杂布局监听" :code="codes.complex.template" />
        <DemoCode title="脚本 - 复杂布局监听" :code="codes.complex.script" />
      </template>
    </DemoSection>

    <!-- 事件监听示例 -->
    <DemoSection title="事件监听" desc="完整的尺寸变化事件处理，包含详细的变化日志">
      <view class="space-y-4">
        <!-- 监听目标 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">监听目标</view>
          <wd-resize @resize="handleEventResize">
            <view
              :style="`
                background: ${eventBgColor};
                width: ${eventWidth};
                height: ${eventHeight};
                transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 14px;
                font-weight: 500;
              `"
            >
              {{ eventWidth }} × {{ eventHeight }}
            </view>
          </wd-resize>
        </view>

        <!-- 控制面板 -->
        <view class="px-4">
          <wd-grid clickable border>
            <wd-grid-item text="随机尺寸" icon="refresh" @itemclick="randomEventSize" />
            <wd-grid-item text="随机颜色" icon="palette" @itemclick="randomEventColor" />
            <wd-grid-item text="清空日志" icon="delete" @itemclick="clearEventLogs" />
          </wd-grid>
        </view>

        <!-- 事件日志 -->
        <view class="mx-4 rounded-lg bg-gray-50 p-4">
          <view class="mb-3 flex items-center justify-between">
            <view class="text-sm text-gray-700 font-medium">事件日志</view>
            <view class="text-xs text-gray-500">共 {{ eventLogs.length }} 条</view>
          </view>
          <view class="h-40 overflow-y-auto border rounded bg-white p-2">
            <view
              v-for="(log, index) in eventLogs"
              :key="index"
              class="mb-2 rounded bg-gray-50 p-2 text-xs"
            >
              <view class="mb-1 text-blue-600 font-mono">{{ log.time }}</view>
              <view class="text-gray-700">{{ log.message }}</view>
              <view class="mt-1 text-gray-500">{{ log.detail }}</view>
            </view>
            <view v-if="eventLogs.length === 0" class="py-8 text-center text-gray-400">
              暂无事件日志
            </view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 事件监听" :code="codes.events.template" />
        <DemoCode title="脚本 - 事件监听" :code="codes.events.script" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { onReady } from '@dcloudio/uni-app'
import { ref } from 'vue'

// ===== 基本用法状态管理 =====

// 基本示例的尺寸控制
const basicWidth = ref<string>('150px')
const basicHeight = ref<string>('100px')

// 基本示例的尺寸信息
const basicInfo = ref<Record<string, any>>({})

// ===== 动态内容状态管理 =====

// 动态内容控制
const showExtra = ref<boolean>(false)
const dynamicTitle = ref<string>('动态内容标题')
const dynamicContent = ref<string>(
  '这是一段动态内容，可以通过按钮控制内容的增减，观察容器尺寸的变化。',
)

// 动态内容统计
const dynamicChangeCount = ref<number>(0)
const dynamicInfo = ref<Record<string, any>>({})
const lastUpdateTime = ref<string>('')

// 预设内容数组
const contentOptions = [
  {
    title: '短内容示例',
    content: '这是一段简短的内容。',
  },
  {
    title: '中等内容示例',
    content: '这是一段中等长度的内容，包含更多的文字描述，用于测试容器尺寸的变化情况。',
  },
  {
    title: '长内容示例',
    content:
      '这是一段很长的内容，包含了大量的文字描述和详细信息。通过这样的长文本，我们可以观察到容器在内容变化时是如何调整其尺寸的，这对于动态布局来说是非常重要的功能特性。',
  },
]

let currentContentIndex = 0

// ===== 复杂布局状态管理 =====

// 复杂布局控制
const complexLayoutType = ref<string>('单列')
const itemCount = ref<number>(3)
const complexInfo = ref<Record<string, any>>({})

// ===== 事件监听状态管理 =====

// 事件示例的样式控制
const eventWidth = ref<string>('200px')
const eventHeight = ref<string>('120px')
const eventBgColor = ref<string>('#4d80f0')

// 事件日志
interface EventLog {
  time: string
  message: string
  detail: string
}

const eventLogs = ref<EventLog[]>([])

// 颜色预设
const colorOptions = ['#4d80f0', '#6c5ce7', '#fd79a8', '#fdcb6e', '#6c5ce7', '#00b894', '#e84393']

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    template: `<wd-resize @resize="handleBasicResize">
  <view
    :style="\`
      background: linear-gradient(45deg, #4d80f0, #6c5ce7);
      width: \${basicWidth};
      height: \${basicHeight};
      transition: all 0.3s ease;
      border-radius: 8px;
    \`"
  />
</wd-resize>

<!-- 控制按钮 -->
<wd-grid clickable border>
  <wd-grid-item text="小尺寸" icon="minus" @itemclick="setBasicSize('100px', '60px')" />
  <wd-grid-item text="中尺寸" icon="add" @itemclick="setBasicSize('200px', '120px')" />
  <wd-grid-item text="大尺寸" icon="fullscreen" @itemclick="setBasicSize('300px', '180px')" />
</wd-grid>`,

    script: `import { ref } from 'vue'

// 基本示例的尺寸控制
const basicWidth = ref('150px')
const basicHeight = ref('100px')
const basicInfo = ref({})

/**
 * 设置基本示例尺寸
 */
const setBasicSize = (width: string, height: string) => {
  basicWidth.value = width
  basicHeight.value = height
}

/**
 * 处理基本示例尺寸变化
 */
const handleBasicResize = (detail: Record<string, any>) => {
  basicInfo.value = detail
  console.log('基本尺寸变化:', detail)
}`,
  },

  // 动态内容代码
  dynamic: {
    template: `<wd-resize @resize="handleDynamicResize">
  <view class="rounded bg-white p-3 shadow-sm">
    <view class="mb-2 text-sm font-medium text-gray-800">{{ dynamicTitle }}</view>
    <view class="text-xs text-gray-600 leading-relaxed">
      {{ dynamicContent }}
    </view>
    <view v-if="showExtra" class="mt-2 rounded bg-yellow-50 p-2">
      <view class="text-xs text-yellow-700">
        这是额外添加的内容，会导致容器尺寸发生变化。
      </view>
    </view>
  </view>
</wd-resize>

<!-- 内容控制按钮 -->
<wd-button @click="toggleContent" size="small">
  {{ showExtra ? '移除' : '添加' }}内容
</wd-button>
<wd-button @click="changeContent" size="small" type="primary">
  更换文本
</wd-button>`,

    script: `// 动态内容控制
const showExtra = ref(false)
const dynamicTitle = ref('动态内容标题')
const dynamicContent = ref('这是一段动态内容...')
const dynamicChangeCount = ref(0)
const dynamicInfo = ref({})
const lastUpdateTime = ref('')

// 预设内容数组
const contentOptions = [
  {
    title: '短内容示例',
    content: '这是一段简短的内容。'
  },
  {
    title: '中等内容示例',
    content: '这是一段中等长度的内容...'
  }
]

/**
 * 切换额外内容显示
 */
const toggleContent = () => {
  showExtra.value = !showExtra.value
}

/**
 * 更换内容
 */
const changeContent = () => {
  const option = contentOptions[currentContentIndex % contentOptions.length]
  dynamicTitle.value = option.title
  dynamicContent.value = option.content
  currentContentIndex++
}

/**
 * 处理动态内容尺寸变化
 */
const handleDynamicResize = (detail: Record<string, any>) => {
  dynamicChangeCount.value++
  dynamicInfo.value = detail
  lastUpdateTime.value = new Date().toLocaleTimeString()
}`,
  },

  // 复杂布局代码
  complex: {
    template: `<wd-resize @resize="handleComplexResize">
  <view class="rounded bg-white p-3 shadow-sm">
    <!-- 标题栏 -->
    <view class="mb-3 flex items-center justify-between border-b pb-2">
      <view class="text-sm font-medium">布局示例</view>
      <view class="text-xs text-gray-500">{{ complexLayoutType }}</view>
    </view>

    <!-- 动态布局内容 -->
    <view v-if="complexLayoutType === '单列'" class="space-y-2">
      <view v-for="n in itemCount" :key="n" class="rounded bg-blue-50 p-2">
        <view class="text-xs">项目 {{ n }}</view>
      </view>
    </view>

    <view v-else class="grid grid-cols-2 gap-2">
      <view v-for="n in itemCount" :key="n" class="rounded bg-purple-50 p-2">
        <view class="text-xs">项目 {{ n }}</view>
      </view>
    </view>
  </view>
</wd-resize>`,

    script: `// 复杂布局控制
const complexLayoutType = ref('单列')
const itemCount = ref(3)
const complexInfo = ref({})

/**
 * 切换布局类型
 */
const toggleLayout = () => {
  complexLayoutType.value = complexLayoutType.value === '单列' ? '双列' : '单列'
}

/**
 * 改变项目数量
 */
const changeItemCount = () => {
  itemCount.value = itemCount.value >= 6 ? 2 : itemCount.value + 2
}

/**
 * 处理复杂布局尺寸变化
 */
const handleComplexResize = (detail: Record<string, any>) => {
  complexInfo.value = detail
}`,
  },

  // 事件监听代码
  events: {
    template: `<wd-resize @resize="handleEventResize">
  <view
    :style="\`
      background: \${eventBgColor};
      width: \${eventWidth};
      height: \${eventHeight};
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 14px;
      font-weight: 500;
    \`"
  >
    {{ eventWidth }} × {{ eventHeight }}
  </view>
</wd-resize>

<!-- 控制面板 -->
<wd-grid clickable border>
  <wd-grid-item text="随机尺寸" icon="refresh" @itemclick="randomEventSize" />
  <wd-grid-item text="随机颜色" icon="palette" @itemclick="randomEventColor" />
  <wd-grid-item text="清空日志" icon="delete" @itemclick="clearEventLogs" />
</wd-grid>`,

    script: `// 事件示例状态
const eventWidth = ref('200px')
const eventHeight = ref('120px')
const eventBgColor = ref('#4d80f0')
const eventLogs = ref([])

// 颜色预设
const colorOptions = ['#4d80f0', '#6c5ce7', '#fd79a8', '#fdcb6e', '#00b894']

/**
 * 随机生成尺寸
 */
const randomEventSize = () => {
  const width = Math.floor(Math.random() * 200) + 100
  const height = Math.floor(Math.random() * 150) + 80
  eventWidth.value = width + 'px'
  eventHeight.value = height + 'px'
}

/**
 * 随机生成颜色
 */
const randomEventColor = () => {
  const randomIndex = Math.floor(Math.random() * colorOptions.length)
  eventBgColor.value = colorOptions[randomIndex]
}

/**
 * 处理事件监听尺寸变化
 */
const handleEventResize = (detail: Record<string, any>) => {
  const log = {
    time: new Date().toLocaleTimeString(),
    message: '尺寸发生变化',
    detail: \`宽度: \${detail.width}, 高度: \${detail.height}\`
  }
  eventLogs.value.unshift(log)

  // 限制日志数量
  if (eventLogs.value.length > 20) {
    eventLogs.value = eventLogs.value.slice(0, 20)
  }
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
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
    name: 'custom-container-class',
    type: 'String',
    default: '""',
    desc: '自定义容器样式类',
  },
]

// Events 事件文档
const apiEvents = [
  {
    name: 'resize',
    desc: '尺寸变化时触发，参数为包含 width、height、top、left、right、bottom 的对象',
  },
]

// ===== 工具方法 =====

/**
 * 添加事件日志
 */
const addEventLog = (message: string, detail: string) => {
  const log: EventLog = {
    time: new Date().toLocaleTimeString(),
    message,
    detail,
  }
  eventLogs.value.unshift(log)

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
  addEventLog('日志已清空', '用户手动清空了所有事件日志')
}

// ===== 基本用法方法 =====

/**
 * 设置基本示例尺寸
 */
const setBasicSize = (width: string, height: string) => {
  basicWidth.value = width
  basicHeight.value = height
  console.log(`设置基本尺寸: ${width} × ${height}`)
}

/**
 * 处理基本示例尺寸变化事件
 */
const handleBasicResize = (detail: Record<string, any>) => {
  basicInfo.value = detail
  console.log('基本尺寸变化:', detail)
}

// ===== 动态内容方法 =====

/**
 * 切换额外内容显示
 */
const toggleContent = () => {
  showExtra.value = !showExtra.value
  console.log(`${showExtra.value ? '添加' : '移除'}额外内容`)
}

/**
 * 更换内容
 */
const changeContent = () => {
  const option = contentOptions[currentContentIndex % contentOptions.length]
  dynamicTitle.value = option.title
  dynamicContent.value = option.content
  currentContentIndex++
  console.log(`更换内容: ${option.title}`)
}

/**
 * 处理动态内容尺寸变化事件
 */
const handleDynamicResize = (detail: Record<string, any>) => {
  dynamicChangeCount.value++
  dynamicInfo.value = detail
  lastUpdateTime.value = new Date().toLocaleTimeString()
  console.log(`动态内容变化 (第${dynamicChangeCount.value}次):`, detail)
}

// ===== 复杂布局方法 =====

/**
 * 切换布局类型
 */
const toggleLayout = () => {
  complexLayoutType.value = complexLayoutType.value === '单列' ? '双列' : '单列'
  console.log(`切换到${complexLayoutType.value}布局`)
}

/**
 * 改变项目数量
 */
const changeItemCount = () => {
  const oldCount = itemCount.value
  itemCount.value = itemCount.value >= 6 ? 2 : itemCount.value + 2
  console.log(`项目数量: ${oldCount} → ${itemCount.value}`)
}

/**
 * 处理复杂布局尺寸变化事件
 */
const handleComplexResize = (detail: Record<string, any>) => {
  complexInfo.value = detail
  console.log('复杂布局变化:', detail)
}

// ===== 事件监听方法 =====

/**
 * 随机生成尺寸
 */
const randomEventSize = () => {
  const width = Math.floor(Math.random() * 200) + 100
  const height = Math.floor(Math.random() * 150) + 80
  eventWidth.value = `${width}px`
  eventHeight.value = `${height}px`
  console.log(`随机尺寸: ${width}px × ${height}px`)
}

/**
 * 随机生成颜色
 */
const randomEventColor = () => {
  const randomIndex = Math.floor(Math.random() * colorOptions.length)
  eventBgColor.value = colorOptions[randomIndex]
  console.log(`随机颜色: ${eventBgColor.value}`)
}

/**
 * 处理事件监听尺寸变化
 */
const handleEventResize = (detail: Record<string, any>) => {
  const message = '检测到尺寸变化'
  const detailText = `宽度: ${detail.width}, 高度: ${detail.height}, 位置: (${detail.left}, ${detail.top})`

  addEventLog(message, detailText)
  console.log('事件监听尺寸变化:', detail)
}

// ===== 页面生命周期 =====

/**
 * 页面准备完成后初始化
 */
onReady(() => {
  // 延迟设置初始尺寸，触发第一次 resize 事件
  setTimeout(() => {
    console.log('页面初始化完成，开始设置初始尺寸')
  }, 100)
})
const { resetScrollTop, updateScrollTop } = useScroll()
onShow(() => {
  resetScrollTop()
})
onPageScroll((e) => {
  updateScrollTop(e.scrollTop)
})
</script>
