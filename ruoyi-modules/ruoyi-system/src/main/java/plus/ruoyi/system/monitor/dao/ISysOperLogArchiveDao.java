package plus.ruoyi.system.monitor.dao;

import plus.ruoyi.common.mybatis.core.page.PageQuery;
import plus.ruoyi.common.mybatis.core.page.PageResult;
import plus.ruoyi.system.monitor.domain.SysOperLogArchive;
import plus.ruoyi.system.monitor.domain.bo.SysOperLogBo;

import java.util.Collection;

/**
 * SysOperLog归档数据访问接口
 * <p>
 * 等保二级 8.1.4.3：归档表的能力边界是 <b>「可写、可查、不可删、不可改」</b>。
 * <p>
 * <b>本接口刻意不继承 IBaseDao</b>：继承会一并带来 deleteById / delete / updateById
 * 等能力，归档表一旦具备删改能力，8.1.4.3 c 的「防未预期删除」就只剩注释约束了。
 * 这里用类型系统把删改挡在外面 —— 拿到本接口的调用方，<b>编译期就没有删改归档记录的可能</b>。
 * <p>
 * 但「不可删」不等于「不可查」：8.1.4.3 b 明确要求审计记录可以查阅、
 * 可以生成审计报表。因此这里提供只读的分页查询，供管理员追溯历史审计数据。
 * <p>
 * 归档记录确需清理时，只能由 DBA 直连数据库操作，该动作会留在数据库自身的审计里。
 *
 * @author 抓蛙师
 */
public interface ISysOperLogArchiveDao {

    /**
     * 批量写入归档记录
     *
     * @param entities 待归档的实体集合，为空时直接返回 0
     * @return 实际写入条数
     */
    int batchInsert(Collection<SysOperLogArchive> entities);

    /**
     * 分页查询归档记录（只读，等保 8.1.4.3 b 审计记录可查阅）
     * <p>
     * 复用主表的查询条件对象 {@link SysOperLogBo}，字段完全一致 ——
     * 归档实体继承自主表实体，两边结构天然对齐。
     *
     * @param bo        查询条件
     * @param pageQuery 分页参数
     * @return 分页结果，按操作时间倒序
     */
    PageResult<SysOperLogArchive> pageArchives(SysOperLogBo bo, PageQuery pageQuery);
}
