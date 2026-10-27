<!-- 生鲜商城 - 购物车 -->
<template>
  <view class="h-100vh flex flex-col bg-gray-50">
    <!-- 导航栏 -->
    <wd-navbar title="购物车" :show-back="false">
      <template #right>
        <text class="text-sm text-gray-500" @click="handleClear">清空</text>
      </template>
    </wd-navbar>

    <!-- 配送提示 -->
    <view class="bg-green-50 px-32rpx py-16rpx flex items-center">
      <wd-icon name="cart" size="32rpx" color="#22c55e" />
      <text class="text-xs text-green-600 ml-16rpx">再加 ¥18.1 即可免配送费</text>
    </view>

    <!-- 购物车列表 -->
    <scroll-view v-if="cartList.length > 0" class="flex-1" scroll-y :show-scrollbar="false">
      <view class="px-32rpx pt-24rpx pb-240rpx">
        <view
          v-for="item in cartList"
          :key="item.id"
          class="bg-white rounded-2xl p-24rpx flex items-start mb-20rpx"
        >
          <wd-checkbox v-model="item.checked" custom-class="mr-20rpx mt-40rpx" @change="handleCheckChange" />
          <view
            class="w-144rpx h-144rpx rounded-xl flex items-center justify-center flex-shrink-0"
            :style="{ background: item.bgColor }"
          >
            <text class="text-[56rpx]">{{ item.emoji }}</text>
          </view>
          <view class="ml-24rpx flex-1 flex flex-col justify-between min-h-144rpx">
            <view>
              <text class="text-[26rpx] font-medium text-gray-800">{{ item.name }}</text>
              <text class="text-[20rpx] text-gray-400 block mt-4rpx">{{ item.spec }}</text>
            </view>
            <view class="flex items-end justify-between">
              <text class="text-green-500 font-bold text-sm">¥{{ item.price }}</text>
              <wd-input-number v-model="item.quantity" :min="1" :max="99" size="small" />
            </view>
          </view>
        </view>

        <!-- 换购推荐 -->
        <view class="bg-white rounded-2xl p-24rpx mt-24rpx">
          <view class="flex items-center justify-between mb-16rpx">
            <view class="flex items-center">
              <wd-tag type="warning" size="small">换购</wd-tag>
              <text class="text-xs text-gray-700 font-medium ml-12rpx">满59元可换购</text>
            </view>
            <text class="text-xs text-gray-400">去凑单 ›</text>
          </view>
          <view class="flex gap-16rpx">
            <view
              v-for="item in exchangeList"
              :key="item.id"
              class="flex items-center bg-gray-50 rounded-xl p-16rpx flex-1"
            >
              <text class="text-[40rpx] mr-16rpx">{{ item.emoji }}</text>
              <view class="flex-1">
                <text class="text-[22rpx] text-gray-700 block">{{ item.name }}</text>
                <view>
                  <text class="text-[20rpx] text-green-500">¥{{ item.price }}</text>
                  <text class="text-[20rpx] text-gray-400 line-through ml-8rpx">¥{{ item.originalPrice }}</text>
                </view>
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
          <wd-button type="success" size="small" custom-class="mt-32rpx" @click="handleGoToIndex">去逛逛</wd-button>
        </template>
      </wd-status-tip>
    </view>

    <!-- 底部结算栏 -->
    <view v-if="cartList.length > 0" class="cart-bottom fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100">
      <view class="flex items-center px-32rpx py-24rpx">
        <wd-checkbox v-model="allChecked" @change="handleCheckAll">
          <text class="text-sm text-gray-600">全选</text>
        </wd-checkbox>
        <view class="flex-1 text-right mr-24rpx">
          <text class="text-sm text-gray-500">合计: </text>
          <text class="text-green-500 font-bold text-lg">¥{{ totalPrice }}</text>
          <text class="text-[20rpx] text-gray-400 block">配送费 ¥5.0</text>
        </view>
        <wd-button type="success" :disabled="checkedCount === 0" @click="handleCheckout">
          去结算({{ checkedCount }})
        </wd-button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useToast, useMessage } from '@/wd'

const toast = useToast()
const message = useMessage()

interface CartItem {
  id: number
  name: string
  emoji: string
  spec: string
  price: string
  quantity: number
  bgColor: string
  checked: boolean
}

const cartList = ref<CartItem[]>([
  { id: 1, name: '有机西蓝花', emoji: '🥦', spec: '约300g/份', price: '8.9', quantity: 2, bgColor: '#f0fdf4', checked: true },
  { id: 2, name: '丹东99草莓', emoji: '🍓', spec: '300g/盒', price: '29.9', quantity: 1, bgColor: '#fef2f2', checked: true },
  { id: 3, name: '农家土鸡蛋', emoji: '🥚', spec: '10枚/盒', price: '15.8', quantity: 1, bgColor: '#fefce8', checked: true },
])

const exchangeList = ref([
  { id: 101, name: '鲜榨橙汁', emoji: '🧃', price: '1.0', originalPrice: '9.9' },
  { id: 102, name: '奶油曲奇', emoji: '🍪', price: '2.0', originalPrice: '15.0' },
])

const allChecked = computed({
  get: () => cartList.value.length > 0 && cartList.value.every((item) => item.checked),
  set: (val: boolean) => { cartList.value.forEach((item) => { item.checked = val }) },
})

const checkedCount = computed(() => cartList.value.filter((item) => item.checked).length)

const totalPrice = computed(() => {
  const total = cartList.value
    .filter((item) => item.checked)
    .reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
  return total.toFixed(1)
})

const handleCheckAll = () => { /* computed setter 自动处理 */ }
const handleCheckChange = () => { /* 自动触发 computed 更新 */ }

const handleClear = async () => {
  const { action } = await message.confirm({ title: '提示', msg: '确定清空购物车吗？' })
  if (action === 'confirm') {
    cartList.value = []
    toast.success('已清空')
  }
}

const handleGoToIndex = () => uni.$emit('switchTab', 0)

const handleCheckout = () => {
  if (checkedCount.value === 0) {
    toast.warning('请选择商品')
    return
  }
  toast.success('去结算')
}
</script>

<style lang="scss" scoped>
.cart-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
