-- ============================================================================
-- 字段级权限隔离（列级权限） 增量升级脚本 (MySQL)
-- ============================================================================
-- 变更内容：
--   1. 新建 sys_field_resource         字段权限资源注册表（系统级，无 tenant_id）
--   2. 新建 sys_field_resource_class   资源与类绑定表（系统级，无 tenant_id）
--   3. 新建 sys_field_permission       字段权限配置表（租户级，有 tenant_id）
--   4. sys_dict_type / sys_dict_data 新增 2 个字典共 7 项
--   5. sys_menu 新增 1 个菜单 + 4 个按钮权限
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
--     有 @Sensitive 的字段基线为脱敏。基线若固定为可写，
--     「phone 带注解、想让 HR 看明文」就配不出来（配可写不落行 → 走注解兜底）。
-- 引入版本：2026-09 字段级权限批次
-- ----------------------------------------------------------------------------
-- 执行前必读：
--   1. 本脚本全部使用 CREATE TABLE IF NOT EXISTS / WHERE NOT EXISTS，可重复执行
--   2. 第 4-5 节按固定主键写入（字典 24/25、菜单 1650-1654）。
--      若这些 id 在你的实例上已被占用，请先改成空闲 id 再执行，
--      否则该条 INSERT 会被 WHERE NOT EXISTS 跳过，导致菜单/字典缺失
--   3. 执行后**必须重启应用**：资源与类绑定由启动扫描器写入，
--      不重启则 sys_field_resource / sys_field_resource_class 一直为空，
--      功能表现为「配置页左侧没有任何资源」
--   4. 升级后无需手工造数据，扫描器会自动登记已标 @FieldResource 的类
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. sys_field_resource 字段权限资源注册表（系统级，无租户）
-- ----------------------------------------------------------------------------
create table if not exists sys_field_resource
(
    id            bigint(20)   not null comment '主键id',
    resource_key  varchar(100) not null comment '资源标识(与菜单权限前缀一致，如 system:user)',
    resource_name varchar(100) not null comment '资源名称(如 用户管理，扫描时按 resource_key 反查 sys_menu.menu_name 自动填充，可改)',
    module_name   varchar(50)  default null comment '所属模块分组(如 系统管理/基础业务/商城管理)',
    sort_order    int(4)       default 999 comment '排序值',
    status        char(1)      default '1' comment '状态(0停用 1正常)',
    is_auto       char(1)      default '1' comment '是否由 @FieldResource 注解扫描自动登记(0手工 1自动)',
    create_dept   bigint(20)   default null comment '创建部门',
    create_by     bigint(20)   default null comment '创建人',
    create_time   datetime     default current_timestamp comment '创建时间',
    update_by     bigint(20)   default null comment '更新人',
    update_time   datetime     default current_timestamp on update current_timestamp comment '更新时间',
    remark        varchar(255) default null comment '备注',
    is_deleted    char(1)      default '0' comment '是否删除(0正常 1已删除)',
    primary key (id),
    unique key uk_resource_key (resource_key)
) engine = innodb comment = '字段权限资源注册表(系统级，无租户)';

-- ----------------------------------------------------------------------------
-- 2. sys_field_resource_class 资源与类绑定表（系统级，无租户）
-- ----------------------------------------------------------------------------
-- 一个资源对应多个类：sys_user 实测有 7 个 VO，只绑一个 VO 会让走导出 VO 的接口明文外泄。
-- class_type 决定喂给哪个出口：1 VO → JSON/Excel 导出；2 BO → JSON 写入拦截；3 ImportVo → Excel 导入拦截
create table if not exists sys_field_resource_class
(
    id           bigint(20)   not null comment '主键id',
    resource_key varchar(100) not null comment '资源标识(关联 sys_field_resource.resource_key)',
    class_name   varchar(255) not null comment '类全限定名(VO/BO/ImportVo)',
    class_type   char(1)      not null default '1' comment '类角色(1读出口VO 2写入口BO 3导入ImportVo)',
    is_auto      char(1)      default '1' comment '是否由 @FieldResource 注解扫描自动登记(0手工 1自动)',
    create_dept  bigint(20)   default null comment '创建部门',
    create_by    bigint(20)   default null comment '创建人',
    create_time  datetime     default current_timestamp comment '创建时间',
    update_by    bigint(20)   default null comment '更新人',
    update_time  datetime     default current_timestamp on update current_timestamp comment '更新时间',
    remark       varchar(255) default null comment '备注',
    is_deleted   char(1)      default '0' comment '是否删除(0正常 1已删除)',
    primary key (id),
    unique key uk_class_name (class_name),
    key idx_resource_key (resource_key)
) engine = innodb comment = '字段权限资源与类绑定表(系统级，无租户)';

-- ----------------------------------------------------------------------------
-- 3. sys_field_permission 字段权限配置表（租户级）
-- ----------------------------------------------------------------------------
-- 只存与「注解基线」不同的差异行。
-- 多主体命中取最宽松档位（授权是加法），与 @DataPermission 的多角色 OR 语义一致。
create table if not exists sys_field_permission
(
    id           bigint(20)   not null comment '主键id',
    tenant_id    varchar(20)  default '000000' comment '租户id',
    subject_type char(1)      not null default '1' comment '授权主体类型(1角色 2部门 3用户)',
    subject_id   bigint(20)   not null comment '主体id(角色id/部门id/用户id)',
    resource_key varchar(100) not null comment '资源标识(关联 sys_field_resource.resource_key)',
    field_name   varchar(64)  not null comment '字段名(VO属性名，如 idCard)',
    access_type  char(1)      default '3' comment '访问档位(0隐藏 1脱敏 2只读 3可写)',
    strategy     varchar(32)  default null comment '脱敏策略(access_type=1时生效，取 SensitiveStrategy 枚举名，如 PHONE)',
    include_sub  char(1)      default '1' comment '部门主体是否含子部门(0否 1是，仅 subject_type=2 生效)',
    create_dept  bigint(20)   default null comment '创建部门',
    create_by    bigint(20)   default null comment '创建人',
    create_time  datetime     default current_timestamp comment '创建时间',
    update_by    bigint(20)   default null comment '更新人',
    update_time  datetime     default current_timestamp on update current_timestamp comment '更新时间',
    remark       varchar(255) default null comment '备注',
    is_deleted   char(1)      default '0' comment '是否删除(0正常 1已删除)',
    primary key (id),
    unique key uk_subject_resource_field (tenant_id, subject_type, subject_id, resource_key, field_name),
    key idx_subject_resource (subject_type, subject_id, resource_key)
) engine = innodb comment = '字段权限配置表';

-- ----------------------------------------------------------------------------
-- 4. 字典：字段访问档位 + 字段权限主体类型
-- ----------------------------------------------------------------------------
-- is_default 遵循框架「1是 0否」约定，绝不能写原版 RuoYi 的 'Y'/'N'

insert into sys_dict_type (dict_id, tenant_id, dict_name, dict_type, is_system, status, create_dept, create_by,
                           create_time, update_by, update_time, remark)
select 24, '000000', '字段访问档位', 'sys_field_access', '1', '1', 100, 1, sysdate(), null, null, '字段级权限的四种访问档位'
from dual
where not exists (select 1 from sys_dict_type where dict_type = 'sys_field_access');

insert into sys_dict_type (dict_id, tenant_id, dict_name, dict_type, is_system, status, create_dept, create_by,
                           create_time, update_by, update_time, remark)
select 25, '000000', '字段权限主体类型', 'sys_field_subject', '1', '1', 100, 1, sysdate(), null, null, '字段权限的三种授权主体'
from dual
where not exists (select 1 from sys_dict_type where dict_type = 'sys_field_subject');

insert into sys_dict_data (dict_data_id, tenant_id, dict_sort, dict_label, dict_value, dict_type, css_class, list_class,
                           is_default, status, create_dept, create_by, create_time, update_by, update_time, remark)
select 132, '000000', 1, '隐藏', '0', 'sys_field_access', '', 'info', '0', '1', 100, 1, sysdate(), null, null,
       '字段整体不下发，JSON 无该 key、Excel 无该列'
from dual
where not exists (select 1 from sys_dict_data where dict_type = 'sys_field_access' and dict_value = '0');

insert into sys_dict_data (dict_data_id, tenant_id, dict_sort, dict_label, dict_value, dict_type, css_class, list_class,
                           is_default, status, create_dept, create_by, create_time, update_by, update_time, remark)
select 133, '000000', 2, '脱敏', '1', 'sys_field_access', '', 'warning', '0', '1', 100, 1, sysdate(), null, null,
       '值打码，不可改'
from dual
where not exists (select 1 from sys_dict_data where dict_type = 'sys_field_access' and dict_value = '1');

insert into sys_dict_data (dict_data_id, tenant_id, dict_sort, dict_label, dict_value, dict_type, css_class, list_class,
                           is_default, status, create_dept, create_by, create_time, update_by, update_time, remark)
select 134, '000000', 3, '只读', '2', 'sys_field_access', '', 'primary', '0', '1', 100, 1, sysdate(), null, null,
       '可读，提交时忽略改动'
from dual
where not exists (select 1 from sys_dict_data where dict_type = 'sys_field_access' and dict_value = '2');

insert into sys_dict_data (dict_data_id, tenant_id, dict_sort, dict_label, dict_value, dict_type, css_class, list_class,
                           is_default, status, create_dept, create_by, create_time, update_by, update_time, remark)
select 135, '000000', 4, '可写', '3', 'sys_field_access', '', 'success', '1', '1', 100, 1, sysdate(), null, null,
       '可读可改(无注解字段的默认档)'
from dual
where not exists (select 1 from sys_dict_data where dict_type = 'sys_field_access' and dict_value = '3');

insert into sys_dict_data (dict_data_id, tenant_id, dict_sort, dict_label, dict_value, dict_type, css_class, list_class,
                           is_default, status, create_dept, create_by, create_time, update_by, update_time, remark)
select 136, '000000', 1, '角色', '1', 'sys_field_subject', '', 'primary', '1', '1', 100, 1, sysdate(), null, null,
       '按角色授权(最常用)'
from dual
where not exists (select 1 from sys_dict_data where dict_type = 'sys_field_subject' and dict_value = '1');

insert into sys_dict_data (dict_data_id, tenant_id, dict_sort, dict_label, dict_value, dict_type, css_class, list_class,
                           is_default, status, create_dept, create_by, create_time, update_by, update_time, remark)
select 137, '000000', 2, '部门', '2', 'sys_field_subject', '', 'success', '0', '1', 100, 1, sysdate(), null, null,
       '按部门授权，可含子部门'
from dual
where not exists (select 1 from sys_dict_data where dict_type = 'sys_field_subject' and dict_value = '2');

insert into sys_dict_data (dict_data_id, tenant_id, dict_sort, dict_label, dict_value, dict_type, css_class, list_class,
                           is_default, status, create_dept, create_by, create_time, update_by, update_time, remark)
select 138, '000000', 3, '用户', '3', 'sys_field_subject', '', 'warning', '0', '1', 100, 1, sysdate(), null, null,
       '按用户授权(临时/例外场景)'
from dual
where not exists (select 1 from sys_dict_data where dict_type = 'sys_field_subject' and dict_value = '3');

-- ----------------------------------------------------------------------------
-- 5. 菜单：系统管理 > 字段权限
-- ----------------------------------------------------------------------------
-- icon 用 permission（图标库里存在的名字；写不存在的名字菜单会渲染成空白）

insert into sys_menu (menu_id, menu_name, parent_id, order_num, path, component, query_param, is_external_link,
                      is_cache, menu_type, visible, status, perms, icon, create_dept, create_by, create_time,
                      update_by, update_time, remark)
select 1650, '字段权限', 1, 12, 'fieldPermission', 'system/fieldPermission/fieldPermission', '', '0', '1', 'C', '1', '1',
       'system:fieldPermission:view', 'permission', 100, 1, sysdate(), null, null, '字段级权限配置菜单'
from dual
where not exists (select 1 from sys_menu where menu_id = 1650);

insert into sys_menu (menu_id, menu_name, parent_id, order_num, path, component, query_param, is_external_link,
                      is_cache, menu_type, visible, status, perms, icon, create_dept, create_by, create_time,
                      update_by, update_time, remark)
select 1651, '字段权限查询', 1650, 1, '#', '', '', '0', '1', 'F', '1', '1', 'system:fieldPermission:query', '#',
       100, 1, sysdate(), null, null, ''
from dual
where not exists (select 1 from sys_menu where menu_id = 1651);

insert into sys_menu (menu_id, menu_name, parent_id, order_num, path, component, query_param, is_external_link,
                      is_cache, menu_type, visible, status, perms, icon, create_dept, create_by, create_time,
                      update_by, update_time, remark)
select 1652, '字段权限配置', 1650, 2, '#', '', '', '0', '1', 'F', '1', '1', 'system:fieldPermission:update', '#',
       100, 1, sysdate(), null, null, ''
from dual
where not exists (select 1 from sys_menu where menu_id = 1652);

insert into sys_menu (menu_id, menu_name, parent_id, order_num, path, component, query_param, is_external_link,
                      is_cache, menu_type, visible, status, perms, icon, create_dept, create_by, create_time,
                      update_by, update_time, remark)
select 1653, '资源元信息维护', 1650, 3, '#', '', '', '0', '1', 'F', '1', '1', 'system:fieldResource:manage', '#',
       100, 1, sysdate(), null, null, '仅改中文名/分组/排序，类绑定由注解扫描维护'
from dual
where not exists (select 1 from sys_menu where menu_id = 1653);

insert into sys_menu (menu_id, menu_name, parent_id, order_num, path, component, query_param, is_external_link,
                      is_cache, menu_type, visible, status, perms, icon, create_dept, create_by, create_time,
                      update_by, update_time, remark)
select 1654, '字段权限预览', 1650, 4, '#', '', '', '0', '1', 'F', '1', '1', 'system:fieldPermission:preview', '#',
       100, 1, sysdate(), null, null, ''
from dual
where not exists (select 1 from sys_menu where menu_id = 1654);

-- ----------------------------------------------------------------------------
-- 6. 把新菜单授权给超级管理员角色（role_id = 1）
-- ----------------------------------------------------------------------------
-- 超管走 isSuperAdmin() 旁路不受字段权限约束，但仍需菜单可见才能进配置页
insert into sys_role_menu (role_id, menu_id)
select 1, m.menu_id
from sys_menu m
where m.menu_id between 1650 and 1654
  and not exists (select 1 from sys_role_menu rm where rm.role_id = 1 and rm.menu_id = m.menu_id);

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
-- delete from sys_role_menu where menu_id between 1650 and 1654;
-- delete from sys_menu where menu_id between 1650 and 1654;
-- delete from sys_dict_data where dict_type in ('sys_field_access', 'sys_field_subject');
-- delete from sys_dict_type where dict_type in ('sys_field_access', 'sys_field_subject');
-- drop table if exists sys_field_permission;
-- drop table if exists sys_field_resource_class;
-- drop table if exists sys_field_resource;
--
-- ⚠️ 回滚会删掉 sys_field_permission 里已配置的全部字段权限。
--    若生产上已配过差异化权限，请先导出该表数据再执行 DROP。
--    另外回滚后必须把代码一并回退：残留的 @FieldResource 注解会让启动扫描器
--    去写已不存在的表，虽然扫描器整体包在 try/catch 里不至于启动失败，
--    但每次启动都会打一条 ERROR 日志。
