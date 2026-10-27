<!-- 在线考试我的 -->
<template>
  <view class="bg-#f5f7fa min-h-full">
    <!-- 渐变头部 -->
    <view class="relative overflow-hidden" style="background: linear-gradient(135deg, #3B82F6, #1D4ED8); padding: 40rpx 32rpx 64rpx">
      <!-- 装饰圆 -->
      <view class="absolute w-200rpx h-200rpx rounded-full bg-white/10 -top-40rpx -right-40rpx" />
      <view class="absolute w-120rpx h-120rpx rounded-full bg-white/10 bottom-20rpx -left-30rpx" />
      <view class="absolute w-160rpx h-160rpx rounded-full bg-white/10 top-60rpx right-100rpx" />
      <view class="flex items-center gap-24rpx relative z-1">
        <!-- emoji 头像 -->
        <view class="w-112rpx h-112rpx bg-white/20 rounded-full flex items-center justify-center text-48rpx">👨‍🎓</view>
        <view class="flex-1">
          <view class="flex items-center gap-16rpx">
            <text class="text-white font-bold text-32rpx">张三</text>
            <wd-tag size="small" round custom-style="background: #facc15; color: #713f12; border: none; font-weight: 500">学霸</wd-tag>
          </view>
          <text class="text-blue-200 text-24rpx mt-8rpx block">ID: 2024001 · 计算机科学与技术</text>
        </view>
        <view class="w-64rpx h-64rpx bg-white/20 rounded-full flex items-center justify-center">
          <wd-icon name="setting" size="32rpx" color="#fff" />
        </view>
      </view>
    </view>

    <!-- 数据卡片 -->
    <view class="px-32rpx -mt-48rpx relative z-1">
      <view class="bg-white rounded-32rpx p-32rpx shadow-sm grid grid-cols-4 gap-16rpx">
        <view v-for="item in statsData" :key="item.label" class="text-center">
          <text class="text-36rpx font-bold block" :style="{ color: item.color }">{{ item.value }}</text>
          <text class="text-20rpx text-gray-400 mt-4rpx block">{{ item.label }}</text>
        </view>
      </view>
    </view>

    <!-- 功能宫格 -->
    <view class="px-32rpx mt-40rpx">
      <text class="text-28rpx font-bold text-gray-800 mb-24rpx block">功能入口</text>
      <view class="grid grid-cols-4 gap-24rpx">
        <view v-for="item in quickActions" :key="item.name" class="text-center">
          <view class="w-96rpx h-96rpx rounded-32rpx flex items-center justify-center mx-auto text-40rpx" :style="{ background: item.bgColor }">
            {{ item.icon }}
          </view>
          <text class="text-20rpx text-gray-600 mt-12rpx block">{{ item.name }}</text>
        </view>
      </view>
    </view>

    <!-- 更多功能 -->
    <view class="px-32rpx mt-40rpx pb-32rpx">
      <text class="text-28rpx font-bold text-gray-800 mb-24rpx block">更多功能</text>

      <view v-for="(item, index) in moreMenus" :key="index" class="bg-white rounded-32rpx shadow-sm" :class="index < moreMenus.length - 1 ? 'mb-16rpx' : ''">
        <view class="flex items-center gap-24rpx p-28rpx">
          <view class="w-64rpx h-64rpx rounded-16rpx flex items-center justify-center text-32rpx" :style="{ background: item.bgColor }">
            {{ item.icon }}
          </view>
          <text class="text-24rpx text-gray-700 flex-1">{{ item.name }}</text>
          <wd-icon name="arrow-right" size="32rpx" color="#d1d5db" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const statsData = [
  { value: '56', label: '考试次数', color: '#3B82F6' },
  { value: '87', label: '平均分', color: '#22c55e' },
  { value: 'Top5', label: '排名', color: '#f97316' },
  { value: '32', label: '连续天数', color: '#a855f7' },
]

const quickActions = [
  { icon: '🏆', name: '我的证书', bgColor: '#fefce8' },
  { icon: '📝', name: '错题本', bgColor: '#fef2f2' },
  { icon: '⭐', name: '收藏题目', bgColor: '#eff6ff' },
  { icon: '📋', name: '学习计划', bgColor: '#f0fdf4' },
]

const moreMenus = [
  { icon: '📊', name: '成绩分析', bgColor: '#dbeafe' },
  { icon: '🏅', name: '排行榜', bgColor: '#dcfce7' },
  { icon: '🕐', name: '考试历史', bgColor: '#ffedd5' },
  { icon: '📥', name: '离线题库', bgColor: '#e9d5ff' },
  { icon: '💬', name: '意见反馈', bgColor: '#cffafe' },
]
</script>

<style scoped lang="scss"></style>
