<!-- Backtop 回到顶部 http://127.0.0.1:100/#/pages-sub/demo/wd/backtop -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Backtop 回到顶部" show-back />

    <!-- 实时状态显示面板 -->
    <view class="fixed left-4 right-4 top-16 z-50 border border-blue-200 rounded-xl bg-blue-50 p-4 shadow-lg">
      <view class="mb-2 text-base text-blue-800 font-medium">📊 实时状态</view>
      <view class="text-sm text-blue-600 space-y-1">
        <view>当前滚动距离：{{ scrollTop }}px</view>
        <view>触发显示距离：{{ currentTop }}px</view>
        <view>按钮状态：{{ show ? '✅ 已显示' : '❌ 隐藏中' }}</view>
        <view>动画时长：{{ currentDuration }}ms</view>
      </view>
    </view>

    <!-- 占位空间，避免内容被固定面板遮挡 -->
    <view class="h-50" />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的回到顶部按钮，滚动页面后会自动显示">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="默认按钮" label="圆形，滚动300px后显示" />
        <wd-cell title="方形按钮" label="方形，滚动600px后显示" />
        <wd-cell title="自定义触发距离" label="滚动900px后显示" />
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 默认按钮" :code="codes.basic.defaultTemplate" />
        <DemoCode title="模板 - 方形按钮" :code="codes.basic.squareTemplate" />
        <DemoCode title="模板 - 自定义触发距离" :code="codes.basic.customTopTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 形状样式示例 -->
    <DemoSection title="形状样式" desc="支持圆形和方形两种形状">
      <view class="space-y-4">
        <!-- 形状选择器 -->
        <wd-cell-group>
          <wd-cell title="按钮形状">
            <wd-radio-group v-model="shapeValue" direction="horizontal">
              <wd-radio value="circle">圆形</wd-radio>
              <wd-radio value="square">方形</wd-radio>
            </wd-radio-group>
          </wd-cell>
        </wd-cell-group>

        <!-- 形状预览 -->
        <view class="mx-4 rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm font-medium">形状预览</view>
          <view class="flex justify-center gap-6">
            <!-- 圆形预览 -->
            <view class="flex flex-col items-center">
              <view class="h-20 w-20 flex items-center justify-center rounded-full bg-gray-200 shadow-md">
                <wd-icon name="backtop" />
              </view>
              <text class="mt-2 text-xs text-gray-500">圆形 (circle)</text>
            </view>
            <!-- 方形预览 -->
            <view class="flex flex-col items-center">
              <view class="h-20 w-20 flex items-center justify-center rounded-lg bg-gray-200 shadow-md">
                <wd-icon name="backtop" />
              </view>
              <text class="mt-2 text-xs text-gray-500">方形 (square)</text>
            </view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 圆形按钮" :code="codes.shape.circleTemplate" />
        <DemoCode title="模板 - 方形按钮" :code="codes.shape.squareTemplate" />
        <DemoCode title="脚本 - 形状配置" :code="codes.shape.script" />
      </template>
    </DemoSection>

    <!-- 自定义样式示例 -->
    <DemoSection title="自定义样式" desc="支持自定义颜色、图标和位置">
      <view class="space-y-4">
        <!-- 样式配置 -->
        <wd-cell-group>
          <wd-cell title="样式主题">
            <wd-radio-group v-model="styleTheme" direction="horizontal">
              <wd-radio value="default">默认</wd-radio>
              <wd-radio value="primary">主色</wd-radio>
              <wd-radio value="success">成功</wd-radio>
              <wd-radio value="warning">警告</wd-radio>
            </wd-radio-group>
          </wd-cell>

          <wd-cell title="图标类型">
            <wd-radio-group v-model="iconType" direction="horizontal">
              <wd-radio value="default">默认</wd-radio>
              <wd-radio value="text">文字</wd-radio>
              <wd-radio value="emoji">表情</wd-radio>
            </wd-radio-group>
          </wd-cell>

          <wd-cell title="自定义位置">
            <wd-checkbox v-model="customPosition" shape="square">
              使用左下角位置
            </wd-checkbox>
          </wd-cell>
        </wd-cell-group>

        <!-- 样式预览网格 -->
        <view class="mx-4 rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm font-medium">样式预览</view>
          <view class="grid grid-cols-2 gap-4">
            <!-- 主色调 -->
            <view class="flex flex-col items-center">
              <view class="h-16 w-16 flex items-center justify-center rounded-full bg-blue-500 shadow-md">
                <text class="text-sm text-white">TOP</text>
              </view>
              <text class="mt-1 text-xs text-gray-500">主色调</text>
            </view>
            <!-- 成功绿 -->
            <view class="flex flex-col items-center">
              <view class="h-16 w-16 flex items-center justify-center rounded-lg bg-green-500 shadow-md">
                <text class="text-white">⬆</text>
              </view>
              <text class="mt-1 text-xs text-gray-500">成功绿</text>
            </view>
            <!-- 警告橙 -->
            <view class="flex flex-col items-center">
              <view class="h-16 w-16 flex items-center justify-center rounded-full bg-orange-500 shadow-md">
                <text class="text-white">🚀</text>
              </view>
              <text class="mt-1 text-xs text-gray-500">警告橙</text>
            </view>
            <!-- 自定义位置 -->
            <view class="flex flex-col items-center">
              <view class="h-16 w-16 flex items-center justify-center rounded-lg bg-gray-500 shadow-md">
                <wd-icon name="backtop" color="white" />
              </view>
              <text class="mt-1 text-xs text-gray-500">自定义位置</text>
            </view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 自定义颜色" :code="codes.style.colorTemplate" />
        <DemoCode title="模板 - 自定义内容" :code="codes.style.contentTemplate" />
        <DemoCode title="模板 - 自定义位置" :code="codes.style.positionTemplate" />
        <DemoCode title="脚本 - 自定义样式" :code="codes.style.script" />
      </template>
    </DemoSection>

    <!-- 高级配置示例 -->
    <DemoSection title="高级配置" desc="触发距离、动画时长等高级配置选项">
      <view class="space-y-4">
        <!-- 配置选项 -->
        <wd-cell-group>
          <wd-cell title="触发距离">
            <wd-radio-group v-model="topValue" direction="horizontal">
              <wd-radio value="300">300px</wd-radio>
              <wd-radio value="600">600px</wd-radio>
              <wd-radio value="900">900px</wd-radio>
            </wd-radio-group>
          </wd-cell>

          <wd-cell title="动画时长">
            <wd-radio-group v-model="durationValue" direction="horizontal">
              <wd-radio value="100">快速</wd-radio>
              <wd-radio value="300">正常</wd-radio>
              <wd-radio value="1000">慢速</wd-radio>
            </wd-radio-group>
          </wd-cell>

          <wd-cell title="层级设置">
            <wd-radio-group v-model="zIndexValue" direction="horizontal">
              <wd-radio value="99">普通</wd-radio>
              <wd-radio value="999">高层级</wd-radio>
            </wd-radio-group>
          </wd-cell>
        </wd-cell-group>

        <!-- 配置说明 -->
        <view class="mx-4 rounded-lg bg-blue-50 p-4">
          <view class="mb-2 text-sm text-blue-800 font-medium">💡 配置说明</view>
          <view class="text-sm text-blue-600 space-y-1">
            <view>• 触发距离：页面滚动超过此距离后显示按钮</view>
            <view>• 动画时长：点击按钮后回到顶部的滚动时间</view>
            <view>• 层级设置：按钮的 z-index 值，影响显示层级</view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 触发距离配置" :code="codes.advanced.topTemplate" />
        <DemoCode title="模板 - 动画时长配置" :code="codes.advanced.durationTemplate" />
        <DemoCode title="模板 - 层级配置" :code="codes.advanced.zIndexTemplate" />
        <DemoCode title="脚本 - 高级配置" :code="codes.advanced.script" />
      </template>
    </DemoSection>

    <!-- 事件监听示例 -->
    <DemoSection title="事件监听" desc="监听点击事件和滚动状态变化">
      <!-- 事件日志显示 -->
      <view class="space-y-4">
        <!-- 操作按钮 -->
        <view class="mx-4">
          <wd-button block type="primary" @click="scrollToPosition(500)">
            滚动到 500px 位置
          </wd-button>
        </view>

        <!-- 事件日志 -->
        <view class="mx-4 rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm font-medium">📝 事件日志</view>
          <view class="h-32 overflow-y-auto border rounded bg-white p-2">
            <view
              v-for="(record, index) in operationRecords"
              :key="index"
              class="mb-1 text-xs text-gray-600"
            >
              <text class="text-gray-400">[{{ record.time }}]</text>
              {{ record.message }}
            </view>
            <view v-if="operationRecords.length === 0" class="py-4 text-center text-gray-400">
              暂无事件日志，滚动页面或点击按钮查看效果
            </view>
          </view>
          <view class="mt-2 flex gap-2">
            <wd-button size="small" @click="clearRecords">清空日志</wd-button>
            <wd-button size="small" type="text" @click="addTestRecord">添加测试记录</wd-button>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 事件监听" :code="codes.events.template" />
        <DemoCode title="脚本 - 事件处理" :code="codes.events.script" />
        <DemoCode title="脚本 - 滚动监听" :code="codes.events.scrollScript" />
      </template>
    </DemoSection>

    <!-- 实际应用场景 -->
    <DemoSection title="实际应用场景" desc="常见的业务场景和最佳实践">
      <!-- 长页面示例 -->
      <view class="space-y-4">
        <!-- 场景说明 -->
        <view class="mx-4 rounded-lg bg-green-50 p-4">
          <view class="mb-2 text-sm text-green-800 font-medium">🎯 应用场景</view>
          <view class="text-sm text-green-600 space-y-1">
            <view>• 长列表页面：商品列表、新闻列表、评论列表</view>
            <view>• 内容详情页：文章详情、商品详情、用户资料</view>
            <view>• 表单页面：长表单、多步骤表单</view>
            <view>• 数据展示页：图表页面、统计报表</view>
          </view>
        </view>

        <!-- 最佳实践 -->
        <view class="mx-4 rounded-lg bg-yellow-50 p-4">
          <view class="mb-2 text-sm text-yellow-800 font-medium">⭐ 最佳实践</view>
          <view class="text-sm text-yellow-600 space-y-1">
            <view>• 触发距离建议设置为 300-600px</view>
            <view>• 动画时长不宜过长，建议 100-300ms</view>
            <view>• 移动端建议使用圆形按钮，视觉更友好</view>
            <view>• 按钮位置避免遮挡重要内容或其他悬浮元素</view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 长列表场景" :code="codes.scenarios.listTemplate" />
        <DemoCode title="模板 - 详情页场景" :code="codes.scenarios.detailTemplate" />
        <DemoCode title="脚本 - 应用场景" :code="codes.scenarios.script" />
      </template>
    </DemoSection>

    <!-- 实际的回到顶部组件 - 默认图标版本 -->
    <wd-backtop
      v-if="iconType === 'default'"
      :scroll-top="scrollTop"
      :shape="shapeValue"
      :top="currentTop"
      :custom-style="currentCustomStyle"
      :duration="currentDuration"
      :z-index="currentZIndex"
      :bottom="customPosition ? 200 : 200"
      :right="customPosition ? 40 : 40"
      @click="handleBacktopClick"
    />

    <!-- 实际的回到顶部组件 - 自定义内容版本 -->
    <wd-backtop
      v-else
      :scroll-top="scrollTop"
      :shape="shapeValue"
      :top="currentTop"
      :custom-style="currentCustomStyle"
      :duration="currentDuration"
      :z-index="currentZIndex"
      :bottom="customPosition ? 200 : 200"
      :right="customPosition ? 40 : 40"
      @click="handleBacktopClick"
    >
      <text v-if="iconType === 'text'" :style="`color: ${getTextColor()}; font-weight: bold;`">TOP</text>
      <text v-else-if="iconType === 'emoji'" :style="`color: ${getTextColor()}; font-size: 18px;`">🚀</text>
    </wd-backtop>

    <!-- 底部说明 -->
    <view class="mx-4 mb-8 mt-6 rounded-xl from-blue-50 to-purple-50 bg-gradient-to-r p-6">
      <view class="text-center">
        <view class="mb-3 text-xl">🎉 恭喜！</view>
        <view class="mb-2 text-base font-medium">您已经到达页面底部</view>
        <view class="text-sm text-gray-600">现在可以使用右下角的回到顶部按钮返回页面顶部了</view>
        <view class="mt-3 text-xs text-gray-500">
          当前滚动距离：{{ scrollTop }}px
        </view>
      </view>
    </view>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import type { BacktopShape } from '@/wd/components/wd-backtop/wd-backtop.vue'
import { onPageScroll } from '@dcloudio/uni-app'
import { ref, computed } from 'vue'

// ===== 组件状态管理 =====

// 页面滚动距离
const scrollTop = ref<number>(0)

// 配置选项
const shapeValue = ref<BacktopShape>('circle')
const topValue = ref<string>('300')
const durationValue = ref<string>('300')
const zIndexValue = ref<string>('99')
const styleTheme = ref<string>('default')
const iconType = ref<string>('default')
const customPosition = ref<boolean>(false)

// 操作记录
interface OperationRecord {
  time: string
  message: string
}

const operationRecords = ref<OperationRecord[]>([])

// ===== 计算属性 =====

const currentTop = computed(() => Number.parseInt(topValue.value))
const currentDuration = computed(() => Number.parseInt(durationValue.value))
const currentZIndex = computed(() => Number.parseInt(zIndexValue.value))
const show = computed(() => scrollTop.value > currentTop.value)

// 样式相关计算属性
const currentCustomStyle = computed(() => {
  const themes = {
    default: '',
    primary: 'background: #007aff; color: white;',
    success: 'background: #28a745; color: white;',
    warning: 'background: #ffc107; color: #212529;',
  }
  return themes[styleTheme.value as keyof typeof themes]
})

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    defaultTemplate: `<wd-backtop :scroll-top="scrollTop" />`,

    squareTemplate: `<wd-backtop
  :scroll-top="scrollTop"
  shape="square"
  :top="600"
/>`,

    customTopTemplate: `<wd-backtop
  :scroll-top="scrollTop"
  :top="900"
  :duration="500"
/>`,

    script: `import { ref } from 'vue'
import { onPageScroll } from '@dcloudio/uni-app'

const scrollTop = ref(0)

// 监听页面滚动
onPageScroll((e) => {
  scrollTop.value = e.scrollTop
})`,
  },

  // 形状样式代码
  shape: {
    circleTemplate: `<wd-backtop
  :scroll-top="scrollTop"
  shape="circle"
  :top="300"
/>`,

    squareTemplate: `<wd-backtop
  :scroll-top="scrollTop"
  shape="square"
  :top="300"
/>`,

    script: `import type { BacktopShape } from '@/wd/components/wd-backtop/wd-backtop.vue'

const shapeValue = ref<BacktopShape>('circle')`,
  },

  // 自定义样式代码
  style: {
    colorTemplate: `<wd-backtop
  :scroll-top="scrollTop"
  custom-style="background: #007aff; color: white;"
  shape="circle"
/>`,

    contentTemplate: `<wd-backtop
  :scroll-top="scrollTop"
  shape="square"
  custom-style="background: #28a745; color: white;"
>
  <text style="color: white; font-weight: bold;">TOP</text>
</wd-backtop>`,

    positionTemplate: `<wd-backtop
  :scroll-top="scrollTop"
  :bottom="100"
  :right="100"
  shape="circle"
/>`,

    script: `const styleTheme = ref('default')
const customPosition = ref(false)

const currentCustomStyle = computed(() => {
  const themes = {
    default: '',
    primary: 'background: #007aff; color: white;',
    success: 'background: #28a745; color: white;',
    warning: 'background: #ffc107; color: #212529;',
  }
  return themes[styleTheme.value as keyof typeof themes]
})`,
  },

  // 高级配置代码
  advanced: {
    topTemplate: `<wd-backtop
  :scroll-top="scrollTop"
  :top="600"
  shape="circle"
/>`,

    durationTemplate: `<wd-backtop
  :scroll-top="scrollTop"
  :duration="1000"
  shape="square"
/>`,

    zIndexTemplate: `<wd-backtop
  :scroll-top="scrollTop"
  :z-index="999"
  shape="circle"
/>`,

    script: `const topValue = ref('300')
const durationValue = ref('300')
const zIndexValue = ref('99')

const currentTop = computed(() => Number.parseInt(topValue.value))
const currentDuration = computed(() => Number.parseInt(durationValue.value))
const currentZIndex = computed(() => Number.parseInt(zIndexValue.value))`,
  },

  // 事件监听代码
  events: {
    template: `<wd-backtop
  :scroll-top="scrollTop"
  :top="300"
  shape="circle"
  @click="handleBacktopClick"
/>`,

    script: `const operationRecords = ref([])

const handleBacktopClick = () => {
  const message = \`点击回到顶部按钮（从\${scrollTop.value}px滚动到顶部）\`
  addOperationRecord(message)
}

const addOperationRecord = (message) => {
  operationRecords.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
  })
}`,

    scrollScript: `import { onPageScroll } from '@dcloudio/uni-app'

onPageScroll((e) => {
  scrollTop.value = e.scrollTop

  // 记录滚动状态变化
  const shouldShow = e.scrollTop > currentTop.value
  if (shouldShow !== show.value) {
    const action = shouldShow ? '显示' : '隐藏'
    addOperationRecord(\`回到顶部按钮\${action}（滚动距离：\${e.scrollTop}px）\`)
  }
})`,
  },

  // 应用场景代码
  scenarios: {
    listTemplate: `<!-- 长列表页面 -->
<scroll-view scroll-y class="h-screen">
  <view v-for="item in listData" :key="item.id" class="p-4 border-b">
    {{ item.content }}
  </view>

  <wd-backtop
    :scroll-top="scrollTop"
    :top="300"
    shape="circle"
  />
</scroll-view>`,

    detailTemplate: `<!-- 详情页面 -->
<view class="detail-page">
  <view class="detail-header">{{ title }}</view>
  <view class="detail-content">{{ content }}</view>

  <wd-backtop
    :scroll-top="scrollTop"
    :top="500"
    shape="square"
    custom-style="background: #007aff; color: white;"
  >
    <text style="color: white;">TOP</text>
  </wd-backtop>
</view>`,

    script: `// 业务数据
const listData = ref([])
const title = ref('商品详情')
const content = ref('详细的商品描述内容...')

// 滚动监听
onPageScroll((e) => {
  scrollTop.value = e.scrollTop
})`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'scroll-top',
    type: 'Number',
    default: '0',
    desc: '页面当前滚动距离，必填，需要监听页面滚动事件获取',
  },
  {
    name: 'top',
    type: 'Number',
    default: '600',
    desc: '距离顶部多少距离时显示按钮，单位rpx',
  },
  {
    name: 'duration',
    type: 'Number',
    default: '100',
    desc: '返回顶部滚动时间，单位ms',
  },
  {
    name: 'z-index',
    type: 'Number',
    default: '99',
    desc: '按钮的层级',
  },
  {
    name: 'shape',
    type: 'String',
    default: '"circle"',
    desc: '按钮形状，可选值：circle / square',
  },
  {
    name: 'bottom',
    type: 'Number',
    default: '200',
    desc: '距离屏幕底部距离，单位rpx',
  },
  {
    name: 'right',
    type: 'Number',
    default: '40',
    desc: '距离屏幕右边距离，单位rpx',
  },
  {
    name: 'icon-style',
    type: 'String',
    default: '""',
    desc: '图标自定义样式',
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
    name: 'click',
    desc: '点击回到顶部按钮时触发',
  },
]

// ===== 工具方法 =====

/**
 * 添加操作记录
 */
const addOperationRecord = (message: string) => {
  operationRecords.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
  })
  // 限制记录数量
  if (operationRecords.value.length > 20) {
    operationRecords.value = operationRecords.value.slice(0, 20)
  }
}

/**
 * 清空操作记录
 */
const clearRecords = () => {
  operationRecords.value = []
  addOperationRecord('清空了操作记录')
}

/**
 * 添加测试记录
 */
const addTestRecord = () => {
  addOperationRecord('这是一条测试记录，用于演示日志功能')
}

/**
 * 获取文本颜色
 */
const getTextColor = (): string => {
  if (styleTheme.value === 'default') return '#333'
  if (styleTheme.value === 'warning') return '#212529'
  return 'white'
}

/**
 * 获取内容项样式类名
 */
const getContentItemClass = (index: number): string => {
  const classes = [
    'hover:bg-blue-50 hover:border-blue-300',
    'hover:bg-green-50 hover:border-green-300',
    'hover:bg-purple-50 hover:border-purple-300',
    'hover:bg-orange-50 hover:border-orange-300',
  ]
  return classes[index % classes.length]
}

/**
 * 滚动到指定位置
 */
const scrollToPosition = (position: number) => {
  uni.pageScrollTo({
    scrollTop: position,
    duration: 300,
  })
  addOperationRecord(`手动滚动到 ${position}px 位置`)
}

// ===== 事件处理方法 =====

/**
 * 处理回到顶部按钮点击事件
 */
const handleBacktopClick = () => {
  addOperationRecord(
    `点击回到顶部按钮（从${scrollTop.value}px滚动到顶部，耗时${currentDuration.value}ms）`,
  )
  console.log('点击了回到顶部按钮')
}

// ===== 生命周期 =====

/**
 * 监听页面滚动事件
 * 获取当前滚动距离并记录状态变化
 */
onPageScroll((e) => {
  const previousShow = show.value
  scrollTop.value = e.scrollTop

  // 记录滚动状态变化
  const currentShow = e.scrollTop > currentTop.value
  if (previousShow !== currentShow) {
    const action = currentShow ? '显示' : '隐藏'
    addOperationRecord(`回到顶部按钮${action}（滚动距离：${e.scrollTop}px）`)
  }
})
</script>

<style lang="scss" scoped>
// 页面样式可以在这里添加
</style>
