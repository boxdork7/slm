package plus.ruoyi.system.monitor.dao.impl;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.ObjectUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import plus.ruoyi.common.mybatis.core.dao.impl.BaseDaoImpl;
import plus.ruoyi.common.mybatis.core.page.PageQuery;
import plus.ruoyi.common.mybatis.core.query.PlusLambdaQuery;
import plus.ruoyi.system.monitor.dao.ISysLoginLogDao;
import plus.ruoyi.system.monitor.domain.SysLoginLog;
import plus.ruoyi.system.monitor.domain.bo.SysLoginLogBo;
import plus.ruoyi.system.monitor.mapper.SysLoginLogMapper;

import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 登录日志数据访问实现
 *
 * @author Lion Li
 */
@RequiredArgsConstructor
@Repository
public class SysLoginLogDaoImpl extends BaseDaoImpl<SysLoginLogMapper, SysLoginLog> implements ISysLoginLogDao {

    /**
     * 构建查询条件
     */
    @Override
    public PlusLambdaQuery<SysLoginLog> buildQueryWrapper(SysLoginLogBo bo) {
        Map<String, Object> params = bo.getParams();
        PlusLambdaQuery<SysLoginLog> lqw = PlusLambdaQuery.of(SysLoginLog.class)
            .like(SysLoginLog::getIpaddr, bo.getIpaddr())
            .eq(SysLoginLog::getStatus, bo.getStatus())
            .like(SysLoginLog::getUserName, bo.getUserName())
            .between(SysLoginLog::getLoginTime, params.get("beginTime"), params.get("endTime"));
        // 模糊搜索（跨数据库兼容：String 类型用 like，非 String 类型用 likeCast）
        String searchValue = bo.getSearchValue();
        if (ObjectUtil.isNotEmpty(searchValue)) {
            lqw.and(w -> w
                .like(SysLoginLog::getUserName, searchValue)          // String
                .or().like(SysLoginLog::getIpaddr, searchValue)       // String
                .or().like(SysLoginLog::getLoginLocation, searchValue) // String
                .or().like(SysLoginLog::getMsg, searchValue)          // String
                .or().like(SysLoginLog::getDeviceType, searchValue)   // String
                .or().like(SysLoginLog::getOs, searchValue)           // String
                .or().like(SysLoginLog::getBrowser, searchValue)      // String
                .or().likeCast(SysLoginLog::getUserId, searchValue)   // Long
                .or().likeCast(SysLoginLog::getInfoId, searchValue)); // Long
        }
        return lqw;
    }

    /**
     * 查询早于指定时间的一批日志（等保二级 8.1.4.3 c 归档用）
     *
     * @param before    时间界限
     * @param batchSize 单批最大条数
     * @return 待归档的日志
     */
    @Override
    public List<SysLoginLog> listBeforeTime(Date before, int batchSize) {
        if (before == null || batchSize <= 0) {
            return Collections.emptyList();
        }
        PlusLambdaQuery<SysLoginLog> lqw = PlusLambdaQuery.of(SysLoginLog.class)
            .lt(SysLoginLog::getLoginTime, before)
            .orderByAsc(SysLoginLog::getLoginTime);
        // 用分页取首页作为「取 N 条」，避免 last("LIMIT n") 这种 MySQL 方言写法
        return page(lqw, new PageQuery(batchSize, 1)).getRecords();
    }

    /**
     * 查询一批日志用于归档（不限时间，供「清空日志」场景使用）
     *
     * @param infoIds   指定主键；为空则取主表任意一批
     * @param batchSize 单批最大条数
     * @return 待归档的日志
     */
    @Override
    public List<SysLoginLog> listForArchive(Collection<Long> infoIds, int batchSize) {
        if (batchSize <= 0) {
            return Collections.emptyList();
        }
        PlusLambdaQuery<SysLoginLog> lqw = PlusLambdaQuery.of(SysLoginLog.class);
        if (CollUtil.isNotEmpty(infoIds)) {
            lqw.in(SysLoginLog::getInfoId, infoIds);
        }
        lqw.orderByAsc(SysLoginLog::getInfoId);
        return page(lqw, new PageQuery(batchSize, 1)).getRecords();
    }

}
