<!-- Tabs 标签页 http://127.0.0.1:100/#/pages-sub/demo/wd/tabs -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Tabs 标签页" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的标签页展示，支持点击切换和程序控制">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <!-- 基本标签页 -->
        <wd-cell title="基本标签页" vertical>
          <wd-tabs v-model="basicTab" @change="handleBasicChange">
            <wd-tab v-for="item in 4" :key="`basic-${item}`" :title="`标签${item}`">
              <view class="h-30 flex flex-col justify-around text-center">
                <wd-text :text="`内容${basicTab + 1}`" />
                <view>
                  <wd-button @click="handleNextBasicTab">下一个</wd-button>
                </view>
              </view>
            </wd-tab>
          </wd-tabs>
        </wd-cell>

        <!-- name 匹配 -->
        <wd-cell title="name 匹配" vertical>
          <wd-tabs v-model="nameTab" @change="handleNameChange">
            <wd-tab v-for="item in nameList" :key="item" :title="item" :name="item">
              <view class="h-30 flex flex-col justify-center text-center">
                <wd-text :text="`内容${nameTab}`" />
              </view>
            </wd-tab>
          </wd-tabs>
        </wd-cell>

        <!-- 使用徽标 -->
        <wd-cell title="使用徽标" vertical>
          <wd-tabs v-model="badgeTab" @change="handleBadgeChange">
            <wd-tab
              v-for="(item, index) in badgeList"
              :key="`badge-${index}`"
              :title="item.title"
              :badge-props="item.badgeProps"
            >
              <view class="h-30 flex flex-col justify-center text-center">
                <wd-text :text="`${item.title}内容`" />
              </view>
            </wd-tab>
          </wd-tabs>
        </wd-cell>
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基本标签页" :code="codes.basic.basicTemplate" />
        <DemoCode title="模板 - name 匹配" :code="codes.basic.nameTemplate" />
        <DemoCode title="模板 - 使用徽标" :code="codes.basic.badgeTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 高级配置示例 -->
    <DemoSection title="高级配置" desc="更多配置选项：禁用标签、自动调整底部条宽度、粘性布局等">
      <wd-cell-group>
        <!-- 禁用标签 -->
        <wd-cell title="禁用标签" vertical>
          <wd-tabs v-model="disabledTab" @change="handleDisabledChange" @disabled="handleDisabled">
            <wd-tab
              v-for="item in 4"
              :key="`disabled-${item}`"
              :title="`标签${item}`"
              :disabled="item === 1"
            >
              <view class="h-30 flex flex-col justify-center text-center">
                <wd-text :text="`内容${disabledTab + 1}`" />
              </view>
            </wd-tab>
          </wd-tabs>
        </wd-cell>

        <!-- 自动调整底部条宽度 -->
        <wd-cell title="自动调整底部条宽度" vertical>
          <wd-tabs v-model="autoLineTab" auto-line-width @change="handleAutoLineChange">
            <wd-tab v-for="item in autoLineList" :key="item" :title="item" :name="item">
              <view class="h-30 flex flex-col justify-center text-center">
                <wd-text :text="`内容${autoLineTab}`" />
              </view>
            </wd-tab>
          </wd-tabs>
        </wd-cell>

        <!-- 粘性布局 -->
        <wd-cell title="粘性布局" vertical>
          <wd-tabs v-model="stickyTab" sticky @change="handleStickyChange">
            <wd-tab v-for="item in 4" :key="`sticky-${item}`" :title="`标签${item}`">
              <view class="h-30 flex flex-col justify-center text-center">
                <wd-text :text="`内容${stickyTab + 1}`" />
              </view>
            </wd-tab>
          </wd-tabs>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 禁用标签" :code="codes.advanced.disabledTemplate" />
        <DemoCode title="模板 - 自动调整底部条宽度" :code="codes.advanced.autoLineTemplate" />
        <DemoCode title="模板 - 粘性布局" :code="codes.advanced.stickyTemplate" />
        <DemoCode title="脚本 - 高级配置" :code="codes.advanced.script" />
      </template>
    </DemoSection>

    <!-- 动画与交互示例 -->
    <DemoSection title="动画与交互" desc="切换动画、手势滑动等交互效果">
      <wd-cell-group>
        <!-- 切换动画 -->
        <wd-cell title="切换动画" vertical>
          <wd-tabs v-model="animatedTab" animated @change="handleAnimatedChange">
            <wd-tab v-for="item in 4" :key="`animated-${item}`" :title="`标签${item}`">
              <view class="h-30 flex flex-col justify-center text-center">
                <wd-text :text="`内容${animatedTab + 1}`" />
              </view>
            </wd-tab>
          </wd-tabs>
        </wd-cell>

        <!-- 手势滑动 -->
        <wd-cell title="手势滑动" vertical>
          <wd-tabs v-model="swipeableTab" animated swipeable @change="handleSwipeableChange">
            <wd-tab v-for="item in 4" :key="`swipeable-${item}`" :title="`标签${item}`">
              <view class="h-30 flex flex-col justify-center text-center">
                <wd-text :text="`内容${swipeableTab + 1}（支持左右滑动）`" />
              </view>
            </wd-tab>
          </wd-tabs>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 切换动画" :code="codes.animation.animatedTemplate" />
        <DemoCode title="模板 - 手势滑动" :code="codes.animation.swipeableTemplate" />
        <DemoCode title="脚本 - 动画与交互" :code="codes.animation.script" />
      </template>
    </DemoSection>

    <!-- 滚动与导航示例 -->
    <DemoSection title="滚动与导航" desc="大量标签时的滚动展示和导航地图">
      <wd-cell-group>
        <!-- 数量大于6时可滚动 -->
        <wd-cell title="数量大于6时可滚动" vertical>
          <wd-tabs v-model="scrollableTab" @change="handleScrollableChange">
            <wd-tab v-for="item in 7" :key="`scrollable-${item}`" :title="`标签${item}`">
              <view class="h-30 flex flex-col justify-center text-center">
                <wd-text :text="`内容${scrollableTab + 1}`" />
              </view>
            </wd-tab>
          </wd-tabs>
        </wd-cell>

        <!-- 左对齐超出即可滚动 -->
        <wd-cell title="左对齐超出即可滚动" vertical>
          <wd-tabs v-model="alwaysScrollTab" slidable="always" @change="handleAlwaysScrollChange">
            <wd-tab v-for="item in 5" :key="`always-${item}`" :title="`超大标签${item}`">
              <view class="h-30 flex flex-col justify-center text-center">
                <wd-text :text="`内容${alwaysScrollTab + 1}`" />
              </view>
            </wd-tab>
          </wd-tabs>
        </wd-cell>

        <!-- 数量大于10时出现导航地图 -->
        <wd-cell title="数量大于10时出现导航地图" vertical>
          <wd-tabs v-model="mapTab" @change="handleMapChange">
            <wd-tab v-for="item in 11" :key="`map-${item}`" :title="`标签${item}`">
              <view class="h-80 flex flex-col justify-center text-center">
                <wd-text :text="`内容${mapTab + 1}`" />
              </view>
            </wd-tab>
          </wd-tabs>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 可滚动标签" :code="codes.scroll.scrollableTemplate" />
        <DemoCode title="模板 - 总是可滚动" :code="codes.scroll.alwaysScrollTemplate" />
        <DemoCode title="模板 - 导航地图" :code="codes.scroll.mapTemplate" />
        <DemoCode title="脚本 - 滚动与导航" :code="codes.scroll.script" />
      </template>
    </DemoSection>

    <!-- 在弹出框中使用示例 -->
    <DemoSection title="在弹出框中使用" desc="在弹出框中使用标签页，需要手动更新样式">
      <wd-cell-group>
        <wd-cell title="弹出框中的标签页">
          <wd-button @click="handleOpenPopup">打开弹窗</wd-button>
        </wd-cell>
      </wd-cell-group>

      <!-- 弹出框 -->
      <wd-popup
        v-model="showPopup"
        position="bottom"
        safe-area-inset-bottom
        closable
        custom-style="padding: 0 24rpx;"
        @after-enter="handlePopupShow"
      >
        <view class="py-6 text-center text-8">在弹出框中使用</view>
        <wd-tabs ref="popupTabsRef" v-model="popupTab" @change="handlePopupChange">
          <wd-tab v-for="item in nameList" :key="`popup-${item}`" :title="item" :name="item">
            <view class="h-30 flex flex-col justify-center text-center">
              <wd-text :text="`弹窗内容${popupTab}`" />
            </view>
          </wd-tab>
        </wd-tabs>
      </wd-popup>

      <template #codes>
        <DemoCode title="模板 - 弹出框标签页" :code="codes.popup.template" />
        <DemoCode title="脚本 - 弹出框标签页" :code="codes.popup.script" />
      </template>
    </DemoSection>

    <!-- 事件监听示例 -->
    <DemoSection title="事件监听" desc="监听标签页的各种事件：点击、切换、禁用等">
      <!-- 状态显示区域 -->
      <view class="space-y-4">
        <!-- 事件监听标签页 -->
        <wd-cell title="事件监听标签页" vertical>
          <wd-tabs
            v-model="eventTab"
            @click="handleEventClick"
            @change="handleEventChange"
            @disabled="handleEventDisabled"
          >
            <wd-tab
              v-for="item in 4"
              :key="`event-${item}`"
              :title="`标签${item}`"
              :disabled="item === 2"
            >
              <view class="h-30 flex flex-col justify-center text-center">
                <wd-text :text="`内容${eventTab + 1}`" />
              </view>
            </wd-tab>
          </wd-tabs>
        </wd-cell>

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

      <template #codes>
        <DemoCode title="事件监听模板" :code="codes.events.template" />
        <DemoCode title="事件处理方法" :code="codes.events.methods" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import type { TabsInstance } from '@/wd/components/wd-tabs/wd-tabs.vue'
import { useToast } from '@/wd'
import { computed, ref } from 'vue'

// ===== 数据接口定义 =====

/**
 * 事件日志接口
 */
interface EventLog {
  time: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

/**
 * 徽标标签项接口
 */
interface BadgeTabItem {
  title: string
  badgeProps: {
    modelValue?: number
    max?: number
    isDot?: boolean
    right?: string
    showZero?: boolean
  }
}

// ===== 组件状态管理 =====

// Toast实例
const toast = useToast()

// 各种标签页的当前值
const basicTab = ref<number>(0)
const nameTab = ref<string>('a')
const badgeTab = ref<number>(0)
const disabledTab = ref<number>(1)
const autoLineTab = ref<string>('Design')
const stickyTab = ref<number>(0)
const animatedTab = ref<number>(0)
const swipeableTab = ref<number>(0)
const scrollableTab = ref<number>(0)
const alwaysScrollTab = ref<number>(0)
const mapTab = ref<number>(0)
const popupTab = ref<string>('individual')
const eventTab = ref<number>(2)

// 弹出框相关
const showPopup = ref<boolean>(false)
const popupTabsRef = ref<TabsInstance>()

// 事件日志状态
const eventLogs = ref<EventLog[]>([])

// 标签数据
const nameList = ref<string[]>(['this', 'is', 'a', 'individual', 'example'])
const autoLineList = ref<string[]>(['Wot', 'Design', 'Uni'])

// 带徽标的标签数据
const badgeList = computed<BadgeTabItem[]>(() => {
  return [
    {
      title: '普通数值',
      badgeProps: {
        modelValue: 10,
        right: '-8px',
      },
    },
    {
      title: '最大值',
      badgeProps: {
        modelValue: 100,
        max: 99,
        right: '-8px',
      },
    },
    {
      title: '点状',
      badgeProps: {
        isDot: true,
        right: '-8px',
        showZero: true,
      },
    },
  ]
})

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    basicTemplate: `<wd-tabs v-model="basicTab" @change="handleBasicChange">
  <wd-tab v-for="item in 4" :key="item" :title="\`标签\${item}\`">
    <view class="h-30 flex flex-col justify-around text-center">
      <wd-text :text="\`内容\${basicTab + 1}\`" />
      <view>
        <wd-button @click="handleNextBasicTab">下一个</wd-button>
      </view>
    </view>
  </wd-tab>
</wd-tabs>`,

    nameTemplate: `<wd-tabs v-model="nameTab" @change="handleNameChange">
  <wd-tab v-for="item in nameList" :key="item" :title="item" :name="item">
    <view class="h-30 flex flex-col justify-center text-center">
      <wd-text :text="\`内容\${nameTab}\`" />
    </view>
  </wd-tab>
</wd-tabs>`,

    badgeTemplate: `<wd-tabs v-model="badgeTab" @change="handleBadgeChange">
  <wd-tab
    v-for="(item, index) in badgeList"
    :key="index"
    :title="item.title"
    :badge-props="item.badgeProps"
  >
    <view class="h-30 flex flex-col justify-center text-center">
      <wd-text :text="\`\${item.title}内容\`" />
    </view>
  </wd-tab>
</wd-tabs>`,

    script: `import { ref, computed } from 'vue'

// 基本标签页状态
const basicTab = ref(0)
const nameTab = ref('a')
const badgeTab = ref(0)

// 标签数据
const nameList = ref(['this', 'is', 'a', 'individual', 'example'])

// 带徽标的标签数据
const badgeList = computed(() => {
  return [
    {
      title: '普通数值',
      badgeProps: { modelValue: 10, right: '-8px' }
    },
    {
      title: '最大值',
      badgeProps: { modelValue: 100, max: 99, right: '-8px' }
    },
    {
      title: '点状',
      badgeProps: { isDot: true, right: '-8px', showZero: true }
    }
  ]
})

// 切换到下一个标签
const handleNextBasicTab = () => {
  basicTab.value = basicTab.value < 3 ? basicTab.value + 1 : 0
}`,
  },

  // 高级配置代码
  advanced: {
    disabledTemplate: `<wd-tabs v-model="disabledTab" @change="handleDisabledChange" @disabled="handleDisabled">
  <wd-tab v-for="item in 4" :key="item" :title="\`标签\${item}\`" :disabled="item === 1">
    <view class="h-30 flex flex-col justify-center text-center">
      <wd-text :text="\`内容\${disabledTab + 1}\`" />
    </view>
  </wd-tab>
</wd-tabs>`,

    autoLineTemplate: `<wd-tabs v-model="autoLineTab" auto-line-width @change="handleAutoLineChange">
  <wd-tab v-for="item in autoLineList" :key="item" :title="item" :name="item">
    <view class="h-30 flex flex-col justify-center text-center">
      <wd-text :text="\`内容\${autoLineTab}\`" />
    </view>
  </wd-tab>
</wd-tabs>`,

    stickyTemplate: `<wd-tabs v-model="stickyTab" sticky @change="handleStickyChange">
  <wd-tab v-for="item in 4" :key="item" :title="\`标签\${item}\`">
    <view class="h-30 flex flex-col justify-center text-center">
      <wd-text :text="\`内容\${stickyTab + 1}\`" />
    </view>
  </wd-tab>
</wd-tabs>`,

    script: `// 高级配置状态
const disabledTab = ref(1) // 默认选中第2个标签（索引1）
const autoLineTab = ref('Design')
const stickyTab = ref(0)

const autoLineList = ref(['Wot', 'Design', 'Uni'])

// 禁用标签事件处理
const handleDisabled = ({ index, name }) => {
  console.log('尝试点击禁用标签:', { index, name })
  // 可以在这里处理禁用标签的点击逻辑
}`,
  },

  // 动画与交互代码
  animation: {
    animatedTemplate: `<wd-tabs v-model="animatedTab" animated @change="handleAnimatedChange">
  <wd-tab v-for="item in 4" :key="item" :title="\`标签\${item}\`">
    <view class="h-30 flex flex-col justify-center text-center">
      <wd-text :text="\`内容\${animatedTab + 1}\`" />
    </view>
  </wd-tab>
</wd-tabs>`,

    swipeableTemplate: `<wd-tabs v-model="swipeableTab" animated swipeable @change="handleSwipeableChange">
  <wd-tab v-for="item in 4" :key="item" :title="\`标签\${item}\`">
    <view class="h-30 flex flex-col justify-center text-center">
      <wd-text :text="\`内容\${swipeableTab + 1}（支持左右滑动）\`" />
    </view>
  </wd-tab>
</wd-tabs>`,

    script: `// 动画与交互状态
const animatedTab = ref(0)
const swipeableTab = ref(0)

// 动画标签事件处理
const handleAnimatedChange = (event) => {
  console.log('动画标签切换:', event)
}

// 滑动标签事件处理
const handleSwipeableChange = (event) => {
  console.log('滑动标签切换:', event)
}`,
  },

  // 滚动与导航代码
  scroll: {
    scrollableTemplate: `<wd-tabs v-model="scrollableTab" @change="handleScrollableChange">
  <wd-tab v-for="item in 7" :key="item" :title="\`标签\${item}\`">
    <view class="h-30 flex flex-col justify-center text-center">
      <wd-text :text="\`内容\${scrollableTab + 1}\`" />
    </view>
  </wd-tab>
</wd-tabs>`,

    alwaysScrollTemplate: `<wd-tabs v-model="alwaysScrollTab" slidable="always" @change="handleAlwaysScrollChange">
  <wd-tab v-for="item in 5" :key="item" :title="\`超大标签\${item}\`">
    <view class="h-30 flex flex-col justify-center text-center">
      <wd-text :text="\`内容\${alwaysScrollTab + 1}\`" />
    </view>
  </wd-tab>
</wd-tabs>`,

    mapTemplate: `<wd-tabs v-model="mapTab" @change="handleMapChange">
  <wd-tab v-for="item in 11" :key="item" :title="\`标签\${item}\`">
    <view class="h-80 flex flex-col justify-center text-center">
      <wd-text :text="\`内容\${mapTab + 1}\`" />
    </view>
  </wd-tab>
</wd-tabs>`,

    script: `// 滚动与导航状态
const scrollableTab = ref(0)
const alwaysScrollTab = ref(0)
const mapTab = ref(0)

// 可滚动标签事件处理
const handleScrollableChange = (event) => {
  console.log('可滚动标签切换:', event)
}

// 总是可滚动标签事件处理
const handleAlwaysScrollChange = (event) => {
  console.log('总是可滚动标签切换:', event)
}

// 导航地图标签事件处理
const handleMapChange = (event) => {
  console.log('导航地图标签切换:', event)
}`,
  },

  // 弹出框代码
  popup: {
    template: `<!-- 弹出框按钮 -->
<wd-button @click="handleOpenPopup">打开弹窗</wd-button>

<!-- 弹出框 -->
<wd-popup
  v-model="showPopup"
  position="bottom"
  safe-area-inset-bottom
  closable
  custom-style="padding: 0 24rpx;"
  @after-enter="handlePopupShow"
>
  <view class="py-6 text-center text-8">在弹出框中使用</view>
  <wd-tabs ref="popupTabsRef" v-model="popupTab" @change="handlePopupChange">
    <wd-tab v-for="item in nameList" :key="item" :title="item" :name="item">
      <view class="h-30 flex flex-col justify-center text-center">
        <wd-text :text="\`弹窗内容\${popupTab}\`" />
      </view>
    </wd-tab>
  </wd-tabs>
</wd-popup>`,

    script: `import type { TabsInstance } from '@/wd/components/wd-tabs/wd-tabs.vue'

// 弹出框相关状态
const showPopup = ref(false)
const popupTab = ref('individual')
const popupTabsRef = ref<TabsInstance>()

// 打开弹出框
const handleOpenPopup = () => {
  showPopup.value = true
}

// 弹出框显示后更新标签样式
const handlePopupShow = () => {
  // 在弹出框中使用时，需要手动更新底部指示线样式
  popupTabsRef.value?.updateLineStyle(false)
}

// 弹出框标签切换事件
const handlePopupChange = (event) => {
  console.log('弹出框标签切换:', event)
}`,
  },

  // 事件监听代码
  events: {
    template: `
      <wd-tabs
        v-model="eventTab"
        @click="handleEventClick"
        @change="handleEventChange"
        @disabled="handleEventDisabled"
      >
        <wd-tab v-for="item in 4" :key="item" :title="\`标签\${item}\`" :disabled="item === 2">
          <view class="h-30 flex flex-col justify-center text-center">
            <wd-text :text="\`内容\${eventTab + 1}\`" />
          </view>
        </wd-tab>
      </wd-tabs>`,

    methods: `// 事件日志管理
const eventLogs = ref([])

const addEventLog = (message, type = 'info') => {
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

const handleEventClick = ({ index, name }) => {
  addEventLog(\`点击标签: \${name} (索引: \${index})\`, 'info')
}

const handleEventChange = ({ index, name }) => {
  addEventLog(\`切换标签: \${name} (索引: \${index})\`, 'success')
}

const handleEventDisabled = ({ index, name }) => {
  addEventLog(\`点击禁用标签: \${name} (索引: \${index})\`, 'warning')
}

const clearEventLogs = () => {
  eventLogs.value = []
  addEventLog('事件日志已清空', 'info')
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'model-value',
    type: 'String | Number',
    default: '0',
    desc: '绑定值，选中标签的标识符',
  },
  {
    name: 'items',
    type: 'TabItem[]',
    default: '[]',
    desc: '标签页数据数组（配置式使用）',
  },
  {
    name: 'slidable-num',
    type: 'Number',
    default: '6',
    desc: '标签数超过阈值可滑动',
  },
  {
    name: 'map-num',
    type: 'Number',
    default: '10',
    desc: '标签数超过阈值显示导航地图',
  },
  {
    name: 'map-title',
    type: 'String',
    default: '""',
    desc: '导航地图的标题',
  },
  {
    name: 'sticky',
    type: 'Boolean',
    default: 'false',
    desc: '粘性布局',
  },
  {
    name: 'offset-top',
    type: 'Number',
    default: '0',
    desc: '粘性布局吸顶位置',
  },
  {
    name: 'swipeable',
    type: 'Boolean',
    default: 'false',
    desc: '开启手势滑动',
  },
  {
    name: 'auto-line-width',
    type: 'Boolean',
    default: 'false',
    desc: '自动调整底部条宽度',
  },
  {
    name: 'line-width',
    type: 'String | Number',
    default: '""',
    desc: '底部条宽度，单位像素',
  },
  {
    name: 'line-height',
    type: 'String | Number',
    default: '""',
    desc: '底部条高度，单位像素',
  },
  {
    name: 'color',
    type: 'String',
    default: '""',
    desc: '标签激活时的颜色',
  },
  {
    name: 'inactive-color',
    type: 'String',
    default: '""',
    desc: '标签非激活时的颜色',
  },
  {
    name: 'animated',
    type: 'Boolean',
    default: 'false',
    desc: '是否开启切换标签内容时的过渡动画',
  },
  {
    name: 'duration',
    type: 'Number',
    default: '300',
    desc: '切换动画过渡时间，单位毫秒',
  },
  {
    name: 'slidable',
    type: 'String',
    default: '"auto"',
    desc: '是否开启滚动导航：auto / always',
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
    name: 'setActive(value, init?, setScroll?)',
    desc: '设置激活的标签页',
  },
  {
    name: 'scrollIntoView()',
    desc: '滚动到当前激活的标签页可视区域',
  },
  {
    name: 'updateLineStyle(animation?)',
    desc: '更新底部指示线的样式',
  },
]

// Events 事件文档
const apiEvents = [
  {
    name: 'change',
    desc: '切换标签时触发，参数为 { index: number, name: string | number }',
  },
  {
    name: 'click',
    desc: '点击标签时触发，参数为 { index: number, name: string | number }',
  },
  {
    name: 'disabled',
    desc: '点击禁用标签时触发，参数为 { index: number, name: string | number }',
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

// === 基本用法事件处理 ===

/**
 * 切换到下一个基本标签
 */
const handleNextBasicTab = () => {
  basicTab.value = basicTab.value < 3 ? basicTab.value + 1 : 0
}

/**
 * 基本标签切换事件
 */
const handleBasicChange = (event: { index: number; name: string | number }) => {
  console.log('基本标签切换:', event)
}

/**
 * name匹配标签切换事件
 */
const handleNameChange = (event: { index: number; name: string | number }) => {
  console.log('name匹配标签切换:', event)
}

/**
 * 徽标标签切换事件
 */
const handleBadgeChange = (event: { index: number; name: string | number }) => {
  console.log('徽标标签切换:', event)
}

// === 高级配置事件处理 ===

/**
 * 禁用标签切换事件
 */
const handleDisabledChange = (event: { index: number; name: string | number }) => {
  console.log('禁用标签切换:', event)
}

/**
 * 禁用标签点击事件
 */
const handleDisabled = (event: { index: number; name: string | number }) => {
  console.log('尝试点击禁用标签:', event)
  toast.show(`标签${event.index + 1}已禁用`)
}

/**
 * 自动调整底部条宽度标签切换事件
 */
const handleAutoLineChange = (event: { index: number; name: string | number }) => {
  console.log('自动调整底部条宽度标签切换:', event)
}

/**
 * 粘性布局标签切换事件
 */
const handleStickyChange = (event: { index: number; name: string | number }) => {
  console.log('粘性布局标签切换:', event)
}

// === 动画与交互事件处理 ===

/**
 * 动画标签切换事件
 */
const handleAnimatedChange = (event: { index: number; name: string | number }) => {
  console.log('动画标签切换:', event)
}

/**
 * 滑动标签切换事件
 */
const handleSwipeableChange = (event: { index: number; name: string | number }) => {
  console.log('滑动标签切换:', event)
}

// === 滚动与导航事件处理 ===

/**
 * 可滚动标签切换事件
 */
const handleScrollableChange = (event: { index: number; name: string | number }) => {
  console.log('可滚动标签切换:', event)
}

/**
 * 总是可滚动标签切换事件
 */
const handleAlwaysScrollChange = (event: { index: number; name: string | number }) => {
  console.log('总是可滚动标签切换:', event)
}

/**
 * 导航地图标签切换事件
 */
const handleMapChange = (event: { index: number; name: string | number }) => {
  console.log('导航地图标签切换:', event)
}

// === 弹出框事件处理 ===

/**
 * 打开弹出框
 */
const handleOpenPopup = () => {
  showPopup.value = true
}

/**
 * 弹出框显示后更新标签样式
 */
const handlePopupShow = () => {
  // 在弹出框中使用时，需要手动更新底部指示线样式
  popupTabsRef.value?.updateLineStyle(false)
}

/**
 * 弹出框标签切换事件
 */
const handlePopupChange = (event: { index: number; name: string | number }) => {
  console.log('弹出框标签切换:', event)
}

// === 事件监听处理 ===

/**
 * 事件监听点击事件
 */
const handleEventClick = (event: { index: number; name: string | number }) => {
  addEventLog(`点击标签: ${event.name} (索引: ${event.index})`, 'info')
  toast.show(`点击了标签${event.index + 1}`)
}

/**
 * 事件监听切换事件
 */
const handleEventChange = (event: { index: number; name: string | number }) => {
  addEventLog(`切换标签: ${event.name} (索引: ${event.index})`, 'success')
}

/**
 * 事件监听禁用事件
 */
const handleEventDisabled = (event: { index: number; name: string | number }) => {
  addEventLog(`点击禁用标签: ${event.name} (索引: ${event.index})`, 'warning')
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
// 自定义标签页内容样式
.h-30 {
  height: 120rpx;
}

.h-80 {
  height: 320rpx;
}

.text-8 {
  font-size: 32rpx;
}
</style>
