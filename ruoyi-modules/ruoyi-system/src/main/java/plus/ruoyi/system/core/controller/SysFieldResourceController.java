package plus.ruoyi.system.core.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import plus.ruoyi.common.core.constant.I18nKeys;
import plus.ruoyi.common.core.dict.DictOperType;
import plus.ruoyi.common.core.domain.R;
import plus.ruoyi.common.core.utils.MapstructUtils;
import plus.ruoyi.common.core.validate.EditGroup;
import plus.ruoyi.common.idempotent.annotation.RepeatSubmit;
import plus.ruoyi.common.log.annotation.Log;
import plus.ruoyi.system.core.domain.SysFieldResource;
import plus.ruoyi.system.core.domain.bo.SysFieldResourceBo;
import plus.ruoyi.system.core.domain.vo.SysFieldResourceVo;
import plus.ruoyi.system.core.service.ISysFieldResourceService;

import java.util.List;

/**
 * 字段权限资源管理
 *
 * <p>🔴 <b>刻意不提供新增 / 删除接口</b>：资源与类绑定由 {@code @FieldResource} 注解启动扫描独占维护。
 * 后台手填资源标识等于给绕过后门开口子——序列化层按注解值反查资源，若管理员在后台把 key 改成别的，
 * 配置就挂在了一个永远不会被命中的 key 上，字段静默变成"无动态决策"而放行。</p>
 *
 * <p>本控制器只做两件事：查资源树（配置页左树）、改元信息（中文名 / 分组 / 排序 / 状态）。</p>
 */
@Validated
@RequiredArgsConstructor
@RestController
@RequestMapping("/system/fieldResource")
public class SysFieldResourceController {

    private final ISysFieldResourceService fieldResourceService;

    /**
     * 查询字段权限资源列表（配置页左树）
     *
     * <p>每个资源带类绑定清单（只读展示覆盖范围）与已配置差异字段数（数字徽标）。</p>
     *
     * @param bo 过滤条件
     */
    @SaCheckPermission("system:fieldPermission:query")
    @GetMapping("/listFieldResources")
    public R<List<SysFieldResourceVo>> listFieldResources(SysFieldResourceBo bo) {
        return R.ok(fieldResourceService.listResourceVos(bo));
    }

    /**
     * 获取字段权限资源详情
     *
     * @param id 资源ID
     */
    @SaCheckPermission("system:fieldPermission:query")
    @GetMapping("/getFieldResource/{id}")
    public R<SysFieldResourceVo> getFieldResource(
        @NotNull(message = I18nKeys.Common.ID_REQUIRED) @PathVariable Long id) {
        return R.ok(fieldResourceService.getResourceVo(id));
    }

    /**
     * 修改字段权限资源元信息
     *
     * <p>只能改中文名 / 分组 / 排序 / 状态 / 备注；资源标识与类绑定不可改（见类注释）。</p>
     */
    @SaCheckPermission("system:fieldResource:manage")
    @Log(title = "字段权限", operType = DictOperType.UPDATE)
    @RepeatSubmit()
    @PutMapping("/updateFieldResource")
    public R<Void> updateFieldResource(@Validated(EditGroup.class) @RequestBody SysFieldResourceBo bo) {
        SysFieldResource resource = MapstructUtils.convert(bo, SysFieldResource.class);
        return R.status(fieldResourceService.updateResourceMeta(resource));
    }
}