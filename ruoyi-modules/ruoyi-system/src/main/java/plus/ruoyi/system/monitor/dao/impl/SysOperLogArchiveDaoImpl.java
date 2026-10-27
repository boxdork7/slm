package plus.ruoyi.system.monitor.dao.impl;

import cn.hutool.core.collection.CollUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import plus.ruoyi.common.core.utils.StringUtils;
import plus.ruoyi.common.mybatis.core.page.PageQuery;
import plus.ruoyi.common.mybatis.core.page.PageResult;
import plus.ruoyi.common.mybatis.core.query.PlusLambdaQuery;
import plus.ruoyi.system.monitor.dao.ISysOperLogArchiveDao;
import plus.ruoyi.system.monitor.domain.SysOperLogArchive;
import plus.ruoyi.system.monitor.domain.bo.SysOperLogBo;
import plus.ruoyi.system.monitor.mapper.SysOperLogArchiveMapper;

import java.util.Collection;
import java.util.Map;

/**
 * SysOperLog归档数据访问实现
 * <p>
 * 直接持有 Mapper 而非继承 BaseDaoImpl —— 继承会把 delete 系列方法带进实现类，
 * 与本归档表「不可删除」的定位相悖（见 {@link ISysOperLogArchiveDao} 的说明）。
 *
 * @author 抓蛙师
 */
@Repository
@RequiredArgsConstructor
public class SysOperLogArchiveDaoImpl implements ISysOperLogArchiveDao {

    private final SysOperLogArchiveMapper archiveMapper;

    /**
     * 批量写入归档记录
     *
     * @param entities 待归档的实体集合，为空时直接返回 0
     * @return 实际写入条数
     */
    @Override
    public int batchInsert(Collection<SysOperLogArchive> entities) {
        if (CollUtil.isEmpty(entities)) {
            return 0;
        }
        int count = 0;
        for (SysOperLogArchive entity : entities) {
            count += archiveMapper.insert(entity);
        }
        return count;
    }

    /**
     * 分页查询归档记录（只读）
     * <p>
     * 查询条件与主表 SysOperLogDaoImpl.buildQueryWrapper 保持一致，
     * 这样用户从主表切到归档表时，同一套筛选条件的行为不会变。
     *
     * @param bo        查询条件
     * @param pageQuery 分页参数
     * @return 分页结果，按操作时间倒序
     */
    @Override
    public PageResult<SysOperLogArchive> pageArchives(SysOperLogBo bo, PageQuery pageQuery) {
        Map<String, Object> params = bo.getParams();
        PlusLambdaQuery<SysOperLogArchive> lqw = PlusLambdaQuery.of(SysOperLogArchive.class)
            .like(SysOperLogArchive::getOperIp, bo.getOperIp())
            .like(SysOperLogArchive::getTitle, bo.getTitle())
            .in(SysOperLogArchive::getOperType, StringUtils.splitToList(bo.getOperType()))
            .eq(SysOperLogArchive::getStatus, bo.getStatus())
            .like(SysOperLogArchive::getOperName, bo.getOperName())
            .between(SysOperLogArchive::getOperTime, params.get("beginTime"), params.get("endTime"));
        // 模糊搜索（跨数据库兼容：String 类型用 like，非 String 类型用 likeCast）
        String searchValue = bo.getSearchValue();
        if (StringUtils.isNotBlank(searchValue)) {
            lqw.and(w -> w
                .like(SysOperLogArchive::getTitle, searchValue)             // String
                .or().like(SysOperLogArchive::getOperName, searchValue)     // String
                .or().like(SysOperLogArchive::getOperIp, searchValue)       // String
                .or().like(SysOperLogArchive::getOperLocation, searchValue) // String
                .or().likeCast(SysOperLogArchive::getOperId, searchValue)); // Long
        }
        // 归档数据是冷数据，默认按操作时间倒序 —— 追溯时总是先看最近的
        lqw.orderByDesc(SysOperLogArchive::getOperTime);

        Page<SysOperLogArchive> page = archiveMapper.selectPage(pageQuery.build(), lqw);
        return PageResult.of(page);
    }
}
