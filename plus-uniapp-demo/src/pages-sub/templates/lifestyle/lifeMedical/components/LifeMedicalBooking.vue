<!-- 医疗健康 - 预约挂号 -->
<template>
  <view class="min-h-100vh bg-gray-50">
    <!-- 搜索 -->
    <view class="bg-white px-32rpx py-20rpx">
      <wd-search v-model="searchValue" placeholder="搜索医院或科室" :hide-cancel="true" @search="handleSearch" />
    </view>

    <scroll-view class="flex-1" scroll-y :show-scrollbar="false">
      <!-- 热门科室 -->
      <view class="bg-white mt-16rpx px-32rpx py-24rpx">
        <text class="text-sm font-bold text-gray-800 mb-16rpx block">热门科室</text>
        <scroll-view scroll-x :show-scrollbar="false" class="whitespace-nowrap">
          <view class="inline-flex">
            <view
              v-for="dept in hotDepartments"
              :key="dept"
              class="mr-16rpx"
              @click="handleDeptClick(dept)"
            >
              <wd-tag size="medium" round custom-style="background: #f0f9ff; color: #0ea5e9; border-color: #bae6fd;">{{ dept }}</wd-tag>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 附近医院 -->
      <view class="mx-32rpx mt-24rpx mb-24rpx">
        <text class="font-bold text-sm mb-24rpx block">附近医院</text>
        <view class="space-y-20rpx">
          <view
            v-for="hospital in hospitalList"
            :key="hospital.id"
            class="bg-white rounded-2xl p-24rpx"
            @click="handleHospitalClick(hospital)"
          >
            <view class="flex">
              <view class="w-128rpx h-128rpx rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                <text class="text-[56rpx]">🏥</text>
              </view>
              <view class="ml-20rpx flex-1">
                <text class="text-[26rpx] font-medium text-gray-800 block">{{ hospital.name }}</text>
                <view class="flex items-center mt-8rpx">
                  <wd-tag type="primary" size="small" custom-style="background: #0ea5e9; border-color: #0ea5e9;">{{ hospital.level }}</wd-tag>
                  <text class="text-[22rpx] text-gray-400 ml-12rpx">{{ hospital.distance }}</text>
                </view>
                <text class="text-[22rpx] text-gray-400 mt-8rpx block">{{ hospital.departments }}个科室</text>
                <view class="flex items-center justify-between mt-12rpx">
                  <text class="text-[22rpx] text-gray-400">{{ hospital.address }}</text>
                  <wd-tag v-if="hospital.bookable" type="success" size="small">可预约</wd-tag>
                </view>
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

const hotDepartments = ref(['内科', '外科', '妇产科', '儿科', '骨科', '皮肤科', '眼科', '口腔科', '中医科'])

interface HospitalItem {
  id: number
  name: string
  level: string
  distance: string
  departments: number
  address: string
  bookable: boolean
}

const hospitalList = ref<HospitalItem[]>([
  { id: 1, name: '浙江大学医学院附属第一医院', level: '三甲', distance: '2.3km', departments: 56, address: '庆春路79号', bookable: true },
  { id: 2, name: '浙江省人民医院', level: '三甲', distance: '3.1km', departments: 48, address: '上塘路158号', bookable: true },
  { id: 3, name: '杭州市第一人民医院', level: '三甲', distance: '4.5km', departments: 42, address: '浣纱路261号', bookable: true },
  { id: 4, name: '杭州市中医院', level: '三甲', distance: '5.2km', departments: 35, address: '体育场路453号', bookable: false },
  { id: 5, name: '西湖区社区卫生服务中心', level: '社区', distance: '0.8km', departments: 12, address: '文一西路969号', bookable: true },
])

const handleSearch = () => toast.info(`搜索: ${searchValue.value}`)
const handleDeptClick = (dept: string) => toast.info(`科室: ${dept}`)
const handleHospitalClick = (hospital: HospitalItem) => toast.info(`${hospital.name}`)
</script>

<style lang="scss" scoped></style>
