<!-- FloatingPanel 浮动面板 http://127.0.0.1:100/#/pages-sub/demo/wd/floating-panel -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="FloatingPanel 浮动面板" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的浮动面板，可上下拖动查看内容">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <!-- 操作提示 -->
        <view class="rounded-lg bg-blue-50 p-4">
          <view class="text-xs text-blue-600 font-medium">
            📱 拖动底部浮动面板可以查看更多内容，面板会自动吸附到锚点位置
          </view>
        </view>

        <!-- 控制按钮 -->
        <view class="px-4">
          <wd-button type="primary" block @click="toggleBasicPanel">
            {{ showBasicPanel ? '隐藏面板' : '显示面板' }}
          </wd-button>
        </view>
      </view>

      <!-- 基本浮动面板 -->
      <wd-floating-panel v-if="showBasicPanel" safe-area-inset-bottom>
        <wd-cell-group border>
          <wd-cell
            v-for="item in basicData"
            :key="item.id"
            :title="item.title"
            :label="item.desc"
            :value="item.value"
            is-link
            @click="handleBasicItemClick(item)"
          />
        </wd-cell-group>
      </wd-floating-panel>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基本用法" :code="codes.basic.template" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 自定义锚点示例 -->
    <DemoSection title="自定义锚点" desc="设置面板可停靠的高度位置">
      <view class="space-y-4">
        <!-- 锚点配置 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm font-medium">锚点设置</view>
          <view class="space-y-2">
            <view class="text-xs text-gray-600">当前锚点：{{ formatAnchors }}</view>
            <view class="text-xs text-gray-600">
              当前高度：{{ addUnit(anchorHeight.toFixed(0)) }}
            </view>
          </view>
        </view>

        <!-- 锚点预设选择 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm font-medium">锚点预设</view>
          <wd-radio-group v-model="anchorPreset" inline shape="dot">
            <wd-radio value="default">默认</wd-radio>
            <wd-radio value="custom1">三段式</wd-radio>
            <wd-radio value="custom2">渐进式</wd-radio>
          </wd-radio-group>
        </view>

        <!-- 控制按钮 -->
        <view class="px-4">
          <wd-button type="success" block @click="toggleAnchorPanel">
            {{ showAnchorPanel ? '隐藏锚点面板' : '显示锚点面板' }}
          </wd-button>
        </view>
      </view>

      <!-- 自定义锚点面板 -->
      <wd-floating-panel
        v-if="showAnchorPanel"
        v-model:height="anchorHeight"
        :anchors="currentAnchors"
        safe-area-inset-bottom
        @height-change="handleAnchorHeightChange"
      >
        <view class="p-4 text-center">
          <view class="mb-4 text-base font-medium">自定义锚点演示</view>
          <view class="mb-4 text-sm text-gray-600">拖动面板体验不同锚点位置的吸附效果</view>
          <view class="space-y-2">
            <view class="text-xs">锚点配置：{{ formatAnchors }}</view>
            <view class="text-xs">当前高度：{{ addUnit(anchorHeight.toFixed(0)) }}</view>
          </view>
        </view>
      </wd-floating-panel>

      <template #codes>
        <DemoCode title="模板 - 自定义锚点" :code="codes.anchor.template" />
        <DemoCode title="脚本 - 自定义锚点" :code="codes.anchor.script" />
      </template>
    </DemoSection>

    <!-- 拖拽控制示例 -->
    <DemoSection title="拖拽控制" desc="控制面板的拖拽行为">
      <view class="space-y-4">
        <!-- 拖拽设置 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm font-medium">拖拽设置</view>
          <view class="space-y-3">
            <view class="flex items-center justify-between">
              <text class="text-sm">仅头部可拖拽</text>
              <wd-switch v-model="headerOnlyDrag" size="22px" />
            </view>
            <view class="text-xs text-gray-500">
              {{ headerOnlyDrag ? '只能拖动头部的指示条' : '整个面板区域都可拖动' }}
            </view>
          </view>
        </view>

        <!-- 动画时长设置 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm font-medium">动画时长</view>
          <wd-radio-group v-model="animationDuration" inline shape="dot">
            <wd-radio :value="200">快速</wd-radio>
            <wd-radio :value="300">正常</wd-radio>
            <wd-radio :value="500">缓慢</wd-radio>
          </wd-radio-group>
        </view>

        <!-- 控制按钮 -->
        <view class="px-4">
          <wd-button type="warning" block @click="toggleDragPanel">
            {{ showDragPanel ? '隐藏拖拽面板' : '显示拖拽面板' }}
          </wd-button>
        </view>
      </view>

      <!-- 拖拽控制面板 -->
      <wd-floating-panel
        v-if="showDragPanel"
        :content-draggable="!headerOnlyDrag"
        :duration="animationDuration"
        safe-area-inset-bottom
      >
        <view class="p-4">
          <view class="mb-4 text-center text-base font-medium">拖拽控制演示</view>
          <view class="space-y-3">
            <view class="rounded bg-blue-50 p-3">
              <view class="text-sm font-medium">拖拽模式</view>
              <view class="mt-1 text-xs text-gray-600">
                {{
                  headerOnlyDrag
                    ? '仅头部拖拽：只能拖动顶部的指示条'
                    : '全区域拖拽：整个面板都可以拖动'
                }}
              </view>
            </view>

            <view class="rounded bg-green-50 p-3">
              <view class="text-sm font-medium">动画时长</view>
              <view class="mt-1 text-xs text-gray-600">
                当前设置：{{ animationDuration }}ms {{ getDurationLabel(animationDuration) }}
              </view>
            </view>

            <!-- 滚动内容区域 -->
            <view class="max-h-40 overflow-y-auto rounded bg-gray-50 p-3">
              <view class="mb-2 text-sm font-medium">滚动内容区域</view>
              <view
                v-for="(item, index) in scrollContent"
                :key="index"
                class="border-b border-gray-200 py-2 last:border-b-0"
              >
                <view class="text-sm">{{ item.title }}</view>
                <view class="text-xs text-gray-500">{{ item.content }}</view>
              </view>
            </view>
          </view>
        </view>
      </wd-floating-panel>

      <template #codes>
        <DemoCode title="模板 - 拖拽控制" :code="codes.drag.template" />
        <DemoCode title="脚本 - 拖拽控制" :code="codes.drag.script" />
      </template>
    </DemoSection>

    <!-- 实际应用场景 -->
    <DemoSection title="实际应用场景" desc="常见的业务场景示例">
      <view class="space-y-4">
        <!-- 场景选择 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm font-medium">应用场景</view>
          <wd-radio-group v-model="scenarioType" inline shape="dot">
            <wd-radio value="map">地图导航</wd-radio>
            <wd-radio value="player">音乐播放</wd-radio>
            <wd-radio value="comment">评论列表</wd-radio>
          </wd-radio-group>
        </view>

        <!-- 场景说明 -->
        <view class="rounded-lg bg-blue-50 p-4">
          <view class="text-xs text-blue-600 font-medium">
            📱 {{ getScenarioDescription(scenarioType) }}
          </view>
        </view>

        <!-- 控制按钮 -->
        <view class="px-4">
          <wd-button type="error" block @click="toggleScenarioPanel">
            {{ showScenarioPanel ? '隐藏场景面板' : '显示场景面板' }}
          </wd-button>
        </view>
      </view>

      <!-- 地图导航场景 -->
      <wd-floating-panel
        v-if="showScenarioPanel && scenarioType === 'map'"
        v-model:height="mapPanelHeight"
        :anchors="mapAnchors"
        safe-area-inset-bottom
        @height-change="handleMapHeightChange"
      >
        <view class="p-4">
          <view class="mb-4 flex items-center justify-between">
            <view class="text-lg font-medium">导航信息</view>
            <wd-button type="primary" size="small">开始导航</wd-button>
          </view>

          <view class="space-y-3">
            <view class="rounded bg-blue-50 p-3">
              <view class="text-sm font-medium">目的地</view>
              <view class="mt-1 text-xs text-gray-600">北京市朝阳区xxx大厦</view>
            </view>

            <view class="rounded bg-green-50 p-3">
              <view class="text-sm font-medium">预计时间</view>
              <view class="mt-1 text-xs text-gray-600">约26分钟 | 距离12.5公里</view>
            </view>

            <view class="rounded bg-amber-50 p-3">
              <view class="text-sm font-medium">路况信息</view>
              <view class="mt-1 text-xs text-gray-600">当前路况良好，建议走推荐路线</view>
            </view>
          </view>
        </view>
      </wd-floating-panel>

      <!-- 音乐播放场景 -->
      <wd-floating-panel
        v-if="showScenarioPanel && scenarioType === 'player'"
        :anchors="playerAnchors"
        safe-area-inset-bottom
      >
        <view class="p-4">
          <view class="mb-4 text-center">
            <view class="mx-auto mb-2 h-16 w-16 rounded-lg bg-gray-200" />
            <view class="text-base font-medium">歌曲名称</view>
            <view class="text-sm text-gray-500">歌手名称</view>
          </view>

          <view class="space-y-4">
            <!-- 播放进度 -->
            <view class="space-y-2">
              <view class="h-1 w-full rounded-full bg-gray-200">
                <view class="h-1 rounded-full bg-blue-500" style="width: 35%" />
              </view>
              <view class="flex justify-between text-xs text-gray-500">
                <text>1:25</text>
                <text>4:32</text>
              </view>
            </view>

            <!-- 播放控制 -->
            <view class="flex items-center justify-center space-x-8">
              <wd-icon name="skip-back" size="24px" color="#666" />
              <wd-icon name="pause" size="32px" color="#007AFF" />
              <wd-icon name="skip-forward" size="24px" color="#666" />
            </view>
          </view>
        </view>
      </wd-floating-panel>

      <!-- 评论列表场景 -->
      <wd-floating-panel
        v-if="showScenarioPanel && scenarioType === 'comment'"
        :anchors="commentAnchors"
        safe-area-inset-bottom
      >
        <view class="p-4">
          <view class="mb-4 flex items-center justify-between">
            <view class="text-lg font-medium">评论 ({{ commentList.length }})</view>
            <wd-button type="primary" size="small" @click="handleAddComment">写评论</wd-button>
          </view>

          <view class="space-y-3">
            <view
              v-for="comment in commentList"
              :key="comment.id"
              class="flex rounded bg-gray-50 p-3 space-x-3"
            >
              <view class="h-8 w-8 flex-shrink-0 rounded-full bg-blue-500" />
              <view class="flex-1">
                <view class="text-sm font-medium">{{ comment.user }}</view>
                <view class="mt-1 text-xs text-gray-600">{{ comment.content }}</view>
                <view class="mt-2 text-xs text-gray-400">{{ comment.time }}</view>
              </view>
            </view>
          </view>
        </view>
      </wd-floating-panel>

      <template #codes>
        <DemoCode title="模板 - 地图导航场景" :code="codes.scenarios.mapTemplate" />
        <DemoCode title="模板 - 音乐播放场景" :code="codes.scenarios.playerTemplate" />
        <DemoCode title="模板 - 评论列表场景" :code="codes.scenarios.commentTemplate" />
        <DemoCode title="脚本 - 应用场景" :code="codes.scenarios.script" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { addUnit } from '@/wd/components/common/util'

// ===== 组件状态管理 =====

// 系统信息
const windowHeight = ref<number>(0)

// 基本用法状态
const showBasicPanel = ref<boolean>(false)
const basicData = ref([
  { id: 1, title: '菜单项 1', desc: '这是第一个菜单项的描述', value: '详情' },
  { id: 2, title: '菜单项 2', desc: '这是第二个菜单项的描述', value: '详情' },
  { id: 3, title: '菜单项 3', desc: '这是第三个菜单项的描述', value: '详情' },
  { id: 4, title: '菜单项 4', desc: '这是第四个菜单项的描述', value: '详情' },
  { id: 5, title: '菜单项 5', desc: '这是第五个菜单项的描述', value: '详情' },
])

// 自定义锚点状态
const showAnchorPanel = ref<boolean>(false)
const anchorHeight = ref<number>(0)
const anchorPreset = ref<string>('default')

// 拖拽控制状态
const showDragPanel = ref<boolean>(false)
const headerOnlyDrag = ref<boolean>(false)
const animationDuration = ref<number>(300)

// 应用场景状态
const showScenarioPanel = ref<boolean>(false)
const scenarioType = ref<'map' | 'player' | 'comment'>('map')
const mapPanelHeight = ref<number>(0)

// 滚动内容数据
const scrollContent = ref([
  { title: '内容项目 1', content: '这是一段可以滚动的内容，用于演示内容区域的拖拽行为' },
  { title: '内容项目 2', content: '当启用仅头部拖拽时，这个区域将无法触发面板拖动' },
  { title: '内容项目 3', content: '用户只能通过拖动顶部的指示条来控制面板高度' },
  { title: '内容项目 4', content: '这样可以避免滚动内容时意外触发面板拖动' },
  { title: '内容项目 5', content: '提供更好的用户体验和交互控制' },
])

// 评论列表数据
const commentList = ref([
  { id: 1, user: '用户A', content: '这个功能很不错，使用起来很方便！', time: '5分钟前' },
  { id: 2, user: '用户B', content: '界面设计很棒，交互体验很流畅。', time: '10分钟前' },
  { id: 3, user: '用户C', content: '希望能够支持更多的自定义选项。', time: '15分钟前' },
  { id: 4, user: '用户D', content: '性能表现不错，没有明显的卡顿。', time: '20分钟前' },
])

// ===== 计算属性 =====

/**
 * 当前锚点配置
 */
const currentAnchors = computed(() => {
  const presets = {
    default: [100, Math.round(windowHeight.value * 0.6)],
    custom1: [120, Math.round(windowHeight.value * 0.4), Math.round(windowHeight.value * 0.8)],
    custom2: [80, 200, 350, Math.round(windowHeight.value * 0.7)],
  }
  return presets[anchorPreset.value as keyof typeof presets] || presets.default
})

/**
 * 格式化锚点显示
 */
const formatAnchors = computed(() => {
  return currentAnchors.value.map((anchor) => addUnit(anchor)).join(', ')
})

/**
 * 地图导航锚点
 */
const mapAnchors = computed(() => [
  100, // 最小高度：显示基本信息
  Math.round(windowHeight.value * 0.4), // 中等高度：显示详细信息
  Math.round(windowHeight.value * 0.8), // 最大高度：显示完整内容
])

/**
 * 音乐播放器锚点
 */
const playerAnchors = computed(() => [
  120, // 迷你播放器高度
  Math.round(windowHeight.value * 0.6), // 完整播放器高度
])

/**
 * 评论列表锚点
 */
const commentAnchors = computed(() => [
  150, // 评论概览高度
  Math.round(windowHeight.value * 0.5), // 部分评论列表
  Math.round(windowHeight.value * 0.9), // 完整评论列表
])

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    template: `<wd-floating-panel safe-area-inset-bottom>
  <wd-cell-group border>
    <wd-cell
      v-for="item in basicData"
      :key="item.id"
      :title="item.title"
      :label="item.desc"
      :value="item.value"
      is-link
      @click="handleBasicItemClick(item)"
    />
  </wd-cell-group>
</wd-floating-panel>`,

    script: `import { ref } from 'vue'

const showBasicPanel = ref(false)
const basicData = ref([
  { id: 1, title: '菜单项 1', desc: '这是第一个菜单项的描述', value: '详情' },
  { id: 2, title: '菜单项 2', desc: '这是第二个菜单项的描述', value: '详情' },
  // ... 更多数据项
])

const handleBasicItemClick = (item) => {
  console.log('点击了菜单项：', item.title)
}`,
  },

  // 自定义锚点代码
  anchor: {
    template: `<wd-floating-panel
  v-model:height="anchorHeight"
  :anchors="currentAnchors"
  safe-area-inset-bottom
  @height-change="handleAnchorHeightChange"
>
  <view class="p-4 text-center">
    <view class="text-base font-medium mb-4">自定义锚点演示</view>
    <view class="space-y-2">
      <view class="text-xs">锚点配置：{{ formatAnchors }}</view>
      <view class="text-xs">当前高度：{{ addUnit(anchorHeight.toFixed(0)) }}</view>
    </view>
  </view>
</wd-floating-panel>`,

    script: `const anchorHeight = ref(0)
const windowHeight = ref(0)

// 锚点预设配置
const currentAnchors = computed(() => {
  const presets = {
    default: [100, Math.round(windowHeight.value * 0.6)],
    custom1: [120, Math.round(windowHeight.value * 0.4), Math.round(windowHeight.value * 0.8)],
    custom2: [80, 200, 350, Math.round(windowHeight.value * 0.7)]
  }
  return presets[anchorPreset.value] || presets.default
})

const handleAnchorHeightChange = ({ height }) => {
  console.log('面板高度变化：', height)
}`,
  },

  // 拖拽控制代码
  drag: {
    template: `<wd-floating-panel
  :content-draggable="!headerOnlyDrag"
  :duration="animationDuration"
  safe-area-inset-bottom
>
  <view class="p-4">
    <view class="text-base font-medium text-center mb-4">拖拽控制演示</view>
    <!-- 内容区域 -->
  </view>
</wd-floating-panel>`,

    script: `const headerOnlyDrag = ref(false)
const animationDuration = ref(300)

// content-draggable: false 时，只能拖动头部指示条
// duration: 设置动画过渡时长`,
  },

  // 应用场景代码
  scenarios: {
    mapTemplate: `<!-- 地图导航场景 -->
<wd-floating-panel
  v-model:height="mapPanelHeight"
  :anchors="mapAnchors"
  safe-area-inset-bottom
  @height-change="handleMapHeightChange"
>
  <view class="p-4">
    <view class="flex items-center justify-between mb-4">
      <view class="text-lg font-medium">导航信息</view>
      <wd-button type="primary" size="small">开始导航</wd-button>
    </view>

    <view class="space-y-3">
      <view class="bg-blue-50 p-3 rounded">
        <view class="text-sm font-medium">目的地</view>
        <view class="text-xs text-gray-600 mt-1">北京市朝阳区xxx大厦</view>
      </view>
      <!-- 更多导航信息 -->
    </view>
  </view>
</wd-floating-panel>`,

    playerTemplate: `<!-- 音乐播放场景 -->
<wd-floating-panel
  :anchors="playerAnchors"
  safe-area-inset-bottom
>
  <view class="p-4">
    <view class="text-center mb-4">
      <view class="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-2"></view>
      <view class="text-base font-medium">歌曲名称</view>
      <view class="text-sm text-gray-500">歌手名称</view>
    </view>

    <!-- 播放控制 -->
    <view class="flex items-center justify-center space-x-8">
      <wd-icon name="skip-back" size="24px" />
      <wd-icon name="pause" size="32px" />
      <wd-icon name="skip-forward" size="24px" />
    </view>
  </view>
</wd-floating-panel>`,

    commentTemplate: `<!-- 评论列表场景 -->
<wd-floating-panel
  :anchors="commentAnchors"
  safe-area-inset-bottom
>
  <view class="p-4">
    <view class="flex items-center justify-between mb-4">
      <view class="text-lg font-medium">评论 ({{ commentList.length }})</view>
      <wd-button type="primary" size="small">写评论</wd-button>
    </view>

    <view class="space-y-3">
      <view
        v-for="comment in commentList"
        :key="comment.id"
        class="flex space-x-3 p-3 bg-gray-50 rounded"
      >
        <!-- 评论内容 -->
      </view>
    </view>
  </view>
</wd-floating-panel>`,

    script: `// 应用场景锚点配置
const mapAnchors = computed(() => [
  100, // 基本信息
  Math.round(windowHeight.value * 0.4), // 详细信息
  Math.round(windowHeight.value * 0.8)  // 完整内容
])

const playerAnchors = computed(() => [
  120, // 迷你播放器
  Math.round(windowHeight.value * 0.6) // 完整播放器
])

const commentAnchors = computed(() => [
  150, // 评论概览
  Math.round(windowHeight.value * 0.5), // 部分列表
  Math.round(windowHeight.value * 0.9)  // 完整列表
])`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'v-model:height',
    type: 'Number',
    default: '0',
    desc: '面板的显示高度',
  },
  {
    name: 'anchors',
    type: 'Array<Number>',
    default: '[100, windowHeight * 0.6]',
    desc: '设置自定义锚点，面板会自动吸附到这些高度位置',
  },
  {
    name: 'safe-area-inset-bottom',
    type: 'Boolean',
    default: 'false',
    desc: '是否设置底部安全距离（适配 iPhone X 类型机型）',
  },
  {
    name: 'show-scrollbar',
    type: 'Boolean',
    default: 'true',
    desc: '是否显示内容区域的滚动条',
  },
  {
    name: 'duration',
    type: 'String | Number',
    default: '300',
    desc: '动画时长，单位毫秒',
  },
  {
    name: 'content-draggable',
    type: 'Boolean',
    default: 'true',
    desc: '是否允许内容区域拖拽，false 时只能拖动头部指示条',
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
    name: 'update:height',
    desc: '面板高度更新时触发，参数为新的高度值',
  },
  {
    name: 'height-change',
    desc: '面板高度变化时触发，参数为 { height: number }',
  },
]

// ===== 工具方法 =====

/**
 * 获取动画时长标签
 */
const getDurationLabel = (duration: number) => {
  const labels = {
    200: '(快速)',
    300: '(正常)',
    500: '(缓慢)',
  }
  return labels[duration as keyof typeof labels] || ''
}

/**
 * 获取场景描述
 */
const getScenarioDescription = (type: string) => {
  const descriptions = {
    map: '地图导航：显示路线信息、预计时间、路况状态',
    player: '音乐播放：迷你播放器和完整播放控制界面',
    comment: '评论列表：展示用户评论，支持多级展开',
  }
  return descriptions[type as keyof typeof descriptions] || ''
}

// ===== 生命周期 =====

/**
 * 组件挂载时初始化
 */
onMounted(() => {
  // 获取窗口高度
  const { windowHeight: _windowHeight } = uni.getSystemInfoSync()
  windowHeight.value = _windowHeight

  // 设置默认锚点高度
  anchorHeight.value = Math.round(windowHeight.value * 0.4)
  mapPanelHeight.value = 100
})

// ===== 事件处理方法 =====

/**
 * 切换基本面板显示
 */
const toggleBasicPanel = () => {
  showBasicPanel.value = !showBasicPanel.value
  console.log('基本面板状态：', showBasicPanel.value ? '显示' : '隐藏')
}

/**
 * 基本菜单项点击事件
 */
const handleBasicItemClick = (item: any) => {
  console.log('点击了菜单项：', item.title)
}

/**
 * 切换锚点面板显示
 */
const toggleAnchorPanel = () => {
  showAnchorPanel.value = !showAnchorPanel.value
  console.log('锚点面板状态：', showAnchorPanel.value ? '显示' : '隐藏')
}

/**
 * 锚点面板高度变化事件
 */
const handleAnchorHeightChange = ({ height }: { height: number }) => {
  console.log('锚点面板高度变化：', addUnit(height))
}

/**
 * 切换拖拽面板显示
 */
const toggleDragPanel = () => {
  showDragPanel.value = !showDragPanel.value
  console.log('拖拽面板状态：', showDragPanel.value ? '显示' : '隐藏')
}

/**
 * 切换场景面板显示
 */
const toggleScenarioPanel = () => {
  showScenarioPanel.value = !showScenarioPanel.value
  console.log('场景面板状态：', showScenarioPanel.value ? '显示' : '隐藏')
}

/**
 * 地图面板高度变化事件
 */
const handleMapHeightChange = ({ height }: { height: number }) => {
  console.log('地图面板高度变化：', addUnit(height))

  // 根据高度显示不同内容提示
  const anchors = mapAnchors.value
  if (height <= anchors[0] + 20) {
    console.log('当前显示：基本导航信息')
  } else if (height <= anchors[1] + 20) {
    console.log('当前显示：详细导航信息')
  } else {
    console.log('当前显示：完整导航内容')
  }
}

/**
 * 添加评论
 */
const handleAddComment = () => {
  console.log('打开评论编辑器')
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
/* 浮动面板样式调整 */
.floating-panel {
  position: relative;
  min-height: 100vh;
}

/* 确保面板层级正确 */
:deep(.wd-floating-panel) {
  z-index: 100;
}

/* 内容区域样式 */
:deep(.wd-floating-panel__content) {
  max-height: 70vh;
}
</style>
