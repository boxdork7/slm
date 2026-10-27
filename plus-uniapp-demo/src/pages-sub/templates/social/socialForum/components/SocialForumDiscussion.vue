<!-- 社区论坛-发布帖子 -->
<template>
  <view class="forum-discussion">
    <!-- 导航栏 -->
    <view class="nav-bar">
      <text class="nav-title">发布帖子</text>
    </view>

    <view class="form-content">
      <!-- 选择板块 -->
      <view class="section-block">
        <text class="section-label">选择板块</text>
        <view class="current-board">
          <text class="current-board-text">当前选择：{{ selectedBoard }}</text>
        </view>
        <view class="board-tags">
          <wd-tag
            v-for="board in boards"
            :key="board"
            :custom-style="
              selectedBoard === board
                ? 'background: #0891B2; color: #fff; margin: 8rpx;'
                : 'background: #F3F4F6; color: #374151; margin: 8rpx;'
            "
            @click="selectedBoard = board"
          >
            {{ board }}
          </wd-tag>
        </view>
      </view>

      <!-- 帖子标题 -->
      <view class="section-block">
        <text class="section-label">帖子标题</text>
        <wd-input
          v-model="postTitle"
          placeholder="请输入帖子标题"
          clearable
          custom-style="background: #F9FAFB; border-radius: 12rpx; padding: 8rpx 0;"
        />
      </view>

      <!-- 帖子内容 -->
      <view class="section-block">
        <text class="section-label">帖子内容</text>
        <wd-textarea
          v-model="postContent"
          placeholder="分享你的想法..."
          :auto-height="true"
          :maxlength="-1"
          custom-style="background: #F9FAFB; border-radius: 12rpx; min-height: 300rpx;"
        />
      </view>

      <!-- 添加图片 -->
      <view class="section-block">
        <text class="section-label">添加图片</text>
        <view class="image-placeholder">
          <wd-icon name="fill-camera" size="64rpx" color="#9CA3AF" />
          <text class="image-tip">点击添加图片（最多9张）</text>
        </view>
      </view>
    </view>

    <!-- 底部占位 -->
    <view class="bottom-spacer" />

    <!-- 底部固定发布按钮 -->
    <view class="bottom-fixed">
      <wd-button
        type="primary"
        block
        custom-style="background: #0891B2; border-color: #0891B2; border-radius: 16rpx; height: 88rpx; font-size: 32rpx;"
        @click="handlePublish"
      >
        发布帖子
      </wd-button>
      <view class="safe-area" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/wd'

const toast = useToast()

const selectedBoard = ref('技术')
const postTitle = ref('')
const postContent = ref('')

const boards = ref(['技术', '生活', '影视', '游戏', '读书', '旅行'])

const handlePublish = () => {
  if (!postTitle.value.trim()) {
    toast.warning('请输入帖子标题')
    return
  }
  if (!postContent.value.trim()) {
    toast.warning('请输入帖子内容')
    return
  }
  toast.success('发布成功')
}
</script>

<style scoped lang="scss">
.forum-discussion {
  min-height: 100vh;
  background: #F3F4F6;
}

.nav-bar {
  background: linear-gradient(135deg, #0891B2, #14B8A6);
  padding: 60rpx 24rpx 28rpx;
  text-align: center;
}

.nav-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #fff;
}

.form-content {
  padding: 24rpx;
}

.section-block {
  background: #fff;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
}

.section-label {
  font-size: 28rpx;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 16rpx;
  display: block;
}

.current-board {
  background: #E0F2FE;
  border-radius: 12rpx;
  padding: 16rpx 20rpx;
  margin-bottom: 16rpx;
}

.current-board-text {
  font-size: 26rpx;
  color: #0891B2;
}

.board-tags {
  display: flex;
  flex-wrap: wrap;
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 240rpx;
  background: #F9FAFB;
  border: 2rpx dashed #D1D5DB;
  border-radius: 12rpx;
}

.image-tip {
  font-size: 24rpx;
  color: #9CA3AF;
  margin-top: 12rpx;
}

.bottom-spacer {
  height: 200rpx;
}

.bottom-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 20rpx 24rpx;
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.06);
}

.safe-area {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
