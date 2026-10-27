<!-- DropMenu 下拉菜单每一项。 -->
<template>
  <view
    v-if="showWrapper"
    :class="`wd-drop-item ${customClass}`"
    :style="`pointer-events: none; z-index: ${zIndex}; ${positionStyle};${customStyle}`"
  >
    <wd-popup
      v-model="showPop"
      :z-index="zIndex"
      :duration="duration"
      :position="position"
      :custom-style="`position: absolute; pointer-events: auto; max-height: ${popupHeight ? popupHeight : '80%'}; ${customPopupStyle}`"
      :custom-class="customPopupClass"
      :modal="false"
      :close-on-click-modal="false"
      @before-enter="beforeEnter"
      @after-enter="afterEnter"
      @before-leave="beforeLeave"
      @after-leave="afterLeave"
    >
      <scroll-view v-if="options.length" :style="popupHeight ? { height: popupHeight } : ''" scroll-y scroll-with-animation :show-scrollbar="true">
        <view
          v-for="(item, index) in options"
          :key="index"
          :class="`wd-drop-item__option ${(item[valueKey] !== '' ? item[valueKey] : item) === modelValue ? 'is-active' : ''}`"
          @click="choose(index)"
        >
          <view :class="`wd-drop-item__title ${customTitle}`">
            <text>{{ item[labelKey] ? item[labelKey] : item }}</text>
            <text v-if="item[tipKey]" class="wd-drop-item__tip">
              {{ item[tipKey] }}
            </text>
          </view>
          <wd-icon
            v-if="(item[valueKey] !== '' ? item[valueKey] : item) === modelValue"
            :name="iconName"
            :custom-class="`wd-drop-item__icon ${customIcon}`"
          />
        </view>
      </scroll-view>
      <slot v-else />
    </wd-popup>
  </view>
</template>

<script lang="ts" setup>
import type { ComponentPublicInstance } from 'vue'
import type { Queue } from '../composables/useQueue'
import type { PopupType } from '../wd-popup/wd-popup.vue'
import {
  computed,
  getCurrentInstance,
  inject,
  onBeforeMount,
  onBeforeUnmount,
  ref,
  watch,
} from 'vue'
import { pushToQueue, removeFromQueue } from '../common/clickoutside'
import { addUnit, isDef, isFunction } from '../common/util'
import { useParent } from '../composables/useParent'
import { queueKey } from '../composables/useQueue'
import { DROP_MENU_KEY } from '../wd-drop-menu/wd-drop-menu-key'
import wdIcon from '../wd-icon/wd-icon.vue'
import wdPopup from '../wd-popup/wd-popup.vue'

defineOptions({
  name: 'WdDropMenuItem',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 下拉菜单项切换前回调选项
 */
interface DropMenuItemBeforeToggleOption {
  /** 操作状态：true 打开下拉菜单，false 关闭下拉菜单 */
  status: boolean
  /** 回调函数，用于控制是否允许打开或关闭下拉菜单，true 允许打开或关闭，false 不允许打开或关闭 */
  resolve: (isPass: boolean) => void
}

/**
 * 下拉菜单项切换前回调函数
 */
export type DropMenuItemBeforeToggle = (option: DropMenuItemBeforeToggleOption) => void

/**
 * 下拉菜单项组件属性接口
 */
interface WdDropMenuItemProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** DropMenuItem 左侧文字样式 */
  customTitle?: string
  /** DropMenuItem 右侧 icon 样式 */
  customIcon?: string
  /** 当前选中项对应选中的 value */
  modelValue?: string | number
  /** 列表数据，对应数据结构 [{text: '标题', value: '0', tip: '提示文字'}] */
  options?: Record<string, any>[]
  /** 禁用菜单 */
  disabled?: boolean
  /** 选中的图标名称(可选名称在 wd-icon 组件中) */
  iconName?: string
  /** 菜单标题 */
  title?: string
  /** 菜单图标 */
  icon?: string
  /** 菜单图标大小 */
  iconSize?: string | number
  /** 自定义点击事件 */
  beforeToggle?: DropMenuItemBeforeToggle
  /** 选项对象中，value 对应的 key */
  valueKey?: string
  /** 选项对象中，展示的文本对应的 key */
  labelKey?: string
  /** 选项对象中，选项说明对应的 key */
  tipKey?: string
  /** 自定义下拉菜单popup样式类 */
  customPopupClass?: string
  /** 自定义下拉菜单popup样式 */
  customPopupStyle?: string
  /** 弹出层高度（设置后选项区域使用 scroll-view 滚动，避免与页面下拉刷新冲突） */
  popupHeight?: string
}

/**
 * 下拉菜单项组件事件接口
 */
interface WdDropMenuItemEmits {
  /** 更新选中值时触发 */
  'update:modelValue': [value: string | number]
  /** 选中项改变时触发 */
  change: [event: { value: string | number; selectedItem: Record<string, any> }]
  /** 下拉菜单打开前触发 */
  open: []
  /** 下拉菜单打开后触发 */
  opened: []
  /** 下拉菜单关闭前触发 */
  close: []
  /** 下拉菜单关闭后触发 */
  closed: []
}

/**
 * 下拉菜单项组件暴露的方法接口
 */
interface WdDropMenuItemExpose {
  /** 获取弹出层显示状态 */
  getShowPop: () => boolean
  /** 打开下拉菜单 */
  open: () => void
  /** 关闭下拉菜单 */
  close: () => void
  /** 切换下拉菜单显示状态 */
  toggle: () => void
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdDropMenuItemProps>(), {
  customStyle: '',
  customClass: '',
  customTitle: '',
  customIcon: '',
  options: () => [],
  disabled: false,
  iconName: 'check',
  icon: 'arrow-down',
  valueKey: 'value',
  labelKey: 'label',
  tipKey: 'tip',
  customPopupClass: '',
  customPopupStyle: '',
  popupHeight: '',
})

// 定义组件事件
const emit = defineEmits<WdDropMenuItemEmits>()

// 注入队列管理器
const queue = inject<Queue | null>(queueKey, null)

// 响应式数据
const showWrapper = ref<boolean>(false)
const showPop = ref<boolean>(false)
const position = ref<PopupType>()
const zIndex = ref<number>(12)
const duration = ref<number>(0)

// 获取父级下拉菜单组件
const { parent: dropMenu } = useParent(DROP_MENU_KEY)

// 获取当前组件实例
const { proxy } = getCurrentInstance() as any

/**
 * 计算位置样式
 * 根据父级下拉菜单的方向和偏移量计算位置
 */
const positionStyle = computed(() => {
  let style: string = ''
  if (showWrapper.value && dropMenu) {
    style =
      dropMenu.props.direction === 'down'
        ? `top: ${addUnit(dropMenu.offset.value)}; bottom: 0;`
        : `top: 0; bottom: ${addUnit(dropMenu.offset.value)}`
  } else {
    style = ''
  }
  return style
})

/**
 * 监听 modelValue 变化
 * 验证 modelValue 的类型是否正确
 */
watch(
  () => props.modelValue,
  (newValue) => {
    if (isDef(newValue) && typeof newValue !== 'number' && typeof newValue !== 'string') {
      console.error(
        '[wot-design] warning(wd-drop-menu-item): the type of value should be a number or a string.',
      )
    }
  },
  {
    deep: true,
    immediate: true,
  },
)

/**
 * 获取弹出层显示状态
 * @returns 弹出层是否显示
 */
const getShowPop = (): boolean => {
  return showPop.value
}

/**
 * 处理关闭操作
 */
const handleClose = () => {
  if (showPop.value) {
    showPop.value = false
  }
}

/**
 * 外部关闭弹出框
 */
const close = () => {
  if (!showPop.value) {
    return
  }
  if (isFunction(props.beforeToggle)) {
    props.beforeToggle({
      status: false,
      resolve: (isPass: boolean) => {
        isPass && handleClose()
      },
    })
  } else {
    handleClose()
  }
}

/**
 * 模拟单选操作
 * 默认根据 value 选中操作
 * @param index 选项索引
 */
const choose = (index: number) => {
  if (props.disabled) return

  const item = props.options[index]
  const newValue = item[props.valueKey] !== undefined ? item[props.valueKey] : item
  emit('update:modelValue', newValue)
  emit('change', {
    value: newValue,
    selectedItem: item,
  })
  close()
}

/**
 * 处理打开操作
 */
const handleOpen = () => {
  showWrapper.value = true
  showPop.value = true
  if (dropMenu) {
    duration.value = Number(dropMenu.props.duration)
    position.value = dropMenu.props.direction === 'down' ? 'top' : 'bottom'
  }
}

/**
 * 打开下拉菜单
 */
const open = () => {
  if (showPop.value) {
    return
  }
  if (isFunction(props.beforeToggle)) {
    props.beforeToggle({
      status: true,
      resolve: (isPass) => {
        isPass && handleOpen()
      },
    })
  } else {
    handleOpen()
  }
}

/**
 * 切换下拉菜单显示状态
 */
const toggle = () => {
  if (showPop.value) {
    close()
  } else {
    open()
  }
}

/**
 * 弹出层进入前的处理
 */
const beforeEnter = () => {
  emit('open')
}

/**
 * 弹出层进入后的处理
 */
const afterEnter = () => {
  emit('opened')
}

/**
 * 弹出层离开前的处理
 */
const beforeLeave = () => {
  emit('close')
}

/**
 * 弹出层离开后的处理
 */
const afterLeave = () => {
  showWrapper.value = false
  emit('closed')
}

/**
 * 组件挂载前的处理
 * 将当前组件添加到队列中
 */
onBeforeMount(() => {
  if (queue && queue.pushToQueue) {
    queue.pushToQueue(proxy)
  } else {
    pushToQueue(proxy)
  }
})

/**
 * 组件卸载前的处理
 * 将当前组件从队列中移除
 */
onBeforeUnmount(() => {
  if (queue && queue.removeFromQueue) {
    queue.removeFromQueue(proxy)
  } else {
    removeFromQueue(proxy)
  }
})

// 暴露组件方法
defineExpose<WdDropMenuItemExpose>({ getShowPop, open, close, toggle })

/** 下拉菜单项组件实例类型 */
export type DropMenuItemInstance = ComponentPublicInstance<
  WdDropMenuItemProps,
  WdDropMenuItemExpose
>
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 暗色主题样式
.wot-theme-dark {
  @include b(drop-item) {
    color: $-dark-color;

    @include e(tip) {
      color: $-dark-color3;
    }
  }
}

// 下拉菜单项主体样式
@include b(drop-item) {
  position: fixed;
  right: 0;
  left: 0;
  overflow: hidden;
  font-size: $-drop-menu-item-fs;
  color: $-drop-menu-item-color;
  width: 100%;
  z-index: 101;

  // 弹出层样式
  @include e(popup) {
    position: absolute;
    max-height: 80%;
  }

  // 选项样式
  @include e(option) {
    display: flex;
    height: $-drop-menu-item-height;
    line-height: $-drop-menu-item-height;
    padding: 0 $-drop-menu-side-padding;
    justify-content: space-between;
    align-items: center;
    transition: color 0.2s;

    // 激活状态样式
    @include when(active) {
      color: $-drop-menu-item-color-active;
    }
  }

  // 标题样式
  @include e(title) {
    display: block;
  }

  // 提示文字样式
  @include e(tip) {
    display: inline-block;
    color: $-drop-menu-item-color-tip;
    font-size: $-drop-menu-item-fs-tip;
    margin-left: 2px;
  }

  // 图标样式
  @include edeep(icon) {
    display: block;
    font-size: $-drop-menu-option-check-size;
  }

  // 遮罩层样式
  @include e(modal) {
    position: fixed;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    height: 100%;
  }
}
</style>
