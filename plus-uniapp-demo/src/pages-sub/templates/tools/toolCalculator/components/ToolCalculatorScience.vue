<!-- 计算器 - 科学计算 -->
<template>
  <view class="min-h-screen bg-#1c1c1e flex flex-col">
    <!-- 显示区域 -->
    <view class="flex-1 flex flex-col justify-end px-32rpx pb-24rpx">
      <text class="text-32rpx text-#8e8e93 text-right block mb-4rpx min-h-44rpx">{{ expression }}</text>
      <text class="text-96rpx font-300 text-white text-right block leading-none">{{ display }}</text>
    </view>

    <!-- 键盘区域 -->
    <view class="px-16rpx pb-12rpx flex flex-col gap-12rpx">
      <!-- 科学函数行1：sin cos tan log ln -->
      <view class="grid grid-cols-5 gap-12rpx">
        <view
          v-for="key in sciRow1"
          :key="key"
          class="h-96rpx rounded-48rpx flex items-center justify-center bg-#2c2c2e"
          @tap="onSciKey(key)"
        >
          <text class="text-28rpx font-500 text-#0EA5E9">{{ key }}</text>
        </view>
      </view>

      <!-- 科学函数行2：x² xⁿ √ π e -->
      <view class="grid grid-cols-5 gap-12rpx">
        <view
          v-for="key in sciRow2"
          :key="key"
          class="h-96rpx rounded-48rpx flex items-center justify-center bg-#2c2c2e"
          @tap="onSciKey(key)"
        >
          <text class="text-28rpx font-500 text-#0EA5E9">{{ key }}</text>
        </view>
      </view>

      <!-- 科学函数行3：( ) x! 1/x |x| -->
      <view class="grid grid-cols-5 gap-12rpx">
        <view
          v-for="key in sciRow3"
          :key="key"
          class="h-96rpx rounded-48rpx flex items-center justify-center bg-#2c2c2e"
          @tap="onSciKey(key)"
        >
          <text class="text-28rpx font-500 text-#0EA5E9">{{ key }}</text>
        </view>
      </view>

      <!-- 标准行1：AC ± % ÷ -->
      <view class="grid grid-cols-4 gap-12rpx">
        <view
          v-for="key in stdRow1"
          :key="key.label"
          class="h-96rpx rounded-48rpx flex items-center justify-center"
          :class="key.type === 'func' ? 'bg-#a5a5a5' : 'bg-#0EA5E9'"
          @tap="onKey(key.label)"
        >
          <text
            class="text-36rpx font-400"
            :class="key.type === 'func' ? 'text-#1c1c1e text-32rpx' : 'text-white'"
          >{{ key.label }}</text>
        </view>
      </view>

      <!-- 标准行2：7 8 9 × -->
      <view class="grid grid-cols-4 gap-12rpx">
        <view
          v-for="key in stdRow2"
          :key="key.label"
          class="h-96rpx rounded-48rpx flex items-center justify-center"
          :class="key.type === 'op' ? 'bg-#0EA5E9' : 'bg-#333333'"
          @tap="onKey(key.label)"
        >
          <text class="text-36rpx font-400 text-white">{{ key.label }}</text>
        </view>
      </view>

      <!-- 标准行3：4 5 6 − -->
      <view class="grid grid-cols-4 gap-12rpx">
        <view
          v-for="key in stdRow3"
          :key="key.label"
          class="h-96rpx rounded-48rpx flex items-center justify-center"
          :class="key.type === 'op' ? 'bg-#0EA5E9' : 'bg-#333333'"
          @tap="onKey(key.label)"
        >
          <text class="text-36rpx font-400 text-white">{{ key.label }}</text>
        </view>
      </view>

      <!-- 标准行4：1 2 3 + -->
      <view class="grid grid-cols-4 gap-12rpx">
        <view
          v-for="key in stdRow4"
          :key="key.label"
          class="h-96rpx rounded-48rpx flex items-center justify-center"
          :class="key.type === 'op' ? 'bg-#0EA5E9' : 'bg-#333333'"
          @tap="onKey(key.label)"
        >
          <text class="text-36rpx font-400 text-white">{{ key.label }}</text>
        </view>
      </view>

      <!-- 标准行5：0(占2格) . = -->
      <view class="grid grid-cols-4 gap-12rpx">
        <view
          class="h-96rpx rounded-48rpx flex items-center justify-start pl-40rpx bg-#333333 col-span-2"
          @tap="onKey('0')"
        >
          <text class="text-36rpx font-400 text-white">0</text>
        </view>
        <view
          class="h-96rpx rounded-48rpx flex items-center justify-center bg-#333333"
          @tap="onKey('.')"
        >
          <text class="text-36rpx font-400 text-white">.</text>
        </view>
        <view
          class="h-96rpx rounded-48rpx flex items-center justify-center bg-#0EA5E9"
          @tap="onKey('=')"
        >
          <text class="text-36rpx font-400 text-white">=</text>
        </view>
      </view>
    </view>

    <!-- 底部留空 -->
    <view class="h-32rpx" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const display = ref('0.5')
const expression = ref('sin(30)')

const sciRow1 = ['sin', 'cos', 'tan', 'log', 'ln']
const sciRow2 = ['x²', 'xⁿ', '√', 'π', 'e']
const sciRow3 = ['(', ')', 'x!', '1/x', '|x|']

const stdRow1 = [
  { label: 'AC', type: 'func' },
  { label: '±', type: 'func' },
  { label: '%', type: 'func' },
  { label: '÷', type: 'op' },
]

const stdRow2 = [
  { label: '7', type: 'num' },
  { label: '8', type: 'num' },
  { label: '9', type: 'num' },
  { label: '×', type: 'op' },
]

const stdRow3 = [
  { label: '4', type: 'num' },
  { label: '5', type: 'num' },
  { label: '6', type: 'num' },
  { label: '−', type: 'op' },
]

const stdRow4 = [
  { label: '1', type: 'num' },
  { label: '2', type: 'num' },
  { label: '3', type: 'num' },
  { label: '+', type: 'op' },
]

/** 科学函数按键处理 */
const onSciKey = (key: string) => {
  if (key === 'π') {
    display.value = '3.14159265'
    expression.value = 'π'
  } else if (key === 'e') {
    display.value = '2.71828183'
    expression.value = 'e'
  } else if (key === 'x²') {
    const num = parseFloat(display.value)
    expression.value = `${display.value}²`
    display.value = String(num * num)
  } else if (key === '√') {
    const num = parseFloat(display.value)
    expression.value = `√${display.value}`
    display.value = String(Math.sqrt(num))
  } else if (key === '1/x') {
    const num = parseFloat(display.value)
    expression.value = `1/${display.value}`
    display.value = num !== 0 ? String(1 / num) : 'Error'
  } else if (key === '|x|') {
    const num = parseFloat(display.value)
    expression.value = `|${display.value}|`
    display.value = String(Math.abs(num))
  } else if (key === 'sin') {
    const num = parseFloat(display.value)
    expression.value = `sin(${display.value})`
    display.value = String(Math.sin(num * Math.PI / 180))
  } else if (key === 'cos') {
    const num = parseFloat(display.value)
    expression.value = `cos(${display.value})`
    display.value = String(Math.cos(num * Math.PI / 180))
  } else if (key === 'tan') {
    const num = parseFloat(display.value)
    expression.value = `tan(${display.value})`
    display.value = String(Math.tan(num * Math.PI / 180))
  } else if (key === 'log') {
    const num = parseFloat(display.value)
    expression.value = `log(${display.value})`
    display.value = String(Math.log10(num))
  } else if (key === 'ln') {
    const num = parseFloat(display.value)
    expression.value = `ln(${display.value})`
    display.value = String(Math.log(num))
  } else if (key === 'x!') {
    const num = parseInt(display.value)
    expression.value = `${display.value}!`
    let result = 1
    for (let i = 2; i <= num; i++) result *= i
    display.value = String(result)
  } else {
    /* 括号等直接追加 */
    display.value += key
  }
}

/** 标准按键处理 */
const onKey = (key: string) => {
  if (key === 'AC') {
    display.value = '0'
    expression.value = ''
  } else if (key === '=') {
    /* mock */
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
