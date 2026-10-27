<!-- 企业官网 - 关于我们 -->
<template>
  <view class="min-h-screen bg-#f5f5f5">
    <!-- 页面标题 -->
    <view class="bg-white px-40rpx pt-24rpx pb-32rpx">
      <text class="text-40rpx font-700 text-#1f2937">关于我们</text>
    </view>

    <!-- 公司介绍卡片 -->
    <view class="mx-40rpx mt-32rpx bg-white rounded-32rpx p-40rpx shadow-sm">
      <view
        class="w-128rpx h-128rpx rounded-32rpx flex items-center justify-center mx-auto mb-32rpx"
        style="background: linear-gradient(135deg, #1E40AF, #3B82F6)"
      >
        <text class="text-white font-700 text-40rpx">TC</text>
      </view>
      <text class="text-36rpx font-700 text-#1f2937 block text-center mb-16rpx">TechCorp 科技有限公司</text>
      <text class="text-24rpx text-#9ca3af block text-center mb-32rpx">成立于 2011 年 · 国家高新技术企业</text>
      <text class="text-24rpx text-#4b5563 leading-relaxed">TechCorp 成立于 2011 年，是一家专注于企业级数字化转型解决方案的科技公司。我们致力于通过云计算、人工智能、大数据等前沿技术，帮助企业实现降本增效，推动业务持续增长。</text>
    </view>

    <!-- 发展历程 -->
    <view class="mx-40rpx mt-40rpx">
      <text class="text-32rpx font-700 text-#1f2937 block mb-24rpx">发展历程</text>
      <view class="relative pl-48rpx">
        <!-- 竖线 -->
        <view class="absolute left-16rpx top-16rpx bottom-16rpx w-4rpx bg-#BFDBFE" />

        <view
          v-for="(item, index) in timeline"
          :key="item.year"
          class="relative"
          :class="index < timeline.length - 1 ? 'mb-40rpx' : ''"
        >
          <!-- 圆点 -->
          <view
            class="absolute -left-40rpx top-8rpx w-24rpx h-24rpx rounded-full border-4rpx border-white"
            :class="item.dotColor"
          />
          <!-- 卡片 -->
          <view class="bg-white rounded-24rpx p-24rpx shadow-sm">
            <text class="text-24rpx font-700 block" :class="item.yearColor">{{ item.year }}</text>
            <text class="text-24rpx text-#4b5563 block mt-8rpx">{{ item.desc }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 核心团队 -->
    <view class="mx-40rpx mt-40rpx mb-32rpx">
      <text class="text-32rpx font-700 text-#1f2937 block mb-24rpx">核心团队</text>
      <view class="grid grid-cols-3 gap-24rpx">
        <view
          v-for="member in team"
          :key="member.name"
          class="bg-white rounded-32rpx p-24rpx shadow-sm text-center"
        >
          <view
            class="w-112rpx h-112rpx rounded-full flex items-center justify-center mx-auto mb-16rpx"
            :class="member.bgClass"
          >
            <text class="text-48rpx">{{ member.icon }}</text>
          </view>
          <text class="text-28rpx font-700 text-#1f2937 block">{{ member.name }}</text>
          <text class="text-20rpx text-#9ca3af block mt-4rpx">{{ member.title }}</text>
        </view>
      </view>
    </view>

    <!-- 底部留空 -->
    <view class="h-32rpx" />
  </view>
</template>

<script setup lang="ts">
const timeline = [
  { year: '2024', desc: 'AI 产品矩阵发布，客户突破 2000+', dotColor: 'bg-#1E40AF', yearColor: 'text-#1E40AF' },
  { year: '2021', desc: '获得B轮融资，估值超10亿', dotColor: 'bg-#60a5fa', yearColor: 'text-#60a5fa' },
  { year: '2018', desc: '云服务平台上线，获国家高新认定', dotColor: 'bg-#93c5fd', yearColor: 'text-#93c5fd' },
  { year: '2011', desc: '公司成立，专注企业软件开发', dotColor: 'bg-#BFDBFE', yearColor: 'text-#93c5fd' },
]

const team = [
  { icon: '👨‍💼', name: '张明', title: 'CEO · 创始人', bgClass: 'bg-#eff6ff' },
  { icon: '👩‍💻', name: '李芳', title: 'CTO · 技术VP', bgClass: 'bg-#f0fdf4' },
  { icon: '👨‍🎨', name: '王刚', title: 'CPO · 产品VP', bgClass: 'bg-#fffbeb' },
]
</script>

<style scoped lang="scss"></style>
