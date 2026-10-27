<template>
  <view class="h-100vh flex flex-col">
    <!-- 导航栏 -->
    <wd-navbar show-back />

    <!-- 主要内容区域 -->
    <view class="px-6 pt-12">
      <wd-text text="请输入验证码" size="42" block />
      <view class="mt-2">
        <wd-text text="短信已发送至" type="info" size="24" />
        <wd-text :text="formatPhone" size="30" />
      </view>

      <!-- 验证码输入框 -->
      <wd-password-input
        v-model="verificationCode"
        custom-class="mt-8!"
        :focused="inputFocused"
        :error-info="errorMessage"
        @focus="handleInputFocus"
      />

      <!-- 登录按钮 -->
      <wd-button
        custom-class="w-full mt-8"
        type="error"
        :disabled="!isCodeComplete"
        :loading="isLogging"
        @click="handleLogin"
      >
        {{ isLogging ? '登录中...' : '登录' }}
      </wd-button>

      <!-- 重新发送 -->
      <view class="mt-2 flex items-center justify-between">
        <wd-text text="收不到验证码？" type="info" size="24" />
        <view v-if="countdown > 0" class="flex">
          <wd-count-down :time="countdown * 1000" format="ss" @finish="handleCountdownFinish" />
          秒后重新发送
        </view>
        <wd-text v-else text="重新发送" type="primary" size="28" @click="handleResendSms" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useToast } from '@/wd'

interface PageParams {
  phone: string
  type: 'login' | 'register' | 'forgot-password'
}

// 页面参数
const pageParams = ref<PageParams>({
  phone: '',
  type: 'login',
})

// 响应式数据
const verificationCode = ref('')
const countdown = ref(60)
const isLogging = ref(false)
const inputFocused = ref(true)
const errorMessage = ref('')

// 计算属性
const formatPhone = computed(() => {
  const phone = pageParams.value.phone
  if (phone.length === 11) {
    return `+86 ${phone.slice(0, 3)} ${phone.slice(3, 7)} ${phone.slice(7)}`
  }
  return phone
})

const isCodeComplete = computed(() => {
  return verificationCode.value.length === 4
})

// 处理登录
const handleLogin = async () => {
  if (!isCodeComplete.value || isLogging.value) return

  isLogging.value = true
  const userStore = useUserStore()
  const [err] = await userStore.login('sms', {
    phone: pageParams.value.phone,
    smsCode: verificationCode.value,
  })
  if (!err) {
    // 验证成功
    useToast().success('登录成功')
    // 登录成功后跳转
    setTimeout(() => {
      uni.redirectTo({
        url: '/pages/index/index',
      })
    }, 1500)
  } else {
    // 验证失败
    useToast().error('验证码错误，请重新输入')
    console.error('登录失败:', err)
    errorMessage.value = '验证码错误，请重新输入'
    verificationCode.value = ''
    inputFocused.value = true // 重新聚焦输入框
  }
  isLogging.value = false
}

// 监听验证码输入
watch(verificationCode, (newVal) => {
  // 清除错误信息
  if (errorMessage.value) {
    errorMessage.value = ''
  }

  // 如果输入完成，自动提交
  if (newVal.length === 6) {
    setTimeout(() => {
      handleLogin()
    }, 500) // 稍微延迟一下，让用户看到输入完成
  }
})

// 输入框聚焦处理
const handleInputFocus = () => {
  inputFocused.value = true
}

// 倒计时结束处理
const handleCountdownFinish = () => {
  countdown.value = 0
}

// 重新发送短信
const handleResendSms = async () => {
  if (countdown.value > 0) return

  try {
    // 这里调用发送短信API
    console.log('重新发送短信到:', pageParams.value.phone)

    useToast().success('验证码已发送')

    // 重新开始倒计时
    countdown.value = 60

    // 清空之前输入的验证码和错误信息
    verificationCode.value = ''
    errorMessage.value = ''
    inputFocused.value = true
  } catch (error) {
    console.error('发送短信失败:', error)
    useToast().error('发送失败，请重试')
  }
}

// 页面生命周期
onLoad((options: PageParams) => {
  pageParams.value = {
    phone: options.phone || '',
    type: (options.type as any) || 'login',
  }

  // 自动聚焦输入框
  setTimeout(() => {
    inputFocused.value = true
  }, 500)
})
</script>

<style lang="scss" scoped>
// 自定义密码输入框样式
:deep(.wd-password-input) {
  .wd-password-input__item {
    border: 2px solid #f0f0f0;
    border-radius: 8px;
    font-size: 24px;
    font-weight: 500;

    &.is-focus {
      border-color: #ff6b9d;
    }

    &.is-filled {
      border-color: #ff6b9d;
      background-color: #fff5f8;
    }
  }
}

:deep(.wd-password-input__error-info) {
  color: #ff4444;
  font-size: 14px;
  margin-top: 8px;
}
</style>
