package plus.ruoyi.system.monitor.dao.impl;

import cn.hutool.core.collection.CollUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import plus.ruoyi.common.core.utils.StringUtils;
import plus.ruoyi.common.mybatis.core.page.PageQuery;
import plus.ruoyi.common.mybatis.core.page.PageResult;
import plus.ruoyi.common.mybatis.core.query.PlusLambdaQuery;
import plus.ruoyi.system.monitor.dao.ISysLoginLogArchiveDao;
import plus.ruoyi.system.monitor.domain.SysLoginLogArchive;
import plus.ruoyi.system.monitor.domain.bo.SysLoginLogBo;
import plus.ruoyi.system.monitor.mapper.SysLoginLogArchiveMapper;

import java.util.Collection;
import java.util.Map;

/**
 * SysLoginLog归档数据访问实现
 * <p>
 * 直接持有 Mapper 而非继承 BaseDaoImpl —— 继承会把 delete 系列方法带进实现类，
 * 与本归档表「不可删除」的定位相悖（见 {@link ISysLoginLogArchiveDao} 的说明）。
 *
 * @author 抓蛙师
 */
@Repository
@RequiredArgsConstructor
public class SysLoginLogArchiveDaoImpl implements ISysLoginLogArchiveDao {

    private final SysLoginLogArchiveMapper archiveMapper;

    /**
     * 批量写入归档记录
     *
     * @param entities 待归档的实体集合，为空时直接返回 0
     * @return 实际写入条数
     */
    @Override
    public int batchInsert(Collection<SysLoginLogArchive> entities) {
        if (CollUtil.isEmpty(entities)) {
            return 0;
        }
        int count = 0;
        for (SysLoginLogArchive entity : entities) {
            count += archiveMapper.insert(entity);
        }
        return count;
    }

    /**
     * 分页查询归档记录（只读）
     * <p>
     * 查询条件与主表 SysLoginLogDaoImpl.buildQueryWrapper 保持一致。
     *
     * @param bo        查询条件
     * @param pageQuery 分页参数
     * @return 分页结果，按登录时间倒序
     */
    @Override
    public PageResult<SysLoginLogArchive> pageArchives(SysLoginLogBo bo, PageQuery pageQuery) {
        Map<String, Object> params = bo.getParams();
        PlusLambdaQuery<SysLoginLogArchive> lqw = PlusLambdaQuery.of(SysLoginLogArchive.class)
            .like(SysLoginLogArchive::getIpaddr, bo.getIpaddr())
            .eq(SysLoginLogArchive::getStatus, bo.getStatus())
            .like(SysLoginLogArchive::getUserName, bo.getUserName())
            .between(SysLoginLogArchive::getLoginTime, params.get("beginTime"), params.get("endTime"));
        // 模糊搜索（跨数据库兼容：String 类型用 like，非 String 类型用 likeCast）
        String searchValue = bo.getSearchValue();
        if (StringUtils.isNotBlank(searchValue)) {
            lqw.and(w -> w
                .like(SysLoginLogArchive::getUserName, searchValue)           // String
                .or().like(SysLoginLogArchive::getIpaddr, searchValue)        // String
                .or().like(SysLoginLogArchive::getLoginLocation, searchValue) // String
                .or().like(SysLoginLogArchive::getMsg, searchValue)           // String
                .or().likeCast(SysLoginLogArchive::getUserId, searchValue)    // Long
                .or().likeCast(SysLoginLogArchive::getInfoId, searchValue));  // Long
        }
        lqw.orderByDesc(SysLoginLogArchive::getLoginTime);

        Page<SysLoginLogArchive> page = archiveMapper.selectPage(pageQuery.build(), lqw);
        return PageResult.of(page);
    }
}
