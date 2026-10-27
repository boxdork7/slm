package plus.ruoyi.common.core.field;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 字段权限资源标记
 *
 * <p>标在 VO / BO / ImportVo 类上，声明该类归属哪个字段权限资源。
 * 启动时由扫描器读取并落库到 {@code sys_field_resource} / {@code sys_field_resource_class}。</p>
 *
 * <p>为什么用注解而不是后台手填类名：</p>
 * <ul>
 *   <li>开发者写新模块加一行注解，管理端自动出现该资源及其字段，不需要任何人接触全限定类名</li>
 *   <li>漏绑从"上线检查项"变成"grep 一下就看得出"</li>
 *   <li>类归属是代码结构元数据，随代码走而不是随租户走，新租户开通即受保护</li>
 * </ul>
 *
 * <p>使用约定：</p>
 * <pre>
 * @FieldResource("system:user")                            // 默认 type = VO
 * public class SysUserVo { ... }
 *
 * @FieldResource(value = "system:user", type = FieldClassType.BO)
 * public class SysUserBo { ... }
 *
 * @FieldResource(value = "system:user", type = FieldClassType.IMPORT)
 * public class SysUserImportVo { ... }
 * </pre>
 * <ul>
 *   <li>同一张表字段语义不同的类（如 {@code SysUserOnlineVo} 的 {@code ipaddr} vs {@code SysUserVo} 的 {@code loginIp}）
 *       标不同的资源标识，不要硬凑</li>
 *   <li>嵌套 VO（如 {@code SysUserInfoVo} 内含 {@code SysUserVo user}）<b>不标</b>：Jackson 序列化嵌套对象时走内层类自己的序列化器，自动继承保护</li>
 *   <li>一个类只能归属一个资源（库表 {@code uk_class_name} 约束），重复标注以后者为准并在启动日志 WARN</li>
 * </ul>
 *
 * <p>放在 core 模块：VO/BO 遍布 system 与全部业务模块，注解必须落在所有模块都能依赖的最底层；
 * 纯标记注解不引任何第三方类，不会把 core 拖重。</p>
 */
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface FieldResource {

    /**
     * 资源标识，与菜单权限前缀一致（如 {@code system:user}），管理员一看就懂
     */
    String value();

    /**
     * 类角色：决定该类喂给哪个出口，默认读出口 VO
     */
    FieldClassType type() default FieldClassType.VO;
}