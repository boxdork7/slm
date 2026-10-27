<!-- 预算管理 - 我的 -->
<template>
  <view class="min-h-screen bg-#f5f5f5">
    <!-- 金色渐变头部 -->
    <view
      class="relative overflow-hidden px-40rpx pt-40rpx pb-128rpx"
      style="background: linear-gradient(135deg, #F59E0B, #D97706)"
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
            <text class="text-60rpx">💰</text>
          </view>
          <view>
            <text class="text-36rpx font-700 text-white block">理财小能手</text>
            <view class="flex gap-16rpx mt-8rpx">
              <text class="bg-white/20 text-white text-20rpx px-20rpx py-4rpx rounded-full">记账128天</text>
              <text class="bg-white/20 text-white text-20rpx px-20rpx py-4rpx rounded-full">Lv.5</text>
            </view>
          </view>
        </view>
        <view class="w-72rpx h-72rpx flex items-center justify-center">
          <wd-icon name="setting" color="rgba(255,255,255,0.8)" size="40rpx" />
        </view>
      </view>
    </view>

    <!-- 资产统计卡片 -->
    <view class="mx-40rpx -mt-80rpx bg-white rounded-32rpx p-40rpx shadow-sm relative z-2">
      <view class="grid grid-cols-3 gap-32rpx text-center">
        <view>
          <text class="text-36rpx font-700 text-#1f2937 block">¥86.5k</text>
          <text class="text-22rpx text-#9ca3af block mt-8rpx">总资产</text>
        </view>
        <view>
          <text class="text-36rpx font-700 text-#22c55e block">¥12.0k</text>
          <text class="text-22rpx text-#9ca3af block mt-8rpx">本月收入</text>
        </view>
        <view>
          <text class="text-36rpx font-700 text-#ef4444 block">¥3.3k</text>
          <text class="text-22rpx text-#9ca3af block mt-8rpx">本月支出</text>
        </view>
      </view>
    </view>

    <!-- 功能宫格 -->
    <view class="mx-40rpx mt-40rpx bg-white rounded-32rpx p-40rpx shadow-sm">
      <view class="grid grid-cols-4 gap-y-40rpx text-center">
        <view
          v-for="item in funcGrid"
          :key="item.name"
          class="flex flex-col items-center gap-12rpx"
        >
          <view
            class="w-88rpx h-88rpx rounded-32rpx flex items-center justify-center"
            :class="item.bgClass"
          >
            <text class="text-40rpx">{{ item.icon }}</text>
          </view>
          <text class="text-22rpx text-#4b5563">{{ item.name }}</text>
        </view>
      </view>
    </view>

    <!-- 记账成就 -->
    <view class="mx-40rpx mt-40rpx bg-white rounded-32rpx p-40rpx shadow-sm">
      <view class="flex justify-between items-center mb-32rpx">
        <text class="text-28rpx font-600 text-#1f2937">记账成就</text>
        <text class="text-24rpx text-#F59E0B">查看全部 ›</text>
      </view>
      <view class="grid grid-cols-3 gap-24rpx">
        <view
          v-for="item in achievements"
          :key="item.title"
          class="text-center rounded-32rpx py-32rpx px-16rpx"
          :style="{ background: item.gradient }"
        >
          <text class="text-60rpx block mb-8rpx">{{ item.icon }}</text>
          <text class="text-22rpx font-600 block" :class="item.titleColor">{{ item.title }}</text>
          <text class="text-20rpx block mt-4rpx" :class="item.subColor">{{ item.desc }}</text>
        </view>
      </view>
    </view>

    <!-- 更多功能列表 -->
    <view class="mx-40rpx mt-40rpx mb-32rpx bg-white rounded-32rpx overflow-hidden shadow-sm">
      <view
        v-for="(item, index) in menuList"
        :key="item.name"
        class="flex items-center px-40rpx py-28rpx"
        :style="index < menuList.length - 1 ? 'border-bottom: 1px solid #f9fafb' : ''"
      >
        <view
          class="w-72rpx h-72rpx rounded-20rpx flex items-center justify-center mr-24rpx"
          :class="item.bgClass"
        >
          <text class="text-36rpx">{{ item.icon }}</text>
        </view>
        <text class="flex-1 text-28rpx text-#374151">{{ item.name }}</text>
        <text v-if="item.badge" class="text-22rpx text-#22c55e mr-16rpx">{{ item.badge }}</text>
        <wd-icon name="arrow-right" color="#d1d5db" size="32rpx" />
      </view>
    </view>

    <!-- 底部留空 -->
    <view class="h-32rpx" />
  </view>
</template>

<script setup lang="ts">
const funcGrid = [
  { icon: '📋', name: '预算设置', bgClass: 'bg-#fffbeb' },
  { icon: '🏦', name: '账户管理', bgClass: 'bg-#eff6ff' },
  { icon: '🔄', name: '定期账单', bgClass: 'bg-#f0fdf4' },
  { icon: '🏷️', name: '标签管理', bgClass: 'bg-#faf5ff' },
]

const achievements = [
  {
    icon: '🏅',
    title: '连续记账',
    desc: '30天达成',
    gradient: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
    titleColor: 'text-#92400e',
    subColor: 'text-#b45309',
  },
  {
    icon: '💎',
    title: '预算达人',
    desc: '连续3月',
    gradient: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)',
    titleColor: 'text-#166534',
    subColor: 'text-#15803d',
  },
  {
    icon: '📊',
    title: '分析专家',
    desc: '查看50次',
    gradient: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
    titleColor: 'text-#1e40af',
    subColor: 'text-#1d4ed8',
  },
]

const menuList = [
  { icon: '📤', name: '数据导出', bgClass: 'bg-#fffbeb', badge: '' },
  { icon: '☁️', name: '云端备份', bgClass: 'bg-#eff6ff', badge: '已同步' },
  { icon: '🔔', name: '提醒设置', bgClass: 'bg-#fef2f2', badge: '' },
  { icon: '🎨', name: '主题设置', bgClass: 'bg-#faf5ff', badge: '' },
  { icon: '💬', name: '意见反馈', bgClass: 'bg-#f9fafb', badge: '' },
]
</script>

<style scoped lang="scss"></style>
