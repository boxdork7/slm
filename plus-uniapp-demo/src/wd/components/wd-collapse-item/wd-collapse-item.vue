<!-- Collapse 折叠面板 每一项 -->
<template>
  <view
    :class="`wd-collapse-item ${disabled ? 'is-disabled' : ''} is-border ${customClass}`"
    :style="customStyle"
  >
    <view
      :class="`wd-collapse-item__header ${expanded ? 'is-expanded' : ''} ${isFirst ? 'wd-collapse-item__header-first' : ''} ${
        $slots.title ? 'is-custom' : ''
      }`"
      @click="handleClick"
    >
      <slot name="title" :expanded="expanded" :disabled="disabled" :is-first="isFirst">
        <text class="wd-collapse-item__title">
          {{ title }}
        </text>
        <wd-icon
          name="down"
          :custom-class="`wd-collapse-item__arrow ${expanded ? 'is-retract' : ''}`"
        />
      </slot>
    </view>
    <view
      class="wd-collapse-item__wrapper"
      :style="contentStyle"
      @transitionend="handleTransitionEnd"
    >
      <view
        :id="collapseId"
        class="wd-collapse-item__body"
        :class="customBodyClass"
        :style="customBodyStyle"
      >
        <slot />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { ComponentPublicInstance, CSSProperties } from 'vue'
import { computed, getCurrentInstance, onMounted, ref, watch, nextTick } from 'vue'
import { getRect, isArray, isDef, isPromise, isString, objToStyle, uuid } from '../common/util'
import { useParent } from '../composables/useParent'
import { COLLAPSE_KEY } from '../wd-collapse/wd-collapse-key'
import wdIcon from '../wd-icon/wd-icon.vue'

defineOptions({
  name: 'WdCollapseItem',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 折叠面板项展开前回调函数
 */
type CollapseItemBeforeExpand = (name: string) => boolean | Promise<unknown>

/**
 * 折叠面板项组件属性接口
 */
interface WdCollapseItemProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 自定义折叠栏内容容器样式类名 */
  customBodyClass?: string
  /** 自定义折叠栏内容容器样式 */
  customBodyStyle?: string
  /** 折叠栏的标题, 可通过 slot 传递自定义内容 */
  title?: string
  /** 禁用折叠栏 */
  disabled?: boolean
  /** 折叠栏的标识符 */
  name: string
  /** 打开前的回调函数，返回 false 可以阻止打开，支持返回 Promise */
  beforeExpend?: CollapseItemBeforeExpand
}

/**
 * 折叠面板项组件暴露的方法接口
 */
interface WdCollapseItemExpose {
  /** 获取展开状态 */
  getExpanded: () => boolean
  /** 更新展开状态 */
  updateExpand: () => Promise<void>
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdCollapseItemProps>(), {
  customStyle: '',
  customClass: '',
  customBodyClass: '',
  customBodyStyle: '',
  title: '',
  disabled: false,
})

// 获取父级折叠面板组件
const { parent: collapse, index } = useParent(COLLAPSE_KEY)

// 响应式数据
const collapseId = ref<string>(`collapseId${uuid()}`)
const contentHeight = ref<number>(0)
const inited = ref<boolean>(false)
const expanded = ref<boolean>(false)
const animating = ref<boolean>(false)

// 获取当前组件实例
const { proxy } = getCurrentInstance() as any

/**
 * 计算是否为第一项
 */
const isFirst = computed(() => {
  return index.value === 0
})

/**
 * 计算容器样式（动画）
 */
const contentStyle = computed(() => {
  const style: CSSProperties = {}

  // 始终设置过渡，但未初始化时持续时间为0
  style.transition = inited.value ? 'height 0.3s ease-in-out' : 'height 0s'

  if (!expanded.value) {
    style.height = '0px'
  } else if (animating.value && contentHeight.value > 0) {
    // 动画过程中使用精确高度
    style.height = `${contentHeight.value}px`
  } else if (expanded.value && !animating.value) {
    // 动画完成后使用auto，允许内容自适应
    style.height = 'auto'
  }
  return objToStyle(style)
})

/**
 * 计算是否被选中
 */
const isSelected = computed(() => {
  const modelValue = collapse ? collapse?.props.modelValue || [] : []
  const { name } = props
  return (
    (isString(modelValue) && modelValue === name) ||
    (isArray(modelValue) && modelValue.includes(name as string))
  )
})

/**
 * 获取展开状态
 * @returns 是否展开
 */
const getExpanded = (): boolean => {
  return expanded.value
}

/**
 * 展开前钩子处理
 * @returns Promise
 */
const handleBeforeExpand = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const { name } = props
    const nextexpanded = !expanded.value
    if (nextexpanded && props.beforeExpend) {
      const response = props.beforeExpend(name)
      if (!response) {
        reject(new Error('beforeExpend error'))
      }
      if (isPromise(response)) {
        response.then(() => resolve()).catch(reject)
      } else {
        resolve()
      }
    } else {
      resolve()
    }
  })
}

/**
 * 获取内容高度
 */
const getContentHeight = async (): Promise<number> => {
  const rect = await getRect(`#${collapseId.value}`, false, proxy)
  return isDef(rect.height) ? Number(rect.height) : 0
}

/**
 * 执行展开/收起动画 - 关键修复：精确控制动画流程
 */
const performAnimation = async (shouldExpand: boolean) => {
  if (expanded.value === shouldExpand) return

  animating.value = true

  if (shouldExpand) {
    // 展开动画：先获取高度，再设置展开状态
    const height = await getContentHeight()
    contentHeight.value = height
    await nextTick()
    expanded.value = true
  } else {
    // 收起动画：先设置当前高度，再收起
    const height = await getContentHeight()
    contentHeight.value = height
    await nextTick()
    expanded.value = false
  }
}

/**
 * 初始化矩形区域 - 关键修复：移除pause，精确控制初始状态
 */
const initRect = async () => {
  const rect = await getRect(`#${collapseId.value}`, false, proxy)
  const rectHeight = rect.height
  contentHeight.value = isDef(rectHeight) ? Number(rectHeight) : 0

  // 初始化时直接设置状态，不执行动画
  if (!inited.value) {
    expanded.value = isSelected.value
    inited.value = true
    animating.value = false
  } else {
    // 已初始化，执行动画
    await performAnimation(isSelected.value)
  }
}

/**
 * 更新展开状态
 * @param useBeforeExpand 是否使用展开前钩子
 */
const updateExpand = async (useBeforeExpand: boolean = true): Promise<void> => {
  try {
    if (useBeforeExpand) {
      await handleBeforeExpand()
    }
    await initRect()
  } catch (error) {
    /* empty */
  }
}

/**
 * 过渡动画结束处理 - 关键修复：清除动画状态
 */
const handleTransitionEnd = () => {
  animating.value = false
}

/**
 * 点击子项处理
 */
const handleClick = async () => {
  if (props.disabled) return
  try {
    await handleBeforeExpand()
    const { name } = props
    collapse && collapse.toggle(name, !expanded.value)
  } catch (error) {
    /* empty */
  }
}

/**
 * 监听选中状态变化
 */
watch(
  () => isSelected.value,
  async (newVal) => {
    if (inited.value) {
      await performAnimation(newVal)
    }
  },
)

/**
 * 组件挂载后的处理
 */
onMounted(async () => {
  await nextTick()
  await updateExpand(isSelected.value)
})

// 暴露组件方法
defineExpose<WdCollapseItemExpose>({ getExpanded, updateExpand })

/** 折叠面板项组件实例类型 */
export type CollapseItemInstance = ComponentPublicInstance<
  WdCollapseItemProps,
  WdCollapseItemExpose
>
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 暗色主题样式
.wot-theme-dark {
  @include b(collapse-item) {
    @include halfPixelBorder('top', 0, $-dark-border-color);

    @include e(title) {
      color: $-dark-color;
    }

    @include e(body) {
      color: $-dark-color3;
    }

    @include when(disabled) {
      .wd-collapse-item__title {
        color: $-dark-color-gray;
      }
      .wd-collapse-item__arrow {
        color: $-dark-color-gray;
      }
    }
  }
}

// 折叠面板项主体样式
@include b(collapse-item) {
  position: relative;
  @include halfPixelBorder('top');

  // 头部样式
  @include e(header) {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $-collapse-header-padding;
    overflow: hidden;
    user-select: none;

    // 展开状态样式
    @include when(expanded) {
      @include halfPixelBorder('bottom');
    }

    // 自定义头部样式
    @include when(custom) {
      display: block;
    }
  }

  // 标题样式
  @include e(title) {
    color: $-collapse-title-color;
    font-weight: $-fw-medium;
    font-size: $-collapse-title-fs;
  }

  // 箭头样式
  @include edeep(arrow) {
    display: block;
    font-size: $-collapse-arrow-size;
    color: $-collapse-arrow-color;
    transition: transform 0.3s;

    // 收起状态箭头样式
    @include when(retract) {
      transform: rotate(-180deg);
    }
  }

  // 包装器样式
  @include e(wrapper) {
    position: relative;
    overflow: hidden;
    will-change: height;
  }

  // 内容区域样式
  @include e(body) {
    color: $-collapse-body-color;
    font-size: $-collapse-body-fs;
    padding: $-collapse-body-padding;
    line-height: 1.43;
  }

  // 禁用状态样式
  @include when(disabled) {
    .wd-collapse-item__title {
      color: $-collapse-disabled-color;
    }
    .wd-collapse-item__arrow {
      color: $-collapse-disabled-color;
    }
  }
}
</style>
