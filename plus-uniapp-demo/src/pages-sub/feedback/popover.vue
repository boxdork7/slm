<!-- Popover 气泡 http://127.0.0.1:100/#/pages-sub/demo/wd/popover -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Popover 气泡" show-back />
    <wd-toast />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的气泡提示，点击触发显示">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <wd-cell title="基本气泡" vertical>
          <view class="text-center">
            <wd-popover
              v-model="basicShow"
              content="这是一段提示内容"
              placement="bottom"
              @change="handleBasicChange"
            >
              <wd-button size="small">点击展示</wd-button>
            </wd-popover>
          </view>
        </wd-cell>

        <wd-cell title="长文本提示" vertical>
          <view class="text-center">
            <wd-popover
              v-model="longTextShow"
              content="这是一段比较长的提示内容，用于演示气泡组件对长文本的处理效果"
              placement="top"
              @change="handleLongTextChange"
            >
              <wd-button size="small" type="primary">长文本提示</wd-button>
            </wd-popover>
          </view>
        </wd-cell>

        <wd-cell title="无箭头气泡" vertical>
          <view class="text-center">
            <wd-popover
              v-model="noArrowShow"
              content="无箭头的气泡提示"
              placement="top"
              :visible-arrow="false"
              @change="handleNoArrowChange"
            >
              <wd-button size="small" type="success">无箭头</wd-button>
            </wd-popover>
          </view>
        </wd-cell>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基本气泡" :code="codes.basic.basicTemplate" />
        <DemoCode title="模板 - 长文本提示" :code="codes.basic.longTextTemplate" />
        <DemoCode title="模板 - 无箭头气泡" :code="codes.basic.noArrowTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 弹出位置示例 -->
    <DemoSection title="弹出位置" desc="支持12个方向的弹出位置">
      <!-- 位置选择器 -->
      <view class="mb-4">
        <wd-cell title="选择弹出位置" vertical>
          <wd-radio-group v-model="currentPlacement" inline shape="dot">
            <wd-radio
              v-for="pos in placements"
              :key="pos.value"
              :value="pos.value"
              custom-class="h-8 leading-8 mr-2 mb-2"
            >
              <wd-text :text="pos.label" />
            </wd-radio>
          </wd-radio-group>
        </wd-cell>
      </view>

      <!-- 位置演示 -->
      <view class="space-y-4">
        <view class="py-8 text-center">
          <wd-popover
            v-model="placementShow"
            content="弹出位置演示"
            :placement="currentPlacement"
            @change="handlePlacementChange"
          >
            <wd-button type="warning">{{ currentPlacement }} 位置</wd-button>
          </wd-popover>
        </view>

        <!-- 位置说明 -->
        <view class="mx-4 rounded-lg bg-blue-50 p-3">
          <view class="text-sm text-blue-600">
            💡 当前选择：<text class="font-medium">{{ currentPlacement }}</text>
          </view>
          <view class="mt-1 text-xs text-gray-500">
            支持 top、bottom、left、right 四个基本方向，每个方向支持 start、center、end 三种对齐方式
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 位置演示" :code="codes.placement.template" />
        <DemoCode title="脚本 - 位置配置" :code="codes.placement.script" />
      </template>
    </DemoSection>

    <!-- 菜单模式示例 -->
    <DemoSection title="菜单模式" desc="以菜单形式展示多个操作选项">
      <view class="space-y-4">
        <wd-cell title="基本菜单" vertical>
          <view class="text-center">
            <wd-popover
              v-model="menuShow"
              mode="menu"
              :content="basicMenu"
              placement="bottom"
              @menuclick="handleMenuClick"
              @change="handleMenuChange"
            >
              <wd-button>操作菜单</wd-button>
            </wd-popover>
          </view>
        </wd-cell>

        <wd-cell title="带图标菜单" vertical>
          <view class="text-center">
            <wd-popover
              v-model="iconMenuShow"
              mode="menu"
              :content="iconMenu"
              placement="bottom-start"
              @menuclick="handleIconMenuClick"
              @change="handleIconMenuChange"
            >
              <wd-button type="primary">带图标菜单</wd-button>
            </wd-popover>
          </view>
        </wd-cell>

        <wd-cell title="更多操作" vertical>
          <view class="text-center">
            <wd-popover
              v-model="moreMenuShow"
              mode="menu"
              :content="moreMenu"
              placement="top"
              @menuclick="handleMoreMenuClick"
              @change="handleMoreMenuChange"
            >
              <wd-button type="success">更多操作</wd-button>
            </wd-popover>
          </view>
        </wd-cell>
      </view>

      <template #codes>
        <DemoCode title="模板 - 基本菜单" :code="codes.menu.basicTemplate" />
        <DemoCode title="模板 - 带图标菜单" :code="codes.menu.iconTemplate" />
        <DemoCode title="脚本 - 菜单配置" :code="codes.menu.script" />
      </template>
    </DemoSection>

    <!-- 自定义内容示例 -->
    <DemoSection title="自定义内容" desc="使用插槽自定义气泡内容样式">
      <view class="space-y-4">
        <wd-cell title="自定义样式" vertical>
          <view class="text-center">
            <wd-popover
              v-model="customShow"
              use-content-slot
              placement="bottom"
              @change="handleCustomChange"
            >
              <template #content>
                <view class="w-48 rounded from-purple-400 to-pink-400 bg-gradient-to-r p-4 text-white">
                  <view class="text-center text-sm font-medium">自定义样式</view>
                  <view class="mt-2 text-xs">这是一个自定义样式的气泡内容</view>
                </view>
              </template>
              <wd-button type="primary">自定义样式</wd-button>
            </wd-popover>
          </view>
        </wd-cell>

        <wd-cell title="卡片样式" vertical>
          <view class="text-center">
            <wd-popover
              v-model="cardShow"
              use-content-slot
              placement="top"
              @change="handleCardChange"
            >
              <template #content>
                <view class="w-56 rounded-lg bg-white p-4 shadow-lg">
                  <view class="mb-2 flex items-center">
                    <view class="h-8 w-8 rounded-full bg-blue-500" />
                    <view class="ml-2">
                      <view class="text-sm font-medium">用户信息</view>
                      <view class="text-xs text-gray-500">在线状态</view>
                    </view>
                  </view>
                  <view class="text-xs text-gray-600">
                    这是一个卡片样式的气泡提示，可以展示更丰富的内容。
                  </view>
                </view>
              </template>
              <wd-button type="warning">卡片样式</wd-button>
            </wd-popover>
          </view>
        </wd-cell>

        <wd-cell title="表单样式" vertical>
          <view class="text-center">
            <wd-popover
              v-model="formShow"
              use-content-slot
              placement="bottom-end"
              @change="handleFormChange"
            >
              <template #content>
                <view class="w-64 rounded bg-white p-4">
                  <view class="mb-3 text-sm font-medium">快速操作</view>
                  <view class="space-y-2">
                    <wd-button size="small" type="primary" block @click="handleQuickAction('edit')">
                      编辑
                    </wd-button>
                    <wd-button size="small" type="warning" block @click="handleQuickAction('copy')">
                      复制
                    </wd-button>
                    <wd-button size="small" type="error" block @click="handleQuickAction('delete')">
                      删除
                    </wd-button>
                  </view>
                </view>
              </template>
              <wd-button>表单样式</wd-button>
            </wd-popover>
          </view>
        </wd-cell>
      </view>

      <template #codes>
        <DemoCode title="模板 - 自定义样式" :code="codes.custom.styleTemplate" />
        <DemoCode title="模板 - 卡片样式" :code="codes.custom.cardTemplate" />
        <DemoCode title="模板 - 表单样式" :code="codes.custom.formTemplate" />
        <DemoCode title="脚本 - 自定义内容" :code="codes.custom.script" />
      </template>
    </DemoSection>

    <!-- 控制方式示例 -->
    <DemoSection title="控制方式" desc="不同的显示控制和交互方式">
      <view class="space-y-4">
        <wd-cell title="手动控制" vertical>
          <view class="flex justify-center gap-3">
            <wd-popover
              ref="manualPopoverRef"
              v-model="manualShow"
              content="手动控制的气泡"
              placement="top"
              @change="handleManualChange"
            >
              <wd-button size="small">手动控制</wd-button>
            </wd-popover>
            <wd-button size="small" type="primary" @click="openManual">打开</wd-button>
            <wd-button size="small" type="warning" @click="closeManual">关闭</wd-button>
          </view>
        </wd-cell>

        <wd-cell title="禁用状态" vertical>
          <view class="text-center">
            <wd-popover
              v-model="disabledShow"
              content="这个气泡被禁用了"
              placement="bottom"
              :disabled="isDisabled"
              @change="handleDisabledChange"
            >
              <wd-button :disabled="isDisabled">
                {{ isDisabled ? '已禁用' : '可点击' }}
              </wd-button>
            </wd-popover>
            <view class="mt-2">
              <wd-button size="small" @click="toggleDisabled">
                {{ isDisabled ? '启用' : '禁用' }}
              </wd-button>
            </view>
          </view>
        </wd-cell>

        <wd-cell title="带关闭按钮" vertical>
          <view class="text-center">
            <wd-popover
              v-model="closeButtonShow"
              content="这个气泡有关闭按钮，可以点击 X 关闭"
              placement="bottom"
              :show-close="true"
              @change="handleCloseButtonChange"
            >
              <wd-button type="error">带关闭按钮</wd-button>
            </wd-popover>
          </view>
        </wd-cell>
      </view>

      <template #codes>
        <DemoCode title="模板 - 手动控制" :code="codes.control.manualTemplate" />
        <DemoCode title="模板 - 禁用状态" :code="codes.control.disabledTemplate" />
        <DemoCode title="模板 - 带关闭按钮" :code="codes.control.closeTemplate" />
        <DemoCode title="脚本 - 控制方式" :code="codes.control.script" />
      </template>
    </DemoSection>

    <!-- 事件监听示例 -->
    <DemoSection title="事件监听" desc="监听气泡的各种事件">
      <!-- 状态显示区域 -->
      <view class="space-y-4">
        <wd-cell title="事件监听演示" vertical>
          <view class="text-center">
            <wd-popover
              v-model="eventShow"
              content="观察下方事件日志"
              placement="bottom"
              @open="handleEventOpen"
              @close="handleEventClose"
              @change="handleEventChange"
            >
              <wd-button type="primary">事件监听</wd-button>
            </wd-popover>
          </view>
        </wd-cell>

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
      <view class="space-y-4">
        <!-- 用户信息卡片 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">用户信息卡片</view>
          <view class="mx-4 rounded-lg bg-gray-50 p-4">
            <view class="text-center">
              <wd-popover
                v-model="userCardShow"
                use-content-slot
                placement="bottom"
                @change="handleUserCardChange"
              >
                <template #content>
                  <view class="w-64 rounded-lg bg-white p-4 shadow-lg">
                    <view class="flex items-center">
                      <view class="h-12 w-12 flex items-center justify-center rounded-full bg-blue-500">
                        <text class="text-white font-medium">用</text>
                      </view>
                      <view class="ml-3 flex-1">
                        <view class="text-sm font-medium">{{ userInfo.name }}</view>
                        <view class="text-xs text-gray-500">{{ userInfo.role }}</view>
                      </view>
                      <view class="text-xs text-green-500">在线</view>
                    </view>
                    <view class="mt-3 text-xs text-gray-600">
                      {{ userInfo.description }}
                    </view>
                    <view class="mt-3 flex gap-2">
                      <wd-button size="small" type="primary" @click="sendMessage">发消息</wd-button>
                      <wd-button size="small" @click="viewProfile">查看资料</wd-button>
                    </view>
                  </view>
                </template>
                <view class="inline-flex cursor-pointer items-center">
                  <view class="mr-2 h-8 w-8 rounded-full bg-blue-500" />
                  <text class="text-blue-600">{{ userInfo.name }}</text>
                </view>
              </wd-popover>
            </view>
          </view>
        </view>

        <!-- 操作菜单 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">操作菜单</view>
          <view class="mx-4 rounded-lg bg-blue-50 p-4">
            <view class="flex items-center justify-between">
              <view>
                <view class="text-sm font-medium">重要文档.pdf</view>
                <view class="text-xs text-gray-500">大小：2.3MB 修改时间：2024-01-15</view>
              </view>
              <wd-popover
                v-model="fileMenuShow"
                mode="menu"
                :content="fileMenu"
                placement="bottom-end"
                @menuclick="handleFileMenuClick"
                @change="handleFileMenuChange"
              >
                <wd-button size="small">···</wd-button>
              </wd-popover>
            </view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 用户信息卡片" :code="codes.scenarios.userCardTemplate" />
        <DemoCode title="脚本 - 用户信息处理" :code="codes.scenarios.userCardScript" />
        <DemoCode title="模板 - 操作菜单" :code="codes.scenarios.fileMenuTemplate" />
        <DemoCode title="脚本 - 操作菜单处理" :code="codes.scenarios.fileMenuScript" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PlacementType, PopoverInstance } from '@/wd/components/wd-popover/wd-popover.vue'
import { useToast } from '@/wd'

// ===== 组件状态管理 =====

// Toast 实例
const toast = useToast()

// 基本用法状态
const basicShow = ref<boolean>(false)
const longTextShow = ref<boolean>(false)
const noArrowShow = ref<boolean>(false)

// 弹出位置状态
const currentPlacement = ref<PlacementType>('bottom')
const placementShow = ref<boolean>(false)

// 菜单模式状态
const menuShow = ref<boolean>(false)
const iconMenuShow = ref<boolean>(false)
const moreMenuShow = ref<boolean>(false)

// 自定义内容状态
const customShow = ref<boolean>(false)
const cardShow = ref<boolean>(false)
const formShow = ref<boolean>(false)

// 控制方式状态
const manualShow = ref<boolean>(false)
const disabledShow = ref<boolean>(false)
const closeButtonShow = ref<boolean>(false)
const isDisabled = ref<boolean>(false)

// 事件监听状态
const eventShow = ref<boolean>(false)

// 应用场景状态
const userCardShow = ref<boolean>(false)
const fileMenuShow = ref<boolean>(false)

// 组件引用
const manualPopoverRef = ref<PopoverInstance>()

// 事件日志状态
interface EventLog {
  time: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

const eventLogs = ref<EventLog[]>([])

// ===== 数据配置 =====

// 弹出位置选项
const placements = ref([
  { value: 'top', label: 'top' },
  { value: 'top-start', label: 'top-start' },
  { value: 'top-end', label: 'top-end' },
  { value: 'bottom', label: 'bottom' },
  { value: 'bottom-start', label: 'bottom-start' },
  { value: 'bottom-end', label: 'bottom-end' },
  { value: 'left', label: 'left' },
  { value: 'left-start', label: 'left-start' },
  { value: 'left-end', label: 'left-end' },
  { value: 'right', label: 'right' },
  { value: 'right-start', label: 'right-start' },
  { value: 'right-end', label: 'right-end' },
])

// 菜单配置
const basicMenu = ref([
  { content: '复制' },
  { content: '粘贴' },
  { content: '删除' },
])

const iconMenu = ref([
  { iconClass: 'read', content: '全部标记已读' },
  { iconClass: 'delete', content: '清空最近会话' },
  { iconClass: 'detection', content: '消息订阅设置' },
  { iconClass: 'subscribe', content: '消息异常检测' },
])

const moreMenu = ref([
  { iconClass: 'edit', content: '编辑' },
  { iconClass: 'share', content: '分享' },
  { iconClass: 'star', content: '收藏' },
  { iconClass: 'setting', content: '设置' },
  { iconClass: 'help', content: '帮助' },
])

const fileMenu = ref([
  { iconClass: 'download', content: '下载' },
  { iconClass: 'share', content: '分享' },
  { iconClass: 'edit', content: '重命名' },
  { iconClass: 'copy', content: '复制' },
  { iconClass: 'delete', content: '删除' },
])

// 用户信息
const userInfo = ref({
  name: '张小明',
  role: '前端工程师',
  description: '专注于前端开发，熟悉Vue、React等主流框架，有丰富的项目经验。',
})

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    basicTemplate: `<wd-popover
  v-model="basicShow"
  content="这是一段提示内容"
  placement="bottom"
  @change="handleBasicChange"
>
  <wd-button size="small">点击展示</wd-button>
</wd-popover>`,

    longTextTemplate: `<wd-popover
  v-model="longTextShow"
  content="这是一段比较长的提示内容，用于演示气泡组件对长文本的处理效果"
  placement="top"
  @change="handleLongTextChange"
>
  <wd-button size="small" type="primary">长文本提示</wd-button>
</wd-popover>`,

    noArrowTemplate: `<wd-popover
  v-model="noArrowShow"
  content="无箭头的气泡提示"
  placement="top"
  :visible-arrow="false"
  @change="handleNoArrowChange"
>
  <wd-button size="small" type="success">无箭头</wd-button>
</wd-popover>`,

    script: `import { ref } from 'vue'

const basicShow = ref(false)
const longTextShow = ref(false)
const noArrowShow = ref(false)

const handleBasicChange = ({ show }) => {
  console.log('基本气泡状态变化：', show)
}

const handleLongTextChange = ({ show }) => {
  console.log('长文本气泡状态变化：', show)
}

const handleNoArrowChange = ({ show }) => {
  console.log('无箭头气泡状态变化：', show)
}`,
  },

  // 弹出位置代码
  placement: {
    template: `<wd-popover
  v-model="placementShow"
  content="弹出位置演示"
  :placement="currentPlacement"
  @change="handlePlacementChange"
>
  <wd-button type="warning">{{ currentPlacement }} 位置</wd-button>
</wd-popover>

<!-- 位置选择 -->
<wd-radio-group v-model="currentPlacement" inline shape="dot">
  <wd-radio
    v-for="pos in placements"
    :key="pos.value"
    :value="pos.value"
  >
    <wd-text :text="pos.label" />
  </wd-radio>
</wd-radio-group>`,

    script: `import type { PlacementType } from '@/wd/components/wd-popover/wd-popover.vue'

const currentPlacement = ref<PlacementType>('bottom')
const placementShow = ref(false)

const placements = [
  { value: 'top', label: 'top' },
  { value: 'top-start', label: 'top-start' },
  { value: 'top-end', label: 'top-end' },
  { value: 'bottom', label: 'bottom' },
  { value: 'bottom-start', label: 'bottom-start' },
  { value: 'bottom-end', label: 'bottom-end' },
  { value: 'left', label: 'left' },
  { value: 'left-start', label: 'left-start' },
  { value: 'left-end', label: 'left-end' },
  { value: 'right', label: 'right' },
  { value: 'right-start', label: 'right-start' },
  { value: 'right-end', label: 'right-end' },
]`,
  },

  // 菜单模式代码
  menu: {
    basicTemplate: `<wd-popover
  v-model="menuShow"
  mode="menu"
  :content="basicMenu"
  placement="bottom"
  @menuclick="handleMenuClick"
  @change="handleMenuChange"
>
  <wd-button>操作菜单</wd-button>
</wd-popover>`,

    iconTemplate: `<wd-popover
  v-model="iconMenuShow"
  mode="menu"
  :content="iconMenu"
  placement="bottom-start"
  @menuclick="handleIconMenuClick"
  @change="handleIconMenuChange"
>
  <wd-button type="primary">带图标菜单</wd-button>
</wd-popover>`,

    script: `// 菜单配置
const basicMenu = ref([
  { content: '复制' },
  { content: '粘贴' },
  { content: '删除' },
])

const iconMenu = ref([
  { iconClass: 'read', content: '全部标记已读' },
  { iconClass: 'delete', content: '清空最近会话' },
  { iconClass: 'detection', content: '消息订阅设置' },
  { iconClass: 'subscribe', content: '消息异常检测' },
])

// 菜单点击处理
const handleMenuClick = ({ item, index }) => {
  console.log('菜单点击：', item.content, index)
  toast.show(\`选择了\${item.content}\`)
}

const handleIconMenuClick = ({ item, index }) => {
  console.log('图标菜单点击：', item.content, index)
  toast.show(\`选择了\${item.content}\`)
}`,
  },

  // 自定义内容代码
  custom: {
    styleTemplate: `<wd-popover
  v-model="customShow"
  use-content-slot
  placement="bottom"
  @change="handleCustomChange"
>
  <template #content>
    <view class="w-48 rounded bg-gradient-to-r from-purple-400 to-pink-400 p-4 text-white">
      <view class="text-center text-sm font-medium">自定义样式</view>
      <view class="mt-2 text-xs">这是一个自定义样式的气泡内容</view>
    </view>
  </template>
  <wd-button type="primary">自定义样式</wd-button>
</wd-popover>`,

    cardTemplate: `<wd-popover
  v-model="cardShow"
  use-content-slot
  placement="top"
  @change="handleCardChange"
>
  <template #content>
    <view class="w-56 rounded-lg bg-white p-4 shadow-lg">
      <view class="mb-2 flex items-center">
        <view class="h-8 w-8 rounded-full bg-blue-500"></view>
        <view class="ml-2">
          <view class="text-sm font-medium">用户信息</view>
          <view class="text-xs text-gray-500">在线状态</view>
        </view>
      </view>
      <view class="text-xs text-gray-600">
        这是一个卡片样式的气泡提示，可以展示更丰富的内容。
      </view>
    </view>
  </template>
  <wd-button type="warning">卡片样式</wd-button>
</wd-popover>`,

    formTemplate: `<wd-popover
  v-model="formShow"
  use-content-slot
  placement="bottom-end"
  @change="handleFormChange"
>
  <template #content>
    <view class="w-64 rounded bg-white p-4">
      <view class="mb-3 text-sm font-medium">快速操作</view>
      <view class="space-y-2">
        <wd-button size="small" type="primary" block @click="handleQuickAction('edit')">
          编辑
        </wd-button>
        <wd-button size="small" type="warning" block @click="handleQuickAction('copy')">
          复制
        </wd-button>
        <wd-button size="small" type="error" block @click="handleQuickAction('delete')">
          删除
        </wd-button>
      </view>
    </view>
  </template>
  <wd-button>表单样式</wd-button>
</wd-popover>`,

    script: `const customShow = ref(false)
const cardShow = ref(false)
const formShow = ref(false)

const handleCustomChange = ({ show }) => {
  console.log('自定义样式气泡状态变化：', show)
}

const handleCardChange = ({ show }) => {
  console.log('卡片样式气泡状态变化：', show)
}

const handleFormChange = ({ show }) => {
  console.log('表单样式气泡状态变化：', show)
}

const handleQuickAction = (action) => {
  formShow.value = false
  console.log('快速操作：', action)
  toast.show(\`执行了\${action}操作\`)
}`,
  },

  // 控制方式代码
  control: {
    manualTemplate: `<wd-popover
  ref="manualPopoverRef"
  v-model="manualShow"
  content="手动控制的气泡"
  placement="top"
  @change="handleManualChange"
>
  <wd-button size="small">手动控制</wd-button>
</wd-popover>
<wd-button size="small" type="primary" @click="openManual">打开</wd-button>
<wd-button size="small" type="warning" @click="closeManual">关闭</wd-button>`,

    disabledTemplate: `<wd-popover
  v-model="disabledShow"
  content="这个气泡被禁用了"
  placement="bottom"
  :disabled="isDisabled"
  @change="handleDisabledChange"
>
  <wd-button :disabled="isDisabled">
    {{ isDisabled ? '已禁用' : '可点击' }}
  </wd-button>
</wd-popover>
<wd-button size="small" @click="toggleDisabled">
  {{ isDisabled ? '启用' : '禁用' }}
</wd-button>`,

    closeTemplate: `<wd-popover
  v-model="closeButtonShow"
  content="这个气泡有关闭按钮，可以点击 X 关闭"
  placement="bottom"
  :show-close="true"
  @change="handleCloseButtonChange"
>
  <wd-button type="error">带关闭按钮</wd-button>
</wd-popover>`,

    script: `import type { PopoverInstance } from '@/wd/components/wd-popover/wd-popover.vue'

const manualShow = ref(false)
const isDisabled = ref(false)
const closeButtonShow = ref(false)
const manualPopoverRef = ref<PopoverInstance>()

const openManual = () => {
  manualPopoverRef.value?.open()
}

const closeManual = () => {
  manualPopoverRef.value?.close()
}

const toggleDisabled = () => {
  isDisabled.value = !isDisabled.value
}

const handleManualChange = ({ show }) => {
  console.log('手动控制气泡状态变化：', show)
}`,
  },

  // 事件监听代码
  events: {
    template: `<wd-popover
  v-model="eventShow"
  content="观察下方事件日志"
  placement="bottom"
  @open="handleEventOpen"
  @close="handleEventClose"
  @change="handleEventChange"
>
  <wd-button type="primary">事件监听</wd-button>
</wd-popover>`,

    script: `const eventShow = ref(false)
const eventLogs = ref([])

const handleEventOpen = () => {
  addEventLog('气泡打开', 'success')
}

const handleEventClose = () => {
  addEventLog('气泡关闭', 'warning')
}

const handleEventChange = ({ show }) => {
  addEventLog(\`气泡状态变化：\${show ? '显示' : '隐藏'}\`, 'info')
}

const addEventLog = (message, type = 'info') => {
  eventLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
    type
  })
}`,
  },

  // 应用场景代码
  scenarios: {
    userCardTemplate: `<wd-popover
  v-model="userCardShow"
  use-content-slot
  placement="bottom"
  @change="handleUserCardChange"
>
  <template #content>
    <view class="w-64 rounded-lg bg-white p-4 shadow-lg">
      <view class="flex items-center">
        <view class="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
          <text class="text-white font-medium">用</text>
        </view>
        <view class="ml-3 flex-1">
          <view class="text-sm font-medium">{{ userInfo.name }}</view>
          <view class="text-xs text-gray-500">{{ userInfo.role }}</view>
        </view>
        <view class="text-xs text-green-500">在线</view>
      </view>
      <view class="mt-3 text-xs text-gray-600">
        {{ userInfo.description }}
      </view>
      <view class="mt-3 flex gap-2">
        <wd-button size="small" type="primary" @click="sendMessage">发消息</wd-button>
        <wd-button size="small" @click="viewProfile">查看资料</wd-button>
      </view>
    </view>
  </template>
  <view class="inline-flex items-center cursor-pointer">
    <view class="h-8 w-8 rounded-full bg-blue-500 mr-2"></view>
    <text class="text-blue-600">{{ userInfo.name }}</text>
  </view>
</wd-popover>`,

    userCardScript: `const userInfo = ref({
  name: '张小明',
  role: '前端工程师',
  description: '专注于前端开发，熟悉Vue、React等主流框架，有丰富的项目经验。',
})

const sendMessage = () => {
  userCardShow.value = false
  toast.show('发送消息')
}

const viewProfile = () => {
  userCardShow.value = false
  toast.show('查看用户资料')
}`,

    fileMenuTemplate: `<wd-popover
  v-model="fileMenuShow"
  mode="menu"
  :content="fileMenu"
  placement="bottom-end"
  @menuclick="handleFileMenuClick"
  @change="handleFileMenuChange"
>
  <wd-button size="small">···</wd-button>
</wd-popover>`,

    fileMenuScript: `const fileMenu = ref([
  { iconClass: 'download', content: '下载' },
  { iconClass: 'share', content: '分享' },
  { iconClass: 'edit', content: '重命名' },
  { iconClass: 'copy', content: '复制' },
  { iconClass: 'delete', content: '删除' },
])

const handleFileMenuClick = ({ item, index }) => {
  console.log('文件操作：', item.content, index)
  toast.show(\`执行了\${item.content}操作\`)
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
    desc: '控制 popover 的显示状态',
  },
  {
    name: 'content',
    type: 'String | Array',
    default: '""',
    desc: '显示的内容，也可以通过 slot#content 传入',
  },
  {
    name: 'placement',
    type: 'PlacementType',
    default: '"bottom"',
    desc: '指定 popover 的放置位置',
  },
  {
    name: 'visible-arrow',
    type: 'Boolean',
    default: 'true',
    desc: '是否显示 popover 箭头',
  },
  {
    name: 'offset',
    type: 'Number',
    default: '0',
    desc: '偏移量',
  },
  {
    name: 'use-content-slot',
    type: 'Boolean',
    default: 'false',
    desc: '是否使用内容插槽',
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: '是否禁用 popover',
  },
  {
    name: 'show-close',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示关闭按钮',
  },
  {
    name: 'mode',
    type: 'String',
    default: '"normal"',
    desc: '显示模式：normal（普通模式）/ menu（菜单模式）',
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
    name: 'custom-arrow',
    type: 'String',
    default: '""',
    desc: '自定义箭头样式类',
  },
  {
    name: 'custom-pop',
    type: 'String',
    default: '""',
    desc: '自定义弹出层样式类',
  },
]

// Methods 方法文档
const apiMethods = [
  {
    name: 'open()',
    desc: '打开 popover',
  },
  {
    name: 'close()',
    desc: '关闭 popover',
  },
]

// Events 事件文档
const apiEvents = [
  {
    name: 'update:modelValue',
    desc: '显示状态更新时触发',
  },
  {
    name: 'change',
    desc: '显示状态变化时触发，参数为 { show: boolean }',
  },
  {
    name: 'open',
    desc: '打开时触发',
  },
  {
    name: 'close',
    desc: '关闭时触发',
  },
  {
    name: 'menuclick',
    desc: '菜单项点击时触发，参数为 { item: object, index: number }',
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

// ===== 基本用法事件处理 =====

/**
 * 基本气泡状态变化
 */
const handleBasicChange = ({ show }: { show: boolean }) => {
  addEventLog(`基本气泡状态变化：${show ? '显示' : '隐藏'}`, 'info')
}

/**
 * 长文本气泡状态变化
 */
const handleLongTextChange = ({ show }: { show: boolean }) => {
  addEventLog(`长文本气泡状态变化：${show ? '显示' : '隐藏'}`, 'info')
}

/**
 * 无箭头气泡状态变化
 */
const handleNoArrowChange = ({ show }: { show: boolean }) => {
  addEventLog(`无箭头气泡状态变化：${show ? '显示' : '隐藏'}`, 'info')
}

// ===== 弹出位置事件处理 =====

/**
 * 位置演示气泡状态变化
 */
const handlePlacementChange = ({ show }: { show: boolean }) => {
  addEventLog(`位置演示气泡状态变化：${show ? '显示' : '隐藏'}`, 'info')
}

// ===== 菜单模式事件处理 =====

/**
 * 基本菜单点击处理
 */
const handleMenuClick = ({ item, index }: { item: any; index: number }) => {
  addEventLog(`基本菜单点击：${item.content}（索引：${index}）`, 'success')
  toast.show(`选择了${item.content}`)
}

/**
 * 基本菜单状态变化
 */
const handleMenuChange = ({ show }: { show: boolean }) => {
  addEventLog(`基本菜单状态变化：${show ? '显示' : '隐藏'}`, 'info')
}

/**
 * 图标菜单点击处理
 */
const handleIconMenuClick = ({ item, index }: { item: any; index: number }) => {
  addEventLog(`图标菜单点击：${item.content}（索引：${index}）`, 'success')
  toast.show(`选择了${item.content}`)
}

/**
 * 图标菜单状态变化
 */
const handleIconMenuChange = ({ show }: { show: boolean }) => {
  addEventLog(`图标菜单状态变化：${show ? '显示' : '隐藏'}`, 'info')
}

/**
 * 更多菜单点击处理
 */
const handleMoreMenuClick = ({ item, index }: { item: any; index: number }) => {
  addEventLog(`更多菜单点击：${item.content}（索引：${index}）`, 'success')
  toast.show(`选择了${item.content}`)
}

/**
 * 更多菜单状态变化
 */
const handleMoreMenuChange = ({ show }: { show: boolean }) => {
  addEventLog(`更多菜单状态变化：${show ? '显示' : '隐藏'}`, 'info')
}

// ===== 自定义内容事件处理 =====

/**
 * 自定义样式气泡状态变化
 */
const handleCustomChange = ({ show }: { show: boolean }) => {
  addEventLog(`自定义样式气泡状态变化：${show ? '显示' : '隐藏'}`, 'info')
}

/**
 * 卡片样式气泡状态变化
 */
const handleCardChange = ({ show }: { show: boolean }) => {
  addEventLog(`卡片样式气泡状态变化：${show ? '显示' : '隐藏'}`, 'info')
}

/**
 * 表单样式气泡状态变化
 */
const handleFormChange = ({ show }: { show: boolean }) => {
  addEventLog(`表单样式气泡状态变化：${show ? '显示' : '隐藏'}`, 'info')
}

/**
 * 快速操作处理
 */
const handleQuickAction = (action: string) => {
  formShow.value = false
  addEventLog(`快速操作：${action}`, 'success')
  toast.show(`执行了${action}操作`)
}

// ===== 控制方式事件处理 =====

/**
 * 手动打开气泡
 */
const openManual = () => {
  manualPopoverRef.value?.open()
  addEventLog('手动打开气泡', 'success')
}

/**
 * 手动关闭气泡
 */
const closeManual = () => {
  manualPopoverRef.value?.close()
  addEventLog('手动关闭气泡', 'warning')
}

/**
 * 切换禁用状态
 */
const toggleDisabled = () => {
  isDisabled.value = !isDisabled.value
  addEventLog(`${isDisabled.value ? '禁用' : '启用'}气泡`, 'info')
}

/**
 * 手动控制气泡状态变化
 */
const handleManualChange = ({ show }: { show: boolean }) => {
  addEventLog(`手动控制气泡状态变化：${show ? '显示' : '隐藏'}`, 'info')
}

/**
 * 禁用状态气泡状态变化
 */
const handleDisabledChange = ({ show }: { show: boolean }) => {
  addEventLog(`禁用状态气泡状态变化：${show ? '显示' : '隐藏'}`, 'info')
}

/**
 * 带关闭按钮气泡状态变化
 */
const handleCloseButtonChange = ({ show }: { show: boolean }) => {
  addEventLog(`带关闭按钮气泡状态变化：${show ? '显示' : '隐藏'}`, 'info')
}

// ===== 事件监听处理 =====

/**
 * 事件监听气泡打开
 */
const handleEventOpen = () => {
  addEventLog('事件监听气泡打开', 'success')
}

/**
 * 事件监听气泡关闭
 */
const handleEventClose = () => {
  addEventLog('事件监听气泡关闭', 'warning')
}

/**
 * 事件监听气泡状态变化
 */
const handleEventChange = ({ show }: { show: boolean }) => {
  addEventLog(`事件监听气泡状态变化：${show ? '显示' : '隐藏'}`, 'info')
}

// ===== 应用场景事件处理 =====

/**
 * 用户信息卡片状态变化
 */
const handleUserCardChange = ({ show }: { show: boolean }) => {
  addEventLog(`用户信息卡片状态变化：${show ? '显示' : '隐藏'}`, 'info')
}

/**
 * 发送消息
 */
const sendMessage = () => {
  userCardShow.value = false
  addEventLog('发送消息给用户', 'success')
  toast.show('发送消息')
}

/**
 * 查看用户资料
 */
const viewProfile = () => {
  userCardShow.value = false
  addEventLog('查看用户资料', 'info')
  toast.show('查看用户资料')
}

/**
 * 文件菜单点击处理
 */
const handleFileMenuClick = ({ item, index }: { item: any; index: number }) => {
  addEventLog(`文件操作：${item.content}（索引：${index}）`, 'success')
  toast.show(`执行了${item.content}操作`)
}

/**
 * 文件菜单状态变化
 */
const handleFileMenuChange = ({ show }: { show: boolean }) => {
  addEventLog(`文件菜单状态变化：${show ? '显示' : '隐藏'}`, 'info')
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
// 确保气泡不被遮挡
:deep(.wd-popover) {
  z-index: 1000;
}
</style>
