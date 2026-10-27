<!-- Gap 间距 http://127.0.0.1:100/#/pages-sub/demo/wd/gap -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Gap 间距" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的间距使用方式，用于页面布局时代替margin或padding">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <view>
          <view class="mb-2 text-sm text-gray-600">默认间距</view>
          <view class="border border-gray-200 rounded">
            <view class="bg-blue-50 p-3 text-center text-sm">内容区域上方</view>
            <wd-gap />
            <view class="bg-blue-50 p-3 text-center text-sm">内容区域下方</view>
          </view>
        </view>

        <view>
          <view class="mb-2 text-sm text-gray-600">自定义背景颜色</view>
          <view class="border border-gray-200 rounded">
            <view class="bg-green-50 p-3 text-center text-sm">内容区域上方</view>
            <wd-gap bg-color="#4D80F0" />
            <view class="bg-green-50 p-3 text-center text-sm">内容区域下方</view>
          </view>
        </view>

        <view>
          <view class="mb-2 text-sm text-gray-600">自定义高度</view>
          <view class="border border-gray-200 rounded">
            <view class="bg-purple-50 p-3 text-center text-sm">内容区域上方</view>
            <wd-gap bg-color="#9C27B0" height="60rpx" />
            <view class="bg-purple-50 p-3 text-center text-sm">内容区域下方</view>
          </view>
        </view>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 默认间距" :code="codes.basic.defaultTemplate" />
        <DemoCode title="模板 - 自定义背景" :code="codes.basic.bgColorTemplate" />
        <DemoCode title="模板 - 自定义高度" :code="codes.basic.heightTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 高度配置示例 -->
    <DemoSection title="高度配置" desc="支持多种高度设置，适应不同的间距需求">
      <view class="space-y-4">
        <view class="text-center">
          <view class="mb-3 text-sm font-medium">不同高度对比</view>
          <view class="overflow-hidden border border-gray-200 rounded">
            <view class="bg-gray-50 p-2 text-xs text-gray-500">小间距（20rpx）</view>
            <wd-gap bg-color="#E5E7EB" height="20rpx" />

            <view class="bg-gray-50 p-2 text-xs text-gray-500">中间距（60rpx）</view>
            <wd-gap bg-color="#D1D5DB" height="60rpx" />

            <view class="bg-gray-50 p-2 text-xs text-gray-500">大间距（120rpx）</view>
            <wd-gap bg-color="#9CA3AF" height="120rpx" />

            <view class="bg-gray-50 p-2 text-xs text-gray-500">超大间距（200rpx）</view>
            <wd-gap bg-color="#6B7280" height="200rpx" />
          </view>
        </view>

        <!-- 高度选择器 -->
        <view>
          <view class="mb-3 text-sm font-medium">动态高度调整</view>
          <view class="mb-3">
            <wd-cell-group>
              <wd-cell title="当前高度" :value="`${currentHeight}rpx`" />
            </wd-cell-group>
          </view>

          <view class="mb-3 flex flex-wrap gap-2">
            <wd-button
              v-for="height in heightOptions"
              :key="height"
              size="small"
              :type="currentHeight === height ? 'primary' : 'default'"
              @click="setHeight(height)"
            >
              {{ height }}rpx
            </wd-button>
          </view>

          <view class="border border-gray-200 rounded">
            <view class="bg-yellow-50 p-3 text-center text-sm">动态演示区域</view>
            <wd-gap bg-color="#FFA726" :height="`${currentHeight}rpx`" />
            <view class="bg-yellow-50 p-3 text-center text-sm">高度会根据选择变化</view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 不同高度" :code="codes.height.template" />
        <DemoCode title="模板 - 动态高度" :code="codes.height.dynamicTemplate" />
        <DemoCode title="脚本 - 高度配置" :code="codes.height.script" />
      </template>
    </DemoSection>

    <!-- 背景配置示例 -->
    <DemoSection title="背景配置" desc="支持纯色背景、透明背景和自定义样式">
      <view class="space-y-4">
        <!-- 预设颜色 -->
        <view>
          <view class="mb-3 text-sm font-medium">预设颜色</view>
          <view class="grid grid-cols-2 gap-3">
            <view
              v-for="color in colorOptions"
              :key="color.name"
              class="overflow-hidden border border-gray-200 rounded"
            >
              <view class="bg-gray-50 p-2 text-center text-xs">{{ color.name }}</view>
              <wd-gap :bg-color="color.value" height="40rpx" />
            </view>
          </view>
        </view>

        <!-- 透明背景 -->
        <view>
          <view class="mb-3 text-sm font-medium">透明背景</view>
          <view class="rounded from-blue-400 to-purple-500 bg-gradient-to-r p-4">
            <view class="rounded-t bg-white/80 p-3 text-center text-sm">上方内容</view>
            <wd-gap height="40rpx" />
            <view class="rounded-b bg-white/80 p-3 text-center text-sm">下方内容</view>
          </view>
        </view>

        <!-- 自定义样式 -->
        <view>
          <view class="mb-3 text-sm font-medium">自定义样式</view>
          <view class="overflow-hidden border border-gray-200 rounded">
            <view class="bg-gray-50 p-3 text-center text-sm">渐变背景示例</view>
            <wd-gap custom-class="gradient-gap" height="80rpx" />
            <view class="bg-gray-50 p-3 text-center text-sm">通过custom-class自定义</view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 预设颜色" :code="codes.background.presetTemplate" />
        <DemoCode title="模板 - 透明背景" :code="codes.background.transparentTemplate" />
        <DemoCode title="模板 - 自定义样式" :code="codes.background.customTemplate" />
        <DemoCode title="脚本 - 背景配置" :code="codes.background.script" />
        <DemoCode title="样式 - 自定义间距" :code="codes.background.style" />
      </template>
    </DemoSection>

    <!-- 底部安全区示例 -->
    <DemoSection title="底部安全区" desc="适配iPhone X等机型的底部安全区域，避免内容被虚拟按键遮挡">
      <view class="space-y-4">
        <!-- 安全区对比 -->
        <view>
          <view class="mb-3 text-sm font-medium">安全区对比</view>
          <view class="grid grid-cols-1 gap-4">
            <!-- 不使用安全区 -->
            <view>
              <view class="mb-2 text-xs text-gray-500">不使用安全区</view>
              <view class="relative h-32 overflow-hidden border border-gray-200 rounded bg-gray-50">
                <view class="absolute bottom-0 left-0 right-0">
                  <view class="bg-blue-500 py-2 text-center text-sm text-white">底部按钮</view>
                  <wd-gap bg-color="#2196F3" height="40rpx" />
                </view>
              </view>
            </view>

            <!-- 使用安全区 -->
            <view>
              <view class="mb-2 text-xs text-gray-500">使用安全区（模拟效果）</view>
              <view class="relative h-32 overflow-hidden border border-gray-200 rounded bg-gray-50">
                <view class="absolute bottom-0 left-0 right-0">
                  <view class="bg-green-500 py-2 text-center text-sm text-white">底部按钮</view>
                  <wd-gap bg-color="#4CAF50" height="40rpx" safe-area-bottom />
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 实用示例 -->
        <view>
          <view class="mb-3 text-sm font-medium">实际应用场景</view>
          <view class="overflow-hidden border border-gray-200 rounded">
            <view class="bg-white p-4">
              <view class="mb-2 text-sm font-medium">页面主要内容</view>
              <view class="text-xs text-gray-500 leading-5">
                在实际应用中，Gap组件常用于页面底部，确保内容不会被iPhone X系列的虚拟Home指示器遮挡，提供更好的用户体验。
              </view>
            </view>
            <view class="bg-indigo-500 py-3 text-center text-sm text-white">
              固定底部栏
            </view>
            <wd-gap bg-color="#3F51B5" height="20rpx" safe-area-bottom />
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 不使用安全区" :code="codes.safeArea.normalTemplate" />
        <DemoCode title="模板 - 使用安全区" :code="codes.safeArea.safeTemplate" />
        <DemoCode title="模板 - 实际应用" :code="codes.safeArea.practicalTemplate" />
        <DemoCode title="脚本 - 安全区配置" :code="codes.safeArea.script" />
      </template>
    </DemoSection>

    <!-- 实际应用场景 -->
    <DemoSection title="实际应用场景" desc="常见的业务场景中Gap组件的使用方式">
      <!-- 列表分隔 -->
      <view class="space-y-4">
        <view>
          <view class="mb-3 text-sm font-medium">列表项分隔</view>
          <wd-cell-group>
            <wd-cell title="列表项 1" value="详情" is-link />
            <wd-gap bg-color="#F5F5F5" height="20rpx" />
            <wd-cell title="列表项 2" value="详情" is-link />
            <wd-gap bg-color="#F5F5F5" height="20rpx" />
            <wd-cell title="列表项 3" value="详情" is-link />
          </wd-cell-group>
        </view>

        <!-- 卡片间距 -->
        <view>
          <view class="mb-3 text-sm font-medium">卡片间距</view>
          <view class="space-y-0">
            <view class="mx-4 rounded-lg bg-white p-4 shadow-sm">
              <view class="mb-1 text-sm font-medium">卡片标题 1</view>
              <view class="text-xs text-gray-500">卡片内容描述</view>
            </view>

            <wd-gap height="30rpx" />

            <view class="mx-4 rounded-lg bg-white p-4 shadow-sm">
              <view class="mb-1 text-sm font-medium">卡片标题 2</view>
              <view class="text-xs text-gray-500">卡片内容描述</view>
            </view>

            <wd-gap height="30rpx" />

            <view class="mx-4 rounded-lg bg-white p-4 shadow-sm">
              <view class="mb-1 text-sm font-medium">卡片标题 3</view>
              <view class="text-xs text-gray-500">卡片内容描述</view>
            </view>
          </view>
        </view>

        <!-- 页面分段 -->
        <view>
          <view class="mb-3 text-sm font-medium">页面分段</view>
          <view>
            <wd-cell-group>
              <wd-cell title="基本信息" label="设置" />
            </wd-cell-group>

            <wd-gap bg-color="#F8F9FA" height="40rpx" />

            <wd-cell-group>
              <wd-cell title="账号设置" label="管理" />
            </wd-cell-group>

            <wd-gap bg-color="#F8F9FA" height="40rpx" />

            <wd-cell-group>
              <wd-cell title="隐私设置" label="安全" />
            </wd-cell-group>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 列表分隔" :code="codes.scenarios.listTemplate" />
        <DemoCode title="模板 - 卡片间距" :code="codes.scenarios.cardTemplate" />
        <DemoCode title="模板 - 页面分段" :code="codes.scenarios.sectionTemplate" />
        <DemoCode title="脚本 - 应用场景" :code="codes.scenarios.script" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// ===== 组件状态管理 =====

// 动态高度选择
const currentHeight = ref<number>(60)
const heightOptions = ref<number[]>([20, 40, 60, 80, 120, 200])

// 预设颜色选项
const colorOptions = ref([
  { name: '蓝色', value: '#2196F3' },
  { name: '绿色', value: '#4CAF50' },
  { name: '橙色', value: '#FF9800' },
  { name: '红色', value: '#F44336' },
  { name: '紫色', value: '#9C27B0' },
  { name: '灰色', value: '#9E9E9E' },
])

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    defaultTemplate: `<!-- 默认间距 -->
<wd-gap />`,

    bgColorTemplate: `<!-- 自定义背景颜色 -->
<wd-gap bg-color="#4D80F0" />`,

    heightTemplate: `<!-- 自定义高度 -->
<wd-gap bg-color="#9C27B0" height="60rpx" />`,

    script: `// Gap组件使用简单，主要用于页面布局时代替margin或padding
// 常用于内容分隔、底部占位等场景`,
  },

  // 高度配置代码
  height: {
    template: `<!-- 不同高度对比 -->
<wd-gap bg-color="#E5E7EB" height="20rpx" />
<wd-gap bg-color="#D1D5DB" height="60rpx" />
<wd-gap bg-color="#9CA3AF" height="120rpx" />
<wd-gap bg-color="#6B7280" height="200rpx" />`,

    dynamicTemplate: `<!-- 动态高度调整 -->
<wd-gap bg-color="#FFA726" :height="\`\${currentHeight}rpx\`" />`,

    script: `import { ref } from 'vue'

// 动态高度选择
const currentHeight = ref(60)
const heightOptions = ref([20, 40, 60, 80, 120, 200])

// 设置高度
const setHeight = (height: number) => {
  currentHeight.value = height
}`,
  },

  // 背景配置代码
  background: {
    presetTemplate: `<!-- 预设颜色 -->
<wd-gap bg-color="#2196F3" height="40rpx" />
<wd-gap bg-color="#4CAF50" height="40rpx" />
<wd-gap bg-color="#FF9800" height="40rpx" />
<wd-gap bg-color="#F44336" height="40rpx" />`,

    transparentTemplate: `<!-- 透明背景 -->
<wd-gap height="40rpx" />`,

    customTemplate: `<!-- 自定义样式 -->
<wd-gap custom-class="gradient-gap" height="80rpx" />`,

    script: `// 预设颜色选项
const colorOptions = ref([
  { name: '蓝色', value: '#2196F3' },
  { name: '绿色', value: '#4CAF50' },
  { name: '橙色', value: '#FF9800' },
  { name: '红色', value: '#F44336' },
])`,

    style: `<style lang="scss" scoped>
// 渐变背景样式
:deep(.gradient-gap) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}
</style>`,
  },

  // 底部安全区代码
  safeArea: {
    normalTemplate: `<!-- 不使用安全区 -->
<view class="bottom-fixed">
  <view class="bottom-button">底部按钮</view>
  <wd-gap bg-color="#2196F3" height="40rpx" />
</view>`,

    safeTemplate: `<!-- 使用安全区 -->
<view class="bottom-fixed">
  <view class="bottom-button">底部按钮</view>
  <wd-gap bg-color="#4CAF50" height="40rpx" safe-area-bottom />
</view>`,

    practicalTemplate: `<!-- 实际应用场景 -->
<view class="page-content">
  <!-- 页面主要内容 -->
</view>
<view class="fixed-bottom-bar">
  固定底部栏
</view>
<wd-gap bg-color="#3F51B5" height="20rpx" safe-area-bottom />`,

    script: `// 底部安全区适配
// safe-area-bottom 属性会自动添加底部安全区间距
// 适用于iPhone X及以上机型的虚拟Home指示器适配`,
  },

  // 应用场景代码
  scenarios: {
    listTemplate: `<!-- 列表项分隔 -->
<wd-cell-group>
  <wd-cell title="列表项 1" value="详情" is-link />
  <wd-gap bg-color="#F5F5F5" height="20rpx" />
  <wd-cell title="列表项 2" value="详情" is-link />
  <wd-gap bg-color="#F5F5F5" height="20rpx" />
  <wd-cell title="列表项 3" value="详情" is-link />
</wd-cell-group>`,

    cardTemplate: `<!-- 卡片间距 -->
<view class="card">卡片内容 1</view>
<wd-gap height="30rpx" />
<view class="card">卡片内容 2</view>
<wd-gap height="30rpx" />
<view class="card">卡片内容 3</view>`,

    sectionTemplate: `<!-- 页面分段 -->
<wd-cell-group>
  <wd-cell title="基本信息" label="设置" />
</wd-cell-group>

<wd-gap bg-color="#F8F9FA" height="40rpx" />

<wd-cell-group>
  <wd-cell title="账号设置" label="管理" />
</wd-cell-group>`,

    script: `// Gap组件的常见应用场景：
// 1. 列表项之间的分隔
// 2. 卡片之间的间距
// 3. 页面不同区块的分段
// 4. 底部占位，避免内容被遮挡`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'bg-color',
    type: 'String',
    default: '"transparent"',
    desc: '背景颜色，支持任何有效的CSS颜色值',
  },
  {
    name: 'height',
    type: 'String | Number',
    default: '15',
    desc: '间距高度，支持rpx、px等单位，数字时默认为rpx',
  },
  {
    name: 'safe-area-bottom',
    type: 'Boolean',
    default: 'false',
    desc: '是否开启底部安全区，适配iPhone X等机型',
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
]

// ===== 事件处理方法 =====

/**
 * 设置动态高度
 * @param height 高度值
 */
const setHeight = (height: number) => {
  currentHeight.value = height
  console.log(`设置高度为：${height}rpx`)
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
// 渐变背景样式
:deep(.gradient-gap) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}
</style>
