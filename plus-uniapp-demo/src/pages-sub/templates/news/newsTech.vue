<template>
  <view class="min-h-screen bg-#f9f9f9">
    <NewsTechIndex v-if="tabs[0].loaded" v-show="currentTab === 0" />
    <NewsTechNews v-if="tabs[1].loaded" v-show="currentTab === 1" />
    <NewsTechReview v-if="tabs[2].loaded" v-show="currentTab === 2" />
    <NewsTechMy v-if="tabs[3].loaded" v-show="currentTab === 3" />

    <!-- Tabbar -->
    <wd-tabbar v-model="currentTab" :items="tabs" @change="handleTabChange" />
  </view>
</template>

<script setup lang="ts">
import NewsTechIndex from './newsTech/components/NewsTechIndex.vue'
import NewsTechNews from './newsTech/components/NewsTechNews.vue'
import NewsTechReview from './newsTech/components/NewsTechReview.vue'
import NewsTechMy from './newsTech/components/NewsTechMy.vue'

import { ref } from 'vue'
import type { WdTabbarItemProps } from '@/wd/components/wd-tabbar-item/wd-tabbar-item.vue'

/** 当前激活的标签页索引 */
const currentTab = ref(0)

const tabs = ref<WdTabbarItemProps[]>([
  { title: '首页', icon: 'home', isDot: false, value: 0, loaded: true },
  { title: '科技', icon: 'mobile', isDot: false, value: 0, loaded: false },
  { title: '评测', icon: 'star', isDot: false, value: 0, loaded: false },
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
