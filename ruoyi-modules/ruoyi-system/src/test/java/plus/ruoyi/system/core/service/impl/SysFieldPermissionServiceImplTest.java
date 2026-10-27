package plus.ruoyi.system.core.service.impl;

import cn.hutool.core.util.ReflectUtil;
import cn.hutool.extra.spring.SpringUtil;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import plus.ruoyi.common.core.constant.CacheNames;
import plus.ruoyi.common.core.domain.dto.RoleDTO;
import plus.ruoyi.common.core.domain.model.LoginUser;
import plus.ruoyi.common.core.field.FieldAccess;
import plus.ruoyi.common.core.field.FieldPermissionHelper;
import plus.ruoyi.common.core.field.SubjectType;
import plus.ruoyi.common.core.utils.SpringUtils;
import plus.ruoyi.common.redis.utils.CacheUtils;
import plus.ruoyi.common.redis.utils.RedisUtils;
import plus.ruoyi.common.satoken.utils.LoginHelper;
import plus.ruoyi.common.test.base.BaseUnitTest;
import plus.ruoyi.system.core.dao.ISysDeptDao;
import plus.ruoyi.system.core.dao.ISysFieldPermissionDao;
import plus.ruoyi.system.core.dao.ISysUserDao;
import plus.ruoyi.system.core.dao.ISysUserRoleDao;
import plus.ruoyi.system.core.domain.SysDept;
import plus.ruoyi.system.core.domain.SysFieldPermission;
import plus.ruoyi.system.core.service.ISysFieldResourceService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * 字段权限决策服务测试
 *
 * <p>覆盖：超管 / 未登录旁路、未配置资源走基线、多主体取最宽松、显式放权覆盖注解基线、
 * 祖先部门 include_sub 过滤、脱敏策略跟随生效配置、ThreadLocal 清理。</p>
 */
@Tag("dev")
@DisplayName("字段权限决策服务测试")
class SysFieldPermissionServiceImplTest extends BaseUnitTest {

    private static final String RES = "system:user";
    private static final String CONFIGURED_KEY = "sys_field_permission:configured";

    private ISysFieldPermissionDao permissionDao;
    private ISysFieldResourceService resourceService;
    private ISysDeptDao deptDao;
    private ISysUserDao userDao;
    private ISysUserRoleDao userRoleDao;
    private SysFieldPermissionServiceImpl service;

    /**
     * 必须最先 mock：CacheUtils / RedisUtils 的 static final 字段在类加载时调 SpringUtils.getBean(...)，
     * 而 getBean 是继承自 Hutool SpringUtil 的静态方法；不先把它 mock 掉，无 Spring 上下文下 <clinit> 直接抛，
     * Mockito 连类都装不进去，后面所有 when() 都会级联报 MissingMethodInvocationException
     */
    private MockedStatic<SpringUtil> hutoolSpringUtil;
    private MockedStatic<LoginHelper> loginHelper;
    private MockedStatic<CacheUtils> cacheUtils;
    private MockedStatic<RedisUtils> redisUtils;
    private MockedStatic<SpringUtils> springUtils;

    @BeforeEach
    void initMocks() {
        permissionDao = mock(ISysFieldPermissionDao.class);
        resourceService = mock(ISysFieldResourceService.class);
        deptDao = mock(ISysDeptDao.class);
        // userDao / userRoleDao 只服务管理端的 calcSnapshotForUser，运行期决策不碰它们
        userDao = mock(ISysUserDao.class);
        userRoleDao = mock(ISysUserRoleDao.class);
        service = new SysFieldPermissionServiceImpl(permissionDao, resourceService, deptDao, userDao, userRoleDao);
        ReflectUtil.setFieldValue(service, "enabled", true);

        hutoolSpringUtil = Mockito.mockStatic(SpringUtil.class);
        loginHelper = Mockito.mockStatic(LoginHelper.class);
        cacheUtils = Mockito.mockStatic(CacheUtils.class);
        redisUtils = Mockito.mockStatic(RedisUtils.class);
        springUtils = Mockito.mockStatic(SpringUtils.class);
        // 代理返回自身：loadSubjectRows 不走 @Cacheable，直接落 DAO mock
        springUtils.when(() -> SpringUtils.getAopProxy(any())).thenAnswer(inv -> inv.getArgument(0));

        // 默认：普通用户、无配置、无基线
        loginHelper.when(() -> LoginHelper.isSuperAdmin(anyLong())).thenReturn(false);
        configured(false);
        baseline(null);
        FieldPermissionHelper.clear();
    }

    @AfterEach
    void closeMocks() {
        FieldPermissionHelper.clear();
        if (springUtils != null) {
            springUtils.close();
        }
        if (redisUtils != null) {
            redisUtils.close();
        }
        if (cacheUtils != null) {
            cacheUtils.close();
        }
        if (loginHelper != null) {
            loginHelper.close();
        }
        if (hutoolSpringUtil != null) {
            hutoolSpringUtil.close();
        }
    }

    // ==================== 辅助 ====================

    private LoginUser user(Long userId, Long deptId, Long... roleIds) {
        LoginUser u = new LoginUser();
        u.setUserId(userId);
        u.setDeptId(deptId);
        List<RoleDTO> roles = new ArrayList<>();
        for (Long rid : roleIds) {
            RoleDTO r = new RoleDTO();
            r.setRoleId(rid);
            roles.add(r);
        }
        u.setRoles(roles);
        loginHelper.when(LoginHelper::getLoginUser).thenReturn(u);
        return u;
    }

    private void configured(boolean yes) {
        Set<String> set = new HashSet<>();
        set.add("__loaded__");
        if (yes) {
            set.add(RES);
        }
        redisUtils.when(() -> RedisUtils.getCacheSet(CONFIGURED_KEY)).thenReturn(set);
    }

    private void baseline(Map<String, Integer> map) {
        cacheUtils.when(() -> CacheUtils.get(CacheNames.SYS_FIELD_BASELINE, RES)).thenReturn(map);
    }

    private SysFieldPermission row(String field, FieldAccess access, String strategy, String includeSub) {
        SysFieldPermission p = new SysFieldPermission();
        p.setResourceKey(RES);
        p.setFieldName(field);
        p.setAccessType(String.valueOf(access.getCode()));
        p.setStrategy(strategy);
        p.setIncludeSub(includeSub);
        return p;
    }

    private void rows(SubjectType type, Long subjectId, SysFieldPermission... rows) {
        when(permissionDao.listBySubjectAndResource(type, subjectId, RES)).thenReturn(List.of(rows));
    }

    private void dept(Long deptId, String ancestors) {
        SysDept d = new SysDept();
        d.setDeptId(deptId);
        d.setAncestors(ancestors);
        when(deptDao.getById(deptId)).thenReturn(d);
    }

    // ==================== 用例 ====================

    @Nested
    @DisplayName("旁路")
    class Bypass {

        @Test
        @DisplayName("超管：空快照，不查任何主体")
        void superAdmin() {
            user(1L, 100L, 1L);
            loginHelper.when(() -> LoginHelper.isSuperAdmin(1L)).thenReturn(true);
            configured(true);
            baseline(Map.of("phone", FieldAccess.MASKED.getCode()));

            assertThat(service.getSnapshot(RES)).isEmpty();
            assertThat(service.getAccess(RES, "phone")).isEqualTo(FieldAccess.WRITABLE);
            verify(permissionDao, never()).listBySubjectAndResource(any(), anyLong(), anyString());
        }

        @Test
        @DisplayName("未登录（定时任务）：空快照，系统行为不被拦")
        void noLogin() {
            loginHelper.when(LoginHelper::getLoginUser).thenThrow(new IllegalStateException("no session"));
            configured(true);

            assertThat(service.getSnapshot(RES)).isEmpty();
            verify(permissionDao, never()).listBySubjectAndResource(any(), anyLong(), anyString());
        }

        @Test
        @DisplayName("全局开关关闭：空快照")
        void disabled() {
            ReflectUtil.setFieldValue(service, "enabled", false);
            user(2L, 100L, 1L);
            configured(true);
            baseline(Map.of("phone", FieldAccess.MASKED.getCode()));

            assertThat(service.isEnabled()).isFalse();
            assertThat(service.getSnapshot(RES)).isEmpty();
        }
    }

    @Nested
    @DisplayName("合并")
    class Merge {

        @Test
        @DisplayName("资源未配置：短路不查主体，只用注解基线")
        void notConfiguredUsesBaselineOnly() {
            user(2L, 100L, 1L);
            configured(false);
            baseline(Map.of("phone", FieldAccess.MASKED.getCode()));

            Map<String, FieldAccess> snap = service.getSnapshot(RES);

            assertThat(snap).containsEntry("phone", FieldAccess.MASKED).hasSize(1);
            verify(permissionDao, never()).listBySubjectAndResource(any(), anyLong(), anyString());
        }

        @Test
        @DisplayName("多角色取最宽松：一个隐藏一个只读 → 只读")
        void multiRoleLoosest() {
            user(2L, 100L, 1L, 2L);
            configured(true);
            rows(SubjectType.ROLE, 1L, row("idCard", FieldAccess.HIDDEN, null, "1"));
            rows(SubjectType.ROLE, 2L, row("idCard", FieldAccess.READONLY, null, "1"));

            assertThat(service.getAccess(RES, "idCard")).isEqualTo(FieldAccess.READONLY);
        }

        @Test
        @DisplayName("显式放权覆盖注解基线：带 @Sensitive 的字段配成可写 → 快照含 WRITABLE 而非回落 MASKED")
        void explicitWritableOverridesBaseline() {
            user(2L, 100L, 1L);
            configured(true);
            baseline(Map.of("phone", FieldAccess.MASKED.getCode()));
            rows(SubjectType.ROLE, 1L, row("phone", FieldAccess.WRITABLE, null, "1"));

            Map<String, FieldAccess> snap = service.getSnapshot(RES);

            // 快照必须包含该字段（containsKey 决定是否覆盖注解），且档位为 WRITABLE
            assertThat(snap).containsEntry("phone", FieldAccess.WRITABLE);
            assertThat(service.getMaskStrategy(RES, "phone")).isNull();
        }

        @Test
        @DisplayName("基线兜底：有注解且无任何主体配置的字段 → MASKED；无注解无配置 → 不在快照")
        void baselineFallback() {
            user(2L, 100L, 1L);
            configured(true);
            baseline(Map.of("phone", FieldAccess.MASKED.getCode()));
            rows(SubjectType.ROLE, 1L, row("email", FieldAccess.HIDDEN, null, "1"));

            Map<String, FieldAccess> snap = service.getSnapshot(RES);

            assertThat(snap).containsEntry("phone", FieldAccess.MASKED)
                .containsEntry("email", FieldAccess.HIDDEN)
                .doesNotContainKey("userName");
            assertThat(service.getAccess(RES, "userName")).isEqualTo(FieldAccess.WRITABLE);
        }

        @Test
        @DisplayName("脱敏策略跟随最终生效的配置")
        void strategyFollowsWinner() {
            user(2L, 100L, 1L, 2L);
            configured(true);
            rows(SubjectType.ROLE, 1L, row("phone", FieldAccess.HIDDEN, null, "1"));
            rows(SubjectType.ROLE, 2L, row("phone", FieldAccess.MASKED, "PHONE", "1"));

            assertThat(service.getAccess(RES, "phone")).isEqualTo(FieldAccess.MASKED);
            assertThat(service.getMaskStrategy(RES, "phone")).isEqualTo("PHONE");
        }
    }

    @Nested
    @DisplayName("部门链")
    class DeptChain {

        @Test
        @DisplayName("祖先部门 include_sub=1 的配置生效，include_sub=0 的不生效")
        void ancestorIncludeSub() {
            user(2L, 102L);
            configured(true);
            dept(102L, "0,100,101");
            // 祖先 100：含子部门 → 生效；祖先 101：不含子部门 → 忽略
            rows(SubjectType.DEPT, 100L, row("idCard", FieldAccess.READONLY, null, "1"));
            rows(SubjectType.DEPT, 101L, row("email", FieldAccess.HIDDEN, null, "0"));

            Map<String, FieldAccess> snap = service.getSnapshot(RES);

            assertThat(snap).containsEntry("idCard", FieldAccess.READONLY).doesNotContainKey("email");
        }

        @Test
        @DisplayName("本部门自身的配置不受 include_sub 限制")
        void ownDeptAlwaysApplies() {
            user(2L, 102L);
            configured(true);
            dept(102L, "0,100");
            rows(SubjectType.DEPT, 102L, row("email", FieldAccess.HIDDEN, null, "0"));

            assertThat(service.getAccess(RES, "email")).isEqualTo(FieldAccess.HIDDEN);
        }

        @Test
        @DisplayName("ancestors 含脏数据不抛异常")
        void dirtyAncestors() {
            user(2L, 102L);
            configured(true);
            dept(102L, "0,abc,,100");
            rows(SubjectType.DEPT, 100L, row("idCard", FieldAccess.READONLY, null, "1"));

            assertThat(service.getAccess(RES, "idCard")).isEqualTo(FieldAccess.READONLY);
        }
    }

    @Nested
    @DisplayName("请求级快照")
    class Snapshot {

        @Test
        @DisplayName("同请求内同资源只合并一次")
        void mergeOncePerRequest() {
            user(2L, 100L, 1L);
            configured(true);
            rows(SubjectType.ROLE, 1L, row("phone", FieldAccess.HIDDEN, null, "1"));

            service.getAccess(RES, "phone");
            service.getAccess(RES, "email");
            service.getSnapshot(RES);

            verify(permissionDao, Mockito.times(1)).listBySubjectAndResource(eq(SubjectType.ROLE), eq(1L), eq(RES));
        }

        @Test
        @DisplayName("clear() 后快照为空，模拟线程复用不串权")
        void clearResetsThread() {
            user(2L, 100L, 1L);
            configured(true);
            rows(SubjectType.ROLE, 1L, row("phone", FieldAccess.HIDDEN, null, "1"));
            assertThat(service.getAccess(RES, "phone")).isEqualTo(FieldAccess.HIDDEN);

            FieldPermissionHelper.clear();
            assertThat(FieldPermissionHelper.getSnapshot(RES)).isNull();
            assertThat(FieldPermissionHelper.getStrategies(RES)).isNull();
            assertThat(FieldPermissionHelper.getIgnoredFields()).isEmpty();
        }

        @Test
        @DisplayName("getSnapshot 返回拷贝，修改不影响内部快照")
        void snapshotIsCopy() {
            user(2L, 100L, 1L);
            configured(true);
            rows(SubjectType.ROLE, 1L, row("phone", FieldAccess.HIDDEN, null, "1"));

            Map<String, FieldAccess> snap = service.getSnapshot(RES);
            snap.put("phone", FieldAccess.WRITABLE);

            assertThat(service.getAccess(RES, "phone")).isEqualTo(FieldAccess.HIDDEN);
        }

        @Test
        @DisplayName("决策过程抛异常：按无动态决策放行，不让业务 500")
        void failureDegradesToOpen() {
            user(2L, 100L, 1L);
            configured(true);
            when(permissionDao.listBySubjectAndResource(any(), anyLong(), anyString()))
                .thenThrow(new RuntimeException("db down"));

            assertThat(service.getAccess(RES, "phone")).isEqualTo(FieldAccess.WRITABLE);
            assertThat(service.getSnapshot(RES)).isEmpty();
        }
    }

    @Nested
    @DisplayName("缓存维护")
    class CacheMaintain {

        @Test
        @DisplayName("loadSubjectRows 返回可变 HashMap，值编码 accessCode|strategy|includeSub")
        void loadSubjectRowsEncoding() {
            rows(SubjectType.ROLE, 1L, row("phone", FieldAccess.MASKED, "PHONE", "1"));

            Map<String, String> map = service.loadSubjectRows(SubjectType.ROLE, 1L, RES);

            assertThat(map).isInstanceOf(HashMap.class).containsEntry("phone", "1|PHONE|1");
            map.put("x", "y");
        }

        @Test
        @DisplayName("空结果也返回空 HashMap（防穿透）")
        void emptyRowsCached() {
            when(permissionDao.listBySubjectAndResource(any(), anyLong(), anyString())).thenReturn(new ArrayList<>());

            Map<String, String> map = service.loadSubjectRows(SubjectType.ROLE, 9L, RES);

            assertThat(map).isNotNull().isInstanceOf(HashMap.class);
            assertThat(map).isEmpty();
        }

        @Test
        @DisplayName("purgeSubject：删差异行 + 清整组缓存 + 刷新已配置集合")
        void purgeSubject() {
            when(permissionDao.deleteBySubject(SubjectType.ROLE, 1L)).thenReturn(3);
            when(permissionDao.listConfiguredResourceKeys()).thenReturn(List.of("system:dept"));

            int deleted = service.purgeSubject(SubjectType.ROLE, 1L);

            assertThat(deleted).isEqualTo(3);
            cacheUtils.verify(() -> CacheUtils.clear(CacheNames.SYS_FIELD_PERMISSION));
            redisUtils.verify(() -> RedisUtils.setCacheSet(eq(CONFIGURED_KEY), any()));
        }

        @Test
        @DisplayName("已配置集合无哨兵（Redis 丢失）→ 回源重建")
        void configuredSetRebuiltWhenMissing() {
            user(2L, 100L, 1L);
            redisUtils.when(() -> RedisUtils.getCacheSet(CONFIGURED_KEY)).thenReturn(new HashSet<>());
            when(permissionDao.listConfiguredResourceKeys()).thenReturn(List.of(RES));
            rows(SubjectType.ROLE, 1L, row("phone", FieldAccess.HIDDEN, null, "1"));

            assertThat(service.getAccess(RES, "phone")).isEqualTo(FieldAccess.HIDDEN);
            verify(permissionDao).listConfiguredResourceKeys();
        }
    }
}