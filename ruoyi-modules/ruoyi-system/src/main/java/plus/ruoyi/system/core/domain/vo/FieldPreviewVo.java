package plus.ruoyi.system.core.domain.vo;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * 字段权限效果预览结果
 *
 * <p>按<b>指定用户</b>合并其角色 + 部门 + 个人配置后的最终效果。
 * 走与运行期完全相同的合并逻辑（{@code calcSnapshotForUser}），保证所见即所得——
 * 若预览另算一套，管理员照着预览配完上线却是另一回事，比没有预览更糟。</p>
 */
@Data
public class FieldPreviewVo implements Serializable {

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
     * 被预览的用户ID
     */
    private Long userId;

    /**
     * 被预览的用户昵称
     */
    private String nickName;

    /**
     * 该用户是否超管：超管走旁路，所有字段均为可写，配置对它不生效
     */
    private Boolean superAdmin;

    /**
     * 逐字段的最终效果
     */
    private List<FieldPreviewItem> items = new ArrayList<>();

    /**
     * 单个字段的预览结果
     */
    @Data
    public static class FieldPreviewItem implements Serializable {

        @Serial
        private static final long serialVersionUID = 1L;

        /**
         * 字段名
         */
        private String fieldName;

        /**
         * 中文标签
         */
        private String label;

        /**
         * 最终档位（0隐藏 1脱敏 2只读 3可写）
         */
        private String accessType;

        /**
         * 档位中文标签
         */
        private String accessLabel;

        /**
         * 是否带 @Sensitive 注解（前端展示「注解基线」列）
         */
        private Boolean sensitive;

        /**
         * 档位是否由动态配置决定
         *
         * <p>true = 命中了差异行；false = 回落注解基线或无限制。
         * 管理员据此区分"我配的生效了"与"这是注解带来的默认行为"。</p>
         */
        private Boolean fromConfig;

        /**
         * 脱敏档实际使用的策略名（如 PHONE），非脱敏档为 null
         */
        private String strategy;
    }
}