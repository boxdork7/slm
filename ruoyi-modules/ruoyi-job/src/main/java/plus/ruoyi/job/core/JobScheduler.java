package plus.ruoyi.job.core;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RLock;
import plus.ruoyi.common.mybatis.core.query.PlusLambdaQuery;
import plus.ruoyi.common.redis.utils.RedisUtils;
import plus.ruoyi.job.config.JobProperties;
import plus.ruoyi.job.constant.JobConstants;
import plus.ruoyi.job.dao.IJobInfoDao;
import plus.ruoyi.job.domain.JobInfo;

import java.util.Date;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

/**
 * 调度核心。
 * <p>
 * 每个应用节点独立、周期性扫描到期任务；集群内没有主从之分。
 * <p>
 * 同一次触发只被一个节点执行，靠两道互斥保证：
 * <ol>
 *     <li><b>Redisson 锁</b>（幂等键 {@code job:trigger:{任务ID}:{触发时刻}}）——快速过滤，避免多节点同时打数据库；</li>
 *     <li><b>数据库 CAS</b>（按「期望值 = 本次触发时刻」推进 next_execute_time）——正确性兜底，
 *     Redis 故障或锁提前失效时仍不会重复执行。</li>
 * </ol>
 * 注意：到期判断依赖各节点本地时钟，集群部署务必保证节点间时钟同步（NTP），否则触发时刻由最快的节点主导。
 * 触发语义为「最多一次」：推进成功后、分发执行前节点崩溃，这次触发会丢失且不会被其他节点补偿。
 * <p>
 * 错过执行（misfire）处理：迟到超过 {@code ruoyi.job.misfire-threshold} 才判定为错过，
 * 策略取自 {@code job_info.misfire_policy}——'1' 立即补跑一次，其余值（'2'放弃/'3'顺延，行为一致）
 * 只顺延不补跑，避免停机恢复后大量任务集中补偿执行压垮系统。
 *
 * @author 抓蛙师
 */
@Slf4j
public class JobScheduler {

    /**
     * 错过执行策略：立即补一次
     */
    private static final String MISFIRE_FIRE_NOW = "1";

    /**
     * 关停时等待当前扫描轮次结束的上限（毫秒）
     */
    private static final long SHUTDOWN_WAIT_MS = 5_000L;

    @Resource
    private IJobInfoDao jobInfoDao;
    @Resource
    private JobInvoker jobInvoker;
    @Resource
    private JobProperties jobProperties;

    private ScheduledExecutorService scanExecutor;

    /**
     * 扫描任务句柄，用于自检其是否被异常终止
     */
    private volatile ScheduledFuture<?> scanFuture;

    @PostConstruct
    public void start() {
        scanExecutor = Executors.newSingleThreadScheduledExecutor(r -> {
            Thread t = new Thread(r, "job-scheduler-scan");
            t.setDaemon(true);
            return t;
        });
        long intervalMs = jobProperties.getScanInterval().toMillis();
        // 首次延迟 10s（等执行器注册完成），之后按固定间隔扫描
        scanFuture = scanExecutor.scheduleWithFixedDelay(this::safeScan, 10_000, intervalMs, TimeUnit.MILLISECONDS);
        // 自检守护：scheduleWithFixedDelay 的周期任务一旦抛出 Throwable 就会被永久取消，
        // 且异常被 FutureTask 吞掉不留任何日志。safeScan 已兜住所有 Throwable，此处再加一道保险，
        // 万一仍然意外终止（如 JVM 层面的错误），能自动重建并告警，避免调度静默死亡。
        scanExecutor.scheduleWithFixedDelay(() -> reviveIfDead(intervalMs),
            60_000, 60_000, TimeUnit.MILLISECONDS);
        log.info("[job] 调度器已启动，扫描间隔 {}ms", intervalMs);
    }

    /**
     * 扫描异常绝不能逃出本方法。
     * <p>
     * 必须捕获 {@link Throwable} 而非 Exception：{@code ScheduledExecutorService} 的周期任务
     * 一旦抛出任何 Throwable（含 OOM 等 Error），后续执行会被**永久取消**，异常还会被 FutureTask 吞掉，
     * 表现为进程活着、接口正常，但定时任务再也不跑且没有任何错误日志——这是最难排查的故障形态。
     */
    private void safeScan() {
        try {
            // 整个扫描链路（查待执行任务 + 初始化/CAS 推进 next_execute_time）必须避开各层数据过滤
            // —— 调度是平台级能力，要能看到并推进全部任务。绕开哪些过滤器、少了会怎样，见 JobPlatformContext。
            //
            // 注意保护只覆盖到 dispatch 之前：业务执行是异步投递到 bizPool 的，
            // ThreadLocal 不会传递过去，业务代码的上下文由执行器自行负责。
            JobPlatformContext.run(this::scan);
        } catch (Throwable t) {
            log.error("[job] 调度扫描异常（已拦截，调度继续）", t);
        }
    }

    /**
     * 发现扫描任务已终止则重建，保证调度不会静默停摆。
     *
     * @param intervalMs 扫描间隔（毫秒）
     */
    private void reviveIfDead(long intervalMs) {
        try {
            ScheduledFuture<?> current = scanFuture;
            if (current != null && !current.isDone()) {
                return;
            }
            log.error("[job] 检测到调度扫描任务已终止，正在自动重建");
            scanFuture = scanExecutor.scheduleWithFixedDelay(this::safeScan, 0, intervalMs, TimeUnit.MILLISECONDS);
        } catch (Throwable t) {
            log.error("[job] 调度自检异常", t);
        }
    }

    private void scan() {
        Date now = new Date();
        // 扫描 status=1(运行中) 且「已到期」的任务。数据过滤已由 safeScan 的 JobPlatformContext 统一屏蔽。
        // 到期条件下推给数据库而非拉回内存判断：可命中 idx_status_next(status, next_execute_time) 索引，
        // 绝大多数轮次直接返回空集，避免把全部启用任务(含 job_params/remark 等大字段)反复捞回来。
        // 额外带上 next_execute_time IS NULL 分支：兜住手工改库等异常数据，交由下方初始化逻辑补算。
        List<JobInfo> jobs = jobInfoDao.list(PlusLambdaQuery.<JobInfo>of()
            .eq(JobInfo::getStatus, "1")
            .and(w -> w.le(JobInfo::getNextExecuteTime, now).or().isNull(JobInfo::getNextExecuteTime)));
        for (JobInfo job : jobs) {
            try {
                handleJob(job, now);
            } catch (Exception e) {
                log.error("[job] 处理任务[{}]异常", job.getJobName(), e);
            }
        }
    }

    private void handleJob(JobInfo job, Date now) {
        // ① 首次没有下次执行时间 → 初始化并跳过本轮
        if (job.getNextExecuteTime() == null) {
            Date next = nextTime(job.getCronExpression(), now);
            if (next != null) {
                initNextTime(job.getId(), next);
            }
            return;
        }
        // ② 未到执行时间 → 跳过（扫描 SQL 已过滤，此处仅防御 DB 与 JVM 时间精度差异导致的边界情况）
        if (job.getNextExecuteTime().after(now)) {
            return;
        }
        // ③ 判定是否属于「错过执行」：迟到超过阈值才算，避免把扫描间隔造成的正常抖动误判为错过
        long delayMs = now.getTime() - job.getNextExecuteTime().getTime();
        boolean misfired = delayMs > jobProperties.getMisfireThreshold().toMillis();
        // ④ 到期：以"任务ID + 触发时刻"为幂等键抢锁，抢到的节点负责本次触发
        long triggerTime = job.getNextExecuteTime().getTime();
        String triggerKey = JobConstants.TRIGGER_LOCK_PREFIX + job.getId() + ":" + triggerTime;
        RLock lock = RedisUtils.getLock(triggerKey);
        boolean locked;
        try {
            // 非阻塞抢锁；持锁 60s（仅用于防止并发分发，业务执行是异步的）
            locked = lock.tryLock(0, 60, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return;
        }
        if (!locked) {
            return; // 本次触发已被其他节点占有
        }
        try {
            // ⑤ CAS 推进下次执行时间：期望值为本次触发时刻，只有更新成功的节点才真正拥有本次触发的执行权。
            //    这是 Redis 锁之外的第二道保险——Redis 故障或锁提前失效时，DB 层仍能保证同一次触发只被推进一次，
            //    避免多节点重复执行。同时也承担「先推进再分发」防重复触发的原有职责。
            Date next = nextTime(job.getCronExpression(), new Date());
            if (!advanceNextTime(job.getId(), job.getNextExecuteTime(), next)) {
                log.warn("[job] 任务[{}]本次触发已被其他节点推进，放弃本次执行", job.getJobName());
                return;
            }
            // ⑥ 错过执行且策略不是「立即补一次」→ 只顺延不补跑，防止停机恢复后大量任务集中补偿执行
            if (misfired && !MISFIRE_FIRE_NOW.equals(job.getMisfirePolicy())) {
                log.warn("[job] 任务[{}]错过执行(迟到 {}s)，按错过策略[{}]跳过本次，顺延至 {}",
                    job.getJobName(), delayMs / 1000, job.getMisfirePolicy(), next);
                jobInvoker.recordSkipped(job, 0, "错过执行时间 " + delayMs / 1000 + "s，已按错过策略跳过本次");
                return;
            }
            // ⑦ 分发执行（集群=本地执行；广播=pub/sub 通知所有节点）
            jobInvoker.dispatch(job, triggerTime);
        } finally {
            lock.unlock();
        }
    }

    /**
     * 初始化下次执行时间。
     * <p>
     * 带 {@code next_execute_time IS NULL} 条件，保证多节点同时发现未初始化任务时只有一个写入成功。
     *
     * @param jobId 任务ID
     * @param next  计算出的下次执行时间
     */
    private void initNextTime(Long jobId, Date next) {
        jobInfoDao.lambdaUpdate()
            .set(JobInfo::getNextExecuteTime, next)
            .eq(JobInfo::getId, jobId)
            .isNull(JobInfo::getNextExecuteTime)
            .update();
    }

    /**
     * CAS 推进下次执行时间：仅当库中值仍等于本次触发时刻时才更新。
     * <p>
     * 更新成功即代表本节点独占了这一次触发。相比单纯依赖 Redis 锁，多了一层数据库级别的互斥，
     * Redis 不可用或锁提前失效时也不会出现多节点重复执行。
     *
     * @param jobId    任务ID
     * @param expected 期望的当前值（本次触发时刻）
     * @param next     要推进到的新值，cron 无后续触发时为 null
     * @return true 表示本节点抢到了本次触发的执行权
     */
    private boolean advanceNextTime(Long jobId, Date expected, Date next) {
        int rows = jobInfoDao.lambdaUpdate()
            .set(JobInfo::getNextExecuteTime, next)
            .eq(JobInfo::getId, jobId)
            .eq(JobInfo::getNextExecuteTime, expected)
            .update();
        return rows > 0;
    }

    /**
     * 计算下一次执行时间（委托 {@link CronUtils}，统一时区与解析规则）。
     *
     * @param cron cron 表达式
     * @param base 基准时间
     * @return 下次执行时间，cron 非法或无后续触发返回 null
     */
    private Date nextTime(String cron, Date base) {
        if (!CronUtils.isValid(cron)) {
            return null;
        }
        return CronUtils.next(cron, base);
    }

    /**
     * 关停调度扫描。
     * <p>
     * 先 {@code shutdown()} 停止后续周期，再给当前这一轮扫描一点时间收尾：
     * 扫描线程可能正持有某个任务的触发锁并处于「CAS 推进 next_execute_time」的中途，
     * 直接强杀会让锁只能等租约到期，期间该任务在整个集群里都无法被触发。
     * <p>
     * 等待上限刻意取得比 {@link JobProperties#getShutdownTimeout()} 短：调度扫描本身很轻
     * （抢锁 + 两次 DB 操作），留几秒足够，剩余的宽限时间应该留给真正在跑业务的执行器。
     */
    @PreDestroy
    public void stop() {
        if (scanExecutor == null) {
            return;
        }
        scanExecutor.shutdown();
        try {
            if (!scanExecutor.awaitTermination(SHUTDOWN_WAIT_MS, TimeUnit.MILLISECONDS)) {
                scanExecutor.shutdownNow();
                log.warn("[job] 调度扫描线程未在 {}ms 内结束，已强制中断", SHUTDOWN_WAIT_MS);
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            scanExecutor.shutdownNow();
        }
        log.info("[job] 调度器已停止");
    }
}
