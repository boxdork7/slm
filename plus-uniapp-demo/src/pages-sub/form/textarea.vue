<!-- Textarea 文本域 http://127.0.0.1:100/#/pages-sub/demo/wd/textarea -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Textarea 文本域" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的文本域输入方式">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="基本文本域" vertical>
          <wd-textarea v-model="basicValue" placeholder="请填写评价" />
        </wd-cell>
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基本用法" :code="codes.basic.template" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 状态控制示例 -->
    <DemoSection title="状态控制" desc="只读、禁用等不同状态">
      <wd-cell-group>
        <wd-cell title="只读状态" vertical>
          <wd-textarea v-model="readonlyValue" readonly clearable />
        </wd-cell>

        <wd-cell title="禁用状态" vertical>
          <wd-textarea v-model="disabledValue" disabled clearable />
        </wd-cell>

        <wd-cell title="错误状态" vertical>
          <wd-textarea v-model="errorValue" error placeholder="输入有误的内容" />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 只读状态" :code="codes.status.readonlyTemplate" />
        <DemoCode title="模板 - 禁用状态" :code="codes.status.disabledTemplate" />
        <DemoCode title="模板 - 错误状态" :code="codes.status.errorTemplate" />
        <DemoCode title="脚本 - 状态控制" :code="codes.status.script" />
      </template>
    </DemoSection>

    <!-- 功能配置示例 -->
    <DemoSection title="功能配置" desc="清空按钮、字数限制等功能">
      <wd-cell-group>
        <wd-cell title="清空按钮和字数限制" vertical>
          <wd-textarea v-model="limitValue" :maxlength="120" clearable show-word-limit />
        </wd-cell>

        <wd-cell title="聚焦时显示清空按钮" vertical>
          <wd-textarea
            v-model="focusClearValue"
            clear-trigger="focus"
            :maxlength="120"
            clearable
            show-word-limit
            placeholder="聚焦后才显示清空按钮"
          />
        </wd-cell>

        <wd-cell title="清空时不自动聚焦" vertical>
          <wd-textarea
            v-model="nofocusValue"
            :focus-when-clear="false"
            :maxlength="120"
            clearable
            show-word-limit
            placeholder="点击清空后不会自动聚焦"
          />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 清空和字数限制" :code="codes.function.limitTemplate" />
        <DemoCode title="模板 - 聚焦时清空" :code="codes.function.focusClearTemplate" />
        <DemoCode title="模板 - 清空不聚焦" :code="codes.function.nofocusTemplate" />
        <DemoCode title="脚本 - 功能配置" :code="codes.function.script" />
      </template>
    </DemoSection>

    <!-- 尺寸配置示例 -->
    <DemoSection title="尺寸配置" desc="不同大小和高度自适应">
      <wd-cell-group>
        <wd-cell title="默认尺寸" vertical>
          <wd-textarea v-model="normalValue" :maxlength="120" clearable show-word-limit />
        </wd-cell>

        <wd-cell title="大尺寸" vertical>
          <wd-textarea
            v-model="largeValue"
            size="large"
            :maxlength="120"
            clearable
            show-word-limit
          />
        </wd-cell>
      </wd-cell-group>

      <!-- 高度自适应 -->
      <view class="mx-4 mt-4 rounded-xl bg-white p-4">
        <view class="mb-4 text-base text-gray-900 font-500">高度自适应</view>
        <wd-textarea
          v-model="autoHeightValue"
          clearable
          auto-height
          placeholder="输入内容后高度会自动调整"
        />
      </view>

      <template #codes>
        <DemoCode title="模板 - 默认尺寸" :code="codes.size.normalTemplate" />
        <DemoCode title="模板 - 大尺寸" :code="codes.size.largeTemplate" />
        <DemoCode title="模板 - 高度自适应" :code="codes.size.autoHeightTemplate" />
        <DemoCode title="脚本 - 尺寸配置" :code="codes.size.script" />
      </template>
    </DemoSection>

    <!-- Cell 类型示例 -->
    <DemoSection title="Cell 类型" desc="在单元格中使用文本域">
      <wd-cell-group border>
        <wd-textarea
          v-model="cellValue1"
          label="高度自适应"
          auto-height
          clearable
          placeholder="请输入"
          prefix-icon="location"
        />
        <wd-textarea
          v-model="cellValue2"
          label="清空按钮"
          clearable
          placeholder="请输入"
          required
        />
        <wd-textarea
          v-model="cellValue3"
          label="字数限制"
          :maxlength="240"
          clearable
          show-word-limit
          placeholder="请输入"
          required
        />
        <wd-textarea
          v-model="cellValue4"
          label="只读"
          readonly
          clearable
          :maxlength="240"
          show-word-limit
          placeholder="请输入"
          required
        />
        <wd-textarea
          v-model="cellValue5"
          label="禁用"
          disabled
          clearable
          :maxlength="240"
          show-word-limit
          placeholder="请输入"
          required
        />
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - Cell 类型" :code="codes.cell.template" />
        <DemoCode title="脚本 - Cell 类型" :code="codes.cell.script" />
      </template>
    </DemoSection>

    <!-- 大尺寸 Cell 示例 -->
    <DemoSection title="大尺寸 Cell" desc="在单元格中使用大尺寸文本域">
      <wd-cell-group border>
        <wd-textarea
          v-model="largeCellValue1"
          label="高度自适应"
          auto-height
          size="large"
          clearable
          placeholder="请输入"
          required
        />
        <wd-textarea
          v-model="largeCellValue2"
          label="字数限制"
          size="large"
          :maxlength="240"
          clearable
          show-word-limit
          placeholder="请输入"
          required
        />
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 大尺寸 Cell" :code="codes.largeCell.template" />
        <DemoCode title="脚本 - 大尺寸 Cell" :code="codes.largeCell.script" />
      </template>
    </DemoSection>

    <!-- 事件处理示例 -->
    <DemoSection title="事件处理" desc="文本域的各种事件监听">
      <!-- 状态显示区域 -->
      <view class="space-y-4">
        <wd-cell-group>
          <wd-cell title="事件监听文本域" vertical>
            <wd-textarea
              v-model="eventValue"
              :maxlength="100"
              clearable
              show-word-limit
              placeholder="输入内容查看事件触发"
              prefix-icon="edit"
              @input="handleInput"
              @focus="handleFocus"
              @blur="handleBlur"
              @clear="handleClear"
              @confirm="handleConfirm"
              @clickprefixicon="handleClickPrefixIcon"
            />
          </wd-cell>
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
        <DemoCode title="模板 - 事件处理" :code="codes.event.template" />
        <DemoCode title="脚本 - 事件处理" :code="codes.event.script" />
      </template>
    </DemoSection>

    <!-- 表单验证示例 -->
    <DemoSection title="表单验证" desc="结合表单使用的验证功能">
      <wd-form ref="formRef" :model="formData" :rules="formRules">
        <wd-cell-group border>
          <wd-textarea
            v-model="formData.content"
            label="必填内容"
            prop="content"
            :maxlength="200"
            clearable
            show-word-limit
            placeholder="请输入内容"
            required
          />
          <wd-textarea
            v-model="formData.description"
            label="描述信息"
            prop="description"
            :maxlength="500"
            auto-height
            clearable
            show-word-limit
            placeholder="请输入描述"
          />
        </wd-cell-group>

        <!-- 表单操作按钮 -->
        <view class="mx-4 mt-4 space-y-3">
          <wd-button block type="primary" @click="validateForm">验证表单</wd-button>
          <wd-button block @click="resetForm">重置表单</wd-button>
        </view>
      </wd-form>

      <template #codes>
        <DemoCode title="模板 - 表单验证" :code="codes.form.template" />
        <DemoCode title="脚本 - 表单验证" :code="codes.form.script" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import type { FormRules } from '@/wd/components/wd-form/wd-form.vue'

// ===== 组件状态管理 =====

// 基本用法
const basicValue = ref<string>('')

// 状态控制
const readonlyValue = ref<string>('只读状态的文本域内容')
const disabledValue = ref<string>('禁用状态的文本域内容')
const errorValue = ref<string>('错误状态的文本域内容')

// 功能配置
const limitValue = ref<string>('支持清空和字数限制的文本域')
const focusClearValue = ref<string>('')
const nofocusValue = ref<string>('')

// 尺寸配置
const normalValue = ref<string>('')
const largeValue = ref<string>('')
const autoHeightValue = ref<string>('输入文字后输入框高度跟随字数多少变化')

// Cell 类型
const cellValue1 = ref<string>('')
const cellValue2 = ref<string>('')
const cellValue3 = ref<string>('')
const cellValue4 = ref<string>('只读内容')
const cellValue5 = ref<string>('禁用内容')

// 大尺寸 Cell
const largeCellValue1 = ref<string>('')
const largeCellValue2 = ref<string>('')

// 事件处理
const eventValue = ref<string>('')

// 表单验证
const formRef = ref()
const formData = ref({
  content: '',
  description: '',
})

const formRules = ref<FormRules>({
  content: [
    { required: true, message: '请输入内容' },
    { min: 10, message: '内容不能少于10个字符' },
  ],
  description: [{ max: 500, message: '描述不能超过500个字符' }],
})

// 事件日志记录
interface EventLog {
  time: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

const eventLogs = ref<EventLog[]>([])

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    template: `<wd-textarea v-model="basicValue" placeholder="请填写评价" />`,

    script: `import { ref } from 'vue'

const basicValue = ref('')`,
  },

  // 状态控制代码
  status: {
    readonlyTemplate: `<wd-textarea v-model="readonlyValue" readonly clearable />`,

    disabledTemplate: `<wd-textarea v-model="disabledValue" disabled clearable />`,

    errorTemplate: `<wd-textarea v-model="errorValue" error placeholder="输入有误的内容" />`,

    script: `// 状态控制示例数据
const readonlyValue = ref('只读状态的文本域内容')
const disabledValue = ref('禁用状态的文本域内容')
const errorValue = ref('错误状态的文本域内容')`,
  },

  // 功能配置代码
  function: {
    limitTemplate: `<wd-textarea
  v-model="limitValue"
  :maxlength="120"
  clearable
  show-word-limit
/>`,

    focusClearTemplate: `<wd-textarea
  v-model="focusClearValue"
  clear-trigger="focus"
  :maxlength="120"
  clearable
  show-word-limit
  placeholder="聚焦后才显示清空按钮"
/>`,

    nofocusTemplate: `<wd-textarea
  v-model="nofocusValue"
  :focus-when-clear="false"
  :maxlength="120"
  clearable
  show-word-limit
  placeholder="点击清空后不会自动聚焦"
/>`,

    script: `// 功能配置示例数据
const limitValue = ref('支持清空和字数限制的文本域')
const focusClearValue = ref('')
const nofocusValue = ref('')`,
  },

  // 尺寸配置代码
  size: {
    normalTemplate: `<wd-textarea
  v-model="normalValue"
  :maxlength="120"
  clearable
  show-word-limit
/>`,

    largeTemplate: `<wd-textarea
  v-model="largeValue"
  size="large"
  :maxlength="120"
  clearable
  show-word-limit
/>`,

    autoHeightTemplate: `<wd-textarea
  v-model="autoHeightValue"
  clearable
  auto-height
  placeholder="输入内容后高度会自动调整"
/>`,

    script: `// 尺寸配置示例数据
const normalValue = ref('')
const largeValue = ref('')
const autoHeightValue = ref('输入文字后输入框高度跟随字数多少变化')`,
  },

  // Cell 类型代码
  cell: {
    template: `<wd-cell-group border>
  <wd-textarea
    v-model="cellValue1"
    label="高度自适应"
    auto-height
    clearable
    placeholder="请输入"
    prefix-icon="location"
  />
  <wd-textarea
    v-model="cellValue2"
    label="清空按钮"
    clearable
    placeholder="请输入"
    required
  />
  <wd-textarea
    v-model="cellValue3"
    label="字数限制"
    :maxlength="240"
    clearable
    show-word-limit
    placeholder="请输入"
    required
  />
  <wd-textarea
    v-model="cellValue4"
    label="只读"
    readonly
    clearable
    placeholder="请输入"
    required
  />
  <wd-textarea
    v-model="cellValue5"
    label="禁用"
    disabled
    clearable
    placeholder="请输入"
    required
  />
</wd-cell-group>`,

    script: `// Cell 类型示例数据
const cellValue1 = ref('')
const cellValue2 = ref('')
const cellValue3 = ref('')
const cellValue4 = ref('只读内容')
const cellValue5 = ref('禁用内容')`,
  },

  // 大尺寸 Cell 代码
  largeCell: {
    template: `<wd-cell-group border>
  <wd-textarea
    v-model="largeCellValue1"
    label="高度自适应"
    auto-height
    size="large"
    clearable
    placeholder="请输入"
    required
  />
  <wd-textarea
    v-model="largeCellValue2"
    label="字数限制"
    size="large"
    :maxlength="240"
    clearable
    show-word-limit
    placeholder="请输入"
    required
  />
</wd-cell-group>`,

    script: `// 大尺寸 Cell 示例数据
const largeCellValue1 = ref('')
const largeCellValue2 = ref('')`,
  },

  // 事件处理代码
  event: {
    template: `<template>
  <wd-textarea
    v-model="eventValue"
    :maxlength="100"
    clearable
    show-word-limit
    placeholder="输入内容查看事件触发"
    prefix-icon="edit"
    @input="handleInput"
    @focus="handleFocus"
    @blur="handleBlur"
    @clear="handleClear"
    @confirm="handleConfirm"
    @clickprefixicon="handleClickPrefixIcon"
  />
</template>`,

    script: `import { ref } from 'vue'

// 事件日志记录
interface EventLog {
  time: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

const eventLogs = ref<EventLog[]>([])
const eventValue = ref('')

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
 * 处理输入事件
 */
const handleInput = (detail: any) => {
  addEventLog(\`输入内容：\${detail.value}\`, 'info')
}

/**
 * 处理获得焦点事件
 */
const handleFocus = (detail: any) => {
  addEventLog('文本域获得焦点', 'success')
}

/**
 * 处理失去焦点事件
 */
const handleBlur = (detail: any) => {
  addEventLog(\`文本域失去焦点，光标位置：\${detail.cursor || '未知'}\`, 'warning')
}

/**
 * 处理清空事件
 */
const handleClear = () => {
  addEventLog('点击了清空按钮', 'warning')
}

/**
 * 处理确认事件
 */
const handleConfirm = (detail: any) => {
  addEventLog('点击了确认按钮', 'success')
}

/**
 * 处理前置图标点击事件
 */
const handleClickPrefixIcon = () => {
  addEventLog('点击了前置图标', 'info')
}`,
  },

  // 表单验证代码
  form: {
    template: `<template>
  <wd-form ref="formRef" :model="formData" :rules="formRules">
    <wd-cell-group border>
      <wd-textarea
        v-model="formData.content"
        label="必填内容"
        prop="content"
        :maxlength="200"
        clearable
        show-word-limit
        placeholder="请输入内容"
        required
      />
      <wd-textarea
        v-model="formData.description"
        label="描述信息"
        prop="description"
        :maxlength="500"
        auto-height
        clearable
        show-word-limit
        placeholder="请输入描述"
      />
    </wd-cell-group>

    <!-- 表单操作按钮 -->
    <view class="mx-4 mt-4 space-y-3">
      <wd-button @click="validateForm" block type="primary">验证表单</wd-button>
      <wd-button @click="resetForm" block>重置表单</wd-button>
    </view>
  </wd-form>
</template>`,

    script: `import { ref } from 'vue'

// 表单验证
const formRef = ref()
const formData = ref({
  content: '',
  description: ''
})

const formRules = ref({
  content: [
    { required: true, message: '请输入内容' },
    { min: 10, message: '内容不能少于10个字符' }
  ],
  description: [
    { max: 500, message: '描述不能超过500个字符' }
  ]
})

/**
 * 验证表单
 */
const validateForm = async () => {
  try {
    await formRef.value.validate()
    uni.showToast({ title: '验证通过', icon: 'success' })
  } catch (error) {
    uni.showToast({ title: '验证失败', icon: 'error' })
  }
}

/**
 * 重置表单
 */
const resetForm = () => {
  formRef.value.reset()
  uni.showToast({ title: '表单已重置', icon: 'success' })
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'model-value',
    type: 'String | Number',
    default: '""',
    desc: '绑定值',
  },
  {
    name: 'placeholder',
    type: 'String',
    default: '""',
    desc: '占位文本',
  },
  {
    name: 'placeholder-style',
    type: 'String',
    default: '""',
    desc: '指定placeholder的样式',
  },
  {
    name: 'placeholder-class',
    type: 'String',
    default: '""',
    desc: '指定placeholder的样式类',
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: '禁用输入框',
  },
  {
    name: 'maxlength',
    type: 'Number',
    default: '-1',
    desc: '最大输入长度，-1表示不限制',
  },
  {
    name: 'auto-focus',
    type: 'Boolean',
    default: 'false',
    desc: '自动聚焦并拉起键盘',
  },
  {
    name: 'focus',
    type: 'Boolean',
    default: 'false',
    desc: '获取焦点',
  },
  {
    name: 'auto-height',
    type: 'Boolean',
    default: 'false',
    desc: '是否自动增高输入框高度',
  },
  {
    name: 'fixed',
    type: 'Boolean',
    default: 'false',
    desc: 'textarea处于position:fixed区域时设置为true',
  },
  {
    name: 'cursor-spacing',
    type: 'Number',
    default: '0',
    desc: '指定光标与键盘的距离',
  },
  {
    name: 'cursor',
    type: 'Number',
    default: '-1',
    desc: '指定focus时的光标位置',
  },
  {
    name: 'confirm-type',
    type: 'String',
    default: '"done"',
    desc: '设置键盘右下角按钮的文字：send / search / next / go / done',
  },
  {
    name: 'confirm-hold',
    type: 'Boolean',
    default: 'false',
    desc: '点击键盘右下角按钮时是否保持键盘不收起',
  },
  {
    name: 'show-confirm-bar',
    type: 'Boolean',
    default: 'true',
    desc: '是否显示键盘上方带有"完成"按钮那一栏',
  },
  {
    name: 'selection-start',
    type: 'Number',
    default: '-1',
    desc: '光标起始位置，需与selectionEnd搭配使用',
  },
  {
    name: 'selection-end',
    type: 'Number',
    default: '-1',
    desc: '光标结束位置，需与selectionStart搭配使用',
  },
  {
    name: 'adjust-position',
    type: 'Boolean',
    default: 'true',
    desc: '键盘弹起时是否自动上推页面',
  },
  {
    name: 'readonly',
    type: 'Boolean',
    default: 'false',
    desc: '输入框只读状态',
  },
  {
    name: 'clearable',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示清空按钮',
  },
  {
    name: 'show-word-limit',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示字数限制，需要同时设置maxlength',
  },
  {
    name: 'label',
    type: 'String',
    default: '""',
    desc: '设置左侧标题',
  },
  {
    name: 'label-width',
    type: 'String',
    default: '""',
    desc: '设置左侧标题宽度',
  },
  {
    name: 'size',
    type: 'String',
    default: '""',
    desc: '设置输入框大小：large',
  },
  {
    name: 'prefix-icon',
    type: 'String',
    default: '""',
    desc: '前置图标',
  },
  {
    name: 'error',
    type: 'Boolean',
    default: 'false',
    desc: '设置输入框错误状态',
  },
  {
    name: 'center',
    type: 'Boolean',
    default: 'false',
    desc: '当存在label属性时，设置标题和输入框垂直居中',
  },
  {
    name: 'no-border',
    type: 'Boolean',
    default: 'false',
    desc: '非cell类型下是否隐藏下划线',
  },
  {
    name: 'required',
    type: 'Boolean',
    default: 'false',
    desc: 'cell类型下必填样式',
  },
  {
    name: 'prop',
    type: 'String',
    default: '""',
    desc: '表单域model字段名',
  },
  {
    name: 'rules',
    type: 'Array',
    default: '[]',
    desc: '表单验证规则',
  },
  {
    name: 'clear-trigger',
    type: 'String',
    default: '"always"',
    desc: '显示清除图标的时机：always / focus',
  },
  {
    name: 'focus-when-clear',
    type: 'Boolean',
    default: 'true',
    desc: '是否在点击清除按钮时聚焦输入框',
  },
  {
    name: 'ignore-composition-event',
    type: 'Boolean',
    default: 'true',
    desc: '是否忽略组件内对文本合成系统事件的处理',
  },
  {
    name: 'inputmode',
    type: 'String',
    default: '"text"',
    desc: '输入模式：text / tel / email / numeric / decimal / search / password',
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

// Methods 方法文档（Textarea 组件没有暴露方法）
const apiMethods: any[] = []

// Events 事件文档
const apiEvents = [
  {
    name: 'input',
    desc: '输入时触发，参数为输入详情',
  },
  {
    name: 'focus',
    desc: '获得焦点时触发，参数为焦点详情',
  },
  {
    name: 'blur',
    desc: '失去焦点时触发，参数为 { value, cursor }',
  },
  {
    name: 'clear',
    desc: '点击清空按钮时触发',
  },
  {
    name: 'confirm',
    desc: '点击确认按钮时触发，参数为确认详情',
  },
  {
    name: 'linechange',
    desc: '行数变化时触发，参数为行数详情',
  },
  {
    name: 'keyboardheightchange',
    desc: '键盘高度变化时触发，参数为键盘高度详情',
  },
  {
    name: 'clickprefixicon',
    desc: '点击前置图标时触发',
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
 * 处理输入事件
 */
const handleInput = (detail: any) => {
  addEventLog(`输入内容：${detail.value}`, 'info')
  console.log('输入事件', detail)
}

/**
 * 处理获得焦点事件
 */
const handleFocus = (detail: any) => {
  addEventLog('文本域获得焦点', 'success')
  console.log('获得焦点', detail)
}

/**
 * 处理失去焦点事件
 */
const handleBlur = (detail: any) => {
  addEventLog(`文本域失去焦点，光标位置：${detail.cursor || '未知'}`, 'warning')
  console.log('失去焦点', detail)
}

/**
 * 处理清空事件
 */
const handleClear = () => {
  addEventLog('点击了清空按钮', 'warning')
  console.log('清空按钮被点击')
}

/**
 * 处理确认事件
 */
const handleConfirm = (detail: any) => {
  addEventLog('点击了确认按钮', 'success')
  console.log('确认按钮被点击', detail)
}

/**
 * 处理前置图标点击事件
 */
const handleClickPrefixIcon = () => {
  addEventLog('点击了前置图标', 'info')
  console.log('前置图标被点击')
}

// ===== 表单操作方法 =====

/**
 * 验证表单
 */
const validateForm = async () => {
  try {
    await formRef.value.validate()
    uni.showToast({ title: '验证通过', icon: 'success' })
    addEventLog('表单验证通过', 'success')
  } catch (error) {
    uni.showToast({ title: '验证失败', icon: 'error' })
    addEventLog('表单验证失败', 'error')
    console.error('表单验证失败', error)
  }
}

/**
 * 重置表单
 */
const resetForm = () => {
  formRef.value.reset()
  uni.showToast({ title: '表单已重置', icon: 'success' })
  addEventLog('表单已重置', 'info')
}

const { resetScrollTop, updateScrollTop } = useScroll()

onShow(() => {
  resetScrollTop() // 页面显示时重置，避免页面切换时状态错误
})

onPageScroll((e) => {
  updateScrollTop(e.scrollTop)
})
</script>
