<!-- Navbar 导航栏 http://127.0.0.1:100/#/pages-sub/demo/wd/navbar -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Navbar 导航栏" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的导航栏，只包含标题">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <view class="px-4 text-sm text-gray-600">基础导航栏</view>
        <wd-navbar title="标题" :fixed="false" />
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基础导航栏" :code="codes.basic.template" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 返回功能示例 -->
    <DemoSection title="返回功能" desc="带有返回按钮的导航栏">
      <view class="space-y-6">
        <view>
          <view class="mb-2 px-4 text-sm text-gray-600">左侧文字返回</view>
          <wd-navbar
            title="标题"
            left-text="返回"
            left-arrow
            :fixed="false"
            @click-left="handleClickLeft"
          />
        </view>

        <view>
          <view class="mb-2 px-4 text-sm text-gray-600">仅图标返回</view>
          <wd-navbar title="标题" left-arrow :fixed="false" @click-left="handleClickLeft" />
        </view>

        <view>
          <view class="mb-2 px-4 text-sm text-gray-600">自定义返回图标</view>
          <wd-navbar
            title="标题"
            left-icon="back"
            left-text="Back"
            :fixed="false"
            @click-left="handleClickLeft"
          />
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 左侧文字返回" :code="codes.backFunction.leftTextTemplate" />
        <DemoCode title="模板 - 仅图标返回" :code="codes.backFunction.iconOnlyTemplate" />
        <DemoCode title="模板 - 自定义返回图标" :code="codes.backFunction.customIconTemplate" />
        <DemoCode title="脚本 - 返回功能" :code="codes.backFunction.script" />
      </template>
    </DemoSection>

    <!-- 右侧按钮示例 -->
    <DemoSection title="右侧按钮" desc="导航栏右侧操作按钮">
      <view class="space-y-6">
        <view>
          <view class="mb-2 px-4 text-sm text-gray-600">右侧文字按钮</view>
          <wd-navbar
            title="标题"
            left-arrow
            right-text="更多"
            :fixed="false"
            @click-left="handleClickLeft"
            @click-right="handleClickRight"
          />
        </view>

        <view>
          <view class="mb-2 px-4 text-sm text-gray-600">右侧图标按钮</view>
          <wd-navbar
            title="标题"
            left-arrow
            right-icon="search"
            :fixed="false"
            @click-left="handleClickLeft"
            @click-right="handleClickRight"
          />
        </view>

        <view>
          <view class="mb-2 px-4 text-sm text-gray-600">图标和文字组合</view>
          <wd-navbar
            title="标题"
            left-arrow
            right-text="设置"
            right-icon="setting"
            :fixed="false"
            @click-left="handleClickLeft"
            @click-right="handleClickRight"
          />
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 右侧文字按钮" :code="codes.rightButton.textTemplate" />
        <DemoCode title="模板 - 右侧图标按钮" :code="codes.rightButton.iconTemplate" />
        <DemoCode title="模板 - 图标和文字组合" :code="codes.rightButton.combinedTemplate" />
        <DemoCode title="脚本 - 右侧按钮" :code="codes.rightButton.script" />
      </template>
    </DemoSection>

    <!-- 插槽定制示例 -->
    <DemoSection title="插槽定制" desc="使用插槽自定义导航栏内容">
      <view class="space-y-6">
        <view>
          <view class="mb-2 px-4 text-sm text-gray-600">自定义左侧内容</view>
          <wd-navbar title="标题" :fixed="false" @click-left="handleClickLeft">
            <template #left>
              <wd-icon name="arrow-left" size="24px" />
              <text class="ml-1 text-sm">返回</text>
            </template>
          </wd-navbar>
        </view>

        <view>
          <view class="mb-2 px-4 text-sm text-gray-600">自定义右侧内容</view>
          <wd-navbar title="标题" left-arrow :fixed="false" @click-left="handleClickLeft">
            <template #right>
              <wd-icon name="search" size="18" class="mr-2" />
              <wd-icon name="more" size="18" />
            </template>
          </wd-navbar>
        </view>

        <view>
          <view class="mb-2 px-4 text-sm text-gray-600">自定义标题内容</view>
          <wd-navbar left-arrow :fixed="false" @click-left="handleClickLeft">
            <template #title>
              <view class="flex items-center">
                <wd-icon name="star" size="16" class="mr-1" />
                <text>自定义标题</text>
              </view>
            </template>
          </wd-navbar>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 自定义左侧内容" :code="codes.slots.leftTemplate" />
        <DemoCode title="模板 - 自定义右侧内容" :code="codes.slots.rightTemplate" />
        <DemoCode title="模板 - 自定义标题内容" :code="codes.slots.titleTemplate" />
        <DemoCode title="脚本 - 插槽定制" :code="codes.slots.script" />
      </template>
    </DemoSection>

    <!-- 胶囊样式示例 -->
    <DemoSection title="胶囊样式" desc="模拟微信小程序胶囊按钮的样式">
      <view class="space-y-6">
        <view>
          <view class="mb-2 px-4 text-sm text-gray-600">默认胶囊</view>
          <wd-navbar
            title="标题"
            capsule
            :fixed="false"
            @capsule-back="handleCapsuleBack"
            @capsule-back-home="handleCapsuleBackHome"
          />
        </view>

        <view>
          <view class="mb-2 px-4 text-sm text-gray-600">仅返回按钮</view>
          <wd-navbar
            title="标题"
            capsule
            :show-back="true"
            :show-home="false"
            :fixed="false"
            @capsule-back="handleCapsuleBack"
          />
        </view>

        <view>
          <view class="mb-2 px-4 text-sm text-gray-600">仅首页按钮</view>
          <wd-navbar
            title="标题"
            capsule
            :show-back="false"
            :show-home="true"
            :fixed="false"
            @capsule-back-home="handleCapsuleBackHome"
          />
        </view>

        <view>
          <view class="mb-2 px-4 text-sm text-gray-600">自定义胶囊</view>
          <wd-navbar title="标题" :fixed="false">
            <template #capsule>
              <wd-navbar-capsule
                @back="handleCustomCapsuleBack"
                @back-home="handleCustomCapsuleHome"
              />
            </template>
          </wd-navbar>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 默认胶囊" :code="codes.capsule.defaultTemplate" />
        <DemoCode title="模板 - 仅返回按钮" :code="codes.capsule.backOnlyTemplate" />
        <DemoCode title="模板 - 仅首页按钮" :code="codes.capsule.homeOnlyTemplate" />
        <DemoCode title="模板 - 自定义胶囊" :code="codes.capsule.customTemplate" />
        <DemoCode title="脚本 - 胶囊样式" :code="codes.capsule.script" />
      </template>
    </DemoSection>

    <!-- 状态控制示例 -->
    <DemoSection title="状态控制" desc="按钮禁用状态和其他配置">
      <view class="space-y-6">
        <view>
          <view class="mb-2 px-4 text-sm text-gray-600">禁用左侧按钮</view>
          <wd-navbar
            title="标题"
            left-text="返回"
            left-arrow
            left-disabled
            right-text="保存"
            :fixed="false"
          />
        </view>

        <view>
          <view class="mb-2 px-4 text-sm text-gray-600">禁用右侧按钮</view>
          <wd-navbar
            title="标题"
            left-arrow
            right-text="提交"
            right-disabled
            :fixed="false"
            @click-left="handleClickLeft"
          />
        </view>

        <view>
          <view class="mb-2 px-4 text-sm text-gray-600">无边框样式</view>
          <wd-navbar
            title="标题"
            left-arrow
            right-text="操作"
            :bordered="false"
            :fixed="false"
            @click-left="handleClickLeft"
            @click-right="handleClickRight"
          />
        </view>

        <view>
          <view class="mb-2 px-4 text-sm text-gray-600">自定义背景色</view>
          <wd-navbar
            title="标题"
            left-arrow
            right-text="操作"
            bg-color="#4f46e5"
            :fixed="false"
            @click-left="handleClickLeft"
            @click-right="handleClickRight"
          />
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 禁用左侧按钮" :code="codes.status.leftDisabledTemplate" />
        <DemoCode title="模板 - 禁用右侧按钮" :code="codes.status.rightDisabledTemplate" />
        <DemoCode title="模板 - 无边框样式" :code="codes.status.noBorderTemplate" />
        <DemoCode title="模板 - 自定义背景色" :code="codes.status.customBgTemplate" />
        <DemoCode title="脚本 - 状态控制" :code="codes.status.script" />
      </template>
    </DemoSection>

    <!-- 搜索导航栏示例 -->
    <DemoSection title="搜索导航栏" desc="在导航栏中集成搜索功能">
      <!-- 搜索导航栏演示 -->
      <view class="space-y-4">
        <view>
          <view class="mb-2 px-4 text-sm text-gray-600">带搜索栏的导航</view>
          <wd-navbar left-arrow right-text="搜索" :fixed="false" @click-left="handleClickLeft" @click-right="handleClickRight">
            <template #title>
              <view class="h-full flex items-center px-2">
                <wd-search
                  v-model="searchKeyword"
                  hide-cancel
                  placeholder-left
                  placeholder="搜索商品、店铺"
                  custom-class="search-input"
                />
              </view>
            </template>
          </wd-navbar>
        </view>

        <!-- 搜索状态显示 -->
        <view class="mt-4 rounded-lg bg-gray-50 p-4 mt-12!">
          <view class="mb-2 text-sm font-medium">💡 搜索关键词：</view>
          <view class="text-gray-600">{{ searchKeyword || '暂无输入' }}</view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 搜索导航栏" :code="codes.search.template" />
        <DemoCode title="脚本 - 搜索功能" :code="codes.search.script" />
        <DemoCode title="样式 - 搜索框样式" :code="codes.search.style" />
      </template>
    </DemoSection>

    <!-- 固定导航栏示例 -->
    <DemoSection title="固定导航栏" desc="固定在页面顶部的导航栏配置">
      <!-- 固定导航栏控制 -->
      <view class="space-y-4">
        <wd-cell-group>
          <wd-cell title="固定导航栏状态">
            <wd-switch v-model="isNavbarFixed" @change="handleFixedChange" />
          </wd-cell>
        </wd-cell-group>

        <view class="mx-4 rounded-lg bg-blue-50 p-4">
          <view class="mb-2 text-sm text-blue-700 font-medium">📌 固定导航栏说明：</view>
          <view class="text-xs text-blue-600 leading-relaxed">
            <view>• 当前状态：{{ isNavbarFixed ? '已固定' : '未固定' }}</view>
            <view>• 固定后会自动添加占位元素</view>
            <view>• 支持安全区域适配</view>
            <view>• 可自定义层级(z-index)</view>
          </view>
        </view>

        <!-- 动态导航栏演示 -->
        <view>
          <view class="mb-2 px-4 text-sm text-gray-600">动态固定导航栏</view>
          <wd-navbar
            title="动态固定导航栏"
            left-arrow
            right-text="设置"
            :fixed="isNavbarFixed"
            :placeholder="isNavbarFixed"
            :safe-area-inset-top="isNavbarFixed"
            :z-index="isNavbarFixed ? 1000 : 99"
            @click-left="handleClickLeft"
            @click-right="handleClickRight"
            @height-ready="handleHeightReady"
          />
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 固定导航栏" :code="codes.fixed.template" />
        <DemoCode title="脚本 - 固定配置" :code="codes.fixed.script" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// ===== 组件状态管理 =====

// 搜索关键词
const searchKeyword = ref<string>('')

// 固定导航栏状态
const isNavbarFixed = ref<boolean>(false)

// 导航栏高度
const navbarHeight = ref<number>(0)

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    template: `<wd-navbar title="标题" />`,

    script: `import { ref } from 'vue'

// 导航栏基本配置
const navbarTitle = ref('标题')`,
  },

  // 返回功能代码
  backFunction: {
    leftTextTemplate: `<wd-navbar
  title="标题"
  left-text="返回"
  left-arrow
  @click-left="handleClickLeft"
/>`,

    iconOnlyTemplate: `<wd-navbar
  title="标题"
  left-arrow
  @click-left="handleClickLeft"
/>`,

    customIconTemplate: `<wd-navbar
  title="标题"
  left-icon="back"
  left-text="Back"
  @click-left="handleClickLeft"
/>`,

    script: `const handleClickLeft = () => {
  // 自动返回上一页
  uni.navigateBack({
    fail: () => {
      console.log('无法返回，已在首页')
    }
  })
}`,
  },

  // 右侧按钮代码
  rightButton: {
    textTemplate: `<wd-navbar
  title="标题"
  left-arrow
  right-text="更多"
  @click-left="handleClickLeft"
  @click-right="handleClickRight"
/>`,

    iconTemplate: `<wd-navbar
  title="标题"
  left-arrow
  right-icon="search"
  @click-left="handleClickLeft"
  @click-right="handleClickRight"
/>`,

    combinedTemplate: `<wd-navbar
  title="标题"
  left-arrow
  right-text="设置"
  right-icon="setting"
  @click-left="handleClickLeft"
  @click-right="handleClickRight"
/>`,

    script: `const handleClickRight = () => {
  console.log('右侧按钮被点击')
  // 这里可以添加具体的业务逻辑
  // 比如打开菜单、跳转页面等
}`,
  },

  // 插槽定制代码
  slots: {
    leftTemplate: `<wd-navbar title="标题" @click-left="handleClickLeft">
  <template #left>
    <wd-icon name="arrow-left" size="24px" />
    <text class="ml-1 text-sm">返回</text>
  </template>
</wd-navbar>`,

    rightTemplate: `<wd-navbar title="标题" left-arrow @click-left="handleClickLeft">
  <template #right>
    <wd-icon name="search" size="18" class="mr-2" />
    <wd-icon name="more" size="18" />
  </template>
</wd-navbar>`,

    titleTemplate: `<wd-navbar left-arrow @click-left="handleClickLeft">
  <template #title>
    <view class="flex items-center">
      <wd-icon name="star" size="16" class="mr-1" />
      <text>自定义标题</text>
    </view>
  </template>
</wd-navbar>`,

    script: `// 插槽定制可以实现更灵活的布局
// 支持自定义左侧、右侧、标题三个区域
const handleCustomAction = () => {
  console.log('自定义操作')
}`,
  },

  // 胶囊样式代码
  capsule: {
    defaultTemplate: `<wd-navbar
  title="标题"
  capsule
  @capsule-back="handleCapsuleBack"
  @capsule-back-home="handleCapsuleBackHome"
/>`,

    backOnlyTemplate: `<wd-navbar
  title="标题"
  capsule
  :show-back="true"
  :show-home="false"
  @capsule-back="handleCapsuleBack"
/>`,

    homeOnlyTemplate: `<wd-navbar
  title="标题"
  capsule
  :show-back="false"
  :show-home="true"
  @capsule-back-home="handleCapsuleBackHome"
/>`,

    customTemplate: `<wd-navbar title="标题">
  <template #capsule>
    <wd-navbar-capsule
      @back="handleCustomCapsuleBack"
      @back-home="handleCustomCapsuleHome"
    />
  </template>
</wd-navbar>`,

    script: `const handleCapsuleBack = () => {
  uni.navigateBack({})
}

const handleCapsuleBackHome = () => {
  uni.reLaunch({ url: '/pages/index/Index' })
}

const handleCustomCapsuleBack = () => {
  console.log('自定义胶囊返回')
}

const handleCustomCapsuleHome = () => {
  console.log('自定义胶囊回首页')
}`,
  },

  // 状态控制代码
  status: {
    leftDisabledTemplate: `<wd-navbar
  title="标题"
  left-text="返回"
  left-arrow
  left-disabled
  right-text="保存"
/>`,

    rightDisabledTemplate: `<wd-navbar
  title="标题"
  left-arrow
  right-text="提交"
  right-disabled
  @click-left="handleClickLeft"
/>`,

    noBorderTemplate: `<wd-navbar
  title="标题"
  left-arrow
  right-text="操作"
  :bordered="false"
  @click-left="handleClickLeft"
  @click-right="handleClickRight"
/>`,

    customBgTemplate: `<wd-navbar
  title="标题"
  left-arrow
  right-text="操作"
  bg-color="#4f46e5"
  @click-left="handleClickLeft"
  @click-right="handleClickRight"
/>`,

    script: `// 按钮状态控制
const leftDisabled = ref(false)
const rightDisabled = ref(false)
const showBorder = ref(true)
const backgroundColor = ref('#ffffff')`,
  },

  // 搜索功能代码
  search: {
    template: `<wd-navbar left-arrow right-text="搜索" @click-left="handleClickLeft">
  <template #title>
    <view class="flex h-full items-center px-2">
      <wd-search
        v-model="searchKeyword"
        hide-cancel
        placeholder-left
        placeholder="搜索商品、店铺"
        custom-class="search-input"
      />
    </view>
  </template>
</wd-navbar>`,

    script: `import { ref } from 'vue'

const searchKeyword = ref('')

// 监听搜索内容变化
watch(searchKeyword, (newValue) => {
  console.log('搜索关键词:', newValue)
  // 这里可以添加搜索逻辑
})`,

    style: `<style scoped>
/* 搜索框容器样式 */
.search-container {
  padding: 0;
}

/* 搜索框背景透明化 */
.search-container .search-input {
  background: transparent;
  padding: 0;
}
</style>`,
  },

  // 固定导航栏代码
  fixed: {
    template: `<wd-navbar
  title="动态固定导航栏"
  left-arrow
  right-text="设置"
  :fixed="isNavbarFixed"
  :placeholder="isNavbarFixed"
  :safe-area-inset-top="isNavbarFixed"
  :z-index="isNavbarFixed ? 1000 : 99"
  @click-left="handleClickLeft"
  @click-right="handleClickRight"
  @height-ready="handleHeightReady"
/>`,

    script: `import { ref } from 'vue'

const isNavbarFixed = ref(false)
const navbarHeight = ref(0)

const handleFixedChange = ({ value }) => {
  isNavbarFixed.value = value
  console.log('导航栏固定状态:', value)
}

const handleHeightReady = (height) => {
  navbarHeight.value = height
  console.log('导航栏高度:', height)
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'title',
    type: 'String',
    default: '""',
    desc: '标题文字',
  },
  {
    name: 'left-text',
    type: 'String',
    default: '""',
    desc: '左侧文案',
  },
  {
    name: 'left-arrow',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示左侧箭头',
  },
  {
    name: 'left-icon',
    type: 'String',
    default: '""',
    desc: '左侧图标名称',
  },
  {
    name: 'left-icon-size',
    type: 'String | Number',
    default: '32',
    desc: '左侧图标大小',
  },
  {
    name: 'left-icon-color',
    type: 'String',
    default: '""',
    desc: '左侧图标颜色',
  },
  {
    name: 'left-disabled',
    type: 'Boolean',
    default: 'false',
    desc: '是否禁用左侧按钮',
  },
  {
    name: 'right-text',
    type: 'String',
    default: '""',
    desc: '右侧文案',
  },
  {
    name: 'right-icon',
    type: 'String',
    default: '""',
    desc: '右侧图标名称',
  },
  {
    name: 'right-icon-size',
    type: 'String | Number',
    default: '32',
    desc: '右侧图标大小',
  },
  {
    name: 'right-icon-color',
    type: 'String',
    default: '""',
    desc: '右侧图标颜色',
  },
  {
    name: 'right-disabled',
    type: 'Boolean',
    default: 'false',
    desc: '是否禁用右侧按钮',
  },
  {
    name: 'bg-color',
    type: 'String',
    default: '""',
    desc: '导航栏背景色',
  },
  {
    name: 'height',
    type: 'String | Number',
    default: '""',
    desc: '导航栏高度，单位rpx',
  },
  {
    name: 'bordered',
    type: 'Boolean',
    default: 'true',
    desc: '是否显示下边框',
  },
  {
    name: 'fixed',
    type: 'Boolean',
    default: 'true',
    desc: '是否固定到顶部',
  },
  {
    name: 'placeholder',
    type: 'Boolean',
    default: 'true',
    desc: '固定在顶部时，是否在标签位置生成一个等高的占位元素',
  },
  {
    name: 'z-index',
    type: 'Number',
    default: '99',
    desc: '导航栏 z-index',
  },
  {
    name: 'safe-area-inset-top',
    type: 'Boolean',
    default: 'true',
    desc: '是否开启顶部安全区适配',
  },
  {
    name: 'capsule',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示胶囊组件',
  },
  {
    name: 'show-back',
    type: 'Boolean',
    default: 'false',
    desc: '胶囊组件是否显示返回按钮',
  },
  {
    name: 'show-home',
    type: 'Boolean',
    default: 'false',
    desc: '胶囊组件是否显示首页按钮',
  },
  {
    name: 'auto-back',
    type: 'Boolean',
    default: 'true',
    desc: '是否自动处理返回操作',
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
const apiMethods: any[] = []

// Events 事件文档
const apiEvents = [
  {
    name: 'click-left',
    desc: '点击左侧按钮时触发',
  },
  {
    name: 'click-right',
    desc: '点击右侧按钮时触发',
  },
  {
    name: 'height-ready',
    desc: '导航栏高度计算完成时触发，参数为高度值(rpx)',
  },
  {
    name: 'capsule-back',
    desc: '胶囊返回按钮点击时触发',
  },
  {
    name: 'capsule-back-home',
    desc: '胶囊首页按钮点击时触发',
  },
]

// ===== 事件处理方法 =====

/**
 * 处理左侧按钮点击（返回）
 */
const handleClickLeft = () => {
  uni.navigateBack({
    fail: () => {
      console.log('无法返回，已在首页')
    },
  })
}

/**
 * 处理右侧按钮点击
 */
const handleClickRight = () => {
  console.log('右侧按钮被点击')
}

/**
 * 处理胶囊返回按钮
 */
const handleCapsuleBack = () => {
  uni.navigateBack({})
}

/**
 * 处理胶囊回到首页按钮
 */
const handleCapsuleBackHome = () => {
  uni.reLaunch({ url: '/pages/index/Index' })
}

/**
 * 处理自定义胶囊返回
 */
const handleCustomCapsuleBack = () => {
  console.log('自定义胶囊返回')
  uni.navigateBack({})
}

/**
 * 处理自定义胶囊回首页
 */
const handleCustomCapsuleHome = () => {
  console.log('自定义胶囊回首页')
  uni.reLaunch({ url: '/pages/index/Index' })
}

/**
 * 处理固定状态变化
 */
const handleFixedChange = ({ value }: { value: boolean }) => {
  isNavbarFixed.value = value
  console.log('导航栏固定状态:', value)
}

/**
 * 处理导航栏高度就绪事件
 */
const handleHeightReady = (height: number) => {
  navbarHeight.value = height
  console.log(`导航栏高度: ${height}rpx`)
}

const { resetScrollTop, updateScrollTop } = useScroll()
onShow(() => {
  resetScrollTop()
})
onPageScroll((e) => {
  updateScrollTop(e.scrollTop)
})
</script>

<style scoped>
/* 搜索框容器样式 - 兼容微信小程序 */
.search-container {
  padding: 0;
}

/* 搜索框背景透明化 - 使用后代选择器 */
.search-container .search-input {
  background: transparent;
  padding: 0;
}
</style>
