<!-- 计算器模板 -->
<template>
  <view class="min-h-screen bg-#f9f9f9">
    <ToolCalculatorIndex v-if="tabs[0].loaded" v-show="currentTab === 0" />
    <ToolCalculatorScience v-if="tabs[1].loaded" v-show="currentTab === 1" />
    <ToolCalculatorHistory v-if="tabs[2].loaded" v-show="currentTab === 2" />
    <ToolCalculatorConverter v-if="tabs[3].loaded" v-show="currentTab === 3" />
    <wd-tabbar v-model="currentTab" :items="tabs" @change="handleTabChange" />
  </view>
</template>

<script setup lang="ts">
import ToolCalculatorIndex from './toolCalculator/components/ToolCalculatorIndex.vue'
import ToolCalculatorScience from './toolCalculator/components/ToolCalculatorScience.vue'
import ToolCalculatorHistory from './toolCalculator/components/ToolCalculatorHistory.vue'
import ToolCalculatorConverter from './toolCalculator/components/ToolCalculatorConverter.vue'
import { ref } from 'vue'
import type { WdTabbarItemProps } from '@/wd/components/wd-tabbar-item/wd-tabbar-item.vue'

const currentTab = ref(0)
const tabs = ref<WdTabbarItemProps[]>([
  { title: '计算器', icon: 'tools', isDot: false, value: 0, loaded: true }, // 原来是 'calculator'，改为 'tools'
  { title: '科学', icon: 'data', isDot: false, value: 0, loaded: false }, // 原来是 'formula'，改为 'data'
  { title: '历史', icon: 'history', isDot: false, value: 0, loaded: false }, // 原来是 'time'，改为 'history'
  { title: '转换', icon: 'swap', isDot: false, value: 0, loaded: false }, // 原来是 'exchange'，改为 'swap'
])

const handleTabChange = (index: number) => {
  currentTab.value = index
}
</script>

<style scoped lang="scss"></style>
