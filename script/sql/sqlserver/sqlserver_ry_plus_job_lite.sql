-- =============================================================
-- 轻量分布式定时任务模块 ruoyi-job 初始化脚本（SQL Server）
-- 一个文件搞定：job_info + job_log + 字典 + 菜单 + 示例任务数据；幂等，可重复执行。
-- ⚠️ 前置依赖：需先执行 sqlserver_ry_plus_sys.sql（本脚本要写 sys_dict_type/sys_dict_data/sys_menu）。
-- ID 段：菜单 2200~2222（已避开 mall 商城占用的 2110~2126）| 字典类型 2000~2002 | 字典数据 2000~2006 | 示例任务 9001~9005
-- 约定：1=积极（正常/显示/缓存/非外链），0=消极；主键雪花ID（无 IDENTITY 自增）
--
-- ⚠️ 定位：定时任务是**平台级**能力，不做租户隔离，故两张表均无 tenant_id 列。
--    两表已硬编码进 PlusTenantLineHandler.SYSTEM_EXCLUDE_TABLES，无需在 application.yml 中额外配置。
--
-- ⚠️ 破坏性：脚本开头会 DROP 两张表，重复执行将清空已有任务定义与全部历史日志，生产环境慎用。
-- =============================================================

-- ----------------------------
-- 1. 定时任务定义表
-- ----------------------------
IF OBJECT_ID('job_info', 'U') IS NOT NULL DROP TABLE job_info
GO
CREATE TABLE job_info
(
    id                bigint        NOT NULL,
    job_name          nvarchar(64)  NOT NULL,
    job_group         nvarchar(64)  DEFAULT (N'DEFAULT') NULL,
    invoke_target     nvarchar(200) NOT NULL,
    job_params        nvarchar(2000) NULL,
    cron_expression   nvarchar(64)  NULL,
    route_strategy    nchar(1)      DEFAULT ('1') NULL,
    misfire_policy    nchar(1)      DEFAULT ('3') NULL,
    max_retry         int           DEFAULT ((0)) NULL,
    retry_interval    int           DEFAULT ((10)) NULL,
    timeout           int           DEFAULT ((0)) NULL,
    concurrent        nchar(1)      DEFAULT ('0') NULL,
    next_execute_time datetime2(7)  NULL,
    status            nchar(1)      DEFAULT ('0') NULL,
    create_dept       bigint        NULL,
    create_by         bigint        NULL,
    create_time       datetime2(7)  DEFAULT (getdate()) NULL,
    update_by         bigint        NULL,
    update_time       datetime2(7)  DEFAULT (getdate()) NULL,
    remark            nvarchar(500) NULL,
    is_deleted        nchar(1)      DEFAULT ('0') NULL,
    CONSTRAINT PK_job_info PRIMARY KEY CLUSTERED (id)
)
GO
CREATE NONCLUSTERED INDEX idx_job_info_status_next ON job_info (status, next_execute_time)
GO

EXEC sys.sp_addextendedproperty 'MS_Description', N'定时任务表', 'SCHEMA', N'dbo', 'TABLE', N'job_info'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'任务ID', 'SCHEMA', N'dbo', 'TABLE', N'job_info', 'COLUMN', N'id'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'任务名称', 'SCHEMA', N'dbo', 'TABLE', N'job_info', 'COLUMN', N'job_name'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'任务分组', 'SCHEMA', N'dbo', 'TABLE', N'job_info', 'COLUMN', N'job_group'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'执行器标识(@JobHandler 的 value)', 'SCHEMA', N'dbo', 'TABLE', N'job_info', 'COLUMN', N'invoke_target'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'任务参数(透传给执行器)', 'SCHEMA', N'dbo', 'TABLE', N'job_info', 'COLUMN', N'job_params'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'cron 表达式(Spring 6 位: 秒 分 时 日 月 周)', 'SCHEMA', N'dbo', 'TABLE', N'job_info', 'COLUMN', N'cron_expression'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'路由策略(1集群 2广播)', 'SCHEMA', N'dbo', 'TABLE', N'job_info', 'COLUMN', N'route_strategy'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'错过执行策略(1立即补一次 其余值顺延到下次;引擎只判断是否为1)', 'SCHEMA', N'dbo', 'TABLE', N'job_info', 'COLUMN', N'misfire_policy'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'失败最大重试次数(0不重试)', 'SCHEMA', N'dbo', 'TABLE', N'job_info', 'COLUMN', N'max_retry'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'重试间隔(秒)', 'SCHEMA', N'dbo', 'TABLE', N'job_info', 'COLUMN', N'retry_interval'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'执行超时(秒, 0不限制)', 'SCHEMA', N'dbo', 'TABLE', N'job_info', 'COLUMN', N'timeout'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'是否允许并发执行(0禁止 1允许)', 'SCHEMA', N'dbo', 'TABLE', N'job_info', 'COLUMN', N'concurrent'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'下次执行时间(引擎维护)', 'SCHEMA', N'dbo', 'TABLE', N'job_info', 'COLUMN', N'next_execute_time'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'任务状态(0暂停 1运行)', 'SCHEMA', N'dbo', 'TABLE', N'job_info', 'COLUMN', N'status'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'是否删除(0正常 1已删除)', 'SCHEMA', N'dbo', 'TABLE', N'job_info', 'COLUMN', N'is_deleted'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'创建部门', 'SCHEMA', N'dbo', 'TABLE', N'job_info', 'COLUMN', N'create_dept'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'创建人', 'SCHEMA', N'dbo', 'TABLE', N'job_info', 'COLUMN', N'create_by'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'创建时间', 'SCHEMA', N'dbo', 'TABLE', N'job_info', 'COLUMN', N'create_time'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'更新人', 'SCHEMA', N'dbo', 'TABLE', N'job_info', 'COLUMN', N'update_by'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'更新时间', 'SCHEMA', N'dbo', 'TABLE', N'job_info', 'COLUMN', N'update_time'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'备注', 'SCHEMA', N'dbo', 'TABLE', N'job_info', 'COLUMN', N'remark'
GO

-- ----------------------------
-- 2. 定时任务执行日志表
-- ----------------------------
IF OBJECT_ID('job_log', 'U') IS NOT NULL DROP TABLE job_log
GO
CREATE TABLE job_log
(
    id             bigint        NOT NULL,
    job_id         bigint        NOT NULL,
    job_name       nvarchar(64)  NULL,
    job_group      nvarchar(64)  NULL,
    invoke_target  nvarchar(200) NULL,
    job_params     nvarchar(2000) NULL,
    job_message    nvarchar(500) NULL,
    status         nchar(1)      DEFAULT ('2') NULL,
    exception_info nvarchar(max) NULL,
    execute_node   nvarchar(64)  NULL,
    retry_count    int           DEFAULT ((0)) NULL,
    start_time     datetime2(7)  NULL,
    stop_time      datetime2(7)  NULL,
    cost_time      bigint        NULL,
    create_dept    bigint        NULL,
    create_by      bigint        NULL,
    create_time    datetime2(7)  DEFAULT (getdate()) NULL,
    update_by      bigint        NULL,
    update_time    datetime2(7)  NULL,
    CONSTRAINT PK_job_log PRIMARY KEY CLUSTERED (id)
)
GO
CREATE NONCLUSTERED INDEX idx_job_log_job_id ON job_log (job_id)
GO
CREATE NONCLUSTERED INDEX idx_job_log_create_time ON job_log (create_time)
GO

EXEC sys.sp_addextendedproperty 'MS_Description', N'定时任务执行日志表', 'SCHEMA', N'dbo', 'TABLE', N'job_log'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'日志ID', 'SCHEMA', N'dbo', 'TABLE', N'job_log', 'COLUMN', N'id'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'任务ID', 'SCHEMA', N'dbo', 'TABLE', N'job_log', 'COLUMN', N'job_id'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'执行状态(0失败 1成功 2执行中)', 'SCHEMA', N'dbo', 'TABLE', N'job_log', 'COLUMN', N'status'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'异常堆栈', 'SCHEMA', N'dbo', 'TABLE', N'job_log', 'COLUMN', N'exception_info'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'执行节点(IP:port)', 'SCHEMA', N'dbo', 'TABLE', N'job_log', 'COLUMN', N'execute_node'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'当前重试次数', 'SCHEMA', N'dbo', 'TABLE', N'job_log', 'COLUMN', N'retry_count'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'耗时(毫秒)', 'SCHEMA', N'dbo', 'TABLE', N'job_log', 'COLUMN', N'cost_time'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'任务名称(冗余)', 'SCHEMA', N'dbo', 'TABLE', N'job_log', 'COLUMN', N'job_name'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'任务分组(冗余)', 'SCHEMA', N'dbo', 'TABLE', N'job_log', 'COLUMN', N'job_group'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'执行器标识', 'SCHEMA', N'dbo', 'TABLE', N'job_log', 'COLUMN', N'invoke_target'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'任务参数', 'SCHEMA', N'dbo', 'TABLE', N'job_log', 'COLUMN', N'job_params'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'日志信息', 'SCHEMA', N'dbo', 'TABLE', N'job_log', 'COLUMN', N'job_message'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'开始时间', 'SCHEMA', N'dbo', 'TABLE', N'job_log', 'COLUMN', N'start_time'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'结束时间', 'SCHEMA', N'dbo', 'TABLE', N'job_log', 'COLUMN', N'stop_time'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'创建部门', 'SCHEMA', N'dbo', 'TABLE', N'job_log', 'COLUMN', N'create_dept'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'创建人', 'SCHEMA', N'dbo', 'TABLE', N'job_log', 'COLUMN', N'create_by'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'创建时间', 'SCHEMA', N'dbo', 'TABLE', N'job_log', 'COLUMN', N'create_time'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'更新人', 'SCHEMA', N'dbo', 'TABLE', N'job_log', 'COLUMN', N'update_by'
GO
EXEC sys.sp_addextendedproperty 'MS_Description', N'更新时间', 'SCHEMA', N'dbo', 'TABLE', N'job_log', 'COLUMN', N'update_time'
GO

-- ----------------------------
-- 3. 字典类型（先删后插，保证可重复执行）
-- ----------------------------
DELETE FROM sys_dict_type WHERE dict_id IN (2000, 2001, 2002)
GO
INSERT INTO sys_dict_type (dict_id, tenant_id, dict_name, dict_type, is_system, status, create_dept, create_by, create_time, remark) VALUES
(2000, N'000000', N'任务路由策略', N'job_route_strategy', N'0', N'1', 100, 1, getdate(), N'定时任务路由策略'),
(2001, N'000000', N'任务执行状态', N'job_execute_status', N'0', N'1', 100, 1, getdate(), N'定时任务执行状态'),
(2002, N'000000', N'任务错过策略', N'job_misfire_policy', N'0', N'1', 100, 1, getdate(), N'定时任务错过执行策略')
GO

-- ----------------------------
-- 4. 字典数据（先删后插，保证可重复执行）
-- ----------------------------
DELETE FROM sys_dict_data WHERE dict_data_id BETWEEN 2000 AND 2006
GO
INSERT INTO sys_dict_data (dict_data_id, tenant_id, dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_dept, create_by, create_time, remark) VALUES
(2000, N'000000', 1, N'集群', N'1', N'job_route_strategy', N'', N'primary', N'1', N'1', 100, 1, getdate(), N'集群模式(集群内只跑一个节点)'),
(2001, N'000000', 2, N'广播', N'2', N'job_route_strategy', N'', N'success', N'0', N'1', 100, 1, getdate(), N'广播模式(所有节点各跑一次)'),
(2002, N'000000', 1, N'失败',   N'0', N'job_execute_status', N'', N'danger',  N'0', N'1', 100, 1, getdate(), N''),
(2003, N'000000', 2, N'成功',   N'1', N'job_execute_status', N'', N'success', N'0', N'1', 100, 1, getdate(), N''),
(2004, N'000000', 3, N'执行中', N'2', N'job_execute_status', N'', N'info',    N'0', N'1', 100, 1, getdate(), N''),
-- 错过执行策略：仅两种行为——1=立即补一次，3=顺延到下次（引擎只判断是否为 '1'）
(2005, N'000000', 1, N'顺延到下次', N'3', N'job_misfire_policy', N'', N'info',    N'1', N'1', 100, 1, getdate(), N'错过后不补跑，等下一个触发点(默认)'),
(2006, N'000000', 2, N'立即补一次', N'1', N'job_misfire_policy', N'', N'warning', N'0', N'1', 100, 1, getdate(), N'错过后立刻补执行一次')
GO

-- ----------------------------
-- 5. 菜单（「定时任务」目录挂到「系统监控」(menu_id=2) 下 + 调度任务 + 调度日志 + 按钮权限）
-- 说明1：任务状态(暂停/运行)复用系统内置字典 sys_enable_status
-- 说明2：menu_id 用 2200~2222 段（避开 mall 商城已占用的 2100~2122 段，否则导入会撞主键）
-- 说明3：parent_id=2 挂在「系统监控」下，与重度分布式调度 SnailJob(菜单 120) 并列——轻量任务用本模块，重度用 SnailJob
-- 说明4：目录 path 保持 'job'，故实际路由为 /monitor/job/info、/monitor/job/log（前端跳转已同步）
-- ----------------------------
-- 先清理：2100 空壳（若有）+ 本模块 2200~2222；绝不删 mall 的 2110~2122
DELETE FROM sys_menu WHERE menu_id = 2100 OR menu_id BETWEEN 2200 AND 2222
GO

-- ① M 目录：定时任务（挂系统监控下，order=7 排在 SnailJob(order=6) 之后）
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_external_link, is_cache, menu_type, visible, status, perms, icon, create_dept, create_by, create_time, remark) VALUES
(2200, N'定时任务', 2, 7, N'job', NULL, N'0', N'1', N'M', N'1', N'1', N'', N'time-range', 100, 1, getdate(), N'定时任务目录(轻量内置调度器)')
GO

-- ② C 菜单：调度任务
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_external_link, is_cache, menu_type, visible, status, perms, icon, create_dept, create_by, create_time, remark) VALUES
(2210, N'调度任务', 2200, 1, N'info', N'job/info/info', N'0', N'1', N'C', N'1', N'1', N'job:info:list', N'clock', 100, 1, getdate(), N'调度任务菜单')
GO

-- ③ 调度任务 F 按钮
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_external_link, is_cache, menu_type, visible, status, perms, icon, create_dept, create_by, create_time, remark) VALUES
(2211, N'任务查询', 2210, 1, N'#', N'', N'0', N'1', N'F', N'1', N'1', N'job:info:query',        N'#', 100, 1, getdate(), N''),
(2212, N'任务新增', 2210, 2, N'#', N'', N'0', N'1', N'F', N'1', N'1', N'job:info:add',          N'#', 100, 1, getdate(), N''),
(2213, N'任务修改', 2210, 3, N'#', N'', N'0', N'1', N'F', N'1', N'1', N'job:info:update',       N'#', 100, 1, getdate(), N''),
(2214, N'任务删除', 2210, 4, N'#', N'', N'0', N'1', N'F', N'1', N'1', N'job:info:remove',       N'#', 100, 1, getdate(), N''),
(2215, N'任务启停', 2210, 5, N'#', N'', N'0', N'1', N'F', N'1', N'1', N'job:info:changeStatus', N'#', 100, 1, getdate(), N''),
(2216, N'手动执行', 2210, 6, N'#', N'', N'0', N'1', N'F', N'1', N'1', N'job:info:run',          N'#', 100, 1, getdate(), N'')
GO

-- ④ C 菜单：调度日志
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_external_link, is_cache, menu_type, visible, status, perms, icon, create_dept, create_by, create_time, remark) VALUES
(2220, N'调度日志', 2200, 2, N'log', N'job/log/log', N'0', N'1', N'C', N'1', N'1', N'job:log:list', N'document', 100, 1, getdate(), N'调度日志菜单')
GO

-- ⑤ 调度日志 F 按钮
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_external_link, is_cache, menu_type, visible, status, perms, icon, create_dept, create_by, create_time, remark) VALUES
(2221, N'日志查询', 2220, 1, N'#', N'', N'0', N'1', N'F', N'1', N'1', N'job:log:query',  N'#', 100, 1, getdate(), N''),
(2222, N'日志删除', 2220, 2, N'#', N'', N'0', N'1', N'F', N'1', N'1', N'job:log:remove', N'#', 100, 1, getdate(), N'')
GO

-- ----------------------------
-- 6. 示例任务数据（全部 status='0' 暂停，界面手动「执行一次」触发）
-- ----------------------------
DELETE FROM job_info WHERE id BETWEEN 9001 AND 9005
GO
INSERT INTO job_info (id, job_name, job_group, invoke_target, job_params, cron_expression, route_strategy, misfire_policy, max_retry, retry_interval, timeout, concurrent, status, create_dept, create_by, create_time, remark) VALUES
(9001, N'示例-最简任务', N'DEFAULT', N'sampleHello', NULL, N'0 * * * * ?', N'1', N'3', 0, 10, 0, N'0', N'0', 100, 1, getdate(), N'演示:最简无参执行器,心跳/巡检类场景'),
(9002, N'示例-参数透传', N'DEFAULT', N'sampleSyncData', N'{"table":"sys_user","batch":500}', N'0 0 2 * * ?', N'1', N'3', 0, 10, 0, N'0', N'0', 100, 1, getdate(), N'演示:job_params 参数透传,同一执行器按不同参数复用'),
(9003, N'示例-失败重试', N'DEFAULT', N'sampleRetry', NULL, N'0 0/10 * * * ?', N'1', N'3', 3, 10, 0, N'0', N'0', 100, 1, getdate(), N'演示:max_retry=3/retry_interval=10 失败自动重试'),
(9004, N'示例-广播刷缓存', N'DEFAULT', N'sampleBroadcast', NULL, N'0 0/30 * * * ?', N'2', N'3', 0, 10, 0, N'0', N'0', 100, 1, getdate(), N'演示:route_strategy=2 广播,全节点各刷一次本地缓存'),
(9005, N'内置-清理调度日志', N'DEFAULT', N'cleanJobLog', N'30', N'0 0 3 * * ?', N'1', N'3', 0, 10, 0, N'0', N'0', 100, 1, getdate(), N'复用内置执行器,参数为日志保留天数;不设超时:清理按批进行,积压数据多时耗时较长,中途被超时打断会留下未清理数据')
GO
