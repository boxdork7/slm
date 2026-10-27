<!-- 基础商城 - 分类 -->
<template>
  <view class="h-100vh flex flex-col bg-gray-50">
    <!-- 搜索栏 -->
    <view class="bg-white px-32rpx py-20rpx">
      <wd-search v-model="searchValue" placeholder="搜索商品" :hide-cancel="true" @search="handleSearch" @clear="handleClear" />
    </view>

    <!-- 分类主体：左侧栏 + 右侧内容 -->
    <view class="category-wrapper">
      <!-- 左侧分类栏 -->
      <wd-sidebar v-model="activeCategory" @change="handleChange">
        <wd-sidebar-item
          v-for="(item, index) in categoryList"
          :key="item.id"
          :value="index"
          :label="item.name"
        />
      </wd-sidebar>

      <!-- 右侧内容 -->
      <scroll-view
        class="category-content"
        scroll-y
        :scroll-with-animation="true"
        :show-scrollbar="false"
      >
        <!-- 分类 Banner -->
        <view class="px-24rpx pt-24rpx">
          <view class="h-160rpx rounded-xl bg-gradient-to-r from-[#FF6B35] to-orange-400 flex items-center px-32rpx">
            <view>
              <text class="text-sm font-bold text-white block">{{ categoryList[activeCategory]?.name }}</text>
              <text class="text-[20rpx] text-white/80 mt-4rpx block">精选品牌 品质保障</text>
            </view>
          </view>
        </view>

        <!-- 二级分类列表 -->
        <view
          v-for="subCategory in categoryList[activeCategory]?.children"
          :key="subCategory.id"
          class="px-24rpx pt-32rpx"
        >
          <text class="text-sm font-bold text-gray-800 mb-24rpx block">{{ subCategory.name }}</text>
          <view class="grid grid-cols-3 gap-16rpx">
            <view
              v-for="goods in subCategory.goodsList.slice(0, 6)"
              :key="goods.id"
              class="flex flex-col items-center"
              @click="goDetail(goods.id)"
            >
              <view class="w-144rpx h-144rpx rounded-xl bg-gray-50 overflow-hidden">
                <wd-img :src="goods.img" width="100%" height="144rpx" mode="aspectFill" />
              </view>
              <text class="text-[22rpx] text-gray-600 mt-12rpx text-center">{{ goods.name }}</text>
              <text class="text-[20rpx] text-[#FF6B35] font-medium">¥{{ goods.price }}</text>
            </view>
          </view>
        </view>

        <!-- 底部占位 -->
        <view class="h-48rpx" />
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useToast } from '@/wd'

const toast = useToast()
const searchValue = ref('')
const activeCategory = ref(0)

/** 商品接口 */
interface GoodsItem {
  id: number
  name: string
  img: string
  price: string
}

/** 二级分类接口 */
interface SubCategory {
  id: number
  name: string
  goodsList: GoodsItem[]
}

/** 一级分类接口 */
interface Category {
  id: number
  name: string
  children: SubCategory[]
}

/** 分类列表 */
const categoryList = ref<Category[]>([
  {
    id: 1,
    name: '手机通讯',
    children: [
      {
        id: 11,
        name: '苹果手机',
        goodsList: [
          { id: 1, name: 'iPhone 15 Pro', img: 'https://picsum.photos/144/144?random=11', price: '8,999' },
          { id: 2, name: 'iPhone 15', img: 'https://picsum.photos/144/144?random=12', price: '5,999' },
          { id: 3, name: 'iPhone SE', img: 'https://picsum.photos/144/144?random=13', price: '3,299' },
        ],
      },
      {
        id: 12,
        name: '安卓手机',
        goodsList: [
          { id: 7, name: '小米 14 Pro', img: 'https://picsum.photos/144/144?random=21', price: '4,999' },
          { id: 8, name: '华为 Mate60', img: 'https://picsum.photos/144/144?random=22', price: '5,999' },
          { id: 9, name: 'OPPO Find X7', img: 'https://picsum.photos/144/144?random=23', price: '3,999' },
        ],
      },
      {
        id: 13,
        name: '手机配件',
        goodsList: [
          { id: 13, name: '手机壳', img: 'https://picsum.photos/144/144?random=31', price: '99' },
          { id: 14, name: '充电器', img: 'https://picsum.photos/144/144?random=32', price: '199' },
          { id: 15, name: '无线充电', img: 'https://picsum.photos/144/144?random=33', price: '299' },
        ],
      },
    ],
  },
  {
    id: 2,
    name: '电脑办公',
    children: [
      {
        id: 21,
        name: '笔记本电脑',
        goodsList: [
          { id: 21, name: 'MacBook Pro 14', img: 'https://picsum.photos/144/144?random=41', price: '17,999' },
          { id: 22, name: 'MacBook Air 13', img: 'https://picsum.photos/144/144?random=42', price: '8,999' },
          { id: 23, name: '联想ThinkPad', img: 'https://picsum.photos/144/144?random=43', price: '6,999' },
        ],
      },
      {
        id: 22,
        name: '办公设备',
        goodsList: [
          { id: 33, name: '打印机', img: 'https://picsum.photos/144/144?random=61', price: '1,299' },
          { id: 34, name: '键盘', img: 'https://picsum.photos/144/144?random=63', price: '499' },
          { id: 35, name: '显示器', img: 'https://picsum.photos/144/144?random=65', price: '1,999' },
        ],
      },
    ],
  },
  {
    id: 3,
    name: '数码配件',
    children: [
      {
        id: 31,
        name: '智能手表',
        goodsList: [
          { id: 41, name: 'Apple Watch S9', img: 'https://picsum.photos/144/144?random=71', price: '2,999' },
          { id: 42, name: '小米手表', img: 'https://picsum.photos/144/144?random=73', price: '999' },
          { id: 43, name: '华为Watch GT', img: 'https://picsum.photos/144/144?random=74', price: '1,299' },
        ],
      },
      {
        id: 32,
        name: '耳机音响',
        goodsList: [
          { id: 47, name: 'AirPods Pro 2', img: 'https://picsum.photos/144/144?random=81', price: '1,899' },
          { id: 48, name: 'AirPods Max', img: 'https://picsum.photos/144/144?random=82', price: '3,999' },
          { id: 49, name: '索尼WH-1000XM5', img: 'https://picsum.photos/144/144?random=83', price: '2,499' },
        ],
      },
    ],
  },
  {
    id: 4,
    name: '智能家居',
    children: [
      {
        id: 41,
        name: '智能音箱',
        goodsList: [
          { id: 61, name: 'HomePod mini', img: 'https://picsum.photos/144/144?random=101', price: '749' },
          { id: 62, name: '小米小爱', img: 'https://picsum.photos/144/144?random=102', price: '299' },
          { id: 63, name: '天猫精灵', img: 'https://picsum.photos/144/144?random=103', price: '199' },
        ],
      },
    ],
  },
])

/** 侧边栏切换 */
const handleChange = ({ value }: { value: number }) => {
  activeCategory.value = value
}

/** 搜索 */
const handleSearch = () => {
  toast.info(`搜索: ${searchValue.value}`)
}

/** 清空搜索 */
const handleClear = () => {
  searchValue.value = ''
}

/** 跳转详情 */
const goDetail = (id: number) => {
  uni.navigateTo({
    url: `/pages-sub/templates/ecommerce/mallBasic/pages/goodsDetail?id=${id}`,
  })
}
</script>

<style lang="scss" scoped>
.category-wrapper {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.category-content {
  flex: 1;
  background: #fff;
}
</style>
