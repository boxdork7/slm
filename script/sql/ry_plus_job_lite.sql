-- =============================================================
-- 轻量分布式定时任务模块 ruoyi-job 初始化脚本（MySQL）
-- 一个文件搞定：job_info + job_log + 字典 + 菜单 + 示例任务数据；幂等，可重复执行。
-- ⚠️ 前置依赖：需先执行 ry_plus_sys.sql（本脚本要写 sys_dict_type/sys_dict_data/sys_menu）。
-- ID 段：菜单 2200~2222（已避开 mall 商城占用的 2110~2126）| 字典类型 2000~2002 | 字典数据 2000~2006 | 示例任务 9001~9005
-- 约定：1=积极（正常/显示/缓存/非外链），0=消极；主键雪花ID（无 AUTO_INCREMENT）
--
-- ⚠️ 定位：定时任务是**平台级**能力，由平台运维统一管理，不做租户隔离，故两张表均无 tenant_id 列。
--    执行器是随应用部署的 Java 代码，租户无法自行新增；需要按租户处理业务时，
--    由执行器内部用 TenantHelper.dynamic() 遍历租户（框架推荐做法）。
--    两表已硬编码进 PlusTenantLineHandler.SYSTEM_EXCLUDE_TABLES，无需在 application.yml 中额外配置。
--    （租户拦截器按表名判断，实体不继承 TenantEntity 并不会让过滤失效，故须在拦截器内登记）。
--
-- ⚠️ 破坏性：脚本开头会 DROP 两张表，重复执行将清空已有任务定义与全部历史日志，生产环境慎用。
-- =============================================================

-- ----------------------------
-- 1. 定时任务定义表
-- ----------------------------
DROP TABLE IF EXISTS job_info;
CREATE TABLE job_info
(
    id                BIGINT        NOT NULL COMMENT '任务ID',
    job_name          VARCHAR(64)   NOT NULL COMMENT '任务名称',
    job_group         VARCHAR(64)   DEFAULT 'DEFAULT' COMMENT '任务分组',
    invoke_target     VARCHAR(200)  NOT NULL COMMENT '执行器标识(@JobHandler 的 value)',
    job_params        VARCHAR(2000) DEFAULT NULL COMMENT '任务参数(透传给执行器)',
    cron_expression   VARCHAR(64)   DEFAULT NULL COMMENT 'cron 表达式(Spring 6 位: 秒 分 时 日 月 周)',
    route_strategy    CHAR(1)       DEFAULT '1' COMMENT '路由策略(1集群 2广播)',
    misfire_policy    CHAR(1)       DEFAULT '3' COMMENT '错过执行策略(1立即补一次 其余值顺延到下次;引擎只判断是否为1)',
    max_retry         INT           DEFAULT 0 COMMENT '失败最大重试次数(0不重试)',
    retry_interval    INT           DEFAULT 10 COMMENT '重试间隔(秒)',
    timeout           INT           DEFAULT 0 COMMENT '执行超时(秒, 0不限制)',
    concurrent        CHAR(1)       DEFAULT '0' COMMENT '是否允许并发执行(0禁止 1允许)',
    next_execute_time DATETIME      DEFAULT NULL COMMENT '下次执行时间(引擎维护)',
    status            CHAR(1)       DEFAULT '0' COMMENT '任务状态(0暂停 1运行)',
    create_dept       BIGINT        DEFAULT NULL COMMENT '创建部门',
    create_by         BIGINT        DEFAULT NULL COMMENT '创建人',
    create_time       DATETIME      DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_by         BIGINT        DEFAULT NULL COMMENT '更新人',
    update_time       DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    remark            VARCHAR(500)  DEFAULT NULL COMMENT '备注',
    is_deleted        CHAR(1)       DEFAULT '0' COMMENT '是否删除(0正常 1已删除)',
    PRIMARY KEY (id),
    KEY idx_status_next (status, next_execute_time)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT ='定时任务表';

-- ----------------------------
-- 2. 定时任务执行日志表
-- ----------------------------
DROP TABLE IF EXISTS job_log;
CREATE TABLE job_log
(
    id             BIGINT        NOT NULL COMMENT '日志ID',
    job_id         BIGINT        NOT NULL COMMENT '任务ID',
    job_name       VARCHAR(64)   DEFAULT NULL COMMENT '任务名称(冗余)',
    job_group      VARCHAR(64)   DEFAULT NULL COMMENT '任务分组(冗余)',
    invoke_target  VARCHAR(200)  DEFAULT NULL COMMENT '执行器标识',
    job_params     VARCHAR(2000) DEFAULT NULL COMMENT '任务参数',
    job_message    VARCHAR(500)  DEFAULT NULL COMMENT '日志信息',
    status         CHAR(1)       DEFAULT '2' COMMENT '执行状态(0失败 1成功 2执行中)',
    exception_info TEXT          DEFAULT NULL COMMENT '异常堆栈',
    execute_node   VARCHAR(64)   DEFAULT NULL COMMENT '执行节点(IP:port)',
    retry_count    INT           DEFAULT 0 COMMENT '当前重试次数',
    start_time     DATETIME      DEFAULT NULL COMMENT '开始时间',
    stop_time      DATETIME      DEFAULT NULL COMMENT '结束时间',
    cost_time      BIGINT        DEFAULT NULL COMMENT '耗时(毫秒)',
    create_dept    BIGINT        DEFAULT NULL COMMENT '创建部门',
    create_by      BIGINT        DEFAULT NULL COMMENT '创建人',
    create_time    DATETIME      DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_by      BIGINT        DEFAULT NULL COMMENT '更新人',
    update_time    DATETIME      DEFAULT NULL COMMENT '更新时间',
    PRIMARY KEY (id),
    KEY idx_job_id (job_id),
    KEY idx_create_time (create_time)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT ='定时任务执行日志表';

-- ----------------------------
-- 3. 字典类型（先删后插，保证可重复执行）
-- ----------------------------
DELETE FROM sys_dict_type WHERE dict_id IN (2000, 2001, 2002);
INSERT INTO sys_dict_type (dict_id, tenant_id, dict_name, dict_type, is_system, status, create_dept, create_by, create_time, remark)
VALUES (2000, '000000', '任务路由策略', 'job_route_strategy', '0', '1', 100, 1, NOW(), '定时任务路由策略'),
       (2001, '000000', '任务执行状态', 'job_execute_status', '0', '1', 100, 1, NOW(), '定时任务执行状态'),
       (2002, '000000', '任务错过策略', 'job_misfire_policy', '0', '1', 100, 1, NOW(), '定时任务错过执行策略');

-- ----------------------------
-- 4. 字典数据（先删后插，保证可重复执行）
-- ----------------------------
DELETE FROM sys_dict_data WHERE dict_data_id BETWEEN 2000 AND 2006;
INSERT INTO sys_dict_data (dict_data_id, tenant_id, dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_dept, create_by, create_time, remark)
VALUES
-- 路由策略：1集群 2广播（is_default 遵循框架「1是 0否」约定，与 sys_boolean_flag 一致）
(2000, '000000', 1, '集群', '1', 'job_route_strategy', '', 'primary', '1', '1', 100, 1, NOW(), '集群模式(集群内只跑一个节点)'),
(2001, '000000', 2, '广播', '2', 'job_route_strategy', '', 'success', '0', '1', 100, 1, NOW(), '广播模式(所有节点各跑一次)'),
-- 执行状态：0失败 1成功 2执行中
(2002, '000000', 1, '失败',   '0', 'job_execute_status', '', 'danger',  '0', '1', 100, 1, NOW(), ''),
(2003, '000000', 2, '成功',   '1', 'job_execute_status', '', 'success', '0', '1', 100, 1, NOW(), ''),
(2004, '000000', 3, '执行中', '2', 'job_execute_status', '', 'info',    '0', '1', 100, 1, NOW(), ''),
-- 错过执行策略：仅两种行为——1=立即补一次，3=顺延到下次。
-- 刻意不提供「2放弃本次」：引擎在 JobScheduler 中只判断值是否为 '1'，
-- 「放弃本次」与「顺延到下次」的实际效果完全相同，列成两项只会误导使用者。
(2005, '000000', 1, '顺延到下次', '3', 'job_misfire_policy', '', 'info',    '1', '1', 100, 1, NOW(), '错过后不补跑，等下一个触发点(默认)'),
(2006, '000000', 2, '立即补一次', '1', 'job_misfire_policy', '', 'warning', '0', '1', 100, 1, NOW(), '错过后立刻补执行一次');

-- ----------------------------
-- 5. 菜单（「定时任务」目录挂到「系统监控」(menu_id=2) 下 + 调度任务 + 调度日志 + 按钮权限）
-- 说明1：任务状态(暂停/运行)复用系统内置字典 sys_enable_status
-- 说明2：menu_id 用 2200~2222 段（避开 mall 商城已占用的 2100~2122 段，否则导入会撞主键）
-- 说明3：parent_id=2 挂在「系统监控」下，与重度分布式调度 SnailJob(菜单 120) 并列——轻量任务用本模块，重度用 SnailJob
-- 说明4：目录 path 保持 'job'，故实际路由为 /monitor/job/info、/monitor/job/log（前端跳转已同步）
-- ----------------------------
-- 先清理：2100 空壳（若有）+ 本模块 2200~2222；绝不删 mall 的 2110~2122
DELETE FROM sys_menu WHERE menu_id = 2100 OR menu_id BETWEEN 2200 AND 2222;

-- ① M 目录：定时任务（挂系统监控下，order=7 排在 SnailJob(order=6) 之后）
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_external_link, is_cache, menu_type, visible, status, perms, icon, create_dept, create_by, create_time, remark)
VALUES (2200, '定时任务', 2, 7, 'job', NULL, '0', '1', 'M', '1', '1', '', 'time-range', 100, 1, NOW(), '定时任务目录(轻量内置调度器)');

-- ② C 菜单：调度任务
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_external_link, is_cache, menu_type, visible, status, perms, icon, create_dept, create_by, create_time, remark)
VALUES (2210, '调度任务', 2200, 1, 'info', 'job/info/info', '0', '1', 'C', '1', '1', 'job:info:list', 'clock', 100, 1, NOW(), '调度任务菜单');

-- ③ 调度任务 F 按钮
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_external_link, is_cache, menu_type, visible, status, perms, icon, create_dept, create_by, create_time, remark)
VALUES
(2211, '任务查询', 2210, 1, '#', '', '0', '1', 'F', '1', '1', 'job:info:query',        '#', 100, 1, NOW(), ''),
(2212, '任务新增', 2210, 2, '#', '', '0', '1', 'F', '1', '1', 'job:info:add',          '#', 100, 1, NOW(), ''),
(2213, '任务修改', 2210, 3, '#', '', '0', '1', 'F', '1', '1', 'job:info:update',       '#', 100, 1, NOW(), ''),
(2214, '任务删除', 2210, 4, '#', '', '0', '1', 'F', '1', '1', 'job:info:remove',       '#', 100, 1, NOW(), ''),
(2215, '任务启停', 2210, 5, '#', '', '0', '1', 'F', '1', '1', 'job:info:changeStatus', '#', 100, 1, NOW(), ''),
(2216, '手动执行', 2210, 6, '#', '', '0', '1', 'F', '1', '1', 'job:info:run',          '#', 100, 1, NOW(), '');

-- ④ C 菜单：调度日志
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_external_link, is_cache, menu_type, visible, status, perms, icon, create_dept, create_by, create_time, remark)
VALUES (2220, '调度日志', 2200, 2, 'log', 'job/log/log', '0', '1', 'C', '1', '1', 'job:log:list', 'document', 100, 1, NOW(), '调度日志菜单');

-- ⑤ 调度日志 F 按钮
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_external_link, is_cache, menu_type, visible, status, perms, icon, create_dept, create_by, create_time, remark)
VALUES
(2221, '日志查询', 2220, 1, '#', '', '0', '1', 'F', '1', '1', 'job:log:query',  '#', 100, 1, NOW(), ''),
(2222, '日志删除', 2220, 2, '#', '', '0', '1', 'F', '1', '1', 'job:log:remove', '#', 100, 1, NOW(), '');

-- ----------------------------
-- 6. 示例任务数据（全部 status='0' 暂停，界面手动「执行一次」触发）
-- ----------------------------
DELETE FROM job_info WHERE id BETWEEN 9001 AND 9005;
INSERT INTO job_info (id, job_name, job_group, invoke_target, job_params, cron_expression, route_strategy, misfire_policy, max_retry, retry_interval, timeout, concurrent, status, create_dept, create_by, create_time, remark)
VALUES
(9001, '示例-最简任务', 'DEFAULT', 'sampleHello', NULL, '0 * * * * ?', '1', '3', 0, 10, 0, '0', '0', 100, 1, NOW(), '演示:最简无参执行器,心跳/巡检类场景'),
(9002, '示例-参数透传', 'DEFAULT', 'sampleSyncData', '{"table":"sys_user","batch":500}', '0 0 2 * * ?', '1', '3', 0, 10, 0, '0', '0', 100, 1, NOW(), '演示:job_params 参数透传,同一执行器按不同参数复用'),
(9003, '示例-失败重试', 'DEFAULT', 'sampleRetry', NULL, '0 0/10 * * * ?', '1', '3', 3, 10, 0, '0', '0', 100, 1, NOW(), '演示:max_retry=3/retry_interval=10 失败自动重试'),
(9004, '示例-广播刷缓存', 'DEFAULT', 'sampleBroadcast', NULL, '0 0/30 * * * ?', '2', '3', 0, 10, 0, '0', '0', 100, 1, NOW(), '演示:route_strategy=2 广播,全节点各刷一次本地缓存'),
(9005, '内置-清理调度日志', 'DEFAULT', 'cleanJobLog', '30', '0 0 3 * * ?', '1', '3', 0, 10, 0, '0', '0', 100, 1, NOW(), '复用内置执行器,参数为日志保留天数;不设超时:清理按批进行,积压数据多时耗时较长,中途被超时打断会留下未清理数据');
