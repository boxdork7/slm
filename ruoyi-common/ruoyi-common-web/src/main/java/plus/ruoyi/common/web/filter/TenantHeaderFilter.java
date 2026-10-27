package plus.ruoyi.common.web.filter;

import cn.hutool.http.HttpStatus;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import plus.ruoyi.common.core.constant.I18nKeys;
import plus.ruoyi.common.core.constant.TenantConstants;
import plus.ruoyi.common.core.domain.R;
import plus.ruoyi.common.core.utils.MessageUtils;
import plus.ruoyi.common.core.utils.StringUtils;
import plus.ruoyi.common.json.utils.JsonUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.regex.Pattern;

/**
 * 租户请求头校验过滤器
 * <p>
 * 在请求进入业务逻辑之前校验 {@code X-Tenant-Id} 请求头的格式，不合法直接返回 400。
 * <p>
 * 为什么必须在过滤器这一层拦：租户ID最终会被 PlusTenantLineHandler 以 SQL 字符串
 * 字面量的形式拼进 SQL 文本（JSqlParser 的 StringValue 不转义单引号），而不是作为
 * PreparedStatement 参数传入。也就是说带引号的请求头能闭合字面量形成 SQL 注入，
 * 且未登录请求（登录、验证码等 {@code @SaIgnore} 接口）恰好是读取该请求头的主要场景，
 * 攻击面无需任何凭据即可触达。把校验放在最外层，可以让非法请求在碰到任何 SQL 之前
 * 就被挡掉，并给出明确的 400 而不是 500。
 * <p>
 * Service 层（{@code getTenantIdByRequest}）与 SQL 生成层（{@code PlusTenantLineHandler}）
 * 各自还有一道同样规则的校验，构成三层纵深防御：本过滤器负责拒绝外部请求，
 * 后两层负责防住"将来新增了未经校验的租户ID来源"这类回归。
 *
 * @author 抓蛙师
 */
@Slf4j
public class TenantHeaderFilter implements Filter {

    /**
     * 租户ID请求头名称（与前端 useHttp 中的写入保持一致）
     */
    private static final String TENANT_HEADER = "X-Tenant-Id";

    /**
     * 租户ID格式校验器（预编译复用，每个请求都会走到，不能每次重新编译正则）
     */
    private static final Pattern TENANT_ID_PATTERN = Pattern.compile(TenantConstants.TENANT_ID_REGEX);

    /**
     * 日志中租户ID的最大保留长度，防止超长载荷刷爆日志
     */
    private static final int LOG_VALUE_MAX_LENGTH = 32;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
        throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        String tenantId = req.getHeader(TENANT_HEADER);

        // 请求头缺省是正常情况（PC 端默认租户、非多租户部署都不带该头），只校验带了值的情况
        if (StringUtils.isNotBlank(tenantId) && !TENANT_ID_PATTERN.matcher(tenantId).matches()) {
            rejectRequest(req, (HttpServletResponse) response, tenantId);
            return;
        }

        chain.doFilter(request, response);
    }

    /**
     * 拒绝非法请求，返回 400 与统一响应体
     *
     * @param request  HTTP请求，用于日志中定位被攻击的接口
     * @param response HTTP响应
     * @param tenantId 客户端传入的非法租户ID，仅用于日志（已做截断与换行清理）
     */
    private void rejectRequest(HttpServletRequest request, HttpServletResponse response, String tenantId)
        throws IOException {
        log.warn("请求头 {} 格式非法，已拒绝请求 => URL[{}] value[{}]",
            TENANT_HEADER, request.getRequestURI(), sanitizeForLog(tenantId));

        response.setStatus(HttpStatus.HTTP_BAD_REQUEST);
        response.setContentType("application/json");
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.getWriter().write(JsonUtils.toJsonString(
            R.fail(HttpStatus.HTTP_BAD_REQUEST, MessageUtils.message(I18nKeys.Tenant.ID_INVALID))));
    }

    /**
     * 清理日志中的不可信值：截断超长内容并替换换行符
     * <p>
     * 该值完全由客户端控制，直接打印会被用来伪造日志行（CRLF 注入）或刷爆日志文件。
     *
     * @param value 原始值
     * @return 可安全写入日志的值
     */
    private String sanitizeForLog(String value) {
        String result = value.length() > LOG_VALUE_MAX_LENGTH
            ? value.substring(0, LOG_VALUE_MAX_LENGTH) + "..."
            : value;
        return result.replace('\r', '_').replace('\n', '_');
    }
}
