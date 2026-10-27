<!-- 注册 -->
<template>
  <AuthLayout>
    <div class="register-wrap">
      <!-- 标题和副标题 -->
      <div class="auth-head">
        <h3 class="title">{{ t('register.title') }}</h3>
        <p class="sub">{{ captcha.tenantEnabled && captcha.tenantTitle ? captcha.tenantTitle : t('register.subtitle') }}</p>
      </div>

      <!-- 邀请信息显示 -->
      <div v-if="inviteInfo" class="invite-info">
        <el-alert
          :title="`${t('register.invitedRole')}: ${inviteInfo.roleName} | ${t('register.department')}: ${inviteInfo.deptName}`"
          type="success"
          :closable="false"
          show-icon
          class="invite-alert"
        >
          <template #default>
            <div class="invite-detail">
              <p>
                <strong>{{ t('register.inviteRole') }}:</strong> {{ inviteInfo.roleName }}
              </p>
              <p>
                <strong>{{ t('register.department') }}:</strong> {{ inviteInfo.deptName }}
              </p>
              <p v-if="inviteInfo.needApproval" class="approval-notice">
                <el-icon>
                  <InfoFilled />
                </el-icon>
                {{ t('register.approvalRequired') }}
              </p>
            </div>
          </template>
        </el-alert>
      </div>

      <!-- rules 改为 computed 后必须关掉规则变化自动校验，否则接口返回时会让空表单立刻标红（同 login.vue） -->
      <el-form
        ref="registerFormRef"
        :model="registerFormData"
        :rules="registerFormRules"
        :validate-on-rule-change="false"
        :label-width="labelWidth"
        @submit.prevent
      >
        <!-- 租户id输入区域 - 仅在没有邀请码时显示 -->
        <el-form-item v-if="!inviteInfo" prop="tenantId" :label="t('login.tenantId')">
          <el-input
            v-model="registerFormData.tenantId"
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

        <!-- 用户名输入区域 -->
        <el-form-item prop="userName" :label="t('register.userName')">
          <el-input v-model="registerFormData.userName" size="large" type="text" auto-complete="off" :placeholder="t('register.userName')">
            <template #prefix>
              <Icon code="user" class="input-icon" />
            </template>
          </el-input>
        </el-form-item>

        <!-- 密码输入区域 -->
        <el-form-item prop="password" :label="t('register.password')">
          <el-input
            v-model="registerFormData.password"
            size="large"
            type="password"
            auto-complete="off"
            show-password
            :placeholder="t('register.password')"
          >
            <template #prefix>
              <Icon code="password" class="input-icon" />
            </template>
          </el-input>
        </el-form-item>

        <!-- 确认密码输入区域 -->
        <el-form-item prop="confirmPassword" :label="t('register.confirmPassword')">
          <el-input
            v-model="registerFormData.confirmPassword"
            size="large"
            type="password"
            auto-complete="off"
            show-password
            :placeholder="t('register.confirmPassword')"
            @keyup.enter="handleRegisterSubmit"
          >
            <template #prefix>
              <Icon code="password" class="input-icon" />
            </template>
          </el-input>
        </el-form-item>

        <!-- 验证码输入区域 -->
        <el-form-item v-if="captcha.captchaEnabled" prop="code" :label="t('register.code')">
          <div class="code-row">
            <el-input
              v-model="registerFormData.code"
              size="large"
              auto-complete="off"
              :placeholder="t('register.code')"
              @keyup.enter="handleRegisterSubmit"
            >
              <template #prefix>
                <Icon code="security2" class="input-icon" />
              </template>
            </el-input>
            <el-image :src="captcha.img" class="captcha-image" @click="refreshCaptchaImage" />
          </div>
        </el-form-item>

        <!-- 注册按钮 -->
        <el-button class="submit-btn" :loading="isSubmitting" size="large" type="primary" @click.prevent="handleRegisterSubmit">
          {{ isSubmitting ? t('register.registering') : t('register.register') }}
        </el-button>

        <!-- 登录链接 -->
        <div class="register-row">
          <span>{{ t('register.hasAccount') }}</span>
          <router-link class="link" to="/login">{{ t('register.switchLoginPage') }}</router-link>
        </div>

        <!-- 第三方注册：布局随平台数量自适应，见 ASocialLogin -->
        <ASocialLogin v-if="socialAutoRegisterEnabled" :list="availableSocialLogins" mode="register" @select="handleSocialRegister" />
      </el-form>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { InfoFilled } from '@element-plus/icons-vue'
import AuthLayout from './components/AuthLayout.vue'
import ASocialLogin from './components/ASocialLogin.vue'
import { imgCode, userRegister, socialBindUrl } from '@/api/system/auth/authApi'
import { validateRoleInvite } from '@/api/system/core/role/roleApi'
import type { CaptchaVo, RegisterBody } from '@/api/system/auth/authTypes'
import type { RoleInviteVo } from '@/api/system/core/role/roleTypes'
import { showAlertSuccess, showMsgError, showMsgWarning } from '@/utils/modal'
import { localCache } from '@/utils/cache'
import { getSocialConfigs, type SocialConfig } from '@/api/system/auth/socialConfig'

// ==================== 系统配置与工具 ====================
const { t, isChinese } = useI18n()

/**
 * 标签列宽度：随语言自适应
 *
 * 标签容器实际占用 = 文字宽 + 12px(内边距) + 10px(必填星号)。
 * 中文标签统一压到 4 字以内，最宽「确认密码」56 + 22 = 78px；
 * 英文即使已缩短，UserName 仍要 63 + 22 = 85px，比中文宽一档。
 * 写死一个值必然是「中文太空 或 英文换行」，故按语言给两档。
 */
const labelWidth = computed(() => (isChinese.value ? '80px' : '88px'))
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// ==================== 响应式数据 ====================
// 表单引用
const registerFormRef = ref<ElFormInstance>()

// 表单数据
const registerFormData = ref<RegisterBody>({
  tenantId: '',
  authType: 'password',
  userType: 'pc_user',
  userName: '',
  password: '',
  confirmPassword: '',
  code: '',
  uuid: '',
  inviteCode: ''
})

// 验证码信息
// 初值 false = 「还没问到后端，先不渲染」，避免验证码框闪现后消失（同 login.vue）
const captcha = ref<CaptchaVo>({
  captchaEnabled: false,
  tenantEnabled: true,
  tenantId: '',
  registerEnabled: false,
  tenantTitle: '',
  uuid: '',
  img: ''
})

// 邀请信息
const inviteInfo = ref<RoleInviteVo | null>(null)

// 业务状态
const isSubmitting = ref(false) // 是否正在提交注册

// 可用的社交登录列表
const availableSocialLogins = ref<SocialConfig[]>([])

// 是否开启社交登录自动注册
const socialAutoRegisterEnabled = ref(false)

// ==================== 表单验证规则 ====================
/**
 * 验证确认密码是否与密码一致
 */
const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (registerFormData.value.password !== value) {
    callback(new Error(t('register.rule.confirmPassword.equalToPassword')))
  } else {
    callback()
  }
}

/**
 * 校验规则需跟随实际渲染的字段：
 *   · 租户字段在「有邀请码」时不渲染
 *   · 验证码字段在后端未启用时不渲染
 * 若规则仍保留必填，用户填完可见字段也提交不了 —— 校验卡在看不见的字段上。
 */
const registerFormRules = computed<ElFormRules>(() => {
  const rules: ElFormRules = {
    userName: [
      { required: true, trigger: 'blur', message: t('register.rule.userName.required') },
      { min: 2, max: 20, message: t('register.rule.userName.length', { min: 2, max: 20 }), trigger: 'blur' }
    ],
    password: [
      { required: true, trigger: 'blur', message: t('register.rule.password.required') },
      { min: 5, max: 20, message: t('register.rule.password.length', { min: 5, max: 20 }), trigger: 'blur' },
      {
        pattern: /^[^<>"'|\\]+$/,
        message: t('register.rule.password.pattern', { strings: '< > " \' \\ |' }),
        trigger: 'blur'
      }
    ],
    confirmPassword: [
      { required: true, trigger: 'blur', message: t('register.rule.confirmPassword.required') },
      { required: true, validator: validateConfirmPassword, trigger: 'blur' }
    ]
  }
  // 租户字段仅在「无邀请码」时渲染
  if (!inviteInfo.value) {
    rules.tenantId = [{ required: true, trigger: 'blur', message: t('register.rule.tenantId.required') }]
  }
  if (captcha.value.captchaEnabled) {
    rules.code = [{ required: true, trigger: 'change', message: t('register.rule.code.required') }]
  }
  return rules
})

// ==================== 数据初始化方法 ====================

/** 初始化表单默认值的方法 */
const initializeFormData = async () => {
  // 从URL参数获取邀请码
  const inviteCode = route.query.inviteCode as string
  if (inviteCode) {
    registerFormData.value.inviteCode = inviteCode
    if (userStore.token) {
      await userStore.logoutUser()
    }
    await validateInviteCode(inviteCode)
  }

  // 租户ID优先级设置：
  // 1. 邀请码存在时：优先使用inviteInfo中的租户ID（验证邀请码时会设置）
  // 2. 没有邀请码时：URL参数 > 缓存 > 等待验证码接口返回
  if (!inviteInfo.value) {
    const tenantId = (route.query.tenantId as string) || localCache.get('tenantId')
    if (tenantId) {
      registerFormData.value.tenantId = tenantId
    }
    // 如果都没有，等待 refreshCaptchaImage 从验证码接口获取
  }
}

/** 验证邀请码 */
const validateInviteCode = async (inviteCode: string) => {
  const [err, data] = await validateRoleInvite(inviteCode)
  if (!err && data) {
    inviteInfo.value = data
    // 邀请注册时，租户ID使用邀请信息中的租户ID（优先级最高）
    if (data.tenantId) {
      registerFormData.value.tenantId = data.tenantId
      updateTenantInfo(data.tenantId)
    }
    showMsgWarning(`${t('register.inviteCodeSuccess')}: ${data.roleName}`)
  } else {
    showMsgError(t('register.inviteCodeInvalid'))
    registerFormData.value.inviteCode = ''
    inviteInfo.value = null
  }
}

/** 获取并刷新验证码图片 */
const refreshCaptchaImage = async (updateTenantId = false) => {
  const [err, data] = await imgCode()

  if (err) {
    console.error('获取验证码失败:', err)
    return
  }

  // 更新验证码信息
  captcha.value = {
    captchaEnabled: data.captchaEnabled ?? true,
    tenantEnabled: data.tenantEnabled ?? true,
    tenantId: data.tenantId || '',
    registerEnabled: data.registerEnabled ?? true,
    tenantTitle: data.tenantTitle || '',
    uuid: data.uuid,
    img: data.img,
    socialTypes: data.socialTypes
  }

  // 更新可用的社交登录列表
  if (data.socialTypes) {
    availableSocialLogins.value = getSocialConfigs(data.socialTypes)
  } else {
    availableSocialLogins.value = []
  }

  // 更新社交登录自动注册开关
  socialAutoRegisterEnabled.value = data.socialAutoRegisterEnabled ?? false

  // 更新表单中的验证码UUID
  if (captcha.value.captchaEnabled) {
    registerFormData.value.uuid = captcha.value.uuid
  }

  // 租户ID更新逻辑：
  // 1. 有邀请码时：不更新租户ID（邀请码中的租户ID优先级最高）
  // 2. 无邀请码且允许更新时：使用验证码返回的租户ID
  if (updateTenantId && captcha.value.tenantId && !inviteInfo.value) {
    updateTenantInfo(captcha.value.tenantId)
  }
}

/** 更新租户信息（表单、缓存、URL） */
const updateTenantInfo = (tenantId: string) => {
  // 更新表单
  registerFormData.value.tenantId = tenantId

  // 更新缓存
  localCache.set('tenantId', tenantId)

  // 更新URL参数
  const url = new URL(window.location.href)
  url.searchParams.set('tenantId', tenantId)
  window.history.replaceState(window.history.state, '', url.toString())
}

// ==================== 业务处理方法 ====================

/**
 * 处理用户注册提交
 */
const handleRegisterSubmit = () => {
  registerFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      isSubmitting.value = true

      // 准备提交的注册数据（移除前端专用字段）
      const submitData: RegisterBody = {
        authType: registerFormData.value.authType,
        userType: registerFormData.value.userType,
        userName: registerFormData.value.userName,
        password: registerFormData.value.password,
        code: registerFormData.value.code,
        uuid: registerFormData.value.uuid
      }

      // 如果有邀请码，传递邀请码
      if (inviteInfo.value) {
        submitData.inviteCode = registerFormData.value.inviteCode
        submitData.tenantId = registerFormData.value.tenantId
      } else {
        // 普通注册需要租户ID
        submitData.tenantId = registerFormData.value.tenantId
      }

      const [error] = await userRegister(submitData)

      if (!error) {
        // 注册成功，显示成功消息并跳转到登录页
        const userName = registerFormData.value.userName
        let successMsg = ''

        if (inviteInfo.value) {
          if (inviteInfo.value.needApproval) {
            successMsg = `${t('register.congratsInvite')}<br/>${t('register.usernameLabel')}：<strong>${userName}</strong><br/>${t('register.roleLabel')}：<strong>${inviteInfo.value.roleName}</strong><br/><span style="color: #E6A23C;">${t('register.waitApproval')}</span>`
          } else {
            successMsg = `${t('register.congratsInvite')}<br/>${t('register.usernameLabel')}：<strong>${userName}</strong><br/>${t('register.roleLabel')}：<strong>${inviteInfo.value.roleName}</strong><br/><span style="color: #67C23A;">${t('register.loginImmediately')}</span>`
          }
        } else {
          successMsg = `${t('register.registrationSuccess')}<br/>${t('register.usernameLabel')}：<strong>${userName}</strong>`
        }

        await showAlertSuccess({
          message: successMsg,
          title: t('register.systemNotice'),
          dangerouslyUseHTMLString: true
        })

        // 跳转到登录页面
        await router.push(`/login?tenantId=${registerFormData.value.tenantId}`)
      } else {
        // 注册失败，刷新验证码（不更新租户ID）
        if (captcha.value.captchaEnabled) {
          await refreshCaptchaImage(false)
          registerFormData.value.code = ''
        }
      }
      isSubmitting.value = false
    }
  })
}

// 租户id失去焦点 - 简化逻辑，避免循环调用
const handleTenantIdBlur = async () => {
  if (!inviteInfo.value) {
    // 只有非邀请注册才处理租户ID变更
    updateTenantInfo(registerFormData.value.tenantId)

    // 刷新验证码（不更新租户ID，避免循环）
    await refreshCaptchaImage(false)

    // 清空验证码输入
    registerFormData.value.code = ''
  }
}

/**
 * 处理第三方社交注册
 * @param socialType 社交登录类型
 */
const handleSocialRegister = async (socialType: string) => {
  // 传递邀请码(如果有)
  const inviteCode = registerFormData.value.inviteCode || undefined
  const [err, data] = await socialBindUrl(socialType, inviteCode)

  if (err) {
    showMsgError(t('register.thirdPartyConfigError'))
  } else {
    // 跳转到第三方授权页面进行注册
    window.location.href = data
  }
}

// ==================== 生命周期钩子 ====================
/** 组件挂载时初始化数据 */
onMounted(async () => {
  // 先等待路由完全加载
  await nextTick()

  // 初始化表单数据（处理邀请码和租户ID优先级）
  await initializeFormData()

  // 请求验证码：
  // - 有邀请码时：不允许更新租户ID（inviteCode中的租户ID优先级最高）
  // - 无邀请码时：允许更新租户ID（使用验证码返回的租户ID）
  await refreshCaptchaImage(!inviteInfo.value)
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as *;

/**
 * 注册页只负责表单本身的样式。
 * 背景图 / 粒子 / 品牌区 / 工具栏 / 页脚 / 对齐与响应式全部由 AuthLayout 承担，
 * 三页共用同一套外壳，改一处即可全局生效。
 */

// 标题区
.auth-head {
  margin-bottom: 22px;

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

// 邀请信息
.invite-info {
  margin-bottom: 18px;

  :deep(.el-alert__content) {
    text-align: left;
  }

  :deep(.el-alert__title) {
    margin-bottom: 8px;
    font-size: 13px;
    line-height: 1.4;
  }

  .invite-detail p {
    margin: 4px 0;
    font-size: 12px;
    line-height: 1.4;
  }

  .approval-notice {
    display: flex;
    gap: 4px;
    align-items: center;
    margin-top: 8px;
    font-weight: 500;
    color: var(--el-color-warning);
  }
}

/**
 * 字段间距 22px 而非默认 18px：
 * Element Plus 的错误提示是绝对定位浮层(不占布局流，报错时页面零位移)，
 * 需要给它留出显示空间，否则会盖住下一个字段的标签。
 */
:deep(.el-form-item) {
  margin-bottom: 22px;
}

.input-icon {
  font-size: 15px;
  color: var(--el-text-color-placeholder);
}

// 验证码与输入框同行
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
}

.submit-btn {
  width: 100%;
  height: 46px;
  margin-top: 4px;
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
}

.link {
  margin-left: 4px;
  font-weight: 600;
  color: var(--el-color-primary);
  text-decoration: none;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.75;
  }
}

// 手机：标签移到输入框上方，避免水平布局把输入框挤窄
@media (max-width: $device-phone) {
  // 标签与输入框同行后，验证码那行空间吃紧，把验证码图收窄一档（同 login.vue）
  .code-row .captcha-image {
    width: 92px;
  }
}
</style>
