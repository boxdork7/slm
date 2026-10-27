<!-- YearPanel - 提供年份维度的滚动面板，支持按年份分组显示月份选择器。 -->
<template>
  <view class="wd-year-panel">
    <view v-if="showPanelTitle" class="wd-year-panel__title">
      {{ formatYearTitle(years[scrollIndex].date) }}
    </view>
    <scroll-view
      class="wd-year-panel__container"
      :style="`height: ${addUnit(panelHeight + (showPanelTitle ? 52 : 32))}`"
      scroll-y
      :scroll-top="scrollTop"
      @scroll="yearScroll"
    >
      <view v-for="(item, index) in years" :id="`year${index}`" :key="index">
        <year
          :type="type"
          :date="item.date"
          :value="value"
          :min-date="minDate"
          :max-date="maxDate"
          :max-range="maxRange"
          :formatter="formatter"
          :range-prompt="rangePrompt"
          :allow-same-day="allowSameDay"
          :default-time="defaultTime"
          :show-title="index !== 0"
          @change="handleDateChange"
        />
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts" setup>
import type { CalendarFormatter, CalendarType } from '../wd-calendar-view.vue'
import { computed, onMounted, ref } from 'vue'
import { addUnit, isArray, isNumber, pause, rpxToPx } from '../../common/util'
import { compareYear, formatYearTitle, getYears } from '../wd-calendar-utils'
import Year from '../year/year.vue'

defineOptions({
  name: 'WdYearPanel',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 年份信息接口
 */
interface YearInfo {
  /** 年份日期时间戳 */
  date: number
  /** 年份高度 */
  height: number
}

/**
 * 年份面板组件属性接口
 */
interface WdYearPanelProps {
  /** 日历类型 */
  type: CalendarType
  /** 当前选中的值 */
  value: number | (number | null)[] | null
  /** 最小可选日期时间戳 */
  minDate: number
  /** 最大可选日期时间戳 */
  maxDate: number
  /** 日期格式化函数 */
  formatter?: CalendarFormatter
  /** 日期区间最大范围 */
  maxRange?: number
  /** 超出最大范围时的提示文案 */
  rangePrompt?: string
  /** 是否允许选择同一天作为开始和结束日期 */
  allowSameDay?: boolean
  /** 是否显示面板标题 */
  showPanelTitle?: boolean
  /** 默认时间数组 */
  defaultTime?: Array<number[]>
  /** 面板高度 */
  panelHeight: number
}

/**
 * 年份面板组件事件接口
 */
interface WdYearPanelEmits {
  /** 年份变化时触发 */
  change: [value: { value: number | (number | null)[] | null }]
}

/**
 * 年份面板组件暴露方法接口
 */
interface WdYearPanelExpose {
  /** 使当前日期或者选中日期滚动到可视区域 */
  scrollIntoView: () => void
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdYearPanelProps>(), {
  allowSameDay: false,
  showPanelTitle: false,
})

// 定义组件事件
const emit = defineEmits<WdYearPanelEmits>()

// 响应式数据
const scrollTop = ref<number>(0) // 滚动位置
const scrollIndex = ref<number>(0) // 当前显示的年份索引

/**
 * 计算年份数据
 * 包含每个年份的日期和高度信息
 */
const years = computed<YearInfo[]>(() => {
  return getYears(props.minDate, props.maxDate).map((year, index) => {
    return {
      date: year,
      height: index === 0 ? rpxToPx(400) : rpxToPx(490), // 第一年高度200px，其他年份245px 此处改为rpx转px
    }
  })
})

/**
 * 使当前日期或者选中日期滚动到可视区域
 */
const scrollIntoView = async () => {
  await pause()
  let activeDate: number | null = null

  if (isArray(props.value)) {
    activeDate = props.value![0]
  } else if (isNumber(props.value)) {
    activeDate = props.value
  }

  if (!activeDate) {
    activeDate = Date.now()
  }

  let top: number = 0

  for (let index = 0; index < years.value.length; index++) {
    if (compareYear(years.value[index].date, activeDate) === 0) {
      break
    }
    top += years.value[index] ? Number(years.value[index].height) : 0
  }

  scrollTop.value = 0
  if (top > 0) {
    await pause()
    scrollTop.value = top + rpxToPx(90)
  }
}

/**
 * 组件挂载后滚动到当前年份
 */
onMounted(() => {
  scrollIntoView()
})

/**
 * 设置当前显示的年份标题
 * @param scrollTop 滚动条位置
 */
const doSetSubtitle = (scrollTop: number) => {
  let height: number = 0 // 年份高度和

  for (let index = 0; index < years.value.length; index++) {
    height = height + years.value[index].height
    if (scrollTop < height) {
      scrollIndex.value = index
      return
    }
  }
}

/**
 * 处理年份滚动事件
 * @param event 滚动事件
 */
const yearScroll = (event: { detail: { scrollTop: number } }) => {
  if (years.value.length <= 1) {
    return
  }
  const scrollTop = Math.max(0, event.detail.scrollTop)
  doSetSubtitle(scrollTop)
}

/**
 * 处理年份变化事件
 * @param param 变化参数
 */
const handleDateChange = ({ value }: { value: number | (number | null)[] | null }) => {
  emit('change', { value })
}

// 暴露组件方法
defineExpose<WdYearPanelExpose>({
  scrollIntoView,
})
</script>

<style lang="scss">
// 引入外部样式文件
@import '../../common/abstracts/variable';
@import '../../common/abstracts/mixin';

// 暗色主题样式
.wot-theme-dark {
  @include b(year-panel) {
    @include e(title) {
      color: $-dark-color;
      box-shadow: 0px 4px 8px 0 rgba(255, 255, 255, 0.02);
    }
  }
}

// 年份面板组件样式
@include b(year-panel) {
  font-size: $-calendar-fs;
  padding: $-calendar-panel-padding;

  // 标题样式
  @include e(title) {
    padding: 5px 0;
    text-align: center;
    font-size: $-calendar-panel-title-fs;
    color: $-calendar-panel-title-color;
    box-shadow: 0px 4px 8px 0 rgba(0, 0, 0, 0.02);
  }
}
</style>
