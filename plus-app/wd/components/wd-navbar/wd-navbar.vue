<!-- Navbar 导航栏 为页面提供导航功能，常用于页面顶部。 -->
<template>
  <!-- 在微信公众号H5环境下且启用自动隐藏时，不渲染导航栏 -->
  <view v-if="!shouldHideInWechatH5" :style="{ height: addUnit(placeholderHeight) }">
    <!-- 导航栏主体容器 -->
    <view
      :class="`wd-navbar ${customClass} ${fixed ? 'is-fixed' : ''} ${bordered ? 'is-border' : ''}`"
      :style="`${fixed && isDef(zIndex) ? `z-index: ${zIndex};` : ''}${safeAreaInsetTop ? `padding-top: ${addUnit(statusBarHeight || 0, 'px')};` : ''}${bgColor ? `background: ${bgColor};` : ''}${height ? `height: ${addUnit(height)}; line-height: ${addUnit(height)};` : ''}${customStyle}`"
    >
      <view class="wd-navbar__content">
        <!-- 胶囊区域插槽 -->
        <view v-if="$slots.capsule || capsule" class="wd-navbar__capsule">
          <!-- 如果有自定义胶囊插槽，优先使用自定义内容 -->
          <slot v-if="$slots.capsule" name="capsule" />
          <!-- 否则使用内置胶囊组件 -->
          <wd-navbar-capsule
            v-else
            :show-back="showBack"
            :show-home="showHome"
            @back="handleCapsuleBack"
            @back-home="handleCapsuleBackHome"
          />
        </view>

        <!-- 左侧区域 -->
        <view
          v-else-if="shouldShowLeft"
          :class="`wd-navbar__left ${leftDisabled ? 'is-disabled' : ''}`"
          @click="handleClickLeft"
        >
          <slot name="left">
            <wd-icon
              v-if="finalLeftIcon"
              :name="finalLeftIcon"
              :size="addUnit(leftIconSize)"
              :color="leftIconColor"
              custom-class="wd-navbar__icon"
            />
            <view v-if="finalLeftText" class="wd-navbar__text" :style="leftTextStyle">
              {{ finalLeftText }}
            </view>
          </slot>
        </view>

        <!-- 标题区域 -->
        <view class="wd-navbar__title" :style="titleStyle">
          <slot name="title">
            <block v-if="title">{{ title }}</block>
          </slot>
        </view>

        <!-- 右侧区域 -->
        <view
          v-if="rightIcon || rightText || $slots.right"
          :class="`wd-navbar__right ${rightDisabled ? 'is-disabled' : ''}`"
          @click="handleClickRight"
        >
          <slot name="right">
            <view v-if="rightText" class="wd-navbar__text">{{ rightText }}</view>
            <wd-icon
              v-if="rightIcon"
              :name="rightIcon"
              :size="addUnit(rightIconSize)"
              :color="rightIconColor"
              custom-class="wd-navbar__icon"
            />
          </slot>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import { computed, getCurrentInstance, nextTick, onMounted, ref, watch } from 'vue'
import { addUnit, isDef, objToStyle, pxToRpx } from '../common/util'
import wdIcon from '../wd-icon/wd-icon.vue'
import wdNavbarCapsule from '../wd-navbar-capsule/wd-navbar-capsule.vue'
import { useTranslate } from '../composables/useTranslate'

defineOptions({
  name: 'WdNavbar',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 导航栏组件属性接口
 */
interface WdNavbarProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 状态栏字体颜色 dark-黑色 light-白色 */
  statusBarTextStyle?: 'dark' | 'light'

  /** 标题文字 */
  title?: string
  /** 标题字体家族 */
  titleFamily?: string
  /** 标题字体大小 */
  titleSize?: string | number
  /** 标题字体粗细 */
  titleBold?: boolean
  /** 标题字体颜色 */
  titleColor?: string

  /** 左侧文案 */
  leftText?: string
  /** 左侧图标名称 */
  leftIcon?: string
  /** 左侧图标大小 */
  leftIconSize?: string | number
  /** 左侧图标颜色 */
  leftIconColor?: string
  /** 是否禁用左侧按钮，禁用时透明度降低，且无法点击 */
  leftDisabled?: boolean

  /** 右侧文案 */
  rightText?: string
  /** 右侧图标名称 */
  rightIcon?: string
  /** 右侧图标大小 */
  rightIconSize?: string | number
  /** 右侧图标颜色 */
  rightIconColor?: string
  /** 是否禁用右侧按钮，禁用时透明度降低，且无法点击 */
  rightDisabled?: boolean

  /** 导航栏背景色 */
  bgColor?: string
  /** 导航栏高度，单位rpx */
  height?: string | number
  /** 是否显示下边框 */
  bordered?: boolean

  /** 是否固定到顶部 */
  fixed?: boolean
  /** 固定在顶部时，是否在标签位置生成一个等高的占位元素 */
  placeholder?: boolean
  /** 导航栏 z-index */
  zIndex?: number
  /** 是否开启顶部安全区适配 */
  safeAreaInsetTop?: boolean

  /** 是否显示胶囊组件 */
  capsule?: boolean
  /** 胶囊组件是否显示返回按钮 */
  showBack?: boolean
  /** 胶囊组件是否显示首页按钮 */
  showHome?: boolean

  /** 是否自动处理返回操作，当左侧为返回按钮时自动执行uni.navigateBack */
  autoBack?: boolean

  /** 是否在微信公众号H5环境下自动隐藏导航栏并只设置标题 */
  autoHideInWechatH5?: boolean
}

/**
 * 导航栏组件事件接口
 */
interface WdNavbarEmits {
  /** 返回事件 */
  'back': []
  /** 首页按钮点击时触发 */
  'back-home': []
  /** 点击左侧按钮时触发 */
  'click-left': []
  /** 点击右侧按钮时触发 */
  'click-right': []
  /** 导航栏高度计算完成时触发 */
  'height-ready': [height: number]
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdNavbarProps>(), {
  customStyle: '',
  customClass: '',
  statusBarTextStyle: 'dark',
  titleFamily: 'Microsoft YaHei, SimHei, PingFang SC, sans-serif',
  titleSize: '',
  titleBold: false,
  titleColor: '',
  leftIconSize: 32,
  rightIconSize: 32,
  bordered: false,
  fixed: true,
  placeholder: true,
  zIndex: 99,
  safeAreaInsetTop: true,
  leftDisabled: false,
  rightDisabled: false,
  capsule: false,
  showBack: false,
  showHome: false,
  autoBack: true,
  autoHideInWechatH5: true, // 默认启用在微信公众号H5中自动隐藏
})

// 定义组件事件
const emit = defineEmits<WdNavbarEmits>()

const { translate } = useTranslate('navbar')

// 响应式数据：占位高度
const placeholderHeight = ref<number>(0)

// 组件初始化状态
const isInitialized = ref(false)

// 高度计算状态
const isCalculating = ref(false)

// 是否有历史页面可以返回
const hasHistoryPages = ref(true)

// 获取系统信息中的状态栏高度
const { statusBarHeight } = uni.getSystemInfoSync()

/**
 * 检查是否有历史页面可以返回
 */
const checkHistoryPages = () => {
  const pages = getCurrentPages()
  hasHistoryPages.value = pages.length > 1
}

// 获取当前组件实例
const { proxy } = getCurrentInstance() as any

/**
 * 判断是否在微信公众号H5环境中
 */
const isWechatOfficialH5 = (() => {
  // 只有在 H5 环境才需要判断
  if (__UNI_PLATFORM__ !== 'h5') return false

  try {
    // 安全的 User Agent 检测
    const getUserAgent = (): string => {
      try {
        return typeof navigator !== 'undefined' && navigator.userAgent
          ? navigator.userAgent.toLowerCase()
          : ''
      } catch (error) {
        console.warn('获取 userAgent 失败:', error)
        return ''
      }
    }

    const ua = getUserAgent()
    // 在微信中且不是小程序环境
    return ua.includes('micromessenger') && !ua.includes('miniprogram')
  } catch (error) {
    console.warn('判断微信公众号H5环境失败:', error)
    return false
  }
})()

/**
 * 判断是否应该在微信公众号H5中隐藏导航栏
 */
const shouldHideInWechatH5 = computed(() => {
  return props.autoHideInWechatH5 && isWechatOfficialH5
})

/**
 * 计算左侧显示内容
 */
const leftDisplayConfig = computed(() => {
  // 如果开启胶囊模式，不处理左侧内容
  if (props.capsule) {
    return null
  }

  // 如果显式设置了左侧内容，优先使用
  if (props.leftIcon || props.leftText) {
    return null
  }

  // 根据showBack和showHome自动配置
  if (props.showBack && !props.showHome) {
    // 如果设置了显示返回按钮，但没有历史页面，则显示首页按钮
    if (!hasHistoryPages.value) {
      return {
        icon: 'home',
        text: translate('home'),
        action: 'home',
      }
    }
    return {
      icon: 'left',
      text: translate('back'),
      action: 'back',
    }
  } else if (props.showHome && !props.showBack) {
    return {
      icon: 'home',
      text: translate('home'),
      action: 'home',
    }
  }

  return null
})

// 计算标题样式
const titleStyle = computed(() => {
  const styleObj: CSSProperties = {}

  if (props.titleFamily) {
    styleObj.fontFamily = props.titleFamily
  }

  if (props.titleSize) {
    styleObj.fontSize = addUnit(props.titleSize)
  }

  if (props.titleBold) {
    styleObj.fontWeight = 'bold'
  }

  if (props.titleColor) {
    styleObj.color = props.titleColor
  }

  return objToStyle(styleObj)
})

/**
 * 计算最终的左侧图标
 */
const finalLeftIcon = computed(() => {
  return props.leftIcon || leftDisplayConfig.value?.icon || ''
})

/**
 * 计算最终的左侧文字
 */
const finalLeftText = computed(() => {
  return props.leftText || leftDisplayConfig.value?.text || ''
})

/**
 * 计算左侧文字的样式
 */
const leftTextStyle = computed(() => {
  const styleObj: CSSProperties = {
    fontSize: addUnit(props.leftIconSize || 32),
    marginLeft: '8rpx',
    lineHeight: '1',
    display: 'flex',
    alignItems: 'center',
  }

  // 如果设置了左侧图标颜色，文字也使用相同颜色
  if (props.leftIconColor) {
    styleObj.color = props.leftIconColor
  }

  return objToStyle(styleObj)
})

/**
 * 判断是否需要自动返回
 */
const shouldAutoBack = computed(() => {
  // 如果左侧文字是"返回"或者左侧图标是返回相关的图标
  const backTexts = ['返回', '后退']
  const backIcons = ['back', 'left']

  return backTexts.includes(finalLeftText.value) || backIcons.includes(finalLeftIcon.value)
})

/**
 * 判断是否需要自动回到主页
 */
const shouldAutoHome = computed(() => {
  // 如果左侧文字是"主页"或者左侧图标是主页相关的图标
  const homeTexts = ['主页', '首页', '主页面']
  const homeIcons = ['home', 'house']

  return homeTexts.includes(finalLeftText.value) || homeIcons.includes(finalLeftIcon.value)
})

/**
 * 判断是否显示左侧区域
 */
const shouldShowLeft = computed(() => {
  return finalLeftIcon.value || finalLeftText.value || leftDisplayConfig.value
})

/**
 * 设置导航栏标题 - 在微信公众号H5中使用
 */
const setNavigationBarTitle = () => {
  if (props.title && shouldHideInWechatH5.value) {
    try {
      uni.setNavigationBarTitle({
        title: props.title,
      })
      console.log('✅ 微信公众号H5环境 - 设置导航栏标题:', props.title)
    } catch (error) {
      console.warn('❌ 设置导航栏标题失败:', error)
    }
  }
}

/**
 * 使用样式类计算占位高度
 */
const setPlaceholderHeight = async () => {
  // 如果在微信公众号H5中隐藏了导航栏，占位高度为0
  if (shouldHideInWechatH5.value) {
    placeholderHeight.value = 0
    emit('height-ready', 0)
    return true
  }

  if (!props.fixed || !props.placeholder) {
    return false
  }

  if (isCalculating.value) {
    // console.log('高度计算正在进行中，跳过')
    return false
  }

  isCalculating.value = true
  // console.log('开始计算导航栏高度')

  try {
    // 使用 .wd-navbar 类选择器
    const query = uni.createSelectorQuery().in(proxy)

    const getRect = () => {
      return new Promise<any>((resolve, reject) => {
        query
          .select('.wd-navbar')
          .boundingClientRect((rect) => {
            if (rect) {
              // console.log('导航栏尺寸:', rect)
              resolve(rect)
            } else {
              reject(new Error('元素未找到'))
            }
          })
          .exec()
      })
    }

    const rect = await getRect()

    if (rect && rect.height > 0) {
      let height = pxToRpx(rect.height)
      if (height < 60) {
        height = 88
      }
      placeholderHeight.value = height
      emit('height-ready', height)
      // console.log(`✅ 导航栏高度计算成功: ${height}rpx`)
      return true
    } else {
      // console.log('❌ 导航栏高度为0或无效')
      return false
    }
  } catch (error) {
    // console.log('❌ 导航栏计算失败:', error)
    return false
  } finally {
    isCalculating.value = false
  }
}

/**
 * 页面显示时的处理
 */
onShow(() => {
  // 每次页面显示时检查历史页面状态
  checkHistoryPages()

  if (isInitialized.value) {
    // 在微信公众号H5环境下重新设置标题
    if (shouldHideInWechatH5.value) {
      setNavigationBarTitle()
      return
    }

    // 普通环境的高度处理
    if (props.fixed && props.placeholder) {
      const currentHeight = placeholderHeight.value
      // console.log(`页面显示 - 导航栏当前高度: ${currentHeight}`)

      // 只有真正丢失高度时才使用默认值
      if (!currentHeight || currentHeight === 0) {
        // console.log('导航栏高度丢失，使用默认值')
        const defaultHeight = pxToRpx(statusBarHeight || 0) + 88
        placeholderHeight.value = defaultHeight
        emit('height-ready', defaultHeight)
      }
    }
  }
})

/**
 * 组件挂载时的处理
 */
onMounted(async () => {
  // console.log('导航栏组件挂载')

  // 检查历史页面状态
  checkHistoryPages()

  // 在微信公众号H5环境下，只设置标题，不处理导航栏显示
  if (shouldHideInWechatH5.value) {
    setNavigationBarTitle()
    isInitialized.value = true
    return
  }

  // 设置状态栏样式
  if (props.statusBarTextStyle) {
    uni.setNavigationBarColor({
      frontColor: props.statusBarTextStyle === 'dark' ? '#000000' : '#ffffff',
      backgroundColor: props.bgColor || '#ffffff',
    })
  }

  if (props.fixed && props.placeholder) {
    await nextTick()

    // 简单延迟后计算
    setTimeout(async () => {
      const success = await setPlaceholderHeight()
      if (!success) {
        // 如果计算失败，直接使用默认高度
        // console.log('导航栏计算失败，使用默认高度')
        const defaultHeight = pxToRpx(statusBarHeight || 0) + 88
        placeholderHeight.value = defaultHeight
        emit('height-ready', defaultHeight)
      }
    }, 50)
  }

  isInitialized.value = true
})

/**
 * 监听标题变化，在微信公众号H5环境下更新标题
 */
watch(
  () => props.title,
  (newTitle) => {
    if (shouldHideInWechatH5.value && newTitle) {
      setNavigationBarTitle()
    }
  },
)

/**
 * 属性变化监听
 */
watch([() => props.fixed, () => props.placeholder], async () => {
  if (isInitialized.value && !shouldHideInWechatH5.value && props.fixed && props.placeholder) {
    // console.log('导航栏属性变化，重新计算')
    await nextTick()
    await setPlaceholderHeight()
  }
})

/**
 * 处理左侧按钮点击事件
 * 根据按钮类型自动执行相应操作
 */
const handleClickLeft = () => {
  if (props.leftDisabled) return

  const action = leftDisplayConfig.value?.action

  // 自动返回功能
  if ((shouldAutoBack.value && props.autoBack) || action === 'back') {
    uni.navigateBack({
      success: () => {
        emit('back')
      },
      fail: () => {
        // 如果没有上一页，则触发事件让外部处理
        emit('click-left')
      },
    })
    return
  }

  // 自动回到主页功能
  if (shouldAutoHome.value || action === 'home') {
    // 使用 switchTab 跳转到首页（tabbar 页面）
    uni.switchTab({
      url: '/pages/index/index',
      success: () => {
        emit('back-home')
      },
      fail: () => {
        // 如果 switchTab 失败，尝试使用 reLaunch
        uni.reLaunch({
          url: '/pages/index/index',
          success: () => {
            emit('back-home')
          },
          fail: (err) => {
            console.error('跳转到首页失败:', err)
            // 如果失败，则触发事件让外部处理
            emit('click-left')
          },
        })
      },
    })
    return
  }

  // 普通左侧按钮，触发事件
  emit('click-left')
}

/**
 * 处理右侧按钮点击事件
 * 只有在右侧按钮未禁用时才触发事件
 */
const handleClickRight = () => {
  if (!props.rightDisabled) {
    emit('click-right')
  }
}

/**
 * 处理胶囊返回按钮点击事件
 */
const handleCapsuleBack = () => {
  emit('back')
}

/**
 * 处理胶囊首页按钮点击事件
 */
const handleCapsuleBackHome = () => {
  emit('back-home')
}
</script>

<style lang="scss">
// 引入外部样式文件
@import './../common/abstracts/_mixin.scss';
@import './../common/abstracts/variable.scss';

// 暗色主题样式
.wot-theme-dark {
  @include b(navbar) {
    background-color: $-dark-background;

    @include e(title) {
      color: $-dark-color;
    }

    @include e(text) {
      color: $-dark-color;
    }

    :deep(.wd-navbar__icon) {
      color: $-dark-color;
    }
  }
}

// 导航栏主体样式
@include b(navbar) {
  position: relative;
  text-align: center;
  user-select: none;
  height: $-navbar-height;
  line-height: $-navbar-height;
  background-color: $-navbar-background;
  box-sizing: content-box;

  // 内容区域
  @include e(content) {
    position: relative;
    height: 100%;
    width: 100%;
  }

  // 标题样式
  @include e(title) {
    max-width: 60%;
    height: 100%;
    margin: 0 auto;
    color: $-navbar-color;
    font-weight: $-navbar-title-font-weight;
    font-size: $-navbar-title-font-size;
    @include lineEllipsis();
  }

  // 文字样式
  @include e(text) {
    display: inline-block;
    vertical-align: middle;
    color: $-navbar-desc-font-color;
  }

  // 左侧、右侧、胶囊区域通用样式
  @include e(left, right, capsule) {
    position: absolute;
    top: 0;
    bottom: 0;
    font-size: $-navbar-desc-font-size;
    display: flex;
    align-items: center;
    padding: 0 24rpx;

    // 禁用状态样式
    @include when(disabled) {
      opacity: $-navbar-disabled-opacity;
    }
  }

  // 左侧区域特殊样式，与胶囊组件保持一致
  @include e(left) {
    // 确保左侧区域的尺寸与胶囊组件一致
    width: auto;
    min-width: $-navbar-capsule-height; // 最小宽度与胶囊高度一致
    height: 100%; // 使用父容器的完整高度
    justify-content: flex-start; // 内容靠左对齐
    align-items: center; // 垂直居中对齐

    // 确保图标也垂直居中
    :deep(.wd-navbar__icon) {
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1; // 重置行高确保对齐
    }
  }

  // 左侧和胶囊区域位置
  @include e(left, capsule) {
    left: 0;
  }

  // 右侧区域位置
  @include e(right) {
    right: 0;
  }

  // 图标样式
  @include edeep(icon) {
    font-size: $-navbar-arrow-size;
    color: $-navbar-color;
  }

  // 左侧区域图标样式，与胶囊组件保持一致
  @include e(left) {
    :deep(.wd-navbar__icon) {
      font-size: $-navbar-capsule-icon-size; // 使用胶囊组件的图标大小
      color: $-navbar-desc-font-color; // 使用胶囊组件的图标颜色
    }
  }

  // 边框样式
  @include when(border) {
    @include halfPixelBorder('bottom');
  }

  // 固定定位样式
  @include when(fixed) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 500;
  }
}
</style>
