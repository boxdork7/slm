package plus.ruoyi.system.core.domain.vo;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * 字段权限矩阵视图对象
 *
 * <p>配置页右侧「字段 × 主体」矩阵的完整数据：{@link #fields} 是行（字段），
 * {@link #subjects} 是列（角色/部门/用户），{@link #cells} 是已配置的差异格。</p>
 *
 * <p>只返回差异格而非完整二维数组：绝大多数格子都是"跟随基线"，
 * 全量返回会让一个 20 字段 × 30 角色的资源产生 600 个无意义对象。
 * 前端按 {@code fieldName + subjectId} 索引，未命中即渲染为基线档位。</p>
 */
@Data
public class FieldMatrixVo implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 资源标识
     */
    private String resourceKey;

    /**
     * 资源名称
     */
    private String resourceName;

    /**
     * 该资源绑定的类清单（只读，让管理员看见配置的实际覆盖范围）
     */
    private List<SysFieldResourceClassVo> classes = new ArrayList<>();

    /**
     * 矩阵的行：字段元数据（含中文标签、注解基线）
     */
    private List<FieldMetaVo> fields = new ArrayList<>();

    /**
     * 矩阵的列：主体选项
     */
    private List<FieldSubjectVo> subjects = new ArrayList<>();

    /**
     * 已配置的差异格（不含"跟随基线"的格子）
     */
    private List<FieldMatrixCellVo> cells = new ArrayList<>();
}