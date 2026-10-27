<template>
  <view class="min-h-[100vh] bg-#FFFCF5">
    <wd-navbar :title="t('app.settings.title')" show-back />

    <!-- 个人信息 -->
    <wd-cell-group custom-class="mt-2 mx-3" :title="t('app.settings.personalInfo')">
      <wd-cell :title="t('app.settings.phone')" is-link>
        <template #default>
          <view class="relative">
            <wd-text :text="userStore.userInfo?.phone || t('app.settings.notBound')" />
            <wd-button
              invisible
              open-type="getPhoneNumber"
              @click="handlePhoneNumber"
              @getphonenumber="getPhoneNumber"
            />
          </view>
        </template>
      </wd-cell>
      <wd-cell
        :title="t('app.settings.email')"
        :value="userStore.userInfo?.email || t('app.settings.notBound')"
        is-link
        @click="handleEmailBinding"
      />
    </wd-cell-group>

    <!-- 语言设置 -->
    <wd-cell-group custom-class="mt-2 mx-3" :title="t('app.settings.language')">
      <wd-cell
        :title="t('app.settings.currentLanguage')"
        :value="currentLanguageName"
        is-link
        @click="showLanguageSelector"
      />
    </wd-cell-group>

    <!-- 语言选择组件 -->
    <wd-language-selector v-model="languageSelectorVisible" @change="handleLanguageChange" />
  </view>
</template>

<script lang="ts" setup>
import { useI18n } from '@/composables/useI18n'
import type { LanguageCode } from '@/systemConfig'
import { useMessage, useToast } from '@/wd'
import PLATFORM from '@/utils/platform'
import { bindPhone } from '@/api/app/phone/phoneApi'
import { updateUserProfile } from '@/api/system/core/user/userApi'
import { isEmail } from '@/utils/validators'
import type { SysUserBo } from '@/api/system/core/user/userTypes'
// 使用业务层的国际化
const { t, currentLanguageName } = useI18n()
const toast = useToast()
const message = useMessage()

// 用户信息 store
const userStore = useUserStore()

// 语言选择器显示状态
const languageSelectorVisible = ref(false)

// 显示语言选择器
const showLanguageSelector = () => {
  languageSelectorVisible.value = true
}

// 处理语言切换
const handleLanguageChange = (lang: LanguageCode) => {
  console.log('语言已切换为:', lang)
  // 这里可以添加额外的处理逻辑，比如保存用户偏好设置等
}

// 处理手机号绑定
const handlePhoneNumber = () => {
  if (!PLATFORM.isMpWeixin) {
    toast.info('手机绑定待实现')
  }
}

// 绑定手机号
const getPhoneNumber = async (detail) => {
  console.log(detail)
  if (!detail.errMsg) {
    const [err, data] = await bindPhone({ code: detail.code })
    if (!err) {
      console.log('获取手机成功', data)
      toast.success(t('app.settings.bindSuccess'))
    }
  }
}

// 处理邮箱绑定
const handleEmailBinding = async () => {
  const { action, value } = await message.prompt({
    title: t('app.settings.emailBinding'),
    inputValue: userStore.userInfo?.email || '',
    inputPlaceholder: t('app.settings.email'),
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel'),
    inputError: t('app.settings.emailFormatError'),
    inputValidate: (inputValue: string) => {
      return isEmail(inputValue)
    },
  })
  if (action === 'confirm' && value) {
    // 提交邮箱绑定请求
    const [err] = await updateUserProfile({ email: value } as SysUserBo)
    if (!err) {
      toast.success(t('message.bindSuccess'))
    } else {
      toast.error(t('message.bindError'))
    }
  }
}

onMounted(async () => {
  // 确保用户信息已加载
  if (!userStore.userInfo) {
    await userStore.fetchUserInfo()
  }
})
</script>
