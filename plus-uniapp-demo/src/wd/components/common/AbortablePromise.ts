/**
 * 可中止的Promise类
 * 提供了在Promise执行过程中主动中止的能力
 */
export class AbortablePromise<T> {
  /** 内部Promise实例 */
  promise: Promise<T>

  /** 用于中止Promise的reject方法引用 */
  private _reject: ((reason?: any) => void) | null = null

  /**
   * 构造函数
   * @param executor Promise执行器函数，接收resolve和reject参数
   */
  constructor(
    executor: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void,
    ) => void,
  ) {
    this.promise = new Promise<T>((resolve, reject) => {
      // 执行用户提供的executor函数
      executor(resolve, reject)
      // 保存reject方法的引用，以便在abort时调用
      this._reject = reject
    })
  }

  /**
   * 中止Promise执行
   * @param error 可选的错误信息，会作为Promise被reject的原因
   */
  abort = (error?: any): void => {
    if (this._reject) {
      // 调用reject方法来中止Promise
      this._reject(error || new Error('Promise was aborted'))
      // 清空引用，防止重复调用
      this._reject = null
    }
  }

  /**
   * Promise的then方法
   * @param onfulfilled 成功回调函数
   * @param onrejected 失败回调函数
   * @returns 新的Promise
   */
  then = <TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
  ): Promise<TResult1 | TResult2> => {
    return this.promise.then(onfulfilled, onrejected)
  }

  /**
   * Promise的catch方法
   * @param onrejected 错误处理回调函数
   * @returns 新的Promise
   */
  catch = <TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
  ): Promise<T | TResult> => {
    return this.promise.catch(onrejected)
  }

  /**
   * Promise的finally方法
   * @param onfinally 最终执行的回调函数
   * @returns 新的Promise
   */
  finally = (onfinally?: (() => void) | undefined | null): Promise<T> => {
    return this.promise.finally(onfinally)
  }
}
