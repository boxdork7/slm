<!-- Tab 标签页 标签页组件，用于在不同的内容区域之间进行切换。 -->
<template>
  <view :class="`wd-tab ${customClass}`" :style="customStyle">
    <view
      v-if="shouldBeRender"
      class="wd-tab__body"
      :class="[{ 'wd-tab__body--inactive': !active }]"
      :style="tabBodyStyle"
    >
      <slot />
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import type { WdBadgeProps } from '../wd-badge/wd-badge.vue'
import { computed, getCurrentInstance, ref, watch } from 'vue'
import { isDef, isNumber, isString, objToStyle } from '../common/util'
import { useParent } from '../composables/useParent'
import { TABS_KEY } from '../wd-tabs/wd-tabs-key'

defineOptions({
  name: 'WdTab',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 标签页组件属性接口
 */
interface WdTabProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 唯一标识符 */
  name?: string | number
  /** tab的标题 */
  title?: string
  /** 是否禁用，无法点击 */
  disabled?: boolean
  /** 是否懒加载，切换到该tab时才加载内容 */
  lazy?: boolean
  /** 徽标属性，透传给 Badge 组件 */
  badgeProps?: Partial<WdBadgeProps>
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdTabProps>(), {
  customStyle: '',
  customClass: '',
  title: '',
  disabled: false,
  lazy: true,
})

// 获取组件实例
const { proxy } = getCurrentInstance() as any

// 获取父组件（Tabs）实例
const { parent: tabs, index } = useParent(TABS_KEY)

// 初始状态tab不会渲染，必须通过tabs来设置painted使tab渲染
const painted = ref<boolean>(false)

/**
 * 是否为激活状态
 */
const active = computed(() => {
  return isDef(tabs) ? tabs.state.activeIndex === index.value : false
})

/**
 * 计算标签页内容区域的样式
 */
const tabBodyStyle = computed(() => {
  const style: CSSProperties = {}
  if (!active.value && (!isDef(tabs) || !tabs.props.animated)) {
    style.display = 'none'
  }
  return objToStyle(style)
})

/**
 * 判断是否应该渲染
 */
const shouldBeRender = computed(() => !props.lazy || painted.value || active.value)

/**
 * 检测tab绑定的name是否和其它tab的name冲突
 * @param self 自身
 */
const checkName = (self: any) => {
  const { name: myName } = props
  if (myName === undefined || myName === null || myName === '') {
    return
  }
  tabs &&
    tabs.children.forEach((child: any) => {
      if (child.$.uid !== self.$.uid && child.name === myName) {
        console.error(`The tab's bound value: ${myName} has been used`)
      }
    })
}

/**
 * 监听激活状态变化
 */
watch(active, (val) => {
  if (val) painted.value = true
})

/**
 * 监听name属性变化
 */
watch(
  () => props.name,
  (newValue) => {
    if (isDef(newValue) && !isNumber(newValue) && !isString(newValue)) {
      console.error('error(wd-tab): the type of name should be number or string')
      return
    }
    if (tabs) {
      checkName(proxy)
    }
  },
  {
    deep: true,
    immediate: true,
  },
)

// 初始化painted状态
if (active.value) {
  painted.value = true
}
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 标签页内容样式
@include b(tab) {
  width: 100%;
  flex-shrink: 0;
  box-sizing: border-box;

  @include e(body) {
    @include m(inactive) {
      height: 0;
      transition: height 0.3s ease-in-out;
    }
  }
}
</style>
