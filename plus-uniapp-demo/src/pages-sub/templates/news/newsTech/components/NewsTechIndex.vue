<!-- 科技新闻首页/推荐 -->
<template>
  <view class="min-h-100vh bg-gray-100">
    <!-- 靛蓝背景搜索区域 -->
    <view class="bg-[#4F46E5]" style="padding: 0 32rpx 24rpx; padding-top: calc(var(--status-bar-height, 47px) + 20rpx);">
      <view class="bg-white/15 rounded-[40rpx] px-[28rpx] py-[16rpx] flex items-center gap-[16rpx]">
        <wd-icon name="search" size="32rpx" color="rgba(255,255,255,0.7)" />
        <text class="text-[26rpx] text-white/60">搜索科技资讯、产品评测...</text>
      </view>
    </view>

    <view class="px-32rpx">
      <!-- 科技头条大图 -->
      <view
        class="relative mt-[24rpx] rounded-[24rpx] overflow-hidden h-[360rpx]"
        style="background: linear-gradient(135deg, #312e81, #4F46E5, #6366f1);"
        @click="onHeroTap"
      >
        <!-- 渐变覆盖层 -->
        <view class="absolute inset-0" style="background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);" />
        <!-- 头条标签 -->
        <view class="absolute top-[24rpx] left-[24rpx] z-2">
          <wd-tag custom-style="background: #EF4444; color: #fff; border: none;" size="small">头条</wd-tag>
        </view>
        <!-- 装饰圆环 -->
        <view class="absolute top-[40rpx] right-[40rpx] w-[160rpx] h-[160rpx] rounded-full" style="border: 4rpx solid rgba(255,255,255,0.15);" />
        <view class="absolute top-[80rpx] right-[80rpx] w-[80rpx] h-[80rpx] rounded-full" style="border: 4rpx solid rgba(255,255,255,0.1);" />
        <!-- 底部文字 -->
        <view class="absolute bottom-0 left-0 right-0 p-[32rpx] z-1">
          <text class="block text-[32rpx] font-bold text-white leading-[1.4]">{{ heroNews.title }}</text>
          <text class="block text-[22rpx] text-white/70 mt-[12rpx]">{{ heroNews.desc }}</text>
        </view>
      </view>

      <!-- 分类标签横滚 -->
      <scroll-view scroll-x class="mt-24rpx -mx-32rpx px-32rpx whitespace-nowrap" :show-scrollbar="false">
        <view class="inline-flex gap-[16rpx] py-[8rpx]">
          <view
            v-for="(cat, idx) in categories"
            :key="idx"
            class="inline-flex items-center py-[12rpx] px-[28rpx] rounded-full flex-shrink-0"
            :class="activeCat === idx ? 'bg-[#4F46E5] text-white' : 'bg-indigo-50 text-indigo-600'"
            @click="activeCat = idx"
          >
            <text class="text-[24rpx]" :class="activeCat === idx ? 'text-white' : 'text-indigo-600'">{{ cat }}</text>
          </view>
        </view>
      </scroll-view>

      <!-- 科技资讯列表 -->
      <view class="mt-[24rpx] pb-[40rpx]">
        <view
          v-for="(item, idx) in newsList"
          :key="idx"
          class="flex gap-[24rpx] py-[28rpx]"
          :class="idx < newsList.length - 1 ? 'border-b border-gray-100' : ''"
          @click="onNewsTap(item)"
        >
          <view class="flex-1 min-w-0 flex flex-col">
            <text class="text-[28rpx] font-semibold text-gray-900 leading-[1.5] line-clamp-2">{{ item.title }}</text>
            <text class="text-[24rpx] text-gray-500 mt-[12rpx] leading-[1.5] line-clamp-1">{{ item.desc }}</text>
            <view class="flex items-center gap-[16rpx] mt-[16rpx]">
              <wd-tag custom-style="background: #EEF2FF; color: #4F46E5; border: none;" size="small">{{ item.source }}</wd-tag>
              <text class="text-[20rpx] text-gray-400">{{ item.time }}</text>
            </view>
          </view>
          <view
            class="w-[180rpx] h-[136rpx] rounded-[16rpx] flex-shrink-0"
            :style="{ background: item.gradient }"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/wd'

const toast = useToast()
const activeCat = ref(0)

/* 头条大图 */
const heroNews = ref({
  title: 'GPT-5 正式发布：多模态推理能力提升300%',
  desc: 'OpenAI 宣布新一代大模型，AGI 进程再加速',
})

/* 分类标签 - 对照原型纯文本 */
const categories = ref([
  '推荐', 'AI', '手机', '电脑', '智能家居', '汽车', '芯片', 'VR/AR', '区块链',
])

/* 资讯列表 - 右侧用渐变色块代替图片 */
const newsList = ref([
  {
    title: '苹果 M5 芯片跑分曝光：性能暴涨，AI 算力翻倍',
    desc: '搭载全新 Neural Engine 的 M5 芯片在 Geekbench 中表现惊人',
    source: '36氪',
    time: '25分钟前',
    gradient: 'linear-gradient(135deg, #c7d2fe, #a5b4fc)',
  },
  {
    title: '特斯拉 FSD V14 在中国获批，年底全量推送',
    desc: '马斯克称这是自动驾驶进入中国市场的里程碑时刻',
    source: '虎嗅',
    time: '1小时前',
    gradient: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
  },
  {
    title: '华为 Mate 70 系列搭载鸿蒙 NEXT 5.0 发布',
    desc: '首款纯血鸿蒙旗舰手机，生态应用突破百万',
    source: '钛媒体',
    time: '2小时前',
    gradient: 'linear-gradient(135deg, #ddd6fe, #c4b5fd)',
  },
  {
    title: '小米 SU9 谍照流出：定位百万级纯电超跑',
    desc: '风阻系数仅 0.19，对标保时捷 Taycan',
    source: '极客公园',
    time: '3小时前',
    gradient: 'linear-gradient(135deg, #fce7f3, #f9a8d4)',
  },
  {
    title: '英伟达发布 RTX 6090：光追性能提升 2 倍',
    desc: '采用 Blackwell 架构，DLSS 4.0 帧生成技术引关注',
    source: '爱范儿',
    time: '4小时前',
    gradient: 'linear-gradient(135deg, #d1fae5, #6ee7b7)',
  },
])

const onHeroTap = () => {
  toast.info('查看头条详情')
}

const onNewsTap = (item: any) => {
  toast.info(`查看：${item.title}`)
}
</script>

<style lang="scss" scoped>
/* 无需额外样式 */
</style>
