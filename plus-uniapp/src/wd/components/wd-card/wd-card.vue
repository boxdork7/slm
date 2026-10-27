<!-- Card 卡片 用于展示商品的图片、价格等信息。 -->
<template>
  <view
    :class="`wd-card ${type === 'rectangle' ? 'is-rectangle' : ''} ${customClass}`"
    :style="customStyle"
  >
    <!-- 标题区域 -->
    <view
      v-if="title || $slots.title"
      :class="`wd-card__title-content ${customTitleClass}`"
    >
      <view class="wd-card__title">
        <text v-if="title">{{ title }}</text>
        <slot v-else name="title" />
      </view>
    </view>

    <!-- 内容区域 -->
    <view :class="`wd-card__content ${customContentClass}`">
      <slot />
    </view>

    <!-- 底部区域 -->
    <view v-if="$slots.footer" :class="`wd-card__footer ${customFooterClass}`">
      <slot name="footer" />
    </view>
  </view>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'WdCard',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 卡片类型
 */
type CardType = 'rectangle'

/**
 * 卡片组件属性接口
 */
interface WdCardProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 卡片类型 */
  type?: CardType
  /** 卡片标题 */
  title?: string
  /** 标题自定义样式类 */
  customTitleClass?: string
  /** 内容自定义样式类 */
  customContentClass?: string
  /** 底部自定义样式类 */
  customFooterClass?: string
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdCardProps>(), {
  customStyle: '',
  customClass: '',
  customTitleClass: '',
  customContentClass: '',
  customFooterClass: '',
})
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable.scss';
@import '../common/abstracts/_mixin.scss';

// 暗色主题样式
.wot-theme-dark {
  @include b(card) {
    background-color: $-dark-background2;

    @include when(rectangle) {
      .wd-card__content {
        @include halfPixelBorder('top', 0, $-dark-border-color);
      }
      .wd-card__footer {
        @include halfPixelBorder('top', 0, $-dark-border-color);
      }
    }

    @include e(title-content) {
      color: $-dark-color;
    }

    @include e(content) {
      color: $-dark-color3;
    }
  }
}

// 卡片组件样式
@include b(card) {
  padding: $-card-padding;
  background-color: $-card-bg;
  line-height: $-card-line-height;
  margin: $-card-margin;
  border-radius: $-card-radius;
  box-shadow: $-card-shadow-color;
  font-size: $-card-fs;
  margin-bottom: 24rpx;

  // 矩形卡片样式
  @include when(rectangle) {
    margin-left: 0;
    margin-right: 0;
    border-radius: 0;
    box-shadow: none;

    .wd-card__title-content {
      font-size: $-card-fs;
    }

    .wd-card__content {
      position: relative;
      padding: $-card-rectangle-content-padding;
      @include halfPixelBorder('top', 0, $-card-content-border-color);
    }

    .wd-card__footer {
      position: relative;
      padding: $-card-rectangle-footer-padding;
      @include halfPixelBorder('top', 0, $-card-content-border-color);
    }
  }

  // 标题内容样式
  @include e(title-content) {
    padding: 32rpx 0;
    color: $-card-title-color;
    font-size: $-card-title-fs;
  }

  // 内容样式
  @include e(content) {
    color: $-card-content-color;
    line-height: $-card-content-line-height;
  }

  // 底部样式
  @include e(footer) {
    padding: $-card-footer-padding;
    text-align: right;
  }
}
</style>
