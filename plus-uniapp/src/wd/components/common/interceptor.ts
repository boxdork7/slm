/**
 * 拦截器工具模块
 * 提供拦截器的类型定义和调用逻辑
 */

import { isPromise } from './util'

/** 空操作函数，用作默认回调 */
const noop = (): void => {}

/**
 * 拦截器类型定义
 * 拦截器可以返回Promise<boolean>、boolean或undefined/void
 * - 返回true或Promise<true>：继续执行
 * - 返回false或Promise<false>：取消执行
 * - 返回undefined/void：继续执行
 */
export type Interceptor = (...args: any[]) => Promise<boolean> | boolean | undefined | void

/**
 * 拦截器调用配置接口
 */
interface InterceptorCallConfig {
  /** 传递给拦截器的参数数组 */
  args?: unknown[]
  /** 拦截器通过时的回调函数 */
  done: () => void
  /** 拦截器被取消时的回调函数 */
  canceled?: () => void
  /** 拦截器执行出错时的回调函数 */
  error?: () => void
}

/**
 * 调用拦截器并根据结果执行相应的回调
 * @param interceptor 拦截器函数
 * @param config 调用配置对象
 *
 * @example
 * ```typescript
 * // 同步拦截器
 * callInterceptor(
 *   (data) => data.isValid,
 *   {
 *     args: [{ isValid: true }],
 *     done: () => console.log('继续执行'),
 *     canceled: () => console.log('取消执行')
 *   }
 * )
 *
 * // 异步拦截器
 * callInterceptor(
 *   async (data) => {
 *     const result = await validateData(data)
 *     return result.success
 *   },
 *   {
 *     args: [userData],
 *     done: () => submitForm(),
 *     canceled: () => showError(),
 *     error: () => handleError()
 *   }
 * )
 * ```
 */
export const callInterceptor = (
  interceptor: Interceptor | undefined,
  { args = [], done, canceled, error }: InterceptorCallConfig,
): void => {
  if (interceptor) {
    // 调用拦截器函数，传入参数
    // eslint-disable-next-line prefer-spread
    const returnVal = interceptor.apply(null, args)

    if (isPromise(returnVal)) {
      // 处理异步拦截器
      returnVal
        .then((value) => {
          if (value) {
            // 拦截器返回true，继续执行
            done()
          } else if (canceled) {
            // 拦截器返回false，取消执行
            canceled()
          }
        })
        .catch(error || noop) // 捕获异步错误
    } else if (returnVal) {
      // 同步拦截器返回true，继续执行
      done()
    } else if (canceled) {
      // 同步拦截器返回false，取消执行
      canceled()
    }
  } else {
    // 没有拦截器，直接执行
    done()
  }
}
