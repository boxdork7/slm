<!-- Rate 评分 http://127.0.0.1:100/#/pages-sub/demo/wd/rate -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Rate 评分" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最基础的评分组件，支持点击和滑动评分">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="基础评分" vertical>
          <wd-rate v-model="basicValue" @change="handleBasicChange" />
        </wd-cell>

        <wd-cell title="当前分数">
          <wd-text :text="`${basicValue} 分`" />
        </wd-cell>
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基本用法" :code="codes.basic.template" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 状态控制示例 -->
    <DemoSection title="状态控制" desc="支持只读和禁用两种状态控制">
      <wd-cell-group>
        <wd-cell title="只读状态" vertical>
          <wd-rate v-model="readonlyValue" readonly />
        </wd-cell>

        <wd-cell title="禁用状态" vertical>
          <wd-rate v-model="disabledValue" disabled />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 状态控制" :code="codes.state.template" />
        <DemoCode title="脚本 - 状态控制" :code="codes.state.script" />
      </template>
    </DemoSection>

    <!-- 自定义颜色示例 -->
    <DemoSection title="自定义颜色" desc="支持单色和渐变色，以及分段颜色配置">
      <wd-cell-group>
        <wd-cell title="渐变色" vertical>
          <wd-rate
            v-model="gradientValue"
            active-color="linear-gradient(180deg, rgba(255,238,0,1) 0%,rgba(250,176,21,1) 100%)"
          />
        </wd-cell>

        <wd-cell title="分段颜色" vertical>
          <wd-rate v-model="segmentValue" :active-color="segmentColors" />
        </wd-cell>

        <wd-cell title="纯色配置" vertical>
          <wd-rate v-model="solidValue" active-color="#ff4757" />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 自定义颜色" :code="codes.color.template" />
        <DemoCode title="脚本 - 自定义颜色" :code="codes.color.script" />
      </template>
    </DemoSection>

    <!-- 自定义图标示例 -->
    <DemoSection title="自定义图标" desc="支持自定义图标和图标颜色">
      <wd-cell-group>
        <wd-cell title="爱心图标" vertical>
          <wd-rate
            v-model="heartValue"
            icon="like"
            active-icon="like-fill"
            active-color="#ff4757"
          />
        </wd-cell>

        <wd-cell title="拇指图标" vertical>
          <wd-rate v-model="thumbValue" icon="dong" active-icon="dong" active-color="#2ed573" />
        </wd-cell>

        <wd-cell title="自定义图标颜色" vertical>
          <wd-rate
            v-model="customIconValue"
            icon="star"
            active-icon="star-fill"
            color="#ddd"
            active-color="#4D80F0"
          />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 自定义图标" :code="codes.icon.template" />
        <DemoCode title="脚本 - 自定义图标" :code="codes.icon.script" />
      </template>
    </DemoSection>

    <!-- 尺寸和间距示例 -->
    <DemoSection title="尺寸和间距" desc="自定义图标大小和间距">
      <wd-cell-group>
        <wd-cell title="大尺寸" vertical>
          <wd-rate v-model="largeValue" size="40px" space="12px" />
        </wd-cell>

        <wd-cell title="小尺寸" vertical>
          <wd-rate v-model="smallValue" size="24px" space="4px" />
        </wd-cell>

        <wd-cell title="紧凑布局" vertical>
          <wd-rate v-model="compactValue" size="32px" space="2px" />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 尺寸和间距" :code="codes.size.template" />
        <DemoCode title="脚本 - 尺寸和间距" :code="codes.size.script" />
      </template>
    </DemoSection>

    <!-- 半选功能示例 -->
    <DemoSection title="半选功能" desc="允许选择半颗星，支持更精确的评分">
      <wd-cell-group>
        <wd-cell title="允许半选" vertical>
          <wd-rate v-model="halfValue" allow-half @change="handleHalfChange" />
        </wd-cell>

        <wd-cell title="半选结果">
          <wd-text :text="`${halfValue} 分`" />
        </wd-cell>

        <wd-cell title="半选 + 自定义颜色" vertical>
          <wd-rate v-model="halfColorValue" allow-half active-color="#fa8c16" />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 半选功能" :code="codes.half.template" />
        <DemoCode title="脚本 - 半选功能" :code="codes.half.script" />
      </template>
    </DemoSection>

    <!-- 评分数量示例 -->
    <DemoSection title="评分数量" desc="自定义评分的最大数量">
      <wd-cell-group>
        <wd-cell title="3星评分" vertical>
          <wd-rate v-model="threeValue" :num="3" />
        </wd-cell>

        <wd-cell title="7星评分" vertical>
          <wd-rate v-model="sevenValue" :num="7" size="28px" />
        </wd-cell>

        <wd-cell title="10星评分" vertical>
          <wd-rate v-model="tenValue" :num="10" size="24px" space="4px" />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 评分数量" :code="codes.number.template" />
        <DemoCode title="脚本 - 评分数量" :code="codes.number.script" />
      </template>
    </DemoSection>

    <!-- 交互演示示例 -->
    <DemoSection title="交互演示" desc="展示评分组件的各种交互方式">
      <!-- 交互演示区域 -->
      <view class="space-y-4">
        <!-- 可交互评分 -->
        <wd-cell title="点击或滑动评分" vertical>
          <wd-rate v-model="interactiveValue" @change="handleInteractiveChange" />
        </wd-cell>

        <!-- 控制按钮 -->
        <view class="px-4">
          <view class="flex justify-center space-x-2">
            <wd-button type="primary" size="small" @click="handleReset">
              <wd-text text="重置" />
            </wd-button>
            <wd-button type="success" size="small" @click="handleRandomRate">
              <wd-text text="随机评分" />
            </wd-button>
          </view>
        </view>

        <!-- 状态显示 -->
        <view class="mx-4 rounded-lg bg-blue-50 px-4 py-2">
          <view class="text-xs text-blue-600 font-medium">
            💡 当前评分：{{ interactiveValue }} 分 | {{ getRatingText(interactiveValue) }}
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 交互演示" :code="codes.interactive.template" />
        <DemoCode title="脚本 - 交互演示" :code="codes.interactive.script" />
      </template>
    </DemoSection>

    <!-- 实际应用场景 -->
    <DemoSection title="实际应用场景" desc="常见的业务场景示例">
      <!-- 商品评价 -->
      <view class="space-y-4">
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">商品评价</view>
          <view class="mx-4 rounded-lg bg-gray-50 p-4">
            <view class="mb-3 flex items-center justify-between">
              <view class="text-sm font-medium">商品满意度</view>
              <view class="text-xs text-gray-500">{{ productRating }} 分</view>
            </view>
            <wd-rate v-model="productRating" allow-half />
            <view class="mt-2 text-xs text-gray-500">
              {{ getProductRatingText() }}
            </view>
          </view>
        </view>

        <!-- 服务评价 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">服务评价</view>
          <view class="mx-4 rounded-lg bg-gray-50 p-4 space-y-3">
            <view v-for="service in serviceRatings" :key="service.name">
              <view class="mb-1 flex justify-between">
                <view class="text-xs text-gray-600">{{ service.name }}</view>
                <view class="text-xs text-gray-500">{{ service.rating }} 分</view>
              </view>
              <wd-rate
                v-model="service.rating"
                size="20px"
                space="4px"
                :active-color="service.color"
              />
            </view>
            <view class="mt-3 border-t border-gray-200 pt-3">
              <view class="flex justify-between">
                <view class="text-sm font-medium">综合评分</view>
                <view class="text-sm text-orange-600 font-medium">{{ getAverageRating() }} 分</view>
              </view>
            </view>
          </view>
        </view>

        <!-- 难度评级 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">难度评级</view>
          <view class="mx-4 rounded-lg bg-gray-50 p-4">
            <view class="mb-3 flex items-center justify-between">
              <view class="text-sm font-medium">题目难度</view>
              <view class="text-xs" :class="getDifficultyClass()">
                {{ getDifficultyText() }}
              </view>
            </view>
            <wd-rate
              v-model="difficultyRating"
              icon="star"
              active-icon="star-fill"
              :active-color="difficultyColors"
            />
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 商品评价" :code="codes.scenarios.productTemplate" />
        <DemoCode title="模板 - 服务评价" :code="codes.scenarios.serviceTemplate" />
        <DemoCode title="模板 - 难度评级" :code="codes.scenarios.difficultyTemplate" />
        <DemoCode title="脚本 - 应用场景" :code="codes.scenarios.script" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// ===== 组件状态管理 =====

// 基本用法
const basicValue = ref<number>(5)

// 状态控制
const readonlyValue = ref<number>(3)
const disabledValue = ref<number>(2)

// 自定义颜色
const gradientValue = ref<number>(3)
const segmentValue = ref<number>(4)
const solidValue = ref<number>(4)

// 自定义图标
const heartValue = ref<number>(4)
const thumbValue = ref<number>(3)
const customIconValue = ref<number>(4)

// 尺寸和间距
const largeValue = ref<number>(4)
const smallValue = ref<number>(5)
const compactValue = ref<number>(3)

// 半选功能
const halfValue = ref<number>(2.5)
const halfColorValue = ref<number>(3.5)

// 评分数量
const threeValue = ref<number>(2)
const sevenValue = ref<number>(5)
const tenValue = ref<number>(7)

// 交互演示
const interactiveValue = ref<number>(3)

// 应用场景
const productRating = ref<number>(4.5)
const difficultyRating = ref<number>(3)

// 服务评价数据
const serviceRatings = ref([
  { name: '服务态度', rating: 5, color: '#52c41a' },
  { name: '配送速度', rating: 4, color: '#1890ff' },
  { name: '商品质量', rating: 4.5, color: '#fa8c16' },
  { name: '包装完整', rating: 5, color: '#722ed1' },
])

// ===== 数据配置 =====

// 分段颜色配置
const segmentColors = ref<string[]>([
  'linear-gradient(180deg, rgba(255,238,0,1) 0%,rgba(250,176,21,1) 100%)',
  'linear-gradient(315deg, rgba(245,34,34,1) 0%,rgba(255,117,102,1) 100%)',
])

// 难度颜色配置
const difficultyColors = ref<string[]>([
  'linear-gradient(180deg, rgba(34,193,195,1) 0%,rgba(253,187,45,1) 100%)',
  'linear-gradient(315deg, rgba(245,34,34,1) 0%,rgba(255,117,102,1) 100%)',
])

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    template: `<wd-rate v-model="basicValue" @change="handleBasicChange" />`,

    script: `import { ref } from 'vue'

const basicValue = ref(5)

const handleBasicChange = ({ value }) => {
  console.log('评分变化：', value)
}`,
  },

  // 状态控制代码
  state: {
    template: `<!-- 只读状态 -->
<wd-rate v-model="readonlyValue" readonly />

<!-- 禁用状态 -->
<wd-rate v-model="disabledValue" disabled />`,

    script: `import { ref } from 'vue'

const readonlyValue = ref(3)
const disabledValue = ref(2)`,
  },

  // 自定义颜色代码
  color: {
    template: `<!-- 渐变色 -->
<wd-rate
  v-model="gradientValue"
  active-color="linear-gradient(180deg, rgba(255,238,0,1) 0%,rgba(250,176,21,1) 100%)"
/>

<!-- 分段颜色 -->
<wd-rate v-model="segmentValue" :active-color="segmentColors" />

<!-- 纯色配置 -->
<wd-rate v-model="solidValue" active-color="#ff4757" />`,

    script: `import { ref } from 'vue'

const gradientValue = ref(3)
const segmentValue = ref(4)
const solidValue = ref(4)

// 分段颜色配置
const segmentColors = ref([
  'linear-gradient(180deg, rgba(255,238,0,1) 0%,rgba(250,176,21,1) 100%)',
  'linear-gradient(315deg, rgba(245,34,34,1) 0%,rgba(255,117,102,1) 100%)',
])`,
  },

  // 自定义图标代码
  icon: {
    template: `<!-- 爱心图标 -->
<wd-rate
  v-model="heartValue"
  icon="like"
  active-icon="like-fill"
  active-color="#ff4757"
/>

<!-- 拇指图标 -->
<wd-rate
  v-model="thumbValue"
  icon="dong"
  active-icon="dong"
  active-color="#2ed573"
/>

<!-- 自定义图标颜色 -->
<wd-rate
  v-model="customIconValue"
  icon="star"
  active-icon="star-fill"
  color="#ddd"
  active-color="#4D80F0"
/>`,

    script: `import { ref } from 'vue'

const heartValue = ref(4)
const thumbValue = ref(3)
const customIconValue = ref(4)`,
  },

  // 尺寸和间距代码
  size: {
    template: `<!-- 大尺寸 -->
<wd-rate v-model="largeValue" size="40px" space="12px" />

<!-- 小尺寸 -->
<wd-rate v-model="smallValue" size="24px" space="4px" />

<!-- 紧凑布局 -->
<wd-rate v-model="compactValue" size="32px" space="2px" />`,

    script: `import { ref } from 'vue'

const largeValue = ref(4)
const smallValue = ref(5)
const compactValue = ref(3)`,
  },

  // 半选功能代码
  half: {
    template: `<!-- 允许半选 -->
<wd-rate v-model="halfValue" allow-half @change="handleHalfChange" />

<!-- 半选 + 自定义颜色 -->
<wd-rate
  v-model="halfColorValue"
  allow-half
  active-color="#fa8c16"
/>`,

    script: `import { ref } from 'vue'

const halfValue = ref(2.5)
const halfColorValue = ref(3.5)

const handleHalfChange = ({ value }) => {
  console.log('半选评分：', value)
}`,
  },

  // 评分数量代码
  number: {
    template: `<!-- 3星评分 -->
<wd-rate v-model="threeValue" :num="3" />

<!-- 7星评分 -->
<wd-rate v-model="sevenValue" :num="7" size="28px" />

<!-- 10星评分 -->
<wd-rate v-model="tenValue" :num="10" size="24px" space="4px" />`,

    script: `import { ref } from 'vue'

const threeValue = ref(2)
const sevenValue = ref(5)
const tenValue = ref(7)`,
  },

  // 交互演示代码
  interactive: {
    template: `<template>
  <!-- 可交互评分 -->
  <wd-rate v-model="interactiveValue" @change="handleInteractiveChange" />

  <!-- 控制按钮 -->
  <view class="flex space-x-2 justify-center">
    <wd-button type="primary" size="small" @click="handleReset">
      <wd-text text="重置" />
    </wd-button>
    <wd-button type="success" size="small" @click="handleRandomRate">
      <wd-text text="随机评分" />
    </wd-button>
  </view>

  <!-- 状态显示 -->
  <view class="text-xs text-blue-600 font-medium">
    💡 当前评分：{{ interactiveValue }} 分 | {{ getRatingText(interactiveValue) }}
  </view>
</template>`,

    script: `import { ref } from 'vue'

const interactiveValue = ref(3)

const handleInteractiveChange = ({ value }) => {
  console.log('交互评分变化：', value)
}

/**
 * 重置评分
 */
const handleReset = () => {
  interactiveValue.value = 0
}

/**
 * 随机评分
 */
const handleRandomRate = () => {
  interactiveValue.value = Math.floor(Math.random() * 5) + 1
}

/**
 * 获取评分文本
 */
const getRatingText = (rating) => {
  const texts = ['未评分', '很差', '较差', '一般', '良好', '优秀']
  return texts[Math.floor(rating)] || texts[0]
}`,
  },

  // 应用场景代码
  scenarios: {
    productTemplate: `<!-- 商品评价 -->
<view class="mx-4 rounded-lg bg-gray-50 p-4">
  <view class="flex items-center justify-between mb-3">
    <view class="text-sm font-medium">商品满意度</view>
    <view class="text-xs text-gray-500">{{ productRating }} 分</view>
  </view>
  <wd-rate v-model="productRating" allow-half />
  <view class="mt-2 text-xs text-gray-500">
    {{ getProductRatingText() }}
  </view>
</view>`,

    serviceTemplate: `<!-- 服务评价 -->
<view v-for="service in serviceRatings" :key="service.name">
  <view class="flex justify-between mb-1">
    <view class="text-xs text-gray-600">{{ service.name }}</view>
    <view class="text-xs text-gray-500">{{ service.rating }} 分</view>
  </view>
  <wd-rate
    v-model="service.rating"
    size="20px"
    space="4px"
    :active-color="service.color"
  />
</view>`,

    difficultyTemplate: `<!-- 难度评级 -->
<view class="mx-4 rounded-lg bg-gray-50 p-4">
  <view class="flex items-center justify-between mb-3">
    <view class="text-sm font-medium">题目难度</view>
    <view class="text-xs" :class="getDifficultyClass()">
      {{ getDifficultyText() }}
    </view>
  </view>
  <wd-rate
    v-model="difficultyRating"
    icon="star"
    active-icon="star-fill"
    :active-color="difficultyColors"
  />
</view>`,

    script: `// 应用场景数据
const productRating = ref(4.5)
const difficultyRating = ref(3)

const serviceRatings = ref([
  { name: '服务态度', rating: 5, color: '#52c41a' },
  { name: '配送速度', rating: 4, color: '#1890ff' },
  { name: '商品质量', rating: 4.5, color: '#fa8c16' },
  { name: '包装完整', rating: 5, color: '#722ed1' },
])

const difficultyColors = ref([
  'linear-gradient(180deg, rgba(34,193,195,1) 0%,rgba(253,187,45,1) 100%)',
  'linear-gradient(315deg, rgba(245,34,34,1) 0%,rgba(255,117,102,1) 100%)',
])

/**
 * 获取商品评价文本
 */
const getProductRatingText = () => {
  if (productRating.value >= 4.5) return '非常满意'
  if (productRating.value >= 3.5) return '比较满意'
  if (productRating.value >= 2.5) return '一般'
  if (productRating.value >= 1.5) return '不太满意'
  return '很不满意'
}

/**
 * 获取综合评分
 */
const getAverageRating = () => {
  const total = serviceRatings.value.reduce((sum, item) => sum + item.rating, 0)
  return (total / serviceRatings.value.length).toFixed(1)
}

/**
 * 获取难度文本
 */
const getDifficultyText = () => {
  const texts = ['', '简单', '较简单', '中等', '较难', '困难']
  return texts[difficultyRating.value] || '未评级'
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'model-value',
    type: 'Number',
    default: 'null',
    desc: '当前分数，使用 v-model 进行双向绑定',
  },
  {
    name: 'num',
    type: 'Number',
    default: '5',
    desc: '评分最大值',
  },
  {
    name: 'readonly',
    type: 'Boolean',
    default: 'false',
    desc: '是否只读',
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: '是否禁用',
  },
  {
    name: 'size',
    type: 'String',
    default: '"32"',
    desc: '图标大小',
  },
  {
    name: 'space',
    type: 'String',
    default: '"8"',
    desc: '图标间距',
  },
  {
    name: 'color',
    type: 'String',
    default: '"#E8E8E8"',
    desc: '未选中的图标颜色',
  },
  {
    name: 'active-color',
    type: 'String | Array<String>',
    default: '"linear-gradient(180deg, rgba(255,238,0,1) 0%,rgba(250,176,21,1) 100%)"',
    desc: '选中的图标颜色，支持传颜色数组用于分段颜色',
  },
  {
    name: 'icon',
    type: 'String',
    default: '"star"',
    desc: '未选中的图标名称',
  },
  {
    name: 'active-icon',
    type: 'String',
    default: '"star-fill"',
    desc: '选中的图标名称',
  },
  {
    name: 'disabled-color',
    type: 'String',
    default: '"linear-gradient(315deg, rgba(177,177,177,1) 0%,rgba(199,199,199,1) 100%)"',
    desc: '禁用状态的图标颜色',
  },
  {
    name: 'allow-half',
    type: 'Boolean',
    default: 'false',
    desc: '是否允许半选',
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

// Methods 方法文档（Rate 组件没有暴露方法）
const apiMethods: any[] = []

// Events 事件文档
const apiEvents = [
  {
    name: 'update:modelValue',
    desc: 'v-model 更新事件，参数为当前分数',
  },
  {
    name: 'change',
    desc: '评分变化时触发，参数为 { value: 当前分数 }',
  },
]

// ===== 事件处理方法 =====

/**
 * 基本用法变化处理
 * @param param0 事件参数
 */
const handleBasicChange = ({ value }: { value: number }) => {
  console.log('基本用法评分变化：', value)
}

/**
 * 半选变化处理
 * @param param0 事件参数
 */
const handleHalfChange = ({ value }: { value: number }) => {
  console.log('半选评分变化：', value)
}

/**
 * 交互评分变化处理
 * @param param0 事件参数
 */
const handleInteractiveChange = ({ value }: { value: number }) => {
  console.log('交互评分变化：', value)
}

/**
 * 重置评分
 */
const handleReset = () => {
  interactiveValue.value = 0
  console.log('评分已重置')
}

/**
 * 随机评分
 */
const handleRandomRate = () => {
  interactiveValue.value = Math.floor(Math.random() * 5) + 1
  console.log('随机评分：', interactiveValue.value)
}

// ===== 工具方法 =====

/**
 * 获取评分文本描述
 * @param rating 评分值
 * @returns 评分文本
 */
const getRatingText = (rating: number): string => {
  const texts = ['未评分', '很差', '较差', '一般', '良好', '优秀']
  return texts[Math.floor(rating)] || texts[0]
}

/**
 * 获取商品评价文本
 * @returns 评价文本
 */
const getProductRatingText = (): string => {
  if (productRating.value >= 4.5) return '非常满意'
  if (productRating.value >= 3.5) return '比较满意'
  if (productRating.value >= 2.5) return '一般'
  if (productRating.value >= 1.5) return '不太满意'
  return '很不满意'
}

/**
 * 获取服务综合评分
 * @returns 综合评分
 */
const getAverageRating = (): string => {
  const total = serviceRatings.value.reduce((sum, item) => sum + item.rating, 0)
  return (total / serviceRatings.value.length).toFixed(1)
}

/**
 * 获取难度文本
 * @returns 难度文本
 */
const getDifficultyText = (): string => {
  const texts = ['', '简单', '较简单', '中等', '较难', '困难']
  return texts[difficultyRating.value] || '未评级'
}

/**
 * 获取难度样式类
 * @returns CSS 样式类
 */
const getDifficultyClass = (): string => {
  if (difficultyRating.value <= 2) return 'text-green-600'
  if (difficultyRating.value <= 3) return 'text-orange-600'
  return 'text-red-600'
}

const { resetScrollTop, updateScrollTop } = useScroll()
onShow(() => {
  resetScrollTop()
})
onPageScroll((e) => {
  updateScrollTop(e.scrollTop)
})
</script>
