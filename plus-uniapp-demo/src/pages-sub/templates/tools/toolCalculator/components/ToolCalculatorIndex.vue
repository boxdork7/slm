<!-- 计算器 - 标准计算 -->
<template>
  <view class="min-h-screen bg-#1c1c1e flex flex-col">
    <!-- 显示区域 -->
    <view class="flex-1 flex flex-col justify-end px-48rpx pb-32rpx">
      <text class="text-40rpx text-#8e8e93 text-right block mb-8rpx min-h-56rpx">{{ expression }}</text>
      <text class="text-128rpx font-300 text-white text-right block leading-none">{{ display }}</text>
    </view>

    <!-- 键盘区域 -->
    <view class="px-24rpx pb-16rpx flex flex-col gap-20rpx">
      <!-- 第1行：功能键 + 除号 -->
      <view class="grid grid-cols-4 gap-20rpx">
        <view
          v-for="key in row1"
          :key="key.label"
          class="h-136rpx rounded-68rpx flex items-center justify-center"
          :class="key.type === 'func' ? 'bg-#a5a5a5' : 'bg-#0EA5E9'"
          @tap="onKey(key.label)"
        >
          <text
            class="text-56rpx font-400"
            :class="key.type === 'func' ? 'text-#1c1c1e text-44rpx' : 'text-white'"
          >{{ key.label }}</text>
        </view>
      </view>

      <!-- 第2行：7 8 9 × -->
      <view class="grid grid-cols-4 gap-20rpx">
        <view
          v-for="key in row2"
          :key="key.label"
          class="h-136rpx rounded-68rpx flex items-center justify-center"
          :class="key.type === 'op' ? 'bg-#0EA5E9' : 'bg-#333333'"
          @tap="onKey(key.label)"
        >
          <text class="text-56rpx font-400 text-white">{{ key.label }}</text>
        </view>
      </view>

      <!-- 第3行：4 5 6 − -->
      <view class="grid grid-cols-4 gap-20rpx">
        <view
          v-for="key in row3"
          :key="key.label"
          class="h-136rpx rounded-68rpx flex items-center justify-center"
          :class="key.type === 'op' ? 'bg-#0EA5E9' : 'bg-#333333'"
          @tap="onKey(key.label)"
        >
          <text class="text-56rpx font-400 text-white">{{ key.label }}</text>
        </view>
      </view>

      <!-- 第4行：1 2 3 + -->
      <view class="grid grid-cols-4 gap-20rpx">
        <view
          v-for="key in row4"
          :key="key.label"
          class="h-136rpx rounded-68rpx flex items-center justify-center"
          :class="key.type === 'op' ? 'bg-#0EA5E9' : 'bg-#333333'"
          @tap="onKey(key.label)"
        >
          <text class="text-56rpx font-400 text-white">{{ key.label }}</text>
        </view>
      </view>

      <!-- 第5行：0(占2格) . = -->
      <view class="grid grid-cols-4 gap-20rpx">
        <view
          class="h-136rpx rounded-68rpx flex items-center justify-start pl-56rpx bg-#333333 col-span-2"
          @tap="onKey('0')"
        >
          <text class="text-56rpx font-400 text-white">0</text>
        </view>
        <view
          class="h-136rpx rounded-68rpx flex items-center justify-center bg-#333333"
          @tap="onKey('.')"
        >
          <text class="text-56rpx font-400 text-white">.</text>
        </view>
        <view
          class="h-136rpx rounded-68rpx flex items-center justify-center bg-#0EA5E9"
          @tap="onKey('=')"
        >
          <text class="text-56rpx font-400 text-white">=</text>
        </view>
      </view>
    </view>

    <!-- 底部留空 -->
    <view class="h-32rpx" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const display = ref('384')
const expression = ref('128 + 256')

const row1 = [
  { label: 'AC', type: 'func' },
  { label: '±', type: 'func' },
  { label: '%', type: 'func' },
  { label: '÷', type: 'op' },
]

const row2 = [
  { label: '7', type: 'num' },
  { label: '8', type: 'num' },
  { label: '9', type: 'num' },
  { label: '×', type: 'op' },
]

const row3 = [
  { label: '4', type: 'num' },
  { label: '5', type: 'num' },
  { label: '6', type: 'num' },
  { label: '−', type: 'op' },
]

const row4 = [
  { label: '1', type: 'num' },
  { label: '2', type: 'num' },
  { label: '3', type: 'num' },
  { label: '+', type: 'op' },
]

/** 按键点击处理 */
const onKey = (key: string) => {
  if (key === 'AC') {
    display.value = '0'
    expression.value = ''
  } else if (key === '=') {
    /* 简单 mock：直接展示当前值 */
  } else if (key === '±') {
    if (display.value.startsWith('-')) {
      display.value = display.value.slice(1)
    } else if (display.value !== '0') {
      display.value = '-' + display.value
    }
  } else if (key === '%') {
    const num = parseFloat(display.value)
    display.value = String(num / 100)
  } else if (['+', '−', '×', '÷'].includes(key)) {
    expression.value = display.value + ' ' + key
    display.value = '0'
  } else {
    if (display.value === '0' && key !== '.') {
      display.value = key
    } else {
      display.value += key
    }
  }
}
</script>

<style scoped lang="scss"></style>
