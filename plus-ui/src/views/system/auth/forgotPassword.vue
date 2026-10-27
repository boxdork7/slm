<!-- 忘记密码 -->
<template>
  <AuthLayout>
    <!-- 标题和副标题 -->
    <div class="auth-head">
      <h3 class="title">{{ t('forgotPassword.title') }}</h3>
      <p class="sub">{{ t('forgotPassword.subtitle') }}</p>
    </div>

    <!-- rules 为 computed（依赖 t()，切语言会重算），关掉规则变化自动校验，避免空表单立刻标红 -->
    <el-form
      ref="forgotPasswordFormRef"
      :model="forgotPasswordFormData"
      :rules="forgotPasswordFormRules"
      :validate-on-rule-change="false"
      :label-width="labelWidth"
      @submit.prevent
    >
      <!-- 邮箱输入区域 -->
      <el-form-item prop="email" :label="t('login.email')">
        <el-input
          v-model="forgotPasswordFormData.email"
          size="large"
          type="text"
          auto-complete="off"
          :placeholder="t('forgotPassword.emailPlaceholder')"
          @keyup.enter="handleForgotPasswordSubmit"
        >
          <template #prefix>
            <Icon code="email" class="input-icon" />
          </template>
        </el-input>
      </el-form-item>

      <!-- 验证码输入区域：后端未启用时整个字段不渲染，否则会留下一个空的验证码图占位 -->
      <el-form-item v-if="captcha.captchaEnabled" prop="code" :label="t('login.code')">
        <div class="code-row">
          <el-input
            v-model="forgotPasswordFormData.code"
            size="large"
            auto-complete="off"
            :placeholder="t('forgotPassword.codePlaceholder')"
            @keyup.enter="handleForgotPasswordSubmit"
          >
            <template #prefix>
              <Icon code="security2" class="input-icon" />
            </template>
          </el-input>
          <el-image :src="captcha.img" class="captcha-image" @click="refreshCaptchaImage" />
        </div>
      </el-form-item>

      <!-- 提交按钮 -->
      <el-button class="submit-btn" :loading="isSubmitting" size="large" type="primary" @click.prevent="handleForgotPasswordSubmit">
        {{ isSubmitting ? t('forgotPassword.submitting') : t('forgotPassword.submitBtn') }}
      </el-button>

      <!-- 返回登录链接 -->
      <div class="back-row">
        <router-link class="back-link" to="/login">
          <Icon code="left" size="14px" />
          <span>{{ t('forgotPassword.backToLogin') }}</span>
        </router-link>
      </div>
    </el-form>
  </AuthLayout>
</template>

<script setup lang="ts">
import AuthLayout from './components/AuthLayout.vue'
import { imgCode } from '@/api/system/auth/authApi'
import type { CaptchaVo } from '@/api/system/auth/authTypes'
import { showMsgSuccess, showMsgError } from '@/utils/modal'

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

// ==================== 响应式数据 ====================
// 表单引用
const forgotPasswordFormRef = ref<ElFormInstance>()

// 表单数据
const forgotPasswordFormData = ref({
  email: '',
  code: '',
  uuid: ''
})

// 验证码信息
// 初值 false = 「还没问到后端，先不渲染」，避免验证码框闪现后消失（同 login.vue）
const captcha = ref<CaptchaVo>({
  captchaEnabled: false,
  tenantEnabled: false,
  tenantId: '',
  registerEnabled: false,
  tenantTitle: '',
  uuid: '',
  img: ''
})

// 业务状态
const isSubmitting = ref(false) // 是否正在提交

// ==================== 表单验证规则 ====================
/**
 * 验证码规则必须跟着 captchaEnabled 走 —— 后端未启用时该字段根本不渲染，
 * 若仍保留必填规则，用户填好邮箱也提交不了（校验卡在一个看不见的字段上）。
 */
const forgotPasswordFormRules = computed<ElFormRules>(() => {
  const rules: ElFormRules = {
    email: [
      { required: true, trigger: 'blur', message: t('forgotPassword.rule.emailRequired') },
      { type: 'email', message: t('forgotPassword.rule.emailFormat'), trigger: 'blur' }
    ]
  }
  if (captcha.value.captchaEnabled) {
    rules.code = [{ required: true, trigger: 'change', message: t('forgotPassword.rule.codeRequired') }]
  }
  return rules
})

// ==================== 数据初始化方法 ====================

/** 获取并刷新验证码图片 */
const refreshCaptchaImage = async () => {
  const [err, data] = await imgCode()

  if (err) {
    console.error('获取验证码失败:', err)
    return
  }

  // 更新验证码信息
  captcha.value = {
    captchaEnabled: data.captchaEnabled ?? true,
    tenantEnabled: data.tenantEnabled ?? false,
    tenantId: data.tenantId || '',
    registerEnabled: data.registerEnabled ?? false,
    tenantTitle: data.tenantTitle || '',
    uuid: data.uuid,
    img: data.img
  }

  // 更新表单中的验证码UUID
  if (captcha.value.captchaEnabled) {
    forgotPasswordFormData.value.uuid = captcha.value.uuid
  }
}

// ==================== 业务处理方法 ====================
/** 处理重置密码提交 */
const handleForgotPasswordSubmit = () => {
  forgotPasswordFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      isSubmitting.value = true

      // TODO: 调用重置密码接口
      // 模拟异步请求
      setTimeout(async () => {
        // 假设成功
        await showMsgSuccess(t('forgotPassword.success'))

        // 跳转回登录页
        await router.push('/login')

        isSubmitting.value = false
      }, 1000)

      // 刷新验证码
      // await refreshCaptchaImage()
    }
  })
}

// ==================== 生命周期钩子 ====================
/** 组件挂载时初始化数据 */
onMounted(async () => {
  // 先等待路由完全加载
  await nextTick()

  // 刷新验证码
  await refreshCaptchaImage()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as *;

/**
 * 找回密码页只负责表单本身的样式。
 * 背景图 / 粒子 / 品牌区 / 工具栏 / 页脚 / 对齐与响应式全部由 AuthLayout 承担。
 */

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
    line-height: 1.6;
    color: var(--el-text-color-secondary);
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

// 手机：标签与输入框同行后验证码那行空间吃紧，把验证码图收窄一档（同 login.vue）
@media (max-width: $device-phone) {
  .code-row .captcha-image {
    width: 92px;
  }
}

// 返回登录
.back-row {
  margin-top: 18px;
  text-align: center;

  .back-link {
    display: inline-flex;
    gap: 4px;
    align-items: center;
    font-size: 13px;
    color: var(--el-text-color-secondary);
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: var(--el-color-primary);
    }
  }
}
</style>
