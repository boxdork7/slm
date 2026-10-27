package plus.ruoyi.common.web.config;

import jakarta.servlet.DispatcherType;
import org.springframework.context.annotation.Configuration;
import plus.ruoyi.common.web.config.properties.XssProperties;
import plus.ruoyi.common.web.filter.FieldPermissionContextFilter;
import plus.ruoyi.common.web.filter.RepeatableFilter;
import plus.ruoyi.common.web.filter.TenantHeaderFilter;
import plus.ruoyi.common.web.filter.XssFilter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.servlet.FilterRegistration;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;

/**
 * Web过滤器配置类
 * <p>
 * 配置系统中的Web过滤器，包括XSS过滤器和可重复读取请求体的过滤器。
 * 过滤器按照优先级顺序执行。
 * </p>
 *
 * @author Lion Li
 */
@Configuration
@EnableConfigurationProperties(XssProperties.class)
public class FilterConfiguration {

    /**
     * 租户请求头校验过滤器
     * <p>
     * 校验 X-Tenant-Id 请求头格式，不合法直接返回 400。
     * 该请求头的值会被拼进 SQL 文本（详见 {@link TenantHeaderFilter} 类注释），
     * 属于必须无条件生效的安全校验，因此不提供开关配置。
     * 执行优先级：最高优先级，在任何其他过滤器与业务逻辑之前完成拦截。
     * </p>
     *
     * @return 租户请求头校验过滤器注册Bean
     */
    @Bean
    @FilterRegistration(
        name = "tenantHeaderFilter",
        urlPatterns = "/*",
        order = FilterRegistrationBean.HIGHEST_PRECEDENCE,
        dispatcherTypes = DispatcherType.REQUEST
    )
    public TenantHeaderFilter tenantHeaderFilter() {
        return new TenantHeaderFilter();
    }

    /**
     * XSS过滤器
     * <p>
     * 当配置xss.enabled=true时启用，用于防范XSS攻击。
     * 对请求参数和请求头进行XSS过滤处理，不直接读取请求体流。
     * 执行优先级：最高优先级+1
     * </p>
     *
     * @return XSS过滤器注册Bean
     */
    @Bean
    @ConditionalOnProperty(value = "xss.enabled", havingValue = "true")
    @FilterRegistration(
        name = "xssFilter",
        urlPatterns = "/*",
        order = FilterRegistrationBean.HIGHEST_PRECEDENCE + 1,
        dispatcherTypes = DispatcherType.REQUEST
    )
    public XssFilter xssFilter() {
        return new XssFilter();
    }

    /**
     * 可重复读取请求体过滤器
     * <p>
     * 允许多次读取HTTP请求体内容，解决流只能读取一次的问题。
     * 仅对Content-Type为application/json的请求进行处理。
     * 执行优先级：最低优先级，确保在其他过滤器处理完成后统一管理请求体流。order = FilterRegistrationBean.LOWEST_PRECEDENCE 默认值就是这个所以可以忽略
     * </p>
     *
     * @return 可重复读取过滤器注册Bean
     */
    @Bean
    @FilterRegistration(
        name = "repeatableFilter",
        urlPatterns = "/*"
    )
    public RepeatableFilter repeatableFilter() {
        return new RepeatableFilter();
    }

    /**
     * 字段权限请求级上下文清理过滤器
     * <p>
     * 请求结束（含异常路径）时清理 ThreadLocal 中的字段档位快照，防止线程池复用导致串权。
     * 执行优先级：最高优先级+2，排在租户头校验与 XSS 之后、所有业务之前，保证其 finally 包住整条业务链。
     * 不提供开关：它只做清理不做判定，field-permission.enabled=false 时快照本就为空，清理无副作用。
     * </p>
     *
     * @return 字段权限上下文过滤器注册Bean
     */
    @Bean
    @FilterRegistration(
        name = "fieldPermissionContextFilter",
        urlPatterns = "/*",
        order = FilterRegistrationBean.HIGHEST_PRECEDENCE + 2,
        dispatcherTypes = DispatcherType.REQUEST
    )
    public FieldPermissionContextFilter fieldPermissionContextFilter() {
        return new FieldPermissionContextFilter();
    }

}
