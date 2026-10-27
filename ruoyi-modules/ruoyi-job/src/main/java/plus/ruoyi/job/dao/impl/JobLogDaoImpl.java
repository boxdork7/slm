package plus.ruoyi.job.dao.impl;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.thread.ThreadUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import plus.ruoyi.common.core.utils.StreamUtils;
import plus.ruoyi.common.mybatis.core.dao.impl.BaseDaoImpl;
import plus.ruoyi.common.mybatis.core.query.PlusLambdaQuery;
import plus.ruoyi.job.dao.IJobLogDao;
import plus.ruoyi.job.domain.JobLog;
import plus.ruoyi.job.domain.bo.JobLogBo;
import plus.ruoyi.job.mapper.JobLogMapper;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.function.Supplier;

/**
 * 定时任务执行日志数据访问实现
 *
 * @author 抓蛙师
 */
@Slf4j
@Repository
public class JobLogDaoImpl extends BaseDaoImpl<JobLogMapper, JobLog> implements IJobLogDao {

    /**
     * 单批删除行数。5000 是「事务足够小」与「往返次数不过多」的折中：
     * 百万级日志约 200 轮，单批锁持有时间在毫秒级，不会阻塞调度器写日志。
     */
    private static final int BATCH_SIZE = 5000;

    /**
     * 批间让出时长（毫秒），给其他连接留出写入窗口
     */
    private static final long BATCH_INTERVAL_MS = 50L;

    /**
     * 执行状态：执行中（对应 job_log.status 字典 job_execute_status）
     */
    private static final String STATUS_RUNNING = "2";

    /**
     * 执行状态：失败
     */
    private static final String STATUS_FAILED = "0";

    /**
     * 构建查询条件
     *
     * @param bo 查询参数
     * @return 查询条件
     */
    @Override
    public PlusLambdaQuery<JobLog> buildQueryWrapper(JobLogBo bo) {
        Map<String, Object> params = bo.getParams();
        PlusLambdaQuery<JobLog> lqw = PlusLambdaQuery.of();

        lqw.eq(JobLog::getJobId, bo.getJobId());
        lqw.like(JobLog::getJobName, bo.getJobName());
        lqw.eq(JobLog::getJobGroup, bo.getJobGroup());
        lqw.eq(JobLog::getInvokeTarget, bo.getInvokeTarget());
        lqw.eq(JobLog::getStatus, bo.getStatus());
        lqw.eq(JobLog::getExecuteNode, bo.getExecuteNode());
        lqw.between(JobLog::getStartTime, params.get("beginStartTime"), params.get("endStartTime"));
        lqw.orderByDesc(JobLog::getCreateTime);
        return lqw;
    }

    /**
     * 分批物理删除指定时间之前的日志
     *
     * @param before 时间点
     * @return 累计删除行数
     */
    @Override
    public int deleteBefore(Date before) {
        return deleteInBatches(() -> PlusLambdaQuery.<JobLog>of().lt(JobLog::getCreateTime, before));
    }

    /**
     * 分批物理清空全部日志
     *
     * @return 累计删除行数
     */
    @Override
    public int deleteAll() {
        return deleteInBatches(PlusLambdaQuery::of);
    }

    /**
     * 将指定节点上仍处于「执行中」的日志标记为「已中断」
     *
     * @param executeNode 执行节点标识
     * @return 影响行数
     */
    @Override
    public int markInterruptedByNode(String executeNode) {
        Date now = new Date();
        return lambdaUpdate()
            .set(JobLog::getStatus, STATUS_FAILED)
            .set(JobLog::getJobMessage, "应用关停，执行被中断")
            .set(JobLog::getStopTime, now)
            .eq(JobLog::getStatus, STATUS_RUNNING)
            .eq(JobLog::getExecuteNode, executeNode)
            .update();
    }

    /**
     * 按批循环删除，直到条件命中的数据被删完。
     * <p>
     * 实现要点：
     * <ul>
     *   <li>每轮只查主键并关闭 count 查询，由分页插件生成各数据库对应的 LIMIT/ROWNUM/TOP，保证跨库可用；</li>
     *   <li>每轮固定取第 1 页——上一批已被物理删除，剩余数据自然前移，不必递增页码；</li>
     *   <li>每批间隔短暂让出，避免持续占满 IO 拖垮调度器自身的日志写入；</li>
     *   <li>本方法不加事务，每批随 MyBatis 会话独立提交，中断时已删批次不回滚。</li>
     * </ul>
     *
     * @param conditionSupplier 删除条件构造器（每轮新建，避免复用 wrapper 累积状态）
     * @return 累计删除行数
     */
    private int deleteInBatches(Supplier<PlusLambdaQuery<JobLog>> conditionSupplier) {
        int total = 0;
        while (true) {
            PlusLambdaQuery<JobLog> wrapper = conditionSupplier.get();
            // 只取主键：日志表含 exception_info 等大字段，全字段捞回来纯属浪费
            wrapper.select(JobLog::getId);
            Page<JobLog> page = new Page<>(1, BATCH_SIZE, false);
            List<JobLog> rows = baseMapper.selectList(page, wrapper);
            if (CollUtil.isEmpty(rows)) {
                break;
            }
            total += deleteByIds(StreamUtils.toList(rows, JobLog::getId));
            // 不足一批说明已删完，无需再查一次空结果
            if (rows.size() < BATCH_SIZE) {
                break;
            }
            // sleep 返回 false 表示被中断（如任务配置了超时被看门狗打断），停止继续删除
            if (!ThreadUtil.sleep(BATCH_INTERVAL_MS)) {
                log.warn("[job] 日志分批清理被中断，本次已删除 {} 条，剩余部分留待下次执行", total);
                Thread.currentThread().interrupt();
                break;
            }
        }
        return total;
    }
}
