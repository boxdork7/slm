<!-- IndexAnchor - 索引导航的锚点组件，支持吸顶效果和与IndexBar父组件联动显示当前激活状态。 -->
<template>
  <!-- #ifdef MP-DINGTALK -->
  <view :class="`wd-index-anchor-ding ${isSticky ? 'is-sticky' : ''}`">
    <!-- #endif -->
    <view
      :id="indexAnchorId"
      :class="`wd-index-anchor ${isSticky ? 'is-sticky' : ''} ${customClass}`"
      :style="customStyle"
    >
      <slot>
        {{ index }}
      </slot>
    </view>
    <!-- #ifdef MP-DINGTALK -->
  </view>
  <!-- #endif -->
</template>

<script lang="ts" setup>
import type { ComponentPublicInstance, ComputedRef, Ref } from 'vue'
import type { AnchorIndex } from '../wd-index-bar/wd-index-bar.vue'
import { getCurrentInstance, onMounted, ref } from 'vue'
import { getRect, isDef, uuid } from '../common/util'
import { useParent } from '../composables/useParent'
import { indexBarInjectionKey } from '../wd-index-bar/wd-index-bar-key'

defineOptions({
  name: 'WdIndexAnchor',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 索引锚点组件属性接口
 */
export interface WdIndexAnchorProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string
  /** 索引值 */
  index: AnchorIndex
}

/**
 * 索引锚点组件暴露方法接口
 */
export interface WdIndexAnchorExpose {
  /** 锚点距离顶部的位置 */
  top: Ref<number>
  /** 获取锚点位置信息的方法 */
  getInfo: () => void
  /** 锚点唯一ID */
  indexAnchorId: Ref<string>
  /** 是否处于吸顶状态（计算属性） */
  isSticky: ComputedRef<boolean>
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdIndexAnchorProps>(), {
  customStyle: '',
  customClass: '',
  sticky: false,
})

// 获取父组件 IndexBar 实例
const { parent: indexBar } = useParent(indexBarInjectionKey)

// 锚点唯一ID
const indexAnchorId = ref<string>(`indexBar${uuid()}`)

// 获取当前组件实例
const { proxy } = getCurrentInstance()!

// 锚点距离顶部的位置
const top = ref<number>(0)

const isSticky = computed(() => {
  return indexBar && indexBar.props.sticky && indexBar.anchorState.activeIndex === props.index
})

/**
 * 获取锚点位置信息
 * 计算锚点距离页面顶部的距离
 */
const getInfo = () => {
  getRect(`#${indexAnchorId.value}`, false, proxy).then((res) => {
    if (isDef(indexBar)) {
      top.value = Math.floor(res.top!)
    }
  })
}

/**
 * 组件挂载后获取位置信息
 */
onMounted(() => {
  getInfo()
})

// 暴露给父组件的属性
defineExpose<WdIndexAnchorExpose>({
  top,
  getInfo,
  indexAnchorId,
  isSticky,
})

/** 索引锚点组件实例类型 */
export type WdIndexAnchorInstance = ComponentPublicInstance<WdIndexAnchorProps, WdIndexAnchorExpose>
</script>

<style lang="scss">
// 引入外部样式文件
@import './../common/abstracts/_mixin.scss';
@import './../common/abstracts/variable.scss';

// 暗色主题样式
.wot-theme-dark {
  @include b(index-anchor) {
    background-color: $-color-gray-8;
    color: $-color-white;
  }
}

// 钉钉小程序特殊处理
// #ifdef MP-DINGTALK
@include b(index-anchor-ding) {
  @include when(sticky) {
    position: sticky;
    top: 0;
    left: 0;
    z-index: 1;
  }
}

// #endif

// 索引锚点样式
@include b(index-anchor) {
  background-color: $-color-gray-2;
  padding: 20rpx;
  font-size: 28rpx;
  color: $-color-title;

  @include when(sticky) {
    position: sticky;
    top: 0;
    left: 0;
    z-index: 1;
  }
}
</style>
