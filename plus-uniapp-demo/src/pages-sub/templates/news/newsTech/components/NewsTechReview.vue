<!-- 科技产品评测 -->
<template>
  <view class="min-h-100vh bg-gray-100">
    <!-- 标题栏 -->
    <view class="bg-white px-[32rpx] pb-[16rpx]" style="padding-top: calc(var(--status-bar-height, 47px) + 20rpx);">
      <text class="text-[40rpx] font-bold text-gray-900">产品评测</text>
    </view>

    <!-- 分类标签 -->
    <view class="bg-white pb-[4rpx]">
      <wd-tabs v-model="activeTab" custom-class="review-tabs">
        <wd-tab title="手机" name="phone" />
        <wd-tab title="电脑" name="pc" />
        <wd-tab title="智能设备" name="device" />
      </wd-tabs>
    </view>

    <view class="px-32rpx pt-24rpx">
      <view class="pb-40rpx">
        <view
          v-for="(item, idx) in currentList"
          :key="idx"
          class="bg-white rounded-[24rpx] overflow-hidden mb-[28rpx]"
          style="box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.06);"
          @click="onReviewTap(item)"
        >
          <!-- 封面区域 - 渐变色背景 + 装饰元素 -->
          <view class="relative h-[320rpx]" :style="{ background: item.coverGradient }">
            <!-- 左上角 badge -->
            <view class="absolute top-[20rpx] left-[20rpx] text-[20rpx] text-white px-[16rpx] py-[6rpx] rounded-[8rpx] z-1" style="background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);">
              {{ item.badge }}
            </view>
            <!-- 右上角分数 -->
            <view class="absolute top-20rpx right-20rpx text-[24rpx] text-white font-bold px-20rpx py-6rpx rounded-[12rpx] z-1" :style="{ background: item.scoreColor }">
              {{ item.score }}
            </view>
            <!-- 装饰元素 -->
            <view
              v-for="(deco, di) in item.decorations"
              :key="di"
              class="absolute rounded-full"
              :style="deco"
            />
          </view>
          <!-- 评分信息 -->
          <view class="p-[24rpx_28rpx]">
            <view class="flex items-center gap-[12rpx] mb-[12rpx]">
              <wd-rate
                v-model="item.rate"
                readonly
                size="28rpx"
                space="4rpx"
                color="#F59E0B"
              />
              <text class="text-[22rpx] font-semibold text-amber-500">{{ item.rateText }}</text>
            </view>
            <text class="block text-[30rpx] font-bold text-gray-900 leading-[1.5] mb-[8rpx]">{{ item.title }}</text>
            <text class="block text-[24rpx] text-gray-500 leading-[1.5]">{{ item.summary }}</text>
            <view class="flex items-center justify-between mt-[16rpx]">
              <view class="flex items-center gap-[8rpx]">
                <wd-icon name="view" size="24rpx" color="#9CA3AF" />
                <text class="text-[20rpx] text-gray-400">{{ item.views }} 阅读</text>
              </view>
              <text class="text-[20rpx] text-gray-400">{{ item.time }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToast } from '@/wd'

const toast = useToast()
const activeTab = ref('phone')

/* mock 评测数据 - 对照原型还原渐变色和装饰元素 */
const reviewData: Record<string, any[]> = {
  phone: [
    {
      title: 'iPhone 17 Pro Max 深度评测',
      summary: 'A20 仿生芯片加持，4800 万潜望长焦，屏下 Face ID 首秀',
      coverGradient: 'linear-gradient(135deg, #312e81, #4F46E5)',
      rate: 5,
      rateText: '5.0',
      score: '9.2',
      scoreColor: '#4F46E5',
      badge: '深度评测',
      views: '12.8万',
      time: '2小时前',
      decorations: [
        { bottom: '40rpx', left: '50%', transform: 'translateX(-50%)', width: '120rpx', height: '200rpx', border: '4rpx solid rgba(255,255,255,0.2)', borderRadius: '24rpx' },
      ],
    },
    {
      title: '华为 Mate 70 Pro vs 三星 S26 Ultra',
      summary: '两大旗舰正面对决：影像、性能、AI 功能全方位对比',
      coverGradient: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
      rate: 4,
      rateText: '4.5',
      score: '8.8',
      scoreColor: '#7C3AED',
      badge: '对比评测',
      views: '8.5万',
      time: '5小时前',
      decorations: [
        { bottom: '40rpx', left: '35%', width: '100rpx', height: '180rpx', border: '4rpx solid rgba(255,255,255,0.2)', borderRadius: '20rpx' },
        { bottom: '40rpx', left: '55%', width: '100rpx', height: '180rpx', border: '4rpx solid rgba(255,255,255,0.15)', borderRadius: '20rpx' },
      ],
    },
    {
      title: 'OPPO Find X8 Ultra 影像旗舰评测',
      summary: '哈苏联名四摄系统，10 倍光学变焦，夜景表现惊艳',
      coverGradient: 'linear-gradient(135deg, #059669, #34d399)',
      rate: 5,
      rateText: '4.8',
      score: '9.0',
      scoreColor: '#059669',
      badge: '首发评测',
      views: '6.2万',
      time: '昨天',
      decorations: [
        { bottom: '40rpx', left: '50%', transform: 'translateX(-50%)', width: '160rpx', height: '160rpx', border: '4rpx solid rgba(255,255,255,0.2)', borderRadius: '50%' },
      ],
    },
  ],
  pc: [
    {
      title: 'MacBook Pro M4 Max 评测：创作者的终极武器',
      summary: '40核GPU + 128GB统一内存，4K视频剪辑如丝般顺滑',
      coverGradient: 'linear-gradient(135deg, #1e3a5f, #3b82f6)',
      rate: 5,
      rateText: '4.9',
      score: '9.5',
      scoreColor: '#4F46E5',
      badge: '深度评测',
      views: '10.2万',
      time: '3小时前',
      decorations: [
        { bottom: '40rpx', left: '50%', transform: 'translateX(-50%)', width: '200rpx', height: '140rpx', border: '4rpx solid rgba(255,255,255,0.2)', borderRadius: '16rpx' },
      ],
    },
    {
      title: '联想 Legion Y9000P 2026 评测：性能怪兽',
      summary: '搭载Intel Ultra 9 285H处理器，RTX 5080显卡，散热全面升级',
      coverGradient: 'linear-gradient(135deg, #991b1b, #ef4444)',
      rate: 4,
      rateText: '4.5',
      score: '9.0',
      scoreColor: '#7C3AED',
      badge: '首发评测',
      views: '5.7万',
      time: '昨天',
      decorations: [
        { bottom: '40rpx', left: '50%', transform: 'translateX(-50%)', width: '200rpx', height: '140rpx', border: '4rpx solid rgba(255,255,255,0.15)', borderRadius: '16rpx' },
      ],
    },
    {
      title: 'Surface Pro 11 评测：AI PC 的标杆之作',
      summary: 'Snapdragon X Elite处理器，NPU性能强悍，ARM应用生态日趋完善',
      coverGradient: 'linear-gradient(135deg, #0e7490, #22d3ee)',
      rate: 4,
      rateText: '4.3',
      score: '8.7',
      scoreColor: '#059669',
      badge: '对比评测',
      views: '4.1万',
      time: '2天前',
      decorations: [
        { bottom: '40rpx', left: '50%', transform: 'translateX(-50%)', width: '180rpx', height: '120rpx', border: '4rpx solid rgba(255,255,255,0.2)', borderRadius: '16rpx' },
      ],
    },
  ],
  device: [
    {
      title: 'Apple Vision Pro 2 评测：空间计算新纪元',
      summary: '重量减轻40%，M4芯片驱动更精准的眼动追踪和手势识别',
      coverGradient: 'linear-gradient(135deg, #312e81, #6366f1)',
      rate: 5,
      rateText: '4.8',
      score: '9.3',
      scoreColor: '#4F46E5',
      badge: '深度评测',
      views: '15.6万',
      time: '4小时前',
      decorations: [
        { bottom: '40rpx', left: '50%', transform: 'translateX(-50%)', width: '200rpx', height: '120rpx', border: '4rpx solid rgba(255,255,255,0.2)', borderRadius: '60rpx' },
      ],
    },
    {
      title: 'DJI Mavic 5 Pro 评测：航拍新标杆',
      summary: '哈苏一英寸主摄，三向避障升级，续航46分钟',
      coverGradient: 'linear-gradient(135deg, #065f46, #34d399)',
      rate: 5,
      rateText: '4.7',
      score: '9.4',
      scoreColor: '#059669',
      badge: '首发评测',
      views: '7.8万',
      time: '昨天',
      decorations: [
        { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '120rpx', height: '120rpx', border: '4rpx solid rgba(255,255,255,0.2)', borderRadius: '50%' },
      ],
    },
    {
      title: 'Tesla Bot 二代评测：人形机器人走进家庭',
      summary: '全新关节驱动系统，可完成折叠衣物、整理房间等家务',
      coverGradient: 'linear-gradient(135deg, #5b21b6, #a78bfa)',
      rate: 4,
      rateText: '4.0',
      score: '8.0',
      scoreColor: '#7C3AED',
      badge: '体验评测',
      views: '20.3万',
      time: '2天前',
      decorations: [
        { bottom: '30rpx', left: '50%', transform: 'translateX(-50%)', width: '80rpx', height: '200rpx', border: '4rpx solid rgba(255,255,255,0.15)', borderRadius: '20rpx' },
      ],
    },
  ],
}

const currentList = computed(() => reviewData[activeTab.value] || [])

const onReviewTap = (item: any) => {
  toast.info(`查看评测：${item.title}`)
}
</script>

<style lang="scss" scoped>
:deep(.review-tabs) {
  --wd-tabs-nav-bg: #fff;
  --wd-tabs-active-color: #4F46E5;
  --wd-tabs-line-color: #4F46E5;
}
</style>
