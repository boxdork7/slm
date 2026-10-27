<!-- 益智游戏 - 游戏大厅 -->
<template>
  <view class="min-h-screen bg-#f5f5f5">
    <!-- 标题区域 -->
    <view class="bg-white px-40rpx pt-24rpx pb-32rpx">
      <text class="text-48rpx font-700 text-#1f2937 block mb-24rpx">游戏大厅</text>
      <!-- 分类 Tab -->
      <view class="flex gap-16rpx overflow-hidden">
        <wd-tag
          v-for="tab in tabs"
          :key="tab"
          round
          size="large"
          :custom-style="activeTab === tab ? 'background: #EC4899; color: white; border: none;' : 'background: #f3f4f6; color: #4b5563; border: none;'"
          @click="activeTab = tab"
        >{{ tab }}</wd-tag>
      </view>
    </view>

    <!-- 游戏列表 -->
    <view class="px-40rpx mt-32rpx flex flex-col gap-24rpx mb-32rpx">
      <view
        v-for="item in gameList"
        :key="item.name"
        class="bg-white rounded-32rpx p-32rpx shadow-sm flex gap-24rpx"
      >
        <view
          class="w-160rpx h-160rpx rounded-32rpx flex items-center justify-center shrink-0"
          :style="{ background: item.gradient }"
        >
          <text class="text-72rpx">{{ item.icon }}</text>
        </view>
        <view class="flex-1">
          <view class="flex justify-between items-start">
            <text class="text-28rpx font-700 text-#1f2937">{{ item.name }}</text>
            <wd-tag
              size="small"
              round
              :custom-style="`background: ${item.tagBg}; color: ${item.tagColor}; border: none;`"
            >{{ item.tag }}</wd-tag>
          </view>
          <text class="text-20rpx text-#9ca3af block mt-8rpx">{{ item.desc }}</text>
          <view class="flex items-center justify-between mt-16rpx">
            <view class="flex items-center gap-8rpx">
              <text class="text-24rpx text-#facc15">★ {{ item.rating }}</text>
              <text class="text-20rpx text-#9ca3af">· {{ item.players }}</text>
            </view>
            <view class="bg-#EC4899 rounded-full px-24rpx py-8rpx">
              <text class="text-20rpx font-500 text-white">开始</text>
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
import { ref } from 'vue'

const tabs = ['全部', '拼图', '数字', '记忆', '策略']
const activeTab = ref('全部')

const gameList = [
  { icon: '🧩', name: '经典拼图', desc: '将打乱的图片复原，锻炼空间思维', rating: '4.9', players: '12k人', tag: '热门', tagBg: '#fce7f3', tagColor: '#EC4899', gradient: 'linear-gradient(135deg, #EC4899, #F472B6)' },
  { icon: '🔢', name: '数独大师', desc: '逻辑推理填数，从入门到地狱级', rating: '4.8', players: '8.5k人', tag: '经典', tagBg: '#f3e8ff', tagColor: '#8b5cf6', gradient: 'linear-gradient(135deg, #8B5CF6, #A78BFA)' },
  { icon: '🎯', name: '消消乐', desc: '三消玩法，200+关卡等你挑战', rating: '4.6', players: '15k人', tag: '休闲', tagBg: '#dbeafe', tagColor: '#3b82f6', gradient: 'linear-gradient(135deg, #3B82F6, #60A5FA)' },
  { icon: '🧠', name: '记忆翻牌', desc: '翻开配对，挑战你的记忆极限', rating: '4.7', players: '6.2k人', tag: '益智', tagBg: '#dcfce7', tagColor: '#22c55e', gradient: 'linear-gradient(135deg, #10B981, #34D399)' },
  { icon: '♟️', name: '五子棋', desc: '支持人机对战和双人对战', rating: '4.5', players: '3.8k人', tag: '对战', tagBg: '#fef3c7', tagColor: '#f59e0b', gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)' },
  { icon: '🎲', name: '2048', desc: '滑动合并数字，挑战最高分', rating: '4.8', players: '9.6k人', tag: '烧脑', tagBg: '#fef2f2', tagColor: '#ef4444', gradient: 'linear-gradient(135deg, #EF4444, #F87171)' },
]
</script>

<style scoped lang="scss"></style>
