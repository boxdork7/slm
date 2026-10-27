---
name: data-permission
description: |
  数据权限开发指南。包含行级隔离（@DataPermission，6 种权限类型）与字段级隔离（@FieldResource，4 档访问控制）两个正交维度。

  触发场景：
  - 为业务模块添加数据权限过滤
  - 配置部门级数据隔离
  - 扩展自定义数据权限类型
  - 临时忽略数据权限查询全量数据
  - 排查数据权限不生效问题
  - 配置字段级权限（某些角色看不到/改不了某个字段）
  - 为新模块的 VO/BO 登记字段权限资源
  - 排查字段被隐藏或脱敏的原因

  触发词：数据权限、@DataPermission、DataScope、行级权限、数据隔离、部门权限、本人权限、自定义权限、权限过滤、数据过滤、按部门过滤、按创建人过滤、字段级权限、列级权限、字段隔离、@FieldResource、字段脱敏、字段隐藏、字段只读、sys_field_permission

  注意：如果是认证授权（登录、Token、Sa-Token）或菜单/按钮权限，请使用 security-guard。
---

# 数据权限开发指南

## 概述

数据权限解决"访问接口后能看到哪些数据"，包含两个**正交维度**：

| 维度 | 机制 | 回答的问题 | 本文档章节 |
|------|------|-----------|-----------|
| **行级** | `@DataPermission` + MyBatis 拦截器注入 WHERE | 能看到**哪几条**记录 | 第 1~7 节 |
| **字段级** | `@FieldResource` + 四个出口拦截 | 同一条记录能看到**哪几列** | **第 8 节** |

两者可叠加：先按 `@DataPermission` 过滤出能看的行，再按字段权限决定这些行里哪些列可见、可改。

**与功能权限的区别**：
- **功能权限**（security-guard）：控制"能不能访问这个接口"
- **数据权限**（本技能）：控制"访问接口后能看到哪些数据"

---

## 1. 核心概念

### 1.1 六种权限类型

| 类型 | 字典值 | 说明 | SQL 效果 |
|------|--------|------|---------|
| **全部数据** | 1 | 无过滤条件 | 不拼接任何条件 |
| **自定义权限** | 2 | 按角色关联的部门 | `dept_id IN (1,2,3)` |
| **本部门** | 3 | 只看本部门 | `dept_id = 100` |
| **本部门及以下** | 4 | 本部门 + 子部门 | `dept_id IN (100,101,102)` |
| **仅本人** | 5 | 只看自己创建的 | `create_by = 1` |
| **部门及以下或本人** | 6 | 混合模式 | `dept_id IN (...) OR create_by = 1` |

### 1.2 技术架构

```
请求 → Controller → Service → DAO (@DataPermission) → Mapper
                                    ↓
                    PlusDataPermissionInterceptor 拦截
                                    ↓
                    PlusDataPermissionHandler 解析 SpEL
                                    ↓
                    拼接 WHERE 条件 → 执行 SQL
```

### 1.3 核心类位置

| 类 | 路径 | 职责 |
|---|------|------|
| `@DataPermission` | `ruoyi-common-mybatis/.../annotation/` | 权限注解 |
| `@DataColumn` | `ruoyi-common-mybatis/.../annotation/` | 列配置注解 |
| `DataScopeType` | `ruoyi-common-mybatis/.../enums/` | 权限类型枚举 |
| `PlusDataPermissionInterceptor` | `ruoyi-common-mybatis/.../interceptor/` | SQL 拦截器 |
| `PlusDataPermissionHandler` | `ruoyi-common-mybatis/.../handler/` | 权限处理器 |
| `DataPermissionHelper` | `ruoyi-common-mybatis/.../helper/` | 权限助手类 |
| `ISysDataScopeService` | `ruoyi-system/.../service/` | 权限数据服务 |

---

## 2. 快速上手（3 分钟添加权限）

### 步骤 1：在 DAO 方法上添加注解

```java
import plus.ruoyi.common.mybatis.annotation.DataPermission;
import plus.ruoyi.common.mybatis.annotation.DataColumn;

@Repository
public class OrderDaoImpl extends BaseDaoImpl<OrderMapper, Order> implements IOrderDao {

    /**
     * 分页查询（带数据权限）
     */
    @DataPermission({
        @DataColumn(key = "deptName", value = "create_dept"),
        @DataColumn(key = "userName", value = "create_by")
    })
    @Override
    public PageResult<OrderVo> pageWithPermission(OrderBo bo, PageQuery pageQuery) {
        PlusLambdaQuery<Order> wrapper = buildQueryWrapper(bo);
        return page(wrapper, pageQuery).convert(OrderVo.class);
    }
}
```

### 步骤 2：确保表有权限字段

```sql
CREATE TABLE m_order (
    id           BIGINT(20)   NOT NULL COMMENT '主键ID',
    -- ... 业务字段 ...

    -- ✅ 必须有这两个字段用于数据权限
    create_dept  BIGINT(20)   DEFAULT NULL COMMENT '创建部门',
    create_by    BIGINT(20)   DEFAULT NULL COMMENT '创建人',

    -- 其他审计字段
    create_time  DATETIME     DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);
```

### 步骤 3：配置角色的数据权限

在系统管理 → 角色管理中，为角色配置数据权限范围（全部/本部门/本部门及以下/仅本人/自定义）。

---

## 3. 使用场景模板

### 场景 A：按部门过滤

最常见的场景，用户只能看到本部门及以下的数据。

```java
/**
 * 按部门过滤
 *
 * 权限效果：
 * - 全部数据：无过滤
 * - 本部门：WHERE create_dept = 100
 * - 本部门及以下：WHERE create_dept IN (100, 101, 102)
 * - 自定义：WHERE create_dept IN (角色关联的部门ID)
 */
@DataPermission({
    @DataColumn(key = "deptName", value = "create_dept")
})
@Override
public List<Order> listWithPermission(OrderBo bo) {
    return list(buildQueryWrapper(bo));
}
```

### 场景 B：按创建人过滤

用户只能看到自己创建的数据。

```java
/**
 * 按创建人过滤
 *
 * 权限效果：
 * - 仅本人：WHERE create_by = 1（当前用户ID）
 */
@DataPermission({
    @DataColumn(key = "userName", value = "create_by")
})
@Override
public List<Task> listMyTasks(TaskBo bo) {
    return list(buildQueryWrapper(bo));
}
```

### 场景 C：部门 + 创建人混合

同时支持按部门和按创建人过滤，根据角色配置自动选择。

```java
/**
 * 部门 + 创建人混合
 *
 * 权限效果：
 * - 本部门：WHERE create_dept = 100
 * - 仅本人：WHERE create_by = 1
 * - 部门及以下或本人：WHERE create_dept IN (...) OR create_by = 1
 */
@DataPermission({
    @DataColumn(key = "deptName", value = "create_dept"),
    @DataColumn(key = "userName", value = "create_by")
})
@Override
public PageResult<ProjectVo> pageWithPermission(ProjectBo bo, PageQuery pageQuery) {
    return page(buildQueryWrapper(bo), pageQuery).convert(ProjectVo.class);
}
```

### 场景 D：关联查询时的表别名

当 SQL 涉及多表关联时，需要使用正确的表别名。

```java
/**
 * 多表关联查询
 *
 * SQL 示例：
 * SELECT u.*, d.dept_name
 * FROM sys_user u
 * LEFT JOIN sys_dept d ON u.dept_id = d.dept_id
 *
 * 注意：value 中使用表别名 u.dept_id
 */
@DataPermission({
    @DataColumn(key = "deptName", value = "u.dept_id"),
    @DataColumn(key = "userName", value = "u.user_id")
})
@Override
public PageResult<SysUserVo> pageWithPermission(SysUserBo bo, IPage<SysUser> page) {
    // ...
}
```

### 场景 E：临时忽略数据权限

某些场景需要查询全量数据（如统计、初始化）。

```java
import plus.ruoyi.common.mybatis.helper.DataPermissionHelper;

@Service
public class StatisticsServiceImpl implements IStatisticsService {

    /**
     * 统计总数（需要全量数据）
     */
    @Override
    public Long countTotal() {
        // 忽略数据权限，查询所有数据
        return DataPermissionHelper.ignore(() -> {
            return orderDao.count();
        });
    }

    /**
     * 初始化缓存（需要全量数据）
     */
    @Override
    public void initCache() {
        DataPermissionHelper.ignore(() -> {
            List<Config> configs = configDao.list();
            // 处理缓存...
            return null;
        });
    }
}
```

### 场景 F：指定权限标识跳过过滤

拥有特定权限的角色可以跳过数据过滤。

```java
/**
 * 拥有 order:all 权限的角色可以查看所有订单
 */
@DataPermission({
    @DataColumn(key = "deptName", value = "create_dept", permission = "order:all")
})
@Override
public List<Order> listAllOrders(OrderBo bo) {
    return list(buildQueryWrapper(bo));
}
```

---

## 4. 扩展自定义权限类型

### 4.1 添加新的权限类型

**步骤 1**：修改 `DataScopeType` 枚举

```java
// 位置：ruoyi-common-mybatis/.../enums/DataScopeType.java

public enum DataScopeType {

    // ... 现有类型 ...

    /**
     * 按区域过滤（自定义类型示例）
     */
    REGION("7", "按区域", "#{#regionName} IN ( #{@sdss.getUserRegions( #user.userId )} )"),
    ;

    // ... 其他代码 ...
}
```

**步骤 2**：在 `ISysDataScopeService` 中添加方法

```java
// 接口
public interface ISysDataScopeService {
    // ... 现有方法 ...

    /**
     * 获取用户关联的区域ID列表
     */
    String getUserRegions(Long userId);
}

// 实现
@Service("sdss")
public class SysDataScopeServiceImpl implements ISysDataScopeService {

    @Override
    @Cacheable(cacheNames = CacheNames.SYS_USER_REGIONS, key = "#userId")
    public String getUserRegions(Long userId) {
        List<Long> regionIds = userRegionMapper.selectRegionIdsByUserId(userId);
        if (CollUtil.isEmpty(regionIds)) {
            return "-1";  // 返回 -1 表示无权限
        }
        return StringUtils.join(regionIds, ",");
    }
}
```

**步骤 3**：使用新权限类型

```java
@DataPermission({
    @DataColumn(key = "regionName", value = "region_id")
})
@Override
public List<Store> listByRegion(StoreBo bo) {
    return list(buildQueryWrapper(bo));
}
```

### 4.2 添加自定义变量

通过 `DataPermissionHelper` 设置自定义变量供 SpEL 表达式使用。

```java
@Service
public class OrderServiceImpl implements IOrderService {

    @Override
    public PageResult<OrderVo> pageByShop(Long shopId, OrderBo bo, PageQuery pageQuery) {
        // 设置自定义变量
        DataPermissionHelper.setVariable("shopId", shopId);

        try {
            return orderDao.pageWithPermission(bo, pageQuery);
        } finally {
            // 清理变量
            DataPermissionHelper.removeVariable("shopId");
        }
    }
}

// DAO 中使用
@DataPermission({
    @DataColumn(key = "shopId", value = "shop_id")  // 使用自定义变量
})
public PageResult<OrderVo> pageWithPermission(OrderBo bo, PageQuery pageQuery);
```

---

## 5. 禁止项与必须项

### 5.1 绝对禁止

```java
// ❌ 禁止 1：在 ISysDataScopeService 内调用带权限的方法（导致死循环）
@Service("sdss")
public class SysDataScopeServiceImpl implements ISysDataScopeService {

    @Override
    public String getDeptAndChild(Long deptId) {
        // ❌ 禁止！deptDao.list() 如果带 @DataPermission 会死循环
        List<SysDept> depts = deptDao.list(wrapper);

        // ✅ 正确：直接使用 Mapper 或忽略权限
        List<SysDept> depts = deptMapper.selectList(wrapper);
        // 或
        List<SysDept> depts = DataPermissionHelper.ignore(() -> deptDao.list(wrapper));
    }
}

// ❌ 禁止 2：表别名不匹配
@DataPermission({
    @DataColumn(key = "deptName", value = "user.dept_id")  // ❌ 别名是 user
})
// 但 SQL 是：SELECT * FROM sys_user u ...  // 别名是 u

// ✅ 正确
@DataPermission({
    @DataColumn(key = "deptName", value = "u.dept_id")  // ✅ 与 SQL 别名一致
})

// ❌ 禁止 3：在 Controller 层使用 @DataPermission
@RestController
public class OrderController {
    @DataPermission({...})  // ❌ 无效！必须在 DAO/Mapper 层
    @GetMapping("/list")
    public R<List<OrderVo>> list() { }
}
```

### 5.2 必须遵守

```java
// ✅ 必须 1：Entity 继承 TenantEntity（包含 create_dept、create_by）
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("m_order")
public class Order extends TenantEntity {  // ✅ 继承 TenantEntity
    // ...
}

// ✅ 必须 2：@DataPermission 放在 DAO 实现类或 Mapper 接口上
@Repository
public class OrderDaoImpl extends BaseDaoImpl<OrderMapper, Order> {

    @DataPermission({...})  // ✅ 正确位置
    @Override
    public PageResult<OrderVo> pageWithPermission(...) { }
}

// ✅ 必须 3：多表查询时使用正确的表别名
// SQL: SELECT o.*, u.user_name FROM m_order o LEFT JOIN sys_user u ON o.create_by = u.user_id
@DataPermission({
    @DataColumn(key = "deptName", value = "o.create_dept"),  // ✅ 订单表别名 o
    @DataColumn(key = "userName", value = "o.create_by")     // ✅ 使用 o.create_by
})
```

---

## 6. 问题排查清单

### 6.1 数据权限不生效

| 检查项 | 可能原因 | 解决方案 |
|--------|---------|---------|
| 是否超级管理员 | 超管和租户管理员自动跳过权限 | 使用普通用户测试 |
| 角色是否配置数据权限 | 角色的数据范围为"全部数据" | 修改角色数据权限范围 |
| 注解位置是否正确 | @DataPermission 不在 DAO/Mapper 层 | 移动注解到 DAO 实现类 |
| 表别名是否匹配 | value 中的别名与 SQL 不一致 | 检查并修正表别名 |
| 是否调用了带注解的方法 | Service 调用了不带注解的方法 | 确保调用带 @DataPermission 的方法 |

### 6.2 SQL 语法错误

| 错误现象 | 可能原因 | 解决方案 |
|---------|---------|---------|
| `Unknown column` | 表别名不存在 | 检查 value 中的表别名 |
| `dept_id IN ()` | 权限服务返回空 | 检查 ISysDataScopeService 实现 |
| 条件重复拼接 | 多次调用带权限的方法 | 检查调用链 |

### 6.3 调试技巧

```yaml
# application.yml - 开启 SQL 日志查看拼接结果
mybatis-plus:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

```java
// 代码中打印当前用户权限信息
LoginUser user = LoginHelper.getLoginUser();
log.info("当前用户: {}, 部门: {}, 角色: {}",
    user.getUserId(),
    user.getDeptId(),
    user.getRoles().stream()
        .map(r -> r.getRoleName() + "(" + r.getDataScope() + ")")
        .collect(Collectors.joining(",")));
```

---

## 7. 常见问题 FAQ

### Q1：如何让某个接口不受数据权限限制？

```java
// 方法 1：使用 DataPermissionHelper.ignore()
public List<Order> listAll() {
    return DataPermissionHelper.ignore(() -> orderDao.list());
}

// 方法 2：调用不带 @DataPermission 的 DAO 方法
public List<Order> listAll() {
    return orderDao.list();  // 这个方法没有 @DataPermission
}

// 方法 3：使用 permission 参数
@DataPermission({
    @DataColumn(key = "deptName", value = "create_dept", permission = "order:all")
})
// 拥有 order:all 权限的角色不过滤
```

### Q2：多角色用户权限如何计算？

- **SELECT 查询**：多个角色的权限用 `OR` 连接（权限并集）
- **UPDATE/DELETE**：多个角色的权限用 `AND` 连接（权限交集）
- 可通过 `joinStr` 参数自定义

```java
@DataPermission(value = {
    @DataColumn(key = "deptName", value = "create_dept")
}, joinStr = "AND")  // 强制使用 AND 连接
```

### Q3：如何只对特定方法启用数据权限？

```java
@Repository
public class OrderDaoImpl extends BaseDaoImpl<OrderMapper, Order> implements IOrderDao {

    // 不带权限的普通查询
    @Override
    public List<Order> list(PlusLambdaQuery<Order> wrapper) {
        return baseMapper.selectList(wrapper);
    }

    // 带权限的查询（命名区分）
    @DataPermission({
        @DataColumn(key = "deptName", value = "create_dept")
    })
    @Override
    public List<Order> listWithPermission(PlusLambdaQuery<Order> wrapper) {
        return baseMapper.selectList(wrapper);
    }
}
```

### Q4：如何在 Mapper XML 中使用数据权限？

```java
// Mapper 接口
@DataPermission({
    @DataColumn(key = "deptName", value = "o.create_dept")
})
List<OrderVo> selectOrderReport(@Param("bo") OrderBo bo);
```

```xml
<!-- Mapper XML -->
<select id="selectOrderReport" resultType="OrderVo">
    SELECT o.*, u.user_name
    FROM m_order o
    LEFT JOIN sys_user u ON o.create_by = u.user_id
    WHERE o.status = #{bo.status}
    <!-- 数据权限会自动追加到这里 -->
</select>
```

---

## 8. 字段级权限（列级隔离）

> 行级权限决定"能看到哪几条"，字段级权限决定"同一条记录里能看到哪几列"。两者正交，可叠加。

### 8.1 四档访问控制

存库值对应字典 `sys_field_access`：

| 档位 | 码 | JSON 接口 | Excel 导出 | 写入（JSON / Excel 导入） |
|------|---|-----------|-----------|------------------------|
| **隐藏** | 0 | **连 key 都没有**（不是 null） | **整列消失**，表头都不留 | 提交被忽略 |
| **脱敏** | 1 | 值按策略打码 | 值按策略打码 | 提交被忽略 |
| **只读** | 2 | 明文下发 | 明文导出 | 提交被忽略 |
| **可写** | 3 | 明文下发 | 明文导出 | 正常修改 |

**为什么隐藏是"消失"而不是 null**：null 让前端分不清"无权限"和"确实为空"，且仍暴露字段名。
`@Sensitive` 的 `CLEAR_TO_NULL` 早就能做到 null，本机制要补的正是"彻底消失"这一档。

**为什么脱敏档也拦写入**：用户看到的是掩码，放行会把 `138****5678` 这种掩码串写进库，比拒绝更糟。

### 8.2 三步接入新模块

**第 1 步：给类标注解**（`@FieldResource` 在 `ruoyi-common-core`）

```java
// 读出口 VO：JSON 序列化 + Excel 导出走它
@FieldResource("system:user")
public class SysUserVo { ... }

// 同一资源可绑多个 VO —— 漏绑一个导出 VO 就是一条明文外泄通道
@FieldResource("system:user")
public class SysUserExportVo { ... }

// 写入口 BO：JSON 写入拦截走它
@FieldResource(value = "system:user", type = FieldClassType.BO)
public class SysUserBo { ... }

// 导入 VO：Excel 导入拦截走它
@FieldResource(value = "system:user", type = FieldClassType.IMPORT)
public class SysUserImportVo { ... }
```

**第 2 步：重启应用**。`FieldResourceScanner` 自动登记到 `sys_field_resource` /
`sys_field_resource_class`，并按 `resource_key` 反查 `sys_menu.menu_name` 填中文名。
启动日志会打印「字段权限资源扫描完成：N 个类 / 新增资源 M 个」。

**第 3 步：在「系统管理 → 字段权限」配置矩阵**。左树选资源，右侧「字段 × 主体」逐格设档位。

### 8.3 三个必须知道的语义

**① 嵌套 VO 不用标注解**

```java
// SysUserInfoVo.user 是 SysUserVo 类型 → Jackson 序列化嵌套对象时走内层类自己的序列化器
// 自动继承保护，标了反而多余
public class SysUserInfoVo {
    private SysUserVo user;          // ✅ 自动受 system:user 配置保护
    private List<SysRoleVo> roles;   // ✅ 同理
}
```

**② 字段名不同语义的类要注册成独立资源**

```java
// ❌ 错误：SysUserOnlineVo 的 ipaddr 与 SysUserVo 的 loginIp 语义不同，硬凑会配错
@FieldResource("system:user")
public class SysUserOnlineVo { private String ipaddr; }

// ✅ 正确：独立资源
@FieldResource("monitor:online")
public class SysUserOnlineVo { private String ipaddr; }
```

**③ 只存"与注解基线不同"的差异行**

基线不是固定的"可写"：

| 字段情况 | 基线 | 配可写 | 配脱敏 |
|---------|------|-------|-------|
| 无 `@Sensitive` | 可写 | 不落行 | **落行** |
| 有 `@Sensitive` | **脱敏** | **落行**（显式放权） | 不落行 |

这样"phone 带 `@Sensitive`，想让 HR 角色看明文"才配得出来——若基线固定为可写，
配可写不落行 → 走注解兜底 → HR 永远看掩码。

### 8.4 多主体合并：取最宽松

一个用户可能同时命中多条配置（多角色 + 所在部门 + 个人授权），逐字段取**最宽松**档位：

```
可写(3) > 只读(2) > 脱敏(1) > 隐藏(0)
```

**理由**：与 `@DataPermission` 的多角色 OR 语义一致；取交集会让"角色多的人反而看得少"，反直觉且难排查。

🔴 **这条最容易踩坑**：给"实习生"角色设隐藏后，一个同时兼任其他角色的用户**照样能看**。
配置页的单元格 `⚠ N` 角标就是提示这个——N 表示该主体下有多少人因其他主体仍可见。
**收权时必须检查该用户命中的全部主体**。

### 8.5 排查清单

**字段没被隐藏**：

1. 类标 `@FieldResource` 了吗？未标 = 不拦截（存量 VO 零影响就靠这个）
2. 重启过吗？扫描器只在启动时跑
3. 是超管吗？`isSuperAdmin()` 直接旁路
4. `field-permission.enabled` 是 false 吗？全局开关
5. 被别的主体放宽了吗？→ 用「效果预览」按该用户查真实档位

**字段被意外隐藏**：

1. 是不是带 `@Sensitive` 走了注解基线？预览弹窗的「来源」列会区分「配置」与「注解基线」
2. 类角色标错了吗？VO 标成 BO 会让读出口不拦、写入口乱拦

**导出/导入没生效**：

- 导出：确认走的 VO 标了注解（`type` 默认就是 VO）
- 导入：确认 ImportVo 标了 `type = FieldClassType.IMPORT`——
  导入走 `@RequestPart` 不经 JSON 写入 AOP，是独立的一条拦截路径

### 8.6 实现要点（改代码前必读）

| 要点 | 说明 |
|------|------|
| **读注解不查库** | 类归属从 `@FieldResource` 读取。查库有启动顺序风险：序列化若早于扫描器完成，Jackson 会把该类**永久缓存**成"未注册"，留下一个直到重启才消失的放行缺口 |
| **未标注解的类零开销** | `changeProperties` 按类调用一次且被 Jackson 永久缓存，未标注解直接原样返回，后续请求根本不进拦截代码 |
| **置 null = 保持原值** | 写入拦截把无权字段置 null。本项目 `updateStrategy: NOT_NULL`，null 列不进 UPDATE 语句，因此等价于保持原值，且省掉一次 `getById` |
| **Excel 导入必须逐行拦** | 业务 Listener 常在 `invoke()` 里直接入库（如 `SysUserImportListener`），等 `doRead()` 返回再处理数据早已落库。用 `FieldPermissionExcelListener` 装饰器在转发前拦 |
| **ThreadLocal 必须清理** | `FieldPermissionHelper` 存请求级快照，`FieldPermissionContextFilter` 在 `finally` 中 `clear()`。不清会串权（A 用户读到 B 用户的档位），是本机制最危险的 bug 形态 |
| **预览不能用 `getMaskStrategy`** | 它读的是**当前登录管理员**的 ThreadLocal 策略表，预览张三会拿到管理员自己的策略。按被预览用户实查差异行 |
| **前端不是安全边界** | 登录下发的 `fieldPermissions` 快照只用于隐藏列 / 禁用表单项。真正的隔离由四个后端出口保证，绕过前端一样改不动、看不到 |

### 8.7 与 `@Sensitive` 的关系

`@Sensitive` 是**静态兜底**，字段级权限是**动态覆盖**，两者协同：

- 无动态决策 → `@Sensitive` 照常生效（存量代码零改动）
- 有动态决策 → 覆盖注解。显式放权为「可写」时输出明文，这正是注解做不到的
- `@Sensitive` 只对 String 生效，非 String 字段配置页会标红「注解不覆盖」——这类字段只能靠动态配置兜底

---

## 9. 参考文件路径

### 核心文件

| 文件 | 路径 |
|------|------|
| @DataPermission | `ruoyi-common/ruoyi-common-mybatis/src/main/java/plus/ruoyi/common/mybatis/annotation/DataPermission.java` |
| @DataColumn | `ruoyi-common/ruoyi-common-mybatis/src/main/java/plus/ruoyi/common/mybatis/annotation/DataColumn.java` |
| DataScopeType | `ruoyi-common/ruoyi-common-mybatis/src/main/java/plus/ruoyi/common/mybatis/enums/DataScopeType.java` |
| PlusDataPermissionInterceptor | `ruoyi-common/ruoyi-common-mybatis/src/main/java/plus/ruoyi/common/mybatis/interceptor/PlusDataPermissionInterceptor.java` |
| PlusDataPermissionHandler | `ruoyi-common/ruoyi-common-mybatis/src/main/java/plus/ruoyi/common/mybatis/handler/PlusDataPermissionHandler.java` |
| DataPermissionHelper | `ruoyi-common/ruoyi-common-mybatis/src/main/java/plus/ruoyi/common/mybatis/helper/DataPermissionHelper.java` |
| ISysDataScopeService | `ruoyi-modules/ruoyi-system/src/main/java/plus/ruoyi/system/core/service/ISysDataScopeService.java` |

### 使用示例

| 文件 | 路径 |
|------|------|
| SysUserDaoImpl | `ruoyi-modules/ruoyi-system/src/main/java/plus/ruoyi/system/core/dao/impl/SysUserDaoImpl.java` |
| SysRoleDaoImpl | `ruoyi-modules/ruoyi-system/src/main/java/plus/ruoyi/system/core/dao/impl/SysRoleDaoImpl.java` |
| SysDeptMapper | `ruoyi-modules/ruoyi-system/src/main/java/plus/ruoyi/system/core/mapper/SysDeptMapper.java` |

### 字段级权限文件（第 8 节）

**核心契约（core 层，四出口共享）**：

| 文件 | 路径 |
|------|------|
| @FieldResource | `ruoyi-common/ruoyi-common-core/src/main/java/plus/ruoyi/common/core/field/FieldResource.java` |
| FieldAccess / FieldClassType / SubjectType | `ruoyi-common/ruoyi-common-core/src/main/java/plus/ruoyi/common/core/field/` |
| IFieldPermissionService | `ruoyi-common/ruoyi-common-core/src/main/java/plus/ruoyi/common/core/field/IFieldPermissionService.java` |
| FieldPermissionHelper（请求级 ThreadLocal） | `ruoyi-common/ruoyi-common-core/src/main/java/plus/ruoyi/common/core/field/FieldPermissionHelper.java` |

**四个出口**：

| 出口 | 文件 |
|------|------|
| 读 · JSON | `ruoyi-common/ruoyi-common-sensitive/.../core/handler/FieldPermissionSerializerModifier.java`<br>`.../FieldPermissionPropertyWriter.java` |
| 读 · Excel 导出 | `ruoyi-common/ruoyi-common-excel/.../core/ExcelSensitiveHelper.java` |
| 写 · JSON | `ruoyi-common/ruoyi-common-web/.../aspect/FieldWriteGuardAspect.java`<br>`.../handler/FieldWriteGuardAdvice.java`（响应 msg 追加「已忽略」提示） |
| 写 · Excel 导入 | `ruoyi-common/ruoyi-common-excel/.../core/FieldPermissionExcelListener.java` |

**决策与管理端（ruoyi-system）**：

| 文件 | 路径 |
|------|------|
| 决策服务（运行期判档） | `.../core/service/impl/SysFieldPermissionServiceImpl.java` |
| 矩阵服务（管理端配置） | `.../core/service/impl/SysFieldMatrixServiceImpl.java` |
| 注解扫描器 | `.../core/runner/FieldResourceScanner.java` |
| 字段元数据反射 | `.../core/helper/FieldMetaResolver.java` |
| 配置页 | `plus-ui/src/views/system/fieldPermission/fieldPermission.vue` |
| 效果预览弹窗 | `plus-ui/src/views/system/fieldPermission/FieldPreviewDialog.vue` |

**数据表**：`sys_field_resource`（系统级）、`sys_field_resource_class`（系统级）、`sys_field_permission`（租户级）

> 前两张表无 `tenant_id`，已硬编码进 `PlusTenantLineHandler.SYSTEM_EXCLUDE_TABLES`——
> 类归属是随代码走的元数据，按租户隔离会让新租户开通后绑定表为空而全部放行。

### 🔴 实测踩坑（2026-09-14 端到端验收记录）

**1. Excel 导出脱敏：算了副本必须写副本**

`ExcelUtil.exportExcel(...)` 里脱敏是「先算副本再写出」两步：

```java
List<T> masked = ExcelSensitiveHelper.maskList(list, clazz);   // 算副本
...
builder.doWrite(masked);   // ✅ 必须写 masked
// builder.doWrite(list);  // ❌ 写回原始入参 → 脱敏整条失效，且无任何报错
```

实测这一行写成 `doWrite(list)` 时：HIDDEN 档仍正常（走 `excludeColumnFieldNames` 整列排除），
**只有 MASKED 档静默失效**——页面看 JSON 是打码的，导出的 Excel 却是明文，极难发现。
6 个导出重载全部委派到这一个方法，错一行等于全站导出脱敏失效。
同理 `CellMergeStrategy` 也要传 `masked`，否则合并行号算的是另一份数据。

**验收方式**：别只看 JSON。改档位后必须真的导出一次 xlsx 解压看 `sheet1.xml` 的值。

**2. `@Sensitive` 不覆盖 Excel 导出，ExportVo 往往根本没标**

`@Sensitive` 只挂在 Jackson 序列化器上。FastExcel 直接反射读字段，**完全绕过它**。
且本项目 `SysUserVo` 标了 `@Sensitive`，而导出用的 `SysUserExportVo` **一个都没标**——
所以「注解基线」这一列对导出出口没有任何约束力。

含义：矩阵里看到某字段注解基线是「脱敏」，**不代表导出也脱敏**。
要让导出脱敏，必须在矩阵里对该字段显式配一个 MASKED 档（动态配置对两个出口都生效）。
新增 ExportVo 时，敏感列要么标 `@Sensitive`，要么在矩阵里配档位，二者都没有就是明文导出。
