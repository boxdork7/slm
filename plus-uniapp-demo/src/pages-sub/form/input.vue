<!-- Input 输入框 http://127.0.0.1:100/#/pages-sub/demo/wd/input -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Input 输入框" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最基础的输入框功能，支持文本输入和事件监听">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="默认输入框" vertical>
          <wd-input
            v-model="basicValue"
            placeholder="请输入内容"
            @input="handleInput"
            @change="handleChange"
            @blur="handleBlur"
          />
        </wd-cell>

        <wd-cell title="带前缀和后缀图标" vertical>
          <wd-input
            v-model="iconValue"
            placeholder="请输入内容"
            prefix-icon="search"
            suffix-icon="setting"
            clearable
            @input="handleInput"
          />
        </wd-cell>

        <wd-cell title="数字类型输入框" vertical>
          <wd-input
            v-model="numberValue"
            type="number"
            placeholder="请输入数字"
            @input="handleInput"
          />
        </wd-cell>
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 默认输入框" :code="codes.basic.defaultTemplate" />
        <DemoCode title="模板 - 带图标输入框" :code="codes.basic.iconTemplate" />
        <DemoCode title="模板 - 数字类型" :code="codes.basic.numberTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 输入框状态示例 -->
    <DemoSection title="输入框状态" desc="不同状态下的输入框展示效果">
      <wd-cell-group>
        <wd-cell title="禁用状态" vertical>
          <wd-input
            v-model="disabledValue"
            placeholder="这是禁用状态"
            disabled
          />
        </wd-cell>

        <wd-cell title="只读状态" vertical>
          <wd-input
            v-model="readonlyValue"
            placeholder="这是只读状态"
            readonly
          />
        </wd-cell>

        <wd-cell title="错误状态" vertical>
          <wd-input
            v-model="errorValue"
            placeholder="请输入正确内容"
            error
          />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 禁用状态" :code="codes.status.disabledTemplate" />
        <DemoCode title="模板 - 只读状态" :code="codes.status.readonlyTemplate" />
        <DemoCode title="模板 - 错误状态" :code="codes.status.errorTemplate" />
        <DemoCode title="脚本 - 状态示例" :code="codes.status.script" />
      </template>
    </DemoSection>

    <!-- 功能特性示例 -->
    <DemoSection title="功能特性" desc="输入框的各种功能特性和交互效果">
      <wd-cell-group>
        <wd-cell title="可清空输入框" vertical>
          <wd-input
            v-model="clearableValue"
            placeholder="支持一键清空"
            clearable
            @clear="handleClear"
          />
        </wd-cell>

        <wd-cell title="聚焦时显示清空" vertical>
          <wd-input
            v-model="focusClearValue"
            placeholder="聚焦时显示清空按钮"
            clearable
            clear-trigger="focus"
          />
        </wd-cell>

        <wd-cell title="密码输入框" vertical>
          <wd-input
            v-model="passwordValue"
            placeholder="请输入密码"
            show-password
            clearable
          />
        </wd-cell>

        <wd-cell title="字数限制" vertical>
          <wd-input
            v-model="limitValue"
            placeholder="最多输入20个字符"
            :maxlength="20"
            show-word-limit
          />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 可清空输入框" :code="codes.features.clearableTemplate" />
        <DemoCode title="模板 - 聚焦清空" :code="codes.features.focusClearTemplate" />
        <DemoCode title="模板 - 密码输入框" :code="codes.features.passwordTemplate" />
        <DemoCode title="模板 - 字数限制" :code="codes.features.limitTemplate" />
        <DemoCode title="脚本 - 功能特性" :code="codes.features.script" />
      </template>
    </DemoSection>

    <!-- Cell 样式示例 -->
    <DemoSection title="Cell 样式" desc="在表单中常用的 Cell 样式布局">
      <wd-cell-group border>
        <wd-input
          v-model="cellBasicValue"
          label="基本用法"
          placeholder="请输入内容"
          @input="handleInput"
        />

        <wd-input
          v-model="cellDisabledValue"
          label="禁用状态"
          placeholder="输入框已禁用"
          disabled
        />

        <wd-input
          v-model="cellPasswordValue"
          label="密码框"
          placeholder="请输入密码"
          show-password
          clearable
        />

        <wd-input
          v-model="cellErrorValue"
          label="错误状态"
          placeholder="请输入正确内容"
          error
        />

        <wd-input
          v-model="cellRequiredValue"
          label="必填项"
          placeholder="此项为必填"
          required
        />

        <wd-input
          v-model="cellLimitValue"
          label="字数限制"
          placeholder="最多20字符"
          :maxlength="20"
          show-word-limit
          clearable
        />

        <wd-input
          v-model="cellIconValue"
          label="带图标"
          placeholder="请输入内容"
          prefix-icon="user"
          suffix-icon="edit"
        />

        <wd-input
          v-model="cellSlotValue"
          label="自定义插槽"
          placeholder="请输入验证码"
          clearable
          center
        >
          <template #suffix>
            <wd-button
              size="small"
              type="primary"
              @click="handleGetCode"
            >
              获取验证码
            </wd-button>
          </template>
        </wd-input>

        <wd-input
          v-model="cellLargeValue"
          label="大尺寸"
          placeholder="请输入内容"
          size="large"
          clearable
        />
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - Cell 样式" :code="codes.cell.template" />
        <DemoCode title="脚本 - Cell 样式" :code="codes.cell.script" />
      </template>
    </DemoSection>

    <!-- 高级配置示例 -->
    <DemoSection title="高级配置" desc="更多高级配置选项和自定义样式">
      <!-- 自定义样式示例 -->
      <view class="space-y-4">
        <view class="mx-4 rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">无边框样式</view>
          <view class="flex items-center">
            <wd-input
              v-model="priceValue"
              no-border
              placeholder="请输入价格"
              type="number"
              custom-style="display: inline-block; width: 120px; vertical-align: middle;"
            />
            <text class="ml-2 text-sm text-gray-600">元</text>
          </view>
        </view>

        <view class="mx-4 rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">右对齐输入</view>
          <wd-input
            v-model="alignRightValue"
            placeholder="右对齐输入"

             clearable align-right
          />
        </view>

        <view class="mx-4 rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">自定义确认类型</view>
          <wd-input
            v-model="confirmValue"
            placeholder="点击键盘搜索按钮"
            confirm-type="search"
            @confirm="handleConfirm"
          />
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 无边框样式" :code="codes.advanced.noBorderTemplate" />
        <DemoCode title="模板 - 右对齐输入" :code="codes.advanced.alignRightTemplate" />
        <DemoCode title="模板 - 确认类型" :code="codes.advanced.confirmTemplate" />
        <DemoCode title="脚本 - 高级配置" :code="codes.advanced.script" />
      </template>
    </DemoSection>

    <!-- 事件监听示例 -->
    <DemoSection title="事件监听" desc="监听输入框的各种事件和交互">
      <!-- 事件演示区域 -->
      <view class="space-y-4">
        <!-- 事件测试输入框 -->
        <wd-cell-group>
          <wd-input
            v-model="eventValue"
            label="事件测试"
            placeholder="输入内容测试事件"
            prefix-icon="search"
            suffix-icon="setting"
            clearable
            show-password
            @input="handleEventInput"
            @change="handleEventChange"
            @focus="handleEventFocus"
            @blur="handleEventBlur"
            @clear="handleEventClear"
            @confirm="handleEventConfirm"
            @clickprefixicon="handleClickPrefixIcon"
            @clicksuffixicon="handleClickSuffixIcon"
            @click="handleEventClick"
          />
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

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// ===== 组件状态管理 =====

// 基本用法相关值
const basicValue = ref<string>('')
const iconValue = ref<string>('')
const numberValue = ref<number | ''>('')

// 状态示例相关值
const disabledValue = ref<string>('这是禁用状态')
const readonlyValue = ref<string>('这是只读状态')
const errorValue = ref<string>('')

// 功能特性相关值
const clearableValue = ref<string>('支持清空')
const focusClearValue = ref<string>('聚焦清空')
const passwordValue = ref<string>('password')
const limitValue = ref<string>('测试字数')

// Cell 样式相关值
const cellBasicValue = ref<string>('')
const cellDisabledValue = ref<string>('该输入框禁用')
const cellPasswordValue = ref<string>('12345678')
const cellErrorValue = ref<string>('')
const cellRequiredValue = ref<string>('')
const cellLimitValue = ref<string>('')
const cellIconValue = ref<string>('')
const cellSlotValue = ref<string>('')
const cellLargeValue = ref<string>('')

// 高级配置相关值
const priceValue = ref<number | ''>('')
const alignRightValue = ref<string>('')
const confirmValue = ref<string>('')

// 事件测试相关值
const eventValue = ref<string>('')

// 事件日志状态
interface EventLog {
  time: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

const eventLogs = ref<EventLog[]>([])

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    defaultTemplate: `<wd-input
  v-model="basicValue"
  placeholder="请输入内容"
  @input="handleInput"
  @change="handleChange"
  @blur="handleBlur"
/>`,

    iconTemplate: `<wd-input
  v-model="iconValue"
  placeholder="请输入内容"
  prefix-icon="search"
  suffix-icon="setting"
  clearable
  @input="handleInput"
/>`,

    numberTemplate: `<wd-input
  v-model="numberValue"
  type="number"
  placeholder="请输入数字"
  @input="handleInput"
/>`,

    script: `import { ref } from 'vue'

// 基本用法相关值
const basicValue = ref('')
const iconValue = ref('')
const numberValue = ref('')

// 输入事件处理
const handleInput = (event) => {
  console.log('输入事件:', event)
}

// 值改变事件处理
const handleChange = (event) => {
  console.log('值改变:', event)
}

// 失焦事件处理
const handleBlur = (event) => {
  console.log('失焦事件:', event)
}`,
  },

  // 状态示例代码
  status: {
    disabledTemplate: `<wd-input
  v-model="disabledValue"
  placeholder="这是禁用状态"
  disabled
/>`,

    readonlyTemplate: `<wd-input
  v-model="readonlyValue"
  placeholder="这是只读状态"
  readonly
/>`,

    errorTemplate: `<wd-input
  v-model="errorValue"
  placeholder="请输入正确内容"
  error
/>`,

    script: `// 状态示例相关值
const disabledValue = ref('这是禁用状态')
const readonlyValue = ref('这是只读状态')
const errorValue = ref('')`,
  },

  // 功能特性代码
  features: {
    clearableTemplate: `<wd-input
  v-model="clearableValue"
  placeholder="支持一键清空"
  clearable
  @clear="handleClear"
/>`,

    focusClearTemplate: `<wd-input
  v-model="focusClearValue"
  placeholder="聚焦时显示清空按钮"
  clearable
  clear-trigger="focus"
/>`,

    passwordTemplate: `<wd-input
  v-model="passwordValue"
  placeholder="请输入密码"
  show-password
  clearable
/>`,

    limitTemplate: `<wd-input
  v-model="limitValue"
  placeholder="最多输入20个字符"
  :maxlength="20"
  show-word-limit
/>`,

    script: `// 功能特性相关值
const clearableValue = ref('支持清空')
const focusClearValue = ref('聚焦清空')
const passwordValue = ref('password')
const limitValue = ref('测试字数')

// 清空事件处理
const handleClear = () => {
  console.log('输入框已清空')
}`,
  },

  // Cell 样式代码
  cell: {
    template: `<wd-cell-group border>
  <!-- 基本用法 -->
  <wd-input
    v-model="cellBasicValue"
    label="基本用法"
    placeholder="请输入内容"
  />

  <!-- 禁用状态 -->
  <wd-input
    v-model="cellDisabledValue"
    label="禁用状态"
    placeholder="输入框已禁用"
    disabled
  />

  <!-- 密码框 -->
  <wd-input
    v-model="cellPasswordValue"
    label="密码框"
    placeholder="请输入密码"
    show-password
    clearable
  />

  <!-- 必填项 -->
  <wd-input
    v-model="cellRequiredValue"
    label="必填项"
    placeholder="此项为必填"
    required
  />

  <!-- 自定义插槽 -->
  <wd-input
    v-model="cellSlotValue"
    label="自定义插槽"
    placeholder="请输入验证码"
    clearable
    center
  >
    <template #suffix>
      <wd-button size="small" type="primary">
        获取验证码
      </wd-button>
    </template>
  </wd-input>

  <!-- 大尺寸 -->
  <wd-input
    v-model="cellLargeValue"
    label="大尺寸"
    placeholder="请输入内容"
    size="large"
    clearable
  />
</wd-cell-group>`,

    script: `// Cell 样式相关值
const cellBasicValue = ref('')
const cellDisabledValue = ref('该输入框禁用')
const cellPasswordValue = ref('12345678')
const cellRequiredValue = ref('')
const cellSlotValue = ref('')
const cellLargeValue = ref('')

// 获取验证码
const handleGetCode = () => {
  console.log('获取验证码')
}`,
  },

  // 高级配置代码
  advanced: {
    noBorderTemplate: `<view class="flex items-center">
  <wd-input
    v-model="priceValue"
    no-border
    placeholder="请输入价格"
    type="number"
    custom-style="display: inline-block; width: 120px; vertical-align: middle;"
  />
  <text class="ml-2 text-sm text-gray-600">元</text>
</view>`,

    alignRightTemplate: `<wd-input
  v-model="alignRightValue"
  placeholder="右对齐输入"
  align-right
  clearable
/>`,

    confirmTemplate: `<wd-input
  v-model="confirmValue"
  placeholder="点击键盘搜索按钮"
  confirm-type="search"
  @confirm="handleConfirm"
/>`,

    script: `// 高级配置相关值
const priceValue = ref('')
const alignRightValue = ref('')
const confirmValue = ref('')

// 确认输入事件处理
const handleConfirm = (event) => {
  console.log('确认输入:', event)
}`,
  },

  // 事件监听代码
  events: {
    template: `<wd-input
  v-model="eventValue"
  label="事件测试"
  placeholder="输入内容测试事件"
  prefix-icon="search"
  suffix-icon="setting"
  clearable
  show-password
  @input="handleEventInput"
  @change="handleEventChange"
  @focus="handleEventFocus"
  @blur="handleEventBlur"
  @clear="handleEventClear"
  @confirm="handleEventConfirm"
  @clickprefixicon="handleClickPrefixIcon"
  @clicksuffixicon="handleClickSuffixIcon"
  @click="handleEventClick"
/>`,

    script: `const eventValue = ref('')
const eventLogs = ref([])

// 添加事件日志
const addEventLog = (message, type = 'info') => {
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

// 事件处理方法
const handleEventInput = (event) => {
  addEventLog(\`输入事件: \${event.value}\`, 'info')
}

const handleEventChange = (event) => {
  addEventLog(\`值改变: \${event.value}\`, 'success')
}

const handleEventFocus = (event) => {
  addEventLog('获得焦点', 'success')
}

const handleEventBlur = (event) => {
  addEventLog('失去焦点', 'warning')
}

const handleEventClear = () => {
  addEventLog('清空输入框', 'warning')
}

const handleClickPrefixIcon = () => {
  addEventLog('点击前置图标', 'info')
}

const handleClickSuffixIcon = () => {
  addEventLog('点击后置图标', 'info')
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
    desc: '绑定值',
  },
  {
    name: 'type',
    type: 'String',
    default: '"text"',
    desc: '输入框类型，可选值：text / number / digit / idcard / safe-password / password / nickname / tel',
  },
  {
    name: 'placeholder',
    type: 'String',
    default: '""',
    desc: '占位文本',
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: '是否禁用',
  },
  {
    name: 'readonly',
    type: 'Boolean',
    default: 'false',
    desc: '是否只读',
  },
  {
    name: 'clearable',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示清空按钮',
  },
  {
    name: 'show-password',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示密码切换按钮',
  },
  {
    name: 'prefix-icon',
    type: 'String',
    default: '""',
    desc: '前置图标名称',
  },
  {
    name: 'suffix-icon',
    type: 'String',
    default: '""',
    desc: '后置图标名称',
  },
  {
    name: 'maxlength',
    type: 'Number',
    default: '-1',
    desc: '最大输入长度，-1 表示不限制',
  },
  {
    name: 'show-word-limit',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示字数统计，需要同时设置 maxlength',
  },
  {
    name: 'label',
    type: 'String',
    default: '""',
    desc: '左侧标题',
  },
  {
    name: 'label-width',
    type: 'String | Number',
    default: '"140"',
    desc: '左侧标题宽度',
  },
  {
    name: 'size',
    type: 'String',
    default: '""',
    desc: '输入框尺寸，可选值：large',
  },
  {
    name: 'error',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示为错误状态',
  },
  {
    name: 'center',
    type: 'Boolean',
    default: 'false',
    desc: '当有 label 属性时，设置标题和输入框垂直居中',
  },
  {
    name: 'no-border',
    type: 'Boolean',
    default: 'false',
    desc: '是否隐藏下划线',
  },
  {
    name: 'required',
    type: 'Boolean',
    default: 'false',
    desc: '是否必填',
  },
  {
    name: 'align-right',
    type: 'Boolean',
    default: 'false',
    desc: '输入框的值靠右展示',
  },
  {
    name: 'clear-trigger',
    type: 'String',
    default: '"always"',
    desc: '显示清除图标的时机，可选值：always / focus',
  },
  {
    name: 'focus-when-clear',
    type: 'Boolean',
    default: 'true',
    desc: '是否在点击清除按钮时聚焦输入框',
  },
  {
    name: 'confirm-type',
    type: 'String',
    default: '"done"',
    desc: '设置键盘右下角按钮的文字，可选值：send / search / next / go / done',
  },
  {
    name: 'focus',
    type: 'Boolean',
    default: 'false',
    desc: '获取焦点',
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
    name: 'input',
    desc: '输入时触发，参数为 event = { value }',
  },
  {
    name: 'change',
    desc: '值改变时触发，参数为 event = { value }',
  },
  {
    name: 'focus',
    desc: '获得焦点时触发，参数为 event',
  },
  {
    name: 'blur',
    desc: '失去焦点时触发，参数为 event = { value }',
  },
  {
    name: 'clear',
    desc: '点击清空按钮时触发',
  },
  {
    name: 'confirm',
    desc: '点击键盘确认按钮时触发，参数为 event',
  },
  {
    name: 'clickprefixicon',
    desc: '点击前置图标时触发',
  },
  {
    name: 'clicksuffixicon',
    desc: '点击后置图标时触发',
  },
  {
    name: 'click',
    desc: '点击输入框时触发，参数为 event',
  },
  {
    name: 'keyboardheightchange',
    desc: '键盘高度变化时触发，参数为 event',
  },
]

// Methods 方法文档（Input 组件没有暴露方法）
const apiMethods: any[] = []

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

// ===== 事件处理方法 =====

/**
 * 基本输入事件处理
 */
const handleInput = (event: any) => {
  console.log('输入事件:', event)
}

/**
 * 值改变事件处理
 */
const handleChange = (event: any) => {
  console.log('值改变:', event)
}

/**
 * 失焦事件处理
 */
const handleBlur = (event: any) => {
  console.log('失焦事件:', event)
}

/**
 * 清空事件处理
 */
const handleClear = () => {
  console.log('输入框已清空')
}

/**
 * 获取验证码
 */
const handleGetCode = () => {
  console.log('获取验证码')
}

/**
 * 确认输入事件处理
 */
const handleConfirm = (event: any) => {
  console.log('确认输入:', event)
}

// === 事件监听示例处理方法 ===

/**
 * 事件测试 - 输入事件
 */
const handleEventInput = (event: any) => {
  addEventLog(`输入事件: ${event.value}`, 'info')
}

/**
 * 事件测试 - 值改变事件
 */
const handleEventChange = (event: any) => {
  addEventLog(`值改变: ${event.value}`, 'success')
}

/**
 * 事件测试 - 获得焦点事件
 */
const handleEventFocus = (event: any) => {
  addEventLog('获得焦点', 'success')
}

/**
 * 事件测试 - 失去焦点事件
 */
const handleEventBlur = (event: any) => {
  addEventLog(`失去焦点: ${event.value}`, 'warning')
}

/**
 * 事件测试 - 清空事件
 */
const handleEventClear = () => {
  addEventLog('清空输入框', 'warning')
}

/**
 * 事件测试 - 确认输入事件
 */
const handleEventConfirm = (event: any) => {
  addEventLog(`确认输入: ${event.value}`, 'success')
}

/**
 * 事件测试 - 点击前置图标事件
 */
const handleClickPrefixIcon = () => {
  addEventLog('点击前置图标', 'info')
}

/**
 * 事件测试 - 点击后置图标事件
 */
const handleClickSuffixIcon = () => {
  addEventLog('点击后置图标', 'info')
}

/**
 * 事件测试 - 点击输入框事件
 */
const handleEventClick = (event: MouseEvent) => {
  addEventLog('点击输入框', 'info')
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
// 自定义文本样式
.custom-txt {
  @apply inline-block align-middle text-sm leading-6;
}

// 按钮样式
:deep(.button) {
  @apply ml-2 align-middle;
}
</style>
