<!-- 手机号登录 -->
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

      <!-- 图形验证码：发短信的前置校验，用于拦短信轰炸；后端关掉开关时整块不显示 -->
      <view v-if="captchaEnabled" class="mt-4 flex items-center">
        <wd-input
          v-model="imgCodeValue"
          placeholder="请输入图形验证码"
          no-border
          custom-class="bg-#F9F9F9! px-3 py-2 rounded-lg flex-1"
        />
        <image
          v-if="captchaImg"
          :src="captchaImg"
          class="captcha-img ml-3"
          mode="aspectFit"
          @click="refreshCaptcha"
        />
      </view>

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
import { computed, onMounted, ref } from 'vue'
import { imgCode, smsCode } from '@/api/system/auth/authApi'
import { useMessage, useToast } from '@/wd'

// 响应式数据
const phoneNumber = ref('')
const agreedToTerms = ref(false)

/* 图形验证码：是发短信的前置条件，开关由后端下发，关闭时本页不显示也不参与发码 */
const captchaEnabled = ref(false)
const captchaImg = ref('')
const captchaUuid = ref('')
const imgCodeValue = ref('')

// 计算属性
const isPhoneValid = computed(() => {
  return /^1[3-9]\d{9}$/.test(phoneNumber.value)
})

/* 取一张新的图形验证码，点图片换图也走这里；顺带清掉上一次的输入 */
const refreshCaptcha = async () => {
  const [err, data] = await imgCode()
  if (err) return
  /* 开启时后端不显式回传该字段，取 VO 默认值 true；只有关闭时才显式回 false */
  captchaEnabled.value = data.captchaEnabled ?? true
  captchaImg.value = data.img || ''
  captchaUuid.value = data.uuid || ''
  imgCodeValue.value = ''
}

onMounted(() => {
  refreshCaptcha()
})

const handleSendSms = async () => {
  if (!isPhoneValid.value) return
  if (!agreedToTerms.value) {
    const { action } = await useMessage().confirm('是否同意用户协议？')
    if (action !== 'confirm') {
      return
    }
  }
  /* 开着图形验证码却没填，后端必然拒绝，提前拦下省一次无谓往返 */
  if (captchaEnabled.value && !imgCodeValue.value) {
    useToast().error('请输入图形验证码')
    return
  }
  const [err] = await smsCode(phoneNumber.value, imgCodeValue.value, captchaUuid.value)

  /*
    图形验证码一次性消费：后端无论校验成败都已把它删掉，所以发完就得换一张。
    成功时也要换 —— 用户从验证码页返回本页再次发码，带的还是那个失效 uuid，必然失败。
  */
  if (captchaEnabled.value) refreshCaptcha()

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

<style lang="scss" scoped>
/* 图形验证码图片：与输入框视觉等高，固定宽度保证有足够的点击换图热区 */
.captcha-img {
  width: 200rpx;
  height: 76rpx;
  border-radius: 8rpx;
}
</style>
