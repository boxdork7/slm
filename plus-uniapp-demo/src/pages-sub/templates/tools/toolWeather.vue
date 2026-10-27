<!-- 天气模板 -->
<template>
  <view class="min-h-screen bg-#f9f9f9">
    <ToolWeatherIndex v-if="tabs[0].loaded" v-show="currentTab === 0" />
    <ToolWeatherForecast v-if="tabs[1].loaded" v-show="currentTab === 1" />
    <ToolWeatherMap v-if="tabs[2].loaded" v-show="currentTab === 2" />
    <ToolWeatherSetting v-if="tabs[3].loaded" v-show="currentTab === 3" />

    <!-- Tabbar -->
    <wd-tabbar v-model="currentTab" :items="tabs" @change="handleTabChange" />
  </view>
</template>

<script setup lang="ts">
import ToolWeatherIndex from './toolWeather/components/ToolWeatherIndex.vue'
import ToolWeatherForecast from './toolWeather/components/ToolWeatherForecast.vue'
import ToolWeatherMap from './toolWeather/components/ToolWeatherMap.vue'
import ToolWeatherSetting from './toolWeather/components/ToolWeatherSetting.vue'

import { ref } from 'vue'
import type { WdTabbarItemProps } from '@/wd/components/wd-tabbar-item/wd-tabbar-item.vue'

/** 当前激活的标签页索引 */
const currentTab = ref(0)

const tabs = ref<WdTabbarItemProps[]>([
  { title: '天气', icon: 'cloud', isDot: false, value: 0, loaded: true }, // 原来是 'sun'，改为 'cloud'
  { title: '预报', icon: 'calendar', isDot: false, value: 0, loaded: false },
  { title: '天气图', icon: 'map', isDot: false, value: 0, loaded: false },
  { title: '设置', icon: 'setting', isDot: false, value: 0, loaded: false },
])

/**
 * 处理标签页切换事件
 */
const handleTabChange = (index: number) => {
  currentTab.value = index
}
</script>

<style scoped lang="scss"></style>
