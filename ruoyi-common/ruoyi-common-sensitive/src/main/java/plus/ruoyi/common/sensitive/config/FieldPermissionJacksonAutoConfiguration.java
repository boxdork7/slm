package plus.ruoyi.common.sensitive.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import plus.ruoyi.common.sensitive.core.handler.FieldPermissionSerializerModifier;

/**
 * 字段权限 JSON 出口自动配置
 *
 * <p>把 {@link FieldPermissionSerializerModifier} 注册进全局 ObjectMapper，
 * 使标了 {@code @FieldResource} 的 VO 在序列化时按当前用户档位隐藏 / 打码字段。</p>
 *
 * <p>用 {@code postConfigurer} 而不是 {@code builder.modules(...)}：后者是替换语义，
 * 与 {@code JsonAutoConfiguration} 里已有的 {@code builder.modules(javaTimeModule)} 会互相覆盖；
 * {@code postConfigurer} 作用在构建完成的 ObjectMapper 上，不参与模块列表竞争。</p>
 *
 * <p>与 {@code SerialMapConverterInitializer}（ApplicationRunner 期注册）无顺序依赖：
 * SerialMap 的拦截器不包装 writer，只对字段做 {@code assignNullSerializer}，
 * 而本拦截器的包装类经拷贝构造保留了原 writer 的序列化器，两种注册先后都能正确工作。</p>
 *
 * <p>{@code field-permission.enabled=false} 时整个拦截器不注册，行为完全回到无字段权限的版本，
 * 是线上出问题的一键止血开关（决策服务内部另有一道同名开关，双保险）。</p>
 */
@Slf4j
@AutoConfiguration
@ConditionalOnProperty(prefix = "field-permission", name = "enabled", havingValue = "true", matchIfMissing = true)
public class FieldPermissionJacksonAutoConfiguration {

    @Bean
    public Jackson2ObjectMapperBuilderCustomizer fieldPermissionCustomizer() {
        return builder -> builder.postConfigurer(objectMapper -> {
            objectMapper.setSerializerFactory(
                objectMapper.getSerializerFactory().withSerializerModifier(new FieldPermissionSerializerModifier()));
            log.info("字段权限 JSON 出口已启用");
        });
    }
}