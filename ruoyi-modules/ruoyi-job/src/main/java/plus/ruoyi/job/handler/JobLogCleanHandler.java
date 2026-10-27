package plus.ruoyi.job.handler;

import cn.hutool.core.date.DateUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import plus.ruoyi.common.core.scheduler.JobContext;
import plus.ruoyi.common.core.scheduler.JobHandler;
import plus.ruoyi.common.core.utils.StringUtils;
import plus.ruoyi.job.core.JobPlatformContext;
import plus.ruoyi.job.dao.IJobLogDao;

import java.util.Date;

/**
 * 内置执行器：清理过期调度日志。
 * <p>
 * job_log 表不做逻辑删除，靠本任务按 create_time 定期物理清理，避免日志无限增长。
 * 同时可作为 {@link JobHandler} 的用法样板：带 {@link JobContext} 签名 + 任务参数透传 + 元数据。
 * <p>
 * 使用方式：在「调度任务」界面新增任务，执行器选「清理过期调度日志(cleanJobLog)」，
 * 任务参数填保留天数（如 {@code 30}，留空默认 30 天），cron 建议 {@code 0 0 3 * * ?}。
 *
 * @author 抓蛙师
 * @date 2026-07-22
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JobLogCleanHandler {

    /**
     * 默认保留天数
     */
    private static final int DEFAULT_KEEP_DAYS = 30;

    private final IJobLogDao jobLogDao;

    /**
     * 清理过期调度日志。
     *
     * @param ctx 执行上下文，jobParams 为保留天数（纯数字字符串，非法或为空时用默认 30 天）
     */
    @JobHandler(value = "cleanJobLog", desc = "清理过期调度日志", sampleCron = "0 0 3 * * ?")
    public void cleanJobLog(JobContext ctx) {
        int keepDays = parseKeepDays(ctx.getJobParams());
        Date before = DateUtil.offsetDay(new Date(), -keepDays);
        // 本执行器运行在业务线程池里，同样没有登录态，因此与引擎一样要避开各层数据过滤：
        // 不加这层包裹，一旦下游给 job DAO 加了 @DataPermission，这里会变成「每次都清理 0 条」的静默失效。
        int rows = JobPlatformContext.call(() -> jobLogDao.deleteBefore(before));
        log.info("[job] 清理调度日志完成，保留 {} 天，删除 {} 条（{} 之前）", keepDays, rows, DateUtil.formatDateTime(before));
    }

    /**
     * 解析保留天数，非法输入回退为默认值，避免因参数写错导致任务失败。
     *
     * @param params 任务参数
     * @return 保留天数（至少 1 天）
     */
    private int parseKeepDays(String params) {
        if (StringUtils.isBlank(params)) {
            return DEFAULT_KEEP_DAYS;
        }
        try {
            int days = Integer.parseInt(params.trim());
            return days > 0 ? days : DEFAULT_KEEP_DAYS;
        } catch (NumberFormatException e) {
            log.warn("[job] 清理任务参数非法: {}，回退为默认 {} 天", params, DEFAULT_KEEP_DAYS);
            return DEFAULT_KEEP_DAYS;
        }
    }
}
