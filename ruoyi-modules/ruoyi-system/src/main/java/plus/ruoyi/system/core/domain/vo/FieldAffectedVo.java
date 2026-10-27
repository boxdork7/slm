package plus.ruoyi.system.core.domain.vo;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * 收权后果计数结果
 *
 * <p>矩阵单元格 {@code ⚠ N} 角标的数据源。</p>
 */
@Data
public class FieldAffectedVo implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 命中该主体的用户总数
     */
    private Integer totalUsers;

    /**
     * 其中因其他主体仍能看到该字段的人数——收权对这些人无效
     */
    private Integer stillVisibleUsers;

    /**
     * 前若干个仍可见用户的明细（供 hover 展示），最多 10 条
     */
    private List<AffectedUser> samples = new ArrayList<>();

    /**
     * 用户数过多时只给总数、不逐个算，此标记为 true
     *
     * <p>逐用户合并档位要走完整的多主体合并逻辑，几千人的角色算下来会拖垮一次页面交互。
     * 超阈值时前端提示"影响范围较大"，管理员改用效果预览按单个用户查。</p>
     */
    private Boolean approximate;

    /**
     * 受影响用户明细
     */
    @Data
    public static class AffectedUser implements Serializable {

        @Serial
        private static final long serialVersionUID = 1L;

        /**
         * 用户ID
         */
        private Long userId;

        /**
         * 用户昵称
         */
        private String nickName;

        /**
         * 放行来源：哪个主体让他仍能看到（如"角色：财务专员"）
         */
        private String grantedBy;

        /**
         * 该用户最终的档位
         */
        private String finalAccess;
    }
}