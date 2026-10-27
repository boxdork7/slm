package plus.ruoyi.job.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import jakarta.validation.constraints.NotEmpty;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import plus.ruoyi.common.core.constant.I18nKeys;
import plus.ruoyi.common.core.dict.DictOperType;
import plus.ruoyi.common.core.domain.R;
import plus.ruoyi.common.log.annotation.Log;
import plus.ruoyi.common.mybatis.core.page.PageQuery;
import plus.ruoyi.common.mybatis.core.page.PageResult;
import plus.ruoyi.job.domain.bo.JobLogBo;
import plus.ruoyi.job.domain.vo.JobLogVo;
import plus.ruoyi.job.service.IJobLogService;

import java.util.List;

/**
 * 调度日志管理
 *
 * @author 抓蛙师
 * @date 2026-07-22
 */
@Validated
@RequiredArgsConstructor
@RestController
@RequestMapping("/job/log")
public class JobLogController {

    private final IJobLogService jobLogService;

    /**
     * 分页查询调度日志列表
     */
    @SaCheckPermission("job:log:query")
    @GetMapping("/pageJobLogs")
    public R<PageResult<JobLogVo>> pageJobLogs(JobLogBo bo, PageQuery pageQuery) {
        return R.ok(jobLogService.page(bo, pageQuery));
    }

    /**
     * 删除调度日志
     *
     * @param ids 主键串
     */
    @SaCheckPermission("job:log:remove")
    @Log(title = "调度日志", operType = DictOperType.DELETE)
    @DeleteMapping("/deleteJobLogs/{ids}")
    public R<Void> deleteJobLogs(@NotEmpty(message = I18nKeys.Common.ID_REQUIRED) @PathVariable Long[] ids) {
        return R.status(jobLogService.batchDelete(List.of(ids)));
    }

    /**
     * 清空调度日志
     * <p>
     * 分批物理删除，数据量大时耗时较长，返回实际删除条数便于前端反馈。
     */
    @SaCheckPermission("job:log:remove")
    @Log(title = "调度日志", operType = DictOperType.CLEAN)
    @DeleteMapping("/cleanJobLogs")
    public R<Integer> cleanJobLogs() {
        return R.ok(jobLogService.clean());
    }
}
