package plus.ruoyi.common.core.field;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 字段访问档位
 *
 * <p>与字典 {@code sys_field_access} 一一对应，存库值为 {@link #code}。
 * 数值越大越宽松，多主体合并时取 {@code code} 最大者（授权是加法，与 @DataPermission 的多角色 OR 语义一致）。</p>
 *
 * <p>四档覆盖四种真实诉求：不给看（隐藏）/ 给看但打码（脱敏）/ 给看不给改（只读）/ 全开（可写）。</p>
 */
@Getter
@AllArgsConstructor
public enum FieldAccess {

    /**
     * 隐藏：字段整个不下发。JSON 无该 key、Excel 无该列——不是写 null，null 让前端分不清"无权限"与"确实为空"，且仍暴露字段名
     */
    HIDDEN(0, "隐藏"),

    /**
     * 脱敏：值打码，不可改
     */
    MASKED(1, "脱敏"),

    /**
     * 只读：可读，写入时提交的改动被忽略
     */
    READONLY(2, "只读"),

    /**
     * 可写：无限制。无 @Sensitive 字段的默认档，表里不落行
     */
    WRITABLE(3, "可写");

    /**
     * 存库值 / 字典值，越大越宽松
     */
    private final int code;

    /**
     * 中文标签
     */
    private final String label;

    /**
     * 按存库值反查
     *
     * @param code 存库值（字典是 char(1)，调用方先转 int）
     * @return 对应档位；未匹配返回 {@link #WRITABLE}（宁可放宽也不能因脏数据把字段锁死导致业务不可用——但会在调用方 WARN）
     */
    public static FieldAccess ofCode(int code) {
        for (FieldAccess access : values()) {
            if (access.code == code) {
                return access;
            }
        }
        return WRITABLE;
    }

    /**
     * 按存库字符值反查（对应 sys_field_permission.access_type）
     */
    public static FieldAccess ofCode(String code) {
        if (code == null || code.isEmpty()) {
            return WRITABLE;
        }
        try {
            return ofCode(Integer.parseInt(code));
        } catch (NumberFormatException e) {
            return WRITABLE;
        }
    }

    /**
     * 两档取更宽松者
     */
    public static FieldAccess looser(FieldAccess a, FieldAccess b) {
        if (a == null) {
            return b;
        }
        if (b == null) {
            return a;
        }
        return a.code >= b.code ? a : b;
    }

    /**
     * 是否允许写入
     */
    public boolean isWritable() {
        return this == WRITABLE;
    }

    /**
     * 是否允许读到原值（隐藏 / 脱敏都不算）
     */
    public boolean isReadable() {
        return this == READONLY || this == WRITABLE;
    }
}