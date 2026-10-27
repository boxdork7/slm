package plus.ruoyi.system.monitor.controller;

import java.util.List;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import cn.dev33.satoken.annotation.SaCheckPermission;
import cn.dev33.satoken.annotation.SaCheckRole;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;

import plus.ruoyi.common.core.constant.I18nKeys;
import plus.ruoyi.common.core.constant.TenantConstants;
import plus.ruoyi.common.core.dict.DictOperType;
import plus.ruoyi.common.core.domain.R;
import plus.ruoyi.common.excel.utils.ExcelUtil;
import plus.ruoyi.common.log.annotation.Log;
import plus.ruoyi.common.mybatis.core.page.PageQuery;
import plus.ruoyi.common.mybatis.core.page.PageResult;
import plus.ruoyi.system.monitor.domain.bo.SysOperLogBo;
import plus.ruoyi.system.monitor.domain.vo.SysOperLogVo;
import plus.ruoyi.system.monitor.service.ISysLogArchiveService;
import plus.ruoyi.system.monitor.service.ISysOperLogService;

/**
 * 操作日志
 *
 * @author Lion Li
 */
@Validated
@RequiredArgsConstructor
@RestController
@RequestMapping("/monitor/operLog")
public class SysOperlogController {

    private final ISysOperLogService operLogService;
    private final ISysLogArchiveService logArchiveService;

    /**
     * 获取操作日志列表
     */
    @SaCheckPermission("monitor:operLog:query")
    @GetMapping("/pageOperLogs")
    public R<PageResult<SysOperLogVo>> pageOperLogs(SysOperLogBo operLog, PageQuery pageQuery) {
        return R.ok(operLogService.page(operLog, pageQuery));
    }

    /**
     * 查询操作日志归档列表（只读，等保 8.1.4.3 b 审计记录可查阅）
     * <p>
     * 归档表<b>只提供查询，没有任何删除或修改接口</b> —— 这是有意为之：
     * 8.1.4.3 c 要求审计记录防止未预期删除，8.1.4.3 b 又要求审计记录可查阅，
     * 二者合起来就是「可查不可删」。
     * <p>
     * 权限沿用 monitor:operLog:query，能看主表日志的人就能追溯归档。
     */
    @SaCheckPermission("monitor:operLog:query")
    @GetMapping("/pageOperLogArchives")
    public R<PageResult<SysOperLogVo>> pageOperLogArchives(SysOperLogBo operLog, PageQuery pageQuery) {
        return R.ok(logArchiveService.pageOperLogArchives(operLog, pageQuery));
    }

    /**
     * 批量删除操作日志
     *
     * @param operIds 日志ids
     */
    @Log(title = "操作日志", operType = DictOperType.DELETE)
    @SaCheckPermission("monitor:operLog:delete")
    @DeleteMapping("/deleteOperLogs/{operIds}")
    public R<Void> deleteOperLogs(@NotNull(message = I18nKeys.Common.ID_REQUIRED) @PathVariable Long[] operIds) {
        return R.status(operLogService.batchDelete(List.of(operIds)));
    }

    /**
     * 清理操作日志
     * <p>
     * 等保二级 8.1.4.3 c：这里的「清理」已改为「归档」——
     * 数据先搬入 sys_oper_log_archive 再从主表移除，不是物理销毁。
     * 同时收敛到超级管理员：清空全量审计日志是高危动作，普通管理员不应具备该能力。
     */
    @Log(title = "操作日志", operType = DictOperType.CLEAN)
    @SaCheckPermission("monitor:operLog:delete")
    @SaCheckRole(TenantConstants.SUPER_ADMIN_ROLE_KEY)
    @DeleteMapping("/clearOperLogs")
    public R<Void> clearOperLogs() {
        operLogService.clearOperLogs();
        return R.ok();
    }

    /**
     * 导出操作日志列表
     */
    @Log(title = "操作日志", operType = DictOperType.EXPORT)
    @SaCheckPermission("monitor:operLog:export")
    @PostMapping("/exportOperLogs")
    public void exportOperLogs(SysOperLogBo bo, PageQuery pageQuery, HttpServletResponse response) {
        PageResult<SysOperLogVo> pageResult = operLogService.page(bo, pageQuery);
        ExcelUtil.exportExcel(pageResult.getRecords(), "操作日志", SysOperLogVo.class, response);
    }
}
