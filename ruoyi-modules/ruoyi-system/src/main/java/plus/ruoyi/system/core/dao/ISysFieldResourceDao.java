package plus.ruoyi.system.core.dao;

import plus.ruoyi.common.mybatis.core.dao.IBaseDao;
import plus.ruoyi.common.mybatis.core.query.PlusLambdaQuery;
import plus.ruoyi.system.core.domain.SysFieldResource;

import java.util.List;

/**
 * 字段权限资源注册表 DAO
 *
 * <p>系统级表，无租户。查询条件统一在此层构建，Service 不直接拼 Wrapper。</p>
 */
public interface ISysFieldResourceDao extends IBaseDao<SysFieldResource> {

    /**
     * 构建查询条件（资源标识 / 名称模糊、分组精确、状态精确，按分组 + 排序值排序）
     *
     * @param resourceKey  资源标识（模糊）
     * @param resourceName 资源名称（模糊）
     * @param moduleName   模块分组（精确）
     * @param status       状态（精确）
     * @return 查询包装器
     */
    PlusLambdaQuery<SysFieldResource> buildQueryWrapper(String resourceKey, String resourceName, String moduleName, String status);

    /**
     * 按资源标识查询（唯一）
     *
     * @param resourceKey 资源标识
     * @return 资源；不存在返回 null
     */
    SysFieldResource getByResourceKey(String resourceKey);

    /**
     * 查询全部正常状态的资源，按分组 + 排序值排序（配置页左树）
     */
    List<SysFieldResource> listEnabled();
}