<!-- 计算器 - 历史记录 -->
<template>
  <view class="min-h-screen bg-#f5f5f5">
    <!-- 顶部标题栏 -->
    <view class="bg-white px-32rpx py-24rpx flex justify-between items-center" style="border-bottom: 1px solid #f0f0f0">
      <text class="text-40rpx font-700 text-#1f2937">计算历史</text>
      <view class="flex items-center gap-8rpx" @tap="onClear">
        <wd-icon name="delete" color="#ef4444" size="28rpx" />
        <text class="text-26rpx text-#ef4444">清空</text>
      </view>
    </view>

    <!-- 今天 -->
    <view class="px-32rpx pt-32rpx">
      <text class="text-26rpx font-600 text-#6b7280 block mb-20rpx">今天</text>

      <view class="bg-white rounded-24rpx overflow-hidden shadow-sm">
        <view
          v-for="(item, index) in todayRecords"
          :key="item.expression"
          class="px-32rpx py-28rpx"
          :style="index < todayRecords.length - 1 ? 'border-bottom: 1px solid #f5f5f5' : ''"
        >
          <view class="flex justify-between items-start">
            <view>
              <text class="text-30rpx text-#6b7280 block mb-8rpx">{{ item.expression }}</text>
              <text class="text-48rpx font-600 text-#1f2937 block">= {{ item.result }}</text>
            </view>
            <text class="text-22rpx text-#9ca3af mt-4rpx">{{ item.time }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 昨天 -->
    <view class="px-32rpx pt-32rpx">
      <text class="text-26rpx font-600 text-#6b7280 block mb-20rpx">昨天</text>

      <view class="bg-white rounded-24rpx overflow-hidden shadow-sm">
        <view
          v-for="(item, index) in yesterdayRecords"
          :key="item.expression"
          class="px-32rpx py-28rpx"
          :style="index < yesterdayRecords.length - 1 ? 'border-bottom: 1px solid #f5f5f5' : ''"
        >
          <view class="flex justify-between items-start">
            <view>
              <text class="text-30rpx text-#6b7280 block mb-8rpx">{{ item.expression }}</text>
              <text class="text-48rpx font-600 text-#1f2937 block">= {{ item.result }}</text>
            </view>
            <text class="text-22rpx text-#9ca3af mt-4rpx">{{ item.time }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 更早 -->
    <view class="px-32rpx pt-32rpx pb-40rpx">
      <text class="text-26rpx font-600 text-#6b7280 block mb-20rpx">4月11日</text>

      <view class="bg-white rounded-24rpx overflow-hidden shadow-sm">
        <view
          v-for="(item, index) in earlierRecords"
          :key="item.expression"
          class="px-32rpx py-28rpx"
          :style="index < earlierRecords.length - 1 ? 'border-bottom: 1px solid #f5f5f5' : ''"
        >
          <view class="flex justify-between items-start">
            <view>
              <text class="text-30rpx text-#6b7280 block mb-8rpx">{{ item.expression }}</text>
              <text class="text-48rpx font-600 text-#1f2937 block">= {{ item.result }}</text>
            </view>
            <text class="text-22rpx text-#9ca3af mt-4rpx">{{ item.time }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部留空 -->
    <view class="h-32rpx" />
  </view>
</template>

<script setup lang="ts">
import { useToast } from '@/wd'

const toast = useToast()

const todayRecords = [
  { expression: '1024 × 8', result: '8,192', time: '14:32' },
  { expression: '128 + 256', result: '384', time: '14:28' },
  { expression: '999 ÷ 3', result: '333', time: '11:15' },
  { expression: '50 × 20%', result: '10', time: '09:42' },
]

const yesterdayRecords = [
  { expression: '3.14 × 10²', result: '314', time: '20:05' },
  { expression: '2048 − 512', result: '1,536', time: '16:47' },
  { expression: '√144', result: '12', time: '10:22' },
]

const earlierRecords = [
  { expression: '88 × 66', result: '5,808', time: '15:30' },
  { expression: '1000 ÷ 7', result: '142.857', time: '09:18' },
]

/** 清空历史记录 */
const onClear = () => {
  toast.success('已清空历史记录')
}
</script>

<style scoped lang="scss"></style>
