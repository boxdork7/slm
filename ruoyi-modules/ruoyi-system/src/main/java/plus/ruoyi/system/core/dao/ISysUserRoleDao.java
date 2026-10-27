package plus.ruoyi.system.core.dao;

import plus.ruoyi.common.mybatis.core.dao.IBaseDao;
import plus.ruoyi.system.core.domain.SysUserRole;

import java.util.List;
import java.util.Set;

/**
 * 用户角色关联数据访问接口
 *
 * @author Lion Li
 */
public interface ISysUserRoleDao extends IBaseDao<SysUserRole> {

    /**
     * 根据角色ID查询关联的用户ID列表
     */
    List<Long> listUserIdsByRoleId(Long roleId);

    /**
     * 查询用户拥有的角色ID列表
     *
     * <p>字段权限的预览 / 收权计数需要按<b>指定用户</b>（而非当前登录用户）走一遍多主体合并，
     * 拿不到 LoginUser 里现成的角色列表，只能从关联表查。</p>
     *
     * @param userId 用户ID
     * @return 角色ID列表
     */
    List<Long> listRoleIdsByUserId(Long userId);

    /**
     * 删除用户角色关联
     */
    int deleteUserRole(Long roleId, Long userId);

    /**
     * 批量删除用户角色关联
     */
    int batchDeleteUserRoles(Long roleId, List<Long> userIds);

    /**
     * 批量插入用户角色关联
     */
    boolean batchInsertUserRoles(List<SysUserRole> list);

    /**
     * 根据用户ID删除用户角色关联
     */
    int deleteByUserId(Long userId);

    /**
     * 根据用户ID和角色ID集合删除用户角色关联
     * 只删除指定角色范围内的关联，保留其他角色
     *
     * @param userId 用户ID
     * @param roleIds 要删除的角色ID集合
     * @return 删除的记录数
     */
    int deleteByUserIdAndRoleIds(Long userId, Set<Long> roleIds);

    /**
     * 根据用户ID列表批量删除用户角色关联
     */
    int batchDeleteByUserIds(List<Long> userIds);

    /**
     * 根据角色ID列表查询用户角色关联列表
     *
     * @param roleIds 角色ID列表
     * @return 用户角色关联列表
     */
    List<SysUserRole> listByRoleIds(List<Long> roleIds);

    /**
     * 根据角色ID统计用户数量
     *
     * @param roleId 角色ID
     * @return 用户数量
     */
    Long countUsersByRoleId(Long roleId);
}
