<!-- 短视频 - 消息 -->
<template>
  <view class="min-h-screen bg-#f5f5f5">
    <!-- 头部 -->
    <view class="bg-white px-40rpx pt-24rpx pb-32rpx">
      <text class="text-48rpx font-700 text-#1f2937 block">消息</text>
    </view>

    <!-- 系统通知入口 4 宫格 -->
    <view class="bg-white px-40rpx py-24rpx mt-16rpx">
      <view class="grid grid-cols-4 gap-24rpx text-center">
        <view
          v-for="item in notifyEntries"
          :key="item.label"
          class="flex flex-col items-center gap-12rpx"
        >
          <view class="relative">
            <view
              class="w-96rpx h-96rpx rounded-full flex items-center justify-center"
              :class="item.bgClass"
            >
              <text class="text-40rpx">{{ item.emoji }}</text>
            </view>
            <view
              v-if="item.badge"
              class="absolute -top-4rpx -right-4rpx w-32rpx h-32rpx bg-#EF4444 rounded-full flex items-center justify-center"
            >
              <text class="text-white text-16rpx">{{ item.badge }}</text>
            </view>
          </view>
          <text class="text-20rpx text-#4b5563">{{ item.label }}</text>
        </view>
      </view>
    </view>

    <!-- 聊天列表 -->
    <view class="bg-white mt-16rpx">
      <view
        v-for="(chat, index) in chatList"
        :key="chat.name"
        class="flex items-center px-40rpx py-28rpx"
        :style="index < chatList.length - 1 ? 'border-bottom: 1rpx solid #f9fafb' : ''"
      >
        <view class="w-96rpx h-96rpx rounded-full bg-#f3f4f6 flex items-center justify-center mr-24rpx shrink-0">
          <text class="text-40rpx">{{ chat.avatar }}</text>
        </view>
        <view class="flex-1 min-w-0">
          <view class="flex justify-between items-center">
            <text class="text-28rpx font-600 text-#1f2937">{{ chat.name }}</text>
            <text class="text-20rpx text-#9ca3af">{{ chat.time }}</text>
          </view>
          <text class="text-24rpx text-#9ca3af block mt-4rpx truncate">{{ chat.message }}</text>
        </view>
        <view
          v-if="chat.unread"
          class="w-32rpx h-32rpx bg-#EF4444 rounded-full flex items-center justify-center ml-16rpx shrink-0"
        >
          <text class="text-white text-16rpx">{{ chat.unread }}</text>
        </view>
      </view>
    </view>

    <!-- 底部留空 -->
    <view class="h-32rpx" />
  </view>
</template>

<script setup lang="ts">
const notifyEntries = [
  { emoji: '❤️', label: '赞', bgClass: 'bg-#fef2f2', badge: '5' },
  { emoji: '💬', label: '评论', bgClass: 'bg-#eff6ff', badge: '3' },
  { emoji: '👤', label: '新粉丝', bgClass: 'bg-#f0fdf4', badge: '' },
  { emoji: '📢', label: '通知', bgClass: 'bg-#fffbeb', badge: '' },
]

const chatList = [
  { avatar: '😎', name: '创意达人', time: '刚刚', message: '太棒了！你的折纸教程真的很详细 👍', unread: 2 },
  { avatar: '👨‍🍳', name: '美食家小李', time: '2小时前', message: '请问那个酱料的配方可以分享一下吗？', unread: 0 },
  { avatar: '🧑‍💻', name: '旅行者阿杰', time: '昨天', message: '下次去西藏可以一起约！', unread: 0 },
  { avatar: '👧', name: '小雨同学', time: '昨天', message: '你用的是什么剪辑软件呀？', unread: 0 },
  { avatar: '🤓', name: '码农小王', time: '3天前', message: 'VSCode插件推荐视频太有用了，感谢！', unread: 0 },
  { avatar: '👩‍🎨', name: '画画小姐姐', time: '一周前', message: '[图片]', unread: 0 },
]
</script>

<style scoped lang="scss"></style>
