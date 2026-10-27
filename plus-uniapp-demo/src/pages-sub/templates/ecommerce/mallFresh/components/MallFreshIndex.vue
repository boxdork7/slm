<!-- 生鲜商城 - 首页 -->
<template>
  <view class="min-h-100vh bg-gray-50">
    <!-- 顶部区域：定位 + 搜索 -->
    <view class="bg-gradient-to-b from-green-500 to-green-50 px-32rpx pb-32rpx pt-16rpx">
      <!-- 定位栏 -->
      <view class="flex items-center justify-between mb-24rpx">
        <view class="flex items-center text-white" @click="handleLocation">
          <wd-icon name="location" size="32rpx" color="#fff" />
          <text class="text-sm font-medium text-white ml-4rpx">杭州市西湖区</text>
          <wd-icon name="fill-arrow-down" size="24rpx" color="#fff" custom-class="ml-4rpx" />
        </view>
        <view @click="handleNotification">
          <wd-icon name="notification" size="40rpx" color="#fff" />
        </view>
      </view>
      <!-- 搜索框 -->
      <wd-search v-model="searchValue" placeholder="搜索水果、蔬菜、肉类..." :hide-cancel="true" custom-class="fresh-search" @search="handleSearch" />
      <!-- 配送时间 -->
      <view class="flex items-center mt-20rpx bg-white/80 rounded-lg px-24rpx py-16rpx">
        <wd-icon name="cart" size="32rpx" color="#22c55e" />
        <text class="text-xs text-gray-700 font-medium ml-16rpx">最快30分钟送达</text>
        <text class="text-xs text-gray-400 mx-16rpx">|</text>
        <text class="text-xs text-green-500 font-medium">预计 10:30 到</text>
      </view>
    </view>

    <scroll-view class="flex-1" scroll-y :show-scrollbar="false">
      <!-- 轮播图 -->
      <view class="px-32rpx pt-24rpx">
        <wd-swiper
          :list="bannerList"
          :autoplay="true"
          :interval="3000"
          height="260"
          indicator
          custom-class="rounded-2xl overflow-hidden"
        />
      </view>

      <!-- 分类入口 -->
      <view class="bg-white mx-32rpx mt-24rpx rounded-2xl px-16rpx py-24rpx">
        <view class="grid grid-cols-5 gap-8rpx">
          <view
            v-for="item in categoryList"
            :key="item.title"
            class="flex flex-col items-center gap-8rpx"
            @click="handleCategoryClick(item)"
          >
            <text class="text-[48rpx]">{{ item.emoji }}</text>
            <text class="text-[22rpx] text-gray-700">{{ item.title }}</text>
          </view>
        </view>
      </view>

      <!-- 限时抢购 -->
      <view class="mx-32rpx mt-24rpx bg-white rounded-2xl p-32rpx">
        <view class="flex items-center justify-between mb-24rpx">
          <view class="flex items-center gap-16rpx">
            <text class="font-bold text-sm">限时抢购</text>
            <view class="flex items-center gap-4rpx">
              <text class="bg-red-500 text-white text-[20rpx] px-8rpx py-4rpx rounded font-mono">02</text>
              <text class="text-red-500 text-[20rpx] font-bold">:</text>
              <text class="bg-red-500 text-white text-[20rpx] px-8rpx py-4rpx rounded font-mono">30</text>
              <text class="text-red-500 text-[20rpx] font-bold">:</text>
              <text class="bg-red-500 text-white text-[20rpx] px-8rpx py-4rpx rounded font-mono">15</text>
            </view>
          </view>
          <text class="text-xs text-gray-400">更多 ›</text>
        </view>
        <scroll-view scroll-x :show-scrollbar="false" class="whitespace-nowrap">
          <view class="inline-flex gap-24rpx">
            <view
              v-for="item in flashSaleList"
              :key="item.id"
              class="w-180rpx flex-shrink-0"
              @click="handleAddToCart(item)"
            >
              <view class="w-180rpx h-180rpx rounded-xl flex items-center justify-center" :style="{ background: item.bgColor }">
                <text class="text-[72rpx]">{{ item.emoji }}</text>
              </view>
              <text class="mt-12rpx text-red-500 font-bold text-xs block">¥{{ item.price }}</text>
              <text class="text-gray-400 text-[20rpx] line-through">¥{{ item.originalPrice }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 猜你喜欢 -->
      <view class="mx-32rpx mt-24rpx mb-24rpx">
        <text class="font-bold text-sm mb-24rpx block">猜你喜欢</text>
        <view class="space-y-20rpx">
          <view
            v-for="item in goodsList"
            :key="item.id"
            class="bg-white rounded-2xl p-24rpx flex"
            @click="handleAddToCart(item)"
          >
            <view
              class="w-176rpx h-176rpx rounded-xl flex items-center justify-center flex-shrink-0"
              :style="{ background: item.bgColor }"
            >
              <text class="text-[72rpx]">{{ item.emoji }}</text>
            </view>
            <view class="ml-24rpx flex-1 flex flex-col justify-between">
              <view>
                <text class="text-[26rpx] font-medium text-gray-800">{{ item.name }}</text>
                <text class="text-[22rpx] text-gray-400 mt-4rpx block">{{ item.origin }} | {{ item.weight }}</text>
                <view class="flex gap-8rpx mt-8rpx">
                  <wd-tag
                    v-for="tag in item.tags"
                    :key="tag.text"
                    :type="tag.type"
                    size="small"
                  >
                    {{ tag.text }}
                  </wd-tag>
                </view>
              </view>
              <view class="flex items-end justify-between">
                <view>
                  <text class="text-green-500 font-bold text-sm">¥{{ item.price }}</text>
                  <text class="text-gray-400 text-[20rpx] line-through ml-8rpx">¥{{ item.originalPrice }}</text>
                </view>
                <view class="w-48rpx h-48rpx rounded-full bg-green-500 flex items-center justify-center">
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
const searchValue = ref('')

const bannerList = ref([
  { value: 'https://picsum.photos/750/260?random=31' },
  { value: 'https://picsum.photos/750/260?random=32' },
])

interface CategoryItem {
  title: string
  emoji: string
  category: string
}

const categoryList = ref<CategoryItem[]>([
  { title: '时令蔬菜', emoji: '🥬', category: 'vegetable' },
  { title: '新鲜水果', emoji: '🍎', category: 'fruit' },
  { title: '肉禽蛋品', emoji: '🥩', category: 'meat' },
  { title: '海鲜水产', emoji: '🦐', category: 'seafood' },
  { title: '乳品烘焙', emoji: '🥛', category: 'dairy' },
  { title: '米面粮油', emoji: '🍚', category: 'grain' },
  { title: '冷冻速食', emoji: '🧊', category: 'frozen' },
  { title: '饮品酒水', emoji: '🍵', category: 'drink' },
  { title: '日用清洁', emoji: '🧴', category: 'daily' },
  { title: '更多', emoji: '📦', category: 'more' },
])

interface FlashSaleItem {
  id: number
  emoji: string
  price: string
  originalPrice: string
  bgColor: string
}

const flashSaleList = ref<FlashSaleItem[]>([
  { id: 201, emoji: '🍇', price: '12.9', originalPrice: '25.8', bgColor: '#f0fdf4' },
  { id: 202, emoji: '🍌', price: '5.9', originalPrice: '9.9', bgColor: '#fefce8' },
  { id: 203, emoji: '🍅', price: '3.5', originalPrice: '6.8', bgColor: '#fef2f2' },
  { id: 204, emoji: '🥕', price: '2.8', originalPrice: '5.5', bgColor: '#fff7ed' },
])

interface TagItem {
  text: string
  type: 'success' | 'warning' | 'danger' | 'primary'
}

interface GoodsItem {
  id: number
  name: string
  emoji: string
  origin: string
  weight: string
  price: string
  originalPrice: string
  bgColor: string
  tags: TagItem[]
}

const goodsList = ref<GoodsItem[]>([
  { id: 1, name: '有机西蓝花', emoji: '🥦', origin: '云南有机农场', weight: '约300g/份', price: '8.9', originalPrice: '12.0', bgColor: '#f0fdf4', tags: [{ text: '有机', type: 'success' }, { text: '当季', type: 'warning' }] },
  { id: 2, name: '丹东99草莓', emoji: '🍓', origin: '辽宁丹东', weight: '300g/盒', price: '29.9', originalPrice: '39.9', bgColor: '#fef2f2', tags: [{ text: '爆款', type: 'danger' }] },
  { id: 3, name: '农家土鸡蛋', emoji: '🥚', origin: '散养土鸡', weight: '10枚/盒', price: '15.8', originalPrice: '22.0', bgColor: '#fefce8', tags: [{ text: '天然', type: 'success' }, { text: '热销', type: 'warning' }] },
  { id: 4, name: '挪威三文鱼刺身', emoji: '🐟', origin: '冰鲜空运', weight: '200g/份', price: '59.9', originalPrice: '79.9', bgColor: '#eff6ff', tags: [{ text: '进口', type: 'primary' }] },
])

const handleSearch = () => toast.info(`搜索: ${searchValue.value}`)
const handleLocation = () => toast.info('选择配送地址')
const handleNotification = () => toast.info('消息通知')
const handleCategoryClick = (_item: CategoryItem) => uni.$emit('switchTab', 1)
const handleAddToCart = (item: { name?: string }) => toast.success(`已加入购物车${item.name ? `: ${item.name}` : ''}`)
</script>

<style lang="scss" scoped>
:deep(.fresh-search) {
  background: transparent !important;
  padding: 0 !important;
}
</style>
