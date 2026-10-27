package plus.ruoyi.common.core.field;

import java.util.Map;

/**
 * 字段权限决策服务
 *
 * <p>四个出口（JSON 序列化 / Excel 导出 / JSON 写入 / Excel 导入）共用的唯一决策入口，
 * 语义必须一致：同一用户在页面看不到的字段，导出也导不出、写入也改不了。</p>
 *
 * <p>为什么接口放 core：实测依赖层级为 {@code core ← json ← {excel, sensitive, web}}。
 * JSON 出口的序列化器住在 json 模块，若把接口放 sensitive，会与既有的 {@code sensitive → json} 撞成循环依赖。
 * 放最底层的 core（纯接口 + 枚举，不引第三方类），四个出口模块都能安全依赖。实现在 ruoyi-system。</p>
 *
 * <p>热路径约定：{@link #getAccess} 每字段每记录都会调用，实现必须只查 ThreadLocal 快照与缓存，
 * 禁止反射、禁止逐字段查库。</p>
 */
public interface IFieldPermissionService {

    /**
     * 全局开关是否开启。关闭时所有出口旁路，行为回退到无字段权限
     */
    boolean isEnabled();

    /**
     * 按类反查资源标识，并校验类角色
     *
     * <p>直接读类上的 {@link FieldResource} 注解，不查库：注解是资源归属的源头（库表只是扫描器的镜像），
     * 读它无 IO、也没有"调用早于扫描器完成"的时序风险——查库在扫描器就绪前会返回 null 而放行，
     * 对写入口就是一个启动期的越权窗口。</p>
     *
     * <p>要求类角色匹配，避免张冠李戴：BO 走写入拦截、VO 走读出口，
     * 传错类型说明调用方用错了出口，此时返回 null 比"按某个资源判档"更安全。</p>
     *
     * @param clazz    目标类
     * @param expected 期望的类角色
     * @return 资源标识；未标注解、注解为空、或类角色不匹配时返回 null，调用方按"放行"处理
     */
    String resolveResource(Class<?> clazz, FieldClassType expected);

    /**
     * 当前登录用户对某资源某字段的最终档位
     *
     * <p>合并规则：角色（多个）+ 部门（含 include_sub=1 的祖先）+ 用户本人，逐字段取最宽松；
     * 无差异行时回落「注解基线」（带 @Sensitive 的字段为脱敏，其余可写）。
     * 超管 / 未启用 / 未登录（如定时任务）一律返回 {@link FieldAccess#WRITABLE}——
     * 字段权限只约束"人"，无登录态的系统行为不该被它拦。</p>
     *
     * @param resourceKey 资源标识
     * @param fieldName   字段名（VO 属性名）
     * @return 档位，永不为 null
     */
    FieldAccess getAccess(String resourceKey, String fieldName);

    /**
     * 取字段的动态决策档位，<b>无动态决策时返回 null</b>
     *
     * <p>与 {@link #getAccess} 的区别在于能区分两种情况，这对 JSON 出口是关键：</p>
     * <ul>
     *   <li>返回 null = 没有任何动态决策 → 出口应<b>原样放行</b>，字段自身的 {@code @Sensitive} 照常生效</li>
     *   <li>返回 {@link FieldAccess#WRITABLE} = 管理员<b>显式放权</b> → 出口应<b>覆盖</b> {@code @Sensitive} 输出明文
     *       （典型场景：phone 带 @Sensitive，配置让 HR 角色看原值）</li>
     * </ul>
     *
     * <p>实现为一次 ThreadLocal Map 查询，可在逐字段热路径调用。</p>
     *
     * @return 档位；无动态决策返回 null
     */
    FieldAccess getDecision(String resourceKey, String fieldName);

    /**
     * 当前登录用户对某资源的完整快照（注解基线 + 各主体差异行合并后的结果）
     *
     * <p>🔴 快照只含「有动态决策」的字段，<b>包括显式放权为 WRITABLE 的字段</b>：
     * 带 @Sensitive 的字段基线是脱敏，被某主体配成可写后快照里是 WRITABLE，出口据此<b>覆盖</b>注解脱敏输出明文；
     * 快照里没有的字段表示"无动态决策"，出口回落到字段自身注解的行为。两者不能混——
     * 所以判"要不要覆盖注解"用 {@code containsKey}，判"档位是什么"用 {@link #getAccess}。</p>
     *
     * <p>超管 / 未登录 / 未启用返回空 Map（无动态决策，注解照常生效）。返回值是拷贝，调用方可随意修改。</p>
     *
     * @param resourceKey 资源标识
     * @return 字段名 → 档位；永不为 null
     */
    Map<String, FieldAccess> getSnapshot(String resourceKey);

    /**
     * 取字段的中文标签，用于面向用户的提示文案
     *
     * <p>只在"确有字段被写入拦截"时调用（正常操作不会命中），属低频路径，实现可用反射。
     * 取不到时返回字段名本身——提示里出现英文字段名总好过没有提示。</p>
     *
     * @return 中文标签；无从解析时返回 {@code fieldName}
     */
    String getFieldLabel(String resourceKey, String fieldName);

    /**
     * 字段档位为 {@link FieldAccess#MASKED} 时使用的脱敏策略名（SensitiveStrategy 枚举名）
     *
     * <p>档位只说"要打码"，不说"怎么打"。优先取配置行的 strategy；无配置（走注解基线）时返回 null，
     * 由出口回落到字段自身 @Sensitive 的策略，再没有则用通用掩码。</p>
     *
     * @return 策略枚举名；无配置返回 null
     */
    String getMaskStrategy(String resourceKey, String fieldName);
}