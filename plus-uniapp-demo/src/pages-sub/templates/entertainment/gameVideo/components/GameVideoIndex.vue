<!-- 短视频 - 首页 -->
<template>
  <view class="min-h-screen bg-black relative">
    <!-- 顶部 Tab：关注/推荐 -->
    <view class="absolute top-0 left-0 right-0 z-40 flex justify-center gap-48rpx pt-24rpx">
      <text
        class="text-28rpx font-500"
        :class="activeTab === 'follow' ? 'text-white font-700' : 'text-white/50'"
        @tap="activeTab = 'follow'"
      >
        关注
      </text>
      <view class="flex flex-col items-center">
        <text
          class="text-28rpx font-500"
          :class="activeTab === 'recommend' ? 'text-white font-700' : 'text-white/50'"
          @tap="activeTab = 'recommend'"
        >
          推荐
        </text>
        <view v-if="activeTab === 'recommend'" class="w-40rpx h-4rpx bg-white rounded-full mt-8rpx" />
      </view>
    </view>

    <!-- 模拟全屏视频背景 -->
    <view
      class="w-full min-h-screen flex items-center justify-center"
      style="background: linear-gradient(to bottom, #1a1a2e, #16213e, #0f0f0f)"
    >
      <view class="text-center">
        <view class="w-192rpx h-192rpx rounded-full bg-white/10 flex items-center justify-center mx-auto mb-32rpx">
          <text class="text-96rpx">▶</text>
        </view>
        <text class="text-white/40 text-28rpx">视频内容区域</text>
      </view>
    </view>

    <!-- 右侧互动栏 -->
    <view class="absolute right-24rpx bottom-256rpx z-40 flex flex-col items-center gap-40rpx">
      <!-- 头像 -->
      <view class="relative">
        <view class="w-96rpx h-96rpx rounded-full bg-#4b5563 flex items-center justify-center" style="border: 4rpx solid white">
          <text class="text-40rpx">😎</text>
        </view>
        <view class="absolute -bottom-12rpx left-1/2 -translate-x-1/2 w-40rpx h-40rpx rounded-full bg-#EF4444 flex items-center justify-center">
          <wd-icon name="add" color="white" size="24rpx" />
        </view>
      </view>
      <!-- 点赞 -->
      <view class="text-center">
        <view class="w-80rpx h-80rpx flex items-center justify-center">
          <wd-icon name="heart" color="white" size="56rpx" />
        </view>
        <text class="text-white text-20rpx">12.8k</text>
      </view>
      <!-- 评论 -->
      <view class="text-center">
        <view class="w-80rpx h-80rpx flex items-center justify-center">
          <wd-icon name="chat" color="white" size="56rpx" />
        </view>
        <text class="text-white text-20rpx">856</text>
      </view>
      <!-- 收藏 -->
      <view class="text-center">
        <view class="w-80rpx h-80rpx flex items-center justify-center">
          <wd-icon name="star" color="white" size="56rpx" />
        </view>
        <text class="text-white text-20rpx">2,360</text>
      </view>
      <!-- 分享 -->
      <view class="text-center">
        <view class="w-80rpx h-80rpx flex items-center justify-center">
          <wd-icon name="share" color="white" size="56rpx" />
        </view>
        <text class="text-white text-20rpx">分享</text>
      </view>
    </view>

    <!-- 底部视频信息 -->
    <view class="absolute left-32rpx right-128rpx bottom-160rpx z-40">
      <view class="flex items-center gap-16rpx mb-16rpx">
        <text class="text-white font-700 text-32rpx">@创意小达人</text>
        <wd-tag custom-style="background: #EF4444; color: white; border: none; font-size: 20rpx; padding: 2rpx 16rpx; border-radius: 9999rpx;">关注</wd-tag>
      </view>
      <text class="text-white text-28rpx leading-relaxed block">今天教大家做一个超好看的手工折纸 🎨✨ #手工 #折纸 #创意 #治愈</text>
      <view class="flex items-center gap-12rpx mt-16rpx">
        <text class="text-white/60 text-24rpx">🎵</text>
        <text class="text-white/60 text-24rpx">原创音乐 - 轻松午后</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'follow' | 'recommend'>('recommend')
</script>

<style scoped lang="scss"></style>
