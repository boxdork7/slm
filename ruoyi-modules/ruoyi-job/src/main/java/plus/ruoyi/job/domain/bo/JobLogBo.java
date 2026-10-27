package plus.ruoyi.job.domain.bo;

import lombok.Data;
import lombok.EqualsAndHashCode;
import plus.ruoyi.common.mybatis.core.domain.BaseEntity;

/**
 * 定时任务执行日志业务对象 job_log（仅用于查询条件）
 *
 * @author 抓蛙师
 * @date 2026-07-22
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class JobLogBo extends BaseEntity {

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
     * 执行状态（0失败 1成功 2执行中）
     */
    private String status;

    /**
     * 执行节点
     */
    private String executeNode;
}
