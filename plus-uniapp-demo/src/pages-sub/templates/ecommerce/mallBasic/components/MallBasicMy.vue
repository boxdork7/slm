<!-- 基础商城 - 我的 -->
<template>
  <view class="min-h-100vh bg-gray-50">
    <scroll-view class="h-full" scroll-y :show-scrollbar="false">
      <!-- 用户信息头部 -->
      <view class="bg-gradient-to-b from-[#FF6B35] to-[#FFF3ED] px-32rpx pb-64rpx pt-32rpx">
        <view class="flex items-center justify-between mb-40rpx">
          <text class="text-white/80 text-sm">我的</text>
          <view class="flex items-center gap-32rpx">
            <wd-icon name="setting" size="40rpx" color="rgba(255,255,255,0.8)" @click="handleSettings" />
            <wd-icon name="notification" size="40rpx" color="rgba(255,255,255,0.8)" @click="handleNotification" />
          </view>
        </view>
        <view class="flex items-center">
          <view class="w-128rpx h-128rpx rounded-full border-4rpx border-white/50 overflow-hidden flex-shrink-0">
            <wd-img src="https://picsum.photos/128/128?random=99" width="128rpx" height="128rpx" mode="aspectFill" round />
          </view>
          <view class="ml-32rpx flex-1">
            <view class="flex items-center gap-16rpx">
              <text class="text-white font-bold text-lg">张三</text>
              <view class="bg-yellow-400 px-16rpx py-4rpx rounded-full">
                <text class="text-yellow-900 text-[20rpx] font-bold">VIP 3</text>
              </view>
            </view>
            <text class="text-white/70 text-sm mt-8rpx block">138****8000</text>
          </view>
          <wd-icon name="arrow-right" size="40rpx" color="rgba(255,255,255,0.5)" />
        </view>
      </view>

      <!-- 资产卡片 -->
      <view class="mx-32rpx -mt-32rpx bg-white rounded-2xl p-32rpx shadow-sm">
        <view class="grid grid-cols-3 divide-x divide-gray-100">
          <view class="flex flex-col items-center">
            <text class="text-lg font-bold text-gray-800">3</text>
            <text class="text-[22rpx] text-gray-500 mt-8rpx">优惠券</text>
          </view>
          <view class="flex flex-col items-center">
            <text class="text-lg font-bold text-gray-800">2,580</text>
            <text class="text-[22rpx] text-gray-500 mt-8rpx">积分</text>
          </view>
          <view class="flex flex-col items-center">
            <text class="text-lg font-bold text-[#FF6B35]">¥128</text>
            <text class="text-[22rpx] text-gray-500 mt-8rpx">余额</text>
          </view>
        </view>
      </view>

      <!-- 我的订单 -->
      <view class="mx-32rpx mt-24rpx bg-white rounded-2xl p-32rpx">
        <view class="flex items-center justify-between mb-32rpx" @click="handleViewAllOrders">
          <text class="font-bold text-[30rpx]">我的订单</text>
          <view class="flex items-center text-gray-400">
            <text class="text-xs">全部订单</text>
            <wd-icon name="arrow-right" size="28rpx" color="#9ca3af" />
          </view>
        </view>
        <view class="grid grid-cols-5 gap-8rpx">
          <view
            v-for="item in orderStatusList"
            :key="item.status"
            class="flex flex-col items-center gap-12rpx"
            @click="handleOrderStatus(item.status)"
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
            <view class="w-80rpx h-80rpx rounded-xl flex items-center justify-center" :style="{ background: item.bgColor }">
              <wd-icon :name="item.icon" size="40rpx" :color="item.iconColor" />
            </view>
            <text class="text-[22rpx] text-gray-600">{{ item.title }}</text>
          </view>
        </view>
      </view>

      <!-- 更多功能 -->
      <view class="mx-32rpx mt-24rpx mb-32rpx bg-white rounded-2xl overflow-hidden">
        <wd-cell-group>
          <wd-cell
            v-for="item in featureList"
            :key="item.title"
            :title="item.title"
            :icon="item.icon"
            is-link
            @click="handleFeatureClick(item.title)"
          />
        </wd-cell-group>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { useToast } from '@/wd'

const toast = useToast()

/** 订单状态 */
interface OrderStatusItem {
  label: string
  icon: string
  color: string
  status: string
  badge: number
}

const orderStatusList = ref<OrderStatusItem[]>([
  { label: '待付款', icon: 'clock', color: '#ef4444', status: 'PENDING_PAYMENT', badge: 1 },
  { label: '待发货', icon: 'goods', color: '#f97316', status: 'PENDING_DELIVERY', badge: 0 },
  { label: '待收货', icon: 'cart', color: '#22c55e', status: 'PENDING_RECEIVE', badge: 1 },
  { label: '待评价', icon: 'edit', color: '#3b82f6', status: 'PENDING_REVIEW', badge: 0 },
  { label: '售后', icon: 'service', color: '#6b7280', status: 'REFUND', badge: 0 },
])

/** 我的服务 */
const serviceList = ref([
  { title: '我的收藏', icon: 'heart', iconColor: '#ef4444', bgColor: '#fef2f2' },
  { title: '浏览记录', icon: 'time', iconColor: '#3b82f6', bgColor: '#eff6ff' },
  { title: '收货地址', icon: 'location', iconColor: '#22c55e', bgColor: '#f0fdf4' },
  { title: '优惠券', icon: 'ticket', iconColor: '#f97316', bgColor: '#fff7ed' },
])

/** 更多功能 */
const featureList = ref([
  { title: '客服中心', icon: 'service' },
  { title: '意见反馈', icon: 'edit' },
  { title: '关于我们', icon: 'info' },
])

const handleSettings = () => toast.info('设置')
const handleNotification = () => toast.info('消息通知')

const handleViewAllOrders = () => {
  uni.navigateTo({ url: '/pages-sub/templates/ecommerce/mallBasic/pages/orderList' })
}

const handleOrderStatus = (status: string) => {
  const tabMap: Record<string, number> = {
    PENDING_PAYMENT: 1,
    PENDING_DELIVERY: 2,
    PENDING_RECEIVE: 3,
    PENDING_REVIEW: 4,
    REFUND: 0,
  }
  uni.navigateTo({
    url: `/pages-sub/templates/ecommerce/mallBasic/pages/orderList?tab=${tabMap[status] ?? 0}`,
  })
}

const handleServiceClick = (title: string) => toast.info(title)
const handleFeatureClick = (title: string) => toast.info(title)
</script>

<style lang="scss" scoped></style>
