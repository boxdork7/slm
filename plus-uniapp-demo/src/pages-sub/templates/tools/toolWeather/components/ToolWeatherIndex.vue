<!-- 天气首页 - 当前天气/逐时预报 -->
<template>
  <view class="min-h-screen">
    <!-- 天蓝渐变头部 -->
    <view
      class="relative overflow-hidden px-48rpx pt-24rpx pb-56rpx text-center"
      style="background: linear-gradient(180deg, #0EA5E9, #0284C7)"
    >
      <!-- 装饰圆 -->
      <view class="absolute w-400rpx h-400rpx rounded-full bg-white/8 -top-100rpx -right-60rpx" />
      <view class="absolute w-320rpx h-320rpx rounded-full bg-white/8 -bottom-120rpx -left-80rpx" />

      <!-- 城市 -->
      <view class="flex items-center justify-center gap-12rpx mb-16rpx relative z-1">
        <wd-icon name="location" color="white" size="36rpx" />
        <text class="text-36rpx font-500 text-white">北京市</text>
      </view>

      <!-- 大温度 -->
      <text class="text-192rpx font-200 text-white block leading-none relative z-1">28°</text>

      <!-- 天气描述 -->
      <text class="text-40rpx text-white block mt-8rpx relative z-1">☀️ 晴</text>

      <!-- 高低温 -->
      <text class="text-26rpx text-white/80 block mt-8rpx relative z-1">最高 31° / 最低 22°</text>
    </view>

    <!-- 信息网格 -->
    <view class="grid grid-cols-2 gap-24rpx px-32rpx py-40rpx">
      <view
        v-for="item in infoCards"
        :key="item.label"
        class="bg-#f0f9ff rounded-28rpx px-32rpx py-28rpx flex flex-col gap-8rpx"
      >
        <view class="flex items-center gap-8rpx">
          <text class="text-22rpx text-#64748b">{{ item.icon }} {{ item.label }}</text>
        </view>
        <text class="text-44rpx font-600 text-#0c4a6e">{{ item.value }}</text>
        <text class="text-22rpx text-#64748b">{{ item.sub }}</text>
      </view>
    </view>

    <!-- 24小时预报 -->
    <view class="px-32rpx pb-32rpx">
      <view class="flex items-center gap-8rpx mb-20rpx">
        <wd-icon name="clock" color="#64748b" size="28rpx" />
        <text class="text-26rpx font-500 text-#64748b">24小时预报</text>
      </view>
      <scroll-view scroll-x class="whitespace-nowrap">
        <view class="flex gap-8rpx">
          <view
            v-for="(item, index) in hourlyData"
            :key="index"
            class="flex-shrink-0 w-112rpx flex flex-col items-center gap-12rpx py-20rpx px-8rpx rounded-40rpx"
            :class="item.isNow ? 'bg-#0EA5E9' : 'bg-#f8fafc'"
          >
            <text
              class="text-22rpx"
              :class="item.isNow ? 'text-white/80' : 'text-#64748b'"
            >{{ item.time }}</text>
            <text class="text-40rpx">{{ item.icon }}</text>
            <text
              class="text-28rpx font-600"
              :class="item.isNow ? 'text-white' : 'text-#1e293b'"
            >{{ item.temp }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 底部留空 -->
    <view class="h-32rpx" />
  </view>
</template>

<script setup lang="ts">
const infoCards = [
  { icon: '🌡️', label: '体感温度', value: '30°', sub: '略高于实际温度' },
  { icon: '💧', label: '湿度', value: '45%', sub: '较为舒适' },
  { icon: '💨', label: '风速', value: '12 km/h', sub: '东南风 3级' },
  { icon: '☀️', label: '紫外线', value: '中等', sub: '建议涂抹防晒霜' },
]

const hourlyData = [
  { time: '现在', icon: '☀️', temp: '28°', isNow: true },
  { time: '11:00', icon: '☀️', temp: '29°', isNow: false },
  { time: '12:00', icon: '⛅', temp: '31°', isNow: false },
  { time: '13:00', icon: '⛅', temp: '31°', isNow: false },
  { time: '14:00', icon: '☀️', temp: '30°', isNow: false },
  { time: '15:00', icon: '☀️', temp: '29°', isNow: false },
  { time: '16:00', icon: '⛅', temp: '28°', isNow: false },
  { time: '17:00', icon: '🌤️', temp: '27°', isNow: false },
  { time: '18:00', icon: '🌤️', temp: '26°', isNow: false },
  { time: '19:00', icon: '🌙', temp: '24°', isNow: false },
  { time: '20:00', icon: '🌙', temp: '23°', isNow: false },
  { time: '21:00', icon: '🌙', temp: '23°', isNow: false },
  { time: '22:00', icon: '🌙', temp: '22°', isNow: false },
]
</script>

<style scoped lang="scss"></style>
