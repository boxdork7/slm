<!-- SlideVerify 滑动验证 http://127.0.0.1:100/#/pages-sub/form/slideVerify -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="SlideVerify 滑动验证" show-back />

    <!-- 实时预览区域 -->
    <view class="mx-4 mt-4 border-2 border-purple-300 rounded-xl border-dashed bg-white p-4">
      <view class="mb-3 text-base font-medium">📱 实时预览</view>
      <view class="flex justify-center">
        <wd-slide-verify
          ref="previewRef"
          :width="demoWidth"
          :height="demoHeight"
          :text="demoText"
          :success-text="demoSuccessText"
          :disabled="demoDisabled"
          :tolerance="demoTolerance"
          :background-color="demoBgColor"
          :active-background-color="demoActiveBgColor"
          @success="onPreviewSuccess"
          @fail="onPreviewFail"
          @change="onPreviewChange"
        />
      </view>
      <view class="mt-3 text-center text-sm text-gray-600">
        {{ previewStatus }}
      </view>
      <view v-if="previewSucceeded" class="mt-2 flex justify-center">
        <wd-button size="small" @click="resetPreview">重置验证</wd-button>
      </view>
    </view>

    <!-- 实时配置面板 -->
    <view class="mx-4 mt-4 rounded-xl bg-purple-50 p-4">
      <view class="mb-3 text-base text-purple-800 font-medium">⚙️ 实时配置</view>
      <view class="space-y-3">
        <!-- 开关选项 -->
        <view class="flex items-center gap-4">
          <wd-checkbox v-model="demoDisabled" size="small">禁用</wd-checkbox>
        </view>

        <!-- 容差配置 -->
        <view class="flex items-center gap-2">
          <text class="text-sm text-purple-600">容差（px）：</text>
          <input
            v-model="demoTolerance"
            type="number"
            class="w-20 border rounded px-2 py-1 text-center"
            placeholder="10"
          >
        </view>
      </view>
    </view>

    <!-- 基本用法 -->
    <DemoSection title="基本用法" desc="最简单的滑动验证，用户拖动滑块到右侧完成验证">
      <view class="flex justify-center p-4">
        <wd-slide-verify
          ref="basicRef"
          @success="onBasicSuccess"
          @fail="onBasicFail"
        />
      </view>
      <view class="text-center text-sm text-gray-600">
        {{ basicStatus }}
      </view>
      <view v-if="basicSucceeded" class="mt-2 flex justify-center">
        <wd-button size="small" @click="resetBasic">重置</wd-button>
      </view>

      <template #codes>
        <DemoCode title="模板" :code="codes.basic.template" />
        <DemoCode title="脚本" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 自定义文本 -->
    <DemoSection title="自定义文本" desc="可自定义提示文本和验证成功后的文本">
      <view class="flex justify-center p-4">
        <wd-slide-verify
          ref="customTextRef"
          text="向右滑动完成拼图"
          success-text="太棒了！"
          @success="customTextStatus = '✅ 太棒了！'"
          @fail="customTextStatus = '❌ 再试一次'"
        />
      </view>
      <view class="text-center text-sm text-gray-600">
        {{ customTextStatus }}
      </view>

      <template #codes>
        <DemoCode title="模板" :code="codes.customText.template" />
      </template>
    </DemoSection>

    <!-- 自定义颜色 -->
    <DemoSection title="自定义颜色" desc="通过 background-color 和 active-background-color 自定义颜色">
      <view class="space-y-4 p-4">
        <view class="text-center text-sm text-gray-500">蓝色主题</view>
        <view class="flex justify-center">
          <wd-slide-verify background-color="#E8F4FD" active-background-color="#409EFF" />
        </view>

        <view class="text-center text-sm text-gray-500">橙色主题</view>
        <view class="flex justify-center">
          <wd-slide-verify background-color="#FDF6EC" active-background-color="#E6A23C" />
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板" :code="codes.customColor.template" />
      </template>
    </DemoSection>

    <!-- 自定义尺寸 -->
    <DemoSection title="自定义尺寸" desc="数字类型默认单位为 rpx，也支持字符串如 '100%'">
      <view class="space-y-4 p-4">
        <view class="text-center text-sm text-gray-500">宽度 100%</view>
        <view class="flex justify-center">
          <wd-slide-verify width="100%" />
        </view>

        <view class="text-center text-sm text-gray-500">高度 100rpx</view>
        <view class="flex justify-center">
          <wd-slide-verify :height="100" />
        </view>

        <view class="text-center text-sm text-gray-500">小尺寸 400 × 60</view>
        <view class="flex justify-center">
          <wd-slide-verify :width="400" :height="60" />
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板" :code="codes.customSize.template" />
      </template>
    </DemoSection>

    <!-- 禁用状态 -->
    <DemoSection title="禁用状态" desc="设置 disabled 属性禁用滑动验证">
      <view class="flex justify-center p-4">
        <wd-slide-verify disabled text="暂不可用" />
      </view>

      <template #codes>
        <DemoCode title="模板" :code="codes.disabled.template" />
      </template>
    </DemoSection>

    <!-- 事件监听 -->
    <DemoSection title="事件监听" desc="监听 change 事件获取实时进度">
      <view class="flex justify-center p-4">
        <wd-slide-verify
          ref="eventRef"
          @success="eventStatus = '✅ 验证成功'"
          @fail="eventStatus = '❌ 验证失败'"
          @change="onEventChange"
        />
      </view>
      <view class="mx-4 rounded-lg bg-blue-50 p-4">
        <view class="mb-2 text-sm text-blue-800 font-medium">📊 实时数据</view>
        <view class="text-sm text-blue-600 space-y-1">
          <view>状态：{{ eventStatus }}</view>
          <view>偏移量：{{ eventOffsetX }}px</view>
          <view>进度：{{ eventPercent }}%</view>
        </view>
      </view>
      <view class="mt-2 flex justify-center">
        <wd-button size="small" @click="resetEvent">重置</wd-button>
      </view>

      <template #codes>
        <DemoCode title="模板" :code="codes.event.template" />
        <DemoCode title="脚本" :code="codes.event.script" />
      </template>
    </DemoSection>

    <!-- 实际应用场景 -->
    <DemoSection title="实际应用场景" desc="登录表单中使用滑动验证">
      <view class="mx-4 border rounded-lg bg-white p-4">
        <view class="mb-3 text-sm font-medium">🔐 登录验证</view>
        <view class="space-y-3">
          <wd-input v-model="loginForm.username" label="账号" label-width="60px" placeholder="请输入账号" />
          <wd-input v-model="loginForm.password" label="密码" label-width="60px" placeholder="请输入密码" type="password" />
          <view class="flex justify-center py-2">
            <wd-slide-verify
              ref="loginVerifyRef"
              width="100%"
              @success="loginVerified = true"
              @fail="loginVerified = false"
            />
          </view>
          <wd-button type="primary" block :disabled="!loginVerified" @click="handleLogin">
            {{ loginVerified ? '登录' : '请先完成验证' }}
          </wd-button>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 登录验证" :code="codes.scenarios.template" />
        <DemoCode title="脚本 - 登录验证" :code="codes.scenarios.script" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :events="apiEvents" :methods="apiMethods" />
  </view>
</template>

<script setup lang="ts">
import type { SlideVerifyInstance } from '@/wd'
import { useToast } from '@/wd'
import { ref } from 'vue'

// ===== 预览区域 =====
const previewRef = ref<SlideVerifyInstance>()
const previewStatus = ref('请拖动滑块完成验证')
const previewSucceeded = ref(false)
const demoWidth = ref(600)
const demoHeight = ref(80)
const demoText = ref('请滑动验证')
const demoSuccessText = ref('验证成功')
const demoDisabled = ref(false)
const demoTolerance = ref(10)
const demoBgColor = ref('#F5F7FA')
const demoActiveBgColor = ref('#49C75F')

const onPreviewSuccess = () => {
  previewStatus.value = '✅ 验证成功'
  previewSucceeded.value = true
}
const onPreviewFail = () => {
  previewStatus.value = '❌ 验证失败，请重试'
}
const onPreviewChange = (e: { offsetX: number; percent: number }) => {
  previewStatus.value = `拖动中... 进度: ${e.percent}%`
}
const resetPreview = () => {
  previewRef.value?.reset()
  previewStatus.value = '请拖动滑块完成验证'
  previewSucceeded.value = false
}

// ===== 基本用法 =====
const basicRef = ref<SlideVerifyInstance>()
const basicStatus = ref('请拖动滑块')
const basicSucceeded = ref(false)

const onBasicSuccess = () => {
  basicStatus.value = '✅ 验证成功'
  basicSucceeded.value = true
}
const onBasicFail = () => {
  basicStatus.value = '❌ 请重试'
}
const resetBasic = () => {
  basicRef.value?.reset()
  basicStatus.value = '请拖动滑块'
  basicSucceeded.value = false
}

// ===== 自定义文本 =====
const customTextRef = ref<SlideVerifyInstance>()
const customTextStatus = ref('请拖动滑块')

// ===== 事件监听 =====
const eventRef = ref<SlideVerifyInstance>()
const eventStatus = ref('等待操作')
const eventOffsetX = ref(0)
const eventPercent = ref(0)

const onEventChange = (e: { offsetX: number; percent: number }) => {
  eventOffsetX.value = Math.round(e.offsetX)
  eventPercent.value = e.percent
  eventStatus.value = '拖动中...'
}
const resetEvent = () => {
  eventRef.value?.reset()
  eventStatus.value = '等待操作'
  eventOffsetX.value = 0
  eventPercent.value = 0
}

// ===== 登录场景 =====
const toast = useToast()
const loginVerifyRef = ref<SlideVerifyInstance>()
const loginVerified = ref(false)
const loginForm = reactive({
  username: '',
  password: '',
})

const handleLogin = () => {
  if (!loginVerified.value) return
  toast.success('登录成功（示例）')
}

// ===== 代码片段 =====
const codes = {
  basic: {
    template: `<wd-slide-verify
  ref="verifyRef"
  @success="onSuccess"
  @fail="onFail"
/>

<wd-button size="small" @click="verifyRef?.reset()">重置</wd-button>`,

    script: `import type { SlideVerifyInstance } from '@/wd'

const verifyRef = ref<SlideVerifyInstance>()

const onSuccess = () => {
  console.log('验证成功')
}

const onFail = () => {
  console.log('验证失败')
}`,
  },

  customText: {
    template: `<wd-slide-verify
  text="向右滑动完成拼图"
  success-text="太棒了！"
  @success="onSuccess"
/>`,
  },

  customColor: {
    template: `<!-- 蓝色主题 -->
<wd-slide-verify background-color="#E8F4FD" active-background-color="#409EFF" />

<!-- 橙色主题 -->
<wd-slide-verify background-color="#FDF6EC" active-background-color="#E6A23C" />`,
  },

  customSize: {
    template: `<!-- 宽度 100% -->
<wd-slide-verify width="100%" />

<!-- 高度 100rpx -->
<wd-slide-verify :height="100" />

<!-- 小尺寸 -->
<wd-slide-verify :width="400" :height="60" />`,
  },

  disabled: {
    template: `<wd-slide-verify disabled text="暂不可用" />`,
  },

  event: {
    template: `<wd-slide-verify
  ref="eventRef"
  @success="eventStatus = '验证成功'"
  @fail="eventStatus = '验证失败'"
  @change="onEventChange"
/>`,

    script: `const eventOffsetX = ref(0)
const eventPercent = ref(0)

const onEventChange = (e: { offsetX: number; percent: number }) => {
  eventOffsetX.value = Math.round(e.offsetX)
  eventPercent.value = e.percent
}`,
  },

  scenarios: {
    template: `<wd-input v-model="form.username" label="账号" placeholder="请输入账号" />
<wd-input v-model="form.password" label="密码" placeholder="请输入密码" type="password" />

<wd-slide-verify
  ref="verifyRef"
  width="100%"
  @success="verified = true"
  @fail="verified = false"
/>

<wd-button type="primary" block :disabled="!verified" @click="handleLogin">
  {{ verified ? '登录' : '请先完成验证' }}
</wd-button>`,

    script: `const verifyRef = ref<SlideVerifyInstance>()
const verified = ref(false)
const form = reactive({ username: '', password: '' })

const handleLogin = () => {
  if (!verified.value) return
  // 执行登录逻辑
}`,
  },
}

// ===== API 文档 =====
const apiProps = [
  { name: 'width', type: 'Number / String', default: '600', desc: '轨道宽度，数字默认 rpx，字符串支持 px/% 等' },
  { name: 'height', type: 'Number / String', default: '80', desc: '轨道高度，数字默认 rpx' },
  { name: 'tolerance', type: 'Number', default: '10', desc: '验证成功的容差像素' },
  { name: 'text', type: 'String', default: '"请滑动验证"', desc: '提示文本' },
  { name: 'success-text', type: 'String', default: '"验证成功"', desc: '验证成功后的文本' },
  { name: 'disabled', type: 'Boolean', default: 'false', desc: '是否禁用' },
  { name: 'background-color', type: 'String', default: '"#F5F7FA"', desc: '轨道背景色' },
  { name: 'active-background-color', type: 'String', default: '"#49C75F"', desc: '滑过区域激活色' },
  { name: 'icon', type: 'String', default: '"arrow-right"', desc: '滑块图标' },
  { name: 'success-icon', type: 'String', default: '"check"', desc: '成功图标' },
  { name: 'icon-size', type: 'Number / String', default: '40', desc: '滑块图标大小' },
  { name: 'success-icon-size', type: 'Number / String', default: '24', desc: '成功图标大小' },
  { name: 'custom-style', type: 'String', default: '""', desc: '自定义根节点样式' },
  { name: 'custom-class', type: 'String', default: '""', desc: '自定义根节点样式类' },
]

const apiEvents = [
  { name: 'success', desc: '验证成功时触发' },
  { name: 'fail', desc: '验证失败时触发（未拖到底松手）' },
  { name: 'change', desc: '拖动过程中触发，参数: { offsetX, percent }' },
]

const apiMethods = [
  { name: 'reset', desc: '重置验证状态', params: '-' },
]

const scroll = useScroll()

onShow(() => {
  scroll.resetScrollTop()
})
onPageScroll((e) => {
  scroll.updateScrollTop(e.scrollTop)
})
</script>
