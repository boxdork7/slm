package plus.ruoyi.system.core.service.impl;

import cn.hutool.core.util.StrUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import plus.ruoyi.common.core.constant.CacheNames;
import plus.ruoyi.common.core.dict.DictEnableStatus;
import plus.ruoyi.common.core.exception.ServiceException;
import plus.ruoyi.common.core.field.FieldClassType;
import plus.ruoyi.common.redis.utils.CacheUtils;
import plus.ruoyi.common.core.utils.MapstructUtils;
import plus.ruoyi.system.core.dao.ISysFieldPermissionDao;
import plus.ruoyi.system.core.dao.ISysFieldResourceClassDao;
import plus.ruoyi.system.core.dao.ISysFieldResourceDao;
import plus.ruoyi.system.core.dao.ISysMenuDao;
import plus.ruoyi.system.core.domain.SysFieldResource;
import plus.ruoyi.system.core.domain.SysFieldResourceClass;
import plus.ruoyi.system.core.domain.bo.SysFieldResourceBo;
import plus.ruoyi.system.core.domain.vo.SysFieldResourceClassVo;
import plus.ruoyi.system.core.domain.vo.SysFieldResourceVo;
import plus.ruoyi.system.core.service.ISysFieldResourceService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 字段权限资源服务实现
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SysFieldResourceServiceImpl implements ISysFieldResourceService {

    /**
     * 「类 → 资源」缓存里表示"已确认未登记"的占位值。
     * 缓存 null 会被 Spring Cache 当成 miss 反复回源，未登记的类（存量 150+ 个 VO）每次序列化都查库；
     * 用空串占位把"没有"这个事实也缓存下来。
     */
    private static final String UNREGISTERED = "";

    private final ISysFieldResourceDao resourceDao;
    private final ISysFieldResourceClassDao classDao;
    private final ISysMenuDao menuDao;
    /**
     * 用于统计各资源已配置的差异字段数（左树徽标）。同属 ruoyi-system，可直接注入 DAO
     */
    private final ISysFieldPermissionDao permissionDao;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean registerFromAnnotation(String resourceKey, String className, FieldClassType classType) {
        boolean created = false;
        SysFieldResource resource = resourceDao.getByResourceKey(resourceKey);
        if (resource == null) {
            resource = new SysFieldResource();
            resource.setResourceKey(resourceKey);
            // 中文名先按权限前缀反查 C 菜单名，让管理端一开始就显示"用户管理"而不是"system:user"
            String menuName = menuDao.getMenuNameByPermsPrefix(resourceKey);
            resource.setResourceName(StrUtil.blankToDefault(menuName, resourceKey));
            resource.setModuleName(resolveModuleName(resourceKey));
            resource.setSortOrder(999);
            resource.setStatus(DictEnableStatus.ENABLE.getValue());
            resource.setIsAuto("1");
            resourceDao.insert(resource);
            created = true;
        }

        SysFieldResourceClass binding = classDao.getByClassName(className);
        if (binding == null) {
            binding = new SysFieldResourceClass();
            binding.setResourceKey(resourceKey);
            binding.setClassName(className);
            binding.setClassType(classType.getCode());
            binding.setIsAuto("1");
            classDao.insert(binding);
        } else {
            boolean changed = false;
            if (!resourceKey.equals(binding.getResourceKey())) {
                // 同一个类换了资源：以代码为准，但要 WARN——旧资源下对该类字段的配置将不再命中它
                log.warn("字段权限：类 {} 的资源由 {} 变更为 {}，旧资源下的差异配置不再作用于此类",
                    className, binding.getResourceKey(), resourceKey);
                binding.setResourceKey(resourceKey);
                changed = true;
            }
            if (!classType.getCode().equals(binding.getClassType())) {
                binding.setClassType(classType.getCode());
                changed = true;
            }
            if (changed) {
                classDao.updateById(binding);
            }
        }
        return created;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int retireMissingAutoBindings(List<String> scannedClassNames) {
        return classDao.softDeleteAutoNotIn(scannedClassNames);
    }

    @Override
    public List<SysFieldResource> listEnabledResources() {
        return resourceDao.listEnabled();
    }

    @Override
    public List<SysFieldResourceClass> listClassesByResource(String resourceKey) {
        return classDao.listByResourceKey(resourceKey);
    }

    @Override
    public String getResourceKeyByClass(String className) {
        if (StrUtil.isBlank(className)) {
            return null;
        }
        String cached = CacheUtils.get(CacheNames.SYS_FIELD_CLASS_RESOURCE, className);
        if (cached != null) {
            return UNREGISTERED.equals(cached) ? null : cached;
        }
        // miss 回源查库，不允许"再读一次缓存"：事务中 CacheUtils.put 会推迟到 afterCommit
        SysFieldResourceClass binding = classDao.getByClassName(className);
        String resourceKey = binding == null ? UNREGISTERED : binding.getResourceKey();
        CacheUtils.put(CacheNames.SYS_FIELD_CLASS_RESOURCE, className, resourceKey);
        return UNREGISTERED.equals(resourceKey) ? null : resourceKey;
    }

    @Override
    public Map<String, String> reloadClassResourceCache() {
        CacheUtils.clear(CacheNames.SYS_FIELD_CLASS_RESOURCE);
        Map<String, String> map = new HashMap<>();
        for (SysFieldResourceClass binding : classDao.listAll()) {
            map.put(binding.getClassName(), binding.getResourceKey());
            CacheUtils.put(CacheNames.SYS_FIELD_CLASS_RESOURCE, binding.getClassName(), binding.getResourceKey());
        }
        return map;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateResourceMeta(SysFieldResource resource) {
        if (resource == null || resource.getId() == null) {
            throw ServiceException.of("资源ID不能为空");
        }
        SysFieldResource exists = resourceDao.getById(resource.getId());
        if (exists == null) {
            throw ServiceException.of("资源不存在");
        }
        // 只放行四个元信息字段：resource_key / is_auto 由扫描器独占维护，后台改了会让配置与类绑定对不上
        SysFieldResource update = new SysFieldResource();
        update.setId(resource.getId());
        update.setResourceName(resource.getResourceName());
        update.setModuleName(resource.getModuleName());
        update.setSortOrder(resource.getSortOrder());
        update.setStatus(resource.getStatus());
        update.setRemark(resource.getRemark());
        return resourceDao.updateById(update) > 0;
    }

    @Override
    public List<SysFieldResourceVo> listResourceVos(SysFieldResourceBo bo) {
        List<SysFieldResource> resources = resourceDao.list(resourceDao.buildQueryWrapper(
            null,
            bo == null ? null : bo.getResourceName(),
            bo == null ? null : bo.getModuleName(),
            bo == null ? null : bo.getStatus()));
        if (resources.isEmpty()) {
            return new ArrayList<>();
        }
        // 一次性取全部绑定与计数，避免每个资源查一次库（资源数量级在百级，全量拉取更快）
        Map<String, List<SysFieldResourceClass>> bindingsByResource = new HashMap<>();
        for (SysFieldResourceClass binding : classDao.listAll()) {
            bindingsByResource.computeIfAbsent(binding.getResourceKey(), k -> new ArrayList<>()).add(binding);
        }
        Map<String, Integer> counts = permissionDao.countConfiguredFieldsByResource();

        List<SysFieldResourceVo> voList = new ArrayList<>(resources.size());
        for (SysFieldResource resource : resources) {
            voList.add(toVo(resource, bindingsByResource.get(resource.getResourceKey()), counts));
        }
        return voList;
    }

    @Override
    public SysFieldResourceVo getResourceVo(Long id) {
        SysFieldResource resource = resourceDao.getById(id);
        if (resource == null) {
            return null;
        }
        return toVo(resource, classDao.listByResourceKey(resource.getResourceKey()),
            permissionDao.countConfiguredFieldsByResource());
    }

    /**
     * 组装资源 VO：附加类绑定清单与差异字段数徽标
     */
    private SysFieldResourceVo toVo(SysFieldResource resource, List<SysFieldResourceClass> bindings,
                                    Map<String, Integer> counts) {
        SysFieldResourceVo vo = MapstructUtils.convert(resource, SysFieldResourceVo.class);
        if (vo == null) {
            return null;
        }
        vo.setConfiguredFieldCount(counts.getOrDefault(resource.getResourceKey(), 0));
        if (bindings != null) {
            List<SysFieldResourceClassVo> classVos = new ArrayList<>(bindings.size());
            for (SysFieldResourceClass binding : bindings) {
                SysFieldResourceClassVo classVo = MapstructUtils.convert(binding, SysFieldResourceClassVo.class);
                if (classVo == null) {
                    continue;
                }
                classVo.setSimpleName(StrUtil.subAfter(binding.getClassName(), '.', true));
                FieldClassType type = FieldClassType.ofCode(binding.getClassType());
                classVo.setClassTypeLabel(type == null ? binding.getClassType() : type.getLabel());
                classVos.add(classVo);
            }
            vo.setClasses(classVos);
        }
        return vo;
    }

    /**
     * 按资源标识首段推断模块分组中文名，推不出来就用首段原文，管理员可在后台改
     */
    private String resolveModuleName(String resourceKey) {
        String prefix = StrUtil.subBefore(resourceKey, ':', false);
        return switch (prefix) {
            case "system" -> "系统管理";
            case "monitor" -> "系统监控";
            case "base" -> "基础业务";
            case "mall" -> "商城管理";
            case "crm" -> "客户管理";
            case "iot" -> "物联网";
            default -> prefix;
        };
    }
}