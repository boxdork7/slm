package plus.ruoyi.system.core.service.impl;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import plus.ruoyi.common.core.constant.CacheNames;
import plus.ruoyi.common.core.constant.TenantConstants;
import plus.ruoyi.common.core.exception.ServiceException;
import plus.ruoyi.common.core.field.FieldAccess;
import plus.ruoyi.common.core.field.FieldClassType;
import plus.ruoyi.common.core.field.SubjectType;
import plus.ruoyi.common.redis.utils.CacheUtils;
import plus.ruoyi.common.satoken.utils.LoginHelper;
import plus.ruoyi.system.core.dao.ISysDeptDao;
import plus.ruoyi.system.core.dao.ISysFieldPermissionDao;
import plus.ruoyi.system.core.dao.ISysRoleDao;
import plus.ruoyi.system.core.dao.ISysUserDao;
import plus.ruoyi.system.core.dao.ISysUserRoleDao;
import plus.ruoyi.system.core.domain.SysDept;
import plus.ruoyi.system.core.domain.SysFieldPermission;
import plus.ruoyi.system.core.domain.SysFieldResource;
import plus.ruoyi.system.core.domain.SysFieldResourceClass;
import plus.ruoyi.system.core.domain.SysRole;
import plus.ruoyi.system.core.domain.SysUser;
import plus.ruoyi.system.core.domain.bo.FieldMatrixBo;
import plus.ruoyi.system.core.domain.vo.FieldAffectedVo;
import plus.ruoyi.system.core.domain.vo.FieldMatrixCellVo;
import plus.ruoyi.system.core.domain.vo.FieldMatrixVo;
import plus.ruoyi.system.core.domain.vo.FieldMetaVo;
import plus.ruoyi.system.core.domain.vo.FieldPreviewVo;
import plus.ruoyi.system.core.domain.vo.FieldSubjectVo;
import plus.ruoyi.system.core.domain.vo.SysFieldResourceClassVo;
import plus.ruoyi.system.core.helper.FieldMetaResolver;
import plus.ruoyi.system.core.service.ISysFieldMatrixService;
import plus.ruoyi.system.core.service.ISysFieldPermissionService;
import plus.ruoyi.system.core.service.ISysFieldResourceService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * 字段权限矩阵服务实现（管理端配置）
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SysFieldMatrixServiceImpl implements ISysFieldMatrixService {

    /**
     * 收权后果计数的用户数上限。超过则只给总数不逐个算：
     * 逐用户合并要走完整的多主体合并逻辑，几千人的角色算下来会拖垮一次页面交互
     */
    private static final int AFFECTED_CALC_LIMIT = 500;

    /**
     * 受影响用户明细最多返回条数（hover 展示用，多了也看不过来）
     */
    private static final int SAMPLE_LIMIT = 10;

    private final ISysFieldPermissionDao permissionDao;
    private final ISysFieldResourceService fieldResourceService;
    private final ISysFieldPermissionService fieldPermissionService;
    private final ISysRoleDao roleDao;
    private final ISysDeptDao deptDao;
    private final ISysUserDao userDao;
    private final ISysUserRoleDao userRoleDao;

    // ==================== 矩阵查询 ====================

    @Override
    public FieldMatrixVo getMatrix(String resourceKey, SubjectType subjectType, List<Long> subjectIds) {
        if (StrUtil.isBlank(resourceKey) || subjectType == null) {
            throw ServiceException.of("资源标识与主体类型不能为空");
        }
        SysFieldResource resource = requireResource(resourceKey);

        FieldMatrixVo vo = new FieldMatrixVo();
        vo.setResourceKey(resourceKey);
        vo.setResourceName(resource.getResourceName());

        List<SysFieldResourceClass> bindings = fieldResourceService.listClassesByResource(resourceKey);
        vo.setClasses(toClassVos(bindings));
        vo.setFields(resolveFields(bindings));
        vo.setSubjects(resolveSubjects(subjectType, subjectIds));
        vo.setCells(loadCells(resourceKey, subjectType, vo.getSubjects()));
        return vo;
    }

    /**
     * 反射解析该资源全部读出口 VO 的字段并集
     *
     * <p>只取 VO：矩阵配置的是"能看到什么"，字段清单以读出口为准。
     * BO / ImportVo 的字段名与 VO 一致（同一张表），写入拦截按同一份配置判档。</p>
     */
    private List<FieldMetaVo> resolveFields(List<SysFieldResourceClass> bindings) {
        List<Class<?>> voClasses = new ArrayList<>();
        for (SysFieldResourceClass binding : bindings) {
            if (!FieldClassType.VO.getCode().equals(binding.getClassType())) {
                continue;
            }
            try {
                voClasses.add(Class.forName(binding.getClassName()));
            } catch (ClassNotFoundException e) {
                // 类被删了但绑定行还在（扫描器只对自动登记行做失效），跳过不影响其余字段
                log.warn("字段权限：绑定的类 {} 不存在，跳过 => {}", binding.getClassName(), e.getMessage());
            }
        }
        return FieldMetaResolver.resolveUnion(voClasses);
    }

    private List<SysFieldResourceClassVo> toClassVos(List<SysFieldResourceClass> bindings) {
        List<SysFieldResourceClassVo> list = new ArrayList<>(bindings.size());
        for (SysFieldResourceClass binding : bindings) {
            SysFieldResourceClassVo vo = new SysFieldResourceClassVo();
            vo.setId(binding.getId());
            vo.setResourceKey(binding.getResourceKey());
            vo.setClassName(binding.getClassName());
            vo.setClassType(binding.getClassType());
            vo.setSimpleName(StrUtil.subAfter(binding.getClassName(), '.', true));
            FieldClassType type = FieldClassType.ofCode(binding.getClassType());
            vo.setClassTypeLabel(type == null ? binding.getClassType() : type.getLabel());
            list.add(vo);
        }
        return list;
    }

    /**
     * 解析矩阵的列
     */
    private List<FieldSubjectVo> resolveSubjects(SubjectType subjectType, List<Long> subjectIds) {
        // 用户主体不下发全量选项（量可能极大），listSubjects 对 USER 返回的是空列表，
        // 走不了"全量再过滤"那条路，只能按管理员挑中的 id 反查。
        if (subjectType == SubjectType.USER) {
            return listUserSubjects(subjectIds);
        }
        List<FieldSubjectVo> all = listSubjects(subjectType);
        if (CollUtil.isEmpty(subjectIds)) {
            return all;
        }
        Set<Long> wanted = new LinkedHashSet<>(subjectIds);
        List<FieldSubjectVo> filtered = new ArrayList<>();
        for (FieldSubjectVo subject : all) {
            if (wanted.contains(subject.getSubjectId())) {
                filtered.add(subject);
            }
        }
        return filtered;
    }

    /**
     * 按 id 反查用户主体，作为矩阵的列
     *
     * <p>列顺序按管理员传入的 subjectIds 排，不跟着数据库返回顺序走——
     * 否则每次刷新列都可能换位置，对着矩阵配权限会很难受。</p>
     *
     * @param subjectIds 管理员通过用户选择器挑中的用户ID
     * @return 用户主体列表，查不到的 id 直接跳过
     */
    private List<FieldSubjectVo> listUserSubjects(List<Long> subjectIds) {
        List<FieldSubjectVo> list = new ArrayList<>();
        if (CollUtil.isEmpty(subjectIds)) {
            return list;
        }
        List<Long> distinctIds = new ArrayList<>(new LinkedHashSet<>(subjectIds));
        Map<Long, SysUser> userMap = new HashMap<>();
        // 传 null 状态 = 不按状态过滤（PlusLambdaQuery 的 eq 遇 null 自动跳过条件）。
        // 不能用 listByIds：它内置了「只查启用用户」，停用的人会被悄悄吞掉，
        // 管理员挑了谁就该显示谁——列消失了，覆盖式保存还会漏清他的既有配置。
        for (SysUser user : userDao.listByUserIdsAndStatus(distinctIds, null)) {
            userMap.put(user.getUserId(), user);
        }
        for (Long userId : distinctIds) {
            SysUser user = userMap.get(userId);
            if (user == null) {
                // 用户可能已被删除，静默跳过：报错会让整个矩阵打不开
                continue;
            }
            FieldSubjectVo vo = new FieldSubjectVo();
            vo.setSubjectType(SubjectType.USER.getCode());
            vo.setSubjectId(user.getUserId());
            // 昵称更好认人，没有就退回登录名
            vo.setSubjectName(StrUtil.blankToDefault(user.getNickName(), user.getUserName()));
            // 超管走 isSuperAdmin() 旁路，配了也不生效，前端渲染成不可编辑的"全权"
            vo.setSuperAdmin(LoginHelper.isSuperAdmin(user.getUserId()));
            list.add(vo);
        }
        return list;
    }

    /**
     * 加载已配置的差异格
     */
    private List<FieldMatrixCellVo> loadCells(String resourceKey, SubjectType subjectType,
                                              List<FieldSubjectVo> subjects) {
        List<FieldMatrixCellVo> cells = new ArrayList<>();
        for (FieldSubjectVo subject : subjects) {
            for (SysFieldPermission row :
                permissionDao.listBySubjectAndResource(subjectType, subject.getSubjectId(), resourceKey)) {
                FieldMatrixCellVo cell = new FieldMatrixCellVo();
                cell.setFieldName(row.getFieldName());
                cell.setSubjectType(row.getSubjectType());
                cell.setSubjectId(row.getSubjectId());
                cell.setAccessType(row.getAccessType());
                cell.setStrategy(row.getStrategy());
                cell.setIncludeSub(row.getIncludeSub());
                cells.add(cell);
            }
        }
        return cells;
    }

    // ==================== 矩阵保存 ====================

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int saveMatrix(FieldMatrixBo bo) {
        if (bo == null || StrUtil.isBlank(bo.getResourceKey())) {
            throw ServiceException.of("资源标识不能为空");
        }
        SubjectType subjectType = SubjectType.ofCode(bo.getSubjectType());
        if (subjectType == null) {
            throw ServiceException.of("主体类型不合法");
        }
        if (CollUtil.isEmpty(bo.getSubjectIds())) {
            throw ServiceException.of("主体ID列表不能为空");
        }
        requireResource(bo.getResourceKey());

        // 覆盖式保存：先清空这批主体的既有配置
        for (Long subjectId : bo.getSubjectIds()) {
            permissionDao.deleteBySubjectAndResource(subjectType, subjectId, bo.getResourceKey());
        }

        // 只落"与基线不同"的格子：与基线相同的存进去只会让表膨胀，且语义上等价于没配
        Map<String, Integer> baseline = baselineOf(bo.getResourceKey());
        Set<Long> allowed = new LinkedHashSet<>(bo.getSubjectIds());
        List<SysFieldPermission> toInsert = new ArrayList<>();
        for (FieldMatrixCellVo cell : bo.getCells()) {
            if (StrUtil.isBlank(cell.getFieldName()) || cell.getSubjectId() == null) {
                continue;
            }
            // 防越权：只接受本次声明的主体，避免前端伪造 subjectId 改到别的主体上
            if (!allowed.contains(cell.getSubjectId())) {
                log.warn("字段权限：矩阵保存包含未声明的主体 {}，已忽略", cell.getSubjectId());
                continue;
            }
            FieldAccess access = FieldAccess.ofCode(cell.getAccessType());
            if (isSameAsBaseline(access, baseline.get(cell.getFieldName()))) {
                continue;
            }
            SysFieldPermission row = new SysFieldPermission();
            row.setSubjectType(subjectType.getCode());
            row.setSubjectId(cell.getSubjectId());
            row.setResourceKey(bo.getResourceKey());
            row.setFieldName(cell.getFieldName());
            row.setAccessType(String.valueOf(access.getCode()));
            // 策略只在脱敏档有意义，其余档位存进去会误导后续读取
            row.setStrategy(access == FieldAccess.MASKED ? cell.getStrategy() : null);
            row.setIncludeSub(subjectType == SubjectType.DEPT
                ? StrUtil.blankToDefault(cell.getIncludeSub(), "1") : "1");
            toInsert.add(row);
        }
        for (SysFieldPermission row : toInsert) {
            permissionDao.insert(row);
        }

        // 失效这批主体的缓存并刷新「已配置资源」集合
        for (Long subjectId : bo.getSubjectIds()) {
            fieldPermissionService.evictSubjectResource(subjectType, subjectId, bo.getResourceKey());
        }
        return toInsert.size();
    }

    /**
     * 判断档位是否与注解基线相同（相同则不落库）
     *
     * <p>基线里没有该字段 = 基线为可写；有则为该档位（当前只会是脱敏）。</p>
     */
    private boolean isSameAsBaseline(FieldAccess access, Integer baselineCode) {
        int expected = baselineCode == null ? FieldAccess.WRITABLE.getCode() : baselineCode;
        return access.getCode() == expected;
    }

    private Map<String, Integer> baselineOf(String resourceKey) {
        Map<String, Integer> baseline = CacheUtils.get(CacheNames.SYS_FIELD_BASELINE, resourceKey);
        return baseline == null ? new HashMap<>() : baseline;
    }

    // ==================== 主体选项 ====================

    @Override
    public List<FieldSubjectVo> listSubjects(SubjectType subjectType) {
        List<FieldSubjectVo> list = new ArrayList<>();
        if (subjectType == null) {
            return list;
        }
        switch (subjectType) {
            case ROLE -> {
                for (SysRole role : roleDao.listNormalRoles()) {
                    FieldSubjectVo vo = new FieldSubjectVo();
                    vo.setSubjectType(SubjectType.ROLE.getCode());
                    vo.setSubjectId(role.getRoleId());
                    vo.setSubjectName(role.getRoleName());
                    // 超管走 isSuperAdmin() 旁路，配了也不生效，前端渲染成不可编辑的"全权"
                    vo.setSuperAdmin(TenantConstants.SUPER_ADMIN_ROLE_KEY.equals(role.getRoleKey()));
                    list.add(vo);
                }
            }
            case DEPT -> {
                for (SysDept dept : deptDao.listNormalDepts()) {
                    FieldSubjectVo vo = new FieldSubjectVo();
                    vo.setSubjectType(SubjectType.DEPT.getCode());
                    vo.setSubjectId(dept.getDeptId());
                    vo.setSubjectName(dept.getDeptName());
                    vo.setParentId(dept.getParentId());
                    vo.setSuperAdmin(false);
                    list.add(vo);
                }
            }
            case USER -> {
                // 用户量可能很大，不返回全量：前端用用户选择器按需检索后传 subjectIds
                log.debug("字段权限：用户主体不返回全量选项，由前端用户选择器按需指定");
            }
            default -> {
                // 枚举已穷举
            }
        }
        return list;
    }

    // ==================== 登录快照下发 ====================

    @Override
    public Map<String, Map<String, String>> getUserFieldSnapshot(Long userId) {
        Map<String, Map<String, String>> result = new HashMap<>();
        if (userId == null || LoginHelper.isSuperAdmin(userId)) {
            // 超管走旁路：返回空对象，前端不做任何隐藏
            return result;
        }
        try {
            for (SysFieldResource resource : fieldResourceService.listEnabledResources()) {
                Map<String, FieldAccess> snapshot =
                    fieldPermissionService.calcSnapshotForUser(userId, resource.getResourceKey(), null, null);
                Map<String, String> fields = new HashMap<>();
                snapshot.forEach((fieldName, access) -> {
                    // 只下发受限字段：可写是默认状态，下发它纯属浪费带宽
                    if (access != FieldAccess.WRITABLE) {
                        fields.put(fieldName, String.valueOf(access.getCode()));
                    }
                });
                if (!fields.isEmpty()) {
                    result.put(resource.getResourceKey(), fields);
                }
            }
        } catch (Exception e) {
            // 快照只影响前端体验（隐藏/禁用），算不出来就返回空——登录流程绝不能因此失败
            log.warn("字段权限：计算用户 {} 的前端快照失败，前端按无限制渲染 => {}", userId, e.getMessage());
        }
        return result;
    }

    // ==================== 效果预览 ====================

    @Override
    public FieldPreviewVo previewFieldEffect(String resourceKey, Long userId) {
        if (StrUtil.isBlank(resourceKey) || userId == null) {
            throw ServiceException.of("资源标识与用户不能为空");
        }
        SysFieldResource resource = requireResource(resourceKey);
        SysUser user = userDao.getById(userId);
        if (user == null) {
            throw ServiceException.of("用户不存在");
        }

        FieldPreviewVo vo = new FieldPreviewVo();
        vo.setResourceKey(resourceKey);
        vo.setResourceName(resource.getResourceName());
        vo.setUserId(userId);
        vo.setNickName(user.getNickName());
        boolean superAdmin = LoginHelper.isSuperAdmin(userId);
        vo.setSuperAdmin(superAdmin);

        // 走运行期同一套合并逻辑：不传 exclude 参数即为"该用户当前的真实档位"
        Map<String, FieldAccess> snapshot = superAdmin
            ? new HashMap<>()
            : fieldPermissionService.calcSnapshotForUser(userId, resourceKey, null, null);
        Map<String, Integer> baseline = baselineOf(resourceKey);

        for (FieldMetaVo meta : resolveFields(fieldResourceService.listClassesByResource(resourceKey))) {
            FieldPreviewVo.FieldPreviewItem item = new FieldPreviewVo.FieldPreviewItem();
            item.setFieldName(meta.getFieldName());
            item.setLabel(meta.getLabel());
            item.setSensitive(meta.getSensitive());

            FieldAccess decided = snapshot.get(meta.getFieldName());
            FieldAccess access = decided == null ? FieldAccess.WRITABLE : decided;
            item.setAccessType(String.valueOf(access.getCode()));
            item.setAccessLabel(access.getLabel());
            // 区分"配置命中"与"回落基线"：snapshot 里有该字段但值与基线不同才算配置生效。
            // 管理员据此判断"我配的到底起作用没"，而不是把注解带来的脱敏误当成自己的功劳
            Integer baselineCode = baseline.get(meta.getFieldName());
            int expected = baselineCode == null ? FieldAccess.WRITABLE.getCode() : baselineCode;
            item.setFromConfig(decided != null && decided.getCode() != expected);
            if (access == FieldAccess.MASKED) {
                // 🔴 不能用 fieldPermissionService.getMaskStrategy()：它读的是「当前登录管理员」的
                // ThreadLocal 策略表，预览张三时会拿到管理员自己的策略。这里按被预览用户的差异行实算
                item.setStrategy(maskStrategyOfUser(resourceKey, meta.getFieldName(), userId));
            }
            vo.getItems().add(item);
        }
        return vo;
    }

    /**
     * 取被预览用户在某字段上实际生效的脱敏策略
     *
     * <p>从该资源该字段的全部差异行里，筛出该用户命中的主体（角色 / 本部门及祖先 / 本人），
     * 取其中脱敏档且配了策略的一条。多条命中时取第一条——最宽松合并已经决定了档位是脱敏，
     * 此时若多个主体配了不同策略，取谁都是脱敏效果，差别只在掩码形态。</p>
     */
    private String maskStrategyOfUser(String resourceKey, String fieldName, Long userId) {
        SysUser user = userDao.getById(userId);
        if (user == null) {
            return null;
        }
        Set<Long> roleIds = new LinkedHashSet<>(userRoleDao.listRoleIdsByUserId(userId));
        Set<Long> deptIds = new LinkedHashSet<>();
        if (user.getDeptId() != null) {
            deptIds.add(user.getDeptId());
            deptIds.addAll(ancestorDeptIdsOf(user.getDeptId()));
        }
        for (SysFieldPermission row : permissionDao.listByResourceAndField(resourceKey, fieldName)) {
            FieldAccess rowAccess = FieldAccess.ofCode(row.getAccessType());
            if (rowAccess != FieldAccess.MASKED || StrUtil.isBlank(row.getStrategy())) {
                continue;
            }
            SubjectType type = SubjectType.ofCode(row.getSubjectType());
            if (type == null) {
                continue;
            }
            boolean hit = switch (type) {
                case ROLE -> roleIds.contains(row.getSubjectId());
                case DEPT -> deptIds.contains(row.getSubjectId());
                case USER -> userId.equals(row.getSubjectId());
            };
            if (hit) {
                return row.getStrategy();
            }
        }
        return null;
    }

    /**
     * 祖先部门ID（不含自身）。ancestors 格式 "0,100,101"，0 是根占位跳过
     */
    private List<Long> ancestorDeptIdsOf(Long deptId) {
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
                // 脏数据跳过，不让一个坏 ancestors 拖垮预览
            }
        }
        return result;
    }

    // ==================== 收权后果计数 ====================

    @Override
    public FieldAffectedVo countAffectedUsers(String resourceKey, SubjectType subjectType, Long subjectId,
                                              String fieldName, String accessType) {
        FieldAffectedVo vo = new FieldAffectedVo();
        vo.setTotalUsers(0);
        vo.setStillVisibleUsers(0);
        vo.setApproximate(false);
        if (StrUtil.isBlank(resourceKey) || subjectType == null || subjectId == null || StrUtil.isBlank(fieldName)) {
            return vo;
        }
        FieldAccess intended = FieldAccess.ofCode(accessType);
        // 放权（可写）不存在"收权无效"的问题，不必计算
        if (intended == FieldAccess.WRITABLE) {
            return vo;
        }

        List<Long> userIds = listUserIdsOfSubject(subjectType, subjectId);
        vo.setTotalUsers(userIds.size());
        if (userIds.size() > AFFECTED_CALC_LIMIT) {
            vo.setApproximate(true);
            return vo;
        }

        int stillVisible = 0;
        for (Long userId : userIds) {
            // 排除本条配置后重算：看这个用户是否还能从别的主体拿到更宽松的档位
            Map<String, FieldAccess> snapshot =
                fieldPermissionService.calcSnapshotForUser(userId, resourceKey, subjectType, subjectId);
            FieldAccess other = snapshot.get(fieldName);
            // 无动态决策 = 可写（比任何收权档位都宽松）；有决策则比档位大小
            int otherCode = other == null ? FieldAccess.WRITABLE.getCode() : other.getCode();
            if (otherCode <= intended.getCode()) {
                continue;
            }
            stillVisible++;
            if (vo.getSamples().size() < SAMPLE_LIMIT) {
                vo.getSamples().add(buildSample(userId, other));
            }
        }
        vo.setStillVisibleUsers(stillVisible);
        return vo;
    }

    private FieldAffectedVo.AffectedUser buildSample(Long userId, FieldAccess finalAccess) {
        FieldAffectedVo.AffectedUser sample = new FieldAffectedVo.AffectedUser();
        sample.setUserId(userId);
        SysUser user = userDao.getById(userId);
        sample.setNickName(user == null ? String.valueOf(userId) : user.getNickName());
        FieldAccess access = finalAccess == null ? FieldAccess.WRITABLE : finalAccess;
        sample.setFinalAccess(access.getLabel());
        sample.setGrantedBy(access.getLabel());
        return sample;
    }

    /**
     * 取命中某主体的全部用户
     */
    private List<Long> listUserIdsOfSubject(SubjectType subjectType, Long subjectId) {
        return switch (subjectType) {
            case ROLE -> userRoleDao.listUserIdsByRoleId(subjectId);
            case DEPT -> {
                // 含子部门：与 include_sub 默认为 1 的语义一致。
                // listChildrenDeptIds 只返回子孙（靠 ancestors 匹配），本部门要自己加进去
                List<Long> deptIds = new ArrayList<>(deptDao.listChildrenDeptIds(subjectId));
                deptIds.add(subjectId);
                List<Long> userIds = new ArrayList<>();
                for (SysUser user : userDao.listByDeptIds(deptIds)) {
                    userIds.add(user.getUserId());
                }
                yield userIds;
            }
            case USER -> List.of(subjectId);
        };
    }

    /**
     * 校验资源存在且启用
     */
    private SysFieldResource requireResource(String resourceKey) {
        SysFieldResource resource = null;
        for (SysFieldResource item : fieldResourceService.listEnabledResources()) {
            if (resourceKey.equals(item.getResourceKey())) {
                resource = item;
                break;
            }
        }
        if (resource == null) {
            throw ServiceException.of("资源不存在或已停用：{}", resourceKey);
        }
        return resource;
    }
}