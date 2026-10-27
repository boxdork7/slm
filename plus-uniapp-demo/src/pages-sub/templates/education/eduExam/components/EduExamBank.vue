<!-- 在线考试题库 -->
<template>
  <view class="bg-#f5f7fa min-h-full">
    <!-- 头部 -->
    <view class="bg-white px-32rpx pb-32rpx">
      <text class="text-36rpx font-bold text-gray-800 block mb-24rpx">题库</text>
      <!-- 搜索 -->
      <wd-search v-model="searchValue" placeholder="搜索题目、知识点..." hide-cancel />
    </view>

    <!-- 科目分类 -->
    <view class="px-32rpx mt-32rpx">
      <text class="text-28rpx font-bold text-gray-800 mb-24rpx block">科目分类</text>
      <view class="grid grid-cols-4 gap-24rpx">
        <view v-for="item in subjects" :key="item.name" class="bg-white rounded-32rpx p-24rpx text-center shadow-sm">
          <text class="text-40rpx block mb-8rpx">{{ item.icon }}</text>
          <text class="text-24rpx font-medium text-gray-700 block">{{ item.name }}</text>
          <text class="text-20rpx text-gray-400 mt-4rpx block">{{ item.count }}题</text>
        </view>
      </view>
    </view>

    <!-- 最近更新 -->
    <view class="px-32rpx mt-40rpx pb-32rpx">
      <view class="flex items-center justify-between mb-24rpx">
        <text class="text-28rpx font-bold text-gray-800">最近更新</text>
        <text class="text-24rpx text-blue-500">查看全部</text>
      </view>

      <view v-for="(bank, index) in bankList" :key="index" class="bg-white rounded-32rpx p-28rpx shadow-sm" :class="index < bankList.length - 1 ? 'mb-24rpx' : ''">
        <view class="flex items-center gap-24rpx">
          <view class="w-80rpx h-80rpx rounded-24rpx flex items-center justify-center text-36rpx" :style="{ background: bank.bgColor }">
            {{ bank.icon }}
          </view>
          <view class="flex-1">
            <text class="text-28rpx font-bold text-gray-800 block">{{ bank.name }}</text>
            <view class="flex items-center gap-16rpx mt-8rpx">
              <text class="text-20rpx text-gray-400">{{ bank.count }}题</text>
              <text class="text-20rpx text-gray-300">|</text>
              <text class="text-20rpx text-gray-400">{{ bank.updateTime }}</text>
            </view>
          </view>
          <wd-icon name="arrow-right" size="32rpx" color="#d1d5db" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const searchValue = ref('')

const subjects = [
  { icon: '📖', name: '语文', count: 520 },
  { icon: '🔢', name: '数学', count: 680 },
  { icon: '🔤', name: '英语', count: 890 },
  { icon: '⚛️', name: '物理', count: 430 },
  { icon: '🧪', name: '化学', count: 350 },
  { icon: '🧬', name: '生物', count: 280 },
  { icon: '📜', name: '历史', count: 410 },
  { icon: '🌍', name: '地理', count: 320 },
]

const bankList = [
  { icon: '🔢', name: '高等数学·微积分', count: 120, updateTime: '更新于今天', bgColor: '#eff6ff' },
  { icon: '🔤', name: '英语四级·听力真题', count: 200, updateTime: '更新于昨天', bgColor: '#f0fdf4' },
  { icon: '⚛️', name: '大学物理·电磁学', count: 85, updateTime: '更新于3天前', bgColor: '#faf5ff' },
  { icon: '🧪', name: '有机化学·基础篇', count: 95, updateTime: '更新于5天前', bgColor: '#fff7ed' },
  { icon: '📖', name: '古代文学·诗词鉴赏', count: 150, updateTime: '更新于1周前', bgColor: '#fef2f2' },
]
</script>

<style scoped lang="scss"></style>
