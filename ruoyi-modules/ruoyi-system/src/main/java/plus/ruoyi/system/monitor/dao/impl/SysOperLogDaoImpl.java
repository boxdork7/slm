package plus.ruoyi.system.monitor.dao.impl;

import cn.hutool.core.collection.CollUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import plus.ruoyi.common.core.utils.StringUtils;
import plus.ruoyi.common.mybatis.core.dao.impl.BaseDaoImpl;
import plus.ruoyi.common.mybatis.core.page.PageQuery;
import plus.ruoyi.common.mybatis.core.query.PlusLambdaQuery;
import plus.ruoyi.system.monitor.dao.ISysOperLogDao;
import plus.ruoyi.system.monitor.domain.SysOperLog;
import plus.ruoyi.system.monitor.domain.bo.SysOperLogBo;
import plus.ruoyi.system.monitor.mapper.SysOperLogMapper;

import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 操作日志数据访问实现
 *
 * @author Lion Li
 */
@RequiredArgsConstructor
@Repository
public class SysOperLogDaoImpl extends BaseDaoImpl<SysOperLogMapper, SysOperLog> implements ISysOperLogDao {

    /**
     * 构建查询条件
     */
    @Override
    public PlusLambdaQuery<SysOperLog> buildQueryWrapper(SysOperLogBo bo) {
        Map<String, Object> params = bo.getParams();
        PlusLambdaQuery<SysOperLog> lqw = PlusLambdaQuery.of(SysOperLog.class)
            .like(SysOperLog::getOperIp, bo.getOperIp())
            .like(SysOperLog::getTitle, bo.getTitle())
            //  操作类型使用StringUtils.splitList分割查询
            .in(SysOperLog::getOperType, StringUtils.splitToList(bo.getOperType()))
            .eq(SysOperLog::getStatus, bo.getStatus())
            .like(SysOperLog::getOperName, bo.getOperName())
            .between(SysOperLog::getOperTime, params.get("beginTime"), params.get("endTime"));
        // 模糊搜索（跨数据库兼容：String 类型用 like，非 String 类型用 likeCast）
        String searchValue = bo.getSearchValue();
        if (StringUtils.isNotBlank(searchValue)) {
            lqw.and(w -> w
                .like(SysOperLog::getTitle, searchValue)           // String
                .or().like(SysOperLog::getOperName, searchValue)   // String
                .or().like(SysOperLog::getOperIp, searchValue)     // String
                .or().like(SysOperLog::getOperLocation, searchValue) // String
                .or().likeCast(SysOperLog::getOperId, searchValue)); // Long
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
    public List<SysOperLog> listBeforeTime(Date before, int batchSize) {
        if (before == null || batchSize <= 0) {
            return Collections.emptyList();
        }
        PlusLambdaQuery<SysOperLog> lqw = PlusLambdaQuery.of(SysOperLog.class)
            .lt(SysOperLog::getOperTime, before)
            .orderByAsc(SysOperLog::getOperTime);
        // 用分页取首页作为「取 N 条」，避免 last("LIMIT n") 这种 MySQL 方言写法，
        // 保证 Oracle / SQL Server 上同样可用
        return page(lqw, new PageQuery(batchSize, 1)).getRecords();
    }

    /**
     * 查询一批日志用于归档（不限时间，供「清空日志」场景使用）
     *
     * @param operIds   指定主键；为空则取主表任意一批
     * @param batchSize 单批最大条数
     * @return 待归档的日志
     */
    @Override
    public List<SysOperLog> listForArchive(Collection<Long> operIds, int batchSize) {
        if (batchSize <= 0) {
            return Collections.emptyList();
        }
        PlusLambdaQuery<SysOperLog> lqw = PlusLambdaQuery.of(SysOperLog.class);
        if (CollUtil.isNotEmpty(operIds)) {
            lqw.in(SysOperLog::getOperId, operIds);
        }
        lqw.orderByAsc(SysOperLog::getOperId);
        return page(lqw, new PageQuery(batchSize, 1)).getRecords();
    }

}
