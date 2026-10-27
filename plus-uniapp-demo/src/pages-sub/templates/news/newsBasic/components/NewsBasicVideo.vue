<!-- 新闻视频 -->
<template>
  <view class="news-video">
    <!-- 顶部 Tab -->
    <wd-tabs v-model="currentTab" custom-class="video-tabs">
      <wd-tab title="推荐" name="recommend" />
      <wd-tab title="热播" name="hot" />
      <wd-tab title="关注" name="follow" />
    </wd-tabs>

    <!-- 视频列表 -->
    <view class="video-list">
      <view
        v-for="item in videoList"
        :key="item.id"
        class="video-card"
        @tap="toast.info('播放视频')"
      >
        <!-- 封面区域 -->
        <view class="video-cover-wrap">
          <wd-img
            :src="item.cover"
            width="100%"
            height="400rpx"
            mode="aspectFill"
            custom-class="video-cover"
          />
          <!-- 播放图标 -->
          <view class="play-icon">
            <wd-icon name="play-circle-fill" size="80rpx" color="rgba(255,255,255,0.9)" />
          </view>
          <!-- 时长标签 -->
          <view class="duration-tag">
            <text class="duration-text">{{ item.duration }}</text>
          </view>
        </view>
        <!-- 视频信息 -->
        <view class="video-info">
          <text class="video-title">{{ item.title }}</text>
          <view class="video-meta">
            <view class="meta-author">
              <text class="author-avatar">{{ item.authorAvatar }}</text>
              <text class="author-name">{{ item.author }}</text>
            </view>
            <view class="meta-plays">
              <wd-icon name="view" size="24rpx" color="#999" />
              <text class="plays-count">{{ item.plays }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/wd'

const toast = useToast()
const currentTab = ref('recommend')

const videoList = [
  {
    id: 1,
    title: '探秘深海一万米：中国载人深潜器"奋斗者"号最新科考成果',
    cover: 'https://picsum.photos/750/420?random=201',
    duration: '05:32',
    author: '央视新闻',
    authorAvatar: '📺',
    plays: '128.5万',
  },
  {
    id: 2,
    title: '全球首款飞行汽车量产下线，售价不到200万元',
    cover: 'https://picsum.photos/750/420?random=202',
    duration: '03:18',
    author: '科技前沿',
    authorAvatar: '🚀',
    plays: '86.3万',
  },
  {
    id: 3,
    title: 'AI画家VS真人画家：一场颠覆认知的艺术挑战赛',
    cover: 'https://picsum.photos/750/420?random=203',
    duration: '08:45',
    author: '文化观察',
    authorAvatar: '🎨',
    plays: '52.1万',
  },
  {
    id: 4,
    title: '极地冰川加速消融实录：北极熊的最后家园',
    cover: 'https://picsum.photos/750/420?random=204',
    duration: '12:06',
    author: '自然纪录',
    authorAvatar: '🌍',
    plays: '95.7万',
  },
]
</script>

<style scoped lang="scss">
.news-video {
  min-height: 100vh;
  background: #f5f5f5;
}

/* Tab 样式 */
:deep(.video-tabs) {
  .wd-tabs__nav {
    background: #fff;
  }

  .wd-tabs__line {
    background: #EF4444 !important;
  }
}

/* 视频列表 */
.video-list {
  padding: 20rpx 24rpx;
}

.video-card {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 24rpx;
}

/* 封面区域 */
.video-cover-wrap {
  position: relative;
}

:deep(.video-cover) {
  display: block;
}

.play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.duration-tag {
  position: absolute;
  bottom: 16rpx;
  right: 16rpx;
  background: rgba(0, 0, 0, 0.7);
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
}

.duration-text {
  font-size: 22rpx;
  color: #fff;
}

/* 视频信息 */
.video-info {
  padding: 20rpx 24rpx;
}

.video-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #1a1a1a;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.video-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16rpx;
}

.meta-author {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.author-avatar {
  font-size: 32rpx;
}

.author-name {
  font-size: 24rpx;
  color: #666;
}

.meta-plays {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.plays-count {
  font-size: 22rpx;
  color: #999;
}
</style>
