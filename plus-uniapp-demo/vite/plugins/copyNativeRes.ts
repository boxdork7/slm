import path from 'node:path'
import fs from 'fs-extra'
import process from 'node:process'

/**
 * 复制原生资源文件插件
 *
 * 作用：在构建完成后，将 src/nativeResources 目录下的原生资源文件
 *      复制到对应的构建输出目录中
 *
 * 使用场景：
 * - uni-app 项目中需要包含原生插件资源
 * - 需要复制静态资源到特定平台的构建目录
 * - 确保原生代码、配置文件等在构建后正确放置
 *
 * 构建路径规则：
 * - 开发环境：dist/dev/{平台}/nativeResources/
 * - 生产环境：dist/build/{平台}/nativeResources/
 *
 * @returns Vite/Rollup 插件对象
 */
export default () => {
  // 源目录：项目根目录下的 src/nativeResources
  const waitPath = path.resolve(__dirname, '../src/nativeResources')

  // 目标目录：根据环境和平台动态构建路径
  // 格式：dist/{build|dev}/{平台}/nativeResources
  const buildPath = path.resolve(
    __dirname,
    '../dist',
    process.env.VITE_APP_ENV === 'production' ? 'build' : 'dev', // 环境目录
    process.env.UNI_PLATFORM!, // uni-app 平台标识（如：mp-weixin, app-plus 等）
    'nativeResources',
  )

  return {
    // 插件执行时机：在所有其他插件执行完毕后运行
    enforce: 'post' as const,

    /**
     * writeBundle 钩子：在构建完成，文件写入磁盘后执行
     * 这是复制资源文件的最佳时机，确保不会被其他插件覆盖
     */
    async writeBundle() {
      try {
        // 1. 检查源目录是否存在
        const sourceExists = await fs.pathExists(waitPath)
        if (!sourceExists) {
          console.warn(`[copyNativeRes] 警告：源目录 "${waitPath}" 不存在，跳过复制操作。`)
          return
        }

        // 2. 确保目标目录及其父级目录存在
        await fs.ensureDir(buildPath)
        console.log(`[copyNativeRes] 确保目标目录存在：${buildPath}`)

        // 3. 执行递归复制操作（包含子目录和文件）
        await fs.copy(waitPath, buildPath)
        console.log(
          `[copyNativeRes] 成功将 nativeResources 目录中的资源移动到构建目录：${buildPath}`,
        )
      } catch (error) {
        // 4. 错误处理：记录详细错误信息但不中断构建流程
        console.error(`[copyNativeRes] 复制资源失败：`, error)
      }
    },
  }
}
