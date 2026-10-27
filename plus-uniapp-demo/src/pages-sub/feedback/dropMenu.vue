<!-- DropMenu 下拉菜单 http://127.0.0.1:100/#/pages-sub/demo/wd/drop-menu -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="DropMenu 下拉菜单" show-back />

    <!-- 消息弹窗容器 -->
    <view @click.stop="">
      <wd-message-box />
    </view>

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的下拉菜单形式，支持单选和多选项配置">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <wd-drop-menu>
          <wd-drop-menu-item
            v-model="basicValue1"
            :options="basicOptions1"
            @change="handleBasicChange1"
          />
          <wd-drop-menu-item
            v-model="basicValue2"
            :options="basicOptions2"
            @change="handleBasicChange2"
          />
        </wd-drop-menu>

        <!-- 选择结果显示 -->
        <view class="mx-4 rounded-lg bg-gray-50 p-4">
          <view class="mb-2 text-sm text-gray-700 font-medium">选择结果</view>
          <view class="text-xs text-gray-600">
            商品类型：{{ getSelectedLabel(basicOptions1, basicValue1) }}
          </view>
          <view class="text-xs text-gray-600">
            排序方式：{{ getSelectedLabel(basicOptions2, basicValue2) }}
          </view>
        </view>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基本用法" :code="codes.basic.template" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 自定义菜单内容示例 -->
    <DemoSection title="自定义菜单内容" desc="通过插槽自定义下拉菜单内容，支持复杂交互组件">
      <view class="space-y-4">
        <wd-drop-menu>
          <wd-drop-menu-item
            v-model="customValue1"
            :options="basicOptions1"
            @change="handleCustomChange1"
          />
          <wd-drop-menu-item ref="customMenuRef" title="筛选" @opened="handleCustomOpened">
            <view>
              <!-- 滑块组件 -->
              <view class="p-4">
                <view class="mb-3 text-sm font-medium">价格范围：{{ sliderValue }}%</view>
                <wd-slider ref="sliderRef" v-model="sliderValue" />
              </view>

              <!-- 单元格列表 -->
              <wd-cell-group>
                <wd-cell title="品牌筛选" value="全部品牌" />
                <wd-cell title="销量筛选" label="按销量排序" value="默认" />
              </wd-cell-group>

              <!-- 确认按钮 -->
              <view class="p-4">
                <wd-button block @click="confirmCustomFilter">确认筛选</wd-button>
              </view>
            </view>
          </wd-drop-menu-item>
        </wd-drop-menu>

        <!-- 筛选结果显示 -->
        <view class="mx-4 rounded-lg bg-blue-50 p-4">
          <view class="mb-2 text-sm text-blue-700 font-medium">筛选结果</view>
          <view class="text-xs text-blue-600">
            商品类型：{{ getSelectedLabel(basicOptions1, customValue1) }}
          </view>
          <view class="text-xs text-blue-600">价格范围：{{ sliderValue }}%</view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 自定义内容" :code="codes.custom.template" />
        <DemoCode title="脚本 - 自定义内容" :code="codes.custom.script" />
      </template>
    </DemoSection>

    <!-- 菜单配置示例 -->
    <DemoSection title="菜单配置" desc="自定义图标、混合布局和各种配置选项">
      <view class="space-y-6">
        <!-- 自定义图标 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">自定义图标</view>
          <wd-drop-menu>
            <wd-drop-menu-item title="地图" icon="location" icon-size="24" />
            <wd-drop-menu-item title="筛选" icon="filter" icon-size="20" />
          </wd-drop-menu>
        </view>

        <!-- 混合布局 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">
            混合布局（下拉菜单 + 排序按钮）
          </view>
          <view class="flex bg-white text-center">
            <wd-drop-menu custom-style="flex: 1; min-width: 0">
              <wd-drop-menu-item
                v-model="mixedValue"
                :options="basicOptions1"
                @change="handleMixedChange"
              />
            </wd-drop-menu>
            <view class="flex-1">
              <wd-sort-button v-model="sortValue" title="商家时间" @change="handleSortChange" />
            </view>
          </view>
        </view>

        <!-- 配置结果显示 -->
        <view class="mx-4 rounded-lg bg-green-50 p-4">
          <view class="mb-2 text-sm text-green-700 font-medium">配置结果</view>
          <view class="text-xs text-green-600">
            混合布局选择：{{ getSelectedLabel(basicOptions1, mixedValue) }}
          </view>
          <view class="text-xs text-green-600">排序方式：{{ sortValue }}</view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 自定义图标" :code="codes.config.iconTemplate" />
        <DemoCode title="模板 - 混合布局" :code="codes.config.mixedTemplate" />
        <DemoCode title="脚本 - 菜单配置" :code="codes.config.script" />
      </template>
    </DemoSection>

    <!-- 弹出方向示例 -->
    <DemoSection title="弹出方向" desc="支持向上和向下两种弹出方向">
      <view class="space-y-6">
        <!-- 向下弹出（默认） -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">向下弹出（默认）</view>
          <wd-drop-menu direction="down">
            <wd-drop-menu-item
              v-model="downValue1"
              :options="basicOptions1"
              @change="handleDownChange1"
            />
            <wd-drop-menu-item
              v-model="downValue2"
              :options="basicOptions2"
              @change="handleDownChange2"
            />
          </wd-drop-menu>
        </view>

        <!-- 向上弹出 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">向上弹出</view>
          <wd-drop-menu direction="up">
            <wd-drop-menu-item
              v-model="upValue1"
              :options="basicOptions1"
              custom-title="custom-title"
              custom-icon="custom-icon"
              @change="handleUpChange1"
            />
            <wd-drop-menu-item
              v-model="upValue2"
              :options="basicOptions2"
              @change="handleUpChange2"
            />
          </wd-drop-menu>
        </view>

        <!-- 方向结果显示 -->
        <view class="mx-4 rounded-lg bg-purple-50 p-4">
          <view class="mb-2 text-sm text-purple-700 font-medium">弹出方向结果</view>
          <view class="text-xs text-purple-600">
            向下弹出：{{ getSelectedLabel(basicOptions1, downValue1) }} /
            {{ getSelectedLabel(basicOptions2, downValue2) }}
          </view>
          <view class="text-xs text-purple-600">
            向上弹出：{{ getSelectedLabel(basicOptions1, upValue1) }} /
            {{ getSelectedLabel(basicOptions2, upValue2) }}
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 向下弹出" :code="codes.direction.downTemplate" />
        <DemoCode title="模板 - 向上弹出" :code="codes.direction.upTemplate" />
        <DemoCode title="脚本 - 弹出方向" :code="codes.direction.script" />
      </template>
    </DemoSection>

    <!-- 高级功能示例 -->
    <DemoSection title="高级功能" desc="异步控制、禁用状态和事件监听">
      <view class="space-y-6">
        <!-- 异步打开关闭 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">异步打开关闭</view>
          <wd-drop-menu>
            <wd-drop-menu-item
              v-model="asyncValue"
              :options="basicOptions1"
              :before-toggle="handleBeforeToggle"
              @change="handleAsyncChange"
            />
          </wd-drop-menu>
        </view>

        <!-- 禁用状态 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">禁用状态</view>
          <wd-drop-menu>
            <wd-drop-menu-item
              v-model="disabledValue1"
              disabled
              :options="basicOptions1"
              @change="handleDisabledChange1"
            />
            <wd-drop-menu-item
              v-model="disabledValue2"
              :options="basicOptions2"
              @change="handleDisabledChange2"
            />
          </wd-drop-menu>
        </view>

        <!-- 事件监听 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">事件监听</view>
          <wd-drop-menu>
            <wd-drop-menu-item
              v-model="eventValue"
              :options="basicOptions1"
              @open="handleOpen"
              @opened="handleOpened"
              @close="handleClose"
              @closed="handleClosed"
              @change="handleEventChange"
            />
          </wd-drop-menu>
        </view>

        <!-- 事件日志显示 -->
        <view class="mx-4 rounded-lg bg-yellow-50 p-4">
          <view class="mb-2 text-sm text-yellow-700 font-medium">事件日志</view>
          <view class="h-24 overflow-y-auto border rounded bg-white p-2">
            <view v-for="(log, index) in eventLogs" :key="index" class="mb-1 text-xs text-gray-600">
              <text class="text-gray-400">[{{ log.time }}]</text>
              {{ log.message }}
            </view>
            <view v-if="eventLogs.length === 0" class="py-2 text-center text-gray-400">
              暂无事件日志
            </view>
          </view>
          <view class="mt-2">
            <wd-button size="small" @click="clearEventLogs">清空日志</wd-button>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 异步控制" :code="codes.advanced.asyncTemplate" />
        <DemoCode title="模板 - 禁用状态" :code="codes.advanced.disabledTemplate" />
        <DemoCode title="模板 - 事件监听" :code="codes.advanced.eventTemplate" />
        <DemoCode title="脚本 - 高级功能" :code="codes.advanced.script" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMessage } from '@/wd'
import type { SliderInstance } from '@/wd/components/wd-slider/wd-slider.vue'
import type { DropMenuItemBeforeToggle } from '@/wd/components/wd-drop-menu-item/wd-drop-menu-item.vue'

// ===== 组件状态管理 =====

// 消息框实例
const messageBox = useMessage()

// 组件引用
const customMenuRef = ref()
const sliderRef = ref<SliderInstance>()

// 事件日志状态
interface EventLog {
  time: string
  message: string
}

const eventLogs = ref<EventLog[]>([])

// ===== 数据状态管理 =====

// 基本用法数据
const basicValue1 = ref<number>(1)
const basicValue2 = ref<number>(0)

// 自定义菜单数据
const customValue1 = ref<number>(0)
const sliderValue = ref<number>(30)

// 菜单配置数据
const mixedValue = ref<number>(0)
const sortValue = ref<number>(0)

// 弹出方向数据
const downValue1 = ref<number>(0)
const downValue2 = ref<number>(0)
const upValue1 = ref<number>(0)
const upValue2 = ref<number>(0)

// 高级功能数据
const asyncValue = ref<number>(0)
const disabledValue1 = ref<number>(0)
const disabledValue2 = ref<number>(0)
const eventValue = ref<number>(0)

// ===== 选项配置数据 =====

// 基本选项1 - 商品筛选
const basicOptions1 = ref([
  { label: '全部商品', value: 0 },
  { label: '新款商品', value: 1, tip: '这是补充信息' },
  { label: '这是比较长的筛选条件这是比较长的筛选条件', value: 2 },
])

// 基本选项2 - 排序方式
const basicOptions2 = ref([
  { label: '综合', value: 0 },
  { label: '销量', value: 1 },
  { label: '商家时间', value: 2 },
])

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    template: `<wd-drop-menu>
  <wd-drop-menu-item
    v-model="basicValue1"
    :options="basicOptions1"
    @change="handleBasicChange1"
  />
  <wd-drop-menu-item
    v-model="basicValue2"
    :options="basicOptions2"
    @change="handleBasicChange2"
  />
</wd-drop-menu>`,

    script: `import { ref } from 'vue'

// 选中值
const basicValue1 = ref(1)
const basicValue2 = ref(0)

// 选项配置
const basicOptions1 = ref([
  { label: '全部商品', value: 0 },
  { label: '新款商品', value: 1, tip: '这是补充信息' },
  { label: '长筛选条件', value: 2 }
])

const basicOptions2 = ref([
  { label: '综合', value: 0 },
  { label: '销量', value: 1 },
  { label: '商家时间', value: 2 }
])

// 事件处理
const handleBasicChange1 = ({ value }) => {
  console.log('商品类型选择：', value)
}

const handleBasicChange2 = ({ value }) => {
  console.log('排序方式选择：', value)
}`,
  },

  // 自定义内容代码
  custom: {
    template: `<wd-drop-menu>
  <wd-drop-menu-item
    v-model="customValue1"
    :options="basicOptions1"
    @change="handleCustomChange1"
  />
  <wd-drop-menu-item
    ref="customMenuRef"
    title="筛选"
    @opened="handleCustomOpened"
  >
    <view>
      <!-- 滑块组件 -->
      <view class="p-4">
        <view class="mb-3 text-sm font-medium">价格范围：{{ sliderValue }}%</view>
        <wd-slider ref="sliderRef" v-model="sliderValue" />
      </view>

      <!-- 单元格列表 -->
      <wd-cell-group>
        <wd-cell title="品牌筛选" value="全部品牌" />
        <wd-cell title="销量筛选" label="按销量排序" value="默认" />
      </wd-cell-group>

      <!-- 确认按钮 -->
      <view class="p-4">
        <wd-button block @click="confirmCustomFilter">确认筛选</wd-button>
      </view>
    </view>
  </wd-drop-menu-item>
</wd-drop-menu>`,

    script: `import type { SliderInstance } from '@/wd/components/wd-slider/wd-slider.vue'

// 组件引用
const customMenuRef = ref()
const sliderRef = ref<SliderInstance>()

// 状态数据
const customValue1 = ref(0)
const sliderValue = ref(30)

// 自定义菜单打开时的回调
const handleCustomOpened = () => {
  sliderRef.value?.initSlider()
}

// 确认筛选
const confirmCustomFilter = () => {
  customMenuRef.value.close()
  console.log('筛选条件：', {
    type: customValue1.value,
    price: sliderValue.value
  })
}`,
  },

  // 菜单配置代码
  config: {
    iconTemplate: `<wd-drop-menu>
  <wd-drop-menu-item title="地图" icon="location" icon-size="24" />
  <wd-drop-menu-item title="筛选" icon="filter" icon-size="20" />
</wd-drop-menu>`,

    mixedTemplate: `<!-- 混合布局：下拉菜单 + 排序按钮 -->
<view class="flex bg-white text-center">
  <wd-drop-menu custom-style="flex: 1; min-width: 0">
    <wd-drop-menu-item
      v-model="mixedValue"
      :options="basicOptions1"
      @change="handleMixedChange"
    />
  </wd-drop-menu>
  <view class="flex-1">
    <wd-sort-button
      v-model="sortValue"
      title="商家时间"
      @change="handleSortChange"
    />
  </view>
</view>`,

    script: `// 菜单配置数据
const mixedValue = ref(0)
const sortValue = ref(0)

// 事件处理
const handleMixedChange = ({ value }) => {
  console.log('混合布局选择：', value)
}

const handleSortChange = ({ value }) => {
  console.log('排序方式：', value)
}`,
  },

  // 弹出方向代码
  direction: {
    downTemplate: `<!-- 向下弹出（默认） -->
<wd-drop-menu direction="down">
  <wd-drop-menu-item
    v-model="downValue1"
    :options="basicOptions1"
    @change="handleDownChange1"
  />
  <wd-drop-menu-item
    v-model="downValue2"
    :options="basicOptions2"
    @change="handleDownChange2"
  />
</wd-drop-menu>`,

    upTemplate: `<!-- 向上弹出 -->
<wd-drop-menu direction="up">
  <wd-drop-menu-item
    v-model="upValue1"
    :options="basicOptions1"
    custom-title="custom-title"
    custom-icon="custom-icon"
    @change="handleUpChange1"
  />
  <wd-drop-menu-item
    v-model="upValue2"
    :options="basicOptions2"
    @change="handleUpChange2"
  />
</wd-drop-menu>`,

    script: `// 弹出方向数据
const downValue1 = ref(0)
const downValue2 = ref(0)
const upValue1 = ref(0)
const upValue2 = ref(0)

// 事件处理
const handleDownChange1 = ({ value }) => {
  console.log('向下弹出1：', value)
}

const handleDownChange2 = ({ value }) => {
  console.log('向下弹出2：', value)
}

const handleUpChange1 = ({ value }) => {
  console.log('向上弹出1：', value)
}

const handleUpChange2 = ({ value }) => {
  console.log('向上弹出2：', value)
}`,
  },

  // 高级功能代码
  advanced: {
    asyncTemplate: `<wd-drop-menu>
  <wd-drop-menu-item
    v-model="asyncValue"
    :options="basicOptions1"
    :before-toggle="handleBeforeToggle"
    @change="handleAsyncChange"
  />
</wd-drop-menu>`,

    disabledTemplate: `<wd-drop-menu>
  <wd-drop-menu-item
    v-model="disabledValue1"
    disabled
    :options="basicOptions1"
    @change="handleDisabledChange1"
  />
  <wd-drop-menu-item
    v-model="disabledValue2"
    :options="basicOptions2"
    @change="handleDisabledChange2"
  />
</wd-drop-menu>`,

    eventTemplate: `<wd-drop-menu>
  <wd-drop-menu-item
    v-model="eventValue"
    :options="basicOptions1"
    @open="handleOpen"
    @opened="handleOpened"
    @close="handleClose"
    @closed="handleClosed"
    @change="handleEventChange"
  />
</wd-drop-menu>`,

    script: `import type { DropMenuItemBeforeToggle } from '@/wd/components/wd-drop-menu-item/wd-drop-menu-item.vue'

// 高级功能数据
const asyncValue = ref(0)
const disabledValue1 = ref(0)
const disabledValue2 = ref(0)
const eventValue = ref(0)

// 异步打开关闭前的确认
const handleBeforeToggle: DropMenuItemBeforeToggle = ({ status, resolve }) => {
  messageBox
    .confirm({
      title: \`\${status ? '异步打开' : '异步关闭'}\`,
      msg: \`\${status ? '确定要打开下拉菜单吗？' : '确定要关闭下拉菜单吗？'}\`
    })
    .then(() => {
      resolve(true)
    })
    .catch(() => {
      resolve(false)
    })
}

// 事件监听
const handleOpen = () => {
  addEventLog('菜单开始打开')
}

const handleOpened = () => {
  addEventLog('菜单打开完成')
}

const handleClose = () => {
  addEventLog('菜单开始关闭')
}

const handleClosed = () => {
  addEventLog('菜单关闭完成')
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'model-value',
    type: 'String | Number',
    default: '-',
    desc: '当前选中项对应的值',
  },
  {
    name: 'options',
    type: 'Array<Object>',
    default: '[]',
    desc: '选项列表，格式：[{label: "标题", value: "值", tip: "提示"}]',
  },
  {
    name: 'direction',
    type: 'String',
    default: 'down',
    desc: '菜单展开方向，可选值：up / down',
  },
  {
    name: 'title',
    type: 'String',
    default: '-',
    desc: '菜单项标题',
  },
  {
    name: 'icon',
    type: 'String',
    default: 'arrow-down',
    desc: '菜单项图标名称',
  },
  {
    name: 'icon-size',
    type: 'String | Number',
    default: '-',
    desc: '菜单项图标大小',
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: '是否禁用菜单',
  },
  {
    name: 'modal',
    type: 'Boolean',
    default: 'true',
    desc: '是否显示遮罩层',
  },
  {
    name: 'close-on-click-modal',
    type: 'Boolean',
    default: 'true',
    desc: '是否点击遮罩时关闭',
  },
  {
    name: 'duration',
    type: 'Number',
    default: '200',
    desc: '菜单展开收起动画时间，单位ms',
  },
  {
    name: 'z-index',
    type: 'Number',
    default: '12',
    desc: '弹框层级',
  },
  {
    name: 'value-key',
    type: 'String',
    default: 'value',
    desc: '选项对象中，value 对应的 key',
  },
  {
    name: 'label-key',
    type: 'String',
    default: 'label',
    desc: '选项对象中，展示的文本对应的 key',
  },
  {
    name: 'tip-key',
    type: 'String',
    default: 'tip',
    desc: '选项对象中，选项说明对应的 key',
  },
  {
    name: 'before-toggle',
    type: 'Function',
    default: '-',
    desc: '切换前的回调函数，返回 false 可阻止切换',
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
    name: 'open()',
    desc: '打开下拉菜单',
  },
  {
    name: 'close()',
    desc: '关闭下拉菜单',
  },
  {
    name: 'toggle()',
    desc: '切换下拉菜单显示状态',
  },
]

// Events 事件文档
const apiEvents = [
  {
    name: 'change',
    desc: '选中项改变时触发，参数为 { value, selectedItem }',
  },
  {
    name: 'open',
    desc: '下拉菜单打开前触发',
  },
  {
    name: 'opened',
    desc: '下拉菜单打开后触发',
  },
  {
    name: 'close',
    desc: '下拉菜单关闭前触发',
  },
  {
    name: 'closed',
    desc: '下拉菜单关闭后触发',
  },
]

// ===== 工具方法 =====

/**
 * 根据值获取对应的标签
 */
const getSelectedLabel = (options: any[], value: number | string): string => {
  const item = options.find((option) => option.value === value)
  return item ? item.label : '未选择'
}

/**
 * 添加事件日志
 */
const addEventLog = (message: string) => {
  eventLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
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
  addEventLog('事件日志已清空')
}

// ===== 事件处理方法 =====

/**
 * 基本用法事件处理
 */
const handleBasicChange1 = ({ value }: { value: number | string }) => {
  console.log('基本用法 - 商品类型选择：', value)
}

const handleBasicChange2 = ({ value }: { value: number | string }) => {
  console.log('基本用法 - 排序方式选择：', value)
}

/**
 * 自定义内容事件处理
 */
const handleCustomChange1 = ({ value }: { value: number | string }) => {
  console.log('自定义内容 - 商品类型选择：', value)
}

const handleCustomOpened = () => {
  sliderRef.value?.initSlider()
  console.log('自定义菜单打开，初始化滑块')
}

const confirmCustomFilter = () => {
  customMenuRef.value.close()
  console.log('确认筛选条件：', {
    type: customValue1.value,
    price: sliderValue.value,
  })
}

/**
 * 菜单配置事件处理
 */
const handleMixedChange = ({ value }: { value: number | string }) => {
  console.log('混合布局 - 商品选择：', value)
}

const handleSortChange = ({ value }: { value: number | string }) => {
  console.log('排序按钮 - 排序方式：', value)
}

/**
 * 弹出方向事件处理
 */
const handleDownChange1 = ({ value }: { value: number | string }) => {
  console.log('向下弹出 - 菜单1选择：', value)
}

const handleDownChange2 = ({ value }: { value: number | string }) => {
  console.log('向下弹出 - 菜单2选择：', value)
}

const handleUpChange1 = ({ value }: { value: number | string }) => {
  console.log('向上弹出 - 菜单1选择：', value)
}

const handleUpChange2 = ({ value }: { value: number | string }) => {
  console.log('向上弹出 - 菜单2选择：', value)
}

/**
 * 高级功能事件处理
 */
const handleAsyncChange = ({ value }: { value: number | string }) => {
  console.log('异步控制 - 选择：', value)
}

const handleDisabledChange1 = ({ value }: { value: number | string }) => {
  console.log('禁用状态1 - 选择：', value)
}

const handleDisabledChange2 = ({ value }: { value: number | string }) => {
  console.log('禁用状态2 - 选择：', value)
}

const handleEventChange = ({ value }: { value: number | string }) => {
  addEventLog(`选择了选项：${getSelectedLabel(basicOptions1.value, value)}`)
}

/**
 * 异步打开关闭前的确认
 */
const handleBeforeToggle: DropMenuItemBeforeToggle = ({ status, resolve }) => {
  messageBox
    .confirm({
      title: `${status ? '异步打开' : '异步关闭'}`,
      msg: `${status ? '确定要打开下拉菜单吗？' : '确定要关闭下拉菜单吗？'}`,
    })
    .then(() => {
      resolve(true)
    })
    .catch(() => {
      resolve(false)
    })
}

/**
 * 生命周期事件处理
 */
const handleOpen = () => {
  addEventLog('菜单开始打开')
}

const handleOpened = () => {
  addEventLog('菜单打开完成')
}

const handleClose = () => {
  addEventLog('菜单开始关闭')
}

const handleClosed = () => {
  addEventLog('菜单关闭完成')
}
const { resetScrollTop, updateScrollTop } = useScroll()
onShow(() => {
  resetScrollTop()
})
onPageScroll((e) => {
  updateScrollTop(e.scrollTop)
})
</script>
