package plus.ruoyi.system.core.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import plus.ruoyi.system.core.interceptor.PasswordPolicyInterceptor;

/**
 * 强制改密拦截器的注册配置（等保二级 8.1.4.1 a）
 * <p>
 * <b>为什么不并入 ruoyi-common-security 的 SecurityAutoConfiguration：</b>
 * 那个模块只依赖 ruoyi-common-satoken，而密码策略服务在 ruoyi-system。
 * 把拦截器塞进去会让通用模块反向依赖业务模块，破坏分层。
 * Spring 支持多个 WebMvcConfigurer 并存，这里单独注册一个即可，
 * 不影响既有的 Sa-Token 登录校验拦截器。
 * <p>
 * <b>执行顺序：</b>order 设为 10，排在 Sa-Token 登录拦截器（默认 0）之后。
 * 必须先确认「已登录」再判断「口令是否过期」，顺序颠倒会让未登录请求
 * 走进本拦截器并因取不到会话而被放行，白白多跑一次。
 *
 * @author 抓蛙师
 */
@Configuration
public class PasswordPolicyWebConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new PasswordPolicyInterceptor())
            .addPathPatterns("/**")
            // 静态资源与文档类路径不参与判定，避免无谓开销
            .excludePathPatterns("/resources/**", "/error", "/*/api-docs", "/*/api-docs/**")
            .order(10);
    }
}
