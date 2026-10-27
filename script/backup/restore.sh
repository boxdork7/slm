#!/usr/bin/env bash
#
# 数据库恢复脚本（等保二级 8.1.4.7 a 的「恢复」那一半）
#
# 用法：
#   ./restore.sh                                  # 列出可用备份
#   ./restore.sh ryplus_uni_20260904_030000.sql.gz  # 恢复指定备份
#   ./restore.sh xxx.sql.gz --yes                 # 跳过交互确认（仅供演练脚本调用）
#
# 🔴 恢复是覆盖性操作：目标库的现有数据会被备份文件里的内容整个替换。
#    所以这里刻意做成「必须显式指定文件名 + 二次确认」，不提供「恢复最新一份」这种便捷入口 ——
#    手滑跑一次就是生产事故。
#
# 光有 backup.sh 是过不了测评的：8.1.4.7 明确要求「备份**与恢复**功能」，
# 测评时大概率会让你现场演示恢复一次。
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${BACKUP_ENV:-$SCRIPT_DIR/backup.env}"

if [[ ! -f "$ENV_FILE" ]]; then
    echo "[错误] 找不到配置文件：$ENV_FILE" >&2
    exit 1
fi

# shellcheck source=/dev/null
source "$ENV_FILE"

DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-3306}"
DB_USERNAME="${DB_USERNAME:-root}"
BACKUP_DIR="${BACKUP_DIR:-/data/backup/ryplus}"

BACKUP_FILE="${1:-}"
ASSUME_YES="${2:-}"

# 不带参数时只列清单，不做任何有副作用的事
if [[ -z "$BACKUP_FILE" ]]; then
    echo "可用备份（目录：$BACKUP_DIR）："
    if ! ls -1t "$BACKUP_DIR"/*.sql.gz 2>/dev/null; then
        echo "  （无备份文件）"
    fi
    echo
    echo "用法：$0 <备份文件名>"
    exit 0
fi

# 支持只给文件名，也支持给全路径
if [[ ! -f "$BACKUP_FILE" ]]; then
    BACKUP_FILE="$BACKUP_DIR/$BACKUP_FILE"
fi
if [[ ! -f "$BACKUP_FILE" ]]; then
    echo "[错误] 备份文件不存在：$BACKUP_FILE" >&2
    exit 1
fi

# 恢复前先验一遍文件是不是完整的。
# 拿一个半截文件去恢复，会在导入中途失败，此时目标库处于「旧数据已删、新数据没导完」的
# 半残状态 —— 比恢复失败更糟
echo "校验备份文件完整性..."
if ! gzip -t "$BACKUP_FILE" 2>/dev/null; then
    echo "[错误] gzip 校验失败，文件已损坏：$BACKUP_FILE" >&2
    exit 1
fi
if ! zcat "$BACKUP_FILE" | tail -5 | grep -q "Dump completed"; then
    echo "[错误] 备份文件缺少 Dump completed 标记，是不完整的导出，拒绝恢复" >&2
    exit 1
fi
echo "  完整性校验通过"

# 备份文件里带了 CREATE DATABASE / USE 语句（导出时用的 --databases），
# 所以库名从文件内容里读，避免恢复到错误的库。
# 用 sed 而不是 grep -oP：-P 依赖 PCRE，在非 UTF-8 locale 下会直接报
# "grep: -P supports only unibyte and UTF-8 locales" 而拿不到库名（实测踩过）
TARGET_DB="$(zcat "$BACKUP_FILE" | sed -n 's/^USE `\([^`]*\)`.*/\1/p' | head -1)"
if [[ -z "$TARGET_DB" ]]; then
    echo "[错误] 无法从备份文件中识别目标库名" >&2
    exit 1
fi

echo
echo "============================================================"
echo "  备份文件 : $BACKUP_FILE"
echo "  文件大小 : $(du -h "$BACKUP_FILE" | cut -f1)"
echo "  备份时间 : $(date -r "$BACKUP_FILE" '+%Y-%m-%d %H:%M:%S')"
echo "  目标库   : $TARGET_DB @ $DB_HOST:$DB_PORT"
echo "============================================================"
echo "  ⚠️  该库的现有数据将被完全覆盖，且不可撤销"
echo "============================================================"
echo

if [[ "$ASSUME_YES" != "--yes" ]]; then
    read -r -p "确认恢复？请输入目标库名以继续：" CONFIRM
    if [[ "$CONFIRM" != "$TARGET_DB" ]]; then
        echo "输入不匹配，已取消"
        exit 1
    fi
fi

if [[ -z "${DB_PASSWORD:-}" ]]; then
    echo "[错误] backup.env 里没有 DB_PASSWORD" >&2
    exit 1
fi

CNF_FILE="$(mktemp)"
chmod 600 "$CNF_FILE"
trap 'rm -f "$CNF_FILE"' EXIT
cat > "$CNF_FILE" <<EOF
[client]
host=$DB_HOST
port=$DB_PORT
user=$DB_USERNAME
password=$DB_PASSWORD
default-character-set=utf8mb4
EOF

echo "开始恢复..."
START="$(date +%s)"
zcat "$BACKUP_FILE" | mysql --defaults-file="$CNF_FILE"
COST="$(( $(date +%s) - START ))"

TABLES="$(mysql --defaults-file="$CNF_FILE" -N -e \
    "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='$TARGET_DB';")"

echo
echo "[完成] 恢复耗时 ${COST}s，库 [$TARGET_DB] 现有 $TABLES 张表"
echo
echo "🔴 应用侧务必确认："
echo "   1. 重启后端 —— 恢复后数据变了，但应用与 Redis 里还留着旧数据的缓存"
echo "   2. 清理 Redis —— 登录态、字典、参数等缓存与恢复后的库可能对不上"
