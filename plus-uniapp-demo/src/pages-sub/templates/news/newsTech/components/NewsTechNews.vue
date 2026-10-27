<!-- 科技快讯时间线 -->
<template>
  <view class="min-h-100vh bg-gray-100">
    <!-- 标题栏 -->
    <view class="bg-white px-[32rpx] pb-[28rpx] border-b border-gray-100" style="padding-top: calc(var(--status-bar-height, 47px) + 20rpx);">
      <text class="block text-[40rpx] font-bold text-gray-900">科技快讯</text>
      <text class="block text-[24rpx] text-gray-400 mt-[8rpx]">实时追踪科技动态</text>
    </view>

    <view class="p-32rpx">
      <!-- 今日日期头 -->
      <view class="flex items-center mb-24rpx">
        <text class="text-[32rpx] font-bold text-gray-900">今日快讯</text>
        <view class="bg-red-500 text-white text-[22rpx] px-16rpx py-4rpx rounded-full ml-12rpx">LIVE</view>
        <view class="flex-1" />
        <text class="text-[22rpx] text-gray-400 flex-shrink-0">2026年4月14日</text>
      </view>

      <!-- 时间线列表 -->
      <view class="pb-[40rpx]">
        <view
          v-for="(item, idx) in flashList"
          :key="idx"
          class="relative pl-48rpx pb-32rpx"
        >
          <!-- 左侧圆点 -->
          <view
            class="absolute left-[2rpx] top-[12rpx] w-[24rpx] h-[24rpx] rounded-full z-1"
            :class="item.hot ? 'bg-red-500' : 'bg-[#4F46E5]'"
            :style="item.hot ? 'box-shadow: 0 0 0 6rpx rgba(239,68,68,0.15);' : 'box-shadow: 0 0 0 6rpx rgba(79,70,229,0.15);'"
          />
          <!-- 连接线 -->
          <view
            v-if="idx < flashList.length - 1"
            class="absolute left-[12rpx] top-[40rpx] bottom-0 w-[4rpx] bg-indigo-100"
          />
          <!-- 右侧内容卡片 -->
          <view class="bg-white rounded-[20rpx] p-[24rpx]" style="box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);">
            <text class="block text-[20rpx] text-gray-400 mb-[8rpx]">{{ item.time }}</text>
            <view v-if="item.hot" class="flex items-center gap-[12rpx] mb-[12rpx]">
              <wd-tag custom-style="background: #EF4444; color: #fff; border: none;" size="small">热</wd-tag>
              <text class="text-[26rpx] font-semibold text-gray-900">{{ item.title }}</text>
            </view>
            <text v-else class="block text-[26rpx] font-semibold text-gray-900 mb-[12rpx]">{{ item.title }}</text>
            <text class="block text-[24rpx] text-gray-500 leading-[1.6]">{{ item.desc }}</text>
            <view class="flex items-center gap-[16rpx] mt-[16rpx]">
              <wd-tag custom-style="background: #EEF2FF; color: #4F46E5; border: none;" size="small">{{ item.category }}</wd-tag>
              <text class="text-[20rpx] text-gray-400">来源：{{ item.source }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/wd'

const toast = useToast()

const flashList = ref([
  {
    time: '10:32',
    title: 'OpenAI 宣布 GPT-5 正式发布',
    desc: '新模型在数学推理、代码生成、多模态理解三项基准测试中均创下新纪录，API 即日起开放调用。',
    category: 'AI',
    source: 'OpenAI 官方博客',
    hot: true,
  },
  {
    time: '09:58',
    title: '台积电 2nm 工艺正式量产',
    desc: '首批 2nm 芯片将供应苹果 A20 处理器，良率已达 70% 以上。',
    category: '芯片',
    source: '路透社',
    hot: false,
  },
  {
    time: '09:15',
    title: '小米汽车累计交付突破 50 万辆',
    desc: 'SU7 系列持续热销，小米汽车工厂二期已满负荷运转，月产能提升至 3 万辆。',
    category: '汽车',
    source: '小米官方',
    hot: false,
  },
  {
    time: '08:42',
    title: '苹果 Vision Pro 2 售价腰斩至 $1799',
    desc: '第二代头显重量减轻 40%，新增手势追踪 2.0，价格大幅下调加速 XR 普及。',
    category: 'VR/AR',
    source: 'The Verge',
    hot: true,
  },
  {
    time: '08:10',
    title: 'Google DeepMind 发布蛋白质结构预测新模型',
    desc: 'AlphaFold 4 准确率接近实验测定水平，将免费开放给全球科研机构使用。',
    category: 'AI',
    source: 'Nature',
    hot: false,
  },
  {
    time: '07:30',
    title: '比亚迪固态电池通过车规级认证',
    desc: '能量密度达 500Wh/kg，预计 2027 年量产装车，续航突破 1500km。',
    category: '汽车',
    source: '电车实验室',
    hot: false,
  },
])
</script>

<style lang="scss" scoped>
/* 无需额外样式 */
</style>
