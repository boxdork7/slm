package plus.ruoyi.system.core.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import plus.ruoyi.common.core.dict.DictOperType;
import plus.ruoyi.common.core.domain.R;
import plus.ruoyi.common.core.exception.ServiceException;
import plus.ruoyi.common.core.field.SubjectType;
import plus.ruoyi.common.idempotent.annotation.RepeatSubmit;
import plus.ruoyi.common.log.annotation.Log;
import plus.ruoyi.system.core.domain.bo.FieldMatrixBo;
import plus.ruoyi.system.core.domain.vo.FieldAffectedVo;
import plus.ruoyi.system.core.domain.vo.FieldMatrixVo;
import plus.ruoyi.system.core.domain.vo.FieldPreviewVo;
import plus.ruoyi.system.core.domain.vo.FieldSubjectVo;
import plus.ruoyi.system.core.service.ISysFieldMatrixService;

import java.util.List;

/**
 * 字段级权限配置
 *
 * <p>管理端「字段 × 主体」矩阵的读写入口。运行期决策不走这里——
 * 决策在四个出口（JSON / Excel 导出 / JSON 写入 / Excel 导入）内部完成。</p>
 */
@Validated
@RequiredArgsConstructor
@RestController
@RequestMapping("/system/fieldPermission")
public class SysFieldPermissionController {

    private final ISysFieldMatrixService fieldMatrixService;

    /**
     * 查询字段权限矩阵
     *
     * @param resourceKey 资源标识
     * @param subjectType 主体类型（1角色 2部门 3用户）
     * @param subjectIds  要显示的主体ID；不传则取该类型的默认集合
     */
    @SaCheckPermission("system:fieldPermission:query")
    @GetMapping("/getFieldMatrix")
    public R<FieldMatrixVo> getFieldMatrix(
        @NotBlank(message = "资源标识不能为空") @RequestParam String resourceKey,
        @NotBlank(message = "主体类型不能为空") @RequestParam String subjectType,
        @RequestParam(required = false) List<Long> subjectIds) {
        return R.ok(fieldMatrixService.getMatrix(resourceKey, parseSubjectType(subjectType), subjectIds));
    }

    /**
     * 保存字段权限矩阵（覆盖式）
     *
     * <p>先删该资源该批主体的全部差异行，再插入与基线不同的格子。
     * 因此 {@code subjectIds} 必须完整传入本次编辑涉及的所有主体。</p>
     */
    @SaCheckPermission("system:fieldPermission:update")
    @Log(title = "字段权限", operType = DictOperType.GRANT)
    @RepeatSubmit()
    @PutMapping("/updateFieldMatrix")
    public R<Integer> updateFieldMatrix(@Validated @RequestBody FieldMatrixBo bo) {
        return R.ok(fieldMatrixService.saveMatrix(bo));
    }

    /**
     * 查询授权主体选项（矩阵的列候选）
     *
     * <p>用户主体不返回全量（量可能极大），由前端用户选择器按需检索。</p>
     *
     * @param subjectType 主体类型
     */
    @SaCheckPermission("system:fieldPermission:query")
    @GetMapping("/listFieldSubjects/{subjectType}")
    public R<List<FieldSubjectVo>> listFieldSubjects(@PathVariable String subjectType) {
        return R.ok(fieldMatrixService.listSubjects(parseSubjectType(subjectType)));
    }

    /**
     * 效果预览：按真实用户看该资源每个字段的最终档位
     *
     * <p>走与运行期完全相同的合并逻辑，所见即所得。管理员配完能立刻验证"张三到底看得到什么"，
     * 不必真去登录一个账号试。</p>
     *
     * @param resourceKey 资源标识
     * @param userId      被预览的用户
     */
    @SaCheckPermission("system:fieldPermission:preview")
    @GetMapping("/previewFieldEffect")
    public R<FieldPreviewVo> previewFieldEffect(
        @NotBlank(message = "资源标识不能为空") @RequestParam String resourceKey,
        @NotNull(message = "用户ID不能为空") @RequestParam Long userId) {
        return R.ok(fieldMatrixService.previewFieldEffect(resourceKey, userId));
    }

    /**
     * 收权后果计数
     *
     * <p>回答"把这个字段对该主体收紧后，还有多少人因其他主体仍能看到"。
     * 最宽松合并语义下，给某个角色设隐藏对兼任其他角色的用户完全无效，
     * 而管理员在页面上看不出异常——这个接口把后果显式摆出来，供单元格 {@code ⚠ N} 角标使用。</p>
     */
    @SaCheckPermission("system:fieldPermission:query")
    @GetMapping("/countAffectedUsers")
    public R<FieldAffectedVo> countAffectedUsers(
        @NotBlank(message = "资源标识不能为空") @RequestParam String resourceKey,
        @NotBlank(message = "主体类型不能为空") @RequestParam String subjectType,
        @NotNull(message = "主体ID不能为空") @RequestParam Long subjectId,
        @NotBlank(message = "字段名不能为空") @RequestParam String fieldName,
        @NotBlank(message = "档位不能为空") @RequestParam String accessType) {
        return R.ok(fieldMatrixService.countAffectedUsers(
            resourceKey, parseSubjectType(subjectType), subjectId, fieldName, accessType));
    }

    /**
     * 解析主体类型，非法值直接拒绝而不是静默当成某个默认值
     */
    private SubjectType parseSubjectType(String code) {
        SubjectType type = SubjectType.ofCode(code);
        if (type == null) {
            throw ServiceException.of("主体类型不合法：{}", code);
        }
        return type;
    }
}