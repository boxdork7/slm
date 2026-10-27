<!-- SelectPicker 选择器 http://127.0.0.1:100/#/pages-sub/demo/wd/select-picker -->
<template>
  <view>
    <wd-toast />
    <!-- 导航栏 -->
    <wd-navbar title="SelectPicker 选择器" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="支持单选和多选两种模式，多选默认以复选框形式展示">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-select-picker
          v-model="basicMultiValue"
          label="多选(默认)"
          :columns="basicColumns"
          @confirm="handleBasicMultiConfirm"
        />
        <wd-select-picker
          v-model="basicSingleValue"
          label="单选模式"
          type="radio"
          :columns="basicColumns"
          @confirm="handleBasicSingleConfirm"
        />
        <wd-select-picker
          v-model="basicAutoValue"
          label="自动确认"
          type="radio"
          :show-confirm="false"
          :columns="basicColumns"
          @confirm="handleBasicAutoConfirm"
        />
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基本用法" :code="codes.basic.template" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 选择器状态示例 -->
    <DemoSection title="选择器状态" desc="支持禁用、只读、加载中等不同状态">
      <wd-cell-group>
        <wd-select-picker
          v-model="statusNormalValue"
          label="正常状态"
          :columns="basicColumns"
          @confirm="handleStatusNormalConfirm"
        />
        <wd-select-picker
          v-model="statusDisabledValue"
          label="禁用状态"
          disabled
          :columns="basicColumns"
          @confirm="handleStatusDisabledConfirm"
        />
        <wd-select-picker
          v-model="statusReadonlyValue"
          label="只读状态"
          readonly
          :columns="basicColumns"
          @confirm="handleStatusReadonlyConfirm"
        />
        <wd-select-picker
          v-model="statusLoadingValue"
          label="加载状态"
          loading
          :columns="basicColumns"
          @confirm="handleStatusLoadingConfirm"
        />
        <wd-select-picker
          v-model="statusDisabledOptionsValue"
          label="禁用选项"
          :columns="disabledColumns"
          @confirm="handleStatusDisabledOptionsConfirm"
        />
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 选择器状态" :code="codes.status.template" />
        <DemoCode title="脚本 - 选择器状态" :code="codes.status.script" />
      </template>
    </DemoSection>

    <!-- 样式配置示例 -->
    <DemoSection title="样式配置" desc="支持不同尺寸、对齐方式和视觉状态">
      <wd-cell-group>
        <wd-select-picker
          v-model="styleNormalValue"
          label="默认尺寸"
          :columns="basicColumns"
          @confirm="handleStyleNormalConfirm"
        />
        <wd-select-picker
          v-model="styleLargeValue"
          label="大尺寸"
          size="large"
          :columns="basicColumns"
          @confirm="handleStyleLargeConfirm"
        />
        <wd-select-picker
          v-model="styleRightValue"
          label="右对齐"
          align-right
          :columns="basicColumns"
          @confirm="handleStyleRightConfirm"
        />
        <wd-select-picker
          v-model="styleErrorValue"
          label="错误状态"
          error
          :columns="basicColumns"
          @confirm="handleStyleErrorConfirm"
        />
        <wd-select-picker
          v-model="styleRequiredValue"
          label="必填项"
          required
          clearable
          :columns="basicColumns"
          @confirm="handleStyleRequiredConfirm"
        />
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 样式配置" :code="codes.style.template" />
        <DemoCode title="脚本 - 样式配置" :code="codes.style.script" />
      </template>
    </DemoSection>

    <!-- 搜索功能示例 -->
    <DemoSection title="搜索功能" desc="支持本地搜索，可快速筛选选项">
      <wd-cell-group>
        <wd-select-picker
          v-model="searchMultiValue"
          label="多选搜索"
          filterable
          :columns="searchColumns"
          @confirm="handleSearchMultiConfirm"
        />
        <wd-select-picker
          v-model="searchSingleValue"
          label="单选搜索"
          type="radio"
          filterable
          :columns="searchColumns"
          @confirm="handleSearchSingleConfirm"
        />
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 搜索功能" :code="codes.search.template" />
        <DemoCode title="脚本 - 搜索功能" :code="codes.search.script" />
      </template>
    </DemoSection>

    <!-- 自定义功能示例 -->
    <DemoSection title="自定义功能" desc="支持自定义显示格式、确认前校验和标题">
      <wd-cell-group>
        <wd-select-picker
          v-model="customFormatValue"
          label="自定义格式"
          :columns="basicColumns"
          :display-format="customDisplayFormat"
          @confirm="handleCustomFormatConfirm"
        />
        <wd-select-picker
          v-model="customValidateValue"
          label="确认前校验"
          :columns="basicColumns"
          :before-confirm="customBeforeConfirm"
          @confirm="handleCustomValidateConfirm"
        />
        <wd-select-picker
          v-model="customTitleValue"
          label="自定义标题"
          title="请选择商品类型"
          :columns="basicColumns"
          @confirm="handleCustomTitleConfirm"
        />
        <wd-select-picker
          v-model="customClearValue"
          label="可清空"
          type="radio"
          clearable
          :show-confirm="false"
          :columns="basicColumns"
          @confirm="handleCustomClearConfirm"
        />
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 自定义功能" :code="codes.custom.template" />
        <DemoCode title="脚本 - 自定义功能" :code="codes.custom.script" />
      </template>
    </DemoSection>

    <!-- 自定义外观示例 -->
    <DemoSection title="自定义外观" desc="支持无标签和完全自定义的选择器样式">
      <view class="space-y-4">
        <!-- 无标签选择器 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">无标签选择器</view>
          <wd-select-picker
            v-model="appearanceNoLabelValue"
            placeholder="请选择商品类型"
            :columns="basicColumns"
            @confirm="handleAppearanceNoLabelConfirm"
          />
        </view>

        <!-- 自定义选择器 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">自定义选择器</view>
          <view class="space-y-3">
            <view class="text-xs text-gray-600">
              当前选中：{{ customSelectedText || '未选择' }}
            </view>
            <wd-select-picker
              v-model="appearanceCustomValue"
              use-default-slot
              :columns="basicColumns"
              @confirm="handleAppearanceCustomConfirm"
            >
              <wd-button type="primary" size="small">
                <wd-icon name="down" custom-class="mr-1" />
                选择商品类型
              </wd-button>
            </wd-select-picker>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 自定义外观" :code="codes.appearance.template" />
        <DemoCode title="脚本 - 自定义外观" :code="codes.appearance.script" />
      </template>
    </DemoSection>

    <!-- 事件监听示例 -->
    <DemoSection title="事件监听" desc="完整的事件处理，包含选择、确认、取消等事件">
      <!-- 事件监听选择器 -->
      <view class="space-y-4">
        <wd-cell-group>
          <wd-select-picker
            v-model="eventsValue"
            label="事件监听"
            :columns="basicColumns"
            @open="handleEventsOpen"
            @close="handleEventsClose"
            @change="handleEventsChange"
            @confirm="handleEventsConfirm"
            @cancel="handleEventsCancel"
            @clear="handleEventsClear"
          />
        </wd-cell-group>

        <!-- 事件日志显示 -->
        <view class="mx-4 rounded-lg bg-gray-50 p-4">
          <view class="mb-3 flex items-center justify-between">
            <view class="text-sm text-gray-700 font-medium">事件日志</view>
            <wd-button size="small" @click="clearEventsLogs">清空</wd-button>
          </view>
          <view class="h-32 overflow-y-auto border rounded bg-white p-2">
            <view
              v-for="(log, index) in eventsLogs"
              :key="index"
              class="mb-1 text-xs"
              :class="getLogColor(log.type)"
            >
              <text class="text-gray-400">[{{ log.time }}]</text>
              {{ log.message }}
            </view>
            <view v-if="eventsLogs.length === 0" class="py-4 text-center text-gray-400">
              暂无事件日志
            </view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 事件监听" :code="codes.events.template" />
        <DemoCode title="脚本 - 事件监听" :code="codes.events.script" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { useToast } from '@/wd'
import type {
  SelectPickerBeforeConfirm,
  SelectPickerDisplayFormat
} from '@/wd/components/wd-select-picker/wd-select-picker.vue'
import { ref } from 'vue'

// ===== 基础数据定义 =====

// 基础选项数据
const basicColumns = ref([
  { value: '101', label: '男装' },
  { value: '102', label: '设计品' },
  { value: '103', label: '女装' },
  { value: '104', label: '鞋靴' },
  { value: '105', label: '内衣配饰' },
  { value: '106', label: '箱包' },
  { value: '107', label: '美妆护肤' },
  { value: '108', label: '个护清洁' },
  { value: '109', label: '钟表珠宝' },
  { value: '110', label: '手机' },
  { value: '111', label: '数码' },
  { value: '112', label: '电脑办公' }
])

// 带禁用选项的数据
const disabledColumns = ref([
  { value: '101', label: '男装', disabled: true },
  { value: '102', label: '设计品' },
  { value: '103', label: '女装' },
  { value: '104', label: '鞋靴', disabled: true },
  { value: '105', label: '内衣配饰' }
])

// 搜索用的更多数据
const searchColumns = ref([
  { value: '101', label: '男装' },
  { value: '102', label: '设计品' },
  { value: '103', label: '女装' },
  { value: '104', label: '鞋靴' },
  { value: '105', label: '内衣配饰' },
  { value: '106', label: '箱包' },
  { value: '107', label: '美妆护肤' },
  { value: '108', label: '个护清洁' },
  { value: '109', label: '钟表珠宝' },
  { value: '110', label: '手机' },
  { value: '111', label: '数码' },
  { value: '112', label: '电脑办公' },
  { value: '113', label: '家用电器' },
  { value: '114', label: '家居家装' },
  { value: '115', label: '母婴用品' },
  { value: '116', label: '食品饮料' },
  { value: '117', label: '酒类' },
  { value: '118', label: '生鲜' },
  { value: '119', label: '汽车用品' },
  { value: '120', label: '运动健康' }
])

// ===== 组件状态管理 =====

// 基本用法状态
const basicMultiValue = ref<string[]>(['101'])
const basicSingleValue = ref<string>('102')
const basicAutoValue = ref<string>('101')

// 选择器状态
const statusNormalValue = ref<string[]>(['103'])
const statusDisabledValue = ref<string[]>(['102'])
const statusReadonlyValue = ref<string[]>(['103'])
const statusLoadingValue = ref<string[]>([])
const statusDisabledOptionsValue = ref<string[]>([])

// 样式配置状态
const styleNormalValue = ref<string[]>(['101'])
const styleLargeValue = ref<string[]>(['102'])
const styleRightValue = ref<string[]>(['103'])
const styleErrorValue = ref<string[]>([])
const styleRequiredValue = ref<string[]>(['104'])

// 搜索功能状态
const searchMultiValue = ref<string[]>(['102'])
const searchSingleValue = ref<string>('107')

// 自定义功能状态
const customFormatValue = ref<string[]>(['101', '103'])
const customValidateValue = ref<string[]>([])
const customTitleValue = ref<string[]>([])
const customClearValue = ref<string>('101')

// 自定义外观状态
const appearanceNoLabelValue = ref<string[]>([])
const appearanceCustomValue = ref<string[]>([])
const customSelectedText = ref<string>('')

// 事件监听状态
const eventsValue = ref<string[]>(['102'])

// 事件日志相关
interface EventLog {
  time: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

const eventsLogs = ref<EventLog[]>([])

// Toast 实例
const toast = useToast()

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    template: `<!-- 多选(默认) -->
<wd-select-picker
  v-model="basicMultiValue"
  label="多选(默认)"
  :columns="basicColumns"
  @confirm="handleBasicMultiConfirm"
/>

<!-- 单选模式 -->
<wd-select-picker
  v-model="basicSingleValue"
  label="单选模式"
  type="radio"
  :columns="basicColumns"
  @confirm="handleBasicSingleConfirm"
/>

<!-- 自动确认 -->
<wd-select-picker
  v-model="basicAutoValue"
  label="自动确认"
  type="radio"
  :show-confirm="false"
  :columns="basicColumns"
  @confirm="handleBasicAutoConfirm"
/>`,

    script: `import { ref } from 'vue'

// 基础选项数据
const basicColumns = ref([
  { value: '101', label: '男装' },
  { value: '102', label: '设计品' },
  { value: '103', label: '女装' },
  { value: '104', label: '鞋靴' },
  { value: '105', label: '内衣配饰' }
])

// 基本用法状态
const basicMultiValue = ref(['101'])
const basicSingleValue = ref('102')
const basicAutoValue = ref('101')

/**
 * 多选确认事件
 */
const handleBasicMultiConfirm = ({ value, selectedItems }) => {
  console.log('多选确认:', value, selectedItems)
}

/**
 * 单选确认事件
 */
const handleBasicSingleConfirm = ({ value, selectedItems }) => {
  console.log('单选确认:', value, selectedItems)
}

/**
 * 自动确认事件
 */
const handleBasicAutoConfirm = ({ value, selectedItems }) => {
  console.log('自动确认:', value, selectedItems)
}`
  },

  // 选择器状态代码
  status: {
    template: `<!-- 正常状态 -->
<wd-select-picker
  v-model="statusNormalValue"
  label="正常状态"
  :columns="basicColumns"
/>

<!-- 禁用状态 -->
<wd-select-picker
  v-model="statusDisabledValue"
  label="禁用状态"
  disabled
  :columns="basicColumns"
/>

<!-- 只读状态 -->
<wd-select-picker
  v-model="statusReadonlyValue"
  label="只读状态"
  readonly
  :columns="basicColumns"
/>

<!-- 加载状态 -->
<wd-select-picker
  v-model="statusLoadingValue"
  label="加载状态"
  loading
  :columns="basicColumns"
/>

<!-- 禁用选项 -->
<wd-select-picker
  v-model="statusDisabledOptionsValue"
  label="禁用选项"
  :columns="disabledColumns"
/>`,

    script: `// 带禁用选项的数据
const disabledColumns = ref([
  { value: '101', label: '男装', disabled: true },
  { value: '102', label: '设计品' },
  { value: '103', label: '女装' },
  { value: '104', label: '鞋靴', disabled: true },
  { value: '105', label: '内衣配饰' }
])

// 选择器状态
const statusNormalValue = ref(['103'])
const statusDisabledValue = ref(['102'])
const statusReadonlyValue = ref(['103'])
const statusLoadingValue = ref([])
const statusDisabledOptionsValue = ref([])`
  },

  // 样式配置代码
  style: {
    template: `<!-- 默认尺寸 -->
<wd-select-picker
  v-model="styleNormalValue"
  label="默认尺寸"
  :columns="basicColumns"
/>

<!-- 大尺寸 -->
<wd-select-picker
  v-model="styleLargeValue"
  label="大尺寸"
  size="large"
  :columns="basicColumns"
/>

<!-- 右对齐 -->
<wd-select-picker
  v-model="styleRightValue"
  label="右对齐"
  align-right
  :columns="basicColumns"
/>

<!-- 错误状态 -->
<wd-select-picker
  v-model="styleErrorValue"
  label="错误状态"
  error
  :columns="basicColumns"
/>

<!-- 必填项 -->
<wd-select-picker
  v-model="styleRequiredValue"
  label="必填项"
  required
  clearable
  :columns="basicColumns"
/>`,

    script: `// 样式配置状态
const styleNormalValue = ref(['101'])
const styleLargeValue = ref(['102'])
const styleRightValue = ref(['103'])
const styleErrorValue = ref([])
const styleRequiredValue = ref(['104'])`
  },

  // 搜索功能代码
  search: {
    template: `<!-- 多选搜索 -->
<wd-select-picker
  v-model="searchMultiValue"
  label="多选搜索"
  filterable
  :columns="searchColumns"
/>

<!-- 单选搜索 -->
<wd-select-picker
  v-model="searchSingleValue"
  label="单选搜索"
  type="radio"
  filterable
  :columns="searchColumns"
/>`,

    script: `// 搜索用的更多数据
const searchColumns = ref([
  { value: '101', label: '男装' },
  { value: '102', label: '设计品' },
  { value: '103', label: '女装' },
  // ... 更多选项
  { value: '120', label: '运动健康' }
])

// 搜索功能状态
const searchMultiValue = ref(['102'])
const searchSingleValue = ref('107')`
  },

  // 自定义功能代码
  custom: {
    template: `<!-- 自定义格式 -->
<wd-select-picker
  v-model="customFormatValue"
  label="自定义格式"
  :columns="basicColumns"
  :display-format="customDisplayFormat"
/>

<!-- 确认前校验 -->
<wd-select-picker
  v-model="customValidateValue"
  label="确认前校验"
  :columns="basicColumns"
  :before-confirm="customBeforeConfirm"
/>

<!-- 自定义标题 -->
<wd-select-picker
  v-model="customTitleValue"
  label="自定义标题"
  title="请选择商品类型"
  :columns="basicColumns"
/>

<!-- 可清空 -->
<wd-select-picker
  v-model="customClearValue"
  label="可清空"
  type="radio"
  clearable
  :show-confirm="false"
  :columns="basicColumns"
/>`,

    script: `import type {
  SelectPickerBeforeConfirm,
  SelectPickerDisplayFormat
} from '@/wd/components/wd-select-picker/wd-select-picker.vue'

// 自定义显示格式
const customDisplayFormat: SelectPickerDisplayFormat = (items, columns) => {
  let showValue = ''
  columns.forEach((column) => {
    (items as (string | number | boolean)[]).forEach((item, index) => {
      if (column.value === item) {
        showValue += \`\${item}: \${column.label} \${index + 1 < (items as (string | number | boolean)[]).length ? '--' : ''} \`
      }
    })
  })
  return showValue
}

// 确认前的验证
const customBeforeConfirm: SelectPickerBeforeConfirm = (value, resolve) => {
  if ((value as string[]).length > 0) {
    toast.error('暂时无法选择商品')
    resolve(false)
  } else {
    resolve(true)
  }
}

// 自定义功能状态
const customFormatValue = ref(['101', '103'])
const customValidateValue = ref([])
const customTitleValue = ref([])
const customClearValue = ref('101')`
  },

  // 自定义外观代码
  appearance: {
    template: `<!-- 无标签选择器 -->
<wd-select-picker
  v-model="appearanceNoLabelValue"
  placeholder="请选择商品类型"
  :columns="basicColumns"
/>

<!-- 自定义选择器 -->
<wd-select-picker
  v-model="appearanceCustomValue"
  use-default-slot
  :columns="basicColumns"
  @confirm="handleAppearanceCustomConfirm"
>
  <wd-button type="primary" size="small">
    <wd-icon name="down" custom-class="mr-1" />
    选择商品类型
  </wd-button>
</wd-select-picker>`,

    script: `// 自定义外观状态
const appearanceNoLabelValue = ref([])
const appearanceCustomValue = ref([])
const customSelectedText = ref('')

/**
 * 自定义选择器确认事件
 */
const handleAppearanceCustomConfirm = ({ value, selectedItems }) => {
  customSelectedText.value = selectedItems
    .map(item => item.label)
    .join(', ')
  console.log('自定义选择器确认:', value, selectedItems)
}`
  },

  // 事件监听代码
  events: {
    template: `<wd-select-picker
  v-model="eventsValue"
  label="事件监听"
  :columns="basicColumns"
  @open="handleEventsOpen"
  @close="handleEventsClose"
  @change="handleEventsChange"
  @confirm="handleEventsConfirm"
  @cancel="handleEventsCancel"
  @clear="handleEventsClear"
/>`,

    script: `// 事件日志相关
interface EventLog {
  time: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

const eventsLogs = ref<EventLog[]>([])

/**
 * 添加事件日志
 */
const addEventLog = (message: string, type: EventLog['type'] = 'info') => {
  eventsLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
    type
  })

  // 限制日志数量
  if (eventsLogs.value.length > 20) {
    eventsLogs.value = eventsLogs.value.slice(0, 20)
  }
}

/**
 * 事件处理方法
 */
const handleEventsOpen = () => {
  addEventLog('选择器已打开', 'info')
}

const handleEventsClose = () => {
  addEventLog('选择器已关闭', 'info')
}

const handleEventsChange = ({ value }) => {
  addEventLog(\`选择项变化: \${JSON.stringify(value)}\`, 'success')
}

const handleEventsConfirm = ({ value, selectedItems }) => {
  addEventLog(\`确认选择: \${JSON.stringify(value)}\`, 'success')
}

const handleEventsCancel = () => {
  addEventLog('取消选择', 'warning')
}

const handleEventsClear = () => {
  addEventLog('清空选择', 'warning')
}`
  }
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'model-value',
    type: 'String | Number | Boolean | Array',
    default: '[]',
    desc: '选中项，checkbox类型为数组，radio类型为字符串/数字/布尔值'
  },
  {
    name: 'type',
    type: 'String',
    default: '"checkbox"',
    desc: '选择器类型，可选值：checkbox / radio'
  },
  {
    name: 'columns',
    type: 'Array',
    default: '[]',
    desc: '选择器数据，一维数组'
  },
  {
    name: 'value-key',
    type: 'String',
    default: '"value"',
    desc: '选项对象中，value 对应的 key'
  },
  {
    name: 'label-key',
    type: 'String',
    default: '"label"',
    desc: '选项对象中，展示的文本对应的 key'
  },
  {
    name: 'label',
    type: 'String',
    default: '""',
    desc: '选择器左侧文案'
  },
  {
    name: 'label-width',
    type: 'String',
    default: '"33%"',
    desc: '设置左侧标题宽度'
  },
  {
    name: 'placeholder',
    type: 'String',
    default: '""',
    desc: '选择器占位符'
  },
  {
    name: 'title',
    type: 'String',
    default: '""',
    desc: '弹出层标题'
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: '禁用状态'
  },
  {
    name: 'readonly',
    type: 'Boolean',
    default: 'false',
    desc: '只读状态'
  },
  {
    name: 'loading',
    type: 'Boolean',
    default: 'false',
    desc: '加载中状态'
  },
  {
    name: 'loading-color',
    type: 'String',
    default: '"#4D80F0"',
    desc: '加载的颜色，只能使用十六进制的色值写法'
  },
  {
    name: 'size',
    type: 'String',
    default: '""',
    desc: '设置选择器大小，可选值：large'
  },
  {
    name: 'align-right',
    type: 'Boolean',
    default: 'false',
    desc: '选择器的值靠右展示'
  },
  {
    name: 'error',
    type: 'Boolean',
    default: 'false',
    desc: '是否为错误状态，错误状态时右侧内容为红色'
  },
  {
    name: 'required',
    type: 'Boolean',
    default: 'false',
    desc: '必填样式'
  },
  {
    name: 'clearable',
    type: 'Boolean',
    default: 'false',
    desc: '显示清空按钮'
  },
  {
    name: 'filterable',
    type: 'Boolean',
    default: 'false',
    desc: '可搜索（目前只支持本地搜索）'
  },
  {
    name: 'filter-placeholder',
    type: 'String',
    default: '""',
    desc: '搜索框占位符'
  },
  {
    name: 'ellipsis',
    type: 'Boolean',
    default: 'false',
    desc: '是否超出隐藏'
  },
  {
    name: 'scroll-into-view',
    type: 'Boolean',
    default: 'true',
    desc: '重新打开是否滚动到选中项'
  },
  {
    name: 'checked-color',
    type: 'String',
    default: '""',
    desc: '选中的颜色（单/复选框）'
  },
  {
    name: 'min',
    type: 'Number',
    default: '0',
    desc: '最小选中的数量（仅在复选框类型下生效）'
  },
  {
    name: 'max',
    type: 'Number',
    default: '0',
    desc: '最大选中的数量，0 为无限数量（仅在复选框类型下生效）'
  },
  {
    name: 'select-size',
    type: 'String',
    default: '""',
    desc: '设置 picker 内部的选项组尺寸大小（单/复选框）'
  },
  {
    name: 'show-confirm',
    type: 'Boolean',
    default: 'true',
    desc: '是否显示确认按钮（radio类型生效）'
  },
  {
    name: 'confirm-button-text',
    type: 'String',
    default: '""',
    desc: '确认按钮文案'
  },
  {
    name: 'display-format',
    type: 'Function',
    default: '',
    desc: '自定义展示文案的格式化函数，返回一个字符串'
  },
  {
    name: 'before-confirm',
    type: 'Function',
    default: '',
    desc: '确定前校验函数，接收 (value, resolve) 参数'
  },
  {
    name: 'close-on-click-modal',
    type: 'Boolean',
    default: 'true',
    desc: '点击遮罩是否关闭'
  },
  {
    name: 'z-index',
    type: 'Number',
    default: '100',
    desc: '弹窗层级'
  },
  {
    name: 'safe-area-inset-bottom',
    type: 'Boolean',
    default: 'true',
    desc: '弹出面板是否设置底部安全距离'
  },
  {
    name: 'use-label-slot',
    type: 'Boolean',
    default: 'false',
    desc: '使用 label 插槽时设置该选项'
  },
  {
    name: 'use-default-slot',
    type: 'Boolean',
    default: 'false',
    desc: '使用默认插槽时设置该选项'
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

// Methods 方法文档
const apiMethods = [
  {
    name: 'open()',
    desc: '打开选择器弹框'
  },
  {
    name: 'close()',
    desc: '关闭选择器弹框'
  }
]

// Events 事件文档
const apiEvents = [
  {
    name: 'change',
    desc: '选择器值改变时触发，参数为 { value }'
  },
  {
    name: 'confirm',
    desc: '确认选择时触发，参数为 { value, selectedItems }'
  },
  {
    name: 'cancel',
    desc: '取消选择时触发'
  },
  {
    name: 'clear',
    desc: '清空选择时触发'
  },
  {
    name: 'open',
    desc: '打开选择器时触发'
  },
  {
    name: 'close',
    desc: '关闭选择器时触发'
  }
]

// ===== 工具方法 =====

/**
 * 添加事件日志
 */
const addEventLog = (message: string, type: EventLog['type'] = 'info') => {
  eventsLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
    type
  })

  // 限制日志数量
  if (eventsLogs.value.length > 20) {
    eventsLogs.value = eventsLogs.value.slice(0, 20)
  }
}

/**
 * 清空事件日志
 */
const clearEventsLogs = () => {
  eventsLogs.value = []
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
    error: 'text-red-600'
  }
  return colors[type]
}

// ===== 自定义函数定义 =====

/**
 * 自定义显示格式
 */
const customDisplayFormat: SelectPickerDisplayFormat = (items, columns) => {
  let showValue = ''
  columns.forEach((column) => {
    ;(items as (string | number | boolean)[]).forEach((item, index) => {
      if (column.value === item) {
        showValue += `${item}: ${column.label} ${index + 1 < (items as (string | number | boolean)[]).length ? '--' : ''} `
      }
    })
  })
  return showValue
}

/**
 * 确认前的验证
 */
const customBeforeConfirm: SelectPickerBeforeConfirm = (value, resolve) => {
  if ((value as string[]).length > 0) {
    toast.error('暂时无法选择商品')
    resolve(false)
  } else {
    resolve(true)
  }
}

// ===== 基本用法事件处理方法 =====

/**
 * 多选确认事件
 */
const handleBasicMultiConfirm = ({ value, selectedItems }: any) => {
  console.log('多选确认:', value, selectedItems)
}

/**
 * 单选确认事件
 */
const handleBasicSingleConfirm = ({ value, selectedItems }: any) => {
  console.log('单选确认:', value, selectedItems)
}

/**
 * 自动确认事件
 */
const handleBasicAutoConfirm = ({ value, selectedItems }: any) => {
  console.log('自动确认:', value, selectedItems)
}

// ===== 选择器状态事件处理方法 =====

/**
 * 正常状态确认事件
 */
const handleStatusNormalConfirm = ({ value, selectedItems }: any) => {
  console.log('正常状态确认:', value, selectedItems)
}

/**
 * 禁用状态确认事件
 */
const handleStatusDisabledConfirm = ({ value, selectedItems }: any) => {
  console.log('禁用状态确认:', value, selectedItems)
}

/**
 * 只读状态确认事件
 */
const handleStatusReadonlyConfirm = ({ value, selectedItems }: any) => {
  console.log('只读状态确认:', value, selectedItems)
}

/**
 * 加载状态确认事件
 */
const handleStatusLoadingConfirm = ({ value, selectedItems }: any) => {
  console.log('加载状态确认:', value, selectedItems)
}

/**
 * 禁用选项确认事件
 */
const handleStatusDisabledOptionsConfirm = ({ value, selectedItems }: any) => {
  console.log('禁用选项确认:', value, selectedItems)
}

// ===== 样式配置事件处理方法 =====

/**
 * 默认尺寸确认事件
 */
const handleStyleNormalConfirm = ({ value, selectedItems }: any) => {
  console.log('默认尺寸确认:', value, selectedItems)
}

/**
 * 大尺寸确认事件
 */
const handleStyleLargeConfirm = ({ value, selectedItems }: any) => {
  console.log('大尺寸确认:', value, selectedItems)
}

/**
 * 右对齐确认事件
 */
const handleStyleRightConfirm = ({ value, selectedItems }: any) => {
  console.log('右对齐确认:', value, selectedItems)
}

/**
 * 错误状态确认事件
 */
const handleStyleErrorConfirm = ({ value, selectedItems }: any) => {
  console.log('错误状态确认:', value, selectedItems)
}

/**
 * 必填项确认事件
 */
const handleStyleRequiredConfirm = ({ value, selectedItems }: any) => {
  console.log('必填项确认:', value, selectedItems)
}

// ===== 搜索功能事件处理方法 =====

/**
 * 多选搜索确认事件
 */
const handleSearchMultiConfirm = ({ value, selectedItems }: any) => {
  console.log('多选搜索确认:', value, selectedItems)
}

/**
 * 单选搜索确认事件
 */
const handleSearchSingleConfirm = ({ value, selectedItems }: any) => {
  console.log('单选搜索确认:', value, selectedItems)
}

// ===== 自定义功能事件处理方法 =====

/**
 * 自定义格式确认事件
 */
const handleCustomFormatConfirm = ({ value, selectedItems }: any) => {
  console.log('自定义格式确认:', value, selectedItems)
}

/**
 * 自定义校验确认事件
 */
const handleCustomValidateConfirm = ({ value, selectedItems }: any) => {
  console.log('自定义校验确认:', value, selectedItems)
}

/**
 * 自定义标题确认事件
 */
const handleCustomTitleConfirm = ({ value, selectedItems }: any) => {
  console.log('自定义标题确认:', value, selectedItems)
}

/**
 * 可清空确认事件
 */
const handleCustomClearConfirm = ({ value, selectedItems }: any) => {
  console.log('可清空确认:', value, selectedItems)
}

// ===== 自定义外观事件处理方法 =====

/**
 * 无标签确认事件
 */
const handleAppearanceNoLabelConfirm = ({ value, selectedItems }: any) => {
  console.log('无标签确认:', value, selectedItems)
}

/**
 * 自定义选择器确认事件
 */
const handleAppearanceCustomConfirm = ({ value, selectedItems }: any) => {
  customSelectedText.value = selectedItems
    .map((item: any) => item.label)
    .join(', ')
  console.log('自定义选择器确认:', value, selectedItems)
}

// ===== 事件监听事件处理方法 =====

/**
 * 打开事件处理
 */
const handleEventsOpen = () => {
  addEventLog('选择器已打开', 'info')
}

/**
 * 关闭事件处理
 */
const handleEventsClose = () => {
  addEventLog('选择器已关闭', 'info')
}

/**
 * 选择变化事件处理
 */
const handleEventsChange = ({ value }: any) => {
  addEventLog(`选择项变化: ${JSON.stringify(value)}`, 'success')
}

/**
 * 确认事件处理
 */
const handleEventsConfirm = ({ value, selectedItems }: any) => {
  addEventLog(`确认选择: ${JSON.stringify(value)}`, 'success')
}

/**
 * 取消事件处理
 */
const handleEventsCancel = () => {
  addEventLog('取消选择', 'warning')
}

/**
 * 清空事件处理
 */
const handleEventsClear = () => {
  addEventLog('清空选择', 'warning')
}

const { resetScrollTop, updateScrollTop } = useScroll()
onShow(() => {
  resetScrollTop()
})
onPageScroll((e) => {
  updateScrollTop(e.scrollTop)
})
</script>
