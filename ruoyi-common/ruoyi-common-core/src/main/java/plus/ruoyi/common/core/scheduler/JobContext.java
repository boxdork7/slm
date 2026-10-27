package plus.ruoyi.common.core.scheduler;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * 任务执行上下文，作为执行器方法（带参签名）的唯一入参。
 * <p>
 * 说明：本类放在 common-core（最底层，不依赖 JSON 模块），因此不内置 JSON 解析方法。
 * 若 {@link #jobParams} 存的是 JSON，业务侧用 {@code JsonUtils.parseObject(ctx.getJobParams(), Xxx.class)}
 * 一行解析即可（各业务模块均可依赖 ruoyi-common-json）。
 *
 * @author 抓蛙师
 */
@Data
public class JobContext implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 任务ID
     */
    private Long jobId;

    /**
     * 任务名称
     */
    private String jobName;

    /**
     * 任务参数（job_info.job_params 原样透传，可为纯文本或 JSON 字符串）
     */
    private String jobParams;

    /**
     * 本次执行节点标识 IP:port
     */
    private String executeNode;

    /**
     * 当前重试次数（0 表示首次执行）
     */
    private int retryCount;

    /**
     * 本次触发时刻（毫秒时间戳）。业务可用它作为幂等键，避免广播/重试导致的重复处理。
     */
    private long triggerTime;
}
