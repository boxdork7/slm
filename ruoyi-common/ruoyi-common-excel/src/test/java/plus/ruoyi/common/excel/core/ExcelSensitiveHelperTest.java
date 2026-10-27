package plus.ruoyi.common.excel.core;

import cn.hutool.extra.spring.SpringUtil;
import lombok.Data;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import plus.ruoyi.common.core.field.FieldAccess;
import plus.ruoyi.common.core.field.FieldClassType;
import plus.ruoyi.common.core.field.FieldResource;
import plus.ruoyi.common.core.field.IFieldPermissionService;
import plus.ruoyi.common.sensitive.annotation.Sensitive;
import plus.ruoyi.common.sensitive.core.SensitiveService;
import plus.ruoyi.common.sensitive.core.SensitiveStrategy;
import plus.ruoyi.common.test.base.BaseUnitTest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * ExcelSensitiveHelper 导出脱敏助手测试
 *
 * <p>覆盖点：需脱敏 / 不需脱敏两态、非 String 字段过滤、原列表不被污染、服务缺失容错、null 值处理</p>
 */
@Tag("dev")
@DisplayName("ExcelSensitiveHelper 导出脱敏助手测试")
class ExcelSensitiveHelperTest extends BaseUnitTest {

    /**
     * 测试用 VO：覆盖 String 敏感字段、非 String 敏感字段、普通字段
     */
    @Data
    public static class UserExportVo {
        private Long userId;
        private String userName;

        @Sensitive(strategy = SensitiveStrategy.PHONE, roleKey = {"admin"})
        private String phone;

        @Sensitive(strategy = SensitiveStrategy.ID_CARD)
        private String idCard;

        /** 非 String 类型：@Sensitive 不应生效，与 JSON 出口一致 */
        @Sensitive(strategy = SensitiveStrategy.USER_ID)
        private Long secretNo;
    }

    /**
     * 无任何敏感字段的 VO
     */
    @Data
    public static class PlainVo {
        private Long id;
        private String name;
    }

    @BeforeEach
    void resetCache() {
        // 字段元数据按类缓存，用例间清一次避免相互影响
        ExcelSensitiveHelper.clearCache();
    }

    private static UserExportVo sample() {
        UserExportVo vo = new UserExportVo();
        vo.setUserId(1L);
        vo.setUserName("张三");
        vo.setPhone("13812345678");
        vo.setIdCard("110101199001011234");
        vo.setSecretNo(9527L);
        return vo;
    }

    @Nested
    @DisplayName("字段解析")
    class ResolveTests {

        @Test
        @DisplayName("只解析 String 类型的 @Sensitive 字段，非 String 被过滤")
        void testOnlyStringFieldsResolved() {
            Set<String> names = ExcelSensitiveHelper.sensitiveFieldNames(UserExportVo.class);
            assertThat(names).containsExactlyInAnyOrder("phone", "idCard");
            assertThat(names).doesNotContain("secretNo", "userName", "userId");
        }

        @Test
        @DisplayName("无敏感字段的类解析结果为空")
        void testPlainVoHasNoSensitiveFields() {
            assertThat(ExcelSensitiveHelper.sensitiveFieldNames(PlainVo.class)).isEmpty();
        }

        @Test
        @DisplayName("resolveExcludeFields 当前阶段恒为空集（隐藏档留给字段级权限）")
        void testExcludeFieldsEmpty() {
            assertThat(ExcelSensitiveHelper.resolveExcludeFields(UserExportVo.class)).isEmpty();
        }
    }

    @Nested
    @DisplayName("脱敏执行")
    class MaskTests {

        @Test
        @DisplayName("需要脱敏时：敏感字段变掩码，普通字段与非 String 字段保持原值")
        void testMaskWhenSensitive() {
            try (MockedStatic<SpringUtil> springUtilMock = Mockito.mockStatic(SpringUtil.class)) {
                SensitiveService service = mock(SensitiveService.class);
                when(service.isSensitive(any(), any())).thenReturn(true);
                springUtilMock.when(() -> SpringUtil.getBean(SensitiveService.class)).thenReturn(service);

                List<UserExportVo> masked = ExcelSensitiveHelper.maskList(List.of(sample()), UserExportVo.class);

                assertThat(masked).hasSize(1);
                UserExportVo row = masked.get(0);
                assertThat(row.getPhone()).isEqualTo("138****5678");
                assertThat(row.getIdCard()).isNotEqualTo("110101199001011234").contains("*");
                assertThat(row.getUserName()).isEqualTo("张三");
                assertThat(row.getSecretNo()).isEqualTo(9527L);
            }
        }

        @Test
        @DisplayName("需要脱敏时：不就地修改入参，原列表对象保持明文")
        void testOriginalListNotMutated() {
            try (MockedStatic<SpringUtil> springUtilMock = Mockito.mockStatic(SpringUtil.class)) {
                SensitiveService service = mock(SensitiveService.class);
                when(service.isSensitive(any(), any())).thenReturn(true);
                springUtilMock.when(() -> SpringUtil.getBean(SensitiveService.class)).thenReturn(service);

                UserExportVo original = sample();
                List<UserExportVo> input = new ArrayList<>(List.of(original));
                List<UserExportVo> masked = ExcelSensitiveHelper.maskList(input, UserExportVo.class);

                assertThat(masked).isNotSameAs(input);
                assertThat(masked.get(0)).isNotSameAs(original);
                // 缓存 / 调用方复用的对象不能被写入掩码
                assertThat(original.getPhone()).isEqualTo("13812345678");
                assertThat(original.getIdCard()).isEqualTo("110101199001011234");
            }
        }

        @Test
        @DisplayName("不需要脱敏时：返回入参本身（零拷贝），值保持原样")
        void testNoMaskWhenAuthorized() {
            try (MockedStatic<SpringUtil> springUtilMock = Mockito.mockStatic(SpringUtil.class)) {
                SensitiveService service = mock(SensitiveService.class);
                when(service.isSensitive(any(), any())).thenReturn(false);
                springUtilMock.when(() -> SpringUtil.getBean(SensitiveService.class)).thenReturn(service);

                List<UserExportVo> input = List.of(sample());
                List<UserExportVo> result = ExcelSensitiveHelper.maskList(input, UserExportVo.class);

                assertThat(result).isSameAs(input);
                assertThat(result.get(0).getPhone()).isEqualTo("13812345678");
            }
        }

        @Test
        @DisplayName("无敏感字段的类：不触发权限判定，直接返回入参")
        void testPlainVoPassThrough() {
            PlainVo vo = new PlainVo();
            vo.setId(1L);
            vo.setName("plain");
            List<PlainVo> input = List.of(vo);
            // 不 mock SpringUtil：若此处触发了 getBean 会因无 Spring 上下文抛异常
            List<PlainVo> result = ExcelSensitiveHelper.maskList(input, PlainVo.class);
            assertThat(result).isSameAs(input);
        }

        @Test
        @DisplayName("空列表 / null 列表：原样返回")
        void testEmptyAndNullList() {
            assertThat(ExcelSensitiveHelper.maskList(null, UserExportVo.class)).isNull();
            List<UserExportVo> empty = new ArrayList<>();
            assertThat(ExcelSensitiveHelper.maskList(empty, UserExportVo.class)).isSameAs(empty);
        }

        @Test
        @DisplayName("敏感字段值为 null 时不经过脱敏器，保持 null；列表中的 null 行保留")
        void testNullValueAndNullRow() {
            try (MockedStatic<SpringUtil> springUtilMock = Mockito.mockStatic(SpringUtil.class)) {
                SensitiveService service = mock(SensitiveService.class);
                when(service.isSensitive(any(), any())).thenReturn(true);
                springUtilMock.when(() -> SpringUtil.getBean(SensitiveService.class)).thenReturn(service);

                UserExportVo vo = sample();
                vo.setPhone(null);
                List<UserExportVo> result = ExcelSensitiveHelper.maskList(Arrays.asList(vo, null), UserExportVo.class);

                assertThat(result).hasSize(2);
                assertThat(result.get(0).getPhone()).isNull();
                assertThat(result.get(0).getIdCard()).contains("*");
                assertThat(result.get(1)).isNull();
            }
        }
    }

    @Nested
    @DisplayName("容错：拿不到判定服务时宁可多打码")
    class FallbackTests {

        @Test
        @DisplayName("SensitiveService 为 null：按脱敏处理")
        void testServiceMissingMasks() {
            try (MockedStatic<SpringUtil> springUtilMock = Mockito.mockStatic(SpringUtil.class)) {
                springUtilMock.when(() -> SpringUtil.getBean(SensitiveService.class)).thenReturn(null);

                List<UserExportVo> masked = ExcelSensitiveHelper.maskList(List.of(sample()), UserExportVo.class);
                assertThat(masked.get(0).getPhone()).isEqualTo("138****5678");
            }
        }

        @Test
        @DisplayName("判定抛异常（如定时任务无登录上下文）：按脱敏处理")
        void testServiceThrowsMasks() {
            try (MockedStatic<SpringUtil> springUtilMock = Mockito.mockStatic(SpringUtil.class)) {
                SensitiveService service = mock(SensitiveService.class);
                when(service.isSensitive(any(), any())).thenThrow(new IllegalStateException("no login context"));
                springUtilMock.when(() -> SpringUtil.getBean(SensitiveService.class)).thenReturn(service);

                List<UserExportVo> masked = ExcelSensitiveHelper.maskList(List.of(sample()), UserExportVo.class);
                assertThat(masked.get(0).getPhone()).isEqualTo("138****5678");
                assertThat(masked.get(0).getIdCard()).contains("*");
            }
        }
    }

    // ==================== 字段权限接入（步骤 8） ====================

    /**
     * 标了 @FieldResource 的读出口 VO：走字段权限决策
     */
    @Data
    @FieldResource("system:user")
    public static class GuardedExportVo {
        private Long userId;
        private String userName;

        @Sensitive(strategy = SensitiveStrategy.PHONE)
        private String phone;

        private String idCard;
        private Long balance;
    }

    /**
     * 写入口 BO：JSON / Excel 读出口都不该拦它
     */
    @Data
    @FieldResource(value = "system:user", type = FieldClassType.BO)
    public static class GuardedBo {
        private String userName;
        private String idCard;
    }

    private static GuardedExportVo guarded() {
        GuardedExportVo vo = new GuardedExportVo();
        vo.setUserId(1L);
        vo.setUserName("张三");
        vo.setPhone("13812345678");
        vo.setIdCard("110101199001011234");
        vo.setBalance(1000L);
        return vo;
    }

    @Nested
    @DisplayName("字段权限接入")
    class FieldPermissionTests {

        /**
         * 统一装配：脱敏服务默认判"要脱敏"，字段权限默认"无动态决策"
         */
        private void stub(MockedStatic<SpringUtil> springUtilMock, IFieldPermissionService permission) {
            SensitiveService sensitive = mock(SensitiveService.class);
            when(sensitive.isSensitive(any(), any())).thenReturn(true);
            springUtilMock.when(() -> SpringUtil.getBean(SensitiveService.class)).thenReturn(sensitive);
            springUtilMock.when(() -> SpringUtil.getBean(IFieldPermissionService.class)).thenReturn(permission);
        }

        private IFieldPermissionService noDecision() {
            IFieldPermissionService permission = mock(IFieldPermissionService.class);
            when(permission.getDecision(anyString(), anyString())).thenReturn(null);
            when(permission.getMaskStrategy(anyString(), anyString())).thenReturn(null);
            return permission;
        }

        @Test
        @DisplayName("HIDDEN：整列排除，连表头都不留")
        void hiddenExcludesColumn() {
            try (MockedStatic<SpringUtil> springUtilMock = Mockito.mockStatic(SpringUtil.class)) {
                IFieldPermissionService permission = noDecision();
                when(permission.getDecision("system:user", "idCard")).thenReturn(FieldAccess.HIDDEN);
                stub(springUtilMock, permission);

                Set<String> excludes = ExcelSensitiveHelper.resolveExcludeFields(GuardedExportVo.class);

                assertThat(excludes).containsExactly("idCard");
            }
        }

        @Test
        @DisplayName("MASKED + 配置策略：按配置打码")
        void maskedWithConfiguredStrategy() {
            try (MockedStatic<SpringUtil> springUtilMock = Mockito.mockStatic(SpringUtil.class)) {
                IFieldPermissionService permission = noDecision();
                when(permission.getDecision("system:user", "idCard")).thenReturn(FieldAccess.MASKED);
                when(permission.getMaskStrategy("system:user", "idCard")).thenReturn("ID_CARD");
                stub(springUtilMock, permission);

                List<GuardedExportVo> masked = ExcelSensitiveHelper.maskList(List.of(guarded()), GuardedExportVo.class);

                assertThat(masked.get(0).getIdCard()).isNotEqualTo("110101199001011234").contains("*");
            }
        }

        @Test
        @DisplayName("MASKED 非 String 字段：置空，与 JSON 出口写 null 对齐")
        void maskedNonStringNulled() {
            try (MockedStatic<SpringUtil> springUtilMock = Mockito.mockStatic(SpringUtil.class)) {
                IFieldPermissionService permission = noDecision();
                when(permission.getDecision("system:user", "balance")).thenReturn(FieldAccess.MASKED);
                stub(springUtilMock, permission);

                List<GuardedExportVo> masked = ExcelSensitiveHelper.maskList(List.of(guarded()), GuardedExportVo.class);

                assertThat(masked.get(0).getBalance()).isNull();
                assertThat(masked.get(0).getUserName()).isEqualTo("张三");
            }
        }

        @Test
        @DisplayName("显式放权 WRITABLE：覆盖 @Sensitive 导出明文")
        void writableOverridesSensitive() {
            try (MockedStatic<SpringUtil> springUtilMock = Mockito.mockStatic(SpringUtil.class)) {
                IFieldPermissionService permission = noDecision();
                when(permission.getDecision("system:user", "phone")).thenReturn(FieldAccess.WRITABLE);
                stub(springUtilMock, permission);

                List<GuardedExportVo> masked = ExcelSensitiveHelper.maskList(List.of(guarded()), GuardedExportVo.class);

                assertThat(masked.get(0).getPhone()).isEqualTo("13812345678");
            }
        }

        @Test
        @DisplayName("无动态决策：回落 @Sensitive 静态兜底")
        void noDecisionFallsBackToAnnotation() {
            try (MockedStatic<SpringUtil> springUtilMock = Mockito.mockStatic(SpringUtil.class)) {
                stub(springUtilMock, noDecision());

                List<GuardedExportVo> masked = ExcelSensitiveHelper.maskList(List.of(guarded()), GuardedExportVo.class);

                assertThat(masked.get(0).getPhone()).isEqualTo("138****5678");
                // 无注解无决策的字段不动
                assertThat(masked.get(0).getIdCard()).isEqualTo("110101199001011234");
            }
        }

        @Test
        @DisplayName("类角色为 BO：读出口不拦截")
        void boNotIntercepted() {
            try (MockedStatic<SpringUtil> springUtilMock = Mockito.mockStatic(SpringUtil.class)) {
                IFieldPermissionService permission = noDecision();
                when(permission.getDecision(anyString(), anyString())).thenReturn(FieldAccess.HIDDEN);
                stub(springUtilMock, permission);

                assertThat(ExcelSensitiveHelper.resolveExcludeFields(GuardedBo.class)).isEmpty();
            }
        }

        @Test
        @DisplayName("HIDDEN 时不再改值：整列已排除，避免多余拷贝")
        void hiddenSkipsValueRewrite() {
            try (MockedStatic<SpringUtil> springUtilMock = Mockito.mockStatic(SpringUtil.class)) {
                IFieldPermissionService permission = noDecision();
                when(permission.getDecision("system:user", "idCard")).thenReturn(FieldAccess.HIDDEN);
                stub(springUtilMock, permission);

                GuardedExportVo origin = guarded();
                List<GuardedExportVo> input = List.of(origin);
                List<GuardedExportVo> result = ExcelSensitiveHelper.maskList(input, GuardedExportVo.class);

                // phone 仍要按注解脱敏，所以会拷贝；但 idCard 不被改写（由列排除负责）
                assertThat(result.get(0).getIdCard()).isEqualTo("110101199001011234");
                assertThat(origin.getPhone()).isEqualTo("13812345678");
            }
        }

        @Test
        @DisplayName("决策服务缺失：退回 @Sensitive 静态兜底，不抛异常")
        void permissionServiceMissing() {
            try (MockedStatic<SpringUtil> springUtilMock = Mockito.mockStatic(SpringUtil.class)) {
                SensitiveService sensitive = mock(SensitiveService.class);
                when(sensitive.isSensitive(any(), any())).thenReturn(true);
                springUtilMock.when(() -> SpringUtil.getBean(SensitiveService.class)).thenReturn(sensitive);
                springUtilMock.when(() -> SpringUtil.getBean(IFieldPermissionService.class))
                    .thenThrow(new IllegalStateException("no bean"));

                assertThat(ExcelSensitiveHelper.resolveExcludeFields(GuardedExportVo.class)).isEmpty();
                List<GuardedExportVo> masked = ExcelSensitiveHelper.maskList(List.of(guarded()), GuardedExportVo.class);
                assertThat(masked.get(0).getPhone()).isEqualTo("138****5678");
            }
        }
    }

    // ==================== 导入拦截（步骤 9b） ====================

    /**
     * 导入 VO
     */
    @Data
    @FieldResource(value = "system:user", type = FieldClassType.IMPORT)
    public static class GuardedImportVo {
        private String userName;
        private String phone;
        private String idCard;
        private Long deptId;
    }

    /**
     * 未标注解的导入 VO：不该被拦
     */
    @Data
    public static class PlainImportVo {
        private String userName;
        private String idCard;
    }

    private static GuardedImportVo imported() {
        GuardedImportVo vo = new GuardedImportVo();
        vo.setUserName("张三");
        vo.setPhone("13812345678");
        vo.setIdCard("110101199001011234");
        vo.setDeptId(100L);
        return vo;
    }

    @Nested
    @DisplayName("导入拦截")
    class ImportGuardTests {

        private IFieldPermissionService stubImport(MockedStatic<SpringUtil> springUtilMock) {
            IFieldPermissionService permission = mock(IFieldPermissionService.class);
            when(permission.isEnabled()).thenReturn(true);
            when(permission.getDecision(anyString(), anyString())).thenReturn(null);
            when(permission.getFieldLabel(anyString(), anyString())).thenAnswer(inv -> inv.getArgument(1));
            when(permission.resolveResource(any(), any())).thenAnswer(inv -> {
                Class<?> clazz = inv.getArgument(0);
                FieldClassType expected = inv.getArgument(1);
                FieldResource fr = clazz.getAnnotation(FieldResource.class);
                return fr == null || fr.type() != expected ? null : fr.value();
            });
            springUtilMock.when(() -> SpringUtil.getBean(IFieldPermissionService.class)).thenReturn(permission);
            return permission;
        }

        @Test
        @DisplayName("只读档：导入列被置 null（NOT_NULL 策略下等于不更新该列）")
        void readonlyColumnNulled() {
            try (MockedStatic<SpringUtil> springUtilMock = Mockito.mockStatic(SpringUtil.class)) {
                IFieldPermissionService permission = stubImport(springUtilMock);
                when(permission.getDecision("system:user", "idCard")).thenReturn(FieldAccess.READONLY);

                GuardedImportVo row = imported();
                ExcelSensitiveHelper.guardImported(List.of(row), GuardedImportVo.class);

                assertThat(row.getIdCard()).isNull();
                assertThat(row.getUserName()).isEqualTo("张三");
            }
        }

        @Test
        @DisplayName("脱敏档：也拦——放行会把掩码串写进库")
        void maskedColumnNulled() {
            try (MockedStatic<SpringUtil> springUtilMock = Mockito.mockStatic(SpringUtil.class)) {
                IFieldPermissionService permission = stubImport(springUtilMock);
                when(permission.getDecision("system:user", "phone")).thenReturn(FieldAccess.MASKED);

                GuardedImportVo row = imported();
                ExcelSensitiveHelper.guardImported(List.of(row), GuardedImportVo.class);

                assertThat(row.getPhone()).isNull();
            }
        }

        @Test
        @DisplayName("可写 / 无决策：不拦")
        void writableAndNoDecisionPass() {
            try (MockedStatic<SpringUtil> springUtilMock = Mockito.mockStatic(SpringUtil.class)) {
                IFieldPermissionService permission = stubImport(springUtilMock);
                when(permission.getDecision("system:user", "phone")).thenReturn(FieldAccess.WRITABLE);

                GuardedImportVo row = imported();
                ExcelSensitiveHelper.guardImported(List.of(row), GuardedImportVo.class);

                assertThat(row.getPhone()).isEqualTo("13812345678");
                assertThat(row.getIdCard()).isEqualTo("110101199001011234");
            }
        }

        @Test
        @DisplayName("未标注解的导入 VO：放行")
        void plainImportVoUntouched() {
            try (MockedStatic<SpringUtil> springUtilMock = Mockito.mockStatic(SpringUtil.class)) {
                IFieldPermissionService permission = stubImport(springUtilMock);
                when(permission.getDecision(anyString(), anyString())).thenReturn(FieldAccess.HIDDEN);

                PlainImportVo row = new PlainImportVo();
                row.setIdCard("110101199001011234");
                ExcelSensitiveHelper.guardImported(List.of(row), PlainImportVo.class);

                assertThat(row.getIdCard()).isEqualTo("110101199001011234");
            }
        }

        @Test
        @DisplayName("批量：每行都拦，且就地改写")
        void batchRowsGuardedInPlace() {
            try (MockedStatic<SpringUtil> springUtilMock = Mockito.mockStatic(SpringUtil.class)) {
                IFieldPermissionService permission = stubImport(springUtilMock);
                when(permission.getDecision("system:user", "idCard")).thenReturn(FieldAccess.READONLY);

                GuardedImportVo a = imported();
                GuardedImportVo b = imported();
                List<GuardedImportVo> input = List.of(a, b);
                List<GuardedImportVo> result = ExcelSensitiveHelper.guardImported(input, GuardedImportVo.class);

                // 就地改写：返回入参本身
                assertThat(result).isSameAs(input);
                assertThat(a.getIdCard()).isNull();
                assertThat(b.getIdCard()).isNull();
            }
        }

        @Test
        @DisplayName("单行拦截：供逐行 Listener 使用，返回是否有字段被拦")
        void guardSingleRow() {
            try (MockedStatic<SpringUtil> springUtilMock = Mockito.mockStatic(SpringUtil.class)) {
                IFieldPermissionService permission = stubImport(springUtilMock);
                when(permission.getDecision("system:user", "idCard")).thenReturn(FieldAccess.READONLY);

                GuardedImportVo row = imported();
                boolean blocked = ExcelSensitiveHelper.guardImportedRow(row, GuardedImportVo.class);

                assertThat(blocked).isTrue();
                assertThat(row.getIdCard()).isNull();

                // 无字段被拦时返回 false
                GuardedImportVo clean = imported();
                clean.setIdCard(null);
                assertThat(ExcelSensitiveHelper.guardImportedRow(clean, GuardedImportVo.class)).isFalse();
            }
        }

        @Test
        @DisplayName("全局开关关闭：不介入")
        void disabledSwitchSkips() {
            try (MockedStatic<SpringUtil> springUtilMock = Mockito.mockStatic(SpringUtil.class)) {
                IFieldPermissionService permission = stubImport(springUtilMock);
                when(permission.isEnabled()).thenReturn(false);
                when(permission.getDecision(anyString(), anyString())).thenReturn(FieldAccess.HIDDEN);

                GuardedImportVo row = imported();
                ExcelSensitiveHelper.guardImported(List.of(row), GuardedImportVo.class);

                assertThat(row.getIdCard()).isEqualTo("110101199001011234");
            }
        }

        @Test
        @DisplayName("决策服务缺失：放行不抛异常")
        void serviceMissingPasses() {
            try (MockedStatic<SpringUtil> springUtilMock = Mockito.mockStatic(SpringUtil.class)) {
                springUtilMock.when(() -> SpringUtil.getBean(IFieldPermissionService.class))
                    .thenThrow(new IllegalStateException("no bean"));

                GuardedImportVo row = imported();
                ExcelSensitiveHelper.guardImported(List.of(row), GuardedImportVo.class);

                assertThat(row.getIdCard()).isEqualTo("110101199001011234");
            }
        }
    }
}