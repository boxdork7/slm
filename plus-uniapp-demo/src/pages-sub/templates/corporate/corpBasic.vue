<!-- 企业官网模板 -->
<template>
  <view class="min-h-screen bg-#f9f9f9">
    <CorpBasicIndex v-if="tabs[0].loaded" v-show="currentTab === 0" />
    <CorpBasicAbout v-if="tabs[1].loaded" v-show="currentTab === 1" />
    <CorpBasicProduct v-if="tabs[2].loaded" v-show="currentTab === 2" />
    <CorpBasicContact v-if="tabs[3].loaded" v-show="currentTab === 3" />
    <wd-tabbar v-model="currentTab" :items="tabs" @change="handleTabChange" />
  </view>
</template>

<script setup lang="ts">
import CorpBasicIndex from './corpBasic/components/CorpBasicIndex.vue'
import CorpBasicAbout from './corpBasic/components/CorpBasicAbout.vue'
import CorpBasicProduct from './corpBasic/components/CorpBasicProduct.vue'
import CorpBasicContact from './corpBasic/components/CorpBasicContact.vue'
import { ref } from 'vue'
import type { WdTabbarItemProps } from '@/wd/components/wd-tabbar-item/wd-tabbar-item.vue'

const currentTab = ref(0)
const tabs = ref<WdTabbarItemProps[]>([
  { title: '首页', icon: 'home', isDot: false, value: 0, loaded: true },
  { title: '关于', icon: 'info', isDot: false, value: 0, loaded: false },
  { title: '产品', icon: 'shop', isDot: false, value: 0, loaded: false },
  { title: '联系', icon: 'phone', isDot: false, value: 0, loaded: false },
])

const handleTabChange = (index: number) => {
  currentTab.value = index
}
</script>

<style scoped lang="scss"></style>
