<!-- 外卖配送 - 首页 -->
<template>
  <view class="min-h-100vh bg-gray-50">
    <!-- 顶部：定位 + 搜索 -->
    <view class="bg-gradient-to-b from-orange-500 to-orange-50 px-32rpx pb-32rpx pt-16rpx">
      <view class="flex items-center justify-between mb-24rpx">
        <view class="flex items-center text-white" @click="handleLocation">
          <wd-icon name="location" size="32rpx" color="#fff" />
          <text class="text-sm font-medium text-white ml-4rpx">杭州市西湖区</text>
          <wd-icon name="fill-arrow-down" size="24rpx" color="#fff" custom-class="ml-4rpx" />
        </view>
        <wd-icon name="notification" size="40rpx" color="#fff" @click="handleNotification" />
      </view>
      <wd-search v-model="searchValue" placeholder="搜索美食、商家..." :hide-cancel="true" custom-class="delivery-search" @search="handleSearch" />
    </view>

    <scroll-view class="flex-1" scroll-y :show-scrollbar="false">
      <!-- 分类横向滚动 -->
      <scroll-view scroll-x :show-scrollbar="false" class="whitespace-nowrap bg-white py-24rpx">
        <view class="inline-flex px-32rpx">
          <view
            v-for="item in categoryList"
            :key="item.title"
            class="flex flex-col items-center mr-32rpx"
            @click="handleCategoryClick(item)"
          >
            <text class="text-[48rpx]">{{ item.emoji }}</text>
            <text class="text-[22rpx] text-gray-700 mt-8rpx">{{ item.title }}</text>
          </view>
        </view>
      </scroll-view>

      <!-- 限时优惠卡片 -->
      <view class="mx-32rpx mt-24rpx bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl px-32rpx py-32rpx relative overflow-hidden">
        <!-- 装饰圆 -->
        <view class="absolute -right-40rpx -bottom-40rpx w-240rpx h-240rpx rounded-full bg-white/10" />
        <!-- 右侧装饰emoji -->
        <view class="absolute right-24rpx top-1/2 -translate-y-1/2 opacity-40">
          <text class="text-[120rpx]">🍔</text>
        </view>
        <!-- 内容 -->
        <view class="relative z-10">
          <wd-tag size="small" round custom-style="background: rgba(255,255,255,0.25); color: #fff; border: none;">限时优惠</wd-tag>
          <text class="text-white font-bold text-lg mt-16rpx block">新用户首单立减 15 元</text>
          <text class="text-white/80 text-[24rpx] mt-8rpx block">满 30 即可使用 | 仅限今日</text>
          <view class="mt-20rpx">
            <wd-button size="small" round custom-style="background: #fff; color: #f97316; border: none;">立即领取</wd-button>
          </view>
        </view>
      </view>

      <!-- 附近商家 -->
      <view class="mx-32rpx mt-24rpx mb-24rpx">
        <text class="font-bold text-sm mb-24rpx block">附近商家</text>
        <view class="space-y-20rpx">
          <view
            v-for="shop in shopList"
            :key="shop.id"
            class="bg-white rounded-2xl p-24rpx flex"
            @click="handleShopClick(shop)"
          >
            <view class="w-160rpx h-160rpx rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
              <wd-img :src="shop.img" width="160rpx" height="160rpx" mode="aspectFill" />
            </view>
            <view class="ml-24rpx flex-1 flex flex-col justify-between">
              <view>
                <view class="flex items-center">
                  <text class="text-[26rpx] font-medium text-gray-800 flex-1">{{ shop.name }}</text>
                </view>
                <view class="flex items-center mt-8rpx">
                  <wd-icon name="star-fill" size="24rpx" color="#facc15" />
                  <text class="text-[22rpx] text-gray-700 ml-4rpx">{{ shop.rating }}</text>
                  <text class="text-[22rpx] text-gray-400 ml-12rpx">月售{{ shop.monthlySales }}</text>
                </view>
                <view class="flex items-center mt-8rpx">
                  <wd-tag v-for="tag in shop.tags" :key="tag" size="small" custom-style="margin-right: 8rpx;" :type="tag === '满减' ? 'danger' : tag === '新店' ? 'warning' : 'success'">
                    {{ tag }}
                  </wd-tag>
                </view>
              </view>
              <view class="flex items-center justify-between">
                <text class="text-[22rpx] text-gray-400">{{ shop.deliveryTime }} | ¥{{ shop.deliveryFee }}配送</text>
                <text class="text-[22rpx] text-gray-400">¥{{ shop.minOrder }}起送</text>
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

const categoryList = ref([
  { title: '美食', emoji: '🍜' },
  { title: '奶茶', emoji: '🧋' },
  { title: '快餐', emoji: '🍱' },
  { title: '汉堡', emoji: '🍔' },
  { title: '披萨', emoji: '🍕' },
  { title: '甜点', emoji: '🍰' },
  { title: '小吃', emoji: '🍢' },
  { title: '夜宵', emoji: '🌙' },
])

interface ShopItem {
  id: number
  name: string
  img: string
  rating: string
  monthlySales: string
  deliveryTime: string
  deliveryFee: string
  minOrder: string
  tags: string[]
}

const shopList = ref<ShopItem[]>([
  { id: 1, name: '老王黄焖鸡米饭', img: 'https://picsum.photos/160/160?random=41', rating: '4.8', monthlySales: '2356', deliveryTime: '30分钟', deliveryFee: '3', minOrder: '20', tags: ['满减', '品质'] },
  { id: 2, name: '一点点奶茶', img: 'https://picsum.photos/160/160?random=42', rating: '4.9', monthlySales: '5680', deliveryTime: '25分钟', deliveryFee: '0', minOrder: '15', tags: ['新店', '满减'] },
  { id: 3, name: '麦当劳（西湖店）', img: 'https://picsum.photos/160/160?random=43', rating: '4.7', monthlySales: '8920', deliveryTime: '20分钟', deliveryFee: '5', minOrder: '25', tags: ['品质'] },
  { id: 4, name: '张亮麻辣烫', img: 'https://picsum.photos/160/160?random=44', rating: '4.6', monthlySales: '3450', deliveryTime: '35分钟', deliveryFee: '2', minOrder: '18', tags: ['满减'] },
])

const handleSearch = () => toast.info(`搜索: ${searchValue.value}`)
const handleLocation = () => toast.info('选择配送地址')
const handleNotification = () => toast.info('消息通知')
const handleCategoryClick = (item: { title: string }) => toast.info(item.title)
const handleShopClick = (_shop: ShopItem) => uni.$emit('switchTab', 1)
</script>

<style lang="scss" scoped>
:deep(.delivery-search) {
  background: transparent !important;
  padding: 0 !important;
}
</style>
