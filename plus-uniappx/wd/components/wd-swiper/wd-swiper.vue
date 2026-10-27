<!-- Swiper 轮播 用于创建轮播，它支持水平和垂直方向的滑动，
可以自定义样式和指示器位置，支持视频和图片资源的轮播，支持设置轮播标题和自定义标题样式。 -->
<template>
  <view :class="`wd-swiper ${customClass}`" :style="customStyle">
    <!-- #ifdef MP-WEIXIN -->
    <scroll-view scroll-y scroll-x style="width: 100%; height: 100%">
      <!-- #endif -->
      <swiper
        :adjust-height="adjustHeight"
        :adjust-vertical-height="adjustVerticalHeight"
        class="wd-swiper__track"
        :autoplay="autoplay && !videoPlaying"
        :current="navCurrent"
        :interval="interval"
        :duration="duration"
        :circular="loop"
        :vertical="direction === 'vertical'"
        :easing-function="easingFunction"
        :previous-margin="addUnit(previousMargin)"
        :next-margin="addUnit(nextMargin)"
        :snap-to-edge="snapToEdge"
        :display-multiple-items="Math.min(displayMultipleItems, list.length)"
        :style="{ height: addUnit(height) }"
        @change="handleChange"
        @animationfinish="handleAnimationfinish"
      >
        <swiper-item v-for="(item, index) in list" :key="index" class="wd-swiper__item">
          <slot :item="item" :index="index">
            <video
              v-if="isVideo(item)"
              :id="`video-${index}-${uid}`"
              objectFit="cover"
              :style="{ height: addUnit(height) }"
              :src="isObj(item) ? item[valueKey] : item"
              :poster="isObj(item) ? item.poster : ''"
              :class="`wd-swiper__video ${customItemClass} ${getCustomItemClass(currentValue, index, list)}`"
              :enable-progress-gesture="false"
              :loop="videoLoop"
              :muted="muted"
              :autoplay="autoplayVideo"
              @play="handleVideoPlay"
              @pause="handleVideoPause"
              @click="handleClick(index, item)"
            />
            <image
              v-else
              :src="isObj(item) ? item[valueKey] : item"
              :class="`wd-swiper__image ${customImageClass} ${customItemClass} ${getCustomItemClass(currentValue, index, list)}`"
              :style="{ height: addUnit(height) }"
              :mode="imageMode"
              @click="handleClick(index, item)"
            />

            <text
              v-if="isObj(item) && item[textKey]"
              :class="`wd-swiper__text ${customTextClass}`"
              :style="customTextStyle"
            >
              {{ item[textKey] }}
            </text>
          </slot>
        </swiper-item>
      </swiper>
      <!-- #ifdef MP-WEIXIN -->
    </scroll-view>
    <!-- #endif -->

    <template v-if="indicator">
      <slot name="indicator" :current="currentValue" :total="list.length" />
      <wd-swiper-nav
        v-if="!$slots.indicator"
        :custom-class="customIndicatorClass"
        :type="swiperIndicator.type"
        :current="swiperIndicator.current"
        :total="swiperIndicator.total"
        :direction="swiperIndicator.direction"
        :indicator-position="swiperIndicator.indicatorPosition"
        :min-show-num="swiperIndicator.minShowNum"
        :show-controls="swiperIndicator.showControls"
        @change="handleIndicatorChange"
      />
    </template>
  </view>
</template>

<script lang="ts" setup>
import type { ImageMode } from '../wd-img/wd-img.vue'
import type { WdSwiperNavProps } from '../wd-swiper-nav/wd-swiper-nav.vue'
import { computed, getCurrentInstance, ref, watch } from 'vue'
import { addUnit, isDef, isImageUrl, isObj, isVideoUrl, uuid } from '../common/util'
import wdSwiperNav from '../wd-swiper-nav/wd-swiper-nav.vue'

defineOptions({
  name: 'WdSwiper',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 轮播滑动方向
 */
type DirectionType = 'horizontal' | 'vertical'

/**
 * 切换动画
 */
type EasingType = 'default' | 'linear' | 'easeInCubic' | 'easeOutCubic' | 'easeInOutCubic'

/**
 * 指示器位置
 */
type IndicatorPositionType =
  | 'left'
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right'
  | 'right'

/**
 * 高度调整类型
 * first：第一个滑块。
 * current：实时的当前滑块。
 * highest：高度最大的滑块。
 * none：不根据滑块调整高度，容器高度取决于自身样式。
 */
type AdjustHeightType = 'first' | 'current' | 'highest' | 'none'

/**
 * 资源类型
 */
type SwiperItemType = 'image' | 'video'

/**
 * 轮播项接口
 */
interface SwiperList {
  [key: string]: any

  /** 图片、视频等资源地址 */
  value?: string
  /** 视频资源的封面 */
  poster?: string
  /** 资源文件类型，可选值：'image' | 'video' */
  type?: SwiperItemType
}

/**
 * 轮播组件属性接口
 */
interface WdSwiperProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 是否自动播放轮播图 */
  autoplay?: boolean
  /** 当前轮播在哪一项（下标） */
  current?: number
  /** 轮播滑动方向，可选值：'horizontal'（水平）或'vertical'（垂直） */
  direction?: DirectionType
  /** 同时显示的滑块数量 */
  displayMultipleItems?: number
  /** 滑动动画时长，单位为毫秒 */
  duration?: number
  /** 指定 swiper 切换缓动动画类型 */
  easingFunction?: EasingType
  /** 轮播的高度 */
  height?: number | string
  /** 轮播间隔时间，单位为毫秒 */
  interval?: number
  /** 图片列表，可以是一个图片对象数组或字符串数组 */
  list?: SwiperList[] | string[]
  /** 是否循环播放轮播图 */
  loop?: boolean
  /** 视频是否循环播放 */
  videoLoop?: boolean
  /** 视频是否静音播放 */
  muted?: boolean
  /** 后边距 */
  nextMargin?: number | string
  /** 页码信息展示位置 */
  indicatorPosition?: IndicatorPositionType
  /** 前边距 */
  previousMargin?: number | string
  /** 是否应用边距到第一个、最后一个元素 */
  snapToEdge?: boolean
  /** 指示器全部配置，可以是布尔值或指示器配置对象 */
  indicator?: boolean | Partial<WdSwiperNavProps>
  /** 图片裁剪、缩放的模式 */
  imageMode?: ImageMode
  /** 选项对象中，value 对应的 key */
  valueKey?: string
  /** 选项对象中，标题 text 对应的 key */
  textKey?: string
  /** 视频是否自动播放 */
  autoplayVideo?: boolean
  /** 切换轮播项时是否停止上一个视频的播放 */
  stopPreviousVideo?: boolean
  /** 视频播放时是否停止自动轮播 */
  stopAutoplayWhenVideoPlay?: boolean
  /** 自动以指定滑块的高度为整个容器的高度，仅支付宝小程序支持 */
  adjustHeight?: AdjustHeightType
  /** vertical 为 true 时强制使 adjust-height 生效，仅支付宝小程序支持 */
  adjustVerticalHeight?: boolean
  /** 自定义指示器类名 */
  customIndicatorClass?: string
  /** 自定义图片类名 */
  customImageClass?: string
  /** 自定义上一个图片类名 */
  customPrevImageClass?: string
  /** 自定义下一个图片类名 */
  customNextImageClass?: string
  /** 自定义swiper子项类名 */
  customItemClass?: string
  /** 自定义上一个子项类名 */
  customPrevClass?: string
  /** 自定义下一个子项类名 */
  customNextClass?: string
  /** 自定义文字标题类名 */
  customTextClass?: string
  /** 自定义文字标题样式 */
  customTextStyle?: string
}

/**
 * 轮播组件事件接口
 */
interface WdSwiperEmits {
  /** 点击滑块时触发 */
  click: [{ index: number; item: string | SwiperList }]
  /** 轮播滑块切换时触发 */
  change: [{ current: number; source: string }]
  /** 滑块动画结束时触发 */
  animationfinish: [{ current: number; source: string }]
  /** 当前项更新时触发 */
  'update:current': [current: number]
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdSwiperProps>(), {
  customStyle: '',
  customClass: '',
  autoplay: true,
  current: 0,
  direction: 'horizontal',
  displayMultipleItems: 1,
  duration: 300,
  easingFunction: 'default',
  height: '350',
  interval: 5000,
  list: () => [],
  loop: true,
  videoLoop: true,
  muted: true,
  nextMargin: '0',
  indicatorPosition: 'bottom',
  previousMargin: '0',
  snapToEdge: false,
  indicator: true,
  imageMode: 'aspectFill',
  valueKey: 'value',
  textKey: 'text',
  autoplayVideo: true,
  stopPreviousVideo: true,
  stopAutoplayWhenVideoPlay: false,
  adjustHeight: 'highest',
  adjustVerticalHeight: false,
  customIndicatorClass: '',
  customImageClass: '',
  customPrevImageClass: '',
  customNextImageClass: '',
  customItemClass: '',
  customPrevClass: '',
  customNextClass: '',
  customTextClass: '',
  customTextStyle: '',
})

// 定义组件事件
const emit = defineEmits<WdSwiperEmits>()

// 响应式数据
const navCurrent = ref<number>(props.current) // 当前滑块 swiper使用
const currentValue = ref<number>(props.current) // 当前滑块
const videoPlaying = ref<boolean>(false) // 当前是否在播放视频
const uid = ref<string>(uuid())

// 获取当前组件实例
const { proxy } = getCurrentInstance() as any

/**
 * 计算指示器配置
 * 合并默认配置和用户配置
 */
const swiperIndicator = computed(() => {
  const { list, direction, indicatorPosition, indicator } = props
  const config: Partial<WdSwiperNavProps> = {
    current: currentValue.value || 0,
    total: list.length || 0,
    direction: direction || 'horizontal',
    indicatorPosition: indicatorPosition || 'bottom',
  }

  if (isObj(indicator)) {
    const indicatorConfig = indicator as Partial<WdSwiperNavProps>
    config.type = indicatorConfig.type || 'dots'
    config.minShowNum = indicatorConfig.minShowNum || 2
    config.showControls = indicatorConfig.showControls || false
  }

  return config
})

/**
 * 更新当前滑块
 * @param current 当前滑块索引
 * @param force 是否强制更新swiper绑定的current
 */
const updateCurrent = (current: number, force: boolean = false) => {
  currentValue.value = current
  if (force) {
    navCurrent.value = current
  }
  emit('update:current', current)
}

/**
 * 获取媒体类型
 * @param item 轮播项
 * @param type 检查的类型
 * @returns 是否为指定类型
 */
const getMediaType = (item: string | SwiperList, type: 'video' | 'image'): boolean => {
  const checkType = (url: string) => (type === 'video' ? isVideoUrl(url) : isImageUrl(url))

  if (isObj(item)) {
    const itemObj = item as SwiperList
    return itemObj.type && ['video', 'image'].includes(itemObj.type)
      ? itemObj.type === type
      : checkType(itemObj[props.valueKey] || '')
  } else {
    return checkType(item)
  }
}

/**
 * 判断是否为视频
 * @param item 轮播项
 * @returns 是否为视频
 */
const isVideo = (item: string | SwiperList): boolean => {
  return getMediaType(item, 'video')
}

/**
 * 判断是否为图片
 * @param item 轮播项
 * @returns 是否为图片
 */
const isImage = (item: string | SwiperList): boolean => {
  return getMediaType(item, 'image')
}

/**
 * 导航到指定位置
 * @param index 目标索引
 */
const navTo = (index: number) => {
  if (index === currentValue.value) return
  updateCurrent(index, true)
}

/**
 * 跳转到开始位置
 */
const goToStart = () => {
  navTo(0)
}

/**
 * 跳转到结束位置
 */
const goToEnd = () => {
  navTo(props.list.length - 1)
}

/**
 * 是否为当前滑块的前一个滑块
 * @param current 当前索引
 * @param index 检查的索引
 * @param list 轮播列表
 * @returns 是否为前一个滑块
 */
const isPrev = (current: number, index: number, list: string[] | SwiperList[]): boolean => {
  return (current - 1 + list.length) % list.length === index
}

/**
 * 是否为当前滑块的后一个滑块
 * @param current 当前索引
 * @param index 检查的索引
 * @param list 轮播列表
 * @returns 是否为后一个滑块
 */
const isNext = (current: number, index: number, list: string[] | SwiperList[]): boolean => {
  return (current + 1 + list.length) % list.length === index
}

/**
 * 监听 current 属性变化
 * 当 current 属性发生变化时，自动调整轮播位置
 */
watch(
  () => props.current,
  (val) => {
    if (val < 0) {
      props.loop ? goToEnd() : goToStart()
    } else if (val >= props.list.length) {
      props.loop ? goToStart() : goToEnd()
    } else {
      navTo(val)
    }
  },
)

/**
 * 获取自定义项类名
 * @param current 当前索引
 * @param index 项索引
 * @param list 轮播列表
 * @returns 自定义类名
 */
const getCustomItemClass = (
  current: number,
  index: number,
  list: string[] | SwiperList[],
): string => {
  let customItemClass: string = ''
  if (isPrev(current, index, list)) {
    customItemClass = props.customPrevClass || props.customPrevImageClass
  }
  if (isNext(current, index, list)) {
    customItemClass = props.customNextClass || props.customNextImageClass
  }
  return customItemClass
}

/**
 * 视频播放事件处理
 */
const handleVideoPlay = () => {
  if (props.stopAutoplayWhenVideoPlay) {
    videoPlaying.value = true
  }
}

/**
 * 视频暂停事件处理
 */
const handleVideoPause = () => {
  videoPlaying.value = false
}

/**
 * 开始播放指定视频
 * @param index 视频索引
 */
const handleStartVideoPlay = (index: number) => {
  if (props.autoplayVideo) {
    const currentItem = props.list[index]
    if (isDef(currentItem) && isVideo(currentItem)) {
      const video = uni.createVideoContext(`video-${index}-${uid.value}`, proxy)
      video.play()
    }
  }
}

/**
 * 停止播放指定视频
 * @param index 视频索引
 */
const handleStopVideoPlay = (index: number) => {
  if (props.stopPreviousVideo) {
    const previousItem = props.list[index]
    if (isDef(previousItem) && isVideo(previousItem)) {
      const video = uni.createVideoContext(`video-${index}-${uid.value}`, proxy)
      video.pause()
    }
  } else if (props.stopAutoplayWhenVideoPlay) {
    handleVideoPause()
  }
}

/**
 * 处理视频切换
 * @param previous 上一个索引
 * @param current 当前索引
 */
const handleVideoChange = (previous: number, current: number) => {
  handleStopVideoPlay(previous)
  handleStartVideoPlay(current)
}

/**
 * 轮播滑块切换时触发
 * @param e 事件对象
 */
const handleChange = (e: { detail: { current: number; source: string } }) => {
  const { current, source } = e.detail
  const previous = currentValue.value
  emit('change', { current, source })

  if (current !== currentValue.value) {
    const forceUpdate = source === 'autoplay' || source === 'touch'
    updateCurrent(current, forceUpdate)
  }

  handleVideoChange(previous, current)
}

/**
 * 滑块动画结束时触发
 * @param e 事件对象
 */
const handleAnimationfinish = (e: { detail: { current: any; source: string } }) => {
  const { current, source } = e.detail

  if (current !== currentValue.value) {
    const forceUpdate = source === 'autoplay' || source === 'touch'
    updateCurrent(current, forceUpdate)
  }

  emit('animationfinish', { current, source })
}

/**
 * 点击滑块事件处理
 * @param index 点击的滑块下标
 * @param item 点击的滑块内容
 */
const handleClick = (index: number, item: string | SwiperList) => {
  emit('click', { index, item })
}

/**
 * 指示器变化事件处理
 * @param param0 指示器变化参数
 */
const handleIndicatorChange = ({ dir }: { dir: 'prev' | 'next' }) => {
  const { list, loop } = props
  const total = list.length
  let nextPos = dir === 'next' ? currentValue.value + 1 : currentValue.value - 1

  if (loop) {
    nextPos =
      dir === 'next' ? (currentValue.value + 1) % total : (currentValue.value - 1 + total) % total
  } else {
    nextPos = nextPos < 0 || nextPos >= total ? currentValue.value : nextPos
  }

  if (nextPos === currentValue.value) return
  navTo(nextPos)
}
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 轮播组件样式
@include b(swiper) {
  position: relative;

  // 轮播轨道
  @include e(track) {
    border-radius: $-swiper-radius;
    overflow: hidden;
    transform: translateY(0);
  }

  // 轮播项
  @include e(item) {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: $-swiper-item-padding;
  }

  // 图片和视频样式
  @include e(image, video) {
    width: 100%;
    transition: all 0.3s ease;
  }

  // 文本样式
  @include e(text) {
    // 随便搞个样式，反正用户还是会覆盖的
    position: absolute;
    right: 24rpx;
    top: 24rpx;
    color: $-swiper-item-text-color;
    font-size: $-swiper-item-text-fs;
  }
}
</style>
