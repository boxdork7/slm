<!-- DemoCode.vue - 代码展示块组件 -->
<template>
  <view>
    <!-- 代码块头部 - 包含标题和复制按钮 -->
    <view class="flex items-center justify-between px-2 py-1">
      <!-- 代码块标题 -->
      <view class="text-sm text-gray-700 font-500">
        {{ title }}
      </view>

      <!-- 复制按钮 -->
      <wd-button
        size="small"
        type="text"
        class="text-blue-500 hover:text-blue-600"
        @click="copy(code, `${title} 代码已复制`)"
      >
        复制
      </wd-button>
    </view>

    <!-- 代码内容区域 -->
    <view class="code-wrapper">
      <text class="code-text">{{ formattedCode }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { copy } from '@/utils/function'

/**
 * 组件选项配置
 */
defineOptions({
  name: 'DemoCode',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

/**
 * 代码展示块组件
 * 用于展示代码片段，支持语法高亮和一键复制功能
 */

/**
 * 组件属性接口定义
 */
interface DemoCodeProps {
  /** 代码块标题 - 必填 */
  title: string
  /** 代码内容 - 必填 */
  code: string
  /** 编程语言类型 - 可选，用于语法高亮 */
  language?: string
  /** 是否显示行号 - 可选，默认不显示 */
  showLineNumbers?: boolean
}

/**
 * 定义组件属性及默认值
 */
const props = withDefaults(defineProps<DemoCodeProps>(), {
  language: 'vue',
  showLineNumbers: false,
})

/**
 * 计算属性 - 格式化后的代码
 * 去除多余的空行和缩进，保持代码整洁
 */
const formattedCode = computed(() => {
  if (!props.code) return ''

  // 去除首尾空行
  const lines = props.code.trim().split('\n')

  // 找到最小缩进量（忽略空行）
  const minIndent = lines
    .filter((line) => line.trim())
    .reduce((min, line) => {
      const indent = line.match(/^\s*/)?.[0].length || 0
      return Math.min(min, indent)
    }, Infinity)

  // 移除公共缩进
  const formattedLines = lines.map((line) => (line.trim() ? line.slice(minIndent) : line))

  return formattedLines.join('\n')
})
</script>

<style lang="scss" scoped>
// 代码容器样式
.code-wrapper {
  margin: 0;
  overflow-x: auto;
  border: 0;
  background: white;
  padding: 12px;
}

// 代码文本样式
.code-text {
  font-family:
    'SF Mono', 'Menlo', 'Roboto Mono', 'Droid Sans Mono', 'Source Code Pro', 'Consolas', monospace;
  font-size: 24rpx;
  color: #374151;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
  display: block;
}
</style>
