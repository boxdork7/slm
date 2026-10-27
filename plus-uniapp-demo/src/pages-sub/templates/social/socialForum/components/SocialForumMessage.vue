<!-- 社区论坛-消息 -->
<template>
  <view class="forum-message">
    <!-- Tabs 切换 -->
    <wd-tabs v-model="activeTab" custom-class="msg-tabs">
      <wd-tab title="回复我的" name="reply" />
      <wd-tab title="赞和收藏" name="like" />
      <wd-tab title="系统通知" name="system" />
    </wd-tabs>

    <!-- 消息列表 -->
    <view class="message-list">
      <view v-for="msg in currentMessages" :key="msg.id" class="message-card">
        <view class="message-header">
          <text class="msg-avatar">{{ msg.avatar }}</text>
          <view class="msg-info">
            <text class="msg-name">{{ msg.name }}</text>
            <text class="msg-time">{{ msg.time }}</text>
          </view>
        </view>
        <text class="msg-content">{{ msg.content }}</text>
        <!-- 原帖引用 -->
        <view v-if="msg.quote" class="msg-quote">
          <text class="quote-text">{{ msg.quote }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref('reply')

/* 回复消息 mock */
const replyMessages = ref([
  {
    id: 1,
    avatar: '👨‍💻',
    name: '前端小王',
    content: '写得太好了，正好在学这块内容！',
    time: '10分钟前',
    quote: 'Vue3 组合式 API 最佳实践分享',
  },
  {
    id: 2,
    avatar: '🧑‍🎨',
    name: '设计师小美',
    content: '请问有配套的源码仓库吗？',
    time: '30分钟前',
    quote: 'Vue3 组合式 API 最佳实践分享',
  },
  {
    id: 3,
    avatar: '🧳',
    name: '旅行达人',
    content: '图片太美了，下次组队一起去！',
    time: '2小时前',
    quote: '周末去了趟云南，风景太美了！',
  },
  {
    id: 4,
    avatar: '🎮',
    name: '游戏制作人',
    content: '用的什么引擎开发的？',
    time: '5小时前',
    quote: '独立游戏开发心得：从零到上架',
  },
  {
    id: 5,
    avatar: '📖',
    name: '书虫小李',
    content: '这本书我也看过，确实不错！',
    time: '昨天',
    quote: '分享几本今年读过的好书',
  },
])

/* 赞和收藏消息 mock */
const likeMessages = ref([
  {
    id: 11,
    avatar: '❤️',
    name: '匿名用户',
    content: '赞了你的帖子',
    time: '1小时前',
    quote: 'Vue3 组合式 API 最佳实践分享',
  },
  {
    id: 12,
    avatar: '⭐',
    name: '收藏家',
    content: '收藏了你的帖子',
    time: '3小时前',
    quote: '独立游戏开发心得：从零到上架',
  },
])

/* 系统通知 mock */
const systemMessages = ref([
  {
    id: 21,
    avatar: '🔔',
    name: '系统通知',
    content: '你的帖子已被管理员加精',
    time: '1小时前',
    quote: 'Vue3 组合式 API 最佳实践分享',
  },
  {
    id: 22,
    avatar: '📢',
    name: '系统通知',
    content: '社区活动：分享你的开发故事，赢取周边大礼包！',
    time: '昨天',
    quote: null,
  },
])

const currentMessages = computed(() => {
  if (activeTab.value === 'reply') return replyMessages.value
  if (activeTab.value === 'like') return likeMessages.value
  return systemMessages.value
})
</script>

<style scoped lang="scss">
.forum-message {
  min-height: 100vh;
  background: #F3F4F6;
}

:deep(.msg-tabs) {
  background: #fff;
}

.message-list {
  padding: 20rpx 24rpx;
}

.message-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.message-header {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.msg-avatar {
  font-size: 44rpx;
  margin-right: 16rpx;
}

.msg-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.msg-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #1F2937;
}

.msg-time {
  font-size: 22rpx;
  color: #9CA3AF;
  margin-top: 4rpx;
}

.msg-content {
  font-size: 28rpx;
  color: #374151;
  line-height: 1.5;
  margin-bottom: 16rpx;
}

.msg-quote {
  background: #F3F4F6;
  border-radius: 12rpx;
  padding: 16rpx 20rpx;
}

.quote-text {
  font-size: 24rpx;
  color: #6B7280;
}
</style>
