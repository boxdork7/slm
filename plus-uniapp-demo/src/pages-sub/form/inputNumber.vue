<!-- InputNumber 数字输入框 http://127.0.0.1:100/#/pages-sub/demo/wd/input-number -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="InputNumber 数字输入框" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最基础的数字输入框功能，支持加减操作和数值输入">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="默认数字输入框">
          <wd-input-number
            v-model="basicValue"
            @change="handleBasicChange"
          />
        </wd-cell>

        <wd-cell title="设置步长">
          <wd-input-number
            v-model="stepValue"
            :step="2"
            @change="handleStepChange"
          />
        </wd-cell>

        <wd-cell title="限制最大最小值">
          <wd-input-number
            v-model="rangeValue"
            :min="3"
            :max="10"
            @change="handleRangeChange"
          />
        </wd-cell>
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 默认数字输入框" :code="codes.basic.defaultTemplate" />
        <DemoCode title="模板 - 设置步长" :code="codes.basic.stepTemplate" />
        <DemoCode title="模板 - 限制范围" :code="codes.basic.rangeTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 组件状态示例 -->
    <DemoSection title="组件状态" desc="不同状态下的数字输入框展示效果">
      <wd-cell-group>
        <wd-cell title="禁用状态">
          <wd-input-number
            v-model="disabledValue"
            disabled
          />
        </wd-cell>

        <wd-cell title="禁用输入框">
          <wd-input-number
            v-model="disableInputValue"
            disable-input
          />
        </wd-cell>

        <wd-cell title="禁用减号按钮">
          <wd-input-number
            v-model="disableMinusValue"
            disable-minus
          />
        </wd-cell>

        <wd-cell title="禁用加号按钮">
          <wd-input-number
            v-model="disablePlusValue"
            disable-plus
          />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 禁用状态" :code="codes.status.disabledTemplate" />
        <DemoCode title="模板 - 禁用输入框" :code="codes.status.disableInputTemplate" />
        <DemoCode title="模板 - 禁用按钮" :code="codes.status.disableButtonTemplate" />
        <DemoCode title="脚本 - 状态示例" :code="codes.status.script" />
      </template>
    </DemoSection>

    <!-- 精度和格式示例 -->
    <DemoSection title="精度和格式" desc="小数精度、严格步进等数值格式控制">
      <wd-cell-group>
        <wd-cell title="设置小数精度">
          <wd-input-number
            v-model="precisionValue"
            :precision="1"
            :step="0.1"
            @change="handlePrecisionChange"
          />
        </wd-cell>

        <wd-cell title="严格步进模式">
          <wd-input-number
            v-model="strictValue"
            step-strictly
            :step="2"
            @change="handleStrictChange"
          />
        </wd-cell>

        <wd-cell title="严格步进 + 边界限制" vertical>
          <view class="space-y-2">
            <view class="text-sm text-gray-600">
              当前值：{{ strictBoundaryValue }}（步进值2，最小值3，最大值15）
            </view>
            <wd-input-number
              v-model="strictBoundaryValue"
              step-strictly
              :step="2"
              :min="3"
              :max="15"
              @change="handleStrictBoundaryChange"
            />
            <view class="rounded bg-gray-100 p-2 text-xs text-gray-600">
              尝试输入1 → 自动调整为4；输入5 → 调整为4；输入17 → 调整为14
            </view>
          </view>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 小数精度" :code="codes.precision.precisionTemplate" />
        <DemoCode title="模板 - 严格步进" :code="codes.precision.strictTemplate" />
        <DemoCode title="模板 - 边界限制" :code="codes.precision.boundaryTemplate" />
        <DemoCode title="脚本 - 精度控制" :code="codes.precision.script" />
      </template>
    </DemoSection>

    <!-- 自定义样式示例 -->
    <DemoSection title="自定义样式" desc="自定义输入框宽度、无输入框模式等样式配置">
      <wd-cell-group>
        <wd-cell title="自定义输入框宽度">
          <wd-input-number
            v-model="customWidthValue"
            input-width="70px"
            @change="handleCustomWidthChange"
          />
        </wd-cell>

        <wd-cell title="无输入框模式" vertical>
          <view class="flex items-center justify-between">
            <view class="text-sm text-gray-600">数量：{{ withoutInputValue }}</view>
            <wd-input-number
              v-model="withoutInputValue"
              without-input
              @change="handleWithoutInputChange"
            />
          </view>
        </wd-cell>

        <wd-cell title="允许空值">
          <wd-input-number
            v-model="nullableValue"
            allow-null
            placeholder="不限"
            input-width="80px"
            @change="handleNullableChange"
          />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 自定义宽度" :code="codes.custom.widthTemplate" />
        <DemoCode title="模板 - 无输入框" :code="codes.custom.withoutInputTemplate" />
        <DemoCode title="模板 - 允许空值" :code="codes.custom.nullableTemplate" />
        <DemoCode title="脚本 - 自定义样式" :code="codes.custom.script" />
      </template>
    </DemoSection>

    <!-- Cell 样式示例 -->
    <DemoSection title="Cell 样式" desc="在表单中常用的 Cell 样式布局">
      <wd-cell-group border>
        <wd-input-number
          v-model="cellBasicValue"
          label="基本用法"
          @change="handleCellBasicChange"
        />

        <wd-input-number
          v-model="cellDisabledValue"
          label="禁用状态"
          disabled
        />

        <wd-input-number
          v-model="cellStepValue"
          label="设置步长"
          :step="5"
          @change="handleCellStepChange"
        />

        <wd-input-number
          v-model="cellRangeValue"
          label="限制范围"
          :min="0"
          :max="100"
          @change="handleCellRangeChange"
        />

        <wd-input-number
          v-model="cellPrecisionValue"
          label="小数精度"
          :precision="2"
          :step="0.01"
          @change="handleCellPrecisionChange"
        />

        <wd-input-number
          v-model="cellRequiredValue"
          label="必填项"
          required
          @change="handleCellRequiredChange"
        />
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - Cell 样式" :code="codes.cell.template" />
        <DemoCode title="脚本 - Cell 样式" :code="codes.cell.script" />
      </template>
    </DemoSection>

    <!-- 高级配置示例 -->
    <DemoSection title="高级配置" desc="更多高级配置选项和特殊功能">
      <!-- 高级配置示例 -->
      <view class="space-y-4">
        <view class="mx-4">
          <view class="mb-3 text-base font-medium">更新模式控制</view>
          <wd-cell-group>
            <wd-cell title="立即更新模式（默认）">
              <view class="space-y-2">
                <view class="text-xs text-gray-600">当前值：{{ immediateValue }}</view>
                <wd-input-number
                  v-model="immediateValue"
                  :immediate-change="true"
                  @change="handleImmediateChange"
                />
              </view>
            </wd-cell>
            <wd-cell title="非立即更新模式" vertical>
              <view class="space-y-2">
                <view class="text-xs text-gray-600">当前值：{{ nonImmediateValue }}</view>
                <wd-input-number
                  v-model="nonImmediateValue"
                  :immediate-change="false"
                  @change="handleNonImmediateChange"
                />
              </view>
            </wd-cell>
          </wd-cell-group>
        </view>

        <view class="mx-4">
          <view class="mb-3 text-base font-medium">长按加减</view>
          <wd-cell-group>
            <wd-cell title="长按快速调节">
              <wd-input-number
                v-model="longPressValue"
                long-press
                @change="handleLongPressChange"
              />
            </wd-cell>
          </wd-cell-group>
        </view>

        <view class="mx-4">
          <view class="mb-3 text-base font-medium">异步变更确认</view>
          <wd-cell-group>
            <wd-cell title="异步变更">
              <wd-input-number
                v-model="asyncValue"
                :before-change="handleBeforeChange"
                @change="handleAsyncChange"
              />
            </wd-cell>
          </wd-cell-group>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 更新模式" :code="codes.advanced.updateModeTemplate" />
        <DemoCode title="模板 - 长按加减" :code="codes.advanced.longPressTemplate" />
        <DemoCode title="模板 - 异步变更" :code="codes.advanced.asyncTemplate" />
        <DemoCode title="脚本 - 高级配置" :code="codes.advanced.script" />
      </template>
    </DemoSection>

    <!-- 事件监听示例 -->
    <DemoSection title="事件监听" desc="监听数字输入框的各种事件和交互">
      <!-- 事件演示区域 -->
      <view class="space-y-4">
        <!-- 事件测试输入框 -->
        <wd-cell-group>
          <wd-input-number
            v-model="eventValue"
            label="事件测试"
            prefix-icon="dong"
            suffix-icon="list"
            @change="handleEventChange"
            @focus="handleEventFocus"
            @blur="handleEventBlur"
            @clickprefixicon="handleClickPrefixIcon"
            @clicksuffixicon="handleClickSuffixIcon"
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
import type { InputNumberBeforeChange } from '@/wd/components/wd-input-number/wd-input-number.vue'

// ===== 组件状态管理 =====

const { loading, close } = useToast()

// 基本用法相关值
const basicValue = ref<number>(1)
const stepValue = ref<number>(1)
const rangeValue = ref<number>(5)

// 状态示例相关值
const disabledValue = ref<number>(2)
const disableInputValue = ref<number>(1)
const disableMinusValue = ref<number>(1)
const disablePlusValue = ref<number>(1)

// 精度和格式相关值
const precisionValue = ref<string>('1.2')
const strictValue = ref<number>(2)
const strictBoundaryValue = ref<number>(4)

// 自定义样式相关值
const customWidthValue = ref<number>(2)
const withoutInputValue = ref<number>(1)
const nullableValue = ref<string>('')

// Cell 样式相关值
const cellBasicValue = ref<number>(1)
const cellDisabledValue = ref<number>(2)
const cellStepValue = ref<number>(5)
const cellRangeValue = ref<number>(50)
const cellPrecisionValue = ref<string>('1.50')
const cellRequiredValue = ref<number>(1)

// 高级配置相关值
const immediateValue = ref<number>(1)
const nonImmediateValue = ref<number>(1)
const longPressValue = ref<number>(1)
const asyncValue = ref<number>(1)

// 事件测试相关值
const eventValue = ref<number>(1)

// 事件日志状态
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
    defaultTemplate: `<wd-input-number
  v-model="basicValue"
  @change="handleBasicChange"
/>`,

    stepTemplate: `<wd-input-number
  v-model="stepValue"
  :step="2"
  @change="handleStepChange"
/>`,

    rangeTemplate: `<wd-input-number
  v-model="rangeValue"
  :min="3"
  :max="10"
  @change="handleRangeChange"
/>`,

    script: `import { ref } from 'vue'

// 基本用法相关值
const basicValue = ref(1)
const stepValue = ref(1)
const rangeValue = ref(5)

// 基本变化事件处理
const handleBasicChange = ({ value }) => {
  console.log('基本用法值变化:', value)
}

const handleStepChange = ({ value }) => {
  console.log('步长值变化:', value)
}

const handleRangeChange = ({ value }) => {
  console.log('范围限制值变化:', value)
}`,
  },

  // 状态示例代码
  status: {
    disabledTemplate: `<wd-input-number
  v-model="disabledValue"
  disabled
/>`,

    disableInputTemplate: `<wd-input-number
  v-model="disableInputValue"
  disable-input
/>`,

    disableButtonTemplate: `<!-- 禁用减号按钮 -->
<wd-input-number
  v-model="disableMinusValue"
  disable-minus
/>

<!-- 禁用加号按钮 -->
<wd-input-number
  v-model="disablePlusValue"
  disable-plus
/>`,

    script: `// 状态示例相关值
const disabledValue = ref(2)
const disableInputValue = ref(1)
const disableMinusValue = ref(1)
const disablePlusValue = ref(1)`,
  },

  // 精度控制代码
  precision: {
    precisionTemplate: `<wd-input-number
  v-model="precisionValue"
  :precision="1"
  :step="0.1"
  @change="handlePrecisionChange"
/>`,

    strictTemplate: `<wd-input-number
  v-model="strictValue"
  step-strictly
  :step="2"
  @change="handleStrictChange"
/>`,

    boundaryTemplate: `<wd-input-number
  v-model="strictBoundaryValue"
  step-strictly
  :step="2"
  :min="3"
  :max="15"
  @change="handleStrictBoundaryChange"
/>`,

    script: `// 精度和格式相关值
const precisionValue = ref('1.2')
const strictValue = ref(2)
const strictBoundaryValue = ref(4)

// 精度变化事件处理
const handlePrecisionChange = ({ value }) => {
  console.log('小数精度值变化:', value)
}

const handleStrictChange = ({ value }) => {
  console.log('严格步进值变化:', value)
}

const handleStrictBoundaryChange = ({ value }) => {
  console.log('严格步进边界值变化:', value)
}`,
  },

  // 自定义样式代码
  custom: {
    widthTemplate: `<wd-input-number
  v-model="customWidthValue"
  input-width="70px"
  @change="handleCustomWidthChange"
/>`,

    withoutInputTemplate: `<view class="flex items-center justify-between">
  <view class="text-sm text-gray-600">数量：{{ withoutInputValue }}</view>
  <wd-input-number
    v-model="withoutInputValue"
    without-input
    @change="handleWithoutInputChange"
  />
</view>`,

    nullableTemplate: `<wd-input-number
  v-model="nullableValue"
  allow-null
  placeholder="不限"
  input-width="80px"
  @change="handleNullableChange"
/>`,

    script: `// 自定义样式相关值
const customWidthValue = ref(2)
const withoutInputValue = ref(1)
const nullableValue = ref('')

// 自定义样式事件处理
const handleCustomWidthChange = ({ value }) => {
  console.log('自定义宽度值变化:', value)
}

const handleWithoutInputChange = ({ value }) => {
  console.log('无输入框值变化:', value)
}

const handleNullableChange = ({ value }) => {
  console.log('允许空值变化:', value)
}`,
  },

  // Cell 样式代码
  cell: {
    template: `<wd-cell-group border>
  <!-- 基本用法 -->
  <wd-input-number
    v-model="cellBasicValue"
    label="基本用法"
    @change="handleCellBasicChange"
  />

  <!-- 禁用状态 -->
  <wd-input-number
    v-model="cellDisabledValue"
    label="禁用状态"
    disabled
  />

  <!-- 设置步长 -->
  <wd-input-number
    v-model="cellStepValue"
    label="设置步长"
    :step="5"
    @change="handleCellStepChange"
  />

  <!-- 限制范围 -->
  <wd-input-number
    v-model="cellRangeValue"
    label="限制范围"
    :min="0"
    :max="100"
    @change="handleCellRangeChange"
  />

  <!-- 必填项 -->
  <wd-input-number
    v-model="cellRequiredValue"
    label="必填项"
    required
    @change="handleCellRequiredChange"
  />
</wd-cell-group>`,

    script: `// Cell 样式相关值
const cellBasicValue = ref(1)
const cellDisabledValue = ref(2)
const cellStepValue = ref(5)
const cellRangeValue = ref(50)
const cellRequiredValue = ref(1)

// Cell 样式事件处理
const handleCellBasicChange = ({ value }) => {
  console.log('Cell 基本值变化:', value)
}

const handleCellStepChange = ({ value }) => {
  console.log('Cell 步长值变化:', value)
}

const handleCellRangeChange = ({ value }) => {
  console.log('Cell 范围值变化:', value)
}`,
  },

  // 高级配置代码
  advanced: {
    updateModeTemplate: `<wd-cell-group>
  <!-- 立即更新模式（默认） -->
  <wd-cell title="立即更新模式（默认）" vertical>
    <view class="space-y-2">
      <view class="text-xs text-gray-600">当前值：{{ immediateValue }}</view>
      <wd-input-number
        v-model="immediateValue"
        :immediate-change="true"
        @change="handleImmediateChange"
      />
    </view>
  </wd-cell>

  <!-- 非立即更新模式 -->
  <wd-cell title="非立即更新模式" vertical>
    <view class="space-y-2">
      <view class="text-xs text-gray-600">当前值：{{ nonImmediateValue }}</view>
      <wd-input-number
        v-model="nonImmediateValue"
        :immediate-change="false"
        @change="handleNonImmediateChange"
      />
    </view>
  </wd-cell>
</wd-cell-group>`,

    longPressTemplate: `<wd-cell-group>
  <wd-cell title="长按快速调节">
    <wd-input-number
      v-model="longPressValue"
      long-press
      @change="handleLongPressChange"
    />
  </wd-cell>
</wd-cell-group>`,

    asyncTemplate: `<wd-cell-group>
  <wd-cell title="异步变更">
    <wd-input-number
      v-model="asyncValue"
      :before-change="handleBeforeChange"
      @change="handleAsyncChange"
    />
  </wd-cell>
</wd-cell-group>`,

    script: `import { useToast } from '@/wd'
import type { InputNumberBeforeChange } from '@/wd/components/wd-input-number/wd-input-number.vue'

const { loading, close } = useToast()

// 高级配置相关值
const immediateValue = ref(1)
const nonImmediateValue = ref(1)
const longPressValue = ref(1)
const asyncValue = ref(1)

// 异步变更处理
const handleBeforeChange: InputNumberBeforeChange = (value) => {
  loading({ msg: \`正在更新到\${value}\` })
  return new Promise((resolve) => {
    setTimeout(() => {
      close()
      resolve(true)
    }, 500)
  })
}

// 事件处理
const handleImmediateChange = ({ value }) => {
  console.log('立即更新值变化:', value)
}

const handleLongPressChange = ({ value }) => {
  console.log('长按加减值变化:', value)
}`,
  },

  // 事件监听代码
  events: {
    template: `<wd-input-number
  v-model="eventValue"
  label="事件测试"
  prefix-icon="dong"
  suffix-icon="list"
  @change="handleEventChange"
  @focus="handleEventFocus"
  @blur="handleEventBlur"
  @clickprefixicon="handleClickPrefixIcon"
  @clicksuffixicon="handleClickSuffixIcon"
/>`,

    script: `const eventValue = ref(1)
const eventLogs = ref([])

// 添加事件日志
const addEventLog = (message, type = 'info') => {
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

// 事件处理方法
const handleEventChange = ({ value }) => {
  addEventLog(\`数值变化: \${value}\`, 'success')
}

const handleEventFocus = (event) => {
  addEventLog('获得焦点', 'success')
}

const handleEventBlur = ({ value }) => {
  addEventLog(\`失去焦点: \${value}\`, 'warning')
}

const handleClickPrefixIcon = () => {
  addEventLog('点击前置图标', 'info')
}

const handleClickSuffixIcon = () => {
  addEventLog('点击后置图标', 'info')
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'model-value',
    type: 'String | Number',
    default: '1',
    desc: '绑定值',
  },
  {
    name: 'min',
    type: 'Number',
    default: '1',
    desc: '最小值',
  },
  {
    name: 'max',
    type: 'Number',
    default: 'Number.MAX_SAFE_INTEGER',
    desc: '最大值',
  },
  {
    name: 'step',
    type: 'Number',
    default: '1',
    desc: '步进值',
  },
  {
    name: 'step-strictly',
    type: 'Boolean',
    default: 'false',
    desc: '是否严格按照步进值递增或递减',
  },
  {
    name: 'precision',
    type: 'String | Number',
    default: '0',
    desc: '数值精度',
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: '是否禁用',
  },
  {
    name: 'disable-input',
    type: 'Boolean',
    default: 'false',
    desc: '是否禁用输入框',
  },
  {
    name: 'disable-minus',
    type: 'Boolean',
    default: 'false',
    desc: '是否禁用减号按钮',
  },
  {
    name: 'disable-plus',
    type: 'Boolean',
    default: 'false',
    desc: '是否禁用加号按钮',
  },
  {
    name: 'without-input',
    type: 'Boolean',
    default: 'false',
    desc: '是否不显示输入框',
  },
  {
    name: 'input-width',
    type: 'String | Number',
    default: '120',
    desc: '输入框宽度',
  },
  {
    name: 'allow-null',
    type: 'Boolean',
    default: 'false',
    desc: '是否允许为空',
  },
  {
    name: 'placeholder',
    type: 'String',
    default: '""',
    desc: '输入框占位符',
  },
  {
    name: 'long-press',
    type: 'Boolean',
    default: 'false',
    desc: '是否开启长按加减手势',
  },
  {
    name: 'immediate-change',
    type: 'Boolean',
    default: 'true',
    desc: '是否立即响应输入变化',
  },
  {
    name: 'before-change',
    type: 'Function',
    default: '—',
    desc: '输入值变化前的回调函数',
  },
  {
    name: 'label',
    type: 'String',
    default: '""',
    desc: '左侧标题',
  },
  {
    name: 'required',
    type: 'Boolean',
    default: 'false',
    desc: '是否必填',
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
    name: 'change',
    desc: '数值变化时触发，参数为 { value }',
  },
  {
    name: 'focus',
    desc: '输入框获得焦点时触发，参数为 event.detail',
  },
  {
    name: 'blur',
    desc: '输入框失去焦点时触发，参数为 { value }',
  },
  {
    name: 'clickprefixicon',
    desc: '点击前置图标时触发',
  },
  {
    name: 'clicksuffixicon',
    desc: '点击后置图标时触发',
  },
]

// Methods 方法文档（InputNumber 组件没有暴露方法）
const apiMethods: any[] = []

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

// === 基本用法事件处理 ===

/**
 * 基本用法值变化
 */
const handleBasicChange = ({ value }: { value: number | string }) => {
  console.log('基本用法值变化:', value)
}

/**
 * 步长值变化
 */
const handleStepChange = ({ value }: { value: number | string }) => {
  console.log('步长值变化:', value)
}

/**
 * 范围限制值变化
 */
const handleRangeChange = ({ value }: { value: number | string }) => {
  console.log('范围限制值变化:', value)
}

// === 精度控制事件处理 ===

/**
 * 小数精度值变化
 */
const handlePrecisionChange = ({ value }: { value: number | string }) => {
  console.log('小数精度值变化:', value)
}

/**
 * 严格步进值变化
 */
const handleStrictChange = ({ value }: { value: number | string }) => {
  console.log('严格步进值变化:', value)
}

/**
 * 严格步进边界值变化
 */
const handleStrictBoundaryChange = ({ value }: { value: number | string }) => {
  console.log('严格步进边界值变化:', value)
}

// === 自定义样式事件处理 ===

/**
 * 自定义宽度值变化
 */
const handleCustomWidthChange = ({ value }: { value: number | string }) => {
  console.log('自定义宽度值变化:', value)
}

/**
 * 无输入框值变化
 */
const handleWithoutInputChange = ({ value }: { value: number | string }) => {
  console.log('无输入框值变化:', value)
}

/**
 * 允许空值变化
 */
const handleNullableChange = ({ value }: { value: number | string }) => {
  console.log('允许空值变化:', value)
}

// === Cell 样式事件处理 ===

/**
 * Cell 基本值变化
 */
const handleCellBasicChange = ({ value }: { value: number | string }) => {
  console.log('Cell 基本值变化:', value)
}

/**
 * Cell 步长值变化
 */
const handleCellStepChange = ({ value }: { value: number | string }) => {
  console.log('Cell 步长值变化:', value)
}

/**
 * Cell 范围值变化
 */
const handleCellRangeChange = ({ value }: { value: number | string }) => {
  console.log('Cell 范围值变化:', value)
}

/**
 * Cell 精度值变化
 */
const handleCellPrecisionChange = ({ value }: { value: number | string }) => {
  console.log('Cell 精度值变化:', value)
}

/**
 * Cell 必填值变化
 */
const handleCellRequiredChange = ({ value }: { value: number | string }) => {
  console.log('Cell 必填值变化:', value)
}

// === 高级配置事件处理 ===

/**
 * 立即更新值变化
 */
const handleImmediateChange = ({ value }: { value: number | string }) => {
  console.log('立即更新值变化:', value)
}

/**
 * 非立即更新值变化
 */
const handleNonImmediateChange = ({ value }: { value: number | string }) => {
  console.log('非立即更新值变化:', value)
}

/**
 * 长按加减值变化
 */
const handleLongPressChange = ({ value }: { value: number | string }) => {
  console.log('长按加减值变化:', value)
}

/**
 * 异步变更值变化
 */
const handleAsyncChange = ({ value }: { value: number | string }) => {
  console.log('异步变更值变化:', value)
}

/**
 * 异步变更前回调
 */
const handleBeforeChange: InputNumberBeforeChange = (value) => {
  loading({ msg: `正在更新到${value}` })
  return new Promise((resolve) => {
    setTimeout(() => {
      close()
      resolve(true)
    }, 500)
  })
}

// === 事件监听示例处理方法 ===

/**
 * 事件测试 - 数值变化事件
 */
const handleEventChange = ({ value }: { value: number | string }) => {
  addEventLog(`数值变化: ${value}`, 'success')
}

/**
 * 事件测试 - 获得焦点事件
 */
const handleEventFocus = (event: any) => {
  addEventLog('获得焦点', 'success')
}

/**
 * 事件测试 - 失去焦点事件
 */
const handleEventBlur = ({ value }: { value: number | string }) => {
  addEventLog(`失去焦点: ${value}`, 'warning')
}

/**
 * 事件测试 - 点击前置图标事件
 */
const handleClickPrefixIcon = () => {
  addEventLog('点击前置图标', 'info')
}

/**
 * 事件测试 - 点击后置图标事件
 */
const handleClickSuffixIcon = () => {
  addEventLog('点击后置图标', 'info')
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
