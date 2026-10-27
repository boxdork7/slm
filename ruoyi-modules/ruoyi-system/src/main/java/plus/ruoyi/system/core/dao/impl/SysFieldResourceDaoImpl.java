package plus.ruoyi.system.core.dao.impl;

import org.springframework.stereotype.Repository;
import plus.ruoyi.common.core.dict.DictEnableStatus;
import plus.ruoyi.common.mybatis.core.dao.impl.BaseDaoImpl;
import plus.ruoyi.common.mybatis.core.query.PlusLambdaQuery;
import plus.ruoyi.system.core.dao.ISysFieldResourceDao;
import plus.ruoyi.system.core.domain.SysFieldResource;
import plus.ruoyi.system.core.mapper.SysFieldResourceMapper;

import java.util.List;

/**
 * 字段权限资源注册表 DAO 实现
 */
@Repository
public class SysFieldResourceDaoImpl extends BaseDaoImpl<SysFieldResourceMapper, SysFieldResource> implements ISysFieldResourceDao {

    @Override
    public PlusLambdaQuery<SysFieldResource> buildQueryWrapper(String resourceKey, String resourceName, String moduleName, String status) {
        return PlusLambdaQuery.of(SysFieldResource.class)
            .like(SysFieldResource::getResourceKey, resourceKey)
            .like(SysFieldResource::getResourceName, resourceName)
            .eq(SysFieldResource::getModuleName, moduleName)
            .eq(SysFieldResource::getStatus, status)
            .orderByAsc(SysFieldResource::getModuleName)
            .orderByAsc(SysFieldResource::getSortOrder);
    }

    @Override
    public SysFieldResource getByResourceKey(String resourceKey) {
        PlusLambdaQuery<SysFieldResource> lqw = PlusLambdaQuery.of(SysFieldResource.class)
            .eq(SysFieldResource::getResourceKey, resourceKey);
        return getOne(lqw, false);
    }

    @Override
    public List<SysFieldResource> listEnabled() {
        return list(buildQueryWrapper(null, null, null, DictEnableStatus.ENABLE.getValue()));
    }
}