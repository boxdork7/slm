<!-- Skeleton 骨架屏 http://127.0.0.1:100/#/pages-sub/demo/wd/skeleton -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Skeleton 骨架屏" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="四种基础主题的骨架屏效果">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell v-for="item in themeList" :key="item.value" :title="item.title" vertical>
          <wd-skeleton :theme="item.value" />
        </wd-cell>
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基础主题" :code="codes.basic.template" />
        <DemoCode title="脚本 - 基础主题" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 自定义布局示例 -->
    <DemoSection title="自定义布局" desc="通过 row-col 属性自定义骨架屏布局">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <!-- 宫格布局 -->
        <wd-cell title="宫格布局" vertical>
          <view class="mb-2 text-xs text-gray-500">模拟网格布局的骨架屏效果</view>
          <wd-skeleton :row-col="gridSkeleton" />
        </wd-cell>

        <!-- 头像文本组合 -->
        <wd-cell title="头像文本组合" vertical>
          <view class="mb-2 text-xs text-gray-500">圆形头像 + 文本组合</view>
          <view class="flex items-start">
            <wd-skeleton :row-col="[{ size: '48px', type: 'circle' }]" />
            <wd-skeleton
              custom-style="width: 100%; margin-left: 12px"
              :row-col="[
                { width: '60%', height: '16px' },
                { width: '80%', height: '16px' },
              ]"
            />
          </view>
        </wd-cell>

        <!-- 图片组合布局 -->
        <wd-cell title="图片组合布局" vertical>
          <view class="mb-2 text-xs text-gray-500">多种尺寸图片的组合展示</view>
          <wd-skeleton :row-col="imageGroupSkeleton" />
        </wd-cell>

        <!-- 复杂列表布局 -->
        <wd-cell title="复杂列表布局" vertical>
          <view class="mb-2 text-xs text-gray-500">社交媒体文章列表骨架屏</view>
          <view class="space-y-4">
            <view
              v-for="index in 2"
              :key="index"
              class="border-b border-gray-100 pb-4 last:border-b-0"
            >
              <!-- 用户信息区域 -->
              <view class="mb-3 flex items-start">
                <wd-skeleton :row-col="[{ size: '40px', type: 'circle' }]" />
                <view class="ml-3 flex-1">
                  <wd-skeleton :row-col="[{ width: '60%', height: '16px' }]" />
                  <wd-skeleton
                    custom-style="margin-top: 6px"
                    :row-col="[{ width: '40%', height: '12px' }]"
                  />
                </view>
                <wd-skeleton :row-col="[{ width: '20px', height: '20px' }]" />
              </view>

              <!-- 文章内容 -->
              <wd-skeleton
                :row-col="[
                  { width: '100%', height: '16px' },
                  { width: '100%', height: '16px' },
                  { width: '70%', height: '16px' },
                ]"
              />

              <!-- 文章图片 -->
              <wd-skeleton
                custom-style="margin-top: 12px"
                :row-col="[{ width: '100%', height: '120px' }]"
              />
            </view>
          </view>
        </wd-cell>
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 宫格布局" :code="codes.layout.gridTemplate" />
        <DemoCode title="模板 - 头像文本组合" :code="codes.layout.avatarTemplate" />
        <DemoCode title="模板 - 复杂列表布局" :code="codes.layout.complexTemplate" />
        <DemoCode title="脚本 - 自定义布局" :code="codes.layout.script" />
      </template>
    </DemoSection>

    <!-- 动画效果示例 -->
    <DemoSection title="动画效果" desc="骨架屏的渐变和闪烁动画效果">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <!-- 渐变动画 -->
        <wd-cell title="渐变动画" vertical>
          <view class="mb-2 text-xs text-gray-500">平滑的渐变动画效果</view>
          <wd-skeleton animation="gradient" theme="paragraph" />
        </wd-cell>

        <!-- 闪烁动画 -->
        <wd-cell title="闪烁动画" vertical>
          <view class="mb-2 text-xs text-gray-500">快速闪烁的动画效果</view>
          <view class="flex items-start">
            <wd-skeleton animation="flashed" :row-col="[{ size: '48px', type: 'circle' }]" />
            <wd-skeleton
              custom-style="width: 100%; margin-left: 12px"
              animation="flashed"
              theme="paragraph"
            />
          </view>
        </wd-cell>

        <!-- 渐变动画组合 -->
        <wd-cell title="渐变动画组合" vertical>
          <view class="mb-2 text-xs text-gray-500">复杂布局的渐变动画</view>
          <wd-skeleton animation="gradient" :row-col="cardSkeleton" />
        </wd-cell>
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 渐变动画" :code="codes.animation.gradientTemplate" />
        <DemoCode title="模板 - 闪烁动画" :code="codes.animation.flashedTemplate" />
        <DemoCode title="脚本 - 动画效果" :code="codes.animation.script" />
      </template>
    </DemoSection>

    <!-- 加载状态切换示例 -->
    <DemoSection title="加载状态切换" desc="骨架屏与真实内容的切换演示">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <!-- 切换控制区域 -->
        <view class="rounded-lg bg-blue-50 p-4">
          <view class="flex items-center justify-between">
            <view class="text-sm text-blue-600 font-medium">
              💡 切换加载状态: {{ loadingStatus }}
            </view>
            <wd-switch v-model="showSkeleton" @change="handleSkeletonToggle" />
          </view>
        </view>

        <!-- 网格内容切换 -->
        <wd-cell-group>
          <wd-cell title="网格内容切换" vertical>
            <wd-skeleton :row-col="gridSkeleton" :loading="showSkeleton">
              <wd-grid clickable>
                <wd-grid-item icon-size="32px" icon="picture" text="图片" />
                <wd-grid-item icon-size="32px" icon="video" text="视频" />
                <wd-grid-item icon-size="32px" icon="music" text="音乐" />
                <wd-grid-item icon-size="32px" icon="file" text="文件" />
                <wd-grid-item icon-size="32px" icon="folder" text="文件夹" />
              </wd-grid>
            </wd-skeleton>
          </wd-cell>

          <wd-cell title="列表内容切换" vertical>
            <wd-skeleton :row-col="listSkeleton" :loading="showSkeleton">
              <view class="space-y-2">
                <view
                  v-for="(item, index) in listData"
                  :key="index"
                  class="flex items-center rounded bg-gray-50 p-2"
                >
                  <wd-icon :name="item.icon" size="24px" class="mr-3" />
                  <view class="flex-1">
                    <view class="text-sm font-medium">{{ item.title }}</view>
                    <view class="mt-1 text-xs text-gray-500">{{ item.desc }}</view>
                  </view>
                  <wd-icon name="arrow-right" size="16px" color="#999" />
                </view>
              </view>
            </wd-skeleton>
          </wd-cell>

          <wd-cell title="卡片内容切换" vertical>
            <wd-skeleton :row-col="cardSkeleton" :loading="showSkeleton">
              <view class="border rounded-lg p-4">
                <view class="mb-3 flex items-start">
                  <image
                    src="https://img12.360buyimg.com/imagetools/jfs/t1/196430/38/4451/53730/60b5c01aE83fcad85/a8c9d87b99b12bf5.png"
                    class="mr-3 h-12 w-12 rounded-full"
                  />
                  <view class="flex-1">
                    <view class="text-sm font-medium">WotDesign Uni</view>
                    <view class="mt-1 text-xs text-gray-500">基于 Vue3 的 uni-app 组件库</view>
                  </view>
                </view>
                <view class="text-sm text-gray-700 leading-6">
                  WotDesign Uni 是一个基于 Vue3 开发的 uni-app
                  组件库，提供了丰富的基础组件和业务组件，帮助开发者快速构建跨平台应用。
                </view>
                <view class="mt-4 flex items-center justify-between">
                  <view class="flex items-center space-x-4">
                    <view class="flex items-center text-xs text-gray-500">
                      <wd-icon name="thumb-up" size="14px" class="mr-1" />
                      <text>256</text>
                    </view>
                    <view class="flex items-center text-xs text-gray-500">
                      <wd-icon name="comment" size="14px" class="mr-1" />
                      <text>42</text>
                    </view>
                  </view>
                  <wd-button size="small" type="primary">了解更多</wd-button>
                </view>
              </view>
            </wd-skeleton>
          </wd-cell>
        </wd-cell-group>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 网格内容切换" :code="codes.loading.gridTemplate" />
        <DemoCode title="模板 - 列表内容切换" :code="codes.loading.listTemplate" />
        <DemoCode title="模板 - 卡片内容切换" :code="codes.loading.cardTemplate" />
        <DemoCode title="脚本 - 加载状态切换" :code="codes.loading.script" />
      </template>
    </DemoSection>

    <!-- 电商场景示例 -->
    <DemoSection title="电商场景" desc="电商应用中常见的骨架屏布局">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <!-- 商品卡片列表 -->
        <wd-cell title="商品卡片列表" vertical>
          <view class="mb-2 text-xs text-gray-500">模拟商品列表的骨架屏效果</view>
          <view class="grid grid-cols-2 gap-3">
            <view v-for="index in 4" :key="index" class="border rounded-lg p-3">
              <!-- 商品图片 -->
              <wd-skeleton :row-col="[{ width: '100%', height: '120px' }]" />

              <!-- 商品标题 -->
              <wd-skeleton
                custom-style="margin-top: 8px"
                :row-col="[
                  { width: '100%', height: '14px' },
                  { width: '80%', height: '14px' },
                ]"
              />

              <!-- 价格信息 -->
              <view class="mt-2 flex items-center justify-between">
                <wd-skeleton :row-col="[{ width: '60px', height: '18px' }]" />
                <wd-skeleton :row-col="[{ width: '40px', height: '14px' }]" />
              </view>
            </view>
          </view>
        </wd-cell>

        <!-- 商品详情页 -->
        <wd-cell title="商品详情页" vertical>
          <view class="mb-2 text-xs text-gray-500">商品详情页面的骨架屏</view>
          <view class="space-y-4">
            <!-- 商品图片 -->
            <wd-skeleton :row-col="[{ width: '100%', height: '200px' }]" />

            <!-- 商品信息 -->
            <view>
              <wd-skeleton :row-col="[{ width: '80%', height: '20px' }]" />
              <wd-skeleton
                custom-style="margin-top: 8px"
                :row-col="[{ width: '60%', height: '16px' }]"
              />
            </view>

            <!-- 价格区域 -->
            <view class="flex items-center justify-between">
              <wd-skeleton :row-col="[{ width: '100px', height: '24px' }]" />
              <wd-skeleton :row-col="[{ width: '80px', height: '20px' }]" />
            </view>

            <!-- 规格选择 -->
            <view>
              <wd-skeleton :row-col="[{ width: '40%', height: '16px' }]" />
              <view class="mt-2 flex gap-2">
                <wd-skeleton :row-col="[{ width: '60px', height: '32px' }]" />
                <wd-skeleton :row-col="[{ width: '60px', height: '32px' }]" />
                <wd-skeleton :row-col="[{ width: '60px', height: '32px' }]" />
              </view>
            </view>
          </view>
        </wd-cell>

        <!-- 购物车列表 -->
        <wd-cell title="购物车列表" vertical>
          <view class="mb-2 text-xs text-gray-500">购物车商品列表骨架屏</view>
          <view
            v-for="index in 3"
            :key="index"
            class="flex items-start border-b border-gray-100 p-3 last:border-b-0"
          >
            <!-- 商品图片 -->
            <wd-skeleton :row-col="[{ size: '60px', type: 'rect' }]" />

            <!-- 商品信息 -->
            <view class="ml-3 flex-1">
              <wd-skeleton :row-col="[{ width: '80%', height: '16px' }]" />
              <wd-skeleton
                custom-style="margin-top: 6px"
                :row-col="[{ width: '60%', height: '14px' }]"
              />
              <view class="mt-2 flex items-center justify-between">
                <wd-skeleton :row-col="[{ width: '60px', height: '18px' }]" />
                <wd-skeleton :row-col="[{ width: '80px', height: '24px' }]" />
              </view>
            </view>
          </view>
        </wd-cell>
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 商品卡片列表" :code="codes.ecommerce.productTemplate" />
        <DemoCode title="模板 - 商品详情页" :code="codes.ecommerce.detailTemplate" />
        <DemoCode title="模板 - 购物车列表" :code="codes.ecommerce.cartTemplate" />
        <DemoCode title="脚本 - 电商场景" :code="codes.ecommerce.script" />
      </template>
    </DemoSection>

    <!-- 实际应用场景 -->
    <DemoSection title="实际应用场景" desc="常见业务场景的骨架屏应用">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <!-- 应用场景选择 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm font-medium">选择应用场景</view>
          <wd-tabs v-model="activeScenario" @change="handleScenarioChange">
            <wd-tab title="新闻列表" name="news" />
            <wd-tab title="用户动态" name="social" />
            <wd-tab title="设置页面" name="settings" />
          </wd-tabs>
        </view>

        <!-- 场景内容展示 -->
        <wd-cell-group>
          <!-- 新闻列表场景 -->
          <template v-if="activeScenario === 'news'">
            <wd-cell title="新闻列表骨架屏" vertical>
              <view
                v-for="index in 4"
                :key="index"
                class="flex items-start border-b border-gray-100 p-3 last:border-b-0"
              >
                <!-- 新闻图片 -->
                <wd-skeleton :row-col="[{ width: '80px', height: '60px', type: 'rect' }]" />

                <!-- 新闻内容 -->
                <view class="ml-3 flex-1">
                  <wd-skeleton :row-col="[{ width: '90%', height: '16px' }]" />
                  <wd-skeleton
                    custom-style="margin-top: 6px"
                    :row-col="[{ width: '100%', height: '14px' }]"
                  />
                  <wd-skeleton
                    custom-style="margin-top: 6px"
                    :row-col="[{ width: '40%', height: '12px' }]"
                  />
                </view>
              </view>
            </wd-cell>
          </template>

          <!-- 用户动态场景 -->
          <template v-if="activeScenario === 'social'">
            <wd-cell title="用户动态骨架屏" vertical>
              <view
                v-for="index in 3"
                :key="index"
                class="border-b border-gray-100 p-4 last:border-b-0"
              >
                <!-- 用户信息 -->
                <view class="mb-3 flex items-center">
                  <wd-skeleton :row-col="[{ size: '40px', type: 'circle' }]" />
                  <view class="ml-3 flex-1">
                    <wd-skeleton :row-col="[{ width: '30%', height: '16px' }]" />
                    <wd-skeleton
                      custom-style="margin-top: 4px"
                      :row-col="[{ width: '50%', height: '12px' }]"
                    />
                  </view>
                </view>

                <!-- 动态内容 -->
                <wd-skeleton
                  :row-col="[
                    { width: '100%', height: '16px' },
                    { width: '100%', height: '16px' },
                    { width: '60%', height: '16px' },
                  ]"
                />

                <!-- 动态图片 -->
                <view class="grid grid-cols-3 mt-3 gap-2">
                  <wd-skeleton :row-col="[{ width: '100%', height: '80px' }]" />
                  <wd-skeleton :row-col="[{ width: '100%', height: '80px' }]" />
                  <wd-skeleton :row-col="[{ width: '100%', height: '80px' }]" />
                </view>

                <!-- 互动区域 -->
                <view class="mt-3 flex justify-between">
                  <wd-skeleton :row-col="[{ width: '60px', height: '24px' }]" />
                  <wd-skeleton :row-col="[{ width: '60px', height: '24px' }]" />
                  <wd-skeleton :row-col="[{ width: '60px', height: '24px' }]" />
                </view>
              </view>
            </wd-cell>
          </template>

          <!-- 设置页面场景 -->
          <template v-if="activeScenario === 'settings'">
            <wd-cell title="设置页面骨架屏" vertical>
              <view class="space-y-6">
                <!-- 设置分组 -->
                <view v-for="groupIndex in 3" :key="groupIndex">
                  <!-- 分组标题 -->
                  <wd-skeleton :row-col="[{ width: '40%', height: '18px' }]" />

                  <!-- 设置项 -->
                  <view class="mt-3 space-y-3">
                    <view
                      v-for="itemIndex in 4"
                      :key="itemIndex"
                      class="flex items-center justify-between rounded bg-gray-50 p-3"
                    >
                      <view class="flex flex-1 items-center">
                        <wd-skeleton :row-col="[{ size: '20px', type: 'rect' }]" />
                        <view class="ml-3 flex-1">
                          <wd-skeleton :row-col="[{ width: '60%', height: '16px' }]" />
                          <wd-skeleton
                            custom-style="margin-top: 4px"
                            :row-col="[{ width: '80%', height: '12px' }]"
                          />
                        </view>
                      </view>
                      <wd-skeleton :row-col="[{ width: '16px', height: '16px' }]" />
                    </view>
                  </view>
                </view>
              </view>
            </wd-cell>
          </template>
        </wd-cell-group>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 新闻列表场景" :code="codes.scenarios.newsTemplate" />
        <DemoCode title="模板 - 用户动态场景" :code="codes.scenarios.socialTemplate" />
        <DemoCode title="模板 - 设置页面场景" :code="codes.scenarios.settingsTemplate" />
        <DemoCode title="脚本 - 实际应用场景" :code="codes.scenarios.script" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// ===== 组件状态管理 =====

// 基本主题状态
const showSkeleton = ref<boolean>(true)
const activeScenario = ref<string>('news')

// ===== 数据定义 =====

// 主题列表配置
const themeList = [
  { title: '头像骨架屏', value: 'avatar' },
  { title: '图片骨架屏', value: 'image' },
  { title: '文本骨架屏', value: 'text' },
  { title: '段落骨架屏', value: 'paragraph' },
] as const

// 宫格骨架屏配置
const gridSkeleton = [
  [
    { width: '48px', height: '48px' },
    { width: '48px', height: '48px' },
    { width: '48px', height: '48px' },
    { width: '48px', height: '48px' },
    { width: '48px', height: '48px' },
  ],
  [
    { width: '48px', height: '16px' },
    { width: '48px', height: '16px' },
    { width: '48px', height: '16px' },
    { width: '48px', height: '16px' },
    { width: '48px', height: '16px' },
  ],
]

// 图片组合骨架屏配置
const imageGroupSkeleton = [
  { height: '120px' }, // 大图
  1, // 默认单行
  { width: '60%' }, // 中等宽度
  [
    { width: '40%' }, // 左侧内容
    { width: '20%', marginLeft: '20px' }, // 右侧内容
  ],
]

// 卡片骨架屏配置
const cardSkeleton = [
  [
    { size: '48px', type: 'circle' },
    { width: '60%', height: '16px', marginLeft: '12px' },
  ],
  { width: '100%', height: '16px' },
  { width: '100%', height: '16px' },
  { width: '70%', height: '16px' },
  { width: '100%', height: '120px' },
]

// 列表骨架屏配置
const listSkeleton = [
  [
    { size: '32px', type: 'rect' },
    { width: '60%', height: '16px', marginLeft: '12px' },
  ],
  [
    { size: '32px', type: 'rect' },
    { width: '50%', height: '16px', marginLeft: '12px' },
  ],
  [
    { size: '32px', type: 'rect' },
    { width: '70%', height: '16px', marginLeft: '12px' },
  ],
]

// 模拟列表数据
const listData = [
  { icon: 'setting', title: '账户设置', desc: '修改个人信息和安全设置' },
  { icon: 'bell', title: '消息通知', desc: '管理推送和提醒设置' },
  { icon: 'star', title: '我的收藏', desc: '查看收藏的内容和商品' },
]

// ===== 计算属性 =====

// 加载状态描述
const loadingStatus = computed(() => {
  return showSkeleton.value ? '显示骨架屏' : '显示真实内容'
})

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    template: `<!-- 基础主题骨架屏 -->
<wd-skeleton theme="avatar" />
<wd-skeleton theme="image" />
<wd-skeleton theme="text" />
<wd-skeleton theme="paragraph" />`,

    script: `import { ref } from 'vue'

// 主题列表配置
const themeList = [
  { title: '头像骨架屏', value: 'avatar' },
  { title: '图片骨架屏', value: 'image' },
  { title: '文本骨架屏', value: 'text' },
  { title: '段落骨架屏', value: 'paragraph' }
] as const`,
  },

  // 自定义布局代码
  layout: {
    gridTemplate: `<!-- 宫格布局 -->
<wd-skeleton :row-col="gridSkeleton" />`,

    avatarTemplate: `<!-- 头像文本组合 -->
<view class="flex items-start">
  <wd-skeleton :row-col="[{ size: '48px', type: 'circle' }]" />
  <wd-skeleton
    custom-style="width: 100%; margin-left: 12px"
    :row-col="[{ width: '60%', height: '16px' }, { width: '80%', height: '16px' }]"
  />
</view>`,

    complexTemplate: `<!-- 复杂列表布局 -->
<view class="border-b border-gray-100 pb-4">
  <!-- 用户信息区域 -->
  <view class="flex items-start mb-3">
    <wd-skeleton :row-col="[{ size: '40px', type: 'circle' }]" />
    <view class="ml-3 flex-1">
      <wd-skeleton :row-col="[{ width: '60%', height: '16px' }]" />
      <wd-skeleton
        custom-style="margin-top: 6px"
        :row-col="[{ width: '40%', height: '12px' }]"
      />
    </view>
    <wd-skeleton :row-col="[{ width: '20px', height: '20px' }]" />
  </view>

  <!-- 文章内容 -->
  <wd-skeleton
    :row-col="[
      { width: '100%', height: '16px' },
      { width: '100%', height: '16px' },
      { width: '70%', height: '16px' },
    ]"
  />

  <!-- 文章图片 -->
  <wd-skeleton
    custom-style="margin-top: 12px"
    :row-col="[{ width: '100%', height: '120px' }]"
  />
</view>`,

    script: `// 自定义布局配置
const gridSkeleton = [
  [
    { width: '48px', height: '48px' },
    { width: '48px', height: '48px' },
    { width: '48px', height: '48px' },
    { width: '48px', height: '48px' },
    { width: '48px', height: '48px' }
  ],
  [
    { width: '48px', height: '16px' },
    { width: '48px', height: '16px' },
    { width: '48px', height: '16px' },
    { width: '48px', height: '16px' },
    { width: '48px', height: '16px' }
  ]
]

const imageGroupSkeleton = [
  { height: '120px' }, // 大图
  1, // 默认单行
  { width: '60%' }, // 中等宽度
  [
    { width: '40%' }, // 左侧内容
    { width: '20%', marginLeft: '20px' } // 右侧内容
  ]
]`,
  },

  // 动画效果代码
  animation: {
    gradientTemplate: `<!-- 渐变动画 -->
<wd-skeleton animation="gradient" theme="paragraph" />`,

    flashedTemplate: `<!-- 闪烁动画 -->
<view class="flex items-start">
  <wd-skeleton
    animation="flashed"
    :row-col="[{ size: '48px', type: 'circle' }]"
  />
  <wd-skeleton
    custom-style="width: 100%; margin-left: 12px"
    animation="flashed"
    theme="paragraph"
  />
</view>`,

    script: `// 动画类型
type SkeletonAnimation = 'gradient' | 'flashed'

// 卡片骨架屏配置（用于动画演示）
const cardSkeleton = [
  [
    { size: '48px', type: 'circle' },
    { width: '60%', height: '16px', marginLeft: '12px' },
  ],
  { width: '100%', height: '16px' },
  { width: '100%', height: '16px' },
  { width: '70%', height: '16px' },
  { width: '100%', height: '120px' },
]`,
  },

  // 加载状态切换代码
  loading: {
    gridTemplate: `<!-- 网格内容切换 -->
<wd-skeleton :row-col="gridSkeleton" :loading="showSkeleton">
  <wd-grid clickable>
    <wd-grid-item icon-size="32px" icon="picture" text="图片" />
    <wd-grid-item icon-size="32px" icon="video" text="视频" />
    <wd-grid-item icon-size="32px" icon="music" text="音乐" />
    <wd-grid-item icon-size="32px" icon="file" text="文件" />
    <wd-grid-item icon-size="32px" icon="folder" text="文件夹" />
  </wd-grid>
</wd-skeleton>`,

    listTemplate: `<!-- 列表内容切换 -->
<wd-skeleton :row-col="listSkeleton" :loading="showSkeleton">
  <view class="space-y-2">
    <view v-for="(item, index) in listData" :key="index" class="flex items-center p-2 rounded bg-gray-50">
      <wd-icon :name="item.icon" size="24px" class="mr-3" />
      <view class="flex-1">
        <view class="text-sm font-medium">{{ item.title }}</view>
        <view class="text-xs text-gray-500 mt-1">{{ item.desc }}</view>
      </view>
      <wd-icon name="arrow-right" size="16px" color="#999" />
    </view>
  </view>
</wd-skeleton>`,

    cardTemplate: `<!-- 卡片内容切换 -->
<wd-skeleton :row-col="cardSkeleton" :loading="showSkeleton">
  <view class="border rounded-lg p-4">
    <view class="flex items-start mb-3">
      <image
        src="https://img12.360buyimg.com/imagetools/jfs/t1/196430/38/4451/53730/60b5c01aE83fcad85/a8c9d87b99b12bf5.png"
        class="w-12 h-12 rounded-full mr-3"
      />
      <view class="flex-1">
        <view class="text-sm font-medium">WotDesign Uni</view>
        <view class="text-xs text-gray-500 mt-1">基于 Vue3 的 uni-app 组件库</view>
      </view>
    </view>
    <view class="text-sm text-gray-700 leading-6">
      WotDesign Uni 是一个基于 Vue3 开发的 uni-app 组件库，提供了丰富的基础组件和业务组件。
    </view>
  </view>
</wd-skeleton>`,

    script: `import { ref, computed } from 'vue'

// 加载状态管理
const showSkeleton = ref(true)

// 列表数据
const listData = [
  { icon: 'setting', title: '账户设置', desc: '修改个人信息和安全设置' },
  { icon: 'bell', title: '消息通知', desc: '管理推送和提醒设置' },
  { icon: 'star', title: '我的收藏', desc: '查看收藏的内容和商品' },
]

// 列表骨架屏配置
const listSkeleton = [
  [
    { size: '32px', type: 'rect' },
    { width: '60%', height: '16px', marginLeft: '12px' },
  ],
  [
    { size: '32px', type: 'rect' },
    { width: '50%', height: '16px', marginLeft: '12px' },
  ],
  [
    { size: '32px', type: 'rect' },
    { width: '70%', height: '16px', marginLeft: '12px' },
  ],
]

// 加载状态描述
const loadingStatus = computed(() => {
  return showSkeleton.value ? '显示骨架屏' : '显示真实内容'
})

// 骨架屏切换处理
const handleSkeletonToggle = ({ value }: { value: boolean | string | number }) => {
  console.log('骨架屏状态切换:', value)
}`,
  },

  // 电商场景代码
  ecommerce: {
    productTemplate: `<!-- 商品卡片列表 -->
<view class="grid grid-cols-2 gap-3">
  <view v-for="index in 4" :key="index" class="border rounded-lg p-3">
    <!-- 商品图片 -->
    <wd-skeleton :row-col="[{ width: '100%', height: '120px' }]" />

    <!-- 商品标题 -->
    <wd-skeleton
      custom-style="margin-top: 8px"
      :row-col="[
        { width: '100%', height: '14px' },
        { width: '80%', height: '14px' },
      ]"
    />

    <!-- 价格信息 -->
    <view class="mt-2 flex items-center justify-between">
      <wd-skeleton :row-col="[{ width: '60px', height: '18px' }]" />
      <wd-skeleton :row-col="[{ width: '40px', height: '14px' }]" />
    </view>
  </view>
</view>`,

    detailTemplate: `<!-- 商品详情页 -->
<view class="space-y-4">
  <!-- 商品图片 -->
  <wd-skeleton :row-col="[{ width: '100%', height: '200px' }]" />

  <!-- 商品信息 -->
  <view>
    <wd-skeleton :row-col="[{ width: '80%', height: '20px' }]" />
    <wd-skeleton
      custom-style="margin-top: 8px"
      :row-col="[{ width: '60%', height: '16px' }]"
    />
  </view>

  <!-- 价格区域 -->
  <view class="flex items-center justify-between">
    <wd-skeleton :row-col="[{ width: '100px', height: '24px' }]" />
    <wd-skeleton :row-col="[{ width: '80px', height: '20px' }]" />
  </view>
</view>`,

    cartTemplate: `<!-- 购物车列表 -->
<view v-for="index in 3" :key="index" class="flex items-start p-3 border-b border-gray-100">
  <!-- 商品图片 -->
  <wd-skeleton :row-col="[{ size: '60px', type: 'rect' }]" />

  <!-- 商品信息 -->
  <view class="ml-3 flex-1">
    <wd-skeleton :row-col="[{ width: '80%', height: '16px' }]" />
    <wd-skeleton
      custom-style="margin-top: 6px"
      :row-col="[{ width: '60%', height: '14px' }]"
    />
    <view class="mt-2 flex items-center justify-between">
      <wd-skeleton :row-col="[{ width: '60px', height: '18px' }]" />
      <wd-skeleton :row-col="[{ width: '80px', height: '24px' }]" />
    </view>
  </view>
</view>`,

    script: `// 电商场景骨架屏配置
const productCardSkeleton = [
  { width: '100%', height: '120px' }, // 商品图片
  { width: '100%', height: '14px' },  // 商品标题行1
  { width: '80%', height: '14px' },   // 商品标题行2
  [
    { width: '60px', height: '18px' }, // 价格
    { width: '40px', height: '14px' }  // 原价
  ]
]

const productDetailSkeleton = [
  { width: '100%', height: '200px' }, // 商品图片
  { width: '80%', height: '20px' },   // 商品标题
  { width: '60%', height: '16px' },   // 商品副标题
  [
    { width: '100px', height: '24px' }, // 当前价格
    { width: '80px', height: '20px' }   // 原价/销量
  ]
]`,
  },

  // 实际应用场景代码
  scenarios: {
    newsTemplate: `<!-- 新闻列表场景 -->
<view v-for="index in 4" :key="index" class="flex items-start p-3 border-b border-gray-100">
  <!-- 新闻图片 -->
  <wd-skeleton :row-col="[{ width: '80px', height: '60px', type: 'rect' }]" />

  <!-- 新闻内容 -->
  <view class="ml-3 flex-1">
    <wd-skeleton :row-col="[{ width: '90%', height: '16px' }]" />
    <wd-skeleton
      custom-style="margin-top: 6px"
      :row-col="[{ width: '100%', height: '14px' }]"
    />
    <wd-skeleton
      custom-style="margin-top: 6px"
      :row-col="[{ width: '40%', height: '12px' }]"
    />
  </view>
</view>`,

    socialTemplate: `<!-- 用户动态场景 -->
<view class="p-4 border-b border-gray-100">
  <!-- 用户信息 -->
  <view class="flex items-center mb-3">
    <wd-skeleton :row-col="[{ size: '40px', type: 'circle' }]" />
    <view class="ml-3 flex-1">
      <wd-skeleton :row-col="[{ width: '30%', height: '16px' }]" />
      <wd-skeleton
        custom-style="margin-top: 4px"
        :row-col="[{ width: '50%', height: '12px' }]"
      />
    </view>
  </view>

  <!-- 动态内容 -->
  <wd-skeleton
    :row-col="[
      { width: '100%', height: '16px' },
      { width: '100%', height: '16px' },
      { width: '60%', height: '16px' },
    ]"
  />

  <!-- 动态图片 -->
  <view class="mt-3 grid grid-cols-3 gap-2">
    <wd-skeleton :row-col="[{ width: '100%', height: '80px' }]" />
    <wd-skeleton :row-col="[{ width: '100%', height: '80px' }]" />
    <wd-skeleton :row-col="[{ width: '100%', height: '80px' }]" />
  </view>
</view>`,

    settingsTemplate: `<!-- 设置页面场景 -->
<view class="space-y-6">
  <view v-for="groupIndex in 3" :key="groupIndex">
    <!-- 分组标题 -->
    <wd-skeleton :row-col="[{ width: '40%', height: '18px' }]" />

    <!-- 设置项 -->
    <view class="mt-3 space-y-3">
      <view v-for="itemIndex in 4" :key="itemIndex" class="flex items-center justify-between p-3 bg-gray-50 rounded">
        <view class="flex items-center flex-1">
          <wd-skeleton :row-col="[{ size: '20px', type: 'rect' }]" />
          <view class="ml-3 flex-1">
            <wd-skeleton :row-col="[{ width: '60%', height: '16px' }]" />
            <wd-skeleton
              custom-style="margin-top: 4px"
              :row-col="[{ width: '80%', height: '12px' }]"
            />
          </view>
        </view>
        <wd-skeleton :row-col="[{ width: '16px', height: '16px' }]" />
      </view>
    </view>
  </view>
</view>`,

    script: `import { ref } from 'vue'

// 应用场景状态
const activeScenario = ref('news')

// 场景切换处理
const handleScenarioChange = ({ name }) => {
  activeScenario.value = name
  console.log('切换到场景：', name)
}

// 新闻列表骨架屏配置
const newsSkeleton = [
  [
    { width: '80px', height: '60px', type: 'rect' },
    { width: '90%', height: '16px', marginLeft: '12px' }
  ],
  { width: '100%', height: '14px' },
  { width: '40%', height: '12px' }
]

// 用户动态骨架屏配置
const socialSkeleton = [
  [
    { size: '40px', type: 'circle' },
    { width: '30%', height: '16px', marginLeft: '12px' }
  ],
  { width: '100%', height: '16px' },
  { width: '100%', height: '16px' },
  { width: '60%', height: '16px' },
  [
    { width: '30%', height: '80px' },
    { width: '30%', height: '80px' },
    { width: '30%', height: '80px' }
  ]
]`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'theme',
    type: 'String',
    default: '"text"',
    desc: '骨架图风格，可选值：text / avatar / paragraph / image',
  },
  {
    name: 'row-col',
    type: 'Array',
    default: '[]',
    desc: '用于设置行列数量、宽度高度、间距等的配置数组',
  },
  {
    name: 'loading',
    type: 'Boolean',
    default: 'true',
    desc: '是否为加载状态，如果是则显示骨架图，如果不是则显示加载完成的内容',
  },
  {
    name: 'animation',
    type: 'String',
    default: '""',
    desc: '动画效果，可选值：gradient / flashed，值为空则表示没有动画',
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

// Events 事件文档（Skeleton 组件没有事件）
const apiEvents: any[] = []

// ===== 事件处理方法 =====

/**
 * 骨架屏切换处理
 */
const handleSkeletonToggle = ({ value }: { value: boolean | string | number }) => {
  console.log('骨架屏状态切换:', value)
}

/**
 * 场景切换处理
 */
const handleScenarioChange = ({ name }: { name: string | number }) => {
  activeScenario.value = name as string
  console.log('切换到场景：', name)
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
// 自定义样式
.grid {
  display: grid;
}

.grid-cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid-cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}
</style>
