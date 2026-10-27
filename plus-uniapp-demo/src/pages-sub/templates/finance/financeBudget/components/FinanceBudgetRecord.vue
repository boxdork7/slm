<!-- 预算管理 - 记账 -->
<template>
  <view class="min-h-screen bg-#f5f5f5">
    <!-- 顶部标题 + 收支切换 -->
    <view class="bg-white px-40rpx pt-24rpx pb-32rpx">
      <text class="text-48rpx font-700 text-#1f2937 block mb-32rpx">记账</text>

      <!-- 收支切换 Tab -->
      <view class="flex bg-#f3f4f6 rounded-20rpx p-8rpx mb-32rpx">
        <view
          v-for="(tab, index) in typeTabs"
          :key="tab"
          class="flex-1 py-16rpx rounded-16rpx text-center text-28rpx"
          :class="activeType === index ? 'bg-white text-#1f2937 font-600 shadow-sm' : 'text-#9ca3af font-500'"
          @tap="activeType = index"
        >
          <text>{{ tab }}</text>
        </view>
      </view>

      <!-- 月度汇总 -->
      <view class="flex gap-24rpx">
        <view
          class="flex-1 rounded-32rpx px-32rpx py-24rpx"
          style="background: linear-gradient(135deg, #FEF3C7, #FDE68A)"
        >
          <text class="text-22rpx text-#92400e block">本月支出</text>
          <text class="text-40rpx font-700 text-#78350f block">¥3,260.00</text>
        </view>
        <view
          class="flex-1 rounded-32rpx px-32rpx py-24rpx"
          style="background: linear-gradient(135deg, #ECFDF5, #D1FAE5)"
        >
          <text class="text-22rpx text-#166534 block">本月收入</text>
          <text class="text-40rpx font-700 text-#14532d block">¥12,000.00</text>
        </view>
      </view>
    </view>

    <!-- 分类快捷选择 -->
    <view class="mx-40rpx mt-32rpx bg-white rounded-32rpx p-32rpx shadow-sm">
      <view class="flex justify-between items-center mb-24rpx">
        <text class="text-28rpx font-600 text-#1f2937">快捷记账</text>
        <text class="text-24rpx text-#9ca3af">点击分类记一笔</text>
      </view>
      <view class="grid grid-cols-5 gap-y-32rpx">
        <view
          v-for="item in quickCategories"
          :key="item.name"
          class="flex flex-col items-center gap-8rpx"
        >
          <view
            class="w-88rpx h-88rpx rounded-20rpx flex items-center justify-center"
            :class="item.bgClass"
          >
            <text class="text-40rpx">{{ item.icon }}</text>
          </view>
          <text class="text-20rpx text-#6b7280">{{ item.name }}</text>
        </view>
      </view>
    </view>

    <!-- 账单列表 -->
    <view class="mx-40rpx mt-40rpx mb-32rpx">
      <view class="flex justify-between items-center mb-24rpx">
        <text class="text-32rpx font-700 text-#1f2937">账单明细</text>
        <view class="flex items-center gap-8rpx">
          <wd-icon name="clock" color="#9ca3af" size="32rpx" />
          <text class="text-24rpx text-#9ca3af">4月</text>
        </view>
      </view>

      <!-- 按日期分组 -->
      <view
        v-for="group in billGroups"
        :key="group.date"
        class="mb-32rpx"
      >
        <view class="flex justify-between items-center mb-16rpx px-8rpx">
          <text class="text-24rpx text-#9ca3af font-500">{{ group.date }}</text>
          <text class="text-24rpx text-#9ca3af">{{ group.summary }}</text>
        </view>
        <view class="bg-white rounded-32rpx overflow-hidden shadow-sm">
          <view
            v-for="(item, index) in group.items"
            :key="item.name + item.time"
            class="flex items-center px-32rpx py-24rpx"
            :style="index < group.items.length - 1 ? 'border-bottom: 1px solid #f9fafb' : ''"
          >
            <view
              class="w-80rpx h-80rpx rounded-20rpx flex items-center justify-center mr-24rpx"
              :class="item.bgClass"
            >
              <text class="text-36rpx">{{ item.icon }}</text>
            </view>
            <view class="flex-1">
              <text class="text-28rpx font-500 text-#1f2937 block">{{ item.name }}</text>
              <text class="text-22rpx text-#9ca3af block">{{ item.category }}</text>
            </view>
            <view class="text-right">
              <text class="text-28rpx font-700 block" :class="item.amountColor">{{ item.amount }}</text>
              <text class="text-20rpx text-#d1d5db block">{{ item.time }}</text>
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
import { ref } from 'vue'

const activeType = ref(0)
const typeTabs = ['支出', '收入']

const quickCategories = [
  { icon: '🍜', name: '餐饮', bgClass: 'bg-#fff7ed' },
  { icon: '🚗', name: '交通', bgClass: 'bg-#eff6ff' },
  { icon: '🛍️', name: '购物', bgClass: 'bg-#fdf2f8' },
  { icon: '🎮', name: '娱乐', bgClass: 'bg-#faf5ff' },
  { icon: '🏥', name: '医疗', bgClass: 'bg-#f0fdfa' },
  { icon: '📚', name: '教育', bgClass: 'bg-#eef2ff' },
  { icon: '🏠', name: '住房', bgClass: 'bg-#fefce8' },
  { icon: '💄', name: '美容', bgClass: 'bg-#fff1f2' },
  { icon: '📱', name: '通讯', bgClass: 'bg-#ecfeff' },
  { icon: '📦', name: '其他', bgClass: 'bg-#f9fafb' },
]

const billGroups = [
  {
    date: '04月14日 · 周一',
    summary: '支出 ¥33.00',
    items: [
      { icon: '☕', name: '咖啡', category: '餐饮美食', amount: '-¥28.00', time: '14:30', bgClass: 'bg-#fff7ed', amountColor: 'text-#ef4444' },
      { icon: '🚇', name: '地铁', category: '交通出行', amount: '-¥5.00', time: '08:15', bgClass: 'bg-#eff6ff', amountColor: 'text-#ef4444' },
    ],
  },
  {
    date: '04月13日 · 周日',
    summary: '支出 ¥286.00 · 收入 ¥12,000',
    items: [
      { icon: '💼', name: '工资到账', category: '收入', amount: '+¥12,000', time: '10:00', bgClass: 'bg-#f0fdf4', amountColor: 'text-#22c55e' },
      { icon: '🍕', name: '午餐', category: '餐饮美食', amount: '-¥36.00', time: '12:30', bgClass: 'bg-#fff7ed', amountColor: 'text-#ef4444' },
      { icon: '👕', name: '衣服', category: '购物消费', amount: '-¥199.00', time: '15:20', bgClass: 'bg-#fdf2f8', amountColor: 'text-#ef4444' },
      { icon: '🎬', name: '电影票', category: '休闲娱乐', amount: '-¥51.00', time: '19:00', bgClass: 'bg-#faf5ff', amountColor: 'text-#ef4444' },
    ],
  },
]
</script>

<style scoped lang="scss"></style>
