<!-- 天气设置 -->
<template>
  <view class="min-h-screen bg-#f8fafc">
    <!-- 标题 -->
    <view class="px-40rpx pt-8rpx pb-32rpx">
      <text class="text-56rpx font-700 text-#0f172a block">设置</text>
    </view>

    <!-- 城市管理 -->
    <view class="px-32rpx pb-40rpx">
      <text class="text-24rpx text-#94a3b8 font-500 block mb-16rpx pl-8rpx tracking-wider">城市管理</text>
      <view class="bg-white rounded-28rpx overflow-hidden" style="box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.04);">
        <view
          v-for="(city, index) in cities"
          :key="city.name"
          class="flex items-center px-32rpx py-28rpx"
          :style="index < cities.length - 1 ? 'border-bottom: 1px solid #f1f5f9' : ''"
        >
          <!-- 图标 -->
          <view
            class="w-72rpx h-72rpx rounded-20rpx flex items-center justify-center mr-24rpx flex-shrink-0"
            :class="city.isCurrent ? 'bg-#0EA5E9' : 'bg-#f1f5f9'"
          >
            <wd-icon v-if="city.isCurrent" name="location" color="white" size="36rpx" />
            <text v-else class="text-36rpx">{{ city.weatherIcon }}</text>
          </view>

          <!-- 信息 -->
          <view class="flex-1">
            <view class="flex items-center gap-12rpx">
              <text class="text-30rpx font-500 text-#1e293b">{{ city.name }}</text>
              <wd-tag v-if="city.isCurrent" custom-style="background: #dcfce7; color: #16a34a; font-size: 20rpx; padding: 2rpx 12rpx; border: none;">当前</wd-tag>
            </view>
            <text class="text-24rpx text-#94a3b8 block mt-2rpx">{{ city.sub }}</text>
          </view>

          <!-- 温度 -->
          <text class="text-36rpx font-600 text-#1e293b mr-16rpx">{{ city.temp }}</text>
          <wd-icon name="arrow-right" color="#cbd5e1" size="36rpx" />
        </view>

        <!-- 添加城市 -->
        <view class="flex items-center justify-center py-28rpx gap-12rpx" style="border-top: 1px solid #f1f5f9;">
          <wd-icon name="add" color="#0EA5E9" size="36rpx" />
          <text class="text-28rpx font-500 text-#0EA5E9">添加城市</text>
        </view>
      </view>
    </view>

    <!-- 偏好设置 -->
    <view class="px-32rpx pb-40rpx">
      <text class="text-24rpx text-#94a3b8 font-500 block mb-16rpx pl-8rpx tracking-wider">偏好设置</text>
      <view class="bg-white rounded-28rpx overflow-hidden" style="box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.04);">
        <!-- 温度单位 -->
        <view class="flex items-center px-32rpx py-28rpx" style="border-bottom: 1px solid #f1f5f9;">
          <view class="w-64rpx h-64rpx rounded-16rpx flex items-center justify-center mr-24rpx flex-shrink-0 bg-#fef3c7">
            <text class="text-32rpx">🌡️</text>
          </view>
          <text class="flex-1 text-30rpx text-#1e293b">温度单位</text>
          <!-- 单位切换器 -->
          <view class="flex bg-#f1f5f9 rounded-16rpx overflow-hidden">
            <view
              class="px-32rpx py-12rpx text-26rpx font-500"
              :class="tempUnit === 'C' ? 'bg-#0EA5E9 text-white rounded-16rpx' : 'text-#64748b'"
              @tap="tempUnit = 'C'"
            >
              <text>&#8451;</text>
            </view>
            <view
              class="px-32rpx py-12rpx text-26rpx font-500"
              :class="tempUnit === 'F' ? 'bg-#0EA5E9 text-white rounded-16rpx' : 'text-#64748b'"
              @tap="tempUnit = 'F'"
            >
              <text>&#8457;</text>
            </view>
          </view>
        </view>

        <!-- 风速单位 -->
        <view class="flex items-center px-32rpx py-28rpx">
          <view class="w-64rpx h-64rpx rounded-16rpx flex items-center justify-center mr-24rpx flex-shrink-0 bg-#dbeafe">
            <text class="text-32rpx">💨</text>
          </view>
          <text class="flex-1 text-30rpx text-#1e293b">风速单位</text>
          <text class="text-26rpx text-#94a3b8 mr-8rpx">km/h</text>
          <wd-icon name="arrow-right" color="#cbd5e1" size="36rpx" />
        </view>
      </view>
    </view>

    <!-- 通知设置 -->
    <view class="px-32rpx pb-40rpx">
      <text class="text-24rpx text-#94a3b8 font-500 block mb-16rpx pl-8rpx tracking-wider">通知设置</text>
      <view class="bg-white rounded-28rpx overflow-hidden" style="box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.04);">
        <view
          v-for="(item, index) in notifications"
          :key="item.label"
          class="flex items-center px-32rpx py-28rpx"
          :style="index < notifications.length - 1 ? 'border-bottom: 1px solid #f1f5f9' : ''"
        >
          <view
            class="w-64rpx h-64rpx rounded-16rpx flex items-center justify-center mr-24rpx flex-shrink-0"
            :class="item.bgClass"
          >
            <text class="text-32rpx">{{ item.icon }}</text>
          </view>
          <text class="flex-1 text-30rpx text-#1e293b">{{ item.label }}</text>
          <wd-switch v-model="item.enabled" size="40rpx" />
        </view>
      </view>
    </view>

    <!-- 关于 -->
    <view class="px-32rpx pb-32rpx text-center">
      <text class="text-96rpx block mb-16rpx">🌤️</text>
      <text class="text-32rpx font-600 text-#1e293b block">天气工具</text>
      <text class="text-24rpx text-#94a3b8 block mt-4rpx">版本 1.0.0</text>
      <text class="text-24rpx text-#94a3b8 block mt-16rpx leading-relaxed">数据来源：中国气象局</text>
      <text class="text-24rpx text-#94a3b8 block">更新频率：每 30 分钟</text>
    </view>

    <!-- 底部留空 -->
    <view class="h-32rpx" />
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const tempUnit = ref('C')

const cities = [
  { name: '北京市', sub: '自动定位 · 晴', temp: '28°', weatherIcon: '', isCurrent: true },
  { name: '上海市', sub: '小雨 · 湿度 78%', temp: '24°', weatherIcon: '🌧️', isCurrent: false },
  { name: '广州市', sub: '晴 · 湿度 62%', temp: '33°', weatherIcon: '☀️', isCurrent: false },
  { name: '成都市', sub: '多云 · 湿度 55%', temp: '26°', weatherIcon: '⛅', isCurrent: false },
]

const notifications = reactive([
  { icon: '🔔', label: '天气预警通知', bgClass: 'bg-#fce7f3', enabled: true },
  { icon: '🌧️', label: '降雨提醒', bgClass: 'bg-#e0e7ff', enabled: true },
  { icon: '🌅', label: '每日天气播报', bgClass: 'bg-#dcfce7', enabled: false },
])
</script>

<style scoped lang="scss"></style>
