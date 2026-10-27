// 文件管理 API
import type { SysOssVo } from './ossTypes'

/**
 * 查询OSS对象基于id串
 * @param ossIds 对象存储ID数组（字符串格式，避免雪花ID精度丢失）
 * @returns {Result<SysOssVo[]>} 结果
 */
export const listOssByIds = (ossIds: Array<string>): Result<SysOssVo[]> => {
  return http.get<SysOssVo[]>(`/resource/oss/listOssByIds/${ossIds.join(',')}`)
}
