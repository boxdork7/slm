<!-- 短视频 - 我的 -->
<template>
  <view class="min-h-screen bg-#f5f5f5">
    <!-- 个人信息区 -->
    <view class="bg-white px-40rpx pt-32rpx pb-40rpx">
      <view class="flex justify-between items-start mb-32rpx">
        <view class="flex gap-24rpx items-center">
          <view
            class="w-128rpx h-128rpx bg-#f3f4f6 rounded-full flex items-center justify-center"
            style="border: 6rpx solid #EF4444"
          >
            <text class="text-56rpx">😎</text>
          </view>
          <view>
            <text class="text-36rpx font-700 text-#1f2937 block">创意小达人</text>
            <text class="text-24rpx text-#9ca3af block mt-4rpx">抖音号：creative_2026</text>
          </view>
        </view>
        <view class="w-72rpx h-72rpx flex items-center justify-center">
          <wd-icon name="setting" color="#9ca3af" size="40rpx" />
        </view>
      </view>

      <text class="text-28rpx text-#4b5563 block mb-24rpx">分享创意生活 ✨ 用镜头记录美好瞬间 📹</text>

      <!-- 数据统计 -->
      <view class="flex gap-48rpx mb-32rpx">
        <view v-for="stat in userStats" :key="stat.label" class="text-center">
          <text class="text-36rpx font-700 text-#1f2937 block">{{ stat.value }}</text>
          <text class="text-20rpx text-#9ca3af block">{{ stat.label }}</text>
        </view>
      </view>

      <!-- 按钮 -->
      <view class="flex gap-24rpx">
        <view class="flex-1 bg-#EF4444 rounded-16rpx py-16rpx text-center">
          <text class="text-28rpx font-500 text-white">编辑资料</text>
        </view>
        <view class="flex-1 bg-#f3f4f6 rounded-16rpx py-16rpx text-center">
          <text class="text-28rpx font-500 text-#374151">分享主页</text>
        </view>
      </view>
    </view>

    <!-- 作品/收藏/喜欢 Tab -->
    <view class="bg-white mt-16rpx px-40rpx pt-24rpx">
      <view class="flex" style="border-bottom: 1rpx solid #e5e7eb">
        <view
          v-for="tab in contentTabs"
          :key="tab.label"
          class="flex-1 pb-20rpx text-center"
          @tap="activeContentTab = tab.key"
        >
          <text
            class="text-28rpx"
            :class="activeContentTab === tab.key ? 'font-700 text-#1f2937' : 'text-#9ca3af'"
          >
            {{ tab.label }} {{ tab.count }}
          </text>
          <view
            v-if="activeContentTab === tab.key"
            class="w-64rpx h-4rpx bg-#1f2937 rounded-full mx-auto mt-8rpx"
          />
        </view>
      </view>
    </view>

    <!-- 作品网格 -->
    <view class="grid grid-cols-3 gap-4rpx mt-4rpx">
      <view
        v-for="work in works"
        :key="work.emoji"
        class="relative"
        style="aspect-ratio: 3/4"
      >
        <view
          class="absolute inset-0 flex items-center justify-center"
          :style="{ background: work.bg }"
        >
          <text class="text-56rpx">{{ work.emoji }}</text>
        </view>
        <view class="absolute bottom-8rpx left-12rpx flex items-center gap-4rpx">
          <wd-icon name="play-fill" color="white" size="24rpx" />
          <text class="text-white text-20rpx">{{ work.plays }}</text>
        </view>
        <view v-if="work.pinned" class="absolute top-8rpx right-8rpx">
          <wd-tag custom-style="background: #EF4444; color: white; border: none; font-size: 16rpx; padding: 2rpx 12rpx;">置顶</wd-tag>
        </view>
      </view>
    </view>

    <!-- 底部留空 -->
    <view class="h-32rpx" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeContentTab = ref('works')

const userStats = [
  { value: '26', label: '作品' },
  { value: '856', label: '粉丝' },
  { value: '128', label: '关注' },
  { value: '3,280', label: '获赞' },
]

const contentTabs = [
  { key: 'works', label: '作品', count: 26 },
  { key: 'favorites', label: '收藏', count: 58 },
  { key: 'likes', label: '喜欢', count: 186 },
]

const works = [
  { emoji: '🎨', plays: '12.8k', bg: 'linear-gradient(135deg, #EF4444, #F87171)', pinned: false },
  { emoji: '🌅', plays: '8.6k', bg: 'linear-gradient(135deg, #3B82F6, #60A5FA)', pinned: true },
  { emoji: '🍜', plays: '5.2k', bg: 'linear-gradient(135deg, #10B981, #34D399)', pinned: false },
  { emoji: '🏖️', plays: '3.6k', bg: 'linear-gradient(135deg, #F59E0B, #FBBF24)', pinned: false },
  { emoji: '🎵', plays: '9.1k', bg: 'linear-gradient(135deg, #8B5CF6, #A78BFA)', pinned: false },
  { emoji: '💃', plays: '15.3k', bg: 'linear-gradient(135deg, #EC4899, #F472B6)', pinned: false },
]
</script>

<style scoped lang="scss"></style>
