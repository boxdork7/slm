<!-- 在线考试练习 -->
<template>
  <view class="bg-#f5f7fa min-h-full">
    <!-- 头部 -->
    <view class="bg-white px-32rpx pb-32rpx">
      <text class="text-36rpx font-bold text-gray-800 block mb-8rpx">练习</text>
      <text class="text-24rpx text-gray-400 block">每日坚持，进步看得见</text>
    </view>

    <!-- 今日练习进度 -->
    <view class="px-32rpx mt-32rpx">
      <view class="bg-white rounded-32rpx p-32rpx shadow-sm flex items-center gap-32rpx">
        <!-- 圆形进度 -->
        <view class="relative w-160rpx h-160rpx flex-shrink-0">
          <view class="w-160rpx h-160rpx">
            <wd-circle v-model="progressValue" :size="160" :stroke-width="12" color="#3B82F6" layer-color="#e5e7eb">
              <text class="text-36rpx font-bold text-blue-600">70%</text>
            </wd-circle>
          </view>
        </view>
        <view class="flex-1">
          <text class="text-28rpx font-bold text-gray-800 block">今日练习进度</text>
          <text class="text-24rpx text-gray-400 mt-8rpx block">已完成 35/50 题</text>
          <view class="flex items-center gap-24rpx mt-16rpx">
            <view class="flex items-center gap-8rpx">
              <view class="w-16rpx h-16rpx bg-green-400 rounded-full" />
              <text class="text-20rpx text-gray-500">正确 28</text>
            </view>
            <view class="flex items-center gap-8rpx">
              <view class="w-16rpx h-16rpx bg-red-400 rounded-full" />
              <text class="text-20rpx text-gray-500">错误 7</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 练习模式 -->
    <view class="px-32rpx mt-40rpx">
      <text class="text-28rpx font-bold text-gray-800 mb-24rpx block">练习模式</text>
      <view class="grid grid-cols-2 gap-24rpx">
        <view v-for="mode in practiceModes" :key="mode.name" class="bg-white rounded-32rpx p-32rpx shadow-sm">
          <view class="w-80rpx h-80rpx rounded-24rpx flex items-center justify-center mb-16rpx text-40rpx" :style="{ background: mode.bgColor }">
            {{ mode.icon }}
          </view>
          <text class="text-28rpx font-bold text-gray-800 block">{{ mode.name }}</text>
          <text class="text-20rpx text-gray-400 mt-8rpx block">{{ mode.desc }}</text>
        </view>
      </view>
    </view>

    <!-- 练习记录 -->
    <view class="px-32rpx mt-40rpx pb-32rpx">
      <view class="flex items-center justify-between mb-24rpx">
        <text class="text-28rpx font-bold text-gray-800">练习记录</text>
        <text class="text-24rpx text-blue-500">全部记录</text>
      </view>

      <view v-for="(record, index) in records" :key="index" class="bg-white rounded-32rpx p-28rpx shadow-sm" :class="index < records.length - 1 ? 'mb-24rpx' : ''">
        <view class="flex items-center justify-between">
          <view class="flex items-center gap-24rpx">
            <view class="w-72rpx h-72rpx rounded-16rpx flex items-center justify-center text-28rpx" :style="{ background: record.bgColor }">
              {{ record.icon }}
            </view>
            <view>
              <text class="text-24rpx font-bold text-gray-800 block">{{ record.subject }}</text>
              <text class="text-20rpx text-gray-400 mt-4rpx block">{{ record.time }}</text>
            </view>
          </view>
          <view class="text-right">
            <text class="text-28rpx font-bold block" :style="{ color: record.rateColor }">{{ record.rate }}</text>
            <text class="text-20rpx text-gray-400 block">用时 {{ record.duration }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const progressValue = ref(70)

const practiceModes = [
  { icon: '📋', name: '顺序练习', desc: '按章节顺序刷题', bgColor: '#eff6ff' },
  { icon: '🎲', name: '随机练习', desc: '随机抽取题目', bgColor: '#f0fdf4' },
  { icon: '❌', name: '错题重练', desc: '巩固薄弱知识点', bgColor: '#fef2f2' },
  { icon: '📝', name: '模拟考试', desc: '限时模拟真实考试', bgColor: '#faf5ff' },
]

const records = [
  { icon: '🔢', subject: '高等数学', time: '今天 14:30', rate: '92%', rateColor: '#22c55e', duration: '25min', bgColor: '#eff6ff' },
  { icon: '🔤', subject: '大学英语', time: '今天 11:20', rate: '78%', rateColor: '#3B82F6', duration: '40min', bgColor: '#f0fdf4' },
  { icon: '⚛️', subject: '大学物理', time: '昨天 16:45', rate: '65%', rateColor: '#f97316', duration: '35min', bgColor: '#faf5ff' },
  { icon: '🧪', subject: '有机化学', time: '昨天 10:00', rate: '88%', rateColor: '#22c55e', duration: '30min', bgColor: '#fff7ed' },
]
</script>

<style scoped lang="scss"></style>
