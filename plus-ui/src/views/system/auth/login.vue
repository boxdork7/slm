<!-- 登录 -->
<template>
  <AuthLayout>
    <!-- 标题 -->
    <div class="auth-head">
      <h3 class="title">{{ t('login.welcomeBack') }}</h3>
      <p class="sub">{{ tenantTitle }}</p>
    </div>

    <!--
      登录方式页签：仅在可选方式 >1 时显示。
      只启用账号密码时整条 Tab 隐藏，未启用的方式连 DOM 都不生成。
    -->
    <div v-if="loginTabs.length > 1" class="auth-tabs">
      <button
        v-for="tab in loginTabs"
        :key="tab.key"
        type="button"
        class="auth-tab"
        :class="{ on: activeTab === tab.key }"
        @click="switchTab(tab.key)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="form-pane">
      <!--
        🔴 validate-on-rule-change 必须关掉（Element Plus 默认 true）
        本页 rules 是 computed：依赖 activeTab（切页签）与 captcha.captchaEnabled
        （imgCode 接口异步返回）。默认行为下 rules 一变就整表校验，会出现：
          · 进页面即红 —— imgCode 回来时开发环境自动填充（500ms 延时）还没执行，校验跑在空表单上
          · 切页签即红 —— 新页签字段本来就是空的
        校验只应由用户交互（blur/change）或点击登录触发。
      -->
      <el-form
        ref="loginFormRef"
        :model="loginFormData"
        :rules="loginFormRules"
        :validate-on-rule-change="false"
        :label-width="labelWidth"
        @submit.prevent
      >
        <!--
          字段区高度锁定：只在【真的会切换】时才锁，且锁在当前配置的实际最大高度上。
          写死高度会在「未启用验证码」时凭空撑出一块空白（实测 76px）。
        -->
        <div class="fields" :style="fieldsStyle">
          <!-- 租户 -->
          <el-form-item v-if="captcha.tenantEnabled" prop="tenantId" :label="t('login.tenantId')">
            <el-input
              v-model="loginFormData.tenantId"
              size="large"
              type="text"
              auto-complete="off"
              :placeholder="t('login.tenantId')"
              @blur="handleTenantIdBlur"
            >
              <template #prefix>
                <Icon code="company" class="input-icon" />
              </template>
            </el-input>
          </el-form-item>

          <!-- 账号密码 -->
          <template v-if="activeTab === 'password'">
            <el-form-item prop="userName" :label="t('login.userName')">
              <el-input v-model="loginFormData.userName" size="large" type="text" auto-complete="off" :placeholder="t('login.userName')">
                <template #prefix>
                  <Icon code="user" class="input-icon" />
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="password" :label="t('login.password')">
              <el-input
                v-model="loginFormData.password"
                size="large"
                type="password"
                auto-complete="off"
                show-password
                :placeholder="t('login.password')"
                @keyup.enter="handleLoginSubmit"
              >
                <template #prefix>
                  <Icon code="password" class="input-icon" />
                </template>
              </el-input>
            </el-form-item>
          </template>

          <!-- 手机号 / 邮箱：发码目标，属「身份字段」，必须排在图形验证码之前 -->
          <el-form-item v-else-if="activeTab === 'sms'" prop="phone" :label="t('login.phone')">
            <el-input v-model="loginFormData.phone" size="large" auto-complete="off" :placeholder="t('login.phone')">
              <template #prefix>
                <Icon code="phone" class="input-icon" />
              </template>
            </el-input>
          </el-form-item>

          <el-form-item v-else prop="email" :label="t('login.email')">
            <el-input v-model="loginFormData.email" size="large" auto-complete="off" :placeholder="t('login.email')">
              <template #prefix>
                <Icon code="email" class="input-icon" />
              </template>
            </el-input>
          </el-form-item>

          <!--
            图形验证码：三态共用这一份，位置统一定在「身份字段之后」。
            账密态它自然落在最后（用于登录校验）；短信/邮箱态则排到了发码字段之前 ——
            因为要先解出图形码才点得动「获取验证码」，DOM 顺序此时正好等于操作顺序。
            不用 CSS order 换位：那样只动视觉，Tab 焦点与读屏顺序仍停在原处，两者会脱节。
          -->
          <el-form-item v-if="captcha.captchaEnabled" prop="code" :label="t('login.code')">
            <div class="code-row">
              <el-input v-model="loginFormData.code" size="large" auto-complete="off" :placeholder="t('login.code')" @keyup.enter="handleLoginSubmit">
                <template #prefix>
                  <Icon code="security2" class="input-icon" />
                </template>
              </el-input>
              <el-image :src="captcha.img" class="captcha-image" @click="refreshCaptchaImage()" />
            </div>
          </el-form-item>

          <!-- 发码字段：短信/邮箱态专有。账密态不该出现，故第二个用 v-else-if 而非 v-else -->
          <el-form-item v-if="activeTab === 'sms'" prop="smsCode" :label="t('login.smsCode')">
            <div class="code-row">
              <el-input
                v-model="loginFormData.smsCode"
                size="large"
                auto-complete="off"
                :placeholder="t('login.smsCode')"
                @keyup.enter="handleLoginSubmit"
              >
                <template #prefix>
                  <Icon code="security2" class="input-icon" />
                </template>
              </el-input>
              <el-button class="send-code" size="large" :disabled="countdown > 0" @click="handleSendCode">
                {{ countdown > 0 ? t('login.resendCode', { seconds: countdown }) : t('login.sendCode') }}
              </el-button>
            </div>
          </el-form-item>

          <el-form-item v-else-if="activeTab === 'email'" prop="emailCode" :label="t('login.emailCode')">
            <div class="code-row">
              <el-input
                v-model="loginFormData.emailCode"
                size="large"
                auto-complete="off"
                :placeholder="t('login.emailCode')"
                @keyup.enter="handleLoginSubmit"
              >
                <template #prefix>
                  <Icon code="security2" class="input-icon" />
                </template>
              </el-input>
              <el-button class="send-code" size="large" :disabled="countdown > 0" @click="handleSendCode">
                {{ countdown > 0 ? t('login.resendCode', { seconds: countdown }) : t('login.sendCode') }}
              </el-button>
            </div>
          </el-form-item>
        </div>

        <!-- 记住我 / 忘记密码 -->
        <div class="form-meta">
          <el-checkbox v-model="loginFormData.rememberMe">{{ t('login.rememberPassword') }}</el-checkbox>
          <router-link class="link" to="/forgotPassword">{{ t('login.forgotPassword') }}</router-link>
        </div>

        <el-button class="submit-btn" :loading="isSubmitting" size="large" type="primary" @click.prevent="handleLoginSubmit">
          {{ isSubmitting ? t('login.logging') : t('login.login') }}
        </el-button>

        <!-- 注册入口 -->
        <div v-if="captcha.registerEnabled" class="register-row">
          <span>{{ t('login.noAccount') }}</span>
          <router-link class="link" to="/register">{{ t('login.registerNow') }}</router-link>
        </div>

        <!-- 第三方登录：布局随平台数量自适应，见 ASocialLogin -->
        <ASocialLogin :list="availableSocialLogins" @select="handleSocialLogin" />
      </el-form>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import AuthLayout from './components/AuthLayout.vue'
import ASocialLogin from './components/ASocialLogin.vue'
import { imgCode, socialBindUrl, smsCode, emailCode } from '@/api/system/auth/authApi'
import type { PasswordLoginBody, EmailLoginBody, SmsLoginBody, CaptchaVo, LoginRequest } from '@/api/system/auth/authTypes'
import { SystemConfig } from '@/systemConfig'
import { localCache } from '@/utils/cache'
import { encryptLocal, decryptLocal } from '@/utils/crypto'
import { showMsgError, showMsgSuccess } from '@/utils/modal'
import { to } from '@/utils/to'
import { getSocialConfigs, type SocialConfig } from '@/api/system/auth/socialConfig'

// ==================== 系统配置与工具 ====================
const { t, isChinese } = useI18n()

/**
 * 标签列宽度：随语言自适应
 *
 * 标签容器实际占用 = 文字宽 + 12px(内边距) + 10px(必填星号)。
 * 中文最宽的是「图形验证码」5 字（实测 14px 字号下 70px）：
 *   账密态该字段进了 loginFormRules，带必填星号 → 70 + 12 + 10 = 92px
 *   短信/邮箱态未进规则（由 handleSendCode 手动校验）→ 70 + 12 = 82px
 * 取两者较大值 92px，否则账密态会折行；
 * 英文即使已缩短，UserName 仍要 63 + 22 = 85px。
 * 写死一个值必然是「中文太空 或 英文换行」，故按语言给两档。
 */
const labelWidth = computed(() => (isChinese.value ? '92px' : '88px'))

const userStore = useUserStore()
const router = useRouter()

/** 登录方式 */
type LoginTab = 'password' | 'sms' | 'email'

// ==================== 响应式数据 ====================
const loginFormRef = ref<ElFormInstance>()

/** 当前登录方式 */
const activeTab = ref<LoginTab>('password')

/** 表单数据：三种登录方式共用，提交时按 activeTab 组装 */
const loginFormData = ref({
  tenantId: '',
  userName: '',
  password: '',
  code: '',
  uuid: '',
  phone: '',
  smsCode: '',
  email: '',
  emailCode: '',
  rememberMe: false
})

/** 验证码信息 */
/*
  captchaEnabled 初值取 false —— 表示「还没问到后端，先不渲染」而非「后端关了」。
  取 true 会让验证码框在 imgCode 返回前先画出来：后端若未启用，用户会看到它
  连同一张取不到的验证码图闪一下再消失；即便启用，那一瞬的图也是空的。
  宁可晚一点出现，不要错一下再改。
  注意与下方 `data.captchaEnabled ?? true` 区分：那是「接口回了但没带这个字段」的兜底，
  此时倾向按启用处理更安全，两者语义不同，不要一起改。
*/
const captcha = ref<CaptchaVo>({
  captchaEnabled: false,
  tenantEnabled: true,
  tenantId: '',
  tenantTitle: '',
  registerEnabled: false,
  uuid: '',
  img: ''
})

const isSubmitting = ref(false)
const redirectUrl = ref('/')
/** 发送验证码倒计时（秒） */
const countdown = ref(0)
let countdownTimer: ReturnType<typeof setInterval> | null = null

const availableSocialLogins = ref<SocialConfig[]>([])

// ==================== 计算属性 ====================
/** 副标题：优先展示租户名称 */
const tenantTitle = computed(() =>
  captcha.value.tenantEnabled && captcha.value.tenantTitle ? captcha.value.tenantTitle : t('login.subtitle', { app: SystemConfig.app.title })
)

/**
 * 可用的登录方式页签
 *
 * 短信/邮箱是否可用【以后端下发为准】—— 这两种登录要真能用，取决于后端是否配了
 * 短信服务商与邮件 SMTP，前端写死会出现「页签显示了但一发码就报错」。
 * SystemConfig.login 的同名开关退居兜底：只在接口没返回该字段时生效（旧版后端）。
 */
const loginTabs = computed(() => {
  const tabs: Array<{ key: LoginTab; label: string }> = [{ key: 'password', label: t('login.tab.password') }]
  if (captcha.value.smsEnabled ?? SystemConfig.login.smsEnabled) {
    tabs.push({ key: 'sms', label: t('login.tab.sms') })
  }
  if (captcha.value.emailEnabled ?? SystemConfig.login.emailEnabled) {
    tabs.push({ key: 'email', label: t('login.tab.email') })
  }
  return tabs
})

/**
 * 字段区最小高度
 *
 * 目的是「切页签时下方按钮不跳动」，所以：
 *   · 只有一种登录方式（无页签可切）→ 不锁，让内容自然撑开
 *   · 有多种方式 → 锁在**当前配置下**最高那一态，而不是写死值
 *
 * 各态字段数（租户字段所有态共有，不影响相对差）：
 *   账号密码 = 用户名 + 密码 (+ 图形验证码，仅当后端启用)
 *   手机/邮箱 = 手机号/邮箱 + 验证码 (+ 图形验证码，仅当后端启用)
 * 图形验证码已是三态共有字段（账密用于登录校验，短信/邮箱用于发码前置校验），
 * 所以三态恒等高：启用时各 3 行、未启用时各 2 行，maxRows 的取值逻辑不变。
 *
 * 单字段占位 64px = 输入框 42 + 间距 22（与 .el-form-item 的 margin-bottom 一致）。
 */
const FIELD_UNIT = 64

const fieldsStyle = computed(() => {
  // 无页签可切 → 不需要锁高，锁了反而在未启用验证码时凭空多出空白
  if (loginTabs.value.length <= 1) return {}
  const base = captcha.value.tenantEnabled ? 1 : 0
  const maxRows = base + (captcha.value.captchaEnabled ? 3 : 2)
  return { minHeight: `${maxRows * FIELD_UNIT}px` }
})

// ==================== 表单验证规则 ====================
/** 校验规则按当前页签动态生成，避免校验到隐藏字段导致无法提交 */
const loginFormRules = computed<ElFormRules>(() => {
  const rules: ElFormRules = {}
  if (activeTab.value === 'password') {
    rules.userName = [{ required: true, trigger: 'blur', message: t('login.rule.userName.required') }]
    rules.password = [{ required: true, trigger: 'blur', message: t('login.rule.password.required') }]
    /*
      图形验证码只在账密态进表单规则 —— 只有账密登录会把 code 提交给登录接口。
      短信/邮箱态的图形验证码只服务于「发码」，发完即被后端消费并由 refreshCaptchaImage 清空；
      若给这两态也加 required 规则，用户发完码再点登录会被这条空值规则挡死，根本登不进去。
      它们的非空检查放在 handleSendCode 里手动做。
    */
    if (captcha.value.captchaEnabled) {
      rules.code = [{ required: true, trigger: 'change', message: t('login.rule.code.required') }]
    }
  } else if (activeTab.value === 'sms') {
    rules.phone = [
      { required: true, trigger: 'blur', message: t('login.rule.phone.required') },
      { pattern: /^1[3-9]\d{9}$/, trigger: 'blur', message: t('login.rule.phone.invalid') }
    ]
    rules.smsCode = [{ required: true, trigger: 'blur', message: t('login.rule.smsCode.required') }]
  } else {
    rules.email = [
      { required: true, trigger: 'blur', message: t('login.rule.email.required') },
      { type: 'email', trigger: 'blur', message: t('login.rule.email.invalid') }
    ]
    rules.emailCode = [{ required: true, trigger: 'blur', message: t('login.rule.emailCode.required') }]
  }
  return rules
})

// ==================== 路由监听 ====================
/**
 * 监听路由变化，更新重定向URL
 */
watch(
  () => router.currentRoute.value,
  (newRoute: any) => {
    const queryRedirect = newRoute.query?.redirect
    if (queryRedirect) {
      redirectUrl.value = decodeURIComponent(queryRedirect)
    }
  },
  { immediate: true }
)

// ==================== 数据初始化方法 ====================

/** 初始化表单默认值的方法 */
const initializeFormData = () => {
  setTimeout(() => {
    const isDevelopment = SystemConfig.app.env === 'development'
    const cachedTenantId = localCache.get('tenantId')

    // 只在有缓存时才设置，否则等待验证码接口返回
    if (cachedTenantId) {
      loginFormData.value.tenantId = cachedTenantId

      // 只有是默认租户且开发环境才填充测试账号
      if (isDevelopment && cachedTenantId === '000000') {
        loginFormData.value.userName = 'superadmin'
        loginFormData.value.password = 'admin123'
      }
    }
    // 程序赋值不触发 el-form 的 blur 校验，若此前留有错误提示需手动清掉
    nextTick(() => loginFormRef.value?.clearValidate())
  }, 500)
}

/** 获取并刷新验证码图片 */
const refreshCaptchaImage = async (updateTenantId = false) => {
  const [err, data] = await imgCode()

  if (err) {
    console.error('获取验证码失败:', err)
    return
  }

  /*
    这里是白名单式拷贝，不是整包赋值 —— 新增接口字段必须在这里补一行，
    否则后端返回了前端也读不到。smsEnabled/emailEnabled 不给默认值：
    保持 undefined 才能让 loginTabs 里的 ?? 回落到 SystemConfig 的本地开关。
  */
  captcha.value = {
    captchaEnabled: data.captchaEnabled ?? true,
    tenantEnabled: data.tenantEnabled ?? true,
    tenantId: data.tenantId || '',
    registerEnabled: data.registerEnabled ?? true,
    tenantTitle: data.tenantTitle || '',
    uuid: data.uuid,
    img: data.img,
    socialTypes: data.socialTypes,
    smsEnabled: data.smsEnabled,
    emailEnabled: data.emailEnabled
  }

  // 更新可用的社交登录列表
  if (data.socialTypes) {
    availableSocialLogins.value = getSocialConfigs(data.socialTypes)
  } else {
    availableSocialLogins.value = []
  }

  // 更新表单中的验证码UUID，并清空验证码输入框
  if (captcha.value.captchaEnabled) {
    loginFormData.value.uuid = captcha.value.uuid
    loginFormData.value.code = ''
  }

  // 根据参数决定是否更新租户ID
  if (updateTenantId && captcha.value.tenantId) {
    updateTenantInfo(captcha.value.tenantId)
  }
}

/** 更新租户信息（表单、缓存、URL） */
const updateTenantInfo = (tenantId: string) => {
  // 更新表单
  loginFormData.value.tenantId = tenantId

  // 更新缓存
  localCache.set('tenantId', tenantId)

  // 更新URL参数
  const url = new URL(window.location.href)
  url.searchParams.set('tenantId', tenantId)
  window.history.replaceState(window.history.state, '', url.toString())
}

/** 从本地缓存恢复登录数据（密码解密读取） */
const restoreLoginDataFromCache = () => {
  try {
    const cachedLoginData = localCache.getJSON<PasswordLoginBody>('loginData')

    if (cachedLoginData && cachedLoginData.rememberMe) {
      loginFormData.value.userName = cachedLoginData.userName || ''
      loginFormData.value.password = decryptLocal(cachedLoginData.password || '') || cachedLoginData.password || ''
      loginFormData.value.rememberMe = true
      // 同 initializeFormData：程序赋值需手动清掉可能残留的校验提示
      nextTick(() => loginFormRef.value?.clearValidate())
    }
  } catch (error) {
    console.error('恢复登录数据失败:', error)
  }
}

// ==================== 缓存管理方法 ====================

/** 保存登录数据到本地缓存（密码加密存储） */
const saveLoginDataToCache = () => {
  try {
    if (loginFormData.value.rememberMe) {
      const loginDataToCache: PasswordLoginBody = {
        authType: 'password',
        userName: loginFormData.value.userName,
        password: encryptLocal(loginFormData.value.password),
        rememberMe: true
      }
      localCache.setJSON('loginData', loginDataToCache)
    } else {
      clearLoginDataFromCache()
    }
  } catch (error) {
    console.error('保存登录数据失败:', error)
  }
}

/** 清除本地缓存的登录数据 */
const clearLoginDataFromCache = () => {
  try {
    localCache.remove('loginData')
  } catch (error) {
    console.error('清除登录数据失败:', error)
  }
}

// ==================== 业务处理方法 ====================

/** 切换登录方式：清空校验状态，避免上一种方式的错误提示残留 */
const switchTab = (key: LoginTab) => {
  if (activeTab.value === key) return
  activeTab.value = key
  nextTick(() => loginFormRef.value?.clearValidate())
}

/** 组装提交数据：不同登录方式的字段差异集中在这里 */
const buildSubmitData = (): LoginRequest => {
  if (activeTab.value === 'sms') {
    return {
      authType: 'sms',
      phone: loginFormData.value.phone,
      smsCode: loginFormData.value.smsCode
    } as SmsLoginBody
  }
  if (activeTab.value === 'email') {
    return {
      authType: 'email',
      email: loginFormData.value.email,
      emailCode: loginFormData.value.emailCode
    } as EmailLoginBody
  }
  return {
    authType: 'password',
    userName: loginFormData.value.userName,
    password: loginFormData.value.password,
    code: loginFormData.value.code,
    uuid: loginFormData.value.uuid
  } as PasswordLoginBody
}

/** 处理用户登录提交 */
const handleLoginSubmit = () => {
  loginFormRef.value?.validate(async (isValid: boolean) => {
    if (!isValid) return

    isSubmitting.value = true
    // 处理记住密码功能（仅账号密码方式）
    if (activeTab.value === 'password') {
      saveLoginDataToCache()
    }

    // 执行登录
    const [error] = await userStore.loginUser(buildSubmitData())
    if (!error) {
      // 登录成功，跳转到目标页面
      await router.push(redirectUrl.value || '/')
    } else if (captcha.value.captchaEnabled && activeTab.value === 'password') {
      // 登录失败，刷新验证码（不更新租户ID）
      await refreshCaptchaImage(false)
    }
    isSubmitting.value = false
  })
}

/** 启动发码倒计时（与后端 60 秒限流保持一致） */
const startCountdown = () => {
  countdown.value = 60
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0 && countdownTimer) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
  }, 1000)
}

/** 发送短信/邮箱验证码 */
const handleSendCode = async () => {
  const isSms = activeTab.value === 'sms'
  const field = isSms ? 'phone' : 'email'
  const target = isSms ? loginFormData.value.phone : loginFormData.value.email

  // 只校验目标字段，避免整表校验把验证码也一起标红
  const [validErr] = await to(loginFormRef.value!.validateField(field))
  if (validErr) return
  if (!target) return

  /*
    发码前先自查图形验证码非空，省掉一次必然失败的往返。
    这里手动判而不是走 validateField：短信/邮箱态的 code 没有进表单规则（原因见 loginFormRules），
    而 validateField 对没有规则的字段一律放行，拦不住空值。
  */
  if (captcha.value.captchaEnabled && !loginFormData.value.code) {
    showMsgError(t('login.rule.code.required'))
    return
  }

  const captchaCode = loginFormData.value.code
  const captchaUuid = loginFormData.value.uuid
  const [err] = isSms ? await smsCode(target, captchaCode, captchaUuid) : await emailCode(target, captchaCode, captchaUuid)

  /*
    图形验证码是一次性的：后端无论校验成败都已把它从 Redis 删掉，所以发过码就得立刻换一张。
    成功时同样要换 —— 否则倒计时结束后用户重发，带的还是那个已失效的 uuid，那次必然失败。
  */
  if (captcha.value.captchaEnabled) {
    await refreshCaptchaImage(false)
  }

  if (!err) {
    showMsgSuccess(t('login.codeSent'))
    startCountdown()
  }
}

/**
 * 处理第三方社交登录
 * @param socialType 社交登录类型 (wechat_open, maxkey, topiam, gitee, github)
 */
const handleSocialLogin = async (socialType: string) => {
  const [err, data] = await socialBindUrl(socialType)

  if (err) {
    showMsgError(t('login.thirdPartyConfigError'))
  } else {
    // 跳转到第三方授权页面
    window.location.href = data
  }
}

/** 租户id失去焦点 - 简化逻辑，避免循环调用 */
const handleTenantIdBlur = async () => {
  // 更新租户信息
  updateTenantInfo(loginFormData.value.tenantId)

  // 刷新验证码（不更新租户ID，避免循环）
  await refreshCaptchaImage(false)
}

// ==================== 生命周期钩子 ====================
/** 组件挂载时初始化数据 */
onMounted(async () => {
  // 先等待路由完全加载
  await nextTick()

  // 初始化表单数据（从缓存获取租户ID）
  initializeFormData()

  // 首次刷新验证码，如果没有缓存租户ID则使用接口返回的
  const hasCachedTenantId = !!localCache.get('tenantId')
  await refreshCaptchaImage(!hasCachedTenantId)

  // 恢复记住的登录数据
  restoreLoginDataFromCache()
})

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as *;

// 标题区
.auth-head {
  margin-bottom: 26px;

  .title {
    font-size: 24px;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--app-text);
  }

  .sub {
    margin-top: 8px;
    font-size: 13.5px;
    color: var(--el-text-color-secondary);
  }
}

// 登录方式页签：胶囊分段
.auth-tabs {
  display: flex;
  gap: 3px;
  padding: 4px;
  margin-bottom: 24px;
  background: var(--el-fill-color-light);
  border-radius: var(--custom-radius);

  .auth-tab {
    flex: 1;
    height: 34px;
    font-size: 13px;
    color: var(--el-text-color-regular);
    cursor: pointer;
    background: none;
    border: none;
    border-radius: var(--radius-md);
    transition: all 0.22s ease;

    &:hover {
      color: var(--app-text);
    }

    &.on {
      font-weight: 700;
      color: var(--el-color-primary);
      background: var(--el-bg-color);
      box-shadow: 0 1px 3px rgb(0 0 0 / 7%);
    }
  }
}

/**
 * 字段区高度由 fieldsStyle 动态计算并内联注入（见 script）。
 * 🔴 不要在这里写死 min-height —— 「未启用图形验证码」时会凭空撑出一块空白。
 */

/**
 * 字段间距 22px 而非默认 18px：
 * Element Plus 的错误提示是绝对定位浮层(不占布局流，报错时页面零位移)，
 * 但需要给它留出约 18px 的显示空间，否则会盖住下一个字段的标签。
 */
:deep(.el-form-item) {
  margin-bottom: 22px;
}

.input-icon {
  font-size: 15px;
  color: var(--el-text-color-placeholder);
}

// 验证码 / 发码按钮与输入框同行
.code-row {
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;

  .el-input {
    flex: 1;
    min-width: 0;
  }

  .captcha-image {
    flex-shrink: 0;
    width: 108px;
    height: 40px;
    cursor: pointer;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: var(--radius-md);
  }

  .send-code {
    flex-shrink: 0;
    min-width: 108px;
  }
}

// 记住我 / 忘记密码：与输入框左边缘对齐（让开标签列）
.form-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 4px 0 18px;
  padding-left: 86px;
  font-size: 13px;
}

.link {
  font-weight: 600;
  color: var(--el-color-primary);
  text-decoration: none;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.75;
  }
}

.submit-btn {
  width: 100%;
  height: 46px;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.06em;
  border-radius: var(--radius-md);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
}

.register-row {
  margin-top: 16px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
  text-align: center;

  .link {
    margin-left: 4px;
  }
}

// 手机：标签移到输入框上方，避免水平布局把输入框挤窄
@media (max-width: $device-phone) {
  /*
    标签与输入框保持同一行（不再把标签折到上方），这样表单更矮、不会顶到页脚。
    代价是验证码那行要在一行内塞下「标签 86 + 输入框 + 验证码图」，
    375 宽的机型只剩 99px 给输入框，故把验证码图收窄一档。
  */
  .code-row .captcha-image {
    width: 92px;
  }

  .fields {
    min-height: 0;
  }

  .form-meta {
    padding-left: 0;
  }
}
</style>
