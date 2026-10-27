<template>
  <view class="min-h-screen bg-#f9f9f9">
    <LifeDeliveryIndex v-if="tabs[0].loaded" v-show="currentTab === 0" />
    <LifeDeliveryMenu v-if="tabs[1].loaded" v-show="currentTab === 1" />
    <LifeDeliveryMy v-if="tabs[2].loaded" v-show="currentTab === 2" />

    <!-- Tabbar 如果是支付宝需要调整配合使用wd-tabbar-item组件而非items模式 -->
    <wd-tabbar v-model="currentTab" :items="tabs" @change="handleTabChange" />
  </view>
</template>

<script setup lang="ts">
import LifeDeliveryIndex from './lifeDelivery/components/LifeDeliveryIndex.vue'
import LifeDeliveryMenu from './lifeDelivery/components/LifeDeliveryMenu.vue'
import LifeDeliveryMy from './lifeDelivery/components/LifeDeliveryMy.vue'

import { ref } from 'vue'
import type { WdTabbarItemProps } from '@/wd/components/wd-tabbar-item/wd-tabbar-item.vue'

/** 当前激活的标签页索引 */
const currentTab = ref(0)

const tabs = ref<WdTabbarItemProps[]>([
  { title: '首页', icon: 'home', isDot: false, value: 0, loaded: true },
  { title: '菜单', icon: 'shop', isDot: false, value: 0, loaded: false },
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
