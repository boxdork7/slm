<!-- 7日天气预报 -->
<template>
  <view class="min-h-screen bg-white">
    <!-- 标题 -->
    <view class="px-40rpx pt-8rpx pb-32rpx">
      <text class="text-56rpx font-700 text-#0f172a block">7日预报</text>
      <text class="text-26rpx text-#64748b block mt-4rpx">北京市 · 未来一周天气趋势</text>
    </view>

    <!-- 预报列表 -->
    <view class="px-32rpx">
      <view
        v-for="(item, index) in forecastData"
        :key="index"
        class="flex items-center py-28rpx"
        :style="index < forecastData.length - 1 ? 'border-bottom: 1px solid #f1f5f9' : ''"
      >
        <!-- 日期 -->
        <view class="w-120rpx">
          <view v-if="item.isToday">
            <wd-tag custom-style="background: #0EA5E9; color: white; font-size: 20rpx; padding: 2rpx 12rpx; border: none;">今天</wd-tag>
          </view>
          <text v-else class="text-28rpx font-600 text-#1e293b block">{{ item.dayName }}</text>
          <text class="text-22rpx text-#94a3b8 block">{{ item.date }}</text>
        </view>

        <!-- 天气图标 -->
        <view class="w-72rpx text-center">
          <text class="text-44rpx">{{ item.icon }}</text>
        </view>

        <!-- 天气描述 -->
        <text class="flex-1 text-24rpx text-#64748b px-16rpx">{{ item.desc }}</text>

        <!-- 温度条 -->
        <view class="flex items-center gap-12rpx w-240rpx">
          <text class="text-26rpx text-#94a3b8 w-56rpx text-right">{{ item.low }}°</text>
          <view class="flex-1 h-8rpx bg-#e2e8f0 rounded-full relative overflow-hidden">
            <view
              class="h-full rounded-full absolute"
              :style="{
                left: item.barLeft,
                width: item.barWidth,
                background: item.barGradient,
              }"
            />
          </view>
          <text class="text-26rpx font-600 text-#1e293b w-56rpx">{{ item.high }}°</text>
        </view>
      </view>
    </view>

    <!-- 生活指数 -->
    <view class="px-32rpx pt-40rpx pb-16rpx">
      <view class="flex items-center gap-8rpx mb-24rpx">
        <text class="text-26rpx font-500 text-#64748b">❤️ 生活指数</text>
      </view>
      <view class="grid grid-cols-2 gap-20rpx">
        <view
          v-for="item in lifeIndex"
          :key="item.name"
          class="bg-#f8fafc rounded-24rpx p-28rpx"
        >
          <text class="text-48rpx block mb-12rpx">{{ item.icon }}</text>
          <text class="text-24rpx text-#64748b block mb-4rpx">{{ item.name }}</text>
          <text class="text-30rpx font-600 text-#1e293b block">{{ item.level }}</text>
          <text class="text-22rpx text-#94a3b8 block mt-4rpx">{{ item.tip }}</text>
        </view>
      </view>
    </view>

    <!-- 底部留空 -->
    <view class="h-32rpx" />
  </view>
</template>

<script setup lang="ts">
const forecastData = [
  { dayName: '今天', date: '4/14', icon: '☀️', desc: '晴', low: 22, high: 31, barLeft: '30%', barWidth: '50%', barGradient: 'linear-gradient(90deg, #38bdf8, #f97316)', isToday: true },
  { dayName: '明天', date: '4/15', icon: '⛅', desc: '多云', low: 20, high: 29, barLeft: '20%', barWidth: '50%', barGradient: 'linear-gradient(90deg, #38bdf8, #fb923c)', isToday: false },
  { dayName: '周三', date: '4/16', icon: '🌧️', desc: '小雨', low: 18, high: 25, barLeft: '10%', barWidth: '40%', barGradient: 'linear-gradient(90deg, #38bdf8, #60a5fa)', isToday: false },
  { dayName: '周四', date: '4/17', icon: '🌧️', desc: '中雨', low: 16, high: 22, barLeft: '5%', barWidth: '35%', barGradient: 'linear-gradient(90deg, #38bdf8, #60a5fa)', isToday: false },
  { dayName: '周五', date: '4/18', icon: '⛅', desc: '多云', low: 19, high: 27, barLeft: '15%', barWidth: '45%', barGradient: 'linear-gradient(90deg, #38bdf8, #fb923c)', isToday: false },
  { dayName: '周六', date: '4/19', icon: '☀️', desc: '晴', low: 21, high: 30, barLeft: '25%', barWidth: '55%', barGradient: 'linear-gradient(90deg, #38bdf8, #f97316)', isToday: false },
  { dayName: '周日', date: '4/20', icon: '☀️', desc: '晴', low: 22, high: 32, barLeft: '30%', barWidth: '55%', barGradient: 'linear-gradient(90deg, #38bdf8, #f97316)', isToday: false },
]

const lifeIndex = [
  { icon: '👕', name: '穿衣指数', level: '薄款短袖', tip: '天气炎热，注意防晒' },
  { icon: '🚗', name: '洗车指数', level: '适宜', tip: '未来两天无雨，适合洗车' },
  { icon: '🏃', name: '运动指数', level: '适宜', tip: '避开正午时段即可' },
  { icon: '🕶️', name: '紫外线', level: '中等偏强', tip: '建议涂抹 SPF30+ 防晒' },
]
</script>

<style scoped lang="scss"></style>
