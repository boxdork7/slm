package plus.ruoyi.common.web.aspect;

import cn.hutool.extra.spring.SpringUtil;
import lombok.Data;
import org.aspectj.lang.JoinPoint;
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
import plus.ruoyi.common.core.field.FieldPermissionHelper;
import plus.ruoyi.common.core.field.FieldResource;
import plus.ruoyi.common.core.field.IFieldPermissionService;
import plus.ruoyi.common.test.base.BaseUnitTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * 字段权限写入拦截测试
 *
 * <p>直接调切面的 {@code guard(JoinPoint)}，用 mock 的 JoinPoint 提供入参，
 * 避开 AspectJ 织入——要验证的是"哪些字段被置 null"，不是 Spring AOP 本身。</p>
 */
@Tag("dev")
@DisplayName("字段权限写入拦截测试")
class FieldWriteGuardAspectTest extends BaseUnitTest {

    private static final String RES = "system:user";

    private FieldWriteGuardAspect aspect;
    private IFieldPermissionService permission;
    private MockedStatic<SpringUtil> springUtil;

    /** 写入口 BO */
    @Data
    @FieldResource(value = RES, type = FieldClassType.BO)
    public static class UserBo {
        private Long userId;
        private String userName;
        private String phone;
        private String idCard;
        private Long deptId;
    }

    /** 未标注解的 BO：不该被拦 */
    @Data
    public static class PlainBo {
        private String userName;
        private String idCard;
    }

    /** 读出口 VO：类角色不匹配，写入拦截不该认它 */
    @Data
    @FieldResource(RES)
    public static class UserVo {
        private String userName;
        private String idCard;
    }

    @BeforeEach
    void initMocks() {
        FieldWriteGuardAspect.clearCache();
        FieldPermissionHelper.clear();
        aspect = new FieldWriteGuardAspect();

        springUtil = Mockito.mockStatic(SpringUtil.class);
        permission = mock(IFieldPermissionService.class);
        springUtil.when(() -> SpringUtil.getBean(IFieldPermissionService.class)).thenReturn(permission);

        when(permission.isEnabled()).thenReturn(true);
        when(permission.getDecision(anyString(), anyString())).thenReturn(null);
        // 默认标签解析返回字段名本身
        when(permission.getFieldLabel(anyString(), anyString())).thenAnswer(inv -> inv.getArgument(1));
        // 只有 BO 类型 + 标了注解的类才反查到资源
        when(permission.resolveResource(any(), any())).thenAnswer(inv -> {
            Class<?> clazz = inv.getArgument(0);
            FieldClassType expected = inv.getArgument(1);
            FieldResource fr = clazz.getAnnotation(FieldResource.class);
            if (fr == null || fr.type() != expected) {
                return null;
            }
            return fr.value();
        });
    }

    @AfterEach
    void closeMocks() {
        FieldPermissionHelper.clear();
        if (springUtil != null) {
            springUtil.close();
        }
    }

    private JoinPoint pointOf(Object... args) {
        JoinPoint point = mock(JoinPoint.class);
        when(point.getArgs()).thenReturn(args);
        return point;
    }

    private UserBo sample() {
        UserBo bo = new UserBo();
        bo.setUserId(1L);
        bo.setUserName("张三");
        bo.setPhone("13812345678");
        bo.setIdCard("110101199001011234");
        bo.setDeptId(100L);
        return bo;
    }

    @Nested
    @DisplayName("拦截行为")
    class Guard {

        @Test
        @DisplayName("只读档：字段被置 null（updateStrategy=NOT_NULL 下等价于保持原值）")
        void readonlyFieldNulled() {
            when(permission.getDecision(RES, "idCard")).thenReturn(FieldAccess.READONLY);
            UserBo bo = sample();

            aspect.guard(pointOf(bo));

            assertThat(bo.getIdCard()).isNull();
            assertThat(bo.getUserName()).isEqualTo("张三");
            assertThat(FieldPermissionHelper.getIgnoredFields()).containsExactly("idCard");
        }

        @Test
        @DisplayName("隐藏档：同样拦截")
        void hiddenFieldNulled() {
            when(permission.getDecision(RES, "idCard")).thenReturn(FieldAccess.HIDDEN);
            UserBo bo = sample();

            aspect.guard(pointOf(bo));

            assertThat(bo.getIdCard()).isNull();
        }

        @Test
        @DisplayName("脱敏档：也拦截——用户看到的是掩码，放行会把掩码串写进库")
        void maskedFieldNulled() {
            when(permission.getDecision(RES, "phone")).thenReturn(FieldAccess.MASKED);
            UserBo bo = sample();

            aspect.guard(pointOf(bo));

            assertThat(bo.getPhone()).isNull();
        }

        @Test
        @DisplayName("可写档 / 无决策：不拦")
        void writableAndNoDecisionPass() {
            when(permission.getDecision(RES, "phone")).thenReturn(FieldAccess.WRITABLE);
            UserBo bo = sample();

            aspect.guard(pointOf(bo));

            assertThat(bo.getPhone()).isEqualTo("13812345678");
            assertThat(bo.getIdCard()).isEqualTo("110101199001011234");
            assertThat(FieldPermissionHelper.getIgnoredFields()).isEmpty();
        }

        @Test
        @DisplayName("本就没提交的字段（值为 null）不计入提示")
        void nullValueNotReported() {
            when(permission.getDecision(RES, "idCard")).thenReturn(FieldAccess.READONLY);
            UserBo bo = sample();
            bo.setIdCard(null);

            aspect.guard(pointOf(bo));

            assertThat(FieldPermissionHelper.getIgnoredFields()).isEmpty();
        }

        @Test
        @DisplayName("提示用中文标签而非字段名")
        void reportsChineseLabel() {
            when(permission.getDecision(RES, "idCard")).thenReturn(FieldAccess.READONLY);
            when(permission.getFieldLabel(RES, "idCard")).thenReturn("身份证号");
            UserBo bo = sample();

            aspect.guard(pointOf(bo));

            assertThat(FieldPermissionHelper.getIgnoredFields()).containsExactly("身份证号");
        }
    }

    @Nested
    @DisplayName("不拦截的场景")
    class PassThrough {

        @Test
        @DisplayName("未标 @FieldResource 的 BO：放行")
        void plainBoUntouched() {
            when(permission.getDecision(anyString(), anyString())).thenReturn(FieldAccess.HIDDEN);
            PlainBo bo = new PlainBo();
            bo.setIdCard("110101199001011234");

            aspect.guard(pointOf(bo));

            assertThat(bo.getIdCard()).isEqualTo("110101199001011234");
        }

        @Test
        @DisplayName("类角色是 VO：写入拦截不认，避免张冠李戴")
        void voNotGuarded() {
            when(permission.getDecision(anyString(), anyString())).thenReturn(FieldAccess.HIDDEN);
            UserVo vo = new UserVo();
            vo.setIdCard("110101199001011234");

            aspect.guard(pointOf(vo));

            assertThat(vo.getIdCard()).isEqualTo("110101199001011234");
        }

        @Test
        @DisplayName("全局开关关闭：完全不介入")
        void disabledSwitchSkips() {
            when(permission.isEnabled()).thenReturn(false);
            when(permission.getDecision(anyString(), anyString())).thenReturn(FieldAccess.HIDDEN);
            UserBo bo = sample();

            aspect.guard(pointOf(bo));

            assertThat(bo.getIdCard()).isEqualTo("110101199001011234");
        }

        @Test
        @DisplayName("决策服务缺失：放行不抛异常")
        void serviceMissingPasses() {
            springUtil.when(() -> SpringUtil.getBean(IFieldPermissionService.class))
                .thenThrow(new IllegalStateException("no bean"));
            UserBo bo = sample();

            aspect.guard(pointOf(bo));

            assertThat(bo.getIdCard()).isEqualTo("110101199001011234");
        }

        @Test
        @DisplayName("决策过程抛异常：不让业务接口 500")
        void decisionFailureDoesNotBreak() {
            when(permission.getDecision(eq(RES), anyString())).thenThrow(new RuntimeException("redis down"));
            UserBo bo = sample();

            aspect.guard(pointOf(bo));

            assertThat(bo.getUserName()).isEqualTo("张三");
        }
    }

    @Nested
    @DisplayName("批量提交")
    class BatchSubmit {

        @Test
        @DisplayName("集合入参：每个元素都拦")
        void collectionArgGuarded() {
            when(permission.getDecision(RES, "idCard")).thenReturn(FieldAccess.READONLY);
            UserBo a = sample();
            UserBo b = sample();

            aspect.guard(pointOf(List.of(a, b)));

            assertThat(a.getIdCard()).isNull();
            assertThat(b.getIdCard()).isNull();
            // 同一字段去重，只提示一次
            assertThat(FieldPermissionHelper.getIgnoredFields()).containsExactly("idCard");
        }

        @Test
        @DisplayName("数组入参：每个元素都拦")
        void arrayArgGuarded() {
            when(permission.getDecision(RES, "idCard")).thenReturn(FieldAccess.READONLY);
            UserBo a = sample();
            UserBo b = sample();

            aspect.guard(pointOf((Object) new UserBo[]{a, b}));

            assertThat(a.getIdCard()).isNull();
            assertThat(b.getIdCard()).isNull();
        }

        @Test
        @DisplayName("混合入参（BO + 非 BO）：只拦 BO")
        void mixedArgs() {
            when(permission.getDecision(RES, "idCard")).thenReturn(FieldAccess.READONLY);
            UserBo bo = sample();

            aspect.guard(pointOf("someString", 42L, null, bo));

            assertThat(bo.getIdCard()).isNull();
        }
    }
}