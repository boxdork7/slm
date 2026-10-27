// 首屏加载页配置注入插件：构建期把粒子效果写进 index.html，消除首次刷新的错位
import fs from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'

/**
 * 首屏加载页在 Vue 挂载【之前】显示，读不到 SystemConfig。
 *
 * 早先的做法是 main.ts 把配置写进 localStorage、加载页下次再读 —— 能用，
 * 但改完配置的**第一次刷新**加载页仍是旧值（写入发生在加载页渲染之后），
 * 会出现「加载页 code、登录页 flow」的错位。
 *
 * 本插件在构建期直接把值替换进 HTML 占位符，浏览器拿到的就是最终值：
 *   · 零运行时开销 —— 纯字符串替换，不加脚本、不加请求、不改变解析流程
 *   · 改配置后第一次刷新即同步
 *
 * 🔴 之所以用正则从 systemConfig.ts 抠值、而不是 import 它：
 * 该文件依赖 import.meta.env 与 ElSize 等类型，在 vite 配置阶段（Node 环境）
 * 无法直接执行；抠值是这里唯一不引入构建期副作用的做法。
 */

/** 与 index.html 中的占位符保持一致 */
const PLACEHOLDER = '%LOGIN_PARTICLE%'
const PLACEHOLDER_GRADIENT = '%LOGIN_GRADIENT%'

/** 读不到配置时的兜底值（与 SystemConfig 默认值一致） */
const FALLBACK = 'code'

/** LoginParticle 枚举的合法取值，用于校验抠出来的值 */
const VALID = ['none', 'link', 'cube', 'flow', 'code', 'star']

/**
 * 从 systemConfig.ts 解析 login.particle 的实际取值
 * @param root 项目根目录
 * @returns 粒子效果字符串，解析失败返回兜底值
 */
const resolveParticle = (root: string): string => {
  try {
    const file = path.resolve(root, 'src/systemConfig.ts')
    const source = fs.readFileSync(file, 'utf-8')

    /*
      🔴 必须先切出 SystemConfig 里的 login 段再找 particle。
      直接写 /login:\s*\{[\s\S]*?particle:\s*LoginParticle\.(\w+)/ 会出错 ——
      非贪婪跨行匹配会从更靠前的位置起跳，撞上 LoginParticle 枚举定义里的成员
      （枚举在文件上方，login 配置段在下方），抠出来永远是枚举里的第一个匹配项。
    */
    const seg = source.match(/login:\s*\{([\s\S]*?)\n\s{2}\}/)
    const scope = seg ? seg[1] : ''

    // 1) 引用枚举成员的写法：particle: LoginParticle.Flow
    const ref = scope.match(/particle:\s*LoginParticle\.(\w+)/)
    if (ref) {
      // 2) 到枚举定义里查该成员对应的字符串字面量
      const value = source.match(new RegExp(`\\b${ref[1]}\\s*=\\s*'([^']+)'`))
      if (value && VALID.includes(value[1])) return value[1]
    }

    // 兼容直接写字符串的情况：particle: 'flow'
    const literal = scope.match(/particle:\s*'([^']+)'/)
    if (literal && VALID.includes(literal[1])) return literal[1]
  } catch {
    // 文件不存在或读取失败，走兜底
  }
  return FALLBACK
}

/**
 * 解析 login.gradient 开关
 * @returns 'on' | 'off'，读不到时默认 'on'（与 SystemConfig 默认值一致）
 */
const resolveGradient = (root: string): string => {
  try {
    const source = fs.readFileSync(path.resolve(root, 'src/systemConfig.ts'), 'utf-8')
    const seg = source.match(/login:\s*\{([\s\S]*?)\n\s{2}\}/)
    const scope = seg ? seg[1] : ''
    const m = scope.match(/gradient:\s*(true|false)/)
    if (m) return m[1] === 'true' ? 'on' : 'off'
  } catch {
    // 读取失败按开启处理
  }
  return 'on'
}

export default (): Plugin => {
  let root = process.cwd()

  return {
    name: 'loader-config-inject',
    configResolved(config) {
      root = config.root
    },
    transformIndexHtml: {
      // 在其它 HTML 处理之前替换，避免占位符被别的插件消费
      order: 'pre',
      handler(html: string) {
        return html.replaceAll(PLACEHOLDER, resolveParticle(root)).replaceAll(PLACEHOLDER_GRADIENT, resolveGradient(root))
      }
    }
  }
}
