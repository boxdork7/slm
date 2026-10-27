import type { Plugin } from 'vite'
import { existsSync, readdirSync, statSync, writeFileSync, mkdirSync, readFileSync } from 'node:fs'
import { join, resolve, dirname, basename, extname, relative } from 'node:path'

interface StaticAssetsTypesOptions {
  /** 静态资源目录，相对于项目根目录 */
  staticDir?: string
  /** 类型文件输出路径，相对于项目根目录 */
  outputPath?: string
  /** 支持的图片扩展名 */
  extensions?: string[]
  /** 路径前缀，用于生成正确的引用路径 */
  pathPrefix?: string
  /** 是否启用（可以根据环境控制） */
  enabled?: boolean
  /** 排除的目录列表，相对于静态资源目录 */
  excludeDirs?: string[]
}

/**
 * 静态资源类型生成插件
 * 自动扫描静态资源目录并生成TypeScript类型文件
 */
export default (options: StaticAssetsTypesOptions = {}) => {
  const {
    staticDir = 'src/static',
    outputPath = 'src/types/static-assets.d.ts',
    extensions = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico', 'avif', 'bmp'],
    pathPrefix = '/static',
    enabled = true,
    excludeDirs = ['app', 'styles'],
  } = options

  let projectRoot = ''

  // 获取所有图片文件
  const getAllImageFiles = (dir: string, basePath = ''): string[] => {
    const files: string[] = []

    if (!existsSync(dir)) {
      return files
    }

    try {
      const items = readdirSync(dir)

      items.forEach((item) => {
        const fullPath = join(dir, item)
        const relativePath = join(basePath, item)

        try {
          if (statSync(fullPath).isDirectory()) {
            // 检查是否为排除的目录
            const normalizedRelativePath = relativePath.replace(/\\/g, '/')
            const shouldExclude = excludeDirs.some(excludeDir => {
              const normalizedExcludeDir = excludeDir.replace(/\\/g, '/')
              return normalizedRelativePath === normalizedExcludeDir ||
                normalizedRelativePath.startsWith(`${normalizedExcludeDir}/`)
            })

            if (!shouldExclude) {
              files.push(...getAllImageFiles(fullPath, relativePath))
            }
          } else {
            const ext = extname(item).slice(1).toLowerCase()
            if (extensions.includes(ext)) {
              // 统一使用正斜杠，确保路径格式正确
              const normalizedPath = (`${pathPrefix}/${relativePath}`)
                .replace(/\\/g, '/')
                .replace(/\/+/g, '/')
              files.push(normalizedPath)
            }
          }
        } catch (error) {
          // 忽略无法访问的文件/目录
          console.warn(`跳过无法访问的文件: ${fullPath}`)
        }
      })
    } catch (error) {
      console.warn(`无法读取目录: ${dir}`)
    }

    return files.sort()
  }

  // 生成类型文件内容
  const generateTypeContent = (imagePaths: string[]): string => {

    // 生成常量对象
    const constantsContent = imagePaths.length > 0
      ? imagePaths.map((imagePath) => {
        const fileName = basename(imagePath, extname(imagePath))
        // 生成合法的常量名
        const key = fileName
          .replace(/[^a-z0-9]/gi, '_')
          .replace(/^(\d)/, '_$1') // 如果以数字开头，添加下划线
          .toUpperCase()
        return `  ${key}: '${imagePath}' as const`
      }).join(',\n')
      : '  // 暂无静态图片资源'

    return `/**
 * 静态资源类型声明文件
 *
 * 🤖 此文件由 static-assets-types 插件自动生成
 * 📁 扫描目录: ${staticDir}
 * 📊 资源数量: ${imagePaths.length} 个文件
 *
 * ⚠️ 请勿手动修改此文件，所有修改将在下次构建时被覆盖
 */

// ==================== 全局类型扩展 ====================

declare global {
  /** 静态资源相关的全局类型 */
  interface StaticAssets {
    /** 图片资源路径类型 */
    images: StaticImagePath
  }

  /** 全局图片源类型，包含静态资源路径和其他可能的路径 */
  type ImageSrc = StaticImagePath | string

  /** 全局静态图片资源路径类型 */
  type StaticImagePath =${
      imagePaths.length > 0
        ? `\n${imagePaths.map(path => `    | '${path}'`).join('\n')}`
        : 'never'
    }
}

// ==================== 常量定义 ====================

/** 静态图片资源路径常量对象 */
export const STATIC_IMAGES = {
${constantsContent}
} as const

/** 静态图片资源的键名类型 */
export type StaticImageKey = keyof typeof STATIC_IMAGES

// ==================== 工具函数 ====================

/**
 * 获取静态图片资源路径
 * @param key 图片资源键名
 * @returns 图片资源路径
 */
export const getStaticImage = (key: StaticImageKey): StaticImagePath => {
  return STATIC_IMAGES[key]
}

/**
 * 检查路径是否为有效的静态图片资源
 * @param path 要检查的路径
 * @returns 是否为有效的静态图片资源路径
 */
export const isValidStaticImage = (path: string): path is StaticImagePath => {
  return Object.values(STATIC_IMAGES).includes(path as StaticImagePath)
}

/**
 * 获取所有静态图片资源路径
 * @returns 所有静态图片资源路径数组
 */
export const getAllStaticImages = (): StaticImagePath[] => {
  return Object.values(STATIC_IMAGES)
}

/**
 * 根据文件名搜索静态图片资源
 * @param fileName 文件名（不含扩展名）
 * @returns 匹配的图片资源路径数组
 */
export const searchStaticImages = (fileName: string): StaticImagePath[] => {
  const searchTerm = fileName.toLowerCase()
  return getAllStaticImages().filter(path =>
    basename(path, extname(path)).toLowerCase().includes(searchTerm)
  )
}

// 导出空对象以确保这是一个模块
export {}
`
  }

  // 写入类型文件（仅在内容变化时写入，避免热更新循环）
  const writeTypeFile = (showLog = true) => {
    if (!enabled) return

    const staticPath = resolve(projectRoot, staticDir)
    const outputFilePath = resolve(projectRoot, outputPath)

    try {
      const imagePaths = getAllImageFiles(staticPath)
      const typeContent = generateTypeContent(imagePaths)

      // 确保输出目录存在
      const outputDir = dirname(outputFilePath)
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true })
      }

      // 对比现有文件内容，避免不必要的写入触发热更新循环
      if (existsSync(outputFilePath)) {
        const existingContent = readFileSync(outputFilePath, 'utf-8')
        if (existingContent === typeContent) {
          // 内容相同，跳过写入
          return
        }
      }

      writeFileSync(outputFilePath, typeContent, 'utf-8')

      if (showLog) {
        console.log(`✨ 静态资源类型已生成: ${outputPath} (${imagePaths.length} 个文件)`)
      }
    } catch (error) {
      console.error('❌ 生成静态资源类型时出错:', error)
    }
  }

  return {
    name: 'static-assets-types',

    configResolved(config) {
      projectRoot = config.root
    },

    buildStart() {
      // 构建开始时生成类型文件
      writeTypeFile()
    },

    handleHotUpdate({ file, server }) {
      if (!enabled) return

      const staticPath = resolve(projectRoot, staticDir)

      // 检查是否是静态资源目录下的文件
      if (file.startsWith(staticPath)) {
        const ext = extname(file).slice(1).toLowerCase()
        if (extensions.includes(ext)) {
          console.log(`🔄 检测到静态资源变化: ${relative(projectRoot, file)}`)
          writeTypeFile()

          // 不需要特殊处理，让 Vite 自己处理热更新
          return undefined
        }
      }
    },
  } as Plugin
}
