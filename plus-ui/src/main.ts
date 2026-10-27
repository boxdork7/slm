/**
 * 应用入口文件
 * @description 初始化Vue应用并配置全局插件、样式、路由等
 */
import { createApp } from 'vue'

/**
 * 全局样式导入
 */
// UnoCSS (原子化CSS框架)
import 'virtual:uno.css'
// Element Plus暗黑模式变量
import 'element-plus/theme-chalk/dark/css-vars.css'
// 自定义全局样式
import '@/assets/styles/main.scss'
// 系统图标
import '@/assets/icons/system/iconfont.css'
// 本地静态 SVG sprite 注册（通过 vite-plugin-svg-icons-ng 生成）
// 支持 <Icon code="dingtalk" /> 形式引用 src/assets/icons/svg/*.svg
import 'virtual:svg-icons-register'
/**
 * 核心应用配置
 */
// 根组件
import App from './App.vue'
// Pinia状态管理
import store from '@/stores/store'
// Vue Router路由管理
import router from './router/router'

/**
 * 自定义指令
 * @description 注册v-permission等自定义指令
 */
import directive from '@/directives/directives'

/**
 * 代码高亮配置
 * @description 用于文档、代码展示等场景
 */
// 高亮主题样式 - 深色主题
import 'highlight.js/styles/atom-one-dark.css'
// 高亮核心库
import 'highlight.js/lib/common'
// Vue高亮组件
import HighLight from '@highlightjs/vue-plugin'

// Element Plus图标组件
import ElementIcons from '@/plugins/elementIcons'

/**
 * 国际化配置
 * @description 多语言支持
 */
import i18n from '@/locales/i18n'

import { SystemConfig } from '@/systemConfig'
import { localCache } from '@/utils/cache'

/** 首屏加载页读取粒子配置的缓存键（index.html 内的脚本用同名键取值） */
const LOGIN_PARTICLE_KEY = 'login-particle'

/**
 * Element Plus组件配置
 * @description 修改Element Plus组件的默认行为
 */
// 修改 el-dialog 默认点击遮照为不关闭
import { ElDialog } from 'element-plus'

ElDialog.props.closeOnClickModal.default = false

/**
 * 把认证页粒子配置同步到本地缓存（**仅作兜底**）
 *
 * 正常路径是构建期注入：vite 插件 `loader-config.ts` 会把
 * SystemConfig.login.particle 的值直接替换进 index.html 的占位符，
 * 加载页无需读缓存即可拿到最终值。
 *
 * 这里的写入只在占位符未被替换时才会被用到（例如脱离 vite 直接打开
 * index.html 调试）。留着成本极低，去掉则那种场景会永远回落默认值。
 *
 * 🔴 必须用 localCache 而不是裸 localStorage.setItem：
 * cache.ts 的 autoCleanup 会对所有带应用前缀的键做 JSON.parse，
 * **解析失败即视为损坏缓存删除** —— 裸字符串写进去会在 1 秒后被清掉。
 */
localCache.set(LOGIN_PARTICLE_KEY, SystemConfig.login.particle)

/**
 * 创建Vue应用实例
 */
const app = createApp(App)

/**
 * 注册全局插件和模块
 */
// 代码高亮插件
app.use(HighLight)
// Element图标 插件
app.use(ElementIcons)
// 路由
app.use(router)
// 状态管理
app.use(store)
// 国际化
app.use(i18n)
// 注册自定义指令
directive(app)

/**
 * 挂载应用到DOM
 */
app.mount('#app')
