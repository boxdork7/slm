<!-- Collapse 折叠面板 http://127.0.0.1:100/#/pages-sub/demo/wd/collapse -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Collapse 折叠面板" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="通过 v-model 控制面板展开状态，支持数组或字符串格式">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="当前展开值" :value="JSON.stringify(basicValue)" />
        <wd-cell title="面板数量" :value="`${basicItems.length} 个`" />
        <wd-cell title="展开数量" :value="`${getExpandedCount(basicValue)} 个`" />
      </wd-cell-group>

      <view class="mt-4">
        <wd-collapse v-model="basicValue" @change="handleBasicChange">
          <wd-collapse-item
            v-for="item in basicItems"
            :key="item.name"
            :title="item.title"
            :name="item.name"
          >
            <view class="p-3 text-sm text-gray-600 leading-relaxed">
              {{ item.content }}
            </view>
          </wd-collapse-item>
        </wd-collapse>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基本用法" :code="codes.basic.template" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 手风琴模式示例 -->
    <DemoSection title="手风琴模式" desc="开启手风琴模式后，同时只能展开一个面板">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="手风琴模式" icon="setting">
          <wd-switch v-model="accordionMode" @change="handleAccordionToggle" />
        </wd-cell>
        <wd-cell title="当前展开值" :value="JSON.stringify(accordionValue)" />
        <wd-cell title="数据类型" :value="typeof accordionValue" />
      </wd-cell-group>

      <view class="mt-4">
        <wd-collapse
          v-model="accordionValue"
          :accordion="accordionMode"
          @change="handleAccordionChange"
        >
          <wd-collapse-item
            v-for="item in accordionItems"
            :key="item.name"
            :title="item.title"
            :name="item.name"
          >
            <view class="p-3 text-sm text-gray-600 leading-relaxed">
              {{ item.content }}
            </view>
          </wd-collapse-item>
        </wd-collapse>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 手风琴模式" :code="codes.accordion.template" />
        <DemoCode title="脚本 - 手风琴模式" :code="codes.accordion.script" />
      </template>
    </DemoSection>

    <!-- 禁用状态示例 -->
    <DemoSection title="禁用状态" desc="通过 disabled 属性禁用某个面板">
      <view class="space-y-4">
        <wd-collapse v-model="disabledValue" @change="handleDisabledChange">
          <wd-collapse-item
            v-for="item in disabledItems"
            :key="item.name"
            :title="item.title"
            :name="item.name"
            :disabled="item.disabled"
          >
            <view
              class="p-3 text-sm leading-relaxed"
              :class="item.disabled ? 'text-gray-400' : 'text-gray-600'"
            >
              {{ item.content }}
            </view>
          </wd-collapse-item>
        </wd-collapse>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 禁用状态" :code="codes.disabled.template" />
        <DemoCode title="脚本 - 禁用状态" :code="codes.disabled.script" />
      </template>
    </DemoSection>

    <!-- 自定义标题示例 -->
    <DemoSection title="自定义标题" desc="通过 title 插槽自定义标题内容和样式">
      <view class="space-y-4">
        <wd-collapse v-model="customValue" @change="handleCustomChange">
          <wd-collapse-item name="custom1">
            <template #title="{ expanded }">
              <view class="w-full flex items-center justify-between">
                <view class="flex items-center">
                  <view class="mr-2 h-2 w-2 rounded-full bg-blue-500" />
                  <text class="text-blue-600 font-medium">自定义样式标题</text>
                </view>
                <view class="flex items-center text-sm text-gray-500">
                  <text>{{ expanded ? '点击收起' : '点击展开' }}</text>
                  <text class="ml-1">{{ expanded ? '▲' : '▼' }}</text>
                </view>
              </view>
            </template>
            <view class="rounded bg-blue-50 p-3 text-sm text-blue-700">
              这是自定义标题面板的内容。标题使用了蓝色主题和自定义图标。
            </view>
          </wd-collapse-item>

          <wd-collapse-item name="custom2">
            <template #title="{ expanded }">
              <view class="w-full flex items-center justify-between">
                <view class="flex items-center">
                  <view class="mr-2 h-2 w-2 rounded-full bg-green-500" />
                  <text class="text-green-600 font-medium">带状态显示</text>
                </view>
                <view
                  :class="`rounded px-2 py-1 text-xs ${expanded ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`"
                >
                  {{ expanded ? '已展开' : '已收起' }}
                </view>
              </view>
            </template>
            <view class="rounded bg-green-50 p-3 text-sm text-green-700">
              这个面板的标题显示了当前的展开/收起状态，并使用不同的颜色区分。
            </view>
          </wd-collapse-item>

          <wd-collapse-item name="custom3" disabled>
            <template #title>
              <view class="w-full flex items-center justify-between">
                <view class="flex items-center">
                  <view class="mr-2 h-2 w-2 rounded-full bg-gray-400" />
                  <text class="text-gray-400">禁用状态面板</text>
                </view>
                <view class="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500">已禁用</view>
              </view>
            </template>
            <view class="p-3 text-sm text-gray-400">这个面板被禁用了，无法展开或收起。</view>
          </wd-collapse-item>
        </wd-collapse>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 自定义标题" :code="codes.customTitle.template" />
        <DemoCode title="脚本 - 自定义标题" :code="codes.customTitle.script" />
      </template>
    </DemoSection>

    <!-- 异步加载示例 -->
    <DemoSection title="异步加载" desc="通过 before-expend 属性实现展开前的异步操作">
      <view class="space-y-4">
        <!-- 加载状态显示 -->
        <wd-cell-group>
          <wd-cell title="加载状态" :value="asyncLoadingStatus" />
          <wd-cell title="加载次数" :value="`${asyncLoadCount} 次`" />
        </wd-cell-group>

        <wd-collapse v-model="asyncValue" @change="handleAsyncChange">
          <wd-collapse-item title="普通面板" name="normal">
            <view class="p-3 text-sm text-gray-600">这是一个普通的面板，没有异步加载逻辑。</view>
          </wd-collapse-item>

          <wd-collapse-item
            title="异步加载面板（模拟1秒延迟）"
            name="async1"
            :before-expend="beforeExpandAsync1"
          >
            <view class="p-3 text-sm text-gray-600 space-y-2">
              <view class="text-green-600 font-medium">异步加载成功！</view>
              <view>{{ asyncContent1 || '内容将在展开时异步加载...' }}</view>
            </view>
          </wd-collapse-item>

          <wd-collapse-item
            title="模拟加载失败面板"
            name="async2"
            :before-expend="beforeExpandAsync2"
          >
            <view class="p-3 text-sm text-gray-600 space-y-2">
              <view class="text-red-600 font-medium">此面板模拟加载失败</view>
              <view>展开时会随机成功或失败（50%概率）</view>
            </view>
          </wd-collapse-item>
        </wd-collapse>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 异步加载" :code="codes.async.template" />
        <DemoCode title="脚本 - 异步加载" :code="codes.async.script" />
      </template>
    </DemoSection>

    <!-- 查看更多模式示例 -->
    <DemoSection title="查看更多模式" desc="适用于长文本内容的展开/收起，支持设置显示行数">
      <view class="space-y-6">
        <!-- 基础查看更多 -->
        <view>
          <view class="mb-3 text-sm text-gray-700 font-medium">基础查看更多（默认2行）</view>
          <wd-collapse v-model="viewMore1" viewmore @change="handleViewMore1Change">
            这是查看更多模式的演示内容。当内容超过设定的行数时，会自动显示"展开"按钮。这种模式特别适用于商品描述、文章摘要、用户评论等长文本内容的展示。用户可以选择查看完整内容或保持收起状态。这是一个非常实用的功能，能够有效节省页面空间。
          </wd-collapse>
        </view>

        <!-- 自定义行数 -->
        <view>
          <view class="mb-3 text-sm text-gray-700 font-medium">自定义行数限制（3行）</view>
          <wd-collapse v-model="viewMore2" viewmore :line-num="3" @change="handleViewMore2Change">
            自定义行数限制演示：这里设置了3行的限制。这是一条示例文字内容，用于演示不同行数限制的效果。当文本内容超过设定的行数时，超出部分会被隐藏，并显示展开按钮。您可以通过配置来调整行数限制，观察不同设置下的效果。这种灵活的配置方式使得组件能够适应各种不同的使用场景和设计需求。
          </wd-collapse>
        </view>

        <!-- 自定义展开按钮 -->
        <view>
          <view class="mb-3 text-sm text-gray-700 font-medium">自定义展开按钮样式</view>
          <wd-collapse
            v-model="viewMore3"
            viewmore
            use-more-slot
            custom-more-slot-class="text-purple-600 font-medium"
            @change="handleViewMore3Change"
          >
            自定义展开按钮演示：通过使用 more
            插槽，可以完全自定义展开/收起按钮的样式和内容。这为开发者提供了最大的灵活性，可以根据具体的设计需求来定制按钮的外观。比如可以使用不同的颜色、字体、图标等。这段文字用于演示自定义按钮的效果。
            <template #more>
              <view class="flex items-center">
                <text>{{ viewMore3 ? '收起内容' : '查看全部' }}</text>
                <text class="ml-1">{{ viewMore3 ? '🔼' : '🔽' }}</text>
              </view>
            </template>
          </wd-collapse>
        </view>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基础查看更多" :code="codes.viewMore.basicTemplate" />
        <DemoCode title="模板 - 自定义行数" :code="codes.viewMore.customLinesTemplate" />
        <DemoCode title="模板 - 自定义按钮" :code="codes.viewMore.customButtonTemplate" />
        <DemoCode title="脚本 - 查看更多模式" :code="codes.viewMore.script" />
      </template>
    </DemoSection>

    <!-- 嵌套面板示例 -->
    <DemoSection title="嵌套面板" desc="折叠面板支持多层嵌套，可以创建复杂的层级结构">
      <view class="space-y-4">
        <wd-collapse v-model="nestedParentValue" @change="handleNestedParentChange">
          <wd-collapse-item
            v-for="item in 3"
            :key="item"
            custom-body-style="padding:0 0 0 14px"
            :title="`第一层面板 ${item}`"
            :name="`level1-${item}`"
          >
            <wd-collapse v-model="nestedChildValues[item - 1]" @change="handleNestedChildChange">
              <wd-collapse-item
                v-for="(childItem, index) in nestedChildItems"
                :key="index"
                :custom-class="index === 0 ? 'no-border' : ''"
                :title="`${childItem.title}（第二层）`"
                :name="childItem.name"
              >
                <view class="rounded bg-blue-50 p-3 text-sm">
                  <view class="mb-1 text-blue-700 font-medium">{{ childItem.title }}</view>
                  <view class="text-blue-600">{{ childItem.content }}</view>
                </view>
              </wd-collapse-item>
            </wd-collapse>
          </wd-collapse-item>
        </wd-collapse>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 嵌套面板" :code="codes.nested.template" />
        <DemoCode title="脚本 - 嵌套面板" :code="codes.nested.script" />
      </template>
    </DemoSection>

    <!-- 批量操作示例 -->
    <DemoSection title="批量操作" desc="支持批量控制所有面板的展开/收起状态">
      <view class="space-y-4">
        <!-- 操作按钮 -->
        <view class="flex flex-wrap gap-2">
          <wd-button size="small" @click="toggleAll()">全部切换</wd-button>
          <wd-button size="small" type="success" @click="toggleAll(true)">全部展开</wd-button>
          <wd-button size="small" type="primary" @click="toggleAll(false)">全部收起</wd-button>
          <wd-button size="small" type="warning" @click="toggleAllSkipDisabled()">
            跳过禁用项切换
          </wd-button>
        </view>

        <!-- 状态显示 -->
        <wd-cell-group>
          <wd-cell title="当前展开值" :value="JSON.stringify(batchValue)" />
          <wd-cell
            title="展开面板数"
            :value="`${getExpandedCount(batchValue)} / ${batchItems.length}`"
          />
        </wd-cell-group>

        <wd-collapse ref="batchCollapseRef" v-model="batchValue" @change="handleBatchChange">
          <wd-collapse-item
            v-for="item in batchItems"
            :key="item.name"
            :title="item.title"
            :name="item.name"
            :disabled="item.disabled"
          >
            <view
              class="p-3 text-sm leading-relaxed"
              :class="item.disabled ? 'text-gray-400' : 'text-gray-600'"
            >
              {{ item.content }}
            </view>
          </wd-collapse-item>
        </wd-collapse>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 批量操作" :code="codes.batch.template" />
        <DemoCode title="脚本 - 批量操作" :code="codes.batch.script" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { CollapseInstance } from '@/wd/components/wd-collapse/wd-collapse.vue'

// ===== 组件状态管理 =====

// 组件引用
const batchCollapseRef = ref<CollapseInstance>()

// 基础模式数据
const basicValue = ref<string[]>(['basic1'])
const basicItems = ref([
  {
    name: 'basic1',
    title: '订单取消说明',
    content:
      '如订单处于暂停状态，进入我的订单页面，找到要取消的订单，点击取消订单按钮，选择订单取消原因后，点击下一步，提交申请即可。支持在线取消，也可以联系客服协助处理。',
  },
  {
    name: 'basic2',
    title: '退款申请流程',
    content:
      '一般情况下，卖家只能向商户申请退款，商户确认可以退款后，可以通过接口或者商户平台向微信支付发起退款申请。退款处理时间通常为1-3个工作日。',
  },
  {
    name: 'basic3',
    title: '质量问题处理',
    content:
      '将收到的有质量问题的商品照片或者订单截图上传到微信公众账号，微信关注联华华商公众号，我们的工作人员会尽快帮您处理。',
  },
])

// 手风琴模式数据
const accordionMode = ref<boolean>(false)
const accordionValue = ref<string | string[]>(['accordion1'])
const accordionItems = ref([
  {
    name: 'accordion1',
    title: '用户协议',
    content:
      '用户在使用本服务前，请仔细阅读本协议。用户通过注册账户或使用本服务，即表示同意接受本协议的全部条款。',
  },
  {
    name: 'accordion2',
    title: '隐私政策',
    content:
      '我们非常重视您的隐私保护。本隐私政策详细说明了我们如何收集、使用、存储和保护您的个人信息。',
  },
  {
    name: 'accordion3',
    title: '服务条款',
    content: '本服务条款规定了您与我们之间关于使用本服务的权利和义务。请您仔细阅读并遵守相关规定。',
  },
])

// 禁用状态数据
const disabledValue = ref<string[]>(['disabled1'])
const disabledItems = ref([
  {
    name: 'disabled1',
    title: '正常面板',
    content: '这是一个正常的面板，可以正常展开和收起。',
    disabled: false,
  },
  {
    name: 'disabled2',
    title: '禁用面板',
    content: '这个面板被禁用了，无法进行展开或收起操作。',
    disabled: true,
  },
  {
    name: 'disabled3',
    title: '另一个正常面板',
    content: '这也是一个正常的面板，功能完全正常。',
    disabled: false,
  },
])

// 自定义标题数据
const customValue = ref<string[]>(['custom1'])

// 异步加载数据
const asyncValue = ref<string[]>([])
const asyncContent1 = ref<string>('')
const asyncLoadingStatus = ref<string>('待加载')
const asyncLoadCount = ref<number>(0)

// 查看更多模式数据
const viewMore1 = ref<boolean>(false)
const viewMore2 = ref<boolean>(false)
const viewMore3 = ref<boolean>(false)

// 嵌套面板数据
const nestedParentValue = ref<string[]>(['level1-1'])
const nestedChildValues = ref<string[][]>([['sub-a'], [], []])
const nestedChildItems = ref([
  { name: 'sub-a', title: '子选项A', content: '这是嵌套面板的子选项A的详细内容说明。' },
  { name: 'sub-b', title: '子选项B', content: '这是嵌套面板的子选项B的详细内容说明。' },
])

// 批量操作数据
const batchValue = ref<string[]>(['batch1'])
const batchItems = ref([
  {
    name: 'batch1',
    title: '面板 1',
    content: '这是第一个面板的内容。',
    disabled: false,
  },
  {
    name: 'batch2',
    title: '面板 2（禁用）',
    content: '这是第二个面板的内容，但它被禁用了。',
    disabled: true,
  },
  {
    name: 'batch3',
    title: '面板 3',
    content: '这是第三个面板的内容。',
    disabled: false,
  },
  {
    name: 'batch4',
    title: '面板 4',
    content: '这是第四个面板的内容。',
    disabled: false,
  },
])

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    template: `<wd-collapse v-model="basicValue" @change="handleBasicChange">
  <wd-collapse-item
    v-for="item in basicItems"
    :key="item.name"
    :title="item.title"
    :name="item.name"
  >
    <view class="p-3 text-sm text-gray-600 leading-relaxed">
      {{ item.content }}
    </view>
  </wd-collapse-item>
</wd-collapse>`,

    script: `import { ref } from 'vue'

const basicValue = ref(['basic1'])
const basicItems = ref([
  {
    name: 'basic1',
    title: '订单取消说明',
    content: '如订单处于暂停状态，进入我的订单页面...',
  },
  {
    name: 'basic2',
    title: '退款申请流程',
    content: '一般情况下，卖家只能向商户申请退款...',
  },
])

const handleBasicChange = ({ value }) => {
  console.log('展开状态变化：', value)
}`,
  },

  // 手风琴模式代码
  accordion: {
    template: `<wd-collapse
  v-model="accordionValue"
  :accordion="accordionMode"
  @change="handleAccordionChange"
>
  <wd-collapse-item
    v-for="item in accordionItems"
    :key="item.name"
    :title="item.title"
    :name="item.name"
  >
    <view class="p-3 text-sm text-gray-600 leading-relaxed">
      {{ item.content }}
    </view>
  </wd-collapse-item>
</wd-collapse>`,

    script: `const accordionMode = ref(false)
const accordionValue = ref(['accordion1'])

const handleAccordionToggle = ({ value }) => {
  // 切换模式时调整数据格式
  if (value) {
    // 切换到手风琴模式：只保留第一个展开项
    if (Array.isArray(accordionValue.value) && accordionValue.value.length > 0) {
      accordionValue.value = accordionValue.value[0]
    }
  } else {
    // 切换到普通模式：转为数组格式
    if (typeof accordionValue.value === 'string' && accordionValue.value) {
      accordionValue.value = [accordionValue.value]
    }
  }
}

const handleAccordionChange = ({ value }) => {
  console.log('手风琴模式变化：', value)
}`,
  },

  // 禁用状态代码
  disabled: {
    template: `<wd-collapse v-model="disabledValue" @change="handleDisabledChange">
  <wd-collapse-item
    v-for="item in disabledItems"
    :key="item.name"
    :title="item.title"
    :name="item.name"
    :disabled="item.disabled"
  >
    <view class="p-3 text-sm leading-relaxed"
          :class="item.disabled ? 'text-gray-400' : 'text-gray-600'">
      {{ item.content }}
    </view>
  </wd-collapse-item>
</wd-collapse>`,

    script: `const disabledValue = ref(['disabled1'])
const disabledItems = ref([
  {
    name: 'disabled1',
    title: '正常面板',
    content: '这是一个正常的面板，可以正常展开和收起。',
    disabled: false,
  },
  {
    name: 'disabled2',
    title: '禁用面板',
    content: '这个面板被禁用了，无法进行展开或收起操作。',
    disabled: true,
  },
])

const handleDisabledChange = ({ value }) => {
  console.log('禁用状态下变化：', value)
}`,
  },

  // 自定义标题代码
  customTitle: {
    template: `<wd-collapse v-model="customValue">
  <wd-collapse-item name="custom1">
    <template #title="{ expanded }">
      <view class="flex w-full items-center justify-between">
        <view class="flex items-center">
          <view class="mr-2 h-2 w-2 rounded-full bg-blue-500" />
          <text class="font-medium text-blue-600">自定义样式标题</text>
        </view>
        <view class="flex items-center text-sm text-gray-500">
          <text>{{ expanded ? '点击收起' : '点击展开' }}</text>
          <text class="ml-1">{{ expanded ? '▲' : '▼' }}</text>
        </view>
      </view>
    </template>
    <view class="rounded bg-blue-50 p-3 text-sm text-blue-700">
      这是自定义标题面板的内容。
    </view>
  </wd-collapse-item>
</wd-collapse>`,

    script: `const customValue = ref(['custom1'])

// title 插槽提供 expanded、disabled、isFirst 三个参数
// expanded: 当前展开状态
// disabled: 是否禁用
// isFirst: 是否为第一个面板`,
  },

  // 异步加载代码
  async: {
    template: `<wd-collapse v-model="asyncValue">
  <wd-collapse-item
    title="异步加载面板"
    name="async1"
    :before-expend="beforeExpandAsync1"
  >
    <view class="p-3 text-sm text-gray-600">
      {{ asyncContent1 || '内容将在展开时异步加载...' }}
    </view>
  </wd-collapse-item>
</wd-collapse>`,

    script: `const asyncValue = ref([])
const asyncContent1 = ref('')
const asyncLoadingStatus = ref('待加载')

const beforeExpandAsync1 = (name) => {
  asyncLoadingStatus.value = '加载中...'

  return new Promise((resolve) => {
    // 模拟异步加载，1秒后完成
    setTimeout(() => {
      asyncContent1.value = '异步加载的内容：这是通过 before-expend 回调函数获取的数据。'
      asyncLoadingStatus.value = '加载完成'
      resolve(true)
    }, 1000)
  })
}

const beforeExpandAsync2 = (name) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 50% 概率成功
      if (Math.random() > 0.5) {
        resolve(true)
      } else {
        asyncLoadingStatus.value = '加载失败'
        reject(new Error('模拟加载失败'))
      }
    }, 800)
  })
}`,
  },

  // 查看更多模式代码
  viewMore: {
    basicTemplate: `<!-- 基础查看更多（默认2行） -->
<wd-collapse v-model="viewMore1" viewmore @change="handleViewMore1Change">
  这是查看更多模式的演示内容。当内容超过设定的行数时，会自动显示"展开"按钮...
</wd-collapse>`,

    customLinesTemplate: `<!-- 自定义行数限制（3行） -->
<wd-collapse v-model="viewMore2" viewmore :line-num="3" @change="handleViewMore2Change">
  自定义行数限制演示：这里设置了3行的限制...
</wd-collapse>`,

    customButtonTemplate: `<!-- 自定义展开按钮样式 -->
<wd-collapse
  v-model="viewMore3"
  viewmore
  use-more-slot
  custom-more-slot-class="text-purple-600 font-medium"
  @change="handleViewMore3Change"
>
  自定义展开按钮演示...
  <template #more>
    <view class="flex items-center">
      <text>{{ viewMore3 ? '收起内容' : '查看全部' }}</text>
      <text class="ml-1">{{ viewMore3 ? '🔼' : '🔽' }}</text>
    </view>
  </template>
</wd-collapse>`,

    script: `const viewMore1 = ref(false)
const viewMore2 = ref(false)
const viewMore3 = ref(false)

const handleViewMore1Change = ({ value }) => {
  console.log('基础查看更多：', value ? '展开' : '收起')
}

const handleViewMore2Change = ({ value }) => {
  console.log('自定义行数：', value ? '展开' : '收起')
}

const handleViewMore3Change = ({ value }) => {
  console.log('自定义按钮：', value ? '展开' : '收起')
}`,
  },

  // 嵌套面板代码
  nested: {
    template: `<wd-collapse v-model="nestedParentValue">
  <wd-collapse-item
    v-for="item in 3"
    :key="item"
    custom-body-style="padding:0 0 0 14px"
    :title="\`第一层面板 \${item}\`"
    :name="\`level1-\${item}\`"
  >
    <wd-collapse v-model="nestedChildValues[item - 1]">
      <wd-collapse-item
        v-for="(childItem, index) in nestedChildItems"
        :key="index"
        :custom-class="index === 0 ? 'no-border' : ''"
        :title="\`\${childItem.title}（第二层）\`"
        :name="childItem.name"
      >
        <view class="rounded bg-blue-50 p-3 text-sm">
          <view class="mb-1 font-medium text-blue-700">{{ childItem.title }}</view>
          <view class="text-blue-600">{{ childItem.content }}</view>
        </view>
      </wd-collapse-item>
    </wd-collapse>
  </wd-collapse-item>
</wd-collapse>`,

    script: `const nestedParentValue = ref(['level1-1'])
const nestedChildValues = ref([['sub-a'], [], []])
const nestedChildItems = ref([
  { name: 'sub-a', title: '子选项A', content: '子选项A的详细内容说明。' },
  { name: 'sub-b', title: '子选项B', content: '子选项B的详细内容说明。' },
])

const handleNestedParentChange = ({ value }) => {
  console.log('父级面板变化：', value)
}

const handleNestedChildChange = ({ value }) => {
  console.log('子级面板变化：', value)
}`,
  },

  // 批量操作代码
  batch: {
    template: `<wd-collapse ref="batchCollapseRef" v-model="batchValue">
  <wd-collapse-item
    v-for="item in batchItems"
    :key="item.name"
    :title="item.title"
    :name="item.name"
    :disabled="item.disabled"
  >
    <view class="p-3 text-sm leading-relaxed">
      {{ item.content }}
    </view>
  </wd-collapse-item>
</wd-collapse>

<!-- 批量操作按钮 -->
<view class="flex flex-wrap gap-2">
  <wd-button size="small" @click="toggleAll()">全部切换</wd-button>
  <wd-button size="small" type="success" @click="toggleAll(true)">全部展开</wd-button>
  <wd-button size="small" type="primary" @click="toggleAll(false)">全部收起</wd-button>
  <wd-button size="small" type="warning" @click="toggleAllSkipDisabled()">跳过禁用项切换</wd-button>
</view>`,

    script: `import type { CollapseInstance } from '@/wd/components/wd-collapse/wd-collapse.vue'

const batchCollapseRef = ref<CollapseInstance>()
const batchValue = ref(['batch1'])

const toggleAll = (expanded?: boolean) => {
  batchCollapseRef.value?.toggleAll(expanded)
}

const toggleAllSkipDisabled = () => {
  batchCollapseRef.value?.toggleAll({ skipDisabled: true })
}

const handleBatchChange = ({ value }) => {
  console.log('批量操作后状态：', value)
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'model-value',
    type: 'String | Array | Boolean',
    default: '[]',
    desc: '绑定值，普通模式支持数组或字符串，手风琴模式支持字符串或数组，查看更多模式支持布尔值',
  },
  {
    name: 'accordion',
    type: 'Boolean',
    default: 'false',
    desc: '手风琴模式，开启后同时只能展开一个面板',
  },
  {
    name: 'viewmore',
    type: 'Boolean',
    default: 'false',
    desc: '查看更多模式，适用于长文本展开收起',
  },
  {
    name: 'line-num',
    type: 'Number',
    default: '2',
    desc: '查看更多模式下收起时的显示行数',
  },
  {
    name: 'use-more-slot',
    type: 'Boolean',
    default: 'false',
    desc: '是否使用自定义展开按钮插槽',
  },
  {
    name: 'custom-more-slot-class',
    type: 'String',
    default: '""',
    desc: '查看更多模式下插槽外部自定义样式类',
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
    name: 'toggleAll(options?)',
    desc: '切换所有面板展开状态。参数：true(全部展开)、false(全部收起)、{ expanded?, skipDisabled? }',
  },
]

// Events 事件文档
const apiEvents = [
  {
    name: 'change',
    desc: '面板状态改变时触发，参数：{ value: 当前展开状态值 }',
  },
  {
    name: 'update:modelValue',
    desc: '绑定值更新时触发，参数：当前展开状态值',
  },
]

// ===== 工具方法 =====

/**
 * 获取展开面板数量
 */
const getExpandedCount = (value: string | string[] | boolean): number => {
  if (Array.isArray(value)) {
    return value.length
  }
  if (typeof value === 'string') {
    return value ? value.split(',').length : 0
  }
  if (typeof value === 'boolean') {
    return value ? 1 : 0
  }
  return 0
}

// ===== 事件处理方法 =====

/**
 * 基本用法变化处理
 */
const handleBasicChange = ({ value }: { value: string[] }) => {
  console.log(`基本用法展开状态变化：`, value)
}

/**
 * 手风琴模式切换处理
 */
const handleAccordionToggle = ({ value }: { value: boolean }) => {
  if (value) {
    // 切换到手风琴模式：只保留第一个展开项
    if (Array.isArray(accordionValue.value) && accordionValue.value.length > 0) {
      accordionValue.value = accordionValue.value[0]
    } else if (!accordionValue.value) {
      accordionValue.value = ''
    }
  } else {
    // 切换到普通模式：转为数组格式
    if (typeof accordionValue.value === 'string' && accordionValue.value) {
      accordionValue.value = [accordionValue.value]
    } else if (!Array.isArray(accordionValue.value)) {
      accordionValue.value = []
    }
  }
  console.log(`切换到${value ? '手风琴' : '普通'}模式，当前值：`, accordionValue.value)
}

/**
 * 手风琴模式变化处理
 */
const handleAccordionChange = ({ value }: { value: string | string[] }) => {
  console.log(`手风琴模式展开状态变化：`, value)
}

/**
 * 禁用状态变化处理
 */
const handleDisabledChange = ({ value }: { value: string[] }) => {
  console.log(`禁用状态展开状态变化：`, value)
}

/**
 * 自定义标题变化处理
 */
const handleCustomChange = ({ value }: { value: string[] }) => {
  console.log(`自定义标题展开状态变化：`, value)
}

/**
 * 异步加载变化处理
 */
const handleAsyncChange = ({ value }: { value: string[] }) => {
  console.log(`异步加载展开状态变化：`, value)
}

/**
 * 异步加载前回调1
 */
const beforeExpandAsync1 = (name: string): Promise<boolean> => {
  asyncLoadingStatus.value = '加载中...'
  asyncLoadCount.value++

  return new Promise((resolve) => {
    setTimeout(() => {
      asyncContent1.value =
        '异步加载的内容：这是通过 before-expend 回调函数获取的数据。在实际应用中，这里可以是从服务器获取的用户信息、商品详情、评论列表等动态内容。'
      asyncLoadingStatus.value = '加载完成'
      console.log(`异步加载完成：${name}`)
      resolve(true)
    }, 1000)
  })
}

/**
 * 异步加载前回调2（模拟失败）
 */
const beforeExpandAsync2 = (name: string): Promise<boolean> => {
  asyncLoadingStatus.value = '加载中...'
  asyncLoadCount.value++

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 50% 概率成功
      if (Math.random() > 0.5) {
        asyncLoadingStatus.value = '加载完成'
        console.log(`异步加载成功：${name}`)
        resolve(true)
      } else {
        asyncLoadingStatus.value = '加载失败'
        console.log(`异步加载失败：${name}`)
        reject(new Error('模拟加载失败'))
      }
    }, 800)
  })
}

/**
 * 查看更多模式变化处理
 */
const handleViewMore1Change = ({ value }: { value: boolean }) => {
  console.log(`基础查看更多：${value ? '展开' : '收起'}`)
}

const handleViewMore2Change = ({ value }: { value: boolean }) => {
  console.log(`自定义行数：${value ? '展开' : '收起'}`)
}

const handleViewMore3Change = ({ value }: { value: boolean }) => {
  console.log(`自定义按钮：${value ? '展开' : '收起'}`)
}

/**
 * 嵌套面板变化处理
 */
const handleNestedParentChange = ({ value }: { value: string[] }) => {
  console.log(`嵌套面板父级变化：`, value)
}

const handleNestedChildChange = ({ value }: { value: string[] }) => {
  console.log(`嵌套面板子级变化：`, value)
}

/**
 * 批量操作变化处理
 */
const handleBatchChange = ({ value }: { value: string[] }) => {
  console.log(`批量操作后状态：`, value)
}

/**
 * 批量切换所有面板
 */
const toggleAll = (expanded?: boolean) => {
  batchCollapseRef.value?.toggleAll(expanded)
  console.log(`批量操作：${expanded === undefined ? '切换' : expanded ? '展开' : '收起'}所有面板`)
}

/**
 * 批量切换（跳过禁用项）
 */
const toggleAllSkipDisabled = () => {
  batchCollapseRef.value?.toggleAll({ skipDisabled: true })
  console.log('批量切换（跳过禁用项）')
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
// 移除嵌套面板边框样式
:deep(.no-border::after) {
  display: none;
}
</style>
