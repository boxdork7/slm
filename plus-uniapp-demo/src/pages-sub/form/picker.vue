<!-- Picker 选择器 http://127.0.0.1:100/#/pages-sub/demo/wd/picker -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Picker 选择器" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的选择器使用方式，支持单列和多列选择">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-picker v-model="basicValue" label="单列选择" :columns="basicColumns" />
        <wd-picker v-model="multiValue" label="多列选择" :columns="multiColumns" />
        <wd-picker v-model="objectValue" label="对象数组" :columns="objectColumns" />
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 单列选择" :code="codes.basic.singleTemplate" />
        <DemoCode title="模板 - 多列选择" :code="codes.basic.multiTemplate" />
        <DemoCode title="模板 - 对象数组" :code="codes.basic.objectTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 状态配置示例 -->
    <DemoSection title="状态配置" desc="支持禁用、只读、加载中等多种状态">
      <wd-cell-group>
        <wd-picker v-model="disabledValue" label="禁用状态" disabled :columns="basicColumns" />
        <wd-picker v-model="readonlyValue" label="只读状态" readonly :columns="basicColumns" />
        <wd-picker v-model="loadingValue" label="加载状态" loading :columns="basicColumns" />
        <wd-picker v-model="errorValue" label="错误状态" error :columns="basicColumns" />
        <wd-picker v-model="requiredValue" label="必填项" required :columns="basicColumns" />
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 状态配置" :code="codes.status.template" />
        <DemoCode title="脚本 - 状态配置" :code="codes.status.script" />
      </template>
    </DemoSection>

    <!-- 样式配置示例 -->
    <DemoSection title="样式配置" desc="不同尺寸、对齐方式和显示样式">
      <wd-cell-group>
        <wd-picker v-model="largeValue" label="大尺寸" size="large" :columns="basicColumns" />
        <wd-picker v-model="alignValue" label="右对齐" align-right :columns="basicColumns" />
        <wd-picker v-model="clearableValue" label="可清空" clearable :columns="basicColumns" />
      </wd-cell-group>

      <!-- 无标签样式 -->
      <view class="mx-4 mt-4 rounded-xl bg-white p-4">
        <view class="mb-3 text-sm text-gray-600">无标签样式</view>
        <wd-picker v-model="noLabelValue" :columns="basicColumns" />
      </view>

      <template #codes>
        <DemoCode title="模板 - 尺寸配置" :code="codes.style.sizeTemplate" />
        <DemoCode title="模板 - 对齐方式" :code="codes.style.alignTemplate" />
        <DemoCode title="模板 - 可清空" :code="codes.style.clearableTemplate" />
        <DemoCode title="模板 - 无标签" :code="codes.style.noLabelTemplate" />
        <DemoCode title="脚本 - 样式配置" :code="codes.style.script" />
      </template>
    </DemoSection>

    <!-- 多级联动示例 -->
    <DemoSection title="多级联动" desc="通过 column-change 实现列之间的级联选择">
      <wd-cell-group>
        <wd-picker
          v-model="cascadeValue"
          label="省市区联动"
          :columns="cascadeColumns"
          :column-change="onCascadeChange"
        />
        <wd-picker
          v-model="cascadeClearValue"
          label="级联可清空"
          clearable
          :columns="cascadeClearColumns"
          :column-change="onCascadeClearChange"
        />
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 多级联动" :code="codes.cascade.template" />
        <DemoCode title="脚本 - 联动逻辑" :code="codes.cascade.script" />
        <DemoCode title="脚本 - 地区数据" :code="codes.cascade.dataScript" />
      </template>
    </DemoSection>

    <!-- 自定义配置示例 -->
    <DemoSection title="自定义配置" desc="自定义标题、按钮文案、显示格式等">
      <wd-cell-group>
        <wd-picker
          v-model="titleValue"
          label="自定义标题"
          title="请选择选项"
          :columns="basicColumns"
        />
        <wd-picker
          v-model="buttonValue"
          label="自定义按钮"
          cancel-button-text="关闭"
          confirm-button-text="确定"
          :columns="multiColumns"
        />
        <wd-picker
          v-model="formatValue"
          label="自定义格式"
          :columns="multiColumns"
          :display-format="customDisplayFormat"
        />
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 自定义标题" :code="codes.custom.titleTemplate" />
        <DemoCode title="模板 - 自定义按钮" :code="codes.custom.buttonTemplate" />
        <DemoCode title="模板 - 自定义格式" :code="codes.custom.formatTemplate" />
        <DemoCode title="脚本 - 自定义配置" :code="codes.custom.script" />
      </template>
    </DemoSection>

    <!-- 确认前校验示例 -->
    <DemoSection title="确认前校验" desc="在确认选择前进行数据校验">
      <wd-cell-group>
        <wd-picker
          v-model="validateValue"
          label="校验选择"
          :columns="basicColumns"
          :before-confirm="handleBeforeConfirm"
        />
      </wd-cell-group>

      <!-- 校验提示信息 -->
      <view class="mx-4 mt-4 rounded-lg bg-blue-50 px-4 py-3">
        <view class="text-xs text-blue-600 font-medium">
          💡 提示：选择"选项2"或"选项3"将校验失败
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 确认前校验" :code="codes.validate.template" />
        <DemoCode title="脚本 - 校验逻辑" :code="codes.validate.script" />
      </template>
    </DemoSection>

    <!-- 默认插槽示例 -->
    <DemoSection title="默认插槽" desc="使用默认插槽自定义触发器">
      <!-- 插槽示例 -->
      <view class="space-y-4">
        <view class="mx-4 rounded-lg bg-gray-50 p-4">
          <view class="mb-2 text-sm text-gray-600">选中值：</view>
          <view class="text-base text-blue-600 font-medium">
            {{ slotValue || '暂未选择' }}
          </view>
        </view>

        <view class="mx-4">
          <wd-picker
            v-model="slotValue"
            :columns="basicColumns"
            use-default-slot
            @confirm="handleSlotConfirm"
          >
            <wd-button block type="primary">点击选择</wd-button>
          </wd-picker>
        </view>

        <view class="mx-4">
          <wd-picker
            v-model="slotValue2"
            :columns="basicColumns"
            use-default-slot
            @confirm="handleSlotConfirm2"
          >
            <view
              class="flex items-center justify-center border-2 border-gray-300 rounded-lg border-dashed p-4"
            >
              <view class="text-center">
                <wd-icon name="add" size="24" color="#999" />
                <view class="mt-1 text-sm text-gray-500">自定义触发器</view>
              </view>
            </view>
          </wd-picker>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 按钮触发器" :code="codes.slot.buttonTemplate" />
        <DemoCode title="模板 - 自定义触发器" :code="codes.slot.customTemplate" />
        <DemoCode title="脚本 - 默认插槽" :code="codes.slot.script" />
      </template>
    </DemoSection>

    <!-- 事件监听示例 -->
    <DemoSection title="事件监听" desc="监听选择器的各种交互事件">
      <!-- 控制按钮 -->
      <view class="space-y-4">
        <wd-cell-group>
          <wd-picker
            v-model="eventValue"
            label="事件监听"
            :columns="basicColumns"
            @open="handleOpen"
            @confirm="handleEventConfirm"
            @cancel="handleCancel"
            @clear="handleClear"
          />
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

      <template #codes>
        <DemoCode title="模板 - 事件监听" :code="codes.events.template" />
        <DemoCode title="脚本 - 事件处理" :code="codes.events.script" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/wd'
import type {
  ColumnItem,
  PickerViewColumnChange,
} from '@/wd/components/wd-picker-view/wd-picker-view.vue'
import type {
  PickerBeforeConfirm,
  PickerDisplayFormat,
} from '@/wd/components/wd-picker/wd-picker.vue'

// ===== 组件状态管理 =====

const toast = useToast()

// 基本用法状态
const basicValue = ref<string>('')
const multiValue = ref<Array<string>>([])
const objectValue = ref<string>('')

// 状态配置
const disabledValue = ref<string>('选项2')
const readonlyValue = ref<string>('选项3')
const loadingValue = ref<string>('选项1')
const errorValue = ref<string>('')
const requiredValue = ref<string>('')

// 样式配置
const largeValue = ref<string>('选项1')
const alignValue = ref<string>('选项2')
const clearableValue = ref<string>('选项3')
const noLabelValue = ref<string>('选项1')

// 多级联动状态
const cascadeValue = ref<Array<string>>(['110000', '110100', '110102'])
const cascadeClearValue = ref<Array<string>>(['110000', '110100', '110102'])

// 自定义配置
const titleValue = ref<string>('选项1')
const buttonValue = ref<Array<string>>(['中山大学', '软件工程'])
const formatValue = ref<Array<string>>(['中南大学', '计算机科学与技术'])

// 确认前校验
const validateValue = ref<string>('')

// 默认插槽
const slotValue = ref<string>('选项2')
const slotValue2 = ref<string>('')

// 事件监听
const eventValue = ref<string>('选项1')

// 事件日志状态
interface EventLog {
  time: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

const eventLogs = ref<EventLog[]>([])

// ===== 数据源定义 =====

// 基本选项数据
const basicColumns = ref<string[]>([
  '选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1',
  '选项2',
  '选项3',
  '选项4',
  '选项5',
  '选项6',
  '选项7',
])

// 多列选择数据
const multiColumns = ref<Array<string[]>>([
  ['中山大学', '中南大学', '华南理工大学'],
  ['计算机科学与技术', '软件工程', '通信工程', '法学', '经济学'],
])

// 对象数组数据
const objectColumns = ref<ColumnItem[]>([
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai' },
  { label: '广州', value: 'guangzhou' },
  { label: '深圳', value: 'shenzhen' },
])

// 地区数据结构
const district: Record<string, Array<{ label: string; value: string }>> = {
  0: [
    { label: '北京', value: '110000' },
    { label: '广东省', value: '440000' },
  ],
  110000: [{ label: '北京', value: '110100' }],
  440000: [
    { label: '广州市', value: '440100' },
    { label: '韶关市', value: '440200' },
    { label: '深圳市', value: '440300' },
    { label: '珠海市', value: '440400' },
    { label: '汕头市', value: '440500' },
  ],
  110100: [
    { label: '东城区', value: '110101' },
    { label: '西城区', value: '110102' },
    { label: '朝阳区', value: '110105' },
    { label: '丰台区', value: '110106' },
    { label: '石景山区', value: '110107' },
  ],
  440100: [
    { label: '荔湾区', value: '440103' },
    { label: '越秀区', value: '440104' },
    { label: '海珠区', value: '440105' },
  ],
  440200: [{ label: '武江区', value: '440203' }],
  440300: [
    { label: '罗湖区', value: '440303' },
    { label: '福田区', value: '440304' },
  ],
  440400: [
    { label: '香洲区', value: '440402' },
    { label: '斗门区', value: '440403' },
    { label: '金湾区', value: '440404' },
  ],
  440500: [
    { label: '龙湖区', value: '440507' },
    { label: '金平区', value: '440511' },
  ],
}

// 多级联动列数据
const cascadeColumns = ref([
  district[0],
  district[district[0][0].value],
  district[district[district[0][0].value][0].value],
])

const cascadeClearColumns = ref([
  district[0],
  district[district[0][0].value],
  district[district[district[0][0].value][0].value],
])

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    singleTemplate: `<wd-picker label="单列选择" v-model="basicValue" :columns="basicColumns" />`,

    multiTemplate: `<wd-picker label="多列选择" v-model="multiValue" :columns="multiColumns" />`,

    objectTemplate: `<wd-picker label="对象数组" v-model="objectValue" :columns="objectColumns" />`,

    script: `import { ref } from 'vue'

// 基本用法状态
const basicValue = ref('')
const multiValue = ref([])
const objectValue = ref('')

// 基本选项数据
const basicColumns = ref([
  '选项1', '选项2', '选项3', '选项4', '选项5', '选项6', '选项7'
])

// 多列选择数据
const multiColumns = ref([
  ['中山大学', '中南大学', '华南理工大学'],
  ['计算机科学与技术', '软件工程', '通信工程', '法学', '经济学']
])

// 对象数组数据
const objectColumns = ref([
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai' },
  { label: '广州', value: 'guangzhou' },
  { label: '深圳', value: 'shenzhen' }
])`,
  },

  // 状态配置代码
  status: {
    template: `<wd-cell-group>
  <wd-picker label="禁用状态" disabled v-model="disabledValue" :columns="basicColumns" />
  <wd-picker label="只读状态" readonly v-model="readonlyValue" :columns="basicColumns" />
  <wd-picker label="加载状态" loading v-model="loadingValue" :columns="basicColumns" />
  <wd-picker label="错误状态" error v-model="errorValue" :columns="basicColumns" />
  <wd-picker label="必填项" required v-model="requiredValue" :columns="basicColumns" />
</wd-cell-group>`,

    script: `// 状态配置
const disabledValue = ref('选项2')
const readonlyValue = ref('选项3')
const loadingValue = ref('选项1')
const errorValue = ref('')
const requiredValue = ref('')`,
  },

  // 样式配置代码
  style: {
    sizeTemplate: `<wd-picker label="大尺寸" size="large" v-model="largeValue" :columns="basicColumns" />`,

    alignTemplate: `<wd-picker label="右对齐" align-right v-model="alignValue" :columns="basicColumns" />`,

    clearableTemplate: `<wd-picker label="可清空" clearable v-model="clearableValue" :columns="basicColumns" />`,

    noLabelTemplate: `<wd-picker :columns="basicColumns" v-model="noLabelValue" />`,

    script: `// 样式配置
const largeValue = ref('选项1')
const alignValue = ref('选项2')
const clearableValue = ref('选项3')
const noLabelValue = ref('选项1')`,
  },

  // 多级联动代码
  cascade: {
    template: `<wd-picker
  label="省市区联动"
  v-model="cascadeValue"
  :columns="cascadeColumns"
  :column-change="onCascadeChange"
/>`,

    script: `// 多级联动处理函数
const onCascadeChange = (pickerView, value, columnIndex, resolve) => {
  const item = value[columnIndex]
  if (columnIndex === 0) {
    // 第一列改变时，更新第二列和第三列数据
    pickerView.setColumnData(1, district[item.value])
    pickerView.setColumnData(2, district[district[item.value][0].value])
  } else if (columnIndex === 1) {
    // 第二列改变时，更新第三列数据
    pickerView.setColumnData(2, district[item.value])
  }
  resolve()
}`,

    dataScript: `// 地区数据结构
const district = {
  0: [
    { label: '北京', value: '110000' },
    { label: '广东省', value: '440000' }
  ],
  110000: [{ label: '北京', value: '110100' }],
  440000: [
    { label: '广州市', value: '440100' },
    { label: '韶关市', value: '440200' },
    { label: '深圳市', value: '440300' }
  ],
  // ... 更多地区数据
}`,
  },

  // 自定义配置代码
  custom: {
    titleTemplate: `<wd-picker
  label="自定义标题"
  title="请选择选项"
  v-model="titleValue"
  :columns="basicColumns"
/>`,

    buttonTemplate: `<wd-picker
  label="自定义按钮"
  cancel-button-text="关闭"
  confirm-button-text="确定"
  v-model="buttonValue"
  :columns="multiColumns"
/>`,

    formatTemplate: `<wd-picker
  label="自定义格式"
  v-model="formatValue"
  :columns="multiColumns"
  :display-format="customDisplayFormat"
/>`,

    script: `// 自定义显示格式函数
const customDisplayFormat = (items) => {
  return items.map(item => item.label).join(' → ')
}

// 自定义配置状态
const titleValue = ref('选项1')
const buttonValue = ref(['中山大学', '软件工程'])
const formatValue = ref(['中南大学', '计算机科学与技术'])`,
  },

  // 确认前校验代码
  validate: {
    template: `<wd-picker
  label="校验选择"
  v-model="validateValue"
  :columns="basicColumns"
  :before-confirm="handleBeforeConfirm"
/>`,

    script: `// 确认前校验函数
const handleBeforeConfirm = (value, resolve, picker) => {
  picker.setLoading(true)
  setTimeout(() => {
    picker.setLoading(false)
    if (['选项2', '选项3'].includes(value)) {
      resolve(false)
      toast.error('选项校验不通过，请重新选择')
    } else {
      resolve(true)
    }
  }, 2000)
}`,
  },

  // 默认插槽代码
  slot: {
    buttonTemplate: `<wd-picker
  :columns="basicColumns"
  v-model="slotValue"
  use-default-slot
  @confirm="handleSlotConfirm"
>
  <wd-button block type="primary">点击选择</wd-button>
</wd-picker>`,

    customTemplate: `<wd-picker
  :columns="basicColumns"
  v-model="slotValue2"
  use-default-slot
  @confirm="handleSlotConfirm2"
>
  <view class="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4">
    <view class="text-center">
      <wd-icon name="add" size="24" color="#999" />
      <view class="mt-1 text-sm text-gray-500">自定义触发器</view>
    </view>
  </view>
</wd-picker>`,

    script: `// 默认插槽状态
const slotValue = ref('选项2')
const slotValue2 = ref('')

// 插槽确认处理
const handleSlotConfirm = ({ value }) => {
  slotValue.value = value
}

const handleSlotConfirm2 = ({ value }) => {
  slotValue2.value = value
}`,
  },

  // 事件监听代码
  events: {
    template: `<wd-picker
  label="事件监听"
  v-model="eventValue"
  :columns="basicColumns"
  @open="handleOpen"
  @confirm="handleEventConfirm"
  @cancel="handleCancel"
  @clear="handleClear"
/>`,

    script: `// 事件处理方法
const handleOpen = () => {
  addEventLog('选择器已打开', 'info')
}

const handleEventConfirm = ({ value, selectedItems }) => {
  addEventLog(\`确认选择：\${value}\`, 'success')
}

const handleCancel = () => {
  addEventLog('取消选择', 'warning')
}

const handleClear = () => {
  addEventLog('清空选择', 'info')
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'model-value',
    type: 'String | Number | Array',
    default: '""',
    desc: '选中项，多列选择器为数组',
  },
  {
    name: 'columns',
    type: 'Array',
    default: '[]',
    desc: '选择器数据，支持字符串数组、对象数组或二维数组',
  },
  {
    name: 'label',
    type: 'String',
    default: '""',
    desc: '选择器左侧文案',
  },
  {
    name: 'placeholder',
    type: 'String',
    default: '"请选择"',
    desc: '选择器占位符',
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: '是否禁用',
  },
  {
    name: 'readonly',
    type: 'Boolean',
    default: 'false',
    desc: '是否只读',
  },
  {
    name: 'loading',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示加载状态',
  },
  {
    name: 'title',
    type: 'String',
    default: '""',
    desc: '弹出层标题',
  },
  {
    name: 'cancel-button-text',
    type: 'String',
    default: '"取消"',
    desc: '取消按钮文案',
  },
  {
    name: 'confirm-button-text',
    type: 'String',
    default: '"确认"',
    desc: '确认按钮文案',
  },
  {
    name: 'required',
    type: 'Boolean',
    default: 'false',
    desc: '是否必填',
  },
  {
    name: 'size',
    type: 'String',
    default: '"default"',
    desc: '尺寸，可选值：default / large',
  },
  {
    name: 'align-right',
    type: 'Boolean',
    default: 'false',
    desc: '是否右对齐显示',
  },
  {
    name: 'clearable',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示清空按钮',
  },
  {
    name: 'error',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示错误状态',
  },
  {
    name: 'use-default-slot',
    type: 'Boolean',
    default: 'false',
    desc: '是否使用默认插槽',
  },
  {
    name: 'column-change',
    type: 'Function',
    default: '""',
    desc: '列改变时的回调函数，用于多级联动',
  },
  {
    name: 'display-format',
    type: 'Function',
    default: '""',
    desc: '自定义展示文案的格式化函数',
  },
  {
    name: 'before-confirm',
    type: 'Function',
    default: '""',
    desc: '确认前校验函数',
  },
  {
    name: 'close-on-click-modal',
    type: 'Boolean',
    default: 'true',
    desc: '点击蒙层是否关闭',
  },
  {
    name: 'safe-area-inset-bottom',
    type: 'Boolean',
    default: 'true',
    desc: '是否开启底部安全区适配',
  },
  {
    name: 'value-key',
    type: 'String',
    default: '"value"',
    desc: '选项值对应的键名',
  },
  {
    name: 'label-key',
    type: 'String',
    default: '"label"',
    desc: '选项文本对应的键名',
  },
  {
    name: 'z-index',
    type: 'Number',
    default: '100',
    desc: '弹出层层级',
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
    desc: '打开选择器弹窗',
  },
  {
    name: 'close()',
    desc: '关闭选择器弹窗',
  },
  {
    name: 'setLoading(loading)',
    desc: '设置加载状态，参数：loading(Boolean)',
  },
]

// Events 事件文档
const apiEvents = [
  {
    name: 'confirm',
    desc: '确认选择时触发，参数：{ value, selectedItems }',
  },
  {
    name: 'open',
    desc: '打开选择器时触发',
  },
  {
    name: 'cancel',
    desc: '取消选择时触发',
  },
  {
    name: 'clear',
    desc: '清空选择时触发',
  },
  {
    name: 'update:modelValue',
    desc: '选中值更新时触发',
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

/**
 * 多级联动处理函数
 */
const onCascadeChange: PickerViewColumnChange = (pickerView, value, columnIndex, resolve) => {
  const item = (value as Record<string, any>[])[columnIndex]
  if (columnIndex === 0) {
    // 第一列改变时，更新第二列和第三列数据
    pickerView.setColumnData(1, district[item.value])
    pickerView.setColumnData(2, district[district[item.value][0].value])
  } else if (columnIndex === 1) {
    // 第二列改变时，更新第三列数据
    pickerView.setColumnData(2, district[item.value])
  }
  resolve()
}

/**
 * 可清空级联处理函数
 */
const onCascadeClearChange: PickerViewColumnChange = (pickerView, value, columnIndex, resolve) => {
  const item = (value as Record<string, any>[])[columnIndex]
  if (columnIndex === 0) {
    pickerView.setColumnData(1, district[item.value])
    pickerView.setColumnData(2, district[district[item.value][0].value])
  } else if (columnIndex === 1) {
    pickerView.setColumnData(2, district[item.value])
  }
  resolve()
}

/**
 * 自定义显示格式函数
 */
const customDisplayFormat: PickerDisplayFormat = (items) => {
  return (items as ColumnItem[])
    .map((item) => {
      return item.label
    })
    .join(' → ')
}

/**
 * 确认前校验函数
 */
const handleBeforeConfirm: PickerBeforeConfirm = (value, resolve, picker) => {
  picker.setLoading(true)
  setTimeout(() => {
    picker.setLoading(false)
    if (['选项2', '选项3'].includes(value as string)) {
      resolve(false)
      toast.error('选项校验不通过，请重新选择')
    } else {
      resolve(true)
    }
  }, 2000)
}

/**
 * 默认插槽确认处理
 */
const handleSlotConfirm = ({ value }: any) => {
  slotValue.value = value as string
  console.log('插槽选择确认：', value)
}

/**
 * 默认插槽确认处理2
 */
const handleSlotConfirm2 = ({ value }: any) => {
  slotValue2.value = value as string
  console.log('自定义触发器选择确认：', value)
}

/**
 * 选择器打开事件
 */
const handleOpen = () => {
  addEventLog('选择器已打开', 'info')
  console.log('选择器打开')
}

/**
 * 事件监听确认处理
 */
const handleEventConfirm = ({ value, selectedItems }: { value: any; selectedItems: any }) => {
  addEventLog(`确认选择：${value}`, 'success')
  console.log('确认选择：', value, selectedItems)
}

/**
 * 取消选择事件
 */
const handleCancel = () => {
  addEventLog('取消选择', 'warning')
  console.log('取消选择')
}

/**
 * 清空选择事件
 */
const handleClear = () => {
  addEventLog('清空选择', 'info')
  console.log('清空选择')
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
