import type { AdQuery, AdVo } from './adTypes'

/**
 * 查询广告配置列表
 * @param query 查询参数
 * @returns {AdVo[]} 结果
 */
export const listAds = (query?: AdQuery): Result<AdVo[]> => {
  return http.get<AdVo[]>('/app/home/listAds', query)
}
