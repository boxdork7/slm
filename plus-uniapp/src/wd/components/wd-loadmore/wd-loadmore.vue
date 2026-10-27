<!-- loadmore 加载更多 用于在列表底部展示加载状态。 -->
<template>
  <view
    :class="`wd-loadmore ${customClass || ''}`"
    :style="customStyle"
    @click="handleReload"
  >
    <!-- 完成状态：显示分割线和完成文案 -->
    <wd-divider v-if="state === 'finished'">
      {{ finishedText || translate('finished') }}
    </wd-divider>

    <!-- 错误状态：显示错误文案、重试提示和刷新图标 -->
    <block v-if="state === 'error'">
      <text class="wd-loadmore__text">{{ errorText || translate('error') }}</text>
      <text class="wd-loadmore__text is-light">{{ translate('retry') }}</text>
      <wd-icon name="refresh" custom-class="wd-loadmore__refresh" />
    </block>

    <!-- 加载状态：显示加载动画和加载文案 -->
    <block v-if="state === 'loading'">
      <wd-loading v-bind="computedLoadingProps" />
      <text class="wd-loadmore__text">{{ loadingText || translate('loading') }}</text>
    </block>
  </view>
</template>

<script lang="ts" setup>
import type { WdLoadingProps } from '../wd-loading/wd-loading.vue'
import { computed, ref } from 'vue'
import { isDef, isUndefined, omitBy } from '../common/util'
import { useTranslate } from '../composables/useTranslate'
import wdDivider from '../wd-divider/wd-divider.vue'
import wdIcon from '../wd-icon/wd-icon.vue'
import wdLoading from '../wd-loading/wd-loading.vue'

defineOptions({
  name: 'WdLoadmore',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 加载更多状态类型
 */
type LoadMoreState = 'loading' | 'error' | 'finished'

/**
 * 加载更多组件属性接口
 */
interface WdLoadmoreProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 加载状态，可选值：'loading' | 'error' | 'finished' */
  state?: LoadMoreState
  /** 加载提示文案 */
  loadingText?: string
  /** 全部加载完的提示文案 */
  finishedText?: string
  /** 加载失败的提示文案 */
  errorText?: string
  /** 加载中 loading 组件的属性，参考 loading 组件 */
  loadingProps?: Partial<WdLoadingProps>
}

/**
 * 加载更多组件事件接口
 */
interface WdLoadmoreEmits {
  /** 点击重新加载时触发（仅在错误状态下） */
  reload: []
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdLoadmoreProps>(), {
  customStyle: '',
  customClass: '',
})

// 定义组件事件
const emit = defineEmits<WdLoadmoreEmits>()

// 国际化翻译函数
const { translate } = useTranslate('loadmore')

// 响应式数据：当前状态（用于内部状态管理）
const currentState = ref<LoadMoreState | null>(null)

/**
 * 计算加载组件的属性
 * 合并默认属性和用户传入的属性，并添加特定的样式类
 */
const computedLoadingProps = computed(() => {
  // 获取用户传入的 loading 属性，过滤掉 undefined 值
  const loadingProps: Partial<WdLoadingProps> = isDef(props.loadingProps)
    ? omitBy(props.loadingProps, isUndefined)
    : {}

  // 添加组件特定的样式类
  loadingProps.customClass = `wd-loadmore__loading ${loadingProps.customClass || ''}`

  return loadingProps
})

/**
 * 处理重新加载事件
 * 只有在错误状态下才会触发重新加载
 */
const handleReload = () => {
  // 只有在错误状态下才允许重新加载
  if (props.state !== 'error') return

  // 更新内部状态为加载中
  currentState.value = 'loading'

  // 触发重新加载事件，通知父组件
  emit('reload')
}
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 暗色主题样式
.wot-theme-dark {
  @include b(loadmore) {
    color: $-dark-color;
  }
}

// 加载更多组件样式
@include b(loadmore) {
  width: 100%;
  height: $-loadmore-height;
  line-height: $-loadmore-height;
  text-align: center;
  color: $-loadmore-color;

  // 加载动画样式
  @include edeep(loading) {
    display: inline-block;
    margin-right: 16rpx;
    vertical-align: middle;
    width: $-loadmore-loading-size;
    height: $-loadmore-loading-size;
  }

  // 文本样式
  @include e(text) {
    display: inline-block;
    font-size: $-loadmore-fs;
    vertical-align: middle;

    // 浅色文本样式（用于重试提示）
    @include when(light) {
      margin: 0 12rpx;
      color: $-loadmore-error-color;
    }
  }

  // 刷新图标样式
  @include edeep(refresh) {
    display: inline-block;
    color: $-loadmore-error-color;
    vertical-align: middle;
    font-size: $-loadmore-refresh-fs;
  }
}
</style>
