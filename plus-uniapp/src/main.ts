// 应用入口
import '@/static/style/index.scss'
import 'uno.css'
import { createSSRApp } from 'vue'

import App from './App.vue'
// Pinia状态管理
import store from '@/stores/store'
// 开发环境日志收集器
import { logger } from '@/utils/logger'

export const createApp = () => {
  const app = createSSRApp(App)
  app.use(store)

  // 初始化日志收集器(自动判断开发环境)
  logger.init()

  return {
    app,
  }
}
