-- ============================================================================
-- 字段级权限隔离（列级权限） 增量升级脚本 (Oracle)
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
--   · Oracle 无 CREATE TABLE IF NOT EXISTS：第 1-3 节的建表**不幂等**。
--     若提示 ORA-00955（名称已被现有对象使用），说明本脚本已执行过，
--     跳过建表部分、从第 4 节继续即可
--   · 第 4-6 节使用 WHERE NOT EXISTS，可重复执行
--   · 执行后**必须重启应用**：资源与类绑定由启动扫描器写入，
--     不重启则两张元数据表一直为空，表现为「配置页左侧没有任何资源」
--   · 字典 id 24/25、字典数据 id 132-138、菜单 id 1650-1654 为固定值，
--     若在你的实例上已被占用，请先改成空闲 id 再执行
-- ============================================================================

-- 三张表分两类：
--   表 1 / 表 2 是「哪个类属于哪个资源」的代码结构元数据，与 sys_menu 同性质，系统级、无 tenant_id，
--   由 @FieldResource 注解启动扫描自动登记；若按租户隔离，新租户开通后绑定表为空会导致全部放行。
--   表 3 是「谁能看什么」的授权数据，租户级。

-- 1. sys_field_resource 字段权限资源注册表（系统级）
create table sys_field_resource (
  id                number(20)     not null,
  resource_key      varchar2(100)  not null,
  resource_name     varchar2(100)  not null,
  module_name       varchar2(50)   default null,
  sort_order        number(4)      default 999,
  status            char(1)        default '1',
  is_auto           char(1)        default '1',
  create_dept       number(20)     default null,
  create_by         number(20)     default null,
  create_time       date,
  update_by         number(20)     default null,
  update_time       date,
  remark            varchar2(255)  default null,
  is_deleted        char(1)        default '0'
);

alter table sys_field_resource add constraint pk_sys_field_resource primary key (id);
create unique index uk_sys_field_resource_key on sys_field_resource (resource_key);

comment on table  sys_field_resource                is '字段权限资源注册表(系统级，无租户)';
comment on column sys_field_resource.id             is '主键id';
comment on column sys_field_resource.resource_key   is '资源标识(与菜单权限前缀一致，如 system:user)';
comment on column sys_field_resource.resource_name  is '资源名称(扫描时按 resource_key 反查 sys_menu.menu_name 自动填充，可改)';
comment on column sys_field_resource.module_name    is '所属模块分组(如 系统管理/基础业务/商城管理)';
comment on column sys_field_resource.sort_order     is '排序值';
comment on column sys_field_resource.status         is '状态(0停用 1正常)';
comment on column sys_field_resource.is_auto        is '是否由 @FieldResource 注解扫描自动登记(0手工 1自动)';
comment on column sys_field_resource.create_dept    is '创建部门';
comment on column sys_field_resource.create_by      is '创建人';
comment on column sys_field_resource.create_time    is '创建时间';
comment on column sys_field_resource.update_by      is '更新人';
comment on column sys_field_resource.update_time    is '更新时间';
comment on column sys_field_resource.remark         is '备注';
comment on column sys_field_resource.is_deleted     is '是否删除(0正常 1已删除)';

-- 2. sys_field_resource_class 资源与类绑定表（系统级）
-- 一个资源对应多个类：sys_user 实测有 7 个 VO，只绑一个 VO 会让走导出 VO 的接口明文外泄。
-- class_type 决定喂给哪个出口：1 VO 走 JSON/Excel 导出；2 BO 走 JSON 写入拦截；3 ImportVo 走 Excel 导入拦截
create table sys_field_resource_class (
  id                number(20)     not null,
  resource_key      varchar2(100)  not null,
  class_name        varchar2(255)  not null,
  class_type        char(1)        default '1' not null,
  is_auto           char(1)        default '1',
  create_dept       number(20)     default null,
  create_by         number(20)     default null,
  create_time       date,
  update_by         number(20)     default null,
  update_time       date,
  remark            varchar2(255)  default null,
  is_deleted        char(1)        default '0'
);

alter table sys_field_resource_class add constraint pk_sys_field_resource_class primary key (id);
create unique index uk_sys_field_res_class_name on sys_field_resource_class (class_name);
create index idx_sys_field_res_class_key on sys_field_resource_class (resource_key);

comment on table  sys_field_resource_class              is '字段权限资源与类绑定表(系统级，无租户)';
comment on column sys_field_resource_class.id           is '主键id';
comment on column sys_field_resource_class.resource_key is '资源标识(关联 sys_field_resource.resource_key)';
comment on column sys_field_resource_class.class_name   is '类全限定名(VO/BO/ImportVo)';
comment on column sys_field_resource_class.class_type   is '类角色(1读出口VO 2写入口BO 3导入ImportVo)';
comment on column sys_field_resource_class.is_auto      is '是否由 @FieldResource 注解扫描自动登记(0手工 1自动)';
comment on column sys_field_resource_class.create_dept  is '创建部门';
comment on column sys_field_resource_class.create_by    is '创建人';
comment on column sys_field_resource_class.create_time  is '创建时间';
comment on column sys_field_resource_class.update_by    is '更新人';
comment on column sys_field_resource_class.update_time  is '更新时间';
comment on column sys_field_resource_class.remark       is '备注';
comment on column sys_field_resource_class.is_deleted   is '是否删除(0正常 1已删除)';

-- 3. sys_field_permission 字段权限配置表（租户级）
-- 只存与「注解基线」不同的差异行：无 @Sensitive 的字段基线为可写，有 @Sensitive 的字段基线为脱敏。
-- 多主体命中取最宽松档位（授权是加法），与 @DataPermission 的多角色 OR 语义一致。
create table sys_field_permission (
  id                number(20)     not null,
  tenant_id         varchar2(20)   default '000000',
  subject_type      char(1)        default '1' not null,
  subject_id        number(20)     not null,
  resource_key      varchar2(100)  not null,
  field_name        varchar2(64)   not null,
  access_type       char(1)        default '3',
  strategy          varchar2(32)   default null,
  include_sub       char(1)        default '1',
  create_dept       number(20)     default null,
  create_by         number(20)     default null,
  create_time       date,
  update_by         number(20)     default null,
  update_time       date,
  remark            varchar2(255)  default null,
  is_deleted        char(1)        default '0'
);

alter table sys_field_permission add constraint pk_sys_field_permission primary key (id);
create unique index uk_sys_field_perm_srf on sys_field_permission (tenant_id, subject_type, subject_id, resource_key, field_name);
create index idx_sys_field_perm_sr on sys_field_permission (subject_type, subject_id, resource_key);

comment on table  sys_field_permission               is '字段权限配置表';
comment on column sys_field_permission.id            is '主键id';
comment on column sys_field_permission.tenant_id     is '租户id';
comment on column sys_field_permission.subject_type  is '授权主体类型(1角色 2部门 3用户)';
comment on column sys_field_permission.subject_id    is '主体id(角色id/部门id/用户id)';
comment on column sys_field_permission.resource_key  is '资源标识(关联 sys_field_resource.resource_key)';
comment on column sys_field_permission.field_name    is '字段名(VO属性名，如 idCard)';
comment on column sys_field_permission.access_type   is '访问档位(0隐藏 1脱敏 2只读 3可写)';
comment on column sys_field_permission.strategy      is '脱敏策略(access_type=1时生效，取 SensitiveStrategy 枚举名，如 PHONE)';
comment on column sys_field_permission.include_sub   is '部门主体是否含子部门(0否 1是，仅 subject_type=2 生效)';
comment on column sys_field_permission.create_dept   is '创建部门';
comment on column sys_field_permission.create_by     is '创建人';
comment on column sys_field_permission.create_time   is '创建时间';
comment on column sys_field_permission.update_by     is '更新人';
comment on column sys_field_permission.update_time   is '更新时间';
comment on column sys_field_permission.remark        is '备注';
comment on column sys_field_permission.is_deleted    is '是否删除(0正常 1已删除)';

-- ----------------------------------------------------------------------------
-- 4. 字典：字段访问档位 + 字段权限主体类型
-- ----------------------------------------------------------------------------
-- is_default 遵循框架「1是 0否」约定，绝不能写原版 RuoYi 的 'Y'/'N'

insert into sys_dict_type
select 24, '000000', '字段访问档位', 'sys_field_access', '1', '1', 100, 1, sysdate, null, null, '字段级权限的四种访问档位'
from dual where not exists (select 1 from sys_dict_type where dict_type = 'sys_field_access');

insert into sys_dict_type
select 25, '000000', '字段权限主体类型', 'sys_field_subject', '1', '1', 100, 1, sysdate, null, null, '字段权限的三种授权主体'
from dual where not exists (select 1 from sys_dict_type where dict_type = 'sys_field_subject');

insert into sys_dict_data
select 132, '000000', 1, '隐藏', '0', 'sys_field_access', '', 'info', '0', '1', 100, 1, sysdate, null, null, '字段整体不下发，JSON 无该 key、Excel 无该列'
from dual where not exists (select 1 from sys_dict_data where dict_type = 'sys_field_access' and dict_value = '0');

insert into sys_dict_data
select 133, '000000', 2, '脱敏', '1', 'sys_field_access', '', 'warning', '0', '1', 100, 1, sysdate, null, null, '值打码，不可改'
from dual where not exists (select 1 from sys_dict_data where dict_type = 'sys_field_access' and dict_value = '1');

insert into sys_dict_data
select 134, '000000', 3, '只读', '2', 'sys_field_access', '', 'primary', '0', '1', 100, 1, sysdate, null, null, '可读，提交时忽略改动'
from dual where not exists (select 1 from sys_dict_data where dict_type = 'sys_field_access' and dict_value = '2');

insert into sys_dict_data
select 135, '000000', 4, '可写', '3', 'sys_field_access', '', 'success', '1', '1', 100, 1, sysdate, null, null, '可读可改(无注解字段的默认档)'
from dual where not exists (select 1 from sys_dict_data where dict_type = 'sys_field_access' and dict_value = '3');

insert into sys_dict_data
select 136, '000000', 1, '角色', '1', 'sys_field_subject', '', 'primary', '1', '1', 100, 1, sysdate, null, null, '按角色授权(最常用)'
from dual where not exists (select 1 from sys_dict_data where dict_type = 'sys_field_subject' and dict_value = '1');

insert into sys_dict_data
select 137, '000000', 2, '部门', '2', 'sys_field_subject', '', 'success', '0', '1', 100, 1, sysdate, null, null, '按部门授权，可含子部门'
from dual where not exists (select 1 from sys_dict_data where dict_type = 'sys_field_subject' and dict_value = '2');

insert into sys_dict_data
select 138, '000000', 3, '用户', '3', 'sys_field_subject', '', 'warning', '0', '1', 100, 1, sysdate, null, null, '按用户授权(临时/例外场景)'
from dual where not exists (select 1 from sys_dict_data where dict_type = 'sys_field_subject' and dict_value = '3');

-- ----------------------------------------------------------------------------
-- 5. 菜单：系统管理 > 字段权限
-- ----------------------------------------------------------------------------
-- icon 用 permission（图标库里存在的名字；写不存在的名字菜单会渲染成空白）

insert into sys_menu
select 1650, '字段权限', 1, 12, 'fieldPermission', 'system/fieldPermission/fieldPermission', '', '0', '1', 'C', '1', '1', 'system:fieldPermission:view', 'permission', 100, 1, sysdate, null, null, '字段级权限配置菜单'
from dual where not exists (select 1 from sys_menu where menu_id = 1650);

insert into sys_menu
select 1651, '字段权限查询', 1650, 1, '#', '', '', '0', '1', 'F', '1', '1', 'system:fieldPermission:query', '#', 100, 1, sysdate, null, null, ''
from dual where not exists (select 1 from sys_menu where menu_id = 1651);

insert into sys_menu
select 1652, '字段权限配置', 1650, 2, '#', '', '', '0', '1', 'F', '1', '1', 'system:fieldPermission:update', '#', 100, 1, sysdate, null, null, ''
from dual where not exists (select 1 from sys_menu where menu_id = 1652);

insert into sys_menu
select 1653, '资源元信息维护', 1650, 3, '#', '', '', '0', '1', 'F', '1', '1', 'system:fieldResource:manage', '#', 100, 1, sysdate, null, null, '仅改中文名/分组/排序，类绑定由注解扫描维护'
from dual where not exists (select 1 from sys_menu where menu_id = 1653);

insert into sys_menu
select 1654, '字段权限预览', 1650, 4, '#', '', '', '0', '1', 'F', '1', '1', 'system:fieldPermission:preview', '#', 100, 1, sysdate, null, null, ''
from dual where not exists (select 1 from sys_menu where menu_id = 1654);

-- ----------------------------------------------------------------------------
-- 6. 把新菜单授权给超级管理员角色（role_id = 1）
-- ----------------------------------------------------------------------------
-- 超管走 isSuperAdmin() 旁路不受字段权限约束，但仍需菜单可见才能进配置页
insert into sys_role_menu (role_id, menu_id)
select 1, m.menu_id from sys_menu m
where m.menu_id between 1650 and 1654
  and not exists (select 1 from sys_role_menu rm where rm.role_id = 1 and rm.menu_id = m.menu_id);

COMMIT;

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
-- drop table sys_field_permission purge;
-- drop table sys_field_resource_class purge;
-- drop table sys_field_resource purge;
-- COMMIT;
--
-- ⚠️ 回滚会删掉 sys_field_permission 里已配置的全部字段权限。
--    若生产上已配过差异化权限，请先导出该表数据再执行 DROP。
--    另外回滚后必须把代码一并回退：残留的 @FieldResource 注解会让启动扫描器
--    去写已不存在的表，虽然扫描器整体包在 try/catch 里不至于启动失败，
--    但每次启动都会打一条 ERROR 日志。
