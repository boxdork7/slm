<!-- 医疗健康 - 首页 -->
<template>
  <view class="min-h-100vh bg-gray-50">
    <!-- 搜索栏 -->
    <view class="bg-gradient-to-b from-sky-500 to-sky-50 px-32rpx pb-32rpx pt-16rpx">
      <wd-search v-model="searchValue" placeholder="搜索症状、医院、医生..." :hide-cancel="true" custom-class="medical-search" @search="handleSearch" />
    </view>

    <scroll-view class="flex-1" scroll-y :show-scrollbar="false">
      <!-- 快捷入口宫格 -->
      <view class="bg-white mx-32rpx mt-24rpx rounded-2xl px-16rpx py-24rpx">
        <view class="grid grid-cols-4 gap-16rpx">
          <view
            v-for="item in quickEntries"
            :key="item.title"
            class="flex flex-col items-center gap-8rpx py-8rpx"
            @click="handleEntryClick(item)"
          >
            <text class="text-[44rpx]">{{ item.emoji }}</text>
            <text class="text-[22rpx] text-gray-700">{{ item.title }}</text>
          </view>
        </view>
      </view>

      <!-- 健康提醒卡片 -->
      <view class="mx-32rpx mt-24rpx bg-gradient-to-br from-sky-500 to-cyan-400 rounded-2xl px-32rpx py-32rpx relative overflow-hidden">
        <!-- 装饰圆 -->
        <view class="absolute -right-40rpx -top-40rpx w-200rpx h-200rpx rounded-full bg-white/10" />
        <view class="absolute -left-20rpx -bottom-20rpx w-120rpx h-120rpx rounded-full bg-white/5" />
        <!-- 内容 -->
        <view class="relative z-10">
          <wd-tag size="small" round custom-style="background: rgba(255,255,255,0.25); color: #fff; border: none;">健康提醒</wd-tag>
          <text class="text-white font-bold text-base mt-16rpx block">春季疫苗接种提醒</text>
          <text class="text-white/80 text-[24rpx] mt-8rpx block">流感高发季，建议及时接种流感疫苗</text>
          <view class="mt-20rpx">
            <wd-button size="small" round custom-style="background: #fff; color: #0ea5e9; border: none;" @click="handleHealthTip">了解详情</wd-button>
          </view>
        </view>
      </view>

      <!-- 推荐医生 -->
      <view class="mx-32rpx mt-24rpx mb-24rpx">
        <text class="font-bold text-sm mb-24rpx block">推荐医生</text>
        <view class="space-y-20rpx">
          <view
            v-for="doctor in doctorList"
            :key="doctor.id"
            class="bg-white rounded-2xl p-24rpx flex"
            @click="handleDoctorClick"
          >
            <view class="w-112rpx h-112rpx rounded-full bg-sky-50 flex items-center justify-center flex-shrink-0">
              <text class="text-[48rpx]">{{ doctor.emoji }}</text>
            </view>
            <view class="ml-20rpx flex-1">
              <view class="flex items-center">
                <text class="text-[26rpx] font-medium text-gray-800">{{ doctor.name }}</text>
                <text class="text-[20rpx] text-gray-500 ml-12rpx">{{ doctor.title }}</text>
              </view>
              <text class="text-[22rpx] text-sky-500 mt-4rpx block">{{ doctor.department }}</text>
              <text class="text-[20rpx] text-gray-400 mt-4rpx block line-clamp-1">擅长：{{ doctor.specialty }}</text>
              <view class="flex items-center justify-between mt-12rpx">
                <view class="flex items-center">
                  <wd-icon name="star-fill" size="24rpx" color="#facc15" />
                  <text class="text-[22rpx] text-gray-700 ml-4rpx">{{ doctor.rating }}</text>
                  <text class="text-[22rpx] text-gray-400 ml-16rpx">问诊{{ doctor.consultCount }}</text>
                </view>
                <wd-button type="primary" size="small" custom-style="background: #0ea5e9; border-color: #0ea5e9;">咨询</wd-button>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { useToast } from '@/wd'

const toast = useToast()
const searchValue = ref('')

const quickEntries = ref([
  { title: '在线问诊', emoji: '🩺' }, { title: '预约挂号', emoji: '📅' },
  { title: '健康体检', emoji: '🏥' }, { title: '药品购买', emoji: '💊' },
  { title: '报告查询', emoji: '📋' }, { title: '健康百科', emoji: '📖' },
  { title: '急救指南', emoji: '🚑' }, { title: '更多服务', emoji: '📦' },
])

const doctorList = ref([
  { id: 1, name: '张主任', emoji: '👨‍⚕️', title: '主任医师', department: '内科', specialty: '高血压、糖尿病、心血管疾病', rating: '4.9', consultCount: '3256' },
  { id: 2, name: '李医生', emoji: '👩‍⚕️', title: '副主任医师', department: '皮肤科', specialty: '湿疹、痤疮、皮肤过敏', rating: '4.8', consultCount: '2180' },
  { id: 3, name: '王教授', emoji: '👨‍⚕️', title: '教授', department: '骨科', specialty: '腰椎间盘突出、关节疼痛', rating: '4.9', consultCount: '5600' },
  { id: 4, name: '刘医生', emoji: '👩‍⚕️', title: '主治医师', department: '儿科', specialty: '小儿感冒、发热、腹泻', rating: '4.7', consultCount: '1890' },
])

const handleSearch = () => toast.info(`搜索: ${searchValue.value}`)
const handleHealthTip = () => toast.info('疫苗接种详情')
const handleEntryClick = (item: { title: string }) => {
  if (item.title === '在线问诊') uni.$emit('switchTab', 1)
  else if (item.title === '预约挂号') uni.$emit('switchTab', 2)
  else toast.info(item.title)
}
const handleDoctorClick = () => uni.$emit('switchTab', 1)
</script>

<style lang="scss" scoped>
:deep(.medical-search) {
  background: transparent !important;
  padding: 0 !important;
}
</style>
