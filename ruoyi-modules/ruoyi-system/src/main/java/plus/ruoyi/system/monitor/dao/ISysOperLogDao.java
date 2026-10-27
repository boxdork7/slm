package plus.ruoyi.system.monitor.dao;

import plus.ruoyi.common.mybatis.core.dao.IBaseDao;
import plus.ruoyi.common.mybatis.core.query.PlusLambdaQuery;
import plus.ruoyi.system.monitor.domain.SysOperLog;
import plus.ruoyi.system.monitor.domain.bo.SysOperLogBo;

import java.util.Collection;
import java.util.Date;
import java.util.List;

/**
 * 操作日志数据访问层
 *
 * @author Lion Li
 */
public interface ISysOperLogDao extends IBaseDao<SysOperLog> {

    /**
     * 构建查询条件
     *
     * @param bo 查询条件
     * @return 查询构造器
     */
    PlusLambdaQuery<SysOperLog> buildQueryWrapper(SysOperLogBo bo);

    /**
     * 查询早于指定时间的一批日志（等保二级 8.1.4.3 c 归档用）
     * <p>
     * 分批取而不是一次全取：日志表通常是全库最大的表，一次性载入几十万条会撑爆堆内存。
     *
     * @param before    时间界限，早于该时间的记录才会被返回
     * @param batchSize 单批最大条数
     * @return 待归档的日志，无数据时返回空集合
     */
    List<SysOperLog> listBeforeTime(Date before, int batchSize);

    /**
     * 查询一批日志用于归档（不限时间，供「清空日志」场景使用）
     *
     * @param operIds   指定主键；为空则取主表任意一批
     * @param batchSize 单批最大条数
     * @return 待归档的日志，无数据时返回空集合
     */
    List<SysOperLog> listForArchive(Collection<Long> operIds, int batchSize);
}
