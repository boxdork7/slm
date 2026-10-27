<!-- Cell 单元格 单元格为列表中的单个展示项。 -->
<template>
  <view
    :class="`wd-cell ${isBorder ? 'is-border' : ''} ${size ? `is-${size}` : ''} ${center ? 'is-center' : ''} ${customClass}`"
    :style="customStyle"
    :hover-class="isLink || clickable ? 'is-hover' : 'none'"
    :hover-stay-time="240"
    @click="onClick"
  >
    <view
      :class="`wd-cell__wrapper ${vertical ? 'is-vertical' : ''} ${label ? 'is-label' : ''}`"
    >
      <view
        :class="`wd-cell__left ${isRequired ? 'is-required' : ''} ${!icon && leftBorder ? 'has-left-border' : ''}`"
        :style="`
          ${titleWidth ? `min-width:${titleWidth};max-width:${titleWidth};` : ''}
          ${!icon && leftBorder ? `--border-color: ${iconColor || '#1989fa'};` : ''}
        `"
      >
        <!-- 左侧icon部分 -->
        <wd-icon
          v-if="icon"
          :name="icon"
          :custom-class="`wd-cell__icon ${customIconClass}`"
          :style="iconColor ? `color: ${iconColor};` : ''"
          :size="iconSize"
        />
        <slot v-else name="icon" />

        <view class="wd-cell__title" :style="getTitleStyle()">
          <!-- title BEGIN -->
          <view v-if="title" :class="customTitleClass">
            {{ title }}
          </view>
          <slot v-else name="title" />
          <!-- title END -->

          <!-- label BEGIN -->
          <view v-if="label" :class="`wd-cell__label ${customLabelClass}`">
            {{ label }}
          </view>
          <slot v-else name="label" />
          <!-- label END -->
        </view>
      </view>
      <!-- right content BEGIN -->
      <view
        class="wd-cell__right"
        :style="`flex: ${rightFlex};`"
      >
        <view class="wd-cell__body">
          <!-- 文案内容 -->
          <view :class="`wd-cell__value ${customValueClass}`" :style="valueColor ? `color: ${valueColor};` : ''">
            <slot>{{ value }}</slot>
          </view>
          <!-- 箭头 -->
          <wd-icon
            v-if="isLink"
            custom-class="wd-cell__arrow-right"
            :name="arrowDirection"
            :style="valueColor ? `color: ${valueColor};` : ''"
          />
          <slot v-else name="right-icon" />
        </view>
        <view v-if="errorMessage" class="wd-cell__error-message">
          {{ errorMessage }}
        </view>
      </view>
      <!-- right content END -->
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { FormItemRule } from '../wd-form/wd-form.vue'
import { computed } from 'vue'
import { isDef } from '../common/util'
import { useCell } from '../composables/useCell'
import { useParent } from '../composables/useParent'
import { FORM_KEY } from '../wd-form/wd-form-key'
import wdIcon from '../wd-icon/wd-icon.vue'
import type { IconName } from '@/wd/components/wd-icon/wd-icon.vue'

defineOptions({
  name: 'WdCell',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * Cell 组件属性接口
 */
interface WdCellProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 标题 */
  title?: string
  /** 右侧内容 */
  value?: string | number
  /** 图标类名 */
  icon?: IconName
  /** 描述信息 */
  label?: string

  /** 是否为跳转链接 */
  isLink?: boolean
  /** 跳转地址 */
  to?: string
  /** 跳转时是否替换栈顶页面 */
  replace?: boolean
  /** 开启点击反馈，is-link 默认开启 */
  clickable?: boolean

  /** 设置单元格大小，可选值：large */
  size?: string
  /** 是否展示边框线 */
  border?: boolean
  /** 设置左侧标题宽度 */
  titleWidth?: string
  /** 是否垂直居中，默认顶部居中 */
  center?: boolean
  /** 是否必填 */
  required?: boolean
  /** 表单属性，上下结构 */
  vertical?: boolean

  /** 表单域 model 字段名，在使用表单校验功能的情况下，该属性是必填的 */
  prop?: string
  /** 表单验证规则，结合wd-form组件使用 */
  rules?: FormItemRule[]

  /** icon 使用 slot 时的自定义样式 */
  customIconClass?: string
  /** label 使用 slot 时的自定义样式 */
  customLabelClass?: string
  /** value 使用 slot 时的自定义样式 */
  customValueClass?: string
  /** title 使用 slot 时的自定义样式 */
  customTitleClass?: string

  /** 左侧竖线边框，仅在没有 icon 时生效 */
  leftBorder?: boolean
  /** 图标颜色，同时控制左侧竖线颜色 */
  iconColor?: string
  /** 标题颜色 */
  titleColor?: string
  /** 标题是否加粗 */
  titleBold?: boolean
  /** 右侧内容颜色，右侧图标会跟随此颜色 */
  valueColor?: string

  /** 右侧区域的 flex 值，默认为 1 */
  rightFlex?: number | string
  /** 箭头方向 */
  arrowDirection?: 'left' | 'up' | 'down' | 'right'
  /** 左侧图标大小 */
  iconSize?: string | number
}

/**
 * Cell 组件事件接口
 */
interface WdCellEmits {
  /** 点击 cell 时触发 */
  click: []
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdCellProps>(), {
  customStyle: '',
  customClass: '',
  value: '',
  isLink: false,
  replace: false,
  clickable: false,
  center: false,
  required: false,
  vertical: false,
  rules: () => [],
  customIconClass: '',
  customLabelClass: '',
  customValueClass: '',
  customTitleClass: '',
  leftBorder: false,
  iconColor: '',
  titleColor: '',
  titleBold: false,
  valueColor: '',
  rightFlex: 1, // 新增属性默认值
  arrowDirection: 'right',
})

// 定义组件事件
const emit = defineEmits<WdCellEmits>()

const cell = useCell()

const isBorder = computed(() => {
  return Boolean(isDef(props.border) ? props.border : cell.border.value)
})

const { parent: form } = useParent(FORM_KEY)

const errorMessage = computed(() => {
  if (form && props.prop && form.errorMessages && form.errorMessages[props.prop]) {
    return form.errorMessages[props.prop]
  } else {
    return ''
  }
})

// 是否展示必填
const isRequired = computed(() => {
  let formRequired = false
  if (form && form.props.rules) {
    const rules = form.props.rules
    for (const key in rules) {
      if (
        Object.prototype.hasOwnProperty.call(rules, key) &&
        key === props.prop &&
        Array.isArray(rules[key])
      ) {
        formRequired = rules[key].some((rule) => rule.required)
      }
    }
  }
  return props.required || props.rules.some((rule) => rule.required) || formRequired
})

/**
 * 获取标题样式
 * 统一处理颜色和字体粗细
 */
const getTitleStyle = () => {
  const styles = []

  // 标题颜色
  if (props.titleColor) {
    styles.push(`color: ${props.titleColor}`)
  }

  // 标题粗细 - 简化为布尔值控制
  if (props.titleBold) {
    styles.push('font-weight: bold')
  }

  return styles.join('; ')
}

/**
 * 处理点击 cell 事件
 */
const onClick = () => {
  const url = props.to

  if (props.clickable || props.isLink) {
    emit('click')
  }
  if (url && props.isLink) {
    if (props.replace) {
      uni.redirectTo({ url })
    } else {
      uni.navigateTo({ url })
    }
  }
}
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable.scss';
@import '../common/abstracts/_mixin.scss';

// 暗色主题样式
.wot-theme-dark {
  @include b(cell) {
    background-color: $-dark-background2;
    color: $-dark-color;

    @include e(value) {
      color: $-dark-color3;
    }

    @include e(label) {
      color: $-dark-color3;
    }

    @include when(hover) {
      background-color: $-dark-background4;
    }

    @include when(border) {
      .wd-cell__wrapper {
        @include halfPixelBorder('top', 0, $-dark-border-color);
      }
    }

    :deep(.wd-cell__arrow-right) {
      color: $-dark-color;
    }
  }
}

// Cell 主体样式
@include b(cell) {
  position: relative;
  padding-left: $-cell-padding;
  background-color: $-color-white;
  text-decoration: none;
  color: $-cell-title-color;
  line-height: $-cell-line-height;
  -webkit-tap-highlight-color: transparent;

  @include when(border) {
    .wd-cell__wrapper {
      @include halfPixelBorder('top');
    }
  }

  // 包装器样式
  @include e(wrapper) {
    position: relative;
    display: flex;
    padding: $-cell-wrapper-padding $-cell-padding $-cell-wrapper-padding 0;
    justify-content: space-between;
    align-items: flex-start;

    @include when(vertical) {
      display: block;

      .wd-cell__right {
        margin-top: $-cell-vertical-top;
      }

      .wd-cell__value {
        text-align: left;
      }

      .wd-cell__left {
        margin-right: 0;
      }
    }

    @include when(label) {
      padding: $-cell-wrapper-padding-with-label $-cell-padding $-cell-wrapper-padding-with-label 0;
    }
  }

  // 左侧区域样式
  @include e(left) {
    position: relative;
    flex: 1;
    display: flex;
    text-align: left;
    font-size: $-cell-title-fs;
    box-sizing: border-box;
    margin-right: $-cell-padding;

    @include when(required) {
      padding-left: 24rpx;

      &::after {
        position: absolute;
        content: '*';
        top: 0;
        left: 0;
        font-size: $-cell-required-size;
        color: $-cell-required-color;
      }
    }

    // 左侧竖线边框样式
    &.has-left-border {
      position: relative;
      padding-left: 16rpx;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 6rpx;
        height: 36rpx;
        background-color: var(--border-color, #1989fa);
        border-radius: 4rpx;
      }
    }
  }

  // 右侧区域样式
  @include e(right) {
    position: relative;
  }

  // 标题样式
  @include e(title) {
    flex: 1;
    width: 100%;
    font-size: $-cell-title-fs;
  }

  // 标签样式
  @include e(label) {
    margin-top: 4rpx;
    font-size: $-cell-label-fs;
    color: $-cell-label-color;
  }

  // 图标样式
  @include edeep(icon) {
    display: block;
    position: relative;
    margin-right: $-cell-icon-right;
    font-size: $-cell-icon-size;
    height: $-cell-line-height;
    line-height: $-cell-line-height;
  }

  // 主体内容样式
  @include e(body) {
    display: flex;
  }

  // 值样式
  @include e(value) {
    position: relative;
    flex: 1;
    font-size: $-cell-value-fs;
    color: $-cell-value-color;
    text-align: right;
    vertical-align: middle;
  }

  // 箭头样式
  @include edeep(arrow-right) {
    display: block;
    margin-left: 16rpx;
    width: $-cell-arrow-size;
    font-size: $-cell-arrow-size;
    color: $-cell-arrow-color;
    height: $-cell-line-height;
    line-height: $-cell-line-height;
  }

  // 错误信息样式
  @include e(error-message) {
    color: $-form-item-error-message-color;
    font-size: $-form-item-error-message-font-size;
    line-height: $-form-item-error-message-line-height;
    text-align: left;
    vertical-align: middle;
  }

  // 链接状态样式
  @include when(link) {
    -webkit-tap-highlight-color: $-cell-tap-bg;
  }

  // 悬停状态样式
  @include when(hover) {
    background-color: $-cell-tap-bg;
  }

  // 大尺寸样式
  @include when(large) {
    .wd-cell__title {
      font-size: $-cell-title-fs-large;
    }

    .wd-cell__wrapper {
      padding-top: $-cell-wrapper-padding-large;
      padding-bottom: $-cell-wrapper-padding-large;
    }

    .wd-cell__label {
      font-size: $-cell-label-fs-large;
    }

    :deep(.wd-cell__icon) {
      font-size: $-cell-icon-size-large;
    }
  }

  // 居中对齐样式
  @include when(center) {
    .wd-cell__wrapper {
      align-items: center;
    }
  }
}
</style>
