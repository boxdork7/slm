<!-- 新闻频道管理 -->
<template>
  <view class="news-category">
    <!-- 我的频道 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">我的频道</text>
        <view class="edit-btn" @tap="toggleEdit">
          <wd-icon name="edit-outline" size="28rpx" color="#999" />
          <text class="edit-text">{{ isEditing ? '完成' : '编辑' }}</text>
        </view>
      </view>
      <view class="tag-grid">
        <view
          v-for="(ch, idx) in myChannels"
          :key="ch"
          class="tag-wrapper"
        >
          <wd-tag
            custom-style="background:#FEF2F2;color:#EF4444;border:1rpx solid #FECACA;font-size:26rpx;padding:12rpx 24rpx;border-radius:12rpx;width:100%;"
          >
            {{ ch }}
          </wd-tag>
          <view
            v-if="isEditing"
            class="tag-delete"
            @tap="removeChannel(idx)"
          >
            <wd-icon name="close" size="20rpx" color="#fff" />
          </view>
        </view>
      </view>
    </view>

    <!-- 分割线 -->
    <view class="divider" />

    <!-- 推荐频道 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">推荐频道</text>
        <text class="section-tip">点击添加频道</text>
      </view>
      <view class="tag-grid">
        <view
          v-for="ch in recommendChannels"
          :key="ch"
          class="tag-wrapper"
          @tap="addChannel(ch)"
        >
          <wd-tag
            custom-style="background:#f5f5f5;color:#666;border:1rpx solid #e5e5e5;font-size:26rpx;padding:12rpx 24rpx;border-radius:12rpx;width:100%;"
          >
            + {{ ch }}
          </wd-tag>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/wd'

const toast = useToast()
const isEditing = ref(false)

const myChannels = ref(['推荐', '热点', '科技', '财经', '体育', '娱乐', '军事', '国际'])
const recommendChannels = ref(['汽车', '房产', '教育', '健康', '美食', '旅行', '时尚', '游戏'])

function toggleEdit() {
  isEditing.value = !isEditing.value
}

function removeChannel(idx: number) {
  const removed = myChannels.value.splice(idx, 1)[0]
  recommendChannels.value.push(removed)
  toast.info(`已移除「${removed}」`)
}

function addChannel(ch: string) {
  myChannels.value.push(ch)
  recommendChannels.value = recommendChannels.value.filter((c) => c !== ch)
  toast.success(`已添加「${ch}」`)
}
</script>

<style scoped lang="scss">
.news-category {
  min-height: 100vh;
  background: #fff;
  padding: 32rpx;
}

/* 区块 */
.section {
  margin-bottom: 32rpx;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.section-title {
  font-size: 34rpx;
  font-weight: 700;
  color: #1a1a1a;
}

.edit-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.edit-text {
  font-size: 24rpx;
  color: #999;
}

.section-tip {
  font-size: 24rpx;
  color: #999;
}

/* 标签网格 */
.tag-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}

.tag-wrapper {
  position: relative;
}

/* 删除按钮 */
.tag-delete {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  width: 32rpx;
  height: 32rpx;
  background: #EF4444;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

/* 分割线 */
.divider {
  height: 1rpx;
  background: #f0f0f0;
  margin: 16rpx 0 32rpx;
}
</style>
