<!-- 社交博客 - 发布文章 -->
<template>
  <view class="min-h-100vh bg-white flex flex-col">
    <!-- 导航栏 -->
    <view class="flex items-center justify-between px-32rpx py-24rpx border-b border-gray-100">
      <wd-icon name="close" size="40rpx" color="#6b7280" @click="handleClose" />
      <text class="text-[30rpx] font-semibold text-gray-800">发布文章</text>
      <view class="w-40rpx" />
    </view>

    <scroll-view class="flex-1" scroll-y :show-scrollbar="false">
      <view class="px-32rpx pt-32rpx">
        <!-- 标题输入 -->
        <wd-input
          v-model="form.title"
          placeholder="请输入文章标题"
          no-border
          custom-style="font-size: 36rpx; font-weight: bold; padding: 0; margin-bottom: 16rpx;"
        />

        <view class="h-2rpx bg-gray-100 mb-32rpx" />

        <!-- 正文编辑 -->
        <wd-textarea
          v-model="form.content"
          placeholder="开始写作，分享你的想法..."
          :auto-height="true"
          :maxlength="-1"
          no-border
          custom-style="min-height: 320rpx; padding: 0; font-size: 28rpx; line-height: 44rpx;"
        />

        <view class="h-2rpx bg-gray-100 my-32rpx" />

        <!-- 添加图片 -->
        <view class="mb-32rpx">
          <text class="text-[26rpx] font-medium text-gray-700 mb-20rpx block">添加图片</text>
          <view class="flex gap-20rpx">
            <view
              v-for="(img, index) in imageList"
              :key="index"
              class="w-160rpx h-160rpx rounded-xl overflow-hidden relative"
            >
              <wd-img :src="img" width="160rpx" height="160rpx" mode="aspectFill" />
              <view
                class="absolute -right-0 -top-0 w-36rpx h-36rpx bg-black/50 rounded-full flex items-center justify-center"
                @click="handleRemoveImage(index)"
              >
                <wd-icon name="close" size="20rpx" color="#fff" />
              </view>
            </view>
            <view
              class="w-160rpx h-160rpx rounded-xl border-2rpx border-dashed border-gray-200 flex items-center justify-center bg-gray-50"
              @click="handleAddImage"
            >
              <wd-icon name="add" size="48rpx" color="#d1d5db" />
            </view>
          </view>
        </view>

        <view class="h-2rpx bg-gray-100 my-32rpx" />

        <!-- 选择标签 -->
        <view class="mb-32rpx">
          <text class="text-[26rpx] font-medium text-gray-700 mb-20rpx block">选择标签</text>
          <view class="flex flex-wrap gap-16rpx">
            <wd-tag
              v-for="tag in tagList"
              :key="tag.name"
              round
              :custom-style="tag.selected
                ? 'background: #8B5CF6; color: #fff; border: none;'
                : 'background: #f3f4f6; color: #6b7280; border: none;'"
              @click="handleToggleTag(tag)"
            >
              {{ tag.name }}
            </wd-tag>
          </view>
        </view>

        <!-- 工具栏 -->
        <view class="flex items-center gap-40rpx py-24rpx border-t border-gray-100">
          <wd-icon name="picture" size="40rpx" color="#9ca3af" @click="handleAddImage" />
          <wd-icon name="link" size="40rpx" color="#9ca3af" @click="handleAddLink" />
          <wd-icon name="chat" size="40rpx" color="#9ca3af" @click="handleMention" />
        </view>
      </view>
    </scroll-view>

    <!-- 底部发布按钮 -->
    <view class="px-32rpx py-24rpx border-t border-gray-100 pb-env-safe">
      <wd-button
        block
        round
        custom-style="background: linear-gradient(135deg, #8B5CF6, #a78bfa); border: none; height: 88rpx; font-size: 28rpx;"
        @click="handlePublish"
      >
        发布文章
      </wd-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useToast } from '@/wd'

const toast = useToast()

const form = ref({
  title: '',
  content: '',
})

const imageList = ref([
  'https://picsum.photos/200/200?random=10',
  'https://picsum.photos/200/200?random=11',
])

const tagList = ref([
  { name: 'Vue', selected: true },
  { name: '前端', selected: true },
  { name: 'React', selected: false },
  { name: 'TypeScript', selected: false },
  { name: '后端', selected: false },
  { name: '设计', selected: false },
  { name: 'AI', selected: false },
  { name: '运维', selected: false },
  { name: '产品', selected: false },
])

const handleClose = () => toast.info('关闭')
const handleAddImage = () => toast.info('添加图片')
const handleRemoveImage = (index: number) => {
  imageList.value.splice(index, 1)
}
const handleToggleTag = (tag: { name: string; selected: boolean }) => {
  tag.selected = !tag.selected
}
const handleAddLink = () => toast.info('添加链接')
const handleMention = () => toast.info('@提及')
const handlePublish = () => {
  const selectedTags = tagList.value.filter(t => t.selected).map(t => t.name)
  if (!form.value.title) {
    toast.error('请输入标题')
    return
  }
  toast.success(`发布成功 [${selectedTags.join(', ')}]`)
}
</script>

<style lang="scss" scoped>
/* 安全区域底部间距 */
.pb-env-safe {
  padding-bottom: calc(env(safe-area-inset-bottom) + 24rpx);
}
</style>
