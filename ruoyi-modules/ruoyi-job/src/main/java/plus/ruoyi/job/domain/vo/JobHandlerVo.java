package plus.ruoyi.job.domain.vo;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * 已注册执行器视图对象（供新增任务时「执行器下拉」使用）。
 * <p>
 * 单独建 VO 而非直接返回引擎内部的 {@code JobHandlerRegistry.JobHandlerMeta}：
 * 后者是调度引擎的实现细节，直接充当 HTTP 响应体等于把引擎内部结构焊进对外 API 契约，
 * 日后重构引擎必然连带破坏前端。
 *
 * @author 抓蛙师
 */
@Data
public class JobHandlerVo implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 执行器标识（{@code @JobHandler} 的 value），任务的 invoke_target 填这个值
     */
    private String name;

    /**
     * 执行器描述，下拉框展示用
     */
    private String desc;

    /**
     * 建议的 cron 表达式，新增任务时可一键填入
     */
    private String sampleCron;

    public JobHandlerVo() {
    }

    public JobHandlerVo(String name, String desc, String sampleCron) {
        this.name = name;
        this.desc = desc;
        this.sampleCron = sampleCron;
    }
}
