<!-- Pagination 分页 http://127.0.0.1:100/#/pages-sub/demo/wd/pagination -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Pagination 分页" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的分页使用方式，支持页码切换">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="基本分页" vertical>
          <wd-pagination v-model="page1" :total="total1" @change="handleBasicChange" />
        </wd-cell>

        <wd-cell title="自定义总页数" vertical>
          <wd-pagination
            v-model="page2"
            :total-page="totalPage2"
            @change="handleCustomPageChange"
          />
        </wd-cell>

        <wd-cell title="总页数为1时隐藏" vertical>
          <wd-pagination
            v-model="page3"
            :total="total3"
            :hide-if-one-page="true"
            @change="handleHideOnePageChange"
          />
        </wd-cell>
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基本分页" :code="codes.basic.basicTemplate" />
        <DemoCode title="模板 - 自定义总页数" :code="codes.basic.customPageTemplate" />
        <DemoCode title="模板 - 总页数为1时隐藏" :code="codes.basic.hideOneTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 样式配置示例 -->
    <DemoSection title="样式配置" desc="不同的样式展示模式">
      <wd-cell-group>
        <wd-cell title="显示图标" vertical>
          <wd-pagination v-model="page4" :total="total4" show-icon @change="handleIconChange" />
        </wd-cell>

        <wd-cell title="显示文字提示" vertical>
          <wd-pagination
            v-model="page5"
            :total="total5"
            :page-size="pageSize5"
            show-message
            @change="handleMessageChange"
          />
        </wd-cell>

        <wd-cell title="图标 + 文字提示" vertical>
          <wd-pagination
            v-model="page6"
            :total="total6"
            :page-size="pageSize6"
            show-icon
            show-message
            @change="handleIconMessageChange"
          />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 显示图标" :code="codes.style.iconTemplate" />
        <DemoCode title="模板 - 显示文字提示" :code="codes.style.messageTemplate" />
        <DemoCode title="模板 - 图标+文字提示" :code="codes.style.iconMessageTemplate" />
        <DemoCode title="脚本 - 样式配置" :code="codes.style.script" />
      </template>
    </DemoSection>

    <!-- 自定义文本示例 -->
    <DemoSection title="自定义文本" desc="自定义上一页和下一页的显示文本">
      <wd-cell-group>
        <wd-cell title="中文文本" vertical>
          <wd-pagination
            v-model="page7"
            :total="total7"
            prev-text="上一页"
            next-text="下一页"
            @change="handleChineseChange"
          />
        </wd-cell>

        <wd-cell title="英文文本" vertical>
          <wd-pagination
            v-model="page8"
            :total="total8"
            prev-text="Previous"
            next-text="Next"
            @change="handleEnglishChange"
          />
        </wd-cell>

        <wd-cell title="简短文本" vertical>
          <wd-pagination
            v-model="page9"
            :total="total9"
            prev-text="＜"
            next-text="＞"
            @change="handleShortChange"
          />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 中文文本" :code="codes.customText.chineseTemplate" />
        <DemoCode title="模板 - 英文文本" :code="codes.customText.englishTemplate" />
        <DemoCode title="模板 - 简短文本" :code="codes.customText.shortTemplate" />
        <DemoCode title="脚本 - 自定义文本" :code="codes.customText.script" />
      </template>
    </DemoSection>

    <!-- 不同页面大小示例 -->
    <DemoSection title="不同页面大小" desc="配置不同的每页显示条数">
      <wd-cell-group>
        <wd-cell title="每页10条" vertical>
          <wd-pagination
            v-model="page10"
            :total="total10"
            :page-size="10"
            show-message
            @change="handleSize10Change"
          />
        </wd-cell>

        <wd-cell title="每页20条" vertical>
          <wd-pagination
            v-model="page11"
            :total="total11"
            :page-size="20"
            show-message
            @change="handleSize20Change"
          />
        </wd-cell>

        <wd-cell title="每页50条" vertical>
          <wd-pagination
            v-model="page12"
            :total="total12"
            :page-size="50"
            show-message
            @change="handleSize50Change"
          />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 不同页面大小" :code="codes.pageSize.template" />
        <DemoCode title="脚本 - 不同页面大小" :code="codes.pageSize.script" />
      </template>
    </DemoSection>

    <!-- 实际应用场景 -->
    <DemoSection title="实际应用场景" desc="常见的分页应用场景">
      <!-- 数据列表分页 -->
      <view class="space-y-4">
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">商品列表分页</view>
          <view class="mx-4 rounded-lg bg-gray-50 p-4">
            <!-- 模拟商品列表 -->
            <view class="space-y-3">
              <view
                v-for="item in currentPageData"
                :key="item.id"
                class="flex items-center rounded bg-white p-3"
              >
                <view class="mr-3 h-12 w-12 flex items-center justify-center rounded bg-blue-100">
                  <text class="text-sm text-blue-600 font-medium">{{ item.id }}</text>
                </view>
                <view class="flex-1">
                  <view class="text-sm text-gray-900 font-medium">{{ item.name }}</view>
                  <view class="text-xs text-gray-500">价格：¥{{ item.price }}</view>
                </view>
              </view>
            </view>

            <!-- 分页组件 -->
            <view class="mt-4">
              <wd-pagination
                v-model="currentPage"
                :total="totalItems"
                :page-size="itemsPerPage"
                show-icon
                show-message
                @change="handlePageChange"
              />
            </view>
          </view>
        </view>

        <!-- 文章列表分页 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">文章列表分页</view>
          <view class="mx-4 rounded-lg bg-gray-50 p-4">
            <view class="space-y-3">
              <view
                v-for="article in currentArticles"
                :key="article.id"
                class="rounded bg-white p-3"
              >
                <view class="mb-1 text-sm text-gray-900 font-medium">{{ article.title }}</view>
                <view class="mb-2 text-xs text-gray-500">{{ article.summary }}</view>
                <view class="text-xs text-gray-400">{{ article.date }}</view>
              </view>
            </view>

            <view class="mt-4">
              <wd-pagination
                v-model="articlePage"
                :total="totalArticles"
                :page-size="articlesPerPage"
                show-message
                prev-text="上一页"
                next-text="下一页"
                @change="handleArticlePageChange"
              />
            </view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 商品列表分页" :code="codes.scenarios.productListTemplate" />
        <DemoCode title="脚本 - 商品列表分页" :code="codes.scenarios.productListScript" />
        <DemoCode title="模板 - 文章列表分页" :code="codes.scenarios.articleListTemplate" />
        <DemoCode title="脚本 - 文章列表分页" :code="codes.scenarios.articleListScript" />
      </template>
    </DemoSection>

    <!-- 事件监听示例 -->
    <DemoSection title="事件监听" desc="监听分页组件的页码变化事件">
      <!-- 状态显示区域 -->
      <view class="space-y-4">
        <!-- 控制分页 -->
        <wd-cell-group>
          <wd-cell title="事件监听分页" vertical>
            <wd-pagination
              v-model="eventPage"
              :total="eventTotal"
              :page-size="eventPageSize"
              show-icon
              show-message
              @change="handleEventChange"
            />
          </wd-cell>
        </wd-cell-group>

        <!-- 事件日志显示 -->
        <view class="mx-4 rounded-lg bg-gray-50 p-4">
          <view class="mb-2 text-sm font-medium">事件日志</view>
          <view class="h-32 overflow-y-auto border rounded bg-white p-2">
            <view v-for="(log, index) in eventLogs" :key="index" class="mb-1 text-xs text-gray-600">
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

        <!-- 页面信息显示 -->
        <view class="mx-4 rounded-lg bg-blue-50 p-4">
          <view class="mb-2 text-xs text-blue-600 font-medium">📊 分页信息</view>
          <view class="text-xs text-blue-600 space-y-1">
            <view>当前页码：{{ eventPage }}</view>
            <view>总条数：{{ eventTotal }}</view>
            <view>每页条数：{{ eventPageSize }}</view>
            <view>总页数：{{ Math.ceil(eventTotal / eventPageSize) }}</view>
          </view>
        </view>
      </view>

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
import { ref, computed } from 'vue'

// ===== 组件状态管理 =====

// 基本用法状态
const page1 = ref<number>(1)
const total1 = ref<number>(190)

const page2 = ref<number>(1)
const totalPage2 = ref<number>(8)

const page3 = ref<number>(1)
const total3 = ref<number>(5) // 总条数为5，默认每页10条，只有1页

// 样式配置状态
const page4 = ref<number>(1)
const total4 = ref<number>(86)

const page5 = ref<number>(1)
const total5 = ref<number>(160)
const pageSize5 = ref<number>(20)

const page6 = ref<number>(1)
const total6 = ref<number>(240)
const pageSize6 = ref<number>(15)

// 自定义文本状态
const page7 = ref<number>(1)
const total7 = ref<number>(95)

const page8 = ref<number>(1)
const total8 = ref<number>(128)

const page9 = ref<number>(1)
const total9 = ref<number>(67)

// 不同页面大小状态
const page10 = ref<number>(1)
const total10 = ref<number>(156)

const page11 = ref<number>(1)
const total11 = ref<number>(340)

const page12 = ref<number>(1)
const total12 = ref<number>(1250)

// 实际应用场景状态
const currentPage = ref<number>(1)
const totalItems = ref<number>(150)
const itemsPerPage = ref<number>(5)

const articlePage = ref<number>(1)
const totalArticles = ref<number>(89)
const articlesPerPage = ref<number>(3)

// 事件监听状态
const eventPage = ref<number>(1)
const eventTotal = ref<number>(200)
const eventPageSize = ref<number>(15)

// 事件日志状态
interface EventLog {
  time: string
  message: string
}

const eventLogs = ref<EventLog[]>([])

// 模拟数据
const mockProducts = Array.from({ length: 150 }, (_, index) => ({
  id: index + 1,
  name: `商品 ${index + 1}`,
  price: (Math.random() * 1000 + 50).toFixed(2),
}))

const mockArticles = Array.from({ length: 89 }, (_, index) => ({
  id: index + 1,
  title: `文章标题 ${index + 1}`,
  summary: `这是第 ${index + 1} 篇文章的摘要内容，介绍了相关的主题和要点...`,
  date: `2024-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
}))

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    basicTemplate: `<wd-pagination
  v-model="page1"
  :total="total1"
  @change="handleBasicChange"
/>`,

    customPageTemplate: `<wd-pagination
  v-model="page2"
  :total-page="totalPage2"
  @change="handleCustomPageChange"
/>`,

    hideOneTemplate: `<wd-pagination
  v-model="page3"
  :total="total3"
  :hide-if-one-page="true"
  @change="handleHideOnePageChange"
/>`,

    script: `import { ref } from 'vue'

// 基本用法状态
const page1 = ref(1)
const total1 = ref(190)

const page2 = ref(1)
const totalPage2 = ref(8)

const page3 = ref(1)
const total3 = ref(5) // 只有1页，会被隐藏

const handleBasicChange = ({ value }) => {
  console.log('基本分页页码变化:', value)
}

const handleCustomPageChange = ({ value }) => {
  console.log('自定义总页数页码变化:', value)
}

const handleHideOnePageChange = ({ value }) => {
  console.log('隐藏单页分页页码变化:', value)
}`,
  },

  // 样式配置代码
  style: {
    iconTemplate: `<wd-pagination
  v-model="page4"
  :total="total4"
  show-icon
  @change="handleIconChange"
/>`,

    messageTemplate: `<wd-pagination
  v-model="page5"
  :total="total5"
  :page-size="pageSize5"
  show-message
  @change="handleMessageChange"
/>`,

    iconMessageTemplate: `<wd-pagination
  v-model="page6"
  :total="total6"
  :page-size="pageSize6"
  show-icon
  show-message
  @change="handleIconMessageChange"
/>`,

    script: `// 样式配置状态
const page4 = ref(1)
const total4 = ref(86)

const page5 = ref(1)
const total5 = ref(160)
const pageSize5 = ref(20)

const page6 = ref(1)
const total6 = ref(240)
const pageSize6 = ref(15)

const handleIconChange = ({ value }) => {
  console.log('图标模式页码变化:', value)
}

const handleMessageChange = ({ value }) => {
  console.log('文字提示页码变化:', value)
}

const handleIconMessageChange = ({ value }) => {
  console.log('图标+文字提示页码变化:', value)
}`,
  },

  // 自定义文本代码
  customText: {
    chineseTemplate: `<wd-pagination
  v-model="page7"
  :total="total7"
  prev-text="上一页"
  next-text="下一页"
  @change="handleChineseChange"
/>`,

    englishTemplate: `<wd-pagination
  v-model="page8"
  :total="total8"
  prev-text="Previous"
  next-text="Next"
  @change="handleEnglishChange"
/>`,

    shortTemplate: `<wd-pagination
  v-model="page9"
  :total="total9"
  prev-text="＜"
  next-text="＞"
  @change="handleShortChange"
/>`,

    script: `// 自定义文本状态
const page7 = ref(1)
const total7 = ref(95)

const page8 = ref(1)
const total8 = ref(128)

const page9 = ref(1)
const total9 = ref(67)

const handleChineseChange = ({ value }) => {
  console.log('中文文本页码变化:', value)
}

const handleEnglishChange = ({ value }) => {
  console.log('英文文本页码变化:', value)
}

const handleShortChange = ({ value }) => {
  console.log('简短文本页码变化:', value)
}`,
  },

  // 页面大小代码
  pageSize: {
    template: `<!-- 每页10条 -->
<wd-pagination
  v-model="page10"
  :total="total10"
  :page-size="10"
  show-message
  @change="handleSize10Change"
/>

<!-- 每页20条 -->
<wd-pagination
  v-model="page11"
  :total="total11"
  :page-size="20"
  show-message
  @change="handleSize20Change"
/>

<!-- 每页50条 -->
<wd-pagination
  v-model="page12"
  :total="total12"
  :page-size="50"
  show-message
  @change="handleSize50Change"
/>`,

    script: `// 不同页面大小状态
const page10 = ref(1)
const total10 = ref(156)

const page11 = ref(1)
const total11 = ref(340)

const page12 = ref(1)
const total12 = ref(1250)

const handleSize10Change = ({ value }) => {
  console.log('每页10条页码变化:', value)
}

const handleSize20Change = ({ value }) => {
  console.log('每页20条页码变化:', value)
}

const handleSize50Change = ({ value }) => {
  console.log('每页50条页码变化:', value)
}`,
  },

  // 应用场景代码
  scenarios: {
    productListTemplate: `<!-- 商品列表 -->
<view class="space-y-3">
  <view
    v-for="item in currentPageData"
    :key="item.id"
    class="flex items-center rounded bg-white p-3"
  >
    <view class="mr-3 h-12 w-12 rounded bg-blue-100 flex items-center justify-center">
      <text class="text-blue-600 text-sm font-medium">{{ item.id }}</text>
    </view>
    <view class="flex-1">
      <view class="text-sm font-medium text-gray-900">{{ item.name }}</view>
      <view class="text-xs text-gray-500">价格：¥{{ item.price }}</view>
    </view>
  </view>
</view>

<!-- 分页组件 -->
<wd-pagination
  v-model="currentPage"
  :total="totalItems"
  :page-size="itemsPerPage"
  show-icon
  show-message
  @change="handlePageChange"
/>`,

    productListScript: `import { ref, computed } from 'vue'

// 商品列表分页状态
const currentPage = ref(1)
const totalItems = ref(150)
const itemsPerPage = ref(5)

// 模拟商品数据
const mockProducts = Array.from({ length: 150 }, (_, index) => ({
  id: index + 1,
  name: \`商品 \${index + 1}\`,
  price: (Math.random() * 1000 + 50).toFixed(2),
}))

// 计算当前页数据
const currentPageData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return mockProducts.slice(start, end)
})

const handlePageChange = ({ value }) => {
  currentPage.value = value
  console.log('商品列表页码变化:', value)
}`,

    articleListTemplate: `<!-- 文章列表 -->
<view class="space-y-3">
  <view
    v-for="article in currentArticles"
    :key="article.id"
    class="rounded bg-white p-3"
  >
    <view class="text-sm font-medium text-gray-900 mb-1">{{ article.title }}</view>
    <view class="text-xs text-gray-500 mb-2">{{ article.summary }}</view>
    <view class="text-xs text-gray-400">{{ article.date }}</view>
  </view>
</view>

<wd-pagination
  v-model="articlePage"
  :total="totalArticles"
  :page-size="articlesPerPage"
  show-message
  prev-text="上一页"
  next-text="下一页"
  @change="handleArticlePageChange"
/>`,

    articleListScript: `// 文章列表分页状态
const articlePage = ref(1)
const totalArticles = ref(89)
const articlesPerPage = ref(3)

// 模拟文章数据
const mockArticles = Array.from({ length: 89 }, (_, index) => ({
  id: index + 1,
  title: \`文章标题 \${index + 1}\`,
  summary: \`这是第 \${index + 1} 篇文章的摘要内容，介绍了相关的主题和要点...\`,
  date: \`2024-\${Math.floor(Math.random() * 12) + 1}-\${Math.floor(Math.random() * 28) + 1}\`,
}))

// 计算当前页文章
const currentArticles = computed(() => {
  const start = (articlePage.value - 1) * articlesPerPage.value
  const end = start + articlesPerPage.value
  return mockArticles.slice(start, end)
})

const handleArticlePageChange = ({ value }) => {
  articlePage.value = value
  console.log('文章列表页码变化:', value)
}`,
  },

  // 事件监听代码
  events: {
    template: `
      <wd-pagination
        v-model="eventPage"
        :total="eventTotal"
        :page-size="eventPageSize"
        show-icon
        show-message
        @change="handleEventChange"
      />`,

    methods: `// 事件监听状态
const eventPage = ref(1)
const eventTotal = ref(200)
const eventPageSize = ref(15)
const eventLogs = ref([])

const handleEventChange = ({ value }) => {
  addEventLog(\`页码变化：从第 \${eventPage.value} 页切换到第 \${value} 页\`)
}

const addEventLog = (message) => {
  eventLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
  })
  // 限制日志数量
  if (eventLogs.value.length > 20) {
    eventLogs.value = eventLogs.value.slice(0, 20)
  }
}

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
    name: 'model-value',
    type: 'Number',
    default: '1',
    desc: '当前页码',
  },
  {
    name: 'total-page',
    type: 'Number',
    default: '1',
    desc: '总页数，如果有total，则优先使用total计算页数',
  },
  {
    name: 'show-icon',
    type: 'Boolean',
    default: 'false',
    desc: '是否展示分页为Icon图标',
  },
  {
    name: 'show-message',
    type: 'Boolean',
    default: 'false',
    desc: '是否展示总条数信息',
  },
  {
    name: 'total',
    type: 'Number',
    default: '0',
    desc: '总条数',
  },
  {
    name: 'page-size',
    type: 'Number',
    default: '10',
    desc: '每页条数',
  },
  {
    name: 'prev-text',
    type: 'String',
    default: '""',
    desc: '上一页文本',
  },
  {
    name: 'next-text',
    type: 'String',
    default: '""',
    desc: '下一页文本',
  },
  {
    name: 'hide-if-one-page',
    type: 'Boolean',
    default: 'true',
    desc: '总页数只有一页时是否隐藏',
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
    name: 'change',
    desc: '页码变化时触发，参数为 { value: number }',
  },
  {
    name: 'update:modelValue',
    desc: '更新当前页码时触发，参数为 number',
  },
]

// ===== 计算属性 =====

/**
 * 计算当前页商品数据
 */
const currentPageData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return mockProducts.slice(start, end)
})

/**
 * 计算当前页文章数据
 */
const currentArticles = computed(() => {
  const start = (articlePage.value - 1) * articlesPerPage.value
  const end = start + articlesPerPage.value
  return mockArticles.slice(start, end)
})

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

// ===== 事件处理方法 =====

/**
 * 基本用法 - 基本分页变化事件
 */
const handleBasicChange = ({ value }: { value: number }) => {
  console.log('基本分页页码变化:', value)
}

/**
 * 基本用法 - 自定义总页数变化事件
 */
const handleCustomPageChange = ({ value }: { value: number }) => {
  console.log('自定义总页数页码变化:', value)
}

/**
 * 基本用法 - 隐藏单页分页变化事件
 */
const handleHideOnePageChange = ({ value }: { value: number }) => {
  console.log('隐藏单页分页页码变化:', value)
}

/**
 * 样式配置 - 图标模式变化事件
 */
const handleIconChange = ({ value }: { value: number }) => {
  console.log('图标模式页码变化:', value)
}

/**
 * 样式配置 - 文字提示变化事件
 */
const handleMessageChange = ({ value }: { value: number }) => {
  console.log('文字提示页码变化:', value)
}

/**
 * 样式配置 - 图标+文字提示变化事件
 */
const handleIconMessageChange = ({ value }: { value: number }) => {
  console.log('图标+文字提示页码变化:', value)
}

/**
 * 自定义文本 - 中文文本变化事件
 */
const handleChineseChange = ({ value }: { value: number }) => {
  console.log('中文文本页码变化:', value)
}

/**
 * 自定义文本 - 英文文本变化事件
 */
const handleEnglishChange = ({ value }: { value: number }) => {
  console.log('英文文本页码变化:', value)
}

/**
 * 自定义文本 - 简短文本变化事件
 */
const handleShortChange = ({ value }: { value: number }) => {
  console.log('简短文本页码变化:', value)
}

/**
 * 页面大小 - 每页10条变化事件
 */
const handleSize10Change = ({ value }: { value: number }) => {
  console.log('每页10条页码变化:', value)
}

/**
 * 页面大小 - 每页20条变化事件
 */
const handleSize20Change = ({ value }: { value: number }) => {
  console.log('每页20条页码变化:', value)
}

/**
 * 页面大小 - 每页50条变化事件
 */
const handleSize50Change = ({ value }: { value: number }) => {
  console.log('每页50条页码变化:', value)
}

/**
 * 应用场景 - 商品列表页码变化事件
 */
const handlePageChange = ({ value }: { value: number }) => {
  console.log('商品列表页码变化:', value)
}

/**
 * 应用场景 - 文章列表页码变化事件
 */
const handleArticlePageChange = ({ value }: { value: number }) => {
  console.log('文章列表页码变化:', value)
}

/**
 * 事件监听 - 页码变化事件
 */
const handleEventChange = ({ value }: { value: number }) => {
  addEventLog(`页码变化：从第 ${eventPage.value} 页切换到第 ${value} 页`)
}

const { resetScrollTop, updateScrollTop } = useScroll()
onShow(() => {
  resetScrollTop()
})
onPageScroll((e) => {
  updateScrollTop(e.scrollTop)
})
</script>
