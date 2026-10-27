<!-- 应用根组件 -->
<script setup lang="ts">
import { initializeApp } from '@/composables/useAppInit'
import { webSocket } from '@/composables/useWebSocket'
import { useFeatureStore } from '@/stores/modules/feature'

// 标识是否是首次启动（避免onShow重复处理）
let isFirstLaunch = true

const featureStore = useFeatureStore()
/**
 * 应用启动生命周期
 *
 * 执行流程：
 * 1. 根据平台判断是否需要租户ID初始化
 * 2. 根据平台判断是否需要自动登录（小程序静默登录、微信H5授权登录等）
 * 3. 初始化完成后，所有后续的HTTP请求都能正确携带租户ID
 * 4. 如果租户ID初始化失败，会阻止应用正常启动
 * 5. 如果自动登录失败，应用仍可正常启动，用户可手动登录
 * 6. 用户登录成功后会自动初始化WebSocket连接
 */
onLaunch(async () => {
  // 先初始化系统功能配置（WebSocket需要依赖此配置）
  await featureStore.initFeatures()
  // 开始应用初始化（主要是获取租户ID、自动登录、初始化WebSocket）
  await initializeApp()
})

/**
 * 应用显示生命周期
 *
 * 当应用从后台进入前台时触发
 * 处理WebSocket重连和其他恢复逻辑
 */
onShow(() => {
  console.log('👁️  应用显示 - App Show')
  // 如果是首次启动，跳过处理（因为onLaunch已经处理过了）
  if (isFirstLaunch) {
    console.log('ℹ️  首次启动，跳过onShow中的WebSocket处理')
    isFirstLaunch = false
    return
  }
  // 重新初始化并连接WebSocket
  if (webSocket.initialize()) {
    webSocket.connect()
  }
})

/**
 * 应用隐藏生命周期
 *
 * 当应用从前台进入后台时触发
 * 处理WebSocket断开和其他清理逻辑
 */
onHide(() => {
  console.log('🙈 应用隐藏 - App Hide')

  // 可以在此添加其他后台逻辑
  // 例如：保存状态、清理定时器、暂停不必要的任务等
})

/**
 * 应用错误处理
 *
 * 捕获应用级别的错误
 */
onError((error) => {
  console.error('💥 应用发生错误:', error)

  // 可以在此进行错误上报或其他错误处理
  // 例如：错误上报、用户提示等
})

/**
 * 页面未找到处理
 *
 * 当页面路由不存在时触发
 */
onPageNotFound((res) => {
  console.warn('🔍 页面未找到:', res)

  // 重定向到首页或错误页面
  uni.navigateTo({
    url: '/pages/index/index',
  })
})
</script>

<style lang="scss">
// 确保页面根容器不溢出
page {
  width: 100%;
  overflow-x: hidden;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  // 再次确保隐藏滚动条
  &::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
  }
}

button::after {
  border: none;
}

swiper,
scroll-view {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

image {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}

// 单行省略，优先使用 unocss: text-ellipsis
.lines1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 两行省略
.lines2 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

// 三行省略
.lines3 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
