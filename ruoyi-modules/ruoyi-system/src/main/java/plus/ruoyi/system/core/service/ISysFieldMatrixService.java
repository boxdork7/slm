package plus.ruoyi.system.core.service;

import plus.ruoyi.common.core.field.SubjectType;
import plus.ruoyi.system.core.domain.bo.FieldMatrixBo;
import plus.ruoyi.system.core.domain.vo.FieldAffectedVo;
import plus.ruoyi.system.core.domain.vo.FieldMatrixVo;
import plus.ruoyi.system.core.domain.vo.FieldPreviewVo;
import plus.ruoyi.system.core.domain.vo.FieldSubjectVo;

import java.util.List;
import java.util.Map;

/**
 * 字段权限矩阵服务（管理端配置）
 *
 * <p>与 {@code ISysFieldPermissionService}（运行期决策）分开：决策服务在热路径上，
 * 只做只读判档；本服务是低频管理操作，可以随意查库、反射。混在一起会让热路径接口越来越胖。</p>
 */
public interface ISysFieldMatrixService {

    /**
     * 查询矩阵数据（字段行 + 主体列 + 差异格）
     *
     * @param resourceKey 资源标识
     * @param subjectType 主体类型
     * @param subjectIds  要显示的主体ID；为空则取该类型下的默认集合（角色取全部，部门/用户需显式指定）
     * @return 矩阵数据
     */
    FieldMatrixVo getMatrix(String resourceKey, SubjectType subjectType, List<Long> subjectIds);

    /**
     * 覆盖式保存矩阵
     *
     * <p>先删该资源该批主体的全部差异行，再插入与基线不同的格子。
     * 与基线相同的格子不落库——这是"表里只存差异行"的存储语义，
     * 保证存量模块零影响、表体积可控。</p>
     *
     * @param bo 矩阵数据
     * @return 实际落库的差异行数
     */
    int saveMatrix(FieldMatrixBo bo);

    /**
     * 查询主体选项（矩阵的列候选）
     *
     * @param subjectType 主体类型
     * @return 选项列表；部门类型带 parentId 供前端构树
     */
    List<FieldSubjectVo> listSubjects(SubjectType subjectType);

    /**
     * 取指定用户在全部启用资源上的字段权限快照（供登录时下发前端）
     *
     * <p>只含<b>与基线不同</b>的字段：绝大多数用户是空对象，序列化后几乎不占体积。
     * 前端据此在表格 / 详情 / 表单层隐藏或禁用字段——纯体验优化，
     * <b>不是安全边界</b>（安全由四个后端出口保证）。</p>
     *
     * <p>超管返回空 Map：走旁路不受约束。</p>
     *
     * @param userId 用户ID
     * @return 资源标识 → (字段名 → 档位码)，永不为 null
     */
    Map<String, Map<String, String>> getUserFieldSnapshot(Long userId);

    /**
     * 效果预览：按指定用户看该资源每个字段的最终档位
     *
     * <p>走与运行期完全相同的合并逻辑（角色 + 部门链 + 个人配置，逐字段取最宽松，
     * 无差异行则回落注解基线）。管理员配完能立刻验证"张三到底看得到什么"，
     * 而不必真去登录一个账号试。</p>
     *
     * @param resourceKey 资源标识
     * @param userId      被预览的用户
     * @return 逐字段的最终效果
     */
    FieldPreviewVo previewFieldEffect(String resourceKey, Long userId);

    /**
     * 收权后果计数
     *
     * <p>回答一个最容易被忽略的问题：把某主体的某字段收紧后，
     * <b>命中该主体的用户里还有多少人因其他主体仍能看到</b>。</p>
     *
     * <p>最宽松合并语义下，"给实习生角色设隐藏"对同时兼任其他角色的用户完全无效，
     * 而管理员在页面上看不出任何异常——这个接口就是把这层后果显式摆出来。</p>
     *
     * @param resourceKey 资源标识
     * @param subjectType 主体类型
     * @param subjectId   主体ID
     * @param fieldName   字段名
     * @param accessType  打算设置的档位
     * @return 受影响人数与样例
     */
    FieldAffectedVo countAffectedUsers(String resourceKey, SubjectType subjectType, Long subjectId,
                                       String fieldName, String accessType);
}