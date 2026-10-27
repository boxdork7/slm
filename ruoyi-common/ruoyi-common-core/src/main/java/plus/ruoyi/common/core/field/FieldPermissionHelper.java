package plus.ruoyi.common.core.field;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * 字段权限请求级上下文（ThreadLocal）
 *
 * <p>两级快照：{@code resourceKey → (fieldName → FieldAccess)}。一个响应可能嵌套多个 VO
 * （如 SysUserInfoVo 内含 SysUserVo + List<SysRoleVo>），按资源分别缓存，同请求内同一资源只查一次 Redis。</p>
 *
 * <p>🔴 请求结束必须 {@link #clear()}：Web 容器线程池复用，不清理会串权（A 用户读到 B 用户的档位），
 * 这是本机制最危险且最难复现的 bug 形态。由 web 模块的 Filter 在 {@code finally} 中兜底，异常路径也走到。</p>
 *
 * <p>另附「被忽略字段」收集器：写入拦截把无权修改的字段重置为原值后，把中文标签记在这里，
 * 响应包装时追加到 {@code R.msg}，让用户知道"改了但没生效"，而不是当成系统丢数据。</p>
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class FieldPermissionHelper {

    private static final ThreadLocal<Map<String, Map<String, FieldAccess>>> SNAPSHOTS = new ThreadLocal<>();

    private static final ThreadLocal<Set<String>> IGNORED_FIELDS = new ThreadLocal<>();

    /**
     * 脱敏策略快照：resourceKey → (fieldName → SensitiveStrategy 枚举名)。与档位快照同生命周期
     */
    private static final ThreadLocal<Map<String, Map<String, String>>> STRATEGIES = new ThreadLocal<>();

    /**
     * 取某资源的脱敏策略表；未加载返回 null
     */
    public static Map<String, String> getStrategies(String resourceKey) {
        Map<String, Map<String, String>> all = STRATEGIES.get();
        return all == null ? null : all.get(resourceKey);
    }

    /**
     * 落某资源的脱敏策略表
     */
    public static void setStrategies(String resourceKey, Map<String, String> strategies) {
        Map<String, Map<String, String>> all = STRATEGIES.get();
        if (all == null) {
            all = new HashMap<>();
            STRATEGIES.set(all);
        }
        all.put(resourceKey, strategies == null ? new HashMap<>() : strategies);
    }

    /**
     * 取某资源的快照；本请求尚未加载返回 null（调用方据此决定是否回源）
     */
    public static Map<String, FieldAccess> getSnapshot(String resourceKey) {
        Map<String, Map<String, FieldAccess>> all = SNAPSHOTS.get();
        return all == null ? null : all.get(resourceKey);
    }

    /**
     * 落某资源的快照
     */
    public static void setSnapshot(String resourceKey, Map<String, FieldAccess> snapshot) {
        Map<String, Map<String, FieldAccess>> all = SNAPSHOTS.get();
        if (all == null) {
            all = new HashMap<>();
            SNAPSHOTS.set(all);
        }
        all.put(resourceKey, snapshot == null ? new HashMap<>() : snapshot);
    }

    /**
     * 记录一个被写入拦截忽略的字段（中文标签），同一请求内去重保序
     */
    public static void addIgnoredField(String label) {
        if (label == null || label.isEmpty()) {
            return;
        }
        Set<String> set = IGNORED_FIELDS.get();
        if (set == null) {
            set = new LinkedHashSet<>();
            IGNORED_FIELDS.set(set);
        }
        set.add(label);
    }

    /**
     * 取本请求被忽略的字段清单（拷贝），无则空列表
     */
    public static List<String> getIgnoredFields() {
        Set<String> set = IGNORED_FIELDS.get();
        return set == null ? new ArrayList<>() : new ArrayList<>(set);
    }

    /**
     * 清理全部请求级状态。必须在请求结束的 finally 中调用
     */
    public static void clear() {
        SNAPSHOTS.remove();
        STRATEGIES.remove();
        IGNORED_FIELDS.remove();
    }
}