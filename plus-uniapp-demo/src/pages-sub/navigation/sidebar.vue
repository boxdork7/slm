<!-- Sidebar 侧边栏 http://127.0.0.1:100/#/pages-sub/demo/wd/sidebar -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Sidebar 侧边栏" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的侧边栏导航，支持徽标显示">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <!-- 基本侧边栏 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">基本侧边栏</view>
          <view class="h-48 flex overflow-hidden rounded-lg bg-white">
            <wd-sidebar v-model="basicActive1" class="w-24">
              <wd-sidebar-item :value="0" label="标签名称" />
              <wd-sidebar-item :value="1" label="标签名称" />
              <wd-sidebar-item :value="2" label="标签名称" />
            </wd-sidebar>
            <view class="flex flex-1 items-center justify-center bg-gray-50">
              <wd-text :text="`当前选中: ${basicActive1}`" />
            </view>
          </view>
        </view>

        <!-- 徽标侧边栏 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">徽标侧边栏</view>
          <view class="h-48 flex overflow-hidden rounded-lg bg-white">
            <wd-sidebar v-model="basicActive2" class="w-24">
              <wd-sidebar-item :value="0" label="标签名称" is-dot />
              <wd-sidebar-item :value="1" label="标签名称" badge="5" />
              <wd-sidebar-item
                :value="2"
                label="标签名称"
                badge="99"
                :badge-props="{ type: 'warning', max: 99 }"
              />
            </wd-sidebar>
            <view class="flex flex-1 items-center justify-center bg-gray-50">
              <wd-text :text="`当前选中: ${basicActive2}`" />
            </view>
          </view>
        </view>

        <!-- 禁用和拦截 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">禁用和切换拦截</view>
          <view class="h-48 flex overflow-hidden rounded-lg bg-white">
            <wd-sidebar v-model="basicActive3" :before-change="beforeChange" class="w-24">
              <wd-sidebar-item :value="0" label="标签名称" />
              <wd-sidebar-item :value="1" label="标签名称" disabled />
              <wd-sidebar-item :value="2" label="标签名称" />
            </wd-sidebar>
            <view class="flex flex-1 items-center justify-center bg-gray-50">
              <wd-text :text="`当前选中: ${basicActive3}`" />
            </view>
          </view>
        </view>

        <!-- 状态显示 -->
        <view class="mx-4 rounded-lg bg-blue-50 px-4 py-2">
          <view class="text-xs text-blue-600 font-medium">💡 当前状态：{{ switchStatus }}</view>
        </view>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基本侧边栏" :code="codes.basic.basicTemplate" />
        <DemoCode title="模板 - 徽标侧边栏" :code="codes.basic.badgeTemplate" />
        <DemoCode title="模板 - 禁用和拦截" :code="codes.basic.disabledTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- Items 数组模式示例 -->
    <DemoSection title="Items 数组模式" desc="通过 items 数组快速构建侧边栏">
      <view class="space-y-4">
        <!-- Items 模式侧边栏 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">Items 数组模式</view>
          <view class="h-48 flex overflow-hidden rounded-lg bg-white">
            <wd-sidebar
              v-model="itemsActive"
              :items="sidebarItems"
              class="w-24"
              @change="handleItemsChange"
            />
            <view class="flex flex-1 items-center justify-center bg-gray-50">
              <view class="text-center">
                <view class="text-sm font-medium">当前选中: {{ currentItemLabel }}</view>
                <view class="mt-1 text-xs text-gray-500">值: {{ itemsActive }}</view>
              </view>
            </view>
          </view>
        </view>

        <!-- 带图标的 Items 模式 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">带图标的 Items 模式</view>
          <view class="h-48 flex overflow-hidden rounded-lg bg-white">
            <wd-sidebar
              v-model="iconItemsActive"
              :items="iconSidebarItems"
              class="w-24"
              @change="handleIconItemsChange"
            />
            <view class="flex flex-1 items-center justify-center bg-gray-50">
              <view class="text-center">
                <view class="text-sm font-medium">当前选中: {{ currentIconItemLabel }}</view>
                <view class="mt-1 text-xs text-gray-500">值: {{ iconItemsActive }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - Items 数组模式" :code="codes.items.itemsTemplate" />
        <DemoCode title="模板 - 带图标的 Items 模式" :code="codes.items.iconItemsTemplate" />
        <DemoCode title="脚本 - Items 数组模式" :code="codes.items.script" />
      </template>
    </DemoSection>

    <!-- 锚点滚动示例 -->
    <DemoSection title="锚点滚动" desc="配合滚动容器实现锚点定位功能">
      <view class="space-y-4">
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">锚点滚动导航</view>
          <view class="h-96 flex overflow-hidden rounded-lg bg-white">
            <!-- 侧边栏 -->
            <wd-sidebar v-model="anchorActive" class="w-24" @change="handleAnchorChange">
              <wd-sidebar-item
                v-for="(item, index) in anchorCategories"
                :key="index"
                :value="index"
                :label="item.label"
              />
            </wd-sidebar>

            <!-- 滚动内容区域 -->
            <scroll-view
              class="flex-1 bg-white"
              scroll-y
              scroll-with-animation
              :scroll-top="anchorScrollTop"
              :throttle="false"
              @scroll="onAnchorScroll"
            >
              <view v-for="(item, index) in anchorCategories" :key="index" class="category">
                <wd-cell-group :title="item.title" border>
                  <wd-cell
                    v-for="(cell, cellIndex) in item.items"
                    :key="cellIndex"
                    :title="cell.title"
                    :label="cell.label"
                  >
                    <wd-icon name="github-filled" size="24px" />
                  </wd-cell>
                </wd-cell-group>
              </view>
            </scroll-view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 锚点滚动" :code="codes.anchor.template" />
        <DemoCode title="脚本 - 锚点滚动" :code="codes.anchor.script" />
      </template>
    </DemoSection>

    <!-- 页面切换示例 -->
    <DemoSection title="页面切换" desc="实现不同内容页面之间的切换效果">
      <view class="space-y-4">
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">页面切换导航</view>
          <view class="h-96 flex overflow-hidden rounded-lg bg-white">
            <!-- 侧边栏 -->
            <wd-sidebar v-model="switchActive" class="w-24" @change="handleSwitchChange">
              <wd-sidebar-item
                v-for="(item, index) in switchCategories"
                :key="index"
                :value="index"
                :label="item.label"
                :icon="item.icon"
                :disabled="item.disabled"
              />
            </wd-sidebar>

            <!-- 切换内容区域 -->
            <view class="relative flex-1 overflow-hidden bg-white">
              <view
                class="absolute inset-0 transition-transform duration-300 ease-in-out"
                :style="`transform: translateY(-${switchActive * 100}%)`"
              >
                <scroll-view
                  v-for="(item, index) in switchCategories"
                  :key="index"
                  class="box-border h-full"
                  scroll-y
                  scroll-with-animation
                  :show-scrollbar="false"
                >
                  <wd-cell-group :title="item.title" border>
                    <wd-cell
                      v-for="(cell, cellIndex) in item.items"
                      :key="cellIndex"
                      :title="cell.title"
                      :label="cell.label"
                    >
                      <wd-icon name="github-filled" size="24px" />
                    </wd-cell>
                  </wd-cell-group>
                </scroll-view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 页面切换" :code="codes.switch.template" />
        <DemoCode title="脚本 - 页面切换" :code="codes.switch.script" />
      </template>
    </DemoSection>

    <!-- 自定义样式示例 -->
    <DemoSection title="自定义样式" desc="自定义图标和插槽内容">
      <view class="space-y-4">
        <!-- 自定义图标 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">自定义图标</view>
          <view class="h-48 flex overflow-hidden rounded-lg bg-white">
            <wd-sidebar v-model="customActive1" class="w-24">
              <wd-sidebar-item :value="0" label="点赞" icon="thumb-up" />
              <wd-sidebar-item :value="1" label="二维码" icon="qrcode" />
              <wd-sidebar-item :value="2" label="位置" icon="location" />
              <wd-sidebar-item :value="3" label="GitHub" icon="github-filled" />
            </wd-sidebar>
            <view class="flex flex-1 items-center justify-center bg-gray-50">
              <wd-text :text="`当前选中: ${customActive1}`" />
            </view>
          </view>
        </view>

        <!-- 自定义插槽内容 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">自定义插槽内容</view>
          <view class="h-48 flex overflow-hidden rounded-lg bg-white">
            <wd-sidebar v-model="customActive2" class="w-32">
              <wd-sidebar-item :value="0" label="">
                <template #icon>
                  <view class="text-center">
                    <wd-icon name="home" size="20px" />
                    <view class="text-xs">首页</view>
                  </view>
                </template>
              </wd-sidebar-item>
              <wd-sidebar-item :value="1" label="">
                <template #icon>
                  <view class="text-center">
                    <wd-icon name="user" size="20px" />
                    <view class="text-xs">用户</view>
                  </view>
                </template>
              </wd-sidebar-item>
            </wd-sidebar>
            <view class="flex flex-1 items-center justify-center bg-gray-50">
              <wd-text :text="`当前选中: ${customActive2}`" />
            </view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 自定义图标" :code="codes.custom.iconTemplate" />
        <DemoCode title="模板 - 自定义插槽" :code="codes.custom.slotTemplate" />
        <DemoCode title="脚本 - 自定义样式" :code="codes.custom.script" />
      </template>
    </DemoSection>

    <!-- 实际应用场景 -->
    <DemoSection title="实际应用场景" desc="常见的业务场景示例">
      <view class="space-y-4">
        <!-- 分类导航 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">商品分类导航</view>
          <view class="h-80 flex overflow-hidden rounded-lg bg-white">
            <wd-sidebar v-model="categoryActive" class="w-24">
              <wd-sidebar-item
                v-for="(category, index) in productCategories"
                :key="index"
                :value="index"
                :label="category.name"
                :badge="category.count > 0 ? category.count : null"
              />
            </wd-sidebar>
            <view class="flex-1 p-4">
              <view class="mb-3 text-sm font-medium">
                {{ productCategories[categoryActive]?.name }}
              </view>
              <view class="grid grid-cols-2 gap-2">
                <view
                  v-for="(product, index) in productCategories[categoryActive]?.products || []"
                  :key="index"
                  class="border rounded p-2 text-center text-xs"
                >
                  {{ product }}
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 设置页面 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">设置页面导航</view>
          <view class="h-80 flex overflow-hidden rounded-lg bg-white">
            <wd-sidebar v-model="settingActive" class="w-24">
              <wd-sidebar-item
                v-for="(setting, index) in settingCategories"
                :key="index"
                :value="index"
                :label="setting.name"
                :icon="setting.icon"
              />
            </wd-sidebar>
            <view class="flex-1 p-4">
              <view class="mb-3 text-sm font-medium">
                {{ settingCategories[settingActive]?.name }}
              </view>
              <view class="space-y-2">
                <view
                  v-for="(option, index) in settingCategories[settingActive]?.options || []"
                  :key="index"
                  class="flex items-center justify-between rounded bg-gray-50 p-2"
                >
                  <view class="text-xs">{{ option }}</view>
                  <wd-icon name="arrow-right" size="16px" color="#999" />
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 商品分类导航" :code="codes.scenarios.categoryTemplate" />
        <DemoCode title="脚本 - 商品分类导航" :code="codes.scenarios.categoryScript" />
        <DemoCode title="模板 - 设置页面导航" :code="codes.scenarios.settingTemplate" />
        <DemoCode title="脚本 - 设置页面导航" :code="codes.scenarios.settingScript" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import type { SidebarBeforeChange } from '@/wd/components/wd-sidebar/wd-sidebar.vue'
import { ref, computed, onMounted } from 'vue'
import { getRect } from '@/wd/components/common/util'

// ===== 组件状态管理 =====

// 基本用法状态
const basicActive1 = ref<number>(0)
const basicActive2 = ref<number>(0)
const basicActive3 = ref<number>(0)

// Items 数组模式状态
const itemsActive = ref<number | string>('item1')
const iconItemsActive = ref<number | string>('icon1')

// 锚点滚动状态
const anchorActive = ref<number>(1)
const anchorScrollTop = ref<number>(0)
const anchorItemScrollTop = ref<number[]>([])

// 页面切换状态
const switchActive = ref<number>(1)

// 自定义样式状态
const customActive1 = ref<number>(0)
const customActive2 = ref<number>(0)

// 实际应用状态
const categoryActive = ref<number>(0)
const settingActive = ref<number>(0)

// 切换状态描述
const switchStatus = ref<string>('等待切换')

// ===== 数据定义 =====

// 接口定义
interface CategoryItem {
  title: string
  label: string
}

interface Category {
  label: string
  title: string
  icon?: string
  items: CategoryItem[]
  disabled?: boolean
}

interface SidebarItem {
  label: string
  value: number | string
  badge?: string | number
  icon?: string
  isDot?: boolean
  disabled?: boolean
  badgeProps?: Record<string, any>
}

// Items 数组数据
const sidebarItems = ref<SidebarItem[]>([
  { label: '选项一', value: 'item1' },
  { label: '选项二', value: 'item2', badge: '5' },
  { label: '选项三', value: 'item3', isDot: true },
  { label: '选项四', value: 'item4', disabled: true },
])

const iconSidebarItems = ref<SidebarItem[]>([
  { label: '首页', value: 'icon1', icon: 'home' },
  { label: '分类', value: 'icon2', icon: 'apps', badge: '新' },
  { label: '购物车', value: 'icon3', icon: 'shopping-cart', badge: '3' },
  { label: '我的', value: 'icon4', icon: 'user' },
])

// 模拟子分类数据生成函数
const createSubCategories = (count: number = 24): CategoryItem[] =>
  Array.from({ length: count })
    .fill(0)
    .map((_, index) => ({
      title: `标题文字 ${index + 1}`,
      label: '这是描述这是描述',
    }))

// 锚点滚动分类数据
const anchorCategories = computed<Category[]>(() => [
  { label: '分类一', title: '标题一', items: createSubCategories() },
  { label: '分类二', title: '标题二', items: createSubCategories() },
  { label: '分类三', title: '标题三', items: createSubCategories(18) },
  { label: '分类四', title: '标题四', items: createSubCategories(21) },
  { label: '分类五', title: '标题五', items: createSubCategories() },
])

// 页面切换分类数据
const switchCategories = computed<Category[]>(() => [
  {
    label: '分类一',
    title: '标题一',
    icon: 'thumb-up',
    items: createSubCategories(),
    disabled: false,
  },
  {
    label: '分类二',
    title: '标题二',
    icon: 'qrcode',
    items: createSubCategories(),
    disabled: false,
  },
  {
    label: '分类三',
    title: '标题三',
    icon: 'location',
    items: createSubCategories(18),
    disabled: false,
  },
  {
    label: '分类四',
    title: '标题四',
    icon: 'github-filled',
    items: createSubCategories(21),
    disabled: true,
  },
])

// 商品分类数据
const productCategories = ref([
  {
    name: '水果',
    count: 15,
    products: ['苹果', '香蕉', '橙子', '葡萄', '草莓', '西瓜'],
  },
  {
    name: '蔬菜',
    count: 23,
    products: ['白菜', '萝卜', '土豆', '西红柿', '黄瓜', '茄子'],
  },
  {
    name: '肉类',
    count: 8,
    products: ['猪肉', '牛肉', '羊肉', '鸡肉', '鱼肉', '虾'],
  },
  {
    name: '零食',
    count: 32,
    products: ['薯片', '饼干', '巧克力', '糖果', '坚果', '果脯'],
  },
])

// 设置分类数据
const settingCategories = ref([
  {
    name: '账户',
    icon: 'user',
    options: ['个人信息', '安全设置', '隐私设置', '注销账户'],
  },
  {
    name: '通知',
    icon: 'bell',
    options: ['消息推送', '邮件通知', '声音设置', '勿扰模式'],
  },
  {
    name: '通用',
    icon: 'setting',
    options: ['语言设置', '主题切换', '字体大小', '清除缓存'],
  },
  {
    name: '关于',
    icon: 'info',
    options: ['版本信息', '用户协议', '隐私政策', '联系我们'],
  },
])

// ===== 计算属性 =====

// 当前选中项标签
const currentItemLabel = computed(() => {
  const item = sidebarItems.value.find((item) => item.value === itemsActive.value)
  return item?.label || ''
})

const currentIconItemLabel = computed(() => {
  const item = iconSidebarItems.value.find((item) => item.value === iconItemsActive.value)
  return item?.label || ''
})

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    basicTemplate: `<view class="h-48 flex">
  <wd-sidebar v-model="basicActive1" class="w-24">
    <wd-sidebar-item :value="0" label="标签名称" />
    <wd-sidebar-item :value="1" label="标签名称" />
    <wd-sidebar-item :value="2" label="标签名称" />
  </wd-sidebar>
  <view class="flex flex-1 items-center justify-center bg-gray-50">
    <wd-text :text="\`当前选中: \${basicActive1}\`" />
  </view>
</view>`,

    badgeTemplate: `<view class="h-48 flex">
  <wd-sidebar v-model="basicActive2" class="w-24">
    <wd-sidebar-item :value="0" label="标签名称" is-dot />
    <wd-sidebar-item :value="1" label="标签名称" badge="5" />
    <wd-sidebar-item
      :value="2"
      label="标签名称"
      badge="99"
      :badge-props="{ type: 'warning', max: 99 }"
    />
  </wd-sidebar>
  <view class="flex flex-1 items-center justify-center bg-gray-50">
    <wd-text :text="\`当前选中: \${basicActive2}\`" />
  </view>
</view>`,

    disabledTemplate: `<view class="h-48 flex">
  <wd-sidebar v-model="basicActive3" :before-change="beforeChange" class="w-24">
    <wd-sidebar-item :value="0" label="标签名称" />
    <wd-sidebar-item :value="1" label="标签名称" disabled />
    <wd-sidebar-item :value="2" label="标签名称" />
  </wd-sidebar>
  <view class="flex flex-1 items-center justify-center bg-gray-50">
    <wd-text :text="\`当前选中: \${basicActive3}\`" />
  </view>
</view>`,

    script: `import { ref } from 'vue'
import type { SidebarBeforeChange } from '@/wd/components/wd-sidebar/wd-sidebar.vue'

// 基本用法状态
const basicActive1 = ref(0)
const basicActive2 = ref(0)
const basicActive3 = ref(0)
const switchStatus = ref('等待切换')

// 切换拦截处理
const beforeChange: SidebarBeforeChange = ({ value, resolve }) => {
  switchStatus.value = '切换中...'
  setTimeout(() => {
    switchStatus.value = '切换完成'
    resolve(true)
  }, 1000)
}`,
  },

  // Items 数组模式代码
  items: {
    itemsTemplate: `<view class="h-48 flex">
  <wd-sidebar
    v-model="itemsActive"
    :items="sidebarItems"
    class="w-24"
    @change="handleItemsChange"
  />
  <view class="flex flex-1 items-center justify-center bg-gray-50">
    <view class="text-center">
      <view class="text-sm font-medium">当前选中: {{ currentItemLabel }}</view>
      <view class="mt-1 text-xs text-gray-500">值: {{ itemsActive }}</view>
    </view>
  </view>
</view>`,

    iconItemsTemplate: `<view class="h-48 flex">
  <wd-sidebar
    v-model="iconItemsActive"
    :items="iconSidebarItems"
    class="w-24"
    @change="handleIconItemsChange"
  />
  <view class="flex flex-1 items-center justify-center bg-gray-50">
    <view class="text-center">
      <view class="text-sm font-medium">当前选中: {{ currentIconItemLabel }}</view>
      <view class="mt-1 text-xs text-gray-500">值: {{ iconItemsActive }}</view>
    </view>
  </view>
</view>`,

    script: `// Items 数组数据
const sidebarItems = ref([
  { label: '选项一', value: 'item1' },
  { label: '选项二', value: 'item2', badge: '5' },
  { label: '选项三', value: 'item3', isDot: true },
  { label: '选项四', value: 'item4', disabled: true },
])

const iconSidebarItems = ref([
  { label: '首页', value: 'icon1', icon: 'home' },
  { label: '分类', value: 'icon2', icon: 'apps', badge: '新' },
  { label: '购物车', value: 'icon3', icon: 'shopping-cart', badge: '3' },
  { label: '我的', value: 'icon4', icon: 'user' },
])

// 状态管理
const itemsActive = ref('item1')
const iconItemsActive = ref('icon1')

// 事件处理
const handleItemsChange = ({ value, label }) => {
  console.log('Items模式切换：', value, label)
}

const handleIconItemsChange = ({ value, label }) => {
  console.log('图标Items模式切换：', value, label)
}`,
  },

  // 锚点滚动代码
  anchor: {
    template: `<view class="h-96 flex">
  <!-- 侧边栏 -->
  <wd-sidebar v-model="anchorActive" class="w-24" @change="handleAnchorChange">
    <wd-sidebar-item
      v-for="(item, index) in anchorCategories"
      :key="index"
      :value="index"
      :label="item.label"
    />
  </wd-sidebar>

  <!-- 滚动内容区域 -->
  <scroll-view
    class="flex-1 bg-white"
    scroll-y
    scroll-with-animation
    :scroll-top="anchorScrollTop"
    :throttle="false"
    @scroll="onAnchorScroll"
  >
    <view v-for="(item, index) in anchorCategories" :key="index" class="category">
      <wd-cell-group :title="item.title" border>
        <wd-cell
          v-for="(cell, cellIndex) in item.items"
          :key="cellIndex"
          :title="cell.title"
          :label="cell.label"
        >
          <wd-icon name="github-filled" size="24px" />
        </wd-cell>
      </wd-cell-group>
    </view>
  </scroll-view>
</view>`,

    script: `import { getRect } from '@/wd/components/common/util'

// 锚点滚动状态
const anchorActive = ref(1)
const anchorScrollTop = ref(0)
const anchorItemScrollTop = ref([])

// 模拟数据生成
const createSubCategories = (count = 24) =>
  new Array(count).fill(0).map((_, index) => ({
    title: \`标题文字 \${index + 1}\`,
    label: '这是描述这是描述'
  }))

// 分类数据
const anchorCategories = computed(() => [
  { label: '分类一', title: '标题一', items: createSubCategories() },
  { label: '分类二', title: '标题二', items: createSubCategories() },
  { label: '分类三', title: '标题三', items: createSubCategories(18) },
  { label: '分类四', title: '标题四', items: createSubCategories(21) },
  { label: '分类五', title: '标题五', items: createSubCategories() },
])

// 锚点切换处理
const handleAnchorChange = ({ value }) => {
  anchorActive.value = value
  anchorScrollTop.value = anchorItemScrollTop.value[value] || 0
}

// 滚动事件处理
const onAnchorScroll = (e) => {
  const { scrollTop } = e.detail
  const threshold = 50

  if (scrollTop < threshold) {
    anchorActive.value = 0
    return
  }

  const index = anchorItemScrollTop.value.findIndex(
    (top) => top > scrollTop && top - scrollTop <= threshold
  )
  if (index > -1) {
    anchorActive.value = index
  }
}

// 初始化滚动位置
onMounted(() => {
  getRect('.category', true).then((rects) => {
    anchorItemScrollTop.value = rects.map((item) => item.top || 0)
    anchorScrollTop.value = rects[anchorActive.value]?.top || 0
  })
})`,
  },

  // 页面切换代码
  switch: {
    template: `<view class="h-96 flex">
  <!-- 侧边栏 -->
  <wd-sidebar v-model="switchActive" class="w-24" @change="handleSwitchChange">
    <wd-sidebar-item
      v-for="(item, index) in switchCategories"
      :key="index"
      :value="index"
      :label="item.label"
      :icon="item.icon"
      :disabled="item.disabled"
    />
  </wd-sidebar>

  <!-- 切换内容区域 -->
  <view class="flex-1 bg-white relative overflow-hidden">
    <view
      class="absolute inset-0 transition-transform duration-300 ease-in-out"
      :style="\`transform: translateY(-\${switchActive * 100}%)\`"
    >
      <scroll-view
        v-for="(item, index) in switchCategories"
        :key="index"
        class="box-border h-full"
        scroll-y
        scroll-with-animation
        :show-scrollbar="false"
      >
        <wd-cell-group :title="item.title" border>
          <wd-cell
            v-for="(cell, cellIndex) in item.items"
            :key="cellIndex"
            :title="cell.title"
            :label="cell.label"
          >
            <wd-icon name="github-filled" size="24px" />
          </wd-cell>
        </wd-cell-group>
      </scroll-view>
    </view>
  </view>
</view>`,

    script: `// 页面切换状态
const switchActive = ref(1)

// 页面切换数据
const switchCategories = computed(() => [
  { label: '分类一', title: '标题一', icon: 'thumb-up', items: createSubCategories(), disabled: false },
  { label: '分类二', title: '标题二', icon: 'qrcode', items: createSubCategories(), disabled: false },
  { label: '分类三', title: '标题三', icon: 'location', items: createSubCategories(18), disabled: false },
  { label: '分类四', title: '标题四', icon: 'github-filled', items: createSubCategories(21), disabled: true },
])

// 页面切换处理
const handleSwitchChange = ({ value }) => {
  switchActive.value = value
  console.log('切换到页面：', value)
}`,
  },

  // 自定义样式代码
  custom: {
    iconTemplate: `<view class="h-48 flex">
  <wd-sidebar v-model="customActive1" class="w-24">
    <wd-sidebar-item :value="0" label="点赞" icon="thumb-up" />
    <wd-sidebar-item :value="1" label="二维码" icon="qrcode" />
    <wd-sidebar-item :value="2" label="位置" icon="location" />
    <wd-sidebar-item :value="3" label="GitHub" icon="github-filled" />
  </wd-sidebar>
  <view class="flex flex-1 items-center justify-center bg-gray-50">
    <wd-text :text="\`当前选中: \${customActive1}\`" />
  </view>
</view>`,

    slotTemplate: `<view class="h-48 flex">
  <wd-sidebar v-model="customActive2" class="w-32">
    <wd-sidebar-item :value="0" label="">
      <template #icon>
        <view class="text-center">
          <wd-icon name="home" size="20px" />
          <view class="text-xs">首页</view>
        </view>
      </template>
    </wd-sidebar-item>
    <wd-sidebar-item :value="1" label="">
      <template #icon>
        <view class="text-center">
          <wd-icon name="user" size="20px" />
          <view class="text-xs">用户</view>
        </view>
      </template>
    </wd-sidebar-item>
  </wd-sidebar>
  <view class="flex flex-1 items-center justify-center bg-gray-50">
    <wd-text :text="\`当前选中: \${customActive2}\`" />
  </view>
</view>`,

    script: `// 自定义样式状态
const customActive1 = ref(0)
const customActive2 = ref(0)`,
  },

  // 应用场景代码
  scenarios: {
    categoryTemplate: `<view class="h-80 flex">
  <wd-sidebar v-model="categoryActive" class="w-24">
    <wd-sidebar-item
      v-for="(category, index) in productCategories"
      :key="index"
      :value="index"
      :label="category.name"
      :badge="category.count > 0 ? category.count : null"
    />
  </wd-sidebar>
  <view class="flex-1 p-4">
    <view class="mb-3 text-sm font-medium">
      {{ productCategories[categoryActive]?.name }}
    </view>
    <view class="grid grid-cols-2 gap-2">
      <view
        v-for="(product, index) in productCategories[categoryActive]?.products || []"
        :key="index"
        class="p-2 rounded border text-center text-xs"
      >
        {{ product }}
      </view>
    </view>
  </view>
</view>`,

    categoryScript: `// 商品分类数据
const productCategories = ref([
  {
    name: '水果',
    count: 15,
    products: ['苹果', '香蕉', '橙子', '葡萄', '草莓', '西瓜']
  },
  {
    name: '蔬菜',
    count: 23,
    products: ['白菜', '萝卜', '土豆', '西红柿', '黄瓜', '茄子']
  },
  {
    name: '肉类',
    count: 8,
    products: ['猪肉', '牛肉', '羊肉', '鸡肉', '鱼肉', '虾']
  },
  {
    name: '零食',
    count: 32,
    products: ['薯片', '饼干', '巧克力', '糖果', '坚果', '果脯']
  },
])

const categoryActive = ref(0)`,

    settingTemplate: `<view class="h-80 flex">
  <wd-sidebar v-model="settingActive" class="w-24">
    <wd-sidebar-item
      v-for="(setting, index) in settingCategories"
      :key="index"
      :value="index"
      :label="setting.name"
      :icon="setting.icon"
    />
  </wd-sidebar>
  <view class="flex-1 p-4">
    <view class="mb-3 text-sm font-medium">
      {{ settingCategories[settingActive]?.name }}
    </view>
    <view class="space-y-2">
      <view
        v-for="(option, index) in settingCategories[settingActive]?.options || []"
        :key="index"
        class="flex items-center justify-between p-2 rounded bg-gray-50"
      >
        <view class="text-xs">{{ option }}</view>
        <wd-icon name="arrow-right" size="16px" color="#999" />
      </view>
    </view>
  </view>
</view>`,

    settingScript: `// 设置分类数据
const settingCategories = ref([
  {
    name: '账户',
    icon: 'user',
    options: ['个人信息', '安全设置', '隐私设置', '注销账户']
  },
  {
    name: '通知',
    icon: 'bell',
    options: ['消息推送', '邮件通知', '声音设置', '勿扰模式']
  },
  {
    name: '通用',
    icon: 'setting',
    options: ['语言设置', '主题切换', '字体大小', '清除缓存']
  },
  {
    name: '关于',
    icon: 'info',
    options: ['版本信息', '用户协议', '隐私政策', '联系我们']
  },
])

const settingActive = ref(0)`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'model-value',
    type: 'Number | String',
    default: '0',
    desc: '当前导航项的索引或值',
  },
  {
    name: 'items',
    type: 'Array<SidebarItem>',
    default: '[]',
    desc: '侧边栏项数据数组，使用数组模式时传入',
  },
  {
    name: 'before-change',
    type: 'Function',
    default: '-',
    desc: '在改变前执行的函数，可用于切换拦截',
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

// SidebarItem Props 属性文档
const apiItemProps = [
  {
    name: 'label',
    type: 'String',
    default: '""',
    desc: '当前选项标题',
  },
  {
    name: 'value',
    type: 'Number | String',
    default: '-',
    desc: '当前选项的值，唯一标识',
  },
  {
    name: 'badge',
    type: 'String | Number',
    default: 'null',
    desc: '徽标显示值',
  },
  {
    name: 'badge-props',
    type: 'Object',
    default: '{}',
    desc: '徽标属性，透传给 Badge 组件',
  },
  {
    name: 'icon',
    type: 'String',
    default: '""',
    desc: '图标名称',
  },
  {
    name: 'is-dot',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示点状徽标',
  },
  {
    name: 'max',
    type: 'Number',
    default: '99',
    desc: '徽标最大值',
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: '是否禁用',
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
const apiMethods: any[] = []

// Events 事件文档
const apiEvents = [
  {
    name: 'change',
    desc: '选中项变化时触发，参数为 { value, label }',
  },
  {
    name: 'item-click',
    desc: '点击侧边栏项时触发（仅在 items 模式下），参数为 item, index',
  },
]

// SidebarItem Events 事件文档
const apiItemEvents = [
  {
    name: 'itemclick',
    desc: '点击侧边栏项时触发',
  },
]

// ===== 事件处理方法 =====

/**
 * 切换拦截处理
 */
const beforeChange: SidebarBeforeChange = ({ value, resolve }) => {
  switchStatus.value = '切换中...'
  setTimeout(() => {
    switchStatus.value = '切换完成'
    resolve(true)
  }, 1000)
}

/**
 * Items 模式切换事件
 */
const handleItemsChange = ({ value, label }: { value: number | string; label: string }) => {
  console.log('Items模式切换：', value, label)
}

/**
 * 图标 Items 模式切换事件
 */
const handleIconItemsChange = ({ value, label }: { value: number | string; label: string }) => {
  console.log('图标Items模式切换：', value, label)
}

/**
 * 锚点切换处理
 */
const handleAnchorChange = ({ value }: { value: number }) => {
  anchorActive.value = value
  anchorScrollTop.value = anchorItemScrollTop.value[value] || 0
}

/**
 * 锚点滚动事件处理
 */
const onAnchorScroll = (e: any) => {
  const { scrollTop } = e.detail
  const threshold = 50

  if (scrollTop < threshold) {
    anchorActive.value = 0
    return
  }

  const index = anchorItemScrollTop.value.findIndex(
    (top) => top > scrollTop && top - scrollTop <= threshold,
  )
  if (index > -1) {
    anchorActive.value = index
  }
}

/**
 * 页面切换处理
 */
const handleSwitchChange = ({ value }: { value: number | string }) => {
  switchActive.value = value as number
  console.log('切换到页面：', value)
}

// ===== 组件挂载处理 =====

/**
 * 组件挂载后初始化
 */
onMounted(() => {
  // 初始化锚点滚动位置
  getRect('.category', true).then((rects) => {
    anchorItemScrollTop.value = rects.map((item) => item.top || 0)
    anchorScrollTop.value = rects[anchorActive.value]?.top || 0
  })
})

const { resetScrollTop, updateScrollTop } = useScroll()
onShow(() => {
  resetScrollTop()
})
onPageScroll((e) => {
  updateScrollTop(e.scrollTop)
})
</script>

<style lang="scss" scoped>
// 分类容器
.category {
  scroll-margin-top: 50px; // 滚动时的上边距
}
</style>
