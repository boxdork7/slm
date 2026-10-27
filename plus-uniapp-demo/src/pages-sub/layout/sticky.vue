<!-- Sticky 粘性定位 http://127.0.0.1:100/#/pages-sub/demo/wd/sticky -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Sticky 粘性定位" show-back />

    <!-- 页面说明 -->
    <view class="mx-4 mt-4 rounded-xl bg-blue-50 p-4">
      <view class="text-sm text-blue-600 font-medium">💡 使用提示</view>
      <view class="mt-2 text-xs text-blue-500">
        请向下滚动页面查看各种粘性定位效果。每个示例都有不同的触发时机和行为。
      </view>
    </view>

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="向下滚动页面，元素将粘在页面顶部">
      <view class="space-y-4">
        <view class="px-4">
          <view class="mb-2 text-sm text-gray-700 font-medium">粘性按钮</view>
          <wd-sticky :offset-top="200">
            <wd-button type="primary">基础用法 - 粘性按钮</wd-button>
          </wd-sticky>
        </view>

        <view class="px-4">
          <view class="mb-2 text-sm text-gray-700 font-medium">粘性卡片</view>
          <wd-sticky :offset-top="240" custom-style="margin-left: 20px;">
            <view
              class="rounded-lg from-indigo-500 to-purple-600 bg-gradient-to-br px-5 py-3 text-center text-white font-medium shadow-lg"
            >
              <wd-text text="基础用法 - 粘性卡片" color="#ffffff" />
            </view>
          </wd-sticky>
        </view>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基础用法" :code="codes.basic.template" />
        <DemoCode title="模板 - 粘性卡片" :code="codes.basic.cardTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 吸顶距离示例 -->
    <DemoSection title="吸顶距离" desc="设置距离顶部的距离，到达指定位置时开始粘性定位">
      <view class="px-4 space-y-4">
        <view>
          <view class="mb-2 text-sm text-gray-700 font-medium">距离顶部 150px</view>
          <wd-sticky :offset-top="150">
            <wd-button type="error">吸顶距离 150px</wd-button>
          </wd-sticky>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 吸顶距离" :code="codes.offsetTop.template" />
        <DemoCode title="脚本 - 吸顶距离配置" :code="codes.offsetTop.script" />
      </template>
    </DemoSection>

    <!-- 相对容器示例 -->
    <DemoSection title="相对容器" desc="在指定容器内进行粘性定位，超出容器范围后失效">
      <view class="space-y-6">
        <!-- 基础相对容器 -->
        <view class="px-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">基础相对容器</view>
          <wd-sticky-box>
            <view
              class="relative h-50 w-full overflow-hidden border-2 border-slate-300 rounded-xl border-dashed bg-slate-50 p-4"
            >
              <wd-sticky>
                <wd-button type="primary">相对容器内粘性</wd-button>
              </wd-sticky>
              <view class="mt-4 h-36 overflow-y-auto">
                <view
                  v-for="index in 5"
                  :key="index"
                  class="mb-2 rounded-lg bg-white p-3 text-sm text-slate-600 shadow-sm"
                >
                  容器内容 {{ index }} - 在容器内滚动时，上方按钮会保持粘性定位
                </view>
              </view>
            </view>
          </wd-sticky-box>
        </view>

        <!-- 相对容器配合吸顶距离 -->
        <view class="px-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">相对容器 + 吸顶距离</view>
          <wd-sticky-box>
            <view
              class="relative h-50 w-full overflow-hidden border-2 border-slate-300 rounded-xl border-dashed bg-slate-50 p-4"
            >
              <wd-sticky :offset-top="30">
                <view
                  class="rounded-lg from-cyan-500 to-blue-500 bg-gradient-to-r px-5 py-3 text-center text-white font-medium shadow-lg"
                >
                  <wd-text text="工具栏 (距离顶部30px)" color="#ffffff" />
                </view>
              </wd-sticky>
              <view class="mt-4 h-36 overflow-y-auto">
                <view
                  v-for="index in 8"
                  :key="index"
                  class="mb-2 rounded-lg bg-white p-3 text-sm text-slate-600 shadow-sm"
                >
                  内容区域 {{ index }}
                </view>
              </view>
            </view>
          </wd-sticky-box>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 基础相对容器" :code="codes.container.basicTemplate" />
        <DemoCode title="模板 - 相对容器配合吸顶距离" :code="codes.container.offsetTemplate" />
        <DemoCode title="脚本 - 相对容器" :code="codes.container.script" />
      </template>
    </DemoSection>

    <!-- 动态控制示例 -->
    <DemoSection title="动态控制" desc="通过程序动态控制粘性元素的显示和隐藏">
      <!-- 控制区域 -->
      <view class="space-y-4">
        <!-- 控制按钮 -->
        <view class="px-4">
          <wd-grid clickable border>
            <wd-grid-item text="显示" icon="eye" @itemclick="handleShowDynamic" />
            <wd-grid-item text="隐藏" icon="eye-close" @itemclick="handleHideDynamic" />
            <wd-grid-item text="切换" icon="refresh" @itemclick="handleToggleDynamic" />
          </wd-grid>
        </view>

        <!-- 动态粘性元素 -->
        <view class="px-4">
          <view class="mb-2 text-sm text-gray-700 font-medium">动态粘性元素</view>
          <wd-sticky v-if="showDynamic">
            <wd-button type="info" custom-style="width: 100%;">动态生成的粘性元素</wd-button>
          </wd-sticky>
          <view
            v-else
            class="border-2 border-gray-300 rounded-lg border-dashed py-8 text-center text-sm text-gray-400"
          >
            暂未显示
          </view>
        </view>

        <!-- 状态显示 -->
        <view class="mx-4 rounded-lg bg-blue-50 px-4 py-2">
          <view class="text-xs text-blue-600 font-medium">
            💡 当前状态：{{ showDynamic ? '已显示' : '已隐藏' }}
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 动态控制" :code="codes.dynamic.template" />
        <DemoCode title="脚本 - 动态控制" :code="codes.dynamic.script" />
      </template>
    </DemoSection>

    <!-- 多层粘性示例 -->
    <DemoSection title="多层粘性" desc="多个粘性元素同时使用，具有不同的层级和吸顶距离">
      <view class="px-4 space-y-4">
        <view class="mb-3 text-sm text-gray-700 font-medium">多层粘性演示</view>
        <view class="space-y-3">
          <!-- 第一层 -->
          <wd-sticky :offset-top="44" :z-index="3">
            <view
              class="mx-1 rounded-lg from-blue-500 to-blue-700 bg-gradient-to-r px-5 py-3 text-center text-white font-medium shadow-lg"
            >
              <wd-text text="第一层 (z-index: 3, offset-top: 44px)" color="#ffffff" />
            </view>
          </wd-sticky>

          <!-- 第二层 -->
          <wd-sticky :offset-top="88" :z-index="2">
            <view
              class="mx-1 rounded-lg from-emerald-500 to-emerald-700 bg-gradient-to-r px-5 py-3 text-center text-white font-medium shadow-lg"
            >
              <wd-text text="第二层 (z-index: 2, offset-top: 88px)" color="#ffffff" />
            </view>
          </wd-sticky>

          <!-- 第三层 -->
          <wd-sticky :offset-top="132" :z-index="1">
            <view
              class="mx-1 rounded-lg from-purple-500 to-purple-700 bg-gradient-to-r px-5 py-3 text-center text-white font-medium shadow-lg"
            >
              <wd-text text="第三层 (z-index: 1, offset-top: 132px)" color="#ffffff" />
            </view>
          </wd-sticky>
        </view>

        <!-- 层级说明 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-2 text-sm text-gray-900 font-medium">层级说明</view>
          <view class="text-xs text-gray-600 space-y-1">
            <view class="flex items-start">
              <view class="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
              <view>第一层具有最高的 z-index，会覆盖其他层</view>
            </view>
            <view class="flex items-start">
              <view class="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
              <view>不同的 offset-top 值决定触发粘性定位的时机</view>
            </view>
            <view class="flex items-start">
              <view class="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-500" />
              <view>向下滚动时可以看到层叠效果</view>
            </view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 多层粘性" :code="codes.multilayer.template" />
        <DemoCode title="脚本 - 多层粘性" :code="codes.multilayer.script" />
      </template>
    </DemoSection>

    <!-- 实际应用场景示例 -->
    <DemoSection title="实际应用场景" desc="常见的业务场景应用">
      <view class="space-y-6">
        <!-- 商品分类导航 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">商品分类导航</view>
          <wd-sticky :offset-top="44">
            <view class="border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
              <view class="flex overflow-x-auto space-x-2">
                <view
                  v-for="(category, index) in categories"
                  :key="index"
                  class="flex-shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all duration-200"
                  :class="[
                    activeCategory === index
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                  ]"
                  @click="handleCategoryChange(index)"
                >
                  {{ category }}
                </view>
              </view>
            </view>
          </wd-sticky>
        </view>

        <!-- 操作工具栏 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">操作工具栏</view>
          <wd-sticky :offset-top="88">
            <view class="border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
              <view class="flex items-center justify-between">
                <view class="flex space-x-2">
                  <wd-button size="small" @click="handleSelectAll">全选</wd-button>
                  <wd-button size="small" plain @click="handleDeselectAll">取消</wd-button>
                </view>
                <view class="flex space-x-2">
                  <wd-button size="small" type="primary" @click="handleBatchEdit">
                    批量编辑
                  </wd-button>
                  <wd-button size="small" type="error" @click="handleBatchDelete">
                    批量删除
                  </wd-button>
                </view>
              </view>
            </view>
          </wd-sticky>
        </view>

        <!-- 内容区域 -->
        <view class="mx-4 space-y-2">
          <view
            v-for="index in 12"
            :key="index"
            class="border border-slate-200 rounded-lg bg-white p-4 shadow-sm"
          >
            <view class="mb-2 text-sm text-gray-900 font-medium">商品项目 {{ index }}</view>
            <view class="text-xs text-gray-600">商品描述信息，用于演示粘性导航和工具栏的效果</view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 商品分类导航" :code="codes.scenarios.categoryTemplate" />
        <DemoCode title="脚本 - 商品分类导航" :code="codes.scenarios.categoryScript" />
        <DemoCode title="模板 - 操作工具栏" :code="codes.scenarios.toolbarTemplate" />
        <DemoCode title="脚本 - 操作工具栏" :code="codes.scenarios.toolbarScript" />
      </template>
    </DemoSection>

    <!-- 内容填充区域 -->
    <view class="mx-4 mt-6 space-y-4">
      <view class="rounded-xl bg-white p-4">
        <view class="mb-3 text-base font-medium">内容填充区域</view>
        <view class="space-y-3">
          <view
            v-for="index in 15"
            :key="index"
            class="border border-slate-200 rounded-lg bg-slate-50 p-4"
          >
            <view class="mb-2 text-sm text-gray-900 font-medium">内容项目 {{ index }}</view>
            <view class="text-xs text-gray-600">
              这是第 {{ index }} 个内容项目，用于演示页面滚动效果。
              当页面向下滚动时，上方的粘性元素会固定在指定位置。
            </view>
          </view>
        </view>
      </view>

      <!-- 页面底部 -->
      <view class="mb-8 rounded-xl bg-white p-4">
        <view class="py-8 text-center text-sm text-gray-500">
          已到达页面底部，向上滚动可查看粘性定位效果
        </view>
      </view>
    </view>

    <!-- 操作记录弹窗 -->
    <wd-popup v-model="showActionLog" position="bottom" custom-style="max-height: 50vh;">
      <view class="p-4">
        <view class="mb-4 text-base font-medium">操作记录</view>
        <view class="max-h-64 overflow-y-auto">
          <view v-if="actionLogs.length === 0" class="py-4 text-center text-sm text-gray-400">
            暂无操作记录
          </view>
          <view v-for="(log, index) in actionLogs" :key="index" class="mb-3 text-xs last:mb-0">
            <view class="text-gray-500">{{ log.time }}</view>
            <view class="mt-1 text-gray-700">{{ log.message }}</view>
          </view>
        </view>
        <view class="mt-4 flex space-x-2">
          <wd-button size="small" plain @click="handleClearLogs">清空记录</wd-button>
          <wd-button size="small" @click="showActionLog = false">关闭</wd-button>
        </view>
      </view>
    </wd-popup>

    <!-- 悬浮操作按钮 -->
    <view class="fixed bottom-4 right-4 z-50 space-y-2">
      <view
        class="h-12 w-12 flex cursor-pointer items-center justify-center rounded-full bg-blue-500 shadow-lg transition-all duration-300 active:scale-95 hover:shadow-xl"
        @click="handleScrollToTop"
      >
        <wd-icon name="arrow-up" color="#ffffff" size="20px" />
      </view>
      <view
        class="h-12 w-12 flex cursor-pointer items-center justify-center rounded-full bg-emerald-500 shadow-lg transition-all duration-300 active:scale-95 hover:shadow-xl"
        @click="showActionLog = true"
      >
        <wd-icon name="list" color="#ffffff" size="20px" />
      </view>
    </view>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// ===== 组件状态管理 =====

// 动态显示状态
const showDynamic = ref<boolean>(false)

// 操作记录弹窗状态
const showActionLog = ref<boolean>(false)

// 分类导航状态
const activeCategory = ref<number>(0)

// 操作日志
const actionLogs = ref<Array<{ time: string; message: string }>>([])

// 商品分类数据
const categories = ['热门', '食品', '服装', '数码', '家居', '运动', '美妆', '母婴']

// 吸顶距离配置
const offsetTopOptions = [50, 100, 150]

// 多层粘性配置
const layerConfigs = [
  { offsetTop: 44, zIndex: 3, color: '#3b82f6', name: '第一层' },
  { offsetTop: 88, zIndex: 2, color: '#10b981', name: '第二层' },
  { offsetTop: 132, zIndex: 1, color: '#8b5cf6', name: '第三层' },
]

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    template: `<wd-sticky>
  <wd-button type="primary">基础用法</wd-button>
</wd-sticky>`,

    cardTemplate: `<wd-sticky custom-style="margin-left: 20px;">
  <view class="demo-sticky-card">
    <wd-text text="粘性卡片" />
  </view>
</wd-sticky>`,

    script: `import { ref } from 'vue'

// 基础粘性定位无需额外配置
const stickyVisible = ref(true)`,
  },

  // 吸顶距离代码
  offsetTop: {
    template: `<!-- 吸顶距离 -->
<wd-sticky :offset-top="150">
  <wd-button type="error">吸顶距离 150px</wd-button>
</wd-sticky>`,

    script: `// 吸顶距离配置
const offsetTopOptions = [150]

// 动态设置吸顶距离
const currentOffsetTop = ref(150)

const handleOffsetChange = (value: number) => {
  currentOffsetTop.value = value
}`,
  },

  // 相对容器代码
  container: {
    basicTemplate: `<wd-sticky-box>
  <view class="sticky-container">
    <wd-sticky>
      <wd-button type="primary">相对容器内粘性</wd-button>
    </wd-sticky>
    <view class="container-content">
      <!-- 容器内容 -->
    </view>
  </view>
</wd-sticky-box>`,

    offsetTemplate: `<wd-sticky-box>
  <view class="sticky-container">
    <wd-sticky :offset-top="30">
      <view class="demo-sticky-toolbar">
        <wd-text text="工具栏 (距离顶部30px)" color="#ffffff" />
      </view>
    </wd-sticky>
    <!-- 容器内容 -->
  </view>
</wd-sticky-box>`,

    script: `// 相对容器配置
const containerHeight = ref(300)
const containerOffsetTop = ref(30)

// 容器样式
const containerStyle = computed(() => ({
  height: \`\${containerHeight.value}px\`,
  overflowY: 'auto'
}))`,
  },

  // 动态控制代码
  dynamic: {
    template: `<template>
  <!-- 控制按钮 -->
  <wd-grid clickable border>
    <wd-grid-item text="显示" icon="eye" @itemclick="handleShowDynamic" />
    <wd-grid-item text="隐藏" icon="eye-close" @itemclick="handleHideDynamic" />
    <wd-grid-item text="切换" icon="refresh" @itemclick="handleToggleDynamic" />
  </wd-grid>

  <!-- 动态粘性元素 -->
  <wd-sticky v-if="showDynamic">
    <wd-button type="info">动态生成的粘性元素</wd-button>
  </wd-sticky>
</template>`,

    script: `import { ref } from 'vue'

// 动态显示状态
const showDynamic = ref(false)

// 显示动态元素
const handleShowDynamic = () => {
  showDynamic.value = true
  console.log('显示动态粘性元素')
}

// 隐藏动态元素
const handleHideDynamic = () => {
  showDynamic.value = false
  console.log('隐藏动态粘性元素')
}

// 切换显示状态
const handleToggleDynamic = () => {
  showDynamic.value = !showDynamic.value
  console.log(\`\${showDynamic.value ? '显示' : '隐藏'}动态粘性元素\`)
}`,
  },

  // 多层粘性代码
  multilayer: {
    template: `<!-- 多层粘性元素 -->
<wd-sticky :offset-top="44" :z-index="3">
  <view class="demo-sticky-layer demo-sticky-layer-1">
    <wd-text text="第一层 (z-index: 3)" color="#ffffff" />
  </view>
</wd-sticky>

<wd-sticky :offset-top="88" :z-index="2">
  <view class="demo-sticky-layer demo-sticky-layer-2">
    <wd-text text="第二层 (z-index: 2)" color="#ffffff" />
  </view>
</wd-sticky>

<wd-sticky :offset-top="132" :z-index="1">
  <view class="demo-sticky-layer demo-sticky-layer-3">
    <wd-text text="第三层 (z-index: 1)" color="#ffffff" />
  </view>
</wd-sticky>`,

    script: `// 多层粘性配置
const layerConfigs = [
  { offsetTop: 44, zIndex: 3, color: '#3b82f6', name: '第一层' },
  { offsetTop: 88, zIndex: 2, color: '#10b981', name: '第二层' },
  { offsetTop: 132, zIndex: 1, color: '#8b5cf6', name: '第三层' },
]

// 动态生成多层配置
const generateLayers = (count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    offsetTop: 44 + index * 44,
    zIndex: count - index,
    name: \`第\${index + 1}层\`
  }))
}`,
  },

  // 应用场景代码
  scenarios: {
    categoryTemplate: `<!-- 商品分类导航 -->
<wd-sticky :offset-top="44">
  <view class="demo-category-nav">
    <view class="flex space-x-2 overflow-x-auto">
      <view
        v-for="(category, index) in categories"
        :key="index"
        class="demo-category-item"
        :class="{ 'demo-category-active': activeCategory === index }"
        @click="handleCategoryChange(index)"
      >
        {{ category }}
      </view>
    </view>
  </view>
</wd-sticky>`,

    categoryScript: `// 商品分类数据
const categories = ['热门', '食品', '服装', '数码', '家居', '运动', '美妆', '母婴']
const activeCategory = ref(0)

// 分类切换
const handleCategoryChange = (index: number) => {
  activeCategory.value = index
  console.log(\`切换到分类: \${categories[index]}\`)
}`,

    toolbarTemplate: `<!-- 操作工具栏 -->
<wd-sticky :offset-top="88">
  <view class="demo-toolbar">
    <view class="flex items-center justify-between">
      <view class="flex space-x-2">
        <wd-button size="small" @click="handleSelectAll">全选</wd-button>
        <wd-button size="small" plain @click="handleDeselectAll">取消</wd-button>
      </view>
      <view class="flex space-x-2">
        <wd-button size="small" type="primary" @click="handleBatchEdit">批量编辑</wd-button>
        <wd-button size="small" type="error" @click="handleBatchDelete">批量删除</wd-button>
      </view>
    </view>
  </view>
</wd-sticky>`,

    toolbarScript: `// 工具栏操作方法
const handleSelectAll = () => {
  console.log('执行全选操作')
}

const handleDeselectAll = () => {
  console.log('执行取消全选操作')
}

const handleBatchEdit = () => {
  console.log('执行批量编辑操作')
}

const handleBatchDelete = () => {
  console.log('执行批量删除操作')
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'z-index',
    type: 'Number',
    default: '1',
    desc: '粘性定位时的层级',
  },
  {
    name: 'offset-top',
    type: 'Number',
    default: '0',
    desc: '粘性定位时与顶部的距离，单位为像素',
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

// Methods 方法文档
const apiMethods = [
  {
    name: 'setPosition(boxLeaved, position, top)',
    desc: '设置粘性元素的位置状态，通常由容器组件调用',
  },
]

// Events 事件文档（Sticky 组件没有事件）
const apiEvents: any[] = []

// ===== 工具方法 =====

/**
 * 添加操作日志
 */
const addActionLog = (message: string) => {
  const time = new Date().toLocaleTimeString()
  actionLogs.value.unshift({ time, message })

  // 保持日志数量不超过 20 条
  if (actionLogs.value.length > 20) {
    actionLogs.value = actionLogs.value.slice(0, 20)
  }
}

/**
 * 滚动到页面顶部
 */
const handleScrollToTop = () => {
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 300,
  })
  addActionLog('滚动到页面顶部')
}

/**
 * 清空操作日志
 */
const handleClearLogs = () => {
  actionLogs.value = []
}

// ===== 动态控制方法 =====

/**
 * 显示动态粘性元素
 */
const handleShowDynamic = () => {
  showDynamic.value = true
  addActionLog('显示了动态粘性元素')
}

/**
 * 隐藏动态粘性元素
 */
const handleHideDynamic = () => {
  showDynamic.value = false
  addActionLog('隐藏了动态粘性元素')
}

/**
 * 切换动态粘性元素显示状态
 */
const handleToggleDynamic = () => {
  showDynamic.value = !showDynamic.value
  addActionLog(`${showDynamic.value ? '显示' : '隐藏'}了动态粘性元素`)
}

// ===== 应用场景方法 =====

/**
 * 分类切换处理
 */
const handleCategoryChange = (index: number) => {
  activeCategory.value = index
  addActionLog(`切换到分类: ${categories[index]}`)
}

/**
 * 全选操作
 */
const handleSelectAll = () => {
  addActionLog('执行了全选操作')
}

/**
 * 取消全选操作
 */
const handleDeselectAll = () => {
  addActionLog('执行了取消全选操作')
}

/**
 * 批量编辑操作
 */
const handleBatchEdit = () => {
  addActionLog('执行了批量编辑操作')
}

/**
 * 批量删除操作
 */
const handleBatchDelete = () => {
  addActionLog('执行了批量删除操作')
}

// ===== 生命周期处理 =====

/**
 * 组件挂载后自动显示动态元素
 */
onMounted(() => {
  // 5秒后自动显示动态元素（如果尚未显示）
  setTimeout(() => {
    if (!showDynamic.value) {
      showDynamic.value = true
      addActionLog('5秒后自动显示了动态粘性元素')
    }
  }, 5000)

  // 添加页面加载日志
  addActionLog('页面加载完成，可以开始测试粘性定位效果')
})

const { resetScrollTop, updateScrollTop } = useScroll()
onShow(() => {
  resetScrollTop()
})
onPageScroll((e) => {
  updateScrollTop(e.scrollTop)
})
</script>

<style lang="scss" scoped></style>
