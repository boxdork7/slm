# 增量升级脚本（过渡性）

本目录存放**已部署实例**升级到新版本时需要执行的 `ALTER TABLE` / `CREATE INDEX` 等增量 SQL。
全新部署直接用 `script/sql/` 下的完整建表脚本即可，**无需执行本目录文件**。

## 当前增量脚本

| 文件 | 触发原因 | 影响表 | 引入版本 |
|------|---------|--------|---------|
| `mysql_snailjob_1.10.0.sql` | snailjob 1.9.0 → 1.10.0 | `sj_job` / `sj_workflow` | 2026-05 同步批次 |
| `oracle_snailjob_1.10.0.sql` | 同上 | 同上 | 同上 |
| `postgres_snailjob_1.10.0.sql` | 同上 | 同上 | 同上 |
| `sqlserver_snailjob_1.10.0.sql` | 同上 | 同上 | 同上 |
| `mysql_payment_public_key_id.sql` | 微信支付公钥模式新增公钥ID字段 | `b_payment` | 2026-05 同步批次 |
| `oracle_payment_public_key_id.sql` | 同上 | 同上 | 同上 |
| `postgres_payment_public_key_id.sql` | 同上 | 同上 | 同上 |
| `sqlserver_payment_public_key_id.sql` | 同上 | 同上 | 同上 |
| `mysql_oper_log_oper_type_varchar.sql` | oper_type 定长 CHAR 改 VARCHAR（修复 PG/Oracle/SQLServer 空格填充导致字典标签/筛选/导出失效） | `sys_oper_log` | 2026-06 同步批次 |
| `oracle_oper_log_oper_type_varchar.sql` | 同上 | 同上 | 同上 |
| `postgres_oper_log_oper_type_varchar.sql` | 同上 | 同上 | 同上 |
| `sqlserver_oper_log_oper_type_varchar.sql` | 同上 | 同上 | 同上 |
| `mysql_dengbao_password_policy.sql` | 等保二级整改：密码策略（复杂度/有效期/历史重用）+ 审计日志归档留存 | `sys_user`（加 `pwd_update_date` / `pwd_history` 两列）、`sys_config`（加8条改1条）、新建 `sys_oper_log_archive` / `sys_login_log_archive` | 2026-09 等保整改批次 |
| `oracle_dengbao_password_policy.sql` | 同上 | 同上 | 同上 |
| `postgres_dengbao_password_policy.sql` | 同上 | 同上 | 同上 |
| `sqlserver_dengbao_password_policy.sql` | 同上 | 同上 | 同上 |
| `mysql_field_permission.sql` | 字段级权限（列级隔离）：同一条记录按角色/部门/用户控制哪些列可见可改 | 新建 `sys_field_resource` / `sys_field_resource_class` / `sys_field_permission`、`sys_dict_type`+2、`sys_dict_data`+7、`sys_menu`+5、`sys_role_menu`+5 | 2026-09 字段级权限批次 |
| `oracle_field_permission.sql` | 同上 | 同上 | 同上 |
| `postgres_field_permission.sql` | 同上 | 同上 | 同上 |
| `sqlserver_field_permission.sql` | 同上 | 同上 | 同上 |

## 使用方法

1. **生产升级前**：连接对应数据库，执行匹配数据库类型的 `.sql` 文件
2. **执行后立刻重启**应用，避免新旧 schema 混跑触发约束冲突
3. 升级完毕后无需保留本文件，可在**下一个发布版本一并清理**整个 update/ 目录

> ⚠️ `*_field_permission.sql` 的重启不是可选项：`sys_field_resource` /
> `sys_field_resource_class` 两张表由应用启动时的注解扫描器写入，
> 不重启则两表一直为空，表现为「字段权限配置页左侧没有任何资源」，
> 容易被误判成功能没做好。

### 幂等性说明

| 数据库 | 建表段 | 字典/菜单段 |
|--------|--------|------------|
| MySQL | ✅ 幂等（`CREATE TABLE IF NOT EXISTS`） | ✅ 幂等（`WHERE NOT EXISTS`） |
| PostgreSQL | ✅ 幂等 | ✅ 幂等 |
| Oracle | ❌ 不幂等（无 `IF NOT EXISTS`，重复执行报 ORA-00955，跳过即可） | ✅ 幂等 |
| SQL Server | ❌ 不幂等（`GO` 无法包进 `IF ... BEGIN`，重复执行报对象已存在，跳过即可） | ✅ 幂等 |

## 维护约定

- **过渡性目录**：本目录文件只服务「上一版本 → 当前版本」的迁移，下个发布版本应整体清理
- **不要往上游 master 完整脚本里反向回灌 ALTER**：完整脚本永远是最新结构的 `CREATE TABLE`
- 文件命名：`{数据库类型}_{触发原因}_{版本号}.sql`

## 回滚

若升级后出现问题需要回滚，参考各 `.sql` 文件末尾的「回滚 SQL」段落。
