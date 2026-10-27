<!-- NoticeBar 通知栏 http://127.0.0.1:100/#/pages-sub/demo/wd/noticeBar -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="NoticeBar 通知栏" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的通知栏形式，显示文本和图标">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="基础通知" vertical>
          <wd-notice-bar
            text="这是一条消息提示信息这是一条消息提示信息这是一条消息提示信息"
            prefix="warn-bold"
          />
        </wd-cell>

        <wd-cell title="可关闭通知" vertical>
          <wd-notice-bar text="这是一条可关闭的消息提示信息" prefix="warn-bold" closable />
        </wd-cell>

        <wd-cell title="禁止滚动" vertical>
          <wd-notice-bar
            :scrollable="false"
            text="欲买桂花同载酒，终不似，少年游"
            prefix="warn-bold"
          />
        </wd-cell>
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基础通知" :code="codes.basic.basicTemplate" />
        <DemoCode title="模板 - 可关闭通知" :code="codes.basic.closableTemplate" />
        <DemoCode title="模板 - 禁止滚动" :code="codes.basic.noScrollTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 类型样式示例 -->
    <DemoSection title="类型样式" desc="不同类型的通知栏，支持警告、信息、危险三种类型">
      <wd-cell-group>
        <wd-cell title="警告类型" vertical>
          <wd-notice-bar type="warning" text="这是一条警告消息提示信息" prefix="warn-bold" />
        </wd-cell>

        <wd-cell title="信息类型" vertical>
          <wd-notice-bar
            type="info"
            text="点击查看信息详情点击查看信息详情点击查看信息详情"
            prefix="check-outline"
          />
        </wd-cell>

        <wd-cell title="危险类型" vertical>
          <wd-notice-bar
            type="danger"
            text="当前网络不可用，请检查你的网络设置"
            prefix="wifi-error"
          />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 类型样式" :code="codes.types.template" />
        <DemoCode title="脚本 - 类型样式" :code="codes.types.script" />
      </template>
    </DemoSection>

    <!-- 自定义样式示例 -->
    <DemoSection title="自定义样式" desc="自定义颜色、背景色和多行显示">
      <wd-cell-group>
        <wd-cell title="自定义颜色" vertical>
          <wd-notice-bar
            text="这是一条自定义颜色的消息提示信息"
            prefix="check-outline"
            color="#34D19D"
            background-color="#f0f9eb"
          />
        </wd-cell>

        <wd-cell title="多行展示" vertical>
          <wd-notice-bar
            text="这是一条消息提示信息这是一条消息提示信息这是一条消息提示信息这是一条消息提示信息这是一条消息提示信息这是一条消息提示信息"
            wrapable
            :scrollable="false"
            prefix="warn-bold"
          />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 自定义颜色" :code="codes.custom.colorTemplate" />
        <DemoCode title="模板 - 多行展示" :code="codes.custom.wrapTemplate" />
        <DemoCode title="脚本 - 自定义样式" :code="codes.custom.script" />
      </template>
    </DemoSection>

    <!-- 插槽使用示例 -->
    <DemoSection title="插槽使用" desc="通过插槽自定义前缀和后缀内容">
      <wd-cell-group>
        <wd-cell title="自定义插槽" vertical>
          <wd-notice-bar :scrollable="false">
            <template #prefix>
              <wd-icon name="warn-bold" color="#ff6b35" />
            </template>
            通知被禁或时段内消息屏蔽可能造成消息无法及时送达
            <template #suffix>
              <view class="text-blue-500">查看</view>
            </template>
          </wd-notice-bar>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 插槽使用" :code="codes.slots.template" />
        <DemoCode title="脚本 - 插槽使用" :code="codes.slots.script" />
      </template>
    </DemoSection>

    <!-- 文本轮播示例 -->
    <DemoSection title="文本轮播" desc="支持多条文本轮播显示，水平和垂直两种方向">
      <wd-cell-group>
        <wd-cell title="水平轮播" vertical>
          <wd-notice-bar
            :text="textArray"
            prefix="check-outline"
            @click="handleClick"
            @next="handleNext"
          />
        </wd-cell>

        <wd-cell title="垂直轮播" vertical>
          <wd-notice-bar
            prefix="warn-bold"
            direction="vertical"
            :text="textArray"
            :delay="3"
            @click="handleClick"
            @next="handleNext"
          />
        </wd-cell>

        <wd-cell title="单条垂直" vertical>
          <wd-notice-bar
            prefix="warn-bold"
            direction="vertical"
            text="只有一条消息不会滚动"
            :delay="3"
          />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 水平轮播" :code="codes.carousel.horizontalTemplate" />
        <DemoCode title="模板 - 垂直轮播" :code="codes.carousel.verticalTemplate" />
        <DemoCode title="脚本 - 文本轮播" :code="codes.carousel.script" />
      </template>
    </DemoSection>

    <!-- 高级配置示例 -->
    <DemoSection title="高级配置" desc="自定义滚动速度、延迟时间和动画控制">
      <wd-cell-group>
        <wd-cell title="自定义速度" vertical>
          <wd-notice-bar
            text="这是一条快速滚动的消息提示信息这是一条快速滚动的消息提示信息"
            prefix="warn-bold"
            :speed="200"
            :delay="0.5"
          />
        </wd-cell>

        <wd-cell title="慢速滚动" vertical>
          <wd-notice-bar
            text="这是一条慢速滚动的消息提示信息这是一条慢速滚动的消息提示信息"
            prefix="warn-bold"
            :speed="50"
            :delay="2"
          />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 自定义速度" :code="codes.advanced.speedTemplate" />
        <DemoCode title="脚本 - 高级配置" :code="codes.advanced.script" />
      </template>
    </DemoSection>

    <!-- 手动控制示例 -->
    <DemoSection title="手动控制" desc="通过方法控制通知栏的动画播放">
      <!-- 控制示例区域 -->
      <view class="space-y-4">
        <!-- 可控制的通知栏 -->
        <wd-cell title="可控制的通知栏" vertical>
          <wd-notice-bar
            ref="noticeBarRef"
            prefix="warn-bold"
            direction="vertical"
            :text="textArray"
            :delay="3"
          />
        </wd-cell>

        <!-- 控制按钮 -->
        <view class="px-4">
          <wd-button block @click="handleReset">重置播放动画</wd-button>
        </view>

        <!-- 状态显示 -->
        <view class="mx-4 rounded-lg bg-blue-50 px-4 py-2">
          <view class="text-xs text-blue-600 font-medium">💡 点击按钮可以重置动画到初始状态</view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 手动控制" :code="codes.control.template" />
        <DemoCode title="脚本 - 手动控制" :code="codes.control.script" />
      </template>
    </DemoSection>

    <!-- 事件监听示例 -->
    <DemoSection title="事件监听" desc="监听通知栏的各种事件">
      <!-- 事件监听区域 -->
      <view class="space-y-4">
        <!-- 事件监听通知栏 -->
        <wd-cell title="事件监听" vertical>
          <wd-notice-bar
            :text="eventTextArray"
            prefix="check-outline"
            closable
            @click="handleEventClick"
            @next="handleEventNext"
            @close="handleEventClose"
          />
        </wd-cell>

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
import { ref } from 'vue'
import type { NoticeBarInstance } from '@/wd/components/wd-notice-bar/wd-notice-bar.vue'

// ===== 组件状态管理 =====

// 通知栏实例引用
const noticeBarRef = ref<NoticeBarInstance>()

// 轮播文本数组
const textArray = ref<string[]>([
  '欢迎使用 ruoyi-plus-uniapp',
  '该框架由b站抓蛙师出品',
  '我们的目标是打造最强全栈开发框架',
  '非授权不得使用'
])

// 事件监听用的文本数组
const eventTextArray = ref<string[]>(['点击我触发点击事件', '这是第二条消息', '这是第三条消息'])

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
    basicTemplate: `<wd-notice-bar
  text="这是一条消息提示信息这是一条消息提示信息这是一条消息提示信息"
  prefix="warn-bold"
/>`,

    closableTemplate: `<wd-notice-bar
  text="这是一条可关闭的消息提示信息"
  prefix="warn-bold"
  closable
/>`,

    noScrollTemplate: `<wd-notice-bar
  :scrollable="false"
  text="欲买桂花同载酒，终不似，少年游"
  prefix="warn-bold"
/>`,

    script: `// 基本用法无需额外脚本代码
// 只需要在模板中使用组件即可`,
  },

  // 类型样式代码
  types: {
    template: `<!-- 警告类型 -->
<wd-notice-bar
  type="warning"
  text="这是一条警告消息提示信息"
  prefix="warn-bold"
/>

<!-- 信息类型 -->
<wd-notice-bar
  type="info"
  text="点击查看信息详情点击查看信息详情点击查看信息详情"
  prefix="check-outline"
/>

<!-- 危险类型 -->
<wd-notice-bar
  type="danger"
  text="当前网络不可用，请检查你的网络设置"
  prefix="wifi-error"
/>`,

    script: `// 类型定义
type NoticeBarType = 'warning' | 'info' | 'danger' | ''

const noticeType = ref<NoticeBarType>('warning')`,
  },

  // 自定义样式代码
  custom: {
    colorTemplate: `<wd-notice-bar
  text="这是一条自定义颜色的消息提示信息"
  prefix="check-outline"
  color="#34D19D"
  background-color="#f0f9eb"
/>`,

    wrapTemplate: `<wd-notice-bar
  text="这是一条消息提示信息这是一条消息提示信息这是一条消息提示信息这是一条消息提示信息这是一条消息提示信息这是一条消息提示信息"
  wrapable
  :scrollable="false"
  prefix="warn-bold"
/>`,

    script: `// 自定义样式配置
const customStyle = {
  color: '#34D19D',
  backgroundColor: '#f0f9eb'
}`,
  },

  // 插槽使用代码
  slots: {
    template: `<wd-notice-bar :scrollable="false">
  <template #prefix>
    <wd-icon name="warn-bold" color="#ff6b35" />
  </template>
  通知被禁或时段内消息屏蔽可能造成消息无法及时送达
  <template #suffix>
    <view class="text-blue-500">查看</view>
  </template>
</wd-notice-bar>`,

    script: `// 插槽使用无需额外脚本
// 直接在模板中使用具名插槽即可`,
  },

  // 文本轮播代码
  carousel: {
    horizontalTemplate: `<wd-notice-bar
  :text="textArray"
  prefix="check-outline"
  @click="handleClick"
  @next="handleNext"
/>`,

    verticalTemplate: `<wd-notice-bar
  prefix="warn-bold"
  direction="vertical"
  :text="textArray"
  :delay="3"
  @click="handleClick"
  @next="handleNext"
/>`,

    script: `import { ref } from 'vue'

// 轮播文本数组
const textArray = ref([
  '欢迎使用 ruoyi-plus-uniapp',
  '该框架由b站抓蛙师出品',
  '我们的目标是打造最强全栈开发框架',
  '非授权不得使用'
])

// 处理点击事件
const handleClick = (result) => {
  console.log('点击通知栏：', result)
}

// 处理下一条消息切换
const handleNext = (index) => {
  console.log('展示下一条，index: ', index)
  console.log(\`文本是：\${textArray.value[index]}\`)
}`,
  },

  // 高级配置代码
  advanced: {
    speedTemplate: `<!-- 快速滚动 -->
<wd-notice-bar
  text="这是一条快速滚动的消息提示信息这是一条快速滚动的消息提示信息"
  prefix="warn-bold"
  :speed="200"
  :delay="0.5"
/>

<!-- 慢速滚动 -->
<wd-notice-bar
  text="这是一条慢速滚动的消息提示信息这是一条慢速滚动的消息提示信息"
  prefix="warn-bold"
  :speed="50"
  :delay="2"
/>`,

    script: `// 高级配置参数
const advancedConfig = {
  fastSpeed: 200,    // 快速滚动速度 rpx/s
  slowSpeed: 50,     // 慢速滚动速度 rpx/s
  shortDelay: 0.5,   // 短延迟时间 秒
  longDelay: 2       // 长延迟时间 秒
}`,
  },

  // 手动控制代码
  control: {
    template: `<template>
  <wd-notice-bar
    ref="noticeBarRef"
    prefix="warn-bold"
    direction="vertical"
    :text="textArray"
    :delay="3"
  />

  <wd-button @click="handleReset" block>重置播放动画</wd-button>
</template>`,

    script: `import type { NoticeBarInstance } from '@/wd/components/wd-notice-bar/wd-notice-bar.vue'
import { ref } from 'vue'

// 通知栏实例引用
const noticeBarRef = ref<NoticeBarInstance>()

// 重置播放动画
const handleReset = () => {
  noticeBarRef.value?.reset()
  console.log('重置播放动画')
}`,
  },

  // 事件监听代码
  events: {
    template: `
      <wd-notice-bar
        :text="eventTextArray"
        prefix="check-outline"
        closable
        @click="handleEventClick"
        @next="handleEventNext"
        @close="handleEventClose"
      />`,

    methods: `// 事件处理方法
const handleEventClick = (result) => {
  addEventLog(\`点击事件: \${result.text} (索引: \${result.index})\`, 'success')
}

const handleEventNext = (index) => {
  addEventLog(\`切换到下一条: 索引 \${index}\`, 'info')
}

const handleEventClose = () => {
  addEventLog('通知栏已关闭', 'warning')
}

// 添加事件日志
const addEventLog = (message, type = 'info') => {
  eventLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
    type
  })
  // 限制日志数量
  if (eventLogs.value.length > 10) {
    eventLogs.value = eventLogs.value.slice(0, 10)
  }
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'text',
    type: 'String | String[]',
    default: '""',
    desc: '设置通知栏文案，支持字符串或字符串数组，传入数组则自动轮播',
  },
  {
    name: 'type',
    type: 'String',
    default: '"warning"',
    desc: '设置通知栏类型：warning / info / danger',
  },
  {
    name: 'scrollable',
    type: 'Boolean',
    default: 'true',
    desc: '是否可滚动',
  },
  {
    name: 'delay',
    type: 'Number',
    default: '1',
    desc: '滚动延迟时间，单位秒',
  },
  {
    name: 'speed',
    type: 'Number',
    default: '100',
    desc: '滚动速度，单位 rpx/s',
  },
  {
    name: 'closable',
    type: 'Boolean',
    default: 'false',
    desc: '是否可关闭',
  },
  {
    name: 'wrapable',
    type: 'Boolean',
    default: 'false',
    desc: '是否换行显示',
  },
  {
    name: 'prefix',
    type: 'String',
    default: '""',
    desc: '设置左侧图标，使用 icon 章节中的图标名',
  },
  {
    name: 'color',
    type: 'String',
    default: '""',
    desc: '文字、图标颜色',
  },
  {
    name: 'background-color',
    type: 'String',
    default: '""',
    desc: '背景颜色',
  },
  {
    name: 'direction',
    type: 'String',
    default: '"horizontal"',
    desc: '滚动方向：horizontal / vertical',
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
    name: 'reset()',
    desc: '重置NoticeBar动画',
  },
]

// Events 事件文档
const apiEvents = [
  {
    name: 'close',
    desc: '关闭通知栏时触发',
  },
  {
    name: 'next',
    desc: '切换到下一条文本时触发，参数为当前索引',
  },
  {
    name: 'click',
    desc: '点击通知栏时触发，参数为 { index, text }',
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
  if (eventLogs.value.length > 10) {
    eventLogs.value = eventLogs.value.slice(0, 10)
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

/**
 * 处理点击事件
 */
const handleClick = (result: { text: string; index: number }) => {
  console.log('点击通知栏：', result)
}

/**
 * 处理下一条消息切换
 */
const handleNext = (index: number) => {
  console.log('展示下一条，index: ', index)
  console.log(`文本是：${textArray.value[index]}`)
}

/**
 * 重置播放动画
 */
const handleReset = () => {
  noticeBarRef.value?.reset()
  console.log('重置播放动画')
}

/**
 * 事件监听 - 点击事件
 */
const handleEventClick = (result: { text: string; index: number }) => {
  addEventLog(`点击事件: ${result.text} (索引: ${result.index})`, 'success')
}

/**
 * 事件监听 - 下一条事件
 */
const handleEventNext = (index: number) => {
  addEventLog(`切换到下一条: 索引 ${index}`, 'info')
}

/**
 * 事件监听 - 关闭事件
 */
const handleEventClose = () => {
  addEventLog('通知栏已关闭', 'warning')
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
