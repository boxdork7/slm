<!-- MessageBox 弹框 http://127.0.0.1:100/#/pages-sub/demo/wd/messagebox -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="MessageBox 弹框" show-back />

    <!-- 弹框组件实例 -->
    <wd-message-box />
    <wd-message-box selector="wd-message-box-slot">
      <wd-rate v-model="rateValue" />
    </wd-message-box>

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的弹框形式，支持提示、确认和输入">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="Alert 提示框" vertical>
          <wd-button block @click="showAlert">显示 Alert</wd-button>
        </wd-cell>

        <wd-cell title="带标题的 Alert" vertical>
          <wd-button block @click="showAlertWithTitle">显示带标题 Alert</wd-button>
        </wd-cell>

        <wd-cell title="Confirm 确认框" vertical>
          <wd-button block @click="showConfirm">显示 Confirm</wd-button>
        </wd-cell>

        <wd-cell title="Prompt 输入框" vertical>
          <wd-button block @click="showPrompt">显示 Prompt</wd-button>
        </wd-cell>
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - Alert 提示框" :code="codes.basic.alertTemplate" />
        <DemoCode title="模板 - 带标题 Alert" :code="codes.basic.titleTemplate" />
        <DemoCode title="模板 - Confirm 确认框" :code="codes.basic.confirmTemplate" />
        <DemoCode title="模板 - Prompt 输入框" :code="codes.basic.promptTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 高级配置示例 -->
    <DemoSection title="高级配置" desc="长文本滚动、自定义按钮和确认前钩子">
      <wd-cell-group>
        <wd-cell title="长文本滚动" vertical>
          <view class="mb-2 text-xs text-gray-500">
            当文案过长时，弹框的高度不再增加，而是将文案内容设置成滚动
          </view>
          <wd-button block @click="showLongTextAlert">长文本 Alert</wd-button>
        </wd-cell>

        <wd-cell title="确认前钩子" vertical>
          <view class="mb-2 text-xs text-gray-500">
            使用 beforeConfirm 钩子在弹框确认前可以进行一些操作
          </view>
          <wd-button block @click="showBeforeConfirm">确认前钩子</wd-button>
        </wd-cell>

        <wd-cell title="自定义按钮样式" vertical>
          <view class="mb-2 text-xs text-gray-500">通过 buttonProps 自定义按钮样式和属性</view>
          <wd-button block @click="showCustomButton">自定义按钮</wd-button>
        </wd-cell>

        <wd-cell title="禁用遮罩关闭" vertical>
          <view class="mb-2 text-xs text-gray-500">
            设置 closeOnClickModal 为 false 禁用点击遮罩关闭
          </view>
          <wd-button block @click="showNoModalClose">禁用遮罩关闭</wd-button>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 长文本滚动" :code="codes.advanced.longTextTemplate" />
        <DemoCode title="模板 - 确认前钩子" :code="codes.advanced.beforeConfirmTemplate" />
        <DemoCode title="模板 - 自定义按钮" :code="codes.advanced.customButtonTemplate" />
        <DemoCode title="脚本 - 高级配置" :code="codes.advanced.script" />
      </template>
    </DemoSection>

    <!-- 输入验证示例 -->
    <DemoSection title="输入验证" desc="Prompt 类型弹框的输入验证功能">
      <wd-cell-group>
        <wd-cell title="邮箱格式验证" vertical>
          <view class="mb-2 text-xs text-gray-500">使用正则表达式验证邮箱格式</view>
          <wd-button block @click="showEmailPrompt">邮箱验证</wd-button>
        </wd-cell>

        <wd-cell title="数字范围验证" vertical>
          <view class="mb-2 text-xs text-gray-500">使用自定义验证函数验证数字范围</view>
          <wd-button block @click="showNumberPrompt">数字验证</wd-button>
        </wd-cell>

        <wd-cell title="密码强度验证" vertical>
          <view class="mb-2 text-xs text-gray-500">验证密码强度（至少8位，包含字母和数字）</view>
          <wd-button block @click="showPasswordPrompt">密码验证</wd-button>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 邮箱验证" :code="codes.validation.emailTemplate" />
        <DemoCode title="模板 - 数字验证" :code="codes.validation.numberTemplate" />
        <DemoCode title="模板 - 密码验证" :code="codes.validation.passwordTemplate" />
        <DemoCode title="脚本 - 输入验证" :code="codes.validation.script" />
      </template>
    </DemoSection>

    <!-- 自定义内容示例 -->
    <DemoSection title="自定义内容" desc="使用插槽自定义弹框内容">
      <wd-cell-group>
        <wd-cell title="评分组件" vertical>
          <view class="mb-2 text-xs text-gray-500">用户可以在弹框中进行评分操作，支持评分验证</view>
          <wd-button block @click="showCustomSlot">评分弹框</wd-button>
        </wd-cell>

        <wd-cell title="表单内容" vertical>
          <view class="mb-2 text-xs text-gray-500">在弹框中嵌入复杂的表单内容</view>
          <wd-button block @click="showFormSlot">表单弹框</wd-button>
        </wd-cell>
      </wd-cell-group>

      <!-- 表单内容弹框 -->
      <wd-message-box selector="form-message-box">
        <view class="space-y-3">
          <wd-input v-model="formData.name" label="姓名" placeholder="请输入姓名" />
          <wd-input v-model="formData.phone" label="手机号" placeholder="请输入手机号" />
          <wd-input v-model="formData.email" label="邮箱" placeholder="请输入邮箱" />
        </view>
      </wd-message-box>

      <template #codes>
        <DemoCode title="模板 - 评分组件" :code="codes.custom.rateTemplate" />
        <DemoCode title="模板 - 表单内容" :code="codes.custom.formTemplate" />
        <DemoCode title="脚本 - 自定义内容" :code="codes.custom.script" />
      </template>
    </DemoSection>

    <!-- 实际应用场景 -->
    <DemoSection title="实际应用场景" desc="常见的业务场景示例">
      <!-- 业务场景演示 -->
      <view class="space-y-4">
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">用户操作确认</view>
          <view class="mx-4 rounded-lg bg-gray-50 p-4">
            <view class="grid grid-cols-2 gap-3">
              <wd-button size="small" type="error" @click="showDeleteConfirm">删除数据</wd-button>
              <wd-button size="small" type="warning" @click="showLogoutConfirm">退出登录</wd-button>
              <wd-button size="small" type="primary" @click="showSubmitConfirm">提交表单</wd-button>
              <wd-button size="small" type="success" @click="showSaveConfirm">保存草稿</wd-button>
            </view>
          </view>
        </view>

        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">信息收集</view>
          <view class="mx-4 rounded-lg bg-blue-50 p-4">
            <view class="grid grid-cols-2 gap-3">
              <wd-button size="small" @click="showFeedbackPrompt">意见反馈</wd-button>
              <wd-button size="small" @click="showReasonPrompt">取消原因</wd-button>
              <wd-button size="small" @click="showCommentPrompt">评价商品</wd-button>
              <wd-button size="small" @click="showCodePrompt">验证码</wd-button>
            </view>
          </view>
        </view>

        <!-- 状态显示 -->
        <view class="mx-4 rounded-lg bg-gray-50 p-4">
          <view class="mb-2 text-sm font-medium">操作结果</view>
          <view class="min-h-12 border rounded bg-white p-2">
            <view v-if="lastResult" class="text-xs">
              <text class="text-gray-400">[{{ lastResult.time }}]</text>
              {{ lastResult.message }}
            </view>
            <view v-else class="py-2 text-center text-xs text-gray-400">暂无操作记录</view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 用户操作确认" :code="codes.scenarios.confirmTemplate" />
        <DemoCode title="模板 - 信息收集" :code="codes.scenarios.promptTemplate" />
        <DemoCode title="脚本 - 应用场景" :code="codes.scenarios.script" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMessage, useToast } from '@/wd'

// ===== 组件状态管理 =====

// 评分值，用于插槽示例
const rateValue = ref<number>(3)

// 输入框值
const inputValue = ref<string>('')

// 表单数据
const formData = ref({
  name: '',
  phone: '',
  email: '',
})

// 操作结果记录
interface OperationResult {
  time: string
  message: string
}

const lastResult = ref<OperationResult | null>(null)

// Message 和 Toast 实例
const toast = useToast()
const message = useMessage()
const messageWithSlot = useMessage('wd-message-box-slot')
const formMessage = useMessage('form-message-box')

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    alertTemplate: `<wd-button @click="showAlert" block>显示 Alert</wd-button>`,

    titleTemplate: `<wd-button @click="showAlertWithTitle" block>显示带标题 Alert</wd-button>`,

    confirmTemplate: `<wd-button @click="showConfirm" block>显示 Confirm</wd-button>`,

    promptTemplate: `<wd-button @click="showPrompt" block>显示 Prompt</wd-button>`,

    script: `import { useMessage, useToast } from '@/wd'

const toast = useToast()
const message = useMessage()
const inputValue = ref('')

// 显示基本 Alert
const showAlert = () => {
  message.alert('操作成功')
}

// 显示带标题的 Alert
const showAlertWithTitle = () => {
  message.alert({
    msg: '提示文案',
    title: '标题'
  })
}

// 显示 Confirm 确认框
const showConfirm = () => {
  message
    .confirm({
      msg: '是否删除？',
      title: '提示'
    })
    .then(() => {
      toast.show('确认删除')
    })
    .catch(() => {
      console.log('取消删除')
    })
}

// 显示 Prompt 输入框
const showPrompt = () => {
  message
    .prompt({
      title: '请输入邮箱',
      inputValue: inputValue.value,
      inputPattern: /.[^\n\r@\u2028\u2029]*@.+\..+/
    })
    .then((resp) => {
      toast.show(\`输入的邮箱：\${resp.value}\`)
      inputValue.value = resp.value
    })
    .catch(() => {
      console.log('取消输入')
    })
}`,
  },

  // 高级配置代码
  advanced: {
    longTextTemplate: `<wd-button @click="showLongTextAlert" block>长文本 Alert</wd-button>`,

    beforeConfirmTemplate: `<wd-button @click="showBeforeConfirm" block>确认前钩子</wd-button>`,

    customButtonTemplate: `<wd-button @click="showCustomButton" block>自定义按钮</wd-button>`,

    script: `// 显示长文本 Alert
const showLongTextAlert = () => {
  message.alert({
    msg: '以上文字是示例文字，仅用于演示长文本在弹框中的显示效果。当文本内容超过弹框最大高度时，会自动启用滚动功能，确保用户能够完整查看所有内容。这样的设计既保证了界面的美观性，又确保了信息的完整传达。',
    title: '长文本提示'
  })
}

// 显示确认前钩子示例
const showBeforeConfirm = () => {
  message
    .confirm({
      msg: '是否删除？',
      title: '提示',
      beforeConfirm: ({ resolve }) => {
        toast.loading('删除中...')
        setTimeout(() => {
          toast.close()
          resolve(true)
          toast.success('删除成功')
        }, 3000)
      }
    })
    .then(() => {
      console.log('删除完成')
    })
    .catch(() => {
      console.log('取消删除')
    })
}

// 显示自定义按钮样式
const showCustomButton = () => {
  message
    .confirm({
      msg: '自定义按钮样式',
      title: '提示',
      cancelButtonProps: {
        round: false,
        type: 'error',
        customClass: 'custom-shadow'
      },
      confirmButtonProps: {
        round: false,
        type: 'success',
        customClass: 'custom-shadow'
      }
    })
    .then(() => {
      toast.show('确认操作')
    })
    .catch(() => {
      console.log('取消操作')
    })
}`,
  },

  // 输入验证代码
  validation: {
    emailTemplate: `<wd-button @click="showEmailPrompt" block>邮箱验证</wd-button>`,

    numberTemplate: `<wd-button @click="showNumberPrompt" block>数字验证</wd-button>`,

    passwordTemplate: `<wd-button @click="showPasswordPrompt" block>密码验证</wd-button>`,

    script: `// 邮箱格式验证
const showEmailPrompt = () => {
  message
    .prompt({
      title: '请输入邮箱',
      inputPlaceholder: '请输入有效的邮箱地址',
      inputPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      inputError: '请输入正确的邮箱格式'
    })
    .then((resp) => {
      toast.show(\`邮箱：\${resp.value}\`)
    })
    .catch(() => {
      console.log('取消输入')
    })
}

// 数字范围验证
const showNumberPrompt = () => {
  message
    .prompt({
      title: '请输入数字（1-100）',
      inputType: 'number',
      inputPlaceholder: '请输入1-100之间的数字',
      inputValidate: (value) => {
        const num = Number(value)
        return !isNaN(num) && num >= 1 && num <= 100
      },
      inputError: '请输入1-100之间的有效数字'
    })
    .then((resp) => {
      toast.show(\`数字：\${resp.value}\`)
    })
    .catch(() => {
      console.log('取消输入')
    })
}

// 密码强度验证
const showPasswordPrompt = () => {
  message
    .prompt({
      title: '设置密码',
      inputType: 'password',
      inputPlaceholder: '至少8位，包含字母和数字',
      inputValidate: (value) => {
        const password = String(value)
        return password.length >= 8 &&
               /[a-zA-Z]/.test(password) &&
               /[0-9]/.test(password)
      },
      inputError: '密码至少8位，且包含字母和数字'
    })
    .then((resp) => {
      toast.show('密码设置成功')
    })
    .catch(() => {
      console.log('取消设置')
    })
}`,
  },

  // 自定义内容代码
  custom: {
    rateTemplate: `<!-- 在模板中声明带插槽的 message-box -->
<wd-message-box selector="wd-message-box-slot">
  <wd-rate v-model="rateValue" />
</wd-message-box>

<wd-button @click="showCustomSlot" block>评分弹框</wd-button>`,

    formTemplate: `<!-- 表单内容弹框 -->
<wd-message-box selector="form-message-box">
  <view class="space-y-3">
    <wd-input v-model="formData.name" label="姓名" placeholder="请输入姓名" />
    <wd-input v-model="formData.phone" label="手机号" placeholder="请输入手机号" />
    <wd-input v-model="formData.email" label="邮箱" placeholder="请输入邮箱" />
  </view>
</wd-message-box>

<wd-button @click="showFormSlot" block>表单弹框</wd-button>`,

    script: `const rateValue = ref(3)
const formData = ref({
  name: '',
  phone: '',
  email: ''
})

// 创建带选择器的 message 实例
const messageWithSlot = useMessage('wd-message-box-slot')
const formMessage = useMessage('form-message-box')

// 显示评分弹框
const showCustomSlot = () => {
  // 重置评分值，让用户重新评分
  rateValue.value = 0

  messageWithSlot
    .confirm({
      title: '请为本次服务评分',
      confirmButtonText: '提交评分',
      cancelButtonText: '稍后评分',
      // 只有评分大于0才能提交
      beforeConfirm: ({ resolve }) => {
        if (rateValue.value === 0) {
          toast.show('请先进行评分')
          resolve(false) // 阻止关闭
        } else {
          resolve(true) // 允许关闭
        }
      }
    })
    .then(() => {
      message.alert(\`感谢您的评分：\${rateValue.value} 分\`)
      recordResult(\`用户评分：\${rateValue.value} 分\`)
    })
    .catch(() => {
      console.log('取消评分')
      recordResult('用户取消评分')
      // 用户取消时重置评分
      rateValue.value = 3
    })
}

// 显示表单弹框
const showFormSlot = () => {
  formMessage
    .confirm({
      title: '完善信息',
      confirmButtonText: '提交',
      cancelButtonText: '稍后填写'
    })
    .then(() => {
      toast.show(\`信息已保存：\${formData.value.name}\`)
    })
    .catch(() => {
      console.log('取消填写')
    })
}`,
  },

  // 应用场景代码
  scenarios: {
    confirmTemplate: `<!-- 用户操作确认 -->
<view class="grid grid-cols-2 gap-3">
  <wd-button @click="showDeleteConfirm" size="small" type="error">删除数据</wd-button>
  <wd-button @click="showLogoutConfirm" size="small" type="warning">退出登录</wd-button>
  <wd-button @click="showSubmitConfirm" size="small" type="primary">提交表单</wd-button>
  <wd-button @click="showSaveConfirm" size="small" type="success">保存草稿</wd-button>
</view>`,

    promptTemplate: `<!-- 信息收集 -->
<view class="grid grid-cols-2 gap-3">
  <wd-button @click="showFeedbackPrompt" size="small">意见反馈</wd-button>
  <wd-button @click="showReasonPrompt" size="small">取消原因</wd-button>
  <wd-button @click="showCommentPrompt" size="small">评价商品</wd-button>
  <wd-button @click="showCodePrompt" size="small">验证码</wd-button>
</view>`,

    script: `// 记录操作结果
const recordResult = (message: string) => {
  lastResult.value = {
    time: new Date().toLocaleTimeString(),
    message
  }
}

// 删除确认
const showDeleteConfirm = () => {
  message
    .confirm({
      msg: '确定要删除这条数据吗？删除后无法恢复。',
      title: '删除确认',
      confirmButtonText: '确定删除',
      cancelButtonText: '取消'
    })
    .then(() => {
      recordResult('用户确认删除数据')
      toast.success('删除成功')
    })
    .catch(() => {
      recordResult('用户取消删除操作')
    })
}

// 意见反馈
const showFeedbackPrompt = () => {
  message
    .prompt({
      title: '意见反馈',
      inputPlaceholder: '请输入您的宝贵意见...',
      inputValidate: (value) => String(value).trim().length >= 5,
      inputError: '反馈内容至少5个字符'
    })
    .then((resp) => {
      recordResult(\`收到用户反馈：\${resp.value}\`)
      toast.success('反馈提交成功')
    })
    .catch(() => {
      recordResult('用户取消反馈')
    })
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'selector',
    type: 'String',
    default: '""',
    desc: '选择器，用于支持多实例场景',
  },
  {
    name: 'title',
    type: 'String',
    default: '""',
    desc: '弹框标题',
  },
  {
    name: 'msg',
    type: 'String',
    default: '""',
    desc: '消息文案',
  },
  {
    name: 'type',
    type: 'String',
    default: '"alert"',
    desc: '弹框类型：alert / confirm / prompt',
  },
  {
    name: 'show-cancel-button',
    type: 'Boolean',
    default: 'false',
    desc: '是否展示取消按钮',
  },
  {
    name: 'close-on-click-modal',
    type: 'Boolean',
    default: 'true',
    desc: '是否支持点击蒙层进行关闭',
  },
  {
    name: 'confirm-button-text',
    type: 'String',
    default: '"确定"',
    desc: '确定按钮文案',
  },
  {
    name: 'cancel-button-text',
    type: 'String',
    default: '"取消"',
    desc: '取消按钮文案',
  },
  {
    name: 'input-type',
    type: 'String',
    default: '"text"',
    desc: '输入框类型，当 type 为 prompt 时有效',
  },
  {
    name: 'input-value',
    type: 'String | Number',
    default: '""',
    desc: '输入框初始值，当 type 为 prompt 时有效',
  },
  {
    name: 'input-placeholder',
    type: 'String',
    default: '""',
    desc: '输入框占位符，当 type 为 prompt 时有效',
  },
  {
    name: 'input-pattern',
    type: 'RegExp',
    default: 'undefined',
    desc: '输入框正则校验，当 type 为 prompt 时有效',
  },
  {
    name: 'input-validate',
    type: 'Function',
    default: 'undefined',
    desc: '输入框校验函数，当 type 为 prompt 时有效',
  },
  {
    name: 'input-error',
    type: 'String',
    default: '""',
    desc: '输入框检验不通过时的错误提示文案',
  },
  {
    name: 'show-err',
    type: 'Boolean',
    default: 'false',
    desc: '是否展示错误信息',
  },
  {
    name: 'before-confirm',
    type: 'Function',
    default: 'undefined',
    desc: '确认前钩子函数',
  },
  {
    name: 'cancel-button-props',
    type: 'Object',
    default: '{}',
    desc: '取消按钮的属性配置',
  },
  {
    name: 'confirm-button-props',
    type: 'Object',
    default: '{}',
    desc: '确认按钮的属性配置',
  },
  {
    name: 'z-index',
    type: 'Number',
    default: '1000',
    desc: '弹窗层级',
  },
  {
    name: 'lazy-render',
    type: 'Boolean',
    default: 'true',
    desc: '弹层内容懒渲染',
  },
  {
    name: 'visible',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示弹框',
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
    name: 'useMessage(selector?)',
    desc: '创建 Message 实例，支持 alert、confirm、prompt、show、close 方法',
  },
  {
    name: 'alert(options)',
    desc: '显示警告弹框，参数为配置对象或字符串',
  },
  {
    name: 'confirm(options)',
    desc: '显示确认弹框，返回 Promise',
  },
  {
    name: 'prompt(options)',
    desc: '显示输入弹框，返回 Promise，结果包含 value',
  },
  {
    name: 'show(options)',
    desc: '显示自定义配置的弹框，返回 Promise',
  },
  {
    name: 'close()',
    desc: '关闭当前弹框',
  },
]

// Events 事件文档
const apiEvents = [
  {
    name: 'confirm',
    desc: '点击确认按钮时触发，返回操作结果对象',
  },
  {
    name: 'cancel',
    desc: '点击取消按钮或点击遮罩时触发，返回操作结果对象',
  },
]

// ===== 工具方法 =====

/**
 * 记录操作结果
 */
const recordResult = (message: string) => {
  lastResult.value = {
    time: new Date().toLocaleTimeString(),
    message,
  }
}

// ===== 事件处理方法 =====

/**
 * 显示基本 Alert
 */
const showAlert = () => {
  message.alert('操作成功')
  console.log('显示基本 Alert')
}

/**
 * 显示带标题的 Alert
 */
const showAlertWithTitle = () => {
  message.alert({
    msg: '提示文案',
    title: '标题',
  })
  console.log('显示带标题 Alert')
}

/**
 * 显示 Confirm 确认框
 */
const showConfirm = () => {
  message
    .confirm({
      msg: '是否删除？',
      title: '提示',
    })
    .then(() => {
      toast.show('确认删除')
      recordResult('用户确认删除操作')
    })
    .catch(() => {
      console.log('取消删除')
      recordResult('用户取消删除操作')
    })
}

/**
 * 显示 Prompt 输入框
 */
const showPrompt = () => {
  message
    .prompt({
      title: '请输入邮箱',
      inputValue: inputValue.value,
      inputPattern: /.[^\n\r@\u2028\u2029]*@.+\..+/,
      inputError: '请输入正确的邮箱格式',
    })
    .then((resp) => {
      toast.show(`输入的邮箱：${resp.value}`)
      inputValue.value = resp.value as string
      recordResult(`用户输入邮箱：${resp.value}`)
    })
    .catch(() => {
      console.log('取消输入')
      recordResult('用户取消邮箱输入')
    })
}

/**
 * 显示长文本 Alert
 */
const showLongTextAlert = () => {
  message.alert({
    msg: '以上文字是示例文字，仅用于演示长文本在弹框中的显示效果。当文本内容超过弹框最大高度时，会自动启用滚动功能，确保用户能够完整查看所有内容。这样的设计既保证了界面的美观性，又确保了信息的完整传达。在实际应用中，可能会遇到更长的文本内容，比如用户协议、隐私政策、详细的操作说明等。',
    title: '长文本提示',
  })
  console.log('显示长文本 Alert')
}

/**
 * 显示确认前钩子示例
 */
const showBeforeConfirm = () => {
  message
    .confirm({
      msg: '是否删除？',
      title: '提示',
      beforeConfirm: ({ resolve }) => {
        toast.loading('删除中...')
        setTimeout(() => {
          toast.close()
          resolve(true)
          toast.success('删除成功')
        }, 3000)
      },
    })
    .then(() => {
      console.log('删除完成')
      recordResult('异步删除操作完成')
    })
    .catch(() => {
      console.log('取消删除')
      recordResult('用户取消异步删除')
    })
}

/**
 * 显示自定义按钮样式
 */
const showCustomButton = () => {
  message
    .confirm({
      msg: '自定义按钮样式',
      title: '提示',
      cancelButtonProps: {
        round: false,
        type: 'error',
        customClass: 'custom-shadow',
      },
      confirmButtonProps: {
        round: false,
        type: 'success',
        customClass: 'custom-shadow',
      },
    })
    .then(() => {
      toast.show('确认操作')
      recordResult('确认自定义按钮操作')
    })
    .catch(() => {
      console.log('取消操作')
      recordResult('取消自定义按钮操作')
    })
}

/**
 * 显示禁用遮罩关闭
 */
const showNoModalClose = () => {
  message
    .confirm({
      msg: '此弹框禁用了遮罩关闭，只能点击按钮关闭',
      title: '禁用遮罩关闭',
      closeOnClickModal: false,
    })
    .then(() => {
      toast.show('确认操作')
      recordResult('确认禁用遮罩关闭操作')
    })
    .catch(() => {
      console.log('取消操作')
      recordResult('取消禁用遮罩关闭操作')
    })
}

/**
 * 邮箱格式验证
 */
const showEmailPrompt = () => {
  message
    .prompt({
      title: '请输入邮箱',
      inputPlaceholder: '请输入有效的邮箱地址',
      inputPattern: /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/,
      inputError: '请输入正确的邮箱格式',
    })
    .then((resp) => {
      toast.show(`邮箱：${resp.value}`)
      recordResult(`邮箱验证通过：${resp.value}`)
    })
    .catch(() => {
      console.log('取消输入')
      recordResult('用户取消邮箱验证')
    })
}

/**
 * 数字范围验证
 */
const showNumberPrompt = () => {
  message
    .prompt({
      title: '请输入数字（1-100）',
      inputType: 'number',
      inputPlaceholder: '请输入1-100之间的数字',
      inputValidate: (value) => {
        const num = Number(value)
        return !Number.isNaN(num) && num >= 1 && num <= 100
      },
      inputError: '请输入1-100之间的有效数字',
    })
    .then((resp) => {
      toast.show(`数字：${resp.value}`)
      recordResult(`数字验证通过：${resp.value}`)
    })
    .catch(() => {
      console.log('取消输入')
      recordResult('用户取消数字验证')
    })
}

/**
 * 密码强度验证
 */
const showPasswordPrompt = () => {
  message
    .prompt({
      title: '设置密码',
      inputType: 'password',
      inputPlaceholder: '至少8位，包含字母和数字',
      inputValidate: (value) => {
        const password = String(value)
        return password.length >= 8 && /[a-z]/i.test(password) && /\d/.test(password)
      },
      inputError: '密码至少8位，且包含字母和数字',
    })
    .then((resp) => {
      toast.show('密码设置成功')
      recordResult('密码强度验证通过')
    })
    .catch(() => {
      console.log('取消设置')
      recordResult('用户取消密码设置')
    })
}

/**
 * 显示评分弹框
 */
const showCustomSlot = () => {
  // 重置评分值，让用户重新评分
  rateValue.value = 0

  messageWithSlot
    .confirm({
      title: '请为本次服务评分',
      confirmButtonText: '提交评分',
      cancelButtonText: '稍后评分',
      // 只有评分大于0才能提交
      beforeConfirm: ({ resolve }) => {
        if (rateValue.value === 0) {
          toast.show('请先进行评分')
          resolve(false) // 阻止关闭
        } else {
          resolve(true) // 允许关闭
        }
      }
    })
    .then(() => {
      message.alert(`感谢您的评分：${rateValue.value} 分`)
      recordResult(`用户评分：${rateValue.value} 分`)
    })
    .catch(() => {
      console.log('取消评分')
      recordResult('用户取消评分')
      // 用户取消时重置评分
      rateValue.value = 3
    })
}

/**
 * 显示表单弹框
 */
const showFormSlot = () => {
  formMessage
    .confirm({
      title: '完善信息',
      confirmButtonText: '提交',
      cancelButtonText: '稍后填写',
    })
    .then(() => {
      toast.show(`信息已保存：${formData.value.name}`)
      recordResult(`表单提交：姓名=${formData.value.name}, 手机=${formData.value.phone}`)
    })
    .catch(() => {
      console.log('取消填写')
      recordResult('用户取消表单填写')
    })
}

// === 应用场景方法 ===

/**
 * 删除确认
 */
const showDeleteConfirm = () => {
  message
    .confirm({
      msg: '确定要删除这条数据吗？删除后无法恢复。',
      title: '删除确认',
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
    })
    .then(() => {
      recordResult('用户确认删除数据')
      toast.success('删除成功')
    })
    .catch(() => {
      recordResult('用户取消删除操作')
    })
}

/**
 * 退出登录确认
 */
const showLogoutConfirm = () => {
  message
    .confirm({
      msg: '确定要退出当前账号吗？',
      title: '退出登录',
      confirmButtonText: '确定退出',
      cancelButtonText: '取消',
    })
    .then(() => {
      recordResult('用户确认退出登录')
      toast.success('已退出登录')
    })
    .catch(() => {
      recordResult('用户取消退出登录')
    })
}

/**
 * 提交表单确认
 */
const showSubmitConfirm = () => {
  message
    .confirm({
      msg: '确定要提交表单吗？提交后无法修改。',
      title: '提交确认',
      confirmButtonText: '确定提交',
      cancelButtonText: '再检查一下',
    })
    .then(() => {
      recordResult('用户确认提交表单')
      toast.success('表单提交成功')
    })
    .catch(() => {
      recordResult('用户取消表单提交')
    })
}

/**
 * 保存草稿确认
 */
const showSaveConfirm = () => {
  message
    .confirm({
      msg: '是否保存当前内容为草稿？',
      title: '保存草稿',
      confirmButtonText: '保存',
      cancelButtonText: '不保存',
    })
    .then(() => {
      recordResult('用户确认保存草稿')
      toast.success('草稿保存成功')
    })
    .catch(() => {
      recordResult('用户取消保存草稿')
    })
}

/**
 * 意见反馈
 */
const showFeedbackPrompt = () => {
  message
    .prompt({
      title: '意见反馈',
      inputPlaceholder: '请输入您的宝贵意见...',
      inputValidate: (value) => String(value).trim().length >= 5,
      inputError: '反馈内容至少5个字符',
    })
    .then((resp) => {
      recordResult(`收到用户反馈：${resp.value}`)
      toast.success('反馈提交成功')
    })
    .catch(() => {
      recordResult('用户取消反馈')
    })
}

/**
 * 取消原因
 */
const showReasonPrompt = () => {
  message
    .prompt({
      title: '取消原因',
      inputPlaceholder: '请告诉我们取消的原因...',
      inputValidate: (value) => String(value).trim().length >= 3,
      inputError: '原因描述至少3个字符',
    })
    .then((resp) => {
      recordResult(`用户取消原因：${resp.value}`)
      toast.success('感谢您的反馈')
    })
    .catch(() => {
      recordResult('用户未填写取消原因')
    })
}

/**
 * 评价商品
 */
const showCommentPrompt = () => {
  message
    .prompt({
      title: '评价商品',
      inputPlaceholder: '请分享您的使用体验...',
      inputValidate: (value) => String(value).trim().length >= 10,
      inputError: '评价内容至少10个字符',
    })
    .then((resp) => {
      recordResult(`用户商品评价：${resp.value}`)
      toast.success('评价提交成功')
    })
    .catch(() => {
      recordResult('用户取消商品评价')
    })
}

/**
 * 验证码输入
 */
const showCodePrompt = () => {
  message
    .prompt({
      title: '输入验证码',
      inputType: 'number',
      inputPlaceholder: '请输入6位验证码',
      inputValidate: (value) => {
        const code = String(value)
        return /^\d{6}$/.test(code)
      },
      inputError: '请输入6位数字验证码',
    })
    .then((resp) => {
      recordResult(`验证码验证：${resp.value}`)
      toast.success('验证码验证成功')
    })
    .catch(() => {
      recordResult('用户取消验证码输入')
    })
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
/* 自定义按钮阴影样式 */
.custom-shadow {
  box-shadow:
    0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}
</style>
