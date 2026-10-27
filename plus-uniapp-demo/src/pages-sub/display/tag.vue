<!-- Tag 标签 http://127.0.0.1:100/#/pages-sub/demo/wd/tag -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Tag 标签" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="支持多种预设主题类型">
      <!-- 示例效果展示 -->
      <view class="flex flex-wrap gap-3">
        <wd-tag>默认标签</wd-tag>
        <wd-tag type="primary">主要标签</wd-tag>
        <wd-tag type="success">成功标签</wd-tag>
        <wd-tag type="warning">警告标签</wd-tag>
        <wd-tag type="danger">危险标签</wd-tag>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基本用法" :code="codes.basic.template" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 标签样式示例 -->
    <DemoSection title="标签样式" desc="支持幽灵、标记、圆角等不同样式">
      <!-- 幽灵标签 -->
      <wd-cell-group>
        <wd-cell title="幽灵标签" vertical>
          <view class="flex flex-wrap gap-3">
            <wd-tag plain>默认</wd-tag>
            <wd-tag plain type="primary">主要</wd-tag>
            <wd-tag plain type="success">成功</wd-tag>
            <wd-tag plain type="warning">警告</wd-tag>
            <wd-tag plain type="danger">危险</wd-tag>
          </view>
        </wd-cell>

        <wd-cell title="标记标签" vertical>
          <view class="flex flex-wrap gap-3">
            <wd-tag mark>默认</wd-tag>
            <wd-tag mark type="primary">主要</wd-tag>
            <wd-tag mark type="success">成功</wd-tag>
            <wd-tag mark type="warning">警告</wd-tag>
            <wd-tag mark type="danger">危险</wd-tag>
          </view>
        </wd-cell>

        <wd-cell title="圆角标签" vertical>
          <view class="flex flex-wrap gap-3">
            <wd-tag round>默认</wd-tag>
            <wd-tag round type="primary">主要</wd-tag>
            <wd-tag round type="success">成功</wd-tag>
            <wd-tag round type="warning">警告</wd-tag>
            <wd-tag round type="danger">危险</wd-tag>
          </view>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 幽灵标签" :code="codes.style.plainTemplate" />
        <DemoCode title="模板 - 标记标签" :code="codes.style.markTemplate" />
        <DemoCode title="模板 - 圆角标签" :code="codes.style.roundTemplate" />
        <DemoCode title="脚本 - 标签样式" :code="codes.style.script" />
      </template>
    </DemoSection>

    <!-- 组合样式示例 -->
    <DemoSection title="组合样式" desc="样式属性可以组合使用">
      <wd-cell-group>
        <wd-cell title="幽灵标记标签" vertical>
          <view class="flex flex-wrap gap-3">
            <wd-tag mark plain>默认</wd-tag>
            <wd-tag mark plain type="primary">主要</wd-tag>
            <wd-tag mark plain type="success">成功</wd-tag>
            <wd-tag mark plain type="warning">警告</wd-tag>
            <wd-tag mark plain type="danger">危险</wd-tag>
          </view>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 组合样式" :code="codes.combine.template" />
        <DemoCode title="脚本 - 组合样式" :code="codes.combine.script" />
      </template>
    </DemoSection>

    <!-- 图标标签示例 -->
    <DemoSection title="图标标签" desc="支持内置图标和自定义图标插槽">
      <wd-cell-group>
        <wd-cell title="内置图标" vertical>
          <view class="flex flex-wrap gap-3">
            <wd-tag icon="clock" mark>时间标签</wd-tag>
            <wd-tag icon="star" type="primary">星标</wd-tag>
            <wd-tag icon="check" type="success" round>已完成</wd-tag>
            <wd-tag icon="warning" type="warning" plain>警告</wd-tag>
          </view>
        </wd-cell>

        <wd-cell title="自定义图标插槽" vertical>
          <view class="flex flex-wrap gap-3">
            <wd-tag mark use-icon-slot>
              插槽图标
              <template #icon>
                <wd-icon name="dong" />
              </template>
            </wd-tag>
            <wd-tag type="primary" use-icon-slot>
              自定义
              <template #icon>
                <wd-icon name="user" />
              </template>
            </wd-tag>
          </view>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 内置图标" :code="codes.icon.builtInTemplate" />
        <DemoCode title="模板 - 自定义图标" :code="codes.icon.customTemplate" />
        <DemoCode title="脚本 - 图标标签" :code="codes.icon.script" />
      </template>
    </DemoSection>

    <!-- 自定义颜色示例 -->
    <DemoSection title="自定义颜色" desc="支持自定义文字颜色和背景颜色">
      <wd-cell-group>
        <wd-cell title="自定义颜色" vertical>
          <view class="flex flex-wrap gap-3">
            <wd-tag color="#0083ff" bg-color="#d0e8ff">蓝色标签</wd-tag>
            <wd-tag color="#FAA21E" bg-color="#FFF7E6">橙色标签</wd-tag>
            <wd-tag color="#FF6B9D" bg-color="#FFE8F1">粉色标签</wd-tag>
            <wd-tag color="#9C27B0" bg-color="#F3E5F5">紫色标签</wd-tag>
          </view>
        </wd-cell>

        <wd-cell title="幽灵自定义颜色" vertical>
          <view class="flex flex-wrap gap-3">
            <wd-tag color="#0083ff" bg-color="#0083ff" plain>蓝色幽灵</wd-tag>
            <wd-tag color="#FAA21E" bg-color="#FAA21E" plain>橙色幽灵</wd-tag>
            <wd-tag color="#FF6B9D" bg-color="#FF6B9D" plain>粉色幽灵</wd-tag>
            <wd-tag color="#9C27B0" bg-color="#9C27B0" plain>紫色幽灵</wd-tag>
          </view>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 自定义颜色" :code="codes.color.template" />
        <DemoCode title="脚本 - 自定义颜色" :code="codes.color.script" />
      </template>
    </DemoSection>

    <!-- 可关闭标签示例 -->
    <DemoSection title="可关闭标签" desc="标签支持关闭功能，仅在圆角模式下可用">
      <!-- 控制区域 -->
      <view class="space-y-4">
        <!-- 可关闭标签展示 -->
        <wd-cell-group>
          <wd-cell title="可关闭标签" vertical>
            <view class="flex flex-wrap gap-3">
              <wd-tag
                v-for="(tag, index) in closableTags"
                :key="`closable-${index}`"
                round
                closable
                :type="tag.type as TagType"
                @click="handleTagClick(index, tag.value)"
                @close="handleTagClose(index)"
              >
                {{ tag.value }}
              </wd-tag>
            </view>
            <view v-if="closableTags.length === 0" class="py-4 text-center text-gray-400">
              所有标签已被关闭
            </view>
          </wd-cell>
        </wd-cell-group>

        <!-- 重置按钮 -->
        <view class="px-4">
          <wd-button size="small" @click="resetClosableTags">重置标签</wd-button>
        </view>

        <!-- 操作日志 -->
        <view class="mx-4 rounded-lg bg-gray-50 p-4">
          <view class="mb-2 text-sm font-medium">操作日志</view>
          <view class="h-20 overflow-y-auto border rounded bg-white p-2">
            <view
              v-for="(log, index) in actionLogs"
              :key="index"
              class="mb-1 text-xs text-gray-600"
            >
              <text class="text-gray-400">[{{ log.time }}]</text>
              {{ log.message }}
            </view>
            <view v-if="actionLogs.length === 0" class="py-2 text-center text-gray-400">
              暂无操作记录
            </view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 可关闭标签" :code="codes.closable.template" />
        <DemoCode title="脚本 - 可关闭标签" :code="codes.closable.script" />
      </template>
    </DemoSection>

    <!-- 动态标签示例 -->
    <DemoSection title="动态标签" desc="支持动态添加和删除标签">
      <!-- 控制区域 -->
      <view class="space-y-4">
        <!-- 动态标签展示 -->
        <wd-cell-group>
          <wd-cell title="动态标签管理" vertical>
            <view class="flex flex-wrap gap-3">
              <!-- 已存在的标签 -->
              <wd-tag
                v-for="(tag, index) in dynamicTags"
                :key="`dynamic-${index}`"
                round
                closable
                type="primary"
                @close="handleDynamicTagClose(index)"
              >
                {{ tag }}
              </wd-tag>

              <!-- 默认新增标签 -->
              <wd-tag round dynamic @confirm="handleTagConfirm" />

              <!-- 自定义新增标签 -->
              <wd-tag round dynamic @confirm="handleTagConfirm">
                <template #add>
                  <wd-icon name="pin" size="12px" />
                  <text class="ml-1">自定义</text>
                </template>
              </wd-tag>
            </view>
          </wd-cell>
        </wd-cell-group>

        <!-- 批量操作 -->
        <view class="px-4">
          <wd-grid cols="3" clickable border>
            <wd-grid-item text="清空标签" icon="delete" @itemclick="clearDynamicTags" />
            <wd-grid-item text="添加预设" icon="add" @itemclick="addPresetTags" />
            <wd-grid-item text="重置标签" icon="refresh" @itemclick="resetDynamicTags" />
          </wd-grid>
        </view>

        <!-- 标签统计 -->
        <view class="mx-4 rounded-lg bg-blue-50 px-4 py-2">
          <view class="text-xs text-blue-600 font-medium">
            📊 当前标签数量：{{ dynamicTags.length }} 个
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 动态标签" :code="codes.dynamic.template" />
        <DemoCode title="脚本 - 动态标签管理" :code="codes.dynamic.script" />
        <DemoCode title="模板 - 自定义新增按钮" :code="codes.dynamic.customAddTemplate" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TagType } from '@/wd/components/wd-tag/wd-tag.vue'

// ===== 组件状态管理 =====

// 可关闭标签数据
const closableTags = ref([
  { type: 'primary', value: '标签一' },
  { type: 'success', value: '标签二' },
  { type: 'warning', value: '标签三' },
  { type: 'danger', value: '标签四' },
])

// 动态标签数据
const dynamicTags = ref<string[]>(['前端开发', 'Vue.js', 'TypeScript'])

// 操作日志
interface ActionLog {
  time: string
  message: string
}

const actionLogs = ref<ActionLog[]>([])

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    template: `<view class="flex flex-wrap gap-3">
  <wd-tag>默认标签</wd-tag>
  <wd-tag type="primary">主要标签</wd-tag>
  <wd-tag type="success">成功标签</wd-tag>
  <wd-tag type="warning">警告标签</wd-tag>
  <wd-tag type="danger">危险标签</wd-tag>
</view>`,

    script: `// 标签支持的类型：
// type="default" - 默认样式
// type="primary" - 主要样式
// type="success" - 成功样式
// type="warning" - 警告样式
// type="danger" - 危险样式`,
  },

  // 标签样式代码
  style: {
    plainTemplate: `<!-- 幽灵标签 -->
<view class="flex flex-wrap gap-3">
  <wd-tag plain>默认</wd-tag>
  <wd-tag plain type="primary">主要</wd-tag>
  <wd-tag plain type="success">成功</wd-tag>
  <wd-tag plain type="warning">警告</wd-tag>
  <wd-tag plain type="danger">危险</wd-tag>
</view>`,

    markTemplate: `<!-- 标记标签 -->
<view class="flex flex-wrap gap-3">
  <wd-tag mark>默认</wd-tag>
  <wd-tag mark type="primary">主要</wd-tag>
  <wd-tag mark type="success">成功</wd-tag>
  <wd-tag mark type="warning">警告</wd-tag>
  <wd-tag mark type="danger">危险</wd-tag>
</view>`,

    roundTemplate: `<!-- 圆角标签 -->
<view class="flex flex-wrap gap-3">
  <wd-tag round>默认</wd-tag>
  <wd-tag round type="primary">主要</wd-tag>
  <wd-tag round type="success">成功</wd-tag>
  <wd-tag round type="warning">警告</wd-tag>
  <wd-tag round type="danger">危险</wd-tag>
</view>`,

    script: `// 标签样式属性：
// plain - 幽灵样式，透明背景
// mark - 标记样式，左侧有标记
// round - 圆角样式，圆角边框
// 这些属性可以组合使用`,
  },

  // 组合样式代码
  combine: {
    template: `<!-- 幽灵标记标签 -->
<view class="flex flex-wrap gap-3">
  <wd-tag mark plain>默认</wd-tag>
  <wd-tag mark plain type="primary">主要</wd-tag>
  <wd-tag mark plain type="success">成功</wd-tag>
  <wd-tag mark plain type="warning">警告</wd-tag>
  <wd-tag mark plain type="danger">危险</wd-tag>
</view>`,

    script: `// 样式组合示例：
// mark + plain = 幽灵标记样式
// round + plain = 圆角幽灵样式
// 可以根据需要自由组合`,
  },

  // 图标标签代码
  icon: {
    builtInTemplate: `<!-- 内置图标 -->
<view class="flex flex-wrap gap-3">
  <wd-tag icon="clock" mark>时间标签</wd-tag>
  <wd-tag icon="star" type="primary">星标</wd-tag>
  <wd-tag icon="check" type="success" round>已完成</wd-tag>
  <wd-tag icon="warning" type="warning" plain>警告</wd-tag>
</view>`,

    customTemplate: `<!-- 自定义图标插槽 -->
<view class="flex flex-wrap gap-3">
  <wd-tag mark use-icon-slot>
    插槽图标
    <template #icon>
      <wd-icon name="dong" />
    </template>
  </wd-tag>
  <wd-tag type="primary" use-icon-slot>
    自定义
    <template #icon>
      <wd-icon name="user" />
    </template>
  </wd-tag>
</view>`,

    script: `// 图标使用方式：
// 1. icon="图标名" - 使用内置图标
// 2. use-icon-slot + #icon 插槽 - 自定义图标
// 注意：使用插槽时需要设置 use-icon-slot 属性`,
  },

  // 自定义颜色代码
  color: {
    template: `<!-- 自定义颜色 -->
<view class="flex flex-wrap gap-3">
  <wd-tag color="#0083ff" bg-color="#d0e8ff">蓝色标签</wd-tag>
  <wd-tag color="#FAA21E" bg-color="#FFF7E6">橙色标签</wd-tag>
  <wd-tag color="#FF6B9D" bg-color="#FFE8F1">粉色标签</wd-tag>
</view>

<!-- 幽灵自定义颜色 -->
<view class="flex flex-wrap gap-3">
  <wd-tag color="#0083ff" bg-color="#0083ff" plain>蓝色幽灵</wd-tag>
  <wd-tag color="#FAA21E" bg-color="#FAA21E" plain>橙色幽灵</wd-tag>
</view>`,

    script: `// 自定义颜色属性：
// color - 文字颜色
// bg-color - 背景颜色和边框颜色
// 幽灵模式下，bg-color 主要影响边框颜色`,
  },

  // 可关闭标签代码
  closable: {
    template: `<wd-tag
  v-for="(tag, index) in closableTags"
  :key="index"
  round
  closable
  :type="tag.type"
  @click="handleTagClick(index, tag.value)"
  @close="handleTagClose(index)"
>
  {{ tag.value }}
</wd-tag>`,

    script: `import { ref } from 'vue'

const closableTags = ref([
  { type: 'primary', value: '标签一' },
  { type: 'success', value: '标签二' },
  { type: 'warning', value: '标签三' },
  { type: 'danger', value: '标签四' },
])

const handleTagClick = (index: number, value: string) => {
  console.log('点击标签:', value)
}

const handleTagClose = (index: number) => {
  closableTags.value.splice(index, 1)
  console.log('关闭标签:', index)
}

// 注意：closable 属性仅在 round 模式下有效`,
  },

  // 动态标签代码
  dynamic: {
    template: `<!-- 动态标签管理 -->
<view class="flex flex-wrap gap-3">
  <!-- 已存在的标签 -->
  <wd-tag
    v-for="(tag, index) in dynamicTags"
    :key="index"
    round
    closable
    type="primary"
    @close="handleDynamicTagClose(index)"
  >
    {{ tag }}
  </wd-tag>

  <!-- 默认新增标签 -->
  <wd-tag round dynamic @confirm="handleTagConfirm" />
</view>`,

    script: `import { ref } from 'vue'

const dynamicTags = ref(['前端开发', 'Vue.js', 'TypeScript'])

const handleDynamicTagClose = (index: number) => {
  dynamicTags.value.splice(index, 1)
}

const handleTagConfirm = ({ value }: { value: string }) => {
  if (!value.trim()) return
  dynamicTags.value.push(value.trim())
}

// dynamic 属性使标签变为新增按钮
// 点击后显示输入框，确认后触发 confirm 事件`,

    customAddTemplate: `<!-- 自定义新增按钮 -->
<wd-tag round dynamic @confirm="handleTagConfirm">
  <template #add>
    <wd-icon name="pin" size="12px" />
    <text class="ml-1">自定义</text>
  </template>
</wd-tag>`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'type',
    type: 'String',
    default: '"default"',
    desc: '标签类型，可选值：default / primary / success / warning / danger',
  },
  {
    name: 'plain',
    type: 'Boolean',
    default: 'false',
    desc: '是否为幽灵标签',
  },
  {
    name: 'round',
    type: 'Boolean',
    default: 'false',
    desc: '是否为圆角标签',
  },
  {
    name: 'mark',
    type: 'Boolean',
    default: 'false',
    desc: '是否为标记标签',
  },
  {
    name: 'closable',
    type: 'Boolean',
    default: 'false',
    desc: '是否可关闭（仅在 round 模式下支持）',
  },
  {
    name: 'dynamic',
    type: 'Boolean',
    default: 'false',
    desc: '是否为动态新增标签',
  },
  {
    name: 'icon',
    type: 'String',
    default: '""',
    desc: '左侧图标名称',
  },
  {
    name: 'use-icon-slot',
    type: 'Boolean',
    default: 'false',
    desc: '是否开启图标插槽',
  },
  {
    name: 'color',
    type: 'String',
    default: '""',
    desc: '文字颜色',
  },
  {
    name: 'bg-color',
    type: 'String',
    default: '""',
    desc: '背景色和边框色',
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
    desc: '点击标签时触发，参数为点击事件对象',
  },
  {
    name: 'close',
    desc: '点击关闭按钮时触发，参数为点击事件对象',
  },
  {
    name: 'confirm',
    desc: '动态标签确认时触发，参数为 { value: string }',
  },
]

// ===== 工具方法 =====

/**
 * 添加操作日志
 */
const addActionLog = (message: string) => {
  actionLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
  })
  // 限制日志数量
  if (actionLogs.value.length > 10) {
    actionLogs.value = actionLogs.value.slice(0, 10)
  }
}

// ===== 事件处理方法 =====

/**
 * 处理标签点击事件
 */
const handleTagClick = (index: number, value: string) => {
  addActionLog(`点击标签：${value}（索引：${index}）`)
  console.log('点击标签:', value, index)
}

/**
 * 处理可关闭标签的关闭事件
 */
const handleTagClose = (index: number) => {
  const tag = closableTags.value[index]
  closableTags.value.splice(index, 1)
  addActionLog(`关闭标签：${tag.value}`)
  console.log('关闭标签:', tag.value, index)
}

/**
 * 重置可关闭标签
 */
const resetClosableTags = () => {
  closableTags.value = [
    { type: 'primary', value: '标签一' },
    { type: 'success', value: '标签二' },
    { type: 'warning', value: '标签三' },
    { type: 'danger', value: '标签四' },
  ]
  addActionLog('重置可关闭标签')
  console.log('重置可关闭标签')
}

/**
 * 处理动态标签关闭事件
 */
const handleDynamicTagClose = (index: number) => {
  const tag = dynamicTags.value[index]
  dynamicTags.value.splice(index, 1)
  addActionLog(`删除动态标签：${tag}`)
  console.log('删除动态标签:', tag, index)
}

/**
 * 处理标签确认事件
 */
const handleTagConfirm = ({ value }: { value: string }) => {
  if (!value || !value.trim()) {
    addActionLog('取消新增标签（内容为空）')
    return
  }

  const trimmedValue = value.trim()
  if (dynamicTags.value.includes(trimmedValue)) {
    addActionLog(`标签已存在：${trimmedValue}`)
    return
  }

  dynamicTags.value.push(trimmedValue)
  addActionLog(`新增标签：${trimmedValue}`)
  console.log('新增标签:', trimmedValue)
}

/**
 * 清空动态标签
 */
const clearDynamicTags = () => {
  const count = dynamicTags.value.length
  dynamicTags.value = []
  addActionLog(`清空所有标签（共 ${count} 个）`)
  console.log('清空动态标签')
}

/**
 * 添加预设标签
 */
const addPresetTags = () => {
  const presetTags = ['JavaScript', 'CSS', 'HTML', 'Node.js', 'React']
  const newTags = presetTags.filter((tag) => !dynamicTags.value.includes(tag))

  if (newTags.length === 0) {
    addActionLog('预设标签已全部存在')
    return
  }

  dynamicTags.value.push(...newTags)
  addActionLog(`添加预设标签：${newTags.join('、')}`)
  console.log('添加预设标签:', newTags)
}

/**
 * 重置动态标签
 */
const resetDynamicTags = () => {
  dynamicTags.value = ['前端开发', 'Vue.js', 'TypeScript']
  addActionLog('重置动态标签')
  console.log('重置动态标签')
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
</style>
