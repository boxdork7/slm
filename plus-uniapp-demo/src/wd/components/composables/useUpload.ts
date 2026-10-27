import type {
  ChooseFile,
  ChooseFileOption,
  UploadFileItem,
  UploadMethod,
  UploadStatusType,
} from '../wd-upload/wd-upload.vue'
import { isArray, isDef, isFunction } from '../common/util'

/**
 * 上传状态枚举
 *
 * 定义了文件上传过程中的所有可能状态
 */
export const UPLOAD_STATUS: Record<string, UploadStatusType> = {
  PENDING: 'pending', // 等待上传
  LOADING: 'loading', // 上传中
  SUCCESS: 'success', // 上传成功
  FAIL: 'fail', // 上传失败
}

/**
 * 直传相关类型定义
 */
export interface PresignedUrlBo {
  /** 文件名 */
  fileName: string
  /** 文件类型 */
  fileType: string
  /** 模块名称 */
  moduleName?: string
  /** 目录id */
  directoryId?: string | number
  /** 文件路径 */
  directoryPath?: string
}

export interface PresignedUrlVo {
  /** 预签名上传URL */
  presignedUrl: string
  /** 模块名称 */
  moduleName?: string
  /** 目录id */
  directoryId?: string | number
  /** 文件路径 */
  directoryPath?: string
  /** 文件键 */
  fileKey: string
  /** 文件访问URL */
  fileUrl: string
  /** 过期时间（秒） */
  expiration: number
  /** 上传提示信息 */
  uploadTip: string
}

export interface ConfirmDirectUploadBo {
  /** 文件名 */
  fileName: string
  /** 文件键 */
  fileKey: string
  /** 文件URL */
  fileUrl: string
  /** 模块名称 */
  moduleName?: string
  /** 目录id */
  directoryId?: string | number
  /** 文件路径 */
  directoryPath?: string
  /** 文件大小（可选） */
  fileSize?: number
}

export interface SysOssUploadVo {
  /** 文件URL */
  url: string
  /** 文件名 */
  fileName: string
  /** OSS文件ID */
  ossId: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 快速上传配置选项接口
 */
export interface FastUploadOptions {
  // 上传地址，可选，使用默认值
  action?: string
  // 请求头，可选，使用默认值
  header?: Record<string, any>
  // 其它表单数据
  formData?: Record<string, any>
  // 文件对应的 key，可选，使用默认值
  name?: string
  // 成功状态码，可选，使用默认值
  statusCode?: number
  // 自定义上传方法
  uploadMethod?: UploadMethod
  // 上传成功回调
  onSuccess?: (res: UploadResult, file: UploadFileItem, formData: Record<string, any>) => void
  // 上传失败回调
  onError?: (
    error: UniApp.GeneralCallbackResult,
    file: UploadFileItem,
    formData: Record<string, any>,
  ) => void
  // 上传进度回调
  onProgress?: (res: UniApp.OnProgressUpdateResult, file: UploadFileItem) => void
  // 是否自动中断之前的上传任务
  abortPrevious?: boolean
  // 新增直传相关配置
  /** 是否启用直传模式 */
  enableDirectUpload?: boolean
  /** 模块名称 */
  moduleName?: string
  /** 目录id */
  directoryId?: string | number
  /** 文件路径 */
  directoryPath?: string
}

/**
 * 文件上传组合函数返回值接口
 *
 * 定义了 useUpload 函数返回的所有方法和属性
 */
export interface UseUploadReturn {
  // 开始上传文件
  startUpload: (
    file: UploadFileItem,
    options: UseUploadOptions,
  ) => UniApp.UploadTask | void | Promise<void>
  // 快速上传文件
  fastUpload: (
    filePath: string,
    options?: FastUploadOptions,
  ) => UniApp.UploadTask | void | Promise<void>
  // 中断上传
  abort: (task?: UniApp.UploadTask) => void
  // 上传状态常量
  UPLOAD_STATUS: Record<string, UploadStatusType>
  // 选择文件
  chooseFile: (options: ChooseFileOption) => Promise<ChooseFile[]>
}

/**
 * 文件上传配置选项接口
 *
 * 定义了上传文件时的各种配置参数
 */
export interface UseUploadOptions {
  // 上传地址
  action: string
  // 请求头
  header?: Record<string, any>
  // 文件对应的 key
  name?: string
  // 其它表单数据
  formData?: Record<string, any>
  // 文件类型 仅支付宝支持且在支付宝平台必填
  fileType?: 'image' | 'video' | 'audio'
  // 成功状态码
  statusCode?: number
  // 文件状态的key
  statusKey?: string
  // 自定义上传方法
  uploadMethod?: UploadMethod
  // 上传成功回调
  onSuccess?: (res: UploadResult, file: UploadFileItem, formData: Record<string, any>) => void
  // 上传失败回调
  onError?: (
    error: UniApp.GeneralCallbackResult,
    file: UploadFileItem,
    formData: Record<string, any>,
  ) => void
  // 上传进度回调
  onProgress?: (res: UniApp.OnProgressUpdateResult, file: UploadFileItem) => void
  // 是否自动中断之前的上传任务
  abortPrevious?: boolean
  // 根据文件拓展名过滤(H5支持全部类型过滤,微信小程序支持all和file时过滤,其余平台不支持)
  extension?: string[]
  // 新增直传相关配置
  /** 是否启用直传模式 */
  enableDirectUpload?: boolean
  /** 模块名称 */
  moduleName?: string
  /** 目录id */
  directoryId?: string | number
  /** 文件路径 */
  directoryPath?: string
}

/**
 * 上传结果类型
 */
export interface UploadResult {
  /** 文件名称 */
  fileName: string
  /** 文件链接（预览用，私有库会自动生成预签名URL） */
  url: string
  /** 原始URL地址（存储用，不含预签名参数） */
  originalUrl?: string
  /** ossId */
  ossId: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 内部工具函数
 */

/**
 * 从完整URL中提取不带签名的干净URL
 * 用于兜底处理，当后端未返回 originalUrl 时从 url 中提取
 * @param fullUrl 完整URL(可能带签名参数)
 * @returns 不带签名的干净URL
 */
const extractCleanUrl = (fullUrl: string): string => {
  if (!fullUrl || !fullUrl.includes('?')) return fullUrl
  // 检查是否包含预签名参数
  const presignedParams = [
    'X-Amz-Algorithm', 'X-Amz-Signature', 'X-Amz-Credential', 'X-Amz-Date', 'X-Amz-Expires', 'X-Amz-SignedHeaders',
    'OSSAccessKeyId', 'Signature', 'Expires',
    'q-sign-algorithm', 'q-signature', 'q-ak', 'q-sign-time', 'q-key-time', 'q-header-list', 'q-url-param-list',
    'token', 'AWSAccessKeyId',
  ]
  const hasPresignedParams = presignedParams.some((param) => fullUrl.includes(`${param}=`) || fullUrl.includes(`&${param}=`))
  return hasPresignedParams ? fullUrl.split('?')[0] : fullUrl
}

/**
 * 获取基础API地址
 */
const getBaseApiUrl = (): string => {
  return import.meta.env.VITE_APP_BASE_API
}

/**
 * 获取Token
 */
const getToken = (): string | null => {
  try {
    const appId = import.meta.env.VITE_APP_ID // 这里需要替换为实际的应用ID
    const prefixedKey = `${appId}:token`
    const wrapper = uni.getStorageSync(prefixedKey)

    if (!wrapper || typeof wrapper !== 'object') {
      return null
    }

    // 检查过期时间
    if (wrapper._expire && wrapper._expire < Date.now()) {
      uni.removeStorageSync(prefixedKey)
      return null
    }

    return wrapper.data || (wrapper as string)
  } catch (e) {
    console.error('获取Token失败:', e)
    return null
  }
}

/**
 * 获取认证头部
 */
const getAuthHeaders = (): Record<string, string> => {
  const token = getToken()
  if (!token) {
    return {}
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}

/**
 * 发送HTTP请求的简化实现
 */
const request = <T = any>(options: {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: Record<string, any>
}): Promise<T> => {
  return new Promise((resolve, reject) => {
    const { url, method, data, header = {} } = options

    // 构建完整URL
    const fullUrl = url.startsWith('http') ? url : getBaseApiUrl() + url

    // 合并请求头
    const requestHeader = {
      'Content-Type': 'application/json;charset=utf-8',
      ...getAuthHeaders(),
      ...header,
    }

    uni.request({
      url: fullUrl,
      method,
      data,
      header: requestHeader,
      timeout: 50000,
      success: (res) => {
        if (res.statusCode === 200) {
          try {
            const responseData = res.data as any
            if (responseData.code === 200) {
              resolve(responseData.data as T)
            } else {
              reject(new Error(responseData.msg || '请求失败'))
            }
          } catch (parseError) {
            reject(new Error('响应数据解析失败'))
          }
        } else {
          reject(new Error(`HTTP状态码错误: ${res.statusCode}`))
        }
      },
      fail: (err) => {
        reject(new Error(err.errMsg || '网络请求失败'))
      },
    })
  })
}

/**
 * 直传API调用函数
 */
const getPresignedUrl = async (params: PresignedUrlBo): Promise<PresignedUrlVo> => {
  try {
    const data = await request<PresignedUrlVo>({
      url: '/resource/oss/getPresignedUrl',
      method: 'POST',
      data: params,
    })
    return data
  } catch (error) {
    throw new Error(error.message || '获取预签名URL失败')
  }
}

const confirmDirectUpload = async (params: ConfirmDirectUploadBo): Promise<SysOssUploadVo> => {
  try {
    const data = await request<SysOssUploadVo>({
      url: '/resource/oss/confirmDirectUpload',
      method: 'POST',
      data: params,
    })
    return data
  } catch (error) {
    throw new Error(error.message || '确认直传上传失败')
  }
}

/**
 * 文件上传组合函数
 *
 * 提供完整的文件上传功能，支持：
 * - 多平台文件选择（图片、视频、媒体、文件）
 * - 自定义上传方法
 * - 快速上传功能
 * - 上传进度监控
 * - 任务中断控制
 * - 状态管理
 * - 错误处理
 * - 直传功能
 *
 * @returns 包含上传控制方法和状态的对象
 *
 * @example
 * ```typescript
 * const { startUpload, fastUpload, abort, chooseFile, UPLOAD_STATUS } = useUpload()
 *
 * // 快速上传（启用直传） 如果传了directoryId则directoryPath无效
 * fastUpload('http://tmp/V2LBZ8vmekXWb6af2a4f85547f2045ffe47cf8b85ef8.jpeg', {
 *   enableDirectUpload: true,
 *   directoryId: 123,
 *   moduleName: avatar,
 *   directoryPath: '/文档/办公',
 *   onSuccess: (res, file) => console.log('直传成功'),
 *   onError: (err, file) => console.log('直传失败')
 * })
 *
 * // 选择文件
 * const files = await chooseFile({ accept: 'image', multiple: true })
 *
 * // 开始上传
 * files.forEach(file => {
 *   startUpload(file, {
 *     action: '/api/upload',
 *     enableDirectUpload: true,
 *     directoryId: 123,
 *     directoryPath: avatar,
 *     directoryPath: '/文档/办公',
 *     onProgress: (res, file) => console.log(`上传进度: ${res.progress}%`),
 *     onSuccess: (res, file) => console.log('上传成功'),
 *     onError: (err, file) => console.log('上传失败')
 *   })
 * })
 * ```
 */
export const useUpload = (): UseUploadReturn => {
  // 当前上传任务实例，用于任务管理和中断控制
  let currentTask: UniApp.UploadTask | null = null

  // 默认配置
  const DEFAULT_CONFIG = {
    action: `${getBaseApiUrl()}/resource/oss/upload`, // 默认上传地址
    // 请求头不放在这里：useUpload() 可能在登录前就被调用（如全局布局里的授权弹窗），
    // 此时 token 还不存在，提前取会把空头固化下来，登录后上传全部 401。改为每次上传时再取。
    name: 'file', // 默认文件字段名
    statusCode: 200, // 默认成功状态码
    statusKey: 'status', // 默认状态字段名
  }

  /**
   * 根据文件路径获取文件扩展名
   *
   * @param filePath - 文件路径
   * @returns 文件扩展名（小写）
   */
  const getFileExtension = (filePath: string): string => {
    const lastDotIndex = filePath.lastIndexOf('.')
    if (lastDotIndex === -1) return ''
    return filePath.substring(lastDotIndex + 1).toLowerCase()
  }

  /**
   * 根据文件扩展名获取文件类型
   *
   * @param extension - 文件扩展名
   * @returns 文件类型
   */
  const getFileType = (extension: string): 'image' | 'video' | 'audio' => {
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg']
    const videoExts = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm', '3gp']
    const audioExts = ['mp3', 'wav', 'aac', 'ogg', 'flac', 'wma', 'm4a']

    if (imageExts.includes(extension)) return 'image'
    if (videoExts.includes(extension)) return 'video'
    if (audioExts.includes(extension)) return 'audio'

    // 默认返回 image
    return 'image'
  }

  /**
   * 从文件路径获取文件名
   *
   * @param filePath - 文件路径
   * @returns 文件名
   */
  const getFileName = (filePath: string): string => {
    const lastSlashIndex = filePath.lastIndexOf('/')
    if (lastSlashIndex === -1) return filePath
    return filePath.substring(lastSlashIndex + 1)
  }

  /**
   * 生成唯一ID
   *
   * @returns 唯一标识符
   */
  const generateUID = (): number => {
    return Date.now() + Math.floor(Math.random() * 1000)
  }

  /**
   * 创建文件对象
   *
   * @param filePath - 文件路径
   * @returns 文件对象
   */
  const createFileFromPath = (filePath: string): UploadFileItem => {
    const extension = getFileExtension(filePath)
    const fileType = getFileType(extension)
    const fileName = getFileName(filePath)

    return {
      uid: generateUID(), // 生成唯一标识符
      url: filePath,
      name: fileName,
      type: fileType,
      size: 0, // 无法从路径获取大小，设为0
      path: filePath,
      thumb: fileType === 'image' ? filePath : '', // 图片类型使用原图作为缩略图
      [DEFAULT_CONFIG.statusKey]: UPLOAD_STATUS.PENDING,
      percent: 0,
    }
  }

  /**
   * 格式化图片信息
   *
   * 将 uni.chooseImage 的返回结果格式化为统一的文件对象数组
   * 兼容不同平台的差异（钉钉平台文件在 files 中）
   *
   * @param res - 选择图片的结果
   * @returns 格式化后的文件数组
   */
  const formatImage = (res: UniApp.ChooseImageSuccessCallbackResult): ChooseFile[] => {
    // #ifdef MP-DINGTALK
    // 钉钉平台特殊处理：文件信息在 files 字段中
    res.tempFiles = isDef((res as any).files) ? (res as any).files : res.tempFiles
    // #endif

    // 处理多文件情况
    if (isArray(res.tempFiles)) {
      return res.tempFiles.map((item: any) => ({
        path: item.path || '', // 文件路径
        name: item.name || '', // 文件名称
        size: item.size || 0, // 文件大小
        type: 'image' as const, // 文件类型
        thumb: item.path || '', // 缩略图路径
      }))
    }

    // 处理单文件情况
    return [
      {
        path: (res.tempFiles as any).path || '',
        name: (res.tempFiles as any).name || '',
        size: (res.tempFiles as any).size || 0,
        type: 'image' as const,
        thumb: (res.tempFiles as any).path || '',
      },
    ]
  }

  /**
   * 格式化视频信息
   *
   * 将 uni.chooseVideo 的返回结果格式化为统一的文件对象数组
   * 包含视频特有的属性如时长、缩略图等
   *
   * @param res - 选择视频的结果
   * @returns 格式化后的文件数组
   */
  const formatVideo = (res: UniApp.ChooseVideoSuccess): ChooseFile[] => {
    return [
      {
        path: res.tempFilePath || (res as any).filePath || '', // 视频文件路径
        name: res.name || '', // 视频文件名称
        size: res.size || 0, // 视频文件大小
        type: 'video' as const, // 文件类型
        thumb: (res as any).thumbTempFilePath || '', // 视频缩略图路径
        duration: res.duration, // 视频时长
      },
    ]
  }

  /**
   * 格式化媒体信息
   *
   * 将 uni.chooseMedia 的返回结果格式化为统一的文件对象数组
   * 支持图片和视频的混合选择，根据文件类型设置不同的缩略图
   *
   * @param res - 选择媒体的结果
   * @returns 格式化后的文件数组
   */
  const formatMedia = (res: UniApp.ChooseMediaSuccessCallbackResult): ChooseFile[] => {
    return res.tempFiles.map((item) => ({
      type: item.fileType as 'image' | 'video', // 媒体类型
      path: item.tempFilePath || '', // 文件路径
      // 根据文件类型设置缩略图：视频使用专门的缩略图，图片使用原图
      thumb: item.fileType === 'video' ? item.thumbTempFilePath || '' : item.tempFilePath || '',
      size: item.size || 0, // 文件大小
      duration: item.duration, // 时长（仅视频有效）
    }))
  }

  /**
   * 中断上传任务
   *
   * 提供灵活的上传任务中断功能：
   * - 可以中断指定的上传任务
   * - 如果不指定任务，则中断当前正在进行的任务
   * - 中断后会清理任务引用，防止内存泄漏
   *
   * @param task - 要中断的上传任务，如果不传则中断当前任务
   */
  const abort = (task?: UniApp.UploadTask) => {
    if (task) {
      // 中断指定的上传任务
      task.abort()
    } else if (currentTask) {
      // 中断当前正在进行的上传任务
      currentTask.abort()
      currentTask = null
    }
  }
  /**
   * 默认上传方法
   *
   * 使用 uni.uploadFile 实现的标准上传功能：
   * - 支持自动中断之前的上传任务
   * - 提供完整的状态回调（成功、失败、进度）
   * - 根据状态码判断上传结果
   * - 自动管理上传任务实例
   *
   * @param file - 要上传的文件对象
   * @param formData - 额外的表单数据
   * @param options - 上传配置选项
   * @returns 上传任务实例
   */
  const defaultUpload: UploadMethod = (file, formData, options) => {
    // 如果配置了自动中断，则中断之前的上传任务
    if (options.abortPrevious) {
      abort()
    }

    // 创建上传任务
    const uploadTask = uni.uploadFile({
      url: options.action, // 上传地址
      header: options.header, // 请求头
      name: options.name, // 文件字段名
      fileName: options.name, // 文件名
      fileType: options.fileType, // 文件类型
      formData, // 表单数据
      filePath: file.url, // 文件路径
      success(res) {
        // 首先检查HTTP状态码
        if (res.statusCode === options.statusCode) {
          try {
            // 解析响应数据
            const responseData = JSON.parse(res.data)
            // 检查业务状态码
            if (responseData.code === 200) {
              // 业务逻辑成功
              options.onSuccess(responseData.data as UploadResult, file, formData)
            } else {
              // 业务逻辑失败，构造错误信息
              const businessError: UniApp.GeneralCallbackResult = {
                errMsg: responseData.msg || '业务处理失败',
              }
              options.onError(businessError, file, formData)
            }
          } catch (parseError) {
            // JSON解析失败
            const jsonError: UniApp.GeneralCallbackResult = {
              errMsg: '响应数据解析失败',
            }
            options.onError(jsonError, file, formData)
          }
        } else {
          // HTTP状态码不匹配，视为上传失败
          const httpError: UniApp.GeneralCallbackResult = {
            errMsg: `HTTP状态码错误: ${res.statusCode}`,
          }
          options.onError(httpError, file, formData)
        }
      },
      fail(err) {
        console.log('err', err)
        // 网络错误或其他异常导致的上传失败
        options.onError(err, file, formData)
      },
    })

    // 保存当前任务实例，用于任务管理
    currentTask = uploadTask

    // 监听上传进度
    uploadTask.onProgressUpdate((res) => {
      options.onProgress(res, file)
    })

    // 返回上传任务实例，让外部可以控制上传过程
    return uploadTask
  }

  /**
   * 根据文件扩展名获取精确的MIME类型
   *
   * @param extension - 文件扩展名（不带点号）
   * @returns 精确的MIME类型字符串
   */
  const getMimeType = (extension: string): string => {
    const mimeTypes: Record<string, string> = {
      // 图片类型
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      bmp: 'image/bmp',
      webp: 'image/webp',
      svg: 'image/svg+xml',
      ico: 'image/x-icon',
      tiff: 'image/tiff',
      tif: 'image/tiff',

      // 视频类型
      mp4: 'video/mp4',
      avi: 'video/x-msvideo',
      mov: 'video/quicktime',
      wmv: 'video/x-ms-wmv',
      flv: 'video/x-flv',
      mkv: 'video/x-matroska',
      webm: 'video/webm',
      '3gp': 'video/3gpp',
      ts: 'video/mp2t',
      mpg: 'video/mpeg',
      mpeg: 'video/mpeg',

      // 音频类型
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      aac: 'audio/aac',
      ogg: 'audio/ogg',
      flac: 'audio/flac',
      wma: 'audio/x-ms-wma',
      m4a: 'audio/mp4',
      opus: 'audio/opus',

      // 文档类型
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ppt: 'application/vnd.ms-powerpoint',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      txt: 'text/plain',
      csv: 'text/csv',
      json: 'application/json',
      xml: 'application/xml',
      html: 'text/html',
      css: 'text/css',
      js: 'application/javascript',

      // 压缩文件
      zip: 'application/zip',
      rar: 'application/x-rar-compressed',
      '7z': 'application/x-7z-compressed',
      tar: 'application/x-tar',
      gz: 'application/gzip',
    }

    // 转换为小写并查找对应的MIME类型
    const lowerExtension = extension.toLowerCase()
    return mimeTypes[lowerExtension] || 'application/octet-stream'
  }

  /**
   * 执行直传上传流程
   *
   * @param file - 要上传的文件对象
   * @param formData - 额外的表单数据
   * @param options - 上传配置选项
   * @param presignedData - 预签名数据
   * @param mimeType - 文件MIME类型
   */
  const executeDirectUpload = async (
    file: UploadFileItem,
    formData: Record<string, any>,
    options: any,
    presignedData: PresignedUrlVo,
    mimeType: string,
  ) => {
    const { onSuccess, onError, onProgress } = options

    // 2. 获取文件信息
    let fileData: ArrayBuffer
    let fileSize = 0

    // 读取文件数据
    const fileInfo = await new Promise<{ data: ArrayBuffer; size: number }>((resolve, reject) => {
      // #ifdef H5
      // H5环境下，从文件路径读取文件
      fetch(file.url)
        .then((response) => response.arrayBuffer())
        .then((data) => {
          resolve({ data, size: data.byteLength })
        })
        .catch(reject)
      // #endif

      // #ifndef H5
      // 小程序环境下，使用文件系统API读取文件
      uni.getFileSystemManager().readFile({
        filePath: file.url,
        success: (res) => {
          const data = res.data as ArrayBuffer
          resolve({ data, size: data.byteLength })
        },
        fail: reject,
      })
      // #endif
    })

    // eslint-disable-next-line prefer-const
    fileData = fileInfo.data
    fileSize = fileInfo.size

    // 3. 直传到云存储
    await new Promise<void>((resolve, reject) => {
      uni.request({
        url: presignedData.presignedUrl,
        method: 'PUT',
        data: fileData,
        header: {
          // 关键修复：使用与预签名URL生成时相同的Content-Type
          'Content-Type': mimeType,
          // 不添加任何其他可能影响签名的头部
        },
        success: (res) => {
          if (res.statusCode === 200) {
            resolve()
          } else {
            reject(new Error(`直传失败: ${res.statusCode}`))
          }
        },
        fail: (err) => {
          reject(new Error(err.errMsg || '直传失败'))
        },
      })

      // 模拟进度更新（实际应该从uploadTask获取）
      let progress = 0
      const progressTimer = setInterval(() => {
        progress += 10
        if (progress <= 90) {
          onProgress(
            {
              progress,
              totalBytesWritten: (progress * fileSize) / 100,
              totalBytesExpectedToWrite: fileSize,
            } as any,
            file,
          )
        } else {
          clearInterval(progressTimer)
        }
      }, 100)
    })

    // 更新进度到100%
    onProgress(
      {
        progress: 100,
        totalBytesWritten: fileSize,
        totalBytesExpectedToWrite: fileSize,
      } as any,
      file,
    )

    // 4. 确认上传完成
    const uploadResult = await confirmDirectUpload({
      fileName: file.name || getFileName(file.url),
      fileKey: presignedData.fileKey,
      fileUrl: presignedData.fileUrl,
      moduleName: formData.moduleName,
      directoryId: formData.directoryId,
      directoryPath: formData.directoryPath,
      fileSize,
    })

    // 5. 处理上传成功
    const mockResponse = {
      fileName: uploadResult.fileName,
      url: uploadResult.url,
      ossId: uploadResult.ossId,
      updateTime: uploadResult.updateTime,
    }

    onSuccess(mockResponse, file, formData)
  }

  /**
   * 直传上传方法
   *
   * 实现智能直传流程：
   * 1. 获取预签名URL并判断存储类型
   * 2. 如果是本地存储（URL包含/resource/oss/upload），使用默认上传
   * 3. 如果是云存储，执行三步直传流程：
   *    - 获取预签名URL
   *    - 直传到云存储
   *    - 确认上传完成
   *
   * @param file - 要上传的文件对象
   * @param formData - 额外的表单数据
   * @param options - 上传配置选项
   * @returns Promise<void>
   */
  const directUpload: UploadMethod = async (file, formData, options): Promise<void> => {
    const { onSuccess, onError, onProgress } = options

    try {
      // 获取文件扩展名和精确的MIME类型
      const extension = getFileExtension(file.url)
      const mimeType = getMimeType(extension)

      // 1. 获取预签名URL时就指定正确的Content-Type
      const presignedData = await getPresignedUrl({
        fileName: file.name || getFileName(file.url),
        fileType: mimeType, // 使用精确的MIME类型而不是通用类型
        moduleName: formData.moduleName,
        directoryId: formData.directoryId,
        directoryPath: formData.directoryPath,
      })

      // 检查是否是本地存储
      if (presignedData.presignedUrl.includes('/resource/oss/upload')) {
        console.log('检测到本地存储，使用默认上传模式')
        // 本地存储使用默认上传，返回默认上传的结果
        defaultUpload(file, formData, options)
      } else {
        console.log('检测到云存储，执行直传模式')
        // 云存储执行直传流程
        await executeDirectUpload(file, formData, options, presignedData, mimeType)
      }
    } catch (error: any) {
      const errorInfo: UniApp.GeneralCallbackResult = {
        errMsg: error.message || '直传失败',
      }
      onError(errorInfo, file, formData)
    }
  }

  /**
   * 开始上传文件
   *
   * 文件上传的核心方法，提供完整的上传流程控制：
   * - 设置默认配置参数
   * - 更新文件状态为上传中
   * - 封装成功、失败、进度回调
   * - 支持自定义上传方法
   * - 支持直传功能
   * - 自动状态管理和错误处理
   *
   * @param file - 要上传的文件对象
   * @param options - 上传配置选项
   * @returns 上传任务实例或自定义上传方法的返回值
   */
  const startUpload = (file: UploadFileItem, options: UseUploadOptions) => {
    // 解构配置选项，设置默认值
    const {
      uploadMethod, // 自定义上传方法
      formData = {}, // 表单数据，默认空对象
      action, // 上传地址
      name = 'file', // 文件字段名，默认 'file'
      header = {}, // 请求头，默认空对象
      fileType = 'image', // 文件类型，默认 'image'
      statusCode = 200, // 成功状态码，默认 200
      statusKey = 'status', // 状态字段名，默认 'status'
      abortPrevious = false, // 是否自动中断之前的任务，默认 false
      enableDirectUpload = false, // 是否启用直传，默认 false
      moduleName,
      directoryId, // 目录ID
      directoryPath
    } = options

    // 设置文件状态为上传中
    file[statusKey] = UPLOAD_STATUS.LOADING

    // 准备表单数据，包含目录ID
    const uploadFormData = {
      ...formData,
      ...(moduleName && { moduleName }),
      ...(directoryId && { directoryId }),
      ...(directoryPath && { directoryPath }),
    }

    // 构建上传配置对象
    const uploadOptions = {
      action,
      header,
      name,
      fileName: name,
      fileType,
      statusCode,
      abortPrevious,
      enableDirectUpload,
      // 上传成功回调
      onSuccess: (res: UploadResult, file: UploadFileItem, formData: Record<string, any>) => {
        // 确保 originalUrl 始终有值（兜底处理）
        if (!res.originalUrl) {
          res.originalUrl = extractCleanUrl(res.url)
        }
        // 更新文件状态为成功
        file[statusKey] = UPLOAD_STATUS.SUCCESS
        currentTask = null
        // 调用外部成功回调
        options.onSuccess?.(res, file, formData)
      },
      // 上传失败回调
      onError: (
        error: UniApp.GeneralCallbackResult,
        file: UploadFileItem,
        formData: Record<string, any>,
      ) => {
        // 更新文件状态为失败，并记录错误信息
        file[statusKey] = UPLOAD_STATUS.FAIL
        file.error = error.errMsg
        currentTask = null
        // 调用外部失败回调
        options.onError?.(error, file, formData)
      },
      // 上传进度回调
      onProgress: (res: UniApp.OnProgressUpdateResult, file: UploadFileItem) => {
        // 更新上传进度
        file.percent = res.progress
        // 调用外部进度回调
        options.onProgress?.(res, file)
      },
    }

    // 根据配置选择上传方式
    if (enableDirectUpload) {
      // 使用直传上传
      return directUpload(file, uploadFormData, uploadOptions)
    } else if (isFunction(uploadMethod)) {
      // 使用自定义上传方法
      return uploadMethod(file, uploadFormData, uploadOptions)
    } else {
      // 使用默认上传方法
      return defaultUpload(file, uploadFormData, uploadOptions)
    }
  }

  /**
   * 快速上传文件
   *
   * 通过文件路径快速上传文件，自动识别文件类型和设置默认配置：
   * - 自动根据文件扩展名识别文件类型
   * - 使用默认的上传地址和请求头
   * - 自动创建文件对象
   * - 支持自定义配置覆盖默认值
   * - 支持直传功能
   *
   * @param filePath - 文件路径
   * @param options - 快速上传配置选项（可选）
   * @returns 上传任务实例或自定义上传方法的返回值
   *
   * @example
   * ```typescript
   * // 最简单的用法
   * fastUpload('http://tmp/photo.jpg')
   *
   * // 带回调的用法（启用直传）
   * fastUpload('http://tmp/video.mp4', {
   *   enableDirectUpload: true,
   *   directoryId: 123,
   *   onSuccess: (res, file) => console.log('直传成功'),
   *   onError: (err, file) => console.log('直传失败'),
   *   onProgress: (res, file) => console.log(`进度: ${res.progress}%`)
   * })
   *
   * // 自定义配置
   * fastUpload('http://tmp/audio.mp3', {
   *   action: '/api/custom-upload',
   *   formData: { userId: '123' },
   *   header: { 'Authorization': 'Bearer token' },
   *   enableDirectUpload: false
   * })
   * ```
   */
  const fastUpload = (filePath: string, options: FastUploadOptions = {}) => {
    // 创建文件对象
    const file = createFileFromPath(filePath)

    // 获取文件扩展名和类型
    const extension = getFileExtension(filePath)
    const fileType = getFileType(extension)

    // 合并配置选项，使用默认值
    const uploadOptions: UseUploadOptions = {
      action: options.action || DEFAULT_CONFIG.action,
      header: options.header || getAuthHeaders(),
      name: options.name || DEFAULT_CONFIG.name,
      formData: options.formData || {},
      fileType,
      statusCode: options.statusCode || DEFAULT_CONFIG.statusCode,
      statusKey: DEFAULT_CONFIG.statusKey,
      uploadMethod: options.uploadMethod,
      abortPrevious: options.abortPrevious || false,
      enableDirectUpload: options.enableDirectUpload || false,
      moduleName: options.moduleName,
      directoryId: options.directoryId,
      directoryPath: options.directoryPath,
      onSuccess: options.onSuccess || (() => {}),
      onError: options.onError || (() => {}),
      onProgress: options.onProgress || (() => {}),
    }

    // 调用标准上传方法
    return startUpload(file, uploadOptions)
  }

  /**
   * 选择文件
   *
   * 跨平台文件选择功能，根据不同的文件类型调用对应的 uni API：
   * - image: 选择图片
   * - video: 选择视频
   * - media: 选择媒体文件（图片+视频，仅微信小程序）
   * - file: 选择文件（仅微信小程序和H5）
   * - all: 选择所有类型文件
   *
   * 支持多种配置选项：
   * - 单选/多选
   * - 文件数量限制
   * - 文件大小类型
   * - 来源类型（相册/相机）
   * - 文件扩展名过滤
   *
   * @param options - 文件选择配置
   * @returns Promise，解析为选择的文件数组
   */
  const chooseFile = ({
    multiple, // 是否多选
    sizeType, // 图片尺寸类型
    sourceType, // 来源类型
    maxCount, // 最大选择数量
    accept, // 文件类型
    compressed, // 是否压缩
    maxDuration, // 最大时长
    camera, // 摄像头类型
    extension, // 文件扩展名过滤
  }: ChooseFileOption): Promise<ChooseFile[]> => {
    return new Promise((resolve, reject) => {
      // 根据文件类型选择对应的 uni API
      switch (accept) {
        case 'image':
          // 选择图片
          uni.chooseImage({
            count: multiple ? Math.min(maxCount || 9, 9) : 1, // 默认9张，最大9张
            sizeType,
            sourceType,
            // #ifdef H5
            extension, // H5 平台支持文件扩展名过滤
            // #endif
            success: (res) => resolve(formatImage(res)),
            fail: reject,
          })
          break

        case 'video':
          // 选择视频
          uni.chooseVideo({
            sourceType,
            compressed,
            maxDuration,
            camera,
            // #ifdef H5
            extension, // H5 平台支持文件扩展名过滤
            // #endif
            success: (res) => resolve(formatVideo(res)),
            fail: reject,
          })
          break

        case 'media':
          // 选择媒体文件（图片+视频）- 仅微信小程序支持
          // #ifdef MP-WEIXIN
          uni.chooseMedia({
            count: multiple ? Math.min(maxCount || 9, 9) : 1, // 默认9个，最大9个
            sourceType,
            sizeType,
            camera,
            maxDuration,
            success: (res) => resolve(formatMedia(res)),
            fail: reject,
          })
          // #endif
          // #ifndef MP-WEIXIN
          // 非微信小程序环境，降级为选择图片
          console.warn('当前平台不支持 chooseMedia，降级为选择图片')
          uni.chooseImage({
            count: multiple ? Math.min(maxCount || 9, 9) : 1,
            sizeType,
            sourceType,
            // #ifdef H5
            extension,
            // #endif
            success: (res) => resolve(formatImage(res)),
            fail: reject,
          })
          // #endif
          break

        case 'file':
          // 选择文件 - 仅微信小程序和H5支持
          // #ifdef MP-WEIXIN
          uni.chooseMessageFile({
            count: multiple ? Math.min(maxCount || 100, 100) : 1,
            type: 'file',
            extension,
            success: (res) => {
              // 确保 tempFiles 是数组类型
              const files = Array.isArray(res.tempFiles) ? res.tempFiles : [res.tempFiles]
              resolve(
                files.map((file) => ({
                  path: file.path,
                  name: file.name,
                  size: file.size,
                  type: 'file' as const,
                })),
              )
            },
            fail: reject,
          })
          // #endif
          // #ifdef H5
          uni.chooseFile({
            count: multiple ? Math.min(maxCount || 100, 100) : 1,
            type: 'all',
            extension,
            success: (res) => {
              // 处理 H5 平台的返回结果 - 确保是数组
              const tempFiles = res.tempFiles || []
              const files = Array.isArray(tempFiles) ? tempFiles : [tempFiles]
              resolve(
                files.map((file) => ({
                  path: (file as any).path || '',
                  name: (file as any).name || '',
                  size: (file as any).size || 0,
                  type: 'file' as const,
                })),
              )
            },
            fail: reject,
          })
          // #endif
          // #ifndef MP-WEIXIN
          // #ifndef H5
          // 不支持的平台，提示错误
          reject(new Error('当前平台不支持文件选择功能，请使用微信小程序或H5版本'))
          // #endif
          // #endif
          break

        case 'all':
          // 选择所有类型文件
          // #ifdef H5
          // H5 平台使用 chooseFile
          uni.chooseFile({
            count: multiple ? Math.min(maxCount || 100, 100) : 1,
            type: 'all',
            extension,
            success: (res) => {
              // 确保 tempFiles 是数组类型
              const files = Array.isArray(res.tempFiles) ? res.tempFiles : [res.tempFiles]
              resolve(
                files.map((file) => ({
                  path: (file as any).path || (file as any).tempFilePath || '',
                  name: (file as any).name || '',
                  size: (file as any).size || 0,
                  type: 'file' as const,
                })),
              )
            },
            fail: reject,
          })
          // #endif
          // #ifdef MP-WEIXIN
          // 微信小程序使用 chooseMessageFile
          uni.chooseMessageFile({
            count: multiple ? Math.min(maxCount || 100, 100) : 1,
            type: 'all',
            extension,
            success: (res) => {
              // 确保 tempFiles 是数组类型
              const files = Array.isArray(res.tempFiles) ? res.tempFiles : [res.tempFiles]
              resolve(
                files.map((file) => ({
                  path: file.path,
                  name: file.name,
                  size: file.size,
                  type: 'file' as const,
                })),
              )
            },
            fail: reject,
          })
          // #endif
          // #ifndef MP-WEIXIN
          // #ifndef H5
          // 其他平台降级为选择图片
          console.warn('当前平台不支持选择所有文件类型，降级为选择图片')
          uni.chooseImage({
            count: multiple ? Math.min(maxCount || 9, 9) : 1,
            sizeType,
            sourceType,
            success: (res) => resolve(formatImage(res)),
            fail: reject,
          })
          // #endif
          // #endif
          break

        default:
          // 默认选择图片
          uni.chooseImage({
            count: multiple ? Math.min(maxCount || 9, 9) : 1,
            sizeType,
            sourceType,
            // #ifdef H5
            extension, // H5 平台支持文件扩展名过滤
            // #endif
            success: (res) => resolve(formatImage(res)),
            fail: reject,
          })
          break
      }
    })
  }

  // 返回上传功能的所有方法和属性
  return {
    startUpload, // 开始上传文件
    fastUpload, // 快速上传文件
    abort, // 中断上传任务
    UPLOAD_STATUS, // 上传状态常量
    chooseFile, // 选择文件
  }
}
