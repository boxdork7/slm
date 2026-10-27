package plus.ruoyi.job.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import plus.ruoyi.common.core.constant.I18nKeys;
import plus.ruoyi.common.core.dict.DictOperType;
import plus.ruoyi.common.core.domain.R;
import plus.ruoyi.common.core.validate.AddGroup;
import plus.ruoyi.common.core.validate.EditGroup;
import plus.ruoyi.common.idempotent.annotation.RepeatSubmit;
import plus.ruoyi.common.log.annotation.Log;
import plus.ruoyi.common.mybatis.core.page.PageQuery;
import plus.ruoyi.common.mybatis.core.page.PageResult;
import plus.ruoyi.job.domain.bo.JobInfoBo;
import plus.ruoyi.job.domain.vo.JobHandlerVo;
import plus.ruoyi.job.domain.vo.JobInfoVo;
import plus.ruoyi.job.service.IJobInfoService;

import java.util.List;

/**
 * 调度任务管理
 *
 * @author 抓蛙师
 * @date 2026-07-22
 */
@Validated
@RequiredArgsConstructor
@RestController
@RequestMapping("/job/info")
public class JobInfoController {

    private final IJobInfoService jobInfoService;

    /**
     * 分页查询调度任务列表
     */
    @SaCheckPermission("job:info:query")
    @GetMapping("/pageJobInfos")
    public R<PageResult<JobInfoVo>> pageJobInfos(JobInfoBo bo, PageQuery pageQuery) {
        return R.ok(jobInfoService.page(bo, pageQuery));
    }

    /**
     * 获取调度任务详细信息
     *
     * @param id 主键
     */
    @SaCheckPermission("job:info:query")
    @GetMapping("/getJobInfo/{id}")
    public R<JobInfoVo> getJobInfo(@NotNull(message = I18nKeys.Common.ID_REQUIRED) @PathVariable Long id) {
        return R.ok(jobInfoService.get(id));
    }

    /**
     * 新增调度任务
     */
    @SaCheckPermission("job:info:add")
    @Log(title = "调度任务", operType = DictOperType.INSERT)
    @RepeatSubmit()
    @PostMapping("/addJobInfo")
    public R<Long> addJobInfo(@Validated(AddGroup.class) @RequestBody JobInfoBo bo) {
        return R.ok(jobInfoService.add(bo));
    }

    /**
     * 修改调度任务
     */
    @SaCheckPermission("job:info:update")
    @Log(title = "调度任务", operType = DictOperType.UPDATE)
    @RepeatSubmit()
    @PutMapping("/updateJobInfo")
    public R<Void> updateJobInfo(@Validated(EditGroup.class) @RequestBody JobInfoBo bo) {
        return R.status(jobInfoService.update(bo));
    }

    /**
     * 删除调度任务
     *
     * @param ids 主键串
     */
    @SaCheckPermission("job:info:remove")
    @Log(title = "调度任务", operType = DictOperType.DELETE)
    @DeleteMapping("/deleteJobInfos/{ids}")
    public R<Void> deleteJobInfos(@NotEmpty(message = I18nKeys.Common.ID_REQUIRED) @PathVariable Long[] ids) {
        return R.status(jobInfoService.batchDelete(List.of(ids)));
    }

    /**
     * 启停任务
     *
     * @param bo 含 id 与目标状态
     */
    @SaCheckPermission("job:info:changeStatus")
    @Log(title = "调度任务", operType = DictOperType.UPDATE)
    @PutMapping("/changeJobInfoStatus")
    public R<Void> changeJobInfoStatus(@RequestBody JobInfoBo bo) {
        // 刻意不加 @Validated(EditGroup.class)：EditGroup 是给「编辑整个任务」用的，
        // 会连带要求 jobName / invokeTarget / cronExpression 非空，而启停只传 {id, status}，
        // 加上就会误报「任务名称不能为空」。id 与 status 的校验放在 Service 层。
        // 项目内 changeUserStatus / changeRoleStatus 同样不做分组校验。
        return R.status(jobInfoService.changeStatus(bo.getId(), bo.getStatus()));
    }

    /**
     * 手动执行一次
     *
     * @param id 任务ID
     */
    @SaCheckPermission("job:info:run")
    @Log(title = "调度任务", operType = DictOperType.OTHER)
    @RepeatSubmit()
    @PutMapping("/runJobInfo/{id}")
    public R<Void> runJobInfo(@NotNull(message = I18nKeys.Common.ID_REQUIRED) @PathVariable Long id) {
        jobInfoService.run(id);
        return R.ok();
    }

    /**
     * 预览 cron 未来 N 次执行时间（前端实时校验用）
     *
     * @param cron  cron 表达式
     * @param count 预览次数，默认 5
     */
    @SaCheckPermission("job:info:query")
    @GetMapping("/previewJobInfoTriggers")
    public R<List<String>> previewJobInfoTriggers(@NotBlank(message = "cron 表达式不能为空") @RequestParam String cron,
                                                  @Min(value = 1, message = "预览次数至少为 1")
                                                  @Max(value = 20, message = "预览次数最多为 20")
                                                  @RequestParam(defaultValue = "5") int count) {
        return R.ok(jobInfoService.previewNextTriggers(cron, count));
    }

    /**
     * 列出已注册执行器（供新增任务「执行器下拉」使用）
     */
    @SaCheckPermission("job:info:query")
    @GetMapping("/listJobHandlers")
    public R<List<JobHandlerVo>> listJobHandlers() {
        return R.ok(jobInfoService.listRegisteredHandlers());
    }
}
