<!-- Radio 单选框 http://127.0.0.1:100/#/pages-sub/demo/wd/radio -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Radio 单选框" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最基础的单选框用法，通过 v-model 绑定选中值">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="默认形状" vertical>
          <wd-radio-group v-model="basicValue" @change="handleBasicChange">
            <wd-radio :value="1">
              <wd-text text="选项1" />
            </wd-radio>
            <wd-radio :value="2">
              <wd-text text="选项2" />
            </wd-radio>
            <wd-radio :value="3">
              <wd-text text="选项3" />
            </wd-radio>
          </wd-radio-group>
        </wd-cell>

        <wd-cell title="当前选中值">
          <wd-text :text="`选项${basicValue}`" />
        </wd-cell>
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基本用法" :code="codes.basic.template" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 不同形状示例 -->
    <DemoSection title="不同形状" desc="支持 check（默认）、dot（圆点）、button（按钮）三种形状">
      <wd-cell-group>
        <wd-cell title="默认形状（check）" vertical>
          <wd-radio-group v-model="shapeCheckValue" shape="check">
            <wd-radio :value="1">
              <wd-text text="选项1" />
            </wd-radio>
            <wd-radio :value="2">
              <wd-text text="选项2" />
            </wd-radio>
          </wd-radio-group>
        </wd-cell>

        <wd-cell title="圆点形状（dot）" vertical>
          <wd-radio-group v-model="shapeDotValue" shape="dot">
            <wd-radio :value="1">
              <wd-text text="选项1" />
            </wd-radio>
            <wd-radio :value="2">
              <wd-text text="选项2" />
            </wd-radio>
          </wd-radio-group>
        </wd-cell>

        <wd-cell title="按钮形状（button）" vertical>
          <wd-radio-group v-model="shapeButtonValue" shape="button">
            <wd-radio :value="1">
              <wd-text text="选项1" />
            </wd-radio>
            <wd-radio :value="2">
              <wd-text text="选项2" />
            </wd-radio>
          </wd-radio-group>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 不同形状" :code="codes.shape.template" />
        <DemoCode title="脚本 - 不同形状" :code="codes.shape.script" />
      </template>
    </DemoSection>

    <!-- Options 模式示例 -->
    <DemoSection title="Options 模式" desc="通过 options 数组快速创建单选项，无需编写子组件">
      <wd-cell-group>
        <wd-cell title="基础 options" vertical>
          <wd-radio-group v-model="optionsValue" :options="basicOptions" />
        </wd-cell>

        <wd-cell title="带禁用选项" vertical>
          <wd-radio-group v-model="optionsDisabledValue" :options="disabledOptions" shape="dot" />
        </wd-cell>

        <wd-cell title="按钮模式 options" vertical>
          <wd-radio-group v-model="optionsButtonValue" :options="buttonOptions" shape="button" />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - Options 模式" :code="codes.options.template" />
        <DemoCode title="脚本 - Options 模式" :code="codes.options.script" />
      </template>
    </DemoSection>

    <!-- 表单模式示例 -->
    <DemoSection title="表单模式" desc="在表单中使用，支持标签、验证等表单特性">
      <!-- 基础表单模式 -->
      <wd-radio-group
        v-model="formValue"
        label="支付方式"
        :options="paymentOptions"
        shape="dot"
        required
      />

      <!-- 按钮组表单模式 -->
      <wd-radio-group
        v-model="formButtonValue"
        label="配送方式"
        :options="deliveryOptions"
        shape="button"
      />

      <!-- 垂直布局表单模式 -->
      <wd-radio-group
        v-model="formVerticalValue"
        label="服务等级"
        :options="serviceOptions"
        vertical
      />

      <template #codes>
        <DemoCode title="模板 - 表单模式" :code="codes.form.template" />
        <DemoCode title="脚本 - 表单模式" :code="codes.form.script" />
      </template>
    </DemoSection>

    <!-- 布局配置示例 -->
    <DemoSection title="布局配置" desc="支持内联布局、图标位置、尺寸等配置">
      <wd-cell-group>
        <wd-cell title="内联布局" vertical>
          <wd-radio-group v-model="inlineValue" inline>
            <wd-radio :value="1">
              <wd-text text="选项1" />
            </wd-radio>
            <wd-radio :value="2">
              <wd-text text="选项2" />
            </wd-radio>
            <wd-radio :value="3">
              <wd-text text="选项3" />
            </wd-radio>
          </wd-radio-group>
        </wd-cell>

        <wd-cell title="大尺寸" vertical>
          <wd-radio-group v-model="largeValue" size="large" shape="dot">
            <wd-radio :value="1">
              <wd-text text="选项1" />
            </wd-radio>
            <wd-radio :value="2">
              <wd-text text="选项2" />
            </wd-radio>
          </wd-radio-group>
        </wd-cell>

        <wd-cell title="右侧图标" vertical>
          <wd-radio-group v-model="rightIconValue" inline shape="dot" icon-placement="right">
            <wd-radio :value="1">
              <wd-text text="选项1" />
            </wd-radio>
            <wd-radio :value="2">
              <wd-text text="选项2" />
            </wd-radio>
          </wd-radio-group>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 布局配置" :code="codes.layout.template" />
        <DemoCode title="脚本 - 布局配置" :code="codes.layout.script" />
      </template>
    </DemoSection>

    <!-- 自定义样式示例 -->
    <DemoSection title="自定义样式" desc="自定义选中颜色、禁用状态等样式配置">
      <wd-cell-group>
        <wd-cell title="自定义选中颜色" vertical>
          <wd-radio-group v-model="colorValue" checked-color="#fa4350">
            <wd-radio :value="1">
              <wd-text text="红色主题" />
            </wd-radio>
            <wd-radio :value="2">
              <wd-text text="选项2" />
            </wd-radio>
          </wd-radio-group>
        </wd-cell>

        <wd-cell title="圆点自定义颜色" vertical>
          <wd-radio-group v-model="dotColorValue" shape="dot" checked-color="#52c41a">
            <wd-radio :value="1">
              <wd-text text="绿色主题" />
            </wd-radio>
            <wd-radio :value="2">
              <wd-text text="选项2" />
            </wd-radio>
          </wd-radio-group>
        </wd-cell>

        <wd-cell title="禁用状态" vertical>
          <wd-radio-group v-model="disabledValue" disabled>
            <wd-radio :value="1">
              <wd-text text="禁用选项1" />
            </wd-radio>
            <wd-radio :value="2">
              <wd-text text="禁用选项2" />
            </wd-radio>
          </wd-radio-group>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 自定义样式" :code="codes.style.template" />
        <DemoCode title="脚本 - 自定义样式" :code="codes.style.script" />
      </template>
    </DemoSection>

    <!-- 宽度控制示例 -->
    <DemoSection title="宽度控制" desc="通过 item-width 属性控制每项的宽度，实现多列布局">
      <wd-cell-group>
        <wd-cell title="三列布局（33.33%）" vertical>
          <wd-radio-group v-model="widthValue" shape="button" item-width="33.33%">
            <wd-radio :value="1">
              <wd-text text="选项1" />
            </wd-radio>
            <wd-radio :value="2">
              <wd-text text="选项2" />
            </wd-radio>
            <wd-radio :value="3">
              <wd-text text="选项3" />
            </wd-radio>
            <wd-radio :value="4">
              <wd-text text="选项4" />
            </wd-radio>
            <wd-radio :value="5">
              <wd-text text="选项5" />
            </wd-radio>
            <wd-radio :value="6">
              <wd-text text="选项6" />
            </wd-radio>
          </wd-radio-group>
        </wd-cell>

        <wd-cell title="固定宽度（120px）" vertical>
          <wd-radio-group v-model="fixedWidthValue" shape="dot" item-width="120px">
            <wd-radio :value="1">
              <wd-text text="选项A" />
            </wd-radio>
            <wd-radio :value="2">
              <wd-text text="选项B" />
            </wd-radio>
            <wd-radio :value="3">
              <wd-text text="选项C" />
            </wd-radio>
            <wd-radio :value="4">
              <wd-text text="选项D" />
            </wd-radio>
          </wd-radio-group>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 宽度控制" :code="codes.width.template" />
        <DemoCode title="脚本 - 宽度控制" :code="codes.width.script" />
      </template>
    </DemoSection>

    <!-- 优先级控制示例 -->
    <DemoSection title="优先级控制" desc="子组件的属性优先级高于组的属性">
      <wd-cell-group>
        <wd-cell title="混合配置" vertical>
          <wd-radio-group v-model="priorityValue" shape="button" disabled checked-color="#fa4350">
            <wd-radio :value="1" checked-color="#52c41a" :disabled="false">
              <wd-text text="独立配置" />
            </wd-radio>
            <wd-radio :value="2" :disabled="false">
              <wd-text text="部分独立" />
            </wd-radio>
            <wd-radio :value="3">
              <wd-text text="继承组配置" />
            </wd-radio>
          </wd-radio-group>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 优先级控制" :code="codes.priority.template" />
        <DemoCode title="脚本 - 优先级控制" :code="codes.priority.script" />
      </template>
    </DemoSection>

    <!-- 实际应用场景 -->
    <DemoSection title="实际应用场景" desc="常见的业务场景示例">
      <!-- 支付方式选择 -->
      <view class="space-y-4">
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">支付方式选择</view>
          <view class="mx-4 rounded-lg bg-gray-50 p-4">
            <wd-radio-group v-model="paymentMethod" :options="paymentMethodOptions" />
            <view class="mt-3 text-xs text-gray-500">
              当前选择：{{ getPaymentMethodName() }}
            </view>
          </view>
        </view>

        <!-- 商品规格选择 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">商品规格选择</view>
          <view class="mx-4 rounded-lg bg-gray-50 p-4 space-y-3">
            <view>
              <view class="mb-2 text-xs text-gray-600">颜色</view>
              <wd-radio-group v-model="productColor" :options="colorOptions" shape="button" item-width="25%" />
            </view>
            <view>
              <view class="mb-2 text-xs text-gray-600">尺寸</view>
              <wd-radio-group v-model="productSize" :options="sizeOptions" shape="button" item-width="20%" />
            </view>
            <view class="text-xs text-gray-500">
              已选：{{ getProductSpecName() }}
            </view>
          </view>
        </view>

        <!-- 评分选择 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">评分选择</view>
          <view class="mx-4 rounded-lg bg-gray-50 p-4">
            <wd-radio-group v-model="rating" :options="ratingOptions" inline shape="dot" checked-color="#faad14" />
            <view class="mt-3 text-xs text-gray-500">
              当前评分：{{ rating }} 星
            </view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 支付方式" :code="codes.scenarios.paymentTemplate" />
        <DemoCode title="模板 - 商品规格" :code="codes.scenarios.productTemplate" />
        <DemoCode title="模板 - 评分选择" :code="codes.scenarios.ratingTemplate" />
        <DemoCode title="脚本 - 应用场景" :code="codes.scenarios.script" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import type { RadioOption } from '@/wd/components/wd-radio-group/wd-radio-group.vue'
import { ref } from 'vue'

// ===== 组件状态管理 =====

// 基本用法
const basicValue = ref<number>(1)

// 不同形状
const shapeCheckValue = ref<number>(1)
const shapeDotValue = ref<number>(1)
const shapeButtonValue = ref<number>(1)

// Options 模式
const optionsValue = ref<number>(1)
const optionsDisabledValue = ref<number>(1)
const optionsButtonValue = ref<string>('option1')

// 表单模式
const formValue = ref<string>('alipay')
const formButtonValue = ref<string>('express')
const formVerticalValue = ref<string>('standard')

// 布局配置
const inlineValue = ref<number>(1)
const largeValue = ref<number>(1)
const rightIconValue = ref<number>(1)

// 自定义样式
const colorValue = ref<number>(1)
const dotColorValue = ref<number>(1)
const disabledValue = ref<number>(1)

// 宽度控制
const widthValue = ref<number>(1)
const fixedWidthValue = ref<number>(1)

// 优先级控制
const priorityValue = ref<number>(1)

// 应用场景
const paymentMethod = ref<string>('wechat')
const productColor = ref<string>('red')
const productSize = ref<string>('M')
const rating = ref<number>(5)

// ===== 数据配置 =====

// 基础选项配置
const basicOptions = ref<RadioOption[]>([
  { value: 1, label: '选项1' },
  { value: 2, label: '选项2' },
  { value: 3, label: '选项3' },
])

// 带禁用的选项配置
const disabledOptions = ref<RadioOption[]>([
  { value: 1, label: '选项1' },
  { value: 2, label: '选项2（禁用）', disabled: true },
  { value: 3, label: '选项3' },
])

// 按钮选项配置
const buttonOptions = ref<RadioOption[]>([
  { value: 'option1', label: '选项一' },
  { value: 'option2', label: '选项二' },
  { value: 'option3', label: '选项三' },
])

// 表单相关选项
const paymentOptions = ref<RadioOption[]>([
  { value: 'alipay', label: '支付宝' },
  { value: 'wechat', label: '微信支付' },
  { value: 'bank', label: '银行卡' },
])

const deliveryOptions = ref<RadioOption[]>([
  { value: 'express', label: '快递配送' },
  { value: 'self', label: '门店自提' },
  { value: 'same', label: '同城配送' },
])

const serviceOptions = ref<RadioOption[]>([
  { value: 'standard', label: '标准服务' },
  { value: 'premium', label: '高级服务' },
  { value: 'vip', label: 'VIP服务' },
])

// 应用场景选项
const paymentMethodOptions = ref<RadioOption[]>([
  { value: 'alipay', label: '支付宝' },
  { value: 'wechat', label: '微信支付' },
  { value: 'apple', label: 'Apple Pay' },
  { value: 'bank', label: '银行卡支付' },
])

const colorOptions = ref<RadioOption[]>([
  { value: 'red', label: '红色' },
  { value: 'blue', label: '蓝色' },
  { value: 'green', label: '绿色' },
  { value: 'black', label: '黑色' },
])

const sizeOptions = ref<RadioOption[]>([
  { value: 'XS', label: 'XS' },
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
])

const ratingOptions = ref<RadioOption[]>([
  { value: 1, label: '1星' },
  { value: 2, label: '2星' },
  { value: 3, label: '3星' },
  { value: 4, label: '4星' },
  { value: 5, label: '5星' },
])

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    template: `<wd-radio-group v-model="basicValue" @change="handleBasicChange">
  <wd-radio :value="1">
    <wd-text text="选项1" />
  </wd-radio>
  <wd-radio :value="2">
    <wd-text text="选项2" />
  </wd-radio>
  <wd-radio :value="3">
    <wd-text text="选项3" />
  </wd-radio>
</wd-radio-group>`,

    script: `import { ref } from 'vue'

const basicValue = ref(1)

const handleBasicChange = (value) => {
  console.log('选中值：', value)
}`,
  },

  // 不同形状代码
  shape: {
    template: `<!-- 默认形状（check） -->
<wd-radio-group v-model="shapeCheckValue" shape="check">
  <wd-radio :value="1"><wd-text text="选项1" /></wd-radio>
  <wd-radio :value="2"><wd-text text="选项2" /></wd-radio>
</wd-radio-group>

<!-- 圆点形状（dot） -->
<wd-radio-group v-model="shapeDotValue" shape="dot">
  <wd-radio :value="1"><wd-text text="选项1" /></wd-radio>
  <wd-radio :value="2"><wd-text text="选项2" /></wd-radio>
</wd-radio-group>

<!-- 按钮形状（button） -->
<wd-radio-group v-model="shapeButtonValue" shape="button">
  <wd-radio :value="1"><wd-text text="选项1" /></wd-radio>
  <wd-radio :value="2"><wd-text text="选项2" /></wd-radio>
</wd-radio-group>`,

    script: `import { ref } from 'vue'

const shapeCheckValue = ref(1)
const shapeDotValue = ref(1)
const shapeButtonValue = ref(1)`,
  },

  // Options 模式代码
  options: {
    template: `<!-- 基础 options -->
<wd-radio-group v-model="optionsValue" :options="basicOptions" />

<!-- 带禁用选项 -->
<wd-radio-group v-model="optionsDisabledValue" :options="disabledOptions" shape="dot" />

<!-- 按钮模式 options -->
<wd-radio-group v-model="optionsButtonValue" :options="buttonOptions" shape="button" />`,

    script: `import type { RadioOption } from '@/wd/components/wd-radio-group/wd-radio-group.vue'
import { ref } from 'vue'

const optionsValue = ref(1)
const optionsDisabledValue = ref(1)
const optionsButtonValue = ref('option1')

// 基础选项配置
const basicOptions = ref<RadioOption[]>([
  { value: 1, label: '选项1' },
  { value: 2, label: '选项2' },
  { value: 3, label: '选项3' },
])

// 带禁用的选项配置
const disabledOptions = ref<RadioOption[]>([
  { value: 1, label: '选项1' },
  { value: 2, label: '选项2（禁用）', disabled: true },
  { value: 3, label: '选项3' },
])

// 按钮选项配置
const buttonOptions = ref<RadioOption[]>([
  { value: 'option1', label: '选项一' },
  { value: 'option2', label: '选项二' },
  { value: 'option3', label: '选项三' },
])`,
  },

  // 表单模式代码
  form: {
    template: `<!-- 基础表单模式 -->
<wd-radio-group
  v-model="formValue"
  label="支付方式"
  :options="paymentOptions"
  shape="dot"
  required
/>

<!-- 按钮组表单模式 -->
<wd-radio-group
  v-model="formButtonValue"
  label="配送方式"
  :options="deliveryOptions"
  shape="button"
/>

<!-- 垂直布局表单模式 -->
<wd-radio-group
  v-model="formVerticalValue"
  label="服务等级"
  :options="serviceOptions"
  vertical
/>`,

    script: `import { ref } from 'vue'

const formValue = ref('alipay')
const formButtonValue = ref('express')
const formVerticalValue = ref('standard')

const paymentOptions = ref([
  { value: 'alipay', label: '支付宝' },
  { value: 'wechat', label: '微信支付' },
  { value: 'bank', label: '银行卡' },
])

const deliveryOptions = ref([
  { value: 'express', label: '快递配送' },
  { value: 'self', label: '门店自提' },
  { value: 'same', label: '同城配送' },
])`,
  },

  // 布局配置代码
  layout: {
    template: `<!-- 内联布局 -->
<wd-radio-group v-model="inlineValue" inline>
  <wd-radio :value="1"><wd-text text="选项1" /></wd-radio>
  <wd-radio :value="2"><wd-text text="选项2" /></wd-radio>
  <wd-radio :value="3"><wd-text text="选项3" /></wd-radio>
</wd-radio-group>

<!-- 大尺寸 -->
<wd-radio-group v-model="largeValue" size="large" shape="dot">
  <wd-radio :value="1"><wd-text text="选项1" /></wd-radio>
  <wd-radio :value="2"><wd-text text="选项2" /></wd-radio>
</wd-radio-group>

<!-- 右侧图标 -->
<wd-radio-group v-model="rightIconValue" inline shape="dot" icon-placement="right">
  <wd-radio :value="1"><wd-text text="选项1" /></wd-radio>
  <wd-radio :value="2"><wd-text text="选项2" /></wd-radio>
</wd-radio-group>`,

    script: `import { ref } from 'vue'

const inlineValue = ref(1)
const largeValue = ref(1)
const rightIconValue = ref(1)`,
  },

  // 自定义样式代码
  style: {
    template: `<!-- 自定义选中颜色 -->
<wd-radio-group v-model="colorValue" checked-color="#fa4350">
  <wd-radio :value="1"><wd-text text="红色主题" /></wd-radio>
  <wd-radio :value="2"><wd-text text="选项2" /></wd-radio>
</wd-radio-group>

<!-- 圆点自定义颜色 -->
<wd-radio-group v-model="dotColorValue" shape="dot" checked-color="#52c41a">
  <wd-radio :value="1"><wd-text text="绿色主题" /></wd-radio>
  <wd-radio :value="2"><wd-text text="选项2" /></wd-radio>
</wd-radio-group>

<!-- 禁用状态 -->
<wd-radio-group v-model="disabledValue" disabled>
  <wd-radio :value="1"><wd-text text="禁用选项1" /></wd-radio>
  <wd-radio :value="2"><wd-text text="禁用选项2" /></wd-radio>
</wd-radio-group>`,

    script: `import { ref } from 'vue'

const colorValue = ref(1)
const dotColorValue = ref(1)
const disabledValue = ref(1)`,
  },

  // 宽度控制代码
  width: {
    template: `<!-- 三列布局（33.33%） -->
<wd-radio-group v-model="widthValue" shape="button" item-width="33.33%">
  <wd-radio :value="1"><wd-text text="选项1" /></wd-radio>
  <wd-radio :value="2"><wd-text text="选项2" /></wd-radio>
  <wd-radio :value="3"><wd-text text="选项3" /></wd-radio>
  <wd-radio :value="4"><wd-text text="选项4" /></wd-radio>
  <wd-radio :value="5"><wd-text text="选项5" /></wd-radio>
  <wd-radio :value="6"><wd-text text="选项6" /></wd-radio>
</wd-radio-group>

<!-- 固定宽度（120px） -->
<wd-radio-group v-model="fixedWidthValue" shape="dot" item-width="120px">
  <wd-radio :value="1"><wd-text text="选项A" /></wd-radio>
  <wd-radio :value="2"><wd-text text="选项B" /></wd-radio>
  <wd-radio :value="3"><wd-text text="选项C" /></wd-radio>
  <wd-radio :value="4"><wd-text text="选项D" /></wd-radio>
</wd-radio-group>`,

    script: `import { ref } from 'vue'

const widthValue = ref(1)
const fixedWidthValue = ref(1)`,
  },

  // 优先级控制代码
  priority: {
    template: `<wd-radio-group v-model="priorityValue" shape="button" disabled checked-color="#fa4350">
  <wd-radio :value="1" checked-color="#52c41a" :disabled="false">
    <wd-text text="独立配置" />
  </wd-radio>
  <wd-radio :value="2" :disabled="false">
    <wd-text text="部分独立" />
  </wd-radio>
  <wd-radio :value="3">
    <wd-text text="继承组配置" />
  </wd-radio>
</wd-radio-group>`,

    script: `import { ref } from 'vue'

const priorityValue = ref(1)`,
  },

  // 应用场景代码
  scenarios: {
    paymentTemplate: `<!-- 支付方式选择 -->
<view class="mx-4 rounded-lg bg-gray-50 p-4">
  <wd-radio-group v-model="paymentMethod" :options="paymentMethodOptions" />
  <view class="mt-3 text-xs text-gray-500">
    当前选择：{{ getPaymentMethodName() }}
  </view>
</view>`,

    productTemplate: `<!-- 商品规格选择 -->
<view class="mx-4 rounded-lg bg-gray-50 p-4 space-y-3">
  <view>
    <view class="mb-2 text-xs text-gray-600">颜色</view>
    <wd-radio-group v-model="productColor" :options="colorOptions" shape="button" item-width="25%" />
  </view>
  <view>
    <view class="mb-2 text-xs text-gray-600">尺寸</view>
    <wd-radio-group v-model="productSize" :options="sizeOptions" shape="button" item-width="20%" />
  </view>
  <view class="text-xs text-gray-500">
    已选：{{ getProductSpecName() }}
  </view>
</view>`,

    ratingTemplate: `<!-- 评分选择 -->
<view class="mx-4 rounded-lg bg-gray-50 p-4">
  <wd-radio-group v-model="rating" :options="ratingOptions" inline shape="dot" checked-color="#faad14" />
  <view class="mt-3 text-xs text-gray-500">
    当前评分：{{ rating }} 星
  </view>
</view>`,

    script: `// 应用场景数据
const paymentMethod = ref('wechat')
const productColor = ref('red')
const productSize = ref('M')
const rating = ref(5)

const paymentMethodOptions = ref([
  { value: 'alipay', label: '支付宝' },
  { value: 'wechat', label: '微信支付' },
  { value: 'apple', label: 'Apple Pay' },
  { value: 'bank', label: '银行卡支付' },
])

const colorOptions = ref([
  { value: 'red', label: '红色' },
  { value: 'blue', label: '蓝色' },
  { value: 'green', label: '绿色' },
  { value: 'black', label: '黑色' },
])

const sizeOptions = ref([
  { value: 'XS', label: 'XS' },
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
])

const ratingOptions = ref([
  { value: 1, label: '1星' },
  { value: 2, label: '2星' },
  { value: 3, label: '3星' },
  { value: 4, label: '4星' },
  { value: 5, label: '5星' },
])

/**
 * 获取支付方式名称
 */
const getPaymentMethodName = () => {
  const method = paymentMethodOptions.value.find(item => item.value === paymentMethod.value)
  return method ? method.label : '未选择'
}

/**
 * 获取商品规格名称
 */
const getProductSpecName = () => {
  const color = colorOptions.value.find(item => item.value === productColor.value)?.label || '未选择'
  const size = sizeOptions.value.find(item => item.value === productSize.value)?.label || '未选择'
  return \`\${color} / \${size}\`
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'model-value',
    type: 'String | Number | Boolean',
    default: '""',
    desc: '当前选中的值',
  },
  {
    name: 'options',
    type: 'Array<RadioOption>',
    default: '[]',
    desc: '单选项配置列表，使用 options 模式时传入',
  },
  {
    name: 'shape',
    type: 'String',
    default: '"check"',
    desc: '单选框形状：check / dot / button',
  },
  {
    name: 'checked-color',
    type: 'String',
    default: '"#4D80F0"',
    desc: '选中时的颜色',
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
    default: '""',
    desc: '设置大小，可选值：large',
  },
  {
    name: 'inline',
    type: 'Boolean',
    default: 'false',
    desc: '是否内联布局',
  },
  {
    name: 'icon-placement',
    type: 'String',
    default: '"auto"',
    desc: '图标位置：left / right / auto',
  },
  {
    name: 'item-width',
    type: 'String',
    default: '""',
    desc: '每个单选框的宽度，支持百分比或固定值',
  },
  {
    name: 'label',
    type: 'String',
    default: '""',
    desc: '表单模式下的左侧标题',
  },
  {
    name: 'label-width',
    type: 'String | Number',
    default: '""',
    desc: '表单模式下的标题宽度',
  },
  {
    name: 'prefix-icon',
    type: 'String',
    default: '""',
    desc: '表单模式下的前置图标',
  },
  {
    name: 'center',
    type: 'Boolean',
    default: 'false',
    desc: '表单模式下是否垂直居中',
  },
  {
    name: 'vertical',
    type: 'Boolean',
    default: 'false',
    desc: '表单模式下是否上下结构',
  },
  {
    name: 'required',
    type: 'Boolean',
    default: 'false',
    desc: '是否必填',
  },
  {
    name: 'prop',
    type: 'String',
    default: '""',
    desc: '表单域 model 字段名',
  },
  {
    name: 'rules',
    type: 'Array<FormItemRule>',
    default: '[]',
    desc: '表单验证规则',
  },
  {
    name: 'no-border',
    type: 'Boolean',
    default: 'false',
    desc: '是否隐藏下划线',
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

// Methods 方法文档（Radio 组件没有暴露方法）
const apiMethods: any[] = []

// Events 事件文档
const apiEvents = [
  {
    name: 'update:modelValue',
    desc: 'v-model 更新事件，参数为当前选中的值',
  },
  {
    name: 'change',
    desc: '值变化时触发，参数为当前选中的值',
  },
]

// ===== 事件处理方法 =====

/**
 * 基本用法变化处理
 * @param value 选中的值
 */
const handleBasicChange = (value: string | number | boolean) => {
  console.log('基本用法选中值：', value)
}

// ===== 工具方法 =====

/**
 * 获取支付方式名称
 * @returns 支付方式名称
 */
const getPaymentMethodName = (): string => {
  const method = paymentMethodOptions.value.find(item => item.value === paymentMethod.value)
  return method ? method.label : '未选择'
}

/**
 * 获取商品规格名称
 * @returns 商品规格名称
 */
const getProductSpecName = (): string => {
  const color = colorOptions.value.find(item => item.value === productColor.value)?.label || '未选择'
  const size = sizeOptions.value.find(item => item.value === productSize.value)?.label || '未选择'
  return `${color} / ${size}`
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
