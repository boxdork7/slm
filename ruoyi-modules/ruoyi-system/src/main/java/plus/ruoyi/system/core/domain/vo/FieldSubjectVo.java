package plus.ruoyi.system.core.domain.vo;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * 字段权限授权主体选项（矩阵的列）
 */
@Data
public class FieldSubjectVo implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 主体类型（1角色 2部门 3用户）
     */
    private String subjectType;

    /**
     * 主体ID
     */
    private Long subjectId;

    /**
     * 主体名称（角色名 / 部门名 / 用户昵称）
     */
    private String subjectName;

    /**
     * 父ID，仅部门主体有值，供前端构树
     */
    private Long parentId;

    /**
     * 是否超级管理员角色
     *
     * <p>超管走 {@code isSuperAdmin()} 旁路，字段权限对它不生效。
     * 前端把这一列渲染成不可编辑的"全权"标签，避免管理员配了半天发现没用，
     * 也避免把自己锁死。</p>
     */
    private Boolean superAdmin;
}