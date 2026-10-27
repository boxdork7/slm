package plus.ruoyi.job.service;

import plus.ruoyi.common.mybatis.core.page.PageQuery;
import plus.ruoyi.common.mybatis.core.page.PageResult;
import plus.ruoyi.job.domain.bo.JobLogBo;
import plus.ruoyi.job.domain.vo.JobLogVo;

import java.util.Collection;

/**
 * 定时任务执行日志服务接口
 *
 * @author 抓蛙师
 */
public interface IJobLogService {

    /**
     * 分页查询
     *
     * @param bo        查询参数
     * @param pageQuery 分页参数
     * @return 分页结果
     */
    PageResult<JobLogVo> page(JobLogBo bo, PageQuery pageQuery);

    /**
     * 批量删除
     *
     * @param ids ID集合
     * @return 影响行数
     */
    int batchDelete(Collection<Long> ids);

    /**
     * 清空所有日志（分批物理删除，非单事务）
     *
     * @return 累计删除行数
     */
    int clean();
}
