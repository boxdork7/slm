<!-- Badge 徽章 http://127.0.0.1:100/#/pages-sub/demo/wd/badge -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Badge 徽章" show-back />

    <!-- 实时预览区域 -->
    <view class="mx-4 mt-4 border-2 border-purple-300 rounded-xl border-dashed bg-white p-4">
      <view class="mb-3 text-base font-medium">📱 实时预览</view>
      <view class="flex justify-center">
        <wd-badge
          :model-value="demoValue"
          :max="demoMax"
          :is-dot="demoDot"
          :show-zero="demoShowZero"
          :hidden="demoHidden"
          :type="demoType"
          :bg-color="demoBgColor"
        >
          <wd-button type="primary" size="small">消息</wd-button>
        </wd-badge>
      </view>
      <view class="mt-3 text-center text-sm text-gray-600">
        当前配置：{{ getCurrentConfig() }}
      </view>
    </view>

    <!-- 实时配置面板 -->
    <view class="mx-4 mt-4 rounded-xl bg-purple-50 p-4">
      <view class="mb-3 text-base text-purple-800 font-medium">⚙️ 实时配置</view>
      <view class="space-y-3">
        <!-- 数值配置 -->
        <view class="grid grid-cols-2 gap-4">
          <view class="flex items-center gap-2">
            <text class="text-sm text-purple-600">数值：</text>
            <input
              v-model="demoValue"
              type="number"
              class="flex-1 border rounded px-2 py-1 text-center"
              placeholder="0"
            >
          </view>
          <view class="flex items-center gap-2">
            <text class="text-sm text-purple-600">最大值：</text>
            <input
              v-model="demoMax"
              type="number"
              class="flex-1 border rounded px-2 py-1 text-center"
              placeholder="99"
            >
          </view>
        </view>

        <!-- 开关选项 -->
        <view class="grid grid-cols-3 gap-2">
          <wd-checkbox v-model="demoDot" size="small">点状徽章</wd-checkbox>
          <wd-checkbox v-model="demoShowZero" size="small">显示零值</wd-checkbox>
          <wd-checkbox v-model="demoHidden" size="small">隐藏徽章</wd-checkbox>
        </view>

        <!-- 类型选择 -->
        <view>
          <view class="mb-2 text-sm text-purple-600">类型选择：</view>
          <wd-radio-group v-model="demoType" direction="horizontal">
            <wd-radio value="">默认</wd-radio>
            <wd-radio value="primary">主要</wd-radio>
            <wd-radio value="success">成功</wd-radio>
            <wd-radio value="warning">警告</wd-radio>
            <wd-radio value="danger">危险</wd-radio>
            <wd-radio value="info">信息</wd-radio>
          </wd-radio-group>
        </view>

        <!-- 自定义颜色 -->
        <view>
          <view class="mb-2 text-sm text-purple-600">自定义颜色：</view>
          <view class="flex gap-2">
            <view
              v-for="color in presetColors"
              :key="color"
              :class="`w-8 h-8 rounded-full border-2 cursor-pointer ${demoBgColor === color ? 'border-gray-800' : 'border-gray-300'}`"
              :style="`background-color: ${color}`"
              @click="demoBgColor = color"
            />
            <view
              :class="`w-8 h-8 rounded-full border-2 cursor-pointer flex items-center justify-center text-xs ${!demoBgColor ? 'border-gray-800 bg-gray-100' : 'border-gray-300'}`"
              @click="demoBgColor = ''"
            >
              默认
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的徽章使用方式，显示数字或文本">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="数字徽章">
          <view class="flex gap-4">
            <wd-badge :model-value="5">
              <wd-button type="info" size="small">评论</wd-button>
            </wd-badge>
            <wd-badge :model-value="12">
              <wd-button type="info" size="small">回复</wd-button>
            </wd-badge>
            <wd-badge :model-value="108">
              <wd-button type="info" size="small">点赞</wd-button>
            </wd-badge>
          </view>
        </wd-cell>

        <wd-cell title="文本徽章">
          <view class="flex gap-4">
            <wd-badge model-value="new">
              <wd-button type="info" size="small">消息</wd-button>
            </wd-badge>
            <wd-badge model-value="hot">
              <wd-button type="info" size="small">活动</wd-button>
            </wd-badge>
            <wd-badge model-value="VIP">
              <wd-button type="info" size="small">会员</wd-button>
            </wd-badge>
          </view>
        </wd-cell>
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 数字徽章" :code="codes.basic.numberTemplate" />
        <DemoCode title="模板 - 文本徽章" :code="codes.basic.textTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 主题类型示例 -->
    <DemoSection title="主题类型" desc="不同主题颜色的徽章样式">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="预设主题">
          <view class="flex flex-wrap gap-3">
            <wd-badge :model-value="1" type="primary">
              <wd-button type="info" size="small">主要</wd-button>
            </wd-badge>
            <wd-badge :model-value="2" type="success">
              <wd-button type="info" size="small">成功</wd-button>
            </wd-badge>
            <wd-badge :model-value="3" type="warning">
              <wd-button type="info" size="small">警告</wd-button>
            </wd-badge>
            <wd-badge :model-value="4" type="danger">
              <wd-button type="info" size="small">危险</wd-button>
            </wd-badge>
            <wd-badge :model-value="5" type="info">
              <wd-button type="info" size="small">信息</wd-button>
            </wd-badge>
            <wd-badge :model-value="6">
              <wd-button type="info" size="small">默认</wd-button>
            </wd-badge>
          </view>
        </wd-cell>

        <wd-cell title="主题对比">
          <view class="space-y-3">
            <view class="flex items-center gap-3">
              <text class="w-12 text-sm">主要：</text>
              <wd-badge model-value="New" type="primary">
                <view class="rounded bg-gray-100 px-3 py-1">内容</view>
              </wd-badge>
            </view>
            <view class="flex items-center gap-3">
              <text class="w-12 text-sm">成功：</text>
              <wd-badge :model-value="8" type="success">
                <view class="rounded bg-gray-100 px-3 py-1">内容</view>
              </wd-badge>
            </view>
            <view class="flex items-center gap-3">
              <text class="w-12 text-sm">警告：</text>
              <wd-badge :model-value="99" type="warning">
                <view class="rounded bg-gray-100 px-3 py-1">内容</view>
              </wd-badge>
            </view>
          </view>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 预设主题" :code="codes.theme.presetTemplate" />
        <DemoCode title="模板 - 主题对比" :code="codes.theme.comparisonTemplate" />
        <DemoCode title="脚本 - 主题类型" :code="codes.theme.script" />
      </template>
    </DemoSection>

    <!-- 点状徽章示例 -->
    <DemoSection title="点状徽章" desc="不显示具体数值，只显示红点提示">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="基本点状">
          <view class="flex gap-4">
            <wd-badge is-dot>
              <wd-button type="info" size="small">消息</wd-button>
            </wd-badge>
            <wd-badge is-dot type="success">
              <wd-button type="info" size="small">在线</wd-button>
            </wd-badge>
            <wd-badge is-dot type="warning">
              <wd-button type="info" size="small">警告</wd-button>
            </wd-badge>
            <wd-badge is-dot type="danger">
              <wd-button type="info" size="small">错误</wd-button>
            </wd-badge>
          </view>
        </wd-cell>

        <wd-cell title="自定义内容">
          <view class="flex gap-4">
            <wd-badge is-dot bg-color="#8B5CF6">
              <view class="rounded bg-gray-100 px-3 py-1">自定义</view>
            </wd-badge>
            <wd-badge is-dot bg-color="#FF6B6B">
              <view class="h-10 w-10 flex items-center justify-center rounded-full bg-blue-100">
                <text class="text-sm">头像</text>
              </view>
            </wd-badge>
          </view>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 基本点状" :code="codes.dot.basicTemplate" />
        <DemoCode title="模板 - 自定义内容" :code="codes.dot.customTemplate" />
        <DemoCode title="脚本 - 点状徽章" :code="codes.dot.script" />
      </template>
    </DemoSection>

    <!-- 最大值限制示例 -->
    <DemoSection title="最大值限制" desc="超过最大值时显示 'max+' 格式">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="不同最大值">
          <view class="flex flex-wrap gap-4">
            <wd-badge :model-value="99" :max="99">
              <wd-button type="info" size="small">刚好99</wd-button>
            </wd-badge>
            <wd-badge :model-value="100" :max="99">
              <wd-button type="info" size="small">超出99</wd-button>
            </wd-badge>
            <wd-badge :model-value="999" :max="99">
              <wd-button type="info" size="small">很多消息</wd-button>
            </wd-badge>
            <wd-badge :model-value="50" :max="10">
              <wd-button type="info" size="small">超出10</wd-button>
            </wd-badge>
          </view>
        </wd-cell>

        <wd-cell title="常用场景">
          <view class="space-y-3">
            <view class="flex items-center gap-3">
              <text class="w-16 text-sm">购物车：</text>
              <wd-badge :model-value="15" :max="9" type="danger">
                <wd-button type="info" size="small">商品</wd-button>
              </wd-badge>
            </view>
            <view class="flex items-center gap-3">
              <text class="w-16 text-sm">消息：</text>
              <wd-badge :model-value="888" :max="99" type="primary">
                <wd-button type="info" size="small">未读</wd-button>
              </wd-badge>
            </view>
          </view>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 最大值限制" :code="codes.max.basicTemplate" />
        <DemoCode title="模板 - 常用场景" :code="codes.max.scenarioTemplate" />
        <DemoCode title="脚本 - 最大值配置" :code="codes.max.script" />
      </template>
    </DemoSection>

    <!-- 零值处理示例 -->
    <DemoSection title="零值处理" desc="控制是否显示数值为0的徽章">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="零值对比">
          <view class="space-y-3">
            <view class="flex items-center gap-3">
              <text class="w-20 text-sm">默认隐藏：</text>
              <wd-badge :model-value="0">
                <wd-button type="info" size="small">隐藏0</wd-button>
              </wd-badge>
            </view>
            <view class="flex items-center gap-3">
              <text class="w-20 text-sm">强制显示：</text>
              <wd-badge :model-value="0" show-zero>
                <wd-button type="info" size="small">显示0</wd-button>
              </wd-badge>
            </view>
            <view class="flex items-center gap-3">
              <text class="w-20 text-sm">点状模式：</text>
              <wd-badge :model-value="0" is-dot>
                <wd-button type="info" size="small">点状</wd-button>
              </wd-badge>
            </view>
          </view>
        </wd-cell>

        <wd-cell title="实际应用">
          <view class="flex gap-4">
            <wd-badge :model-value="unreadCount" show-zero type="primary">
              <wd-button type="info" size="small">未读消息</wd-button>
            </wd-badge>
            <wd-badge :model-value="cartCount" type="danger">
              <wd-button type="info" size="small">购物车</wd-button>
            </wd-badge>
          </view>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 零值对比" :code="codes.zero.comparisonTemplate" />
        <DemoCode title="模板 - 实际应用" :code="codes.zero.applicationTemplate" />
        <DemoCode title="脚本 - 零值处理" :code="codes.zero.script" />
      </template>
    </DemoSection>

    <!-- 自定义样式示例 -->
    <DemoSection title="自定义样式" desc="自定义颜色、位置等样式属性">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="自定义颜色">
          <view class="flex flex-wrap gap-4">
            <wd-badge :model-value="8" bg-color="#FF6B6B">
              <wd-button type="info" size="small">粉色</wd-button>
            </wd-badge>
            <wd-badge :model-value="9" bg-color="#8B5CF6">
              <wd-button type="info" size="small">紫色</wd-button>
            </wd-badge>
            <wd-badge :model-value="10" bg-color="linear-gradient(45deg, #FF6B6B, #4ECDC4)">
              <wd-button type="info" size="small">渐变</wd-button>
            </wd-badge>
            <wd-badge model-value="VIP" bg-color="#FFD700">
              <wd-button type="info" size="small">会员</wd-button>
            </wd-badge>
          </view>
        </wd-cell>

        <wd-cell title="自定义位置">
          <view class="flex gap-8">
            <wd-badge :model-value="1" top="10" right="10">
              <view class="h-16 w-16 flex items-center justify-center rounded bg-blue-100">
                <text class="text-sm">向内</text>
              </view>
            </wd-badge>
            <wd-badge :model-value="2" top="-5" right="-5">
              <view class="h-16 w-16 flex items-center justify-center rounded bg-green-100">
                <text class="text-sm">向外</text>
              </view>
            </wd-badge>
            <wd-badge :model-value="3" top="20">
              <view class="h-16 w-16 flex items-center justify-center rounded bg-purple-100">
                <text class="text-sm">下移</text>
              </view>
            </wd-badge>
          </view>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 自定义颜色" :code="codes.custom.colorTemplate" />
        <DemoCode title="模板 - 自定义位置" :code="codes.custom.positionTemplate" />
        <DemoCode title="脚本 - 自定义样式" :code="codes.custom.script" />
      </template>
    </DemoSection>

    <!-- 动态控制示例 -->
    <DemoSection title="动态控制" desc="动态控制徽章的显示、隐藏和数值变化">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <!-- 动态徽章 -->
        <wd-cell-group>
          <wd-cell title="动态徽章控制">
            <view class="flex items-center gap-4">
              <wd-badge :model-value="dynamicValue" :hidden="isHidden" type="primary">
                <wd-button type="info" size="small">动态徽章</wd-button>
              </wd-badge>
              <view class="flex gap-2">
                <wd-button size="small" @click="incrementValue">+1</wd-button>
                <wd-button size="small" @click="decrementValue">-1</wd-button>
                <wd-button size="small" @click="toggleHidden">
                  {{ isHidden ? '显示' : '隐藏' }}
                </wd-button>
                <wd-button size="small" @click="resetValue">重置</wd-button>
              </view>
            </view>
          </wd-cell>
        </wd-cell-group>

        <!-- 状态显示 -->
        <view class="mx-4 rounded-lg bg-blue-50 p-4">
          <view class="mb-2 text-sm text-blue-800 font-medium">📊 当前状态</view>
          <view class="text-sm text-blue-600 space-y-1">
            <view>当前数值：{{ dynamicValue }}</view>
            <view>显示状态：{{ isHidden ? '❌ 隐藏' : '✅ 显示' }}</view>
            <view>操作次数：{{ operationCount }}</view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 动态控制" :code="codes.dynamic.template" />
        <DemoCode title="脚本 - 动态方法" :code="codes.dynamic.script" />
        <DemoCode title="脚本 - 状态管理" :code="codes.dynamic.stateScript" />
      </template>
    </DemoSection>

    <!-- 实际应用场景 -->
    <DemoSection title="实际应用场景" desc="常见的业务场景和最佳实践">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <!-- 导航菜单场景 -->
        <view class="mx-4 border rounded-lg bg-white p-4">
          <view class="mb-3 text-sm font-medium">📱 移动端导航菜单</view>
          <view class="flex items-center justify-between">
            <text class="font-medium">导航菜单</text>
            <view class="flex gap-6">
              <wd-badge :model-value="messageCount" type="danger">
                <text class="text-gray-600">消息</text>
              </wd-badge>
              <wd-badge :model-value="notificationCount" type="warning">
                <text class="text-gray-600">通知</text>
              </wd-badge>
              <wd-badge is-dot type="success">
                <text class="text-gray-600">在线状态</text>
              </wd-badge>
            </view>
          </view>
        </view>

        <!-- 功能按钮场景 -->
        <view class="mx-4 border rounded-lg bg-white p-4">
          <view class="mb-3 text-sm font-medium">🛒 电商功能按钮</view>
          <view class="flex items-center justify-between">
            <text class="font-medium">功能按钮</text>
            <view class="flex gap-3">
              <wd-badge :model-value="cartItems" :max="99" type="danger">
                <wd-button type="info" size="small">购物车</wd-button>
              </wd-badge>
              <wd-badge model-value="NEW" bg-color="#FF6B6B">
                <wd-button type="info" size="small">活动</wd-button>
              </wd-badge>
              <wd-badge is-dot type="warning">
                <wd-button type="info" size="small">设置</wd-button>
              </wd-badge>
            </view>
          </view>
        </view>

        <!-- 列表项场景 -->
        <view class="mx-4 border rounded-lg bg-white p-4">
          <view class="mb-3 text-sm font-medium">👥 用户列表</view>
          <view class="space-y-3">
            <view
              v-for="item in listItems"
              :key="item.id"
              class="flex items-center justify-between border-b border-gray-100 pb-2 last:border-b-0"
            >
              <view class="flex items-center gap-3">
                <view class="h-10 w-10 flex items-center justify-center rounded-full bg-blue-100">
                  <text class="text-sm">{{ item.avatar }}</text>
                </view>
                <view>
                  <view class="font-medium">{{ item.name }}</view>
                  <view class="text-sm text-gray-500">{{ item.desc }}</view>
                </view>
              </view>
              <wd-badge
                :model-value="item.count"
                :type="item.type"
                :is-dot="item.isDot"
                :show-zero="item.showZero"
              >
                <view class="h-8 w-8" />
              </wd-badge>
            </view>
          </view>
        </view>

        <!-- 最佳实践 -->
        <view class="mx-4 rounded-lg bg-green-50 p-4">
          <view class="mb-2 text-sm text-green-800 font-medium">⭐ 最佳实践</view>
          <view class="text-sm text-green-600 space-y-1">
            <view>• 数字徽章：用于显示具体数量，如消息数、购物车商品数</view>
            <view>• 点状徽章：用于状态提示，如在线状态、新功能提示</view>
            <view>• 文本徽章：用于显示状态标签，如 "NEW"、"HOT"、"VIP"</view>
            <view>• 合理设置最大值，避免显示过大的数字影响美观</view>
            <view>• 根据重要程度选择合适的颜色主题</view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 导航菜单" :code="codes.scenarios.navigationTemplate" />
        <DemoCode title="模板 - 功能按钮" :code="codes.scenarios.buttonTemplate" />
        <DemoCode title="模板 - 列表项" :code="codes.scenarios.listTemplate" />
        <DemoCode title="脚本 - 应用场景" :code="codes.scenarios.script" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" />
  </view>
</template>

<script setup lang="ts">
import type { BadgeType } from '@/wd/components/wd-badge/wd-badge.vue'
import { ref } from 'vue'

// ===== 组件状态管理 =====

// 实时配置状态
const demoValue = ref<number | string>(5)
const demoMax = ref<number>(99)
const demoDot = ref<boolean>(false)
const demoShowZero = ref<boolean>(false)
const demoHidden = ref<boolean>(false)
const demoType = ref<BadgeType>('primary')
const demoBgColor = ref<string>('')

// 预设颜色
const presetColors = ref<string[]>([
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEAA7',
  '#DDA0DD',
  '#F8BBD9',
  '#B19CD9',
])

// 动态控制状态
const dynamicValue = ref<number>(1)
const isHidden = ref<boolean>(false)
const operationCount = ref<number>(0)

// 业务场景数据
const messageCount = ref<number>(3)
const notificationCount = ref<number>(12)
const cartItems = ref<number>(99)
const unreadCount = ref<number>(0)
const cartCount = ref<number>(5)

// 列表项数据
interface ListItem {
  id: number
  name: string
  desc: string
  avatar: string
  count: number
  type: BadgeType
  isDot: boolean
  showZero: boolean
}

const listItems = ref<ListItem[]>([
  {
    id: 1,
    name: '张三',
    desc: '产品经理',
    avatar: '张',
    count: 3,
    type: 'danger',
    isDot: false,
    showZero: false,
  },
  {
    id: 2,
    name: '李四',
    desc: '前端开发',
    avatar: '李',
    count: 0,
    type: 'success',
    isDot: true,
    showZero: false,
  },
  {
    id: 3,
    name: '王五',
    desc: '后端开发',
    avatar: '王',
    count: 12,
    type: 'warning',
    isDot: false,
    showZero: false,
  },
  {
    id: 4,
    name: '赵六',
    desc: 'UI设计师',
    avatar: '赵',
    count: 0,
    type: 'info',
    isDot: false,
    showZero: true,
  },
])

// ===== 计算属性 =====

/**
 * 获取当前配置描述
 */
const getCurrentConfig = (): string => {
  const config: string[] = []
  if (demoValue.value) config.push(`值:${demoValue.value}`)
  if (demoMax.value && demoMax.value !== 99) config.push(`最大:${demoMax.value}`)
  if (demoDot.value) config.push('点状')
  if (demoShowZero.value) config.push('显示0')
  if (demoHidden.value) config.push('隐藏')
  if (demoType.value) config.push(`类型:${demoType.value}`)
  if (demoBgColor.value) config.push('自定义颜色')
  return config.length ? config.join(', ') : '默认配置'
}

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    numberTemplate: `<wd-badge :model-value="5">
  <wd-button type="info" size="small">评论</wd-button>
</wd-badge>

<wd-badge :model-value="12">
  <wd-button type="info" size="small">回复</wd-button>
</wd-badge>

<wd-badge :model-value="108">
  <wd-button type="info" size="small">点赞</wd-button>
</wd-badge>`,

    textTemplate: `<wd-badge model-value="new">
  <wd-button type="info" size="small">消息</wd-button>
</wd-badge>

<wd-badge model-value="hot">
  <wd-button type="info" size="small">活动</wd-button>
</wd-badge>

<wd-badge model-value="VIP">
  <wd-button type="info" size="small">会员</wd-button>
</wd-badge>`,

    script: `import { ref } from 'vue'

// 数字类型
const commentCount = ref(5)
const replyCount = ref(12)
const likeCount = ref(108)

// 文本类型
const messageStatus = ref('new')
const activityStatus = ref('hot')
const memberLevel = ref('VIP')`,
  },

  // 主题类型代码
  theme: {
    presetTemplate: `<wd-badge :model-value="1" type="primary">
  <wd-button type="info" size="small">主要</wd-button>
</wd-badge>

<wd-badge :model-value="2" type="success">
  <wd-button type="info" size="small">成功</wd-button>
</wd-badge>

<wd-badge :model-value="3" type="warning">
  <wd-button type="info" size="small">警告</wd-button>
</wd-badge>

<wd-badge :model-value="4" type="danger">
  <wd-button type="info" size="small">危险</wd-button>
</wd-badge>

<wd-badge :model-value="5" type="info">
  <wd-button type="info" size="small">信息</wd-button>
</wd-badge>`,

    comparisonTemplate: `<wd-badge model-value="New" type="primary">
  <view class="px-3 py-1 bg-gray-100 rounded">内容</view>
</wd-badge>

<wd-badge :model-value="8" type="success">
  <view class="px-3 py-1 bg-gray-100 rounded">内容</view>
</wd-badge>

<wd-badge :model-value="99" type="warning">
  <view class="px-3 py-1 bg-gray-100 rounded">内容</view>
</wd-badge>`,

    script: `import type { BadgeType } from '@/wd/components/wd-badge/wd-badge.vue'

const badgeType = ref<BadgeType>('primary')
const badgeValue = ref(1)

// 主题颜色对应的场景
const themeScenarios = {
  primary: '重要信息',
  success: '成功状态',
  warning: '警告提醒',
  danger: '错误或紧急',
  info: '一般信息'
}`,
  },

  // 点状徽章代码
  dot: {
    basicTemplate: `<wd-badge is-dot>
  <wd-button type="info" size="small">消息</wd-button>
</wd-badge>

<wd-badge is-dot type="success">
  <wd-button type="info" size="small">在线</wd-button>
</wd-badge>

<wd-badge is-dot type="warning">
  <wd-button type="info" size="small">警告</wd-button>
</wd-badge>

<wd-badge is-dot type="danger">
  <wd-button type="info" size="small">错误</wd-button>
</wd-badge>`,

    customTemplate: `<wd-badge is-dot bg-color="#8B5CF6">
  <view class="rounded bg-gray-100 px-3 py-1">自定义内容</view>
</wd-badge>

<wd-badge is-dot bg-color="#FF6B6B">
  <view class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
    <text class="text-sm">头像</text>
  </view>
</wd-badge>`,

    script: `const isDotMode = ref(true)
const dotColor = ref('#8B5CF6')

// 点状徽章常用场景
const dotScenarios = [
  { type: 'success', desc: '在线状态' },
  { type: 'warning', desc: '新消息提醒' },
  { type: 'danger', desc: '错误状态' },
  { color: '#8B5CF6', desc: '自定义状态' }
]`,
  },

  // 最大值限制代码
  max: {
    basicTemplate: `<wd-badge :model-value="99" :max="99">
  <wd-button type="info" size="small">刚好99</wd-button>
</wd-badge>

<wd-badge :model-value="100" :max="99">
  <wd-button type="info" size="small">超出99</wd-button>
</wd-badge>

<wd-badge :model-value="999" :max="99">
  <wd-button type="info" size="small">很多消息</wd-button>
</wd-badge>`,

    scenarioTemplate: `<!-- 购物车场景 -->
<wd-badge :model-value="cartItems" :max="9" type="danger">
  <wd-button type="info" size="small">商品</wd-button>
</wd-badge>

<!-- 消息场景 -->
<wd-badge :model-value="messageCount" :max="99" type="primary">
  <wd-button type="info" size="small">未读</wd-button>
</wd-badge>`,

    script: `const cartItems = ref(15)
const messageCount = ref(888)
const maxCartDisplay = ref(9)
const maxMessageDisplay = ref(99)

// 常用的最大值设置
const commonMaxValues = {
  cart: 9,        // 购物车通常显示个位数
  message: 99,    // 消息通常显示两位数
  notification: 999  // 通知可以显示三位数
}`,
  },

  // 零值处理代码
  zero: {
    comparisonTemplate: `<!-- 默认隐藏0值 -->
<wd-badge :model-value="0">
  <wd-button type="info" size="small">隐藏0</wd-button>
</wd-badge>

<!-- 强制显示0值 -->
<wd-badge :model-value="0" show-zero>
  <wd-button type="info" size="small">显示0</wd-button>
</wd-badge>

<!-- 点状模式（忽略数值） -->
<wd-badge :model-value="0" is-dot>
  <wd-button type="info" size="small">点状</wd-button>
</wd-badge>`,

    applicationTemplate: `<!-- 未读消息（强制显示0） -->
<wd-badge :model-value="unreadCount" show-zero type="primary">
  <wd-button type="info" size="small">未读消息</wd-button>
</wd-badge>

<!-- 购物车（默认隐藏0） -->
<wd-badge :model-value="cartCount" type="danger">
  <wd-button type="info" size="small">购物车</wd-button>
</wd-badge>`,

    script: `const unreadCount = ref(0)
const cartCount = ref(5)
const showZeroValue = ref(false)

// 零值处理策略
const zeroValueStrategy = {
  message: true,    // 消息数量需要显示0
  cart: false,      // 购物车为空时隐藏
  notification: false, // 通知为0时隐藏
  todo: true        // 待办事项显示0表示已完成
}`,
  },

  // 自定义样式代码
  custom: {
    colorTemplate: `<wd-badge :model-value="8" bg-color="#FF6B6B">
  <wd-button type="info" size="small">粉色</wd-button>
</wd-badge>

<wd-badge :model-value="9" bg-color="#8B5CF6">
  <wd-button type="info" size="small">紫色</wd-button>
</wd-badge>

<wd-badge :model-value="10" bg-color="linear-gradient(45deg, #FF6B6B, #4ECDC4)">
  <wd-button type="info" size="small">渐变</wd-button>
</wd-badge>

<wd-badge model-value="VIP" bg-color="#FFD700">
  <wd-button type="info" size="small">会员</wd-button>
</wd-badge>`,

    positionTemplate: `<!-- 向内偏移 -->
<wd-badge :model-value="1" top="10" right="10">
  <view class="h-16 w-16 flex items-center justify-center rounded bg-blue-100">
    <text class="text-sm">向内</text>
  </view>
</wd-badge>

<!-- 向外偏移 -->
<wd-badge :model-value="2" top="-5" right="-5">
  <view class="h-16 w-16 flex items-center justify-center rounded bg-green-100">
    <text class="text-sm">向外</text>
  </view>
</wd-badge>

<!-- 向下偏移 -->
<wd-badge :model-value="3" top="20">
  <view class="h-16 w-16 flex items-center justify-center rounded bg-purple-100">
    <text class="text-sm">下移</text>
  </view>
</wd-badge>`,

    script: `const customBgColor = ref('#FF6B6B')
const customTop = ref(0)
const customRight = ref(0)

// 常用自定义颜色
const brandColors = {
  primary: '#007aff',
  success: '#28a745',
  warning: '#ffc107',
  danger: '#dc3545',
  pink: '#FF6B6B',
  purple: '#8B5CF6',
  gradient: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)'
}

// 位置调整配置
const positionConfig = {
  inner: { top: 10, right: 10 },
  outer: { top: -5, right: -5 },
  bottom: { top: 20, right: 0 },
  left: { top: 0, right: 20 }
}`,
  },

  // 动态控制代码
  dynamic: {
    template: `<wd-badge :model-value="dynamicValue" :hidden="isHidden" type="primary">
  <wd-button type="info" size="small">动态徽章</wd-button>
</wd-badge>

<view class="flex gap-2">
  <wd-button size="small" @click="incrementValue">+1</wd-button>
  <wd-button size="small" @click="decrementValue">-1</wd-button>
  <wd-button size="small" @click="toggleHidden">
    {{ isHidden ? '显示' : '隐藏' }}
  </wd-button>
  <wd-button size="small" @click="resetValue">重置</wd-button>
</view>`,

    script: `const dynamicValue = ref(1)
const isHidden = ref(false)
const operationCount = ref(0)

const incrementValue = () => {
  dynamicValue.value++
  operationCount.value++
}

const decrementValue = () => {
  if (dynamicValue.value > 0) {
    dynamicValue.value--
    operationCount.value++
  }
}

const toggleHidden = () => {
  isHidden.value = !isHidden.value
  operationCount.value++
}

const resetValue = () => {
  dynamicValue.value = 1
  isHidden.value = false
  operationCount.value++
}`,

    stateScript: `// 监听数值变化
watch(dynamicValue, (newVal, oldVal) => {
  console.log(\`徽章数值从 \${oldVal} 变为 \${newVal}\`)
})

// 监听显示状态变化
watch(isHidden, (newVal) => {
  console.log(\`徽章\${newVal ? '隐藏' : '显示'}\`)
})

// 计算属性：徽章状态描述
const badgeStatus = computed(() => {
  if (isHidden.value) return '隐藏状态'
  if (dynamicValue.value === 0) return '零值状态'
  if (dynamicValue.value > 99) return '超大值状态'
  return '正常显示'
})`,
  },

  // 应用场景代码
  scenarios: {
    navigationTemplate: `<!-- 移动端导航菜单 -->
<view class="flex items-center justify-between">
  <text class="font-medium">导航菜单</text>
  <view class="flex gap-6">
    <wd-badge :model-value="messageCount" type="danger">
      <text class="text-gray-600">消息</text>
    </wd-badge>
    <wd-badge :model-value="notificationCount" type="warning">
      <text class="text-gray-600">通知</text>
    </wd-badge>
    <wd-badge is-dot type="success">
      <text class="text-gray-600">在线状态</text>
    </wd-badge>
  </view>
</view>`,

    buttonTemplate: `<!-- 电商功能按钮 -->
<view class="flex gap-3">
  <wd-badge :model-value="cartItems" :max="99" type="danger">
    <wd-button type="info" size="small">购物车</wd-button>
  </wd-badge>
  <wd-badge model-value="NEW" bg-color="#FF6B6B">
    <wd-button type="info" size="small">活动</wd-button>
  </wd-badge>
  <wd-badge is-dot type="warning">
    <wd-button type="info" size="small">设置</wd-button>
  </wd-badge>
</view>`,

    listTemplate: `<!-- 用户列表项 -->
<view
  v-for="item in listItems"
  :key="item.id"
  class="flex items-center justify-between border-b pb-2"
>
  <view class="flex items-center gap-3">
    <view class="h-10 w-10 flex items-center justify-center rounded-full bg-blue-100">
      <text class="text-sm">{{ item.avatar }}</text>
    </view>
    <view>
      <view class="font-medium">{{ item.name }}</view>
      <view class="text-sm text-gray-500">{{ item.desc }}</view>
    </view>
  </view>
  <wd-badge
    :model-value="item.count"
    :type="item.type"
    :is-dot="item.isDot"
    :show-zero="item.showZero"
  >
    <view class="h-8 w-8" />
  </wd-badge>
</view>`,

    script: `// 业务场景数据
const messageCount = ref(3)
const notificationCount = ref(12)
const cartItems = ref(99)

// 列表数据
const listItems = ref([
  {
    id: 1,
    name: '张三',
    desc: '产品经理',
    avatar: '张',
    count: 3,
    type: 'danger',
    isDot: false,
    showZero: false,
  },
  {
    id: 2,
    name: '李四',
    desc: '前端开发',
    avatar: '李',
    count: 0,
    type: 'success',
    isDot: true,
    showZero: false,
  },
  // ... 更多数据
])

// 业务逻辑方法
const updateMessageCount = (count) => {
  messageCount.value = count
}

const addToCart = () => {
  cartItems.value++
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'model-value',
    type: 'String | Number',
    default: '""',
    desc: '显示值，可以是数字或文本',
  },
  {
    name: 'max',
    type: 'Number',
    default: '-',
    desc: '最大值，超过最大值会显示 "{max}+"',
  },
  {
    name: 'is-dot',
    type: 'Boolean',
    default: 'false',
    desc: '是否为红色点状标注',
  },
  {
    name: 'show-zero',
    type: 'Boolean',
    default: 'false',
    desc: '当数值为 0 时，是否展示徽标',
  },
  {
    name: 'hidden',
    type: 'Boolean',
    default: 'false',
    desc: '是否隐藏徽章',
  },
  {
    name: 'type',
    type: 'String',
    default: '""',
    desc: '徽章类型，可选值：primary / success / warning / danger / info',
  },
  {
    name: 'bg-color',
    type: 'String',
    default: '""',
    desc: '自定义背景颜色，支持任何合法的 color 值',
  },
  {
    name: 'top',
    type: 'String | Number',
    default: '-',
    desc: '设置徽章相对于内容元素顶部的偏移量',
  },
  {
    name: 'right',
    type: 'String | Number',
    default: '-',
    desc: '设置徽章相对于内容元素右侧的偏移量',
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

// ===== 事件处理方法 =====

/**
 * 增加动态数值
 */
const incrementValue = () => {
  dynamicValue.value++
  operationCount.value++
  console.log(`徽章数值增加到：${dynamicValue.value}`)
}

/**
 * 减少动态数值
 */
const decrementValue = () => {
  if (dynamicValue.value > 0) {
    dynamicValue.value--
    operationCount.value++
    console.log(`徽章数值减少到：${dynamicValue.value}`)
  }
}

/**
 * 切换显示隐藏状态
 */
const toggleHidden = () => {
  isHidden.value = !isHidden.value
  operationCount.value++
  console.log(`徽章${isHidden.value ? '隐藏' : '显示'}`)
}

/**
 * 重置动态数值
 */
const resetValue = () => {
  dynamicValue.value = 1
  isHidden.value = false
  operationCount.value++
  console.log('徽章数值已重置')
}

const scroll = useScroll()

onShow(() => {
  scroll.resetScrollTop() // 页面显示时重置，避免页面切换时状态错误
})
onPageScroll((e) => {
  scroll.updateScrollTop(e.scrollTop)
})
</script>
