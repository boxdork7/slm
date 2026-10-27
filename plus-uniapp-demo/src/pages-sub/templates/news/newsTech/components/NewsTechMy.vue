<!-- 科技新闻我的页面 -->
<template>
  <view class="min-h-100vh bg-gray-100">
    <!-- 靛蓝渐变头部 -->
    <view class="relative overflow-hidden" style="background: linear-gradient(135deg, #312e81, #4F46E5, #6366f1); padding: 0 40rpx 64rpx; padding-top: calc(var(--status-bar-height, 47px) + 20rpx);">
      <!-- 装饰圆 -->
      <view class="absolute w-[240rpx] h-[240rpx] rounded-full bg-white/10" style="top: -40rpx; right: -40rpx;" />
      <view class="absolute w-[160rpx] h-[160rpx] rounded-full bg-white/10" style="bottom: -60rpx; left: -20rpx;" />
      <view class="absolute w-[100rpx] h-[100rpx] rounded-full bg-white/10" style="top: 100rpx; right: 200rpx;" />

      <!-- 用户信息 -->
      <view class="relative z-1 flex items-center gap-[28rpx]">
        <view class="w-[120rpx] h-[120rpx] rounded-full bg-white/20 flex items-center justify-center flex-shrink-0" style="border: 4rpx solid rgba(255,255,255,0.3);">
          <text class="text-[60rpx]">🧑‍💻</text>
        </view>
        <view class="flex flex-col">
          <text class="text-[36rpx] font-bold text-white">TechExplorer</text>
          <view class="flex items-center mt-12rpx" style="margin-left: -4rpx;">
            <wd-tag size="small" round custom-style="background: rgba(255,255,255,0.2); color: #fff; border: none; margin-right: 12rpx;">Lv.8 科技达人</wd-tag>
            <wd-tag size="small" round custom-style="background: rgba(245,158,11,0.6); color: #fff; border: none;">👑 VIP</wd-tag>
          </view>
        </view>
      </view>

      <!-- 数据统计卡片（嵌在渐变头部内） -->
      <view class="flex mt-[40rpx] bg-white/12 rounded-[24rpx] py-[28rpx]" style="backdrop-filter: blur(10px);">
        <view v-for="(s, i) in stats" :key="i" class="flex-1 flex flex-col items-center gap-[4rpx]">
          <text class="text-[36rpx] font-bold text-white">{{ s.num }}</text>
          <text class="text-[22rpx] text-white/70">{{ s.label }}</text>
        </view>
      </view>
    </view>

    <view>
      <!-- 功能入口宫格 -->
      <view class="flex flex-wrap mx-[32rpx] mt-[24rpx] bg-white rounded-[24rpx] py-[28rpx]" style="box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);">
        <view
          v-for="(item, idx) in gridItems"
          :key="idx"
          class="w-1/4 flex flex-col items-center gap-[12rpx] py-[12rpx]"
          @click="onGridTap(item)"
        >
          <view class="w-[80rpx] h-[80rpx] rounded-[20rpx] flex items-center justify-center" :style="{ background: item.bg }">
            <text class="text-[40rpx]">{{ item.emoji }}</text>
          </view>
          <text class="text-[22rpx] text-gray-700">{{ item.label }}</text>
        </view>
      </view>

      <!-- 更多功能列表 -->
      <view class="mx-[32rpx] mt-[24rpx] mb-[32rpx] bg-white rounded-[24rpx] overflow-hidden" style="box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);">
        <view
          v-for="(item, idx) in funcItems"
          :key="idx"
          class="flex items-center px-[32rpx] py-[28rpx] gap-[24rpx]"
          :class="idx < funcItems.length - 1 ? 'border-b border-gray-50' : ''"
          @click="onFuncTap(item)"
        >
          <view class="w-[64rpx] h-[64rpx] rounded-[16rpx] flex items-center justify-center flex-shrink-0" :style="{ background: item.bg }">
            <text class="text-[32rpx]">{{ item.emoji }}</text>
          </view>
          <text class="flex-1 text-[26rpx] text-gray-700">{{ item.label }}</text>
          <!-- 消息通知角标 -->
          <view v-if="item.badge" class="bg-red-500 text-white text-[20rpx] px-[12rpx] py-[2rpx] rounded-full mr-[8rpx]">
            {{ item.badge }}
          </view>
          <!-- 版本号 -->
          <text v-if="item.extra" class="text-[22rpx] text-gray-400 mr-[8rpx]">{{ item.extra }}</text>
          <wd-icon name="arrow-right" size="32rpx" color="#D1D5DB" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/wd'

const toast = useToast()

/* 数据统计 - 对照原型还原 */
const stats = ref([
  { num: '328', label: '收藏' },
  { num: '1.2k', label: '关注' },
  { num: '56', label: '评论' },
  { num: '890', label: '点赞' },
])

/* 功能入口宫格 - 对照原型：浏览历史/我的收藏/我的点赞/离线阅读 */
const gridItems = ref([
  { emoji: '📋', label: '浏览历史', bg: '#EEF2FF' },
  { emoji: '🕐', label: '我的收藏', bg: '#FEF3C7' },
  { emoji: '❤️', label: '我的点赞', bg: '#FCE7F3' },
  { emoji: '⬇️', label: '离线阅读', bg: '#D1FAE5' },
])

/* 更多功能列表 - 对照原型：订阅管理/消息通知(3)/主题外观/隐私设置/意见反馈/关于我们(v2.6.0) */
const funcItems = ref([
  { emoji: '📡', label: '订阅管理', bg: '#EDE9FE', badge: '', extra: '' },
  { emoji: '🔔', label: '消息通知', bg: '#DBEAFE', badge: '3', extra: '' },
  { emoji: '🎨', label: '主题外观', bg: '#FEF3C7', badge: '', extra: '' },
  { emoji: '🛡️', label: '隐私设置', bg: '#FCE7F3', badge: '', extra: '' },
  { emoji: '💬', label: '意见反馈', bg: '#D1FAE5', badge: '', extra: '' },
  { emoji: 'ℹ️', label: '关于我们', bg: '#F3F4F6', badge: '', extra: 'v2.6.0' },
])

const onGridTap = (item: any) => {
  toast.info(item.label)
}

const onFuncTap = (item: any) => {
  toast.info(item.label)
}
</script>

<style lang="scss" scoped>
/* 无需额外样式 */
</style>
