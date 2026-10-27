<!-- Divider 分割线 http://127.0.0.1:100/#/pages-sub/demo/wd/divider -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Divider 分割线" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的分割线，用于内容分隔">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <view class="text-sm text-gray-600">这是上方的内容</view>
        <wd-divider />
        <view class="text-sm text-gray-600">这是下方的内容</view>

        <view class="mt-6 text-sm text-gray-600">分割线可以将页面内容进行有效分隔</view>
        <wd-divider />
        <view class="text-sm text-gray-600">使页面布局更清晰，层次更分明</view>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基本分割线" :code="codes.basic.template" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 带文本的分割线示例 -->
    <DemoSection title="带文本的分割线" desc="在分割线中显示文本内容">
      <view class="space-y-4">
        <view class="text-sm text-gray-600">这是第一段内容</view>
        <wd-divider>分割文本</wd-divider>
        <view class="text-sm text-gray-600">这是第二段内容</view>

        <wd-divider>更多内容</wd-divider>
        <view class="text-sm text-gray-600">分割线可以包含描述性文字</view>

        <wd-divider>章节分隔</wd-divider>
        <view class="text-sm text-gray-600">用于标识不同的内容区块</view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 带文本分割线" :code="codes.text.template" />
        <DemoCode title="脚本 - 带文本分割线" :code="codes.text.script" />
      </template>
    </DemoSection>

    <!-- 自定义内容示例 -->
    <DemoSection title="自定义内容" desc="在分割线中放置自定义内容">
      <view class="space-y-4">
        <!-- 图标分割线 -->
        <view class="text-sm text-gray-600">使用图标作为分割内容</view>
        <wd-divider>
          <wd-icon name="arrow-down" size="20" color="#666" />
        </wd-divider>
        <view class="text-sm text-gray-600">图标可以增强视觉效果</view>

        <!-- 多个图标 -->
        <wd-divider>
          <view class="flex items-center space-x-2">
            <wd-icon name="star" size="16" color="#ffb800" />
            <text class="text-xs text-gray-500">精选内容</text>
            <wd-icon name="star" size="16" color="#ffb800" />
          </view>
        </wd-divider>

        <!-- 按钮分割线 -->
        <view class="text-sm text-gray-600">展开更多内容</view>
        <wd-divider>
          <wd-button size="small" type="text" @click="handleExpandClick">
            <wd-icon name="add" size="16" />
            <text class="ml-1">展开</text>
          </wd-button>
        </wd-divider>
        <view class="text-sm text-gray-600">可以放置交互按钮</view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 图标分割线" :code="codes.custom.iconTemplate" />
        <DemoCode title="模板 - 多元素分割线" :code="codes.custom.multiTemplate" />
        <DemoCode title="模板 - 按钮分割线" :code="codes.custom.buttonTemplate" />
        <DemoCode title="脚本 - 自定义内容" :code="codes.custom.script" />
      </template>
    </DemoSection>

    <!-- 内容位置示例 -->
    <DemoSection title="内容位置" desc="设置分割线中内容的对齐位置">
      <view class="space-y-4">
        <!-- 居中对齐（默认） -->
        <view class="text-sm text-gray-600">居中对齐（默认）</view>
        <wd-divider content-position="center">居中内容</wd-divider>

        <!-- 左对齐 -->
        <view class="text-sm text-gray-600">左对齐</view>
        <wd-divider content-position="left">左侧内容</wd-divider>

        <!-- 右对齐 -->
        <view class="text-sm text-gray-600">右对齐</view>
        <wd-divider content-position="right">右侧内容</wd-divider>

        <!-- 对比展示 -->
        <view class="mt-6 text-sm text-gray-600">对比展示</view>
        <wd-divider content-position="left">开始</wd-divider>
        <wd-divider content-position="center">中间</wd-divider>
        <wd-divider content-position="right">结束</wd-divider>
      </view>

      <template #codes>
        <DemoCode title="模板 - 内容位置" :code="codes.position.template" />
        <DemoCode title="脚本 - 内容位置" :code="codes.position.script" />
      </template>
    </DemoSection>

    <!-- 线条样式示例 -->
    <DemoSection title="线条样式" desc="不同的线条样式配置">
      <view class="space-y-4">
        <!-- 实线（默认） -->
        <view class="text-sm text-gray-600">实线分割线（默认）</view>
        <wd-divider>实线</wd-divider>

        <!-- 虚线 -->
        <view class="text-sm text-gray-600">虚线分割线</view>
        <wd-divider dashed>虚线</wd-divider>

        <!-- 细线 -->
        <view class="text-sm text-gray-600">细线分割线（默认）</view>
        <wd-divider :hairline="true">细线</wd-divider>

        <!-- 粗线 -->
        <view class="text-sm text-gray-600">粗线分割线</view>
        <wd-divider :hairline="false">粗线</wd-divider>

        <!-- 虚线+粗线 -->
        <view class="text-sm text-gray-600">虚线粗线组合</view>
        <wd-divider dashed :hairline="false">虚线粗线</wd-divider>
      </view>

      <template #codes>
        <DemoCode title="模板 - 线条样式" :code="codes.style.template" />
        <DemoCode title="脚本 - 线条样式" :code="codes.style.script" />
      </template>
    </DemoSection>

    <!-- 自定义颜色示例 -->
    <DemoSection title="自定义颜色" desc="自定义分割线和文本的颜色">
      <view class="space-y-4">
        <!-- 蓝色主题 -->
        <view class="text-sm text-gray-600">蓝色主题</view>
        <wd-divider color="#4D80F0">蓝色分割线</wd-divider>

        <!-- 绿色主题 -->
        <view class="text-sm text-gray-600">绿色主题</view>
        <wd-divider color="#16a085">绿色分割线</wd-divider>

        <!-- 橙色主题 -->
        <view class="text-sm text-gray-600">橙色主题</view>
        <wd-divider color="#f39c12">橙色分割线</wd-divider>

        <!-- 红色主题 -->
        <view class="text-sm text-gray-600">红色主题</view>
        <wd-divider color="#e74c3c">红色分割线</wd-divider>

        <!-- 紫色虚线 -->
        <view class="text-sm text-gray-600">紫色虚线</view>
        <wd-divider color="#9b59b6" dashed>紫色虚线</wd-divider>
      </view>

      <template #codes>
        <DemoCode title="模板 - 自定义颜色" :code="codes.color.template" />
        <DemoCode title="脚本 - 自定义颜色" :code="codes.color.script" />
      </template>
    </DemoSection>

    <!-- 垂直分割线示例 -->
    <DemoSection title="垂直分割线" desc="用于水平布局中的内容分隔">
      <view class="space-y-6">
        <!-- 基础垂直分割线 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">基础垂直分割线</view>
          <view class="flex items-center text-sm">
            首页
            <wd-divider vertical />
            产品
            <wd-divider vertical />
            关于我们
            <wd-divider vertical />
            联系我们
          </view>
        </view>

        <!-- 不同样式的垂直分割线 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">不同样式组合</view>
          <view class="flex items-center text-sm">
            文本A
            <wd-divider vertical />
            文本B
            <wd-divider vertical dashed />
            文本C
            <wd-divider vertical :hairline="false" />
            文本D
            <wd-divider vertical color="#1989fa" />
            文本E
          </view>
        </view>

        <!-- 彩色垂直分割线 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">彩色垂直分割线</view>
          <view class="flex items-center text-sm">
            <text>红色</text>
            <wd-divider vertical color="#ff4757" />
            <text>绿色</text>
            <wd-divider vertical color="#2ed573" />
            <text>蓝色</text>
            <wd-divider vertical color="#3742fa" />
            <text>橙色</text>
            <wd-divider vertical color="#ffa502" />
            <text>结束</text>
          </view>
        </view>

        <!-- 导航菜单示例 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">导航菜单示例</view>
          <view class="flex items-center justify-center rounded-lg bg-gray-50 p-4">
            <text class="cursor-pointer text-blue-600" @click="handleNavClick('home')">首页</text>
            <wd-divider vertical color="#ddd" />
            <text class="cursor-pointer text-blue-600" @click="handleNavClick('news')">
              新闻资讯
            </text>
            <wd-divider vertical color="#ddd" />
            <text class="cursor-pointer text-blue-600" @click="handleNavClick('about')">
              关于我们
            </text>
            <wd-divider vertical color="#ddd" />
            <text class="cursor-pointer text-blue-600" @click="handleNavClick('contact')">
              联系我们
            </text>
          </view>
        </view>

        <!-- 操作按钮示例 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">操作按钮示例</view>
          <view class="flex items-center justify-center rounded-lg bg-gray-50 p-4">
            <wd-button size="small" type="text" @click="handleActionClick('edit')">编辑</wd-button>
            <wd-divider vertical />
            <wd-button size="small" type="text" @click="handleActionClick('copy')">复制</wd-button>
            <wd-divider vertical />
            <wd-button size="small" type="text" @click="handleActionClick('share')">分享</wd-button>
            <wd-divider vertical />
            <wd-button
              size="small"
              type="text"
              style="color: #ff4757"
              @click="handleActionClick('delete')"
            >
              删除
            </wd-button>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 基础垂直分割线" :code="codes.vertical.basicTemplate" />
        <DemoCode title="模板 - 不同样式组合" :code="codes.vertical.styleTemplate" />
        <DemoCode title="模板 - 导航菜单示例" :code="codes.vertical.navTemplate" />
        <DemoCode title="模板 - 操作按钮示例" :code="codes.vertical.actionTemplate" />
        <DemoCode title="脚本 - 垂直分割线" :code="codes.vertical.script" />
      </template>
    </DemoSection>

    <!-- 实际应用场景示例 -->
    <DemoSection title="实际应用场景" desc="分割线在实际项目中的应用示例">
      <view class="space-y-6">
        <!-- 文章内容分隔 -->
        <view>
          <view class="mb-2 text-sm font-medium">文章内容分隔</view>
          <view class="rounded-lg bg-gray-50 p-4">
            <view class="mb-3 text-base font-medium">文章标题</view>
            <view class="text-sm text-gray-600 leading-6">
              这里是文章的第一段内容，介绍了主要概念和背景信息...
            </view>
            <wd-divider />
            <view class="text-sm text-gray-600 leading-6">
              这里是文章的第二段内容，详细阐述了核心观点...
            </view>
            <wd-divider>核心要点</wd-divider>
            <view class="text-sm text-gray-600 leading-6">
              这里是文章的核心要点部分，包含了最重要的信息...
            </view>
          </view>
        </view>

        <!-- 表单分组 -->
        <view>
          <view class="mb-2 text-sm font-medium">表单分组</view>
          <view class="rounded-lg bg-gray-50 p-4">
            <view class="text-sm text-gray-700 font-medium">基本信息</view>
            <view class="mt-2 space-y-2">
              <view class="flex items-center text-sm">
                <text class="w-16 text-gray-600">姓名:</text>
                <text>张三</text>
              </view>
              <view class="flex items-center text-sm">
                <text class="w-16 text-gray-600">年龄:</text>
                <text>25岁</text>
              </view>
            </view>

            <wd-divider content-position="left">联系信息</wd-divider>
            <view class="space-y-2">
              <view class="flex items-center text-sm">
                <text class="w-16 text-gray-600">电话:</text>
                <text>138****8888</text>
              </view>
              <view class="flex items-center text-sm">
                <text class="w-16 text-gray-600">邮箱:</text>
                <text>zhang@example.com</text>
              </view>
            </view>

            <wd-divider content-position="left">其他信息</wd-divider>
            <view class="space-y-2">
              <view class="flex items-center text-sm">
                <text class="w-16 text-gray-600">地址:</text>
                <text>北京市朝阳区</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 商品列表分隔 -->
        <view>
          <view class="mb-2 text-sm font-medium">商品列表分隔</view>
          <view class="rounded-lg bg-gray-50 p-4">
            <view class="flex items-center justify-between text-sm">
              <text class="font-medium">商品A</text>
              <text class="text-red-500">¥199</text>
            </view>
            <wd-divider color="#f0f0f0" />

            <view class="flex items-center justify-between text-sm">
              <text class="font-medium">商品B</text>
              <text class="text-red-500">¥299</text>
            </view>
            <wd-divider color="#f0f0f0" />

            <view class="flex items-center justify-between text-sm">
              <text class="font-medium">商品C</text>
              <text class="text-red-500">¥399</text>
            </view>

            <wd-divider dashed>
              <text class="text-xs text-gray-500">总计</text>
            </wd-divider>

            <view class="flex items-center justify-between text-sm font-medium">
              <text>合计</text>
              <text class="text-base text-red-500">¥897</text>
            </view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 文章内容分隔" :code="codes.scenarios.articleTemplate" />
        <DemoCode title="模板 - 表单分组" :code="codes.scenarios.formTemplate" />
        <DemoCode title="模板 - 商品列表分隔" :code="codes.scenarios.listTemplate" />
        <DemoCode title="脚本 - 应用场景" :code="codes.scenarios.script" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" />
  </view>
</template>

<script setup lang="ts">
// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    template: `<view class="text-sm text-gray-600">这是上方的内容</view>
<wd-divider />
<view class="text-sm text-gray-600">这是下方的内容</view>`,

    script: `// 分割线组件无需额外逻辑，直接在模板中使用即可
// 最简单的用法就是在需要分隔的内容之间放置 <wd-divider />`,
  },

  // 带文本分割线代码
  text: {
    template: `<view class="text-sm text-gray-600">这是第一段内容</view>
<wd-divider>分割文本</wd-divider>
<view class="text-sm text-gray-600">这是第二段内容</view>

<wd-divider>更多内容</wd-divider>
<view class="text-sm text-gray-600">分割线可以包含描述性文字</view>`,

    script: `// 在分割线标签内放置文本内容
// 文本会显示在分割线的中间位置`,
  },

  // 自定义内容代码
  custom: {
    iconTemplate: `<wd-divider>
  <wd-icon name="arrow-down" size="20" color="#666" />
</wd-divider>`,

    multiTemplate: `<wd-divider>
  <view class="flex items-center space-x-2">
    <wd-icon name="star" size="16" color="#ffb800" />
    <text class="text-xs text-gray-500">精选内容</text>
    <wd-icon name="star" size="16" color="#ffb800" />
  </view>
</wd-divider>`,

    buttonTemplate: `<wd-divider>
  <wd-button size="small" type="text" @click="handleExpandClick">
    <wd-icon name="add" size="16" />
    <text class="ml-1">展开</text>
  </wd-button>
</wd-divider>`,

    script: `const handleExpandClick = () => {
  console.log('点击了展开按钮')
  // 这里可以添加展开/收起逻辑
}`,
  },

  // 内容位置代码
  position: {
    template: `<!-- 居中对齐（默认） -->
<wd-divider content-position="center">居中内容</wd-divider>

<!-- 左对齐 -->
<wd-divider content-position="left">左侧内容</wd-divider>

<!-- 右对齐 -->
<wd-divider content-position="right">右侧内容</wd-divider>`,

    script: `// content-position 属性支持三个值：
// - 'center': 居中对齐（默认）
// - 'left': 左对齐
// - 'right': 右对齐`,
  },

  // 线条样式代码
  style: {
    template: `<!-- 实线（默认） -->
<wd-divider>实线</wd-divider>

<!-- 虚线 -->
<wd-divider dashed>虚线</wd-divider>

<!-- 细线（默认） -->
<wd-divider :hairline="true">细线</wd-divider>

<!-- 粗线 -->
<wd-divider :hairline="false">粗线</wd-divider>

<!-- 虚线+粗线组合 -->
<wd-divider dashed :hairline="false">虚线粗线</wd-divider>`,

    script: `// 线条样式属性：
// - dashed: 是否显示为虚线
// - hairline: 是否显示为 0.5px 的细线（默认 true）`,
  },

  // 自定义颜色代码
  color: {
    template: `<!-- 不同颜色的分割线 -->
<wd-divider color="#4D80F0">蓝色分割线</wd-divider>
<wd-divider color="#16a085">绿色分割线</wd-divider>
<wd-divider color="#f39c12">橙色分割线</wd-divider>
<wd-divider color="#e74c3c">红色分割线</wd-divider>
<wd-divider color="#9b59b6" dashed>紫色虚线</wd-divider>`,

    script: `// 使用 color 属性自定义分割线和文本的颜色
// 支持任何有效的 CSS 颜色值：
// - 十六进制: #4D80F0
// - RGB: rgb(77, 128, 240)
// - 颜色名: blue`,
  },

  // 垂直分割线代码
  vertical: {
    basicTemplate: `<view class="flex items-center text-sm">
  首页
  <wd-divider vertical />
  产品
  <wd-divider vertical />
  关于我们
  <wd-divider vertical />
  联系我们
</view>`,

    styleTemplate: `<view class="flex items-center text-sm">
  文本A
  <wd-divider vertical />
  文本B
  <wd-divider vertical dashed />
  文本C
  <wd-divider vertical :hairline="false" />
  文本D
  <wd-divider vertical color="#1989fa" />
  文本E
</view>`,

    navTemplate: `<view class="flex items-center justify-center">
  <text @click="handleNavClick('home')">首页</text>
  <wd-divider vertical color="#ddd" />
  <text @click="handleNavClick('about')">关于我们</text>
</view>`,

    actionTemplate: `<view class="flex items-center justify-center">
  <wd-button size="small" type="text" @click="handleActionClick('edit')">编辑</wd-button>
  <wd-divider vertical />
  <wd-button size="small" type="text" @click="handleActionClick('copy')">复制</wd-button>
  <wd-divider vertical />
  <wd-button size="small" type="text" @click="handleActionClick('delete')">删除</wd-button>
</view>`,

    script: `// 垂直分割线事件处理
const handleNavClick = (page) => {
  console.log('导航到:', page)
  // 这里可以添加路由跳转逻辑
}

const handleActionClick = (action) => {
  console.log('执行操作:', action)
  // 这里可以添加对应的操作逻辑
}`,
  },

  // 应用场景代码
  scenarios: {
    articleTemplate: `<view class="rounded-lg bg-gray-50 p-4">
  <view class="mb-3 text-base font-medium">文章标题</view>
  <view class="text-sm text-gray-600">这里是文章的第一段内容...</view>
  <wd-divider />
  <view class="text-sm text-gray-600">这里是文章的第二段内容...</view>
  <wd-divider>核心要点</wd-divider>
  <view class="text-sm text-gray-600">这里是文章的核心要点部分...</view>
</view>`,

    formTemplate: `<view class="rounded-lg bg-gray-50 p-4">
  <view class="text-sm font-medium">基本信息</view>
  <!-- 基本信息内容 -->

  <wd-divider content-position="left">联系信息</wd-divider>
  <!-- 联系信息内容 -->

  <wd-divider content-position="left">其他信息</wd-divider>
  <!-- 其他信息内容 -->
</view>`,

    listTemplate: `<view class="rounded-lg bg-gray-50 p-4">
  <view class="flex justify-between">
    <text>商品A</text>
    <text class="text-red-500">¥199</text>
  </view>
  <wd-divider color="#f0f0f0" />

  <view class="flex justify-between">
    <text>商品B</text>
    <text class="text-red-500">¥299</text>
  </view>

  <wd-divider dashed>
    <text class="text-xs text-gray-500">总计</text>
  </wd-divider>

  <view class="flex justify-between font-medium">
    <text>合计</text>
    <text class="text-red-500">¥897</text>
  </view>
</view>`,

    script: `// 应用场景中的分割线主要用于：
// 1. 内容分组和层次划分
// 2. 视觉引导和信息分隔
// 3. 提升页面可读性和美观度`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'content-position',
    type: 'String',
    default: '"center"',
    desc: '内容位置，可选值为 left / right / center',
  },
  {
    name: 'dashed',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示为虚线',
  },
  {
    name: 'vertical',
    type: 'Boolean',
    default: 'false',
    desc: '是否为垂直分割线',
  },
  {
    name: 'hairline',
    type: 'Boolean',
    default: 'true',
    desc: '是否显示为 0.5px 的细线',
  },
  {
    name: 'color',
    type: 'String',
    default: '""',
    desc: '自定义分割线和文本的颜色',
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
 * 处理展开按钮点击事件
 */
const handleExpandClick = () => {
  console.log('点击了展开按钮')
  // 这里可以添加展开/收起逻辑
}

/**
 * 处理导航点击事件
 */
const handleNavClick = (page: string) => {
  console.log('导航到:', page)
  // 这里可以添加路由跳转逻辑
}

/**
 * 处理操作按钮点击事件
 */
const handleActionClick = (action: string) => {
  console.log('执行操作:', action)
  // 这里可以添加对应的操作逻辑
  switch (action) {
    case 'edit':
      console.log('编辑操作')
      break
    case 'copy':
      console.log('复制操作')
      break
    case 'share':
      console.log('分享操作')
      break
    case 'delete':
      console.log('删除操作')
      break
    default:
      console.log('未知操作')
  }
}
const { resetScrollTop, updateScrollTop } = useScroll()
onShow(() => {
  resetScrollTop()
})
onPageScroll((e) => {
  updateScrollTop(e.scrollTop)
})
</script>

<style lang="scss" scoped></style>
