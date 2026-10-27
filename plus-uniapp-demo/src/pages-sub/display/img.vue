<!-- Image 图片 http://127.0.0.1:100/#/pages-sub/demo/wd/image -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Image 图片" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="支持单张图片展示，可设置填充模式和懒加载">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <view class="flex flex-wrap gap-4">
          <wd-img
            :width="200"
            :height="200"
            src="https://img.yzcdn.cn/vant/cat.jpeg"
            mode="aspectFit"
            enable-preview
            @click="handleImageClick('基本图片')"
            @load="handleImageLoad('基本图片')"
            @error="handleImageError('基本图片')"
          />
          <wd-img
            :width="200"
            :height="200"
            src="https://img.yzcdn.cn/vant/cat.jpeg"
            mode="aspectFill"
            round
            enable-preview
            @click="handleImageClick('圆形图片')"
          />
          <wd-img
            :width="200"
            :height="200"
            src="https://img.yzcdn.cn/vant/cat.jpeg"
            mode="scaleToFill"
            :radius="16"
            enable-preview
            @click="handleImageClick('圆角图片')"
          />
        </view>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基本用法" :code="codes.basic.template" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 多图片展示示例 -->
    <DemoSection title="多图片展示" desc="支持多张图片同时展示，可设置最大显示数量">
      <view class="space-y-4">
        <!-- 多图网格显示 -->
        <view>
          <view class="mb-2 text-sm text-gray-700 font-medium">多图网格显示</view>
          <wd-img
            :width="400"
            :height="400"
            :src="multiImageUrls"
            :max-display="9"
            enable-preview
            @click="handleMultiImageClick"
          />
        </view>

        <!-- 限制显示数量 -->
        <view>
          <view class="mb-2 text-sm text-gray-700 font-medium">限制显示数量（最多4张）</view>
          <wd-img
            :width="400"
            :height="400"
            :src="multiImageUrls"
            :max-display="4"
            enable-preview
            @click="handleMultiImageClick"
          />
        </view>

        <!-- 单图模式 -->
        <view>
          <view class="mb-2 text-sm text-gray-700 font-medium">单图模式（显示数量角标）</view>
          <wd-img
            :width="200"
            :height="200"
            :src="multiImageUrls"

             enable-preview single-mode
            @click="handleMultiImageClick"
          />
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 多图片展示" :code="codes.multi.template" />
        <DemoCode title="脚本 - 多图片展示" :code="codes.multi.script" />
      </template>
    </DemoSection>

    <!-- 填充模式示例 -->
    <DemoSection title="填充模式" desc="支持多种图片填充模式">
      <view class="space-y-4">
        <view class="grid grid-cols-3 gap-4">
          <view
            v-for="modeItem in imageModes"
            :key="modeItem.mode"
            class="flex flex-col items-center"
          >
            <wd-img
              :width="120"
              :height="120"
              src="https://img.yzcdn.cn/vant/cat.jpeg"
              :mode="modeItem.mode as ImageMode"
              @click="handleModeClick(modeItem.mode)"
            />
            <text class="mt-2 text-xs text-gray-600">{{ modeItem.label }}</text>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 填充模式" :code="codes.mode.template" />
        <DemoCode title="脚本 - 填充模式" :code="codes.mode.script" />
      </template>
    </DemoSection>

    <!-- 图片状态示例 -->
    <DemoSection title="图片状态" desc="支持加载状态和错误状态的自定义显示">
      <view class="space-y-4">
        <!-- 加载状态 -->
        <view>
          <view class="mb-2 text-sm text-gray-700 font-medium">加载状态</view>
          <view class="flex gap-4">
            <wd-img
              :width="200"
              :height="200"
              :src="loadingImage"
              @click="handleStateClick('加载中图片')"
            >
              <template #loading>
                <view class="h-full flex items-center justify-center bg-gray-100">
                  <text class="text-gray-500">加载中...</text>
                </view>
              </template>
            </wd-img>
            <wd-button size="small" @click="triggerLoading">重新加载</wd-button>
          </view>
        </view>

        <!-- 错误状态 -->
        <view>
          <view class="mb-2 text-sm text-gray-700 font-medium">错误状态</view>
          <wd-img
            :width="200"
            :height="200"
            src="https://invalid-url.com/error.jpg"
            @click="handleStateClick('错误图片')"
            @error="handleImageError('错误图片')"
          >
            <template #error>
              <view class="h-full flex flex-col items-center justify-center bg-gray-100">
                <text class="text-sm text-gray-500">加载失败</text>
                <text class="mt-1 text-xs text-gray-400">点击重试</text>
              </view>
            </template>
          </wd-img>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 图片状态" :code="codes.state.template" />
        <DemoCode title="脚本 - 图片状态" :code="codes.state.script" />
      </template>
    </DemoSection>

    <!-- 长按功能示例 -->
    <DemoSection title="长按功能" desc="支持长按图片显示操作菜单">
      <view class="space-y-4">
        <!-- 默认长按功能 -->
        <view>
          <view class="mb-2 text-sm text-gray-700 font-medium">默认长按功能</view>
          <wd-img
            :width="200"
            :height="200"
            src="https://img.yzcdn.cn/vant/cat.jpeg"
            enable-longpress
            @longpress="handleLongpress"
          />
        </view>

        <!-- 自定义长按功能 -->
        <view>
          <view class="mb-2 text-sm text-gray-700 font-medium">自定义长按功能</view>
          <wd-img
            :width="200"
            :height="200"
            src="https://img.yzcdn.cn/vant/cat.jpeg"
            enable-longpress
            :on-longpress="customLongpressHandler"
          />
        </view>

        <!-- 禁用长按菜单 -->
        <view>
          <view class="mb-2 text-sm text-gray-700 font-medium">禁用长按菜单</view>
          <wd-img
            :width="200"
            :height="200"
            src="https://img.yzcdn.cn/vant/cat.jpeg"
            show-menu-by-longpress
          />
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 长按功能" :code="codes.longpress.template" />
        <DemoCode title="脚本 - 长按功能" :code="codes.longpress.script" />
      </template>
    </DemoSection>

    <!-- 懒加载示例 -->
    <DemoSection title="懒加载" desc="启用懒加载优化性能">
      <view class="space-y-4">
        <view class="mb-2 text-sm text-gray-700 font-medium">滚动查看懒加载效果</view>
        <view class="space-y-4">
          <view v-for="(url, index) in lazyLoadImages" :key="index" class="flex items-center gap-4">
            <wd-img
              :width="120"
              :height="120"
              :src="url"
              lazy-load
              enable-preview
              @load="handleLazyLoad(index)"
            />
            <text class="text-sm text-gray-600">懒加载图片 {{ index + 1 }}</text>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 懒加载" :code="codes.lazy.template" />
        <DemoCode title="脚本 - 懒加载" :code="codes.lazy.script" />
      </template>
    </DemoSection>

    <!-- 交互演示示例 -->
    <DemoSection title="交互演示" desc="记录用户操作并提供实时反馈">
      <view class="space-y-4">
        <!-- 演示图片 -->
        <view class="flex flex-wrap gap-4">
          <wd-img
            :width="150"
            :height="150"
            src="https://img.yzcdn.cn/vant/cat.jpeg"
            enable-preview
            enable-longpress
            @click="handleDemoClick('演示图片1')"
            @longpress="handleDemoLongpress"
          />
          <wd-img
            :width="150"
            :height="150"
            :src="demoMultiImages"
            :max-display="4"
            enable-preview
            @click="handleDemoClick('演示多图')"
          />
        </view>

        <!-- 统计信息 -->
        <view class="rounded-lg bg-blue-50 p-3">
          <view class="text-sm text-blue-600">
            点击次数：{{ clickCount }} | 长按次数：{{ longpressCount }} | 最后操作：{{
              lastOperation || '无'
            }}
          </view>
        </view>

        <!-- 操作记录 -->
        <view>
          <view class="mb-2 flex items-center justify-between">
            <view class="text-sm text-gray-700 font-medium">操作记录</view>
            <wd-button size="small" @click="clearRecords">清空记录</wd-button>
          </view>
          <view class="h-32 overflow-y-auto border border-gray-200 rounded bg-white p-2">
            <view
              v-for="(record, index) in operationRecords"
              :key="index"
              class="mb-1 text-sm"
              :class="getRecordColor(record.type)"
            >
              [{{ record.time }}] {{ record.message }}
            </view>
            <view
              v-if="operationRecords.length === 0"
              class="py-4 text-center text-sm text-gray-400"
            >
              暂无操作记录，点击或长按图片开始测试
            </view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 交互演示" :code="codes.interactive.template" />
        <DemoCode title="脚本 - 交互逻辑" :code="codes.interactive.script" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import type { ImageMode } from '@/wd/components/wd-img/wd-img.vue'

// ===== 组件状态管理 =====

// 图片相关状态
const loadingImage = ref<string>('')
const multiImageUrls = ref<string>(
  'https://img.yzcdn.cn/vant/cat.jpeg,https://img.yzcdn.cn/vant/tree.jpg',
)

// 交互统计
const clickCount = ref<number>(0)
const longpressCount = ref<number>(0)
const lastOperation = ref<string>('')

// 演示用的多图片
const demoMultiImages = ref<string>(
  'https://img.yzcdn.cn/vant/cat.jpeg,https://img.yzcdn.cn/vant/tree.jpg,https://fastly.picsum.photos/id/100/300/300.jpg',
)

// 懒加载图片列表
const lazyLoadImages = ref<string[]>([
  'https://img.yzcdn.cn/vant/cat.jpeg',
  'https://img.yzcdn.cn/vant/cat.jpeg',
  'https://img.yzcdn.cn/vant/cat.jpeg',
  'https://img.yzcdn.cn/vant/cat.jpeg',
  'https://img.yzcdn.cn/vant/cat.jpeg',
])

// 操作记录
interface OperationRecord {
  time: string
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
}

const operationRecords = ref<OperationRecord[]>([])

// 图片模式选项
const imageModes = ref([
  { mode: 'scaleToFill', label: '拉伸填充' },
  { mode: 'aspectFit', label: '保持纵横比' },
  { mode: 'aspectFill', label: '裁切填充' },
  { mode: 'widthFix', label: '宽度固定' },
  { mode: 'heightFix', label: '高度固定' },
  { mode: 'center', label: '居中' },
])

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    template: `<!-- 基本图片展示 -->
<wd-img
  :width="200"
  :height="200"
  src="https://img.yzcdn.cn/vant/cat.jpeg"
  mode="aspectFit"
  enable-preview
  @click="handleImageClick('基本图片')"
  @load="handleImageLoad('基本图片')"
  @error="handleImageError('基本图片')"
/>

<!-- 圆形图片 -->
<wd-img
  :width="200"
  :height="200"
  src="https://img.yzcdn.cn/vant/cat.jpeg"
  mode="aspectFill"
  round
  enable-preview
  @click="handleImageClick('圆形图片')"
/>

<!-- 圆角图片 -->
<wd-img
  :width="200"
  :height="200"
  src="https://img.yzcdn.cn/vant/cat.jpeg"
  mode="scaleToFill"
  :radius="16"
  enable-preview
  @click="handleImageClick('圆角图片')"
/>`,

    script: `const handleImageClick = (imageName: string) => {
  console.log('点击了图片：', imageName)
}

const handleImageLoad = (imageName: string) => {
  console.log('图片加载成功：', imageName)
}

const handleImageError = (imageName: string) => {
  console.log('图片加载失败：', imageName)
}`,
  },

  // 多图片展示代码
  multi: {
    template: `<!-- 多图网格显示 -->
<wd-img
  :width="400"
  :height="400"
  :src="multiImageUrls"
  :max-display="9"
  enable-preview
  @click="handleMultiImageClick"
/>

<!-- 限制显示数量 -->
<wd-img
  :width="400"
  :height="400"
  :src="multiImageUrls"
  :max-display="4"
  enable-preview
  @click="handleMultiImageClick"
/>

<!-- 单图模式 -->
<wd-img
  :width="200"
  :height="200"
  :src="multiImageUrls"
  single-mode
  enable-preview
  @click="handleMultiImageClick"
/>`,

    script: `const multiImageUrls = ref('url1,url2,url3,url4,url5,url6')

const handleMultiImageClick = (event: any, index?: number) => {
  if (typeof index === 'number') {
    console.log('点击了第', index + 1, '张图片')
  } else {
    console.log('点击了多图容器')
  }
}`,
  },

  // 填充模式代码
  mode: {
    template: `<!-- 不同填充模式的图片 -->
<view
  v-for="modeItem in imageModes"
  :key="modeItem.mode"
  class="flex flex-col items-center"
>
  <wd-img
    :width="120"
    :height="120"
    src="https://img.yzcdn.cn/vant/cat.jpeg"
    :mode="modeItem.mode"
    @click="handleModeClick(modeItem.mode)"
  />
  <text class="mt-2 text-xs text-gray-600">{{ modeItem.label }}</text>
</view>`,

    script: `const imageModes = ref([
  { mode: 'scaleToFill', label: '拉伸填充' },
  { mode: 'aspectFit', label: '保持纵横比' },
  { mode: 'aspectFill', label: '裁切填充' },
  { mode: 'widthFix', label: '宽度固定' },
  { mode: 'heightFix', label: '高度固定' },
  { mode: 'center', label: '居中' }
])

const handleModeClick = (mode: string) => {
  console.log('选择了填充模式：', mode)
}`,
  },

  // 图片状态代码
  state: {
    template: `<!-- 加载状态 -->
<wd-img
  :width="200"
  :height="200"
  :src="loadingImage"
  @click="handleStateClick('加载中图片')"
>
  <template #loading>
    <view class="flex items-center justify-center h-full bg-gray-100">
      <text class="text-gray-500">加载中...</text>
    </view>
  </template>
</wd-img>

<!-- 错误状态 -->
<wd-img
  :width="200"
  :height="200"
  src="https://invalid-url.com/error.jpg"
  @click="handleStateClick('错误图片')"
  @error="handleImageError('错误图片')"
>
  <template #error>
    <view class="flex flex-col items-center justify-center h-full bg-gray-100">
      <text class="text-gray-500 text-sm">加载失败</text>
      <text class="text-gray-400 text-xs mt-1">点击重试</text>
    </view>
  </template>
</wd-img>`,

    script: `const loadingImage = ref('')

const triggerLoading = () => {
  loadingImage.value = ''
  setTimeout(() => {
    loadingImage.value = 'https://img.yzcdn.cn/vant/cat.jpeg'
  }, 100)
}

const handleStateClick = (imageName: string) => {
  console.log('点击了状态图片：', imageName)
}`,
  },

  // 长按功能代码
  longpress: {
    template: `<!-- 默认长按功能 -->
<wd-img
  :width="200"
  :height="200"
  src="https://img.yzcdn.cn/vant/cat.jpeg"
  enable-longpress
  @longpress="handleLongpress"
/>

<!-- 自定义长按功能 -->
<wd-img
  :width="200"
  :height="200"
  src="https://img.yzcdn.cn/vant/cat.jpeg"
  enable-longpress
  :on-longpress="customLongpressHandler"
/>

<!-- 禁用长按菜单 -->
<wd-img
  :width="200"
  :height="200"
  src="https://img.yzcdn.cn/vant/cat.jpeg"
  show-menu-by-longpress
/>`,

    script: `const handleLongpress = (event: Event, imageList: string[], currentIndex: number) => {
  console.log('长按图片事件：', { event, imageList, currentIndex })
}

const customLongpressHandler = (event: Event, imageList: string[], currentIndex: number) => {
  uni.showActionSheet({
    itemList: ['自定义操作1', '自定义操作2', '取消'],
    success: (res) => {
      if (res.tapIndex < 2) {
        uni.showToast({
          title: \`执行了自定义操作\${res.tapIndex + 1}\`,
          icon: 'success'
        })
      }
    }
  })
}`,
  },

  // 懒加载代码
  lazy: {
    template: `<!-- 懒加载图片列表 -->
<view
  v-for="(url, index) in lazyLoadImages"
  :key="index"
  class="flex items-center gap-4"
>
  <wd-img
    :width="120"
    :height="120"
    :src="url"
    lazy-load
    enable-preview
    @load="handleLazyLoad(index)"
  />
  <text class="text-sm text-gray-600">懒加载图片 {{ index + 1 }}</text>
</view>`,

    script: `const lazyLoadImages = ref([
  'https://img.yzcdn.cn/vant/cat.jpeg',
  'https://img.yzcdn.cn/vant/cat.jpeg',
  'https://img.yzcdn.cn/vant/cat.jpeg',
  'https://img.yzcdn.cn/vant/cat.jpeg',
  'https://img.yzcdn.cn/vant/cat.jpeg'
])

const handleLazyLoad = (index: number) => {
  console.log(\`懒加载图片 \${index + 1} 加载完成\`)
}`,
  },

  // 交互演示代码
  interactive: {
    template: `<!-- 交互演示 -->
<view class="flex flex-wrap gap-4">
  <wd-img
    :width="150"
    :height="150"
    src="https://img.yzcdn.cn/vant/cat.jpeg"
    enable-preview
    enable-longpress
    @click="handleDemoClick('演示图片1')"
    @longpress="handleDemoLongpress"
  />
  <wd-img
    :width="150"
    :height="150"
    :src="demoMultiImages"
    :max-display="4"
    enable-preview
    @click="handleDemoClick('演示多图')"
  />
</view>

<!-- 统计信息 -->
<view class="rounded-lg bg-blue-50 p-3">
  <view class="text-sm text-blue-600">
    点击次数：{{ clickCount }} | 长按次数：{{ longpressCount }} | 最后操作：{{ lastOperation || '无' }}
  </view>
</view>`,

    script: `const clickCount = ref(0)
const longpressCount = ref(0)
const lastOperation = ref('')

const handleDemoClick = (imageName: string) => {
  clickCount.value++
  lastOperation.value = imageName
  addRecord(\`点击了\${imageName}\`, 'success')
}

const handleDemoLongpress = () => {
  longpressCount.value++
  lastOperation.value = '长按操作'
  addRecord('执行了长按操作', 'info')
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'src',
    type: 'String',
    default: '""',
    desc: '图片链接，支持单张图片字符串或多张图片逗号分隔的字符串',
  },
  {
    name: 'preview-src',
    type: 'String',
    default: '""',
    desc: '预览图片链接，如果不设置则使用 src',
  },
  {
    name: 'width',
    type: 'String | Number',
    default: '200',
    desc: '宽度，默认单位为px',
  },
  {
    name: 'height',
    type: 'String | Number',
    default: '200',
    desc: '高度，默认单位为px',
  },
  {
    name: 'round',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示为圆形',
  },
  {
    name: 'radius',
    type: 'String | Number',
    default: '""',
    desc: '圆角大小，默认单位为px',
  },
  {
    name: 'mode',
    type: 'String',
    default: '"scaleToFill"',
    desc: '图片填充模式，可选值：scaleToFill / aspectFit / aspectFill / widthFix / heightFix / top / bottom / center / left / right / top left / top right / bottom left / bottom right',
  },
  {
    name: 'lazy-load',
    type: 'Boolean',
    default: 'false',
    desc: '是否懒加载',
  },
  {
    name: 'enable-preview',
    type: 'Boolean',
    default: 'false',
    desc: '是否允许预览',
  },
  {
    name: 'show-menu-by-longpress',
    type: 'Boolean',
    default: 'false',
    desc: '开启长按图片显示识别小程序码菜单，仅在微信小程序平台有效',
  },
  {
    name: 'max-display',
    type: 'Number',
    default: '9',
    desc: '多图片时最大显示数量，超出部分显示 +N',
  },
  {
    name: 'single-mode',
    type: 'Boolean',
    default: 'false',
    desc: '多张图片时是否启用单图模式（只显示第一张）',
  },
  {
    name: 'enable-longpress',
    type: 'Boolean',
    default: 'false',
    desc: '是否启用长按图片选项功能',
  },
  {
    name: 'on-longpress',
    type: 'Function',
    default: '""',
    desc: '自定义长按处理函数，如果不提供则使用默认实现',
  },
  {
    name: 'custom-style',
    type: 'String',
    default: '""',
    desc: '自定义根节点样式',
  },
  {
    name: 'custom-class',
    type: 'String',
    default: '""',
    desc: '自定义根节点样式类',
  },
  {
    name: 'custom-image',
    type: 'String',
    default: '""',
    desc: '自定义图片样式类',
  },
]

// Events 事件文档
const apiEvents = [
  {
    name: 'click',
    desc: '点击图片时触发，参数为 (event, index?)，其中 index 为多图片模式下的图片索引',
  },
  {
    name: 'load',
    desc: '图片加载成功时触发，参数为 (event, index?)，其中 index 为多图片模式下的图片索引',
  },
  {
    name: 'error',
    desc: '图片加载失败时触发，参数为 (event, index?)，其中 index 为多图片模式下的图片索引',
  },
  {
    name: 'longpress',
    desc: '长按图片时触发，参数为 (event, imageList, currentIndex)，可用于显示图片选项菜单',
  },
]

// Methods 方法文档（Image 组件没有暴露方法）
const apiMethods: any[] = []

// ===== 工具方法 =====

/**
 * 添加操作记录
 */
const addRecord = (message: string, type: OperationRecord['type'] = 'info') => {
  operationRecords.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
    type,
  })
  // 限制记录数量
  if (operationRecords.value.length > 20) {
    operationRecords.value = operationRecords.value.slice(0, 20)
  }
}

/**
 * 清空操作记录
 */
const clearRecords = () => {
  operationRecords.value = []
  addRecord('清空了操作记录', 'warning')
}

/**
 * 获取记录颜色类名
 */
const getRecordColor = (type: OperationRecord['type']) => {
  const colors = {
    success: 'text-green-600',
    info: 'text-blue-600',
    warning: 'text-orange-600',
    error: 'text-red-600',
  }
  return colors[type]
}

// ===== 事件处理方法 =====

/**
 * 基本图片点击事件
 */
const handleImageClick = (imageName: string) => {
  addRecord(`点击了${imageName}`, 'success')
  console.log('点击了图片：', imageName)
}

/**
 * 图片加载成功事件
 */
const handleImageLoad = (imageName: string) => {
  addRecord(`${imageName}加载成功`, 'success')
  console.log('图片加载成功：', imageName)
}

/**
 * 图片加载失败事件
 */
const handleImageError = (imageName: string) => {
  addRecord(`${imageName}加载失败`, 'error')
  console.log('图片加载失败：', imageName)
}

/**
 * 多图片点击事件
 */
const handleMultiImageClick = (event: any, index?: number) => {
  if (typeof index === 'number') {
    addRecord(`点击了第${index + 1}张图片`, 'success')
    console.log('点击了第', index + 1, '张图片')
  } else {
    addRecord('点击了多图容器', 'success')
    console.log('点击了多图容器')
  }
}

/**
 * 填充模式点击事件
 */
const handleModeClick = (mode: string) => {
  addRecord(`选择了填充模式：${mode}`, 'info')
  console.log('选择了填充模式：', mode)
}

/**
 * 状态图片点击事件
 */
const handleStateClick = (imageName: string) => {
  addRecord(`点击了${imageName}`, 'success')
  console.log('点击了状态图片：', imageName)
}

/**
 * 触发加载演示
 */
const triggerLoading = () => {
  loadingImage.value = ''
  addRecord('重新开始加载图片', 'info')
  setTimeout(() => {
    loadingImage.value = `https://img.yzcdn.cn/vant/cat.jpeg?t=${Date.now()}`
  }, 100)
}

/**
 * 长按事件处理
 */
const handleLongpress = (event: Event, imageList: string[], currentIndex: number) => {
  addRecord(`长按了第${currentIndex + 1}张图片`, 'info')
  console.log('长按图片事件：', { event, imageList, currentIndex })
}

/**
 * 自定义长按处理函数
 */
const customLongpressHandler = (event: Event, imageList: string[], currentIndex: number) => {
  addRecord('执行了自定义长按操作', 'warning')
  uni.showActionSheet({
    itemList: ['自定义操作1', '自定义操作2', '取消'],
    success: (res) => {
      if (res.tapIndex < 2) {
        uni.showToast({
          title: `执行了自定义操作${res.tapIndex + 1}`,
          icon: 'success',
        })
        addRecord(`执行了自定义操作${res.tapIndex + 1}`, 'success')
      }
    },
  })
}

/**
 * 懒加载完成事件
 */
const handleLazyLoad = (index: number) => {
  addRecord(`懒加载图片 ${index + 1} 加载完成`, 'success')
  console.log(`懒加载图片 ${index + 1} 加载完成`)
}

/**
 * 交互演示点击事件
 */
const handleDemoClick = (imageName: string) => {
  clickCount.value++
  lastOperation.value = imageName
  addRecord(`点击了${imageName}`, 'success')
  console.log('交互演示 - 点击了：', imageName)
}

/**
 * 交互演示长按事件
 */
const handleDemoLongpress = () => {
  longpressCount.value++
  lastOperation.value = '长按操作'
  addRecord('执行了长按操作', 'info')
  console.log('交互演示 - 执行了长按操作')
}

const { resetScrollTop, updateScrollTop } = useScroll()
onShow(() => {
  resetScrollTop()
})
onPageScroll((e) => {
  updateScrollTop(e.scrollTop)
})
</script>

<style lang="scss" scoped>
// 可以添加一些自定义样式
.grid {
  display: grid;
}

.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
</style>
