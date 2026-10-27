package plus.ruoyi.system.core.service;

import plus.ruoyi.common.core.field.FieldClassType;
import plus.ruoyi.system.core.domain.SysFieldResource;
import plus.ruoyi.system.core.domain.SysFieldResourceClass;
import plus.ruoyi.system.core.domain.bo.SysFieldResourceBo;
import plus.ruoyi.system.core.domain.vo.SysFieldResourceVo;

import java.util.List;
import java.util.Map;

/**
 * 字段权限资源服务（表 sys_field_resource + sys_field_resource_class）
 *
 * <p>两张表始终由 @FieldResource 启动扫描一起维护，合成一个 Service 避免多一层事务传递。
 * 管理端只暴露查询与元信息修改，资源标识与类绑定不提供手填接口——后台手填等于给绕过后门开口子。</p>
 */
public interface ISysFieldResourceService {

    /**
     * 按注解扫描结果登记一个类
     * <p>资源不存在 → 插入（中文名按 resource_key 反查 sys_menu，查不到回落 resource_key）；
     * 已存在 → 不动（尊重管理员改过的中文名 / 分组）。
     * 类绑定按 class_name 唯一 upsert；同类换资源时更新 resource_key 并 WARN。</p>
     *
     * @param resourceKey 资源标识
     * @param className   类全限定名
     * @param classType   类角色
     * @return 是否新建了资源（用于启动日志统计）
     */
    boolean registerFromAnnotation(String resourceKey, String className, FieldClassType classType);

    /**
     * 逻辑删除本次扫描未出现的自动登记类绑定（代码里删了注解后重启，绑定应失效但保留追溯）
     *
     * @param scannedClassNames 本次扫描到的全部类名
     * @return 失效行数
     */
    int retireMissingAutoBindings(List<String> scannedClassNames);

    /**
     * 查询全部启用资源（配置页左树）
     */
    List<SysFieldResource> listEnabledResources();

    /**
     * 按资源标识查询绑定类
     */
    List<SysFieldResourceClass> listClassesByResource(String resourceKey);

    /**
     * 按类全限定名反查资源标识（走缓存，序列化层热路径入口）
     *
     * @param className 类全限定名
     * @return 资源标识；未登记返回 null
     */
    String getResourceKeyByClass(String className);

    /**
     * 全量重建「类 → 资源」反查缓存（启动扫描末尾与手工刷新时调用）
     *
     * @return 类名 → 资源标识 映射
     */
    Map<String, String> reloadClassResourceCache();

    /**
     * 修改资源元信息（仅中文名 / 分组 / 排序 / 状态；resource_key 不可改）
     *
     * @param resource 含 id 与待改字段
     * @return 是否成功
     */
    boolean updateResourceMeta(SysFieldResource resource);

    /**
     * 查询资源树数据（配置页左树）
     *
     * <p>每个资源附带类绑定清单（只读展示覆盖范围）与已配置差异字段数（数字徽标）。</p>
     *
     * @param bo 过滤条件，可为 null
     * @return 资源列表，按模块分组 + 排序值排序
     */
    List<SysFieldResourceVo> listResourceVos(SysFieldResourceBo bo);

    /**
     * 查询单个资源详情（含类绑定）
     *
     * @param id 资源ID
     * @return 资源详情；不存在返回 null
     */
    SysFieldResourceVo getResourceVo(Long id);
}