package plus.ruoyi.system.core.helper;

import cn.hutool.core.util.ReflectUtil;
import cn.idev.excel.annotation.ExcelProperty;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import plus.ruoyi.common.core.field.FieldResource;
import plus.ruoyi.common.sensitive.annotation.Sensitive;
import plus.ruoyi.system.core.domain.vo.FieldMetaVo;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * VO 字段元数据反射解析器
 *
 * <p>输入一个标了 {@link FieldResource} 的类，输出可配置字段清单，供两处消费：</p>
 * <ul>
 *   <li>配置页左树选中资源后展示「字段 × 主体」矩阵的行</li>
 *   <li>启动扫描时计算「注解基线」（有 {@link Sensitive} 的字段基线为脱敏）</li>
 * </ul>
 *
 * <p>🔴 本类是反射，每次几十微秒，<b>绝不能进序列化热路径</b>——400 次判档就是 10ms+，
 * 比整套字段权限机制其余开销高一个数量级。热路径只准查 ThreadLocal 快照与注解基线缓存。</p>
 *
 * <p>为什么放 ruoyi-system 而不是 common：它要同时读 {@code @ExcelProperty}（excel 模块）与
 * {@code @Sensitive}（sensitive 模块），放任一 common 子模块都会拉出跨模块依赖；
 * 且它只服务管理端与启动期，放业务模块最干净。</p>
 *
 * <p>字段元数据不落库：杜绝"代码改了字段名、配置表没同步"的脏数据。结果按类缓存（VO 类不会热变）。</p>
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class FieldMetaResolver {

    private static final Map<Class<?>, List<FieldMetaVo>> CACHE = new ConcurrentHashMap<>();

    /**
     * 解析类的可配置字段清单
     *
     * @param voClass 目标类
     * @return 字段元数据列表（不可变视图拷贝，调用方修改不影响缓存）；类为 null 返回空列表
     */
    public static List<FieldMetaVo> resolve(Class<?> voClass) {
        if (voClass == null) {
            return new ArrayList<>();
        }
        return new ArrayList<>(CACHE.computeIfAbsent(voClass, FieldMetaResolver::doResolve));
    }

    /**
     * 合并多个类的字段（同一资源绑定的全部读出口 VO），按字段名去重
     *
     * <p>同名字段只保留一份元数据，但 {@code sourceClasses} 记录它出现在哪些类里，
     * 供配置页标注"该字段来自 SysUserVo, SysUserExportVo"。</p>
     *
     * @param classes 同一资源下的类集合
     * @return 去重后的字段清单
     */
    public static List<FieldMetaVo> resolveUnion(List<Class<?>> classes) {
        Map<String, FieldMetaVo> merged = new java.util.LinkedHashMap<>();
        if (classes == null) {
            return new ArrayList<>();
        }
        for (Class<?> clazz : classes) {
            for (FieldMetaVo meta : resolve(clazz)) {
                FieldMetaVo exists = merged.get(meta.getFieldName());
                if (exists == null) {
                    merged.put(meta.getFieldName(), meta);
                } else {
                    exists.getSourceClasses().addAll(meta.getSourceClasses());
                    // 任一类上有 @Sensitive，该字段就算有注解基线：保护取并集，宁可多标
                    if (meta.getSensitive()) {
                        exists.setSensitive(true);
                        exists.setSensitiveStrategy(meta.getSensitiveStrategy());
                    }
                }
            }
        }
        return new ArrayList<>(merged.values());
    }

    private static List<FieldMetaVo> doResolve(Class<?> clazz) {
        List<FieldMetaVo> list = new ArrayList<>();
        for (Field f : ReflectUtil.getFields(clazz)) {
            if (Modifier.isStatic(f.getModifiers()) || "serialVersionUID".equals(f.getName())) {
                continue;
            }
            ExcelProperty ep = f.getAnnotation(ExcelProperty.class);
            Sensitive sen = f.getAnnotation(Sensitive.class);

            FieldMetaVo meta = new FieldMetaVo();
            meta.setFieldName(f.getName());
            // 中文标签取 @ExcelProperty(value)，缺失时回落字段名——配置页要给管理员看中文，不是给开发者看驼峰
            meta.setLabel(ep != null && ep.value().length > 0 ? ep.value()[0] : f.getName());
            meta.setJavaType(f.getType().getSimpleName());
            meta.setSensitive(sen != null);
            meta.setSensitiveStrategy(sen != null ? sen.strategy().name() : null);
            // @Sensitive 只对 String 生效（SensitiveHandler.createContextual 的硬限制），
            // 非 String 字段标"注解不覆盖"，配置页红字提示：这类字段只能靠动态配置兜底
            meta.setAnnotationUncovered(sen != null && !String.class.equals(f.getType()));
            List<String> sources = new ArrayList<>();
            sources.add(clazz.getSimpleName());
            meta.setSourceClasses(sources);
            list.add(meta);
        }
        return list;
    }

    /**
     * 仅供单测清理缓存
     */
    static void clearCache() {
        CACHE.clear();
    }
}