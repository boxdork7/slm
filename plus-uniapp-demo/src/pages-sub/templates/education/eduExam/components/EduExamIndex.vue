<!-- 在线考试首页 -->
<template>
  <view class="bg-#f5f7fa min-h-full">
    <!-- 渐变头部 -->
    <view class="relative overflow-hidden" style="background: linear-gradient(135deg, #3B82F6, #1D4ED8); padding: 32rpx 32rpx 56rpx">
      <!-- 装饰圆 -->
      <view class="absolute w-200rpx h-200rpx rounded-full bg-white/10 -top-40rpx -right-40rpx" />
      <view class="absolute w-120rpx h-120rpx rounded-full bg-white/10 bottom-20rpx -left-30rpx" />
      <view class="flex items-center justify-between mb-24rpx">
        <view>
          <text class="text-white text-36rpx font-bold block">在线考试</text>
          <text class="text-blue-200 text-24rpx mt-4rpx block">学无止境，考以致知</text>
        </view>
        <view class="w-72rpx h-72rpx bg-white/20 rounded-full flex items-center justify-center">
          <wd-icon name="notification" size="32rpx" color="#fff" />
        </view>
      </view>
      <!-- 搜索 -->
      <wd-search v-model="searchValue" placeholder="搜索考试、题目..." custom-class="edu-search" hide-cancel />
    </view>

    <!-- 统计卡片 -->
    <view class="px-32rpx -mt-32rpx relative z-1">
      <view class="bg-white rounded-32rpx p-32rpx shadow-sm grid grid-cols-4 gap-16rpx">
        <view v-for="item in statsData" :key="item.label" class="text-center">
          <text class="text-36rpx font-bold block" :style="{ color: item.color }">{{ item.value }}</text>
          <text class="text-20rpx text-gray-400 mt-4rpx block">{{ item.label }}</text>
        </view>
      </view>
    </view>

    <!-- 考试提醒横幅 -->
    <view class="px-32rpx mt-32rpx">
      <view class="rounded-32rpx p-32rpx flex items-center justify-between" style="background: linear-gradient(to right, #3B82F6, #4F46E5)">
        <view>
          <text class="text-white font-bold text-28rpx block">期中模拟大考</text>
          <text class="text-blue-100 text-24rpx mt-8rpx block">全科综合 · 限时优惠</text>
          <view class="bg-white/20 rounded-full px-24rpx py-8rpx mt-16rpx inline-flex">
            <text class="text-white text-24rpx">立即参加</text>
          </view>
        </view>
        <text class="text-64rpx">🏆</text>
      </view>
    </view>

    <!-- 推荐考试列表 -->
    <view class="px-32rpx mt-32rpx pb-32rpx">
      <view class="flex items-center justify-between mb-24rpx">
        <text class="text-28rpx font-bold text-gray-800">推荐考试</text>
        <text class="text-24rpx text-blue-500">查看更多</text>
      </view>

      <view v-for="(exam, index) in examList" :key="index" class="bg-white rounded-32rpx p-28rpx shadow-sm" :class="index < examList.length - 1 ? 'mb-24rpx' : ''">
        <view class="flex items-start justify-between">
          <view class="flex-1">
            <text class="text-28rpx font-bold text-gray-800 block">{{ exam.name }}</text>
            <view class="flex items-center gap-12rpx mt-12rpx">
              <wd-tag :custom-style="exam.subjectStyle" round size="small">{{ exam.subject }}</wd-tag>
              <wd-tag :custom-style="exam.diffStyle" round size="small">{{ exam.difficulty }}</wd-tag>
            </view>
            <view class="flex items-center gap-24rpx mt-16rpx">
              <view class="flex items-center gap-4rpx">
                <wd-icon name="edit" size="24rpx" color="#9ca3af" />
                <text class="text-20rpx text-gray-400">{{ exam.count }}题</text>
              </view>
              <view class="flex items-center gap-4rpx">
                <wd-icon name="clock" size="24rpx" color="#9ca3af" />
                <text class="text-20rpx text-gray-400">{{ exam.time }}分钟</text>
              </view>
              <view class="flex items-center gap-4rpx">
                <wd-icon name="user" size="24rpx" color="#9ca3af" />
                <text class="text-20rpx text-gray-400">{{ exam.people }}人</text>
              </view>
            </view>
          </view>
          <wd-button size="small" custom-style="background: #3B82F6; border: none; border-radius: 16rpx; font-size: 24rpx; height: 56rpx; padding: 0 24rpx">参加</wd-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const searchValue = ref('')

const statsData = [
  { value: '3', label: '今日完成', color: '#3B82F6' },
  { value: '86%', label: '正确率', color: '#22c55e' },
  { value: '128', label: '累计题目', color: '#f97316' },
  { value: '4.5h', label: '学习时长', color: '#a855f7' },
]

const examList = [
  {
    name: '高等数学期末模拟',
    subject: '数学',
    subjectStyle: 'background: #eff6ff; color: #2563eb; border: none',
    difficulty: '中等',
    diffStyle: 'background: #fff7ed; color: #f97316; border: none',
    count: 50,
    time: 90,
    people: '1.2k',
  },
  {
    name: '大学英语四级真题',
    subject: '英语',
    subjectStyle: 'background: #f0fdf4; color: #16a34a; border: none',
    difficulty: '困难',
    diffStyle: 'background: #fef2f2; color: #ef4444; border: none',
    count: 80,
    time: 120,
    people: '3.5k',
  },
  {
    name: '物理力学专项测试',
    subject: '物理',
    subjectStyle: 'background: #faf5ff; color: #9333ea; border: none',
    difficulty: '简单',
    diffStyle: 'background: #fefce8; color: #ca8a04; border: none',
    count: 30,
    time: 45,
    people: '856',
  },
  {
    name: '计算机二级模拟',
    subject: '计算机',
    subjectStyle: 'background: #ecfeff; color: #0891b2; border: none',
    difficulty: '中等',
    diffStyle: 'background: #fff7ed; color: #f97316; border: none',
    count: 40,
    time: 60,
    people: '2.1k',
  },
]
</script>

<style scoped lang="scss">
:deep(.edu-search) {
  background: transparent !important;
  padding: 0 !important;
}
</style>
