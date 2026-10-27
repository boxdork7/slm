<!-- 新闻我的 -->
<template>
  <view class="news-my">
    <!-- 红色渐变头部 -->
    <view class="my-header">
      <!-- 装饰圆 -->
      <view class="deco-circle deco-circle-1" />
      <view class="deco-circle deco-circle-2" />
      <view class="deco-circle deco-circle-3" />
      <view class="header-content">
        <view class="user-info">
          <text class="user-avatar">📰</text>
          <view class="user-detail">
            <text class="user-name">新闻达人</text>
            <text class="user-bio">关注时事，洞察世界</text>
          </view>
        </view>
        <wd-tag custom-style="background:rgba(255,215,0,0.2);color:#FFD700;border:1rpx solid rgba(255,215,0,0.4);font-size:22rpx;padding:4rpx 16rpx;">
          🏅 新闻达人
        </wd-tag>
      </view>
    </view>

    <!-- 数据统计卡片 -->
    <view class="stats-card">
      <view class="stat-item" @tap="toast.info('查看关注')">
        <text class="stat-num">128</text>
        <text class="stat-label">关注</text>
      </view>
      <view class="stat-divider" />
      <view class="stat-item" @tap="toast.info('查看粉丝')">
        <text class="stat-num">3.2万</text>
        <text class="stat-label">粉丝</text>
      </view>
      <view class="stat-divider" />
      <view class="stat-item" @tap="toast.info('查看阅读')">
        <text class="stat-num">56.8万</text>
        <text class="stat-label">阅读</text>
      </view>
    </view>

    <!-- 功能入口宫格 -->
    <view class="func-grid">
      <view
        v-for="item in gridItems"
        :key="item.label"
        class="func-grid-item"
        @tap="toast.info(item.label)"
      >
        <text class="func-grid-emoji">{{ item.emoji }}</text>
        <text class="func-grid-label">{{ item.label }}</text>
      </view>
    </view>

    <!-- 更多功能列表 -->
    <view class="func-list">
      <view
        v-for="item in menuItems"
        :key="item.label"
        class="func-list-item"
        @tap="toast.info(item.label)"
      >
        <view class="func-list-left">
          <view class="func-icon-bg" :style="{ background: item.bg }">
            <wd-icon :name="item.icon" size="32rpx" color="#fff" />
          </view>
          <text class="func-list-label">{{ item.label }}</text>
        </view>
        <wd-icon name="arrow-right" size="28rpx" color="#ccc" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useToast } from '@/wd'

const toast = useToast()

const gridItems = [
  { emoji: '⭐', label: '收藏' },
  { emoji: '🕐', label: '历史' },
  { emoji: '📥', label: '下载' },
  { emoji: '🌙', label: '夜间模式' },
]

const menuItems = [
  { icon: 'chat', label: '我的评论', bg: '#3B82F6' },
  { icon: 'bell', label: '消息通知', bg: '#F97316' },
  { icon: 'warn-bold', label: '反馈建议', bg: '#22C55E' },
  { icon: 'setting', label: '设置', bg: '#9CA3AF' },
  { icon: 'info-bold', label: '关于', bg: '#06B6D4' },
]
</script>

<style scoped lang="scss">
.news-my {
  min-height: 100vh;
  background: #f5f5f5;
}

/* 红色渐变头部 */
.my-header {
  position: relative;
  background: linear-gradient(135deg, #EF4444, #F43F5E);
  padding: 48rpx 32rpx 80rpx;
  overflow: hidden;
}

.deco-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.deco-circle-1 {
  width: 240rpx;
  height: 240rpx;
  top: -80rpx;
  right: -60rpx;
}

.deco-circle-2 {
  width: 160rpx;
  height: 160rpx;
  top: 60rpx;
  right: 160rpx;
}

.deco-circle-3 {
  width: 120rpx;
  height: 120rpx;
  bottom: -30rpx;
  left: 40rpx;
}

.header-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.user-avatar {
  font-size: 80rpx;
}

.user-detail {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
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

/* 数据统计卡片 */
.stats-card {
  margin: -48rpx 32rpx 24rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
  position: relative;
  z-index: 2;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.stat-num {
  font-size: 36rpx;
  font-weight: 700;
  color: #1a1a1a;
}

.stat-label {
  font-size: 24rpx;
  color: #999;
}

.stat-divider {
  width: 1rpx;
  height: 60rpx;
  background: #f0f0f0;
}

/* 功能入口宫格 */
.func-grid {
  margin: 0 32rpx 24rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 32rpx;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24rpx;
}

.func-grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.func-grid-emoji {
  font-size: 48rpx;
}

.func-grid-label {
  font-size: 24rpx;
  color: #666;
}

/* 更多功能列表 */
.func-list {
  margin: 0 32rpx 32rpx;
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
}

.func-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 32rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.func-list-item:last-child {
  border-bottom: none;
}

.func-list-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.func-icon-bg {
  width: 56rpx;
  height: 56rpx;
  border-radius: 14rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.func-list-label {
  font-size: 28rpx;
  color: #333;
}
</style>
