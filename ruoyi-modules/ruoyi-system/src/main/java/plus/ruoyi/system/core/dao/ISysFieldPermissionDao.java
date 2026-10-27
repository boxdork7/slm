package plus.ruoyi.system.core.dao;

import plus.ruoyi.common.core.field.SubjectType;
import plus.ruoyi.common.mybatis.core.dao.IBaseDao;
import plus.ruoyi.system.core.domain.SysFieldPermission;

import java.util.List;
import java.util.Map;

/**
 * 字段权限配置表 DAO
 *
 * <p>租户级表，tenant_id 由拦截器自动拼接，本层不手写。</p>
 */
public interface ISysFieldPermissionDao extends IBaseDao<SysFieldPermission> {

    /**
     * 按主体 + 资源查询全部差异行（决策服务缓存 miss 时回源）
     *
     * @param subjectType 主体类型
     * @param subjectId   主体ID
     * @param resourceKey 资源标识
     * @return 差异行列表
     */
    List<SysFieldPermission> listBySubjectAndResource(SubjectType subjectType, Long subjectId, String resourceKey);

    /**
     * 按主体 + 资源删除全部差异行（矩阵覆盖式保存前清空）
     *
     * @return 受影响行数
     */
    int deleteBySubjectAndResource(SubjectType subjectType, Long subjectId, String resourceKey);

    /**
     * 按主体删除全部资源的差异行（角色 / 部门 / 用户被删除时联动清理）
     *
     * @return 受影响行数
     */
    int deleteBySubject(SubjectType subjectType, Long subjectId);

    /**
     * 查询当前租户下配置过差异行的全部资源标识（去重）
     * <p>供「已配置资源 Set」短路：绝大多数资源一条差异行都没有，先查这个集合再决定是否碰 Redis</p>
     */
    List<String> listConfiguredResourceKeys();

    /**
     * 统计每个资源下配置过差异行的字段数（配置页左树的数字徽标）
     *
     * <p>同一字段被多个主体配置只算一次——徽标要回答的是"这个资源有几个字段做过限制"，
     * 而不是"有几条配置记录"。</p>
     *
     * @return 资源标识 → 差异字段数
     */
    Map<String, Integer> countConfiguredFieldsByResource();

    /**
     * 查询某资源被哪些主体配置过（收权后果计数用）
     *
     * @param resourceKey 资源标识
     * @param fieldName   字段名
     * @return 差异行列表（含 subjectType / subjectId / accessType）
     */
    List<SysFieldPermission> listByResourceAndField(String resourceKey, String fieldName);
}