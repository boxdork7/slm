<!-- 益智游戏模板 -->
<template>
  <view class="min-h-screen bg-#f9f9f9">
    <GamePuzzleIndex v-if="tabs[0].loaded" v-show="currentTab === 0" />
    <GamePuzzleGame v-if="tabs[1].loaded" v-show="currentTab === 1" />
    <GamePuzzleRank v-if="tabs[2].loaded" v-show="currentTab === 2" />
    <GamePuzzleMy v-if="tabs[3].loaded" v-show="currentTab === 3" />
    <wd-tabbar v-model="currentTab" :items="tabs" @change="handleTabChange" />
  </view>
</template>

<script setup lang="ts">
import GamePuzzleIndex from './gamePuzzle/components/GamePuzzleIndex.vue'
import GamePuzzleGame from './gamePuzzle/components/GamePuzzleGame.vue'
import GamePuzzleRank from './gamePuzzle/components/GamePuzzleRank.vue'
import GamePuzzleMy from './gamePuzzle/components/GamePuzzleMy.vue'
import { ref } from 'vue'
import type { WdTabbarItemProps } from '@/wd/components/wd-tabbar-item/wd-tabbar-item.vue'

const currentTab = ref(0)
const tabs = ref<WdTabbarItemProps[]>([
  { title: '首页', icon: 'home', isDot: false, value: 0, loaded: true },
  { title: '游戏', icon: 'app', isDot: false, value: 0, loaded: false }, // 原来是 'game'，改为 'app'
  { title: '排行', icon: 'trending-up', isDot: false, value: 0, loaded: false }, // 原来是 'trophy'，改为 'trending-up'
  { title: '我的', icon: 'user', isDot: false, value: 0, loaded: false },
])

const handleTabChange = (index: number) => {
  currentTab.value = index
}
</script>

<style scoped lang="scss"></style>
