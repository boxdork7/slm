<!-- 社交博客 - 我的 -->
<template>
  <view class="min-h-100vh bg-gray-50">
    <scroll-view class="h-full" scroll-y :show-scrollbar="false">
      <!-- 紫色渐变头部 -->
      <view class="bg-gradient-to-br from-violet-500 to-purple-400 px-32rpx pb-80rpx pt-32rpx">
        <view class="flex items-center justify-between mb-48rpx">
          <text class="text-white/80 text-sm">我的</text>
          <wd-icon name="setting" size="40rpx" color="rgba(255,255,255,0.8)" @click="handleSettings" />
        </view>
        <view class="flex items-center">
          <view class="w-128rpx h-128rpx rounded-full bg-white/20 border-4rpx border-white/50 flex items-center justify-center">
            <text class="text-[56rpx]">🧑‍💻</text>
          </view>
          <view class="ml-24rpx flex-1">
            <text class="text-white font-bold text-[32rpx] block">张三丰</text>
            <text class="text-white/70 text-[22rpx] mt-8rpx block">全栈开发者 | 技术博主</text>
          </view>
          <wd-tag size="small" round custom-style="background: rgba(250,204,21,0.9); color: #713f12; border: none;">
            ✨ 创作者
          </wd-tag>
        </view>
      </view>

      <!-- 数据卡片 -->
      <view class="mx-32rpx -mt-48rpx bg-white rounded-2xl p-36rpx shadow-sm">
        <view class="grid grid-cols-3 divide-x divide-gray-100">
          <view class="flex flex-col items-center" @click="handleStatClick('粉丝')">
            <text class="text-[36rpx] font-bold text-gray-800">1,286</text>
            <text class="text-[22rpx] text-gray-500 mt-8rpx">粉丝</text>
          </view>
          <view class="flex flex-col items-center" @click="handleStatClick('关注')">
            <text class="text-[36rpx] font-bold text-gray-800">328</text>
            <text class="text-[22rpx] text-gray-500 mt-8rpx">关注</text>
          </view>
          <view class="flex flex-col items-center" @click="handleStatClick('获赞')">
            <text class="text-[36rpx] font-bold text-violet-500">5,692</text>
            <text class="text-[22rpx] text-gray-500 mt-8rpx">获赞</text>
          </view>
        </view>
      </view>

      <!-- 我的文章 -->
      <view class="mx-32rpx mt-24rpx bg-white rounded-2xl overflow-hidden">
        <view class="px-32rpx pt-32rpx pb-16rpx flex items-center justify-between">
          <text class="font-bold text-[30rpx]">我的文章</text>
          <text class="text-[24rpx] text-violet-500" @click="handleViewAllArticles">查看全部</text>
        </view>
        <view
          v-for="(article, index) in articleList"
          :key="article.id"
          class="px-32rpx py-24rpx"
          :class="index < articleList.length - 1 ? 'border-b border-gray-50' : ''"
          @click="handleArticleClick(article)"
        >
          <text class="text-[26rpx] font-medium text-gray-800 line-clamp-1 block">{{ article.title }}</text>
          <view class="flex items-center text-[22rpx] text-gray-400 mt-12rpx">
            <wd-icon name="view" size="24rpx" color="#9ca3af" />
            <text class="ml-6rpx mr-24rpx">{{ article.views }}</text>
            <wd-icon name="heart" size="24rpx" color="#9ca3af" />
            <text class="ml-6rpx mr-24rpx">{{ article.likes }}</text>
            <text>{{ article.time }}</text>
          </view>
        </view>
      </view>

      <!-- 更多功能 -->
      <view class="mx-32rpx mt-24rpx bg-white rounded-2xl overflow-hidden">
        <view class="px-32rpx pt-32rpx pb-16rpx">
          <text class="font-bold text-[30rpx]">更多功能</text>
        </view>
        <view
          v-for="(item, index) in featureList"
          :key="item.title"
          class="flex items-center justify-between px-32rpx py-28rpx"
          :class="index < featureList.length - 1 ? 'border-b border-gray-50' : ''"
          @click="handleFeature(item.title)"
        >
          <view class="flex items-center">
            <view
              class="w-64rpx h-64rpx rounded-xl flex items-center justify-center"
              :style="{ background: item.bgColor }"
            >
              <wd-icon :name="item.icon" size="32rpx" :color="item.iconColor" />
            </view>
            <text class="text-[26rpx] text-gray-700 ml-24rpx">{{ item.title }}</text>
          </view>
          <wd-icon name="arrow-right" size="32rpx" color="#d1d5db" />
        </view>
      </view>

      <!-- 退出登录 -->
      <view class="mx-32rpx mt-24rpx mb-32rpx">
        <wd-button type="error" block plain @click="handleLogout">退出登录</wd-button>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { useToast } from '@/wd'

const toast = useToast()

const articleList = ref([
  { id: 1, title: 'Vue 3 组合式 API 最佳实践总结', views: '2,350', likes: '186', time: '3天前' },
  { id: 2, title: 'TypeScript 高级类型体操指南', views: '1,890', likes: '142', time: '1周前' },
  { id: 3, title: '从零构建微前端架构实战经验', views: '3,120', likes: '258', time: '2周前' },
])

const featureList = ref([
  { title: '我的收藏', icon: 'star', iconColor: '#8B5CF6', bgColor: '#f5f3ff' },
  { title: '浏览历史', icon: 'clock', iconColor: '#ef4444', bgColor: '#fef2f2' },
  { title: '数据中心', icon: 'chart', iconColor: '#22c55e', bgColor: '#f0fdf4' },
  { title: '意见反馈', icon: 'chat', iconColor: '#f59e0b', bgColor: '#fffbeb' },
  { title: '关于我们', icon: 'info', iconColor: '#06b6d4', bgColor: '#ecfeff' },
])

const handleSettings = () => toast.info('设置')
const handleStatClick = (label: string) => toast.info(label)
const handleViewAllArticles = () => toast.info('查看全部文章')
const handleArticleClick = (article: { title: string }) => toast.info(article.title)
const handleFeature = (title: string) => toast.info(title)
const handleLogout = () => toast.info('退出登录')
</script>

<style lang="scss" scoped></style>
