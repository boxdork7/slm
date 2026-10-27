// 缓存工具
import { SystemConfig } from '@/systemConfig'

/**
 * UniApp 缓存工具 (cache.ts)
 *
 * 基于 UniApp 存储 API 的优化缓存封装
 * 充分利用 UniApp 原生的多类型存储和自动序列化特性
 *
 * 特性：
 * - 同步操作，性能更好
 * - 原生支持多种数据类型（字符串、数字、布尔值、对象、数组）
 * - 自动序列化/反序列化，保持类型不变
 * - 过期时间以秒为单位
 * - 自动添加应用前缀
 * - 过期数据自动清理
 * - 完整的 TypeScript 泛型支持
 */

// 缓存键前缀，防止多应用冲突
const KEY_PREFIX = `${SystemConfig.app.id}:`

/**
 * 为缓存键添加应用前缀
 */
const getPrefixedKey = (key: string): string => {
  return `${KEY_PREFIX}${key}`
}

/**
 * 数据包装器（仅用于添加过期时间）
 */
interface CacheWrapper<T = any> {
  data: T
  _expire?: number // 过期时间戳（毫秒）
}

/**
 * 自动清理过期数据
 */
const autoCleanup = (): void => {
  try {
    const storageInfo = uni.getStorageInfoSync()
    const now = Date.now()
    const keysToRemove: string[] = []

    // 检查所有带前缀的 key
    for (const key of storageInfo.keys) {
      if (key.startsWith(KEY_PREFIX)) {
        try {
          const wrapper: CacheWrapper = uni.getStorageSync(key)
          if (wrapper && wrapper._expire && wrapper._expire < now) {
            keysToRemove.push(key)
          }
        } catch (e) {
          // 读取失败的数据也删除
          keysToRemove.push(key)
        }
      }
    }

    // 删除过期数据
    keysToRemove.forEach((key) => {
      uni.removeStorageSync(key)
    })

    if (keysToRemove.length > 0) {
      console.log(`清理了 ${keysToRemove.length} 个过期缓存项`)
    }
  } catch (e) {
    console.warn('自动清理失败:', e)
  }
}

/**
 * 缓存工具对象
 */
export const cache = {
  /**
   * 设置缓存（支持任意类型）
   * @param key 缓存键
   * @param value 缓存值（任意类型：字符串、数字、布尔值、对象、数组等）
   * @param expireSeconds 过期时间（秒），不传则永不过期
   *
   * @example
   * // 直接存储各种类型，无需手动序列化
   * cache.set('theme', 'dark');                    // 字符串
   * cache.set('count', 42);                        // 数字
   * cache.set('isActive', true);                   // 布尔值
   * cache.set('userInfo', { id: 1, name: 'admin' }); // 对象
   * cache.set('tags', ['frontend', 'mobile']);     // 数组
   *
   * // 设置过期时间
   * cache.set('token', 'abc123', 7 * 24 * 3600);   // 7天过期
   * cache.set('tempData', { temp: true }, 3600);   // 1小时过期
   */
  set<T>(key: string, value: T, expireSeconds?: number): boolean {
    if (key == null || value == null) {
      return false
    }

    try {
      const prefixedKey = getPrefixedKey(key)

      // 统一使用包装器
      const wrapper: CacheWrapper<T> = {
        data: value,
        _expire: expireSeconds ? Date.now() + expireSeconds * 1000 : undefined,
      }

      uni.setStorageSync(prefixedKey, wrapper)
      return true
    } catch (e) {
      console.error('缓存设置失败:', e)
      return false
    }
  },

  /**
   * 获取缓存
   * @param key 缓存键
   * @returns 缓存值或 null（过期或无效数据返回 null）
   *
   * @example
   * // 获取时保持原始类型，无需手动转换
   * const theme = cache.get<string>('theme');      // "dark" (string)
   * const count = cache.get<number>('count');      // 42 (number)
   * const isActive = cache.get<boolean>('isActive'); // true (boolean)
   * const userInfo = cache.get<UserInfo>('userInfo'); // { id: 1, name: 'admin' }
   * const tags = cache.get<string[]>('tags');      // ['frontend', 'mobile']
   */
  get<T = any>(key: string): T | null {
    if (key == null) {
      return null
    }

    try {
      const prefixedKey = getPrefixedKey(key)
      const wrapper: CacheWrapper<T> = uni.getStorageSync(prefixedKey)

      if (!wrapper || typeof wrapper !== 'object') {
        return null
      }

      // 检查过期时间
      if (wrapper._expire && wrapper._expire < Date.now()) {
        this.remove(key)
        return null
      }

      return wrapper.data as T
    } catch (e) {
      console.error(`缓存获取失败 [${key}]:`, e)
      this.remove(key)
      return null
    }
  },

  /**
   * 移除缓存项
   * @param key 缓存键
   *
   * @example
   * cache.remove('userToken')
   */
  remove(key: string): void {
    if (key == null) return

    try {
      const prefixedKey = getPrefixedKey(key)
      uni.removeStorageSync(prefixedKey)
    } catch (e) {
      console.error('缓存删除失败:', e)
    }
  },

  /**
   * 检查缓存是否存在且未过期
   * @param key 缓存键
   * @returns 是否存在
   *
   * @example
   * if (cache.has('userToken')) {
   *   // 用户已登录
   * }
   */
  has(key: string): boolean {
    return this.get(key) !== null
  },

  /**
   * 清除所有应用缓存
   *
   * @example
   * cache.clearAll() // 清除当前应用的所有缓存
   */
  clearAll(): void {
    try {
      const storageInfo = uni.getStorageInfoSync()
      const keysToRemove = storageInfo.keys.filter((key) => key.startsWith(KEY_PREFIX))

      keysToRemove.forEach((key) => {
        uni.removeStorageSync(key)
      })

      console.log(`清除了 ${keysToRemove.length} 个缓存项`)
    } catch (e) {
      console.error('清除缓存失败:', e)
    }
  },

  /**
   * 手动清理过期缓存
   *
   * @example
   * cache.cleanup() // 清理所有过期的缓存项
   */
  cleanup(): void {
    autoCleanup()
  },

  /**
   * 获取缓存统计信息
   * @returns 统计信息或 null
   *
   * @example
   * const stats = cache.getStats()
   * if (stats) {
   *   console.log(`当前使用: ${stats.usagePercent}%`)
   * }
   */
  getStats(): {
    totalKeys: number
    appKeys: number
    currentSize: number
    limitSize: number
    usagePercent: number
  } | null {
    try {
      const info = uni.getStorageInfoSync()
      const appKeys = info.keys.filter((key) => key.startsWith(KEY_PREFIX))

      return {
        totalKeys: info.keys.length,
        appKeys: appKeys.length,
        currentSize: info.currentSize || 0,
        limitSize: info.limitSize || 10 * 1024 * 1024, // 默认10MB
        usagePercent: Math.round(
          ((info.currentSize || 0) / (info.limitSize || 10 * 1024 * 1024)) * 100,
        ),
      }
    } catch (e) {
      console.error('获取存储统计失败:', e)
      return null
    }
  },

  /**
   * 获取缓存键的原始名称（移除前缀）
   * 仅用于调试目的
   * @param prefixedKey 带前缀的缓存键
   * @returns 原始缓存键名称
   */
  getOriginalKey(prefixedKey: string): string {
    if (prefixedKey.startsWith(KEY_PREFIX)) {
      return prefixedKey.substring(KEY_PREFIX.length)
    }
    return prefixedKey
  },
}

// 应用启动时自动清理过期数据
if (typeof uni !== 'undefined') {
  setTimeout(() => {
    autoCleanup()
    const stats = cache.getStats()
    if (stats) {
      // console.log(`缓存初始化完成，当前使用 ${stats.appKeys} 项，占用 ${stats.usagePercent}%`);
    }
  }, 1000)

  // 每10分钟清理一次过期数据
  setInterval(
    () => {
      autoCleanup()
    },
    10 * 60 * 1000,
  )
}
