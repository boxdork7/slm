package plus.ruoyi.job.constant;

import plus.ruoyi.common.core.constant.GlobalConstants;

/**
 * 内置定时任务(ruoyi-job)常量。
 *
 * <p><b>本文件是 ruoyi-job 唯一的分支差异点</b>：三个键都带 {@link GlobalConstants#GLOBAL_REDIS_KEY}
 * 前缀，使其不参与租户隔离——调度是平台级能力，集群内各节点的调度线程都没有登录态，
 * 而 {@code TenantKeyPrefixHandler} 会按调用线程的租户上下文给键加前缀。少了这层前缀，
 * 引擎线程（无登录态）与管理端 HTTP 线程（有登录态）算出的键不同，会出现
 * 「各节点抢的不是同一把锁」「广播收发两端对不上」这类无错误日志的故障。</p>
 *
 * <p>单租户版本的同名文件不带该前缀（其 {@code KeyPrefixHandler} 只认配置的应用级前缀，
 * 不识别 {@code global:}）。<b>跨分支同步 ruoyi-job 时，整个模块只需比对本文件</b>——
 * 其余源码与 pom.xml 全分支逐字节一致，可整体复制。</p>
 *
 * @author 抓蛙师
 * @date 2026-08-10
 */
public interface JobConstants {

    // ========== Redis 键 ==========

    /**
     * 广播频道：广播模式下通知集群全部节点各执行一次
     */
    String BROADCAST_CHANNEL = GlobalConstants.GLOBAL_REDIS_KEY + "job:broadcast";

    /**
     * 触发锁 key 前缀，完整键为 {@code job:trigger:{任务ID}:{触发时刻}}。
     * <p>
     * 以「任务ID + 触发时刻」为幂等键，保证同一触发点集群内只有一个节点执行。
     */
    String TRIGGER_LOCK_PREFIX = GlobalConstants.GLOBAL_REDIS_KEY + "job:trigger:";

    /**
     * 「执行中」标记 key 前缀，完整键为 {@code job:running:{任务ID}}（广播模式再拼节点标识）。
     * <p>
     * 用于「禁止并发」，须保证引擎线程写入与管理端 HTTP 线程读取落在同一个键上。
     */
    String RUNNING_KEY_PREFIX = GlobalConstants.GLOBAL_REDIS_KEY + "job:running:";
}
