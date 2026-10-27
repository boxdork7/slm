<!-- Steps 步骤条 http://127.0.0.1:100/#/pages-sub/demo/wd/steps -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Steps 步骤条" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的步骤条形式，展示步骤进度">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="默认步骤条" vertical>
          <wd-steps :active="0">
            <wd-step />
            <wd-step />
            <wd-step />
          </wd-steps>
        </wd-cell>

        <wd-cell title="水平居中" vertical>
          <wd-steps :active="1" align-center>
            <wd-step />
            <wd-step />
            <wd-step />
          </wd-steps>
        </wd-cell>

        <wd-cell title="自定义图标" vertical>
          <wd-steps :active="1" align-center>
            <wd-step icon="check" />
            <wd-step icon="link" />
            <wd-step icon="clock" />
          </wd-steps>
        </wd-cell>
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 默认步骤条" :code="codes.basic.defaultTemplate" />
        <DemoCode title="模板 - 水平居中" :code="codes.basic.centerTemplate" />
        <DemoCode title="模板 - 自定义图标" :code="codes.basic.iconTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 标题和描述示例 -->
    <DemoSection title="标题和描述" desc="为步骤添加标题和描述信息">
      <wd-cell-group>
        <wd-cell title="带标题描述的步骤条" vertical>
          <wd-steps :active="titleStepsActive" align-center>
            <wd-step title="步骤1" description="注册1个账号" />
            <wd-step title="步骤2" description="登录账号并绑定手机" />
            <wd-step title="步骤3" description="完善个人信息" />
          </wd-steps>

          <view class="mt-4 flex justify-center space-x-2">
            <wd-button
              size="small"
              :disabled="titleStepsActive >= 2"
              @click="handleNextTitleStep"
            >
              下一步
            </wd-button>
            <wd-button size="small" plain @click="handleResetTitleSteps">
              重置
            </wd-button>
          </view>

          <view class="mt-2 text-center text-sm text-gray-600">
            当前步骤: {{ titleStepsActive + 1 }} / 3
          </view>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 标题和描述" :code="codes.titleDesc.template" />
        <DemoCode title="脚本 - 标题和描述" :code="codes.titleDesc.script" />
      </template>
    </DemoSection>

    <!-- 垂直步骤条示例 -->
    <DemoSection title="垂直步骤条" desc="垂直方向的步骤流程，适合详细的步骤说明">
      <wd-cell-group>
        <wd-cell title="纵向步骤条" vertical>
          <wd-steps :active="verticalStepsActive" vertical>
            <wd-step description="注册1个账号" />
            <wd-step description="登录账号并绑定手机，后面是必记长文案" />
            <wd-step description="完善个人信息" />
          </wd-steps>

          <view class="mt-4 flex space-x-2">
            <wd-button
              size="small"
              :disabled="verticalStepsActive >= 2"
              @click="handleNextVerticalStep"
            >
              下一步
            </wd-button>
            <wd-button size="small" plain @click="handleResetVerticalSteps">
              重置
            </wd-button>
          </view>
        </wd-cell>

        <wd-cell title="点状步骤条" vertical>
          <wd-steps :active="dotStepsActive" vertical dot>
            <wd-step description="注册1个账号" />
            <wd-step description="登录账号并绑定手机" />
            <wd-step description="完善个人信息" />
          </wd-steps>

          <view class="mt-4 flex space-x-2">
            <wd-button
              size="small"
              :disabled="dotStepsActive >= 2"
              @click="handleNextDotStep"
            >
              下一步
            </wd-button>
            <wd-button size="small" plain @click="handleResetDotSteps">
              重置
            </wd-button>
          </view>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 纵向步骤条" :code="codes.vertical.template" />
        <DemoCode title="模板 - 点状步骤条" :code="codes.vertical.dotTemplate" />
        <DemoCode title="脚本 - 垂直步骤条" :code="codes.vertical.script" />
      </template>
    </DemoSection>

    <!-- 步骤状态示例 -->
    <DemoSection title="步骤状态" desc="不同的步骤状态显示，包括错误状态">
      <wd-cell-group>
        <wd-cell title="错误状态" vertical>
          <wd-steps :active="1" align-center>
            <wd-step title="绑定手机" status="error" />
            <wd-step title="重新绑定手机" />
            <wd-step title="步骤3" />
          </wd-steps>
          <view class="mt-2 text-center text-sm text-gray-600">
            第一步显示错误状态，需要重新操作
          </view>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 错误状态" :code="codes.status.template" />
        <DemoCode title="脚本 - 步骤状态" :code="codes.status.script" />
      </template>
    </DemoSection>

    <!-- 自定义内容示例 -->
    <DemoSection title="自定义内容" desc="自定义步骤图标和内容，打造个性化步骤条">
      <wd-cell-group>
        <wd-cell title="自定义图标步骤" vertical>
          <wd-steps :active="customStepsActive" align-center>
            <wd-step title="订单确认" description="2024-01-15 10:30">
              <template #icon>
                <wd-icon name="check-outline" size="20px" color="#00c896" />
              </template>
            </wd-step>
            <wd-step title="付款成功" description="2024-01-15 10:35">
              <template #icon>
                <wd-icon name="money" size="20px" color="#00c896" />
              </template>
            </wd-step>
            <wd-step title="商品出库" description="待处理">
              <template #icon>
                <wd-icon name="order" size="20px" color="#c7c7cc" />
              </template>
            </wd-step>
            <wd-step title="物流运输" description="待处理">
              <template #icon>
                <wd-icon name="delivery" size="20px" color="#c7c7cc" />
              </template>
            </wd-step>
            <wd-step title="签收完成" description="待处理">
              <template #icon>
                <wd-icon name="star" size="20px" color="#c7c7cc" />
              </template>
            </wd-step>
          </wd-steps>

          <view class="mt-4 flex justify-center space-x-2">
            <wd-button
              size="small"
              :disabled="customStepsActive >= 4"
              @click="handleNextCustomStep"
            >
              模拟下一步
            </wd-button>
            <wd-button size="small" plain @click="handleResetCustomSteps">
              重置订单
            </wd-button>
          </view>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 自定义图标" :code="codes.custom.template" />
        <DemoCode title="脚本 - 自定义内容" :code="codes.custom.script" />
      </template>
    </DemoSection>

    <!-- 实际应用场景示例 -->
    <DemoSection title="实际应用场景" desc="常见业务场景中的步骤条应用">
      <!-- 场景展示区域 -->
      <view class="space-y-4">
        <!-- 场景切换器 -->
        <view class="px-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">选择应用场景</view>
          <view class="flex flex-wrap gap-2">
            <wd-button
              v-for="(scenario, key) in scenarios"
              :key="key"
              size="small"
              :type="currentScenario === key ? 'primary' : 'default'"
              @click="handleScenarioChange(key)"
            >
              {{ scenario.title }}
            </wd-button>
          </view>
        </view>

        <!-- 动态步骤条展示 -->
        <view class="mx-4 rounded-lg bg-gray-50 p-4">
          <wd-steps
            :active="scenarios[currentScenario].active"
            :align-center="!scenarios[currentScenario].vertical"
            :vertical="scenarios[currentScenario].vertical"
            :dot="scenarios[currentScenario].dot"
          >
            <wd-step
              v-for="(step, index) in scenarios[currentScenario].steps"
              :key="index"
              :title="step.title"
              :description="step.description"
              :icon="step.icon"
              :status="step.status"
            />
          </wd-steps>
        </view>

        <!-- 场景控制区域 -->
        <view class="px-4">
          <view class="flex justify-center space-x-2">
            <wd-button
              size="small"
              :disabled="scenarios[currentScenario].active >= scenarios[currentScenario].steps.length - 1"
              @click="handleScenarioNext"
            >
              {{ scenarios[currentScenario].nextText }}
            </wd-button>
            <wd-button size="small" plain @click="handleScenarioReset">
              重置
            </wd-button>
          </view>

          <view class="mt-2 text-center text-sm text-gray-600">
            {{ scenarios[currentScenario].description }}
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 动态场景" :code="codes.scenarios.template" />
        <DemoCode title="脚本 - 场景配置" :code="codes.scenarios.config" />
        <DemoCode title="脚本 - 场景控制" :code="codes.scenarios.handlers" />
      </template>
    </DemoSection>

    <!-- 操作日志示例 -->
    <DemoSection title="操作记录" desc="查看步骤条的操作历史记录">
      <!-- 日志展示区域 -->
      <view v-if="actionLogs.length > 0" class="space-y-4">
        <view class="mx-4 rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">操作日志</view>
          <view class="max-h-48 overflow-y-auto rounded bg-white p-3">
            <view
              v-for="(log, index) in actionLogs"
              :key="index"
              class="mb-3 border-b border-gray-100 pb-2 last:mb-0 last:border-b-0"
            >
              <view class="text-xs text-gray-500">{{ log.time }}</view>
              <view class="mt-1 text-sm text-gray-700">{{ log.message }}</view>
            </view>
          </view>
          <view class="mt-3">
            <wd-button size="small" plain @click="handleClearLogs">
              清空记录
            </wd-button>
          </view>
        </view>
      </view>

      <view v-else class="mx-4 rounded-lg bg-gray-50 p-4 text-center">
        <view class="text-sm text-gray-500">暂无操作记录</view>
        <view class="mt-2 text-xs text-gray-400">操作步骤条后会显示相关记录</view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 日志展示" :code="codes.logs.template" />
        <DemoCode title="脚本 - 日志管理" :code="codes.logs.script" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// ===== 组件状态管理 =====

// 标题步骤条状态
const titleStepsActive = ref<number>(0)

// 纵向步骤条状态
const verticalStepsActive = ref<number>(1)

// 点状步骤条状态
const dotStepsActive = ref<number>(1)

// 自定义步骤条状态
const customStepsActive = ref<number>(1)

// 当前场景
const currentScenario = ref<string>('register')

// 操作日志
interface ActionLog {
  time: string
  message: string
}

const actionLogs = ref<ActionLog[]>([])

// 应用场景配置
const scenarios = reactive({
  register: {
    title: '用户注册',
    active: 0,
    vertical: false,
    dot: false,
    nextText: '下一步',
    description: '用户注册流程，引导用户完成账号创建',
    steps: [
      { title: '填写信息', description: '输入用户名和密码' },
      { title: '验证手机', description: '验证手机号码' },
      { title: '完善资料', description: '填写个人信息' },
      { title: '注册成功', description: '账号创建完成' }
    ]
  },
  order: {
    title: '订单流程',
    active: 2,
    vertical: true,
    dot: false,
    nextText: '确认发货',
    description: '电商订单处理流程，跟踪订单状态',
    steps: [
      { title: '订单确认', description: '用户下单成功', icon: 'check-circle' },
      { title: '付款完成', description: '支付成功', icon: 'money' },
      { title: '商品出库', description: '正在准备发货', icon: 'package' },
      { title: '物流配送', description: '商品运输中', icon: 'logistics' },
      { title: '确认收货', description: '订单完成', icon: 'star' }
    ]
  },
  approval: {
    title: '审批流程',
    active: 1,
    vertical: true,
    dot: true,
    nextText: '提交审批',
    description: '企业审批流程，展示审批进度',
    steps: [
      { title: '发起申请', description: '员工提交申请' },
      { title: '部门审批', description: '部门主管审批中' },
      { title: '人事审批', description: '人事部门待审批' },
      { title: '财务审批', description: '财务部门待审批' },
      { title: '审批完成', description: '申请处理完成' }
    ]
  },
  install: {
    title: '安装向导',
    active: 0,
    vertical: false,
    dot: false,
    nextText: '下一步',
    description: '软件安装向导，引导用户完成安装',
    steps: [
      { title: '环境检测', description: '检查系统环境', status: 'error' },
      { title: '安装程序', description: '安装应用程序' },
      { title: '配置设置', description: '配置应用设置' },
      { title: '完成安装', description: '安装成功' }
    ]
  }
})

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    defaultTemplate: `<wd-steps :active="0">
  <wd-step />
  <wd-step />
  <wd-step />
</wd-steps>`,

    centerTemplate: `<wd-steps :active="1" align-center>
  <wd-step />
  <wd-step />
  <wd-step />
</wd-steps>`,

    iconTemplate: `<wd-steps :active="1" align-center>
  <wd-step icon="check" />
  <wd-step icon="link" />
  <wd-step icon="clock" />
</wd-steps>`,

    script: `import { ref } from 'vue'

// 步骤条当前激活状态
const active = ref(0)`
  },

  // 标题和描述代码
  titleDesc: {
    template: `<wd-steps :active="titleStepsActive" align-center>
  <wd-step title="步骤1" description="注册1个账号" />
  <wd-step title="步骤2" description="登录账号并绑定手机" />
  <wd-step title="步骤3" description="完善个人信息" />
</wd-steps>

<!-- 控制按钮 -->
<view class="mt-4 flex justify-center space-x-2">
  <wd-button
    size="small"
    :disabled="titleStepsActive >= 2"
    @click="handleNextTitleStep"
  >
    下一步
  </wd-button>
  <wd-button size="small" plain @click="handleResetTitleSteps">
    重置
  </wd-button>
</view>`,

    script: `import { ref } from 'vue'

const titleStepsActive = ref(0)

// 下一步
const handleNextTitleStep = () => {
  if (titleStepsActive.value < 2) {
    titleStepsActive.value++
    console.log('标题步骤条进入第', titleStepsActive.value + 1, '步')
  }
}

// 重置
const handleResetTitleSteps = () => {
  titleStepsActive.value = 0
  console.log('重置标题步骤条')
}`
  },

  // 垂直步骤条代码
  vertical: {
    template: `<wd-steps :active="verticalStepsActive" vertical>
  <wd-step description="注册1个账号" />
  <wd-step description="登录账号并绑定手机，后面是必记长文案" />
  <wd-step description="完善个人信息" />
</wd-steps>`,

    dotTemplate: `<wd-steps :active="dotStepsActive" vertical dot>
  <wd-step description="注册1个账号" />
  <wd-step description="登录账号并绑定手机" />
  <wd-step description="完善个人信息" />
</wd-steps>`,

    script: `import { ref } from 'vue'

const verticalStepsActive = ref(1)
const dotStepsActive = ref(1)

// 纵向步骤条下一步
const handleNextVerticalStep = () => {
  if (verticalStepsActive.value < 2) {
    verticalStepsActive.value++
  }
}

// 点状步骤条下一步
const handleNextDotStep = () => {
  if (dotStepsActive.value < 2) {
    dotStepsActive.value++
  }
}`
  },

  // 步骤状态代码
  status: {
    template: `<wd-steps :active="1" align-center>
  <wd-step title="绑定手机" status="error" />
  <wd-step title="重新绑定手机" />
  <wd-step title="步骤3" />
</wd-steps>`,

    script: `// 步骤状态类型
type StepStatus = 'finished' | 'process' | 'error' | 'wait'

// 使用错误状态
const errorStep = {
  title: '绑定手机',
  status: 'error' as StepStatus
}`
  },

  // 自定义内容代码
  custom: {
    template: `<wd-steps :active="customStepsActive" align-center>
  <wd-step title="订单确认" description="2024-01-15 10:30">
    <template #icon>
      <wd-icon name="check-outline" size="20px" color="#00c896" />
    </template>
  </wd-step>
  <wd-step title="付款成功" description="2024-01-15 10:35">
    <template #icon>
      <wd-icon name="money" size="20px" color="#00c896" />
    </template>
  </wd-step>
  <wd-step title="商品出库" description="待处理">
    <template #icon>
      <wd-icon name="order" size="20px" color="#c7c7cc" />
    </template>
  </wd-step>
</wd-steps>`,

    script: `import { ref } from 'vue'

const customStepsActive = ref(1)

// 自定义步骤下一步
const handleNextCustomStep = () => {
  if (customStepsActive.value < 4) {
    customStepsActive.value++
    console.log('订单流程进入第', customStepsActive.value + 1, '步')
  }
}`
  },

  // 应用场景代码
  scenarios: {
    template: `<!-- 场景切换器 -->
<view class="flex flex-wrap gap-2">
  <wd-button
    v-for="(scenario, key) in scenarios"
    :key="key"
    size="small"
    :type="currentScenario === key ? 'primary' : 'default'"
    @click="handleScenarioChange(key)"
  >
    {{ scenario.title }}
  </wd-button>
</view>

<!-- 动态步骤条 -->
<wd-steps
  :active="scenarios[currentScenario].active"
  :align-center="!scenarios[currentScenario].vertical"
  :vertical="scenarios[currentScenario].vertical"
  :dot="scenarios[currentScenario].dot"
>
  <wd-step
    v-for="(step, index) in scenarios[currentScenario].steps"
    :key="index"
    :title="step.title"
    :description="step.description"
    :icon="step.icon"
    :status="step.status"
  />
</wd-steps>`,

    config: `import { ref, reactive } from 'vue'

const currentScenario = ref('register')

const scenarios = reactive({
  register: {
    title: '用户注册',
    active: 0,
    vertical: false,
    dot: false,
    nextText: '下一步',
    description: '用户注册流程，引导用户完成账号创建',
    steps: [
      { title: '填写信息', description: '输入用户名和密码' },
      { title: '验证手机', description: '验证手机号码' },
      { title: '完善资料', description: '填写个人信息' },
      { title: '注册成功', description: '账号创建完成' }
    ]
  },
  order: {
    title: '订单流程',
    active: 2,
    vertical: true,
    dot: false,
    steps: [
      { title: '订单确认', description: '用户下单成功', icon: 'check-circle' },
      { title: '付款完成', description: '支付成功', icon: 'money' },
      { title: '商品出库', description: '正在准备发货', icon: 'package' }
    ]
  }
})`,

    handlers: `// 场景切换
const handleScenarioChange = (scenarioKey: string) => {
  currentScenario.value = scenarioKey
  const scenario = scenarios[scenarioKey]
  console.log('切换到', scenario.title, '场景')
}

// 场景下一步
const handleScenarioNext = () => {
  const scenario = scenarios[currentScenario.value]
  if (scenario.active < scenario.steps.length - 1) {
    scenario.active++
    console.log(scenario.title, '进入第', scenario.active + 1, '步')
  }
}

// 场景重置
const handleScenarioReset = () => {
  const scenario = scenarios[currentScenario.value]
  scenario.active = 0
  console.log('重置', scenario.title, '流程')
}`
  },

  // 日志管理代码
  logs: {
    template: `<!-- 日志展示区域 -->
<view v-if="actionLogs.length > 0" class="rounded-lg bg-gray-50 p-4">
  <view class="mb-3 text-sm text-gray-700 font-medium">操作日志</view>
  <view class="max-h-48 overflow-y-auto rounded bg-white p-3">
    <view
      v-for="(log, index) in actionLogs"
      :key="index"
      class="mb-3 border-b border-gray-100 pb-2 last:mb-0 last:border-b-0"
    >
      <view class="text-xs text-gray-500">{{ log.time }}</view>
      <view class="mt-1 text-sm text-gray-700">{{ log.message }}</view>
    </view>
  </view>
  <view class="mt-3">
    <wd-button size="small" plain @click="handleClearLogs">
      清空记录
    </wd-button>
  </view>
</view>`,

    script: `import { ref } from 'vue'

interface ActionLog {
  time: string
  message: string
}

const actionLogs = ref<ActionLog[]>([])

// 添加操作日志
const addActionLog = (message: string) => {
  const time = new Date().toLocaleTimeString()
  actionLogs.value.unshift({ time, message })

  // 保持日志数量不超过 15 条
  if (actionLogs.value.length > 15) {
    actionLogs.value = actionLogs.value.slice(0, 15)
  }
}

// 清空操作日志
const handleClearLogs = () => {
  actionLogs.value = []
  console.log('操作日志已清空')
}`
  }
}

// ===== API 文档数据 =====

// Props 属性文档 - Steps 组件
const apiProps = [
  {
    name: 'active',
    type: 'Number',
    default: '0',
    desc: '当前激活的步骤进度，以数字表示'
  },
  {
    name: 'vertical',
    type: 'Boolean',
    default: 'false',
    desc: '是否为垂直方向的步骤条'
  },
  {
    name: 'dot',
    type: 'Boolean',
    default: 'false',
    desc: '是否为点状步骤条样式'
  },
  {
    name: 'align-center',
    type: 'Boolean',
    default: 'false',
    desc: '是否将步骤条水平居中显示，只对横向步骤条有效'
  },
  {
    name: 'space',
    type: 'String',
    default: '""',
    desc: '步骤条之间的间距，默认为自动计算'
  },
  {
    name: 'custom-style',
    type: 'String',
    default: '""',
    desc: '自定义根节点样式'
  },
  {
    name: 'custom-class',
    type: 'String',
    default: '""',
    desc: '自定义根节点样式类'
  }
]

// Step 子组件 Props
const stepProps = [
  {
    name: 'title',
    type: 'String',
    default: '""',
    desc: '步骤标题，如果没有则使用默认文案'
  },
  {
    name: 'description',
    type: 'String',
    default: '""',
    desc: '步骤描述信息'
  },
  {
    name: 'icon',
    type: 'String',
    default: '""',
    desc: '步骤图标名称'
  },
  {
    name: 'status',
    type: 'String',
    default: '""',
    desc: '步骤状态，可选值：finished / process / error / wait'
  },
  {
    name: 'custom-style',
    type: 'String',
    default: '""',
    desc: '自定义根节点样式'
  },
  {
    name: 'custom-class',
    type: 'String',
    default: '""',
    desc: '自定义根节点样式类'
  }
]

// Methods 方法文档（Steps 组件没有暴露方法）
const apiMethods: any[] = []

// Events 事件文档（Steps 组件没有事件）
const apiEvents: any[] = []

// ===== 工具方法 =====

/**
 * 添加操作日志
 */
const addActionLog = (message: string) => {
  const time = new Date().toLocaleTimeString()
  actionLogs.value.unshift({ time, message })

  // 保持日志数量不超过 15 条
  if (actionLogs.value.length > 15) {
    actionLogs.value = actionLogs.value.slice(0, 15)
  }
}

// ===== 事件处理方法 =====

/**
 * 标题步骤条下一步
 */
const handleNextTitleStep = () => {
  if (titleStepsActive.value < 2) {
    titleStepsActive.value++
    addActionLog(`标题步骤条进入第 ${titleStepsActive.value + 1} 步`)
  }
}

/**
 * 重置标题步骤条
 */
const handleResetTitleSteps = () => {
  titleStepsActive.value = 0
  addActionLog('重置标题步骤条')
}

/**
 * 纵向步骤条下一步
 */
const handleNextVerticalStep = () => {
  if (verticalStepsActive.value < 2) {
    verticalStepsActive.value++
    addActionLog(`纵向步骤条进入第 ${verticalStepsActive.value + 1} 步`)
  }
}

/**
 * 重置纵向步骤条
 */
const handleResetVerticalSteps = () => {
  verticalStepsActive.value = 0
  addActionLog('重置纵向步骤条')
}

/**
 * 点状步骤条下一步
 */
const handleNextDotStep = () => {
  if (dotStepsActive.value < 2) {
    dotStepsActive.value++
    addActionLog(`点状步骤条进入第 ${dotStepsActive.value + 1} 步`)
  }
}

/**
 * 重置点状步骤条
 */
const handleResetDotSteps = () => {
  dotStepsActive.value = 0
  addActionLog('重置点状步骤条')
}

/**
 * 自定义步骤条下一步
 */
const handleNextCustomStep = () => {
  if (customStepsActive.value < 4) {
    customStepsActive.value++
    addActionLog(`订单流程进入第 ${customStepsActive.value + 1} 步`)
  }
}

/**
 * 重置自定义步骤条
 */
const handleResetCustomSteps = () => {
  customStepsActive.value = 0
  addActionLog('重置订单流程')
}

/**
 * 场景切换
 */
const handleScenarioChange = (scenarioKey: string) => {
  currentScenario.value = scenarioKey
  const scenario = scenarios[scenarioKey as keyof typeof scenarios]
  addActionLog(`切换到 ${scenario.title} 场景`)
}

/**
 * 场景下一步
 */
const handleScenarioNext = () => {
  const scenario = scenarios[currentScenario.value as keyof typeof scenarios]
  if (scenario.active < scenario.steps.length - 1) {
    scenario.active++
    addActionLog(`${scenario.title} 进入第 ${scenario.active + 1} 步`)
  }
}

/**
 * 场景重置
 */
const handleScenarioReset = () => {
  const scenario = scenarios[currentScenario.value as keyof typeof scenarios]
  scenario.active = 0
  addActionLog(`重置 ${scenario.title} 流程`)
}

/**
 * 清空操作日志
 */
const handleClearLogs = () => {
  actionLogs.value = []
  addActionLog('操作日志已清空')
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
