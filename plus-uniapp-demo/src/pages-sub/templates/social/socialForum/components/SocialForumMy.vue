<!-- 社区论坛-我的 -->
<template>
  <view class="forum-my">
    <!-- 青色渐变头部 -->
    <view class="header-gradient">
      <!-- 装饰圆 -->
      <view class="deco-circle deco-circle-1" />
      <view class="deco-circle deco-circle-2" />
      <view class="deco-circle deco-circle-3" />

      <!-- 用户信息 -->
      <view class="user-info">
        <text class="user-avatar">😎</text>
        <view class="user-detail">
          <view class="user-name-row">
            <text class="user-name">论坛小达人</text>
            <wd-tag custom-style="background: #FEF3C7; color: #D97706; font-size: 20rpx; margin-left: 12rpx;">
              论坛达人
            </wd-tag>
          </view>
          <text class="user-bio">热爱技术，喜欢分享，期待与大家交流~</text>
        </view>
      </view>
    </view>

    <!-- 数据卡片 -->
    <view class="stats-card">
      <view class="stat-item">
        <text class="stat-value">56</text>
        <text class="stat-label">帖子</text>
      </view>
      <view class="stat-divider" />
      <view class="stat-item">
        <text class="stat-value">238</text>
        <text class="stat-label">回复</text>
      </view>
      <view class="stat-divider" />
      <view class="stat-item">
        <text class="stat-value">1.2k</text>
        <text class="stat-label">被赞</text>
      </view>
    </view>

    <!-- 我的帖子 -->
    <view class="section">
      <text class="section-title">我的帖子</text>
      <view v-for="post in myPosts" :key="post.id" class="my-post-card">
        <text class="my-post-title">{{ post.title }}</text>
        <view class="my-post-meta">
          <wd-tag
            custom-style="background: #E0F2FE; color: #0891B2; font-size: 20rpx;"
          >
            {{ post.board }}
          </wd-tag>
          <view class="my-post-stats">
            <view class="mini-stat">
              <wd-icon name="chat" size="24rpx" color="#9CA3AF" />
              <text class="mini-stat-text">{{ post.replies }}</text>
            </view>
            <view class="mini-stat">
              <wd-icon name="thumb-up" size="24rpx" color="#9CA3AF" />
              <text class="mini-stat-text">{{ post.likes }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 更多功能 -->
    <view class="section">
      <text class="section-title">更多功能</text>
      <view class="func-list">
        <view v-for="func in funcList" :key="func.label" class="func-item">
          <view class="func-icon-wrap" :style="{ background: func.bgColor }">
            <wd-icon :name="func.icon" size="36rpx" color="#fff" />
          </view>
          <text class="func-label">{{ func.label }}</text>
          <wd-icon name="arrow-right" size="32rpx" color="#D1D5DB" custom-class="func-arrow" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

/* 我的帖子 mock */
const myPosts = ref([
  { id: 1, title: 'Vue3 组合式 API 最佳实践分享', board: '技术', replies: 128, likes: 356 },
  { id: 2, title: '独立游戏开发心得：从零到上架', board: '游戏', replies: 67, likes: 198 },
  { id: 3, title: '分享几本今年读过的好书', board: '读书', replies: 34, likes: 89 },
])

/* 更多功能列表 */
const funcList = ref([
  { label: '我的收藏', icon: 'star-on', bgColor: '#8B5CF6' },
  { label: '我的草稿', icon: 'edit', bgColor: '#F97316' },
  { label: '浏览历史', icon: 'clock', bgColor: '#3B82F6' },
  { label: '我的关注', icon: 'heart-fill', bgColor: '#10B981' },
  { label: '我的徽章', icon: 'crown', bgColor: '#EAB308' },
  { label: '设置', icon: 'setting', bgColor: '#6B7280' },
  { label: '帮助', icon: 'help-circle', bgColor: '#0891B2' },
])
</script>

<style scoped lang="scss">
.forum-my {
  min-height: 100vh;
  background: #F3F4F6;
}

/* 渐变头部 */
.header-gradient {
  background: linear-gradient(135deg, #0891B2, #14B8A6);
  padding: 80rpx 32rpx 80rpx;
  position: relative;
  overflow: hidden;
}

/* 装饰半透明圆 */
.deco-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.deco-circle-1 {
  width: 200rpx;
  height: 200rpx;
  top: -40rpx;
  right: -40rpx;
}

.deco-circle-2 {
  width: 140rpx;
  height: 140rpx;
  bottom: -20rpx;
  left: 60rpx;
}

.deco-circle-3 {
  width: 100rpx;
  height: 100rpx;
  top: 40rpx;
  left: -20rpx;
}

.user-info {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
}

.user-avatar {
  font-size: 80rpx;
  margin-right: 24rpx;
}

.user-detail {
  flex: 1;
}

.user-name-row {
  display: flex;
  align-items: center;
  margin-bottom: 8rpx;
}

.user-name {
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
}

.user-bio {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

/* 数据卡片 */
.stats-card {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  margin: -48rpx 24rpx 0;
  border-radius: 20rpx;
  padding: 32rpx 0;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 2;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 40rpx;
  font-weight: 700;
  color: #0891B2;
}

.stat-label {
  font-size: 24rpx;
  color: #6B7280;
  margin-top: 8rpx;
}

.stat-divider {
  width: 2rpx;
  height: 48rpx;
  background: #E5E7EB;
}

/* 区块 */
.section {
  padding: 24rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 20rpx;
  display: block;
}

/* 我的帖子卡片 */
.my-post-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.my-post-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 12rpx;
  display: block;
}

.my-post-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.my-post-stats {
  display: flex;
  gap: 20rpx;
}

.mini-stat {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.mini-stat-text {
  font-size: 22rpx;
  color: #9CA3AF;
}

/* 功能列表 */
.func-list {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.func-item {
  display: flex;
  align-items: center;
  padding: 28rpx 24rpx;
  border-bottom: 1rpx solid #F3F4F6;
}

.func-item:last-child {
  border-bottom: none;
}

.func-icon-wrap {
  width: 64rpx;
  height: 64rpx;
  border-radius: 14rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.func-label {
  flex: 1;
  font-size: 28rpx;
  color: #374151;
}

:deep(.func-arrow) {
  flex-shrink: 0;
}
</style>
