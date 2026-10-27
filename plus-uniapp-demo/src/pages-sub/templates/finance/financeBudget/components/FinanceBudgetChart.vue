<!-- 预算管理 - 统计 -->
<template>
  <view class="min-h-screen bg-#f5f5f5">
    <!-- 顶部 -->
    <view class="bg-white px-40rpx pt-24rpx pb-32rpx">
      <text class="text-48rpx font-700 text-#1f2937 block mb-32rpx">统计</text>

      <!-- 周/月/年 Tab -->
      <view class="flex bg-#f3f4f6 rounded-20rpx p-8rpx">
        <view
          v-for="(tab, index) in periodTabs"
          :key="tab"
          class="flex-1 py-16rpx rounded-16rpx text-center text-28rpx"
          :class="activePeriod === index ? 'bg-white text-#1f2937 font-600 shadow-sm' : 'text-#9ca3af font-500'"
          @tap="activePeriod = index"
        >
          <text>{{ tab }}</text>
        </view>
      </view>
    </view>

    <!-- 月度总览 -->
    <view class="mx-40rpx mt-32rpx bg-white rounded-32rpx p-40rpx shadow-sm">
      <view class="flex justify-between items-center mb-32rpx">
        <view class="flex items-center gap-16rpx">
          <wd-icon name="arrow-left" color="#9ca3af" size="32rpx" />
          <text class="text-28rpx font-600 text-#1f2937">2026年4月</text>
          <wd-icon name="arrow-right" color="#9ca3af" size="32rpx" />
        </view>
      </view>
      <view class="grid grid-cols-3 gap-32rpx text-center">
        <view>
          <text class="text-40rpx font-700 text-#ef4444 block">¥3,260</text>
          <text class="text-22rpx text-#9ca3af block mt-8rpx">支出</text>
        </view>
        <view>
          <text class="text-40rpx font-700 text-#22c55e block">¥12,000</text>
          <text class="text-22rpx text-#9ca3af block mt-8rpx">收入</text>
        </view>
        <view>
          <text class="text-40rpx font-700 text-#F59E0B block">¥8,740</text>
          <text class="text-22rpx text-#9ca3af block mt-8rpx">结余</text>
        </view>
      </view>
    </view>

    <!-- 支出趋势（模拟柱状图） -->
    <view class="mx-40rpx mt-40rpx bg-white rounded-32rpx p-40rpx shadow-sm">
      <view class="flex justify-between items-center mb-32rpx">
        <text class="text-28rpx font-600 text-#1f2937">支出趋势</text>
        <text class="text-24rpx text-#9ca3af">近7天</text>
      </view>

      <!-- 柱状图 -->
      <view class="flex items-end justify-between gap-16rpx h-256rpx mb-16rpx">
        <view
          v-for="item in trendData"
          :key="item.day"
          class="flex-1 flex flex-col items-center gap-8rpx"
        >
          <text class="text-18rpx" :class="item.isToday ? 'text-#F59E0B font-600' : 'text-#9ca3af'">
            ¥{{ item.value }}
          </text>
          <view
            class="w-full rounded-t-16rpx"
            :style="{
              height: (item.value / maxTrend * 100) + '%',
              background: item.isToday
                ? 'linear-gradient(180deg, #F59E0B, #D97706)'
                : 'linear-gradient(180deg, #FBBF24, #F59E0B)',
            }"
          />
        </view>
      </view>
      <view class="flex justify-between text-20rpx text-#9ca3af">
        <text v-for="item in trendData" :key="'l' + item.day" :class="item.isToday ? 'text-#F59E0B font-500' : ''">
          {{ item.day }}
        </text>
      </view>
    </view>

    <!-- 支出分类占比（模拟环形图） -->
    <view class="mx-40rpx mt-40rpx bg-white rounded-32rpx p-40rpx shadow-sm">
      <view class="flex justify-between items-center mb-32rpx">
        <text class="text-28rpx font-600 text-#1f2937">支出分类</text>
        <text class="text-24rpx text-#9ca3af">本月</text>
      </view>

      <view class="flex items-center gap-40rpx">
        <!-- 环形图（用多色条模拟） -->
        <view class="w-256rpx h-256rpx shrink-0 flex flex-col items-center justify-center relative">
          <!-- 用 view 模拟同心环 -->
          <view class="w-256rpx h-256rpx rounded-full relative overflow-hidden" style="background: conic-gradient(#fdba74 0% 39%, #f9a8d4 39% 65%, #93c5fd 65% 75%, #c4b5fd 75% 81%, #e5e7eb 81% 100%)">
            <view class="absolute w-160rpx h-160rpx bg-white rounded-full" style="top: 48rpx; left: 48rpx" />
          </view>
          <view class="absolute inset-0 flex flex-col items-center justify-center">
            <text class="text-32rpx font-700 text-#1f2937">¥3,260</text>
            <text class="text-20rpx text-#9ca3af">总支出</text>
          </view>
        </view>
        <!-- 图例 -->
        <view class="flex-1 flex flex-col gap-24rpx">
          <view
            v-for="item in categoryData"
            :key="item.name"
            class="flex items-center gap-16rpx"
          >
            <view class="w-24rpx h-24rpx rounded-full" :class="item.dotColor" />
            <text class="text-24rpx text-#4b5563 flex-1">{{ item.name }}</text>
            <text class="text-24rpx font-600 text-#1f2937">¥{{ item.amount }}</text>
            <text class="text-20rpx text-#9ca3af">{{ item.percent }}%</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 预算执行情况 -->
    <view class="mx-40rpx mt-40rpx mb-32rpx bg-white rounded-32rpx p-40rpx shadow-sm">
      <view class="flex justify-between items-center mb-32rpx">
        <text class="text-28rpx font-600 text-#1f2937">预算执行</text>
        <text class="text-24rpx text-#F59E0B">本月</text>
      </view>

      <view class="flex flex-col gap-32rpx">
        <view
          v-for="item in budgetExecution"
          :key="item.name"
        >
          <view class="flex justify-between items-center mb-12rpx">
            <view class="flex items-center gap-16rpx">
              <text class="text-28rpx">{{ item.icon }}</text>
              <text class="text-24rpx text-#4b5563">{{ item.name }}</text>
            </view>
            <text class="text-24rpx text-#6b7280">¥{{ item.spent }} / ¥{{ item.budget }}</text>
          </view>
          <view class="w-full h-20rpx bg-#f3f4f6 rounded-full overflow-hidden">
            <view
              class="h-full rounded-full"
              :class="item.barColor"
              :style="{ width: item.percent + '%' }"
            />
          </view>
        </view>
      </view>
    </view>

    <!-- 底部留空 -->
    <view class="h-32rpx" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const activePeriod = ref(1)
const periodTabs = ['周', '月', '年']

const trendData = [
  { day: '周一', value: 86, isToday: false },
  { day: '周二', value: 120, isToday: false },
  { day: '周三', value: 45, isToday: false },
  { day: '周四', value: 200, isToday: false },
  { day: '周五', value: 156, isToday: false },
  { day: '周六', value: 68, isToday: false },
  { day: '今天', value: 33, isToday: true },
]

const maxTrend = computed(() => Math.max(...trendData.map(d => d.value)))

const categoryData = [
  { name: '餐饮', amount: '1,280', percent: 39, dotColor: 'bg-#fdba74' },
  { name: '购物', amount: '860', percent: 26, dotColor: 'bg-#f9a8d4' },
  { name: '交通', amount: '320', percent: 10, dotColor: 'bg-#93c5fd' },
  { name: '娱乐', amount: '180', percent: 6, dotColor: 'bg-#c4b5fd' },
]

const budgetExecution = [
  { icon: '🍜', name: '餐饮', spent: '1,280', budget: '2,000', percent: 64, barColor: 'bg-#fb923c' },
  { icon: '🚗', name: '交通', spent: '320', budget: '800', percent: 40, barColor: 'bg-#60a5fa' },
  { icon: '🛍️', name: '购物', spent: '860', budget: '1,500', percent: 57, barColor: 'bg-#f472b6' },
  { icon: '🎮', name: '娱乐', spent: '180', budget: '600', percent: 30, barColor: 'bg-#a78bfa' },
]
</script>

<style scoped lang="scss"></style>
