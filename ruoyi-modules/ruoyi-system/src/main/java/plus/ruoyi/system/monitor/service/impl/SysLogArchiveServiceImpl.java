package plus.ruoyi.system.monitor.service.impl;

import cn.hutool.core.collection.CollUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import plus.ruoyi.common.core.utils.DateUtils;
import plus.ruoyi.common.core.utils.MapstructUtils;
import plus.ruoyi.common.core.utils.StringUtils;
import plus.ruoyi.common.mybatis.core.page.PageQuery;
import plus.ruoyi.common.mybatis.core.page.PageResult;
import plus.ruoyi.common.tenant.helper.TenantHelper;
import plus.ruoyi.system.config.service.ISysConfigService;
import plus.ruoyi.system.monitor.dao.ISysLoginLogArchiveDao;
import plus.ruoyi.system.monitor.dao.ISysLoginLogDao;
import plus.ruoyi.system.monitor.dao.ISysOperLogArchiveDao;
import plus.ruoyi.system.monitor.dao.ISysOperLogDao;
import plus.ruoyi.system.monitor.domain.SysLoginLog;
import plus.ruoyi.system.monitor.domain.SysLoginLogArchive;
import plus.ruoyi.system.monitor.domain.SysOperLog;
import plus.ruoyi.system.monitor.domain.SysOperLogArchive;
import plus.ruoyi.system.monitor.domain.bo.SysLoginLogBo;
import plus.ruoyi.system.monitor.domain.bo.SysOperLogBo;
import plus.ruoyi.system.monitor.domain.vo.SysLoginLogVo;
import plus.ruoyi.system.monitor.domain.vo.SysOperLogVo;
import plus.ruoyi.system.monitor.service.ISysLogArchiveService;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * 审计日志归档服务实现
 * <p>
 * 等保二级 8.1.4.3 c 的落地实现。
 * <p>
 * 三个关键设计：
 * <ol>
 *   <li><b>分批搬移</b>：日志表往往是全库最大的表，一次性载入会撑爆堆内存，
 *       故按 BATCH_SIZE 循环处理，每批一个事务；</li>
 *   <li><b>跨租户</b>：归档是系统级维护动作，必须处理所有租户的数据，
 *       故用 TenantHelper.ignore 包住。但<b>归档表本身保留 tenant_id</b>，
 *       日后查询仍按租户隔离 —— 这就是不把归档表加进 tenant.excludes 的原因；</li>
 *   <li><b>先写后删</b>：先写归档表，成功后再删主表，且同处一个事务。
 *       顺序颠倒会在事务失败时永久丢失审计记录。</li>
 * </ol>
 *
 * @author 抓蛙师
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SysLogArchiveServiceImpl implements ISysLogArchiveService {

    /**
     * 保留天数参数键名
     */
    private static final String KEY_RETAIN_DAYS = "system.log.retain-days";

    /**
     * 保留天数默认值，等保二级要求审计记录留存不少于 6 个月
     */
    private static final int DEFAULT_RETAIN_DAYS = 180;

    /**
     * 每批搬移条数。取 1000 是内存占用与事务大小的折中。
     */
    private static final int BATCH_SIZE = 1000;

    /**
     * 单次归档的最大批次数，防止日志堆积过多时任务跑到天亮还占着数据库连接。
     * 没搬完的下次继续，反正定时任务每天都跑。
     */
    private static final int MAX_BATCH_ROUNDS = 100;

    private final ISysConfigService configService;
    private final ISysOperLogDao operLogDao;
    private final ISysLoginLogDao loginLogDao;
    private final ISysOperLogArchiveDao operLogArchiveDao;
    private final ISysLoginLogArchiveDao loginLogArchiveDao;

    /**
     * 执行一次完整归档
     *
     * @return 本次归档的总条数
     */
    @Override
    public int archiveAll() {
        int total = 0;
        // 逐类型独立 try：某一类归档失败（例如归档表被 DBA 临时锁了）不应拖垮其他类型
        try {
            total += archiveOperLog();
        } catch (Exception e) {
            log.error("操作日志归档失败", e);
        }
        try {
            total += archiveLoginLog();
        } catch (Exception e) {
            log.error("登录日志归档失败", e);
        }
        log.info("审计日志归档完成，本次共归档 {} 条", total);
        return total;
    }

    /**
     * 归档超过保留期的操作日志
     *
     * @return 归档条数
     */
    @Override
    public int archiveOperLog() {
        Date deadline = calcDeadline();
        int total = 0;
        for (int round = 0; round < MAX_BATCH_ROUNDS; round++) {
            // 跨租户读取：归档是系统级维护动作，不能只处理当前租户
            List<SysOperLog> batch = TenantHelper.ignore(
                () -> operLogDao.listBeforeTime(deadline, BATCH_SIZE));
            if (CollUtil.isEmpty(batch)) {
                break;
            }
            total += doArchiveOperLog(batch);
            // 不足一批说明已经取完，不必再进下一轮
            if (batch.size() < BATCH_SIZE) {
                break;
            }
        }
        if (total > 0) {
            log.info("操作日志归档 {} 条（保留期 {} 天，界限 {}）", total, getRetainDays(), deadline);
        }
        return total;
    }

    /**
     * 归档超过保留期的登录日志
     *
     * @return 归档条数
     */
    @Override
    public int archiveLoginLog() {
        Date deadline = calcDeadline();
        int total = 0;
        for (int round = 0; round < MAX_BATCH_ROUNDS; round++) {
            List<SysLoginLog> batch = TenantHelper.ignore(
                () -> loginLogDao.listBeforeTime(deadline, BATCH_SIZE));
            if (CollUtil.isEmpty(batch)) {
                break;
            }
            total += doArchiveLoginLog(batch);
            if (batch.size() < BATCH_SIZE) {
                break;
            }
        }
        if (total > 0) {
            log.info("登录日志归档 {} 条（保留期 {} 天，界限 {}）", total, getRetainDays(), deadline);
        }
        return total;
    }

    /**
     * 把指定的操作日志搬入归档表后再从主表删除
     *
     * @param operIds 要归档的日志主键；为空表示归档主表全部数据
     * @return 实际归档并从主表移除的条数
     */
    @Override
    public int archiveAndRemoveOperLog(Collection<Long> operIds) {
        int total = 0;
        for (int round = 0; round < MAX_BATCH_ROUNDS; round++) {
            List<SysOperLog> batch = TenantHelper.ignore(
                () -> operLogDao.listForArchive(operIds, BATCH_SIZE));
            if (CollUtil.isEmpty(batch)) {
                break;
            }
            total += doArchiveOperLog(batch);
            if (batch.size() < BATCH_SIZE) {
                break;
            }
        }
        log.info("操作日志清空转归档 {} 条", total);
        return total;
    }

    /**
     * 把指定的登录日志搬入归档表后再从主表删除
     *
     * @param infoIds 要归档的日志主键；为空表示归档主表全部数据
     * @return 实际归档并从主表移除的条数
     */
    @Override
    public int archiveAndRemoveLoginLog(Collection<Long> infoIds) {
        int total = 0;
        for (int round = 0; round < MAX_BATCH_ROUNDS; round++) {
            List<SysLoginLog> batch = TenantHelper.ignore(
                () -> loginLogDao.listForArchive(infoIds, BATCH_SIZE));
            if (CollUtil.isEmpty(batch)) {
                break;
            }
            total += doArchiveLoginLog(batch);
            if (batch.size() < BATCH_SIZE) {
                break;
            }
        }
        log.info("登录日志清空转归档 {} 条", total);
        return total;
    }

    /**
     * 分页查询操作日志归档（只读）
     *
     * @param bo        查询条件
     * @param pageQuery 分页参数
     * @return 分页结果
     */
    @Override
    public PageResult<SysOperLogVo> pageOperLogArchives(SysOperLogBo bo, PageQuery pageQuery) {
        return operLogArchiveDao.pageArchives(bo, pageQuery).convert(SysOperLogVo.class);
    }

    /**
     * 分页查询登录日志归档（只读）
     *
     * @param bo        查询条件
     * @param pageQuery 分页参数
     * @return 分页结果
     */
    @Override
    public PageResult<SysLoginLogVo> pageLoginLogArchives(SysLoginLogBo bo, PageQuery pageQuery) {
        return loginLogArchiveDao.pageArchives(bo, pageQuery).convert(SysLoginLogVo.class);
    }

    /**
     * 搬移一批操作日志：先写归档表，成功后再删主表，同一事务
     *
     * @param batch 本批数据
     * @return 搬移条数
     */
    @Transactional(rollbackFor = Exception.class)
    public int doArchiveOperLog(List<SysOperLog> batch) {
        Date now = DateUtils.getNowDate();
        List<SysOperLogArchive> archives = new ArrayList<>(batch.size());
        List<Long> ids = new ArrayList<>(batch.size());
        for (SysOperLog source : batch) {
            SysOperLogArchive archive = MapstructUtils.convert(source, SysOperLogArchive.class);
            if (archive == null) {
                continue;
            }
            archive.setArchiveTime(now);
            archives.add(archive);
            ids.add(source.getOperId());
        }
        if (archives.isEmpty()) {
            return 0;
        }
        return TenantHelper.ignore(() -> {
            operLogArchiveDao.batchInsert(archives);
            operLogDao.deleteByIds(ids);
            return archives.size();
        });
    }

    /**
     * 搬移一批登录日志
     *
     * @param batch 本批数据
     * @return 搬移条数
     */
    @Transactional(rollbackFor = Exception.class)
    public int doArchiveLoginLog(List<SysLoginLog> batch) {
        Date now = DateUtils.getNowDate();
        List<SysLoginLogArchive> archives = new ArrayList<>(batch.size());
        List<Long> ids = new ArrayList<>(batch.size());
        for (SysLoginLog source : batch) {
            SysLoginLogArchive archive = MapstructUtils.convert(source, SysLoginLogArchive.class);
            if (archive == null) {
                continue;
            }
            archive.setArchiveTime(now);
            archives.add(archive);
            ids.add(source.getInfoId());
        }
        if (archives.isEmpty()) {
            return 0;
        }
        return TenantHelper.ignore(() -> {
            loginLogArchiveDao.batchInsert(archives);
            loginLogDao.deleteByIds(ids);
            return archives.size();
        });
    }

    /**
     * 计算归档时间界限：早于该时间的日志会被搬走
     *
     * @return 时间界限
     */
    private Date calcDeadline() {
        int retainDays = getRetainDays();
        long deadlineMillis = System.currentTimeMillis() - TimeUnit.DAYS.toMillis(retainDays);
        return new Date(deadlineMillis);
    }

    /**
     * 读取保留天数，缺失或非法时退回默认值
     * <p>
     * 这个兜底不能省：多租户下新建租户可能没有该参数，
     * 取不到时若直接 parseInt 会抛异常，把整个归档任务打挂。
     *
     * @return 保留天数，至少 1 天
     */
    private int getRetainDays() {
        String value;
        try {
            value = configService.getConfigByKey(KEY_RETAIN_DAYS);
        } catch (Exception e) {
            log.warn("读取日志保留天数参数失败，使用默认值 {}", DEFAULT_RETAIN_DAYS, e);
            return DEFAULT_RETAIN_DAYS;
        }
        if (StringUtils.isBlank(value)) {
            return DEFAULT_RETAIN_DAYS;
        }
        try {
            int days = Integer.parseInt(value.trim());
            // 保留天数被误配成 0 或负数时，会把「今天的日志」也归档掉 —— 这是灾难性的，
            // 因此设下限 1 天，宁可归档得不够及时，也不能误删刚产生的审计记录
            return Math.max(days, 1);
        } catch (NumberFormatException e) {
            log.warn("日志保留天数参数 [{}] 不是合法整数，使用默认值 {}", value, DEFAULT_RETAIN_DAYS);
            return DEFAULT_RETAIN_DAYS;
        }
    }
}
