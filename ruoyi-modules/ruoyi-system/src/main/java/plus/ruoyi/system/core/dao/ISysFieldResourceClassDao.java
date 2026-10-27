package plus.ruoyi.system.core.dao;

import plus.ruoyi.common.mybatis.core.dao.IBaseDao;
import plus.ruoyi.system.core.domain.SysFieldResourceClass;

import java.util.List;

/**
 * 字段权限资源与类绑定表 DAO
 *
 * <p>系统级表，无租户。</p>
 */
public interface ISysFieldResourceClassDao extends IBaseDao<SysFieldResourceClass> {

    /**
     * 按类全限定名查询绑定（class_name 唯一）
     *
     * @param className 类全限定名
     * @return 绑定记录；未登记返回 null
     */
    SysFieldResourceClass getByClassName(String className);

    /**
     * 按资源标识查询全部绑定类
     *
     * @param resourceKey 资源标识
     * @return 绑定列表
     */
    List<SysFieldResourceClass> listByResourceKey(String resourceKey);

    /**
     * 按资源标识 + 类角色查询绑定类
     *
     * @param resourceKey 资源标识
     * @param classType   类角色（FieldClassType.code）
     * @return 绑定列表
     */
    List<SysFieldResourceClass> listByResourceKeyAndType(String resourceKey, String classType);

    /**
     * 查询全部有效绑定（启动预热 类 → 资源 反查缓存）
     */
    List<SysFieldResourceClass> listAll();

    /**
     * 逻辑删除不在给定类名集合内的自动登记行
     * <p>代码里删掉某类的 @FieldResource 后重启，对应绑定行应失效但不物理删，保留配置追溯</p>
     *
     * @param keepClassNames 本次扫描到的全部类名
     * @return 受影响行数
     */
    int softDeleteAutoNotIn(List<String> keepClassNames);
}