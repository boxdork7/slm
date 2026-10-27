package plus.ruoyi.job.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;

/**
 * 内置调度器配置。前缀 {@code ruoyi.job}。
 *
 * @author 抓蛙师
 */
@Data
@ConfigurationProperties(prefix = "ruoyi.job")
public class JobProperties {

    /**
     * 是否启用内置调度器（默认关闭，避免影响现有部署）
     */
    private boolean enabled = false;

    /**
     * 调度扫描间隔，默认 5 秒（到分钟级 cron 足够；秒级/延迟请走 Redisson 延迟队列）
     */
    private Duration scanInterval = Duration.ofSeconds(5);

    /**
     * 业务执行线程池核心线程数
     */
    private int poolSize = 10;

    /**
     * 「错过执行」判定阈值，默认 60 秒。
     * <p>
     * 实际触发比计划时间晚超过该值，才按 {@code job_info.misfire_policy} 处理；
     * 小于该值的延迟属于扫描间隔造成的正常抖动，照常执行。
     * 若设得比 {@link #scanInterval} 还小，会把每次正常触发都误判为错过。
     */
    private Duration misfireThreshold = Duration.ofSeconds(60);

    /**
     * 应用关停时，等待正在执行的任务跑完的宽限期，默认 30 秒。
     * <p>
     * 直接强杀线程会让多步骤任务停在半截且无补偿，同时留下永远处于「执行中」的日志。
     * 这里先停止接收新触发，再给在途任务这段时间收尾；超时仍未结束的才强制中断，
     * 并把对应日志标记为「已中断」，保证管理端能看出这次执行没跑完。
     * <p>
     * 取值需权衡：过短起不到保护作用，过长会拖慢发版（容器编排的停机超时通常在 30~60s）。
     */
    private Duration shutdownTimeout = Duration.ofSeconds(30);

}
