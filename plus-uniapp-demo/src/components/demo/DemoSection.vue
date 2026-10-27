<!-- DemoSection.vue - 示例区域容器组件 -->
<template>
  <view class="m-2">
    <!-- 主内容区域 -->
    <!-- 标题和描述区域 -->
    <view>
      <view v-if="title" class="text-base text-gray-900 font-500">
        {{ title }}
      </view>
      <view v-if="desc" class="mt-1 text-sm text-gray-500">
        {{ desc }}
      </view>
    </view>

    <!-- 效果展示区域 -->
    <view class="p-2">
      <slot />
    </view>

    <!-- 代码展示区域 - 改进的展开效果 -->
    <view v-if="$slots.codes">
      <!-- 自定义的查看代码按钮 -->
      <view class="rounded-tl-lg rounded-tr-lg bg-gray-50 px-4 py-3" @click="toggleCodes">
        <view class="flex items-center justify-between">
          <wd-text color="#333" :text="codesVisible ? '收起代码' : '查看代码'" />
          <wd-icon :name="codesVisible ? 'up' : 'down'" size="30" color="#666" />
        </view>
      </view>

      <!-- 代码内容区域 -->
      <view
        class="mb-4 overflow-hidden transition-all duration-300 ease-in-out"
        :style="{
          maxHeight: codesVisible ? 'none' : '0px',
          opacity: codesVisible ? 1 : 0,
        }"
      >
        <view class="bg-gray-50">
          <slot name="codes" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  name: 'DemoSection',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

/**
 * 示例区域容器组件
 * 用于包装组件示例，提供统一的标题、描述、内容展示和代码展示功能
 */

/**
 * 组件属性接口定义
 */
interface DemoSectionProps {
  /** 示例标题 - 必填 */
  title: string
  /** 示例描述 - 可选，用于补充说明 */
  desc?: string
}

/**
 * 定义组件属性及默认值
 */
defineProps<DemoSectionProps>()

// 代码区域的显示状态
const codesVisible = ref(false)

// 切换代码显示状态
const toggleCodes = () => {
  codesVisible.value = !codesVisible.value
}
</script>

<style lang="scss" scoped></style>
