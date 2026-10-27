<!-- Search 搜索框 搜索框组件，支持输入框聚焦、失焦、输入、搜索、取消、清空事件。 -->
<template>
  <!-- 搜索框根容器 -->
  <view
    :class="`wd-search ${light ? 'is-light' : ''} ${hideCancel ? 'is-without-cancel' : ''} ${customClass}`"
    :style="customStyle"
  >
    <!-- 搜索框主体区域 -->
    <view class="wd-search__block" :style="`border-radius: ${borderRadius};`" @click="handleClick">
      <!-- 前置插槽：用于自定义搜索框前面的内容 -->
      <slot name="prefix" />

      <!-- 搜索输入区域 -->
      <view class="wd-search__field">
        <!--
          覆盖层：当输入框为空且需要显示占位提示时显示
          点击时会关闭覆盖层并显示真实输入框
        -->
        <view
          v-if="!placeholderLeft"
          :style="`display: ${inputValue === '' && showPlaceHolder ? 'flex' : 'none'}; border-radius: ${borderRadius};`"
          class="wd-search__cover"
          @click="closeCover"
        >
          <wd-icon name="search" custom-class="wd-search__search-icon" />
          <text :class="`wd-search__placeholder-txt ${placeholderClass}`">
            {{ placeholder || translate('search') }}
          </text>
        </view>

        <!-- 搜索图标：当显示输入框或有内容时显示在左侧 -->
        <wd-icon
          v-if="showInput || inputValue || placeholderLeft"
          name="search"
          custom-class="wd-search__search-left-icon"
        />

        <!-- 真实输入框：根据状态控制显示/隐藏 -->
        <input
          v-if="showInput || inputValue || placeholderLeft"
          v-model="inputValue"
          :placeholder="placeholder || translate('search')"
          :placeholder-class="`wd-search__placeholder-txt ${placeholderClass}`"
          :placeholder-style="placeholderStyle"
          confirm-type="search"
          class="wd-search__input"
          :class="[customInputClass]"
          :disabled="disabled"
          :maxlength="maxlength"
          :focus="isFocused"
          @focus="handleFocus"
          @input="handleInput"
          @blur="handleBlur"
          @confirm="handleConfirm"
        />

        <!-- 清除按钮：有输入内容时显示 -->
        <wd-icon
          v-if="inputValue"
          custom-class="wd-search__clear wd-search__clear-icon"
          name="close-fill"
          @click="handleClear"
        />
      </view>
    </view>

    <!-- 取消按钮区域：支持插槽自定义 -->
    <slot v-if="!hideCancel" name="suffix">
      <view class="wd-search__cancel" @click="handleCancel">
        {{ cancelTxt || translate('cancel') }}
      </view>
    </slot>
  </view>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, computed } from 'vue'
import { addUnit, pause } from '../common/util'
import { useTranslate } from '../composables/useTranslate'
import wdIcon from '../wd-icon/wd-icon.vue'

defineOptions({
  name: 'WdSearch',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 搜索框组件属性接口
 */
interface WdSearchProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string
  /** 自定义输入框样式类 */
  customInputClass?: string

  /** 输入框内容，双向绑定 */
  modelValue?: string
  /** 搜索框占位文本 */
  placeholder?: string
  /** 搜索框右侧文本 */
  cancelTxt?: string
  /** 搜索框亮色（白色）主题 */
  light?: boolean
  /** 是否隐藏右侧取消按钮 */
  hideCancel?: boolean
  /** 是否禁用搜索框 */
  disabled?: boolean
  /** 原生属性，设置最大长度。-1 表示无限制 */
  maxlength?: number
  /** placeholder 是否居左显示 */
  placeholderLeft?: boolean
  /** 是否自动聚焦 */
  focus?: boolean
  /** 是否在点击清除按钮时聚焦输入框 */
  focusWhenClear?: boolean
  /** 原生属性，指定 placeholder 的样式，目前仅支持color,font-size和font-weight */
  placeholderStyle?: string
  /** 原生属性，指定 placeholder 的样式类 */
  placeholderClass?: string
  /** 搜索框圆角大小，支持数字(rpx)或字符串单位 */
  radius?: number | string
}

/**
 * 搜索框组件事件接口
 */
interface WdSearchEmits {
  /** 更新 modelValue */
  'update:modelValue': [value: string]
  /** 输入内容变化时触发 */
  change: [{ value: string }]
  /** 点击清除按钮时触发 */
  clear: []
  /** 点击搜索按钮或回车时触发 */
  search: [{ value: string }]
  /** 输入框获得焦点时触发 */
  focus: [{ value: string }]
  /** 输入框失去焦点时触发 */
  blur: [{ value: string }]
  /** 点击取消按钮时触发 */
  cancel: [{ value: string }]
  /** 点击搜索框时触发（仅禁用状态下触发） */
  click: []
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdSearchProps>(), {
  customStyle: '',
  customClass: '',
  customInputClass: '',
  modelValue: '',
  light: false,
  hideCancel: false,
  disabled: false,
  maxlength: -1,
  placeholderLeft: false,
  focus: false,
  focusWhenClear: false,
  placeholderClass: '',
  radius: 32, // 默认大圆角 32rpx
})

// 定义组件事件
const emit = defineEmits<WdSearchEmits>()

// 国际化翻译函数
const { translate } = useTranslate('search')

// 响应式数据：搜索框状态管理
/** 是否处于聚焦状态 */
const isFocused = ref<boolean>(false)
/** 是否显示输入框（用于实现聚焦的hack） */
const showInput = ref<boolean>(false)
/** 输入框的当前值 */
const inputValue = ref<string>('')
/** 是否显示占位符覆盖层 */
const showPlaceHolder = ref<boolean>(true)
/** 是否正在执行清除操作 */
const clearing = ref<boolean>(false)

const borderRadius = computed(() => addUnit(props.radius))

/**
 * 监听 modelValue 变化
 * 当外部传入的值发生变化时，同步到内部状态
 */
watch(
  () => props.modelValue,
  (newValue) => {
    inputValue.value = newValue
    if (newValue) {
      showInput.value = true
    }
  },
  { immediate: true },
)

/**
 * 聚焦状态切换的hack方法
 * 通过先显示输入框再设置聚焦状态来确保聚焦生效
 * @param focus 是否聚焦
 */
const hackFocus = async (focus: boolean) => {
  showInput.value = focus
  await pause()
  isFocused.value = focus
}

/**
 * 关闭覆盖层并显示输入框
 * 实现从覆盖层到真实输入框的平滑过渡
 */
const closeCover = async () => {
  if (props.disabled) return
  await pause(100)
  showPlaceHolder.value = false
  hackFocus(true)
}

/**
 * 监听 focus 属性变化
 * 当需要自动聚焦时，关闭覆盖层并显示输入框
 */
watch(
  () => props.focus,
  (newValue) => {
    if (newValue) {
      if (props.disabled) return
      closeCover()
    }
  },
)

/**
 * 组件挂载后的处理
 * 如果设置了自动聚焦，则关闭覆盖层
 */
onMounted(() => {
  if (props.focus) {
    closeCover()
  }
})

/**
 * 处理输入事件
 * 同步输入值并触发相关事件
 */
const handleInput = (event: any) => {
  inputValue.value = event.detail.value
  emit('update:modelValue', event.detail.value)
  emit('change', {
    value: event.detail.value,
  })
}

/**
 * 处理清除按钮点击事件
 * 清空输入内容并根据配置决定是否重新聚焦
 */
const handleClear = async () => {
  inputValue.value = ''

  if (props.focusWhenClear) {
    clearing.value = true
    isFocused.value = false
  }

  await pause()

  if (props.focusWhenClear) {
    showPlaceHolder.value = false
    hackFocus(true)
  } else {
    showPlaceHolder.value = true
    hackFocus(false)
  }

  emit('change', { value: '' })
  emit('update:modelValue', '')
  emit('clear')
}

/**
 * 处理确认搜索事件
 * 当用户点击搜索按钮或按下回车时触发
 */
const handleConfirm = ({ detail: { value } }: any) => {
  emit('search', { value })
}

/**
 * 处理输入框获得焦点事件
 * 隐藏占位符覆盖层并触发聚焦事件
 */
const handleFocus = () => {
  showPlaceHolder.value = false
  emit('focus', {
    value: inputValue.value,
  })
}

/**
 * 处理输入框失去焦点事件
 * 根据输入内容决定是否显示覆盖层
 */
const handleBlur = async () => {
  // 等待150毫秒，确保清除操作执行完毕
  await pause(150)

  if (clearing.value) {
    clearing.value = false
    return
  }

  // 根据输入值决定显示状态
  showPlaceHolder.value = !inputValue.value
  showInput.value = !showPlaceHolder.value
  isFocused.value = false

  emit('blur', {
    value: inputValue.value,
  })
}

/**
 * 处理搜索框点击事件
 * 仅在禁用状态下触发，用于跳转到搜索页面等场景
 */
const handleClick = () => {
  if (props.disabled) {
    emit('click')
  }
}

/**
 * 处理取消按钮点击事件
 * 触发取消事件，通常用于关闭搜索界面
 */
const handleCancel = () => {
  emit('cancel', {
    value: inputValue.value,
  })
}
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/_mixin.scss';
@import '../common/abstracts/variable.scss';

// 暗色主题样式
.wot-theme-dark {
  @include b(search) {
    background: $-dark-background4;

    @include e(block) {
      background-color: $-dark-background;
    }

    @include e(input) {
      color: $-dark-color;
    }

    @include e(cover) {
      background-color: $-dark-background;
    }

    @include e(search-icon) {
      color: $-dark-color;
    }
    @include e(search-left-icon) {
      color: $-dark-color;
    }
    @include e(clear) {
      color: $-dark-color;
    }
    @include e(cancel) {
      color: $-dark-color;
    }

    @include when(light) {
      background: $-dark-background4;

      .wd-search__block {
        background: $-dark-background7;
      }

      .wd-search__cover {
        background: $-dark-background7;
      }
    }
  }
}

// 搜索框主体样式
@include b(search) {
  display: flex;
  padding: $-search-padding;
  align-items: center;
  background: #fff;

  // 搜索框主体区域
  @include e(block) {
    flex: 1;
    background-color: $-search-input-bg;
    border-radius: $-search-input-radius;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
  }

  // 输入区域容器
  @include e(field) {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
  }

  // 输入框样式
  @include e(input) {
    flex: 1;
    height: $-search-input-height;
    box-sizing: border-box;
    padding: $-search-input-padding;
    border: none;
    background: transparent;
    font-size: $-search-input-fs;
    -webkit-appearance: none;
    outline: none;
    color: $-search-input-color;
    z-index: 0;

    @include lineEllipsis;

    &::-webkit-search-cancel-button {
      -webkit-appearance: none;
    }
  }

  // 覆盖层样式
  @include e(cover) {
    width: 100%;
    height: $-search-input-height;
    background-color: $-search-input-bg;
    line-height: $-search-input-height;
    font-size: $-search-input-fs;
    border-radius: $-search-input-radius; // 默认圆角，会被内联样式覆盖
    flex-direction: row;
    justify-content: center; // 默认居中对齐
    align-items: center;
  }

  // 搜索图标样式
  @include edeep(search-icon) {
    margin-right: 16rpx;
    color: $-search-icon-color;
    font-size: $-search-icon-size;
  }

  // 左侧搜索图标样式
  @include edeep(search-left-icon) {
    position: absolute;
    font-size: $-search-icon-size;
    top: 50%;
    left: 32rpx;
    transform: translateY(-50%);
    color: $-search-icon-color;
  }

  // 占位符文字样式
  @include e(placeholder-txt) {
    color: $-search-placeholder-color;
    font-size: $-search-input-fs;
  }

  // 清除按钮样式
  @include edeep(clear) {
    position: absolute;
    right: 0;
    padding: 12rpx 18rpx 12rpx 14rpx;
    color: $-search-cancel-color;
  }

  @include edeep(clear-icon) {
    vertical-align: middle;
    font-size: $-search-clear-icon-size;
  }

  // 取消按钮样式
  @include e(cancel) {
    padding: $-search-cancel-padding;
    height: $-search-input-height;
    line-height: $-search-input-height;
    font-size: $-search-cancel-fs;
    color: $-search-cancel-color;
    -webkit-tap-highlight-color: transparent;
  }

  // 亮色主题样式
  @include when(light) {
    background: $-search-light-bg;

    .wd-search__block {
      background: #fff;
    }

    .wd-search__cover {
      background: #fff;
    }
  }

  // 无取消按钮样式
  @include when(without-cancel) {
    padding-right: $-search-side-padding;
  }
}
</style>
