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
import PLATFORM from '@/utils/platform'

import { toWithRetry } from '@/utils/to'
import { useToast, useMessage } from '@/wd'

const toast = useToast()
const message = useMessage()

// 全局类型声明 - 仅在 H5 环境下有效
// #ifdef H5
declare global {
  interface Window {
    WeixinJSBridge?: {
      invoke: (method: string, params: any, callback: (result: any) => void) => void
    }
  }

  interface Document {
    attachEvent?: (event: string, listener: () => void) => void
  }
}
// #endif

/**
 * 检查当前平台是否支持微信支付
 */
const isWechatPaySupported = (): boolean => {
  return PLATFORM.isMpWeixin || PLATFORM.isWechatOfficialH5 || PLATFORM.isApp
}

/**
 * 检查当前平台是否支持支付宝支付
 */
const isAlipayPaySupported = (): boolean => {
  return PLATFORM.isMpAlipay || PLATFORM.isAlipayOfficialH5 || PLATFORM.isH5 || PLATFORM.isApp
}

/**
 * 检查当前平台是否支持余额支付
 */
const isBalancePaySupported = (): boolean => {
  return true // 所有平台都支持余额支付
}

/**
 * 调用微信支付 - 仅在支持的平台执行
 */
const invokeWechatPay = (
  payInfo: Record<string, string>,
  callback: (success: boolean) => void,
): void => {
  // 检查当前平台是否支持微信支付
  if (!isWechatPaySupported()) {
    console.error(`当前平台 ${PLATFORM.platform} 不支持微信支付`)
    toast.error('当前环境不支持微信支付')
    callback(false)
    return
  }

  // #ifdef H5
  console.log('调用WeixinJSBridge支付，参数:', payInfo)

  // 检查是否在微信环境中
  if (!PLATFORM.isWechatEnvironment()) {
    console.error('请在微信中打开')
    toast.error('请在微信中打开')
    callback(false)
    return
  }

  if (!PLATFORM.hasWeixinJSBridge()) {
    console.error('WeixinJSBridge不可用')
    toast.error('支付环境异常，请在微信中重试')
    callback(false)
    return
  }

  // 使用官方推荐的 getBrandWCPayRequest 方法
  window.WeixinJSBridge!.invoke(
    'getBrandWCPayRequest',
    {
      appId: payInfo.appId,
      timeStamp: payInfo.timeStamp,
      nonceStr: payInfo.nonceStr,
      package: payInfo.package,
      signType: payInfo.signType,
      paySign: payInfo.paySign,
    },
    (res) => {
      console.log('微信支付结果:', res)

      if (res.err_msg === 'get_brand_wcpay_request:ok') {
        console.log('微信支付成功')
        toast.success('支付成功')
        callback(true)
      } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
        console.log('用户取消支付')
        toast.info('支付已取消')
        callback(false)
      } else {
        console.error('微信支付失败:', res)
        toast.error('支付失败')
        callback(false)
      }
    },
  )
  // #endif

  // #ifndef H5
  console.error('微信JSBridge支付仅支持H5环境')
  callback(false)
  // #endif
}

/**
 * 微信公众号H5支付
 */
const callWechatH5Pay = async (paymentResponse: PaymentResponse): Promise<boolean> => {
  return new Promise((resolve) => {
    // #ifdef H5
    console.log('开始微信公众号H5支付，支付数据:', paymentResponse)

    // 检查必要参数
    if (!paymentResponse.payInfo) {
      console.error('缺少payInfo参数')
      resolve(false)
      return
    }

    // 检查是否在微信环境中
    if (!PLATFORM.isWechatEnvironment()) {
      console.error('请在微信中打开')
      toast.error('请在微信中打开')
      resolve(false)
      return
    }

    const payInfo = paymentResponse.payInfo

    // 检查WeixinJSBridge是否准备好
    if (!PLATFORM.hasWeixinJSBridge()) {
      console.log('WeixinJSBridge未准备好，等待加载...')

      const onReady = () => {
        console.log('WeixinJSBridge准备就绪')
        invokeWechatPay(payInfo, resolve)
      }

      // 添加超时处理
      const timeout = setTimeout(() => {
        console.error('WeixinJSBridge加载超时')
        toast.error('支付环境初始化失败')
        resolve(false)
      }, 10000) // 10秒超时

      const readyHandler = () => {
        clearTimeout(timeout)
        onReady()
      }

      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', readyHandler, false)
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', readyHandler)
        document.attachEvent('onWeixinJSBridgeReady', readyHandler)
      }
    } else {
      console.log('WeixinJSBridge已准备好，直接调用支付')
      invokeWechatPay(payInfo, resolve)
    }
    // #endif

    // #ifndef H5
    console.error('微信H5支付仅支持H5环境')
    resolve(false)
    // #endif
  })
}

/**
 * 微信小程序支付
 */
const callWechatMpPay = async (paymentResponse: PaymentResponse): Promise<boolean> => {
  return new Promise((resolve) => {
    // #ifdef MP-WEIXIN
    console.log('开始微信小程序支付')

    if (!paymentResponse.payInfo) {
      resolve(false)
      return
    }

    const payInfo = paymentResponse.payInfo

    uni.requestPayment({
      provider: 'wxpay',
      orderInfo: undefined,
      timeStamp: payInfo.timeStamp,
      nonceStr: payInfo.nonceStr,
      package: payInfo.package,
      signType: payInfo.signType,
      paySign: payInfo.paySign,
      success: (res) => {
        console.log('微信小程序支付成功:', res)
        toast.success('支付成功')
        resolve(true)
      },
      fail: (err) => {
        console.error('微信小程序支付失败:', err)
        if (err.errMsg && err.errMsg.includes('cancel')) {
          toast.info('支付已取消')
        } else {
          toast.error('支付失败')
        }
        resolve(false)
      },
    })
    // #endif

    // #ifndef MP-WEIXIN
    console.error('微信小程序支付仅支持微信小程序环境')
    resolve(false)
    // #endif
  })
}

/**
 * 微信APP支付
 */
const callWechatAppPay = async (paymentResponse: PaymentResponse): Promise<boolean> => {
  return new Promise((resolve) => {
    // #ifdef APP
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
    // #endif

    // #ifndef APP
    console.error('微信APP支付仅支持APP环境')
    resolve(false)
    // #endif
  })
}

/**
 * 根据平台调用微信支付
 */
const callWechatPayByPlatform = async (paymentResponse: PaymentResponse): Promise<boolean> => {
  console.log('调用微信支付，支付数据:', paymentResponse)

  if (PLATFORM.isWechatOfficialH5) {
    return await callWechatH5Pay(paymentResponse)
  } else if (PLATFORM.isMpWeixin) {
    return await callWechatMpPay(paymentResponse)
  } else if (PLATFORM.isApp) {
    return await callWechatAppPay(paymentResponse)
  } else {
    throw new Error(`当前平台 ${PLATFORM.platform} 不支持微信支付`)
  }
}

/**
 * 支付宝H5支付
 */
const callAlipayH5Pay = async (paymentResponse: PaymentResponse): Promise<boolean> => {
  return new Promise((resolve) => {
    // #ifdef H5
    if (paymentResponse.payUrl) {
      console.log('跳转支付宝支付页面:', paymentResponse.payUrl)
      window.location.href = paymentResponse.payUrl
      resolve(true) // H5支付跳转成功
    } else {
      console.error('缺少支付宝支付链接')
      resolve(false)
    }
    // #endif

    // #ifndef H5
    console.error('支付宝H5支付仅支持H5环境')
    resolve(false)
    // #endif
  })
}

/**
 * 支付宝小程序支付
 */
const callAlipayMpPay = async (paymentResponse: PaymentResponse): Promise<boolean> => {
  return new Promise((resolve) => {
    // #ifdef MP-ALIPAY
    uni.requestPayment({
      provider: 'alipay',
      orderInfo: paymentResponse.payForm || paymentResponse.payUrl!,
      success: (res) => {
        console.log('支付宝小程序支付成功:', res)
        toast.success('支付成功')
        resolve(true)
      },
      fail: (err) => {
        console.error('支付宝小程序支付失败:', err)
        toast.error('支付失败')
        resolve(false)
      },
    })
    // #endif

    // #ifndef MP-ALIPAY
    console.error('支付宝小程序支付仅支持支付宝小程序环境')
    resolve(false)
    // #endif
  })
}

/**
 * 支付宝APP支付
 */
const callAlipayAppPay = async (paymentResponse: PaymentResponse): Promise<boolean> => {
  return new Promise((resolve) => {
    // #ifdef APP
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
    // #endif

    // #ifndef APP
    console.error('支付宝APP支付仅支持APP环境')
    resolve(false)
    // #endif
  })
}

/**
 * 根据平台调用支付宝支付
 */
const callAlipayByPlatform = async (paymentResponse: PaymentResponse): Promise<boolean> => {
  if (PLATFORM.isAlipayOfficialH5 || PLATFORM.isH5) {
    return await callAlipayH5Pay(paymentResponse)
  } else if (PLATFORM.isMpAlipay) {
    return await callAlipayMpPay(paymentResponse)
  } else if (PLATFORM.isApp) {
    return await callAlipayAppPay(paymentResponse)
  } else {
    throw new Error(`当前平台 ${PLATFORM.platform} 不支持支付宝支付`)
  }
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
      // 根据平台判断过滤支持的支付方式
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
      if (PLATFORM.isMpWeixin) {
        return TradeType.JSAPI
      } else if (PLATFORM.isApp) {
        return TradeType.APP
      } else if (PLATFORM.isWechatOfficialH5) {
        return TradeType.JSAPI
      } else if (PLATFORM.isH5) {
        return TradeType.H5
      } else {
        return TradeType.NATIVE
      }
    } else if (paymentMethod === PaymentMethod.ALIPAY) {
      if (PLATFORM.isMpAlipay || PLATFORM.isApp) {
        return TradeType.APP
      } else if (PLATFORM.isH5) {
        return TradeType.WAP
      } else {
        return TradeType.PAGE
      }
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
      return await callWechatPayByPlatform(paymentResult)
    } else if (paymentMethod === PaymentMethod.ALIPAY) {
      return await callAlipayByPlatform(paymentResult)
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
      platform: PLATFORM.platform,
      supportsWechatPay: isWechatPaySupported(),
      supportsAlipayPay: isAlipayPaySupported(),
      supportsBalancePay: isBalancePaySupported(),
      isWechatEnvironment: PLATFORM.isWechatEnvironment(),
      isAlipayEnvironment: PLATFORM.isAlipayEnvironment(),
      isInDevTools: PLATFORM.isInDevTools(),
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
