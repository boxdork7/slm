package plus.ruoyi.job.service.impl;

import cn.hutool.core.collection.CollUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.scheduling.support.CronExpression;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import plus.ruoyi.common.core.exception.ServiceException;
import plus.ruoyi.common.core.utils.MapstructUtils;
import plus.ruoyi.common.mybatis.core.page.PageQuery;
import plus.ruoyi.common.mybatis.core.page.PageResult;
import plus.ruoyi.common.mybatis.core.query.PlusLambdaQuery;
import plus.ruoyi.job.core.JobHandlerRegistry;
import plus.ruoyi.job.core.JobInvoker;
import plus.ruoyi.job.dao.IJobInfoDao;
import plus.ruoyi.job.domain.JobInfo;
import plus.ruoyi.job.domain.bo.JobInfoBo;
import plus.ruoyi.job.domain.vo.JobInfoVo;
import plus.ruoyi.common.core.utils.StreamUtils;
import plus.ruoyi.job.core.CronUtils;
import plus.ruoyi.job.domain.vo.JobHandlerVo;
import plus.ruoyi.job.service.IJobInfoService;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.List;

/**
 * 定时任务服务实现。
 * <p>
 * 引擎 Bean（{@link JobInvoker}/{@link JobHandlerRegistry}）仅在 {@code ruoyi.job.enabled=true}
 * 时装配，故此处用 {@link ObjectProvider} 延迟注入：未启用时 Service 仍可实例化，
 * 仅「手动执行 / 执行器下拉」等依赖引擎的功能给出友好提示。
 *
 * @author 抓蛙师
 * @date 2026-07-22
 */
@Service
@RequiredArgsConstructor
public class JobInfoServiceImpl implements IJobInfoService {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * 任务状态：运行中（与 job_info.status 及字典 sys_enable_status 一致）
     */
    private static final String STATUS_RUNNING = "1";

    /**
     * 任务状态：暂停
     */
    private static final String STATUS_PAUSED = "0";

    private final IJobInfoDao jobInfoDao;
    private final ObjectProvider<JobInvoker> jobInvokerProvider;
    private final ObjectProvider<JobHandlerRegistry> registryProvider;

    @Override
    public JobInfoVo get(Long id) {
        JobInfo entity = jobInfoDao.getById(id);
        return MapstructUtils.convert(entity, JobInfoVo.class);
    }

    @Override
    public PageResult<JobInfoVo> page(JobInfoBo bo, PageQuery pageQuery) {
        PlusLambdaQuery<JobInfo> wrapper = jobInfoDao.buildQueryWrapper(bo);
        PageResult<JobInfo> entityPage = jobInfoDao.page(wrapper, pageQuery);
        return entityPage.convert(JobInfoVo.class);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long add(JobInfoBo bo) {
        validateCron(bo.getCronExpression());
        JobInfo entity = MapstructUtils.convert(bo, JobInfo.class);
        // 新增若直接启用，需初始化下次执行时间
        if (STATUS_RUNNING.equals(entity.getStatus())) {
            entity.setNextExecuteTime(calcNext(entity.getCronExpression()));
        }
        jobInfoDao.insert(entity);
        return entity.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int update(JobInfoBo bo) {
        if (bo.getId() == null) {
            throw ServiceException.of("任务ID不能为空");
        }
        if (!jobInfoDao.exists(bo.getId())) {
            throw ServiceException.of("任务不存在");
        }
        validateCron(bo.getCronExpression());
        JobInfo entity = MapstructUtils.convert(bo, JobInfo.class);
        // 运行中任务修改后重算下次执行时间；暂停任务清空
        entity.setNextExecuteTime(STATUS_RUNNING.equals(entity.getStatus()) ? calcNext(entity.getCronExpression()) : null);
        return jobInfoDao.updateById(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int batchDelete(Collection<Long> ids) {
        if (CollUtil.isEmpty(ids)) {
            throw ServiceException.of("任务ID集合不能为空");
        }
        return jobInfoDao.deleteByIds(ids);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int changeStatus(Long id, String status) {
        // 显式校验入参：本方法由 changeJobInfoStatus 接口直接调用，那里不做分组校验
        // （EditGroup 会连带要求整个表单的必填项，而启停只传 id + status）。
        if (id == null) {
            throw ServiceException.of("任务ID不能为空");
        }
        // status 必须是已知值：下面的 lambdaUpdate 会把它直接落库，
        // 放任意字符串进来会让调度器读到无法识别的状态（既非运行也非暂停）
        if (!STATUS_RUNNING.equals(status) && !STATUS_PAUSED.equals(status)) {
            throw ServiceException.of("任务状态只能是 0(暂停) 或 1(运行)");
        }
        JobInfo job = jobInfoDao.getById(id);
        if (job == null) {
            throw ServiceException.of("任务不存在");
        }
        Date next = null;
        if (STATUS_RUNNING.equals(status)) {
            validateCron(job.getCronExpression());
            next = calcNext(job.getCronExpression());
        }
        return jobInfoDao.lambdaUpdate()
            .set(JobInfo::getStatus, status)
            .set(JobInfo::getNextExecuteTime, next)
            .eq(JobInfo::getId, id)
            .update();
    }

    @Override
    public void run(Long id) {
        JobInvoker invoker = jobInvokerProvider.getIfAvailable();
        if (invoker == null) {
            throw ServiceException.of("内置调度器未启用（ruoyi.job.enabled=false），无法手动执行");
        }
        JobInfo job = jobInfoDao.getById(id);
        if (job == null) {
            throw ServiceException.of("任务不存在");
        }
        // 禁止并发的任务若正在执行，直接同步报错。
        // 否则接口会返回成功、前端提示「已触发」，随后却只落一条跳过日志，使用者无从判断到底跑没跑。
        if (invoker.isRunning(job)) {
            throw ServiceException.of("任务[{}]上一轮尚未执行完毕，该任务已配置为禁止并发，请稍后再试", job.getJobName());
        }
        invoker.trigger(job);
    }

    @Override
    public List<String> previewNextTriggers(String cron, int count) {
        validateCron(cron);
        List<String> result = new ArrayList<>();
        CronExpression expr = CronExpression.parse(cron);
        // 基准时间必须取调度时区下的当前时刻，否则 JVM 时区非东八区时，
        // 预览出来的时间与任务实际触发时间会整体偏移
        LocalDateTime time = CronUtils.nowInZone();
        for (int i = 0; i < count; i++) {
            time = expr.next(time);
            if (time == null) {
                break;
            }
            result.add(time.format(FORMATTER));
        }
        return result;
    }

    @Override
    public List<JobHandlerVo> listRegisteredHandlers() {
        JobHandlerRegistry registry = registryProvider.getIfAvailable();
        if (registry == null) {
            // 调度器未启用时注册表 Bean 不存在，返回空列表而非报错，让前端下拉正常渲染为空
            return Collections.emptyList();
        }
        // 在 Service 层把引擎内部结构转成对外 VO，隔离引擎实现与 API 契约
        return StreamUtils.toList(registry.listAll(),
            meta -> new JobHandlerVo(meta.getName(), meta.getDesc(), meta.getSampleCron()));
    }

    /**
     * 校验 cron 合法性，非法抛业务异常。
     */
    private void validateCron(String cron) {
        if (!CronUtils.isValid(cron)) {
            throw ServiceException.of("cron 表达式不合法: " + cron);
        }
    }

    /**
     * 计算下次执行时间（以当前时间为基准）。
     * <p>
     * 委托 {@link CronUtils}，与调度引擎共用同一时区——否则管理端算出的 next_execute_time
     * 与引擎的判定基准可能相差数小时。
     */
    private Date calcNext(String cron) {
        return CronUtils.next(cron);
    }
}
