// sm-crypto 入口（先补随机数再加载）
/* eslint-disable perfectionist/sort-imports -- 补丁必须先于 sm-crypto 执行，自动排序会把副作用导入挪到它后面 */
import './cryptoPolyfill'
// sm-crypto 是 CommonJS 包，用默认导入再解构：具名导入依赖打包器的 CJS 静态分析，跨平台构建不可靠
import smCrypto from 'sm-crypto'

export const { sm2, sm4 } = smCrypto
