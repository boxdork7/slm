package plus.ruoyi.system.core.domain.bo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import plus.ruoyi.system.core.domain.vo.FieldMatrixCellVo;

import java.io.Serial;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * 字段权限矩阵保存业务对象
 *
 * <p>覆盖式保存：先删该资源该批主体的全部差异行，再插入 {@link #cells}。
 * 因此 {@link #subjectIds} 必须完整传入本次编辑涉及的所有主体——
 * 少传一个，那个主体的既有配置会被保留（不在删除范围），造成"页面上清空了但实际还生效"。</p>
 */
@Data
public class FieldMatrixBo implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 资源标识
     */
    @NotBlank(message = "资源标识不能为空")
    private String resourceKey;

    /**
     * 主体类型（1角色 2部门 3用户）
     */
    @NotBlank(message = "主体类型不能为空")
    private String subjectType;

    /**
     * 本次编辑涉及的全部主体ID（覆盖式保存的删除范围）
     */
    @NotNull(message = "主体ID列表不能为空")
    private List<Long> subjectIds = new ArrayList<>();

    /**
     * 差异格。只传与基线不同的格子；与基线相同的不传（也不该传，服务端会忽略）
     */
    private List<FieldMatrixCellVo> cells = new ArrayList<>();
}