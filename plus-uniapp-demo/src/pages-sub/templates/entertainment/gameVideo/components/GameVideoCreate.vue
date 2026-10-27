<!-- 短视频 - 创作 -->
<template>
  <view class="min-h-screen bg-#f5f5f5">
    <!-- 头部 -->
    <view class="bg-white px-40rpx pt-24rpx pb-32rpx">
      <text class="text-48rpx font-700 text-#1f2937 block mb-8rpx">创作中心</text>
      <text class="text-24rpx text-#9ca3af block">记录美好生活，分享精彩瞬间</text>
    </view>

    <!-- 创作方式 -->
    <view class="mx-40rpx mt-32rpx grid grid-cols-2 gap-24rpx">
      <view
        v-for="item in createMethods"
        :key="item.name"
        class="bg-white rounded-32rpx p-40rpx shadow-sm text-center"
      >
        <view
          class="w-128rpx h-128rpx rounded-32rpx flex items-center justify-center mx-auto mb-24rpx"
          :style="{ background: item.bg }"
        >
          <text class="text-56rpx">{{ item.emoji }}</text>
        </view>
        <text class="text-28rpx font-700 text-#1f2937 block">{{ item.name }}</text>
        <text class="text-20rpx text-#9ca3af block mt-8rpx">{{ item.desc }}</text>
      </view>
    </view>

    <!-- 创作数据 -->
    <view class="mx-40rpx mt-40rpx bg-white rounded-32rpx p-40rpx shadow-sm">
      <view class="flex justify-between items-center mb-32rpx">
        <text class="text-28rpx font-700 text-#1f2937">我的创作数据</text>
        <text class="text-24rpx text-#EF4444">详细 ›</text>
      </view>
      <view class="grid grid-cols-4 gap-24rpx text-center">
        <view v-for="stat in creatorStats" :key="stat.label">
          <text class="text-40rpx font-700 block" :class="stat.color">{{ stat.value }}</text>
          <text class="text-20rpx text-#9ca3af block mt-4rpx">{{ stat.label }}</text>
        </view>
      </view>
    </view>

    <!-- 热门模板 -->
    <view class="mx-40rpx mt-40rpx mb-32rpx">
      <view class="flex justify-between items-center mb-24rpx">
        <text class="text-32rpx font-700 text-#1f2937">热门模板</text>
        <text class="text-24rpx text-#9ca3af">更多 ›</text>
      </view>
      <scroll-view scroll-x class="whitespace-nowrap">
        <view class="flex gap-24rpx">
          <view
            v-for="tpl in hotTemplates"
            :key="tpl.name"
            class="w-224rpx shrink-0 rounded-32rpx overflow-hidden bg-white shadow-sm"
          >
            <view
              class="h-288rpx flex items-center justify-center"
              :style="{ background: tpl.bg }"
            >
              <text class="text-80rpx">{{ tpl.emoji }}</text>
            </view>
            <view class="p-16rpx">
              <text class="text-22rpx font-500 text-#1f2937 block">{{ tpl.name }}</text>
              <text class="text-20rpx text-#9ca3af block">{{ tpl.users }} 人使用</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 底部留空 -->
    <view class="h-32rpx" />
  </view>
</template>

<script setup lang="ts">
const createMethods = [
  { emoji: '📹', name: '拍摄视频', desc: '即刻拍摄精彩瞬间', bg: 'linear-gradient(135deg, #EF4444, #F87171)' },
  { emoji: '📁', name: '上传视频', desc: '从相册选择视频', bg: 'linear-gradient(135deg, #3B82F6, #60A5FA)' },
  { emoji: '📷', name: '拍照发布', desc: '用图片记录生活', bg: 'linear-gradient(135deg, #10B981, #34D399)' },
  { emoji: '🎬', name: '模板创作', desc: '一键套用热门模板', bg: 'linear-gradient(135deg, #F59E0B, #FBBF24)' },
]

const creatorStats = [
  { value: '26', label: '作品', color: 'text-#1f2937' },
  { value: '58.6k', label: '播放量', color: 'text-#EF4444' },
  { value: '3,280', label: '点赞', color: 'text-#1f2937' },
  { value: '856', label: '粉丝', color: 'text-#1f2937' },
]

const hotTemplates = [
  { emoji: '✨', name: '闪光特效', users: '2.8k', bg: 'linear-gradient(135deg, #EC4899, #F472B6)' },
  { emoji: '🎭', name: '变装秀', users: '5.2k', bg: 'linear-gradient(135deg, #6366F1, #818CF8)' },
  { emoji: '🎵', name: '卡点节拍', users: '8.6k', bg: 'linear-gradient(135deg, #14B8A6, #2DD4BF)' },
]
</script>

<style scoped lang="scss"></style>
