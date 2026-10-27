<!-- 生鲜商城 - 分类 -->
<template>
  <view class="h-100vh flex flex-col bg-gray-50">
    <!-- 搜索栏 -->
    <view class="bg-white px-32rpx py-20rpx">
      <wd-search v-model="searchValue" placeholder="搜索商品" :hide-cancel="true" @search="handleSearch" />
    </view>

    <!-- 分类主体 -->
    <view class="category-wrapper">
      <!-- 左侧分类栏 -->
      <wd-sidebar v-model="activeCategory" @change="handleChange">
        <wd-sidebar-item
          v-for="(item, index) in categoryList"
          :key="item.id"
          :value="index"
          :label="`${item.emoji} ${item.name}`"
        />
      </wd-sidebar>

      <!-- 右侧内容 -->
      <scroll-view class="category-content" scroll-y :show-scrollbar="false">
        <view
          v-for="subCategory in categoryList[activeCategory]?.children"
          :key="subCategory.id"
          class="px-24rpx pt-32rpx"
        >
          <text class="text-sm font-bold text-gray-800 mb-24rpx block">{{ subCategory.name }}</text>
          <view class="grid grid-cols-3 gap-16rpx">
            <view
              v-for="goods in subCategory.goodsList"
              :key="goods.id"
              class="flex flex-col items-center"
              @click="handleAddToCart(goods)"
            >
              <view class="w-136rpx h-136rpx rounded-xl flex items-center justify-center" :style="{ background: goods.bgColor }">
                <text class="text-[56rpx]">{{ goods.emoji }}</text>
              </view>
              <text class="text-[22rpx] text-gray-600 mt-12rpx text-center">{{ goods.name }}</text>
              <text class="text-[20rpx] text-green-500 font-medium">¥{{ goods.price }}</text>
            </view>
          </view>
        </view>
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

interface GoodsItem { id: number; name: string; emoji: string; price: string; bgColor: string }
interface SubCategory { id: number; name: string; goodsList: GoodsItem[] }
interface Category { id: number; name: string; emoji: string; children: SubCategory[] }

const categoryList = ref<Category[]>([
  {
    id: 1, name: '蔬菜', emoji: '🥬',
    children: [
      { id: 11, name: '叶菜类', goodsList: [
        { id: 1, name: '大白菜', emoji: '🥬', price: '3.5', bgColor: '#f0fdf4' },
        { id: 2, name: '西蓝花', emoji: '🥦', price: '8.9', bgColor: '#f0fdf4' },
        { id: 3, name: '黄瓜', emoji: '🥒', price: '4.5', bgColor: '#f0fdf4' },
      ]},
      { id: 12, name: '根茎类', goodsList: [
        { id: 4, name: '胡萝卜', emoji: '🥕', price: '2.8', bgColor: '#fff7ed' },
        { id: 5, name: '土豆', emoji: '🥔', price: '3.2', bgColor: '#fefce8' },
        { id: 6, name: '茄子', emoji: '🍆', price: '5.0', bgColor: '#faf5ff' },
      ]},
      { id: 13, name: '菌菇类', goodsList: [
        { id: 7, name: '香菇', emoji: '🍄', price: '9.9', bgColor: '#fffbeb' },
        { id: 8, name: '金针菇', emoji: '🍄', price: '4.9', bgColor: '#fffbeb' },
        { id: 9, name: '平菇', emoji: '🍄', price: '6.5', bgColor: '#fffbeb' },
      ]},
    ],
  },
  {
    id: 2, name: '水果', emoji: '🍎',
    children: [
      { id: 21, name: '当季水果', goodsList: [
        { id: 21, name: '草莓', emoji: '🍓', price: '29.9', bgColor: '#fef2f2' },
        { id: 22, name: '葡萄', emoji: '🍇', price: '12.9', bgColor: '#faf5ff' },
        { id: 23, name: '香蕉', emoji: '🍌', price: '5.9', bgColor: '#fefce8' },
      ]},
      { id: 22, name: '进口水果', goodsList: [
        { id: 24, name: '车厘子', emoji: '🍒', price: '59.9', bgColor: '#fef2f2' },
        { id: 25, name: '牛油果', emoji: '🥑', price: '15.9', bgColor: '#f0fdf4' },
        { id: 26, name: '奇异果', emoji: '🥝', price: '19.9', bgColor: '#f0fdf4' },
      ]},
    ],
  },
  {
    id: 3, name: '肉禽', emoji: '🥩',
    children: [
      { id: 31, name: '猪肉', goodsList: [
        { id: 31, name: '五花肉', emoji: '🥩', price: '25.9', bgColor: '#fef2f2' },
        { id: 32, name: '里脊肉', emoji: '🥩', price: '29.9', bgColor: '#fef2f2' },
        { id: 33, name: '排骨', emoji: '🍖', price: '35.9', bgColor: '#fef2f2' },
      ]},
      { id: 32, name: '禽蛋', goodsList: [
        { id: 34, name: '土鸡蛋', emoji: '🥚', price: '15.8', bgColor: '#fefce8' },
        { id: 35, name: '鸡腿', emoji: '🍗', price: '18.9', bgColor: '#fff7ed' },
        { id: 36, name: '鸭肉', emoji: '🦆', price: '22.0', bgColor: '#fff7ed' },
      ]},
    ],
  },
  {
    id: 4, name: '海鲜', emoji: '🦐',
    children: [
      { id: 41, name: '鱼类', goodsList: [
        { id: 41, name: '三文鱼', emoji: '🐟', price: '59.9', bgColor: '#eff6ff' },
        { id: 42, name: '鲈鱼', emoji: '🐟', price: '32.0', bgColor: '#eff6ff' },
        { id: 43, name: '带鱼', emoji: '🐟', price: '22.0', bgColor: '#eff6ff' },
      ]},
      { id: 42, name: '虾蟹', goodsList: [
        { id: 44, name: '大虾', emoji: '🦐', price: '45.0', bgColor: '#fef2f2' },
        { id: 45, name: '螃蟹', emoji: '🦀', price: '68.0', bgColor: '#fff7ed' },
        { id: 46, name: '龙虾', emoji: '🦞', price: '128.0', bgColor: '#fef2f2' },
      ]},
    ],
  },
])

const handleChange = ({ value }: { value: number }) => { activeCategory.value = value }
const handleSearch = () => toast.info(`搜索: ${searchValue.value}`)
const handleAddToCart = (goods: GoodsItem) => toast.success(`已加入购物车: ${goods.name}`)
</script>

<style lang="scss" scoped>
.category-wrapper { display: flex; flex: 1; overflow: hidden; }
.category-content { flex: 1; background: #fff; }
</style>
