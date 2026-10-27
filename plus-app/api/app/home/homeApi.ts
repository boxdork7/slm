// 首页 API
import type { AdQuery, AdVo, GoodsQuery, GoodsVo } from './homeTypes'
import { withHeaders } from '@/utils/function'

/**
 * 根据appid获取租户id
 * @param appid appid
 * @returns 租户id
 */
export const getTenantIdByAppid = (appid?: string): Result<string> => {
  return http.get<string>(
    `/app/home/getTenantIdByAppid?appid=${appid}`,
    {},
    withHeaders({ auth: false }, { skipWait: true }),
  )
}

/**
 * 查询广告配置列表
 * @param query 查询参数
 * @returns {AdVo[]} 结果
 */
export const listAds = (query?: AdQuery): Result<AdVo[]> => {
  return http.get<AdVo[]>('/app/home/listAds', query)
}

/**
 * 查询商品列表
 * @param query 查询参数
 * @returns {Result<PageResult<GoodsVo>>} 结果
 */
export const pageGoods = (query?: GoodsQuery): Result<PageResult<GoodsVo>> => {
  return http.get<PageResult<GoodsVo>>('/app/home/pageGoods', query)
}
