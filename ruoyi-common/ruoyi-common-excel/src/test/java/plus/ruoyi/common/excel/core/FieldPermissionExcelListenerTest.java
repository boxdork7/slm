package plus.ruoyi.common.excel.core;

import cn.hutool.extra.spring.SpringUtil;
import cn.idev.excel.context.AnalysisContext;
import lombok.Data;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import plus.ruoyi.common.core.field.FieldAccess;
import plus.ruoyi.common.core.field.FieldClassType;
import plus.ruoyi.common.core.field.FieldResource;
import plus.ruoyi.common.core.field.IFieldPermissionService;
import plus.ruoyi.common.test.base.BaseUnitTest;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * 导入监听器装饰器测试
 *
 * <p>核心验证：字段拦截发生在<b>转发给业务 Listener 之前</b>。
 * 这是本机制的关键——业务 Listener 常在 {@code invoke()} 里直接入库，
 * 拦晚一步数据就已经落库了。</p>
 */
@Tag("dev")
@DisplayName("导入监听器装饰器测试")
class FieldPermissionExcelListenerTest extends BaseUnitTest {

    private static final String RES = "system:user";

    private MockedStatic<SpringUtil> springUtil;
    private IFieldPermissionService permission;

    @Data
    @FieldResource(value = RES, type = FieldClassType.IMPORT)
    public static class ImportVo {
        private String userName;
        private String idCard;
    }

    /**
     * 模拟业务 Listener：在 invoke 里"入库"（这里记录收到的快照）
     */
    static class RecordingListener implements ExcelListener<ImportVo> {
        /** invoke 时看到的 idCard 值——模拟入库那一刻的数据 */
        final List<String> persistedIdCards = new ArrayList<>();
        boolean afterAllCalled = false;

        @Override
        public void invoke(ImportVo data, AnalysisContext context) {
            // 业务 Listener 在这里直接入库，看到什么就存什么
            persistedIdCards.add(data.getIdCard());
        }

        @Override
        public void doAfterAllAnalysed(AnalysisContext context) {
            afterAllCalled = true;
        }

        @Override
        public ExcelResult<ImportVo> getExcelResult() {
            return null;
        }
    }

    @BeforeEach
    void initMocks() {
        ExcelSensitiveHelper.clearCache();
        springUtil = Mockito.mockStatic(SpringUtil.class);
        permission = mock(IFieldPermissionService.class);
        when(permission.isEnabled()).thenReturn(true);
        when(permission.getDecision(anyString(), anyString())).thenReturn(null);
        when(permission.getFieldLabel(anyString(), anyString())).thenAnswer(inv -> inv.getArgument(1));
        when(permission.resolveResource(any(), any())).thenAnswer(inv -> {
            Class<?> clazz = inv.getArgument(0);
            FieldClassType expected = inv.getArgument(1);
            FieldResource fr = clazz.getAnnotation(FieldResource.class);
            return fr == null || fr.type() != expected ? null : fr.value();
        });
        springUtil.when(() -> SpringUtil.getBean(IFieldPermissionService.class)).thenReturn(permission);
    }

    @AfterEach
    void closeMocks() {
        if (springUtil != null) {
            springUtil.close();
        }
    }

    private ImportVo row() {
        ImportVo vo = new ImportVo();
        vo.setUserName("张三");
        vo.setIdCard("110101199001011234");
        return vo;
    }

    @Test
    @DisplayName("🔴 拦截发生在转发之前：业务 Listener 入库时已经看不到无权字段")
    void guardsBeforeDelegating() {
        when(permission.getDecision(RES, "idCard")).thenReturn(FieldAccess.READONLY);
        RecordingListener business = new RecordingListener();
        FieldPermissionExcelListener<ImportVo> guarded =
            new FieldPermissionExcelListener<>(business, ImportVo.class);

        guarded.invoke(row(), null);

        // 业务 Listener 那一刻看到的就是 null——若拦晚一步，这里会是明文
        assertThat(business.persistedIdCards).containsExactly((String) null);
    }

    @Test
    @DisplayName("无决策时原样转发，业务 Listener 收到完整数据")
    void passesThroughWhenNoDecision() {
        RecordingListener business = new RecordingListener();
        FieldPermissionExcelListener<ImportVo> guarded =
            new FieldPermissionExcelListener<>(business, ImportVo.class);

        guarded.invoke(row(), null);

        assertThat(business.persistedIdCards).containsExactly("110101199001011234");
    }

    @Test
    @DisplayName("多行逐行拦截")
    void guardsEveryRow() {
        when(permission.getDecision(RES, "idCard")).thenReturn(FieldAccess.HIDDEN);
        RecordingListener business = new RecordingListener();
        FieldPermissionExcelListener<ImportVo> guarded =
            new FieldPermissionExcelListener<>(business, ImportVo.class);

        guarded.invoke(row(), null);
        guarded.invoke(row(), null);

        assertThat(business.persistedIdCards).hasSize(2).containsOnlyNulls();
    }

    @Test
    @DisplayName("其余回调原样委派，不改变业务 Listener 行为")
    void delegatesOtherCallbacks() {
        RecordingListener business = new RecordingListener();
        FieldPermissionExcelListener<ImportVo> guarded =
            new FieldPermissionExcelListener<>(business, ImportVo.class);

        guarded.doAfterAllAnalysed(null);

        assertThat(business.afterAllCalled).isTrue();
        assertThat(guarded.getExcelResult()).isNull();
    }
}