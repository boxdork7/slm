/**
 * OpenAPI 代码生成插件
 * 从 OpenAPI 文档自动生成符合项目风格的 TypeScript 类型和 API 函数
 */

import type { Plugin } from 'vite'
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { resolve, join, dirname } from 'node:path'
import { createHash } from 'node:crypto'
import https from 'node:https'
import http from 'node:http'

import type { OpenApiDocument } from './parser'
import { extractTypes, generateTypesFile } from './typeGenerator'
import { extractApis, generateApiFile, collectUsedTypes } from './apiGenerator'

export interface OpenApiPluginOptions {
  /** OpenAPI 文档 URL（如：http://127.0.0.1:5500/v3/api-docs/business） */
  input: string
  /** 输出目录，相对于项目根目录（如：src/api） */
  output: string
  /** 生成模式：manual-手动触发，once-启动时生成一次 */
  mode?: 'manual' | 'once'
  /** 是否启用插件 */
  enabled?: boolean
  /** 生成前钩子函数 */
  beforeGenerate?: () => void | Promise<void>
  /** 生成后钩子函数 */
  afterGenerate?: () => void | Promise<void>
  /** 忽略配置 */
  ignore?: {
    /** 忽略的 API 路径（支持通配符）如: ['/base/ad/**', '/common/mall/**'] */
    paths?: string[]
    /** 忽略的模块名（精确匹配）如: ['ad', 'order'] */
    modules?: string[]
    /** 忽略的文件名（支持通配符）如: ['system*', '*Api.ts', 'test*'] */
    files?: string[]
    /** 忽略的接口函数名（支持通配符）如: ['template*', '*Test', 'debug*'] */
    functions?: string[]
    /** 自定义过滤函数 */
    filter?: (moduleKey: string, apis: any[]) => boolean
  }
}

/**
 * 路径匹配工具（支持通配符）
 * @param pattern 匹配模式，如 '/base/ad/**'
 * @param path 实际路径，如 '/base/ad/pageAds'
 */
function matchPath(pattern: string, path: string): boolean {
  // 转换通配符为正则表达式
  // '/base/ad/**' -> /^\/base\/ad\/.*/
  // '/base/ad/*' -> /^\/base\/ad\/[^/]+$/
  const regexPattern = pattern
    .replace(/\//g, '\\/') // 转义斜杠
    .replace(/\*\*/g, '__DOUBLE_STAR__') // 先用占位符保护 **，避免被后续 * 替换影响
    .replace(/\*/g, '[^/]+') // * 匹配除斜杠外的任意字符
    .replace(/__DOUBLE_STAR__/g, '.*') // 最后将占位符还原为 .*

  const regex = new RegExp(`^${regexPattern}$`)
  return regex.test(path)
}

/**
 * 文件名匹配工具（支持通配符）
 * @param pattern 匹配模式，如 'system*', '*Api.ts', 'test*'
 * @param fileName 实际文件名，如 'systemApi.ts'
 */
function matchFileName(pattern: string, fileName: string): boolean {
  // 转换通配符为正则表达式
  // 'system*' -> /^system.*/
  // '*Api.ts' -> /^.*Api\.ts$/
  // 'test*Types.ts' -> /^test.*Types\.ts$/
  const regexPattern = pattern
    .replace(/\./g, '\\.') // 转义点号
    .replace(/\*/g, '.*') // * 匹配任意字符

  const regex = new RegExp(`^${regexPattern}$`)
  return regex.test(fileName)
}

/**
 * 接口函数名匹配工具（支持通配符）
 * @param pattern 匹配模式，如 'template*', '*Test', 'debug*'
 * @param functionName 实际函数名，如 'templateAdd', 'getUserTest'
 */
function matchFunctionName(pattern: string, functionName: string): boolean {
  // 转换通配符为正则表达式
  // 'template*' -> /^template.*/
  // '*Test' -> /^.*Test$/
  // 'debug*Api' -> /^debug.*Api$/
  const regexPattern = pattern.replace(/\*/g, '.*') // * 匹配任意字符

  const regex = new RegExp(`^${regexPattern}$`, 'i') // 忽略大小写
  return regex.test(functionName)
}

/**
 * 检查模块是否应该被忽略
 * @param moduleKey 模块标识（如：base/ad, common/mall/order）
 * @param apis API 列表
 * @param ignoreConfig 忽略配置
 */
function shouldIgnoreModule(
  moduleKey: string,
  apis: any[],
  ignoreConfig?: OpenApiPluginOptions['ignore']
): boolean {
  if (!ignoreConfig) return false

  // 1. 检查模块名精确匹配
  if (ignoreConfig.modules) {
    const moduleName = moduleKey.split('/').pop() // base/ad -> ad
    if (moduleName && ignoreConfig.modules.includes(moduleName)) {
      return true
    }
  }

  // 2. 检查路径匹配（通配符）
  if (ignoreConfig.paths && apis.length > 0) {
    // 检查该模块下的任意一个 API 是否匹配忽略路径
    const hasMatchingPath = apis.some((api) => {
      return ignoreConfig.paths!.some((pattern) => matchPath(pattern, api.path))
    })
    if (hasMatchingPath) {
      return true
    }
  }

  // 3. 自定义过滤函数
  if (ignoreConfig.filter) {
    return ignoreConfig.filter(moduleKey, apis)
  }

  return false
}

/**
 * 获取 OpenAPI 文档
 */
async function fetchOpenApiDoc(url: string): Promise<OpenApiDocument> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http

    client
      .get(url, (res) => {
        let data = ''

        res.on('data', (chunk) => {
          data += chunk
        })

        res.on('end', () => {
          try {
            const doc = JSON.parse(data) as OpenApiDocument
            resolve(doc)
          } catch (error) {
            reject(new Error(`解析 OpenAPI 文档失败: ${error}`))
          }
        })
      })
      .on('error', (error) => {
        reject(new Error(`获取 OpenAPI 文档失败: ${error.message}`))
      })
  })
}

/**
 * 确保目录存在
 */
function ensureDir(dir: string): void {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
}

/**
 * 写入文件
 */
function writeFile(filePath: string, content: string): void {
  ensureDir(dirname(filePath))
  writeFileSync(filePath, content, 'utf-8')
}

/**
 * 计算文件内容的MD5哈希值
 */
function getFileHash(filePath: string): string {
  if (!existsSync(filePath)) return ''
  try {
    const content = readFileSync(filePath, 'utf-8')
    // 标准化内容:去除前后空白,统一换行符
    const normalized = content.trim().replace(/\r\n/g, '\n')
    return createHash('md5').update(normalized, 'utf-8').digest('hex')
  } catch {
    return ''
  }
}

/**
 * 计算字符串内容的MD5哈希值
 */
function getContentHash(content: string): string {
  // 标准化内容:去除前后空白,统一换行符
  const normalized = content.trim().replace(/\r\n/g, '\n')
  return createHash('md5').update(normalized, 'utf-8').digest('hex')
}

/**
 * 决定文件写入策略
 * @returns { path: 文件路径, shouldWrite: 是否应该写入 }
 */
function decideWriteStrategy(basePath: string, fileName: string, newContent: string): { path: string; shouldWrite: boolean; reason: string } {
  const normalPath = `${basePath}/${fileName}`
  const generatedPath = `${basePath}/${fileName.replace(/\.(ts)$/, '.generated.$1')}`

  // 情况1: 原文件不存在 → 直接生成原文件
  if (!existsSync(normalPath)) {
    return { path: normalPath, shouldWrite: true, reason: '文件不存在，创建新文件' }
  }

  // 情况2: 原文件存在 → 比较内容哈希
  const existingHash = getFileHash(normalPath)
  const newHash = getContentHash(newContent)

  // 内容完全相同 → 跳过生成
  if (existingHash === newHash) {
    return { path: generatedPath, shouldWrite: false, reason: '文件内容相同，跳过生成' }
  }

  // 内容不同 → 已修改，生成 .generated.ts
  return { path: generatedPath, shouldWrite: true, reason: '文件内容已变更，生成 .generated.ts' }
}

/**
 * 生成代码
 * @param doc OpenAPI 文档对象
 * @param outputDir 输出目录（相对路径）
 * @param projectRoot 项目根目录（绝对路径）
 * @param ignoreConfig 忽略配置
 */
async function generateCode(doc: OpenApiDocument, outputDir: string, projectRoot: string, ignoreConfig?: OpenApiPluginOptions['ignore']): Promise<void> {
  const outputPath = resolve(projectRoot, outputDir)

  console.log('📦 开始解析 OpenAPI 文档...')

  // 1. 提取所有类型定义（Bo、Vo、Query等）
  const allTypes = extractTypes(doc)
  console.log(`✅ 提取到 ${allTypes.size} 个类型定义`)

  // 2. 提取所有 API 接口，按模块分组
  const apisByModule = extractApis(doc)
  console.log(`✅ 提取到 ${apisByModule.size} 个模块`)

  // 打印每个模块的接口数量
  apisByModule.forEach((apis, moduleKey) => {
    console.log(`  📂 ${moduleKey}: ${apis.length} 个接口`)
  })

  let totalApis = 0
  apisByModule.forEach((apis) => {
    totalApis += apis.length
  })
  console.log(`✅ 提取到 ${totalApis} 个 API 函数`)

  // 3. 按模块生成文件
  apisByModule.forEach((apis, moduleKey) => {
    if (apis.length === 0) return

    // 检查模块是否应该被忽略
    if (shouldIgnoreModule(moduleKey, apis, ignoreConfig)) {
      console.log(`  ⏭️  忽略模块: ${moduleKey} (匹配忽略规则)`)
      return
    }

    // moduleKey 格式：app/home, common/mall/order
    const pathParts = moduleKey.split('/')
    const level1 = pathParts[0]

    // 计算完整路径和模块名
    // app/home -> app/home, home
    // common/mall/order -> common/mall/order, order
    let fullModulePath = ''
    let subModule = ''

    if (level1 === 'app' || level1 === 'common') {
      fullModulePath = moduleKey
      subModule = pathParts[pathParts.length - 1]
    } else {
      fullModulePath = 'business/' + moduleKey
      subModule = pathParts[pathParts.length - 1]
    }

    if (!fullModulePath || !subModule) {
      console.warn(`  ⚠️  跳过模块 ${moduleKey}: 无法解析路径`)
      return
    }

    // 收集此模块使用的所有类型
    const usedTypes = collectUsedTypes(apis)
    const typeNamesToGenerate = new Set<string>()

    usedTypes.forEach((typeName) => {
      typeNamesToGenerate.add(typeName)

      // Query类型需要同时生成对应的Bo类型
      if (typeName.endsWith('Query')) {
        const boName = typeName.replace(/Query$/, 'Bo')
        if (allTypes.has(boName)) {
          typeNamesToGenerate.add(boName)
        }
      }

      // Vo类型如果有对应的Bo类型，也一起生成（用于自动生成Query）
      if (typeName.endsWith('Vo')) {
        const boName = typeName.replace(/Vo$/, 'Bo')
        if (allTypes.has(boName)) {
          typeNamesToGenerate.add(boName)
        }
      }
    })

    // 生成类型文件（*Types.ts）
    const moduleTypes = Array.from(typeNamesToGenerate)
      .map((typeName) => allTypes.get(typeName))
      .filter((t) => t !== undefined)

    if (moduleTypes.length > 0) {
      const typesContent = generateTypesFile(moduleTypes, subModule)
      const moduleDir = join(outputPath, fullModulePath)
      const typesFileName = `${subModule}Types.ts`

      // 检查文件是否被忽略
      const isFileIgnored =
        ignoreConfig?.files?.some((pattern) => matchFileName(pattern, typesFileName)) || false

      if (isFileIgnored) {
        console.log(`  ⏭️  忽略文件: ${fullModulePath}/${typesFileName} (匹配文件忽略规则)`)
      } else {
        const typeStrategy = decideWriteStrategy(moduleDir, typesFileName, typesContent)
        if (typeStrategy.shouldWrite) {
          writeFile(typeStrategy.path, typesContent)
          const fileName = typeStrategy.path.split(/[/\\]/).pop()
          console.log(`  ✍️  生成类型文件: ${fullModulePath}/${fileName} (${typeStrategy.reason})`)
        } else {
          console.log(`  ⏭️  跳过生成: ${fullModulePath}/${typesFileName} (${typeStrategy.reason})`)
        }
      }
    }

    // 生成 API 函数文件（*Api.ts）
    // 先过滤掉需要忽略的接口函数
    let filteredApis = apis
    if (ignoreConfig?.functions && ignoreConfig.functions.length > 0) {
      const originalCount = apis.length
      filteredApis = apis.filter((api) => {
        // 检查函数名是否匹配忽略规则
        const shouldIgnore = ignoreConfig.functions!.some((pattern) => matchFunctionName(pattern, api.name))
        if (shouldIgnore) {
          console.log(`  ⏭️  忽略接口: ${api.name} (匹配函数忽略规则)`)
        }
        return !shouldIgnore
      })
      const ignoredCount = originalCount - filteredApis.length
      if (ignoredCount > 0) {
        console.log(`  📊 ${fullModulePath}: 过滤 ${ignoredCount} 个接口，保留 ${filteredApis.length} 个`)
      }
    }

    // 如果所有接口都被过滤了，跳过文件生成
    if (filteredApis.length === 0) {
      console.log(`  ⏭️  跳过模块: ${fullModulePath} (所有接口都被过滤)`)
      return
    }

    const apiContent = generateApiFile(filteredApis, usedTypes, subModule)
    const moduleDir = join(outputPath, fullModulePath)
    const apiFileName = `${subModule}Api.ts`

    // 检查文件是否被忽略
    const isFileIgnored = ignoreConfig?.files?.some((pattern) => matchFileName(pattern, apiFileName)) || false

    if (isFileIgnored) {
      console.log(`  ⏭️  忽略文件: ${fullModulePath}/${apiFileName} (匹配文件忽略规则)`)
    } else {
      const apiStrategy = decideWriteStrategy(moduleDir, apiFileName, apiContent)
      if (apiStrategy.shouldWrite) {
        writeFile(apiStrategy.path, apiContent)
        const fileName = apiStrategy.path.split(/[/\\]/).pop()
        console.log(`  ✍️  生成 API 文件: ${fullModulePath}/${fileName} (${filteredApis.length} 个函数, ${apiStrategy.reason})`)
      } else {
        console.log(`  ⏭️  跳过生成: ${fullModulePath}/${apiFileName} (${apiStrategy.reason})`)
      }
    }
  })

  console.log(`\n✨ 代码生成完成！输出目录: ${outputDir}`)
}

/**
 * OpenAPI 代码生成插件
 */
export default function createOpenApiPlugin(options: OpenApiPluginOptions): Plugin {
  const { input, output, mode = 'manual', enabled = true, beforeGenerate, afterGenerate, ignore } = options

  // 默认启用且默认使用 manual 模式
  if (enabled === false) {
    return {
      name: 'vite-plugin-openapi',
      apply: 'serve'
    }
  }

  let projectRoot = ''

  /** 执行代码生成 */
  const generate = async () => {
    try {
      console.log('\n🚀 OpenAPI 代码生成开始...')
      console.log(`📄 文档地址: ${input}`)
      console.log(`📁 输出目录: ${output}`)

      if (beforeGenerate) {
        await beforeGenerate()
      }

      // 获取 OpenAPI 文档
      const doc = await fetchOpenApiDoc(input)

      // 生成代码
      await generateCode(doc, output, projectRoot, ignore)

      if (afterGenerate) {
        await afterGenerate()
      }
    } catch (error) {
      console.error('❌ OpenAPI 代码生成失败:', error)
    }
  }

  return {
    name: 'vite-plugin-openapi',
    // 移除 apply: 'serve' 限制，让插件在所有模式下都生效（包括小程序构建）

    configResolved(config) {
      projectRoot = config.root
    },

    async buildStart() {
      if (mode === 'once') {
        console.log('🔧 OpenAPI 生成模式: once (启动时生成一次)')
        await generate()
      } else {
        console.log('🔧 OpenAPI 生成模式: manual (通过 HTTP 端点手动触发)')
        console.log('   ⚠️  仅在 H5 开发模式下可用（pnpm dev:h5）')
        console.log('   💡 小程序开发请使用 once 模式或先启动 H5 生成代码')
      }
    },

    configureServer(server) {
      // 打印端口信息（服务器启动后）
      server.httpServer?.once('listening', () => {
        const address = server.httpServer?.address()
        let port = 5173 // 默认端口

        if (address && typeof address === 'object') {
          port = address.port
        }

        if (mode === 'manual') {
          console.log(`💡 访问 http://localhost:${port}/__openapi_generate 触发生成`)
        }
      })

      // 添加 HTTP 端点用于手动触发生成（支持 GET 和 POST）
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/__openapi_generate' && (req.method === 'POST' || req.method === 'GET')) {
          console.log('📡 收到手动生成请求')

          await generate()

          res.statusCode = 200
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end(`
            <!DOCTYPE html>
            <html lang="zh-CN">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>OpenAPI 代码生成成功</title>
              <style>
                * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }

                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  min-height: 100vh;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  position: relative;
                  overflow: hidden;
                }

                /* 几何图形背景装饰 */
                .geometric-bg {
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  overflow: hidden;
                  z-index: 0;
                }

                .shape {
                  position: absolute;
                  opacity: 0.1;
                }

                .circle {
                  border-radius: 50%;
                  background: white;
                }

                .square {
                  background: white;
                  transform: rotate(45deg);
                }

                .circle.c1 { width: 300px; height: 300px; top: -150px; right: -150px; animation: float 20s ease-in-out infinite; }
                .circle.c2 { width: 150px; height: 150px; bottom: 10%; left: 10%; animation: float 15s ease-in-out infinite reverse; }
                .circle.c3 { width: 80px; height: 80px; top: 40%; right: 20%; animation: float 12s ease-in-out infinite; }

                .square.s1 { width: 200px; height: 200px; bottom: -100px; left: -100px; animation: float 18s ease-in-out infinite; }
                .square.s2 { width: 100px; height: 100px; top: 20%; left: 40%; animation: float 14s ease-in-out infinite reverse; }

                @keyframes float {
                  0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
                  25% { transform: translateY(-30px) translateX(20px) rotate(90deg); }
                  50% { transform: translateY(-60px) translateX(0) rotate(180deg); }
                  75% { transform: translateY(-30px) translateX(-20px) rotate(270deg); }
                }

                .container {
                  position: relative;
                  z-index: 1;
                  text-align: center;
                  background: white;
                  padding: 60px 80px;
                  border-radius: 20px;
                  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                  max-width: 600px;
                  animation: slideUp 0.6s ease-out;
                }

                @keyframes slideUp {
                  from {
                    opacity: 0;
                    transform: translateY(30px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }

                .success-icon {
                  width: 80px;
                  height: 80px;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  border-radius: 50%;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  margin: 0 auto 30px;
                  animation: scaleIn 0.5s ease-out 0.3s both;
                }

                @keyframes scaleIn {
                  from {
                    transform: scale(0);
                  }
                  to {
                    transform: scale(1);
                  }
                }

                .checkmark {
                  width: 40px;
                  height: 40px;
                  border: 4px solid white;
                  border-top: none;
                  border-right: none;
                  transform: rotate(-45deg);
                  margin-top: -8px;
                }

                h1 {
                  font-size: 32px;
                  color: #333;
                  margin-bottom: 20px;
                  font-weight: 600;
                }

                p {
                  font-size: 18px;
                  color: #666;
                  line-height: 1.6;
                  margin-bottom: 10px;
                }

                .code {
                  background: #f5f5f5;
                  padding: 15px 20px;
                  border-radius: 8px;
                  margin: 20px 0;
                  font-family: 'Courier New', monospace;
                  font-size: 14px;
                  color: #333;
                  text-align: left;
                  border-left: 4px solid #667eea;
                }

                .tip {
                  margin-top: 30px;
                  padding: 15px;
                  background: #f0f4ff;
                  border-radius: 8px;
                  font-size: 14px;
                  color: #555;
                }
              </style>
            </head>
            <body>
              <div class="geometric-bg">
                <div class="shape circle c1"></div>
                <div class="shape circle c2"></div>
                <div class="shape circle c3"></div>
                <div class="shape square s1"></div>
                <div class="shape square s2"></div>
              </div>

              <div class="container">
                <div class="success-icon">
                  <div class="checkmark"></div>
                </div>
                <h1>代码生成成功！</h1>
                <p>OpenAPI 接口代码已自动生成</p>
                <div class="code">
                  ✓ API 函数<br>
                  ✓ TypeScript 类型定义<br>
                  ✓ 请求/响应类型
                </div>
                <div class="tip">
                  💡 提示: 返回编辑器查看生成的代码文件
                </div>
              </div>
            </body>
            </html>
          `)
          return
        }

        next()
      })
    }
  }
}
