<!-- Overlay 遮罩层 http://127.0.0.1:100/#/pages-sub/demo/wd/overlay -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Overlay 遮罩层" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的遮罩层形式，点击遮罩层关闭">
      <!-- 示例效果展示 -->
      <view class="space-y-3">
        <wd-button type="primary" block @click="showBasic">显示基础遮罩层</wd-button>
        <wd-button type="success" block @click="showClickDisabled">禁用点击关闭</wd-button>
      </view>

      <!-- 基础遮罩层 -->
      <wd-overlay :show="show1" @click="handleBasicClick" />

      <!-- 禁用点击关闭的遮罩层 -->
      <wd-overlay :show="show2" />

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基础遮罩层" :code="codes.basic.template" />
        <DemoCode title="脚本 - 基础遮罩层" :code="codes.basic.script" />
        <DemoCode title="模板 - 禁用点击关闭" :code="codes.basic.disabledTemplate" />
      </template>
    </DemoSection>

    <!-- 嵌入内容示例 -->
    <DemoSection title="嵌入内容" desc="在遮罩层中嵌入自定义内容，支持事件冒泡控制">
      <view class="space-y-3">
        <wd-button type="primary" block @click="showContent">显示内容遮罩层</wd-button>
        <wd-button type="warning" block @click="showInteractive">交互式内容</wd-button>
      </view>

      <!-- 带内容的遮罩层 -->
      <wd-overlay :show="show3" @click="handleContentClick">
        <view class="h-full flex items-center justify-center">
          <view class="h-32 w-64 flex items-center justify-center rounded-lg bg-white shadow-lg" @click.stop>
            <view class="text-center">
              <view class="mb-2 text-lg font-medium">这是内容区域</view>
              <view class="text-sm text-gray-500">点击此区域不会关闭遮罩层</view>
            </view>
          </view>
        </view>
      </wd-overlay>

      <!-- 交互式内容遮罩层 -->
      <wd-overlay :show="show4" @click="handleInteractiveClick">
        <view class="h-full flex items-center justify-center">
          <view class="w-80 rounded-lg bg-white p-6 shadow-lg" @click.stop>
            <view class="mb-4 text-center">
              <view class="mb-2 text-lg font-medium">交互式内容</view>
              <view class="mb-4 text-sm text-gray-500">您可以与下方内容进行交互</view>
            </view>
            <view class="space-y-3">
              <wd-button block @click="handleButtonClick">点击我</wd-button>
              <wd-button type="error" block @click="closeInteractive">关闭遮罩层</wd-button>
            </view>
          </view>
        </view>
      </wd-overlay>

      <template #codes>
        <DemoCode title="模板 - 内容遮罩层" :code="codes.content.template" />
        <DemoCode title="脚本 - 内容遮罩层" :code="codes.content.script" />
        <DemoCode title="模板 - 交互式内容" :code="codes.content.interactiveTemplate" />
        <DemoCode title="脚本 - 交互式内容" :code="codes.content.interactiveScript" />
      </template>
    </DemoSection>

    <!-- 高级配置示例 -->
    <DemoSection title="高级配置" desc="自定义动画时长、层级和滚动锁定">
      <view class="space-y-3">
        <wd-button type="primary" block @click="showSlowAnimation">慢速动画 (800ms)</wd-button>
        <wd-button type="success" block @click="showHighZIndex">高层级遮罩层</wd-button>
        <wd-button type="warning" block @click="showNoLockScroll">不锁定滚动</wd-button>
      </view>

      <!-- 慢速动画遮罩层 -->
      <wd-overlay :show="show5" :duration="800" @click="handleSlowAnimationClick" />

      <!-- 高层级遮罩层 -->
      <wd-overlay :show="show6" :z-index="999" @click="handleHighZIndexClick" />

      <!-- 不锁定滚动的遮罩层 -->
      <wd-overlay :show="show7" :lock-scroll="false" @click="handleNoLockScrollClick">
        <view class="h-full flex items-center justify-center">
          <view class="w-64 rounded-lg bg-white p-4 shadow-lg" @click.stop>
            <view class="text-center">
              <view class="mb-2 text-lg font-medium">滚动未锁定</view>
              <view class="mb-4 text-sm text-gray-500">背景页面可以滚动</view>
              <wd-button block @click="closeNoLockScroll">关闭</wd-button>
            </view>
          </view>
        </view>
      </wd-overlay>

      <template #codes>
        <DemoCode title="模板 - 慢速动画" :code="codes.advanced.slowTemplate" />
        <DemoCode title="模板 - 高层级" :code="codes.advanced.highZIndexTemplate" />
        <DemoCode title="模板 - 不锁定滚动" :code="codes.advanced.noLockScrollTemplate" />
        <DemoCode title="脚本 - 高级配置" :code="codes.advanced.script" />
      </template>
    </DemoSection>

    <!-- 实际应用场景示例 -->
    <DemoSection title="实际应用场景" desc="常见的业务场景应用">
      <view class="space-y-3">
        <wd-button type="primary" block @click="showLoading">加载中遮罩</wd-button>
        <wd-button type="success" block @click="showImagePreview">图片预览</wd-button>
        <wd-button type="warning" block @click="showConfirm">确认对话框</wd-button>
      </view>

      <!-- 加载中遮罩层 -->
      <wd-overlay :show="show8">
        <view class="h-full flex items-center justify-center">
          <view class="rounded-lg bg-black bg-opacity-60 p-6 text-center">
            <wd-loading size="40" color="#fff" />
            <view class="mt-3 text-white">加载中...</view>
          </view>
        </view>
      </wd-overlay>

      <!-- 图片预览遮罩层 -->
      <wd-overlay :show="show9" @click="closeImagePreview">
        <view class="h-full flex items-center justify-center p-4">
          <image
            class="max-h-full max-w-full rounded-lg"
            src="https://img11.360buyimg.com/imagetools/jfs/t1/143248/37/5695/265818/5f3a8546E98d998a4/745897ca9c9e474b.jpg"
            mode="aspectFit"
            @click.stop
          />
        </view>
      </wd-overlay>

      <!-- 确认对话框遮罩层 -->
      <wd-overlay :show="show10" @click="closeConfirm">
        <view class="h-full flex items-center justify-center">
          <view class="w-80 rounded-lg bg-white p-6 shadow-lg" @click.stop>
            <view class="text-center">
              <view class="mb-4 text-lg font-medium">确认操作</view>
              <view class="mb-6 text-gray-600">您确定要执行此操作吗？</view>
              <view class="flex justify-between space-x-3">
                <wd-button type="error" block @click="handleConfirm">确认</wd-button>
                <wd-button block @click="closeConfirm">取消</wd-button>
              </view>
            </view>
          </view>
        </view>
      </wd-overlay>

      <template #codes>
        <DemoCode title="模板 - 加载中遮罩" :code="codes.scenarios.loadingTemplate" />
        <DemoCode title="模板 - 图片预览" :code="codes.scenarios.imagePreviewTemplate" />
        <DemoCode title="模板 - 确认对话框" :code="codes.scenarios.confirmTemplate" />
        <DemoCode title="脚本 - 应用场景" :code="codes.scenarios.script" />
      </template>
    </DemoSection>

    <!-- 事件监听示例 -->
    <DemoSection title="事件监听" desc="监听遮罩层的点击事件">
      <!-- 状态显示区域 -->
      <view class="space-y-4">
        <!-- 控制按钮 -->
        <wd-button block type="primary" @click="showEvents">打开事件监听遮罩层</wd-button>

        <!-- 事件日志显示 -->
        <view class="mx-4 rounded-lg bg-gray-50 p-4">
          <view class="mb-2 text-sm font-medium">事件日志</view>
          <view class="h-32 overflow-y-auto border rounded bg-white p-2">
            <view
              v-for="(log, index) in eventLogs"
              :key="index"
              class="mb-1 text-xs text-gray-600"
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

      <!-- 事件监听遮罩层 -->
      <wd-overlay :show="show11" @click="handleEventClick">
        <view class="h-full flex items-center justify-center">
          <view class="w-64 rounded-lg bg-white p-4 shadow-lg" @click.stop="handleContentBlockClick">
            <view class="text-center">
              <view class="mb-2 text-lg font-medium">事件监听</view>
              <view class="mb-4 text-sm text-gray-500">点击不同区域查看事件触发</view>
              <wd-button block @click="closeEvents">关闭遮罩层</wd-button>
            </view>
          </view>
        </view>
      </wd-overlay>

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

// 各个遮罩层的显示状态
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

// 事件日志状态
interface EventLog {
  time: string
  message: string
}

const eventLogs = ref<EventLog[]>([])

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    template: `<wd-overlay :show="show" @click="handleClick" />`,

    script: `import { ref } from 'vue'

const show = ref(false)

// 显示遮罩层
const showOverlay = () => {
  show.value = true
}

// 处理点击事件
const handleClick = () => {
  console.log('遮罩层被点击')
  show.value = false
}`,

    disabledTemplate: `<!-- 不监听点击事件，无法通过点击关闭 -->
<wd-overlay :show="show" />`,
  },

  // 嵌入内容代码
  content: {
    template: `<wd-overlay :show="show" @click="handleClick">
  <view class="flex items-center justify-center h-full">
    <view class="w-64 h-32 bg-white rounded-lg shadow-lg" @click.stop>
      <view class="text-center p-4">
        <view class="text-lg font-medium mb-2">这是内容区域</view>
        <view class="text-sm text-gray-500">点击此区域不会关闭遮罩层</view>
      </view>
    </view>
  </view>
</wd-overlay>`,

    script: `const show = ref(false)

// 显示内容遮罩层
const showContent = () => {
  show.value = true
}

// 处理遮罩层点击事件
const handleClick = () => {
  console.log('遮罩层背景被点击')
  show.value = false
}

// 内容区域点击事件（使用 @click.stop 阻止冒泡）
// 不需要单独处理，@click.stop 会自动阻止事件冒泡`,

    interactiveTemplate: `<wd-overlay :show="show" @click="handleClick">
  <view class="flex items-center justify-center h-full">
    <view class="w-80 bg-white rounded-lg p-6" @click.stop>
      <view class="text-center mb-4">
        <view class="text-lg font-medium">交互式内容</view>
      </view>
      <view class="space-y-3">
        <wd-button @click="handleButtonClick" block>点击我</wd-button>
        <wd-button type="error" @click="closeOverlay" block>关闭遮罩层</wd-button>
      </view>
    </view>
  </view>
</wd-overlay>`,

    interactiveScript: `// 处理按钮点击
const handleButtonClick = () => {
  console.log('内容区域按钮被点击')
}

// 关闭遮罩层
const closeOverlay = () => {
  show.value = false
}`,
  },

  // 高级配置代码
  advanced: {
    slowTemplate: `<wd-overlay
  :show="show"
  :duration="800"
  @click="handleClick"
/>`,

    highZIndexTemplate: `<wd-overlay
  :show="show"
  :z-index="999"
  @click="handleClick"
/>`,

    noLockScrollTemplate: `<wd-overlay
  :show="show"
  :lock-scroll="false"
  @click="handleClick"
>
  <!-- 内容区域 -->
</wd-overlay>`,

    script: `// 高级配置示例
const animationDuration = ref(800)
const overlayZIndex = ref(999)
const lockScroll = ref(false)

const showSlowAnimation = () => {
  show.value = true
}

const showHighZIndex = () => {
  show.value = true
}

const showNoLockScroll = () => {
  show.value = true
}`,
  },

  // 应用场景代码
  scenarios: {
    loadingTemplate: `<wd-overlay :show="show">
  <view class="flex items-center justify-center h-full">
    <view class="bg-black bg-opacity-60 rounded-lg p-6 text-center">
      <wd-loading size="40" color="#fff" />
      <view class="text-white mt-3">加载中...</view>
    </view>
  </view>
</wd-overlay>`,

    imagePreviewTemplate: `<wd-overlay :show="show" @click="closePreview">
  <view class="flex items-center justify-center h-full p-4">
    <image
      class="max-w-full max-h-full rounded-lg"
      src="https://example.com/image.jpg"
      mode="aspectFit"
      @click.stop
    />
  </view>
</wd-overlay>`,

    confirmTemplate: `<wd-overlay :show="show" @click="closeConfirm">
  <view class="flex items-center justify-center h-full">
    <view class="w-80 bg-white rounded-lg shadow-lg p-6" @click.stop>
      <view class="text-center">
        <view class="text-lg font-medium mb-4">确认操作</view>
        <view class="text-gray-600 mb-6">您确定要执行此操作吗？</view>
        <view class="flex justify-between space-x-3">
          <wd-button type="error" @click="handleConfirm" block>确认</wd-button>
          <wd-button @click="closeConfirm" block>取消</wd-button>
        </view>
      </view>
    </view>
  </view>
</wd-overlay>`,

    script: `// 应用场景数据
const loadingVisible = ref(false)
const imagePreviewVisible = ref(false)
const confirmVisible = ref(false)

// 显示加载遮罩
const showLoading = () => {
  loadingVisible.value = true
  // 模拟加载完成
  setTimeout(() => {
    loadingVisible.value = false
  }, 3000)
}

// 显示图片预览
const showImagePreview = () => {
  imagePreviewVisible.value = true
}

// 显示确认对话框
const showConfirm = () => {
  confirmVisible.value = true
}

// 处理确认操作
const handleConfirm = () => {
  console.log('用户确认操作')
  confirmVisible.value = false
}`,
  },

  // 事件监听代码
  events: {
    template: `<wd-overlay :show="show" @click="handleEventClick">
  <view class="flex items-center justify-center h-full">
    <view class="w-64 bg-white rounded-lg p-4" @click.stop="handleContentClick">
      <view class="text-center">
        <view class="text-lg font-medium mb-2">事件监听</view>
        <view class="text-sm text-gray-500 mb-4">点击不同区域查看事件触发</view>
        <wd-button @click="closeOverlay" block>关闭遮罩层</wd-button>
      </view>
    </view>
  </view>
</wd-overlay>`,

    methods: `// 事件日志
const eventLogs = ref([])

// 添加事件日志
const addEventLog = (message) => {
  eventLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message
  })
  // 限制日志数量
  if (eventLogs.value.length > 10) {
    eventLogs.value = eventLogs.value.slice(0, 10)
  }
}

// 处理遮罩层点击
const handleEventClick = () => {
  addEventLog('遮罩层背景被点击，准备关闭')
  show.value = false
}

// 处理内容区域点击
const handleContentClick = () => {
  addEventLog('内容区域被点击，阻止关闭')
}

// 清空事件日志
const clearEventLogs = () => {
  eventLogs.value = []
  addEventLog('事件日志已清空')
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'show',
    type: 'Boolean',
    default: 'false',
    desc: '是否展示遮罩层',
  },
  {
    name: 'duration',
    type: 'Number | Object | Boolean',
    default: '300',
    desc: '动画时长，单位毫秒，支持对象、数字或布尔值',
  },
  {
    name: 'lock-scroll',
    type: 'Boolean',
    default: 'true',
    desc: '是否锁定滚动，锁定时页面不能滚动',
  },
  {
    name: 'z-index',
    type: 'Number',
    default: '100',
    desc: '遮罩层层级，默认100（高于 tabbar 的 99）',
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
    desc: '点击遮罩层时触发',
  },
]

// Methods 方法文档（Overlay 组件没有暴露方法）
const apiMethods: any[] = []

// ===== 工具方法 =====

/**
 * 添加事件日志
 */
const addEventLog = (message: string) => {
  eventLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
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
  addEventLog('事件日志已清空')
}

// ===== 显示遮罩层方法 =====

/**
 * 显示基础遮罩层
 */
const showBasic = () => {
  show1.value = true
  console.log('显示基础遮罩层')
}

/**
 * 显示禁用点击关闭的遮罩层
 */
const showClickDisabled = () => {
  show2.value = true
  console.log('显示禁用点击关闭的遮罩层')
  // 3秒后自动关闭
  setTimeout(() => {
    show2.value = false
  }, 3000)
}

/**
 * 显示内容遮罩层
 */
const showContent = () => {
  show3.value = true
  console.log('显示内容遮罩层')
}

/**
 * 显示交互式内容遮罩层
 */
const showInteractive = () => {
  show4.value = true
  console.log('显示交互式内容遮罩层')
}

/**
 * 显示慢速动画遮罩层
 */
const showSlowAnimation = () => {
  show5.value = true
  console.log('显示慢速动画遮罩层')
}

/**
 * 显示高层级遮罩层
 */
const showHighZIndex = () => {
  show6.value = true
  console.log('显示高层级遮罩层')
}

/**
 * 显示不锁定滚动的遮罩层
 */
const showNoLockScroll = () => {
  show7.value = true
  console.log('显示不锁定滚动的遮罩层')
}

/**
 * 显示加载中遮罩层
 */
const showLoading = () => {
  show8.value = true
  console.log('显示加载中遮罩层')
  // 模拟加载完成
  setTimeout(() => {
    show8.value = false
    console.log('加载完成，关闭遮罩层')
  }, 3000)
}

/**
 * 显示图片预览遮罩层
 */
const showImagePreview = () => {
  show9.value = true
  console.log('显示图片预览遮罩层')
}

/**
 * 显示确认对话框遮罩层
 */
const showConfirm = () => {
  show10.value = true
  console.log('显示确认对话框遮罩层')
}

/**
 * 显示事件监听遮罩层
 */
const showEvents = () => {
  show11.value = true
  addEventLog('打开事件监听遮罩层')
}

// ===== 事件处理方法 =====

/**
 * 处理基础遮罩层点击事件
 */
const handleBasicClick = () => {
  console.log('基础遮罩层被点击')
  show1.value = false
}

/**
 * 处理内容遮罩层点击事件
 */
const handleContentClick = () => {
  console.log('内容遮罩层被点击')
  show3.value = false
}

/**
 * 处理交互式遮罩层点击事件
 */
const handleInteractiveClick = () => {
  console.log('交互式遮罩层被点击')
  show4.value = false
}

/**
 * 处理按钮点击事件
 */
const handleButtonClick = () => {
  console.log('交互式内容区域按钮被点击')
}

/**
 * 关闭交互式遮罩层
 */
const closeInteractive = () => {
  show4.value = false
  console.log('通过按钮关闭交互式遮罩层')
}

/**
 * 处理慢速动画遮罩层点击事件
 */
const handleSlowAnimationClick = () => {
  console.log('慢速动画遮罩层被点击')
  show5.value = false
}

/**
 * 处理高层级遮罩层点击事件
 */
const handleHighZIndexClick = () => {
  console.log('高层级遮罩层被点击')
  show6.value = false
}

/**
 * 处理不锁定滚动遮罩层点击事件
 */
const handleNoLockScrollClick = () => {
  console.log('不锁定滚动遮罩层被点击')
  show7.value = false
}

/**
 * 关闭不锁定滚动遮罩层
 */
const closeNoLockScroll = () => {
  show7.value = false
  console.log('通过按钮关闭不锁定滚动遮罩层')
}

/**
 * 关闭图片预览遮罩层
 */
const closeImagePreview = () => {
  show9.value = false
  console.log('关闭图片预览遮罩层')
}

/**
 * 关闭确认对话框遮罩层
 */
const closeConfirm = () => {
  show10.value = false
  console.log('关闭确认对话框遮罩层')
}

/**
 * 处理确认操作
 */
const handleConfirm = () => {
  console.log('用户确认操作')
  show10.value = false
}

/**
 * 关闭事件监听遮罩层
 */
const closeEvents = () => {
  show11.value = false
  addEventLog('通过按钮关闭遮罩层')
}

/**
 * 处理事件监听遮罩层点击事件
 */
const handleEventClick = () => {
  addEventLog('遮罩层背景被点击，准备关闭')
  show11.value = false
}

/**
 * 处理内容区域点击事件（阻止冒泡）
 */
const handleContentBlockClick = () => {
  addEventLog('内容区域被点击，阻止关闭遮罩层')
}

const { resetScrollTop, updateScrollTop } = useScroll()
onShow(() => {
  resetScrollTop()
})
onPageScroll((e) => {
  updateScrollTop(e.scrollTop)
})
</script>

<style lang="scss" scoped>
// 这里可以添加一些自定义样式
// 大部分样式已经通过 Tailwind CSS 类名实现
</style>
