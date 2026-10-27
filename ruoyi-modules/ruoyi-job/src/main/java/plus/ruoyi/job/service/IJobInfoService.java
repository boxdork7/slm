package plus.ruoyi.job.service;

import plus.ruoyi.common.mybatis.core.page.PageQuery;
import plus.ruoyi.common.mybatis.core.page.PageResult;
import plus.ruoyi.job.domain.vo.JobHandlerVo;
import plus.ruoyi.job.domain.bo.JobInfoBo;
import plus.ruoyi.job.domain.vo.JobInfoVo;

import java.util.Collection;
import java.util.List;

/**
 * 定时任务服务接口
 *
 * @author 抓蛙师
 */
public interface IJobInfoService {

    /**
     * 根据ID查询
     *
     * @param id 主键ID
     * @return 视图对象
     */
    JobInfoVo get(Long id);

    /**
     * 分页查询
     *
     * @param bo        查询参数
     * @param pageQuery 分页参数
     * @return 分页结果
     */
    PageResult<JobInfoVo> page(JobInfoBo bo, PageQuery pageQuery);

    /**
     * 新增
     *
     * @param bo 业务对象
     * @return 主键ID
     */
    Long add(JobInfoBo bo);

    /**
     * 修改
     *
     * @param bo 业务对象
     * @return 影响行数
     */
    int update(JobInfoBo bo);

    /**
     * 批量删除
     *
     * @param ids ID集合
     * @return 影响行数
     */
    int batchDelete(Collection<Long> ids);

    /**
     * 启停任务。启用时校验 cron 合法性并初始化下次执行时间；暂停时清空下次执行时间。
     *
     * @param id     任务ID
     * @param status 目标状态（0暂停 1运行）
     * @return 影响行数
     */
    int changeStatus(Long id, String status);

    /**
     * 手动执行一次（当前节点立即异步执行，忽略路由策略）。
     *
     * @param id 任务ID
     */
    void run(Long id);

    /**
     * 预览 cron 未来 N 次执行时间（用于前端实时校验预览）。
     *
     * @param cron  cron 表达式
     * @param count 预览次数
     * @return 执行时间字符串列表
     */
    List<String> previewNextTriggers(String cron, int count);

    /**
     * 列出所有已注册执行器（供管理界面「执行器下拉」使用）。
     *
     * @return 执行器视图对象列表；调度器未启用时返回空列表
     */
    List<JobHandlerVo> listRegisteredHandlers();
}
