<!-- 外卖配送 - 点餐 -->
<template>
  <view class="h-100vh flex flex-col bg-gray-50">
    <!-- 商家信息 -->
    <view class="bg-white px-32rpx py-24rpx border-b border-gray-100">
      <view class="flex items-center justify-between">
        <text class="text-base font-bold text-gray-800">老王黄焖鸡米饭</text>
        <view class="flex items-center">
          <wd-icon name="star-fill" size="24rpx" color="#facc15" />
          <text class="text-xs text-gray-700 ml-4rpx">4.8</text>
        </view>
      </view>
      <view class="flex items-center mt-8rpx">
        <text class="text-[22rpx] text-gray-400">月售2356</text>
        <text class="text-[22rpx] text-gray-400 mx-12rpx">|</text>
        <text class="text-[22rpx] text-gray-400">配送费¥3</text>
        <wd-tag type="danger" size="small" custom-style="margin-left: 12rpx;">满25减5</wd-tag>
      </view>
    </view>

    <!-- 分类 + 商品列表 -->
    <view class="menu-wrapper">
      <!-- 左侧分类 -->
      <wd-sidebar v-model="activeCategory" @change="handleChange">
        <wd-sidebar-item
          v-for="(item, index) in menuCategories"
          :key="item.id"
          :value="index"
          :label="item.name"
        />
      </wd-sidebar>

      <!-- 右侧商品列表 -->
      <scroll-view class="menu-content" scroll-y :show-scrollbar="false">
        <view class="px-24rpx pt-24rpx pb-200rpx">
          <view
            v-for="dish in menuCategories[activeCategory]?.dishes"
            :key="dish.id"
            class="flex mb-24rpx"
          >
            <view class="w-144rpx h-144rpx rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
              <wd-img :src="dish.img" width="144rpx" height="144rpx" mode="aspectFill" />
            </view>
            <view class="ml-20rpx flex-1 flex flex-col justify-between">
              <view>
                <text class="text-[26rpx] font-medium text-gray-800">{{ dish.name }}</text>
                <text class="text-[20rpx] text-gray-400 mt-4rpx block">{{ dish.desc }}</text>
                <text class="text-[20rpx] text-gray-400 mt-4rpx">月售{{ dish.monthlySales }}</text>
              </view>
              <view class="flex items-center justify-between">
                <text class="text-orange-500 font-bold text-sm">¥{{ dish.price }}</text>
                <view class="flex items-center">
                  <view
                    v-if="dish.quantity > 0"
                    class="w-44rpx h-44rpx rounded-full border border-orange-500 flex items-center justify-center"
                    @click="handleMinus(dish)"
                  >
                    <wd-icon name="decrease" size="28rpx" color="#f97316" />
                  </view>
                  <text v-if="dish.quantity > 0" class="text-sm w-48rpx text-center">{{ dish.quantity }}</text>
                  <view
                    class="w-44rpx h-44rpx rounded-full bg-orange-500 flex items-center justify-center"
                    @click="handlePlus(dish)"
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

    <!-- 底部购物车栏 -->
    <view v-if="totalCount > 0" class="cart-bar fixed bottom-0 left-0 right-0 z-50 bg-gray-800 rounded-t-2xl">
      <view class="flex items-center px-32rpx py-20rpx">
        <view class="relative" @click="handleCartClick">
          <view class="w-88rpx h-88rpx rounded-full bg-orange-500 flex items-center justify-center -mt-40rpx border-8rpx border-gray-800">
            <wd-icon name="cart" size="44rpx" color="#fff" />
          </view>
          <view class="absolute -top-40rpx -right-8rpx min-w-36rpx h-36rpx bg-red-500 rounded-full flex items-center justify-center px-8rpx">
            <text class="text-white text-[20rpx]">{{ totalCount }}</text>
          </view>
        </view>
        <view class="ml-24rpx flex-1">
          <text class="text-white font-bold text-lg">¥{{ totalPrice }}</text>
          <text class="text-gray-400 text-[22rpx] block">另需配送费¥3</text>
        </view>
        <wd-button type="warning" size="medium" round @click="handleCheckout">去结算</wd-button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useToast } from '@/wd'

const toast = useToast()
const activeCategory = ref(0)

interface DishItem {
  id: number
  name: string
  desc: string
  img: string
  price: string
  monthlySales: string
  quantity: number
}

interface MenuCategory {
  id: number
  name: string
  dishes: DishItem[]
}

const menuCategories = ref<MenuCategory[]>([
  {
    id: 1, name: '🔥 热销',
    dishes: [
      { id: 1, name: '黄焖鸡米饭（大份）', desc: '鸡腿肉+土豆+青椒+米饭', img: 'https://picsum.photos/144/144?random=51', price: '28', monthlySales: '1256', quantity: 0 },
      { id: 2, name: '黄焖排骨米饭', desc: '排骨+土豆+香菇+米饭', img: 'https://picsum.photos/144/144?random=52', price: '32', monthlySales: '890', quantity: 0 },
      { id: 3, name: '香辣鸡腿堡套餐', desc: '鸡腿堡+薯条+可乐', img: 'https://picsum.photos/144/144?random=53', price: '35', monthlySales: '650', quantity: 0 },
    ],
  },
  {
    id: 2, name: '🏅 招牌菜',
    dishes: [
      { id: 4, name: '秘制黄焖鸡', desc: '秘制酱料 口感浓郁', img: 'https://picsum.photos/144/144?random=54', price: '25', monthlySales: '2100', quantity: 0 },
      { id: 5, name: '老坛酸菜鱼', desc: '新鲜鲈鱼+老坛酸菜', img: 'https://picsum.photos/144/144?random=55', price: '38', monthlySales: '560', quantity: 0 },
    ],
  },
  {
    id: 3, name: '🍚 主食',
    dishes: [
      { id: 6, name: '米饭（大碗）', desc: '东北大米', img: 'https://picsum.photos/144/144?random=56', price: '3', monthlySales: '5200', quantity: 0 },
      { id: 7, name: '炒面', desc: '手工拉面', img: 'https://picsum.photos/144/144?random=57', price: '15', monthlySales: '980', quantity: 0 },
    ],
  },
  {
    id: 4, name: '🍢 小吃',
    dishes: [
      { id: 8, name: '炸鸡翅（3只）', desc: '外酥里嫩', img: 'https://picsum.photos/144/144?random=58', price: '12', monthlySales: '1800', quantity: 0 },
      { id: 9, name: '烤肠（2根）', desc: '台湾烤肠', img: 'https://picsum.photos/144/144?random=59', price: '8', monthlySales: '2300', quantity: 0 },
    ],
  },
  {
    id: 5, name: '🥤 饮品',
    dishes: [
      { id: 10, name: '可口可乐', desc: '330ml罐装', img: 'https://picsum.photos/144/144?random=60', price: '5', monthlySales: '3600', quantity: 0 },
      { id: 11, name: '柠檬水', desc: '鲜榨柠檬', img: 'https://picsum.photos/144/144?random=61', price: '8', monthlySales: '1200', quantity: 0 },
    ],
  },
  {
    id: 6, name: '🎁 套餐',
    dishes: [
      { id: 12, name: '单人套餐A', desc: '黄焖鸡+米饭+可乐', img: 'https://picsum.photos/144/144?random=62', price: '30', monthlySales: '890', quantity: 0 },
      { id: 13, name: '双人套餐', desc: '黄焖鸡x2+米饭x2+饮品x2', img: 'https://picsum.photos/144/144?random=63', price: '55', monthlySales: '430', quantity: 0 },
    ],
  },
])

const totalCount = computed(() => {
  return menuCategories.value.reduce((sum, cat) => {
    return sum + cat.dishes.reduce((s, d) => s + d.quantity, 0)
  }, 0)
})

const totalPrice = computed(() => {
  const total = menuCategories.value.reduce((sum, cat) => {
    return sum + cat.dishes.reduce((s, d) => s + Number(d.price) * d.quantity, 0)
  }, 0)
  return total.toFixed(0)
})

const handleChange = ({ value }: { value: number }) => { activeCategory.value = value }
const handlePlus = (dish: DishItem) => { dish.quantity++ }
const handleMinus = (dish: DishItem) => { if (dish.quantity > 0) dish.quantity-- }
const handleCartClick = () => toast.info('查看购物车')
const handleCheckout = () => toast.success('去结算')
</script>

<style lang="scss" scoped>
.menu-wrapper {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.menu-content {
  flex: 1;
  background: #fff;
}

.cart-bar {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
