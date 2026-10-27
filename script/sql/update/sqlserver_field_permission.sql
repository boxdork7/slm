-- ============================================================================
-- 字段级权限隔离（列级权限） 增量升级脚本 (SQL Server)
-- ============================================================================
-- 变更内容：
--   1. 新建 sys_field_resource         字段权限资源注册表（系统级，无 tenant_id）
--   2. 新建 sys_field_resource_class   资源与类绑定表（系统级，无 tenant_id）
--   3. 新建 sys_field_permission       字段权限配置表（租户级，有 tenant_id）
--   4. sys_dict_type / sys_dict_data 新增 2 个字典共 7 项
--   5. sys_menu 新增 1 个菜单 + 4 个按钮权限，并授权给超级管理员角色
-- 触发原因：
--   行级权限（@DataPermission）只能决定「能看到哪几条」，无法表达
--   「同一条记录里，客服看不到身份证号、财务才能改成本价」这类列级诉求。
-- 设计要点：
--   · 表 1 / 表 2 刻意不做租户隔离：类归属是随代码走的编译期元数据，
--     由 @FieldResource 注解启动扫描登记。若按租户隔离，扫描器只在一个租户
--     上下文里跑，新租户开通后查绑定表为空 → 判定「未注册」→ 全部放行，
--     是个不报错、无感知的静默安全缺口。
--     两表已硬编码进 PlusTenantLineHandler.SYSTEM_EXCLUDE_TABLES，
--     **不要**再往 application.yml 的 tenant.excludes 里重复添加。
--   · 表 3「谁能看什么」是授权数据，必须按租户隔离，走 TenantEntity 自动处理。
--   · 表 3 只存与「注解基线」不同的差异行：无 @Sensitive 的字段基线为可写，
--     有 @Sensitive 的字段基线为脱敏。
-- 引入版本：2026-09 字段级权限批次
-- ----------------------------------------------------------------------------
-- 执行前必读：
--   · SQL Server 的 CREATE TABLE / CREATE INDEX 不支持 IF NOT EXISTS，
--     且 GO 是批处理分隔符无法包进 IF ... BEGIN ... END，
--     因此第 1-3 节的建表**不幂等**。若提示
--     「数据库中已存在名为 'sys_field_resource' 的对象」，
--     说明本脚本已执行过，跳过建表部分、从第 4 节继续即可
--   · 第 4-6 节使用 WHERE NOT EXISTS，可重复执行
--   · 脚本含 GO 批处理分隔符，请用 sqlcmd 或 SSMS 执行（JDBC 客户端可能不识别 GO）
--   · 执行后**必须重启应用**：资源与类绑定由启动扫描器写入，
--     不重启则两张元数据表一直为空，表现为「配置页左侧没有任何资源」
--   · 字典 id 24/25、字典数据 id 132-138、菜单 id 1650-1654 为固定值，
--     若在你的实例上已被占用，请先改成空闲 id 再执行
-- ============================================================================

-- 三张表分两类：
--   表 1 / 表 2 是「哪个类属于哪个资源」的代码结构元数据，与 sys_menu 同性质，系统级、无 tenant_id，
--   由 @FieldResource 注解启动扫描自动登记；若按租户隔离，新租户开通后绑定表为空会导致全部放行。
--   表 3 是「谁能看什么」的授权数据，租户级。
-- 注：列注释只对关键业务列标注，审计列（create_by/update_time 等）与既有表一致不再逐列重复。

-- 1. sys_field_resource 字段权限资源注册表（系统级）
CREATE TABLE sys_field_resource
(
    id            bigint                           NOT NULL,
    resource_key  nvarchar(100)                    NOT NULL,
    resource_name nvarchar(100)                    NOT NULL,
    module_name   nvarchar(50)                     NULL,
    sort_order    int           DEFAULT (999)      NULL,
    status        nchar(1)      DEFAULT ('1')      NULL,
    is_auto       nchar(1)      DEFAULT ('1')      NULL,
    create_dept   bigint                           NULL,
    create_by     bigint                           NULL,
    create_time   datetime2(7)                     NULL,
    update_by     bigint                           NULL,
    update_time   datetime2(7)                     NULL,
    remark        nvarchar(255)                    NULL,
    is_deleted    nchar(1)      DEFAULT ('0')      NULL,
    CONSTRAINT PK_sys_field_resource PRIMARY KEY CLUSTERED (id)
)
GO

CREATE UNIQUE INDEX uk_sys_field_resource_key ON sys_field_resource(resource_key)
GO

EXEC sys.sp_addextendedproperty 'MS_Description', N'字段权限资源注册表(系统级，无租户)', 'SCHEMA', N'dbo', 'TABLE', N'sys_field_resource'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'主键id', 'SCHEMA', N'dbo', 'TABLE', N'sys_field_resource', 'COLUMN', N'id'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'资源标识(与菜单权限前缀一致，如 system:user)', 'SCHEMA', N'dbo', 'TABLE', N'sys_field_resource', 'COLUMN', N'resource_key'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'资源名称(扫描时按 resource_key 反查 sys_menu.menu_name 自动填充，可改)', 'SCHEMA', N'dbo', 'TABLE', N'sys_field_resource', 'COLUMN', N'resource_name'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'所属模块分组(如 系统管理/基础业务/商城管理)', 'SCHEMA', N'dbo', 'TABLE', N'sys_field_resource', 'COLUMN', N'module_name'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'状态(0停用 1正常)', 'SCHEMA', N'dbo', 'TABLE', N'sys_field_resource', 'COLUMN', N'status'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'是否由 @FieldResource 注解扫描自动登记(0手工 1自动)', 'SCHEMA', N'dbo', 'TABLE', N'sys_field_resource', 'COLUMN', N'is_auto'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'是否删除(0正常 1已删除)', 'SCHEMA', N'dbo', 'TABLE', N'sys_field_resource', 'COLUMN', N'is_deleted'
GO

-- 2. sys_field_resource_class 资源与类绑定表（系统级）
-- 一个资源对应多个类：sys_user 实测有 7 个 VO，只绑一个 VO 会让走导出 VO 的接口明文外泄。
-- class_type 决定喂给哪个出口：1 VO 走 JSON/Excel 导出；2 BO 走 JSON 写入拦截；3 ImportVo 走 Excel 导入拦截
CREATE TABLE sys_field_resource_class
(
    id           bigint                           NOT NULL,
    resource_key nvarchar(100)                    NOT NULL,
    class_name   nvarchar(255)                    NOT NULL,
    class_type   nchar(1)      DEFAULT ('1')      NOT NULL,
    is_auto      nchar(1)      DEFAULT ('1')      NULL,
    create_dept  bigint                           NULL,
    create_by    bigint                           NULL,
    create_time  datetime2(7)                     NULL,
    update_by    bigint                           NULL,
    update_time  datetime2(7)                     NULL,
    remark       nvarchar(255)                    NULL,
    is_deleted   nchar(1)      DEFAULT ('0')      NULL,
    CONSTRAINT PK_sys_field_resource_class PRIMARY KEY CLUSTERED (id)
)
GO

CREATE UNIQUE INDEX uk_sys_field_res_class_name ON sys_field_resource_class(class_name)
GO
CREATE INDEX idx_sys_field_res_class_key ON sys_field_resource_class(resource_key)
GO

EXEC sys.sp_addextendedproperty 'MS_Description', N'字段权限资源与类绑定表(系统级，无租户)', 'SCHEMA', N'dbo', 'TABLE', N'sys_field_resource_class'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'主键id', 'SCHEMA', N'dbo', 'TABLE', N'sys_field_resource_class', 'COLUMN', N'id'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'资源标识(关联 sys_field_resource.resource_key)', 'SCHEMA', N'dbo', 'TABLE', N'sys_field_resource_class', 'COLUMN', N'resource_key'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'类全限定名(VO/BO/ImportVo)', 'SCHEMA', N'dbo', 'TABLE', N'sys_field_resource_class', 'COLUMN', N'class_name'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'类角色(1读出口VO 2写入口BO 3导入ImportVo)', 'SCHEMA', N'dbo', 'TABLE', N'sys_field_resource_class', 'COLUMN', N'class_type'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'是否由 @FieldResource 注解扫描自动登记(0手工 1自动)', 'SCHEMA', N'dbo', 'TABLE', N'sys_field_resource_class', 'COLUMN', N'is_auto'
GO

-- 3. sys_field_permission 字段权限配置表（租户级）
-- 只存与「注解基线」不同的差异行：无 @Sensitive 的字段基线为可写，有 @Sensitive 的字段基线为脱敏。
-- 多主体命中取最宽松档位（授权是加法），与 @DataPermission 的多角色 OR 语义一致。
CREATE TABLE sys_field_permission
(
    id           bigint                            NOT NULL,
    tenant_id    nvarchar(20)  DEFAULT ('000000')  NULL,
    subject_type nchar(1)      DEFAULT ('1')       NOT NULL,
    subject_id   bigint                            NOT NULL,
    resource_key nvarchar(100)                     NOT NULL,
    field_name   nvarchar(64)                      NOT NULL,
    access_type  nchar(1)      DEFAULT ('3')       NULL,
    strategy     nvarchar(32)                      NULL,
    include_sub  nchar(1)      DEFAULT ('1')       NULL,
    create_dept  bigint                            NULL,
    create_by    bigint                            NULL,
    create_time  datetime2(7)                      NULL,
    update_by    bigint                            NULL,
    update_time  datetime2(7)                      NULL,
    remark       nvarchar(255)                     NULL,
    is_deleted   nchar(1)      DEFAULT ('0')       NULL,
    CONSTRAINT PK_sys_field_permission PRIMARY KEY CLUSTERED (id)
)
GO

CREATE UNIQUE INDEX uk_sys_field_perm_srf ON sys_field_permission(tenant_id, subject_type, subject_id, resource_key, field_name)
GO
CREATE INDEX idx_sys_field_perm_sr ON sys_field_permission(subject_type, subject_id, resource_key)
GO

EXEC sys.sp_addextendedproperty 'MS_Description', N'字段权限配置表', 'SCHEMA', N'dbo', 'TABLE', N'sys_field_permission'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'主键id', 'SCHEMA', N'dbo', 'TABLE', N'sys_field_permission', 'COLUMN', N'id'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'租户id', 'SCHEMA', N'dbo', 'TABLE', N'sys_field_permission', 'COLUMN', N'tenant_id'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'授权主体类型(1角色 2部门 3用户)', 'SCHEMA', N'dbo', 'TABLE', N'sys_field_permission', 'COLUMN', N'subject_type'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'主体id(角色id/部门id/用户id)', 'SCHEMA', N'dbo', 'TABLE', N'sys_field_permission', 'COLUMN', N'subject_id'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'资源标识(关联 sys_field_resource.resource_key)', 'SCHEMA', N'dbo', 'TABLE', N'sys_field_permission', 'COLUMN', N'resource_key'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'字段名(VO属性名，如 idCard)', 'SCHEMA', N'dbo', 'TABLE', N'sys_field_permission', 'COLUMN', N'field_name'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'访问档位(0隐藏 1脱敏 2只读 3可写)', 'SCHEMA', N'dbo', 'TABLE', N'sys_field_permission', 'COLUMN', N'access_type'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'脱敏策略(access_type=1时生效，取 SensitiveStrategy 枚举名，如 PHONE)', 'SCHEMA', N'dbo', 'TABLE', N'sys_field_permission', 'COLUMN', N'strategy'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'部门主体是否含子部门(0否 1是，仅 subject_type=2 生效)', 'SCHEMA', N'dbo', 'TABLE', N'sys_field_permission', 'COLUMN', N'include_sub'
GO

-- ----------------------------------------------------------------------------
-- 4. 字典：字段访问档位 + 字段权限主体类型
-- ----------------------------------------------------------------------------
-- is_default 遵循框架「1是 0否」约定，绝不能写原版 RuoYi 的 'Y'/'N'
-- 中文字面量统一加 N 前缀，否则非 Unicode 排序规则下会变成问号

INSERT INTO sys_dict_type
SELECT 24, '000000', N'字段访问档位', 'sys_field_access', '1', '1', 100, 1, GETDATE(), NULL, NULL, N'字段级权限的四种访问档位'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_type WHERE dict_type = 'sys_field_access');
GO

INSERT INTO sys_dict_type
SELECT 25, '000000', N'字段权限主体类型', 'sys_field_subject', '1', '1', 100, 1, GETDATE(), NULL, NULL, N'字段权限的三种授权主体'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_type WHERE dict_type = 'sys_field_subject');
GO

INSERT INTO sys_dict_data
SELECT 132, '000000', 1, N'隐藏', '0', 'sys_field_access', '', 'info', '0', '1', 100, 1, GETDATE(), NULL, NULL, N'字段整体不下发，JSON 无该 key、Excel 无该列'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_data WHERE dict_type = 'sys_field_access' AND dict_value = '0');
GO

INSERT INTO sys_dict_data
SELECT 133, '000000', 2, N'脱敏', '1', 'sys_field_access', '', 'warning', '0', '1', 100, 1, GETDATE(), NULL, NULL, N'值打码，不可改'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_data WHERE dict_type = 'sys_field_access' AND dict_value = '1');
GO

INSERT INTO sys_dict_data
SELECT 134, '000000', 3, N'只读', '2', 'sys_field_access', '', 'primary', '0', '1', 100, 1, GETDATE(), NULL, NULL, N'可读，提交时忽略改动'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_data WHERE dict_type = 'sys_field_access' AND dict_value = '2');
GO

INSERT INTO sys_dict_data
SELECT 135, '000000', 4, N'可写', '3', 'sys_field_access', '', 'success', '1', '1', 100, 1, GETDATE(), NULL, NULL, N'可读可改(无注解字段的默认档)'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_data WHERE dict_type = 'sys_field_access' AND dict_value = '3');
GO

INSERT INTO sys_dict_data
SELECT 136, '000000', 1, N'角色', '1', 'sys_field_subject', '', 'primary', '1', '1', 100, 1, GETDATE(), NULL, NULL, N'按角色授权(最常用)'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_data WHERE dict_type = 'sys_field_subject' AND dict_value = '1');
GO

INSERT INTO sys_dict_data
SELECT 137, '000000', 2, N'部门', '2', 'sys_field_subject', '', 'success', '0', '1', 100, 1, GETDATE(), NULL, NULL, N'按部门授权，可含子部门'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_data WHERE dict_type = 'sys_field_subject' AND dict_value = '2');
GO

INSERT INTO sys_dict_data
SELECT 138, '000000', 3, N'用户', '3', 'sys_field_subject', '', 'warning', '0', '1', 100, 1, GETDATE(), NULL, NULL, N'按用户授权(临时/例外场景)'
WHERE NOT EXISTS (SELECT 1 FROM sys_dict_data WHERE dict_type = 'sys_field_subject' AND dict_value = '3');
GO


-- ----------------------------------------------------------------------------
-- 5. 菜单：系统管理 > 字段权限
-- ----------------------------------------------------------------------------
-- icon 用 permission（图标库里存在的名字；写不存在的名字菜单会渲染成空白）

INSERT INTO sys_menu
SELECT 1650, N'字段权限', 1, 12, 'fieldPermission', 'system/fieldPermission/fieldPermission', '', '0', '1', 'C', '1', '1', 'system:fieldPermission:view', 'permission', 100, 1, GETDATE(), NULL, NULL, N'字段级权限配置菜单'
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE menu_id = 1650);
GO

INSERT INTO sys_menu
SELECT 1651, N'字段权限查询', 1650, 1, '#', '', '', '0', '1', 'F', '1', '1', 'system:fieldPermission:query', '#', 100, 1, GETDATE(), NULL, NULL, ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE menu_id = 1651);
GO

INSERT INTO sys_menu
SELECT 1652, N'字段权限配置', 1650, 2, '#', '', '', '0', '1', 'F', '1', '1', 'system:fieldPermission:update', '#', 100, 1, GETDATE(), NULL, NULL, ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE menu_id = 1652);
GO

INSERT INTO sys_menu
SELECT 1653, N'资源元信息维护', 1650, 3, '#', '', '', '0', '1', 'F', '1', '1', 'system:fieldResource:manage', '#', 100, 1, GETDATE(), NULL, NULL, N'仅改中文名/分组/排序，类绑定由注解扫描维护'
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE menu_id = 1653);
GO

INSERT INTO sys_menu
SELECT 1654, N'字段权限预览', 1650, 4, '#', '', '', '0', '1', 'F', '1', '1', 'system:fieldPermission:preview', '#', 100, 1, GETDATE(), NULL, NULL, ''
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE menu_id = 1654);
GO


-- ----------------------------------------------------------------------------
-- 6. 把新菜单授权给超级管理员角色（role_id = 1）
-- ----------------------------------------------------------------------------
-- 超管走 isSuperAdmin() 旁路不受字段权限约束，但仍需菜单可见才能进配置页
INSERT INTO sys_role_menu (role_id, menu_id)
SELECT 1, m.menu_id FROM sys_menu m
WHERE m.menu_id BETWEEN 1650 AND 1654
  AND NOT EXISTS (SELECT 1 FROM sys_role_menu rm WHERE rm.role_id = 1 AND rm.menu_id = m.menu_id);
GO

-- ============================================================================
-- 执行后检查
-- ============================================================================
-- 1. 重启应用，启动日志应出现：
--    「字段权限资源扫描完成：N 个类 / 新增资源 M 个 / 失效绑定 0 行 / 类反查缓存 N 条」
-- 2. 核对扫描结果（未标 @FieldResource 的类不会出现，属正常）：
--    select resource_key, resource_name, module_name from sys_field_resource;
--    select resource_key, class_name, class_type from sys_field_resource_class;
-- 3. 登录后进「系统管理 → 字段权限」，左侧应能看到已登记的资源

-- ============================================================================
-- 回滚 SQL（如升级后需回退）
-- ============================================================================
-- DELETE FROM sys_role_menu WHERE menu_id BETWEEN 1650 AND 1654;
-- DELETE FROM sys_menu WHERE menu_id BETWEEN 1650 AND 1654;
-- DELETE FROM sys_dict_data WHERE dict_type IN ('sys_field_access', 'sys_field_subject');
-- DELETE FROM sys_dict_type WHERE dict_type IN ('sys_field_access', 'sys_field_subject');
-- DROP TABLE IF EXISTS sys_field_permission;
-- DROP TABLE IF EXISTS sys_field_resource_class;
-- DROP TABLE IF EXISTS sys_field_resource;
--
-- ⚠️ 回滚会删掉 sys_field_permission 里已配置的全部字段权限。
--    若生产上已配过差异化权限，请先导出该表数据再执行 DROP。
--    另外回滚后必须把代码一并回退：残留的 @FieldResource 注解会让启动扫描器
--    去写已不存在的表，虽然扫描器整体包在 try/catch 里不至于启动失败，
--    但每次启动都会打一条 ERROR 日志。
