package plus.ruoyi.job.domain;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import plus.ruoyi.common.mybatis.core.domain.BaseEntity;

import java.io.Serial;
import java.util.Date;

/**
 * 定时任务对象 job_info
 * <p>
 * 定时任务定位为**平台级**能力，由平台运维统一管理，故继承 {@link BaseEntity}：
 * <ul>
 *     <li>执行器是随应用部署的 Java 代码（{@code @JobHandler}），使用者无法自行新增，
 *     所谓"配置任务"只是挑选平台预置的执行器；</li>
 *     <li>执行器运行在引擎线程上，没有登录态上下文；</li>
 *     <li>引擎自身对本表的读写统一经 {@code JobPlatformContext} 绕开数据过滤，
 *     保证能看到并推进全部任务——绕开哪些过滤器、本表在各拦截器中如何登记，见该类。</li>
 * </ul>
 *
 * @author 抓蛙师
 * @date 2026-07-22
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("job_info")
public class JobInfo extends BaseEntity {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 任务ID
     */
    @TableId(value = "id")
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
     * 执行器标识（对应 @JobHandler 的 value）
     */
    private String invokeTarget;

    /**
     * 任务参数（透传给执行器）
     */
    private String jobParams;

    /**
     * cron 表达式（Spring 6 位：秒 分 时 日 月 周）
     */
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
     * 失败最大重试次数（0不重试）
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
     * 下次执行时间（引擎维护）
     */
    private Date nextExecuteTime;

    /**
     * 任务状态（0暂停 1运行）
     */
    private String status;

    /**
     * 备注
     */
    private String remark;

    /**
     * 是否删除（0正常 1已删除）
     */
    @TableLogic
    private String isDeleted;
}
