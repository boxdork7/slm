<!-- Keyboard 虚拟键盘 http://127.0.0.1:100/#/pages-sub/demo/wd/keyboard -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Keyboard 虚拟键盘" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的虚拟键盘使用方式">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="默认键盘" is-link @click="showKeyboard('default')" />
        <wd-cell title="带额外按键的键盘" is-link @click="showKeyboard('extraKey')" />
        <wd-cell title="身份证键盘" is-link @click="showKeyboard('idCard')" />
        <wd-cell title="带标题的键盘" is-link @click="showKeyboard('withTitle')" />
      </wd-cell-group>

      <!-- 基本键盘 -->
      <wd-keyboard
        v-model:visible="keyboardStates.default"
        @input="handleInput"
        @delete="handleDelete"
        @close="handleClose"
      />

      <!-- 带额外按键的键盘 -->
      <wd-keyboard
        v-model:visible="keyboardStates.extraKey"
        extra-key="."
        close-text="完成"
        @input="handleInput"
        @delete="handleDelete"
        @close="handleClose"
      />

      <!-- 身份证键盘 -->
      <wd-keyboard
        v-model:visible="keyboardStates.idCard"
        extra-key="X"
        close-text="完成"
        @input="handleInput"
        @delete="handleDelete"
        @close="handleClose"
      />

      <!-- 带标题的键盘 -->
      <wd-keyboard
        v-model:visible="keyboardStates.withTitle"
        title="输入密码"
        extra-key="."
        close-text="完成"
        @input="handleInput"
        @delete="handleDelete"
        @close="handleClose"
      />

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 默认键盘" :code="codes.basic.defaultTemplate" />
        <DemoCode title="模板 - 带额外按键的键盘" :code="codes.basic.extraKeyTemplate" />
        <DemoCode title="模板 - 身份证键盘" :code="codes.basic.idCardTemplate" />
        <DemoCode title="模板 - 带标题的键盘" :code="codes.basic.withTitleTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 高级配置示例 -->
    <DemoSection title="高级配置" desc="自定义模式和特殊功能键盘">
      <wd-cell-group>
        <wd-cell title="自定义模式键盘" is-link @click="showKeyboard('custom')" />
        <wd-cell title="多个额外按键" is-link @click="showKeyboard('multiExtra')" />
        <wd-cell title="随机数字键盘" is-link @click="showKeyboard('random')" />
        <wd-cell title="车牌号键盘" is-link @click="showKeyboard('car')" />
      </wd-cell-group>

      <!-- 自定义模式键盘 -->
      <wd-keyboard
        v-model:visible="keyboardStates.custom"
        mode="custom"
        extra-key="."
        close-text="完成"
        @input="handleInput"
        @delete="handleDelete"
        @close="handleClose"
      />

      <!-- 多个额外按键 -->
      <wd-keyboard
        v-model:visible="keyboardStates.multiExtra"
        mode="custom"
        :extra-key="['00', '.']"
        close-text="完成"
        @input="handleInput"
        @delete="handleDelete"
        @close="handleClose"
      />

      <!-- 随机数字键盘 -->
      <wd-keyboard
        v-model:visible="keyboardStates.random"
        random-key-order
        @input="handleInput"
        @delete="handleDelete"
        @close="handleClose"
      />

      <!-- 车牌号键盘 -->
      <wd-keyboard
        v-model:visible="keyboardStates.car"
        mode="car"
        @input="handleInput"
        @delete="handleDelete"
        @close="handleClose"
      />

      <template #codes>
        <DemoCode title="模板 - 自定义模式键盘" :code="codes.advanced.customTemplate" />
        <DemoCode title="模板 - 多个额外按键" :code="codes.advanced.multiExtraTemplate" />
        <DemoCode title="模板 - 随机数字键盘" :code="codes.advanced.randomTemplate" />
        <DemoCode title="模板 - 车牌号键盘" :code="codes.advanced.carTemplate" />
        <DemoCode title="脚本 - 高级配置" :code="codes.advanced.script" />
      </template>
    </DemoSection>

    <!-- 自定义样式示例 -->
    <DemoSection title="自定义样式" desc="自定义标题和按钮文本">
      <wd-cell-group>
        <wd-cell title="插槽自定义标题" is-link @click="showKeyboard('customTitle')" />
        <wd-cell title="自定义按钮文本" is-link @click="showKeyboard('customButton')" />
        <wd-cell title="显示蒙层" is-link @click="showKeyboard('withModal')" />
      </wd-cell-group>

      <!-- 插槽自定义标题 -->
      <wd-keyboard
        v-model:visible="keyboardStates.customTitle"
        extra-key="."
        close-text="完成"
        @input="handleInput"
        @delete="handleDelete"
        @close="handleClose"
      >
        <template #title>
          <text class="text-red-500 font-medium">🔐 自定义标题</text>
        </template>
      </wd-keyboard>

      <!-- 自定义按钮文本 -->
      <wd-keyboard
        v-model:visible="keyboardStates.customButton"
        title="输入金额"
        extra-key="."
        close-text="确认"
        delete-text="清除"
        @input="handleInput"
        @delete="handleDelete"
        @close="handleClose"
      />

      <!-- 显示蒙层 -->
      <wd-keyboard
        v-model:visible="keyboardStates.withModal"
        :modal="true"
        title="数字键盘"
        @input="handleInput"
        @delete="handleDelete"
        @close="handleClose"
      />

      <template #codes>
        <DemoCode title="模板 - 插槽自定义标题" :code="codes.custom.titleTemplate" />
        <DemoCode title="模板 - 自定义按钮文本" :code="codes.custom.buttonTemplate" />
        <DemoCode title="模板 - 显示蒙层" :code="codes.custom.modalTemplate" />
        <DemoCode title="脚本 - 自定义样式" :code="codes.custom.script" />
      </template>
    </DemoSection>

    <!-- 双向绑定示例 -->
    <DemoSection title="双向绑定" desc="通过 v-model 实现数据双向绑定">
      <!-- 输入结果展示 -->
      <view class="space-y-4">
        <wd-cell-group>
          <wd-cell
            title="双向绑定输入"
            :value="bindingValue || '点击输入'"
            is-link
            @click="showKeyboard('binding')"
          />
          <wd-cell
            title="限制长度输入"
            :value="limitedValue || '最多6位'"
            is-link
            @click="showKeyboard('limited')"
          />
        </wd-cell-group>

        <!-- 实时显示输入值 -->
        <view class="mx-4 rounded-lg bg-blue-50 p-4">
          <view class="mb-2 text-sm text-blue-700 font-medium">实时输入值</view>
          <view class="border rounded bg-white p-3">
            <view class="mb-2">
              <text class="text-xs text-gray-500">双向绑定值：</text>
              <text class="font-mono">{{ bindingValue || '空' }}</text>
            </view>
            <view>
              <text class="text-xs text-gray-500">限制长度值：</text>
              <text class="font-mono">{{ limitedValue || '空' }}</text>
              <text class="text-xs text-gray-400">（最多6位）</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 双向绑定键盘 -->
      <wd-keyboard
        v-model="bindingValue"
        v-model:visible="keyboardStates.binding"
        title="双向绑定输入"
        extra-key="."
        close-text="完成"
        @input="handleBindingInput"
        @delete="handleBindingDelete"
        @close="handleClose"
      />

      <!-- 限制长度键盘 -->
      <wd-keyboard
        v-model="limitedValue"
        v-model:visible="keyboardStates.limited"
        :maxlength="6"
        title="限制6位数字"
        extra-key="."
        close-text="完成"
        @input="handleLimitedInput"
        @delete="handleLimitedDelete"
        @close="handleClose"
      />

      <template #codes>
        <DemoCode title="模板 - 双向绑定键盘" :code="codes.binding.template" />
        <DemoCode title="模板 - 限制长度键盘" :code="codes.binding.limitedTemplate" />
        <DemoCode title="脚本 - 双向绑定" :code="codes.binding.script" />
      </template>
    </DemoSection>

    <!-- 实际应用场景 -->
    <DemoSection title="实际应用场景" desc="常见的业务场景示例">
      <!-- 应用场景展示 -->
      <view class="space-y-4">
        <!-- 支付密码输入 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">支付密码输入</view>
          <view class="mx-4 rounded-lg bg-gray-50 p-4">
            <view class="mb-3 text-center">
              <text class="text-lg font-medium">请输入支付密码</text>
            </view>
            <view class="mb-4 flex justify-center space-x-2">
              <view
                v-for="i in 6"
                :key="i"
                class="h-12 w-12 flex items-center justify-center border-2 rounded"
                :class="
                  i <= paymentPassword.length ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                "
              >
                <text v-if="i <= paymentPassword.length" class="text-2xl">•</text>
              </view>
            </view>
            <wd-button block @click="showKeyboard('payment')">输入密码</wd-button>
          </view>
        </view>

        <!-- 金额输入 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">金额输入</view>
          <view class="mx-4 rounded-lg bg-green-50 p-4">
            <view class="mb-3 text-center">
              <text class="text-sm text-gray-600">转账金额</text>
            </view>
            <view class="mb-4 text-center">
              <text class="text-3xl text-green-600 font-bold">¥{{ amountValue || '0.00' }}</text>
            </view>
            <wd-button block type="success" @click="showKeyboard('amount')">输入金额</wd-button>
          </view>
        </view>
      </view>

      <!-- 支付密码键盘 -->
      <wd-keyboard
        v-model="paymentPassword"
        v-model:visible="keyboardStates.payment"
        :maxlength="6"
        title="输入支付密码"
        :show-delete-key="true"
        @input="handlePaymentInput"
        @delete="handlePaymentDelete"
        @close="handleClose"
      />

      <!-- 金额输入键盘 -->
      <wd-keyboard
        v-model="amountValue"
        v-model:visible="keyboardStates.amount"
        mode="custom"
        extra-key="."
        title="输入转账金额"
        close-text="确认"
        @input="handleAmountInput"
        @delete="handleAmountDelete"
        @close="handleClose"
      />

      <template #codes>
        <DemoCode title="模板 - 支付密码场景" :code="codes.scenarios.paymentTemplate" />
        <DemoCode title="脚本 - 支付密码场景" :code="codes.scenarios.paymentScript" />
        <DemoCode title="模板 - 金额输入场景" :code="codes.scenarios.amountTemplate" />
        <DemoCode title="脚本 - 金额输入场景" :code="codes.scenarios.amountScript" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />

    <!-- Toast 提示 -->
    <wd-toast />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/wd'

// ===== 组件状态管理 =====

// Toast 实例
const toast = useToast()

// 键盘显示状态管理
const keyboardStates = ref({
  default: false,
  extraKey: false,
  idCard: false,
  withTitle: false,
  custom: false,
  multiExtra: false,
  random: false,
  car: false,
  customTitle: false,
  customButton: false,
  withModal: false,
  binding: false,
  limited: false,
  payment: false,
  amount: false,
})

// 输入数据状态
const bindingValue = ref<string>('')
const limitedValue = ref<string>('')
const paymentPassword = ref<string>('')
const amountValue = ref<string>('')

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    defaultTemplate: `<wd-keyboard
  v-model:visible="show"
  @input="handleInput"
  @delete="handleDelete"
  @close="handleClose"
/>`,

    extraKeyTemplate: `<wd-keyboard
  v-model:visible="show"
  extra-key="."
  close-text="完成"
  @input="handleInput"
  @delete="handleDelete"
  @close="handleClose"
/>`,

    idCardTemplate: `<wd-keyboard
  v-model:visible="show"
  extra-key="X"
  close-text="完成"
  @input="handleInput"
  @delete="handleDelete"
  @close="handleClose"
/>`,

    withTitleTemplate: `<wd-keyboard
  v-model:visible="show"
  title="输入密码"
  extra-key="."
  close-text="完成"
  @input="handleInput"
  @delete="handleDelete"
  @close="handleClose"
/>`,

    script: `import { ref } from 'vue'
import { useToast } from '@/wd'

const toast = useToast()
const show = ref(false)

const handleInput = (value: string) => {
  toast.show(\`输入: \${value}\`)
}

const handleDelete = () => {
  toast.show('删除')
}

const handleClose = () => {
  toast.show('关闭键盘')
}`,
  },

  // 高级配置代码
  advanced: {
    customTemplate: `<wd-keyboard
  v-model:visible="show"
  mode="custom"
  extra-key="."
  close-text="完成"
  @input="handleInput"
  @delete="handleDelete"
  @close="handleClose"
/>`,

    multiExtraTemplate: `<wd-keyboard
  v-model:visible="show"
  mode="custom"
  :extra-key="['00', '.']"
  close-text="完成"
  @input="handleInput"
  @delete="handleDelete"
  @close="handleClose"
/>`,

    randomTemplate: `<wd-keyboard
  v-model:visible="show"
  random-key-order
  @input="handleInput"
  @delete="handleDelete"
  @close="handleClose"
/>`,

    carTemplate: `<wd-keyboard
  v-model:visible="show"
  mode="car"
  @input="handleInput"
  @delete="handleDelete"
  @close="handleClose"
/>`,

    script: `// 高级配置示例
const customShow = ref(false)
const randomOrder = ref(true)
const extraKeys = ref(['00', '.'])

// 车牌号模式特别适用于车牌输入场景
const carMode = ref('car')`,
  },

  // 自定义样式代码
  custom: {
    titleTemplate: `<wd-keyboard
  v-model:visible="show"
  extra-key="."
  close-text="完成"
  @input="handleInput"
  @delete="handleDelete"
  @close="handleClose"
>
  <template #title>
    <text class="text-red-500 font-medium">🔐 自定义标题</text>
  </template>
</wd-keyboard>`,

    buttonTemplate: `<wd-keyboard
  v-model:visible="show"
  title="输入金额"
  extra-key="."
  close-text="确认"
  delete-text="清除"
  @input="handleInput"
  @delete="handleDelete"
  @close="handleClose"
/>`,

    modalTemplate: `<wd-keyboard
  v-model:visible="show"
  :modal="true"
  title="数字键盘"
  @input="handleInput"
  @delete="handleDelete"
  @close="handleClose"
/>`,

    script: `// 自定义样式配置
const showModal = ref(true)
const customCloseText = ref('确认')
const customDeleteText = ref('清除')`,
  },

  // 双向绑定代码
  binding: {
    template: `<wd-keyboard
  v-model="inputValue"
  v-model:visible="show"
  title="双向绑定输入"
  extra-key="."
  close-text="完成"
  @input="handleInput"
  @delete="handleDelete"
  @close="handleClose"
/>`,

    limitedTemplate: `<wd-keyboard
  v-model="limitedValue"
  v-model:visible="show"
  :maxlength="6"
  title="限制6位数字"
  extra-key="."
  close-text="完成"
  @input="handleInput"
  @delete="handleDelete"
  @close="handleClose"
/>`,

    script: `import { ref } from 'vue'

const inputValue = ref('')
const limitedValue = ref('')
const show = ref(false)

const handleInput = (value: string) => {
  console.log('输入字符:', value)
}

const handleDelete = () => {
  console.log('删除字符')
}

const handleClose = () => {
  console.log('关闭键盘')
}`,
  },

  // 应用场景代码
  scenarios: {
    paymentTemplate: `<!-- 支付密码展示 -->
<view class="mb-4 flex justify-center space-x-2">
  <view
    v-for="i in 6"
    :key="i"
    class="flex h-12 w-12 items-center justify-center rounded border-2"
    :class="i <= paymentPassword.length ? 'border-blue-500 bg-blue-50' : 'border-gray-300'"
  >
    <text v-if="i <= paymentPassword.length" class="text-2xl">•</text>
  </view>
</view>

<!-- 键盘组件 -->
<wd-keyboard
  v-model="paymentPassword"
  v-model:visible="show"
  :maxlength="6"
  title="输入支付密码"
  @input="handlePaymentInput"
  @delete="handlePaymentDelete"
/>`,

    paymentScript: `const paymentPassword = ref('')
const show = ref(false)

const handlePaymentInput = (value: string) => {
  console.log('输入密码字符:', value)
  // 密码长度达到6位时自动处理
  if (paymentPassword.value.length === 6) {
    // 处理支付逻辑
    console.log('密码输入完成:', paymentPassword.value)
  }
}

const handlePaymentDelete = () => {
  console.log('删除密码字符')
}`,

    amountTemplate: `<!-- 金额展示 -->
<view class="mb-4 text-center">
  <text class="text-3xl font-bold text-green-600">
    ¥{{ amountValue || '0.00' }}
  </text>
</view>

<!-- 键盘组件 -->
<wd-keyboard
  v-model="amountValue"
  v-model:visible="show"
  mode="custom"
  extra-key="."
  title="输入转账金额"
  close-text="确认"
  @input="handleAmountInput"
  @delete="handleAmountDelete"
/>`,

    amountScript: `const amountValue = ref('')
const show = ref(false)

const handleAmountInput = (value: string) => {
  console.log('输入金额:', value)
  // 可以添加金额格式验证逻辑
  validateAmount(amountValue.value)
}

const handleAmountDelete = () => {
  console.log('删除金额字符')
}

const validateAmount = (amount: string) => {
  // 金额验证逻辑
  const regex = /^\\d+(\\.\\d{0,2})?$/
  return regex.test(amount)
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'visible',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示键盘',
  },
  {
    name: 'model-value',
    type: 'String',
    default: '""',
    desc: '绑定的输入值，支持双向绑定',
  },
  {
    name: 'title',
    type: 'String',
    default: '""',
    desc: '键盘标题',
  },
  {
    name: 'mode',
    type: 'String',
    default: '"default"',
    desc: '键盘模式：default / custom / car',
  },
  {
    name: 'z-index',
    type: 'Number',
    default: '100',
    desc: '键盘层级',
  },
  {
    name: 'maxlength',
    type: 'Number',
    default: 'Infinity',
    desc: '输入值的最大长度',
  },
  {
    name: 'show-delete-key',
    type: 'Boolean',
    default: 'true',
    desc: '是否显示删除键',
  },
  {
    name: 'random-key-order',
    type: 'Boolean',
    default: 'false',
    desc: '是否随机排列数字键盘顺序',
  },
  {
    name: 'close-text',
    type: 'String',
    default: '""',
    desc: '关闭按钮文本',
  },
  {
    name: 'delete-text',
    type: 'String',
    default: '""',
    desc: '删除按钮文本',
  },
  {
    name: 'close-button-loading',
    type: 'Boolean',
    default: 'false',
    desc: '关闭按钮是否显示加载状态',
  },
  {
    name: 'modal',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示蒙层',
  },
  {
    name: 'hide-on-click-outside',
    type: 'Boolean',
    default: 'true',
    desc: '是否在点击外部时关闭键盘',
  },
  {
    name: 'lock-scroll',
    type: 'Boolean',
    default: 'true',
    desc: '是否锁定背景滚动',
  },
  {
    name: 'safe-area-inset-bottom',
    type: 'Boolean',
    default: 'true',
    desc: '是否开启底部安全区适配',
  },
  {
    name: 'extra-key',
    type: 'String | Array<String>',
    default: '""',
    desc: '额外按键内容，可以是字符串或字符串数组',
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

// Methods 方法文档（Keyboard 组件没有暴露方法）
const apiMethods: any[] = []

// Events 事件文档
const apiEvents = [
  {
    name: 'input',
    desc: '点击按键时触发，参数为当前点击的按键值',
  },
  {
    name: 'delete',
    desc: '点击删除键时触发',
  },
  {
    name: 'close',
    desc: '点击关闭按钮或点击外部关闭时触发',
  },
  {
    name: 'update:visible',
    desc: '键盘显示状态改变时触发',
  },
  {
    name: 'update:modelValue',
    desc: '绑定值改变时触发（双向绑定）',
  },
]

// ===== 事件处理方法 =====

/**
 * 显示指定类型的键盘
 */
const showKeyboard = (type: keyof typeof keyboardStates.value) => {
  // 关闭所有键盘
  Object.keys(keyboardStates.value).forEach((key) => {
    keyboardStates.value[key as keyof typeof keyboardStates.value] = false
  })
  // 显示指定键盘
  keyboardStates.value[type] = true
  console.log(`显示${type}键盘`)
}

/**
 * 处理键盘输入事件
 */
const handleInput = (value: string) => {
  toast.show(`输入: ${value}`)
  console.log('键盘输入:', value)
}

/**
 * 处理键盘删除事件
 */
const handleDelete = () => {
  toast.show('删除')
  console.log('键盘删除')
}

/**
 * 处理键盘关闭事件
 */
const handleClose = () => {
  toast.show('关闭键盘')
  console.log('键盘关闭')
}

// === 双向绑定事件处理方法 ===

/**
 * 处理双向绑定输入事件
 */
const handleBindingInput = (value: string) => {
  console.log('双向绑定输入:', value, '当前值:', bindingValue.value)
}

/**
 * 处理双向绑定删除事件
 */
const handleBindingDelete = () => {
  console.log('双向绑定删除，当前值:', bindingValue.value)
}

/**
 * 处理限制长度输入事件
 */
const handleLimitedInput = (value: string) => {
  console.log('限制长度输入:', value, '当前值:', limitedValue.value)
}

/**
 * 处理限制长度删除事件
 */
const handleLimitedDelete = () => {
  console.log('限制长度删除，当前值:', limitedValue.value)
}

// === 应用场景事件处理方法 ===

/**
 * 处理支付密码输入事件
 */
const handlePaymentInput = (value: string) => {
  console.log('支付密码输入:', value, '当前长度:', paymentPassword.value.length)
  // 密码长度达到6位时自动处理
  if (paymentPassword.value.length === 6) {
    console.log('密码输入完成:', paymentPassword.value)
    toast.show('密码输入完成')
    // 可以在这里触发支付逻辑
    setTimeout(() => {
      keyboardStates.value.payment = false
    }, 1000)
  }
}

/**
 * 处理支付密码删除事件
 */
const handlePaymentDelete = () => {
  console.log('支付密码删除，当前长度:', paymentPassword.value.length)
}
/**
 * 验证金额格式
 */
const validateAmount = (amount: string) => {
  // 金额验证逻辑：最多两位小数
  const regex = /^\d+(?:\.\d{0,2})?$/
  const isValid = regex.test(amount)
  console.log('金额格式验证:', amount, '是否有效:', isValid)
  return isValid
}
/**
 * 处理金额输入事件
 */
const handleAmountInput = (value: string) => {
  console.log('金额输入:', value, '当前金额:', amountValue.value)
  // 可以添加金额格式验证逻辑
  validateAmount(amountValue.value)
}

/**
 * 处理金额删除事件
 */
const handleAmountDelete = () => {
  console.log('金额删除，当前金额:', amountValue.value)
}
const { resetScrollTop, updateScrollTop } = useScroll()
onShow(() => {
  resetScrollTop()
})
onPageScroll((e) => {
  updateScrollTop(e.scrollTop)
})
</script>
