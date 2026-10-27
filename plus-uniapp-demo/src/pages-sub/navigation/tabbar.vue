<!-- Tabbar 标签栏 http://127.0.0.1:100/#/pages-sub/demo/wd/tabbar -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Tabbar 标签栏" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的底部导航标签栏">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="基础标签栏" vertical>
          <wd-tabbar v-model="tabbar0" :fixed="false" bordered @change="handleChange">
            <wd-tabbar-item title="首页" icon="home" />
            <wd-tabbar-item title="分类" icon="cart" />
            <wd-tabbar-item title="我的" icon="user" />
          </wd-tabbar>
        </wd-cell>
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基础标签栏" :code="codes.basic.template" />
        <DemoCode title="脚本 - 基础用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- Items 配置模式示例 -->
    <DemoSection title="Items 配置模式" desc="通过 items 数组属性配置标签项，更适合动态生成">
      <wd-cell-group>
        <wd-cell title="Items 模式标签栏" vertical>
          <wd-tabbar v-model="tabbarItems" :fixed="false" bordered :items="itemsConfig" @change="handleChange" />
        </wd-cell>

        <wd-cell title="带徽标的 Items 模式" vertical>
          <wd-tabbar v-model="tabbarItemsBadge" :items="itemsWithBadge" @change="handleChange">
            <!-- 自定义图标插槽 -->
            <template #icon-special>
              <wd-img
                round
                height="40rpx"
                width="40rpx"
                src="https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg"
              />
            </template>
          </wd-tabbar>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - Items 模式" :code="codes.items.template" />
        <DemoCode title="脚本 - Items 配置" :code="codes.items.script" />
        <DemoCode title="模板 - 带徽标 Items" :code="codes.items.badgeTemplate" />
        <DemoCode title="脚本 - 徽标配置" :code="codes.items.badgeScript" />
      </template>
    </DemoSection>

    <!-- 通过名称匹配示例 -->
    <DemoSection title="通过名称匹配" desc="使用自定义名称标识标签项">
      <wd-cell-group>
        <wd-cell title="名称匹配标签栏" vertical>
          <wd-tabbar v-model="tabbar1" :fixed="false" bordered @change="handleChange">
            <wd-tabbar-item name="home" title="首页" icon="home" />
            <wd-tabbar-item name="cart" title="分类" icon="cart" />
            <wd-tabbar-item name="setting" title="设置" icon="setting" />
            <wd-tabbar-item name="user" title="我的" icon="user" />
          </wd-tabbar>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 名称匹配" :code="codes.name.template" />
        <DemoCode title="脚本 - 名称匹配" :code="codes.name.script" />
      </template>
    </DemoSection>

    <!-- 徽标提示示例 -->
    <DemoSection title="徽标提示" desc="支持数字徽标和小红点提示">
      <wd-cell-group>
        <wd-cell title="徽标提示标签栏" vertical>
          <wd-tabbar v-model="tabbar2" :fixed="false" @change="handleChange">
            <wd-tabbar-item is-dot :value="2" title="点状" icon="home" />
            <wd-tabbar-item :value="2" icon="cart" title="分类" />
            <wd-tabbar-item :value="30" title="我的" icon="user" />
            <wd-tabbar-item :value="200" title="最大值" icon="photo" />
          </wd-tabbar>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 徽标提示" :code="codes.badge.template" />
        <DemoCode title="脚本 - 徽标提示" :code="codes.badge.script" />
      </template>
    </DemoSection>

    <!-- 形状样式示例 -->
    <DemoSection title="形状样式" desc="支持默认和圆形两种形状">
      <wd-cell-group>
        <wd-cell title="悬浮圆形标签栏" vertical>
          <wd-tabbar v-model="tabbar3" :fixed="false" shape="round" @change="handleChange">
            <wd-tabbar-item title="首页" is-dot :value="2" icon="home" />
            <wd-tabbar-item title="分类" :value="2" icon="cart" />
            <wd-tabbar-item title="相册" :value="30" icon="photo" />
            <wd-tabbar-item title="我的" :value="200" icon="user" />
          </wd-tabbar>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 圆形标签栏" :code="codes.shape.template" />
        <DemoCode title="脚本 - 形状样式" :code="codes.shape.script" />
      </template>
    </DemoSection>

    <!-- 自定义图标示例 -->
    <DemoSection title="自定义图标" desc="支持自定义图标和激活状态图标">
      <wd-cell-group>
        <wd-cell title="自定义图标标签栏" vertical>
          <wd-tabbar v-model="tabbar4" :fixed="false" @change="handleChange">
            <wd-tabbar-item :value="2" title="首页" icon="home" />
            <wd-tabbar-item :value="2" icon="cart" title="分类">
              <template #icon>
                <wd-img
                  round
                  height="40rpx"
                  width="40rpx"
                  src="https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg"
                />
              </template>
            </wd-tabbar-item>
            <wd-tabbar-item :value="3" title="我的" icon="user" />
          </wd-tabbar>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 自定义图标" :code="codes.customIcon.template" />
        <DemoCode title="脚本 - 自定义图标" :code="codes.customIcon.script" />
      </template>
    </DemoSection>

    <!-- 自定义颜色示例 -->
    <DemoSection title="自定义颜色" desc="自定义激活和未激活状态的颜色">
      <wd-cell-group>
        <wd-cell title="自定义颜色标签栏" vertical>
          <wd-tabbar
            v-model="tabbar5"
            :fixed="false"
            active-color="#ee0a24"
            inactive-color="#7d7e80"
            @change="handleChange"
          >
            <wd-tabbar-item is-dot :value="2" title="点状" icon="home" />
            <wd-tabbar-item :value="2" icon="cart" title="分类" />
            <wd-tabbar-item :value="30" title="我的" icon="user" />
            <wd-tabbar-item :value="200" title="最大值" icon="photo" />
            <wd-tabbar-item :value="10" title="客服" icon="chat" />
          </wd-tabbar>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 自定义颜色" :code="codes.color.template" />
        <DemoCode title="脚本 - 自定义颜色" :code="codes.color.script" />
      </template>
    </DemoSection>

    <!-- 事件监听示例 -->
    <DemoSection title="事件监听" desc="监听标签栏切换事件">
      <!-- 控制区域 -->
      <view class="space-y-4">
        <!-- 带事件监听的标签栏 -->
        <wd-cell-group>
          <wd-cell title="监听切换事件" vertical>
            <wd-tabbar
              v-model="tabbar6"
              :fixed="false"
              active-color="#ee0a24"
              inactive-color="#7d7e80"
              @change="handleChangeWithToast"
            >
              <wd-tabbar-item title="首页" icon="home" />
              <wd-tabbar-item title="分类" icon="cart" />
              <wd-tabbar-item title="我的" icon="user" />
              <wd-tabbar-item title="相册" icon="photo" />
              <wd-tabbar-item title="客服" icon="chat" />
            </wd-tabbar>
          </wd-cell>
        </wd-cell-group>

        <!-- 状态显示 -->
        <view class="mx-4 rounded-lg bg-blue-50 px-4 py-2">
          <view class="text-xs text-blue-600 font-medium">💡 当前选中：标签 {{ tabbar6 }}</view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 事件监听" :code="codes.events.template" />
        <DemoCode title="脚本 - 事件监听" :code="codes.events.script" />
      </template>
    </DemoSection>

    <!-- 固定定位示例 -->
    <DemoSection title="固定定位" desc="固定在页面底部的标签栏">
      <!-- 控制区域 -->
      <view class="space-y-4">
        <!-- 控制按钮 -->
        <wd-cell-group>
          <wd-cell title="固定底部控制">
            <wd-button size="small" @click="toggleFixed">
              {{ showFixed ? '隐藏' : '显示' }}固定标签栏
            </wd-button>
          </wd-cell>
        </wd-cell-group>

        <!-- 状态提示 -->
        <view class="mx-4 rounded-lg bg-orange-50 px-4 py-2">
          <view class="text-xs text-orange-600 font-medium">
            📌 固定标签栏状态：{{ showFixed ? '已显示' : '已隐藏' }}
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 固定定位" :code="codes.fixed.template" />
        <DemoCode title="脚本 - 固定定位" :code="codes.fixed.script" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :events="apiEvents" />

    <wd-gap height="100" />

    <!-- 固定在底部的标签栏 -->
    <wd-tabbar
      v-if="showFixed"
      v-model="tabbar7"
      shape="round"

       bordered safeareainsetbottom placeholder fixed
      @change="handleChange"
    >
      <wd-tabbar-item :value="2" is-dot title="首页" icon="home" />
      <wd-tabbar-item title="分类" icon="cart" />
      <wd-tabbar-item title="我的" icon="user" />
      <wd-tabbar-item :value="200" title="相册" icon="photo" />
      <wd-tabbar-item :value="10" title="客服" icon="chat" />
    </wd-tabbar>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/wd'

import type { WdTabbarItemProps } from '@/wd/components/wd-tabbar-item/wd-tabbar-item.vue'

// ===== 组件状态管理 =====

// 初始化 toast
const { show } = useToast()

// 各个标签栏的当前选中状态
const tabbar0 = ref<number>(1)
const tabbar1 = ref<string>('home')
const tabbar2 = ref<number>(2)
const tabbar3 = ref<number>(2)
const tabbar4 = ref<number>(1)
const tabbar5 = ref<number>(1)
const tabbar6 = ref<number>(1)
const tabbar7 = ref<number>(1)

// Items 模式状态
const tabbarItems = ref<number>(0)
const tabbarItemsBadge = ref<string>('special')

// 固定标签栏显示状态
const showFixed = ref<boolean>(false)

// Items 模式配置数据
const itemsConfig = ref([
  { title: '首页', icon: 'home' },
  { title: '分类', icon: 'cart' },
  { title: '设置', icon: 'setting' },
  { title: '我的', icon: 'user' },
])

const itemsWithBadge = ref<WdTabbarItemProps[]>([
  { name: 'home', title: '首页', icon: 'home', value: 5 },
  { name: 'cart', title: '购物车', icon: 'cart', value: 20, isDot: false },
  { name: 'special', title: '特殊', icon: 'star', value: 99 },
  { name: 'message', title: '消息', icon: 'chat', isDot: true },
  { name: 'profile', title: '我的', icon: 'user', value: 200 },
])

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    template: `<wd-tabbar v-model="tabbar0" bordered @change="handleChange">
  <wd-tabbar-item title="首页" icon="home" />
  <wd-tabbar-item title="分类" icon="cart" />
  <wd-tabbar-item title="我的" icon="user" />
</wd-tabbar>`,

    script: `import { ref } from 'vue'

const tabbar0 = ref(1)

const handleChange = (event: any) => {
  console.log('标签栏切换事件:', event)
}`,
  },

  // Items 模式代码
  items: {
    template: `<!-- 基本 Items 模式 -->
<wd-tabbar v-model="tabbarItems" bordered :items="itemsConfig" @change="handleChange" />`,

    script: `const tabbarItems = ref(0)
const itemsConfig = ref([
  { title: '首页', icon: 'home' },
  { title: '分类', icon: 'cart' },
  { title: '设置', icon: 'setting' },
  { title: '我的', icon: 'user' },
])

// Items 模式特点：
// - 通过数组配置，适合动态生成
// - 支持所有 tabbar-item 的属性
// - 可以结合插槽使用`,

    badgeTemplate: `<!-- 带徽标和自定义图标的 Items 模式 -->
<wd-tabbar v-model="tabbarItemsBadge" :items="itemsWithBadge" @change="handleChange">
  <!-- 自定义图标插槽 -->
  <template #icon-special>
    <wd-img
      round
      height="40rpx"
      width="40rpx"
      src="https://example.com/custom-icon.jpg"
    />
  </template>
</wd-tabbar>`,

    badgeScript: `const tabbarItemsBadge = ref('special')
const itemsWithBadge = ref([
  { name: 'home', title: '首页', icon: 'home', value: 5 },
  { name: 'cart', title: '购物车', icon: 'cart', value: 20, isDot: false },
  { name: 'special', title: '特殊', icon: 'star', value: 99 },
  { name: 'message', title: '消息', icon: 'chat', isDot: true },
  { name: 'profile', title: '我的', icon: 'user', value: 200 },
])

// Items 配置支持的属性：
// - name: 唯一标识符
// - title: 标签页标题
// - icon: 图标名称
// - activeIcon: 激活状态图标
// - value: 徽标显示值
// - isDot: 是否点状徽标
// - max: 徽标最大值
// - badgeProps: 徽标属性`,
  },

  // 名称匹配代码
  name: {
    template: `<wd-tabbar v-model="tabbar1" bordered @change="handleChange">
  <wd-tabbar-item name="home" title="首页" icon="home" />
  <wd-tabbar-item name="cart" title="分类" icon="cart" />
  <wd-tabbar-item name="setting" title="设置" icon="setting" />
  <wd-tabbar-item name="user" title="我的" icon="user" />
</wd-tabbar>`,

    script: `const tabbar1 = ref('home')

// 通过名称匹配，modelValue 为字符串类型
const handleChange = (value: string | number) => {
  console.log('选中标签名称:', value)
}`,
  },

  // 徽标提示代码
  badge: {
    template: `<wd-tabbar v-model="tabbar2" @change="handleChange">
  <wd-tabbar-item is-dot :value="2" title="点状" icon="home" />
  <wd-tabbar-item :value="2" icon="cart" title="分类" />
  <wd-tabbar-item :value="30" title="我的" icon="user" />
  <wd-tabbar-item :value="200" title="最大值" icon="photo" />
</wd-tabbar>`,

    script: `const tabbar2 = ref(2)

// 徽标属性说明
// :value="数字" - 显示数字徽标
// is-dot - 显示小红点
// 超过 99 的数字会显示为 99+`,
  },

  // 形状样式代码
  shape: {
    template: `<!-- 圆形悬浮标签栏 -->
<wd-tabbar v-model="tabbar3" shape="round" @change="handleChange">
  <wd-tabbar-item title="首页" is-dot :value="2" icon="home" />
  <wd-tabbar-item title="分类" :value="2" icon="cart" />
  <wd-tabbar-item title="相册" :value="30" icon="photo" />
  <wd-tabbar-item title="我的" :value="200" icon="user" />
</wd-tabbar>`,

    script: `const tabbar3 = ref(2)

// 形状选项：
// shape="default" - 默认方形
// shape="round" - 圆形悬浮`,
  },

  // 自定义图标代码
  customIcon: {
    template: `<wd-tabbar v-model="tabbar4" @change="handleChange">
  <wd-tabbar-item :value="2" title="首页" icon="home" />
  <wd-tabbar-item :value="2" icon="cart" title="分类">
    <template #icon>
      <wd-img
        round
        height="40rpx"
        width="40rpx"
        src="https://example.com/custom-icon.jpg"
      />
    </template>
  </wd-tabbar-item>
  <wd-tabbar-item :value="3" title="我的" icon="user" />
</wd-tabbar>`,

    script: `const tabbar4 = ref(1)

// 自定义图标使用插槽
// 可以使用图片、自定义组件等替换默认图标`,
  },

  // 自定义颜色代码
  color: {
    template: `<wd-tabbar
  v-model="tabbar5"
  active-color="#ee0a24"
  inactive-color="#7d7e80"
  @change="handleChange"
>
  <wd-tabbar-item is-dot :value="2" title="点状" icon="home" />
  <wd-tabbar-item :value="2" icon="cart" title="分类" />
  <wd-tabbar-item :value="30" title="我的" icon="user" />
  <wd-tabbar-item :value="200" title="最大值" icon="photo" />
  <wd-tabbar-item :value="10" title="客服" icon="chat" />
</wd-tabbar>`,

    script: `const tabbar5 = ref(1)

// 自定义颜色属性：
// active-color - 激活状态颜色
// inactive-color - 未激活状态颜色`,
  },

  // 事件监听代码
  events: {
    template: `<wd-tabbar
  v-model="tabbar6"
  active-color="#ee0a24"
  inactive-color="#7d7e80"
  @change="handleChangeWithToast"
>
  <wd-tabbar-item title="首页" icon="home" />
  <wd-tabbar-item title="分类" icon="cart" />
  <wd-tabbar-item title="我的" icon="user" />
  <wd-tabbar-item title="相册" icon="photo" />
  <wd-tabbar-item title="客服" icon="chat" />
</wd-tabbar>`,

    script: `import { useToast } from '@/wd'

const { show } = useToast()
const tabbar6 = ref(1)

const handleChangeWithToast = (value: string | number) => {
  show(\`选中标签: \${value}\`)
  console.log('标签栏切换:', value)
}`,
  },

  // 固定定位代码
  fixed: {
    template: `<!-- 固定在底部的标签栏 -->
<wd-tabbar
  v-model="tabbar7"
  shape="round"
  bordered
  placeholder
  safeareainsetbottom
  fixed
  @change="handleChange"
>
  <wd-tabbar-item :value="2" is-dot title="首页" icon="home" />
  <wd-tabbar-item title="分类" icon="cart" />
  <wd-tabbar-item title="我的" icon="user" />
  <wd-tabbar-item :value="200" title="相册" icon="photo" />
  <wd-tabbar-item :value="10" title="客服" icon="chat" />
</wd-tabbar>`,

    script: `const tabbar7 = ref(1)
const showFixed = ref(false)

const toggleFixed = () => {
  showFixed.value = !showFixed.value
}

// 固定定位相关属性：
// fixed - 是否固定在底部
// placeholder - 是否生成占位元素
// safeareainsetbottom - 是否适配安全区域
// bordered - 是否显示上边框`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'model-value',
    type: 'Number | String',
    default: '0',
    desc: '选中标签的索引值或者名称',
  },
  {
    name: 'items',
    type: 'Array<WdTabbarItemProps>',
    default: '[]',
    desc: '标签栏配置列表，使用 items 模式时的标签项数组',
  },
  {
    name: 'fixed',
    type: 'Boolean',
    default: 'true',
    desc: '是否固定在底部',
  },
  {
    name: 'bordered',
    type: 'Boolean',
    default: 'true',
    desc: '是否显示顶部边框',
  },
  {
    name: 'safe-area-inset-bottom',
    type: 'Boolean',
    default: 'false',
    desc: '是否设置底部安全距离（iPhone X 类型的机型）',
  },
  {
    name: 'shape',
    type: 'String',
    default: '"default"',
    desc: '标签栏的形状，可选值：default / round',
  },
  {
    name: 'active-color',
    type: 'String',
    default: '""',
    desc: '激活标签的颜色',
  },
  {
    name: 'inactive-color',
    type: 'String',
    default: '""',
    desc: '未激活标签的颜色',
  },
  {
    name: 'placeholder',
    type: 'Boolean',
    default: 'true',
    desc: '固定在底部时，是否在标签位置生成一个等高的占位元素',
  },
  {
    name: 'z-index',
    type: 'Number',
    default: '99',
    desc: 'tabbar组件的层级',
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

// Events 事件文档
const apiEvents = [
  {
    name: 'change',
    desc: 'tabbar标签切换时触发，参数为当前选中标签的索引值或名称',
  },
]

// ===== 事件处理方法 =====

/**
 * 普通切换事件处理
 */
const handleChange = (event: any) => {
  console.log('标签栏切换事件:', event)
}

/**
 * 带 Toast 提示的切换事件处理
 */
const handleChangeWithToast = (value: string | number) => {
  show(`选中标签: ${value}`)
  console.log('标签栏切换:', value)
}

/**
 * 切换固定标签栏显示状态
 */
const toggleFixed = () => {
  showFixed.value = !showFixed.value
  console.log('固定标签栏状态:', showFixed.value ? '显示' : '隐藏')
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
/* 页面包装器背景色 */
:deep(.page-wraper) {
  background: #f6f6f6;
}
</style>
