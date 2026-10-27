package plus.ruoyi.system.core.runner;

import cn.hutool.core.util.ClassUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import plus.ruoyi.common.core.constant.CacheNames;
import plus.ruoyi.common.core.field.FieldAccess;
import plus.ruoyi.common.core.field.FieldClassType;
import plus.ruoyi.common.core.field.FieldResource;
import plus.ruoyi.common.redis.utils.CacheUtils;
import plus.ruoyi.system.core.domain.vo.FieldMetaVo;
import plus.ruoyi.system.core.helper.FieldMetaResolver;
import plus.ruoyi.system.core.service.ISysFieldResourceService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * {@code @FieldResource} 启动扫描器
 *
 * <p>启动时扫描 {@code plus.ruoyi} 下所有标了 {@link FieldResource} 的类，完成四件事：</p>
 * <ol>
 *   <li>把「资源 → 类」关系落库到 sys_field_resource / sys_field_resource_class（资源已存在则只补绑定，不覆盖管理员改过的中文名）</li>
 *   <li>算好每个资源的「注解基线」写入 Redis：带 {@code @Sensitive} 的字段基线为脱敏，其余可写。
 *       为什么在这里算：基线来自反射，热路径禁止反射，只能启动期一次算完</li>
 *   <li>逻辑删除本次没扫到的自动登记绑定（代码里删了注解后重启，配置追溯仍保留）</li>
 *   <li>巡检：列出 domain 包下未标注解的 *Vo / *Bo 类打 WARN，与管理端 /scanUnregisteredClasses 同源</li>
 * </ol>
 *
 * <p>为什么用注解扫描替代后台手填类名：新模块加一行注解管理端就自动出现资源，租户管理员不再接触全限定类名，
 * 漏绑从"上线检查项"变成"grep 一下就看得出"。</p>
 *
 * <p>整个扫描包在 try/catch 里：表未建、Redis 未起等情况只记 ERROR 不拖垮启动——
 * 字段权限是增强能力，不该让它的元数据登记失败阻断整个系统。</p>
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class FieldResourceScanner implements ApplicationRunner {

    /**
     * 扫描根包：全项目 VO/BO 都在这个前缀下
     */
    private static final String SCAN_PACKAGE = "plus.ruoyi";

    private final ISysFieldResourceService fieldResourceService;

    /**
     * 是否在启动时巡检未标注解的 VO/BO。巡检要加载 domain 包下全部类，大项目可关掉改用管理端接口按需扫
     */
    @Value("${field-permission.scan-audit:true}")
    private boolean scanAudit;

    @Override
    public void run(ApplicationArguments args) {
        try {
            doScan();
        } catch (Exception e) {
            log.error("字段权限资源扫描失败，字段权限将按「未登记 = 放行」运行。请确认 sys_field_resource 系列表已建、Redis 可用 => {}",
                e.getMessage(), e);
        }
    }

    private void doScan() {
        Set<Class<?>> annotated = ClassUtil.scanPackageByAnnotation(SCAN_PACKAGE, FieldResource.class);

        // 先按资源分组：基线要合并同资源下全部 VO 的字段，不能逐类算
        Map<String, List<Class<?>>> voByResource = new LinkedHashMap<>();
        List<String> scannedClassNames = new ArrayList<>();
        int createdResources = 0;

        for (Class<?> clazz : annotated) {
            FieldResource fr = clazz.getAnnotation(FieldResource.class);
            String resourceKey = fr.value().trim();
            if (resourceKey.isEmpty()) {
                log.warn("字段权限：{} 的 @FieldResource 未填资源标识，跳过", clazz.getName());
                continue;
            }
            boolean created = fieldResourceService.registerFromAnnotation(resourceKey, clazz.getName(), fr.type());
            if (created) {
                createdResources++;
            }
            scannedClassNames.add(clazz.getName());
            if (fr.type() == FieldClassType.VO) {
                voByResource.computeIfAbsent(resourceKey, k -> new ArrayList<>()).add(clazz);
            }
        }

        int retired = fieldResourceService.retireMissingAutoBindings(scannedClassNames);
        writeBaselines(voByResource);
        Map<String, String> classResource = fieldResourceService.reloadClassResourceCache();

        log.info("字段权限资源扫描完成：{} 个类 / 新增资源 {} 个 / 失效绑定 {} 行 / 类反查缓存 {} 条",
            annotated.size(), createdResources, retired, classResource.size());

        if (scanAudit) {
            auditUnregistered(annotated);
        }
    }

    /**
     * 每个资源合并其全部读出口 VO 的字段，带 @Sensitive 的写为 MASKED 基线。
     * 只写差异（有注解的字段），无注解字段缺省即可写，与"表里只存差异行"的存储语义一致。
     */
    private void writeBaselines(Map<String, List<Class<?>>> voByResource) {
        for (Map.Entry<String, List<Class<?>>> entry : voByResource.entrySet()) {
            // 🔴 必须 new HashMap：不可变集合进 Redis 反序列化会失败（框架已知坑）
            Map<String, Integer> baseline = new HashMap<>();
            for (FieldMetaVo meta : FieldMetaResolver.resolveUnion(entry.getValue())) {
                // 非 String 字段上的 @Sensitive 实际不生效，基线也不该按脱敏算，否则会凭空锁住一个本来明文输出的字段
                if (Boolean.TRUE.equals(meta.getSensitive()) && !Boolean.TRUE.equals(meta.getAnnotationUncovered())) {
                    baseline.put(meta.getFieldName(), FieldAccess.MASKED.getCode());
                }
            }
            CacheUtils.put(CacheNames.SYS_FIELD_BASELINE, entry.getKey(), baseline);
        }
    }

    /**
     * 巡检 domain 包下未标注解的 Vo / Bo 类。只 WARN 不阻断：嵌套 VO（如 SysUserInfoVo）本就不该标，
     * 这里分不清"漏标"和"故意不标"，交给人判断。
     */
    private void auditUnregistered(Set<Class<?>> annotated) {
        Set<Class<?>> candidates = ClassUtil.scanPackage(SCAN_PACKAGE, clazz -> {
            String name = clazz.getName();
            String simple = clazz.getSimpleName();
            return name.contains(".domain.")
                && (simple.endsWith("Vo") || simple.endsWith("Bo"))
                && !clazz.isInterface()
                && !clazz.isEnum()
                && !annotated.contains(clazz);
        });
        if (candidates.isEmpty()) {
            return;
        }
        List<String> names = new ArrayList<>(candidates.size());
        for (Class<?> c : candidates) {
            names.add(c.getSimpleName());
        }
        names.sort(String::compareTo);
        log.warn("字段权限巡检：{} 个 VO/BO 未标 @FieldResource（嵌套 VO 可忽略；导出/导入 VO 漏标即为绕过通道）：{}",
            names.size(), names);
    }
}