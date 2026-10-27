<!-- SortButton 排序按钮 http://127.0.0.1:100/#/pages-sub/demo/wd/sortButton -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="SortButton 排序按钮" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的排序按钮形式，支持升序和降序两种状态">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="默认排序" vertical>
          <view class="space-y-2">
            <view class="text-sm text-gray-600">当前状态: {{ getSortStatusText(basicValue) }}</view>
            <wd-sort-button v-model="basicValue" title="价格" @change="handleBasicChange" />
          </view>
        </wd-cell>

        <wd-cell title="优先降序" vertical>
          <view class="space-y-2">
            <view class="text-sm text-gray-600">
              当前状态: {{ getSortStatusText(descFirstValue) }}
            </view>
            <wd-sort-button
              v-model="descFirstValue"
              title="价格"
              desc-first
              @change="handleDescFirstChange"
            />
          </view>
        </wd-cell>

        <wd-cell title="允许重置" vertical>
          <view class="space-y-2">
            <view class="text-sm text-gray-600">当前状态: {{ getSortStatusText(resetValue) }}</view>
            <view class="text-xs text-gray-500">连续点击可重置为默认状态</view>
            <wd-sort-button
              v-model="resetValue"
              title="价格"
              allow-reset
              @change="handleResetChange"
            />
          </view>
        </wd-cell>
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 默认排序" :code="codes.basic.defaultTemplate" />
        <DemoCode title="模板 - 优先降序" :code="codes.basic.descFirstTemplate" />
        <DemoCode title="模板 - 允许重置" :code="codes.basic.resetTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 样式配置示例 -->
    <DemoSection title="样式配置" desc="自定义下划线显示和按钮样式">
      <wd-cell-group>
        <wd-cell title="隐藏下划线" vertical>
          <view class="space-y-2">
            <view class="text-sm text-gray-600">
              当前状态: {{ getSortStatusText(noLineValue) }}
            </view>
            <view class="text-xs text-gray-500">当只有一个排序按钮时，可隐藏下划线</view>
            <wd-sort-button
              v-model="noLineValue"
              title="价格"
              :line="false"
              @change="handleNoLineChange"
            />
          </view>
        </wd-cell>

        <wd-cell title="自定义样式" vertical>
          <view class="space-y-4">
            <!-- 大号样式 -->
            <view>
              <view class="mb-2 text-sm text-gray-600">
                大号样式 - {{ getSortStatusText(customSort.large) }}
              </view>
              <wd-sort-button
                v-model="customSort.large"
                title="价格排序"
                allow-reset
                custom-style="font-size: 16px; color: #1890ff;"
                @change="handleCustomChange('large', $event)"
              />
            </view>

            <!-- 紧凑样式 -->
            <view>
              <view class="mb-2 text-sm text-gray-600">
                紧凑样式 - {{ getSortStatusText(customSort.compact) }}
              </view>
              <wd-sort-button
                v-model="customSort.compact"
                title="评分"
                desc-first
                custom-style="font-size: 12px; color: #52c41a;"
                @change="handleCustomChange('compact', $event)"
              />
            </view>
          </view>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 隐藏下划线" :code="codes.style.noLineTemplate" />
        <DemoCode title="模板 - 自定义样式" :code="codes.style.customTemplate" />
        <DemoCode title="脚本 - 样式配置" :code="codes.style.script" />
      </template>
    </DemoSection>

    <!-- 多按钮组合示例 -->
    <DemoSection title="多按钮组合" desc="模拟商品列表等场景的多种排序方式">
      <!-- 排序按钮组合示例 -->
      <view class="space-y-4">
        <!-- 排序状态显示 -->
        <view class="mx-4 rounded-lg bg-gray-50 p-4">
          <view class="mb-2 text-sm font-medium">当前排序状态</view>
          <view class="text-xs text-gray-600 space-y-1">
            <view>价格: {{ getSortStatusText(multiSort.price) }}</view>
            <view>销量: {{ getSortStatusText(multiSort.sales) }}</view>
            <view>评分: {{ getSortStatusText(multiSort.rating) }}</view>
            <view>时间: {{ getSortStatusText(multiSort.time) }}</view>
          </view>
        </view>

        <!-- 排序按钮组 -->
        <view class="mx-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">选择排序方式</view>
          <view class="flex flex-wrap gap-4">
            <wd-sort-button
              v-model="multiSort.price"
              title="价格"
              allow-reset
              @change="handleMultiSortChange('price', $event)"
            />
            <wd-sort-button
              v-model="multiSort.sales"
              title="销量"
              desc-first
              allow-reset
              @change="handleMultiSortChange('sales', $event)"
            />
            <wd-sort-button
              v-model="multiSort.rating"
              title="评分"
              desc-first
              allow-reset
              @change="handleMultiSortChange('rating', $event)"
            />
            <wd-sort-button
              v-model="multiSort.time"
              title="时间"
              desc-first
              allow-reset
              @change="handleMultiSortChange('time', $event)"
            />
          </view>
        </view>

        <!-- 操作按钮 -->
        <view class="mx-4">
          <wd-button size="small" plain @click="handleResetAll">重置所有排序</wd-button>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 多按钮组合" :code="codes.multi.template" />
        <DemoCode title="脚本 - 多按钮组合" :code="codes.multi.script" />
      </template>
    </DemoSection>

    <!-- 事件监听示例 -->
    <DemoSection title="事件监听" desc="监听排序状态变化和用户操作">
      <!-- 事件监听示例 -->
      <view class="space-y-4">
        <!-- 控制区域 -->
        <wd-cell-group>
          <wd-cell title="事件监听示例" vertical>
            <view class="space-y-2">
              <view class="text-sm text-gray-600">
                当前状态: {{ getSortStatusText(eventValue) }}
              </view>
              <wd-sort-button
                v-model="eventValue"
                title="价格排序"
                allow-reset
                desc-first
                @change="handleEventChange"
              />
            </view>
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
        <DemoCode title="模板 - 事件监听" :code="codes.events.template" />
        <DemoCode title="脚本 - 事件处理" :code="codes.events.script" />
      </template>
    </DemoSection>

    <!-- 实际应用场景 -->
    <DemoSection title="实际应用场景" desc="常见的业务场景示例">
      <!-- 商品列表排序 -->
      <view class="space-y-4">
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">商品列表排序</view>
          <view class="mx-4 rounded-lg bg-gray-50 p-4">
            <!-- 排序控制栏 -->
            <view class="mb-4 flex items-center justify-between">
              <view class="text-sm text-gray-600">共找到 {{ productList.length }} 件商品</view>
              <view class="text-xs text-gray-500">排序: {{ getCurrentSortText() }}</view>
            </view>

            <!-- 排序按钮组 -->
            <view class="mb-4 flex gap-4">
              <wd-sort-button
                v-model="productSort.price"
                title="价格"
                allow-reset
                :line="false"
                @change="handleProductSort('price', $event)"
              />
              <wd-sort-button
                v-model="productSort.sales"
                title="销量"
                desc-first
                allow-reset
                :line="false"
                @change="handleProductSort('sales', $event)"
              />
            </view>

            <!-- 模拟商品列表 -->
            <view class="space-y-2">
              <view
                v-for="(product) in sortedProducts"
                :key="product.id"
                class="flex items-center justify-between rounded bg-white p-3"
              >
                <view>
                  <view class="text-sm font-medium">{{ product.name }}</view>
                  <view class="text-xs text-gray-500">销量: {{ product.sales }}</view>
                </view>
                <view class="text-right">
                  <view class="text-sm text-red-500 font-medium">¥{{ product.price }}</view>
                  <view class="text-xs text-gray-400">#{index + 1}</view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 商品列表排序" :code="codes.scenarios.productTemplate" />
        <DemoCode title="脚本 - 商品列表排序" :code="codes.scenarios.productScript" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

// ===== 组件状态管理 =====

// 基础用法状态
const basicValue = ref<number>(0)
const descFirstValue = ref<number>(0)
const resetValue = ref<number>(0)

// 样式配置状态
const noLineValue = ref<number>(0)
const customSort = reactive({
  large: 0,
  compact: 0,
})

// 多按钮组合状态
const multiSort = reactive({
  price: 0,
  sales: 0,
  rating: 0,
  time: 0,
})

// 事件监听状态
const eventValue = ref<number>(0)

interface EventLog {
  time: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

const eventLogs = ref<EventLog[]>([])

// 商品列表应用场景状态
const productSort = reactive({
  price: 0,
  sales: 0,
})

const productList = ref([
  { id: 1, name: 'iPhone 15 Pro', price: 7999, sales: 1520 },
  { id: 2, name: 'MacBook Air', price: 8999, sales: 890 },
  { id: 3, name: 'iPad Pro', price: 6199, sales: 2100 },
  { id: 4, name: 'Apple Watch', price: 2999, sales: 3200 },
  { id: 5, name: 'AirPods Pro', price: 1899, sales: 5680 },
])

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    defaultTemplate: `<wd-sort-button v-model="basicValue" title="价格" @change="handleBasicChange" />`,

    descFirstTemplate: `<wd-sort-button
  v-model="descFirstValue"
  title="价格"
  desc-first
  @change="handleDescFirstChange"
/>`,

    resetTemplate: `<wd-sort-button
  v-model="resetValue"
  title="价格"
  allow-reset
  @change="handleResetChange"
/>`,

    script: `import { ref } from 'vue'

// 基础用法状态
const basicValue = ref(0)
const descFirstValue = ref(0)
const resetValue = ref(0)

// 获取排序状态文本
const getSortStatusText = (value: number): string => {
  switch (value) {
    case 0: return '默认'
    case 1: return '升序'
    case -1: return '降序'
    default: return '未知'
  }
}

// 事件处理方法
const handleBasicChange = ({ value }) => {
  console.log('基础排序变化:', getSortStatusText(value))
}`,
  },

  // 样式配置代码
  style: {
    noLineTemplate: `<wd-sort-button
  v-model="noLineValue"
  title="价格"
  :line="false"
  @change="handleNoLineChange"
/>`,

    customTemplate: `<!-- 大号样式 -->
<wd-sort-button
  v-model="customSort.large"
  title="价格排序"
  allow-reset
  custom-style="font-size: 16px; color: #1890ff;"
  @change="handleCustomChange('large', $event)"
/>

<!-- 紧凑样式 -->
<wd-sort-button
  v-model="customSort.compact"
  title="评分"
  desc-first
  custom-style="font-size: 12px; color: #52c41a;"
  @change="handleCustomChange('compact', $event)"
/>`,

    script: `import { ref, reactive } from 'vue'

// 样式配置状态
const noLineValue = ref(0)
const customSort = reactive({
  large: 0,
  compact: 0,
})

const handleNoLineChange = ({ value }) => {
  console.log('无下划线排序:', getSortStatusText(value))
}

const handleCustomChange = (styleType: string, { value }) => {
  const styleNames = {
    large: '大号样式',
    compact: '紧凑样式'
  }
  console.log(\`\${styleNames[styleType]}: \${getSortStatusText(value)}\`)
}`,
  },

  // 多按钮组合代码
  multi: {
    template: `<!-- 排序按钮组 -->
<view class="flex flex-wrap gap-4">
  <wd-sort-button
    v-model="multiSort.price"
    title="价格"
    allow-reset
    @change="handleMultiSortChange('price', $event)"
  />
  <wd-sort-button
    v-model="multiSort.sales"
    title="销量"
    desc-first
    allow-reset
    @change="handleMultiSortChange('sales', $event)"
  />
  <wd-sort-button
    v-model="multiSort.rating"
    title="评分"
    desc-first
    allow-reset
    @change="handleMultiSortChange('rating', $event)"
  />
  <wd-sort-button
    v-model="multiSort.time"
    title="时间"
    desc-first
    allow-reset
    @change="handleMultiSortChange('time', $event)"
  />
</view>

<!-- 重置按钮 -->
<wd-button size="small" plain @click="handleResetAll">
  重置所有排序
</wd-button>`,

    script: `import { reactive } from 'vue'

// 多按钮组合状态
const multiSort = reactive({
  price: 0,
  sales: 0,
  rating: 0,
  time: 0,
})

// 多排序变化处理（互斥逻辑）
const handleMultiSortChange = (sortType: string, { value }) => {
  // 当选择新的排序时，重置其他排序
  if (value !== 0) {
    Object.keys(multiSort).forEach(key => {
      if (key !== sortType) {
        multiSort[key] = 0
      }
    })
  }

  const sortNames = {
    price: '价格',
    sales: '销量',
    rating: '评分',
    time: '时间'
  }
  console.log(\`\${sortNames[sortType]}排序: \${getSortStatusText(value)}\`)
}

// 重置所有排序
const handleResetAll = () => {
  Object.keys(multiSort).forEach(key => {
    multiSort[key] = 0
  })
  console.log('重置了所有排序状态')
}`,
  },

  // 事件监听代码
  events: {
    template: `<wd-sort-button
  v-model="eventValue"
  title="价格排序"
  allow-reset
  desc-first
  @change="handleEventChange"
/>`,

    script: `import { ref } from 'vue'

interface EventLog {
  time: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

const eventValue = ref(0)
const eventLogs = ref<EventLog[]>([])

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
}

// 事件变化处理
const handleEventChange = ({ value }) => {
  addEventLog(\`排序状态变化: \${getSortStatusText(value)}\`, 'success')
}

// 清空事件日志
const clearEventLogs = () => {
  eventLogs.value = []
  addEventLog('事件日志已清空', 'info')
}`,
  },

  // 应用场景代码
  scenarios: {
    productTemplate: `<!-- 排序控制栏 -->
<view class="mb-4 flex gap-4">
  <wd-sort-button
    v-model="productSort.price"
    title="价格"
    allow-reset
    :line="false"
    @change="handleProductSort('price', $event)"
  />
  <wd-sort-button
    v-model="productSort.sales"
    title="销量"
    desc-first
    allow-reset
    :line="false"
    @change="handleProductSort('sales', $event)"
  />
</view>

<!-- 商品列表 -->
<view class="space-y-2">
  <view
    v-for="(product, index) in sortedProducts"
    :key="product.id"
    class="flex items-center justify-between rounded bg-white p-3"
  >
    <view>
      <view class="text-sm font-medium">{{ product.name }}</view>
      <view class="text-xs text-gray-500">销量: {{ product.sales }}</view>
    </view>
    <view class="text-right">
      <view class="text-sm font-medium text-red-500">¥{{ product.price }}</view>
      <view class="text-xs text-gray-400">#{{ index + 1 }}</view>
    </view>
  </view>
</view>`,

    productScript: `import { ref, reactive, computed } from 'vue'

// 商品数据和排序状态
const productSort = reactive({
  price: 0,
  sales: 0,
})

const productList = ref([
  { id: 1, name: 'iPhone 15 Pro', price: 7999, sales: 1520 },
  { id: 2, name: 'MacBook Air', price: 8999, sales: 890 },
  { id: 3, name: 'iPad Pro', price: 6199, sales: 2100 },
  { id: 4, name: 'Apple Watch', price: 2999, sales: 3200 },
  { id: 5, name: 'AirPods Pro', price: 1899, sales: 5680 },
])

// 排序后的商品列表
const sortedProducts = computed(() => {
  let products = [...productList.value]

  if (productSort.price !== 0) {
    products.sort((a, b) =>
      productSort.price === 1 ? a.price - b.price : b.price - a.price
    )
  } else if (productSort.sales !== 0) {
    products.sort((a, b) =>
      productSort.sales === 1 ? a.sales - b.sales : b.sales - a.sales
    )
  }

  return products
})

// 商品排序处理
const handleProductSort = (sortType: string, { value }) => {
  // 互斥排序逻辑
  if (value !== 0) {
    Object.keys(productSort).forEach(key => {
      if (key !== sortType) {
        productSort[key] = 0
      }
    })
  }
  console.log(\`商品\${sortType === 'price' ? '价格' : '销量'}排序: \${getSortStatusText(value)}\`)
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'model-value',
    type: 'Number',
    default: '0',
    desc: '选中的箭头方向，1表示升序，0表示重置状态，-1表示降序',
  },
  {
    name: 'title',
    type: 'String',
    default: '""',
    desc: '排序按钮展示的文案',
  },
  {
    name: 'allow-reset',
    type: 'Boolean',
    default: 'false',
    desc: '当展示双箭头时，是否允许手动重置按钮',
  },
  {
    name: 'desc-first',
    type: 'Boolean',
    default: 'false',
    desc: '是否优先切换为降序，如果不开启则默认优先切换为升序',
  },
  {
    name: 'line',
    type: 'Boolean',
    default: 'true',
    desc: '是否展示下划线，当只有一个排序按钮时，通常不展示下划线',
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
    desc: '排序状态改变时触发，参数为 { value: number }',
  },
  {
    name: 'update:model-value',
    desc: '更新排序值时触发，用于v-model绑定',
  },
]

// ===== 计算属性 =====

/**
 * 排序后的商品列表
 */
const sortedProducts = computed(() => {
  const products = [...productList.value]

  if (productSort.price !== 0) {
    products.sort((a, b) => (productSort.price === 1 ? a.price - b.price : b.price - a.price))
  } else if (productSort.sales !== 0) {
    products.sort((a, b) => (productSort.sales === 1 ? a.sales - b.sales : b.sales - a.sales))
  }

  return products
})

// ===== 工具方法 =====

/**
 * 获取排序状态文本
 */
const getSortStatusText = (value: number): string => {
  switch (value) {
    case 0:
      return '默认'
    case 1:
      return '升序'
    case -1:
      return '降序'
    default:
      return '未知'
  }
}

/**
 * 获取当前排序文本
 */
const getCurrentSortText = (): string => {
  if (productSort.price !== 0) {
    return `价格${getSortStatusText(productSort.price)}`
  }
  if (productSort.sales !== 0) {
    return `销量${getSortStatusText(productSort.sales)}`
  }
  return '默认排序'
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
 * 基础排序变化处理
 */
const handleBasicChange = ({ value }: { value: number }) => {
  console.log(`基础排序变化: ${getSortStatusText(value)}`)
}

/**
 * 优先降序变化处理
 */
const handleDescFirstChange = ({ value }: { value: number }) => {
  console.log(`降序优先排序: ${getSortStatusText(value)}`)
}

/**
 * 重置排序变化处理
 */
const handleResetChange = ({ value }: { value: number }) => {
  console.log(`重置排序变化: ${getSortStatusText(value)}`)
}

/**
 * 无下划线排序变化处理
 */
const handleNoLineChange = ({ value }: { value: number }) => {
  console.log(`无下划线排序: ${getSortStatusText(value)}`)
}

/**
 * 自定义样式变化处理
 */
const handleCustomChange = (styleType: string, { value }: { value: number }) => {
  const styleNames: { [key: string]: string } = {
    large: '大号样式',
    compact: '紧凑样式',
  }
  console.log(`${styleNames[styleType]}: ${getSortStatusText(value)}`)
}

/**
 * 多排序变化处理
 */
const handleMultiSortChange = (sortType: string, { value }: { value: number }) => {
  // 当选择新的排序时，重置其他排序
  if (value !== 0) {
    Object.keys(multiSort).forEach((key) => {
      if (key !== sortType) {
        multiSort[key as keyof typeof multiSort] = 0
      }
    })
  }

  const sortNames: { [key: string]: string } = {
    price: '价格',
    sales: '销量',
    rating: '评分',
    time: '时间',
  }

  console.log(`${sortNames[sortType]}排序: ${getSortStatusText(value)}`)
}

/**
 * 重置所有排序
 */
const handleResetAll = () => {
  Object.keys(multiSort).forEach((key) => {
    multiSort[key as keyof typeof multiSort] = 0
  })
  console.log('重置了所有排序状态')
}

/**
 * 事件监听变化处理
 */
const handleEventChange = ({ value }: { value: number }) => {
  addEventLog(`排序状态变化: ${getSortStatusText(value)}`, 'success')
}

/**
 * 商品排序处理
 */
const handleProductSort = (sortType: string, { value }: { value: number }) => {
  // 当选择新的排序时，重置其他排序（互斥逻辑）
  if (value !== 0) {
    Object.keys(productSort).forEach((key) => {
      if (key !== sortType) {
        productSort[key as keyof typeof productSort] = 0
      }
    })
  }

  const sortNames: { [key: string]: string } = {
    price: '价格',
    sales: '销量',
  }

  console.log(`商品${sortNames[sortType]}排序: ${getSortStatusText(value)}`)
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
