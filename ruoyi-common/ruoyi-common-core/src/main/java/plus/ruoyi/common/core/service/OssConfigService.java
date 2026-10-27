package plus.ruoyi.common.core.service;


/**
 * 通用 OSS配置服务
 *
 * @author Lion Li
 */
public interface OssConfigService {

    /**
     * 初始化OSS配置
     */
    void initOssConfig();

    /**
     * 根据配置key直接查数据库获取配置JSON（完全绕过缓存）
     *
     * <p>缓存只是加速层，不能成为可用性的必要条件。
     * 当 Redis 不可用、缓存写入被事务推迟等原因导致缓存始终取不到时，
     * 由本方法直接回源数据库，保证文件上传等功能仍可正常工作。</p>
     *
     * @param configKey 配置key（如 local、minio、aliyun）
     * @return 配置的JSON字符串；配置不存在时返回 null
     */
    String getOssConfigJson(String configKey);

}
