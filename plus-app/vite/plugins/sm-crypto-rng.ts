// sm-crypto 随机数初始化修补插件
import type { Plugin } from 'vite'

/**
 * 修补 sm-crypto 0.5.x 的 src/sm2/rng.js，让国密在小程序 / APP 上能加载
 *
 * rng.js 在模块加载时初始化随机数池，没有 window.crypto 时（小程序 / APP 逻辑层）会走：
 *   const nodeRequire = (typeof module !== 'undefined' && typeof module.require === 'function') ? module.require.bind(module) : null
 *   const nodeCrypto = nodeRequire ? nodeRequire('crypto') : null
 * 打包后 @rollup/plugin-commonjs 给 module 注入的 require 一调用就抛
 * 「Could not dynamically require "crypto"」，整个 vendor.js 加载失败、小程序白屏；
 * 后面的 globalThis.crypto 分支根本走不到，所以单靠 cryptoPolyfill 补不上。
 *
 * 修补两处：
 * 1. nodeRequire 恒为 null —— 前端产物里不存在 Node 的 crypto 模块
 * 2. 既没有 window.crypto 也没有 globalThis.crypto 时，用 Math.random 填充而不是抛错 ——
 *    小程序里 sm-crypto 打在 vendor.js，可能早于 cryptoPolyfill 执行，不能依赖补丁的加载顺序
 *
 * H5 有 window.crypto，走第一个分支，不受影响。
 * 升级 sm-crypto 后源码对不上时直接让构建失败，避免修补静默失效、到真机才白屏。
 */
const TARGET = /[\\/]sm-crypto[\\/]src[\\/]sm2[\\/]rng\.js$/

const NODE_REQUIRE = /const nodeRequire = \(typeof module !== 'undefined' && typeof module\.require === 'function'\) \? module\.require\.bind\(module\) : null/

const THROW_UNSUPPORTED = /else throw new Error\('当前环境不支持 crypto\.getRandomValues！'\)/

export default (): Plugin => ({
  name: 'sm-crypto-rng',
  // 必须在 commonjs 插件改写 module / require 之前处理源码
  enforce: 'pre',
  transform(code, id) {
    if (!TARGET.test(id.split('?')[0])) {
      return null
    }
    if (!NODE_REQUIRE.test(code) || !THROW_UNSUPPORTED.test(code)) {
      this.error('sm-crypto 的 src/sm2/rng.js 与修补规则不匹配（可能升级了 sm-crypto），请检查 vite/plugins/sm-crypto-rng.ts')
    }
    return {
      code: code
        .replace(NODE_REQUIRE, 'const nodeRequire = null')
        .replace(THROW_UNSUPPORTED, 'else { for (t = 0; t < 32; ++t) ua[t] = Math.floor(Math.random() * 256) }'),
      map: null,
    }
  },
})
