<!-- 在线学堂 - 学习 -->
<template>
  <view class="min-h-screen bg-#f5f5f5">
    <!-- 顶部 -->
    <view class="bg-white px-32rpx pt-24rpx pb-32rpx">
      <text class="text-40rpx font-700 text-#1f2937 block mb-32rpx">学习</text>

      <!-- 学习统计 -->
      <view class="grid grid-cols-3 gap-20rpx">
        <view class="rounded-24rpx py-28rpx px-20rpx text-center" style="background: linear-gradient(135deg, #ecfdf5, #d1fae5)">
          <text class="text-44rpx font-700 text-#10B981 block">45</text>
          <text class="text-20rpx text-#6b7280 block mt-4rpx">今日(min)</text>
        </view>
        <view class="rounded-24rpx py-28rpx px-20rpx text-center" style="background: linear-gradient(135deg, #eff6ff, #dbeafe)">
          <text class="text-44rpx font-700 text-#3b82f6 block">5/7</text>
          <text class="text-20rpx text-#6b7280 block mt-4rpx">本周目标</text>
        </view>
        <view class="rounded-24rpx py-28rpx px-20rpx text-center" style="background: linear-gradient(135deg, #fef3c7, #fde68a)">
          <text class="text-44rpx font-700 text-#f59e0b block">8</text>
          <text class="text-20rpx text-#6b7280 block mt-4rpx">累计课程</text>
        </view>
      </view>
    </view>

    <!-- 本周打卡日历 -->
    <view class="mx-32rpx mt-24rpx bg-white rounded-28rpx p-32rpx shadow-sm">
      <view class="flex justify-between items-center mb-28rpx">
        <text class="text-30rpx font-600 text-#1f2937">本周打卡</text>
        <text class="text-22rpx text-#10B981">连续12天 🔥</text>
      </view>
      <view class="grid grid-cols-7 gap-8rpx text-center">
        <!-- 星期头部 -->
        <text v-for="day in weekDays" :key="day" class="text-20rpx text-#9ca3af mb-12rpx block">{{ day }}</text>
        <!-- 日期 -->
        <view
          v-for="item in calendarDays"
          :key="item.date"
          class="w-64rpx h-64rpx rounded-full flex items-center justify-center mx-auto"
          :class="item.status === 'done' ? 'bg-#10B981 text-white' : item.status === 'today' ? 'bg-#d1fae5 text-#10B981' : 'bg-#f3f4f6 text-#9ca3af'"
        >
          <text class="text-24rpx font-600">{{ item.date }}</text>
        </view>
      </view>
    </view>

    <!-- 正在学习 -->
    <view class="px-32rpx mt-24rpx pb-32rpx">
      <view class="flex justify-between items-center mb-24rpx">
        <text class="text-32rpx font-700 text-#1f2937">正在学习</text>
        <text class="text-24rpx text-#10B981">全部 ›</text>
      </view>

      <view
        v-for="item in studyingCourses"
        :key="item.title"
        class="bg-white rounded-24rpx p-28rpx mb-20rpx shadow-sm"
      >
        <view class="flex gap-24rpx">
          <!-- emoji 图标 -->
          <view
            class="w-112rpx h-112rpx rounded-20rpx flex items-center justify-center shrink-0"
            :style="{ background: item.gradient }"
          >
            <text class="text-20rpx font-600 text-white">{{ item.label }}</text>
          </view>
          <view class="flex-1">
            <text class="text-28rpx font-600 text-#1f2937 block mb-8rpx">{{ item.title }}</text>
            <text class="text-22rpx text-#9ca3af block mb-16rpx">已学 {{ item.learned }}/{{ item.total }} 章节</text>
            <wd-progress
              :percentage="item.percent"
              color="#10B981"
              :show-text="false"
            />
            <view class="flex justify-between mt-8rpx">
              <text class="text-20rpx text-#10B981 font-600">{{ item.percent }}%</text>
              <text class="text-20rpx text-#9ca3af">{{ item.lastStudy }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const weekDays = ['一', '二', '三', '四', '五', '六', '日']

const calendarDays = [
  { date: 7, status: 'done' },
  { date: 8, status: 'done' },
  { date: 9, status: 'done' },
  { date: 10, status: 'done' },
  { date: 11, status: 'done' },
  { date: 12, status: 'today' },
  { date: 13, status: 'future' },
]

const studyingCourses = [
  {
    label: 'Vue3',
    title: 'Vue3+TypeScript企业级实战',
    learned: 42,
    total: 86,
    percent: 49,
    lastStudy: '上次学习 2小时前',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  },
  {
    label: 'AI',
    title: 'ChatGPT与AI应用实战',
    learned: 28,
    total: 42,
    percent: 67,
    lastStudy: '上次学习 昨天',
    gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
  },
  {
    label: 'UI',
    title: 'Figma从入门到精通',
    learned: 12,
    total: 64,
    percent: 19,
    lastStudy: '上次学习 3天前',
    gradient: 'linear-gradient(135deg, #f59e0b, #f97316)',
  },
  {
    label: 'Java',
    title: 'Java架构师成长之路',
    learned: 85,
    total: 120,
    percent: 71,
    lastStudy: '上次学习 5天前',
    gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
  },
]
</script>

<style scoped lang="scss"></style>
