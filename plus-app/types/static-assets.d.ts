/**
 * 静态资源类型声明文件
 *
 * 🤖 此文件由 static-assets-types 插件自动生成
 * 📁 扫描目录: static
 * 📊 资源数量: 1 个文件
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
  type StaticImagePath =
    | '/static/logo.png'
}

// ==================== 常量定义 ====================

/** 静态图片资源路径常量对象 */
export const STATIC_IMAGES = {
  LOGO: '/static/logo.png' as const
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
