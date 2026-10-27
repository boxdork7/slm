package plus.ruoyi.common.web.filter;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import plus.ruoyi.common.core.field.FieldPermissionHelper;

import java.io.IOException;

/**
 * 字段权限请求级上下文清理过滤器
 *
 * <p>唯一职责：请求结束（含异常路径）时调用 {@link FieldPermissionHelper#clear()}，
 * 清掉本请求在 ThreadLocal 里落的档位快照 / 脱敏策略表 / 被忽略字段清单。</p>
 *
 * <p>为什么必须有它：Web 容器线程池复用，不清理会让 A 用户的快照留给下一个复用该线程的 B 用户——
 * B 读到 A 的字段档位，这是字段权限最危险且最难复现的 bug 形态。
 * 放在 finally 里而不是正常路径末尾，是因为业务抛异常时也必须清。</p>
 *
 * <p>不做任何"预加载"：快照按资源懒加载，请求里没碰到受控 VO 就零开销。</p>
 */
public class FieldPermissionContextFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
        throws IOException, ServletException {
        try {
            chain.doFilter(request, response);
        } finally {
            FieldPermissionHelper.clear();
        }
    }
}