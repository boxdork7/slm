<!-- Loadmore 加载更多 http://127.0.0.1:100/#/pages-sub/demo/wd/loadmore -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Loadmore 加载更多" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="列表底部加载状态展示，支持加载中、错误、完成三种状态">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="加载中状态" vertical>
          <view class="p-4 text-center">
            <wd-loadmore state="loading" />
          </view>
        </wd-cell>

        <wd-cell title="错误状态" vertical>
          <view class="p-4 text-center">
            <wd-loadmore
              state="error"
              @reload="handleBasicReload"
            />
          </view>
        </wd-cell>

        <wd-cell title="完成状态" vertical>
          <view class="p-4 text-center">
            <wd-loadmore state="finished" />
          </view>
        </wd-cell>
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 加载中状态" :code="codes.basic.loadingTemplate" />
        <DemoCode title="模板 - 错误状态" :code="codes.basic.errorTemplate" />
        <DemoCode title="模板 - 完成状态" :code="codes.basic.finishedTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 自定义文案示例 -->
    <DemoSection title="自定义文案" desc="自定义不同状态下的提示文案">
      <wd-cell-group>
        <wd-cell title="自定义加载文案" vertical>
          <view class="p-4 text-center">
            <wd-loadmore
              state="loading"
              loading-text="正在努力加载中..."
            />
          </view>
        </wd-cell>

        <wd-cell title="自定义错误文案" vertical>
          <view class="p-4 text-center">
            <wd-loadmore
              state="error"
              error-text="哎呀，加载失败了"
              @reload="handleCustomReload"
            />
          </view>
        </wd-cell>

        <wd-cell title="自定义完成文案" vertical>
          <view class="p-4 text-center">
            <wd-loadmore
              state="finished"
              finished-text="没有更多内容了~"
            />
          </view>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 自定义文案" :code="codes.text.template" />
        <DemoCode title="脚本 - 自定义文案" :code="codes.text.script" />
      </template>
    </DemoSection>

    <!-- 加载动画配置示例 -->
    <DemoSection title="加载动画配置" desc="自定义加载动画的样式和属性">
      <wd-cell-group>
        <wd-cell title="自定义加载颜色" vertical>
          <view class="p-4 space-y-4">
            <view class="text-center">
              <wd-loadmore
                state="loading"
                :loading-props="{ color: '#fa2c19', size: 24 }"
                loading-text="红色加载中..."
              />
            </view>
            <view class="text-center">
              <wd-loadmore
                state="loading"
                :loading-props="{ color: '#07c160', size: 28 }"
                loading-text="绿色加载中..."
              />
            </view>
          </view>
        </wd-cell>

        <wd-cell title="自定义加载类型" vertical>
          <view class="p-4 space-y-4">
            <view class="text-center">
              <wd-loadmore
                state="loading"
                :loading-props="{ type: 'ring', color: '#1989fa' }"
                loading-text="环形加载动画"
              />
            </view>
            <view class="text-center">
              <wd-loadmore
                state="loading"
                :loading-props="{ type: 'outline', color: '#ff976a' }"
                loading-text="轮廓加载动画"
              />
            </view>
          </view>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 自定义颜色" :code="codes.loading.colorTemplate" />
        <DemoCode title="模板 - 自定义类型" :code="codes.loading.typeTemplate" />
        <DemoCode title="脚本 - 加载配置" :code="codes.loading.script" />
      </template>
    </DemoSection>

    <!-- 状态切换示例 -->
    <DemoSection title="状态切换" desc="动态演示不同状态之间的切换">
      <!-- 状态控制区域 -->
      <view class="space-y-4">
        <!-- 当前状态显示 -->
        <wd-cell-group>
          <wd-cell title="当前状态" vertical>
            <view class="p-4">
              <view class="mb-4 text-center">
                <wd-loadmore
                  :state="currentState"
                  loading-text="模拟加载中..."
                  error-text="模拟加载失败"
                  finished-text="模拟加载完成"
                  @reload="handleStateReload"
                />
              </view>

              <!-- 状态指示器 -->
              <view class="flex justify-center space-x-2">
                <view
                  v-for="state in stateOptions"
                  :key="state.value"
                  class="rounded-full px-3 py-1 text-xs" :class="[
                    currentState === state.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600',
                  ]"
                >
                  {{ state.label }}
                </view>
              </view>
            </view>
          </wd-cell>
        </wd-cell-group>

        <!-- 状态切换按钮 -->
        <wd-cell-group>
          <wd-cell title="状态控制" vertical>
            <view class="p-4 space-y-3">
              <wd-button
                :type="currentState === 'loading' ? 'primary' : 'default'"
                block
                @click="switchState('loading')"
              >
                切换到加载状态
              </wd-button>
              <wd-button
                :type="currentState === 'error' ? 'primary' : 'default'"
                block
                @click="switchState('error')"
              >
                切换到错误状态
              </wd-button>
              <wd-button
                :type="currentState === 'finished' ? 'primary' : 'default'"
                block
                @click="switchState('finished')"
              >
                切换到完成状态
              </wd-button>
            </view>
          </wd-cell>
        </wd-cell-group>
      </view>

      <template #codes>
        <DemoCode title="模板 - 状态切换" :code="codes.state.template" />
        <DemoCode title="脚本 - 状态管理" :code="codes.state.script" />
      </template>
    </DemoSection>

    <!-- 实际应用场景 -->
    <DemoSection title="实际应用场景" desc="模拟真实的列表加载更多场景">
      <!-- 模拟列表 -->
      <view class="space-y-4">
        <!-- 列表控制区域 -->
        <wd-cell-group>
          <wd-cell title="列表操作" vertical>
            <view class="p-4 space-y-3">
              <view class="text-sm text-gray-600">
                当前列表项：{{ simulationItems.length }} / {{ maxSimulationItems }}
              </view>
              <view class="flex space-x-2">
                <wd-button size="small" @click="resetSimulation">重置列表</wd-button>
                <wd-button size="small" @click="triggerError">模拟错误</wd-button>
                <wd-button size="small" @click="loadToFinish">加载到完成</wd-button>
              </view>
            </view>
          </wd-cell>
        </wd-cell-group>

        <!-- 模拟列表区域 -->
        <view class="mx-4 rounded-xl bg-white">
          <view class="px-4 pt-4 text-sm text-gray-700 font-medium">商品列表</view>

          <!-- 列表项 -->
          <view class="max-h-80 overflow-y-auto">
            <view
              v-for="item in simulationItems"
              :key="item.id"
              class="flex items-center border-b border-gray-100 p-4 last:border-b-0"
            >
              <image
                :src="item.image"
                class="mr-3 h-12 w-12 rounded bg-gray-200"
              />
              <view class="flex-1">
                <view class="text-sm font-medium">{{ item.name }}</view>
                <view class="text-xs text-gray-500">{{ item.desc }}</view>
              </view>
              <view class="text-sm text-red-500 font-medium">¥{{ item.price }}</view>
            </view>
          </view>

          <!-- 加载更多组件 -->
          <view class="p-2">
            <wd-loadmore
              :state="simulationState"
              loading-text="正在加载商品..."
              error-text="商品加载失败"
              finished-text="所有商品加载完成"
              @reload="handleSimulationReload"
            />
          </view>
        </view>

        <!-- 模拟加载日志 -->
        <view class="mx-4 rounded-lg bg-gray-50 p-4">
          <view class="mb-2 text-sm font-medium">加载日志</view>
          <view class="h-24 overflow-y-auto border rounded bg-white p-2">
            <view
              v-for="(log, index) in simulationLogs"
              :key="index"
              class="mb-1 text-xs"
              :class="getLogColor(log.type)"
            >
              <text class="text-gray-400">[{{ log.time }}]</text>
              {{ log.message }}
            </view>
            <view v-if="simulationLogs.length === 0" class="py-2 text-center text-gray-400">
              暂无日志
            </view>
          </view>
          <view class="mt-2">
            <wd-button size="small" @click="clearSimulationLogs">清空日志</wd-button>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 模拟列表" :code="codes.simulation.template" />
        <DemoCode title="脚本 - 列表逻辑" :code="codes.simulation.script" />
        <DemoCode title="模板 - 日志系统" :code="codes.simulation.logTemplate" />
        <DemoCode title="脚本 - 日志管理" :code="codes.simulation.logScript" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// ===== 组件状态管理 =====

// 状态选项
const stateOptions = ref([
  { label: '加载中', value: 'loading' },
  { label: '错误', value: 'error' },
  { label: '完成', value: 'finished' },
])

// 当前状态
const currentState = ref<'loading' | 'error' | 'finished'>('loading')

// 模拟列表数据
interface SimulationItem {
  id: number
  name: string
  desc: string
  price: number
  image: string
}

const simulationItems = ref<SimulationItem[]>([])
const simulationState = ref<'loading' | 'error' | 'finished'>('loading')
const maxSimulationItems = ref(30)

// 模拟日志系统
interface SimulationLog {
  time: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

const simulationLogs = ref<SimulationLog[]>([])

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    loadingTemplate: `<wd-loadmore state="loading" />`,

    errorTemplate: `<wd-loadmore
  state="error"
  @reload="handleReload"
/>`,

    finishedTemplate: `<wd-loadmore state="finished" />`,

    script: `import { ref } from 'vue'

// 加载状态管理
const loadState = ref<'loading' | 'error' | 'finished'>('loading')

const handleReload = () => {
  console.log('重新加载')
  loadState.value = 'loading'
  // 执行重新加载逻辑
}`,
  },

  // 自定义文案代码
  text: {
    template: `<wd-loadmore
  state="loading"
  loading-text="正在努力加载中..."
/>

<wd-loadmore
  state="error"
  error-text="哎呀，加载失败了"
  @reload="handleReload"
/>

<wd-loadmore
  state="finished"
  finished-text="没有更多内容了~"
/>`,

    script: `// 自定义文案配置
const textConfig = ref({
  loading: '正在努力加载中...',
  error: '哎呀，加载失败了',
  finished: '没有更多内容了~'
})`,
  },

  // 加载动画配置代码
  loading: {
    colorTemplate: `<wd-loadmore
  state="loading"
  :loading-props="{ color: '#fa2c19', size: 24 }"
  loading-text="红色加载中..."
/>

<wd-loadmore
  state="loading"
  :loading-props="{ color: '#07c160', size: 28 }"
  loading-text="绿色加载中..."
/>`,

    typeTemplate: `<wd-loadmore
  state="loading"
  :loading-props="{ type: 'ring', color: '#1989fa' }"
  loading-text="环形加载动画"
/>

<wd-loadmore
  state="loading"
  :loading-props="{ type: 'outline', color: '#ff976a' }"
  loading-text="轮廓加载动画"
/>`,

    script: `// 加载动画配置
const loadingConfig = ref({
  ring: { type: 'ring', color: '#1989fa', size: 24 },
  outline: { type: 'outline', color: '#ff976a', size: 24 }
})`,
  },

  // 状态切换代码
  state: {
    template: `<template>
  <wd-loadmore
    :state="currentState"
    loading-text="模拟加载中..."
    error-text="模拟加载失败"
    finished-text="模拟加载完成"
    @reload="handleStateReload"
  />

  <wd-button @click="switchState('loading')">
    切换到加载状态
  </wd-button>
  <wd-button @click="switchState('error')">
    切换到错误状态
  </wd-button>
  <wd-button @click="switchState('finished')">
    切换到完成状态
  </wd-button>
</template>`,

    script: `const currentState = ref<'loading' | 'error' | 'finished'>('loading')

const switchState = (state: 'loading' | 'error' | 'finished') => {
  currentState.value = state
  console.log('切换状态到：', state)
}

const handleStateReload = () => {
  currentState.value = 'loading'
  console.log('重新加载，状态重置为 loading')
}`,
  },

  // 应用场景代码
  simulation: {
    template: `<template>
  <!-- 列表项 -->
  <view
    v-for="item in simulationItems"
    :key="item.id"
    class="flex items-center border-b p-4"
  >
    <image :src="item.image" class="mr-3 h-12 w-12 rounded" />
    <view class="flex-1">
      <view class="text-sm font-medium">{{ item.name }}</view>
      <view class="text-xs text-gray-500">{{ item.desc }}</view>
    </view>
    <view class="text-sm font-medium text-red-500">¥{{ item.price }}</view>
  </view>

  <!-- 加载更多组件 -->
  <wd-loadmore
    :state="simulationState"
    loading-text="正在加载商品..."
    error-text="商品加载失败"
    finished-text="所有商品加载完成"
    @reload="handleSimulationReload"
  />
</template>`,

    script: `interface SimulationItem {
  id: number
  name: string
  desc: string
  price: number
  image: string
}

const simulationItems = ref<SimulationItem[]>([])
const simulationState = ref<'loading' | 'error' | 'finished'>('loading')
const maxSimulationItems = ref(30)

// 生成模拟数据
const generateItems = (count: number): SimulationItem[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: simulationItems.value.length + index + 1,
    name: \`商品 \${simulationItems.value.length + index + 1}\`,
    desc: '精选优质商品，品质保证',
    price: Math.floor(Math.random() * 500) + 50,
    image: 'https://via.placeholder.com/48x48'
  }))
}

// 模拟加载更多
const handleSimulationReload = () => {
  simulationState.value = 'loading'

  setTimeout(() => {
    const newItems = generateItems(5)
    simulationItems.value.push(...newItems)

    if (simulationItems.value.length >= maxSimulationItems.value) {
      simulationState.value = 'finished'
    } else {
      simulationState.value = 'loading'
    }
  }, 1000)
}`,

    logTemplate: `<view class="rounded-lg bg-gray-50 p-4">
  <view class="mb-2 text-sm font-medium">加载日志</view>
  <view class="h-24 overflow-y-auto rounded border bg-white p-2">
    <view
      v-for="(log, index) in simulationLogs"
      :key="index"
      class="mb-1 text-xs"
      :class="getLogColor(log.type)"
    >
      <text class="text-gray-400">[{{ log.time }}]</text>
      {{ log.message }}
    </view>
  </view>
  <wd-button size="small" @click="clearSimulationLogs">
    清空日志
  </wd-button>
</view>`,

    logScript: `interface SimulationLog {
  time: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

const simulationLogs = ref<SimulationLog[]>([])

const addSimulationLog = (message: string, type: SimulationLog['type'] = 'info') => {
  simulationLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
    type,
  })
  // 限制日志数量
  if (simulationLogs.value.length > 20) {
    simulationLogs.value = simulationLogs.value.slice(0, 20)
  }
}

const getLogColor = (type: SimulationLog['type']) => {
  const colors = {
    info: 'text-gray-600',
    success: 'text-green-600',
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
    name: 'state',
    type: 'String',
    default: '"loading"',
    desc: '加载状态，可选值：loading / error / finished',
  },
  {
    name: 'loading-text',
    type: 'String',
    default: '""',
    desc: '加载提示文案，为空时使用默认文案',
  },
  {
    name: 'error-text',
    type: 'String',
    default: '""',
    desc: '加载失败的提示文案，为空时使用默认文案',
  },
  {
    name: 'finished-text',
    type: 'String',
    default: '""',
    desc: '全部加载完的提示文案，为空时使用默认文案',
  },
  {
    name: 'loading-props',
    type: 'Object',
    default: '{}',
    desc: '加载中 loading 组件的属性，参考 loading 组件文档',
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

// Events 事件文档
const apiEvents = [
  {
    name: 'reload',
    desc: '点击重新加载时触发（仅在错误状态下可点击）',
  },
]

// ===== 工具方法 =====

/**
 * 生成模拟商品数据
 */
const generateItems = (count: number): SimulationItem[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: simulationItems.value.length + index + 1,
    name: `商品 ${simulationItems.value.length + index + 1}`,
    desc: '精选优质商品，品质保证',
    price: Math.floor(Math.random() * 500) + 50,
    image: 'https://img10.360buyimg.com/jmadvertisement/jfs/t1/70325/36/14954/36690/5dcd3e3bEee5006e0/aed1ccf6d5ffc764.png'
  }))
}

/**
 * 添加模拟日志
 */
const addSimulationLog = (message: string, type: SimulationLog['type'] = 'info') => {
  simulationLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
    type,
  })
  // 限制日志数量
  if (simulationLogs.value.length > 20) {
    simulationLogs.value = simulationLogs.value.slice(0, 20)
  }
}

/**
 * 获取日志颜色类名
 */
const getLogColor = (type: SimulationLog['type']) => {
  const colors = {
    info: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-orange-600',
    error: 'text-red-600',
  }
  return colors[type]
}

/**
 * 清空模拟日志
 */
const clearSimulationLogs = () => {
  simulationLogs.value = []
  addSimulationLog('日志已清空', 'info')
}

// ===== 事件处理方法 =====

/**
 * 处理基本重载事件
 */
const handleBasicReload = () => {
  console.log('基本重载事件触发')
}

/**
 * 处理自定义重载事件
 */
const handleCustomReload = () => {
  console.log('自定义重载事件触发')
}

/**
 * 切换状态
 */
const switchState = (state: 'loading' | 'error' | 'finished') => {
  currentState.value = state
  console.log('切换状态到：', state)
}

/**
 * 处理状态重载事件
 */
const handleStateReload = () => {
  currentState.value = 'loading'
  console.log('重新加载，状态重置为 loading')

  // 模拟加载过程
  setTimeout(() => {
    currentState.value = 'finished'
    console.log('模拟加载完成')
  }, 2000)
}

/**
 * 重置模拟列表
 */
const resetSimulation = () => {
  simulationItems.value = []
  simulationState.value = 'loading'
  addSimulationLog('列表已重置', 'info')

  // 初始加载一些数据
  setTimeout(() => {
    const newItems = generateItems(5)
    simulationItems.value.push(...newItems)
    addSimulationLog(`加载了 ${newItems.length} 个商品`, 'success')
  }, 500)
}

/**
 * 触发错误状态
 */
const triggerError = () => {
  simulationState.value = 'error'
  addSimulationLog('模拟加载错误', 'error')
}

/**
 * 加载到完成状态
 */
const loadToFinish = () => {
  simulationState.value = 'loading'
  addSimulationLog('开始加载到完成状态', 'info')

  setTimeout(() => {
    // 填充到最大数量
    const remainingCount = maxSimulationItems.value - simulationItems.value.length
    if (remainingCount > 0) {
      const newItems = generateItems(remainingCount)
      simulationItems.value.push(...newItems)
      addSimulationLog(`加载了 ${newItems.length} 个商品`, 'success')
    }
    simulationState.value = 'finished'
    addSimulationLog('所有商品加载完成', 'success')
  }, 1000)
}

/**
 * 处理模拟重载事件
 */
const handleSimulationReload = () => {
  simulationState.value = 'loading'
  addSimulationLog('开始重新加载', 'info')

  setTimeout(() => {
    const newItems = generateItems(5)
    simulationItems.value.push(...newItems)
    addSimulationLog(`加载了 ${newItems.length} 个商品`, 'success')

    if (simulationItems.value.length >= maxSimulationItems.value) {
      simulationState.value = 'finished'
      addSimulationLog('所有商品加载完成', 'success')
    } else {
      simulationState.value = 'loading'
    }
  }, 1000)
}

// ===== 初始化 =====

// 初始化模拟数据
const initSimulation = () => {
  const initialItems = generateItems(5)
  simulationItems.value = initialItems
  addSimulationLog(`初始化加载了 ${initialItems.length} 个商品`, 'success')
}

// 页面加载时初始化
initSimulation()

const { resetScrollTop, updateScrollTop } = useScroll()
onShow(() => {
  resetScrollTop()
})
onPageScroll((e) => {
  updateScrollTop(e.scrollTop)
})
</script>
