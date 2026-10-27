<!-- 首页 -->
<template>
  <scroll-view
    class="h-100vh"
    scroll-y
    :show-scrollbar="false"
    :scroll-top="scrollTopValue"
    @scroll="handleScroll"
  >
    <Home v-if="tabs[0].loaded" v-show="currentTab === 0" />
    <Menu v-if="tabs[1].loaded" v-show="currentTab === 1" />
    <My v-if="tabs[2].loaded" v-show="currentTab === 2" />

    <!-- Tabbar 如果是支付宝需要调整配合使用wd-tabbar-item组件而非items模式 -->
    <wd-tabbar v-model="currentTab" :items="tabs" @change="handleTabChange" />
  </scroll-view>
</template>

<script lang="ts" setup>
/**
 * 组件属性定义
 * @param tab - 初始显示的标签页标识（从路由参数传入）
 */
const props = defineProps<{
  tab?: string
}>()

// 使用 tabbar 状态管理 store
const tabbarStore = useTabbarStore()
const { currentTab, tabs } = storeToRefs(tabbarStore)

/**
 * 处理标签页切换事件
 */
const handleTabChange = (index: number) => {
  tabbarStore.toTab(index)
}

// 使用 useScroll 创建 scroll-view 处理器（自动处理所有滚动逻辑）
const { scrollTopValue, handleScroll } = useScroll().createScrollViewHandler()

/**
 * 组件挂载后的初始化处理
 */
onMounted(() => {
  // 根据传入的 tab 参数切换到对应的标签页
  tabbarStore.toTab(props.tab)
})
</script>

<style lang="scss" scoped></style>
