<!-- Button 按钮  按钮用于触发一个操作，如提交表单或打开链接 -->
<template>
  <button
    v-if="!stopClickPropagation"
    :id="buttonId"
    :hover-class="getHoverClass"
    :style="customStyle"
    :class="getButtonClass"
    :hover-start-time="hoverStartTime"
    :hover-stay-time="hoverStayTime"
    :open-type="disabled || loading ? undefined : openType"
    :send-message-title="sendMessageTitle"
    :send-message-path="sendMessagePath"
    :send-message-img="sendMessageImg"
    :app-parameter="appParameter"
    :show-message-card="showMessageCard"
    :session-from="sessionFrom"
    :lang="lang"
    :hover-stop-propagation="hoverStopPropagation"
    :scope="scope"
    @click="handleClick"
    @getAuthorize="handleGetAuthorize"
    @getuserinfo="handleGetuserinfo"
    @contact="handleConcat"
    @getphonenumber="handleGetphonenumber"
    @error="handleError"
    @launchapp="handleLaunchapp"
    @opensetting="handleOpensetting"
    @chooseavatar="handleChooseavatar"
    @agreeprivacyauthorization="handleAgreePrivacyAuthorization"
    @getrealtimephonenumber="handleGetrealtimephonenumber"
  >
    <view v-if="invisible !== true" class="wd-button__content">
      <view v-if="loading" class="wd-button__loading">
        <view class="wd-button__loading-svg" :style="`background-image: url(${loadingIconSvg});`" />
      </view>
      <wd-icon
        v-else-if="icon"
        custom-class="wd-button__icon"
        :name="icon"
        :class-prefix="classPrefix"
        :size="iconSize"
        :color="iconColor"
      />
      <view class="wd-button__text">
        <slot />
      </view>
    </view>
  </button>
  <button
    v-else
    :id="buttonId"
    :hover-class="getHoverClass"
    :style="customStyle"
    :class="getButtonClass"
    :hover-start-time="hoverStartTime"
    :hover-stay-time="hoverStayTime"
    :open-type="disabled || loading ? undefined : openType"
    :send-message-title="sendMessageTitle"
    :send-message-path="sendMessagePath"
    :send-message-img="sendMessageImg"
    :app-parameter="appParameter"
    :show-message-card="showMessageCard"
    :session-from="sessionFrom"
    :lang="lang"
    :hover-stop-propagation="hoverStopPropagation"
    :scope="scope"
    @click.stop="handleClick"
    @getAuthorize="handleGetAuthorize"
    @getuserinfo="handleGetuserinfo"
    @contact="handleConcat"
    @getphonenumber="handleGetphonenumber"
    @error="handleError"
    @launchapp="handleLaunchapp"
    @opensetting="handleOpensetting"
    @chooseavatar="handleChooseavatar"
    @agreeprivacyauthorization="handleAgreePrivacyAuthorization"
    @getrealtimephonenumber="handleGetrealtimephonenumber"
  >
    <view v-if="invisible !== true" class="wd-button__content">
      <view v-if="loading" class="wd-button__loading">
        <view class="wd-button__loading-svg" :style="`background-image: url(${loadingIconSvg});`" />
      </view>
      <wd-icon
        v-else-if="icon"
        custom-class="wd-button__icon"
        :name="icon"
        :class-prefix="classPrefix"
        :size="iconSize"
        :color="iconColor"
      />
      <view class="wd-button__text">
        <slot />
      </view>
    </view>
  </button>
</template>

<script lang="ts" setup>
import type { IconName } from '@/wd/components/wd-icon/wd-icon.vue'
import { ref, watch, computed } from 'vue'
import { encode } from '../common/base64'
import wdIcon from '../wd-icon/wd-icon.vue'

defineOptions({
  name: 'WdButton',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 按钮组件属性接口
 */
export interface WdButtonProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 是否为幽灵按钮 */
  plain?: boolean
  /** 是否为圆角按钮 */
  round?: boolean
  /** 是否禁用按钮 */
  disabled?: boolean
  /** 是否为细边框 */
  hairline?: boolean
  /** 是否为块状按钮 */
  block?: boolean
  /** 是否为隐形按钮（透明覆盖层模式） */
  invisible?: boolean

  /** 按钮类型，可选值：primary / success / info / warning / error / default / text / icon */
  type?: ButtonType
  /** 按钮尺寸，可选值：small / medium / large */
  size?: ButtonSize
  /** 图标类名 */
  icon?: IconName
  /** 类名前缀，用于使用自定义图标 */
  classPrefix?: string
  /** 图标大小 */
  iconSize?: string | number
  /** 图标颜色 */
  iconColor?: string
  /** 是否为加载中按钮 */
  loading?: boolean
  /** 加载图标颜色 */
  loadingColor?: string

  /** 开放能力 */
  openType?: ButtonOpenType
  /** 是否阻止本节点的祖先节点出现点击态 */
  hoverStopPropagation?: boolean
  /** 是否阻止点击事件冒泡，默认 false */
  stopClickPropagation?: boolean
  /** 返回用户信息的语言 */
  lang?: ButtonLang
  /** 会话来源，open-type="contact"时有效 */
  sessionFrom?: string
  /** 会话内消息卡片标题，open-type="contact"时有效 */
  sendMessageTitle?: string
  /** 会话内消息卡片点击跳转小程序路径，open-type="contact"时有效 */
  sendMessagePath?: string
  /** 会话内消息卡片图片，open-type="contact"时有效 */
  sendMessageImg?: string
  /** 打开 APP 时，向 APP 传递的参数，open-type=launchApp时有效 */
  appParameter?: string
  /** 是否显示会话内消息卡片，open-type="contact"时有效 */
  showMessageCard?: boolean
  /** 按钮的唯一标识，可用于设置隐私同意授权按钮的id */
  buttonId?: string
  /** 支付宝小程序授权范围，当 open-type 为 getAuthorize 时有效 */
  scope?: ButtonScope
}

/**
 * 按钮组件事件接口
 */
interface WdButtonEmits {
  /** 点击按钮时触发 */
  click: [event: any]
  /** 获取用户信息回调 */
  getuserinfo: [detail: any]
  /** 客服消息回调 */
  contact: [detail: any]
  /** 获取用户手机号回调 */
  getphonenumber: [detail: any]
  /** 使用开放能力时，发生错误的回调 */
  error: [detail: any]
  /** 打开 APP 成功的回调 */
  launchapp: [detail: any]
  /** 在打开授权设置页后回调 */
  opensetting: [detail: any]
  /** 获取用户头像回调 */
  chooseavatar: [detail: any]
  /** 用户同意隐私协议事件回调 */
  agreeprivacyauthorization: [detail: any]
  /** 获取用户实时手机号回调 */
  getrealtimephonenumber: [detail: any]
}

/**
 * 按钮类型
 */
type ButtonType = 'primary' | 'success' | 'info' | 'warning' | 'error' | 'default' | 'text' | 'icon'

/**
 * 按钮尺寸
 */
type ButtonSize = 'small' | 'medium' | 'large'

/**
 * 按钮语言
 */
type ButtonLang = 'zh_CN' | 'zh_TW' | 'en'

/**
 * 按钮开放能力类型
 */
type ButtonOpenType =
  | 'feedback'
  | 'share'
  | 'getUserInfo'
  | 'contact'
  | 'getPhoneNumber'
  | 'launchApp'
  | 'openSetting'
  | 'chooseAvatar'
  | 'getAuthorize'
  | 'lifestyle'
  | 'contactShare'
  | 'openGroupProfile'
  | 'openGuildProfile'
  | 'openPublicProfile'
  | 'shareMessageToFriend'
  | 'addFriend'
  | 'addColorSign'
  | 'addGroupApp'
  | 'addToFavorites'
  | 'chooseAddress'
  | 'chooseInvoiceTitle'
  | 'login'
  | 'subscribe'
  | 'favorite'
  | 'watchLater'
  | 'openProfile'
  | 'agreePrivacyAuthorization'
  | 'getRealtimePhoneNumber'

/**
 * 按钮授权范围
 */
type ButtonScope = 'phoneNumber' | 'userInfo'

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdButtonProps>(), {
  customStyle: '',
  customClass: '',
  plain: false,
  round: true,
  disabled: false,
  hairline: false,
  block: false,
  invisible: false,
  type: 'primary',
  size: 'medium',
  classPrefix: 'wd-icon',
  loading: false,
})

// 定义组件事件
const emit = defineEmits<WdButtonEmits>()

// 响应式数据
const hoverStartTime = ref<number>(20)
const hoverStayTime = ref<number>(70)
const loadingIconSvg = ref<string>('')

/**
 * 计算 hover-class
 * 隐形按钮时不添加任何 hover 效果
 */
const getHoverClass = computed(() => {
  if (props.invisible) {
    return ''
  }
  return props.disabled || props.loading ? '' : 'wd-button--active'
})

/**
 * 计算按钮类名
 * 隐形按钮时使用特殊类名
 */
const getButtonClass = computed(() => {
  if (props.invisible) {
    return `wd-button is-invisible ${props.customClass}`
  }

  return `wd-button is-${props.type} is-${props.size} ${props.customClass} ${
    props.round ? 'is-round' : ''
  } ${props.hairline ? 'is-hairline' : ''} ${props.plain ? 'is-plain' : ''} ${
    props.disabled ? 'is-disabled' : ''
  } ${props.block ? 'is-block' : ''} ${props.loading ? 'is-loading' : ''}`
})

/**
 * 生成加载图标 SVG
 * @param color 图标颜色
 * @param reverse 是否反色
 * @returns SVG 字符串
 */
const loadingIcon = (color = '#4D80F0', reverse = true): string => {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42"><defs><linearGradient x1="100%" y1="0%" x2="0%" y2="0%" id="a"><stop stop-color="${
    reverse ? color : '#fff'
  }" offset="0%" stop-opacity="0"/><stop stop-color="${
    reverse ? color : '#fff'
  }" offset="100%"/></linearGradient></defs><g fill="none" fill-rule="evenodd"><path d="M21 1c11.046 0 20 8.954 20 20s-8.954 20-20 20S1 32.046 1 21 9.954 1 21 1zm0 7C13.82 8 8 13.82 8 21s5.82 13 13 13 13-5.82 13-13S28.18 8 21 8z" fill="${
    reverse ? '#fff' : color
  }"/><path d="M4.599 21c0 9.044 7.332 16.376 16.376 16.376 9.045 0 16.376-7.332 16.376-16.376" stroke="url(#a)" stroke-width="3.5" stroke-linecap="round"/></g></svg>`
}

/**
 * 构建加载图标 SVG
 * 根据按钮类型和样式生成对应颜色的加载图标
 */
const buildLoadingSvg = () => {
  const { loadingColor, type, plain } = props
  let color = loadingColor

  // 如果没有指定加载颜色，根据按钮类型设置默认颜色
  if (!color) {
    switch (type) {
      case 'primary':
        color = '#4D80F0'
        break
      case 'success':
        color = '#34d19d'
        break
      case 'info':
        color = '#333'
        break
      case 'warning':
        color = '#f0883a'
        break
      case 'error':
        color = '#fa4350'
        break
      case 'default':
        color = '#333'
        break
    }
  }

  const svg = loadingIcon(color, !plain)
  loadingIconSvg.value = `"data:image/svg+xml;base64,${encode(svg)}"`
}

/**
 * 监听 loading 属性变化
 * 当 loading 状态变化时，重新构建加载图标 SVG
 */
watch(
  () => props.loading,
  () => {
    buildLoadingSvg()
  },
  { deep: true, immediate: true },
)

/**
 * 处理按钮点击事件
 * 只有在按钮未禁用且未加载时才触发点击事件
 */
const handleClick = (event: any) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

/**
 * 处理获取用户手机号事件
 */
const handleGetphonenumber = (event: any) => {
  emit('getphonenumber', event.detail)
}

/**
 * 处理获取用户信息事件
 */
const handleGetuserinfo = (event: any) => {
  emit('getuserinfo', event.detail)
}

/**
 * 处理支付宝小程序授权事件
 * 根据授权范围分发到对应的处理函数
 */
const handleGetAuthorize = (event: any) => {
  if (props.scope === 'phoneNumber') {
    handleGetphonenumber(event)
  } else if (props.scope === 'userInfo') {
    handleGetuserinfo(event)
  }
}

/**
 * 处理客服消息事件
 */
const handleConcat = (event: any) => {
  emit('contact', event.detail)
}

/**
 * 处理错误事件
 */
const handleError = (event: any) => {
  emit('error', event.detail)
}

/**
 * 处理启动 APP 事件
 */
const handleLaunchapp = (event: any) => {
  emit('launchapp', event.detail)
}

/**
 * 处理打开设置事件
 */
const handleOpensetting = (event: any) => {
  emit('opensetting', event.detail)
}

/**
 * 处理选择头像事件
 */
const handleChooseavatar = (event: any) => {
  emit('chooseavatar', event.detail)
}

/**
 * 处理同意隐私协议事件
 */
const handleAgreePrivacyAuthorization = (event: any) => {
  emit('agreeprivacyauthorization', event.detail)
}

/**
 * 处理获取用户实时手机号事件
 */
const handleGetrealtimephonenumber = (event: any) => {
  emit('getrealtimephonenumber', event.detail)
}
</script>

<style lang="scss">
// 引入外部样式文件
@import './../common/abstracts/_mixin.scss';
@import './../common/abstracts/variable.scss';

// 暗色主题样式
.wot-theme-dark {
  @include b(button) {
    @include when(info) {
      background: $-dark-background4;
      color: $-dark-color3;
    }

    @include when(plain) {
      background: transparent;

      @include when(info) {
        color: $-dark-color;

        &::after {
          border-color: $-dark-background5;
        }
      }
    }

    @include when(text) {
      @include when(disabled) {
        color: $-dark-color-gray;
        background: transparent;
      }
    }

    @include when(icon) {
      color: $-dark-color;

      @include when(disabled) {
        color: $-dark-color-gray;
        background: transparent;
      }
    }
  }
}

// 按钮主体样式
@include b(button) {
  margin-left: initial;
  margin-right: initial;
  position: relative;
  display: inline-block;
  outline: none;
  -webkit-appearance: none;
  outline: none;
  background: transparent;
  box-sizing: border-box;
  border: none;
  border-radius: 0;
  color: $-button-normal-color;
  transition: opacity 0.2s;
  user-select: none;
  font-weight: normal;

  // 按钮按下效果
  &::before {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    background: $-color-black;
    border: inherit;
    border-color: $-color-black;
    border-radius: inherit;
    transform: translate(-50%, -50%);
    opacity: 0;
    content: ' ';
  }

  &::after {
    border: none;
    border-radius: 0;
  }

  // 内容区域
  @include e(content) {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  // 激活状态
  @include m(active) {
    &:active::before {
      opacity: 0.15;
    }
  }

  // 隐形按钮样式
  @include when(invisible) {
    width: 100%;
    height: 100%;
    background-color: transparent !important;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 9999;
    padding: 0;
    margin: 0;
    border: none;
    opacity: 1 !important;
    // 移除任何可能的阴影或边框
    box-shadow: none !important;
    border: none !important;
    outline: none !important;

    // 移除所有视觉效果
    &::before,
    &::after {
      display: none !important;
    }

    // 确保没有 hover 效果
    &:hover,
    &:active,
    &:focus {
      background-color: transparent !important;
      opacity: 1 !important;
    }
  }

  // 禁用状态
  @include when(disabled) {
    opacity: $-button-disabled-opacity;
  }

  // 加载图标
  @include e(loading) {
    margin-right: 10rpx;
    animation: wd-rotate 0.8s linear infinite;
    animation-duration: 2s;
  }

  @include e(loading-svg) {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
  }

  // 按钮类型样式
  @include when(primary) {
    background: $-button-primary-bg-color;
    color: $-button-primary-color;
  }

  @include when(success) {
    background: $-button-success-bg-color;
    color: $-button-success-color;
  }

  @include when(info) {
    background: $-button-info-bg-color;
    color: $-button-info-color;
  }

  @include when(warning) {
    background: $-button-warning-bg-color;
    color: $-button-warning-color;
  }

  @include when(error) {
    background: $-button-error-bg-color;
    color: $-button-error-color;
  }

  // 按钮尺寸样式
  @include when(small) {
    height: $-button-small-height;
    padding: $-button-small-padding;
    border-radius: $-button-small-radius;
    font-size: $-button-small-fs;
    font-weight: normal;

    .wd-button__loading {
      width: $-button-small-loading;
      height: $-button-small-loading;
    }
  }

  @include when(medium) {
    height: $-button-medium-height;
    padding: $-button-medium-padding;
    border-radius: $-button-medium-radius;
    font-size: $-button-medium-fs;
    min-width: 240rpx;

    @include when(round) {
      @include when(icon) {
        min-width: 0;
        border-radius: 50%;
      }

      @include when(text) {
        border-radius: 0;
        min-width: 0;
      }
    }

    .wd-button__loading {
      width: $-button-medium-loading;
      height: $-button-medium-loading;
    }
  }

  @include when(large) {
    height: $-button-large-height;
    padding: $-button-large-padding;
    border-radius: $-button-large-radius;
    font-size: $-button-large-fs;

    &::after {
      border-radius: $-button-large-radius;
    }

    .wd-button__loading {
      width: $-button-large-loading;
      height: $-button-large-loading;
    }
  }

  // 圆角按钮
  @include when(round) {
    border-radius: 999rpx;
  }

  // 文字按钮
  @include when(text) {
    color: $-button-primary-bg-color;
    min-width: 0;
    padding: 8rpx 0;

    &::after {
      display: none;
    }

    &.wd-button--active {
      opacity: $-button-text-hover-opacity;

      &:active::before {
        display: none;
      }
    }

    @include when(disabled) {
      color: $-button-normal-disabled-color;
      background: transparent;
    }
  }

  // 幽灵按钮
  @include when(plain) {
    background: $-button-plain-bg-color;
    border: 1rpx solid currentColor;

    @include when(primary) {
      color: $-button-primary-bg-color;
    }

    @include when(success) {
      color: $-button-success-bg-color;
    }

    @include when(info) {
      color: $-button-info-plain-normal-color;
      border-color: $-button-info-plain-border-color;
    }

    @include when(warning) {
      color: $-button-warning-bg-color;
    }

    @include when(error) {
      color: $-button-error-bg-color;
    }
  }

  // 细边框
  @include when(hairline) {
    border-width: 0;

    &.is-plain {
      @include halfPixelBorderSurround();

      &::before {
        border-radius: inherit;
      }

      &::after {
        border-color: inherit;
      }

      &.is-round {
        &::after {
          border-radius: inherit !important;
        }
      }

      &.is-large {
        &::after {
          border-radius: calc(2 * $-button-large-radius);
        }
      }

      &.is-medium {
        &::after {
          border-radius: calc(2 * $-button-medium-radius);
        }
      }

      &.is-small {
        &::after {
          border-radius: calc(2 * $-button-small-radius);
        }
      }
    }
  }

  // 块级按钮
  @include when(block) {
    display: block;
  }

  // 图标按钮
  @include when(icon) {
    width: $-button-icon-size;
    height: $-button-icon-size;
    padding: 0;
    border-radius: 50%;
    color: $-button-icon-color;

    &::after {
      display: none;
    }

    :deep(.wd-button__icon) {
      margin-right: 0;
    }

    @include when(disabled) {
      color: $-button-icon-disabled-color;
      background: transparent;
    }
  }

  // 图标样式
  @include edeep(icon) {
    display: block;
    margin-right: 12rpx;
    font-size: $-button-icon-fs;
    vertical-align: middle;
  }

  // 文字样式
  @include e(text) {
    user-select: none;
    white-space: nowrap;
  }
}

// 旋转动画
@keyframes wd-rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
