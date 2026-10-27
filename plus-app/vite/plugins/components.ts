// 组件注册插件
import Components from '@uni-helper/vite-plugin-uni-components'
import path from 'node:path'

/**
 * 组件自动导入插件配置
 * 自动导入组件，无需手动注册
 */
export default () => {
  return Components({
    extensions: ['vue'],
    dirs: [path.resolve(__dirname, '../../components')], // 要自动导入的组件目录
    deep: true, // 是否递归扫描子目录
    directoryAsNamespace: false, // 是否把目录名作为命名空间前缀，true 时组件名为 目录名+组件名
    dts: 'types/components.d.ts', // 自动生成的组件类型声明文件路径（用于 TypeScript 支持）
  })
}
