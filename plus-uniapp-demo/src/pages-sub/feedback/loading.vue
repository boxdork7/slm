<!-- Loading 加载 http://127.0.0.1:100/#/pages-sub/demo/wd/loading -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Loading 加载" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="默认的环形加载动画，适用于按钮加载状态和页面轻提示">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="默认加载" vertical>
          <view class="flex items-center justify-center p-4">
            <wd-loading />
          </view>
        </wd-cell>

        <wd-cell title="自定义颜色" vertical>
          <view class="flex items-center justify-center p-4 space-x-4">
            <wd-loading color="#fa2c19" />
            <wd-loading color="#07c160" />
            <wd-loading color="#1989fa" />
            <wd-loading color="#ff976a" />
          </view>
        </wd-cell>

        <wd-cell title="不同尺寸" vertical>
          <view class="flex items-center justify-center p-4 space-x-6">
            <view class="text-center">
              <wd-loading :size="20" />
              <view class="mt-2 text-xs text-gray-500">小号</view>
            </view>
            <view class="text-center">
              <wd-loading :size="30" />
              <view class="mt-2 text-xs text-gray-500">中号</view>
            </view>
            <view class="text-center">
              <wd-loading :size="40" />
              <view class="mt-2 text-xs text-gray-500">大号</view>
            </view>
          </view>
        </wd-cell>
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 默认加载" :code="codes.basic.defaultTemplate" />
        <DemoCode title="模板 - 自定义颜色" :code="codes.basic.colorTemplate" />
        <DemoCode title="模板 - 不同尺寸" :code="codes.basic.sizeTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 加载类型示例 -->
    <DemoSection title="加载类型" desc="支持不同样式的加载动画">
      <wd-cell-group>
        <wd-cell title="Ring 环形（默认）" vertical>
          <view class="flex items-center justify-center p-4 space-x-4">
            <wd-loading type="ring" />
            <wd-loading type="ring" color="#07c160" />
            <wd-loading type="ring" color="#ff976a" />
          </view>
        </wd-cell>

        <wd-cell title="Outline 轮廓" vertical>
          <view class="flex items-center justify-center p-4 space-x-4">
            <wd-loading type="outline" />
            <wd-loading type="outline" color="#fa2c19" />
            <wd-loading type="outline" color="#1989fa" />
          </view>
        </wd-cell>

        <wd-cell title="类型对比" vertical>
          <view class="p-4 space-y-4">
            <view class="flex items-center justify-between">
              <view class="text-sm text-gray-600">Ring 类型</view>
              <wd-loading type="ring" color="#4D80F0" />
            </view>
            <view class="flex items-center justify-between">
              <view class="text-sm text-gray-600">Outline 类型</view>
              <wd-loading type="outline" color="#4D80F0" />
            </view>
          </view>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - Ring 环形" :code="codes.types.ringTemplate" />
        <DemoCode title="模板 - Outline 轮廓" :code="codes.types.outlineTemplate" />
        <DemoCode title="脚本 - 加载类型" :code="codes.types.script" />
      </template>
    </DemoSection>

    <!-- 尺寸配置示例 -->
    <DemoSection title="尺寸配置" desc="支持数字或字符串单位设置大小">
      <wd-cell-group>
        <wd-cell title="数字尺寸" vertical>
          <view class="flex items-center justify-center p-4 space-x-8">
            <view class="text-center">
              <wd-loading :size="sizeConfig.small" />
              <view class="mt-2 text-xs text-gray-500">{{ sizeConfig.small }}px</view>
            </view>
            <view class="text-center">
              <wd-loading :size="sizeConfig.medium" />
              <view class="mt-2 text-xs text-gray-500">{{ sizeConfig.medium }}px</view>
            </view>
            <view class="text-center">
              <wd-loading :size="sizeConfig.large" />
              <view class="mt-2 text-xs text-gray-500">{{ sizeConfig.large }}px</view>
            </view>
          </view>
        </wd-cell>

        <wd-cell title="字符串单位" vertical>
          <view class="flex items-center justify-center p-4 space-x-8">
            <view class="text-center">
              <wd-loading size="1.5rem" color="#fa2c19" />
              <view class="mt-2 text-xs text-gray-500">1.5rem</view>
            </view>
            <view class="text-center">
              <wd-loading size="60px" color="#07c160" />
              <view class="mt-2 text-xs text-gray-500">60px</view>
            </view>
            <view class="text-center">
              <wd-loading size="3em" color="#1989fa" />
              <view class="mt-2 text-xs text-gray-500">3em</view>
            </view>
          </view>
        </wd-cell>

        <wd-cell title="动态调整尺寸" vertical>
          <view class="p-4 space-y-4">
            <view class="text-center">
              <wd-loading :size="dynamicSize" color="#ff976a" />
              <view class="mt-2 text-xs text-gray-500">当前: {{ dynamicSize }}px</view>
            </view>
            <view class="space-y-2">
              <view class="text-sm text-gray-600">调整尺寸:</view>
              <wd-slider v-model="dynamicSize" :min="20" :max="80" :step="5" show-value />
            </view>
          </view>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 数字尺寸" :code="codes.size.numberTemplate" />
        <DemoCode title="模板 - 字符串单位" :code="codes.size.stringTemplate" />
        <DemoCode title="模板 - 动态调整" :code="codes.size.dynamicTemplate" />
        <DemoCode title="脚本 - 尺寸配置" :code="codes.size.script" />
      </template>
    </DemoSection>

    <!-- 颜色主题示例 -->
    <DemoSection title="颜色主题" desc="丰富的颜色配置选项">
      <wd-cell-group>
        <wd-cell title="预设颜色" vertical>
          <view class="grid grid-cols-4 gap-4 p-4">
            <view v-for="(color, index) in presetColors" :key="index" class="text-center">
              <wd-loading :color="color.value" :size="32" />
              <view class="mt-2 text-xs text-gray-500">{{ color.name }}</view>
            </view>
          </view>
        </wd-cell>

        <wd-cell title="渐变色效果" vertical>
          <view class="flex items-center justify-center p-4 space-x-4">
            <wd-loading color="#ff6b6b" :size="35" />
            <wd-loading color="#4ecdc4" :size="35" />
            <wd-loading color="#45b7d1" :size="35" />
            <wd-loading color="#f9ca24" :size="35" />
            <wd-loading color="#6c5ce7" :size="35" />
          </view>
        </wd-cell>

        <wd-cell title="自定义颜色选择" vertical>
          <view class="p-4 space-y-4">
            <view class="text-center">
              <wd-loading :color="customColor" :size="40" />
              <view class="mt-2 text-xs text-gray-500">{{ customColor }}</view>
            </view>
            <view class="grid grid-cols-6 gap-2">
              <view
                v-for="color in colorPalette"
                :key="color"
                :style="{ backgroundColor: color }"
                class="h-8 w-8 cursor-pointer border-2 rounded"
                :class="customColor === color ? 'border-gray-400' : 'border-gray-200'"
                @click="selectColor(color)"
              />
            </view>
          </view>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 预设颜色" :code="codes.colors.presetTemplate" />
        <DemoCode title="模板 - 渐变色效果" :code="codes.colors.gradientTemplate" />
        <DemoCode title="模板 - 自定义颜色" :code="codes.colors.customTemplate" />
        <DemoCode title="脚本 - 颜色主题" :code="codes.colors.script" />
      </template>
    </DemoSection>

    <!-- 实际应用场景 -->
    <DemoSection title="实际应用场景" desc="常见的业务场景使用示例">
      <!-- 按钮加载状态 -->
      <view class="space-y-4">
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">按钮加载状态</view>
          <wd-cell-group>
            <wd-cell title="普通按钮" vertical>
              <view class="p-4 space-y-3">
                <wd-button
                  :loading="buttonLoading.primary"
                  block
                  @click="handleButtonClick('primary')"
                >
                  {{ buttonLoading.primary ? '加载中...' : '点击加载' }}
                </wd-button>
                <wd-button
                  type="success"
                  :loading="buttonLoading.success"
                  block
                  @click="handleButtonClick('success')"
                >
                  {{ buttonLoading.success ? '提交中...' : '提交表单' }}
                </wd-button>
              </view>
            </wd-cell>
          </wd-cell-group>
        </view>

        <!-- 页面加载状态 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">页面加载状态</view>
          <wd-cell-group>
            <wd-cell title="内容加载" vertical>
              <view class="p-4">
                <view v-if="pageLoading" class="py-8 text-center">
                  <wd-loading :size="30" />
                  <view class="mt-2 text-sm text-gray-500">正在加载内容...</view>
                </view>
                <view v-else class="space-y-2">
                  <view class="text-sm font-medium">加载完成的内容</view>
                  <view class="text-xs text-gray-500">这里是模拟的页面内容</view>
                  <wd-button size="small" @click="reloadPage">重新加载</wd-button>
                </view>
              </view>
            </wd-cell>
          </wd-cell-group>
        </view>

        <!-- 列表加载状态 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">列表加载更多</view>
          <wd-cell-group>
            <wd-cell title="商品列表" vertical>
              <view class="p-4">
                <view class="space-y-2">
                  <view
                    v-for="item in listItems"
                    :key="item.id"
                    class="flex items-center justify-between border rounded p-2"
                  >
                    <view class="text-sm">{{ item.name }}</view>
                    <view class="text-xs text-gray-500">￥{{ item.price }}</view>
                  </view>
                </view>
                <view class="mt-4 text-center">
                  <view v-if="listLoading" class="py-2">
                    <wd-loading :size="24" />
                    <view class="mt-1 text-xs text-gray-500">加载更多...</view>
                  </view>
                  <wd-button v-else size="small" @click="loadMoreItems">加载更多</wd-button>
                </view>
              </view>
            </wd-cell>
          </wd-cell-group>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 按钮加载" :code="codes.scenarios.buttonTemplate" />
        <DemoCode title="脚本 - 按钮加载" :code="codes.scenarios.buttonScript" />
        <DemoCode title="模板 - 页面加载" :code="codes.scenarios.pageTemplate" />
        <DemoCode title="脚本 - 页面加载" :code="codes.scenarios.pageScript" />
        <DemoCode title="模板 - 列表加载" :code="codes.scenarios.listTemplate" />
        <DemoCode title="脚本 - 列表加载" :code="codes.scenarios.listScript" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// ===== 组件状态管理 =====

// 尺寸配置
const sizeConfig = ref({
  small: 24,
  medium: 36,
  large: 48,
})

// 动态尺寸
const dynamicSize = ref<number>(40)

// 自定义颜色
const customColor = ref<string>('#4D80F0')

// 按钮加载状态
const buttonLoading = ref({
  primary: false,
  success: false,
})

// 页面加载状态
const pageLoading = ref<boolean>(false)

// 列表加载状态
const listLoading = ref<boolean>(false)

// 列表数据
const listItems = ref([
  { id: 1, name: '商品 1', price: 99 },
  { id: 2, name: '商品 2', price: 199 },
  { id: 3, name: '商品 3', price: 299 },
])

// 预设颜色配置
const presetColors = ref([
  { name: '蓝色', value: '#4D80F0' },
  { name: '红色', value: '#fa2c19' },
  { name: '绿色', value: '#07c160' },
  { name: '橙色', value: '#ff976a' },
  { name: '紫色', value: '#6c5ce7' },
  { name: '青色', value: '#4ecdc4' },
  { name: '黄色', value: '#f9ca24' },
  { name: '粉色', value: '#fd79a8' },
])

// 颜色调色板
const colorPalette = ref([
  '#4D80F0',
  '#fa2c19',
  '#07c160',
  '#ff976a',
  '#6c5ce7',
  '#4ecdc4',
  '#f9ca24',
  '#fd79a8',
  '#2d3436',
  '#636e72',
  '#ffeaa7',
  '#fab1a0',
])

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    defaultTemplate: `<wd-loading />`,

    colorTemplate: `<wd-loading color="#fa2c19" />
<wd-loading color="#07c160" />
<wd-loading color="#1989fa" />
<wd-loading color="#ff976a" />`,

    sizeTemplate: `<wd-loading :size="20" />
<wd-loading :size="30" />
<wd-loading :size="40" />`,

    script: `import { ref } from 'vue'

// 基本配置
const defaultColor = ref('#4D80F0')
const defaultSize = ref(45)`,
  },

  // 加载类型代码
  types: {
    ringTemplate: `<wd-loading type="ring" />
<wd-loading type="ring" color="#07c160" />
<wd-loading type="ring" color="#ff976a" />`,

    outlineTemplate: `<wd-loading type="outline" />
<wd-loading type="outline" color="#fa2c19" />
<wd-loading type="outline" color="#1989fa" />`,

    script: `// 加载类型定义
type LoadingType = 'outline' | 'ring'

const loadingType = ref<LoadingType>('ring')`,
  },

  // 尺寸配置代码
  size: {
    numberTemplate: `<wd-loading :size="24" />
<wd-loading :size="36" />
<wd-loading :size="48" />`,

    stringTemplate: `<wd-loading size="1.5rem" />
<wd-loading size="60px" />
<wd-loading size="3em" />`,

    dynamicTemplate: `<template>
  <wd-loading :size="dynamicSize" />
  <wd-slider
    v-model="dynamicSize"
    :min="20"
    :max="80"
    :step="5"
  />
</template>`,

    script: `const sizeConfig = ref({
  small: 24,
  medium: 36,
  large: 48,
})

const dynamicSize = ref(40)`,
  },

  // 颜色主题代码
  colors: {
    presetTemplate: `<wd-loading color="#4D80F0" />
<wd-loading color="#fa2c19" />
<wd-loading color="#07c160" />
<wd-loading color="#ff976a" />`,

    gradientTemplate: `<wd-loading color="#ff6b6b" />
<wd-loading color="#4ecdc4" />
<wd-loading color="#45b7d1" />
<wd-loading color="#f9ca24" />`,

    customTemplate: `<template>
  <wd-loading :color="customColor" />
  <view
    v-for="color in colorPalette"
    :style="{ backgroundColor: color }"
    @click="selectColor(color)"
  />
</template>`,

    script: `const customColor = ref('#4D80F0')

const presetColors = ref([
  { name: '蓝色', value: '#4D80F0' },
  { name: '红色', value: '#fa2c19' },
  { name: '绿色', value: '#07c160' },
  { name: '橙色', value: '#ff976a' },
])

const selectColor = (color: string) => {
  customColor.value = color
}`,
  },

  // 应用场景代码
  scenarios: {
    buttonTemplate: `<wd-button
  :loading="buttonLoading.primary"
  @click="handleButtonClick('primary')"
>
  {{ buttonLoading.primary ? '加载中...' : '点击加载' }}
</wd-button>`,

    buttonScript: `const buttonLoading = ref({
  primary: false,
  success: false,
})

const handleButtonClick = (type: string) => {
  buttonLoading.value[type] = true
  setTimeout(() => {
    buttonLoading.value[type] = false
  }, 2000)
}`,

    pageTemplate: `<view v-if="pageLoading" class="text-center">
  <wd-loading :size="30" />
  <view class="mt-2 text-sm text-gray-500">正在加载内容...</view>
</view>
<view v-else>
  <!-- 加载完成的内容 -->
</view>`,

    pageScript: `const pageLoading = ref(false)

const reloadPage = () => {
  pageLoading.value = true
  setTimeout(() => {
    pageLoading.value = false
  }, 2000)
}`,

    listTemplate: `<view v-if="listLoading" class="text-center">
  <wd-loading :size="24" />
  <view class="mt-1 text-xs text-gray-500">加载更多...</view>
</view>
<wd-button v-else @click="loadMoreItems">
  加载更多
</wd-button>`,

    listScript: `const listLoading = ref(false)
const listItems = ref([
  { id: 1, name: '商品 1', price: 99 },
  { id: 2, name: '商品 2', price: 199 },
])

const loadMoreItems = () => {
  listLoading.value = true
  setTimeout(() => {
    listLoading.value = false
    // 添加新数据
    const newItems = [
      { id: Date.now(), name: '新商品', price: 399 }
    ]
    listItems.value.push(...newItems)
  }, 1500)
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'type',
    type: 'String',
    default: '"ring"',
    desc: '加载指示器类型，可选值：ring / outline',
  },
  {
    name: 'color',
    type: 'String',
    default: '"#4D80F0"',
    desc: '设置加载指示器颜色，支持任何有效的 CSS 颜色值',
  },
  {
    name: 'size',
    type: 'String | Number',
    default: '45',
    desc: '设置加载指示器大小，可以是数字（单位px）或字符串（如 "2rem"）',
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
 * 选择颜色
 */
const selectColor = (color: string) => {
  customColor.value = color
  console.log('选择颜色：', color)
}

/**
 * 处理按钮点击事件
 */
const handleButtonClick = (type: 'primary' | 'success') => {
  buttonLoading.value[type] = true
  console.log(`${type} 按钮开始加载`)

  setTimeout(() => {
    buttonLoading.value[type] = false
    console.log(`${type} 按钮加载完成`)
  }, 2000)
}

/**
 * 重新加载页面
 */
const reloadPage = () => {
  pageLoading.value = true
  console.log('开始重新加载页面')

  setTimeout(() => {
    pageLoading.value = false
    console.log('页面加载完成')
  }, 2000)
}

/**
 * 加载更多列表项
 */
const loadMoreItems = () => {
  listLoading.value = true
  console.log('开始加载更多列表项')

  setTimeout(() => {
    const newItems = [
      {
        id: Date.now(),
        name: `商品 ${listItems.value.length + 1}`,
        price: Math.floor(Math.random() * 500) + 100,
      },
    ]
    listItems.value.push(...newItems)
    listLoading.value = false
    console.log('列表项加载完成', newItems)
  }, 1500)
}
const { resetScrollTop, updateScrollTop } = useScroll()
onShow(() => {
  resetScrollTop()
})
onPageScroll((e) => {
  updateScrollTop(e.scrollTop)
})
</script>
