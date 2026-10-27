// 图片压缩组合函数 - 跨端统一封装
/**
 * 图片压缩 Composable
 *
 * 设计目标：
 * - 微信小程序 / 抖音小程序 / APP：使用 uni.compressImage（支持 quality）
 * - 支付宝小程序：使用 uni.compressImage（仅支持 quality，不支持 compressedWidth/Height）
 * - H5：fallback 到 Canvas 实现（uni.compressImage 在 H5 不支持）
 * - 其它不支持端：跳过压缩，原图直传
 *
 * 主要导出：
 * - COMPRESS_PRESETS：5 个业务预设（avatar / thumbnail / content / receipt / hd）
 * - compressImage(src, opts)：压缩单张图片，返回新路径
 * - createBeforeCompressUpload(presetOrOpts)：生成 wd-upload :before-upload 钩子
 *
 * 注意：wd-upload 的 beforeUpload 钩子 resolve 仅接受 boolean，
 *       因此压缩结果必须就地修改 files[i].path / files[i].size，再 resolve(true)。
 *
 * @author 抓蛙师
 * @date 2026-05-07
 */

// ======================== 类型定义 ========================

/** 压缩选项 */
export interface CompressOptions {
  /** 压缩质量（0-100），默认 80 */
  quality?: number
  /** 输出最大宽度（px），按比例缩放，默认 1280 */
  maxWidth?: number
  /** 输出最大高度（px），按比例缩放，默认 1280 */
  maxHeight?: number
  /** 文件小于此阈值（KB）时跳过压缩，默认 100KB */
  skipBelowKB?: number
  /** H5 输出 mime（小程序/APP 由 uni.compressImage 决定），默认 image/jpeg */
  mimeType?: 'image/jpeg' | 'image/png' | 'image/webp'
}

/** 压缩结果 */
export interface CompressResult {
  /** 压缩后路径（小程序/APP）或 ObjectURL（H5） */
  path: string
  /** 压缩后大小（字节），失败/未知时为 undefined */
  size?: number
  /** 是否真正执行了压缩（false 表示跳过/不支持） */
  compressed: boolean
}

// ======================== 业务预设 ========================

/** 5 个常用业务预设 */
export const COMPRESS_PRESETS = {
  /** 头像：200x200，70% 质量 */
  avatar: { quality: 70, maxWidth: 200, maxHeight: 200, skipBelowKB: 30 },
  /** 缩略图：400x400，75% 质量 */
  thumbnail: { quality: 75, maxWidth: 400, maxHeight: 400, skipBelowKB: 50 },
  /** 文章/内容图：1280x1280，80% 质量 */
  content: { quality: 80, maxWidth: 1280, maxHeight: 1280, skipBelowKB: 200 },
  /** 票据/凭证（需保留可识别性）：1920x1920，85% 质量 */
  receipt: { quality: 85, maxWidth: 1920, maxHeight: 1920, skipBelowKB: 300 },
  /** 高清图：2560x2560，90% 质量 */
  hd: { quality: 90, maxWidth: 2560, maxHeight: 2560, skipBelowKB: 500 },
} as const satisfies Record<string, CompressOptions>

export type CompressPresetName = keyof typeof COMPRESS_PRESETS

// ======================== 默认选项 ========================

const DEFAULT_OPTIONS: Required<CompressOptions> = {
  quality: 80,
  maxWidth: 1280,
  maxHeight: 1280,
  skipBelowKB: 100,
  mimeType: 'image/jpeg',
}

const resolveOptions = (opts?: CompressOptions): Required<CompressOptions> => {
  return { ...DEFAULT_OPTIONS, ...opts }
}

// ======================== 平台分支：小程序 / APP ========================

/**
 * 微信/抖音小程序 + APP：调用 uni.compressImage
 * 文档：https://uniapp.dcloud.net.cn/api/media/image.html#compressimage
 */
const compressByUniApi = (
  src: string,
  options: Required<CompressOptions>,
): Promise<CompressResult> => {
  return new Promise((resolve) => {
    uni.compressImage({
      src,
      quality: options.quality,
      // #ifdef MP-WEIXIN || APP-PLUS || MP-TOUTIAO
      compressedWidth: options.maxWidth,
      compressHeight: options.maxHeight,
      // #endif
      success: (res) => {
        const path = res.tempFilePath
        // 尝试读取压缩后大小（部分平台 res 不带 size，需 getFileInfo）
        uni.getFileInfo({
          filePath: path,
          success: (info) => {
            resolve({ path, size: info.size, compressed: true })
          },
          fail: () => {
            resolve({ path, compressed: true })
          },
        })
      },
      fail: (err) => {
        console.warn('[useImageCompress] uni.compressImage 失败，使用原图:', err)
        resolve({ path: src, compressed: false })
      },
    })
  })
}

// ======================== 平台分支：H5 (Canvas) ========================

/**
 * H5：用 Canvas 重绘 + toBlob 实现压缩
 * 步骤：fetch blob URL → Image → drawImage → toBlob → ObjectURL
 */
// #ifdef H5
const compressByCanvas = async (
  src: string,
  options: Required<CompressOptions>,
): Promise<CompressResult> => {
  try {
    // 1. 加载图片
    const img = await loadImage(src)

    // 2. 计算目标尺寸（保持宽高比）
    const { width: targetW, height: targetH } = calcTargetSize(
      img.naturalWidth,
      img.naturalHeight,
      options.maxWidth,
      options.maxHeight,
    )

    // 3. Canvas 重绘
    const canvas = document.createElement('canvas')
    canvas.width = targetW
    canvas.height = targetH
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      console.warn('[useImageCompress] Canvas 2D context 不可用，使用原图')
      return { path: src, compressed: false }
    }
    ctx.drawImage(img, 0, 0, targetW, targetH)

    // 4. 导出 blob
    const blob = await canvasToBlob(canvas, options.mimeType, options.quality / 100)
    if (!blob) {
      return { path: src, compressed: false }
    }

    const url = URL.createObjectURL(blob)
    return { path: url, size: blob.size, compressed: true }
  } catch (err) {
    console.warn('[useImageCompress] Canvas 压缩失败，使用原图:', err)
    return { path: src, compressed: false }
  }
}

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = (e) => reject(e)
    img.src = src
  })
}

const calcTargetSize = (w: number, h: number, maxW: number, maxH: number) => {
  if (w <= maxW && h <= maxH) return { width: w, height: h }
  const ratio = Math.min(maxW / w, maxH / h)
  return { width: Math.round(w * ratio), height: Math.round(h * ratio) }
}

const canvasToBlob = (
  canvas: HTMLCanvasElement,
  mime: string,
  quality: number,
): Promise<Blob | null> => {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), mime, quality)
  })
}
// #endif

// ======================== 统一入口 ========================

/**
 * 压缩单张图片（跨端）
 * 返回值的 path 字段始终可用：成功则为压缩后路径，失败/不支持则为原 src
 */
export const compressImage = async (
  src: string,
  options?: CompressOptions,
): Promise<CompressResult> => {
  const opts = resolveOptions(options)

  // #ifdef MP-WEIXIN || APP-PLUS || MP-TOUTIAO || MP-ALIPAY
  return compressByUniApi(src, opts)
  // #endif

  // #ifdef H5
  return compressByCanvas(src, opts)
  // #endif

  // #ifdef MP-BAIDU || MP-QQ || MP-LARK || MP-KUAISHOU
  // 这些平台对 compressImage 支持不一致，保守起见跳过
  console.warn('[useImageCompress] 当前平台暂不支持图片压缩，使用原图')
  return { path: src, compressed: false }
  // #endif
}

// ======================== wd-upload 接入辅助 ========================

/**
 * wd-upload :before-upload 钩子的入参类型
 * 与 wd-upload.vue 内 UploadBeforeUploadOption 保持一致
 */
interface BeforeUploadOption {
  files: Array<{
    path: string
    size?: number
    type: 'image' | 'video' | 'file'
    [key: string]: any
  }>
  fileList: any[]
  resolve: (isPass: boolean) => void
}

/**
 * 创建 wd-upload :before-upload 钩子（自动压缩）
 *
 * 用法：
 *   <wd-upload :before-upload="beforeUpload" />
 *   const beforeUpload = createBeforeCompressUpload('content')
 *   // 或
 *   const beforeUpload = createBeforeCompressUpload({ quality: 70, maxWidth: 800 })
 *
 * @param presetOrOpts 预设名 或 自定义选项
 */
export const createBeforeCompressUpload = (
  presetOrOpts: CompressPresetName | CompressOptions = 'content',
) => {
  const opts: CompressOptions =
    typeof presetOrOpts === 'string' ? COMPRESS_PRESETS[presetOrOpts] : presetOrOpts
  const resolved = resolveOptions(opts)
  const skipBelowBytes = resolved.skipBelowKB * 1024

  return async ({ files, resolve }: BeforeUploadOption) => {
    try {
      await Promise.all(
        files.map(async (file) => {
          // 仅处理图片类型
          if (file.type !== 'image') return
          // 文件已小于阈值，跳过压缩
          if (file.size && file.size <= skipBelowBytes) return

          const result = await compressImage(file.path, opts)
          if (result.compressed) {
            file.path = result.path
            if (result.size !== undefined) file.size = result.size
          }
        }),
      )
    } catch (err) {
      console.warn('[useImageCompress] beforeUpload 压缩异常，使用原图继续上传:', err)
    } finally {
      resolve(true)
    }
  }
}

// ======================== Composable 形式（可选） ========================

/**
 * 组合式用法（可选）：在 setup 中按需使用
 *
 * const { compress, beforeUpload } = useImageCompress('content')
 * <wd-upload :before-upload="beforeUpload" />
 */
export const useImageCompress = (
  presetOrOpts: CompressPresetName | CompressOptions = 'content',
) => {
  const opts: CompressOptions =
    typeof presetOrOpts === 'string' ? COMPRESS_PRESETS[presetOrOpts] : presetOrOpts

  const compress = (src: string, override?: CompressOptions) =>
    compressImage(src, { ...opts, ...override })

  const beforeUpload = createBeforeCompressUpload(opts)

  return {
    compress,
    beforeUpload,
    presets: COMPRESS_PRESETS,
  }
}
