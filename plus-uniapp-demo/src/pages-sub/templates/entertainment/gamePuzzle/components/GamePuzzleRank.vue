<!-- 益智游戏 - 排行榜 -->
<template>
  <view class="min-h-screen bg-#f5f5f5">
    <!-- 标题区域 -->
    <view class="bg-white px-40rpx pt-24rpx pb-32rpx">
      <text class="text-48rpx font-700 text-#1f2937 block mb-24rpx">🏆 排行榜</text>
      <view class="flex gap-16rpx">
        <wd-tag
          v-for="tab in rankTabs"
          :key="tab"
          round
          size="large"
          :custom-style="activeTab === tab ? 'background: #EC4899; color: white; border: none;' : 'background: #f3f4f6; color: #4b5563; border: none;'"
          @click="activeTab = tab"
        >{{ tab }}</wd-tag>
      </view>
    </view>

    <!-- 前三名 -->
    <view
      class="mx-40rpx mt-32rpx rounded-32rpx p-40rpx relative overflow-hidden"
      style="background: linear-gradient(135deg, #EC4899, #DB2777)"
    >
      <view class="absolute w-320rpx h-320rpx bg-white/10 rounded-full -top-64rpx -right-64rpx" />
      <view class="absolute w-256rpx h-256rpx bg-white/10 rounded-full -bottom-96rpx right-96rpx" />
      <view class="flex items-end justify-center gap-32rpx relative z-1">
        <!-- 第2名 -->
        <view class="text-center">
          <view
            class="w-112rpx h-112rpx bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8rpx"
            style="border: 4rpx solid rgba(255,255,255,0.5)"
          >
            <text class="text-48rpx">👩</text>
          </view>
          <text class="text-24rpx text-white font-700 block">小美</text>
          <view class="bg-white/20 rounded-full px-16rpx py-4rpx mt-8rpx">
            <text class="text-20rpx text-white font-700">18,650</text>
          </view>
          <view
            class="w-112rpx h-128rpx rounded-t-24rpx mt-16rpx flex items-center justify-center"
            style="background: rgba(255,255,255,0.15)"
          >
            <text class="text-36rpx text-white font-700">2</text>
          </view>
        </view>
        <!-- 第1名 -->
        <view class="text-center -mt-32rpx">
          <text class="text-48rpx block mb-8rpx">👑</text>
          <view
            class="w-128rpx h-128rpx bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8rpx"
            style="border: 6rpx solid #FBBF24"
          >
            <text class="text-56rpx">🧑</text>
          </view>
          <text class="text-28rpx text-white font-700 block">大神</text>
          <view class="bg-yellow-400/30 rounded-full px-20rpx py-4rpx mt-8rpx">
            <text class="text-24rpx text-white font-700">25,800</text>
          </view>
          <view
            class="w-128rpx h-160rpx rounded-t-24rpx mt-16rpx flex items-center justify-center"
            style="background: rgba(255,255,255,0.2)"
          >
            <text class="text-40rpx text-white font-700">1</text>
          </view>
        </view>
        <!-- 第3名 -->
        <view class="text-center">
          <view
            class="w-112rpx h-112rpx bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8rpx"
            style="border: 4rpx solid rgba(255,255,255,0.5)"
          >
            <text class="text-48rpx">👦</text>
          </view>
          <text class="text-24rpx text-white font-700 block">阿杰</text>
          <view class="bg-white/20 rounded-full px-16rpx py-4rpx mt-8rpx">
            <text class="text-20rpx text-white font-700">15,320</text>
          </view>
          <view
            class="w-112rpx h-96rpx rounded-t-24rpx mt-16rpx flex items-center justify-center"
            style="background: rgba(255,255,255,0.15)"
          >
            <text class="text-36rpx text-white font-700">3</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 我的排名 -->
    <view class="mx-40rpx mt-32rpx bg-white rounded-32rpx p-32rpx shadow-sm border-4rpx border-#fbcfe8">
      <view class="flex items-center">
        <view class="w-64rpx h-64rpx rounded-full bg-#EC4899 flex items-center justify-center mr-24rpx">
          <text class="text-28rpx text-white font-700">28</text>
        </view>
        <view class="w-80rpx h-80rpx bg-#fce7f3 rounded-full flex items-center justify-center mr-24rpx">
          <text class="text-40rpx">😊</text>
        </view>
        <view class="flex-1">
          <text class="text-28rpx font-700 text-#1f2937 block">我</text>
          <text class="text-20rpx text-#9ca3af block">Lv.12 · 拼图达人</text>
        </view>
        <view class="text-right">
          <text class="text-32rpx font-700 text-#EC4899 block">2,580</text>
          <text class="text-20rpx text-#9ca3af block">积分</text>
        </view>
      </view>
    </view>

    <!-- 排行列表 -->
    <view class="mx-40rpx mt-32rpx mb-32rpx">
      <view class="bg-white rounded-32rpx overflow-hidden shadow-sm">
        <view
          v-for="(item, index) in rankList"
          :key="item.name"
          class="flex items-center px-32rpx py-28rpx"
          :style="index < rankList.length - 1 ? 'border-bottom: 1px solid #f9fafb' : ''"
        >
          <text class="w-48rpx text-center text-28rpx font-700 text-#9ca3af mr-24rpx">{{ item.rank }}</text>
          <view
            class="w-80rpx h-80rpx rounded-full flex items-center justify-center mr-24rpx"
            :class="item.bgClass"
          >
            <text class="text-40rpx">{{ item.avatar }}</text>
          </view>
          <view class="flex-1">
            <text class="text-28rpx font-500 text-#1f2937 block">{{ item.name }}</text>
            <text class="text-20rpx text-#9ca3af block">{{ item.level }}</text>
          </view>
          <text class="text-28rpx font-700 text-#4b5563">{{ item.score }}</text>
        </view>
      </view>
    </view>

    <!-- 底部留空 -->
    <view class="h-32rpx" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const rankTabs = ['总积分', '拼图', '数独', '消消乐']
const activeTab = ref('总积分')

const rankList = [
  { rank: 4, avatar: '👧', name: '小雨', level: 'Lv.18', score: '12,860', bgClass: 'bg-#dbeafe' },
  { rank: 5, avatar: '👨', name: '老王', level: 'Lv.16', score: '11,520', bgClass: 'bg-#dcfce7' },
  { rank: 6, avatar: '👩‍🦰', name: '小红', level: 'Lv.15', score: '10,350', bgClass: 'bg-#f3e8ff' },
  { rank: 7, avatar: '🧑‍💻', name: '程序员', level: 'Lv.14', score: '9,880', bgClass: 'bg-#fef3c7' },
  { rank: 8, avatar: '👴', name: '老李', level: 'Lv.13', score: '8,650', bgClass: 'bg-#fef2f2' },
]
</script>

<style scoped lang="scss"></style>
