package plus.ruoyi.common.core.field;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 字段权限资源中类的角色
 *
 * <p>同一个资源（如 {@code system:user}）会对应多个类：读出口 VO、写入口 BO、导入 ImportVo。
 * 类角色决定该类被哪个出口消费——只登记 VO 会让写入口和导入口成为绕过通道。</p>
 *
 * <p>与字典 {@code sys_field_subject} 无关，对应表 {@code sys_field_resource_class.class_type}。</p>
 */
@Getter
@AllArgsConstructor
public enum FieldClassType {

    /**
     * 读出口 VO：JSON 序列化、Excel 导出按此类判档
     */
    VO("1", "读出口VO"),

    /**
     * 写入口 BO：{@code @RequestBody} 写入拦截按此类反查资源
     */
    BO("2", "写入口BO"),

    /**
     * 导入 ImportVo：Excel 导入拦截按此类反查资源
     */
    IMPORT("3", "导入ImportVo");

    /**
     * 存库值，与 {@code sys_field_resource_class.class_type} 一一对应
     */
    private final String code;

    /**
     * 中文说明，供管理端展示
     */
    private final String label;

    /**
     * 按存库值反查枚举
     *
     * @param code 存库值
     * @return 对应枚举；未匹配返回 null（调用方按"未登记"处理，不抛异常）
     */
    public static FieldClassType ofCode(String code) {
        for (FieldClassType type : values()) {
            if (type.code.equals(code)) {
                return type;
            }
        }
        return null;
    }
}