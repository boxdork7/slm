package plus.ruoyi.common.core.constant;

/**
 * 缓存组名称常量
 * <p>
 * key 格式为 cacheNames#ttl#maxIdleTime#maxSize
 * <p>
 * ttl 过期时间 如果设置为0则不过期 默认为0
 * maxIdleTime 最大空闲时间 根据LRU算法清理空闲数据 如果设置为0则不检测 默认为0
 * maxSize 组最大长度 根据LRU算法清理溢出数据 如果设置为0则无限长 默认为0
 * <p>
 * 例子: test#60s、test#0#60s、test#0#1m#1000、test#1h#0#500
 *
 * @author Lion Li
 */
public interface CacheNames {


    /**
     * 字段映射 - 频繁访问的映射关系，适中缓存时间
     * TTL: 30秒, 空闲时间: 2分钟, 最大数量: 1000个
     */
    String FIELD_MAP = "field_map:cache#30s#2m#1000";

    // ==================== 系统基础配置缓存 ====================

    /**
     * 系统配置 - 相对稳定的配置信息，长期缓存
     * TTL: 5天, 空闲时间: 2天, 最大数量: 500个
     */
    String SYS_CONFIG = "sys_config#5d#2d#500";

    /**
     * 数据字典 - 相对稳定的字典数据，长期缓存
     * TTL: 1天, 空闲时间: 12小时, 最大数量: 1000个
     */
    String SYS_DICT = "sys_dict#1d#12h#1000";

    /**
     * 数据字典类型 - 变化较少的字典类型，长期缓存
     * TTL: 1天, 空闲时间: 12小时, 最大数量: 200个
     */
    String SYS_DICT_TYPE = "sys_dict_type#1d#12h#200";

    // ==================== 租户和客户端缓存 ====================

    /**
     * 租户信息 - 全局缓存，相对稳定
     * TTL: 5天, 空闲时间: 2天, 最大数量: 100个
     */
    String SYS_TENANT = GlobalConstants.GLOBAL_REDIS_KEY + "sys_tenant#5d#2d#100";

    /**
     * 用户账户信息 - 用户相关缓存，中等时长
     * TTL: 5天, 空闲时间: 2天, 最大数量: 5000个
     */
    String SYS_USER_NAME = "sys_user_name#5d#2d#5000";

    /**
     * 用户昵称 - 用户相关缓存，中等时长
     * TTL: 5天, 空闲时间: 2天, 最大数量: 5000个
     */
    String SYS_NICKNAME = "sys_nickname#5d#2d#5000";

    /**
     * 用户头像 - 用户相关缓存，中等时长
     * TTL: 5天, 空闲时间: 2天, 最大数量: 5000个
     */
    String SYS_AVATAR = "sys_avatar#5d#2d#5000";

    /**
     * 部门信息 - 组织架构缓存，相对稳定
     * TTL: 5天, 空闲时间: 2天, 最大数量: 1000个
     */
    String SYS_DEPT = "sys_dept#5d#2d#1000";

    // ==================== 权限相关缓存 ====================

    /**
     * 角色自定义权限 - 权限相关缓存，较长时间
     * TTL: 5天, 空闲时间: 2天, 最大数量: 2000个
     */
    String SYS_ROLE_CUSTOM = "sys_role_custom#5d#2d#2000";

    /**
     * 部门及子部门权限 - 层级权限缓存，较长时间
     * TTL: 5天, 空闲时间: 2天, 最大数量: 1000个
     */
    String SYS_DEPT_AND_CHILD = "sys_dept_and_child#5d#2d#1000";

    // ==================== 文件存储缓存 ====================

    /**
     * OSS配置 - 全局配置，不过期
     * TTL: 不过期, 空闲时间: 不检测, 最大数量: 50个
     * <p>
     * 不设 TTL/空闲淘汰的原因：OSS 配置条数极少、几乎不变，但访问频次完全取决于业务是否上传文件。
     * 曾配置为 ttl=10天/空闲=5天，导致连续数天无人上传时配置被空闲淘汰，
     * 而记录默认配置的 {@code global:sys_oss:default_config} 是普通 key（读不续期、TTL 10 天）并未同时失效，
     * 形成「默认key还在、配置内容没了」的半失效状态。配置变更由增删改主动刷新缓存，无需靠过期兜底。
     */
    String SYS_OSS_CONFIG = GlobalConstants.GLOBAL_REDIS_KEY + "sys_oss_config#0#0#50";

    /**
     * OSS文件信息 - 文件元数据缓存，长期保存
     * TTL: 3天, 空闲时间: 1天, 最大数量: 10000个
     */
    String SYS_OSS = "sys_oss#3d#1d#10000";

    /**
     * OSS目录缓存 - 目录结构频繁变化，短期缓存
     * TTL: 10秒, 空闲时间: 5秒, 最大数量: 500个
     */
    String SYS_OSS_DIRECTORY = "sys_oss_directory#10s#5s#500";

    // ==================== 统计数据缓存 ====================

    /**
     * 首页统计数据 - 统计数据缓存，短期缓存
     * TTL: 20秒, 空闲时间: 10秒, 最大数量: 100个
     */
    String HOME_STATISTICS = "home_statistics#20s#10s#100";

    // ==================== 字段级权限缓存 ====================

    /**
     * 字段权限差异行 - key 为 subjectType:subjectId:resourceKey，值为 Map<fieldName, accessCode>
     * TTL: 5天, 空闲时间: 2天, 最大数量: 5000个
     * <p>空结果也缓存（空 HashMap 而非 null）：绝大多数「主体 × 资源」组合无配置，不缓存会穿透到库</p>
     */
    String SYS_FIELD_PERMISSION = "sys_field_permission#5d#2d#5000";

    /**
     * 字段权限注解基线 - key 为 resourceKey，值为 Map<fieldName, accessCode>（带 @Sensitive 的字段基线为脱敏）
     * <p>系统级（不随租户），由启动扫描算好写入；热路径读缓存不反射。不设 TTL：类结构不会在运行期变化，
     * 由重启扫描刷新，靠过期兜底反而会在闲置期被淘汰导致基线丢失</p>
     */
    String SYS_FIELD_BASELINE = GlobalConstants.GLOBAL_REDIS_KEY + "sys_field_baseline#0#0#500";

    /**
     * 字段权限类 → 资源反查 - key 为类全限定名，值为 resourceKey
     * <p>系统级；序列化层按类反查资源时走此缓存，未登记的类缓存空串表示"放行"</p>
     */
    String SYS_FIELD_CLASS_RESOURCE = GlobalConstants.GLOBAL_REDIS_KEY + "sys_field_class_resource#0#0#2000";

}
