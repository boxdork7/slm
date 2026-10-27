<!-- 短视频 - 发现 -->
<template>
  <view class="min-h-screen bg-#f5f5f5">
    <!-- 搜索栏 -->
    <view class="bg-white px-32rpx pt-16rpx pb-24rpx">
      <view class="bg-#f3f4f6 rounded-full px-32rpx py-20rpx flex items-center gap-16rpx">
        <wd-icon name="search" color="#9ca3af" size="32rpx" />
        <text class="text-#9ca3af text-28rpx">搜索你感兴趣的内容</text>
      </view>
    </view>

    <!-- 热门话题 -->
    <view class="bg-white px-32rpx py-24rpx mt-16rpx">
      <view class="flex justify-between items-center mb-24rpx">
        <text class="text-32rpx font-700 text-#1f2937">🔥 热门话题</text>
        <text class="text-24rpx text-#9ca3af">换一批</text>
      </view>
      <scroll-view scroll-x class="whitespace-nowrap">
        <view class="flex gap-16rpx">
          <wd-tag
            v-for="topic in hotTopics"
            :key="topic.name"
            :custom-style="topic.style"
          >
            {{ topic.name }}
          </wd-tag>
        </view>
      </scroll-view>
    </view>

    <!-- 推荐视频网格（瀑布流） -->
    <view class="px-16rpx mt-16rpx">
      <view class="flex gap-12rpx">
        <!-- 左列 -->
        <view class="flex-1 flex flex-col gap-12rpx">
          <view
            v-for="item in leftColumn"
            :key="item.title"
            class="rounded-16rpx overflow-hidden bg-white"
          >
            <view
              class="relative flex items-center justify-center"
              :style="{ height: item.height, background: item.bg }"
            >
              <text class="text-96rpx">{{ item.emoji }}</text>
              <view class="absolute bottom-16rpx left-16rpx flex items-center gap-8rpx">
                <wd-icon name="play-fill" color="white" size="24rpx" />
                <text class="text-white text-20rpx">{{ item.plays }}</text>
              </view>
            </view>
            <view class="p-16rpx">
              <text class="text-24rpx text-#1f2937 font-500 leading-tight line-clamp-2 block">{{ item.title }}</text>
              <view class="flex items-center justify-between mt-12rpx">
                <view class="flex items-center gap-8rpx">
                  <view class="w-32rpx h-32rpx rounded-full bg-#e5e7eb flex items-center justify-center">
                    <text class="text-16rpx">{{ item.avatar }}</text>
                  </view>
                  <text class="text-20rpx text-#9ca3af">{{ item.author }}</text>
                </view>
                <view class="flex items-center gap-4rpx">
                  <wd-icon name="heart" color="#9ca3af" size="24rpx" />
                  <text class="text-20rpx text-#9ca3af">{{ item.likes }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
        <!-- 右列 -->
        <view class="flex-1 flex flex-col gap-12rpx">
          <view
            v-for="item in rightColumn"
            :key="item.title"
            class="rounded-16rpx overflow-hidden bg-white"
          >
            <view
              class="relative flex items-center justify-center"
              :style="{ height: item.height, background: item.bg }"
            >
              <text class="text-96rpx">{{ item.emoji }}</text>
              <view class="absolute bottom-16rpx left-16rpx flex items-center gap-8rpx">
                <wd-icon name="play-fill" color="white" size="24rpx" />
                <text class="text-white text-20rpx">{{ item.plays }}</text>
              </view>
            </view>
            <view class="p-16rpx">
              <text class="text-24rpx text-#1f2937 font-500 leading-tight line-clamp-2 block">{{ item.title }}</text>
              <view class="flex items-center justify-between mt-12rpx">
                <view class="flex items-center gap-8rpx">
                  <view class="w-32rpx h-32rpx rounded-full bg-#e5e7eb flex items-center justify-center">
                    <text class="text-16rpx">{{ item.avatar }}</text>
                  </view>
                  <text class="text-20rpx text-#9ca3af">{{ item.author }}</text>
                </view>
                <view class="flex items-center gap-4rpx">
                  <wd-icon name="heart" color="#9ca3af" size="24rpx" />
                  <text class="text-20rpx text-#9ca3af">{{ item.likes }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部留空 -->
    <view class="h-32rpx" />
  </view>
</template>

<script setup lang="ts">
const hotTopics = [
  { name: '#创意手工', style: 'background: #fef2f2; color: #EF4444; border: none; font-size: 24rpx; padding: 12rpx 24rpx; border-radius: 9999rpx; font-weight: 500;' },
  { name: '#美食制作', style: 'background: #eff6ff; color: #3b82f6; border: none; font-size: 24rpx; padding: 12rpx 24rpx; border-radius: 9999rpx; font-weight: 500;' },
  { name: '#旅行vlog', style: 'background: #f0fdf4; color: #22c55e; border: none; font-size: 24rpx; padding: 12rpx 24rpx; border-radius: 9999rpx; font-weight: 500;' },
  { name: '#知识分享', style: 'background: #faf5ff; color: #8b5cf6; border: none; font-size: 24rpx; padding: 12rpx 24rpx; border-radius: 9999rpx; font-weight: 500;' },
  { name: '#搞笑日常', style: 'background: #fffbeb; color: #f59e0b; border: none; font-size: 24rpx; padding: 12rpx 24rpx; border-radius: 9999rpx; font-weight: 500;' },
]

const leftColumn = [
  {
    emoji: '🎨', title: '超治愈的手工折纸教程，一起来学吧～', plays: '128.6k', likes: '12.8k',
    avatar: '😎', author: '创意达人', height: '416rpx', bg: 'linear-gradient(135deg, #EF4444, #F87171)',
  },
  {
    emoji: '🏔️', title: '西藏自驾游Day3：纳木错日出太美了', plays: '56.3k', likes: '5.6k',
    avatar: '🧑‍💻', author: '旅行者', height: '320rpx', bg: 'linear-gradient(135deg, #10B981, #34D399)',
  },
]

const rightColumn = [
  {
    emoji: '🍜', title: '3分钟学会正宗麻辣拌，超简单！', plays: '86.2k', likes: '8.6k',
    avatar: '👨‍🍳', author: '美食家', height: '320rpx', bg: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
  },
  {
    emoji: '💡', title: '程序员必看！5个提高效率的VSCode插件', plays: '203.1k', likes: '20.3k',
    avatar: '🤓', author: '码农小王', height: '416rpx', bg: 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
  },
]
</script>

<style scoped lang="scss"></style>
