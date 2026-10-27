<!-- 修改密码 -->
<template>
  <!-- 等保二级 8.1.4.1 a：强制改密 / 到期提醒横幅 -->
  <el-alert
    v-if="userStore.mustChangePwd"
    :title="userStore.passwordStatus?.pwdExpired ? t('Password expired', '密码已过期') : t('Change initial password', '请修改初始密码')"
    :description="
      userStore.passwordStatus?.pwdExpired
        ? t('Password expired desc', '按照安全策略，密码已超过有效期，请立即修改后再使用其他功能。')
        : t('Change initial password desc', '这是您首次登录（或管理员刚重置过密码），请先设置新密码后再使用其他功能。')
    "
    type="warning"
    :closable="false"
    show-icon
    class="pwd-tip"
  />
  <el-alert
    v-else-if="userStore.pwdExpireInDays !== null"
    :title="t('Password expiring soon', '密码即将到期')"
    :description="`${t('Password will expire in', '您的密码将在')} ${userStore.pwdExpireInDays} ${t('days, please change', '天后到期，建议尽快修改。')}`"
    type="info"
    :closable="false"
    show-icon
    class="pwd-tip"
  />

  <el-form ref="pwdFormRef" :model="form" :rules="rules" :label-width="isChinese ? '80px' : '120px'">
    <el-row>
      <AFormInput
        type="password"
        show-password
        :label="t('Old Password', '旧密码')"
        v-model="form.oldPassword"
        prop="oldPassword"
        :placeholder="t('Enter old password', '请输入旧密码')"
        :span="24"
      ></AFormInput>
    </el-row>
    <el-row>
      <AFormInput
        type="password"
        show-password
        :label="t('New Password', '新密码')"
        v-model="form.newPassword"
        prop="newPassword"
        :placeholder="t('Enter new password', '请输入新密码')"
        :span="24"
      ></AFormInput>
    </el-row>
    <el-row>
      <AFormInput
        type="password"
        show-password
        :label="t('Confirm Password', '确认密码')"
        v-model="form.confirmPassword"
        prop="confirmPassword"
        :placeholder="t('Confirm new password', '请确认新密码')"
        :span="24"
      ></AFormInput>
    </el-row>
    <el-form-item>
      <el-button :loading="buttonLoading" type="primary" @click="submitForm">{{ t('button.save') }}</el-button>
      <el-button @click="handleClose">{{ t('button.close') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts" name="ResetPwd">
import { updateUserPwd } from '@/api/system/core/user/userApi'
import type { SysUserPasswordBo } from '@/api/system/core/user/userTypes'
import { closePage } from '@/utils/tab'
import { toValidate } from '@/utils/to'
import { showMsgSuccess, showConfirm } from '@/utils/modal'
const { t, isChinese } = useI18n()

/**用户 Store —— 读取密码状态用于横幅展示，改密成功后清除强制改密标记*/
const userStore = useUserStore()

// =========== 表单相关 ===========
/**表单引用*/
const pwdFormRef = ref<ElFormInstance>()
/**表单提交按钮加载状态*/
const buttonLoading = ref(false)

/**初始表单数据*/
const initFormData: SysUserPasswordBo = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
}

/**表单数据对象*/
const form = ref<SysUserPasswordBo>({ ...initFormData })

/**密码确认验证器*/
const equalToPassword = (rule: any, value: string, callback: any) => {
  if (form.value.newPassword !== value) {
    callback(new Error(t('Password mismatch', '两次输入的密码不一致')))
  } else {
    callback()
  }
}

/**表单校验规则*/
const rules = computed<ElFormRules>(() => ({
  oldPassword: [{ required: true, message: t('Old password required', '旧密码不能为空'), trigger: 'blur' }],
  newPassword: [
    { required: true, message: t('New password required', '新密码不能为空'), trigger: 'blur' },
    // 等保二级 8.1.4.1 a：与后端 system.password.min-length 默认值(8)保持一致。
    // 这里只做「快速反馈」，真正的策略判定在后端 —— 阈值可能被管理员在参数设置里调整，
    // 前端拿不到实时值，所以后端返回的错误提示才是最终依据。
    { min: 8, max: 20, message: t('Password length 8-20', '长度在 8 到 20 个字符'), trigger: 'blur' },
    { pattern: /^[^<>"'|\\]+$/, message: t('Invalid characters', '不能包含非法字符：< > " \' \\ |'), trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: t('Confirm password required', '确认密码不能为空'), trigger: 'blur' },
    { required: true, validator: equalToPassword, trigger: 'blur' }
  ]
}))

// =========== 表单操作 ===========
/**表单重置*/
const reset = () => {
  form.value = { ...initFormData }
  pwdFormRef.value?.resetFields()
}

/**提交表单*/
const submitForm = async () => {
  const [validateErr] = await toValidate(pwdFormRef)
  if (validateErr) return

  buttonLoading.value = true
  const [err] = await updateUserPwd(form.value)
  if (!err) {
    showMsgSuccess(t('message.updateSuccess'))
    reset()
    // 等保二级 8.1.4.1 a：改密成功后立即解除路由守卫的强制拦截，
    // 不必等下一次 fetchUserInfo，否则用户改完密码还会被挡在个人中心出不去
    userStore.clearMustChangePwd()
  }
  buttonLoading.value = false
}

/**关闭页面*/
const handleClose = () => {
  closePage()
}
</script>

<style lang="scss" scoped>
/* 提示条：el-alert 默认内边距偏厚、字号偏大，且与下方表单贴得太近。
   这里收紧上下留白并留出与表单的呼吸空间。 */
.pwd-tip {
  padding: 8px 12px;
  margin-bottom: 16px;

  :deep(.el-alert__title) {
    font-size: 13px;
    line-height: 20px;
  }

  :deep(.el-alert__description) {
    margin: 2px 0 0;
    font-size: 12px;
    line-height: 18px;
  }

  :deep(.el-alert__icon) {
    width: 16px;
    font-size: 16px;
  }
}
</style>
