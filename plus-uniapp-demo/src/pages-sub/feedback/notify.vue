<!-- Notify 消息通知 http://127.0.0.1:100/#/pages-sub/demo/wd/notify -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Notify 消息通知" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的通知形式，从页面顶部弹出">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="基础通知" is-link @click="showBasicNotify" />
        <wd-cell title="长文本通知" is-link @click="showLongTextNotify" />
        <wd-cell title="多行文本通知" is-link @click="showMultiLineNotify" />
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基础调用" :code="codes.basic.template" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 通知类型示例 -->
    <DemoSection title="通知类型" desc="支持主要、成功、危险、警告四种类型">
      <wd-cell-group>
        <wd-cell title="主要通知" is-link @click="showType('primary')" />
        <wd-cell title="成功通知" is-link @click="showType('success')" />
        <wd-cell title="危险通知" is-link @click="showType('danger')" />
        <wd-cell title="警告通知" is-link @click="showType('warning')" />
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 通知类型调用" :code="codes.types.template" />
        <DemoCode title="脚本 - 通知类型" :code="codes.types.script" />
      </template>
    </DemoSection>

    <!-- 快捷方法示例 -->
    <DemoSection title="快捷方法" desc="提供快捷方法调用不同类型的通知">
      <wd-cell-group>
        <wd-cell title="快捷主要通知" is-link @click="showShortcut('primary')" />
        <wd-cell title="快捷成功通知" is-link @click="showShortcut('success')" />
        <wd-cell title="快捷危险通知" is-link @click="showShortcut('danger')" />
        <wd-cell title="快捷警告通知" is-link @click="showShortcut('warning')" />
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 快捷方法调用" :code="codes.shortcuts.template" />
        <DemoCode title="脚本 - 快捷方法" :code="codes.shortcuts.script" />
      </template>
    </DemoSection>

    <!-- 自定义样式示例 -->
    <DemoSection title="自定义样式" desc="自定义颜色、背景色和位置">
      <wd-cell-group>
        <wd-cell title="自定义颜色" is-link @click="showCustomColor" />
        <wd-cell title="自定义背景" is-link @click="showCustomBackground" />
        <wd-cell title="底部位置" is-link @click="showCustomPosition" />
        <wd-cell title="自定义安全高度" is-link @click="showCustomSafeHeight" />
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 自定义样式调用" :code="codes.custom.template" />
        <DemoCode title="脚本 - 自定义样式" :code="codes.custom.script" />
      </template>
    </DemoSection>

    <!-- 持续时间示例 -->
    <DemoSection title="持续时间" desc="控制通知的显示时长">
      <wd-cell-group>
        <wd-cell title="短时间通知（1秒）" is-link @click="showShortDuration" />
        <wd-cell title="长时间通知（5秒）" is-link @click="showLongDuration" />
        <wd-cell title="不自动关闭" is-link @click="showPersistentNotify" />
        <wd-cell title="手动关闭" is-link @click="showManualClose" />
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 持续时间调用" :code="codes.duration.template" />
        <DemoCode title="脚本 - 持续时间" :code="codes.duration.script" />
      </template>
    </DemoSection>

    <!-- Notify 组件用法示例 -->
    <DemoSection title="Notify 组件用法" desc="直接使用 wd-notify 组件，支持插槽自定义内容">
      <wd-cell-group>
        <wd-cell title="使用组件形式" is-link @click="showNotifyComponent" />
        <wd-cell title="组件自定义内容" is-link @click="showCustomContent" />
        <wd-cell title="组件事件监听" is-link @click="showComponentEvents" />
      </wd-cell-group>

      <!-- Notify 组件实例 -->
      <wd-notify
        v-model:visible="componentVisible"
        selector="component"
        type="success"
        @click="handleComponentClick"
        @opened="handleComponentOpened"
        @closed="handleComponentClosed"
      >
        <wd-icon name="check-outline" size="inherit" color="inherit" />
        这是通过组件形式显示的通知
      </wd-notify>

      <!-- 自定义内容组件 -->
      <wd-notify
        v-model:visible="customContentVisible"
        selector="custom"
        type="primary"
        color="#fff"
        background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      >
        <view class="flex items-center">
          <wd-icon name="star-on" size="inherit" color="inherit" class="mr-2" />
          <view class="flex-1">
            <view class="font-medium">恭喜您！</view>
            <view class="text-xs opacity-80">获得了新的成就徽章</view>
          </view>
        </view>
      </wd-notify>

      <!-- 事件监听组件 -->
      <wd-notify v-model:visible="eventsVisible" selector="events" type="warning" :duration="0">
        点击我或等待查看事件效果
      </wd-notify>

      <template #codes>
        <DemoCode title="模板 - 组件用法" :code="codes.component.template" />
        <DemoCode title="脚本 - 组件用法" :code="codes.component.script" />
      </template>
    </DemoSection>

    <!-- 多实例管理示例 -->
    <DemoSection title="多实例管理" desc="支持多个通知实例同时显示和管理">
      <!-- 控制示例区域 -->
      <view class="space-y-4">
        <!-- 多实例控制按钮 -->
        <wd-cell-group>
          <wd-cell title="显示多个通知" is-link @click="showMultipleNotifies" />
          <wd-cell title="不同选择器实例" is-link @click="showDifferentSelectors" />
          <wd-cell title="关闭所有通知" is-link @click="closeAllNotifies" />
        </wd-cell-group>

        <!-- 实例状态显示 -->
        <view class="mx-4 rounded-lg bg-blue-50 px-4 py-2">
          <view class="text-sm text-blue-900 font-medium">💡 实例管理说明</view>
          <view class="mt-1 text-xs text-blue-700">
            • 同一选择器的通知会相互替换
            <br>
            • 不同选择器的通知可以同时显示
            <br>
            • 支持手动关闭特定实例
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 多实例管理" :code="codes.multiple.template" />
        <DemoCode title="脚本 - 多实例管理" :code="codes.multiple.script" />
      </template>
    </DemoSection>

    <!-- 事件监听示例 -->
    <DemoSection title="事件监听" desc="监听通知的生命周期事件">
      <!-- 事件监听区域 -->
      <view class="space-y-4">
        <!-- 控制按钮 -->
        <wd-cell-group>
          <wd-cell title="带回调的通知" is-link @click="showCallbackNotify" />
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
import { useNotify } from '@/wd'
import type { NotifyType } from '@/wd/components/wd-notify/wd-notify.vue'

// ===== 组件状态管理 =====

// 组件显示状态
const componentVisible = ref<boolean>(false)
const customContentVisible = ref<boolean>(false)
const eventsVisible = ref<boolean>(false)

// 定时器引用
let timer: ReturnType<typeof setTimeout>

// 事件日志状态
interface EventLog {
  time: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

const eventLogs = ref<EventLog[]>([])

// 获取不同实例的 useNotify
const { show, primary, success, danger, warning, close } = useNotify()
const instanceA = useNotify('instance-a')
const instanceB = useNotify('instance-b')

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    template: `<!-- 在页面中放置 useNotify 调用 -->
<wd-cell title="基础通知" is-link @click="showBasicNotify" />`,

    script: `import { useNotify } from '@/wd'

const { show } = useNotify()

// 显示基本通知
const showBasicNotify = () => {
  show('这是一条基础通知消息')
}

// 显示长文本通知
const showLongTextNotify = () => {
  show('这是一条很长的通知消息，用来测试长文本在通知中的显示效果')
}

// 显示多行文本通知
const showMultiLineNotify = () => {
  show('第一行通知内容\\n第二行通知内容\\n第三行通知内容')
}`,
  },

  // 通知类型代码
  types: {
    template: `<wd-cell title="主要通知" is-link @click="showType('primary')" />
<wd-cell title="成功通知" is-link @click="showType('success')" />
<wd-cell title="危险通知" is-link @click="showType('danger')" />
<wd-cell title="警告通知" is-link @click="showType('warning')" />`,

    script: `import type { NotifyType } from '@/wd/components/wd-notify/wd-notify.vue'

// 显示指定类型的通知
const showType = (type: NotifyType) => {
  show({
    message: \`这是一条\${type}类型的通知\`,
    type,
  })
}`,
  },

  // 快捷方法代码
  shortcuts: {
    template: `<wd-cell title="快捷主要通知" is-link @click="showShortcut('primary')" />
<wd-cell title="快捷成功通知" is-link @click="showShortcut('success')" />
<wd-cell title="快捷危险通知" is-link @click="showShortcut('danger')" />
<wd-cell title="快捷警告通知" is-link @click="showShortcut('warning')" />`,

    script: `const { primary, success, danger, warning } = useNotify()

// 使用快捷方法显示通知
const showShortcut = (type: NotifyType) => {
  switch (type) {
    case 'primary':
      primary('主要通知快捷方法')
      break
    case 'success':
      success('成功通知快捷方法')
      break
    case 'danger':
      danger('危险通知快捷方法')
      break
    case 'warning':
      warning('警告通知快捷方法')
      break
  }
}`,
  },

  // 自定义样式代码
  custom: {
    template: `<wd-cell title="自定义颜色" is-link @click="showCustomColor" />
<wd-cell title="自定义背景" is-link @click="showCustomBackground" />
<wd-cell title="底部位置" is-link @click="showCustomPosition" />
<wd-cell title="自定义安全高度" is-link @click="showCustomSafeHeight" />`,

    script: `// 显示自定义颜色通知
const showCustomColor = () => {
  show({
    message: '自定义文字颜色',
    color: '#ad0000',
    background: '#ffe1e1',
  })
}

// 显示自定义背景通知
const showCustomBackground = () => {
  show({
    message: '渐变背景通知',
    color: '#fff',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  })
}

// 显示底部位置通知
const showCustomPosition = () => {
  show({
    message: '底部位置通知',
    position: 'bottom',
  })
}

// 显示自定义安全高度通知
const showCustomSafeHeight = () => {
  show({
    message: '自定义安全高度',
    safeHeight: 100,
  })
}`,
  },

  // 持续时间代码
  duration: {
    template: `<wd-cell title="短时间通知（1秒）" is-link @click="showShortDuration" />
<wd-cell title="长时间通知（5秒）" is-link @click="showLongDuration" />
<wd-cell title="不自动关闭" is-link @click="showPersistentNotify" />
<wd-cell title="手动关闭" is-link @click="showManualClose" />`,

    script: `const { show, close } = useNotify()

// 显示短时间通知
const showShortDuration = () => {
  show({
    message: '1秒后自动关闭',
    duration: 1000,
  })
}

// 显示长时间通知
const showLongDuration = () => {
  show({
    message: '5秒后自动关闭',
    duration: 5000,
  })
}

// 显示持续通知（不自动关闭）
const showPersistentNotify = () => {
  show({
    message: '不会自动关闭的通知',
    duration: 0,
  })
}

// 显示可手动关闭的通知
const showManualClose = () => {
  show({
    message: '3秒后手动关闭',
    duration: 0,
  })

  // 3秒后手动关闭
  setTimeout(() => {
    close()
  }, 3000)
}`,
  },

  // 组件用法代码
  component: {
    template: `<template>
  <!-- 基础组件用法 -->
  <wd-notify
    v-model:visible="componentVisible"
    selector="component"
    type="success"
    @click="handleComponentClick"
    @opened="handleComponentOpened"
    @closed="handleComponentClosed"
  >
    <wd-icon name="check-outline" size="inherit" color="inherit" />
    这是通过组件形式显示的通知
  </wd-notify>

  <!-- 自定义内容组件 -->
  <wd-notify
    v-model:visible="customContentVisible"
    selector="custom"
    type="primary"
    color="#fff"
    background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  >
    <view class="flex items-center">
      <wd-icon name="star-on" size="inherit" color="inherit" class="mr-2" />
      <view class="flex-1">
        <view class="font-medium">恭喜您！</view>
        <view class="text-xs opacity-80">获得了新的成就徽章</view>
      </view>
    </view>
  </wd-notify>
</template>`,

    script: `import { ref } from 'vue'

// 组件显示状态
const componentVisible = ref(false)
const customContentVisible = ref(false)

// 显示组件形式通知
const showNotifyComponent = () => {
  componentVisible.value = true

  // 2秒后自动关闭
  setTimeout(() => {
    componentVisible.value = false
  }, 2000)
}

// 显示自定义内容通知
const showCustomContent = () => {
  customContentVisible.value = true

  setTimeout(() => {
    customContentVisible.value = false
  }, 3000)
}

// 组件事件处理
const handleComponentClick = (event) => {
  console.log('通知被点击', event)
}

const handleComponentOpened = () => {
  console.log('通知已显示')
}

const handleComponentClosed = () => {
  console.log('通知已关闭')
}`,
  },

  // 多实例管理代码
  multiple: {
    template: `<wd-cell title="显示多个通知" is-link @click="showMultipleNotifies" />
<wd-cell title="不同选择器实例" is-link @click="showDifferentSelectors" />
<wd-cell title="关闭所有通知" is-link @click="closeAllNotifies" />`,

    script: `// 获取不同实例的 useNotify
const defaultInstance = useNotify()
const instanceA = useNotify('instance-a')
const instanceB = useNotify('instance-b')

// 显示多个通知
const showMultipleNotifies = () => {
  // 同一实例会相互替换
  defaultInstance.show('第一条通知')
  setTimeout(() => {
    defaultInstance.show('第二条通知（替换第一条）')
  }, 500)
}

// 显示不同选择器实例
const showDifferentSelectors = () => {
  // 不同选择器可以同时显示
  instanceA.success('实例A的通知')
  instanceB.warning('实例B的通知')
  defaultInstance.primary('默认实例的通知')
}

// 关闭所有通知
const closeAllNotifies = () => {
  defaultInstance.close()
  instanceA.close()
  instanceB.close()
}`,
  },

  // 事件监听代码
  events: {
    template: `
      <wd-cell title="带回调的通知" is-link @click="showCallbackNotify" />`,

    methods: `// 显示带回调的通知
const showCallbackNotify = () => {
  show({
    message: '点击我试试！',
    duration: 5000,
    onClick: (event) => {
      addEventLog('通知被点击', 'success')
    },
    onOpened: () => {
      addEventLog('通知已显示', 'info')
    },
    onClosed: () => {
      addEventLog('通知已关闭', 'warning')
    }
  })
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
    name: 'type',
    type: 'String',
    default: '"danger"',
    desc: '类型：primary / success / danger / warning',
  },
  {
    name: 'message',
    type: 'String',
    default: '""',
    desc: '展示文案，支持通过\\n换行',
  },
  {
    name: 'duration',
    type: 'Number',
    default: '3000',
    desc: '展示时长(ms)，值为 0 时不会消失',
  },
  {
    name: 'position',
    type: 'String',
    default: '"top"',
    desc: '弹出位置：top / bottom',
  },
  {
    name: 'color',
    type: 'String',
    default: '""',
    desc: '字体颜色',
  },
  {
    name: 'background',
    type: 'String',
    default: '""',
    desc: '背景颜色',
  },
  {
    name: 'z-index',
    type: 'Number',
    default: '1000',
    desc: '将组件的 z-index 层级设置为一个固定值',
  },
  {
    name: 'safe-height',
    type: 'Number',
    default: '0',
    desc: '顶部安全高度（rpx）',
  },
  {
    name: 'visible',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示（仅组件用法）',
  },
  {
    name: 'selector',
    type: 'String',
    default: '""',
    desc: '选择器，用于多实例（仅组件用法）',
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
    name: 'show(options)',
    desc: '显示通知，参数为配置对象或字符串',
  },
  {
    name: 'primary(options)',
    desc: '显示主要类型通知',
  },
  {
    name: 'success(options)',
    desc: '显示成功类型通知',
  },
  {
    name: 'danger(options)',
    desc: '显示危险类型通知',
  },
  {
    name: 'warning(options)',
    desc: '显示警告类型通知',
  },
  {
    name: 'close()',
    desc: '关闭当前实例的通知',
  },
]

// Events 事件文档（仅组件用法）
const apiEvents = [
  {
    name: 'click',
    desc: '点击通知时触发，参数为点击事件对象',
  },
  {
    name: 'opened',
    desc: '完全展示后触发',
  },
  {
    name: 'closed',
    desc: '完全关闭时触发',
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
 * 显示基本通知
 */
const showBasicNotify = () => {
  show('这是一条基础通知消息')
}

/**
 * 显示长文本通知
 */
const showLongTextNotify = () => {
  show('这是一条很长的通知消息，用来测试长文本在通知中的显示效果，可以看到文本会自动换行')
}

/**
 * 显示多行文本通知
 */
const showMultiLineNotify = () => {
  show('第一行通知内容\n第二行通知内容\n第三行通知内容')
}

/**
 * 显示指定类型的通知
 */
const showType = (type: NotifyType) => {
  show({
    message: `这是一条${type}类型的通知`,
    type,
  })
}

/**
 * 使用快捷方法显示通知
 */
const showShortcut = (type: NotifyType) => {
  switch (type) {
    case 'primary':
      primary('主要通知快捷方法')
      break
    case 'success':
      success('成功通知快捷方法')
      break
    case 'danger':
      danger('危险通知快捷方法')
      break
    case 'warning':
      warning('警告通知快捷方法')
      break
  }
}

/**
 * 显示自定义颜色通知
 */
const showCustomColor = () => {
  show({
    message: '自定义文字颜色',
    color: '#ad0000',
    background: '#ffe1e1',
  })
}

/**
 * 显示自定义背景通知
 */
const showCustomBackground = () => {
  show({
    message: '渐变背景通知',
    color: '#fff',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  })
}

/**
 * 显示底部位置通知
 */
const showCustomPosition = () => {
  show({
    message: '底部位置通知',
    position: 'bottom',
  })
}

/**
 * 显示自定义安全高度通知
 */
const showCustomSafeHeight = () => {
  show({
    message: '自定义安全高度',
    safeHeight: 100,
  })
}

/**
 * 显示短时间通知
 */
const showShortDuration = () => {
  show({
    message: '1秒后自动关闭',
    duration: 1000,
  })
}

/**
 * 显示长时间通知
 */
const showLongDuration = () => {
  show({
    message: '5秒后自动关闭',
    duration: 5000,
  })
}

/**
 * 显示持续通知（不自动关闭）
 */
const showPersistentNotify = () => {
  show({
    message: '不会自动关闭的通知',
    duration: 0,
  })
}

/**
 * 显示可手动关闭的通知
 */
const showManualClose = () => {
  show({
    message: '3秒后手动关闭',
    duration: 0,
  })

  // 3秒后手动关闭
  setTimeout(() => {
    close()
  }, 3000)
}

/**
 * 显示组件形式通知
 */
const showNotifyComponent = () => {
  componentVisible.value = true

  // 清除之前的定时器
  if (timer) clearTimeout(timer)

  // 2秒后自动关闭
  timer = setTimeout(() => {
    componentVisible.value = false
  }, 2000)
}

/**
 * 显示自定义内容通知
 */
const showCustomContent = () => {
  customContentVisible.value = true

  setTimeout(() => {
    customContentVisible.value = false
  }, 3000)
}

/**
 * 显示组件事件通知
 */
const showComponentEvents = () => {
  eventsVisible.value = true

  setTimeout(() => {
    eventsVisible.value = false
  }, 4000)
}

/**
 * 显示多个通知
 */
const showMultipleNotifies = () => {
  // 同一实例会相互替换
  show('第一条通知')
  setTimeout(() => {
    show('第二条通知（替换第一条）')
  }, 500)
}

/**
 * 显示不同选择器实例
 */
const showDifferentSelectors = () => {
  // 不同选择器可以同时显示
  instanceA.success('实例A的通知')
  setTimeout(() => {
    instanceB.warning('实例B的通知')
  }, 500)
  setTimeout(() => {
    primary('默认实例的通知')
  }, 1000)
}

/**
 * 关闭所有通知
 */
const closeAllNotifies = () => {
  close()
  instanceA.close()
  instanceB.close()
  addEventLog('所有通知已关闭', 'info')
}

/**
 * 显示带回调的通知
 */
const showCallbackNotify = () => {
  show({
    message: '点击我试试！',
    duration: 5000,
    onClick: (event: MouseEvent) => {
      addEventLog('通知被点击', 'success')
    },
    onOpened: () => {
      addEventLog('通知已显示', 'info')
    },
    onClosed: () => {
      addEventLog('通知已关闭', 'warning')
    },
  })
}

/**
 * 组件点击事件处理
 */
const handleComponentClick = (event: MouseEvent) => {
  console.log('通知被点击', event)
  addEventLog('组件通知被点击', 'success')
}

/**
 * 组件打开事件处理
 */
const handleComponentOpened = () => {
  console.log('通知已显示')
  addEventLog('组件通知已显示', 'info')
}

/**
 * 组件关闭事件处理
 */
const handleComponentClosed = () => {
  console.log('通知已关闭')
  addEventLog('组件通知已关闭', 'warning')
}

const { resetScrollTop, updateScrollTop } = useScroll()
onShow(() => {
  resetScrollTop()
})
onPageScroll((e) => {
  updateScrollTop(e.scrollTop)
})
</script>
