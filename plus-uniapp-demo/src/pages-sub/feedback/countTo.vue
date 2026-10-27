<!-- CountTo 数字滚动 http://127.0.0.1:100/#/pages-sub/demo/wd/count-to -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="CountTo 数字滚动" show-back />
    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的数字滚动效果">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="年份显示">
          <wd-count-to :end-val="currentYear" suffix="年" color="#16baaa" />
        </wd-cell>

        <wd-cell title="金额显示">
          <wd-count-to
            prefix="￥"
            :decimals="2"
            :end-val="186.32"
            :font-size="32"
            color="#1e9fff"
          />
        </wd-cell>

        <wd-cell title="百分比显示">
          <wd-count-to :end-val="85.6" suffix="%" :font-size="28" color="#ff5722" />
        </wd-cell>

        <wd-cell title="自定义动画时长">
          <wd-count-to
            prefix="￥"
            :decimals="2"
            :end-val="21286.321"
            :font-size="24"
            suffix="%"
            color="#ffb800"
            :duration="2000"
          />
        </wd-cell>
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 年份显示" :code="codes.basic.yearTemplate" />
        <DemoCode title="模板 - 金额显示" :code="codes.basic.moneyTemplate" />
        <DemoCode title="模板 - 百分比显示" :code="codes.basic.percentTemplate" />
        <DemoCode title="模板 - 自定义动画时长" :code="codes.basic.durationTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 高级配置示例 -->
    <DemoSection title="高级配置" desc="更多配置选项和效果">
      <wd-cell-group>
        <wd-cell title="自定义起始值">
          <wd-count-to :start-val="1000" :end-val="5000" prefix="¥" color="#9c27b0" />
        </wd-cell>

        <wd-cell title="倒计时效果">
          <wd-count-to :start-val="100" :end-val="0" suffix="%" color="#e91e63" :duration="4000" />
        </wd-cell>

        <wd-cell title="线性动画">
          <wd-count-to :end-val="888" :use-easing="false" prefix="Level " color="#607d8b" />
        </wd-cell>

        <wd-cell title="自定义分隔符">
          <wd-count-to :end-val="1234567" separator=" " prefix="¥" color="#795548" />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 自定义起始值" :code="codes.advanced.startValTemplate" />
        <DemoCode title="模板 - 倒计时效果" :code="codes.advanced.countdownTemplate" />
        <DemoCode title="模板 - 线性动画" :code="codes.advanced.linearTemplate" />
        <DemoCode title="模板 - 自定义分隔符" :code="codes.advanced.separatorTemplate" />
        <DemoCode title="脚本 - 高级配置" :code="codes.advanced.script" />
      </template>
    </DemoSection>

    <!-- 主题样式示例 -->
    <DemoSection title="主题样式" desc="预设的主题颜色">
      <wd-cell-group>
        <wd-cell title="Primary 主要">
          <wd-count-to type="primary" prefix="￥" :end-val="888888" suffix="%" />
        </wd-cell>

        <wd-cell title="Success 成功">
          <wd-count-to type="success" prefix="￥" :end-val="888888" suffix="%" />
        </wd-cell>

        <wd-cell title="Warning 警告">
          <wd-count-to type="warning" prefix="￥" :end-val="888888" suffix="%" />
        </wd-cell>

        <wd-cell title="Error 错误">
          <wd-count-to type="error" prefix="￥" :end-val="888888" suffix="%" />
        </wd-cell>

        <wd-cell title="Default 默认">
          <wd-count-to prefix="￥" :end-val="888888" suffix="%" />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 主题样式" :code="codes.theme.template" />
        <DemoCode title="脚本 - 主题样式" :code="codes.theme.script" />
      </template>
    </DemoSection>

    <!-- 手动控制示例 -->
    <DemoSection title="手动控制" desc="通过方法控制动画的开始、暂停和重置">
      <!-- 控制示例区域 -->
      <view class="space-y-4">
        <!-- 可控制的数字显示 -->
        <wd-cell title="可控制的数字">
          <wd-count-to
            ref="countToRef"
            :auto-start="false"
            prefix="￥"
            :start-val="1000"
            :decimals="3"
            :end-val="9999.32"
            :font-size="32"
            suffix="%"
            color="#1e9fff"
            @mounted="handleMounted"
            @finish="handleFinish"
          />
        </wd-cell>

        <!-- 控制按钮组 -->
        <view class="px-4">
          <wd-grid clickable border>
            <wd-grid-item text="开始" icon="play" @itemclick="handleStart" />
            <wd-grid-item text="暂停" icon="pause" @itemclick="handlePause" />
            <wd-grid-item text="重置" icon="refresh" @itemclick="handleReset" />
          </wd-grid>
        </view>

        <!-- 状态显示 -->
        <view class="mx-4 rounded-lg bg-blue-50 px-4 py-2">
          <view class="text-xs text-blue-600 font-medium">💡 当前状态：{{ animationStatus }}</view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 手动控制" :code="codes.control.template" />
        <DemoCode title="脚本 - 手动控制" :code="codes.control.script" />
      </template>
    </DemoSection>

    <!-- 实际应用场景 -->
    <DemoSection title="实际应用场景" desc="常见的业务场景示例">
      <!-- 数据统计看板 -->
      <view class="space-y-4">
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">数据统计看板</view>
          <view class="mx-4 rounded-lg bg-gray-50 p-4">
            <view class="grid grid-cols-3 gap-4 text-center">
              <view>
                <view class="mb-1 text-xs text-gray-500">今日销售额</view>
                <wd-count-to
                  :end-val="salesAmount"
                  prefix="¥"
                  :decimals="2"
                  color="#f56c6c"
                  :font-size="20"
                />
              </view>
              <view>
                <view class="mb-1 text-xs text-gray-500">用户增长</view>
                <wd-count-to :end-val="userGrowth" suffix="%" color="#67c23a" :font-size="20" />
              </view>
              <view>
                <view class="mb-1 text-xs text-gray-500">订单量</view>
                <wd-count-to :end-val="orderCount" color="#409eff" :font-size="20" />
              </view>
            </view>
          </view>
        </view>

        <!-- 活动倒计时 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">活动倒计时</view>
          <view class="mx-4 rounded-lg bg-red-50 p-4 text-center">
            <view class="mb-2 text-xs text-red-500">距离活动结束还有</view>
            <wd-count-to
              :start-val="3600"
              :end-val="0"
              :duration="60000"
              color="#f56c6c"
              :font-size="24"
              suffix=" 秒"
            />
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 数据统计看板" :code="codes.scenarios.dashboardTemplate" />
        <DemoCode title="脚本 - 数据统计看板" :code="codes.scenarios.dashboardScript" />
        <DemoCode title="模板 - 活动倒计时" :code="codes.scenarios.countdownTemplate" />
        <DemoCode title="脚本 - 活动倒计时" :code="codes.scenarios.countdownScript" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import type { CountToInstance } from '@/wd/components/wd-count-to/wd-count-to.vue'
import { ref } from 'vue'

// ===== 组件状态管理 =====

// 当前年份
const currentYear = ref<number>(2024)

// CountTo 组件实例引用
const countToRef = ref<CountToInstance>()

// 动画状态
const animationStatus = ref<string>('未开始')

// 业务数据示例
const salesAmount = ref<number>(158936.75)
const userGrowth = ref<number>(23.8)
const orderCount = ref<number>(1568)

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    yearTemplate: `<wd-count-to :end-val="currentYear" suffix="年" color="#16baaa" />`,

    moneyTemplate: `<wd-count-to
  prefix="￥"
  :decimals="2"
  :end-val="186.32"
  :font-size="32"
  color="#1e9fff"
/>`,

    percentTemplate: `<wd-count-to
  :end-val="85.6"
  suffix="%"
  :font-size="28"
  color="#ff5722"
/>`,

    durationTemplate: `<wd-count-to
  prefix="￥"
  :decimals="2"
  :end-val="21286.321"
  :font-size="24"
  suffix="%"
  color="#ffb800"
  :duration="2000"
/>`,

    script: `import { ref } from 'vue'

const currentYear = ref(2024)`,
  },

  // 高级配置代码
  advanced: {
    startValTemplate: `<wd-count-to
  :start-val="1000"
  :end-val="5000"
  prefix="¥"
  color="#9c27b0"
/>`,

    countdownTemplate: `<wd-count-to
  :start-val="100"
  :end-val="0"
  suffix="%"
  color="#e91e63"
  :duration="4000"
/>`,

    linearTemplate: `<wd-count-to
  :end-val="888"
  :use-easing="false"
  prefix="Level "
  color="#607d8b"
/>`,

    separatorTemplate: `<wd-count-to
  :end-val="1234567"
  separator=" "
  prefix="¥"
  color="#795548"
/>`,

    script: `// 高级配置示例数据
const startValue = ref(1000)
const endValue = ref(5000)
const animationDuration = ref(4000)`,
  },

  // 主题样式代码
  theme: {
    template: `<!-- 使用预设主题 -->
<wd-count-to type="primary" prefix="￥" :end-val="888888" suffix="%" />
<wd-count-to type="success" prefix="￥" :end-val="888888" suffix="%" />
<wd-count-to type="warning" prefix="￥" :end-val="888888" suffix="%" />
<wd-count-to type="error" prefix="￥" :end-val="888888" suffix="%" />
<wd-count-to prefix="￥" :end-val="888888" suffix="%" /> <!-- 默认主题 -->`,

    script: `// 主题类型定义
type ThemeType = 'default' | 'primary' | 'success' | 'warning' | 'error'

const themeType = ref<ThemeType>('primary')
const displayValue = ref(888888)`,
  },

  // 手动控制代码
  control: {
    template: `<template>
  <wd-count-to
    ref="countToRef"
    :auto-start="false"
    prefix="￥"
    :start-val="1000"
    :decimals="3"
    :end-val="9999.32"
    :font-size="32"
    suffix="%"
    color="#1e9fff"
    @mounted="handleMounted"
    @finish="handleFinish"
  />

  <!-- 控制按钮 -->
  <wd-grid clickable border>
    <wd-grid-item text="开始" icon="play" @itemclick="handleStart" />
    <wd-grid-item text="暂停" icon="pause" @itemclick="handlePause" />
    <wd-grid-item text="重置" icon="refresh" @itemclick="handleReset" />
  </wd-grid>
</template>`,

    script: `import type { CountToInstance } from '@/wd/components/wd-count-to/wd-count-to.vue'
import { ref } from 'vue'

// 组件实例引用
const countToRef = ref<CountToInstance>()
const animationStatus = ref<string>('未开始')

// 控制方法
const handleStart = () => {
  countToRef.value?.start()
  animationStatus.value = '动画进行中'
}

const handlePause = () => {
  countToRef.value?.pause()
  animationStatus.value = '动画已暂停'
}

const handleReset = () => {
  countToRef.value?.reset()
  animationStatus.value = '动画已重置'
}

// 事件处理
const handleMounted = () => {
  animationStatus.value = '组件已挂载，等待开始'
}

const handleFinish = () => {
  animationStatus.value = '动画已完成'
}`,
  },

  // 应用场景代码
  scenarios: {
    dashboardTemplate: `<!-- 数据统计看板 -->
<view class="grid grid-cols-3 gap-4 text-center">
  <view>
    <view class="mb-1 text-xs text-gray-500">今日销售额</view>
    <wd-count-to
      :end-val="salesAmount"
      prefix="¥"
      :decimals="2"
      color="#f56c6c"
      :font-size="20"
    />
  </view>
  <view>
    <view class="mb-1 text-xs text-gray-500">用户增长</view>
    <wd-count-to
      :end-val="userGrowth"
      suffix="%"
      color="#67c23a"
      :font-size="20"
    />
  </view>
  <view>
    <view class="mb-1 text-xs text-gray-500">订单量</view>
    <wd-count-to
      :end-val="orderCount"
      color="#409eff"
      :font-size="20"
    />
  </view>
</view>`,

    dashboardScript: `// 业务数据示例
const salesAmount = ref(158936.75)
const userGrowth = ref(23.8)
const orderCount = ref(1568)`,

    countdownTemplate: `<!-- 活动倒计时 -->
<view class="mx-4 rounded-lg bg-red-50 p-4 text-center">
  <view class="mb-2 text-xs text-red-500">距离活动结束还有</view>
  <wd-count-to
    :start-val="3600"
    :end-val="0"
    :duration="60000"
    color="#f56c6c"
    :font-size="24"
    suffix=" 秒"
  />
</view>`,

    countdownScript: `// 倒计时配置
const countdownStart = ref(3600) // 3600秒 = 1小时
const countdownEnd = ref(0)
const countdownDuration = ref(60000) // 60秒内从3600倒计时到0`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'end-val',
    type: 'Number',
    default: '2024',
    desc: '最终显示的数值',
  },
  {
    name: 'start-val',
    type: 'Number',
    default: '0',
    desc: '起始数值，动画从此值开始',
  },
  {
    name: 'duration',
    type: 'Number',
    default: '3000',
    desc: '动画持续时间，单位为毫秒',
  },
  {
    name: 'auto-start',
    type: 'Boolean',
    default: 'true',
    desc: '是否自动开始动画',
  },
  {
    name: 'decimals',
    type: 'Number',
    default: '0',
    desc: '保留的小数位数，必须大于等于0',
  },
  {
    name: 'decimal',
    type: 'String',
    default: '"."',
    desc: '小数点符号',
  },
  {
    name: 'separator',
    type: 'String',
    default: '","',
    desc: '千分位分隔符',
  },
  {
    name: 'prefix',
    type: 'String',
    default: '""',
    desc: '前缀，例如：￥人民币符号',
  },
  {
    name: 'suffix',
    type: 'String',
    default: '""',
    desc: '后缀，例如：%百分号',
  },
  {
    name: 'use-easing',
    type: 'Boolean',
    default: 'true',
    desc: '是否使用缓动效果',
  },
  {
    name: 'font-size',
    type: 'Number',
    default: '32',
    desc: '字体大小',
  },
  {
    name: 'color',
    type: 'String',
    default: '""',
    desc: '文本颜色',
  },
  {
    name: 'type',
    type: 'String',
    default: '"default"',
    desc: '主题类型：default / primary / success / warning / error',
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
    name: 'start()',
    desc: '开始数字滚动动画',
  },
  {
    name: 'pause()',
    desc: '暂停数字滚动动画',
  },
  {
    name: 'reset()',
    desc: '重设数字滚动，若 auto-start 为 true，重设后会自动开始',
  },
]

// Events 事件文档
const apiEvents = [
  {
    name: 'mounted',
    desc: '组件挂载完成时触发',
  },
  {
    name: 'finish',
    desc: '数字滚动完成时触发',
  },
]

// ===== 事件处理方法 =====

/**
 * 开始滚动动画
 */
const handleStart = () => {
  countToRef.value?.start()
  animationStatus.value = '动画进行中'
  console.log('开始动画')
}

/**
 * 暂停滚动动画
 */
const handlePause = () => {
  countToRef.value?.pause()
  animationStatus.value = '动画已暂停'
  console.log('暂停动画')
}

/**
 * 重置滚动动画
 */
const handleReset = () => {
  countToRef.value?.reset()
  animationStatus.value = '动画已重置'
  console.log('重置动画')
}

/**
 * 组件挂载完成回调
 */
const handleMounted = () => {
  animationStatus.value = '组件已挂载，等待开始'
  console.log('CountTo 组件挂载完成')
}

/**
 * 动画完成回调
 */
const handleFinish = () => {
  animationStatus.value = '动画已完成'
  console.log('动画完成！')
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
