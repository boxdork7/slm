<!-- Status Tip 状态提示 http://127.0.0.1:100/#/pages-sub/demo/wd/status-tip -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Status Tip 状态提示" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="预设的状态提示图标和文案">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="搜索无结果" vertical>
          <wd-status-tip image="search" tip="当前搜索无结果" />
        </wd-cell>

        <wd-cell title="网络异常" vertical>
          <wd-status-tip image="network" tip="当前网络不可用，请检查你的网络设置" />
        </wd-cell>

        <wd-cell title="页面暂无内容" vertical>
          <wd-status-tip image="content" tip="暂无内容" />
        </wd-cell>

        <wd-cell title="收藏为空" vertical>
          <wd-status-tip image="collect" tip="暂无收藏" />
        </wd-cell>
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 搜索无结果" :code="codes.basic.searchTemplate" />
        <DemoCode title="模板 - 网络异常" :code="codes.basic.networkTemplate" />
        <DemoCode title="模板 - 页面暂无内容" :code="codes.basic.contentTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 预设图标示例 -->
    <DemoSection title="预设图标" desc="内置的常用状态提示图标">
      <wd-cell-group>
        <wd-cell title="评论为空" vertical>
          <wd-status-tip image="comment" tip="暂无评论" />
        </wd-cell>

        <wd-cell title="支付失败" vertical>
          <wd-status-tip image="halo" tip="支付失败，请重新订购" />
        </wd-cell>

        <wd-cell title="消息订阅" vertical>
          <wd-status-tip image="message" tip="已订阅全部消息" />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 预设图标" :code="codes.preset.template" />
        <DemoCode title="脚本 - 预设图标" :code="codes.preset.script" />
      </template>
    </DemoSection>

    <!-- 自定义配置示例 -->
    <DemoSection title="自定义配置" desc="自定义图片尺寸和外部图片地址">
      <wd-cell-group>
        <wd-cell title="自定义尺寸" vertical>
          <view class="mb-2 text-sm text-gray-600">
            自定义图片宽高：300 x 200
          </view>
          <wd-status-tip
            :image-size="{ height: 200, width: 300 }"
            image="search"
            tip="当前搜索无结果"
          />
        </wd-cell>

        <wd-cell title="自定义图片" vertical>
          <view class="mb-2 text-sm text-gray-600">
            使用网络图片作为状态图标
          </view>
          <wd-status-tip
            image="https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg"
            tip="查看我的头像"
          />
        </wd-cell>

        <wd-cell title="数字尺寸" vertical>
          <view class="mb-2 text-sm text-gray-600">
            使用数字设置统一宽高：150px
          </view>
          <wd-status-tip
            :image-size="150"
            image="content"
            tip="自定义尺寸显示"
          />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 自定义尺寸" :code="codes.custom.sizeTemplate" />
        <DemoCode title="模板 - 自定义图片" :code="codes.custom.imageTemplate" />
        <DemoCode title="模板 - 数字尺寸" :code="codes.custom.numberSizeTemplate" />
        <DemoCode title="脚本 - 自定义配置" :code="codes.custom.script" />
      </template>
    </DemoSection>

    <!-- 插槽自定义示例 -->
    <DemoSection title="插槽自定义" desc="使用插槽自定义图片和内容区域">
      <wd-cell-group>
        <wd-cell title="自定义图片插槽" vertical>
          <view class="mb-2 text-sm text-gray-600">
            使用图标作为状态提示图片
          </view>
          <wd-status-tip tip="插槽自定义图片内容">
            <template #image>
              <wd-icon name="ie-filled" size="100px" color="#409eff" />
            </template>
          </wd-status-tip>
        </wd-cell>

        <wd-cell title="自定义内容插槽" vertical>
          <view class="mb-2 text-sm text-gray-600">
            自定义多行文本和操作按钮
          </view>
          <wd-status-tip image="content">
            <template #default>
              <view class="text-center text-gray-500">
                <view class="mb-1 text-base">暂无相关内容</view>
                <view class="text-sm">请尝试其他关键词</view>
                <view class="text-sm">或稍后再试</view>
              </view>
            </template>
          </wd-status-tip>
        </wd-cell>

        <wd-cell title="带操作按钮" vertical>
          <view class="mb-2 text-sm text-gray-600">
            在状态提示下方添加操作按钮
          </view>
          <wd-status-tip image="network" tip="网络连接失败">
            <template #default>
              <view class="mt-6 space-y-3">
                <wd-button type="primary" size="small" @click="handleRetry">
                  重试
                </wd-button>
                <wd-button size="small" plain @click="handleRefresh">
                  刷新页面
                </wd-button>
              </view>
            </template>
          </wd-status-tip>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 自定义图片插槽" :code="codes.slots.imageTemplate" />
        <DemoCode title="模板 - 自定义内容插槽" :code="codes.slots.contentTemplate" />
        <DemoCode title="模板 - 带操作按钮" :code="codes.slots.buttonTemplate" />
        <DemoCode title="脚本 - 插槽自定义" :code="codes.slots.script" />
      </template>
    </DemoSection>

    <!-- 图片模式示例 -->
    <DemoSection title="图片模式" desc="不同的图片裁剪和缩放模式">
      <wd-cell-group>
        <wd-cell title="aspectFit 模式" vertical>
          <view class="mb-2 text-sm text-gray-600">
            保持纵横比缩放图片，使图片的长边能完全显示出来
          </view>
          <wd-status-tip
            image="https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg"
            image-mode="aspectFit"
            :image-size="{ width: 200, height: 120 }"
            tip="aspectFit 模式"
          />
        </wd-cell>

        <wd-cell title="aspectFill 模式" vertical>
          <view class="mb-2 text-sm text-gray-600">
            保持纵横比缩放图片，只保证图片的短边能完全显示出来
          </view>
          <wd-status-tip
            image="https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg"
            image-mode="aspectFill"
            :image-size="{ width: 200, height: 120 }"
            tip="aspectFill 模式"
          />
        </wd-cell>

        <wd-cell title="scaleToFill 模式" vertical>
          <view class="mb-2 text-sm text-gray-600">
            不保持纵横比缩放图片，使图片的宽高完全拉伸至填满容器
          </view>
          <wd-status-tip
            image="https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg"
            image-mode="scaleToFill"
            :image-size="{ width: 200, height: 120 }"
            tip="scaleToFill 模式"
          />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 图片模式" :code="codes.imageMode.template" />
        <DemoCode title="脚本 - 图片模式" :code="codes.imageMode.script" />
      </template>
    </DemoSection>

    <!-- 实际应用场景示例 -->
    <DemoSection title="实际应用场景" desc="模拟不同页面状态的动态切换">
      <!-- 场景切换控制区域 -->
      <view class="space-y-4">
        <!-- 状态切换按钮 -->
        <view class="px-4">
          <view class="mb-3 text-sm font-medium">选择场景状态</view>
          <view class="flex flex-wrap gap-2">
            <wd-button
              v-for="(scenario, key) in scenarios"
              :key="key"
              size="small"
              :type="currentScenario === key ? 'primary' : 'default'"
              @click="handleScenarioChange(key)"
            >
              {{ scenario.title }}
            </wd-button>
          </view>
        </view>

        <!-- 动态状态提示显示区域 -->
        <view class="mx-4 min-h-64 flex items-center justify-center rounded-lg bg-gray-50 p-6">
          <wd-status-tip
            :image="scenarios[currentScenario].image"
            :tip="scenarios[currentScenario].tip"
          >
            <template v-if="scenarios[currentScenario].showButton" #default>
              <view class="mt-6">
                <wd-button
                  type="primary"
                  size="small"
                  @click="handleScenarioAction"
                >
                  {{ scenarios[currentScenario].buttonText }}
                </wd-button>
              </view>
            </template>
          </wd-status-tip>
        </view>

        <!-- 操作记录显示 -->
        <view v-if="actionLogs.length > 0" class="mx-4 rounded-lg bg-white p-4">
          <view class="mb-3 text-sm font-medium">操作记录</view>
          <view class="max-h-32 overflow-y-auto rounded bg-gray-50 p-3">
            <view
              v-for="(log, index) in actionLogs"
              :key="index"
              class="mb-2 text-xs last:mb-0"
            >
              <text class="text-gray-400">[{{ log.time }}]</text>
              {{ log.message }}
            </view>
          </view>
          <view class="mt-3">
            <wd-button size="small" plain @click="handleClearLogs">
              清空记录
            </wd-button>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 场景切换" :code="codes.scenarios.template" />
        <DemoCode title="脚本 - 场景配置" :code="codes.scenarios.scenariosScript" />
        <DemoCode title="脚本 - 事件处理" :code="codes.scenarios.handlersScript" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// ===== 组件状态管理 =====

// 当前场景状态
const currentScenario = ref<string>('empty')

// 操作日志
interface ActionLog {
  time: string
  message: string
}

const actionLogs = ref<ActionLog[]>([])

// 不同应用场景配置
const scenarios = reactive({
  empty: {
    title: '空白页',
    image: 'content',
    tip: '暂无内容',
    showButton: false,
    buttonText: ''
  },
  search: {
    title: '搜索无果',
    image: 'search',
    tip: '未找到相关内容，换个关键词试试',
    showButton: true,
    buttonText: '重新搜索'
  },
  network: {
    title: '网络错误',
    image: 'network',
    tip: '网络连接异常，请检查网络设置',
    showButton: true,
    buttonText: '重新加载'
  },
  collect: {
    title: '收藏为空',
    image: 'collect',
    tip: '还没有收藏任何内容',
    showButton: true,
    buttonText: '去逛逛'
  },
  order: {
    title: '订单为空',
    image: 'halo',
    tip: '您还没有任何订单',
    showButton: true,
    buttonText: '去购物'
  },
  message: {
    title: '消息为空',
    image: 'message',
    tip: '暂无新消息',
    showButton: false,
    buttonText: ''
  }
})

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    searchTemplate: `<wd-status-tip image="search" tip="当前搜索无结果" />`,

    networkTemplate: `<wd-status-tip image="network" tip="当前网络不可用，请检查你的网络设置" />`,

    contentTemplate: `<wd-status-tip image="content" tip="暂无内容" />`,

    script: `// 基本用法 - 使用预设图标类型
// 可选值：search, network, content, collect, comment, halo, message
const imageType = ref('search')
const tipMessage = ref('当前搜索无结果')`
  },

  // 预设图标代码
  preset: {
    template: `<!-- 评论为空 -->
<wd-status-tip image="comment" tip="暂无评论" />

<!-- 支付失败 -->
<wd-status-tip image="halo" tip="支付失败，请重新订购" />

<!-- 消息订阅 -->
<wd-status-tip image="message" tip="已订阅全部消息" />`,

    script: `// 预设图标类型枚举
type PresetImageType = 'search' | 'network' | 'content' | 'collect' | 'comment' | 'halo' | 'message'

// 预设图标配置
const presetImages = {
  search: '搜索无结果',
  network: '网络异常',
  content: '页面暂无内容',
  collect: '收藏为空',
  comment: '评论为空',
  halo: '支付失败',
  message: '消息订阅'
}`
  },

  // 自定义配置代码
  custom: {
    sizeTemplate: `<wd-status-tip
  :image-size="{ height: 200, width: 300 }"
  image="search"
  tip="当前搜索无结果"
/>`,

    imageTemplate: `<wd-status-tip
  image="https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg"
  tip="查看我的头像"
/>`,

    numberSizeTemplate: `<wd-status-tip
  :image-size="150"
  image="content"
  tip="自定义尺寸显示"
/>`,

    script: `import { ref } from 'vue'

// 自定义图片尺寸（对象格式）
const customImageSize = ref({
  height: 200,
  width: 300
})

// 自定义图片尺寸（数字格式，同时设置宽高）
const numberSize = ref(150)

// 自定义图片地址
const customImageUrl = ref('https://example.com/custom-image.jpg')`
  },

  // 插槽自定义代码
  slots: {
    imageTemplate: `<wd-status-tip tip="插槽自定义图片内容">
  <template #image>
    <wd-icon name="ie-filled" size="100px" color="#409eff" />
  </template>
</wd-status-tip>`,

    contentTemplate: `<wd-status-tip image="content">
  <template #default>
    <view class="text-center text-gray-500">
      <view class="mb-1 text-base">暂无相关内容</view>
      <view class="text-sm">请尝试其他关键词</view>
      <view class="text-sm">或稍后再试</view>
    </view>
  </template>
</wd-status-tip>`,

    buttonTemplate: `<wd-status-tip image="network" tip="网络连接失败">
  <template #default>
    <view class="mt-6 space-y-3">
      <wd-button type="primary" size="small" @click="handleRetry">
        重试
      </wd-button>
      <wd-button size="small" plain @click="handleRefresh">
        刷新页面
      </wd-button>
    </view>
  </template>
</wd-status-tip>`,

    script: `// 插槽自定义事件处理
const handleRetry = () => {
  console.log('点击了重试按钮')
  // 执行重试逻辑
}

const handleRefresh = () => {
  console.log('点击了刷新页面按钮')
  // 执行页面刷新逻辑
}`
  },

  // 图片模式代码
  imageMode: {
    template: `<!-- aspectFit 模式 -->
<wd-status-tip
  image="https://example.com/image.jpg"
  image-mode="aspectFit"
  :image-size="{ width: 200, height: 120 }"
  tip="aspectFit 模式"
/>

<!-- aspectFill 模式 -->
<wd-status-tip
  image="https://example.com/image.jpg"
  image-mode="aspectFill"
  :image-size="{ width: 200, height: 120 }"
  tip="aspectFill 模式"
/>

<!-- scaleToFill 模式 -->
<wd-status-tip
  image="https://example.com/image.jpg"
  image-mode="scaleToFill"
  :image-size="{ width: 200, height: 120 }"
  tip="scaleToFill 模式"
/>`,

    script: `// 图片模式类型定义
type ImageMode = 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix' | 'heightFix' |
                 'top' | 'bottom' | 'center' | 'left' | 'right' |
                 'top left' | 'top right' | 'bottom left' | 'bottom right'

const imageMode = ref<ImageMode>('aspectFit')
const imageSize = ref({ width: 200, height: 120 })`
  },

  // 应用场景代码
  scenarios: {
    template: `<!-- 状态切换按钮 -->
<view class="flex flex-wrap gap-2">
  <wd-button
    v-for="(scenario, key) in scenarios"
    :key="key"
    size="small"
    :type="currentScenario === key ? 'primary' : 'default'"
    @click="handleScenarioChange(key)"
  >
    {{ scenario.title }}
  </wd-button>
</view>

<!-- 动态状态提示 -->
<wd-status-tip
  :image="scenarios[currentScenario].image"
  :tip="scenarios[currentScenario].tip"
>
  <template v-if="scenarios[currentScenario].showButton" #default>
    <view class="mt-6">
      <wd-button
        type="primary"
        size="small"
        @click="handleScenarioAction"
      >
        {{ scenarios[currentScenario].buttonText }}
      </wd-button>
    </view>
  </template>
</wd-status-tip>`,

    scenariosScript: `import { ref, reactive } from 'vue'

// 场景配置类型定义
interface ScenarioConfig {
  title: string
  image: string
  tip: string
  showButton: boolean
  buttonText: string
}

// 当前场景状态
const currentScenario = ref<string>('empty')

// 不同应用场景配置
const scenarios = reactive<Record<string, ScenarioConfig>>({
  empty: {
    title: '空白页',
    image: 'content',
    tip: '暂无内容',
    showButton: false,
    buttonText: ''
  },
  search: {
    title: '搜索无果',
    image: 'search',
    tip: '未找到相关内容，换个关键词试试',
    showButton: true,
    buttonText: '重新搜索'
  },
  network: {
    title: '网络错误',
    image: 'network',
    tip: '网络连接异常，请检查网络设置',
    showButton: true,
    buttonText: '重新加载'
  }
})`,

    handlersScript: `// 操作日志类型定义
interface ActionLog {
  time: string
  message: string
}

const actionLogs = ref<ActionLog[]>([])

// 添加操作日志
const addActionLog = (message: string) => {
  const time = new Date().toLocaleTimeString()
  actionLogs.value.unshift({ time, message })

  // 保持日志数量不超过 10 条
  if (actionLogs.value.length > 10) {
    actionLogs.value = actionLogs.value.slice(0, 10)
  }
}

// 场景切换处理
const handleScenarioChange = (scenarioKey: string) => {
  currentScenario.value = scenarioKey
  const scenario = scenarios[scenarioKey]
  addActionLog(\`切换到 \${scenario.title} 场景\`)
}

// 场景操作按钮处理
const handleScenarioAction = () => {
  const scenario = scenarios[currentScenario.value]
  addActionLog(\`在 \${scenario.title} 场景中点击了 \${scenario.buttonText} 按钮\`)
}

// 清空操作日志
const handleClearLogs = () => {
  actionLogs.value = []
}`
  }
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'image',
    type: 'String',
    default: '"network"',
    desc: '缺省图片类型，支持传入图片 URL，可选值：search / network / content / collect / comment / halo / message'
  },
  {
    name: 'image-size',
    type: 'String | Number | Object',
    default: '""',
    desc: '图片大小，默认单位为 px，支持对象格式 { width: 100, height: 100 }'
  },
  {
    name: 'tip',
    type: 'String',
    default: '""',
    desc: '提示文案'
  },
  {
    name: 'image-mode',
    type: 'String',
    default: '"aspectFill"',
    desc: '图片裁剪、缩放的模式，可选值同 image 组件的 mode 属性'
  },
  {
    name: 'url-prefix',
    type: 'String',
    default: '"https://registry.npmmirror.com/wot-design-uni-assets/*/files/"',
    desc: '图片路径前缀，指向图片所在目录，用于拼接图片 URL'
  },
  {
    name: 'custom-style',
    type: 'String',
    default: '""',
    desc: '自定义根节点样式'
  },
  {
    name: 'custom-class',
    type: 'String',
    default: '""',
    desc: '自定义根节点样式类'
  }
]

// Events 事件文档（StatusTip 组件没有事件）
const apiEvents: any[] = []

// ===== 工具方法 =====

/**
 * 添加操作日志
 */
const addActionLog = (message: string) => {
  const time = new Date().toLocaleTimeString()
  actionLogs.value.unshift({ time, message })

  // 保持日志数量不超过 10 条
  if (actionLogs.value.length > 10) {
    actionLogs.value = actionLogs.value.slice(0, 10)
  }
}

// ===== 事件处理方法 =====

/**
 * 重试按钮处理
 */
const handleRetry = () => {
  addActionLog('点击了重试按钮')
  console.log('执行重试操作')
}

/**
 * 刷新页面处理
 */
const handleRefresh = () => {
  addActionLog('点击了刷新页面按钮')
  console.log('执行页面刷新操作')
}

/**
 * 场景切换处理
 */
const handleScenarioChange = (scenarioKey: string) => {
  currentScenario.value = scenarioKey
  const scenario = scenarios[scenarioKey as keyof typeof scenarios]
  addActionLog(`切换到 ${scenario.title} 场景`)
  console.log(`场景切换：${scenario.title}`)
}

/**
 * 场景操作按钮处理
 */
const handleScenarioAction = () => {
  const scenario = scenarios[currentScenario.value as keyof typeof scenarios]
  addActionLog(`在 ${scenario.title} 场景中点击了 ${scenario.buttonText} 按钮`)
  console.log(`场景操作：${scenario.title} - ${scenario.buttonText}`)
}

/**
 * 清空操作日志
 */
const handleClearLogs = () => {
  actionLogs.value = []
  console.log('操作日志已清空')
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
