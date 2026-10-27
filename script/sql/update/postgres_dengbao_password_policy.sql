-- ============================================================================
-- 等保二级（GB/T 22239-2019 第二级）整改 增量升级脚本 (PostgreSQL)
-- ============================================================================
-- 变更内容：
--   1. sys_user 新增 pwd_update_date（密码最后修改时间）+ pwd_history（历史密码，防重用）
--   2. 新建 sys_oper_log_archive / sys_login_log_archive（审计日志归档）
--      注：错误日志（sys_error_log）不归档 —— 它是系统异常堆栈，属运维排障数据，
--      不在等保 8.1.4.3「用户行为与安全事件」的审计范围内，且自带 handle_status
--      等可修改字段，与归档表「不可变」的语义冲突
--   3. sys_config 新增 8 条参数（密码策略 7 条 + 日志保留 1 条），修改初始密码 1 条
-- 触发原因：
--   等保二级测评中 4 项判定不符合，本脚本覆盖其中 2 项的表结构前置：
--   · 8.1.4.1 a「身份鉴别信息具有复杂度要求并定期更换」
--   · 8.1.4.3 c「应对审计记录进行保护，定期备份，避免受到未预期的删除、修改或覆盖」
-- 引入版本：2026-09 等保整改批次
-- ----------------------------------------------------------------------------
-- PostgreSQL 特有说明：
--   1. 全脚本幂等：ADD COLUMN IF NOT EXISTS、CREATE TABLE IF NOT EXISTS、
--      INSERT ... WHERE NOT EXISTS，可安全重复执行
--   2. 不支持 AFTER 指定列位置，pwd_update_date 追加到表末尾（不影响功能）
--   3. MySQL 的 text/mediumtext → text；datetime → timestamp；bigint → int8
--      int → int4；char(1) → char（PG 的 char 默认长度即 1，与现有脚本一致）
--   4. 🔴 PG 对非字符串类型不支持 LIKE，代码层查询这些表须用 likeCast()
-- 升级前请备份 sys_user / sys_config 两张表！
-- ============================================================================


-- ============================================================================
-- 1. sys_user 新增密码策略相关列（改密时间 + 历史密码）
-- ============================================================================
-- NULL 表示「从未改过密码」，用于触发首次登录强制改密，无需额外标志位。
ALTER TABLE sys_user ADD COLUMN IF NOT EXISTS pwd_update_date timestamp DEFAULT NULL;
COMMENT ON COLUMN sys_user.pwd_update_date IS '密码最后修改时间';
ALTER TABLE sys_user ADD COLUMN IF NOT EXISTS pwd_history varchar(1000) DEFAULT NULL;
COMMENT ON COLUMN sys_user.pwd_history IS '历史密码(BCrypt密文,逗号分隔,最新在前)';

-- 存量用户豁免（可选）：存量用户升级后该字段为 NULL，若 force-change-init 开着，
-- 所有存量用户下次登录都会被要求改密。不可接受时放开下面这行。
-- UPDATE sys_user SET pwd_update_date = now() WHERE pwd_update_date IS NULL;


-- ============================================================================
-- 2.1 新建 sys_oper_log_archive 操作日志归档表
-- ============================================================================
-- 字段完全镜像 sys_oper_log，仅追加 archive_time。主键沿用 oper_id：
-- 归档是「搬移」不是「复制」，主表已删除故不冲突，保留原 ID 便于追溯。
-- 本表刻意不建 Controller / DAO —— 无对外接口即是「防未预期删除」的实现本身。
-- 索引比主表精简（去掉 oper_type / status）：冷数据只做时间范围追溯。
CREATE TABLE IF NOT EXISTS sys_oper_log_archive
(
    oper_id         int8,
    tenant_id       varchar(20)  default '000000'::varchar,
    title           varchar(50)  default ''::varchar,
    oper_type       varchar(8)   default ''::varchar,
    method          varchar(100) default ''::varchar,
    request_method  varchar(10)  default ''::varchar,
    operator_type   varchar(20)  default ''::varchar,
    oper_name       varchar(50)  default ''::varchar,
    dept_name       varchar(50)  default ''::varchar,
    oper_url        varchar(255) default ''::varchar,
    oper_ip         varchar(128) default ''::varchar,
    oper_location   varchar(255) default ''::varchar,
    oper_param      text,
    json_result     text,
    status          char         default '1'::bpchar,
    error_msg       text,
    oper_time       timestamp,
    cost_time       int8         default 0,
    archive_time    timestamp    default now(),
    constraint sys_oper_log_archive_pk primary key (oper_id)
);

create index if not exists idx_sys_oper_log_ar_ot on sys_oper_log_archive (oper_time);
create index if not exists idx_sys_oper_log_ar_tid on sys_oper_log_archive (tenant_id);

comment on table  sys_oper_log_archive                is '操作日志归档表(仅DBA可删)';
comment on column sys_oper_log_archive.oper_id        is '日志主键';
comment on column sys_oper_log_archive.tenant_id      is '租户id';
comment on column sys_oper_log_archive.title          is '模块标题';
comment on column sys_oper_log_archive.oper_type      is '操作类型';
comment on column sys_oper_log_archive.method         is '方法名称';
comment on column sys_oper_log_archive.request_method is '请求方式';
comment on column sys_oper_log_archive.operator_type  is '操作用户类别';
comment on column sys_oper_log_archive.oper_name      is '操作人员';
comment on column sys_oper_log_archive.dept_name      is '部门名称';
comment on column sys_oper_log_archive.oper_url       is '请求URL';
comment on column sys_oper_log_archive.oper_ip        is '主机地址';
comment on column sys_oper_log_archive.oper_location  is '操作地点';
comment on column sys_oper_log_archive.oper_param     is '请求参数';
comment on column sys_oper_log_archive.json_result    is '返回参数';
comment on column sys_oper_log_archive.status         is '操作结果';
comment on column sys_oper_log_archive.error_msg      is '错误消息';
comment on column sys_oper_log_archive.oper_time      is '操作时间';
comment on column sys_oper_log_archive.cost_time      is '消耗时间';
comment on column sys_oper_log_archive.archive_time   is '归档时间';


-- ============================================================================
-- 2.2 新建 sys_login_log_archive 登录日志归档表
-- ============================================================================
-- 注意：本项目登录日志表名是 sys_login_log，不是原版 RuoYi 的 sys_logininfor。
CREATE TABLE IF NOT EXISTS sys_login_log_archive
(
    info_id             int8,
    tenant_id           varchar(20)  default '000000'::varchar,
    user_id             int8,
    user_name           varchar(50)  default ''::varchar,
    device_type         varchar(32)  default ''::varchar,
    ipaddr              varchar(128) default ''::varchar,
    login_location      varchar(255) default ''::varchar,
    browser             varchar(50)  default ''::varchar,
    os                  varchar(50)  default ''::varchar,
    status              char         default '1'::bpchar,
    msg                 varchar(255) default ''::varchar,
    login_time          timestamp,
    archive_time        timestamp    default now(),
    constraint sys_login_log_archive_pk primary key (info_id)
);

create index if not exists idx_sys_login_log_ar_lt on sys_login_log_archive (login_time);
create index if not exists idx_sys_login_log_ar_tid on sys_login_log_archive (tenant_id);

comment on table  sys_login_log_archive                 is '登录日志归档表(仅DBA可删)';
comment on column sys_login_log_archive.info_id         is '访问ID';
comment on column sys_login_log_archive.tenant_id       is '租户id';
comment on column sys_login_log_archive.user_id         is '用户id';
comment on column sys_login_log_archive.user_name       is '用户账号';
comment on column sys_login_log_archive.device_type     is '设备类型';
comment on column sys_login_log_archive.ipaddr          is '登录IP地址';
comment on column sys_login_log_archive.login_location  is '登录地点';
comment on column sys_login_log_archive.browser         is '浏览器类型';
comment on column sys_login_log_archive.os              is '操作系统';
comment on column sys_login_log_archive.status          is '登录状态';
comment on column sys_login_log_archive.msg             is '提示消息';
comment on column sys_login_log_archive.login_time      is '访问时间';
comment on column sys_login_log_archive.archive_time    is '归档时间';


-- ============================================================================
-- 3. sys_config 新增参数
-- ============================================================================
-- config_id 取 100 起始段，避开框架内置的 1-99 保留段，防止后续框架升级新增参数时撞主键。
-- 全部使用 WHERE NOT EXISTS 判重：重复执行不会报错，也不会覆盖你已经调整过的值。
--
-- 多租户提醒：本节只为默认租户 '000000' 插入参数。若系统启用了多租户，
-- 新建租户不会自动拥有这些参数（可用「租户管理 → 同步租户参数」补齐）
-- —— 代码层读取时必须带硬编码兜底默认值，否则新租户登录即报错。

INSERT INTO sys_config (config_id, tenant_id, config_name, config_key, config_value, config_type,
                        create_dept, create_by, create_time, update_by, update_time, remark)
SELECT 100, '000000', '密码策略-最小长度', 'system.password.min-length', '8', '1',
       100, 1, now(), NULL, NULL, '密码最小长度，等保二级建议不低于8位'
WHERE NOT EXISTS (SELECT 1 FROM sys_config WHERE config_key = 'system.password.min-length');

INSERT INTO sys_config (config_id, tenant_id, config_name, config_key, config_value, config_type,
                        create_dept, create_by, create_time, update_by, update_time, remark)
SELECT 101, '000000', '密码策略-复杂度要求', 'system.password.complexity', '3', '1',
       100, 1, now(), NULL, NULL, '密码需满足 大写字母/小写字母/数字/特殊字符 四类中的几类，取值1-4'
WHERE NOT EXISTS (SELECT 1 FROM sys_config WHERE config_key = 'system.password.complexity');

INSERT INTO sys_config (config_id, tenant_id, config_name, config_key, config_value, config_type,
                        create_dept, create_by, create_time, update_by, update_time, remark)
SELECT 102, '000000', '密码策略-管理端有效期(天)', 'system.password.expire-days.pc', '180', '1',
       100, 1, now(), NULL, NULL, 'PC管理端(pc_user)密码有效期天数。填 0 表示永不过期'
WHERE NOT EXISTS (SELECT 1 FROM sys_config WHERE config_key = 'system.password.expire-days.pc');

INSERT INTO sys_config (config_id, tenant_id, config_name, config_key, config_value, config_type,
                        create_dept, create_by, create_time, update_by, update_time, remark)
SELECT 103, '000000', '密码策略-移动端有效期(天)', 'system.password.expire-days.app', '0', '1',
       100, 1, now(), NULL, NULL, '移动端(app_user)密码有效期天数。默认 0 = 永不过期'
WHERE NOT EXISTS (SELECT 1 FROM sys_config WHERE config_key = 'system.password.expire-days.app');

INSERT INTO sys_config (config_id, tenant_id, config_name, config_key, config_value, config_type,
                        create_dept, create_by, create_time, update_by, update_time, remark)
SELECT 104, '000000', '密码策略-到期提醒天数', 'system.password.expire-notify-days', '15', '1',
       100, 1, now(), NULL, NULL, '密码到期前多少天开始提醒，避免用户被突然要求改密'
WHERE NOT EXISTS (SELECT 1 FROM sys_config WHERE config_key = 'system.password.expire-notify-days');

INSERT INTO sys_config (config_id, tenant_id, config_name, config_key, config_value, config_type,
                        create_dept, create_by, create_time, update_by, update_time, remark)
SELECT 105, '000000', '密码策略-历史密码禁用次数', 'system.password.history-count', '3', '1',
       100, 1, now(), NULL, NULL, '新密码不得与最近N次历史密码重复。填 0 表示不校验'
WHERE NOT EXISTS (SELECT 1 FROM sys_config WHERE config_key = 'system.password.history-count');

INSERT INTO sys_config (config_id, tenant_id, config_name, config_key, config_value, config_type,
                        create_dept, create_by, create_time, update_by, update_time, remark)
SELECT 106, '000000', '密码策略-首次登录强制改密', 'system.password.force-change-init', '1', '1',
       100, 1, now(), NULL, NULL, '新建用户或管理员重置密码后，首次登录是否强制修改密码（1是 0否）'
WHERE NOT EXISTS (SELECT 1 FROM sys_config WHERE config_key = 'system.password.force-change-init');

INSERT INTO sys_config (config_id, tenant_id, config_name, config_key, config_value, config_type,
                        create_dept, create_by, create_time, update_by, update_time, remark)
SELECT 107, '000000', '审计日志-主表保留天数', 'system.log.retain-days', '180', '1',
       100, 1, now(), NULL, NULL, '超过该天数的审计日志自动归档至归档表。等保二级要求留存不少于6个月(180天)'
WHERE NOT EXISTS (SELECT 1 FROM sys_config WHERE config_key = 'system.log.retain-days');


-- ============================================================================
-- 4. 修改初始密码（弱口令 123456 属等保不符合项）
-- ============================================================================
-- 仅当仍为框架默认值 123456 时才改，已自行调整过的实例不受影响。
-- RuoYi.Plus@888 是框架公开默认值，生产环境请在「系统管理 → 参数设置」中改成自己的强口令。
UPDATE sys_config
SET config_value = 'RuoYi.Plus@888',
    remark       = '新用户创建时的默认初始密码。生产环境必须修改为自定义强口令！',
    update_time  = now()
WHERE config_key = 'system.user.initial-password'
  AND config_value = '123456';


-- ============================================================================
-- 验证语句（执行完可跑一遍确认）
-- ============================================================================
-- SELECT config_id, config_key, config_value FROM sys_config
--  WHERE config_key LIKE 'system.password%' OR config_key = 'system.log.retain-days'
--  ORDER BY config_id;
-- SELECT column_name FROM information_schema.columns
--  WHERE table_name = 'sys_user' AND column_name IN ('pwd_update_date', 'pwd_history');
-- SELECT tablename FROM pg_tables WHERE tablename LIKE '%_archive';


-- ============================================================================
-- 回滚 SQL（如升级后需回退）
-- ============================================================================
-- ALTER TABLE sys_user DROP COLUMN IF EXISTS pwd_update_date;
-- ALTER TABLE sys_user DROP COLUMN IF EXISTS pwd_history;
-- DROP TABLE IF EXISTS sys_oper_log_archive;
-- DROP TABLE IF EXISTS sys_login_log_archive;
-- DELETE FROM sys_config WHERE config_id BETWEEN 100 AND 107;
-- UPDATE sys_config SET config_value = '123456' WHERE config_key = 'system.user.initial-password';
--
-- 回滚会连同归档表里的历史审计日志一并删除。若已运行过归档任务，
-- 请先把归档表数据导出留存，再执行 DROP。
