<!-- 社交博客 - 关注 -->
<template>
  <view class="min-h-100vh bg-gray-50">
    <!-- 搜索用户 -->
    <view class="bg-white px-32rpx pt-16rpx pb-24rpx">
      <wd-search v-model="searchValue" placeholder="搜索用户..." :hide-cancel="true" @search="handleSearch" />
    </view>

    <!-- 标题 -->
    <view class="px-32rpx py-24rpx bg-white border-b border-gray-100">
      <text class="text-[30rpx] font-semibold text-gray-800">我的关注</text>
      <text class="text-[22rpx] text-gray-400 ml-12rpx">共 {{ followList.length }} 人</text>
    </view>

    <scroll-view class="flex-1" scroll-y :show-scrollbar="false">
      <!-- 关注列表 -->
      <view class="bg-white mx-24rpx mt-20rpx rounded-2xl overflow-hidden">
        <view
          v-for="(item, index) in followList"
          :key="item.id"
          class="flex items-start px-28rpx py-28rpx"
          :class="index < followList.length - 1 ? 'border-b border-gray-50' : ''"
          @click="handleUserClick(item)"
        >
          <!-- 头像 -->
          <view
            class="w-88rpx h-88rpx rounded-full flex items-center justify-center text-[40rpx] flex-shrink-0"
            :style="{ background: item.avatarBg }"
          >
            {{ item.emoji }}
          </view>

          <!-- 用户信息 -->
          <view class="ml-20rpx flex-1 min-w-0">
            <view class="flex items-center justify-between">
              <text class="text-[26rpx] font-medium text-gray-800">{{ item.name }}</text>
              <wd-tag
                size="small"
                round
                :custom-style="item.mutual
                  ? 'background: #f5f3ff; color: #8B5CF6; border: none;'
                  : 'background: #f3f4f6; color: #9ca3af; border: none;'"
              >
                {{ item.mutual ? '互关' : '已关注' }}
              </wd-tag>
            </view>
            <text class="text-[22rpx] text-gray-400 mt-4rpx block">{{ item.desc }}</text>

            <!-- 最新动态 -->
            <view class="mt-16rpx bg-gray-50 rounded-lg px-20rpx py-16rpx">
              <text class="text-[22rpx] text-gray-500 line-clamp-2 block">{{ item.latestAction }}</text>
              <text class="text-[20rpx] text-gray-400 mt-8rpx block">{{ item.latestTime }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部间距 -->
      <view class="h-24rpx" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { useToast } from '@/wd'

const toast = useToast()
const searchValue = ref('')

const followList = ref([
  {
    id: 1,
    name: '林小白',
    emoji: '🧑‍💻',
    avatarBg: '#ede9fe',
    desc: '前端架构师 | Vue/React 深度玩家',
    mutual: true,
    latestAction: '发布了新文章：《Vue 3.5 新特性解析：更强大的响应式系统》',
    latestTime: '2小时前',
  },
  {
    id: 2,
    name: '设计小鱼',
    emoji: '👩‍🎨',
    avatarBg: '#fef3c7',
    desc: 'UI/UX 设计师 | 追求极致体验',
    mutual: true,
    latestAction: '发布了新文章：《2026 年 UI 设计趋势：AI 驱动的个性化体验》',
    latestTime: '5小时前',
  },
  {
    id: 3,
    name: '后端老王',
    emoji: '🧑‍🔬',
    avatarBg: '#d1fae5',
    desc: 'Java 架构师 | 10年后端经验',
    mutual: false,
    latestAction: '评论了你的文章：「这篇关于微服务的分析很到位，补充一点关于服务网格的...」',
    latestTime: '昨天',
  },
  {
    id: 4,
    name: '全栈小美',
    emoji: '👩‍💻',
    avatarBg: '#dbeafe',
    desc: '全栈工程师 | DevOps 爱好者',
    mutual: false,
    latestAction: '发布了新文章：《从零搭建企业级 CI/CD 流水线完整指南》',
    latestTime: '2天前',
  },
  {
    id: 5,
    name: 'AI探索者',
    emoji: '🧑‍🏫',
    avatarBg: '#fecdd3',
    desc: 'AI 研究员 | AGI 布道师',
    mutual: true,
    latestAction: '发布了新文章：《大语言模型微调实战：从理论到 LoRA 落地》',
    latestTime: '3天前',
  },
  {
    id: 6,
    name: '云原生小哥',
    emoji: '🧑‍🚀',
    avatarBg: '#cffafe',
    desc: 'K8s 专家 | CNCF 贡献者',
    mutual: false,
    latestAction: '点赞了你的文章：《Docker 多阶段构建优化镜像体积》',
    latestTime: '4天前',
  },
])

const handleSearch = () => toast.info(`搜索: ${searchValue.value}`)
const handleUserClick = (item: { name: string }) => toast.info(`查看: ${item.name}`)
</script>

<style lang="scss" scoped></style>
