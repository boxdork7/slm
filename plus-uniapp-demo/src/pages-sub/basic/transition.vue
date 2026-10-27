<!-- Transition 过渡动画 http://127.0.0.1:100/#/pages-sub/demo/wd/transition -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Transition 过渡动画" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="内置的过渡动画效果">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="fade 淡入淡出动画" vertical>
          <view class="flex flex-wrap gap-2">
            <wd-button size="small" @click="handleFade">fade</wd-button>
            <wd-button size="small" @click="handleFadeUp">fade-up</wd-button>
            <wd-button size="small" @click="handleFadeDown">fade-down</wd-button>
            <wd-button size="small" @click="handleFadeLeft">fade-left</wd-button>
            <wd-button size="small" @click="handleFadeRight">fade-right</wd-button>
          </view>
        </wd-cell>

        <wd-cell title="slide 滑动动画" vertical>
          <view class="flex flex-wrap gap-2">
            <wd-button size="small" @click="handleSlideUp">slide-up</wd-button>
            <wd-button size="small" @click="handleSlideDown">slide-down</wd-button>
            <wd-button size="small" @click="handleSlideLeft">slide-left</wd-button>
            <wd-button size="small" @click="handleSlideRight">slide-right</wd-button>
          </view>
        </wd-cell>

        <wd-cell title="zoom 缩放动画" vertical>
          <view class="flex flex-wrap gap-2">
            <wd-button size="small" @click="handleZoomIn">zoom-in</wd-button>
            <wd-button size="small" @click="handleZoomOut">zoom-out</wd-button>
          </view>
        </wd-cell>
      </wd-cell-group>

      <!-- 基础过渡动画块 -->
      <wd-transition :show="basicShow" :name="basicName" custom-class="demo-block" />

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - Fade 动画" :code="codes.basic.fadeTemplate" />
        <DemoCode title="模板 - Slide 动画" :code="codes.basic.slideTemplate" />
        <DemoCode title="模板 - Zoom 动画" :code="codes.basic.zoomTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 自定义动画示例 -->
    <DemoSection title="自定义动画" desc="使用自定义类名实现复杂的过渡效果">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="自定义动画效果">
          <wd-button @click="handleCustom">自定义动画</wd-button>
        </wd-cell>
      </wd-cell-group>

      <!-- 自定义过渡动画块 -->
      <wd-transition
        :show="customShow"
        :duration="{ enter: 700, leave: 1000 }"
        enter-class="custom-enter"
        enter-active-class="custom-enter-active"
        enter-to-class="custom-enter-to"
        leave-class="custom-leave"
        leave-active-class="custom-leave-active"
        leave-to-class="custom-leave-to"
        custom-class="demo-block custom-demo-block"
      />

      <template #codes>
        <DemoCode title="模板 - 自定义动画" :code="codes.custom.template" />
        <DemoCode title="样式 - 自定义动画" :code="codes.custom.style" />
        <DemoCode title="脚本 - 自定义动画" :code="codes.custom.script" />
      </template>
    </DemoSection>

    <!-- 生命周期事件示例 -->
    <DemoSection title="生命周期事件" desc="监听过渡动画的各个生命周期阶段">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <!-- 控制按钮 -->
        <wd-cell-group>
          <wd-cell title="事件监听动画">
            <wd-button @click="handleEventAnimation">触发事件动画</wd-button>
          </wd-cell>
        </wd-cell-group>

        <!-- 事件日志显示 -->
        <view class="mx-4 rounded-lg bg-gray-50 p-4">
          <view class="mb-2 text-sm font-medium">事件日志</view>
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

      <!-- 事件监听过渡动画块 -->
      <wd-transition
        :show="eventShow"
        name="fade-up"
        custom-class="demo-block event-demo-block"
        @before-enter="handleBeforeEnter"
        @enter="handleEnter"
        @after-enter="handleAfterEnter"
        @before-leave="handleBeforeLeave"
        @leave="handleLeave"
        @after-leave="handleAfterLeave"
        @click="handleAnimationClick"
      />

      <template #codes>
        <DemoCode title="模板 - 生命周期事件" :code="codes.lifecycle.template" />
        <DemoCode title="脚本 - 事件处理方法" :code="codes.lifecycle.script" />
      </template>
    </DemoSection>

    <!-- 高级配置示例 -->
    <DemoSection title="高级配置" desc="更多配置选项和控制方式">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="自定义动画时长">
          <wd-button @click="handleSlowAnimation">慢速动画（1000ms）</wd-button>
        </wd-cell>

        <wd-cell title="懒渲染模式">
          <wd-button @click="handleLazyRender">懒渲染动画</wd-button>
        </wd-cell>

        <wd-cell title="不销毁模式">
          <wd-button @click="handleNoDestroy">不销毁元素</wd-button>
        </wd-cell>

        <wd-cell title="组合动画">
          <wd-button @click="handleCombinedAnimation">组合动画</wd-button>
        </wd-cell>
      </wd-cell-group>

      <!-- 高级配置动画块 -->
      <wd-transition
        :show="slowShow"
        name="zoom-in"
        :duration="1000"
        custom-class="demo-block slow-demo-block"
      />

      <wd-transition
        :show="lazyShow"
        name="slide-up"
        :lazy-render="true"
        custom-class="demo-block lazy-demo-block"
      />

      <wd-transition
        :show="noDestroyShow"
        name="fade"
        :destroy="false"
        custom-class="demo-block no-destroy-demo-block"
      />

      <wd-transition
        :show="combinedShow"
        :name="['fade', 'zoom-in']"
        custom-class="demo-block combined-demo-block"
      />

      <template #codes>
        <DemoCode title="模板 - 慢速动画" :code="codes.advanced.slowTemplate" />
        <DemoCode title="模板 - 懒渲染" :code="codes.advanced.lazyTemplate" />
        <DemoCode title="模板 - 不销毁" :code="codes.advanced.noDestroyTemplate" />
        <DemoCode title="模板 - 组合动画" :code="codes.advanced.combinedTemplate" />
        <DemoCode title="脚本 - 高级配置" :code="codes.advanced.script" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import type { TransitionName } from '@/wd/components/wd-transition/wd-transition.vue'
import { ref } from 'vue'

// ===== 组件状态管理 =====

// 基本动画状态
const basicShow = ref<boolean>(false)
const basicName = ref<TransitionName>()

// 自定义动画状态
const customShow = ref<boolean>(false)

// 事件监听动画状态
const eventShow = ref<boolean>(false)

// 高级配置动画状态
const slowShow = ref<boolean>(false)
const lazyShow = ref<boolean>(false)
const noDestroyShow = ref<boolean>(false)
const combinedShow = ref<boolean>(false)

// 事件日志状态
interface EventLog {
  time: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

const eventLogs = ref<EventLog[]>([])

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    fadeTemplate: `<!-- Fade 动画系列 -->
<wd-button size="small" @click="handleFade">fade</wd-button>
<wd-button size="small" @click="handleFadeUp">fade-up</wd-button>
<wd-button size="small" @click="handleFadeDown">fade-down</wd-button>
<wd-button size="small" @click="handleFadeLeft">fade-left</wd-button>
<wd-button size="small" @click="handleFadeRight">fade-right</wd-button>

<!-- 过渡动画组件 -->
<wd-transition :show="basicShow" :name="basicName" custom-class="demo-block" />`,

    slideTemplate: `<!-- Slide 动画系列 -->
<wd-button size="small" @click="handleSlideUp">slide-up</wd-button>
<wd-button size="small" @click="handleSlideDown">slide-down</wd-button>
<wd-button size="small" @click="handleSlideLeft">slide-left</wd-button>
<wd-button size="small" @click="handleSlideRight">slide-right</wd-button>`,

    zoomTemplate: `<!-- Zoom 动画系列 -->
<wd-button size="small" @click="handleZoomIn">zoom-in</wd-button>
<wd-button size="small" @click="handleZoomOut">zoom-out</wd-button>`,

    script: `import type { TransitionName } from '@/wd/components/wd-transition/wd-transition.vue'
import { ref } from 'vue'

const basicShow = ref(false)
const basicName = ref<TransitionName>()

// 通用过渡动画触发器
const transition = (transitionName: TransitionName) => {
  basicName.value = transitionName
  basicShow.value = true
  setTimeout(() => {
    basicShow.value = false
  }, 500)
}

// Fade 动画系列
const handleFade = () => transition('fade')
const handleFadeUp = () => transition('fade-up')
const handleFadeDown = () => transition('fade-down')
const handleFadeLeft = () => transition('fade-left')
const handleFadeRight = () => transition('fade-right')

// Slide 动画系列
const handleSlideUp = () => transition('slide-up')
const handleSlideDown = () => transition('slide-down')
const handleSlideLeft = () => transition('slide-left')
const handleSlideRight = () => transition('slide-right')

// Zoom 动画系列
const handleZoomIn = () => transition('zoom-in')
const handleZoomOut = () => transition('zoom-out')`,
  },

  // 自定义动画代码
  custom: {
    template: `<wd-transition
  :show="customShow"
  :duration="{ enter: 700, leave: 1000 }"
  enter-class="custom-enter"
  enter-active-class="custom-enter-active"
  enter-to-class="custom-enter-to"
  leave-class="custom-leave"
  leave-active-class="custom-leave-active"
  leave-to-class="custom-leave-to"
  custom-class="demo-block custom-demo-block"
/>`,

    style: `/* 自定义动画过渡效果 */
.custom-enter-active,
.custom-leave-active {
  transition-property: background, transform;
}

/* 自定义动画进入初始状态 */
.custom-enter {
  transform: translate3d(-100px, -100px, 0) rotate(-180deg);
  background: #ff0000;
}

/* 自定义动画离开最终状态 */
.custom-leave-to {
  transform: translate3d(100px, 100px, 0) rotate(180deg);
  background: #ff0000;
}`,

    script: `const customShow = ref(false)

// 自定义动画演示
const handleCustom = () => {
  customShow.value = true
  setTimeout(() => {
    customShow.value = false
  }, 1200)
}`,
  },

  // 生命周期事件代码
  lifecycle: {
    template: `<wd-transition
  :show="eventShow"
  name="fade-up"
  custom-class="demo-block event-demo-block"
  @before-enter="handleBeforeEnter"
  @enter="handleEnter"
  @after-enter="handleAfterEnter"
  @before-leave="handleBeforeLeave"
  @leave="handleLeave"
  @after-leave="handleAfterLeave"
  @click="handleAnimationClick"
/>`,

    script: `const eventShow = ref(false)
const eventLogs = ref([])

// 添加事件日志
const addEventLog = (message, type = 'info') => {
  eventLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
    type,
  })
  if (eventLogs.value.length > 20) {
    eventLogs.value = eventLogs.value.slice(0, 20)
  }
}

// 生命周期事件处理
const handleBeforeEnter = () => addEventLog('进入前触发', 'info')
const handleEnter = () => addEventLog('进入时触发', 'success')
const handleAfterEnter = () => addEventLog('进入后触发', 'success')
const handleBeforeLeave = () => addEventLog('离开前触发', 'warning')
const handleLeave = () => addEventLog('离开时触发', 'warning')
const handleAfterLeave = () => addEventLog('离开后触发', 'error')
const handleAnimationClick = () => addEventLog('点击动画块', 'info')`,
  },

  // 高级配置代码
  advanced: {
    slowTemplate: `<!-- 自定义动画时长 -->
<wd-transition
  :show="slowShow"
  name="zoom-in"
  :duration="1000"
  custom-class="demo-block"
/>`,

    lazyTemplate: `<!-- 懒渲染模式 -->
<wd-transition
  :show="lazyShow"
  name="slide-up"
  :lazy-render="true"
  custom-class="demo-block"
/>`,

    noDestroyTemplate: `<!-- 不销毁模式 -->
<wd-transition
  :show="noDestroyShow"
  name="fade"
  :destroy="false"
  custom-class="demo-block"
/>`,

    combinedTemplate: `<!-- 组合动画 -->
<wd-transition
  :show="combinedShow"
  :name="['fade', 'zoom-in']"
  custom-class="demo-block"
/>`,

    script: `const slowShow = ref(false)
const lazyShow = ref(false)
const noDestroyShow = ref(false)
const combinedShow = ref(false)

// 慢速动画（1000ms）
const handleSlowAnimation = () => {
  slowShow.value = true
  setTimeout(() => {
    slowShow.value = false
  }, 1000)
}

// 懒渲染模式
const handleLazyRender = () => {
  lazyShow.value = true
  setTimeout(() => {
    lazyShow.value = false
  }, 500)
}

// 不销毁模式
const handleNoDestroy = () => {
  noDestroyShow.value = true
  setTimeout(() => {
    noDestroyShow.value = false
  }, 500)
}

// 组合动画
const handleCombinedAnimation = () => {
  combinedShow.value = true
  setTimeout(() => {
    combinedShow.value = false
  }, 500)
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'show',
    type: 'Boolean',
    default: 'false',
    desc: '是否展示组件',
  },
  {
    name: 'name',
    type: 'TransitionName | TransitionName[]',
    default: '""',
    desc: '动画类型，可选值：fade / fade-up / fade-down / fade-left / fade-right / slide-up / slide-down / slide-left / slide-right / zoom-in / zoom-out',
  },
  {
    name: 'duration',
    type: 'Number | Object',
    default: '300',
    desc: '动画执行时间，单位毫秒。可传对象分别设置进入和离开的时间',
  },
  {
    name: 'lazy-render',
    type: 'Boolean',
    default: 'false',
    desc: '弹层内容懒渲染，触发展示时才渲染内容',
  },
  {
    name: 'destroy',
    type: 'Boolean',
    default: 'true',
    desc: '是否在动画结束时销毁子节点（display: none)',
  },
  {
    name: 'enter-class',
    type: 'String',
    default: '""',
    desc: '进入过渡的开始状态',
  },
  {
    name: 'enter-active-class',
    type: 'String',
    default: '""',
    desc: '进入过渡的激活状态',
  },
  {
    name: 'enter-to-class',
    type: 'String',
    default: '""',
    desc: '进入过渡的结束状态',
  },
  {
    name: 'leave-class',
    type: 'String',
    default: '""',
    desc: '离开过渡的开始状态',
  },
  {
    name: 'leave-active-class',
    type: 'String',
    default: '""',
    desc: '离开过渡的激活状态',
  },
  {
    name: 'leave-to-class',
    type: 'String',
    default: '""',
    desc: '离开过渡的结束状态',
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
    name: 'click',
    desc: '点击时触发',
  },
  {
    name: 'before-enter',
    desc: '进入前触发',
  },
  {
    name: 'enter',
    desc: '进入时触发',
  },
  {
    name: 'after-enter',
    desc: '进入后触发',
  },
  {
    name: 'before-leave',
    desc: '离开前触发',
  },
  {
    name: 'leave',
    desc: '离开时触发',
  },
  {
    name: 'after-leave',
    desc: '离开后触发',
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

/**
 * 通用过渡动画触发器
 */
const transition = (transitionName: TransitionName) => {
  basicName.value = transitionName
  basicShow.value = true
  setTimeout(() => {
    basicShow.value = false
  }, 500)
}

// ===== 基本动画事件处理 =====

/**
 * Fade 动画系列
 */
const handleFade = () => transition('fade')

const handleFadeUp = () => transition('fade-up')

const handleFadeDown = () => transition('fade-down')

const handleFadeLeft = () => transition('fade-left')

const handleFadeRight = () => transition('fade-right')

/**
 * Slide 动画系列
 */
const handleSlideUp = () => transition('slide-up')

const handleSlideDown = () => transition('slide-down')

const handleSlideLeft = () => transition('slide-left')

const handleSlideRight = () => transition('slide-right')

/**
 * Zoom 动画系列
 */
const handleZoomIn = () => transition('zoom-in')

const handleZoomOut = () => transition('zoom-out')

// ===== 自定义动画事件处理 =====

/**
 * 自定义动画演示
 */
const handleCustom = () => {
  customShow.value = true
  setTimeout(() => {
    customShow.value = false
  }, 1200)
}

// ===== 生命周期事件处理 =====

/**
 * 事件监听动画
 */
const handleEventAnimation = () => {
  eventShow.value = true
  setTimeout(() => {
    eventShow.value = false
  }, 800)
}

/**
 * 进入前触发
 */
const handleBeforeEnter = () => {
  addEventLog('进入前触发 (before-enter)', 'info')
}

/**
 * 进入时触发
 */
const handleEnter = () => {
  addEventLog('进入时触发 (enter)', 'success')
}

/**
 * 进入后触发
 */
const handleAfterEnter = () => {
  addEventLog('进入后触发 (after-enter)', 'success')
}

/**
 * 离开前触发
 */
const handleBeforeLeave = () => {
  addEventLog('离开前触发 (before-leave)', 'warning')
}

/**
 * 离开时触发
 */
const handleLeave = () => {
  addEventLog('离开时触发 (leave)', 'warning')
}

/**
 * 离开后触发
 */
const handleAfterLeave = () => {
  addEventLog('离开后触发 (after-leave)', 'error')
}

/**
 * 点击动画块
 */
const handleAnimationClick = () => {
  addEventLog('点击了动画块 (click)', 'info')
}

// ===== 高级配置事件处理 =====

/**
 * 慢速动画（1000ms）
 */
const handleSlowAnimation = () => {
  slowShow.value = true
  setTimeout(() => {
    slowShow.value = false
  }, 1000)
}

/**
 * 懒渲染模式
 */
const handleLazyRender = () => {
  lazyShow.value = true
  setTimeout(() => {
    lazyShow.value = false
  }, 500)
}

/**
 * 不销毁模式
 */
const handleNoDestroy = () => {
  noDestroyShow.value = true
  setTimeout(() => {
    noDestroyShow.value = false
  }, 500)
}

/**
 * 组合动画
 */
const handleCombinedAnimation = () => {
  combinedShow.value = true
  setTimeout(() => {
    combinedShow.value = false
  }, 500)
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
// 演示动画块的基础样式
:deep(.demo-block) {
  position: fixed;
  left: 50%;
  top: 50%;
  margin: -50px 0 0 -50px;
  width: 100px;
  height: 100px;
  background: #0083ff;
  border-radius: 8px;
  z-index: 99;
}

// 自定义动画过渡效果
:deep(.custom-enter-active),
:deep(.custom-leave-active) {
  transition-property: background, transform;
}

// 自定义动画进入初始状态
:deep(.custom-enter) {
  transform: translate3d(-100px, -100px, 0) rotate(-180deg);
  background: #ff0000;
}

// 自定义动画离开最终状态
:deep(.custom-leave-to) {
  transform: translate3d(100px, 100px, 0) rotate(180deg);
  background: #ff0000;
}

// 为不同演示块添加不同颜色
:deep(.custom-demo-block) {
  background: #ff6b6b;
}

:deep(.event-demo-block) {
  background: #4ecdc4;
}

:deep(.slow-demo-block) {
  background: #45b7d1;
}

:deep(.lazy-demo-block) {
  background: #96ceb4;
}

:deep(.no-destroy-demo-block) {
  background: #ffeaa7;
  margin-top: 200rpx;
}

:deep(.combined-demo-block) {
  background: #fd79a8;
}
</style>
