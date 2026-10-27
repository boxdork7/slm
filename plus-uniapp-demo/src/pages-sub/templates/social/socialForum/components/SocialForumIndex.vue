<!-- 社区论坛-首页 -->
<template>
  <view class="forum-index">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <wd-search
        v-model="searchText"
        placeholder="搜索帖子..."
        custom-class="forum-search"
        hide-cancel
      />
    </view>

    <!-- 热门板块横向滚动 -->
    <view class="section-title">
      <text class="title-text">热门板块</text>
    </view>
    <scroll-view scroll-x class="boards-scroll">
      <view class="boards-list">
        <view
          v-for="board in boards"
          :key="board.name"
          class="board-item"
          @tap="currentBoard = board.name"
        >
          <text class="board-emoji">{{ board.emoji }}</text>
          <text class="board-name">{{ board.name }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 筛选 Tabs -->
    <wd-tabs v-model="activeTab" custom-class="filter-tabs">
      <wd-tab title="最新" name="latest" />
      <wd-tab title="最热" name="hot" />
      <wd-tab title="精华" name="elite" />
    </wd-tabs>

    <!-- 帖子列表 -->
    <view class="post-list">
      <view v-for="post in posts" :key="post.id" class="post-card">
        <view class="post-header">
          <view class="post-title-row">
            <wd-tag
              v-if="post.isTop"
              custom-style="background: #EF4444; color: #fff; margin-right: 8rpx;"
            >
              置顶
            </wd-tag>
            <text class="post-title">{{ post.title }}</text>
          </view>
        </view>
        <view class="post-meta">
          <view class="post-author">
            <text class="author-emoji">{{ post.authorEmoji }}</text>
            <text class="author-name">{{ post.author }}</text>
          </view>
          <wd-tag
            custom-style="background: #E0F2FE; color: #0891B2; font-size: 20rpx;"
          >
            {{ post.board }}
          </wd-tag>
        </view>
        <view class="post-stats">
          <view class="stat-item">
            <wd-icon name="chat" size="28rpx" color="#9CA3AF" />
            <text class="stat-text">{{ post.replies }}</text>
          </view>
          <view class="stat-item">
            <wd-icon name="eye-on" size="28rpx" color="#9CA3AF" />
            <text class="stat-text">{{ post.views }}</text>
          </view>
          <text class="post-time">{{ post.time }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const searchText = ref('')
const activeTab = ref('latest')
const currentBoard = ref('')

/* 热门板块 */
const boards = ref([
  { name: '技术', emoji: '💻' },
  { name: '生活', emoji: '🌟' },
  { name: '影视', emoji: '🎬' },
  { name: '游戏', emoji: '🎮' },
  { name: '读书', emoji: '📚' },
  { name: '旅行', emoji: '✈️' },
])

/* 帖子列表 mock 数据 */
const posts = ref([
  {
    id: 1,
    title: 'Vue3 组合式 API 最佳实践分享',
    author: '前端小王',
    authorEmoji: '👨‍💻',
    board: '技术',
    replies: 128,
    views: 3560,
    time: '2小时前',
    isTop: true,
  },
  {
    id: 2,
    title: '周末去了趟云南，风景太美了！',
    author: '旅行达人',
    authorEmoji: '🧳',
    board: '旅行',
    replies: 86,
    views: 2140,
    time: '5小时前',
    isTop: false,
  },
  {
    id: 3,
    title: '最近在追的一部电影，强烈推荐',
    author: '影迷老张',
    authorEmoji: '🎥',
    board: '影视',
    replies: 52,
    views: 1890,
    time: '昨天',
    isTop: false,
  },
  {
    id: 4,
    title: '独立游戏开发心得：从零到上架',
    author: '游戏制作人',
    authorEmoji: '🎮',
    board: '游戏',
    replies: 67,
    views: 2350,
    time: '昨天',
    isTop: false,
  },
  {
    id: 5,
    title: '分享几本今年读过的好书',
    author: '书虫小李',
    authorEmoji: '📖',
    board: '读书',
    replies: 34,
    views: 980,
    time: '3天前',
    isTop: false,
  },
])
</script>

<style scoped lang="scss">
.forum-index {
  min-height: 100vh;
  background: #F3F4F6;
}

.search-bar {
  padding: 20rpx 24rpx;
  background: linear-gradient(135deg, #0891B2, #14B8A6);
}

/* 去掉搜索框在渐变背景上的白色底 */
:deep(.forum-search) {
  background: rgba(255, 255, 255, 0.2) !important;
  border-radius: 16rpx;
}

:deep(.forum-search .wd-search__block) {
  background: rgba(255, 255, 255, 0.9) !important;
  border-radius: 16rpx;
}

.section-title {
  padding: 24rpx 24rpx 12rpx;
}

.title-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #1F2937;
}

.boards-scroll {
  white-space: nowrap;
  padding: 0 24rpx 20rpx;
}

.boards-list {
  display: inline-flex;
  gap: 20rpx;
}

.board-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 140rpx;
  height: 140rpx;
  background: #fff;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
}

.board-emoji {
  font-size: 48rpx;
  margin-bottom: 8rpx;
}

.board-name {
  font-size: 24rpx;
  color: #374151;
}

:deep(.filter-tabs) {
  background: #fff;
  margin: 0 24rpx;
  border-radius: 16rpx;
}

.post-list {
  padding: 20rpx 24rpx;
}

.post-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.post-header {
  margin-bottom: 16rpx;
}

.post-title-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.post-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #1F2937;
  line-height: 1.4;
}

.post-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.author-emoji {
  font-size: 32rpx;
}

.author-name {
  font-size: 24rpx;
  color: #6B7280;
}

.post-stats {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.stat-text {
  font-size: 22rpx;
  color: #9CA3AF;
}

.post-time {
  font-size: 22rpx;
  color: #9CA3AF;
  margin-left: auto;
}
</style>
