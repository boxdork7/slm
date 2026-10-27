package plus.ruoyi.system.core.service;

import plus.ruoyi.common.core.field.FieldAccess;
import plus.ruoyi.common.core.field.IFieldPermissionService;
import plus.ruoyi.common.core.field.SubjectType;

import java.util.Map;
import java.util.Set;

/**
 * 字段权限决策服务（系统侧扩展）
 *
 * <p>继承 core 层的 {@link IFieldPermissionService}（四个出口消费的只读决策），
 * 在此补上只有系统模块需要的缓存维护入口。矩阵增删改接口放步骤 11 另建 Service，本接口只管"决策 + 失效"。</p>
 */
public interface ISysFieldPermissionService extends IFieldPermissionService {

    /**
     * 加载某主体对某资源的全部差异行（带 Spring Cache，空结果也缓存）
     *
     * <p>必须经 AOP 代理调用才走缓存，实现内部用 {@code SpringUtils.getAopProxy(this)} 自调。</p>
     *
     * @return 字段名 → "accessCode|strategy|includeSub" 编码串；必须是可变 HashMap
     */
    Map<String, String> loadSubjectRows(SubjectType type, Long subjectId, String resourceKey);

    /**
     * 使某主体对某资源的差异行缓存失效，并刷新「已配置资源」集合（矩阵保存后调用）
     */
    void evictSubjectResource(SubjectType type, Long subjectId, String resourceKey);

    /**
     * 使某主体对全部资源的差异行缓存失效（角色 / 部门 / 用户被停用时调用）
     */
    void evictSubject(SubjectType type, Long subjectId);

    /**
     * 注销主体：逻辑删除该主体的全部差异行 + 失效缓存 + 刷新「已配置资源」集合
     *
     * <p>角色 / 部门 / 用户被删除时调用。只清缓存不删行，雪花 ID 虽不会复用，但残留行会让
     * 「已配置资源」集合一直认为该资源有配置，短路失效、白查缓存；且管理端矩阵会显示已删主体的幽灵列。</p>
     *
     * @return 删除的差异行数
     */
    int purgeSubject(SubjectType type, Long subjectId);

    /**
     * 按<b>指定用户</b>（而非当前登录用户）计算某资源的档位快照
     *
     * <p>供管理端两处使用：效果预览（"张三看到的是什么"）、收权后果计数
     * （"设了隐藏后还有谁能看到"）。走与运行期完全相同的合并逻辑——
     * 若这里另写一套，预览结果和实际行为就会对不上，那比没有预览更糟。</p>
     *
     * <p>不走 ThreadLocal 快照（那是当前用户的），每次实算；仅管理端低频调用。</p>
     *
     * @param userId      目标用户
     * @param resourceKey 资源标识
     * @param excludeType 计算时要排除的主体类型，为 null 表示不排除
     * @param excludeId   计算时要排除的主体ID，与 excludeType 配对使用
     * @return 字段名 → 档位，只含有动态决策的字段
     */
    Map<String, FieldAccess> calcSnapshotForUser(Long userId, String resourceKey,
                                                 SubjectType excludeType, Long excludeId);

    /**
     * 重建当前租户「已配置差异行的资源标识」集合
     *
     * <p>绝大多数资源一条差异行都没有，快照加载前先查这个集合，未命中直接用注解基线，不再逐主体查缓存。</p>
     *
     * @return 刷新后的集合（含内部标记元素）
     */
    Set<String> refreshConfiguredResources();
}