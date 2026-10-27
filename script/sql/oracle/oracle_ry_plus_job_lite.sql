-- =============================================================
-- 轻量分布式定时任务模块 ruoyi-job 初始化脚本（Oracle）
-- 一个文件搞定：job_info + job_log + 字典 + 菜单 + 示例任务数据。
-- ⚠️ 仅字典/菜单/示例数据部分幂等（先 DELETE 后 INSERT）；建表部分**不可重复执行**，
--    重跑会因表已存在报 ORA-00955，需先手工 DROP 两张表（原因见下方 DROP 说明）。
-- ⚠️ 前置依赖：需先执行 oracle_ry_plus_sys.sql（本脚本要写 sys_dict_type/sys_dict_data/sys_menu）。
-- ID 段：菜单 2200~2222（已避开 mall 商城占用的 2110~2126）| 字典类型 2000~2002 | 字典数据 2000~2006 | 示例任务 9001~9005
-- 约定：1=积极，0=消极；主键雪花ID。Oracle 空串 '' 等价 NULL，属正常行为。
--
-- ⚠️ 定位：定时任务是**平台级**能力，不做租户隔离，故两张表均无 tenant_id 列。
--    两表已硬编码进 PlusTenantLineHandler.SYSTEM_EXCLUDE_TABLES，无需在 application.yml 中额外配置。
--
-- ⚠️ 建表前如需重建，请手工先删表：Oracle 21c 及以前不支持 DROP TABLE IF EXISTS，
--    本脚本因此不含 DROP 语句（与项目其它 Oracle 脚本保持一致）。
-- =============================================================

-- ----------------------------
-- 1. 定时任务定义表
-- ----------------------------
CREATE TABLE job_info
(
    id                number(20)     not null,
    job_name          varchar2(64)   not null,
    job_group         varchar2(64)   default 'DEFAULT',
    invoke_target     varchar2(200)  not null,
    job_params        varchar2(2000) default null,
    cron_expression   varchar2(64)   default null,
    route_strategy    char(1)        default '1',
    misfire_policy    char(1)        default '3',
    max_retry         number(11)     default 0,
    retry_interval    number(11)     default 10,
    timeout           number(11)     default 0,
    concurrent        char(1)        default '0',
    next_execute_time date,
    status            char(1)        default '0',
    create_dept       number(20),
    create_by         number(20),
    create_time       date           default sysdate,
    update_by         number(20),
    update_time       date           default sysdate,
    remark            varchar2(500)  default null,
    is_deleted        char(1)        default '0',
    primary key (id)
);
CREATE INDEX idx_job_info_status_next ON job_info (status, next_execute_time);

comment on table  job_info                   is '定时任务表';
comment on column job_info.id                is '任务ID';
comment on column job_info.job_name          is '任务名称';
comment on column job_info.job_group         is '任务分组';
comment on column job_info.invoke_target     is '执行器标识(@JobHandler 的 value)';
comment on column job_info.job_params        is '任务参数(透传给执行器)';
comment on column job_info.cron_expression   is 'cron 表达式(Spring 6 位: 秒 分 时 日 月 周)';
comment on column job_info.route_strategy    is '路由策略(1集群 2广播)';
comment on column job_info.misfire_policy    is '错过执行策略(1立即补一次 其余值顺延到下次;引擎只判断是否为1)';
comment on column job_info.max_retry         is '失败最大重试次数(0不重试)';
comment on column job_info.retry_interval    is '重试间隔(秒)';
comment on column job_info.timeout           is '执行超时(秒, 0不限制)';
comment on column job_info.concurrent        is '是否允许并发执行(0禁止 1允许)';
comment on column job_info.next_execute_time is '下次执行时间(引擎维护)';
comment on column job_info.status            is '任务状态(0暂停 1运行)';
comment on column job_info.create_dept       is '创建部门';
comment on column job_info.create_by         is '创建人';
comment on column job_info.create_time       is '创建时间';
comment on column job_info.update_by         is '更新人';
comment on column job_info.update_time       is '更新时间';
comment on column job_info.remark            is '备注';
comment on column job_info.is_deleted        is '是否删除(0正常 1已删除)';

-- ----------------------------
-- 2. 定时任务执行日志表
-- ----------------------------
CREATE TABLE job_log
(
    id             number(20)     not null,
    job_id         number(20)     not null,
    job_name       varchar2(64)   default null,
    job_group      varchar2(64)   default null,
    invoke_target  varchar2(200)  default null,
    job_params     varchar2(2000) default null,
    job_message    varchar2(500)  default null,
    status         char(1)        default '2',
    exception_info clob,
    execute_node   varchar2(64)   default null,
    retry_count    number(11)     default 0,
    start_time     date,
    stop_time      date,
    cost_time      number(20),
    create_dept    number(20),
    create_by      number(20),
    create_time    date           default sysdate,
    update_by      number(20),
    update_time    date,
    primary key (id)
);
CREATE INDEX idx_job_log_job_id ON job_log (job_id);
CREATE INDEX idx_job_log_create_time ON job_log (create_time);

comment on table  job_log                is '定时任务执行日志表';
comment on column job_log.id             is '日志ID';
comment on column job_log.job_id         is '任务ID';
comment on column job_log.job_name       is '任务名称(冗余)';
comment on column job_log.job_group      is '任务分组(冗余)';
comment on column job_log.invoke_target  is '执行器标识';
comment on column job_log.job_params     is '任务参数';
comment on column job_log.job_message    is '日志信息';
comment on column job_log.status         is '执行状态(0失败 1成功 2执行中)';
comment on column job_log.exception_info is '异常堆栈';
comment on column job_log.execute_node   is '执行节点(IP:port)';
comment on column job_log.retry_count    is '当前重试次数';
comment on column job_log.start_time     is '开始时间';
comment on column job_log.stop_time      is '结束时间';
comment on column job_log.cost_time      is '耗时(毫秒)';
comment on column job_log.create_dept    is '创建部门';
comment on column job_log.create_by      is '创建人';
comment on column job_log.create_time    is '创建时间';
comment on column job_log.update_by      is '更新人';
comment on column job_log.update_time    is '更新时间';

-- ----------------------------
-- 3. 字典类型（先删后插，保证可重复执行）
-- ----------------------------
DELETE FROM sys_dict_type WHERE dict_id IN (2000, 2001, 2002);
INSERT ALL
  INTO sys_dict_type (dict_id, tenant_id, dict_name, dict_type, is_system, status, create_dept, create_by, create_time, remark)
       VALUES (2000, '000000', '任务路由策略', 'job_route_strategy', '0', '1', 100, 1, sysdate, '定时任务路由策略')
  INTO sys_dict_type (dict_id, tenant_id, dict_name, dict_type, is_system, status, create_dept, create_by, create_time, remark)
       VALUES (2001, '000000', '任务执行状态', 'job_execute_status', '0', '1', 100, 1, sysdate, '定时任务执行状态')
  INTO sys_dict_type (dict_id, tenant_id, dict_name, dict_type, is_system, status, create_dept, create_by, create_time, remark)
       VALUES (2002, '000000', '任务错过策略', 'job_misfire_policy', '0', '1', 100, 1, sysdate, '定时任务错过执行策略')
SELECT * FROM dual;

-- ----------------------------
-- 4. 字典数据
-- ----------------------------
DELETE FROM sys_dict_data WHERE dict_data_id BETWEEN 2000 AND 2006;
INSERT ALL
  INTO sys_dict_data (dict_data_id, tenant_id, dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_dept, create_by, create_time, remark)
       VALUES (2000, '000000', 1, '集群', '1', 'job_route_strategy', '', 'primary', '1', '1', 100, 1, sysdate, '集群模式(集群内只跑一个节点)')
  INTO sys_dict_data (dict_data_id, tenant_id, dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_dept, create_by, create_time, remark)
       VALUES (2001, '000000', 2, '广播', '2', 'job_route_strategy', '', 'success', '0', '1', 100, 1, sysdate, '广播模式(所有节点各跑一次)')
  INTO sys_dict_data (dict_data_id, tenant_id, dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_dept, create_by, create_time, remark)
       VALUES (2002, '000000', 1, '失败', '0', 'job_execute_status', '', 'danger', '0', '1', 100, 1, sysdate, '')
  INTO sys_dict_data (dict_data_id, tenant_id, dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_dept, create_by, create_time, remark)
       VALUES (2003, '000000', 2, '成功', '1', 'job_execute_status', '', 'success', '0', '1', 100, 1, sysdate, '')
  INTO sys_dict_data (dict_data_id, tenant_id, dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_dept, create_by, create_time, remark)
       VALUES (2004, '000000', 3, '执行中', '2', 'job_execute_status', '', 'info', '0', '1', 100, 1, sysdate, '')
-- 错过执行策略：仅两种行为——1=立即补一次，3=顺延到下次（引擎只判断是否为 '1'）
  INTO sys_dict_data (dict_data_id, tenant_id, dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_dept, create_by, create_time, remark)
       VALUES (2005, '000000', 1, '顺延到下次', '3', 'job_misfire_policy', '', 'info', '1', '1', 100, 1, sysdate, '错过后不补跑，等下一个触发点(默认)')
  INTO sys_dict_data (dict_data_id, tenant_id, dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_dept, create_by, create_time, remark)
       VALUES (2006, '000000', 2, '立即补一次', '1', 'job_misfire_policy', '', 'warning', '0', '1', 100, 1, sysdate, '错过后立刻补执行一次')
SELECT * FROM dual;

-- ----------------------------
-- 5. 菜单（「定时任务」目录挂到「系统监控」(menu_id=2) 下）
-- menu_id 2200~2222（避开 mall 商城占用的 2100~2122）；parent_id=2 与 SnailJob(菜单120) 并列
-- ----------------------------
-- 先清理：2100 空壳（若有）+ 本模块 2200~2222；绝不删 mall 的 2110~2122
DELETE FROM sys_menu WHERE menu_id = 2100 OR menu_id BETWEEN 2200 AND 2222;

INSERT ALL
  INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_external_link, is_cache, menu_type, visible, status, perms, icon, create_dept, create_by, create_time, remark)
       VALUES (2200, '定时任务', 2, 7, 'job', null, '0', '1', 'M', '1', '1', '', 'time-range', 100, 1, sysdate, '定时任务目录(轻量内置调度器)')
  INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_external_link, is_cache, menu_type, visible, status, perms, icon, create_dept, create_by, create_time, remark)
       VALUES (2210, '调度任务', 2200, 1, 'info', 'job/info/info', '0', '1', 'C', '1', '1', 'job:info:list', 'clock', 100, 1, sysdate, '调度任务菜单')
  INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_external_link, is_cache, menu_type, visible, status, perms, icon, create_dept, create_by, create_time, remark)
       VALUES (2211, '任务查询', 2210, 1, '#', '', '0', '1', 'F', '1', '1', 'job:info:query', '#', 100, 1, sysdate, '')
  INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_external_link, is_cache, menu_type, visible, status, perms, icon, create_dept, create_by, create_time, remark)
       VALUES (2212, '任务新增', 2210, 2, '#', '', '0', '1', 'F', '1', '1', 'job:info:add', '#', 100, 1, sysdate, '')
  INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_external_link, is_cache, menu_type, visible, status, perms, icon, create_dept, create_by, create_time, remark)
       VALUES (2213, '任务修改', 2210, 3, '#', '', '0', '1', 'F', '1', '1', 'job:info:update', '#', 100, 1, sysdate, '')
  INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_external_link, is_cache, menu_type, visible, status, perms, icon, create_dept, create_by, create_time, remark)
       VALUES (2214, '任务删除', 2210, 4, '#', '', '0', '1', 'F', '1', '1', 'job:info:remove', '#', 100, 1, sysdate, '')
  INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_external_link, is_cache, menu_type, visible, status, perms, icon, create_dept, create_by, create_time, remark)
       VALUES (2215, '任务启停', 2210, 5, '#', '', '0', '1', 'F', '1', '1', 'job:info:changeStatus', '#', 100, 1, sysdate, '')
  INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_external_link, is_cache, menu_type, visible, status, perms, icon, create_dept, create_by, create_time, remark)
       VALUES (2216, '手动执行', 2210, 6, '#', '', '0', '1', 'F', '1', '1', 'job:info:run', '#', 100, 1, sysdate, '')
  INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_external_link, is_cache, menu_type, visible, status, perms, icon, create_dept, create_by, create_time, remark)
       VALUES (2220, '调度日志', 2200, 2, 'log', 'job/log/log', '0', '1', 'C', '1', '1', 'job:log:list', 'document', 100, 1, sysdate, '调度日志菜单')
  INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_external_link, is_cache, menu_type, visible, status, perms, icon, create_dept, create_by, create_time, remark)
       VALUES (2221, '日志查询', 2220, 1, '#', '', '0', '1', 'F', '1', '1', 'job:log:query', '#', 100, 1, sysdate, '')
  INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_external_link, is_cache, menu_type, visible, status, perms, icon, create_dept, create_by, create_time, remark)
       VALUES (2222, '日志删除', 2220, 2, '#', '', '0', '1', 'F', '1', '1', 'job:log:remove', '#', 100, 1, sysdate, '')
SELECT * FROM dual;

-- ----------------------------
-- 6. 示例任务数据（全部 status='0' 暂停，界面手动「执行一次」触发）
-- ----------------------------
DELETE FROM job_info WHERE id BETWEEN 9001 AND 9005;
INSERT ALL
  INTO job_info (id, job_name, job_group, invoke_target, job_params, cron_expression, route_strategy, misfire_policy, max_retry, retry_interval, timeout, concurrent, status, create_dept, create_by, create_time, remark)
       VALUES (9001, '示例-最简任务', 'DEFAULT', 'sampleHello', null, '0 * * * * ?', '1', '3', 0, 10, 0, '0', '0', 100, 1, sysdate, '演示:最简无参执行器,心跳/巡检类场景')
  INTO job_info (id, job_name, job_group, invoke_target, job_params, cron_expression, route_strategy, misfire_policy, max_retry, retry_interval, timeout, concurrent, status, create_dept, create_by, create_time, remark)
       VALUES (9002, '示例-参数透传', 'DEFAULT', 'sampleSyncData', '{"table":"sys_user","batch":500}', '0 0 2 * * ?', '1', '3', 0, 10, 0, '0', '0', 100, 1, sysdate, '演示:job_params 参数透传,同一执行器按不同参数复用')
  INTO job_info (id, job_name, job_group, invoke_target, job_params, cron_expression, route_strategy, misfire_policy, max_retry, retry_interval, timeout, concurrent, status, create_dept, create_by, create_time, remark)
       VALUES (9003, '示例-失败重试', 'DEFAULT', 'sampleRetry', null, '0 0/10 * * * ?', '1', '3', 3, 10, 0, '0', '0', 100, 1, sysdate, '演示:max_retry=3/retry_interval=10 失败自动重试')
  INTO job_info (id, job_name, job_group, invoke_target, job_params, cron_expression, route_strategy, misfire_policy, max_retry, retry_interval, timeout, concurrent, status, create_dept, create_by, create_time, remark)
       VALUES (9004, '示例-广播刷缓存', 'DEFAULT', 'sampleBroadcast', null, '0 0/30 * * * ?', '2', '3', 0, 10, 0, '0', '0', 100, 1, sysdate, '演示:route_strategy=2 广播,全节点各刷一次本地缓存')
  INTO job_info (id, job_name, job_group, invoke_target, job_params, cron_expression, route_strategy, misfire_policy, max_retry, retry_interval, timeout, concurrent, status, create_dept, create_by, create_time, remark)
       VALUES (9005, '内置-清理调度日志', 'DEFAULT', 'cleanJobLog', '30', '0 0 3 * * ?', '1', '3', 0, 10, 0, '0', '0', 100, 1, sysdate, '复用内置执行器,参数为日志保留天数;不设超时:清理按批进行,积压数据多时耗时较长,中途被超时打断会留下未清理数据')
SELECT * FROM dual;
