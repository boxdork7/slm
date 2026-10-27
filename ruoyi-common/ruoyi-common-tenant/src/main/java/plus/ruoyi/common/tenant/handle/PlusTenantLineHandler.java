package plus.ruoyi.common.tenant.handle;

import com.baomidou.dynamic.datasource.toolkit.DynamicDataSourceContextHolder;
import com.baomidou.mybatisplus.extension.plugins.handler.TenantLineHandler;
import lombok.extern.slf4j.Slf4j;
import net.sf.jsqlparser.expression.Expression;
import net.sf.jsqlparser.expression.StringValue;
import plus.ruoyi.common.core.constant.I18nKeys;
import plus.ruoyi.common.core.constant.TenantConstants;
import plus.ruoyi.common.core.utils.StringUtils;
import plus.ruoyi.common.tenant.exception.TenantException;
import plus.ruoyi.common.tenant.helper.TenantHelper;
import plus.ruoyi.common.tenant.properties.TenantProperties;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * 自定义多租户SQL处理器（始终启用）
 * <p>
 * 始终为SQL添加租户条件，永远不返回NullValue
 * 这样可以避免开关租户功能导致的数据混乱
 *
 * @author Lion Li
 */
@Slf4j
public class PlusTenantLineHandler implements TenantLineHandler {

    /**
     * 租户ID格式校验器（预编译复用：getTenantId() 每条SQL都会调用，不能每次重新编译正则）
     */
    private static final Pattern TENANT_ID_PATTERN = Pattern.compile(TenantConstants.TENANT_ID_REGEX);

    /**
     * 系统固定排除表（硬编码，防止用户误配置）
     */
    private static final Set<String> SYSTEM_EXCLUDE_TABLES = Set.of(
        "sys_tenant",
        "sys_tenant_package",
        "sys_gen_table",
        "sys_gen_table_column",
        "sys_menu",
        "sys_role_menu",
        "sys_role_dept",
        "sys_user_role",
        "sys_user_post",
        "sys_oss_config",
        // 内置定时任务(ruoyi-job)：调度是平台级能力，由平台运维统一管理，两张表均无 tenant_id 列。
        // 执行器是随应用部署的 Java 代码，租户无法自行新增任务；需要按租户处理业务时，
        // 由执行器内部用 TenantHelper.dynamic() 遍历租户。
        // 硬编码而非放在 yml 的 tenant.excludes：漏配会让 SQL 拼上不存在的 tenant_id 列而直接报错，
        // 属于「配错就必崩」的项，不该交给使用者维护。
        "job_info",
        "job_log",
        // 字段级权限的资源注册表：记录「哪个 VO/BO 类属于哪个资源」，是随代码走的结构元数据，与 sys_menu 同性质。
        // 若按租户隔离，新租户开通后绑定表为空 → 序列化层查不到资源 → 全部放行，等于新租户零保护。
        // 由 @FieldResource 注解启动扫描自动登记，两张表均无 tenant_id 列；sys_field_permission（谁能看什么）仍是租户级，不在此列。
        "sys_field_resource",
        "sys_field_resource_class"
    );

    /**
     * 全局排除表集合（系统表 + 全局配置表）
     * 应用到所有数据源
     */
    private final Set<String> globalExcludes;

    /**
     * 数据源级别排除表配置
     * Key: 数据源名称
     * Value: 该数据源的排除表集合
     */
    private final Map<String, Set<String>> datasourceExcludes;

    public PlusTenantLineHandler(TenantProperties tenantProperties) {
        // 构建全局排除表集合（系统表 + 全局配置表）
        this.globalExcludes = Stream.concat(
                // 系统固定排除表
                SYSTEM_EXCLUDE_TABLES.stream(),
                // 全局配置的排除表
                tenantProperties.getExcludes() != null ?
                    tenantProperties.getExcludes().stream() : Stream.empty()
            )
            .map(String::toLowerCase)
            .collect(Collectors.toSet());

        // 构建数据源级别排除表配置
        this.datasourceExcludes = new HashMap<>();
        if (tenantProperties.getDatasourceExcludes() != null) {
            tenantProperties.getDatasourceExcludes().forEach((datasource, tables) -> {
                Set<String> tableSet = tables.stream()
                    .map(String::toLowerCase)
                    .collect(Collectors.toSet());
                datasourceExcludes.put(datasource, tableSet);
            });
        }

        log.info("多租户拦截器已启用（始终生效），全局排除表: {}, 数据源级别配置: {}",
            globalExcludes, datasourceExcludes);
    }

    /**
     * 获取租户ID表达式（始终返回有效值）
     * <p>
     * 无论租户功能是否开启，都返回有效的租户ID
     * 这样可以确保所有数据都有明确的租户归属
     *
     * @return 租户ID的SQL表达式，永远不为null
     * @throws TenantException 租户ID格式非法时直接中断，不生成SQL
     */
    @Override
    public Expression getTenantId() {
        // 直接使用TenantHelper.getTenantId()，它已经保证返回有效值
        String tenantId = TenantHelper.getTenantId();

        // 兜底校验：StringValue 会把租户ID原样拼成 SQL 字符串字面量且不转义单引号，
        // 这里是租户ID进入 SQL 文本的最后一道关口。入口层（getTenantIdByRequest）
        // 已做过校验，此处再校验一次是为了防住"新增了未校验的租户ID来源"这类回归。
        // 一旦不合法就抛异常中断，绝不能降级为默认租户 000000 后继续拼SQL——
        // 那会把一次攻击尝试变成一次成功的越权读取。
        if (StringUtils.isBlank(tenantId) || !TENANT_ID_PATTERN.matcher(tenantId).matches()) {
            // 外部请求头已由 TenantHeaderFilter 拦在最外层，走到这里通常意味着代码内部
            // 存在未经校验的租户ID来源（如直接 setDynamic 了不可信值）。
            // 日志值仍做截断与换行清理，避免万一是外部输入时被用来伪造日志行。
            String logValue = tenantId == null ? "null"
                : tenantId.substring(0, Math.min(tenantId.length(), 32)).replace('\r', '_').replace('\n', '_');
            log.error("租户ID格式非法，已阻断SQL生成: [{}]", logValue);
            throw new TenantException(I18nKeys.Tenant.ID_INVALID);
        }

        return new StringValue(tenantId);
    }

    /**
     * 判断是否忽略指定表的租户过滤（支持数据源级别配置）
     * <p>
     * 配置规则（累加模式）：
     * 1. 全局配置的排除表始终生效（应用到所有数据源）
     * 2. 数据源级别配置是在全局配置基础上的补充（不是替换）
     * 3. 最终结果：表在全局配置中 OR 表在当前数据源配置中 → 忽略租户过滤
     *
     * @param tableName 表名
     * @return true：忽略租户过滤，false：应用租户过滤
     */
    @Override
    public boolean ignoreTable(String tableName) {
        if (StringUtils.isBlank(tableName)) {
            return true;
        }

        String lowerTableName = tableName.toLowerCase();

        // 获取当前数据源名称（null 表示默认数据源 master）
        String currentDataSource = DynamicDataSourceContextHolder.peek();
        if (currentDataSource == null) {
            currentDataSource = "master";
        }

        // 检查全局配置（始终生效）
        boolean inGlobalExcludes = globalExcludes.contains(lowerTableName);

        // 检查数据源级别配置（如果存在）
        boolean inDataSourceExcludes = datasourceExcludes.containsKey(currentDataSource)
            && datasourceExcludes.get(currentDataSource).contains(lowerTableName);

        // 累加模式：在全局配置中 OR 在数据源配置中 → 忽略租户过滤
        boolean shouldIgnore = inGlobalExcludes || inDataSourceExcludes;

        if (log.isDebugEnabled()) {
            log.debug("数据源 [{}] 表 [{}] 租户过滤: {} (全局: {}, 数据源: {})",
                currentDataSource, tableName,
                shouldIgnore ? "忽略" : "应用",
                inGlobalExcludes, inDataSourceExcludes);
        }

        return shouldIgnore;
    }
}
