package plus.ruoyi.job.dao.impl;

import org.springframework.stereotype.Repository;
import plus.ruoyi.common.core.utils.StringUtils;
import plus.ruoyi.common.mybatis.core.dao.impl.BaseDaoImpl;
import plus.ruoyi.common.mybatis.core.query.PlusLambdaQuery;
import plus.ruoyi.job.dao.IJobInfoDao;
import plus.ruoyi.job.domain.JobInfo;
import plus.ruoyi.job.domain.bo.JobInfoBo;
import plus.ruoyi.job.mapper.JobInfoMapper;

/**
 * 定时任务数据访问实现
 *
 * @author 抓蛙师
 */
@Repository
public class JobInfoDaoImpl extends BaseDaoImpl<JobInfoMapper, JobInfo> implements IJobInfoDao {

    /**
     * 构建查询条件
     *
     * @param bo 查询参数
     * @return 查询条件
     */
    @Override
    public PlusLambdaQuery<JobInfo> buildQueryWrapper(JobInfoBo bo) {
        PlusLambdaQuery<JobInfo> lqw = PlusLambdaQuery.of();

        lqw.like(JobInfo::getJobName, bo.getJobName());
        lqw.eq(JobInfo::getJobGroup, bo.getJobGroup());
        lqw.eq(JobInfo::getInvokeTarget, bo.getInvokeTarget());
        lqw.eq(JobInfo::getRouteStrategy, bo.getRouteStrategy());
        lqw.eq(JobInfo::getStatus, bo.getStatus());
        lqw.orderByDesc(JobInfo::getCreateTime);

        // 模糊搜索（跨数据库兼容：非字符串字段用 likeCast）
        String searchValue = bo.getSearchValue();
        if (StringUtils.isNotBlank(searchValue)) {
            lqw.and(w -> w
                .likeCast(JobInfo::getId, searchValue)          // Long
                .or().like(JobInfo::getJobName, searchValue)    // String
                .or().like(JobInfo::getJobGroup, searchValue)   // String
                .or().like(JobInfo::getInvokeTarget, searchValue) // String
                .or().like(JobInfo::getCronExpression, searchValue) // String
            );
        }
        return lqw;
    }
}
