/**
 * 安全异步执行工具函数集 (utils/to.ts)
 *
 * 提供一系列工具函数，将 Promise 和可能抛出异常的代码转换为 [error, data] 格式，
 * 避免 try-catch 的使用，让代码更加简洁和可读。
 *
 * 包含函数列表：
 *
 * - to(): 基础 Promise 异常处理，将任何 Promise 转换为 [error, data] 格式
 * - toValidate(): 表单验证专用，处理 wd-form 等移动端 UI 库的表单验证
 * - toAll(): 批量处理 Promise 数组，并行执行多个异步操作
 * - toWithTimeout(): 带超时控制，为 Promise 添加超时机制
 * - toSync(): 同步版本，处理可能抛出异常的同步代码
 * - toWithRetry(): 自动重试机制，适用于移动端网络不稳定场景
 * - toWithDefault(): 带默认值，失败时使用备用数据
 * - toSequence(): 串行执行，按顺序处理有依赖关系的操作
 * - toIf(): 条件执行，根据条件决定是否执行异步操作（
 *
 * 使用示例：
 * ```typescript
 * // 基础用法
 * const [err, user] = await to(fetchUser(id));
 * if (err) return handleError(err);
 *
 * // 表单验证
 * const [err, isValid] = await toValidate(formRef);
 * if (err || !isValid) return;
 *
 * // 批量请求
 * const results = await toAll([api1(), api2(), api3()]);
 *
 * // 带超时
 * const [err, data] = await toWithTimeout(slowApi(), 5000);
 * ```
 *
 * @author 抓蛙师
 * @since 2025-05-29
 */

/**
 * 基础 to 函数 - 处理 Promise 异常
 *
 * 将任何 Promise 转换为 [error, data] 格式，避免使用 try-catch
 * 这是最常用的函数，99% 的场景都会用到
 *
 * @template T Promise 返回的数据类型
 * @param promise 要执行的 Promise 对象
 * @returns Promise<[Error | null, T | null]> 包含错误和数据的元组
 *
 * @example
 * // 基础用法
 * const [err, user] = await to(getUserById('123'));
 * if (err) {
 *   console.error('获取用户失败:', err.message);
 *   return;
 * }
 * console.log('用户信息:', user);
 *
 * @example
 * // 处理 API 请求
 * const [err, response] = await to(fetch('/api/data'));
 * if (err) {
 *   showErrorMessage('网络请求失败');
 *   return;
 * }
 * const [parseErr, data] = await to(response.json());
 * if (parseErr) {
 *   showErrorMessage('数据解析失败');
 *   return;
 * }
 * console.log('请求结果:', data);
 */
export const to = async <T>(promise: Promise<T>): Promise<[Error | null, T | null]> => {
  try {
    const data = await promise
    return [null, data]
  } catch (error) {
    return [error instanceof Error ? error : new Error(String(error)), null]
  }
}

/**
 * 表单验证专用的 to 函数
 *
 * 专门处理 wd-form 表单验证，将对象响应转换为数组格式
 * 在表单密集的移动端应用中使用频率很高
 *
 * @param formRef 表单引用对象
 * @returns Promise<[Error | null, boolean]> 验证结果，成功时返回 true
 *
 * @example
 * // Vue 组件中的表单验证
 * const handleSubmit = async () => {
 *   const [err, isValid] = await toValidate(formRef.value);
 *   if (err || !isValid) {
 *     toast.error(err?.message || '表单验证失败');
 *     return;
 *   }
 *
 *   // 验证通过，提交表单
 *   const [submitErr] = await to(submitForm(formData));
 *   if (submitErr) {
 *     toast.error('提交失败: ' + submitErr.message);
 *     return;
 *   }
 *
 *   toast.success('提交成功');
 * };
 *
 * @example
 * // 多个表单同时验证
 * const validateAllForms = async () => {
 *   const results = await toAll([
 *     toValidate(userFormRef.value),
 *     toValidate(addressFormRef.value),
 *     toValidate(paymentFormRef.value)
 *   ]);
 *
 *   const hasErrors = results.some(([err, isValid]) => err || !isValid);
 *   if (hasErrors) {
 *     toast.error('请检查表单输入');
 *     return false;
 *   }
 *
 *   return true;
 * };
 */
export const toValidate = async (formRef: Ref<any>): Promise<[Error | null, boolean]> => {
  if (!formRef || !formRef.value) {
    return [new Error('表单引用不存在'), false]
  }

  try {
    // 调用 wd-form 的 validate 方法，返回 {valid: boolean, errors: ErrorMessage[]}
    const result = await formRef.value.validate()

    if (!result.valid && result.errors?.length > 0) {
      // 提取错误信息
      const errorMessage = result.errors
        .map((error: any) => error.message)
        .filter(Boolean)
        .join(', ')

      return [new Error(errorMessage || '表单验证失败'), false]
    }

    return [null, result.valid]
  } catch (error) {
    return [error instanceof Error ? error : new Error('表单验证异常'), false]
  }
}

/**
 * 条件执行的 to 函数
 *
 * 只有满足条件时才执行 Promise，否则直接返回 [null, null]
 * 支持传入原始 Promise 和已用 to() 包装的 Promise
 * 用于移动端特定场景的条件性操作
 *
 * @template T Promise 返回的数据类型
 * @param condition 执行条件
 * @param promise 要执行的 Promise，支持原始 Promise 和 to() 包装的 Promise
 * @returns Promise<[Error | null, T | null]> 包含错误和数据的元组
 * @example
 * // 根据网络状态决定是否同步数据（原始 Promise）
 * const [err, syncResult] = await toIf(
 *   navigator.onLine,
 *   syncDataToCloud(localData)
 * );
 * if (err) {
 *   Toast.fail('数据同步失败');
 * } else if (syncResult) {
 *   Toast.success('数据同步成功');
 *   markDataAsSynced();
 * } else {
 *   Toast.info('离线状态，跳过数据同步');
 * }
 *
 * @example
 * // 根据权限决定是否加载敏感数据（已用 to() 包装）
 * const [err, sensitiveData] = await toIf(
 *   hasPermission('read:sensitive'),
 *   to(loadSensitiveData(userId))
 * );
 * if (err) {
 *   console.error('加载敏感数据失败:', err.message);
 * } else if (sensitiveData) {
 *   renderSensitiveDataPanel(sensitiveData);
 * } else {
 *   console.log('权限不足，跳过敏感数据加载');
 * }
 */
export const toIf = async <T>(
  condition: boolean,
  promise: Promise<T> | Promise<[Error | null, T | null]>,
): Promise<[Error | null, T | null]> => {
  if (!condition) {
    return [null, null]
  }

  try {
    const result = await promise

    // 检查是否已经是 to() 格式 [Error | null, T | null]
    if (Array.isArray(result) && result.length === 2) {
      return result as [Error | null, T | null]
    }

    // 原始数据，包装为 to() 格式
    return [null, result as T]
  } catch (error) {
    return [error instanceof Error ? error : new Error(String(error)), null]
  }
}

/**
 * 带重试机制的 to 函数（增强版）
 *
 * 支持两种传入方式：
 * 1. 直接传入 Promise 工厂函数
 * 2. 传入已经用 to() 包装的函数
 *
 * @template T Promise 返回的数据类型
 * @param promiseFactory 返回 Promise 或 [Error | null, T | null] 的工厂函数
 * @param maxRetries 最大重试次数（默认 3 次）
 * @param retryDelay 重试间隔时间（毫秒，默认 1000ms）
 * @returns Promise<[Error | null, T | null]>
 *
 * @example
 * // 重试网络请求
 * const [err, data] = await toWithRetry(
 *   () => fetch('/api/unstable-endpoint'),
 *   3,    // 重试 3 次
 *   2000  // 间隔 2 秒
 * );
 * if (err) {
 *   console.error('重试 3 次后仍然失败:', err.message);
 *   showErrorMessage('网络连接不稳定，请稍后重试');
 *   return;
 * }
 * console.log('请求成功:', data);
 *
 * @example
 * // 兼容已用 to() 包装的函数
 * const [err, data] = await toWithRetry(
 *   () => to(queryOrderStatus(orderNo)),
 *   2,
 *   2000
 * );
 * if (err) {
 *   console.error('查询支付状态失败:', err.message);
 *   return;
 * }
 * console.log('支付状态:', data);
 */
export const toWithRetry = async <T>(
  promiseFactory: (() => Promise<T>) | (() => Promise<[Error | null, T | null]>),
  maxRetries: number = 2,
  retryDelay: number = 1000
): Promise<[Error | null, T | null]> => {
  let lastError: Error

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await promiseFactory()

      // 检查返回值是否是 to() 包装后的格式 [Error | null, T | null]
      if (Array.isArray(result) && result.length === 2) {
        const [error, data] = result as [Error | null, T | null]
        if (!error) {
          if (attempt > 0) {
            console.log(`操作在第 ${attempt + 1} 次尝试时成功`)
          }
          return [null, data]
        }
        lastError = error
      } else {
        // 直接返回的数据，表示成功
        if (attempt > 0) {
          console.log(`操作在第 ${attempt + 1} 次尝试时成功`)
        }
        return [null, result as T]
      }
    } catch (error) {
      lastError = error as Error
    }

    // 如果不是最后一次尝试，等待后重试
    if (attempt < maxRetries) {
      console.warn(`第 ${attempt + 1} 次尝试失败，${retryDelay}ms 后重试:`, lastError.message)
      await new Promise((resolve) => setTimeout(resolve, retryDelay))
    }
  }

  return [lastError, null]
}
