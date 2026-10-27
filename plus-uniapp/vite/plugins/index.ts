import process from 'node:process'
// 有配置的插件单独抽离
import createUniPages from './uni-pages'
import createAutoImport from './auto-imports'
import createComponents from './components'
import createOptimization from './optimization'
import createViteRestart from './vite-restart'
import createStaticAssetsTypes from './static-assets-types'
import createOpenApiPlugin from './openapi'
import createSmCryptoRng from './sm-crypto-rng'
// 无配置或简单配置的插件直接导入
import Uni from '@dcloudio/vite-plugin-uni'
import UniLayouts from '@uni-helper/vite-plugin-uni-layouts'
import UniPlatform from '@uni-helper/vite-plugin-uni-platform'
import UniManifest from '@uni-helper/vite-plugin-uni-manifest'
import { getCurrentTime } from '../../src/utils/date'
// import copyNativeRes from './copyNativeRes'

/** 导出 Vite 插件配置函数 */
// 根据环境和构建状态动态加载和配置插件
export default async ({
  command,
  mode,
  env,
}: {
  command: string
  mode: string
  env: Record<string, string>
}) => {
  // 存储所有 Vite 插件的数组
  const vitePlugins: any[] = []

  const { UNI_PLATFORM } = process.env
  const { VITE_APP_BASE_API, VITE_APP_BASE_API_PORT, VITE_DELETE_CONSOLE, VITE_SHOW_SOURCEMAP } =
    env

  // 静态资源类型生成插件（需要在早期运行）
  vitePlugins.push(
    createStaticAssetsTypes({
      enabled: true,
    }),
  )

  // OpenAPI 代码生成插件（可选，需手动配置启用）
  const apiPort = VITE_APP_BASE_API_PORT || '5500'
  vitePlugins.push(
    createOpenApiPlugin({
      input: `http://127.0.0.1:${apiPort}/v3/api-docs/business`,
      output: 'src/api', // 输出到 src/api 目录
      mode: 'manual', // 'manual' | 'once' - 手动触发生成 (访问 http://localhost:端口/__openapi_generate)
      enabled: true, // 启用插件
      ignore: {
        // 忽略 比如 chat 模块 (最后一层目录)
        modules: ['chat'],
        // 忽略 system 模块的所有文件
        files: ['system*', 'tableDictTypes*'],
        // 忽略所有以 template 开头的接口
        functions: ['template*', 'import*', 'export*'],
      },
    }),
  )

  // 修补 sm-crypto 随机数初始化，否则开启国密后小程序 / APP 加载 vendor.js 即报错白屏
  vitePlugins.push(createSmCryptoRng())

  // UniApp 相关插件配置
  vitePlugins.push(createUniPages(mode))
  vitePlugins.push(UniLayouts())
  vitePlugins.push(UniPlatform())
  vitePlugins.push(UniManifest())

  // 临时修复 Vue 插件的 BUG
  vitePlugins.push({
    name: 'fix-vite-plugin-vue',
    configResolved(config: any) {
      const plugin = config.plugins.find((p: any) => p.name === 'vite:vue')
      if (plugin && plugin.api && plugin.api.options) {
        plugin.api.options.devToolsEnabled = false
      }
    },
  })

  // UnoCSS 原子化 CSS 引擎
  const UnoCSS = (await import('unocss/vite')).default
  vitePlugins.push(UnoCSS())

  // 自动导入相关插件
  vitePlugins.push(createAutoImport())
  vitePlugins.push(createComponents())

  // 分包优化插件（需要在 UniPages 之后）
  vitePlugins.push(createOptimization())

  // 开发工具插件
  vitePlugins.push(createViteRestart())

  // 平台特定插件
  // H5 环境增加构建时间
  if (UNI_PLATFORM === 'h5') {
    vitePlugins.push({
      name: 'html-transform',
      transformIndexHtml(html: string) {
        return html.replace('%BUILD_TIME%', getCurrentTime)
      },
    })
  }

  // App 平台资源复制（按需启用）
  // if (UNI_PLATFORM === 'app') {
  //   vitePlugins.push(copyNativeRes())
  // }

  // Uni 插件必须放在最后
  vitePlugins.push(Uni())

  // 过滤掉空值
  return vitePlugins.filter(Boolean)
}
