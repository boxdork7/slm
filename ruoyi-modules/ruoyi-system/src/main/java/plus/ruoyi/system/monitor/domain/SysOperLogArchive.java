package plus.ruoyi.system.monitor.domain;

import com.baomidou.mybatisplus.annotation.TableName;
import io.github.linpeilie.annotations.AutoMapper;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serial;
import java.util.Date;

/**
 * 操作日志归档表 sys_oper_log_archive
 * <p>
 * 等保二级 8.1.4.3 c「应对审计记录进行保护，避免受到未预期的删除、修改或覆盖」。
 * <p>
 * <b>刻意继承 {@link SysOperLog} 而不是复制字段</b>：归档表与主表结构必须始终一致，
 * 继承之后主表将来新增字段，归档表自动跟上，不会出现两边字段漂移导致归档丢数据。
 * <p>
 * <b>本类刻意不提供 Controller / DAO</b>：没有对外接口正是「防未预期删除」的实现本身，
 * 想删只能 DBA 直连数据库，而该动作会留在数据库自身的审计里。
 *
 * @author 抓蛙师
 */
@Data
@EqualsAndHashCode(callSuper = true)
@AutoMapper(target = SysOperLog.class)
@TableName("sys_oper_log_archive")
public class SysOperLogArchive extends SysOperLog {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 归档时间
     */
    private Date archiveTime;
}
