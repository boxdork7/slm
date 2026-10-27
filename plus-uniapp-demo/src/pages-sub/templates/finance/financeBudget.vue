<!-- 预算管理模板 -->
<template>
  <view class="min-h-screen bg-#f9f9f9">
    <FinanceBudgetIndex v-if="tabs[0].loaded" v-show="currentTab === 0" />
    <FinanceBudgetRecord v-if="tabs[1].loaded" v-show="currentTab === 1" />
    <FinanceBudgetChart v-if="tabs[2].loaded" v-show="currentTab === 2" />
    <FinanceBudgetMy v-if="tabs[3].loaded" v-show="currentTab === 3" />
    <wd-tabbar v-model="currentTab" :items="tabs" @change="handleTabChange" />
  </view>
</template>

<script setup lang="ts">
import FinanceBudgetIndex from './financeBudget/components/FinanceBudgetIndex.vue'
import FinanceBudgetRecord from './financeBudget/components/FinanceBudgetRecord.vue'
import FinanceBudgetChart from './financeBudget/components/FinanceBudgetChart.vue'
import FinanceBudgetMy from './financeBudget/components/FinanceBudgetMy.vue'
import { ref } from 'vue'
import type { WdTabbarItemProps } from '@/wd/components/wd-tabbar-item/wd-tabbar-item.vue'

const currentTab = ref(0)
const tabs = ref<WdTabbarItemProps[]>([
  { title: '首页', icon: 'home', isDot: false, value: 0, loaded: true },
  { title: '记账', icon: 'edit', isDot: false, value: 0, loaded: false },
  { title: '统计', icon: 'chart', isDot: false, value: 0, loaded: false },
  { title: '我的', icon: 'user', isDot: false, value: 0, loaded: false },
])

const handleTabChange = (index: number) => {
  currentTab.value = index
}
</script>

<style scoped lang="scss"></style>
