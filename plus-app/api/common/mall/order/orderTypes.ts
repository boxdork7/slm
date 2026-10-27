/** 支付方式枚举 */
export enum PaymentMethod {
  WECHAT = 'wechat',
  ALIPAY = 'alipay',
  BALANCE = 'balance',
}

/** 支付状态枚举 */
export enum PaymentStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

/** 交易类型枚举 */
export enum TradeType {
  // 微信支付类型
  JSAPI = 'JSAPI',
  NATIVE = 'NATIVE',
  APP = 'APP',
  H5 = 'H5',

  // 支付宝支付类型
  WAP = 'WAP',
  PAGE = 'PAGE',
}

/** 订单查询类型 */
export interface OrderQuery extends PageQuery {
  /** 订单ID */
  id?: string | number

  /** 订单编号 */
  orderNo?: string

  /** 用户ID */
  userId?: string | number

  /** 商品ID */
  goodsId?: string | number

  /** 商品名称 */
  goodsName?: string

  /** 商品图片 */
  goodsImg?: string

  /** 商品价格 */
  price?: string

  /** 购买数量 */
  quantity?: number

  /** 订单总金额 */
  totalAmount?: string

  /** 实付金额 */
  actualAmount?: string

  /** 订单状态 */
  orderStatus?: string

  /** 支付方式 */
  paymentMethod?: string

  /** 支付时间 */
  paymentTime?: string

  /** 交易流水号 */
  transactionId?: string | number

  /** 买家备注 */
  buyerRemark?: string

  /** 订单扩展信息 */
  orderExtInfo?: string

  /** 收货信息 */
  receiverInfo?: string

  /** 物流信息 */
  shippingInfo?: string

  /** 创建时间 */
  createTime?: string
}

/** 订单表单类型 */
export interface OrderBo {
  /** 订单ID */
  id?: string | number

  /** 订单编号 */
  orderNo?: string

  /** 用户ID */
  userId?: string | number

  /** 商品ID */
  goodsId?: string | number

  /** 商品名称 */
  goodsName?: string

  /** 商品图片 */
  goodsImg?: string

  /** 商品价格 */
  price?: string

  /** 购买数量 */
  quantity?: number

  /** 订单总金额 */
  totalAmount?: string

  /** 实付金额 */
  actualAmount?: string

  /** 订单状态 */
  orderStatus?: string

  /** 支付方式 */
  paymentMethod?: string

  /** 支付时间 */
  paymentTime?: string

  /** 交易流水号 */
  transactionId?: string | number

  /** 买家备注 */
  buyerRemark?: string

  /** 订单扩展信息 */
  orderExtInfo?: string

  /** 收货信息 */
  receiverInfo?: string

  /** 物流信息 */
  shippingInfo?: string

  /** 备注 */
  remark?: string
}

/** 订单视图类型 */
export interface OrderVo {
  /** 订单ID */
  id: string | number

  /** 订单编号 */
  orderNo: string

  /** 用户ID */
  userId: string | number

  /** 商品ID */
  goodsId: string | number

  /** 商品名称 */
  goodsName: string

  /** 商品图片 */
  goodsImg: string

  /** 商品价格 */
  price: string

  /** 购买数量 */
  quantity: number

  /** 订单总金额 */
  totalAmount: string

  /** 实付金额 */
  actualAmount: string

  /** 订单状态 */
  orderStatus: string

  /** 支付方式 */
  paymentMethod: string

  /** 支付时间 */
  paymentTime: string

  /** 交易流水号 */
  transactionId: string | number

  /** 买家备注 */
  buyerRemark: string

  /** 订单扩展信息 */
  orderExtInfo: string

  /** 收货信息 */
  receiverInfo: string

  /** 物流信息 */
  shippingInfo: string

  /** 创建时间 */
  createTime: string

  /** 更新时间 */
  updateTime: string

  /** 备注 */
  remark: string
}

/** 创建订单请求类型 */
export interface CreateOrderBo {
  /** 商品ID */
  goodsId: string | number
  /** 商品名称 */
  goodsName?: string
  /** 商品图片 */
  goodsImg?: string
  /** 商品价格 */
  price: string | number
  /** 购买数量 */
  quantity: number
  /** 买家备注 */
  buyerRemark?: string
  /** 备注 */
  remark?: string
}

/** 创建订单响应类型 */
export interface CreateOrderVo {
  /** 订单ID */
  id: string | number
  /** 订单编号 */
  orderNo: string
  /** 商品ID */
  goodsId: string | number
  /** 商品名称 */
  goodsName: string
  /** 商品图片 */
  goodsImg?: string
  /** 商品价格 */
  price: string | number
  /** 购买数量 */
  quantity: number
  /** 订单总金额 */
  totalAmount: number
  /** 订单状态 */
  orderStatus: string
  /** 订单状态名称 */
  orderStatusName: string
  /** 买家备注 */
  buyerRemark?: string
  /** 创建时间 */
  createTime: string
}

/** 订单状态查询响应 */
export interface OrderStatusVo {
  /** 订单编号 */
  orderNo: string
  /** 订单状态 */
  orderStatus: string
  /** 订单状态名称 */
  orderStatusName: string
  /** 支付时间 */
  paymentTime?: string
  /** 是否已支付 */
  isPaid: boolean
}

/** 支付请求类型 */
export interface PaymentRequest {
  /** 订单编号 */
  orderNo: string
  /** 支付方式 */
  paymentMethod: 'wechat' | 'alipay' | 'balance'
  /** 应用ID */
  appId?: string
  /** 交易类型 */
  tradeType?: TradeType
  /** 微信openId */
  openId?: string
  /** 支付密码 */
  payPassword?: string
  /** 返回地址 */
  returnUrl?: string
}

/** 支付响应类型 */
export interface PaymentResponse {
  /** 是否成功 */
  success: boolean
  /** 响应消息 */
  message: string
  /** 错误码 */
  errorCode?: string
  /** 商户订单号 */
  outTradeNo: string
  /** 原始订单号 */
  orderNo: string
  /** 支付方式 */
  paymentMethod: string
  /** 支付金额 */
  totalAmount: number
  /** 第三方交易号 */
  transactionId?: string
  /** 预支付ID */
  prepayId?: string
  /** 支付参数 */
  payInfo?: Record<string, string>
  /** 二维码链接 */
  codeUrl?: string
  /** 二维码Base64 */
  qrCodeBase64?: string
  /** 支付链接 */
  payUrl?: string
  /** 支付表单 */
  payForm?: string
  /** 支付状态 */
  tradeState?: string
  /** 支付时间 */
  payTime?: string
  /** 过期时间 */
  expireTime?: string
}
