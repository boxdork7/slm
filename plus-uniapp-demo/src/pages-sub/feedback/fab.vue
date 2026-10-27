<!-- Fab 悬浮按钮 http://127.0.0.1:100/#/pages-sub/demo/wd/fab -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Fab 悬浮按钮" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的悬浮按钮，支持主题色和位置设置">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <!-- 主题颜色选择 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm font-medium">主题颜色</view>
          <wd-radio-group v-model="basicType" inline shape="dot">
            <wd-radio value="primary">主要</wd-radio>
            <wd-radio value="success">成功</wd-radio>
            <wd-radio value="warning">警告</wd-radio>
            <wd-radio value="error">危险</wd-radio>
          </wd-radio-group>
        </view>

        <!-- 位置选择 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm font-medium">悬浮位置</view>
          <wd-radio-group v-model="basicPosition" inline shape="dot">
            <wd-radio value="left-bottom">左下</wd-radio>
            <wd-radio value="right-bottom">右下</wd-radio>
            <wd-radio value="right-center">右中</wd-radio>
          </wd-radio-group>
        </view>

        <!-- 状态显示 -->
        <view class="rounded-lg bg-blue-50 p-4">
          <view class="text-xs text-blue-600 font-medium">
            💡 当前状态：{{ basicActive ? '已展开' : '已收起' }}
          </view>
        </view>
      </view>

      <!-- 基本悬浮按钮 -->
      <wd-fab
        v-model:active="basicActive"
        :type="basicType"
        :position="basicPosition"
        direction="top"
        @click="handleBasicClick"
      >
        <wd-button type="primary" round class="fab-action-button" @click="handleAction('分享')">
          <wd-icon name="share" size="20px" />
        </wd-button>
        <wd-button type="success" round class="fab-action-button" @click="handleAction('收藏')">
          <wd-icon name="star" size="20px" />
        </wd-button>
        <wd-button type="warning" round class="fab-action-button" @click="handleAction('编辑')">
          <wd-icon name="edit" size="20px" />
        </wd-button>
      </wd-fab>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基本用法" :code="codes.basic.template" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 弹出方向示例 -->
    <DemoSection title="弹出方向" desc="支持向上、向下、向左、向右四个方向弹出">
      <view class="space-y-4">
        <!-- 方向选择 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm font-medium">弹出方向</view>
          <wd-radio-group v-model="directionValue" inline shape="dot">
            <wd-radio value="top">向上</wd-radio>
            <wd-radio value="bottom">向下</wd-radio>
            <wd-radio value="left">向左</wd-radio>
            <wd-radio value="right">向右</wd-radio>
          </wd-radio-group>
        </view>

        <!-- 控制按钮 -->
        <view class="px-4">
          <wd-button type="primary" block @click="directionActive = !directionActive">
            {{ directionActive ? '收起菜单' : '展开菜单' }}
          </wd-button>
        </view>
      </view>

      <!-- 方向演示悬浮按钮 -->
      <wd-fab
        v-model:active="directionActive"
        :direction="directionValue"
        position="right-center"
        type="success"
      >
        <wd-button type="primary" round class="fab-action-button" @click="handleAction('消息')">
          <wd-icon name="chat" size="20px" />
        </wd-button>
        <wd-button type="success" round class="fab-action-button" @click="handleAction('通话')">
          <wd-icon name="phone" size="20px" />
        </wd-button>
        <wd-button type="warning" round class="fab-action-button" @click="handleAction('视频')">
          <wd-icon name="video" size="20px" />
        </wd-button>
      </wd-fab>

      <template #codes>
        <DemoCode title="模板 - 弹出方向" :code="codes.direction.template" />
        <DemoCode title="脚本 - 弹出方向" :code="codes.direction.script" />
      </template>
    </DemoSection>

    <!-- 可拖拽示例 -->
    <DemoSection title="可拖拽" desc="开启拖拽功能，支持自由拖动和磁吸效果">
      <view class="space-y-4">
        <!-- 拖拽控制 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm font-medium">拖拽功能</view>
          <wd-switch v-model="draggableEnabled" size="22px" />
          <view class="mt-2 text-xs text-gray-500">
            开启后可以自由拖动悬浮按钮，会自动吸附到屏幕边缘
          </view>
        </view>

        <!-- 操作提示 -->
        <view class="rounded-lg bg-amber-50 p-4">
          <view class="text-xs text-amber-600 font-medium">
            🔄 {{ draggableEnabled ? '拖拽已开启，长按悬浮按钮可拖动' : '拖拽已关闭' }}
          </view>
        </view>
      </view>

      <!-- 可拖拽悬浮按钮 -->
      <wd-fab
        v-model:active="draggableActive"
        :draggable="draggableEnabled"
        position="left-center"
        type="warning"
        direction="right"
      >
        <wd-button type="error" round class="fab-action-button" @click="handleAction('删除')">
          <wd-icon name="delete" size="20px" />
        </wd-button>
        <wd-button type="warning" round class="fab-action-button" @click="handleAction('设置')">
          <wd-icon name="setting" size="20px" />
        </wd-button>
        <wd-button type="info" round class="fab-action-button" @click="handleAction('帮助')">
          <wd-icon name="help" size="20px" />
        </wd-button>
      </wd-fab>

      <template #codes>
        <DemoCode title="模板 - 可拖拽" :code="codes.draggable.template" />
        <DemoCode title="脚本 - 可拖拽" :code="codes.draggable.script" />
      </template>
    </DemoSection>

    <!-- 禁用状态示例 -->
    <DemoSection title="禁用状态" desc="禁用悬浮按钮，阻止所有交互">
      <view class="space-y-4">
        <!-- 禁用控制 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm font-medium">禁用状态</view>
          <wd-switch v-model="disabledState" size="22px" />
          <view class="mt-2 text-xs text-gray-500">禁用后悬浮按钮无法点击和展开</view>
        </view>

        <!-- 状态显示 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="text-xs text-gray-600 font-medium">
            🚫 {{ disabledState ? '悬浮按钮已禁用' : '悬浮按钮正常' }}
          </view>
        </view>
      </view>

      <!-- 禁用状态悬浮按钮 -->
      <wd-fab
        v-model:active="disabledActive"
        :disabled="disabledState"
        position="top-center"
        type="error"
        direction="bottom"
      >
        <wd-button type="primary" round class="fab-action-button" @click="handleAction('操作1')">
          <wd-icon name="add" size="20px" />
        </wd-button>
        <wd-button type="success" round class="fab-action-button" @click="handleAction('操作2')">
          <wd-icon name="check" size="20px" />
        </wd-button>
      </wd-fab>

      <template #codes>
        <DemoCode title="模板 - 禁用状态" :code="codes.disabled.template" />
        <DemoCode title="脚本 - 禁用状态" :code="codes.disabled.script" />
      </template>
    </DemoSection>

    <!-- 自定义触发器示例 -->
    <DemoSection title="自定义触发器" desc="使用自定义内容作为悬浮按钮的触发器">
      <view class="space-y-4">
        <!-- 自定义触发器控制 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm font-medium">使用自定义触发器</view>
          <wd-switch v-model="useCustomTrigger" size="22px" />
          <view class="mt-2 text-xs text-gray-500">开启后使用自定义按钮作为触发器</view>
        </view>

        <!-- 控制按钮 -->
        <view class="px-4">
          <wd-button
            type="primary"
            :disabled="!useCustomTrigger"
            block
            @click="toggleCustomTrigger"
          >
            {{ customTriggerActive ? '关闭自定义菜单' : '打开自定义菜单' }}
          </wd-button>
        </view>
      </view>

      <!-- 自定义触发器悬浮按钮 -->
      <wd-fab
        v-if="useCustomTrigger"
        v-model:active="customTriggerActive"
        position="bottom-center"
        :expandable="false"
      >
        <template #trigger>
          <wd-button
            type="success"
            custom-class="custom-trigger-button"
            @click="handleCustomTriggerClick"
          >
            <wd-icon name="share" size="16px" />
            分享内容
          </wd-button>
        </template>
      </wd-fab>

      <template #codes>
        <DemoCode title="模板 - 自定义触发器" :code="codes.customTrigger.template" />
        <DemoCode title="脚本 - 自定义触发器" :code="codes.customTrigger.script" />
      </template>
    </DemoSection>

    <!-- 实际应用场景 -->
    <DemoSection title="实际应用场景" desc="常见的业务场景示例">
      <!-- 应用场景演示 -->
      <view class="space-y-4">
        <!-- 场景选择 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm font-medium">应用场景</view>
          <wd-radio-group v-model="scenarioType" inline shape="dot">
            <wd-radio value="social">社交应用</wd-radio>
            <wd-radio value="editor">编辑器</wd-radio>
            <wd-radio value="ecommerce">电商应用</wd-radio>
          </wd-radio-group>
        </view>

        <!-- 场景说明 -->
        <view class="rounded-lg bg-blue-50 p-4">
          <view class="text-xs text-blue-600 font-medium">
            📱 {{ getScenarioDescription(scenarioType) }}
          </view>
        </view>
      </view>

      <!-- 社交应用场景 -->
      <wd-fab
        v-if="scenarioType === 'social'"
        v-model:active="socialActive"
        position="right-bottom"
        type="primary"
        direction="top"
      >
        <wd-button
          type="primary"
          round
          class="fab-action-button"
          @click="handleScenarioAction('发表动态')"
        >
          <wd-icon name="edit" size="20px" />
        </wd-button>
        <wd-button
          type="success"
          round
          class="fab-action-button"
          @click="handleScenarioAction('拍照')"
        >
          <wd-icon name="camera" size="20px" />
        </wd-button>
        <wd-button
          type="warning"
          round
          class="fab-action-button"
          @click="handleScenarioAction('直播')"
        >
          <wd-icon name="video" size="20px" />
        </wd-button>
        <wd-button
          type="error"
          round
          class="fab-action-button"
          @click="handleScenarioAction('位置')"
        >
          <wd-icon name="location" size="20px" />
        </wd-button>
      </wd-fab>

      <!-- 编辑器场景 -->
      <wd-fab
        v-if="scenarioType === 'editor'"
        v-model:active="editorActive"
        position="right-bottom"
        type="success"
        direction="left"
      >
        <wd-button
          type="primary"
          round
          class="fab-action-button"
          @click="handleScenarioAction('撤销')"
        >
          <wd-icon name="arrow-left" size="20px" />
        </wd-button>
        <wd-button
          type="success"
          round
          class="fab-action-button"
          @click="handleScenarioAction('保存')"
        >
          <wd-icon name="check" size="20px" />
        </wd-button>
        <wd-button
          type="warning"
          round
          class="fab-action-button"
          @click="handleScenarioAction('预览')"
        >
          <wd-icon name="eye" size="20px" />
        </wd-button>
        <wd-button
          type="error"
          round
          class="fab-action-button"
          @click="handleScenarioAction('设置')"
        >
          <wd-icon name="setting" size="20px" />
        </wd-button>
      </wd-fab>

      <!-- 电商应用场景 -->
      <wd-fab
        v-if="scenarioType === 'ecommerce'"
        v-model:active="ecommerceActive"
        position="right-bottom"
        type="warning"
        direction="top"
      >
        <wd-button
          type="error"
          round
          class="fab-action-button"
          @click="handleScenarioAction('购物车')"
        >
          <wd-icon name="cart" size="20px" />
        </wd-button>
        <wd-button
          type="warning"
          round
          class="fab-action-button"
          @click="handleScenarioAction('收藏')"
        >
          <wd-icon name="star" size="20px" />
        </wd-button>
        <wd-button
          type="success"
          round
          class="fab-action-button"
          @click="handleScenarioAction('客服')"
        >
          <wd-icon name="chat" size="20px" />
        </wd-button>
        <wd-button
          type="primary"
          round
          class="fab-action-button"
          @click="handleScenarioAction('搜索')"
        >
          <wd-icon name="search" size="20px" />
        </wd-button>
      </wd-fab>

      <template #codes>
        <DemoCode title="模板 - 社交应用场景" :code="codes.scenarios.socialTemplate" />
        <DemoCode title="模板 - 编辑器场景" :code="codes.scenarios.editorTemplate" />
        <DemoCode title="模板 - 电商应用场景" :code="codes.scenarios.ecommerceTemplate" />
        <DemoCode title="脚本 - 应用场景" :code="codes.scenarios.script" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// ===== 组件状态管理 =====

// 基本用法状态
const basicActive = ref<boolean>(false)
const basicType = ref<'primary' | 'success' | 'warning' | 'error'>('primary')
const basicPosition = ref<'left-bottom' | 'right-bottom' | 'right-center'>('right-bottom')

// 弹出方向状态
const directionActive = ref<boolean>(false)
const directionValue = ref<'top' | 'bottom' | 'left' | 'right'>('top')

// 拖拽功能状态
const draggableActive = ref<boolean>(false)
const draggableEnabled = ref<boolean>(false)

// 禁用状态
const disabledActive = ref<boolean>(false)
const disabledState = ref<boolean>(false)

// 自定义触发器状态
const customTriggerActive = ref<boolean>(false)
const useCustomTrigger = ref<boolean>(false)

// 应用场景状态
const scenarioType = ref<'social' | 'editor' | 'ecommerce'>('social')
const socialActive = ref<boolean>(false)
const editorActive = ref<boolean>(false)
const ecommerceActive = ref<boolean>(false)

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    template: `<wd-fab
  v-model:active="basicActive"
  :type="basicType"
  :position="basicPosition"
  direction="top"
  @click="handleBasicClick"
>
  <wd-button type="primary" round @click="handleAction('分享')">
    <wd-icon name="share" size="20px" />
  </wd-button>
  <wd-button type="success" round @click="handleAction('收藏')">
    <wd-icon name="star" size="20px" />
  </wd-button>
  <wd-button type="warning" round @click="handleAction('编辑')">
    <wd-icon name="edit" size="20px" />
  </wd-button>
</wd-fab>`,

    script: `import { ref } from 'vue'

const basicActive = ref(false)
const basicType = ref('primary')
const basicPosition = ref('right-bottom')

const handleBasicClick = () => {
  console.log('悬浮按钮被点击')
}

const handleAction = (action: string) => {
  console.log('执行操作：', action)
}`,
  },

  // 弹出方向代码
  direction: {
    template: `<wd-fab
  v-model:active="directionActive"
  :direction="directionValue"
  position="right-center"
  type="success"
>
  <wd-button type="primary" round @click="handleAction('消息')">
    <wd-icon name="chat" size="20px" />
  </wd-button>
  <wd-button type="success" round @click="handleAction('通话')">
    <wd-icon name="phone" size="20px" />
  </wd-button>
  <wd-button type="warning" round @click="handleAction('视频')">
    <wd-icon name="video" size="20px" />
  </wd-button>
</wd-fab>`,

    script: `const directionActive = ref(false)
const directionValue = ref('top')

// 支持的方向：'top' | 'bottom' | 'left' | 'right'`,
  },

  // 可拖拽代码
  draggable: {
    template: `<wd-fab
  v-model:active="draggableActive"
  :draggable="draggableEnabled"
  position="left-center"
  type="warning"
  direction="right"
>
  <wd-button type="error" round @click="handleAction('删除')">
    <wd-icon name="delete" size="20px" />
  </wd-button>
  <wd-button type="warning" round @click="handleAction('设置')">
    <wd-icon name="setting" size="20px" />
  </wd-button>
  <wd-button type="info" round @click="handleAction('帮助')">
    <wd-icon name="help" size="20px" />
  </wd-button>
</wd-fab>`,

    script: `const draggableActive = ref(false)
const draggableEnabled = ref(false)

// 开启拖拽后，悬浮按钮可以自由拖动
// 支持磁吸效果，会自动吸附到屏幕边缘`,
  },

  // 禁用状态代码
  disabled: {
    template: `<wd-fab
  v-model:active="disabledActive"
  :disabled="disabledState"
  position="top-center"
  type="error"
  direction="bottom"
>
  <wd-button type="primary" round @click="handleAction('操作1')">
    <wd-icon name="add" size="20px" />
  </wd-button>
  <wd-button type="success" round @click="handleAction('操作2')">
    <wd-icon name="check" size="20px" />
  </wd-button>
</wd-fab>`,

    script: `const disabledActive = ref(false)
const disabledState = ref(false)

// 禁用后悬浮按钮无法点击和展开`,
  },

  // 自定义触发器代码
  customTrigger: {
    template: `<wd-fab
  v-model:active="customTriggerActive"
  position="bottom-center"
  :expandable="false"
>
  <template #trigger>
    <wd-button
      type="success"
      @click="handleCustomTriggerClick"
    >
      <wd-icon name="share" size="16px" />
      分享内容
    </wd-button>
  </template>
</wd-fab>`,

    script: `const customTriggerActive = ref(false)

const handleCustomTriggerClick = () => {
  console.log('自定义触发器被点击')
}

// expandable 设为 false 时，不会展开子菜单
// 适合单一功能的悬浮按钮`,
  },

  // 应用场景代码
  scenarios: {
    socialTemplate: `<!-- 社交应用场景 -->
<wd-fab
  v-model:active="socialActive"
  position="right-bottom"
  type="primary"
  direction="top"
>
  <wd-button type="primary" round @click="handleAction('发表动态')">
    <wd-icon name="edit" size="20px" />
  </wd-button>
  <wd-button type="success" round @click="handleAction('拍照')">
    <wd-icon name="camera" size="20px" />
  </wd-button>
  <wd-button type="warning" round @click="handleAction('直播')">
    <wd-icon name="video" size="20px" />
  </wd-button>
  <wd-button type="error" round @click="handleAction('位置')">
    <wd-icon name="location" size="20px" />
  </wd-button>
</wd-fab>`,

    editorTemplate: `<!-- 编辑器场景 -->
<wd-fab
  v-model:active="editorActive"
  position="right-bottom"
  type="success"
  direction="left"
>
  <wd-button type="primary" round @click="handleAction('撤销')">
    <wd-icon name="arrow-left" size="20px" />
  </wd-button>
  <wd-button type="success" round @click="handleAction('保存')">
    <wd-icon name="check" size="20px" />
  </wd-button>
  <wd-button type="warning" round @click="handleAction('预览')">
    <wd-icon name="eye" size="20px" />
  </wd-button>
  <wd-button type="error" round @click="handleAction('设置')">
    <wd-icon name="setting" size="20px" />
  </wd-button>
</wd-fab>`,

    ecommerceTemplate: `<!-- 电商应用场景 -->
<wd-fab
  v-model:active="ecommerceActive"
  position="right-bottom"
  type="warning"
  direction="top"
>
  <wd-button type="error" round @click="handleAction('购物车')">
    <wd-icon name="cart" size="20px" />
  </wd-button>
  <wd-button type="warning" round @click="handleAction('收藏')">
    <wd-icon name="star" size="20px" />
  </wd-button>
  <wd-button type="success" round @click="handleAction('客服')">
    <wd-icon name="chat" size="20px" />
  </wd-button>
  <wd-button type="primary" round @click="handleAction('搜索')">
    <wd-icon name="search" size="20px" />
  </wd-button>
</wd-fab>`,

    script: `// 应用场景状态管理
const scenarioType = ref('social')
const socialActive = ref(false)
const editorActive = ref(false)
const ecommerceActive = ref(false)

const handleScenarioAction = (action: string) => {
  console.log(\`\${scenarioType.value}应用场景 - 执行操作：\${action}\`)
}

const getScenarioDescription = (type: string) => {
  const descriptions = {
    social: '社交应用：发表动态、拍照、直播、分享位置',
    editor: '编辑器：撤销、保存、预览、设置',
    ecommerce: '电商应用：购物车、收藏、客服、搜索'
  }
  return descriptions[type] || ''
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'v-model:active',
    type: 'Boolean',
    default: 'false',
    desc: '是否激活展开状态',
  },
  {
    name: 'type',
    type: 'String',
    default: '"primary"',
    desc: '主题类型：primary / success / info / warning / error / default',
  },
  {
    name: 'position',
    type: 'String',
    default: '"right-bottom"',
    desc: '悬浮按钮位置：left-top / right-top / left-bottom / right-bottom / left-center / right-center / top-center / bottom-center',
  },
  {
    name: 'direction',
    type: 'String',
    default: '"top"',
    desc: '菜单弹出方向：top / right / bottom / left',
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: '是否禁用悬浮按钮',
  },
  {
    name: 'inactive-icon',
    type: 'String',
    default: '"add"',
    desc: '悬浮按钮未展开时的图标',
  },
  {
    name: 'active-icon',
    type: 'String',
    default: '"close"',
    desc: '悬浮按钮展开时的图标',
  },
  {
    name: 'z-index',
    type: 'Number',
    default: '99',
    desc: '自定义悬浮按钮层级',
  },
  {
    name: 'draggable',
    type: 'Boolean',
    default: 'false',
    desc: '是否可拖动，开启后支持自由拖动和磁吸效果',
  },
  {
    name: 'gap',
    type: 'Object',
    default: '{}',
    desc: '悬浮按钮间距配置，如 { top: 16, left: 16, right: 16, bottom: 16 }',
  },
  {
    name: 'expandable',
    type: 'Boolean',
    default: 'true',
    desc: '用于控制点击时是否展开菜单',
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
const apiMethods = [
  {
    name: 'open()',
    desc: '展开悬浮按钮菜单',
  },
  {
    name: 'close()',
    desc: '收起悬浮按钮菜单',
  },
]

// Events 事件文档
const apiEvents = [
  {
    name: 'update:active',
    desc: '激活状态改变时触发，参数为新的激活状态',
  },
  {
    name: 'click',
    desc: '点击悬浮按钮时触发',
  },
]

// ===== 工具方法 =====

/**
 * 获取场景描述
 */
const getScenarioDescription = (type: string) => {
  const descriptions = {
    social: '社交应用：发表动态、拍照、直播、分享位置',
    editor: '编辑器：撤销、保存、预览、设置',
    ecommerce: '电商应用：购物车、收藏、客服、搜索',
  }
  return descriptions[type as keyof typeof descriptions] || ''
}

// ===== 事件处理方法 =====

/**
 * 基本用法点击事件
 */
const handleBasicClick = () => {
  console.log('基本悬浮按钮被点击')
}

/**
 * 通用操作处理
 */
const handleAction = (action: string) => {
  console.log(`执行操作：${action}`)
}

/**
 * 切换自定义触发器
 */
const toggleCustomTrigger = () => {
  customTriggerActive.value = !customTriggerActive.value
}

/**
 * 自定义触发器点击事件
 */
const handleCustomTriggerClick = () => {
  console.log('自定义触发器被点击 - 分享内容')
}

/**
 * 场景操作处理
 */
const handleScenarioAction = (action: string) => {
  console.log(`${scenarioType.value}应用场景 - 执行操作：${action}`)
}
const { resetScrollTop, updateScrollTop } = useScroll()
onShow(() => {
  resetScrollTop()
})
onPageScroll((e) => {
  updateScrollTop(e.scrollTop)
})
</script>

<style scoped>
/* 悬浮按钮动作按钮样式 */
:deep(.fab-action-button) {
  min-width: auto !important;
  box-sizing: border-box;
  width: 48px !important;
  height: 48px !important;
  border-radius: 24px !important;
  margin: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 自定义触发器按钮样式 */
:deep(.custom-trigger-button) {
  border-radius: 20px !important;
  padding: 0 16px !important;
  height: 40px !important;
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
