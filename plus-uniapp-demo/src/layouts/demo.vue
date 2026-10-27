<template>
  <wd-config-provider :theme-vars="themeVars">
    <!--  内容插槽  -->
    <slot />
    <!--  轻提示组件  -->
    <wd-toast />
    <!--  消息通知   -->
    <wd-notify />
    <!--  消息确认弹窗   -->
    <wd-message-box />
    <!--  到顶部  -->
    <wd-backtop :scroll-top="scrollTop" />
  </wd-config-provider>
</template>

<script lang="ts" setup>
const { themeVars } = useTheme({
  // 需要覆盖的主题变量
})

const { scrollTop } = useScroll()
</script>
