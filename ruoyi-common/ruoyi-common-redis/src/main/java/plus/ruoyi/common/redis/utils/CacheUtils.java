package plus.ruoyi.common.redis.utils;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import plus.ruoyi.common.core.utils.SpringUtils;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;

/**
 * 缓存操作工具类
 *
 * <p>提供统一的缓存操作接口，简化Spring Cache的使用。
 * 支持多种缓存实现(Redis、Caffeine等)的统一操作。</p>
 *
 * <p>使用示例：
 * <pre>
 * // 存储缓存
 * CacheUtils.put("userCache", "user:123", userObj);
 *
 * // 获取缓存
 * User user = CacheUtils.get("userCache", "user:123");
 *
 * // 删除缓存
 * CacheUtils.evict("userCache", "user:123");
 *
 * // 清空缓存组
 * CacheUtils.clear("userCache");
 * </pre>
 *
 * <p><b>🔴 事务语义警告</b>：CacheManager 默认开启 transactionAware，Spring 的
 * TransactionAwareCacheDecorator 会把 {@link #put}/{@link #evict}/{@link #clear}
 * 延迟到当前事务 <em>afterCommit</em> 才真正执行；事务一旦回滚，这些写入直接丢弃。
 * 而 {@link #get} 始终直连底层缓存、立即可见。
 * 因此<b>禁止</b>「先写缓存、紧接着再读缓存、读不到就报错」的写法 —— 它在事务中必然失败。
 * 缓存未命中时请直接回源<b>数据库</b>拿到值使用，缓存写入只当作顺手回填的副作用。</p>
 *
 * @author Michelle.Chung
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@SuppressWarnings(value = {"unchecked"})
public class CacheUtils {

    /** Spring缓存管理器实例 */
    private static final CacheManager CACHE_MANAGER = SpringUtils.getBean(CacheManager.class);

    /**
     * 获取缓存值
     *
     * @param <T> 返回值类型
     * @param cacheNames 缓存组名称
     * @param key 缓存key
     * @return 缓存值，不存在时返回null
     */
    public static <T> T get(String cacheNames, Object key) {
        Cache.ValueWrapper wrapper = CACHE_MANAGER.getCache(cacheNames).get(key);
        return wrapper != null ? (T) wrapper.get() : null;
    }

    /**
     * 保存缓存值
     *
     * @param cacheNames 缓存组名称
     * @param key 缓存key
     * @param value 缓存值
     */
    public static void put(String cacheNames, Object key, Object value) {
        CACHE_MANAGER.getCache(cacheNames).put(key, value);
    }

    /**
     * 删除指定缓存项
     *
     * @param cacheNames 缓存组名称
     * @param key 缓存key
     */
    public static void evict(String cacheNames, Object key) {
        CACHE_MANAGER.getCache(cacheNames).evict(key);
    }

    /**
     * 清空指定缓存组的所有数据
     *
     * @param cacheNames 缓存组名称
     */
    public static void clear(String cacheNames) {
        CACHE_MANAGER.getCache(cacheNames).clear();
    }

}
