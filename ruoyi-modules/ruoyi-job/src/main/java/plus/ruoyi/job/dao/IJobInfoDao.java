package plus.ruoyi.job.dao;

import plus.ruoyi.common.mybatis.core.dao.IBaseDao;
import plus.ruoyi.common.mybatis.core.query.PlusLambdaQuery;
import plus.ruoyi.job.domain.JobInfo;
import plus.ruoyi.job.domain.bo.JobInfoBo;

/**
 * 定时任务 DAO 接口
 *
 * @author 抓蛙师
 */
public interface IJobInfoDao extends IBaseDao<JobInfo> {

    /**
     * 根据业务对象构建查询条件
     *
     * @param bo 查询参数
     * @return 查询条件
     */
    PlusLambdaQuery<JobInfo> buildQueryWrapper(JobInfoBo bo);
}
