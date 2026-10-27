<!-- 登录 -->
<template>
  <view class="h-100vh flex flex-col items-center">
    <wd-navbar title="登录" show-back />

    <!--  顶部占位  -->
    <view class="min-h-20 w-100vw flex-[1]" />

    <!--  登录表单  -->
    <view class="flex flex-shrink-0 flex-col items-center">
      <!--   Logo   -->
      <wd-img custom-class="" width="150" height="150" src="/static/logo.png" />
      <!--   租户所在公司标题   -->
      <wd-text :text="captcha.tenantTitle || '若依工作室'" size="45" bold />

      <!--  密码登录表单区域  -->
      <wd-form
        ref="loginFormRef"
        custom-class="p-10"
        :model="loginForm"
        :rules="formRules"
      >
        <!--    用户名    -->
        <wd-input
          v-model="loginForm.userName"
          no-border
          custom-input-class="border border-solid border-1 border-gray-100 rounded-6 px-4 py-1.5"
          error-message-offset="38"
          prop="userName"
          placeholder="请输入用户名"
          clearable
        />
        <!--    密码    -->
        <wd-input
          v-model="loginForm.password"
          no-border
          custom-input-class="mt-8 border border-solid border-1 border-gray-100 rounded-6 px-4 py-1.5 "
          error-message-offset="38"
          prop="password"
          show-password
          placeholder="请输入密码"
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
            v-model="loginForm.code"
            no-border
            :reserve-error-space="false"
            custom-input-class="border border-solid border-1 border-gray-100 rounded-6 px-4 py-1.5 ml-4"
            error-message-offset="64"
            prop="code"
            clearable
            placeholder="请输入验证码"
          />
        </view>
        <!--    记住我与注册    -->
        <view class="mt-8 flex items-center justify-between">
          <wd-checkbox v-model="loginForm.rememberMe">记住我</wd-checkbox>
          <wd-button
            v-if="captcha.registerEnabled"
            type="default"
            custom-class="text-primary!"
            @click="handleRegister"
          >
            立即注册
          </wd-button>
        </view>
        <!--    登录    -->
        <view class="">
          <wd-button custom-class="mt-4 w-100%" type="primary" @click="handlePasswordLogin">
            登录
          </wd-button>
        </view>
      </wd-form>

      <!--    其他登录    -->
      <view v-if="supportedMethods.some((method) => ['sms'].includes(method))">
        <wd-divider custom-class="mt-4! w-50">其他登录</wd-divider>
        <view class="mt-4 flex items-center justify-center">
          <!--     手机号登录     -->
          <wd-button
            custom-class="mx-4!"
            icon="i-ic-round-phone-android"
            type="icon"
            icon-color="gray"
            icon-size="64"
            @click="handlePhoneLogin"
          />
        </view>
      </view>
    </view>

    <!-- 底部占位 -->
    <view class="min-h-20 w-100vw flex-[2]" />
  </view>
</template>

<script setup lang="ts">
import type { CaptchaVo, PasswordLoginBody } from '@/api/system/auth/authTypes'
import type { FormInstance } from '@/wd'
import type { FormRules } from '@/wd/components/wd-form/wd-form.vue'
import { imgCode } from '@/api/system/auth/authApi'
import { useUserStore } from '@/stores/modules/user'
import { SystemConfig } from '@/systemConfig'
import { cache } from '@/utils/cache'
import { encryptLocal, decryptLocal } from '@/utils/crypto'
import { DEFAULT_TENANT_ID, getTenantId } from '@/utils/tenant'
import { toValidate } from '@/utils/to'
import { useToast } from '@/wd'

/**
 * 组件属性定义
 * @param redirect - 登录成功后的跳转地址
 */
const props = defineProps<{
  redirect?: string
}>()

const userStore = useUserStore()
const toast = useToast()
const auth = useAuth()

// 表单引用
const loginFormRef = ref<FormInstance>()

// 表单数据（包含记住密码字段）
const loginForm = ref<PasswordLoginBody>({
  authType: 'password',
  userName: '',
  password: '',
  code: '',
  uuid: '',
  rememberMe: false,
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

// 表单校验规则
const formRules = ref<FormRules>({
  userName: [
    { required: true, message: '请输入用户名' },
    { min: 3, max: 20, message: '用户名不能少于3个字符' },
  ],
  password: [{ required: true, message: '请输入密码' }],
  code: [{ required: true, message: '请输入验证码' }],
})

// 计算属性
const supportedMethods = computed(() => userStore.getSupportedLoginMethods())

// ==================== 缓存管理方法 ====================

/** 保存登录数据到本地缓存（密码加密存储） */
const saveLoginDataToCache = () => {
  if (loginForm.value.rememberMe) {
    const loginDataToCache: PasswordLoginBody = {
      authType: 'password',
      userName: loginForm.value.userName,
      password: encryptLocal(loginForm.value.password),
      rememberMe: true,
    }
    cache.set('loginData', loginDataToCache)
  } else {
    cache.remove('loginData')
  }
}

/** 从本地缓存恢复登录数据（密码解密读取） */
const restoreLoginDataFromCache = () => {
  const cachedLoginData = cache.get<PasswordLoginBody>('loginData')

  if (cachedLoginData && cachedLoginData.rememberMe) {
    loginForm.value.userName = cachedLoginData.userName || ''
    loginForm.value.password = decryptLocal(cachedLoginData.password || '') || cachedLoginData.password || ''
    loginForm.value.rememberMe = true
  }
}

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
      loginForm.value.uuid = captcha.value.uuid
    }
  }
}

/** 初始化表单默认值的方法 */
const initializeFormData = () => {
  setTimeout(() => {
    const tenantId = getTenantId()
    const isDev = SystemConfig.app.env === 'development'
    const isDefaultTenant = tenantId === DEFAULT_TENANT_ID || !tenantId
    if (isDev && isDefaultTenant) {
      loginForm.value.userName = 'superadmin'
      loginForm.value.password = 'admin123'
    }
  }, 1000)
}

// ==================== 业务处理方法 ====================

/**
 * 登录成功处理
 */
const handleLoginSuccess = async () => {
  toast.loading('登录成功，正在跳转...')

  // 注意: 不需要在这里获取用户信息
  // userStore.loginWithPassword() 内部已经初始化了 WebSocket
  // useAppInit 会在应用启动时自动获取用户信息

  // 跳转到目标页面
  const redirectUrl = props.redirect || '/pages/index/index'
  setTimeout(() => {
    toast.close() // 关闭loading
    uni.redirectTo({ url: redirectUrl })
  }, 500)
}

/**
 * 初始化登录页面
 */
const initLoginPage = async () => {
  // 如果用户已经登录，直接跳转
  if (auth.isLoggedIn.value) {
    toast.loading('正在跳转...')
    const redirectUrl = props.redirect || '/pages/index/index'
    setTimeout(() => {
      toast.close()
      uni.redirectTo({ url: redirectUrl })
    }, 500)
    return
  }

  // 加载验证码配置
  await refreshCaptchaImage()

  // 初始化表单数据
  initializeFormData()
  // 加载记住的登录信息
  restoreLoginDataFromCache()
}

/**
 * 刷新验证码
 */
const refreshCaptcha = async () => {
  await refreshCaptchaImage()
  loginForm.value.code = ''
}

/**
 * 处理密码登录
 */
const handlePasswordLogin = async () => {
  // 表单校验
  const [validErr, valid] = await toValidate(loginFormRef)
  if (!valid) return

  // 处理记住密码功能
  saveLoginDataToCache()

  // 准备提交的登录数据（移除前端专用字段）
  const submitData: PasswordLoginBody = {
    authType: loginForm.value.authType,
    userName: loginForm.value.userName.trim(),
    password: loginForm.value.password,
    code: loginForm.value.code.trim(),
    uuid: captcha.value.uuid,
  }

  const [err] = await userStore.loginWithPassword(submitData)

  if (!err) {
    handleLoginSuccess()
  } else {
    toast.error(err.message || '登录失败')
    // 刷新验证码
    if (captcha.value.captchaEnabled) {
      await refreshCaptcha()
      loginForm.value.code = ''
    }
  }
}

/**
 * 处理注册
 */
const handleRegister = () => {
  uni.navigateTo({ url: '/pages/auth/register' })
}

/**
 * 处理手机号登录
 */
const handlePhoneLogin = () => {
  // 跳转到手机号登录页面，传递重定向地址
  const redirectUrl = props.redirect
    ? `/pages/auth/phoneLogin?redirect=${props.redirect}`
    : '/pages/auth/phoneLogin'

  uni.navigateTo({ url: redirectUrl })
}

/**
 * 组件挂载后的初始化处理
 */
onMounted(() => {
  initLoginPage()
})
</script>

<style lang="scss" scoped></style>
