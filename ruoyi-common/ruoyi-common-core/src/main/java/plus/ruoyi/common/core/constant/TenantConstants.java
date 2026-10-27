package plus.ruoyi.common.core.constant;

/**
 * 租户常量信息
 *
 * @author Lion Li
 */
public interface TenantConstants {

    /**
     * 超级管理员ID
     */
    Long SUPER_ADMIN_ID = 1L;

    /**
     * 超级管理员角色 roleKey
     */
    String SUPER_ADMIN_ROLE_KEY = "superadmin";

    /**
     * 租户管理员角色 roleKey
     */
    String TENANT_ADMIN_ROLE_KEY = "admin";

    /**
     * 租户管理员角色名称
     */
    String TENANT_ADMIN_ROLE_NAME = "管理员";

    /**
     * 默认租户ID
     */
    String DEFAULT_TENANT_ID = "000000";

    /**
     * 租户ID合法格式（仅字母与数字，长度 1-20）
     * <p>
     * 为什么必须校验：租户ID会被 PlusTenantLineHandler 以 SQL 字符串字面量的形式
     * 拼进 SQL 文本（JSqlParser 的 StringValue 不做任何转义），而不是作为
     * PreparedStatement 参数传入。因此租户ID一旦含单引号、注释符、空格等字符，
     * 即可闭合字面量形成 SQL 注入。凡是租户ID的外部入口（请求头 X-Tenant-Id 等）
     * 都必须先用本正则过滤。
     * <p>
     * 长度上限 20 对齐 sys_tenant.tenant_id 字段定义 VARCHAR(20)；
     * 框架 {@code generateTenantId()} 实际生成 6 位纯数字，这里放宽到字母数字
     * 是为兼容使用者自定义的租户编号。若业务确定只用框架生成的编号，
     * 可自行收紧为 {@code ^\\d{6}$} 获得更强约束。
     */
    String TENANT_ID_REGEX = "^[0-9A-Za-z]{1,20}$";

}
