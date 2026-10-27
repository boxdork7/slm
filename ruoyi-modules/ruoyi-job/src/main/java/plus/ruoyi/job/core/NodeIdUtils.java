package plus.ruoyi.job.core;

import cn.hutool.core.net.NetUtil;
import plus.ruoyi.common.core.utils.SpringUtils;
import plus.ruoyi.common.core.utils.StringUtils;

/**
 * 节点标识工具：返回当前应用节点的唯一标识。
 * <p>
 * 该标识不只是给人看的日志字段，它还参与<b>广播模式的并发控制</b>——
 * {@code JobInvoker#buildRunningKey} 会把它拼进「执行中」锁的 key 以按节点隔离。
 * 一旦两个节点算出相同标识，广播任务会退化成只有一个节点真正执行，且不报任何错。
 * <p>
 * 因此取值按以下优先级，确保各类部署形态下都唯一：
 * <ol>
 *   <li>系统属性/环境变量显式指定（运维兜底）；</li>
 *   <li>{@code HOSTNAME} 环境变量：Docker 下是容器 ID、K8s 下是 Pod 名，天然唯一；</li>
 *   <li>本机 IP：仅裸机/host 网络下可靠。</li>
 * </ol>
 * 最后统一拼上端口，区分同一主机上的多实例。
 * <p>
 * <b>为什么不能只用 IP</b>：Docker 默认 bridge 网络下，不同宿主机上的容器 IP 普遍都是
 * {@code 172.17.0.2}，端口也相同，三个节点会算出完全一样的标识。
 *
 * @author 抓蛙师
 */
public final class NodeIdUtils {

    /**
     * 显式指定节点标识的系统属性名（同名环境变量亦可，如 {@code RUOYI_JOB_NODE_ID}）
     */
    public static final String NODE_ID_PROPERTY = "ruoyi.job.node-id";

    /**
     * 容器环境普遍注入的主机名变量：Docker=容器ID，K8s=Pod名
     */
    private static final String HOSTNAME_ENV = "HOSTNAME";

    /**
     * 节点标识最大长度，对齐 job_log.execute_node 列宽 varchar(64)
     */
    private static final int MAX_LENGTH = 64;

    private NodeIdUtils() {
    }

    /**
     * 获取当前节点标识。
     *
     * @return 形如 {@code 主机标识:端口}，长度不超过 64
     */
    public static String current() {
        String explicit = System.getProperty(NODE_ID_PROPERTY, System.getenv("RUOYI_JOB_NODE_ID"));
        if (StringUtils.isNotBlank(explicit)) {
            return truncate(explicit.trim());
        }
        String port = SpringUtils.context().getEnvironment().getProperty("server.port", "8080");
        return truncate(resolveHost() + ":" + port);
    }

    /**
     * 解析主机标识：容器环境优先用 HOSTNAME（唯一），否则回退本机 IP。
     *
     * @return 主机标识
     */
    private static String resolveHost() {
        String hostname = System.getenv(HOSTNAME_ENV);
        if (StringUtils.isNotBlank(hostname)) {
            return hostname.trim();
        }
        return NetUtil.getLocalhostStr();
    }

    /**
     * 超长截断，避免写入 job_log.execute_node 时报字段超长
     * （K8s Pod 名 + 命名空间前缀可能很长）。
     *
     * @param nodeId 原始标识
     * @return 截断后的标识
     */
    private static String truncate(String nodeId) {
        return nodeId.length() <= MAX_LENGTH ? nodeId : nodeId.substring(0, MAX_LENGTH);
    }
}
