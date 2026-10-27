<!-- 计算器 - 单位转换 -->
<template>
  <view class="min-h-screen bg-#f5f5f5">
    <!-- 顶部标题栏 -->
    <view class="bg-white px-32rpx py-24rpx" style="border-bottom: 1px solid #f0f0f0">
      <text class="text-40rpx font-700 text-#1f2937">单位转换</text>
    </view>

    <!-- 分类 Tab -->
    <view class="px-32rpx py-28rpx flex gap-16rpx flex-wrap">
      <wd-tag
        v-for="cat in categories"
        :key="cat.name"
        :type="activeCategory === cat.name ? 'primary' : 'default'"
        round
        :custom-style="activeCategory === cat.name
          ? 'background: #0EA5E9; color: white; padding: 12rpx 28rpx; font-size: 26rpx;'
          : 'background: white; color: #6b7280; border: 1px solid #e5e7eb; padding: 12rpx 28rpx; font-size: 26rpx;'"
        @tap="onCategoryChange(cat.name)"
      >
        {{ cat.name }}
      </wd-tag>
    </view>

    <!-- 转换卡片 -->
    <view class="px-32rpx">
      <view class="bg-white rounded-32rpx overflow-hidden shadow-sm">
        <!-- 从 -->
        <view class="px-40rpx pt-40rpx pb-32rpx">
          <view class="flex justify-between items-center mb-24rpx">
            <text class="text-26rpx text-#9ca3af font-500">从</text>
            <view class="flex items-center gap-8rpx bg-#f0f9ff px-20rpx py-8rpx rounded-16rpx">
              <text class="text-26rpx text-#0EA5E9 font-600">{{ currentConversion.fromUnit }}</text>
              <wd-icon name="fill-arrow-down" color="#0EA5E9" size="28rpx" />
            </view>
          </view>
          <text class="text-80rpx font-300 text-#1f2937 block">{{ currentConversion.fromValue }}</text>
          <view class="h-4rpx rounded-2rpx mt-8rpx" style="background: linear-gradient(90deg, #0EA5E9, #38bdf8)" />
        </view>

        <!-- 交换按钮 -->
        <view class="flex justify-center py-8rpx">
          <view
            class="w-88rpx h-88rpx bg-#0EA5E9 rounded-full flex items-center justify-center"
            style="box-shadow: 0 8rpx 24rpx rgba(14,165,233,0.3)"
            @tap="onSwap"
          >
            <text class="text-36rpx text-white">⇅</text>
          </view>
        </view>

        <!-- 到 -->
        <view class="px-40rpx pt-32rpx pb-40rpx">
          <view class="flex justify-between items-center mb-24rpx">
            <text class="text-26rpx text-#9ca3af font-500">到</text>
            <view class="flex items-center gap-8rpx bg-#f5f5f5 px-20rpx py-8rpx rounded-16rpx">
              <text class="text-26rpx text-#6b7280 font-600">{{ currentConversion.toUnit }}</text>
              <wd-icon name="fill-arrow-down" color="#6b7280" size="28rpx" />
            </view>
          </view>
          <text class="text-80rpx font-300 text-#0EA5E9 block">{{ currentConversion.toValue }}</text>
          <view class="h-4rpx bg-#e5e7eb rounded-2rpx mt-8rpx" />
        </view>
      </view>
    </view>

    <!-- 换算公式 -->
    <view class="py-32rpx text-center">
      <text class="text-26rpx text-#9ca3af">{{ currentConversion.formula }}</text>
    </view>

    <!-- 常用换算 -->
    <view class="px-32rpx pb-40rpx">
      <text class="text-28rpx font-600 text-#1f2937 block mb-20rpx">常用换算</text>

      <view class="bg-white rounded-24rpx overflow-hidden shadow-sm">
        <view
          v-for="(item, index) in currentConversion.quickList"
          :key="item.name"
          class="flex justify-between items-center px-32rpx py-24rpx"
          :style="index < currentConversion.quickList.length - 1 ? 'border-bottom: 1px solid #f5f5f5' : ''"
        >
          <view class="flex items-center gap-8rpx">
            <text class="text-28rpx text-#1f2937">{{ item.name }}</text>
            <text class="text-24rpx text-#9ca3af">{{ item.unit }}</text>
          </view>
          <text class="text-32rpx font-600 text-#0EA5E9">{{ item.value }}</text>
        </view>
      </view>
    </view>

    <!-- 底部留空 -->
    <view class="h-32rpx" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const activeCategory = ref('长度')

interface QuickItem {
  name: string
  unit: string
  value: string
}

interface ConversionData {
  fromUnit: string
  fromValue: string
  toUnit: string
  toValue: string
  formula: string
  quickList: QuickItem[]
}

const categories = [
  { name: '长度' },
  { name: '重量' },
  { name: '温度' },
  { name: '面积' },
]

/* 各分类的转换数据 */
const conversionMap: Record<string, ConversionData> = {
  长度: {
    fromUnit: '千米 (km)',
    fromValue: '1',
    toUnit: '米 (m)',
    toValue: '1,000',
    formula: '1 千米 = 1,000 米',
    quickList: [
      { name: '厘米', unit: 'cm', value: '100,000' },
      { name: '毫米', unit: 'mm', value: '1,000,000' },
      { name: '英里', unit: 'mi', value: '0.6214' },
      { name: '英尺', unit: 'ft', value: '3,280.84' },
      { name: '英寸', unit: 'in', value: '39,370.08' },
    ],
  },
  重量: {
    fromUnit: '千克 (kg)',
    fromValue: '1',
    toUnit: '克 (g)',
    toValue: '1,000',
    formula: '1 千克 = 1,000 克',
    quickList: [
      { name: '毫克', unit: 'mg', value: '1,000,000' },
      { name: '吨', unit: 't', value: '0.001' },
      { name: '磅', unit: 'lb', value: '2.2046' },
      { name: '盎司', unit: 'oz', value: '35.274' },
      { name: '斤', unit: '斤', value: '2' },
    ],
  },
  温度: {
    fromUnit: '摄氏度 (°C)',
    fromValue: '100',
    toUnit: '华氏度 (°F)',
    toValue: '212',
    formula: '°F = °C × 9/5 + 32',
    quickList: [
      { name: '开尔文', unit: 'K', value: '373.15' },
      { name: '兰氏度', unit: '°Ra', value: '671.67' },
      { name: '列氏度', unit: '°Ré', value: '80' },
    ],
  },
  面积: {
    fromUnit: '平方米 (m²)',
    fromValue: '1',
    toUnit: '平方厘米 (cm²)',
    toValue: '10,000',
    formula: '1 平方米 = 10,000 平方厘米',
    quickList: [
      { name: '平方千米', unit: 'km²', value: '0.000001' },
      { name: '公顷', unit: 'ha', value: '0.0001' },
      { name: '亩', unit: '亩', value: '0.0015' },
      { name: '平方英尺', unit: 'ft²', value: '10.7639' },
      { name: '平方英寸', unit: 'in²', value: '1,550' },
    ],
  },
}

const currentConversion = computed(() => conversionMap[activeCategory.value])

/** 切换分类 */
const onCategoryChange = (name: string) => {
  activeCategory.value = name
}

/** 交换单位 */
const onSwap = () => {
  const data = conversionMap[activeCategory.value]
  const tmpUnit = data.fromUnit
  const tmpValue = data.fromValue
  data.fromUnit = data.toUnit
  data.fromValue = data.toValue
  data.toUnit = tmpUnit
  data.toValue = tmpValue
}
</script>

<style scoped lang="scss"></style>
