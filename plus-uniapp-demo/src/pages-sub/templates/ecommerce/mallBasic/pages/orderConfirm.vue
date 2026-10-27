<!-- 基础商城 - 确认订单 -->
<template>
  <view class="min-h-100vh bg-gray-50 flex flex-col">
    <wd-navbar title="确认订单" show-back />

    <scroll-view class="flex-1" scroll-y :show-scrollbar="false">
      <!-- 收货地址 -->
      <view class="mx-32rpx mt-24rpx bg-white rounded-2xl p-32rpx" @click="handleSelectAddress">
        <view class="flex items-start">
          <view class="w-72rpx h-72rpx rounded-full bg-[#FF6B35]/10 flex items-center justify-center flex-shrink-0 mt-4rpx">
            <wd-icon name="location" size="32rpx" color="#FF6B35" />
          </view>
          <view class="ml-24rpx flex-1">
            <view class="flex items-center gap-16rpx">
              <text class="text-sm font-medium">张三</text>
              <text class="text-sm text-gray-500">138****8000</text>
            </view>
            <text class="text-xs text-gray-500 mt-8rpx leading-relaxed block">浙江省杭州市西湖区文一西路 969 号阿里巴巴西溪园区</text>
          </view>
          <wd-icon name="arrow-right" size="32rpx" color="#d1d5db" custom-class="mt-8rpx flex-shrink-0" />
        </view>
      </view>

      <!-- 彩色分割线 -->
      <view class="mx-32rpx h-8rpx bg-gradient-to-r from-[#FF6B35] via-yellow-400 to-green-400 rounded-full -mt-4rpx" />

      <!-- 商品信息 -->
      <view class="mx-32rpx mt-24rpx bg-white rounded-2xl overflow-hidden">
        <view class="flex items-center px-32rpx py-24rpx border-b border-gray-50">
          <wd-icon name="shop" size="32rpx" color="#6b7280" custom-class="mr-12rpx" />
          <text class="text-sm font-medium">Apple 官方旗舰店</text>
        </view>

        <view v-for="item in orderGoods" :key="item.id" class="flex p-32rpx border-b border-gray-50 last:border-b-0">
          <view class="w-152rpx h-152rpx rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
            <wd-img :src="item.img" width="152rpx" height="152rpx" mode="aspectFill" />
          </view>
          <view class="ml-24rpx flex-1 flex flex-col justify-between">
            <text class="text-[26rpx] font-medium leading-snug line-clamp-2 text-gray-800">{{ item.name }}</text>
            <view class="flex items-end justify-between">
              <text class="text-[22rpx] text-gray-400">{{ item.spec }}</text>
              <view class="text-right">
                <text class="text-sm font-bold text-gray-800">¥{{ item.price }}</text>
                <text class="text-[22rpx] text-gray-400 ml-8rpx">x{{ item.quantity }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 配送与优惠 -->
      <view class="mx-32rpx mt-24rpx bg-white rounded-2xl overflow-hidden">
        <wd-cell title="配送方式" value="顺丰快递 免邮" />
        <wd-cell title="优惠券" is-link @click="handleSelectCoupon">
          <template #value>
            <text class="text-[#FF6B35]">-¥300</text>
          </template>
        </wd-cell>
        <wd-cell title="订单备注" is-link @click="handleAddRemark">
          <template #value>
            <text class="text-gray-400 text-xs">选填，建议先与卖家沟通</text>
          </template>
        </wd-cell>
      </view>

      <!-- 价格明细 -->
      <view class="mx-32rpx mt-24rpx mb-32rpx bg-white rounded-2xl p-32rpx">
        <view class="flex items-center justify-between mb-20rpx">
          <text class="text-sm text-gray-500">商品金额</text>
          <text class="text-sm text-gray-800">¥26,998.00</text>
        </view>
        <view class="flex items-center justify-between mb-20rpx">
          <text class="text-sm text-gray-500">运费</text>
          <text class="text-sm text-green-500">免运费</text>
        </view>
        <view class="flex items-center justify-between mb-20rpx">
          <text class="text-sm text-gray-500">优惠券</text>
          <text class="text-sm text-[#FF6B35]">-¥300.00</text>
        </view>
        <view class="border-t border-gray-100 pt-20rpx flex items-center justify-between">
          <text class="text-sm font-medium text-gray-800">实付金额</text>
          <text class="text-lg font-bold text-[#FF6B35]">¥26,698.00</text>
        </view>
      </view>

      <!-- 底部占位 -->
      <view class="h-200rpx" />
    </scroll-view>

    <!-- 底部提交栏 -->
    <view class="order-bottom fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100">
      <view class="flex items-center justify-between px-32rpx py-24rpx">
        <view>
          <view class="flex items-baseline">
            <text class="text-sm text-gray-500">合计: </text>
            <text class="text-[#FF6B35] font-bold text-lg">¥26,698</text>
          </view>
          <text class="text-[20rpx] text-gray-400">含运费 ¥0.00</text>
        </view>
        <wd-button type="primary" custom-class="min-w-240rpx" @click="handleSubmitOrder">提交订单</wd-button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useToast } from '@/wd'

const toast = useToast()

const orderGoods = ref([
  { id: 1, name: 'iPhone 15 Pro Max 512GB 钛金属', img: 'https://picsum.photos/152/152?random=11', price: '8,999', spec: '原色钛金属 / 512GB', quantity: 1 },
  { id: 2, name: 'MacBook Pro 14 M3 Pro 芯片', img: 'https://picsum.photos/152/152?random=12', price: '17,999', spec: '深空灰 / 标准版', quantity: 1 },
])

const handleSelectAddress = () => toast.info('选择收货地址')
const handleSelectCoupon = () => toast.info('选择优惠券')
const handleAddRemark = () => toast.info('添加备注')

const handleSubmitOrder = () => {
  toast.success('订单提交成功')
  setTimeout(() => {
    uni.navigateTo({ url: '/pages-sub/templates/ecommerce/mallBasic/pages/orderList' })
  }, 1000)
}
</script>

<style lang="scss" scoped>
.order-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
