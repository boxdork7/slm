/** 商品SKU查询类型 */
export interface GoodsSkuQuery extends PageQuery {
  /** SKU ID */
  id?: string | number

  /** 商品ID */
  goodsId?: string | number

  /** SKU编码 */
  skuCode?: string

  /** SKU名称 */
  skuName?: string

  /** 规格值JSON */
  specValues?: string

  /** 原价 */
  originalPrice?: string

  /** 价格 */
  price?: string

  /** 库存 */
  stock?: number

  /** 销量 */
  salesCount?: number

  /** 状态 (0停用 1启用) */
  status?: string

  /** 排序 */
  sortOrder?: number

  /** 创建时间 */
  createTime?: string
}

/** 商品SKU表单类型 */
export interface GoodsSkuBo {
  /** SKU ID */
  id?: string | number

  /** 商品ID */
  goodsId?: string | number

  /** SKU编码 */
  skuCode?: string

  /** SKU名称 */
  skuName?: string

  /** 规格值JSON(如:{"颜色":"红色","尺码":"S"}) */
  specValues?: string

  /** 原价 */
  originalPrice?: string

  /** 价格 */
  price?: string

  /** 库存 */
  stock?: number

  /** 销量 */
  salesCount?: number

  /** SKU图片 */
  img?: string

  /** 状态 (0停用 1启用) */
  status?: string

  /** 排序 */
  sortOrder?: number

  /** 备注 */
  remark?: string
}

/** 商品SKU视图类型 */
export interface GoodsSkuVo {
  /** SKU ID */
  id: string | number

  /** 商品ID */
  goodsId: string | number

  /** SKU编码 */
  skuCode: string

  /** SKU名称 */
  skuName: string

  /** 规格值JSON */
  specValues: string

  /** 原价 */
  originalPrice: string

  /** 价格 */
  price: string

  /** 库存 */
  stock: number

  /** 销量 */
  salesCount: number

  /** SKU图片 */
  img: string

  /** 状态 (0停用 1启用) */
  status: string

  /** 排序 */
  sortOrder: number

  /** 创建时间 */
  createTime: string

  /** 更新时间 */
  updateTime: string

  /** 备注 */
  remark: string
}
