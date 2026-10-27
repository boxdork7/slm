package plus.ruoyi.common.tenant.handle;

import com.baomidou.dynamic.datasource.toolkit.DynamicDataSourceContextHolder;
import com.baomidou.mybatisplus.extension.plugins.inner.TenantLineInnerInterceptor;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import plus.ruoyi.common.core.constant.TenantConstants;
import plus.ruoyi.common.tenant.helper.TenantHelper;
import plus.ruoyi.common.tenant.properties.TenantProperties;
import plus.ruoyi.common.test.base.BaseUnitTest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import static org.junit.jupiter.api.Assertions.*;

/**
 * PlusTenantLineHandler 租户拦截器测试
 * <p>
 * 测试数据源级别的租户隔离功能:
 * <ul>
 *   <li>全局配置的表忽略</li>
 *   <li>数据源级别配置的表忽略</li>
 *   <li>配置累加规则（全局配置 + 数据源级别配置）</li>
 *   <li>切换数据源后的行为</li>
 *   <li>租户ID格式校验与 SQL 注入阻断</li>
 * </ul>
 * <p>
 * <b>租户ID校验相关用例（getTenantId 部分）为 SQL 注入回归防线：</b>
 * 租户ID会被本处理器以 JSqlParser 的 StringValue 拼进 SQL 文本，而 StringValue
 * 不转义单引号，因此租户ID一旦含引号/注释符即可闭合字符串字面量形成注入。
 * 历史上该问题由未校验的 X-Tenant-Id 请求头触达，未登录接口即可利用。
 * <p>
 * <b>为什么用「捕获异常 + 断言类名」而不是 assertThrows(TenantException.class, ...)：</b>
 * TenantException 继承的 BaseException.getMessage() 会调用 MessageUtils，而
 * MessageUtils 的静态字段在类加载时就要 SpringUtils.getBean(MessageSource.class)。
 * 单元测试没有 Spring 上下文，一旦触发 getMessage() 就会抛 ExceptionInInitializerError，
 * 掩盖真实断言结果。所以此处只读异常的 class，绝不读它的 message。
 *
 * @author Claude Code
 */
@DisplayName("PlusTenantLineHandler 租户拦截器测试")
class PlusTenantLineHandlerTest extends BaseUnitTest {

    // ==================== 全局配置测试 ====================

    @Nested
    @DisplayName("全局配置测试")
    class GlobalExcludesTests {

        @Test
        @DisplayName("ignoreTable - 全局配置的表应被忽略")
        void testIgnoreTableWithGlobalExcludes() {
            // 准备配置
            TenantProperties properties = new TenantProperties();
            properties.setExcludes(List.of("sys_config", "sys_dict"));

            // 创建拦截器
            PlusTenantLineHandler handler = new PlusTenantLineHandler(properties);

            // 验证全局配置的表被忽略
            assertTrue(handler.ignoreTable("sys_config"), "全局配置的表应被忽略");
            assertTrue(handler.ignoreTable("sys_dict"), "全局配置的表应被忽略");
            assertTrue(handler.ignoreTable("SYS_CONFIG"), "表名大小写不敏感");
        }

        @Test
        @DisplayName("ignoreTable - 未配置的表不应被忽略")
        void testIgnoreTableWithoutConfig() {
            // 准备配置
            TenantProperties properties = new TenantProperties();
            properties.setExcludes(List.of("sys_config"));

            // 创建拦截器
            PlusTenantLineHandler handler = new PlusTenantLineHandler(properties);

            // 验证未配置的表不被忽略
            assertFalse(handler.ignoreTable("b_ad"), "未配置的表不应被忽略");
            assertFalse(handler.ignoreTable("m_goods"), "未配置的表不应被忽略");
        }

        @Test
        @DisplayName("ignoreTable - 系统固定排除表始终被忽略")
        void testIgnoreTableWithSystemExcludes() {
            // 准备配置（不配置任何排除表）
            TenantProperties properties = new TenantProperties();

            // 创建拦截器
            PlusTenantLineHandler handler = new PlusTenantLineHandler(properties);

            // 验证系统固定排除表被忽略
            assertTrue(handler.ignoreTable("sys_tenant"), "系统固定排除表应被忽略");
            assertTrue(handler.ignoreTable("sys_menu"), "系统固定排除表应被忽略");
            assertTrue(handler.ignoreTable("sys_oss_config"), "系统固定排除表应被忽略");
        }
    }

    // ==================== 数据源级别配置测试 ====================

    @Nested
    @DisplayName("数据源级别配置测试")
    class DataSourceExcludesTests {

        @Test
        @DisplayName("ignoreTable - 数据源级别配置的表应被忽略")
        void testIgnoreTableWithDataSourceExcludes() {
            try (MockedStatic<DynamicDataSourceContextHolder> contextHolderMock =
                     Mockito.mockStatic(DynamicDataSourceContextHolder.class)) {

                // Mock 当前数据源为 master
                contextHolderMock.when(DynamicDataSourceContextHolder::peek)
                    .thenReturn("master");

                // 准备配置
                TenantProperties properties = new TenantProperties();
                Map<String, List<String>> dsExcludes = new HashMap<>();
                dsExcludes.put("master", List.of("sys_config", "sys_dict"));
                properties.setDatasourceExcludes(dsExcludes);

                // 创建拦截器
                PlusTenantLineHandler handler = new PlusTenantLineHandler(properties);

                // 验证数据源级别配置的表被忽略
                assertTrue(handler.ignoreTable("sys_config"),
                    "master 数据源配置的表应被忽略");
                assertTrue(handler.ignoreTable("sys_dict"),
                    "master 数据源配置的表应被忽略");
            }
        }

        @Test
        @DisplayName("ignoreTable - 切换数据源后同名表不应被忽略")
        void testIgnoreTableAfterSwitchDataSource() {
            try (MockedStatic<DynamicDataSourceContextHolder> contextHolderMock =
                     Mockito.mockStatic(DynamicDataSourceContextHolder.class)) {

                // 准备配置：只在 master 数据源忽略 sys_config
                TenantProperties properties = new TenantProperties();
                Map<String, List<String>> dsExcludes = new HashMap<>();
                dsExcludes.put("master", List.of("sys_config"));
                properties.setDatasourceExcludes(dsExcludes);

                // 创建拦截器
                PlusTenantLineHandler handler = new PlusTenantLineHandler(properties);

                // 场景1：在 master 数据源，sys_config 应被忽略
                contextHolderMock.when(DynamicDataSourceContextHolder::peek)
                    .thenReturn("master");
                assertTrue(handler.ignoreTable("sys_config"),
                    "master 数据源的 sys_config 应被忽略");

                // 场景2：切换到 third-party 数据源，sys_config 不应被忽略
                contextHolderMock.when(DynamicDataSourceContextHolder::peek)
                    .thenReturn("third-party");
                assertFalse(handler.ignoreTable("sys_config"),
                    "third-party 数据源的 sys_config 不应被忽略");
            }
        }
    }

    // ==================== 配置规则测试 ====================

    @Nested
    @DisplayName("配置规则测试")
    class ConfigurationRulesTests {

        @Test
        @DisplayName("ignoreTable - 数据源级别配置累加到全局配置")
        void testDataSourceExcludesAdditive() {
            try (MockedStatic<DynamicDataSourceContextHolder> contextHolderMock =
                     Mockito.mockStatic(DynamicDataSourceContextHolder.class)) {

                // Mock 当前数据源为 master
                contextHolderMock.when(DynamicDataSourceContextHolder::peek)
                    .thenReturn("master");

                // 准备配置：全局配置忽略 sys_config 和 sys_dict，master 数据源额外忽略 b_ad
                TenantProperties properties = new TenantProperties();
                properties.setExcludes(List.of("sys_config", "sys_dict"));

                Map<String, List<String>> dsExcludes = new HashMap<>();
                dsExcludes.put("master", List.of("b_ad")); // master 额外忽略 b_ad
                properties.setDatasourceExcludes(dsExcludes);

                // 创建拦截器
                PlusTenantLineHandler handler = new PlusTenantLineHandler(properties);

                // 验证：累加模式 - 全局配置 + 数据源配置都生效
                assertTrue(handler.ignoreTable("b_ad"),
                    "master 数据源配置的表应被忽略");
                assertTrue(handler.ignoreTable("sys_config"),
                    "全局配置的表应被忽略（即使 master 未单独配置）");
                assertTrue(handler.ignoreTable("sys_dict"),
                    "全局配置的表应被忽略（即使 master 未单独配置）");
                assertFalse(handler.ignoreTable("m_goods"),
                    "未在任何配置中的表不应被忽略");
            }
        }

        @Test
        @DisplayName("ignoreTable - 未配置数据源使用全局配置")
        void testFallbackToGlobalExcludes() {
            try (MockedStatic<DynamicDataSourceContextHolder> contextHolderMock =
                     Mockito.mockStatic(DynamicDataSourceContextHolder.class)) {

                // Mock 当前数据源为 slave（未配置数据源级别）
                contextHolderMock.when(DynamicDataSourceContextHolder::peek)
                    .thenReturn("slave");

                // 准备配置
                TenantProperties properties = new TenantProperties();
                properties.setExcludes(List.of("sys_config", "sys_dict"));

                Map<String, List<String>> dsExcludes = new HashMap<>();
                dsExcludes.put("master", List.of("b_ad")); // 只配置 master
                properties.setDatasourceExcludes(dsExcludes);

                // 创建拦截器
                PlusTenantLineHandler handler = new PlusTenantLineHandler(properties);

                // 验证：slave 数据源使用全局配置
                assertTrue(handler.ignoreTable("sys_config"),
                    "未配置的数据源应使用全局配置");
                assertTrue(handler.ignoreTable("sys_dict"),
                    "未配置的数据源应使用全局配置");
                assertFalse(handler.ignoreTable("b_ad"),
                    "未配置的数据源不应使用其他数据源的配置");
            }
        }
    }

    // ==================== 边界条件测试 ====================

    @Nested
    @DisplayName("边界条件测试")
    class BoundaryTests {

        @Test
        @DisplayName("ignoreTable - 表名为null时返回true")
        void testIgnoreTableWithNullTableName() {
            TenantProperties properties = new TenantProperties();
            PlusTenantLineHandler handler = new PlusTenantLineHandler(properties);

            assertTrue(handler.ignoreTable(null), "表名为null时应返回true");
        }

        @Test
        @DisplayName("ignoreTable - 表名为空字符串时返回true")
        void testIgnoreTableWithEmptyTableName() {
            TenantProperties properties = new TenantProperties();
            PlusTenantLineHandler handler = new PlusTenantLineHandler(properties);

            assertTrue(handler.ignoreTable(""), "表名为空字符串时应返回true");
            assertTrue(handler.ignoreTable("   "), "表名为空白字符时应返回true");
        }

        @Test
        @DisplayName("ignoreTable - 数据源名称为null时视为master数据源")
        void testIgnoreTableWithNullDataSource() {
            try (MockedStatic<DynamicDataSourceContextHolder> contextHolderMock =
                     Mockito.mockStatic(DynamicDataSourceContextHolder.class)) {

                // Mock 数据源为 null（表示默认数据源 master）
                contextHolderMock.when(DynamicDataSourceContextHolder::peek)
                    .thenReturn(null);

                // 准备配置：master 数据源配置忽略 sys_config
                TenantProperties properties = new TenantProperties();
                properties.setExcludes(List.of("sys_dict"));  // 全局配置

                Map<String, List<String>> dsExcludes = new HashMap<>();
                dsExcludes.put("master", List.of("sys_config"));  // master 数据源配置
                properties.setDatasourceExcludes(dsExcludes);

                // 创建拦截器
                PlusTenantLineHandler handler = new PlusTenantLineHandler(properties);

                // 验证：null 被视为 master，使用 master 数据源配置
                assertTrue(handler.ignoreTable("sys_config"),
                    "数据源为null时应视为master，使用master数据源配置");
                // 累加模式下全局配置始终生效，因此 sys_dict 同样被忽略。
                // 与 application.yml 中「datasource-excludes 是在全局配置基础上的补充
                // （不是替换）」的说明一致，也与 ignoreTable 的 inGlobalExcludes ||
                // inDataSourceExcludes 实现一致。
                assertTrue(handler.ignoreTable("sys_dict"),
                    "累加模式下全局配置始终生效，不会被数据源级别配置替换");
            }
        }

        @Test
        @DisplayName("ignoreTable - 配置为空时只忽略系统固定表")
        void testIgnoreTableWithEmptyConfig() {
            TenantProperties properties = new TenantProperties();
            PlusTenantLineHandler handler = new PlusTenantLineHandler(properties);

            // 系统固定表应被忽略
            assertTrue(handler.ignoreTable("sys_tenant"), "系统固定表应被忽略");

            // 业务表不应被忽略
            assertFalse(handler.ignoreTable("b_ad"), "业务表不应被忽略");
            assertFalse(handler.ignoreTable("sys_config"), "业务表不应被忽略");
        }
    }

    // ==================== 租户ID格式校验（SQL注入回归防线） ====================

    /**
     * 样例 SQL：sys_user 带 tenant_id 列，会被拦截器追加租户条件
     */
    private static final String SAMPLE_SELECT = "SELECT user_id, user_name FROM sys_user WHERE user_name = ?";

    private static final String SAMPLE_UPDATE = "UPDATE sys_user SET nick_name = ? WHERE user_id = ?";

    /**
     * 在指定租户ID下让真实拦截器改写 SQL
     *
     * @param tenantId 模拟 TenantHelper.getTenantId() 的返回值
     * @param sql      原始 SQL
     * @return 拦截器生成的 SQL；处理器阻断时返回 null
     */
    private static String parseWithTenantId(String tenantId, String sql) {
        try (MockedStatic<TenantHelper> helperMock = Mockito.mockStatic(TenantHelper.class)) {
            helperMock.when(TenantHelper::getTenantId).thenReturn(tenantId);
            TenantLineInnerInterceptor interceptor =
                new TenantLineInnerInterceptor(new PlusTenantLineHandler(new TenantProperties()));
            return interceptor.parserSingle(sql, null);
        } catch (Throwable blocked) {
            // 不读 message（见类注释）
            return null;
        }
    }

    /**
     * 取处理器针对指定租户ID抛出的异常类型简名，未抛异常返回 null
     */
    private static String blockedExceptionNameOf(String tenantId) {
        try (MockedStatic<TenantHelper> helperMock = Mockito.mockStatic(TenantHelper.class)) {
            helperMock.when(TenantHelper::getTenantId).thenReturn(tenantId);
            new PlusTenantLineHandler(new TenantProperties()).getTenantId();
            return null;
        } catch (Throwable blocked) {
            return blocked.getClass().getSimpleName();
        }
    }

    @Nested
    @DisplayName("合法租户ID放行测试")
    class LegitTenantIdTests {

        @ParameterizedTest
        @DisplayName("getTenantId - 合法租户ID正常拼入SQL的租户条件")
        @ValueSource(strings = {
            "000000",               // 默认租户
            "482913",               // 框架 generateTenantId() 生成的 6 位纯数字
            "acmeCorp01",           // 使用者可能自定义的字母数字编号
            "a",                    // 长度下界
            "12345678901234567890", // 长度上界 20 位
            // 0x27 是单引号的十六进制写法，看着危险但全是字母数字：它只会生成
            // tenant_id = '0x27'，数据库不会把字符串字面量内部的 0x27 还原成引号，
            // 构不成注入，因此必须放行。放在这里是为了钉住这个边界，避免后来者
            // 误以为该拦而把正则收紧到影响正常租户ID。
            "0x27"
        })
        void testLegitTenantIdPassesThrough(String tenantId) {
            String sql = parseWithTenantId(tenantId, SAMPLE_SELECT);

            assertNotNull(sql, "合法租户ID [" + tenantId + "] 不应被阻断");
            assertTrue(sql.contains("tenant_id = '" + tenantId + "'"),
                "生成的SQL应包含该租户的过滤条件，实际: " + sql);
        }

        @Test
        @DisplayName("getTenantId - UPDATE 语句同样追加租户条件")
        void testLegitTenantIdOnUpdate() {
            String sql = parseWithTenantId(TenantConstants.DEFAULT_TENANT_ID, SAMPLE_UPDATE);

            assertNotNull(sql);
            assertTrue(sql.contains("tenant_id = '" + TenantConstants.DEFAULT_TENANT_ID + "'"),
                "UPDATE 语句应追加租户条件，实际: " + sql);
        }
    }

    @Nested
    @DisplayName("SQL注入载荷阻断测试")
    class InjectionBlockedTests {

        @ParameterizedTest
        @DisplayName("getTenantId - 注入载荷一律阻断且不生成任何SQL")
        @ValueSource(strings = {
            "000000' OR '1'='1",               // 恒真条件绕过租户隔离
            "x' OR tenant_id LIKE '%",         // 通配符匹配全部租户
            "x' OR SLEEP(5) AND '1'='1",       // 时间盲注
            "x' UNION SELECT 1,2,3 -- ",       // UNION 读取任意表
            "000000' -- ",                     // 行注释截断后续条件
            "000000/*x*/",                     // 内联注释
            "000000 x",                        // 空格
            "'",                               // 裸单引号
            "\"",                              // 双引号
            "000000; DROP TABLE sys_user",     // 分号堆叠语句
            "000000'\nOR 1=1",                 // 换行绕过
            "123456789012345678901",           // 超长值（21 位，超出字段 VARCHAR(20)）
            "000000%00",                       // 空字节截断
            "000000\\",                        // 反斜杠转义
            "0'||'0"                           // 字符串连接
        })
        void testInjectionPayloadIsBlocked(String payload) {
            // 1. 处理器必须抛出租户异常，而不是把载荷放进 SQL 表达式
            assertEquals("TenantException", blockedExceptionNameOf(payload),
                "载荷 [" + payload + "] 必须被处理器阻断");

            // 2. 端到端：真实拦截器不应产出任何 SQL
            assertNull(parseWithTenantId(payload, SAMPLE_SELECT),
                "载荷 [" + payload + "] 不得生成任何SQL");
        }

        @Test
        @DisplayName("getTenantId - 空白租户ID阻断而非降级为默认租户")
        void testBlankTenantIdIsBlocked() {
            // 绝不能静默降级到 000000：那会让非法输入变成一次对管理租户的成功访问
            assertEquals("TenantException", blockedExceptionNameOf(""));
            assertEquals("TenantException", blockedExceptionNameOf("   "));
        }

        @Test
        @DisplayName("getTenantId - null 租户ID阻断且不抛 NPE")
        void testNullTenantIdIsBlocked() {
            assertEquals("TenantException", blockedExceptionNameOf(null),
                "null 应走 isBlank 分支抛 TenantException，而不是 NullPointerException");
        }
    }

    @Nested
    @DisplayName("租户ID格式正则测试")
    class TenantIdRegexTests {

        private final Pattern pattern = Pattern.compile(TenantConstants.TENANT_ID_REGEX);

        @ParameterizedTest
        @DisplayName("正则 - 放行纯字母数字")
        @ValueSource(strings = {"0", "000000", "abcXYZ", "a1b2c3", "12345678901234567890"})
        void testRegexAccepts(String value) {
            assertTrue(pattern.matcher(value).matches(), "值 [" + value + "] 应被放行");
        }

        @ParameterizedTest
        @DisplayName("正则 - 拒绝SQL元字符、空白与超长值")
        @ValueSource(strings = {
            "'", "\"", "`", ";", "--", "/*", "*/", " ", "\t", "\n", "\r",
            "a b", "a'b", "a;b", "a-b", "a_b", "a.b", "a%b", "中文",
            "123456789012345678901", ""
        })
        void testRegexRejects(String value) {
            assertFalse(pattern.matcher(value).matches(), "值 [" + value + "] 必须被拒绝");
        }
    }
}
