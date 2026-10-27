package plus.ruoyi.system.monitor.domain;

import com.baomidou.mybatisplus.annotation.TableName;
import io.github.linpeilie.annotations.AutoMapper;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serial;
import java.util.Date;

/**
 * 登录日志归档表 sys_login_log_archive
 * <p>
 * 等保二级 8.1.4.3 c 审计记录保护。设计同 {@link SysOperLogArchive}：
 * 继承主表实体保证结构一致，且不提供任何对外删除接口。
 * <p>
 * 注意本项目登录日志主表名是 sys_login_log，不是原版 RuoYi 的 sys_logininfor。
 *
 * @author 抓蛙师
 */
@Data
@EqualsAndHashCode(callSuper = true)
@AutoMapper(target = SysLoginLog.class)
@TableName("sys_login_log_archive")
public class SysLoginLogArchive extends SysLoginLog {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 归档时间
     */
    private Date archiveTime;
}
