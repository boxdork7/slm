-- ============================================================================
-- 等保二级（GB/T 22239-2019 第二级）整改 增量升级脚本 (MySQL)
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
--     —— 原 sys_user 无密码修改时间字段，无法判断密码是否过期；无历史密码留存，无法防重用
--   · 8.1.4.3 c「应对审计记录进行保护，定期备份，避免受到未预期的删除、修改或覆盖」
--     —— 原三张审计表只有一键清空接口，日志一旦清掉不可追溯，且无 6 个月留存保障
-- 设计要点：
--   · 归档表刻意不建 Controller / DAO —— 无对外接口即是「防未预期删除」的实现本身，
--     想删只能 DBA 直连数据库，该动作在数据库审计日志里跑不掉
--   · 归档表保留 tenant_id 数据，查询时仍按租户隔离；只有归档搬移那段代码用
--     TenantHelper.ignore() 跨租户，**不要**把归档表加进 application.yml 的 tenant.excludes
--   · 归档表索引比主表精简 —— 冷数据只做时间范围追溯，索引多了拖慢归档批量写入
-- 引入版本：2026-09 等保整改批次
-- ----------------------------------------------------------------------------
-- 执行前必读：
--   1. 升级前请备份 sys_user / sys_config 两张表！
--   2. 第 1 节的 ALTER 不幂等，若提示 "Duplicate column name"
--      说明本脚本已执行过，跳过该节继续即可
--   3. 第 2-3 节使用 CREATE TABLE IF NOT EXISTS / WHERE NOT EXISTS，可重复执行
--   4. 执行后立刻重启应用，避免新旧 schema 混跑
-- ============================================================================


-- ============================================================================
-- 1. sys_user 新增密码策略相关列（改密时间 + 历史密码）
-- ============================================================================
-- NULL 天然表示「从未改过密码」，正好用于触发首次登录强制改密，无需额外标志位。
-- 存量用户升级后该字段均为 NULL：若 system.password.force-change-init 开着，
-- 所有存量用户下次登录都会被要求改密 —— 上线前请评估是否可接受，
-- 不可接受时执行本节末尾的「存量用户豁免」语句。
ALTER TABLE sys_user
    ADD COLUMN pwd_update_date datetime DEFAULT NULL COMMENT '密码最后修改时间' AFTER password,
    ADD COLUMN pwd_history varchar(1000) DEFAULT NULL COMMENT '历史密码(BCrypt密文,逗号分隔,最新在前)' AFTER pwd_update_date;

-- 存量用户豁免（可选）：把现有用户的密码修改时间设为当前时间，
-- 使其不被判定为「从未改密」，仅对新建用户强制首次改密。
-- UPDATE sys_user SET pwd_update_date = sysdate() WHERE pwd_update_date IS NULL;


-- ============================================================================
-- 2.1 新建 sys_oper_log_archive 操作日志归档表
-- ============================================================================
-- 字段完全镜像 sys_oper_log，仅追加 archive_time。
-- 主键沿用 oper_id：归档是「搬移」不是「复制」，主表已删除故不会冲突，保留原 ID 便于追溯。
-- 索引由主表的 3 个（oper_type / status / oper_time）精简为 2 个。
CREATE TABLE IF NOT EXISTS sys_oper_log_archive
(
    oper_id        bigint(20) NOT NULL COMMENT '日志主键',
    tenant_id      varchar(20)  DEFAULT '000000' COMMENT '租户id',
    title          varchar(50)  DEFAULT '' COMMENT '模块标题',
    oper_type      varchar(8)   DEFAULT '' COMMENT '操作类型',
    method         varchar(100) DEFAULT '' COMMENT '方法名称',
    request_method varchar(10)  DEFAULT '' COMMENT '请求方式',
    operator_type  varchar(20)  DEFAULT '' COMMENT '操作用户类别',
    oper_name      varchar(50)  DEFAULT '' COMMENT '操作人员',
    dept_name      varchar(50)  DEFAULT '' COMMENT '部门名称',
    oper_url       varchar(255) DEFAULT '' COMMENT '请求URL',
    oper_ip        varchar(128) DEFAULT '' COMMENT '主机地址',
    oper_location  varchar(255) DEFAULT '' COMMENT '操作地点',
    oper_param     text         DEFAULT NULL COMMENT '请求参数',
    json_result    text         DEFAULT NULL COMMENT '返回参数',
    status         char(1)      DEFAULT '1' COMMENT '操作结果',
    error_msg      text         DEFAULT NULL COMMENT '错误消息',
    oper_time      datetime COMMENT '操作时间',
    cost_time      bigint(20)   DEFAULT 0 COMMENT '消耗时间',
    archive_time   datetime     DEFAULT CURRENT_TIMESTAMP COMMENT '归档时间',
    PRIMARY KEY (oper_id),
    KEY idx_sys_oper_log_ar_ot (oper_time),
    KEY idx_sys_oper_log_ar_tid (tenant_id)
) ENGINE = innodb DEFAULT CHARSET = utf8mb4 COMMENT = '操作日志归档表(仅DBA可删)';


-- ============================================================================
-- 2.2 新建 sys_login_log_archive 登录日志归档表
-- ============================================================================
-- 注意：本项目登录日志表名是 sys_login_log，不是原版 RuoYi 的 sys_logininfor。
CREATE TABLE IF NOT EXISTS sys_login_log_archive
(
    info_id        bigint(20) NOT NULL COMMENT '访问ID',
    tenant_id      varchar(20)  DEFAULT '000000' COMMENT '租户id',
    user_id        bigint(20)   DEFAULT NULL COMMENT '用户id',
    user_name      varchar(50)  DEFAULT '' COMMENT '用户账号',
    device_type    varchar(32)  DEFAULT '' COMMENT '设备类型',
    ipaddr         varchar(128) DEFAULT '' COMMENT '登录IP地址',
    login_location varchar(255) DEFAULT '' COMMENT '登录地点',
    browser        varchar(50)  DEFAULT '' COMMENT '浏览器类型',
    os             varchar(50)  DEFAULT '' COMMENT '操作系统',
    status         char(1)      DEFAULT '1' COMMENT '登录状态',
    msg            varchar(255) DEFAULT '' COMMENT '提示消息',
    login_time     datetime COMMENT '访问时间',
    archive_time   datetime     DEFAULT CURRENT_TIMESTAMP COMMENT '归档时间',
    PRIMARY KEY (info_id),
    KEY idx_sys_login_log_ar_lt (login_time),
    KEY idx_sys_login_log_ar_tid (tenant_id)
) ENGINE = innodb DEFAULT CHARSET = utf8mb4 COMMENT = '登录日志归档表(仅DBA可删)';


-- ============================================================================
-- 3. sys_config 新增参数
-- ============================================================================
-- config_id 取 100 起始段，避开框架内置的 1-99 保留段，防止后续框架升级新增参数时撞主键。
-- 全部使用 WHERE NOT EXISTS 判重：重复执行不会报错，也不会覆盖你已经调整过的值。
--
-- 🔴 多租户提醒：本节只为默认租户 '000000' 插入参数。若系统启用了多租户，
--    新建租户不会自动拥有这些参数 —— 代码层读取时必须带硬编码兜底默认值
--    （ISysConfigService.getConfigByKey 取不到会返回空串），否则新租户登录即 NPE。

-- 3.1 密码最小长度
INSERT INTO sys_config (config_id, tenant_id, config_name, config_key, config_value, config_type,
                        create_dept, create_by, create_time, update_by, update_time, remark)
SELECT 100, '000000', '密码策略-最小长度', 'system.password.min-length', '8', '1',
       100, 1, sysdate(), NULL, NULL, '密码最小长度，等保二级建议不低于8位'
WHERE NOT EXISTS (SELECT 1 FROM sys_config WHERE config_key = 'system.password.min-length');

-- 3.2 密码复杂度
INSERT INTO sys_config (config_id, tenant_id, config_name, config_key, config_value, config_type,
                        create_dept, create_by, create_time, update_by, update_time, remark)
SELECT 101, '000000', '密码策略-复杂度要求', 'system.password.complexity', '3', '1',
       100, 1, sysdate(), NULL, NULL, '密码需满足 大写字母/小写字母/数字/特殊字符 四类中的几类，取值1-4'
WHERE NOT EXISTS (SELECT 1 FROM sys_config WHERE config_key = 'system.password.complexity');

-- 3.3 管理端密码有效期
INSERT INTO sys_config (config_id, tenant_id, config_name, config_key, config_value, config_type,
                        create_dept, create_by, create_time, update_by, update_time, remark)
SELECT 102, '000000', '密码策略-管理端有效期(天)', 'system.password.expire-days.pc', '180', '1',
       100, 1, sysdate(), NULL, NULL, 'PC管理端(pc_user)密码有效期天数。填 0 表示永不过期'
WHERE NOT EXISTS (SELECT 1 FROM sys_config WHERE config_key = 'system.password.expire-days.pc');

-- 3.4 C 端密码有效期（默认关闭）
INSERT INTO sys_config (config_id, tenant_id, config_name, config_key, config_value, config_type,
                        create_dept, create_by, create_time, update_by, update_time, remark)
SELECT 103, '000000', '密码策略-移动端有效期(天)', 'system.password.expire-days.app', '0', '1',
       100, 1, sysdate(), NULL, NULL, '移动端(app_user)密码有效期天数。默认 0 = 永不过期，C端用户不受定期改密影响'
WHERE NOT EXISTS (SELECT 1 FROM sys_config WHERE config_key = 'system.password.expire-days.app');

-- 3.5 到期提前提醒天数
INSERT INTO sys_config (config_id, tenant_id, config_name, config_key, config_value, config_type,
                        create_dept, create_by, create_time, update_by, update_time, remark)
SELECT 104, '000000', '密码策略-到期提醒天数', 'system.password.expire-notify-days', '15', '1',
       100, 1, sysdate(), NULL, NULL, '密码到期前多少天开始提醒，避免用户被突然要求改密'
WHERE NOT EXISTS (SELECT 1 FROM sys_config WHERE config_key = 'system.password.expire-notify-days');

-- 3.6 历史密码禁止重用次数
INSERT INTO sys_config (config_id, tenant_id, config_name, config_key, config_value, config_type,
                        create_dept, create_by, create_time, update_by, update_time, remark)
SELECT 105, '000000', '密码策略-历史密码禁用次数', 'system.password.history-count', '3', '1',
       100, 1, sysdate(), NULL, NULL, '新密码不得与最近N次历史密码重复。填 0 表示不校验'
WHERE NOT EXISTS (SELECT 1 FROM sys_config WHERE config_key = 'system.password.history-count');

-- 3.7 首次登录强制改密
INSERT INTO sys_config (config_id, tenant_id, config_name, config_key, config_value, config_type,
                        create_dept, create_by, create_time, update_by, update_time, remark)
SELECT 106, '000000', '密码策略-首次登录强制改密', 'system.password.force-change-init', '1', '1',
       100, 1, sysdate(), NULL, NULL, '新建用户或管理员重置密码后，首次登录是否强制修改密码（1是 0否）'
WHERE NOT EXISTS (SELECT 1 FROM sys_config WHERE config_key = 'system.password.force-change-init');

-- 3.8 审计日志主表保留天数
INSERT INTO sys_config (config_id, tenant_id, config_name, config_key, config_value, config_type,
                        create_dept, create_by, create_time, update_by, update_time, remark)
SELECT 107, '000000', '审计日志-主表保留天数', 'system.log.retain-days', '180', '1',
       100, 1, sysdate(), NULL, NULL, '超过该天数的审计日志自动归档至归档表。等保二级要求留存不少于6个月(180天)'
WHERE NOT EXISTS (SELECT 1 FROM sys_config WHERE config_key = 'system.log.retain-days');


-- ============================================================================
-- 4. 修改初始密码（弱口令 123456 属等保不符合项）
-- ============================================================================
-- 仅当仍为框架默认值 123456 时才改，已自行调整过的实例不受影响。
-- 🔴 RuoYi.Plus@888 是框架公开默认值，生产环境请在「系统管理 → 参数设置」中改成自己的强口令。
UPDATE sys_config
SET config_value = 'RuoYi.Plus@888',
    remark       = '新用户创建时的默认初始密码。生产环境必须修改为自定义强口令！',
    update_time  = sysdate()
WHERE config_key = 'system.user.initial-password'
  AND config_value = '123456';


-- ============================================================================
-- 验证语句（执行完可跑一遍确认）
-- ============================================================================
-- SELECT config_id, config_key, config_value FROM sys_config
--  WHERE config_key LIKE 'system.password%' OR config_key = 'system.log.retain-days'
--  ORDER BY config_id;
-- SHOW COLUMNS FROM sys_user LIKE 'pwd\_%';
-- SHOW TABLES LIKE '%_archive';


-- ============================================================================
-- 回滚 SQL（如升级后需回退）
-- ============================================================================
-- ALTER TABLE sys_user DROP COLUMN pwd_update_date, DROP COLUMN pwd_history;
-- DROP TABLE IF EXISTS sys_oper_log_archive;
-- DROP TABLE IF EXISTS sys_login_log_archive;
-- DELETE FROM sys_config WHERE config_id BETWEEN 100 AND 107;
-- UPDATE sys_config SET config_value = '123456' WHERE config_key = 'system.user.initial-password';
--
-- ⚠️ 回滚会连同归档表里的历史审计日志一并删除。若已运行过归档任务，
--    请先把归档表数据导出留存，再执行 DROP。
