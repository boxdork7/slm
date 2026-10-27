package plus.ruoyi.job.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import plus.ruoyi.job.core.JobHandlerRegistry;
import plus.ruoyi.job.core.JobInvoker;
import plus.ruoyi.job.core.JobScheduler;

/**
 * 内置调度器自动装配。
 * <p>
 * 仅当 {@code ruoyi.job.enabled=true} 时生效，装配调度引擎的三个核心 Bean。
 * 四层 CRUD 的 @Repository/@Service/@RestController 由组件扫描接管，不在此声明。
 *
 * @author 抓蛙师
 */
@Configuration
@EnableConfigurationProperties(JobProperties.class)
@ConditionalOnProperty(prefix = "ruoyi.job", name = "enabled", havingValue = "true")
public class JobAutoConfiguration {

    @Bean
    public JobHandlerRegistry jobHandlerRegistry() {
        return new JobHandlerRegistry();
    }

    @Bean
    public JobInvoker jobInvoker() {
        return new JobInvoker();
    }

    @Bean
    public JobScheduler jobScheduler() {
        return new JobScheduler();
    }
}
