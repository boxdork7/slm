package plus.ruoyi.job.core;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RLock;
import plus.ruoyi.common.core.scheduler.JobContext;
import plus.ruoyi.common.redis.utils.RedisUtils;
import plus.ruoyi.job.config.JobProperties;
import plus.ruoyi.job.constant.JobConstants;
import plus.ruoyi.job.dao.IJobInfoDao;
import plus.ruoyi.job.dao.IJobLogDao;
import plus.ruoyi.job.domain.JobInfo;
import plus.ruoyi.job.domain.JobLog;

import java.io.PrintWriter;
import java.io.Serial;
import java.io.Serializable;
import java.io.StringWriter;
import java.util.Date;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.RejectedExecutionException;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * 任务分发与执行。
 * <ul>
 *     <li>集群模式：抢到触发锁的节点在本地执行；</li>
 *     <li>广播模式：通过 Redis pub/sub 通知所有节点（含自己）各执行一次。</li>
 * </ul>
 * 执行日志记录、失败重试均在此完成；业务执行走独立线程池，不阻塞调度扫描线程。
 * <p>
 * 并发控制：{@code job_info.concurrent} 为 '0'（禁止，默认）时，执行前须抢到 Redis 上的
 * 「执行中」锁 {@code job:running:{任务ID}}（广播模式再拼节点标识以按节点隔离），
 * 抢不到说明上一轮未结束，跳过本次并留一条跳过日志。锁由 Redisson 看门狗自动续期，
 * 业务跑多久持有多久；节点崩溃时看门狗随进程消失，锁自动释放，不会永久卡死。
 * <p>
 * <b>平台级上下文约定（重要）</b>：引擎线程（业务执行池 / Redisson 消息分发 / 看门狗）都没有登录态，
 * 各层数据过滤器在这种线程里都会「静默出错」而非报错。因此本类对 {@code job_info} / {@code job_log}
 * 的所有读写一律通过 {@link JobPlatformContext} 包裹，具体绕开哪些过滤器、为何必须绕开见该类。
 * <p>
 * 但这层保护<b>仅覆盖引擎自身</b>——业务执行器（{@code @JobHandler} 方法）运行在无上下文的池线程内，
 * 其中的业务查询同样没有登录态，需要按上下文过滤数据的执行器必须自行处理，
 * 注意事项见 {@link JobPlatformContext}。
 *
 * @author 抓蛙师
 */
@Slf4j
public class JobInvoker {

    /**
     * 异常堆栈最大保存长度（job_log.exception_info 为 TEXT/CLOB）
     */
    private static final int MAX_EXCEPTION_LEN = 4000;

    /**
     * 日志信息最大保存长度（job_log.job_message 列为 VARCHAR(500)，留出余量）
     */
    private static final int MAX_MESSAGE_LEN = 480;

    /**
     * 路由策略：广播（所有节点各执行一次）
     */
    private static final String ROUTE_BROADCAST = "2";

    /**
     * 是否允许并发：允许
     */
    private static final String CONCURRENT_ALLOW = "1";

    @Resource
    private IJobInfoDao jobInfoDao;
    @Resource
    private IJobLogDao jobLogDao;
    @Resource
    private JobHandlerRegistry registry;
    @Resource
    private JobProperties jobProperties;

    private ThreadPoolExecutor bizPool;
    private ScheduledExecutorService retryPool;
    private ScheduledExecutorService timeoutPool;
    private String nodeId;

    @PostConstruct
    public void init() {
        this.nodeId = NodeIdUtils.current();
        int core = jobProperties.getPoolSize();
        // 队列容量取 core * 4：LinkedBlockingQueue 满了才会扩容线程，队列过大会让 maximumPoolSize 永远不可达。
        // 拒绝策略必须是 AbortPolicy —— 绝不能用 CallerRunsPolicy：调用方分别是调度扫描线程（单线程）、
        // Redisson 消息分发线程、重试线程和 Tomcat 请求线程，让它们代跑业务会造成调度停摆、
        // 拖垮全应用的 Redis 订阅、或阻塞 HTTP 请求。被拒绝的触发由 execute() 捕获并记跳过日志。
        this.bizPool = new ThreadPoolExecutor(
            core, core * 2, 60, TimeUnit.SECONDS,
            new LinkedBlockingQueue<>(core * 4),
            new NamedThreadFactory("job-biz-exec"),
            new ThreadPoolExecutor.AbortPolicy());
        this.retryPool = Executors.newScheduledThreadPool(2, new NamedThreadFactory("job-retry"));
        // 超时看门狗：任务只做「置标志 + 中断业务线程」，耗时微秒级，单线程足够；
        // 独立于 bizPool，确保业务线程被占满时看门狗仍能准时触发
        ScheduledThreadPoolExecutor watchdogPool =
            new ScheduledThreadPoolExecutor(1, new NamedThreadFactory("job-timeout-watchdog"));
        // 任务正常完成时会 cancel 看门狗，默认策略下被取消的任务要等到原定触发时刻才出队，
        // 期间一直强引用 Thread 与 JobContext。长超时任务高频执行时会持续堆积，故开启即时移除。
        watchdogPool.setRemoveOnCancelPolicy(true);
        this.timeoutPool = watchdogPool;
        // 订阅广播频道：广播任务由所有节点各执行一次。
        // 回调运行在 Redisson 的消息分发线程上，此处绝不能做阻塞 IO —— 数据库慢查询会拖住该线程，
        // 进而影响整个应用的 Redis 订阅（含框架其它订阅通道）。因此立即切到业务线程池，
        // 查任务与执行都在池内完成，回调本身只做一次入队。
        RedisUtils.subscribe(JobConstants.BROADCAST_CHANNEL, BroadcastMsg.class, msg -> {
            try {
                bizPool.execute(() -> {
                    JobInfo job = JobPlatformContext.call(() -> jobInfoDao.getById(msg.getJobId()));
                    if (job == null) {
                        log.warn("[job] 广播消息对应的任务不存在或已删除, jobId={}", msg.getJobId());
                        return;
                    }
                    safeExecute(job, msg.getTriggerTime(), 0);
                });
            } catch (Exception e) {
                // 线程池饱和或已关停：只记日志，绝不让异常抛回 Redisson 的消息分发线程
                log.error("[job] 广播任务入队失败, jobId={}", msg.getJobId(), e);
            }
        });
        log.info("[job] 执行器已就绪，节点标识 {}", nodeId);
    }

    /**
     * 分发（由调度器在抢到触发锁后调用）。
     *
     * @param job         任务
     * @param triggerTime 本次触发时刻
     */
    public void dispatch(JobInfo job, long triggerTime) {
        if (ROUTE_BROADCAST.equals(job.getRouteStrategy())) {
            // 广播：发消息，所有节点通过订阅各执行一次
            RedisUtils.publish(JobConstants.BROADCAST_CHANNEL, new BroadcastMsg(job.getId(), triggerTime));
        } else {
            // 集群：抢到锁的本节点直接执行
            execute(job, triggerTime, 0);
        }
    }

    /**
     * 手动触发（管理端「执行一次」调用）：当前节点立即执行一次，忽略路由策略。
     *
     * @param job 任务
     */
    public void trigger(JobInfo job) {
        execute(job, System.currentTimeMillis(), 0);
    }

    /**
     * 提交执行：切到业务线程池，不阻塞调用方（调度扫描线程 / Redis 订阅线程 / HTTP 请求线程）。
     * <p>
     * 线程池饱和时会被 {@code AbortPolicy} 拒绝，这里捕获后记一条跳过日志再丢弃本次触发——
     * 宁可明确丢弃并留痕，也不能回压到调用线程去代跑业务。
     */
    private void execute(JobInfo job, long triggerTime, int retryCount) {
        try {
            bizPool.execute(() -> safeExecute(job, triggerTime, retryCount));
        } catch (RejectedExecutionException e) {
            log.error("[job] 业务线程池已饱和，丢弃任务[{}]本次触发（队列 {}，活跃线程 {}）",
                job.getJobName(), bizPool.getQueue().size(), bizPool.getActiveCount());
            recordSkipped(job, retryCount, "业务线程池已饱和，本次触发被丢弃，请调大 ruoyi.job.pool-size 或排查任务执行耗时");
        }
    }

    /**
     * 执行入口包装：拦截 {@link #doExecute} 逃逸的异常并落日志。
     * <p>
     * 线程池对任务抛出的异常默认不打任何业务日志（线程直接死亡后被替换），
     * 不兜住的话「日志入库失败」这类问题会完全静默。Error 不拦截，仍交由线程池与监控处理。
     */
    private void safeExecute(JobInfo job, long triggerTime, int retryCount) {
        try {
            doExecute(job, triggerTime, retryCount);
        } catch (Exception e) {
            log.error("[job] 任务[{}]执行过程发生未预期异常", job.getJobName(), e);
        }
    }

    /**
     * 实际执行（同步，运行在业务线程池线程内），含并发控制、日志记录与失败重试。
     */
    private void doExecute(JobInfo job, long triggerTime, int retryCount) {
        // 入口清除中断标志：超时看门狗的中断信号有极小概率在上一个任务清理之后才落到线程上，
        // 池化线程会被复用，这里兜底一次可确保本次执行不被上一任务的残留中断误伤
        Thread.interrupted();

        // 禁止并发时先抢「执行中」锁：抢不到说明上一轮尚未结束，记录跳过日志后直接返回
        RLock runningLock = null;
        if (!isConcurrentAllowed(job)) {
            runningLock = tryAcquireRunningLock(job);
            if (runningLock == null) {
                log.warn("[job] 任务[{}]上一轮尚未结束，按「禁止并发」跳过本次触发", job.getJobName());
                recordSkipped(job, retryCount, "上一轮执行尚未结束，已按「禁止并发」跳过本次");
                return;
            }
        }

        boolean failed = false;
        // 锁一旦抢到，后续无论发生什么（含日志入库失败、Error 抛出）都必须保证释放，
        // 否则该任务会被自己的并发控制挡住，直到看门狗因进程消失而停止续期。
        try {
            JobLog jobLog = buildRunningLog(job, retryCount);
            JobPlatformContext.call(() -> jobLogDao.insert(jobLog));

            long start = System.currentTimeMillis();
            try {
                JobHandlerRegistry.JobHandlerHolder holder = registry.get(job.getInvokeTarget());
                if (holder == null) {
                    throw new IllegalStateException("未找到执行器: " + job.getInvokeTarget());
                }
                invoke(holder, buildContext(job, triggerTime, retryCount), job.getTimeout());
                jobLog.setStatus("1");
                jobLog.setJobMessage("执行成功");
            } catch (Throwable e) {
                Throwable cause = e.getCause() != null ? e.getCause() : e;
                jobLog.setStatus("0");
                // 必须截断：job_message 列仅 500 字符，而 MyBatis / JDBC 异常的 message 会把
                // 完整 SQL、参数、映射语句 ID 全带上，动辄数 KB，超长会让下面的 UPDATE 直接失败
                jobLog.setJobMessage(truncate("执行失败: " + cause.getMessage(), MAX_MESSAGE_LEN));
                jobLog.setExceptionInfo(truncate(throwableToString(cause), MAX_EXCEPTION_LEN));
                log.error("[job] 任务[{}]执行失败, retry={}", job.getJobName(), retryCount, cause);

                // Error（OOM / StackOverflowError 等）属于 JVM 级故障，重试只会加剧恶化：
                // 日志照常落库保证可观测，随后原样抛出交给线程池与监控体系处理，不纳入重试链路。
                Error jvmError = toJvmError(e, cause);
                if (jvmError != null) {
                    throw jvmError;
                }
                failed = true;
            } finally {
                jobLog.setStopTime(new Date());
                jobLog.setCostTime(System.currentTimeMillis() - start);
                saveLogQuietly(jobLog);
            }
        } finally {
            releaseRunningLock(job, runningLock);
        }

        // 重试必须排在「执行中」标记释放之后：否则 retryInterval 配得很小时，重试会抢不到标记，
        // 被自己的并发控制当成「上一轮未结束」而静默跳过，表现为一条跳过日志而非重试。
        if (failed) {
            scheduleRetryIfNeeded(job, triggerTime, retryCount);
        }
    }

    /**
     * 从异常链中提取 JVM 级 Error。
     * <p>
     * 反射调用会把业务抛出的任何 Throwable 包进 InvocationTargetException，故需同时检查原始异常与其 cause。
     *
     * @param origin 捕获到的原始异常
     * @param cause  已解包一层的根因
     * @return Error 实例，非 JVM 级故障返回 null
     */
    private Error toJvmError(Throwable origin, Throwable cause) {
        if (origin instanceof Error error) {
            return error;
        }
        if (cause instanceof Error error) {
            return error;
        }
        return null;
    }

    /**
     * 任务当前是否正在执行（仅对「禁止并发」的任务有意义）。
     * <p>
     * 供管理端「执行一次」做前置校验，以便同步给出明确提示，而不是先提示已触发、随后才落一条跳过日志。
     * 这里是尽力而为的探测：真正的互斥仍以执行时抢占标记为准。
     *
     * @param job 任务
     * @return true 表示上一轮尚未结束且该任务禁止并发
     */
    public boolean isRunning(JobInfo job) {
        return !isConcurrentAllowed(job) && RedisUtils.getLock(buildRunningKey(job)).isLocked();
    }

    /**
     * 是否允许并发执行。
     * <p>
     * 未配置（null）时按表默认值 '0' 处理，即**禁止**并发，取保守策略避免任务堆叠。
     *
     * @param job 任务
     * @return true 允许并发
     */
    private boolean isConcurrentAllowed(JobInfo job) {
        return CONCURRENT_ALLOW.equals(job.getConcurrent());
    }

    /**
     * 构建「执行中」标记 key。
     * <p>
     * 广播模式下每个节点都要各执行一次，并发控制必须**按节点隔离**，否则全局键会让只有一个节点跑起来，
     * 破坏广播语义；集群模式本就只有一个节点执行，用全局键即可跨节点互斥。
     *
     * @param job 任务
     * @return 标记 key
     */
    private String buildRunningKey(JobInfo job) {
        return ROUTE_BROADCAST.equals(job.getRouteStrategy())
            ? JobConstants.RUNNING_KEY_PREFIX + job.getId() + ":" + nodeId
            : JobConstants.RUNNING_KEY_PREFIX + job.getId();
    }

    /**
     * 抢占「执行中」锁。
     * <p>
     * 用 Redisson 可重入锁而非「setIfAbsent + 固定 TTL」，是为了同时拿到两个关键性质：
     * <ol>
     *   <li><b>自动续期</b>：leaseTime 传 -1 启用看门狗，业务跑多久锁就持有多久。
     *       固定 TTL 方案下，任务执行时间一旦超过 TTL，标记提前失效，
     *       下一次触发就会在「禁止并发」的任务上真的跑起第二个实例。</li>
     *   <li><b>持有者校验</b>：unlock 只释放自己持有的锁。固定 TTL 方案用的是无条件 delete，
     *       实例 A 超时后实例 B 抢到标记，A 结束时会把 B 的标记删掉，
     *       于是第三个实例又能进来——并发度随时间发散。</li>
     * </ol>
     * 节点崩溃时看门狗随进程消失，锁在看门狗超时后自动释放，不会永久卡死。
     * <p>
     * waitTime 传 0：抢不到立刻返回，语义是「本次跳过」，绝不能排队等待——
     * 等待会占住 bizPool 线程，任务堆积时线程池会被一批等锁的触发占满。
     *
     * @param job 任务
     * @return 抢到返回锁对象，抢不到返回 null
     */
    private RLock tryAcquireRunningLock(JobInfo job) {
        RLock lock = RedisUtils.getLock(buildRunningKey(job));
        try {
            return lock.tryLock(0, -1, TimeUnit.SECONDS) ? lock : null;
        } catch (InterruptedException e) {
            // 抢锁期间被中断（应用关停）：恢复中断标志并按「未抢到」处理，不继续执行业务
            Thread.currentThread().interrupt();
            log.warn("[job] 任务[{}]抢占执行中标记时被中断，跳过本次触发", job.getJobName());
            return null;
        }
    }

    /**
     * 释放「执行中」锁。
     *
     * @param job  任务，仅用于日志定位
     * @param lock 锁对象，为 null 表示本次未启用并发控制
     */
    private void releaseRunningLock(JobInfo job, RLock lock) {
        if (lock == null) {
            return;
        }
        try {
            // 必须先判断持有者：若看门狗续期失败（如 Redis 长时间不可用）锁已被动释放，
            // 直接 unlock 会抛 IllegalMonitorStateException，污染 finally 之后的流程
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
            } else {
                log.warn("[job] 任务[{}]的执行中标记已提前失效（疑似续期中断），本次无需释放", job.getJobName());
            }
        } catch (Exception e) {
            log.error("[job] 释放任务[{}]的执行中标记失败", job.getJobName(), e);
        }
    }

    /**
     * 记录一条「跳过执行」日志，让未执行的原因在管理端可见（禁止并发、错过执行等场景）。
     *
     * @param job        任务
     * @param retryCount 当前重试次数
     * @param reason     跳过原因，直接展示给使用者
     */
    public void recordSkipped(JobInfo job, int retryCount, String reason) {
        JobLog jobLog = buildRunningLog(job, retryCount);
        jobLog.setStatus("0");
        jobLog.setJobMessage(truncate(reason, MAX_MESSAGE_LEN));
        jobLog.setStopTime(new Date());
        jobLog.setCostTime(0L);
        try {
            JobPlatformContext.call(() -> jobLogDao.insert(jobLog));
        } catch (Exception e) {
            // 跳过日志属于旁路记录，写失败不应影响调用方（调度线程 / 执行线程）的主流程
            log.error("[job] 记录任务[{}]跳过日志失败", job.getJobName(), e);
        }
    }

    /**
     * 失败重试：本地延迟调度（MVP）。节点宕机则该次重试丢失，属可接受权衡。
     */
    private void scheduleRetryIfNeeded(JobInfo job, long triggerTime, int retryCount) {
        int max = job.getMaxRetry() == null ? 0 : job.getMaxRetry();
        if (retryCount >= max) {
            return;
        }
        int interval = job.getRetryInterval() == null ? 10 : job.getRetryInterval();
        retryPool.schedule(() -> execute(job, triggerTime, retryCount + 1), interval, TimeUnit.SECONDS);
    }

    private JobLog buildRunningLog(JobInfo job, int retryCount) {
        JobLog jobLog = new JobLog();
        jobLog.setJobId(job.getId());
        jobLog.setJobName(job.getJobName());
        jobLog.setJobGroup(job.getJobGroup());
        jobLog.setInvokeTarget(job.getInvokeTarget());
        jobLog.setJobParams(job.getJobParams());
        jobLog.setStatus("2"); // 执行中
        jobLog.setExecuteNode(nodeId);
        jobLog.setRetryCount(retryCount);
        jobLog.setStartTime(new Date());
        return jobLog;
    }

    private JobContext buildContext(JobInfo job, long triggerTime, int retryCount) {
        JobContext ctx = new JobContext();
        ctx.setJobId(job.getId());
        ctx.setJobName(job.getJobName());
        ctx.setJobParams(job.getJobParams());
        ctx.setExecuteNode(nodeId);
        ctx.setRetryCount(retryCount);
        ctx.setTriggerTime(triggerTime);
        return ctx;
    }

    /**
     * 反射调用执行器，兼容无参与带 JobContext 两种签名，支持超时保护。
     * <p>
     * 超时采用「看门狗中断当前线程」而非「另起线程 + Future.get 等待」：
     * <ul>
     *     <li>业务始终在当前 bizPool 线程执行，一个任务只占一个线程。旧实现向 bizPool 嵌套提交，
     *     每个带超时的任务要占两个线程（一个阻塞等待、一个真正干活），并发量达到线程池上限时
     *     外层全部阻塞、内层排队无线程可用，会集体卡到超时才恢复，造成大面积伪超时失败。</li>
     *     <li>超时后只发出中断信号（与 {@code Future.cancel(true)} 语义一致，Java 无法强杀线程）。
     *     若业务不响应中断，本方法会继续等它跑完 —— 这样「执行中」日志与「禁止并发」标记都如实保持，
     *     不会像旧实现那样在业务仍在运行时就提前释放标记，导致同一任务出现真并发。</li>
     * </ul>
     *
     * @param holder  执行器句柄
     * @param ctx     执行上下文
     * @param timeout 超时秒数，null 或 <=0 表示不限制
     * @throws Exception 业务异常，或超时导致的失败
     */
    private void invoke(JobHandlerRegistry.JobHandlerHolder holder, JobContext ctx, Integer timeout) throws Exception {
        Object[] args = holder.parameterCount() == 0 ? new Object[0] : new Object[]{ctx};
        if (timeout == null || timeout <= 0) {
            holder.method().invoke(holder.bean(), args);
            return;
        }

        Thread worker = Thread.currentThread();
        AtomicBoolean timedOut = new AtomicBoolean(false);
        ScheduledFuture<?> watchdog = timeoutPool.schedule(() -> {
            timedOut.set(true);
            worker.interrupt();
            log.warn("[job] 任务[{}]执行超过 {}s，已发出中断信号", ctx.getJobName(), timeout);
        }, timeout, TimeUnit.SECONDS);

        try {
            holder.method().invoke(holder.bean(), args);
        } catch (Exception e) {
            // 由超时中断引发的异常统一归因为超时，避免暴露 InterruptedException 这类不直观的信息
            throw timedOut.get() ? new RuntimeException("任务执行超时(" + timeout + "s)", e) : e;
        } finally {
            watchdog.cancel(false);
            // 读取并清除中断标志，避免污染线程池中后续复用该线程的任务
            boolean interrupted = Thread.interrupted();
            if (interrupted && !timedOut.get()) {
                // 中断另有来源（如应用关闭），恢复标志位交由线程池处理
                worker.interrupt();
            }
        }
        // 业务未响应中断但最终自行跑完：已超出约定耗时，仍按超时失败处理，让重试与告警链路生效
        if (timedOut.get()) {
            throw new RuntimeException("任务执行超时(" + timeout + "s)，业务未响应中断但已执行完毕");
        }
    }

    /**
     * 按列长度截断字符串，避免超长值导致 INSERT/UPDATE 失败。
     *
     * @param str    原始字符串
     * @param maxLen 最大长度
     * @return 截断后的字符串
     */
    private String truncate(String str, int maxLen) {
        if (str == null) {
            return null;
        }
        return str.length() > maxLen ? str.substring(0, maxLen) : str;
    }

    /**
     * 写入执行日志，失败只记录不抛出。
     * <p>
     * 日志入库属于旁路操作，不能让它的失败阻断后续的并发标记释放——
     * 否则任务会被自己的并发控制挡住直到标记 TTL 到期。
     *
     * @param jobLog 日志对象
     */
    private void saveLogQuietly(JobLog jobLog) {
        try {
            JobPlatformContext.call(() -> jobLogDao.updateById(jobLog));
        } catch (Exception e) {
            log.error("[job] 更新任务[{}]执行日志失败，日志可能停留在「执行中」状态", jobLog.getJobName(), e);
        }
    }

    private String throwableToString(Throwable e) {
        StringWriter sw = new StringWriter();
        e.printStackTrace(new PrintWriter(sw));
        return sw.toString();
    }

    /**
     * 优雅关停。
     * <p>
     * 关停顺序有讲究：先停掉「会产生新执行」的两个定时器（重试、看门狗），再等业务池收尾。
     * 反过来的话，等待期间重试定时器还会继续往业务池投递新任务，永远等不干净。
     * <p>
     * 业务池必须 {@code shutdown()} 而非 {@code shutdownNow()}：正在跑的业务需要机会执行完。
     * 直接强杀会让多步骤任务（如发货→扣库存→发通知）停在中间且无任何补偿，
     * 同时这次触发的 {@code next_execute_time} 早在分发前就已推进，重启后也不会重跑。
     */
    @PreDestroy
    public void stop() {
        // 重试与看门狗都只是定时器，其中排队的是「未来才执行」的任务，直接丢弃即可：
        // 未发生的重试会在任务下次触发时重新走一遍，不丢业务
        shutdownNowQuietly(retryPool);
        shutdownNowQuietly(timeoutPool);

        if (bizPool == null) {
            return;
        }
        bizPool.shutdown();
        long graceMs = jobProperties.getShutdownTimeout().toMillis();
        try {
            if (bizPool.awaitTermination(graceMs, TimeUnit.MILLISECONDS)) {
                log.info("[job] 执行器已优雅关停，在途任务全部执行完毕");
                return;
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.warn("[job] 等待在途任务结束时被中断，转为强制关停");
        }
        // 宽限期内没跑完：强制中断，并把本节点残留的「执行中」日志收敛掉，
        // 否则管理端会永远看到一批分不清死活的执行中记录
        List<Runnable> dropped = bizPool.shutdownNow();
        log.warn("[job] 执行器关停超时（宽限 {}ms），已强制中断在途任务，丢弃排队中的触发 {} 个", graceMs, dropped.size());
        markRunningLogsInterrupted();
    }

    /**
     * 关停定时器线程池，异常只记录不外抛（关停流程不允许因单个池失败而中断）。
     *
     * @param pool 线程池，允许为 null
     */
    private void shutdownNowQuietly(ScheduledExecutorService pool) {
        if (pool == null) {
            return;
        }
        try {
            pool.shutdownNow();
        } catch (Exception e) {
            log.error("[job] 关停定时线程池失败", e);
        }
    }

    /**
     * 把本节点残留的「执行中」日志标记为「已中断」。
     * <p>
     * 只处理本节点（{@code execute_node = nodeId}）的记录：集群里其它节点的执行中任务
     * 可能真的还在跑，误改会掩盖真实状态。
     */
    private void markRunningLogsInterrupted() {
        try {
            int rows = JobPlatformContext.call(() -> jobLogDao.markInterruptedByNode(nodeId));
            if (rows > 0) {
                log.warn("[job] 已将本节点 {} 条未完成的执行日志标记为「已中断」", rows);
            }
        } catch (Exception e) {
            // 关停阶段数据源可能已先行销毁，失败属预期内，记录即可
            log.error("[job] 收敛未完成执行日志失败，管理端可能残留「执行中」记录", e);
        }
    }

    /**
     * 统一的线程工厂：全部创建守护线程并带自增序号。
     * <p>
     * 守护线程是必须的——{@code new Thread()} 的 daemon 属性继承自创建它的线程，
     * 而池化线程是首次提交任务时惰性创建的，谁先提交谁决定属性（可能是 Tomcat 或 Redisson 线程）。
     * 不显式设置会导致同一份代码在不同启动时序下行为不同，最坏情况是卡死的业务任务阻止 JVM 退出。
     * 序号则用于线程 dump 时区分同一池内的多个线程。
     */
    private static class NamedThreadFactory implements ThreadFactory {

        private final String prefix;
        private final AtomicInteger seq = new AtomicInteger(1);

        NamedThreadFactory(String prefix) {
            this.prefix = prefix;
        }

        @Override
        public Thread newThread(Runnable r) {
            Thread t = new Thread(r, prefix + "-" + seq.getAndIncrement());
            t.setDaemon(true);
            return t;
        }
    }

    /**
     * 广播消息体
     */
    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class BroadcastMsg implements Serializable {

        @Serial
        private static final long serialVersionUID = 1L;

        private Long jobId;
        private long triggerTime;
    }
}
