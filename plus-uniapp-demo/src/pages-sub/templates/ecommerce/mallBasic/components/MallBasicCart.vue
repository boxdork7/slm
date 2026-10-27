<!-- 基础商城 - 购物车 -->
<template>
  <view class="h-100vh flex flex-col bg-gray-50">
    <!-- 导航栏 -->
    <wd-navbar title="购物车" :show-back="false">
      <template #right>
        <text class="text-sm text-gray-500" @click="toggleManage">{{ isManaging ? '完成' : '管理' }}</text>
      </template>
    </wd-navbar>

    <!-- 购物车列表 -->
    <scroll-view v-if="cartList.length > 0" class="flex-1" scroll-y :show-scrollbar="false">
      <view class="px-32rpx pb-240rpx pt-24rpx">
        <!-- 店铺分组 -->
        <view class="bg-white rounded-2xl overflow-hidden">
          <!-- 店铺头 -->
          <view class="flex items-center px-32rpx py-24rpx border-b border-gray-50">
            <wd-checkbox v-model="allChecked" @change="handleCheckAll" />
            <wd-icon name="shop" size="32rpx" color="#6b7280" custom-class="ml-20rpx mr-12rpx" />
            <text class="text-sm font-medium">Apple 官方旗舰店</text>
          </view>

          <!-- 商品项 -->
          <view v-for="item in validItems" :key="item.id" class="flex p-32rpx border-b border-gray-50">
            <wd-checkbox v-model="item.checked" custom-class="mr-24rpx" @change="handleCheckChange" />
            <view class="w-176rpx h-176rpx rounded-xl bg-gray-100 overflow-hidden flex-shrink-0" @click="goDetail(item.goodsId)">
              <wd-img :src="item.img" width="176rpx" height="176rpx" mode="aspectFill" />
            </view>
            <view class="ml-24rpx flex-1 flex flex-col justify-between min-h-176rpx">
              <view>
                <text class="text-[26rpx] font-medium leading-snug line-clamp-2 text-gray-800">{{ item.name }}</text>
                <view class="mt-8rpx">
                  <text class="text-[20rpx] text-gray-400 bg-gray-100 px-12rpx py-4rpx rounded">{{ item.spec }}</text>
                </view>
              </view>
              <view class="flex items-end justify-between">
                <text class="text-[#FF6B35] font-bold text-base">¥{{ item.price }}</text>
                <wd-input-number v-model="item.quantity" :min="1" :max="item.stock" size="small" @change="handleQuantityChange(item)" />
              </view>
            </view>
          </view>
        </view>

        <!-- 失效商品 -->
        <view v-if="invalidItems.length > 0" class="bg-white rounded-2xl overflow-hidden mt-24rpx">
          <view class="flex items-center justify-between px-32rpx py-24rpx border-b border-gray-50">
            <text class="text-sm text-gray-400">失效商品 ({{ invalidItems.length }})</text>
            <text class="text-sm text-gray-400" @click="handleClearInvalid">清空</text>
          </view>
          <view v-for="item in invalidItems" :key="item.id" class="flex p-32rpx opacity-50">
            <view class="w-176rpx h-176rpx rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 relative">
              <wd-img :src="item.img" width="176rpx" height="176rpx" mode="aspectFill" />
              <view class="absolute inset-0 bg-black/30 flex items-center justify-center rounded-xl">
                <text class="text-white text-[20rpx] font-medium">已失效</text>
              </view>
            </view>
            <view class="ml-24rpx flex-1">
              <text class="text-[26rpx] leading-snug line-clamp-2 text-gray-500">{{ item.name }}</text>
              <text class="text-gray-400 text-sm mt-16rpx block">¥{{ item.price }}</text>
            </view>
          </view>
        </view>

        <!-- 猜你喜欢 -->
        <view class="mt-32rpx">
          <text class="text-center text-sm text-gray-400 mb-24rpx block">— 猜你喜欢 —</text>
          <view class="grid grid-cols-2 gap-20rpx">
            <view
              v-for="item in recommendList"
              :key="item.id"
              class="bg-white rounded-2xl overflow-hidden"
              @click="goDetail(item.id)"
            >
              <wd-img :src="item.img" width="100%" height="350rpx" mode="aspectFill" />
              <view class="p-24rpx">
                <text class="text-[26rpx] font-medium line-clamp-2 text-gray-800">{{ item.name }}</text>
                <text class="text-[#FF6B35] font-bold text-sm mt-8rpx block">¥{{ item.price }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 空购物车 -->
    <view v-else class="flex flex-1 flex-col items-center justify-center">
      <wd-status-tip type="search" tip="购物车空空如也">
        <template #bottom>
          <wd-button type="primary" size="small" custom-class="mt-32rpx" @click="handleGoToIndex">去逛逛</wd-button>
        </template>
      </wd-status-tip>
    </view>

    <!-- 底部结算栏 -->
    <view v-if="cartList.length > 0" class="cart-bottom bg-white border-t border-gray-100">
      <view class="flex items-center px-32rpx py-24rpx">
        <view class="flex items-center mr-24rpx">
          <wd-checkbox v-model="allChecked" @change="handleCheckAll">
            <text class="text-sm text-gray-600">全选</text>
          </wd-checkbox>
        </view>
        <view class="flex-1 text-right mr-24rpx">
          <text class="text-sm text-gray-500">合计: </text>
          <text class="text-[#FF6B35] font-bold text-lg">¥{{ totalPrice }}</text>
          <text v-if="savedPrice" class="text-[20rpx] text-gray-400 block">已优惠 ¥{{ savedPrice }}</text>
        </view>
        <wd-button type="primary" :disabled="checkedCount === 0" custom-class="min-w-200rpx" @click="handleCheckout">
          结算({{ checkedCount }})
        </wd-button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useToast, useMessage } from '@/wd'

const toast = useToast()
const message = useMessage()

/** 购物车商品接口 */
interface CartItem {
  id: number
  goodsId: number
  name: string
  img: string
  price: string
  spec: string
  quantity: number
  stock: number
  checked: boolean
  valid: boolean
}

const isManaging = ref(false)

const cartList = ref<CartItem[]>([
  { id: 1, goodsId: 1, name: 'iPhone 15 Pro Max 512GB 钛金属', img: 'https://picsum.photos/176/176?random=11', price: '8,999', spec: '原色钛金属', quantity: 1, stock: 50, checked: true, valid: true },
  { id: 2, goodsId: 2, name: 'MacBook Pro 14 M3 Pro 芯片', img: 'https://picsum.photos/176/176?random=12', price: '17,999', spec: '深空灰', quantity: 1, stock: 30, checked: true, valid: true },
  { id: 3, goodsId: 6, name: 'iPhone 14 Pro 深空黑色 256GB', img: 'https://picsum.photos/176/176?random=16', price: '7,599', spec: '深空黑色', quantity: 1, stock: 0, checked: false, valid: false },
])

const recommendList = ref([
  { id: 51, name: 'Apple Watch S9 GPS', img: 'https://picsum.photos/350/350?random=51', price: '2,999' },
  { id: 52, name: 'AirPods Pro 2 代', img: 'https://picsum.photos/350/350?random=52', price: '1,899' },
])

/** 有效商品 */
const validItems = computed(() => cartList.value.filter((item) => item.valid))
/** 失效商品 */
const invalidItems = computed(() => cartList.value.filter((item) => !item.valid))

/** 全选状态 */
const allChecked = computed({
  get: () => {
    const items = validItems.value
    return items.length > 0 && items.every((item) => item.checked)
  },
  set: (val: boolean) => {
    cartList.value.forEach((item) => {
      if (item.valid) item.checked = val
    })
  },
})

/** 已选数量 */
const checkedCount = computed(() => validItems.value.filter((item) => item.checked).length)

/** 总价 */
const totalPrice = computed(() => {
  const total = validItems.value
    .filter((item) => item.checked)
    .reduce((sum, item) => sum + Number(item.price.replace(/,/g, '')) * item.quantity, 0)
  return total.toLocaleString()
})

/** 已优惠金额 */
const savedPrice = ref('2,000')

const toggleManage = () => {
  isManaging.value = !isManaging.value
}

const handleCheckAll = () => { /* computed setter 自动处理 */ }
const handleCheckChange = () => { /* 自动触发 computed 更新 */ }

const handleQuantityChange = (item: CartItem) => {
  console.log('数量变化', item.id, item.quantity)
}

const handleClearInvalid = async () => {
  const { action } = await message.confirm({ title: '提示', msg: '确定清空失效商品吗？' })
  if (action === 'confirm') {
    cartList.value = cartList.value.filter((item) => item.valid)
    toast.success('已清空')
  }
}

const handleGoToIndex = () => {
  uni.$emit('switchTab', 0)
}

const handleCheckout = () => {
  const checkedItems = validItems.value.filter((item) => item.checked)
  if (checkedItems.length === 0) {
    toast.warning('请选择商品')
    return
  }
  const goodsIds = checkedItems.map((item) => item.goodsId).join(',')
  const quantities = checkedItems.map((item) => item.quantity).join(',')
  uni.navigateTo({
    url: `/pages-sub/templates/ecommerce/mallBasic/pages/orderConfirm?goodsIds=${goodsIds}&quantities=${quantities}`,
  })
}

const goDetail = (id: number) => {
  uni.navigateTo({
    url: `/pages-sub/templates/ecommerce/mallBasic/pages/goodsDetail?id=${id}`,
  })
}
</script>

<style lang="scss" scoped>
.cart-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
