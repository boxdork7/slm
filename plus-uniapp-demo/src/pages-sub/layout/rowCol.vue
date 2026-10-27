<!-- Row Col Layout 布局 http://127.0.0.1:100/#/pages-sub/demo/wd/rowCol -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Row-Col 行列布局" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="通过 row 和 col 组件，快速创建 24 栅格布局">
      <!-- 示例效果展示 -->
      <view class="space-y-3">
        <!-- 单列布局 -->
        <view>
          <view class="mb-2 text-xs text-gray-500">单列布局</view>
          <wd-row>
            <wd-col :span="24">
              <view class="demo-col demo-col-primary">span: 24</view>
            </wd-col>
          </wd-row>
        </view>

        <!-- 二等分布局 -->
        <view>
          <view class="mb-2 text-xs text-gray-500">二等分布局</view>
          <wd-row>
            <wd-col :span="12">
              <view class="demo-col demo-col-dark">span: 12</view>
            </wd-col>
            <wd-col :span="12">
              <view class="demo-col demo-col-light">span: 12</view>
            </wd-col>
          </wd-row>
        </view>

        <!-- 三等分布局 -->
        <view>
          <view class="mb-2 text-xs text-gray-500">三等分布局</view>
          <wd-row>
            <wd-col :span="8">
              <view class="demo-col demo-col-dark">span: 8</view>
            </wd-col>
            <wd-col :span="8">
              <view class="demo-col demo-col-light">span: 8</view>
            </wd-col>
            <wd-col :span="8">
              <view class="demo-col demo-col-dark">span: 8</view>
            </wd-col>
          </wd-row>
        </view>

        <!-- 四等分布局 -->
        <view>
          <view class="mb-2 text-xs text-gray-500">四等分布局</view>
          <wd-row>
            <wd-col :span="6">
              <view class="demo-col demo-col-dark">span: 6</view>
            </wd-col>
            <wd-col :span="6">
              <view class="demo-col demo-col-light">span: 6</view>
            </wd-col>
            <wd-col :span="6">
              <view class="demo-col demo-col-dark">span: 6</view>
            </wd-col>
            <wd-col :span="6">
              <view class="demo-col demo-col-light">span: 6</view>
            </wd-col>
          </wd-row>
        </view>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 单列布局" :code="codes.basic.singleTemplate" />
        <DemoCode title="模板 - 二等分布局" :code="codes.basic.halfTemplate" />
        <DemoCode title="模板 - 三等分布局" :code="codes.basic.thirdTemplate" />
        <DemoCode title="模板 - 四等分布局" :code="codes.basic.quarterTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 分栏偏移示例 -->
    <DemoSection title="分栏偏移" desc="通过 offset 属性可以指定分栏左侧的间隔个数">
      <view class="space-y-3">
        <!-- 偏移示例1 -->
        <view>
          <view class="mb-2 text-xs text-gray-500">左侧偏移4个栅格</view>
          <wd-row>
            <wd-col :span="4">
              <view class="demo-col demo-col-dark">span: 4</view>
            </wd-col>
            <wd-col :span="8" :offset="4">
              <view class="demo-col demo-col-light">span: 8, offset: 4</view>
            </wd-col>
          </wd-row>
        </view>

        <!-- 偏移示例2 -->
        <view>
          <view class="mb-2 text-xs text-gray-500">两列都偏移4个栅格</view>
          <wd-row>
            <wd-col :span="8" :offset="4">
              <view class="demo-col demo-col-dark">span: 8, offset: 4</view>
            </wd-col>
            <wd-col :span="8" :offset="4">
              <view class="demo-col demo-col-light">span: 8, offset: 4</view>
            </wd-col>
          </wd-row>
        </view>

        <!-- 居中布局 -->
        <view>
          <view class="mb-2 text-xs text-gray-500">居中布局</view>
          <wd-row>
            <wd-col :span="16" :offset="4">
              <view class="demo-col demo-col-primary">span: 16, offset: 4 (居中)</view>
            </wd-col>
          </wd-row>
        </view>

        <!-- 不等宽偏移 -->
        <view>
          <view class="mb-2 text-xs text-gray-500">不等宽偏移</view>
          <wd-row>
            <wd-col :span="6" :offset="2">
              <view class="demo-col demo-col-dark">span: 6, offset: 2</view>
            </wd-col>
            <wd-col :span="10" :offset="2">
              <view class="demo-col demo-col-light">span: 10, offset: 2</view>
            </wd-col>
            <wd-col :span="4">
              <view class="demo-col demo-col-dark">span: 4</view>
            </wd-col>
          </wd-row>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 左侧偏移" :code="codes.offset.leftTemplate" />
        <DemoCode title="模板 - 两列偏移" :code="codes.offset.bothTemplate" />
        <DemoCode title="模板 - 居中布局" :code="codes.offset.centerTemplate" />
        <DemoCode title="模板 - 不等宽偏移" :code="codes.offset.unequalTemplate" />
        <DemoCode title="脚本 - 分栏偏移" :code="codes.offset.script" />
      </template>
    </DemoSection>

    <!-- 分栏间隔示例 -->
    <DemoSection title="分栏间隔" desc="通过 gutter 属性可以指定列之间的间距">
      <view class="space-y-4">
        <!-- 无间隔 -->
        <view>
          <view class="mb-2 text-xs text-gray-500">无间隔 (gutter: 0)</view>
          <wd-row :gutter="0">
            <wd-col :span="8">
              <view class="demo-col demo-col-dark">span: 8</view>
            </wd-col>
            <wd-col :span="8">
              <view class="demo-col demo-col-light">span: 8</view>
            </wd-col>
            <wd-col :span="8">
              <view class="demo-col demo-col-dark">span: 8</view>
            </wd-col>
          </wd-row>
        </view>

        <!-- 小间隔 -->
        <view>
          <view class="mb-2 text-xs text-gray-500">小间隔 (gutter: 10)</view>
          <wd-row :gutter="10">
            <wd-col :span="8">
              <view class="demo-col demo-col-dark">span: 8</view>
            </wd-col>
            <wd-col :span="8">
              <view class="demo-col demo-col-light">span: 8</view>
            </wd-col>
            <wd-col :span="8">
              <view class="demo-col demo-col-dark">span: 8</view>
            </wd-col>
          </wd-row>
        </view>

        <!-- 中等间隔 -->
        <view>
          <view class="mb-2 text-xs text-gray-500">中等间隔 (gutter: 20)</view>
          <wd-row :gutter="20">
            <wd-col :span="8">
              <view class="demo-col demo-col-dark">span: 8</view>
            </wd-col>
            <wd-col :span="8">
              <view class="demo-col demo-col-light">span: 8</view>
            </wd-col>
            <wd-col :span="8">
              <view class="demo-col demo-col-dark">span: 8</view>
            </wd-col>
          </wd-row>
        </view>

        <!-- 大间隔 -->
        <view>
          <view class="mb-2 text-xs text-gray-500">大间隔 (gutter: 40)</view>
          <wd-row :gutter="40">
            <wd-col :span="12">
              <view class="demo-col demo-col-dark">span: 12</view>
            </wd-col>
            <wd-col :span="12">
              <view class="demo-col demo-col-light">span: 12</view>
            </wd-col>
          </wd-row>
        </view>

        <!-- 动态间隔控制 -->
        <view>
          <view class="mb-2 text-xs text-gray-500">动态间隔控制 (当前: {{ currentGutter }}px)</view>
          <view class="mb-3">
            <wd-button
              v-for="gutter in gutterOptions"
              :key="gutter"
              size="small"
              :type="currentGutter === gutter ? 'primary' : 'default'"
              @click="currentGutter = gutter"
            >
              {{ gutter }}px
            </wd-button>
          </view>
          <wd-row :gutter="currentGutter">
            <wd-col :span="6">
              <view class="demo-col demo-col-dark">span: 6</view>
            </wd-col>
            <wd-col :span="6">
              <view class="demo-col demo-col-light">span: 6</view>
            </wd-col>
            <wd-col :span="6">
              <view class="demo-col demo-col-dark">span: 6</view>
            </wd-col>
            <wd-col :span="6">
              <view class="demo-col demo-col-light">span: 6</view>
            </wd-col>
          </wd-row>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 无间隔" :code="codes.gutter.noneTemplate" />
        <DemoCode title="模板 - 固定间隔" :code="codes.gutter.fixedTemplate" />
        <DemoCode title="模板 - 动态间隔" :code="codes.gutter.dynamicTemplate" />
        <DemoCode title="脚本 - 分栏间隔" :code="codes.gutter.script" />
      </template>
    </DemoSection>

    <!-- 复杂布局示例 -->
    <DemoSection title="复杂布局" desc="结合偏移和间隔，实现复杂的栅格布局">
      <view class="space-y-4">
        <!-- 卡片布局 -->
        <view>
          <view class="mb-2 text-xs text-gray-500">卡片式布局</view>
          <wd-row :gutter="16">
            <wd-col :span="8">
              <view class="border border-gray-200 rounded-lg bg-white p-4 text-center">
                <view class="text-sm font-medium">标题 1</view>
                <view class="mt-1 text-xs text-gray-500">这是一个卡片的内容描述</view>
              </view>
            </wd-col>
            <wd-col :span="8">
              <view class="border border-gray-200 rounded-lg bg-white p-4 text-center">
                <view class="text-sm font-medium">标题 2</view>
                <view class="mt-1 text-xs text-gray-500">这是一个卡片的内容描述</view>
              </view>
            </wd-col>
            <wd-col :span="8">
              <view class="border border-gray-200 rounded-lg bg-white p-4 text-center">
                <view class="text-sm font-medium">标题 3</view>
                <view class="mt-1 text-xs text-gray-500">这是一个卡片的内容描述</view>
              </view>
            </wd-col>
          </wd-row>
        </view>

        <!-- 表单布局 -->
        <view>
          <view class="mb-2 text-xs text-gray-500">表单式布局</view>
          <wd-row :gutter="12">
            <wd-col :span="6">
              <view class="pr-2 text-right text-sm text-gray-600 leading-8">姓名:</view>
            </wd-col>
            <wd-col :span="18">
              <view class="rounded bg-gray-50 px-3 text-sm text-gray-900 leading-8">张三</view>
            </wd-col>
          </wd-row>
          <wd-row :gutter="12">
            <wd-col :span="6">
              <view class="pr-2 text-right text-sm text-gray-600 leading-8">电话:</view>
            </wd-col>
            <wd-col :span="18">
              <view class="rounded bg-gray-50 px-3 text-sm text-gray-900 leading-8">138-0013-8000</view>
            </wd-col>
          </wd-row>
          <wd-row :gutter="12">
            <wd-col :span="6">
              <view class="pr-2 text-right text-sm text-gray-600 leading-8">地址:</view>
            </wd-col>
            <wd-col :span="18">
              <view class="rounded bg-gray-50 px-3 text-sm text-gray-900 leading-8">北京市朝阳区某某街道</view>
            </wd-col>
          </wd-row>
        </view>

        <!-- 商品列表布局 -->
        <view>
          <view class="mb-2 text-xs text-gray-500">商品列表布局</view>
          <wd-row :gutter="8">
            <wd-col :span="6">
              <view class="border border-gray-200 rounded-lg bg-white p-3 text-center">
                <view class="mb-2 text-2xl">📱</view>
                <view class="mb-1 text-sm text-gray-900 font-medium">手机</view>
                <view class="text-sm text-red-500 font-bold">¥999</view>
              </view>
            </wd-col>
            <wd-col :span="6">
              <view class="border border-gray-200 rounded-lg bg-white p-3 text-center">
                <view class="mb-2 text-2xl">💻</view>
                <view class="mb-1 text-sm text-gray-900 font-medium">电脑</view>
                <view class="text-sm text-red-500 font-bold">¥2999</view>
              </view>
            </wd-col>
            <wd-col :span="6">
              <view class="border border-gray-200 rounded-lg bg-white p-3 text-center">
                <view class="mb-2 text-2xl">⌚</view>
                <view class="mb-1 text-sm text-gray-900 font-medium">手表</view>
                <view class="text-sm text-red-500 font-bold">¥599</view>
              </view>
            </wd-col>
            <wd-col :span="6">
              <view class="border border-gray-200 rounded-lg bg-white p-3 text-center">
                <view class="mb-2 text-2xl">🎧</view>
                <view class="mb-1 text-sm text-gray-900 font-medium">耳机</view>
                <view class="text-sm text-red-500 font-bold">¥299</view>
              </view>
            </wd-col>
          </wd-row>
        </view>

        <!-- 仪表盘布局 -->
        <view>
          <view class="mb-2 text-xs text-gray-500">仪表盘布局</view>
          <wd-row :gutter="16">
            <wd-col :span="12">
              <view class="h-24 flex flex-col justify-center border border-gray-200 rounded-lg bg-white p-6 text-center">
                <view class="text-2xl text-blue-600 font-bold">1,234</view>
                <view class="text-xs text-gray-500">今日访问量</view>
              </view>
            </wd-col>
            <wd-col :span="12">
              <wd-row :gutter="8">
                <wd-col :span="24">
                  <view class="mb-2 border border-gray-200 rounded-lg bg-white p-3 text-center">
                    <view class="text-green-600 font-medium">86%</view>
                    <view class="text-xs text-gray-500">转化率</view>
                  </view>
                </wd-col>
              </wd-row>
              <wd-row :gutter="8">
                <wd-col :span="24">
                  <view class="mb-2 border border-gray-200 rounded-lg bg-white p-3 text-center">
                    <view class="text-orange-600 font-medium">¥12,345</view>
                    <view class="text-xs text-gray-500">今日收入</view>
                  </view>
                </wd-col>
              </wd-row>
            </wd-col>
          </wd-row>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 卡片布局" :code="codes.complex.cardTemplate" />
        <DemoCode title="模板 - 表单布局" :code="codes.complex.formTemplate" />
        <DemoCode title="模板 - 商品列表" :code="codes.complex.productTemplate" />
        <DemoCode title="模板 - 仪表盘布局" :code="codes.complex.dashboardTemplate" />
        <DemoCode title="脚本 - 复杂布局" :code="codes.complex.script" />
      </template>
    </DemoSection>

    <!-- 响应式布局示例 -->
    <DemoSection title="响应式布局" desc="通过动态改变 span 和 gutter 实现响应式效果">
      <view class="space-y-4">
        <!-- 布局切换控制 -->
        <view class="mb-4">
          <view class="mb-2 text-sm font-medium">布局模式切换</view>
          <wd-button
            v-for="layout in layoutModes"
            :key="layout.key"
            size="small"
            :type="currentLayout.key === layout.key ? 'primary' : 'default'"
            @click="currentLayout = layout"
          >
            {{ layout.name }}
          </wd-button>
        </view>

        <!-- 响应式布局展示 -->
        <view>
          <view class="mb-2 text-xs text-gray-500">
            当前模式: {{ currentLayout.name }} ({{ currentLayout.desc }})
          </view>
          <wd-row :gutter="currentLayout.gutter">
            <wd-col
              v-for="(item, index) in responsiveItems"
              :key="index"
              :span="currentLayout.span"
            >
              <view class="mb-3 border border-gray-200 rounded-lg bg-white p-4 text-center">
                <view class="text-sm font-medium">项目 {{ index + 1 }}</view>
                <view class="mt-1 text-xs text-gray-500">响应式内容</view>
              </view>
            </wd-col>
          </wd-row>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 响应式布局" :code="codes.responsive.template" />
        <DemoCode title="脚本 - 响应式布局" :code="codes.responsive.script" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// ===== 组件状态管理 =====

// 动态间隔控制
const currentGutter = ref<number>(16)
const gutterOptions = ref<number[]>([0, 8, 16, 24, 32])

// 响应式布局状态
const layoutModes = ref([
  { key: 'mobile', name: '手机模式', desc: '单列布局', span: 24, gutter: 8 },
  { key: 'tablet', name: '平板模式', desc: '两列布局', span: 12, gutter: 16 },
  { key: 'desktop', name: '桌面模式', desc: '三列布局', span: 8, gutter: 20 },
  { key: 'large', name: '大屏模式', desc: '四列布局', span: 6, gutter: 24 },
])

const currentLayout = ref(layoutModes.value[2]) // 默认桌面模式

const responsiveItems = ref(Array.from({ length: 8 }, (_, i) => ({ id: i + 1 })))

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    singleTemplate: `<wd-row>
  <wd-col :span="24">
    <view class="demo-col">span: 24</view>
  </wd-col>
</wd-row>`,

    halfTemplate: `<wd-row>
  <wd-col :span="12">
    <view class="demo-col">span: 12</view>
  </wd-col>
  <wd-col :span="12">
    <view class="demo-col">span: 12</view>
  </wd-col>
</wd-row>`,

    thirdTemplate: `<wd-row>
  <wd-col :span="8">
    <view class="demo-col">span: 8</view>
  </wd-col>
  <wd-col :span="8">
    <view class="demo-col">span: 8</view>
  </wd-col>
  <wd-col :span="8">
    <view class="demo-col">span: 8</view>
  </wd-col>
</wd-row>`,

    quarterTemplate: `<wd-row>
  <wd-col :span="6">
    <view class="demo-col">span: 6</view>
  </wd-col>
  <wd-col :span="6">
    <view class="demo-col">span: 6</view>
  </wd-col>
  <wd-col :span="6">
    <view class="demo-col">span: 6</view>
  </wd-col>
  <wd-col :span="6">
    <view class="demo-col">span: 6</view>
  </wd-col>
</wd-row>`,

    script: `// Layout 布局基本用法
// wd-row 为行容器，wd-col 为列容器
// span 属性指定列宽，总宽度为 24 栅格`,
  },

  // 分栏偏移代码
  offset: {
    leftTemplate: `<wd-row>
  <wd-col :span="4">
    <view class="demo-col">span: 4</view>
  </wd-col>
  <wd-col :span="8" :offset="4">
    <view class="demo-col">span: 8, offset: 4</view>
  </wd-col>
</wd-row>`,

    bothTemplate: `<wd-row>
  <wd-col :span="8" :offset="4">
    <view class="demo-col">span: 8, offset: 4</view>
  </wd-col>
  <wd-col :span="8" :offset="4">
    <view class="demo-col">span: 8, offset: 4</view>
  </wd-col>
</wd-row>`,

    centerTemplate: `<wd-row>
  <wd-col :span="16" :offset="4">
    <view class="demo-col">span: 16, offset: 4 (居中)</view>
  </wd-col>
</wd-row>`,

    unequalTemplate: `<wd-row>
  <wd-col :span="6" :offset="2">
    <view class="demo-col">span: 6, offset: 2</view>
  </wd-col>
  <wd-col :span="10" :offset="2">
    <view class="demo-col">span: 10, offset: 2</view>
  </wd-col>
  <wd-col :span="4">
    <view class="demo-col">span: 4</view>
  </wd-col>
</wd-row>`,

    script: `// 分栏偏移使用方法
// offset 属性指定列左侧的间隔栅格数
// 常用于居中布局和不等宽布局`,
  },

  // 分栏间隔代码
  gutter: {
    noneTemplate: `<wd-row :gutter="0">
  <wd-col :span="8">
    <view class="demo-col">span: 8</view>
  </wd-col>
  <wd-col :span="8">
    <view class="demo-col">span: 8</view>
  </wd-col>
  <wd-col :span="8">
    <view class="demo-col">span: 8</view>
  </wd-col>
</wd-row>`,

    fixedTemplate: `<wd-row :gutter="20">
  <wd-col :span="8">
    <view class="demo-col">span: 8</view>
  </wd-col>
  <wd-col :span="8">
    <view class="demo-col">span: 8</view>
  </wd-col>
  <wd-col :span="8">
    <view class="demo-col">span: 8</view>
  </wd-col>
</wd-row>`,

    dynamicTemplate: `<template>
    <wd-button
      v-for="gutter in gutterOptions"
      :key="gutter"
      @click="currentGutter = gutter"
    >
      {{ gutter }}px
    </wd-button>

  <wd-row :gutter="currentGutter">
    <wd-col :span="6">
      <view class="demo-col">span: 6</view>
    </wd-col>
    <!-- 更多列... -->
  </wd-row>
</template>`,

    script: `import { ref } from 'vue'

const currentGutter = ref(16)
const gutterOptions = ref([0, 8, 16, 24, 32])

// gutter 属性指定列之间的间距，单位为 px`,
  },

  // 复杂布局代码
  complex: {
    cardTemplate: `<wd-row :gutter="16">
  <wd-col :span="8">
    <view class="bg-white rounded-lg p-4 border border-gray-200 text-center">
      <view class="font-medium text-sm">标题 1</view>
      <view class="text-xs text-gray-500 mt-1">卡片内容描述</view>
    </view>
  </wd-col>
  <wd-col :span="8">
    <view class="bg-white rounded-lg p-4 border border-gray-200 text-center">
      <view class="font-medium text-sm">标题 2</view>
      <view class="text-xs text-gray-500 mt-1">卡片内容描述</view>
    </view>
  </wd-col>
  <wd-col :span="8">
    <view class="bg-white rounded-lg p-4 border border-gray-200 text-center">
      <view class="font-medium text-sm">标题 3</view>
      <view class="text-xs text-gray-500 mt-1">卡片内容描述</view>
    </view>
  </wd-col>
</wd-row>`,

    formTemplate: `<wd-row :gutter="12">
  <wd-col :span="6">
    <view class="text-sm text-gray-600 text-right pr-2 leading-8">姓名:</view>
  </wd-col>
  <wd-col :span="18">
    <view class="text-sm text-gray-900 bg-gray-50 rounded px-3 leading-8">张三</view>
  </wd-col>
</wd-row>
<wd-row :gutter="12">
  <wd-col :span="6">
    <view class="text-sm text-gray-600 text-right pr-2 leading-8">电话:</view>
  </wd-col>
  <wd-col :span="18">
    <view class="text-sm text-gray-900 bg-gray-50 rounded px-3 leading-8">138-0013-8000</view>
  </wd-col>
</wd-row>`,

    productTemplate: `<wd-row :gutter="8">
  <wd-col :span="6">
    <view class="bg-white rounded-lg p-3 border border-gray-200 text-center">
      <view class="text-2xl mb-2">📱</view>
      <view class="text-sm font-medium text-gray-900 mb-1">手机</view>
      <view class="text-sm text-red-500 font-bold">¥999</view>
    </view>
  </wd-col>
  <wd-col :span="6">
    <view class="bg-white rounded-lg p-3 border border-gray-200 text-center">
      <view class="text-2xl mb-2">💻</view>
      <view class="text-sm font-medium text-gray-900 mb-1">电脑</view>
      <view class="text-sm text-red-500 font-bold">¥2999</view>
    </view>
  </wd-col>
  <!-- 更多商品... -->
</wd-row>`,

    dashboardTemplate: `<wd-row :gutter="16">
  <wd-col :span="12">
    <view class="bg-white rounded-lg p-6 border border-gray-200 text-center h-24 flex flex-col justify-center">
      <view class="text-2xl font-bold text-blue-600">1,234</view>
      <view class="text-xs text-gray-500">今日访问量</view>
    </view>
  </wd-col>
  <wd-col :span="12">
    <wd-row :gutter="8">
      <wd-col :span="24">
        <view class="bg-white rounded-lg p-3 border border-gray-200 text-center mb-2">
          <view class="font-medium text-green-600">86%</view>
          <view class="text-xs text-gray-500">转化率</view>
        </view>
      </wd-col>
    </wd-row>
    <wd-row :gutter="8">
      <wd-col :span="24">
        <view class="bg-white rounded-lg p-3 border border-gray-200 text-center mb-2">
          <view class="font-medium text-orange-600">¥12,345</view>
          <view class="text-xs text-gray-500">今日收入</view>
        </view>
      </wd-col>
    </wd-row>
  </wd-col>
</wd-row>`,

    script: `// 复杂布局示例
// 可以组合使用 gutter、span、offset 实现各种布局需求
// 适用于卡片列表、表单、商品展示、仪表盘等场景`,
  },

  // 响应式布局代码
  responsive: {
    template: `<template>
  <!-- 布局模式切换 -->
    <wd-button
      v-for="layout in layoutModes"
      :key="layout.key"
      :type="currentLayout.key === layout.key ? 'primary' : 'default'"
      @click="currentLayout = layout"
    >
      {{ layout.name }}
    </wd-button>

  <!-- 响应式布局 -->
  <wd-row :gutter="currentLayout.gutter">
    <wd-col
      v-for="(item, index) in responsiveItems"
      :key="index"
      :span="currentLayout.span"
    >
      <view class="bg-white rounded-lg p-4 border border-gray-200 text-center mb-3">
        <view class="text-sm font-medium">项目 {{ index + 1 }}</view>
        <view class="text-xs text-gray-500 mt-1">响应式内容</view>
      </view>
    </wd-col>
  </wd-row>
</template>`,

    script: `import { ref } from 'vue'

const layoutModes = ref([
  { key: 'mobile', name: '手机模式', desc: '单列布局', span: 24, gutter: 8 },
  { key: 'tablet', name: '平板模式', desc: '两列布局', span: 12, gutter: 16 },
  { key: 'desktop', name: '桌面模式', desc: '三列布局', span: 8, gutter: 20 },
  { key: 'large', name: '大屏模式', desc: '四列布局', span: 6, gutter: 24 },
])

const currentLayout = ref(layoutModes.value[2]) // 默认桌面模式
const responsiveItems = ref(Array.from({ length: 8 }, (_, i) => ({ id: i + 1 })))`,
  },
}

// ===== API 文档数据 =====

// Row 组件 Props 属性文档
const apiProps = [
  {
    name: 'gutter',
    type: 'Number',
    default: '0',
    desc: 'Row: 列元素之间的间距（单位为px）',
  },
  {
    name: 'custom-style',
    type: 'String',
    default: '""',
    desc: 'Row: 自定义根节点样式',
  },
  {
    name: 'custom-class',
    type: 'String',
    default: '""',
    desc: 'Row: 自定义根节点样式类',
  },
  {
    name: 'span',
    type: 'Number',
    default: '24',
    desc: 'Col: 列元素宽度（栅格数，总共24栅格）',
  },
  {
    name: 'offset',
    type: 'Number',
    default: '0',
    desc: 'Col: 列元素偏移距离（栅格数）',
  },
  {
    name: 'custom-style',
    type: 'String',
    default: '""',
    desc: 'Col: 自定义根节点样式',
  },
  {
    name: 'custom-class',
    type: 'String',
    default: '""',
    desc: 'Col: 自定义根节点样式类',
  },
]

// Methods 方法文档（Layout 组件没有暴露方法）
const apiMethods: any[] = []

// Events 事件文档（Layout 组件没有事件）
const apiEvents: any[] = []

const { resetScrollTop, updateScrollTop } = useScroll()
onShow(() => {
  resetScrollTop()
})
onPageScroll((e) => {
  updateScrollTop(e.scrollTop)
})
</script>

<style scoped>
/* 演示用的基础列样式 */
.demo-col {
  border-radius: 6px;
  min-height: 32px;
  text-align: center;
  line-height: 32px;
  font-size: 12px;
  margin-bottom: 12px;
  color: white;
  font-weight: 500;
}

/* 不同背景色的演示列 */
.demo-col-primary {
  background-color: #3b82f6;
}

.demo-col-dark {
  background-color: #9ca3af;
}

.demo-col-light {
  background-color: #d1d5db;
  color: #374151;
}
</style>
