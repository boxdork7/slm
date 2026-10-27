<!-- 生鲜商城 - 我的 -->
<template>
  <view class="min-h-100vh bg-gray-50">
    <scroll-view class="h-full" scroll-y :show-scrollbar="false">
      <!-- 用户头部 -->
      <view class="bg-gradient-to-b from-green-500 to-green-50 px-32rpx pb-64rpx pt-32rpx">
        <view class="flex items-center justify-between mb-40rpx">
          <text class="text-white/80 text-sm">我的</text>
          <wd-icon name="setting" size="40rpx" color="rgba(255,255,255,0.8)" @click="handleSettings" />
        </view>
        <view class="flex items-center">
          <view class="w-112rpx h-112rpx rounded-full bg-white/20 border-4rpx border-white/50 flex items-center justify-center">
            <text class="text-[48rpx]">👩</text>
          </view>
          <view class="ml-24rpx flex-1">
            <text class="text-white font-bold text-base block">李小鲜</text>
            <text class="text-white/70 text-xs mt-4rpx block">188****6688</text>
          </view>
          <wd-tag size="small" round custom-style="background: #facc15; color: #713f12; border: none;">🌿 鲜享会员</wd-tag>
        </view>
      </view>

      <!-- 资产卡片 -->
      <view class="mx-32rpx -mt-32rpx bg-white rounded-2xl p-32rpx shadow-sm">
        <view class="grid grid-cols-3 divide-x divide-gray-100">
          <view class="flex flex-col items-center">
            <text class="text-lg font-bold text-gray-800">5</text>
            <text class="text-[22rpx] text-gray-500 mt-8rpx">优惠券</text>
          </view>
          <view class="flex flex-col items-center">
            <text class="text-lg font-bold text-gray-800">368</text>
            <text class="text-[22rpx] text-gray-500 mt-8rpx">鲜豆</text>
          </view>
          <view class="flex flex-col items-center">
            <text class="text-lg font-bold text-green-500">¥50</text>
            <text class="text-[22rpx] text-gray-500 mt-8rpx">余额</text>
          </view>
        </view>
      </view>

      <!-- 我的订单 -->
      <view class="mx-32rpx mt-24rpx bg-white rounded-2xl p-32rpx">
        <view class="flex items-center justify-between mb-32rpx">
          <text class="font-bold text-[30rpx]">我的订单</text>
          <view class="flex items-center text-gray-400">
            <text class="text-xs">全部订单</text>
            <wd-icon name="arrow-right" size="28rpx" color="#9ca3af" />
          </view>
        </view>
        <view class="grid grid-cols-5 gap-8rpx">
          <view
            v-for="item in orderStatusList"
            :key="item.label"
            class="flex flex-col items-center gap-12rpx"
            @click="handleOrderClick(item.label)"
          >
            <view class="relative">
              <wd-icon :name="item.icon" size="48rpx" :color="item.color" />
              <view
                v-if="item.badge > 0"
                class="absolute -top-12rpx -right-16rpx h-32rpx min-w-32rpx flex items-center justify-center rounded-full bg-red-500 px-8rpx"
              >
                <text class="text-white text-[20rpx]">{{ item.badge }}</text>
              </view>
            </view>
            <text class="text-[22rpx] text-gray-600">{{ item.label }}</text>
          </view>
        </view>
      </view>

      <!-- 常用功能 -->
      <view class="mx-32rpx mt-24rpx bg-white rounded-2xl overflow-hidden">
        <view class="px-32rpx pt-32rpx pb-16rpx">
          <text class="font-bold text-[30rpx]">常用功能</text>
        </view>
        <view class="grid grid-cols-4 gap-8rpx px-16rpx py-24rpx">
          <view
            v-for="item in serviceList"
            :key="item.title"
            class="flex flex-col items-center gap-12rpx py-16rpx"
            @click="handleServiceClick(item.title)"
          >
            <view class="w-80rpx h-80rpx rounded-xl flex items-center justify-center text-[36rpx]" :style="{ background: item.bgColor }">
              {{ item.emoji }}
            </view>
            <text class="text-[22rpx] text-gray-600">{{ item.title }}</text>
          </view>
        </view>
      </view>

      <!-- 更多功能 -->
      <view class="mx-32rpx mt-24rpx mb-32rpx bg-white rounded-2xl overflow-hidden">
        <wd-cell-group>
          <wd-cell title="客服中心" icon="service" is-link @click="handleFeature('客服中心')" />
          <wd-cell title="意见反馈" icon="edit" is-link @click="handleFeature('意见反馈')" />
          <wd-cell title="关于我们" icon="info" is-link @click="handleFeature('关于我们')" />
        </wd-cell-group>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { useToast } from '@/wd'

const toast = useToast()

const orderStatusList = ref([
  { label: '待付款', icon: 'clock', color: '#ef4444', badge: 2 },
  { label: '待配送', icon: 'goods', color: '#f97316', badge: 0 },
  { label: '配送中', icon: 'cart', color: '#22c55e', badge: 1 },
  { label: '待评价', icon: 'edit', color: '#3b82f6', badge: 0 },
  { label: '售后', icon: 'service', color: '#6b7280', badge: 0 },
])

const serviceList = ref([
  { title: '收货地址', emoji: '📍', bgColor: '#f0fdf4' },
  { title: '优惠券', emoji: '🎫', bgColor: '#fff7ed' },
  { title: '我的收藏', emoji: '❤️', bgColor: '#fef2f2' },
  { title: '购买记录', emoji: '🕐', bgColor: '#eff6ff' },
])

const handleSettings = () => toast.info('设置')
const handleOrderClick = (label: string) => toast.info(label)
const handleServiceClick = (title: string) => toast.info(title)
const handleFeature = (title: string) => toast.info(title)
</script>

<style lang="scss" scoped></style>
