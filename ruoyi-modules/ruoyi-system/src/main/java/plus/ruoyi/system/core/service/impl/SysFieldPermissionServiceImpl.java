package plus.ruoyi.system.core.service.impl;

import cn.hutool.core.util.StrUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import plus.ruoyi.common.core.constant.CacheNames;
import plus.ruoyi.common.core.domain.dto.RoleDTO;
import plus.ruoyi.common.core.domain.model.LoginUser;
import plus.ruoyi.common.core.field.FieldAccess;
import plus.ruoyi.common.core.field.FieldClassType;
import plus.ruoyi.common.core.field.FieldPermissionHelper;
import plus.ruoyi.common.core.field.FieldResource;
import plus.ruoyi.common.core.field.SubjectType;
import plus.ruoyi.common.core.utils.SpringUtils;
import plus.ruoyi.common.redis.utils.CacheUtils;
import plus.ruoyi.common.redis.utils.RedisUtils;
import plus.ruoyi.common.satoken.utils.LoginHelper;
import plus.ruoyi.system.core.dao.ISysDeptDao;
import plus.ruoyi.system.core.dao.ISysFieldPermissionDao;
import plus.ruoyi.system.core.dao.ISysUserDao;
import plus.ruoyi.system.core.dao.ISysUserRoleDao;
import plus.ruoyi.system.core.domain.SysDept;
import plus.ruoyi.system.core.domain.SysFieldPermission;
import plus.ruoyi.system.core.domain.SysUser;
import plus.ruoyi.system.core.domain.SysFieldResourceClass;
import plus.ruoyi.system.core.domain.vo.FieldMetaVo;
import plus.ruoyi.system.core.helper.FieldMetaResolver;
import plus.ruoyi.system.core.service.ISysFieldPermissionService;
import plus.ruoyi.system.core.service.ISysFieldResourceService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * 字段权限决策服务实现
 *
 * <p>热路径（{@link #getAccess} / {@link #getSnapshot}）只做三件事：查 ThreadLocal 快照 → miss 则查缓存合并 → 落快照。
 * 不反射、不逐字段查库。</p>
 *
 * <p>合并链路：</p>
 * <ol>
 *   <li>全局开关关 / 超管 / 未登录 → 空快照（无动态决策，注解照常生效）</li>
 *   <li>「已配置资源集合」未包含该资源 → 只用注解基线，一次 Redis 都不碰各主体缓存</li>
 *   <li>角色（多个）+ 部门链（本部门全部行 + 祖先部门 include_sub=1 的行）+ 用户本人，逐字段取最宽松</li>
 *   <li>基线中有而差异行中没有的字段，补基线档位（MASKED）</li>
 * </ol>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SysFieldPermissionServiceImpl implements ISysFieldPermissionService {

    /**
     * 「已配置资源」集合的 Redis key（租户前缀由 TenantKeyPrefixHandler 自动加）。
     * Redisson 对不存在的 Set 读出来是空集，与"确认为空"分不清，用哨兵元素标记"已加载"
     */
    private static final String CONFIGURED_KEY = "sys_field_permission:configured";
    private static final String LOADED_MARK = "__loaded__";

    /**
     * 差异行缓存值编码分隔符：accessCode|strategy|includeSub
     */
    private static final String SEP = "|";

    private final ISysFieldPermissionDao permissionDao;
    private final ISysFieldResourceService fieldResourceService;
    private final ISysDeptDao deptDao;
    /**
     * 以下两个仅供 {@link #calcSnapshotForUser}（管理端预览 / 收权计数）按指定用户查角色与部门，
     * 运行期决策走 LoginUser 里现成的数据，不碰这两个 DAO
     */
    private final ISysUserDao userDao;
    private final ISysUserRoleDao userRoleDao;

    /**
     * 全局开关：false 时全部出口旁路，线上出问题一键回退到无字段权限
     */
    @Value("${field-permission.enabled:true}")
    private boolean enabled;

    // ==================== 决策（热路径） ====================

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    @Override
    public String resolveResource(Class<?> clazz, FieldClassType expected) {
        if (!enabled || clazz == null || expected == null) {
            return null;
        }
        // 读注解而非查库：库表只是扫描器的镜像，查库在扫描器就绪前会返回 null 而放行，
        // 对写入口就是一个启动期的越权窗口
        FieldResource resource = clazz.getAnnotation(FieldResource.class);
        if (resource == null || resource.type() != expected) {
            return null;
        }
        String key = resource.value();
        return key == null || key.isBlank() ? null : key;
    }

    @Override
    public FieldAccess getAccess(String resourceKey, String fieldName) {
        FieldAccess decision = getDecision(resourceKey, fieldName);
        return decision == null ? FieldAccess.WRITABLE : decision;
    }

    @Override
    public FieldAccess getDecision(String resourceKey, String fieldName) {
        // 一次 ThreadLocal Map 查询；返回 null 表示"无动态决策"，与"显式放权为可写"是两回事
        return getSnapshotInternal(resourceKey).get(fieldName);
    }

    @Override
    public Map<String, FieldAccess> getSnapshot(String resourceKey) {
        return new HashMap<>(getSnapshotInternal(resourceKey));
    }

    @Override
    public String getFieldLabel(String resourceKey, String fieldName) {
        if (resourceKey == null || fieldName == null) {
            return fieldName;
        }
        try {
            // 低频路径（仅写入拦截命中时调用），可以走反射；resolveUnion 内部按类缓存
            List<Class<?>> voClasses = new ArrayList<>();
            for (SysFieldResourceClass binding :
                fieldResourceService.listClassesByResource(resourceKey)) {
                if (!FieldClassType.VO.getCode().equals(binding.getClassType())) {
                    continue;
                }
                voClasses.add(Class.forName(binding.getClassName()));
            }
            for (FieldMetaVo meta : FieldMetaResolver.resolveUnion(voClasses)) {
                if (fieldName.equals(meta.getFieldName())) {
                    return meta.getLabel();
                }
            }
        } catch (Exception e) {
            log.debug("字段权限：解析字段 {}.{} 的中文标签失败，回落字段名 => {}", resourceKey, fieldName, e.getMessage());
        }
        return fieldName;
    }

    @Override
    public String getMaskStrategy(String resourceKey, String fieldName) {
        // 确保快照已加载（策略表与档位快照同批落 ThreadLocal）
        getSnapshotInternal(resourceKey);
        Map<String, String> strategies = FieldPermissionHelper.getStrategies(resourceKey);
        return strategies == null ? null : strategies.get(fieldName);
    }

    /**
     * 取快照：ThreadLocal 命中直接返回，否则合并后落 ThreadLocal。返回内部引用，调用方不得修改
     */
    private Map<String, FieldAccess> getSnapshotInternal(String resourceKey) {
        if (StrUtil.isBlank(resourceKey)) {
            return new HashMap<>();
        }
        Map<String, FieldAccess> cached = FieldPermissionHelper.getSnapshot(resourceKey);
        if (cached != null) {
            return cached;
        }
        Map<String, FieldAccess> merged;
        Map<String, String> strategies = new HashMap<>();
        try {
            merged = loadMerged(resourceKey, strategies);
        } catch (Exception e) {
            // 决策失败不能让业务接口 500：按"无动态决策"放行，注解兜底仍在；但要 WARN 便于排查
            log.warn("字段权限决策失败，资源 {} 按无动态决策处理 => {}", resourceKey, e.getMessage());
            merged = new HashMap<>();
        }
        FieldPermissionHelper.setSnapshot(resourceKey, merged);
        FieldPermissionHelper.setStrategies(resourceKey, strategies);
        return merged;
    }

    /**
     * 合并三类主体 + 注解基线
     *
     * @param strategies 输出参数：字段 → 脱敏策略名（取最终生效那条配置的策略）
     */
    private Map<String, FieldAccess> loadMerged(String resourceKey, Map<String, String> strategies) {
        Map<String, FieldAccess> merged = new HashMap<>();
        if (!enabled) {
            return merged;
        }
        LoginUser user;
        try {
            user = LoginHelper.getLoginUser();
        } catch (Exception e) {
            // 定时任务等无请求上下文：字段权限只约束"人"，系统行为不拦
            return merged;
        }
        if (user == null || LoginHelper.isSuperAdmin(user.getUserId())) {
            return merged;
        }

        // 短路：该租户下此资源一条差异行都没有 → 只用基线
        if (configuredResources().contains(resourceKey)) {
            List<Long> roleIds = new ArrayList<>();
            if (user.getRoles() != null) {
                for (RoleDTO role : user.getRoles()) {
                    roleIds.add(role.getRoleId());
                }
            }
            mergeAllSubjects(merged, strategies, resourceKey, roleIds, user.getDeptId(), user.getUserId(), null, null);
        }
        applyBaseline(merged, resourceKey);
        return merged;
    }

    /**
     * 合并全部主体的差异行（角色 + 部门链 + 用户本人）
     *
     * <p>运行期决策与管理端预览 / 收权计数共用此方法。若两边各写一套，
     * 预览结果就会和实际行为对不上——那比没有预览更糟。</p>
     *
     * @param excludeType 要排除的主体类型（收权计数用："去掉这条配置后还有谁能看到"），null 表示不排除
     * @param excludeId   要排除的主体ID，与 excludeType 配对
     */
    private void mergeAllSubjects(Map<String, FieldAccess> merged, Map<String, String> strategies,
                                  String resourceKey, List<Long> roleIds, Long deptId, Long userId,
                                  SubjectType excludeType, Long excludeId) {
        ISysFieldPermissionService proxy = SpringUtils.getAopProxy(this);
        // 角色
        if (roleIds != null) {
            for (Long roleId : roleIds) {
                if (isExcluded(SubjectType.ROLE, roleId, excludeType, excludeId)) {
                    continue;
                }
                mergeRows(merged, strategies, proxy.loadSubjectRows(SubjectType.ROLE, roleId, resourceKey), true);
            }
        }
        // 部门链：本部门全部行；祖先部门只取 include_sub=1 的行
        if (deptId != null) {
            if (!isExcluded(SubjectType.DEPT, deptId, excludeType, excludeId)) {
                mergeRows(merged, strategies, proxy.loadSubjectRows(SubjectType.DEPT, deptId, resourceKey), true);
            }
            for (Long ancestor : ancestorDeptIds(deptId)) {
                if (isExcluded(SubjectType.DEPT, ancestor, excludeType, excludeId)) {
                    continue;
                }
                mergeRows(merged, strategies, proxy.loadSubjectRows(SubjectType.DEPT, ancestor, resourceKey), false);
            }
        }
        // 用户本人
        if (userId != null && !isExcluded(SubjectType.USER, userId, excludeType, excludeId)) {
            mergeRows(merged, strategies, proxy.loadSubjectRows(SubjectType.USER, userId, resourceKey), true);
        }
    }

    private boolean isExcluded(SubjectType type, Long id, SubjectType excludeType, Long excludeId) {
        return excludeType == type && excludeId != null && excludeId.equals(id);
    }

    /**
     * 注解基线兜底：有 @Sensitive 且没被任何主体放权的字段，档位为 MASKED
     */
    private void applyBaseline(Map<String, FieldAccess> merged, String resourceKey) {
        Map<String, Integer> baseline = CacheUtils.get(CacheNames.SYS_FIELD_BASELINE, resourceKey);
        if (baseline == null) {
            return;
        }
        for (Map.Entry<String, Integer> e : baseline.entrySet()) {
            merged.putIfAbsent(e.getKey(), FieldAccess.ofCode(e.getValue()));
        }
    }

    @Override
    public Map<String, FieldAccess> calcSnapshotForUser(Long userId, String resourceKey,
                                                        SubjectType excludeType, Long excludeId) {
        Map<String, FieldAccess> merged = new HashMap<>();
        if (!enabled || userId == null || StrUtil.isBlank(resourceKey)) {
            return merged;
        }
        // 超管旁路：与运行期一致，字段权限对它不生效
        if (LoginHelper.isSuperAdmin(userId)) {
            return merged;
        }
        SysUser user = userDao.getById(userId);
        if (user == null) {
            return merged;
        }
        mergeAllSubjects(merged, new HashMap<>(), resourceKey,
            userRoleDao.listRoleIdsByUserId(userId), user.getDeptId(), userId, excludeType, excludeId);
        applyBaseline(merged, resourceKey);
        return merged;
    }

    /**
     * 把一个主体的差异行合进结果，逐字段取最宽松
     *
     * @param includeAll false 时只合 include_sub=1 的行（祖先部门场景）
     */
    private void mergeRows(Map<String, FieldAccess> merged, Map<String, String> strategies,
                           Map<String, String> rows, boolean includeAll) {
        if (rows == null || rows.isEmpty()) {
            return;
        }
        for (Map.Entry<String, String> e : rows.entrySet()) {
            String[] parts = e.getValue().split("\\" + SEP, -1);
            FieldAccess access = FieldAccess.ofCode(parts[0]);
            String strategy = parts.length > 1 ? parts[1] : "";
            String includeSub = parts.length > 2 ? parts[2] : "1";
            if (!includeAll && !"1".equals(includeSub)) {
                continue;
            }
            FieldAccess before = merged.get(e.getKey());
            FieldAccess after = FieldAccess.looser(before, access);
            merged.put(e.getKey(), after);
            // 策略跟着最终生效的那条走；放权成可写时策略无意义，清掉
            if (after == access) {
                if (StrUtil.isNotBlank(strategy) && access == FieldAccess.MASKED) {
                    strategies.put(e.getKey(), strategy);
                } else {
                    strategies.remove(e.getKey());
                }
            }
        }
    }

    /**
     * 祖先部门 ID（不含自身）。ancestors 格式 "0,100,101"，0 是根占位跳过
     */
    private List<Long> ancestorDeptIds(Long deptId) {
        List<Long> result = new ArrayList<>();
        SysDept dept = deptDao.getById(deptId);
        if (dept == null || StrUtil.isBlank(dept.getAncestors())) {
            return result;
        }
        for (String s : dept.getAncestors().split(",")) {
            if (StrUtil.isBlank(s) || "0".equals(s.trim())) {
                continue;
            }
            try {
                result.add(Long.parseLong(s.trim()));
            } catch (NumberFormatException ignore) {
                // 脏数据跳过，不让一个坏 ancestors 拖垮整个决策
            }
        }
        return result;
    }

    // ==================== 缓存维护 ====================

    /**
     * 🔴 返回值必须是 new HashMap：不可变集合进 Redis 反序列化失败。空结果也缓存，防穿透
     */
    @Override
    @Cacheable(cacheNames = CacheNames.SYS_FIELD_PERMISSION, key = "#type.code + ':' + #subjectId + ':' + #resourceKey")
    public Map<String, String> loadSubjectRows(SubjectType type, Long subjectId, String resourceKey) {
        Map<String, String> map = new HashMap<>();
        for (SysFieldPermission row : permissionDao.listBySubjectAndResource(type, subjectId, resourceKey)) {
            map.put(row.getFieldName(),
                StrUtil.nullToEmpty(row.getAccessType()) + SEP
                    + StrUtil.nullToEmpty(row.getStrategy()) + SEP
                    + StrUtil.blankToDefault(row.getIncludeSub(), "1"));
        }
        return map;
    }

    @Override
    @CacheEvict(cacheNames = CacheNames.SYS_FIELD_PERMISSION, key = "#type.code + ':' + #subjectId + ':' + #resourceKey")
    public void evictSubjectResource(SubjectType type, Long subjectId, String resourceKey) {
        refreshConfiguredResources();
    }

    @Override
    public void evictSubject(SubjectType type, Long subjectId) {
        // 该主体可能配过多个资源，逐资源 evict 要先知道有哪些；直接清整组更稳（差异行缓存重建成本低）
        CacheUtils.clear(CacheNames.SYS_FIELD_PERMISSION);
        refreshConfiguredResources();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int purgeSubject(SubjectType type, Long subjectId) {
        if (type == null || subjectId == null) {
            return 0;
        }
        int deleted = permissionDao.deleteBySubject(type, subjectId);
        // 缓存写操作在事务中会推迟到 afterCommit，这里的顺序无所谓；调用方（角色/部门/用户删除）本身也在事务里
        evictSubject(type, subjectId);
        if (deleted > 0) {
            log.info("字段权限：主体 {}:{} 已注销，清理差异行 {} 条", type.getCode(), subjectId, deleted);
        }
        return deleted;
    }

    @Override
    public Set<String> refreshConfiguredResources() {
        Set<String> set = new HashSet<>(permissionDao.listConfiguredResourceKeys());
        set.add(LOADED_MARK);
        RedisUtils.setCacheSet(CONFIGURED_KEY, set);
        return set;
    }

    /**
     * 「已配置资源」集合：Redis 有则用，没有（无哨兵）则回源重建
     */
    private Set<String> configuredResources() {
        Set<String> set = RedisUtils.getCacheSet(CONFIGURED_KEY);
        if (set == null || !set.contains(LOADED_MARK)) {
            set = refreshConfiguredResources();
        }
        return set;
    }
}