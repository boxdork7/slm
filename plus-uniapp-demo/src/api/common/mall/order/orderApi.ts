import type {
  OrderQuery,
  OrderVo,
  CreateOrderBo,
  CreateOrderVo,
  OrderStatusVo,
  PaymentRequest,
  PaymentResponse,
  PaymentMethod,
} from './orderTypes'
import { withHeaders } from '@/utils/function'

/**
 * 获取支持的支付方式
 */
export const getSupportedPaymentMethods = (): Result<PaymentMethod[]> => {
  return http.get<PaymentMethod[]>(
    '/common/mall/order/supportedPaymentMethods',
    {},
    withHeaders({ auth: false }),
  )
}

/**
 * 创建订单
 * @param data 订单信息
 * @returns {Result<CreateOrderVo>} 结果
 */
export const createOrder = (data: CreateOrderBo): Result<CreateOrderVo> => {
  return http.post<CreateOrderVo>(`/common/mall/order/createOrder`, data)
}

/**
 * 统一支付接口
 * @param data 支付请求数据
 * @returns {Result<PaymentResponse>} 结果
 */
export const createPayment = (data: PaymentRequest): Result<PaymentResponse> => {
  return http.post<PaymentResponse>(`/common/mall/order/createPayment`, data)
}

/**
 * 查询订单状态
 * @param orderNo 订单号
 * @returns {Result<OrderStatusVo>} 结果
 */
export const queryOrderStatus = (orderNo: string): Result<OrderStatusVo> => {
  return http.get<OrderStatusVo>(`/common/mall/order/queryOrderStatus`, {
    orderNo,
  })
}

/**
 * 根据订单号获取订单信息
 * @param orderNo 订单号
 * @returns {Result<OrderVo>} 结果
 */
export const getOrderByOrderNo = (orderNo: string): Result<OrderVo> => {
  return http.get<OrderVo>(`/common/mall/order/getOrderByOrderNo`, {
    params: { orderNo },
  })
}

/**
 * 查询订单列表（用户端）
 * @param query 查询参数
 * @returns {Result<PageResult<OrderVo>>} 结果
 */
export const getUserOrderList = (query?: OrderQuery): Result<PageResult<OrderVo>> => {
  return http.get<PageResult<OrderVo>>('/common/mall/order/pageOrders', query)
}
