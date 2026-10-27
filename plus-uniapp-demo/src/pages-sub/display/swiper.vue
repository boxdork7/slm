<!-- Swiper 轮播图 http://127.0.0.1:100/#/pages-sub/demo/wd/swiper -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Swiper 轮播图" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的轮播图形式，支持自动播放和指示器">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <!-- 点状指示器 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">点状指示器</view>
          <wd-swiper
            v-model:current="basicCurrent"
            :list="basicSwiperList"
            :height="200"
            autoplay
            :indicator="true"
            @click="handleBasicClick"
            @change="handleBasicChange"
          />
        </view>

        <!-- 数字指示器 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">数字指示器</view>
          <wd-swiper
            v-model:current="numberCurrent"
            :list="basicSwiperList"
            :height="200"
            autoplay
            indicator
            indicator-position="bottom-right"
            @click="handleBasicClick"
            @change="handleBasicChange"
          />
        </view>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 点状指示器" :code="codes.basic.dotsTemplate" />
        <DemoCode title="模板 - 数字指示器" :code="codes.basic.numberTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 指示器配置示例 -->
    <DemoSection title="指示器配置" desc="不同位置和样式的指示器">
      <view class="space-y-4">
        <!-- 右上角指示器 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">右上角指示器</view>
          <wd-swiper
            v-model:current="indicatorCurrent1"
            :list="basicSwiperList"
            :height="200"
            autoplay
            :indicator="true"
            indicator-position="top-right"
            @click="handleIndicatorClick"
          />
        </view>

        <!-- 左下角指示器 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">左下角指示器</view>
          <wd-swiper
            v-model:current="indicatorCurrent2"
            :list="basicSwiperList"
            :height="200"
            autoplay
            :indicator="true"
            indicator-position="bottom-left"
            @click="handleIndicatorClick"
          />
        </view>

        <!-- 自定义指示器 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">自定义指示器</view>
          <wd-swiper
            v-model:current="customIndicatorCurrent"
            :list="basicSwiperList"
            :height="200"
            autoplay
            @click="handleIndicatorClick"
          >
            <template #indicator="{ current, total }">
              <view class="custom-indicator">{{ current + 1 }} / {{ total }}</view>
            </template>
          </wd-swiper>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 位置配置" :code="codes.indicator.positionTemplate" />
        <DemoCode title="模板 - 自定义指示器" :code="codes.indicator.customTemplate" />
        <DemoCode title="脚本 - 指示器配置" :code="codes.indicator.script" />
        <DemoCode title="样式 - 自定义指示器" :code="codes.indicator.style" />
      </template>
    </DemoSection>

    <!-- 轮播方向示例 -->
    <DemoSection title="轮播方向" desc="支持水平和垂直方向的轮播">
      <view class="space-y-4">
        <!-- 水平轮播 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">水平轮播（默认）</view>
          <wd-swiper
            v-model:current="horizontalCurrent"
            :list="basicSwiperList"
            :height="200"
            direction="horizontal"
            autoplay
            :indicator="true"
            @click="handleDirectionClick"
          />
        </view>

        <!-- 垂直轮播 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">垂直轮播</view>
          <wd-swiper
            v-model:current="verticalCurrent"
            :list="basicSwiperList"
            :height="200"
            direction="vertical"
            indicator-position="right"
            autoplay
            :indicator="true"
            @click="handleDirectionClick"
          />
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 方向配置" :code="codes.direction.template" />
        <DemoCode title="脚本 - 方向配置" :code="codes.direction.script" />
      </template>
    </DemoSection>

    <!-- 手动控制示例 -->
    <DemoSection title="手动控制" desc="通过代码控制轮播的播放、暂停和跳转">
      <view class="space-y-4">
        <!-- 可控制的轮播 -->
        <view>
          <wd-swiper
            v-model:current="controlledCurrent"
            :list="basicSwiperList"
            :height="200"
            :autoplay="isAutoplay"
            :loop="isLoop"
            :indicator="true"
            @click="handleControlledClick"
            @change="handleControlledChange"
          />
        </view>

        <!-- 控制面板 -->
        <wd-cell-group>
          <wd-cell title="自动播放">
            <wd-switch v-model="isAutoplay" size="24px" />
          </wd-cell>
          <wd-cell title="循环播放">
            <wd-switch v-model="isLoop" size="24px" />
          </wd-cell>
          <wd-cell title="当前页" :value="`${controlledCurrent + 1} / ${basicSwiperList.length}`" />
        </wd-cell-group>

        <!-- 控制按钮 -->
        <view class="flex items-center justify-around px-4">
          <wd-button size="small" @click="handlePrev">上一页</wd-button>
          <wd-button size="small" type="warning" @click="handleToggleAutoplay">
            {{ isAutoplay ? '暂停' : '播放' }}
          </wd-button>
          <wd-button size="small" @click="handleNext">下一页</wd-button>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 手动控制" :code="codes.control.template" />
        <DemoCode title="脚本 - 手动控制" :code="codes.control.script" />
      </template>
    </DemoSection>

    <!-- 卡片样式示例 -->
    <DemoSection title="卡片样式" desc="展示部分内容，营造层次感和预览效果">
      <view class="space-y-4">
        <!-- 卡片模式 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">卡片模式</view>
          <view class="card-swiper">
            <wd-swiper
              v-model:current="cardCurrent"
              :list="basicSwiperList"
              :height="180"
              autoplay
              :indicator="true"
              custom-indicator-class="custom-indicator-class"
              custom-image-class="custom-image"
              custom-prev-image-class="custom-image-prev"
              custom-next-image-class="custom-image-prev"
              previous-margin="32px"
              next-margin="32px"
              @click="handleCardClick"
            />
          </view>
        </view>

        <!-- 多卡片展示 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">同时展示2个滑块</view>
          <view class="multi-card-swiper">
            <wd-swiper
              v-model:current="multiCardCurrent"
              :list="basicSwiperList"
              :height="160"
              :display-multiple-items="2"
              autoplay
              :indicator="true"
              custom-indicator-class="custom-indicator-class"
              custom-image-class="custom-multi-image"
              previous-margin="24px"
              next-margin="24px"
              @click="handleMultiCardClick"
            />
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 卡片样式" :code="codes.card.template" />
        <DemoCode title="模板 - 多卡片展示" :code="codes.card.multiTemplate" />
        <DemoCode title="脚本 - 卡片样式" :code="codes.card.script" />
        <DemoCode title="样式 - 卡片样式" :code="codes.card.style" />
      </template>
    </DemoSection>

    <!-- 视频轮播示例 -->
    <!-- #ifdef MP-WEIXIN || H5 || MP-DINGTALK -->
    <DemoSection
      title="视频轮播"
      desc="支持视频资源的轮播播放（仅支持微信小程序、H5、钉钉小程序）"
    >
      <view class="space-y-4">
        <!-- 自动播放视频 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">自动播放视频</view>
          <wd-swiper
            v-model:current="videoCurrent1"
            :list="videoList"
            :height="200"
            autoplay
            :autoplay-video="true"
            :indicator="true"
            indicator-position="top-right"
            @click="handleVideoClick"
            @change="handleVideoChange"
          />
        </view>

        <!-- 手动播放视频 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">手动播放视频</view>
          <wd-swiper
            v-model:current="videoCurrent2"
            :list="videoList"
            :height="200"
            autoplay
            :autoplay-video="false"
            :indicator="true"
            indicator-position="top-right"
            @click="handleVideoClick"
          />
        </view>

        <!-- 播放时停止轮播 -->
        <view>
          <view class="mb-2 text-sm text-gray-600">播放视频时停止轮播</view>
          <wd-swiper
            v-model:current="videoCurrent3"
            :list="videoList"
            :height="200"
            autoplay
            :autoplay-video="false"
            stop-autoplay-when-video-play
            :indicator="true"
            indicator-position="top-right"
            @click="handleVideoClick"
          />
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 视频轮播" :code="codes.video.template" />
        <DemoCode title="脚本 - 视频轮播" :code="codes.video.script" />
      </template>
    </DemoSection>
    <!-- #endif -->

    <!-- 自定义数据结构示例 -->
    <DemoSection title="自定义数据结构" desc="使用自定义字段名的数据结构">
      <view class="space-y-4">
        <!-- 自定义字段 -->
        <view>
          <wd-swiper
            v-model:current="customCurrent"
            :list="customSwiperList"
            :height="200"
            value-key="url"
            text-key="title"
            autoplay
            :indicator="true"
            @click="handleCustomClick"
          />
        </view>

        <!-- 数据展示 -->
        <wd-cell-group>
          <wd-cell title="当前项目" :value="customSwiperList[customCurrent]?.title || ''" />
          <wd-cell
            title="数据结构"
            :value="JSON.stringify(customSwiperList[0], null, 2)"
            vertical
          />
        </wd-cell-group>
      </view>

      <template #codes>
        <DemoCode title="模板 - 自定义字段" :code="codes.custom.template" />
        <DemoCode title="脚本 - 自定义字段" :code="codes.custom.script" />
      </template>
    </DemoSection>

    <!-- 事件监听示例 -->
    <DemoSection title="事件监听" desc="监听轮播的各种事件">
      <view class="space-y-4">
        <!-- 事件监听轮播 -->
        <view>
          <wd-swiper
            v-model:current="eventCurrent"
            :list="basicSwiperList"
            :height="180"
            autoplay
            :indicator="true"
            @click="handleEventClick"
            @change="handleEventChange"
            @animationfinish="handleAnimationFinish"
          />
        </view>

        <!-- 事件日志 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm font-medium">事件日志</view>
          <view class="h-32 overflow-y-auto border rounded bg-white p-2">
            <view
              v-for="(log, index) in eventLogs"
              :key="index"
              class="mb-1 text-xs"
              :class="getLogColor(log.type)"
            >
              <text class="text-gray-400">[{{ log.time }}]</text>
              {{ log.message }}
            </view>
            <view v-if="eventLogs.length === 0" class="py-4 text-center text-gray-400">
              暂无事件日志
            </view>
          </view>
          <view class="mt-2">
            <wd-button size="small" @click="clearEventLogs">清空日志</wd-button>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 事件监听" :code="codes.events.template" />
        <DemoCode title="脚本 - 事件监听" :code="codes.events.script" />
      </template>
    </DemoSection>

    <!-- 实际应用场景 -->
    <DemoSection title="实际应用场景" desc="常见的业务场景示例">
      <view class="space-y-4">
        <!-- 商品轮播 -->
        <view>
          <view class="mb-3 text-sm text-gray-700 font-medium">商品展示轮播</view>
          <view class="rounded-lg bg-white p-4">
            <wd-swiper
              v-model:current="productCurrent"
              :list="productList"
              :height="200"
              value-key="image"
              text-key="name"
              autoplay
              :indicator="true"
              @click="handleProductClick"
            />
            <view class="mt-3 text-center">
              <view class="text-base font-medium">{{ productList[productCurrent]?.name }}</view>
              <view class="text-sm text-red-500">{{ productList[productCurrent]?.price }}</view>
            </view>
          </view>
        </view>

        <!-- 新闻轮播 -->
        <view>
          <view class="mb-3 text-sm text-gray-700 font-medium">新闻资讯轮播</view>
          <view class="rounded-lg bg-white p-4">
            <wd-swiper
              v-model:current="newsCurrent"
              :list="newsList"
              :height="160"
              value-key="cover"
              text-key="title"
              :autoplay="false"
              :indicator="true"
              custom-text-class="news-title"
              @click="handleNewsClick"
            />
          </view>
        </view>

        <!-- 活动Banner -->
        <view>
          <view class="mb-3 text-sm text-gray-700 font-medium">活动Banner</view>
          <wd-swiper
            v-model:current="bannerCurrent"
            :list="bannerList"
            :height="120"
            value-key="image"
            autoplay
            :indicator="true"
            custom-image-class="banner-image"
            @click="handleBannerClick"
          />
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 商品轮播" :code="codes.scenarios.productTemplate" />
        <DemoCode title="脚本 - 商品轮播" :code="codes.scenarios.productScript" />
        <DemoCode title="模板 - 新闻轮播" :code="codes.scenarios.newsTemplate" />
        <DemoCode title="脚本 - 新闻轮播" :code="codes.scenarios.newsScript" />
        <DemoCode title="样式 - 场景样式" :code="codes.scenarios.style" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// ===== 组件状态管理 =====

// 基本轮播状态
const basicCurrent = ref<number>(0)
const numberCurrent = ref<number>(0)

// 指示器相关状态
const indicatorCurrent1 = ref<number>(0)
const indicatorCurrent2 = ref<number>(0)
const customIndicatorCurrent = ref<number>(0)

// 方向控制状态
const horizontalCurrent = ref<number>(0)
const verticalCurrent = ref<number>(0)

// 手动控制状态
const controlledCurrent = ref<number>(0)
const isAutoplay = ref<boolean>(true)
const isLoop = ref<boolean>(true)

// 卡片样式状态
const cardCurrent = ref<number>(0)
const multiCardCurrent = ref<number>(0)

// 视频轮播状态
const videoCurrent1 = ref<number>(0)
const videoCurrent2 = ref<number>(0)
const videoCurrent3 = ref<number>(0)

// 自定义数据状态
const customCurrent = ref<number>(0)

// 事件监听状态
const eventCurrent = ref<number>(0)

// 应用场景状态
const productCurrent = ref<number>(0)
const newsCurrent = ref<number>(0)
const bannerCurrent = ref<number>(0)

// 事件日志状态
interface EventLog {
  time: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

const eventLogs = ref<EventLog[]>([])

// ===== 数据定义 =====

// 基本轮播图片列表
const basicSwiperList = ref<string[]>([
  'https://registry.npmmirror.com/wot-design-uni-assets/*/files/redpanda.jpg',
  'https://registry.npmmirror.com/wot-design-uni-assets/*/files/capybara.jpg',
  'https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg',
  'https://registry.npmmirror.com/wot-design-uni-assets/*/files/moon.jpg',
  'https://registry.npmmirror.com/wot-design-uni-assets/*/files/meng.jpg',
])

// 自定义数据结构列表
const customSwiperList = ref([
  {
    url: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/redpanda.jpg',
    title: '小熊猫',
  },
  {
    url: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/capybara.jpg',
    title: '卡皮巴拉',
  },
  {
    url: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg',
    title: '大熊猫',
  },
  {
    url: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/moon.jpg',
    title: '诗画中国',
  },
])

// 视频列表
const videoList = ref<string[]>([
  'https://unpkg.com/wot-design-uni-assets@1.0.3/VID_115503.mp4',
  'https://unpkg.com/wot-design-uni-assets@1.0.3/VID_150752.mp4',
  'https://unpkg.com/wot-design-uni-assets@1.0.3/VID_155516.mp4',
  'https://registry.npmmirror.com/wot-design-uni-assets/*/files/moon.jpg',
])

// 商品列表
const productList = ref([
  {
    image: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/redpanda.jpg',
    name: '精美小熊猫手办',
    price: '￥299.00',
  },
  {
    image: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/capybara.jpg',
    name: '卡皮巴拉玩偶',
    price: '￥199.00',
  },
  {
    image: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg',
    name: '大熊猫周边',
    price: '￥399.00',
  },
])

// 新闻列表
const newsList = ref([
  {
    cover: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/moon.jpg',
    title: '诗画中国：传统文化的现代传承',
    summary: '探索中华文化的深厚底蕴',
  },
  {
    cover: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/meng.jpg',
    title: '科技创新推动社会发展',
    summary: '新技术如何改变我们的生活',
  },
])

// Banner列表
const bannerList = ref([
  {
    image: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/redpanda.jpg',
    link: '/activity1',
  },
  {
    image: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/capybara.jpg',
    link: '/activity2',
  },
  {
    image: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg',
    link: '/activity3',
  },
])

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    dotsTemplate: `<wd-swiper
  v-model:current="basicCurrent"
  :list="basicSwiperList"
  :height="200"
  autoplay
  :indicator="true"
  @click="handleBasicClick"
  @change="handleBasicChange"
/>`,

    numberTemplate: `<wd-swiper
  v-model:current="numberCurrent"
  :list="basicSwiperList"
  :height="200"
  autoplay
  :indicator="{ type: 'fraction' }"
  indicator-position="bottom-right"
  @click="handleBasicClick"
  @change="handleBasicChange"
/>`,

    script: `import { ref } from 'vue'

const basicCurrent = ref(0)
const basicSwiperList = ref([
  'https://example.com/image1.jpg',
  'https://example.com/image2.jpg',
  'https://example.com/image3.jpg'
])

const handleBasicClick = ({ index, item }) => {
  console.log('点击轮播图:', index, item)
}

const handleBasicChange = ({ current, source }) => {
  console.log('轮播切换:', current, source)
}`,
  },

  // 指示器配置代码
  indicator: {
    positionTemplate: `<!-- 右上角指示器 -->
<wd-swiper
  :list="basicSwiperList"
  :indicator="true"
  indicator-position="top-right"
/>

<!-- 左下角指示器 -->
<wd-swiper
  :list="basicSwiperList"
  :indicator="true"
  indicator-position="bottom-left"
/>`,

    customTemplate: `<wd-swiper :list="basicSwiperList">
  <template #indicator="{ current, total }">
    <view class="custom-indicator">
      {{ current + 1 }} / {{ total }}
    </view>
  </template>
</wd-swiper>`,

    script: `const indicatorCurrent1 = ref(0)
const indicatorCurrent2 = ref(0)
const customIndicatorCurrent = ref(0)

const handleIndicatorClick = ({ index, item }) => {
  console.log('指示器轮播点击:', index, item)
}`,

    style: `.custom-indicator {
  position: absolute;
  bottom: 16px;
  right: 16px;
  padding: 4px 12px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 12px;
  font-size: 12px;
}`,
  },

  // 方向配置代码
  direction: {
    template: `<!-- 水平轮播 -->
<wd-swiper
  :list="basicSwiperList"
  direction="horizontal"
  :indicator="true"
/>

<!-- 垂直轮播 -->
<wd-swiper
  :list="basicSwiperList"
  direction="vertical"
  indicator-position="right"
  :indicator="true"
/>`,

    script: `const horizontalCurrent = ref(0)
const verticalCurrent = ref(0)

const handleDirectionClick = ({ index, item }) => {
  console.log('方向轮播点击:', index, item)
}`,
  },

  // 手动控制代码
  control: {
    template: `<wd-swiper
  v-model:current="controlledCurrent"
  :list="basicSwiperList"
  :autoplay="isAutoplay"
  :loop="isLoop"
  :indicator="true"
/>

<!-- 控制面板 -->
<wd-cell-group>
  <wd-cell title="自动播放">
    <wd-switch v-model="isAutoplay" />
  </wd-cell>
  <wd-cell title="循环播放">
    <wd-switch v-model="isLoop" />
  </wd-cell>
</wd-cell-group>

<!-- 控制按钮 -->
<wd-button @click="handlePrev">上一页</wd-button>
<wd-button @click="handleNext">下一页</wd-button>`,

    script: `const controlledCurrent = ref(0)
const isAutoplay = ref(true)
const isLoop = ref(true)

const handlePrev = () => {
  controlledCurrent.value = Math.max(0, controlledCurrent.value - 1)
}

const handleNext = () => {
  controlledCurrent.value = Math.min(
    basicSwiperList.value.length - 1,
    controlledCurrent.value + 1
  )
}

const handleToggleAutoplay = () => {
  isAutoplay.value = !isAutoplay.value
}`,
  },

  // 卡片样式代码
  card: {
    template: `<view class="card-swiper">
  <wd-swiper
    :list="basicSwiperList"
    :height="180"
    custom-indicator-class="custom-indicator-class"
    custom-image-class="custom-image"
    custom-prev-image-class="custom-image-prev"
    custom-next-image-class="custom-image-prev"
    previous-margin="32px"
    next-margin="32px"
  />
</view>`,

    multiTemplate: `<view class="multi-card-swiper">
  <wd-swiper
    :list="basicSwiperList"
    :display-multiple-items="2"
    custom-image-class="custom-multi-image"
    previous-margin="24px"
    next-margin="24px"
  />
</view>`,

    script: `const cardCurrent = ref(0)
const multiCardCurrent = ref(0)

const handleCardClick = ({ index, item }) => {
  console.log('卡片轮播点击:', index, item)
}

const handleMultiCardClick = ({ index, item }) => {
  console.log('多卡片轮播点击:', index, item)
}`,

    style: `/* 卡片样式轮播 */
.card-swiper {
  --wot-swiper-radius: 0;
  --wot-swiper-item-padding: 0 24rpx;
  --wot-swiper-nav-dot-color: #e7e7e7;
  --wot-swiper-nav-dot-active-color: #4d80f0;
}

.card-swiper :deep(.custom-indicator-class) {
  bottom: -16px;
}

.card-swiper :deep(.custom-image) {
  border-radius: 12rpx;
}

.card-swiper :deep(.custom-image-prev) {
  height: 168px !important;
}

/* 多卡片样式 */
.multi-card-swiper :deep(.custom-multi-image) {
  border-radius: 8rpx;
  margin: 0 8rpx;
}`,
  },

  // 视频轮播代码
  video: {
    template: `<!-- 自动播放视频 -->
<wd-swiper
  :list="videoList"
  :autoplay-video="true"
  :indicator="true"
  indicator-position="top-right"
/>

<!-- 手动播放视频 -->
<wd-swiper
  :list="videoList"
  :autoplay-video="false"
  :indicator="true"
/>

<!-- 播放时停止轮播 -->
<wd-swiper
  :list="videoList"
  :autoplay-video="false"
  stop-autoplay-when-video-play
  :indicator="true"
/>`,

    script: `const videoList = ref([
  'https://example.com/video1.mp4',
  'https://example.com/video2.mp4',
  'https://example.com/video3.mp4',
  'https://example.com/image.jpg' // 混合图片和视频
])

const handleVideoClick = ({ index, item }) => {
  console.log('视频轮播点击:', index, item)
}

const handleVideoChange = ({ current, source }) => {
  console.log('视频轮播切换:', current, source)
}`,
  },

  // 自定义数据代码
  custom: {
    template: `<wd-swiper
  v-model:current="customCurrent"
  :list="customSwiperList"
  value-key="url"
  text-key="title"
  :indicator="true"
  @click="handleCustomClick"
/>`,

    script: `const customSwiperList = ref([
  {
    url: 'https://example.com/image1.jpg',
    title: '标题1'
  },
  {
    url: 'https://example.com/image2.jpg',
    title: '标题2'
  },
  {
    url: 'https://example.com/image3.jpg',
    title: '标题3'
  }
])

const handleCustomClick = ({ index, item }) => {
  console.log('自定义数据轮播点击:', index, item)
}`,
  },

  // 事件监听代码
  events: {
    template: `<wd-swiper
  v-model:current="eventCurrent"
  :list="basicSwiperList"
  @click="handleEventClick"
  @change="handleEventChange"
  @animationfinish="handleAnimationFinish"
/>`,

    script: `interface EventLog {
  time: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

const eventLogs = ref<EventLog[]>([])

const addEventLog = (message: string, type: EventLog['type'] = 'info') => {
  eventLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
    type
  })
  // 限制日志数量
  if (eventLogs.value.length > 20) {
    eventLogs.value = eventLogs.value.slice(0, 20)
  }
}

const handleEventClick = ({ index, item }) => {
  addEventLog(\`点击轮播图 - 索引: \${index}\`, 'success')
}

const handleEventChange = ({ current, source }) => {
  addEventLog(\`轮播切换 - 当前: \${current}, 来源: \${source}\`, 'info')
}

const handleAnimationFinish = ({ current, source }) => {
  addEventLog(\`动画完成 - 当前: \${current}, 来源: \${source}\`, 'warning')
}

const clearEventLogs = () => {
  eventLogs.value = []
  addEventLog('事件日志已清空', 'info')
}`,
  },

  // 应用场景代码
  scenarios: {
    productTemplate: `<!-- 商品展示轮播 -->
<wd-swiper
  v-model:current="productCurrent"
  :list="productList"
  value-key="image"
  text-key="name"
  @click="handleProductClick"
/>
<view class="mt-3 text-center">
  <view class="text-base font-medium">{{ productList[productCurrent]?.name }}</view>
  <view class="text-sm text-red-500">{{ productList[productCurrent]?.price }}</view>
</view>`,

    productScript: `const productList = ref([
  {
    image: 'https://example.com/product1.jpg',
    name: '精美小熊猫手办',
    price: '￥299.00'
  },
  {
    image: 'https://example.com/product2.jpg',
    name: '卡皮巴拉玩偶',
    price: '￥199.00'
  }
])

const handleProductClick = ({ index, item }) => {
  console.log('商品点击:', item.name, item.price)
  // 跳转到商品详情
}`,

    newsTemplate: `<!-- 新闻资讯轮播 -->
<wd-swiper
  v-model:current="newsCurrent"
  :list="newsList"
  value-key="cover"
  text-key="title"
  custom-text-class="news-title"
  @click="handleNewsClick"
/>`,

    newsScript: `const newsList = ref([
  {
    cover: 'https://example.com/news1.jpg',
    title: '诗画中国：传统文化的现代传承',
    summary: '探索中华文化的深厚底蕴'
  },
  {
    cover: 'https://example.com/news2.jpg',
    title: '科技创新推动社会发展',
    summary: '新技术如何改变我们的生活'
  }
])

const handleNewsClick = ({ index, item }) => {
  console.log('新闻点击:', item.title)
  // 跳转到新闻详情
}`,

    style: `.news-title {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  padding: 20px 16px 16px;
  font-size: 14px;
  line-height: 1.4;
}

.banner-image {
  border-radius: 8px;
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'list',
    type: 'Array<string | object>',
    default: '[]',
    desc: '轮播数据列表，可以是字符串数组或对象数组',
  },
  {
    name: 'current',
    type: 'Number',
    default: '0',
    desc: '当前轮播在哪一项（下标）',
  },
  {
    name: 'autoplay',
    type: 'Boolean',
    default: 'true',
    desc: '是否自动播放轮播图',
  },
  {
    name: 'interval',
    type: 'Number',
    default: '5000',
    desc: '轮播间隔时间，单位毫秒',
  },
  {
    name: 'duration',
    type: 'Number',
    default: '300',
    desc: '滑动动画时长，单位毫秒',
  },
  {
    name: 'height',
    type: 'Number | String',
    default: '350',
    desc: '轮播的高度',
  },
  {
    name: 'direction',
    type: 'String',
    default: '"horizontal"',
    desc: '轮播滑动方向，可选值：horizontal / vertical',
  },
  {
    name: 'loop',
    type: 'Boolean',
    default: 'true',
    desc: '是否循环播放轮播图',
  },
  {
    name: 'indicator',
    type: 'Boolean | Object',
    default: 'true',
    desc: '是否显示指示器，或指示器配置对象',
  },
  {
    name: 'indicator-position',
    type: 'String',
    default: '"bottom"',
    desc: '指示器位置：left/top-left/top/top-right/bottom-left/bottom/bottom-right/right',
  },
  {
    name: 'display-multiple-items',
    type: 'Number',
    default: '1',
    desc: '同时显示的滑块数量',
  },
  {
    name: 'previous-margin',
    type: 'Number | String',
    default: '"0"',
    desc: '前边距，可用于露出前一项的一小部分',
  },
  {
    name: 'next-margin',
    type: 'Number | String',
    default: '"0"',
    desc: '后边距，可用于露出后一项的一小部分',
  },
  {
    name: 'snap-to-edge',
    type: 'Boolean',
    default: 'false',
    desc: '当swiper-item的个数大于等于2，关闭circular并且开启previous-margin或next-margin的时候，可以指定这个边距是否应用到第一个、最后一个元素',
  },
  {
    name: 'image-mode',
    type: 'String',
    default: '"aspectFill"',
    desc: '图片裁剪、缩放的模式，同image组件mode属性',
  },
  {
    name: 'value-key',
    type: 'String',
    default: '"value"',
    desc: '选项对象中，value 对应的 key',
  },
  {
    name: 'text-key',
    type: 'String',
    default: '"text"',
    desc: '选项对象中，标题 text 对应的 key',
  },
  {
    name: 'autoplay-video',
    type: 'Boolean',
    default: 'true',
    desc: '视频是否自动播放',
  },
  {
    name: 'video-loop',
    type: 'Boolean',
    default: 'true',
    desc: '视频是否循环播放',
  },
  {
    name: 'muted',
    type: 'Boolean',
    default: 'true',
    desc: '视频是否静音播放',
  },
  {
    name: 'stop-previous-video',
    type: 'Boolean',
    default: 'true',
    desc: '切换轮播项时是否停止上一个视频的播放',
  },
  {
    name: 'stop-autoplay-when-video-play',
    type: 'Boolean',
    default: 'false',
    desc: '视频播放时是否停止自动轮播',
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

// Methods 方法文档（Swiper 组件没有暴露方法）
const apiMethods: any[] = []

// Events 事件文档
const apiEvents = [
  {
    name: 'click',
    desc: '点击滑块时触发，参数为 { index: number, item: string | object }',
  },
  {
    name: 'change',
    desc: '轮播滑块切换时触发，参数为 { current: number, source: string }',
  },
  {
    name: 'animationfinish',
    desc: '滑块动画结束时触发，参数为 { current: number, source: string }',
  },
  {
    name: 'update:current',
    desc: '当前项更新时触发，参数为当前索引值',
  },
]

// ===== 工具方法 =====

/**
 * 添加事件日志
 */
const addEventLog = (message: string, type: EventLog['type'] = 'info') => {
  eventLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
    type,
  })
  // 限制日志数量
  if (eventLogs.value.length > 20) {
    eventLogs.value = eventLogs.value.slice(0, 20)
  }
}

/**
 * 清空事件日志
 */
const clearEventLogs = () => {
  eventLogs.value = []
  addEventLog('事件日志已清空', 'info')
}

/**
 * 获取日志颜色类名
 */
const getLogColor = (type: EventLog['type']) => {
  const colors = {
    info: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-orange-600',
    error: 'text-red-600',
  }
  return colors[type]
}

// ===== 事件处理方法 =====

/**
 * 基本用法点击处理
 */
const handleBasicClick = ({ index, item }: { index: number; item: any }) => {
  console.log('基本轮播点击:', index, item)
}

/**
 * 基本用法切换处理
 */
const handleBasicChange = ({ current, source }: { current: number; source: string }) => {
  console.log('基本轮播切换:', current, source)
}

/**
 * 指示器点击处理
 */
const handleIndicatorClick = ({ index, item }: { index: number; item: any }) => {
  console.log('指示器轮播点击:', index, item)
}

/**
 * 方向点击处理
 */
const handleDirectionClick = ({ index, item }: { index: number; item: any }) => {
  console.log('方向轮播点击:', index, item)
}

/**
 * 控制点击处理
 */
const handleControlledClick = ({ index, item }: { index: number; item: any }) => {
  console.log('受控轮播点击:', index, item)
}

/**
 * 控制切换处理
 */
const handleControlledChange = ({ current, source }: { current: number; source: string }) => {
  console.log('受控轮播切换:', current, source)
}

/**
 * 上一页
 */
const handlePrev = () => {
  if (isLoop.value || controlledCurrent.value > 0) {
    controlledCurrent.value = isLoop.value
      ? controlledCurrent.value === 0
        ? basicSwiperList.value.length - 1
        : controlledCurrent.value - 1
      : Math.max(0, controlledCurrent.value - 1)
  }
}

/**
 * 下一页
 */
const handleNext = () => {
  if (isLoop.value || controlledCurrent.value < basicSwiperList.value.length - 1) {
    controlledCurrent.value = isLoop.value
      ? (controlledCurrent.value + 1) % basicSwiperList.value.length
      : Math.min(basicSwiperList.value.length - 1, controlledCurrent.value + 1)
  }
}

/**
 * 切换自动播放
 */
const handleToggleAutoplay = () => {
  isAutoplay.value = !isAutoplay.value
  console.log('切换自动播放:', isAutoplay.value)
}

/**
 * 卡片点击处理
 */
const handleCardClick = ({ index, item }: { index: number; item: any }) => {
  console.log('卡片轮播点击:', index, item)
}

/**
 * 多卡片点击处理
 */
const handleMultiCardClick = ({ index, item }: { index: number; item: any }) => {
  console.log('多卡片轮播点击:', index, item)
}

/**
 * 视频点击处理
 */
const handleVideoClick = ({ index, item }: { index: number; item: any }) => {
  console.log('视频轮播点击:', index, item)
}

/**
 * 视频切换处理
 */
const handleVideoChange = ({ current, source }: { current: number; source: string }) => {
  console.log('视频轮播切换:', current, source)
}

/**
 * 自定义数据点击处理
 */
const handleCustomClick = ({ index, item }: { index: number; item: any }) => {
  console.log('自定义数据轮播点击:', index, item)
}

/**
 * 事件监听点击处理
 */
const handleEventClick = ({ index, item }: { index: number; item: any }) => {
  addEventLog(`点击轮播图 - 索引: ${index}`, 'success')
}

/**
 * 事件监听切换处理
 */
const handleEventChange = ({ current, source }: { current: number; source: string }) => {
  addEventLog(`轮播切换 - 当前: ${current}, 来源: ${source}`, 'info')
}

/**
 * 动画完成处理
 */
const handleAnimationFinish = ({ current, source }: { current: number; source: string }) => {
  addEventLog(`动画完成 - 当前: ${current}, 来源: ${source}`, 'warning')
}

/**
 * 商品点击处理
 */
const handleProductClick = ({ index, item }: { index: number; item: any }) => {
  console.log('商品点击:', item.name, item.price)
}

/**
 * 新闻点击处理
 */
const handleNewsClick = ({ index, item }: { index: number; item: any }) => {
  console.log('新闻点击:', item.title)
}

/**
 * Banner点击处理
 */
const handleBannerClick = ({ index, item }: { index: number; item: any }) => {
  console.log('Banner点击:', item.link)
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
/* 卡片样式轮播 */
.card-swiper {
  --wot-swiper-radius: 0;
  --wot-swiper-item-padding: 0 24rpx;
  --wot-swiper-nav-dot-color: #e7e7e7;
  --wot-swiper-nav-dot-active-color: #4d80f0;
}

.card-swiper :deep(.custom-indicator-class) {
  bottom: -16px;
}

/* 自定义图片圆角 */
.card-swiper :deep(.custom-image) {
  border-radius: 12rpx;
}

/* 自定义前后图片高度 */
.card-swiper :deep(.custom-image-prev) {
  height: 168px !important;
}

/* 多卡片样式 */
.multi-card-swiper :deep(.custom-multi-image) {
  border-radius: 8rpx;
  margin: 0 8rpx;
}

/* 自定义指示器样式 */
.custom-indicator {
  position: absolute;
  bottom: 16px;
  right: 16px;
  padding: 4px 12px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 12px;
  font-size: 12px;
}

/* 新闻标题样式 */
:deep(.news-title) {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  padding: 20px 16px 16px;
  font-size: 14px;
  line-height: 1.4;
}

/* Banner图片样式 */
:deep(.banner-image) {
  border-radius: 8px;
}
</style>
