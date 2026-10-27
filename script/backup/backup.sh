#!/usr/bin/env bash
#
# 数据库备份脚本（等保二级 8.1.4.7 a「重要数据的本地数据备份与恢复功能」）
#
# 用法：
#   ./backup.sh                      # 用同目录 backup.env 的配置
#   BACKUP_ENV=/path/to/env ./backup.sh
#
# 设计说明见 README.md，几个关键取舍：
#   · 独立脚本而非做进应用：应用挂掉恰恰是最需要备份的时候，
#     把备份绑在应用生命周期上等于在最关键时刻失效
#   · 导出后必须校验：mysqldump 中途失败（磁盘满、连接断）会留下一个
#     语法不完整的半截文件，看着有备份、真恢复时才发现用不了
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${BACKUP_ENV:-$SCRIPT_DIR/backup.env}"

if [[ ! -f "$ENV_FILE" ]]; then
    echo "[错误] 找不到配置文件：$ENV_FILE" >&2
    echo "       请先复制 backup.env.example 为 backup.env 并填写连接信息" >&2
    exit 1
fi

# shellcheck source=/dev/null
source "$ENV_FILE"

DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-3306}"
DB_USERNAME="${DB_USERNAME:-root}"
DB_NAME="${DB_NAME:-ryplus_uni}"
JOB_DB_NAME="${JOB_DB_NAME:-}"
BACKUP_DIR="${BACKUP_DIR:-/data/backup/ryplus}"
RETAIN_DAYS="${RETAIN_DAYS:-30}"

if [[ -z "${DB_PASSWORD:-}" ]]; then
    echo "[错误] backup.env 里没有 DB_PASSWORD" >&2
    exit 1
fi

TS="$(date '+%Y%m%d_%H%M%S')"
LOG_FILE="$BACKUP_DIR/backup.log"
mkdir -p "$BACKUP_DIR"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

# 口令通过临时 defaults 文件传给 mysqldump，不用 -p 命令行参数 ——
# 命令行上的密码会出现在 ps 输出里，同机器上任何用户都看得到
CNF_FILE="$(mktemp)"
chmod 600 "$CNF_FILE"
cleanup() { rm -f "$CNF_FILE"; }
trap cleanup EXIT

cat > "$CNF_FILE" <<EOF
[client]
host=$DB_HOST
port=$DB_PORT
user=$DB_USERNAME
password=$DB_PASSWORD
default-character-set=utf8mb4
EOF

dump_one() {
    local db="$1"
    local out="$BACKUP_DIR/${db}_${TS}.sql"

    log "开始备份数据库 [$db]"

    # --single-transaction：InnoDB 下开一个一致性快照，不锁表也不会读到跨表不一致的数据
    # --default-character-set=utf8mb4：不指定的话中文会变成乱码，而且备份时不报任何错
    # --routines/--triggers/--events：存储过程、触发器、事件也要一起带走，否则恢复出来的库是残缺的
    if ! mysqldump --defaults-file="$CNF_FILE" \
        --single-transaction \
        --default-character-set=utf8mb4 \
        --routines --triggers --events \
        --set-gtid-purged=OFF \
        --databases "$db" > "$out" 2>>"$LOG_FILE"; then
        log "[失败] mysqldump 执行出错，删除不完整文件：$out"
        rm -f "$out"
        return 1
    fi

    # 🔴 完整性校验：mysqldump 正常结束时会在文件末尾写 "Dump completed on ..."。
    # 磁盘写满、网络中断等情况下它可能已经吐出大半个文件才失败，
    # 此时文件存在且体积可观，但恢复时会在中途报语法错误 —— 只有查这一行才能识别
    if ! tail -5 "$out" | grep -q "Dump completed"; then
        log "[失败] 备份文件不完整（缺少 Dump completed 标记），删除：$out"
        rm -f "$out"
        return 1
    fi

    gzip -f "$out"
    local gz="${out}.gz"
    log "[成功] $gz（$(du -h "$gz" | cut -f1)）"
    return 0
}

FAILED=0
dump_one "$DB_NAME" || FAILED=1

# SnailJob 用的是独立库，开了定时任务却只备份主库会漏掉任务与执行记录
if [[ -n "$JOB_DB_NAME" ]]; then
    dump_one "$JOB_DB_NAME" || FAILED=1
fi

# 清理过期备份。不清理的话磁盘迟早写满，
# 而磁盘一满备份任务就会静默失败 —— 那时才是真的没有备份
if [[ "$RETAIN_DAYS" -gt 0 ]]; then
    DELETED="$(find "$BACKUP_DIR" -maxdepth 1 -name "*.sql.gz" -type f -mtime "+$RETAIN_DAYS" -print -delete | wc -l)"
    if [[ "$DELETED" -gt 0 ]]; then
        log "清理 $RETAIN_DAYS 天前的备份 $DELETED 个"
    fi
fi

REMAIN="$(find "$BACKUP_DIR" -maxdepth 1 -name '*.sql.gz' -type f | wc -l)"
log "本次结束，当前保留备份 $REMAIN 个，目录 $BACKUP_DIR"

if [[ "$FAILED" -ne 0 ]]; then
    log "[警告] 存在失败的备份任务，请检查上面的日志"
    exit 1
fi
