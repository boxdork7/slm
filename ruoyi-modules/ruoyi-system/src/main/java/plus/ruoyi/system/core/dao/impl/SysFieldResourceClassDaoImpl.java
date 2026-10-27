package plus.ruoyi.system.core.dao.impl;

import cn.hutool.core.collection.CollUtil;
import org.springframework.stereotype.Repository;
import plus.ruoyi.common.mybatis.core.dao.impl.BaseDaoImpl;
import plus.ruoyi.common.mybatis.core.query.PlusLambdaQuery;
import plus.ruoyi.system.core.dao.ISysFieldResourceClassDao;
import plus.ruoyi.system.core.domain.SysFieldResourceClass;
import plus.ruoyi.system.core.mapper.SysFieldResourceClassMapper;

import java.util.List;

/**
 * 字段权限资源与类绑定表 DAO 实现
 */
@Repository
public class SysFieldResourceClassDaoImpl extends BaseDaoImpl<SysFieldResourceClassMapper, SysFieldResourceClass>
    implements ISysFieldResourceClassDao {

    @Override
    public SysFieldResourceClass getByClassName(String className) {
        PlusLambdaQuery<SysFieldResourceClass> lqw = PlusLambdaQuery.of(SysFieldResourceClass.class)
            .eq(SysFieldResourceClass::getClassName, className);
        return getOne(lqw, false);
    }

    @Override
    public List<SysFieldResourceClass> listByResourceKey(String resourceKey) {
        PlusLambdaQuery<SysFieldResourceClass> lqw = PlusLambdaQuery.of(SysFieldResourceClass.class)
            .eq(SysFieldResourceClass::getResourceKey, resourceKey)
            .orderByAsc(SysFieldResourceClass::getClassType);
        return list(lqw);
    }

    @Override
    public List<SysFieldResourceClass> listByResourceKeyAndType(String resourceKey, String classType) {
        PlusLambdaQuery<SysFieldResourceClass> lqw = PlusLambdaQuery.of(SysFieldResourceClass.class)
            .eq(SysFieldResourceClass::getResourceKey, resourceKey)
            .eq(SysFieldResourceClass::getClassType, classType);
        return list(lqw);
    }

    @Override
    public List<SysFieldResourceClass> listAll() {
        return list(PlusLambdaQuery.of(SysFieldResourceClass.class));
    }

    @Override
    public int softDeleteAutoNotIn(List<String> keepClassNames) {
        PlusLambdaQuery<SysFieldResourceClass> lqw = PlusLambdaQuery.of(SysFieldResourceClass.class)
            .eq(SysFieldResourceClass::getIsAuto, "1");
        if (CollUtil.isNotEmpty(keepClassNames)) {
            lqw.notIn(SysFieldResourceClass::getClassName, keepClassNames);
        }
        List<SysFieldResourceClass> stale = list(lqw);
        if (stale.isEmpty()) {
            return 0;
        }
        // deleteByIds 走 @TableLogic 变成逻辑删除
        return deleteByIds(stale.stream().map(SysFieldResourceClass::getId).toList());
    }
}