<!-- 企业官网 - 产品服务 -->
<template>
  <view class="min-h-screen bg-#f5f5f5">
    <!-- 页面标题 + 分类标签 -->
    <view class="bg-white px-40rpx pt-24rpx pb-32rpx">
      <text class="text-40rpx font-700 text-#1f2937 block mb-24rpx">产品服务</text>
      <view class="flex gap-16rpx">
        <wd-tag
          v-for="tag in categories"
          :key="tag.name"
          :custom-style="currentCategory === tag.name
            ? 'background: #1E40AF; color: white; border: none; border-radius: 999rpx; padding: 8rpx 32rpx;'
            : 'background: #f3f4f6; color: #4b5563; border: none; border-radius: 999rpx; padding: 8rpx 32rpx;'"
          @click="currentCategory = tag.name"
        >
          {{ tag.name }}
        </wd-tag>
      </view>
    </view>

    <!-- 产品列表 -->
    <view class="px-40rpx mt-32rpx flex flex-col gap-24rpx mb-32rpx">
      <view
        v-for="product in filteredProducts"
        :key="product.name"
        class="bg-white rounded-32rpx overflow-hidden shadow-sm"
      >
        <!-- 产品封面 -->
        <view
          class="h-256rpx relative flex items-center justify-center"
          :style="{ background: product.bgGradient }"
        >
          <view class="absolute w-256rpx h-256rpx bg-white/10 rounded-full -top-64rpx -right-64rpx" />
          <text class="text-96rpx relative z-1">{{ product.icon }}</text>
          <view
            v-if="product.badge"
            class="absolute top-24rpx left-24rpx bg-white/25 rounded-full px-16rpx py-4rpx"
          >
            <text class="text-20rpx text-white">{{ product.badge }}</text>
          </view>
        </view>
        <!-- 产品信息 -->
        <view class="p-32rpx">
          <text class="text-32rpx font-700 text-#1f2937 block">{{ product.name }}</text>
          <text class="text-24rpx text-#9ca3af block mt-8rpx leading-relaxed">{{ product.desc }}</text>
          <view class="flex items-center justify-between mt-24rpx">
            <view class="flex items-center gap-8rpx">
              <text class="text-28rpx font-700" :class="product.priceColor">{{ product.price }}</text>
              <text class="text-20rpx text-#9ca3af">/月起</text>
            </view>
            <view class="bg-#1E40AF rounded-full px-24rpx py-8rpx">
              <text class="text-20rpx text-white font-500">了解详情</text>
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
import { ref, computed } from 'vue'

const currentCategory = ref('全部')

const categories = [
  { name: '全部' },
  { name: '云服务' },
  { name: '安全' },
  { name: 'AI' },
]

const products = [
  {
    name: 'TechCloud 云平台',
    desc: '企业级云计算平台，提供弹性计算、对象存储、CDN加速等一站式云服务。',
    icon: '☁️',
    price: '¥999',
    priceColor: 'text-#1E40AF',
    bgGradient: 'linear-gradient(135deg, #1E40AF, #3B82F6)',
    badge: '热门',
    category: '云服务',
  },
  {
    name: 'SafeGuard 安全盾',
    desc: '全方位网络安全防护，包含WAF防火墙、DDoS防护、漏洞扫描等模块。',
    icon: '🔒',
    price: '¥1,999',
    priceColor: 'text-#059669',
    bgGradient: 'linear-gradient(135deg, #059669, #10B981)',
    badge: '',
    category: '安全',
  },
  {
    name: 'DataInsight 数据平台',
    desc: '智能数据分析平台，支持实时数据流处理、BI报表、智能预警。',
    icon: '📊',
    price: '¥2,499',
    priceColor: 'text-#d97706',
    bgGradient: 'linear-gradient(135deg, #D97706, #F59E0B)',
    badge: '',
    category: '云服务',
  },
  {
    name: 'AI Assistant 智能助手',
    desc: '企业级AI解决方案，支持智能客服、文档分析、流程自动化。',
    icon: '🤖',
    price: '¥3,999',
    priceColor: 'text-#7c3aed',
    bgGradient: 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
    badge: '新品',
    category: 'AI',
  },
]

const filteredProducts = computed(() => {
  if (currentCategory.value === '全部') return products
  return products.filter((p) => p.category === currentCategory.value)
})
</script>

<style scoped lang="scss"></style>
