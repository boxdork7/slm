<template>
  <scroll-view class="h-100vh" scroll-y :show-scrollbar="false" @scroll="scroll">
    <!-- 支付宝端：只保留 v-if v-show无效 开发支付宝才打开下面的注释 -->
    <!--    &lt;!&ndash; #ifdef MP-ALIPAY &ndash;&gt; -->
    <!--    <Home v-if="currentTab === 0 && tabs[0].loaded" /> -->
    <!--    <Template v-if="currentTab === 1 && tabs[1].loaded" /> -->
    <!--    <My v-if="currentTab === 2 && tabs[2].loaded" /> -->
    <!--    &lt;!&ndash; #endif &ndash;&gt; -->

    <!-- 非支付宝端：用 v-show 提高性能 -->
    <!-- #ifndef MP-ALIPAY -->
    <Home v-if="tabs[0].loaded" v-show="currentTab === 0" />
    <Templates v-if="tabs[1].loaded" v-show="currentTab === 1" />
    <My v-if="tabs[2].loaded" v-show="currentTab === 2" />
    <!-- #endif -->

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

/**
 * 组件挂载后的初始化处理
 */
onMounted(() => {
  // 根据传入的 tab 参数切换到对应的标签页
  tabbarStore.toTab(props.tab)
})
const { updateScrollTop } = useScroll()

/**
 * 滚动事件处理函数
 * @param e - 滚动事件对象
 */
const scroll = (e) => {
  // 更新全局滚动位置状态，用于其他组件或功能使用
  updateScrollTop(e.detail.scrollTop)
}
</script>

<style lang="scss" scoped></style>
