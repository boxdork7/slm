<!-- Curtain 幕帘 http://127.0.0.1:100/#/pages-sub/demo/wd/curtain -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Curtain 幕帘" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的幕帘弹窗，通常用于公告展示">
      <!-- 示例效果展示 -->
      <view class="space-y-3">
        <wd-button block @click="showBasic">显示基本幕帘</wd-button>
        <wd-button block type="primary" @click="showWithLink">带跳转链接的幕帘</wd-button>
      </view>

      <!-- 基本幕帘 -->
      <wd-curtain
        v-model="show1"
        :src="demoImage"
        :width="560"
        @click="handleBasicClick"
        @close="handleBasicClose"
        @load="handleImageLoad"
        @error="handleImageError"
      />

      <!-- 带跳转链接的幕帘 -->
      <wd-curtain
        v-model="show2"
        :src="demoImage"
        :to="jumpLink"
        :width="600"
        @click="handleLinkClick"
      />

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基本幕帘" :code="codes.basic.basicTemplate" />
        <DemoCode title="模板 - 带跳转链接" :code="codes.basic.linkTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 关闭按钮位置示例 -->
    <DemoSection title="关闭按钮位置" desc="支持多种关闭按钮位置设置">
      <view class="space-y-4">
        <!-- 顶部位置按钮组 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">顶部位置</view>
          <view class="flex flex-wrap gap-2">
            <wd-button size="small" @click="showTopLeft">左上</wd-button>
            <wd-button size="small" @click="showTop">顶部</wd-button>
            <wd-button size="small" @click="showTopRight">右上</wd-button>
          </view>
        </view>

        <!-- 底部位置按钮组 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">底部位置</view>
          <view class="flex flex-wrap gap-2">
            <wd-button size="small" @click="showBottomLeft">左下</wd-button>
            <wd-button size="small" @click="showBottom">底部</wd-button>
            <wd-button size="small" @click="showBottomRight">右下</wd-button>
          </view>
        </view>

        <!-- 内嵌位置按钮 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">内嵌位置</view>
          <wd-button size="small" @click="showInset">内嵌（默认）</wd-button>
        </view>
      </view>

      <!-- 各种位置的幕帘 -->
      <wd-curtain v-model="show3" :src="demoImage" close-position="top-left" :width="480" />
      <wd-curtain v-model="show4" :src="demoImage" close-position="top" :width="480" />
      <wd-curtain v-model="show5" :src="demoImage" close-position="top-right" :width="480" />
      <wd-curtain v-model="show6" :src="demoImage" close-position="bottom-left" :width="480" />
      <wd-curtain v-model="show7" :src="demoImage" close-position="bottom" :width="480" />
      <wd-curtain v-model="show8" :src="demoImage" close-position="bottom-right" :width="480" />
      <wd-curtain v-model="show9" :src="demoImage" close-position="inset" :width="480" />

      <template #codes>
        <DemoCode title="模板 - 顶部位置" :code="codes.position.topTemplate" />
        <DemoCode title="模板 - 底部位置" :code="codes.position.bottomTemplate" />
        <DemoCode title="模板 - 内嵌位置" :code="codes.position.insetTemplate" />
        <DemoCode title="脚本 - 位置控制" :code="codes.position.script" />
      </template>
    </DemoSection>

    <!-- 高级配置示例 -->
    <DemoSection title="高级配置" desc="更多配置选项和交互控制">
      <view class="space-y-3">
        <wd-button block type="warning" @click="showModalClose">点击遮罩关闭</wd-button>
        <wd-button block @click="showCustomSize">自定义尺寸</wd-button>
        <wd-button block @click="showHighZIndex">高层级显示</wd-button>
      </view>

      <!-- 点击遮罩关闭 -->
      <wd-curtain
        v-model="show10"
        :src="demoImage"
        :width="520"
        :close-on-click-modal="true"
        @click-modal="handleModalClick"
      />

      <!-- 自定义尺寸 -->
      <wd-curtain v-model="show11" :src="demoImage" :width="640" close-position="bottom-right" />

      <!-- 高层级显示 -->
      <wd-curtain
        v-model="show12"
        :src="demoImage"
        :width="560"
        :z-index="200"
        close-position="top"
      />

      <template #codes>
        <DemoCode title="模板 - 点击遮罩关闭" :code="codes.advanced.modalTemplate" />
        <DemoCode title="模板 - 自定义尺寸" :code="codes.advanced.sizeTemplate" />
        <DemoCode title="模板 - 高层级显示" :code="codes.advanced.zIndexTemplate" />
        <DemoCode title="脚本 - 高级配置" :code="codes.advanced.script" />
      </template>
    </DemoSection>

    <!-- 自定义关闭按钮示例 -->
    <DemoSection title="自定义关闭按钮" desc="通过插槽自定义关闭按钮样式">
      <view class="space-y-3">
        <wd-button block type="success" @click="showCustomClose1">文字关闭按钮</wd-button>
        <wd-button block type="success" @click="showCustomClose2">图标关闭按钮</wd-button>
        <wd-button block type="success" @click="showCustomClose3">彩色关闭按钮</wd-button>
      </view>

      <!-- 文字关闭按钮 -->
      <wd-curtain v-model="show13" :src="demoImage" :width="560">
        <template #close>
          <view
            class="absolute right-2 top-2 rounded bg-black bg-opacity-50 px-2 py-1 text-sm text-white"
            @click="handleCustomClose1"
          >
            关闭
          </view>
        </template>
      </wd-curtain>

      <!-- 图标关闭按钮 -->
      <wd-curtain v-model="show14" :src="demoImage" :width="560">
        <template #close>
          <view
            class="absolute right-2 top-2 h-8 w-8 flex items-center justify-center rounded-full bg-red-500 text-white"
            @click="handleCustomClose2"
          >
            ✕
          </view>
        </template>
      </wd-curtain>

      <!-- 彩色关闭按钮 -->
      <wd-curtain v-model="show15" :src="demoImage" :width="560">
        <template #close>
          <view
            class="absolute h-10 w-10 flex items-center justify-center rounded-full from-pink-500 to-rose-500 bg-gradient-to-r text-white shadow-lg -right-3 -top-3"
            @click="handleCustomClose3"
          >
            ×
          </view>
        </template>
      </wd-curtain>

      <template #codes>
        <DemoCode title="模板 - 文字关闭按钮" :code="codes.custom.textTemplate" />
        <DemoCode title="模板 - 图标关闭按钮" :code="codes.custom.iconTemplate" />
        <DemoCode title="模板 - 彩色关闭按钮" :code="codes.custom.colorTemplate" />
        <DemoCode title="脚本 - 自定义按钮" :code="codes.custom.script" />
      </template>
    </DemoSection>

    <!-- 事件监听示例 -->
    <DemoSection title="事件监听" desc="监听幕帘的各种生命周期事件">
      <!-- 状态显示区域 -->
      <view class="space-y-4">
        <!-- 控制按钮 -->
        <wd-button block type="primary" @click="showEvents">打开事件监听幕帘</wd-button>

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

      <!-- 事件监听幕帘 -->
      <wd-curtain
        v-model="show16"
        :src="demoImage"
        :width="560"
        :close-on-click-modal="true"
        @beforeenter="handleBeforeEnter"
        @enter="handleEnter"
        @afterenter="handleAfterEnter"
        @beforeleave="handleBeforeLeave"
        @leave="handleLeave"
        @afterleave="handleAfterLeave"
        @close="handleEventClose"
        @closed="handleClosed"
        @click-modal="handleEventClickModal"
        @click="handleEventClick"
        @load="handleEventLoad"
        @error="handleEventError"
      />

      <template #codes>
        <DemoCode title="事件监听模板" :code="codes.events.template" />
        <DemoCode title="事件处理方法" :code="codes.events.methods" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// ===== 组件状态管理 =====

// 各个幕帘的显示状态
const show1 = ref<boolean>(false)
const show2 = ref<boolean>(false)
const show3 = ref<boolean>(false)
const show4 = ref<boolean>(false)
const show5 = ref<boolean>(false)
const show6 = ref<boolean>(false)
const show7 = ref<boolean>(false)
const show8 = ref<boolean>(false)
const show9 = ref<boolean>(false)
const show10 = ref<boolean>(false)
const show11 = ref<boolean>(false)
const show12 = ref<boolean>(false)
const show13 = ref<boolean>(false)
const show14 = ref<boolean>(false)
const show15 = ref<boolean>(false)
const show16 = ref<boolean>(false)

// 事件日志状态
interface EventLog {
  time: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

const eventLogs = ref<EventLog[]>([])

// 图片资源配置
const demoImage = ref<string>(
  'https://img20.360buyimg.com/da/jfs/t1/141592/25/8861/261559/5f68d8c1E33ed78ab/698ad655bfcfbaed.png',
)

// 跳转链接配置
const jumpLink = ref<string>('/pages/index/index')

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    basicTemplate: `<wd-curtain
  v-model="show1"
  :src="demoImage"
  :width="560"
  @click="handleBasicClick"
  @close="handleBasicClose"
/>`,

    linkTemplate: `<wd-curtain
  v-model="show2"
  :src="demoImage"
  :to="jumpLink"
  :width="600"
  @click="handleLinkClick"
/>`,

    script: `import { ref } from 'vue'

const show1 = ref(false)
const show2 = ref(false)
const demoImage = ref('https://example.com/demo-image.png')
const jumpLink = ref('/pages/index/index')

const showBasic = () => {
  show1.value = true
}

const showWithLink = () => {
  show2.value = true
}

const handleBasicClick = () => {
  console.log('点击了幕帘图片')
}

const handleBasicClose = () => {
  console.log('幕帘已关闭')
}`,
  },

  // 关闭按钮位置代码
  position: {
    topTemplate: `<!-- 顶部位置 -->
<wd-curtain v-model="show1" :src="demoImage" close-position="top-left" :width="480" />
<wd-curtain v-model="show2" :src="demoImage" close-position="top" :width="480" />
<wd-curtain v-model="show3" :src="demoImage" close-position="top-right" :width="480" />`,

    bottomTemplate: `<!-- 底部位置 -->
<wd-curtain v-model="show4" :src="demoImage" close-position="bottom-left" :width="480" />
<wd-curtain v-model="show5" :src="demoImage" close-position="bottom" :width="480" />
<wd-curtain v-model="show6" :src="demoImage" close-position="bottom-right" :width="480" />`,

    insetTemplate: `<!-- 内嵌位置（默认） -->
<wd-curtain v-model="show7" :src="demoImage" close-position="inset" :width="480" />`,

    script: `// 位置类型定义
type ClosePosition = 'inset' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

// 显示不同位置的幕帘
const showTopLeft = () => {
  show3.value = true
}

const showTop = () => {
  show4.value = true
}

const showTopRight = () => {
  show5.value = true
}`,
  },

  // 高级配置代码
  advanced: {
    modalTemplate: `<wd-curtain
  v-model="show"
  :src="demoImage"
  :width="520"
  :close-on-click-modal="true"
  @click-modal="handleModalClick"
/>`,

    sizeTemplate: `<wd-curtain
  v-model="show"
  :src="demoImage"
  :width="640"
  close-position="bottom-right"
/>`,

    zIndexTemplate: `<wd-curtain
  v-model="show"
  :src="demoImage"
  :width="560"
  :z-index="200"
  close-position="top"
/>`,

    script: `// 高级配置选项
const showModalClose = () => {
  show10.value = true
}

const showCustomSize = () => {
  show11.value = true
}

const showHighZIndex = () => {
  show12.value = true
}

const handleModalClick = () => {
  console.log('点击了遮罩层')
}`,
  },

  // 自定义关闭按钮代码
  custom: {
    textTemplate: `<wd-curtain v-model="show" :src="demoImage" :width="560">
  <template #close>
    <view
      class="absolute right-2 top-2 rounded bg-black bg-opacity-50 px-2 py-1 text-sm text-white"
      @click="handleCustomClose"
    >
      关闭
    </view>
  </template>
</wd-curtain>`,

    iconTemplate: `<wd-curtain v-model="show" :src="demoImage" :width="560">
  <template #close>
    <view
      class="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white"
      @click="handleCustomClose"
    >
      ✕
    </view>
  </template>
</wd-curtain>`,

    colorTemplate: `<wd-curtain v-model="show" :src="demoImage" :width="560">
  <template #close>
    <view
      class="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg"
      @click="handleCustomClose"
    >
      ×
    </view>
  </template>
</wd-curtain>`,

    script: `// 自定义关闭按钮事件
const handleCustomClose1 = () => {
  show13.value = false
  console.log('文字关闭按钮被点击')
}

const handleCustomClose2 = () => {
  show14.value = false
  console.log('图标关闭按钮被点击')
}

const handleCustomClose3 = () => {
  show15.value = false
  console.log('彩色关闭按钮被点击')
}`,
  },

  // 事件监听代码
  events: {
    template: `
      <wd-curtain
        v-model="show"
        :src="demoImage"
        :width="560"
        :close-on-click-modal="true"
        @beforeenter="handleBeforeEnter"
        @enter="handleEnter"
        @afterenter="handleAfterEnter"
        @beforeleave="handleBeforeLeave"
        @leave="handleLeave"
        @afterleave="handleAfterLeave"
        @close="handleEventClose"
        @closed="handleClosed"
        @click-modal="handleEventClickModal"
        @click="handleEventClick"
        @load="handleEventLoad"
        @error="handleEventError"
      />`,

    methods: `const handleBeforeEnter = () => {
  addEventLog('幕帘开始进入', 'info')
}

const handleEnter = () => {
  addEventLog('幕帘进入中', 'info')
}

const handleAfterEnter = () => {
  addEventLog('幕帘进入完成', 'success')
}

const handleBeforeLeave = () => {
  addEventLog('幕帘开始离开', 'info')
}

const handleLeave = () => {
  addEventLog('幕帘离开中', 'info')
}

const handleAfterLeave = () => {
  addEventLog('幕帘离开完成', 'success')
}

const handleEventClose = () => {
  addEventLog('幕帘关闭', 'warning')
}

const handleClosed = () => {
  addEventLog('幕帘关闭完成', 'success')
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
    desc: '绑定值，控制幕帘显示隐藏',
  },
  {
    name: 'src',
    type: 'String',
    default: '""',
    desc: '幕帘图片地址，必须使用网络地址',
  },
  {
    name: 'width',
    type: 'Number',
    default: '560',
    desc: '幕帘图片宽度，高度会根据图片比例自动计算',
  },
  {
    name: 'close-position',
    type: 'String',
    default: '"inset"',
    desc: '关闭按钮位置：inset / top / bottom / top-left / top-right / bottom-left / bottom-right',
  },
  {
    name: 'to',
    type: 'String',
    default: '""',
    desc: '幕帘图片点击跳转链接',
  },
  {
    name: 'close-on-click-modal',
    type: 'Boolean',
    default: 'false',
    desc: '点击遮罩是否关闭幕帘',
  },
  {
    name: 'hide-when-close',
    type: 'Boolean',
    default: 'true',
    desc: '是否当关闭时将弹出层隐藏（display: none)',
  },
  {
    name: 'z-index',
    type: 'Number',
    default: '100',
    desc: '设置幕帘的层级',
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
  {
    name: 'custom-close-class',
    type: 'String',
    default: '""',
    desc: '自定义关闭按钮的类名',
  },
  {
    name: 'custom-close-style',
    type: 'String',
    default: '""',
    desc: '自定义关闭按钮的样式',
  },
]

// Events 事件文档
const apiEvents = [
  {
    name: 'beforeenter',
    desc: '进入前触发',
  },
  {
    name: 'enter',
    desc: '进入时触发',
  },
  {
    name: 'afterenter',
    desc: '进入后触发',
  },
  {
    name: 'beforeleave',
    desc: '离开前触发',
  },
  {
    name: 'leave',
    desc: '离开时触发',
  },
  {
    name: 'afterleave',
    desc: '离开后触发',
  },
  {
    name: 'close',
    desc: '关闭时触发',
  },
  {
    name: 'closed',
    desc: '关闭后触发',
  },
  {
    name: 'click-modal',
    desc: '点击遮罩时触发',
  },
  {
    name: 'click',
    desc: '点击图片时触发',
  },
  {
    name: 'load',
    desc: '图片加载完成时触发',
  },
  {
    name: 'error',
    desc: '图片加载错误时触发',
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
 * 显示基本幕帘
 */
const showBasic = () => {
  show1.value = true
  console.log('显示基本幕帘')
}

/**
 * 显示带跳转链接的幕帘
 */
const showWithLink = () => {
  show2.value = true
  console.log('显示带跳转链接的幕帘')
}

/**
 * 显示左上角关闭按钮
 */
const showTopLeft = () => {
  show3.value = true
  console.log('显示左上角关闭按钮幕帘')
}

/**
 * 显示顶部关闭按钮
 */
const showTop = () => {
  show4.value = true
  console.log('显示顶部关闭按钮幕帘')
}

/**
 * 显示右上角关闭按钮
 */
const showTopRight = () => {
  show5.value = true
  console.log('显示右上角关闭按钮幕帘')
}

/**
 * 显示左下角关闭按钮
 */
const showBottomLeft = () => {
  show6.value = true
  console.log('显示左下角关闭按钮幕帘')
}

/**
 * 显示底部关闭按钮
 */
const showBottom = () => {
  show7.value = true
  console.log('显示底部关闭按钮幕帘')
}

/**
 * 显示右下角关闭按钮
 */
const showBottomRight = () => {
  show8.value = true
  console.log('显示右下角关闭按钮幕帘')
}

/**
 * 显示内嵌关闭按钮
 */
const showInset = () => {
  show9.value = true
  console.log('显示内嵌关闭按钮幕帘')
}

/**
 * 显示点击遮罩关闭幕帘
 */
const showModalClose = () => {
  show10.value = true
  console.log('显示点击遮罩关闭幕帘')
}

/**
 * 显示自定义尺寸幕帘
 */
const showCustomSize = () => {
  show11.value = true
  console.log('显示自定义尺寸幕帘')
}

/**
 * 显示高层级幕帘
 */
const showHighZIndex = () => {
  show12.value = true
  console.log('显示高层级幕帘')
}

/**
 * 显示自定义关闭按钮1
 */
const showCustomClose1 = () => {
  show13.value = true
  console.log('显示文字关闭按钮幕帘')
}

/**
 * 显示自定义关闭按钮2
 */
const showCustomClose2 = () => {
  show14.value = true
  console.log('显示图标关闭按钮幕帘')
}

/**
 * 显示自定义关闭按钮3
 */
const showCustomClose3 = () => {
  show15.value = true
  console.log('显示彩色关闭按钮幕帘')
}

/**
 * 显示事件监听幕帘
 */
const showEvents = () => {
  show16.value = true
  addEventLog('显示事件监听幕帘', 'info')
}

// === 基本用法事件处理方法 ===

/**
 * 基本幕帘点击事件
 */
const handleBasicClick = () => {
  console.log('点击了基本幕帘图片')
}

/**
 * 基本幕帘关闭事件
 */
const handleBasicClose = () => {
  console.log('基本幕帘已关闭')
}

/**
 * 带链接幕帘点击事件
 */
const handleLinkClick = () => {
  console.log('点击了带跳转链接的幕帘图片')
}

/**
 * 图片加载完成事件
 */
const handleImageLoad = () => {
  console.log('幕帘图片加载完成')
}

/**
 * 图片加载错误事件
 */
const handleImageError = () => {
  console.log('幕帘图片加载失败')
}

// === 高级配置事件处理方法 ===

/**
 * 点击遮罩事件
 */
const handleModalClick = () => {
  console.log('点击了遮罩层')
}

// === 自定义关闭按钮事件处理方法 ===

/**
 * 文字关闭按钮点击事件
 */
const handleCustomClose1 = () => {
  show13.value = false
  console.log('文字关闭按钮被点击')
}

/**
 * 图标关闭按钮点击事件
 */
const handleCustomClose2 = () => {
  show14.value = false
  console.log('图标关闭按钮被点击')
}

/**
 * 彩色关闭按钮点击事件
 */
const handleCustomClose3 = () => {
  show15.value = false
  console.log('彩色关闭按钮被点击')
}

// === 生命周期事件处理方法 ===

/**
 * 进入前事件
 */
const handleBeforeEnter = () => {
  addEventLog('幕帘开始进入', 'info')
}

/**
 * 进入事件
 */
const handleEnter = () => {
  addEventLog('幕帘进入中', 'info')
}

/**
 * 进入后事件
 */
const handleAfterEnter = () => {
  addEventLog('幕帘进入完成', 'success')
}

/**
 * 离开前事件
 */
const handleBeforeLeave = () => {
  addEventLog('幕帘开始离开', 'info')
}

/**
 * 离开事件
 */
const handleLeave = () => {
  addEventLog('幕帘离开中', 'info')
}

/**
 * 离开后事件
 */
const handleAfterLeave = () => {
  addEventLog('幕帘离开完成', 'success')
}

/**
 * 事件关闭事件
 */
const handleEventClose = () => {
  addEventLog('幕帘关闭', 'warning')
}

/**
 * 关闭完成事件
 */
const handleClosed = () => {
  addEventLog('幕帘关闭完成', 'success')
}

/**
 * 事件点击遮罩事件
 */
const handleEventClickModal = () => {
  addEventLog('点击了遮罩层', 'warning')
}

/**
 * 事件点击图片事件
 */
const handleEventClick = () => {
  addEventLog('点击了幕帘图片', 'success')
}

/**
 * 事件图片加载完成事件
 */
const handleEventLoad = () => {
  addEventLog('图片加载完成', 'success')
}

/**
 * 事件图片加载错误事件
 */
const handleEventError = () => {
  addEventLog('图片加载失败', 'error')
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
