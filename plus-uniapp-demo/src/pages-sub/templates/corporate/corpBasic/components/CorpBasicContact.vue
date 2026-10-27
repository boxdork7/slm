<!-- 企业官网 - 联系我们 -->
<template>
  <view class="min-h-screen bg-#f5f5f5">
    <!-- 页面标题 -->
    <view class="bg-white px-40rpx pt-24rpx pb-32rpx">
      <text class="text-40rpx font-700 text-#1f2937">联系我们</text>
    </view>

    <!-- 联系方式 -->
    <view class="mx-40rpx mt-32rpx bg-white rounded-32rpx overflow-hidden shadow-sm">
      <view
        v-for="(item, index) in contactList"
        :key="item.label"
        class="flex items-center px-40rpx py-32rpx"
        :style="index < contactList.length - 1 ? 'border-bottom: 1px solid #f9fafb' : ''"
      >
        <view
          class="w-80rpx h-80rpx rounded-20rpx flex items-center justify-center mr-24rpx"
          :class="item.bgClass"
        >
          <text class="text-36rpx">{{ item.icon }}</text>
        </view>
        <view class="flex-1">
          <text class="text-28rpx font-600 text-#1f2937 block">{{ item.label }}</text>
          <text class="text-24rpx block mt-4rpx" :class="item.valueColor">{{ item.value }}</text>
        </view>
        <wd-icon v-if="item.showArrow" name="arrow-right" size="32rpx" color="#d1d5db" />
      </view>
    </view>

    <!-- 在线留言表单 -->
    <view class="mx-40rpx mt-40rpx bg-white rounded-32rpx p-40rpx shadow-sm">
      <text class="text-32rpx font-700 text-#1f2937 block mb-32rpx">在线留言</text>
      <view class="flex flex-col gap-24rpx">
        <view>
          <text class="text-24rpx text-#6b7280 block mb-12rpx">您的姓名</text>
          <wd-input
            v-model="form.name"
            placeholder="请输入姓名"
            no-border
            custom-style="background: #f9fafb; border-radius: 24rpx; padding: 4rpx 16rpx;"
          />
        </view>
        <view>
          <text class="text-24rpx text-#6b7280 block mb-12rpx">联系电话</text>
          <wd-input
            v-model="form.phone"
            placeholder="请输入手机号"
            no-border
            custom-style="background: #f9fafb; border-radius: 24rpx; padding: 4rpx 16rpx;"
          />
        </view>
        <view>
          <text class="text-24rpx text-#6b7280 block mb-12rpx">公司名称</text>
          <wd-input
            v-model="form.company"
            placeholder="请输入公司名称"
            no-border
            custom-style="background: #f9fafb; border-radius: 24rpx; padding: 4rpx 16rpx;"
          />
        </view>
        <view>
          <text class="text-24rpx text-#6b7280 block mb-12rpx">咨询内容</text>
          <wd-textarea
            v-model="form.content"
            placeholder="请描述您的需求..."
            :maxlength="500"
            no-border
            custom-style="background: #f9fafb; border-radius: 24rpx; padding: 16rpx 24rpx; min-height: 192rpx;"
          />
        </view>
        <view
          class="w-full py-20rpx rounded-24rpx text-center"
          style="background: linear-gradient(135deg, #1E40AF, #3B82F6)"
          @tap="handleSubmit"
        >
          <text class="text-28rpx text-white font-500">提交留言</text>
        </view>
      </view>
    </view>

    <!-- 地图占位 -->
    <view class="mx-40rpx mt-40rpx mb-32rpx bg-white rounded-32rpx overflow-hidden shadow-sm">
      <view class="h-320rpx bg-#eff6ff flex items-center justify-center">
        <view class="text-center">
          <text class="text-60rpx block mb-8rpx">📍</text>
          <text class="text-24rpx text-#9ca3af">地图 · 张江高科技园区</text>
        </view>
      </view>
      <view class="px-32rpx py-24rpx flex items-center justify-between">
        <text class="text-24rpx text-#4b5563">上海市浦东新区张江路 1688 号</text>
        <text class="text-24rpx text-#1E40AF font-500">导航 ›</text>
      </view>
    </view>

    <!-- 底部留空 -->
    <view class="h-32rpx" />
  </view>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useToast } from '@/wd'

const toast = useToast()

const contactList = [
  { icon: '📞', label: '客服热线', value: '400-888-9999', bgClass: 'bg-#eff6ff', valueColor: 'text-#1E40AF', showArrow: true },
  { icon: '📧', label: '商务邮箱', value: 'business@techcorp.com', bgClass: 'bg-#f0fdf4', valueColor: 'text-#9ca3af', showArrow: true },
  { icon: '🏢', label: '公司地址', value: '上海市浦东新区张江高科技园区', bgClass: 'bg-#fffbeb', valueColor: 'text-#9ca3af', showArrow: true },
  { icon: '🕐', label: '工作时间', value: '周一至周五 9:00 - 18:00', bgClass: 'bg-#faf5ff', valueColor: 'text-#9ca3af', showArrow: false },
]

const form = reactive({
  name: '',
  phone: '',
  company: '',
  content: '',
})

const handleSubmit = () => {
  if (!form.name || !form.phone) {
    toast.warning('请填写姓名和联系电话')
    return
  }
  toast.success('留言提交成功')
  form.name = ''
  form.phone = ''
  form.company = ''
  form.content = ''
}
</script>

<style scoped lang="scss"></style>
