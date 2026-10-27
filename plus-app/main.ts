// 应用入口
import '@/style/index.scss'
import 'virtual:uno.css'
import { createSSRApp } from 'vue'

import App from './App.vue'
/* Pinia状态管理 */
import store from '@/stores/store'

/* 全局注册 WD UI 组件（绕过 easycom，确保 APP 云打包 / H5 发行 / 小程序 组件均正常渲染） */
const wdModules: Record<string, any> = import.meta.glob('./wd/components/wd-*/wd-*.vue', { eager: true })

export const createApp = () => {
  const app = createSSRApp(App)
  app.use(store)

  /* 注册所有 wd-* 组件为全局组件（全平台兜底，避免 easycom 在发行构建漏扫导致组件不渲染） */
  for (const [path, module] of Object.entries(wdModules)) {
    const match = path.match(/\/(wd-[^/]+)\.vue$/)
    if (match) {
      app.component(match[1], module.default)
    }
  }

  return {
    app,
  }
}
