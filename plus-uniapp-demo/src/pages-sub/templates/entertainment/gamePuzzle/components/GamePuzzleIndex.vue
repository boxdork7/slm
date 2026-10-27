<!-- 益智游戏 - 首页 -->
<template>
  <view class="min-h-screen bg-#f5f5f5">
    <!-- 粉色渐变头部 -->
    <view
      class="relative overflow-hidden px-40rpx pt-24rpx pb-96rpx"
      style="background: linear-gradient(135deg, #EC4899, #DB2777)"
    >
      <!-- 装饰圆 -->
      <view class="absolute w-384rpx h-384rpx rounded-full bg-white/10 -top-80rpx -right-80rpx" />
      <view class="absolute w-320rpx h-320rpx rounded-full bg-white/10 -bottom-128rpx right-128rpx" />
      <view class="absolute w-256rpx h-256rpx rounded-full bg-white/10 top-40rpx -left-80rpx" />

      <!-- 标题行 -->
      <view class="flex justify-between items-center mb-40rpx relative z-1">
        <view>
          <text class="text-24rpx text-white/80 block">欢迎回来</text>
          <text class="text-48rpx font-700 text-white block mt-8rpx">🎮 益智乐园</text>
        </view>
        <view class="flex items-center gap-24rpx">
          <view class="bg-white/20 rounded-full px-24rpx py-8rpx flex items-center gap-8rpx">
            <text class="text-28rpx text-yellow-300">⭐</text>
            <text class="text-24rpx text-white font-700">2,580</text>
          </view>
          <view class="w-80rpx h-80rpx bg-white/20 rounded-full flex items-center justify-center">
            <wd-icon name="notification" color="white" size="40rpx" />
          </view>
        </view>
      </view>

      <!-- 每日挑战卡片 -->
      <view class="bg-white/15 rounded-32rpx px-32rpx py-24rpx relative z-1">
        <view class="flex items-center justify-between">
          <view>
            <text class="text-32rpx font-700 text-white block">🔥 每日挑战</text>
            <text class="text-24rpx text-white/80 block mt-8rpx">完成3关赢取双倍积分</text>
            <text class="text-20rpx text-yellow-300 block mt-4rpx">进度 2/3 · 剩余 5:32:18</text>
          </view>
          <view class="bg-white rounded-full px-32rpx py-16rpx">
            <text class="text-24rpx font-700 text-#EC4899">继续</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 游戏分类 -->
    <view class="mx-40rpx -mt-40rpx bg-white rounded-32rpx p-32rpx shadow-sm relative z-2">
      <view class="grid grid-cols-4 gap-24rpx text-center">
        <view
          v-for="item in categories"
          :key="item.name"
          class="flex flex-col items-center gap-8rpx"
        >
          <view
            class="w-96rpx h-96rpx rounded-32rpx flex items-center justify-center"
            :class="item.bgClass"
          >
            <text class="text-48rpx">{{ item.icon }}</text>
          </view>
          <text class="text-20rpx text-#4b5563">{{ item.name }}</text>
        </view>
      </view>
    </view>

    <!-- 热门游戏 -->
    <view class="mx-40rpx mt-40rpx">
      <view class="flex justify-between items-center mb-24rpx">
        <text class="text-32rpx font-700 text-#1f2937">热门游戏</text>
        <text class="text-24rpx text-#EC4899">全部 ›</text>
      </view>

      <view class="grid grid-cols-2 gap-24rpx">
        <view
          v-for="item in hotGames"
          :key="item.name"
          class="bg-white rounded-32rpx overflow-hidden shadow-sm"
        >
          <view
            class="h-224rpx flex items-center justify-center relative"
            :style="{ background: item.gradient }"
          >
            <view class="absolute w-160rpx h-160rpx bg-white/10 rounded-full -top-32rpx -right-32rpx" />
            <text class="text-96rpx relative z-1">{{ item.icon }}</text>
          </view>
          <view class="p-24rpx">
            <text class="text-28rpx font-700 text-#1f2937 block">{{ item.name }}</text>
            <text class="text-20rpx text-#9ca3af block mt-4rpx">{{ item.desc }}</text>
            <view class="flex items-center justify-between mt-16rpx">
              <view class="flex items-center gap-4rpx">
                <text class="text-20rpx text-#facc15">{{ item.stars }}</text>
                <text class="text-20rpx text-#9ca3af">{{ item.rating }}</text>
              </view>
              <text class="text-20rpx text-#9ca3af">{{ item.players }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部留空 -->
    <view class="h-32rpx" />
  </view>
</template>

<script setup lang="ts">
const categories = [
  { icon: '🧩', name: '拼图', bgClass: 'bg-#fce7f3' },
  { icon: '🔢', name: '数独', bgClass: 'bg-#f3e8ff' },
  { icon: '🎯', name: '消消乐', bgClass: 'bg-#dbeafe' },
  { icon: '🧠', name: '记忆', bgClass: 'bg-#dcfce7' },
]

const hotGames = [
  { icon: '🧩', name: '经典拼图', desc: '3×3 至 6×6 难度', stars: '★★★★★', rating: '4.9', players: '12k人玩过', gradient: 'linear-gradient(135deg, #EC4899, #F472B6)' },
  { icon: '🔢', name: '数独大师', desc: '入门到地狱难度', stars: '★★★★★', rating: '4.8', players: '8.5k人玩过', gradient: 'linear-gradient(135deg, #8B5CF6, #A78BFA)' },
  { icon: '🎯', name: '消消乐', desc: '200+关卡挑战', stars: '★★★★☆', rating: '4.6', players: '15k人玩过', gradient: 'linear-gradient(135deg, #3B82F6, #60A5FA)' },
  { icon: '🧠', name: '记忆翻牌', desc: '锻炼超强记忆力', stars: '★★★★★', rating: '4.7', players: '6.2k人玩过', gradient: 'linear-gradient(135deg, #10B981, #34D399)' },
]
</script>

<style scoped lang="scss"></style>
