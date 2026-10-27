package plus.ruoyi.job.domain.bo;

import io.github.linpeilie.annotations.AutoMapper;
import io.github.linpeilie.annotations.AutoMappers;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import plus.ruoyi.common.core.validate.AddGroup;
import plus.ruoyi.common.core.validate.EditGroup;
import plus.ruoyi.common.mybatis.core.domain.BaseEntity;
import plus.ruoyi.job.domain.JobInfo;
import plus.ruoyi.job.domain.vo.JobInfoVo;

/**
 * 定时任务业务对象 job_info
 *
 * @author 抓蛙师
 * @date 2026-07-22
 */
@Data
@EqualsAndHashCode(callSuper = true)
@AutoMappers({
    @AutoMapper(target = JobInfo.class, reverseConvertGenerate = false),
    @AutoMapper(target = JobInfoVo.class)
})
public class JobInfoBo extends BaseEntity {

    /**
     * 任务ID
     */
    @NotNull(message = "任务ID不能为空", groups = {EditGroup.class})
    private Long id;

    /**
     * 任务名称
     */
    @NotBlank(message = "任务名称不能为空", groups = {AddGroup.class, EditGroup.class})
    private String jobName;

    /**
     * 任务分组
     */
    private String jobGroup;

    /**
     * 执行器标识
     */
    @NotBlank(message = "执行器标识不能为空", groups = {AddGroup.class, EditGroup.class})
    private String invokeTarget;

    /**
     * 任务参数
     */
    private String jobParams;

    /**
     * cron 表达式
     */
    @NotBlank(message = "cron 表达式不能为空", groups = {AddGroup.class, EditGroup.class})
    private String cronExpression;

    /**
     * 路由策略（1集群 2广播）
     */
    private String routeStrategy;

    /**
     * 错过执行策略（1=立即补一次；其余值一律顺延到下个触发点——引擎只判断是否为 1，故「放弃本次」与「顺延」实际同义）
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
     * 执行超时（秒，0不限制）
     */
    private Integer timeout;

    /**
     * 是否允许并发执行（0禁止 1允许）
     */
    private String concurrent;

    /**
     * 任务状态（0暂停 1运行）
     */
    private String status;

    /**
     * 备注
     */
    private String remark;
}
