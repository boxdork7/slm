package plus.ruoyi.system.monitor.job;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import plus.ruoyi.system.monitor.service.ISysLogArchiveService;

/**
 * 审计日志归档定时任务
 * <p>
 * 等保二级 8.1.4.3 c：审计记录需定期备份、防止未预期删除，且留存不少于 6 个月。
 * 本任务每天把超过保留期（sys_config 的 system.log.retain-days，默认 180 天）的日志
 * 从主表搬到归档表 —— 主表只留热数据，历史数据在归档表仍可查阅。
 * <p>
 * <b>为什么用 Spring @Scheduled 而不是 SnailJob：</b>
 * 归档任务是幂等的（本次没搬完下次继续）、单机执行即可（多节点重复跑没有意义）、
 * 失败后下次自动补齐，用不上 SnailJob 的可视化调度 / 失败重试 / 分布式分片。
 * 为它引入 SnailJob 依赖会让框架核心功能挂上一个可选组件，且 SnailJob 客户端
 * 需常驻长连接与心跳，成本高于收益。
 * <p>
 * <b>🔴 为什么本类自带 @EnableScheduling：</b>
 * 框架的 {@code JobAutoConfiguration} 虽然标了 @EnableScheduling，但它整体挂在
 * {@code @ConditionalOnProperty(prefix = "snail-job", name = "enabled", havingValue = "true")} 下。
 * 也就是说 <b>snail-job.enabled=false（默认值）时，Spring 定时任务根本没被启用</b>，
 * 此时任何 @Scheduled 方法都会静默不执行 —— 不报错、不打日志，极难排查。
 * 因此这个注解不能删。
 * <p>
 * 归档的全部业务逻辑都在 {@link ISysLogArchiveService}，本类只是触发壳。
 *
 * @author 抓蛙师
 */
@Slf4j
@Component
@RequiredArgsConstructor
@EnableScheduling
public class LogArchiveScheduledJob {

    private final ISysLogArchiveService logArchiveService;

    /**
     * 每日凌晨 3 点执行审计日志归档
     * <p>
     * 选 3 点是因为此时业务低峰，且避开了多数系统在 0-2 点的备份窗口，
     * 不与数据库全量备份抢 IO。
     * <p>
     * 单次执行的开销很小：查询走 oper_time / login_time 索引，
     * 分批搬移（每批 1000 条）且限制最大轮数，不会长时间占用数据库连接。
     */
    @Scheduled(cron = "0 0 3 * * ?")
    public void archive() {
        log.info("[审计日志归档] 定时任务触发");
        try {
            int count = logArchiveService.archiveAll();
            log.info("[审计日志归档] 定时任务完成，共归档 {} 条", count);
        } catch (Exception e) {
            // 定时任务里必须吞掉异常：Spring 的 @Scheduled 遇到未捕获异常虽不会停掉后续调度，
            // 但异常栈会直接打到控制台且无上下文，这里补齐上下文便于排查
            log.error("[审计日志归档] 定时任务执行失败", e);
        }
    }
}
