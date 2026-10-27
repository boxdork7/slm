<!-- 在线学堂 - 首页 -->
<template>
  <view class="min-h-screen bg-#f5f5f5">
    <!-- 渐变头部 -->
    <view
      class="relative overflow-hidden pt-24rpx px-32rpx pb-48rpx"
      style="background: linear-gradient(135deg, #10B981, #059669)"
    >
      <!-- 装饰圆 -->
      <view class="absolute w-200rpx h-200rpx rounded-full bg-white/10 -top-40rpx -right-40rpx" />
      <view class="absolute w-160rpx h-160rpx rounded-full bg-white/10 -bottom-60rpx right-60rpx" />
      <view class="absolute w-120rpx h-120rpx rounded-full bg-white/10 top-20rpx -left-40rpx" />

      <!-- 标题行 -->
      <view class="flex justify-between items-center mb-28rpx relative z-1">
        <view>
          <text class="text-24rpx text-white/80 block">下午好</text>
          <text class="text-40rpx font-700 text-white block">在线学堂</text>
        </view>
        <view class="w-72rpx h-72rpx bg-white/20 rounded-full flex items-center justify-center">
          <wd-icon name="notification" color="white" size="36rpx" />
        </view>
      </view>

      <!-- 搜索 -->
      <wd-search
        v-model="searchValue"
        placeholder="搜索课程、讲师、分类..."
        disabled
        custom-class="edu-search"
      />
    </view>

    <!-- 学习数据横条 -->
    <view class="mx-32rpx -mt-24rpx mb-32rpx bg-white rounded-24rpx px-32rpx py-28rpx flex shadow-sm relative z-2">
      <view class="flex-1 text-center" style="border-right: 1px solid #f0f0f0">
        <text class="text-44rpx font-700 text-#10B981 block">30</text>
        <text class="text-22rpx text-#9ca3af block">今日学习(min)</text>
      </view>
      <view class="flex-1 text-center">
        <text class="text-44rpx font-700 text-#10B981 block">12</text>
        <text class="text-22rpx text-#9ca3af block">连续打卡(天)🔥</text>
      </view>
    </view>

    <!-- 推荐课程轮播 -->
    <view class="px-32rpx mb-40rpx">
      <view class="flex justify-between items-center mb-20rpx">
        <text class="text-32rpx font-700 text-#1f2937">推荐课程</text>
        <text class="text-24rpx text-#10B981">更多 ›</text>
      </view>
      <view
        class="rounded-28rpx px-40rpx py-40rpx relative overflow-hidden"
        style="background: linear-gradient(135deg, #10B981, #34d399)"
      >
        <view class="absolute w-200rpx h-200rpx bg-white/10 rounded-full -top-40rpx -right-40rpx" />
        <view class="absolute w-160rpx h-160rpx bg-white/8 rounded-full -bottom-60rpx right-60rpx" />
        <text class="text-22rpx text-white/80 block mb-12rpx relative z-1">限时免费</text>
        <text class="text-36rpx font-700 text-white block mb-8rpx relative z-1">Python全栈开发</text>
        <text class="text-24rpx text-white/80 block mb-24rpx relative z-1">从零基础到项目实战 · 128课时</text>
        <view class="flex items-center gap-16rpx relative z-1">
          <view class="bg-white text-#10B981 text-24rpx font-600 px-28rpx py-10rpx rounded-32rpx">立即学习</view>
          <text class="text-22rpx text-white/80">12,580人在学</text>
        </view>
        <!-- 指示器 -->
        <view class="flex gap-8rpx justify-center mt-28rpx relative z-1">
          <view class="w-32rpx h-8rpx bg-white rounded-4rpx" />
          <view class="w-8rpx h-8rpx bg-white/40 rounded-4rpx" />
          <view class="w-8rpx h-8rpx bg-white/40 rounded-4rpx" />
        </view>
      </view>
    </view>

    <!-- 分类入口 -->
    <view class="px-32rpx mb-40rpx">
      <text class="text-32rpx font-700 text-#1f2937 block mb-24rpx">课程分类</text>
      <view class="grid grid-cols-3 gap-20rpx">
        <view
          v-for="item in categories"
          :key="item.name"
          class="bg-white rounded-24rpx py-28rpx px-16rpx text-center shadow-sm"
        >
          <text class="text-48rpx block mb-8rpx">{{ item.icon }}</text>
          <text class="text-24rpx text-#374151 block">{{ item.name }}</text>
        </view>
      </view>
    </view>

    <!-- 热门课程列表 -->
    <view class="px-32rpx pb-32rpx">
      <view class="flex justify-between items-center mb-20rpx">
        <text class="text-32rpx font-700 text-#1f2937">热门课程</text>
        <text class="text-24rpx text-#10B981">查看全部 ›</text>
      </view>

      <view
        v-for="item in hotCourses"
        :key="item.title"
        class="bg-white rounded-24rpx p-24rpx flex gap-24rpx mb-20rpx shadow-sm"
      >
        <!-- 渐变色块 -->
        <view
          class="w-200rpx h-144rpx rounded-16rpx flex items-center justify-center shrink-0"
          :style="{ background: item.gradient }"
        >
          <text class="text-22rpx font-600 text-white">{{ item.label }}</text>
        </view>
        <view class="flex-1 flex flex-col justify-between">
          <view>
            <text class="text-28rpx font-600 text-#1f2937 block mb-4rpx">{{ item.title }}</text>
            <text class="text-22rpx text-#9ca3af block">{{ item.teacher }} · {{ item.lessons }}课时</text>
          </view>
          <view class="flex justify-between items-center">
            <text class="text-30rpx font-700 text-#10B981">¥{{ item.price }}</text>
            <text class="text-20rpx text-#9ca3af">{{ item.students }}人学习</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const searchValue = ref('')

const categories = [
  { icon: '💻', name: '编程' },
  { icon: '🎨', name: '设计' },
  { icon: '📊', name: '运营' },
  { icon: '🌐', name: '语言' },
  { icon: '💼', name: '职场' },
  { icon: '🤖', name: 'AI' },
]

const hotCourses = [
  {
    label: 'Vue3实战',
    title: 'Vue3+TypeScript企业级实战',
    teacher: '张老师',
    lessons: 86,
    price: 199,
    students: '8,320',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  },
  {
    label: 'UI设计',
    title: 'Figma从入门到精通',
    teacher: '李老师',
    lessons: 64,
    price: 149,
    students: '5,680',
    gradient: 'linear-gradient(135deg, #f59e0b, #f97316)',
  },
  {
    label: 'AI入门',
    title: 'ChatGPT与AI应用实战',
    teacher: '王老师',
    lessons: 42,
    price: 99,
    students: '15,200',
    gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
  },
  {
    label: '数据分析',
    title: '数据分析与可视化',
    teacher: '陈老师',
    lessons: 56,
    price: 129,
    students: '3,450',
    gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)',
  },
]
</script>

<style scoped lang="scss">
:deep(.edu-search) {
  background: transparent !important;
  padding: 0 !important;

  .wd-search__block {
    background: rgba(255, 255, 255, 0.2) !important;
  }

  .wd-search__input {
    color: rgba(255, 255, 255, 0.7) !important;
  }

  .wd-search__icon {
    color: rgba(255, 255, 255, 0.7) !important;
  }
}
</style>
