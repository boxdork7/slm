<!-- Search 搜索框 http://127.0.0.1:100/#/pages-sub/demo/wd/search -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Search 搜索框" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的搜索框形式，支持输入、清空、搜索、取消操作">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="默认搜索框" vertical>
          <wd-search
            v-model="basicValue"
            placeholder="请输入搜索内容"
            @search="handleBasicSearch"
            @change="handleBasicChange"
            @cancel="handleBasicCancel"
            @clear="handleBasicClear"
          />
        </wd-cell>

        <wd-cell title="带初始值" vertical>
          <wd-search v-model="valueWithInitial" placeholder="请输入关键词" @search="handleSearch" />
        </wd-cell>

        <wd-cell title="自定义占位符" vertical>
          <wd-search
            v-model="customPlaceholderValue"
            placeholder="搜索商品、店铺、品牌"
            @search="handleSearch"
          />
        </wd-cell>
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 默认搜索框" :code="codes.basic.defaultTemplate" />
        <DemoCode title="模板 - 带初始值" :code="codes.basic.initialTemplate" />
        <DemoCode title="模板 - 自定义占位符" :code="codes.basic.placeholderTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 主题样式示例 -->
    <DemoSection title="主题样式" desc="不同的视觉主题和显示模式">
      <wd-cell-group>
        <wd-cell title="默认主题" vertical>
          <wd-search v-model="themeValue1" placeholder="灰色背景主题" />
        </wd-cell>

        <wd-cell title="亮色主题" vertical>
          <wd-search v-model="themeValue2" placeholder="白色背景主题" light />
        </wd-cell>

        <wd-cell title="占位符居左" vertical>
          <wd-search v-model="themeValue3" placeholder="搜索内容" placeholder-left />
        </wd-cell>

        <wd-cell title="隐藏取消按钮" vertical>
          <wd-search v-model="themeValue4" placeholder="不显示取消按钮" hide-cancel />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 主题样式" :code="codes.theme.template" />
        <DemoCode title="脚本 - 主题样式" :code="codes.theme.script" />
      </template>
    </DemoSection>

    <!-- 高级配置示例 -->
    <DemoSection title="高级配置" desc="更多配置选项和功能特性">
      <wd-cell-group>
        <wd-cell title="禁用状态" vertical>
          <wd-search v-model="advancedValue1" placeholder="禁用的搜索框" disabled />
        </wd-cell>

        <wd-cell title="设置最大长度" vertical>
          <wd-search v-model="advancedValue2" placeholder="最多输入4个字符" :maxlength="4" />
        </wd-cell>

        <wd-cell title="清空后自动聚焦" vertical>
          <wd-search v-model="advancedValue3" placeholder="清空后会自动聚焦" focus-when-clear />
        </wd-cell>

        <wd-cell title="自动聚焦" vertical>
          <wd-search v-model="advancedValue4" placeholder="页面加载时自动聚焦" focus />
        </wd-cell>

        <wd-cell title="自定义右侧文案" vertical>
          <wd-search
            v-model="advancedValue5"
            placeholder="请输入订单号、商品名称"
            cancel-txt="搜索"
          />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 禁用状态" :code="codes.advanced.disabledTemplate" />
        <DemoCode title="模板 - 最大长度限制" :code="codes.advanced.maxlengthTemplate" />
        <DemoCode title="模板 - 聚焦配置" :code="codes.advanced.focusTemplate" />
        <DemoCode title="模板 - 自定义取消文案" :code="codes.advanced.cancelTemplate" />
        <DemoCode title="脚本 - 高级配置" :code="codes.advanced.script" />
      </template>
    </DemoSection>

    <!-- 插槽自定义示例 -->
    <DemoSection title="插槽自定义" desc="通过插槽自定义搜索框的前置和后置内容">
      <!-- 自定义前置插槽 -->
      <view class="space-y-4">
        <view class="mx-4 rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">自定义前置插槽</view>
          <wd-search v-model="slotValue1" placeholder="选择搜索类型">
            <template #prefix>
              <wd-popover mode="menu" :content="searchTypeMenu" @menuclick="handleSearchTypeChange">
                <view class="search-type-selector">
                  <text>{{ currentSearchType }}</text>
                  <wd-icon class="search-type-arrow" name="fill-arrow-down" />
                </view>
              </wd-popover>
            </template>
          </wd-search>
        </view>

        <!-- 自定义后置插槽 -->
        <view class="mx-4 rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">自定义后置插槽</view>
          <wd-search v-model="slotValue2" placeholder="扫码或输入搜索">
            <template #suffix>
              <view class="custom-suffix" @click="handleScanCode">
                <wd-icon name="scan" size="20" />
                <text class="ml-1 text-sm">扫码</text>
              </view>
            </template>
          </wd-search>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 前置插槽" :code="codes.slots.prefixTemplate" />
        <DemoCode title="模板 - 后置插槽" :code="codes.slots.suffixTemplate" />
        <DemoCode title="脚本 - 插槽自定义" :code="codes.slots.script" />
        <DemoCode title="样式 - 插槽样式" :code="codes.slots.style" />
      </template>
    </DemoSection>

    <!-- 事件监听示例 -->
    <DemoSection title="事件监听" desc="监听搜索框的各种交互事件">
      <!-- 事件示例区域 -->
      <view class="space-y-4">
        <!-- 事件监听搜索框 -->
        <wd-cell-group>
          <wd-cell title="事件监听搜索框" vertical>
            <wd-search
              v-model="eventValue"
              placeholder="输入内容查看事件触发"
              @search="handleEventSearch"
              @change="handleEventChange"
              @focus="handleEventFocus"
              @blur="handleEventBlur"
              @clear="handleEventClear"
              @cancel="handleEventCancel"
            />
          </wd-cell>
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

    <!-- 实际应用场景 -->
    <DemoSection title="实际应用场景" desc="常见的业务场景示例">
      <!-- 搜索页面示例 -->
      <view class="space-y-4">
        <!-- 电商搜索 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">电商商品搜索</view>
          <view class="mx-4 rounded-lg bg-gray-50 p-4">
            <wd-search
              v-model="scenarioValue1"
              placeholder="搜索商品、店铺、品牌"
              light
              @search="handleProductSearch"
            />
            <!-- 热门搜索 -->
            <view class="mt-3">
              <view class="mb-2 text-xs text-gray-500">热门搜索</view>
              <view class="flex flex-wrap gap-2">
                <text
                  v-for="tag in hotSearchTags"
                  :key="tag"
                  class="rounded-full bg-white px-3 py-1 text-xs text-gray-600"
                  @click="handleHotTagClick(tag)"
                >
                  {{ tag }}
                </text>
              </view>
            </view>
          </view>
        </view>

        <!-- 订单搜索 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">订单号搜索</view>
          <view class="mx-4 rounded-lg bg-blue-50 p-4">
            <wd-search
              v-model="scenarioValue2"
              placeholder="请输入订单号"
              cancel-txt="查询"
              :maxlength="20"
              @search="handleOrderSearch"
            />
            <view class="mt-2 text-xs text-blue-600">💡 支持订单号、手机号、收货人姓名搜索</view>
          </view>
        </view>

        <!-- 文档搜索 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">文档内容搜索</view>
          <view class="mx-4 rounded-lg bg-green-50 p-4">
            <wd-search
              v-model="scenarioValue3"
              placeholder="搜索文档内容、标题、作者"
              hide-cancel
              focus-when-clear
              @search="handleDocSearch"
              @change="handleDocChange"
            />
            <!-- 搜索结果统计 -->
            <view v-if="searchResultCount > 0" class="mt-2 text-xs text-green-600">
              找到 {{ searchResultCount }} 个相关结果
            </view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 电商搜索" :code="codes.scenarios.ecommerceTemplate" />
        <DemoCode title="脚本 - 电商搜索" :code="codes.scenarios.ecommerceScript" />
        <DemoCode title="模板 - 订单搜索" :code="codes.scenarios.orderTemplate" />
        <DemoCode title="模板 - 文档搜索" :code="codes.scenarios.documentTemplate" />
        <DemoCode title="脚本 - 应用场景" :code="codes.scenarios.script" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :events="apiEvents" />

    <!-- Toast 组件 -->
    <wd-toast />
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

// ===== 组件状态管理 =====

// 基本用法数据
const basicValue = ref<string>('')
const valueWithInitial = ref<string>('默认搜索内容')
const customPlaceholderValue = ref<string>('')

// 主题样式数据
const themeValue1 = ref<string>('')
const themeValue2 = ref<string>('')
const themeValue3 = ref<string>('')
const themeValue4 = ref<string>('')

// 高级配置数据
const advancedValue1 = ref<string>('禁用状态的内容')
const advancedValue2 = ref<string>('')
const advancedValue3 = ref<string>('')
const advancedValue4 = ref<string>('')
const advancedValue5 = ref<string>('')

// 插槽自定义数据
const slotValue1 = ref<string>('')
const slotValue2 = ref<string>('')
const currentSearchType = ref<string>('全部')

// 事件监听数据
const eventValue = ref<string>('')

// 应用场景数据
const scenarioValue1 = ref<string>('')
const scenarioValue2 = ref<string>('')
const scenarioValue3 = ref<string>('')
const searchResultCount = ref<number>(0)

// 搜索类型菜单
const searchTypeMenu = computed(() => [
  { content: '全部' },
  { content: '订单号' },
  { content: '退款单号' },
  { content: '商品名称' },
])

// 热门搜索标签
const hotSearchTags = ref<string[]>([
  'iPhone 15',
  '小米手机',
  '华为Mate60',
  '笔记本电脑',
  '蓝牙耳机',
  '运动鞋',
])

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
    defaultTemplate: `<wd-search
  v-model="basicValue"
  placeholder="请输入搜索内容"
  @search="handleBasicSearch"
  @change="handleBasicChange"
  @cancel="handleBasicCancel"
  @clear="handleBasicClear"
/>`,

    initialTemplate: `<wd-search
  v-model="valueWithInitial"
  placeholder="请输入关键词"
  @search="handleSearch"
/>`,

    placeholderTemplate: `<wd-search
  v-model="customPlaceholderValue"
  placeholder="搜索商品、店铺、品牌"
  @search="handleSearch"
/>`,

    script: `import { ref } from 'vue'

const basicValue = ref('')
const valueWithInitial = ref('默认搜索内容')
const customPlaceholderValue = ref('')

const handleBasicSearch = ({ value }) => {
  console.log('搜索:', value)
}

const handleBasicChange = ({ value }) => {
  console.log('输入变化:', value)
}

const handleBasicCancel = ({ value }) => {
  console.log('取消搜索:', value)
}

const handleBasicClear = () => {
  console.log('清空内容')
}`,
  },

  // 主题样式代码
  theme: {
    template: `<!-- 默认主题 -->
<wd-search v-model="themeValue1" placeholder="灰色背景主题" />

<!-- 亮色主题 -->
<wd-search v-model="themeValue2" placeholder="白色背景主题" light />

<!-- 占位符居左 -->
<wd-search v-model="themeValue3" placeholder="搜索内容" placeholder-left />

<!-- 隐藏取消按钮 -->
<wd-search v-model="themeValue4" placeholder="不显示取消按钮" hide-cancel />`,

    script: `const themeValue1 = ref('')
const themeValue2 = ref('')
const themeValue3 = ref('')
const themeValue4 = ref('')`,
  },

  // 高级配置代码
  advanced: {
    disabledTemplate: `<wd-search
  v-model="advancedValue1"
  placeholder="禁用的搜索框"
  disabled
/>`,

    maxlengthTemplate: `<wd-search
  v-model="advancedValue2"
  placeholder="最多输入4个字符"
  :maxlength="4"
/>`,

    focusTemplate: `<!-- 清空后自动聚焦 -->
<wd-search
  v-model="advancedValue3"
  placeholder="清空后会自动聚焦"
  focus-when-clear
/>

<!-- 自动聚焦 -->
<wd-search
  v-model="advancedValue4"
  placeholder="页面加载时自动聚焦"
  focus
/>`,

    cancelTemplate: `<wd-search
  v-model="advancedValue5"
  placeholder="请输入订单号、商品名称"
  cancel-txt="搜索"
/>`,

    script: `const advancedValue1 = ref('禁用状态的内容')
const advancedValue2 = ref('')
const advancedValue3 = ref('')
const advancedValue4 = ref('')
const advancedValue5 = ref('')`,
  },

  // 插槽自定义代码
  slots: {
    prefixTemplate: `<wd-search v-model="slotValue1" placeholder="选择搜索类型">
  <template #prefix>
    <wd-popover mode="menu" :content="searchTypeMenu" @menuclick="handleSearchTypeChange">
      <view class="search-type-selector">
        <text>{{ currentSearchType }}</text>
        <wd-icon class="search-type-arrow" name="fill-arrow-down" />
      </view>
    </wd-popover>
  </template>
</wd-search>`,

    suffixTemplate: `<wd-search v-model="slotValue2" placeholder="扫码或输入搜索">
  <template #suffix>
    <view class="custom-suffix" @click="handleScanCode">
      <wd-icon name="scan" size="20" />
      <text class="ml-1 text-sm">扫码</text>
    </view>
  </template>
</wd-search>`,

    script: `const slotValue1 = ref('')
const slotValue2 = ref('')
const currentSearchType = ref('全部')

const searchTypeMenu = computed(() => [
  { content: '全部' },
  { content: '订单号' },
  { content: '退款单号' },
  { content: '商品名称' }
])

const handleSearchTypeChange = ({ item }) => {
  currentSearchType.value = item.content
  console.log('切换搜索类型:', item.content)
}

const handleScanCode = () => {
  console.log('点击扫码按钮')
  // 调用扫码功能
}`,

    style: `.search-type-selector {
  position: relative;
  height: 30px;
  line-height: 30px;
  padding: 0 8px 0 16px;
  color: rgba(0, 0, 0, 0.45);
}

.search-type-selector::after {
  position: absolute;
  content: '';
  width: 1px;
  right: 0;
  top: 5px;
  bottom: 5px;
  background: rgba(0, 0, 0, 0.25);
  transform: scaleX(0.5);
}

.search-type-arrow {
  margin-left: 4px;
  font-size: 18px;
  vertical-align: middle;
  color: rgba(0, 0, 0, 0.65);
}

.custom-suffix {
  display: flex;
  align-items: center;
  padding: 0 12px;
  color: #666;
  border-left: 1px solid #e5e5e5;
  margin-left: 8px;
}`,
  },

  // 事件监听代码
  events: {
    template: `
      <wd-search
        v-model="eventValue"
        placeholder="输入内容查看事件触发"
        @search="handleEventSearch"
        @change="handleEventChange"
        @focus="handleEventFocus"
        @blur="handleEventBlur"
        @clear="handleEventClear"
        @cancel="handleEventCancel"
      />`,

    methods: `const handleEventSearch = ({ value }) => {
  addEventLog(\`搜索: \${value}\`, 'success')
}

const handleEventChange = ({ value }) => {
  addEventLog(\`输入变化: \${value}\`, 'info')
}

const handleEventFocus = ({ value }) => {
  addEventLog(\`获得焦点: \${value}\`, 'info')
}

const handleEventBlur = ({ value }) => {
  addEventLog(\`失去焦点: \${value}\`, 'warning')
}

const handleEventClear = () => {
  addEventLog('清空内容', 'warning')
}

const handleEventCancel = ({ value }) => {
  addEventLog(\`取消搜索: \${value}\`, 'error')
}

// 添加事件日志
const addEventLog = (message, type = 'info') => {
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

  // 应用场景代码
  scenarios: {
    ecommerceTemplate: `<wd-search
  v-model="scenarioValue1"
  placeholder="搜索商品、店铺、品牌"
  light
  @search="handleProductSearch"
/>

<!-- 热门搜索 -->
<view class="mt-3">
  <view class="mb-2 text-xs text-gray-500">热门搜索</view>
  <view class="flex flex-wrap gap-2">
    <text
      v-for="tag in hotSearchTags"
      :key="tag"
      class="rounded-full bg-white px-3 py-1 text-xs text-gray-600"
      @click="handleHotTagClick(tag)"
    >
      {{ tag }}
    </text>
  </view>
</view>`,

    ecommerceScript: `const scenarioValue1 = ref('')
const hotSearchTags = ref([
  'iPhone 15', '小米手机', '华为Mate60',
  '笔记本电脑', '蓝牙耳机', '运动鞋'
])

const handleProductSearch = ({ value }) => {
  console.log('商品搜索:', value)
  // 跳转到搜索结果页
}

const handleHotTagClick = (tag) => {
  scenarioValue1.value = tag
  handleProductSearch({ value: tag })
}`,

    orderTemplate: `<wd-search
  v-model="scenarioValue2"
  placeholder="请输入订单号"
  cancel-txt="查询"
  :maxlength="20"
  @search="handleOrderSearch"
/>`,

    documentTemplate: `<wd-search
  v-model="scenarioValue3"
  placeholder="搜索文档内容、标题、作者"
  hide-cancel
  focus-when-clear
  @search="handleDocSearch"
  @change="handleDocChange"
/>

<!-- 搜索结果统计 -->
<view v-if="searchResultCount > 0" class="mt-2 text-xs text-green-600">
  找到 {{ searchResultCount }} 个相关结果
</view>`,

    script: `const scenarioValue2 = ref('')
const scenarioValue3 = ref('')
const searchResultCount = ref(0)

const handleOrderSearch = ({ value }) => {
  console.log('订单搜索:', value)
  // 查询订单逻辑
}

const handleDocSearch = ({ value }) => {
  console.log('文档搜索:', value)
  // 模拟搜索结果
  searchResultCount.value = Math.floor(Math.random() * 100) + 1
}

const handleDocChange = ({ value }) => {
  if (!value) {
    searchResultCount.value = 0
  }
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'model-value',
    type: 'String',
    default: '""',
    desc: '输入框内容，双向绑定',
  },
  {
    name: 'placeholder',
    type: 'String',
    default: '""',
    desc: '搜索框占位文本',
  },
  {
    name: 'cancel-txt',
    type: 'String',
    default: '""',
    desc: '搜索框右侧文本',
  },
  {
    name: 'light',
    type: 'Boolean',
    default: 'false',
    desc: '搜索框亮色（白色）主题',
  },
  {
    name: 'hide-cancel',
    type: 'Boolean',
    default: 'false',
    desc: '是否隐藏右侧取消按钮',
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: '是否禁用搜索框',
  },
  {
    name: 'maxlength',
    type: 'Number',
    default: '-1',
    desc: '原生属性，设置最大长度。-1 表示无限制',
  },
  {
    name: 'placeholder-left',
    type: 'Boolean',
    default: 'false',
    desc: 'placeholder 是否居左显示',
  },
  {
    name: 'focus',
    type: 'Boolean',
    default: 'false',
    desc: '是否自动聚焦',
  },
  {
    name: 'focus-when-clear',
    type: 'Boolean',
    default: 'false',
    desc: '是否在点击清除按钮时聚焦输入框',
  },
  {
    name: 'placeholder-style',
    type: 'String',
    default: '""',
    desc: '原生属性，指定 placeholder 的样式',
  },
  {
    name: 'placeholder-class',
    type: 'String',
    default: '""',
    desc: '原生属性，指定 placeholder 的样式类',
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
    name: 'custom-input-class',
    type: 'String',
    default: '""',
    desc: '自定义输入框样式类',
  },
]

// Events 事件文档
const apiEvents = [
  {
    name: 'update:modelValue',
    desc: '更新 modelValue，参数为当前输入值',
  },
  {
    name: 'change',
    desc: '输入内容变化时触发，参数为 { value: string }',
  },
  {
    name: 'clear',
    desc: '点击清除按钮时触发',
  },
  {
    name: 'search',
    desc: '点击搜索按钮或回车时触发，参数为 { value: string }',
  },
  {
    name: 'focus',
    desc: '输入框获得焦点时触发，参数为 { value: string }',
  },
  {
    name: 'blur',
    desc: '输入框失去焦点时触发，参数为 { value: string }',
  },
  {
    name: 'cancel',
    desc: '点击取消按钮时触发，参数为 { value: string }',
  },
]

// Methods 方法文档（Search 组件没有暴露方法）
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
 * 基本搜索事件
 */
const handleBasicSearch = ({ value }: { value: string }) => {
  console.log('基本搜索:', value)
  uni.showToast({ title: `搜索：${value}`, icon: 'none' })
}

/**
 * 基本输入变化事件
 */
const handleBasicChange = ({ value }: { value: string }) => {
  console.log('基本输入变化:', value)
}

/**
 * 基本取消事件
 */
const handleBasicCancel = ({ value }: { value: string }) => {
  console.log('基本取消:', value)
  uni.showToast({ title: '取消搜索', icon: 'none' })
}

/**
 * 基本清空事件
 */
const handleBasicClear = () => {
  console.log('基本清空')
  uni.showToast({ title: '已清空', icon: 'none' })
}

/**
 * 通用搜索处理
 */
const handleSearch = ({ value }: { value: string }) => {
  console.log('搜索内容:', value)
  if (value.trim()) {
    uni.showToast({ title: `搜索：${value}`, icon: 'none' })
  }
}

/**
 * 搜索类型切换
 */
const handleSearchTypeChange = ({ item }: { item: any }) => {
  currentSearchType.value = item.content
  console.log('切换搜索类型:', item.content)
}

/**
 * 扫码功能
 */
const handleScanCode = () => {
  console.log('点击扫码按钮')
  uni.showToast({ title: '打开扫码功能', icon: 'none' })
  // 这里可以调用真实的扫码功能
}

// === 事件监听处理方法 ===

/**
 * 事件监听 - 搜索
 */
const handleEventSearch = ({ value }: { value: string }) => {
  addEventLog(`搜索: ${value}`, 'success')
}

/**
 * 事件监听 - 输入变化
 */
const handleEventChange = ({ value }: { value: string }) => {
  addEventLog(`输入变化: ${value}`, 'info')
}

/**
 * 事件监听 - 获得焦点
 */
const handleEventFocus = ({ value }: { value: string }) => {
  addEventLog(`获得焦点: ${value}`, 'info')
}

/**
 * 事件监听 - 失去焦点
 */
const handleEventBlur = ({ value }: { value: string }) => {
  addEventLog(`失去焦点: ${value}`, 'warning')
}

/**
 * 事件监听 - 清空
 */
const handleEventClear = () => {
  addEventLog('清空内容', 'warning')
}

/**
 * 事件监听 - 取消
 */
const handleEventCancel = ({ value }: { value: string }) => {
  addEventLog(`取消搜索: ${value}`, 'error')
}

// === 应用场景处理方法 ===

/**
 * 商品搜索
 */
const handleProductSearch = ({ value }: { value: string }) => {
  console.log('商品搜索:', value)
  uni.showToast({ title: `搜索商品：${value}`, icon: 'none' })
  // 跳转到搜索结果页面
}

/**
 * 热门标签点击
 */
const handleHotTagClick = (tag: string) => {
  scenarioValue1.value = tag
  handleProductSearch({ value: tag })
}

/**
 * 订单搜索
 */
const handleOrderSearch = ({ value }: { value: string }) => {
  console.log('订单搜索:', value)
  uni.showToast({ title: `查询订单：${value}`, icon: 'none' })
  // 执行订单查询逻辑
}

/**
 * 文档搜索
 */
const handleDocSearch = ({ value }: { value: string }) => {
  console.log('文档搜索:', value)
  // 模拟搜索结果
  searchResultCount.value = Math.floor(Math.random() * 100) + 1
  uni.showToast({ title: `找到 ${searchResultCount.value} 个结果`, icon: 'none' })
}

/**
 * 文档输入变化
 */
const handleDocChange = ({ value }: { value: string }) => {
  if (!value.trim()) {
    searchResultCount.value = 0
  }
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
/* 搜索类型选择器样式 */
.search-type-selector {
  position: relative;
  height: 30px;
  line-height: 30px;
  padding: 0 8px 0 16px;
  color: rgba(0, 0, 0, 0.45);
}

.search-type-selector::after {
  position: absolute;
  content: '';
  width: 1px;
  right: 0;
  top: 5px;
  bottom: 5px;
  background: rgba(0, 0, 0, 0.25);
  transform: scaleX(0.5);
}

.search-type-arrow {
  margin-left: 4px;
  font-size: 18px;
  vertical-align: middle;
  color: rgba(0, 0, 0, 0.65);
}

/* 自定义后置插槽样式 */
.custom-suffix {
  display: flex;
  align-items: center;
  padding: 0 12px;
  color: #666;
  border-left: 1px solid #e5e5e5;
  margin-left: 8px;
  cursor: pointer;
  transition: color 0.2s;
}

.custom-suffix:hover {
  color: #409eff;
}
</style>
