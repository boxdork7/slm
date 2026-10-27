package plus.ruoyi.job.dao;

import plus.ruoyi.common.mybatis.core.dao.IBaseDao;
import plus.ruoyi.common.mybatis.core.query.PlusLambdaQuery;
import plus.ruoyi.job.domain.JobLog;
import plus.ruoyi.job.domain.bo.JobLogBo;

import java.util.Date;

/**
 * 定时任务执行日志 DAO 接口
 *
 * @author 抓蛙师
 */
public interface IJobLogDao extends IBaseDao<JobLog> {

    /**
     * 根据业务对象构建查询条件
     *
     * @param bo 查询参数
     * @return 查询条件
     */
    PlusLambdaQuery<JobLog> buildQueryWrapper(JobLogBo bo);

    /**
     * 分批物理删除指定时间之前的日志（供内置清理任务使用）
     * <p>
     * 分批而非单条 DELETE：job_log 无分区无逻辑删除，长期运行后动辄百万行，
     * 单事务全删会撑爆 undo log 并对 idx_create_time 加范围锁，
     * 与调度器自身持续写入的日志互相阻塞，最终导致所有任务日志写入失败。
     * <p>
     * 每批独立提交，中途被中断（如任务超时）时已删除的批次不回滚，下次执行继续。
     *
     * @param before 时间点，早于该时间的日志将被删除
     * @return 累计删除行数
     */
    int deleteBefore(Date before);

    /**
     * 分批物理清空全部日志（供管理端「清空日志」使用）
     * <p>
     * 分批理由同 {@link #deleteBefore(Date)}。
     *
     * @return 累计删除行数
     */
    int deleteAll();

    /**
     * 将指定节点上仍处于「执行中」的日志标记为「已中断」（供应用关停时收敛使用）
     * <p>
     * 只按节点收敛：集群中其它节点的「执行中」记录可能真的还在运行，不能一并改掉。
     *
     * @param executeNode 执行节点标识
     * @return 影响行数
     */
    int markInterruptedByNode(String executeNode);
}
