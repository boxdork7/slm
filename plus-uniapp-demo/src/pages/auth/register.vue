<template>
  <view class="h-100vh flex flex-col items-center">
    <wd-navbar title="注册" />

    <!--  顶部占位  -->
    <view class="min-h-20 w-100vw flex-[1]" />

    <!--  注册表单  -->
    <view class="flex flex-shrink-0 flex-col items-center">
      <!--   Logo   -->
      <wd-img custom-class="" width="150" height="150" src="/static/logo.png" />
      <!--   租户所在公司标题   -->
      <wd-text :text="captcha.tenantTitle || '若依工作室'" size="45" bold />

      <wd-form ref="registerFormRef" custom-class="p-10" :model="registerForm" :rules="formRules">
        <!--    用户名    -->
        <wd-input
          v-model="registerForm.userName"
          no-border
          custom-input-class="border border-solid border-1 border-gray-100 rounded-6 px-4 py-1.5"
          error-message-offset="38"
          prop="userName"
          placeholder="请输入用户名"
          clearable
        />
        <!--    密码    -->
        <wd-input
          v-model="registerForm.password"
          no-border
          custom-input-class="mt-8 border border-solid border-1 border-gray-100 rounded-6 px-4 py-1.5 "
          error-message-offset="38"
          prop="password"
          show-password
          placeholder="请输入密码"
          clearable
        />
        <!--    确认密码    -->
        <wd-input
          v-model="registerForm.confirmPassword"
          no-border
          custom-input-class="mt-8 border border-solid border-1 border-gray-100 rounded-6 px-4 py-1.5 "
          error-message-offset="38"
          prop="confirmPassword"
          show-password
          placeholder="请确认密码"
          clearable
        />
        <!--    验证码    -->
        <view v-if="captcha.captchaEnabled" class="mt-8 flex items-center">
          <wd-img
            width="240"
            height="80"
            custom-class="bg-gray-100"
            :src="captcha.img"
            @click="refreshCaptcha"
          />
          <wd-input
            v-model="registerForm.code"
            no-border
            :reserve-error-space="false"
            custom-input-class="border border-solid border-1 border-gray-100 rounded-6 px-4 py-1.5 ml-4"
            error-message-offset="64"
            prop="code"
            clearable
            placeholder="请输入验证码"
          />
        </view>

        <!--    注册按钮    -->
        <view class="">
          <wd-button
            custom-class="mt-8 w-100%"
            type="primary"
            :loading="isSubmitting"
            @click="handleRegisterSubmit"
          >
            <text v-if="!isSubmitting">注册</text>
            <text v-else>注册中...</text>
          </wd-button>
        </view>

        <!--    登录链接    -->
        <view class="mt-4 flex justify-center">
          <wd-button type="default" @click="handleLogin" custom-class="text-primary!">
            已有账号？立即登录
          </wd-button>
        </view>
      </wd-form>
    </view>

    <!-- 底部占位 -->
    <view class="min-h-20 w-100vw flex-[2]" />
  </view>
</template>

<script setup lang="ts">
import type { CaptchaVo, RegisterBody } from '@/api/system/auth/authTypes'
import type { FormInstance } from '@/wd'
import type { FormRules } from '@/wd/components/wd-form/wd-form.vue'
import { imgCode, userRegister } from '@/api/system/auth/authApi'
import { toValidate } from '@/utils/to'
import { useToast } from '@/wd'

interface RegisterPageOptions {
  /** 注册成功后的跳转地址 */
  redirect?: string
}

// 页面参数
const registerPageOptions = ref<RegisterPageOptions>({})

// 表单引用
const registerFormRef = ref<FormInstance>()

// 表单数据
const registerForm = ref<RegisterBody>({
  authType: 'password',
  userType: 'app_user',
  userName: '',
  password: '',
  confirmPassword: '',
  code: '',
  uuid: '',
})

// 验证码信息
const captcha = ref<CaptchaVo>({
  tenantEnabled: false,
  tenantTitle: '',
  registerEnabled: false,
  captchaEnabled: false,
  uuid: '',
  img: '',
})

// 业务状态
const isSubmitting = ref(false) // 是否正在提交注册

// 表单校验规则
const formRules = ref<FormRules>({
  userName: [
    { required: true, message: '请输入用户名' },
    { min: 2, max: 20, message: '用户名长度为2-20个字符' },
  ],
  password: [
    { required: true, message: '请输入密码' },
    { min: 5, max: 20, message: '密码长度为5-20个字符' },
    {
      pattern: /^[^<>"'|\\]+$/,
      message: '密码不能包含特殊字符 < > " \' \\ |',
    },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码' },
    {
      validator: (value: string) => {
        if (registerForm.value.password !== value) {
          return false
        }
        return true
      },
      message: '两次输入的密码不一致',
    },
  ],
  code: [{ required: true, message: '请输入验证码' }],
})

// ==================== 数据初始化方法 ====================

/** 获取并刷新验证码图片 */
const refreshCaptchaImage = async () => {
  const [err, data] = await imgCode()
  if (!err) {
    // 更新验证码信息
    captcha.value = {
      tenantEnabled: data.tenantEnabled ?? false,
      tenantTitle: data.tenantTitle || '',
      registerEnabled: data.registerEnabled ?? false,
      captchaEnabled: data.captchaEnabled ?? false,
      uuid: data.uuid,
      img: data.img,
    }

    // 更新表单中的验证码UUID
    if (captcha.value.captchaEnabled) {
      registerForm.value.uuid = captcha.value.uuid
    }
  }
}
/**
 * 初始化注册页面
 */
const initRegisterPage = async () => {
  // 加载验证码配置
  await refreshCaptchaImage()
}

// ==================== 业务处理方法 ====================

/**
 * 刷新验证码
 */
const refreshCaptcha = async () => {
  await refreshCaptchaImage()
  registerForm.value.code = ''
}
/**
 * 处理用户注册提交
 */
const handleRegisterSubmit = async () => {
  // 表单校验
  const [validErr, valid] = await toValidate(registerFormRef)
  if (!valid) return

  isSubmitting.value = true

  // 准备提交的注册数据（移除前端专用字段）
  const submitData: RegisterBody = {
    authType: registerForm.value.authType,
    userType: registerForm.value.userType,
    userName: registerForm.value.userName.trim(),
    password: registerForm.value.password,
    code: registerForm.value.code.trim(),
    uuid: captcha.value.uuid,
  }

  const [error] = await userRegister(submitData)

  if (!error) {
    // 注册成功
    const userName = registerForm.value.userName
    useToast().success(`注册成功！欢迎 ${userName}`)

    // 延时跳转到登录页面
    setTimeout(() => {
      const redirectUrl = registerPageOptions.value.redirect
        ? `/pages/auth/login?redirect=${encodeURIComponent(registerPageOptions.value.redirect)}`
        : '/pages/auth/login'
      uni.navigateBack() || uni.redirectTo({ url: redirectUrl })
    }, 2000)
  } else {
    // 注册失败
    useToast().error(error.message || '注册失败，请重试')

    // 刷新验证码
    if (captcha.value.captchaEnabled) {
      await refreshCaptcha()
      registerForm.value.code = ''
    }
  }
  isSubmitting.value = false
}

/**
 * 处理登录跳转
 */
const handleLogin = () => {
  const redirectUrl = registerPageOptions.value.redirect
    ? `/pages/auth/login?redirect=${encodeURIComponent(registerPageOptions.value.redirect)}`
    : '/pages/auth/login'
  uni.navigateBack() || uni.redirectTo({ url: redirectUrl })
}

// 页面生命周期
onLoad((options: RegisterPageOptions) => {
  registerPageOptions.value = options || {}
  console.log('注册页面参数:', registerPageOptions.value)
})

onMounted(() => {
  initRegisterPage()
})
</script>

<style lang="scss" scoped></style>
