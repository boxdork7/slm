<!-- Button 按钮 http://127.0.0.1:100/#/pages-sub/demo/wd/button -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Button 按钮" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="提供了五种基本的按钮类型：主要、成功、信息、警告、危险">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <view class="flex flex-wrap gap-2">
          <wd-button @click="handleBasicClick('主要按钮')">主要按钮</wd-button>
          <wd-button type="success" @click="handleBasicClick('成功按钮')">成功按钮</wd-button>
          <wd-button type="info" @click="handleBasicClick('信息按钮')">信息按钮</wd-button>
          <wd-button type="warning" @click="handleBasicClick('警告按钮')">警告按钮</wd-button>
          <wd-button type="error" @click="handleBasicClick('危险按钮')">危险按钮</wd-button>
        </view>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基本用法" :code="codes.basic.template" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 按钮状态示例 -->
    <DemoSection title="按钮状态" desc="支持禁用状态和加载状态">
      <view class="space-y-4">
        <!-- 禁用状态 -->
        <view>
          <view class="mb-2 text-sm text-gray-700 font-medium">禁用状态</view>
          <view class="flex flex-wrap gap-2">
            <wd-button disabled @click="handleDisabledClick('禁用主要按钮')">主要按钮</wd-button>
            <wd-button type="success" disabled @click="handleDisabledClick('禁用成功按钮')">
              成功按钮
            </wd-button>
            <wd-button type="info" disabled @click="handleDisabledClick('禁用信息按钮')">
              信息按钮
            </wd-button>
            <wd-button type="warning" disabled @click="handleDisabledClick('禁用警告按钮')">
              警告按钮
            </wd-button>
            <wd-button type="error" disabled @click="handleDisabledClick('禁用危险按钮')">
              危险按钮
            </wd-button>
          </view>
        </view>

        <!-- 加载状态 -->
        <view>
          <view class="mb-2 text-sm text-gray-700 font-medium">加载状态</view>
          <view class="mb-3">
            <wd-button size="small" @click="toggleAllLoading">
              {{ allLoading ? '停止加载' : '开始加载演示' }}
            </wd-button>
          </view>
          <view class="flex flex-wrap gap-2">
            <wd-button :loading="allLoading" @click="handleLoadingClick('加载中主要按钮')">
              {{ allLoading ? '加载中' : '主要按钮' }}
            </wd-button>
            <wd-button
              type="success"
              :loading="allLoading"
              @click="handleLoadingClick('加载中成功按钮')"
            >
              {{ allLoading ? '加载中' : '成功按钮' }}
            </wd-button>
            <wd-button
              type="warning"
              :loading="allLoading"
              @click="handleLoadingClick('加载中警告按钮')"
            >
              {{ allLoading ? '加载中' : '警告按钮' }}
            </wd-button>
            <wd-button
              type="error"
              :loading="allLoading"
              @click="handleLoadingClick('加载中危险按钮')"
            >
              {{ allLoading ? '加载中' : '危险按钮' }}
            </wd-button>
            <wd-button
              type="info"
              :loading="allLoading"
              @click="handleLoadingClick('加载中信息按钮')"
            >
              {{ allLoading ? '加载中' : '信息按钮' }}
            </wd-button>
          </view>
        </view>

        <!-- 模拟加载示例 -->
        <view>
          <view class="mb-2 text-sm text-gray-700 font-medium">模拟加载</view>
          <wd-button type="error" :loading="simulateLoading" @click="handleSimulateLoading">
            {{ simulateLoading ? '加载中...' : '模拟加载' }}
          </wd-button>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 禁用状态" :code="codes.status.disabledTemplate" />
        <DemoCode title="模板 - 加载状态" :code="codes.status.loadingTemplate" />
        <DemoCode title="脚本 - 状态控制" :code="codes.status.script" />
      </template>
    </DemoSection>

    <!-- 幽灵按钮示例 -->
    <DemoSection title="幽灵按钮" desc="背景透明，只有边框和文字，适合次要操作">
      <view class="space-y-4">
        <!-- 普通幽灵按钮 -->
        <view>
          <view class="mb-2 text-sm text-gray-700 font-medium">普通幽灵按钮</view>
          <view class="flex flex-wrap gap-2">
            <wd-button plain @click="handlePlainClick('幽灵主要按钮')">主要按钮</wd-button>
            <wd-button type="success" plain @click="handlePlainClick('幽灵成功按钮')">
              成功按钮
            </wd-button>
            <wd-button type="info" plain @click="handlePlainClick('幽灵信息按钮')">
              信息按钮
            </wd-button>
            <wd-button type="warning" plain @click="handlePlainClick('幽灵警告按钮')">
              警告按钮
            </wd-button>
            <wd-button type="error" plain @click="handlePlainClick('幽灵危险按钮')">
              危险按钮
            </wd-button>
          </view>
        </view>

        <!-- 细边框幽灵按钮 -->
        <view>
          <view class="mb-2 text-sm text-gray-700 font-medium">细边框幽灵按钮</view>
          <view class="flex flex-wrap gap-2">
            <wd-button plain hairline @click="handlePlainClick('细边框主要按钮')">
              主要按钮
            </wd-button>
            <wd-button type="success" plain hairline @click="handlePlainClick('细边框成功按钮')">
              成功按钮
            </wd-button>
            <wd-button type="info" plain hairline @click="handlePlainClick('细边框信息按钮')">
              信息按钮
            </wd-button>
            <wd-button type="warning" plain hairline @click="handlePlainClick('细边框警告按钮')">
              警告按钮
            </wd-button>
            <wd-button type="error" plain hairline @click="handlePlainClick('细边框危险按钮')">
              危险按钮
            </wd-button>
          </view>
        </view>

        <!-- 禁用状态 -->
        <view>
          <view class="mb-2 text-sm text-gray-700 font-medium">幽灵按钮禁用状态</view>
          <view class="flex flex-wrap gap-2">
            <wd-button plain disabled @click="handlePlainClick('禁用幽灵主要按钮')">
              主要按钮
            </wd-button>
            <wd-button type="success" plain disabled @click="handlePlainClick('禁用幽灵成功按钮')">
              成功按钮
            </wd-button>
            <wd-button type="info" plain disabled @click="handlePlainClick('禁用幽灵信息按钮')">
              信息按钮
            </wd-button>
            <wd-button type="warning" plain disabled @click="handlePlainClick('禁用幽灵警告按钮')">
              警告按钮
            </wd-button>
            <wd-button type="error" plain disabled @click="handlePlainClick('禁用幽灵危险按钮')">
              危险按钮
            </wd-button>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 普通幽灵按钮" :code="codes.plain.normalTemplate" />
        <DemoCode title="模板 - 细边框幽灵按钮" :code="codes.plain.hairlineTemplate" />
        <DemoCode title="模板 - 禁用幽灵按钮" :code="codes.plain.disabledTemplate" />
        <DemoCode title="脚本 - 幽灵按钮" :code="codes.plain.script" />
      </template>
    </DemoSection>

    <!-- 按钮尺寸示例 -->
    <DemoSection title="按钮尺寸" desc="提供小型、普通、大型三种尺寸，分别适用于不同场景">
      <view class="space-y-4">
        <view class="flex flex-wrap items-center gap-2">
          <wd-button size="small" @click="handleSizeClick('小型按钮')">小型按钮</wd-button>
          <wd-button size="medium" @click="handleSizeClick('普通按钮')">普通按钮</wd-button>
          <wd-button size="large" @click="handleSizeClick('大型按钮')">大型按钮</wd-button>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 按钮尺寸" :code="codes.size.template" />
        <DemoCode title="脚本 - 按钮尺寸" :code="codes.size.script" />
      </template>
    </DemoSection>

    <!-- 特殊类型按钮示例 -->
    <DemoSection title="特殊类型按钮" desc="文字按钮和图标按钮">
      <view class="space-y-4">
        <!-- 文字按钮 -->
        <view>
          <view class="mb-2 text-sm text-gray-700 font-medium">文字按钮</view>
          <view class="flex flex-wrap gap-4">
            <wd-button type="text" @click="handleTextClick('文字按钮')">文字按钮</wd-button>
            <wd-button type="text" disabled @click="handleTextClick('禁用文字按钮')">
              禁用文字按钮
            </wd-button>
          </view>
        </view>

        <!-- 图标按钮 -->
        <view>
          <view class="mb-2 text-sm text-gray-700 font-medium">图标按钮</view>
          <view class="flex flex-wrap gap-2">
            <wd-button type="icon" icon="delete-thin" @click="handleIconClick('删除图标按钮')" />
            <wd-button type="icon" icon="setting" @click="handleIconClick('设置图标按钮')" />
            <wd-button type="icon" icon="search" @click="handleIconClick('搜索图标按钮')" />
            <wd-button type="icon" icon="add" @click="handleIconClick('添加图标按钮')" />
            <wd-button
              type="icon"
              icon="delete-thin"
              disabled
              @click="handleIconClick('禁用删除图标按钮')"
            />
          </view>
        </view>

        <!-- 带图标的基本按钮 -->
        <view>
          <view class="mb-2 text-sm text-gray-700 font-medium">带图标的基本按钮</view>
          <view class="space-y-2">
            <view class="flex flex-wrap gap-2">
              <wd-button icon="download" @click="handleIconTextClick('下载按钮')">下载</wd-button>
              <wd-button icon="setting" type="info" @click="handleIconTextClick('设置按钮')">
                设置
              </wd-button>
              <wd-button icon="share" type="success" @click="handleIconTextClick('分享按钮')">
                分享
              </wd-button>
              <wd-button icon="delete-thin" type="error" @click="handleIconTextClick('删除按钮')">
                删除
              </wd-button>
            </view>
            <view class="flex flex-wrap gap-2">
              <wd-button icon="download" size="small" @click="handleIconTextClick('小型下载按钮')">
                下载
              </wd-button>
              <wd-button
                icon="setting"
                size="small"
                type="info"
                @click="handleIconTextClick('小型设置按钮')"
              >
                设置
              </wd-button>
            </view>
            <view class="flex flex-wrap gap-2">
              <wd-button icon="download" size="large" @click="handleIconTextClick('大型下载按钮')">
                下载
              </wd-button>
              <wd-button
                icon="setting"
                size="large"
                type="info"
                @click="handleIconTextClick('大型设置按钮')"
              >
                设置
              </wd-button>
            </view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 文字按钮" :code="codes.special.textTemplate" />
        <DemoCode title="模板 - 图标按钮" :code="codes.special.iconTemplate" />
        <DemoCode title="模板 - 带图标的按钮" :code="codes.special.iconTextTemplate" />
        <DemoCode title="脚本 - 特殊类型按钮" :code="codes.special.script" />
      </template>
    </DemoSection>

    <!-- 块状按钮示例 -->
    <DemoSection title="块状按钮" desc="占满父容器宽度，常用于表单提交或重要操作">
      <view class="space-y-2">
        <wd-button block size="large" @click="handleBlockClick('块状主要按钮')">主要按钮</wd-button>
        <wd-button type="success" block size="large" @click="handleBlockClick('块状成功按钮')">
          成功按钮
        </wd-button>
        <wd-button type="info" block size="large" @click="handleBlockClick('块状信息按钮')">
          信息按钮
        </wd-button>
        <wd-button type="warning" block size="large" @click="handleBlockClick('块状警告按钮')">
          警告按钮
        </wd-button>
        <wd-button type="error" block size="large" @click="handleBlockClick('块状危险按钮')">
          危险按钮
        </wd-button>
        <wd-button size="large" :loading="blockLoading" block @click="handleBlockLoadingDemo">
          {{ blockLoading ? '加载中...' : '点击加载' }}
        </wd-button>
      </view>

      <template #codes>
        <DemoCode title="模板 - 块状按钮" :code="codes.block.template" />
        <DemoCode title="脚本 - 块状按钮" :code="codes.block.script" />
      </template>
    </DemoSection>

    <!-- 自定义样式示例 -->
    <DemoSection title="自定义样式" desc="使用自定义样式类实现个性化效果">
      <view class="flex flex-wrap gap-2">
        <wd-button custom-class="custom-shadow" @click="handleCustomClick('自定义主要按钮')">
          主要按钮
        </wd-button>
        <wd-button
          type="success"
          custom-class="custom-shadow"
          @click="handleCustomClick('自定义成功按钮')"
        >
          成功按钮
        </wd-button>
        <wd-button
          type="info"
          custom-class="custom-shadow"
          @click="handleCustomClick('自定义信息按钮')"
        >
          信息按钮
        </wd-button>
        <wd-button
          type="warning"
          custom-class="custom-shadow"
          @click="handleCustomClick('自定义警告按钮')"
        >
          警告按钮
        </wd-button>
        <wd-button
          type="error"
          custom-class="custom-shadow"
          @click="handleCustomClick('自定义危险按钮')"
        >
          危险按钮
        </wd-button>
      </view>

      <template #codes>
        <DemoCode title="模板 - 自定义样式" :code="codes.custom.template" />
        <DemoCode title="样式 - 自定义样式" :code="codes.custom.style" />
        <DemoCode title="脚本 - 自定义样式" :code="codes.custom.script" />
      </template>
    </DemoSection>

    <!-- 交互演示示例 -->
    <DemoSection title="交互演示" desc="记录用户操作并提供实时反馈">
      <view class="space-y-4">
        <!-- 演示按钮 -->
        <view class="flex flex-wrap gap-2">
          <wd-button @click="handleDemoClick('主要按钮')">主要按钮</wd-button>
          <wd-button type="success" @click="handleDemoClick('成功按钮')">成功按钮</wd-button>
          <wd-button type="warning" icon="warning" @click="handleDemoClick('警告按钮')">
            警告按钮
          </wd-button>
        </view>

        <!-- 统计信息 -->
        <view class="rounded-lg bg-blue-50 p-3">
          <view class="text-sm text-blue-600">
            点击次数：{{ clickCount }} | 最后点击：{{ lastClickButton || '无' }}
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
const allLoading = ref<boolean>(false)
const simulateLoading = ref<boolean>(false)
const blockLoading = ref<boolean>(false)

// 交互统计
const clickCount = ref<number>(0)
const lastClickButton = ref<string>('')

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
    template: `<!-- 基本按钮类型 -->
<wd-button @click="handleBasicClick('主要按钮')">主要按钮</wd-button>
<wd-button type="success" @click="handleBasicClick('成功按钮')">成功按钮</wd-button>
<wd-button type="info" @click="handleBasicClick('信息按钮')">信息按钮</wd-button>
<wd-button type="warning" @click="handleBasicClick('警告按钮')">警告按钮</wd-button>
<wd-button type="error" @click="handleBasicClick('危险按钮')">危险按钮</wd-button>`,

    script: `import { ref } from 'vue'

const handleBasicClick = (buttonName: string) => {
  console.log('点击了：', buttonName)
}`,
  },

  // 按钮状态代码
  status: {
    disabledTemplate: `<!-- 禁用状态 -->
<wd-button disabled @click="handleDisabledClick('禁用主要按钮')">主要按钮</wd-button>
<wd-button type="success" disabled @click="handleDisabledClick('禁用成功按钮')">成功按钮</wd-button>
<wd-button type="info" disabled @click="handleDisabledClick('禁用信息按钮')">信息按钮</wd-button>`,

    loadingTemplate: `<!-- 加载状态 -->
<wd-button :loading="allLoading" @click="handleLoadingClick('加载中主要按钮')">
  {{ allLoading ? '加载中' : '主要按钮' }}
</wd-button>
<wd-button type="success" :loading="allLoading" @click="handleLoadingClick('加载中成功按钮')">
  {{ allLoading ? '加载中' : '成功按钮' }}
</wd-button>`,

    script: `const allLoading = ref(false)
const simulateLoading = ref(false)

const toggleAllLoading = () => {
  allLoading.value = !allLoading.value
}

const handleSimulateLoading = () => {
  if (simulateLoading.value) return

  simulateLoading.value = true
  setTimeout(() => {
    simulateLoading.value = false
  }, 3000)
}`,
  },

  // 幽灵按钮代码
  plain: {
    normalTemplate: `<!-- 普通幽灵按钮 -->
<wd-button plain @click="handlePlainClick('幽灵主要按钮')">主要按钮</wd-button>
<wd-button type="success" plain @click="handlePlainClick('幽灵成功按钮')">成功按钮</wd-button>
<wd-button type="info" plain @click="handlePlainClick('幽灵信息按钮')">信息按钮</wd-button>`,

    hairlineTemplate: `<!-- 细边框幽灵按钮 -->
<wd-button plain hairline @click="handlePlainClick('细边框主要按钮')">主要按钮</wd-button>
<wd-button type="success" plain hairline @click="handlePlainClick('细边框成功按钮')">成功按钮</wd-button>`,

    disabledTemplate: `<!-- 禁用幽灵按钮 -->
<wd-button plain disabled @click="handlePlainClick('禁用幽灵主要按钮')">主要按钮</wd-button>
<wd-button type="success" plain disabled @click="handlePlainClick('禁用幽灵成功按钮')">成功按钮</wd-button>`,

    script: `const handlePlainClick = (buttonName: string) => {
  if (buttonName.includes('禁用')) {
    console.log('尝试点击禁用按钮：', buttonName)
    return
  }
  console.log('点击了幽灵按钮：', buttonName)
}`,
  },

  // 按钮尺寸代码
  size: {
    template: `<!-- 不同尺寸的按钮 -->
<wd-button size="small" @click="handleSizeClick('小型按钮')">小型按钮</wd-button>
<wd-button size="medium" @click="handleSizeClick('普通按钮')">普通按钮</wd-button>
<wd-button size="large" @click="handleSizeClick('大型按钮')">大型按钮</wd-button>`,

    script: `const handleSizeClick = (buttonName: string) => {
  console.log('点击了：', buttonName)
}`,
  },

  // 特殊类型按钮代码
  special: {
    textTemplate: `<!-- 文字按钮 -->
<wd-button type="text" @click="handleTextClick('文字按钮')">文字按钮</wd-button>
<wd-button type="text" disabled @click="handleTextClick('禁用文字按钮')">禁用文字按钮</wd-button>`,

    iconTemplate: `<!-- 图标按钮 -->
<wd-button type="icon" icon="delete-thin" @click="handleIconClick('删除图标按钮')" />
<wd-button type="icon" icon="setting" @click="handleIconClick('设置图标按钮')" />
<wd-button type="icon" icon="search" @click="handleIconClick('搜索图标按钮')" />`,

    iconTextTemplate: `<!-- 带图标的按钮 -->
<wd-button icon="download" @click="handleIconTextClick('下载按钮')">下载</wd-button>
<wd-button icon="setting" type="info" @click="handleIconTextClick('设置按钮')">设置</wd-button>
<wd-button icon="share" type="success" @click="handleIconTextClick('分享按钮')">分享</wd-button>`,

    script: `const handleTextClick = (buttonName: string) => {
  console.log('点击了文字按钮：', buttonName)
}

const handleIconClick = (buttonName: string) => {
  console.log('点击了图标按钮：', buttonName)
}

const handleIconTextClick = (buttonName: string) => {
  console.log('点击了带图标按钮：', buttonName)
}`,
  },

  // 块状按钮代码
  block: {
    template: `<!-- 块状按钮 -->
<wd-button block size="large" @click="handleBlockClick('块状主要按钮')">主要按钮</wd-button>
<wd-button type="success" block size="large" @click="handleBlockClick('块状成功按钮')">成功按钮</wd-button>
<wd-button type="info" block size="large" @click="handleBlockClick('块状信息按钮')">信息按钮</wd-button>
<wd-button size="large" :loading="blockLoading" block @click="handleBlockLoadingDemo">
  {{ blockLoading ? '加载中...' : '点击加载' }}
</wd-button>`,

    script: `const blockLoading = ref(false)

const handleBlockClick = (buttonName: string) => {
  console.log('点击了块状按钮：', buttonName)
}

const handleBlockLoadingDemo = () => {
  if (blockLoading.value) return

  blockLoading.value = true
  setTimeout(() => {
    blockLoading.value = false
  }, 2000)
}`,
  },

  // 自定义样式代码
  custom: {
    template: `<!-- 自定义样式按钮 -->
<wd-button custom-class="custom-shadow" @click="handleCustomClick('自定义主要按钮')">主要按钮</wd-button>
<wd-button type="success" custom-class="custom-shadow" @click="handleCustomClick('自定义成功按钮')">成功按钮</wd-button>`,

    style: `:deep(.custom-shadow) {
  box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%),
              0 2px 2px 0 rgb(0 0 0 / 14%),
              0 1px 5px 0 rgb(0 0 0 / 12%);
}`,

    script: `const handleCustomClick = (buttonName: string) => {
  console.log('点击了自定义样式按钮：', buttonName)
}`,
  },

  // 交互演示代码
  interactive: {
    template: `<!-- 交互演示 -->
<view class="flex flex-wrap gap-2">
  <wd-button @click="handleDemoClick('主要按钮')">主要按钮</wd-button>
  <wd-button type="success" @click="handleDemoClick('成功按钮')">成功按钮</wd-button>
  <wd-button type="warning" icon="warning" @click="handleDemoClick('警告按钮')">警告按钮</wd-button>
</view>

<!-- 统计信息 -->
<view class="rounded-lg bg-blue-50 p-3">
  <view class="text-sm text-blue-600">
    点击次数：{{ clickCount }} | 最后点击：{{ lastClickButton || '无' }}
  </view>
</view>`,

    script: `const clickCount = ref(0)
const lastClickButton = ref('')

const handleDemoClick = (buttonName: string) => {
  clickCount.value++
  lastClickButton.value = buttonName
  addRecord(\`点击了\${buttonName}\`, 'success')
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'type',
    type: 'String',
    default: '"primary"',
    desc: '按钮类型，可选值：primary / success / info / warning / error / default / text / icon',
  },
  {
    name: 'size',
    type: 'String',
    default: '"medium"',
    desc: '按钮尺寸，可选值：small / medium / large',
  },
  {
    name: 'plain',
    type: 'Boolean',
    default: 'false',
    desc: '是否为幽灵按钮',
  },
  {
    name: 'round',
    type: 'Boolean',
    default: 'true',
    desc: '是否为圆角按钮',
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: '是否禁用按钮',
  },
  {
    name: 'hairline',
    type: 'Boolean',
    default: 'false',
    desc: '是否为细边框',
  },
  {
    name: 'block',
    type: 'Boolean',
    default: 'false',
    desc: '是否为块状按钮',
  },
  {
    name: 'loading',
    type: 'Boolean',
    default: 'false',
    desc: '是否为加载中按钮',
  },
  {
    name: 'loading-color',
    type: 'String',
    default: '""',
    desc: '加载图标颜色',
  },
  {
    name: 'icon',
    type: 'String',
    default: '""',
    desc: '图标类名',
  },
  {
    name: 'class-prefix',
    type: 'String',
    default: '"wd-icon"',
    desc: '类名前缀，用于使用自定义图标',
  },
  {
    name: 'icon-size',
    type: 'String | Number',
    default: '""',
    desc: '图标大小',
  },
  {
    name: 'icon-color',
    type: 'String',
    default: '""',
    desc: '图标颜色',
  },
  {
    name: 'open-type',
    type: 'String',
    default: '""',
    desc: '开放能力，具体支持可参考 uni-app 官方文档',
  },
  {
    name: 'hover-stop-propagation',
    type: 'Boolean',
    default: 'false',
    desc: '是否阻止本节点的祖先节点出现点击态',
  },
  {
    name: 'lang',
    type: 'String',
    default: '"zh_CN"',
    desc: '返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文',
  },
  {
    name: 'session-from',
    type: 'String',
    default: '""',
    desc: '会话来源，open-type="contact"时有效',
  },
  {
    name: 'send-message-title',
    type: 'String',
    default: '""',
    desc: '会话内消息卡片标题，open-type="contact"时有效',
  },
  {
    name: 'send-message-path',
    type: 'String',
    default: '""',
    desc: '会话内消息卡片点击跳转小程序路径，open-type="contact"时有效',
  },
  {
    name: 'send-message-img',
    type: 'String',
    default: '""',
    desc: '会话内消息卡片图片，open-type="contact"时有效',
  },
  {
    name: 'app-parameter',
    type: 'String',
    default: '""',
    desc: '打开 APP 时，向 APP 传递的参数，open-type=launchApp时有效',
  },
  {
    name: 'show-message-card',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示会话内消息卡片，open-type="contact"时有效',
  },
  {
    name: 'button-id',
    type: 'String',
    default: '""',
    desc: '按钮的唯一标识，可用于设置隐私同意授权按钮的id',
  },
  {
    name: 'scope',
    type: 'String',
    default: '""',
    desc: '支付宝小程序授权范围，当 open-type 为 getAuthorize 时有效',
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
    name: 'click',
    desc: '点击按钮时触发，参数为 event 对象',
  },
  {
    name: 'getuserinfo',
    desc: '用户点击该按钮时，会返回获取到的用户信息，从返回参数的detail中获取到的值同uni.getUserInfo',
  },
  {
    name: 'contact',
    desc: '客服消息回调，open-type="contact"时有效',
  },
  {
    name: 'getphonenumber',
    desc: '获取用户手机号回调，open-type="getPhoneNumber"时有效',
  },
  {
    name: 'error',
    desc: '使用开放能力时，发生错误的回调，open-type="launchApp"时有效',
  },
  {
    name: 'launchapp',
    desc: '打开 APP 成功的回调，open-type="launchApp"时有效',
  },
  {
    name: 'opensetting',
    desc: '在打开授权设置页后回调，open-type="openSetting"时有效',
  },
  {
    name: 'chooseavatar',
    desc: '获取用户头像回调，open-type="chooseAvatar"时有效',
  },
  {
    name: 'agreeprivacyauthorization',
    desc: '用户同意隐私协议事件回调，open-type="agreePrivacyAuthorization"时有效',
  },
]

// Methods 方法文档（Button 组件没有暴露方法）
const apiMethods: any[] = []

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
 * 基本按钮点击事件
 */
const handleBasicClick = (buttonName: string) => {
  addRecord(`点击了${buttonName}`, 'success')
  console.log('点击了基本按钮：', buttonName)
}

/**
 * 禁用按钮点击事件
 */
const handleDisabledClick = (buttonName: string) => {
  addRecord(`尝试点击${buttonName}（按钮已禁用）`, 'warning')
  console.log('尝试点击禁用按钮：', buttonName)
}

/**
 * 加载中按钮点击事件
 */
const handleLoadingClick = (buttonName: string) => {
  if (allLoading.value) {
    addRecord(`尝试点击${buttonName}（按钮加载中）`, 'warning')
    return
  }
  addRecord(`点击了${buttonName}`, 'success')
  console.log('点击了加载中按钮：', buttonName)
}

/**
 * 切换全部加载状态
 */
const toggleAllLoading = () => {
  allLoading.value = !allLoading.value
  const action = allLoading.value ? '开始' : '停止'
  addRecord(`${action}了加载演示`, 'info')
  console.log(`${action}加载演示`)
}

/**
 * 模拟加载
 */
const handleSimulateLoading = () => {
  if (simulateLoading.value) {
    addRecord('尝试点击加载中的按钮（无效操作）', 'warning')
    return
  }

  simulateLoading.value = true
  addRecord('开始模拟加载', 'info')

  setTimeout(() => {
    simulateLoading.value = false
    addRecord('模拟加载完成', 'success')
  }, 3000)
}

/**
 * 幽灵按钮点击事件
 */
const handlePlainClick = (buttonName: string) => {
  if (buttonName.includes('禁用')) {
    addRecord(`尝试点击${buttonName}（按钮已禁用）`, 'warning')
    return
  }
  addRecord(`点击了${buttonName}`, 'success')
  console.log('点击了幽灵按钮：', buttonName)
}

/**
 * 尺寸按钮点击事件
 */
const handleSizeClick = (buttonName: string) => {
  addRecord(`点击了${buttonName}`, 'success')
  console.log('点击了尺寸按钮：', buttonName)
}

/**
 * 文字按钮点击事件
 */
const handleTextClick = (buttonName: string) => {
  if (buttonName.includes('禁用')) {
    addRecord(`尝试点击${buttonName}（按钮已禁用）`, 'warning')
    return
  }
  addRecord(`点击了${buttonName}`, 'success')
  console.log('点击了文字按钮：', buttonName)
}

/**
 * 图标按钮点击事件
 */
const handleIconClick = (buttonName: string) => {
  if (buttonName.includes('禁用')) {
    addRecord(`尝试点击${buttonName}（按钮已禁用）`, 'warning')
    return
  }
  addRecord(`点击了${buttonName}`, 'success')
  console.log('点击了图标按钮：', buttonName)
}

/**
 * 带图标按钮点击事件
 */
const handleIconTextClick = (buttonName: string) => {
  addRecord(`点击了${buttonName}`, 'success')
  console.log('点击了带图标按钮：', buttonName)
}

/**
 * 块状按钮点击事件
 */
const handleBlockClick = (buttonName: string) => {
  addRecord(`点击了${buttonName}`, 'success')
  console.log('点击了块状按钮：', buttonName)
}

/**
 * 块状加载按钮演示
 */
const handleBlockLoadingDemo = () => {
  if (blockLoading.value) {
    addRecord('尝试点击加载中的块状按钮（无效操作）', 'warning')
    return
  }

  blockLoading.value = true
  addRecord('开始块状按钮加载', 'info')

  setTimeout(() => {
    blockLoading.value = false
    addRecord('块状按钮加载完成', 'success')
  }, 2000)
}

/**
 * 自定义样式按钮点击事件
 */
const handleCustomClick = (buttonName: string) => {
  addRecord(`点击了${buttonName}`, 'success')
  console.log('点击了自定义样式按钮：', buttonName)
}

/**
 * 交互演示按钮点击事件
 */
const handleDemoClick = (buttonName: string) => {
  clickCount.value++
  lastClickButton.value = buttonName
  addRecord(`点击了${buttonName}`, 'success')
  console.log('交互演示 - 点击了：', buttonName)
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
:deep(.custom-shadow) {
  box-shadow:
    0 3px 1px -2px rgb(0 0 0 / 20%),
    0 2px 2px 0 rgb(0 0 0 / 14%),
    0 1px 5px 0 rgb(0 0 0 / 12%);
}
</style>
