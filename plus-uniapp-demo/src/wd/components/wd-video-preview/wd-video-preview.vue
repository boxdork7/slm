<!-- 视频弹窗预览 用于弹窗预览视频 -->
<template>
  <view
    v-if="showPopup"
    :class="`wd-video-preview ${customClass}`"
    :style="customStyle"
    @click="close"
  >
    <view class="wd-video-preview__video" @click.stop="">
      <video
        v-if="previewVideo.url"
        class="wd-video-preview__video"
        :controls="true"
        :poster="previewVideo.poster"
        :title="previewVideo.title"
        :autoplay="previewVideo.autoplay"
        play-btn-position="center"
        :enableNative="true"
        :src="previewVideo.url"
        :enable-progress-gesture="false"
      />
    </view>
    <wd-icon custom-class="wd-video-preview__close" name="close" @click="close" />
  </view>
</template>

<script lang="ts" setup>
import type { ComponentPublicInstance } from 'vue'
import { nextTick, reactive, ref } from 'vue'
import { useLockScroll } from '../composables/useLockScroll'
import wdIcon from '../wd-icon/wd-icon.vue'

defineOptions({
  name: 'WdVideoPreview',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 预览视频数据接口
 */
interface PreviewVideo {
  /** 视频资源地址 */
  url: string
  /** 视频封面 */
  poster?: string
  /** 视频标题 */
  title?: string
  /** 是否自动播放 */
  autoplay?: boolean
}

/**
 * 视频预览组件属性接口
 */
interface WdVideoPreviewProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string
}

/**
 * 视频预览组件暴露的方法接口
 */
interface WdVideoPreviewExpose {
  /** 打开弹框 */
  open: (video: PreviewVideo) => void
  /** 关闭弹框 */
  close: () => void
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdVideoPreviewProps>(), {
  customStyle: '',
  customClass: '',
})

// 响应式数据：弹框显示状态
const showPopup = ref<boolean>(false)

// 响应式数据：预览视频信息
const previewVideo = reactive<PreviewVideo>({
  url: '',
  poster: '',
  title: '',
  autoplay: false,
})

/**
 * 打开视频预览弹框
 * @param video 视频信息对象
 */
const open = (video: PreviewVideo) => {
  showPopup.value = true
  previewVideo.url = video.url
  previewVideo.poster = video.poster || ''
  previewVideo.title = video.title || ''
  previewVideo.autoplay = video.autoplay || false
}

/**
 * 处理弹框关闭后的清理工作
 * 清空视频相关数据
 */
const handleClosed = () => {
  previewVideo.url = ''
  previewVideo.poster = ''
  previewVideo.title = ''
  previewVideo.autoplay = false
}

/**
 * 关闭视频预览弹框
 * 关闭后清空视频信息
 */
const close = () => {
  showPopup.value = false
  nextTick(() => {
    handleClosed()
  })
}

// #ifdef H5
// H5 端锁定滚动
useLockScroll(() => showPopup.value)
// #endif

// 暴露组件方法
defineExpose<WdVideoPreviewExpose>({
  open,
  close,
})

/** 视频预览组件实例类型 */
export type VideoPreviewInstance = ComponentPublicInstance<
  WdVideoPreviewProps,
  WdVideoPreviewExpose
>
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable.scss';
@import '../common/abstracts/_mixin.scss';

// 视频预览组件样式
@include b(video-preview) {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: $-video-preview-bg;

  // 视频容器样式
  @include e(video) {
    width: 100%;
    height: 484rpx;
    transition: all 0.3s ease;
  }

  // 关闭按钮样式
  @include edeep(close) {
    position: absolute;
    box-sizing: border-box;
    top: 0;
    right: 0;
    padding: 24rpx;
    text-align: center;
    cursor: pointer;
    font-size: $-video-preview-close-font-size;
    color: $-video-preview-close-color;
  }
}
</style>
