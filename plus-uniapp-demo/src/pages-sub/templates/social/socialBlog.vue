<template>
  <view class="min-h-screen bg-#f9f9f9">
    <SocialBlogIndex v-if="tabs[0].loaded" v-show="currentTab === 0" />
    <SocialBlogPublish v-if="tabs[1].loaded" v-show="currentTab === 1" />
    <SocialBlogFollow v-if="tabs[2].loaded" v-show="currentTab === 2" />
    <SocialBlogMy v-if="tabs[3].loaded" v-show="currentTab === 3" />

    <!-- Tabbar -->
    <wd-tabbar v-model="currentTab" :items="tabs" @change="handleTabChange" />
  </view>
</template>

<script setup lang="ts">
import SocialBlogIndex from './socialBlog/components/SocialBlogIndex.vue'
import SocialBlogPublish from './socialBlog/components/SocialBlogPublish.vue'
import SocialBlogFollow from './socialBlog/components/SocialBlogFollow.vue'
import SocialBlogMy from './socialBlog/components/SocialBlogMy.vue'

import { ref } from 'vue'
import type { WdTabbarItemProps } from '@/wd/components/wd-tabbar-item/wd-tabbar-item.vue'

/** 当前激活的标签页索引 */
const currentTab = ref(0)

const tabs = ref<WdTabbarItemProps[]>([
  { title: '首页', icon: 'home', isDot: false, value: 0, loaded: true },
  { title: '发布', icon: 'edit', isDot: false, value: 0, loaded: false },
  { title: '关注', icon: 'heart', isDot: false, value: 0, loaded: false },
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
