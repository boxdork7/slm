import Optimization from '@uni-ku/bundle-optimizer'

/**
 * 分包优化、模块异步跨包调用、组件异步跨包引用插件
 *
 * 主要功能：
 * 1. 自动优化代码分割，避免重复打包相同模块
 * 2. 支持不同包之间的异步模块调用
 * 3. 支持跨包异步加载组件，提升首屏加载性能
 * 4. 智能分析依赖关系，优化打包策略
 *
 * @see https://github.com/uni-ku/bundle-optimizer
 */
export default () => {
  return Optimization({
    // 功能开关配置
    enable: {
      optimization: true, // 启用分包优化 - 自动分析和优化代码分割策略
      'async-import': true, // 启用异步导入优化 - 支持动态import()的跨包调用
      'async-component': true, // 启用异步组件优化 - 支持组件的懒加载和跨包引用
    },

    // TypeScript 类型定义配置
    dts: {
      base: 'src/types', // 类型定义文件的基础路径，用于处理跨包类型引用
    },

    // 调试配置
    logger: false, // 关闭构建过程中的日志输出，减少控制台噪音
  })
}
