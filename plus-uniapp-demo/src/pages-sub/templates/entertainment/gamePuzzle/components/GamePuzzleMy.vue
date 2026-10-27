<!-- 益智游戏 - 我的 -->
<template>
  <view class="min-h-screen bg-#f5f5f5">
    <!-- 粉色渐变头部 -->
    <view
      class="relative overflow-hidden px-40rpx pt-40rpx pb-128rpx"
      style="background: linear-gradient(135deg, #EC4899, #DB2777)"
    >
      <!-- 装饰圆 -->
      <view class="absolute w-384rpx h-384rpx rounded-full bg-white/10 -top-80rpx -right-80rpx" />
      <view class="absolute w-320rpx h-320rpx rounded-full bg-white/10 -bottom-128rpx right-128rpx" />
      <view class="absolute w-256rpx h-256rpx rounded-full bg-white/10 top-40rpx -left-80rpx" />

      <view class="flex justify-between items-start relative z-1">
        <view class="flex gap-24rpx items-center">
          <view
            class="w-128rpx h-128rpx bg-white/20 rounded-full flex items-center justify-center"
            style="border: 6rpx solid rgba(255,255,255,0.4)"
          >
            <text class="text-56rpx">😊</text>
          </view>
          <view>
            <text class="text-36rpx font-700 text-white block">游戏玩家</text>
            <view class="flex gap-16rpx mt-8rpx">
              <wd-tag size="small" round custom-style="background: rgba(255,255,255,0.2); color: white; border: none;">Lv.12</wd-tag>
              <wd-tag size="small" round custom-style="background: rgba(255,255,255,0.2); color: white; border: none;">拼图达人</wd-tag>
            </view>
          </view>
        </view>
        <view class="w-72rpx h-72rpx flex items-center justify-center">
          <wd-icon name="setting" color="rgba(255,255,255,0.8)" size="40rpx" />
        </view>
      </view>
    </view>

    <!-- 游戏数据 -->
    <view class="mx-40rpx -mt-80rpx bg-white rounded-32rpx p-40rpx shadow-sm relative z-2">
      <view class="grid grid-cols-4 gap-24rpx text-center">
        <view>
          <text class="text-36rpx font-700 text-#1f2937 block">2,580</text>
          <text class="text-20rpx text-#9ca3af block mt-8rpx">总积分</text>
        </view>
        <view>
          <text class="text-36rpx font-700 text-#EC4899 block">128</text>
          <text class="text-20rpx text-#9ca3af block mt-8rpx">通关数</text>
        </view>
        <view>
          <text class="text-36rpx font-700 text-#f59e0b block">15</text>
          <text class="text-20rpx text-#9ca3af block mt-8rpx">成就</text>
        </view>
        <view>
          <text class="text-36rpx font-700 text-#1f2937 block">28</text>
          <text class="text-20rpx text-#9ca3af block mt-8rpx">排名</text>
        </view>
      </view>
    </view>

    <!-- 最近游戏 -->
    <view class="mx-40rpx mt-40rpx bg-white rounded-32rpx p-40rpx shadow-sm">
      <view class="flex justify-between items-center mb-32rpx">
        <text class="text-28rpx font-600 text-#1f2937">最近游戏</text>
        <text class="text-24rpx text-#EC4899">查看全部 ›</text>
      </view>
      <view class="flex flex-col gap-24rpx">
        <view
          v-for="item in recentGames"
          :key="item.name"
          class="flex items-center gap-24rpx"
        >
          <view
            class="w-88rpx h-88rpx rounded-24rpx flex items-center justify-center"
            :style="{ background: item.gradient }"
          >
            <text class="text-40rpx">{{ item.icon }}</text>
          </view>
          <view class="flex-1">
            <text class="text-28rpx font-500 text-#1f2937 block">{{ item.name }}</text>
            <text class="text-20rpx text-#9ca3af block">{{ item.detail }}</text>
          </view>
          <wd-tag
            size="small"
            round
            :custom-style="`background: ${item.scoreBg}; color: ${item.scoreColor}; border: none;`"
          >{{ item.score }}</wd-tag>
        </view>
      </view>
    </view>

    <!-- 成就徽章 -->
    <view class="mx-40rpx mt-40rpx bg-white rounded-32rpx p-40rpx shadow-sm">
      <view class="flex justify-between items-center mb-32rpx">
        <text class="text-28rpx font-600 text-#1f2937">成就徽章</text>
        <text class="text-24rpx text-#9ca3af">15/50</text>
      </view>
      <view class="grid grid-cols-4 gap-24rpx text-center">
        <view v-for="badge in badges" :key="badge.name">
          <view
            class="w-112rpx h-112rpx rounded-32rpx flex items-center justify-center mx-auto"
            :style="{ background: badge.gradient }"
            :class="badge.locked ? 'bg-#f3f4f6' : ''"
          >
            <text class="text-48rpx" :class="badge.locked ? 'opacity-30' : ''">{{ badge.icon }}</text>
          </view>
          <text
            class="text-20rpx block mt-8rpx"
            :class="badge.locked ? 'text-#9ca3af' : 'text-#4b5563'"
          >{{ badge.name }}</text>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="mx-40rpx mt-40rpx mb-32rpx bg-white rounded-32rpx overflow-hidden shadow-sm">
      <view
        v-for="(item, index) in menuItems"
        :key="item.name"
        class="flex items-center px-40rpx py-28rpx"
        :style="index < menuItems.length - 1 ? 'border-bottom: 1px solid #f9fafb' : ''"
      >
        <view
          class="w-72rpx h-72rpx rounded-24rpx flex items-center justify-center mr-24rpx"
          :class="item.bgClass"
        >
          <text class="text-36rpx">{{ item.icon }}</text>
        </view>
        <text class="flex-1 text-28rpx text-#374151">{{ item.name }}</text>
        <text v-if="item.extra" class="text-22rpx text-#EC4899 mr-16rpx">{{ item.extra }}</text>
        <wd-icon name="arrow-right" color="#d1d5db" size="32rpx" />
      </view>
    </view>

    <!-- 底部留空 -->
    <view class="h-32rpx" />
  </view>
</template>

<script setup lang="ts">
const recentGames = [
  { icon: '🧩', name: '经典拼图', detail: '4×4 · 用时 2:35 · 今天', score: '+120', scoreBg: '#fce7f3', scoreColor: '#EC4899', gradient: 'linear-gradient(135deg, #EC4899, #F472B6)' },
  { icon: '🔢', name: '数独大师', detail: '中等难度 · 用时 8:12 · 昨天', score: '+200', scoreBg: '#f3e8ff', scoreColor: '#8b5cf6', gradient: 'linear-gradient(135deg, #8B5CF6, #A78BFA)' },
  { icon: '🎯', name: '消消乐', detail: '第 86 关 · 3星通过 · 昨天', score: '+150', scoreBg: '#dbeafe', scoreColor: '#3b82f6', gradient: 'linear-gradient(135deg, #3B82F6, #60A5FA)' },
]

const badges = [
  { icon: '🏅', name: '初出茅庐', gradient: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', locked: false },
  { icon: '🧩', name: '拼图达人', gradient: 'linear-gradient(135deg, #FCE7F3, #FBCFE8)', locked: false },
  { icon: '⚡', name: '闪电手', gradient: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)', locked: false },
  { icon: '🔒', name: '未解锁', gradient: '', locked: true },
]

const menuItems = [
  { icon: '⭐', name: '积分商城', bgClass: 'bg-#fce7f3', extra: '2,580可用' },
  { icon: '👥', name: '邀请好友', bgClass: 'bg-#dbeafe', extra: '' },
  { icon: '📋', name: '游戏规则', bgClass: 'bg-#dcfce7', extra: '' },
  { icon: '💬', name: '意见反馈', bgClass: 'bg-#f3f4f6', extra: '' },
]
</script>

<style scoped lang="scss"></style>
