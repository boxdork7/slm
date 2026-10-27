<!-- PasswordInput 密码输入框 http://127.0.0.1:100/#/pages-sub/demo/wd/passwordinput -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="PasswordInput 密码输入框" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的密码输入框，支持圆点遮罩显示">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <wd-cell title="默认4位密码" vertical>
          <wd-password-input
            v-model="basicPassword"
            :focused="basicFocused"
            :use-external-keyboard="true"
            info="请输入4位数字密码"
            @focus="handleBasicFocus"
            @blur="handleBasicBlur"
          />
        </wd-cell>

        <wd-cell title="6位验证码" vertical>
          <wd-password-input
            v-model="longPassword"
            :length="6"
            :focused="longFocused"
            :use-external-keyboard="true"
            info="请输入6位验证码"
            @focus="handleLongFocus"
            @blur="handleLongBlur"
          />
        </wd-cell>
      </view>

      <!-- 统一键盘 -->
      <wd-number-keyboard
        v-model:visible="keyboardVisible"
        v-model="currentPassword"
        :maxlength="currentMaxLength"
        :title="currentKeyboardTitle"
        @close="handleKeyboardClose"
      />

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 默认4位密码" :code="codes.basic.defaultTemplate" />
        <DemoCode title="模板 - 6位验证码" :code="codes.basic.longTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 显示样式示例 -->
    <DemoSection title="显示样式" desc="不同的显示方式和外观配置">
      <view class="space-y-4">
        <wd-cell title="明文显示" vertical>
          <wd-password-input
            v-model="plainPassword"
            :mask="false"
            :focused="plainFocused"
            :use-external-keyboard="true"
            info="明文显示输入内容"
            @focus="handlePlainFocus"
            @blur="handlePlainBlur"
          />
        </wd-cell>

        <wd-cell title="自定义间距" vertical>
          <wd-password-input
            v-model="gutterPassword"
            :gutter="10"
            :focused="gutterFocused"
            :use-external-keyboard="true"
            info="间距设置为10rpx"
            @focus="handleGutterFocus"
            @blur="handleGutterBlur"
          />
        </wd-cell>

        <wd-cell title="自定义背景色" vertical>
          <wd-password-input
            v-model="colorPassword"
            bg-color="#E6F3FF"
            :focused="colorFocused"
            :use-external-keyboard="true"
            info="自定义背景色"
            @focus="handleColorFocus"
            @blur="handleColorBlur"
          />
        </wd-cell>
      </view>

      <template #codes>
        <DemoCode title="模板 - 明文显示" :code="codes.style.plainTemplate" />
        <DemoCode title="模板 - 自定义间距" :code="codes.style.gutterTemplate" />
        <DemoCode title="模板 - 自定义背景色" :code="codes.style.colorTemplate" />
        <DemoCode title="脚本 - 显示样式" :code="codes.style.script" />
      </template>
    </DemoSection>

    <!-- 状态反馈示例 -->
    <DemoSection title="状态反馈" desc="输入状态和错误提示">
      <view class="space-y-4">
        <wd-cell title="成功状态" vertical>
          <wd-password-input
            v-model="successPassword"
            :focused="successFocused"
            :use-external-keyboard="true"
            :info="successInfo"
            @focus="handleSuccessFocus"
            @blur="handleSuccessBlur"
          />
        </wd-cell>

        <wd-cell title="错误状态" vertical>
          <wd-password-input
            v-model="errorPassword"
            :focused="errorFocused"
            :use-external-keyboard="true"
            :error-info="errorInfo"
            @focus="handleErrorFocus"
            @blur="handleErrorBlur"
          />
        </wd-cell>

        <wd-cell title="验证状态" vertical>
          <wd-password-input
            v-model="validatePassword"
            :focused="validateFocused"
            :use-external-keyboard="true"
            :info="validateInfo"
            :error-info="validateError"
            @focus="handleValidateFocus"
            @blur="handleValidateBlur"
          />
        </wd-cell>
      </view>

      <template #codes>
        <DemoCode title="模板 - 状态反馈" :code="codes.state.template" />
        <DemoCode title="脚本 - 状态处理" :code="codes.state.script" />
      </template>
    </DemoSection>

    <!-- 内置键盘示例 -->
    <DemoSection title="内置键盘" desc="使用组件内置的数字键盘">
      <view class="space-y-4">
        <wd-cell title="内置键盘" vertical>
          <wd-password-input
            v-model="internalPassword"
            :use-external-keyboard="false"
            keyboard-title="请输入密码"
            keyboard-close-text="确认"
            keyboard-delete-text="删除"
            info="点击输入框调起内置键盘"
            @focus="handleInternalFocus"
            @blur="handleInternalBlur"
          />
        </wd-cell>

        <wd-cell title="键盘配置" vertical>
          <wd-password-input
            v-model="configPassword"
            :length="8"
            :use-external-keyboard="false"
            keyboard-title="输入8位密码"
            :keyboard-modal="true"
            :keyboard-hide-on-click-outside="false"
            info="8位密码，模态键盘"
            @focus="handleConfigFocus"
            @blur="handleConfigBlur"
          />
        </wd-cell>
      </view>

      <template #codes>
        <DemoCode title="模板 - 内置键盘" :code="codes.internal.basicTemplate" />
        <DemoCode title="模板 - 键盘配置" :code="codes.internal.configTemplate" />
        <DemoCode title="脚本 - 内置键盘" :code="codes.internal.script" />
      </template>
    </DemoSection>

    <!-- 事件监听示例 -->
    <DemoSection title="事件监听" desc="监听输入框的各种事件">
      <!-- 状态显示区域 -->
      <view class="space-y-4">
        <wd-cell title="事件监听演示" vertical>
          <wd-password-input
            v-model="eventPassword"
            :focused="eventFocused"
            :use-external-keyboard="true"
            info="观察下方事件日志"
            @focus="handleEventFocus"
            @blur="handleEventBlur"
          />
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
        <!-- 登录密码场景 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">登录密码场景</view>
          <view class="mx-4 rounded-lg bg-gray-50 p-4">
            <view class="mb-3 text-center text-base font-medium">请输入登录密码</view>
            <wd-password-input
              v-model="loginPassword"
              mask
              :length="6"
              :focused="loginFocused"
              :use-external-keyboard="true"
              :error-info="loginError"
              @focus="handleLoginFocus"
              @blur="handleLoginBlur"
            />
            <view class="mt-4 flex gap-3">
              <wd-button size="small" @click="validateLogin">验证密码</wd-button>
              <wd-button size="small" type="text" @click="resetLogin">重置</wd-button>
            </view>
          </view>
        </view>

        <!-- 短信验证码场景 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">短信验证码场景</view>
          <view class="mx-4 rounded-lg bg-blue-50 p-4">
            <view class="mb-2 text-center text-sm text-blue-600">验证码已发送至 138****8888</view>
            <wd-password-input
              v-model="smsCode"
              :focused="smsFocused"
              :use-external-keyboard="true"
              :info="smsInfo"
              @focus="handleSmsFocus"
              @blur="handleSmsBlur"
            />
            <view class="mt-3 text-center">
              <wd-button
                size="small"
                type="text"
                :disabled="countdown > 0"
                @click="resendSms"
              >
                {{ countdown > 0 ? `${countdown}s后重发` : '重新发送' }}
              </wd-button>
            </view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 登录密码场景" :code="codes.scenarios.loginTemplate" />
        <DemoCode title="脚本 - 登录密码处理" :code="codes.scenarios.loginScript" />
        <DemoCode title="模板 - 短信验证码场景" :code="codes.scenarios.smsTemplate" />
        <DemoCode title="脚本 - 短信验证码处理" :code="codes.scenarios.smsScript" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

// ===== 组件状态管理 =====

// 基本用法状态 - 确保都是字符串类型
const basicPassword = ref<string>('12')
const longPassword = ref<string>('123')
const basicFocused = ref<boolean>(false)
const longFocused = ref<boolean>(false)

// 显示样式状态
const plainPassword = ref<string>('abc')
const gutterPassword = ref<string>('456')
const colorPassword = ref<string>('789')
const plainFocused = ref<boolean>(false)
const gutterFocused = ref<boolean>(false)
const colorFocused = ref<boolean>(false)

// 状态反馈
const successPassword = ref<string>('1234')
const errorPassword = ref<string>('1111')
const validatePassword = ref<string>('')
const successFocused = ref<boolean>(false)
const errorFocused = ref<boolean>(false)
const validateFocused = ref<boolean>(false)

// 内置键盘状态
const internalPassword = ref<string>('')
const configPassword = ref<string>('')

// 事件监听状态
const eventPassword = ref<string>('')
const eventFocused = ref<boolean>(false)

// 应用场景状态
const loginPassword = ref<string>('')
const smsCode = ref<string>('')
const loginFocused = ref<boolean>(false)
const smsFocused = ref<boolean>(false)
const countdown = ref<number>(0)

// 键盘管理状态
const keyboardVisible = ref<boolean>(false)
const currentPassword = ref<string>('')
const currentMaxLength = ref<number>(4)
const currentKeyboardTitle = ref<string>('')
const currentInputRef = ref<string>('')

// 事件日志状态
interface EventLog {
  time: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

const eventLogs = ref<EventLog[]>([])

// ===== 计算属性 =====

// 动态提示信息
const successInfo = ref<string>('密码正确 ✓')
const errorInfo = ref<string>('密码错误，请重新输入')
const validateInfo = ref<string>('请输入4位数字密码')
const validateError = ref<string>('')
const loginError = ref<string>('')
const smsInfo = ref<string>('请输入4位验证码')

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    defaultTemplate: `<wd-password-input
  v-model="basicPassword"
  :focused="basicFocused"
  :use-external-keyboard="true"
  info="请输入4位数字密码"
  @focus="handleBasicFocus"
  @blur="handleBasicBlur"
/>`,

    longTemplate: `<wd-password-input
  v-model="longPassword"
  :length="6"
  :focused="longFocused"
  :use-external-keyboard="true"
  info="请输入6位验证码"
  @focus="handleLongFocus"
  @blur="handleLongBlur"
/>`,

    script: `import { ref } from 'vue'

const basicPassword = ref('12')      // 默认4位
const longPassword = ref('123')      // 6位长度
const basicFocused = ref(false)
const longFocused = ref(false)

const handleBasicFocus = () => {
  basicFocused.value = true
  // 显示键盘逻辑
}

const handleBasicBlur = () => {
  basicFocused.value = false
}`,
  },

  // 显示样式代码
  style: {
    plainTemplate: `<wd-password-input
  v-model="plainPassword"
  :mask="false"
  :focused="plainFocused"
  :use-external-keyboard="true"
  info="明文显示输入内容"
/>`,

    gutterTemplate: `<wd-password-input
  v-model="gutterPassword"
  :gutter="10"
  :focused="gutterFocused"
  :use-external-keyboard="true"
  info="间距设置为10rpx"
/>`,

    colorTemplate: `<wd-password-input
  v-model="colorPassword"
  bg-color="#E6F3FF"
  :focused="colorFocused"
  :use-external-keyboard="true"
  info="自定义背景色"
/>`,

    script: `// 显示样式配置
const plainPassword = ref('abc')    // 明文显示
const gutterPassword = ref('456')   // 自定义间距
const colorPassword = ref('789')    // 自定义背景色

// 样式配置说明
const gutterValue = 10              // 间距 10rpx
const bgColor = '#E6F3FF'          // 自定义背景色
const maskValue = false            // 明文显示`,
  },

  // 状态反馈代码
  state: {
    template: `<!-- 成功状态 -->
<wd-password-input
  v-model="successPassword"
  :focused="successFocused"
  :use-external-keyboard="true"
  :info="successInfo"
/>

<!-- 错误状态 -->
<wd-password-input
  v-model="errorPassword"
  :focused="errorFocused"
  :use-external-keyboard="true"
  :error-info="errorInfo"
/>

<!-- 验证状态 -->
<wd-password-input
  v-model="validatePassword"
  :focused="validateFocused"
  :use-external-keyboard="true"
  :info="validateInfo"
  :error-info="validateError"
/>`,

    script: `// 状态管理
const successPassword = ref('1234')
const errorPassword = ref('1111')
const validatePassword = ref('')

// 提示信息
const successInfo = ref('密码正确 ✓')
const errorInfo = ref('密码错误，请重新输入')
const validateInfo = ref('请输入4位数字密码')
const validateError = ref('')

// 验证逻辑
const validateInput = (password: string) => {
  if (password.length === 4) {
    if (password === '1234') {
      validateError.value = ''
      validateInfo.value = '密码正确 ✓'
    } else {
      validateError.value = '密码错误'
      validateInfo.value = ''
    }
  }
}`,
  },

  // 内置键盘代码
  internal: {
    basicTemplate: `<wd-password-input
  v-model="internalPassword"
  :use-external-keyboard="false"
  keyboard-title="请输入密码"
  keyboard-close-text="确认"
  keyboard-delete-text="删除"
  info="点击输入框调起内置键盘"
/>`,

    configTemplate: `<wd-password-input
  v-model="configPassword"
  :length="8"
  :use-external-keyboard="false"
  keyboard-title="输入8位密码"
  :keyboard-modal="true"
  :keyboard-hide-on-click-outside="false"
  info="8位密码，模态键盘"
/>`,

    script: `// 内置键盘配置
const internalPassword = ref('')
const configPassword = ref('')

// 键盘配置项
const keyboardConfig = {
  title: '请输入密码',
  closeText: '确认',
  deleteText: '删除',
  modal: true,
  hideOnClickOutside: false,
  maxLength: 8
}`,
  },

  // 事件监听代码
  events: {
    template: `<wd-password-input
  v-model="eventPassword"
  :focused="eventFocused"
  :use-external-keyboard="true"
  info="观察下方事件日志"
  @focus="handleEventFocus"
  @blur="handleEventBlur"
/>`,

    script: `const eventPassword = ref('')
const eventFocused = ref(false)
const eventLogs = ref([])

const handleEventFocus = (event) => {
  addEventLog('输入框获得焦点', 'info')
  eventFocused.value = true
}

const handleEventBlur = () => {
  addEventLog('输入框失去焦点', 'warning')
  eventFocused.value = false
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
    loginTemplate: `<view class="mx-4 rounded-lg bg-gray-50 p-4">
  <view class="mb-3 text-center text-base font-medium">请输入登录密码</view>
  <wd-password-input
    v-model="loginPassword"
    mask
    :length="6"
    :focused="loginFocused"
    :use-external-keyboard="true"
    :error-info="loginError"
    @focus="handleLoginFocus"
    @blur="handleLoginBlur"
  />
  <view class="mt-4 flex gap-3">
    <wd-button size="small" @click="validateLogin">验证密码</wd-button>
    <wd-button size="small" type="text" @click="resetLogin">重置</wd-button>
  </view>
</view>`,

    loginScript: `const loginPassword = ref('')
const loginError = ref('')
const loginFocused = ref(false)

const validateLogin = () => {
  if (loginPassword.value.length !== 6) {
    loginError.value = '密码长度应为6位'
    return
  }

  if (loginPassword.value === '123456') {
    loginError.value = ''
    console.log('登录成功')
  } else {
    loginError.value = '密码错误'
  }
}

const resetLogin = () => {
  loginPassword.value = ''
  loginError.value = ''
}`,

    smsTemplate: `<view class="mx-4 rounded-lg bg-blue-50 p-4">
  <view class="mb-2 text-center text-sm text-blue-600">
    验证码已发送至 138****8888
  </view>
  <wd-password-input
    v-model="smsCode"
    :focused="smsFocused"
    :use-external-keyboard="true"
    :info="smsInfo"
  />
  <view class="mt-3 text-center">
    <wd-button
      size="small"
      type="text"
      :disabled="countdown > 0"
      @click="resendSms"
    >
      {{ countdown > 0 ? \`\${countdown}s后重发\` : '重新发送' }}
    </wd-button>
  </view>
</view>`,

    smsScript: `const smsCode = ref('')
const countdown = ref(0)
const smsInfo = ref('请输入4位验证码')

const resendSms = () => {
  countdown.value = 60
  smsInfo.value = '验证码已重新发送'

  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      smsInfo.value = '请输入4位验证码'
    }
  }, 1000)
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'model-value',
    type: 'String',
    default: '""',
    desc: '绑定的输入值',
  },
  {
    name: 'mask',
    type: 'Boolean',
    default: 'false',
    desc: '是否隐藏密码内容，使用圆点遮罩',
  },
  {
    name: 'info',
    type: 'String',
    default: '""',
    desc: '输入框下方的提示信息',
  },
  {
    name: 'error-info',
    type: 'String',
    default: '""',
    desc: '输入框下方的错误提示信息',
  },
  {
    name: 'gutter',
    type: 'String | Number',
    default: '24',
    desc: '输入框格子之间的间距，默认单位为rpx',
  },
  {
    name: 'length',
    type: 'Number',
    default: '4',
    desc: '密码最大长度',
  },
  {
    name: 'focused',
    type: 'Boolean',
    default: 'true',
    desc: '是否已聚焦，聚焦时会显示光标',
  },
  {
    name: 'bg-color',
    type: 'String',
    default: '"#F8F8F8"',
    desc: '输入框背景色',
  },
  {
    name: 'use-external-keyboard',
    type: 'Boolean',
    default: 'false',
    desc: '是否使用外部键盘，为true时不显示内置键盘',
  },
  {
    name: 'keyboard-title',
    type: 'String',
    default: '""',
    desc: '内置键盘标题',
  },
  {
    name: 'keyboard-z-index',
    type: 'Number',
    default: '100',
    desc: '内置键盘层级',
  },
  {
    name: 'keyboard-close-text',
    type: 'String',
    default: '"完成"',
    desc: '内置键盘确认按钮文本',
  },
  {
    name: 'keyboard-delete-text',
    type: 'String',
    default: '"删除"',
    desc: '内置键盘删除按钮文本',
  },
  {
    name: 'keyboard-modal',
    type: 'Boolean',
    default: 'false',
    desc: '内置键盘是否显示蒙层',
  },
  {
    name: 'keyboard-hide-on-click-outside',
    type: 'Boolean',
    default: 'true',
    desc: '内置键盘是否在点击外部时收起',
  },
  {
    name: 'keyboard-lock-scroll',
    type: 'Boolean',
    default: 'true',
    desc: '内置键盘是否锁定滚动',
  },
  {
    name: 'keyboard-safe-area-inset-bottom',
    type: 'Boolean',
    default: 'true',
    desc: '内置键盘是否在底部安全区域内',
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
    name: 'focus',
    desc: '输入框获得焦点时触发',
  },
  {
    name: 'blur',
    desc: '输入框失去焦点时触发',
  },
  {
    name: 'update:modelValue',
    desc: '输入值改变时触发',
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

/**
 * 统一管理键盘显示
 */
const showKeyboard = (inputRef: string, password: string, maxLength: number, title: string) => {
  currentInputRef.value = inputRef
  currentPassword.value = password
  currentMaxLength.value = maxLength
  currentKeyboardTitle.value = title
  keyboardVisible.value = true
}

// ===== 基本用法事件处理 =====

/**
 * 基本密码输入获得焦点
 */
const handleBasicFocus = () => {
  basicFocused.value = true
  showKeyboard('basic', basicPassword.value, 4, '请输入4位数字密码')
}

/**
 * 基本密码输入失去焦点
 */
const handleBasicBlur = () => {
  basicFocused.value = false
}

/**
 * 长密码输入获得焦点
 */
const handleLongFocus = () => {
  longFocused.value = true
  showKeyboard('long', longPassword.value, 6, '请输入6位验证码')
}

/**
 * 长密码输入失去焦点
 */
const handleLongBlur = () => {
  longFocused.value = false
}

// ===== 显示样式事件处理 =====

/**
 * 明文输入获得焦点
 */
const handlePlainFocus = () => {
  plainFocused.value = true
  showKeyboard('plain', plainPassword.value, 4, '明文显示输入')
}

/**
 * 明文输入失去焦点
 */
const handlePlainBlur = () => {
  plainFocused.value = false
}

/**
 * 间距输入获得焦点
 */
const handleGutterFocus = () => {
  gutterFocused.value = true
  showKeyboard('gutter', gutterPassword.value, 4, '自定义间距输入')
}

/**
 * 间距输入失去焦点
 */
const handleGutterBlur = () => {
  gutterFocused.value = false
}

/**
 * 颜色输入获得焦点
 */
const handleColorFocus = () => {
  colorFocused.value = true
  showKeyboard('color', colorPassword.value, 4, '自定义颜色输入')
}

/**
 * 颜色输入失去焦点
 */
const handleColorBlur = () => {
  colorFocused.value = false
}

// ===== 状态反馈事件处理 =====

/**
 * 成功状态输入获得焦点
 */
const handleSuccessFocus = () => {
  successFocused.value = true
  showKeyboard('success', successPassword.value, 4, '成功状态输入')
}

/**
 * 成功状态输入失去焦点
 */
const handleSuccessBlur = () => {
  successFocused.value = false
}

/**
 * 错误状态输入获得焦点
 */
const handleErrorFocus = () => {
  errorFocused.value = true
  showKeyboard('error', errorPassword.value, 4, '错误状态输入')
}

/**
 * 错误状态输入失去焦点
 */
const handleErrorBlur = () => {
  errorFocused.value = false
}

/**
 * 验证状态输入获得焦点
 */
const handleValidateFocus = () => {
  validateFocused.value = true
  showKeyboard('validate', validatePassword.value, 4, '验证状态输入')
}

/**
 * 验证状态输入失去焦点
 */
const handleValidateBlur = () => {
  validateFocused.value = false
}

// ===== 内置键盘事件处理 =====

/**
 * 内置键盘输入获得焦点
 */
const handleInternalFocus = () => {
  addEventLog('内置键盘输入获得焦点', 'info')
}

/**
 * 内置键盘输入失去焦点
 */
const handleInternalBlur = () => {
  addEventLog('内置键盘输入失去焦点', 'warning')
}

/**
 * 键盘配置输入获得焦点
 */
const handleConfigFocus = () => {
  addEventLog('键盘配置输入获得焦点', 'info')
}

/**
 * 键盘配置输入失去焦点
 */
const handleConfigBlur = () => {
  addEventLog('键盘配置输入失去焦点', 'warning')
}

// ===== 事件监听处理 =====

/**
 * 事件监听输入获得焦点
 */
const handleEventFocus = () => {
  eventFocused.value = true
  addEventLog('事件监听输入获得焦点', 'info')
  showKeyboard('event', eventPassword.value, 4, '事件监听输入')
}

/**
 * 事件监听输入失去焦点
 */
const handleEventBlur = () => {
  eventFocused.value = false
  addEventLog('事件监听输入失去焦点', 'warning')
}

// ===== 应用场景事件处理 =====

/**
 * 登录输入获得焦点
 */
const handleLoginFocus = () => {
  loginFocused.value = true
  showKeyboard('login', loginPassword.value, 6, '请输入登录密码')
}

/**
 * 登录输入失去焦点
 */
const handleLoginBlur = () => {
  loginFocused.value = false
}

/**
 * 短信验证码输入获得焦点
 */
const handleSmsFocus = () => {
  smsFocused.value = true
  showKeyboard('sms', smsCode.value, 4, '请输入验证码')
}

/**
 * 短信验证码输入失去焦点
 */
const handleSmsBlur = () => {
  smsFocused.value = false
}

/**
 * 验证登录密码
 */
const validateLogin = () => {
  if (loginPassword.value.length !== 6) {
    loginError.value = '密码长度应为6位'
    addEventLog('登录验证失败：密码长度不正确', 'error')
    return
  }

  if (loginPassword.value === '123456') {
    loginError.value = ''
    addEventLog('登录验证成功', 'success')
  } else {
    loginError.value = '密码错误'
    addEventLog('登录验证失败：密码错误', 'error')
  }
}

/**
 * 重置登录密码
 */
const resetLogin = () => {
  loginPassword.value = ''
  loginError.value = ''
  addEventLog('登录密码已重置', 'info')
}

/**
 * 重新发送短信验证码
 */
const resendSms = () => {
  countdown.value = 60
  smsInfo.value = '验证码已重新发送'
  addEventLog('短信验证码已重新发送', 'success')

  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      smsInfo.value = '请输入4位验证码'
    }
  }, 1000)
}

// ===== 键盘事件处理 =====

/**
 * 键盘关闭处理
 */
const handleKeyboardClose = () => {
  // 重置所有焦点状态
  basicFocused.value = false
  longFocused.value = false
  plainFocused.value = false
  gutterFocused.value = false
  colorFocused.value = false
  successFocused.value = false
  errorFocused.value = false
  validateFocused.value = false
  eventFocused.value = false
  loginFocused.value = false
  smsFocused.value = false

  addEventLog('键盘已关闭', 'info')
}

// ===== 监听器 =====

/**
 * 监听键盘输入值变化，同步到对应的密码框
 */
watch(currentPassword, (newValue: string) => {
  // 确保值是字符串类型
  const stringValue = String(newValue)

  switch (currentInputRef.value) {
    case 'basic':
      basicPassword.value = stringValue
      break
    case 'long':
      longPassword.value = stringValue
      break
    case 'plain':
      plainPassword.value = stringValue
      break
    case 'gutter':
      gutterPassword.value = stringValue
      break
    case 'color':
      colorPassword.value = stringValue
      break
    case 'success':
      successPassword.value = stringValue
      break
    case 'error':
      errorPassword.value = stringValue
      break
    case 'validate':
      validatePassword.value = stringValue
      break
    case 'event':
      eventPassword.value = stringValue
      addEventLog(`输入值变化：${stringValue}`, 'info')
      break
    case 'login':
      loginPassword.value = stringValue
      break
    case 'sms':
      smsCode.value = stringValue
      break
  }
})

/**
 * 监听验证密码变化
 */
watch(validatePassword, (newValue: string) => {
  if (newValue.length === 0) {
    validateError.value = ''
    validateInfo.value = '请输入4位数字密码'
  } else if (newValue.length < 4) {
    validateError.value = ''
    validateInfo.value = `还需输入${4 - newValue.length}位`
  } else if (newValue.length === 4) {
    if (newValue === '1234') {
      validateError.value = ''
      validateInfo.value = '密码正确 ✓'
      addEventLog('验证密码正确', 'success')
    } else {
      validateError.value = '密码错误'
      validateInfo.value = ''
      addEventLog('验证密码错误', 'error')
    }
  }
})

/**
 * 监听短信验证码变化
 */
watch(smsCode, (newValue: string) => {
  if (newValue.length === 4) {
    if (newValue === '1234') {
      smsInfo.value = '验证码正确 ✓'
      addEventLog('短信验证码验证成功', 'success')
    } else {
      smsInfo.value = '验证码错误'
      addEventLog('短信验证码验证失败', 'error')
    }
  } else {
    smsInfo.value = '请输入4位验证码'
  }
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
// 确保键盘不被遮挡
:deep(.wd-number-keyboard) {
  z-index: 1000;
}
</style>
