<!-- 天气地图 -->
<template>
  <view class="min-h-screen bg-white flex flex-col">
    <!-- 标题 -->
    <view class="px-40rpx pt-8rpx pb-24rpx">
      <text class="text-56rpx font-700 text-#0f172a block">天气图</text>
      <text class="text-26rpx text-#64748b block mt-4rpx">实时气象雷达 · 华北地区</text>
    </view>

    <!-- 地图区域（模拟） -->
    <view
      class="mx-32rpx rounded-32rpx relative overflow-hidden"
      style="background: linear-gradient(135deg, #0c4a6e 0%, #0369a1 40%, #0EA5E9 100%); height: 760rpx;"
    >
      <!-- 云朵装饰 -->
      <text class="absolute text-80rpx opacity-60" style="top: 15%; left: 10%;">☁️</text>
      <text class="absolute text-100rpx opacity-60" style="top: 35%; left: 55%;">☁️</text>
      <text class="absolute text-70rpx opacity-60" style="top: 60%; left: 25%;">⛅</text>
      <text class="absolute text-80rpx opacity-60" style="top: 20%; left: 70%;">🌤️</text>
      <text class="absolute text-60rpx opacity-60" style="top: 50%; left: 65%;">☁️</text>

      <!-- 太阳 -->
      <text class="absolute text-112rpx" style="top: 8%; right: 15%;">☀️</text>

      <!-- 雷达环 -->
      <view class="absolute w-240rpx h-240rpx rounded-full border border-white/15" style="bottom: 20%; left: 20%;" />
      <view class="absolute w-400rpx h-400rpx rounded-full border border-white/15" style="bottom: 10%; left: 10%;" />
      <view class="absolute w-560rpx h-560rpx rounded-full border border-white/15" style="bottom: 0%; left: 0%;" />

      <!-- 城市标记 -->
      <view
        v-for="city in cityMarkers"
        :key="city.name"
        class="absolute flex flex-col items-center gap-4rpx"
        :style="{ top: city.top, left: city.left }"
      >
        <text class="text-20rpx text-white font-500">{{ city.name }}</text>
        <view class="w-16rpx h-16rpx bg-white rounded-full" style="box-shadow: 0 0 16rpx rgba(255,255,255,0.6);" />
        <text class="text-24rpx text-#fde68a font-600">{{ city.temp }}</text>
      </view>

      <!-- 图例 -->
      <view
        class="absolute flex items-center gap-12rpx rounded-16rpx px-20rpx py-16rpx"
        style="bottom: 24rpx; left: 24rpx; background: rgba(0,0,0,0.4); backdrop-filter: blur(8px);"
      >
        <text class="text-18rpx text-white/80">-10°</text>
        <view
          class="w-200rpx h-12rpx rounded-full"
          style="background: linear-gradient(90deg, #22d3ee, #34d399, #facc15, #f97316, #ef4444);"
        />
        <text class="text-18rpx text-white/80">40°</text>
      </view>
    </view>

    <!-- 图层切换 -->
    <view class="px-32rpx pt-32rpx pb-16rpx">
      <view class="flex items-center gap-8rpx mb-20rpx">
        <text class="text-26rpx font-500 text-#64748b">📊 图层切换</text>
      </view>
      <view class="flex gap-16rpx">
        <view
          v-for="layer in layers"
          :key="layer.name"
          class="flex-1 py-20rpx rounded-24rpx text-center"
          :class="layer.active ? 'bg-#f0f9ff border-2 border-#0EA5E9' : 'bg-white border-2 border-#e2e8f0'"
          @tap="switchLayer(layer.name)"
        >
          <text class="text-40rpx block mb-4rpx">{{ layer.icon }}</text>
          <text
            class="text-22rpx font-500 block"
            :class="layer.active ? 'text-#0EA5E9' : 'text-#475569'"
          >{{ layer.name }}</text>
        </view>
      </view>
    </view>

    <!-- 底部留空 -->
    <view class="h-32rpx" />
  </view>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const cityMarkers = [
  { name: '北京', temp: '28°', top: '30%', left: '45%' },
  { name: '天津', temp: '27°', top: '38%', left: '68%' },
  { name: '石家庄', temp: '30°', top: '55%', left: '52%' },
  { name: '张家口', temp: '22°', top: '22%', left: '25%' },
  { name: '济南', temp: '29°', top: '70%', left: '72%' },
]

const layers = reactive([
  { icon: '🌡️', name: '温度', active: true },
  { icon: '🌧️', name: '降水', active: false },
  { icon: '💨', name: '风力', active: false },
  { icon: '🫁', name: '空气质量', active: false },
])

/** 切换图层 */
const switchLayer = (name: string) => {
  layers.forEach((l) => {
    l.active = l.name === name
  })
}
</script>

<style scoped lang="scss"></style>
