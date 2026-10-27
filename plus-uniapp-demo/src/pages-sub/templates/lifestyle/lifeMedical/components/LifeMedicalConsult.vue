<!-- 医疗健康 - 问诊 -->
<template>
  <view class="min-h-100vh bg-gray-50">
    <!-- Tab 切换 -->
    <view class="bg-white">
      <wd-tabs v-model="activeTab">
        <wd-tab title="图文问诊" name="text" />
        <wd-tab title="视频问诊" name="video" />
        <wd-tab title="电话问诊" name="phone" />
      </wd-tabs>
    </view>

    <scroll-view class="flex-1" scroll-y :show-scrollbar="false">
      <!-- 选择科室 -->
      <view class="mx-32rpx mt-24rpx bg-white rounded-2xl px-16rpx py-24rpx">
        <text class="text-sm font-bold text-gray-800 px-16rpx mb-16rpx block">选择科室</text>
        <view class="grid grid-cols-4 gap-12rpx">
          <view
            v-for="dept in departments"
            :key="dept.name"
            class="flex flex-col items-center gap-8rpx py-12rpx rounded-xl"
            :class="selectedDept === dept.name ? 'bg-sky-50' : ''"
            @click="selectedDept = dept.name"
          >
            <text class="text-[40rpx]">{{ dept.emoji }}</text>
            <text class="text-[22rpx]" :class="selectedDept === dept.name ? 'text-sky-500 font-medium' : 'text-gray-600'">{{ dept.name }}</text>
          </view>
        </view>
      </view>

      <!-- 在线医生列表 -->
      <view class="mx-32rpx mt-24rpx mb-24rpx">
        <text class="font-bold text-sm mb-24rpx block">在线医生</text>
        <view class="space-y-20rpx">
          <view
            v-for="doctor in onlineDoctors"
            :key="doctor.id"
            class="bg-white rounded-2xl p-24rpx"
          >
            <view class="flex">
              <view class="w-96rpx h-96rpx rounded-full bg-sky-50 flex items-center justify-center flex-shrink-0">
                <text class="text-[44rpx]">{{ doctor.emoji }}</text>
              </view>
              <view class="ml-20rpx flex-1">
                <view class="flex items-center">
                  <text class="text-[26rpx] font-medium text-gray-800">{{ doctor.name }}</text>
                  <text class="text-[20rpx] text-gray-500 ml-8rpx">{{ doctor.title }}</text>
                  <view class="w-12rpx h-12rpx rounded-full bg-green-500 ml-8rpx" />
                </view>
                <text class="text-[22rpx] text-sky-500 mt-4rpx block">{{ doctor.department }}</text>
                <text class="text-[20rpx] text-gray-400 mt-4rpx block line-clamp-1">擅长：{{ doctor.specialty }}</text>
              </view>
            </view>
            <view class="flex items-center justify-between mt-16rpx pt-16rpx border-t border-gray-50">
              <view class="flex items-center">
                <wd-icon name="star-fill" size="24rpx" color="#facc15" />
                <text class="text-[22rpx] text-gray-700 ml-4rpx">{{ doctor.rating }}</text>
                <text class="text-[22rpx] text-gray-400 ml-16rpx">好评{{ doctor.goodRate }}</text>
              </view>
              <view class="flex items-center">
                <text class="text-sky-500 font-bold text-sm mr-16rpx">¥{{ doctor.price }}</text>
                <wd-button type="primary" size="small" custom-style="background: #0ea5e9; border-color: #0ea5e9;">立即咨询</wd-button>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
const activeTab = ref('text')
const selectedDept = ref('内科')

const departments = ref([
  { name: '内科', emoji: '🫀' }, { name: '外科', emoji: '🔪' },
  { name: '妇科', emoji: '👩' }, { name: '儿科', emoji: '👶' },
  { name: '皮肤科', emoji: '🧴' }, { name: '眼科', emoji: '👁️' },
  { name: '口腔科', emoji: '🦷' }, { name: '更多', emoji: '📋' },
])

const onlineDoctors = ref([
  { id: 1, name: '张主任', emoji: '👨‍⚕️', title: '主任医师', department: '内科', specialty: '高血压、糖尿病、心血管疾病', rating: '4.9', goodRate: '99%', price: '30' },
  { id: 2, name: '李医生', emoji: '👩‍⚕️', title: '副主任医师', department: '皮肤科', specialty: '湿疹、痤疮、皮肤过敏', rating: '4.8', goodRate: '98%', price: '25' },
  { id: 3, name: '王教授', emoji: '👨‍⚕️', title: '教授', department: '骨科', specialty: '腰椎间盘突出、关节疼痛', rating: '4.9', goodRate: '99%', price: '50' },
  { id: 4, name: '赵医生', emoji: '👩‍⚕️', title: '主治医师', department: '内科', specialty: '感冒、发热、消化不良', rating: '4.6', goodRate: '96%', price: '15' },
])
</script>

<style lang="scss" scoped></style>
