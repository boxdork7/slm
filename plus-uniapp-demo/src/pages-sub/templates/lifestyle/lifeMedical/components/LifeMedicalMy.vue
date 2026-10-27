<!-- 医疗健康 - 我的 -->
<template>
  <view class="min-h-100vh bg-gray-50">
    <scroll-view class="h-full" scroll-y :show-scrollbar="false">
      <!-- 用户头部 -->
      <view class="bg-gradient-to-b from-sky-500 to-sky-50 px-32rpx pb-64rpx pt-32rpx">
        <view class="flex items-center justify-between mb-40rpx">
          <text class="text-white/80 text-sm">我的</text>
          <wd-icon name="setting" size="40rpx" color="rgba(255,255,255,0.8)" @click="handleSettings" />
        </view>
        <view class="flex items-center">
          <view class="w-112rpx h-112rpx rounded-full bg-white/20 border-4rpx border-white/50 flex items-center justify-center">
            <text class="text-[48rpx]">🧑</text>
          </view>
          <view class="ml-24rpx flex-1">
            <text class="text-white font-bold text-base block">陈小健</text>
            <text class="text-white/70 text-xs mt-4rpx block">139****6688</text>
          </view>
          <wd-tag size="small" round custom-style="background: #facc15; color: #713f12; border: none;">💚 健康会员</wd-tag>
        </view>
      </view>

      <!-- 健康档案卡片 -->
      <view class="mx-32rpx -mt-32rpx bg-white rounded-2xl p-32rpx shadow-sm">
        <text class="text-sm font-bold text-gray-800 mb-16rpx block">健康档案</text>
        <view class="grid grid-cols-3 divide-x divide-gray-100">
          <view class="flex flex-col items-center">
            <text class="text-lg font-bold text-gray-800">175cm</text>
            <text class="text-[22rpx] text-gray-500 mt-4rpx">身高</text>
          </view>
          <view class="flex flex-col items-center">
            <text class="text-lg font-bold text-gray-800">68kg</text>
            <text class="text-[22rpx] text-gray-500 mt-4rpx">体重</text>
          </view>
          <view class="flex flex-col items-center">
            <text class="text-lg font-bold text-sky-500">A型</text>
            <text class="text-[22rpx] text-gray-500 mt-4rpx">血型</text>
          </view>
        </view>
      </view>

      <!-- 我的服务 -->
      <view class="mx-32rpx mt-24rpx bg-white rounded-2xl overflow-hidden">
        <view class="px-32rpx pt-32rpx pb-16rpx">
          <text class="font-bold text-[30rpx]">我的服务</text>
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
      <view class="mx-32rpx mt-24rpx bg-white rounded-2xl overflow-hidden">
        <view class="px-32rpx pt-32rpx pb-16rpx">
          <text class="font-bold text-[30rpx]">更多功能</text>
        </view>
        <view
          v-for="(item, index) in featureList"
          :key="item.title"
          class="flex items-center justify-between px-32rpx py-28rpx"
          :class="index < featureList.length - 1 ? 'border-b border-gray-50' : ''"
          @click="handleFeature(item.title)"
        >
          <view class="flex items-center">
            <view class="w-64rpx h-64rpx rounded-lg flex items-center justify-center" :style="{ background: item.bgColor }">
              <wd-icon :name="item.icon" size="32rpx" :color="item.iconColor" />
            </view>
            <text class="text-sm text-gray-700 ml-24rpx">{{ item.title }}</text>
          </view>
          <wd-icon name="arrow-right" size="32rpx" color="#d1d5db" />
        </view>
      </view>

      <!-- 退出登录 -->
      <view class="mx-32rpx mt-24rpx mb-32rpx">
        <wd-button type="error" block plain @click="handleLogout">退出登录</wd-button>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { useToast } from '@/wd'

const toast = useToast()

const serviceList = ref([
  { title: '就诊记录', emoji: '📝', bgColor: '#f0f9ff' },
  { title: '处方单', emoji: '💊', bgColor: '#fef2f2' },
  { title: '体检报告', emoji: '📊', bgColor: '#f0fdf4' },
  { title: '家庭成员', emoji: '👨‍👩‍👧‍👦', bgColor: '#fefce8' },
])

const featureList = ref([
  { title: '我的订单', icon: 'shop', iconColor: '#3b82f6', bgColor: '#eff6ff' },
  { title: '医保卡', icon: 'wallet', iconColor: '#22c55e', bgColor: '#f0fdf4' },
  { title: '收藏医生', icon: 'heart', iconColor: '#ef4444', bgColor: '#fef2f2' },
  { title: '用药提醒', icon: 'clock', iconColor: '#f59e0b', bgColor: '#fffbeb' },
  { title: '地址管理', icon: 'location', iconColor: '#06b6d4', bgColor: '#ecfeff' },
  { title: '意见反馈', icon: 'edit', iconColor: '#8b5cf6', bgColor: '#f5f3ff' },
  { title: '关于我们', icon: 'info', iconColor: '#6b7280', bgColor: '#f9fafb' },
])

const handleSettings = () => toast.info('设置')
const handleServiceClick = (title: string) => toast.info(title)
const handleFeature = (title: string) => toast.info(title)
const handleLogout = () => toast.info('退出登录')
</script>

<style lang="scss" scoped></style>
