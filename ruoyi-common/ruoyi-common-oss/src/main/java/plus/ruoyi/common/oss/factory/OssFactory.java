package plus.ruoyi.common.oss.factory;

import lombok.extern.slf4j.Slf4j;
import plus.ruoyi.common.core.constant.CacheNames;
import plus.ruoyi.common.core.service.OssConfigService;
import plus.ruoyi.common.core.utils.SpringUtils;
import plus.ruoyi.common.core.utils.StringUtils;
import plus.ruoyi.common.json.utils.JsonUtils;
import plus.ruoyi.common.oss.constant.OssConstant;
import plus.ruoyi.common.oss.core.OssClient;
import plus.ruoyi.common.oss.entity.OssClientConfig;
import plus.ruoyi.common.oss.enums.OssType;
import plus.ruoyi.common.oss.exception.OssException;
import plus.ruoyi.common.redis.utils.CacheUtils;
import plus.ruoyi.common.redis.utils.RedisUtils;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.ReentrantLock;

/**
 * OSS工厂类
 * 用于创建和管理 OssClient 实例
 *
 * @author Lion Li
 */
@Slf4j
public class OssFactory {

    /**
     * 客户端缓存
     */
    private static final Map<String, OssClient> CLIENT_CACHE = new ConcurrentHashMap<>();

    /**
     * 锁对象，用于确保线程安全
     */
    private static final ReentrantLock LOCK = new ReentrantLock();


    /**
     * 获取默认OSS客户端实例
     *
     * @return OSS客户端
     */
    public static OssClient instance() {
        // 从Redis获取默认配置键
        String configKey = RedisUtils.getCacheObject(OssConstant.DEFAULT_CONFIG_KEY);
        //  如果默认配置键为空则初始化
        if (StringUtils.isEmpty(configKey)) {
            //  初始化
            SpringUtils.getBean(OssConfigService.class).initOssConfig();
            configKey = RedisUtils.getCacheObject(OssConstant.DEFAULT_CONFIG_KEY);
            if (StringUtils.isEmpty(configKey)) {
                throw new OssException("文件存储服务类型无法找到!");
            }
        }
        return instance(configKey);
    }

    /**
     * 根据配置键获取OSS客户端实例
     *
     * @param configKey 配置键
     * @return OSS客户端
     */
    public static OssClient instance(String configKey) {
        // 从缓存获取配置
        String json = CacheUtils.get(CacheNames.SYS_OSS_CONFIG, configKey);
        if (json == null) {
            // 缓存未命中（过期 / Redis 重启 / 被清理）直接回源数据库。
            // 注意不要写成「回填缓存后再读缓存、读不到就抛异常」：CacheUtils.put 在事务中会被
            // TransactionAwareCacheDecorator 推迟到 afterCommit，带 @Transactional 的业务上传接口
            // 必然读不到，进而误报“配置信息不存在”，且异常回滚后写入丢失导致故障持续。
            // 缓存只是加速层，绝不能成为可用性的必要条件。
            json = SpringUtils.getBean(OssConfigService.class).getOssConfigJson(configKey);
            if (json == null) {
                throw new OssException("系统异常, '" + configKey + "'配置信息不存在!");
            }
            log.info("OSS配置缓存未命中, 已从数据库回源并回填. configKey => {}", configKey);
            // 顺手回填，写入成功与否都不影响本次调用（值已在手上）
            CacheUtils.put(CacheNames.SYS_OSS_CONFIG, configKey, json);
        }

        // 解析配置
        OssClientConfig ossClientConfig = JsonUtils.parseObject(json, OssClientConfig.class);

        // 构建缓存键（考虑租户）
        String cacheKey = configKey;
        if (StringUtils.isNotBlank(ossClientConfig.getTenantId())) {
            cacheKey = ossClientConfig.getTenantId() + ":" + configKey;
        }

        // 获取缓存实例
        OssClient client = CLIENT_CACHE.get(cacheKey);

        // 客户端不存在或配置不同则重新构建
        if (client == null || !client.checkOssClientConfigSame(ossClientConfig)) {
            LOCK.lock();
            try {
                client = CLIENT_CACHE.get(cacheKey);
                if (client == null || !client.checkOssClientConfigSame(ossClientConfig)) {
                    CLIENT_CACHE.put(cacheKey, new OssClient(configKey, ossClientConfig));
                    log.info("创建OSS实例 key => {}", configKey);
                    return CLIENT_CACHE.get(cacheKey);
                }
            } finally {
                LOCK.unlock();
            }
        }

        return client;
    }

    /**
     * 使用枚举类型获取OSS客户端实例
     *
     * @param ossType 类型
     * @return OSS客户端
     */
    public static OssClient instance(OssType ossType) {
        return instance(ossType.getValue());
    }
}
