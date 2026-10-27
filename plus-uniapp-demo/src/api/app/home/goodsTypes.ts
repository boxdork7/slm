/** 商品查询类型 */
export interface GoodsQuery extends PageQuery {
  /** 商品ID */
  id?: string | number

  /** 商品分类 */
  category?: string

  /** 商品编码 */
  code?: string

  /** 商品名称 */
  name?: string

  /** 商品图片 */
  img?: string

  /** 原价 */
  originalPrice?: string

  /** 折扣 */
  discount?: string

  /** 价格 */
  price?: string

  /** 商品描述 */
  description?: string

  /** 库存 */
  stock?: number

  /** 销量 */
  salesCount?: number

  /** 状态 */
  status?: string

  /** 排序 */
  sortOrder?: number

  /** 创建时间 */
  createTime?: string

}

/** 商品表单类型 */
export interface GoodsBo {
  /** 商品ID */
  id?: string | number

  /** 商品分类 */
  category?: string

  /** 商品编码 */
  code?: string

  /** 商品名称 */
  name?: string

  /** 商品图片 */
  img?: string

  /** 原价 */
  originalPrice?: string

  /** 折扣 */
  discount?: string

  /** 价格 */
  price?: string

  /** 商品描述 */
  description?: string

  /** 库存 */
  stock?: number

  /** 销量 */
  salesCount?: number

  /** 状态 */
  status?: string

  /** 排序 */
  sortOrder?: number

  /** 备注 */
  remark?: string

}

/** 商品视图类型 */
export interface GoodsVo {
  /** 商品ID */
  id: string | number

  /** 商品分类 */
  category: string

  /** 商品编码 */
  code: string

  /** 商品名称 */
  name: string

  /** 商品图片 */
  img: string

  /** 原价 */
  originalPrice: string

  /** 折扣 */
  discount: string

  /** 价格 */
  price: string

  /** 商品描述 */
  description: string

  /** 库存 */
  stock: number

  /** 销量 */
  salesCount: number

  /** 状态 */
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
