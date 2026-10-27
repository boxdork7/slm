package plus.ruoyi.job.core;

import plus.ruoyi.common.mybatis.helper.DataPermissionHelper;

import java.util.function.Supplier;

/**
 * 「平台级上下文」：引擎自身读写 {@code job_info} / {@code job_log} 时绕开数据权限过滤。
 *
 * <p>引擎线程（调度扫描 / 业务执行池 / Redisson 消息分发 / 看门狗）都<b>没有登录态</b>，
 * 而 {@code PlusDataPermissionHandler} 取不到 {@code LoginUser} 时会拼一个 {@code 1=0} 的
 * 永假条件拒绝所有数据（其 warn 日志也明确要求用 ignore 包裹）——是「静默出错」而非报错。
 * 当前 job 的 DAO 未标注 {@code @DataPermission} 故尚未触发，但本项目是供下游二次开发的
 * 框架模板，一旦有人为「按部门查看任务」加上该注解，调度扫描会立刻查不到任何任务、
 * 任务日志会突然全部写不进去——表现为定时任务集体停摆，却只有一行 warn。</p>
 *
 * <p><b>为什么不需要 {@code TenantHelper.ignore}（多租户版本亦然，勿"补"回来）</b>：
 * 租户过滤有两条彼此独立的关闭路径——① 表级：{@code PlusTenantLineHandler.ignoreTable()}
 * 只读排除表集合，{@code job_info} / {@code job_log} 已硬编码进其
 * {@code SYSTEM_EXCLUDE_TABLES}；② 全局标志：{@code TenantHelper.ignore} 走
 * MyBatis-Plus 的 {@code InterceptorIgnoreHelper}，让拦截器整体跳过。路径 ① 已经生效，
 * 路径 ② 纯属冗余。且两张表<b>没有 tenant_id 列</b>，万一排除配置被破坏，SQL 会直接报
 * {@code Unknown column 'tenant_id'} 而立刻暴露；加上 ignore 反而会把这种配置损坏静默掩盖。</p>
 *
 * <p><b>绝不能用来包裹业务执行器的调用</b>——那会让业务代码的查询意外跨部门（多租户版还会跨租户）
 * 拿到全量数据。本类只覆盖引擎自身；业务执行是异步投递到线程池的，ThreadLocal 不会传递过去，
 * 需要按上下文过滤数据的执行器必须自行处理（多租户场景用
 * {@code TenantHelper.dynamic()} 遍历租户，样板见 {@code SampleJobHandler}）。</p>
 *
 * <p>本文件在全部分支逐字节一致：ruoyi-job 的分支差异只剩 {@code JobConstants} 中的键前缀。</p>
 *
 * @author 抓蛙师
 * @date 2026-08-10
 */
public final class JobPlatformContext {

    private JobPlatformContext() {
    }

    /**
     * 在平台级上下文中执行有返回值的数据访问。
     *
     * @param action 数据访问操作
     * @param <T>    返回值类型
     * @return 操作结果
     */
    public static <T> T call(Supplier<T> action) {
        return DataPermissionHelper.ignore(action);
    }

    /**
     * 在平台级上下文中执行无返回值的数据访问。
     *
     * @param action 数据访问操作
     */
    public static void run(Runnable action) {
        DataPermissionHelper.ignore(action);
    }
}
