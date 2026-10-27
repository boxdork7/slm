<!-- 授权页 -->
<template>
  <view class="h-100vh flex flex-col items-center from-#f9f9f9 to-#ffffff bg-gradient-to-b">
    <wd-navbar title="授权" show-back />

    <!--  顶部占位  -->
    <view class="min-h-20 w-100vw flex-[1]" />

    <!--   Logo  -->
    <wd-img custom-class="mb-12" width="150" height="150" src="/static/logo.png" />

    <wd-card title="请设置头像和昵称" custom-class="pb-4!">
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
    </wd-card>

    <!-- 填充空间 -->
    <view class="flex-[2]" />

    <!-- 底部按钮区域 -->
    <view class="w-full px-4 pb-10">
      <view class="flex items-center justify-center gap-8">
        <wd-button
          custom-class="bg-#f9f9f9! border-0! text-#888888!"
          type="info"
          plain
          @click="reject"
        >
          残忍拒绝
        </wd-button>
        <wd-button type="success" @click="agree">立即授权</wd-button>
      </view>

      <!-- 温馨提示 -->
      <view class="mt-4 text-center text-3 text-#999999">完成授权后，您将获得更好的个性化体验</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { UserProfileUpdateBo } from '@/api/system/auth/authTypes'
import { updateUserProfile } from '@/api/system/auth/authApi'
import { useUserStore } from '@/stores/modules/user'
import { useUpload } from '@/wd/components/composables/useUpload'
import { useToast } from '@/wd/components/wd-toast/useToast'

/**
 * 组件属性定义
 * @param redirect - 授权成功后的跳转地址（从路由参数传入）
 */
const props = defineProps<{
  redirect?: string
}>()

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

/**
 * 拒绝授权
 */
const reject = () => {
  toast.warning('你拒绝了授权(>_<)')
  uni.navigateBack()
}

/**
 * 同意授权
 */
const agree = async () => {
  if (!form.value.avatar) {
    toast.warning('请选择头像')
    return
  }
  if (!form.value.nickName) {
    toast.warning('请设置昵称')
    return
  }

  const [err] = await updateUserProfile({
    avatar: form.value.avatar,
    nickName: form.value.nickName,
  })

  if (!err) {
    // 重新获取用户信息，确保头像URL带有正确的预签名
    await userStore.fetchUserInfo()
    toast.success('授权成功！')

    // 授权成功后跳转到指定页面
    if (props.redirect) {
      uni.navigateTo({
        url: props.redirect,
      })
    } else {
      uni.navigateBack()
    }
  }
}

/**
 * 组件挂载后的初始化处理
 */
onMounted(() => {
  // 初始化表单数据
  form.value.nickName = userStore.userInfo?.nickName
  form.value.avatar = userStore.userInfo?.avatar
  // 初始化预览URL（用户已有头像时，使用存储的URL作为预览）
  avatarPreviewUrl.value = userStore.userInfo?.avatar || ''
})
</script>

<style lang="scss" scoped></style>
