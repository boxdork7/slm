// 为无 WebCrypto 的平台补 crypto.getRandomValues
/**
 * sm-crypto 0.5.x 在模块加载时就调用 crypto.getRandomValues 初始化随机数池，
 * 找不到会直接抛错「当前环境不支持 crypto.getRandomValues！」，导致整个 HTTP 模块加载失败。
 *
 * 平台情况：
 * - H5：浏览器自带 window.crypto，本补丁不生效
 * - 微信小程序 / APP 逻辑层：没有同步的密码学随机数接口（wx.getRandomValues 是异步的），
 *   只能退回 Math.random。强度与现有 jsencrypt 在这些平台上的退化行为相同；
 *   对随机数质量有硬性要求的项目，应在小程序端关闭接口加密并依赖 HTTPS
 *
 * 只在缺失时补，不覆盖平台原生实现。
 *
 * ⚠️ 单靠本补丁不够：小程序 / APP 打包后 sm-crypto 在 vendor.js，可能早于本文件执行；
 * 且 rng.js 会先尝试 module.require('crypto')，被 rollup commonjs 拦下直接抛错。
 * 真正保证加载的是构建插件 vite/plugins/sm-crypto-rng.ts，本补丁保留作 globalThis.crypto 的兜底。
 */
const globalObj = globalThis as any

if (!globalObj.crypto?.getRandomValues) {
  const getRandomValues = <T extends ArrayBufferView>(array: T): T => {
    const bytes = new Uint8Array(array.buffer, array.byteOffset, array.byteLength)
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256)
    }
    return array
  }

  if (globalObj.crypto) {
    globalObj.crypto.getRandomValues = getRandomValues
  }
  else {
    globalObj.crypto = { getRandomValues }
  }
}

export {}
