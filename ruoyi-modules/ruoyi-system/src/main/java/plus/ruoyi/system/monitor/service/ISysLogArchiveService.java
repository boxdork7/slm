package plus.ruoyi.system.monitor.service;

import plus.ruoyi.common.mybatis.core.page.PageQuery;
import plus.ruoyi.common.mybatis.core.page.PageResult;
import plus.ruoyi.system.monitor.domain.bo.SysLoginLogBo;
import plus.ruoyi.system.monitor.domain.bo.SysOperLogBo;
import plus.ruoyi.system.monitor.domain.vo.SysLoginLogVo;
import plus.ruoyi.system.monitor.domain.vo.SysOperLogVo;

import java.util.Collection;

/**
 * 审计日志归档服务接口
 * <p>
 * 等保二级 8.1.4.3 c「应对审计记录进行保护，定期备份，避免受到未预期的删除、修改或覆盖」。
 * <p>
 * 设计要点：
 * <ul>
 *   <li>归档 = <b>搬移</b>而非复制：主表数据搬到归档表后即从主表删除，主键沿用原值便于追溯；</li>
 *   <li>归档表<b>没有任何对外接口</b>，只能 DBA 直连数据库操作，这是「防未预期删除」的实现本身；</li>
 *   <li>保留天数由 sys_config 的 system.log.retain-days 控制，默认 180 天（等保要求 ≥6 个月）。</li>
 * </ul>
 *
 * @author 抓蛙师
 */
public interface ISysLogArchiveService {

    /**
     * 执行一次完整归档（操作日志 + 登录日志，异常日志按开关决定）
     * <p>
     * 供定时任务调用。内部逐类型独立处理，单个类型失败不影响其他类型。
     *
     * @return 本次归档的总条数
     */
    int archiveAll();

    /**
     * 归档超过保留期的操作日志
     *
     * @return 归档条数
     */
    int archiveOperLog();

    /**
     * 归档超过保留期的登录日志
     *
     * @return 归档条数
     */
    int archiveLoginLog();

    /**
     * 把指定的操作日志搬入归档表后再从主表删除
     * <p>
     * 供「清空/删除操作日志」接口调用 —— 管理员的清空动作不再是物理销毁，
     * 而是转为归档，审计痕迹得以保留。
     *
     * @param operIds 要归档的日志主键；为空表示归档主表<b>全部</b>数据
     * @return 实际归档并从主表移除的条数
     */
    int archiveAndRemoveOperLog(Collection<Long> operIds);

    /**
     * 把指定的登录日志搬入归档表后再从主表删除
     *
     * @param infoIds 要归档的日志主键；为空表示归档主表<b>全部</b>数据
     * @return 实际归档并从主表移除的条数
     */
    int archiveAndRemoveLoginLog(Collection<Long> infoIds);

    /**
     * 分页查询操作日志归档（只读，等保 8.1.4.3 b 审计记录可查阅）
     * <p>
     * 「不可删」不等于「不可查」—— 归档表没有任何删除接口，但必须能查阅，
     * 否则管理员清空主表后就再也追溯不到历史审计数据，反而违背 8.1.4.3 b。
     *
     * @param bo        查询条件（复用主表的 BO，字段完全一致）
     * @param pageQuery 分页参数
     * @return 分页结果
     */
    PageResult<SysOperLogVo> pageOperLogArchives(SysOperLogBo bo, PageQuery pageQuery);

    /**
     * 分页查询登录日志归档（只读，等保 8.1.4.3 b 审计记录可查阅）
     *
     * @param bo        查询条件
     * @param pageQuery 分页参数
     * @return 分页结果
     */
    PageResult<SysLoginLogVo> pageLoginLogArchives(SysLoginLogBo bo, PageQuery pageQuery);
}
