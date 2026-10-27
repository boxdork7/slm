<!-- 在线学堂模板 -->
<template>
  <view class="min-h-screen bg-#f9f9f9">
    <EduOnlineIndex v-if="tabs[0].loaded" v-show="currentTab === 0" />
    <EduOnlineCourse v-if="tabs[1].loaded" v-show="currentTab === 1" />
    <EduOnlineStudy v-if="tabs[2].loaded" v-show="currentTab === 2" />
    <EduOnlineMy v-if="tabs[3].loaded" v-show="currentTab === 3" />
    <wd-tabbar v-model="currentTab" :items="tabs" @change="handleTabChange" />
  </view>
</template>

<script setup lang="ts">
import EduOnlineIndex from './eduOnline/components/EduOnlineIndex.vue'
import EduOnlineCourse from './eduOnline/components/EduOnlineCourse.vue'
import EduOnlineStudy from './eduOnline/components/EduOnlineStudy.vue'
import EduOnlineMy from './eduOnline/components/EduOnlineMy.vue'
import { ref } from 'vue'
import type { WdTabbarItemProps } from '@/wd/components/wd-tabbar-item/wd-tabbar-item.vue'

const currentTab = ref(0)
const tabs = ref<WdTabbarItemProps[]>([
  { title: '首页', icon: 'home', isDot: false, value: 0, loaded: true },
  { title: '课程', icon: 'book', isDot: false, value: 0, loaded: false },
  { title: '学习', icon: 'edit', isDot: false, value: 0, loaded: false },
  { title: '我的', icon: 'user', isDot: false, value: 0, loaded: false },
])

const handleTabChange = (index: number) => {
  currentTab.value = index
}
</script>

<style scoped lang="scss"></style>
