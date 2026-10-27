package plus.ruoyi.common.core.field;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 字段权限授权主体类型
 *
 * <p>与字典 {@code sys_field_subject} 一一对应，存库值为 {@link #code}。
 * 一张 {@code sys_field_permission} 表用 {@code subject_type + subject_id} 覆盖三种粒度，无需为部门另建表。</p>
 */
@Getter
@AllArgsConstructor
public enum SubjectType {

    /**
     * 角色：主力粒度，复用 sys_role
     */
    ROLE("1", "角色"),

    /**
     * 部门：如"整个 HR 部门能看身份证"，配合 include_sub 支持含子部门
     */
    DEPT("2", "部门"),

    /**
     * 用户：临时 / 例外授权
     */
    USER("3", "用户");

    /**
     * 存库值，对应 sys_field_permission.subject_type
     */
    private final String code;

    /**
     * 中文标签
     */
    private final String label;

    /**
     * 按存库值反查
     *
     * @return 对应枚举；未匹配返回 null
     */
    public static SubjectType ofCode(String code) {
        for (SubjectType type : values()) {
            if (type.code.equals(code)) {
                return type;
            }
        }
        return null;
    }
}