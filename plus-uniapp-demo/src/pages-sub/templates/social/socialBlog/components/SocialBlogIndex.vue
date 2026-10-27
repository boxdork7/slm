<!-- 社交博客 - 首页/推荐 -->
<template>
  <view class="min-h-100vh bg-gray-50">
    <!-- 搜索栏 -->
    <view class="bg-white px-32rpx pt-16rpx pb-24rpx">
      <wd-search v-model="searchValue" placeholder="搜索文章、作者、标签..." :hide-cancel="true" @search="handleSearch" />
    </view>

    <!-- Tab 切换 -->
    <view class="bg-white">
      <wd-tabs v-model="activeTab" @change="handleTabChange">
        <wd-tab title="推荐" />
        <wd-tab title="热门" />
        <wd-tab title="最新" />
      </wd-tabs>
    </view>

    <scroll-view class="flex-1" scroll-y :show-scrollbar="false">
      <!-- 博客卡片列表 -->
      <view
        v-for="item in blogList"
        :key="item.id"
        class="bg-white mx-24rpx mt-20rpx rounded-2xl p-28rpx"
        @click="handleArticleClick(item)"
      >
        <!-- 作者信息 -->
        <view class="flex items-center mb-20rpx">
          <view class="w-72rpx h-72rpx rounded-full flex items-center justify-center text-[36rpx]" :style="{ background: item.avatarBg }">
            {{ item.emoji }}
          </view>
          <view class="ml-16rpx flex-1">
            <text class="text-[26rpx] font-medium text-gray-800">{{ item.author }}</text>
            <text class="text-[22rpx] text-gray-400 block mt-2rpx">{{ item.time }}</text>
          </view>
          <wd-tag size="small" round :custom-style="`background: ${item.tagBg}; color: ${item.tagColor}; border: none;`">
            {{ item.tag }}
          </wd-tag>
        </view>

        <!-- 标题 + 摘要 -->
        <text class="text-[28rpx] font-bold text-gray-800 block mb-8rpx">{{ item.title }}</text>
        <text class="text-[24rpx] text-gray-500 leading-[36rpx] block mb-20rpx line-clamp-2">{{ item.summary }}</text>

        <!-- 配图 -->
        <wd-img
          v-if="item.cover"
          :src="item.cover"
          width="100%"
          height="280rpx"
          mode="aspectFill"
          round
          custom-style="border-radius: 16rpx; margin-bottom: 20rpx;"
        />

        <!-- 互动数据 -->
        <view class="flex items-center text-[22rpx] text-gray-400">
          <view class="flex items-center mr-40rpx" @click.stop="handleLike(item)">
            <wd-icon name="heart" size="28rpx" color="#f87171" />
            <text class="ml-8rpx">{{ item.likes }}</text>
          </view>
          <view class="flex items-center mr-40rpx">
            <wd-icon name="chat" size="28rpx" color="#9ca3af" />
            <text class="ml-8rpx">{{ item.comments }}</text>
          </view>
          <view class="flex items-center">
            <wd-icon name="share" size="28rpx" color="#9ca3af" />
            <text class="ml-8rpx">{{ item.shares }}</text>
          </view>
        </view>
      </view>

      <!-- 底部间距 -->
      <view class="h-24rpx" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { useToast } from '@/wd'

const toast = useToast()
const searchValue = ref('')
const activeTab = ref(0)

const blogList = ref([
  {
    id: 1,
    author: '林小白',
    emoji: '🧑‍💻',
    avatarBg: '#ede9fe',
    time: '2小时前',
    tag: '前端',
    tagBg: '#f5f3ff',
    tagColor: '#7c3aed',
    title: 'Vue 3.5 新特性解析：更强大的响应式系统',
    summary: 'Vue 3.5 带来了全新的响应式优化，内存占用降低56%，大型应用性能提升显著。本文将深入解析核心变化...',
    cover: 'https://picsum.photos/600/300?random=1',
    likes: 328,
    comments: 56,
    shares: 12,
  },
  {
    id: 2,
    author: '设计小鱼',
    emoji: '👩‍🎨',
    avatarBg: '#fef3c7',
    time: '5小时前',
    tag: '设计',
    tagBg: '#fffbeb',
    tagColor: '#d97706',
    title: '2026 年 UI 设计趋势：AI 驱动的个性化体验',
    summary: '随着 AI 技术的深入，UI 设计正在从静态布局走向动态个性化。每位用户看到的界面都将根据其行为...',
    cover: 'https://picsum.photos/600/300?random=2',
    likes: 215,
    comments: 38,
    shares: 9,
  },
  {
    id: 3,
    author: '后端老王',
    emoji: '🧑‍🔬',
    avatarBg: '#d1fae5',
    time: '昨天',
    tag: '后端',
    tagBg: '#f0fdf4',
    tagColor: '#16a34a',
    title: 'Spring Boot 4.0 实战：虚拟线程让并发更简单',
    summary: '虚拟线程（Project Loom）正式成为 Spring Boot 4.0 的默认线程模型，本文通过真实案例对比传统线程池...',
    cover: '',
    likes: 189,
    comments: 42,
    shares: 7,
  },
  {
    id: 4,
    author: '全栈小美',
    emoji: '👩‍💻',
    avatarBg: '#dbeafe',
    time: '2天前',
    tag: '全栈',
    tagBg: '#eff6ff',
    tagColor: '#2563eb',
    title: '从零搭建企业级 CI/CD 流水线完整指南',
    summary: '手把手带你搭建基于 GitHub Actions + Docker + K8s 的自动化部署流水线...',
    cover: '',
    likes: 156,
    comments: 29,
    shares: 15,
  },
])

const handleSearch = () => toast.info(`搜索: ${searchValue.value}`)
const handleTabChange = ({ index }: { index: number }) => {
  const tabNames = ['推荐', '热门', '最新']
  toast.info(`切换到: ${tabNames[index]}`)
}
const handleArticleClick = (item: { title: string }) => toast.info(item.title)
const handleLike = (item: { likes: number }) => {
  item.likes++
  toast.success('已点赞')
}
</script>

<style lang="scss" scoped>
/* wd-tabs 主色覆盖 */
:deep(.wd-tabs__line) {
  background: #8B5CF6 !important;
}
</style>
