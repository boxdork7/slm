<!-- 短视频模板 -->
<template>
  <view class="min-h-screen bg-black">
    <GameVideoIndex v-if="tabLoaded[0]" v-show="currentTab === 0" />
    <GameVideoDiscover v-if="tabLoaded[1]" v-show="currentTab === 1" />
    <GameVideoCreate v-if="tabLoaded[2]" v-show="currentTab === 2" />
    <GameVideoMessage v-if="tabLoaded[3]" v-show="currentTab === 3" />
    <GameVideoMy v-if="tabLoaded[4]" v-show="currentTab === 4" />

    <!-- 自定义底部导航（抖音风格） -->
    <view class="fixed bottom-0 left-0 right-0 z-50 video-tabbar" :class="currentTab === 0 ? 'bg-black border-t border-gray-800' : 'bg-white border-t border-gray-100'">
      <view class="flex items-center justify-around py-12rpx">
        <!-- 首页 -->
        <view class="flex flex-col items-center gap-4rpx min-w-[100rpx]" @tap="switchTab(0)">
          <wd-icon name="home" size="40rpx" :color="currentTab === 0 ? (currentTab === 0 ? '#fff' : '#1f2937') : '#9ca3af'" />
          <text class="text-20rpx" :class="currentTab === 0 ? (currentTab === 0 ? 'text-white font-600' : 'text-#1f2937 font-600') : 'text-#9ca3af'">首页</text>
        </view>
        <!-- 发现 -->
        <view class="flex flex-col items-center gap-4rpx min-w-[100rpx]" @tap="switchTab(1)">
          <wd-icon name="search" size="40rpx" :color="currentTab === 1 ? '#EF4444' : '#9ca3af'" />
          <text class="text-20rpx" :class="currentTab === 1 ? 'text-#EF4444 font-600' : 'text-#9ca3af'">发现</text>
        </view>
        <!-- 创作（特殊按钮） -->
        <view class="flex flex-col items-center min-w-[100rpx]" @tap="switchTab(2)">
          <view class="relative w-80rpx h-56rpx flex items-center justify-center">
            <view class="absolute w-64rpx h-48rpx rounded-16rpx bg-#06b6d4" style="left: 4rpx;" />
            <view class="absolute w-64rpx h-48rpx rounded-16rpx bg-#EF4444" style="right: 4rpx;" />
            <view class="absolute w-64rpx h-48rpx rounded-16rpx flex items-center justify-center" :class="currentTab === 0 ? 'bg-white' : 'bg-#1f2937'">
              <wd-icon name="add" size="32rpx" :color="currentTab === 0 ? '#000' : '#fff'" />
            </view>
          </view>
        </view>
        <!-- 消息 -->
        <view class="flex flex-col items-center gap-4rpx min-w-[100rpx]" @tap="switchTab(3)">
          <wd-icon name="chat" size="40rpx" :color="currentTab === 3 ? '#EF4444' : '#9ca3af'" />
          <text class="text-20rpx" :class="currentTab === 3 ? 'text-#EF4444 font-600' : 'text-#9ca3af'">消息</text>
        </view>
        <!-- 我的 -->
        <view class="flex flex-col items-center gap-4rpx min-w-[100rpx]" @tap="switchTab(4)">
          <wd-icon name="user" size="40rpx" :color="currentTab === 4 ? '#EF4444' : '#9ca3af'" />
          <text class="text-20rpx" :class="currentTab === 4 ? 'text-#EF4444 font-600' : 'text-#9ca3af'">我的</text>
        </view>
      </view>
      <!-- 安全区 -->
      <view class="h-safe-bottom" />
    </view>
  </view>
</template>

<script setup lang="ts">
import GameVideoIndex from './gameVideo/components/GameVideoIndex.vue'
import GameVideoDiscover from './gameVideo/components/GameVideoDiscover.vue'
import GameVideoCreate from './gameVideo/components/GameVideoCreate.vue'
import GameVideoMessage from './gameVideo/components/GameVideoMessage.vue'
import GameVideoMy from './gameVideo/components/GameVideoMy.vue'

import { ref } from 'vue'

const currentTab = ref(0)
const tabLoaded = ref([true, false, false, false, false])

const switchTab = (index: number) => {
  currentTab.value = index
  tabLoaded.value[index] = true
}
</script>

<style scoped lang="scss">
.video-tabbar {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.h-safe-bottom {
  height: 0;
}
</style>
