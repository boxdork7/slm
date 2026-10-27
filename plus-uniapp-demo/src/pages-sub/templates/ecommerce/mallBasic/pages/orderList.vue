<!-- 基础商城 - 我的订单 -->
<template>
  <view class="min-h-100vh bg-gray-50 flex flex-col">
    <wd-navbar title="我的订单" show-back />

    <!-- Tab 切换 -->
    <view class="bg-white">
      <wd-tabs v-model="activeTab" @change="handleTabChange">
        <wd-tab title="全部" name="all" />
        <wd-tab title="待付款" name="pending" />
        <wd-tab title="待发货" name="shipping" />
        <wd-tab title="待收货" name="receiving" />
        <wd-tab title="已完成" name="completed" />
      </wd-tabs>
    </view>

    <scroll-view class="flex-1" scroll-y :show-scrollbar="false">
      <view class="px-32rpx pt-24rpx">
        <!-- 订单卡片 -->
        <view
          v-for="order in filteredOrders"
          :key="order.id"
          class="bg-white rounded-2xl overflow-hidden mb-24rpx"
        >
          <!-- 订单头 -->
          <view class="flex items-center justify-between px-32rpx py-24rpx border-b border-gray-50">
            <view class="flex items-center">
              <wd-icon name="shop" size="32rpx" color="#6b7280" custom-class="mr-12rpx" />
              <text class="text-sm font-medium">{{ order.shopName }}</text>
            </view>
            <text class="text-sm font-medium" :class="statusColorMap[order.status]">{{ statusTextMap[order.status] }}</text>
          </view>

          <!-- 商品列表 -->
          <view
            v-for="goods in order.goodsList"
            :key="goods.id"
            class="flex p-32rpx border-b border-gray-50 last:border-b-0"
            @click="goDetail(goods.id)"
          >
            <view class="w-144rpx h-144rpx rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
              <wd-img :src="goods.img" width="144rpx" height="144rpx" mode="aspectFill" />
            </view>
            <view class="ml-24rpx flex-1">
              <text class="text-[26rpx] font-medium leading-snug line-clamp-2 text-gray-800">{{ goods.name }}</text>
              <view class="flex items-end justify-between mt-16rpx">
                <text class="text-[22rpx] text-gray-400">{{ goods.spec }}</text>
                <view class="text-right">
                  <text class="text-sm font-bold">¥{{ goods.price }}</text>
                  <text class="text-[22rpx] text-gray-400 ml-4rpx">x{{ goods.quantity }}</text>
                </view>
              </view>
            </view>
          </view>

          <!-- 订单底部 -->
          <view class="px-32rpx py-24rpx border-t border-gray-50 flex items-center justify-between">
            <view>
              <text class="text-xs text-gray-400">共{{ order.totalCount }}件 实付 </text>
              <text class="text-gray-800 font-medium text-xs">¥{{ order.totalPrice }}</text>
              <text v-if="order.status === 'pending'" class="text-[20rpx] text-red-400 block mt-4rpx">
                剩余 {{ order.remainTime }} 自动取消
              </text>
            </view>
            <view class="flex gap-16rpx">
              <wd-button
                v-for="btn in getOrderActions(order.status)"
                :key="btn.text"
                :type="btn.primary ? 'primary' : 'default'"
                size="small"
                :plain="!btn.primary"
                @click.stop="handleAction(btn.action, order)"
              >
                {{ btn.text }}
              </wd-button>
            </view>
          </view>
        </view>

        <!-- 空状态 -->
        <wd-status-tip v-if="filteredOrders.length === 0" type="search" tip="暂无订单" />

        <!-- 底部提示 -->
        <view v-if="filteredOrders.length > 0" class="py-48rpx text-center">
          <text class="text-xs text-gray-400">— 没有更多订单了 —</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { useToast, useMessage } from '@/wd'

const toast = useToast()
const message = useMessage()
const activeTab = ref('all')

/** 订单状态映射 */
const statusTextMap: Record<string, string> = {
  pending: '待付款',
  shipping: '待发货',
  receiving: '待收货',
  completed: '已完成',
}

const statusColorMap: Record<string, string> = {
  pending: 'text-red-500',
  shipping: 'text-orange-500',
  receiving: 'text-[#FF6B35]',
  completed: 'text-green-500',
}

/** 商品接口 */
interface OrderGoods {
  id: number
  name: string
  img: string
  price: string
  spec: string
  quantity: number
}

/** 订单接口 */
interface Order {
  id: number
  shopName: string
  status: string
  totalCount: number
  totalPrice: string
  remainTime?: string
  goodsList: OrderGoods[]
}

/** 订单列表 */
const orderList = ref<Order[]>([
  {
    id: 1001,
    shopName: 'Apple 官方旗舰店',
    status: 'receiving',
    totalCount: 1,
    totalPrice: '8,999.00',
    goodsList: [
      { id: 1, name: 'iPhone 15 Pro Max 512GB 原色钛金属', img: 'https://picsum.photos/144/144?random=11', price: '8,999', spec: '原色钛金属 / 512GB', quantity: 1 },
    ],
  },
  {
    id: 1002,
    shopName: 'Apple 官方旗舰店',
    status: 'pending',
    totalCount: 1,
    totalPrice: '3,999.00',
    remainTime: '29:58',
    goodsList: [
      { id: 4, name: 'AirPods Max 空间音频头戴式耳机', img: 'https://picsum.photos/144/144?random=14', price: '3,999', spec: '银色', quantity: 1 },
    ],
  },
  {
    id: 1003,
    shopName: 'Apple 官方旗舰店',
    status: 'completed',
    totalCount: 3,
    totalPrice: '23,997.00',
    goodsList: [
      { id: 2, name: 'MacBook Pro 14 M3 Pro 芯片', img: 'https://picsum.photos/144/144?random=12', price: '17,999', spec: '深空灰 / 标准版', quantity: 1 },
      { id: 3, name: 'Apple Watch Series 9 GPS 45mm', img: 'https://picsum.photos/144/144?random=13', price: '2,999', spec: '午夜色 / 45mm', quantity: 2 },
    ],
  },
])

/** 筛选后的订单 */
const filteredOrders = computed(() => {
  if (activeTab.value === 'all') return orderList.value
  return orderList.value.filter((order) => order.status === activeTab.value)
})

/** Tab 切换 */
const handleTabChange = ({ name }: { name: string }) => {
  activeTab.value = name
}

/** 订单操作按钮 */
interface ActionButton {
  text: string
  action: string
  primary?: boolean
}

const getOrderActions = (status: string): ActionButton[] => {
  const map: Record<string, ActionButton[]> = {
    pending: [
      { text: '取消订单', action: 'cancel' },
      { text: '去付款', action: 'pay', primary: true },
    ],
    shipping: [
      { text: '提醒发货', action: 'remind' },
    ],
    receiving: [
      { text: '查看物流', action: 'logistics' },
      { text: '确认收货', action: 'confirm', primary: true },
    ],
    completed: [
      { text: '再次购买', action: 'rebuy' },
      { text: '评价', action: 'review' },
    ],
  }
  return map[status] || []
}

/** 处理操作 */
const handleAction = async (action: string, order: Order) => {
  switch (action) {
    case 'cancel': {
      const { action: result } = await message.confirm({ title: '提示', msg: '确定取消订单吗？' })
      if (result === 'confirm') {
        orderList.value = orderList.value.filter((o) => o.id !== order.id)
        toast.success('订单已取消')
      }
      break
    }
    case 'pay':
      toast.info('去付款')
      break
    case 'confirm': {
      const { action: result } = await message.confirm({ title: '提示', msg: '确认收货吗？' })
      if (result === 'confirm') {
        order.status = 'completed'
        toast.success('已确认收货')
      }
      break
    }
    default:
      toast.info(action)
  }
}

/** 跳转详情 */
const goDetail = (id: number) => {
  uni.navigateTo({
    url: `/pages-sub/templates/ecommerce/mallBasic/pages/goodsDetail?id=${id}`,
  })
}
</script>

<style lang="scss" scoped></style>
