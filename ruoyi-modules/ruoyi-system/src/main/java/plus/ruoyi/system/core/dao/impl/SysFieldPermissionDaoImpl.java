package plus.ruoyi.system.core.dao.impl;

import org.springframework.stereotype.Repository;
import plus.ruoyi.common.core.field.SubjectType;
import plus.ruoyi.common.mybatis.core.dao.impl.BaseDaoImpl;
import plus.ruoyi.common.mybatis.core.query.PlusLambdaQuery;
import plus.ruoyi.system.core.dao.ISysFieldPermissionDao;
import plus.ruoyi.system.core.domain.SysFieldPermission;
import plus.ruoyi.system.core.mapper.SysFieldPermissionMapper;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * 字段权限配置表 DAO 实现
 */
@Repository
public class SysFieldPermissionDaoImpl extends BaseDaoImpl<SysFieldPermissionMapper, SysFieldPermission>
    implements ISysFieldPermissionDao {

    @Override
    public List<SysFieldPermission> listBySubjectAndResource(SubjectType subjectType, Long subjectId, String resourceKey) {
        PlusLambdaQuery<SysFieldPermission> lqw = PlusLambdaQuery.of(SysFieldPermission.class)
            .eq(SysFieldPermission::getSubjectType, subjectType.getCode())
            .eq(SysFieldPermission::getSubjectId, subjectId)
            .eq(SysFieldPermission::getResourceKey, resourceKey);
        return list(lqw);
    }

    @Override
    public int deleteBySubjectAndResource(SubjectType subjectType, Long subjectId, String resourceKey) {
        List<SysFieldPermission> rows = listBySubjectAndResource(subjectType, subjectId, resourceKey);
        if (rows.isEmpty()) {
            return 0;
        }
        // 走 deleteByIds 让 @TableLogic 生效（逻辑删除），保留配置变更追溯
        return deleteByIds(rows.stream().map(SysFieldPermission::getId).toList());
    }

    @Override
    public int deleteBySubject(SubjectType subjectType, Long subjectId) {
        PlusLambdaQuery<SysFieldPermission> lqw = PlusLambdaQuery.of(SysFieldPermission.class)
            .eq(SysFieldPermission::getSubjectType, subjectType.getCode())
            .eq(SysFieldPermission::getSubjectId, subjectId);
        List<SysFieldPermission> rows = list(lqw);
        if (rows.isEmpty()) {
            return 0;
        }
        return deleteByIds(rows.stream().map(SysFieldPermission::getId).toList());
    }

    @Override
    public List<String> listConfiguredResourceKeys() {
        PlusLambdaQuery<SysFieldPermission> lqw = PlusLambdaQuery.of(SysFieldPermission.class)
            .select(SysFieldPermission::getResourceKey);
        // 差异行总量可控（只存非基线档位），在应用层去重比 DISTINCT 更好跨库
        Set<String> keys = new LinkedHashSet<>();
        for (SysFieldPermission row : list(lqw)) {
            keys.add(row.getResourceKey());
        }
        return new ArrayList<>(keys);
    }

    @Override
    public Map<String, Integer> countConfiguredFieldsByResource() {
        PlusLambdaQuery<SysFieldPermission> lqw = PlusLambdaQuery.of(SysFieldPermission.class)
            .select(SysFieldPermission::getResourceKey, SysFieldPermission::getFieldName);
        // 同字段被多个主体配置只算一次，用 Set 去重后再计数
        Map<String, Set<String>> fieldsByResource = new LinkedHashMap<>();
        for (SysFieldPermission row : list(lqw)) {
            fieldsByResource.computeIfAbsent(row.getResourceKey(), k -> new LinkedHashSet<>())
                .add(row.getFieldName());
        }
        Map<String, Integer> counts = new LinkedHashMap<>();
        fieldsByResource.forEach((key, fields) -> counts.put(key, fields.size()));
        return counts;
    }

    @Override
    public List<SysFieldPermission> listByResourceAndField(String resourceKey, String fieldName) {
        PlusLambdaQuery<SysFieldPermission> lqw = PlusLambdaQuery.of(SysFieldPermission.class)
            .eq(SysFieldPermission::getResourceKey, resourceKey)
            .eq(SysFieldPermission::getFieldName, fieldName);
        return list(lqw);
    }
}