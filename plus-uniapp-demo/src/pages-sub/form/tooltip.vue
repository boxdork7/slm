<!-- Tooltip 文字提示 http://127.0.0.1:100/#/pages-sub/demo/wd/tooltip -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Tooltip 文字提示" show-back />

    <view class="overflow-hidden" @click.stop="closeOutside">
      <!-- 基本用法示例 -->
      <DemoSection title="基本用法" desc="Tooltip的十二个方向，由placement属性决定">
        <!-- 示例效果展示 -->
        <view class="space-y-5">
          <!-- 顶部位置 -->
          <view class="flex justify-between">
            <wd-tooltip
              placement="bottom-start"
              content="bottom-start 提示文字"
              @change="handleChange"
            >
              <wd-button :round="false">bottom-start</wd-button>
            </wd-tooltip>
            <wd-tooltip placement="bottom" content="bottom 提示文字" @change="handleChange">
              <wd-button :round="false">bottom</wd-button>
            </wd-tooltip>
            <wd-tooltip placement="bottom-end" content="bottom-end 提示文字" @change="handleChange">
              <wd-button :round="false">bottom-end</wd-button>
            </wd-tooltip>
          </view>

          <!-- 左侧位置 -->
          <view class="float-left flex flex-col space-y-5">
            <wd-tooltip
              placement="right-start"
              content="right-start 提示文字"
              @change="handleChange"
            >
              <wd-button :round="false">right-start</wd-button>
            </wd-tooltip>
            <wd-tooltip placement="right" content="right 提示文字" @change="handleChange">
              <wd-button :round="false">right</wd-button>
            </wd-tooltip>
            <wd-tooltip placement="right-end" content="right-end 提示文字" @change="handleChange">
              <wd-button :round="false">right-end</wd-button>
            </wd-tooltip>
          </view>

          <!-- 右侧位置 -->
          <view class="float-right flex flex-col text-right space-y-5">
            <wd-tooltip placement="left-start" content="left-start 提示文字" @change="handleChange">
              <wd-button :round="false">left-start</wd-button>
            </wd-tooltip>
            <wd-tooltip placement="left" content="left 提示文字" @change="handleChange">
              <wd-button :round="false">left</wd-button>
            </wd-tooltip>
            <wd-tooltip placement="left-end" content="left-end 提示文字" @change="handleChange">
              <wd-button :round="false">left-end</wd-button>
            </wd-tooltip>
          </view>

          <!-- 底部位置 -->
          <view class="clear-both flex justify-between">
            <wd-tooltip placement="top-start" content="top-start 提示文字" @change="handleChange">
              <wd-button :round="false">top-start</wd-button>
            </wd-tooltip>
            <wd-tooltip placement="top" content="top 提示文字" @change="handleChange">
              <wd-button :round="false">top</wd-button>
            </wd-tooltip>
            <wd-tooltip placement="top-end" content="top-end 提示文字" @change="handleChange">
              <wd-button :round="false">top-end</wd-button>
            </wd-tooltip>
          </view>
        </view>

        <!-- 代码展示 -->
        <template #codes>
          <DemoCode title="模板 - 12个方向" :code="codes.basic.template" />
          <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
        </template>
      </DemoSection>

      <!-- 显示关闭按钮示例 -->
      <DemoSection title="显示关闭按钮" desc="设置show-close属性可以显示关闭按钮">
        <view class="text-left">
          <wd-tooltip content="显示关闭按钮" placement="right" show-close @change="handleChange">
            <wd-button :round="false">显示关闭按钮</wd-button>
          </wd-tooltip>
        </view>

        <template #codes>
          <DemoCode title="模板 - 显示关闭按钮" :code="codes.closeButton.template" />
          <DemoCode title="脚本 - 显示关闭按钮" :code="codes.closeButton.script" />
        </template>
      </DemoSection>

      <!-- 多行文本示例 -->
      <DemoSection title="多行文本" desc="通过content插槽可以自定义提示内容">
        <view class="py-8 text-left">
          <wd-tooltip placement="right" use-content-slot @change="handleChange">
            <wd-button :round="false">多行文本</wd-button>
            <template #content>
              <view class="min-w-23 p-1 text-white">
                <view>多行文本第一行</view>
                <view>多行文本第二行</view>
                <view>多行文本第三行</view>
              </view>
            </template>
          </wd-tooltip>
        </view>

        <template #codes>
          <DemoCode title="模板 - 多行文本" :code="codes.multiLine.template" />
          <DemoCode title="脚本 - 多行文本" :code="codes.multiLine.script" />
        </template>
      </DemoSection>

      <!-- 控制显隐示例 -->
      <DemoSection title="控制显隐" desc="通过v-model可以手动控制Tooltip的显示隐藏">
        <view class="space-y-4">
          <view @click.stop="control">
            <wd-button plain size="small">{{ show ? '关闭' : '打开' }}</wd-button>
          </view>
          <view class="text-center">
            <wd-tooltip
              v-model="show"
              placement="top"
              content="控制显隐"
              @change="handleControlChange"
            >
              <wd-button :round="false">受控的Tooltip</wd-button>
            </wd-tooltip>
          </view>
        </view>

        <template #codes>
          <DemoCode title="模板 - 控制显隐" :code="codes.control.template" />
          <DemoCode title="脚本 - 控制显隐" :code="codes.control.script" />
        </template>
      </DemoSection>

      <!-- 事件监听示例 -->
      <DemoSection title="事件监听" desc="监听Tooltip的打开和关闭事件">
        <!-- 状态显示区域 -->
        <view class="space-y-4">
          <!-- 控制按钮 -->
          <view class="text-left">
            <wd-tooltip
              placement="right-end"
              :content="eventContent"
              @open="handleOpen"
              @close="handleClose"
              @change="handleEventChange"
            >
              <wd-button :round="false">事件监听</wd-button>
            </wd-tooltip>
          </view>

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

      <!-- 禁用状态示例 -->
      <DemoSection title="禁用状态" desc="设置disabled属性可以禁用Tooltip">
        <view class="text-left">
          <wd-tooltip placement="right-end" content="禁用状态" disabled @change="handleChange">
            <wd-button :round="false">禁用的Tooltip</wd-button>
          </wd-tooltip>
        </view>

        <template #codes>
          <DemoCode title="模板 - 禁用状态" :code="codes.disabled.template" />
          <DemoCode title="脚本 - 禁用状态" :code="codes.disabled.script" />
        </template>
      </DemoSection>

      <!-- 自定义样式示例 -->
      <DemoSection title="自定义样式" desc="支持自定义箭头和弹出框样式">
        <view class="space-y-3">
          <view class="text-left">
            <wd-tooltip
              placement="top"
              content="自定义箭头样式"
              custom-arrow="custom-arrow-style"
              @change="handleChange"
            >
              <wd-button :round="false">自定义箭头</wd-button>
            </wd-tooltip>
          </view>
          <view class="text-left">
            <wd-tooltip
              placement="bottom"
              content="自定义弹出框样式"
              custom-pop="custom-pop-style"
              @change="handleChange"
            >
              <wd-button :round="false">自定义弹出框</wd-button>
            </wd-tooltip>
          </view>
        </view>

        <template #codes>
          <DemoCode title="模板 - 自定义样式" :code="codes.customStyle.template" />
          <DemoCode title="脚本 - 自定义样式" :code="codes.customStyle.script" />
        </template>
      </DemoSection>
    </view>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast, useQueue } from '@/wd'

// ===== 组件状态管理 =====

// Toast 实例
const toast = useToast()

// 队列控制
const { closeOutside } = useQueue()

// 控制显隐状态
const show = ref<boolean>(false)

// 事件监听内容
const eventContent = ref<string>('点击查看事件')

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
    template: `<!-- 12个方向的Tooltip -->
<!-- 顶部位置 -->
<view class="flex justify-between">
  <wd-tooltip placement="bottom-start" content="bottom-start 提示文字">
    <wd-button :round="false">bottom-start</wd-button>
  </wd-tooltip>
  <wd-tooltip placement="bottom" content="bottom 提示文字">
    <wd-button :round="false">bottom</wd-button>
  </wd-tooltip>
  <wd-tooltip placement="bottom-end" content="bottom-end 提示文字">
    <wd-button :round="false">bottom-end</wd-button>
  </wd-tooltip>
</view>

<!-- 左侧位置 -->
<view class="float-left flex flex-col space-y-5">
  <wd-tooltip placement="right-start" content="right-start 提示文字">
    <wd-button :round="false">right-start</wd-button>
  </wd-tooltip>
  <wd-tooltip placement="right" content="right 提示文字">
    <wd-button :round="false">right</wd-button>
  </wd-tooltip>
  <wd-tooltip placement="right-end" content="right-end 提示文字">
    <wd-button :round="false">right-end</wd-button>
  </wd-tooltip>
</view>

<!-- 右侧位置 -->
<view class="float-right flex flex-col space-y-5">
  <wd-tooltip placement="left-start" content="left-start 提示文字">
    <wd-button :round="false">left-start</wd-button>
  </wd-tooltip>
  <wd-tooltip placement="left" content="left 提示文字">
    <wd-button :round="false">left</wd-button>
  </wd-tooltip>
  <wd-tooltip placement="left-end" content="left-end 提示文字">
    <wd-button :round="false">left-end</wd-button>
  </wd-tooltip>
</view>

<!-- 底部位置 -->
<view class="clear-both flex justify-between">
  <wd-tooltip placement="top-start" content="top-start 提示文字">
    <wd-button :round="false">top-start</wd-button>
  </wd-tooltip>
  <wd-tooltip placement="top" content="top 提示文字">
    <wd-button :round="false">top</wd-button>
  </wd-tooltip>
  <wd-tooltip placement="top-end" content="top-end 提示文字">
    <wd-button :round="false">top-end</wd-button>
  </wd-tooltip>
</view>`,

    script: `import { useQueue } from '@/wd'

// 队列控制
const { closeOutside } = useQueue()

// 通用变化事件处理
const handleChange = (event: any) => {
  console.log('tooltip change:', event)
}`,
  },

  // 显示关闭按钮代码
  closeButton: {
    template: `<wd-tooltip
  content="显示关闭按钮"
  placement="right"
  show-close
  @change="handleChange"
>
  <wd-button :round="false">显示关闭按钮</wd-button>
</wd-tooltip>`,

    script: `// 显示关闭按钮的Tooltip
const handleChange = (event: any) => {
  console.log('tooltip change:', event)
}`,
  },

  // 多行文本代码
  multiLine: {
    template: `<wd-tooltip placement="right" use-content-slot @change="handleChange">
  <wd-button :round="false">多行文本</wd-button>
  <template #content>
    <view class="min-w-23 p-1 text-white">
      <view>多行文本第一行</view>
      <view>多行文本第二行</view>
      <view>多行文本第三行</view>
    </view>
  </template>
</wd-tooltip>`,

    script: `// 多行文本Tooltip
// 使用use-content-slot属性和content插槽自定义内容
const handleChange = (event: any) => {
  console.log('tooltip change:', event)
}`,
  },

  // 控制显隐代码
  control: {
    template: `<view class="space-y-4">
  <view @click.stop="control">
    <wd-button plain size="small">{{ show ? '关闭' : '打开' }}</wd-button>
  </view>
  <view class="text-center">
    <wd-tooltip v-model="show" placement="top" content="控制显隐">
      <wd-button :round="false">受控的Tooltip</wd-button>
    </wd-tooltip>
  </view>
</view>`,

    script: `import { ref } from 'vue'

// 控制显隐状态
const show = ref<boolean>(false)

// 控制显隐切换
const control = () => {
  show.value = !show.value
}

// 控制变化事件处理
const handleControlChange = (event: any) => {
  console.log('控制状态变化:', event)
}`,
  },

  // 事件监听代码
  events: {
    template: `
      <wd-tooltip
        placement="right-end"
        :content="eventContent"
        @open="handleOpen"
        @close="handleClose"
        @change="handleEventChange"
      >
        <wd-button :round="false">事件监听</wd-button>
      </wd-tooltip>`,

    methods: `// 事件监听内容
const eventContent = ref<string>('点击查看事件')

// 打开事件处理
const handleOpen = () => {
  addEventLog('Tooltip已打开', 'success')
}

// 关闭事件处理
const handleClose = () => {
  addEventLog('Tooltip已关闭', 'success')
}

// 事件变化处理
const handleEventChange = (event: any) => {
  addEventLog(\`状态变化: \${event.show ? '显示' : '隐藏'}\`, 'info')
}

// 添加事件日志
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
}`,
  },

  // 禁用状态代码
  disabled: {
    template: `<wd-tooltip
  placement="right-end"
  content="禁用状态"
  disabled
  @change="handleChange"
>
  <wd-button :round="false">禁用的Tooltip</wd-button>
</wd-tooltip>`,

    script: `// 禁用状态的Tooltip
// 设置disabled属性为true即可禁用
const handleChange = (event: any) => {
  console.log('tooltip change:', event)
}`,
  },

  // 自定义样式代码
  customStyle: {
    template: `<!-- 自定义箭头样式 -->
<wd-tooltip
  placement="top"
  content="自定义箭头样式"
  custom-arrow="custom-arrow-style"
>
  <wd-button :round="false">自定义箭头</wd-button>
</wd-tooltip>

<!-- 自定义弹出框样式 -->
<wd-tooltip
  placement="bottom"
  content="自定义弹出框样式"
  custom-pop="custom-pop-style"
>
  <wd-button :round="false">自定义弹出框</wd-button>
</wd-tooltip>`,

    script: `// 自定义样式
// 通过custom-arrow和custom-pop属性可以自定义样式类名
const handleChange = (event: any) => {
  console.log('tooltip change:', event)
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'content',
    type: 'String | Array',
    default: '""',
    desc: '显示的内容，也可以通过content插槽传入',
  },
  {
    name: 'placement',
    type: 'String',
    default: '"bottom"',
    desc: 'Tooltip的出现位置，可选值：top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end',
  },
  {
    name: 'model-value',
    type: 'Boolean',
    default: 'false',
    desc: 'Tooltip的状态是否可见，通过v-model绑定',
  },
  {
    name: 'visible-arrow',
    type: 'Boolean',
    default: 'true',
    desc: '是否显示Tooltip箭头',
  },
  {
    name: 'offset',
    type: 'Number | Array | Object',
    default: '0',
    desc: '出现位置的偏移量，支持数字、数组、对象类型',
  },
  {
    name: 'use-content-slot',
    type: 'Boolean',
    default: 'false',
    desc: '是否使用slot来传入content内容',
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: 'Tooltip是否可用',
  },
  {
    name: 'show-close',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示Tooltip内部的关闭按钮',
  },
  {
    name: 'custom-arrow',
    type: 'String',
    default: '""',
    desc: '自定义箭头内容样式类',
  },
  {
    name: 'custom-pop',
    type: 'String',
    default: '""',
    desc: '自定义弹出内容样式类',
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
    name: 'open()',
    desc: '打开tooltip',
  },
  {
    name: 'close()',
    desc: '关闭tooltip',
  },
]

// Events 事件文档
const apiEvents = [
  {
    name: 'open',
    desc: 'Tooltip打开时触发',
  },
  {
    name: 'close',
    desc: 'Tooltip关闭时触发',
  },
  {
    name: 'change',
    desc: 'Tooltip状态变化时触发，参数为 { show: boolean }',
  },
  {
    name: 'menuclick',
    desc: '菜单点击事件',
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

// ===== 事件处理方法 =====

/**
 * 控制显隐切换
 */
const control = () => {
  show.value = !show.value
}

/**
 * 通用变化事件处理
 */
const handleChange = (event: any) => {
  console.log('tooltip change:', event)
}

/**
 * 控制变化事件处理
 */
const handleControlChange = (event: any) => {
  addEventLog(`控制状态变化: ${event.show ? '显示' : '隐藏'}`, 'info')
}

/**
 * 打开事件处理
 */
const handleOpen = () => {
  addEventLog('Tooltip已打开', 'success')
  toast.show('文字提示打开')
}

/**
 * 关闭事件处理
 */
const handleClose = () => {
  addEventLog('Tooltip已关闭', 'success')
  toast.show('文字提示关闭')
}

/**
 * 事件变化处理
 */
const handleEventChange = (event: any) => {
  addEventLog(`状态变化: ${event.show ? '显示' : '隐藏'}`, 'info')
}

// ===== 页面生命周期 =====

// 保留滚动组合函数
const { resetScrollTop, updateScrollTop } = useScroll()

onShow(() => {
  resetScrollTop()
})

onPageScroll((e) => {
  updateScrollTop(e.scrollTop)
})
</script>

<style scoped>
/* 设置按钮最小宽度 */
:deep(.wd-button) {
  min-width: auto;
}

/* 自定义箭头样式示例 */
:deep(.custom-arrow-style) {
  border-color: #ff6b6b transparent transparent transparent;
}

/* 自定义弹出框样式示例 */
:deep(.custom-pop-style) {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: white;
  border-radius: 12px;
}
</style>
