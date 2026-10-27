<template>
  <view class="min-h-screen bg-#f9f9f9">
    <EduExamIndex v-if="tabs[0].loaded" v-show="currentTab === 0" />
    <EduExamBank v-if="tabs[1].loaded" v-show="currentTab === 1" />
    <EduExamPractice v-if="tabs[2].loaded" v-show="currentTab === 2" />
    <EduExamMy v-if="tabs[3].loaded" v-show="currentTab === 3" />

    <!-- Tabbar -->
    <wd-tabbar v-model="currentTab" :items="tabs" @change="handleTabChange" />
  </view>
</template>

<script setup lang="ts">
import EduExamIndex from './eduExam/components/EduExamIndex.vue'
import EduExamBank from './eduExam/components/EduExamBank.vue'
import EduExamPractice from './eduExam/components/EduExamPractice.vue'
import EduExamMy from './eduExam/components/EduExamMy.vue'

import { ref } from 'vue'
import type { WdTabbarItemProps } from '@/wd/components/wd-tabbar-item/wd-tabbar-item.vue'

/** 当前激活的标签页索引 */
const currentTab = ref(0)

const tabs = ref<WdTabbarItemProps[]>([
  { title: '首页', icon: 'home', isDot: false, value: 0, loaded: true },
  { title: '题库', icon: 'book', isDot: false, value: 0, loaded: false },
  { title: '练习', icon: 'edit', isDot: false, value: 0, loaded: false },
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
