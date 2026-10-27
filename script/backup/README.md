# 数据库备份与恢复

对应等保二级 **8.1.4.7 a**「应提供重要数据的本地数据备份与恢复功能」。

> **注意「恢复」两个字**：只有备份没有恢复是过不了的，测评时大概率会让你现场演示
> 从备份恢复一次。所以本目录同时提供 `backup.sh` 和 `restore.sh`，并建议按文末模板留存演练记录。

---

## 为什么是独立脚本，而不是做进应用

备份本质是运维动作，把它绑进应用生命周期有三个问题：

1. **应用挂掉恰恰是最需要备份的时候** —— 做成 `@Scheduled` 的话，应用一崩备份就停了
2. **权限模型变脏** —— 应用进程会因此需要 `mysqldump` 权限
3. **部署方式绑死** —— 独立脚本对 JAR、Docker、1Panel 三种部署一视同仁

---

## 快速开始

```bash
cd script/backup
cp backup.env.example backup.env
chmod 600 backup.env          # 含明文口令，必须限权
vi backup.env                 # 填写数据库连接与备份目录

chmod +x backup.sh restore.sh

./backup.sh                   # 立即备份一次
./restore.sh                  # 不带参数：列出可用备份
```

---

## 接入定时执行

### 方式一：cron（JAR 部署 / 裸机）

```bash
crontab -e
```

```cron
# 每天凌晨 2 点备份。选 2 点是为了避开 3 点的审计日志归档任务（LogArchiveScheduledJob），
# 两者都吃磁盘 IO，撞一起会互相拖慢
0 2 * * * /opt/ryplus/script/backup/backup.sh >> /data/backup/ryplus/cron.log 2>&1
```

### 方式二：Docker compose（容器部署）

在 compose 里加一个只跑备份的轻量服务。它与应用容器互不影响，应用挂了也照常备份：

```yaml
  ryplus_backup:
    image: mysql:8.0.42          # 只为借用里面的 mysqldump，不跑 mysqld
    container_name: ryplus_backup
    restart: always
    network_mode: "host"
    volumes:
      - /opt/ryplus/script/backup:/backup:ro
      - /data/backup/ryplus:/data/backup/ryplus
    environment:
      TZ: Asia/Shanghai
    entrypoint: >
      sh -c "while true; do
               sleep 86400;
               /backup/backup.sh;
             done"
```

> 更规范的做法是用宿主机 cron 调 `docker exec`，避免容器内自己造循环定时器。
> 上面这种写法胜在零额外依赖，适合环境受限时先跑起来。

---

## 恢复

```bash
./restore.sh                                       # 先看有哪些备份
./restore.sh ryplus_uni_20260904_020000.sql.gz     # 恢复指定备份
```

恢复流程内置了三道保护：

| 保护 | 作用 |
|------|------|
| `gzip -t` 校验 | 压缩包损坏时直接拒绝 |
| 检查 `Dump completed` 标记 | 拒绝用半截文件恢复 —— 那会让库停在「旧数据已删、新数据没导完」的半残状态 |
| 要求输入目标库名确认 | 恢复不可撤销，不提供「恢复最新一份」这类便捷入口，防手滑 |

**恢复完成后必须做两件事**（脚本末尾也会提示）：

1. **重启后端** —— 库里数据换了，但应用内的缓存还是旧的
2. **清理 Redis** —— 登录态、字典、参数缓存与恢复后的库可能对不上

---

## 脚本里几个容易被忽略的细节

这些是「写了备份脚本」和「备份真的能用」之间的差别：

| 做法 | 不这么做的后果 |
|------|---------------|
| `--single-transaction` | 会锁表，或者拿到跨表不一致的快照 |
| `--default-character-set=utf8mb4` | 恢复后中文全乱码，**而且备份时不报任何错** |
| 导出后检查 `Dump completed` | 磁盘满 / 连接断会留下半截文件，看着有备份、恢复时才发现用不了 |
| 口令走临时 `defaults-file` | 用 `-p密码` 的话密码会出现在 `ps` 输出里，同机器任何用户可见 |
| `--routines --triggers --events` | 存储过程、触发器、定时事件丢失，恢复出来的是个残缺的库 |
| 按 `RETAIN_DAYS` 自动清理 | 磁盘写满后备份会**静默失败**，那才是真的没有备份 |
| 单独配 `JOB_DB_NAME` | 启用了 SnailJob 却只备份主库，会漏掉全部任务定义与执行记录 |

---

## 恢复演练记录模板

测评时被问「你们的备份能恢复吗」，拿得出演练记录比拿一堆备份文件有说服力得多。
建议每季度演练一次，追加到本目录的 `drill-log.md`：

```markdown
## 2026-09-04 恢复演练

- 演练人：xxx
- 备份文件：ryplus_uni_20260904_020000.sql.gz（12.3 MB）
- 恢复目标：测试库 ryplus_uni_drill（**不要直接往生产库恢复**）
- 耗时：18 秒
- 校验结果：
  - 表数量 68 张，与生产一致
  - sys_user 记录数 1245 条，与备份时点一致
  - 抽查 sys_oper_log 最新一条时间戳 = 备份时刻
- 结论：通过
```

> 演练务必恢复到**独立的测试库**。直接往生产库恢复不叫演练，叫事故。
