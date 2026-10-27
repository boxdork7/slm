<!-- 企业官网 - 首页 -->
<template>
  <view class="min-h-screen bg-#f5f5f5">
    <!-- 深蓝渐变头部 -->
    <view
      class="relative overflow-hidden px-40rpx pt-24rpx pb-112rpx"
      style="background: linear-gradient(135deg, #1E40AF, #1D4ED8)"
    >
      <!-- 装饰圆 -->
      <view class="absolute w-384rpx h-384rpx rounded-full bg-white/10 -top-80rpx -right-80rpx" />
      <view class="absolute w-320rpx h-320rpx rounded-full bg-white/10 -bottom-128rpx right-128rpx" />
      <view class="absolute w-256rpx h-256rpx rounded-full bg-white/10 top-40rpx -left-80rpx" />

      <!-- Logo 行 -->
      <view class="flex justify-between items-center mb-48rpx relative z-1">
        <view class="flex items-center gap-16rpx">
          <view class="w-72rpx h-72rpx bg-white rounded-16rpx flex items-center justify-center">
            <text class="text-28rpx font-700 text-#1E40AF">TC</text>
          </view>
          <text class="text-32rpx font-700 text-white">TechCorp</text>
        </view>
        <view class="w-72rpx h-72rpx bg-white/20 rounded-full flex items-center justify-center">
          <wd-icon name="setting" color="white" size="36rpx" />
        </view>
      </view>

      <!-- 标题 -->
      <view class="relative z-1">
        <text class="text-24rpx text-white/80 block">引领数字化转型</text>
        <text class="text-48rpx font-700 text-white block mt-8rpx leading-tight">用科技赋能</text>
        <text class="text-48rpx font-700 text-white block leading-tight">每一个企业</text>
        <text class="text-24rpx text-white/70 block mt-24rpx leading-relaxed">专注企业级解决方案，服务超过 2000+ 企业客户</text>
        <view class="flex gap-24rpx mt-32rpx">
          <view class="bg-white rounded-full px-40rpx py-16rpx">
            <text class="text-24rpx font-700 text-#1E40AF">了解更多</text>
          </view>
          <view class="bg-white/20 rounded-full px-40rpx py-16rpx">
            <text class="text-24rpx text-white">联系我们</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 数据统计卡片 -->
    <view class="mx-40rpx -mt-64rpx bg-white rounded-32rpx p-40rpx shadow-sm relative z-2">
      <view class="grid grid-cols-3 gap-32rpx text-center">
        <view>
          <text class="text-40rpx font-700 text-#1E40AF block">2000+</text>
          <text class="text-20rpx text-#9ca3af block mt-4rpx">企业客户</text>
        </view>
        <view>
          <text class="text-40rpx font-700 text-#1E40AF block">15年</text>
          <text class="text-20rpx text-#9ca3af block mt-4rpx">行业经验</text>
        </view>
        <view>
          <text class="text-40rpx font-700 text-#1E40AF block">99.9%</text>
          <text class="text-20rpx text-#9ca3af block mt-4rpx">系统可用率</text>
        </view>
      </view>
    </view>

    <!-- 核心服务 -->
    <view class="mx-40rpx mt-48rpx">
      <view class="flex justify-between items-center mb-24rpx">
        <text class="text-32rpx font-700 text-#1f2937">核心服务</text>
        <text class="text-24rpx text-#1E40AF">全部 ›</text>
      </view>
      <view class="grid grid-cols-2 gap-24rpx">
        <view
          v-for="item in services"
          :key="item.name"
          class="bg-white rounded-32rpx p-32rpx shadow-sm"
        >
          <view
            class="w-88rpx h-88rpx rounded-20rpx flex items-center justify-center mb-24rpx"
            :style="{ background: item.bgGradient }"
          >
            <text class="text-40rpx">{{ item.icon }}</text>
          </view>
          <text class="text-28rpx font-700 text-#1f2937 block">{{ item.name }}</text>
          <text class="text-20rpx text-#9ca3af block mt-8rpx leading-relaxed">{{ item.desc }}</text>
        </view>
      </view>
    </view>

    <!-- 客户评价 -->
    <view class="mx-40rpx mt-48rpx mb-32rpx">
      <text class="text-32rpx font-700 text-#1f2937 block mb-24rpx">客户评价</text>
      <view class="bg-white rounded-32rpx p-32rpx shadow-sm">
        <view class="flex items-center gap-24rpx mb-24rpx">
          <view class="w-80rpx h-80rpx bg-#eff6ff rounded-full flex items-center justify-center">
            <text class="text-36rpx">👨‍💼</text>
          </view>
          <view class="flex-1">
            <text class="text-28rpx font-600 text-#1f2937 block">张总</text>
            <text class="text-20rpx text-#9ca3af block">某上市公司 CTO</text>
          </view>
          <text class="text-24rpx text-#facc15">★★★★★</text>
        </view>
        <text class="text-24rpx text-#4b5563 leading-relaxed">"TechCorp的云服务方案帮助我们将系统可用性提升至99.99%，大大降低了运维成本，非常专业。"</text>
      </view>
    </view>

    <!-- 底部留空 -->
    <view class="h-32rpx" />
  </view>
</template>

<script setup lang="ts">
const services = [
  { icon: '☁️', name: '云服务', desc: '高可用云计算解决方案', bgGradient: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)' },
  { icon: '🔒', name: '安全防护', desc: '企业级网络安全方案', bgGradient: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)' },
  { icon: '📊', name: '数据分析', desc: '智能数据洞察平台', bgGradient: 'linear-gradient(135deg, #FEF3C7, #FDE68A)' },
  { icon: '🤖', name: 'AI 智能', desc: 'AI赋能业务自动化', bgGradient: 'linear-gradient(135deg, #FCE7F3, #FBCFE8)' },
]
</script>

<style scoped lang="scss"></style>
