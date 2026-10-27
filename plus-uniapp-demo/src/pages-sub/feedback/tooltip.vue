<!-- Tooltip 文字提示 http://127.0.0.1:100/#/pages-sub/demo/wd/tooltip -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Tooltip 文字提示" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的用法，点击触发元素显示提示信息">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <view class="flex flex-wrap justify-center gap-4">
          <wd-tooltip content="这是一个基本的提示信息" @open="handleTooltipOpen('基本提示')" @close="handleTooltipClose('基本提示')">
            <wd-button>基本提示</wd-button>
          </wd-tooltip>

          <wd-tooltip v-model="basicTooltip" content="点击按钮切换显示状态" @change="handleTooltipChange">
            <wd-button type="success">受控提示</wd-button>
          </wd-tooltip>

          <wd-tooltip content="这是一个较长的提示信息，用于展示文字换行效果和布局调整">
            <wd-button type="info">长文本提示</wd-button>
          </wd-tooltip>
        </view>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基本用法" :code="codes.basic.template" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 位置方向示例 -->
    <DemoSection title="位置方向" desc="支持12个不同的位置方向">
      <view class="space-y-6">
        <!-- 上方位置 -->
        <view>
          <view class="mb-3 text-sm text-gray-700 font-medium">上方位置</view>
          <view class="flex justify-center gap-4">
            <wd-tooltip content="顶部左侧" placement="top-start" @open="handlePositionOpen('top-start')">
              <wd-button size="small">上左</wd-button>
            </wd-tooltip>
            <wd-tooltip content="顶部居中" placement="top" @open="handlePositionOpen('top')">
              <wd-button size="small">上中</wd-button>
            </wd-tooltip>
            <wd-tooltip content="顶部右侧" placement="top-end" @open="handlePositionOpen('top-end')">
              <wd-button size="small">上右</wd-button>
            </wd-tooltip>
          </view>
        </view>

        <!-- 左右位置 -->
        <view>
          <view class="mb-3 text-sm text-gray-700 font-medium">左右位置</view>
          <view class="flex items-center justify-between">
            <view class="flex flex-col gap-2">
              <wd-tooltip content="左侧上方" placement="left-start" @open="handlePositionOpen('left-start')">
                <wd-button size="small">左上</wd-button>
              </wd-tooltip>
              <wd-tooltip content="左侧居中" placement="left" @open="handlePositionOpen('left')">
                <wd-button size="small">左中</wd-button>
              </wd-tooltip>
              <wd-tooltip content="左侧下方" placement="left-end" @open="handlePositionOpen('left-end')">
                <wd-button size="small">左下</wd-button>
              </wd-tooltip>
            </view>
            <view class="flex flex-col gap-2">
              <wd-tooltip content="右侧上方" placement="right-start" @open="handlePositionOpen('right-start')">
                <wd-button size="small">右上</wd-button>
              </wd-tooltip>
              <wd-tooltip content="右侧居中" placement="right" @open="handlePositionOpen('right')">
                <wd-button size="small">右中</wd-button>
              </wd-tooltip>
              <wd-tooltip content="右侧下方" placement="right-end" @open="handlePositionOpen('right-end')">
                <wd-button size="small">右下</wd-button>
              </wd-tooltip>
            </view>
          </view>
        </view>

        <!-- 下方位置 -->
        <view>
          <view class="mb-3 text-sm text-gray-700 font-medium">下方位置</view>
          <view class="flex justify-center gap-4">
            <wd-tooltip content="底部左侧" placement="bottom-start" @open="handlePositionOpen('bottom-start')">
              <wd-button size="small">下左</wd-button>
            </wd-tooltip>
            <wd-tooltip content="底部居中" placement="bottom" @open="handlePositionOpen('bottom')">
              <wd-button size="small">下中</wd-button>
            </wd-tooltip>
            <wd-tooltip content="底部右侧" placement="bottom-end" @open="handlePositionOpen('bottom-end')">
              <wd-button size="small">下右</wd-button>
            </wd-tooltip>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 位置方向" :code="codes.placement.template" />
        <DemoCode title="脚本 - 位置方向" :code="codes.placement.script" />
      </template>
    </DemoSection>

    <!-- 箭头显示示例 -->
    <DemoSection title="箭头显示" desc="控制提示框箭头的显示和隐藏">
      <view class="space-y-4">
        <view class="flex flex-wrap justify-center gap-4">
          <wd-tooltip content="显示箭头的提示框" :visible-arrow="true">
            <wd-button>显示箭头</wd-button>
          </wd-tooltip>

          <wd-tooltip content="隐藏箭头的提示框" :visible-arrow="false">
            <wd-button type="warning">隐藏箭头</wd-button>
          </wd-tooltip>

          <wd-tooltip content="自定义箭头样式" custom-arrow="custom-arrow-style">
            <wd-button type="error">自定义箭头</wd-button>
          </wd-tooltip>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 箭头显示" :code="codes.arrow.template" />
        <DemoCode title="样式 - 自定义箭头" :code="codes.arrow.style" />
        <DemoCode title="脚本 - 箭头显示" :code="codes.arrow.script" />
      </template>
    </DemoSection>

    <!-- 偏移量示例 -->
    <DemoSection title="偏移量设置" desc="设置提示框相对于触发元素的偏移量">
      <view class="space-y-4">
        <view class="flex flex-wrap justify-center gap-4">
          <wd-tooltip content="无偏移" placement="top" :offset="0">
            <wd-button>无偏移</wd-button>
          </wd-tooltip>

          <wd-tooltip content="数字偏移" placement="top" :offset="20">
            <wd-button type="success">数字偏移</wd-button>
          </wd-tooltip>

          <wd-tooltip content="数组偏移" placement="top" :offset="[10, 20]">
            <wd-button type="info">数组偏移</wd-button>
          </wd-tooltip>

          <wd-tooltip content="对象偏移" placement="top" :offset="{ x: 15, y: 10 }">
            <wd-button type="warning">对象偏移</wd-button>
          </wd-tooltip>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 偏移量设置" :code="codes.offset.template" />
        <DemoCode title="脚本 - 偏移量设置" :code="codes.offset.script" />
      </template>
    </DemoSection>

    <!-- 自定义内容示例 -->
    <DemoSection title="自定义内容" desc="通过插槽自定义提示内容和样式">
      <view class="space-y-4">
        <view class="flex flex-wrap justify-center gap-4">
          <wd-tooltip use-content-slot>
            <template #content>
              <view class="custom-tooltip-content">
                <view class="text-white font-bold">自定义标题</view>
                <view class="mt-1 text-sm text-gray-200">这里是自定义的提示内容，可以包含更丰富的样式和布局</view>
              </view>
            </template>
            <wd-button>自定义内容</wd-button>
          </wd-tooltip>

          <wd-tooltip use-content-slot custom-pop="custom-pop-style">
            <template #content>
              <view class="custom-rich-content">
                <wd-icon name="info" size="16" color="#1890ff" />
                <text class="ml-2">图标 + 文字组合</text>
              </view>
            </template>
            <wd-button type="success">富文本内容</wd-button>
          </wd-tooltip>

          <wd-tooltip use-content-slot>
            <template #content>
              <view class="rounded from-purple-500 to-pink-500 bg-gradient-to-r p-3 text-white">
                <view class="text-center">渐变背景提示</view>
              </view>
            </template>
            <wd-button type="error">渐变样式</wd-button>
          </wd-tooltip>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 自定义内容" :code="codes.custom.template" />
        <DemoCode title="样式 - 自定义内容" :code="codes.custom.style" />
        <DemoCode title="脚本 - 自定义内容" :code="codes.custom.script" />
      </template>
    </DemoSection>

    <!-- 禁用状态示例 -->
    <DemoSection title="禁用状态" desc="禁用提示框功能">
      <view class="space-y-4">
        <view class="flex flex-wrap justify-center gap-4">
          <wd-tooltip content="正常状态的提示" :disabled="false">
            <wd-button>正常状态</wd-button>
          </wd-tooltip>

          <wd-tooltip content="禁用状态的提示" :disabled="true">
            <wd-button type="info">禁用状态</wd-button>
          </wd-tooltip>

          <wd-tooltip content="动态控制禁用状态" :disabled="dynamicDisabled">
            <wd-button type="warning">{{ dynamicDisabled ? '已禁用' : '已启用' }}</wd-button>
          </wd-tooltip>

          <wd-button size="small" @click="toggleDisabled">
            {{ dynamicDisabled ? '启用' : '禁用' }}提示
          </wd-button>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 禁用状态" :code="codes.disabled.template" />
        <DemoCode title="脚本 - 禁用状态" :code="codes.disabled.script" />
      </template>
    </DemoSection>

    <!-- 关闭按钮示例 -->
    <DemoSection title="关闭按钮" desc="显示关闭按钮，支持手动关闭">
      <view class="space-y-4">
        <view class="flex flex-wrap justify-center gap-4">
          <wd-tooltip
            v-model="closeableTooltip1"
            content="这个提示框包含关闭按钮，点击右上角的 × 号可以关闭"
            show-close
            @close="handleCloseableClose('关闭按钮提示1')"
          >
            <wd-button>带关闭按钮</wd-button>
          </wd-tooltip>

          <wd-tooltip
            v-model="closeableTooltip2"
            use-content-slot
            show-close
            @close="handleCloseableClose('关闭按钮提示2')"
          >
            <template #content>
              <view class="p-2">
                <view class="font-bold">重要提示</view>
                <view class="mt-1 text-sm">这是一个需要用户主动关闭的重要提示信息</view>
              </view>
            </template>
            <wd-button type="error">重要提示</wd-button>
          </wd-tooltip>
        </view>

        <view class="flex justify-center gap-2">
          <wd-button size="small" @click="reopenCloseableTooltips">重新打开所有</wd-button>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 关闭按钮" :code="codes.closeable.template" />
        <DemoCode title="脚本 - 关闭按钮" :code="codes.closeable.script" />
      </template>
    </DemoSection>

    <!-- 编程式控制示例 -->
    <DemoSection title="编程式控制" desc="通过组件方法控制提示框的显示和隐藏">
      <view class="space-y-4">
        <view class="flex flex-wrap justify-center gap-4">
          <wd-tooltip
            ref="programmaticTooltip"
            content="通过编程方式控制的提示框"
            @open="handleProgrammaticOpen"
            @close="handleProgrammaticClose"
          >
            <wd-button>编程式控制</wd-button>
          </wd-tooltip>
        </view>

        <view class="flex flex-wrap justify-center gap-2">
          <wd-button size="small" @click="openProgrammatic">打开提示</wd-button>
          <wd-button size="small" @click="closeProgrammatic">关闭提示</wd-button>
          <wd-button size="small" type="warning" @click="toggleProgrammatic">切换状态</wd-button>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 编程式控制" :code="codes.programmatic.template" />
        <DemoCode title="脚本 - 编程式控制" :code="codes.programmatic.script" />
      </template>
    </DemoSection>

    <!-- 交互演示示例 -->
    <DemoSection title="交互演示" desc="记录用户操作并提供实时反馈">
      <view class="space-y-4">
        <!-- 演示提示框 -->
        <view class="flex flex-wrap justify-center gap-4">
          <wd-tooltip
            content="演示提示框1"
            @open="handleDemoOpen('演示提示框1')"
            @close="handleDemoClose('演示提示框1')"
            @change="handleDemoChange"
          >
            <wd-button>演示提示1</wd-button>
          </wd-tooltip>

          <wd-tooltip
            content="演示提示框2"
            placement="top"
            @open="handleDemoOpen('演示提示框2')"
            @close="handleDemoClose('演示提示框2')"
          >
            <wd-button type="success">演示提示2</wd-button>
          </wd-tooltip>

          <wd-tooltip
            v-model="demoTooltip3"
            content="演示提示框3"
            show-close
            @open="handleDemoOpen('演示提示框3')"
            @close="handleDemoClose('演示提示框3')"
          >
            <wd-button type="warning">演示提示3</wd-button>
          </wd-tooltip>
        </view>

        <!-- 统计信息 -->
        <view class="rounded-lg bg-blue-50 p-3">
          <view class="text-sm text-blue-600">
            打开次数：{{ openCount }} | 关闭次数：{{ closeCount }} | 最后操作：{{ lastTooltipOperation || '无' }}
          </view>
        </view>

        <!-- 操作记录 -->
        <view>
          <view class="mb-2 flex items-center justify-between">
            <view class="text-sm text-gray-700 font-medium">操作记录</view>
            <wd-button size="small" @click="clearRecords">清空记录</wd-button>
          </view>
          <view class="h-32 overflow-y-auto border border-gray-200 rounded bg-white p-2">
            <view
              v-for="(record, index) in operationRecords"
              :key="index"
              class="mb-1 text-sm"
              :class="getRecordColor(record.type)"
            >
              [{{ record.time }}] {{ record.message }}
            </view>
            <view
              v-if="operationRecords.length === 0"
              class="py-4 text-center text-sm text-gray-400"
            >
              暂无操作记录，点击任意按钮开始测试
            </view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 交互演示" :code="codes.interactive.template" />
        <DemoCode title="脚本 - 交互逻辑" :code="codes.interactive.script" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// ===== 组件状态管理 =====

// 各种状态控制
const basicTooltip = ref<boolean>(false)
const dynamicDisabled = ref<boolean>(false)
const closeableTooltip1 = ref<boolean>(false)
const closeableTooltip2 = ref<boolean>(false)
const demoTooltip3 = ref<boolean>(false)

// 编程式控制的引用
const programmaticTooltip = ref()

// 交互统计
const openCount = ref<number>(0)
const closeCount = ref<number>(0)
const lastTooltipOperation = ref<string>('')

// 操作记录
interface OperationRecord {
  time: string
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
}

const operationRecords = ref<OperationRecord[]>([])

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    template: `<!-- 基本提示 -->
<wd-tooltip content="这是一个基本的提示信息" @open="handleTooltipOpen('基本提示')" @close="handleTooltipClose('基本提示')">
  <wd-button>基本提示</wd-button>
</wd-tooltip>

<!-- 受控提示 -->
<wd-tooltip content="点击按钮切换显示状态" v-model="basicTooltip" @change="handleTooltipChange">
  <wd-button type="success">受控提示</wd-button>
</wd-tooltip>

<!-- 长文本提示 -->
<wd-tooltip content="这是一个较长的提示信息，用于展示文字换行效果和布局调整">
  <wd-button type="info">长文本提示</wd-button>
</wd-tooltip>`,

    script: `const basicTooltip = ref(false)

const handleTooltipOpen = (name: string) => {
  console.log('提示框打开：', name)
}

const handleTooltipClose = (name: string) => {
  console.log('提示框关闭：', name)
}

const handleTooltipChange = (data: { show: boolean }) => {
  console.log('提示框状态变化：', data.show)
}`,
  },

  // 位置方向代码
  placement: {
    template: `<!-- 上方位置 -->
<wd-tooltip content="顶部左侧" placement="top-start" @open="handlePositionOpen('top-start')">
  <wd-button size="small">上左</wd-button>
</wd-tooltip>
<wd-tooltip content="顶部居中" placement="top" @open="handlePositionOpen('top')">
  <wd-button size="small">上中</wd-button>
</wd-tooltip>
<wd-tooltip content="顶部右侧" placement="top-end" @open="handlePositionOpen('top-end')">
  <wd-button size="small">上右</wd-button>
</wd-tooltip>

<!-- 左右位置 -->
<wd-tooltip content="左侧居中" placement="left" @open="handlePositionOpen('left')">
  <wd-button size="small">左中</wd-button>
</wd-tooltip>
<wd-tooltip content="右侧居中" placement="right" @open="handlePositionOpen('right')">
  <wd-button size="small">右中</wd-button>
</wd-tooltip>

<!-- 下方位置 -->
<wd-tooltip content="底部居中" placement="bottom" @open="handlePositionOpen('bottom')">
  <wd-button size="small">下中</wd-button>
</wd-tooltip>`,

    script: `const handlePositionOpen = (placement: string) => {
  console.log('位置提示框打开：', placement)
}`,
  },

  // 箭头显示代码
  arrow: {
    template: `<!-- 显示箭头 -->
<wd-tooltip content="显示箭头的提示框" :visible-arrow="true">
  <wd-button>显示箭头</wd-button>
</wd-tooltip>

<!-- 隐藏箭头 -->
<wd-tooltip content="隐藏箭头的提示框" :visible-arrow="false">
  <wd-button type="warning">隐藏箭头</wd-button>
</wd-tooltip>

<!-- 自定义箭头 -->
<wd-tooltip content="自定义箭头样式" custom-arrow="custom-arrow-style">
  <wd-button type="error">自定义箭头</wd-button>
</wd-tooltip>`,

    style: `:deep(.custom-arrow-style) {
  border-color: #ff4d4f transparent transparent transparent;
}`,

    script: `// 箭头相关的事件处理可以和基本用法相同`,
  },

  // 偏移量设置代码
  offset: {
    template: `<!-- 无偏移 -->
<wd-tooltip content="无偏移" placement="top" :offset="0">
  <wd-button>无偏移</wd-button>
</wd-tooltip>

<!-- 数字偏移 -->
<wd-tooltip content="数字偏移" placement="top" :offset="20">
  <wd-button type="success">数字偏移</wd-button>
</wd-tooltip>

<!-- 数组偏移 -->
<wd-tooltip content="数组偏移" placement="top" :offset="[10, 20]">
  <wd-button type="info">数组偏移</wd-button>
</wd-tooltip>

<!-- 对象偏移 -->
<wd-tooltip content="对象偏移" placement="top" :offset="{ x: 15, y: 10 }">
  <wd-button type="warning">对象偏移</wd-button>
</wd-tooltip>`,

    script: `// 偏移量支持三种格式：
// 1. 数字：统一偏移量
// 2. 数组：[x偏移, y偏移]
// 3. 对象：{ x: 水平偏移, y: 垂直偏移 }`,
  },

  // 自定义内容代码
  custom: {
    template: `<!-- 自定义内容 -->
<wd-tooltip use-content-slot>
  <template #content>
    <view class="custom-tooltip-content">
      <view class="font-bold text-white">自定义标题</view>
      <view class="text-gray-200 text-sm mt-1">这里是自定义的提示内容，可以包含更丰富的样式和布局</view>
    </view>
  </template>
  <wd-button>自定义内容</wd-button>
</wd-tooltip>

<!-- 富文本内容 -->
<wd-tooltip use-content-slot custom-pop="custom-pop-style">
  <template #content>
    <view class="custom-rich-content">
      <wd-icon name="info" size="16" color="#1890ff" />
      <text class="ml-2">图标 + 文字组合</text>
    </view>
  </template>
  <wd-button type="success">富文本内容</wd-button>
</wd-tooltip>

<!-- 渐变样式 -->
<wd-tooltip use-content-slot>
  <template #content>
    <view class="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded">
      <view class="text-center">渐变背景提示</view>
    </view>
  </template>
  <wd-button type="error">渐变样式</wd-button>
</wd-tooltip>`,

    style: `.custom-tooltip-content {
  padding: 12rpx 16rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8rpx;
}

.custom-rich-content {
  display: flex;
  align-items: center;
  padding: 12rpx 16rpx;
  background: #f0f9ff;
  border: 2rpx solid #0ea5e9;
  border-radius: 8rpx;
  color: #0c4a6e;
}

:deep(.custom-pop-style) {
  background: transparent !important;
  box-shadow: none !important;
}`,

    script: `// 使用 use-content-slot 属性启用自定义内容插槽
// 可以在 #content 插槽中放置任意内容和样式`,
  },

  // 禁用状态代码
  disabled: {
    template: `<!-- 正常状态 -->
<wd-tooltip content="正常状态的提示" :disabled="false">
  <wd-button>正常状态</wd-button>
</wd-tooltip>

<!-- 禁用状态 -->
<wd-tooltip content="禁用状态的提示" :disabled="true">
  <wd-button type="info">禁用状态</wd-button>
</wd-tooltip>

<!-- 动态控制 -->
<wd-tooltip content="动态控制禁用状态" :disabled="dynamicDisabled">
  <wd-button type="warning">{{ dynamicDisabled ? '已禁用' : '已启用' }}</wd-button>
</wd-tooltip>

<wd-button size="small" @click="toggleDisabled">
  {{ dynamicDisabled ? '启用' : '禁用' }}提示
</wd-button>`,

    script: `const dynamicDisabled = ref(false)

const toggleDisabled = () => {
  dynamicDisabled.value = !dynamicDisabled.value
}`,
  },

  // 关闭按钮代码
  closeable: {
    template: `<!-- 带关闭按钮 -->
<wd-tooltip
  content="这个提示框包含关闭按钮，点击右上角的 × 号可以关闭"
  show-close
  v-model="closeableTooltip1"
  @close="handleCloseableClose('关闭按钮提示1')"
>
  <wd-button>带关闭按钮</wd-button>
</wd-tooltip>

<!-- 重要提示 -->
<wd-tooltip
  use-content-slot
  show-close
  v-model="closeableTooltip2"
  @close="handleCloseableClose('关闭按钮提示2')"
>
  <template #content>
    <view class="p-2">
      <view class="font-bold">重要提示</view>
      <view class="text-sm mt-1">这是一个需要用户主动关闭的重要提示信息</view>
    </view>
  </template>
  <wd-button type="error">重要提示</wd-button>
</wd-tooltip>

<wd-button size="small" @click="reopenCloseableTooltips">重新打开所有</wd-button>`,

    script: `const closeableTooltip1 = ref(false)
const closeableTooltip2 = ref(false)

const handleCloseableClose = (name: string) => {
  console.log('关闭了：', name)
}

const reopenCloseableTooltips = () => {
  closeableTooltip1.value = true
  closeableTooltip2.value = true
}`,
  },

  // 编程式控制代码
  programmatic: {
    template: `<!-- 编程式控制 -->
<wd-tooltip
  ref="programmaticTooltip"
  content="通过编程方式控制的提示框"
  @open="handleProgrammaticOpen"
  @close="handleProgrammaticClose"
>
  <wd-button>编程式控制</wd-button>
</wd-tooltip>

<wd-button size="small" @click="openProgrammatic">打开提示</wd-button>
<wd-button size="small" @click="closeProgrammatic">关闭提示</wd-button>
<wd-button size="small" type="warning" @click="toggleProgrammatic">切换状态</wd-button>`,

    script: `const programmaticTooltip = ref()

const openProgrammatic = () => {
  programmaticTooltip.value?.open()
}

const closeProgrammatic = () => {
  programmaticTooltip.value?.close()
}

const toggleProgrammatic = () => {
  // 可以通过检查当前状态来切换
  if (programmaticTooltip.value) {
    // 实际项目中可能需要维护一个状态变量来判断当前是否显示
    programmaticTooltip.value.open()
  }
}

const handleProgrammaticOpen = () => {
  console.log('编程式提示框打开')
}

const handleProgrammaticClose = () => {
  console.log('编程式提示框关闭')
}`,
  },

  // 交互演示代码
  interactive: {
    template: `<!-- 交互演示 -->
<view class="flex flex-wrap gap-4 justify-center">
  <wd-tooltip
    content="演示提示框1"
    @open="handleDemoOpen('演示提示框1')"
    @close="handleDemoClose('演示提示框1')"
    @change="handleDemoChange"
  >
    <wd-button>演示提示1</wd-button>
  </wd-tooltip>

  <wd-tooltip
    content="演示提示框2"
    placement="top"
    @open="handleDemoOpen('演示提示框2')"
    @close="handleDemoClose('演示提示框2')"
  >
    <wd-button type="success">演示提示2</wd-button>
  </wd-tooltip>

  <wd-tooltip
    content="演示提示框3"
    show-close
    v-model="demoTooltip3"
    @open="handleDemoOpen('演示提示框3')"
    @close="handleDemoClose('演示提示框3')"
  >
    <wd-button type="warning">演示提示3</wd-button>
  </wd-tooltip>
</view>

<!-- 统计信息 -->
<view class="rounded-lg bg-blue-50 p-3">
  <view class="text-sm text-blue-600">
    打开次数：{{ openCount }} | 关闭次数：{{ closeCount }} | 最后操作：{{ lastTooltipOperation || '无' }}
  </view>
</view>`,

    script: `const openCount = ref(0)
const closeCount = ref(0)
const lastTooltipOperation = ref('')
const demoTooltip3 = ref(false)

const handleDemoOpen = (name: string) => {
  openCount.value++
  lastTooltipOperation.value = name
  addRecord(\`打开了\${name}\`, 'success')
}

const handleDemoClose = (name: string) => {
  closeCount.value++
  lastTooltipOperation.value = name
  addRecord(\`关闭了\${name}\`, 'info')
}

const handleDemoChange = (data: { show: boolean }) => {
  addRecord(\`提示框状态变化：\${data.show ? '显示' : '隐藏'}\`, 'info')
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'content',
    type: 'String | Array',
    default: '""',
    desc: '显示的内容，也可以通过slot#content传入',
  },
  {
    name: 'placement',
    type: 'String',
    default: '"bottom"',
    desc: 'Tooltip的出现位置，可选值：top / top-start / top-end / bottom / bottom-start / bottom-end / left / left-start / left-end / right / right-start / right-end',
  },
  {
    name: 'visible-arrow',
    type: 'Boolean',
    default: 'true',
    desc: '是否显示Tooltip箭头',
  },
  {
    name: 'offset',
    type: 'Number | Array | Object',
    default: '0',
    desc: '出现位置的偏移量，支持数字、数组、对象类型',
  },
  {
    name: 'use-content-slot',
    type: 'Boolean',
    default: 'false',
    desc: '是否使用slot来传入content内容',
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: 'Tooltip是否可用',
  },
  {
    name: 'show-close',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示Tooltip内部的关闭按钮',
  },
  {
    name: 'model-value',
    type: 'Boolean',
    default: 'false',
    desc: 'Tooltip的状态是否可见，通过v-model绑定',
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
    desc: '自定义箭头内容',
  },
  {
    name: 'custom-pop',
    type: 'String',
    default: '""',
    desc: '自定义弹出内容',
  },
]

// Events 事件文档
const apiEvents = [
  {
    name: 'open',
    desc: '打开事件，当提示框显示时触发',
  },
  {
    name: 'close',
    desc: '关闭事件，当提示框隐藏时触发',
  },
  {
    name: 'change',
    desc: '状态变化事件，参数为 { show: boolean }',
  },
  {
    name: 'update:model-value',
    desc: '更新modelValue事件，参数为 boolean 值',
  },
  {
    name: 'menuclick',
    desc: '菜单点击事件',
  },
]

// Methods 方法文档
const apiMethods = [
  {
    name: 'open',
    desc: '打开tooltip',
    params: '',
    return: 'void',
  },
  {
    name: 'close',
    desc: '关闭tooltip',
    params: '',
    return: 'void',
  },
]

// ===== 工具方法 =====

/**
 * 添加操作记录
 */
const addRecord = (message: string, type: OperationRecord['type'] = 'info') => {
  operationRecords.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
    type,
  })
  // 限制记录数量
  if (operationRecords.value.length > 20) {
    operationRecords.value = operationRecords.value.slice(0, 20)
  }
}

/**
 * 清空操作记录
 */
const clearRecords = () => {
  operationRecords.value = []
  addRecord('清空了操作记录', 'warning')
}

/**
 * 获取记录颜色类名
 */
const getRecordColor = (type: OperationRecord['type']) => {
  const colors = {
    success: 'text-green-600',
    info: 'text-blue-600',
    warning: 'text-orange-600',
    error: 'text-red-600',
  }
  return colors[type]
}

// ===== 事件处理方法 =====

/**
 * 基本提示框打开事件
 */
const handleTooltipOpen = (name: string) => {
  addRecord(`${name}已打开`, 'success')
  console.log('提示框打开：', name)
}

/**
 * 基本提示框关闭事件
 */
const handleTooltipClose = (name: string) => {
  addRecord(`${name}已关闭`, 'info')
  console.log('提示框关闭：', name)
}

/**
 * 提示框状态变化事件
 */
const handleTooltipChange = (data: { show: boolean }) => {
  addRecord(`受控提示状态变化：${data.show ? '显示' : '隐藏'}`, 'info')
  console.log('提示框状态变化：', data.show)
}

/**
 * 位置提示框打开事件
 */
const handlePositionOpen = (placement: string) => {
  addRecord(`${placement}位置提示框打开`, 'success')
  console.log('位置提示框打开：', placement)
}

/**
 * 切换禁用状态
 */
const toggleDisabled = () => {
  dynamicDisabled.value = !dynamicDisabled.value
  addRecord(`${dynamicDisabled.value ? '禁用' : '启用'}了动态提示`, 'warning')
}

/**
 * 关闭按钮提示框关闭事件
 */
const handleCloseableClose = (name: string) => {
  addRecord(`${name}被手动关闭`, 'warning')
  console.log('关闭了：', name)
}

/**
 * 重新打开可关闭的提示框
 */
const reopenCloseableTooltips = () => {
  closeableTooltip1.value = true
  closeableTooltip2.value = true
  addRecord('重新打开了所有可关闭提示框', 'info')
}

/**
 * 编程式打开提示框
 */
const openProgrammatic = () => {
  if (programmaticTooltip.value) {
    programmaticTooltip.value.open()
    addRecord('编程式打开提示框', 'success')
  }
}

/**
 * 编程式关闭提示框
 */
const closeProgrammatic = () => {
  if (programmaticTooltip.value) {
    programmaticTooltip.value.close()
    addRecord('编程式关闭提示框', 'info')
  }
}

/**
 * 编程式切换提示框
 */
const toggleProgrammatic = () => {
  if (programmaticTooltip.value) {
    // 这里简单演示打开，实际项目中可能需要维护状态
    programmaticTooltip.value.open()
    addRecord('编程式切换提示框状态', 'warning')
  }
}

/**
 * 编程式提示框打开事件
 */
const handleProgrammaticOpen = () => {
  addRecord('编程式提示框已打开', 'success')
  console.log('编程式提示框打开')
}

/**
 * 编程式提示框关闭事件
 */
const handleProgrammaticClose = () => {
  addRecord('编程式提示框已关闭', 'info')
  console.log('编程式提示框关闭')
}

/**
 * 交互演示打开事件
 */
const handleDemoOpen = (name: string) => {
  openCount.value++
  lastTooltipOperation.value = name
  addRecord(`打开了${name}`, 'success')
  console.log('交互演示 - 打开了：', name)
}

/**
 * 交互演示关闭事件
 */
const handleDemoClose = (name: string) => {
  closeCount.value++
  lastTooltipOperation.value = name
  addRecord(`关闭了${name}`, 'info')
  console.log('交互演示 - 关闭了：', name)
}

/**
 * 交互演示状态变化事件
 */
const handleDemoChange = (data: { show: boolean }) => {
  addRecord(`提示框状态变化：${data.show ? '显示' : '隐藏'}`, 'info')
  console.log('交互演示 - 状态变化：', data.show)
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
// 自定义样式
:deep(.custom-arrow-style) {
  border-color: #ff4d4f transparent transparent transparent;
}

.custom-tooltip-content {
  padding: 12rpx 16rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8rpx;
}

.custom-rich-content {
  display: flex;
  align-items: center;
  padding: 12rpx 16rpx;
  background: #f0f9ff;
  border: 2rpx solid #0ea5e9;
  border-radius: 8rpx;
  color: #0c4a6e;
}

:deep(.custom-pop-style) {
  background: transparent !important;
  box-shadow: none !important;
}
</style>
