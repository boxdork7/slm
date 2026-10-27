package plus.ruoyi.job.domain.vo;

import io.github.linpeilie.annotations.AutoMapper;
import lombok.Data;
import plus.ruoyi.job.domain.JobLog;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;

/**
 * 定时任务执行日志视图对象 job_log
 *
 * @author 抓蛙师
 * @date 2026-07-22
 */
@Data
@AutoMapper(target = JobLog.class)
public class JobLogVo implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 日志ID
     */
    private Long id;

    /**
     * 任务ID
     */
    private Long jobId;

    /**
     * 任务名称
     */
    private String jobName;

    /**
     * 任务分组
     */
    private String jobGroup;

    /**
     * 执行器标识
     */
    private String invokeTarget;

    /**
     * 任务参数
     */
    private String jobParams;

    /**
     * 日志信息
     */
    private String jobMessage;

    /**
     * 执行状态（0失败 1成功 2执行中）
     */
    private String status;

    /**
     * 异常堆栈
     */
    private String exceptionInfo;

    /**
     * 执行节点（IP:port）
     */
    private String executeNode;

    /**
     * 当前重试次数
     */
    private Integer retryCount;

    /**
     * 开始时间
     */
    private Date startTime;

    /**
     * 结束时间
     */
    private Date stopTime;

    /**
     * 耗时（毫秒）
     */
    private Long costTime;

    /**
     * 创建时间
     */
    private Date createTime;
}
