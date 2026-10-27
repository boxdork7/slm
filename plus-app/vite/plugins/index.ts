// Vite插件配置
import process from 'node:process'
// 有配置的插件单独抽离
import createUniPages from './uni-pages'
import createAutoImport from './auto-imports'
import createComponents from './components'
import createStaticAssetsTypes from './static-assets-types'
import createSmCryptoRng from './sm-crypto-rng'

// 无配置或简单配置的插件直接导入
import Uni from '@dcloudio/vite-plugin-uni'
import UniLayouts from '@uni-helper/vite-plugin-uni-layouts'
import UniPlatform from '@uni-helper/vite-plugin-uni-platform'

import path from 'node:path'

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
  const { VITE_APP_BASE_API, VITE_DELETE_CONSOLE, VITE_SHOW_SOURCEMAP } = env

  // 静态资源类型生成插件（需要在早期运行）
  vitePlugins.push(
    createStaticAssetsTypes({
      enabled: true,
    }),
  )

  // 修补 sm-crypto 随机数初始化，否则开启国密后 APP / 小程序加载 vendor.js 即报错白屏
  vitePlugins.push(createSmCryptoRng())

  // UniApp 相关插件配置
  vitePlugins.push(createUniPages(mode))
  vitePlugins.push(
    UniLayouts({
      layoutDir: path.resolve(__dirname, '../../layouts'),
      cwd: path.resolve(__dirname, '../../'),
      layout: 'default',
    }),
  )
  vitePlugins.push(UniPlatform())

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

  vitePlugins.push(createAutoImport())
  vitePlugins.push(createComponents())
  // Uni 插件必须放在最后
  vitePlugins.push(Uni())

  // 过滤掉空值
  return vitePlugins.filter(Boolean)
}
