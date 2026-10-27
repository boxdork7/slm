<template>
  <view class="min-h-screen bg-#f9f9f9">
    <SocialForumIndex v-if="tabs[0].loaded" v-show="currentTab === 0" />
    <SocialForumDiscussion v-if="tabs[1].loaded" v-show="currentTab === 1" />
    <SocialForumMessage v-if="tabs[2].loaded" v-show="currentTab === 2" />
    <SocialForumMy v-if="tabs[3].loaded" v-show="currentTab === 3" />

    <!-- Tabbar -->
    <wd-tabbar v-model="currentTab" :items="tabs" @change="handleTabChange" />
  </view>
</template>

<script setup lang="ts">
import SocialForumIndex from './socialForum/components/SocialForumIndex.vue'
import SocialForumDiscussion from './socialForum/components/SocialForumDiscussion.vue'
import SocialForumMessage from './socialForum/components/SocialForumMessage.vue'
import SocialForumMy from './socialForum/components/SocialForumMy.vue'

import { ref } from 'vue'
import type { WdTabbarItemProps } from '@/wd/components/wd-tabbar-item/wd-tabbar-item.vue'

/** 当前激活的标签页索引 */
const currentTab = ref(0)

const tabs = ref<WdTabbarItemProps[]>([
  { title: '首页', icon: 'home', isDot: false, value: 0, loaded: true },
  { title: '讨论', icon: 'chat', isDot: false, value: 0, loaded: false },
  { title: '消息', icon: 'audio', isDot: false, value: 0, loaded: false },
  { title: '我的', icon: 'user', isDot: false, value: 0, loaded: false },
])

/**
 * 处理标签页切换事件
 */
const handleTabChange = (index: number) => {
  currentTab.value = index
}
</script>

<style scoped lang="scss"></style>
