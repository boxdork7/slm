import type { GoodsQuery, GoodsVo } from './goodsTypes'

/**
 * 查询商品列表
 * @param query 查询参数
 * @returns {Result<PageResult<GoodsVo>>} 结果
 */
export const pageGoods = (query?: GoodsQuery): Result<PageResult<GoodsVo>> => {
  return http.get<PageResult<GoodsVo>>('/app/home/pageGoods', query)
}
