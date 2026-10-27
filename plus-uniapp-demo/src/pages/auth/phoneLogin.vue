<template>
  <view class="h-100vh flex flex-col">
    <!-- 导航栏 -->
    <wd-navbar show-back />

    <!-- 主要内容区域 -->
    <view class="px-6 pt-8">
      <wd-text text="登录发现更多精彩" size="42" block />
      <wd-text
        custom-class="mt-1"
        type="info"
        text="未注册的手机号验证通过后将自动注册"
        size="28"
        block
      />

      <wd-input
        v-model="phoneNumber"
        placeholder="请输入手机号"
        no-border
        custom-class="bg-#F9F9F9! px-3 py-2 rounded-lg mt-6"
      >
        <template #prefix>
          <wd-text text="+86" />
        </template>
      </wd-input>

      <!-- 密码登录切换 -->
      <view class="mt-3 flex items-center" @click="handlePasswordLogin">
        <wd-icon name="swap" size="24" class="mr-2 text-blue-500" />
        <wd-text text="密码登录" size="24" type="primary" />
      </view>

      <!-- 验证并登录按钮 -->
      <wd-button
        type="error"
        :disabled="!isPhoneValid"
        @click="handleSendSms"
        custom-class="w-full mt-5"
      >
        验证并登录
      </wd-button>

      <!-- 用户协议 -->
      <view class="mt-3 flex items-start">
        <wd-checkbox v-model="agreedToTerms" custom-class="mt-1" />
        <view class="text-xs">
          <wd-text text="已阅读并同意" />
          <wd-text text="用户协议" type="primary" @click="handleShowAgreement('user')" />
          <wd-text text="，运营商将对你提供的手机号进行验证" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { smsCode } from '@/api/system/auth/authApi'
import { useMessage, useToast } from '@/wd'

// 响应式数据
const phoneNumber = ref('')
const agreedToTerms = ref(false)

// 计算属性
const isPhoneValid = computed(() => {
  return /^1[3-9]\d{9}$/.test(phoneNumber.value)
})

const handleSendSms = async () => {
  if (!isPhoneValid.value) return
  if (!agreedToTerms.value) {
    const { action } = await useMessage().confirm('是否同意用户协议？')
    if (action !== 'confirm') {
      return
    }
  }
  const [err] = await smsCode(phoneNumber.value)
  if (!err) {
    // 跳转到验证码页面
    uni.navigateTo({
      url: `/pages/auth/smsVerify?phone=${phoneNumber.value}&type=login`,
    })
  } else {
    useToast().error('发送验证码失败，请稍后再试')
  }
}

const handlePasswordLogin = () => {
  uni.navigateBack() ||
    uni.redirectTo({
      url: '/pages/auth/login',
    })
}

const handleShowAgreement = (type: 'user' | 'privacy') => {
  // 显示用户协议或隐私政策
  console.log('待实现协议展示:', type)
}
</script>

<style lang="scss" scoped></style>
