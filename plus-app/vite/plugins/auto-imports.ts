// 自动导入插件
import AutoImport from 'unplugin-auto-import/vite'
import path from 'node:path'

/**
 * 自动导入插件配置
 * 自动导入 Vue、UniApp 等常用函数和工具
 */
export default () => {
  return AutoImport({
    imports: ['vue', 'uni-app', 'pinia'],
    dirs: ['composables', 'stores/modules'], // 自动导入组合函数 和 状态管理模块
    // ESLint 自动导入配置
    eslintrc: {
      // 启用 ESLint 自动生成配置
      enabled: true,
      // ESLint 配置文件路径
      filepath: path.resolve(__dirname, '../../eslintrc-auto-import.json'),
      // 全局属性值
      globalsPropValue: true,
    },
    // 是否在 vue 模板中自动导入
    vueTemplate: true,
    // 类型声明文件路径
    dts: 'types/auto-imports.d.ts',
  })
}
