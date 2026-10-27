package plus.ruoyi.business.job.sample;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import plus.ruoyi.common.core.scheduler.JobContext;
import plus.ruoyi.common.core.scheduler.JobHandler;
import plus.ruoyi.common.tenant.helper.TenantHelper;
import plus.ruoyi.system.tenant.domain.bo.SysTenantBo;
import plus.ruoyi.system.tenant.domain.vo.SysTenantVo;
import plus.ruoyi.system.tenant.service.ISysTenantService;

import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

/**
 * 轻量调度器（ruoyi-job）示例执行器集合。
 * <p>
 * 与 {@code job/demo}（SnailJob 示例）刻意分开包名，避免两套调度器的示例混在一起造成误解。
 * 同时演示核心用法：业务模块只需依赖 common-core（无需依赖 ruoyi-job 模块本身）即可编写执行器。
 * 方法体仅打印日志/模拟逻辑，零副作用，可安全在生产环境运行。对应的示例任务（job_info.id 9001~9004）
 * 均以 {@code status='0'} 暂停状态入库，需在「调度任务」界面手动启用或点「执行一次」。
 *
 * @author 抓蛙师
 * @date 2026-07-24
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SampleJobHandler {

    /**
     * 租户状态：正常（1积极 0消极）
     */
    private static final String TENANT_STATUS_ENABLED = "1";

    /**
     * 跨 Maven 模块访问租户数据须走对方 Service 接口，不能直接注入 ISysTenantDao
     */
    private final ISysTenantService tenantService;

    /**
     * 演示：最简无参执行器，适合心跳/巡检类场景。
     */
    @JobHandler(value = "sampleHello", desc = "示例-最简任务", sampleCron = "0 * * * * ?")
    public void sampleHello() {
        log.info("[job-sample] 最简无参执行器已触发");
    }

    /**
     * 演示：jobParams 参数透传，同一执行器按不同参数复用（如指定同步的表名/批次大小）。
     *
     * @param ctx 执行上下文，jobParams 约定为 JSON 字符串，如 {"table":"sys_user","batch":500}
     */
    @JobHandler(value = "sampleSyncData", desc = "示例-参数透传", sampleCron = "0 0 2 * * ?")
    public void sampleSyncData(JobContext ctx) {
        log.info("[job-sample] 参数透传示例触发, jobParams={}", ctx.getJobParams());
    }

    /**
     * 演示：失败自动重试。约 50% 概率抛异常，配合 job_info.max_retry=3 观察重试行为。
     *
     * @param ctx 执行上下文，retryCount 为当前重试次数（0 表示首次执行）
     */
    @JobHandler(value = "sampleRetry", desc = "示例-失败重试", sampleCron = "0 0/10 * * * ?")
    public void sampleRetry(JobContext ctx) {
        if (ThreadLocalRandom.current().nextBoolean()) {
            throw new IllegalStateException("模拟执行失败，用于演示 max_retry 自动重试机制");
        }
        log.info("[job-sample] 失败重试示例执行成功, 当前重试次数={}", ctx.getRetryCount());
    }

    /**
     * 演示：广播模式（route_strategy=2），集群内每个节点各自触发一次，典型场景是刷新本地缓存。
     *
     * @param ctx 执行上下文，executeNode 标识本次执行的节点（IP:port）
     */
    @JobHandler(value = "sampleBroadcast", desc = "示例-广播刷缓存", sampleCron = "0 0/30 * * * ?")
    public void sampleBroadcast(JobContext ctx) {
        log.info("[job-sample] 广播模式示例触发, 执行节点={}, 模拟刷新本地缓存", ctx.getExecuteNode());
    }

    /**
     * 演示：<b>多租户遍历（多租户项目必读）</b>。
     * <p>
     * 执行器运行在调度线程池里，<b>没有登录态</b>。此时 {@code TenantHelper.getTenantId()}
     * 会静默返回默认租户 {@code 000000} 而不抛异常，于是直接写业务查询的后果是：
     * 任务日志显示「执行成功」，实际却只处理了默认租户的数据，其余租户永远不被处理，
     * 且没有任何告警——这是多租户项目里最难发现的一类故障。
     * <p>
     * 正确姿势分两步：
     * <ol>
     *   <li>用 {@code TenantHelper.ignore} 把租户列表捞全（查租户表本身不能带租户条件）；</li>
     *   <li>逐个用 {@code TenantHelper.dynamic} 切换上下文，在其中执行真正的业务逻辑。</li>
     * </ol>
     * 单个租户处理失败时要就地 catch，否则一个租户的异常会中断后面所有租户。
     *
     * @param ctx 执行上下文
     */
    @JobHandler(value = "sampleTenantLoop", desc = "示例-多租户遍历", sampleCron = "0 0 1 * * ?")
    public void sampleTenantLoop(JobContext ctx) {
        // ① 查全部启用中的租户：必须 ignore，否则只能查到当前上下文租户自己
        SysTenantBo query = new SysTenantBo();
        query.setStatus(TENANT_STATUS_ENABLED);
        List<SysTenantVo> tenants = TenantHelper.ignore(() -> tenantService.list(query));
        log.info("[job-sample] 多租户遍历示例触发, 待处理租户数={}, jobParams={}", tenants.size(), ctx.getJobParams());

        for (SysTenantVo tenant : tenants) {
            // ② 切到该租户上下文，块内的所有查询/写入都会自动带上它的 tenant_id
            TenantHelper.dynamic(tenant.getTenantId(), () -> {
                try {
                    // 这里写真实业务，例如：orderService.cancelTimeoutOrders();
                    log.info("[job-sample] 正在处理租户[{}]的数据", tenant.getTenantId());
                } catch (Exception e) {
                    // 单租户失败不能拖垮整轮：吞掉并继续下一个，避免前面几个租户处理了、后面全被跳过
                    log.error("[job-sample] 租户[{}]处理失败，跳过并继续", tenant.getTenantId(), e);
                }
            });
        }
    }
}
