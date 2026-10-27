// composables/useHttp.ts
import type { CustomRequestOptions } from '@/types/http'
import { SystemConfig } from '@/systemConfig'
import { getLanguage } from '@/locales/i18n' // 使用重构后的语言获取函数
import {
  decodeBase64,
  decryptWithAes,
  encodeBase64,
  encryptWithAes,
  generateAesKey,
} from '@/utils/crypto'
import { getCurrentPage } from '@/utils/route'
import { rsaDecrypt, rsaEncrypt } from '@/utils/rsa'
import { objectToQuery } from '@/utils/string'
import { getTenantId } from '@/utils/tenant'
import { to } from '@/utils/to'
import { useToast } from '@/wd/components/wd-toast/useToast'
import { waitForInit } from '@/composables/useAppInit'
import { formatDate } from '@/utils/date'

/** HTTP状态码 - 仅定义使用到的 */
const HttpCode = {
  SUCCESS: 200,
  UNAUTHORIZED: 401,
} as const

/** 错误消息 - 仅用于前端固定场景 */
const ErrorMsg = {
  NETWORK: '网络连接失败，请检查网络',
  TIMEOUT: '请求超时，请稍后重试',
  REPEAT_SUBMIT: '数据正在处理，请勿重复提交',
  DECRYPT_FAILED: '响应数据解密失败',
  SESSION_EXPIRED: '未登录或登录已过期~',
  REQUEST_CANCELED: '请求已取消',
  INIT_TIMEOUT: '应用初始化超时，请重试',
  UNKNOWN: '网络错误',
} as const

/** 加密请求头名称 */
const ENCRYPT_HEADER = 'encrypt-key'

/** 请求ID请求头名称 */
const REQUEST_ID_HEADER = 'X-Request-Id'

/**
 * 生成请求ID
 * 格式：yyyyMMddHHmmssSSS (年月日时分秒毫秒)
 * 示例：20250925142636001
 * @returns 请求ID
 */
const generateRequestId = (): string => {
  return formatDate(new Date(), 'yyyyMMddHHmmssSSS')
}

/** 防重复提交 - 只存储最后一次提交信息 */
let lastSubmit: { key: string; time: number } | null = null

/** 是否显示重新登录 */
const isReLogin = { show: false }

const toast = useToast()

/**
 * 检查重复提交
 *
 * @param url 请求URL
 * @param data 请求数据
 * @returns 是否允许提交
 */
const checkRepeatSubmit = (url: string, data: any): boolean => {
  const key = `${url}-${JSON.stringify(data)}`
  const now = Date.now()

  // 检查是否是重复提交
  if (lastSubmit && lastSubmit.key === key && now - lastSubmit.time < 500) {
    return false
  }

  // 更新最后一次提交
  lastSubmit = { key, time: now }
  return true
}

/**
 * 处理未授权
 */
const handleUnauthorized = async () => {
  if (isReLogin.show) return

  isReLogin.show = true

  try {
    const userStore = useUserStore()
    await userStore.logoutUser()

    const currentPath = `/${getCurrentPage()?.route}`
    uni.navigateTo({
      url: `/pages/auth/login?redirect=${currentPath}`,
    })
  } finally {
    isReLogin.show = false
  }
}

/**
 * 加密请求数据
 */
const encryptRequestData = (data: any, header: Record<string, any>) => {
  if (!SystemConfig.security?.apiEncrypt || !data) return data

  const aesKey = generateAesKey()
  header[ENCRYPT_HEADER] = rsaEncrypt(encodeBase64(aesKey))

  return typeof data === 'object'
    ? encryptWithAes(JSON.stringify(data), aesKey)
    : encryptWithAes(data, aesKey)
}

/**
 * 解密响应数据
 */
const decryptResponseData = (data: any, header: Record<string, any>): any => {
  if (!SystemConfig.security?.apiEncrypt) return data

  const encryptKey = header[ENCRYPT_HEADER] || header[ENCRYPT_HEADER.toLowerCase()]
  if (!encryptKey) return data

  try {
    const base64Str = rsaDecrypt(encryptKey)
    const aesKey = decodeBase64(base64Str)
    const decryptedData = decryptWithAes(data, aesKey)
    return JSON.parse(decryptedData)
  } catch (error) {
    console.error('[响应解密失败]', error)
    throw new Error(ErrorMsg.DECRYPT_FAILED)
  }
}

/**
 * 判断是否为二进制数据
 */
const isBinaryData = (contentType: string): boolean => {
  return (
    contentType.includes('application/octet-stream') ||
    contentType.includes('application/pdf') ||
    contentType.includes('image/') ||
    contentType.includes('video/') ||
    contentType.includes('audio/')
  )
}

/**
 * 等待应用初始化完成
 *
 * @param config 请求配置
 * @returns Promise<void>
 */
const waitForAppInitialization = async (config?: CustomRequestOptions): Promise<void> => {
  // 如果配置了跳过等待，直接返回
  if (config?.skipWait) {
    return Promise.resolve()
  }

  // 如果请求不需要租户信息，也跳过等待
  if (config?.header?.tenant === false) {
    return Promise.resolve()
  }

  try {
    await waitForInit(config?.initTimeout || 10000)
  } catch (error) {
    throw new Error(ErrorMsg.INIT_TIMEOUT)
  }
}

/**
 * 构建请求选项
 *
 * @param url 请求URL
 * @param method 请求方法
 * @param data 请求数据
 * @param config 请求配置
 * @returns 构建好的请求选项
 */
const buildRequestOptions = (
  url: string,
  method: UniApp.RequestOptions['method'],
  data?: any,
  config?: CustomRequestOptions,
): UniApp.RequestOptions => {
  // 1. 处理 URL
  if (!url.startsWith('http')) {
    url = SystemConfig.api.baseUrl + url
  }

  // 2. 处理查询参数（支持 query 和 params 两种方式）
  const queryParams = config?.query || config?.params
  if (queryParams) {
    const queryStr = objectToQuery(queryParams)
    if (queryStr) {
      url += (url.includes('?') ? '&' : '?') + queryStr
    }
  }

  // 3. GET 请求参数处理
  if (method === 'GET' && data) {
    const queryStr = objectToQuery(data)
    if (queryStr) {
      url += (url.includes('?') ? '&' : '?') + queryStr
    }
    data = undefined
  }

  // 4. 构建请求头
  const header: Record<string, any> = {
    'Content-Type': 'application/json;charset=utf-8',
    'Content-Language': getLanguage(), // 添加国际化语言头
    [REQUEST_ID_HEADER]: generateRequestId(), // 添加请求ID
    ...config?.header,
  }

  // 5. 认证处理
  if (config?.header?.auth !== false) {
    Object.assign(header, useToken().getAuthHeaders())
  }

  // 6. 租户处理（独立处理，不依赖于认证）
  if (config?.header?.tenant !== false) {
    const tenantId = getTenantId()
    if (tenantId) {
      header['X-Tenant-Id'] = tenantId
    }
  }

  // 7. 防重复提交
  if (config?.header?.repeatSubmit !== false && (method === 'POST' || method === 'PUT')) {
    if (!checkRepeatSubmit(url, data)) {
      throw new Error(ErrorMsg.REPEAT_SUBMIT)
    }
  }

  // 8. 加密处理
  if (
    SystemConfig.security?.apiEncrypt &&
    config?.header?.isEncrypt &&
    (method === 'POST' || method === 'PUT')
  ) {
    data = encryptRequestData(data, header)
  }

  return {
    url,
    method,
    data,
    ...config,
    header,
    timeout: config?.timeout || 50000,
  }
}

/**
 * 处理响应
 */
const handleResponse = <T>(
  response: UniApp.RequestSuccessCallbackResult,
  config?: CustomRequestOptions,
): T => {
  const header = response.header || {}
  // 1. 解密处理
  let data = response.data
  if (typeof data === 'string' && header[ENCRYPT_HEADER]) {
    data = decryptResponseData(data, header)
  }

  // 2. 二进制数据直接返回原始响应
  const contentType = header['content-type'] || header['Content-Type'] || ''
  if (isBinaryData(contentType)) {
    return response as T
  }

  // 3. 处理业务响应
  const apiResponse = data as R<any>
  const code = apiResponse?.code || HttpCode.SUCCESS
  const msg = apiResponse?.msg || ''
  const responseData = apiResponse?.data

  // 4. 根据状态码处理
  if (code === HttpCode.SUCCESS) {
    return responseData as T
  }

  if (code === HttpCode.UNAUTHORIZED) {
    handleUnauthorized()
    toast.error(ErrorMsg.SESSION_EXPIRED)
    throw new Error(ErrorMsg.SESSION_EXPIRED)
  }

  // 其他错误直接使用后端返回的消息
  toast.error(msg || ErrorMsg.UNKNOWN)
  throw new Error(msg || ErrorMsg.UNKNOWN)
}

/**
 * 处理错误
 */
const handleError = (error: any, config?: CustomRequestOptions): never => {
  let message = error.errMsg || error.message || ErrorMsg.UNKNOWN

  console.error('[HTTP 错误]', error)

  // 网络层面的错误信息处理
  if (message.includes('timeout')) {
    message = ErrorMsg.TIMEOUT
  } else if (message.includes('fail')) {
    message = ErrorMsg.NETWORK
  } else if (message.includes('abort')) {
    message = ErrorMsg.REQUEST_CANCELED
  } else if (message.includes('重复提交')) {
    message = error.message
  } else if (message.includes('初始化超时')) {
    message = ErrorMsg.INIT_TIMEOUT
  }
  // toast.error(message)
  throw new Error(message)
}

/**
 * 基础请求函数
 *
 * 请求流程：
 * 1. 等待应用初始化完成（确保租户ID已设置）
 * 2. 构建请求选项（URL处理、请求头设置、参数处理等）
 * 3. 发送请求
 * 4. 处理响应（解密、业务逻辑处理、错误处理等）
 *
 * @param url 请求URL
 * @param method 请求方法
 * @param data 请求数据
 * @param config 请求配置
 * @returns Promise<T> 响应数据
 */
const request = async <T = any>(
  url: string,
  method: UniApp.RequestOptions['method'],
  data?: any,
  config?: CustomRequestOptions,
): Promise<T> => {
  // 1. 等待应用初始化完成
  await waitForAppInitialization(config)

  return new Promise((resolve, reject) => {
    try {
      const options = buildRequestOptions(url, method, data, config)
      uni.request({
        ...options,
        success: (response) => {
          try {
            const result = handleResponse<T>(response, config)
            resolve(result)
          } catch (error) {
            reject(error)
          }
        },
        fail: (error) => {
          try {
            handleError(error, config)
          } catch (err) {
            reject(err)
          }
        },
      })
    } catch (error) {
      handleError(error, config)
    }
  })
}

/**
 * HTTP 请求服务
 *
 * 将请求拦截、响应处理、业务逻辑集中管理，使用组合函数模式。
 * 自动在请求头中添加当前语言信息。
 * 支持链式调用配置：http.noAuth().encrypt().skipWait().post(...)
 *
 * @author 抓蛙师
 * @since 2025-05-30
 */
export const useHttp = (defaultConfig?: CustomRequestOptions) => {
  // 临时配置（用于链式调用）
  let chainConfig: CustomRequestOptions = {}

  // 合并配置
  const mergeConfig = (config?: CustomRequestOptions): CustomRequestOptions => {
    const merged = {
      ...defaultConfig,
      ...chainConfig,
      ...config,
      header: {
        ...defaultConfig?.header,
        ...chainConfig?.header,
        ...config?.header,
      },
    }
    // 重置链式配置
    chainConfig = {}
    return merged
  }

  /**
   * GET 请求
   * @example
   * const [err, data] = await http.get<User[]>('/api/users');
   * if (!err) {
   *   console.log(data);
   * }
   */
  const get = <T = any>(url: string, params?: any, config?: CustomRequestOptions): Result<T> => {
    return to(request<T>(url, 'GET', params, mergeConfig(config)))
  }

  /**
   * POST 请求
   * @example
   * const [err, user] = await http.post<User>('/api/users', userData);
   * if (!err) {
   *   console.log(user);
   * }
   */
  const post = <T = any>(url: string, data?: any, config?: CustomRequestOptions): Result<T> => {
    return to(request<T>(url, 'POST', data, mergeConfig(config)))
  }

  /**
   * PUT 请求
   * @example
   * const [err, user] = await http.put<User>('/api/users/123', updatedData);
   * if (!err) {
   *   console.log(user);
   * }
   */
  const put = <T = any>(url: string, data?: any, config?: CustomRequestOptions): Result<T> => {
    return to(request<T>(url, 'PUT', data, mergeConfig(config)))
  }

  /**
   * DELETE 请求
   * @example
   * const [err, result] = await http.del<void>('/api/users/123');
   * if (!err) {
   *   console.log('删除成功');
   * }
   */
  const del = <T = any>(url: string, params?: any, config?: CustomRequestOptions): Result<T> => {
    return to(request<T>(url, 'DELETE', params, mergeConfig(config)))
  }

  /**
   * 上传文件
   * @example
   * const [err, result] = await http.upload<UploadResult>({
   *   url: '/api/upload',
   *   filePath: tempFilePath,
   *   name: 'file',
   *   formData: { type: 'avatar' }
   * });
   */
  const upload = async <T = any>(
    uploadConfig: UniApp.UploadFileOption & CustomRequestOptions,
  ): Result<T> => {
    return new Promise((resolve) => {
      try {
        const baseUrl = SystemConfig.api.baseUrl

        // 处理 URL
        if (!uploadConfig.url.startsWith('http')) {
          uploadConfig.url = baseUrl + uploadConfig.url
        }

        // 处理请求头
        const header: Record<string, any> = {
          'Content-Language': getLanguage(), // 添加国际化语言头
          ...defaultConfig?.header,
          ...uploadConfig.header,
        }

        if (uploadConfig?.header?.auth !== false) {
          Object.assign(header, useToken().getAuthHeaders())
        }

        const task = uni.uploadFile({
          ...uploadConfig,
          header,
          timeout: uploadConfig.timeout || 50000,
          success: (res) => {
            try {
              const data = JSON.parse(res.data)
              const result = handleResponse<T>({ ...res, data } as any, uploadConfig)
              resolve([null, result])
            } catch (error) {
              resolve([error as Error, null])
            }
          },
          fail: (error) => {
            try {
              handleError(error, uploadConfig)
            } catch (err) {
              resolve([err as Error, null])
            }
          },
        })

        // 监听上传进度
        // if (uploadConfig.onProgressUpdate) {
        //   task.onProgressUpdate(uploadConfig.onProgressUpdate);
        // }
      } catch (error) {
        resolve([error as Error, null])
      }
    })
  }

  /**
   * 下载文件
   * @example
   * const [err, result] = await http.download({
   *   url: '/api/download/file.pdf',
   *   filePath: `${wx.env.USER_DATA_PATH}/file.pdf`
   * });
   */
  const download = async (
    downloadConfig: UniApp.DownloadFileOption & CustomRequestOptions,
  ): Result<UniApp.DownloadSuccessData> => {
    return new Promise((resolve) => {
      try {
        const baseUrl = SystemConfig.api.baseUrl

        // 处理 URL
        if (!downloadConfig.url.startsWith('http')) {
          downloadConfig.url = baseUrl + downloadConfig.url
        }

        // 处理请求头
        const header: Record<string, any> = {
          'Content-Language': getLanguage(), // 添加国际化语言头
          ...defaultConfig?.header,
          ...downloadConfig.header,
        }

        if (downloadConfig?.header.auth !== false) {
          Object.assign(header, useToken().getAuthHeaders())
        }

        const task = uni.downloadFile({
          ...downloadConfig,
          header,
          timeout: downloadConfig.timeout || 50000,
          success: (res) => {
            if (res.statusCode === 200) {
              resolve([null, res])
            } else {
              resolve([new Error(`下载失败: ${res.statusCode}`), null])
            }
          },
          fail: (error) => {
            resolve([new Error(error.errMsg || '下载失败'), null])
          },
        })

        // 监听下载进度
        // if (downloadConfig.onProgressUpdate) {
        //   task.onProgressUpdate(downloadConfig.onProgressUpdate);
        // }
      } catch (error) {
        resolve([error as Error, null])
      }
    })
  }

  /**
   * 链式调用：通用配置方法
   * @example http.config({ auth: false, timeout: 20000 }).post(...)
   */
  const config = (cfg: CustomRequestOptions) => {
    chainConfig = { ...chainConfig, ...cfg, header: { ...chainConfig.header, ...cfg.header } }
    return httpInstance
  }

  /**
   * 链式调用：禁用认证
   * @example http.noAuth().post(...)
   */
  const noAuth = () => {
    chainConfig.header = { ...chainConfig.header, auth: false }
    return httpInstance
  }

  /**
   * 链式调用：启用加密
   * @example http.encrypt().post(...)
   */
  const encrypt = () => {
    chainConfig.header = { ...chainConfig.header, isEncrypt: true }
    return httpInstance
  }

  /**
   * 链式调用：禁用防重复提交
   * @example http.noRepeatSubmit().post(...)
   */
  const noRepeatSubmit = () => {
    chainConfig.header = { ...chainConfig.header, repeatSubmit: false }
    return httpInstance
  }

  /**
   * 链式调用：禁用租户信息
   * @example http.noTenant().post(...)
   */
  const noTenant = () => {
    chainConfig.header = { ...chainConfig.header, tenant: false }
    return httpInstance
  }

  /**
   * 链式调用：跳过初始化等待
   * @example http.skipWait().post(...)
   */
  const skipWait = () => {
    chainConfig.skipWait = true
    return httpInstance
  }

  /**
   * 链式调用：设置超时时间
   * @example http.timeout(20000).post(...)
   */
  const timeout = (ms: number) => {
    chainConfig.timeout = ms
    return httpInstance
  }

  const httpInstance = {
    get,
    post,
    put,
    del,
    upload,
    download,
    request: <T = any>(
      config: CustomRequestOptions & {
        url: string
        method: UniApp.RequestOptions['method']
      },
    ) => to(request<T>(config.url, config.method, config.data, mergeConfig(config))),
    // 链式调用方法
    config,
    noAuth,
    encrypt,
    noRepeatSubmit,
    noTenant,
    skipWait,
    timeout,
  }

  return httpInstance
}

// 创建默认实例
export const http = useHttp()

/**
 * 使用示例：
 *
 * // 1. 使用默认实例 - 直接返回数据
 * const [err, users] = await http.get<User[]>('/api/users');
 * if (!err) {
 *   console.log(users); // User[] 类型的数据，直接使用
 * }
 *
 * // 2. 创建自定义实例
 * const authHttp = useHttp({ auth: true });
 * const [err, userInfo] = await authHttp.get<UserInfo>('/api/profile');
 *
 * // 3. 加密请求（传统方式）
 * const [err, token] = await http.post<LoginResult>('/api/login', data, {
 *   header: { isEncrypt: true }
 * });
 *
 * // 4. 链式调用：禁用认证 + 加密 + 跳过等待
 * const [err2, token2] = await http.noAuth().encrypt().skipWait().post<LoginResult>('/api/login', data);
 *
 * // 5. 链式调用：设置超时
 * const [err3, captcha] = await http.noAuth().timeout(20000).get<CaptchaVo>('/auth/imgCode');
 *
 * // 6. 链式调用：通用配置
 * const [err4, data4] = await http.config({
 *   header: { auth: false, isEncrypt: true },
 *   timeout: 20000
 * }).post<any>('/api/data', payload);
 *
 * // 7. 链式调用：多个配置组合
 * const [err5, result] = await http.noAuth().encrypt().noRepeatSubmit().skipWait().timeout(30000)
 *   .post<any>('/api/register', registerData);
 *
 * // 8. 使用 withHeaders 辅助函数（兼容旧方式）
 * const [err6, data6] = await http.post<any>(
 *   '/api/data',
 *   payload,
 *   withHeaders({ 'X-Custom': 'value' , auth: false })
 * );
 *
 * // 9. 不需要认证的请求
 * const publicHttp = useHttp({ header: { auth: false } });
 * const [err7, info] = await publicHttp.get<PublicInfo>('/api/public/info');
 *
 * // 10. 上传文件
 * const [err8, uploadResult] = await http.upload<UploadResult>({
 *   url: '/api/upload',
 *   filePath: tempFilePath,
 *   name: 'file',
 *   formData: { type: 'avatar' }
 * });
 *
 * // 11. void 类型的请求
 * const [err9] = await http.del<void>('/api/users/123');
 * if (!err9) {
 *   console.log('删除成功');
 * }
 */
