<!-- 在线学堂 - 课程 -->
<template>
  <view class="min-h-screen bg-#f5f5f5">
    <!-- 顶部搜索 -->
    <view class="bg-white px-32rpx pt-24rpx pb-0">
      <text class="text-40rpx font-700 text-#1f2937 block mb-24rpx">课程</text>
      <wd-search v-model="searchValue" placeholder="搜索课程..." class="mb-24rpx" />
      <!-- Tab 标签 -->
      <wd-tabs v-model="activeTab" :line-width="40" :line-height="6">
        <wd-tab v-for="tab in tabs" :key="tab" :title="tab" :name="tab" />
      </wd-tabs>
    </view>

    <!-- 课程网格 -->
    <view class="p-28rpx grid grid-cols-2 gap-20rpx">
      <view
        v-for="item in courses"
        :key="item.title"
        class="bg-white rounded-24rpx overflow-hidden shadow-sm"
      >
        <!-- 渐变色块封面 -->
        <view
          class="h-192rpx flex items-center justify-center relative"
          :style="{ background: item.gradient }"
        >
          <text class="text-26rpx font-600 text-white">{{ item.label }}</text>
          <wd-tag
            v-if="item.badge"
            :custom-style="{ position: 'absolute', top: '16rpx', left: '16rpx', background: 'rgba(0,0,0,0.3)', color: 'white', border: 'none', fontSize: '18rpx' }"
          >
            {{ item.badge }}
          </wd-tag>
        </view>
        <!-- 课程信息 -->
        <view class="p-20rpx">
          <text class="text-26rpx font-600 text-#1f2937 block mb-8rpx leading-tight">{{ item.title }}</text>
          <text class="text-22rpx text-#9ca3af block mb-12rpx">{{ item.teacher }}</text>
          <view class="flex items-center gap-8rpx mb-12rpx">
            <text class="text-20rpx text-#f59e0b">{{ item.stars }}</text>
            <text class="text-20rpx text-#9ca3af">{{ item.rating }}</text>
          </view>
          <view class="flex justify-between items-center">
            <text class="text-30rpx font-700 text-#10B981">¥{{ item.price }}</text>
            <text class="text-18rpx text-#9ca3af">{{ item.students }}人</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const searchValue = ref('')
const activeTab = ref('全部')

const tabs = ['全部', '编程', '设计', '运营', '语言']

const courses = [
  {
    label: 'Vue3实战',
    title: 'Vue3+TS企业级实战',
    teacher: '张老师',
    stars: '★★★★★',
    rating: '4.9',
    price: 199,
    students: '8320',
    badge: '热门',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  },
  {
    label: 'UI设计',
    title: 'Figma从入门到精通',
    teacher: '李老师',
    stars: '★★★★★',
    rating: '4.8',
    price: 149,
    students: '5680',
    badge: '推荐',
    gradient: 'linear-gradient(135deg, #f59e0b, #f97316)',
  },
  {
    label: 'AI实战',
    title: 'ChatGPT与AI应用',
    teacher: '王老师',
    stars: '★★★★★',
    rating: '4.9',
    price: 99,
    students: '15200',
    badge: '新课',
    gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
  },
  {
    label: '数据分析',
    title: '数据分析与可视化',
    teacher: '陈老师',
    stars: '★★★★☆',
    rating: '4.6',
    price: 129,
    students: '3450',
    badge: '',
    gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)',
  },
  {
    label: 'Java',
    title: 'Java架构师成长',
    teacher: '刘老师',
    stars: '★★★★★',
    rating: '4.7',
    price: 299,
    students: '6120',
    badge: '',
    gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
  },
  {
    label: '英语',
    title: '商务英语精品课',
    teacher: '赵老师',
    stars: '★★★★★',
    rating: '4.8',
    price: 179,
    students: '4230',
    badge: '',
    gradient: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
  },
]
</script>

<style scoped lang="scss"></style>
