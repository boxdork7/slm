<!-- Collapse 折叠面板 将一组内容放置在多个折叠面板中，点击面板的标题可以展开或收缩其内容。 -->
<template>
  <view
    :class="`wd-collapse ${viewmore ? 'is-viewmore' : ''} ${customClass}`"
    :style="customStyle"
  >
    <!-- 普通或手风琴 -->
    <block v-if="!viewmore">
      <slot />
    </block>
    <!-- 查看更多模式 -->
    <view v-else>
      <view
        :class="`wd-collapse__content ${!modelValue ? 'is-retract' : ''} `"
        :style="`-webkit-line-clamp: ${contentLineNum}; -webkit-box-orient: vertical`"
      >
        <slot />
      </view>
      <view class="wd-collapse__more" @click="handleMore">
        <!-- 自定义展开按钮 -->
        <view v-if="useMoreSlot" :class="customMoreSlotClass">
          <slot name="more" />
        </view>
        <!-- 显示展开或折叠按钮 -->
        <block v-else>
          <span class="wd-collapse__more-txt">
            {{ !modelValue ? translate('expand') : translate('retract') }}
          </span>
          <view :class="`wd-collapse__arrow ${modelValue ? 'is-retract' : ''}`">
            <wd-icon name="down" />
          </view>
        </block>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { ComponentPublicInstance } from 'vue'
import { onBeforeMount, ref, watch } from 'vue'
import { isArray, isBoolean, isDef } from '../common/util'
import { useChildren } from '../composables/useChildren'
import { useTranslate } from '../composables/useTranslate'
import wdIcon from '../wd-icon/wd-icon.vue'
import { COLLAPSE_KEY } from './wd-collapse-key'

defineOptions({
  name: 'WdCollapse',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 折叠面板切换所有选项类型
 */
export type CollapseToggleAllOptions =
  | boolean
  | {
      /** 是否展开 */
      expanded?: boolean
      /** 是否跳过禁用项 */
      skipDisabled?: boolean
    }

/**
 * 折叠面板组件属性接口
 */
interface WdCollapseProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 查看更多模式下的插槽外部自定义样式 */
  customMoreSlotClass?: string
  /** 绑定值 */
  modelValue?: string | Array<string> | boolean
  /** 手风琴模式 */
  accordion?: boolean
  /** 查看更多的折叠面板 */
  viewmore?: boolean
  /** 查看更多的自定义插槽使用标志 */
  useMoreSlot?: boolean
  /** 查看更多的折叠面板，收起时的显示行数 */
  lineNum?: number
}

/**
 * 折叠面板组件事件接口
 */
interface WdCollapseEmits {
  /** 更新绑定值时触发 */
  'update:modelValue': [value: string | Array<string> | boolean]
  /** 面板状态改变时触发 */
  change: [event: { value: string | Array<string> | boolean }]
}

/**
 * 折叠面板组件暴露的方法接口
 */
interface WdCollapseExpose {
  /** 切换所有面板展开状态，传 true 为全部展开，false 为全部收起，不传参为全部切换 */
  toggleAll: (options?: CollapseToggleAllOptions) => void
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdCollapseProps>(), {
  customStyle: '',
  customClass: '',
  customMoreSlotClass: '',
  accordion: false,
  viewmore: false,
  useMoreSlot: false,
  lineNum: 2,
})

// 定义组件事件
const emit = defineEmits<WdCollapseEmits>()

// 获取翻译函数
const { translate } = useTranslate('collapse')

// 响应式数据：查看更多的折叠面板，收起时的显示行数
const contentLineNum = ref<number>(0)

// 管理子组件
const { linkChildren, children } = useChildren(COLLAPSE_KEY)

/**
 * 更新状态变化
 * @param activeNames 激活的面板名称
 */
const updateChange = (activeNames: string | string[] | boolean) => {
  emit('update:modelValue', activeNames)
  emit('change', {
    value: activeNames,
  })
}

/**
 * 切换面板状态
 * @param name 面板名称
 * @param expanded 是否展开
 */
const toggle = (name: string, expanded: boolean) => {
  const { accordion, modelValue } = props
  if (accordion) {
    updateChange(name === modelValue ? '' : name)
  } else if (expanded) {
    updateChange((modelValue as string[]).concat(name))
  } else {
    updateChange((modelValue as string[]).filter((activeName) => activeName !== name))
  }
}

/**
 * 切换所有面板展开状态
 * 传 true 为全部展开，false 为全部收起，不传参为全部切换
 * @param options 面板状态
 */
const toggleAll = (options: CollapseToggleAllOptions = {}) => {
  if (props.accordion) {
    return
  }
  if (isBoolean(options)) {
    options = { expanded: options }
  }

  const { expanded, skipDisabled } = options
  const names: string[] = []
  children.forEach((item, index) => {
    if (item.disabled && skipDisabled) {
      if (item.$.exposed!.getExpanded()) {
        names.push(item.name || index)
      }
    } else if (isDef(expanded) ? expanded : !item.$.exposed!.getExpanded()) {
      names.push(item.name || index)
    }
  })
  updateChange(names)
}

/**
 * 查看更多点击处理
 */
const handleMore = () => {
  emit('update:modelValue', !props.modelValue)
  emit('change', {
    value: !props.modelValue,
  })
}

/**
 * 监听 modelValue 变化
 * 验证不同模式下的数据类型
 */
watch(
  () => props.modelValue,
  (newVal) => {
    const { viewmore, accordion } = props
    // 手风琴状态下 value 类型只能为 string
    if (accordion && typeof newVal !== 'string') {
      console.error('accordion value must be string')
    } else if (!accordion && !viewmore && !isArray(newVal)) {
      console.error('value must be Array')
    }
  },
  { deep: true },
)

/**
 * 监听 lineNum 变化
 * 验证行数必须大于0
 */
watch(
  () => props.lineNum,
  (newVal) => {
    if (newVal <= 0) {
      console.error('lineNum must greater than 0')
    }
  },
  { deep: true, immediate: true },
)

/**
 * 组件挂载前的处理
 * 初始化查看更多模式的行数
 */
onBeforeMount(() => {
  const { lineNum, viewmore, modelValue } = props
  contentLineNum.value = viewmore && !modelValue ? lineNum : 0
})

// 链接子组件，提供必要的数据和方法
linkChildren({ props, toggle })

// 暴露组件方法
defineExpose<WdCollapseExpose>({
  toggleAll,
})

/** 折叠面板组件实例类型 */
export type CollapseInstance = ComponentPublicInstance<WdCollapseProps, WdCollapseExpose>
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 暗色主题样式
.wot-theme-dark {
  @include b(collapse) {
    background: $-dark-background2;

    @include e(content) {
      color: $-dark-color3;
    }
  }
}

// 折叠面板主体样式
@include b(collapse) {
  background: $-color-white;

  // 查看更多模式样式
  @include when(viewmore) {
    padding: $-collapse-side-padding;
  }

  // 内容区域样式
  @include e(content) {
    font-size: $-collapse-body-fs;
    color: $-collapse-body-color;

    // 收起状态样式
    @include when(retract) {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      font-size: $-collapse-retract-fs;
    }
  }

  // 更多按钮样式
  @include e(more) {
    display: inline-block;
    font-size: $-collapse-retract-fs;
    margin-top: 8px;
    color: $-collapse-more-color;
    user-select: none;
  }

  // 更多按钮文字样式
  @include e(more-txt) {
    display: inline-block;
    vertical-align: middle;
    margin-right: 4px;
  }

  // 箭头样式
  @include e(arrow) {
    display: inline-block;
    vertical-align: middle;
    transition: transform 0.1s;
    font-size: $-collapse-arrow-size;
    height: $-collapse-arrow-size;
    line-height: $-collapse-arrow-size;

    // 收起状态的箭头样式
    @include when(retract) {
      transform: rotate(-180deg);
    }
  }
}
</style>
