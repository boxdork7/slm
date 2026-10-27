import ViteRestart from 'vite-plugin-restart'

/**
 * Vite 重启插件
 * 修改配置文件时自动重启
 */
export default () => {
  return ViteRestart({
    // 通过这个插件，在修改vite.config.js文件则不需要重新运行也生效配置
    restart: ['vite.config.js'],
  })
}
