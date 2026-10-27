<!-- 登录弹窗 -->
<template>
  <wd-popup
    v-model="userStore.authModalVisible"
    custom-class="rounded-t-4"
    position="bottom"
    closable
  >
    <view class="p-4">
      <!--   标题   -->
      <wd-text text="授权" size="38" color="#751937" />

      <!-- 表单区域 -->
      <wd-form ref="formRef" :model="form">
        <!-- 头像选择 -->
        <view class="mt-8">
          <wd-cell title="头像" custom-title-class="text-#751937 text-4">
            <wd-button
              custom-class="w-15! h-15! bg-#f9f9f9! -mt-5"
              type="icon"
              :icon="avatarPreviewUrl || 'camera'"
              :icon-size="avatarPreviewUrl ? 120 : 40"
              icon-color="#999999"
              open-type="chooseAvatar"
              @chooseavatar="chooseavatar"
              @click="manualChooseAvatar"
            />
          </wd-cell>
          <!-- 昵称输入 -->
          <wd-input
            v-model="form.nickName"
            label="昵称"
            custom-label-class="text-#751937 text-4!"
            input-align="right"
            align-right
            type="nickname"
          />
        </view>
      </wd-form>

      <!-- 操作按钮 -->
      <view class="mt-8 flex items-center justify-center gap-8 px-4 pb-8">
        <wd-button
          custom-class="bg-#f9f9f9! border-0! text-#888888!"
          type="info"
          plain
          @click="reject"
        >
          残忍拒绝
        </wd-button>
        <!-- 如果需要手机号绑定，使用隐形按钮进行手机号授权 -->
        <view class="relative">
          <wd-button type="success" @click="agree">立即授权</wd-button>
          <wd-button
            v-if="needPhoneAuth"
            invisible
            open-type="getPhoneNumber"
            @getphonenumber="handlePhoneAuth"
          />
        </view>
      </view>
    </view>
  </wd-popup>
</template>

<script setup lang="ts" name="AuthModal">
import type { UserProfileUpdateBo } from '@/api/system/auth/authTypes'
import { ref, watch } from 'vue'
import { updateUserProfile } from '@/api/system/auth/authApi'
import { bindPhone } from '@/api/app/phone/phoneApi'
import { useUpload, useToast } from '@/wd'
import PLATFORM from '@/utils/platform'

// 组合式API
const toast = useToast()
const userStore = useUserStore()
const upload = useUpload()

// 响应式数据
const formRef = ref<UserProfileUpdateBo>()
const form = ref({
  avatar: '', // 存储用的干净URL
  nickName: '',
})
// 预览用的URL（带签名，可直接访问私有桶）
const avatarPreviewUrl = ref('')

// 手机号授权开关
const needPhoneAuth = computed(() => {
  return (
    userStore.requirePhoneAuth &&
    PLATFORM.isMpWeixin &&
    !userStore.userInfo?.phone
  )
})

/** 选择头像 */
const chooseavatar = (detail) => {
  // #ifdef MP-WEIXIN
  toast.loading('正在上传头像...')
  upload.fastUpload(detail.avatarUrl, {
    onSuccess(res, file) {
      console.log('上传成功:', res, file)
      toast.close()
      // 预览用带签名的URL
      avatarPreviewUrl.value = res.url
      // 存储用干净的URL（useUpload已确保originalUrl有值）
      form.value.avatar = res.originalUrl!
    },
    onError(err, file) {
      toast.close()
      toast.error(`头像上传失败:${err.errMsg}，请重试`)
    },
  })
  // #endif
}

/** 手动选择头像 */
const manualChooseAvatar = async () => {
  // #ifndef MP-WEIXIN
  const res = await upload.chooseFile({ accept: 'image', maxCount: 1 })
  console.log('res', res)
  toast.loading('正在上传头像...')
  upload.fastUpload(res[0].path, {
    onSuccess(uploadRes, file) {
      console.log('上传成功:', uploadRes, file)
      toast.close()
      // 预览用带签名的URL
      avatarPreviewUrl.value = uploadRes.url
      // 存储用干净的URL（useUpload已确保originalUrl有值）
      form.value.avatar = uploadRes.originalUrl!
    },
    onError(err, file) {
      toast.close()
      toast.error(`头像上传失败:${err.errMsg}，请重试`)
    },
  })
  // #endif
}

/** 完成授权流程 */
const completeAuth = async () => {
  if (!form.value.avatar) {
    toast.warning('请选择头像')
    return
  }
  if (!form.value.nickName) {
    toast.warning('请设置昵称')
    return
  }

  try {
    const [err] = await updateUserProfile({
      avatar: form.value.avatar,
      nickName: form.value.nickName,
    })

    if (!err) {
      // 重新获取用户信息，确保头像URL带有正确的预签名
      await userStore.fetchUserInfo()
      userStore.authModalVisible = false
      toast.success('授权成功！')
    }
  } catch (error) {
    toast.error('授权失败，请重试')
    console.error('授权异常:', error)
  }
}

/** 处理手机号授权 */
const handlePhoneAuth = async (detail) => {
  console.log('手机号授权详情:', detail)

  if (!detail.code) {
    toast.error('获取手机号失败，请重试')
    return
  }

  if (PLATFORM.isMpWeixin) {
    try {
      toast.loading('正在绑定手机号...')
      const [err, data] = await bindPhone({ code: detail.code })
      toast.close()

      if (!err && data) {
        console.log('手机号绑定成功:', data)
        toast.success('手机号绑定成功')
        // 手机号绑定成功后，继续完成授权流程
        await completeAuth()
      } else {
        toast.error('手机号绑定失败，请重试')
      }
    } catch (error) {
      toast.close()
      toast.error('手机号绑定异常，请重试')
      console.error('手机号绑定异常:', error)
    }
  } else {
    toast.info('手机号绑定功能暂未在此平台实现')
    // 非微信小程序平台，直接完成授权
    await completeAuth()
  }
}

// 监听弹窗显示状态
watch(
  () => userStore.authModalVisible,
  (val) => {
    if (val) {
      // 初始化表单数据
      form.value.nickName = userStore.userInfo?.nickName
      form.value.avatar = userStore.userInfo?.avatar
      // 初始化预览URL（用户已有头像时，使用存储的URL作为预览）
      avatarPreviewUrl.value = userStore.userInfo?.avatar || ''
    }
  },
)

// 拒绝授权
const reject = () => {
  toast.warning('你拒绝了授权(>_<)')
  userStore.authModalVisible = false
}

// 同意授权
const agree = async () => {
  // 如果需要手机号授权且在微信小程序中，且用户未绑定手机号
  if (
    userStore.requirePhoneAuth &&
    PLATFORM.isMpWeixin &&
    !userStore.userInfo?.phone
  ) {
    toast.info('请先授权获取手机号')
    return
  }

  // 如果不需要手机号授权，或者已经绑定了手机号，或者已经完成手机号授权，直接完成授权流程
  await completeAuth()
}
</script>

<style scoped lang="scss"></style>
