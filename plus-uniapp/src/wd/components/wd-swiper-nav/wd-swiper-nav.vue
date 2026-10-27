<!-- SwiperNav - 轮播导航组件，提供点状、条状、分式等多种指示器样式和左右控制按钮功能 供wd-swiper使用的。 -->
<template>
  <view v-if="showControls" class="wd-swiper-nav__btn">
    <view class="wd-swiper-nav__btn--prev" @click="handleNav('prev')" />
    <view class="wd-swiper-nav__btn--next" @click="handleNav('next')" />
  </view>
  <view
    v-if="total >= minShowNum"
    :style="customStyle"
    :class="`wd-swiper-nav wd-swiper-nav--${direction} wd-swiper-nav--${type} wd-swiper-nav--${indicatorPosition} ${customClass}`"
  >
    <block v-if="type === 'dots' || type === 'dots-bar'">
      <view
        v-for="(_, index) in total"
        :key="index"
        :class="`wd-swiper-nav__item--${type} ${current === index ? 'is-active' : ''} is-${direction}`"
      />
    </block>
    <block v-if="type === 'fraction'">{{ current + 1 }}/{{ total }}</block>
  </view>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'WdSwiperNav',
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
 * 指示器类型，点状(dots)、点条状(dots-bar)、分式(fraction)等
 */
type SwiperIndicatorType = 'dots' | 'dots-bar' | 'fraction'

/**
 * 轮播导航组件属性接口
 */
export interface WdSwiperNavProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 当前轮播在哪一项（下标） */
  current?: number
  /** 轮播滑动方向，包括横向滑动和纵向滑动两个方向 */
  direction?: DirectionType
  /** 小于这个数字不会显示导航器 */
  minShowNum?: number
  /** 指示器位置 */
  indicatorPosition?: IndicatorPositionType
  /** 是否显示两侧的控制按钮 */
  showControls?: boolean
  /** 总共的项数 */
  total?: number
  /** 指示器类型，点状(dots)、点条状(dots-bar)、分式(fraction)等 */
  type?: SwiperIndicatorType
}

/**
 * 轮播导航组件事件接口
 */
interface WdSwiperNavEmits {
  /** 导航切换时触发 */
  change: [{ dir: 'prev' | 'next'; source: string }]
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdSwiperNavProps>(), {
  customStyle: '',
  customClass: '',
  current: 0,
  direction: 'horizontal',
  minShowNum: 2,
  indicatorPosition: 'bottom',
  showControls: false,
  total: 0,
  type: 'dots',
})

// 定义组件事件
const emit = defineEmits<WdSwiperNavEmits>()

/**
 * 处理导航点击事件
 * @param dir 导航方向，'prev' 表示上一个，'next' 表示下一个
 */
const handleNav = (dir: 'prev' | 'next') => {
  const source: string = 'nav'
  emit('change', { dir, source })
}
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 轮播导航组件样式
@include b(swiper-nav) {
  // 控制按钮样式
  @include e(btn) {
    @include m(prev, next) {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: $-swiper-nav-btn-size;
      height: $-swiper-nav-btn-size;
      border-radius: 50%;
      background: $-swiper-nav-btn-bg-color;

      &::after {
        position: absolute;
        left: 50%;
        top: 50%;
        display: block;
        content: '';
        width: 12rpx;
        height: 12rpx;
        border-color: $-swiper-nav-btn-color;
        border-style: solid;
      }
    }

    // 上一个按钮
    @include m(prev) {
      left: 30rpx;

      &::after {
        margin-left: 4rpx;
        border-width: 2rpx 0 0 2rpx;
        transform: translate(-50%, -50%) rotateZ(-45deg);
      }
    }

    // 下一个按钮
    @include m(next) {
      right: 30rpx;

      &::after {
        margin-left: -4rpx;
        border-width: 2rpx 2rpx 0 0;
        transform: translate(-50%, -50%) rotateZ(45deg);
      }
    }
  }

  // 点状和点条状指示器布局
  @include m(dots, dots-bar) {
    display: flex;
    flex-direction: row;
  }

  // 分式指示器样式
  @include m(fraction) {
    padding: 0 16rpx;
    height: $-swiper-nav-fraction-height;
    line-height: $-swiper-nav-fraction-height;
    border-radius: calc($-swiper-nav-fraction-height / 2);
    background: $-swiper-nav-fraction-bg-color;
    color: $-swiper-nav-fraction-color;
    font-size: $-swiper-nav-fraction-font-size;
  }

  // 指示器项样式
  @include e(item) {
    @include m(dots, dots-bar) {
      width: $-swiper-nav-dot-size;
      height: $-swiper-nav-dot-size;
      background: $-swiper-nav-dot-color;
      border-radius: 50%;
      margin: 0 10rpx;
      transition: all 0.4s ease-in;

      // 垂直方向
      @include when(vertical) {
        margin: 10rpx 0;
      }

      // 激活状态
      @include when(active) {
        background-color: $-swiper-nav-dot-active-color;
      }
    }

    // 点条状指示器特殊样式
    @include m(dots-bar) {
      @include when(vertical) {
        @include when(active) {
          width: $-swiper-nav-dot-size;
          height: $-swiper-nav-dots-bar-active-width;
        }
      }

      @include when(active) {
        width: $-swiper-nav-dots-bar-active-width;
        border-radius: calc($-swiper-nav-dot-size / 2);
        background-color: $-swiper-nav-dot-active-color;
      }
    }
  }

  // 位置样式
  @include m(left) {
    position: absolute;
    left: 24rpx;
    top: 50%;
    transform: translateY(-50%);
  }

  @include m(right) {
    position: absolute;
    right: 24rpx;
    top: 50%;
    transform: translateY(-50%);
  }

  @include m(top-left) {
    position: absolute;
    top: 24rpx;
    left: 24rpx;
  }

  @include m(top) {
    position: absolute;
    left: 50%;
    top: 24rpx;
    transform: translateX(-50%);
  }

  @include m(top-right) {
    position: absolute;
    top: 24rpx;
    right: 24rpx;
  }

  @include m(bottom-left) {
    position: absolute;
    left: 24rpx;
    bottom: 24rpx;
  }

  @include m(bottom) {
    position: absolute;
    left: 50%;
    bottom: 24rpx;
    transform: translateX(-50%);
  }

  @include m(bottom-right) {
    position: absolute;
    right: 24rpx;
    bottom: 24rpx;
  }

  // 垂直方向布局
  @include m(vertical) {
    flex-direction: column;
  }
}
</style>
