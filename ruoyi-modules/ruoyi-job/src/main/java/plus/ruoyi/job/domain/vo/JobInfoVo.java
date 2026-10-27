package plus.ruoyi.job.domain.vo;

import io.github.linpeilie.annotations.AutoMapper;
import io.github.linpeilie.annotations.AutoMappers;
import lombok.Data;
import plus.ruoyi.job.domain.JobInfo;
import plus.ruoyi.job.domain.bo.JobInfoBo;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;

/**
 * 定时任务视图对象 job_info
 *
 * @author 抓蛙师
 * @date 2026-07-22
 */
@Data
@AutoMappers({
    @AutoMapper(target = JobInfo.class),
    @AutoMapper(target = JobInfoBo.class)
})
public class JobInfoVo implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 任务ID
     */
    private Long id;

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
     * cron 表达式
     */
    private String cronExpression;

    /**
     * 路由策略（1集群 2广播）
     */
    private String routeStrategy;

    /**
     * 错过执行策略
     */
    private String misfirePolicy;

    /**
     * 失败最大重试次数
     */
    private Integer maxRetry;

    /**
     * 重试间隔（秒）
     */
    private Integer retryInterval;

    /**
     * 执行超时（秒）
     */
    private Integer timeout;

    /**
     * 是否允许并发执行
     */
    private String concurrent;

    /**
     * 下次执行时间
     */
    private Date nextExecuteTime;

    /**
     * 任务状态（0暂停 1运行）
     */
    private String status;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;

    /**
     * 备注
     */
    private String remark;
}
