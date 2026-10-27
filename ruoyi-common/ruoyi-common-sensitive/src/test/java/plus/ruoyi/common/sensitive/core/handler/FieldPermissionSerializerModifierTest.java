package plus.ruoyi.common.sensitive.core.handler;

import cn.hutool.extra.spring.SpringUtil;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import org.junit.jupiter.api.AfterEach;
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
import plus.ruoyi.common.serialmap.annotation.SerialMap;
import plus.ruoyi.common.test.base.BaseUnitTest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * 字段权限 JSON 出口测试
 *
 * <p>端到端跑真实 ObjectMapper：挂上拦截器后序列化 VO，直接断言 JSON 文本，
 * 而不是断言中间对象——隐藏档要验证的正是"JSON 里连 key 都没有"。</p>
 */
@Tag("dev")
@DisplayName("字段权限 JSON 出口测试")
class FieldPermissionSerializerModifierTest extends BaseUnitTest {

    private static final String RES = "system:user";

    private ObjectMapper mapper;
    private IFieldPermissionService permissionService;
    private SensitiveService sensitiveService;

    private MockedStatic<SpringUtil> springUtil;

    // ==================== 测试用 VO ====================

    /** 未标 @FieldResource：拦截器应完全不介入 */
    @Data
    public static class PlainVo {
        private String userName;
        @Sensitive(strategy = SensitiveStrategy.PHONE)
        private String phone;
    }

    /** 读出口 VO */
    @Data
    @FieldResource(RES)
    public static class UserVo {
        private String userName;
        @Sensitive(strategy = SensitiveStrategy.PHONE)
        private String phone;
        private String idCard;
        private Long balance;
        /** 派生字段：值来自 createBy */
        @SerialMap(source = "createBy")
        private String createByName;
        private Long createBy;
    }

    /** 写入口 BO：不该被 JSON 出口拦截 */
    @Data
    @FieldResource(value = RES, type = FieldClassType.BO)
    public static class UserBo {
        private String userName;
        private String idCard;
    }

    /** 数组形态：隐藏字段不能省略，必须写 null 占位 */
    @Data
    @FieldResource(RES)
    @JsonFormat(shape = JsonFormat.Shape.ARRAY)
    public static class ArrayShapeVo {
        private String userName;
        private String idCard;
        private String email;
    }

    // ==================== 装配 ====================

    @BeforeEach
    void initMocks() {
        springUtil = Mockito.mockStatic(SpringUtil.class);
        permissionService = mock(IFieldPermissionService.class);
        sensitiveService = mock(SensitiveService.class);
        springUtil.when(() -> SpringUtil.getBean(IFieldPermissionService.class)).thenReturn(permissionService);
        springUtil.when(() -> SpringUtil.getBean(SensitiveService.class)).thenReturn(sensitiveService);
        // 默认：无任何动态决策；@Sensitive 判定为"需要脱敏"
        when(permissionService.getDecision(anyString(), anyString())).thenReturn(null);
        when(permissionService.getMaskStrategy(anyString(), anyString())).thenReturn(null);
        when(sensitiveService.isSensitive(any(), any())).thenReturn(true);

        mapper = new ObjectMapper();
        mapper.setSerializerFactory(
            mapper.getSerializerFactory().withSerializerModifier(new FieldPermissionSerializerModifier()));
    }

    @AfterEach
    void closeMocks() {
        if (springUtil != null) {
            springUtil.close();
        }
    }

    private void decide(String field, FieldAccess access) {
        when(permissionService.getDecision(eq(RES), eq(field))).thenReturn(access);
    }

    private UserVo sample() {
        UserVo vo = new UserVo();
        vo.setUserName("张三");
        vo.setPhone("13812345678");
        vo.setIdCard("110101199001011234");
        vo.setBalance(1000L);
        vo.setCreateByName("管理员");
        vo.setCreateBy(1L);
        return vo;
    }

    private String json(Object value) throws Exception {
        return mapper.writeValueAsString(value);
    }

    // ==================== 用例 ====================

    @Nested
    @DisplayName("不拦截的场景")
    class PassThrough {

        @Test
        @DisplayName("未标 @FieldResource 的类：字段全在，@Sensitive 照常打码")
        void plainVoUntouched() throws Exception {
            PlainVo vo = new PlainVo();
            vo.setUserName("张三");
            vo.setPhone("13812345678");

            String out = json(vo);

            assertThat(out).contains("\"userName\":\"张三\"").contains("138****5678");
        }

        @Test
        @DisplayName("类角色为 BO：写入口不经 JSON 出口，不拦截")
        void boNotIntercepted() throws Exception {
            decide("idCard", FieldAccess.HIDDEN);
            UserBo bo = new UserBo();
            bo.setUserName("张三");
            bo.setIdCard("110101199001011234");

            assertThat(json(bo)).contains("idCard").contains("110101199001011234");
        }

        @Test
        @DisplayName("无动态决策：字段全在，@Sensitive 照常打码")
        void noDecisionKeepsAnnotation() throws Exception {
            String out = json(sample());

            assertThat(out).contains("\"idCard\":\"110101199001011234\"");
            assertThat(out).contains("138****5678");
        }
    }

    @Nested
    @DisplayName("隐藏档")
    class Hidden {

        @Test
        @DisplayName("HIDDEN：JSON 里连 key 都没有，不是写 null")
        void hiddenRemovesKey() throws Exception {
            decide("idCard", FieldAccess.HIDDEN);

            String out = json(sample());

            assertThat(out).doesNotContain("idCard");
            assertThat(out).doesNotContain("110101199001011234");
            // 其他字段不受影响
            assertThat(out).contains("\"userName\":\"张三\"");
        }

        @Test
        @DisplayName("数组形态：隐藏字段写 null 占位，避免后续元素错位")
        void hiddenInArrayShapeWritesNull() throws Exception {
            decide("idCard", FieldAccess.HIDDEN);
            ArrayShapeVo vo = new ArrayShapeVo();
            vo.setUserName("张三");
            vo.setIdCard("110101199001011234");
            vo.setEmail("a@b.com");

            String out = json(vo);

            assertThat(out).startsWith("[").endsWith("]");
            assertThat(out).doesNotContain("110101199001011234");
            // 三个位置都在：null 占位保证 email 仍在第 3 位
            assertThat(out).isEqualTo("[\"张三\",null,\"a@b.com\"]");
        }
    }

    @Nested
    @DisplayName("脱敏档")
    class Masked {

        @Test
        @DisplayName("MASKED + 配置策略：按配置的策略打码")
        void maskedWithConfiguredStrategy() throws Exception {
            decide("idCard", FieldAccess.MASKED);
            when(permissionService.getMaskStrategy(RES, "idCard")).thenReturn("ID_CARD");

            String out = json(sample());

            assertThat(out).doesNotContain("110101199001011234");
            assertThat(out).contains("idCard").contains("*");
        }

        @Test
        @DisplayName("MASKED 无配置策略但字段带 @Sensitive：回落注解策略")
        void maskedFallsBackToAnnotationStrategy() throws Exception {
            decide("phone", FieldAccess.MASKED);

            String out = json(sample());

            assertThat(out).contains("138****5678").doesNotContain("13812345678");
        }

        @Test
        @DisplayName("MASKED 非 String 字段：保留 key 写 null，不输出原值")
        void maskedNonStringWritesNull() throws Exception {
            decide("balance", FieldAccess.MASKED);

            String out = json(sample());

            assertThat(out).contains("\"balance\":null");
            assertThat(out).doesNotContain("1000");
        }

        @Test
        @DisplayName("MASKED 配置了不存在的策略：回落不抛异常")
        void maskedWithUnknownStrategy() throws Exception {
            decide("idCard", FieldAccess.MASKED);
            when(permissionService.getMaskStrategy(RES, "idCard")).thenReturn("NOT_EXIST");

            String out = json(sample());

            assertThat(out).doesNotContain("110101199001011234");
        }
    }

    @Nested
    @DisplayName("显式放权覆盖注解")
    class ExplicitGrant {

        @Test
        @DisplayName("WRITABLE + @Sensitive：覆盖注解输出明文")
        void writableOverridesSensitive() throws Exception {
            decide("phone", FieldAccess.WRITABLE);

            String out = json(sample());

            assertThat(out).contains("\"phone\":\"13812345678\"");
            assertThat(out).doesNotContain("138****5678");
        }

        @Test
        @DisplayName("READONLY + @Sensitive：同样输出明文（只读约束的是写入不是读取）")
        void readonlyOverridesSensitive() throws Exception {
            decide("phone", FieldAccess.READONLY);

            assertThat(json(sample())).contains("\"phone\":\"13812345678\"");
        }

        @Test
        @DisplayName("WRITABLE 但字段无 @Sensitive：走原路径，行为不变")
        void writableWithoutSensitiveUnchanged() throws Exception {
            decide("userName", FieldAccess.WRITABLE);

            assertThat(json(sample())).contains("\"userName\":\"张三\"");
        }
    }

    @Nested
    @DisplayName("派生字段联动")
    class DerivedField {

        @Test
        @DisplayName("@SerialMap(source) 指向的源字段被隐藏时，派生字段一并隐藏")
        void derivedHiddenWhenSourceHidden() throws Exception {
            decide("createBy", FieldAccess.HIDDEN);

            String out = json(sample());

            assertThat(out).doesNotContain("createBy");
            // 派生字段也不能留下，否则等于开了一条派生泄露通道
            assertThat(out).doesNotContain("createByName").doesNotContain("管理员");
        }

        @Test
        @DisplayName("源字段未隐藏时派生字段正常输出")
        void derivedKeptWhenSourceVisible() throws Exception {
            assertThat(json(sample())).contains("\"createByName\":\"管理员\"");
        }
    }

    @Nested
    @DisplayName("按类缓存不冻结决策")
    class PerRequestDecision {

        @Test
        @DisplayName("同一个 ObjectMapper 连续两次序列化，档位变化后立即生效")
        void decisionNotFrozenByClassCache() throws Exception {
            // 第一次：无决策，字段可见
            assertThat(json(sample())).contains("110101199001011234");

            // 第二次：改为隐藏（模拟换了一个用户），必须立刻生效
            decide("idCard", FieldAccess.HIDDEN);
            assertThat(json(sample())).doesNotContain("110101199001011234");
        }

        @Test
        @DisplayName("决策服务缺失：原样放行不抛异常")
        void serviceMissingPassesThrough() throws Exception {
            springUtil.when(() -> SpringUtil.getBean(IFieldPermissionService.class))
                .thenThrow(new IllegalStateException("no bean"));

            // 换新 mapper 避开上一次已缓存的序列化器
            ObjectMapper fresh = new ObjectMapper();
            fresh.setSerializerFactory(
                fresh.getSerializerFactory().withSerializerModifier(new FieldPermissionSerializerModifier()));

            assertThat(fresh.writeValueAsString(sample())).contains("110101199001011234");
        }
    }
}