<!-- NumberKeyboard 数字键盘 http://127.0.0.1:100/#/pages-sub/demo/wd/numberkeyboard -->
<template>
  <view>
    <wd-toast />
    <wd-navbar title="NumberKeyboard 数字键盘" show-back />

    <!-- 基本用法 -->
    <view class="mx-4 mt-4 rounded-xl bg-white p-4">
      <view class="mb-3 text-base font-medium">基本用法</view>
      <wd-cell-group border>
        <wd-cell title="默认键盘" is-link @click="showKeyBoard(1)" />
        <wd-cell title="带有侧栏的键盘" is-link @click="showKeyBoard(2)" />
        <wd-cell title="身份证键盘" is-link @click="showKeyBoard(3)" />
        <wd-cell title="带标题的键盘" is-link @click="showKeyBoard(4)" />
        <wd-cell title="插槽自定义标题" is-link @click="showKeyBoard(9)" />
        <wd-cell title="多个额外按键" is-link @click="showKeyBoard(5)" />
        <wd-cell title="随机数字键盘" is-link @click="showKeyBoard(6)" />
        <wd-cell title="双向绑定" clickable :value="inputValue" @click="showKeyBoard(7)" />
        <wd-cell title="展示蒙层" clickable @click="showKeyBoard(8)" />
      </wd-cell-group>
    </view>

    <!-- 键盘组件 -->
    <!-- 默认键盘 -->
    <wd-number-keyboard
      v-model:visible="visible1"
      @input="handleInput"
      @delete="handleDelete"
    />

    <!-- 带有侧栏的键盘 -->
    <wd-number-keyboard
      v-model:visible="visible2"
      mode="custom"
      extra-key="."
      close-text="完成"
      @input="handleInput"
      @delete="handleDelete"
    />

    <!-- 身份证键盘 -->
    <wd-number-keyboard
      v-model:visible="visible3"
      extra-key="X"
      close-text="完成"
      @input="handleInput"
      @delete="handleDelete"
    />

    <!-- 带标题的键盘 -->
    <wd-number-keyboard
      v-model:visible="visible4"
      title="输入密码"
      extra-key="."
      close-text="完成"
      @input="handleInput"
      @delete="handleDelete"
    />

    <!-- 插槽自定义标题 -->
    <wd-number-keyboard
      v-model:visible="visible9"
      extra-key="."
      close-text="完成"
      @input="handleInput"
      @delete="handleDelete"
    >
      <template #title>
        <text class="text-red-500">自定义标题</text>
      </template>
    </wd-number-keyboard>

    <!-- 多个额外按键 -->
    <wd-number-keyboard
      v-model:visible="visible5"
      mode="custom"
      :extra-key="['00', '.']"
      close-text="完成"
      @input="handleInput"
      @delete="handleDelete"
    />

    <!-- 随机数字键盘 -->
    <wd-number-keyboard
      v-model:visible="visible6"
      random-key-order
      @input="handleInput"
      @delete="handleDelete"
    />

    <!-- 双向绑定 -->
    <wd-number-keyboard
      v-model="inputValue"
      v-model:visible="visible7"
      :maxlength="6"
      title="键盘标题"
      extra-key="."
      close-text="完成"
      @input="handleInput"
      @delete="handleDelete"
    />

    <!-- 展示蒙层 -->
    <wd-number-keyboard
      v-model:visible="visible8"
      :modal="true"
      @input="handleInput"
      @delete="handleDelete"
    />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/wd'

const toast = useToast()

// 控制键盘显示状态
const visible1 = ref(false)
const visible2 = ref(false)
const visible3 = ref(false)
const visible4 = ref(false)
const visible5 = ref(false)
const visible6 = ref(false)
const visible7 = ref(false)
const visible8 = ref(false)
const visible9 = ref(false)

// 键盘显示状态数组，用于统一管理
const visibleArr = [
  visible1,
visible2,
visible3,
visible4,
visible5,
  visible6,
visible7,
visible8,
visible9
]

// 输入值，用于双向绑定示例
const inputValue = ref('')

// 显示指定索引的键盘
const showKeyBoard = (index: number) => {
  visibleArr.forEach((item, i) => {
    item.value = i === index - 1
  })
}

// 处理键盘输入事件
const handleInput = (value: string) => {
  toast.show(`输入: ${value}`)
}

// 处理键盘删除事件
const handleDelete = () => {
  toast.show('删除')
}

const { resetScrollTop, updateScrollTop } = useScroll()
onShow(() => {
  resetScrollTop()
})
onPageScroll((e) => {
  updateScrollTop(e.scrollTop)
})
</script>
