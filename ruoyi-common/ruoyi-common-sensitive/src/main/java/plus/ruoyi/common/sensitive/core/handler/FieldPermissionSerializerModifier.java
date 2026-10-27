package plus.ruoyi.common.sensitive.core.handler;

import com.fasterxml.jackson.databind.BeanDescription;
import com.fasterxml.jackson.databind.SerializationConfig;
import com.fasterxml.jackson.databind.introspect.AnnotatedMember;
import com.fasterxml.jackson.databind.ser.BeanPropertyWriter;
import com.fasterxml.jackson.databind.ser.BeanSerializerModifier;
import lombok.extern.slf4j.Slf4j;
import plus.ruoyi.common.core.field.FieldClassType;
import plus.ruoyi.common.core.field.FieldResource;

import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

/**
 * 字段权限 Jackson 序列化拦截器
 *
 * <p>把标了 {@link FieldResource}（且类角色为读出口 VO）的类的全部属性包装成
 * {@link FieldPermissionPropertyWriter}，由后者在写出每个属性时按当前用户档位决定隐藏 / 打码 / 明文。</p>
 *
 * <p><b>未标注解的类零开销</b>：{@code changeProperties} 是 Jackson 按类调用一次、结果被永久缓存的方法，
 * 未标注解的类直接原样返回，之后的每次序列化根本不进这段代码——不是"开销小"，是后续请求完全不经过。</p>
 *
 * <p><b>为什么用类上的注解而不是查库</b>：注解是资源归属的源头（库表只是扫描器的镜像）。
 * 查库会带来启动顺序依赖——若某次序列化早于扫描器完成，就会把该类永久缓存成"未注册"，
 * 留下一个直到重启才消失的放行缺口。读注解没有这个时序问题，也不产生任何 IO。</p>
 *
 * <p><b>为什么只拦 VO</b>：BO / ImportVo 是写入口，不经 JSON 序列化输出，由写入拦截负责。</p>
 */
@Slf4j
public class FieldPermissionSerializerModifier extends BeanSerializerModifier {

    /**
     * SerialMap 注解全限定名。用字符串反射匹配而不是直接 import：
     * 本模块（sensitive）不依赖 ruoyi-common-serialmap，为一个防御性联动引入重量级模块依赖不划算
     */
    private static final String SERIAL_MAP_ANNOTATION = "plus.ruoyi.common.serialmap.annotation.SerialMap";

    @Override
    public List<BeanPropertyWriter> changeProperties(SerializationConfig config, BeanDescription beanDesc,
                                                     List<BeanPropertyWriter> beanProperties) {
        FieldResource resource = beanDesc.getBeanClass().getAnnotation(FieldResource.class);
        // 未标注解、或不是读出口 VO → 原样返回，该类后续序列化不再进入本拦截器
        if (resource == null || resource.type() != FieldClassType.VO) {
            return beanProperties;
        }
        String resourceKey = resource.value();
        if (resourceKey == null || resourceKey.isBlank()) {
            log.warn("字段权限：{} 的 @FieldResource 未填资源标识，JSON 出口不拦截", beanDesc.getBeanClass().getName());
            return beanProperties;
        }

        List<BeanPropertyWriter> wrapped = new ArrayList<>(beanProperties.size());
        for (BeanPropertyWriter writer : beanProperties) {
            AnnotatedMember member = writer.getMember();
            SerialMapInfo info = resolveSerialMap(member);
            wrapped.add(new FieldPermissionPropertyWriter(writer, resourceKey, info.sourceField(), info.present()));
        }
        return wrapped;
    }

    /**
     * 反射解析字段上的 {@code @SerialMap}，取出 {@code source} 属性
     *
     * <p>{@code @SerialMap(source = "userId")} 表示本属性的值派生自 userId。
     * 若 userId 被隐藏而本属性照常输出，就等于开了一条派生泄露通道，因此需要联动。
     * 解析只在 {@code changeProperties} 期做一次（按类缓存），不进逐字段热路径。</p>
     */
    private SerialMapInfo resolveSerialMap(AnnotatedMember member) {
        if (member == null) {
            return SerialMapInfo.ABSENT;
        }
        for (Annotation annotation : member.annotations()) {
            if (!SERIAL_MAP_ANNOTATION.equals(annotation.annotationType().getName())) {
                continue;
            }
            try {
                Method sourceMethod = annotation.annotationType().getMethod("source");
                Object source = sourceMethod.invoke(annotation);
                if (source instanceof String str && !str.isBlank()) {
                    return new SerialMapInfo(true, str);
                }
            } catch (ReflectiveOperationException e) {
                // 注解结构变了（改名/删属性）只影响派生联动这一项防御，不该拖垮序列化
                log.warn("字段权限：解析 @SerialMap.source 失败，跳过派生字段联动 => {}", e.getMessage());
            }
            return new SerialMapInfo(true, null);
        }
        return SerialMapInfo.ABSENT;
    }

    /**
     * SerialMap 解析结果
     *
     * @param present     字段是否带 @SerialMap
     * @param sourceField source 属性值，无则为 null
     */
    private record SerialMapInfo(boolean present, String sourceField) {
        private static final SerialMapInfo ABSENT = new SerialMapInfo(false, null);
    }
}