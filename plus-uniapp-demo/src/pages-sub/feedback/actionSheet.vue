<!-- ActionSheet 上拉菜单 http://127.0.0.1:100/#/pages-sub/demo/wd/actionSheet -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="ActionSheet 上拉菜单" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的上拉菜单形式，包含选项名称和描述">
      <!-- 示例效果展示 -->
      <view class="space-y-3">
        <wd-button block @click="showBasic">基本菜单</wd-button>
        <wd-button block @click="showTitle">带标题和自定义内容</wd-button>
      </view>

      <!-- 基本菜单 -->
      <wd-action-sheet
        v-model="show1"
        title="弹出菜单标题"
        :actions="basicActions"
        @select="handleBasicSelect"
      />

      <!-- 带标题菜单 -->
      <wd-action-sheet
        v-model="show2"
        title="这是标题"
        cancel-text="取消"
        @select="handleTitleSelect"
      >
        <view class="p-4 pb-8">
          <view class="mb-4 text-center text-lg font-medium">自定义内容区域</view>
          <view class="mb-4 text-gray-600 leading-6">
            这里可以放置任意自定义内容，比如表单、说明文字、操作按钮等。
          </view>
        </view>
      </wd-action-sheet>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基本菜单" :code="codes.basic.template" />
        <DemoCode title="脚本 - 基本菜单" :code="codes.basic.script" />
        <DemoCode title="模板 - 自定义内容" :code="codes.basic.customContent" />
      </template>
    </DemoSection>

    <!-- 选项状态示例 -->
    <DemoSection title="选项状态" desc="支持自定义颜色、禁用状态和加载状态">
      <view class="space-y-3">
        <wd-button block @click="showStatus">不同状态选项</wd-button>
      </view>

      <wd-action-sheet
        v-model="show3"
        title="选项状态演示"
        :actions="statusActions"
        cancel-text="取消"
        @select="handleStatusSelect"
      />

      <template #codes>
        <DemoCode title="模板 - 选项状态" :code="codes.status.template" />
        <DemoCode title="脚本 - 选项状态" :code="codes.status.script" />
      </template>
    </DemoSection>

    <!-- 面板式布局示例 -->
    <DemoSection title="面板式布局" desc="使用图标和文字的面板式布局，适合分享场景">
      <view class="space-y-3">
        <wd-button block @click="showPanel">单行面板</wd-button>
        <wd-button block @click="showMultiPanel">多行面板</wd-button>
      </view>

      <!-- 单行面板 -->
      <wd-action-sheet
        v-model="show4"
        :panels="singlePanels"
        cancel-text="取消"
        @select="handlePanelSelect"
      />

      <!-- 多行面板 -->
      <wd-action-sheet
        v-model="show5"
        :panels="multiPanels"
        cancel-text="取消"
        @select="handleMultiPanelSelect"
      />

      <template #codes>
        <DemoCode title="模板 - 单行面板" :code="codes.panel.singleTemplate" />
        <DemoCode title="脚本 - 单行面板" :code="codes.panel.singleScript" />
        <DemoCode title="模板 - 多行面板" :code="codes.panel.multiTemplate" />
        <DemoCode title="脚本 - 多行面板" :code="codes.panel.multiScript" />
      </template>
    </DemoSection>

    <!-- 高级配置示例 -->
    <DemoSection title="高级配置" desc="更多配置选项和交互控制">
      <view class="space-y-3">
        <wd-button block type="warning" @click="showAdvanced1">禁用遮罩关闭</wd-button>
        <wd-button block type="warning" @click="showAdvanced2">选择后不关闭</wd-button>
        <wd-button block @click="showAdvanced3">自定义动画时长</wd-button>
        <wd-button block @click="showLongList">长列表滚动</wd-button>
      </view>

      <!-- 禁用遮罩关闭 -->
      <wd-action-sheet
        v-model="show6"
        title="禁用遮罩关闭"
        :actions="basicActions"
        :close-on-click-modal="false"
        cancel-text="只能点取消关闭"
        @select="handleAdvancedSelect"
        @click-modal="handleClickModalBlocked"
      />

      <!-- 选择后不关闭 -->
      <wd-action-sheet
        v-model="show7"
        title="选择后不关闭"
        :actions="persistentActions"
        :close-on-click-action="false"
        cancel-text="手动关闭"
        @select="handlePersistentSelect"
      />

      <!-- 自定义动画时长 -->
      <wd-action-sheet
        v-model="show8"
        title="慢速动画演示"
        :actions="basicActions"
        :duration="800"
        cancel-text="关闭"
        @select="handleSlowAnimationSelect"
      />

      <!-- 长列表滚动 -->
      <wd-action-sheet
        v-model="show9"
        title="长列表演示"
        :actions="longListActions"
        cancel-text="取消"
        @select="handleLongListSelect"
      />

      <template #codes>
        <DemoCode title="模板 - 禁用遮罩关闭" :code="codes.advanced.noModalTemplate" />
        <DemoCode title="模板 - 选择后不关闭" :code="codes.advanced.persistentTemplate" />
        <DemoCode title="模板 - 自定义动画时长" :code="codes.advanced.durationTemplate" />
        <DemoCode title="脚本 - 长列表生成" :code="codes.advanced.longListScript" />
      </template>
    </DemoSection>

    <!-- 事件监听示例 -->
    <DemoSection title="事件监听" desc="监听各种生命周期事件和用户交互">
      <!-- 状态显示区域 -->
      <view class="space-y-4">
        <!-- 控制按钮 -->
        <wd-button block type="primary" @click="showEvents">打开事件监听菜单</wd-button>

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

      <!-- 事件监听菜单 -->
      <wd-action-sheet
        v-model="show10"
        title="事件监听"
        :actions="basicActions"
        cancel-text="取消"
        @open="handleOpen"
        @opened="handleOpened"
        @close="handleEventClose"
        @closed="handleClosed"
        @select="handleEventSelect"
        @click-modal="handleClickModal"
        @cancel="handleEventCancel"
      />

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

// ===== 组件状态管理 =====

// 各个菜单的显示状态
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

// 事件日志状态
interface EventLog {
  time: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

const eventLogs = ref<EventLog[]>([])

// 菜单数据定义
const basicActions = ref([
  { name: '选项1', subname: '选项1的详细描述' },
  { name: '选项2', subname: '选项2的详细描述' },
  { name: '选项3', subname: '选项3的详细描述' },
])

const statusActions = ref([
  { name: '正常选项', color: '#0083ff', disabled: false, loading: false },
  { name: '自定义颜色', color: '#ff4757', disabled: false, loading: false },
  { name: '禁用选项', color: '#999999', disabled: true, loading: false },
  { name: '加载中选项', color: '#0083ff', disabled: false, loading: true },
  { name: '绿色选项', color: '#2ed573', disabled: false, loading: false },
])

const persistentActions = ref([
  { name: '选项A', subname: '点击后不会关闭菜单' },
  { name: '选项B', subname: '可以连续选择多个' },
  { name: '选项C', subname: '需要手动点击取消关闭' },
])

const longListActions = ref(
  Array.from({ length: 15 }, (_, index) => ({
    name: `选项 ${index + 1}`,
    subname: `这是第 ${index + 1} 个选项的描述`,
    color: index % 3 === 0 ? '#ff4757' : index % 3 === 1 ? '#2ed573' : '#0083ff',
  })),
)

const singlePanels = ref([
  {
    iconUrl:
      'https://img12.360buyimg.com/imagetools/jfs/t1/122016/33/6657/1362/5f0692a1E8708d245/e47299e5945a6956.png',
    title: '微信好友',
  },
  {
    iconUrl:
      'https://img14.360buyimg.com/imagetools/jfs/t1/111572/11/11734/1245/5f0692a1E39d13d21/b35dfe9243bd6c2a.png',
    title: '微信朋友圈',
  },
  {
    iconUrl:
      'https://img14.360buyimg.com/imagetools/jfs/t1/132639/25/4003/945/5f069336E18778248/fa181913030bed8a.png',
    title: 'QQ好友',
  },
  {
    iconUrl:
      'https://img14.360buyimg.com/imagetools/jfs/t1/134807/4/3950/1256/5f069336E76949e27/d20641da8e699f07.png',
    title: '微信收藏',
  },
])

const multiPanels = ref([
  [
    {
      iconUrl:
        'https://img12.360buyimg.com/imagetools/jfs/t1/122016/33/6657/1362/5f0692a1E8708d245/e47299e5945a6956.png',
      title: '微信好友',
    },
    {
      iconUrl:
        'https://img14.360buyimg.com/imagetools/jfs/t1/111572/11/11734/1245/5f0692a1E39d13d21/b35dfe9243bd6c2a.png',
      title: '微信朋友圈',
    },
    {
      iconUrl:
        'https://img14.360buyimg.com/imagetools/jfs/t1/132639/25/4003/945/5f069336E18778248/fa181913030bed8a.png',
      title: 'QQ好友',
    },
  ],
  [
    {
      iconUrl:
        'https://img12.360buyimg.com/imagetools/jfs/t1/122016/33/6657/1362/5f0692a1E8708d245/e47299e5945a6956.png',
      title: '复制链接',
    },
    {
      iconUrl:
        'https://img14.360buyimg.com/imagetools/jfs/t1/111572/11/11734/1245/5f0692a1E39d13d21/b35dfe9243bd6c2a.png',
      title: '刷新页面',
    },
    {
      iconUrl:
        'https://img14.360buyimg.com/imagetools/jfs/t1/132639/25/4003/945/5f069336E18778248/fa181913030bed8a.png',
      title: '更多操作',
    },
  ],
])

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    template: `<wd-action-sheet
  v-model="show1"
  title="弹出菜单标题"
  :actions="basicActions"
  @select="handleBasicSelect"
/>`,

    script: `import { ref } from 'vue'

const show1 = ref(false)
const basicActions = ref([
  { name: '选项1', subname: '选项1的详细描述' },
  { name: '选项2', subname: '选项2的详细描述' },
  { name: '选项3', subname: '选项3的详细描述' },
])

const handleBasicSelect = ({ item, index }) => {
  console.log('选择了：', item.name, '索引：', index)
}`,

    customContent: `<template>
  <wd-action-sheet
    v-model="show2"
    title="这是标题"
    cancel-text="取消"
  >
    <view class="p-4 pb-8">
      <view class="mb-4 text-center text-lg font-medium">自定义内容区域</view>
      <view class="mb-4 text-gray-600 leading-6">
        这里可以放置任意自定义内容，比如表单、说明文字、操作按钮等。
      </view>
    </view>
  </wd-action-sheet>
</template>`,
  },

  // 选项状态代码
  status: {
    template: `<wd-action-sheet
  v-model="show"
  title="选项状态演示"
  :actions="statusActions"
  cancel-text="取消"
  @select="handleStatusSelect"
/>`,

    script: `const statusActions = ref([
  { name: '正常选项', color: '#0083ff', disabled: false, loading: false },
  { name: '自定义颜色', color: '#ff4757', disabled: false, loading: false },
  { name: '禁用选项', color: '#999999', disabled: true, loading: false },
  { name: '加载中选项', color: '#0083ff', disabled: false, loading: true },
  { name: '绿色选项', color: '#2ed573', disabled: false, loading: false },
])

const handleStatusSelect = ({ item, index }) => {
  if (item.disabled || item.loading) return
  console.log('选择了：', item.name)
}`,
  },

  // 面板式布局代码
  panel: {
    singleTemplate: `<wd-action-sheet
  v-model="show"
  :panels="singlePanels"
  cancel-text="取消"
  @select="handlePanelSelect"
/>`,

    singleScript: `const singlePanels = ref([
  {
    iconUrl: 'https://example.com/wechat.png',
    title: '微信好友',
  },
  {
    iconUrl: 'https://example.com/moments.png',
    title: '微信朋友圈',
  },
  {
    iconUrl: 'https://example.com/qq.png',
    title: 'QQ好友',
  },
])

const handlePanelSelect = ({ item, index }) => {
  console.log('选择了：', item.title, '索引：', index)
}`,

    multiTemplate: `<wd-action-sheet
  v-model="show"
  :panels="multiPanels"
  cancel-text="取消"
  @select="handleMultiPanelSelect"
/>`,

    multiScript: `const multiPanels = ref([
  [ // 第一行
    { iconUrl: 'https://example.com/wechat.png', title: '微信好友' },
    { iconUrl: 'https://example.com/moments.png', title: '微信朋友圈' },
    { iconUrl: 'https://example.com/qq.png', title: 'QQ好友' },
  ],
  [ // 第二行
    { iconUrl: 'https://example.com/copy.png', title: '复制链接' },
    { iconUrl: 'https://example.com/refresh.png', title: '刷新页面' },
    { iconUrl: 'https://example.com/more.png', title: '更多操作' },
  ],
])

const handleMultiPanelSelect = ({ item, rowIndex, colIndex }) => {
  console.log('选择了：', item.title, '行：', rowIndex, '列：', colIndex)
}`,
  },

  // 高级配置代码
  advanced: {
    noModalTemplate: `<wd-action-sheet
  v-model="show"
  title="禁用遮罩关闭"
  :actions="basicActions"
  :close-on-click-modal="false"
  cancel-text="只能点取消关闭"
  @click-modal="handleClickModalBlocked"
/>`,

    persistentTemplate: `<wd-action-sheet
  v-model="show"
  title="选择后不关闭"
  :actions="persistentActions"
  :close-on-click-action="false"
  cancel-text="手动关闭"
  @select="handlePersistentSelect"
/>`,

    durationTemplate: `<wd-action-sheet
  v-model="show"
  title="慢速动画演示"
  :actions="basicActions"
  :duration="800"
  cancel-text="关闭"
/>`,

    longListScript: `// 生成长列表数据
const longListActions = ref(
  Array.from({ length: 15 }, (_, index) => ({
    name: \`选项 \${index + 1}\`,
    subname: \`这是第 \${index + 1} 个选项的描述\`,
    color: index % 3 === 0 ? '#ff4757' : index % 3 === 1 ? '#2ed573' : '#0083ff',
  }))
)`,
  },

  // 事件监听代码
  events: {
    template: `
      <wd-action-sheet
        v-model="show"
        title="事件监听"
        :actions="basicActions"
        cancel-text="取消"
        @open="handleOpen"
        @opened="handleOpened"
        @close="handleEventClose"
        @closed="handleClosed"
        @select="handleEventSelect"
        @click-modal="handleClickModal"
        @cancel="handleEventCancel"
      />`,

    methods: `const handleOpen = () => {
  console.log('菜单开始打开')
}

const handleOpened = () => {
  console.log('菜单打开完成')
}

const handleEventClose = () => {
  console.log('菜单开始关闭')
}

const handleClosed = () => {
  console.log('菜单关闭完成')
}

const handleClickModal = () => {
  console.log('点击了遮罩层')
}

const handleEventCancel = () => {
  console.log('点击了取消按钮')
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
    desc: '设置菜单显示隐藏',
  },
  {
    name: 'actions',
    type: 'Array<Action>',
    default: '[]',
    desc: '菜单选项数组',
  },
  {
    name: 'panels',
    type: 'Array<Panel> | Array<Panel[]>',
    default: '[]',
    desc: '自定义面板项，支持一维或二维数组',
  },
  {
    name: 'title',
    type: 'String',
    default: '""',
    desc: '菜单标题',
  },
  {
    name: 'cancel-text',
    type: 'String',
    default: '""',
    desc: '取消按钮文案',
  },
  {
    name: 'close-on-click-action',
    type: 'Boolean',
    default: 'true',
    desc: '点击选项后是否关闭菜单',
  },
  {
    name: 'close-on-click-modal',
    type: 'Boolean',
    default: 'true',
    desc: '点击遮罩是否关闭菜单',
  },
  {
    name: 'duration',
    type: 'Number',
    default: '200',
    desc: '弹框动画持续时间，单位毫秒',
  },
  {
    name: 'z-index',
    type: 'Number',
    default: '100',
    desc: '菜单层级',
  },
  {
    name: 'lazy-render',
    type: 'Boolean',
    default: 'true',
    desc: '弹层内容懒渲染',
  },
  {
    name: 'safe-area-inset-bottom',
    type: 'Boolean',
    default: 'true',
    desc: '是否设置底部安全距离',
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
    name: 'custom-header-class',
    type: 'String',
    default: '""',
    desc: '自定义头部样式类',
  },
]

// Events 事件文档
const apiEvents = [
  {
    name: 'select',
    desc: '选择选项或面板项时触发，参数为 { item, index } 或 { item, rowIndex, colIndex }',
  },
  {
    name: 'click-modal',
    desc: '点击遮罩时触发',
  },
  {
    name: 'cancel',
    desc: '点击取消按钮时触发',
  },
  {
    name: 'open',
    desc: '菜单开始打开时触发',
  },
  {
    name: 'opened',
    desc: '菜单打开完成时触发',
  },
  {
    name: 'close',
    desc: '菜单开始关闭时触发',
  },
  {
    name: 'closed',
    desc: '菜单关闭完成时触发',
  },
]

// Methods 方法文档（ActionSheet 组件没有暴露方法）
const apiMethods: any[] = []

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
 * 显示基本菜单
 */
const showBasic = () => {
  show1.value = true
  console.log('打开基本菜单')
}

/**
 * 显示带标题菜单
 */
const showTitle = () => {
  show2.value = true
  console.log('打开带标题菜单')
}

/**
 * 显示状态菜单
 */
const showStatus = () => {
  show3.value = true
  console.log('打开状态菜单')
}

/**
 * 显示单行面板
 */
const showPanel = () => {
  show4.value = true
  console.log('打开单行面板')
}

/**
 * 显示多行面板
 */
const showMultiPanel = () => {
  show5.value = true
  console.log('打开多行面板')
}

/**
 * 显示高级配置菜单 - 禁用遮罩关闭
 */
const showAdvanced1 = () => {
  show6.value = true
  console.log('打开禁用遮罩关闭菜单')
}

/**
 * 显示高级配置菜单 - 选择后不关闭
 */
const showAdvanced2 = () => {
  show7.value = true
  console.log('打开选择后不关闭菜单')
}

/**
 * 显示高级配置菜单 - 自定义动画时长
 */
const showAdvanced3 = () => {
  show8.value = true
  console.log('打开自定义动画时长菜单')
}

/**
 * 显示长列表菜单
 */
const showLongList = () => {
  show9.value = true
  console.log('打开长列表菜单')
}

/**
 * 显示事件监听菜单
 */
const showEvents = () => {
  show10.value = true
  addEventLog('打开事件监听菜单', 'info')
}

// === 选择事件处理方法 ===

/**
 * 基本菜单选择事件
 */
const handleBasicSelect = ({ item, index }: { item: any; index: number }) => {
  console.log(`基本菜单选择：${item.name}（索引：${index}）`)
}

/**
 * 带标题菜单选择事件
 */
const handleTitleSelect = ({ item, index }: { item: any; index: number }) => {
  console.log(`带标题菜单选择：${item.name}（索引：${index}）`)
}

/**
 * 状态菜单选择事件
 */
const handleStatusSelect = ({ item, index }: { item: any; index: number }) => {
  if (item.disabled) {
    console.log(`尝试选择禁用项：${item.name}`)
    return
  }
  if (item.loading) {
    console.log(`尝试选择加载中项：${item.name}`)
    return
  }
  console.log(`状态菜单选择：${item.name}（颜色：${item.color}）`)
}

/**
 * 单行面板选择事件
 */
const handlePanelSelect = ({ item, index }: { item: any; index: number }) => {
  console.log(`单行面板选择：${item.title}（索引：${index}）`)
}

/**
 * 多行面板选择事件
 */
const handleMultiPanelSelect = ({
  item,
  rowIndex,
  colIndex,
}: {
  item: any
  rowIndex: number
  colIndex: number
}) => {
  console.log(`多行面板选择：${item.title}（行：${rowIndex}，列：${colIndex}）`)
}

/**
 * 高级配置选择事件
 */
const handleAdvancedSelect = ({ item, index }: { item: any; index: number }) => {
  console.log(`高级配置选择：${item.name}`)
}

/**
 * 持久菜单选择事件（选择后不关闭）
 */
const handlePersistentSelect = ({ item, index }: { item: any; index: number }) => {
  console.log(`持久菜单选择：${item.name}（菜单未关闭）`)
}

/**
 * 慢动画选择事件
 */
const handleSlowAnimationSelect = ({ item, index }: { item: any; index: number }) => {
  console.log(`慢动画选择：${item.name}`)
}

/**
 * 长列表选择事件
 */
const handleLongListSelect = ({ item, index }: { item: any; index: number }) => {
  console.log(`长列表选择：${item.name}（索引：${index}）`)
}

/**
 * 事件监听选择事件
 */
const handleEventSelect = ({ item, index }: { item: any; index: number }) => {
  addEventLog(`选择了：${item.name}（索引：${index}）`, 'success')
}

// === 生命周期事件处理方法 ===

/**
 * 菜单开始打开事件
 */
const handleOpen = () => {
  addEventLog('菜单开始打开', 'info')
}

/**
 * 菜单打开完成事件
 */
const handleOpened = () => {
  addEventLog('菜单打开完成', 'success')
}

/**
 * 菜单开始关闭事件
 */
const handleEventClose = () => {
  addEventLog('菜单开始关闭', 'info')
}

/**
 * 菜单关闭完成事件
 */
const handleClosed = () => {
  addEventLog('菜单关闭完成', 'success')
}

/**
 * 取消按钮点击事件
 */
const handleEventCancel = () => {
  addEventLog('点击了取消按钮', 'warning')
}

/**
 * 点击遮罩事件
 */
const handleClickModal = () => {
  addEventLog('点击了遮罩层', 'warning')
}

/**
 * 禁用遮罩关闭时点击遮罩事件
 */
const handleClickModalBlocked = () => {
  addEventLog('点击遮罩层被拦截（已禁用遮罩关闭）', 'error')
}

const { resetScrollTop, updateScrollTop } = useScroll()
onShow(() => {
  resetScrollTop()
})
onPageScroll((e) => {
  updateScrollTop(e.scrollTop)
})
</script>
