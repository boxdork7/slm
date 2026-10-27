<!-- 基础商城 - 商品详情 -->
<template>
  <view class="min-h-100vh bg-white flex flex-col">
    <wd-navbar title="" show-back>
      <template #right>
        <view class="flex items-center gap-24rpx">
          <view class="relative" @click="goCart">
            <wd-icon name="cart" size="40rpx" color="#374151" />
            <view class="absolute -top-8rpx -right-8rpx w-32rpx h-32rpx bg-red-500 rounded-full flex items-center justify-center">
              <text class="text-white text-[20rpx]">2</text>
            </view>
          </view>
          <wd-icon name="share" size="40rpx" color="#374151" @click="handleShare" />
        </view>
      </template>
    </wd-navbar>

    <scroll-view class="flex-1" scroll-y :show-scrollbar="false">
      <!-- 商品主图轮播 -->
      <wd-swiper :list="imageList" :autoplay="false" height="750" indicator />

      <!-- 价格信息 -->
      <view class="px-32rpx pt-32rpx pb-24rpx">
        <view class="flex items-center gap-16rpx">
          <text class="text-2xl font-bold text-[#FF6B35]">¥{{ goods.price }}</text>
          <text class="text-sm text-gray-400 line-through">¥{{ goods.originalPrice }}</text>
          <wd-tag type="danger" size="small" round>{{ goods.discount }}</wd-tag>
        </view>
        <text class="text-base font-bold text-gray-800 mt-16rpx leading-snug block">{{ goods.name }}</text>
        <view class="flex items-center gap-24rpx mt-16rpx">
          <text class="text-[22rpx] text-gray-400">已售 {{ goods.salesCount }}</text>
          <text class="text-[22rpx] text-gray-400">好评 {{ goods.goodRate }}</text>
          <text class="text-[22rpx] text-gray-400">收藏 {{ goods.favoriteCount }}</text>
        </view>
      </view>

      <!-- 优惠信息 -->
      <view class="mx-32rpx bg-[#FFF3ED] rounded-xl px-32rpx py-24rpx">
        <view class="flex items-center gap-16rpx">
          <wd-tag type="warning" size="small">优惠</wd-tag>
          <text class="text-xs text-[#FF6B35] flex-1">满5000减300 | 新人专享95折</text>
          <wd-icon name="arrow-right" size="28rpx" color="#FF6B35" />
        </view>
      </view>

      <!-- SKU 选择 -->
      <view class="px-32rpx py-32rpx border-t border-gray-50 mt-16rpx">
        <view class="flex items-center justify-between mb-24rpx">
          <text class="text-sm font-medium text-gray-700">已选</text>
          <view class="flex items-center text-gray-400 text-xs">
            <text>{{ selectedSku }}</text>
            <wd-icon name="arrow-right" size="28rpx" color="#9ca3af" />
          </view>
        </view>
        <text class="text-xs text-gray-500 mb-12rpx block">颜色</text>
        <view class="flex flex-wrap gap-16rpx mb-24rpx">
          <view
            v-for="color in colorOptions"
            :key="color"
            class="px-28rpx py-12rpx rounded-full text-xs"
            :class="selectedColor === color ? 'border border-[#FF6B35] text-[#FF6B35] bg-[#FFF3ED]' : 'border border-gray-200 text-gray-600'"
            @click="selectedColor = color"
          >
            <text :class="selectedColor === color ? 'text-[#FF6B35]' : 'text-gray-600'" class="text-xs">{{ color }}</text>
          </view>
        </view>
        <text class="text-xs text-gray-500 mb-12rpx block">容量</text>
        <view class="flex flex-wrap gap-16rpx">
          <view
            v-for="size in sizeOptions"
            :key="size"
            class="px-28rpx py-12rpx rounded-full text-xs"
            :class="selectedSize === size ? 'border border-[#FF6B35] text-[#FF6B35] bg-[#FFF3ED]' : 'border border-gray-200 text-gray-600'"
            @click="selectedSize = size"
          >
            <text :class="selectedSize === size ? 'text-[#FF6B35]' : 'text-gray-600'" class="text-xs">{{ size }}</text>
          </view>
        </view>
      </view>

      <!-- 服务保障 -->
      <view class="px-32rpx py-24rpx border-t border-gray-50">
        <view class="flex items-center gap-32rpx">
          <view class="flex items-center gap-8rpx">
            <wd-icon name="check-outline-fill" size="28rpx" color="#22c55e" />
            <text class="text-[22rpx] text-gray-600">正品保障</text>
          </view>
          <view class="flex items-center gap-8rpx">
            <wd-icon name="check-outline-fill" size="28rpx" color="#3b82f6" />
            <text class="text-[22rpx] text-gray-600">顺丰发货</text>
          </view>
          <view class="flex items-center gap-8rpx">
            <wd-icon name="check-outline-fill" size="28rpx" color="#f97316" />
            <text class="text-[22rpx] text-gray-600">7天无理由</text>
          </view>
        </view>
      </view>

      <!-- 商品详情 -->
      <view class="px-32rpx py-32rpx border-t border-gray-50">
        <text class="text-sm font-bold text-gray-800 mb-24rpx block">商品详情</text>
        <view v-for="item in detailList" :key="item.label" class="flex mb-16rpx">
          <text class="text-[24rpx] text-gray-400 w-128rpx flex-shrink-0">{{ item.label }}</text>
          <text class="text-[24rpx] text-gray-700">{{ item.value }}</text>
        </view>
      </view>

      <!-- 用户评价 -->
      <view class="px-32rpx py-32rpx border-t border-gray-50 mb-16rpx">
        <view class="flex items-center justify-between mb-24rpx">
          <text class="text-sm font-bold text-gray-800">用户评价 ({{ goods.reviewCount }})</text>
          <view class="flex items-center text-gray-400 text-xs">
            <text>查看全部</text>
            <wd-icon name="arrow-right" size="28rpx" color="#9ca3af" />
          </view>
        </view>
        <view class="border-t border-gray-50 pt-24rpx">
          <view class="flex items-center gap-16rpx mb-16rpx">
            <view class="w-56rpx h-56rpx rounded-full overflow-hidden">
              <wd-img src="https://picsum.photos/56/56?random=101" width="56rpx" height="56rpx" mode="aspectFill" round />
            </view>
            <text class="text-xs text-gray-700">用户***6</text>
            <wd-rate v-model="reviewRate" readonly size="24rpx" custom-class="ml-auto" />
          </view>
          <text class="text-xs text-gray-600 leading-relaxed">手机非常好，手感一流，摄像头拍照效果惊艳。钛金属边框质感很棒，推荐购买！</text>
          <view class="flex gap-16rpx mt-16rpx">
            <view class="w-128rpx h-128rpx rounded-lg overflow-hidden">
              <wd-img src="https://picsum.photos/128/128?random=111" width="128rpx" height="128rpx" mode="aspectFill" />
            </view>
            <view class="w-128rpx h-128rpx rounded-lg overflow-hidden">
              <wd-img src="https://picsum.photos/128/128?random=112" width="128rpx" height="128rpx" mode="aspectFill" />
            </view>
          </view>
        </view>
      </view>

      <!-- 底部占位，防止内容被操作栏遮挡 -->
      <view class="h-200rpx" />
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="detail-bottom fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100">
      <view class="flex items-center px-32rpx py-20rpx">
        <view class="flex gap-40rpx mr-32rpx">
          <view class="flex flex-col items-center gap-4rpx">
            <wd-icon name="shop" size="40rpx" color="#6b7280" />
            <text class="text-[20rpx] text-gray-500">店铺</text>
          </view>
          <view class="flex flex-col items-center gap-4rpx">
            <wd-icon name="service" size="40rpx" color="#6b7280" />
            <text class="text-[20rpx] text-gray-500">客服</text>
          </view>
          <view class="flex flex-col items-center gap-4rpx" @click="handleFavorite">
            <wd-icon :name="isFavorite ? 'heart-fill' : 'heart'" size="40rpx" :color="isFavorite ? '#ef4444' : '#6b7280'" />
            <text class="text-[20rpx] text-gray-500">收藏</text>
          </view>
        </view>
        <wd-button plain size="medium" custom-class="detail-btn" custom-style="margin-right: 16rpx;" @click="handleAddToCart">加入购物车</wd-button>
        <wd-button type="primary" size="medium" custom-class="detail-btn" @click="handleBuyNow">立即购买</wd-button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useToast } from '@/wd'

const toast = useToast()
const isFavorite = ref(false)
const reviewRate = ref(5)

const goods = ref({
  name: 'iPhone 15 Pro Max 512GB 原色钛金属 全网通5G手机',
  price: '8,999',
  originalPrice: '10,999',
  discount: '9折',
  salesCount: '2,345',
  goodRate: '99%',
  favoriteCount: '586',
  reviewCount: '1,234',
})

const imageList = ref([
  { value: 'https://picsum.photos/750/750?random=11' },
  { value: 'https://picsum.photos/750/750?random=12' },
  { value: 'https://picsum.photos/750/750?random=13' },
])

const colorOptions = ['原色钛金属', '蓝色钛金属', '白色钛金属', '黑色钛金属']
const sizeOptions = ['256GB', '512GB', '1TB']
const selectedColor = ref('原色钛金属')
const selectedSize = ref('512GB')
const selectedSku = computed(() => `${selectedColor.value} / ${selectedSize.value}`)

const detailList = ref([
  { label: '品牌', value: 'Apple' },
  { label: '型号', value: 'A3108' },
  { label: '芯片', value: 'A17 Pro' },
  { label: '屏幕', value: '6.7英寸 Super Retina XDR' },
  { label: '存储', value: '512GB' },
])

const handleShare = () => toast.info('分享')
const handleFavorite = () => {
  isFavorite.value = !isFavorite.value
  toast.success(isFavorite.value ? '已收藏' : '已取消收藏')
}
const handleAddToCart = () => toast.success('已加入购物车')
const handleBuyNow = () => {
  uni.navigateTo({ url: '/pages-sub/templates/ecommerce/mallBasic/pages/orderConfirm?goodsIds=1&quantities=1' })
}
const goCart = () => uni.navigateBack()
</script>

<style lang="scss" scoped>
.detail-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

:deep(.detail-btn) {
  min-width: 220rpx !important;
  width: 220rpx !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}
</style>
