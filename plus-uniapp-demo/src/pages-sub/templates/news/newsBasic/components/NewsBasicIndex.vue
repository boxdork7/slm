<!-- 新闻首页 - 推荐资讯 -->
<template>
  <view class="news-index">
    <!-- 顶部渐变搜索区 -->
    <view class="header-gradient">
      <!-- 装饰圆 -->
      <view class="deco-circle deco-circle-1" />
      <view class="deco-circle deco-circle-2" />
      <view class="deco-circle deco-circle-3" />
      <view class="header-content">
        <view class="header-title">
          <text class="title-text">新闻资讯</text>
          <text class="title-sub">实时热点 尽在掌握</text>
        </view>
        <wd-search
          v-model="searchText"
          placeholder="搜索感兴趣的新闻"
          hide-cancel
          custom-class="news-search"
        />
      </view>
    </view>

    <!-- 频道横向滚动 -->
    <scroll-view scroll-x class="channel-scroll">
      <view class="channel-list">
        <view
          v-for="(ch, idx) in channels"
          :key="idx"
          class="channel-item"
          :class="{ active: currentChannel === idx }"
          @tap="currentChannel = idx"
        >
          <text class="channel-emoji">{{ ch.emoji }}</text>
          <text class="channel-name">{{ ch.name }}</text>
          <view v-if="currentChannel === idx" class="channel-indicator" />
        </view>
      </view>
    </scroll-view>

    <!-- 新闻列表 -->
    <view class="news-list">
      <!-- 第1条：大图新闻 -->
      <view class="news-card news-big" @tap="toast.info('查看新闻详情')">
        <wd-img
          :src="newsList[0].image"
          width="100%"
          height="360rpx"
          mode="aspectFill"
          custom-class="news-big-img"
        />
        <view class="news-big-overlay">
          <wd-tag custom-style="background:#EF4444;color:#fff;border:none;font-size:20rpx;">热点</wd-tag>
          <text class="news-big-title">{{ newsList[0].title }}</text>
          <view class="news-big-meta">
            <text class="meta-source">{{ newsList[0].source }}</text>
            <text class="meta-dot">·</text>
            <text class="meta-comment">{{ newsList[0].comments }}评论</text>
            <text class="meta-dot">·</text>
            <text class="meta-time">{{ newsList[0].time }}</text>
          </view>
        </view>
      </view>

      <!-- 第2-4条：右图新闻 -->
      <view
        v-for="item in newsList.slice(1, 4)"
        :key="item.id"
        class="news-card news-right"
        @tap="toast.info('查看新闻详情')"
      >
        <view class="news-right-content">
          <text class="news-right-title">{{ item.title }}</text>
          <view class="news-right-meta">
            <text class="meta-source">{{ item.source }}</text>
            <text class="meta-dot">·</text>
            <text class="meta-comment">{{ item.comments }}评论</text>
            <text class="meta-dot">·</text>
            <text class="meta-time">{{ item.time }}</text>
          </view>
        </view>
        <wd-img
          :src="item.image"
          width="200rpx"
          height="140rpx"
          mode="aspectFill"
          custom-class="news-right-img"
        />
      </view>

      <!-- 第5条：三图新闻 -->
      <view class="news-card news-three" @tap="toast.info('查看新闻详情')">
        <text class="news-three-title">{{ newsList[4].title }}</text>
        <view class="news-three-images">
          <wd-img
            v-for="(img, i) in newsList[4].images"
            :key="i"
            :src="img"
            width="218rpx"
            height="150rpx"
            mode="aspectFill"
            custom-class="news-three-img"
          />
        </view>
        <view class="news-right-meta">
          <text class="meta-source">{{ newsList[4].source }}</text>
          <text class="meta-dot">·</text>
          <text class="meta-comment">{{ newsList[4].comments }}评论</text>
          <text class="meta-dot">·</text>
          <text class="meta-time">{{ newsList[4].time }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/wd'

const toast = useToast()
const searchText = ref('')
const currentChannel = ref(0)

const channels = [
  { name: '推荐', emoji: '🔥' },
  { name: '热点', emoji: '⚡' },
  { name: '科技', emoji: '💻' },
  { name: '财经', emoji: '💰' },
  { name: '体育', emoji: '⚽' },
  { name: '娱乐', emoji: '🎭' },
  { name: '军事', emoji: '🎖️' },
  { name: '国际', emoji: '🌍' },
]

const newsList = [
  {
    id: 1,
    title: '2026年全球科技峰会在深圳召开，聚焦人工智能与绿色能源',
    source: '新华社',
    comments: 2384,
    time: '15分钟前',
    image: 'https://picsum.photos/750/400?random=101',
  },
  {
    id: 2,
    title: '央行宣布下调存款准备金率0.5个百分点，释放长期资金约1万亿元',
    source: '财经日报',
    comments: 1056,
    time: '32分钟前',
    image: 'https://picsum.photos/300/200?random=102',
  },
  {
    id: 3,
    title: '国产大飞机C929完成首次商业试飞，载客量达350人',
    source: '中国航空报',
    comments: 879,
    time: '1小时前',
    image: 'https://picsum.photos/300/200?random=103',
  },
  {
    id: 4,
    title: '教育部：2026年高考改革方案正式发布，新增AI素养科目',
    source: '教育时报',
    comments: 3201,
    time: '2小时前',
    image: 'https://picsum.photos/300/200?random=104',
  },
  {
    id: 5,
    title: '世界杯亚洲区预选赛：中国队3-1战胜日本队晋级决赛圈',
    source: '体育周刊',
    comments: 5672,
    time: '3小时前',
    images: [
      'https://picsum.photos/300/200?random=105',
      'https://picsum.photos/300/200?random=106',
      'https://picsum.photos/300/200?random=107',
    ],
    image: 'https://picsum.photos/300/200?random=105',
  },
]
</script>

<style scoped lang="scss">
.news-index {
  min-height: 100vh;
  background: #f5f5f5;
}

/* 顶部渐变区域 */
.header-gradient {
  position: relative;
  background: linear-gradient(135deg, #EF4444, #DC2626);
  padding: 32rpx 32rpx 40rpx;
  overflow: hidden;
}

.deco-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.deco-circle-1 {
  width: 200rpx;
  height: 200rpx;
  top: -60rpx;
  right: -40rpx;
}

.deco-circle-2 {
  width: 140rpx;
  height: 140rpx;
  top: 40rpx;
  right: 120rpx;
}

.deco-circle-3 {
  width: 100rpx;
  height: 100rpx;
  bottom: -20rpx;
  left: 60rpx;
}

.header-content {
  position: relative;
  z-index: 1;
}

.header-title {
  display: flex;
  flex-direction: column;
  margin-bottom: 24rpx;
}

.title-text {
  font-size: 40rpx;
  font-weight: 700;
  color: #fff;
}

.title-sub {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 8rpx;
}

/* 去掉搜索框白色背景 */
:deep(.news-search) {
  .wd-search__block {
    background: rgba(255, 255, 255, 0.2) !important;
  }

  .wd-search__input {
    color: #fff !important;
  }

  .wd-search__block .wd-icon {
    color: rgba(255, 255, 255, 0.8) !important;
  }
}

/* 频道横向滚动 */
.channel-scroll {
  white-space: nowrap;
  background: #fff;
  padding: 20rpx 0;
}

.channel-list {
  display: inline-flex;
  padding: 0 24rpx;
}

.channel-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  margin-right: 40rpx;
  position: relative;
  padding-bottom: 12rpx;
}

.channel-emoji {
  font-size: 36rpx;
  margin-bottom: 8rpx;
}

.channel-name {
  font-size: 26rpx;
  color: #666;
}

.channel-item.active .channel-name {
  color: #EF4444;
  font-weight: 600;
}

.channel-indicator {
  position: absolute;
  bottom: 0;
  width: 40rpx;
  height: 4rpx;
  background: #EF4444;
  border-radius: 2rpx;
}

/* 新闻列表 */
.news-list {
  padding: 20rpx 24rpx;
}

.news-card {
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}

/* 大图新闻 */
.news-big {
  position: relative;
}

.news-big-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24rpx;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.news-big-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #fff;
  line-height: 1.4;
}

.news-big-meta {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.news-big-meta .meta-source,
.news-big-meta .meta-comment,
.news-big-meta .meta-time {
  color: rgba(255, 255, 255, 0.8);
  font-size: 22rpx;
}

.news-big-meta .meta-dot {
  color: rgba(255, 255, 255, 0.5);
  font-size: 22rpx;
}

/* 右图新闻 */
.news-right {
  display: flex;
  padding: 24rpx;
  gap: 20rpx;
}

.news-right-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.news-right-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #1a1a1a;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-right-meta {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-top: 16rpx;
}

.meta-source {
  color: #EF4444;
  font-size: 22rpx;
  font-weight: 500;
}

.meta-comment,
.meta-time {
  color: #999;
  font-size: 22rpx;
}

.meta-dot {
  color: #ccc;
  font-size: 22rpx;
}

:deep(.news-right-img) {
  border-radius: 12rpx;
  overflow: hidden;
  flex-shrink: 0;
}

/* 三图新闻 */
.news-three {
  padding: 24rpx;
}

.news-three-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #1a1a1a;
  line-height: 1.5;
  margin-bottom: 16rpx;
}

.news-three-images {
  display: flex;
  gap: 12rpx;
  margin-bottom: 16rpx;
}

:deep(.news-three-img) {
  border-radius: 8rpx;
  overflow: hidden;
}

:deep(.news-big-img) {
  display: block;
}
</style>
