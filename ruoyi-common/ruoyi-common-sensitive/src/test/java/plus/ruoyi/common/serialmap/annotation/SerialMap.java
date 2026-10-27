package plus.ruoyi.common.serialmap.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * {@code @SerialMap} 测试桩
 *
 * <p>本模块（ruoyi-common-sensitive）刻意不依赖 ruoyi-common-serialmap——为一个防御性的派生字段联动
 * 引入那条重量级依赖（它带 redis / mybatis / oss）不划算，因此
 * {@code FieldPermissionSerializerModifier} 用<b>全限定名字符串</b>反射匹配该注解。</p>
 *
 * <p>要测这条反射路径，就必须在测试类路径上有一个<b>同全限定名</b>的注解。
 * 本类只保留被反射读取的 {@code source} 属性，不含真实注解的其余属性与 Jackson 元注解。
 * 测试作用域不含 serialmap 模块，不会与真实注解冲突。</p>
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD, ElementType.METHOD})
public @interface SerialMap {

    /**
     * 被 FieldPermissionSerializerModifier 反射读取的属性：本字段的值派生自哪个字段
     */
    String source() default "";
}