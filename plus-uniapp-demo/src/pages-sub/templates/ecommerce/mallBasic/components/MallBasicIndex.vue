<!-- 基础商城 - 首页 -->
<template>
  <view class="min-h-100vh bg-gray-50">
    <!-- 搜索栏 -->
    <view class="bg-white px-32rpx pt-8rpx pb-24rpx">
      <view class="flex items-center gap-24rpx">
        <view class="flex-1">
          <wd-search v-model="searchValue" placeholder="搜索商品" :hide-cancel="true" @search="handleSearch" />
        </view>
        <view class="relative flex-shrink-0 w-48rpx h-48rpx flex items-center justify-center" @click="handleNotification">
          <wd-icon name="notification" size="44rpx" color="#4b5563" />
          <view
            v-if="noticeCount > 0"
            class="absolute -top-4rpx -right-4rpx min-w-32rpx h-32rpx bg-red-500 rounded-full flex items-center justify-center px-6rpx"
          >
            <text class="text-white text-[20rpx] leading-none">{{ noticeCount }}</text>
          </view>
        </view>
      </view>
    </view>

    <scroll-view class="flex-1" scroll-y :show-scrollbar="false">
      <!-- 轮播图 -->
      <view class="px-32rpx pt-24rpx">
        <wd-swiper
          :list="bannerList"
          :autoplay="true"
          :interval="3000"
          height="320"
          indicator
          custom-class="rounded-2xl overflow-hidden"
          @click="handleBannerClick"
        />
      </view>

      <!-- 分类入口 - 金刚区 -->
      <view class="bg-white mx-32rpx mt-24rpx rounded-2xl px-16rpx py-32rpx">
        <view class="grid grid-cols-5 gap-8rpx">
          <view
            v-for="item in categoryList"
            :key="item.title"
            class="flex flex-col items-center gap-12rpx"
            @click="handleCategoryClick(item)"
          >
            <view
              class="w-88rpx h-88rpx rounded-xl flex items-center justify-center"
              :style="{ background: item.bgColor }"
            >
              <wd-icon :name="item.icon" size="40rpx" :color="item.iconColor" />
            </view>
            <text class="text-[22rpx] text-gray-700">{{ item.title }}</text>
          </view>
        </view>
      </view>

      <!-- 限时秒杀 -->
      <view class="mx-32rpx mt-24rpx bg-white rounded-2xl p-32rpx">
        <view class="flex items-center justify-between mb-24rpx">
          <view class="flex items-center gap-16rpx">
            <wd-icon name="warn-bold" size="32rpx" color="#FF6B35" />
            <text class="font-bold text-base">限时秒杀</text>
            <view class="flex gap-8rpx ml-8rpx">
              <text class="bg-gray-900 text-white text-[20rpx] px-12rpx py-4rpx rounded font-mono">{{ countdown.hours }}</text>
              <text class="text-gray-900 text-xs font-bold">:</text>
              <text class="bg-gray-900 text-white text-[20rpx] px-12rpx py-4rpx rounded font-mono">{{ countdown.minutes }}</text>
              <text class="text-gray-900 text-xs font-bold">:</text>
              <text class="bg-gray-900 text-white text-[20rpx] px-12rpx py-4rpx rounded font-mono">{{ countdown.seconds }}</text>
            </view>
          </view>
          <view class="flex items-center" @click="handleMoreFlash">
            <text class="text-gray-400 text-xs">更多</text>
            <wd-icon name="arrow-right" size="28rpx" color="#9ca3af" />
          </view>
        </view>
        <scroll-view scroll-x :show-scrollbar="false" class="whitespace-nowrap">
          <view class="inline-flex gap-24rpx">
            <view
              v-for="item in flashSaleList"
              :key="item.id"
              class="w-200rpx flex-shrink-0"
              @click="goDetail(item.id)"
            >
              <view class="w-200rpx h-200rpx rounded-xl bg-gray-100 overflow-hidden">
                <wd-img :src="item.img" width="100%" height="200rpx" mode="aspectFill" />
              </view>
              <text class="mt-16rpx text-[#FF6B35] font-bold text-sm block">¥{{ item.price }}</text>
              <text class="text-gray-400 text-[20rpx] line-through">¥{{ item.originalPrice }}</text>
              <view class="mt-8rpx bg-[#FF6B35]/10 rounded-full h-12rpx overflow-hidden">
                <view class="bg-[#FF6B35] h-full rounded-full" :style="{ width: `${item.soldPercent}%` }" />
              </view>
              <text class="text-[20rpx] text-gray-400 mt-4rpx">已抢{{ item.soldPercent }}%</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- Tab 切换 + 商品列表 -->
      <view class="mx-32rpx mt-24rpx mb-24rpx">
        <wd-tabs v-model="activeTab" @change="handleTabChange">
          <wd-tab title="推荐" name="recommend" />
          <wd-tab title="新品" name="new" />
          <wd-tab title="热销" name="hot" />
          <wd-tab title="好评" name="good" />
        </wd-tabs>

        <!-- 商品网格 2列 -->
        <view class="grid grid-cols-2 gap-20rpx mt-24rpx">
          <view
            v-for="item in goodsList"
            :key="item.id"
            class="bg-white rounded-2xl overflow-hidden"
            @click="goDetail(item.id)"
          >
            <view class="relative">
              <wd-img :src="item.img" width="100%" height="350rpx" mode="aspectFill" />
              <view
                v-if="item.tag"
                class="absolute top-12rpx left-12rpx"
              >
                <wd-tag
                  :type="item.tag === '新品' ? 'warning' : 'danger'"
                  size="small"
                  round
                >
                  {{ item.tag }}
                </wd-tag>
              </view>
            </view>
            <view class="p-24rpx">
              <text class="text-[26rpx] font-medium leading-snug line-clamp-2 text-gray-800">{{ item.name }}</text>
              <view class="flex items-baseline gap-8rpx mt-16rpx">
                <text class="text-[#FF6B35] font-bold text-base">¥{{ item.price }}</text>
                <text class="text-gray-400 text-[20rpx] line-through">¥{{ item.originalPrice }}</text>
              </view>
              <view class="flex items-center justify-between mt-16rpx">
                <text class="text-[20rpx] text-gray-400">已售 {{ item.salesCount }}</text>
                <view
                  class="w-56rpx h-56rpx rounded-full bg-[#FF6B35] flex items-center justify-center"
                  @click.stop="handleAddToCart(item)"
                >
                  <wd-icon name="add" size="28rpx" color="#fff" />
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

/** 搜索关键词 */
const searchValue = ref('')
/** 通知数量 */
const noticeCount = ref(3)
/** 当前Tab */
const activeTab = ref('recommend')

/** 轮播图数据 */
const bannerList = ref([
  { value: 'https://picsum.photos/750/320?random=1' },
  { value: 'https://picsum.photos/750/320?random=2' },
  { value: 'https://picsum.photos/750/320?random=3' },
])

/** 分类入口数据 */
interface CategoryItem {
  title: string
  icon: string
  iconColor: string
  bgColor: string
  category: string
}

const categoryList = ref<CategoryItem[]>([
  { title: '手机', icon: 'mobile', iconColor: '#ef4444', bgColor: '#fef2f2', category: 'phone' },
  { title: '电脑', icon: 'laptop', iconColor: '#3b82f6', bgColor: '#eff6ff', category: 'laptop' },
  { title: '手表', icon: 'clock', iconColor: '#ca8a04', bgColor: '#fefce8', category: 'watch' },
  { title: '耳机', icon: 'audio', iconColor: '#a855f7', bgColor: '#faf5ff', category: 'headphone' },
  { title: '平板', icon: 'mobile', iconColor: '#22c55e', bgColor: '#f0fdf4', category: 'tablet' },
  { title: '相机', icon: 'camera', iconColor: '#ec4899', bgColor: '#fdf2f8', category: 'camera' },
  { title: '游戏', icon: 'play-fill', iconColor: '#6366f1', bgColor: '#eef2ff', category: 'game' },
  { title: '智能家居', icon: 'home', iconColor: '#14b8a6', bgColor: '#f0fdfa', category: 'smart' },
  { title: '配件', icon: 'warn-bold', iconColor: '#f97316', bgColor: '#fff7ed', category: 'accessory' },
  { title: '更多', icon: 'menu', iconColor: '#6b7280', bgColor: '#f3f4f6', category: 'more' },
])

/** 倒计时 */
const countdown = ref({ hours: '02', minutes: '15', seconds: '30' })

/** 秒杀数据 */
interface FlashSaleItem {
  id: number
  img: string
  price: string
  originalPrice: string
  soldPercent: number
}

const flashSaleList = ref<FlashSaleItem[]>([
  { id: 101, img: 'https://picsum.photos/200/200?random=1', price: '2,999', originalPrice: '3,999', soldPercent: 72 },
  { id: 102, img: 'https://picsum.photos/200/200?random=2', price: '899', originalPrice: '1,299', soldPercent: 45 },
  { id: 103, img: 'https://picsum.photos/200/200?random=3', price: '199', originalPrice: '399', soldPercent: 88 },
])

/** 商品数据 */
interface GoodsItem {
  id: number
  name: string
  img: string
  price: string
  originalPrice: string
  salesCount: string
  tag?: string
}

const goodsList = ref<GoodsItem[]>([
  { id: 1, name: 'iPhone 15 Pro Max 钛金属 512GB', img: 'https://picsum.photos/350/350?random=11', price: '8,999', originalPrice: '10,999', salesCount: '2,345', tag: '9折' },
  { id: 2, name: 'MacBook Pro 14 M3 Pro 芯片', img: 'https://picsum.photos/350/350?random=12', price: '17,999', originalPrice: '18,999', salesCount: '1,256', tag: '新品' },
  { id: 3, name: 'Apple Watch S9 GPS 45mm', img: 'https://picsum.photos/350/350?random=13', price: '2,999', originalPrice: '3,399', salesCount: '3,421' },
  { id: 4, name: 'AirPods Max 空间音频耳机', img: 'https://picsum.photos/350/350?random=14', price: '3,999', originalPrice: '4,999', salesCount: '892', tag: '8折' },
])

/** 搜索 */
const handleSearch = () => {
  toast.info(`搜索: ${searchValue.value}`)
}

/** 通知 */
const handleNotification = () => {
  toast.info('消息通知')
}

/** 轮播图点击 */
const handleBannerClick = ({ index }: { index: number }) => {
  toast.info(`点击轮播图 ${index + 1}`)
}

/** 分类点击 */
const handleCategoryClick = (item: CategoryItem) => {
  uni.$emit('switchTab', 1)
}

/** 秒杀更多 */
const handleMoreFlash = () => {
  toast.info('查看更多秒杀')
}

/** Tab切换 */
const handleTabChange = ({ name }: { name: string }) => {
  activeTab.value = name
}

/** 加入购物车 */
const handleAddToCart = (item: GoodsItem) => {
  toast.success('已加入购物车')
}

/** 跳转详情 */
const goDetail = (id: number) => {
  uni.navigateTo({
    url: `/pages-sub/templates/ecommerce/mallBasic/pages/goodsDetail?id=${id}`,
  })
}
</script>

<style lang="scss" scoped>
/* 隐藏滚动条 */
::-webkit-scrollbar {
  display: none;
}
</style>
