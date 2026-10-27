package plus.ruoyi.job.core;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.support.CronExpression;
import plus.ruoyi.common.core.utils.StringUtils;

import java.time.DateTimeException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

/**
 * cron 表达式工具：校验、计算下次执行时间。
 * <p>
 * 抽出本类的目的有二：
 * <ol>
 *   <li>统一时区。调度引擎与管理端预览曾各自用 {@code ZoneId.systemDefault()} 算下次执行时间，
 *       换个部署方式就可能算出不同结果（见下方 {@link #ZONE} 的说明）。</li>
 *   <li>消除重复。原先 {@code JobScheduler} 与 {@code JobInfoServiceImpl} 各有一份几乎相同的
 *       cron 计算代码，改一处漏一处会导致「预览时间」与「实际执行时间」对不上。</li>
 * </ol>
 * 解析器为 Spring 的 {@link CronExpression}，<b>6 位含秒</b>（秒 分 时 日 月 周），
 * 不支持 Quartz 的 7 位（带年）与 {@code W} 字符；从 SnailJob/Quartz 迁移表达式时需注意。
 *
 * @author 抓蛙师
 */
@Slf4j
public final class CronUtils {

    /**
     * 覆盖调度时区的系统属性名，如 {@code -Druoyi.job.zone-id=UTC}
     */
    public static final String ZONE_PROPERTY = "ruoyi.job.zone-id";

    /**
     * 默认调度时区（东八区，与项目全局时区约定一致）
     */
    private static final String DEFAULT_ZONE = "Asia/Shanghai";

    /**
     * 调度时区。
     * <p>
     * <b>刻意不用 {@code ZoneId.systemDefault()}</b>：项目的 Dockerfile 与 {@code script/bin/ry.sh}
     * 确实设了 TZ，但只要换一种部署方式——k8s manifest 未写 TZ、裸 {@code java -jar}、CI 容器里跑集成测试——
     * JVM 就会退回 UTC。届时 {@code 0 0 3 * * ?} 会在北京时间 11 点触发，
     * <b>不报错、不告警，只是所有任务的执行时间集体偏移 8 小时</b>，属于极难察觉的故障。
     * <p>
     * 故此处显式固定，需要跨时区部署时用系统属性 {@link #ZONE_PROPERTY} 覆盖。
     */
    public static final ZoneId ZONE = resolveZone();

    private CronUtils() {
    }

    /**
     * 解析调度时区，配置非法时回退默认值而非启动失败。
     *
     * @return 时区
     */
    private static ZoneId resolveZone() {
        String configured = System.getProperty(ZONE_PROPERTY);
        if (StringUtils.isNotBlank(configured)) {
            try {
                return ZoneId.of(configured.trim());
            } catch (DateTimeException e) {
                // 时区 ID 写错不该让整个应用起不来，回退默认值并留下明确痕迹
                log.error("[job] 系统属性 {} 的值[{}]不是合法时区，已回退为 {}",
                    ZONE_PROPERTY, configured, DEFAULT_ZONE, e);
            }
        }
        return ZoneId.of(DEFAULT_ZONE);
    }

    /**
     * 校验 cron 表达式是否合法。
     *
     * @param cron cron 表达式（Spring 6 位格式）
     * @return true 表示合法
     */
    public static boolean isValid(String cron) {
        return StringUtils.isNotBlank(cron) && CronExpression.isValidExpression(cron);
    }

    /**
     * 以指定时刻为基准计算下次执行时间。
     *
     * @param cron cron 表达式
     * @param base 基准时刻
     * @return 下次执行时间；cron 之后不再有触发点时返回 null
     */
    public static Date next(String cron, Date base) {
        LocalDateTime baseTime = LocalDateTime.ofInstant(base.toInstant(), ZONE);
        LocalDateTime next = CronExpression.parse(cron).next(baseTime);
        return next == null ? null : Date.from(next.atZone(ZONE).toInstant());
    }

    /**
     * 以当前时刻为基准计算下次执行时间。
     *
     * @param cron cron 表达式
     * @return 下次执行时间；cron 之后不再有触发点时返回 null
     */
    public static Date next(String cron) {
        return next(cron, new Date());
    }

    /**
     * 当前时刻在调度时区下的本地时间，供连续推算多个触发点使用。
     *
     * @return 调度时区下的当前本地时间
     */
    public static LocalDateTime nowInZone() {
        return LocalDateTime.now(ZONE);
    }
}
