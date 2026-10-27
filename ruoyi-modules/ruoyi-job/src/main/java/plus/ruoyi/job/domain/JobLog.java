package plus.ruoyi.job.domain;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import plus.ruoyi.common.mybatis.core.domain.BaseEntity;

import java.io.Serial;
import java.util.Date;

/**
 * 定时任务执行日志对象 job_log
 * <p>
 * 与 {@link JobInfo} 一致，定时任务为平台级能力，继承 {@link BaseEntity}。
 * 日志不做逻辑删除，按 create_time 定期物理清理（见内置执行器 cleanJobLog）。
 *
 * @author 抓蛙师
 * @date 2026-07-22
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("job_log")
public class JobLog extends BaseEntity {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 日志ID
     */
    @TableId(value = "id")
    private Long id;

    /**
     * 任务ID
     */
    private Long jobId;

    /**
     * 任务名称（冗余）
     */
    private String jobName;

    /**
     * 任务分组（冗余）
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
}
