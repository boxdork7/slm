<!-- Icon 图标 支持字体图标和UnoCSS图标 -->
<template>
  <view :class="iconClass" :style="iconStyle" @click="handleClick">
    <image v-if="isImageIcon" class="wd-icon__image" :src="name" />
  </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { addUnit, isDef } from '../common/util'

defineOptions({
  name: 'WdIcon',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 字体图标名称类型
 */
type FontIconName =
  // 系统操作类
  | 'home'
  | 'home-fill'
  | 'back'
  | 'back-fill'
  | 'close'
  | 'close-fill'
  | 'close-outline'
  | 'close-outline-fill'
  | 'check'
  | 'check-fill'
  | 'check-outline'
  | 'check-outline-fill'
  | 'menu'
  | 'menu-fill'
  | 'more'
  | 'more-fill'
  | 'search'
  | 'search-fill'
  | 'filter'
  | 'filter-fill'
  | 'refresh'
  | 'refresh-fill'
  | 'setting'
  | 'setting-fill'
  | 'help'
  | 'help-fill'
  | 'add'
  | 'add-fill'
  | 'minus'
  | 'minus-fill'
  | 'edit'
  | 'edit-fill'
  | 'delete'
  | 'delete-fill'
  | 'copy'
  | 'copy-fill'
  | 'save'
  | 'save-fill'
  | 'upload'
  | 'upload-fill'
  | 'download'
  | 'download-fill'
  | 'print'
  | 'print-fill'
  | 'share'
  | 'share-fill'
  | 'link'
  | 'link-fill'
  | 'clear'
  | 'clear-fill'
  | 'login'
  | 'login-fill'
  | 'logout'
  | 'logout-fill'
  | 'scan'
  | 'scan-fill'
  | 'play'
  | 'play-fill'
  | 'pause'
  | 'pause-fill'
  | 'stop'
  | 'stop-fill'
  | 'next'
  | 'next-fill'
  | 'previous'
  | 'previous-fill'
  | 'forward'
  | 'forward-fill'
  | 'backward'
  | 'backward-fill'
  | 'enter'
  | 'enter-fill'
  | 'jump'
  | 'jump-fill'
  | 'swap'
  | 'swap-fill'
  | 'rotate'
  | 'rotate-fill'
  | 'fullscreen'
  | 'fullscreen-fill'
  | 'exit-fullscreen'
  | 'exit-fullscreen-fill'
  | 'zoom-in'
  | 'zoom-in-fill'
  | 'zoom-out'
  | 'zoom-out-fill'
  | 'translate'
  | 'translate-fill'
  | 'keywords'
  | 'keywords-fill'
  | 'rollback'
  | 'rollback-fill'
  | 'poweroff'
  | 'poweroff-fill'
  // 导航箭头类
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'chevron-up'
  | 'chevron-up-fill'
  | 'chevron-down'
  | 'chevron-down-fill'
  | 'chevron-left'
  | 'chevron-left-fill'
  | 'chevron-right'
  | 'chevron-right-fill'
  | 'caret-up'
  | 'caret-up-fill'
  | 'caret-down'
  | 'caret-down-fill'
  | 'caret-left'
  | 'caret-left-fill'
  | 'caret-right'
  | 'caret-right-fill'
  | 'backtop'
  | 'backtop-fill'
  | 'page-first'
  | 'page-first-fill'
  | 'page-last'
  | 'page-last-fill'
  | 'unfold-more'
  | 'unfold-less'
  // 状态指示类
  | 'warn'
  | 'warn-fill'
  | 'info'
  | 'info-fill'
  | 'loading'
  | 'loading-fill'
  | 'locked'
  | 'locked-fill'
  | 'unlocked'
  | 'unlocked-fill'
  | 'visible'
  | 'visible-fill'
  | 'hidden'
  | 'hidden-fill'
  | 'time'
  | 'time-fill'
  | 'clock'
  | 'clock-fill'
  | 'star'
  | 'star-fill'
  | 'heart'
  | 'heart-fill'
  | 'favorite'
  | 'favorite-fill'
  | 'like'
  | 'like-fill'
  | 'dislike'
  | 'dislike-fill'
  | 'flag'
  | 'flag-fill'
  | 'pin'
  | 'pin-fill'
  | 'secured'
  | 'secured-fill'
  | 'notification'
  | 'notification-fill'
  | 'tips'
  | 'tips-fill'
  // 用户相关类
  | 'user'
  | 'user-fill'
  | 'user-add'
  | 'user-add-fill'
  | 'team'
  | 'team-fill'
  | 'contact'
  | 'contact-fill'
  | 'admin'
  | 'admin-fill'
  | 'vip'
  | 'vip-fill'
  | 'user-group'
  | 'user-group-fill'
  | 'user-circle'
  | 'user-circle-fill'
  | 'user-talk'
  | 'user-talk-fill'
  | 'male'
  | 'male-fill'
  | 'female'
  | 'female-fill'
  | 'crown'
  | 'crown-fill'
  | 'diamon'
  | 'diamon-fill'
  // 通讯媒体类
  | 'call'
  | 'call-fill'
  | 'phone'
  | 'phone-fill'
  | 'message'
  | 'message-fill'
  | 'mail'
  | 'mail-fill'
  | 'chat'
  | 'chat-fill'
  | 'video'
  | 'video-fill'
  | 'audio'
  | 'audio-fill'
  | 'camera'
  | 'camera-fill'
  | 'image'
  | 'image-fill'
  | 'mobile'
  | 'mobile-fill'
  | 'vibrate'
  | 'vibrate-fill'
  | 'sound'
  | 'sound-fill'
  | 'wifi'
  | 'wifi-fill'
  | 'wifi-error'
  | 'wifi-error-fill'
  | 'bluetooth'
  | 'bluetooth-fill'
  | 'signal'
  | 'signal-fill'
  | 'battery'
  | 'battery-fill'
  | 'cloud'
  | 'cloud-fill'
  | 'cloud-upload'
  | 'cloud-upload-fill'
  | 'cloud-download'
  | 'cloud-download-fill'
  | 'internet'
  | 'internet-fill'
  | 'detection'
  | 'detection-fill'
  | 'iphone'
  | 'iphone-fill'
  // 商业功能类
  | 'cart'
  | 'cart-fill'
  | 'payment'
  | 'payment-fill'
  | 'order'
  | 'order-fill'
  | 'coupon'
  | 'coupon-fill'
  | 'gift'
  | 'gift-fill'
  | 'wallet'
  | 'wallet-fill'
  | 'card'
  | 'card-fill'
  | 'shop'
  | 'shop-fill'
  | 'goods'
  | 'goods-fill'
  | 'money'
  | 'money-fill'
  | 'discount'
  | 'discount-fill'
  | 'qrcode'
  | 'qrcode-fill'
  | 'bag'
  | 'bag-fill'
  | 'delivery'
  | 'delivery-fill'
  | 'subscribe'
  | 'subscribe-fill'
  | 'read'
  | 'read-fill'
  | 'company'
  | 'company-fill'
  // 文件管理类
  | 'file'
  | 'file-fill'
  | 'file-add'
  | 'file-add-fill'
  | 'file-copy'
  | 'file-copy-fill'
  | 'file-paste'
  | 'file-paste-fill'
  | 'folder'
  | 'folder-fill'
  | 'folder-open'
  | 'folder-open-fill'
  | 'folder-add'
  | 'folder-add-fill'
  | 'file-word'
  | 'file-word-fill'
  | 'file-excel'
  | 'file-excel-fill'
  | 'file-ppt'
  | 'file-ppt-fill'
  | 'file-pdf'
  | 'file-pdf-fill'
  | 'file-unknown'
  | 'file-unknown-fill'
  | 'attach'
  | 'attach-fill'
  | 'book'
  | 'book-fill'
  // 工具功能类
  | 'calendar'
  | 'calendar-fill'
  | 'location'
  | 'location-fill'
  | 'map'
  | 'map-fill'
  | 'tools'
  | 'tools-fill'
  | 'laptop'
  | 'laptop-fill'
  | 'desktop'
  | 'desktop-fill'
  | 'app'
  | 'app-fill'
  | 'history'
  | 'history-fill'
  | 'service'
  | 'service-fill'
  | 'layers'
  | 'layers-fill'
  | 'fork'
  | 'fork-fill'
  | 'cursor'
  | 'cursor-fill'
  | 'pointing-hand'
  | 'pointing-hand-fill'
  | 'keyboard'
  | 'keyboard-fill'
  | 'keyboard-delete'
  | 'keyboard-delete-fill'
  | 'ellipsis'
  | 'ellipsis-fill'
  // 数据图表类
  | 'chart'
  | 'chart-fill'
  | 'chart-bar'
  | 'chart-bar-fill'
  | 'trending-up'
  | 'trending-down'
  | 'data'
  | 'data-fill'
  | 'asc'
  | 'desc'
  | 'move'
  | 'move-fill'
  | 'rectangle'
  | 'rectangle-fill'
  | 'demo'
  | 'demo-fill'
  // 社交功能类
  | 'comment'
  | 'comment-fill'
  | 'reply'
  | 'reply-fill'
  | 'mention'
  | 'mention-fill'
  | 'hashtag'
  | 'hashtag-fill'
  | 'follow'
  | 'follow-fill'
  | 'unfollow'
  | 'unfollow-fill'
  | 'follower'
  | 'follower-fill'
  | 'friend-add'
  | 'friend-add-fill'
  | 'group-chat'
  | 'group-chat-fill'
  | 'emoji'
  | 'emoji-fill'
  | 'moments'
  | 'moments-fill'
  // 平台品牌类
  | 'wechat'
  | 'wechat-fill'
  | 'qq'
  | 'qq-fill'
  | 'weibo'
  | 'weibo-fill'
  | 'alipay'
  | 'alipay-fill'
  | 'github'
  | 'github-fill'
  | 'apple'
  | 'apple-fill'
  | 'android'
  | 'android-fill'
  | 'windows'
  | 'windows-fill'
  | 'chrome'
  | 'chrome-fill'
  | 'tiktok'
  | 'tiktok-fill'

/**
 * UnoCSS图标名称类型 (以 i- 开头)
 */
type UnoIconName = `i-${string}`

/**
 * 图标名称联合类型
 * - FontIconName: 预定义的字体图标名称
 * - UnoIconName: 以 i- 开头的 UnoCSS 图标
 * - string: 图片路径或其他自定义图标
 */
export type IconName = FontIconName | UnoIconName | ImageSrc

/**
 * 图标组件属性接口
 */
interface WdIconProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string
  /** 使用的图标名字，可以使用字体图标名、UnoCSS图标类名或链接图片 */
  name: IconName
  /** 图标的颜色 */
  color?: string
  /** 图标的字体大小 */
  size?: string | number
  /** 类名前缀，用于使用自定义图标 */
  classPrefix?: string
}

/**
 * 图标组件事件接口
 */
interface WdIconEmits {
  /** 点击图标时触发 */
  click: [event: Event]
  /** 触摸图标时触发 */
  touch: [event: Event]
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdIconProps>(), {
  customStyle: '',
  customClass: '',
  classPrefix: 'wd-icon',
  size: '40',
})

// 定义组件事件
const emit = defineEmits<WdIconEmits>()

/**
 * 判断是否为图片图标
 */
const isImageIcon = computed(() => {
  return isDef(props.name) && props.name.includes('/')
})

/**
 * 判断是否为UnoCSS图标
 */
const isUnoCSS = computed(() => {
  // 如果以 i- 开头，认为是 UnoCSS 图标
  return props.name.startsWith('i-')
})

/**
 * 计算图标类名
 */
const iconClass = computed(() => {
  const classes = [props.classPrefix, props.customClass]

  if (isImageIcon.value) {
    // 图片图标
    classes.push('wd-icon--image')
  } else if (isUnoCSS.value) {
    // UnoCSS 图标
    classes.push('wd-icon--unocss', props.name)
  } else {
    // 字体图标
    classes.push(`${props.classPrefix}-${props.name}`)
  }

  return classes.filter(Boolean).join(' ')
})

/**
 * 计算图标样式
 */
const iconStyle = computed(() => {
  const styles = []

  if (props.color) {
    styles.push(`color: ${props.color};`)
  }

  if (props.size) {
    styles.push(`font-size: ${addUnit(props.size)};`)
  }

  if (props.customStyle) {
    styles.push(props.customStyle)
  }

  return styles.join(' ')
})

/**
 * 处理点击事件
 * 触发点击事件，传递原始事件对象
 */
const handleClick = (event: Event) => {
  emit('click', event)
}
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 图标字体定义
@font-face {
  font-family: 'wd-icons';
  src:
    url('//at.alicdn.com/t/c/font_4969054_f8a6ngjhuv.woff2?t=1754381253362') format('woff2'),
    url('//at.alicdn.com/t/c/font_4969054_f8a6ngjhuv.woff?t=1754381253362') format('woff'),
    url('//at.alicdn.com/t/c/font_4969054_f8a6ngjhuv.ttf?t=1754381253362') format('truetype');
  font-weight: normal;
  font-style: normal;
}

/*  #ifdef  APP-PLUS  */
@font-face {
  font-family: 'wd-icons';
  src: url('./wd-icons.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

/*  #endif  */

// 图标组件样式
@include b(icon) {
  display: inline-block;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  // 字体图标样式
  &:not(.wd-icon--image):not(.wd-icon--unocss) {
    font-family: 'wd-icons' !important;
  }

  // UnoCSS 图标样式
  @include m(unocss) {
    display: inline-block;
    width: 1em;
    height: 1em;
    vertical-align: middle;
  }

  // 图片类型图标样式
  @include m(image) {
    width: 1em;
    height: 1em;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden; // 防止图片溢出
  }

  // 图片元素样式
  @include e(image) {
    width: 100%;
    height: 100%;
    object-fit: cover; // 保持图片比例，填充容器
    object-position: center; // 图片居中显示
    border-radius: inherit; // 继承父元素的圆角
    display: block; // 避免 inline 元素的底部间隙
  }
}

// 图标字体样式定义
/* 系统操作类 */
.wd-icon-home:before {
  content: '\e65f';
}

.wd-icon-home-fill:before {
  content: '\e631';
}

.wd-icon-back:before {
  content: '\e9b1';
}

.wd-icon-back-fill:before {
  content: '\e690';
}

.wd-icon-close:before {
  content: '\e9b0';
}

.wd-icon-close-fill:before {
  content: '\e613';
}

.wd-icon-close-outline:before {
  content: '\e63a';
}

.wd-icon-close-outline-fill:before {
  content: '\e865';
}

.wd-icon-check:before {
  content: '\e968';
}

.wd-icon-check-fill:before {
  content: '\e810';
}

.wd-icon-check-outline:before {
  content: '\e68a';
}

.wd-icon-check-outline-fill:before {
  content: '\e671';
}

.wd-icon-menu:before {
  content: '\e614';
}

.wd-icon-menu-fill:before {
  content: '\e609';
}

.wd-icon-more:before {
  content: '\e607';
}

.wd-icon-more-fill:before {
  content: '\e6ff';
}

.wd-icon-search:before {
  content: '\e603';
}

.wd-icon-search-fill:before {
  content: '\e601';
}

.wd-icon-filter:before {
  content: '\e839';
}

.wd-icon-filter-fill:before {
  content: '\e83b';
}

.wd-icon-refresh:before {
  content: '\e7af';
}

.wd-icon-refresh-fill:before {
  content: '\e61a';
}

.wd-icon-setting:before {
  content: '\e65e';
}

.wd-icon-setting-fill:before {
  content: '\e997';
}

.wd-icon-help:before {
  content: '\e74d';
}

.wd-icon-help-fill:before {
  content: '\e642';
}

.wd-icon-add:before {
  content: '\e62b';
}

.wd-icon-add-fill:before {
  content: '\e672';
}

.wd-icon-minus:before {
  content: '\e650';
}

.wd-icon-minus-fill:before {
  content: '\e675';
}

.wd-icon-edit:before {
  content: '\eff5';
}

.wd-icon-edit-fill:before {
  content: '\e61c';
}

.wd-icon-delete:before {
  content: '\e61e';
}

.wd-icon-delete-fill:before {
  content: '\e699';
}

.wd-icon-copy:before {
  content: '\e7ad';
}

.wd-icon-copy-fill:before {
  content: '\e9a1';
}

.wd-icon-save:before {
  content: '\e756';
}

.wd-icon-save-fill:before {
  content: '\e789';
}

.wd-icon-upload:before {
  content: '\e682';
}

.wd-icon-upload-fill:before {
  content: '\e87b';
}

.wd-icon-download:before {
  content: '\e62e';
}

.wd-icon-download-fill:before {
  content: '\eaa3';
}

.wd-icon-print:before {
  content: '\e67a';
}

.wd-icon-print-fill:before {
  content: '\e735';
}

.wd-icon-share:before {
  content: '\e623';
}

.wd-icon-share-fill:before {
  content: '\e60b';
}

.wd-icon-link:before {
  content: '\e65b';
}

.wd-icon-link-fill:before {
  content: '\e64b';
}

.wd-icon-clear:before {
  content: '\e616';
}

.wd-icon-clear-fill:before {
  content: '\e615';
}

.wd-icon-login:before {
  content: '\e626';
}

.wd-icon-login-fill:before {
  content: '\e9d5';
}

.wd-icon-logout:before {
  content: '\e80d';
}

.wd-icon-logout-fill:before {
  content: '\e760';
}

.wd-icon-scan:before {
  content: '\e840';
}

.wd-icon-scan-fill:before {
  content: '\ea1d';
}

.wd-icon-play:before {
  content: '\e86f';
}

.wd-icon-play-fill:before {
  content: '\e7cd';
}

.wd-icon-pause:before {
  content: '\e898';
}

.wd-icon-pause-fill:before {
  content: '\e659';
}

.wd-icon-stop:before {
  content: '\e8b0';
}

.wd-icon-stop-fill:before {
  content: '\e842';
}

.wd-icon-next:before {
  content: '\e6c3';
}

.wd-icon-next-fill:before {
  content: '\e652';
}

.wd-icon-previous:before {
  content: '\eff8';
}

.wd-icon-previous-fill:before {
  content: '\eff9';
}

.wd-icon-forward:before {
  content: '\e704';
}

.wd-icon-forward-fill:before {
  content: '\eff7';
}

.wd-icon-backward:before {
  content: '\eff6';
}

.wd-icon-backward-fill:before {
  content: '\e662';
}

.wd-icon-enter:before {
  content: '\e94f';
}

.wd-icon-enter-fill:before {
  content: '\e625';
}

.wd-icon-jump:before {
  content: '\e605';
}

.wd-icon-jump-fill:before {
  content: '\e65c';
}

.wd-icon-swap:before {
  content: '\e687';
}

.wd-icon-swap-fill:before {
  content: '\e8ad';
}

.wd-icon-rotate:before {
  content: '\e645';
}

.wd-icon-rotate-fill:before {
  content: '\e779';
}

.wd-icon-fullscreen:before {
  content: '\e7ea';
}

.wd-icon-fullscreen-fill:before {
  content: '\e630';
}

.wd-icon-exit-fullscreen:before {
  content: '\e67f';
}

.wd-icon-exit-fullscreen-fill:before {
  content: '\e608';
}

.wd-icon-zoom-in:before {
  content: '\e6dd';
}

.wd-icon-zoom-in-fill:before {
  content: '\ea89';
}

.wd-icon-zoom-out:before {
  content: '\e914';
}

.wd-icon-zoom-out-fill:before {
  content: '\e606';
}

.wd-icon-translate:before {
  content: '\e66e';
}

.wd-icon-translate-fill:before {
  content: '\e800';
}

.wd-icon-keywords:before {
  content: '\e777';
}

.wd-icon-keywords-fill:before {
  content: '\e604';
}

.wd-icon-rollback:before {
  content: '\e8f1';
}

.wd-icon-rollback-fill:before {
  content: '\e67b';
}

.wd-icon-poweroff:before {
  content: '\e624';
}

.wd-icon-poweroff-fill:before {
  content: '\e632';
}

/* 导航箭头类 */
.wd-icon-up:before {
  content: '\e9af';
}

.wd-icon-down:before {
  content: '\e9ad';
}

.wd-icon-left:before {
  content: '\e686';
}

.wd-icon-right:before {
  content: '\e9ae';
}

.wd-icon-chevron-up:before {
  content: '\e6d4';
}

.wd-icon-chevron-up-fill:before {
  content: '\e653';
}

.wd-icon-chevron-down:before {
  content: '\effd';
}

.wd-icon-chevron-down-fill:before {
  content: '\effb';
}

.wd-icon-chevron-left:before {
  content: '\effe';
}

.wd-icon-chevron-left-fill:before {
  content: '\effc';
}

.wd-icon-chevron-right:before {
  content: '\efff';
}

.wd-icon-chevron-right-fill:before {
  content: '\effa';
}

.wd-icon-caret-up:before {
  content: '\e782';
}

.wd-icon-caret-up-fill:before {
  content: '\e6b9';
}

.wd-icon-caret-down:before {
  content: '\f001';
}

.wd-icon-caret-down-fill:before {
  content: '\f003';
}

.wd-icon-caret-left:before {
  content: '\f002';
}

.wd-icon-caret-left-fill:before {
  content: '\f005';
}

.wd-icon-caret-right:before {
  content: '\f000';
}

.wd-icon-caret-right-fill:before {
  content: '\f004';
}

.wd-icon-backtop:before {
  content: '\e6c6';
}

.wd-icon-backtop-fill:before {
  content: '\e636';
}

.wd-icon-page-first:before {
  content: '\e654';
}

.wd-icon-page-first-fill:before {
  content: '\e66b';
}

.wd-icon-page-last:before {
  content: '\f006';
}

.wd-icon-page-last-fill:before {
  content: '\f007';
}

.wd-icon-unfold-more:before {
  content: '\e6fa';
}

.wd-icon-unfold-less:before {
  content: '\e6fb';
}

/* 状态指示类 */
.wd-icon-warn:before {
  content: '\e635';
}

.wd-icon-warn-fill:before {
  content: '\ed53';
}

.wd-icon-info:before {
  content: '\e60a';
}

.wd-icon-info-fill:before {
  content: '\e60e';
}

.wd-icon-loading:before {
  content: '\e83d';
}

.wd-icon-loading-fill:before {
  content: '\e60d';
}

.wd-icon-locked:before {
  content: '\e612';
}

.wd-icon-locked-fill:before {
  content: '\e60f';
}

.wd-icon-unlocked:before {
  content: '\e617';
}

.wd-icon-unlocked-fill:before {
  content: '\e66c';
}

.wd-icon-visible:before {
  content: '\e63d';
}

.wd-icon-visible-fill:before {
  content: '\e8cc';
}

.wd-icon-hidden:before {
  content: '\e83a';
}

.wd-icon-hidden-fill:before {
  content: '\e88a';
}

.wd-icon-time:before {
  content: '\e63c';
}

.wd-icon-time-fill:before {
  content: '\e611';
}

.wd-icon-clock:before {
  content: '\e651';
}

.wd-icon-clock-fill:before {
  content: '\e655';
}

.wd-icon-star:before {
  content: '\e721';
}

.wd-icon-star-fill:before {
  content: '\edf9';
}

.wd-icon-heart:before {
  content: '\e6f0';
}

.wd-icon-heart-fill:before {
  content: '\e610';
}

.wd-icon-favorite:before {
  content: '\e60c';
}

.wd-icon-favorite-fill:before {
  content: '\e667';
}

.wd-icon-like:before {
  content: '\e67c';
}

.wd-icon-like-fill:before {
  content: '\f009';
}

.wd-icon-dislike:before {
  content: '\f008';
}

.wd-icon-dislike-fill:before {
  content: '\e9d7';
}

.wd-icon-flag:before {
  content: '\e6b6';
}

.wd-icon-flag-fill:before {
  content: '\e637';
}

.wd-icon-pin:before {
  content: '\e864';
}

.wd-icon-pin-fill:before {
  content: '\e863';
}

.wd-icon-secured:before {
  content: '\ea57';
}

.wd-icon-secured-fill:before {
  content: '\e627';
}

.wd-icon-notification:before {
  content: '\e679';
}

.wd-icon-notification-fill:before {
  content: '\e68b';
}

.wd-icon-tips:before {
  content: '\e62f';
}

.wd-icon-tips-fill:before {
  content: '\e646';
}

/* 用户相关类 */
.wd-icon-user:before {
  content: '\e7a4';
}

.wd-icon-user-fill:before {
  content: '\e65d';
}

.wd-icon-user-add:before {
  content: '\ea39';
}

.wd-icon-user-add-fill:before {
  content: '\e76e';
}

.wd-icon-team:before {
  content: '\e67d';
}

.wd-icon-team-fill:before {
  content: '\e660';
}

.wd-icon-contact:before {
  content: '\e7ae';
}

.wd-icon-contact-fill:before {
  content: '\e6a9';
}

.wd-icon-admin:before {
  content: '\e618';
}

.wd-icon-admin-fill:before {
  content: '\e7fd';
}

.wd-icon-vip:before {
  content: '\e664';
}

.wd-icon-vip-fill:before {
  content: '\e68e';
}

.wd-icon-user-group:before {
  content: '\e633';
}

.wd-icon-user-group-fill:before {
  content: '\e66d';
}

.wd-icon-user-circle:before {
  content: '\ea99';
}

.wd-icon-user-circle-fill:before {
  content: '\f130';
}

.wd-icon-user-talk:before {
  content: '\ea9d';
}

.wd-icon-user-talk-fill:before {
  content: '\e619';
}

.wd-icon-male:before {
  content: '\e88f';
}

.wd-icon-male-fill:before {
  content: '\e84a';
}

.wd-icon-female:before {
  content: '\e890';
}

.wd-icon-female-fill:before {
  content: '\e83e';
}

.wd-icon-crown:before {
  content: '\e71f';
}

.wd-icon-crown-fill:before {
  content: '\e872';
}

.wd-icon-diamon:before {
  content: '\e71e';
}

.wd-icon-diamon-fill:before {
  content: '\e980';
}

/* 通讯媒体类 */
.wd-icon-call:before {
  content: '\e6d0';
}

.wd-icon-call-fill:before {
  content: '\e769';
}

.wd-icon-phone:before {
  content: '\e7c1';
}

.wd-icon-phone-fill:before {
  content: '\e600';
}

.wd-icon-message:before {
  content: '\e61d';
}

.wd-icon-message-fill:before {
  content: '\e77a';
}

.wd-icon-mail:before {
  content: '\e61f';
}

.wd-icon-mail-fill:before {
  content: '\e691';
}

.wd-icon-chat:before {
  content: '\e647';
}

.wd-icon-chat-fill:before {
  content: '\e954';
}

.wd-icon-video:before {
  content: '\e6da';
}

.wd-icon-video-fill:before {
  content: '\e6a1';
}

.wd-icon-audio:before {
  content: '\e897';
}

.wd-icon-audio-fill:before {
  content: '\e899';
}

.wd-icon-camera:before {
  content: '\e677';
}

.wd-icon-camera-fill:before {
  content: '\e726';
}

.wd-icon-image:before {
  content: '\e743';
}

.wd-icon-image-fill:before {
  content: '\e66f';
}

.wd-icon-mobile:before {
  content: '\e620';
}

.wd-icon-mobile-fill:before {
  content: '\eb66';
}

.wd-icon-vibrate:before {
  content: '\e81f';
}

.wd-icon-vibrate-fill:before {
  content: '\e6f1';
}

.wd-icon-sound:before {
  content: '\e680';
}

.wd-icon-sound-fill:before {
  content: '\e6f3';
}

.wd-icon-wifi:before {
  content: '\e853';
}

.wd-icon-wifi-fill:before {
  content: '\e6bd';
}

.wd-icon-wifi-error:before {
  content: '\e992';
}

.wd-icon-wifi-error-fill:before {
  content: '\e936';
}

.wd-icon-bluetooth:before {
  content: '\e78e';
}

.wd-icon-bluetooth-fill:before {
  content: '\e8d4';
}

.wd-icon-signal:before {
  content: '\e6fc';
}

.wd-icon-signal-fill:before {
  content: '\e629';
}

.wd-icon-battery:before {
  content: '\e678';
}

.wd-icon-battery-fill:before {
  content: '\e9f3';
}

.wd-icon-cloud:before {
  content: '\e7d9';
}

.wd-icon-cloud-fill:before {
  content: '\e869';
}

.wd-icon-cloud-upload:before {
  content: '\e81c';
}

.wd-icon-cloud-upload-fill:before {
  content: '\e7db';
}

.wd-icon-cloud-download:before {
  content: '\e81b';
}

.wd-icon-cloud-download-fill:before {
  content: '\e7da';
}

.wd-icon-internet:before {
  content: '\ea0a';
}

.wd-icon-internet-fill:before {
  content: '\e661';
}

.wd-icon-detection:before {
  content: '\e683';
}

.wd-icon-detection-fill:before {
  content: '\e868';
}

.wd-icon-iphone:before {
  content: '\e69f';
}

.wd-icon-iphone-fill:before {
  content: '\ff54';
}

/* 商业功能类 */
.wd-icon-cart:before {
  content: '\e826';
}

.wd-icon-cart-fill:before {
  content: '\e827';
}

.wd-icon-payment:before {
  content: '\e6cd';
}

.wd-icon-payment-fill:before {
  content: '\e63e';
}

.wd-icon-order:before {
  content: '\e714';
}

.wd-icon-order-fill:before {
  content: '\e713';
}

.wd-icon-coupon:before {
  content: '\e850';
}

.wd-icon-coupon-fill:before {
  content: '\e84f';
}

.wd-icon-gift:before {
  content: '\e843';
}

.wd-icon-gift-fill:before {
  content: '\e866';
}

.wd-icon-wallet:before {
  content: '\e6e0';
}

.wd-icon-wallet-fill:before {
  content: '\e622';
}

.wd-icon-card:before {
  content: '\e7de';
}

.wd-icon-card-fill:before {
  content: '\e860';
}

.wd-icon-shop:before {
  content: '\e6a0';
}

.wd-icon-shop-fill:before {
  content: '\e6e3';
}

.wd-icon-goods:before {
  content: '\e64f';
}

.wd-icon-goods-fill:before {
  content: '\e665';
}

.wd-icon-money:before {
  content: '\e7d1';
}

.wd-icon-money-fill:before {
  content: '\e7ce';
}

.wd-icon-discount:before {
  content: '\e670';
}

.wd-icon-discount-fill:before {
  content: '\e854';
}

.wd-icon-qrcode:before {
  content: '\e689';
}

.wd-icon-qrcode-fill:before {
  content: '\e634';
}

.wd-icon-bag:before {
  content: '\e676';
}

.wd-icon-bag-fill:before {
  content: '\e628';
}

.wd-icon-delivery:before {
  content: '\e6b0';
}

.wd-icon-delivery-fill:before {
  content: '\e6b1';
}

.wd-icon-subscribe:before {
  content: '\e809';
}

.wd-icon-subscribe-fill:before {
  content: '\e656';
}

.wd-icon-read:before {
  content: '\e7d8';
}

.wd-icon-read-fill:before {
  content: '\e657';
}

.wd-icon-company:before {
  content: '\e68c';
}

.wd-icon-company-fill:before {
  content: '\e851';
}

/* 文件管理类 */
.wd-icon-file:before {
  content: '\e68f';
}

.wd-icon-file-fill:before {
  content: '\e66a';
}

.wd-icon-file-add:before {
  content: '\e658';
}

.wd-icon-file-add-fill:before {
  content: '\f0bb';
}

.wd-icon-file-copy:before {
  content: '\e821';
}

.wd-icon-file-copy-fill:before {
  content: '\e84b';
}

.wd-icon-file-paste:before {
  content: '\e648';
}

.wd-icon-file-paste-fill:before {
  content: '\e6ad';
}

.wd-icon-folder:before {
  content: '\e7d2';
}

.wd-icon-folder-fill:before {
  content: '\e85f';
}

.wd-icon-folder-open:before {
  content: '\e62c';
}

.wd-icon-folder-open-fill:before {
  content: '\e696';
}

.wd-icon-folder-add:before {
  content: '\e7d3';
}

.wd-icon-folder-add-fill:before {
  content: '\e85e';
}

.wd-icon-file-word:before {
  content: '\e668';
}

.wd-icon-file-word-fill:before {
  content: '\e64d';
}

.wd-icon-file-excel:before {
  content: '\e6ae';
}

.wd-icon-file-excel-fill:before {
  content: '\e666';
}

.wd-icon-file-ppt:before {
  content: '\e65a';
}

.wd-icon-file-ppt-fill:before {
  content: '\e663';
}

.wd-icon-file-pdf:before {
  content: '\e643';
}

.wd-icon-file-pdf-fill:before {
  content: '\e6f4';
}

.wd-icon-file-unknown:before {
  content: '\e649';
}

.wd-icon-file-unknown-fill:before {
  content: '\e6f2';
}

.wd-icon-attach:before {
  content: '\e8d2';
}

.wd-icon-attach-fill:before {
  content: '\e720';
}

.wd-icon-book:before {
  content: '\e62a';
}

.wd-icon-book-fill:before {
  content: '\e621';
}

/* 工具功能类 */
.wd-icon-calendar:before {
  content: '\e7d4';
}

.wd-icon-calendar-fill:before {
  content: '\e84d';
}

.wd-icon-location:before {
  content: '\e83f';
}

.wd-icon-location-fill:before {
  content: '\e76f';
}

.wd-icon-map:before {
  content: '\e64e';
}

.wd-icon-map-fill:before {
  content: '\e61b';
}

.wd-icon-tools:before {
  content: '\e63f';
}

.wd-icon-tools-fill:before {
  content: '\e62d';
}

.wd-icon-laptop:before {
  content: '\e638';
}

.wd-icon-laptop-fill:before {
  content: '\e641';
}

.wd-icon-desktop:before {
  content: '\e7fb';
}

.wd-icon-desktop-fill:before {
  content: '\ead5';
}

.wd-icon-app:before {
  content: '\e644';
}

.wd-icon-app-fill:before {
  content: '\eab6';
}

.wd-icon-history:before {
  content: '\e834';
}

.wd-icon-history-fill:before {
  content: '\e63b';
}

.wd-icon-service:before {
  content: '\e681';
}

.wd-icon-service-fill:before {
  content: '\e6be';
}

.wd-icon-layers:before {
  content: '\e885';
}

.wd-icon-layers-fill:before {
  content: '\e85c';
}

.wd-icon-fork:before {
  content: '\e674';
}

.wd-icon-fork-fill:before {
  content: '\e673';
}

.wd-icon-cursor:before {
  content: '\e70a';
}

.wd-icon-cursor-fill:before {
  content: '\e7a9';
}

.wd-icon-pointing-hand:before {
  content: '\e7aa';
}

.wd-icon-pointing-hand-fill:before {
  content: '\e6af';
}

.wd-icon-keyboard:before {
  content: '\e639';
}

.wd-icon-keyboard-fill:before {
  content: '\e8fa';
}

.wd-icon-keyboard-delete:before {
  content: '\eab4';
}

.wd-icon-keyboard-delete-fill:before {
  content: '\e640';
}

.wd-icon-ellipsis:before {
  content: '\e67e';
}

.wd-icon-ellipsis-fill:before {
  content: '\e685';
}

/* 数据图表类 */
.wd-icon-chart:before {
  content: '\e828';
}

.wd-icon-chart-fill:before {
  content: '\e64c';
}

.wd-icon-chart-bar:before {
  content: '\e669';
}

.wd-icon-chart-bar-fill:before {
  content: '\e93d';
}

.wd-icon-trending-up:before {
  content: '\e69e';
}

.wd-icon-trending-down:before {
  content: '\e64a';
}

.wd-icon-data:before {
  content: '\e76d';
}

.wd-icon-data-fill:before {
  content: '\e6ec';
}

.wd-icon-asc:before {
  content: '\e757';
}

.wd-icon-desc:before {
  content: '\f131';
}

.wd-icon-move:before {
  content: '\e841';
}

.wd-icon-move-fill:before {
  content: '\e733';
}

.wd-icon-rectangle:before {
  content: '\e6a8';
}

.wd-icon-rectangle-fill:before {
  content: '\e6aa';
}

.wd-icon-demo:before {
  content: '\ea42';
}

.wd-icon-demo-fill:before {
  content: '\e78f';
}

/* 社交功能类 */
.wd-icon-comment:before {
  content: '\e693';
}

.wd-icon-comment-fill:before {
  content: '\e68d';
}

.wd-icon-reply:before {
  content: '\e6ab';
}

.wd-icon-reply-fill:before {
  content: '\e6a2';
}

.wd-icon-mention:before {
  content: '\e734';
}

.wd-icon-mention-fill:before {
  content: '\e69d';
}

.wd-icon-hashtag:before {
  content: '\e8b5';
}

.wd-icon-hashtag-fill:before {
  content: '\e6a5';
}

.wd-icon-follow:before {
  content: '\e7a6';
}

.wd-icon-follow-fill:before {
  content: '\e7a5';
}

.wd-icon-unfollow:before {
  content: '\e906';
}

.wd-icon-unfollow-fill:before {
  content: '\ed05';
}

.wd-icon-follower:before {
  content: '\e6e5';
}

.wd-icon-follower-fill:before {
  content: '\e722';
}

.wd-icon-friend-add:before {
  content: '\e69b';
}

.wd-icon-friend-add-fill:before {
  content: '\e6a4';
}

.wd-icon-group-chat:before {
  content: '\e76c';
}

.wd-icon-group-chat-fill:before {
  content: '\e74f';
}

.wd-icon-emoji:before {
  content: '\e6ac';
}

.wd-icon-emoji-fill:before {
  content: '\e78d';
}

.wd-icon-moments:before {
  content: '\e6a7';
}

.wd-icon-moments-fill:before {
  content: '\e6b8';
}

/* 平台品牌类 */
.wd-icon-wechat:before {
  content: '\e6ba';
}

.wd-icon-wechat-fill:before {
  content: '\e602';
}

.wd-icon-qq:before {
  content: '\e692';
}

.wd-icon-qq-fill:before {
  content: '\e694';
}

.wd-icon-weibo:before {
  content: '\e688';
}

.wd-icon-weibo-fill:before {
  content: '\e86a';
}

.wd-icon-alipay:before {
  content: '\e71b';
}

.wd-icon-alipay-fill:before {
  content: '\e69c';
}

.wd-icon-github:before {
  content: '\e6b7';
}

.wd-icon-github-fill:before {
  content: '\e697';
}

.wd-icon-apple:before {
  content: '\e6a3';
}

.wd-icon-apple-fill:before {
  content: '\e69a';
}

.wd-icon-android:before {
  content: '\e695';
}

.wd-icon-android-fill:before {
  content: '\e698';
}

.wd-icon-windows:before {
  content: '\e7dc';
}

.wd-icon-windows-fill:before {
  content: '\e684';
}

.wd-icon-chrome:before {
  content: '\e87e';
}

.wd-icon-chrome-fill:before {
  content: '\e884';
}

.wd-icon-tiktok:before {
  content: '\eae5';
}

.wd-icon-tiktok-fill:before {
  content: '\e6a6';
}
</style>
