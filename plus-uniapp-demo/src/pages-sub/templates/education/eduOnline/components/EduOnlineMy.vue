<!-- 在线学堂 - 我的 -->
<template>
  <view class="min-h-screen bg-#f5f5f5">
    <!-- 绿色渐变头部 -->
    <view
      class="relative overflow-hidden px-32rpx pt-40rpx pb-64rpx"
      style="background: linear-gradient(135deg, #10B981, #059669)"
    >
      <!-- 3个装饰圆 -->
      <view class="absolute w-200rpx h-200rpx rounded-full bg-white/10 -top-40rpx -right-40rpx" />
      <view class="absolute w-160rpx h-160rpx rounded-full bg-white/10 -bottom-60rpx right-60rpx" />
      <view class="absolute w-120rpx h-120rpx rounded-full bg-white/10 top-20rpx -left-40rpx" />

      <view class="flex justify-between items-start relative z-1">
        <view class="flex gap-24rpx items-center">
          <!-- emoji 头像 -->
          <view class="w-112rpx h-112rpx bg-white/20 rounded-full flex items-center justify-center" style="border: 4rpx solid rgba(255,255,255,0.4)">
            <text class="text-56rpx">🎓</text>
          </view>
          <view>
            <text class="text-36rpx font-700 text-white block">学习达人</text>
            <view class="flex gap-12rpx mt-8rpx">
              <wd-tag :custom-style="{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', fontSize: '20rpx' }">
                Lv.8
              </wd-tag>
              <wd-tag :custom-style="{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', fontSize: '20rpx' }">
                学习达人
              </wd-tag>
            </view>
          </view>
        </view>
        <view class="w-64rpx h-64rpx flex items-center justify-center">
          <wd-icon name="setting" color="rgba(255,255,255,0.8)" size="40rpx" />
        </view>
      </view>
    </view>

    <!-- 数据卡片 -->
    <view class="mx-32rpx -mt-48rpx bg-white rounded-28rpx p-32rpx shadow-sm relative z-2">
      <view class="grid grid-cols-4 gap-16rpx text-center">
        <view v-for="item in stats" :key="item.label">
          <text class="text-40rpx font-700 text-#1f2937 block">{{ item.value }}</text>
          <text class="text-20rpx text-#9ca3af block mt-4rpx">{{ item.label }}</text>
        </view>
      </view>
    </view>

    <!-- 功能宫格 -->
    <view class="mx-32rpx mt-32rpx bg-white rounded-28rpx p-32rpx shadow-sm">
      <view class="grid grid-cols-4 gap-24rpx text-center">
        <view v-for="item in gridItems" :key="item.name">
          <view
            class="w-88rpx h-88rpx rounded-24rpx flex items-center justify-center mx-auto mb-12rpx"
            :style="{ background: item.bg }"
          >
            <text class="text-40rpx">{{ item.icon }}</text>
          </view>
          <text class="text-22rpx text-#374151 block">{{ item.name }}</text>
        </view>
      </view>
    </view>

    <!-- 更多功能列表 -->
    <view class="mx-32rpx mt-32rpx mb-32rpx bg-white rounded-28rpx overflow-hidden shadow-sm">
      <view
        v-for="(item, index) in menuItems"
        :key="item.name"
        class="flex items-center px-32rpx py-28rpx"
        :style="index < menuItems.length - 1 ? 'border-bottom: 1px solid #f5f5f5' : ''"
      >
        <view
          class="w-68rpx h-68rpx rounded-16rpx flex items-center justify-center mr-24rpx"
          :style="{ background: item.bg }"
        >
          <text class="text-32rpx">{{ item.icon }}</text>
        </view>
        <text class="flex-1 text-28rpx text-#374151">{{ item.name }}</text>
        <text v-if="item.badge" class="text-22rpx text-#f43f5e mr-16rpx">{{ item.badge }}</text>
        <wd-icon name="arrow-right" color="#d1d5db" size="32rpx" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const stats = [
  { value: '12', label: '已学课程' },
  { value: '86h', label: '学习时长' },
  { value: '5', label: '证书' },
  { value: '2.8k', label: '积分' },
]

const gridItems = [
  { icon: '📚', name: '我的课程', bg: '#ecfdf5' },
  { icon: '📋', name: '学习计划', bg: '#eff6ff' },
  { icon: '🏆', name: '证书成就', bg: '#fef3c7' },
  { icon: '📝', name: '学习笔记', bg: '#fce7f3' },
]

const menuItems = [
  { icon: '❤️', name: '我的收藏', bg: '#ecfdf5', badge: '' },
  { icon: '🕐', name: '学习记录', bg: '#eff6ff', badge: '' },
  { icon: '💰', name: '订单管理', bg: '#fef3c7', badge: '' },
  { icon: '🎁', name: '优惠券', bg: '#fce7f3', badge: '3张可用' },
  { icon: '💬', name: '意见反馈', bg: '#f3e8ff', badge: '' },
]
</script>

<style scoped lang="scss"></style>
