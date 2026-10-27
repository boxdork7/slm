package plus.ruoyi.system.core.domain.vo;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * 字段权限矩阵单元格
 *
 * <p>一条差异配置 = 一个格子。"跟随基线"的格子不产生记录。</p>
 */
@Data
public class FieldMatrixCellVo implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 字段名（矩阵行标识）
     */
    private String fieldName;

    /**
     * 主体类型（1角色 2部门 3用户）
     */
    private String subjectType;

    /**
     * 主体ID（矩阵列标识）
     */
    private Long subjectId;

    /**
     * 访问档位（0隐藏 1脱敏 2只读 3可写）
     */
    private String accessType;

    /**
     * 脱敏策略（accessType=1 时生效）
     */
    private String strategy;

    /**
     * 部门主体是否含子部门（仅 subjectType=2 生效）
     */
    private String includeSub;
}