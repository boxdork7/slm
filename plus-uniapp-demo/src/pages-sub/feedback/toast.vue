<!-- Toast 轻提示 http://127.0.0.1:100/#/pages-sub/demo/wd/toast -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Toast 轻提示" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的轻提示形式，支持文本消息和长文案">
      <!-- 示例效果展示 -->
      <view class="space-y-3">
        <wd-button block @click="showToast">基本提示</wd-button>
        <wd-button block @click="showLongToast">长文案提示</wd-button>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基本提示" :code="codes.basic.basicTemplate" />
        <DemoCode title="模板 - 长文案提示" :code="codes.basic.longTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 提示类型示例 -->
    <DemoSection title="提示类型" desc="不同语义的提示类型，包括成功、错误、警告和信息">
      <view class="space-y-3">
        <wd-button type="success" block @click="showSuccessToast">成功提示</wd-button>
        <wd-button type="error" block @click="showErrorToast">错误提示</wd-button>
        <wd-button type="warning" block @click="showWarnToast">警告提示</wd-button>
        <wd-button block @click="showNormalToast">信息提示</wd-button>
      </view>

      <template #codes>
        <DemoCode title="模板 - 成功提示" :code="codes.types.successTemplate" />
        <DemoCode title="模板 - 错误提示" :code="codes.types.errorTemplate" />
        <DemoCode title="模板 - 警告提示" :code="codes.types.warningTemplate" />
        <DemoCode title="模板 - 信息提示" :code="codes.types.infoTemplate" />
        <DemoCode title="脚本 - 提示类型" :code="codes.types.script" />
      </template>
    </DemoSection>

    <!-- 自定义图标示例 -->
    <DemoSection title="自定义图标" desc="支持使用内置图标和自定义图标">
      <view class="space-y-3">
        <wd-button block @click="showInnerIconToast">内置图标</wd-button>
        <wd-button block @click="showCustomIconToast">自定义图标</wd-button>
      </view>

      <template #codes>
        <DemoCode title="模板 - 内置图标" :code="codes.icons.innerTemplate" />
        <DemoCode title="模板 - 自定义图标" :code="codes.icons.customTemplate" />
        <DemoCode title="脚本 - 自定义图标" :code="codes.icons.script" />
      </template>
    </DemoSection>

    <!-- 提示位置示例 -->
    <DemoSection title="提示位置" desc="支持顶部、中部和底部不同位置显示">
      <view class="space-y-3">
        <wd-button block @click="showTopToast">顶部位置</wd-button>
        <wd-button block @click="showMiddletoast">中部位置</wd-button>
        <wd-button block @click="showBottomToast">底部位置</wd-button>
      </view>

      <template #codes>
        <DemoCode title="模板 - 顶部位置" :code="codes.position.topTemplate" />
        <DemoCode title="模板 - 中部位置" :code="codes.position.middleTemplate" />
        <DemoCode title="模板 - 底部位置" :code="codes.position.bottomTemplate" />
        <DemoCode title="脚本 - 提示位置" :code="codes.position.script" />
      </template>
    </DemoSection>

    <!-- 加载状态示例 -->
    <DemoSection title="加载状态" desc="显示加载中状态，支持不同样式和自动关闭">
      <view class="space-y-3">
        <wd-button block @click="showLoadingToast">基本加载</wd-button>
        <wd-button block @click="showLoadingToast2">环形加载</wd-button>
        <wd-button block @click="showLoadingToast3">纵向加载</wd-button>
      </view>

      <template #codes>
        <DemoCode title="模板 - 基本加载" :code="codes.loading.basicTemplate" />
        <DemoCode title="模板 - 环形加载" :code="codes.loading.ringTemplate" />
        <DemoCode title="模板 - 纵向加载" :code="codes.loading.verticalTemplate" />
        <DemoCode title="脚本 - 加载状态" :code="codes.loading.script" />
      </template>
    </DemoSection>

    <!-- 排版方向示例 -->
    <DemoSection title="排版方向" desc="支持横向和纵向两种排版方式">
      <view class="space-y-3">
        <wd-button block @click="showHorizonToast">横向排版</wd-button>
        <wd-button block @click="showVerticalToast">纵向排版</wd-button>
      </view>

      <template #codes>
        <DemoCode title="模板 - 横向排版" :code="codes.direction.horizontalTemplate" />
        <DemoCode title="模板 - 纵向排版" :code="codes.direction.verticalTemplate" />
        <DemoCode title="脚本 - 排版方向" :code="codes.direction.script" />
      </template>
    </DemoSection>

    <!-- 事件监听示例 -->
    <DemoSection title="事件监听" desc="监听Toast的打开和关闭事件">
      <!-- 状态显示区域 -->
      <view class="space-y-4">
        <!-- 控制按钮 -->
        <wd-button block type="primary" @click="showEventToast">事件监听提示</wd-button>

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

    <!-- Toast 组件实例 -->
    <wd-toast />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/wd'

// ===== 组件状态管理 =====

// Toast 实例
const toast = useToast()

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
    basicTemplate: `<wd-button @click="showToast" block>基本提示</wd-button>`,

    longTemplate: `<wd-button @click="showLongToast" block>长文案提示</wd-button>`,

    script: `import { useToast } from '@/wd'

// Toast 实例
const toast = useToast()

// 基本 toast 提示
const showToast = () => {
  toast.show('提示信息')
}

// 长文案 toast
const showLongToast = () => {
  toast.show('这是一段很长很长很长很长很长很长很长很长很长很长很长很长的文案')
}`,
  },

  // 提示类型代码
  types: {
    successTemplate: `<wd-button @click="showSuccessToast" type="success" block>成功提示</wd-button>`,

    errorTemplate: `<wd-button @click="showErrorToast" type="error" block>错误提示</wd-button>`,

    warningTemplate: `<wd-button @click="showWarnToast" type="warning" block>警告提示</wd-button>`,

    infoTemplate: `<wd-button @click="showNormalToast" block>信息提示</wd-button>`,

    script: `// 成功类型 toast
const showSuccessToast = () => {
  toast.success('操作成功')
}

// 错误类型 toast
const showErrorToast = () => {
  toast.error('错误提示错误提示')
}

// 警告类型 toast
const showWarnToast = () => {
  toast.warning('提示信息')
}

// 常规类型 toast
const showNormalToast = () => {
  toast.info('常规提示常规提示')
}`,
  },

  // 自定义图标代码
  icons: {
    innerTemplate: `<wd-button @click="showInnerIconToast" block>内置图标</wd-button>`,

    customTemplate: `<wd-button @click="showCustomIconToast" block>自定义图标</wd-button>`,

    script: `// 内部图标 toast
const showInnerIconToast = () => {
  toast.show({
    iconClass: 'star',
    msg: '使用组件库内部图标'
  })
}

// 自定义图标 toast
const showCustomIconToast = () => {
  toast.show({
    iconClass: 'kehuishouwu',
    classPrefix: 'fish',
    msg: '使用自定义图标'
  })
}`,
  },

  // 提示位置代码
  position: {
    topTemplate: `<wd-button @click="showTopToast" block>顶部位置</wd-button>`,

    middleTemplate: `<wd-button @click="showMiddletoast" block>中部位置</wd-button>`,

    bottomTemplate: `<wd-button @click="showBottomToast" block>底部位置</wd-button>`,

    script: `// 顶部位置 toast
const showTopToast = () => {
  toast.show({
    position: 'top',
    iconClass: 'star',
    msg: '提示信息',
    closed() {
      console.log('toast closed')
    },
    opened() {
      console.log('toast opened')
    }
  })
}

// 居中位置 toast
const showMiddletoast = () => {
  toast.show({
    position: 'middle',
    iconClass: 'star',
    msg: '提示信息'
  })
}

// 底部位置 toast
const showBottomToast = () => {
  toast.show({
    position: 'bottom',
    msg: '提示信息'
  })
}`,
  },

  // 加载状态代码
  loading: {
    basicTemplate: `<wd-button @click="showLoadingToast" block>基本加载</wd-button>`,

    ringTemplate: `<wd-button @click="showLoadingToast2" block>环形加载</wd-button>`,

    verticalTemplate: `<wd-button @click="showLoadingToast3" block>纵向加载</wd-button>`,

    script: `// 基本 loading toast
const showLoadingToast = () => {
  toast.loading('3s后调用close关闭')
  setTimeout(() => {
    toast.close()
  }, 3000)
}

// ring 类型 loading toast
const showLoadingToast2 = () => {
  toast.loading({
    msg: '3s后调用close关闭',
    loadingType: 'ring',
    loadingColor: '#fff'
  })
  setTimeout(() => {
    toast.close()
  }, 3000)
}

// 纵向布局 loading toast
const showLoadingToast3 = () => {
  toast.loading({
    msg: '长文案内容...',
    direction: 'vertical'
  })
  setTimeout(() => {
    toast.close()
  }, 3000)
}`,
  },

  // 排版方向代码
  direction: {
    horizontalTemplate: `<wd-button @click="showHorizonToast" block>横向排版</wd-button>`,

    verticalTemplate: `<wd-button @click="showVerticalToast" block>纵向排版</wd-button>`,

    script: `// 横向排版 toast
const showHorizonToast = () => {
  toast.success('横向排版')
}

// 纵向排版 toast
const showVerticalToast = () => {
  toast.success({
    msg: '长文案内容，演示纵向排版效果',
    direction: 'vertical'
  })
}`,
  },

  // 事件监听代码
  events: {
    template: `
      <wd-button @click="showEventToast" block type="primary">事件监听提示</wd-button>`,

    methods: `// 事件监听提示
const showEventToast = () => {
  addEventLog('准备显示Toast', 'info')
  toast.show({
    msg: '事件监听演示',
    opened() {
      addEventLog('Toast已打开', 'success')
    },
    closed() {
      addEventLog('Toast已关闭', 'success')
    }
  })
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
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'msg',
    type: 'String',
    default: '""',
    desc: '提示信息内容',
  },
  {
    name: 'duration',
    type: 'Number',
    default: '2000',
    desc: '显示时长，单位为毫秒，设为0则不会自动关闭',
  },
  {
    name: 'direction',
    type: 'String',
    default: '"horizontal"',
    desc: '排列方向，可选值：horizontal / vertical',
  },
  {
    name: 'icon-name',
    type: 'String',
    default: '""',
    desc: '图标名称，可选值：success / error / warning / loading / info',
  },
  {
    name: 'icon-size',
    type: 'Number',
    default: '-',
    desc: '图标大小',
  },
  {
    name: 'loading-type',
    type: 'String',
    default: '"outline"',
    desc: '加载类型，可选值：outline / ring',
  },
  {
    name: 'loading-color',
    type: 'String',
    default: '"#4D80F0"',
    desc: '加载颜色',
  },
  {
    name: 'loading-size',
    type: 'Number',
    default: '45',
    desc: '加载大小',
  },
  {
    name: 'icon-color',
    type: 'String',
    default: '""',
    desc: '图标颜色',
  },
  {
    name: 'position',
    type: 'String',
    default: '"middle-top"',
    desc: '弹出位置，可选值：top / middle-top / middle / bottom',
  },
  {
    name: 'z-index',
    type: 'Number',
    default: '1000',
    desc: '元素层级',
  },
  {
    name: 'cover',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示遮罩层',
  },
  {
    name: 'icon-class',
    type: 'String',
    default: '""',
    desc: '自定义图标类名',
  },
  {
    name: 'class-prefix',
    type: 'String',
    default: '"wd-icon"',
    desc: '自定义图标类名前缀',
  },
  {
    name: 'selector',
    type: 'String',
    default: '""',
    desc: '自定义选择器，用于多实例场景',
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
    desc: '显示Toast，参数为配置对象或字符串',
  },
  {
    name: 'success(options)',
    desc: '显示成功类型Toast',
  },
  {
    name: 'error(options)',
    desc: '显示错误类型Toast',
  },
  {
    name: 'warning(options)',
    desc: '显示警告类型Toast',
  },
  {
    name: 'info(options)',
    desc: '显示信息类型Toast',
  },
  {
    name: 'loading(options)',
    desc: '显示加载类型Toast',
  },
  {
    name: 'close()',
    desc: '关闭Toast',
  },
]

// Events 事件文档
const apiEvents = [
  {
    name: 'opened',
    desc: 'Toast完全展示后触发',
  },
  {
    name: 'closed',
    desc: 'Toast完全关闭后触发',
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
 * 基本toast提示
 */
const showToast = () => {
  toast.show('提示信息')
}

/**
 * 长文案toast
 */
const showLongToast = () => {
  toast.show('这是一段很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的文案')
}

/**
 * 成功类型toast
 */
const showSuccessToast = () => {
  toast.success('操作成功')
}

/**
 * 错误类型toast
 */
const showErrorToast = () => {
  toast.error('错误提示错误提示')
}

/**
 * 警告类型toast
 */
const showWarnToast = () => {
  toast.warning('提示信息')
}

/**
 * 常规类型toast
 */
const showNormalToast = () => {
  toast.info('常规提示常规提示')
}

/**
 * 顶部位置toast
 */
const showTopToast = () => {
  toast.show({
    position: 'top',
    iconClass: 'star',
    msg: '提示信息',
    closed() {
      console.log('toast closed')
    },
    opened() {
      console.log('toast opened')
    },
  })
}

/**
 * 居中位置toast
 */
const showMiddletoast = () => {
  toast.show({
    position: 'middle',
    iconClass: 'star',
    msg: '提示信息',
    closed() {
      console.log('toast closed')
    },
    opened() {
      console.log('toast opened')
    },
  })
}

/**
 * 底部位置toast
 */
const showBottomToast = () => {
  toast.show({
    position: 'bottom',
    msg: '提示信息',
  })
}

/**
 * 基本loading toast
 */
const showLoadingToast = () => {
  toast.loading('3s后调用close关闭')
  setTimeout(() => {
    toast.close()
  }, 3000)
}

/**
 * ring类型loading toast
 */
const showLoadingToast2 = () => {
  toast.loading({
    msg: '3s后调用close关闭',
    loadingType: 'ring',
    loadingColor: '#fff',
  })
  setTimeout(() => {
    toast.close()
  }, 3000)
}

/**
 * 纵向布局loading toast
 */
const showLoadingToast3 = () => {
  toast.loading({
    msg: '芦叶满汀洲，寒沙带浅流。二十年重过南楼。柳下系船犹未稳，能几日，又中秋。黄鹤断矶头，故人曾到否？旧江山浑是新愁。欲买桂花同载酒，终不似，少年游。',
    direction: 'vertical',
  })
  setTimeout(() => {
    toast.close()
  }, 3000)
}

/**
 * 内部图标toast
 */
const showInnerIconToast = () => {
  toast.show({
    iconClass: 'star',
    msg: '使用组件库内部图标',
  })
}

/**
 * 自定义图标toast
 */
const showCustomIconToast = () => {
  toast.show({
    iconClass: 'kehuishouwu',
    classPrefix: 'fish',
    msg: '使用自定义图标',
  })
}

/**
 * 横向排版toast
 */
const showHorizonToast = () => {
  toast.success('横向排版')
}

/**
 * 纵向排版toast
 */
const showVerticalToast = () => {
  toast.success({
    msg: '芦叶满汀洲，寒沙带浅流。二十年重过南楼。柳下系船犹未稳，能几日，又中秋。黄鹤断矶头，故人曾到否？旧江山浑是新愁。欲买桂花同载酒，终不似，少年游。',
    direction: 'vertical',
  })
}

/**
 * 事件监听toast
 */
const showEventToast = () => {
  addEventLog('准备显示Toast', 'info')
  toast.show({
    msg: '事件监听演示',
    opened() {
      addEventLog('Toast已打开', 'success')
    },
    closed() {
      addEventLog('Toast已关闭', 'success')
    },
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

<style lang="scss" scoped></style>
