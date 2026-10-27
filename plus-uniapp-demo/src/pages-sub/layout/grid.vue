<!-- Grid 宫格 http://127.0.0.1:100/#/pages-sub/demo/wd/grid -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Grid 宫格" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="默认4列布局，支持点击反馈和页面跳转">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="默认4列布局">
          <wd-grid clickable @item-click="handleBasicClick">
            <wd-grid-item icon="image" text="文字" />
            <wd-grid-item icon="image" text="文字" />
            <wd-grid-item icon="image" text="文字" />
            <wd-grid-item icon="image" text="文字" />
          </wd-grid>
        </wd-cell>

        <wd-cell title="可点击网格">
          <wd-grid clickable @item-click="handleBasicClick">
            <wd-grid-item icon="home" text="首页" />
            <wd-grid-item icon="setting" text="设置" />
            <wd-grid-item icon="user" text="用户" />
            <wd-grid-item icon="star" text="收藏" />
          </wd-grid>
        </wd-cell>
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 默认4列布局" :code="codes.basic.defaultTemplate" />
        <DemoCode title="模板 - 可点击网格" :code="codes.basic.clickableTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- Items 模式示例 -->
    <DemoSection title="Items 模式" desc="通过 items 数组数据驱动网格渲染">
      <wd-cell-group>
        <wd-cell title="基础 Items 模式">
          <wd-grid :items="basicItems" clickable @item-click="handleItemsClick" />
        </wd-cell>

        <wd-cell title="带徽标的 Items">
          <wd-grid :items="badgeItems" :column="3" clickable @item-click="handleItemsClick" />
        </wd-cell>

        <wd-cell title="自定义跳转 Items">
          <wd-grid :items="navigationItems" :column="2" clickable @item-click="handleItemsClick" />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 基础 Items 模式" :code="codes.items.basicTemplate" />
        <DemoCode title="模板 - 带徽标的 Items" :code="codes.items.badgeTemplate" />
        <DemoCode title="模板 - 自定义跳转 Items" :code="codes.items.navigationTemplate" />
        <DemoCode title="脚本 - Items 模式" :code="codes.items.script" />
      </template>
    </DemoSection>

    <!-- 自定义布局示例 -->
    <DemoSection title="自定义布局" desc="自定义列数、间距和形状">
      <wd-cell-group>
        <wd-cell title="3列布局">
          <wd-grid :column="3" clickable>
            <wd-grid-item icon="image" text="文字" />
            <wd-grid-item icon="image" text="文字" />
            <wd-grid-item icon="image" text="文字" />
            <wd-grid-item icon="image" text="文字" />
            <wd-grid-item icon="image" text="文字" />
            <wd-grid-item icon="image" text="文字" />
          </wd-grid>
        </wd-cell>

        <wd-cell title="正方形格子">
          <wd-grid :column="4" :gutter="10" clickable square>
            <wd-grid-item icon="image" text="文字" />
            <wd-grid-item icon="image" text="文字" />
            <wd-grid-item icon="image" text="文字" />
            <wd-grid-item icon="image" text="文字" />
          </wd-grid>
        </wd-cell>

        <wd-cell title="设置间距">
          <wd-grid :gutter="10" :column="4" clickable>
            <wd-grid-item icon="image" text="文字" />
            <wd-grid-item icon="image" text="文字" />
            <wd-grid-item icon="image" text="文字" />
            <wd-grid-item icon="image" text="文字" />
          </wd-grid>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 3列布局" :code="codes.layout.columnTemplate" />
        <DemoCode title="模板 - 正方形格子" :code="codes.layout.squareTemplate" />
        <DemoCode title="模板 - 设置间距" :code="codes.layout.gutterTemplate" />
        <DemoCode title="脚本 - 自定义布局" :code="codes.layout.script" />
      </template>
    </DemoSection>

    <!-- 边框和背景示例 -->
    <DemoSection title="边框和背景" desc="显示边框和自定义背景颜色">
      <wd-cell-group>
        <wd-cell title="显示边框">
          <wd-grid :column="3" clickable border>
            <wd-grid-item icon="image" text="文字" />
            <wd-grid-item icon="image" text="文字" />
            <wd-grid-item icon="image" text="文字" />
            <wd-grid-item icon="image" text="文字" />
            <wd-grid-item icon="image" text="文字" />
            <wd-grid-item icon="image" text="文字" />
          </wd-grid>
        </wd-cell>

        <wd-cell title="自定义背景颜色">
          <wd-grid bg-color="rgba(0, 0, 0, 0.02)" clickable>
            <wd-grid-item icon="image" text="文字" />
            <wd-grid-item icon="image" text="文字" />
            <wd-grid-item icon="image" text="文字" />
            <wd-grid-item icon="image" text="文字" />
          </wd-grid>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 显示边框" :code="codes.border.borderTemplate" />
        <DemoCode title="模板 - 自定义背景" :code="codes.border.bgTemplate" />
        <DemoCode title="脚本 - 边框和背景" :code="codes.border.script" />
      </template>
    </DemoSection>

    <!-- 自定义内容示例 -->
    <DemoSection title="自定义内容" desc="使用插槽自定义图标、文字和整体内容">
      <!-- 插槽示例区域 -->
      <view class="space-y-4">
        <!-- 内容插槽 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">内容插槽</view>
          <view class="mx-4">
            <wd-grid clickable @item-click="handleSlotClick">
              <wd-grid-item use-slot>
                <image class="grid-image" :src="placeholderImage" />
              </wd-grid-item>
              <wd-grid-item use-slot>
                <image class="grid-image" :src="placeholderImage" />
              </wd-grid-item>
              <wd-grid-item use-slot>
                <image class="grid-image" :src="placeholderImage" />
              </wd-grid-item>
            </wd-grid>
          </view>
        </view>

        <!-- 图标插槽 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">图标插槽</view>
          <view class="mx-4">
            <wd-grid clickable>
              <wd-grid-item use-icon-slot text="自定义图标" icon-size="36px">
                <template #icon>
                  <image class="custom-icon" :src="customIconImage" />
                </template>
              </wd-grid-item>
              <wd-grid-item use-icon-slot text="自定义图标" icon-size="36px">
                <template #icon>
                  <image class="custom-icon" :src="customIconImage" />
                </template>
              </wd-grid-item>
              <wd-grid-item use-icon-slot text="自定义图标" icon-size="36px">
                <template #icon>
                  <image class="custom-icon" :src="customIconImage" />
                </template>
              </wd-grid-item>
            </wd-grid>
          </view>
        </view>

        <!-- 文字插槽 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">文字插槽</view>
          <view class="mx-4">
            <wd-grid clickable>
              <wd-grid-item use-text-slot icon="image">
                <template #text>
                  <view class="custom-text">自定义文字插槽</view>
                </template>
              </wd-grid-item>
              <wd-grid-item use-text-slot icon="image">
                <template #text>
                  <view class="custom-text">自定义文字插槽</view>
                </template>
              </wd-grid-item>
              <wd-grid-item use-text-slot icon="image">
                <template #text>
                  <view class="custom-text">自定义文字插槽</view>
                </template>
              </wd-grid-item>
            </wd-grid>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 内容插槽" :code="codes.slots.contentTemplate" />
        <DemoCode title="模板 - 图标插槽" :code="codes.slots.iconTemplate" />
        <DemoCode title="模板 - 文字插槽" :code="codes.slots.textTemplate" />
        <DemoCode title="脚本 - 自定义内容" :code="codes.slots.script" />
      </template>
    </DemoSection>

    <!-- 页面跳转示例 -->
    <DemoSection title="页面跳转" desc="支持多种页面跳转方式">
      <wd-cell-group>
        <wd-cell title="跳转方式">
          <wd-grid clickable @item-click="handleNavigationClick">
            <wd-grid-item
              link-type="redirectTo"
              url="/pages/button/Index"
              icon="edit"
              text="redirectTo"
            />
            <wd-grid-item
              link-type="navigateTo"
              url="/pages/button/Index"
              icon="edit"
              text="navigateTo"
            />
            <wd-grid-item
              link-type="reLaunch"
              url="/pages/button/Index"
              icon="refresh"
              text="reLaunch"
            />
            <wd-grid-item
              link-type="switchTab"
              url="/pages/index/index"
              icon="app"
              text="switchTab"
            />
          </wd-grid>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 页面跳转" :code="codes.navigation.template" />
        <DemoCode title="脚本 - 页面跳转" :code="codes.navigation.script" />
      </template>
    </DemoSection>

    <!-- 徽标和提示示例 -->
    <DemoSection title="徽标和提示" desc="显示红点和数字徽标">
      <wd-cell-group>
        <wd-cell title="徽标类型">
          <wd-grid clickable @item-click="handleBadgeClick">
            <wd-grid-item is-dot icon="goods" text="显示红点" />
            <wd-grid-item :value="99" icon="laptop" text="数字徽标" />
            <wd-grid-item :value="100" :max="99" icon="setting" text="超出最大值" />
            <wd-grid-item type="warning" :value="5" icon="message" text="警告徽标" />
          </wd-grid>
        </wd-cell>

        <wd-cell title="不同主题徽标">
          <wd-grid clickable>
            <wd-grid-item type="info" :value="12" icon="home" text="Info" />
            <wd-grid-item type="primary" :value="8" icon="check" text="Success" />
            <wd-grid-item type="warning" :value="3" icon="warn" text="Warning" />
            <wd-grid-item type="danger" :value="2" icon="close" text="Error" />
          </wd-grid>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 徽标类型" :code="codes.badge.typeTemplate" />
        <DemoCode title="模板 - 不同主题" :code="codes.badge.themeTemplate" />
        <DemoCode title="脚本 - 徽标和提示" :code="codes.badge.script" />
      </template>
    </DemoSection>

    <!-- 事件监听示例 -->
    <DemoSection title="事件监听" desc="监听点击事件和获取详细信息">
      <!-- 状态显示区域 -->
      <view class="space-y-4">
        <!-- 交互网格 -->
        <view class="mx-4 rounded-lg bg-blue-50 p-4">
          <view class="mb-3 text-sm text-blue-800 font-medium">点击下方网格查看事件信息</view>
          <wd-grid clickable @item-click="handleEventClick">
            <wd-grid-item icon="home" text="首页" @itemclick="handleGridItemClick('首页')" />
            <wd-grid-item icon="user" text="用户" @itemclick="handleGridItemClick('用户')" />
            <wd-grid-item icon="setting" text="设置" @itemclick="handleGridItemClick('设置')" />
            <wd-grid-item icon="star" text="收藏" @itemclick="handleGridItemClick('收藏')" />
          </wd-grid>
        </view>

        <!-- 事件信息显示 -->
        <view class="mx-4 rounded-lg bg-gray-50 p-4">
          <view class="mb-2 text-sm font-medium">最近点击事件</view>
          <view class="h-24 overflow-y-auto border rounded bg-white p-2">
            <view
              v-for="(event, index) in recentEvents"
              :key="index"
              class="mb-1 text-xs text-gray-600"
            >
              <text class="text-gray-400">[{{ event.time }}]</text>
              {{ event.message }}
            </view>
            <view v-if="recentEvents.length === 0" class="py-4 text-center text-gray-400">
              暂无点击事件
            </view>
          </view>
          <view class="mt-2">
            <wd-button size="small" @click="clearEvents">清空事件</wd-button>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 事件监听" :code="codes.events.template" />
        <DemoCode title="脚本 - 事件处理" :code="codes.events.script" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/wd'

import type { GridItem } from '@/wd/components/wd-grid/wd-grid.vue'

// ===== 组件状态管理 =====

// Toast 工具
const toast = useToast()

// 事件记录状态
interface EventRecord {
  time: string
  message: string
}

const recentEvents = ref<EventRecord[]>([])

// Items 模式数据
const basicItems = ref<GridItem[]>([
  { icon: 'home', text: '首页' },
  { icon: 'user', text: '用户' },
  { icon: 'setting', text: '设置' },
  { icon: 'star', text: '收藏' },
])

const badgeItems = ref<GridItem[]>([
  { icon: 'goods', text: '商品', isDot: true },
  { icon: 'desktop', text: '数码', value: 99 },
  { icon: 'setting', text: '设置', value: 100, max: 99 },
  { icon: 'message', text: '消息', type: 'danger', value: 5 },
  { icon: 'home', text: '首页', type: 'primary', value: 12 },
  { icon: 'check', text: '成功', type: 'success', value: 8 },
])

const navigationItems = ref<GridItem[]>([
  {
    icon: 'edit',
    text: 'redirectTo',
    url: '/pages/button/Index',
    linkType: 'redirectTo',
  },
  // 自定义布局代码
  {
    icon: 'edit',
    text: 'navigateTo',
    url: '/pages/button/Index',
    linkType: 'navigateTo',
  },
])
const placeholderImage = ref(
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjkwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iOTAiIGZpbGw9IiNmNWY1ZjUiLz48dGV4dCB4PSI1MCIgeT0iNDUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuWbvueJhzwvdGV4dD48L3N2Zz4=',
)

const customIconImage = ref(
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjM2IiBoZWlnaHQ9IjM2IiByeD0iNCIgZmlsbD0iIzQwODBGRiIvPgo8cGF0aCBkPSJNMjQgMTJIMTJWMjRIMjRWMTJaIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTYgMTZMMjAgMjAiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0yMCAxNkwxNiAyMCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+',
)

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    defaultTemplate: `<wd-grid clickable @item-click="handleBasicClick">
  <wd-grid-item icon="image" text="文字" />
  <wd-grid-item icon="image" text="文字" />
  <wd-grid-item icon="image" text="文字" />
  <wd-grid-item icon="image" text="文字" />
</wd-grid>`,

    clickableTemplate: `<wd-grid clickable @item-click="handleBasicClick">
  <wd-grid-item icon="home" text="首页" />
  <wd-grid-item icon="setting" text="设置" />
  <wd-grid-item icon="user" text="用户" />
  <wd-grid-item icon="star" text="收藏" />
</wd-grid>`,

    script: `import { useToast } from '@/wd'

const toast = useToast()

const handleBasicClick = () => {
  toast.success('网格项被点击')
}`,
  },

  // Items 模式代码
  items: {
    basicTemplate: `<wd-grid :items="basicItems" clickable @item-click="handleItemsClick" />`,

    badgeTemplate: `<wd-grid :items="badgeItems" :column="3" clickable @item-click="handleItemsClick" />`,

    navigationTemplate: `<wd-grid :items="navigationItems" :column="2" clickable @item-click="handleItemsClick" />`,

    script: `import { ref } from 'vue'

// Items 模式数据
const basicItems = ref([
  { icon: 'home', text: '首页' },
  { icon: 'user', text: '用户' },
  { icon: 'setting', text: '设置' },
  { icon: 'star', text: '收藏' },
])

const badgeItems = ref([
  { icon: 'goods', text: '商品', isDot: true },
  { icon: 'laptop', text: '数码', value: 99 },
  { icon: 'setting', text: '设置', value: 100, max: 99 },
  { icon: 'message', text: '消息', type: 'warn', value: 5 },
])

const navigationItems = ref([
  {
    icon: 'edit',
    text: 'redirectTo',
    url: '/pages/button/Index',
    linkType: 'redirectTo',
  },
  {
    icon: 'edit',
    text: 'navigateTo',
    url: '/pages/button/Index',
    linkType: 'navigateTo',
  },
])

const navigationItems = ref([
  {
    icon: 'edit',
    text: 'redirectTo',
    url: '/pages/button/Index',
    linkType: 'redirectTo',
  },
  {
    icon: 'edit',
    text: 'navigateTo',
    url: '/pages/button/Index',
    linkType: 'navigateTo',
  },
])

const handleItemsClick = (item, index) => {
  console.log('Items模式点击：', item, index)
  toast.success(\`点击了\${item.text}\`)
}`,
  },
  layout: {
    columnTemplate: `<wd-grid :column="3" clickable>
  <wd-grid-item icon="image" text="文字" />
  <wd-grid-item icon="image" text="文字" />
  <wd-grid-item icon="image" text="文字" />
  <wd-grid-item icon="image" text="文字" />
  <wd-grid-item icon="image" text="文字" />
  <wd-grid-item icon="image" text="文字" />
</wd-grid>`,

    squareTemplate: `<wd-grid square :column="4" :gutter="10" clickable>
  <wd-grid-item icon="image" text="文字" />
  <wd-grid-item icon="image" text="文字" />
  <wd-grid-item icon="image" text="文字" />
  <wd-grid-item icon="image" text="文字" />
</wd-grid>`,

    gutterTemplate: `<wd-grid :gutter="10" :column="4" clickable>
  <wd-grid-item icon="image" text="文字" />
  <wd-grid-item icon="image" text="文字" />
  <wd-grid-item icon="image" text="文字" />
  <wd-grid-item icon="image" text="文字" />
</wd-grid>`,

    script: `// 自定义布局配置
const gridConfig = ref({
  column: 3,        // 列数
  square: true,     // 正方形
  gutter: 10,       // 间距
  clickable: true   // 可点击
})`,
  },

  // 边框和背景代码
  border: {
    borderTemplate: `<wd-grid :column="3" border clickable>
  <wd-grid-item icon="image" text="文字" />
  <wd-grid-item icon="image" text="文字" />
  <wd-grid-item icon="image" text="文字" />
  <wd-grid-item icon="image" text="文字" />
  <wd-grid-item icon="image" text="文字" />
  <wd-grid-item icon="image" text="文字" />
</wd-grid>`,

    bgTemplate: `<wd-grid bg-color="rgba(0, 0, 0, 0.02)" clickable>
  <wd-grid-item icon="image" text="文字" />
  <wd-grid-item icon="image" text="文字" />
  <wd-grid-item icon="image" text="文字" />
  <wd-grid-item icon="image" text="文字" />
</wd-grid>`,

    script: `// 边框和背景配置
const styleConfig = ref({
  border: true,                    // 显示边框
  bgColor: 'rgba(0, 0, 0, 0.02)', // 背景颜色
})`,
  },

  // 自定义内容代码
  slots: {
    contentTemplate: `<wd-grid clickable>
  <wd-grid-item use-slot>
    <image class="grid-image" :src="placeholderImage" />
  </wd-grid-item>
  <wd-grid-item use-slot>
    <image class="grid-image" :src="placeholderImage" />
  </wd-grid-item>
  <wd-grid-item use-slot>
    <image class="grid-image" :src="placeholderImage" />
  </wd-grid-item>
</wd-grid>`,

    iconTemplate: `<wd-grid clickable>
  <wd-grid-item use-icon-slot text="自定义图标" icon-size="36px">
    <template #icon>
      <image class="custom-icon" :src="customIconImage" />
    </template>
  </wd-grid-item>
</wd-grid>`,

    textTemplate: `<wd-grid clickable>
  <wd-grid-item use-text-slot icon="image">
    <template #text>
      <view class="custom-text">自定义文字插槽</view>
    </template>
  </wd-grid-item>
</wd-grid>`,

    script: `import { ref } from 'vue'

// 图片资源
const placeholderImage = ref('data:image/svg+xml;base64,...')
const customIconImage = ref('data:image/svg+xml;base64,...')

const handleSlotClick = () => {
  console.log('自定义插槽网格被点击')
}`,
  },

  // 页面跳转代码
  navigation: {
    template: `<wd-grid clickable @item-click="handleNavigationClick">
  <wd-grid-item
    link-type="redirectTo"
    url="/pages/button/Index"
    icon="edit"
    text="redirectTo"
  />
  <wd-grid-item
    link-type="navigateTo"
    url="/pages/button/Index"
    icon="edit"
    text="navigateTo"
  />
  <wd-grid-item
    link-type="reLaunch"
    url="/pages/button/Index"
    icon="refresh"
    text="reLaunch"
  />
  <wd-grid-item
    link-type="switchTab"
    url="/pages/index/index"
    icon="app"
    text="switchTab"
  />
</wd-grid>`,

    script: `const handleNavigationClick = () => {
  toast.success('页面跳转成功')
}

// 跳转方式说明：
// navigateTo: 保留当前页面，跳转到应用内的某个页面
// redirectTo: 关闭当前页面，跳转到应用内的某个页面
// reLaunch: 关闭所有页面，打开到应用内的某个页面
// switchTab: 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面`,
  },

  // 徽标代码
  badge: {
    typeTemplate: `<wd-grid clickable>
  <wd-grid-item is-dot icon="goods" text="显示红点" />
  <wd-grid-item :value="99" icon="computer" text="数字徽标" />
  <wd-grid-item :value="100" :max="99" icon="setting" text="超出最大值" />
  <wd-grid-item type="danger" :value="5" icon="message" text="危险徽标" />
</wd-grid>`,

    themeTemplate: `<wd-grid clickable>
  <wd-grid-item type="primary" :value="12" icon="home" text="Primary" />
  <wd-grid-item type="success" :value="8" icon="check" text="Success" />
  <wd-grid-item type="warning" :value="3" icon="warn" text="Warning" />
  <wd-grid-item type="danger" :value="2" icon="error" text="Danger" />
</wd-grid>`,

    script: `const handleBadgeClick = () => {
  toast.success('带徽标的网格项被点击')
}

// 徽标类型说明：
// is-dot: 显示小红点
// value: 显示数字
// max: 最大值，超过显示 max+
// type: 主题类型 primary/success/warning/danger/info`,
  },

  // 事件监听代码
  events: {
    template: `<wd-grid clickable @item-click="handleEventClick">
  <wd-grid-item icon="home" text="首页" @itemclick="handleGridItemClick('首页')" />
  <wd-grid-item icon="user" text="用户" @itemclick="handleGridItemClick('用户')" />
  <wd-grid-item icon="setting" text="设置" @itemclick="handleGridItemClick('设置')" />
  <wd-grid-item icon="star" text="收藏" @itemclick="handleGridItemClick('收藏')" />
</wd-grid>`,

    script: `import { ref } from 'vue'

interface EventRecord {
  time: string
  message: string
}

const recentEvents = ref<EventRecord[]>([])

// Grid 组件的 item-click 事件
const handleEventClick = (item, index) => {
  const time = new Date().toLocaleTimeString()
  const message = \`Grid事件 - 点击了第\${index + 1}个项目\`

  recentEvents.value.unshift({ time, message })
  if (recentEvents.value.length > 10) {
    recentEvents.value = recentEvents.value.slice(0, 10)
  }
}

// GridItem 组件的 itemclick 事件
const handleGridItemClick = (itemName) => {
  const time = new Date().toLocaleTimeString()
  const message = \`GridItem事件 - 点击了\${itemName}\`

  recentEvents.value.unshift({ time, message })
  if (recentEvents.value.length > 10) {
    recentEvents.value = recentEvents.value.slice(0, 10)
  }
}

const clearEvents = () => {
  recentEvents.value = []
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'column',
    type: 'Number',
    default: '4',
    desc: '列数，建议不要设置过大的值',
  },
  {
    name: 'clickable',
    type: 'Boolean',
    default: 'false',
    desc: '是否开启格子点击反馈',
  },
  {
    name: 'square',
    type: 'Boolean',
    default: 'false',
    desc: '是否将格子固定为正方形',
  },
  {
    name: 'border',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示边框',
  },
  {
    name: 'gutter',
    type: 'Number',
    default: '0',
    desc: '格子之间的间距，默认单位为px',
  },
  {
    name: 'bg-color',
    type: 'String',
    default: '""',
    desc: '背景颜色',
  },
  {
    name: 'hover-class',
    type: 'String',
    default: '""',
    desc: '自定义内容区域hover-class',
  },
  {
    name: 'items',
    type: 'Array<GridItem>',
    default: '[]',
    desc: '网格项数据数组（items模式）',
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

// GridItem Props 属性文档
const gridItemProps = [
  {
    name: 'icon',
    type: 'String',
    default: '""',
    desc: '图标名称，可选值见 wd-icon 组件',
  },
  {
    name: 'icon-size',
    type: 'String',
    default: '"26px"',
    desc: '图标大小',
  },
  {
    name: 'icon-color',
    type: 'String',
    default: '""',
    desc: '图标颜色',
  },
  {
    name: 'text',
    type: 'String',
    default: '""',
    desc: '文字内容',
  },
  {
    name: 'url',
    type: 'String',
    default: '""',
    desc: '点击后跳转的链接地址',
  },
  {
    name: 'link-type',
    type: 'String',
    default: '"navigateTo"',
    desc: '页面跳转方式：navigateTo / switchTab / reLaunch / redirectTo',
  },
  {
    name: 'use-slot',
    type: 'Boolean',
    default: 'false',
    desc: '是否开启内容插槽',
  },
  {
    name: 'use-icon-slot',
    type: 'Boolean',
    default: 'false',
    desc: '是否开启图标插槽',
  },
  {
    name: 'use-text-slot',
    type: 'Boolean',
    default: 'false',
    desc: '是否开启文字插槽',
  },
  {
    name: 'is-dot',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示图标右上角小红点',
  },
  {
    name: 'type',
    type: 'String',
    default: '""',
    desc: '图标右上角显示的 badge 类型：primary / success / warning / danger / info',
  },
  {
    name: 'value',
    type: 'String | Number',
    default: '""',
    desc: '图标右上角 badge 显示值',
  },
  {
    name: 'max',
    type: 'Number',
    default: '""',
    desc: '图标右上角 badge 最大值，超过最大值会显示 {max}+',
  },
  {
    name: 'badge-props',
    type: 'Object',
    default: '{}',
    desc: '徽标属性，透传给 Badge 组件',
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
    name: 'custom-text',
    type: 'String',
    default: '""',
    desc: 'GridItem 下方文字样式',
  },
  {
    name: 'custom-icon',
    type: 'String',
    default: '""',
    desc: 'GridItem 上方 icon 样式',
  },
]

// Events 事件文档
const apiEvents = [
  {
    name: 'item-click',
    desc: '点击网格项时触发（Grid 组件事件）',
  },
  {
    name: 'itemclick',
    desc: '点击网格项时触发（GridItem 组件事件）',
  },
]

// 合并所有属性文档
const allApiProps = [...apiProps, ...gridItemProps]

// ===== 工具方法 =====

/**
 * 添加事件记录
 */
const addEventRecord = (message: string) => {
  const time = new Date().toLocaleTimeString()
  recentEvents.value.unshift({ time, message })
  // 限制事件记录数量
  if (recentEvents.value.length > 10) {
    recentEvents.value = recentEvents.value.slice(0, 10)
  }
}

/**
 * 清空事件记录
 */
const clearEvents = () => {
  recentEvents.value = []
  addEventRecord('事件记录已清空')
}

// ===== 事件处理方法 =====

/**
 * 基本用法点击事件
 */
const handleBasicClick = () => {
  toast.success('网格项被点击')
  console.log('基本网格项被点击')
}

/**
 * 自定义插槽点击事件
 */
const handleSlotClick = () => {
  toast.success('自定义插槽网格被点击')
  console.log('自定义插槽网格被点击')
}

/**
 * 页面跳转点击事件
 */
const handleNavigationClick = () => {
  toast.success('页面跳转成功')
  console.log('页面跳转网格被点击')
}

/**
 * 徽标网格点击事件
 */
const handleBadgeClick = () => {
  toast.success('带徽标的网格项被点击')
  console.log('带徽标的网格项被点击')
}

/**
 * Items 模式点击事件
 */
const handleItemsClick = (item: any, index: number) => {
  toast.success(`点击了${item.text}`)
  console.log('Items模式点击：', item, index)
}

/**
 * 事件监听网格点击事件（Grid 组件事件）
 */
const handleEventClick = (item: any, index: number) => {
  addEventRecord(`Grid事件 - 点击了第${index + 1}个项目`)
  console.log('Grid组件事件监听：', item, index)
}

/**
 * 网格项点击事件（GridItem 组件事件）
 */
const handleGridItemClick = (itemName: string) => {
  addEventRecord(`GridItem事件 - 点击了${itemName}`)
  console.log('GridItem组件事件监听：', itemName)
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
// 网格图片样式
.grid-image {
  width: 100%;
  height: 90px;
  display: inline-block;
  background-size: cover;
  vertical-align: middle;
  border-radius: 4px;
}

// 自定义图标样式
.custom-icon {
  height: 36px;
  width: 36px;
  border-radius: 4px;
}

// 自定义文字样式
.custom-text {
  color: #ffb300;
  margin-top: 8px;
  font-size: 14px;
}

// 自定义格子样式
:deep(.custom-item) {
  height: 80px !important;
  color: #e2231a;
  text-align: left !important;
  padding: 0 10px;
  background: #fff;
}

:deep(.wd-cell__value) {
  flex: 2;
}

:deep(.wd-cell__right) {
  flex: 2;
}
</style>
