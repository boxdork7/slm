<!-- Pagination 分页 当数据量过多时，使用分页分解数据 -->
<template>
  <view
    v-if="!(hideIfOnePage && totalPageNum === 1)"
    :class="`wd-pager ${customClass}`"
    :style="customStyle"
  >
    <view class="wd-pager__content">
      <wd-button
        :plain="modelValue > 1"
        type="info"
        size="small"
        :disabled="modelValue <= 1"
        custom-class="wd-pager__nav"
        @click="handlePrev"
      >
        <text v-if="!showIcon">{{ prevText || translate('prev') }}</text>
        <wd-icon
          v-else
          :custom-class="`wd-pager__left wd-pager__icon ${modelValue <= 1 ? 'wd-pager__nav--disabled' : 'wd-pager__nav--active'}`"
          name="right"
        />
      </wd-button>

      <view class="wd-pager__size">
        <text class="wd-pager__current">
          {{ modelValue }}
        </text>
        <text class="wd-pager__separator">/</text>
        <text>{{ totalPageNum }}</text>
      </view>

      <wd-button
        :plain="modelValue < totalPageNum"
        type="info"
        size="small"
        :disabled="modelValue >= totalPageNum"
        custom-class="wd-pager__nav"
        @click="handleNext"
      >
        <text v-if="!showIcon">{{ nextText || translate('next') }}</text>
        <wd-icon
          v-else
          :custom-class="`wd-pager__icon ${modelValue >= totalPageNum ? 'wd-pager__nav--disabled' : 'wd-pager__nav--active'}`"
          name="right"
        />
      </wd-button>
    </view>

    <view v-if="showMessage" class="wd-pager__message">
      <text>{{ translate('page', modelValue) }}，</text>
      <text v-if="total">{{ translate('total', total) }}，</text>
      <text>{{ translate('size', pageSize) }}</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useTranslate } from '../composables/useTranslate'
import wdButton from '../wd-button/wd-button.vue'
import wdIcon from '../wd-icon/wd-icon.vue'

defineOptions({
  name: 'WdPagination',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 分页组件属性接口
 */
interface WdPaginationProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 当前页码 */
  modelValue: number
  /** 总页数，如果有total，则优先使用total计算页数 */
  totalPage?: number
  /** 是否展示分页为Icon图标 */
  showIcon?: boolean
  /** 是否展示总条数信息 */
  showMessage?: boolean
  /** 总条数 */
  total?: number
  /** 每页条数 */
  pageSize?: number
  /** 上一页文本 */
  prevText?: string
  /** 下一页文本 */
  nextText?: string
  /** 总页数只有一页时是否隐藏 */
  hideIfOnePage?: boolean
}

/**
 * 分页组件事件接口
 */
interface WdPaginationEmits {
  /** 页码变化时触发 */
  change: [event: { value: number }]
  /** 更新当前页码 */
  'update:modelValue': [value: number]
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdPaginationProps>(), {
  customStyle: '',
  customClass: '',
  totalPage: 1,
  showIcon: false,
  showMessage: false,
  total: 0,
  pageSize: 10,
  hideIfOnePage: true,
})

// 定义组件事件
const emit = defineEmits<WdPaginationEmits>()

// 使用翻译功能
const { translate } = useTranslate('pagination')

// 响应式数据：总页数
const totalPageNum = ref<number>(0)

/**
 * 监听 totalPage 属性变化
 * 当 totalPage 有值且 totalPageNum 为空时，设置总页数
 */
watch(
  () => props.totalPage,
  (newValue) => {
    if (!totalPageNum.value && newValue) {
      totalPageNum.value = newValue
    }
  },
  { immediate: true, deep: true },
)

/**
 * 更新总页数
 * 根据总条数和每页条数计算总页数
 */
const updateTotalPage = () => {
  const { total, pageSize } = props
  if (total && pageSize) {
    totalPageNum.value = Math.ceil(total / pageSize)
  }
}

/**
 * 监听 total 属性变化
 * 当总条数变化时，重新计算总页数
 */
watch(
  () => props.total,
  () => {
    updateTotalPage()
  },
  { immediate: true, deep: true },
)

/**
 * 处理下一页点击事件
 * 如果不是最后一页，则页码加1
 */
const handleNext = () => {
  const { modelValue } = props
  if (modelValue >= totalPageNum.value) {
    return
  }

  const newValue = modelValue + 1
  emit('change', { value: newValue })
  emit('update:modelValue', newValue)
}

/**
 * 处理上一页点击事件
 * 如果不是第一页，则页码减1
 */
const handlePrev = () => {
  const { modelValue } = props
  if (modelValue <= 1) {
    return
  }

  const newValue = modelValue - 1
  emit('change', { value: newValue })
  emit('update:modelValue', newValue)
}
</script>

<style lang="scss">
// 引入外部样式文件
@import './../common/abstracts/_mixin.scss';
@import './../common/abstracts/variable.scss';

// 暗色主题样式
.wot-theme-dark {
  @include b(pager) {
    background-color: $-dark-background;

    @include e(message) {
      color: $-dark-color3;
    }
  }
}

// 分页组件主体样式
@include b(pager) {
  user-select: none;
  background-color: #fff;

  // 图标样式
  @include edeep(icon) {
    font-size: $-pagination-icon-size;
  }

  // 内容区域样式
  @include e(content) {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: $-pagination-content-padding;
  }

  // 消息文本样式
  @include e(message) {
    text-align: center;
    color: $-pagination-message-color;
    font-size: $-pagination-message-fs;
    padding: $-pagination-message-padding;
  }

  // 导航按钮样式
  @include edeep(nav) {
    min-width: $-pagination-nav-width;

    // 激活状态
    @include m(active) {
      color: rgba(0, 0, 0, 0.65);
    }

    // 禁用状态
    @include m(disabled) {
      color: rgba(0, 0, 0, 0.15);
    }
  }

  // 页码显示区域样式
  @include e(size) {
    flex: 1;
    text-align: center;
    font-size: $-pagination-nav-content-fs;
  }

  // 分隔符样式
  @include e(separator) {
    padding: $-pagination-nav-sepatator-padding;
  }

  // 左箭头样式（旋转右箭头实现）
  @include edeep(left) {
    transform: rotate(180deg) translateY(2rpx);
    display: inline-block;
  }

  // 当前页码样式
  @include e(current) {
    color: $-pagination-nav-current-color;
  }
}
</style>
