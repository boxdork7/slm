<!-- Text 文本 http://127.0.0.1:100/#/pages-sub/demo/wd/text -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Text 文本" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的文本展示方式">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="默认文本">
          <wd-text :text="text" />
        </wd-cell>
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基本用法" :code="codes.basic.template" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 主题类型示例 -->
    <DemoSection title="主题类型" desc="预设的主题颜色类型">
      <wd-cell-group>
        <wd-cell title="主题颜色" vertical>
          <view class="flex flex-wrap gap-3">
            <wd-text type="default" text="默认" />
            <wd-text type="primary" text="主色" />
            <wd-text type="success" text="成功" />
            <wd-text type="warning" text="警告" />
            <wd-text type="error" text="错误" />
            <wd-text type="secondary" text="次要" />
            <wd-text type="info" text="辅助" />
          </view>
        </wd-cell>

        <wd-cell title="自定义颜色">
          <wd-text :text="shortText" color="#36B8C2" />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 主题类型" :code="codes.theme.template" />
        <DemoCode title="模板 - 自定义颜色" :code="codes.theme.customColor" />
        <DemoCode title="脚本 - 主题类型" :code="codes.theme.script" />
      </template>
    </DemoSection>

    <!-- 字体样式示例 -->
    <DemoSection title="字体样式" desc="字体大小、粗体和装饰效果">
      <wd-cell-group>
        <wd-cell title="字体大小">
          <wd-text :text="shortText" size="16px" />
        </wd-cell>

        <wd-cell title="粗体显示">
          <wd-text :text="shortText" bold />
        </wd-cell>

        <wd-cell title="文字装饰" vertical>
          <view class="space-y-2">
            <wd-text :text="shortText" decoration="underline" />
            <wd-text :text="shortText" decoration="line-through" type="warning" />
            <wd-text :text="shortText" decoration="overline" type="info" />
          </view>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 字体大小" :code="codes.style.sizeTemplate" />
        <DemoCode title="模板 - 粗体显示" :code="codes.style.boldTemplate" />
        <DemoCode title="模板 - 文字装饰" :code="codes.style.decorationTemplate" />
        <DemoCode title="脚本 - 字体样式" :code="codes.style.script" />
      </template>
    </DemoSection>

    <!-- 文本限制示例 -->
    <DemoSection title="文本限制" desc="行数限制和行高设置">
      <wd-cell-group>
        <wd-cell title="行数限制 (2行)" vertical>
          <wd-text :text="text" :lines="2" size="16px" />
        </wd-cell>

        <wd-cell title="行高设置" vertical>
          <wd-text :text="text" :lines="3" line-height="24px" />
        </wd-cell>

        <wd-cell title="块级显示" vertical>
          <wd-text :text="shortText" block type="primary" />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 行数限制" :code="codes.limit.linesTemplate" />
        <DemoCode title="模板 - 行高设置" :code="codes.limit.lineHeightTemplate" />
        <DemoCode title="模板 - 块级显示" :code="codes.limit.blockTemplate" />
        <DemoCode title="脚本 - 文本限制" :code="codes.limit.script" />
      </template>
    </DemoSection>

    <!-- 格式化模式示例 -->
    <DemoSection title="格式化模式" desc="不同类型数据的格式化显示">
      <wd-cell-group>
        <wd-cell title="手机号格式化">
          <wd-text text="18888888888" mode="phone" />
        </wd-cell>

        <wd-cell title="姓名格式化">
          <wd-text text="张小明" mode="name" />
        </wd-cell>

        <wd-cell title="日期格式化">
          <wd-text text="1719976636911" mode="date" />
        </wd-cell>

        <wd-cell title="金额格式化">
          <wd-text text="16354.156" mode="price" type="success" prefix="￥" />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 手机号格式化" :code="codes.format.phoneTemplate" />
        <DemoCode title="模板 - 姓名格式化" :code="codes.format.nameTemplate" />
        <DemoCode title="模板 - 日期格式化" :code="codes.format.dateTemplate" />
        <DemoCode title="模板 - 金额格式化" :code="codes.format.priceTemplate" />
        <DemoCode title="脚本 - 格式化模式" :code="codes.format.script" />
      </template>
    </DemoSection>

    <!-- 脱敏显示示例 -->
    <DemoSection title="脱敏显示" desc="敏感信息的脱敏处理">
      <wd-cell-group>
        <wd-cell title="手机号脱敏">
          <wd-text text="18888888888" mode="phone" :format="true" />
        </wd-cell>

        <wd-cell title="姓名脱敏" vertical>
          <view class="space-y-2">
            <wd-text text="张三" mode="name" :format="true" />
            <wd-text text="张小明" mode="name" :format="true" />
            <wd-text text="张小明李" mode="name" :format="true" />
          </view>
        </wd-cell>

        <wd-cell title="对比显示" vertical>
          <view class="space-y-2">
            <view class="flex items-center space-x-4">
              <wd-text text="原始：" size="14px" type="secondary" />
              <wd-text text="18888888888" mode="phone" />
            </view>
            <view class="flex items-center space-x-4">
              <wd-text text="脱敏：" size="14px" type="secondary" />
              <wd-text text="18888888888" mode="phone" :format="true" />
            </view>
          </view>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 手机号脱敏" :code="codes.privacy.phoneTemplate" />
        <DemoCode title="模板 - 姓名脱敏" :code="codes.privacy.nameTemplate" />
        <DemoCode title="模板 - 对比显示" :code="codes.privacy.compareTemplate" />
        <DemoCode title="脚本 - 脱敏显示" :code="codes.privacy.script" />
      </template>
    </DemoSection>

    <!-- 前后插槽示例 -->
    <DemoSection title="前后插槽" desc="使用插槽或属性添加前后缀内容">
      <wd-cell-group>
        <wd-cell title="属性方式" vertical>
          <wd-text
            text="12345678901"
            mode="phone"
            format
            type="primary"
            prefix="手机："
            suffix="（脱敏）"
          />
        </wd-cell>

        <wd-cell title="插槽方式" vertical>
          <wd-text text="12345678901" mode="phone" format type="primary">
            <template #prefix>
              <text class="text-gray-500">手机：</text>
            </template>
            <template #suffix>
              <text class="text-gray-400">（脱敏）</text>
            </template>
          </wd-text>
        </wd-cell>

        <wd-cell title="金额前缀" vertical>
          <wd-text
            text="16354.156"
            mode="price"
            type="success"
            decoration="line-through"
            prefix="￥"
            suffix="（原价）"
          />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 属性方式" :code="codes.slot.propTemplate" />
        <DemoCode title="模板 - 插槽方式" :code="codes.slot.slotTemplate" />
        <DemoCode title="模板 - 金额前缀" :code="codes.slot.priceTemplate" />
        <DemoCode title="脚本 - 前后插槽" :code="codes.slot.script" />
      </template>
    </DemoSection>

    <!-- 事件处理示例 -->
    <DemoSection title="事件处理" desc="文本点击事件处理">
      <!-- 状态显示区域 -->
      <view class="space-y-4">
        <wd-cell-group>
          <wd-cell title="可点击文本" vertical>
            <view class="space-y-3">
              <wd-text
                :text="clickableText"
                type="primary"
                style="cursor: pointer"
                @click="handleTextClick"
              />
              <wd-text
                text="点击拨打电话"
                mode="phone"
                :call="true"
                type="success"
                style="cursor: pointer"
                @click="handlePhoneClick"
              />
            </view>
          </wd-cell>
        </wd-cell-group>

        <!-- 事件日志显示 -->
        <view class="mx-4 rounded-lg bg-gray-50 p-4">
          <view class="mb-2 text-sm font-medium">点击日志</view>
          <view class="h-24 overflow-y-auto border rounded bg-white p-2">
            <view v-for="(log, index) in clickLogs" :key="index" class="mb-1 text-xs text-gray-600">
              <text class="text-gray-400">[{{ log.time }}]</text>
              {{ log.message }}
            </view>
            <view v-if="clickLogs.length === 0" class="py-2 text-center text-gray-400">
              暂无点击记录
            </view>
          </view>
          <view class="mt-2">
            <wd-button size="small" @click="clearClickLogs">清空日志</wd-button>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 事件处理" :code="codes.event.template" />
        <DemoCode title="脚本 - 事件处理" :code="codes.event.script" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// ===== 组件状态管理 =====

// 示例文本内容
const text = ref<string>(
  '芦叶满汀洲，寒沙带浅流。二十年重过南楼。柳下系船犹未稳，能几日，又中秋。黄鹤断矶头，故人曾到否？旧江山浑是新愁。欲买桂花同载酒，终不似，少年游。',
)

// 短文本示例
const shortText = ref<string>('这是一段示例文本')

// 可点击文本
const clickableText = ref<string>('点击我试试看')

// 点击日志记录
interface ClickLog {
  time: string
  message: string
}

const clickLogs = ref<ClickLog[]>([])

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    template: `<wd-text :text="text" />`,

    script: `import { ref } from 'vue'

const text = ref('芦叶满汀洲，寒沙带浅流。二十年重过南楼。')`,
  },

  // 主题类型代码
  theme: {
    template: `<!-- 预设主题 -->
<wd-text type="default" text="默认" />
<wd-text type="primary" text="主色" />
<wd-text type="success" text="成功" />
<wd-text type="warning" text="警告" />
<wd-text type="error" text="错误" />
<wd-text type="secondary" text="次要" />
<wd-text type="info" text="辅助" />`,

    customColor: `<wd-text :text="shortText" color="#36B8C2" />`,

    script: `// 主题类型定义
type TextType = 'default' | 'secondary' | 'info' | 'primary' | 'success' | 'warning' | 'error'

const shortText = ref('这是一段示例文本')`,
  },

  // 字体样式代码
  style: {
    sizeTemplate: `<wd-text :text="shortText" size="16px" />`,

    boldTemplate: `<wd-text :text="shortText" bold />`,

    decorationTemplate: `<!-- 文字装饰 -->
<wd-text :text="shortText" decoration="underline" />
<wd-text :text="shortText" decoration="line-through" type="warning" />
<wd-text :text="shortText" decoration="overline" type="info" />`,

    script: `// 字体样式配置
const fontSize = ref('16px')
const isBold = ref(true)
const decorationType = ref('underline')`,
  },

  // 文本限制代码
  limit: {
    linesTemplate: `<wd-text :text="text" :lines="2" size="16px" />`,

    lineHeightTemplate: `<wd-text :text="text" :lines="3" line-height="24px" />`,

    blockTemplate: `<wd-text :text="shortText" block type="primary" />`,

    script: `// 文本限制配置
const maxLines = ref(2)
const lineHeight = ref('24px')
const isBlock = ref(true)`,
  },

  // 格式化模式代码
  format: {
    phoneTemplate: `<wd-text text="18888888888" mode="phone" />`,

    nameTemplate: `<wd-text text="张小明" mode="name" />`,

    dateTemplate: `<wd-text text="1719976636911" mode="date" />`,

    priceTemplate: `<wd-text
  text="16354.156"
  mode="price"
  type="success"
  prefix="￥"
/>`,

    script: `// 格式化模式示例数据
const phoneNumber = ref('18888888888')
const userName = ref('张小明')
const timestamp = ref('1719976636911')
const priceAmount = ref('16354.156')`,
  },

  // 脱敏显示代码
  privacy: {
    phoneTemplate: `<wd-text text="18888888888" mode="phone" :format="true" />`,

    nameTemplate: `<!-- 不同长度姓名脱敏 -->
<wd-text text="张三" mode="name" :format="true" />
<wd-text text="张小明" mode="name" :format="true" />
<wd-text text="张小明李" mode="name" :format="true" />`,

    compareTemplate: `<!-- 对比显示 -->
<view class="flex items-center space-x-4">
  <wd-text text="原始：" size="14px" type="secondary" />
  <wd-text text="18888888888" mode="phone" />
</view>
<view class="flex items-center space-x-4">
  <wd-text text="脱敏：" size="14px" type="secondary" />
  <wd-text text="18888888888" mode="phone" :format="true" />
</view>`,

    script: `// 脱敏数据示例
const sensitivePhone = ref('18888888888')
const sensitiveName = ref('张小明')
const needFormat = ref(true)`,
  },

  // 前后插槽代码
  slot: {
    propTemplate: `<wd-text
  text="12345678901"
  mode="phone"
  format
  type="primary"
  prefix="手机："
  suffix="（脱敏）"
/>`,

    slotTemplate: `<wd-text text="12345678901" mode="phone" format type="primary">
  <template #prefix>
    <text class="text-gray-500">手机：</text>
  </template>
  <template #suffix>
    <text class="text-gray-400">（脱敏）</text>
  </template>
</wd-text>`,

    priceTemplate: `<wd-text
  text="16354.156"
  mode="price"
  type="success"
  decoration="line-through"
  prefix="￥"
  suffix="（原价）"
/>`,

    script: `// 插槽内容配置
const prefixText = ref('手机：')
const suffixText = ref('（脱敏）')
const pricePrefix = ref('￥')`,
  },

  // 事件处理代码
  event: {
    template: `<template>
  <!-- 可点击文本 -->
  <wd-text
    :text="clickableText"
    type="primary"
    @click="handleTextClick"
    style="cursor: pointer;"
  />

  <!-- 电话拨打 -->
  <wd-text
    text="点击拨打电话"
    mode="phone"
    :call="true"
    type="success"
    @click="handlePhoneClick"
    style="cursor: pointer;"
  />
</template>`,

    script: `import { ref } from 'vue'

// 点击日志记录
interface ClickLog {
  time: string
  message: string
}

const clickLogs = ref<ClickLog[]>([])
const clickableText = ref('点击我试试看')

/**
 * 添加点击日志
 */
const addClickLog = (message: string) => {
  clickLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
  })
  // 限制日志数量
  if (clickLogs.value.length > 10) {
    clickLogs.value = clickLogs.value.slice(0, 10)
  }
}

/**
 * 处理文本点击事件
 */
const handleTextClick = (event: Event) => {
  addClickLog('点击了普通文本')
  console.log('文本被点击', event)
}

/**
 * 处理电话点击事件
 */
const handlePhoneClick = (event: Event) => {
  addClickLog('点击了电话号码')
  console.log('电话号码被点击', event)
}

/**
 * 清空点击日志
 */
const clearClickLogs = () => {
  clickLogs.value = []
  addClickLog('日志已清空')
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'text',
    type: 'String | Number',
    default: '""',
    desc: '文字内容',
  },
  {
    name: 'type',
    type: 'String',
    default: '"default"',
    desc: '主题类型：default / secondary / info / primary / success / warning / error',
  },
  {
    name: 'size',
    type: 'String | Number',
    default: '""',
    desc: '字体大小',
  },
  {
    name: 'color',
    type: 'String',
    default: '""',
    desc: '文本颜色',
  },
  {
    name: 'bold',
    type: 'Boolean',
    default: 'false',
    desc: '是否粗体',
  },
  {
    name: 'mode',
    type: 'String',
    default: '"text"',
    desc: '文本处理模式：text / date / phone / name / price',
  },
  {
    name: 'format',
    type: 'Boolean',
    default: 'false',
    desc: '是否脱敏，当mode为phone和name时生效',
  },
  {
    name: 'decoration',
    type: 'String',
    default: '"none"',
    desc: '文字装饰：underline / line-through / overline / none',
  },
  {
    name: 'lines',
    type: 'Number',
    default: '0',
    desc: '文本显示的行数，超出显示省略号，最大值为5',
  },
  {
    name: 'line-height',
    type: 'String',
    default: '""',
    desc: '文本行高',
  },
  {
    name: 'block',
    type: 'Boolean',
    default: 'false',
    desc: '是否块级元素，设置后文本会单独占一行',
  },
  {
    name: 'prefix',
    type: 'String',
    default: '""',
    desc: '前置插槽内容',
  },
  {
    name: 'suffix',
    type: 'String',
    default: '""',
    desc: '后置插槽内容',
  },
  {
    name: 'call',
    type: 'Boolean',
    default: 'false',
    desc: 'mode=phone时，点击文本是否拨打电话',
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
    desc: '点击文本时触发，参数为原始事件对象',
  },
]

// ===== 工具方法 =====

/**
 * 添加点击日志
 */
const addClickLog = (message: string) => {
  clickLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
  })
  // 限制日志数量
  if (clickLogs.value.length > 10) {
    clickLogs.value = clickLogs.value.slice(0, 10)
  }
}

/**
 * 清空点击日志
 */
const clearClickLogs = () => {
  clickLogs.value = []
  addClickLog('日志已清空')
}

// ===== 事件处理方法 =====

/**
 * 处理文本点击事件
 */
const handleTextClick = (event: Event) => {
  addClickLog('点击了普通文本')
  console.log('文本被点击', event)
}

/**
 * 处理电话点击事件
 */
const handlePhoneClick = (event: Event) => {
  addClickLog('点击了电话号码')
  console.log('电话号码被点击', event)
}

const { resetScrollTop, updateScrollTop } = useScroll()

onShow(() => {
  resetScrollTop() // 页面显示时重置，避免页面切换时状态错误
})

onPageScroll((e) => {
  updateScrollTop(e.scrollTop)
})
</script>
