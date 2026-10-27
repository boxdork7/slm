<!-- 应用根组件 -->
<script setup lang="ts">
import { initializeApp } from '@/composables/useAppInit'
import { webSocket } from '@/composables/useWebSocket'
import { useMessage, useToast } from '@/wd'
import { isMp, isApp } from '@/utils/platform'
import { useFeatureStore } from '@/stores/modules/feature'

// 标识是否是首次启动（避免onShow重复处理）
let isFirstLaunch = true

const message = useMessage()
const toast = useToast()
const featureStore = useFeatureStore()

/**
 * 小程序更新检查 - uni-app 统一 API
 */
const checkMiniProgramUpdate = () => {
  if (!uni.canIUse('getUpdateManager')) {
    console.warn('当前小程序版本过低，不支持自动更新功能')
    return
  }

  const updateManager = uni.getUpdateManager()

  // 检查更新
  updateManager.onCheckForUpdate((res) => {
    console.log('小程序检查更新->', res)

    if (res.hasUpdate) {
      console.log('发现新版本')
      toast.info('检测到新版本，正在下载...')

      // 新版本下载完成
      updateManager.onUpdateReady(() => {
        message
          .confirm({
            title: '更新提示',
            msg: '新版本已经准备好，是否立即重启应用以获得更好的体验？',
            confirmButtonText: '立即重启',
            cancelButtonText: '稍后再说',
          })
          .then((result) => {
            console.log('用户操作结果->', result)

            if (result.action === 'confirm') {
              toast.loading('正在重启应用...')
              setTimeout(() => {
                updateManager.applyUpdate()
              }, 500)
            } else {
              toast.warning('建议及时更新以获得最佳体验')
            }
          })
          .catch((error) => {
            console.error('更新确认弹窗出错:', error)
          })
      })

      // 新版本下载失败
      updateManager.onUpdateFailed(() => {
        console.error('新版本下载失败')

        message
          .alert({
            title: '更新失败',
            msg: '新版本下载失败，请检查网络连接后重试。或删除当前小程序，重新搜索打开获取最新版本。',
            confirmButtonText: '知道了',
          })
          .then(() => {
            console.log('用户已知晓更新失败')
          })
          .catch((error) => {
            console.error('更新失败提示弹窗出错:', error)
          })
      })
    } else {
      console.log('当前已是最新版本')
    }
  })
}

/**
 * APP 更新检查 - 预留接口
 * TODO: 根据实际需求实现 APP 更新逻辑
 */
const checkAppUpdate = () => {
  console.log('APP 更新检查 - 待实现')

  // 预留实现框架
  // 1. 获取当前版本号
  // 2. 调用后端API检查是否有新版本
  // 3. 如果有新版本，提示用户下载
  // 4. 下载完成后安装更新

  // 示例：
  // const systemInfo = uni.getSystemInfoSync()
  // const currentVersion = systemInfo.appVersion || '1.0.0'
  // console.log('当前 APP 版本:', currentVersion)

  // toast.info('正在检查更新...')

  // 模拟检查结果
  setTimeout(() => {
    console.log('APP 更新检查完成 - 当前已是最新版本')
    // toast.success('当前已是最新版本')
  }, 1000)
}

/**
 * 检查应用更新
 */
const checkUpdate = () => {
  if (isMp) {
    checkMiniProgramUpdate()
  } else if (isApp) {
    checkAppUpdate()
  } else {
    console.log('当前平台不支持自动更新检查')
  }
}

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
  // 初始化完成后检查更新
  checkUpdate()
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

// 为常用的容器元素设置 border-box
view,
text,
button,
input,
textarea,
image,
swiper,
scroll-view,
navigator,
picker,
slider,
switch,
video,
audio,
map,
canvas,
web-view {
  box-sizing: border-box;
}

// 伪元素也需要设置
view::before,
view::after,
button::before,
button::after {
  box-sizing: border-box;
}

// 你现有的其他样式...
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
