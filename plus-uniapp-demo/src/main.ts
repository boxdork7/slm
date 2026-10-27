import '@/static/style/index.scss'
import 'uno.css'
import { createSSRApp } from 'vue'

import App from './App.vue'
// Pinia状态管理
import store from '@/stores/store'

export const createApp = () => {
  const app = createSSRApp(App)
  app.use(store)

  return {
    app,
  }
}
