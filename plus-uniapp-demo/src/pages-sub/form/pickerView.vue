<!-- PickerView 选择器视图 http://127.0.0.1:100/#/pages-sub/demo/wd/picker-view -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="PickerView 选择器视图" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的选择器视图，支持字符串数组和对象数组">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="字符串数组" vertical>
          <view class="mb-2 text-sm text-gray-500">当前选中值：{{ value1 }}</view>
          <wd-picker-view v-model="value1" :columns="columns1" @change="handleBasicChange" />
        </wd-cell>

        <wd-cell title="对象数组" vertical>
          <view class="mb-2 text-sm text-gray-500">当前选中值：{{ value2 }}</view>
          <wd-picker-view v-model="value2" :columns="objectColumns" @change="handleObjectChange" />
        </wd-cell>
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 字符串数组" :code="codes.basic.stringTemplate" />
        <DemoCode title="模板 - 对象数组" :code="codes.basic.objectTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 禁用选项示例 -->
    <DemoSection title="禁用选项" desc="部分选项可以设置为禁用状态，无法被选中">
      <wd-cell-group>
        <wd-cell title="包含禁用项" vertical>
          <view class="mb-2 text-sm text-gray-500">当前选中值：{{ value3 }}，选项3被禁用</view>
          <wd-picker-view v-model="value3" :columns="disabledColumns" @change="handleDisabledChange" />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 禁用选项" :code="codes.disabled.template" />
        <DemoCode title="脚本 - 禁用选项" :code="codes.disabled.script" />
      </template>
    </DemoSection>

    <!-- 加载状态示例 -->
    <DemoSection title="加载状态" desc="显示加载遮罩，可以自定义加载颜色">
      <wd-cell-group>
        <wd-cell title="默认加载样式" vertical>
          <view class="mb-2 text-sm text-gray-500">当前选中值：{{ value4 }}</view>
          <wd-picker-view v-model="value4" :columns="columns1" loading />
        </wd-cell>

        <wd-cell title="自定义加载颜色" vertical>
          <view class="mb-2 text-sm text-gray-500">当前选中值：{{ value5 }}</view>
          <wd-picker-view
            v-model="value5"
            :columns="columns1"
            loading
            loading-color="#ff6b6b"
          />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 默认加载样式" :code="codes.loading.defaultTemplate" />
        <DemoCode title="模板 - 自定义加载颜色" :code="codes.loading.customTemplate" />
        <DemoCode title="脚本 - 加载状态" :code="codes.loading.script" />
      </template>
    </DemoSection>

    <!-- 立即触发变化示例 -->
    <DemoSection title="立即触发变化" desc="滚动时立即触发 change 事件，而不是等待滚动结束">
      <wd-cell-group>
        <wd-cell title="立即响应模式" vertical>
          <view class="mb-2 text-sm text-gray-500">
            当前选中值：{{ value6 }}，滚动时立即触发变化事件
          </view>
          <wd-picker-view
            v-model="value6"
            :immediate-change="true"
            :columns="disabledColumns"
            @change="handleImmediateChange"
          />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 立即触发变化" :code="codes.immediate.template" />
        <DemoCode title="脚本 - 立即触发变化" :code="codes.immediate.script" />
      </template>
    </DemoSection>

    <!-- 多列选择示例 -->
    <DemoSection title="多列选择" desc="支持多列数据同时选择，适用于日期、时间等场景">
      <wd-cell-group>
        <wd-cell title="学校专业选择" vertical>
          <view class="mb-2 text-sm text-gray-500">当前选中值：[{{ value7.join(', ') }}]</view>
          <wd-picker-view v-model="value7" :columns="multiColumns" @change="handleMultiChange" />
        </wd-cell>

        <wd-cell title="日期时间选择" vertical>
          <view class="mb-2 text-sm text-gray-500">当前选中值：[{{ value8.join(', ') }}]</view>
          <wd-picker-view v-model="value8" :columns="dateTimeColumns" @change="handleDateTimeChange" />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 学校专业选择" :code="codes.multi.schoolTemplate" />
        <DemoCode title="模板 - 日期时间选择" :code="codes.multi.dateTimeTemplate" />
        <DemoCode title="脚本 - 多列选择" :code="codes.multi.script" />
      </template>
    </DemoSection>

    <!-- 多级联动示例 -->
    <DemoSection title="多级联动" desc="列之间存在级联关系，选择上级会影响下级数据">
      <wd-cell-group>
        <wd-cell title="省市区三级联动" vertical>
          <view class="mb-2 text-sm text-gray-500">
            当前选中值：[{{ value9.join(', ') }}]，省市区三级联动
          </view>
          <wd-picker-view
            v-model="value9"
            :columns="cascadeColumns"
            :column-change="onChangeDistrict"
            @change="handleDistrictChange"
          />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 三级联动" :code="codes.cascade.template" />
        <DemoCode title="脚本 - 联动数据" :code="codes.cascade.dataScript" />
        <DemoCode title="脚本 - 联动处理" :code="codes.cascade.handlerScript" />
      </template>
    </DemoSection>

    <!-- 自定义样式示例 -->
    <DemoSection title="自定义样式" desc="自定义高度、颜色等样式属性">
      <wd-cell-group>
        <wd-cell title="自定义高度" vertical>
          <view class="mb-2 text-sm text-gray-500">当前选中值：{{ value10 }}，高度设置为 300px</view>
          <wd-picker-view
            v-model="value10"
            :columns="columns1"
            :columns-height="300"
            @change="handleCustomHeightChange"
          />
        </wd-cell>

        <wd-cell title="自定义样式" vertical>
          <view class="mb-2 text-sm text-gray-500">当前选中值：{{ value11 }}，自定义加载颜色</view>
          <wd-picker-view
            v-model="value11"
            :columns="columns1"
            :columns-height="250"
            loading-color="#9c27b0"
            custom-class="custom-picker"
          />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 自定义高度" :code="codes.custom.heightTemplate" />
        <DemoCode title="模板 - 自定义样式" :code="codes.custom.styleTemplate" />
        <DemoCode title="脚本 - 自定义样式" :code="codes.custom.script" />
      </template>
    </DemoSection>

    <!-- 实例方法控制示例 -->
    <DemoSection title="实例方法控制" desc="通过组件实例方法获取数据和控制组件行为">
      <!-- 控制示例区域 -->
      <view class="space-y-4">
        <!-- 可控制的选择器 -->
        <wd-cell title="可控制的选择器" vertical>
          <view class="mb-2 text-sm text-gray-500">当前选中值：[{{ value12.join(', ') }}]</view>
          <wd-picker-view
            ref="pickerViewRef"
            v-model="value12"
            :columns="controlColumns"
            @change="handleControlChange"
          />
        </wd-cell>

        <!-- 控制按钮组 -->
        <view class="px-4">
          <wd-grid clickable border>
            <wd-grid-item text="获取选中值" icon="info" @itemclick="getSelectedValues" />
            <wd-grid-item text="获取选中项" icon="list" @itemclick="getSelectedItems" />
            <wd-grid-item text="获取标签" icon="label" @itemclick="getSelectedLabels" />
          </wd-grid>
          <wd-grid clickable border class="mt-2">
            <wd-grid-item text="设置第二列数据" icon="edit" @itemclick="updateSecondColumn" />
            <wd-grid-item text="重置所有列" icon="refresh" @itemclick="resetAllColumns" />
            <wd-grid-item text="获取列数据" icon="view" @itemclick="getColumnData" />
          </wd-grid>
        </view>

        <!-- 状态显示 -->
        <view class="mx-4 rounded-lg bg-blue-50 px-4 py-2">
          <view class="text-xs text-blue-600 font-medium">💡 操作结果：{{ operationResult }}</view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 实例方法控制" :code="codes.control.template" />
        <DemoCode title="脚本 - 实例方法控制" :code="codes.control.script" />
      </template>
    </DemoSection>

    <!-- 实际应用场景 -->
    <DemoSection title="实际应用场景" desc="常见的业务场景示例">
      <!-- 应用场景展示 -->
      <view class="space-y-4">
        <!-- 生日选择器 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">生日选择器</view>
          <wd-cell title="选择生日" vertical>
            <view class="mb-2 text-sm text-gray-500">
              当前选择：{{ birthdayDisplay }}
            </view>
            <wd-picker-view
              v-model="birthdayValue"
              :columns="birthdayColumns"
              :column-change="onBirthdayChange"
              @change="handleBirthdayChange"
            />
          </wd-cell>
        </view>

        <!-- 时间选择器 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">时间选择器</view>
          <wd-cell title="选择时间" vertical>
            <view class="mb-2 text-sm text-gray-500">
              当前选择：{{ timeDisplay }}
            </view>
            <wd-picker-view
              v-model="timeValue"
              :columns="timeColumns"
              @change="handleTimeChange"
            />
          </wd-cell>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 生日选择器" :code="codes.scenarios.birthdayTemplate" />
        <DemoCode title="脚本 - 生日选择器" :code="codes.scenarios.birthdayScript" />
        <DemoCode title="模板 - 时间选择器" :code="codes.scenarios.timeTemplate" />
        <DemoCode title="脚本 - 时间选择器" :code="codes.scenarios.timeScript" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import type { PickerViewInstance, PickerViewColumnChange } from '@/wd/components/wd-picker-view/wd-picker-view.vue'
import { ref } from 'vue'
import { useToast } from '@/wd'

// ===== 工具函数初始化 =====
const toast = useToast()

// ===== 组件状态管理 =====

// 选择器组件实例引用
const pickerViewRef = ref<PickerViewInstance>()

// 操作结果显示
const operationResult = ref<string>('点击按钮查看操作结果')

// 基本用法状态
const value1 = ref<string>('选项1')
const value2 = ref<string>('option1')

// 禁用选项状态
const value3 = ref<string>('选项1')

// 加载状态
const value4 = ref<string>('选项1')
const value5 = ref<string>('选项1')

// 立即触发变化状态
const value6 = ref<string>('选项1')

// 多列选择状态
const value7 = ref<Array<string>>(['中南大学', '软件工程'])
const value8 = ref<Array<string>>(['2024', '12', '10', '14'])

// 多级联动状态
const value9 = ref<Array<string>>(['110000', '110100', '110102'])

// 自定义样式状态
const value10 = ref<string>('选项3')
const value11 = ref<string>('选项1')

// 实例方法控制状态
const value12 = ref<Array<string>>(['水果', '苹果'])

// 应用场景状态
const birthdayValue = ref<Array<string>>(['2000', '1', '1'])
const timeValue = ref<Array<string>>(['09', '30'])

// ===== 数据定义 =====

// 基本数据
const columns1 = ref<Array<string>>(['选项1', '选项2', '选项3', '选项4', '选项5', '选项6', '选项7'])

const objectColumns = ref([
  { label: '选项一', value: 'option1' },
  { label: '选项二', value: 'option2' },
  { label: '选项三', value: 'option3' },
  { label: '选项四', value: 'option4' },
  { label: '选项五', value: 'option5' },
])

// 禁用选项数据
const disabledColumns = ref([
  { label: '选项1', disabled: false },
  { label: '选项2', disabled: false },
  { label: '选项3', disabled: true },
  { label: '选项4', disabled: false },
  { label: '选项5', disabled: false },
  { label: '选项6', disabled: false },
  { label: '选项7', disabled: false },
])

// 多列选择数据
const multiColumns = ref([
  ['中山大学', '中南大学', '华南理工大学'],
  ['计算机科学与技术', '软件工程', '通信工程', '法学', '经济学'],
])

const dateTimeColumns = ref([
  Array.from({ length: 10 }, (_, i) => (2020 + i).toString()),
  Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')),
  Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0')),
  Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')),
])

// 实例控制数据
const controlColumns = ref([
  ['水果', '蔬菜', '肉类'],
  ['苹果', '香蕉', '橙子'],
])

// 应用场景数据
const birthdayColumns = ref([
  Array.from({ length: 50 }, (_, i) => (1980 + i).toString()),
  Array.from({ length: 12 }, (_, i) => (i + 1).toString()),
  Array.from({ length: 31 }, (_, i) => (i + 1).toString()),
])

const timeColumns = ref([
  Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')),
  Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')),
])

// 地区联动数据
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

const cascadeColumns = ref([
  district[0],
  district[district[0][0].value],
  district[district[district[0][0].value][0].value],
])

// ===== 计算属性 =====

// 生日显示
const birthdayDisplay = ref<string>('')
const timeDisplay = ref<string>('')

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    stringTemplate: `<wd-picker-view
  v-model="value1"
  :columns="columns1"
  @change="handleBasicChange"
/>`,

    objectTemplate: `<wd-picker-view
  v-model="value2"
  :columns="objectColumns"
  @change="handleObjectChange"
/>`,

    script: `import { ref } from 'vue'

// 字符串数组
const value1 = ref('选项1')
const columns1 = ref(['选项1', '选项2', '选项3', '选项4', '选项5', '选项6', '选项7'])

// 对象数组
const value2 = ref('option1')
const objectColumns = ref([
  { label: '选项一', value: 'option1' },
  { label: '选项二', value: 'option2' },
  { label: '选项三', value: 'option3' },
  { label: '选项四', value: 'option4' },
  { label: '选项五', value: 'option5' },
])

const handleBasicChange = ({ value, index }) => {
  console.log('基本选择变化:', { value, index })
}

const handleObjectChange = ({ value, index }) => {
  console.log('对象选择变化:', { value, index })
}`,
  },

  // 禁用选项代码
  disabled: {
    template: `<wd-picker-view
  v-model="value3"
  :columns="disabledColumns"
  @change="handleDisabledChange"
/>`,

    script: `const value3 = ref('选项1')
const disabledColumns = ref([
  { label: '选项1', disabled: false },
  { label: '选项2', disabled: false },
  { label: '选项3', disabled: true }, // 被禁用
  { label: '选项4', disabled: false },
  { label: '选项5', disabled: false },
  { label: '选项6', disabled: false },
  { label: '选项7', disabled: false },
])

const handleDisabledChange = ({ value, index }) => {
  console.log('禁用选项变化:', { value, index })
}`,
  },

  // 加载状态代码
  loading: {
    defaultTemplate: `<wd-picker-view
  v-model="value4"
  :columns="columns1"
  loading
/>`,

    customTemplate: `<wd-picker-view
  v-model="value5"
  :columns="columns1"
  loading
  loading-color="#ff6b6b"
/>`,

    script: `const value4 = ref('选项1')
const value5 = ref('选项1')`,
  },

  // 立即触发变化代码
  immediate: {
    template: `<wd-picker-view
  v-model="value6"
  :immediate-change="true"
  :columns="disabledColumns"
  @change="handleImmediateChange"
/>`,

    script: `const value6 = ref('选项1')

const handleImmediateChange = ({ value, index }) => {
  console.log('立即触发变化:', { value, index })
  toast.show(\`立即变化: \${value}\`)
}`,
  },

  // 多列选择代码
  multi: {
    schoolTemplate: `<wd-picker-view
  v-model="value7"
  :columns="multiColumns"
  @change="handleMultiChange"
/>`,

    dateTimeTemplate: `<wd-picker-view
  v-model="value8"
  :columns="dateTimeColumns"
  @change="handleDateTimeChange"
/>`,

    script: `// 学校专业选择
const value7 = ref(['中南大学', '软件工程'])
const multiColumns = ref([
  ['中山大学', '中南大学', '华南理工大学'],
  ['计算机科学与技术', '软件工程', '通信工程', '法学', '经济学'],
])

// 日期时间选择
const value8 = ref(['2024', '12', '10', '14'])
const dateTimeColumns = ref([
  Array.from({ length: 10 }, (_, i) => (2020 + i).toString()),
  Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')),
  Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0')),
  Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')),
])

const handleMultiChange = ({ value, index }) => {
  console.log('多列选择变化:', { value, index })
}

const handleDateTimeChange = ({ value, index }) => {
  console.log('日期时间变化:', { value, index })
}`,
  },

  // 多级联动代码
  cascade: {
    template: `<wd-picker-view
  v-model="value9"
  :columns="cascadeColumns"
  :column-change="onChangeDistrict"
  @change="handleDistrictChange"
/>`,

    dataScript: `// 地区联动数据结构
const district = {
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
  // ... 其他数据
}

const value9 = ref(['110000', '110100', '110102'])
const cascadeColumns = ref([
  district[0],
  district[district[0][0].value],
  district[district[district[0][0].value][0].value],
])`,

    handlerScript: `// 多级联动处理函数
const onChangeDistrict = (picker, value, columnIndex, resolve) => {
  console.log('地区联动变化:', { value, columnIndex })

  const item = value[columnIndex]

  if (columnIndex === 0) {
    // 第一列改变时，更新第二列和第三列数据
    picker.setColumnData(1, district[item.value])
    picker.setColumnData(2, district[district[item.value][0].value])
  } else if (columnIndex === 1) {
    // 第二列改变时，更新第三列数据
    picker.setColumnData(2, district[item.value])
  }

  resolve()
}

const handleDistrictChange = ({ value, index }) => {
  console.log('地区联动变化:', { value, index })

  // 根据选中值获取对应的地区名称
  const getDistrictNames = (codes) => {
    const names = []
    // 处理逻辑...
    return names
  }

  const names = getDistrictNames(value)
  toast.show(\`选择地区: \${names.join(' - ')}\`)
}`,
  },

  // 自定义样式代码
  custom: {
    heightTemplate: `<wd-picker-view
  v-model="value10"
  :columns="columns1"
  :columns-height="300"
  @change="handleCustomHeightChange"
/>`,

    styleTemplate: `<wd-picker-view
  v-model="value11"
  :columns="columns1"
  :columns-height="250"
  loading-color="#9c27b0"
  custom-class="custom-picker"
/>`,

    script: `const value10 = ref('选项3')
const value11 = ref('选项1')

const handleCustomHeightChange = ({ value, index }) => {
  console.log('自定义高度选择变化:', { value, index })
}`,
  },

  // 实例方法控制代码
  control: {
    template: `<template>
  <wd-picker-view
    ref="pickerViewRef"
    v-model="value12"
    :columns="controlColumns"
    @change="handleControlChange"
  />

  <!-- 控制按钮 -->
  <wd-grid clickable border>
    <wd-grid-item text="获取选中值" icon="info" @itemclick="getSelectedValues" />
    <wd-grid-item text="获取选中项" icon="list" @itemclick="getSelectedItems" />
    <wd-grid-item text="获取标签" icon="label" @itemclick="getSelectedLabels" />
  </wd-grid>
  <wd-grid clickable border class="mt-2">
    <wd-grid-item text="设置第二列数据" icon="edit" @itemclick="updateSecondColumn" />
    <wd-grid-item text="重置所有列" icon="refresh" @itemclick="resetAllColumns" />
    <wd-grid-item text="获取列数据" icon="view" @itemclick="getColumnData" />
  </wd-grid>
</template>`,

    script: `import type { PickerViewInstance } from '@/wd/components/wd-picker-view/wd-picker-view.vue'

const pickerViewRef = ref<PickerViewInstance>()
const value12 = ref(['水果', '苹果'])
const operationResult = ref('点击按钮查看操作结果')

const controlColumns = ref([
  ['水果', '蔬菜', '肉类'],
  ['苹果', '香蕉', '橙子'],
])

// 获取选中值
const getSelectedValues = () => {
  const values = pickerViewRef.value?.getValues()
  operationResult.value = \`选中值: \${JSON.stringify(values)}\`
}

// 获取选中项
const getSelectedItems = () => {
  const items = pickerViewRef.value?.getSelects()
  operationResult.value = \`选中项: \${JSON.stringify(items)}\`
}

// 获取标签
const getSelectedLabels = () => {
  const labels = pickerViewRef.value?.getLabels()
  operationResult.value = \`标签: [\${labels.join(', ')}]\`
}

// 设置第二列数据
const updateSecondColumn = () => {
  const newData = ['西瓜', '葡萄', '草莓', '芒果']
  pickerViewRef.value?.setColumnData(1, newData, 0)
  operationResult.value = '第二列数据已更新为水果类型'
}

// 重置所有列
const resetAllColumns = () => {
  const newColumns = [
    ['饮料', '小食', '主食'],
    ['可乐', '雪碧', '橙汁'],
  ]
  pickerViewRef.value?.resetColumns(newColumns)
  operationResult.value = '所有列数据已重置'
}

// 获取列数据
const getColumnData = () => {
  const columnData = pickerViewRef.value?.getColumnData(0)
  operationResult.value = \`第一列数据: \${JSON.stringify(columnData)}\`
}

const handleControlChange = ({ value, index }) => {
  console.log('控制示例变化:', { value, index })
  operationResult.value = \`选择变化: [\${value.join(', ')}]\`
}`,
  },

  // 应用场景代码
  scenarios: {
    birthdayTemplate: `<wd-picker-view
  v-model="birthdayValue"
  :columns="birthdayColumns"
  :column-change="onBirthdayChange"
  @change="handleBirthdayChange"
/>`,

    birthdayScript: `// 生日选择器
const birthdayValue = ref(['2000', '1', '1'])
const birthdayDisplay = ref('')

const birthdayColumns = ref([
  Array.from({ length: 50 }, (_, i) => (1980 + i).toString()),
  Array.from({ length: 12 }, (_, i) => (i + 1).toString()),
  Array.from({ length: 31 }, (_, i) => (i + 1).toString()),
])

// 生日联动处理（月份变化时更新天数）
const onBirthdayChange = (picker, value, columnIndex, resolve) => {
  if (columnIndex === 0 || columnIndex === 1) {
    const year = parseInt(value[0])
    const month = parseInt(value[1])
    const daysInMonth = new Date(year, month, 0).getDate()
    const days = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString())
    picker.setColumnData(2, days)
  }
  resolve()
}

const handleBirthdayChange = ({ value }) => {
  birthdayDisplay.value = \`\${value[0]}年\${value[1]}月\${value[2]}日\`
  console.log('生日选择:', birthdayDisplay.value)
}`,

    timeTemplate: `<wd-picker-view
  v-model="timeValue"
  :columns="timeColumns"
  @change="handleTimeChange"
/>`,

    timeScript: `// 时间选择器
const timeValue = ref(['09', '30'])
const timeDisplay = ref('')

const timeColumns = ref([
  Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')),
  Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')),
])

const handleTimeChange = ({ value }) => {
  timeDisplay.value = \`\${value[0]}:\${value[1]}\`
  console.log('时间选择:', timeDisplay.value)
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'model-value',
    type: 'PickerViewValue',
    default: '""',
    desc: '选中项，支持字符串、数字、布尔值或数组',
  },
  {
    name: 'columns',
    type: 'Array',
    default: '[]',
    desc: '选择器数据，可以为字符串数组，也可以为对象数组，如果为二维数组，则为多列选择器',
  },
  {
    name: 'loading',
    type: 'Boolean',
    default: 'false',
    desc: '加载状态',
  },
  {
    name: 'loading-color',
    type: 'String',
    default: '"#4D80F0"',
    desc: '加载的颜色，只能使用十六进制的色值写法，且不能使用缩写',
  },
  {
    name: 'columns-height',
    type: 'Number',
    default: '217',
    desc: 'picker内部滚筒高度',
  },
  {
    name: 'value-key',
    type: 'String',
    default: '"value"',
    desc: '选项对象中，value对应的 key',
  },
  {
    name: 'label-key',
    type: 'String',
    default: '"label"',
    desc: '选项对象中，展示的文本对应的 key',
  },
  {
    name: 'immediate-change',
    type: 'Boolean',
    default: 'false',
    desc: '是否在手指松开时立即触发picker-view的 change 事件',
  },
  {
    name: 'column-change',
    type: 'Function',
    default: '—',
    desc: '接收 pickerView 实例、选中项、当前修改列的下标、resolve 作为入参的回调函数',
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
    name: 'getSelects()',
    desc: '获取所有列选中项，返回值为一个对象或对象数组',
  },
  {
    name: 'getValues()',
    desc: '获取所有列的选中值',
  },
  {
    name: 'setColumnData(columnIndex, data, rowIndex?)',
    desc: '设置列数据，columnIndex: 列下标，data: 列数据，rowIndex: 行下标（可选）',
  },
  {
    name: 'getColumnsData()',
    desc: '获取所有列数据的深拷贝',
  },
  {
    name: 'getColumnData(columnIndex)',
    desc: '获取某一列的选项，columnIndex: 列的下标',
  },
  {
    name: 'getColumnIndex(columnIndex)',
    desc: '获取某一列的选中项下标，columnIndex: 列的下标',
  },
  {
    name: 'getLabels()',
    desc: '获取所有列选中项的label，返回值为一个数组',
  },
  {
    name: 'getSelectedIndex()',
    desc: '获取选中索引数组',
  },
  {
    name: 'resetColumns(columns)',
    desc: '重置列数据为指定列数据，columns: 新的列数据',
  },
]

// Events 事件文档
const apiEvents = [
  {
    name: 'change',
    desc: '选中项变化时触发，参数为 { picker, value, index }',
  },
  {
    name: 'pickstart',
    desc: '开始滚动时触发',
  },
  {
    name: 'pickend',
    desc: '结束滚动时触发',
  },
]

// ===== 联动处理方法 =====

/**
 * 多级联动处理函数
 */
const onChangeDistrict: PickerViewColumnChange = (picker, value, columnIndex, resolve) => {
  console.log('地区联动变化:', { value, columnIndex })

  const item = (value as Record<string, any>[])[columnIndex]

  if (columnIndex === 0) {
    // 第一列改变时，更新第二列和第三列数据
    picker.setColumnData(1, district[item.value])
    picker.setColumnData(2, district[district[item.value][0].value])
  } else if (columnIndex === 1) {
    // 第二列改变时，更新第三列数据
    picker.setColumnData(2, district[item.value])
  }

  resolve()
}

/**
 * 生日联动处理函数
 */
const onBirthdayChange: PickerViewColumnChange = (picker, value, columnIndex, resolve) => {
  if (columnIndex === 0 || columnIndex === 1) {
    const valueArray = value as Array<string>
    const year = Number.parseInt(valueArray[0])
    const month = Number.parseInt(valueArray[1])
    const daysInMonth = new Date(year, month, 0).getDate()
    const days = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString())
    picker.setColumnData(2, days)
  }
  resolve()
}

// ===== 事件处理方法 =====

/**
 * 基本用法选择事件
 */
const handleBasicChange = ({ value, index }: { value: any; index: number }) => {
  console.log(`基本选择变化：${value}（索引：${index}）`)
}

/**
 * 对象数组选择事件
 */
const handleObjectChange = ({ value, index }: { value: any; index: number }) => {
  console.log(`对象选择变化：${value}（索引：${index}）`)
}

/**
 * 禁用选项选择事件
 */
const handleDisabledChange = ({ value, index }: { value: any; index: number }) => {
  console.log(`禁用选项变化：${value}（索引：${index}）`)
}

/**
 * 立即触发变化事件
 */
const handleImmediateChange = ({ value, index }: { value: any; index: number }) => {
  console.log('立即触发变化:', { value, index })
  toast.show(`立即变化: ${value}`)
}

/**
 * 多列选择事件
 */
const handleMultiChange = ({ value, index }: { value: any; index: number }) => {
  console.log('多列选择变化:', { value, index })
  toast.show(`多列选择: [${value.join(', ')}]`)
}

/**
 * 日期时间选择事件
 */
const handleDateTimeChange = ({ value, index }: { value: any; index: number }) => {
  console.log('日期时间变化:', { value, index })
  const dateTimeStr = `${value[0]}-${value[1]}-${value[2]} ${value[3]}:00`
  toast.show(`选择时间: ${dateTimeStr}`)
}

/**
 * 地区联动选择事件
 */
const handleDistrictChange = ({ value, index }: { value: any; index: number }) => {
  console.log('地区联动变化:', { value, index })

  // 根据选中值获取对应的地区名称
  const getDistrictNames = (codes: string[]) => {
    const names: string[] = []

    if (codes[0]) {
      const province = district[0].find((item) => item.value === codes[0])
      if (province) names.push(province.label)

      if (codes[1] && district[codes[0]]) {
        const city = district[codes[0]].find((item) => item.value === codes[1])
        if (city) names.push(city.label)

        if (codes[2] && district[codes[1]]) {
          const area = district[codes[1]].find((item) => item.value === codes[2])
          if (area) names.push(area.label)
        }
      }
    }

    return names
  }

  const names = getDistrictNames(value)
  toast.show(`选择地区: ${names.join(' - ')}`)
}

/**
 * 自定义高度选择事件
 */
const handleCustomHeightChange = ({ value, index }: { value: any; index: number }) => {
  console.log(`自定义高度选择变化：${value}（索引：${index}）`)
}

/**
 * 控制示例选择事件
 */
const handleControlChange = ({ value, index }: { value: any; index: number }) => {
  console.log('控制示例变化:', { value, index })
  operationResult.value = `选择变化: [${value.join(', ')}]`
}

/**
 * 生日选择事件
 */
const handleBirthdayChange = ({ value }: { value: any }) => {
  birthdayDisplay.value = `${value[0]}年${value[1]}月${value[2]}日`
  console.log('生日选择:', birthdayDisplay.value)
}

/**
 * 时间选择事件
 */
const handleTimeChange = ({ value }: { value: any }) => {
  timeDisplay.value = `${value[0]}:${value[1]}`
  console.log('时间选择:', timeDisplay.value)
}

// ===== 实例方法控制 =====

/**
 * 获取选中值
 */
const getSelectedValues = () => {
  const values = pickerViewRef.value?.getValues()
  operationResult.value = `选中值: ${JSON.stringify(values)}`
  console.log('获取选中值:', values)
}

/**
 * 获取选中项
 */
const getSelectedItems = () => {
  const items = pickerViewRef.value?.getSelects()
  operationResult.value = `选中项: ${JSON.stringify(items)}`
  console.log('获取选中项:', items)
}

/**
 * 获取选中标签
 */
const getSelectedLabels = () => {
  const labels = pickerViewRef.value?.getLabels()
  operationResult.value = `标签: [${labels?.join(', ')}]`
  console.log('获取标签:', labels)
}

/**
 * 设置第二列数据
 */
const updateSecondColumn = () => {
  const newData = ['西瓜', '葡萄', '草莓', '芒果']
  pickerViewRef.value?.setColumnData(1, newData, 0)
  operationResult.value = '第二列数据已更新为水果类型'
  console.log('第二列数据已更新')
}

/**
 * 重置所有列
 */
const resetAllColumns = () => {
  const newColumns = [
    ['饮料', '小食', '主食'],
    ['可乐', '雪碧', '橙汁'],
  ]
  pickerViewRef.value?.resetColumns(newColumns)
  operationResult.value = '所有列数据已重置'
  console.log('所有列数据已重置')
}

/**
 * 获取列数据
 */
const getColumnData = () => {
  const columnData = pickerViewRef.value?.getColumnData(0)
  operationResult.value = `第一列数据: ${JSON.stringify(columnData)}`
  console.log('第一列数据:', columnData)
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
// 自定义选择器样式
:deep(.custom-picker) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
}
</style>
