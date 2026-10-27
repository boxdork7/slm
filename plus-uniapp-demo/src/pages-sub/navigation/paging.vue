<!-- WdPaging 智能分页 http://127.0.0.1:100/#/pages-sub/demo/wd/paging -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="WdPaging 智能分页" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的智能分页列表，自动加载和分页管理">
      <!-- 示例效果展示 -->
      <view class="h-80 overflow-hidden border rounded-lg">
        <wd-paging :fetch="fetchBasicList">
          <template #item="{ item }">
            <view class="mx-4 mb-3 rounded-lg bg-white p-4 shadow-sm">
              <view class="flex items-center justify-between">
                <view class="text-base font-medium">{{ item.title }}</view>
                <view class="text-xs text-gray-500">#{{ item.id }}</view>
              </view>
              <view class="mt-2 text-sm text-gray-600">{{ item.description }}</view>
              <view class="mt-2 text-xs text-gray-400">{{ item.createTime }}</view>
            </view>
          </template>
        </wd-paging>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基本用法" :code="codes.basic.template" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 搜索功能示例 -->
    <DemoSection title="搜索功能" desc="支持搜索关键词，自动刷新列表数据">
      <view class="h-80 overflow-hidden border rounded-lg">
        <wd-paging
          :fetch="fetchUserList"
          show-search
          search-placeholder="搜索用户名或邮箱"
          show-total
          @search="handleSearch"
        >
          <template #item="{ item }">
            <view class="mx-4 mb-3 rounded-lg bg-white p-4 shadow-sm">
              <view class="flex items-center">
                <view
                  class="mr-3 h-10 w-10 flex items-center justify-center rounded-full bg-blue-100"
                >
                  <text class="text-blue-600 font-medium">{{ item.name.charAt(0) }}</text>
                </view>
                <view class="flex-1">
                  <view class="text-base font-medium">{{ item.name }}</view>
                  <view class="text-sm text-gray-500">{{ item.email }}</view>
                </view>
                <view class="text-xs text-gray-400">{{ item.role }}</view>
              </view>
            </view>
          </template>
        </wd-paging>
      </view>

      <template #codes>
        <DemoCode title="模板 - 搜索功能" :code="codes.search.template" />
        <DemoCode title="脚本 - 搜索功能" :code="codes.search.script" />
      </template>
    </DemoSection>

    <!-- Tab 切换示例 -->
    <DemoSection title="Tab 切换" desc="每个 Tab 独立管理数据，支持徽标显示">
      <view class="h-80 overflow-hidden border rounded-lg">
        <wd-paging
          :fetch="fetchOrderList"
          :tabs="orderTabs"
          default-tab="all"
          show-search
          search-placeholder="搜索订单号"
          @tab-change="handleTabChange"
        >
          <template #item="{ item }">
            <view class="mx-4 mb-3 rounded-lg bg-white p-4 shadow-sm">
              <view class="flex items-center justify-between">
                <view class="text-base font-medium">订单 #{{ item.orderNo }}</view>
                <view class="rounded-full px-2 py-1 text-xs" :class="getStatusClass(item.status)">
                  {{ getStatusText(item.status) }}
                </view>
              </view>
              <view class="mt-2 text-sm text-gray-600">{{ item.productName }}</view>
              <view class="mt-2 flex items-center justify-between">
                <view class="text-lg text-red-500 font-medium">¥{{ item.amount }}</view>
                <view class="text-xs text-gray-400">{{ item.createTime }}</view>
              </view>
            </view>
          </template>
        </wd-paging>
      </view>

      <template #codes>
        <DemoCode title="模板 - Tab 切换" :code="codes.tabs.template" />
        <DemoCode title="脚本 - Tab 切换" :code="codes.tabs.script" />
      </template>
    </DemoSection>

    <!-- 固定布局示例 -->
    <!--    <DemoSection title="固定布局" desc="Tab 和搜索框固定在顶部，适合长列表浏览"> -->
    <!--      <view class="h-80 overflow-hidden border rounded-lg"> -->
    <!--        <wd-paging -->
    <!--          :fetch="fetchProductList" -->
    <!--          :tabs="productTabs" -->
    <!--          :tabs-fixed="true" -->
    <!--          :search-sticky="true" -->
    <!--          show-search -->
    <!--          search-placeholder="搜索商品名称" -->
    <!--          :navbar-height="88" -->
    <!--        > -->
    <!--          <template #item="{ item }"> -->
    <!--            <view class="mx-4 mb-3 rounded-lg bg-white p-4 shadow-sm"> -->
    <!--              <view class="flex"> -->
    <!--                <view -->
    <!--                  class="mr-3 h-16 w-16 flex items-center justify-center rounded-lg bg-gray-100" -->
    <!--                > -->
    <!--                  <text class="text-xs text-gray-400">图片</text> -->
    <!--                </view> -->
    <!--                <view class="flex-1"> -->
    <!--                  <view class="text-base font-medium">{{ item.name }}</view> -->
    <!--                  <view class="mt-1 text-sm text-gray-500">{{ item.category }}</view> -->
    <!--                  <view class="mt-2 flex items-center justify-between"> -->
    <!--                    <view class="text-lg text-red-500 font-medium">¥{{ item.price }}</view> -->
    <!--                    <view class="text-xs text-gray-400">库存{{ item.stock }}</view> -->
    <!--                  </view> -->
    <!--                </view> -->
    <!--              </view> -->
    <!--            </view> -->
    <!--          </template> -->
    <!--        </wd-paging> -->
    <!--      </view> -->

    <!--      <template #codes> -->
    <!--        <DemoCode title="模板 - 固定布局" :code="codes.fixed.template" /> -->
    <!--        <DemoCode title="脚本 - 固定布局" :code="codes.fixed.script" /> -->
    <!--      </template> -->
    <!--    </DemoSection> -->

    <!-- 自定义空状态示例 -->
    <DemoSection title="自定义空状态" desc="自定义空数据展示内容和操作">
      <view class="h-80 overflow-hidden border rounded-lg">
        <wd-paging ref="emptyPagingRef" :fetch="fetchEmptyList">
          <template #item="{ item }">
            <view class="mx-4 mb-3 rounded-lg bg-white p-4 shadow-sm">
              <text>{{ item.title }}</text>
            </view>
          </template>
          <template #empty>
            <view class="flex flex-col items-center justify-center py-16">
              <view class="mb-4 text-6xl">📦</view>
              <view class="text-lg text-gray-600 font-medium">暂无数据</view>
              <view class="mt-2 text-sm text-gray-400">请尝试其他搜索条件</view>
              <wd-button size="small" type="primary" class="mt-4" @click="handleRefreshEmpty">
                重新加载
              </wd-button>
            </view>
          </template>
        </wd-paging>
      </view>

      <template #codes>
        <DemoCode title="模板 - 自定义空状态" :code="codes.empty.template" />
        <DemoCode title="脚本 - 自定义空状态" :code="codes.empty.script" />
      </template>
    </DemoSection>

    <!-- 高级配置示例 -->
    <DemoSection title="高级配置" desc="更多配置选项和自定义设置">
      <wd-cell-group>
        <wd-cell title="自定义页面大小" vertical>
          <view class="h-64 overflow-hidden border rounded-lg">
            <wd-paging :fetch="fetchCustomPageList" :page-size="5" show-search show-total>
              <template #item="{ item }">
                <view class="mx-4 mb-3 rounded-lg bg-blue-50 p-3">
                  <view class="text-sm font-medium">{{ item.title }}</view>
                  <view class="mt-1 text-xs text-gray-500">每页只显示5条数据</view>
                </view>
              </template>
            </wd-paging>
          </view>
        </wd-cell>

        <wd-cell title="禁用自动加载" vertical>
          <view class="space-y-3">
            <view class="h-48 overflow-hidden border rounded-lg">
              <wd-paging ref="manualPagingRef" :fetch="fetchManualList" :auto="false" show-total>
                <template #item="{ item }">
                  <view class="mx-4 mb-3 rounded-lg bg-green-50 p-3">
                    <view class="text-sm font-medium">{{ item.title }}</view>
                    <view class="mt-1 text-xs text-gray-500">手动控制加载</view>
                  </view>
                </template>
              </wd-paging>
            </view>
            <view class="flex space-x-2">
              <wd-button size="small" @click="handleManualLoad">加载数据</wd-button>
              <wd-button size="small" @click="handleManualRefresh">刷新数据</wd-button>
            </view>
          </view>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 自定义页面大小" :code="codes.advanced.pageSizeTemplate" />
        <DemoCode title="模板 - 禁用自动加载" :code="codes.advanced.manualTemplate" />
        <DemoCode title="脚本 - 高级配置" :code="codes.advanced.script" />
      </template>
    </DemoSection>

    <!-- 事件监听示例 -->
    <DemoSection title="事件监听" desc="监听组件的各种事件和状态变化">
      <!-- 状态显示区域 -->
      <view class="space-y-4">
        <!-- 事件监听分页 -->
        <view class="h-64 overflow-hidden border rounded-lg">
          <wd-paging
            :fetch="fetchEventList"
            :tabs="eventTabs"
            show-search
            show-total
            @load="handleLoad"
            @search="handleEventSearch"
            @tab-change="handleEventTabChange"
            @error="handleError"
          >
            <template #item="{ item }">
              <view class="mx-4 mb-3 rounded-lg bg-white p-4 shadow-sm">
                <view class="text-sm font-medium">{{ item.title }}</view>
                <view class="mt-1 text-xs text-gray-500">{{ item.description }}</view>
              </view>
            </template>
          </wd-paging>
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

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import type { PagingTabItem } from '@/wd/components/wd-paging/wd-paging.vue'

// 类型定义
interface PageQuery {
  pageNum: number
  pageSize: number
  searchValue?: string

  [key: string]: any
}

interface PageResult<T> {
  records: T[]
  total: number
  current: number
  pages: number
  size: number
  last: boolean
}

type Result<T> = [Error | null, T | null]

interface EventLog {
  time: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

// ===== 组件状态管理 =====

// 组件引用
const emptyPagingRef = ref()
const manualPagingRef = ref()

// 事件日志状态
const eventLogs = ref<EventLog[]>([])

// Tab 配置
const orderTabs = ref<PagingTabItem[]>([
  {
    name: 'all',
    title: '全部',
    data: {},
    badgeProps: { modelValue: 99, max: 99 },
  },
  {
    name: 'pending',
    title: '待付款',
    data: { status: 'pending' },
    badgeProps: { modelValue: 5, isDot: false },
  },
  {
    name: 'paid',
    title: '已付款',
    data: { status: 'paid' },
  },
  {
    name: 'shipped',
    title: '已发货',
    data: { status: 'shipped' },
  },
  {
    name: 'completed',
    title: '已完成',
    data: { status: 'completed' },
  },
])

const productTabs = ref<PagingTabItem[]>([
  { name: 'all', title: '全部商品', data: {} },
  { name: 'electronics', title: '电子产品', data: { category: 'electronics' } },
  { name: 'clothing', title: '服装', data: { category: 'clothing' } },
  { name: 'books', title: '图书', data: { category: 'books' } },
])

const eventTabs = ref<PagingTabItem[]>([
  { name: 'all', title: '全部事件', data: {} },
  { name: 'load', title: '加载事件', data: { type: 'load' } },
  { name: 'search', title: '搜索事件', data: { type: 'search' } },
])

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    template: `<wd-paging :fetch="fetchBasicList">
  <template #item="{ item }">
    <view class="mx-4 mb-3 rounded-lg bg-white p-4 shadow-sm">
      <view class="flex items-center justify-between">
        <view class="text-base font-medium">{{ item.title }}</view>
        <view class="text-xs text-gray-500">#{{ item.id }}</view>
      </view>
      <view class="mt-2 text-sm text-gray-600">{{ item.description }}</view>
      <view class="mt-2 text-xs text-gray-400">{{ item.createTime }}</view>
    </view>
  </template>
</wd-paging>`,

    script: `import { ref } from 'vue'

// 类型定义
interface PageQuery {
  pageNum: number
  pageSize: number
  searchValue?: string
  [key: string]: any
}

interface PageResult<T> {
  records: T[]
  total: number
  current: number
  pages: number
  size: number
  last: boolean
}

type Result<T> = [Error | null, T | null]

// 基本列表数据获取
const fetchBasicList = async (query: PageQuery): Promise<Result<PageResult<any>>> => {
  console.log('基本列表查询参数:', query)

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 800))

  const { pageNum = 1, pageSize = 10 } = query
  const total = 45 // 模拟总数

  const records = Array.from({ length: Math.min(pageSize, total - (pageNum - 1) * pageSize) }, (_, index) => ({
    id: Math.floor(Math.random() * 10000),
    title: \`文章标题 \${(pageNum - 1) * pageSize + index + 1}\`,
    description: \`这是第 \${(pageNum - 1) * pageSize + index + 1} 篇文章的描述内容。\`,
    createTime: new Date().toLocaleDateString()
  }))

  return [null, {
    records,
    total,
    current: pageNum,
    pages: Math.ceil(total / pageSize),
    size: pageSize,
    last: pageNum >= Math.ceil(total / pageSize)
  }]
}`,
  },

  // 搜索功能代码
  search: {
    template: `<wd-paging
  :fetch="fetchUserList"
  show-search
  search-placeholder="搜索用户名或邮箱"
  show-total
  @search="handleSearch"
>
  <template #item="{ item }">
    <view class="mx-4 mb-3 rounded-lg bg-white p-4 shadow-sm">
      <view class="flex items-center">
        <view class="mr-3 h-10 w-10 flex items-center justify-center rounded-full bg-blue-100">
          <text class="text-blue-600 font-medium">{{ item.name.charAt(0) }}</text>
        </view>
        <view class="flex-1">
          <view class="text-base font-medium">{{ item.name }}</view>
          <view class="text-sm text-gray-500">{{ item.email }}</view>
        </view>
        <view class="text-xs text-gray-400">{{ item.role }}</view>
      </view>
    </view>
  </template>
</wd-paging>`,

    script: `// 用户数据
const users = [
  { name: '张三', email: 'zhangsan@example.com', role: '管理员' },
  { name: '李四', email: 'lisi@example.com', role: '用户' },
  { name: '王五', email: 'wangwu@example.com', role: '编辑' },
]

const fetchUserList = async (query: PageQuery): Promise<Result<PageResult<any>>> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  const { pageNum = 1, pageSize = 10, searchValue = '' } = query

  // 搜索过滤
  let filteredUsers = users
  if (searchValue) {
    filteredUsers = users.filter(user =>
      user.name.includes(searchValue) ||
      user.email.includes(searchValue)
    )
  }

  const total = filteredUsers.length * 8 // 模拟更多数据
  const startIndex = (pageNum - 1) * pageSize

  const records = Array.from({ length: Math.min(pageSize, total - startIndex) }, (_, index) => {
    const userIndex = (startIndex + index) % filteredUsers.length
    const user = filteredUsers[userIndex]
    return {
      id: Math.floor(Math.random() * 10000),
      name: \`\${user.name}_\${Math.floor((startIndex + index) / filteredUsers.length) + 1}\`,
      email: user.email,
      role: user.role
    }
  })

  return [null, {
    records,
    total,
    current: pageNum,
    pages: Math.ceil(total / pageSize),
    size: pageSize,
    last: pageNum >= Math.ceil(total / pageSize)
  }]
}

const handleSearch = (keyword: string) => {
  console.log('搜索关键词:', keyword)
}`,
  },

  // Tab 切换代码
  tabs: {
    template: `<wd-paging
  :fetch="fetchOrderList"
  :tabs="orderTabs"
  default-tab="all"
  show-search
  search-placeholder="搜索订单号"
  @tab-change="handleTabChange"
>
  <template #item="{ item }">
    <view class="mx-4 mb-3 rounded-lg bg-white p-4 shadow-sm">
      <view class="flex items-center justify-between">
        <view class="text-base font-medium">订单 #{{ item.orderNo }}</view>
        <view class="rounded-full px-2 py-1 text-xs" :class="getStatusClass(item.status)">
          {{ getStatusText(item.status) }}
        </view>
      </view>
      <view class="mt-2 text-sm text-gray-600">{{ item.productName }}</view>
      <view class="mt-2 flex items-center justify-between">
        <view class="text-lg text-red-500 font-medium">¥{{ item.amount }}</view>
        <view class="text-xs text-gray-400">{{ item.createTime }}</view>
      </view>
    </view>
  </template>
</wd-paging>`,

    script: `// Tab 配置
const orderTabs = ref<PagingTabItem[]>([
  {
    name: 'all',
    title: '全部',
    data: {},
    badgeProps: { modelValue: 99, max: 99 }
  },
  {
    name: 'pending',
    title: '待付款',
    data: { status: 'pending' },
    badgeProps: { modelValue: 5, isDot: false }
  },
  {
    name: 'paid',
    title: '已付款',
    data: { status: 'paid' }
  }
])

const fetchOrderList = async (query: PageQuery): Promise<Result<PageResult<any>>> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  const { pageNum = 1, pageSize = 10, status, searchValue = '' } = query

  const statusTotals = {
    pending: 15,
    paid: 25,
    shipped: 18,
    completed: 42
  }

  const total = status ? statusTotals[status] || 0 : 100
  const startIndex = (pageNum - 1) * pageSize

  const records = Array.from({ length: Math.min(pageSize, total - startIndex) }, (_, index) => ({
    id: Math.floor(Math.random() * 10000),
    orderNo: \`\${Date.now()}\${String(startIndex + index).padStart(3, '0')}\`,
    productName: \`商品名称 \${startIndex + index + 1}\`,
    amount: (Math.random() * 500 + 50).toFixed(2),
    status: status || ['pending', 'paid', 'shipped', 'completed'][Math.floor(Math.random() * 4)],
    createTime: new Date().toLocaleDateString()
  }))

  return [null, {
    records,
    total,
    current: pageNum,
    pages: Math.ceil(total / pageSize),
    size: pageSize,
    last: pageNum >= Math.ceil(total / pageSize)
  }]
}

const handleTabChange = (event: any) => {
  console.log('Tab 切换:', event)
}`,
  },

  // 固定布局代码
  fixed: {
    template: `<wd-paging
  :fetch="fetchProductList"
  :tabs="productTabs"
  :tabs-fixed="true"
  :search-sticky="true"
  show-search
  search-placeholder="搜索商品名称"
  :navbar-height="88"
>
  <template #item="{ item }">
    <view class="mx-4 mb-3 rounded-lg bg-white p-4 shadow-sm">
      <view class="flex">
        <view class="mr-3 h-16 w-16 flex items-center justify-center rounded-lg bg-gray-100">
          <text class="text-xs text-gray-400">图片</text>
        </view>
        <view class="flex-1">
          <view class="text-base font-medium">{{ item.name }}</view>
          <view class="mt-1 text-sm text-gray-500">{{ item.category }}</view>
          <view class="mt-2 flex items-center justify-between">
            <view class="text-lg text-red-500 font-medium">¥{{ item.price }}</view>
            <view class="text-xs text-gray-400">库存{{ item.stock }}</view>
          </view>
        </view>
      </view>
    </view>
  </template>
</wd-paging>`,

    script: `const productTabs = ref<PagingTabItem[]>([
  { name: 'all', title: '全部商品', data: {} },
  { name: 'electronics', title: '电子产品', data: { category: 'electronics' } },
  { name: 'clothing', title: '服装', data: { category: 'clothing' } },
  { name: 'books', title: '图书', data: { category: 'books' } }
])

const fetchProductList = async (query: PageQuery): Promise<Result<PageResult<any>>> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  const { pageNum = 1, pageSize = 10, category, searchValue = '' } = query

  const categoryNames = {
    electronics: '电子产品',
    clothing: '服装',
    books: '图书'
  }

  const total = category ? 30 : 120
  const startIndex = (pageNum - 1) * pageSize

  const records = Array.from({ length: Math.min(pageSize, total - startIndex) }, (_, index) => ({
    id: Math.floor(Math.random() * 10000),
    name: \`\${categoryNames[category] || '商品'} \${startIndex + index + 1}\`,
    category: categoryNames[category] || '通用分类',
    price: (Math.random() * 1000 + 10).toFixed(2),
    stock: Math.floor(Math.random() * 100)
  }))

  return [null, {
    records,
    total,
    current: pageNum,
    pages: Math.ceil(total / pageSize),
    size: pageSize,
    last: pageNum >= Math.ceil(total / pageSize)
  }]
}`,
  },

  // 自定义空状态代码
  empty: {
    template: `<wd-paging :fetch="fetchEmptyList" ref="emptyPagingRef">
  <template #item="{ item }">
    <view class="mx-4 mb-3 rounded-lg bg-white p-4 shadow-sm">
      <text>{{ item.title }}</text>
    </view>
  </template>
  <template #empty>
    <view class="flex flex-col items-center justify-center py-16">
      <view class="mb-4 text-6xl">📦</view>
      <view class="text-lg text-gray-600 font-medium">暂无数据</view>
      <view class="mt-2 text-sm text-gray-400">请尝试其他搜索条件</view>
      <wd-button
        size="small"
        type="primary"
        class="mt-4"
        @click="handleRefreshEmpty"
      >
        重新加载
      </wd-button>
    </view>
  </template>
</wd-paging>`,

    script: `// 组件引用
const emptyPagingRef = ref()

const fetchEmptyList = async (query: PageQuery): Promise<Result<PageResult<any>>> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  return [null, {
    records: [],
    total: 0,
    current: 1,
    pages: 0,
    size: 10,
    last: true
  }]
}

const handleRefreshEmpty = () => {
  emptyPagingRef.value?.refresh()
  console.log('重新加载空数据')
}`,
  },

  // 高级配置代码
  advanced: {
    pageSizeTemplate: `<wd-paging
  :fetch="fetchCustomPageList"
  :page-size="5"
  show-search
  show-total
>
  <template #item="{ item }">
    <view class="mx-4 mb-3 rounded-lg bg-blue-50 p-3">
      <view class="text-sm font-medium">{{ item.title }}</view>
      <view class="text-xs text-gray-500 mt-1">每页只显示5条数据</view>
    </view>
  </template>
</wd-paging>`,

    manualTemplate: `<wd-paging
  :fetch="fetchManualList"
  :auto="false"
  ref="manualPagingRef"
  show-total
>
  <template #item="{ item }">
    <view class="mx-4 mb-3 rounded-lg bg-green-50 p-3">
      <view class="text-sm font-medium">{{ item.title }}</view>
      <view class="text-xs text-gray-500 mt-1">手动控制加载</view>
    </view>
  </template>
</wd-paging>

<!-- 控制按钮 -->
<view class="flex space-x-2">
  <wd-button size="small" @click="handleManualLoad">加载数据</wd-button>
  <wd-button size="small" @click="handleManualRefresh">刷新数据</wd-button>
</view>`,

    script: `// 组件引用
const manualPagingRef = ref()

const fetchCustomPageList = async (query: PageQuery): Promise<Result<PageResult<any>>> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  const { pageNum = 1, pageSize = 5 } = query
  const total = 23

  const records = Array.from({ length: Math.min(pageSize, total - (pageNum - 1) * pageSize) }, (_, index) => ({
    id: Math.floor(Math.random() * 10000),
    title: \`自定义页面大小数据 \${(pageNum - 1) * pageSize + index + 1}\`
  }))

  return [null, {
    records,
    total,
    current: pageNum,
    pages: Math.ceil(total / pageSize),
    size: pageSize,
    last: pageNum >= Math.ceil(total / pageSize)
  }]
}

const fetchManualList = async (query: PageQuery): Promise<Result<PageResult<any>>> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  const { pageNum = 1, pageSize = 10 } = query
  const total = 35

  const records = Array.from({ length: Math.min(pageSize, total - (pageNum - 1) * pageSize) }, (_, index) => ({
    id: Math.floor(Math.random() * 10000),
    title: \`手动控制数据 \${(pageNum - 1) * pageSize + index + 1}\`
  }))

  return [null, {
    records,
    total,
    current: pageNum,
    pages: Math.ceil(total / pageSize),
    size: pageSize,
    last: pageNum >= Math.ceil(total / pageSize)
  }]
}

const handleManualLoad = () => {
  manualPagingRef.value?.refresh()
  console.log('手动加载数据')
}

const handleManualRefresh = () => {
  manualPagingRef.value?.refresh()
  console.log('手动刷新数据')
}`,
  },

  // 事件监听代码
  events: {
    template: `
      <wd-paging
        :fetch="fetchEventList"
        :tabs="eventTabs"
        show-search
        show-total
        @load="handleLoad"
        @search="handleEventSearch"
        @tab-change="handleEventTabChange"
        @error="handleError"
      >
        <template #item="{ item }">
          <view class="mx-4 mb-3 rounded-lg bg-white p-4 shadow-sm">
            <view class="text-sm font-medium">{{ item.title }}</view>
            <view class="text-xs text-gray-500 mt-1">{{ item.description }}</view>
          </view>
        </template>
      </wd-paging>`,

    methods: `// 事件日志状态
const eventLogs = ref<EventLog[]>([])

const eventTabs = ref<PagingTabItem[]>([
  { name: 'all', title: '全部事件', data: {} },
  { name: 'load', title: '加载事件', data: { type: 'load' } },
  { name: 'search', title: '搜索事件', data: { type: 'search' } }
])

const fetchEventList = async (query: PageQuery): Promise<Result<PageResult<any>>> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  const { pageNum = 1, pageSize = 10, type } = query
  const total = type ? 15 : 50

  const records = Array.from({ length: Math.min(pageSize, total - (pageNum - 1) * pageSize) }, (_, index) => ({
    id: Math.floor(Math.random() * 10000),
    title: \`\${type || '通用'}事件 \${(pageNum - 1) * pageSize + index + 1}\`,
    description: \`这是一个\${type || '通用'}类型的事件描述\`
  }))

  return [null, {
    records,
    total,
    current: pageNum,
    pages: Math.ceil(total / pageSize),
    size: pageSize,
    last: pageNum >= Math.ceil(total / pageSize)
  }]
}

// 事件处理方法
const handleLoad = (data: PageResult<any>, tabIndex?: number) => {
  addEventLog(\`数据加载完成，共 \${data.total} 条记录，当前第 \${data.current} 页\`, 'success')
}

const handleEventSearch = (keyword: string) => {
  addEventLog(\`执行搜索：\${keyword}\`, 'info')
}

const handleEventTabChange = (event: any) => {
  addEventLog(\`切换到 Tab：\${event.tab.title}\`, 'info')
}

const handleError = (error: Error) => {
  addEventLog(\`发生错误：\${error.message}\`, 'error')
}

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

const clearEventLogs = () => {
  eventLogs.value = []
  addEventLog('事件日志已清空', 'info')
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'fetch',
    type: 'Function',
    default: '-',
    desc: 'API请求函数，接收PageQuery参数，返回Result<PageResult<any>>',
  },
  {
    name: 'params',
    type: 'Object',
    default: '{}',
    desc: '查询参数，会合并到PageQuery中',
  },
  {
    name: 'auto',
    type: 'Boolean',
    default: 'true',
    desc: '是否自动加载',
  },
  {
    name: 'page-size',
    type: 'Number',
    default: '10',
    desc: '每页大小',
  },
  {
    name: 'show-search',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示搜索',
  },
  {
    name: 'search-placeholder',
    type: 'String',
    default: '"请输入搜索关键词"',
    desc: '搜索占位符',
  },
  {
    name: 'search-sticky',
    type: 'Boolean',
    default: 'false',
    desc: '搜索框是否粘性定位',
  },
  {
    name: 'tabs',
    type: 'PagingTabItem[]',
    default: '[]',
    desc: 'Tabs 配置',
  },
  {
    name: 'default-tab',
    type: 'Number | String',
    default: '0',
    desc: '默认选中的 Tab',
  },
  {
    name: 'tabs-fixed',
    type: 'Boolean',
    default: 'false',
    desc: '是否固定Tab',
  },
  {
    name: 'show-total',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示总数',
  },
  {
    name: 'show-back-top',
    type: 'Boolean',
    default: 'true',
    desc: '是否显示回顶部',
  },
  {
    name: 'background',
    type: 'String',
    default: '""',
    desc: '背景色',
  },
  {
    name: 'bottom-safe-area',
    type: 'String',
    default: '"72rpx"',
    desc: '底部安全距离',
  },
  {
    name: 'empty-min-height',
    type: 'String',
    default: '"600rpx"',
    desc: '空数据区域最小高度',
  },
  {
    name: 'loading-min-height',
    type: 'String',
    default: '"600rpx"',
    desc: '加载区域最小高度',
  },
  {
    name: 'loading-text',
    type: 'String',
    default: '"加载中..."',
    desc: '加载文本',
  },
  {
    name: 'load-more-text',
    type: 'String',
    default: '"上拉加载更多"',
    desc: '加载更多文本',
  },
  {
    name: 'finished-text',
    type: 'String',
    default: '"没有更多了"',
    desc: '完成文本',
  },
  {
    name: 'empty-text',
    type: 'String',
    default: '"暂无数据"',
    desc: '空数据文本',
  },
  {
    name: 'empty-image',
    type: 'String',
    default: '"content"',
    desc: '空数据图片类型',
  },
  {
    name: 'navbar-height',
    type: 'Number',
    default: '0',
    desc: '导航栏高度（rpx），用于tabs固定到最上方时',
  },
]

// Methods 方法文档
const apiMethods = [
  {
    name: 'refresh()',
    desc: '刷新数据，重新从第一页开始加载',
  },
  {
    name: 'loadMore()',
    desc: '加载更多数据',
  },
  {
    name: 'scrollToTop()',
    desc: '滚动到顶部',
  },
  {
    name: 'switchTab(nameOrIndex)',
    desc: '切换Tab，参数为Tab名称或索引',
  },
]

// Events 事件文档
const apiEvents = [
  {
    name: 'load',
    desc: '数据加载完成时触发，参数为 (data: PageResult<any>, tabIndex?: number)',
  },
  {
    name: 'search',
    desc: '搜索时触发，参数为 (keyword: string)',
  },
  {
    name: 'tab-change',
    desc: 'Tab切换时触发，参数为 { index: number, name: string | number, tab: TabItem }',
  },
  {
    name: 'error',
    desc: '发生错误时触发，参数为 (error: Error)',
  },
]

// ===== 工具方法 =====

/**
 * 生成随机ID
 */
const generateId = (): number => Math.floor(Math.random() * 10000)

/**
 * 生成随机日期
 */
const generateDate = (): string => {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * 30))
  return date.toLocaleDateString()
}

/**
 * 模拟网络延迟
 */
const mockDelay = (ms = 800): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * 获取订单状态样式类名
 */
const getStatusClass = (status: string): string => {
  const statusClasses = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800'
}

/**
 * 获取订单状态文本
 */
const getStatusText = (status: string): string => {
  const statusTexts = {
    pending: '待付款',
    paid: '已付款',
    shipped: '已发货',
    completed: '已完成',
  }
  return statusTexts[status] || '未知'
}

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
const getLogColor = (type: EventLog['type']): string => {
  const colors = {
    info: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-orange-600',
    error: 'text-red-600',
  }
  return colors[type]
}

// ===== 数据获取方法 =====

/**
 * 基本列表数据获取
 */
const fetchBasicList = async (query: PageQuery): Promise<Result<PageResult<any>>> => {
  console.log('基本列表查询参数:', query)
  await mockDelay()

  const { pageNum = 1, pageSize = 10 } = query
  const total = 45 // 模拟总数

  const records = Array.from(
    { length: Math.min(pageSize, total - (pageNum - 1) * pageSize) },
    (_, index) => ({
      id: generateId(),
      title: `文章标题 ${(pageNum - 1) * pageSize + index + 1}`,
      description: `这是第 ${(pageNum - 1) * pageSize + index + 1} 篇文章的描述内容，包含了丰富的信息。`,
      createTime: generateDate(),
    }),
  )

  return [
    null,
    {
      records,
      total,
      current: pageNum,
      pages: Math.ceil(total / pageSize),
      size: pageSize,
      last: pageNum >= Math.ceil(total / pageSize),
    },
  ]
}

/**
 * 用户列表数据获取
 */
const fetchUserList = async (query: PageQuery): Promise<Result<PageResult<any>>> => {
  console.log('用户列表查询参数:', query)
  await mockDelay()

  const { pageNum = 1, pageSize = 10, searchValue = '' } = query

  // 模拟用户数据
  const users = [
    { name: '张三', email: 'zhangsan@example.com', role: '管理员' },
    { name: '李四', email: 'lisi@example.com', role: '用户' },
    { name: '王五', email: 'wangwu@example.com', role: '编辑' },
    { name: '赵六', email: 'zhaoliu@example.com', role: '用户' },
    { name: '孙七', email: 'sunqi@example.com', role: '管理员' },
  ]

  // 模拟搜索过滤
  let filteredUsers = users
  if (searchValue) {
    filteredUsers = users.filter(
      (user) => user.name.includes(searchValue) || user.email.includes(searchValue),
    )
  }

  const total = filteredUsers.length * 8 // 模拟更多数据
  const startIndex = (pageNum - 1) * pageSize

  const records = Array.from({ length: Math.min(pageSize, total - startIndex) }, (_, index) => {
    const userIndex = (startIndex + index) % filteredUsers.length
    const user = filteredUsers[userIndex]
    return {
      id: generateId(),
      name: `${user.name}_${Math.floor((startIndex + index) / filteredUsers.length) + 1}`,
      email: user.email,
      role: user.role,
    }
  })

  return [
    null,
    {
      records,
      total,
      current: pageNum,
      pages: Math.ceil(total / pageSize),
      size: pageSize,
      last: pageNum >= Math.ceil(total / pageSize),
    },
  ]
}

/**
 * 订单列表数据获取
 */
const fetchOrderList = async (query: PageQuery): Promise<Result<PageResult<any>>> => {
  console.log('订单列表查询参数:', query)
  await mockDelay()

  const { pageNum = 1, pageSize = 10, status, searchValue = '' } = query

  // 根据状态模拟不同的总数
  const statusTotals = {
    pending: 15,
    paid: 25,
    shipped: 18,
    completed: 42,
  }

  const total = status ? statusTotals[status] || 0 : 100
  const startIndex = (pageNum - 1) * pageSize

  const records = Array.from({ length: Math.min(pageSize, total - startIndex) }, (_, index) => ({
    id: generateId(),
    orderNo: `${Date.now()}${String(startIndex + index).padStart(3, '0')}`,
    productName: `商品名称 ${startIndex + index + 1}`,
    amount: (Math.random() * 500 + 50).toFixed(2),
    status: status || ['pending', 'paid', 'shipped', 'completed'][Math.floor(Math.random() * 4)],
    createTime: generateDate(),
  }))

  return [
    null,
    {
      records,
      total,
      current: pageNum,
      pages: Math.ceil(total / pageSize),
      size: pageSize,
      last: pageNum >= Math.ceil(total / pageSize),
    },
  ]
}

/**
 * 商品列表数据获取
 */
const fetchProductList = async (query: PageQuery): Promise<Result<PageResult<any>>> => {
  console.log('商品列表查询参数:', query)
  await mockDelay()

  const { pageNum = 1, pageSize = 10, category, searchValue = '' } = query

  const categoryNames = {
    electronics: '电子产品',
    clothing: '服装',
    books: '图书',
  }

  const total = category ? 30 : 120
  const startIndex = (pageNum - 1) * pageSize

  const records = Array.from({ length: Math.min(pageSize, total - startIndex) }, (_, index) => ({
    id: generateId(),
    name: `${categoryNames[category] || '商品'} ${startIndex + index + 1}`,
    category: categoryNames[category] || '通用分类',
    price: (Math.random() * 1000 + 10).toFixed(2),
    stock: Math.floor(Math.random() * 100),
  }))

  return [
    null,
    {
      records,
      total,
      current: pageNum,
      pages: Math.ceil(total / pageSize),
      size: pageSize,
      last: pageNum >= Math.ceil(total / pageSize),
    },
  ]
}

/**
 * 空列表数据获取
 */
const fetchEmptyList = async (query: PageQuery): Promise<Result<PageResult<any>>> => {
  console.log('空列表查询参数:', query)
  await mockDelay()

  return [
    null,
    {
      records: [],
      total: 0,
      current: 1,
      pages: 0,
      size: 10,
      last: true,
    },
  ]
}

/**
 * 自定义页面大小数据获取
 */
const fetchCustomPageList = async (query: PageQuery): Promise<Result<PageResult<any>>> => {
  console.log('自定义页面大小查询参数:', query)
  await mockDelay()

  const { pageNum = 1, pageSize = 5 } = query
  const total = 23

  const records = Array.from(
    { length: Math.min(pageSize, total - (pageNum - 1) * pageSize) },
    (_, index) => ({
      id: generateId(),
      title: `自定义页面大小数据 ${(pageNum - 1) * pageSize + index + 1}`,
    }),
  )

  return [
    null,
    {
      records,
      total,
      current: pageNum,
      pages: Math.ceil(total / pageSize),
      size: pageSize,
      last: pageNum >= Math.ceil(total / pageSize),
    },
  ]
}

/**
 * 手动控制数据获取
 */
const fetchManualList = async (query: PageQuery): Promise<Result<PageResult<any>>> => {
  console.log('手动控制查询参数:', query)
  await mockDelay()

  const { pageNum = 1, pageSize = 10 } = query
  const total = 35

  const records = Array.from(
    { length: Math.min(pageSize, total - (pageNum - 1) * pageSize) },
    (_, index) => ({
      id: generateId(),
      title: `手动控制数据 ${(pageNum - 1) * pageSize + index + 1}`,
    }),
  )

  return [
    null,
    {
      records,
      total,
      current: pageNum,
      pages: Math.ceil(total / pageSize),
      size: pageSize,
      last: pageNum >= Math.ceil(total / pageSize),
    },
  ]
}

/**
 * 事件监听数据获取
 */
const fetchEventList = async (query: PageQuery): Promise<Result<PageResult<any>>> => {
  console.log('事件监听查询参数:', query)
  await mockDelay()

  const { pageNum = 1, pageSize = 10, type } = query
  const total = type ? 15 : 50

  const records = Array.from(
    { length: Math.min(pageSize, total - (pageNum - 1) * pageSize) },
    (_, index) => ({
      id: generateId(),
      title: `${type || '通用'}事件 ${(pageNum - 1) * pageSize + index + 1}`,
      description: `这是一个${type || '通用'}类型的事件描述`,
    }),
  )

  return [
    null,
    {
      records,
      total,
      current: pageNum,
      pages: Math.ceil(total / pageSize),
      size: pageSize,
      last: pageNum >= Math.ceil(total / pageSize),
    },
  ]
}

// ===== 事件处理方法 =====

/**
 * 搜索事件处理
 */
const handleSearch = (keyword: string) => {
  console.log('搜索关键词:', keyword)
}

/**
 * Tab 切换事件处理
 */
const handleTabChange = (event: any) => {
  console.log('Tab 切换:', event)
}

/**
 * 刷新空数据
 */
const handleRefreshEmpty = () => {
  emptyPagingRef.value?.refresh()
  console.log('重新加载空数据')
}

/**
 * 手动加载数据
 */
const handleManualLoad = () => {
  manualPagingRef.value?.refresh()
  console.log('手动加载数据')
}

/**
 * 手动刷新数据
 */
const handleManualRefresh = () => {
  manualPagingRef.value?.refresh()
  console.log('手动刷新数据')
}

/**
 * 数据加载完成事件
 */
const handleLoad = (data: PageResult<any>, tabIndex?: number) => {
  addEventLog(`数据加载完成，共 ${data.total} 条记录，当前第 ${data.current} 页`, 'success')
}

/**
 * 事件监听 - 搜索事件
 */
const handleEventSearch = (keyword: string) => {
  addEventLog(`执行搜索：${keyword}`, 'info')
}

/**
 * 事件监听 - Tab 切换事件
 */
const handleEventTabChange = (event: any) => {
  addEventLog(`切换到 Tab：${event.tab.title}`, 'info')
}

/**
 * 错误事件处理
 */
const handleError = (error: Error) => {
  addEventLog(`发生错误：${error.message}`, 'error')
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
