package plus.ruoyi.common.web.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import plus.ruoyi.common.web.aspect.FieldWriteGuardAspect;
import plus.ruoyi.common.web.handler.FieldWriteGuardAdvice;

/**
 * 字段权限 Web 层配置（写入口）
 *
 * <p>注册两个组件：</p>
 * <ul>
 *   <li>{@link FieldWriteGuardAspect} —— 写请求进入业务前，把无权修改的字段置 null</li>
 *   <li>{@link FieldWriteGuardAdvice} —— 把被拦截的字段追加到响应 msg，告知使用者</li>
 * </ul>
 *
 * <p>{@code field-permission.enabled=false} 时两者都不注册，写入口行为完全回到无字段权限的版本。
 * 与 JSON 出口（sensitive 模块）、决策服务（system 模块）共用同一个开关，一处关闭全链路旁路。</p>
 *
 * <p>请求级上下文的清理由 {@code FilterConfiguration} 里的 {@code FieldPermissionContextFilter} 负责，
 * 那个过滤器不受本开关控制——它只做 ThreadLocal 清理，关掉反而可能残留脏数据。</p>
 */
@Slf4j
@Configuration
@ConditionalOnProperty(prefix = "field-permission", name = "enabled", havingValue = "true", matchIfMissing = true)
public class FieldPermissionWebConfiguration {

    @Bean
    public FieldWriteGuardAspect fieldWriteGuardAspect() {
        log.info("字段权限写入拦截已启用");
        return new FieldWriteGuardAspect();
    }

    @Bean
    public FieldWriteGuardAdvice fieldWriteGuardAdvice() {
        return new FieldWriteGuardAdvice();
    }
}