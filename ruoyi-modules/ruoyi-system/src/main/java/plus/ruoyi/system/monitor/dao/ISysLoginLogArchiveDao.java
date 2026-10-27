package plus.ruoyi.system.monitor.dao;

import plus.ruoyi.common.mybatis.core.page.PageQuery;
import plus.ruoyi.common.mybatis.core.page.PageResult;
import plus.ruoyi.system.monitor.domain.SysLoginLogArchive;
import plus.ruoyi.system.monitor.domain.bo.SysLoginLogBo;

import java.util.Collection;

/**
 * SysLoginLog归档数据访问接口
 * <p>
 * 等保二级 8.1.4.3 c：<b>本接口刻意只声明批量插入，不继承 IBaseDao</b>。
 * 继承 IBaseDao 会一并带来 deleteById / delete 等能力，归档表一旦具备删除能力，
 * 「防未预期删除」就只剩注释约束了。这里用类型系统把删除挡在外面 ——
 * 拿到本接口的调用方，编译期就没有删除归档记录的可能。
 * <p>
 * 归档记录确需清理时，只能由 DBA 直连数据库操作，该动作会留在数据库自身的审计里。
 *
 * @author 抓蛙师
 */
public interface ISysLoginLogArchiveDao {

    /**
     * 批量写入归档记录
     *
     * @param entities 待归档的实体集合，为空时直接返回 0
     * @return 实际写入条数
     */
    int batchInsert(Collection<SysLoginLogArchive> entities);

    /**
     * 分页查询归档记录（只读，等保 8.1.4.3 b 审计记录可查阅）
     *
     * @param bo        查询条件
     * @param pageQuery 分页参数
     * @return 分页结果，按登录时间倒序
     */
    PageResult<SysLoginLogArchive> pageArchives(SysLoginLogBo bo, PageQuery pageQuery);
}
