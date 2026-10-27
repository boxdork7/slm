<!-- ColPicker 列选择器 http://127.0.0.1:100/#/pages-sub/demo/wd/col-picker -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="ColPicker 列选择器" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="内置中国省市区数据，开箱即用">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="当前选中值" :value="JSON.stringify(basicValue)" />
        <wd-cell title="显示文本" :value="basicDisplayText" />
      </wd-cell-group>

      <view class="mt-4">
        <wd-cell-group border>
          <!-- 内置省市区数据 -->
          <wd-col-picker
            v-model="basicValue"
            label="省市区选择"
            placeholder="请选择省市区"
            @confirm="handleBasicConfirm"
          />

          <!-- 自动补全数据 -->
          <wd-col-picker
            v-model="autoCompleteValue"
            label="自动补全"
            auto-complete
            placeholder="支持自动补全数据"
            @confirm="handleAutoCompleteConfirm"
          />
        </wd-cell-group>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基本用法" :code="codes.basic.template" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 自定义数据示例 -->
    <DemoSection title="自定义数据" desc="使用自定义数据源，支持无限级联动">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="类目选择结果" :value="categoryDisplayText" />
        <wd-cell title="地区选择结果" :value="regionDisplayText" />
      </wd-cell-group>

      <view class="mt-4">
        <wd-cell-group border>
          <!-- 商品类目选择 -->
          <wd-col-picker
            v-model="categoryValue"
            label="商品类目"
            :columns="categoryColumns"
            :column-change="handleCategoryChange"
            placeholder="请选择商品类目"
            @confirm="handleCategoryConfirm"
          />

          <!-- 带提示信息的地区选择 -->
          <wd-col-picker
            v-model="regionValue"
            label="配送地区"
            :columns="regionColumns"
            :column-change="handleRegionChange"
            placeholder="请选择配送地区"
            @confirm="handleRegionConfirm"
          />

          <!-- 包含禁用选项 -->
          <wd-col-picker
            v-model="disabledValue"
            label="含禁用项"
            :columns="disabledColumns"
            :column-change="handleDisabledChange"
            placeholder="部分选项不可选"
            @confirm="handleDisabledConfirm"
          />
        </wd-cell-group>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 自定义数据" :code="codes.custom.template" />
        <DemoCode title="脚本 - 自定义数据" :code="codes.custom.script" />
      </template>
    </DemoSection>

    <!-- 格式化与校验示例 -->
    <DemoSection title="格式化与校验" desc="自定义显示格式和确认前校验">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="格式化结果" :value="formatDisplayText" />
        <wd-cell title="校验状态" :value="validateStatus" />
      </wd-cell-group>

      <view class="mt-4">
        <wd-cell-group border>
          <!-- 自定义显示格式 -->
          <wd-col-picker
            v-model="formatValue"
            label="格式化显示"
            :display-format="customDisplayFormat"
            placeholder="显示格式：省份-城市"
            @confirm="handleFormatConfirm"
          />

          <!-- 确认前校验 -->
          <wd-col-picker
            v-model="validateValue"
            label="校验选择"
            :before-confirm="beforeConfirm"
            placeholder="某些地区不可配送"
            @confirm="handleValidateConfirm"
          />
        </wd-cell-group>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 格式化显示" :code="codes.format.formatTemplate" />
        <DemoCode title="模板 - 确认前校验" :code="codes.format.validateTemplate" />
        <DemoCode title="脚本 - 格式化与校验" :code="codes.format.script" />
      </template>
    </DemoSection>

    <!-- 样式配置示例 -->
    <DemoSection title="样式配置" desc="不同的样式和交互配置选项">
      <view class="space-y-4">
        <wd-cell-group border>
          <!-- 禁用状态 -->
          <wd-col-picker
            v-model="disabledStateValue"
            label="禁用状态"
            disabled
            placeholder="不可操作"
          />

          <!-- 只读状态 -->
          <wd-col-picker
            v-model="readonlyStateValue"
            label="只读状态"
            readonly
            placeholder="只读展示"
          />

          <!-- 错误状态 -->
          <wd-col-picker
            v-model="errorStateValue"
            label="错误状态"
            error
            placeholder="错误状态显示"
            @confirm="handleErrorStateConfirm"
          />

          <!-- 必填字段 -->
          <wd-col-picker
            v-model="requiredValue"
            label="必填字段"
            required
            placeholder="必填项显示星号"
            @confirm="handleRequiredConfirm"
          />
        </wd-cell-group>

        <wd-cell-group border>
          <!-- 带标题弹窗 -->
          <wd-col-picker
            v-model="titleValue"
            label="自定义标题"
            title="请选择您的地址"
            placeholder="弹窗显示自定义标题"
            @confirm="handleTitleConfirm"
          />

          <!-- 右对齐显示 -->
          <wd-col-picker
            v-model="alignRightValue"
            label="右对齐"
            align-right
            placeholder="值靠右显示"
            @confirm="handleAlignRightConfirm"
          />

          <!-- 大尺寸样式 -->
          <wd-col-picker
            v-model="largeSizeValue"
            label="大尺寸"
            size="large"
            placeholder="更大的字体和间距"
            @confirm="handleLargeSizeConfirm"
          />
        </wd-cell-group>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 状态配置" :code="codes.style.stateTemplate" />
        <DemoCode title="模板 - 样式配置" :code="codes.style.styleTemplate" />
        <DemoCode title="脚本 - 样式配置" :code="codes.style.script" />
      </template>
    </DemoSection>

    <!-- 异步加载示例 -->
    <DemoSection title="异步加载" desc="模拟真实场景中的异步数据加载">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="异步加载状态" :value="asyncLoadingStatus" />
        <wd-cell title="加载次数" :value="`${asyncLoadCount} 次`" />
        <wd-cell title="成功率统计" :value="`${asyncSuccessCount}/${asyncLoadCount}`" />
      </wd-cell-group>

      <view class="mt-4">
        <wd-cell-group border>
          <!-- 正常异步加载 -->
          <wd-col-picker
            v-model="asyncSuccessValue"
            label="异步加载"
            :columns="asyncSuccessColumns"
            :column-change="handleAsyncSuccess"
            placeholder="数据异步加载中..."
            @confirm="handleAsyncSuccessConfirm"
          />

          <!-- 模拟加载失败 -->
          <wd-col-picker
            v-model="asyncFailValue"
            label="模拟失败"
            :columns="asyncFailColumns"
            :column-change="handleAsyncFail"
            placeholder="30%概率加载失败"
            @confirm="handleAsyncFailConfirm"
          />
        </wd-cell-group>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 异步加载" :code="codes.async.template" />
        <DemoCode title="脚本 - 异步加载" :code="codes.async.script" />
      </template>
    </DemoSection>

    <!-- 高级用法示例 -->
    <DemoSection title="高级用法" desc="自定义触发器和复杂数据联动">
      <view class="space-y-6">
        <!-- 无标签样式 -->
        <view>
          <view class="mb-3 text-sm text-gray-700 font-medium">无标签样式</view>
          <wd-col-picker
            v-model="noLabelValue"
            placeholder="没有左侧标签"
            @confirm="handleNoLabelConfirm"
          />
        </view>

        <!-- 自定义触发器 -->
        <view>
          <view class="mb-3 text-sm text-gray-700 font-medium">自定义触发器</view>
          <view class="mb-2 text-xs text-gray-500">使用自定义的触发元素</view>
          <wd-col-picker
            v-model="customTriggerValue"
            use-default-slot
            class="inline-block"
            @confirm="handleCustomTriggerConfirm"
          >
            <wd-button type="primary" :plain="true">
              <wd-icon name="location-o" class="mr-1" />
              {{ customTriggerText || '选择地址' }}
            </wd-button>
          </wd-col-picker>
        </view>

        <!-- 多级联动演示 -->
        <view>
          <view class="mb-3 text-sm text-gray-700 font-medium">行业分类联动</view>
          <view class="mb-2 text-xs text-gray-500">演示复杂的多级数据联动</view>
          <wd-cell-group border>
            <wd-col-picker
              v-model="industryValue"
              label="行业分类"
              :columns="industryColumns"
              :column-change="handleIndustryChange"
              placeholder="选择所属行业"
              @confirm="handleIndustryConfirm"
            />
          </wd-cell-group>
        </view>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 无标签样式" :code="codes.advanced.noLabelTemplate" />
        <DemoCode title="模板 - 自定义触发器" :code="codes.advanced.customTriggerTemplate" />
        <DemoCode title="模板 - 多级联动" :code="codes.advanced.cascadeTemplate" />
        <DemoCode title="脚本 - 高级用法" :code="codes.advanced.script" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ColPickerColumnChange } from '@/wd/components/wd-col-picker/wd-col-picker.vue'

// ===== 组件状态管理 =====

// 基本用法数据
const basicValue = ref<(string | number)[]>([])
const autoCompleteValue = ref<(string | number)[]>(['150000', '150100', '150121']) // 内蒙古-呼和浩特市-土默特左旗

// 自定义数据
const categoryValue = ref<(string | number)[]>([])
const regionValue = ref<(string | number)[]>([])
const disabledValue = ref<(string | number)[]>([])

// 格式化与校验
const formatValue = ref<(string | number)[]>(['130000', '130200', '130204']) // 河北-唐山-开平区
const validateValue = ref<(string | number)[]>([])
const validateStatus = ref<string>('待验证')

// 样式配置
const disabledStateValue = ref<(string | number)[]>(['110000', '110100', '110101']) // 北京
const readonlyStateValue = ref<(string | number)[]>(['310000', '310100', '310101']) // 上海
const errorStateValue = ref<(string | number)[]>([])
const requiredValue = ref<(string | number)[]>([])
const titleValue = ref<(string | number)[]>([])
const alignRightValue = ref<(string | number)[]>([])
const largeSizeValue = ref<(string | number)[]>([])

// 异步加载
const asyncSuccessValue = ref<(string | number)[]>([])
const asyncFailValue = ref<(string | number)[]>([])
const asyncLoadingStatus = ref<string>('待加载')
const asyncLoadCount = ref<number>(0)
const asyncSuccessCount = ref<number>(0)

// 高级用法
const noLabelValue = ref<(string | number)[]>([])
const customTriggerValue = ref<(string | number)[]>([])
const customTriggerText = ref<string>('')
const industryValue = ref<(string | number)[]>([])

// ===== 数据源定义 =====

// 商品类目数据
const categoryColumns = ref<any[][]>([
  [
    { value: 'electronics', label: '电子产品' },
    { value: 'clothing', label: '服装服饰' },
    { value: 'books', label: '图书音像' },
    { value: 'sports', label: '运动户外' },
    { value: 'home', label: '家居用品' },
  ],
])

// 配送地区数据（带提示信息）
const regionColumns = ref<any[][]>([
  [
    { value: 'bj', label: '北京市', tip: '免邮地区' },
    { value: 'sh', label: '上海市', tip: '免邮地区' },
    { value: 'gz', label: '广州市', tip: '免邮地区' },
    { value: 'sz', label: '深圳市', tip: '免邮地区' },
    { value: 'remote', label: '偏远地区', disabled: true, tip: '暂不支持配送' },
  ],
])

// 包含禁用选项的数据
const disabledColumns = ref<any[][]>([
  [
    { value: 'option1', label: '正常选项1' },
    { value: 'option2', label: '正常选项2' },
    { value: 'option3', label: '禁用选项', disabled: true },
    { value: 'option4', label: '正常选项3' },
  ],
])

// 异步加载数据源
const asyncSuccessColumns = ref<any[][]>([
  [
    { value: 'cat1', label: '分类一' },
    { value: 'cat2', label: '分类二' },
    { value: 'cat3', label: '分类三' },
  ],
])

const asyncFailColumns = ref<any[][]>([
  [
    { value: 'type1', label: '类型A' },
    { value: 'type2', label: '类型B' },
    { value: 'type3', label: '类型C' },
  ],
])

// 行业分类数据
const industryColumns = ref<any[][]>([
  [
    { value: 'tech', label: '科技互联网' },
    { value: 'finance', label: '金融服务' },
    { value: 'education', label: '教育培训' },
    { value: 'healthcare', label: '医疗健康' },
    { value: 'retail', label: '零售电商' },
  ],
])

// 模拟异步数据
const mockAsyncData: Record<string, any[]> = {
  electronics: [
    { value: 'phone', label: '手机通讯' },
    { value: 'computer', label: '电脑办公' },
    { value: 'camera', label: '摄影摄像' },
  ],
  clothing: [
    { value: 'men', label: '男装' },
    { value: 'women', label: '女装' },
    { value: 'shoes', label: '鞋靴' },
  ],
  books: [
    { value: 'fiction', label: '小说文学' },
    { value: 'tech', label: '科技类' },
    { value: 'edu', label: '教育类' },
  ],
  sports: [
    { value: 'outdoor', label: '户外运动' },
    { value: 'fitness', label: '健身器材' },
    { value: 'ball', label: '球类运动' },
  ],
  home: [
    { value: 'furniture', label: '家具' },
    { value: 'decoration', label: '家装' },
    { value: 'appliance', label: '家电' },
  ],
  cat1: [
    { value: 'sub1', label: '子分类1-1' },
    { value: 'sub2', label: '子分类1-2' },
  ],
  cat2: [
    { value: 'sub3', label: '子分类2-1' },
    { value: 'sub4', label: '子分类2-2' },
  ],
  cat3: [
    { value: 'sub5', label: '子分类3-1' },
    { value: 'sub6', label: '子分类3-2' },
  ],
  type1: [
    { value: 'item1', label: '项目A-1' },
    { value: 'item2', label: '项目A-2' },
  ],
  type2: [
    { value: 'item3', label: '项目B-1' },
    { value: 'item4', label: '项目B-2' },
  ],
  tech: [
    { value: 'ai', label: '人工智能' },
    { value: 'blockchain', label: '区块链' },
    { value: 'cloud', label: '云计算' },
  ],
  finance: [
    { value: 'banking', label: '银行业务' },
    { value: 'insurance', label: '保险服务' },
    { value: 'investment', label: '投资理财' },
  ],
  education: [
    { value: 'k12', label: 'K12教育' },
    { value: 'higher', label: '高等教育' },
    { value: 'vocational', label: '职业培训' },
  ],
}

// ===== 计算属性 =====

/**
 * 基本用法显示文本
 */
const basicDisplayText = computed(() => {
  return basicValue.value.length > 0 ? '已选择地区' : '未选择'
})

/**
 * 获取显示文本
 */
const getDisplayText = (values: (string | number)[], columns: any[][]): string => {
  if (values.length === 0 || columns.length === 0) return '未选择'

  const texts = values.map((value, index) => {
    if (columns[index]) {
      const item = columns[index].find((item) => item.value === value)
      return item ? item.label : value
    }
    return value
  })

  return texts.join(' > ')
}

/**
 * 类目选择显示文本
 */
const categoryDisplayText = computed(() => {
  return categoryValue.value.length > 0
    ? getDisplayText(categoryValue.value, categoryColumns.value)
    : '未选择'
})

/**
 * 地区选择显示文本
 */
const regionDisplayText = computed(() => {
  return regionValue.value.length > 0
    ? getDisplayText(regionValue.value, regionColumns.value)
    : '未选择'
})

/**
 * 格式化显示文本
 */
const formatDisplayText = computed(() => {
  return formatValue.value.length > 0 ? '已格式化显示' : '未选择'
})

// ===== 工具方法 =====

/**
 * 休眠函数
 */
const sleep = (ms: number = 1000): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    template: `<!-- 内置省市区数据 -->
<wd-col-picker
  v-model="basicValue"
  label="省市区选择"
  placeholder="请选择省市区"
  @confirm="handleBasicConfirm"
/>

<!-- 自动补全数据 -->
<wd-col-picker
  v-model="autoCompleteValue"
  label="自动补全"
  auto-complete
  placeholder="支持自动补全数据"
  @confirm="handleAutoCompleteConfirm"
/>`,

    script: `import { ref } from 'vue'

const basicValue = ref([])
const autoCompleteValue = ref(['150000', '150100', '150121']) // 内蒙古-呼和浩特市-土默特左旗

const handleBasicConfirm = ({ value, selectedItems }) => {
  console.log('基本选择：', value)
  console.log('选中项：', selectedItems.map(item => item.label).join(' > '))
}

const handleAutoCompleteConfirm = ({ value, selectedItems }) => {
  console.log('自动补全选择：', value)
  console.log('选中项：', selectedItems.map(item => item.label).join(' > '))
}`,
  },

  // 自定义数据代码
  custom: {
    template: `<!-- 商品类目选择 -->
<wd-col-picker
  v-model="categoryValue"
  label="商品类目"
  :columns="categoryColumns"
  :column-change="handleCategoryChange"
  placeholder="请选择商品类目"
  @confirm="handleCategoryConfirm"
/>

<!-- 带提示信息的地区选择 -->
<wd-col-picker
  v-model="regionValue"
  label="配送地区"
  :columns="regionColumns"
  :column-change="handleRegionChange"
  placeholder="请选择配送地区"
  @confirm="handleRegionConfirm"
/>

<!-- 包含禁用选项 -->
<wd-col-picker
  v-model="disabledValue"
  label="含禁用项"
  :columns="disabledColumns"
  placeholder="部分选项不可选"
  @confirm="handleDisabledConfirm"
/>`,

    script: `const categoryColumns = ref([
  [
    { value: 'electronics', label: '电子产品' },
    { value: 'clothing', label: '服装服饰' },
    { value: 'books', label: '图书音像' },
    { value: 'sports', label: '运动户外' },
  ],
])

const disabledColumns = ref([
  [
    { value: 'option1', label: '正常选项1' },
    { value: 'option2', label: '正常选项2' },
    { value: 'option3', label: '禁用选项', disabled: true },
    { value: 'option4', label: '正常选项3' },
  ],
])

const handleCategoryChange = ({ selectedItem, resolve, finish }) => {
  const childData = mockAsyncData[selectedItem.value]
  if (childData && childData.length) {
    resolve(childData)
  } else {
    finish()
  }
}

const handleDisabledChange = ({ selectedItem, resolve, finish }) => {
  // 这是单列选择，没有下级数据，直接完成选择
  finish()
}`,
  },

  // 格式化与校验代码
  format: {
    formatTemplate: `<!-- 自定义显示格式 -->
<wd-col-picker
  v-model="formatValue"
  label="格式化显示"
  :display-format="customDisplayFormat"
  placeholder="显示格式：省份-城市"
  @confirm="handleFormatConfirm"
/>`,

    validateTemplate: `<!-- 确认前校验 -->
<wd-col-picker
  v-model="validateValue"
  label="校验选择"
  :before-confirm="beforeConfirm"
  placeholder="某些地区不可配送"
  @confirm="handleValidateConfirm"
/>`,

    script: `const formatValue = ref(['130000', '130200', '130204']) // 河北-唐山-开平区
const validateValue = ref([])
const validateStatus = ref('待验证')

// 自定义显示格式
const customDisplayFormat = (selectedItems) => {
  if (selectedItems.length >= 2) {
    return \`\${selectedItems[selectedItems.length - 2].label}-\${selectedItems[selectedItems.length - 1].label}\`
  }
  return selectedItems.map(item => item.label).join('-')
}

// 确认前校验
const beforeConfirm = (value, selectedItems, resolve) => {
  validateStatus.value = '校验中...'

  // 模拟某些地区不可选择的业务逻辑
  if (value.length > 2 && String(value[2]).includes('120000')) {
    validateStatus.value = '校验失败：该地区不支持配送'
    resolve(false)
  } else {
    validateStatus.value = '校验通过'
    resolve(true)
  }
}`,
  },

  // 样式配置代码
  style: {
    stateTemplate: `<!-- 禁用状态 -->
<wd-col-picker
  v-model="disabledStateValue"
  label="禁用状态"
  disabled
  placeholder="不可操作"
/>

<!-- 只读状态 -->
<wd-col-picker
  v-model="readonlyStateValue"
  label="只读状态"
  readonly
  placeholder="只读展示"
/>

<!-- 错误状态 -->
<wd-col-picker
  v-model="errorStateValue"
  label="错误状态"
  error
  placeholder="错误状态显示"
/>

<!-- 必填字段 -->
<wd-col-picker
  v-model="requiredValue"
  label="必填字段"
  required
  placeholder="必填项显示星号"
/>`,

    styleTemplate: `<!-- 带标题弹窗 -->
<wd-col-picker
  v-model="titleValue"
  label="自定义标题"
  title="请选择您的地址"
  placeholder="弹窗显示自定义标题"
/>

<!-- 右对齐显示 -->
<wd-col-picker
  v-model="alignRightValue"
  label="右对齐"
  align-right
  placeholder="值靠右显示"
/>

<!-- 大尺寸样式 -->
<wd-col-picker
  v-model="largeSizeValue"
  label="大尺寸"
  size="large"
  placeholder="更大的字体和间距"
/>`,

    script: `const disabledStateValue = ref(['110000', '110100', '110101']) // 北京
const readonlyStateValue = ref(['310000', '310100', '310101']) // 上海
const errorStateValue = ref([])
const requiredValue = ref([])
const titleValue = ref([])
const alignRightValue = ref([])
const largeSizeValue = ref([])`,
  },

  // 异步加载代码
  async: {
    template: `<!-- 正常异步加载 -->
<wd-col-picker
  v-model="asyncSuccessValue"
  label="异步加载"
  :columns="asyncSuccessColumns"
  :column-change="handleAsyncSuccess"
  placeholder="数据异步加载中..."
  @confirm="handleAsyncSuccessConfirm"
/>

<!-- 模拟加载失败 -->
<wd-col-picker
  v-model="asyncFailValue"
  label="模拟失败"
  :columns="asyncFailColumns"
  :column-change="handleAsyncFail"
  placeholder="30%概率加载失败"
  @confirm="handleAsyncFailConfirm"
/>`,

    script: `const asyncSuccessValue = ref([])
const asyncFailValue = ref([])
const asyncLoadingStatus = ref('待加载')
const asyncLoadCount = ref(0)
const asyncSuccessCount = ref(0)

const handleAsyncSuccess = ({ selectedItem, resolve, finish }) => {
  asyncLoadingStatus.value = '加载中...'
  asyncLoadCount.value++

  setTimeout(() => {
    const childData = mockAsyncData[selectedItem.value]
    if (childData && childData.length) {
      resolve(childData)
      asyncLoadingStatus.value = '加载成功'
      asyncSuccessCount.value++
    } else {
      finish()
      asyncLoadingStatus.value = '加载完成'
      asyncSuccessCount.value++
    }
  }, 1000) // 模拟网络延迟
}

const handleAsyncFail = ({ selectedItem, resolve, finish }) => {
  asyncLoadingStatus.value = '加载中...'
  asyncLoadCount.value++

  setTimeout(() => {
    if (Math.random() > 0.3) {
      // 70% 成功率
      const childData = mockAsyncData[selectedItem.value]
      if (childData && childData.length) {
        resolve(childData)
        asyncLoadingStatus.value = '加载成功'
        asyncSuccessCount.value++
      } else {
        finish()
        asyncLoadingStatus.value = '加载完成'
        asyncSuccessCount.value++
      }
    } else {
      finish(false)
      asyncLoadingStatus.value = '加载失败'
    }
  }, 800)
}`,
  },

  // 高级用法代码
  advanced: {
    noLabelTemplate: `<!-- 无标签样式 -->
<wd-col-picker
  v-model="noLabelValue"
  placeholder="没有左侧标签"
  @confirm="handleNoLabelConfirm"
/>`,

    customTriggerTemplate: `<!-- 自定义触发器 -->
<wd-col-picker
  v-model="customTriggerValue"
  use-default-slot
  class="inline-block"
  @confirm="handleCustomTriggerConfirm"
>
  <wd-button type="primary" :plain="true">
    <wd-icon name="location-o" class="mr-1" />
    {{ customTriggerText || '选择地址' }}
  </wd-button>
</wd-col-picker>`,

    cascadeTemplate: `<!-- 多级联动演示 -->
<wd-col-picker
  v-model="industryValue"
  label="行业分类"
  :columns="industryColumns"
  :column-change="handleIndustryChange"
  placeholder="选择所属行业"
  @confirm="handleIndustryConfirm"
/>`,

    script: `const noLabelValue = ref([])
const customTriggerValue = ref([])
const customTriggerText = ref('')
const industryValue = ref([])

const handleCustomTriggerConfirm = ({ selectedItems }) => {
  customTriggerText.value = selectedItems.map(item => item.label).join('')
  console.log('自定义触发器选择：', customTriggerText.value)
}

const handleIndustryChange = ({ selectedItem, resolve, finish }) => {
  const childData = mockAsyncData[selectedItem.value]
  if (childData && childData.length) {
    resolve(childData)
  } else {
    finish()
  }
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'model-value',
    type: 'Array',
    default: '[]',
    desc: '选中项，数组格式，每个元素对应一列的选中值',
  },
  {
    name: 'columns',
    type: 'Array',
    default: '[]',
    desc: '选择器数据，二维数组。如果为空则使用内置省市区数据',
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
    default: '""',
    desc: '选择器占位符',
  },
  {
    name: 'title',
    type: 'String',
    default: '""',
    desc: '弹出层标题',
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
    name: 'required',
    type: 'Boolean',
    default: 'false',
    desc: '是否必填',
  },
  {
    name: 'error',
    type: 'Boolean',
    default: 'false',
    desc: '是否为错误状态',
  },
  {
    name: 'align-right',
    type: 'Boolean',
    default: 'false',
    desc: '选择器的值是否靠右展示',
  },
  {
    name: 'size',
    type: 'String',
    default: '""',
    desc: '设置选择器大小，可选值：large',
  },
  {
    name: 'auto-complete',
    type: 'Boolean',
    default: 'false',
    desc: '自动触发 column-change 事件来补全数据',
  },
  {
    name: 'column-change',
    type: 'Function',
    default: '—',
    desc: '接收当前列的选中项等参数，返回下一列数据',
  },
  {
    name: 'display-format',
    type: 'Function',
    default: '—',
    desc: '自定义展示文案的格式化函数',
  },
  {
    name: 'before-confirm',
    type: 'Function',
    default: '—',
    desc: '确定前校验函数，接收 (value, selectedItems, resolve) 参数',
  },
  {
    name: 'value-key',
    type: 'String',
    default: '"value"',
    desc: '选项对象中，value 对应的 key',
  },
  {
    name: 'label-key',
    type: 'String',
    default: '"label"',
    desc: '选项对象中，展示的文本对应的 key',
  },
  {
    name: 'tip-key',
    type: 'String',
    default: '"tip"',
    desc: '选项对象中，提示文案对应的 key',
  },
  {
    name: 'use-default-slot',
    type: 'Boolean',
    default: 'false',
    desc: '使用默认插槽时设置该选项',
  },
  {
    name: 'close-on-click-modal',
    type: 'Boolean',
    default: 'true',
    desc: '点击遮罩是否关闭',
  },
]

// Methods 方法文档
const apiMethods = [
  {
    name: 'open()',
    desc: '打开选择器弹框',
  },
  {
    name: 'close()',
    desc: '关闭选择器弹框',
  },
]

// Events 事件文档
const apiEvents = [
  {
    name: 'confirm',
    desc: '确认选择时触发，参数：{ value: 选中值数组, selectedItems: 选中项数组 }',
  },
  {
    name: 'close',
    desc: '关闭选择器时触发',
  },
  {
    name: 'update:modelValue',
    desc: '选中值变化时触发，参数：选中值数组',
  },
]

// ===== 事件处理方法 =====

/**
 * 基本用法确认处理
 */
const handleBasicConfirm = ({ value, selectedItems }: any) => {
  console.log('基本选择：', value)
  console.log('选中项：', selectedItems.map((item: any) => item.label).join(' > '))
}

/**
 * 自动补全确认处理
 */
const handleAutoCompleteConfirm = ({ value, selectedItems }: any) => {
  console.log('自动补全选择：', value)
  console.log('选中项：', selectedItems.map((item: any) => item.label).join(' > '))
}

/**
 * 商品类目变化处理
 */
const handleCategoryChange: ColPickerColumnChange = ({ selectedItem, resolve, finish }) => {
  console.log(`选择了类目：${selectedItem.label}`)
  const childData = mockAsyncData[selectedItem.value]
  if (childData && childData.length) {
    resolve(childData)
  } else {
    finish()
  }
}

/**
 * 商品类目确认处理
 */
const handleCategoryConfirm = ({ value, selectedItems }: any) => {
  console.log('类目选择：', selectedItems.map((item: any) => item.label).join(' > '))
}

/**
 * 配送地区变化处理
 */
const handleRegionChange: ColPickerColumnChange = ({ selectedItem, resolve, finish }) => {
  console.log(`选择了地区：${selectedItem.label}`)
  // 该地区没有下级，直接完成选择
  finish()
}

/**
 * 配送地区确认处理
 */
const handleRegionConfirm = ({ value, selectedItems }: any) => {
  console.log('地区选择：', selectedItems.map((item: any) => item.label).join(' > '))
}

/**
 * 禁用选项变化处理
 */
const handleDisabledChange: ColPickerColumnChange = ({ selectedItem, resolve, finish }) => {
  console.log(`选择了选项：${selectedItem.label}`)
  // 这是单列选择，没有下级数据，直接完成选择
  finish()
}

/**
 * 禁用选项确认处理
 */
const handleDisabledConfirm = ({ value, selectedItems }: any) => {
  console.log('禁用选项选择：', selectedItems.map((item: any) => item.label).join(' > '))
}

/**
 * 自定义显示格式
 */
const customDisplayFormat = (selectedItems: Record<string, any>[]): string => {
  if (selectedItems.length >= 2) {
    return `${selectedItems[selectedItems.length - 2].label}-${selectedItems[selectedItems.length - 1].label}`
  }
  return selectedItems.map((item) => item.label).join('-')
}

/**
 * 格式化确认处理
 */
const handleFormatConfirm = ({ value, selectedItems }: any) => {
  console.log('格式化选择：', selectedItems.map((item: any) => item.label).join(' > '))
}

/**
 * 确认前校验
 */
const beforeConfirm = (
  value: (string | number)[],
  selectedItems: Record<string, any>[],
  resolve: (isPass: boolean) => void,
) => {
  validateStatus.value = '校验中...'

  // 模拟某些地区不可选择的业务逻辑
  if (value.length > 2 && String(value[2]).includes('120000')) {
    validateStatus.value = '校验失败：该地区不支持配送'
    resolve(false)
  } else {
    validateStatus.value = '校验通过'
    resolve(true)
  }
}

/**
 * 校验确认处理
 */
const handleValidateConfirm = ({ value, selectedItems }: any) => {
  console.log('校验选择：', selectedItems.map((item: any) => item.label).join(' > '))
}

/**
 * 错误状态确认处理
 */
const handleErrorStateConfirm = ({ value, selectedItems }: any) => {
  console.log('错误状态选择：', selectedItems.map((item: any) => item.label).join(' > '))
}

/**
 * 必填字段确认处理
 */
const handleRequiredConfirm = ({ value, selectedItems }: any) => {
  console.log('必填字段选择：', selectedItems.map((item: any) => item.label).join(' > '))
}

/**
 * 自定义标题确认处理
 */
const handleTitleConfirm = ({ value, selectedItems }: any) => {
  console.log('自定义标题选择：', selectedItems.map((item: any) => item.label).join(' > '))
}

/**
 * 右对齐确认处理
 */
const handleAlignRightConfirm = ({ value, selectedItems }: any) => {
  console.log('右对齐选择：', selectedItems.map((item: any) => item.label).join(' > '))
}

/**
 * 大尺寸确认处理
 */
const handleLargeSizeConfirm = ({ value, selectedItems }: any) => {
  console.log('大尺寸选择：', selectedItems.map((item: any) => item.label).join(' > '))
}

/**
 * 异步加载成功处理
 */
const handleAsyncSuccess: ColPickerColumnChange = ({ selectedItem, resolve, finish }) => {
  asyncLoadingStatus.value = '加载中...'
  asyncLoadCount.value++

  setTimeout(() => {
    const childData = mockAsyncData[selectedItem.value]
    if (childData && childData.length) {
      resolve(childData)
      asyncLoadingStatus.value = '加载成功'
      asyncSuccessCount.value++
    } else {
      finish()
      asyncLoadingStatus.value = '加载完成'
      asyncSuccessCount.value++
    }
  }, 1000) // 模拟网络延迟
}

/**
 * 异步加载成功确认处理
 */
const handleAsyncSuccessConfirm = ({ value, selectedItems }: any) => {
  console.log('异步加载选择：', selectedItems.map((item: any) => item.label).join(' > '))
}

/**
 * 异步加载失败处理
 */
const handleAsyncFail: ColPickerColumnChange = ({ selectedItem, resolve, finish }) => {
  asyncLoadingStatus.value = '加载中...'
  asyncLoadCount.value++

  setTimeout(() => {
    if (Math.random() > 0.3) {
      // 70% 成功率
      const childData = mockAsyncData[selectedItem.value]
      if (childData && childData.length) {
        resolve(childData)
        asyncLoadingStatus.value = '加载成功'
        asyncSuccessCount.value++
      } else {
        finish()
        asyncLoadingStatus.value = '加载完成'
        asyncSuccessCount.value++
      }
    } else {
      finish(false)
      asyncLoadingStatus.value = '加载失败'
    }
  }, 800)
}

/**
 * 异步加载失败确认处理
 */
const handleAsyncFailConfirm = ({ value, selectedItems }: any) => {
  console.log('异步失败选择：', selectedItems.map((item: any) => item.label).join(' > '))
}

/**
 * 无标签确认处理
 */
const handleNoLabelConfirm = ({ value, selectedItems }: any) => {
  console.log('无标签选择：', selectedItems.map((item: any) => item.label).join(' > '))
}

/**
 * 自定义触发器确认处理
 */
const handleCustomTriggerConfirm = ({ selectedItems }: any) => {
  customTriggerText.value = selectedItems.map((item: any) => item.label).join('')
  console.log('自定义触发器选择：', customTriggerText.value)
}

/**
 * 行业分类变化处理
 */
const handleIndustryChange: ColPickerColumnChange = ({ selectedItem, resolve, finish }) => {
  console.log(`选择了行业：${selectedItem.label}`)
  const childData = mockAsyncData[selectedItem.value]
  if (childData && childData.length) {
    resolve(childData)
  } else {
    finish()
  }
}

/**
 * 行业分类确认处理
 */
const handleIndustryConfirm = ({ value, selectedItems }: any) => {
  console.log('行业分类选择：', selectedItems.map((item: any) => item.label).join(' > '))
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
