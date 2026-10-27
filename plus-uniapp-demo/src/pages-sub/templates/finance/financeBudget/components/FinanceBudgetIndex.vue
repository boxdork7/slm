<!-- 预算管理 - 首页 -->
<template>
  <view class="min-h-screen bg-#f5f5f5">
    <!-- 金色渐变头部 -->
    <view
      class="relative overflow-hidden px-40rpx pt-24rpx pb-96rpx"
      style="background: linear-gradient(135deg, #F59E0B, #D97706)"
    >
      <!-- 装饰圆 -->
      <view class="absolute w-384rpx h-384rpx rounded-full bg-white/10 -top-80rpx -right-80rpx" />
      <view class="absolute w-320rpx h-320rpx rounded-full bg-white/10 -bottom-128rpx right-128rpx" />
      <view class="absolute w-256rpx h-256rpx rounded-full bg-white/10 top-40rpx -left-80rpx" />

      <!-- 标题行 -->
      <view class="flex justify-between items-center mb-40rpx relative z-1">
        <view>
          <text class="text-24rpx text-white/80 block">4月预算</text>
          <text class="text-60rpx font-700 text-white block mt-8rpx">¥8,000.00</text>
        </view>
        <view class="w-80rpx h-80rpx bg-white/20 rounded-full flex items-center justify-center">
          <wd-icon name="notification" color="white" size="40rpx" />
        </view>
      </view>

      <!-- 已花费/剩余 -->
      <view class="flex gap-32rpx relative z-1">
        <view class="flex-1 bg-white/15 rounded-32rpx px-32rpx py-24rpx text-center">
          <text class="text-24rpx text-white/70 block">已支出</text>
          <text class="text-40rpx font-700 text-white block">¥3,260</text>
        </view>
        <view class="flex-1 bg-white/15 rounded-32rpx px-32rpx py-24rpx text-center">
          <text class="text-24rpx text-white/70 block">剩余</text>
          <text class="text-40rpx font-700 text-white block">¥4,740</text>
        </view>
      </view>
    </view>

    <!-- 预算进度卡片 -->
    <view class="mx-40rpx -mt-48rpx bg-white rounded-32rpx p-40rpx shadow-sm relative z-2">
      <view class="flex justify-between items-center mb-24rpx">
        <text class="text-28rpx font-600 text-#1f2937">预算使用进度</text>
        <text class="text-24rpx text-#F59E0B font-600">40.8%</text>
      </view>
      <view class="w-full h-24rpx bg-#f3f4f6 rounded-full overflow-hidden">
        <view
          class="h-full rounded-full"
          style="width: 40.8%; background: linear-gradient(90deg, #F59E0B, #FBBF24)"
        />
      </view>
      <view class="flex justify-between mt-16rpx">
        <text class="text-20rpx text-#9ca3af">本月已过 47%</text>
        <text class="text-20rpx text-#22c55e">💰 进度良好</text>
      </view>
    </view>

    <!-- 快捷操作 -->
    <view class="mx-40rpx mt-40rpx grid grid-cols-4 gap-24rpx">
      <view
        v-for="item in quickActions"
        :key="item.name"
        class="flex flex-col items-center gap-8rpx"
      >
        <view
          class="w-96rpx h-96rpx rounded-32rpx flex items-center justify-center"
          :class="item.bgClass"
        >
          <text class="text-48rpx">{{ item.icon }}</text>
        </view>
        <text class="text-22rpx text-#4b5563">{{ item.name }}</text>
      </view>
    </view>

    <!-- 分类预算 -->
    <view class="mx-40rpx mt-48rpx">
      <view class="flex justify-between items-center mb-24rpx">
        <text class="text-32rpx font-700 text-#1f2937">分类预算</text>
        <text class="text-24rpx text-#F59E0B">查看全部 ›</text>
      </view>

      <view class="flex flex-col gap-24rpx">
        <view
          v-for="item in budgetCategories"
          :key="item.name"
          class="bg-white rounded-32rpx p-32rpx shadow-sm"
        >
          <view class="flex justify-between items-center mb-16rpx">
            <view class="flex items-center gap-24rpx">
              <view
                class="w-80rpx h-80rpx rounded-20rpx flex items-center justify-center"
                :class="item.bgClass"
              >
                <text class="text-40rpx">{{ item.icon }}</text>
              </view>
              <view>
                <text class="text-28rpx font-600 text-#1f2937 block">{{ item.name }}</text>
                <text class="text-22rpx text-#9ca3af block">预算 ¥{{ item.budget }}</text>
              </view>
            </view>
            <view class="text-right">
              <text class="text-28rpx font-700 text-#1f2937 block">¥{{ item.spent }}</text>
              <text class="text-20rpx block" :class="item.percentColor">{{ item.percent }}%</text>
            </view>
          </view>
          <view class="w-full h-16rpx bg-#f3f4f6 rounded-full overflow-hidden">
            <view
              class="h-full rounded-full"
              :class="item.barColor"
              :style="{ width: item.percent + '%' }"
            />
          </view>
        </view>
      </view>
    </view>

    <!-- 今日账单 -->
    <view class="mx-40rpx mt-48rpx mb-32rpx">
      <view class="flex justify-between items-center mb-24rpx">
        <text class="text-32rpx font-700 text-#1f2937">今日账单</text>
        <text class="text-24rpx text-#F59E0B">全部 ›</text>
      </view>

      <view class="bg-white rounded-32rpx overflow-hidden shadow-sm">
        <view
          v-for="(item, index) in todayBills"
          :key="item.name"
          class="flex items-center px-32rpx py-24rpx"
          :style="index < todayBills.length - 1 ? 'border-bottom: 1px solid #f9fafb' : ''"
        >
          <view
            class="w-80rpx h-80rpx rounded-20rpx flex items-center justify-center mr-24rpx"
            :class="item.bgClass"
          >
            <text class="text-36rpx">{{ item.icon }}</text>
          </view>
          <view class="flex-1">
            <text class="text-28rpx font-500 text-#1f2937 block">{{ item.name }}</text>
            <text class="text-22rpx text-#9ca3af block">{{ item.category }} · {{ item.time }}</text>
          </view>
          <text class="text-28rpx font-700" :class="item.amountColor">{{ item.amount }}</text>
        </view>
      </view>
    </view>

    <!-- 底部留空 -->
    <view class="h-32rpx" />
  </view>
</template>

<script setup lang="ts">
const quickActions = [
  { icon: '💸', name: '记支出', bgClass: 'bg-#fef2f2' },
  { icon: '💰', name: '记收入', bgClass: 'bg-#f0fdf4' },
  { icon: '📊', name: '统计', bgClass: 'bg-#eff6ff' },
  { icon: '🎯', name: '预算', bgClass: 'bg-#faf5ff' },
]

const budgetCategories = [
  { icon: '🍜', name: '餐饮美食', budget: '2,000', spent: '1,280', percent: 64, bgClass: 'bg-#fff7ed', barColor: 'bg-#fb923c', percentColor: 'text-#f97316' },
  { icon: '🚗', name: '交通出行', budget: '800', spent: '320', percent: 40, bgClass: 'bg-#eff6ff', barColor: 'bg-#60a5fa', percentColor: 'text-#22c55e' },
  { icon: '🛍️', name: '购物消费', budget: '1,500', spent: '860', percent: 57, bgClass: 'bg-#fdf2f8', barColor: 'bg-#f472b6', percentColor: 'text-#f59e0b' },
  { icon: '🎮', name: '休闲娱乐', budget: '600', spent: '180', percent: 30, bgClass: 'bg-#faf5ff', barColor: 'bg-#a78bfa', percentColor: 'text-#22c55e' },
]

const todayBills = [
  { icon: '☕', name: '咖啡', category: '餐饮美食', time: '14:30', amount: '-¥28.00', bgClass: 'bg-#fef2f2', amountColor: 'text-#ef4444' },
  { icon: '💼', name: '工资到账', category: '收入', time: '10:00', amount: '+¥12,000', bgClass: 'bg-#f0fdf4', amountColor: 'text-#22c55e' },
  { icon: '🚇', name: '地铁', category: '交通出行', time: '08:15', amount: '-¥5.00', bgClass: 'bg-#eff6ff', amountColor: 'text-#ef4444' },
]
</script>

<style scoped lang="scss"></style>
