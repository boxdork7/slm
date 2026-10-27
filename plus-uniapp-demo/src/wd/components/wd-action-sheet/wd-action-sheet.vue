<!-- ActionSheet 动作面板 从底部弹出的动作菜单面板。 -->
<template>
  <view>
    <wd-popup
      v-model="showPopup"
      custom-class="wd-action-sheet__popup"
      :custom-style="`${(actions && actions.length) || (panels && panels.length) ? 'background: transparent;' : ''}`"
      :duration="duration"
      position="bottom"
      :close-on-click-modal="closeOnClickModal"
      :safe-area-inset-bottom="safeAreaInsetBottom"
      :lazy-render="lazyRender"
      :z-index="zIndex"
      @enter="handleOpen"
      @close="close"
      @after-enter="handleOpened"
      @after-leave="handleClosed"
      @click-modal="handleClickModal"
    >
      <view
        :class="`wd-action-sheet ${customClass}`"
        :style="`${
          (actions && actions.length) || (panels && panels.length)
            ? 'margin: 0 20rpx calc(var(--window-bottom) + 20rpx) 20rpx; border-radius: 32rpx;'
            : 'margin-bottom: var(--window-bottom);'
        } ${customStyle}`"
      >
        <!-- 标题区域 -->
        <view v-if="title" :class="`wd-action-sheet__header ${customHeaderClass}`">
          {{ title }}
          <wd-icon custom-class="wd-action-sheet__close" name="close" @click="close" />
        </view>

        <!-- 菜单选项区域 -->
        <view v-if="actions && actions.length" class="wd-action-sheet__actions">
          <button
            v-for="(action, rowIndex) in actions"
            :key="rowIndex"
            :class="`wd-action-sheet__action ${action.disabled ? 'wd-action-sheet__action--disabled' : ''}  ${
              action.loading ? 'wd-action-sheet__action--loading' : ''
            }`"
            :style="`color: ${action.color}`"
            @click="select(rowIndex, 'action')"
          >
            <wd-loading v-if="action.loading" custom-class="`wd-action-sheet__action-loading" />
            <view v-else class="wd-action-sheet__name">
              {{ action.label || action.name }}
            </view>
            <view v-if="!action.loading && action.subname" class="wd-action-sheet__subname">
              {{ action.subname }}
            </view>
          </button>
        </view>

        <!-- 面板区域 -->
        <view v-if="formatPanels && formatPanels.length">
          <view
            v-for="(panel, rowIndex) in formatPanels"
            :key="rowIndex"
            class="wd-action-sheet__panels"
          >
            <view class="wd-action-sheet__panels-content">
              <view
                v-for="(col, colIndex) in panel"
                :key="colIndex"
                class="wd-action-sheet__panel"
                @click="select(rowIndex, 'panels', colIndex)"
              >
                <image class="wd-action-sheet__panel-img" :src="(col as any).iconUrl" />
                <view class="wd-action-sheet__panel-title">
                  {{ (col as any).title }}
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 默认插槽 -->
        <slot />

        <!-- 取消按钮 -->
        <button v-if="cancelText" class="wd-action-sheet__cancel" @click="handleCancel">
          {{ cancelText }}
        </button>
      </view>
    </wd-popup>
  </view>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { isArray } from '../common/util'
import wdIcon from '../wd-icon/wd-icon.vue'
import wdLoading from '../wd-loading/wd-loading.vue'
import wdPopup from '../wd-popup/wd-popup.vue'

defineOptions({
  name: 'WdActionSheet',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 菜单选项接口（扩展支持 DictItem 格式）
 */
interface Action {
  /** 选项名称 */
  name?: string
  /** 选项标签（兼容 DictItem 格式） */
  label?: string
  /** 选项值（兼容 DictItem 格式） */
  value?: string | number
  /** 描述信息 */
  subname?: string
  /** 颜色 */
  color?: string
  /** 禁用 */
  disabled?: boolean
  /** 加载中状态 */
  loading?: boolean
}

/**
 * 面板项接口
 */
interface Panel {
  /** 图片地址 */
  iconUrl: string
  /** 标题内容 */
  title: string
}

/**
 * 动作面板组件属性接口
 */
interface WdActionSheetProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string
  /** header 头部样式 */
  customHeaderClass?: string

  /** 设置菜单显示隐藏 */
  modelValue: boolean
  /** 菜单选项 */
  actions?: Action[]
  /** 自定义面板项，可以为字符串数组，也可以为对象数组，如果为二维数组，则为多行展示 */
  panels?: Panel[] | Panel[][]
  /** 标题 */
  title?: string
  /** 取消按钮文案 */
  cancelText?: string

  /** 点击选项后是否关闭菜单 */
  closeOnClickAction?: boolean
  /** 点击遮罩是否关闭 */
  closeOnClickModal?: boolean
  /** 弹框动画持续时间 */
  duration?: number
  /** 菜单层级 */
  zIndex?: number
  /** 弹层内容懒渲染，触发展示时才渲染内容 */
  lazyRender?: boolean
  /** 弹出面板是否设置底部安全距离（iphone X 类型的机型） */
  safeAreaInsetBottom?: boolean
}

/**
 * 选择事件返回数据接口
 */
export interface SelectEventData {
  /** 原始选项数据 */
  item: Action | Panel
  /** 选项索引 */
  index: number
  /** 选项值（兼容 DictItem 格式） */
  value?: string | number
  /** 选项标签（兼容 DictItem 格式） */
  label?: string
  /** 行索引（面板项专用） */
  rowIndex?: number
  /** 列索引（面板项专用） */
  colIndex?: number
}

/**
 * 动作面板组件事件接口
 */
interface WdActionSheetEmits {
  /** 更新显示状态 */
  'update:modelValue': [value: boolean]
  /** 选择选项或面板项时触发 */
  select: [data: SelectEventData]
  /** 点击遮罩时触发 */
  'click-modal': []
  /** 点击取消按钮时触发 */
  cancel: []
  /** 关闭时触发 */
  close: []
  /** 关闭后触发 */
  closed: []
  /** 打开时触发 */
  open: []
  /** 打开后触发 */
  opened: []
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdActionSheetProps>(), {
  customStyle: '',
  customClass: '',
  customHeaderClass: '',
  actions: () => [],
  panels: () => [],
  closeOnClickAction: true,
  closeOnClickModal: true,
  duration: 200,
  zIndex: 100,
  lazyRender: true,
  safeAreaInsetBottom: true,
})

// 定义组件事件
const emit = defineEmits<WdActionSheetEmits>()

// 响应式数据：格式化后的面板数据
const formatPanels = ref<Array<Panel> | Array<Panel[]>>([])

// 响应式数据：弹窗显示状态
const showPopup = ref<boolean>(false)

/**
 * 判断面板数据是否为一维数组
 * @returns 是否为一维数组
 */
const isPanelArray = (): boolean => {
  return props.panels.length > 0 && !isArray(props.panels[0])
}

/**
 * 格式化面板数据
 * 将一维数组转换为二维数组格式，便于统一处理
 */
const computedValue = () => {
  formatPanels.value = isPanelArray() ? [props.panels as Panel[]] : (props.panels as Panel[][])
}

/**
 * 监听 panels 属性变化
 * 当面板数据发生变化时，重新格式化面板数据
 */
watch(
  () => props.panels,
  () => {
    computedValue()
  },
  { deep: true, immediate: true },
)

/**
 * 监听 modelValue 属性变化
 * 同步内部弹窗显示状态
 */
watch(
  () => props.modelValue,
  (newValue) => {
    showPopup.value = newValue
  },
  { deep: true, immediate: true },
)

/**
 * 关闭面板
 */
const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

/**
 * 处理选择事件
 * @param rowIndex 行索引
 * @param type 类型：'action' 或 'panels'
 * @param colIndex 列索引（仅面板项需要）
 */
const select = (rowIndex: number, type: 'action' | 'panels', colIndex?: number) => {
  if (type === 'action') {
    // 检查菜单项是否禁用或加载中
    if (props.actions[rowIndex].disabled || props.actions[rowIndex].loading) {
      return
    }

    const selectedAction = props.actions[rowIndex]

    // 构建返回数据，兼容两种格式
    const eventData: SelectEventData = {
      item: selectedAction,
      index: rowIndex,
      value: selectedAction.value ?? selectedAction.name,
      label: selectedAction.label ?? selectedAction.name,
    }

    emit('select', eventData)
  } else if (isPanelArray()) {
    // 一维面板数组
    const selectedPanel = props.panels[Number(colIndex)] as Panel

    const eventData: SelectEventData = {
      item: selectedPanel,
      index: Number(colIndex),
      value: selectedPanel.title,
      label: selectedPanel.title,
    }

    emit('select', eventData)
  } else {
    // 二维面板数组
    const selectedPanel = (props.panels as Panel[][])[rowIndex][Number(colIndex)]

    const eventData: SelectEventData = {
      item: selectedPanel,
      index: Number(colIndex),
      rowIndex,
      colIndex,
      value: selectedPanel.title,
      label: selectedPanel.title,
    }

    emit('select', eventData)
  }

  // 根据配置决定是否关闭面板
  if (props.closeOnClickAction) {
    close()
  }
}

/**
 * 处理点击遮罩事件
 */
const handleClickModal = () => {
  emit('click-modal')
}

/**
 * 处理取消按钮点击事件
 */
const handleCancel = () => {
  emit('cancel')
  close()
}

/**
 * 处理打开事件
 */
const handleOpen = () => {
  emit('open')
}

/**
 * 处理打开完成事件
 */
const handleOpened = () => {
  emit('opened')
}

/**
 * 处理关闭完成事件
 */
const handleClosed = () => {
  emit('closed')
}
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 暗色主题样式
.wot-theme-dark {
  @include b(action-sheet) {
    background-color: $-dark-background2;
    color: $-dark-color;

    @include e(action) {
      color: $-dark-color;
      background: $-dark-background2;

      &:not(.wd-action-sheet__action--disabled):not(.wd-action-sheet__action--loading):active {
        background: $-dark-background4;
      }

      @include m(disabled) {
        color: $-dark-color-gray;
      }
    }

    @include e(subname) {
      color: $-dark-color3;
    }

    @include e(cancel) {
      color: $-dark-color;
      background: $-dark-background4;

      &:active {
        background: $-dark-background5;
      }
    }

    :deep(.wd-action-sheet__close) {
      color: $-dark-color3;
    }

    @include e(panel-title) {
      color: $-dark-color;
    }

    @include e(header) {
      color: $-dark-color;
    }
  }
}

// 弹窗样式
:deep(.wd-action-sheet__popup) {
  border-radius: $-action-sheet-radius $-action-sheet-radius 0 0;
}

// 动作面板主体样式
@include b(action-sheet) {
  background-color: $-color-white;
  padding-bottom: 2rpx;

  @include edeep(popup) {
    border-radius: $-action-sheet-radius $-action-sheet-radius 0 0;
  }

  // 菜单选项容器
  @include e(actions) {
    padding: 16rpx 0;
    max-height: 50vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  // 菜单选项样式
  @include e(action) {
    position: relative;
    display: block;
    width: 100%;
    height: $-action-sheet-action-height;
    line-height: $-action-sheet-action-height;
    color: $-action-sheet-color;
    font-size: $-action-sheet-fs;
    text-align: center;
    border: none;
    background: $-action-sheet-bg;
    outline: none;

    &:after {
      display: none;
    }

    &:not(&--disabled):not(&--loading):active {
      background: $-action-sheet-active-color;
    }

    @include m(disabled) {
      color: $-action-sheet-disabled-color;
      cursor: not-allowed;
    }

    @include m(loading) {
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: initial;
    }
  }

  @include edeep(action-loading) {
    width: $-action-sheet-loading-size;
    height: $-action-sheet-loading-size;
  }

  // 选项名称
  @include e(name) {
    display: inline-block;
  }

  // 选项描述
  @include e(subname) {
    display: inline-block;
    margin-left: 8rpx;
    font-size: $-action-sheet-subname-fs;
    color: $-action-sheet-subname-color;
  }

  // 取消按钮样式
  @include e(cancel) {
    display: block;
    width: calc(100% - 96rpx);
    line-height: $-action-sheet-cancel-height;
    padding: 0;
    color: $-action-sheet-cancel-color;
    font-size: $-action-sheet-fs;
    text-align: center;
    border-radius: $-action-sheet-cancel-radius;
    border: none;
    background: $-action-sheet-cancel-bg;
    outline: none;
    margin: 0 auto 48rpx;
    font-weight: $-action-sheet-weight;

    &:active {
      background: $-action-sheet-active-color;
    }

    &:after {
      display: none;
    }
  }

  // 头部标题样式
  @include e(header) {
    color: $-action-sheet-color;
    position: relative;
    height: $-action-sheet-title-height !important;
    line-height: $-action-sheet-title-height !important;
    text-align: center;
    font-size: $-action-sheet-title-fs;
    font-weight: $-action-sheet-weight;
  }

  // 关闭按钮样式
  @include edeep(close) {
    position: absolute;
    top: $-action-sheet-close-top;
    right: $-action-sheet-close-right;
    color: $-action-sheet-close-color;
    font-size: $-action-sheet-close-fs;
    line-height: 1.1;
  }

  // 面板容器样式
  @include e(panels) {
    height: 168rpx;
    overflow-y: hidden;

    &:first-of-type {
      margin-top: 40rpx;
    }

    &:last-of-type {
      margin-bottom: 24rpx;
    }
  }

  // 面板内容容器
  @include e(panels-content) {
    display: flex;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  // 单个面板项样式
  @include e(panel) {
    width: 176rpx;
    flex: 0 0 auto;
    display: inline-block;
    padding: $-action-sheet-panel-padding;
  }

  // 面板图片样式
  @include e(panel-img) {
    display: block;
    width: $-action-sheet-panel-img-fs;
    height: $-action-sheet-panel-img-fs;
    margin: 0 auto;
    margin-bottom: 28rpx;
    border-radius: $-action-sheet-panel-img-radius;
  }

  // 面板标题样式
  @include e(panel-title) {
    font-size: $-action-sheet-subname-fs;
    line-height: 1.2;
    text-align: center;
    color: $-action-sheet-color;
    @include lineEllipsis;
  }
}
</style>
