// 支付
import type {
  PaymentRequest,
  PaymentResponse,
  CreateOrderBo,
  OrderStatusVo,
} from '@/api/common/mall/order/orderTypes'
import { ref, readonly } from 'vue'
import {
  createOrder,
  createPayment,
  queryOrderStatus,
  getSupportedPaymentMethods as getPaymentMethodsApi,
} from '@/api/common/mall/order/orderApi'
import { PaymentMethod, TradeType } from '@/api/common/mall/order/orderTypes'

import { toWithRetry } from '@/utils/to'
import { useToast, useMessage } from '@/wd'

const toast = useToast()
const message = useMessage()

/**
 * 检查当前平台是否支持微信支付
 */
const isWechatPaySupported = (): boolean => {
  return true // APP支持微信支付
}

/**
 * 检查当前平台是否支持支付宝支付
 */
const isAlipayPaySupported = (): boolean => {
  return true // APP支持支付宝支付
}

/**
 * 检查当前平台是否支持余额支付
 */
const isBalancePaySupported = (): boolean => {
  return true // 所有平台都支持余额支付
}

/**
 * 微信APP支付
 */
const callWechatAppPay = async (paymentResponse: PaymentResponse): Promise<boolean> => {
  return new Promise((resolve) => {
    console.log('开始微信APP支付')

    if (!paymentResponse.payInfo) {
      resolve(false)
      return
    }

    const payInfo = paymentResponse.payInfo

    uni.requestPayment({
      provider: 'wxpay',
      orderInfo: {
        appid: payInfo.appId,
        noncestr: payInfo.nonceStr,
        package: payInfo.package,
        partnerid: payInfo.partnerid,
        prepayid: payInfo.prepayid,
        timestamp: payInfo.timeStamp,
        sign: payInfo.paySign,
      },
      success: (res) => {
        console.log('微信APP支付成功:', res)
        toast.success('支付成功')
        resolve(true)
      },
      fail: (err) => {
        console.error('微信APP支付失败:', err)
        toast.error('支付失败')
        resolve(false)
      },
    })
  })
}

/**
 * 支付宝APP支付
 */
const callAlipayAppPay = async (paymentResponse: PaymentResponse): Promise<boolean> => {
  return new Promise((resolve) => {
    uni.requestPayment({
      provider: 'alipay',
      orderInfo: paymentResponse.payForm || paymentResponse.payUrl!,
      success: (res) => {
        console.log('支付宝APP支付成功:', res)
        toast.success('支付成功')
        resolve(true)
      },
      fail: (err) => {
        console.error('支付宝APP支付失败:', err)
        toast.error('支付失败')
        resolve(false)
      },
    })
  })
}

/**
 * 支付组合函数
 */
export const usePayment = (options = {}) => {
  // 响应式状态
  const loading = ref(false)
  const availableMethods = ref<PaymentMethod[]>([])

  /**
   * 获取可用的支付方式 - 根据平台特性过滤
   */
  const fetchAvailableMethods = async (): Promise<[Error | null, PaymentMethod[] | null]> => {
    const [err, data] = await getPaymentMethodsApi()
    if (!err && data) {
      // APP支持所有支付方式
      const filteredMethods = data.filter((method) => {
        switch (method) {
          case PaymentMethod.WECHAT:
            return isWechatPaySupported()
          case PaymentMethod.ALIPAY:
            return isAlipayPaySupported()
          case PaymentMethod.BALANCE:
            return isBalancePaySupported()
          default:
            return false
        }
      })

      availableMethods.value = filteredMethods
      return [null, filteredMethods]
    }

    console.error('获取支付方式失败:', err)
    return [err, null]
  }

  /**
   * 根据平台自动选择交易类型
   */
  const getTradeType = (paymentMethod: PaymentMethod): TradeType => {
    if (paymentMethod === PaymentMethod.WECHAT) {
      return TradeType.APP
    } else if (paymentMethod === PaymentMethod.ALIPAY) {
      return TradeType.APP
    }
    throw new Error(`不支持的支付方式: ${paymentMethod}`)
  }

  /**
   * 执行支付调用 - 提取公共逻辑
   */
  const executePayment = async (
    paymentMethod: PaymentMethod,
    paymentResult: PaymentResponse,
  ): Promise<boolean> => {
    if (paymentMethod === PaymentMethod.WECHAT) {
      return await callWechatAppPay(paymentResult)
    } else if (paymentMethod === PaymentMethod.ALIPAY) {
      return await callAlipayAppPay(paymentResult)
    } else if (paymentMethod === PaymentMethod.BALANCE) {
      toast.success('余额支付成功')
      return true
    }
    return false
  }

  /**
   * 创建订单并支付
   */
  const createOrderAndPay = async (params: {
    orderData: CreateOrderBo
    paymentMethod: PaymentMethod
    tradeType?: TradeType // 可选，不提供则自动选择
    appId?: string
    openId?: string
    payPassword?: string
    returnUrl?: string
  }): Promise<[Error | null, { orderData: any; paymentData: PaymentResponse } | null]> => {
    const { orderData, paymentMethod, tradeType, appId, openId, payPassword, returnUrl } = params

    loading.value = true

    try {
      // 1. 创建订单
      const [createErr, orderResult] = await createOrder(orderData)
      if (createErr || !orderResult) {
        return [new Error(createErr?.message || '创建订单失败'), null]
      }

      console.log('订单创建成功:', orderResult)

      // 2. 发起支付
      const paymentRequest: PaymentRequest = {
        orderNo: orderResult.orderNo,
        paymentMethod,
        tradeType: tradeType || getTradeType(paymentMethod),
        appId,
        openId,
        payPassword,
        returnUrl,
      }

      const [payErr, paymentResult] = await createPayment(paymentRequest)
      if (payErr || !paymentResult) {
        return [new Error(payErr?.message || '发起支付失败'), null]
      }

      console.log('支付请求成功:', paymentResult)

      if (!paymentResult.success) {
        return [new Error(paymentResult.message || '支付失败'), null]
      }

      // 3. 执行支付调用
      const paymentSuccess = await executePayment(paymentMethod, paymentResult)

      if (paymentSuccess) {
        return [null, { orderData: orderResult, paymentData: paymentResult }]
      } else {
        return [new Error('支付调用失败'), null]
      }
    } catch (error) {
      console.error('创建订单并支付失败:', error)
      return [error instanceof Error ? error : new Error(String(error)), null]
    } finally {
      loading.value = false
    }
  }

  /**
   * 支付已有订单
   */
  const payOrder = async (params: {
    orderNo: string
    paymentMethod: PaymentMethod
    tradeType?: TradeType // 可选，不提供则自动选择
    appId?: string
    openId?: string
    payPassword?: string
    returnUrl?: string
  }): Promise<[Error | null, { paymentData: PaymentResponse } | null]> => {
    const { orderNo, paymentMethod, tradeType, appId, openId, payPassword, returnUrl } = params

    loading.value = true

    try {
      // 发起支付
      const paymentRequest: PaymentRequest = {
        orderNo,
        paymentMethod,
        tradeType: tradeType || getTradeType(paymentMethod),
        appId,
        openId,
        payPassword,
        returnUrl,
      }

      const [payErr, paymentResult] = await createPayment(paymentRequest)
      if (payErr || !paymentResult) {
        return [new Error(payErr?.message || '发起支付失败'), null]
      }

      console.log('支付请求成功:', paymentResult)

      if (!paymentResult.success) {
        return [new Error(paymentResult.message || '支付失败'), null]
      }

      // 执行支付调用
      const paymentSuccess = await executePayment(paymentMethod, paymentResult)

      if (paymentSuccess) {
        return [null, { paymentData: paymentResult }]
      } else {
        return [new Error('支付调用失败'), null]
      }
    } catch (error) {
      console.error('支付失败:', error)
      return [error instanceof Error ? error : new Error(String(error)), null]
    } finally {
      loading.value = false
    }
  }

  /**
   * 轮询查询订单状态
   */
  const pollOrderStatus = async (
    orderNo: string,
    maxRetries: number = 2,
  ): Promise<[Error, [Error, OrderStatusVo]]> => {
    console.log(`开始轮询订单状态: ${orderNo}，最多重试 ${maxRetries} 次`)

    return await toWithRetry(
      () => queryOrderStatus(orderNo),
      maxRetries,
      2000, // 2秒间隔
    )
  }

  /**
   * 获取当前平台信息
   */
  const getPlatformInfo = () => {
    return {
      platform: 'app',
      supportsWechatPay: isWechatPaySupported(),
      supportsAlipayPay: isAlipayPaySupported(),
      supportsBalancePay: isBalancePaySupported(),
      recommendedTradeTypes: {
        wechat: getTradeType(PaymentMethod.WECHAT),
        alipay: getTradeType(PaymentMethod.ALIPAY),
      },
    }
  }

  // 初始化时获取可用的支付方式
  fetchAvailableMethods()

  return {
    // 状态
    loading: readonly(loading),
    availableMethods: readonly(availableMethods),

    // 核心支付方法
    createOrderAndPay, // 创建订单并支付
    payOrder, // 支付已有订单

    // 查询方法
    queryOrderStatus, // 单次查询
    pollOrderStatus, // 轮询查询

    // 工具方法
    getTradeType,
    fetchAvailableMethods,
    getPlatformInfo,
  }
}
