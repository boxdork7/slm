package plus.ruoyi.system.monitor.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import plus.ruoyi.system.monitor.domain.SysOperLogArchive;

/**
 * SysOperLog归档 Mapper接口
 * <p>
 * 只用于归档任务写入，不对外暴露任何查询/删除接口（等保 8.1.4.3 c）。
 *
 * @author 抓蛙师
 */
public interface SysOperLogArchiveMapper extends BaseMapper<SysOperLogArchive> {
    // 无需额外方法，归档只做批量插入
}
