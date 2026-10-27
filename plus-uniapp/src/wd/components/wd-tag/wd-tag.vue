<!--
Tag 标签 用于标记状态或者概括主要内容。

使用示例：

1. 基础用法：
<wd-tag type="primary">标签</wd-tag>

2. 字典自动映射（自动显示文本和颜色）：
<wd-tag :options="sys_enable_status" value="1"></wd-tag>

其中 sys_enable_status 是字典数据，包含 elTagType 字段：
[
  { label: '正常', value: '1', elTagType: 'success' },
  { label: '停用', value: '0', elTagType: 'danger' }
]

3. 支持的 elTagType 类型：
- 'primary': 蓝色（主要）
- 'success': 绿色（成功）
- 'warning': 橙色（警告）
- 'danger': 红色（危险）
- 'info': 灰色（信息，会自动映射为 'default'）
-->
<template>
  <view
    :class="`wd-tag ${customClass} ${computedTagClass}`"
    :style="`${!plain && bgColor ? `background: ${bgColor};` : ''}${bgColor ? `border-color: ${bgColor};` : ''}${customStyle}`"
    @click="handleClick"
  >
    <view v-if="useIconSlot" class="wd-tag__icon">
      <slot name="icon" />
    </view>
    <wd-icon v-else-if="icon" :name="icon" custom-class="wd-tag__icon" />
    <view class="wd-tag__text" :style="`${color ? `color: ${color};` : ''}`">
      <!-- 如果有displayText，显示计算的文本，否则显示插槽内容 -->
      <template v-if="displayText">{{ displayText }}</template>
      <slot v-else />
    </view>
    <view v-if="closable && round" class="wd-tag__close" @click.stop="handleClose">
      <wd-icon name="close-outline-fill" />
    </view>
    <input
      v-if="dynamicInput && dynamic"
      v-model="dynamicValue"
      class="wd-tag__add-text"
      :placeholder="translate('placeholder')"
      type="text"
      :focus="true"
      @blur="handleBlur"
      @confirm="handleConfirm"
    />
    <view
      v-else-if="dynamic"
      class="wd-tag__dynamic"
      :style="`${color ? `color: ${color};` : ''}`"
      @click.stop="handleAdd"
    >
      <slot v-if="$slots.add" name="add" />
      <template v-else>
        <view class="wd-tag__icon">
          <wd-icon name="add" size="24" />
        </view>
        <view class="wd-tag__text">{{ translate('add') }}</view>
      </template>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useTranslate } from '../composables/useTranslate'
import wdIcon from '../wd-icon/wd-icon.vue'

defineOptions({
  name: 'WdTag',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 标签类型
 */
export type TagType = 'default' | 'primary' | 'success' | 'warning' | 'danger'

/**
 * 标签组件属性接口
 */
interface WdTagProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 是否开启图标插槽 */
  useIconSlot?: boolean
  /** 标签类型，可选值：'default' / 'primary' / 'danger' / 'warning' / 'success' */
  type?: TagType
  /** 左侧图标 */
  icon?: string
  /** 是否可关闭（只对圆角类型支持） */
  closable?: boolean
  /** 幽灵类型 */
  plain?: boolean
  /** 是否为新增标签 */
  dynamic?: boolean
  /** 文字颜色 */
  color?: string
  /** 背景色和边框色 */
  bgColor?: string
  /** 圆角类型 */
  round?: boolean
  /** 标记类型 */
  mark?: boolean
  /** 显示的值（支持字典翻译和自动匹配颜色） */
  value?: string | number
  /** 字典选项数组，用于值翻译和自动匹配颜色（支持 elTagType 字段） */
  options?: Array<DictItem>
}

/**
 * 标签组件事件接口
 */
interface WdTagEmits {
  /** 点击标签时触发 */
  click: [event: Event]
  /** 点击关闭按钮时触发 */
  close: [event: Event]
  /** 新增标签确认时触发 */
  confirm: [data: { value: string }]
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdTagProps>(), {
  customStyle: '',
  customClass: '',
  useIconSlot: false,
  type: 'default',
  icon: '',
  closable: false,
  plain: false,
  dynamic: false,
  color: '',
  bgColor: '',
  round: false,
  mark: false,
  value: undefined,
  options: () => [],
})

// 定义组件事件
const emit = defineEmits<WdTagEmits>()

// 多语言支持
const { translate } = useTranslate('tag')

// 响应式数据
const dynamicValue = ref<string>('')
const dynamicInput = ref<boolean>(false)

/**
 * 查找匹配的字典项
 * 根据 value 从 options 中查找对应的字典项
 */
const matchedOption = computed(() => {
  const { value, options } = props

  // 如果没有 value 或 options，返回 null
  if (value === undefined || !options || options.length === 0) {
    return null
  }

  // 查找匹配的选项（支持字符串和数字的比较）
  return options.find((opt) => String(opt.value) === String(value)) || null
})

/**
 * 计算显示文本
 * 支持字典翻译和value属性
 */
const displayText = computed(() => {
  const { value } = props

  // 如果找到匹配的字典项，显示其 label
  if (matchedOption.value) {
    return matchedOption.value.label
  }

  // 如果只有value，直接显示
  if (value !== undefined) {
    return String(value)
  }

  // 否则使用插槽内容
  return null
})

/**
 * 计算标签类型
 * 优先使用字典项的 elTagType，其次使用 props.type
 */
const computedType = computed(() => {
  // 如果字典项有 elTagType，使用它（将 'info' 映射为 'default'）
  if (matchedOption.value?.elTagType) {
    // Element UI 的 'info' 类型对应 wd-tag 的 'default' 类型
    return matchedOption.value.elTagType === 'info' ? 'default' : matchedOption.value.elTagType
  }

  // 否则使用 props.type
  return props.type
})

/**
 * 计算标签类名
 * 根据各种属性状态动态生成类名
 */
const computedTagClass = computed(() => {
  const { plain, round, mark, dynamic, icon, useIconSlot } = props
  const tagClassList: string[] = []

  // 添加类型类名（使用计算后的类型，支持字典自动匹配）
  const finalType = computedType.value
  if (finalType) {
    tagClassList.push(`is-${finalType}`)
  }

  // 添加样式状态类名
  if (plain) tagClassList.push('is-plain')
  if (round) tagClassList.push('is-round')
  if (mark) tagClassList.push('is-mark')
  if (dynamic) tagClassList.push('is-dynamic')
  if (dynamicInput.value) tagClassList.push('is-dynamic-input')

  // 添加图标类名
  if (icon || useIconSlot) {
    tagClassList.push('is-icon')
  }

  return tagClassList.join(' ')
})

/**
 * 监听标签类型变化
 * 验证类型值的有效性
 */
watch(
  computedType,
  (newValue) => {
    if (!newValue) return

    const validTypes = ['primary', 'danger', 'warning', 'success', 'default']
    if (!validTypes.includes(newValue)) {
      console.error(`type must be one of ${validTypes.toString()}`)
    }
  },
  { immediate: true },
)

/**
 * 处理标签点击事件
 * 触发点击事件，传递原始事件对象
 */
const handleClick = (event: Event) => {
  emit('click', event)
}

/**
 * 处理关闭按钮点击事件
 * 触发关闭事件，传递原始事件对象
 */
const handleClose = (event: Event) => {
  emit('close', event)
}

/**
 * 处理新增标签点击事件
 * 显示输入框并清空输入值
 */
const handleAdd = () => {
  dynamicInput.value = true
  dynamicValue.value = ''
}

/**
 * 设置动态输入状态
 * 隐藏输入框
 */
const setDynamicInput = () => {
  dynamicInput.value = false
}
/**
 * 处理输入框失焦事件
 * 隐藏输入框
 */
const handleBlur = () => {
  setDynamicInput()
}

/**
 * 处理输入确认事件
 * 隐藏输入框并触发确认事件
 */
const handleConfirm = (event: any) => {
  setDynamicInput()
  emit('confirm', {
    value: event.detail.value,
  })
}
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 标签类型样式混合器
@mixin tag-type-style($normalColor, $normalBg) {
  background: $normalBg;

  @include when(plain) {
    background: transparent;
    color: $normalColor;
    border: 2rpx solid $normalColor;
    padding: 4rpx 12rpx;
  }

  @include when(round) {
    line-height: 1.2;
    font-size: $-tag-fs;
    padding: 8rpx 22rpx;
    background: transparent;
    color: if($normalColor != $-tag-info-color, $normalColor, $-tag-round-color);
    border: 1rpx solid if($normalColor != $-tag-info-color, $normalColor, $-tag-round-border-color);
    border-radius: $-tag-round-radius;
  }

  @include when(mark) {
    padding: 4rpx 12rpx;
    border-radius: $-tag-mark-radius;

    @include when(plain) {
      padding: 4rpx 12rpx;
    }
  }

  @include when(active) {
    color: $-tag-primary-color;
    border-color: $-tag-primary-color;
  }
}

// 标签组件样式
@include b(tag) {
  font-size: $-tag-small-fs;
  display: inline-flex;
  align-items: center;
  color: $-tag-color;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
  transition: opacity 0.3s;
  vertical-align: middle;
  line-height: initial;

  // 不同类型的标签样式
  @include when(default) {
    @include tag-type-style($-tag-info-color, $-tag-info-bg);
  }

  @include when(primary) {
    @include tag-type-style($-tag-primary-color, $-tag-primary-bg);
  }

  @include when(danger) {
    @include tag-type-style($-tag-danger-color, $-tag-danger-bg);
  }

  @include when(warning) {
    @include tag-type-style($-tag-warning-color, $-tag-warning-bg);
  }

  @include when(success) {
    @include tag-type-style($-tag-success-color, $-tag-success-bg);
  }

  // 图标状态样式
  @include when(icon) {
    font-size: $-tag-fs;
    line-height: 1.2;
    padding: 4rpx 10rpx;
  }

  // 动态标签样式
  @include when(dynamic) {
    box-sizing: border-box;
    width: 176rpx;
    transition: 0.3s;

    &:active {
      color: $-tag-primary-color;
      border-color: $-tag-primary-color;
    }
  }

  @include when(dynamic-input) {
    border-color: $-tag-primary-color;
  }

  // 动态标签内容区域
  @include e(dynamic) {
    display: inline-flex; // 使用 flex 布局确保水平排列
    align-items: center; // 垂直居中对齐
    width: 100%; // 占满容器宽度
  }

  // 图标样式
  @include edeep(icon) {
    display: inline-flex; // 使用 flex 确保图标内容居中
    align-items: center; // 垂直居中
    justify-content: center; // 水平居中
    margin-right: 6rpx; // 调整右边距
    font-size: 20rpx; // 明确设置图标大小
    line-height: 1; // 设置行高为 1
    flex-shrink: 0; // 防止图标被压缩
  }

  // 文本样式
  @include e(text) {
    display: inline-flex; // 使用 flex 布局
    align-items: center; // 垂直居中对齐
    line-height: 1.2; // 设置合适的行高
    flex: 1; // 允许文本占据剩余空间
  }

  // 新增文本输入框样式
  @include e(add-text) {
    width: 120rpx;
    height: 28rpx;
    min-height: 28rpx;
    display: inline-block;
    font-size: $-tag-fs;
    vertical-align: middle; // 使用 middle 对齐
    padding: 0;
    border: none;
    outline: none;
    background: transparent;
    line-height: 1.2;
  }

  // 关闭按钮样式
  @include e(close) {
    display: inline-flex; // 使用 flex 布局
    align-items: center; // 垂直居中
    justify-content: center; // 水平居中
    margin-left: 6rpx; // 调整左边距
    margin-right: -4rpx; // 调整右边距
    font-size: $-tag-close-size;
    height: 28rpx;
    line-height: 1; // 设置行高为 1
    color: $-tag-close-color;
    flex-shrink: 0; // 防止按钮被压缩

    &:active {
      color: $-tag-close-active-color;
    }
  }

  // 圆角标签的关闭按钮特殊样式
  @include when(round) {
    @include e(close) {
      margin-left: 8rpx;
      margin-right: -8rpx; // 调整圆角模式下的边距
    }
  }

  // 新增按钮样式
  @include edeep(add) {
    display: inline-flex; // 使用 flex 布局
    align-items: center; // 垂直居中对齐
  }
}
</style>
