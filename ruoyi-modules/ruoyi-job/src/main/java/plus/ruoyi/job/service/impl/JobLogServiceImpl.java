package plus.ruoyi.job.service.impl;

import cn.hutool.core.collection.CollUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import plus.ruoyi.common.core.exception.ServiceException;
import plus.ruoyi.common.mybatis.core.page.PageQuery;
import plus.ruoyi.common.mybatis.core.page.PageResult;
import plus.ruoyi.common.mybatis.core.query.PlusLambdaQuery;
import plus.ruoyi.job.dao.IJobLogDao;
import plus.ruoyi.job.domain.JobLog;
import plus.ruoyi.job.domain.bo.JobLogBo;
import plus.ruoyi.job.domain.vo.JobLogVo;
import plus.ruoyi.job.service.IJobLogService;

import java.util.Collection;

/**
 * 定时任务执行日志服务实现
 *
 * @author 抓蛙师
 * @date 2026-07-22
 */
@Service
@RequiredArgsConstructor
public class JobLogServiceImpl implements IJobLogService {

    private final IJobLogDao jobLogDao;

    @Override
    public PageResult<JobLogVo> page(JobLogBo bo, PageQuery pageQuery) {
        PlusLambdaQuery<JobLog> wrapper = jobLogDao.buildQueryWrapper(bo);
        PageResult<JobLog> entityPage = jobLogDao.page(wrapper, pageQuery);
        return entityPage.convert(JobLogVo.class);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int batchDelete(Collection<Long> ids) {
        if (CollUtil.isEmpty(ids)) {
            throw ServiceException.of("日志ID集合不能为空");
        }
        return jobLogDao.deleteByIds(ids);
    }

    /**
     * 清空所有日志
     * <p>
     * 刻意不加 {@code @Transactional}：清空动辄百万行，包在单个大事务里会撑爆 undo log
     * 并长时间持锁，反而阻塞调度器自身的日志写入。改由 DAO 分批删除、每批独立提交。
     *
     * @return 累计删除行数
     */
    @Override
    public int clean() {
        return jobLogDao.deleteAll();
    }
}
