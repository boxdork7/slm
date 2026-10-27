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
        <wd-button type="success" @click="agree">立即授权</wd-button>
      </view>
    </view>
  </wd-popup>
</template>

<script setup lang="ts">
import type { UserProfileUpdateBo } from '@/api/system/auth/authTypes'
import { ref, watch } from 'vue'
import { updateUserProfile } from '@/api/system/auth/authApi'
import { useUpload, useToast } from '@/wd'

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
    userStore.authModalVisible = false
    toast.success('授权成功！')
  }
}
</script>

<style scoped lang="scss"></style>
